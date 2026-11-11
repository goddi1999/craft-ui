import { useRef } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { RailToc, type RailTocItem } from '@/components/ui/rail-toc'
import { cn } from '@/lib/utils'

type Section = RailTocItem & { body: string }

const SECTIONS: Section[] = [
  {
    id: 'rail-toc-installation',
    label: 'Installation',
    depth: 0,
    body: 'Copy the rail-toc folder into your components directory. It only needs motion and the cn helper, so there is nothing else to install.',
  },
  {
    id: 'rail-toc-prerequisites',
    label: 'Prerequisites',
    depth: 1,
    body: 'Every heading the TOC tracks needs an id. The plane looks headings up by id on each scroll, so the ids must be unique on the page.',
  },
  {
    id: 'rail-toc-installation-steps',
    label: 'Installation Steps',
    depth: 1,
    body: 'Pass the headings in document order as items. Depth sets how far each one is indented, and the rail bends between levels.',
  },
  {
    id: 'rail-toc-configuration',
    label: 'Configuration',
    depth: 1,
    body: 'Offset moves the reading line down from the top of the scroller. Clicking an item scrolls its heading to that same line.',
  },
  {
    id: 'rail-toc-usage',
    label: 'Usage',
    depth: 0,
    body: 'Put the TOC in a sticky aside next to the article. Without a containerRef it follows the window; with one it tracks that element instead.',
  },
  {
    id: 'rail-toc-customizing-content',
    label: 'Customizing Content',
    depth: 1,
    body: 'The title names the nav for screen readers too. Inner parts carry data-slot attributes, so you can style the plane or the list from CSS.',
  },
  {
    id: 'rail-toc-submenu-content',
    label: 'Submenu Content',
    depth: 2,
    body: 'A deeper level indents again. Between two headings the plane flies part of the way, so its position always matches how far you have read.',
  },
  {
    id: 'rail-toc-features',
    label: 'Features',
    depth: 0,
    body: 'Scroll back up and the plane turns around. A small slack keeps scroll jitter from flipping it, and reduced motion drops the springs.',
  },
]

const HEADING_CLASS = [
  'text-xl font-semibold tracking-tight',
  'text-base font-medium',
  'text-sm font-medium',
]

const DEFAULTS = {
  offset: 96,
  indent: 14,
  title: 'On this page',
  isNested: true,
}

const COMPONENT_DEFAULTS = {
  offset: 96,
  indent: 14,
  title: 'On this page',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: '{ id: string; label: string; depth?: number }[]',
    description:
      'Headings in document order. Each id must match an element id in the content; depth sets the indent level. Required.',
  },
  {
    name: 'containerRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Scroll container to track and scroll within. Defaults to the window.',
  },
  {
    name: 'offset',
    type: 'number',
    default: '96',
    description:
      "Pixels below the scroller's top edge where a heading counts as reached. Clicking an item scrolls its heading to this line.",
  },
  {
    name: 'indent',
    type: 'number',
    default: '14',
    description: 'Horizontal step in pixels for each depth level.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'On this page'",
    description: 'Text above the list. It also names the navigation for screen readers.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the root nav. Inner parts carry data-slot attributes (rail-toc-title, -list, -plane).',
  },
]

export function RailTocPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const settings = useDemoSettings(DEFAULTS)
  const { offset, indent, title, isNested } = settings.values

  const items: RailTocItem[] = SECTIONS.map(({ id, label, depth }) => ({
    id,
    label,
    depth: isNested ? depth : 0,
  }))

  const usage = toUsageSnippet({
    component: 'RailToc',
    from: '@/components/ui/rail-toc',
    props: {
      items: { expression: 'items' },
      containerRef: { expression: 'scrollRef' },
      offset,
      indent,
      title,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / rail-toc"
      title="Rail TOC"
      description="A table of contents with a paper plane that flies to the section you're reading. Scroll the article and the plane follows the rail, turning where it bends; the rail behind it turns solid and each heading it passes fills in. Click a heading to scroll to it."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Offset"
            value={offset}
            onValueChange={(next) => settings.set('offset', next)}
            min={0}
            max={200}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Indent"
            value={indent}
            onValueChange={(next) => settings.set('indent', next)}
            min={6}
            max={28}
            unit="px"
          />
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
            maxLength={24}
          />
          <DemoSwitch
            label="Nested headings"
            checked={isNested}
            onCheckedChange={(next) => settings.set('isNested', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rail-toc/'], usage, props: PROPS }}
    >
      <div
        ref={scrollRef}
        className="h-[26rem] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-xl border bg-background"
      >
        <div className="flex gap-4 px-4 sm:gap-12 sm:px-10">
          <aside className="sticky top-0 h-max shrink-0 py-8">
            <RailToc
              items={items}
              containerRef={scrollRef}
              offset={offset}
              indent={indent}
              title={title}
              className="max-sm:text-xs"
            />
          </aside>
          <article className="min-w-0 flex-1 py-8 pb-24">
            {SECTIONS.map((section) => {
              const depth = isNested ? (section.depth ?? 0) : 0
              const Heading = depth === 0 ? 'h2' : depth === 1 ? 'h3' : 'h4'
              return (
                <section key={section.id} className="pb-10">
                  <Heading
                    id={section.id}
                    className={cn('scroll-mt-4 text-foreground', HEADING_CLASS[depth])}
                  >
                    {section.label}
                  </Heading>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {section.body}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Keep reading and watch the rail: the dot for this heading fills
                    in once the plane passes it, and the stretch behind the plane
                    stays solid.
                  </p>
                </section>
              )
            })}
          </article>
        </div>
      </div>
    </DemoPage>
  )
}
