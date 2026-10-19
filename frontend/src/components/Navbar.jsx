import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  ShieldCheck, 
  LogOut, 
  Package, 
  LayoutDashboard, 
  Menu,
  X,
  Globe,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import SearchBar from './SearchBar';

export default function Navbar({ 
  onOpenAuth, 
  onOpenAdmin, 
  onOpenOrders, 
  backendHealth, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onSelectProduct,
  onNavigateToCatalog
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t, getCategoryName, supportedLanguages, currentLanguageMeta, isRTL } = useLanguage();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">{t('topbar_delivery')}</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">{t('topbar_cod')}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-emerald-400 font-semibold">
          <span>{t('topbar_authentic')}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Nova<span className="text-emerald-400">Cart</span>
                </span>
                <span className="hidden md:block text-[10px] text-emerald-400 tracking-wider uppercase font-semibold">
                  {t('brand_sub')}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectProduct={onSelectProduct}
              categories={categories}
              onSelectCategory={setSelectedCategory}
              onNavigateToCatalog={onNavigateToCatalog}
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Dropdown (AR / EN / FR) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700 transition-all shadow-sm"
                title="Change Language / تغيير اللغة"
                aria-label="Change Language"
              >
                <span className="text-base leading-none">{currentLanguageMeta.flag}</span>
                <span className="hidden sm:inline uppercase">{currentLanguageMeta.code}</span>
              </button>

              {langMenuOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 text-xs animate-fade-in`}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Language / اللغة
                  </div>
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-800 transition-colors ${
                        language === l.code ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check size={14} className="text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Direct Action Button */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all active:scale-95"
              >
                <LayoutDashboard size={15} />
                <span>{t('nav_admin')}</span>
              </button>
            )}

            {/* Customer My Orders Direct Button */}
            {isAuthenticated && !isAdmin && (
              <button
                onClick={onOpenOrders}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all"
              >
                <Package size={15} className="text-emerald-400" />
                <span>{t('nav_orders')}</span>
              </button>
            )}

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-sm font-medium text-slate-200 border border-slate-700 transition-all"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isAdmin ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'U')}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user?.full_name || (isAdmin ? t('nav_role_admin') : t('nav_role_customer'))}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold uppercase">
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 text-sm animate-fade-in`}>
                    <div className="px-4 py-2 border-b border-slate-700/80">
                      <p className="font-semibold text-white truncate">{user?.full_name || t('nav_account')}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {user?.role || t('nav_role_customer')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {currentLanguageMeta.flag} {currentLanguageMeta.code.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { setUserMenuOpen(false); onOpenAdmin(); }}
                        className="w-full text-left px-4 py-2.5 text-purple-300 hover:bg-slate-700/60 flex items-center gap-2 font-medium"
                      >
                        <LayoutDashboard size={16} />
                        <span>{t('nav_admin')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setUserMenuOpen(false); onOpenOrders(); }}
                      className="w-full text-left px-4 py-2.5 text-slate-200 hover:bg-slate-700/60 flex items-center gap-2"
                    >
                      <Package size={16} className="text-slate-400" />
                      <span>{isAdmin ? t('admin_bar_orders') : t('nav_orders')}</span>
                    </button>

                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2.5 text-rose-400 hover:bg-slate-700/60 flex items-center gap-2 border-t border-slate-700/80 mt-1"
                    >
                      <LogOut size={16} />
                      <span>{t('nav_signout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-sm font-semibold text-slate-200 border border-slate-700 transition-all"
              >
                <User size={16} className="text-emerald-400" />
                <span>{t('nav_signin')}</span>
              </button>
            )}

            {/* Cart Trigger Button - Shoppers & Guests only (Hidden for Admin) */}
            {!isAdmin && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5"
                aria-label="Open Cart"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline text-xs font-extrabold">{t('nav_cart')}</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={onSelectProduct}
            categories={categories}
            onSelectCategory={setSelectedCategory}
            onNavigateToCatalog={onNavigateToCatalog}
          />
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-3 animate-fade-in">
            {/* Language Selection in Mobile Menu */}
            <div className="flex items-center justify-between px-2 py-1 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Globe size={14} className="text-emerald-400" />
                <span>اللغة / Language</span>
              </span>
              <div className="flex gap-1">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === l.code ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              {t('nav_all_categories')}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => { setSelectedCategory(null); setMobileMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                  selectedCategory === null ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {t('nav_all_products')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setMobileMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                    selectedCategory === cat.id ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills Bar (Desktop) */}
      <div className="hidden md:block bg-slate-900/60 border-t border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === null 
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            {t('nav_all_products')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
