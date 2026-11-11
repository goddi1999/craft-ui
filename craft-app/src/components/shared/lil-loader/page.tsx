import {
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LilLoader } from '@/components/ui/lil-loader'

const DEFAULTS = {
  size: 120,
  speed: 3.5,
  bars: 10,
  label: 'Loading',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: 'number',
    default: '120',
    description: 'Width and height of the square frame in px.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '3.5',
    description: 'Seconds for one bar to travel the full stack.',
  },
  {
    name: 'bars',
    type: 'number',
    default: '10',
    description: 'Number of glowing rings in the stack.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Loading'",
    description: 'Status text announced to screen readers.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the frame.',
  },
]

export function LilLoaderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, speed, bars, label } = settings.values

  const usage = toUsageSnippet({
    component: 'LilLoader',
    from: '@/components/ui/lil-loader',
    props: { size, speed, bars, label: label || undefined },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / lil-loader"
      title="Lil Loader"
      description={
        <>
          A tiny framed loader — a stack of glowing rings that rise, swell and
          drift from pink to amber, built in pure CSS. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/PoMEwvx" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={64}
            max={200}
            unit="px"
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(value) => settings.set('speed', value)}
            min={1}
            max={8}
            step={0.1}
            unit="s"
          />
          <DemoSlider
            label="Bars"
            value={bars}
            onValueChange={(value) => settings.set('bars', value)}
            min={3}
            max={20}
          />
          <DemoTextField
            label="Screen reader label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={32}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/lil-loader/'],
        usage,
        props: PROPS,
      }}
    >
      <LilLoader
        size={size}
        speed={speed}
        bars={bars}
        label={label || DEFAULTS.label}
      />
    </DemoPage>
  )
}
