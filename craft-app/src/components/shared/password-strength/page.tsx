import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PasswordStrength } from '@/components/ui/password-strength'

// the source types this by itself until you click in
const SAMPLE = 'Sunset2026!x'
// pass.js timings: first key, then one every 140ms; peek, hide, go again
const FIRST_KEY_MS = 300
const KEY_MS = 140
const REVEAL_MS = 500
const HIDE_MS = 2000
const AGAIN_MS = 3000

const DEFAULTS = {
  label: 'Create a password',
  hint: '8+ chars, a number, a symbol',
}

const COMPONENT_DEFAULTS = { label: 'Password', hint: '8+ chars, a number, a symbol' }

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'string', description: 'The password, when controlled.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: "''",
    description: 'The starting password, when uncontrolled.',
  },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called on every edit.' },
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether the password shows as text, when controlled. The eye toggles it.',
  },
  {
    name: 'defaultVisible',
    type: 'boolean',
    default: 'false',
    description: 'Whether it starts shown, when uncontrolled.',
  },
  {
    name: 'onVisibleChange',
    type: '(visible: boolean) => void',
    description: 'Called when the eye is pressed.',
  },
  { name: 'label', type: 'ReactNode', default: "'Password'", description: 'Label above the field.' },
  {
    name: 'hint',
    type: 'ReactNode',
    default: "'8+ chars, a number, a symbol'",
    description: 'The rules, shown under the bars. Change it if you change scorePassword.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the wrapper. Every other input prop (name, required, onFocus…) goes to the input. Import scorePassword to gate a submit button on the same 0–4 score.',
  },
]

export function PasswordStrengthPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, hint } = settings.values
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  // bumping this starts another round of typing
  const [round, setRound] = useState(0)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (touched) return
    const timers: number[] = []
    const at = (ms: number, run: () => void) => timers.push(window.setTimeout(run, ms))

    at(0, () => {
      setPassword('')
      setVisible(false)
    })
    for (let i = 1; i <= SAMPLE.length; i++) {
      at(FIRST_KEY_MS + (i - 1) * KEY_MS, () => setPassword(SAMPLE.slice(0, i)))
    }
    const typed = FIRST_KEY_MS + SAMPLE.length * KEY_MS
    at(typed + REVEAL_MS, () => setVisible(true))
    at(typed + HIDE_MS, () => setVisible(false))
    at(typed + AGAIN_MS, () => setRound((value) => value + 1))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [touched, round])

  const handleReplay = () => {
    setTouched(false)
    setRound((value) => value + 1)
  }

  const handleClear = () => {
    setTouched(true)
    setPassword('')
    setVisible(false)
  }

  const usage = toUsageSnippet({
    component: 'PasswordStrength',
    from: '@/components/ui/password-strength',
    props: {
      label,
      hint,
      value: { expression: 'password' },
      onValueChange: { expression: 'setPassword' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / password-strength"
      title="Password Strength"
      description="Four bars fill one after another as the password gets stronger, all walking from red through orange and yellow to green, and the strength word rises in with every new score. The eye draws a slash across itself while the password is hidden. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={40}
          />
          <DemoTextField
            label="Hint"
            value={hint}
            onValueChange={(next) => settings.set('hint', next)}
            maxLength={40}
          />
          <DemoAction onClick={handleReplay}>Type it for me</DemoAction>
          <DemoAction onClick={handleClear} disabled={password === ''}>
            Clear
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/password-strength/'], usage, props: PROPS }}
    >
      <PasswordStrength
        label={label}
        hint={hint}
        value={password}
        onValueChange={setPassword}
        visible={visible}
        onVisibleChange={(next) => {
          setTouched(true)
          setVisible(next)
        }}
        // clicking in hands the field over to you
        onFocus={() => setTouched(true)}
      />
    </DemoPage>
  )
}
