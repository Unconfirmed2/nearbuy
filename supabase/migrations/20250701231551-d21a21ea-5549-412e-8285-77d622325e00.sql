-- Continue adding products - Women's Apparel
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  (SELECT id FROM categories WHERE name = 'Womens Apparel'),
  image_url
FROM (VALUES
  ('Floral Midi Dress', 'Elegant floral print dress perfect for any occasion', 'Zara', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'),
  ('Cashmere Sweater', 'Soft cashmere pullover sweater', 'Everlane', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'),
  ('High-Waisted Jeans', 'Classic blue denim jeans', 'Levis', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'),
  ('Silk Blouse', 'Professional silk button-up shirt', 'Theory', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'),
  ('Wrap Dress', 'Versatile wrap-style dress', 'Diane von Furstenberg', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'),
  ('Blazer Jacket', 'Tailored business blazer', 'Hugo Boss', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Maxi Dress', 'Flowing floor-length dress', 'Free People', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'),
  ('Pencil Skirt', 'Classic pencil skirt', 'Banana Republic', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Cardigan', 'Cozy knit cardigan', 'J.Crew', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'),
  ('Yoga Pants', 'High-performance leggings', 'Lululemon', 'https://images.unsplash.com/photo-1506629905877-667562a2b253?w=400'),
  ('Little Black Dress', 'Timeless cocktail dress', 'Kate Spade', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'),
  ('Trench Coat', 'Classic waterproof trench', 'Burberry', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Cropped Top', 'Trendy crop top', 'Urban Outfitters', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'),
  ('Wide-Leg Pants', 'Flowy palazzo pants', 'Madewell', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'),
  ('Turtleneck Sweater', 'Warm turtleneck pullover', 'Uniqlo', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'),
  ('Jumpsuit', 'One-piece jumpsuit', 'Reformation', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'),
  ('Button-Down Shirt', 'Classic cotton shirt', 'Brooks Brothers', 'https://images.unsplash.com/photo-1564550072-6000ceebc821?w=400'),
  ('A-Line Skirt', 'Flared midi skirt', 'H&M', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Leather Jacket', 'Edgy biker jacket', 'AllSaints', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Palazzo Pants', 'Flowing wide-leg trousers', 'Anthropologie', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400')
) AS product_data(product_name, description, brand, image_url);

-- Men's Apparel
INSERT INTO products (id, name, description, brand, category_id, image_url)
SELECT 
  gen_random_uuid(),
  product_name,
  description,
  brand,
  (SELECT id FROM categories WHERE name = 'Mens Apparel'),
  image_url
FROM (VALUES
  ('Oxford Dress Shirt', 'Classic white dress shirt', 'Brooks Brothers', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Chino Pants', 'Versatile cotton chinos', 'Dockers', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'),
  ('Polo Shirt', 'Classic cotton polo', 'Ralph Lauren', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Denim Jacket', 'Classic blue jean jacket', 'Levis', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'),
  ('Suit Jacket', 'Tailored business suit', 'Hugo Boss', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Henley Shirt', 'Long-sleeve henley', 'J.Crew', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Hoodie', 'Comfortable pullover hoodie', 'Champion', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'),
  ('Cargo Shorts', 'Utility shorts with pockets', 'Patagonia', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'),
  ('V-Neck Sweater', 'Wool v-neck pullover', 'Banana Republic', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Track Pants', 'Athletic sweatpants', 'Adidas', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'),
  ('Flannel Shirt', 'Plaid flannel button-up', 'Pendleton', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Leather Belt', 'Genuine leather dress belt', 'Coach', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Bomber Jacket', 'Modern bomber-style jacket', 'Alpha Industries', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'),
  ('Swim Trunks', 'Quick-dry board shorts', 'Quiksilver', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'),
  ('Tuxedo', 'Formal evening wear', 'Tom Ford', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'),
  ('Crew Neck T-Shirt', 'Basic cotton tee', 'Hanes', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Cardigan Sweater', 'Button-front cardigan', 'L.L.Bean', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Dress Pants', 'Tailored dress trousers', 'Mens Wearhouse', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'),
  ('Tank Top', 'Cotton sleeveless shirt', 'Fruit of the Loom', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'),
  ('Peacoat', 'Navy wool peacoat', 'Schott NYC', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400')
) AS product_data(product_name, description, brand, image_url);