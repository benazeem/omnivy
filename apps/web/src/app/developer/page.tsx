import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'
import { DeveloperHero } from './components/DeveloperHero'
import { DeveloperSidebar } from './components/DeveloperSidebar'
import { DeveloperTracks } from './components/DeveloperTracks'
import { DeveloperAbout } from './components/DeveloperAbout'
import { DeveloperProjects } from './components/DeveloperProjects'
import { DeveloperWhyBuilt } from './components/DeveloperWhyBuilt'

export const metadata: Metadata = {
  title: 'Mohd Azeem Malik | Full-Stack Developer',
  description:
    'Explore the portfolio and technical focus of Mohd Azeem Malik, creator of Omnivy.',
  alternates: {
    canonical: '/developer',
  },
  openGraph: {
    title: 'Mohd Azeem Malik | Full-Stack Developer',
    description:
      'Explore the portfolio and technical focus of Mohd Azeem Malik, creator of Omnivy.',
    url: '/developer',
    siteName: 'Omnivy',
    images: [
      {
        url: `${getSiteUrl()}/Developer.webp`,
        width: 1200,
        height: 630,
        alt: 'Mohd Azeem Malik developer profile',
      },
    ],
  },
}

export default function DeveloperPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-6xl space-y-16">
        <DeveloperHero />

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 md:gap-12 items-start">
          <div className="space-y-12 min-w-0">
            <DeveloperTracks />
            <DeveloperAbout />
            <DeveloperProjects />
            <DeveloperWhyBuilt />
          </div>

          <div className="sticky top-24">
            <DeveloperSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
