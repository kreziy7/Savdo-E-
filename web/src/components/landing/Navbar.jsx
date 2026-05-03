import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isDark, toggle } = useTheme()

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 transition-all"
        style={{
          background: isDark ? 'rgba(11,22,18,0.88)' : 'rgba(250,248,244,0.88)',
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${isDark ? 'rgba(29,46,38,0.8)' : '#D8EAE4'}`,
        }}>

        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
            style={{ background: '#0A5C45' }}>
            <div style={{ background: '#C9933A', width: 18, height: 18, position: 'absolute', top: -5, right: -5, borderRadius: '50%', opacity: 0.9 }} />
            <svg className="relative z-10" width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L7 10L10 13L15 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="3" cy="14" r="1.5" fill="white"/>
              <circle cx="15" cy="6" r="1.5" fill="white"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: 'var(--tx-1)' }}>
            SAV<span style={{ color: 'var(--brand)' }}>DO</span>
          </span>
        </Link>

        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {[['#features','Imkoniyatlar'],['#how','Qanday ishlaydi'],['#integrations','Integratsiyalar'],['#compare','Taqqoslash'],['#pricing','Narxlar'],['#faq','FAQ']].map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={e => { e.preventDefault(); scrollTo(href) }}
                className="text-sm font-medium no-underline transition-colors"
                style={{ color: 'var(--tx-2)' }}
                onMouseEnter={e => e.target.style.color = 'var(--brand)'}
                onMouseLeave={e => e.target.style.color = 'var(--tx-2)'}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border-none"
            style={{ background: isDark ? 'rgba(18,168,125,0.12)' : 'rgba(10,92,69,0.07)', color: 'var(--brand)' }}
            title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}>
            {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
          </button>

          <Link to="/login" className="hidden md:block text-sm font-medium no-underline px-4 py-2 rounded-xl transition-all"
            style={{ color: 'var(--tx-2)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.background = 'var(--bg-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--tx-2)'; e.currentTarget.style.background = 'transparent' }}>
            Kirish
          </Link>
          <Link to="/register"
            className="px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-px"
            style={{ background: '#0A5C45', color: 'white', boxShadow: '0 4px 14px rgba(10,92,69,0.3)' }}>
            Bepul boshlash
          </Link>
          <button className="md:hidden p-1 bg-transparent border-none cursor-pointer" onClick={() => setOpen(o => !o)}>
            {open ? <X size={22} color="var(--tx-1)" /> : <Menu size={22} color="var(--tx-1)" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed top-[68px] left-0 right-0 z-40 px-6 py-5 flex flex-col gap-3 shadow-xl"
          style={{ background: 'var(--bg-card)', borderBottom: `1px solid var(--bd)` }}>
          {[['#features','Imkoniyatlar'],['#how','Qanday ishlaydi'],['#integrations','Integratsiyalar'],['#compare','Taqqoslash'],['#pricing','Narxlar'],['#faq','FAQ']].map(([href, label]) => (
            <a key={href} href={href} onClick={e => { e.preventDefault(); scrollTo(href) }}
              className="text-sm font-medium no-underline py-2 border-b"
              style={{ color: 'var(--tx-2)', borderColor: 'var(--bd)' }}>
              {label}
            </a>
          ))}
          <div className="flex gap-3 mt-1">
            <button onClick={toggle}
              className="flex-1 py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all"
              style={{ background: 'var(--bg-surface)', color: 'var(--tx-2)' }}>
              {isDark ? "☀️ Yorug' rejim" : "🌙 Qorong'u rejim"}
            </button>
            <Link to="/register" className="flex-1 text-center py-3 rounded-xl font-bold no-underline text-sm"
              style={{ background: '#0A5C45', color: 'white' }}>
              Boshlash →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
