import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { LineSidebar } from './LineSidebar'

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

export function LineSidebarPage() {
  const [selected, setSelected] = useState(SECTIONS[0])

  return (
    <DemoPage
      eyebrow="shared / line-sidebar"
      title="Line sidebar"
      description="A nav list whose items lean toward the pointer with smooth proximity falloff, each marked by a tick that stretches as you near it."
    >
      <div className="flex flex-col items-center gap-6 px-4">
        <LineSidebar
          items={SECTIONS}
          defaultActive={0}
          onItemClick={(_, label) => setSelected(label)}
        />
        <p className="text-sm text-muted-foreground">Selected: {selected}</p>
      </div>
    </DemoPage>
  )
}
