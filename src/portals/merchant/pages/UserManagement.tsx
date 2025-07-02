import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Users, Mail, Trash2, Edit, Shield, UserX, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';
import { useUserManagement } from '../hooks/useUserManagement';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'store_user',
    stores: [] as string[]
  });

  const { user } = useAuth();
  const { stores } = useStores(user?.id);
  const { 
    users, 
    invitations, 
    loading, 
    sendInvitation, 
    removeUser, 
    updateUserPermissions,
    cancelInvitation
  } = useUserManagement(user?.id || '');

  const handleAddUser = async () => {
    if (!newUser.email || (newUser.role !== 'super_merchant' && newUser.stores.length === 0)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await sendInvitation(
      newUser.email,
      newUser.role,
      newUser.stores,
      (user as any)?.name || user?.email || 'Team Admin',
      'Your Organization' // You could make this dynamic
    );

    if (success) {
      setShowAddUser(false);
      setNewUser({ email: '', name: '', role: 'store_user', stores: [] });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    await updateUserPermissions(
      selectedUser.id,
      selectedUser.user_role,
      selectedUser.store_permissions?.map((p: any) => p.store_id) || []
    );

    setShowEditUser(false);
    setSelectedUser(null);
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;

    await removeUser(selectedUser.id);
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'super_merchant': return 'bg-purple-100 text-purple-800';
      case 'merchant': return 'bg-blue-100 text-blue-800';
      case 'store_user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'super_merchant': return 'Super Merchant';
      case 'merchant': return 'Merchant';
      case 'store_user': return 'Store User';
      default: return role;
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser({
      ...user,
      user_role: user.user_role,
      store_permissions: user.store_permissions || []
    });
    setShowEditUser(true);
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
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

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">
            Pending Invitations
            {invitations.length > 0 && (
              <Badge className="ml-2" variant="secondary">{invitations.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
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
              {users.map(teamUser => (
                <Card key={teamUser.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{teamUser.name || teamUser.email}</CardTitle>
                        <p className="text-sm text-gray-600">{teamUser.email}</p>
                      </div>
                      <Badge className={getRoleBadgeColor(teamUser.user_role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {getRoleLabel(teamUser.user_role)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Store Access</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {teamUser.all_stores_access ? (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            All Stores
                          </Badge>
                        ) : teamUser.store_permissions?.length ? (
                          teamUser.store_permissions.map(permission => (
                            <Badge key={permission.store_id} variant="outline" className="text-xs">
                              {permission.store_name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No store access</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openEditDialog(teamUser)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openDeleteDialog(teamUser)}
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
        </TabsContent>

        <TabsContent value="invitations">
          {invitations.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                <p className="text-gray-600">
                  All invitations have been accepted or expired
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {invitations.map(invitation => (
                <Card key={invitation.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-gray-600">
                            Role: {getRoleLabel(invitation.role)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
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
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value, stores: value === 'super_merchant' ? [] : prev.stores }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store_user">Store User - Access to specific stores</SelectItem>
                  <SelectItem value="super_merchant">Super Merchant - Access to all stores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newUser.role !== 'super_merchant' && (
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
            )}

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

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit User Permissions
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>

              <div>
                <Label>Role</Label>
                <Select 
                  value={selectedUser.user_role} 
                  onValueChange={(value) => setSelectedUser(prev => ({ 
                    ...prev, 
                    user_role: value,
                    all_stores_access: value === 'super_merchant'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store_user">Store User</SelectItem>
                    <SelectItem value="super_merchant">Super Merchant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedUser.user_role !== 'super_merchant' && (
                <div>
                  <Label>Store Access</Label>
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {stores.map(store => {
                      const hasAccess = selectedUser.store_permissions?.some((p: any) => p.store_id === store.id) || false;
                      return (
                        <label key={store.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={hasAccess}
                            onChange={(e) => {
                              const currentPermissions = selectedUser.store_permissions || [];
                              if (e.target.checked) {
                                setSelectedUser(prev => ({ 
                                  ...prev, 
                                  store_permissions: [...currentPermissions, { store_id: store.id, store_name: store.name }]
                                }));
                              } else {
                                setSelectedUser(prev => ({ 
                                  ...prev, 
                                  store_permissions: currentPermissions.filter((p: any) => p.store_id !== store.id)
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{store.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleEditUser} className="flex-1">
                  Update Permissions
                </Button>
                <Button variant="outline" onClick={() => setShowEditUser(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Remove User Access
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedUser?.name || selectedUser?.email} from your team? 
              This will revoke their access to all stores and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;