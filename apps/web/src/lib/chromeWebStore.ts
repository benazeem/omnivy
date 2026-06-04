import axios from 'axios'
import { Prisma } from '@prisma/client'
import * as cheerio from 'cheerio'
import { db } from './database'
import { ChromeExtensionReview, ChromeExtensionReviewsResult, ChromeExtensionStats, ChromeExtensionStatsRow } from '@/types/webStore'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const DEFAULT_EXTENSION_ID =
  process.env.CHROME_WEB_STORE_EXTENSION_ID?.trim() ||
  'nbeeifpffimepiobjmhpfihileadikdo'
const DEFAULT_EXTENSION_SLUG: string =
  process.env.CHROME_EXTENSION_SLUG?.trim() || 'obsidian-plus-web-clipper'
const TABLE_NAME = 'chrome_extension_stats'

const FALLBACK_REVIEWS_BY_EXTENSION_ID: Record<
  string,
  ChromeExtensionReview[]
> = {
  [DEFAULT_EXTENSION_ID]: [
    {
      id: 'fallback-mohd-azeem-malik',
      rating: 5,
      comment:
        'Omnivy is built to make web clipping feel fast and simple: capture clean Markdown from the browser, then save it to Obsidian, Notion, Google Drive, OneDrive, or Dropbox.',
      author: 'Mohd Azeem Malik',
      helpfulText:
        'Fallback message shown when Chrome Web Store review text cannot be loaded.',
    },
  ],
}


export function getDefaultChromeWebStoreExtensionId() {
  return (
    process.env.CHROME_WEB_STORE_EXTENSION_ID?.trim() || DEFAULT_EXTENSION_ID
  )
}

function getDefaultChromeWebStoreExtensionSlug() {
  return (
    process.env.CHROME_WEB_STORE_EXTENSION_SLUG?.trim() ||
    DEFAULT_EXTENSION_SLUG
  )
}

function getChromeWebStoreUrl(extensionId: string) {
  return `https://chromewebstore.google.com/detail/${getDefaultChromeWebStoreExtensionSlug()}/${extensionId}`
}

function getChromeWebStoreReviewsUrl(extensionId: string) {
  return `${getChromeWebStoreUrl(extensionId)}/reviews`
}

