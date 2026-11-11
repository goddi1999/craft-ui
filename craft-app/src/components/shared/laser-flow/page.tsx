import { useRef } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'

import { LaserFlow } from './LaserFlow'

const COLORS = {
  lilac: '#CF9EFF',
  blue: '#3847ff',
  cyan: '#22d3ee',
  amber: '#ffb224',
  pink: '#ff5ca8',
} as const
type ColorName = keyof typeof COLORS

const COLOR_NAMES = Object.keys(COLORS) as ColorName[]
const REVEAL_PHOTO = DEMO_IMAGES[0]

const DEFAULTS = {
  color: 'lilac' as ColorName,
  intensity: 1.8,
  beamPosition: 60,
  beamWidth: 1.5,
  speed: 1.5,
  fog: 0.2,
  dust: 1.6,
  surface: true,
  mouseInteraction: true,
  reveal: false,
  paused: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  color: '#3847ff',
  intensity: 1.8,
  beamPosition: 0.6,
  beamWidth: 1.5,
  speed: 1.5,
  fog: 0.2,
  dust: 1.6,
  mouseInteraction: true,
  paused: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'surfaceRef',
    type: 'RefObject<HTMLElement | null>',
    description: 'Element the beam pours onto; its rounded top edge catches the light.',
  },
  {
    name: 'surfaceLevel',
    type: 'number',
    default: '1',
    description: 'Fallback floor height (0–1 of the canvas) when there is no surfaceRef.',
  },
  {
    name: 'beamPosition',
    type: 'number',
    default: '0.6',
    description: 'Horizontal position of the beam, 0–1 across the canvas.',
  },
  {
    name: 'color',
    type: 'string',
    default: "'#3847ff'",
    description: 'Hex colour the beam, fog and dust are tinted from.',
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.8',
    description: 'Overall brightness.',
  },
  {
    name: 'beamWidth / flare / spread',
    type: 'number',
    default: '1.5',
    description: 'Width of the beam, its glow, and how far the splash fans out.',
  },
  {
    name: 'spill',
    type: 'number',
    default: '1',
    description: 'How much light runs over the surface edge.',
  },
  {
    name: 'fog',
    type: 'number',
    default: '0.2',
    description: 'Amount of haze around the beam.',
  },
  {
    name: 'dust',
    type: 'number',
    default: '1.6',
    description: 'Amount of floating dust motes.',
  },
  {
    name: 'streaks / pulse',
    type: 'number',
    default: '1.5',
    description: 'Falling light streaks and the beam’s pulse strength.',
  },
  {
    name: 'dots',
    type: 'number',
    default: '1',
    description: 'Sparkle dots on the surface.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.5',
    description: 'Animation speed multiplier.',
  },
  {
    name: 'seed',
    type: 'number',
    default: '3',
    description: 'Noise seed.',
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'A lens follows the pointer and stirs the flow.',
  },
  {
    name: 'revealImage',
    type: 'string',
    description: 'Image (CORS-enabled) revealed under the pointer lens.',
  },
  {
    name: 'revealRadius',
    type: 'number',
    default: '220',
    description: 'Radius of the reveal lens in px.',
  },
  {
    name: 'revealOpacity',
    type: 'number',
    default: '0.6',
    description: 'Opacity of the revealed image, 0–1.',
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Play the pour-in intro on mount.',
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Blend for dark or light backgrounds.',
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freeze the animation.',
  },
  {
    name: 'dpr',
    type: 'number',
    description: 'Device pixel ratio cap; defaults to the screen’s, at most 2.',
  },
]

export function LaserFlowPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    color,
    intensity,
    beamPosition,
    beamWidth,
    speed,
    fog,
    dust,
    surface,
    mouseInteraction,
    reveal,
    paused,
  } = settings.values
  const surfaceRef = useRef<HTMLDivElement>(null)

  const usage = toUsageSnippet({
    component: 'LaserFlow',
    from: '@/components/shared/laser-flow',
    props: {
      surfaceRef: surface ? 'SURFACE' : undefined,
      color: COLORS[color],
      intensity,
      beamPosition: beamPosition / 100,
      beamWidth,
      speed,
      fog,
      dust,
      mouseInteraction,
      revealImage: reveal ? '/photo.jpg' : undefined,
      paused,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace('surfaceRef="SURFACE"', 'surfaceRef={surfaceRef}')

  return (
    <DemoPage
      eyebrow="shared / laser-flow"
      title="Laser flow"
      description="A WebGL beam that pours down onto a surface, spilling light, fog, and dust. Move the pointer over it to stir the flow."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Color"
            options={COLOR_NAMES}
            value={color}
            onChange={(value) => settings.set('color', value)}
          />
          <DemoSlider
            label="Intensity"
            value={intensity}
            onValueChange={(value) => settings.set('intensity', value)}
            min={0.2}
            max={4}
            step={0.1}
          />
          <DemoSlider
            label="Beam position"
            value={beamPosition}
            onValueChange={(value) => settings.set('beamPosition', value)}
            min={10}
            max={90}
            unit="%"
          />
          <DemoSlider
            label="Beam width"
            value={beamWidth}
            onValueChange={(value) => settings.set('beamWidth', value)}
            min={0.2}
            max={5}
            step={0.1}
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(value) => settings.set('speed', value)}
            min={0}
            max={4}
            step={0.1}
          />
          <DemoSlider
            label="Fog"
            value={fog}
            onValueChange={(value) => settings.set('fog', value)}
            min={0}
            max={2}
            step={0.05}
          />
          <DemoSlider
            label="Dust"
            value={dust}
            onValueChange={(value) => settings.set('dust', value)}
            min={0}
            max={4}
            step={0.1}
          />
          <DemoSwitch
            label="Surface"
            checked={surface}
            onCheckedChange={(value) => settings.set('surface', value)}
          />
          <DemoSwitch
            label="Pointer interaction"
            checked={mouseInteraction}
            onCheckedChange={(value) => settings.set('mouseInteraction', value)}
          />
          <DemoSwitch
            label="Reveal photo under pointer"
            checked={reveal}
            onCheckedChange={(value) => settings.set('reveal', value)}
          />
          <DemoSwitch
            label="Paused"
            checked={paused}
            onCheckedChange={(value) => settings.set('paused', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/laser-flow/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="relative h-[28rem] w-full overflow-hidden bg-black sm:h-[32rem]">
        <LaserFlow
          surfaceRef={surface ? surfaceRef : undefined}
          color={COLORS[color]}
          intensity={intensity}
          beamPosition={beamPosition / 100}
          beamWidth={beamWidth}
          speed={speed}
          fog={fog}
          dust={dust}
          mouseInteraction={mouseInteraction}
          revealImage={reveal ? REVEAL_PHOTO.src : undefined}
          paused={paused}
        />
        {surface ? (
          <div
            ref={surfaceRef}
            className="absolute inset-x-[12%] bottom-0 h-[38%] rounded-t-2xl border border-white/15 bg-[#060010]"
          />
        ) : null}
      </div>
    </DemoPage>
  )
}
