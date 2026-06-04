'use client'

import { motion } from 'motion/react'
import {
  AlertTriangle,
  FileText,
  Mail,
  RefreshCw,
  Scale,
  Shield,
  Users,
  AlertOctagon,
} from 'lucide-react'

const termsData = {
  title: 'Terms of Service',
  effectiveDate: 'August 1, 2025',
  intro: 'These Terms of Service ("Terms") govern your use of the Omnivy Web Clipper browser extension and associated services ("Service"). By using the Service, you agree to these Terms.',
  sections: [
    {
      id: 'use-of-service',
      title: '1. Use of Service',
      icon: <Users className="w-5 h-5" />,
      content: 'Omnivy Web Clipper allows you to capture and save content from the web to your local Obsidian vault or linked cloud storage. You are responsible for using the Service in compliance with all applicable laws and regulations.',
    },
    {
      id: 'user-data',
      title: '2. User Data',
      icon: <Shield className="w-5 h-5" />,
      content: 'We do not collect or store personal data unless you explicitly authorize cloud storage integration (e.g., Google Drive). Even in such cases, data is accessed securely via OAuth and not retained by us.',
    },
    {
      id: 'user-responsibilities',
      title: '3. User Responsibilities',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        'You agree not to misuse the extension or interfere with its functionality.',
        'You are responsible for securing your vault and any sensitive information stored within it.',
        'You must not use the extension to store or distribute illegal or harmful content.',
      ],
    },
    {
      id: 'intellectual-property',
      title: '4. Intellectual Property',
      icon: <Scale className="w-5 h-5" />,
      content: 'The Omnivy Web Clipper, its name, logo, and source code (excluding Obsidian itself or third-party integrations) are the intellectual property of the developer. All rights reserved.',
    },
    {
      id: 'modifications',
      title: '5. Modifications and Updates',
      icon: <RefreshCw className="w-5 h-5" />,
      content: 'We may update these Terms from time to time. Continued use of the extension after changes are made constitutes your acceptance of the revised Terms.',
    },
    {
      id: 'disclaimer',
      title: '6. Disclaimer of Warranty',
      variant: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: 'The Service is provided "as is" without warranty of any kind. We do not guarantee the accuracy, reliability, or availability of the Service. Use at your own risk.',
    },
    {
      id: 'limitation',
      title: '7. Limitation of Liability',
      variant: 'danger',
      icon: <AlertOctagon className="w-5 h-5" />,
      content: 'In no event shall the developer be liable for any direct, indirect, incidental, or consequential damages arising from the use of the Service.',
    },
    {
      id: 'contact',
      title: '8. Contact Information',
      icon: <Mail className="w-5 h-5" />,
      content: 'If you have any questions or concerns about these Terms, please contact us at:',
      email: 'azeemkhandsari@gmail.com',
    },
  ],
}

export default function TermsOfService() {
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
              <FileText className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            {termsData.title}
          </h1>
          <p className="text-secondary text-sm">
            Effective Date: <span className="font-bold text-[var(--text-primary)]">{termsData.effectiveDate}</span>
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
                {termsData.sections.map((section) => (
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
                {termsData.intro}
              </p>

              <div className="space-y-12">
                {termsData.sections.map((section) => {
                  const isWarning = section.variant === 'warning'
                  const isDanger = section.variant === 'danger'

                  return (
                    <div
                      key={section.id}
                      id={section.id}
                      className={`scroll-mt-28 space-y-4 border-b border-slate-200 dark:border-white/5 pb-8 last:border-0 last:pb-0 ${
                        isWarning
                          ? 'rounded-3xl p-6 bg-yellow-500/5 border border-yellow-500/20 text-yellow-800 dark:text-yellow-200 my-4'
                          : isDanger
                          ? 'rounded-3xl p-6 bg-red-500/5 border border-red-500/20 text-red-800 dark:text-red-200 my-4'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {!isWarning && !isDanger && (
                          <div className="p-2 bg-brand-500/10 rounded-xl text-brand-600">
                            {section.icon}
                          </div>
                        )}
                        {isWarning && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        {isDanger && <AlertOctagon className="w-5 h-5 text-red-500" />}
                        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                          {section.title}
                        </h2>
                      </div>

                      {Array.isArray(section.content) ? (
                        <ul className="space-y-3.5 pl-2">
                          {section.content.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3.5 text-secondary text-sm leading-relaxed">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                              <div>{point}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-secondary leading-relaxed pl-2">
                          {section.content}
                          {section.email && (
                            <a
                              href={`mailto:${section.email}`}
                              className="ml-1 font-bold text-brand-600 hover:underline"
                            >
                              {section.email}
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
