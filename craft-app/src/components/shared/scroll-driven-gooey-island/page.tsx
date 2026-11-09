import { ScrollDrivenGooeyIsland } from '@/components/ui/scroll-driven-gooey-island'

export function ScrollDrivenGooeyIslandPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-8 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          ui / scroll-driven-gooey-island
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          Scroll-Driven Gooey Island
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          A sticky Dynamic Island header that gooey-morphs the avatar into the
          pill as you scroll. Ported from{' '}
          <a
            href="https://codepen.io/jh3y"
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            jh3y&apos;s CodePen
          </a>
          . Scroll down to collapse the header.
        </p>
      </div>

      <ScrollDrivenGooeyIsland name="Alex Rivera." />
    </div>
  )
}
