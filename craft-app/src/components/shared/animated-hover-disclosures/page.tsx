import { AnimatedHoverDisclosures } from '@/components/ui/animated-hover-disclosures'

import { DemoPage } from '../demo-page'

export function AnimatedHoverDisclosuresPage() {
  return (
    <DemoPage
      eyebrow="ui / animated-hover-disclosures"
      title="Animated Hover Disclosures"
      description="A row of course cards where hovering, focusing, or tapping a column grows it with a grid-template-columns transition — revealing its copy, link, and a colour photo while the rest fold into rotated labels."
    >
      <div className="flex w-full justify-center pb-24">
        <AnimatedHoverDisclosures />
      </div>
    </DemoPage>
  )
}
