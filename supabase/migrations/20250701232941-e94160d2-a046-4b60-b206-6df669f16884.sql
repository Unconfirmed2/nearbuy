-- Create a function to delete user account and all related data
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Delete related data in order (respecting foreign key constraints)
  
  -- Delete order items first
  DELETE FROM order_items 
  WHERE order_id IN (SELECT id FROM orders WHERE user_id = current_user_id);
  
  -- Delete payments
  DELETE FROM payments 
  WHERE order_id IN (SELECT id FROM orders WHERE user_id = current_user_id);
  
  -- Delete orders
  DELETE FROM orders WHERE user_id = current_user_id;
  
  -- Delete reviews
  DELETE FROM reviews WHERE user_id = current_user_id;
  
  -- Delete favorites
  DELETE FROM favorites WHERE user_id = current_user_id;
  
  -- Delete sponsored items for stores owned by user
  DELETE FROM sponsored_items 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  -- Delete inventory for stores owned by user
  DELETE FROM inventory 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  -- Delete store documents
  DELETE FROM store_documents 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  -- Delete store hours
  DELETE FROM store_hours 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  DELETE FROM store_hours_new 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  -- Delete POS integrations
  DELETE FROM pos_integrations 
  WHERE store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id);
  
  -- Delete merchant documents
  DELETE FROM merchant_documents WHERE merchant_id = current_user_id;
  
  -- Delete stores owned by user
  DELETE FROM stores WHERE owner_id = current_user_id;
  
  -- Delete analytics data
  DELETE FROM analytics WHERE user_id = current_user_id;
  
  -- Delete admin actions if user is admin
  DELETE FROM admin_actions WHERE admin_user_id = current_user_id;
  
  -- Delete user profile from users table
  DELETE FROM users WHERE id = current_user_id;
  
  -- Finally delete from profiles if it exists
  DELETE FROM profiles WHERE id = current_user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;