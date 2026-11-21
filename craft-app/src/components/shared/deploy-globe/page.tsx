import { useState } from 'react'

import { DemoControlGroup, DemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DeployGlobe,
  type DeployNode,
  type DeployStatus,
  type NodeIcon,
  type TrajectoryStep,
} from '@/components/ui/deploy-globe'

const STATUSES: DeployStatus[] = ['deploying', 'deployed', 'error']

const TRAJECTORIES: Record<string, TrajectoryStep[]> = {
  a: [[3, 0], [3, 1], [3, 2], [3, 3]],
  b: [[-3, 0], [-3, 1], [-3, 2], [-3, 3], [-3, 4]],
  c: [[1, 0], [1, 1], [1, 2]],
  d: [[-1, 0], [-1, 1], [-2, 1]],
  e: [[0, 0], [0, 1], [0, 2], [0, 3], [-1, 3]],
  f: [[2, 0], [2, 1]],
}

function withIcons(icons?: Record<string, NodeIcon>): DeployNode[] {
  return Object.entries(TRAJECTORIES).map(([id, trajectory]) => ({
    id,
    trajectory,
    icon: icons?.[id],
  }))
}

function customIcon(d: string): NodeIcon {
  return { d, viewBox: '0 0 24 24' }
}

const PRESETS = {
  Dots: withIcons(),
  Triangles: withIcons({ a: 'triangle', b: 'triangle', c: 'triangle', d: 'triangle', e: 'triangle', f: 'triangle' }),
  Infra: withIcons({ a: 'server', b: 'database', c: 'cloud', d: 'shield', e: 'globe', f: 'zap' }),
  Custom: withIcons({
    a: customIcon('M12 2L2 22h20L12 2z'),
    b: customIcon('M4 4h16v16H4z'),
    c: customIcon('M12 3a9 9 0 100 18 9 9 0 000-18z'),
    d: customIcon('M12 2l8 4v6c0 5-3.8 9.7-8 10-4.2-.3-8-5-8-10V6l8-4z'),
    e: customIcon('M12 2v8h8v4h-8v8h-4v-8H0v-4h8V2z'),
    f: customIcon('M12 1l10 6v10l-10 6L2 17V7l10-6z'),
  }),
} satisfies Record<string, DeployNode[]>

type PresetName = keyof typeof PRESETS
const PRESET_NAMES = Object.keys(PRESETS) as PresetName[]

const ACCENTS = {
  Blue: '#3B82F6',
  Teal: '#45DEC4',
  Purple: '#A855F7',
  Rose: '#F43F5E',
  Amber: '#F59E0B',
} as const

type AccentName = keyof typeof ACCENTS
const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[]

const DURATION = 4.5

const PROPS: DemoPropDoc[] = [
  { name: 'status', type: "'deploying' | 'deployed' | 'error'", default: "'deployed'", description: 'Drives the badge label; error hides the paths and turns the ripples destructive.' },
  { name: 'nodes', type: 'DeployNode[]', default: 'six dots', description: 'Each node has an id, a trajectory of [meridian, row] steps and an optional icon.' },
  { name: 'accentColor', type: 'string', default: "'#45DEC4'", description: 'Any CSS colour for the travelling glow and arrival ripple.' },
  { name: 'duration', type: 'number', default: '4.5', description: 'Seconds per animation loop.' },
  { name: 'onReplay', type: '() => void', description: 'Called when the replay button restarts the animation.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function DeployGlobePage() {
  const [status, setStatus] = useState<DeployStatus>('deployed')
  const [preset, setPreset] = useState<PresetName>('Infra')
  const [accent, setAccent] = useState<AccentName>('Teal')

  const accentColor = status === 'error' ? undefined : ACCENTS[accent]

  const usage = toUsageSnippet({
    component: 'DeployGlobe',
    from: '@/components/ui/deploy-globe',
    props: { status, accentColor, duration: DURATION },
    defaults: { status: 'deployed', duration: 4.5 },
  })

  return (
    <DemoPage
      eyebrow="ui / deploy-globe"
      title="Deploy Globe"
      description="A wireframe half-globe where glowing paths race from the pole to each region node, then ripple on arrival. Switch the status, node icons and accent colour. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoControlGroup title="Status" options={STATUSES} value={status} onChange={setStatus} />
          <DemoControlGroup title="Icons" options={PRESET_NAMES} value={preset} onChange={setPreset} />
          <DemoControlGroup title="Accent" options={ACCENT_NAMES} value={accent} onChange={setAccent} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/deploy-globe/'], usage, props: PROPS }}
    >
      <div className="relative w-full max-w-[680px]">
        <DeployGlobe status={status} nodes={PRESETS[preset]} accentColor={accentColor} duration={DURATION} />
        <div className="mask-b-from-100% mask-t-from-60% pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-background" />
      </div>
    </DemoPage>
  )
}
