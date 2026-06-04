'use client'

import React from 'react'
import * as Icons from 'lucide-react'
import { motion } from 'motion/react'
import { FeatureCardProps } from '../types'

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  index,
}) => {
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1)
  const IconComponent = (Icons as any)[iconName] || Icons.Circle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-8 rounded-3xl bg-secondary border border-transparent hover:border-brand-500/30 transition-all duration-300"
    >
      <div className="mb-6 inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-6 h-6" />
      </div>
      <h4 className="text-xl font-bold mb-4 tracking-tight group-hover:text-brand-500 transition-colors">
        {title}
      </h4>
      <ul className="space-y-3">
        {description.map((desc, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-secondary leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500/50 flex-shrink-0" />
            {desc}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default FeatureCard
