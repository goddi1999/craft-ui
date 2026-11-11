import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AgentComputerIcon,
  type AgentComputerIconAnimation,
  type AgentComputerIconState,
  type AgentComputerIconVariant,
} from '@/components/ui/agent-computer-icon'

const STATE_HINTS: Record<AgentComputerIconState, string> = {
  default: 'Idle — soft blink and gentle glance.',
  loading: 'Eyes scan while the body floats.',
  waiting: 'Slow look-around, anticipatory.',
  success: 'Quick lift, eyes perk upward.',
  failure: 'Short shake, eyes compress.',
}
const STATES = Object.keys(STATE_HINTS) as AgentComputerIconState[]

/** `auto` leaves `animation` unset so the state picks it. */
const ANIMATIONS: (AgentComputerIconAnimation | 'auto')[] = [
  'auto',
  'idle',
  'looking',
  'thinking',
  'blink',
  'perk',
  'shake',
  'bouncing',
  'hover-float',
  'none',
]

const VARIANTS: (AgentComputerIconVariant | 'none')[] = [
  'none',
  'default',
  'dark',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'orange',
  'pink',
  'darkblue',
]

const DEFAULTS = {
  state: 'loading' as AgentComputerIconState,
  animation: 'auto' as (typeof ANIMATIONS)[number],
  variant: 'none' as (typeof VARIANTS)[number],
  size: 120,
  strokeWidth: 1.4,
  animated: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  state: 'default',
  size: 24,
  strokeWidth: 1.6,
  animated: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'state',
    type: "'default' | 'loading' | 'success' | 'failure' | 'waiting'",
    default: "'default'",
    description: 'Semantic agent state. Picks the animation unless you override it.',
  },
  {
    name: 'animation',
    type: "'none' | 'idle' | 'looking' | 'thinking' | 'blink' | 'perk' | 'shake' | 'bouncing' | 'hover-float'",
    description: 'Override the animation independently of state.',
  },
  {
    name: 'animated',
    type: 'boolean',
    default: 'true',
    description: 'Master switch — false keeps the icon still whatever the state.',
  },
  {
    name: 'variant',
    type: "'default' | 'dark' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'orange' | 'pink' | 'darkblue'",
    description: 'Color from the app palette. Overrides color when set.',
  },
  {
    name: 'color',
    type: 'string',
    default: "'currentColor'",
    description: 'Stroke and eye color when no variant is set.',
  },
  {
    name: 'size',
    type: 'number',
    default: '24',
    description: 'Width and height in pixels.',
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '1.6',
    description: 'Line weight of the screen and base, in 24px viewBox units.',
  },
  {
    name: '...props',
    type: 'SVGProps<SVGSVGElement>',
    description: 'Any other SVG attribute — className, style, aria-*…',
  },
]

export function AgentComputerIconPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { state, animation, variant, size, strokeWidth, animated } =
    settings.values
  const [replayKey, setReplayKey] = useState(0)

  const animationProp = animation === 'auto' ? undefined : animation
  const variantProp = variant === 'none' ? undefined : variant

  const handleStateChange = (value: AgentComputerIconState) => {
    settings.set('state', value)
    settings.set('animation', 'auto')
  }

  const usage = toUsageSnippet({
    component: 'AgentComputerIcon',
    from: '@/components/ui/agent-computer-icon',
    props: {
      state,
      animation: animationProp,
      variant: variantProp,
      size,
      strokeWidth,
      animated,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / agent-computer-icon"
      title="Agent Computer Icon"
      description="A 24px monitor face with a GSAP-driven state machine. The eyes hold the personality, the screen breathes, the base grounds. Motion targets data-part groups so it stays stable across refactors."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="State"
            options={STATES}
            value={state}
            onChange={handleStateChange}
          />
          <DemoControlGroup
            title="Animation"
            options={ANIMATIONS}
            value={animation}
            onChange={(value) => settings.set('animation', value)}
          />
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(value) => settings.set('variant', value)}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={24}
            max={160}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Stroke width"
            value={strokeWidth}
            onValueChange={(value) => settings.set('strokeWidth', value)}
            min={0.8}
            max={2.4}
            step={0.1}
          />
          <DemoSwitch
            label="Animated"
            checked={animated}
            onCheckedChange={(value) => settings.set('animated', value)}
          />
          <DemoAction onClick={() => setReplayKey((key) => key + 1)}>
            Replay
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/agent-computer-icon/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-6 text-foreground">
        <div className="grid size-56 place-items-center rounded-full bg-muted/50">
          <AgentComputerIcon
            key={`${state}-${animation}-${replayKey}`}
            state={state}
            animation={animationProp}
            variant={variantProp}
            size={size}
            strokeWidth={strokeWidth}
            animated={animated}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {animated ? STATE_HINTS[state] : 'Still — animated is off.'}
        </p>
      </div>
    </DemoPage>
  )
}
