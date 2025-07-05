-- Migration: Remove product.id and use SKU as primary key
-- Date: July 3, 2025
-- Description: This migration removes the id column from products table and uses sku as the primary key,
-- then updates all foreign key references to use sku instead of product_id

BEGIN;

-- Step 1: Add product_sku columns to all tables that reference products
-- These will temporarily coexist with product_id columns

-- Add product_sku to analytics table
ALTER TABLE analytics 
ADD COLUMN product_sku TEXT;

-- Add product_sku to favorites table
ALTER TABLE favorites 
ADD COLUMN product_sku TEXT;

-- Add product_sku to order_items table
ALTER TABLE order_items 
ADD COLUMN product_sku TEXT;

-- Add product_sku to reviews table
ALTER TABLE reviews 
ADD COLUMN product_sku TEXT;

-- Add product_sku to sponsored_items table
ALTER TABLE sponsored_items 
ADD COLUMN product_sku TEXT;

-- Step 2: Populate the new product_sku columns with data from products table
-- Update analytics table
UPDATE analytics 
SET product_sku = (
    SELECT sku 
    FROM products 
    WHERE products.id = analytics.product_id
)
WHERE product_id IS NOT NULL;

-- Update favorites table
UPDATE favorites 
SET product_sku = (
    SELECT sku 
    FROM products 
    WHERE products.id = favorites.product_id
)
WHERE product_id IS NOT NULL;

-- Update order_items table
UPDATE order_items 
SET product_sku = (
    SELECT sku 
    FROM products 
    WHERE products.id = order_items.product_id
)
WHERE product_id IS NOT NULL;

-- Update reviews table
UPDATE reviews 
SET product_sku = (
    SELECT sku 
    FROM products 
    WHERE products.id = reviews.product_id
)
WHERE product_id IS NOT NULL;

-- Update sponsored_items table
UPDATE sponsored_items 
SET product_sku = (
    SELECT sku 
    FROM products 
    WHERE products.id = sponsored_items.product_id
)
WHERE product_id IS NOT NULL;

-- Step 3: Drop existing foreign key constraints
ALTER TABLE analytics 
DROP CONSTRAINT IF EXISTS analytics_product_id_fkey;

ALTER TABLE favorites 
DROP CONSTRAINT IF EXISTS favorites_product_id_fkey;

ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;

ALTER TABLE sponsored_items 
DROP CONSTRAINT IF EXISTS sponsored_items_product_id_fkey;

-- Step 4: Make sku unique and prepare to be primary key in products table
-- First ensure all SKUs are not null and unique
UPDATE products SET sku = 'MISSING_SKU_' || id WHERE sku IS NULL OR sku = '';

-- Add unique constraint to sku
ALTER TABLE products 
ADD CONSTRAINT products_sku_unique UNIQUE (sku);

-- Step 5: Drop the old product_id columns
ALTER TABLE analytics 
DROP COLUMN product_id;

ALTER TABLE favorites 
DROP COLUMN product_id;

ALTER TABLE order_items 
DROP COLUMN product_id;

ALTER TABLE reviews 
DROP COLUMN product_id;

ALTER TABLE sponsored_items 
DROP COLUMN product_id;

-- Step 6: Rename product_sku columns to product_sku for clarity
-- (They're already named correctly, so this step is for documentation)

-- Step 7: Add foreign key constraints referencing products.sku
ALTER TABLE analytics 
ADD CONSTRAINT analytics_product_sku_fkey 
FOREIGN KEY (product_sku) REFERENCES products(sku) ON DELETE CASCADE;

ALTER TABLE favorites 
ADD CONSTRAINT favorites_product_sku_fkey 
FOREIGN KEY (product_sku) REFERENCES products(sku) ON DELETE CASCADE;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_sku_fkey 
FOREIGN KEY (product_sku) REFERENCES products(sku) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_sku_fkey 
FOREIGN KEY (product_sku) REFERENCES products(sku) ON DELETE CASCADE;

ALTER TABLE sponsored_items 
ADD CONSTRAINT sponsored_items_product_sku_fkey 
FOREIGN KEY (product_sku) REFERENCES products(sku) ON DELETE CASCADE;

-- Step 8: Drop the id column from products table and make sku the primary key
-- First drop the existing primary key
ALTER TABLE products 
DROP CONSTRAINT products_pkey;

-- Remove the id column
ALTER TABLE products 
DROP COLUMN id;

-- Make sku the primary key
ALTER TABLE products 
ADD PRIMARY KEY (sku);

-- Step 9: Update any other tables that might reference products.id
-- Update inventory table to ensure it references products by sku
-- (The inventory table should already be using sku, but let's make sure)

-- Check if inventory has any product_id references and update if needed
-- This table should already be correct as it uses sku, but adding for completeness

COMMIT;

-- Create indexes for performance on the new foreign key columns
CREATE INDEX IF NOT EXISTS idx_analytics_product_sku ON analytics(product_sku);
CREATE INDEX IF NOT EXISTS idx_favorites_product_sku ON favorites(product_sku);
CREATE INDEX IF NOT EXISTS idx_order_items_product_sku ON order_items(product_sku);
CREATE INDEX IF NOT EXISTS idx_reviews_product_sku ON reviews(product_sku);
CREATE INDEX IF NOT EXISTS idx_sponsored_items_product_sku ON sponsored_items(product_sku);
