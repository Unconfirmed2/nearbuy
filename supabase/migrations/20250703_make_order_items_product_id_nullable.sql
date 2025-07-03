-- Make product_id nullable in order_items (for sku migration)
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;

-- (Optional) If you are fully migrated to sku, you can drop product_id:
-- ALTER TABLE order_items DROP COLUMN IF EXISTS product_id;

-- (Optional) Backfill product_id from sku if needed:
-- UPDATE order_items
-- SET product_id = products.id
-- FROM products
-- WHERE order_items.sku = products.sku AND order_items.product_id IS NULL;
