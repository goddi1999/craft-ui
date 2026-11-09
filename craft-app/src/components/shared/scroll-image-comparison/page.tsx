import { useState } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { ScrollImageComparison } from '@/components/ui/scroll-image-comparison'

import { DemoPage } from '../demo-page'

export function ScrollImageComparisonPage() {
  const [reveal, setReveal] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / scroll-image-comparison"
      title="Scroll Image Comparison"
      description="A before/after slider with no JS wiring — the range thumb owns a view-timeline that animates --compare to clip the top image. Reveal explodes the layers in 3D."
    >
      <div className="flex w-full flex-col items-center gap-16">
        <DemoPanel className="relative z-10 max-w-xs items-center">
          <DemoToggleRow>
            <DemoToggle
              label="Reveal layers"
              pressed={reveal}
              onPressedChange={setReveal}
            />
          </DemoToggleRow>
        </DemoPanel>

        <ScrollImageComparison reveal={reveal} />
      </div>
    </DemoPage>
  )
}
