'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Send } from 'lucide-react'
import { Button, Input, Textarea } from '@omnivy/ui'
import { FeatureCategoryField } from './FeatureCategoryField'
import { SeverityField } from './SeverityField'
import { useFeedbackForm } from '@/hooks/useFeedbackForm'
import type { FeedbackType } from '@/types/request'

interface Props {
  type: FeedbackType
  onSuccess: () => void
}

export function RequestForm({ type, onSuccess }: Props) {
  const { formData, updateField, resetForm } = useFeedbackForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const title = formData.title.trim()
    const description = formData.description.trim()
    if (!title || !description) return

    setIsSubmitting(true)
    const labels = type === 'bug' ? ['bug'] : ['enhancement']
    const bodyLines = [
      `**Category:** ${formData.category}`,
      `**Severity:** ${formData.severity}`,
      formData.email ? `**Contact:** ${formData.email}` : '',
      '---',
      description,
    ].filter(Boolean)

    try {
      const res = await fetch('/api/github/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[${type === 'bug' ? 'Bug' : 'Feature'}] ${title}`,
          body: bodyLines.join('\n\n'),
          labels,
        }),
      })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await res.json()
        : null
      if (res.ok && data?.success) {
        resetForm()
        onSuccess()
      } else {
        console.error('Failed to create issue', data || (await res.text()))
      }
    } catch (err) {
      console.error('Error submitting request', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      key="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 px-8 py-8"
    >
      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-secondary">
          {type === 'feature' ? 'Feature Title' : 'Bug Summary'}
        </label>
        <Input
          type="text"
          required
          placeholder={
            type === 'feature'
              ? 'e.g., Notion Board View Sync'
              : 'e.g., Image clipping failing on Medium.com'
          }
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="border-[var(--border-color)] dark:border-[var(--border-dim)] dark:bg-white/5 focus:border-brand-500/50 focus:ring-0 rounded-xl"
        />
      </div>

      {/* Category or Severity */}
      {type === 'feature' ? (
        <FeatureCategoryField
          value={formData.category}
          onChange={(v) => updateField('category', v)}
        />
      ) : (
        <SeverityField
          value={formData.severity}
          onChange={(v) => updateField('severity', v)}
        />
      )}

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-secondary">
          {type === 'feature' ? 'Describe the Feature' : 'Steps to Reproduce'}
        </label>
        <Textarea
          required
          rows={4}
          placeholder={
            type === 'feature'
              ? 'Describe how this feature would work and why it would be helpful...'
              : '1. Go to page X\n2. Click the extension\n3. Notice the following error...'
          }
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="border-[var(--border-color)] dark:border-[var(--border-dim)] dark:bg-white/5 focus:border-brand-500/50 focus:ring-0 rounded-xl resize-none"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-secondary">
          Email Address{' '}
          <span className="normal-case font-normal">(Optional)</span>
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="border-[var(--border-color)] dark:border-[var(--border-dim)] dark:bg-white/5 focus:border-brand-500/50 focus:ring-0 rounded-xl"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="default"
        className="w-full justify-center gap-2 py-4 rounded-xl font-bold shadow-lg shadow-brand-600/10"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit {type === 'feature' ? 'Feature Request' : 'Bug Report'}
          </>
        )}
      </Button>
    </motion.form>
  )
}
