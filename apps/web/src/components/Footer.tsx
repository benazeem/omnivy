import { Github, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@omnivy/ui'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/50 border-t border-slate-200 dark:border-[var(--border-dim)] pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-1.5 bg-brand-600 rounded-lg">
                <img src="/icon.ico" className="w-6 h-6 invert" alt="Omnivy" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Omnivy
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Capture clean Markdown from the browser and save it to Obsidian,
              Notion, Google Drive, OneDrive, or Dropbox.
            </p>
            <div className="flex gap-4">
              <Button asChild size="icon" variant="ghost" className="p-2 rounded-lg">
                <a
                  href="https://github.com/benazeem/omnivy"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open GitHub repository"
                  aria-label="Open GitHub repository"
                >
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="p-2 rounded-lg">
                <a
                  href="https://x.com/devazeem"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open X profile"
                  aria-label="Open X profile"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="p-2 rounded-lg">
                <a
                  href="mailto:azeemkhandsari@gmail.com"
                  title="Send email"
                  aria-label="Send email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 tracking-tight uppercase text-xs text-brand-600 dark:text-brand-400">
              Product
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  href="/install"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Install Extension
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/future-improvements"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Future Improvements
                </Link>
              </li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 tracking-tight uppercase text-xs text-brand-600 dark:text-brand-400">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/robots.txt"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Robots.txt
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Sitemap.xml
                </Link>
              </li>
              <li>
                <Link
                  href="/llms.txt"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  LLMs.txt
                </Link>
              </li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-bold mb-6 tracking-tight uppercase text-xs text-brand-600 dark:text-brand-400">
              Developer
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  href="/developer"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  About Developer
                </Link>
              </li>
              <li>
                <Link
                  href="/request"
                  className="text-secondary hover:text-brand-500 transition-colors"
                >
                  Request Features &amp; Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-[var(--border-dim)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary">&copy; {currentYear} Omnivy</p>
          <div className="flex gap-6 text-xs font-medium text-secondary">
            <Link href="/privacy-policy" className="hover:text-brand-500">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-brand-500">
              Terms
            </Link>
            <span>Open Source (MIT)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
