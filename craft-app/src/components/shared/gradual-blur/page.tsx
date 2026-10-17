import { DemoPage } from '../demo-page'

import { GradualBlur } from './GradualBlur'

const PARAGRAPHS = Array.from(
  { length: 12 },
  (_, index) =>
    `Section ${index + 1}. Scroll this panel and watch the copy soften as it slides under the stacked blur layers along the bottom edge, instead of being cut off by a hard line.`,
)

export function GradualBlurPage() {
  return (
    <DemoPage
      eyebrow="shared / gradual-blur"
      title="Gradual blur"
      description="Stacked backdrop-filter layers whose strength ramps along an edge, so scrolling content fades into a soft focus falloff."
    >
      <div className="relative h-[420px] w-full max-w-xl overflow-hidden rounded-2xl border bg-card">
        <div className="h-full space-y-4 overflow-y-auto p-6 pb-32 text-sm leading-relaxed">
          {PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <GradualBlur
          target="parent"
          position="bottom"
          height="7rem"
          strength={2}
          layers={5}
          curve="bezier"
          exponential
          opacity={1}
        />
      </div>
    </DemoPage>
  )
}
