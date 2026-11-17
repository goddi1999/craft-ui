import { AnimatePresence } from 'motion/react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FINDLIGHT_GLYPH, GlyphWrite } from '@/components/ui/glyph-write'

type Variant = 'tile' | 'plain'

const VARIANTS: Variant[] = ['tile', 'plain']
const VARIANT_LABELS: Record<Variant, string> = {
  tile: 'App icon',
  plain: 'Glyph only',
}

const DEFAULTS = {
  variant: 'tile' as Variant,
  durationScale: 1,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'glyph',
    type: 'GlyphDefinition',
    description:
      'Filled outline plus centre-line strokes in stroke order. FINDLIGHT_GLYPH ships as a preset.',
  },
  {
    name: 'variant',
    type: "'plain' | 'tile'",
    default: "'plain'",
    description:
      'tile draws the rounded app-icon tile first, then writes the glyph knocked out of it.',
  },
  {
    name: 'durationScale',
    type: 'number',
    default: '1',
    description: 'Scales every duration and delay. Below 1 is faster.',
  },
  {
    name: 'onAnimationComplete',
    type: '() => void',
    description: 'Called when the last stroke finishes writing.',
  },
  {
    name: 'className',
    type: 'string',
    default: "'h-32'",
    description: 'Sizes the svg; plain glyphs follow currentColor.',
  },
]

export function GlyphWritePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, durationScale } = settings.values
  const [replayKey, setReplayKey] = useState(0)

  const usage = toUsageSnippet({
    component: 'GlyphWrite',
    from: '@/components/ui/glyph-write',
    imports: ['FINDLIGHT_GLYPH'],
    props: {
      glyph: { expression: 'FINDLIGHT_GLYPH' },
      variant,
      durationScale,
    },
    defaults: { variant: 'plain', durationScale: 1 },
  })

  return (
    <DemoPage
      eyebrow="ui / glyph-write"
      title="Glyph Write"
      description="A filled logo glyph written stroke by stroke, like Apple's Hello screen. Centre-line strokes draw into a mask, so the finished mark is the exact traced shape."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
            format={(option) => VARIANT_LABELS[option]}
          />
          <DemoSlider
            label="Duration scale"
            value={durationScale}
            onValueChange={(next) => settings.set('durationScale', next)}
            min={0.4}
            max={2}
            step={0.1}
            unit="x"
          />
          <DemoAction onClick={() => setReplayKey((key) => key + 1)}>
            Replay
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/glyph-write/'],
        usage,
        props: PROPS,
      }}
    >
      {/* Remount on replay or setting change so the strokes write from zero. */}
      <AnimatePresence mode="wait">
        <GlyphWrite
          key={`${replayKey}-${variant}-${durationScale}`}
          glyph={FINDLIGHT_GLYPH}
          variant={variant}
          durationScale={durationScale}
          className="h-40 text-foreground sm:h-56"
        />
      </AnimatePresence>
    </DemoPage>
  )
}
