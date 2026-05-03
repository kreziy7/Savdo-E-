import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  FileText,
  Link2,
  Smartphone,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../../components/site/SectionHeader'

const featureCards = [
  {
    title: 'Tahlillar',
    description: 'Savdo, foyda va mahsulot aylanishini kundalik, haftalik va filiallar kesimida kuzating.',
    icon: BarChart3,
    chart: [28, 52, 40, 68, 47, 76],
  },
  {
    title: 'Ombor',
    description: 'Kirim-chiqim, qoldiq va qayta buyurtma nuqtalarini avtomatik nazorat qiling.',
    icon: Boxes,
  },
  {
    title: 'Hisob-faktura',
    description: "To'lovlar, qarzdorlik va hujjatlarni bir necha bosqichsiz rasmiylashtiring.",
    icon: FileText,
  },
  {
    title: 'Mijozlar bilan ishlash',
    description: 'Har bir xaridor tarixini, segmentini va qayta savdo imkoniyatini saqlang.',
    icon: Users,
  },
  {
    title: 'Integratsiyalar',
    description: "Kassa, to'lov tizimlari va tashqi xizmatlar bilan ulanib, jarayonlarni bog'lang.",
    icon: Link2,
  },
  {
    title: 'Mobil ilova',
    description: "Rahbar va jamoa uchun tezkor ko'rsatkichlar hamda tasdiqlashlar telefonda ham tayyor.",
    icon: Smartphone,
  },
]

const workflowSteps = [
  { title: 'Buyurtma keladi', text: 'Onlayn, oflayn va filial oqimlari bir joyga tushadi.' },
  { title: 'Ombor tekshiradi', text: "Qoldiq yetarlimi yoki qayta buyurtma kerakmi, tizim ko'rsatadi." },
  { title: 'Hisob-kitob yopiladi', text: "To'lov va hujjatlar avtomatik bog'lanadi." },
  { title: "Hisobot tayyor bo'ladi", text: 'Rahbar paneli darhol yangilanadi.' },
]

const mobileSignals = [
  'Kunlik tushum xabarnomalari',
  "Qarzdorlik bo'yicha ogohlantirish",
  "Filiallar kesimida KPI ko'rinishi",
  'Rahbar tasdiqlari uchun bir tegish',
]

export default function FeaturesPage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="site-container pt-32 sm:pt-36">
        <SectionHeader
          tag={t('features.tag')}
          title={t('features.title')}
          description={t('features.desc')}
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon

            return (
              <div key={feature.title} className="section-card rounded-[30px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.12)] text-[var(--green-bright)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                  {feature.description}
                </p>

                {feature.chart ? (
                  <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex h-28 items-end gap-3">
                      {feature.chart.map((value, index) => (
                        <div key={index} className="flex flex-1 items-end">
                          <div
                            className="w-full rounded-t-[14px] bg-[linear-gradient(180deg,rgba(212,168,83,0.95),rgba(34,197,94,0.88))]"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                      <span>So'nggi 6 kun</span>
                      <span className="font-semibold text-[var(--gold)]">+24% o'sish</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-[color:var(--text-muted)]">
                      Jarayon tezligi oshdi, xatoliklar kamaydi va jamoa bitta ritmda ishlayapti.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="site-container mt-20 space-y-6">
        <div className="section-card grid gap-8 rounded-[38px] p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Bir tizimda oqim</span>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white">
              Buyurtmadan hisobotgacha uzluksiz jarayon
            </h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-muted)]">
              Har bir bo'lim alohida ishlayotgandek tuyuladi, lekin SAVDO ularni bir boshqaruv
              liniyasiga bog'laydi. Shunda rahbar doim oxirgi holatni ko'ra oladi.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.14)] text-sm font-semibold text-[var(--green-bright)]">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card grid gap-8 rounded-[38px] p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,31,18,0.9),rgba(18,49,30,0.95))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[color:var(--text-muted)]">Mobil ko'rinish</p>
                    <p className="mt-1 text-xl font-semibold text-white">Rahbar paneli</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[rgba(212,168,83,0.16)]" />
                </div>

                <div className="mt-5 space-y-3">
                  {mobileSignals.map((signal) => (
                    <div
                      key={signal}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white"
                    >
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="eyebrow">Har doim yoningizda</span>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white">
              Mobil ilova bilan qarorlar stolga bog'lanib qolmaydi
            </h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-muted)]">
              Rahbar yo'lda bo'lsa ham, jamoa omborda bo'lsa ham, eng muhim ko'rsatkichlar va
              tasdiqlar qo'l ostida bo'ladi. Bu tezlikni yo'qotmasdan boshqarish degani.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-[color:var(--text-muted)]">Tasdiqlar</p>
                <p className="mt-2 text-2xl font-semibold text-white">1 tegishda</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-[color:var(--text-muted)]">Xabarnomalar</p>
                <p className="mt-2 text-2xl font-semibold text-white">Darhol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container mt-20">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-7 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="panel-label">Keyingi qadam</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Imkoniyatlarni tarif bilan birga tanlang
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Jamoangiz hajmi va jarayonlar murakkabligiga qarab eng mos tarifni tanlashingiz
                mumkin.
              </p>
            </div>

            <Link className="btn-primary" to="/narxlar">
              Narxlarni ko&apos;rish
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
