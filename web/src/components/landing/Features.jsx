const features = [
  { icon: '📦', title: 'Tovar hisobi',           desc: "30 soniyada tovar qo'shing: nom, narx, miqdor, kategoriya." },
  { icon: '🧮', title: 'Avtomatik foyda',         desc: "Har bir sotuv va kun bo'yicha foyda avtomatik hisoblanadi." },
  { icon: '📊', title: 'Kun/oy hisobotlari',      desc: "Bugun, hafta, oy davomida qancha ishlaganingizni ko'ring." },
  { icon: '🏪', title: 'Ombor qoldiqlari',        desc: "Har doim qancha tovar qolganini biling. Ogohlantirishlar avtomatik." },
  { icon: '👥', title: "Ko'p foydalanuvchi",      desc: "Kassir, menejer, egaga alohida kirish huquqlari." },
  { icon: '📄', title: 'Excel/PDF eksport',       desc: "Hisobotlarni Excel yoki PDF formatda yuklab oling." },
  { icon: '🔔', title: 'Telegram bildirishnoma',  desc: "Har kuni sotuv xulosasi Telegram ga avtomatik yuboriladi." },
  { icon: '🔍', title: 'Tezkor qidiruv',          desc: "Minglab tovar orasidan bir zumda topib oling." },
  { icon: '🏷️', title: 'Kategoriyalar',           desc: "Tovarlarni kategoriyalarga ajrating. Filter va qidiruv osonlashadi." },
  { icon: '💳', title: "To'lov usullari",          desc: "Naqd, karta, transfer — har bir to'lov usulini alohida kuzating." },
  { icon: '📱', title: 'Mobil moslashuvi',        desc: "Telefon va planshetda ham to'liq ishlaydi. App o'rnatish shart emas." },
  { icon: '🔒', title: 'Xavfsizlik',              desc: "Ma'lumotlaringiz shifrlangan. Har qadamda avtomatik zaxira." },
]

// First item is the "hero" bento card (spans 2 cols on desktop)
export default function Features() {
  const [heroF, ...rest] = features

  return (
    <section className="py-28 px-6 md:px-16 max-w-[1200px] mx-auto" id="features">
      <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: 'var(--brand)' }}>Imkoniyatlar</span>
      <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight mb-4"
        style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
        Savdogar uchun<br />kerak bo'lgan hamma narsa
      </h2>
      <p className="reveal text-lg leading-relaxed max-w-lg mb-16" style={{ color: 'var(--tx-2)' }}>
        Murakkab buxgalteriya yo'q. Qiyin atamalar yo'q. Tovarni qo'shing va sotuvni yozing — tamom.
      </p>

      {/* Bento grid */}
      <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Hero card — spans 2 cols, dark bg */}
        <div className="lg:col-span-2 rounded-[20px] p-8 relative overflow-hidden group cursor-default"
          style={{ background: 'linear-gradient(135deg, #0A5C45 0%, #073D2E 100%)', minHeight: 220 }}>
          {/* Decoration */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,147,58,0.15)' }} />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
              style={{ background: 'rgba(255,255,255,0.12)' }}>
              {heroF.icon}
            </div>
            <div className="font-syne font-extrabold text-xl mb-3" style={{ color: 'white' }}>{heroF.title}</div>
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{heroF.desc}</div>
          </div>

          {/* Mini chart decoration */}
          <svg className="absolute bottom-5 right-5 opacity-30" width="80" height="40" viewBox="0 0 80 40">
            <path d="M0,35 L16,28 L32,30 L48,12 L64,18 L80,5" fill="none" stroke="#E8B45A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Gold accent card */}
        <div className="rounded-[20px] p-7 relative overflow-hidden cursor-default transition-all duration-200 group"
          style={{ background: 'linear-gradient(135deg, #C9933A 0%, #A07228 100%)', minHeight: 200 }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              {features[1].icon}
            </div>
            <div className="font-syne font-bold text-base mb-2" style={{ color: 'white' }}>{features[1].title}</div>
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{features[1].desc}</div>
          </div>
        </div>

        {/* Regular card */}
        <FeatureCard f={features[2]} />

        {/* Row 2: regular cards */}
        {rest.slice(2).map((f, i) => <FeatureCard key={i} f={f} />)}
      </div>
    </section>
  )
}

function FeatureCard({ f }) {
  return (
    <div className="rounded-[20px] p-6 cursor-default transition-all duration-200 border card-gradient-border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--bd)' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(10,92,69,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: 'var(--bg-muted)' }}>
        {f.icon}
      </div>
      <div className="font-syne font-bold text-sm mb-2" style={{ color: 'var(--tx-1)' }}>{f.title}</div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--tx-2)' }}>{f.desc}</div>
    </div>
  )
}
