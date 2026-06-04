import { Sparkles, Github, Mail, ExternalLink } from 'lucide-react'

export function DeveloperHero() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        Developer Profile
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight">
          Mohd Azeem Malik
        </h1>
        <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
          Full-Stack Developer building ecommerce systems, SaaS applications,
          and browser-based productivity tools with React, TypeScript, and
          Node.js.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/benazeem"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors"
        >
          <Github className="w-4 h-4" />
          GitHub Profile
        </a>
        <a
          href="mailto:azeemkhandsari@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[var(--border-color)] font-bold hover:border-brand-500 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact
        </a>
        <a
          href="https://www.linkedin.com/in/devazeem/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[var(--border-color)] font-bold hover:border-brand-500 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          LinkedIn
        </a>
      </div>
    </div>
  )
}
