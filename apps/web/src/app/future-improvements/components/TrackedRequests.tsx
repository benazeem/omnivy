import Link from 'next/link'
import { Bug, ExternalLink } from 'lucide-react'
import { Card, Button } from '@omnivy/ui'
import { SectionHeading } from './SectionHeading'

type GitHubIssue = {
  number: number
  title: string
  html_url: string
  comments: number
  labels: Array<{ name: string }>
  updated_at: string
  created_at: string
}

async function fetchTrackedRequests(): Promise<GitHubIssue[]> {
  const repo = process.env.GITHUB_REPO || 'benazeem/obsidianplus'
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(
    `https://api.github.com/repos/${repo}/issues?state=open&sort=updated&direction=desc&per_page=20`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) return []

  const issues = (await response.json()) as Array<GitHubIssue & { pull_request?: unknown }>
  const trackedLabels = ['bug', 'enhancement', 'feature', 'request']

  return issues
    .filter((issue) => !issue.pull_request)
    .sort((left, right) => {
      const leftScore = left.labels.some((label) => trackedLabels.includes(label.name.toLowerCase())) ? 0 : 1
      const rightScore = right.labels.some((label) => trackedLabels.includes(label.name.toLowerCase())) ? 0 : 1
      return leftScore - rightScore || new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
    })
    .slice(0, 5)
}

export async function TrackedRequests() {
  const currentRequests = await fetchTrackedRequests()

  return (
    <Card id="current-requests" className="glass-panel p-8 rounded-[28px] border border-brand-500/15 bg-brand-500/5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeading
          icon={<Bug className="w-5 h-5" />}
          title="Current requests and bug reports"
          description="These are the live open requests and bug reports from GitHub. Check here before opening a new request."
        />
        <Button asChild variant="outline" className="rounded-xl font-bold shrink-0">
          <Link href="/request">
            Submit a request
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-4">
        {currentRequests.length > 0 ? (
          currentRequests.map((issue) => (
            <a
              key={issue.number}
              href={issue.html_url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-[var(--bg-main)]/85 border border-[var(--border-dim)] hover:border-brand-500/30 transition-all text-left"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-600 border border-brand-500/20">
                  #{issue.number}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-secondary">
                  {issue.comments} comments
                </span>
              </div>
              <h3 className="font-bold text-base leading-snug mb-2">
                {issue.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {issue.labels.slice(0, 3).map((label) => (
                  <span
                    key={label.name}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[var(--border-dim)] bg-[var(--bg-muted)] text-secondary"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </a>
          ))
        ) : (
          <div className="p-5 rounded-2xl bg-[var(--bg-main)]/85 border border-[var(--border-dim)] text-sm text-secondary">
            No open bug reports or feature requests are currently listed on GitHub.
          </div>
        )}
      </div>
      <div className="mt-8 p-5 rounded-2xl border border-[var(--border-dim)] bg-white/40 dark:bg-white/5">
        <p className="text-sm text-secondary">
          If you still need to file something new, start from the request page and include enough detail for us to match it against the roadmap first.
        </p>
      </div>
    </Card>
  )
}
