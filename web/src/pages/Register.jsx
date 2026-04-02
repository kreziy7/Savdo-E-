import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle2, XCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

const passwordRules = (t) => [
  { label: t('rule_length'), test: (p) => p.length >= 8 },
  { label: t('rule_upper'), test: (p) => /[A-Z]/.test(p) },
  { label: t('rule_lower'), test: (p) => /[a-z]/.test(p) },
  { label: t('rule_number'), test: (p) => /\d/.test(p) },
];

export default function Register() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errors, setErrors] = useState({});

  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const rules = passwordRules(t);
  const passwordValid = rules.every((r) => r.test(form.password));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('name_required');
    if (!form.email.trim()) e.email = t('email_required');
    if (!form.phone.trim()) e.phone = t('phone_required') || 'Phone required';
    if (!form.password) e.password = t('password_required');
    else if (!passwordValid) e.password = t('password_invalid') || 'Invalid password';
    return e;
  };

  const changeLang = (l) => i18n.changeLanguage(l);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched(true);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (_) {
      // toast shown by store
    }
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
    if (field === 'password') setPasswordTouched(true);
  };

  const inputClass = (field) =>
    `w-full h-12 rounded-xl border px-4 text-base text-[#0F172A] placeholder-[#94A3B8] transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors[field] ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] bg-white'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-8 relative">
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
          <p className="text-[#64748B] mt-2 text-base">{t('create_account')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-7">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">{t('register_title')}</h2>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">{t('full_name')}</label>
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder={t('enter_full_name')}
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">{t('email')}</label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder={t('enter_email')}
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">{t('phone')}</label>
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder={t('enter_phone')}
                className={inputClass('phone')}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              {/* Password strength */}
              {(passwordTouched || form.password.length > 0) && (
                <ul className="mt-3 grid grid-cols-2 gap-1.5">
                  {rules.map((rule) => {
                    const ok = rule.test(form.password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-[#94A3B8]'}`}>
                        {ok
                          ? <CheckCircle2 size={14} className="flex-shrink-0" />
                          : <XCircle size={14} className="flex-shrink-0" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ minHeight: '52px' }}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isLoading ? (
                <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} />
                  {t('register')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-[#64748B] mt-5 text-base">
          {t('have_account')}{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
