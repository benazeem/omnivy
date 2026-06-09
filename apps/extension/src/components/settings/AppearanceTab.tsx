import {
  Palette,
  Type,
  Sparkles,
  LayoutGrid,
  Zap,
  Eye,
  CheckCircle2,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import {
  setTheme,
  setFontSize,
  setAccentColor,
  setFontFamily,
  setUIDensity,
} from '@/features/uiSlice'
import { setRootTheme } from '@/features/thunks/setRootTheme'
import type {
  Theme,
  FontSize,
  AccentColor,
  FontFamily,
  UIDensity,
} from '@/types'
import { Button } from '@omnivy/ui'
import type { AppDispatch } from '@/store'
import {
  accentColors,
  densityOptions,
  fontFamilyOptions,
  fontSizeOptions, 
} from '@/constants/appearance'

interface AppearanceTabProps {
  uiState: {
    theme: Theme
    fontSize: FontSize
    accentColor: AccentColor
    fontFamily: FontFamily
    uiDensity: UIDensity
    reduceMotion: boolean
    glassmorphism: boolean
    smoothScrolling: boolean
  }
  dispatch: AppDispatch
}

const themeOptions: { value: Theme; label: string; icon: React.ReactNode; desc: string; preview: { bg: string; fg: string; border: string } }[] = [

  { value: 'light', label: 'Light', icon: <Sun size={20} />, desc: 'Clean & bright', preview: { bg: '#ffffff', fg: '#0f172a', border: '#e2e8f0' } },
  { value: 'dark', label: 'Dark', icon: <Moon size={20} />, desc: 'Easy on eyes', preview: { bg: '#0f172a', fg: '#f8fafc', border: '#334155' } },
  { value: 'system', label: 'System', icon: <Monitor size={20} />, desc: 'Match OS', preview: { bg: 'linear-gradient(135deg, #ffffff 50%, #0f172a 50%)', fg: '#64748b', border: '#94a3b8' } },
  { value: 'amoled', label: 'AMOLED', icon: <Moon size={20} className="fill-current text-black" />, desc: 'Pure black', preview: { bg: '#000000', fg: '#ffffff', border: '#262626' } },
]

const AppearanceTab = ({ uiState, dispatch }: AppearanceTabProps) => {
  const handleThemeChange = (newTheme: Theme) => {
    dispatch(setTheme(newTheme))
    dispatch(setRootTheme(newTheme))
  }

  return (
    <div className="w-full space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
      <header>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-2 sm:mb-3 tracking-tight">
          Appearance
        </h2>
        <p className="max-w-3xl text-[var(--text-muted)] text-base sm:text-lg lg:text-xl">
          Personalize your workspace with themes, typography, and layout
          options.
        </p>
      </header>

      <section className="glass-panel p-5 sm:p-6 lg:p-8 xl:p-10 space-y-7 lg:space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-pink-500/10 rounded-2xl">
            <Palette className="w-6 h-6 text-pink-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
            Colors & Theme
          </h3>
        </div>

        <div className="space-y-8 lg:space-y-10">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 sm:mb-6 block">
              Interface Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 xl:gap-6">
              {themeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => handleThemeChange(opt.value)}
                  className={`relative h-auto w-full min-w-0 flex flex-col items-stretch justify-start p-4 sm:p-5 rounded-3xl text-left transition-all duration-300 border-2 group overflow-hidden ${
                    uiState.theme === opt.value
                      ? 'border-brand-600 shadow-2xl shadow-brand-600/20 bg-brand-600/5'
                      : 'border-[var(--border-dim)] bg-[var(--bg-muted)]/30 hover:border-brand-500/40 hover:bg-[var(--bg-muted)]/50'
                  }`}
                >
                  <div
                    className="w-full h-16 sm:h-20 rounded-2xl mb-4 border border-black/5 flex flex-col p-3 gap-2"
                    style={{ background: opt.preview.bg }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            uiState.theme === opt.value
                              ? 'var(--accent)'
                              : opt.preview.border,
                        }}
                      />
                      <div
                        className="w-10 h-1.5 rounded-full"
                        style={{ backgroundColor: opt.preview.border }}
                      />
                    </div>
                    <div
                      className="w-full h-1 rounded-full opacity-20"
                      style={{ backgroundColor: opt.preview.fg }}
                    />
                    <div
                      className="w-2/3 h-1 rounded-full opacity-10"
                      style={{ backgroundColor: opt.preview.fg }}
                    />
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="min-w-0 flex flex-col">
                      <p className="font-black text-sm uppercase tracking-wider leading-tight break-words">
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                    {uiState.theme === opt.value && (
                      <CheckCircle2 size={16} className="text-brand-600" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 sm:mb-6 block">
              Accent Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-5">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  onClick={() => dispatch(setAccentColor(color.value))}
                  className={`aspect-square w-full max-w-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                    uiState.accentColor === color.value
                      ? 'ring-4 ring-brand-500/30 scale-110 shadow-xl'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: color.color }}
                >
                  {uiState.accentColor === color.value && (
                    <Sparkles size={20} className="text-white" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-5 sm:p-6 lg:p-8 xl:p-10 space-y-7 lg:space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-2xl">
            <Type className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
            Typography
          </h3>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 xl:gap-12">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 sm:mb-6 block">
              Base Font Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 sm:gap-4">
              {fontSizeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => dispatch(setFontSize(opt.value))}
                  className={`h-auto w-full flex flex-col items-center gap-3 p-4 sm:p-5 lg:p-6 rounded-3xl transition-all duration-300 border-2 ${
                    uiState.fontSize === opt.value
                      ? 'border-brand-600 bg-brand-600/10 shadow-lg'
                      : 'border-[var(--border-dim)] bg-[var(--bg-muted)]/30 hover:border-brand-500/40'
                  }`}
                >
                  <span
                    className={`font-display font-black ${uiState.fontSize === opt.value ? 'text-brand-600' : 'text-[var(--text-main)]'}`}
                    style={{ fontSize: opt.size }}
                  >
                    Aa
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    {opt.label}
                  </p>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 sm:mb-6 block">
              Font Family
            </label>
            <div className="grid grid-cols-1 gap-3">
              {fontFamilyOptions.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => dispatch(setFontFamily(opt.value))}
                  className={`h-auto w-full min-w-0 flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 border-2 ${
                    uiState.fontFamily === opt.value
                      ? 'border-brand-600 bg-brand-600/10 shadow-lg'
                      : 'border-[var(--border-dim)] bg-[var(--bg-muted)]/30 hover:border-brand-500/40'
                  }`}
                >
                  <div className="min-w-0 flex flex-col items-start">
                    <span className={`text-sm font-black ${opt.class} truncate max-w-full`}>
                      {opt.label}
                    </span>
                    <span
                      className={`text-[10px] text-[var(--text-muted)] ${opt.class} truncate max-w-full`}
                    >
                      The quick brown fox jumps...
                    </span>
                  </div>
                  {uiState.fontFamily === opt.value && (
                    <CheckCircle2 size={16} className="text-brand-600" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-5 sm:p-6 lg:p-8 xl:p-10 space-y-7 lg:space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
            <LayoutGrid className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
            Layout & Density
          </h3>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 sm:mb-6 block">
            Interface Spacing
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 xl:gap-6">
            {densityOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() => dispatch(setUIDensity(opt.value))}
                className={`h-auto w-full min-w-0 flex flex-col items-start justify-start p-5 lg:p-6 rounded-3xl transition-all duration-300 border-2 text-left ${
                  uiState.uiDensity === opt.value
                    ? 'border-brand-600 bg-brand-600/10 shadow-lg'
                    : 'border-[var(--border-dim)] bg-[var(--bg-muted)]/30 hover:border-brand-500/40'
                }`}
              >
                <p className="font-black text-sm uppercase tracking-wider mb-2 leading-tight break-words">
                  {opt.label}
                </p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {opt.desc}
                </p>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel p-5 sm:p-6 lg:p-8 xl:p-10 space-y-7 lg:space-y-8 bg-brand-600/5 border-brand-600/20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-brand-600/10 rounded-2xl">
            <Eye className="w-6 h-6 text-brand-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
            Live Showcase
          </h3>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">
              Interactive Components
            </p>
            <div className="space-y-4">
              <div className="glass-panel p-4 sm:p-5 flex items-center justify-between gap-4 group cursor-pointer hover:border-brand-500 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Sample Item</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Hover to see effect
                    </p>
                  </div>
                </div>
                <Button className="bg-brand-600 text-white p-2 rounded-lg shadow-lg shadow-brand-600/20">
                  <Zap size={14} />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-[var(--bg-muted)] border border-[var(--border-dim)] p-3 rounded-xl text-xs font-black uppercase tracking-wider hover:border-brand-500 transition-all">
                  Secondary
                </Button>
                <Button className="flex-1 bg-brand-600 text-white p-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-600/20 hover:brightness-110 transition-all">
                  Primary Action
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">
              Content Rendering
            </p>
            <div className="p-6 rounded-3xl border border-[var(--border-dim)] bg-[var(--bg-popover)] space-y-3 shadow-sm">
              <h4 className="text-lg font-black tracking-tight">
                The Perfect Capture
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                This is how your clipped notes will appear in the vault. Your
                selected typography and density settings are applied here in
                real-time.
              </p>
              <div className="flex gap-2 pt-2">
                <span className="px-2 py-1 bg-brand-600/10 text-brand-600 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                  #obsidian
                </span>
                <span className="px-2 py-1 bg-brand-600/10 text-brand-600 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                  #web-clip
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AppearanceTab
