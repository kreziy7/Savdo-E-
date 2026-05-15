import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, RefreshCw, Info, Phone, ArrowRight } from 'lucide-react';
import axios from 'axios';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [tab, setTab]           = useState('email'); // 'email' | 'phone'
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [step, setStep]         = useState('input'); // 'input' | 'sent'
  const [loading, setLoading]   = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = tab === 'email' ? isEmailValid : phone.length === 9;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    try {
      if (tab === 'email') {
        await axios.post('/api/auth/forgot-password', { email: email.toLowerCase() });
      } else {
        await axios.post('/api/auth/send-otp', { phone: `+998${phone}`, action: 'reset-password' });
        navigate(`/verify-otp?phone=${encodeURIComponent(`+998${phone}`)}&action=reset`);
        return;
      }
    } catch {
      // don't reveal whether user exists
    } finally {
      setLoading(false);
    }
    setStep('sent');
  }

  return (
    <div className="min-h-screen bg-[#F5F8F3] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">

        {/* Back link */}
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

          {step === 'input' ? (
            <>
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-[#C6DEC0]">
                <div className="w-14 h-14 bg-[#EAF3E5] rounded-2xl flex items-center justify-center mb-5">
                  <Mail size={26} className="text-[#2D8B35]" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#182A1A] tracking-tight mb-2">
                  Parolni tiklash
                </h1>
                <p className="text-sm text-[#7AAA7C] leading-relaxed">
                  {tab === 'email'
                    ? 'Email manzilingizni kiriting — parolni tiklash havolasini yuboramiz.'
                    : 'Telefon raqamingizni kiriting — SMS kodi yuboramiz.'}
                </p>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 mx-8 mt-6 p-1 bg-[#F5F8F3] border border-[#C6DEC0] rounded-xl">
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

                {tab === 'email' ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Email manzil</label>
                    <div className={`flex items-center h-12 rounded-xl border px-4 gap-3 transition-all ${
                      email.length > 3 && !isEmailValid
                        ? 'border-amber-400 bg-amber-50/60'
                        : isEmailValid
                        ? 'border-[#2D8B35] bg-[#EAF3E5]/40 ring-2 ring-[#2D8B35]/10'
                        : 'border-[#C6DEC0] bg-white focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10'
                    }`}>
                      <Mail size={16} className={isEmailValid ? 'text-[#2D8B35]' : 'text-[#7AAA7C]'} />
                      <input
                        type="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@gmail.com"
                        className="flex-1 bg-transparent text-sm text-[#182A1A] placeholder-[#7AAA7C] outline-none"
                      />
                      {email.length > 0 && (
                        <button type="button" onClick={() => setEmail('')} className="text-[#7AAA7C] hover:text-[#182A1A] text-xl leading-none transition-colors">×</button>
                      )}
                    </div>
                    {email.length > 3 && !isEmailValid && (
                      <p className="text-xs text-amber-600 font-medium">To'g'ri email manzil kiriting</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#2D8B35] uppercase tracking-wider">Telefon raqam</label>
                    <div className="flex items-center h-12 rounded-xl border border-[#C6DEC0] focus-within:border-[#2D8B35] focus-within:ring-2 focus-within:ring-[#2D8B35]/10 overflow-hidden transition-all">
                      <span className="px-3 h-full flex items-center bg-[#EAF3E5] border-r border-[#C6DEC0] text-sm font-bold text-[#2D8B35] select-none whitespace-nowrap">+998</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={9}
                        autoFocus
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="90 123 45 67"
                        className="flex-1 h-full px-3 text-sm text-[#182A1A] placeholder-[#7AAA7C] bg-white outline-none"
                      />
                      {phone.length === 9 && <CheckCircle size={16} className="mr-3 text-[#2D8B35] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[#7AAA7C]">SMS orqali tasdiqlash kodi yuboriladi</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`flex items-center justify-center gap-2.5 h-12 rounded-xl font-bold text-sm transition-all ${
                    isValid && !loading
                      ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/20 hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
                  }`}
                >
                  {loading
                    ? <RefreshCw size={16} className="animate-spin" />
                    : tab === 'email' ? <Send size={16} /> : <ArrowRight size={16} />
                  }
                  {loading ? 'Yuborilmoqda...' : tab === 'email' ? 'Havola yuborish' : 'SMS yuborish'}
                </button>

                {/* Info box */}
                <div className="flex gap-3 bg-[#EAF3E5] rounded-xl p-4 border border-[#C6DEC0]">
                  <Info size={15} className="text-[#2D8B35] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#182A1A] mb-1">
                      {tab === 'email' ? 'Email kelmasa nima qilish kerak?' : 'SMS kelmasa nima qilish kerak?'}
                    </p>
                    <p className="text-xs text-[#3C6B42] leading-relaxed">
                      {tab === 'email'
                        ? <>Spam papkasini tekshiring. Muammo bo'lsa <span className="font-semibold text-[#2D8B35]">support@savdo.uz</span> ga yozing.</>
                        : <>Bir necha daqiqa kuting. Muammo bo'lsa <span className="font-semibold text-[#2D8B35]">support@savdo.uz</span> ga yozing.</>
                      }
                    </p>
                  </div>
                </div>

              </form>
            </>
          ) : (
            /* ── Sent state ── */
            <div className="px-8 py-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#EAF3E5] rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle size={40} className="text-[#2D8B35]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#182A1A] tracking-tight mb-3">
                {tab === 'email' ? 'Email yuborildi!' : 'SMS yuborildi!'}
              </h2>
              <p className="text-sm text-[#7AAA7C] mb-1">
                <span className="font-bold text-[#2D8B35]">{tab === 'email' ? email : `+998${phone}`}</span>
              </p>
              <p className="text-sm text-[#7AAA7C] leading-relaxed mb-8">
                {tab === 'email'
                  ? <>manziliga parolni tiklash havolasi yuborildi.<br />Email 5 daqiqa ichida keladi.</>
                  : <>raqamiga tasdiqlash kodi yuborildi.<br />SMS 1 daqiqa ichida keladi.</>
                }
              </p>
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[#C6DEC0] bg-white text-sm font-semibold text-[#3C6B42] hover:bg-[#EAF3E5] hover:border-[#2D8B35] transition-all"
                >
                  <RefreshCw size={14} />
                  Qayta yuborish
                </button>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#2D8B35] hover:bg-[#1D5E24] text-white text-sm font-bold transition-all shadow-md shadow-[#2D8B35]/20 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={14} />
                  Kirishga qaytish
                </Link>
              </div>
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
