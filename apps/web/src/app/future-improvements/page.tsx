import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'
import { RoadmapHero } from './components/RoadmapHero'
import { IntegrationPlans } from './components/IntegrationPlans'
import { FeaturePlans } from './components/FeaturePlans'
import { ExtractionLogic } from './components/ExtractionLogic'
import { TrackedRequests } from './components/TrackedRequests'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Future Improvements | Omnivy Roadmap',
  description: 'See upcoming integrations, feature plans, and live GitHub requests for Omnivy.',
  alternates: {
    canonical: '/future-improvements',
  },
  openGraph: {
    title: 'Future Improvements | Omnivy Roadmap',
    description: 'See upcoming integrations, feature plans, and live GitHub requests for Omnivy.',
    url: '/future-improvements',
    siteName: 'Omnivy',
    images: [
      {
        url: `${getSiteUrl()}/Omnivy.webp`,
        width: 1200,
        height: 630,
        alt: 'Omnivy roadmap and future improvements',
      },
    ],
  },
}

export default function FutureImprovementsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-24 px-6">
      <div className="container mx-auto max-w-6xl space-y-10">
        <RoadmapHero />

        <div className="grid gap-8">
          <IntegrationPlans />
          <FeaturePlans />
          <ExtractionLogic />
          <TrackedRequests />
        </div>
      </div>
    </div>
  )
}
