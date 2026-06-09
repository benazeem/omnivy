import { resumeTracks } from '@/constants/developer'

export function DeveloperTracks() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
      {resumeTracks.map((track) => {
        const Icon = track.icon
        return (
          <article
            key={track.title}
            className="p-5 sm:p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-brand-500/30 transition-colors min-h-[280px] sm:min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl xl:text-xl 2xl:text-2xl font-bold mb-2 leading-tight">
              {track.title}
            </h2>
            <p className="text-sm sm:text-base xl:text-sm 2xl:text-base text-secondary leading-relaxed mb-4">
              {track.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {track.highlights.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--bg-primary)] border border-[var(--border-color)] text-secondary leading-tight"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        )
      })}
    </section>
  )
}
