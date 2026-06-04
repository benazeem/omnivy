import { articleSchema, destinationPlatforms, extractionTypes } from '@/constants/documentation'
import { Book, Code, Terminal, Zap, CheckCircle2 } from 'lucide-react'


export default function DocumentationPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[var(--bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-4">
            <Book className="w-3 h-3" />
            Documentation v2.0
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg text-secondary">
            How the extension captures pages, turns them into Markdown, and
            routes clips into your local vault or connected cloud workspace.
          </p>
        </div>

        <div className="space-y-12"> 
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <Zap className="w-5 h-5 text-brand-500" />
              Getting Started
            </h2>
            <div className="prose dark:prose-invert max-w-none text-secondary">
              <p>
                Omnivy is a browser-first knowledge capture tool. The extension
                reads the active page, extracts structured Markdown, lets you
                edit save fields in the popup, and then routes the clip to the
                destination you choose.
              </p>
              
              <h3 className="text-lg font-bold text-[var(--text-main)] mt-6 mb-3">1. Installation</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Go to the <a href="/install" className="text-brand-500 hover:underline">Install Page</a> and click "Add to Chrome".</li>
                <li>Pin the extension to your browser toolbar.</li>
                <li>Open the extension options to add your local Obsidian vault name and adjust capture behavior.</li>
              </ul>

              <h3 className="text-lg font-bold text-[var(--text-main)] mt-6 mb-3">2. Cloud Setup (Optional)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Local Obsidian clipping works without a web account.</li>
                <li>To save to Notion, Google Drive, OneDrive, or Dropbox, sign in on the <a href="/auth/signin" className="text-brand-500 hover:underline">sign-in page</a>.</li>
                <li>Use <strong>Settings → Integrations</strong> to connect providers and let the extension load available folders or Notion destinations.</li>
              </ul>

              <h3 className="text-lg font-bold text-[var(--text-main)] mt-6 mb-3">3. Clip From the Popup</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click the extension on a supported page. Chrome system pages, extension pages, devtools pages, and similar restricted pages cannot be clipped.</li>
                <li>Review or edit title, source, author, tags, and custom properties before saving.</li>
                <li>Pick Obsidian, Notion, Google Drive, OneDrive, or Dropbox as the target. Background auto-save can close the popup after saving when enabled in behavior settings.</li>
              </ul>
            </div>
          </section>
 
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <Terminal className="w-5 h-5 text-brand-500" />
              Intelligent Content Extraction
            </h2>
            <div className="prose dark:prose-invert max-w-none text-secondary">
              <p>
                When you clip a webpage, Omnivy runs a knowledge extraction
                pipeline. It detects the site, chooses a matching parser when
                one exists, falls back to a generic article/doc extractor, and
                sends clean Markdown plus title, author, tags, source, and
                useful links back to the popup.
              </p>
              
              <ul className="list-disc pl-5 mt-4 space-y-2">
                {extractionTypes.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}:</strong> {item.desc}
                  </li>
                ))}
              </ul>
              
              <div className="bg-[var(--bg-muted)] border border-[var(--border-color)] rounded-xl p-4 my-6 font-mono text-sm">
                1. Detect page type and supported site<br/>
                2. Extract structured content or use a generic fallback<br/>
                3. Build Markdown with source metadata and useful links<br/>
                4. Let you edit fields and custom properties in the popup<br/>
                5. Save to Obsidian locally or sync through a connected provider
              </div>
            </div>
          </section>
 
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <Code className="w-5 h-5 text-brand-500" />
              Supported Platforms
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {destinationPlatforms.map((platform) => (
                <div key={platform.name} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)]/50">
                  <div className="font-bold text-[var(--text-main)] flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {platform.name}
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    {platform.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
