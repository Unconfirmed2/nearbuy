-- Clean up existing test data
DELETE FROM inventory;
DELETE FROM orders; 
DELETE FROM order_items;
DELETE FROM sponsored_items;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM products;
DELETE FROM stores;
DELETE FROM profiles WHERE role != 'admin';
DELETE FROM categories;

-- Insert clothing categories
INSERT INTO categories (id, name) VALUES 
  (gen_random_uuid(), 'Shoes'),
  (gen_random_uuid(), 'Womens Apparel'),
  (gen_random_uuid(), 'Mens Apparel'),
  (gen_random_uuid(), 'Accessories'),
  (gen_random_uuid(), 'Athletic Wear');

-- Create 5 merchant users/profiles with correct enum value
INSERT INTO profiles (id, name, email, role, verification_status, verified_at) VALUES
  (gen_random_uuid(), 'Sarah Johnson', 'sarah@example.com', 'store_owner', 'approved', now()),
  (gen_random_uuid(), 'Michael Chen', 'michael@example.com', 'store_owner', 'approved', now()),
  (gen_random_uuid(), 'Emily Rodriguez', 'emily@example.com', 'store_owner', 'approved', now()),
  (gen_random_uuid(), 'David Kim', 'david@example.com', 'store_owner', 'approved', now()),
  (gen_random_uuid(), 'Jessica Thompson', 'jessica@example.com', 'store_owner', 'approved', now());