import { Metadata } from 'next'
import { getChromeExtensionStats } from '@/lib/chromeWebStore'
import { UserReviewsSection } from './components/UserReviewsSection'
import { InstallHero } from './components/InstallHero'
import { InstallPreview } from './components/InstallPreview'

export const metadata: Metadata = {
  title: 'Install Omnivy Extension | Browser Clipper for Obsidian and Cloud Sync',
  description: 'Install the Omnivy browser extension to clip web pages into Obsidian, Notion, Google Drive, OneDrive, and Dropbox.',
  alternates: {
    canonical: '/install',
  },
}

export const dynamic = 'force-dynamic'

export default async function InstallPage() {
  const chromeStats = await getChromeExtensionStats()

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[var(--bg-primary)] overflow-hidden relative">
    
      <div className="absolute top-1/4 -right-64 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-64 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        <InstallHero chromeStats={chromeStats} />
        <InstallPreview />
      </div>
 
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <UserReviewsSection
          totalReviews={chromeStats.reviews}
          averageRating={chromeStats.rating}
          reviewsUrl={chromeStats.reviewsUrl}
        />
      </div>
    </div>
  )
}
