import useScrollReveal from '../hooks/useScrollReveal'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import StatsBar from '../components/landing/StatsBar'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Integrations from '../components/landing/Integrations'
import Testimonials from '../components/landing/Testimonials'
import Compare from '../components/landing/Compare'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  useScrollReveal()
  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Integrations />
      <Testimonials />
      <Compare />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
