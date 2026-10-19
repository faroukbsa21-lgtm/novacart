import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import OrdersModal from './components/OrdersModal';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import { api } from './services/api';
import { 
  ArrowUpDown, 
  Search, 
  LayoutDashboard, 
  Package, 
  X
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { language, t, getCategoryName, isRTL } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const catalogRef = useRef(null);

  // Load initial backend health & categories
  useEffect(() => {
    async function init() {
      const health = await api.checkHealth();
      setBackendHealth(health);

      const cats = await api.getCategories();
      setCategories(cats || []);
    }
    init();
  }, []);

  // Fetch products when filters change
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      setProducts(res.items || []);
    } catch (err) {
      console.warn('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        backendHealth={backendHealth}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onNavigateToCatalog={scrollToCatalog}
      />

      {/* Admin Mode Quick Toolbar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 border-b border-purple-800/50 px-4 py-2.5 text-xs text-purple-200 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px] bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                {t('admin_bar_active')}
              </span>
              <span className="text-purple-300 font-medium">{t('admin_bar_logged_as')} {user?.full_name || 'Admin'}</span>
              <span className="hidden md:inline text-slate-500 font-mono text-[11px]">({user?.email})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5 active:scale-95"
              >
                <LayoutDashboard size={14} />
                <span>{t('admin_bar_open')}</span>
              </button>
              <button
                onClick={() => setIsOrdersOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all flex items-center gap-1.5"
              >
                <Package size={14} />
                <span>{t('admin_bar_orders')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Mode Welcome Bar */}
      {isAuthenticated && !isAdmin && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-800/40 px-4 py-2 text-xs text-emerald-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">👋 {t('user_welcome')} {user?.full_name || t('nav_role_customer')} !</span>
              <span className="hidden sm:inline text-slate-400">{t('user_welcome_sub')}</span>
            </div>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <Package size={13} />
              <span>{t('nav_orders')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero onExploreClick={scrollToCatalog} />

      {/* Main Catalog Section */}
      <main ref={catalogRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Active Search & Filter Banner */}
        {searchQuery && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <Search size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">{t('search_results_for')}</span>
                  <span className="font-extrabold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    « {searchQuery} »
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    ({products.length} {products.length <= 1 ? t('search_available_single') : t('search_available_plural')})
                  </span>
                </div>
                {selectedCategory && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t('search_in_category')} <span className="text-emerald-300 font-semibold">{getCategoryName(categories.find(c => c.id === selectedCategory) || selectedCategory)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <X size={13} />
                <span>{t('search_clear')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Controls Bar: Title, Category Pills & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>
                {selectedCategory
                  ? getCategoryName(categories.find(c => c.id === selectedCategory) || selectedCategory) || t('catalog_filtered')
                  : (searchQuery ? t('catalog_search_title') : t('catalog_title'))}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                {products.length} {products.length === 1 ? t('items_count_single') : t('items_count_plural')}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('catalog_subtitle')}
            </p>
          </div>

          {/* Sort & Filter controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span className="text-slate-400">{t('catalog_sort_by')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-slate-900">{t('sort_featured')}</option>
                <option value="price_asc" className="bg-slate-900">{t('sort_price_asc')}</option>
                <option value="price_desc" className="bg-slate-900">{t('sort_price_desc')}</option>
                <option value="rating" className="bg-slate-900">{t('sort_rating')}</option>
              </select>
            </div>

            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 font-medium transition-colors"
              >
                {t('reset_filter')}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-44 sm:h-48 md:h-52 w-full bg-slate-800/70" />
                <div className="p-3 sm:p-4 space-y-2.5">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="h-5 bg-slate-800 rounded w-1/3" />
                    <div className="h-7 w-16 bg-slate-800 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
              <Search size={30} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {searchQuery ? `${t('search_no_results')} « ${searchQuery} »` : t('search_no_results')}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {t('search_no_results_desc')}
              </p>
            </div>

            {/* Smart Suggestions */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                💡 {t('search_suggestions_title')}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Casque ANC', 'Clavier Mécanique', 'Montre Titanium', 'Sac à dos étanche'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery(term);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                {t('search_all_catalog')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Cart & Checkout Modals (Shoppers & Guests only) */}
      {!isAdmin && (
        <>
          <CartDrawer 
            onCheckout={() => setIsCheckoutOpen(true)} 
          />
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductUpdated={fetchProducts}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Floating WhatsApp Quick Order & Assistance */}
      {!isAdmin && <WhatsAppWidget />}

    </div>
  );
}
