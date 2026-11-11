import { useEffect, useRef, useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  ContextWindowMeter,
  type ContextSegment,
  type ContextWindowVariant,
} from '@/components/ui/context-window-meter'

const VARIANTS: ContextWindowVariant[] = ['card', 'inline']
const LIMIT = 200_000
const COMPACTED = 58_000
const COMPACT_MS = 1500

// Everything except the conversation stays put; the slider moves the rest.
const FILES = 23_500
const TOOLS = 11_840
const SYSTEM = 3_210
const FIXED = FILES + TOOLS + SYSTEM

const DEFAULTS = {
  variant: 'card' as ContextWindowVariant,
  used: 120_000,
  warnAt: 80,
  compacting: false,
}

const COMPONENT_DEFAULTS = { warnAt: 0.8, compacting: false, variant: 'card' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: '{ limit: number; segments: ContextSegment[]; model?: string }',
    description:
      'The context size and what fills it. Each segment has id, label, tokens and optional detail, pinned and color.',
  },
  { name: 'warnAt', type: 'number', default: '0.8', description: 'Share of the limit (0–1) where the warning zone starts.' },
  { name: 'onCompact', type: '() => void', description: 'Shows the Compact button when set.' },
  { name: 'compacting', type: 'boolean', default: 'false', description: 'Disables the button and shows a spinner while compaction runs.' },
  { name: 'variant', type: "'card' | 'inline'", default: "'card'", description: 'A panel, or one row for a composer footer.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

const toSegments = (used: number): ContextSegment[] => [
  {
    id: 'history',
    label: 'Conversation',
    detail: '22 turns',
    tokens: Math.max(used - FIXED, 0),
  },
  { id: 'files', label: 'Workspace files', detail: '4 open', tokens: FILES },
  { id: 'tools', label: 'MCP tools', detail: 'github, linear', tokens: TOOLS, pinned: true },
  { id: 'system', label: 'Instructions', detail: 'AGENTS.md', tokens: SYSTEM, pinned: true },
]

export function ContextWindowMeterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, used, warnAt, compacting } = settings.values
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  // Simulated compaction: spinner for a moment, then the conversation shrinks.
  const compact = () => {
    setRunning(true)
    timer.current = setTimeout(() => {
      settings.set('used', COMPACTED)
      setRunning(false)
    }, COMPACT_MS)
  }

  const usage = toUsageSnippet({
    component: 'ContextWindowMeter',
    from: '@/components/ui/context-window-meter',
    props: {
      data: { expression: `{ limit: ${LIMIT}, segments, model: 'opus-5.5' }` },
      warnAt: warnAt / 100,
      onCompact: { expression: 'compact' },
      compacting: compacting || running,
      variant,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / context-window-meter"
      title="Context Window Meter"
      description={
        <>
          How full a model&apos;s context window is, split by what fills it. A
          cell grid shows the mix, the last cells tint in the warning zone and
          Compact appears. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSlider
            label="Used tokens"
            value={used}
            onValueChange={(next) => settings.set('used', next)}
            min={40_000}
            max={LIMIT}
            step={1000}
          />
          <DemoSlider
            label="Warn at"
            value={warnAt}
            onValueChange={(next) => settings.set('warnAt', next)}
            min={50}
            max={95}
            unit="%"
          />
          <DemoSwitch
            label="Compacting"
            checked={compacting}
            onCheckedChange={(next) => settings.set('compacting', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/context-window-meter/',
          'src/components/ui/surface/',
          'src/components/ui/status-pill/',
          'src/components/ui/rolling-number/',
        ],
        usage,
        props: PROPS,
      }}
    >
      <ContextWindowMeter
        data={{ limit: LIMIT, segments: toSegments(used), model: 'opus-5.5' }}
        warnAt={warnAt / 100}
        onCompact={compact}
        compacting={compacting || running}
        variant={variant}
      />
    </DemoPage>
  )
}
