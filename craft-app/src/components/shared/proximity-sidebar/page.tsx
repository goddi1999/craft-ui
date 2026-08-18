import ProximitySidebar, { type ProximitySection } from './ProximitySidebar'

const SECTIONS: ProximitySection[] = [
  { id: 'ps-intro', label: 'Introduction', kind: 'title' },
  { id: 'ps-why', label: 'Why proximity', kind: 'subtitle' },
  { id: 'ps-install', label: 'Installation', kind: 'section' },
  { id: 'ps-usage', label: 'Usage', kind: 'section' },
  { id: 'ps-api', label: 'API reference', kind: 'section' },
  { id: 'ps-notes', label: 'Notes', kind: 'body' },
]

const COPY =
  'The dashes nearest the pointer stretch toward it and relax as it moves away, so the rail reads as a soft field rather than a list of ticks.'

export function ProximitySidebarPage() {
  return (
    <div className="relative min-h-svh bg-background text-foreground">
      {/* The nav sizes itself to its parent, so it needs a full-height rail. */}
      <div className="fixed inset-y-0 right-0 z-40 hidden md:block">
        <ProximitySidebar sections={SECTIONS} side="right" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / proximity-sidebar
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Proximity sidebar
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A table-of-contents rail whose dashes lengthen based on their
            distance from the cursor, with the active section tracked on scroll.
            Move the pointer to the right edge.
          </p>
        </header>

        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex min-h-[70vh] flex-col justify-center gap-4 border-t border-border pt-10"
          >
            <h2 className="text-2xl font-medium">{section.label}</h2>
            <p className="text-muted-foreground">{COPY}</p>
            <p className="text-muted-foreground">{COPY}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
