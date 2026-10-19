import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, AlertCircle, CheckCircle2, KeyRound, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { isTrustedEmailDomain } from '../utils/validators';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const { language, setLanguage, t, supportedLanguages, isRTL } = useLanguage();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLang, setPreferredLang] = useState(language);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      await login(demoEmail, demoPassword);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isTrustedEmailDomain(email)) {
      setError(t('auth_trusted_domains'));
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        email,
        password,
        full_name: fullName,
        phone,
        preferred_language: preferredLang || language
      });
      // Also apply the selected preferred language immediately
      if (preferredLang && preferredLang !== language) {
        setLanguage(preferredLang);
      }
      if (res && res.user) {
        onClose();
      } else {
        setSuccessMsg('Account registered successfully! You can now log in.');
        setTab('login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8"
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

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 mb-6 border border-slate-700/80">
          <button
            onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'login' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth_signin')}
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'register' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth_create_account')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {tab === 'login' ? (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('auth_email_label')}</label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} size={15} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('auth_password_label')}</label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} size={15} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound size={15} />
                <span>{loading ? t('auth_authenticating') : t('auth_btn_login')}</span>
              </button>

              {/* Quick Demo 1-Click Accounts */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>💡 {t('auth_quick_demo')}</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold">1-Click</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@ecommerce.test', 'Admin@123456')}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/50 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Shield size={12} />
                      <span>Admin</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono truncate">admin@ecommerce.test</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Admin@123456</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('customer@ecommerce.test', 'Customer@123')}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-sky-500/50 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                      <User size={12} />
                      <span>Customer</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono truncate">customer@ecommerce.test</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Customer@123</div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">{t('auth_fullname_label')}</label>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} size={14} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mohamed Benali"
                  className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">{t('auth_email_label')}</label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-500`} size={14} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@gmail.com ou nom@outlook.com"
                  className={`w-full bg-slate-800 border border-slate-700 rounded-xl ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                />
              </div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <Shield size={10} className="flex-shrink-0" />
                <span>{t('auth_trusted_domains')}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">{t('auth_password_label')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">{t('auth_confirm_password')}</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat pass"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Preferred Language selector for the registered user */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Globe size={12} className="text-emerald-400" />
                <span>{t('auth_preferred_lang')}</span>
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
              🔒 {t('auth_security_note')}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Shield size={14} />
              <span>{loading ? t('auth_registering') : t('auth_btn_register')}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
