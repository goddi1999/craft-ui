import ProximitySidebar, { type ProximitySection } from './ProximitySidebar'

type DocItem = {
  id: string
  label: string
  description: string
  kind: NonNullable<ProximitySection['kind']>
}

type DocGroup = {
  id: string
  label: string
  eyebrow: string
  title: string
  description: string
  items: DocItem[]
}

const docs: DocGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    eyebrow: 'Introduction',
    title: 'Proximity Sidebar',
    description:
      'A compact document minimap that turns headings and body rhythm into interactive dashes. It stays quiet by default, expands near the pointer, and briefly pulses the matching dash while the reader scrolls.',
    items: [
      {
        id: 'overview-purpose',
        label: 'Purpose',
        description:
          'The sidebar gives readers a sense of document length without forcing another table of contents into the layout. Each dash represents real content, so the minimap feels tied to the page instead of decorative.',
        kind: 'body',
      },
      {
        id: 'overview-pattern',
        label: 'Pattern',
        description:
          'Pointer proximity expands nearby dashes continuously. Scroll activation only pulses for a short moment, then returns to baseline so the navigation does not stay visually loud.',
        kind: 'body',
      },
      {
        id: 'overview-density',
        label: 'Density',
        description:
          'The component works best when it mirrors the reading structure: major titles, secondary headings, and smaller descriptive sections all become part of the same quiet stack.',
        kind: 'body',
      },
      {
        id: 'overview-clicks',
        label: 'Clicks',
        description:
          'Clicking any dash scrolls to its matching content block. This keeps the minimap useful while preserving the minimal visual language of the original dash-only design.',
        kind: 'body',
      },
      {
        id: 'overview-sizing',
        label: 'Sizing',
        description:
          'Titles use the strongest base length, subtitles sit slightly below that, and body sections stay short and muted. The hover expansion uses the same proportions.',
        kind: 'body',
      },
      {
        id: 'overview-motion',
        label: 'Motion',
        description:
          'The dash animation is driven by transform scale, not layout width. That keeps the interaction responsive even while the scroll container is moving.',
        kind: 'body',
      },
    ],
  },
  {
    id: 'content-model',
    label: 'Content Model',
    eyebrow: 'Structure',
    title: 'Content Model',
    description:
      'The sidebar does not invent marks by itself. It reflects the sections you provide, which makes the visual hierarchy predictable and easy to tune.',
    items: [
      {
        id: 'content-title',
        label: 'Title',
        description:
          'A title dash should represent a major region of the document. These are the strongest marks and should appear only where the reader expects a new chapter or major concept.',
        kind: 'body',
      },
      {
        id: 'content-subtitle',
        label: 'Subtitle',
        description:
          'Subtitle dashes are slightly quieter than title dashes. They are useful for feature groups, installation steps, API categories, or meaningful document turns.',
        kind: 'body',
      },
      {
        id: 'content-section',
        label: 'Section',
        description:
          'Section dashes sit between markers and body text. They add rhythm without making the entire minimap look like every entry has the same importance.',
        kind: 'body',
      },
      {
        id: 'content-body',
        label: 'Body',
        description:
          'Body dashes are the smallest marks. They let the sidebar reach the same density as the original implementation while still being connected to real content.',
        kind: 'body',
      },
      {
        id: 'content-auto',
        label: 'Auto Detect',
        description:
          'If a section does not provide a kind or level, the component looks for the first heading inside the target element and maps h1, h2, and h3 to visual weight.',
        kind: 'body',
      },
    ],
  },
  {
    id: 'behavior',
    label: 'Behavior',
    eyebrow: 'Interaction',
    title: 'Behavior',
    description:
      'The sidebar balances direct interaction with passive reading. It responds to the pointer, follows scroll position briefly, and stays out of the way when idle.',
    items: [
      {
        id: 'behavior-hover',
        label: 'Hover',
        description:
          'Hovering over the stack sets a shared pointer value. Each dash measures its own distance from that pointer and scales according to proximity.',
        kind: 'body',
      },
      {
        id: 'behavior-scroll',
        label: 'Scroll',
        description:
          'When the reader scrolls, the closest content section expands for half a second and then returns to normal. The active cue is useful but not sticky.',
        kind: 'body',
      },
      {
        id: 'behavior-click',
        label: 'Click',
        description:
          'Each dash is rendered as a button with an accessible label. The visual stays minimal, but the control still behaves like real navigation.',
        kind: 'body',
      },
      {
        id: 'behavior-scroll-parent',
        label: 'Scroll Parent',
        description:
          'The demo uses an internal scroll area. The component detects scrollable parents for the target sections, so the pulse works inside app layouts too.',
        kind: 'body',
      },
      {
        id: 'behavior-reduced-motion',
        label: 'Reduced Motion',
        description:
          'When reduced motion is requested, clicking a dash jumps without smooth scrolling. The component keeps the navigation predictable for motion-sensitive users.',
        kind: 'body',
      },
      {
        id: 'behavior-history',
        label: 'History',
        description:
          'Selecting a dash updates the URL hash for the target id. Readers can copy or reload the page and keep the same location context.',
        kind: 'body',
      },
    ],
  },
  {
    id: 'styling',
    label: 'Styling',
    eyebrow: 'Visual System',
    title: 'Styling',
    description:
      'The dash stack keeps the original visual tone: thin one-pixel marks, eight-pixel spacing, muted small entries, and strong foreground markers.',
    items: [
      {
        id: 'styling-gap',
        label: 'Gap',
        description:
          'The original component felt precise because the gaps were tight and consistent. This version keeps the same vertical spacing across all dash types.',
        kind: 'body',
      },
      {
        id: 'styling-thickness',
        label: 'Thickness',
        description:
          'The hierarchy comes from length and color instead of heavy stroke widths. That keeps the minimap refined even when the page has many anchors.',
        kind: 'body',
      },
      {
        id: 'styling-color',
        label: 'Color',
        description:
          'Major sections use the foreground color. Smaller items use muted foreground opacity so they create density without overpowering the page.',
        kind: 'body',
      },
      {
        id: 'styling-width',
        label: 'Width',
        description:
          'The strongest mark expands to the same full length as the initial prototype. Smaller entries preserve that same proportional language.',
        kind: 'body',
      },
      {
        id: 'styling-side',
        label: 'Side',
        description:
          'When the sidebar moves to the right side, dashes expand from the right edge. This keeps the motion anchored to the outside rail.',
        kind: 'body',
      },
    ],
  },
  {
    id: 'usage',
    label: 'Usage',
    eyebrow: 'Implementation',
    title: 'Usage',
    description:
      'The API stays small. Pass a list of content sections with ids and labels, then place matching ids on the content blocks you want to navigate to.',
    items: [
      {
        id: 'usage-sections',
        label: 'Sections',
        description:
          'For a dense docs page, include more than only top-level headings. Add subtitles and meaningful descriptive blocks to create the minimap texture.',
        kind: 'body',
      },
      {
        id: 'usage-kind',
        label: 'Kinds',
        description:
          'Use kind when the visual weight should not depend on the DOM heading level. This is helpful for demos, MDX content, and generated docs.',
        kind: 'body',
      },
      {
        id: 'usage-level',
        label: 'Levels',
        description:
          'If your content pipeline already knows heading levels, pass level values from one to six and let the component map them to dash weights.',
        kind: 'body',
      },
      {
        id: 'usage-classname',
        label: 'Class Name',
        description:
          'The component handles the stack and motion. The surrounding page can control sticky positioning, sidebar width, and responsive visibility.',
        kind: 'body',
      },
      {
        id: 'usage-content',
        label: 'Content',
        description:
          'Avoid decorative-only dashes. The minimap is strongest when every line represents something the reader can jump to and understand.',
        kind: 'body',
      },
      {
        id: 'usage-mobile',
        label: 'Mobile',
        description:
          'A dense minimap is best for larger reading surfaces. On small screens, it can be hidden or moved behind a compact navigation affordance.',
        kind: 'body',
      },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    eyebrow: 'API',
    title: 'Reference',
    description:
      'The component accepts a side, optional className, optional active offset, and an ordered list of sections. That order is the order rendered in the dash stack.',
    items: [],
  },
]

