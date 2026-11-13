import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { StrokeTransition } from '@/components/ui/stroke-transition'
import { cn } from '@/lib/utils'

const PAGES = [
  { id: 'a', nav: 'Page A', title: ['Brush Stroke', 'Transition'], bg: 'bg-[#F1E8D2] text-[#1C1A17]' },
  { id: 'b', nav: 'Page B', title: ['And here is', 'page two!'], bg: 'bg-[#7A57B3] text-[#F4EEFF]' },
  { id: 'c', nav: 'Page C', title: ['One more,', 'for luck.'], bg: 'bg-[#1F2B24] text-[#D9F99D]' },
] as const

const STROKES = {
  lavender: 'text-[#C9AEFF]',
  lime: 'text-[#B6F36B]',
  coral: 'text-[#FF8A6B]',
  ink: 'text-[#17151F]',
} as const
type StrokeName = keyof typeof STROKES

const DEFAULTS = { stroke: 'lavender' as StrokeName, duration: 0.85 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'transitionKey',
    type: 'React.Key',
    description: 'Change it to transition — usually the route or page id.',
  },
  { name: 'children', type: 'ReactNode', description: 'The current page. It keeps rendering live between transitions.' },
  {
    name: 'direction',
    type: "'forward' | 'backward'",
    default: "'forward'",
    description: 'Backward mirrors the stroke so it sweeps in from the other side.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.85',
    description: 'Seconds for each half: drawing over the page, then clearing off it.',
  },
  {
    name: 'strokeClassName',
    type: 'string',
    description: 'Colour of the stroke via `text-*`; it paints with currentColor.',
  },
  { name: 'onTransitionEnd', type: '() => void', description: 'Called once the new page is fully revealed.' },
]

export function StrokeTransitionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { stroke, duration } = settings.values
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const page = PAGES[index]

  const go = (next: number) => {
    if (next === index) return
    setDirection(next > index ? 'forward' : 'backward')
    setIndex(next)
  }

  const usage = toUsageSnippet({
    component: 'StrokeTransition',
    from: '@/components/ui/stroke-transition',
    props: {
      transitionKey: { expression: 'pathname' },
      duration,
      strokeClassName: STROKES[stroke],
    },
    defaults: { duration: 0.85 },
    children: '<Outlet />',
  })

  return (
    <DemoPage
      eyebrow="ui / stroke-transition"
      title="Stroke Transition"
      description="A page transition painted with one fat brush stroke. It spirals in until the page is covered, the next page swaps in underneath, then the stroke's tail chases its head off screen. Going back mirrors it; with reduced motion it is a quick fade."
      bleed
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Stroke"
            options={Object.keys(STROKES) as StrokeName[]}
            value={stroke}
            onChange={(next) => settings.set('stroke', next)}
          />
          <DemoSlider
            label="Each half"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.4}
            max={1.6}
            step={0.05}
            unit="s"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/stroke-transition/'], usage, props: PROPS }}
    >
      <div className="relative h-[420px] w-full sm:h-[480px]">
        <nav
          aria-label="Pages"
          className="absolute top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-[#141414] p-1 shadow-lg"
        >
          {PAGES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-current={i === index ? 'page' : undefined}
              onClick={() => go(i)}
              className={cn(
                'min-h-11 rounded-lg px-3.5 text-xs font-semibold transition-colors duration-150 outline-none select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] focus-visible:ring-2 focus-visible:ring-[#B6F36B] active:scale-[0.97] sm:min-h-8 sm:px-3',
                i === index ? 'bg-[#B6F36B] text-[#141414]' : 'text-white/70 hover:text-white',
              )}
            >
              {item.nav}
            </button>
          ))}
        </nav>

        <StrokeTransition
          transitionKey={page.id}
          direction={direction}
          duration={duration}
          strokeClassName={STROKES[stroke]}
          className="size-full"
        >
          <section className={cn('grid size-full place-items-center', page.bg)}>
            <h2 className="text-center text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
              {page.title[0]}
              <br />
              {page.title[1]}
            </h2>
          </section>
        </StrokeTransition>
      </div>
    </DemoPage>
  )
}
