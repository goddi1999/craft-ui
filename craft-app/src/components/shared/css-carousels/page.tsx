import {
  createCarouselSlides,
  CssCarousel,
} from '@/components/ui/css-carousels'

import { DEMO_CAROUSELS } from './page.data'
import { DemoPage } from '../demo-page'

export function CssCarouselsPage() {
  return (
    <DemoPage
      eyebrow="ui / css-carousels"
      title="c(ss)arousel"
      description="Four carousels driven by a group of radio inputs — labels act as arrows and dots, and CSS handles the fade, slide, thumbnail and scale transitions."
    >
      <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
        {DEMO_CAROUSELS.map(({ variant, title, letters }) => (
          <section key={variant} className="flex flex-col items-center gap-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              {title}
            </h2>
            <CssCarousel
              variant={variant}
              label={`${title} carousel`}
              slides={createCarouselSlides(letters)}
            />
          </section>
        ))}
      </div>
    </DemoPage>
  )
}
