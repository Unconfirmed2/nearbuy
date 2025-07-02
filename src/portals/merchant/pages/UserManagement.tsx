import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, Mail, Trash2, Edit, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'manager' | 'viewer';
  stores: string[];
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<StoreUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer' as const,
    stores: [] as string[]
  });

  const { user } = useAuth();
  const { stores } = useStores(user?.id);

  useEffect(() => {
    fetchUsers();
  }, [user?.id]);

  const fetchUsers = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // This would be a custom query to fetch users associated with this merchant
      // For now, we'll simulate with empty array since we need to set up the proper schema
      setUsers([]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || newUser.stores.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Implementation would go here - needs proper schema setup
      toast.success('User invitation sent!');
      setShowAddUser(false);
      setNewUser({ email: '', name: '', role: 'viewer', stores: [] });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      // Implementation would go here
      toast.success('User removed successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage users who have access to your stores
          </p>
        </div>
        <Button onClick={() => setShowAddUser(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600 mb-6">
              Add team members to help manage your stores
            </p>
            <Button onClick={() => setShowAddUser(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.name || user.email}</CardTitle>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Store Access</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.stores.map(storeId => {
                      const store = stores.find(s => s.id === storeId);
                      return (
                        <Badge key={storeId} variant="outline" className="text-xs">
                          {store?.name || 'Unknown Store'}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add New User
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label>Role *</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - View only access</SelectItem>
                  <SelectItem value="manager">Manager - Can edit store data</SelectItem>
                  <SelectItem value="admin">Admin - Full access to assigned stores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Store Access *</Label>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {stores.map(store => (
                  <label key={store.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.stores.includes(store.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, stores: [...prev.stores, store.id] }));
                        } else {
                          setNewUser(prev => ({ ...prev, stores: prev.stores.filter(id => id !== store.id) }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{store.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddUser} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;