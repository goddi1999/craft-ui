import { getAvatarUrls } from '@wq-org/avatars'
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
import { AvatarOrbit, type AvatarOrbitMember } from '@/components/ui/avatar-orbit'
import { FluidOrb } from '@/components/ui/fluid-orb'

// hex, not theme tokens: the orb shader mixes the colour itself and needs raw RGB
const COLORS = ['#1A73F2', '#FF3B30', '#F75001', '#34C759'] as const
type OrbColor = (typeof COLORS)[number]
const COLOR_NAMES: Record<OrbColor, string> = {
  '#1A73F2': 'Blue',
  '#FF3B30': 'Red',
  '#F75001': 'Orange',
  '#34C759': 'Green',
}

const DEFAULTS = {
  count: 6,
  radius: 32,
  avatarSize: 26,
  bubbles: true,
  color: '#1A73F2' as OrbColor,
}

const COMPONENT_DEFAULTS = { radius: 32, avatarSize: 26, startAngle: -90, bubbleTone: 'blue' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'members',
    type: 'AvatarOrbitMember[]',
    description:
      '{ id, src, name, bubble?, bubbleSide?, angle?, radius? } — placed evenly on the ring; angle / radius override one member.',
  },
  { name: 'center', type: 'ReactNode', description: 'Rendered in the middle and sized to fill the ring.' },
  { name: 'radius', type: 'number', default: '32', description: 'Ring radius, as a percentage of the stage width.' },
  { name: 'startAngle', type: 'number', default: '-90', description: 'Angle of the first member in degrees (-90 = top).' },
  { name: 'avatarSize', type: 'number', default: '26', description: 'Avatar diameter, as a percentage of the stage width.' },
  {
    name: 'bubbleTone',
    type: "'blue' | 'neutral' | 'primary'",
    default: "'blue'",
    description: 'Bubble colour. Blue reads the --avatar-orbit-bubble CSS variable.',
  },
]

const BUBBLES = ['Hey Siri', 'Hey Siri', 'Hey Siri', 'Hi there', 'Hey Siri', 'Hello', 'Hey Siri', 'Hi!']

// spread across the whole set so the ring has a mix of faces
const pool = getAvatarUrls()
const MEMBERS: AvatarOrbitMember[] = BUBBLES.map((_, index) => {
  const avatar = pool[Math.floor((index * pool.length) / BUBBLES.length)]
  return { id: avatar.id, src: avatar.imageUrl, name: avatar.name }
})

export function AvatarOrbitPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, radius, avatarSize, bubbles, color } = settings.values
  const [run, setRun] = useState(0)

  // bubbles on every other member so the ring stays airy
  const members = MEMBERS.slice(0, count).map((member, index) => ({
    ...member,
    bubble: bubbles && index % 2 === 0 ? BUBBLES[index] : undefined,
  }))

  const usage = toUsageSnippet({
    component: 'AvatarOrbit',
    from: '@/components/ui/avatar-orbit',
    props: {
      members: { expression: 'members' },
      center: { expression: '<FluidOrb className="size-full!" />' },
      radius,
      avatarSize,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / avatar-orbit"
      title="Avatar Orbit"
      description="Avatars ring a glowing centre, inspired by Apple's Siri graphic. They spring out from the middle in turn, drift on their own and lift on hover, while speech bubbles pop in beside them. Holds still under reduced motion."
      previewClassName="py-10"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Avatars"
            value={count}
            onValueChange={(next) => settings.set('count', next)}
            min={3}
            max={8}
          />
          <DemoSlider
            label="Radius"
            value={radius}
            onValueChange={(next) => settings.set('radius', next)}
            min={24}
            max={38}
            unit="%"
          />
          <DemoSlider
            label="Avatar size"
            value={avatarSize}
            onValueChange={(next) => settings.set('avatarSize', next)}
            min={18}
            max={34}
            unit="%"
          />
          <DemoSwitch
            label="Speech bubbles"
            checked={bubbles}
            onCheckedChange={(next) => settings.set('bubbles', next)}
          />
          <DemoControlGroup
            title="Orb colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
            format={(option) => (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full ring-1 ring-foreground/10"
                  style={{ backgroundColor: option }}
                />
                {COLOR_NAMES[option]}
              </span>
            )}
          />
          <DemoAction onClick={() => setRun((current) => current + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/avatar-orbit/'], usage, props: PROPS }}
    >
      <AvatarOrbit
        key={run}
        members={members}
        radius={radius}
        avatarSize={avatarSize}
        center={<FluidOrb size={320} color={color} className="size-full!" />}
        className="max-w-md"
      />
    </DemoPage>
  )
}
