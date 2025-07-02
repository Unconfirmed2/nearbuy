-- Delete all test stores and associated data to give clean slate
-- Delete in order to respect foreign key constraints

-- Delete order items first
DELETE FROM order_items 
WHERE order_id IN (SELECT id FROM orders WHERE store_id IN (SELECT id FROM stores));

-- Delete orders
DELETE FROM orders WHERE store_id IN (SELECT id FROM stores);

-- Delete payments (if any remaining)
DELETE FROM payments 
WHERE order_id IN (SELECT id FROM orders WHERE store_id IN (SELECT id FROM stores));

-- Delete reviews
DELETE FROM reviews WHERE store_id IN (SELECT id FROM stores);
DELETE FROM reviews WHERE product_id IN (SELECT id FROM products);

-- Delete favorites
DELETE FROM favorites WHERE store_id IN (SELECT id FROM stores);
DELETE FROM favorites WHERE product_id IN (SELECT id FROM products);

-- Delete sponsored items
DELETE FROM sponsored_items WHERE store_id IN (SELECT id FROM stores);

-- Delete inventory
DELETE FROM inventory WHERE store_id IN (SELECT id FROM stores);

-- Delete store hours
DELETE FROM store_hours WHERE store_id IN (SELECT id FROM stores);
DELETE FROM store_hours_new WHERE store_id IN (SELECT id FROM stores);

-- Delete store documents
DELETE FROM store_documents WHERE store_id IN (SELECT id FROM stores);

-- Delete POS integrations
DELETE FROM pos_integrations WHERE store_id IN (SELECT id FROM stores);

-- Delete all products (they're not store-specific in current schema but let's clean them up)
DELETE FROM products;

-- Delete all stores
DELETE FROM stores;

-- Clean up any orphaned data
DELETE FROM analytics WHERE store_id IS NOT NULL OR product_id IS NOT NULL;