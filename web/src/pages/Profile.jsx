import { useState } from 'react';
import { User, Lock, Save, Eye, EyeOff, AlertCircle, CheckCircle2, Camera, Mail, Phone, Shield, TrendingUp, ShoppingCart, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import api from '../api/axios';
import * as reportsApi from '../api/reports.api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const pwRules = [
  { label: 'Kamida 8 ta belgi', test: (p) => p.length >= 8 },
  { label: 'Katta harf', test: (p) => /[A-Z]/.test(p) },
  { label: 'Kichik harf', test: (p) => /[a-z]/.test(p) },
  { label: 'Raqam', test: (p) => /\d/.test(p) },
];

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);

  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  // theme tokens
  const bg   = isDark ? '#0a1f12'               : '#F8FAFC';
  const card = isDark ? '#112920'               : '#ffffff';
  const bd   = isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0';
  const tx1  = isDark ? '#e0f2ec'               : '#0F172A';
  const tx2  = isDark ? 'rgba(224,242,236,0.6)'  : '#64748B';
  const tx3  = isDark ? 'rgba(224,242,236,0.35)' : '#94A3B8';
  const inp  = isDark ? '#0d2418'               : '#ffffff';

  const { data: summaryData } = useQuery({
    queryKey: ['reports-summary'],
    queryFn: reportsApi.getSummary,
    staleTime: 60000,
  });
  const summary = summaryData?.data?.data || {};
  const total = summary.total || {};

  const roleMap = {
    USER:        { label: 'Foydalanuvchi', color: '#12A87D', bg: 'rgba(18,168,125,0.12)' },
    ADMIN:       { label: 'Admin',         color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
    SUPER_ADMIN: { label: 'Super Admin',   color: '#C9933A', bg: 'rgba(201,147,58,0.12)' },
  };
  const role = roleMap[user?.role] || roleMap.USER;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const inputStyle = (disabled = false, hasError = false) => ({
    width: '100%', boxSizing: 'border-box',
    background: disabled ? (isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC') : inp,
    border: `1.5px solid ${hasError ? '#f87171' : bd}`,
    borderRadius: 12, padding: '12px 14px',
    fontSize: 14, color: disabled ? tx3 : tx1,
    outline: 'none', transition: 'border-color 0.15s',
    opacity: disabled ? 0.6 : 1,
    caretColor: '#12A87D',
    fontFamily: 'Inter, sans-serif',
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error('Ism kiritilmadi');
    setSavingProfile(true);
    try {
      const res = await api.patch('/users/profile', { name: profileForm.name.trim(), phone: profileForm.phone });
      updateUser(res.data.data.user);
      toast.success('Profil yangilandi ✓');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const allOk = pwRules.every(r => r.test(pwForm.newPassword));
    if (!allOk) { toast.error("Parol talablarga javob bermaydi"); return; }
    setSavingPw(true);
    try {
      await api.patch('/users/change-password', pwForm);
      toast.success("Parol o'zgartirildi ✓");
      setPwForm({ currentPassword: '', newPassword: '' });
      setPwTouched(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Joriy parol noto'g'ri");
    } finally {
      setSavingPw(false);
    }
  };

  const TABS = [
    { id: 'profile',  label: 'Profil',     icon: User },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
  ];

  const Spinner = () => (
    <svg style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Hero card ── */}
      <div style={{ background: card, border: `1px solid ${bd}`, borderRadius: 24, overflow: 'hidden' }}>

        {/* Cover gradient — avatar ichida, overlap yo'q */}
        <div style={{
          background: 'linear-gradient(135deg, #0A5C45 0%, #0E7A5C 45%, #12A87D 75%, rgba(201,147,58,0.45) 100%)',
          padding: '24px 24px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: 18, flexShrink: 0, position: 'relative',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24,
          }}>
            {initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 19, color: '#fff', margin: 0 }}>
                {user?.name}
              </h2>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 7,
                background: 'rgba(255,255,255,0.2)', color: '#fff',
                backdropFilter: 'blur(4px)',
              }}>
                {role.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                <Mail size={11} /> {user?.email}
              </span>
              {user?.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                  <Phone size={11} /> {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: `1px solid ${bd}`,
        }}>
          {[
            { label: "Jami savdolar", value: total.salesCount ?? '—', icon: ShoppingCart, color: '#818cf8' },
            { label: "Jami daromad",  value: total.totalRevenue ? Number(total.totalRevenue).toLocaleString('uz-UZ') + " so'm" : '—', icon: TrendingUp, color: '#12A87D' },
            { label: "Jami foyda",    value: total.totalProfit  ? Number(total.totalProfit).toLocaleString('uz-UZ')  + " so'm" : '—', icon: Package,     color: '#C9933A' },
          ].map(({ label, value, icon: Icon, color }, i, arr) => (
            <div key={label} style={{
              padding: '16px 20px',
              borderRight: i < arr.length - 1 ? `1px solid ${bd}` : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isDark ? `${color}20` : `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: tx3, margin: 0 }}>{label}</p>
                <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: tx1, margin: '2px 0 0' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
        borderRadius: 14, padding: 4,
      }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'Syne,sans-serif',
            transition: 'all 0.15s',
            background: tab === id
              ? (isDark ? 'linear-gradient(135deg,rgba(10,92,69,0.65),rgba(18,168,125,0.3))' : '#ffffff')
              : 'transparent',
            color: tab === id ? (isDark ? '#e0f2ec' : '#0A5C45') : tx2,
            boxShadow: tab === id ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
          }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Profile ── */}
      {tab === 'profile' && (
        <div style={{ background: card, border: `1px solid ${bd}`, borderRadius: 20, padding: '28px' }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: tx1, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} color="#12A87D" /> Shaxsiy ma'lumotlar
          </h3>
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tx3, marginBottom: 8 }}>
                To'liq ism
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Ism va familiyangiz"
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor = '#12A87D'}
                onBlur={e => e.target.style.borderColor = bd}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tx3, marginBottom: 8 }}>
                Telefon
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+998 90 123 45 67"
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor = '#12A87D'}
                onBlur={e => e.target.style.borderColor = bd}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tx3, marginBottom: 8 }}>
                Email
              </label>
              <input type="email" value={user?.email || ''} disabled style={inputStyle(true)} />
              <p style={{ fontSize: 11, color: tx3, marginTop: 5 }}>Email o'zgartirib bo'lmaydi</p>
            </div>
            <button type="submit" disabled={savingProfile} style={{
              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 12, border: 'none',
              cursor: savingProfile ? 'not-allowed' : 'pointer',
              background: savingProfile ? 'rgba(18,168,125,0.5)' : 'linear-gradient(135deg,#0E7A5C,#12A87D)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              boxShadow: savingProfile ? 'none' : '0 4px 16px rgba(18,168,125,0.28)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!savingProfile) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {savingProfile ? <Spinner /> : <Save size={14} />}
              {savingProfile ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Security ── */}
      {tab === 'security' && (
        <div style={{ background: card, border: `1px solid ${bd}`, borderRadius: 20, padding: '28px' }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: tx1, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color="#12A87D" /> Parolni o'zgartirish
          </h3>

          <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}>
            {/* Current password */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tx3, marginBottom: 8 }}>
                Joriy parol
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCur ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle(), paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#12A87D'}
                  onBlur={e => e.target.style.borderColor = bd}
                />
                <button type="button" onClick={() => setShowCur(p => !p)} tabIndex={-1}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: tx3, display: 'flex', padding: 4, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = tx1}
                  onMouseLeave={e => e.currentTarget.style.color = tx3}>
                  {showCur ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tx3, marginBottom: 8 }}>
                Yangi parol
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={e => { setPwForm(p => ({ ...p, newPassword: e.target.value })); setPwTouched(true); }}
                  required
                  placeholder="Kamida 8 ta belgi"
                  style={{ ...inputStyle(), paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#12A87D'}
                  onBlur={e => e.target.style.borderColor = bd}
                />
                <button type="button" onClick={() => setShowNew(p => !p)} tabIndex={-1}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: tx3, display: 'flex', padding: 4, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = tx1}
                  onMouseLeave={e => e.currentTarget.style.color = tx3}>
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password rules */}
              {(pwTouched || pwForm.newPassword) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: 10 }}>
                  {pwRules.map(rule => {
                    const ok = rule.test(pwForm.newPassword);
                    return (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: ok ? '#12A87D' : tx3, transition: 'color 0.15s' }}>
                        {ok ? <CheckCircle2 size={12} style={{ flexShrink: 0 }} /> : <AlertCircle size={12} style={{ flexShrink: 0 }} />}
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button type="submit" disabled={savingPw} style={{
              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 12, border: 'none',
              cursor: savingPw ? 'not-allowed' : 'pointer',
              background: savingPw ? 'rgba(18,168,125,0.5)' : 'linear-gradient(135deg,#0E7A5C,#12A87D)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              boxShadow: savingPw ? 'none' : '0 4px 16px rgba(18,168,125,0.28)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!savingPw) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {savingPw ? <Spinner /> : <Save size={14} />}
              {savingPw ? 'Saqlanmoqda...' : 'Parolni saqlash'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
