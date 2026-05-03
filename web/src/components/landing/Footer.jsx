import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0B1612', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      className="px-6 md:px-16 pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{ background: '#0A5C45' }}>
                <div style={{ background: '#C9933A', width: 16, height: 16, position: 'absolute', top: -4, right: -4, borderRadius: '50%', opacity: 0.9 }} />
                <svg className="relative z-10" width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14L7 10L10 13L15 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="3" cy="14" r="1.5" fill="white"/>
                  <circle cx="15" cy="6" r="1.5" fill="white"/>
                </svg>
              </div>
              <span className="font-syne font-extrabold text-lg text-white">SAVDO</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Savdo qiling, hisoblang.<br />O'zbekiston savdogarlari uchun.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {['T','G','I'].map(s => (
                <div key={s} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Mahsulot',  links: ["Imkoniyatlar","Narxlar","Yangiliklar","Yo'l xaritasi"] },
            { title: 'Kompaniya', links: ["Biz haqimizda","Blog","Hamkorlar","Karyera"] },
            { title: 'Yordam',    links: ["Qo'llanma","FAQ","Telegram chat","Bog'lanish"] },
          ].map(col => (
            <div key={col.title}>
              <div className="font-syne font-bold text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{col.title}</div>
              <ul className="list-none flex flex-col gap-3 p-0 m-0">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm no-underline transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2025 SAVDO. Barcha huquqlar himoyalangan.
          </span>
          <div className="flex gap-5 flex-wrap justify-center">
            {['Shartlar','Maxfiylik','Cookie'].map(l => (
              <a key={l} href="#" className="text-xs no-underline transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>{l}</a>
            ))}
            <Link to="/login" className="text-xs no-underline transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>Kirish</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
