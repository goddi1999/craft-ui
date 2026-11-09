import { useTheme } from 'next-themes'
import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { ThemeSwitch3D } from '@/components/ui/3d-theme-switch'

const PERSPECTIVES = [1, 2, 4, 8] as const
const DISTANCES = [0.25, 0.75, 1.5, 3] as const
const DURATIONS = [0.6, 1.2, 2.4] as const

export function ThemeSwitch3DPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [localDark, setLocalDark] = useState(false)
  const [driveApp, setDriveApp] = useState(false)
  const [perspective, setPerspective] = useState<number>(4)
  const [distance, setDistance] = useState<number>(0.75)
  const [duration, setDuration] = useState<number>(1.2)
  const [invert, setInvert] = useState(true)

  const checked = driveApp ? resolvedTheme === 'dark' : localDark

  const handleCheckedChange = (next: boolean) => {
    if (driveApp) {
      setTheme(next ? 'dark' : 'light')
      return
    }
    setLocalDark(next)
  }

  return (
    <DemoPage
      eyebrow="ui / 3d-theme-switch"
      title="Switchin' Themes in 3D"
      description="A theme switch whose surface turns like a cube face — a View Transition chains perspective() into the old and new snapshots."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10">
        <ThemeSwitch3D
          checked={checked}
          onCheckedChange={handleCheckedChange}
          perspective={perspective}
          distance={distance}
          duration={duration}
          invert={invert}
          className="w-full"
        >
          <div className="flex min-h-64 flex-col justify-end">
            <p className="text-5xl leading-[0.85] font-semibold tracking-tight sm:text-6xl">
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

        <DemoPanel>
          <DemoControlGroup
            title="Perspective (× width)"
            options={PERSPECTIVES}
            value={perspective}
            onChange={setPerspective}
          />
          <DemoControlGroup
            title="Distance"
            options={DISTANCES}
            value={distance}
            onChange={setDistance}
          />
          <DemoControlGroup
            title="Duration"
            options={DURATIONS}
            value={duration}
            onChange={setDuration}
            format={(value) => `${value}s`}
          />
          <DemoToggleRow>
            <DemoToggle
              label="Invert sky"
              pressed={invert}
              onPressedChange={setInvert}
            />
            <DemoToggle
              label="Drive app theme"
              pressed={driveApp}
              onPressedChange={setDriveApp}
            />
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
