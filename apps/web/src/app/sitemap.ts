import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

const publicRoutes = [
  '/',
  '/install',
  '/documentation',
  '/future-improvements',
  '/developer',
  '/privacy-policy',
  '/terms-of-service',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const currentDate = new Date()

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route === '/' ? '' : route}`,
    lastModified: currentDate,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))
}