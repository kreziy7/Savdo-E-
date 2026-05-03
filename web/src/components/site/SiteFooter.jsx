import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="site-container py-8 sm:py-10">
        <div className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,197,94,1),rgba(212,168,83,0.92))] text-base font-black text-[#041108]">S</span>
              <div>
                <p className="font-syne text-xl uppercase text-white">SAVDO</p>
                <p className="text-sm text-[color:var(--text-muted)]">O'zbekistonning biznes boshqaruvi uchun yagona raqamli maydoni.</p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[color:var(--text-muted)]">
              SAVDO sotuv, ombor, mijozlar va hisobotlarni bitta qulay boshqaruv panelida birlashtiradi.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm text-[color:var(--text-muted)] sm:items-end">
            <div className="flex flex-wrap gap-3">
              <Link className="transition hover:text-white" to="/">Bosh sahifa</Link>
              <Link className="transition hover:text-white" to="/imkoniyatlar">Imkoniyatlar</Link>
              <Link className="transition hover:text-white" to="/narxlar">Narxlar</Link>
            </div>
            <p>500K+ savdogar ishonchi bilan</p>
            <p className="text-xs uppercase tracking-[0.25em]">© 2026 SAVDO</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
