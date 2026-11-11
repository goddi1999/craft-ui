import { getAvatarUrls } from '@wq-org/avatars'
import {
  Calendar,
  Camera,
  Cloud,
  Images,
  Mail,
  MapPin,
  Music,
  StickyNote,
} from 'lucide-react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoControlLabel,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AvatarConstellation,
  type AvatarConstellationSatellite,
  type AvatarConstellationTint,
} from '@/components/ui/avatar-constellation'
import { cn } from '@/lib/utils'

const TINTS: AvatarConstellationTint[] = ['lavender', 'mint', 'peach', 'sky', 'rose']

const ALL_AVATARS = getAvatarUrls()
const STEP = Math.max(1, Math.floor(ALL_AVATARS.length / 6))
const AVATARS = Array.from({ length: 6 }, (_, i) => ALL_AVATARS[i * STEP]).filter(Boolean)

const SATELLITES: AvatarConstellationSatellite[] = [
  { id: 'cloud', node: <Cloud className="fill-sky-400/30 text-sky-500" />, x: 34, y: 17, size: 19, depth: 0.7 },
  { id: 'mail', node: <Mail className="text-blue-500" />, x: 78, y: 44, size: 26, depth: 0.35 },
  { id: 'photos', node: <Images className="text-pink-500" />, x: 22, y: 56, size: 26, depth: 0.4 },
  { id: 'notes', node: <StickyNote className="text-amber-500" />, x: 66, y: 28, size: 17, depth: 0.3 },
  { id: 'places', node: <MapPin className="text-emerald-500" />, x: 40, y: 76, size: 14, depth: 0.8 },
  { id: 'calendar', node: <Calendar className="text-red-500" />, x: 64, y: 75, size: 18, depth: 0.6 },
  { id: 'camera', node: <Camera className="text-violet-500" />, x: 12, y: 26, size: 13, depth: 0.9 },
  { id: 'music', node: <Music className="text-orange-500" />, x: 90, y: 74, size: 12, depth: 0.8 },
]

const DEFAULTS = {
  avatarId: AVATARS[0]?.id ?? '',
  tint: 'lavender' as AvatarConstellationTint,
  drift: true,
  parallax: true,
  count: 6,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'center',
    type: '{ src: string; name: string }',
    description: 'The avatar in the middle disc. name becomes its alt text. Required.',
  },
  {
    name: 'satellites',
    type: '{ id, node, x, y, size, depth?, label? }[]',
    description:
      'Tiles around the disc. x, y and size are percentages of the stage; node is any icon or element. Required.',
  },
  { name: 'tint', type: "'lavender' | 'mint' | 'peach' | 'sky' | 'rose'", default: "'lavender'", description: 'Colour of the centre disc, with a light and a dark value.' },
  { name: 'centerSize', type: 'number', default: '38', description: 'Diameter of the centre disc, as a percentage of the stage.' },
  { name: 'drift', type: 'boolean', default: 'true', description: 'Slow, desynced circular drift per tile. Off for reduced motion.' },
  { name: 'parallax', type: 'boolean', default: 'true', description: 'Tiles follow the pointer; higher depth moves more.' },
  { name: 'onCenterClick', type: '() => void', description: 'Called when the avatar is clicked, as the wave starts.' },
  { name: 'header / children', type: 'ReactNode', description: 'Slots above and below the stage.' },
  { name: 'stageClassName', type: 'string', description: 'Classes for the square stage (default max-w-lg).' },
]

export function AvatarConstellationPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { avatarId, tint, drift, parallax, count } = settings.values
  const [run, setRun] = useState(0)
  const [waves, setWaves] = useState(0)

  const avatar = AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0]

  const usage = toUsageSnippet({
    component: 'AvatarConstellation',
    from: '@/components/ui/avatar-constellation',
    props: {
      center: { expression: '{ src: avatar.imageUrl, name: avatar.name }' },
      satellites: { expression: 'satellites' },
      tint,
      drift,
      parallax,
    },
    defaults: { tint: 'lavender', drift: true, parallax: true },
    children: '<h2 className="text-4xl font-semibold">Your space</h2>',
  })

  return (
    <DemoPage
      eyebrow="ui / avatar-constellation"
      title="Avatar Constellation"
      description="A big avatar disc ringed by app tiles. The tiles spring out from behind it, drift in slow circles, lean with the pointer by depth, and pulse outward when you click the avatar."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <div className="flex flex-col gap-2.5">
            <DemoControlLabel>Avatar</DemoControlLabel>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Avatar">
              {AVATARS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.name}
                  aria-pressed={item.id === avatarId}
                  onClick={() => settings.set('avatarId', item.id)}
                  className={cn(
                    'size-11 overflow-hidden rounded-full bg-muted ring-1 ring-border transition-transform active:scale-95',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.id === avatarId && 'ring-2 ring-primary',
                  )}
                >
                  <img src={item.imageUrl} alt="" className="size-full object-contain p-0.5" />
                </button>
              ))}
            </div>
          </div>
          <DemoControlGroup
            title="Centre tint"
            options={TINTS}
            value={tint}
            onChange={(next) => settings.set('tint', next)}
          />
          <DemoSwitch label="Drift" checked={drift} onCheckedChange={(next) => settings.set('drift', next)} />
          <DemoSwitch label="Parallax" checked={parallax} onCheckedChange={(next) => settings.set('parallax', next)} />
          <DemoSlider
            label="Satellites"
            value={count}
            onValueChange={(next) => settings.set('count', next)}
            min={3}
            max={8}
          />
          <DemoAction onClick={() => setRun((n) => n + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/avatar-constellation/'], usage, props: PROPS }}
    >
      <AvatarConstellation
        key={run}
        center={{ src: avatar?.imageUrl ?? '', name: avatar?.name ?? 'Avatar' }}
        satellites={SATELLITES.slice(0, count)}
        tint={tint}
        drift={drift}
        parallax={parallax}
        onCenterClick={() => setWaves((n) => n + 1)}
        header={
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Your space
          </p>
        }
      >
        <h2 className="pb-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl">Everything, in orbit</h2>
        <p className="sr-only" aria-live="polite">{waves > 0 ? `Waved ${waves} times` : ''}</p>
      </AvatarConstellation>
    </DemoPage>
  )
}
