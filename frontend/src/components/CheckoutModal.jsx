import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Building2,
  Home,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDZD } from '../utils/formatters';
import { 
  ALGERIA_WILAYAS, 
  DELIVERY_TYPES, 
  calculateShippingFee, 
  getWilayaByCode,
  getCommunesForWilaya
} from '../constants/algeriaShipping';

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, subtotal, discount, clearCart } = useCart();
  const { user } = useAuth();
  const { language, t, isRTL } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Algerian Shipping State (Default 16: Alger)
  const [selectedWilaya, setSelectedWilaya] = useState(16);
  const [deliveryType, setDeliveryType] = useState(DELIVERY_TYPES.HOME); // 'home' | 'desk'

  const communesList = getCommunesForWilaya(selectedWilaya);

  // Form Fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [commune, setCommune] = useState(() => communesList[0]?.name || 'Alger Centre');
  const [street, setStreet] = useState('');
  const [deskLocation, setDeskLocation] = useState('');
  const [postalCode, setPostalCode] = useState(() => communesList[0]?.postalCode || '16000');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default COD
  const [customerNotes, setCustomerNotes] = useState('');

  const handleWilayaChange = (code) => {
    setSelectedWilaya(code);
    const newCommunes = getCommunesForWilaya(code);
    if (newCommunes && newCommunes.length > 0) {
      setCommune(newCommunes[0].name);
      setPostalCode(newCommunes[0].postalCode || `${String(code).padStart(2, '0')}000`);
    } else {
      setCommune('');
      setPostalCode(`${String(code).padStart(2, '0')}000`);
    }
  };

  if (!isOpen) return null;

  // Active wilaya and shipping calculations strictly in Algerian Dinars (DZD)
  const currentWilaya = getWilayaByCode(selectedWilaya) || ALGERIA_WILAYAS[15];
  const shippingInfo = calculateShippingFee(selectedWilaya, deliveryType, language);
  const shippingFeeDZD = shippingInfo.dzd || 0;
  
  // Tax calculation in DZD (5% standard rate)
  const taxRate = 0.05;
  const taxableBase = Math.max(0, subtotal - discount);
  const taxAmountDZD = Math.round(taxableBase * taxRate);

  // Accurate Grand Total in DZD (Subtotal - Discount + Shipping + Tax)
  const grandTotalDZD = Math.max(0, Math.round(subtotal - discount + shippingFeeDZD + taxAmountDZD));

  const wilayaDisplayName = isRTL 
    ? `${currentWilaya.codeStr} - ${currentWilaya.arName} (${currentWilaya.name})`
    : `${currentWilaya.codeStr} - ${currentWilaya.name} (${currentWilaya.arName})`;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !commune.trim()) {
      setError(t('checkout_error_fields'));
      return;
    }

    if (deliveryType === DELIVERY_TYPES.HOME && !street.trim()) {
      setError(t('checkout_error_street'));
      return;
    }

    // Verify stock availability for all cart items
    const overstockedItem = items.find(item => {
      const stock = typeof item.product?.stock_quantity === 'number'
        ? item.product.stock_quantity
        : (parseInt(item.product?.stock_quantity, 10) || 0);
      return item.quantity > stock || stock <= 0;
    });

    if (overstockedItem) {
      const maxStock = overstockedItem.product?.stock_quantity ?? 0;
      setError(
        maxStock <= 0
          ? `${overstockedItem.product.title}: ${t('modal_out_of_stock')}`
          : `${overstockedItem.product.title}: ${t('stock_exceeded_error', { max: maxStock })}`
      );
      return;
    }

    setLoading(true);

    const fullStreetAddress = deliveryType === DELIVERY_TYPES.DESK
      ? (deskLocation.trim() || `Bureau Stop Desk ${currentWilaya.name}`)
      : street.trim();

    const orderPayload = {
      customer_name: fullName.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      shipping_address: {
        street: fullStreetAddress,
        desk_address: deliveryType === DELIVERY_TYPES.DESK ? (deskLocation.trim() || 'Bureau Principal') : null,
        city: commune.trim(),
        state: currentWilaya.name,
        wilaya_code: currentWilaya.code,
        wilaya_name: currentWilaya.name,
        wilaya_ar: currentWilaya.arName,
        delivery_type: deliveryType,
        delivery_label: deliveryType === DELIVERY_TYPES.DESK ? t('checkout_desk_title') : t('checkout_home_title'),
        shipping_fee_dzd: shippingFeeDZD,
        postal_code: postalCode.trim() || `${currentWilaya.codeStr}000`,
        country: 'Algérie'
      },
      payment_method: paymentMethod,
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: parseFloat(item.product.price) || 0
      })),
      subtotal,
      discount_amount: discount,
      shipping_amount: shippingFeeDZD,
      tax_amount: taxAmountDZD,
      total_amount: grandTotalDZD,
      notes: customerNotes.trim()
    };

    try {
      const result = await api.createOrder(orderPayload);
      clearCart();
      const realOrder = result.order || result.data || result;
      setCompletedOrder({
        order_number: realOrder.order_number || ('ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        total: grandTotalDZD,
        email: email.trim(),
        wilaya: currentWilaya,
        deliveryType,
        shippingInfo
      });
    } catch (err) {
      setError(err.message || 'Impossible de finaliser la commande. Veuillez vérifier vos informations et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{t('confirm_title')}</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              {t('confirm_message')} <strong className="text-white">{completedOrder.email}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 max-w-md mx-auto mb-6 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('confirm_order_number')}</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{completedOrder.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('confirm_destination')}</span>
                <span className="text-white font-medium">
                  {completedOrder.wilaya.codeStr} - {isRTL ? completedOrder.wilaya.arName : completedOrder.wilaya.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('confirm_delivery_mode')}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  {completedOrder.deliveryType === DELIVERY_TYPES.DESK ? (
                    <>{t('confirm_desk_label')}</>
                  ) : (
                    <>{t('confirm_home_label')}</>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('confirm_estimated')}</span>
                <span className="text-white font-medium">{completedOrder.wilaya.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{t('confirm_shipping_fee')}</span>
                <span className="text-white font-medium">
                  {formatDZD(completedOrder.shippingInfo.dzd, language)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-700 font-bold text-sm">
                <span className="text-white">{t('confirm_total_due')}</span>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <span className="text-emerald-400 font-black text-lg">
                    {formatDZD(completedOrder.total, language)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              {t('confirm_back_btn')}
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Lock className="text-emerald-400" size={22} />
              <div>
                <h2 className="text-xl font-bold text-white">{t('checkout_title')}</h2>
                <p className="text-xs text-slate-400">{t('checkout_subtitle')}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* 1. Wilaya Selection & Delivery Mode (DESK vs HOME) */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                    <Truck size={14} />
                    <span>{t('checkout_step1')}</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    69 Wilayas
                  </span>
                </div>

                {/* Wilaya Selector (1 to 69) */}
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                    <span>{t('checkout_wilaya_label')}</span>
                    <span className="text-[10px] text-slate-400">{t('checkout_zone')} {currentWilaya.zone}</span>
                  </label>
                  <select
                    value={selectedWilaya}
                    onChange={(e) => handleWilayaChange(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {isRTL 
                          ? `${w.codeStr} - ${w.arName} (${w.name}) — مكتب: ${w.deskPriceDZD} د.ج / منزل: ${w.homePriceDZD} د.ج`
                          : `${w.codeStr} - ${w.name} (${w.arName}) — Stop Desk: ${w.deskPriceDZD} DA / Domicile: ${w.homePriceDZD} DA`
                        }
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Option Toggle: STOP DESK vs HOME */}
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-2">
                    {t('checkout_delivery_type_label')} {isRTL ? currentWilaya.arName : currentWilaya.name} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Option 1: Stop Desk / Office Delivery */}
                    <label 
                      onClick={() => setDeliveryType(DELIVERY_TYPES.DESK)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        deliveryType === DELIVERY_TYPES.DESK 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className={deliveryType === DELIVERY_TYPES.DESK ? 'text-emerald-400' : 'text-slate-400'} />
                          <div>
                            <span className="text-xs font-bold block text-white">{t('checkout_desk_title')}</span>
                            <span className="text-[10px] text-slate-400">{t('checkout_desk_sub')}</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="deliveryType"
                          value={DELIVERY_TYPES.DESK}
                          checked={deliveryType === DELIVERY_TYPES.DESK}
                          onChange={() => setDeliveryType(DELIVERY_TYPES.DESK)}
                          className="text-emerald-500 focus:ring-emerald-400"
                        />
                      </div>
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-emerald-400 font-medium">{t('checkout_desk_badge')}</span>
                        <div className={isRTL ? 'text-left' : 'text-right'}>
                          <span className="text-xs font-black text-white">{formatDZD(currentWilaya.deskPriceDZD, language)}</span>
                        </div>
                      </div>
                    </label>

                    {/* Option 2: Home Delivery */}
                    <label 
                      onClick={() => setDeliveryType(DELIVERY_TYPES.HOME)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        deliveryType === DELIVERY_TYPES.HOME 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Home size={18} className={deliveryType === DELIVERY_TYPES.HOME ? 'text-emerald-400' : 'text-slate-400'} />
                          <div>
                            <span className="text-xs font-bold block text-white">{t('checkout_home_title')}</span>
                            <span className="text-[10px] text-slate-400">{t('checkout_home_sub')}</span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="deliveryType"
                          value={DELIVERY_TYPES.HOME}
                          checked={deliveryType === DELIVERY_TYPES.HOME}
                          onChange={() => setDeliveryType(DELIVERY_TYPES.HOME)}
                          className="text-emerald-500 focus:ring-emerald-400"
                        />
                      </div>
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-cyan-400 font-medium">{t('checkout_home_badge')}</span>
                        <div className={isRTL ? 'text-left' : 'text-right'}>
                          <span className="text-xs font-black text-white">{formatDZD(currentWilaya.homePriceDZD, language)}</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock size={13} className="text-emerald-400" />
                    <span>{t('checkout_estimated_delay', { name: isRTL ? currentWilaya.arName : currentWilaya.name })} <strong className="text-white">{currentWilaya.estimatedDelivery}</strong></span>
                  </div>
                </div>

              </div>

              {/* 2. Customer Contact */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                  <User size={14} />
                  <span>{t('checkout_step2')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_name_label')}</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('checkout_name_placeholder')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_phone_label')}</label>
                    <div className="relative">
                      <Phone size={14} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('checkout_phone_placeholder')}
                        className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono`}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_email_label')}</label>
                    <div className="relative">
                      <Mail size={14} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('checkout_email_placeholder')}
                        className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Shipping Address / Desk Details */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{t('checkout_step3')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>{t('checkout_city_label')}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {communesList.length} {t('checkout_communes_available')}
                      </span>
                    </label>
                    <select
                      required
                      value={commune}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommune(val);
                        const match = communesList.find(c => c.name === val || c.arName === val);
                        if (match?.postalCode) {
                          setPostalCode(match.postalCode);
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="" disabled>{t('checkout_select_commune')}</option>
                      {communesList.map((c) => (
                        <option key={c.name} value={c.name}>
                          {isRTL ? `${c.arName} (${c.name})` : `${c.name} (${c.arName})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_postal_label')}</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder={`${currentWilaya.codeStr}000`}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {deliveryType === DELIVERY_TYPES.HOME ? (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_street_label')}</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder={t('checkout_street_placeholder')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_desk_agency_label')}</label>
                      <input
                        type="text"
                        value={deskLocation}
                        onChange={(e) => setDeskLocation(e.target.value)}
                        placeholder={t('checkout_desk_agency_placeholder')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">{t('checkout_notes_label')}</label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder={t('checkout_notes_placeholder')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Payment Method */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Banknote size={14} />
                  <span>{t('checkout_step4')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')} 
                      className="hidden" 
                    />
                    <Truck size={18} className="text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold block">{t('checkout_payment_cod')}</span>
                      <span className="text-[10px] text-slate-400">{t('checkout_payment_cod_sub')}</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')} 
                      className="hidden" 
                    />
                    <CreditCard size={18} className="text-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold block">{t('checkout_payment_card')}</span>
                      <span className="text-[10px] text-slate-400">{t('checkout_payment_card_sub')}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total Summary - 100% Calculated in Algerian Dinars (DZD) */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>{t('checkout_summary_subtotal', { count: items.length })}</span>
                  <span className="text-white font-semibold">{formatDZD(subtotal, language)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t('checkout_summary_discount')}</span>
                    <span>-{formatDZD(discount, language)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-slate-300">
                      {t('checkout_summary_shipping', {
                        type: deliveryType === DELIVERY_TYPES.DESK ? (isRTL ? 'المكتب' : 'Bureau') : (isRTL ? 'المنزل' : 'Domicile'),
                        code: currentWilaya.codeStr,
                        name: isRTL ? currentWilaya.arName : currentWilaya.name
                      })}
                    </span>
                    <span className="text-[10px] text-slate-500">{currentWilaya.estimatedDelivery}</span>
                  </div>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="text-white font-bold">{formatDZD(shippingFeeDZD, language)}</span>
                  </div>
                </div>
                {taxAmountDZD > 0 && (
                  <div className="flex justify-between">
                    <span>{t('checkout_summary_tax')}</span>
                    <span className="text-white">{formatDZD(taxAmountDZD, language)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-extrabold text-white pt-2.5 border-t border-slate-700">
                  <span>{t('checkout_summary_grand_total')}</span>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="text-emerald-400 font-black text-xl">
                      {formatDZD(grandTotalDZD, language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                <span>
                  {loading 
                    ? t('checkout_submitting') 
                    : t('checkout_place_order_btn', { total: formatDZD(grandTotalDZD, language) })}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
