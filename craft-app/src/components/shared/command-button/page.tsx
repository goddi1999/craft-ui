import { useEffect, useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CommandButton } from '@/components/ui/command-button'

const SHORTCUTS = ['mod+k', 'mod+shift+p', '/'] as const
// a scripted press opens without focus, so it folds back by itself
const AUTO_CLOSE_MS = 2000
// how the scripted press plays: modifiers one by one, then the key, then let go
const KEY_GAP_MS = 140
const HOLD_MS = 220

const MODIFIER_KEYS: Record<string, { key: string; flag: keyof KeyFlags }> = {
  mod: { key: 'Meta', flag: 'metaKey' },
  ctrl: { key: 'Control', flag: 'ctrlKey' },
  alt: { key: 'Alt', flag: 'altKey' },
  shift: { key: 'Shift', flag: 'shiftKey' },
}

type KeyFlags = { metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }

const DEFAULTS = {
  shortcut: 'mod+k' as (typeof SHORTCUTS)[number],
  width: 300,
  bounce: 30,
}

const COMPONENT_DEFAULTS = { shortcut: 'mod+k', width: 300, bounce: 30, placeholder: 'Search' }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', default: "'Search'", description: "The button's label." },
  {
    name: 'shortcut',
    type: 'string',
    default: "'mod+k'",
    description: '+-joined: mod (⌘ on Mac, Ctrl elsewhere), ctrl, alt, shift, then one key. Works anywhere on the page.',
  },
  { name: 'placeholder', type: 'string', default: "'Search'", description: "Also the field's accessible name." },
  { name: 'onSearch', type: '(query: string) => void', description: 'Enter in the open field, with the trimmed text.' },
  { name: 'open', type: 'boolean', description: 'Whether the field is open. Pass it with onOpenChange to control it.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Starting state when uncontrolled.' },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Opens on click or the shortcut; closes on Esc, a click outside, or leaving the field empty.',
  },
  { name: 'width', type: 'number', default: '300', description: 'Width of the open field, in px.' },
  { name: 'bounce', type: 'number', default: '30', description: 'How springy the open is, 0 to 100.' },
  { name: 'autoClose', type: 'number', description: 'Fold back by itself after this many ms with nothing typed (demos).' },
  { name: 'className', type: 'string', description: 'Merged onto the pill.' },
]

/** Presses the shortcut with synthetic key events, so the keycaps light up on their own. */
function scheduleShortcut(shortcut: string, later: (ms: number, step: () => void) => void) {
  const parts = shortcut.split('+')
  const key = parts[parts.length - 1]
  const modifiers = parts.slice(0, -1)
  const flags: KeyFlags = { metaKey: false, ctrlKey: false, altKey: false, shiftKey: false }
  const fire = (type: 'keydown' | 'keyup', name: string, code: string) => {
    const init = { key: name, code, bubbles: true, ...flags }
    window.dispatchEvent(new KeyboardEvent(type, init))
  }

  modifiers.forEach((modifier, i) =>
    later(i * KEY_GAP_MS, () => {
      const { key: name, flag } = MODIFIER_KEYS[modifier]
      flags[flag] = true
      // mod is ⌘ on a Mac and Ctrl elsewhere, so hold both
      if (modifier === 'mod') flags.ctrlKey = true
      fire('keydown', name, name)
    }),
  )
  const keyAt = modifiers.length * KEY_GAP_MS
  const code = /^[a-z]$/.test(key) ? `Key${key.toUpperCase()}` : 'Slash'
  later(keyAt, () => fire('keydown', key, code))
  later(keyAt + HOLD_MS, () => fire('keyup', key, code))
  later(keyAt + HOLD_MS + KEY_GAP_MS, () => {
    Object.assign(flags, { metaKey: false, ctrlKey: false, altKey: false, shiftKey: false })
    modifiers.forEach((modifier) => fire('keyup', MODIFIER_KEYS[modifier].key, MODIFIER_KEYS[modifier].key))
  })
}

export function CommandButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { shortcut, width, bounce } = settings.values
  const [playing, setPlaying] = useState(false)
  const [searched, setSearched] = useState<string | null>(null)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const later = (ms: number, step: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      step()
    }, ms)
    timers.current.add(timer)
  }

  const handlePlay = () => {
    setPlaying(true)
    scheduleShortcut(shortcut, later)
  }

  const usage = toUsageSnippet({
    component: 'CommandButton',
    from: '@/components/ui/command-button',
    props: {
      shortcut,
      placeholder: 'Search tools…',
      width,
      bounce,
      onSearch: { expression: 'runSearch' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / command-button"
      title="Command Button"
      description="A quiet button that carries its own keyboard shortcut. Click it or press the keys anywhere on the page and the pill stretches open into a search field, each keycap lighting as it goes down. Esc, a click outside or leaving it empty folds it back. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Shortcut"
            options={SHORTCUTS}
            value={shortcut}
            onChange={(next) => settings.set('shortcut', next)}
          />
          <DemoSlider
            label="Open width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={220}
            max={420}
            step={10}
            unit="px"
          />
          <DemoSlider
            label="Bounce"
            value={bounce}
            onValueChange={(next) => settings.set('bounce', next)}
            min={0}
            max={100}
          />
          <DemoAction onClick={handlePlay}>
            Press the shortcut
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/command-button/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-6">
        <CommandButton
          shortcut={shortcut}
          placeholder="Search tools…"
          width={width}
          bounce={bounce}
          autoClose={playing ? AUTO_CLOSE_MS : undefined}
          onOpenChange={(open) => {
            if (!open) setPlaying(false)
          }}
          onSearch={setSearched}
        />
        <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
          {searched === null ? 'Press the shortcut, or click it.' : `Searching tools for “${searched}”`}
        </p>
      </div>
    </DemoPage>
  )
}
