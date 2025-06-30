
-- First, let's clean up any stores with invalid owner_ids
DELETE FROM public.stores 
WHERE owner_id NOT IN (SELECT id FROM public.profiles)
   OR owner_id IS NULL;

-- Create verification status enum
DO $$ BEGIN
    CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create document types enum for verification
DO $$ BEGIN
    CREATE TYPE public.document_type AS ENUM ('business_license', 'tax_id', 'identity', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add verification fields to profiles table
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN verification_status verification_status DEFAULT 'pending';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN verification_notes TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add merchant_id to stores table (nullable first)
DO $$ BEGIN
    ALTER TABLE public.stores ADD COLUMN merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Update existing stores to use owner_id as merchant_id where possible
UPDATE public.stores 
SET merchant_id = owner_id 
WHERE merchant_id IS NULL 
  AND owner_id IS NOT NULL
  AND owner_id IN (SELECT id FROM public.profiles);

-- Now make merchant_id required
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'merchant_id' AND table_schema = 'public') 
       AND NOT EXISTS (SELECT 1 FROM public.stores WHERE merchant_id IS NULL) THEN
        ALTER TABLE public.stores ALTER COLUMN merchant_id SET NOT NULL;
    END IF;
END $$;

-- Add store verification status
DO $$ BEGIN
    ALTER TABLE public.stores ADD COLUMN verification_status verification_status DEFAULT 'pending';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.stores ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create merchant_documents table for merchant verification
CREATE TABLE IF NOT EXISTS public.merchant_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  verification_notes TEXT
);

-- Enable RLS on merchant_documents
ALTER TABLE public.merchant_documents ENABLE ROW LEVEL SECURITY;

-- Policies for merchant_documents
CREATE POLICY "Merchants can view their own documents" ON public.merchant_documents
  FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can upload their own documents" ON public.merchant_documents
  FOR INSERT WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Admins can view all documents" ON public.merchant_documents
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update document verification" ON public.merchant_documents
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Update store policies to use merchant_id
DROP POLICY IF EXISTS "Store owners can manage their stores" ON public.stores;
DROP POLICY IF EXISTS "Merchants can manage their stores" ON public.stores;
CREATE POLICY "Merchants can manage their stores" ON public.stores
  FOR ALL USING (auth.uid() = merchant_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_merchant_documents_merchant ON public.merchant_documents (merchant_id);
CREATE INDEX IF NOT EXISTS idx_stores_merchant ON public.stores (merchant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles (verification_status);
