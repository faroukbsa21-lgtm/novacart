import React from 'react';
import { Star, ShoppingBag, Eye, Check, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDZD } from '../utils/formatters';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, items } = useCart();
  const { isAdmin } = useAuth();
  const { language, t, getCategoryName, isRTL } = useLanguage();

  const inCart = items.some(item => item.product.id === product.id);
  const imageUrl = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : (typeof product.images === 'string' ? JSON.parse(product.images || '[]')[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');

  const price = parseFloat(product.price) || 0;
  const comparePrice = parseFloat(product.compare_at_price) || 0;
  const hasDiscount = comparePrice > price;
  const discountPercent = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const stock = typeof product.stock_quantity === 'number'
    ? product.stock_quantity
    : (parseInt(product.stock_quantity, 10) || 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer relative"
    >
      {/* Product Image Frame */}
      <div className="relative h-44 sm:h-48 md:h-52 w-full overflow-hidden bg-slate-800/90 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className={`absolute top-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} flex flex-col gap-1 z-10`}>
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow">
              {t('card_out_of_stock')}
            </span>
          ) : (
            product.is_featured && (
              <span className="bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                {t('sort_featured')}
              </span>
            )
          )}
          {hasDiscount && (
            <span className="bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
              -{discountPercent}%
            </span>
          )}
          {isAdmin && (
            <span className="bg-purple-900/90 text-purple-200 border border-purple-500/40 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow backdrop-blur flex items-center gap-1">
              <Settings size={10} className="text-purple-300" />
              Stock: {product.stock_quantity ?? 0}
            </span>
          )}
        </div>

        {/* Reassurance Badge */}
        <div className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'} z-10 pointer-events-none`}>
          <span className="bg-slate-950/80 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-md backdrop-blur">
            🇩🇿 69 Wilayas
          </span>
        </div>

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur border border-slate-700 flex items-center gap-1.5 shadow-lg">
            <Eye size={13} className="text-emerald-400" />
            {t('card_preview')}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] sm:text-[11px] text-emerald-400 truncate max-w-[120px]">
              {getCategoryName(product.category_name || product.category?.name || product.category) || t('card_catalog')}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-slate-500">{product.sku}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-100 text-xs sm:text-sm md:text-base mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating & Stock Warning */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                <Star size={12} fill="currentColor" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200">{Number(product.rating || 5).toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">({product.num_reviews || 0})</span>
            </div>
            {isLowStock && (
              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                {t('low_stock_warning', { count: stock })}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row - Strictly in Algerian Dinars (DZD) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-emerald-400">
                {formatDZD(price, language)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-500 line-through">
                  {formatDZD(comparePrice, language)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400">
              <span className="text-slate-300">{t('card_cod_badge')}</span>
            </div>
          </div>

          {isAdmin ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }}
              className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-1"
              title="Inspecter le produit"
            >
              <Settings size={14} />
              <span className="hidden sm:inline text-[11px]">{t('card_manage')}</span>
            </button>
          ) : isOutOfStock ? (
            <button
              disabled={true}
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] bg-slate-800 text-rose-400/90 border border-rose-500/30 cursor-not-allowed opacity-80"
              title={t('card_out_of_stock')}
            >
              <span>{t('card_out_of_stock')}</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 text-xs shadow-md ${
                inCart
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/20 active:scale-95'
              }`}
              title={t('modal_add_to_cart')}
            >
              {inCart ? (
                <>
                  <Check size={14} />
                  <span className="hidden sm:inline font-bold">{t('card_added')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span className="hidden sm:inline font-bold">{t('card_add')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
