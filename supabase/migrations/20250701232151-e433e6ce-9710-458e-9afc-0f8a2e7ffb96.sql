-- Create some basic inventory for testing
-- First, let's see what products and stores we have
SELECT p.id as product_id, p.name as product_name, c.name as category_name
FROM products p 
JOIN categories c ON p.category_id = c.id 
LIMIT 10;