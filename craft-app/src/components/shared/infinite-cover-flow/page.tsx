import { InfiniteCoverFlow } from '@/components/ui/infinite-cover-flow'

import { DemoPage } from '../demo-page'

export function InfiniteCoverFlowPage() {
  return (
    <DemoPage
      eyebrow="ui / infinite-cover-flow"
      title="Infinite Cover Flow"
      description="An endless 3D album carousel built from GSAP timelines — scroll or drag over it to scrub, click a cover to centre it, or use the buttons and arrow keys."
      align="stretch"
    >
      <InfiniteCoverFlow className="rounded-2xl border border-border" />
    </DemoPage>
  )
}
