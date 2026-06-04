'use client'

import { motion } from 'motion/react'
import { Cloud, Database, Eye, Lock, Mail, Shield } from 'lucide-react'

const privacyPolicyData = {
  effectiveDate: 'August 1, 2025',
  intro: 'Omnivy Web Clipper is committed to protecting your privacy. This policy explains how your data is handled when using the extension and our website services.',
  sections: [
    {
      id: 'collection',
      title: '1. What Data We Collect',
      icon: <Database className="w-5 h-5" />,
      items: [
        {
          label: 'Identity',
          text: 'If you connect a cloud provider (e.g., Google Drive), we request your email and profile image for authentication purposes only.',
        },
        {
          label: 'Clipped Content',
          text: 'All content you clip is stored locally on your device or in your connected cloud storage. We do not store any content on our servers.',
        },
        {
          label: 'Settings',
          text: "Your vault name, user preferences, and configurations are stored locally using Chrome's storage APIs.",
        },
      ],
    },
    {
      id: 'dont-do',
      title: "2. What We Don't Do",
      icon: <Eye className="w-5 h-5" />,
      items: [
        { text: 'We do not collect, track, or sell your personal data.' },
        { text: 'We do not use analytics or third-party trackers.' },
        { text: 'We do not store or transmit any clipped content to external servers.' },
      ],
    },
    {
      id: 'permissions',
      title: '3. Permissions Explanation',
      icon: <Lock className="w-5 h-5" />,
      items: [
        { label: 'activeTab, scripting, tabs', text: 'Enables capturing content from your current browser tab.' },
        { label: 'contextMenus', text: 'Adds right-click clip options on pages.' },
        { label: 'storage', text: 'Saves user preferences like vault paths, templates, etc.' },
        { label: 'identity, identity.email', text: 'Used for optional authentication when integrating cloud sync.' },
      ],
    },
    {
      id: 'cloud',
      title: '4. Cloud Access',
      icon: <Cloud className="w-5 h-5" />,
      description: 'When you choose to link a cloud provider, Omnivy uses secure OAuth to connect. All access is limited to your own files and can be revoked at any time from your provider\'s dashboard.',
    },
    {
      id: 'contact',
      title: '5. Contact Support',
      icon: <Mail className="w-5 h-5" />,
      description: 'If you have any questions or concerns regarding this privacy policy, please contact us at:',
      contact: 'azeemkhandsari@gmail.com',
    },
  ],
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-10 pb-24 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-brand-500/10 rounded-[24px] text-brand-600">
              <Shield className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm">
            Effective Date: <span className="font-bold text-[var(--text-primary)]">{privacyPolicyData.effectiveDate}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 sticky top-28 hidden lg:block"
          >
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Document Index
              </h3>
              <nav className="flex flex-col space-y-2">
                {privacyPolicyData.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-xs font-bold text-secondary hover:text-brand-500 transition-colors flex items-center gap-2 py-1.5 border-l-2 border-transparent hover:border-brand-500 pl-3"
                  >
                    {section.title.split('. ')[1] || section.title}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="glass-panel p-8 md:p-12 space-y-12">
              <p className="text-lg text-secondary leading-relaxed border-b border-slate-200 dark:border-white/5 pb-8">
                {privacyPolicyData.intro}
              </p>

              <div className="space-y-12">
                {privacyPolicyData.sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 space-y-4 border-b border-slate-200 dark:border-white/5 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-500/10 rounded-xl text-brand-600">
                        {section.icon}
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                    </div>

                    {section.items ? (
                      <ul className="space-y-3.5 pl-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3.5 text-secondary text-sm leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                            <div>
                              {'label' in item && (
                                <strong className="text-[var(--text-primary)] mr-1">
                                  {item.label}:
                                </strong>
                              )}
                              {item.text}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-secondary leading-relaxed pl-2">
                        {section.description}
                        {section.contact && (
                          <a
                            href={`mailto:${section.contact}`}
                            className="ml-1 font-bold text-brand-600 hover:underline"
                          >
                            {section.contact}
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
