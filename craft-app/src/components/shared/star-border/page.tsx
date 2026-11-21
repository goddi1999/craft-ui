import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  StarBorder,
  type StarBorderDirection,
  type StarBorderHover,
  type StarBorderTheme,
} from '@/components/ui/star-border'

const THEMES: readonly StarBorderTheme[] = ['dark', 'light']
const HOVERS: readonly StarBorderHover[] = ['lap', 'brighten', 'reveal', 'none']
const DIRECTIONS: readonly StarBorderDirection[] = ['clockwise', 'counterclockwise']
const COLORS = ['white', 'sky', 'violet', 'amber'] as const

// "white" follows the theme: white on dark, ink on light
const COLOR_VALUES: Record<(typeof COLORS)[number], string | undefined> = {
  white: undefined,
  sky: '#38bdf8',
  violet: '#a78bfa',
  amber: '#fbbf24',
}

const DEFAULTS = {
  label: 'Get started',
  theme: 'dark' as StarBorderTheme,
  color: 'white' as (typeof COLORS)[number],
  hover: 'lap' as StarBorderHover,
  direction: 'clockwise' as StarBorderDirection,
  duration: 4,
  stars: 1,
  trailLength: 0.3,
  thickness: 1,
  radius: 12,
  glow: 0.6,
  sparkle: false,
  clickPulse: true,
}

const COMPONENT_DEFAULTS = {
  theme: 'dark',
  hover: 'lap',
  direction: 'clockwise',
  duration: 4,
  stars: 1,
  trailLength: 0.3,
  thickness: 1,
  radius: 12,
  glow: 0.6,
  sparkle: false,
  clickPulse: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'as',
    type: 'ElementType',
    default: "'button'",
    description: 'Render as a link or any element instead.',
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Surface, text, track and star colours.',
  },
  {
    name: 'color',
    type: 'string',
    description: "Star head colour. Defaults to the theme's light.",
  },
  {
    name: 'trailColor',
    type: 'string',
    description: 'Colour the trail fades into. Defaults to `color`.',
  },
  { name: 'duration', type: 'number', default: '4', description: 'Seconds per lap, at least 0.3.' },
  {
    name: 'direction',
    type: "'clockwise' | 'counterclockwise'",
    default: "'clockwise'",
    description: 'Which way the star travels.',
  },
  {
    name: 'stars',
    type: 'number',
    default: '1',
    description: 'Stars spread evenly around the border, 1–6.',
  },
  {
    name: 'trailLength',
    type: 'number',
    default: '0.3',
    description: 'Trail length as a share of a lap, 0–1.',
  },
  {
    name: 'thickness',
    type: 'number',
    default: '1',
    description: 'Border and star line width in px.',
  },
  {
    name: 'radius',
    type: 'number',
    default: '12',
    description: 'Corner radius in px; the star follows it.',
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.6',
    description: 'Bloom around the head and trail, 0–1.',
  },
  {
    name: 'hover',
    type: "'lap' | 'brighten' | 'reveal' | 'none'",
    default: "'lap'",
    description:
      'lap: one quick extra lap. brighten: more glow. reveal: hidden until hover, starting at the pointer.',
  },
  {
    name: 'sparkle',
    type: 'boolean',
    default: 'false',
    description: 'A four-point glint on the head that sheds dust.',
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'A press sends light both ways from the press point.',
  },
  {
    name: 'backgroundColor / textColor / borderColor',
    type: 'string',
    description: 'Override the theme colours.',
  },
]

export function StarBorderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    label,
    theme,
    color,
    hover,
    direction,
    duration,
    stars,
    trailLength,
    thickness,
    radius,
    glow,
    sparkle,
    clickPulse,
  } = settings.values
  const colorValue = COLOR_VALUES[color]

  const usage = toUsageSnippet({
    component: 'StarBorder',
    from: '@/components/ui/star-border',
    props: {
      theme,
      color: colorValue,
      hover,
      direction,
      duration,
      stars,
      trailLength,
      thickness,
      radius,
      glow,
      sparkle,
      clickPulse,
    },
    defaults: COMPONENT_DEFAULTS,
    children: label,
  })

  return (
    <DemoPage
      eyebrow="ui / star-border"
      title="Star Border"
      description="A button with a star of light running around its border, drawn on a canvas that overhangs the edge for the glow. Hover sends it on a quick lap, a press sends a pulse both ways from where you pressed, and it rests when the page asks for reduced motion."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
          />
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(next) => settings.set('theme', next)}
          />
          <DemoControlGroup
            title="Colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
          />
          <DemoControlGroup
            title="Hover"
            options={HOVERS}
            value={hover}
            onChange={(next) => settings.set('hover', next)}
          />
          <DemoControlGroup
            title="Direction"
            options={DIRECTIONS}
            value={direction}
            onChange={(next) => settings.set('direction', next)}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={1}
            max={12}
            step={0.5}
            unit="s"
          />
          <DemoSlider
            label="Stars"
            value={stars}
            onValueChange={(next) => settings.set('stars', next)}
            min={1}
            max={6}
          />
          <DemoSlider
            label="Trail"
            value={trailLength}
            onValueChange={(next) => settings.set('trailLength', next)}
            min={0}
            max={1}
            step={0.05}
          />
          <DemoSlider
            label="Thickness"
            value={thickness}
            onValueChange={(next) => settings.set('thickness', next)}
            min={0.5}
            max={4}
            step={0.5}
            unit="px"
          />
          <DemoSlider
            label="Radius"
            value={radius}
            onValueChange={(next) => settings.set('radius', next)}
            min={0}
            max={32}
            unit="px"
          />
          <DemoSlider
            label="Glow"
            value={glow}
            onValueChange={(next) => settings.set('glow', next)}
            min={0}
            max={1}
            step={0.05}
          />
          <DemoSwitch
            label="Sparkle"
            checked={sparkle}
            onCheckedChange={(next) => settings.set('sparkle', next)}
          />
          <DemoSwitch
            label="Click pulse"
            checked={clickPulse}
            onCheckedChange={(next) => settings.set('clickPulse', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/star-border/'], usage, props: PROPS }}
    >
      <StarBorder
        theme={theme}
        color={colorValue}
        hover={hover}
        direction={direction}
        duration={duration}
        stars={stars}
        trailLength={trailLength}
        thickness={thickness}
        radius={radius}
        glow={glow}
        sparkle={sparkle}
        clickPulse={clickPulse}
      >
        {label}
      </StarBorder>
    </DemoPage>
  )
}
