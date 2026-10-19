import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDZD } from '../utils/formatters';

export default function OrdersModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { language, t, isRTL } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await api.getMyOrders();
        setOrders(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={12} /> {t('status_delivered')}</span>;
      case 'shipped':
        return <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Truck size={12} /> {t('status_shipped')}</span>;
      case 'processing':
        return <span className="text-[11px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> {t('status_processing')}</span>;
      case 'cancelled':
        return <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={12} /> {t('status_cancelled')}</span>;
      default:
        return <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> {t('status_pending')}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Package className="text-emerald-400" size={22} />
          <div>
            <h2 className="text-xl font-bold text-white">{t('orders_title')}</h2>
            <p className="text-xs text-slate-400">{t('orders_subtitle')} {user?.email || ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{t('orders_loading')}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-white mb-1">{t('orders_empty_title')}</h4>
            <p className="text-xs text-slate-400">{t('orders_empty_desc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-white">{ord.order_number}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {t('orders_placed_on')} {new Date(ord.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(ord.status)}
                  </div>
                </div>

                {/* Items */}
                {ord.items && ord.items.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{it.quantity}x {it.product_title || 'Item'}</span>
                        <span className="font-medium text-white">{formatDZD(parseFloat(it.unit_price) * it.quantity, language)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shipping Details */}
                {ord.shipping_address && (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-300">
                        📍 {ord.shipping_address.wilaya_name ? `${ord.shipping_address.wilaya_code || ''} - ${isRTL ? (ord.shipping_address.wilaya_ar || ord.shipping_address.wilaya_name) : ord.shipping_address.wilaya_name}` : (ord.shipping_address.city || 'Algérie')}
                      </span>
                      {ord.shipping_address.city && (
                        <span className="text-slate-500 block text-[10px]">
                          {ord.shipping_address.city} {ord.shipping_address.street ? `— ${ord.shipping_address.street}` : ''}
                        </span>
                      )}
                    </div>
                    <div className={isRTL ? 'text-left' : 'text-right'}>
                      <span className="text-emerald-400 font-medium block">
                        {ord.shipping_address.delivery_type === 'desk' ? t('confirm_desk_label') : t('confirm_home_label')}
                      </span>
                      {ord.shipping_address.shipping_fee_dzd && (
                        <span className="text-slate-500 text-[10px]">
                          {formatDZD(ord.shipping_address.shipping_fee_dzd, language)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Total strictly in DZD */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-400">{t('orders_total')}</span>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="font-bold text-sm text-emerald-400">
                      {formatDZD(parseFloat(ord.total_amount), language)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
