-- Accessories
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  (SELECT id FROM categories WHERE name = 'Accessories'),
  image_url
FROM (VALUES
  ('Leather Handbag', 'Premium leather shoulder bag', 'Michael Kors', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Silk Scarf', 'Luxury silk square scarf', 'Hermès', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Gold Watch', 'Classic gold wristwatch', 'Rolex', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'),
  ('Diamond Earrings', 'Elegant stud earrings', 'Tiffany & Co.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Baseball Cap', 'Adjustable cotton cap', 'New Era', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Sunglasses', 'UV protection sunglasses', 'Ray-Ban', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'),
  ('Wallet', 'Leather bifold wallet', 'Fossil', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Backpack', 'Canvas laptop backpack', 'Herschel', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Pearl Necklace', 'Cultured pearl strand', 'Mikimoto', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Fedora Hat', 'Wool felt fedora', 'Stetson', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Cufflinks', 'Silver dress cufflinks', 'Montblanc', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Tote Bag', 'Canvas shopping tote', 'L.L.Bean', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Bracelet', 'Sterling silver bracelet', 'Pandora', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Tie', 'Silk dress tie', 'Hugo Boss', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Clutch Purse', 'Evening clutch bag', 'Kate Spade', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Ring', 'Gold wedding band', 'Cartier', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Messenger Bag', 'Leather messenger bag', 'Fossil', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Hair Clip', 'Decorative hair accessory', 'Kitsch', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),
  ('Belt Buckle', 'Western style buckle', 'Montana Silversmiths', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Phone Case', 'Protective smartphone case', 'OtterBox', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400')
) AS product_data(product_name, description, brand, image_url);

-- Athletic Wear
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  (SELECT id FROM categories WHERE name = 'Athletic Wear'),
  image_url
FROM (VALUES
  ('Running Shorts', 'Moisture-wicking athletic shorts', 'Nike', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Sports Bra', 'High-support sports bra', 'Lululemon', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Compression Leggings', 'Performance compression tights', 'Under Armour', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Athletic Tank Top', 'Breathable workout tank', 'Adidas', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Track Jacket', 'Zip-up track jacket', 'Puma', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Yoga Mat', 'Non-slip exercise mat', 'Manduka', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Gym Bag', 'Durable sports duffel', 'Under Armour', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Sweatband', 'Moisture-absorbing headband', 'Nike', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Water Bottle', 'Insulated sports bottle', 'Hydro Flask', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Windbreaker', 'Lightweight running jacket', 'Patagonia', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Cycling Shorts', 'Padded bike shorts', 'Pearl Izumi', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Basketball Shorts', 'Mesh basketball shorts', 'Champion', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Swim Goggles', 'Anti-fog swimming goggles', 'Speedo', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Tennis Skirt', 'Pleated tennis skirt', 'Wilson', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Golf Polo', 'Moisture-wicking golf shirt', 'Polo Ralph Lauren', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Hiking Boots', 'Waterproof hiking footwear', 'Merrell', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Resistance Bands', 'Exercise resistance bands', 'TRX', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Training Gloves', 'Weightlifting gloves', 'Harbinger', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Football Jersey', 'Team sports jersey', 'Nike', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Ski Jacket', 'Insulated ski outerwear', 'The North Face', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400')
) AS product_data(product_name, description, brand, image_url);