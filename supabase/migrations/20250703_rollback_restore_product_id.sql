-- Rollback Migration: Restore product.id and revert to product_id foreign keys
-- Date: July 3, 2025
-- Description: This rollback migration restores the id column to products table as primary key
-- and reverts all foreign key references back to product_id

BEGIN;

-- Step 1: Add back the id column to products table as SERIAL
ALTER TABLE products 
ADD COLUMN id SERIAL;

-- Step 2: Drop the current primary key (sku)
ALTER TABLE products 
DROP CONSTRAINT products_pkey;

-- Step 3: Make id the primary key again
ALTER TABLE products 
ADD PRIMARY KEY (id);

-- Step 4: Add product_id columns back to all referencing tables
ALTER TABLE analytics 
ADD COLUMN product_id BIGINT;

ALTER TABLE favorites 
ADD COLUMN product_id BIGINT;

ALTER TABLE order_items 
ADD COLUMN product_id BIGINT;

ALTER TABLE reviews 
ADD COLUMN product_id BIGINT;

ALTER TABLE sponsored_items 
ADD COLUMN product_id BIGINT;

-- Step 5: Populate product_id columns from product_sku using the products table
UPDATE analytics 
SET product_id = (
    SELECT id 
    FROM products 
    WHERE products.sku = analytics.product_sku
)
WHERE product_sku IS NOT NULL;

UPDATE favorites 
SET product_id = (
    SELECT id 
    FROM products 
    WHERE products.sku = favorites.product_sku
)
WHERE product_sku IS NOT NULL;

UPDATE order_items 
SET product_id = (
    SELECT id 
    FROM products 
    WHERE products.sku = order_items.product_sku
)
WHERE product_sku IS NOT NULL;

UPDATE reviews 
SET product_id = (
    SELECT id 
    FROM products 
    WHERE products.sku = reviews.product_sku
)
WHERE product_sku IS NOT NULL;

UPDATE sponsored_items 
SET product_id = (
    SELECT id 
    FROM products 
    WHERE products.sku = sponsored_items.product_sku
)
WHERE product_sku IS NOT NULL;

-- Step 6: Drop foreign key constraints on product_sku columns
ALTER TABLE analytics 
DROP CONSTRAINT IF EXISTS analytics_product_sku_fkey;

ALTER TABLE favorites 
DROP CONSTRAINT IF EXISTS favorites_product_sku_fkey;

ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_product_sku_fkey;

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_product_sku_fkey;

ALTER TABLE sponsored_items 
DROP CONSTRAINT IF EXISTS sponsored_items_product_sku_fkey;

-- Step 7: Drop product_sku columns
ALTER TABLE analytics 
DROP COLUMN product_sku;

ALTER TABLE favorites 
DROP COLUMN product_sku;

ALTER TABLE order_items 
DROP COLUMN product_sku;

ALTER TABLE reviews 
DROP COLUMN product_sku;

ALTER TABLE sponsored_items 
DROP COLUMN product_sku;

-- Step 8: Add back foreign key constraints for product_id
ALTER TABLE analytics 
ADD CONSTRAINT analytics_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE favorites 
ADD CONSTRAINT favorites_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE sponsored_items 
ADD CONSTRAINT sponsored_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Step 9: Remove unique constraint from sku (keep it as regular column)
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_sku_unique;

COMMIT;

-- Create indexes for performance on the restored foreign key columns
CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_sponsored_items_product_id ON sponsored_items(product_id);
