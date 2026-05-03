import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Sparkles, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../../components/site/SectionHeader'

const planDefs = [
  {
    nameKey: 'pricing.plan_free',
    monthlyPrice: 0,
    descKey: 'pricing.plan_free_desc',
    ctaKey: 'pricing.cta_free',
    featured: false,
    noteKey: 'pricing.note_free',
    features: [true, true, true, false, false, false],
    to: '/login',
  },
  {
    nameKey: 'pricing.plan_pro',
    monthlyPrice: 29,
    descKey: 'pricing.plan_pro_desc',
    ctaKey: 'pricing.cta_pro',
    featured: true,
    noteKey: 'pricing.note_pro',
    features: [true, true, true, true, true, false],
    to: '/login',
  },
  {
    nameKey: 'pricing.plan_enterprise',
    monthlyPrice: 99,
    descKey: 'pricing.plan_enterprise_desc',
    ctaKey: 'pricing.cta_enterprise',
    featured: false,
    noteKey: 'pricing.note_enterprise',
    features: [true, true, true, true, true, true],
    to: '/login',
  },
]

const featureLabelKeys = ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f5', 'pricing.f6']
const faqKeys = [
  { qKey: 'pricing.q1', aKey: 'pricing.a1' },
  { qKey: 'pricing.q2', aKey: 'pricing.a2' },
  { qKey: 'pricing.q3', aKey: 'pricing.a3' },
  { qKey: 'pricing.q4', aKey: 'pricing.a4' },
]

function getPrice(plan, billing, t) {
  if (plan.monthlyPrice === 0) {
    return {
      amount: 0,
      suffix: t('pricing.per_month'),
      helper: billing === 'monthly' ? t('pricing.free_forever') : t('pricing.free_yearly'),
    }
  }

  if (billing === 'monthly') {
    return {
      amount: plan.monthlyPrice,
      suffix: t('pricing.per_month'),
      helper: t('pricing.cancel'),
    }
  }

  const discountedMonthly = Math.round(plan.monthlyPrice * 12 * 0.8 / 12)
  const annualTotal = Math.round(plan.monthlyPrice * 12 * 0.8)

  return {
    amount: discountedMonthly,
    suffix: t('pricing.per_month'),
    helper: `${t('pricing.old_price')}: $${plan.monthlyPrice}/${t('pricing.per_month')} → $${annualTotal}`,
  }
}

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly')
  const { t } = useTranslation()

  return (
    <>
      <section className="site-container pt-32 sm:pt-36">
        <SectionHeader
          tag={t('pricing.tag')}
          title={t('pricing.title')}
          description={t('pricing.desc')}
          align="center"
        />

        <div className="mt-8 flex justify-center">
          <div className="glass-panel inline-flex items-center gap-2 rounded-full p-2">
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                billing === 'monthly'
                  ? 'bg-[var(--green-bright)] text-[#041108]'
                  : 'text-[color:var(--text-muted)]'
              }`}
              onClick={() => setBilling('monthly')}
              type="button"
            >
              {t('pricing.monthly')}
            </button>
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                billing === 'yearly'
                  ? 'bg-[var(--green-bright)] text-[#041108]'
                  : 'text-[color:var(--text-muted)]'
              }`}
              onClick={() => setBilling('yearly')}
              type="button"
            >
              {t('pricing.yearly')}
            </button>
            <span className="rounded-full bg-[rgba(212,168,83,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              {t('pricing.save')}
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {planDefs.map((plan) => {
            const price = getPrice(plan, billing, t)

            return (
              <div
                key={plan.nameKey}
                className={`rounded-[34px] border p-6 sm:p-7 ${
                  plan.featured
                    ? 'border-[rgba(34,197,94,0.35)] bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(9,24,16,0.95))] shadow-[0_24px_60px_rgba(34,197,94,0.18)]'
                    : 'border-white/10 bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-white">{t(plan.nameKey)}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                      {t(plan.descKey)}
                    </p>
                  </div>
                  {plan.featured ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,168,83,0.24)] bg-[rgba(212,168,83,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      <Sparkles size={14} />
                      {t('pricing.popular')}
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-semibold text-white">${price.amount}</span>
                    <span className="pb-2 text-sm text-[color:var(--text-muted)]">{price.suffix}</span>
                  </div>
                  {billing === 'yearly' && plan.monthlyPrice > 0 ? (
                    <p className="mt-2 text-sm text-[var(--gold)]">
                      {t('pricing.old_price')}: ${plan.monthlyPrice}/{t('pricing.per_month')}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm text-[color:var(--text-muted)]">{price.helper}</p>
                </div>

                <Link
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-[var(--green-bright)] text-[#041108] hover:translate-y-[-1px]'
                      : 'border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]'
                  }`}
                  to={plan.to}
                >
                  {t(plan.ctaKey)}
                  <ArrowRight size={17} />
                </Link>

                <p className="mt-4 text-sm text-[color:var(--text-muted)]">{t(plan.noteKey)}</p>

                <div className="mt-8 space-y-3">
                  {featureLabelKeys.map((labelKey, index) => {
                    const included = plan.features[index]

                    return (
                      <div
                        key={labelKey}
                        className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            included
                              ? 'bg-[rgba(34,197,94,0.14)] text-[var(--green-bright)]'
                              : 'bg-white/6 text-[color:var(--text-muted)]'
                          }`}
                        >
                          {included ? <Check size={16} /> : <X size={16} />}
                        </span>
                        <span
                          className={`text-sm ${
                            included ? 'text-white' : 'text-[color:var(--text-muted)]'
                          }`}
                        >
                          {t(labelKey)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="site-container mt-20">
        <div className="section-card rounded-[38px] p-7 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="eyebrow">{t('pricing.faq_tag')}</span>
              <h2 className="mt-5 font-display text-4xl leading-tight text-white">
                {t('pricing.faq_title')}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[color:var(--text-muted)]">
              {t('pricing.faq_sub')}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {faqKeys.map((item) => (
              <div key={item.qKey} className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                <h3 className="text-xl font-semibold text-white">{t(item.qKey)}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                  {t(item.aKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
