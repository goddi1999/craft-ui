import { DemoPage } from '../demo-page'

import { LaserFlow } from './LaserFlow'

export function LaserFlowPage() {
  return (
    <DemoPage
      eyebrow="shared / laser-flow"
      title="Laser flow"
      description="A WebGL beam that pours down onto a surface, spilling light, fog, and dust. Move the pointer over it to stir the flow."
    >
      <div className="relative h-[520px] w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
        <LaserFlow color="#CF9EFF" />
        <div className="absolute inset-x-[12%] bottom-0 h-[38%] rounded-t-2xl border border-white/15 bg-[#060010]" />
      </div>
    </DemoPage>
  )
}
