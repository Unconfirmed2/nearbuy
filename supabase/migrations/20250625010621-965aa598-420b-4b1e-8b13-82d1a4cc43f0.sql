
-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create user roles enum (if not exists)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'store_owner', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create order status enum (if not exists)
DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('pending', 'ready', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to include role if column doesn't exist
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'customer';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add missing columns to existing stores table
DO $$ BEGIN
    ALTER TABLE public.stores ADD COLUMN is_active BOOLEAN DEFAULT true;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create store hours table if not exists
CREATE TABLE IF NOT EXISTS public.store_hours_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  UNIQUE(store_id, day_of_week)
);

-- Create admin actions audit log if not exists
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_documents ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role with proper type casting
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role::text = _role
  )
$$;

-- Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Store policies
DROP POLICY IF EXISTS "Anyone can view active verified stores" ON public.stores;
CREATE POLICY "Anyone can view active verified stores" ON public.stores
  FOR SELECT USING (COALESCE(is_active, true) = true AND is_verified = true);

DROP POLICY IF EXISTS "Store owners can manage their stores" ON public.stores;
CREATE POLICY "Store owners can manage their stores" ON public.stores
  FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins can manage all stores" ON public.stores;
CREATE POLICY "Admins can manage all stores" ON public.stores
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_owner ON public.stores (owner_id);
CREATE INDEX IF NOT EXISTS idx_inventory_store_product ON public.inventory (store_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store ON public.orders (store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);

-- Update the trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
