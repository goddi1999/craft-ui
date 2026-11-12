import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  formatShortcut,
  matchesShortcut,
  ShortcutList,
  ShortcutRecorder,
  usePlatform,
  type Platform,
  type ShortcutBinding,
  type ShortcutListGroup,
} from '@/components/ui/shortcut-recorder'

type ActionId = 'search' | 'sidebar' | 'capture'
type Shortcuts = Record<ActionId, string | null>

const ACTIONS: { id: ActionId; label: string; reset: string | null; description?: string }[] = [
  { id: 'search', label: 'Open search', reset: 'mod+k' },
  { id: 'sidebar', label: 'Toggle sidebar', reset: 'mod+\\' },
  {
    id: 'capture',
    label: 'Quick capture',
    reset: null,
    description: 'Saves a note to your inbox from anywhere in the app.',
  },
]

const START: Shortcuts = { search: 'mod+k', sidebar: 'mod+\\', capture: null }

// shortcuts the rest of the app already owns, so recording one of them asks first
const APP_BINDINGS: ShortcutBinding[] = [
  { shortcut: 'mod+s', label: 'Save' },
  { shortcut: 'mod+p', label: 'Print' },
  { shortcut: 'mod+b', label: 'Bold' },
  { shortcut: 'mod+i', label: 'Italic' },
  { shortcut: 'mod+shift+z', label: 'Redo' },
]

const STATIC_GROUPS: ShortcutListGroup[] = [
  {
    label: 'Editing',
    items: [
      { label: 'Bold', shortcut: 'mod+b' },
      { label: 'Italic', shortcut: 'mod+i' },
      { label: 'Undo', shortcut: 'mod+z' },
      { label: 'Redo', shortcut: 'mod+shift+z' },
    ],
  },
  {
    label: 'File',
    items: [
      { label: 'Save', shortcut: 'mod+s' },
      { label: 'Print', shortcut: 'mod+p' },
      { label: 'Close tab', shortcut: 'mod+w', keywords: 'quit exit' },
    ],
  },
]

const PLATFORMS = ['auto', 'mac', 'other'] as const
const PLATFORM_NAMES: Record<(typeof PLATFORMS)[number], string> = {
  auto: 'Auto',
  mac: 'macOS',
  other: 'Windows',
}

const DEFAULTS = {
  platform: 'auto' as (typeof PLATFORMS)[number],
  requireModifier: true,
  warnReserved: true,
  cheatsheet: true,
}

