import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

export default function Login() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = t('email_required');
    if (!form.password) e.password = t('password_required');
    return e;
  };

  const changeLang = (l) => i18n.changeLanguage(l);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (_) {
      // toast shown by store
    }
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 relative">
      {/* Top Language Toggle */}
      <div className="absolute top-6 right-6 flex gap-2">
        {['uz', 'ru', 'en'].map(l => (
          <button
            key={l}
            onClick={() => changeLang(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${i18n.language.startsWith(l) ? 'bg-green-500 text-white shadow-md' : 'bg-white text-slate-400 hover:text-slate-600'
              }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl font-extrabold text-green-500 tracking-tight">SAVDO</span>
          <p className="text-[#64748B] mt-2 text-base">{t('welcome_back')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-7">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">{t('login_title')}</h2>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder={t('enter_email')}
                className={`w-full h-12 rounded-xl border px-4 text-base text-[#0F172A] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] bg-white'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder={t('enter_password')}
                  className={`w-full h-12 rounded-xl border px-4 pr-12 text-base text-[#0F172A] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] bg-white'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ minHeight: '52px' }}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-1"
            >
              {isLoading ? (
                <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  {t('login')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-[#64748B] mt-5 text-base">
          {t('no_account')}{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
