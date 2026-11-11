import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  ScrollDrivenVideoMasking,
} from '@/components/ui/scroll-driven-video-masking'

const VIDEOS = {
  Skateboarder: SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  Astley: 'https://assets.codepen.io/605876/astley-short.mp4',
} as const

type VideoName = keyof typeof VIDEOS

const VIDEO_NAMES = Object.keys(VIDEOS) as VideoName[]

const DEFAULTS = {
  video: 'Skateboarder' as VideoName,
  blend: true,
  debug: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  src: SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  blend: true,
  debug: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'src',
    type: 'string',
    default: 'skateboarder clip',
    description: 'Video revealed through the scribbles and the text.',
  },
  { name: 'eyebrow', type: 'string', default: "'All-New'", description: 'Small red label above the title.' },
  { name: 'title', type: 'string', default: "'CSS Pro'", description: 'Hero title.' },
  {
    name: 'subtitle',
    type: 'string',
    default: "'Scroll-driven video masks'",
    description: 'Hero subtitle.',
  },
  {
    name: 'lines',
    type: 'readonly string[]',
    description: 'Lines punched out of the mask, each fading in on its own view timeline.',
  },
  { name: 'outro', type: 'string', default: "'Rad.'", description: 'Word that blurs in as the footer arrives.' },
  {
    name: 'note',
    type: 'string',
    default: "'Pure CSS · view() timelines'",
    description: 'Small print under the outro.',
  },
  {
    name: 'blend',
    type: 'boolean',
    default: 'true',
    description: 'Blend the mask with the video. Off shows the raw mask layer.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Outline the mask layer and the scribble boxes.',
  },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function ScrollDrivenVideoMaskingPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { video, blend, debug } = settings.values
  const src = VIDEOS[video]

  const usage = toUsageSnippet({
    component: 'ScrollDrivenVideoMasking',
    from: '@/components/ui/scroll-driven-video-masking',
    props: { src, blend, debug },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / scroll-driven-video-masking"
      title="Scroll-Driven Video Masking"
      description={
        <>
          Scroll the page: a sticky video plays behind a blended mask layer,
          view() timelines draw thick scribbles and punch text through it, so
          the footage shows only where the ink is. Ported from{' '}
          <a href="https://codepen.io/jh3y" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      // Full width, outside the card: `position: sticky` and `view()`
      // timelines both resolve against the nearest scroll container, and the
      // card's `overflow: hidden` would become that container and freeze them.
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Video"
            options={VIDEO_NAMES}
            value={video}
            onChange={(value) => settings.set('video', value)}
          />
          <DemoSwitch
            label="mix-blend-mode"
            checked={blend}
            onCheckedChange={(value) => settings.set('blend', value)}
          />
          <DemoSwitch
            label="Debug outlines"
            checked={debug}
            onCheckedChange={(value) => settings.set('debug', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/scroll-driven-video-masking/'],
        usage,
        props: PROPS,
      }}
    >
      <ScrollDrivenVideoMasking src={src} blend={blend} debug={debug} />
    </DemoPage>
  )
}