const sections: ProximitySection[] = docs.flatMap((group) => [
  { id: group.id, label: group.label, kind: 'title' },
  ...group.items.map((item) => ({
    id: item.id,
    label: item.label,
    kind: item.kind,
  })),
])

export function ProximitySidebarPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background px-4 pb-10 pt-16 text-foreground">
      <header className="mx-auto mb-8 w-full max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          shared / proximity-sidebar
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          Proximity sidebar
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          A document minimap whose dashes lengthen near the pointer and pulse
          with the active section as you scroll.
        </p>
      </header>

      <div className="mx-auto h-[min(44rem,calc(100svh-11rem))] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-full min-h-0 overflow-hidden">
          <aside className="h-full w-24 shrink-0">
            <ProximitySidebar side="left" sections={sections} />
          </aside>

          <main className="ml-20 min-h-0 flex-1 overflow-auto px-8 py-20 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-14">
            <article className="max-w-2xl">
              {docs.map((group, groupIndex) => (
                <section
                  key={group.id}
                  id={group.id}
                  className="mt-10 scroll-mt-12 first:mt-0"
                >
                  <p className="mb-2 text-sm text-foreground/65 dark:text-foreground/40">
                    {group.eyebrow}
                  </p>
                  {groupIndex === 0 ? (
                    <h2 className="text-5xl font-medium tracking-wider text-foreground">
                      {group.title}
                    </h2>
                  ) : (
                    <h3 className="border-b pb-2 text-3xl font-medium tracking-wide text-foreground/90">
                      {group.title}
                    </h3>
                  )}
                  <p className="mt-2 text-lg text-foreground/80 dark:text-foreground/60">
                    {group.description}
                  </p>

                  {group.id === 'reference' ? (
                    <div className="mt-6 grid gap-6">
                      <div id="reference-props" className="scroll-mt-12">
                        <p className="text-sm leading-6 text-foreground/75 dark:text-foreground/50">
                          Pass <code>sections</code>, <code>side</code>,{' '}
                          <code>className</code>, and <code>activeOffset</code>.
                          The section ids should match elements in the document.
                        </p>
                      </div>
                      <div id="reference-output" className="scroll-mt-12">
                        <p className="text-sm leading-6 text-foreground/75 dark:text-foreground/50">
                          The component renders an accessible navigation rail
                          where each dash is a button tied to its matching
                          content block.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      {group.items.map((item) => (
                        <section
                          key={item.id}
                          id={item.id}
                          className="scroll-mt-12"
                        >
                          <p className="text-sm leading-6 text-foreground/75 dark:text-foreground/50">
                            {item.description}
                          </p>
                        </section>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}
