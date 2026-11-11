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

import { CurvedImage } from './CurvedImage'
import { CurvedScrollbar } from './CurvedScrollbar'
import { CurvedScrollbarContent } from './CurvedScrollbarContent'
import { CurvedScrollbarFooter } from './CurvedScrollbarFooter'
import { CurvedScrollbarHeader } from './CurvedScrollbarHeader'
import { CurvedScrollbarViewport } from './CurvedScrollbarViewport'
import { CurvedText } from './CurvedText'
import { CurvedTitle } from './CurvedTitle'
import type {
  CurvedScrollbarSize,
  CurvedScrollbarTheme,
} from './curved-scrollbar.types'

const DEMO_PARAGRAPHS = [
  'Interfaces feel better when the invisible parts are cared for: the friction in a scroll, the way a thumb follows content, and the rhythm between motion and reading.',
  'This panel keeps the browser scroll behavior intact while drawing a custom SVG track over the edge. The result is decorative, but the interaction still belongs to the native scroller.',
  'The geometry is recalculated when the panel changes size, so the curve remains attached to the corners even when the example is resized on desktop.',
  'Reusable UI should expose stable controls instead of leaking the original demo script. Radius, stroke, color, opacity, content, and slots are props; measurement stays inside the hook.',
  'Scroll to the end and the thumb rounds the lower corner before settling into the footer.',
]

const [HERO, FIRST, SECOND] = [DEMO_IMAGES[0], DEMO_IMAGES[4], DEMO_IMAGES[8]]

const THEMES: CurvedScrollbarTheme[] = ['system', 'light', 'dark']
const SIZES: CurvedScrollbarSize[] = ['sm', 'default', 'lg']

const COLORS = ['#f85922', '#3b82f6', '#22c55e', '#a855f7'] as const
type Color = (typeof COLORS)[number]

const COLOR_LABELS: Record<Color, string> = {
  '#f85922': 'Orange',
  '#3b82f6': 'Blue',
  '#22c55e': 'Green',
  '#a855f7': 'Purple',
}

const DEFAULTS = {
  theme: 'system' as CurvedScrollbarTheme,
  size: 'default' as CurvedScrollbarSize,
  color: '#f85922' as Color,
  radius: 32,
  stroke: 5,
  thumbSize: 70,
  trackAlpha: 0,
  enabled: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'A CurvedScrollbarViewport holding the header, content and footer.',
  },
  {
    name: 'theme',
    type: "'system' | 'light' | 'dark'",
    default: "'system'",
    description: 'Color scheme of the panel; system follows the OS setting.',
  },
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Panel preset: 360×500, 420×560 or 500×680. Never wider than its parent.',
  },
  {
    name: 'width',
    type: 'number | string',
    description: 'Overrides the size preset width; numbers are px.',
  },
  {
    name: 'height',
    type: 'number | string',
    description: 'Overrides the size preset height; numbers are px.',
  },
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Draw the curved bar and hide the native scrollbar.',
  },
  {
    name: 'radius',
    type: 'number',
    default: '32',
    description: 'Corner radius in px — the bar bends around it.',
  },
  {
    name: 'stroke',
    type: 'number',
    default: '5',
    description: 'Thickness of the thumb and track in px.',
  },
  {
    name: 'thumbSize',
    type: 'number',
    default: '70',
    description: 'Length of the thumb along the curve in px.',
  },
  {
    name: 'color',
    type: 'string',
    default: "'#f85922'",
    description: 'Thumb color, any CSS color.',
  },
  {
    name: 'thumbAlpha',
    type: 'number',
    default: '0.9',
    description: 'Thumb opacity, 0–1.',
  },
  {
    name: 'trackAlpha',
    type: 'number',
    default: '0',
    description: 'Track opacity, 0–1. 0 hides the track and shows only the thumb.',
  },
  {
    name: 'scrollPadding',
    type: 'number',
    default: '60',
    description: 'Space in px above the header and below the footer.',
  },
  {
    name: 'inset',
    type: 'number',
    default: '6',
    description: 'Gap in px between the bar and the panel edge.',
  },
  {
    name: 'trail',
    type: 'number',
    default: '20',
    description: 'How far in px the bar runs along the top and bottom edges.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root section.',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    description: 'Inline styles, merged over the CSS variables.',
  },
]

