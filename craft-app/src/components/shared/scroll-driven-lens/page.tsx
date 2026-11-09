import { ScrollDrivenLens } from '@/components/ui/scroll-driven-lens'

import { DemoPage } from '../demo-page'

export function ScrollDrivenLensPage() {
  return (
    <DemoPage
      eyebrow="ui / scroll-driven-lens"
      title="Scroll-Driven Lens"
      description="Swipe the camera lenses sideways — an inline view() timeline scales and brightens the frame in focus, crops it with object-view-box, and flashes its caption at centre."
    >
      <ScrollDrivenLens />
    </DemoPage>
  )
}
