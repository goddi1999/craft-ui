import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { Treemap } from './Treemap'
import type { TreemapNode } from './Treemap'

const REVENUE_BY_REGION: TreemapNode = {
  id: 'all',
  label: 'All regions',
  children: [
    {
      id: 'na',
      label: 'North America',
      children: [
        { id: 'us', label: 'United States', value: 18400, color: 24 },
        { id: 'ca', label: 'Canada', value: 2350, color: 19 },
        { id: 'mx', label: 'Mexico', value: 1280, color: 31 },
      ],
    },
    {
      id: 'eu',
      label: 'Europe',
      children: [
        { id: 'de', label: 'Germany', value: 4120, color: 28 },
        { id: 'uk', label: 'United Kingdom', value: 3860, color: 12 },
        { id: 'fr', label: 'France', value: 2740, color: 16 },
        { id: 'nl', label: 'Netherlands', value: 1190, color: 22 },
      ],
    },
    {
      id: 'apac',
      label: 'Asia Pacific',
      children: [
        { id: 'jp', label: 'Japan', value: 3020, color: 9 },
        { id: 'au', label: 'Australia', value: 1960, color: 14 },
        { id: 'sg', label: 'Singapore', value: 880, color: 37 },
      ],
    },
  ],
}

const formatGrowth = (value: number) => `+${value}%`

/** Scale every leaf by a random factor so the tiles morph to new sizes. */
const shuffleValues = (node: TreemapNode): TreemapNode => ({
  ...node,
  value:
    node.value === undefined
      ? undefined
      : Math.round(node.value * (0.4 + Math.random() * 1.2)),
  children: node.children?.map(shuffleValues),
})

const DEFAULTS = {
  height: 420,
  shading: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: 'TreemapNode',
    description: 'The root node; leaves carry value and an optional color measure. Required.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'What the whole is, e.g. "Revenue" — names the chart for assistive tech. Required.',
  },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    default: 'grouped number',
    description: 'Formats tile sizes in labels and the tooltip.',
  },
  {
    name: 'colorLabel',
    type: 'string',
    description: 'Names the shading measure, e.g. "Growth". Omit to draw every tile at one depth.',
  },
  {
    name: 'formatColor',
    type: '(value: number) => string',
    default: 'grouped number',
    description: 'Formats the shading measure in the tooltip and scale.',
  },
  {
    name: 'colorDomain',
    type: '[number, number]',
    default: 'range of the leaves',
    description: 'Range the shading measure is mapped across.',
  },
  {
    name: 'focus',
    type: 'string',
    description: 'Controlled id of the node that fills the view.',
  },
  {
    name: 'defaultFocus',
    type: 'string',
    default: 'data.id',
    description: 'Node that fills the view at first when uncontrolled.',
  },
  {
    name: 'onFocusChange',
    type: '(id: string) => void',
    description: 'Called when the user zooms in or steps back out.',
  },
  {
    name: 'height',
    type: 'number',
    default: '420',
    description: 'Height of the tiles in pixels.',
  },
  {
    name: 'emptyLabel',
    type: 'string',
    default: "'No data yet'",
    description: 'Shown when the tree has no positive values.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description: 'Ref to the root figure.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root figure.',
  },
]

export function TreemapPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { height, shading } = settings.values
  const [data, setData] = useState(REVENUE_BY_REGION)

  const usage = toUsageSnippet({
    component: 'Treemap',
    from: '@/components/shared/treemap',
    props: {
      data: '{data}',
      label: 'ARR',
      colorLabel: shading ? 'Growth' : undefined,
      height,
    },
    defaults: { height: DEFAULTS.height },
  }).replace('data="{data}"', 'data={data}')

  const handleShuffle = () => setData(shuffleValues(REVENUE_BY_REGION))

  return (
    <DemoPage
      eyebrow="shared / treemap"
      title="Treemap"
      description="Nested rectangles sized by value and shaded by a second measure. Click a group to zoom in, and use the breadcrumb to step back out."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(value) => settings.set('height', value)}
            min={240}
            max={640}
            step={20}
            unit="px"
          />
          <DemoSwitch
            label="Shade by growth"
            checked={shading}
            onCheckedChange={(value) => settings.set('shading', value)}
          />
          <DemoAction onClick={handleShuffle}>Shuffle values</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/treemap/'],
        usage,
        props: PROPS,
      }}
    >
      <Treemap
        data={data}
        label="ARR"
        colorLabel={shading ? 'Growth' : undefined}
        formatColor={formatGrowth}
        height={height}
        className="mx-auto w-full max-w-3xl"
      />
    </DemoPage>
  )
}
