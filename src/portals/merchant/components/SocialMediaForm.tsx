
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Twitter, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SocialMediaLinks {
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

interface SocialMediaFormProps {
  storeId?: string;
  initialLinks?: SocialMediaLinks;
  socialMedia?: any;
  onChange?: (social: any) => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ 
  storeId, 
  initialLinks,
  socialMedia: externalSocialMedia,
  onChange
}) => {
  const [links, setLinks] = useState<SocialMediaLinks>(
    initialLinks || externalSocialMedia || {
      website: '',
      facebook: '',
      instagram: '',
      twitter: ''
    }
  );

  const updateLink = (platform: keyof SocialMediaLinks, value: string) => {
    const newLinks = { ...links, [platform]: value };
    setLinks(newLinks);
    
    if (onChange) {
      onChange(newLinks);
    }
  };

  const handleSave = () => {
    console.log('Saving social media links:', links);
    toast.success('Social media links updated successfully');
  };

  const socialPlatforms = [
    {
      key: 'website' as keyof SocialMediaLinks,
      label: 'Website',
      icon: Globe,
      placeholder: 'https://yourbusiness.com'
    },
    {
      key: 'facebook' as keyof SocialMediaLinks,
      label: 'Facebook',
      icon: Facebook,
      placeholder: 'https://facebook.com/yourbusiness'
    },
    {
      key: 'instagram' as keyof SocialMediaLinks,
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourbusiness'
    },
    {
      key: 'twitter' as keyof SocialMediaLinks,
      label: 'Twitter',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourbusiness'
    }
  ];

  // If this is being used as a controlled component, don't show the card wrapper
  if (onChange && externalSocialMedia) {
    return (
      <div className="space-y-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {platform.label}
              </Label>
              <Input
                type="url"
                value={links[platform.key]}
                onChange={(e) => updateLink(platform.key, e.target.value)}
                placeholder={platform.placeholder}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media & Website</CardTitle>
        <p className="text-sm text-gray-600">
          Add your social media profiles and website to help customers find you online
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {platform.label}
              </Label>
              <Input
                type="url"
                value={links[platform.key]}
                onChange={(e) => updateLink(platform.key, e.target.value)}
                placeholder={platform.placeholder}
              />
            </div>
          );
        })}

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Social Media Links
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialMediaForm;
