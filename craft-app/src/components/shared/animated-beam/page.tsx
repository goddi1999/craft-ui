import { useRef, type ReactNode, type RefObject } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { cn } from '@/lib/utils'

import { AnimatedBeam } from './AnimatedBeam'

const GRADIENTS = {
  sunset: ['#ffaa40', '#9c40ff'],
  ocean: ['#38bdf8', '#22d3ee'],
  forest: ['#4ade80', '#a3e635'],
  rose: ['#fb7185', '#f472b6'],
} as const
type Gradient = keyof typeof GRADIENTS
const GRADIENT_NAMES = Object.keys(GRADIENTS) as Gradient[]

const DEFAULTS = {
  gradient: 'sunset' as Gradient,
  curvature: 60,
  duration: 4,
  pathWidth: 2,
  pathOpacity: 0.2,
  reverse: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  curvature: 0,
  duration: 5,
  pathWidth: 2,
  pathOpacity: 0.2,
  reverse: false,
  gradientStartColor: GRADIENTS.sunset[0],
  gradientStopColor: GRADIENTS.sunset[1],
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'containerRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Positioned element the beam is drawn in; it re-measures when this resizes.',
  },
  {
    name: 'fromRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Element the beam starts from (its centre).',
  },
  {
    name: 'toRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Element the beam ends at (its centre).',
  },
  {
    name: 'curvature',
    type: 'number',
    default: '0',
    description: 'Vertical pull of the curve in px; negative bends it upward.',
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Send the pulse from the end back to the start.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '5',
    description: 'Seconds for one pulse to travel the path.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Seconds before the first pulse starts.',
  },
  {
    name: 'pathColor',
    type: 'string',
    default: "'gray'",
    description: 'Color of the resting track under the pulse.',
  },
  {
    name: 'pathWidth',
    type: 'number',
    default: '2',
    description: 'Stroke width of the track and pulse in px.',
  },
  {
    name: 'pathOpacity',
    type: 'number',
    default: '0.2',
    description: 'Opacity of the resting track.',
  },
  {
    name: 'gradientStartColor',
    type: 'string',
    default: "'#ffaa40'",
    description: 'Leading color of the pulse.',
  },
  {
    name: 'gradientStopColor',
    type: 'string',
    default: "'#9c40ff'",
    description: 'Trailing color of the pulse.',
  },
  {
    name: 'startXOffset / startYOffset',
    type: 'number',
    default: '0',
    description: 'Nudge the start point away from the centre, in px.',
  },
  {
    name: 'endXOffset / endYOffset',
    type: 'number',
    default: '0',
    description: 'Nudge the end point away from the centre, in px.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the SVG overlay.',
  },
]

function Node({
  ref,
  className,
  children,
}: {
  ref: RefObject<HTMLDivElement | null>
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border bg-background text-sm font-medium shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AnimatedBeamPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { gradient, curvature, duration, pathWidth, pathOpacity, reverse } =
    settings.values
  const [gradientStartColor, gradientStopColor] = GRADIENTS[gradient]

  const containerRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const c = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLDivElement>(null)

  const beam = {
    containerRef,
    duration,
    pathWidth,
    pathOpacity,
    reverse,
    gradientStartColor,
    gradientStopColor,
  }

  const usage = toUsageSnippet({
    component: 'AnimatedBeam',
    from: '@/components/shared/animated-beam',
    props: {
      containerRef: '{containerRef}',
      fromRef: '{fromRef}',
      toRef: '{toRef}',
      curvature,
      duration,
      pathWidth,
      pathOpacity,
      reverse,
      gradientStartColor,
      gradientStopColor,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace(/"\{(\w+)\}"/g, '{$1}')

  return (
    <DemoPage
      eyebrow="shared / animated-beam"
      title="Animated Beam"
      description="An SVG path measured between two refs, with a gradient travelling along it. The curve re-measures whenever the container resizes."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Gradient"
            options={GRADIENT_NAMES}
            value={gradient}
            onChange={(value) => settings.set('gradient', value)}
          />
          <DemoSlider
            label="Curvature"
            value={curvature}
            onValueChange={(value) => settings.set('curvature', value)}
            min={0}
            max={120}
            step={5}
            unit="px"
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={1}
            max={10}
            step={0.5}
            unit="s"
          />
          <DemoSlider
            label="Path width"
            value={pathWidth}
            onValueChange={(value) => settings.set('pathWidth', value)}
            min={1}
            max={6}
            unit="px"
          />
          <DemoSlider
            label="Track opacity"
            value={pathOpacity}
            onValueChange={(value) => settings.set('pathOpacity', value)}
            min={0}
            max={1}
            step={0.05}
          />
          <DemoSwitch
            label="Reverse"
            checked={reverse}
            onCheckedChange={(value) => settings.set('reverse', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/animated-beam/'],
        usage,
        props: PROPS,
      }}
    >
      <div
        ref={containerRef}
        className="relative mx-auto flex h-80 w-full max-w-2xl items-center justify-between"
      >
        <div className="flex flex-col justify-between gap-8">
          <Node ref={a}>A</Node>
          <Node ref={b}>B</Node>
          <Node ref={c}>C</Node>
        </div>
        <Node ref={hubRef} className="size-16">
          Hub
        </Node>
        <Node ref={out}>Out</Node>

        <AnimatedBeam {...beam} fromRef={a} toRef={hubRef} curvature={-curvature} />
        <AnimatedBeam {...beam} fromRef={b} toRef={hubRef} />
        <AnimatedBeam {...beam} fromRef={c} toRef={hubRef} curvature={curvature} />
        <AnimatedBeam {...beam} fromRef={hubRef} toRef={out} delay={duration / 3} />
      </div>
    </DemoPage>
  )
}
