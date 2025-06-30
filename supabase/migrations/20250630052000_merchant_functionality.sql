
-- Create enums for various statuses and types
DO $$ BEGIN
    CREATE TYPE public.store_status AS ENUM ('active', 'inactive', 'pending_verification', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.promotion_type AS ENUM ('percentage', 'fixed_amount', 'buy_x_get_y');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.integration_type AS ENUM ('pos', 'payment', 'inventory');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update stores table with new fields
DO $$ BEGIN
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS status store_status DEFAULT 'active';
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS logo_url TEXT;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS business_hours JSONB;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS contact_phone TEXT;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS contact_email TEXT;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS website TEXT;
    ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS social_media JSONB;
END $$;

-- Create product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  price DECIMAL(10,2),
  attributes JSONB, -- {color: 'red', size: 'L', material: 'cotton'}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type promotion_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_products UUID[], -- Array of product IDs
  applicable_categories UUID[], -- Array of category IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coupon codes table
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create merchant notifications table
CREATE TABLE IF NOT EXISTS public.merchant_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'new_order', 'low_stock', 'review', 'payment'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data for the notification
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create merchant settings table
CREATE TABLE IF NOT EXISTS public.merchant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  business_info JSONB,
  payment_settings JSONB,
  shipping_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(merchant_id)
);

-- Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS public.merchant_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type integration_type NOT NULL,
  provider TEXT NOT NULL, -- 'shopify', 'square', 'stripe', etc.
  config JSONB NOT NULL, -- API keys, settings, etc.
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product analytics table
CREATE TABLE IF NOT EXISTS public.product_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, store_id, date)
);

-- Create store analytics table
CREATE TABLE IF NOT EXISTS public.store_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(store_id, date)
);

-- Enable RLS on all new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Merchants can manage their product variants" ON public.product_variants
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    WHERE p.id = product_variants.product_id AND s.merchant_id = auth.uid()
  ));

CREATE POLICY "Merchants can manage their promotions" ON public.promotions
  FOR ALL USING (auth.uid() = merchant_id);

CREATE POLICY "Anyone can view active promotions" ON public.promotions
  FOR SELECT USING (is_active = true AND start_date <= now() AND end_date >= now());

CREATE POLICY "Merchants can manage their coupon codes" ON public.coupon_codes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.promotions p 
    WHERE p.id = coupon_codes.promotion_id AND p.merchant_id = auth.uid()
  ));

CREATE POLICY "Merchants can view their notifications" ON public.merchant_notifications
  FOR ALL USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can manage their settings" ON public.merchant_settings
  FOR ALL USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can manage their support tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = merchant_id);

CREATE POLICY "Admins can manage all support tickets" ON public.support_tickets
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view ticket messages for their tickets" ON public.ticket_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.support_tickets t 
    WHERE t.id = ticket_messages.ticket_id 
    AND (t.merchant_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ));

CREATE POLICY "Users can add messages to their tickets" ON public.ticket_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.support_tickets t 
    WHERE t.id = ticket_messages.ticket_id 
    AND (t.merchant_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ) AND auth.uid() = sender_id);

CREATE POLICY "Merchants can manage their integrations" ON public.merchant_integrations
  FOR ALL USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can view their analytics" ON public.product_analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    WHERE p.id = product_analytics.product_id AND s.merchant_id = auth.uid()
  ));

CREATE POLICY "Merchants can view their store analytics" ON public.store_analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.stores s 
    WHERE s.id = store_analytics.store_id AND s.merchant_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_promotions_merchant ON public.promotions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON public.promotions (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON public.coupon_codes (code);
CREATE INDEX IF NOT EXISTS idx_merchant_notifications_merchant ON public.merchant_notifications (merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant ON public.support_tickets (merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product_date ON public.product_analytics (product_id, date);
CREATE INDEX IF NOT EXISTS idx_store_analytics_store_date ON public.store_analytics (store_id, date);
