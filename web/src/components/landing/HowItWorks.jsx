import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const stepKeys = [
  { num: '01', icon: '📝', titleKey: 'how.s1_title', descKey: 'how.s1_desc' },
  { num: '02', icon: '📦', titleKey: 'how.s2_title', descKey: 'how.s2_desc' },
  { num: '03', icon: '🛒', titleKey: 'how.s3_title', descKey: 'how.s3_desc' },
  { num: '04', icon: '📈', titleKey: 'how.s4_title', descKey: 'how.s4_desc' },
]

export default function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section style={{ background: '#0D1F18', position: 'relative', overflow: 'hidden' }} className="py-28 px-6 md:px-16" id="how">
      <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,92,69,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,147,58,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#E8B45A' }}>
          {t('how.tag')}
        </span>
        <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight mb-4 text-white"
          style={{ fontSize: 'clamp(32px,4vw,52px)' }}>
          {t('how.title')}
        </h2>
        <p className="reveal text-lg leading-relaxed max-w-lg mb-16" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {t('how.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {stepKeys.map((s, i) => (
            <div key={i} className="reveal rounded-[20px] p-8 relative overflow-hidden transition-all duration-300 cursor-default group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.borderColor = 'rgba(18,168,125,0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
              <div className="font-syne font-extrabold absolute top-4 right-5 leading-none select-none"
                style={{ fontSize: 64, color: 'rgba(255,255,255,0.05)' }}>{s.num}</div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-syne font-bold text-sm mb-4"
                style={{ background: 'rgba(18,168,125,0.15)', color: '#12A87D' }}>
                {s.num}
              </div>
              <span className="text-3xl mb-5 block">{s.icon}</span>
              <div className="font-syne font-bold text-lg mb-2.5 text-white">{t(s.titleKey)}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{t(s.descKey)}</div>
              {i < stepKeys.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#0D1F18', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-14">
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #0A5C45, #0E7A5C)', color: 'white', boxShadow: '0 8px 28px rgba(10,92,69,0.4)' }}>
            {t('how.cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
