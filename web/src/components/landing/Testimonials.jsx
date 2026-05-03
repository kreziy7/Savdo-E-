import { useTranslation } from 'react-i18next'

const reviews = [
  { name: 'Jasur Karimov',    role: 'Kiyim savdogari, Toshkent',       text: "Ilgari daftarga yozardim. Endi SAVDO bor — kun oxirida hisobot tayyor. Foydani aniq bilaman.", avatar: 'J', color: '#0A5C45' },
  { name: 'Malika Yusupova',  role: "Oziq-ovqat do'koni, Samarqand",   text: "3 xodimim bor, har biri alohida kirishadi. Kim qancha sotganini ko'raman. Ajoyib!", avatar: 'M', color: '#C9933A' },
  { name: 'Bobur Toshmatov',  role: 'Elektronika savdosi, Namangan',    text: "250 ta tovar bor edi, hammasini qo'shdim. Qidiruv shunchalar tez! Excel eksport ham qulay.", avatar: 'B', color: '#0E7A5C' },
  { name: 'Dilnoza Ergasheva', role: 'Kosmetika salon, Andijon',        text: "Telefon raqam bilan kirish juda oson. Har kuni Telegram ga hisobot keladi — zo'r!", avatar: 'D', color: '#12A87D' },
  { name: 'Sherzod Nazarov',  role: "Qurilish materiallari, Buxoro",   text: "Omborimni to'liq nazorat qilaman. Qoldiqdagi tovarlar haqida signal keladi. Vaqtim tejaldi.", avatar: 'S', color: '#073D2E' },
  { name: 'Zulfiya Mirzayeva', role: "Dorixona, Farg'ona",             text: "PRO tarifga o'tdim — Telegram xabarnomalar bizga juda qulay. Har kech hisobot keladi!", avatar: 'Z', color: '#C9933A' },
]

const doubled = [...reviews, ...reviews]

function ReviewCard({ r }) {
  return (
    <div className="rounded-[20px] p-7 flex-shrink-0 transition-all"
      style={{ width: 320, background: 'var(--bg-card)', border: '1px solid var(--bd)', boxShadow: '0 4px 20px rgba(13,31,24,0.06)' }}>
      <div className="flex mb-3">
        {[...Array(5)].map((_, j) => (
          <span key={j} style={{ color: '#C9933A', fontSize: 15 }}>★</span>
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--tx-2)' }}>&quot;{r.text}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl font-syne font-bold text-sm text-white flex items-center justify-center flex-shrink-0"
          style={{ background: r.color }}>
          {r.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--tx-1)' }}>{r.name}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--tx-3)' }}>{r.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t } = useTranslation()

  return (
    <section className="py-28 overflow-hidden" id="testimonials" style={{ background: 'var(--bg-surface)' }}>
      <div className="px-6 md:px-16 max-w-[1200px] mx-auto mb-14">
        <span className="reveal block text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--brand)' }}>{t('reviews.tag')}</span>
        <h2 className="reveal font-syne font-extrabold leading-tight tracking-tight"
          style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--tx-1)' }}>
          {t('reviews.title')}
        </h2>
      </div>

      <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
        <div className="marquee-track flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {doubled.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>

      <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
        className="mt-4">
        <div className="flex gap-4" style={{ width: 'max-content', animation: 'marquee 40s linear infinite reverse' }}>
          {[...doubled].reverse().map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
