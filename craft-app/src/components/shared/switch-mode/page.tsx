import { DemoPage } from '../demo-page'

import { SwitchMode } from './SwitchMode'

export function SwitchModePage() {
  return (
    <DemoPage
      eyebrow="shared / switch-mode"
      title="Switch mode"
      description="A theme toggle wired to next-themes. The knob moves as a layout animation rather than a hard-coded offset, so every size variant lands correctly, and the sun and moon counter-rotate as the theme flips."
    >
      <div className="flex flex-col items-center gap-10">
        <SwitchMode size="sm" />
        <SwitchMode />
        <SwitchMode size="lg" />
      </div>
    </DemoPage>
  )
}
