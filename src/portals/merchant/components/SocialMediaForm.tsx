
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Facebook, Instagram, Twitter, Linkedin, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface SocialMedia {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface SocialMediaFormProps {
  socialMedia?: SocialMedia;
  onChange?: (social: SocialMedia) => void;
  onSave?: (social: SocialMedia) => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ 
  socialMedia: externalSocial, 
  onChange,
  onSave 
}) => {
  const [social, setSocial] = useState<SocialMedia>(externalSocial || {});

  const socialFields = [
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/youraccount' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/youraccount' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' }
  ];

  const handleChange = (field: keyof SocialMedia, value: string) => {
    const updatedSocial = { ...social, [field]: value };
    setSocial(updatedSocial);
    onChange?.(updatedSocial);
  };

  const handleSave = () => {
    onSave?.(social);
    toast.success('Social media links updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Social Media & Website
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key}>
            <Label className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" />
              {label}
            </Label>
            <Input
              type="url"
              placeholder={placeholder}
              value={social[key as keyof SocialMedia] || ''}
              onChange={(e) => handleChange(key as keyof SocialMedia, e.target.value)}
            />
          </div>
        ))}

        {onSave && (
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Social Media Links
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaForm;
