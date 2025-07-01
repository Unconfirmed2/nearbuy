
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

interface ProfileProps {
  user: User;
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ user, profile }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg">{profile?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Role</label>
            <p className="text-lg capitalize">{profile?.role}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              size="sm"
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
        userEmail={user.email || ''}
      />
    </div>
  );
};

export default Profile;
