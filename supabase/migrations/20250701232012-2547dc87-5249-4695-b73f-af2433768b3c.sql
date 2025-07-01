-- Create some dummy user records first (needed for foreign keys)
-- Insert into auth.users is not allowed, so let's work with what we have

-- Let's create stores with merchant_id = owner_id to satisfy the constraint
INSERT INTO stores (id, owner_id, merchant_id, name, description, business_type, address, is_active, is_verified)
VALUES 
  -- Shoe stores (using same ID for owner and merchant)
  (gen_random_uuid(), 
   '00000000-0000-0000-0000-000000000001'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid, 
   'Elite Footwear - Chelsea', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '125 W 25th St, New York, NY 10001', true, true),
  (gen_random_uuid(), 
   '00000000-0000-0000-0000-000000000002'::uuid, 
   '00000000-0000-0000-0000-000000000002'::uuid, 
   'Shoe Palace - Flatiron', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '200 W 26th St, New York, NY 10001', true, true);

-- First, create corresponding profiles for these IDs
INSERT INTO profiles (id, name, email, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Store Owner 1', 'owner1@example.com', 'store_owner'),
  ('00000000-0000-0000-0000-000000000002', 'Store Owner 2', 'owner2@example.com', 'store_owner');