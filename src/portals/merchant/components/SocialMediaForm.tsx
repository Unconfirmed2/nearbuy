
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { SocialMedia } from '../types/store';

interface SocialMediaFormProps {
  socialMedia: SocialMedia;
  website: string;
  onSocialMediaChange: (social: SocialMedia) => void;
  onWebsiteChange: (website: string) => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  socialMedia,
  website,
  onSocialMediaChange,
  onWebsiteChange
}) => {
  const handleSocialChange = (platform: keyof SocialMedia, value: string) => {
    onSocialMediaChange({
      ...socialMedia,
      [platform]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Add your website and social media links to help customers find you online.
      </div>

      <div>
        <Label htmlFor="website" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => onWebsiteChange(e.target.value)}
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <Label htmlFor="facebook" className="flex items-center gap-2">
          <Facebook className="w-4 h-4" />
          Facebook
        </Label>
        <Input
          id="facebook"
          type="url"
          value={socialMedia.facebook || ''}
          onChange={(e) => handleSocialChange('facebook', e.target.value)}
          placeholder="https://facebook.com/your-page"
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
          onChange={(e) => handleSocialChange('instagram', e.target.value)}
          placeholder="https://instagram.com/your-account"
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
          onChange={(e) => handleSocialChange('twitter', e.target.value)}
          placeholder="https://twitter.com/your-account"
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
          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/company/your-company"
        />
      </div>
    </div>
  );
};

export default SocialMediaForm;
