-- First clean up existing test data and start fresh
DELETE FROM inventory;
DELETE FROM orders;
DELETE FROM order_items;
DELETE FROM sponsored_items;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM products;
DELETE FROM stores;
DELETE FROM profiles WHERE role != 'admin';

-- Clean up existing categories if they exist
DELETE FROM categories;

-- Insert clothing categories
INSERT INTO categories (id, name) VALUES 
  (gen_random_uuid(), 'Shoes'),
  (gen_random_uuid(), 'Womens Apparel'),
  (gen_random_uuid(), 'Mens Apparel'),
  (gen_random_uuid(), 'Accessories'),
  (gen_random_uuid(), 'Athletic Wear');

-- Create 5 merchant users/profiles
WITH merchant_data AS (
  SELECT 
    gen_random_uuid() as user_id,
    unnest(ARRAY['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Thompson']) as name,
    unnest(ARRAY['sarah@example.com', 'michael@example.com', 'emily@example.com', 'david@example.com', 'jessica@example.com']) as email
)
INSERT INTO profiles (id, name, email, role, verification_status, verified_at)
SELECT user_id, name, email, 'store_owner', 'verified', now()
FROM merchant_data;

-- Create 25 stores (5 per merchant) in Chelsea NYC area
WITH merchants AS (
  SELECT id, name FROM profiles WHERE role = 'store_owner'
),
store_data AS (
  SELECT 
    m.id as merchant_id,
    m.name as merchant_name,
    store_types.name as store_name,
    store_types.description,
    store_types.business_type,
    addresses.address,
    ROW_NUMBER() OVER (PARTITION BY m.id ORDER BY store_types.name) as store_num
  FROM merchants m
  CROSS JOIN (
    VALUES 
      ('Elite Footwear', 'Premium designer shoes and sneakers for all occasions', 'shoe_store'),
      ('Urban Threads', 'Contemporary fashion for the modern woman', 'womens_apparel'),
      ('Gentleman''s Corner', 'Classic menswear and formal attire', 'mens_apparel'),
      ('Accessory Vault', 'Luxury handbags, jewelry and accessories', 'accessories'),
      ('FitGear Pro', 'High-performance athletic wear and equipment', 'athletic_wear')
  ) as store_types(name, description, business_type)
  CROSS JOIN (
    VALUES 
      ('125 W 25th St, New York, NY 10001'),
      ('200 W 26th St, New York, NY 10001'),
      ('315 W 23rd St, New York, NY 10011'),
      ('450 W 24th St, New York, NY 10011'),
      ('180 W 20th St, New York, NY 10011'),
      ('275 W 22nd St, New York, NY 10011'),
      ('125 W 21st St, New York, NY 10010'),
      ('350 W 19th St, New York, NY 10010'),
      ('225 W 18th St, New York, NY 10010'),
      ('400 W 17th St, New York, NY 10010'),
      ('150 W 16th St, New York, NY 10014'),
      ('300 W 15th St, New York, NY 10014'),
      ('175 W 14th St, New York, NY 10014'),
      ('425 W 13th St, New York, NY 10014'),
      ('250 W 12th St, New York, NY 10014'),
      ('320 W 27th St, New York, NY 10001'),
      ('140 W 28th St, New York, NY 10001'),
      ('380 W 25th St, New York, NY 10001'),
      ('160 W 29th St, New York, NY 10001'),
      ('290 W 30th St, New York, NY 10001'),
      ('370 W 11th St, New York, NY 10014'),
      ('185 W 10th St, New York, NY 10014'),
      ('295 W 9th St, New York, NY 10014'),
      ('165 W 8th St, New York, NY 10014'),
      ('385 W 7th St, New York, NY 10014')
  ) as addresses(address)
  WHERE store_types.name IS NOT NULL
)
INSERT INTO stores (
  id, owner_id, merchant_id, name, description, business_type, 
  address, is_active, is_verified, verification_status, verified_at
)
SELECT 
  gen_random_uuid(),
  sd.merchant_id,
  sd.merchant_id,
  sd.store_name || ' - ' || sd.merchant_name,
  sd.description,
  sd.business_type,
  sd.address,
  true,
  true,
  'verified',
  now()
FROM store_data sd
WHERE sd.store_num <= 5;