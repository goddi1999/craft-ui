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

export function ScrollProgressPage() {
  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <ScrollProgress sections={SECTIONS} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / scroll-progress
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Scroll progress
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A floating progress pill that reports the active section, spring
            animating between label widths as you move down the page.
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
