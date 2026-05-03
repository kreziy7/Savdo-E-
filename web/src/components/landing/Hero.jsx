import { Link } from 'react-router-dom'

const products = [
  { icon: '👟', bg: '#E8F5EE', name: 'Krossovka Nike', stock: '3 ta', profit: '+84 000' },
  { icon: '👔', bg: '#FFF8EC', name: 'Futbolka Tommy', stock: '12 ta', profit: '+156 000' },
  { icon: '👜', bg: '#F0F0FF', name: 'Ayol sumkasi',   stock: '7 ta',  profit: '+242 600' },
]

const avatarColors = ['#0A5C45','#0E7A5C','#12A87D','#C9933A','#073D2E']

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-[120px] pb-24 px-6 md:px-[60px] relative overflow-hidden"
      style={{ background: 'var(--bg-page)' }}>

      {/* Animated blobs */}
      <div className="hero-blob-1" />
      <div className="hero-blob-2" />
      <div className="hero-blob-3" />
      <div className="absolute inset-0 z-0 opacity-30 hero-grid-bg" />

      {/* ── Text block ── */}
      <div className="relative z-10 text-center max-w-[860px]">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[13px] font-semibold mb-8 animate-fade-down"
          style={{ background: 'var(--bg-muted)', border: '1px solid rgba(10,92,69,0.18)', color: 'var(--brand)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-dot flex-shrink-0"
            style={{ background: 'var(--brand-lt)', display: 'inline-block' }} />
          O'zbekistonning #1 savdo tizimi
          <span style={{ opacity: 0.5 }}>✦</span>
        </div>

        {/* Headline */}
        <h1 className="font-syne font-extrabold leading-[1.0] mb-6 animate-fade-down-1"
          style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '-3px', color: 'var(--tx-1)' }}>
          Savdoni boshqar.
          <br />
          <span className="gradient-text">Foyda ko'r.</span>
        </h1>

        <p className="text-[18px] leading-relaxed max-w-[500px] mx-auto mb-10 animate-fade-down-2"
          style={{ color: 'var(--tx-2)' }}>
          Tovar, sotuv va foydangizni onlayn boshqaring. Hisob-kitob, hisobot va ombor — hammasi bir joyda.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-10 animate-fade-down-3">
          <Link to="/register"
            className="inline-flex items-center gap-2 text-white px-9 py-4 rounded-2xl text-[15px] font-bold no-underline transition-all hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #0A5C45, #0E7A5C)', boxShadow: '0 8px 32px rgba(10,92,69,0.38), 0 2px 8px rgba(10,92,69,0.15)' }}>
            Bepul boshlash
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a href="#how"
            onClick={e => { e.preventDefault(); document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-[15px] font-semibold no-underline transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--bg-card)', color: 'var(--tx-1)', border: '1.5px solid var(--bd)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M10 8l4 4-4 4"/>
            </svg>
            Demo ko'rish
          </a>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-5 flex-wrap animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex -space-x-2.5">
            {['J','M','B','D','A'].map((l, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 font-syne font-bold text-xs text-white flex items-center justify-center flex-shrink-0"
                style={{ background: avatarColors[i], borderColor: 'var(--bg-page)', zIndex: 5 - i }}>
                {l}
              </div>
            ))}
          </div>
          <span className="text-sm" style={{ color: 'var(--tx-3)' }}>
            <b style={{ color: 'var(--tx-1)' }}>500K+</b> savdogar foydalanmoqda
          </span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#C9933A', fontSize: 14 }}>★</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dashboard mockup ── */}
      <div className="relative z-10 mt-[68px] animate-fade-up w-full flex justify-center" style={{ animationDelay: '0.4s' }}>
        <div className="relative">

          {/* Float card — left top */}
          <div className="hidden lg:block absolute -left-28 top-10 rounded-2xl p-4 animate-float"
            style={{ background: 'var(--bg-card)', boxShadow: '0 20px 60px rgba(13,31,24,0.14)', border: '1px solid var(--bd)', minWidth: 164 }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--tx-3)' }}>Bugungi foyda</div>
            <div className="font-syne text-[20px] font-extrabold" style={{ color: 'var(--tx-1)' }}>482 600</div>
            <div className="text-[11px] font-semibold mt-1" style={{ color: '#12A87D' }}>↑ +12% kecha</div>
          </div>

          {/* Float card — right */}
          <div className="hidden lg:block absolute -right-24 top-36 rounded-2xl p-4 animate-float-2"
            style={{ background: 'var(--bg-card)', boxShadow: '0 20px 60px rgba(13,31,24,0.14)', border: '1px solid var(--bd)', minWidth: 150 }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--tx-3)' }}>Sotuvlar</div>
            <div className="font-syne text-[20px] font-extrabold" style={{ color: 'var(--tx-1)' }}>24 ta</div>
            <div className="text-[11px] font-semibold mt-1" style={{ color: '#12A87D' }}>✓ Bugun</div>
          </div>

          {/* Float card — left bottom */}
          <div className="hidden lg:block absolute -left-20 bottom-20 rounded-2xl p-4 animate-float-3"
            style={{ background: 'var(--bg-card)', boxShadow: '0 20px 60px rgba(13,31,24,0.14)', border: '1px solid var(--bd)', minWidth: 164 }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--tx-3)' }}>Ombor ogohlantirish</div>
            <div className="font-syne text-[20px] font-extrabold" style={{ color: 'var(--tx-1)' }}>⚠️ 3 ta</div>
            <div className="text-[11px] font-semibold mt-1" style={{ color: '#C9933A' }}>Zakaz kerak</div>
          </div>

          {/* Browser window */}
          <div className="w-full max-w-[760px] rounded-[24px] overflow-hidden"
            style={{ boxShadow: '0 60px 120px rgba(13,31,24,0.22), 0 20px 40px rgba(13,31,24,0.08)', border: '1px solid var(--bd)' }}>

            {/* Browser bar */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--bd)' }}>
              <div className="flex gap-1.5">
                {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                  <span key={c} className="w-3 h-3 rounded-full block" style={{ background: c }} />
                ))}
              </div>
              <div className="text-[11px] px-3 py-1 rounded-lg font-medium"
                style={{ color: 'var(--tx-3)', background: 'var(--bg-card)', border: '1px solid var(--bd)' }}>
                savdo.uz/dashboard
              </div>
              <div style={{ width: 72 }} />
            </div>

            {/* App content */}
            <div className="flex" style={{ height: 400, background: 'var(--bg-surface)' }}>

              {/* Sidebar */}
              <div className="flex flex-col items-center py-5 gap-2 flex-shrink-0" style={{ width: 58, background: '#0D1F18' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-syne font-extrabold text-white text-sm mb-3"
                  style={{ background: '#0A5C45' }}>S</div>
                {['📊','📦','🛒','📈','⚙️'].map((ic, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ background: i === 0 ? 'rgba(255,255,255,0.12)' : 'transparent', opacity: i === 0 ? 1 : 0.38 }}>
                    {ic}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-4 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: 'var(--tx-1)' }}>Assalomu alaykum, Jasur 👋</div>
                    <div className="text-[10px]" style={{ color: 'var(--tx-3)' }}>2025 yil, aprel</div>
                  </div>
                  <div className="w-7 h-7 rounded-xl font-syne font-bold text-[11px] text-white flex items-center justify-center"
                    style={{ background: '#0A5C45' }}>J</div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[['Tushum','1 284 000','↑ +8%'],['Foyda','482 600','↑ +12%'],['Sotuvlar','24','bugun'],['Tovarlar','38','aktiv']].map(([l, v, s], i) => (
                    <div key={i} className="rounded-xl p-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--bd)' }}>
                      <div className="text-[9px] font-medium" style={{ color: 'var(--tx-3)' }}>{l}</div>
                      <div className="font-syne font-extrabold text-[13px] mt-0.5" style={{ color: 'var(--tx-1)' }}>{v}</div>
                      <div className="text-[9px] font-semibold" style={{ color: '#12A87D' }}>{s}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="rounded-xl p-3 mb-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--bd)' }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--tx-1)' }}>Haftalik sotuv</span>
                    <span className="text-[9px]" style={{ color: 'var(--tx-3)' }}>so'm</span>
                  </div>
                  <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0A5C45" stopOpacity="0.20"/>
                        <stop offset="100%" stopColor="#0A5C45" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,42 L42,34 L84,37 L126,20 L168,27 L210,11 L252,17 L300,6 L300,48 L0,48Z"
                      fill="url(#chartFill)"/>
                    <path d="M0,42 L42,34 L84,37 L126,20 L168,27 L210,11 L252,17 L300,6"
                      fill="none" stroke="#0A5C45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="300" cy="6" r="3.5" fill="#0A5C45"/>
                    <circle cx="210" cy="11" r="2.5" fill="#12A87D"/>
                  </svg>
                </div>

                {/* Products */}
                <div className="flex flex-col gap-1.5">
                  {products.map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl px-3 py-1.5"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--bd)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{ background: r.bg }}>{r.icon}</div>
                        <div>
                          <div className="text-[11px] font-semibold" style={{ color: 'var(--tx-1)' }}>{r.name}</div>
                          <div className="text-[9px]" style={{ color: 'var(--tx-3)' }}>Qoldiq: {r.stock}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: '#0A5C45' }}>{r.profit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
