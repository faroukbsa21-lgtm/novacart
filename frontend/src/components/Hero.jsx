import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onExploreClick }) {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 py-12 md:py-16 border-b border-slate-800">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Trust Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <span className="text-sm">🇩🇿</span>
            <span>{t('hero_badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            {t('hero_title_1')} <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              {t('hero_cta_explore')}
            </button>

            <a
              href={`https://wa.me/213550000000?text=${encodeURIComponent(
                language === 'ar'
                  ? "مرحباً NovaCart الجزائر، أود الاستفسار أو تقديم طلب عبر واتساب."
                  : "Bonjour NovaCart Algérie, je souhaite avoir des conseils ou passer commande par WhatsApp."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/30 font-bold text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <MessageSquare size={17} className="text-emerald-400" />
              <span>{t('hero_cta_whatsapp')}</span>
            </a>
          </div>

          {/* Promo code badge */}
          <div className="inline-flex items-center gap-2 p-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 shadow">
            <span>🔥 {t('hero_promo_badge')}</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              NOVA20
            </span>
            <span>{t('hero_promo_discount')}</span>
          </div>

        </div>

        {/* 4 Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{t('prop_wilayas_title')}</h4>
              <p className="text-[11px] text-slate-400">{t('prop_wilayas_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{t('prop_inspection_title')}</h4>
              <p className="text-[11px] text-slate-400">{t('prop_inspection_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{t('prop_cod_title')}</h4>
              <p className="text-[11px] text-slate-400">{t('prop_cod_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{t('prop_warranty_title')}</h4>
              <p className="text-[11px] text-slate-400">{t('prop_warranty_desc')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
