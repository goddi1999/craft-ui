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

import { MultiplayerMask } from './MultiplayerMask'
import { MultiplayerMaskItem } from './MultiplayerMaskItem'
import { MultiplayerMaskList } from './MultiplayerMaskList'
import { MultiplayerMaskOverflow } from './MultiplayerMaskOverflow'
import type {
  MultiplayerMaskDirection,
  MultiplayerMaskLabel,
  MultiplayerMaskMember,
  MultiplayerMaskSize,
  MultiplayerMaskTheme,
} from './multiplayer-mask.types'

const NAMES = [
  'Jhey',
  'Kelly',
  'Elias',
  'Drew',
  'Maxine',
  'Matt',
  'Vicky',
  'Marcos',
  'Constance',
  'Jill',
]

const MEMBERS: MultiplayerMaskMember[] = NAMES.map((name, index) => ({
  name,
  avatar: DEMO_IMAGES[index].src,
}))

const SIZES: MultiplayerMaskSize[] = ['sm', 'default', 'lg']
const DIRECTIONS: MultiplayerMaskDirection[] = ['ltr', 'rtl']
const LABELS: MultiplayerMaskLabel[] = ['ring', 'above', 'none']
const THEMES: MultiplayerMaskTheme[] = ['system', 'light', 'dark']

const DEFAULTS = {
  count: 4,
  size: 'default' as MultiplayerMaskSize,
  direction: 'ltr' as MultiplayerMaskDirection,
  label: 'ring' as MultiplayerMaskLabel,
  theme: 'system' as MultiplayerMaskTheme,
  glow: false,
  debug: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Avatar diameter and how tightly the stack packs.',
  },
  {
    name: 'direction',
    type: "'ltr' | 'rtl'",
    default: "'ltr'",
    description: 'Which neighbour overlaps — decides the side the mask hole is cut on.',
  },
  {
    name: 'label',
    type: "'ring' | 'above' | 'none'",
    default: "'ring'",
    description: 'How a member name appears on hover: around the avatar, over it, or not at all.',
  },
  {
    name: 'theme',
    type: "'system' | 'light' | 'dark'",
    default: "'system'",
    description: 'Color scheme of the stack; system follows the page.',
  },
  {
    name: 'glow',
    type: 'boolean',
    default: 'false',
    description: 'Animated hue-cycling glow behind the stack.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Overlay the grid column and masked item guides.',
  },
  {
    name: 'movement',
    type: 'number',
    default: '0.72',
    description: 'Portion of the avatar height that lifts out of the mask, 0–1.',
  },
  {
    name: 'transition',
    type: 'number',
    default: '0.18',
    description: 'Hover transition duration in seconds.',
  },
  {
    name: 'ringOffset',
    type: 'number',
    default: '-3',
    description: 'Where the ring text starts along the circle, in ch.',
  },
  {
    name: 'border',
    type: 'number',
    description: 'Gap in px cut between an avatar and its neighbour. Set by size.',
  },
  {
    name: 'column',
    type: 'number',
    description: 'Grid column width in px — smaller packs tighter. Set by size.',
  },
  {
    name: 'MultiplayerMaskItem name',
    type: 'string',
    description: 'Member name, shown on hover and used for the initials. Required.',
  },
  {
    name: 'MultiplayerMaskItem avatar',
    type: 'string',
    description: 'Image URL. Without it the item shows `fallback` or initials.',
  },
  {
    name: 'MultiplayerMaskOverflow label',
    type: 'string',
    default: "'View more'",
    description: 'Accessible name of the trailing "more" button.',
  },
]

export function MultiplayerMaskPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, size, direction, label, theme, glow, debug } = settings.values
  const members = MEMBERS.slice(0, count)

  const usage = toUsageSnippet({
    component: 'MultiplayerMask',
    from: '@/components/shared/multiplayer-mask',
    imports: [
      'MultiplayerMaskList',
      'MultiplayerMaskItem',
      'MultiplayerMaskOverflow',
    ],
    props: { size, direction, label, theme, glow, debug },
    defaults: DEFAULTS,
    children: `<MultiplayerMaskList>
  {members.map((member) => (
    <MultiplayerMaskItem key={member.name} name={member.name} avatar={member.avatar} />
  ))}
</MultiplayerMaskList>
<MultiplayerMaskOverflow label="View all members" />`,
  })

  return (
    <DemoPage
      eyebrow="shared / multiplayer-mask"
      title="Multiplayer masking"
      description={
        <>
          An overlapping presence stack built from narrow grid columns, where
          each avatar carves a radial-gradient hole out of its neighbour so
          hovering lifts it cleanly out of the stack. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/yyLmmMW" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Members"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={2}
            max={MEMBERS.length}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Direction"
            options={DIRECTIONS}
            value={direction}
            onChange={(value) => settings.set('direction', value)}
          />
          <DemoControlGroup
            title="Label"
            options={LABELS}
            value={label}
            onChange={(value) => settings.set('label', value)}
          />
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(value) => settings.set('theme', value)}
          />
          <DemoSwitch
            label="Glow"
            checked={glow}
            onCheckedChange={(value) => settings.set('glow', value)}
          />
          <DemoSwitch
            label="Debug guides"
            checked={debug}
            onCheckedChange={(value) => settings.set('debug', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/multiplayer-mask/'],
        usage,
        props: PROPS,
      }}
    >
      <div data-slot="multiplayer-mask-stage" data-theme={theme}>
        <MultiplayerMask
          size={size}
          direction={direction}
          label={label}
          theme={theme}
          glow={glow}
          debug={debug}
        >
          <MultiplayerMaskList>
            {members.map((member) => (
              <MultiplayerMaskItem
                key={member.name}
                name={member.name}
                avatar={member.avatar}
              />
            ))}
          </MultiplayerMaskList>
          <MultiplayerMaskOverflow label={`View all ${MEMBERS.length} members`} />
        </MultiplayerMask>
      </div>
    </DemoPage>
  )
}
