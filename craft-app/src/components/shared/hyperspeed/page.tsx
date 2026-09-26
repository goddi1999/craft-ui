import { useMemo, useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import {
  Hyperspeed,
  hyperspeedPresets,
  type HyperspeedOptions,
} from '@/components/ui/hyperspeed'

type PresetName = keyof typeof hyperspeedPresets

const PRESET_LABELS: Record<PresetName, string> = {
  one: 'Cyberpunk',
  two: 'Akira',
  three: 'Golden',
  four: 'Split',
  five: 'Sunset',
  six: 'Deep',
}

const PRESET_NAMES = Object.keys(hyperspeedPresets) as PresetName[]

export function HyperspeedPage() {
  const [preset, setPreset] = useState<PresetName>('one')
  const effectOptions = useMemo(
    () => hyperspeedPresets[preset] as Partial<HyperspeedOptions>,
    [preset],
  )

  const colors = effectOptions.colors

  return (
    <DemoPage
      eyebrow="ui / hyperspeed"
      title="Hyperspeed"
      description="A Three.js road tunnel with distortable geometry, streaking traffic lights, and bloom — steered entirely by the effectOptions object."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-20">
        <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border bg-black">
          <Hyperspeed
            key={preset}
            effectOptions={effectOptions}
            className="absolute inset-0"
          />
        </div>

        <DemoPanel className="mx-auto max-w-2xl">
          <DemoControlGroup
            title="Animation preset"
            options={PRESET_NAMES}
            value={preset}
            onChange={setPreset}
            format={(name) => PRESET_LABELS[name]}
          />

          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <p>
              <span className="font-medium text-foreground">distortion</span>
              {' · '}
              {String(effectOptions.distortion ?? '—')}
            </p>
            <p>
              <span className="font-medium text-foreground">lanes</span>
              {' · '}
              {effectOptions.lanesPerRoad ?? '—'}
            </p>
            <p>
              <span className="font-medium text-foreground">sticks</span>
              {' · '}
              {effectOptions.totalSideLightSticks ?? '—'}
            </p>
            <p>
              <span className="font-medium text-foreground">light pairs</span>
              {' · '}
              {effectOptions.lightPairsPerRoadWay ?? '—'}
            </p>
            <p>
              <span className="font-medium text-foreground">speed up</span>
              {' · '}
              {effectOptions.speedUp ?? '—'}×
            </p>
            <p>
              <span className="font-medium text-foreground">fov</span>
              {' · '}
              {effectOptions.fov ?? '—'} → {effectOptions.fovSpeedUp ?? '—'}
            </p>
          </div>

          {colors ? (
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                effectOptions.colors
              </p>
              <ul className="flex flex-wrap gap-3">
                {[
                  ['leftCars', colors.leftCars],
                  ['rightCars', colors.rightCars],
                  ['sticks', [colors.sticks]],
                ].map(([key, values]) => (
                  <li key={String(key)} className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {String(key)}
                    </span>
                    <span className="flex gap-1">
                      {(values as number[]).map((hex) => (
                        <span
                          key={hex}
                          className="size-5 rounded-full border border-white/20"
                          style={{
                            backgroundColor: `#${hex.toString(16).padStart(6, '0')}`,
                          }}
                          title={`#${hex.toString(16).padStart(6, '0')}`}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Pass a memoized{' '}
            <code className="rounded bg-muted px-1">effectOptions</code> object
            to tune distortion, density, and palette. Click and hold the scene
            to speed up.
          </p>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
