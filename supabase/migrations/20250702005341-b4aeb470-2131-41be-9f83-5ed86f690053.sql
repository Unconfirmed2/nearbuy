-- Update stores table to auto-approve new stores
UPDATE stores 
SET verification_status = 'approved', 
    is_verified = true, 
    verified_at = now()
WHERE verification_status = 'pending';

-- Create a function to auto-approve stores on creation
CREATE OR REPLACE FUNCTION auto_approve_new_stores()
RETURNS TRIGGER AS $$
BEGIN
    NEW.verification_status = 'approved';
    NEW.is_verified = true;
    NEW.verified_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-approve stores
DROP TRIGGER IF EXISTS auto_approve_stores_trigger ON stores;
CREATE TRIGGER auto_approve_stores_trigger
    BEFORE INSERT ON stores
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_new_stores();

-- Create coupons table for store-level coupon management
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(store_id, code)
);

-- Enable RLS on coupons table
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coupons
CREATE POLICY "Store owners can manage their coupons" ON coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = coupons.store_id 
            AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Public can view active coupons" ON coupons
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Create function to prevent duplicate stores by name and address
CREATE OR REPLACE FUNCTION check_duplicate_store()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if a store with same name and similar address already exists for this merchant
    IF EXISTS (
        SELECT 1 FROM stores 
        WHERE merchant_id = NEW.merchant_id 
        AND name = NEW.name 
        AND address = NEW.address
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
        -- Update existing store instead of creating new one
        UPDATE stores 
        SET 
            description = COALESCE(NEW.description, description),
            business_name = COALESCE(NEW.business_name, business_name),
            business_type = COALESCE(NEW.business_type, business_type),
            contact_phone = COALESCE(NEW.contact_phone, contact_phone),
            contact_email = COALESCE(NEW.contact_email, contact_email),
            phone = COALESCE(NEW.phone, phone),
            tax_id = COALESCE(NEW.tax_id, tax_id),
            updated_at = now()
        WHERE merchant_id = NEW.merchant_id 
        AND name = NEW.name 
        AND address = NEW.address;
        
        -- Return NULL to prevent the insert
        RETURN NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for duplicate stores
DROP TRIGGER IF EXISTS check_duplicate_store_trigger ON stores;
CREATE TRIGGER check_duplicate_store_trigger
    BEFORE INSERT ON stores
    FOR EACH ROW
    EXECUTE FUNCTION check_duplicate_store();