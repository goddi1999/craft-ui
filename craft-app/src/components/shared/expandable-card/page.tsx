import { DemoPage } from '../demo-page'

import { ExpandableCard } from './ExpandableCard'

export function ExpandableCardPage() {
  return (
    <DemoPage
      eyebrow="shared / expandable-card"
      title="Expandable card"
      description="A card that grows in width and height to reveal its details, morphing from summary to full view."
    >
      <div className="flex w-full max-w-2xl justify-center px-4">
        <ExpandableCard
          title="Pro plan"
          description="Billed yearly, renews March 4"
          width={400}
          expandedWidth={600}
        >
          <ul className="list-disc space-y-1 pl-5">
            <li>Unlimited projects</li>
            <li>Priority support</li>
            <li>Advanced analytics</li>
          </ul>
        </ExpandableCard>
      </div>
    </DemoPage>
  )
}
