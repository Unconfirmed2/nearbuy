import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  userEmail
}) => {
  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetDialog = () => {
    setStep(1);
    setConfirmationText('');
    setPassword('');
    setConfirmChecked(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE' || !password || !confirmChecked) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);

    try {
      // First, verify the password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password
      });

      if (signInError) {
        toast.error('Invalid password. Please try again.');
        setLoading(false);
        return;
      }

      // Delete user data using our custom function
      const { error: deleteError } = await supabase.rpc('delete_user_account');

      if (deleteError) {
        throw new Error('Failed to delete account data: ' + deleteError.message);
      }

      // Sign out the user
      await supabase.auth.signOut();
      
      toast.success('Account deleted successfully');
      navigate('/');
      
    } catch (error) {
      const err = error as Error;
      console.error('Delete account error:', err);
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">What will be deleted:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Your user profile and account information</li>
                <li>• All stores and business data (for merchants)</li>
                <li>• Product listings and inventory</li>
                <li>• Order history and transaction records</li>
                <li>• Reviews and ratings</li>
                <li>• All uploaded files and images</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600">
              Are you sure you want to continue? This action is irreversible.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Type "DELETE" to confirm</Label>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE here"
                className="font-mono"
              />
            </div>

            <div>
              <Label>Enter your password to confirm</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm-delete"
                checked={confirmChecked}
                onCheckedChange={(checked) => setConfirmChecked(checked === true)}
              />
              <Label
                htmlFor="confirm-delete"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I understand this action is permanent and cannot be undone
              </Label>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          {step === 1 ? (
            <>
              <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <AlertDialogCancel onClick={() => setStep(1)}>Back</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={confirmationText !== 'DELETE' || !password || !confirmChecked || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  'Deleting...'
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;