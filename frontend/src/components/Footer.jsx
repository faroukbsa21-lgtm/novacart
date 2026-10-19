import React from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-base">
                ⚡
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Nova<span className="text-emerald-400">Cart</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('footer_about_desc')}
            </p>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">{t('footer_collections')}</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('cat_electronics')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('cat_fashion')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('cat_home_living')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('cat_accessories')}</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">{t('footer_customer_care')}</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('nav_orders')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('prop_inspection_title')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('prop_warranty_title')}</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('topbar_cod')}</li>
            </ul>
          </div>

          {/* Safe Checkout & Guarantees */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">{t('footer_trust_title')}</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              {t('footer_trust_desc')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <Truck size={15} />
              <span className="font-semibold">{t('prop_wilayas_title')}</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} NovaCart Store. {t('footer_rights')}
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{t('footer_official')}</span>
            <span>•</span>
            <span>{t('topbar_cod')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
