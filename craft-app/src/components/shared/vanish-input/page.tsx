import { useEffect, useRef, useState } from 'react'

import {
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { VanishInput } from '@/components/ui/vanish-input'

import { KeyEcho } from './KeyEcho'
import { keyLabel, type EchoKey } from './key-echo.utils'

// how long the keycap stays after the last press
const ECHO_MS = 900

const DEFAULTS = { placeholder: 'What do you need?', clearOnEscape: true, showKeys: true }
const COMPONENT_DEFAULTS = { placeholder: 'What do you need?', clearOnEscape: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'onSubmit',
    type: '(value: string) => void',
    description: 'Called with the text when Enter is pressed, just before it dissolves.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Called whenever the text changes, including when it is cleared.',
  },
  {
    name: 'clearOnEscape',
    type: 'boolean',
    default: 'true',
    description: 'Escape dissolves the text without submitting. An empty field lets Escape through.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'What do you need?'",
    description: 'Hidden while the text dissolves, then fades back.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Leading icon; a search glass by default, `null` for none.',
  },
  { name: 'defaultValue', type: 'string', description: 'Text to start with.' },
  { name: 'containerClassName', type: 'string', description: 'Merged onto the wrapping box.' },
  { name: 'className', type: 'string', description: 'Merged onto the input.' },
]

export function VanishInputPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { placeholder, clearOnEscape, showKeys } = settings.values
  const [pressed, setPressed] = useState<EchoKey | null>(null)
  const [sent, setSent] = useState(0)
  const [last, setLast] = useState('')
  const hide = useRef(0)

  useEffect(() => () => window.clearTimeout(hide.current), [])

  const usage = toUsageSnippet({
    component: 'VanishInput',
    from: '@/components/ui/vanish-input',
    props: { placeholder, clearOnEscape, onSubmit: { expression: '(text) => send(text)' } },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / vanish-input"
      title="Vanish Input"
      description="A command field that lets go of what you typed. Press Enter and the text breaks into grain from right to left while the caret is already back at the start; Escape does the same without sending. With reduced motion it simply fades."
      previewClassName="min-h-[320px]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Placeholder"
            value={placeholder}
            onValueChange={(next) => settings.set('placeholder', next)}
          />
          <DemoSwitch
            label="Escape clears"
            checked={clearOnEscape}
            onCheckedChange={(next) => settings.set('clearOnEscape', next)}
          />
          <DemoSwitch
            label="Show keys"
            checked={showKeys}
            onCheckedChange={(next) => settings.set('showKeys', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/vanish-input/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-8">
        <VanishInput
          aria-label="Command"
          placeholder={placeholder}
          clearOnEscape={clearOnEscape}
          defaultValue="biggie biggie biggie"
          onSubmit={(text) => {
            setSent((count) => count + 1)
            setLast(text)
          }}
          onKeyDown={(event) => {
            const label = showKeys ? keyLabel(event) : null
            if (!label) return
            setPressed({ id: performance.now(), label })
            window.clearTimeout(hide.current)
            hide.current = window.setTimeout(() => setPressed(null), ECHO_MS)
          }}
        />
        <KeyEcho pressed={pressed} />
        <p className="max-w-full truncate text-xs text-muted-foreground tabular-nums">
          {sent === 0 ? 'Press Enter to send' : `Sent ${sent} · “${last}”`}
        </p>
      </div>
    </DemoPage>
  )
}
