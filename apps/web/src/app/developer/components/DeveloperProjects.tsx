import { ArrowUpRight } from 'lucide-react'
import { featuredProjects, techStack } from '@/constants/developer'

export function DeveloperProjects() {
  return (
    <div className="space-y-6">
      <section className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h2 className="text-2xl font-display font-extrabold tracking-tight mb-4">
          Featured Projects
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {featuredProjects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-brand-500 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {project.name}
                    <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-brand-500 transition-colors" />
                  </h3>
                  <p className="text-sm text-secondary mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h2 className="text-2xl font-display font-extrabold tracking-tight mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-[var(--border-color)] text-secondary"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
