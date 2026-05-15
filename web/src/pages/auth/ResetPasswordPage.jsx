import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';

export function ResetPasswordPage() {
  const [params]  = useSearchParams();
  const token     = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  const checks = [
    { label: 'Kamida 8 ta belgi', pass: password.length >= 8 },
    { label: 'Kichik harf (a-z)',  pass: /[a-z]/.test(password) },
    { label: 'Katta harf (A-Z)',  pass: /[A-Z]/.test(password) },
    { label: 'Raqam (0-9)',       pass: /[0-9]/.test(password) },
  ];
  const allPass  = checks.every((c) => c.pass);
  const pwdMatch = password === confirm && confirm.length > 0;
  const canSubmit = allPass && pwdMatch && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setDone(true);
    } catch {
      setError("Havola yaroqsiz yoki muddati o'tgan. Qaytadan so'rang.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F5F8F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#C6DEC0] p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#182A1A] mb-2">Havola yaroqsiz</h2>
          <p className="text-sm text-[#7AAA7C] mb-6">Parolni tiklash uchun yangi so'rov yuboring.</p>
          <Link
            to="/forgot-password"
            className="flex items-center justify-center h-11 rounded-xl bg-[#2D8B35] text-white text-sm font-bold hover:bg-[#1D5E24] transition-all"
          >
            Qayta so'rash
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F3] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#3C6B42] hover:text-[#2D8B35] transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#C6DEC0] flex items-center justify-center group-hover:border-[#2D8B35] transition-colors">
            <ArrowLeft size={15} />
          </div>
          Kirishga qaytish
        </Link>

        <div className="bg-white rounded-3xl border border-[#C6DEC0] shadow-sm overflow-hidden">
          {!done ? (
            <>
              <div className="px-8 pt-8 pb-6 border-b border-[#C6DEC0]">
                <div className="w-14 h-14 bg-[#EAF3E5] rounded-2xl flex items-center justify-center mb-5">
                  <KeyRound size={24} className="text-[#2D8B35]" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#182A1A] tracking-tight mb-2">Yangi parol</h1>
                <p className="text-sm text-[#7AAA7C]">Xavfsiz yangi parol o'rnating.</p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">

                {/* Password input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Yangi parol</label>
                  <div className={`flex items-center h-12 rounded-xl border px-4 gap-3 transition-all ${
                    'border-[#C6DEC0] focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10'
                  }`}>
                    <KeyRound size={16} className="text-[#7AAA7C]" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent text-sm text-[#182A1A] placeholder-[#7AAA7C] outline-none"
                    />
                    <button type="button" onClick={() => setShowPwd((p) => !p)} className="text-[#7AAA7C] hover:text-[#3C6B42] transition-colors">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Requirements checklist */}
                {password.length > 0 && (
                  <div className={`bg-[#F5F8F3] rounded-xl p-4 border transition-all ${allPass ? 'border-[#C6DEC0]' : 'border-[#C6DEC0]'}`}>
                    <p className="text-[10px] font-bold text-[#7AAA7C] uppercase tracking-wider mb-3">Parol talablari</p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                      {checks.map((ch) => (
                        <div key={ch.label} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${ch.pass ? 'bg-[#2D8B35]' : 'bg-red-100'}`}>
                            {ch.pass
                              ? <CheckCircle size={10} className="text-white" />
                              : <span className="text-red-500 text-[9px] font-black leading-none">✕</span>
                            }
                          </div>
                          <span className={`text-xs font-medium ${ch.pass ? 'text-[#2D8B35]' : 'text-red-500'}`}>{ch.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Parolni tasdiqlang</label>
                  <div className={`flex items-center h-12 rounded-xl border px-4 gap-3 transition-all ${
                    confirm.length > 0 && !pwdMatch
                      ? 'border-red-400 bg-red-50/50'
                      : pwdMatch
                      ? 'border-[#2D8B35] bg-[#EAF3E5]/40'
                      : 'border-[#C6DEC0] focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10'
                  }`}>
                    <KeyRound size={16} className="text-[#7AAA7C]" />
                    <input
                      type={showCfm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent text-sm text-[#182A1A] placeholder-[#7AAA7C] outline-none"
                    />
                    <button type="button" onClick={() => setShowCfm((p) => !p)} className="text-[#7AAA7C] hover:text-[#3C6B42] transition-colors">
                      {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && !pwdMatch && (
                    <p className="text-xs text-red-500 font-medium">Parollar mos kelmayapti</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`flex items-center justify-center gap-2.5 h-12 rounded-xl font-bold text-sm mt-1 transition-all ${
                    canSubmit
                      ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/20 hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
                  }`}
                >
                  <KeyRound size={16} />
                  {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
                </button>
              </form>
            </>
          ) : (
            <div className="px-8 py-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#EAF3E5] rounded-3xl flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-[#2D8B35]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#182A1A] tracking-tight mb-3">Parol yangilandi!</h2>
              <p className="text-sm text-[#7AAA7C] mb-8">Yangi parolingiz muvaffaqiyatli o'rnatildi.</p>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-[#2D8B35] hover:bg-[#1D5E24] text-white text-sm font-bold transition-all shadow-md"
              >
                <ArrowLeft size={14} />
                Kirishga o'tish
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#7AAA7C] mt-6">
          © 2024 <span className="font-bold text-[#2D8B35]">SAVDO</span> · Barcha huquqlar himoyalangan
        </p>
      </div>
    </div>
  );
}
