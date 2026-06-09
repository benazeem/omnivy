import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '../context/ThemeContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CustomCursor from '../components/CustomCursor'
import Providers from '../components/Providers'
import '../styles.css'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()
const siteName = 'Omnivy'
const siteDescription =
  'Omnivy is a browser clipper for Obsidian, Notion, Google Drive, OneDrive, and Dropbox. Capture articles, highlights, and bookmarks with a fast, private workflow.'
const shortDescription =
  'Omnivy is a browser clipper for Obsidian, Notion, Google Drive, OneDrive, and Dropbox.'
const ogImage = '/Omnivy.webp'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Omnivy | Browser clipper for Obsidian, Notion, Drive, OneDrive, and Dropbox',
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: 'Mohd Azeem Malik', url: 'https://x.com/devazeem' }],
  creator: 'Mohd Azeem Malik',
  publisher: siteName,
  keywords: [
    'Omnivy',
    'Obsidian Plus Web Clipper',
    'browser extension',
    'browser clipping',
    'Obsidian',
    'Notion',
    'Google Drive',
    'OneDrive',
    'Dropbox',
    'cloud markdown upload',
    'knowledge capture',
    'web clipper',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName,
    url: siteUrl,
    title: 'Omnivy | Clip the Web Instantly',
    description: shortDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Omnivy browser clipping and sync preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omnivy | Clip the Web Instantly',
    description: shortDescription,
    images: [ogImage],
  },
  icons: {
    icon: [{ url: '/icon.ico', type: 'image/x-icon' }],
    shortcut: ['/icon.ico'],
    apple: [{ url: '/icon.ico' }],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'productivity',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#111827',
  colorScheme: 'light dark',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: shortDescription,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/icon.ico`,
  sameAs: ['https://github.com/benazeem/omnivy', 'https://x.com/devazeem'],
  description: shortDescription,
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteName,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Chrome and Chromium-based browsers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  url: siteUrl,
  description: shortDescription,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-[var(--bg-primary)] antialiased transition-colors duration-300">
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-brand-600 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <ThemeProvider>
            <CustomCursor />
            <Header />
            <main id="main-content" className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
