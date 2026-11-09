import { SvgFilterScroller } from '@/components/ui/svg-filter-scroller'

export function SvgFilterScrollerPage() {
  return (
    <div className="min-h-svh bg-black text-white">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-2xl px-4 pt-16 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
          ui / svg-filter-scroller
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-white/90">
          SVG Filter Scroller
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
          Scroll the stage — displacement + velocity lag warp the heading.
        </p>
      </header>

      <SvgFilterScroller className="h-svh" />
    </div>
  )
}
