import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DEFAULT_EMOJI_DATA,
  EmojiReaction,
  type EmojiData,
  type EmojiReactionAlign,
  type EmojiReactionSize,
} from '@/components/ui/emoji-reaction'

const SIZES: EmojiReactionSize[] = ['sm', 'md', 'lg']
const ALIGNS: EmojiReactionAlign[] = ['left', 'center', 'right']
const SETS = ['faces', 'hype'] as const
type EmojiSet = (typeof SETS)[number]
const TRIGGERS = ['button', 'message'] as const
type TriggerKind = (typeof TRIGGERS)[number]

const HYPE_DATA: EmojiData = {
  baseUrl: DEFAULT_EMOJI_DATA.baseUrl,
  emojis: {
    'thumbs-up': 'thumbs-up_1f44d.png',
    'red-heart': 'red-heart_2764-fe0f.png',
    fire: 'fire_1f525.png',
    'party-popper': 'party-popper_1f389.png',
    'clapping-hands': 'clapping-hands_1f44f.png',
  },
}

const DATA: Record<EmojiSet, EmojiData> = { faces: DEFAULT_EMOJI_DATA, hype: HYPE_DATA }

const DEFAULTS = {
  size: 'md' as EmojiReactionSize,
  align: 'center' as EmojiReactionAlign,
  set: 'faces' as EmojiSet,
  trigger: 'button' as TriggerKind,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'emojis',
    type: 'string[]',
    default: '5 default faces',
    description: 'Emoji names in the bar, hyphenated as on Emojipedia. Anything past the defaults needs emojiData.',
  },
  {
    name: 'emojiData',
    type: 'EmojiData',
    default: 'DEFAULT_EMOJI_DATA',
    description: 'Name → image file map joined onto baseUrl. Images load from the Emojipedia CDN by default.',
  },
  {
    name: 'onReact',
    type: '(name: string) => void',
    description: 'Called with the emoji name on every pick, including each repeat while held down.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Scale of the button, the bar, and the emoji that fly up.',
  },
  {
    name: 'align',
    type: "'left' | 'center' | 'right'",
    default: "'center'",
    description: 'Which edge of the bar lines up with the trigger; it still shifts inward near the viewport edge.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Use your own child as the trigger, so the bar can hang off a message, card or image.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Start with the bar open, without moving focus into it.',
  },
]

const MESSAGE = 'Shipped the new onboarding flow today!'

export function EmojiReactionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, align, set, trigger } = settings.values
  const [picks, setPicks] = useState<{ last: string | null; count: number }>({ last: null, count: 0 })

  const isMessage = trigger === 'message'
  const data = DATA[set]

  const handleReact = (name: string) => {
    setPicks((current) => ({ last: name, count: current.count + 1 }))
  }

  const usage = toUsageSnippet({
    component: 'EmojiReaction',
    from: '@/components/ui/emoji-reaction',
    props: {
      size,
      align,
      emojis: set === 'hype' ? { expression: 'Object.keys(hypeData.emojis)' } : undefined,
      emojiData: set === 'hype' ? { expression: 'hypeData' } : undefined,
      asChild: isMessage || undefined,
      onReact: { expression: '(name) => console.log(name)' },
    },
    defaults: { size: 'md', align: 'center' },
    children: isMessage ? `<button className="rounded-2xl bg-muted px-4 py-3">${MESSAGE}</button>` : undefined,
  })

  return (
    <DemoPage
      eyebrow="ui / emoji-reaction"
      title="Emoji Reaction"
      description="A tapback-style reaction button. Click it (or press and drag straight onto an emoji) to pick one, and copies stream up off it, drifting apart and blurring as they climb. Hold an emoji to keep them coming; arrow keys move along the bar and Escape closes it."
      previewClassName="min-h-[26rem] items-end pb-12"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoControlGroup
            title="Align"
            options={ALIGNS}
            value={align}
            onChange={(next) => settings.set('align', next)}
          />
          <DemoControlGroup
            title="Emoji set"
            options={SETS}
            value={set}
            onChange={(next) => settings.set('set', next)}
          />
          <DemoControlGroup
            title="Trigger"
            options={TRIGGERS}
            value={trigger}
            onChange={(next) => settings.set('trigger', next)}
            format={(option) => (option === 'button' ? 'Button' : 'Message (asChild)')}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/emoji-reaction/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-6">
        <EmojiReaction
          // a new set or trigger starts fresh, so the last pick is always in the current map
          key={`${set}-${trigger}`}
          size={size}
          align={align}
          emojis={Object.keys(data.emojis)}
          emojiData={data}
          asChild={isMessage}
          defaultOpen
          onReact={handleReact}
        >
          {isMessage ? (
            <button
              type="button"
              className="max-w-64 rounded-2xl bg-muted px-4 py-3 text-left text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {MESSAGE}
            </button>
          ) : null}
        </EmojiReaction>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {picks.last
            ? `${picks.count} reaction${picks.count === 1 ? '' : 's'} · last ${picks.last.replaceAll('-', ' ')}`
            : 'Pick an emoji to throw it up the screen.'}
        </p>
      </div>
    </DemoPage>
  )
}
