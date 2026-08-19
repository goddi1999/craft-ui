import { DemoPage } from '../demo-page'

import { FundWidget } from './FundWidget'

export function FundWidgetPage() {
  return (
    <DemoPage
      eyebrow="shared / fund-widget"
      title="Fund widget"
      description="A vertical deck of balance cards. Each card's X rotation and blur are derived from the track's position, so the pages tip and defocus as they roll past the window."
      align="start"
    >
      <div className="pt-8 pb-40">
        <FundWidget />
      </div>
    </DemoPage>
  )
}
