
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Smartphone, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

interface SecuritySettingsProps {
  merchantId: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ merchantId }) => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Implement actual password change via Supabase
    // Example using Supabase JS client:
    // You may need to adjust this based on your auth setup
    import('@/integrations/supabase/client').then(async ({ supabase }) => {
      // Re-authenticate user before allowing password change
      const email = user?.email;
      if (!email) {
        toast.error('User email not found. Please re-login.');
        return;
      }
      // Sign in to verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: passwordData.currentPassword
      });
      if (signInError) {
        toast.error('Current password is incorrect.');
        return;
      }
      // Now update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (error) {
        toast.error(error.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
      }
    });
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      toast.info('2FA setup: Scan QR code with your authenticator app');
    } else {
      toast.success('Two-factor authentication disabled');
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires contacting support');
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
            {twoFactorEnabled && <Badge className="bg-green-100 text-green-800">Enabled</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Add an extra layer of security to your account by requiring a code from your phone.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <span className="text-sm">Authenticator App</span>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
          {twoFactorEnabled && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                Two-factor authentication is active. Use your authenticator app to generate codes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordChange ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Keep your account secure with a strong password.
              </p>
              <Button variant="outline" onClick={() => setShowPasswordChange(true)}>
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={
                    !passwordsMatch && passwordData.confirmPassword
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                {!passwordsMatch && passwordData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} disabled={!passwordsMatch}>Update Password</Button>
                <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. All your stores, products, orders, and business data will be permanently deleted.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userEmail={user?.email || ''}
      />
    </div>
  );
};

export default SecuritySettings;
