import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function VerifyOtpPage() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const phone     = params.get('phone') || '';
  const action    = params.get('action') || 'login'; // 'login' | 'register' | 'reset'
  const name      = params.get('name') || '';

  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [resent, setResent]   = useState(false);
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const code = otp.join('');

  function handleChange(i, val) {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    setError('');
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputs.current[5]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length < 6 || loading) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-otp', { phone, code, action, name });
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/');
      } else if (action === 'reset') {
        navigate(`/reset-password?token=${data.resetToken}`);
      }
    } catch {
      setError("Kod noto'g'ri yoki muddati o'tgan. Qaytadan urinib ko'ring.");
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resent) return;
    try {
      await axios.post('/api/auth/send-otp', { phone, action });
      setResent(true);
      setTimeout(() => setResent(false), 60000);
    } catch (_) {}
  }

  if (!phone) {
    return (
      <div className="min-h-screen bg-[#F5F8F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#C6DEC0] p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#182A1A] mb-2">Havola yaroqsiz</h2>
          <p className="text-sm text-[#7AAA7C] mb-6">Qaytadan urinib ko'ring.</p>
          <Link to="/login" className="flex items-center justify-center h-11 rounded-xl bg-[#2D8B35] text-white text-sm font-bold hover:bg-[#1D5E24] transition-all">
            Kirishga qaytish
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
          <div className="px-8 pt-8 pb-6 border-b border-[#C6DEC0]">
            <div className="w-14 h-14 bg-[#EAF3E5] rounded-2xl flex items-center justify-center mb-5">
              <Phone size={24} className="text-[#2D8B35]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#182A1A] tracking-tight mb-2">SMS kodni kiriting</h1>
            <p className="text-sm text-[#7AAA7C]">
              <span className="font-bold text-[#2D8B35]">{phone}</span> raqamiga yuborilgan 6 xonali kodni kiriting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 rounded-xl border text-center text-xl font-bold text-[#182A1A] transition-all outline-none focus:ring-2 focus:ring-[#2D8B35]/20 focus:border-[#2D8B35] ${
                    v ? 'border-[#2D8B35] bg-[#EAF3E5]/40' : 'border-[#C6DEC0] bg-white'
                  } ${error ? 'border-red-400 bg-red-50' : ''}`}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600 font-medium text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={code.length < 6 || loading}
              className={`flex items-center justify-center gap-2.5 h-12 rounded-xl font-bold text-sm transition-all ${
                code.length === 6 && !loading
                  ? 'bg-[#2D8B35] hover:bg-[#1D5E24] text-white shadow-md shadow-[#2D8B35]/20 hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-[#EAF3E5] text-[#7AAA7C] cursor-not-allowed'
              }`}
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><CheckCircle size={16} />Tasdiqlash</>
              }
            </button>

            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-[#7AAA7C]">Kod kelmadimi?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resent}
                className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                  resent ? 'text-[#7AAA7C] cursor-default' : 'text-[#2D8B35] hover:text-[#1D5E24]'
                }`}
              >
                <RefreshCw size={12} />
                {resent ? 'Yuborildi (60s)' : 'Qayta yuborish'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-[#7AAA7C] mt-6">
          © 2024 <span className="font-bold text-[#2D8B35]">SAVDO</span> · Barcha huquqlar himoyalangan
        </p>
      </div>
    </div>
  );
}
