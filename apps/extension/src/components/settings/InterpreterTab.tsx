import { Cpu } from 'lucide-react'
import { Input } from '@omnivy/ui'
import { setInterpreter } from '@/features/interpreterSlice'
import type { AppDispatch } from '@/store'
import type { InterpreterState } from '@/features/interpreterSlice'

interface InterpreterTabProps {
  interpreter: InterpreterState
  dispatch: AppDispatch
}
 
{/* TODO: Add different interpreter options below with the corresponding API configurations in Next version */}

const InterpreterTab = ({ interpreter, dispatch }: InterpreterTabProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <header>
        <h2 className="text-5xl font-display font-black mb-3 tracking-tighter">
          AI Interpreter
        </h2>
        <p className="text-[var(--text-muted)] text-xl">
          Power your clips with LLM intelligence.
        </p>
      </header>
      <section className="glass-panel p-10 space-y-10">
        <div className="flex items-center justify-between pb-8 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-600 rounded-3xl shadow-xl shadow-brand-600/20">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black font-display tracking-tight uppercase">
                Enable AI Extraction
              </h3>
              <p className="text-[var(--text-muted)]">
                Automatically summarize or tag articles on clip.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              OFF
            </span>
            <Input
              type="checkbox"
              checked={interpreter.enabled}
              onChange={(e) =>
                dispatch(setInterpreter({ enabled: e.target.checked }))
              }
              className="w-10 h-6 accent-brand-600 cursor-pointer"
            />
            <span className="text-xs font-black uppercase tracking-widest text-brand-600">
              ON
            </span>
          </div>
        </div>

        {interpreter.enabled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">
                Model Configuration
              </label>
              <div className="space-y-4">
                <select
                  title="Select LLM Provider"
                  value={interpreter.provider}
                  onChange={(e) =>
                    dispatch(
                      setInterpreter({
                        provider: e.target.value as InterpreterState['provider'],
                      }),
                    )
                  }
                  className="w-full bg-[var(--bg-muted)] border border-[var(--border-dim)] rounded-2xl px-6 py-4 text-sm font-bold"
                >
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="local">Local Ollama</option>
                </select>
                <Input
                  type="password"
                  value={interpreter.apiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setInterpreter({ apiKey: e.target.value }))
                  }
                  placeholder="Enter API Secret Key..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600">
                Custom Prompt
              </label>
              <textarea
                value={interpreter.prompt}
                onChange={(e) =>
                  dispatch(setInterpreter({ prompt: e.target.value }))
                }
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-dim)] rounded-2xl px-6 py-5 text-sm font-medium min-h-[160px] focus:ring-2 ring-brand-500/20 transition-all outline-none leading-relaxed"
                placeholder="Example: Summarize this article into 5 key takeaways in Markdown list format."
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default InterpreterTab
