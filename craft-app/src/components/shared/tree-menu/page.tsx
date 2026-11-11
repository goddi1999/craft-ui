import type { DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { TreeMenu } from './TreeMenu'
import type { MenuItem } from './tree-menu.types'

const MENU: MenuItem[] = [
  {
    id: 'design',
    label: 'Design',
    children: [
      {
        id: 'foundations',
        label: 'Foundations',
        children: [
          { id: 'colour', label: 'Colour' },
          { id: 'type', label: 'Typography' },
          { id: 'spacing', label: 'Spacing' },
        ],
      },
      {
        id: 'components',
        label: 'Components',
        children: [
          { id: 'buttons', label: 'Buttons' },
          { id: 'inputs', label: 'Inputs' },
          { id: 'overlays', label: 'Overlays' },
        ],
      },
      { id: 'motion', label: 'Motion' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    children: [
      { id: 'architecture', label: 'Architecture' },
      { id: 'testing', label: 'Testing' },
      { id: 'release', label: 'Release process' },
    ],
  },
  { id: 'changelog', label: 'Changelog' },
  { id: 'support', label: 'Support' },
]

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'MenuItem[]',
    description: 'The tree — each item has an id, a label and optional children. Required.',
  },
  {
    name: 'onSelect',
    type: '(item: MenuItem) => void',
    description: 'Called when a leaf (an item without children) is chosen.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

/** No settings to follow, so the snippet is fixed. */
const USAGE = `import { TreeMenu, type MenuItem } from '@/components/shared/tree-menu'

const menu: MenuItem[] = [
  {
    id: 'design',
    label: 'Design',
    children: [
      { id: 'colour', label: 'Colour' },
      { id: 'type', label: 'Typography' },
    ],
  },
  { id: 'changelog', label: 'Changelog' },
]

<TreeMenu items={menu} onSelect={(item) => console.log(item.id)} />`

export function TreeMenuPage() {
  return (
    <DemoPage
      eyebrow="shared / tree-menu"
      title="Tree menu"
      description="A drill-down menu where the row you pick becomes the breadcrumb above the next level. Rows above the clicked one exit upward and rows below exit downward, so the list parts around your choice."
      align="start"
      docs={{
        paths: ['src/components/shared/tree-menu/'],
        usage: USAGE,
        props: PROPS,
      }}
    >
      <TreeMenu items={MENU} />
    </DemoPage>
  )
}
