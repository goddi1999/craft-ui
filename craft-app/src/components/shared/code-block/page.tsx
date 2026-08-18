import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

import { CodeBlock } from './CodeBlock'

const SAMPLES = {
  tsx: `export function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState(start)

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Clicked {count} times
    </button>
  )
}`,
  css: `@layer components {
  .card {
    display: grid;
    gap: 1rem;
    border-radius: 12px;
    background: light-dark(#fff, #111);
  }
}`,
  bash: `npm install
npm run dev -- --port 5173`,
} as const

type Language = keyof typeof SAMPLES

const LANGUAGES = Object.keys(SAMPLES) as Language[]
const ACCENTS = ['#3b82f6', '#ec4899', '#22c55e', '#f59e0b']
const MODES = ['auto', 'dark', 'light'] as const

export function CodeBlockPage() {
  const [language, setLanguage] = useState<Language>('tsx')
  const [accent, setAccent] = useState('#3b82f6')
  const [mode, setMode] = useState<(typeof MODES)[number]>('dark')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [showFrame, setShowFrame] = useState(true)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / code-block
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Code block
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Prism highlighting with a whole theme derived from one accent
            colour, plus a copy button that animates between states.
          </p>
        </header>

        <section className="flex flex-col gap-8">
          <CodeBlock
            code={SAMPLES[language]}
            language={language}
            accent={accent}
            mode={mode}
            filename={`example.${language}`}
            showFrame={showFrame}
            showLineNumbers={showLineNumbers}
            highlightLines={language === 'tsx' ? [2] : undefined}
          />

          <div className="flex justify-center">
            <DemoPanel>
              <DemoControlGroup
                title="language"
                options={LANGUAGES}
                value={language}
                onChange={setLanguage}
              />
              <DemoControlGroup
                title="accent"
                options={ACCENTS}
                value={accent}
                onChange={setAccent}
              />
              <DemoControlGroup
                title="mode"
                options={MODES}
                value={mode}
                onChange={setMode}
              />
              <DemoToggleRow>
                <DemoToggle
                  label="frame"
                  pressed={showFrame}
                  onPressedChange={setShowFrame}
                />
                <DemoToggle
                  label="line numbers"
                  pressed={showLineNumbers}
                  onPressedChange={setShowLineNumbers}
                />
              </DemoToggleRow>
            </DemoPanel>
          </div>
        </section>
      </div>
    </div>
  )
}
