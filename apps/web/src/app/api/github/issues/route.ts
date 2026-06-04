import { NextResponse } from 'next/server'

type RequestBody = {
  title?: string
  body?: string
  labels?: string[]
}

export async function POST(req: Request) {
  try {
    const token = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO || 'benazeem/obsidianplus'

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'GITHUB_TOKEN is not configured' },
        { status: 500 },
      )
    }

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      return NextResponse.json(
        { success: false, error: 'GITHUB_REPO must be in owner/repo format' },
        { status: 500 },
      )
    }

    const json = (await req.json()) as RequestBody
    const title = json.title?.trim()

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 },
      )
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          title,
          body: json.body?.trim() || '',
          labels: Array.isArray(json.labels) ? json.labels : [],
        }),
      },
    )

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || 'GitHub API error',
          meta: data,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, issue: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}