import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'free', name: 'Bepul', price: '0', period: 'abadiy bepul', badge: null,
    features: ['30 tagacha tovar','Cheksiz sotuv yozish','Kunlik va oylik hisobot','Ombor qoldiqlari','1 foydalanuvchi',"O'zbek va rus tili",'Mobil qurilmada ishlaydi'],
    featured: false,
  },
  {
    id: 'pro', name: 'PRO', price: '29 900', period: "so'm / oy (~$2.5)", badge: '⭐ Eng mashhur',
    features: ['250 tagacha tovar','Narx tarixi','Excel/PDF eksport','Tovarlar analitikasi',"Ko'p foydalanuvchi (5 ta)",'Bulutda zaxira nusxa','Recharts grafiklar','Telegram xabarnomalar'],
    featured: true,
  },
  {
    id: 'biznes', name: 'BIZNES', price: '79 900', period: "so'm / oy (~$7)", badge: null,
    features: ['Cheksiz tovarlar','Barcha PRO imkoniyatlar','Cheksiz foydalanuvchilar','API kirish','VIP Telegram yordam','Maxsus integratsiyalar','Hisobot brending'],
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section className="py-28 px-6 md:px-16 max-w-[1200px] mx-auto" id="pricing">
      <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: 'var(--brand)' }}>Narxlar</span>
      <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight mb-4"
        style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
        Bepul boshlang
      </h2>
      <p className="reveal text-lg leading-relaxed max-w-lg mb-16" style={{ color: 'var(--tx-2)' }}>
        Asosiy funksiyalar abadiy bepul. Biznes o'sganda PRO yoki BIZNES tarifga o'ting.
      </p>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {plans.map(plan => (
          <div key={plan.id} className="relative rounded-[24px] p-9 border transition-all duration-300"
            style={{
              background: plan.featured ? 'linear-gradient(145deg, #0A5C45 0%, #073D2E 100%)' : 'var(--bg-card)',
              borderColor: plan.featured ? 'transparent' : 'var(--bd)',
              ...(plan.featured ? {
                boxShadow: '0 0 0 1px rgba(18,168,125,0.3), 0 24px 64px rgba(10,92,69,0.4), 0 0 80px rgba(10,92,69,0.12)',
                transform: 'scale(1.03)',
              } : {}),
            }}>

            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-5 py-2 rounded-full whitespace-nowrap"
                style={{ background: '#C9933A', boxShadow: '0 4px 14px rgba(201,147,58,0.4)' }}>
                {plan.badge}
              </div>
            )}

            {/* Plan name */}
            <div className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--tx-3)' }}>
              {plan.name}
            </div>

            {/* Price */}
            <div className="font-syne font-extrabold leading-none mb-1"
              style={{ fontSize: 44, color: plan.featured ? 'white' : 'var(--tx-1)' }}>
              {plan.price}
            </div>
            <div className="text-sm mb-8"
              style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--tx-3)' }}>
              {plan.period}
            </div>

            {/* Features */}
            <ul className="list-none mb-8 space-y-0 p-0">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm py-2.5 border-b"
                  style={{
                    color: plan.featured ? 'rgba(255,255,255,0.82)' : 'var(--tx-2)',
                    borderColor: plan.featured ? 'rgba(255,255,255,0.1)' : 'var(--bd)',
                  }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: plan.featured ? 'rgba(255,255,255,0.15)' : 'var(--bg-muted)',
                      color: plan.featured ? 'white' : 'var(--brand)',
                    }}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link to="/register"
              className="block text-center py-4 rounded-2xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
              style={plan.featured
                ? { background: 'white', color: '#0A5C45', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }
                : { background: 'var(--bg-surface)', color: 'var(--tx-1)', border: '1.5px solid var(--bd)' }}>
              Boshlash →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
