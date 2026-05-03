import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function Cell({ val, highlight }) {
  if (val === true) {
    return (
      <td className="px-5 py-4 text-center">
        <div className="inline-flex w-7 h-7 rounded-full items-center justify-center"
          style={{ background: highlight ? 'rgba(255,255,255,0.15)' : 'var(--bg-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={highlight ? 'white' : '#12A87D'} strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
      </td>
    )
  }
  if (val === false) {
    return (
      <td className="px-5 py-4 text-center">
        <div className="inline-flex w-7 h-7 rounded-full items-center justify-center"
          style={{ background: highlight ? 'rgba(255,255,255,0.08)' : 'var(--bg-surface)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={highlight ? 'rgba(255,255,255,0.3)' : 'var(--tx-3)'} strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>
      </td>
    )
  }
  return (
    <td className="px-5 py-4 text-center text-sm font-medium"
      style={{ color: highlight ? 'rgba(255,255,255,0.85)' : 'var(--tx-2)' }}>
      {val}
    </td>
  )
}

export default function Compare() {
  const { t } = useTranslation()

  const rows = [
    { labelKey: 'compare.r1', savdo: t('compare.s_r1'),      daftar: t('compare.d_r1'),  excel: t('compare.e_r1') },
    { labelKey: 'compare.r2', savdo: true,                    daftar: false,               excel: t('compare.e_r2') },
    { labelKey: 'compare.r3', savdo: t('compare.s_r3'),      daftar: false,               excel: t('compare.e_r3') },
    { labelKey: 'compare.r4', savdo: true,                    daftar: false,               excel: t('compare.e_r4') },
    { labelKey: 'compare.r5', savdo: true,                    daftar: false,               excel: false },
    { labelKey: 'compare.r6', savdo: t('compare.s_r6'),      daftar: false,               excel: t('compare.e_r6') },
    { labelKey: 'compare.r7', savdo: true,                    daftar: true,                excel: t('compare.e_r7') },
    { labelKey: 'compare.r8', savdo: true,                    daftar: false,               excel: t('compare.e_r8') },
    { labelKey: 'compare.r9', savdo: t('compare.s_r9'),      daftar: t('compare.d_r9'),  excel: t('compare.e_r9') },
  ]

  return (
    <section className="py-28 px-6 md:px-16" id="compare"
      style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-[1000px] mx-auto">
        <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--brand)' }}>{t('compare.tag')}</span>
        <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight mb-4"
          style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
          {t('compare.title')}
        </h2>
        <p className="reveal text-lg leading-relaxed max-w-xl mb-14" style={{ color: 'var(--tx-2)' }}>
          {t('compare.desc')}
        </p>

        <div className="reveal rounded-[24px] overflow-hidden border" style={{ borderColor: 'var(--bd)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bd)' }}>
                <th className="px-5 py-5 text-left text-sm font-semibold w-[34%]"
                  style={{ color: 'var(--tx-3)', background: 'var(--bg-surface)' }}>
                  {t('compare.feature_col')}
                </th>
                <th className="px-5 py-5 text-center"
                  style={{ background: 'linear-gradient(145deg, #0A5C45, #073D2E)', width: '22%' }}>
                  <div className="font-syne font-extrabold text-white text-base">SAVDO</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('compare.your_choice')}</div>
                </th>
                <th className="px-5 py-5 text-center text-sm font-semibold"
                  style={{ color: 'var(--tx-2)', background: 'var(--bg-surface)', width: '22%' }}>
                  📓 Daftar
                </th>
                <th className="px-5 py-5 text-center text-sm font-semibold"
                  style={{ color: 'var(--tx-2)', background: 'var(--bg-surface)', width: '22%' }}>
                  📊 Excel
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--bd)' : 'none' }}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: 'var(--tx-1)', background: 'var(--bg-card)' }}>
                    {t(row.labelKey)}
                  </td>
                  <Cell val={row.savdo} highlight />
                  <td className="border-l" style={{ borderColor: 'var(--bd)' }}>
                    <Cell val={row.daftar} highlight={false} />
                  </td>
                  <td className="border-l" style={{ borderColor: 'var(--bd)' }}>
                    <Cell val={row.excel} highlight={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
            style={{ background: 'linear-gradient(145deg, #0A5C45, #073D2E)' }}>
            <p className="text-sm text-white font-semibold">{t('compare.footer_text')}</p>
            <Link to="/login"
              className="px-6 py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
              style={{ background: 'white', color: '#0A5C45' }}>
              {t('compare.cta')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
