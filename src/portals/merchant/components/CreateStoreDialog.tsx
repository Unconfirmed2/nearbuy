
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, MapPin, Clock, Globe } from 'lucide-react';
import BusinessHoursForm, { BusinessHours } from './BusinessHoursForm';
import SocialMediaForm, { SocialMedia } from './SocialMediaForm';

interface CreateStoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (storeData: any) => void;
  loading?: boolean;
}

const CreateStoreDialog: React.FC<CreateStoreDialogProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [storeData, setStoreData] = useState({
    name: '',
    business_name: '',
    description: '',
    address: '',
    phone: '',
    contact_email: '',
    business_type: '',
    tax_id: ''
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
    sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia>({});

  const businessTypes = [
    'Retail Store',
    'Restaurant',
    'Cafe',
    'Grocery Store',
    'Pharmacy',
    'Electronics Store',
    'Clothing Store',
    'Bookstore',
    'Hardware Store',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const fullStoreData = {
      ...storeData,
      business_hours: businessHours,
      social_media: socialMedia
    };
    onSubmit(fullStoreData);
  };

  const resetForm = () => {
    setStoreData({
      name: '',
      business_name: '',
      description: '',
      address: '',
      phone: '',
      contact_email: '',
      business_type: '',
      tax_id: ''
    });
    setBusinessHours({
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
    });
    setSocialMedia({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Create New Store
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Store Name *</Label>
                <Input
                  value={storeData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="My Awesome Store"
                />
              </div>
              <div>
                <Label>Business Name</Label>
                <Input
                  value={storeData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="Official business name"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={storeData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell customers about your store..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Type</Label>
                <Select value={storeData.business_type} onValueChange={(value) => handleInputChange('business_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tax ID</Label>
                <Input
                  value={storeData.tax_id}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  placeholder="Tax identification number"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Store Address *
              </Label>
              <Textarea
                value={storeData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={storeData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={storeData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="store@example.com"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hours">
            <BusinessHoursForm 
              businessHours={businessHours} 
              onChange={setBusinessHours} 
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaForm 
              socialMedia={socialMedia} 
              onChange={setSocialMedia} 
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} disabled={loading || !storeData.name || !storeData.address}>
            {loading ? 'Creating...' : 'Create Store'}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreDialog;
