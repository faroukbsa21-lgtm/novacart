-- ==============================================================================
-- ECOMSUPABASE PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL (Supports Row Level Security & Triggers)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE (Linked with Supabase Auth or Standalone App Users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phone VARCHAR(30),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    preferred_language VARCHAR(5) DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en', 'fr')),
    address JSONB DEFAULT '{"street": "", "city": "", "state": "", "postal_code": "", "country": ""}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    icon_name VARCHAR(50) DEFAULT 'folder',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    cost_price NUMERIC(10, 2) CHECK (cost_price IS NULL OR cost_price >= 0),
    sku VARCHAR(64) UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    attributes JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    num_reviews INT DEFAULT 0 CHECK (num_reviews >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (shipping_amount >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) DEFAULT 'card' CHECK (payment_method IN ('card', 'cod', 'paypal', 'stripe', 'bank_transfer')),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. ORDER_ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    product_image TEXT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(150),
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ==============================================================================
-- 8. AUTOMATIC TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- High security protection: PHP API handles privileged tasks with the Service Role,
-- while direct or client queries are strictly governed by RLS.
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Categories & Products: Publicly readable for active items
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Active products are viewable by everyone" 
ON public.products FOR SELECT USING (is_active = true);

-- Reviews: Approved reviews are publicly readable
CREATE POLICY "Approved reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (is_approved = true);

-- Service Role Key Bypass:
-- When your PHP backend connects using the SUPABASE_SERVICE_ROLE_KEY,
-- Supabase automatically grants bypassrls privilege, allowing secure API mediation.

-- ==============================================================================
-- 10. SEED SAMPLE DATA
-- ==============================================================================

-- Sample Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Cutting-edge gadgets, audio gear, and smart devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80', 1),
    ('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Contemporary streetwear, premium apparel, and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80', 2),
    ('33333333-3333-3333-3333-333333333333', 'Home & Living', 'home-living', 'Modern home aesthetics, ergonomics, and interior essentials', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', 3),
    ('44444444-4444-4444-4444-444444444444', 'Accessories', 'accessories', 'Luxury watches, minimalist leather goods, and daily carry', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', 4)
ON CONFLICT (id) DO NOTHING;

-- Default Admin Profile (password is: Admin@123456)
INSERT INTO public.profiles (id, email, password_hash, full_name, role, preferred_language)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@ecommerce.test',
    '$2y$12$GKfs7ddHlNaEUDYqa/.lNuqA/zQMrxznqmmLAWMY3JSYPW8I0LHBO', -- Admin@123456
    'System Administrator',
    'admin',
    'fr'
) ON CONFLICT (email) DO NOTHING;

-- Default Customer Profile (password is: Customer@123)
INSERT INTO public.profiles (id, email, password_hash, full_name, role, preferred_language)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'customer@ecommerce.test',
    '$2y$12$xj7c7I703C0L3COhyEHxku3vwB6iqJti64bDh4Nsl7ZWwoOGi4Xs2', -- Customer@123
    'Sarah Jenkins',
    'customer',
    'ar'
) ON CONFLICT (email) DO NOTHING;

-- Sample Products (Prices natively in Algerian Dinars DZD)
INSERT INTO public.products (id, category_id, title, slug, description, price, compare_at_price, sku, stock_quantity, images, rating, num_reviews, is_featured, is_active)
VALUES
(
    'b1111111-1111-4111-8111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Aura Wireless ANC Headphones',
    'aura-wireless-anc-headphones',
    'Industry-leading active noise cancellation with 40-hour battery life, high-fidelity lossless drivers, and memory foam comfort pads. Engineered for audiophiles and remote professionals.',
    34900.00,
    41900.00,
    'TECH-AURA-01',
    42,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.85,
    38,
    TRUE,
    TRUE
),
(
    'b2222222-2222-4222-8222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'Chronos Minimalist Steel Watch',
    'chronos-minimalist-steel-watch',
    'Sapphire crystal glass, Japanese quartz movement, and 316L surgical-grade stainless steel casing with interchangeable quick-release Italian leather strap.',
    24900.00,
    29900.00,
    'WATCH-CHRONO-99',
    18,
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.92,
    51,
    TRUE,
    TRUE
),
(
    'b3333333-3333-4333-8333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Lumix 4K Studio Mechanical Keyboard',
    'lumix-4k-mechanical-keyboard',
    'Hot-swappable custom mechanical switches, RGB per-key backlighting, CNC anodized aluminum chassis, and wireless tri-mode connectivity (2.4GHz / Bluetooth 5.2 / USB-C).',
    19500.00,
    23500.00,
    'KB-LUMIX-PRO',
    60,
    '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.78,
    29,
    TRUE,
    TRUE
),
(
    'b4444444-4444-4444-8444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'Urban Expedition Waterproof Backpack',
    'urban-expedition-waterproof-backpack',
    'Crafted with 1000D Cordura ballistic nylon, waterproof YKK Aquaguard zippers, padded 16-inch laptop compartment, and ergonomic airflow back cushioning.',
    15900.00,
    19900.00,
    'BAG-URBAN-EXP',
    35,
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.65,
    19,
    FALSE,
    TRUE
),
(
    'b5555555-5555-4555-8555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'Nordic Ceramic Pour-Over Kettle & Brewer',
    'nordic-ceramic-pour-over-kettle',
    'Artisanal matte ceramic coffee dripper with dual-wall thermal glass carafe and precision precision gooseneck spout for optimal extraction and barista perfection.',
    9500.00,
    12000.00,
    'HOME-KETTLE-01',
    25,
    '["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.90,
    14,
    TRUE,
    TRUE
),
(
    'b6666666-6666-4666-8666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Quantum Ultra Smart Fitness Tracker',
    'quantum-ultra-smart-fitness-tracker',
    'Continuous SpO2, heart rate, ECG monitoring, sleep stage analytics, and IP68 water resistance up to 50 meters with 14-day battery reserve.',
    12500.00,
    16500.00,
    'TECH-QUANTUM-FIT',
    55,
    '["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    4.55,
    42,
    FALSE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Sample Reviews
INSERT INTO public.reviews (product_id, user_id, user_name, rating, title, comment, is_verified_purchase)
VALUES
(
    'b1111111-1111-4111-8111-111111111111',
    'c0000000-0000-0000-0000-000000000001',
    'Sarah Jenkins',
    5,
    'Unbeatable Noise Cancellation!',
    'The ANC on these headphones easily rivals the biggest names on the market. Soundstage is punchy and crisp, and wearing them for an entire 8-hour workday feels effortless.',
    TRUE
),
(
    'b2222222-2222-4222-8222-222222222222',
    'c0000000-0000-0000-0000-000000000001',
    'Alex Rivera',
    5,
    'Timeless design and great weight',
    'I get compliments every time I wear this watch. The sapphire glass has survived several accidental knocks without a single scratch.',
    TRUE
)
ON CONFLICT DO NOTHING;
