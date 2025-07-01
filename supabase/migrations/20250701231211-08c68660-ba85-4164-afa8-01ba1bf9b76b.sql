-- First, let's add proper inventory relationship and clean up existing data
-- Remove any existing test/demo data
DELETE FROM inventory;
DELETE FROM orders;
DELETE FROM order_items;
DELETE FROM sponsored_items;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM products;
DELETE FROM stores;
DELETE FROM profiles WHERE role != 'admin';

-- Insert clothing categories first
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

-- Create 25 stores (5 per merchant) in Chelsea NYC area zip codes: 10001, 10011, 10010, 10014
WITH merchants AS (
  SELECT id, name FROM profiles WHERE role = 'store_owner'
),
store_data AS (
  SELECT 
    m.id as merchant_id,
    m.name as merchant_name,
    store_names.name as store_name,
    store_names.description,
    store_names.business_type,
    addresses.address,
    ROW_NUMBER() OVER (PARTITION BY m.id ORDER BY store_names.name) as store_num
  FROM merchants m
  CROSS JOIN (
    VALUES 
      ('Elite Footwear', 'Premium designer shoes and sneakers for all occasions', 'shoe_store'),
      ('Urban Threads', 'Contemporary fashion for the modern woman', 'womens_apparel'),
      ('Gentleman''s Corner', 'Classic menswear and formal attire', 'mens_apparel'),
      ('Accessory Vault', 'Luxury handbags, jewelry and accessories', 'accessories'),
      ('FitGear Pro', 'High-performance athletic wear and equipment', 'athletic_wear')
  ) as store_names(name, description, business_type)
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
  WHERE store_names.name IS NOT NULL
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

-- Create clothing products (500 total: 20 per store type, shared across similar stores)
WITH product_data AS (
  SELECT 
    category_id,
    category_name,
    product_name,
    description,
    brand,
    image_url
  FROM (
    SELECT 
      c.id as category_id,
      c.name as category_name,
      products.name as product_name,
      products.description,
      products.brand,
      products.image_url
    FROM categories c
    CROSS JOIN (
      -- Shoes
      SELECT 'Nike Air Max 270' as name, 'Comfortable running shoes with air cushioning' as description, 'Nike' as brand, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' as image_url WHERE c.name = 'Shoes'
      UNION ALL SELECT 'Adidas Ultraboost 22', 'Premium running shoes with boost technology', 'Adidas', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
      UNION ALL SELECT 'Converse Chuck Taylor', 'Classic canvas high-top sneakers', 'Converse', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400'
      UNION ALL SELECT 'Vans Old Skool', 'Iconic skate shoes with side stripe', 'Vans', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'
      UNION ALL SELECT 'Dr. Martens 1460', 'Classic leather boots with air-cushioned sole', 'Dr. Martens', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'
      UNION ALL SELECT 'Timberland 6-Inch Boot', 'Waterproof leather work boots', 'Timberland', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'
      UNION ALL SELECT 'New Balance 990v5', 'Made in USA running shoes', 'New Balance', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
      UNION ALL SELECT 'Jordan 1 Retro High', 'Iconic basketball shoes', 'Jordan', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400'
      UNION ALL SELECT 'Puma Suede Classic', 'Retro suede sneakers', 'Puma', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
      UNION ALL SELECT 'Reebok Classic Leather', 'Vintage leather sneakers', 'Reebok', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'
      UNION ALL SELECT 'Allbirds Tree Runners', 'Sustainable running shoes', 'Allbirds', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
      UNION ALL SELECT 'Cole Haan Oxford', 'Leather dress shoes', 'Cole Haan', 'https://images.unsplash.com/photo-1529339944280-1a37d838fd85?w=400'
      UNION ALL SELECT 'Louboutin Heels', 'Designer red-sole heels', 'Christian Louboutin', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'
      UNION ALL SELECT 'UGG Classic Short', 'Sheepskin boots', 'UGG', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400'
      UNION ALL SELECT 'Birkenstock Arizona', 'Cork footbed sandals', 'Birkenstock', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Toms Alpargata', 'Canvas slip-on shoes', 'Toms', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'
      UNION ALL SELECT 'Sperry Top-Sider', 'Boat shoes', 'Sperry', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
      UNION ALL SELECT 'Clarks Desert Boot', 'Suede chukka boots', 'Clarks', 'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=400'
      UNION ALL SELECT 'Steve Madden Pumps', 'Trendy fashion heels', 'Steve Madden', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'
      UNION ALL SELECT 'Sketchers Go Walk', 'Comfortable walking shoes', 'Sketchers', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
      
      -- Women's Apparel  
      UNION ALL SELECT 'Floral Midi Dress' as name, 'Elegant floral print dress perfect for any occasion' as description, 'Zara' as brand, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' as image_url WHERE c.name = 'Womens Apparel'
      UNION ALL SELECT 'Cashmere Sweater', 'Soft cashmere pullover sweater', 'Everlane', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
      UNION ALL SELECT 'High-Waisted Jeans', 'Classic blue denim jeans', 'Levis', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'
      UNION ALL SELECT 'Silk Blouse', 'Professional silk button-up shirt', 'Theory', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'
      UNION ALL SELECT 'Wrap Dress', 'Versatile wrap-style dress', 'Diane von Furstenberg', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
      UNION ALL SELECT 'Blazer Jacket', 'Tailored business blazer', 'Hugo Boss', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Maxi Dress', 'Flowing floor-length dress', 'Free People', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
      UNION ALL SELECT 'Pencil Skirt', 'Classic pencil skirt', 'Banana Republic', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Cardigan', 'Cozy knit cardigan', 'J.Crew', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
      UNION ALL SELECT 'Yoga Pants', 'High-performance leggings', 'Lululemon', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Little Black Dress', 'Timeless cocktail dress', 'Kate Spade', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
      UNION ALL SELECT 'Trench Coat', 'Classic waterproof trench', 'Burberry', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Cropped Top', 'Trendy crop top', 'Urban Outfitters', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'
      UNION ALL SELECT 'Wide-Leg Pants', 'Flowy palazzo pants', 'Madewell', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'
      UNION ALL SELECT 'Turtleneck Sweater', 'Warm turtleneck pullover', 'Uniqlo', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
      UNION ALL SELECT 'Jumpsuit', 'One-piece jumpsuit', 'Reformation', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
      UNION ALL SELECT 'Button-Down Shirt', 'Classic cotton shirt', 'Brooks Brothers', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'
      UNION ALL SELECT 'A-Line Skirt', 'Flared midi skirt', 'H&M', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Leather Jacket', 'Edgy biker jacket', 'AllSaints', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Palazzo Pants', 'Flowing wide-leg trousers', 'Anthropologie', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'
      
      -- Men's Apparel
      UNION ALL SELECT 'Oxford Dress Shirt' as name, 'Classic white dress shirt' as description, 'Brooks Brothers' as brand, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400' as image_url WHERE c.name = 'Mens Apparel'
      UNION ALL SELECT 'Chino Pants', 'Versatile cotton chinos', 'Dockers', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      UNION ALL SELECT 'Polo Shirt', 'Classic cotton polo', 'Ralph Lauren', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Denim Jacket', 'Classic blue jean jacket', 'Levis', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
      UNION ALL SELECT 'Suit Jacket', 'Tailored business suit', 'Hugo Boss', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Henley Shirt', 'Long-sleeve henley', 'J.Crew', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Hoodie', 'Comfortable pullover hoodie', 'Champion', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
      UNION ALL SELECT 'Cargo Shorts', 'Utility shorts with pockets', 'Patagonia', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      UNION ALL SELECT 'V-Neck Sweater', 'Wool v-neck pullover', 'Banana Republic', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Track Pants', 'Athletic sweatpants', 'Adidas', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      UNION ALL SELECT 'Flannel Shirt', 'Plaid flannel button-up', 'Pendleton', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Leather Belt', 'Genuine leather dress belt', 'Coach', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Bomber Jacket', 'Modern bomber-style jacket', 'Alpha Industries', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
      UNION ALL SELECT 'Swim Trunks', 'Quick-dry board shorts', 'Quiksilver', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      UNION ALL SELECT 'Tuxedo', 'Formal evening wear', 'Tom Ford', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
      UNION ALL SELECT 'Crew Neck T-Shirt', 'Basic cotton tee', 'Hanes', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Cardigan Sweater', 'Button-front cardigan', 'L.L.Bean', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Dress Pants', 'Tailored dress trousers', 'Men''s Wearhouse', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      UNION ALL SELECT 'Tank Top', 'Cotton sleeveless shirt', 'Fruit of the Loom', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
      UNION ALL SELECT 'Peacoat', 'Navy wool peacoat', 'Schott NYC', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
      
      -- Accessories
      UNION ALL SELECT 'Leather Handbag' as name, 'Premium leather shoulder bag' as description, 'Michael Kors' as brand, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' as image_url WHERE c.name = 'Accessories'
      UNION ALL SELECT 'Silk Scarf', 'Luxury silk square scarf', 'Hermès', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Gold Watch', 'Classic gold wristwatch', 'Rolex', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
      UNION ALL SELECT 'Diamond Earrings', 'Elegant stud earrings', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Baseball Cap', 'Adjustable cotton cap', 'New Era', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Sunglasses', 'UV protection sunglasses', 'Ray-Ban', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'
      UNION ALL SELECT 'Wallet', 'Leather bifold wallet', 'Fossil', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Backpack', 'Canvas laptop backpack', 'Herschel', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Pearl Necklace', 'Cultured pearl strand', 'Mikimoto', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Fedora Hat', 'Wool felt fedora', 'Stetson', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Cufflinks', 'Silver dress cufflinks', 'Montblanc', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Tote Bag', 'Canvas shopping tote', 'L.L.Bean', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Bracelet', 'Sterling silver bracelet', 'Pandora', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Tie', 'Silk dress tie', 'Hugo Boss', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Clutch Purse', 'Evening clutch bag', 'Kate Spade', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Ring', 'Gold wedding band', 'Cartier', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Messenger Bag', 'Leather messenger bag', 'Fossil', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Hair Clip', 'Decorative hair accessory', 'Kitsch', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'
      UNION ALL SELECT 'Belt Buckle', 'Western style buckle', 'Montana Silversmiths', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      UNION ALL SELECT 'Phone Case', 'Protective smartphone case', 'OtterBox', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      
      -- Athletic Wear
      UNION ALL SELECT 'Running Shorts' as name, 'Moisture-wicking athletic shorts' as description, 'Nike' as brand, 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400' as image_url WHERE c.name = 'Athletic Wear'
      UNION ALL SELECT 'Sports Bra', 'High-support sports bra', 'Lululemon', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Compression Leggings', 'Performance compression tights', 'Under Armour', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Athletic Tank Top', 'Breathable workout tank', 'Adidas', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Track Jacket', 'Zip-up track jacket', 'Puma', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Yoga Mat', 'Non-slip exercise mat', 'Manduka', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Gym Bag', 'Durable sports duffel', 'Under Armour', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Sweatband', 'Moisture-absorbing headband', 'Nike', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Water Bottle', 'Insulated sports bottle', 'Hydro Flask', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Windbreaker', 'Lightweight running jacket', 'Patagonia', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Cycling Shorts', 'Padded bike shorts', 'Pearl Izumi', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Basketball Shorts', 'Mesh basketball shorts', 'Champion', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Swim Goggles', 'Anti-fog swimming goggles', 'Speedo', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Tennis Skirt', 'Pleated tennis skirt', 'Wilson', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Golf Polo', 'Moisture-wicking golf shirt', 'Polo Ralph Lauren', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Hiking Boots', 'Waterproof hiking footwear', 'Merrell', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Resistance Bands', 'Exercise resistance bands', 'TRX', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Training Gloves', 'Weightlifting gloves', 'Harbinger', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Football Jersey', 'Team sports jersey', 'Nike', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
      UNION ALL SELECT 'Ski Jacket', 'Insulated ski outerwear', 'The North Face', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'
    ) products
  ) subq
  WHERE product_name IS NOT NULL
)
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  category_id,
  image_url
FROM product_data;

-- Create inventory entries linking products to stores with realistic pricing
INSERT INTO inventory (store_id, product_id, price, quantity)
SELECT 
  s.id as store_id,
  p.id as product_id,
  -- Price varies by store type and adds some randomness
  CASE 
    WHEN s.business_type = 'shoe_store' AND c.name = 'Shoes' THEN 
      ROUND((RANDOM() * 50 + 80)::numeric, 2)
    WHEN s.business_type = 'womens_apparel' AND c.name = 'Womens Apparel' THEN 
      ROUND((RANDOM() * 80 + 60)::numeric, 2)
    WHEN s.business_type = 'mens_apparel' AND c.name = 'Mens Apparel' THEN 
      ROUND((RANDOM() * 70 + 65)::numeric, 2)
    WHEN s.business_type = 'accessories' AND c.name = 'Accessories' THEN 
      ROUND((RANDOM() * 120 + 40)::numeric, 2)
    WHEN s.business_type = 'athletic_wear' AND c.name = 'Athletic Wear' THEN 
      ROUND((RANDOM() * 60 + 45)::numeric, 2)
    ELSE 
      ROUND((RANDOM() * 50 + 50)::numeric, 2)
  END as price,
  FLOOR(RANDOM() * 20 + 5) as quantity
FROM stores s
CROSS JOIN products p
JOIN categories c ON p.category_id = c.id
WHERE 
  -- Each store type carries relevant products
  (s.business_type = 'shoe_store' AND c.name = 'Shoes') OR
  (s.business_type = 'womens_apparel' AND c.name = 'Womens Apparel') OR
  (s.business_type = 'mens_apparel' AND c.name = 'Mens Apparel') OR
  (s.business_type = 'accessories' AND c.name = 'Accessories') OR
  (s.business_type = 'athletic_wear' AND c.name = 'Athletic Wear') OR
  -- Some crossover inventory
  (s.business_type = 'womens_apparel' AND c.name = 'Accessories' AND RANDOM() < 0.3) OR
  (s.business_type = 'mens_apparel' AND c.name = 'Accessories' AND RANDOM() < 0.2) OR
  (s.business_type = 'athletic_wear' AND c.name = 'Shoes' AND RANDOM() < 0.4);