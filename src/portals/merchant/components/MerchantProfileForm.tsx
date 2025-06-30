
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface MerchantProfile {
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  business_description?: string;
  business_address?: string;
  avatar_url?: string;
}

interface MerchantProfileFormProps {
  profile: MerchantProfile;
  onSave: (profile: MerchantProfile) => void;
  loading?: boolean;
}

const MerchantProfileForm: React.FC<MerchantProfileFormProps> = ({ 
  profile, 
  onSave, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<MerchantProfile>(profile);

  const handleInputChange = (field: keyof MerchantProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    onSave(formData);
    toast.success('Profile updated successfully');
  };

  const handleAvatarUpload = () => {
    toast.info('Avatar upload functionality coming soon');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Merchant Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback>
              {formData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" onClick={handleAvatarUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Phone Number</Label>
            <Input
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label>Business Name</Label>
            <Input
              value={formData.business_name || ''}
              onChange={(e) => handleInputChange('business_name', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
        </div>

        {/* Business Information */}
        <div>
          <Label>Business Description</Label>
          <Textarea
            value={formData.business_description || ''}
            onChange={(e) => handleInputChange('business_description', e.target.value)}
            placeholder="Tell customers about your business..."
            rows={3}
          />
        </div>

        <div>
          <Label>Business Address</Label>
          <Textarea
            value={formData.business_address || ''}
            onChange={(e) => handleInputChange('business_address', e.target.value)}
            placeholder="Your business address"
            rows={2}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MerchantProfileForm;
