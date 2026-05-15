import { useState } from 'react';
import {
  User, Lock, Phone, Mail, Eye, EyeOff,
  CheckCircle, Copy, Check, LogOut,
  Chrome, ShieldCheck, KeyRound, ArrowRight,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import axios from 'axios';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile',  label: "Profil",    icon: User },
  { id: 'security', label: "Xavfsizlik", icon: ShieldCheck },
];

function Avatar({ name }) {
  const colors = ['#2D8B35','#1D5E24','#44AB4C','#3C6B42','#7AAA7C'];
  const bg = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0" style={{ background: bg }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg text-[#7AAA7C] hover:text-[#2D8B35] hover:bg-[#EAF3E5] transition-all">
      {copied ? <Check size={14} className="text-[#2D8B35]" /> : <Copy size={14} />}
    </button>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [name, setName]     = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  // Password form
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw]   = useState({ current: false, next: false });
  const [pwSaving, setPwSaving] = useState(false);

  // Link phone flow
  const [linkPhone, setLinkPhone]         = useState(false);
  const [lpPhone, setLpPhone]             = useState('');
  const [lpStep, setLpStep]               = useState('input'); // 'input' | 'otp'
  const [lpOtp, setLpOtp]                 = useState('');
  const [lpLoading, setLpLoading]         = useState(false);

  // Link email flow
  const [linkEmail, setLinkEmail]         = useState(false);
  const [leEmail, setLeEmail]             = useState('');
  const [leStep, setLeStep]               = useState('input'); // 'input' | 'verify'
  const [leLoading, setLeLoading]         = useState(false);

  const pwChecks = [
    { label: 'Kamida 8 ta belgi', pass: pwForm.next.length >= 8 },
    { label: 'Kichik harf',       pass: /[a-z]/.test(pwForm.next) },
    { label: 'Katta harf',        pass: /[A-Z]/.test(pwForm.next) },
    { label: 'Raqam',             pass: /\d/.test(pwForm.next) },
  ];
  const pwAllGood = pwChecks.every((c) => c.pass);
  const pwMatch   = pwForm.next === pwForm.confirm && pwForm.confirm.length > 0;
  const hasPassword = !!user?.hasPassword;

  // ── Save profile name ─────────────────────────────────
  async function handleSaveName(e) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', { name: name.trim() });
      updateUser(res.data.data.user);
      toast.success('Profil yangilandi');
    } catch { toast.error('Xatolik'); }
    finally { setSaving(false); }
  }

  // ── Change / Create password ──────────────────────────
  async function handlePasswordSave(e) {
    e.preventDefault();
    if (!pwAllGood || !pwMatch || pwSaving) return;
    setPwSaving(true);
    try {
      const payload = hasPassword
        ? { currentPassword: pwForm.current, newPassword: pwForm.next }
        : { newPassword: pwForm.next };
      await api.patch('/users/change-password', payload);
      toast.success('Parol saqlandi');
      setPwForm({ current: '', next: '', confirm: '' });
      updateUser({ ...user, hasPassword: true });
    } catch { toast.error('Joriy parol noto\'g\'ri'); }
    finally { setPwSaving(false); }
  }

  // ── Link phone: send OTP ──────────────────────────────
  async function handleLpSend(e) {
    e.preventDefault();
    if (lpPhone.length < 9 || lpLoading) return;
    setLpLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { phone: `+998${lpPhone}`, action: 'link' });
      setLpStep('otp');
    } catch { toast.error('Xatolik yuz berdi'); }
    finally { setLpLoading(false); }
  }

  // ── Link phone: verify OTP ────────────────────────────
  async function handleLpVerify(e) {
    e.preventDefault();
    if (lpOtp.length < 6 || lpLoading) return;
    setLpLoading(true);
    try {
      const res = await api.post('/users/link-phone', { phone: `+998${lpPhone}`, code: lpOtp });
      updateUser(res.data.data.user);
      toast.success('Telefon ulandi');
      setLinkPhone(false); setLpPhone(''); setLpStep('input'); setLpOtp('');
    } catch { toast.error('Kod noto\'g\'ri'); }
    finally { setLpLoading(false); }
  }

  // ── Link email: send verification ─────────────────────
  async function handleLeSend(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leEmail) || leLoading) return;
    setLeLoading(true);
    try {
      await api.post('/users/link-email', { email: leEmail.toLowerCase() });
      setLeStep('verify');
    } catch { toast.error('Bu email allaqachon ishlatilgan'); }
    finally { setLeLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#F5F8F3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header card ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#C6DEC0] p-5 sm:p-6 mb-5 flex items-center gap-4">
          <Avatar name={user?.name} />
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-[#182A1A] truncate">{user?.name || '—'}</p>
            <p className="text-sm text-[#7AAA7C] truncate">{user?.email || user?.phone || '—'}</p>
          </div>
          <button
            onClick={async () => { await logout(); window.location.href = '/login'; }}
            className="ml-auto flex items-center gap-2 text-xs font-bold text-[#7AAA7C] hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut size={14} />
            Chiqish
          </button>
        </div>

        {/* ── Tab bar ──────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-white border border-[#C6DEC0] rounded-2xl mb-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold transition-all ${
                activeTab === id
                  ? 'bg-[#2D8B35] text-white shadow-sm'
                  : 'text-[#7AAA7C] hover:text-[#3C6B42] hover:bg-[#F5F8F3]'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ──────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-[#C6DEC0] p-6">
            <h2 className="font-extrabold text-[#182A1A] mb-5">Profil ma'lumotlari</h2>
            <form onSubmit={handleSaveName} className="flex flex-col gap-4 max-w-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">To'liq ism</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ism va familiya"
                  className="h-12 rounded-xl border border-[#C6DEC0] px-4 text-sm text-[#182A1A] placeholder-[#7AAA7C] focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] transition-all"
                />
              </div>

              {user?.email && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7AAA7C] uppercase tracking-wider">Email</label>
                  <div className="flex items-center h-12 rounded-xl border border-[#C6DEC0] bg-[#F5F8F3] px-4 gap-2">
                    <Mail size={15} className="text-[#7AAA7C] flex-shrink-0" />
                    <span className="flex-1 text-sm text-[#7AAA7C] truncate">{user.email}</span>
                    <CopyBtn text={user.email} />
                  </div>
                </div>
              )}

              {user?.phone && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7AAA7C] uppercase tracking-wider">Telefon</label>
                  <div className="flex items-center h-12 rounded-xl border border-[#C6DEC0] bg-[#F5F8F3] px-4 gap-2">
                    <Phone size={15} className="text-[#7AAA7C] flex-shrink-0" />
                    <span className="flex-1 text-sm text-[#7AAA7C] truncate">{user.phone}</span>
                    <CopyBtn text={user.phone} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || !name.trim()}
                className={`h-12 rounded-xl text-sm font-bold transition-all mt-1 ${
                  name.trim() && !saving
                    ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/20'
                    : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
                }`}
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        )}

        {/* ── Security tab ─────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-4">

            {/* Ulangan hisoblar */}
            <div className="bg-white rounded-2xl border border-[#C6DEC0] p-6">
              <h2 className="font-extrabold text-[#182A1A] mb-1">Ulangan hisoblar</h2>
              <p className="text-xs text-[#7AAA7C] mb-5">Tizimga kirish usullaringiz</p>

              <div className="flex flex-col gap-3">

                {/* Google */}
                {user?.googleId && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#C6DEC0] bg-[#F5F8F3]">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#C6DEC0] flex items-center justify-center flex-shrink-0">
                      <Chrome size={18} className="text-[#4285F4]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#182A1A]">Google</p>
                      <p className="text-xs text-[#7AAA7C] truncate">{user.email}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#2D8B35] bg-[#EAF3E5] px-2.5 py-1 rounded-lg">
                      <CheckCircle size={12} />Ulangan
                    </span>
                  </div>
                )}

                {/* Email row */}
                {user?.email ? (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#C6DEC0] bg-[#F5F8F3]">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#C6DEC0] flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-[#2D8B35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#182A1A]">Email</p>
                      <p className="text-xs text-[#7AAA7C] truncate">{user.email}</p>
                    </div>
                    <CopyBtn text={user.email} />
                    <span className="flex items-center gap-1 text-xs font-bold text-[#2D8B35] bg-[#EAF3E5] px-2.5 py-1 rounded-lg">
                      <CheckCircle size={12} />Ulangan
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-dashed border-[#C6DEC0]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5F8F3] border border-[#C6DEC0] flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-[#7AAA7C]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#182A1A]">Email</p>
                        <p className="text-xs text-[#7AAA7C]">Ulanmagan</p>
                      </div>
                      {!linkEmail && (
                        <button
                          onClick={() => setLinkEmail(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2D8B35] hover:bg-[#1D5E24] px-3 py-1.5 rounded-lg transition-all"
                        >
                          <ArrowRight size={12} />Email ulash
                        </button>
                      )}
                    </div>

                    {linkEmail && leStep === 'input' && (
                      <form onSubmit={handleLeSend} className="flex flex-col gap-2.5 pt-1 border-t border-[#EAF3E5]">
                        <input
                          type="email"
                          value={leEmail}
                          onChange={(e) => setLeEmail(e.target.value)}
                          placeholder="email@gmail.com"
                          autoFocus
                          className="h-10 rounded-xl border border-[#C6DEC0] px-3 text-sm text-[#182A1A] placeholder-[#7AAA7C] focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] transition-all"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setLinkEmail(false); setLeEmail(''); }} className="flex-1 h-9 rounded-xl border border-[#C6DEC0] text-xs font-bold text-[#7AAA7C] hover:bg-[#F5F8F3] transition-all">Bekor qilish</button>
                          <button type="submit" disabled={leLoading} className="flex-1 h-9 rounded-xl bg-[#2D8B35] text-white text-xs font-bold hover:bg-[#1D5E24] disabled:opacity-60 transition-all">
                            {leLoading ? 'Yuborilmoqda...' : 'Tasdiqlash yuborish'}
                          </button>
                        </div>
                      </form>
                    )}

                    {linkEmail && leStep === 'verify' && (
                      <div className="pt-1 border-t border-[#EAF3E5] flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-[#EAF3E5] rounded-xl px-3 py-2.5">
                          <CheckCircle size={14} className="text-[#2D8B35]" />
                          <p className="text-xs text-[#2D8B35] font-medium"><span className="font-bold">{leEmail}</span> ga tasdiqlash havolasi yuborildi</p>
                        </div>
                        <button onClick={() => { setLinkEmail(false); setLeStep('input'); setLeEmail(''); }} className="text-xs text-[#7AAA7C] hover:text-[#3C6B42] transition-colors">Yopish</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Phone row */}
                {user?.phone ? (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#C6DEC0] bg-[#F5F8F3]">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#C6DEC0] flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-[#2D8B35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#182A1A]">Telefon</p>
                      <p className="text-xs text-[#7AAA7C] truncate">{user.phone}</p>
                    </div>
                    <CopyBtn text={user.phone} />
                    <span className="flex items-center gap-1 text-xs font-bold text-[#2D8B35] bg-[#EAF3E5] px-2.5 py-1 rounded-lg">
                      <CheckCircle size={12} />Ulangan
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-dashed border-[#C6DEC0]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5F8F3] border border-[#C6DEC0] flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-[#7AAA7C]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#182A1A]">Telefon</p>
                        <p className="text-xs text-[#7AAA7C]">Ulanmagan</p>
                      </div>
                      {!linkPhone && (
                        <button
                          onClick={() => setLinkPhone(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2D8B35] hover:bg-[#1D5E24] px-3 py-1.5 rounded-lg transition-all"
                        >
                          <ArrowRight size={12} />Telefon ulash
                        </button>
                      )}
                    </div>

                    {linkPhone && lpStep === 'input' && (
                      <form onSubmit={handleLpSend} className="flex flex-col gap-2.5 pt-1 border-t border-[#EAF3E5]">
                        <div className="flex items-center h-10 rounded-xl border border-[#C6DEC0] focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10 overflow-hidden transition-all">
                          <span className="px-3 h-full flex items-center bg-[#EAF3E5] border-r border-[#C6DEC0] text-xs font-bold text-[#2D8B35] select-none">+998</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={9}
                            autoFocus
                            value={lpPhone}
                            onChange={(e) => setLpPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="90 123 45 67"
                            className="flex-1 h-full px-3 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setLinkPhone(false); setLpPhone(''); }} className="flex-1 h-9 rounded-xl border border-[#C6DEC0] text-xs font-bold text-[#7AAA7C] hover:bg-[#F5F8F3] transition-all">Bekor qilish</button>
                          <button type="submit" disabled={lpPhone.length < 9 || lpLoading} className="flex-1 h-9 rounded-xl bg-[#2D8B35] text-white text-xs font-bold hover:bg-[#1D5E24] disabled:opacity-60 transition-all">
                            {lpLoading ? 'Yuborilmoqda...' : 'SMS yuborish'}
                          </button>
                        </div>
                      </form>
                    )}

                    {linkPhone && lpStep === 'otp' && (
                      <form onSubmit={handleLpVerify} className="flex flex-col gap-2.5 pt-1 border-t border-[#EAF3E5]">
                        <p className="text-xs text-[#7AAA7C]"><span className="font-bold text-[#2D8B35]">+998{lpPhone}</span> ga SMS yuborildi. 6 xonali kodni kiriting:</p>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          autoFocus
                          value={lpOtp}
                          onChange={(e) => setLpOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="_ _ _ _ _ _"
                          className="h-12 rounded-xl border border-[#C6DEC0] px-4 text-center text-xl font-bold text-[#182A1A] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] transition-all"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setLpStep('input')} className="flex-1 h-9 rounded-xl border border-[#C6DEC0] text-xs font-bold text-[#7AAA7C] hover:bg-[#F5F8F3] transition-all">Orqaga</button>
                          <button type="submit" disabled={lpOtp.length < 6 || lpLoading} className="flex-1 h-9 rounded-xl bg-[#2D8B35] text-white text-xs font-bold hover:bg-[#1D5E24] disabled:opacity-60 transition-all">
                            {lpLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Parol */}
            <div className="bg-white rounded-2xl border border-[#C6DEC0] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#EAF3E5] flex items-center justify-center">
                  <KeyRound size={17} className="text-[#2D8B35]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-[#182A1A] leading-tight">
                    {hasPassword ? 'Parolni o\'zgartirish' : 'Parol yaratish'}
                  </h2>
                  {!hasPassword && (
                    <p className="text-xs text-[#7AAA7C]">Emailingiz bilan kirish uchun parol o'rnating</p>
                  )}
                </div>
              </div>

              <form onSubmit={handlePasswordSave} className="flex flex-col gap-4 max-w-md">
                {hasPassword && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Joriy parol</label>
                    <div className="relative">
                      <input
                        type={showPw.current ? 'text' : 'password'}
                        value={pwForm.current}
                        onChange={(e) => setPwForm(p => ({ ...p, current: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full h-12 rounded-xl border border-[#C6DEC0] px-4 pr-12 text-sm text-[#182A1A] placeholder-[#7AAA7C] focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] transition-all"
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7AAA7C] hover:text-[#3C6B42] transition-colors">
                        {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Yangi parol</label>
                  <div className="relative">
                    <input
                      type={showPw.next ? 'text' : 'password'}
                      value={pwForm.next}
                      onChange={(e) => setPwForm(p => ({ ...p, next: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full h-12 rounded-xl border border-[#C6DEC0] px-4 pr-12 text-sm text-[#182A1A] placeholder-[#7AAA7C] focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] transition-all"
                    />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7AAA7C] hover:text-[#3C6B42] transition-colors">
                      {showPw.next ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {pwForm.next.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {pwChecks.map((c) => (
                        <div key={c.label} className={`flex items-center gap-1.5 text-xs ${c.pass ? 'text-[#2D8B35]' : 'text-[#7AAA7C]'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center ${c.pass ? 'bg-[#2D8B35]' : 'bg-[#EAF3E5]'}`}>
                            {c.pass && <Check size={8} className="text-white" />}
                          </div>
                          {c.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Parolni tasdiqlang</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="••••••••"
                    className={`w-full h-12 rounded-xl border px-4 text-sm text-[#182A1A] placeholder-[#7AAA7C] focus:outline-none focus:ring-2 focus:ring-[#2D8B35]/20 transition-all ${
                      pwForm.confirm.length > 0 && !pwMatch ? 'border-red-400 bg-red-50' : pwMatch ? 'border-[#2D8B35] bg-[#EAF3E5]/30' : 'border-[#C6DEC0]'
                    }`}
                  />
                  {pwForm.confirm.length > 0 && !pwMatch && <p className="text-xs text-red-500 font-medium">Parollar mos kelmayapti</p>}
                </div>

                <button
                  type="submit"
                  disabled={!pwAllGood || !pwMatch || pwSaving || (hasPassword && !pwForm.current)}
                  className={`h-12 rounded-xl text-sm font-bold transition-all mt-1 flex items-center justify-center gap-2 ${
                    pwAllGood && pwMatch && !pwSaving && (!hasPassword || pwForm.current)
                      ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/20'
                      : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
                  }`}
                >
                  <Lock size={15} />
                  {pwSaving ? 'Saqlanmoqda...' : hasPassword ? 'Parolni yangilash' : 'Parol yaratish'}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
