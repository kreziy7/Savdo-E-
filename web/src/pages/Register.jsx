import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, UserPlus, CheckCircle2, XCircle,
  BarChart2, Package, TrendingUp, ShieldCheck,
  Star, Users, CheckCircle, ShoppingBag, Globe,
  Phone, Mail, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const LANGS = ['uz', 'ru', 'en'];

const TX = {
  uz: {
    tagline:        "Kichik biznes uchun savdo menejeri",
    headline:       "Biznesingizni aqlli boshqaring — bepul",
    sub:            "Hisob yarating va bugun birinchi savdongizni qayd eting",
    register_title: "Hisob yaratish",
    register_sub:   "1 daqiqada ro'yxatdan o'ting — bepul",
    have_account:   "Hisobingiz bormi?",
    login:          "Kirish",
    name_label:     "To'liq ism",
    name_ph:        "Ism va familiyangiz",
    email_label:    "Email manzil",
    pwd_label:      "Parol",
    pwd_ph:         "Kamida 8 ta belgi",
    submit:         "Hisob yaratish",
    features: [
      { icon: BarChart2,   title: "Hisobotlar",     desc: "Kunlik va oylik savdo statistikasi bir qarashda" },
      { icon: Package,     title: "Omborxona",       desc: "Mahsulot zaxiralarini real vaqtda kuzating" },
      { icon: TrendingUp,  title: "Foyda tahlili",   desc: "Har bir mahsulotdan qancha foyda olayotganingizni biling" },
      { icon: ShieldCheck, title: "Xavfsizlik",      desc: "Ma'lumotlaringiz JWT va shifrlash bilan himoyalangan" },
    ],
    stats: [
      { value: "3",    label: "Til",       sub: "UZ · RU · EN" },
      { value: "100%", label: "Bepul",     sub: "Hech qanday to'lov yo'q" },
      { value: "24/7", label: "Ishlaydi",  sub: "Har doim mavjud" },
      { value: "∞",    label: "Savdolar",  sub: "Cheksiz qo'shish" },
    ],
    testimonial: {
      text: "SAVDO menga har kuni qancha foyda qilayotganimni ko'rsatadi. Endi daftarga yozmayman.",
      name: "Abdulloh T.",
      role: "Do'kon egasi, Toshkent",
    },
    trust: ["Ma'lumotlaringiz xavfsiz", "Bepul foydalanish", "O'rnatish shart emas"],
    how_title: "Qanday ishlaydi?",
    steps: [
      { n: "1", title: "Ro'yxatdan o'ting",  desc: "1 daqiqada hisob yarating" },
      { n: "2", title: "Mahsulot qo'shing",   desc: "Mahsulotlar va narxlarni kiriting" },
      { n: "3", title: "Savdo qiling",         desc: "Har bir savdoni qayd eting" },
      { n: "4", title: "Hisobot ko'ring",      desc: "Foyda va statistikani tahlil qiling" },
    ],
  },
  ru: {
    tagline:        "Менеджер продаж для малого бизнеса",
    headline:       "Управляйте бизнесом умно — бесплатно",
    sub:            "Создайте аккаунт и запишите первую продажу уже сегодня",
    register_title: "Создать аккаунт",
    register_sub:   "Зарегистрируйтесь за 1 минуту — бесплатно",
    have_account:   "Уже есть аккаунт?",
    login:          "Войти",
    name_label:     "Полное имя",
    name_ph:        "Ваше имя и фамилия",
    email_label:    "Электронная почта",
    pwd_label:      "Пароль",
    pwd_ph:         "Минимум 8 символов",
    submit:         "Создать аккаунт",
    features: [
      { icon: BarChart2,   title: "Отчёты",        desc: "Ежедневная и месячная статистика продаж с одного взгляда" },
      { icon: Package,     title: "Склад",          desc: "Отслеживайте запасы товаров в режиме реального времени" },
      { icon: TrendingUp,  title: "Анализ прибыли", desc: "Узнайте, сколько вы зарабатываете на каждом товаре" },
      { icon: ShieldCheck, title: "Безопасность",   desc: "Данные защищены с помощью JWT и шифрования" },
    ],
    stats: [
      { value: "3",    label: "Языка",      sub: "UZ · RU · EN" },
      { value: "100%", label: "Бесплатно",  sub: "Никаких платежей" },
      { value: "24/7", label: "Работает",   sub: "Всегда доступно" },
      { value: "∞",    label: "Продаж",     sub: "Добавляйте без лимита" },
    ],
    testimonial: {
      text: "SAVDO показывает мне каждый день, сколько я зарабатываю. Больше не веду тетрадь.",
      name: "Абдулло Т.",
      role: "Владелец магазина, Ташкент",
    },
    trust: ["Ваши данные в безопасности", "Бесплатное использование", "Установка не нужна"],
    how_title: "Как это работает?",
    steps: [
      { n: "1", title: "Зарегистрируйтесь",  desc: "Создайте аккаунт за 1 минуту" },
      { n: "2", title: "Добавьте товары",     desc: "Введите товары и цены" },
      { n: "3", title: "Ведите продажи",      desc: "Записывайте каждую продажу" },
      { n: "4", title: "Смотрите отчёты",     desc: "Анализируйте прибыль и статистику" },
    ],
  },
  en: {
    tagline:        "Sales manager for small businesses",
    headline:       "Manage your business smartly — for free",
    sub:            "Create an account and log your first sale today",
    register_title: "Create Account",
    register_sub:   "Sign up in 1 minute — completely free",
    have_account:   "Already have an account?",
    login:          "Sign In",
    name_label:     "Full Name",
    name_ph:        "Your full name",
    email_label:    "Email Address",
    pwd_label:      "Password",
    pwd_ph:         "At least 8 characters",
    submit:         "Create Account",
    features: [
      { icon: BarChart2,   title: "Reports",         desc: "Daily and monthly sales statistics at a glance" },
      { icon: Package,     title: "Warehouse",        desc: "Track product inventory in real time" },
      { icon: TrendingUp,  title: "Profit Analysis",  desc: "Know exactly how much you earn on each product" },
      { icon: ShieldCheck, title: "Security",         desc: "Your data is protected with JWT and encryption" },
    ],
    stats: [
      { value: "3",    label: "Languages",   sub: "UZ · RU · EN" },
      { value: "100%", label: "Free",        sub: "No payments required" },
      { value: "24/7", label: "Available",   sub: "Always online" },
      { value: "∞",    label: "Sales",       sub: "Add without limits" },
    ],
    testimonial: {
      text: "SAVDO shows me every day how much I'm earning. I don't use notebooks anymore.",
      name: "Abdulloh T.",
      role: "Store owner, Tashkent",
    },
    trust: ["Your data is secure", "Free to use", "No installation needed"],
    how_title: "How does it work?",
    steps: [
      { n: "1", title: "Register",       desc: "Create an account in 1 minute" },
      { n: "2", title: "Add products",   desc: "Enter products and prices" },
      { n: "3", title: "Record sales",   desc: "Log every sale you make" },
      { n: "4", title: "View reports",   desc: "Analyze profit and statistics" },
    ],
  },
};

