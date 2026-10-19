import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus,
  MessageSquare,
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDZD } from '../utils/formatters';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const { language, t, getCategoryName, isRTL } = useLanguage();

  const stock = typeof product?.stock_quantity === 'number'
    ? product.stock_quantity
    : (parseInt(product?.stock_quantity, 10) || 0);
  const isOutOfStock = stock <= 0;

  const [quantity, setQuantity] = useState(() => (stock > 0 ? 1 : 0));
  const isAtMaxStock = stock > 0 && quantity >= stock;
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = Array.isArray(product?.images) 
    ? product.images 
    : (typeof product?.images === 'string' ? JSON.parse(product?.images || '[]') : []);
  
  const displayImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

  const price = parseFloat(product?.price) || 0;
  const comparePrice = parseFloat(product?.compare_at_price) || 0;
  const hasDiscount = comparePrice > price;

  useEffect(() => {
    if (!product?.id) return;
    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const data = await api.getReviews(product.id);
        setReviews(data || []);
      } catch (err) {
        console.warn('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product?.id]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewPayload = {
        product_id: product.id,
        user_name: user?.full_name || 'Verified Customer',
        rating: newRating,
        title: newTitle.trim(),
        comment: newComment.trim(),
        is_verified_purchase: true
      };

      await api.addReview(reviewPayload);
      setReviewSuccess(true);
      setReviews(prev => [reviewPayload, ...prev]);
      setNewTitle('');
      setNewComment('');
    } catch (err) {
      // Local fallback
      const localReview = {
        id: 'rev_' + Date.now(),
        product_id: product.id,
        user_name: user?.full_name || 'Verified Customer',
        rating: newRating,
        title: newTitle.trim(),
        comment: newComment.trim(),
        is_verified_purchase: true,
        created_at: new Date().toISOString()
      };
      setReviews(prev => [localReview, ...prev]);
      setReviewSuccess(true);
      setNewTitle('');
      setNewComment('');
    } finally {
      setSubmittingReview(false);
    }
  };

  const whatsappMessage = t('modal_whatsapp_msg', {
    title: product.title,
    qty: quantity,
    price: formatDZD(price * quantity, language)
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Left: Gallery */}
          <div className="flex flex-col gap-4">
            <div className="h-60 sm:h-72 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-800/90 border border-slate-700/80 relative flex items-center justify-center">
              <img
                src={displayImages[activeImageIdx] || displayImages[0]}
                alt={product.title}
                className="w-full h-full object-contain p-2"
              />
              {hasDiscount && (
                <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow`}>
                  PROMO
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {displayImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center">
                <ShieldCheck size={18} className="text-emerald-400 mb-1" />
                <span className="font-bold text-slate-200">{t('modal_trust_inspection')}</span>
                <span className="text-[10px] text-slate-400">{t('modal_trust_inspection_desc')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center">
                <Truck size={18} className="text-cyan-400 mb-1" />
                <span className="font-bold text-slate-200">{t('modal_trust_wilayas')}</span>
                <span className="text-[10px] text-slate-400">{t('modal_trust_wilayas_desc')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center">
                <RotateCcw size={18} className="text-purple-400 mb-1" />
                <span className="font-bold text-slate-200">{t('modal_trust_cod')}</span>
                <span className="text-[10px] text-slate-400">{t('modal_trust_cod_desc')}</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-emerald-400">
                  {getCategoryName(product.category_name || product.category?.name || product.category) || t('card_catalog')}
                </span>
                <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.round(product.rating || 5) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-200">{Number(product.rating || 5).toFixed(1)}</span>
                <span className="text-xs text-slate-400">({product.num_reviews || 0} {t('card_reviews')})</span>
              </div>

              {/* Price strictly in Algerian Dinars (DZD) */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {formatDZD(price, language)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      {formatDZD(comparePrice, language)}
                    </span>
                  )}
                </div>
                {isOutOfStock ? (
                  <span className={`${isRTL ? 'sm:mr-auto' : 'sm:ml-auto'} text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30 inline-flex items-center gap-1.5 self-start`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    {t('modal_out_of_stock')}
                  </span>
                ) : (
                  <span className={`${isRTL ? 'sm:mr-auto' : 'sm:ml-auto'} text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5 self-start`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t('modal_in_stock')} ({stock} {t('modal_available')})
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity selector & Add to cart & WhatsApp Order */}
              <div className="space-y-3 mb-6">
                {!isAdmin ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800/80 px-2 py-1 justify-between sm:justify-start">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={isOutOfStock || quantity <= 1}
                          className={`p-2 text-slate-400 hover:text-white transition-colors ${
                            isOutOfStock || quantity <= 1 ? 'opacity-30 cursor-not-allowed hover:text-slate-400' : ''
                          }`}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-mono font-bold text-sm text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                          disabled={isOutOfStock || isAtMaxStock}
                          className={`p-2 text-slate-400 hover:text-white transition-colors ${
                            isOutOfStock || isAtMaxStock ? 'opacity-30 cursor-not-allowed hover:text-slate-400' : ''
                          }`}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed shadow-none'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        }`}
                      >
                        <ShoppingBag size={18} />
                        <span>
                          {isOutOfStock
                            ? t('modal_out_of_stock')
                            : `${t('modal_add_to_cart')} • ${formatDZD(price * Math.max(1, quantity), language)}`}
                        </span>
                      </button>
                    </div>

                    {/* Stock max note */}
                    {isAtMaxStock && !isOutOfStock && (
                      <div className="text-[11px] text-amber-400 font-medium">
                        {t('stock_max_reached')} ({stock} {t('modal_available')})
                      </div>
                    )}

                    {/* WhatsApp Fast Order Direct Button */}
                    {!isOutOfStock && (
                      <a
                        href={`https://wa.me/213550000000?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md group"
                      >
                        <MessageSquare size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>{t('modal_order_whatsapp')}</span>
                      </a>
                    )}
                  </>
                ) : (
                  <div className="w-full p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-between">
                    <span>{t('modal_admin_view')}</span>
                    <span className="font-mono bg-purple-900/60 px-2.5 py-1 rounded-lg text-white font-bold">
                      {t('modal_stock_badge')} {product.stock_quantity ?? 0}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-slate-800 p-6 sm:p-8 bg-slate-950/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-400" />
              <span>{t('modal_reviews_title')} ({reviews.length})</span>
            </h3>
          </div>

          {/* Write a review form */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6">
            <h4 className="text-sm font-semibold text-slate-200 mb-2">{t('modal_leave_review')}</h4>
            {reviewSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                {t('modal_review_success')}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">{t('modal_your_rating')}</span>
                  <div className="flex gap-1 text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star size={18} fill={star <= newRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder={t('modal_review_headline_placeholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <textarea
                  rows={2}
                  placeholder={t('modal_review_comment_placeholder')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{submittingReview ? t('modal_submitting') : t('modal_submit_review')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Reviews List */}
          {loadingReviews ? (
            <p className="text-xs text-slate-400 text-center py-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('modal_loading_reviews')}</span>
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">{t('modal_no_reviews')}</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev, index) => (
                <div key={rev.id || index} className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200">{rev.user_name}</span>
                      {rev.is_verified_purchase && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <Check size={10} /> {t('modal_verified_purchase')}
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  {rev.title && <h5 className="font-semibold text-xs text-slate-100 mb-1">{rev.title}</h5>}
                  <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
