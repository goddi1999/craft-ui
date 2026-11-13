import { cn } from '@/lib/utils'

export type MockSiteProps = {
  brand: string
  headline: string
  body: string
  /** background wash for the hero */
  wash: string
  accent: string
  dark?: boolean
}

/** A made-up landing page, just detailed enough to read as a real site when it is small. */
export function MockSite({ brand, headline, body, wash, accent, dark = false }: MockSiteProps) {
  return (
    <div className={cn('relative size-full overflow-hidden', dark ? 'bg-[#0b0b0f] text-white' : 'bg-white text-[#14141a]')}>
      <div aria-hidden className="absolute inset-0 opacity-90" style={{ background: wash }} />
      <header className="relative flex items-center gap-6 px-[5%] py-4 text-xs">
        <span className="text-sm font-semibold tracking-tight">{brand}</span>
        <nav className={cn('hidden gap-5 sm:flex', dark ? 'text-white/70' : 'text-black/60')}>
          <span>Product</span>
          <span>Solutions</span>
          <span>Developers</span>
          <span>Pricing</span>
        </nav>
        <span
          className="ml-auto rounded-full px-3 py-1 text-[11px] font-medium text-white"
          style={{ background: accent }}
        >
          Get started
        </span>
      </header>
      <div className="relative grid h-[calc(100%-56px)] grid-cols-[1.2fr_1fr] items-center gap-6 px-[5%]">
        <div>
          <h3 className="text-[clamp(1.4rem,4.4vw,3rem)] leading-[1.02] font-semibold tracking-tight">
            {headline}
          </h3>
          <p className={cn('mt-3 max-w-sm text-xs leading-relaxed', dark ? 'text-white/70' : 'text-black/60')}>
            {body}
          </p>
          <div className="mt-4 flex gap-2 text-[11px] font-medium">
            <span className="rounded-full px-3 py-1.5 text-white" style={{ background: accent }}>
              Start now
            </span>
            <span className={cn('rounded-full px-3 py-1.5', dark ? 'bg-white/10' : 'bg-black/5')}>
              Talk to us
            </span>
          </div>
        </div>
        <div
          className={cn(
            'hidden h-[62%] flex-col gap-2 rounded-xl p-3 shadow-2xl sm:flex',
            dark ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5',
          )}
        >
          <div className="h-2 w-1/2 rounded-full" style={{ background: accent }} />
          <div className={cn('h-2 w-4/5 rounded-full', dark ? 'bg-white/15' : 'bg-black/10')} />
          <div className={cn('h-2 w-3/5 rounded-full', dark ? 'bg-white/15' : 'bg-black/10')} />
          <div className={cn('mt-auto h-1/2 rounded-lg', dark ? 'bg-white/[0.04]' : 'bg-black/[0.03]')} />
        </div>
      </div>
    </div>
  )
}
