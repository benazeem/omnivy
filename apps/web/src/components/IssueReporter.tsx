'use client'

import { useState } from 'react'
import { Bug, Star, X } from 'lucide-react'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Textarea } from '@omnivy/ui'

type IssueReporterProps = {
  mode?: 'button' | 'inline'
  defaultType?: 'bug' | 'feature'
}

export default function IssueReporter({ mode = 'button', defaultType = 'bug' }: IssueReporterProps) {
  const [open, setOpen] = useState(mode === 'inline')
  const [type, setType] = useState<'bug' | 'feature'>(defaultType)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async () => {
    if (!title.trim()) return setMessage('Please enter a title')
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/github/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[${type === 'bug' ? 'Bug' : 'Feature'}] ${title}`,
          body,
          labels: [type === 'bug' ? 'bug' : 'enhancement'],
        }),
      })

      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        setMessage('Issue created — thanks!')
        setTitle('')
        setBody('')
        setOpen(false)
      } else {
        setMessage(data?.error || (await res.text()) || 'Failed to create issue')
      }
    } catch (e: any) {
      setMessage(e.message || 'Failed to create issue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {mode === 'button' && (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          title="Report an issue"
        >
          {type === 'bug' ? <Bug className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </Button>
      )}

      {open && (
        <div className={mode === 'button' ? 'fixed inset-0 z-60 flex items-center justify-center' : 'w-full'}>
          {mode === 'button' && <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />}
          <Card className={`relative ${mode === 'button' ? 'w-full max-w-md' : ''} bg-white dark:bg-slate-900 rounded-lg p-0 shadow-lg`}>
            <CardHeader className="flex-row items-center justify-between mb-0 px-4 pt-4 pb-0">
              <CardTitle className="text-sm font-bold">Report an issue</CardTitle>
              {mode === 'button' && (
                <Button onClick={() => setOpen(false)} variant="ghost" size="icon" aria-label="Close">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-3 px-4 pb-0">
              <div className="flex gap-2">
                <Button
                onClick={() => setType('bug')}
                variant={type === 'bug' ? 'secondary' : 'ghost'}
                className={type === 'bug' ? 'bg-red-500/10 border border-red-500/20' : ''}
              >
                Bug
                </Button>
                <Button
                onClick={() => setType('feature')}
                variant={type === 'feature' ? 'secondary' : 'ghost'}
                className={type === 'feature' ? 'bg-emerald-500/10 border border-emerald-500/20' : ''}
              >
                Feature
                </Button>
              </div>

              <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short title"
              />
              <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the issue (steps to reproduce, expected behavior, screenshots, etc.)"
              className="min-h-28"
              />

              {message && <div className="text-xs text-secondary">{message}</div>}
            </CardContent>

            <CardFooter className="flex items-center justify-end gap-2 px-4 pb-4 pt-4">
              {mode === 'inline' ? (
                <Button onClick={() => { setTitle(''); setBody(''); setMessage(null); setType(defaultType); }} variant="outline" size="sm">
                  Reset
                </Button>
              ) : (
                <Button onClick={() => setOpen(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              )}
              <Button onClick={submit} disabled={loading} size="sm" className="bg-brand-600 text-white hover:bg-brand-700">
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
