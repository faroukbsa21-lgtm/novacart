/**
 * Comprehensive Trilingual Dictionary: Arabic (العربية), English, French (Français)
 * Specifically curated for Algerian E-Commerce Market (NovaCart)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'العربية', flag: '🇩🇿', dir: 'rtl' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' }
];

export const translations = {
  ar: {
    // Currency
    currency: 'د.ج',
    currency_code: 'DZD',

    // Top Bar
    topbar_delivery: 'توصيل سريع لجميع الـ 69 ولاية (مكتب ومنزل)',
    topbar_cod: 'الدفع نقداً عند الاستلام',
    topbar_authentic: '🇩🇿 منتجات أصلية 100%',

    // Navbar
    brand_sub: 'المتجر الرسمي',
    search_placeholder: 'ابحث عن منتج، علامة تجارية (سماعات، لوحة مفاتيح)...',
    nav_admin: 'لوحة التحكم',
    nav_orders: 'طلباتي',
    nav_signin: 'تسجيل الدخول',
    nav_account: 'حسابي',
    nav_cart: 'السلة',
    nav_all_products: 'جميع المنتجات',
    nav_all_categories: 'جميع الأقسام',
    cat_all: 'جميع المنتجات',
    cat_electronics: 'إلكترونيات',
    cat_fashion: 'أزياء وموضة',
    cat_home_living: 'المنزل والديكور',
    cat_accessories: 'إكسسوارات',
    search_popular_categories: 'الأقسام الشائعة',
    checkout_select_commune: '-- اختر البلدية / المدينة --',
    checkout_communes_available: 'بلدية متاحة',
    nav_signout: 'تسجيل الخروج',
    nav_role_admin: 'مدير النظام',
    nav_role_customer: 'زبون',

    // Hero
    hero_badge: 'المتجر رقم 1 في الجزائر • حق المعاينة قبل الدفع مضمون',
    hero_badge_arabic: '(حق المعاينة قبل الدفع)',
    hero_title_1: 'جودة معتمدة.',
    hero_title_2: 'توصيل لكافة أنحاء الجزائر.',
    hero_desc: 'اكتشف أحدث المعدات الصوتية عالية الدقة، لوحات المفاتيح الميكانيكية، الساعات الفاخرة والإكسسوارات. اطلب في ثوانٍ وادفع نقداً عند الاستلام.',
    hero_cta_explore: 'استكشف المنتجات',
    hero_cta_whatsapp: 'الطلب عبر واتساب',
    hero_promo_badge: 'عرض خاص: كود التخفيض',
    hero_promo_discount: 'لخصم 20% فوري!',

    // Value propositions
    prop_wilayas_title: '69 ولاية مغطاة',
    prop_wilayas_desc: 'مكتب ومنزل في 24-48 ساعة',
    prop_inspection_title: 'المعاينة قبل الدفع',
    prop_inspection_desc: 'افحص طردك مع موظف التوصيل',
    prop_cod_title: 'دفع نقدي 100% (COD)',
    prop_cod_desc: 'ادفع بالدينار عند الاستلام',
    prop_warranty_title: 'ضمان وخدمة عملاء 7/7',
    prop_warranty_desc: 'استبدال سريع في حال عدم المطابقة',

    // Welcome & Admin Bar
    admin_bar_active: 'لوحة تحكم المسؤول مفعلة',
    admin_bar_logged_as: 'مسجل كـ',
    admin_bar_open: 'فتح لوحة التحكم',
    admin_bar_orders: 'كافة الطلبات',
    user_welcome: 'مرحباً،',
    user_welcome_sub: 'المتجر الرسمي مع توصيل سريع لكافة الـ 69 ولاية.',

    // Catalog & Filters
    catalog_title: 'الكتالوج الرسمي',
    catalog_filtered: 'مجموعة مصفاة',
    catalog_search_title: 'نتائج البحث في الكتالوج',
    catalog_subtitle: 'توصيل سريع على 69 ولاية مع دفع نقدي عند الاستلام (COD)',
    catalog_sort_by: 'ترتيب حسب:',
    sort_featured: 'المميزة',
    sort_price_asc: 'السعر: من الأقل للأعلى',
    sort_price_desc: 'السعر: من الأعلى للأقل',
    sort_rating: 'الأعلى تقييماً',
    reset_filter: 'إلغاء الفلتر',
    items_count_single: 'منتج واحد',
    items_count_plural: 'منتجات',
    search_results_for: 'نتائج البحث عن:',
    search_available_single: 'منتج متاح',
    search_available_plural: 'منتجات متاحة',
    search_in_category: 'في قسم:',
    search_clear: 'مسح البحث',
    search_no_results: 'لم نجد أي منتج يطابق',
    search_no_results_desc: 'يرجى التأكد من كتابة الكلمات بشكل صحيح أو تجربة كلمات بحث أخرى.',
    search_suggestions_title: 'اقتراحات بحث شائعة:',
    search_all_catalog: 'عرض كل المنتجات (69 ولاية)',
    loading_products: 'جاري تحميل المنتجات...',

    // Product Card
    card_preview: 'معاينة',
    card_catalog: 'الكتالوج',
    card_cod_badge: 'دفع عند الاستلام',
    card_manage: 'إدارة',
    card_add: 'إضافة',
    card_added: 'تمت الإضافة',
    card_reviews: 'تقييم',
    card_out_of_stock: 'نفد من المخزون',
    low_stock_warning: 'بقي {count} قطع فقط!',

    // Product Detail Modal
    modal_in_stock: 'متوفر في المخزون',
    modal_out_of_stock: 'نفد من المخزون',
    modal_available: 'قطعة متوفرة',
    stock_max_reached: 'الحد الأقصى للمخزون المتوفر',
    stock_exceeded_error: 'الكمية المطلوبة تتجاوز المخزون المتوفر ({max} قطعة)',
    cart_max_stock_note: 'الحد الأقصى المتاح: {max}',
    modal_add_to_cart: 'إضافة إلى السلة',
    modal_order_whatsapp: 'الطلب السريع عبر واتساب (الدفع عند الاستلام)',
    modal_whatsapp_msg: 'مرحباً NovaCart، أود طلب المنتج: {title} (الكمية: {qty}) بسعر {price} مع التوصيل.',
    modal_admin_view: '👑 جلسة المسؤول: وضع معاينة وتدقيق المنتج.',
    modal_stock_badge: 'المخزون:',
    modal_reviews_title: 'آراء وتقييمات العملاء',
    modal_leave_review: 'أضف تقييمك المعتمد',
    modal_your_rating: 'تقييمك:',
    modal_review_headline_placeholder: 'عنوان التقييم (مثال: جودة ممتازة وسرعة في التوصيل!)',
    modal_review_comment_placeholder: 'شاركنا تفاصيل تجربتك مع هذا المنتج...',
    modal_submit_review: 'إرسال التقييم',
    modal_submitting: 'جاري الإرسال...',
    modal_review_success: 'شكراً لك! تم استلام تقييمك بنجاح.',
    modal_loading_reviews: 'جاري تحميل آراء الزبائن...',
    modal_no_reviews: 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!',
    modal_verified_purchase: 'شراء موثق',
    modal_trust_inspection: 'فحص الطرد قبل الدفع',
    modal_trust_inspection_desc: 'افتح وعاين قبل الدفع',
    modal_trust_wilayas: '69 ولاية',
    modal_trust_wilayas_desc: 'منزل واستلام من المكتب',
    modal_trust_cod: 'دفع نقدي 100%',
    modal_trust_cod_desc: 'كاش عند الاستلام',

    // Cart Drawer
    cart_title: 'سلة المشتريات',
    cart_empty_title: 'سلة مشترياتك فارغة',
    cart_empty_desc: 'تصفح تشكيلة منتجاتنا المميزة وأضف منتجاتك المفضلة إلى السلة.',
    cart_browse_cta: 'تصفح المنتجات',
    cart_promo_placeholder: 'كود التخفيض (NOVA20)',
    cart_promo_apply: 'تطبيق',
    cart_subtotal: 'المجموع الفرعي',
    cart_discount: 'التخفيض',
    cart_shipping_estimate: 'التوصيل (69 ولاية)',
    cart_shipping_range: 'ابتداءً من 300 د.ج (المكتب) / 500 د.ج (المنزل)',
    cart_total_estimate: 'المجموع الإجمالي',
    cart_checkout_cta: 'تأكيد الطلب (الدفع عند الاستلام)',
    cart_reassurance: 'فحص الطرد متاح قبل الدفع • توصيل لكل 69 ولاية',

    // Checkout Modal
    checkout_title: 'تأكيد الطلب وإتمام الشراء',
    checkout_subtitle: 'توصيل سريع وموثوق لكافة الـ 69 ولاية في الجزائر',
    checkout_step1: '1. اختيار الولاية ونوع التوصيل (69 ولاية)',
    checkout_wilaya_label: 'اختر ولايتك *',
    checkout_zone: 'المنطقة:',
    checkout_delivery_type_label: 'نوع التوصيل لولاية',
    checkout_desk_title: 'توصيل إلى المكتب (Stop Desk)',
    checkout_desk_sub: 'استلام الطرد من وكالة التوصيل بالولاية',
    checkout_desk_badge: 'اقتصادي وسريع',
    checkout_home_title: 'توصيل لباب المنزل (Domicile)',
    checkout_home_sub: 'توصيل شخصي لعنوانك يداً بيد',
    checkout_home_badge: 'مباشر لباب منزلك',
    checkout_estimated_delay: 'المدة المقدرة للتوصيل لولاية {name}:',
    checkout_step2: '2. معلومات الزبون',
    checkout_name_label: 'الاسم الكامل *',
    checkout_name_placeholder: 'مثال: محمد بن علي',
    checkout_phone_label: 'رقم الهاتف *',
    checkout_phone_placeholder: '0550 12 34 56 أو 06/07',
    checkout_email_label: 'البريد الإلكتروني *',
    checkout_email_placeholder: 'name@example.com',
    checkout_step3: '3. العنوان والوجهة',
    checkout_city_label: 'البلدية / المدينة *',
    checkout_city_placeholder: 'مثال: حيدرة، الرويبة، باب الزوار...',
    checkout_postal_label: 'الرمز البريدي (اختياري)',
    checkout_street_label: 'عنوان الشارع ورقم المسكن / البناية *',
    checkout_street_placeholder: 'مثال: حي 500 مسكن، عمارة ب، شقة 12',
    checkout_desk_agency_label: 'الوكالة أو مكتب التوصيل المفضل',
    checkout_desk_agency_placeholder: 'مثال: الوكالة المركزية أو مكتب وسط المدينة',
    checkout_notes_label: 'ملاحظات أو تعليمات خاصة للموصّل (اختياري)',
    checkout_notes_placeholder: 'مثال: يرجى الاتصال بي قبل الوصول بنصف ساعة...',
    checkout_step4: '4. طريقة الدفع',
    checkout_payment_cod: 'الدفع عند الاستلام (COD)',
    checkout_payment_cod_sub: 'ادفع نقداً بعد استلام ومعاينة طلبك',
    checkout_payment_card: 'البطاقة الذهبية / CIB / بطاقة بنكية',
    checkout_payment_card_sub: 'دفع إلكتروني فوري وآمن',
    checkout_summary_subtotal: 'المجموع الفرعي ({count} منتجات):',
    checkout_summary_discount: 'التخفيض:',
    checkout_summary_shipping: 'التوصيل {type} ({code} - {name}):',
    checkout_summary_tax: 'الضريبة المقدرة (5%):',
    checkout_summary_grand_total: 'المبلغ الإجمالي المستحق:',
    checkout_place_order_btn: 'تأكيد الطلب نهائياً ({total})',
    checkout_submitting: 'جاري تأكيد الطلب...',
    checkout_error_fields: 'يرجى ملء الاسم، البريد الإلكتروني، رقم الهاتف والبلدية.',
    checkout_error_street: 'يرجى تحديد عنوان الشارع أو الحي للتوصيل المنزلي.',

    // Confirmation Screen
    confirm_title: 'تم تأكيد طلبك بنجاح!',
    confirm_message: 'شكراً لثقتكم. تم إرسال إشعار التأكيد وتفاصيل الطلب إلى بريدك الإلكتروني:',
    confirm_order_number: 'رقم الطلب:',
    confirm_destination: 'الوجهة:',
    confirm_delivery_mode: 'طريقة التوصيل:',
    confirm_desk_label: '🏢 مكتب التوصيل (Stop Desk)',
    confirm_home_label: '🏠 توصيل لباب المنزل',
    confirm_estimated: 'الوقت المقدر:',
    confirm_shipping_fee: 'سعر التوصيل:',
    confirm_total_due: 'المبلغ المستحق للدفع:',
    confirm_back_btn: 'العودة للتسوق في المتجر',

    // Orders History Modal
    orders_title: 'سجل الطلبات السابقة',
    orders_subtitle: 'جميع الطلبات والمعاملات المسجلة بحساب',
    orders_loading: 'جاري تحميل سجل طلباتك...',
    orders_empty_title: 'لا توجد طلبات سابقة',
    orders_empty_desc: 'ستظهر هنا إيصالات طلباتك وتتبع حالة الشحن بمجرد إتمام الشراء.',
    orders_placed_on: 'تاريخ الطلب:',
    orders_total: 'المبلغ الإجمالي:',
    status_delivered: 'تم التوصيل',
    status_shipped: 'في طريق الشحن',
    status_processing: 'قيد التجهيز',
    status_pending: 'قيد الانتظار',
    status_cancelled: 'ملغي',

    // Admin Modal
    admin_title: 'لوحة إدارة المتجر',
    admin_subtitle: 'إدارة المنتجات، متابعة الطلبات، وتعديل أدوار المستخدمين في الوقت الحقيقي',
    admin_tab_overview: 'نظرة عامة',
    admin_tab_products: 'المنتجات',
    admin_tab_orders: 'الطلبات',
    admin_tab_customers: 'المستخدمين',
    admin_stat_revenue: 'إجمالي الإيرادات',
    admin_stat_orders: 'الطلبات المسجلة',
    admin_stat_products: 'المنتجات بالكتالوج',
    admin_stat_users: 'المستخدمين المسجلين',
    admin_btn_new_product: 'إضافة منتج جديد',
    admin_btn_save: 'حفظ التعديلات',
    admin_btn_cancel: 'إلغاء',
    admin_prod_title: 'اسم المنتج',
    admin_prod_sku: 'رمز SKU',
    admin_prod_price: 'السعر (د.ج)',
    admin_prod_stock: 'المخزون',
    admin_prod_actions: 'الإجراءات',
    admin_users_title: 'إدارة حسابات الزبائن والمشرفين',
    admin_role_customer: 'زبون',
    admin_role_mod: 'مشرف (Moderator)',
    admin_role_admin: 'مدير (Admin)',

    // Auth Modal
    auth_signin: 'تسجيل الدخول',
    auth_create_account: 'إنشاء حساب جديد',
    auth_email_label: 'البريد الإلكتروني',
    auth_password_label: 'كلمة المرور',
    auth_fullname_label: 'الاسم الكامل',
    auth_confirm_password: 'تأكيد كلمة المرور',
    auth_phone_label: 'رقم الهاتف',
    auth_preferred_lang: 'اللغة المفضلة للحساب',
    auth_btn_login: 'دخول آمن',
    auth_btn_register: 'تسجيل حساب جديد',
    auth_authenticating: 'جاري التحقق...',
    auth_registering: 'جاري إنشاء الحساب...',
    auth_trusted_domains: 'المزودات المقبولة: Gmail, Outlook, Yahoo, Hotmail, iCloud, Proton',
    auth_security_note: 'حماية متقدمة: كلمة المرور تتطلب 8 أحرف على الأقل مع أحرف وأرقام.',

    // Footer
    footer_about_title: 'عن المتجر',
    footer_about_desc: 'معدات صوتية فاخرة، لوحات مفاتيح ميكانيكية، ساعات دقيقة وإكسسوارات صممت خصيصاً للمحترفين في الجزائر.',
    footer_collections: 'الأقسام والمجموعات',
    footer_customer_care: 'خدمة العملاء',
    footer_trust_title: 'التوصيل والثقة',
    footer_trust_desc: 'توصيل سريع على جميع الـ 69 ولاية. دفع نقدي آمن عند الاستلام أو إلكترونياً.',
    footer_rights: 'جميع الحقوق محفوظة.',
    footer_official: 'المتجر الرسمي في الجزائر',

    // WhatsApp Widget
    wa_header_title: 'NovaCart الجزائر',
    wa_header_status: 'متصل الآن • رد فوري 7/7',
    wa_body_text: '👋 مرحباً بكم! تفضلون الطلب السريع مباشرة بدون ملء استمارة؟ تواصلوا معنا عبر واتساب الآن.',
    wa_cod_note: 'دفع نقدي 100% عند الاستلام (COD)',
    wa_delivery_note: 'توصيل 24 - 48 ساعة لكافة الـ 69 ولاية',
    wa_start_chat: 'بدء المحادثة عبر واتساب'
  },

  en: {
    // Currency
    currency: 'DZD',
    currency_code: 'DZD',

    // Top Bar
    topbar_delivery: 'Express Delivery across 69 Wilayas (Office & Home)',
    topbar_cod: 'Cash on Delivery',
    topbar_authentic: '🇩🇿 100% Authentic Products',

    // Navbar
    brand_sub: 'Official Store',
    search_placeholder: 'Search products, brands (e.g. ANC Headphones, Keyboard)...',
    nav_admin: 'Admin Dashboard',
    nav_orders: 'My Orders',
    nav_signin: 'Sign In',
    nav_account: 'My Account',
    nav_cart: 'Cart',
    nav_all_products: 'All Products',
    nav_all_categories: 'All Categories',
    cat_all: 'All Products',
    cat_electronics: 'Electronics',
    cat_fashion: 'Fashion',
    cat_home_living: 'Home & Living',
    cat_accessories: 'Accessories',
    search_popular_categories: 'Popular Categories',
    checkout_select_commune: '-- Select Municipality / City --',
    checkout_communes_available: 'communes available',
    nav_signout: 'Sign Out',
    nav_role_admin: 'Admin',
    nav_role_customer: 'Customer',

    // Hero
    hero_badge: '#1 Store in Algeria • Inspection Before Payment Guaranteed',
    hero_badge_arabic: '(حق المعاينة قبل الدفع)',
    hero_title_1: 'Certified Quality.',
    hero_title_2: 'Delivered Across Algeria.',
    hero_desc: 'Discover cutting-edge audiophile gear, custom mechanical keyboards, precision timepieces, and everyday essentials. Order in seconds and pay cash on delivery.',
    hero_cta_explore: 'Explore Catalog',
    hero_cta_whatsapp: 'Order via WhatsApp',
    hero_promo_badge: 'Special Offer: Promo Code',
    hero_promo_discount: 'for instant 20% off!',

    // Value propositions
    prop_wilayas_title: '69 Wilayas Covered',
    prop_wilayas_desc: 'Desk & Home in 24h - 48h',
    prop_inspection_title: 'Inspect Before Paying',
    prop_inspection_desc: 'Check your parcel with courier',
    prop_cod_title: '100% Cash on Delivery',
    prop_cod_desc: 'Pay in Dinars upon reception',
    prop_warranty_title: 'Warranty & 7/7 Support',
    prop_warranty_desc: 'Hassle-free exchange policy',

    // Welcome & Admin Bar
    admin_bar_active: 'Admin Control Panel Active',
    admin_bar_logged_as: 'Logged in as',
    admin_bar_open: 'Open Dashboard',
    admin_bar_orders: 'All Orders',
    user_welcome: 'Welcome,',
    user_welcome_sub: 'Official store with fast express delivery across 69 Wilayas.',

    // Catalog & Filters
    catalog_title: 'Official Catalog',
    catalog_filtered: 'Filtered Collection',
    catalog_search_title: 'Search Results',
    catalog_subtitle: 'Fast express delivery across 69 Wilayas with Cash on Delivery (COD)',
    catalog_sort_by: 'Sort by:',
    sort_featured: 'Featured',
    sort_price_asc: 'Price: Low to High',
    sort_price_desc: 'Price: High to Low',
    sort_rating: 'Highest Rated',
    reset_filter: 'Reset Filters',
    items_count_single: 'product',
    items_count_plural: 'products',
    search_results_for: 'Results for:',
    search_available_single: 'item available',
    search_available_plural: 'items available',
    search_in_category: 'In category:',
    search_clear: 'Clear search',
    search_no_results: 'No products found for',
    search_no_results_desc: 'We couldn’t find an exact match. Try adjusting your spelling or using more general terms.',
    search_suggestions_title: 'Popular search suggestions:',
    search_all_catalog: 'View entire catalog (69 Wilayas)',
    loading_products: 'Loading products...',

    // Product Card
    card_preview: 'Preview',
    card_catalog: 'Catalog',
    card_cod_badge: 'Cash on Delivery',
    card_manage: 'Manage',
    card_add: 'Add',
    card_added: 'Added',
    card_reviews: 'reviews',
    card_out_of_stock: 'Out of Stock',
    low_stock_warning: 'Only {count} left in stock!',

    // Product Detail Modal
    modal_in_stock: 'In stock',
    modal_out_of_stock: 'Out of Stock',
    modal_available: 'units available',
    stock_max_reached: 'Maximum available stock reached',
    stock_exceeded_error: 'Requested quantity exceeds available stock ({max} units)',
    cart_max_stock_note: 'Max available: {max}',
    modal_add_to_cart: 'Add to Cart',
    modal_order_whatsapp: 'Quick Order via WhatsApp (Cash on Delivery)',
    modal_whatsapp_msg: 'Hello NovaCart, I would like to order: {title} (Qty: {qty}) at {price} with delivery.',
    modal_admin_view: '👑 Administrator Session: Product Inspection Mode.',
    modal_stock_badge: 'Stock:',
    modal_reviews_title: 'Customer Reviews',
    modal_leave_review: 'Leave a Verified Review',
    modal_your_rating: 'Your Rating:',
    modal_review_headline_placeholder: 'Review headline (e.g. Outstanding quality and fast delivery!)',
    modal_review_comment_placeholder: 'Share details of your experience with this item...',
    modal_submit_review: 'Submit Review',
    modal_submitting: 'Posting...',
    modal_review_success: 'Thank you! Your review has been submitted successfully.',
    modal_loading_reviews: 'Loading customer reviews...',
    modal_no_reviews: 'No reviews yet. Be the first to review this product!',
    modal_verified_purchase: 'Verified Purchase',
    modal_trust_inspection: 'Inspect Parcel First',
    modal_trust_inspection_desc: 'Open before paying',
    modal_trust_wilayas: '69 Wilayas',
    modal_trust_wilayas_desc: 'Home & Stop Desk',
    modal_trust_cod: '100% COD',
    modal_trust_cod_desc: 'Cash upon reception',

    // Cart Drawer
    cart_title: 'Your Cart',
    cart_empty_title: 'Your cart is empty',
    cart_empty_desc: 'Explore our curated catalog and add your favorite items to the cart.',
    cart_browse_cta: 'Browse Products',
    cart_promo_placeholder: 'Coupon code (NOVA20)',
    cart_promo_apply: 'Apply',
    cart_subtotal: 'Subtotal',
    cart_discount: 'Discount',
    cart_shipping_estimate: 'Shipping (69 Wilayas)',
    cart_shipping_range: 'From 300 DZD (Desk) / 500 DZD (Home)',
    cart_total_estimate: 'Estimated Total',
    cart_checkout_cta: 'Order Now (Cash on Delivery)',
    cart_reassurance: 'Parcel inspection guaranteed before payment • 69 Wilayas',

    // Checkout Modal
    checkout_title: 'Order Checkout',
    checkout_subtitle: 'Express delivery to all 69 Algerian Wilayas',
    checkout_step1: '1. Wilaya & Delivery Option (69 Wilayas)',
    checkout_wilaya_label: 'Select Your Wilaya *',
    checkout_zone: 'Zone:',
    checkout_delivery_type_label: 'Delivery Type for',
    checkout_desk_title: 'Office Pickup (Stop Desk)',
    checkout_desk_sub: 'Pick up at local courier agency branch',
    checkout_desk_badge: 'Economical',
    checkout_home_title: 'Home Delivery',
    checkout_home_sub: 'Delivered directly to your door',
    checkout_home_badge: 'Direct to home',
    checkout_estimated_delay: 'Estimated delivery for {name}:',
    checkout_step2: '2. Customer Contact',
    checkout_name_label: 'Full Name *',
    checkout_name_placeholder: 'e.g. Mohamed Benali',
    checkout_phone_label: 'Phone Number *',
    checkout_phone_placeholder: '0550 12 34 56 or 06/07',
    checkout_email_label: 'Email Address *',
    checkout_email_placeholder: 'name@example.com',
    checkout_step3: '3. Address & Destination',
    checkout_city_label: 'Municipality / City *',
    checkout_city_placeholder: 'e.g. Hydra, Rouiba, Bab Ezzouar...',
    checkout_postal_label: 'Postal Code (Optional)',
    checkout_street_label: 'Street Address & Building *',
    checkout_street_placeholder: 'e.g. Cité 500 Logements, Bâtiment B, Apt 12',
    checkout_desk_agency_label: 'Preferred Agency / Stop Desk Branch',
    checkout_desk_agency_placeholder: 'e.g. Central Agency or Downtown Branch',
    checkout_notes_label: 'Notes or Instructions for Courier (Optional)',
    checkout_notes_placeholder: 'e.g. Please call me 30 mins before arrival...',
    checkout_step4: '4. Payment Method',
    checkout_payment_cod: 'Cash on Delivery (COD)',
    checkout_payment_cod_sub: 'Pay cash upon parcel delivery and inspection',
    checkout_payment_card: 'Edahabia / CIB / Credit Card',
    checkout_payment_card_sub: 'Secure instant online payment',
    checkout_summary_subtotal: 'Subtotal ({count} items):',
    checkout_summary_discount: 'Discount:',
    checkout_summary_shipping: 'Shipping {type} ({code} - {name}):',
    checkout_summary_tax: 'Estimated Tax (5%):',
    checkout_summary_grand_total: 'Total Amount to Pay:',
    checkout_place_order_btn: 'Confirm Order ({total})',
    checkout_submitting: 'Processing Order...',
    checkout_error_fields: 'Please fill in your name, email, phone, and city.',
    checkout_error_street: 'Please provide your street address for home delivery.',

    // Confirmation Screen
    confirm_title: 'Order Confirmed!',
    confirm_message: 'Thank you for your order. A confirmation receipt has been sent to your email:',
    confirm_order_number: 'Order Number:',
    confirm_destination: 'Destination:',
    confirm_delivery_mode: 'Delivery Mode:',
    confirm_desk_label: '🏢 Stop Desk / Agency',
    confirm_home_label: '🏠 Home Delivery',
    confirm_estimated: 'Estimated Delivery:',
    confirm_shipping_fee: 'Shipping Fee:',
    confirm_total_due: 'Total Due upon Delivery:',
    confirm_back_btn: 'Return to Store',

    // Orders History Modal
    orders_title: 'Order History',
    orders_subtitle: 'Past transactions associated with',
    orders_loading: 'Loading your orders...',
    orders_empty_title: 'No orders placed yet',
    orders_empty_desc: 'Your purchase receipts and live tracking will appear here once you place an order.',
    orders_placed_on: 'Placed on',
    orders_total: 'Total Charged:',
    status_delivered: 'Delivered',
    status_shipped: 'In Transit',
    status_processing: 'Processing',
    status_pending: 'Pending',
    status_cancelled: 'Cancelled',

    // Admin Modal
    admin_title: 'Admin Control Center',
    admin_subtitle: 'Manage inventory, live customer orders, and staff permissions',
    admin_tab_overview: 'Overview',
    admin_tab_products: 'Products',
    admin_tab_orders: 'Orders',
    admin_tab_customers: 'Users & Roles',
    admin_stat_revenue: 'Total Revenue',
    admin_stat_orders: 'Total Orders',
    admin_stat_products: 'Catalog Items',
    admin_stat_users: 'Registered Users',
    admin_btn_new_product: 'Add New Product',
    admin_btn_save: 'Save Changes',
    admin_btn_cancel: 'Cancel',
    admin_prod_title: 'Product Title',
    admin_prod_sku: 'SKU',
    admin_prod_price: 'Price (DZD)',
    admin_prod_stock: 'Stock',
    admin_prod_actions: 'Actions',
    admin_users_title: 'Customer, Moderator & Admin Accounts',
    admin_role_customer: 'Customer',
    admin_role_mod: 'Moderator',
    admin_role_admin: 'Admin',

    // Auth Modal
    auth_signin: 'Sign In',
    auth_create_account: 'Create Account',
    auth_email_label: 'Email Address',
    auth_password_label: 'Password',
    auth_fullname_label: 'Full Name',
    auth_confirm_password: 'Confirm Password',
    auth_phone_label: 'Phone Number',
    auth_preferred_lang: 'Preferred Account Language',
    auth_btn_login: 'Sign In Securely',
    auth_btn_register: 'Register Securely',
    auth_authenticating: 'Authenticating...',
    auth_registering: 'Creating account...',
    auth_trusted_domains: 'Allowed providers: Gmail, Outlook, Yahoo, Hotmail, iCloud, Proton',
    auth_security_note: 'High security: Password requires at least 8 chars with uppercase, lowercase, and numbers.',

    // Footer
    footer_about_title: 'About NovaCart',
    footer_about_desc: 'Curated high-performance acoustics, custom mechanical keyboards, and precision timepieces built for discerning professionals in Algeria.',
    footer_collections: 'Collections',
    footer_customer_care: 'Customer Care',
    footer_trust_title: 'Delivery & Trust',
    footer_trust_desc: 'Express courier delivery across 69 Wilayas of Algeria. 100% Cash on Delivery (COD) or secure card payment.',
    footer_rights: 'All rights reserved.',
    footer_official: 'Official Algerian Store',

    // WhatsApp Widget
    wa_header_title: 'NovaCart Algeria',
    wa_header_status: 'Online • Fast Reply 7/7',
    wa_body_text: '👋 Salam! Prefer ordering directly without filling forms? Chat with our team on WhatsApp now.',
    wa_cod_note: '100% Cash on Delivery (COD)',
    wa_delivery_note: '24h - 48h delivery across 69 Wilayas',
    wa_start_chat: 'Start WhatsApp Chat'
  },

  fr: {
    // Currency
    currency: 'DA',
    currency_code: 'DZD',

    // Top Bar
    topbar_delivery: 'Livraison Express sur 69 Wilayas (Bureau & Domicile)',
    topbar_cod: 'Paiement Cash à la Réception',
    topbar_authentic: '🇩🇿 100% Produits Authentiques',

    // Navbar
    brand_sub: 'Boutique Officielle',
    search_placeholder: 'Rechercher un produit, marque (ex: Casque ANC, Clavier)...',
    nav_admin: 'Tableau de Bord Admin',
    nav_orders: 'Mes Commandes',
    nav_signin: 'Connexion',
    nav_account: 'Mon Compte',
    nav_cart: 'Panier',
    nav_all_products: 'Tous les Produits',
    nav_all_categories: 'Tous les Rayons',
    cat_all: 'Tous les Produits',
    cat_electronics: 'Électronique',
    cat_fashion: 'Mode & Style',
    cat_home_living: 'Maison & Déco',
    cat_accessories: 'Accessoires',
    search_popular_categories: 'Rayons Populaires',
    checkout_select_commune: '-- Sélectionnez la commune / ville --',
    checkout_communes_available: 'communes disponibles',
    nav_signout: 'Déconnexion',
    nav_role_admin: 'Administrateur',
    nav_role_customer: 'Client',

    // Hero
    hero_badge: "Boutique N°1 en Algérie • Droit d'inspection avant paiement garanti",
    hero_badge_arabic: '(حق المعاينة قبل الدفع)',
    hero_title_1: 'Qualité Certifiée.',
    hero_title_2: 'Livrée Partout en Algérie.',
    hero_desc: 'Découvrez nos équipements audio haute fidélité, claviers mécaniques custom, montres de précision et accessoires premium. Commandez en quelques secondes et réglez en espèces à la livraison.',
    hero_cta_explore: 'Explorer le Catalogue',
    hero_cta_whatsapp: 'Commander par WhatsApp',
    hero_promo_badge: 'Offre Spéciale : Code promo',
    hero_promo_discount: 'pour -20% immédiats !',

    // Value propositions
    prop_wilayas_title: '69 Wilayas Desservies',
    prop_wilayas_desc: 'Bureau & Domicile 24h-48h',
    prop_inspection_title: 'Inspection Avant Paiement',
    prop_inspection_desc: 'Vérifiez le colis avec le livreur',
    prop_cod_title: 'Paiement 100% Cash (COD)',
    prop_cod_desc: 'Réglez en dinars à réception',
    prop_warranty_title: 'Garantie & SAV 7j/7',
    prop_warranty_desc: 'Échange rapide si non conforme',

    // Welcome & Admin Bar
    admin_bar_active: '👑 Panneau Administrateur Actif',
    admin_bar_logged_as: 'Connecté en tant que',
    admin_bar_open: 'Ouvrir le Tableau de Bord',
    admin_bar_orders: 'Toutes les Commandes',
    user_welcome: 'Bienvenue,',
    user_welcome_sub: 'Boutique officielle avec livraison rapide sur les 69 Wilayas.',

    // Catalog & Filters
    catalog_title: 'Catalogue Officiel',
    catalog_filtered: 'Collection Filtrée',
    catalog_search_title: 'Résultats du Catalogue',
    catalog_subtitle: 'Livraison rapide sur 69 Wilayas avec paiement à la livraison (COD)',
    catalog_sort_by: 'Trier par :',
    sort_featured: 'Mis en avant',
    sort_price_asc: 'Prix : Croissant',
    sort_price_desc: 'Prix : Décroissant',
    sort_rating: 'Meilleurs Avis',
    reset_filter: 'Réinitialiser',
    items_count_single: 'produit',
    items_count_plural: 'produits',
    search_results_for: 'Résultats pour :',
    search_available_single: 'article disponible',
    search_available_plural: 'articles disponibles',
    search_in_category: 'Dans le rayon :',
    search_clear: 'Effacer la recherche',
    search_no_results: 'Aucun article trouvé pour',
    search_no_results_desc: "Nous n'avons pas trouvé de produit correspondant exactement à votre recherche. Essayez avec un terme plus général.",
    search_suggestions_title: 'Suggestions de recherches fréquentes :',
    search_all_catalog: 'Voir tout le catalogue (69 Wilayas)',
    loading_products: 'Chargement des produits...',

    // Product Card
    card_preview: 'Aperçu',
    card_catalog: 'Catalogue',
    card_cod_badge: 'Paiement Réception',
    card_manage: 'Gérer',
    card_add: 'Ajouter',
    card_added: 'Ajouté',
    card_reviews: 'avis',
    card_out_of_stock: 'Épuisé',
    low_stock_warning: 'Plus que {count} en stock !',

    // Product Detail Modal
    modal_in_stock: 'En stock',
    modal_out_of_stock: 'Rupture de stock',
    modal_available: 'disponibles',
    stock_max_reached: 'Stock maximal disponible atteint',
    stock_exceeded_error: 'La quantité demandée dépasse le stock disponible ({max} unités)',
    cart_max_stock_note: 'Stock max : {max}',
    modal_add_to_cart: 'Ajouter au Panier',
    modal_order_whatsapp: 'Commander par WhatsApp (الدفع عند الاستلام)',
    modal_whatsapp_msg: 'Bonjour NovaCart, je souhaite commander : {title} (Quantité: {qty}) au prix de {price} avec livraison.',
    modal_admin_view: "👑 Session Administrateur : Vue d'inspection du produit.",
    modal_stock_badge: 'Stock :',
    modal_reviews_title: 'Avis Clients',
    modal_leave_review: 'Laisser un Avis Vérifié',
    modal_your_rating: 'Votre Note :',
    modal_review_headline_placeholder: 'Titre de votre avis (ex: Qualité exceptionnelle et livraison rapide !)',
    modal_review_comment_placeholder: 'Partagez les détails de votre expérience avec cet article...',
    modal_submit_review: 'Publier mon Avis',
    modal_submitting: 'Publication en cours...',
    modal_review_success: 'Merci ! Votre avis a été soumis avec succès.',
    modal_loading_reviews: 'Chargement des avis clients...',
    modal_no_reviews: 'Aucun avis pour le moment. Soyez le premier à donner votre avis !',
    modal_verified_purchase: 'Achat Vérifié',
    modal_trust_inspection: 'Vérification Colis',
    modal_trust_inspection_desc: 'Ouvrez avant de payer',
    modal_trust_wilayas: '69 Wilayas',
    modal_trust_wilayas_desc: 'Domicile & Stop Desk',
    modal_trust_cod: 'Paiement COD',
    modal_trust_cod_desc: '100% Cash à réception',

    // Cart Drawer
    cart_title: 'Votre Panier',
    cart_empty_title: 'Votre panier est vide',
    cart_empty_desc: 'Explorez notre catalogue sélectionné et ajoutez vos articles favoris.',
    cart_browse_cta: 'Parcourir les Produits',
    cart_promo_placeholder: 'Code promo (NOVA20)',
    cart_promo_apply: 'Appliquer',
    cart_subtotal: 'Sous-total',
    cart_discount: 'Remise',
    cart_shipping_estimate: 'Livraison (69 Wilayas)',
    cart_shipping_range: 'Dès 300 DA (Stop Desk) / 500 DA (Domicile)',
    cart_total_estimate: 'Total Estimé',
    cart_checkout_cta: 'Commander (Paiement à la livraison)',
    cart_reassurance: 'Vérification du colis avant paiement • 69 Wilayas',

    // Checkout Modal
    checkout_title: 'Validation de la Commande',
    checkout_subtitle: "Livraison express dans les 69 Wilayas d'Algérie",
    checkout_step1: '1. Wilaya & Option de Livraison (69 Wilayas)',
    checkout_wilaya_label: 'Sélectionnez votre Wilaya *',
    checkout_zone: 'Zone :',
    checkout_delivery_type_label: 'Type de Livraison pour',
    checkout_desk_title: 'Livraison au Bureau (Stop Desk)',
    checkout_desk_sub: "Récupération à l'agence de livraison",
    checkout_desk_badge: 'Économique',
    checkout_home_title: 'Livraison à Domicile',
    checkout_home_sub: 'Livré chez vous en main propre',
    checkout_home_badge: 'Direct à domicile',
    checkout_estimated_delay: 'Délai estimé pour {name} :',
    checkout_step2: '2. Coordonnées du Client',
    checkout_name_label: 'Nom et Prénom *',
    checkout_name_placeholder: 'Ex: Mohamed Benali',
    checkout_phone_label: 'Numéro de Téléphone *',
    checkout_phone_placeholder: '0550 12 34 56 ou 06/07',
    checkout_email_label: 'Adresse Email *',
    checkout_email_placeholder: 'nom@exemple.com',
    checkout_step3: '3. Adresse & Destination',
    checkout_city_label: 'Commune / Ville *',
    checkout_city_placeholder: 'Ex: Hydra, Rouiba, Bab Ezzouar...',
    checkout_postal_label: 'Code Postal (Optionnel)',
    checkout_street_label: 'Adresse de Rue & N° Bâtiment *',
    checkout_street_placeholder: 'Ex: Cité 500 Logements, Bâtiment B, N° 12',
    checkout_desk_agency_label: 'Agence / Bureau Stop Desk Souhaité',
    checkout_desk_agency_placeholder: 'Ex: Bureau Principal ou Agence Centre',
    checkout_notes_label: 'Remarques ou Instructions pour le Livreur',
    checkout_notes_placeholder: 'Ex: Appelez-moi avant d’arriver, disponible après 14h...',
    checkout_step4: '4. Mode de Paiement',
    checkout_payment_cod: 'Paiement à la Livraison (COD)',
    checkout_payment_cod_sub: 'Réglez en espèces à réception',
    checkout_payment_card: 'Carte Bancaire / CIB / Edahabia',
    checkout_payment_card_sub: 'Paiement sécurisé en ligne',
    checkout_summary_subtotal: 'Sous-total ({count} articles) :',
    checkout_summary_discount: 'Réduction :',
    checkout_summary_shipping: 'Livraison {type} ({code} - {name}) :',
    checkout_summary_tax: 'TVA estimée (5%) :',
    checkout_summary_grand_total: 'Montant Total :',
    checkout_place_order_btn: 'Confirmer la Commande ({total})',
    checkout_submitting: 'Confirmation en cours...',
    checkout_error_fields: 'Veuillez remplir votre nom, email, téléphone et commune.',
    checkout_error_street: 'Veuillez préciser votre adresse de rue ou quartier pour la livraison à domicile.',

    // Confirmation Screen
    confirm_title: 'Commande Confirmée !',
    confirm_message: 'Merci pour votre achat. Un reçu de confirmation a été envoyé à',
    confirm_order_number: 'N° de Commande :',
    confirm_destination: 'Destination :',
    confirm_delivery_mode: 'Mode de Livraison :',
    confirm_desk_label: '🏢 Bureau / Stop Desk',
    confirm_home_label: '🏠 À Domicile',
    confirm_estimated: 'Délai Estimé :',
    confirm_shipping_fee: 'Frais de Livraison :',
    confirm_total_due: 'Total à Régler :',
    confirm_back_btn: 'Retour à la boutique',

    // Orders History Modal
    orders_title: 'Historique des Commandes',
    orders_subtitle: 'Transactions passées associées à',
    orders_loading: 'Chargement de vos commandes...',
    orders_empty_title: 'Aucune commande pour le moment',
    orders_empty_desc: "Vos futurs reçus d'achat et le suivi en direct apparaîtront ici.",
    orders_placed_on: 'Passée le',
    orders_total: 'Total Réglé :',
    status_delivered: 'Livré',
    status_shipped: 'Expédié (En Transit)',
    status_processing: 'En Préparation',
    status_pending: 'En Attente',
    status_cancelled: 'Annulé',

    // Admin Modal
    admin_title: "Centre d'Administration",
    admin_subtitle: "Gestion en direct des stocks, commandes clients et privilèges d'accès",
    admin_tab_overview: 'Vue Globale',
    admin_tab_products: 'Produits',
    admin_tab_orders: 'Commandes',
    admin_tab_customers: 'Utilisateurs & Rôles',
    admin_stat_revenue: "Chiffre d'Affaires",
    admin_stat_orders: 'Commandes Reçues',
    admin_stat_products: 'Articles au Catalogue',
    admin_stat_users: 'Comptes Enregistrés',
    admin_btn_new_product: 'Nouveau Produit',
    admin_btn_save: 'Enregistrer',
    admin_btn_cancel: 'Annuler',
    admin_prod_title: 'Produit',
    admin_prod_sku: 'SKU',
    admin_prod_price: 'Prix (DA)',
    admin_prod_stock: 'Stock',
    admin_prod_actions: 'Actions',
    admin_users_title: 'Gestion des comptes clients, modérateurs et administrateurs',
    admin_role_customer: 'Client',
    admin_role_mod: 'Modérateur',
    admin_role_admin: 'Administrateur',

    // Auth Modal
    auth_signin: 'Connexion',
    auth_create_account: 'Créer un Compte',
    auth_email_label: 'Adresse Email',
    auth_password_label: 'Mot de Passe',
    auth_fullname_label: 'Nom et Prénom',
    auth_confirm_password: 'Confirmer le Mot de Passe',
    auth_phone_label: 'Numéro de Téléphone',
    auth_preferred_lang: 'Langue préférée du compte',
    auth_btn_login: 'Se Connecter',
    auth_btn_register: 'Créer un Compte Sécurisé',
    auth_authenticating: 'Authentification en cours...',
    auth_registering: 'Création du compte...',
    auth_trusted_domains: 'Fournisseurs acceptés : Gmail, Outlook, Yahoo, Hotmail, iCloud, Proton',
    auth_security_note: 'Sécurité avancée : Le mot de passe requiert au moins 8 caractères avec majuscules, minuscules et chiffres.',

    // Footer
    footer_about_title: 'À Propos de NovaCart',
    footer_about_desc: 'Matériel haute performance, acoustique audiophile, claviers mécaniques custom et montres de précision pour les professionnels en Algérie.',
    footer_collections: 'Collections',
    footer_customer_care: 'Service Client',
    footer_trust_title: 'Livraison & Confiance',
    footer_trust_desc: "Livraison express sur les 69 Wilayas d'Algérie. Paiement sécurisé en espèces à la livraison (Cash on Delivery) ou par carte.",
    footer_rights: 'Tous droits réservés.',
    footer_official: 'Boutique Officielle Algérie',

    // WhatsApp Widget
    wa_header_title: 'NovaCart Algérie',
    wa_header_status: 'En ligne • Réponse rapide 7j/7',
    wa_body_text: '👋 Salam ! Vous préférez commander directement sans remplir de formulaire ? Discutez avec nos conseillers sur WhatsApp.',
    wa_cod_note: 'Paiement 100% Cash à la réception (COD)',
    wa_delivery_note: 'Livraison 24h - 48h sur 69 Wilayas',
    wa_start_chat: 'Démarrer la discussion WhatsApp'
  }
};

/**
 * Canonical Category Translations and Matching Patterns
 */
