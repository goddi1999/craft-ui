import { getAvatarUrls } from '@wq-org/avatars'
import { useMemo, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { AvatarRings } from '@/components/ui/avatar-rings'

const SIZES = ['sm', 'md', 'lg'] as const

const DEFAULTS = {
  size: 'md' as (typeof SIZES)[number],
  ringWidth: 4,
  overlap: 0,
  count: 7,
  selectable: false,
}

const PROPS: DemoPropDoc[] = [
  { name: 'items', type: '{ id, src, name, ring? }[]', description: 'Avatars to show. Required. Omitted rings cycle the tones.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Avatar diameter (40 / 56 / 72px).' },
  { name: 'ringWidth', type: 'number', default: '4', description: 'Ring thickness in px.' },
  { name: 'overlap', type: 'number', default: '0', description: 'Px each avatar tucks under the previous; 0 is a tight row.' },
  { name: 'max', type: 'number', description: 'Show this many, then a +N chip.' },
  { name: 'selectedId / onSelectedChange', type: 'string | null / (id) => void', description: 'Controlled picker. A radiogroup with roving tabindex and arrow keys.' },
  { name: 'defaultSelectedId', type: 'string | null', description: 'Uncontrolled initial selection.' },
  { name: 'selectable', type: 'boolean', description: 'Force picker semantics without a handler.' },
]

const shuffled = <T,>(list: T[]) =>
  list
    .map((value) => ({ value, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ value }) => value)

export function AvatarRingsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, ringWidth, overlap, count, selectable } = settings.values
  const [seed, setSeed] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const pool = useMemo(() => getAvatarUrls(), [])
  const [order, setOrder] = useState(() => pool.slice(0, 12))

  const items = order
    .slice(0, count)
    .map((avatar) => ({ id: avatar.id, src: avatar.imageUrl, name: avatar.name }))

  const usage = toUsageSnippet({
    component: 'AvatarRings',
    from: '@/components/ui/avatar-rings',
    props: {
      items: { expression: 'avatars' },
      size,
      ringWidth,
      overlap,
      selectedId: selectable ? { expression: 'selectedId' } : undefined,
      onSelectedChange: selectable ? { expression: 'setSelectedId' } : undefined,
    },
    defaults: { size: 'md', ringWidth: 4, overlap: 0 },
  })

  return (
    <DemoPage
      eyebrow="ui / avatar-rings"
      title="Avatar Rings"
      description="Circular avatars wrapped in thick coloured rings. They pop in on a stagger, the hovered one lifts while its neighbours slide aside, and in picker mode the row is a keyboard-friendly radiogroup."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup title="Size" options={SIZES} value={size} onChange={(next) => settings.set('size', next)} />
          <DemoSlider label="Ring width" value={ringWidth} onValueChange={(next) => settings.set('ringWidth', next)} min={1} max={10} unit="px" />
          <DemoSlider label="Overlap" value={overlap} onValueChange={(next) => settings.set('overlap', next)} min={0} max={24} unit="px" />
          <DemoSlider label="Count" value={count} onValueChange={(next) => settings.set('count', next)} min={3} max={12} />
          <DemoSwitch label="Picker mode" checked={selectable} onCheckedChange={(next) => settings.set('selectable', next)} />
          <DemoAction onClick={() => { setOrder(shuffled(pool).slice(0, 12)); setSeed((n) => n + 1) }}>Shuffle</DemoAction>
          <DemoAction onClick={() => setSeed((n) => n + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/avatar-rings/'], usage, props: PROPS }}
    >
      <AvatarRings
        key={`${seed}-${selectable}`}
        items={items}
        size={size}
        ringWidth={ringWidth}
        overlap={overlap}
        {...(selectable ? { selectedId: selected, onSelectedChange: setSelected } : {})}
        className="justify-center"
      />
    </DemoPage>
  )
}
