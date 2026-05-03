import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

function Counter({ end, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = Date.now()
        const tick = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setVal(Math.round(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

export default function StatsBar() {
  const { t } = useTranslation()

  const stats = [
    { counter: true, end: 500, suffix: 'K+', labelKey: 'statsBar.s1', icon: '👥' },
    { counter: false, raw: '3 min', labelKey: 'statsBar.s2', icon: '⚡' },
    { counter: true, end: 100, suffix: '%', labelKey: 'statsBar.s3', icon: '🌐' },
    { counter: false, raw: "0 so'm", labelKey: 'statsBar.s4', icon: '🎁' },
  ]

  return (
    <section style={{ background: '#0A5C45', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div className="relative grid grid-cols-2 md:grid-cols-4 max-w-[1200px] mx-auto px-6 md:px-16 py-14">
        {stats.map((s, i) => (
          <div key={i} className="text-center px-6 py-4"
            style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-syne font-extrabold mb-1" style={{ fontSize: 38, color: '#E8B45A' }}>
              {s.counter ? <Counter end={s.end} suffix={s.suffix} /> : s.raw}
            </div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{t(s.labelKey)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