export function CurvedScrollbarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { theme, size, color, radius, stroke, thumbSize, trackAlpha, enabled } =
    settings.values

  const usage = toUsageSnippet({
    component: 'CurvedScrollbar',
    from: '@/components/shared/curved-scrollbar',
    imports: [
      'CurvedScrollbarViewport',
      'CurvedScrollbarHeader',
      'CurvedScrollbarContent',
      'CurvedScrollbarFooter',
      'CurvedTitle',
      'CurvedText',
      'CurvedImage',
    ],
    props: { theme, size, color, radius, stroke, thumbSize, trackAlpha, enabled },
    defaults: DEFAULTS,
    children: `<CurvedScrollbarViewport>
  <CurvedScrollbarHeader>
    <CurvedTitle>023: curved scroller.</CurvedTitle>
    <CurvedText variant="intro">Intro copy</CurvedText>
    <CurvedImage placement="hero" src="/hero.jpg" alt="" />
  </CurvedScrollbarHeader>
  <CurvedScrollbarContent>
    <CurvedText>Body copy</CurvedText>
  </CurvedScrollbarContent>
  <CurvedScrollbarFooter>
    <CurvedText variant="footer">The Craft of UI</CurvedText>
  </CurvedScrollbarFooter>
</CurvedScrollbarViewport>`,
  })

  return (
    <DemoPage
      eyebrow="shared / curved-scrollbar"
      title="Curved Scrollbar"
      description="Scroll the panel: an SVG thumb driven by a scroll-timeline bends around the rounded corners while the native scroller does the work. Inspired by Jhey Tompkins."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(value) => settings.set('theme', value)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Color"
            options={COLORS}
            value={color}
            onChange={(value) => settings.set('color', value)}
            format={(value) => COLOR_LABELS[value]}
          />
          <DemoSlider
            label="Radius"
            value={radius}
            onValueChange={(value) => settings.set('radius', value)}
            min={12}
            max={64}
            unit="px"
          />
          <DemoSlider
            label="Stroke"
            value={stroke}
            onValueChange={(value) => settings.set('stroke', value)}
            min={2}
            max={10}
            unit="px"
          />
          <DemoSlider
            label="Thumb size"
            value={thumbSize}
            onValueChange={(value) => settings.set('thumbSize', value)}
            min={30}
            max={160}
            step={5}
            unit="px"
          />
          <DemoSlider
            label="Track opacity"
            value={trackAlpha}
            onValueChange={(value) => settings.set('trackAlpha', value)}
            min={0}
            max={0.5}
            step={0.05}
          />
          <DemoSwitch
            label="Curved bar"
            checked={enabled}
            onCheckedChange={(value) => settings.set('enabled', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/curved-scrollbar/'],
        usage,
        props: PROPS,
      }}
    >
      <CurvedScrollbar
        theme={theme}
        size={size}
        color={color}
        radius={radius}
        stroke={stroke}
        thumbSize={thumbSize}
        trackAlpha={trackAlpha}
        enabled={enabled}
      >
        <CurvedScrollbarViewport>
          <CurvedScrollbarHeader>
            <CurvedTitle>023: curved scroller.</CurvedTitle>
            <CurvedText variant="intro">
              Jhey Tompkins inspired interaction, ported as a reusable shared
              component.
            </CurvedText>
            <CurvedImage placement="hero" src={HERO.src} alt={HERO.alt} />
          </CurvedScrollbarHeader>

          <CurvedScrollbarContent>
            {DEMO_PARAGRAPHS.slice(0, 3).map((paragraph) => (
              <CurvedText key={paragraph}>{paragraph}</CurvedText>
            ))}
            <CurvedImage src={FIRST.src} alt={FIRST.alt} loading="lazy" />
            {DEMO_PARAGRAPHS.slice(3).map((paragraph) => (
              <CurvedText key={paragraph}>{paragraph}</CurvedText>
            ))}
            <CurvedImage src={SECOND.src} alt={SECOND.alt} loading="lazy" />
            <CurvedText>
              Find out how to do things like this and more by subscribing.
            </CurvedText>
          </CurvedScrollbarContent>

          <CurvedScrollbarFooter>
            <CurvedText variant="footer">The Craft of UI</CurvedText>
          </CurvedScrollbarFooter>
        </CurvedScrollbarViewport>
      </CurvedScrollbar>
    </DemoPage>
  )
}
