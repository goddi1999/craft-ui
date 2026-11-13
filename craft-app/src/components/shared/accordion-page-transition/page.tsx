import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { AccordionPageTransition } from '@/components/ui/accordion-page-transition'
import { cn } from '@/lib/utils'

const PAGES = [
  {
    id: 'home',
    nav: 'Home',
    title: 'ACCORDION',
    caption: 'Artists · About · Contact',
    bg: 'bg-[url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80)] bg-cover bg-center text-white',
  },
  {
    id: 'work',
    nav: 'Work',
    title: 'TAFE makes it Real',
    caption: 'Victorian Government',
    bg: 'bg-neutral-900 text-white',
  },
  {
    id: 'studio',
    nav: 'Studio',
    title: 'Sunshine Moments',
    caption: 'Visit Sunshine Coast',
    bg: 'bg-[#1a1410] text-[#f5efe6]',
  },
] as const

const DEFAULTS = { slats: 15, duration: 1 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'transitionKey',
    type: 'React.Key',
    description: 'Change it to transition — usually the route or page id.',
  },
  { name: 'children', type: 'ReactNode', description: 'The current page content.' },
  {
    name: 'slats',
    type: 'number',
    default: '15',
    description: 'Vertical bars in the accordion mask.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1',
    description: 'Seconds for each half: cover, then reveal.',
  },
  { name: 'slatColor', type: 'string', default: "'#ffffff'", description: 'Slat fill.' },
  { name: 'stageColor', type: 'string', default: "'#020202'", description: 'Black stage and curve fill.' },
  { name: 'onTransitionEnd', type: '() => void', description: 'Called once the new page is revealed.' },
]

export function AccordionPageTransitionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { slats, duration } = settings.values
  const [index, setIndex] = useState(0)
  const page = PAGES[index]

  const usage = toUsageSnippet({
    component: 'AccordionPageTransition',
    from: '@/components/ui/accordion-page-transition',
    props: {
      transitionKey: { expression: 'pathname' },
      slats,
      duration,
    },
    defaults: DEFAULTS,
    children: '<Outlet />',
  })

  return (
    <DemoPage
      eyebrow="ui / accordion-page-transition"
      title="Accordion Page Transition"
      description="The outgoing page clips into a centre slit while equal-height white slats shrink into Accordion’s logo — two SVG curves cut the concave silhouette — then the slit opens on the new page. Adapted from Accordion / HOLOGRAPHIK."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Slats"
            value={slats}
            onValueChange={(next) => settings.set('slats', next)}
            min={7}
            max={19}
            step={2}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.6}
            max={1.2}
            step={0.05}
            unit="s"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/accordion-page-transition/'],
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

        <AccordionPageTransition
          transitionKey={page.id}
          slats={slats}
          duration={duration}
          className="aspect-[16/10] w-full max-w-3xl rounded-2xl border shadow-xs"
        >
          <div
            className={cn(
              'flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center sm:min-h-[360px]',
              page.bg,
            )}
          >
            <p className="text-[10px] font-medium tracking-[0.22em] uppercase opacity-80">
              {page.caption}
            </p>
            <h2 className="font-serif text-3xl tracking-tight sm:text-5xl">{page.title}</h2>
          </div>
        </AccordionPageTransition>
      </div>
    </DemoPage>
  )
}
