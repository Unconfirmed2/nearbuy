-- Clean up test data and reassign stores to the actual user
-- First, let's see what user ID corresponds to eugene.turetsky@gmail.com
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Find the user ID for eugene.turetsky@gmail.com
    SELECT id INTO target_user_id FROM profiles WHERE email = 'eugene.turetsky@gmail.com';
    
    IF target_user_id IS NULL THEN
        -- If not found in profiles, check users table
        SELECT id INTO target_user_id FROM users WHERE email = 'eugene.turetsky@gmail.com';
    END IF;
    
    IF target_user_id IS NOT NULL THEN
        -- Update all stores to be owned by the target user
        UPDATE stores SET 
            owner_id = target_user_id,
            merchant_id = target_user_id
        WHERE owner_id != target_user_id OR merchant_id != target_user_id;
        
        -- Delete test users from profiles (keep only eugene.turetsky@gmail.com and any admins)
        DELETE FROM profiles 
        WHERE email != 'eugene.turetsky@gmail.com' 
        AND role != 'admin'
        AND id != target_user_id;
        
        -- Delete test users from users table (keep only eugene.turetsky@gmail.com and any admins)
        DELETE FROM users 
        WHERE email != 'eugene.turetsky@gmail.com' 
        AND role != 'admin'
        AND id != target_user_id;
        
        RAISE NOTICE 'Successfully cleaned up test data and reassigned stores to user: %', target_user_id;
    ELSE
        RAISE NOTICE 'User eugene.turetsky@gmail.com not found in database';
    END IF;
END $$;