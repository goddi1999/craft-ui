import { useTheme } from 'next-themes'
import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ThemeSwitch3D } from '@/components/ui/3d-theme-switch'

const DEFAULTS = {
  perspective: 4,
  distance: 0.75,
  duration: 1.2,
  invert: true,
  driveApp: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  perspective: 4,
  distance: 0.75,
  duration: 1.2,
  invert: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'checked',
    type: 'boolean',
    description: 'Controlled state — true shows the dark face.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    default: 'false',
    description: 'Initial state when uncontrolled.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    description: 'Called with the next state inside the view transition — wire it to your theme provider.',
  },
  {
    name: 'perspective',
    type: 'number',
    default: '4',
    description: 'Perspective depth as a multiple of the face width.',
  },
  {
    name: 'distance',
    type: 'number',
    default: '0.75',
    description: 'How far the face is pushed back mid-turn, as a fraction of the perspective.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.2',
    description: 'Length of the turn in seconds.',
  },
  {
    name: 'invert',
    type: 'boolean',
    default: 'true',
    description: 'Show the opposite sky behind the turning face (night behind light).',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Dark mode'",
    description: 'Accessible name of the switch.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Content shown on the face, beside the switch.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root (sky) element.',
  },
]

export function ThemeSwitch3DPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [localDark, setLocalDark] = useState(false)
  const settings = useDemoSettings(DEFAULTS)
  const { perspective, distance, duration, invert, driveApp } = settings.values

  const checked = driveApp ? resolvedTheme === 'dark' : localDark

  const handleCheckedChange = (next: boolean) => {
    if (driveApp) {
      setTheme(next ? 'dark' : 'light')
      return
    }
    setLocalDark(next)
  }

  const usage = toUsageSnippet({
    component: 'ThemeSwitch3D',
    from: '@/components/ui/3d-theme-switch',
    props: { perspective, distance, duration, invert },
    defaults: COMPONENT_DEFAULTS,
    children: `<p>switchin' themes in 3d</p>`,
  })

  return (
    <DemoPage
      eyebrow="ui / 3d-theme-switch"
      title="Switchin' Themes in 3D"
      description="A theme switch whose surface turns like a cube face — a View Transition chains perspective() into the old and new snapshots."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Perspective (× width)"
            value={perspective}
            onValueChange={(value) => settings.set('perspective', value)}
            min={1}
            max={8}
            step={0.5}
          />
          <DemoSlider
            label="Distance"
            value={distance}
            onValueChange={(value) => settings.set('distance', value)}
            min={0.25}
            max={3}
            step={0.25}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={0.4}
            max={3}
            step={0.2}
            unit="s"
          />
          <DemoSwitch
            label="Invert sky"
            checked={invert}
            onCheckedChange={(value) => settings.set('invert', value)}
          />
          <DemoSwitch
            label="Drive app theme"
            checked={driveApp}
            onCheckedChange={(value) => settings.set('driveApp', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/3d-theme-switch/'],
        usage,
        props: PROPS,
      }}
    >
      <ThemeSwitch3D
        checked={checked}
        onCheckedChange={handleCheckedChange}
        perspective={perspective}
        distance={distance}
        duration={duration}
        invert={invert}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="flex min-h-64 flex-col justify-end">
          <p className="text-4xl leading-[0.85] font-semibold tracking-tight sm:text-6xl">
            switchin&rsquo;
            <br />
            themes in 3d
          </p>
          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed opacity-75">
            Making use of View Transitions and CSS{' '}
            <code className="text-[light-dark(hsl(45_70%_40%),hsl(45_100%_75%))]">
              perspective()
            </code>
            . The trick: apply a chained transform to both{' '}
            <code>::view-transition-new</code> and{' '}
            <code>::view-transition-old</code> with{' '}
            <code>perspective()</code> as the base.
          </p>
        </div>
      </ThemeSwitch3D>
    </DemoPage>
  )
}
