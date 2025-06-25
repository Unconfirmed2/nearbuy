
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileProps {
  user: User;
  profile: any;
}

const Profile: React.FC<ProfileProps> = ({ user, profile }) => {
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
    </div>
  );
};

export default Profile;
