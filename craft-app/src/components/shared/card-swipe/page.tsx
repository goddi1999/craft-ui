import { DemoPage } from '../demo-page'

import { CardSwipe } from './CardSwipe'

export function CardSwipePage() {
  return (
    <DemoPage
      eyebrow="shared / card-swipe"
      title="Card swipe"
      description="A draggable deck where each card's Y rotation is derived from the track's own scroll position, so neighbours swing away in perspective as the active card squares up to the viewer."
    >
      <CardSwipe />
    </DemoPage>
  )
}
