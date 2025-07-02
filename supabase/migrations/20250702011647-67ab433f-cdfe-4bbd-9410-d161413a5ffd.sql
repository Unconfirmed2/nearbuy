-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'merchant', 'super_merchant', 'store_user');

-- Create invitations table for managing user invites
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id),
  merchant_id UUID REFERENCES users(id),
  store_ids UUID[] DEFAULT '{}',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_store_permissions table for granular store access
CREATE TABLE public.user_store_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES users(id),
  granted_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, store_id)
);

-- Create email_logs table for tracking emails
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add role column to users table
ALTER TABLE public.users ADD COLUMN user_role user_role DEFAULT 'customer';

-- Add merchant_id to users table for hierarchy
ALTER TABLE public.users ADD COLUMN merchant_id UUID REFERENCES users(id);

-- Add all_stores_access flag for super merchants
ALTER TABLE public.users ADD COLUMN all_stores_access BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_store_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
CREATE POLICY "Merchants can manage their invitations" ON public.invitations
FOR ALL USING (
  auth.uid() = invited_by OR 
  auth.uid() = merchant_id OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_role = 'admin')
);

CREATE POLICY "Users can view their own invitations" ON public.invitations
FOR SELECT USING (email = (SELECT email FROM users WHERE id = auth.uid()));

-- RLS Policies for user_store_permissions
CREATE POLICY "Merchants can manage store permissions" ON public.user_store_permissions
FOR ALL USING (
  auth.uid() = merchant_id OR
  auth.uid() = granted_by OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_role = 'admin')
);

CREATE POLICY "Users can view their own permissions" ON public.user_store_permissions
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for email_logs
CREATE POLICY "Admins can view all email logs" ON public.email_logs
FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_role = 'admin'));

-- Function to check if user has access to store
CREATE OR REPLACE FUNCTION public.user_has_store_access(user_id UUID, store_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin
  IF EXISTS (SELECT 1 FROM users WHERE id = user_id AND user_role = 'admin') THEN
    RETURN true;
  END IF;
  
  -- Check if user owns the store
  IF EXISTS (SELECT 1 FROM stores WHERE id = store_id AND owner_id = user_id) THEN
    RETURN true;
  END IF;
  
  -- Check if user has all stores access
  IF EXISTS (SELECT 1 FROM users WHERE id = user_id AND all_stores_access = true) THEN
    RETURN true;
  END IF;
  
  -- Check specific store permissions
  IF EXISTS (SELECT 1 FROM user_store_permissions WHERE user_id = user_id AND store_id = store_id) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate invitation token
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record 
  FROM invitations 
  WHERE token = invitation_token 
  AND expires_at > now() 
  AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Update user role and merchant_id
  UPDATE users 
  SET 
    user_role = invitation_record.role,
    merchant_id = invitation_record.merchant_id,
    all_stores_access = CASE 
      WHEN invitation_record.role = 'super_merchant' THEN true 
      ELSE false 
    END
  WHERE id = user_id;
  
  -- Add store permissions if specific stores were assigned
  IF array_length(invitation_record.store_ids, 1) > 0 THEN
    INSERT INTO user_store_permissions (user_id, store_id, merchant_id, granted_by)
    SELECT 
      user_id, 
      unnest(invitation_record.store_ids), 
      invitation_record.merchant_id,
      invitation_record.invited_by;
  END IF;
  
  -- Mark invitation as accepted
  UPDATE invitations 
  SET accepted_at = now() 
  WHERE id = invitation_record.id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update stores RLS to respect user permissions
DROP POLICY IF EXISTS "stores_select_owner" ON stores;
CREATE POLICY "stores_select_accessible" ON stores
FOR SELECT USING (
  -- Public can view verified stores
  (is_verified = true) OR
  -- Owner can view their stores
  (auth.uid() = owner_id) OR
  -- Merchant can view their stores
  (auth.uid() = merchant_id) OR
  -- Admin can view all stores
  (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_role = 'admin')) OR
  -- User has specific permission to this store
  (public.user_has_store_access(auth.uid(), id))
);

-- Update inventory RLS to respect user permissions
DROP POLICY IF EXISTS "inventory_public_select" ON inventory;
CREATE POLICY "inventory_select_accessible" ON inventory
FOR SELECT USING (
  -- Public can view inventory OR user has store access
  true OR public.user_has_store_access(auth.uid(), store_id)
);

-- Update orders RLS to respect user permissions
CREATE POLICY "orders_store_access" ON orders
FOR SELECT USING (
  -- Users can view their own orders
  (auth.uid() = user_id) OR
  -- Store accessible users can view store orders
  (public.user_has_store_access(auth.uid(), store_id))
);

-- Create indexes for performance
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_user_store_permissions_user_store ON user_store_permissions(user_id, store_id);
CREATE INDEX idx_users_role ON users(user_role);
CREATE INDEX idx_email_logs_type_status ON email_logs(email_type, status);