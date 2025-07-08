import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import LocationAutocompleteInput from "@/components/LocationAutocompleteInput";

interface Address {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      address: '123 Main St, City, State 12345',
      isDefault: true
    },
    {
      id: '2',
      name: 'Work',
      address: '456 Office Blvd, City, State 12345',
      isDefault: false
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const handleAddAddress = () => {
    if (!formData.name || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddress]);
    setFormData({ name: '', address: '' });
    setShowAddDialog(false);
    toast.success('Address added successfully');
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({ name: address.name, address: address.address });
    setShowAddDialog(true);
  };

  const handleUpdateAddress = () => {
    if (!editingAddress || !formData.name || !formData.address) return;

    setAddresses(addresses.map(addr => 
      addr.id === editingAddress.id 
        ? { ...addr, name: formData.name, address: formData.address }
        : addr
    ));
    
    setEditingAddress(null);
    setFormData({ name: '', address: '' });
    setShowAddDialog(false);
    toast.success('Address updated successfully');
  };

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // Set another address as default
      const remainingAddresses = addresses.filter(addr => addr.id !== id);
      remainingAddresses[0].isDefault = true;
      setAddresses(remainingAddresses);
    } else {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
    toast.success('Address deleted successfully');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success('Default address updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAddress(null);
              setFormData({ name: '', address: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your saved address information.' : 'Add a new address to your saved addresses.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Address Name</Label>
                <Select value={formData.name} onValueChange={(value) => setFormData({...formData, name: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose or type custom name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formData.name === 'Other' && (
                  <Input
                    placeholder="Enter custom name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-2"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="address">Full Address</Label>
                <LocationAutocompleteInput
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={formData.address}
                  onChange={val => setFormData({...formData, address: val})}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                className="w-full"
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{address.name}</h3>
                      {address.isDefault && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{address.address}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={addresses.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {addresses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-4">
                Add your first address to make ordering faster
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Addresses;
