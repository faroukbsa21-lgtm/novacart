import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t, isRTL } = useLanguage();
  const phoneNumber = "213550000000"; // Algerian store WhatsApp line

  const defaultMessage = language === 'ar'
    ? "مرحباً NovaCart الجزائر، أود الاستفسار أو تقديم طلب مباشر مع الدفع عند الاستلام."
    : language === 'en'
    ? "Hello NovaCart Algeria, I would like to inquire or place a direct order with cash on delivery."
    : "Bonjour NovaCart Algérie, je souhaite avoir des informations ou passer une commande directe avec paiement à la livraison.";

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-40 font-sans`}>
      {/* Floating Card Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg backdrop-blur">
                  💬
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm">{t('wa_header_title')}</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {t('wa_header_status')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-900/95">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
              {t('wa_body_text')}
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>{t('wa_cod_note')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-cyan-400" />
                <span>{t('wa_delivery_note')}</span>
              </div>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Send size={14} />
              <span>{t('wa_start_chat')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Circular Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        title={t('hero_cta_whatsapp')}
        aria-label={t('hero_cta_whatsapp')}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
        </span>
        <MessageSquare size={22} className="text-slate-950 fill-slate-950" />
        <span className="hidden sm:inline font-extrabold text-xs tracking-tight">
          {t('hero_cta_whatsapp')}
        </span>
      </button>
    </div>
  );
}
