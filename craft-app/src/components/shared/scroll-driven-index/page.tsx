import {
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { cn } from '@/lib/utils'

import {
  SCROLL_DRIVEN_INDEX_SCROLL_CLASS,
  ScrollDrivenIndex,
} from './ScrollDrivenIndex'
import type {
  ScrollDrivenIndexAlignment,
  ScrollDrivenIndexItem,
  ScrollDrivenIndexTone,
} from './scroll-driven-index.types'

const INDEX_ITEMS: ScrollDrivenIndexItem[] = [
  { id: 'user-centered-design', label: 'User-Centered Design' },
  {
    id: 'responsive-layouts',
    label: 'Responsive Layouts and Visual Hierarchy',
  },
  { id: 'typography', label: 'Typography for Readability' },
  { id: 'color-contrast', label: 'Color, Contrast, and Branding' },
  { id: 'motion-design', label: 'Adding Motion with Animations' },
  { id: 'accessibility', label: 'Accessibility and Inclusivity' },
  { id: 'conclusion', label: 'Conclusion' },
]

const ALIGNMENTS: ScrollDrivenIndexAlignment[] = ['left', 'center', 'right']
const TONES: ScrollDrivenIndexTone[] = ['default', 'muted']

const DEFAULTS = {
  alignment: 'center' as ScrollDrivenIndexAlignment,
  tone: 'default' as ScrollDrivenIndexTone,
  label: 'Index',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'ScrollDrivenIndexItem[]',
    description: 'Index entries — `{ id, label, href? }`; href defaults to `#id`.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Index'",
    description: 'Text on the trigger pill.',
  },
  {
    name: 'alignment',
    type: "'left' | 'center' | 'right'",
    default: "'center'",
    description: 'Where the pill sits along the bottom edge and which way the panel grows.',
  },
  {
    name: 'tone',
    type: "'default' | 'muted'",
    default: "'default'",
    description: 'High-contrast pill or a softer muted one.',
  },
  {
    name: 'popoverId',
    type: 'string',
    default: 'useId()',
    description: 'Id of the popover panel, if you need to target it.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Your article. The scroller must carry `SCROLL_DRIVEN_INDEX_SCROLL_CLASS` so its scroll drives the progress.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function ScrollDrivenIndexPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { alignment, tone, label } = settings.values

  const usage = toUsageSnippet({
    component: 'ScrollDrivenIndex',
    from: '@/components/shared/scroll-driven-index',
    imports: ['SCROLL_DRIVEN_INDEX_SCROLL_CLASS'],
    props: { alignment, tone, label },
    defaults: DEFAULTS,
    children: `<div className={SCROLL_DRIVEN_INDEX_SCROLL_CLASS}>
  <section id="user-centered-design">…</section>
</div>`,
  }).replace(/<ScrollDrivenIndex(\n?)/, (_, newline: string) =>
    newline ? '<ScrollDrivenIndex\n  items={items}\n' : '<ScrollDrivenIndex items={items}',
  )

  return (
    <DemoPage
      eyebrow="shared / scroll-driven-index"
      title="Scroll-Driven Index"
      description="Scroll the article: a scroll() timeline counts the reading progress in the pill and draws its icon. Open it to jump between sections — the panel morphs out of the pill with interpolate-size."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Alignment"
            options={ALIGNMENTS}
            value={alignment}
            onChange={(value) => settings.set('alignment', value)}
          />
          <DemoControlGroup
            title="Tone"
            options={TONES}
            value={tone}
            onChange={(value) => settings.set('tone', value)}
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={12}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/scroll-driven-index/'],
        usage,
        props: PROPS,
      }}
    >
      {/* `contain` pins the fixed pill to this frame instead of the viewport. */}
      <div className="relative h-[36rem] w-full [contain:layout_paint]">
        <ScrollDrivenIndex
          items={INDEX_ITEMS}
          alignment={alignment}
          tone={tone}
          label={label || undefined}
        >
          <div
            className={cn(
              SCROLL_DRIVEN_INDEX_SCROLL_CLASS,
              'h-[36rem] w-full overflow-auto px-4 pt-12 pb-28',
              'mask-[linear-gradient(#0000,#fff_80px_calc(100%-80px),#0000)]',
            )}
          >
            <header className="mx-auto mb-24 max-w-[60ch] pt-6">
              <h2 className="text-center text-3xl font-medium tracking-tight text-balance text-foreground">
                The craft of web UI
              </h2>
              <p className="mt-8 text-center text-lg font-light text-muted-foreground">
                A well-crafted UI can turn a simple webpage into an interactive
                journey, guiding users through thoughtful design and seamless motion.
              </p>
            </header>

            <article className="mx-auto max-w-[60ch] [&_section]:mb-24 [&_section]:scroll-mt-20">
              <DemoSection
                id="user-centered-design"
                title="User-Centered Design"
                paragraphs={[
                  'User-centered design is the backbone of effective UI. Every decision should revolve around the user’s needs, behavior, and preferences.',
                  'Understanding the end-user’s journey helps designers pinpoint where users might encounter difficulties or confusion.',
                ]}
              />
              <DemoSection
                id="responsive-layouts"
                title="Responsive Layouts and Visual Hierarchy"
                paragraphs={[
                  'Layouts need to be responsive and visually coherent across devices of all screen sizes.',
                  'With mobile browsing dominant, fluid grids and scalable images ensure content stays easy to navigate.',
                ]}
              />
              <DemoSection
                id="typography"
                title="Typography for Readability"
                paragraphs={[
                  'Typography creates hierarchy and rhythm that guides readers naturally through content.',
                  'Accessible contrast, font sizes, and line spacing help prevent eye strain.',
                ]}
              />
              <DemoSection
                id="color-contrast"
                title="Color, Contrast, and Branding"
                paragraphs={[
                  'Color and contrast play a powerful role in branding and functional clarity.',
                  'High contrast between text and backgrounds enhances readability and accessibility.',
                ]}
              />
              <DemoSection
                id="motion-design"
                title="Adding Motion with Animations"
                paragraphs={[
                  'Motion design is where UI comes to life — micro-interactions make pages feel responsive.',
                  'Animation should be used mindfully; excessive motion can overwhelm users.',
                ]}
              />
              <DemoSection
                id="accessibility"
                title="Accessibility and Inclusivity"
                paragraphs={[
                  'Accessible UI ensures the web is usable for all people, regardless of ability.',
                  'ARIA labels, keyboard navigation, and semantic HTML are foundational practices.',
                ]}
              />
              <hr className="mb-24 opacity-50" />
              <DemoSection
                id="conclusion"
                title="Conclusion"
                paragraphs={[
                  'The craft of web UI design lies in harmonizing aesthetics, functionality, and motion.',
                  'An emphasis on motion, accessibility, and user-centered design shapes meaningful experiences.',
                ]}
              />
            </article>

          </div>
        </ScrollDrivenIndex>
      </div>
    </DemoPage>
  )
}

type DemoSectionProps = {
  id: string
  title: string
  paragraphs: string[]
}

function DemoSection({ id, title, paragraphs }: DemoSectionProps) {
  return (
    <section id={id}>
      <h2 className="mb-5 text-2xl font-medium text-balance text-foreground">
        {title}
      </h2>
      {paragraphs.map((text) => (
        <p
          key={text}
          className="mb-4 font-light text-muted-foreground last:mb-0"
        >
          {text}
        </p>
      ))}
    </section>
  )
}
