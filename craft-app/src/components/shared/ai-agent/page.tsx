import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BOT_COLOR_NAMES,
  BOT_FACE_NAMES,
  BOT_MOTIONS,
  BOT_SHAPES,
} from '@/components/ui/agent-computer-icon'

import { BotCard, BotPicker, BotRow, FeaturedBot } from './bot-examples'
import { TEAM, WORKERS, type BotSample } from './bot-samples'
import { BotStudio } from './bot-studio'
import { readStudioLook, useStudioUrl, type StudioLook } from './use-studio-url'

const DEFAULT_LOOK: StudioLook = { shape: 'hexagon', face: 'neutral', color: 'pink' }

const DEFAULTS = { size: 208, lookAtCursor: true, animated: true, online: false }

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  shape: 'circle',
  face: 'neutral',
  color: 'blue',
  size: 48,
  online: false,
  animated: true,
  lookAtCursor: false,
}

const union = (values: readonly string[]) => values.map((value) => `'${value}'`).join(' | ')

const PROPS: DemoPropDoc[] = [
  {
    name: 'shape',
    type: union(BOT_SHAPES),
    default: "'circle'",
    description: 'Body silhouette. A change morphs the outline from wherever it is.',
  },
  {
    name: 'face',
    type: union(BOT_FACE_NAMES),
    default: "'neutral'",
    description: 'Expression: where the eyes sit, their size and tilt. A change morphs the eyes.',
  },
  {
    name: 'color',
    type: `${union(BOT_COLOR_NAMES)} | string`,
    default: "'blue'",
    description:
      'One flat fill: the twelve studio colours (ink to cream), twelve more (coral to sand), or any CSS colour.',
  },
  { name: 'size', type: 'number', default: '48', description: 'Width and height in pixels.' },
  {
    name: 'motion',
    type: union(BOT_MOTIONS),
    default: "'idle'",
    description:
      'A Move state from the studio. A new value plays once on top of the shape and face, then the bot settles back to idle. With reduced motion it shows one still pose for the same time.',
  },
  {
    name: 'motionKey',
    type: 'string | number',
    description: 'Change it to play the same motion again.',
  },
  {
    name: 'onMotionEnd',
    type: '(motion: BotMotion) => void',
    description: 'Called when a Move state has played and the bot is idle again.',
  },
  {
    name: 'online',
    type: 'boolean',
    default: 'false',
    description: 'A green dot at the lower right, with a ring cut out of the body around it.',
  },
  {
    name: 'animated',
    type: 'boolean',
    default: 'true',
    description: 'Idle life: the gaze wanders, the body breathes, the eyes blink. Off keeps it still between changes.',
  },
  {
    name: 'lookAtCursor',
    type: 'boolean',
    default: 'false',
    description: 'The eyes turn towards the pointer; half a viewport away turns them fully.',
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description:
      'One still frame: no idle life, instant changes, and motion held at its most telling pose. Use it for thumbnails.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Accessible name. Without it the bot is decorative and hidden from screen readers.',
  },
  {
    name: '...props',
    type: "ComponentProps<'svg'>",
    description: 'Any other SVG attribute — className, style, event handlers.',
  },
]

export function AgentComputerIconPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, lookAtCursor, animated, online } = settings.values
  const [look, setLook] = useState(() => readStudioLook(DEFAULT_LOOK))
  const [picked, setPicked] = useState('')
  useStudioUrl(look)

  const changeLook = (next: StudioLook) => {
    setLook(next)
    setPicked('')
  }
  const load = (bot: BotSample) => {
    setLook({ shape: bot.shape, face: bot.face, color: bot.color })
    setPicked(bot.name)
  }

  const usage = toUsageSnippet({
    component: 'AgentComputerIcon',
    from: '@/components/ui/agent-computer-icon',
    props: { ...look, size, online, animated, lookAtCursor },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / agent-computer-icon"
      title="Agent Bot"
      description="Bot avatars in the Grok Bots studio style: eight shapes, sixteen faces and twenty-four flat colours, with two pill eyes cut clean through the body. Shapes and faces morph into each other, the gaze drifts and blinks while idle, it can follow your cursor, and it plays all fourteen of the studio's moves. The address keeps the bot, so a link opens the same one. Adapted from grokbots.ai."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={64}
            max={320}
            step={8}
            unit="px"
          />
          <DemoSwitch
            label="Look at cursor"
            checked={lookAtCursor}
            onCheckedChange={(next) => settings.set('lookAtCursor', next)}
          />
          <DemoSwitch
            label="Animated"
            checked={animated}
            onCheckedChange={(next) => settings.set('animated', next)}
          />
          <DemoSwitch
            label="Online"
            checked={online}
            onCheckedChange={(next) => settings.set('online', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/agent-computer-icon/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-14">
        <BotStudio
          look={look}
          onLookChange={changeLook}
          size={size}
          lookAtCursor={lookAtCursor}
          animated={animated}
          online={online}
        />

        <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
          <BotPicker value={picked} onValueChange={load} />
          <FeaturedBot bot={WORKERS[0]} />
        </div>

        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {WORKERS.map((bot) => (
            <BotCard key={bot.name} bot={bot} />
          ))}
        </div>

        <ul className="w-full max-w-3xl divide-y rounded-2xl border bg-card px-4">
          {[...TEAM.slice(1), WORKERS[1]].map((bot) => (
            <BotRow key={bot.name} bot={bot} />
          ))}
        </ul>
      </div>
    </DemoPage>
  )
}