export const CATEGORY_TRANSLATIONS = {
  electronics: {
    ar: 'إلكترونيات',
    en: 'Electronics',
    fr: 'Électronique',
    match: ['electr', 'électr', '11111111', 'إلكترون', 'electronique']
  },
  fashion: {
    ar: 'أزياء وموضة',
    en: 'Fashion',
    fr: 'Mode & Style',
    match: ['fash', 'mode', '22222222', 'vetement', 'vêtement', 'style', 'أزياء', 'موضة', 'ملابس']
  },
  home_living: {
    ar: 'المنزل والديكور',
    en: 'Home & Living',
    fr: 'Maison & Déco',
    match: ['home', 'living', 'maison', 'déco', 'deco', '33333333', 'منزل', 'ديكور']
  },
  accessories: {
    ar: 'إكسسوارات',
    en: 'Accessories',
    fr: 'Accessoires',
    match: ['access', '44444444', 'إكسسوار', 'اكسسوار', 'montre', 'watch']
  }
};

/**
 * Get localized name for a category across AR, EN, FR
 * Robust against IDs, object structures, case differences, and fallback logic
 * @param {string|object} category - Category object, name, ID, or slug
 * @param {string} lang - 'ar' | 'en' | 'fr'
 * @returns {string} Localized category name
 */
