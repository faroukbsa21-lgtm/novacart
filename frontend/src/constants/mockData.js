export const MOCK_CATEGORIES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Electronics',
    name_ar: 'إلكترونيات',
    name_fr: 'Électronique',
    name_en: 'Electronics',
    slug: 'electronics',
    description: 'Cutting-edge gadgets, audio gear, and smart devices',
    image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    icon_name: 'cpu'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Fashion',
    name_ar: 'أزياء وموضة',
    name_fr: 'Mode & Style',
    name_en: 'Fashion',
    slug: 'fashion',
    description: 'Contemporary streetwear, premium apparel, and accessories',
    image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    icon_name: 'shirt'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Home & Living',
    name_ar: 'المنزل والديكور',
    name_fr: 'Maison & Déco',
    name_en: 'Home & Living',
    slug: 'home-living',
    description: 'Modern home aesthetics, ergonomics, and interior essentials',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    icon_name: 'home'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Accessories',
    name_ar: 'إكسسوارات',
    name_fr: 'Accessoires',
    name_en: 'Accessories',
    slug: 'accessories',
    description: 'Luxury watches, minimalist leather goods, and daily carry',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    icon_name: 'watch'
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    category_id: '11111111-1111-1111-1111-111111111111',
    category_name: 'Electronics',
    title: 'Aura Wireless ANC Headphones',
    slug: 'aura-wireless-anc-headphones',
    description: 'Industry-leading active noise cancellation with 40-hour battery life, high-fidelity lossless drivers, and memory foam comfort pads. Engineered for audiophiles and remote professionals.',
    price: 34900,
    compare_at_price: 41900,
    sku: 'TECH-AURA-01',
    stock_quantity: 42,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.85,
    num_reviews: 38,
    is_featured: true,
    is_active: true
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    category_id: '44444444-4444-4444-4444-444444444444',
    category_name: 'Accessories',
    title: 'Chronos Minimalist Steel Watch',
    slug: 'chronos-minimalist-steel-watch',
    description: 'Sapphire crystal glass, Japanese quartz movement, and 316L surgical-grade stainless steel casing with interchangeable quick-release Italian leather strap.',
    price: 24900,
    compare_at_price: 29900,
    sku: 'WATCH-CHRONO-99',
    stock_quantity: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.92,
    num_reviews: 51,
    is_featured: true,
    is_active: true
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    category_id: '11111111-1111-1111-1111-111111111111',
    category_name: 'Electronics',
    title: 'Lumix 4K Studio Mechanical Keyboard',
    slug: 'lumix-4k-mechanical-keyboard',
    description: 'Hot-swappable custom mechanical switches, RGB per-key backlighting, CNC anodized aluminum chassis, and wireless tri-mode connectivity (2.4GHz / Bluetooth 5.2 / USB-C).',
    price: 19500,
    compare_at_price: 23500,
    sku: 'KB-LUMIX-PRO',
    stock_quantity: 60,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.78,
    num_reviews: 29,
    is_featured: true,
    is_active: true
  },
  {
    id: 'p4444444-4444-4444-4444-444444444444',
    category_id: '22222222-2222-2222-2222-222222222222',
    category_name: 'Fashion',
    title: 'Urban Expedition Waterproof Backpack',
    slug: 'urban-expedition-waterproof-backpack',
    description: 'Crafted with 1000D Cordura ballistic nylon, waterproof YKK Aquaguard zippers, padded 16-inch laptop compartment, and ergonomic airflow back cushioning.',
    price: 15900,
    compare_at_price: 19900,
    sku: 'BAG-URBAN-EXP',
    stock_quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.65,
    num_reviews: 19,
    is_featured: false,
    is_active: true
  },
  {
    id: 'p5555555-5555-5555-5555-555555555555',
    category_id: '33333333-3333-3333-3333-333333333333',
    category_name: 'Home & Living',
    title: 'Nordic Ceramic Pour-Over Kettle & Brewer',
    slug: 'nordic-ceramic-pour-over-kettle',
    description: 'Artisanal matte ceramic coffee dripper with dual-wall thermal glass carafe and precision gooseneck spout for optimal extraction and barista perfection.',
    price: 9500,
    compare_at_price: 11900,
    sku: 'HOME-KETTLE-01',
    stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.90,
    num_reviews: 14,
    is_featured: true,
    is_active: true
  },
  {
    id: 'p6666666-6666-6666-6666-666666666666',
    category_id: '11111111-1111-1111-1111-111111111111',
    category_name: 'Electronics',
    title: 'Quantum Ultra Smart Fitness Tracker',
    slug: 'quantum-ultra-smart-fitness-tracker',
    description: 'Continuous SpO2, heart rate, ECG monitoring, sleep stage analytics, and IP68 water resistance up to 50 meters with 14-day battery reserve.',
    price: 12500,
    compare_at_price: 16500,
    sku: 'TECH-QUANTUM-FIT',
    stock_quantity: 55,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.55,
    num_reviews: 42,
    is_featured: false,
    is_active: true
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'r1',
    product_id: 'p1111111-1111-1111-1111-111111111111',
    user_name: 'Sarah Jenkins',
    rating: 5,
    title: 'Unbeatable Noise Cancellation!',
    comment: 'The ANC on these headphones easily rivals the biggest names on the market. Soundstage is punchy and crisp, and wearing them for an entire 8-hour workday feels effortless.',
    is_verified_purchase: true,
    created_at: '2026-10-15T10:00:00Z'
  },
  {
    id: 'r2',
    product_id: 'p2222222-2222-2222-2222-222222222222',
    user_name: 'Alex Rivera',
    rating: 5,
    title: 'Timeless design and great weight',
    comment: 'I get compliments every time I wear this watch. The sapphire glass has survived several accidental knocks without a single scratch.',
    is_verified_purchase: true,
    created_at: '2026-10-16T14:30:00Z'
  }
];

export const MOCK_USERS = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@ecommerce.test',
    password: 'Admin@123456',
    full_name: 'System Administrator',
    role: 'admin',
    preferred_language: 'fr',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    token: 'mock_jwt_admin_novacart'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'customer@ecommerce.test',
    password: 'Customer@123',
    full_name: 'Sarah Jenkins',
    role: 'customer',
    preferred_language: 'ar',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    token: 'mock_jwt_customer_novacart'
  }
];

