import { Outlet } from 'react-router-dom'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'

export default function SiteLayout() {
  return (
    <div id="site-layout" className="relative isolate min-h-screen overflow-hidden"
      style={{ background: 'var(--bg-page)' }}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-7rem] h-72 w-72 rounded-full bg-[rgba(34,197,94,0.18)] blur-[110px]" />
        <div className="absolute right-[-5rem] top-24 h-64 w-64 rounded-full bg-[rgba(212,168,83,0.14)] blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(34,197,94,0.12)] blur-[130px]" />
      </div>
      <SiteNav />
      <main className="pb-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
