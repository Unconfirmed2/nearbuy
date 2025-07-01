-- Create stores without merchant_id constraints
-- We'll create 25 stores (5 per type) in Chelsea NYC area

-- First, let's create stores with only required fields
INSERT INTO stores (id, owner_id, name, description, business_type, address, is_active, is_verified)
VALUES 
  -- Shoe stores
  (gen_random_uuid(), gen_random_uuid(), 'Elite Footwear - Chelsea', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '125 W 25th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Shoe Palace - Flatiron', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '200 W 26th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Footlocker Plus - Chelsea', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '315 W 23rd St, New York, NY 10011', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Sole Society - Midtown', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '450 W 24th St, New York, NY 10011', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Step Forward - West Village', 'Premium designer shoes and sneakers for all occasions', 'shoe_store', '180 W 20th St, New York, NY 10011', true, true),
  
  -- Women's apparel stores  
  (gen_random_uuid(), gen_random_uuid(), 'Urban Threads - Chelsea', 'Contemporary fashion for the modern woman', 'womens_apparel', '275 W 22nd St, New York, NY 10011', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Feminine Flair - Gramercy', 'Contemporary fashion for the modern woman', 'womens_apparel', '125 W 21st St, New York, NY 10010', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Chic Boutique - Union Square', 'Contemporary fashion for the modern woman', 'womens_apparel', '350 W 19th St, New York, NY 10010', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Style Studio - Flatiron', 'Contemporary fashion for the modern woman', 'womens_apparel', '225 W 18th St, New York, NY 10010', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Fashion Forward - Meatpacking', 'Contemporary fashion for the modern woman', 'womens_apparel', '400 W 17th St, New York, NY 10010', true, true),
  
  -- Men's apparel stores
  (gen_random_uuid(), gen_random_uuid(), 'Gentlemans Corner - West Village', 'Classic menswear and formal attire', 'mens_apparel', '150 W 16th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Modern Man - Chelsea', 'Classic menswear and formal attire', 'mens_apparel', '300 W 15th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Sharp Suits - Meatpacking', 'Classic menswear and formal attire', 'mens_apparel', '175 W 14th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Dapper Den - West Village', 'Classic menswear and formal attire', 'mens_apparel', '425 W 13th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Tailored Trends - Chelsea Market', 'Classic menswear and formal attire', 'mens_apparel', '250 W 12th St, New York, NY 10014', true, true),
  
  -- Accessories stores
  (gen_random_uuid(), gen_random_uuid(), 'Accessory Vault - Flatiron', 'Luxury handbags, jewelry and accessories', 'accessories', '320 W 27th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Luxe Collection - Chelsea', 'Luxury handbags, jewelry and accessories', 'accessories', '140 W 28th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Glamour Gallery - Midtown', 'Luxury handbags, jewelry and accessories', 'accessories', '380 W 25th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Style Statements - Penn Station', 'Luxury handbags, jewelry and accessories', 'accessories', '160 W 29th St, New York, NY 10001', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Accent Pieces - Herald Square', 'Luxury handbags, jewelry and accessories', 'accessories', '290 W 30th St, New York, NY 10001', true, true),
  
  -- Athletic wear stores
  (gen_random_uuid(), gen_random_uuid(), 'FitGear Pro - West Village', 'High-performance athletic wear and equipment', 'athletic_wear', '370 W 11th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Active Lifestyle - Greenwich Village', 'High-performance athletic wear and equipment', 'athletic_wear', '185 W 10th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Sport Central - Bleecker', 'High-performance athletic wear and equipment', 'athletic_wear', '295 W 9th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Peak Performance - Washington Square', 'High-performance athletic wear and equipment', 'athletic_wear', '165 W 8th St, New York, NY 10014', true, true),
  (gen_random_uuid(), gen_random_uuid(), 'Athletic Edge - NoHo', 'High-performance athletic wear and equipment', 'athletic_wear', '385 W 7th St, New York, NY 10014', true, true);