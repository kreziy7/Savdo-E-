import { useTranslation } from 'react-i18next'

const integrationDefs = [
  {
    name: 'Telegram',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#229ED9"/>
        <path d="M5.5 11.8l11-4.3c.5-.2.9.1.8.6l-1.9 8.7c-.1.5-.5.7-.9.4l-2.5-1.9-1.2 1.1c-.1.1-.3.2-.5.2l.2-2.6 4.9-4.5c.2-.2 0-.3-.3-.1L8.1 13.4 5.7 12.7c-.5-.2-.5-.5 0-.8.1.1-.2-.1 0 0z" fill="white"/>
      </svg>
    ),
    descKey: 'integ.telegram_desc',
    badgeKey: 'integ.popular',
    color: '#229ED9',
  },
  {
    name: 'Excel',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#217346"/>
        <path d="M7 7h4l2 4 2-4h4v10h-2V9.5l-2 4h-2l-2-4V17H7V7z" fill="white"/>
      </svg>
    ),
    descKey: 'integ.excel_desc',
    badgeKey: null,
    color: '#217346',
  },
  {
    name: 'PDF',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#E03F3F"/>
        <text x="4" y="17" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial">PDF</text>
      </svg>
    ),
    descKey: 'integ.pdf_desc',
    badgeKey: null,
    color: '#E03F3F',
  },
  {
    name: 'Payme',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1AC8ED"/>
        <text x="3" y="16" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial">PAY</text>
      </svg>
    ),
    descKey: 'integ.payme_desc',
    badgeKey: null,
    color: '#1AC8ED',
  },
  {
    name: 'Click',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#FF6600"/>
        <text x="2" y="16" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial">CLK</text>
      </svg>
    ),
    descKey: 'integ.click_desc',
    badgeKey: null,
    color: '#FF6600',
  },
  {
    name: 'Uzum',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#7B2FBE"/>
        <text x="2" y="16" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial">UZM</text>
      </svg>
    ),
    descKey: 'integ.uzum_desc',
    badgeKey: null,
    color: '#7B2FBE',
  },
]

export default function Integrations() {
  const { t } = useTranslation()

  return (
    <section className="py-28 px-6 md:px-16 relative overflow-hidden" id="integrations"
      style={{ background: 'var(--bg-surface)' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(var(--tx-1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--brand)' }}>{t('integ.tag')}</span>
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="font-syne font-extrabold leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
            {t('integ.title')}
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--tx-2)' }}>
            {t('integ.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {integrationDefs.map((item, i) => (
            <div key={i} className="reveal rounded-[20px] p-7 relative overflow-hidden transition-all duration-200 cursor-default group border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--bd)' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = item.color
                e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--bd)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 120, height: 120, borderRadius: '50%',
                background: item.color, opacity: 0.06, pointerEvents: 'none',
              }} />
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${item.color}15` }}>
                  {item.icon}
                </div>
                {item.badgeKey && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ background: `${item.color}18`, color: item.color }}>
                    {t(item.badgeKey)}
                  </span>
                )}
              </div>
              <div className="font-syne font-bold text-base mb-2" style={{ color: 'var(--tx-1)' }}>{item.name}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--tx-2)' }}>{t(item.descKey)}</div>
              <div className="flex items-center gap-2 mt-5">
                <div className="w-2 h-2 rounded-full" style={{ background: '#12A87D' }} />
                <span className="text-xs font-medium" style={{ color: '#12A87D' }}>{t('integ.connected')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-14">
          <p className="text-sm" style={{ color: 'var(--tx-3)' }}>
            {t('integ.coming')}
          </p>
        </div>
      </div>
    </section>
  )
}
