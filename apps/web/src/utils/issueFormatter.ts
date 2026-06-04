export function buildIssueBody({
  category,
  severity,
  email,
  description,
}: {
  category: string
  severity: string
  email?: string
  description: string
}) {
  return [
    '## Metadata',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Category | ${category} |`,
    `| Severity | ${severity} |`,
    `| Contact | ${email || 'Not Provided'} |`,
    '',
    '## Description',
    '',
    description,
  ].join('\n')
}
