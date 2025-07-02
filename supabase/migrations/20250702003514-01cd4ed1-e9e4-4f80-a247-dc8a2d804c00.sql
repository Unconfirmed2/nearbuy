-- Fix RLS policy for users table to allow user creation during signup
DROP POLICY IF EXISTS "users_insert_own" ON public.users;

CREATE POLICY "users_insert_own" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);