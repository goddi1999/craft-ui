import { useRef } from 'react'

import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { ScrollProgress } from './ScrollProgress'

const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'install', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'theming', label: 'Theming' },
  { id: 'faq', label: 'FAQ' },
]

const COPY =
  'Scroll on. The indicator tracks how far through the document you are and swaps its label as each section passes the offset line.'

const DEFAULTS = {
  offset: 120,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'sections',
    type: 'ScrollProgressSection[]',
    default: '[]',
    description: 'Sections to track — `{ id, label }`, where id is the element id on the page.',
  },
  {
    name: 'containerRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Scroll container to track. Leave it out to follow the window.',
  },
  {
    name: 'offset',
    type: 'number',
    default: '120',
    description: 'Distance in px from the top of the scroller at which a section becomes active.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the fixed wrapper — move the pill with `bottom-*`.',
  },
  {
    name: '...props',
    type: "ComponentProps<'div'>",
    description: 'Any native div attribute.',
  },
]

export function ScrollProgressPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { offset } = settings.values
  const scrollerRef = useRef<HTMLDivElement>(null)

  const usage = toUsageSnippet({
    component: 'ScrollProgress',
    from: '@/components/shared/scroll-progress',
    props: { offset },
    defaults: DEFAULTS,
  }).replace('<ScrollProgress', '<ScrollProgress sections={sections}')

  return (
    <DemoPage
      eyebrow="shared / scroll-progress"
      title="Scroll Progress"
      description="A floating progress pill that reports the active section, spring animating between label widths as you scroll. Tap it to jump to a section."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Offset"
            value={offset}
            onValueChange={(value) => settings.set('offset', value)}
            min={0}
            max={320}
            step={10}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/scroll-progress/'],
        usage,
        props: PROPS,
      }}
    >
      {/* `contain` pins the fixed pill to this frame instead of the viewport. */}
      <div className="relative h-[32rem] w-full [contain:layout_paint]">
        <div ref={scrollerRef} className="h-full overflow-y-auto px-4 pb-24">
          <div className="mx-auto flex w-full max-w-2xl flex-col">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="flex min-h-[26rem] flex-col justify-center gap-4 border-t border-border pt-10 first:border-t-0"
              >
                <h2 className="text-2xl font-medium">{section.label}</h2>
                <p className="text-muted-foreground">{COPY}</p>
                <p className="text-muted-foreground">{COPY}</p>
              </section>
            ))}
          </div>
        </div>
        <ScrollProgress
          sections={SECTIONS}
          containerRef={scrollerRef}
          offset={offset}
        />
      </div>
    </DemoPage>
  )
}
