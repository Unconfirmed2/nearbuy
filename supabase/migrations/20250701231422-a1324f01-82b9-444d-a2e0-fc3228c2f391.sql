-- Clean up existing test data  
DELETE FROM inventory;
DELETE FROM orders;
DELETE FROM order_items; 
DELETE FROM sponsored_items;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM products;
DELETE FROM stores; 
DELETE FROM categories;

-- Insert clothing categories
INSERT INTO categories (id, name) VALUES 
  (gen_random_uuid(), 'Shoes'),
  (gen_random_uuid(), 'Womens Apparel'), 
  (gen_random_uuid(), 'Mens Apparel'),
  (gen_random_uuid(), 'Accessories'),
  (gen_random_uuid(), 'Athletic Wear');

-- Create products for each category (20 per category = 100 total)
-- Shoes
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  (SELECT id FROM categories WHERE name = 'Shoes'),
  image_url
FROM (VALUES
  ('Nike Air Max 270', 'Comfortable running shoes with air cushioning', 'Nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('Adidas Ultraboost 22', 'Premium running shoes with boost technology', 'Adidas', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'),
  ('Converse Chuck Taylor', 'Classic canvas high-top sneakers', 'Converse', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400'),
  ('Vans Old Skool', 'Iconic skate shoes with side stripe', 'Vans', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'),
  ('Dr. Martens 1460', 'Classic leather boots with air-cushioned sole', 'Dr. Martens', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'),
  ('Timberland 6-Inch Boot', 'Waterproof leather work boots', 'Timberland', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'),
  ('New Balance 990v5', 'Made in USA running shoes', 'New Balance', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'),
  ('Jordan 1 Retro High', 'Iconic basketball shoes', 'Jordan', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400'),
  ('Puma Suede Classic', 'Retro suede sneakers', 'Puma', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'),
  ('Reebok Classic Leather', 'Vintage leather sneakers', 'Reebok', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'),
  ('Allbirds Tree Runners', 'Sustainable running shoes', 'Allbirds', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'),
  ('Cole Haan Oxford', 'Leather dress shoes', 'Cole Haan', 'https://images.unsplash.com/photo-1529339944280-1a37d838fd85?w=400'),
  ('Louboutin Heels', 'Designer red-sole heels', 'Christian Louboutin', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'),
  ('UGG Classic Short', 'Sheepskin boots', 'UGG', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400'),
  ('Birkenstock Arizona', 'Cork footbed sandals', 'Birkenstock', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Toms Alpargata', 'Canvas slip-on shoes', 'Toms', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'),
  ('Sperry Top-Sider', 'Boat shoes', 'Sperry', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'),
  ('Clarks Desert Boot', 'Suede chukka boots', 'Clarks', 'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=400'),
  ('Steve Madden Pumps', 'Trendy fashion heels', 'Steve Madden', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'),
  ('Sketchers Go Walk', 'Comfortable walking shoes', 'Sketchers', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400')
) AS product_data(product_name, description, brand, image_url);