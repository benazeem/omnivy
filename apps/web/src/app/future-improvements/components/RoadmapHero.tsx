import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@omnivy/ui'

export function RoadmapHero() {
  return (
    <section className="text-center space-y-5">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        Roadmap & future improvements
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
        What is coming next for Omnivy
      </h1>
      <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
        This page is the first stop for upcoming integrations, product refinements, and known requests. Check it before using the request form so duplicate reports stay low.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-xl font-bold">
          <Link href="/request">
            Submit a request
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl font-bold">
          <a href="#current-requests">
            Skip to tracked requests
          </a>
        </Button>
      </div>
    </section>
  )
}
