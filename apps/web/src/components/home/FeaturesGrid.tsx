import FeatureCard from '../FeatureCard'
import { Features } from '@/constants/home'

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6 border-t border-slate-200/50 dark:border-white/5">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Powerful Features,{' '}
            <span className="gradient-text">Zero Friction.</span>
          </h2>
          <p className="text-lg text-secondary">
            Everything you need to capture knowledge from the web, built with
            privacy and speed as first-class principles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
