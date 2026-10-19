import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Loader2,
  Package,
  CornerDownLeft
} from 'lucide-react';
import { api } from '../services/api';
import { formatDZD } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

const RECENT_SEARCHES_KEY = 'novacart_recent_searches';
const POPULAR_SEARCHES = [
  'Casque ANC',
  'Clavier Mécanique',
  'Montre Titanium',
  'Sac à dos étanche',
  'Tracker Fitness',
  'Audio Studio'
];

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  onSelectProduct, 
  categories = [], 
  onSelectCategory,
  onNavigateToCatalog
}) {
  const { language, t, getCategoryName, isRTL } = useLanguage();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const filtered = recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter(s => s !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
  };

  const clearAllRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      // Ignore
    }
  };

  // Global keyboard shortcut: '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger if user is already typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live autocomplete preview when localQuery changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = localQuery.trim();
    if (!trimmed) {
      setPreviewProducts([]);
      setTotalCount(0);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.getProducts({ search: trimmed, limit: 5 });
        setPreviewProducts(res.items || []);
        setTotalCount(res.pagination?.total || (res.items || []).length);
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localQuery]);

  // Execute full search on main catalog
  const executeSearch = (term) => {
    const q = term.trim();
    saveRecentSearch(q);
    setSearchQuery(q);
    setIsOpen(false);
    inputRef.current?.blur();
    onNavigateToCatalog?.();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < previewProducts.length - 1 ? prev + 1 : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : previewProducts.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && previewProducts[selectedIndex]) {
        // User pressed Enter on a highlighted preview product
        handleSelectPreviewProduct(previewProducts[selectedIndex]);
      } else {
        // User pressed Enter on current query
        executeSearch(localQuery);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectPreviewProduct = (product) => {
    saveRecentSearch(product.title);
    setIsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setPreviewProducts([]);
    setTotalCount(0);
    inputRef.current?.focus();
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-emerald-400 font-bold underline decoration-emerald-500/40">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className={`relative flex items-center w-full transition-all duration-200 rounded-xl bg-slate-800/90 border ${
        isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'border-slate-700/80 hover:border-slate-600'
      }`}>
        <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400">
          {loading ? (
            <Loader2 size={16} className="text-emerald-400 animate-spin" />
          ) : (
            <Search size={16} className={isOpen ? 'text-emerald-400' : 'text-slate-400'} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search_placeholder')}
          className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          autoComplete="off"
          spellCheck="false"
        />

        <div className="pr-3 flex items-center gap-1.5">
          {localQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
              title="Effacer la recherche"
              aria-label="Effacer la recherche"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-900/80 text-[10px] font-mono text-slate-400 select-none pointer-events-none shadow-sm">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Instant Interactive Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-800/80 text-xs text-slate-200">
          
          {/* STATE A: Empty Query - Recent Searches & Popular Tags */}
          {!localQuery.trim() && (
            <div className="p-4 space-y-4">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-emerald-400" />
                      Recherches Récentes
                    </span>
                    <button
                      onClick={clearAllRecentSearches}
                      className="text-slate-500 hover:text-rose-400 transition-colors normal-case font-medium text-[10px]"
                    >
                      Effacer tout
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, i) => (
                      <span
                        key={i}
                        onClick={() => {
                          setLocalQuery(term);
                          executeSearch(term);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white text-xs cursor-pointer transition-colors group"
                      >
                        <Clock size={11} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="Supprimer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches in Algeria */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <TrendingUp size={12} className="text-amber-400" />
                  <span>Tendances en Algérie</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setLocalQuery(term);
                        executeSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>🔥</span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              {categories.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Tag size={12} className="text-cyan-400" />
                    <span>{t('search_popular_categories')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory?.(cat.id);
                          setIsOpen(false);
                          onNavigateToCatalog?.();
                        }}
                        className={`p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 ${isRTL ? 'text-right' : 'text-left'} text-slate-300 hover:text-white transition-colors flex items-center justify-between`}
                      >
                        <span className="truncate">{getCategoryName(cat)}</span>
                        <ArrowRight size={12} className={`text-slate-500 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STATE B: Live Results Found */}
          {localQuery.trim() && previewProducts.length > 0 && (
            <div>
              <div className="px-4 py-2.5 bg-slate-950/60 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-emerald-400" />
                  Suggestions de Produits ({totalCount})
                </span>
                <span className="text-[10px] text-slate-500 normal-case font-normal hidden sm:inline">
                  Utilisez ↑ ↓ pour naviguer, Entrée pour ouvrir
                </span>
              </div>

              <div className="divide-y divide-slate-800/50 max-h-80 overflow-y-auto">
                {previewProducts.map((product, idx) => {
                  const img = Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : (typeof product.images === 'string' ? JSON.parse(product.images || '[]')[0] : '');
                  const isHighlighted = selectedIndex === idx;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectPreviewProduct(product)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        isHighlighted ? 'bg-emerald-500/10' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 flex-shrink-0 flex items-center justify-center">
                        {img ? (
                          <img src={img} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className="text-slate-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-white truncate text-xs sm:text-sm">
                            {highlightMatch(product.title, localQuery.trim())}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="text-emerald-400 uppercase font-semibold">
                            {product.category_name || t('card_catalog')}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{product.sku}</span>
                          <span>•</span>
                          <span className="text-emerald-300">{t('modal_in_stock')}</span>
                        </div>
                      </div>

                      {/* Price in Algerian Dinars */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-xs sm:text-sm text-emerald-400">
                          {formatDZD(product.price, language)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all search results footer button */}
              <button
                type="button"
                onClick={() => executeSearch(localQuery)}
                className="w-full p-3 bg-slate-950/80 hover:bg-emerald-950/40 border-t border-slate-800/80 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors group"
              >
                <span>Voir tous les {totalCount} résultats pour « {localQuery.trim()} »</span>
                <CornerDownLeft size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* STATE C: Query typed but 0 results found */}
          {localQuery.trim() && !loading && previewProducts.length === 0 && (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  Aucun résultat pour « {localQuery.trim()} »
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Vérifiez l'orthographe ou essayez des mots-clés plus généraux.
                </p>
              </div>

              {/* Alternative Recommendations */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Suggestions populaires :
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {POPULAR_SEARCHES.slice(0, 4).map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setLocalQuery(term);
                        executeSearch(term);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
