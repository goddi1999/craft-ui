import { DemoPage } from '../demo-page'

import { Strands } from './Strands'

export function StrandsPage() {
  return (
    <DemoPage
      eyebrow="shared / strands"
      title="Strands"
      description="Glowing ribbons that weave and drift through a glass lens. Click to send a pulse through them."
    >
      <div className="relative h-[520px] w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
        <Strands />
      </div>
    </DemoPage>
  )
}