export function getLocalizedCategoryName(category, lang = 'ar') {
  if (!category) return '';

  const cleanLang = (lang || 'ar').toString().toLowerCase().trim();
  const targetLang = ['ar', 'en', 'fr'].includes(cleanLang) ? cleanLang : 'ar';

  // 1. Direct object localized property check (if object provides name_ar, etc.)
  if (typeof category === 'object' && category !== null) {
    if (targetLang === 'ar' && category.name_ar) return category.name_ar;
    if (targetLang === 'fr' && category.name_fr) return category.name_fr;
    if (targetLang === 'en' && category.name_en) return category.name_en;
  }

  // 2. Build searchable aggregate string from all candidate fields
  const tokens = [];
  if (typeof category === 'string') {
    tokens.push(category);
  } else if (typeof category === 'object' && category !== null) {
    if (category.id) tokens.push(String(category.id));
    if (category.slug) tokens.push(String(category.slug));
    if (category.name) tokens.push(String(category.name));
    if (category.category_name) tokens.push(String(category.category_name));
    if (category.title) tokens.push(String(category.title));
  }
  const searchStr = tokens.join(' ').toLowerCase().trim();

  // 3. Match against canonical dictionary
  for (const item of Object.values(CATEGORY_TRANSLATIONS)) {
    for (const pattern of item.match) {
      if (searchStr.includes(pattern)) {
        return item[targetLang];
      }
    }
  }

  // 4. Safe fallback
  if (typeof category === 'object' && category !== null) {
    return category.name || category.title || '';
  }
  return String(category || '');
}

