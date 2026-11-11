import {
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import { ScrollDrivenGooeyIsland } from '@/components/ui/scroll-driven-gooey-island'

const PHOTOS = [0, 4, 9, 11] as const

const DEFAULTS = {
  name: 'Alex Rivera.',
  photo: 0 as (typeof PHOTOS)[number],
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  name: 'Your Name.',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'name',
    type: 'string',
    default: "'Your Name.'",
    description: 'Display name under the avatar; it shrinks into the header as you scroll.',
  },
  {
    name: 'avatarSrc',
    type: 'string',
    default: 'jh3y headshot',
    description: 'Avatar image URL, cropped to a circle.',
  },
  {
    name: 'avatarAlt',
    type: 'string',
    default: "'Your avatar'",
    description: 'Alt text for the avatar.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: 'settings list',
    description: 'Content that scrolls under the sticky header.',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    description: 'Inline styles. Set `--sdgi-frame-height` to size the frame (default 100svh).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function ScrollDrivenGooeyIslandPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { name, photo } = settings.values
  const avatar = DEMO_IMAGES[photo]

  const usage = toUsageSnippet({
    component: 'ScrollDrivenGooeyIsland',
    from: '@/components/ui/scroll-driven-gooey-island',
    props: { name, avatarSrc: avatar.src },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / scroll-driven-gooey-island"
      title="Scroll-Driven Gooey Island"
      description={
        <>
          A sticky Dynamic Island header that gooey-morphs the avatar into the
          pill as you scroll inside the frame. Ported from{' '}
          <a href="https://codepen.io/jh3y" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Name"
            value={name}
            onValueChange={(value) => settings.set('name', value)}
            maxLength={16}
          />
          <DemoControlGroup
            title="Avatar"
            options={PHOTOS}
            value={photo}
            onChange={(value) => settings.set('photo', value)}
            format={(value) => `Photo ${PHOTOS.indexOf(value) + 1}`}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/scroll-driven-gooey-island/'],
        usage,
        props: PROPS,
      }}
    >
      <ScrollDrivenGooeyIsland
        name={name || undefined}
        avatarSrc={avatar.src}
        avatarAlt={avatar.alt}
        style={{ ['--sdgi-frame-height' as string]: '36rem' }}
      />
    </DemoPage>
  )
}
