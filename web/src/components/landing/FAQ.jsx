import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const faqKeys = [
  { qKey: 'faqL.q1', aKey: 'faqL.a1' },
  { qKey: 'faqL.q2', aKey: 'faqL.a2' },
  { qKey: 'faqL.q3', aKey: 'faqL.a3' },
  { qKey: 'faqL.q4', aKey: 'faqL.a4' },
  { qKey: 'faqL.q5', aKey: 'faqL.a5' },
  { qKey: 'faqL.q6', aKey: 'faqL.a6' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const { t } = useTranslation()

  return (
    <section className="py-28 px-6 md:px-16 max-w-[860px] mx-auto" id="faq">
      <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: 'var(--brand)' }}>{t('faqL.tag')}</span>
      <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight mb-14"
        style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
        {t('faqL.title')}
      </h2>

      <div className="flex flex-col gap-3">
        {faqKeys.map((f, i) => (
          <div key={i} className="reveal rounded-[18px] overflow-hidden transition-all duration-200"
            style={{ border: `1.5px solid ${open === i ? 'var(--brand)' : 'var(--bd)'}`, background: 'var(--bg-card)' }}>
            <button className="w-full flex items-center justify-between px-6 py-5 text-left bg-transparent border-none cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}>
              <span className="font-syne font-semibold text-[15px]" style={{ color: 'var(--tx-1)' }}>{t(f.qKey)}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 transition-all"
                style={{ background: open === i ? 'var(--brand)' : 'var(--bg-surface)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={open === i ? 'white' : 'var(--tx-2)'} strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
            </button>
            {open === i && (
              <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: 'var(--tx-2)' }}>
                {t(f.aKey)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
