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
  HEART_COLORS,
  Heart,
  HeartButton,
  type HeartColorKey,
  type HeartVariantProps,
} from '@/components/ui/heart'

type HeartSize = NonNullable<HeartVariantProps['size']>

const STYLES = ['beat', 'fill'] as const
type HeartStyle = (typeof STYLES)[number]

const STYLE_LABELS: Record<HeartStyle, string> = {
  beat: 'Heart · CSS beat',
  fill: 'HeartButton · GSAP fill',
}

const COLORS = HEART_COLORS.map((color) => color.key)
const SIZES: HeartSize[] = ['default', 'lg', 'xl', '2xl']

const DEFAULTS = {
  style: 'beat' as HeartStyle,
  color: 'violet' as HeartColorKey,
  size: '2xl' as HeartSize,
  liked: true,
  interactive: true,
  pixelSize: 72,
  defaultLiked: false,
}

const HEART_DEFAULTS = {
  variant: 'violet',
  size: 'default',
  liked: true,
  interactive: false,
}

const HEART_BUTTON_DEFAULTS = { size: 72, defaultLiked: false }

const HEART_PROPS: DemoPropDoc[] = [
  {
    name: 'variant',
    type: "'violet' | 'indigo' | 'blue' | 'darkblue' | 'cyan' | 'teal' | 'green' | 'lime' | 'orange' | 'pink' | 'default' | 'secondary' | 'destructive' | 'outline'",
    default: "'violet'",
    description: 'Color of the heart.',
  },
  {
    name: 'color',
    type: 'HeartVariantProps[\'variant\']',
    description: 'Alias of variant; wins when both are set.',
  },
  {
    name: 'size',
    type: "'default' | 'lg' | 'xl' | '2xl'",
    default: "'default'",
    description: 'Icon size: 16, 20, 24 or 32px.',
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Render as a like button that toggles itself and beats on click.',
  },
  {
    name: 'liked',
    type: 'boolean',
    default: 'true',
    description: 'Filled state — the starting state when interactive.',
  },
  {
    name: 'triggerAnimation',
    type: 'string | number | boolean',
    description: 'Change this value to replay the beat.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the svg.',
  },
]

const HEART_BUTTON_PROPS: DemoPropDoc[] = [
  {
    name: 'oklchVal',
    type: 'string',
    description: "OKLCH channels without the function, e.g. '0.76 0.18 305'. HEART_COLORS has ten.",
  },
  {
    name: 'size',
    type: 'number',
    default: '72',
    description: 'Heart width and height in px.',
  },
  {
    name: 'defaultLiked',
    type: 'boolean',
    default: 'false',
    description: 'Start filled.',
  },
  {
    name: 'onChange',
    type: '(liked: boolean) => void',
    description: 'Called with the new state after each toggle.',
  },
]

export function HeartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { style, color, size, liked, interactive, pixelSize, defaultLiked } =
    settings.values
  const [beatCount, setBeatCount] = useState(0)
  const oklch = HEART_COLORS.find((entry) => entry.key === color)?.oklch ?? ''
  const isBeat = style === 'beat'

  const usage = isBeat
    ? toUsageSnippet({
        component: 'Heart',
        from: '@/components/ui/heart',
        props: { variant: color, size, interactive, liked },
        defaults: HEART_DEFAULTS,
      })
    : toUsageSnippet({
        component: 'HeartButton',
        from: '@/components/ui/heart',
        props: { oklchVal: oklch, size: pixelSize, defaultLiked },
        defaults: HEART_BUTTON_DEFAULTS,
      })

  const handleReplay = () => setBeatCount((count) => count + 1)

  return (
    <DemoPage
      eyebrow="ui / heart"
      title="Heart"
      description="Two like hearts that share one palette: a CSS beat primitive with typed color variants, and a GSAP button that fills from the center with a particle burst. Click the heart."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Component"
            options={STYLES}
            value={style}
            onChange={(value) => settings.set('style', value)}
            format={(value) => STYLE_LABELS[value]}
          />
          <DemoControlGroup
            title="Color"
            options={COLORS}
            value={color}
            onChange={(value) => settings.set('color', value)}
          />
          {isBeat ? (
            <>
              <DemoControlGroup
                title="Size"
                options={SIZES}
                value={size}
                onChange={(value) => settings.set('size', value)}
              />
              <DemoSwitch
                label="Interactive"
                checked={interactive}
                onCheckedChange={(value) => settings.set('interactive', value)}
              />
              <DemoSwitch
                label="Liked"
                checked={liked}
                onCheckedChange={(value) => settings.set('liked', value)}
              />
              <DemoAction onClick={handleReplay}>Replay beat</DemoAction>
            </>
          ) : (
            <>
              <DemoSlider
                label="Size"
                value={pixelSize}
                onValueChange={(value) => settings.set('pixelSize', value)}
                min={24}
                max={120}
                step={4}
                unit="px"
              />
              <DemoSwitch
                label="Start liked"
                checked={defaultLiked}
                onCheckedChange={(value) => settings.set('defaultLiked', value)}
              />
            </>
          )}
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/heart/'],
        usage,
        props: isBeat ? HEART_PROPS : HEART_BUTTON_PROPS,
      }}
    >
      {isBeat ? (
        <Heart
          key={`${interactive}-${liked}`}
          variant={color}
          size={size}
          interactive={interactive}
          liked={liked}
          triggerAnimation={beatCount}
        />
      ) : (
        <HeartButton
          key={String(defaultLiked)}
          oklchVal={oklch}
          size={pixelSize}
          defaultLiked={defaultLiked}
        />
      )}
    </DemoPage>
  )
}
