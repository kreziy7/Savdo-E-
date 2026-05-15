import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, ShieldCheck, Smartphone, Zap, Users, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Smartphone, title: "Oflayn rejim", desc: "Internet yo'lmasa ham ishlaydi — barcha ma'lumotlar qurilmada saqlanadi." },
  { icon: Zap, title: "Tez sotuv yozish", desc: "Barcode skanerlash bilan soniyalar ichida sotuv yozing." },
  { icon: BarChart2, title: "Batafsil hisobotlar", desc: "Kunlik, haftalik va oylik statistika. Foyda va rentabellik ko'rsatkichlari." },
  { icon: Users, title: "Xodimlar boshqaruvi", desc: "Admin va kassir rollari — har kim o'z vakolatida ishlaydi." },
  { icon: ShieldCheck, title: "Xavfsiz ma'lumotlar", desc: "Shifrlash va cloud zaxira nusxa. Ma'lumotlaringiz doimo xavfsiz." },
  { icon: Globe, title: "Ko'p til", desc: "O'zbek, Rus va Ingliz tillarida ishlaydi." },
];

const PLANS = [
  {
    name: 'FREE', price: '0', period: '',
    color: '#2D8B35',
    features: ["30 ta tovar", "Kunlik hisobot", "Oflayn rejim", "1 qurilma"],
  },
  {
    name: 'PRO', price: '49,000', period: '/oy',
    color: '#7C3AED', highlight: true,
    features: ["250 ta tovar", "Narx tarixi", "Excel eksport", "Push xabarlar", "3 qurilma"],
  },
  {
    name: 'BIZNES', price: '129,000', period: '/oy',
    color: '#D97706',
    features: ["Cheksiz tovar", "API kirish", "Audit jurnali", "Ko'p foydalanuvchi", "10 qurilma"],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0C1410] text-[#182A1A] dark:text-[#DBF0DB]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0C1410]/90 backdrop-blur-md border-b border-[#C6DEC0] dark:border-[#243E28]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-[#2D8B35] tracking-tight">SAVDO</span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#3C6B42] dark:text-[#8BBF8E] hover:text-[#2D8B35] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1C2C1E]"
            >
              Kirish
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-[#2D8B35] hover:bg-[#1D5E24] text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Bepul boshlash
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2D8B35] via-[#2D8B35] to-[#1D5E24] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-[#C6DEC0] rounded-full animate-pulse" />
            500+ savdogar ishlatmoqda
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            Savdongizni aqlli<br />
            <span className="text-[#C6DEC0]">boshqaring</span>
          </h1>
          <p className="text-[#EAF3E5] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Tovar, sotuv, hisobot va xodimlarni bir joydan boshqaring.
            Oflayn ishlaydi, tez va qulay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-[#2D8B35] font-bold text-lg px-8 py-4 rounded-2xl hover:bg-[#EAF3E5] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Bepul boshlash
            </Link>
            <Link
              to="/login"
              className="bg-white/15 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/25 transition-all border border-white/30"
            >
              Kirish
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#EAF3E5] dark:bg-[#162018] border-y border-[#C6DEC0] dark:border-[#243E28]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '500+', label: 'Foydalanuvchi' },
            { value: '50K+', label: 'Sotuv yozilgan' },
            { value: '4.9★', label: "O'rtacha baho" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-[#2D8B35] mb-1">{s.value}</div>
              <div className="text-sm text-[#3C6B42] dark:text-[#7AAA7C] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Imkoniyatlar</h2>
            <p className="text-[#3C6B42] dark:text-[#7AAA7C] max-w-xl mx-auto">
              Savdo biznesingiz uchun zarur bo'lgan hamma narsa bir ilovada
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-[#162018] border border-[#C6DEC0] dark:border-[#243E28] rounded-2xl p-6 hover:border-[#C6DEC0] dark:hover:border-[#3A9040] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-[#EAF3E5] dark:bg-[#1C2C1E] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2D8B35]" />
                </div>
                <h3 className="font-bold text-[#182A1A] dark:text-[#DBF0DB] mb-2">{title}</h3>
                <p className="text-sm text-[#3C6B42] dark:text-[#7AAA7C] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-[#EAF3E5] dark:bg-[#162018]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Tarif rejalari</h2>
            <p className="text-[#3C6B42] dark:text-[#7AAA7C]">O'z biznesingizga mos rejani tanlang</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 relative transition-all ${
                  plan.highlight
                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 dark:shadow-purple-900/50 md:-translate-y-2 border-2 border-purple-600'
                    : 'bg-white dark:bg-[#1C2C1E] border-2 border-[#C6DEC0] dark:border-[#243E28] hover:border-[#8BBF8E] dark:hover:border-[#3A9040]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap">
                    MASHHUR TANLOV
                  </div>
                )}

                <div className="mb-6">
                  <span
                    className="inline-block text-xs font-black px-3 py-1.5 rounded-lg mb-4"
                    style={plan.highlight
                      ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }
                      : { backgroundColor: plan.color + '18', color: plan.color }
                    }
                  >
                    {plan.name}
                  </span>
                  <div className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-[#182A1A] dark:text-[#DBF0DB]'}`}>
                    {plan.price === '0' ? 'Bepul' : plan.price}
                    {plan.period && (
                      <span className="text-base font-semibold opacity-60 ml-1">so'm{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : plan.color }}
                      />
                      <span className={plan.highlight ? 'text-white/90' : 'text-[#3C6B42] dark:text-[#8BBF8E]'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="block text-center py-3.5 rounded-xl font-bold transition-all hover:opacity-90"
                  style={plan.highlight
                    ? { backgroundColor: '#fff', color: '#7C3AED' }
                    : { backgroundColor: plan.color, color: '#fff' }
                  }
                >
                  {plan.price === '0' ? 'Bepul boshlash' : 'Tanlash'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#2D8B35] to-[#1D5E24] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">Hoziroq boshlang</h2>
        <p className="text-[#EAF3E5] mb-8 max-w-md mx-auto">
          Karta kerak emas. Bepul rejim bilan ishlang va biznesingizni o'stiring.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-[#2D8B35] font-bold text-lg px-10 py-4 rounded-2xl hover:bg-[#EAF3E5] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Bepul ro'yxatdan o'tish
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-[#EAF3E5] dark:bg-[#162018] border-t border-[#C6DEC0] dark:border-[#243E28]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xl font-black text-[#2D8B35] mb-2">SAVDO</div>
          <p className="text-sm text-[#3C6B42] dark:text-[#7AAA7C]">Business Manager — Savdogar uchun aqlli tizim</p>
          <p className="text-xs text-[#7AAA7C] dark:text-[#4B7550] mt-4">© 2024 Savdo. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
