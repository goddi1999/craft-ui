import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

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
type Mode = 'auto' | 'dark' | 'light'

const LANGUAGES = Object.keys(SAMPLES) as Language[]
const ACCENTS = ['#3b82f6', '#ec4899', '#22c55e', '#f59e0b']
const MODES: Mode[] = ['auto', 'dark', 'light']

const DEFAULTS = {
  language: 'tsx' as Language,
  accent: '#3b82f6',
  mode: 'dark' as Mode,
  showFrame: true,
  showHeader: true,
  showLineNumbers: true,
  showCopyButton: true,
}

const PROPS: DemoPropDoc[] = [
  { name: 'code', type: 'string', description: 'The source code to render. Required.' },
  { name: 'language', type: 'string', default: "'tsx'", description: 'Prism language id, e.g. tsx, css, json, bash.' },
  { name: 'accent', type: 'string', default: "'#F75001'", description: 'Any hex colour. Background, border, gutter and every token colour are derived from it.' },
  { name: 'mode', type: "'auto' | 'dark' | 'light'", default: "'auto'", description: 'auto follows the page theme (class, data-theme or prefers-color-scheme); dark or light pins it.' },
  { name: 'filename', type: 'string', description: 'Shown in the header. Falls back to the language id.' },
  { name: 'showFrame', type: 'boolean', default: 'true', description: 'Background, border, rounded corners and header. Off renders just the code.' },
  { name: 'showHeader', type: 'boolean', default: 'true', description: 'The header bar. Ignored when the frame is off.' },
  { name: 'showLineNumbers', type: 'boolean', default: 'true', description: 'The line-number gutter.' },
  { name: 'showCopyButton', type: 'boolean', default: 'true', description: 'Copy-to-clipboard button; animates to a check, then back.' },
  { name: 'highlightLines', type: 'number[]', description: '1-based lines to wash with the accent.' },
  { name: '...props', type: "ComponentProps<'div'>", description: 'Forwarded to the root element, including className.' },
]

export function CodeBlockPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { language, accent, mode, showFrame, showHeader, showLineNumbers, showCopyButton } =
    settings.values
  const highlightLines = language === 'tsx' ? [2] : undefined

  const usage = toUsageSnippet({
    component: 'CodeBlock',
    from: '@/components/shared/code-block',
    props: {
      code: { expression: 'code' },
      language,
      accent,
      mode,
      filename: `example.${language}`,
      showFrame,
      showHeader,
      showLineNumbers,
      showCopyButton,
      highlightLines: highlightLines && { expression: '[2]' },
    },
    defaults: {
      language: 'tsx',
      accent: '#F75001',
      mode: 'auto',
      showFrame: true,
      showHeader: true,
      showLineNumbers: true,
      showCopyButton: true,
    },
  })

  return (
    <DemoPage
      eyebrow="shared / code-block"
      title="Code block"
      description="Prism highlighting with a whole theme derived from one accent colour, plus a copy button that animates between states."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup title="Language" options={LANGUAGES} value={language} onChange={(next) => settings.set('language', next)} />
          <DemoControlGroup title="Accent" options={ACCENTS} value={accent} onChange={(next) => settings.set('accent', next)} />
          <DemoControlGroup title="Mode" options={MODES} value={mode} onChange={(next) => settings.set('mode', next)} />
          <DemoSwitch label="Frame" checked={showFrame} onCheckedChange={(next) => settings.set('showFrame', next)} />
          <DemoSwitch label="Header" checked={showHeader} onCheckedChange={(next) => settings.set('showHeader', next)} />
          <DemoSwitch label="Line numbers" checked={showLineNumbers} onCheckedChange={(next) => settings.set('showLineNumbers', next)} />
          <DemoSwitch label="Copy button" checked={showCopyButton} onCheckedChange={(next) => settings.set('showCopyButton', next)} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/shared/code-block/'], usage, props: PROPS }}
    >
      <CodeBlock
        code={SAMPLES[language]}
        language={language}
        accent={accent}
        mode={mode}
        filename={`example.${language}`}
        showFrame={showFrame}
        showHeader={showHeader}
        showLineNumbers={showLineNumbers}
        showCopyButton={showCopyButton}
        highlightLines={highlightLines}
      />
    </DemoPage>
  )
}
