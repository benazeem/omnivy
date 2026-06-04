import { faqItems } from '@/constants/home'

export function FAQSection() {
  return (
    <section className="py-24 px-6 border-t border-slate-200/50 dark:border-white/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-black uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Answers for searchers and users.
          </h2>
          <p className="text-lg text-secondary">
            Short answers to the questions people usually ask before installing Omnivy.
          </p>
        </div>

        <div className="grid gap-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-[28px] border border-white/8 bg-[var(--bg-main)]/70 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 open:bg-[var(--bg-main)]/90 open:border-brand-500/20"
            >
              <summary className="cursor-pointer list-none font-bold text-lg flex items-center justify-between gap-4 text-[var(--text-primary)]">
                <span>{item.question}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-dim)] bg-white/40 text-brand-500 transition-all duration-300 group-open:rotate-45 group-open:border-brand-500/20 group-open:bg-brand-500/10">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm text-secondary leading-relaxed max-w-3xl pl-px">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