const COMPONENT_DEFAULTS = { requireModifier: true, warnReserved: true }

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', description: 'Name of the action the shortcut runs.' },
  {
    name: 'value',
    type: 'string | null',
    description: 'The shortcut when controlled, such as `mod+shift+k`. `mod` is ⌘ on a Mac and Ctrl elsewhere.',
  },
  {
    name: 'defaultValue',
    type: 'string | null',
    default: 'null',
    description: 'The starting shortcut when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value, { replaced? }) => void',
    description:
      'Called with the new shortcut, or `null` when cleared. `replaced` is the binding it was taken from after "Use anyway".',
  },
  {
    name: 'resetValue',
    type: 'string | null',
    description: 'What the reset button restores. Falls back to `defaultValue`.',
  },
  {
    name: 'bindings',
    type: 'ShortcutBinding[]',
    default: '[]',
    description: '`{ shortcut, label }` already in use. Recording one asks before taking it.',
  },
  {
    name: 'warnReserved',
    type: 'boolean',
    default: 'true',
    description: 'Also warn about combinations the browser keeps, such as ⌘W and ⌘C.',
  },
  {
    name: 'requireModifier',
    type: 'boolean',
    default: 'true',
    description: 'Require ⌘, Ctrl or ⌥. Function keys are always allowed.',
  },
  {
    name: 'platform',
    type: "'mac' | 'other'",
    description: 'Overrides the detected platform for the caps.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Record shortcut'",
    description: 'Shown while no shortcut is set.',
  },
  { name: 'description', type: 'string', description: 'A hint under the field.' },
  { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the field and stops recording.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function ShortcutRecorderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { platform: platformSetting, requireModifier, warnReserved, cheatsheet } = settings.values
  const override: Platform | undefined = platformSetting === 'auto' ? undefined : platformSetting
  const platform = usePlatform(override)
  const [shortcuts, setShortcuts] = useState<Shortcuts>(START)
  const [lastRun, setLastRun] = useState<string | null>(null)

  // the recorded shortcuts really run, so the demo shows `matchesShortcut` at work
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const action = ACTIONS.find(({ id }) => {
        const shortcut = shortcuts[id]
        return shortcut ? matchesShortcut(event, shortcut, platform) : false
      })
      if (!action) return
      event.preventDefault()
      setLastRun(`${action.label} · ${formatShortcut(shortcuts[action.id] ?? '', platform).text}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [platform, shortcuts])

  const bindingsFor = (id: ActionId): ShortcutBinding[] => [
    ...ACTIONS.flatMap((action) => {
      const shortcut = shortcuts[action.id]
      return action.id !== id && shortcut ? [{ shortcut, label: action.label }] : []
    }),
    ...APP_BINDINGS,
  ]

  const change = (id: ActionId, next: string | null, replaced?: ShortcutBinding) =>
    setShortcuts((current) => {
      const updated = { ...current, [id]: next }
      // "use anyway" moves the shortcut, so the action it came from is left unbound
      const source = ACTIONS.find((action) => action.id !== id && action.label === replaced?.label)
      if (source) updated[source.id] = null
      return updated
    })

  const groups: ShortcutListGroup[] = [
    {
      label: 'Navigation',
      items: ACTIONS.flatMap((action) => {
        const shortcut = shortcuts[action.id]
        return shortcut ? [{ label: action.label, shortcut }] : []
      }),
    },
    ...STATIC_GROUPS,
  ]

  const usage = toUsageSnippet({
    component: 'ShortcutRecorder',
    from: '@/components/ui/shortcut-recorder',
    props: {
      label: 'Open search',
      value: { expression: 'shortcut' },
      onValueChange: { expression: 'setShortcut' },
      resetValue: 'mod+k',
      bindings: { expression: "[{ shortcut: 'mod+p', label: 'Print' }]" },
      requireModifier,
      warnReserved,
      platform: override,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / shortcut-recorder"
      title="Shortcut Recorder"
      description="A field that records a key combination. Held modifiers light up as key caps while you build the chord, the finished shortcut settles in, and a combination another action or the browser already owns asks before it is taken. Escape cancels, Backspace clears, and the caps follow the platform. Comes with key caps and a searchable cheatsheet that lights up as you hold keys. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Platform"
            options={PLATFORMS}
            value={platformSetting}
            onChange={(next) => settings.set('platform', next)}
            format={(value) => PLATFORM_NAMES[value]}
          />
          <DemoSwitch
            label="Require a modifier"
            checked={requireModifier}
            onCheckedChange={(next) => settings.set('requireModifier', next)}
          />
          <DemoSwitch
            label="Warn about browser shortcuts"
            checked={warnReserved}
            onCheckedChange={(next) => settings.set('warnReserved', next)}
          />
          <DemoSwitch
            label="Cheatsheet"
            checked={cheatsheet}
            onCheckedChange={(next) => settings.set('cheatsheet', next)}
          />
          <DemoAction
            onClick={() => {
              setShortcuts(START)
              setLastRun(null)
            }}
          >
            Reset shortcuts
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/shortcut-recorder/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="grid gap-5">
          {ACTIONS.map((action) => (
            <ShortcutRecorder
              key={action.id}
              label={action.label}
              value={shortcuts[action.id]}
              onValueChange={(next, { replaced }) => change(action.id, next, replaced)}
              resetValue={action.reset}
              bindings={bindingsFor(action.id)}
              requireModifier={requireModifier}
              warnReserved={warnReserved}
              platform={override}
              description={action.description}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {lastRun ? `Ran ${lastRun}` : 'Press a recorded shortcut to run it.'}
        </p>
        {cheatsheet ? <ShortcutList groups={groups} platform={override} /> : null}
      </div>
    </DemoPage>
  )
}
