import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CssSpriteScrubbing } from '@/components/ui/css-sprite-scrubbing'

const DEFAULTS = {
  title: 'CSS Pro',
  titleEyebrow: 'All-New',
  play: false,
  steps: true,
  scrubHeightVh: 300,
  transitionSeconds: 0,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'frameCount',
    type: 'number',
    default: '65',
    description: 'Number of frames in the sequence, indexed from 0.',
  },
  {
    name: 'frameUrl',
    type: 'string',
    default: 'AirPods CodePen CDN template',
    description: 'URL template; `${i}` is replaced by the frame index.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'CSS Pro'",
    description: 'Main sticky title that scales away as you scroll.',
  },
  {
    name: 'titleEyebrow',
    type: 'string',
    default: "'All-New'",
    description: 'Small label above the title.',
  },
  {
    name: 'subtitle',
    type: 'string | string[]',
    default: "['Sprite Animation.', 'Now scrubbed.']",
    description: 'Sticky subtitle lines revealed at the end of the scrub.',
  },
  {
    name: 'play',
    type: 'boolean',
    default: 'false',
    description: 'Loop the sequence on its own instead of scroll-scrubbing.',
  },
  {
    name: 'steps',
    type: 'boolean',
    default: 'true',
    description: 'Snap to whole frames while scrubbing instead of sliding between them.',
  },
  {
    name: 'scrubHeightVh',
    type: 'number',
    default: '300',
    description: 'Scroll length of the scrub section, in viewport heights × 100.',
  },
  {
    name: 'transitionSeconds',
    type: 'number',
    default: '0',
    description: 'Seconds to ease between frames — smooths fast scrolling.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Optional content below the scrub section.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root.',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    description: 'Inline styles for the root.',
  },
]

export function CssSpriteScrubbingPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, titleEyebrow, play, steps, scrubHeightVh, transitionSeconds } =
    settings.values

  const usage = toUsageSnippet({
    component: 'CssSpriteScrubbing',
    from: '@/components/ui/css-sprite-scrubbing',
    props: {
      title: title || undefined,
      titleEyebrow,
      play,
      steps,
      scrubHeightVh,
      transitionSeconds,
    },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / css-sprite-scrubbing"
      title="CSS Sprite Scrubbing"
      description={
        <>
          Scroll the page: a view-timeline scrubs a 65-frame image sequence
          through CSS custom properties. Ported from{' '}
          <a href="https://codepen.io/jh3y" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(value) => settings.set('title', value)}
            maxLength={16}
          />
          <DemoTextField
            label="Eyebrow"
            value={titleEyebrow}
            onValueChange={(value) => settings.set('titleEyebrow', value)}
            maxLength={24}
          />
          <DemoSlider
            label="Scroll length"
            value={scrubHeightVh}
            onValueChange={(value) => settings.set('scrubHeightVh', value)}
            min={200}
            max={600}
            step={50}
            unit="vh"
          />
          <DemoSlider
            label="Frame easing"
            value={transitionSeconds}
            onValueChange={(value) => settings.set('transitionSeconds', value)}
            min={0}
            max={1}
            step={0.05}
            unit="s"
          />
          <DemoSwitch
            label="Autoplay"
            checked={play}
            onCheckedChange={(value) => settings.set('play', value)}
          />
          <DemoSwitch
            label="Stepped"
            checked={steps}
            onCheckedChange={(value) => settings.set('steps', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/css-sprite-scrubbing/'],
        usage,
        props: PROPS,
      }}
    >
      <CssSpriteScrubbing
        title={title || undefined}
        titleEyebrow={titleEyebrow}
        play={play}
        steps={steps}
        scrubHeightVh={scrubHeightVh}
        transitionSeconds={transitionSeconds}
      />
    </DemoPage>
  )
}
