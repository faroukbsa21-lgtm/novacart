import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Tag, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDZD } from '../utils/formatters';

export default function CartDrawer({ onCheckout }) {
  const { isAdmin } = useAuth();
  const { language, t, isRTL } = useLanguage();
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    discount, 
    total,
    applyPromo,
    promoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (isAdmin || !isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage(res);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0 pr-10' : 'right-0 pl-10'} max-w-full flex`}>
        <div className={`w-screen max-w-md bg-slate-900 ${isRTL ? 'border-r' : 'border-l'} border-slate-800 shadow-2xl flex flex-col`}>
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-emerald-400" size={20} />
              <h2 className="text-lg font-bold text-white">{t('cart_title')}</h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                {items.length} {items.length === 1 ? t('items_count_single') : t('items_count_plural')}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-white text-base mb-1">{t('cart_empty_title')}</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  {t('cart_empty_desc')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  {t('cart_browse_cta')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const img = Array.isArray(item.product.images) && item.product.images.length > 0
                  ? item.product.images[0]
                  : (typeof item.product.images === 'string' ? JSON.parse(item.product.images || '[]')[0] : '');

                const maxStock = typeof item.product?.stock_quantity === 'number'
                  ? item.product.stock_quantity
                  : (parseInt(item.product?.stock_quantity, 10) || 0);
                const isAtMaxStock = maxStock > 0 && item.quantity >= maxStock;

                return (
                  <div 
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/80 flex gap-3.5 items-center group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/60">
                      <img 
                        src={img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate mb-1">
                        {item.product.title}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-xs font-black text-emerald-400">
                          {formatDZD(item.product.price, language)}
                        </span>
                      </div>

                      {/* Quantity Controls & Stock Enforcement */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={isAtMaxStock}
                            className={`p-1 text-slate-400 hover:text-white transition-colors ${
                              isAtMaxStock ? 'opacity-30 cursor-not-allowed hover:text-slate-400' : ''
                            }`}
                            title={isAtMaxStock ? t('stock_max_reached') : 'Increase quantity'}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className={`p-1.5 text-slate-500 hover:text-rose-400 transition-colors ${isRTL ? 'mr-auto' : 'ml-auto'}`}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Stock Cap Feedback */}
                      {isAtMaxStock && (
                        <div className="mt-1 text-[10px] text-amber-400 font-medium">
                          {t('cart_max_stock_note', { max: maxStock })}
                        </div>
                      )}
                      {maxStock <= 0 && (
                        <div className="mt-1 text-[10px] text-rose-400 font-bold">
                          {t('modal_out_of_stock')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} size={14} />
                  <input
                    type="text"
                    placeholder={t('cart_promo_placeholder')}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className={`w-full bg-slate-900 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 uppercase tracking-wider focus:outline-none focus:border-emerald-500`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  {t('cart_promo_apply')}
                </button>
              </form>

              {promoMessage && (
                <div className={`text-[11px] p-2 rounded-lg flex items-center gap-1.5 ${
                  promoMessage.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {promoMessage.success ? <Check size={12} /> : null}
                  <span>{promoMessage.message}</span>
                </div>
              )}

              {/* Calculations strictly in DZD */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>{t('cart_subtotal')}</span>
                  <span className="text-white font-medium">{formatDZD(subtotal, language)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>{t('cart_discount')} ({promoCode})</span>
                    <span>-{formatDZD(discount, language)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>{t('cart_shipping_estimate')}</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">
                    {t('cart_shipping_range')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-base font-extrabold text-white pt-2.5 border-t border-slate-800">
                  <span>{t('cart_total_estimate')}</span>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="text-emerald-400 font-black text-lg block">
                      {formatDZD(total, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>{t('cart_checkout_cta')}</span>
                <ArrowIcon size={16} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>{t('cart_reassurance')}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
