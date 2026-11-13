import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CurtainPageTransition } from '@/components/ui/curtain-page-transition'
import { cn } from '@/lib/utils'

const PAGES = [
  {
    id: 'eye',
    nav: 'Cinematic Eye',
    title: 'THE CINEMATIC EYE™',
    meta: 'COURSE 01 · Online',
    bg: 'bg-[url(https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80)] bg-cover bg-center text-white',
  },
  {
    id: 'cut',
    nav: 'Perfect Cut',
    title: 'THE PERFECT CUT',
    meta: 'COURSE 02 · Certificate',
    bg: 'bg-[url(https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=80)] bg-cover bg-center text-white',
  },
  {
    id: 'path',
    nav: 'CinePath',
    title: 'CINEPATH PRO',
    meta: 'COURSE 05 · All levels',
    bg: 'bg-[url(https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1400&q=80)] bg-cover bg-center text-white',
  },
] as const

const DEFAULTS = { duration: 0.8, brand: 'THE ART OF DOCUMENTARY' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'transitionKey',
    type: 'React.Key',
    description: 'Change it to transition — usually the route or page id.',
  },
  { name: 'children', type: 'ReactNode', description: 'The current page content.' },
  {
    name: 'duration',
    type: 'number',
    default: '0.8',
    description: 'Seconds for the scale-down. Slide and scale-in follow.',
  },
  {
    name: 'curtainColor',
    type: 'string',
    default: "'#121212'",
    description: 'Stage behind the scaled pages.',
  },
  {
    name: 'brand',
    type: 'string | null',
    default: "'THE ART OF DOCUMENTARY'",
    description: 'Caption on the dark stage while pages slide. `null` hides it.',
  },
  { name: 'onTransitionEnd', type: '() => void', description: 'Called once the new page is revealed.' },
]

export function CurtainPageTransitionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { duration, brand } = settings.values
  const [index, setIndex] = useState(0)
  const page = PAGES[index]

  const usage = toUsageSnippet({
    component: 'CurtainPageTransition',
    from: '@/components/ui/curtain-page-transition',
    props: {
      transitionKey: { expression: 'pathname' },
      duration,
      brand,
    },
    defaults: DEFAULTS,
    children: '<Outlet />',
  })

  return (
    <DemoPage
      eyebrow="ui / curtain-page-transition"
      title="Curtain Page Transition"
      description="The current page scales to 81.66% against a #121212 stage, both pages slide up one viewport, then the incoming page scales back to 1. Adapted from Art of Documentary / DashDigital."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Brand flash"
            value={brand}
            onValueChange={(next) => settings.set('brand', next)}
            maxLength={40}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.5}
            max={1.1}
            step={0.05}
            unit="s"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/curtain-page-transition/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-2">
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'h-9 touch-manipulation rounded-full px-4 text-xs font-medium transition-[color,background-color,transform] duration-150 select-none active:scale-[0.97]',
                '[-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring',
                i === index
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/10',
              )}
            >
              {p.nav}
            </button>
          ))}
        </nav>

        <CurtainPageTransition
          transitionKey={page.id}
          duration={duration}
          brand={brand || null}
          className="aspect-[16/10] w-full max-w-3xl rounded-2xl border shadow-xs"
        >
          <div
            className={cn(
              'relative flex h-full min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center sm:min-h-[360px]',
              page.bg,
            )}
          >
            <div aria-hidden className="absolute inset-0 bg-black/45" />
            <p className="relative font-mono text-[10px] tracking-[0.22em] uppercase opacity-80">
              {page.meta}
            </p>
            <h2 className="relative text-2xl font-semibold tracking-tight sm:text-4xl">{page.title}</h2>
            <p className="relative text-xs text-white/70">Scroll to explore</p>
          </div>
        </CurtainPageTransition>
      </div>
    </DemoPage>
  )
}
