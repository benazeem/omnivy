import type { PageProperties } from '@/types/popup'

export function isUnsupportedPageUrl(url?: string): boolean {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return [
      'chrome:',
      'chrome-extension:',
      'edge:',
      'about:',
      'devtools:',
      'view-source:',
      'moz-extension:',
    ].includes(parsed.protocol)
  } catch {
    return true
  }
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[:*?"<>|\\/]/g, '')
    .replace(/[^a-zA-Z0-9\-_. ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeYamlKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-_. ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function escapeYamlValue(value: string): string {
  return value.replace(/"/g, '\\"').replace(/\n/g, ' ')
}

export function createPropertyId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function buildCustomPropertiesFrontmatter(
  customProperties: PageProperties['customProperties'],
): string {
  const entries = customProperties.filter(
    (property) => property.label.trim() || property.value.trim(),
  )
  if (entries.length === 0) return ''

  const lines = ['---', 'custom_properties:']
  for (const property of entries) {
    const key = sanitizeYamlKey(property.label) || 'custom_property'
    lines.push(
      `  "${escapeYamlValue(key)}": "${escapeYamlValue(property.value)}"`,
    )
  }
  lines.push('---', '')
  return `${lines.join('\n')}\n`
}