async function ensureStatsTable() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      extension_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rating TEXT NOT NULL,
      reviews TEXT NOT NULL,
      users TEXT NOT NULL,
      icon TEXT NOT NULL,
      last_updated TIMESTAMPTZ NULL,
      source_url TEXT NOT NULL,
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await db.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS chrome_extension_stats_fetched_at_idx
    ON ${TABLE_NAME} (fetched_at DESC)
  `)
}

function normalizeTitle(title: string) {
  return title.replace(/\s*-\s*Chrome Web Store$/i, '').trim()
}

function extractMatch(pattern: RegExp, text: string) {
  const match = text.match(pattern)
  return match?.[1]?.trim() || null
}

function parseLastUpdated(text: string) {
  const rawDate = extractMatch(
    /Updated\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i,
    text,
  )
  if (!rawDate) return null

  const parsed = new Date(rawDate)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

async function scrapeChromeWebStore(
  extensionId: string,
): Promise<ChromeExtensionStats> {
  const sourceUrl = getChromeWebStoreUrl(extensionId)
  const reviewsUrl = getChromeWebStoreReviewsUrl(extensionId)
  const { data: html } = await axios.get<string>(sourceUrl, {
    responseType: 'text',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  const $ = cheerio.load(html)
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
  const name = normalizeTitle(
    (
      $('h1').first().text() ||
      $('meta[property="og:title"]').attr('content') ||
      ''
    ).trim(),
  )
  const icon = (
    $('meta[property="og:image"]').attr('content') ||
    $('img[alt*="Item logo image"]').first().attr('src') ||
    ''
  ).trim()

  if (!name || !icon) {
    throw new Error('Unable to parse Chrome Web Store listing')
  }

  const ratingValue =
    extractMatch(/(\d+(?:\.\d+)?)\s*(?:out of 5|of 5)/i, bodyText) ?? '0'
  const reviewsValue =
    extractMatch(/([0-9][\d,]*)\s+(?:ratings?|reviews?)/i, bodyText) ?? '0'
  const usersValue = extractMatch(/([0-9][\d,]*)\s+users?/i, bodyText) ?? '0'
  const lastUpdated = parseLastUpdated(bodyText)

  return {
    extensionId,
    name,
    rating: ratingValue,
    reviews: reviewsValue,
    users: usersValue,
    icon,
    lastUpdated,
    sourceUrl,
    reviewsUrl,
    fetchedAt: new Date().toISOString(),
  }
}

function mapRow(row: ChromeExtensionStatsRow): ChromeExtensionStats {
  return {
    extensionId: row.extension_id,
    name: row.name,
    rating: row.rating,
    reviews: row.reviews,
    users: row.users,
    icon: row.icon,
    lastUpdated: row.last_updated ? row.last_updated.toISOString() : null,
    sourceUrl: getChromeWebStoreUrl(row.extension_id),
    reviewsUrl: getChromeWebStoreReviewsUrl(row.extension_id),
    fetchedAt: row.fetched_at.toISOString(),
  }
}

function parseRating(value: string | undefined) {
  if (!value) return 0
  const match = value.match(/([1-5](?:\.\d)?)/)
  return match ? Math.round(Number(match[1])) : 0
}

function cleanReviewText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function looksLikeChromeUiText(value: string) {
  return /ratings are updated daily|share|chrome web store|^\d+(?:\.\d+)?\s*\(\d+\s+ratings?\)/i.test(
    value,
  )
}

function parseChromeWebStoreReviews(html: string): ChromeExtensionReview[] {
  const $ = cheerio.load(html)
  const reviews: ChromeExtensionReview[] = []

  $('script[type="application/ld+json"]').each((index, script) => {
    try {
      const data = JSON.parse($(script).text())
      const rawReviews = Array.isArray(data.review) ? data.review : []

      rawReviews.forEach((review: any, reviewIndex: number) => {
        const comment = cleanReviewText(
          review.reviewBody || review.description || '',
        )
        if (!comment) return

        reviews.push({
          id: `jsonld-${index}-${reviewIndex}`,
          rating: parseRating(String(review.reviewRating?.ratingValue || '')),
          comment,
          author: cleanReviewText(
            review.author?.name || 'Chrome Web Store user',
          ),
          updatedAt: review.datePublished || review.dateModified,
        })
      })
    } catch {
      // Chrome Web Store markup is not stable; ignore malformed JSON-LD chunks.
    }
  })

  if (reviews.length > 0) return reviews

  $(
    '[aria-label*="star"], [aria-label*="Star"], [aria-label*="rating"], [aria-label*="Rating"]',
  ).each((index, node) => {
    const container = $(node).closest('div')
    const text = cleanReviewText(container.text())
    const rating = parseRating($(node).attr('aria-label'))

    if (
      rating === 0 ||
      text.length < 20 ||
      text.length > 1000 ||
      looksLikeChromeUiText(text)
    ) {
      return
    }
    if (reviews.some((review) => review.comment === text)) return

    reviews.push({
      id: `dom-${index}`,
      rating,
      comment: text,
      author: 'Chrome Web Store user',
    })
  })

  return reviews.slice(0, 6)
}

async function readCachedStats(extensionId: string) {
  await ensureStatsTable()
  const rows = await db.$queryRaw<ChromeExtensionStatsRow[]>(Prisma.sql`
    SELECT extension_id, name, rating, reviews, users, icon, last_updated, source_url, fetched_at
    FROM ${Prisma.raw(TABLE_NAME)}
    WHERE extension_id = ${extensionId}
    LIMIT 1
  `)

  return rows[0] ? mapRow(rows[0]) : null
}

async function writeCachedStats(stats: ChromeExtensionStats) {
  await ensureStatsTable()
  await db.$executeRaw(Prisma.sql`
    INSERT INTO ${Prisma.raw(TABLE_NAME)} (
      extension_id, name, rating, reviews, users, icon, last_updated, source_url, fetched_at, updated_at
    ) VALUES (
      ${stats.extensionId},
      ${stats.name},
      ${stats.rating},
      ${stats.reviews},
      ${stats.users},
      ${stats.icon},
      ${stats.lastUpdated ? new Date(stats.lastUpdated) : null},
      ${stats.sourceUrl},
      ${new Date(stats.fetchedAt)},
      NOW()
    )
    ON CONFLICT (extension_id) DO UPDATE SET
      name = EXCLUDED.name,
      rating = EXCLUDED.rating,
      reviews = EXCLUDED.reviews,
      users = EXCLUDED.users,
      icon = EXCLUDED.icon,
      last_updated = EXCLUDED.last_updated,
      source_url = EXCLUDED.source_url,
      fetched_at = EXCLUDED.fetched_at,
      updated_at = NOW()
  `)
}

export async function getChromeExtensionStats(
  extensionId = getDefaultChromeWebStoreExtensionId(),
  forceRefresh = false,
): Promise<ChromeExtensionStats> {
  const cached = await readCachedStats(extensionId)
  const isFresh =
    cached &&
    !forceRefresh &&
    Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS

  if (isFresh && cached) {
    return cached
  }

  try {
    const fresh = await scrapeChromeWebStore(extensionId)
    await writeCachedStats(fresh)
    return fresh
  } catch (error) {
    if (cached) {
      return cached
    }

    throw error
  }
}

export async function refreshChromeExtensionStats(
  extensionId = getDefaultChromeWebStoreExtensionId(),
) {
  return getChromeExtensionStats(extensionId, true)
}

export async function getChromeExtensionReviews(
  extensionId = getDefaultChromeWebStoreExtensionId(),
): Promise<ChromeExtensionReview[]> {
  const result = await getChromeExtensionReviewsResult(extensionId)
  return result.reviews
}

export async function getChromeExtensionReviewsResult(
  extensionId = getDefaultChromeWebStoreExtensionId(),
): Promise<ChromeExtensionReviewsResult> {
  const fallbackReviews = FALLBACK_REVIEWS_BY_EXTENSION_ID[extensionId] || []
  const reviewsUrl = getChromeWebStoreReviewsUrl(extensionId)

  try {
    const { data: html } = await axios.get<string>(reviewsUrl, {
      responseType: 'text',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    const reviews = parseChromeWebStoreReviews(html)
    return reviews.length > 0
      ? { reviews, source: 'chrome-web-store', reviewsUrl }
      : { reviews: fallbackReviews, source: 'fallback', reviewsUrl }
  } catch {
    return { reviews: fallbackReviews, source: 'fallback', reviewsUrl }
  }
}
