
-- Clean up existing test data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM inventory;
DELETE FROM products;
DELETE FROM stores WHERE name LIKE 'Test%' OR name LIKE '%Sample%';

-- Insert categories only if they don't exist (let database generate UUIDs)
INSERT INTO categories (name) 
VALUES ('Tops')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) 
VALUES ('Bottoms')  
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) 
VALUES ('Dresses')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) 
VALUES ('Outerwear')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) 
VALUES ('Accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert products (let database generate UUIDs)
INSERT INTO products (name, description, brand, category_id, image_url) VALUES
-- Tops
('Classic White T-Shirt', 'Essential white cotton t-shirt', 'BasicTee Co.', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Black Cotton T-Shirt', 'Comfortable black cotton tee', 'BasicTee Co.', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Gray V-Neck T-Shirt', 'Soft gray v-neck tee', 'BasicTee Co.', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Tank Top', 'Basic cotton tank top', 'Essentials', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Graphic Tee', 'Trendy graphic t-shirt', 'ArtWear', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Polo Shirt', 'Classic polo shirt', 'SportsCasual', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Henley Shirt', 'Long sleeve henley', 'CasualComfort', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Button-up Shirt', 'Classic button-up shirt', 'Professional', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Crop Top', 'Trendy crop top', 'YouthStyle', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),
('Wrap Top', 'Flattering wrap top', 'FlatterFit', (SELECT id FROM categories WHERE name = 'Tops' LIMIT 1), '/placeholder.svg'),

-- Bottoms
('Blue Denim Jeans', 'Classic blue denim jeans', 'DenimCraft', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Black Skinny Jeans', 'Fitted black denim jeans', 'DenimCraft', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Light Wash Jeans', 'Relaxed fit light wash jeans', 'DenimCraft', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('High-Waisted Shorts', 'Trendy high-waisted denim shorts', 'SummerStyle', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Wide-Leg Pants', 'Comfortable wide-leg trousers', 'ComfortFit', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Cargo Pants', 'Utility cargo pants', 'UrbanEdge', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Pencil Skirt', 'Classic pencil skirt', 'OfficeChic', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Yoga Pants', 'Stretchy yoga leggings', 'ActiveLife', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Chinos', 'Casual chino pants', 'SmartCasual', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),
('Joggers', 'Comfortable jogger pants', 'ActiveLife', (SELECT id FROM categories WHERE name = 'Bottoms' LIMIT 1), '/placeholder.svg'),

-- Dresses
('Little Black Dress', 'Classic cocktail dress', 'ElegantWear', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Summer Floral Dress', 'Light flowy summer dress', 'SummerVibes', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Midi Wrap Dress', 'Versatile wrap-style dress', 'ModernLook', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Maxi Dress', 'Flowing maxi dress', 'BohoChic', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Bodycon Dress', 'Fitted bodycon dress', 'NightOut', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Cocktail Dress', 'Elegant cocktail dress', 'PartyWear', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Sundress', 'Light summer sundress', 'SunnyDays', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Shift Dress', 'Simple shift dress', 'Minimalist', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('Tunic Dress', 'Comfortable tunic dress', 'EasyWear', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),
('A-Line Dress', 'Classic a-line dress', 'Timeless', (SELECT id FROM categories WHERE name = 'Dresses' LIMIT 1), '/placeholder.svg'),

-- Outerwear
('Gray Hoodie', 'Comfortable gray pullover hoodie', 'CozyWear', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Navy Zip Hoodie', 'Navy blue zip-up hoodie', 'CozyWear', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Oversized Sweatshirt', 'Trendy oversized sweatshirt', 'StreetStyle', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Leather Jacket', 'Classic black leather jacket', 'RockStyle', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Blazer', 'Professional blazer', 'WorkWear Pro', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Cardigan', 'Soft knit cardigan', 'CozyKnits', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Denim Jacket', 'Classic denim jacket', 'DenimCraft', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Puffer Jacket', 'Warm puffer jacket', 'WinterWear', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Windbreaker', 'Light windbreaker jacket', 'OutdoorGear', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg'),
('Bomber Jacket', 'Stylish bomber jacket', 'StreetFashion', (SELECT id FROM categories WHERE name = 'Outerwear' LIMIT 1), '/placeholder.svg');
