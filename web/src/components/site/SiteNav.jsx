import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'uz', label: "O'zb" },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
]

const navLinks = [
  { label: 'Bosh sahifa', to: '/' },
  { label: 'Imkoniyatlar', to: '/imkoniyatlar' },
  { label: 'Narxlar', to: '/narxlar' },
]

function navLinkClass({ isActive }, isDark) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-[#0D1F18]'
      : isDark
        ? 'text-[color:var(--text-muted)] hover:bg-white/5 hover:text-white'
        : 'text-[#0D1F18]/70 hover:bg-black/5 hover:text-[#0D1F18]',
  ].join(' ')
}

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const { isDark, toggle } = useTheme()
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.slice(0, 2) || 'uz'

  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <div className="site-container">
        <div className="glass-panel rounded-[30px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">

            <Link className="flex items-center gap-3" to="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,197,94,1),rgba(212,168,83,0.92))] text-base font-black text-[#041108] shadow-[0_10px_30px_rgba(34,197,94,0.35)]">S</span>
              <div>
                <p className="font-syne text-xl uppercase font-extrabold" style={{ color: isDark ? '#fff' : '#0D1F18' }}>SAVDO</p>
                <p className="text-xs uppercase tracking-[0.28em]" style={{ color: isDark ? 'var(--text-muted)' : 'rgba(13,31,24,0.5)' }}>Biznes platformasi</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((item) => (
                <NavLink key={item.to} className={(s) => navLinkClass(s, isDark)} to={item.to} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center rounded-full p-1 gap-0.5"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13,31,24,0.06)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.1)' }}>
                {LANGS.map(({ code, label }) => (
                  <button key={code} onClick={() => i18n.changeLanguage(code)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold transition"
                    style={{
                      background: currentLang === code ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,31,24,0.12)') : 'transparent',
                      color: currentLang === code ? (isDark ? '#fff' : '#0D1F18') : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(13,31,24,0.45)'),
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <button onClick={toggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition"
                style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.15)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,24,0.05)', color: isDark ? '#fff' : '#0D1F18' }}>
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <Link to="/login"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
                style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.2)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,24,0.05)', color: isDark ? '#fff' : '#0D1F18' }}>
                Kirish
              </Link>
              <Link className="btn-primary" to="/narxlar">Bepul boshlash</Link>
            </div>

            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full transition md:hidden"
              style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.15)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,24,0.05)', color: isDark ? '#fff' : '#0D1F18' }}
              onClick={() => setIsOpen(o => !o)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {isOpen && (
            <div className="mt-4 rounded-[28px] p-4 md:hidden"
              style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.1)', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }}>
              <nav className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <NavLink key={item.to} className={(s) => navLinkClass(s, isDark)} to={item.to} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center rounded-full p-1 gap-0.5"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13,31,24,0.06)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.1)' }}>
                  {LANGS.map(({ code, label }) => (
                    <button key={code} onClick={() => i18n.changeLanguage(code)}
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition"
                      style={{ background: currentLang === code ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,31,24,0.12)') : 'transparent', color: currentLang === code ? (isDark ? '#fff' : '#0D1F18') : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(13,31,24,0.45)') }}>
                      {label}
                    </button>
                  ))}
                </div>
                <button onClick={toggle}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition"
                  style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.15)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,24,0.05)', color: isDark ? '#fff' : '#0D1F18' }}>
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "Yorug' rejim" : "Qorong'u rejim"}
                </button>
                <Link to="/login" className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
                  style={{ border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(13,31,24,0.2)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,24,0.05)', color: isDark ? '#fff' : '#0D1F18' }}>
                  Kirish
                </Link>
                <Link className="btn-primary text-center" to="/register">Bepul boshlash</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
