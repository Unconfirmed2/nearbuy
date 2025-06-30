
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { SocialMedia } from '../types/store';

interface SocialMediaFormProps {
  socialMedia?: SocialMedia;
  onChange: (social: SocialMedia) => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  socialMedia = {},
  onChange
}) => {
  const handleChange = (platform: keyof SocialMedia, value: string) => {
    onChange({
      ...socialMedia,
      [platform]: value
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Social Media Links</Label>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </Label>
          <Input
            id="facebook"
            type="url"
            value={socialMedia.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/your-store"
          />
        </div>
        
        <div>
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </Label>
          <Input
            id="instagram"
            type="url"
            value={socialMedia.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/your-store"
          />
        </div>
        
        <div>
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </Label>
          <Input
            id="twitter"
            type="url"
            value={socialMedia.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://twitter.com/your-store"
          />
        </div>
        
        <div>
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            type="url"
            value={socialMedia.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/your-store"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaForm;
