
export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  contact_phone?: string;
  contact_email?: string;
  status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
  is_verified: boolean;
  is_active: boolean; // Added this missing property
  business_hours?: BusinessHours;
  social_media?: SocialMedia;
  merchant_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "17:00"
  closed?: boolean;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface CreateStoreData {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  business_hours?: BusinessHours;
  social_media?: SocialMedia;
}
