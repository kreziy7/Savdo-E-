import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="py-32 px-6 md:px-16 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #062b1e 0%, #0A5C45 50%, #073D2E 100%)' }}>

      {/* Decorations */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,147,58,0.18) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(18,168,125,0.15) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="relative z-10 max-w-[700px] mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#E8B45A' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
          Bepul boshlash — karta kerak emas
        </div>

        <h2 className="font-syne font-extrabold leading-tight tracking-tight mb-6 text-white"
          style={{ fontSize: 'clamp(36px,5.5vw,68px)' }}>
          Qo'lda hisoblashni<br />bas qiling.
        </h2>

        <p className="text-lg mb-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Minglab savdogarlar bilan qo'shiling — ular allaqachon aqlli hisoblab yurishibdi.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <Link to="/register"
            className="px-10 py-4 rounded-2xl text-base font-bold no-underline transition-all hover:-translate-y-1"
            style={{ background: 'white', color: '#0A5C45', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            Bepul ro'yxatdan o'tish →
          </Link>
          <a href="#how"
            onClick={e => { e.preventDefault(); document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="px-8 py-4 rounded-2xl text-base font-medium no-underline text-white transition-all hover:-translate-y-0.5"
            style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}>
            Demo ko'rish
          </a>
        </div>

        {/* Mini stats row */}
        <div className="flex justify-center gap-8 flex-wrap">
          {[['500K+','Foydalanuvchi'],['100%','Brauzerda'],["0 so'm",'Boshlash']].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-syne font-extrabold text-xl" style={{ color: '#E8B45A' }}>{n}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
