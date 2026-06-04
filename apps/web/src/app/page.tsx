import { HomeHero } from '@/components/home/HomeHero'
import { SupportedWorkspaces } from '@/components/home/SupportedWorkspaces'
import { FeaturesGrid } from '@/components/home/FeaturesGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FAQSection } from '@/components/home/FAQSection'
import { faqSchema } from '@/constants/home'

export default function Home() {
  return (
    <div className="bg-[var(--bg-primary)] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeHero />
      <SupportedWorkspaces />
      <FeaturesGrid />
      <HowItWorks />
      <FAQSection />
    </div>
  )
}