const getRules = (t) => [
  { label: t('rule_length'), test: (p) => p.length >= 8 },
  { label: t('rule_upper'),  test: (p) => /[A-Z]/.test(p) },
  { label: t('rule_lower'),  test: (p) => /[a-z]/.test(p) },
  { label: t('rule_number'), test: (p) => /\d/.test(p) },
];

export default function Register() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : i18n.language.startsWith('en') ? 'en' : 'uz';
  const tx = TX[lang];

  const [tab, setTab]                   = useState('email');
  const [phone, setPhone]               = useState('');
  const [phoneName, setPhoneName]       = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdTouched, setPwdTouched] = useState(false);
  const [errors, setErrors] = useState({});

  const register     = useAuthStore((s) => s.register);
  const login        = useAuthStore((s) => s.login);
  const googleLogin  = useAuthStore((s) => s.googleLogin);
  const isLoading    = useAuthStore((s) => s.isLoading);
  const navigate     = useNavigate();

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      const user = await googleLogin(credential);
      if (!['ADMIN', 'SUPER_ADMIN'].includes(user?.role)) {
        navigate('/');
      }
    } catch (_) {}
  };

  const rules    = getRules(t);
  const pwdValid = rules.every((r) => r.test(form.password));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = t('name_required');
    if (!form.email.trim()) e.email = t('email_required');
    if (!form.password)     e.password = t('password_required');
    else if (!pwdValid)     e.password = t('rule_length');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPwdTouched(true);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      await login({ email: form.email.trim(), password: form.password });
      navigate('/');
    } catch (_) {}
  };

  const onChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
    if (field === 'password') setPwdTouched(true);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 9 || !phoneName.trim() || phoneLoading) return;
    setPhoneLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { phone: `+998${phone}`, name: phoneName.trim(), action: 'register' });
      navigate(`/verify-otp?phone=${encodeURIComponent(`+998${phone}`)}&name=${encodeURIComponent(phoneName.trim())}`);
    } catch (_) {}
    finally { setPhoneLoading(false); }
  };

  const cls = (f) =>
    `w-full h-12 rounded-xl border px-4 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/30 focus:border-[#2D8B35] ${
      errors[f] ? 'border-red-400 bg-red-50' : 'border-[#C6DEC0]'
    }`;

  return (
    <div className="min-h-screen bg-[#F5F8F3]">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="bg-white border-b border-[#C6DEC0] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#2D8B35] rounded-xl flex items-center justify-center">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-[#182A1A] tracking-tight">SAVDO</span>
          <span className="hidden sm:block text-xs text-[#7AAA7C] font-medium ml-1 border border-[#C6DEC0] px-2 py-0.5 rounded-md">{tx.tagline.split(' ').slice(0,3).join(' ')}…</span>
        </div>
        <div className="flex items-center gap-3">
          <Globe size={15} className="text-[#7AAA7C]" />
          <div className="flex gap-1 bg-[#F5F8F3] border border-[#C6DEC0] rounded-xl p-1">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => i18n.changeLanguage(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  i18n.language.startsWith(l)
                    ? 'bg-[#2D8B35] text-white shadow-sm'
                    : 'text-[#7AAA7C] hover:text-[#3C6B42]'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero + Form ─────────────────────────────────── */}
      <section className="px-4 pt-14 pb-16 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 bg-[#EAF3E5] border border-[#C6DEC0] text-[#2D8B35] text-xs font-bold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-[#2D8B35] rounded-full" />
          {tx.tagline}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#182A1A] max-w-xl leading-tight mb-4">
          {tx.headline}
        </h1>
        <p className="text-[#3C6B42] text-base max-w-md leading-relaxed mb-10">{tx.sub}</p>

        {/* Register card */}
        <div className="w-full max-w-[400px] bg-white rounded-2xl border border-[#C6DEC0] shadow-lg shadow-[#EAF3E5] overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-lg font-extrabold text-[#182A1A]">{tx.register_title}</h2>
            <p className="text-[#3C6B42] text-sm mt-0.5">{tx.register_sub}</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mx-6 mb-4 p-1 bg-[#F5F8F3] border border-[#C6DEC0] rounded-xl">
            <button
              type="button"
              onClick={() => setTab('phone')}
              className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-bold transition-all ${
                tab === 'phone' ? 'bg-[#2D8B35] text-white shadow-sm' : 'text-[#7AAA7C] hover:text-[#3C6B42]'
              }`}
            >
              <Phone size={14} />
              Telefon
            </button>
            <button
              type="button"
              onClick={() => setTab('email')}
              className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-bold transition-all ${
                tab === 'email' ? 'bg-[#2D8B35] text-white shadow-sm' : 'text-[#7AAA7C] hover:text-[#3C6B42]'
              }`}
            >
              <Mail size={14} />
              Email
            </button>
          </div>

          {tab === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} noValidate className="px-6 pb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#2D5A34] uppercase tracking-wider">{tx.name_label}</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                  placeholder={tx.name_ph}
                  className="w-full h-12 rounded-xl border border-[#C6DEC0] px-4 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/30 focus:border-[#2D8B35]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#2D5A34] uppercase tracking-wider">Telefon raqam</label>
                <div className="flex items-center h-12 rounded-xl border border-[#C6DEC0] focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10 overflow-hidden transition-all">
                  <span className="px-3 h-full flex items-center bg-[#EAF3E5] border-r border-[#C6DEC0] text-sm font-bold text-[#2D8B35] select-none whitespace-nowrap">+998</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="90 123 45 67"
                    className="flex-1 h-full px-3 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white outline-none"
                  />
                  {phone.length === 9 && <CheckCircle size={16} className="mr-3 text-[#2D8B35] flex-shrink-0" />}
                </div>
                <p className="text-xs text-[#7AAA7C]">SMS orqali tasdiqlash kodi yuboriladi</p>
              </div>
              <button
                type="submit"
                disabled={phone.length < 9 || !phoneName.trim() || phoneLoading}
                className={`w-full h-12 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-1 ${
                  phone.length === 9 && phoneName.trim() && !phoneLoading
                    ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/30 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
                }`}
              >
                {phoneLoading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><ArrowRight size={16} />OTP yuborish</>
                }
              </button>
            </form>
          ) : (
            <>
              <div className="px-6 pb-2 flex flex-col gap-3">
                <div className="flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {}}
                    width="352"
                    shape="rectangular"
                    theme="outline"
                    text="signup_with"
                    locale="uz"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#C6DEC0]" />
                  <span className="text-xs text-[#7AAA7C] font-medium">yoki</span>
                  <div className="flex-1 h-px bg-[#C6DEC0]" />
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="px-6 pb-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D5A34] uppercase tracking-wider">{tx.name_label}</label>
                  <input type="text" autoComplete="name" value={form.name} onChange={onChange('name')} placeholder={tx.name_ph} className={cls('name')} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D5A34] uppercase tracking-wider">{tx.email_label}</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={onChange('email')} placeholder={t('enter_email')} className={cls('email')} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D5A34] uppercase tracking-wider">{tx.pwd_label}</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={onChange('password')}
                      placeholder={tx.pwd_ph}
                      className={`w-full h-12 rounded-xl border px-4 pr-12 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/30 focus:border-[#2D8B35] ${errors.password ? 'border-red-400 bg-red-50' : 'border-[#C6DEC0]'}`}
                    />
                    <button type="button" onClick={() => setShowPwd(p => !p)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7AAA7C] hover:text-[#3C6B42] p-1.5 rounded-lg transition">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                  {(pwdTouched || form.password.length > 0) && (
                    <ul className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {rules.map((rule) => {
                        const ok = rule.test(form.password);
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? 'text-[#2D8B35]' : 'text-[#7AAA7C]'}`}>
                            {ok ? <CheckCircle2 size={13} className="flex-shrink-0" /> : <XCircle size={13} className="flex-shrink-0" />}
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#2D8B35] hover:bg-[#1D5E24] active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-[#2D8B35]/30 mt-1"
                >
                  {isLoading
                    ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><UserPlus size={16} />{tx.submit}</>
                  }
                </button>
              </form>
            </>
          )}

          {/* Trust badges */}
          <div className="px-6 pb-5 pt-4 border-t border-[#EAF3E5] flex flex-col gap-2">
            {tx.trust.map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#7AAA7C]">
                <CheckCircle size={13} className="text-[#44AB4C] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#3C6B42] mt-5 text-sm">
          {tx.have_account}{' '}
          <Link to="/login" className="text-[#2D8B35] font-bold hover:text-[#1D5E24] transition">{tx.login}</Link>
        </p>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="px-4 pb-14">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tx.stats.map((s, i) => (
            <div key={i} className="bg-white border border-[#C6DEC0] rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-[#182A1A]">{s.value}</p>
              <p className="text-sm font-semibold text-[#182A1A] mt-1">{s.label}</p>
              <p className="text-xs text-[#7AAA7C] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="px-4 pb-14">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tx.features.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white border border-[#C6DEC0] rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-[#EAF3E5] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-[#2D8B35]" />
              </div>
              <div>
                <p className="font-bold text-[#182A1A] text-base">{title}</p>
                <p className="text-[#3C6B42] text-sm mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="px-4 pb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-extrabold text-[#182A1A] text-center mb-6">{tx.how_title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tx.steps.map((step, i) => (
              <div key={i} className="bg-white border border-[#C6DEC0] rounded-2xl p-5 text-center shadow-sm">
                <div className="w-10 h-10 bg-[#2D8B35] text-white text-lg font-extrabold rounded-full flex items-center justify-center mx-auto mb-3">
                  {step.n}
                </div>
                <p className="font-bold text-[#182A1A] text-sm">{step.title}</p>
                <p className="text-[#7AAA7C] text-xs mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ─────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-xl mx-auto bg-gradient-to-br from-[#2D8B35] to-[#1D5E24] rounded-2xl p-8 text-center shadow-lg shadow-[#2D8B35]/20">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(n => <Star key={n} size={16} className="text-yellow-300 fill-yellow-300" />)}
          </div>
          <p className="text-white text-base leading-relaxed italic mb-6">"{tx.testimonial.text}"</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">{tx.testimonial.name}</p>
              <p className="text-[#C6DEC0] text-xs">{tx.testimonial.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-[#C6DEC0] bg-white px-6 py-5 text-center">
        <span className="text-sm font-extrabold text-[#2D8B35] tracking-tight">SAVDO</span>
        <p className="text-xs text-[#7AAA7C] mt-1">© 2024 · {tx.tagline}</p>
      </footer>
    </div>
  );
}
