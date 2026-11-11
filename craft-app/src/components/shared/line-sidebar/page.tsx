import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { LineSidebar, type LineSidebarProps } from './LineSidebar'

type Falloff = NonNullable<LineSidebarProps['falloff']>

const SECTIONS = [
  'Overview',
  'Getting started',
  'Installation',
  'Components',
  'Theming',
  'Animations',
  'Accessibility',
  'Changelog',
]

const ACCENTS = {
  purple: '#A855F7',
  blue: '#3B82F6',
  green: '#22C55E',
  orange: '#F97316',
  pink: '#EC4899',
} as const
type Accent = keyof typeof ACCENTS

const ACCENT_NAMES = Object.keys(ACCENTS) as Accent[]
const FALLOFFS: Falloff[] = ['linear', 'smooth', 'sharp']

/** Theme tokens so the resting text and ticks read in light and dark mode. */
const TEXT_COLOR = 'var(--muted-foreground)'
const MARKER_COLOR = 'color-mix(in srgb, var(--foreground) 40%, transparent)'

const DEFAULTS = {
  accent: 'purple' as Accent,
  falloff: 'smooth' as Falloff,
  proximityRadius: 100,
  maxShift: 30,
  itemGap: 20,
  smoothing: 100,
  showIndex: true,
  showMarker: true,
  scaleTick: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  accentColor: '#A855F7',
  falloff: 'smooth',
  proximityRadius: 100,
  maxShift: 30,
  itemGap: 20,
  smoothing: 100,
  showIndex: true,
  showMarker: true,
  scaleTick: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'string[]',
    default: "['Overview', 'Components', …]",
    description: 'Labels of the nav items.',
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#A855F7'",
    description: 'Colour items and ticks blend toward as the pointer nears.',
  },
  {
    name: 'textColor',
    type: 'string',
    default: "'#c4c4c4'",
    description: 'Resting label colour.',
  },
  {
    name: 'markerColor',
    type: 'string',
    default: "'#6c6c6c'",
    description: 'Resting tick colour.',
  },
  {
    name: 'showIndex',
    type: 'boolean',
    default: 'true',
    description: 'Prefix each label with a zero-padded number.',
  },
  {
    name: 'showMarker',
    type: 'boolean',
    default: 'true',
    description: 'Draw the tick to the left of each item.',
  },
  {
    name: 'proximityRadius',
    type: 'number',
    default: '100',
    description: 'Distance in px over which an item reacts to the pointer.',
  },
  {
    name: 'maxShift',
    type: 'number',
    default: '30',
    description: 'How far in px the nearest item leans right.',
  },
  {
    name: 'falloff',
    type: "'linear' | 'smooth' | 'sharp'",
    default: "'smooth'",
    description: 'Shape of the proximity falloff.',
  },
  {
    name: 'markerLength',
    type: 'number',
    default: '60',
    description: 'Tick length in px.',
  },
  {
    name: 'markerGap',
    type: 'number',
    default: '0',
    description: 'Gap between tick and label in px.',
  },
  {
    name: 'tickScale',
    type: 'number',
    default: '0.5',
    description: 'Length of the in-between ticks relative to markerLength.',
  },
  {
    name: 'scaleTick',
    type: 'boolean',
    default: 'true',
    description: 'Stretch the in-between ticks with the effect.',
  },
  {
    name: 'itemGap',
    type: 'number',
    default: '20',
    description: 'Vertical gap between items in px.',
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '1.1',
    description: 'Label size in rem.',
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '100',
    description: 'Easing time constant in ms — higher feels softer.',
  },
  {
    name: 'defaultActive',
    type: 'number | null',
    default: 'null',
    description: 'Index highlighted on first render.',
  },
  {
    name: 'onItemClick',
    type: '(index: number, label: string) => void',
    description: 'Called when an item is clicked.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the nav.',
  },
]

export function LineSidebarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    accent,
    falloff,
    proximityRadius,
    maxShift,
    itemGap,
    smoothing,
    showIndex,
    showMarker,
    scaleTick,
  } = settings.values
  const [selected, setSelected] = useState(SECTIONS[0])

  const usage = toUsageSnippet({
    component: 'LineSidebar',
    from: '@/components/shared/line-sidebar',
    props: {
      items: 'ITEMS',
      accentColor: ACCENTS[accent],
      textColor: TEXT_COLOR,
      markerColor: MARKER_COLOR,
      falloff,
      proximityRadius,
      maxShift,
      itemGap,
      smoothing,
      showIndex,
      showMarker,
      scaleTick,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace('items="ITEMS"', 'items={sections}')

  return (
    <DemoPage
      eyebrow="shared / line-sidebar"
      title="Line sidebar"
      description="A nav list whose items lean toward the pointer with smooth proximity falloff, each marked by a tick that stretches as you near it."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Accent"
            options={ACCENT_NAMES}
            value={accent}
            onChange={(value) => settings.set('accent', value)}
          />
          <DemoControlGroup
            title="Falloff"
            options={FALLOFFS}
            value={falloff}
            onChange={(value) => settings.set('falloff', value)}
          />
          <DemoSlider
            label="Proximity radius"
            value={proximityRadius}
            onValueChange={(value) => settings.set('proximityRadius', value)}
            min={40}
            max={240}
            step={10}
            unit="px"
          />
          <DemoSlider
            label="Max shift"
            value={maxShift}
            onValueChange={(value) => settings.set('maxShift', value)}
            min={0}
            max={60}
            unit="px"
          />
          <DemoSlider
            label="Item gap"
            value={itemGap}
            onValueChange={(value) => settings.set('itemGap', value)}
            min={8}
            max={40}
            unit="px"
          />
          <DemoSlider
            label="Smoothing"
            value={smoothing}
            onValueChange={(value) => settings.set('smoothing', value)}
            min={10}
            max={400}
            step={10}
            unit="ms"
          />
          <DemoSwitch
            label="Index numbers"
            checked={showIndex}
            onCheckedChange={(value) => settings.set('showIndex', value)}
          />
          <DemoSwitch
            label="Markers"
            checked={showMarker}
            onCheckedChange={(value) => settings.set('showMarker', value)}
          />
          {showMarker ? (
            <DemoSwitch
              label="Stretch ticks"
              checked={scaleTick}
              onCheckedChange={(value) => settings.set('scaleTick', value)}
            />
          ) : null}
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/line-sidebar/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <LineSidebar
          items={SECTIONS}
          defaultActive={0}
          accentColor={ACCENTS[accent]}
          textColor={TEXT_COLOR}
          markerColor={MARKER_COLOR}
          falloff={falloff}
          proximityRadius={proximityRadius}
          maxShift={maxShift}
          itemGap={itemGap}
          smoothing={smoothing}
          showIndex={showIndex}
          showMarker={showMarker}
          scaleTick={scaleTick}
          onItemClick={(_, label) => setSelected(label)}
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Selected: {selected}
        </p>
      </div>
    </DemoPage>
  )
}
