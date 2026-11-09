import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { GsapInfiniteLoop } from '@/components/ui/gsap-infinite-loop'

const PRESETS = {
  original: [
    'Infinite',
    'loops',
    'without',
    'repeating',
    'or',
    'shuffling',
    'elements',
    'using',
    'GSAP',
    '🤙',
  ],
  craft: ['Craft', 'UI', 'with', 'reusable', 'primitives', '✨'],
  seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
} as const

type PresetName = keyof typeof PRESETS

const PRESET_LABELS: Record<PresetName, string> = {
  original: 'Original',
  craft: 'Craft',
  seasons: 'Seasons',
}

export function GsapInfiniteLoopPage() {
  const [preset, setPreset] = useState<PresetName>('original')

  return (
    <DemoPage
      eyebrow="ui / gsap-infinite-loop"
      title="GSAP Infinite Loops Without DOM Shuffle"
      description="A vertical word carousel driven by overlapping GSAP timelines — no DOM cloning or element shuffling."
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-4 pb-20">
        <GsapInfiniteLoop
          key={preset}
          items={[...PRESETS[preset]]}
          className="w-full justify-center"
        />

        <DemoPanel>
          <DemoControlGroup
            title="Word set"
            options={Object.keys(PRESETS) as PresetName[]}
            value={preset}
            onChange={setPreset}
            format={(name) => PRESET_LABELS[name]}
          />
          <p className="text-sm text-muted-foreground">
            Pass an{' '}
            <code className="rounded bg-muted px-1">items</code> array. The
            scrubber advances one slot at a time with an elastic ease; the same
            list nodes are reused three times in the master timeline.
          </p>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
