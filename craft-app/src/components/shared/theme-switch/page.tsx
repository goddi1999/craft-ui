import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  ThemeSwitch,
  type ThemeSwitchTheme,
  type ThemeSwitchVariant,
} from '@/components/ui/theme-switch'

const VARIANTS: readonly ThemeSwitchVariant[] = ['reveal', 'eclipse', 'split', 'rise']

const DEFAULTS = {
  variant: 'reveal' as ThemeSwitchVariant,
  iconOnly: false,
  pageTransition: true,
}

const COMPONENT_DEFAULTS = { variant: 'reveal', iconOnly: false }

// the page transition belongs to the caller; this is one way to run all four
const TRANSITION_MS = 520
const TRANSITION_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
// the new snapshot is clipped in over the old one, so the default crossfade is switched off
const TRANSITION_CSS = `
:root[data-theme-transition]::view-transition-old(root),
:root[data-theme-transition]::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
`

/** Where the new appearance starts and ends, as clip-path frames over the whole page. */
function clipFrames(variant: ThemeSwitchVariant, next: ThemeSwitchTheme, trigger: HTMLElement) {
  const width = window.innerWidth
  const height = window.innerHeight
  const rect = trigger.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  switch (variant) {
    case 'reveal': {
      const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
      return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
    }
    case 'eclipse': {
      // a disc that covers the page slides across from the side the icon leans away from
      const radius = Math.hypot(width, height) / 2
      const start = width / 2 + (next === 'dark' ? 2 : -2) * radius
      return [`circle(${radius}px at ${start}px 50%)`, `circle(${radius}px at ${width / 2}px 50%)`]
    }
    case 'split':
      return ['inset(0 50% 0 50%)', 'inset(0 0 0 0)']
    case 'rise':
      return ['inset(100% 0 0 0)', 'inset(0 0 0 0)']
  }
}

function runThemeTransition(
  apply: () => void,
  variant: ThemeSwitchVariant,
  next: ThemeSwitchTheme,
  trigger: HTMLElement,
) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) {
    apply()
    return
  }
  const root = document.documentElement
  const frames = clipFrames(variant, next, trigger)
  root.dataset.themeTransition = variant
  const transition = document.startViewTransition(() => flushSync(apply))
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: frames },
        {
          duration: TRANSITION_MS,
          easing: TRANSITION_EASE,
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => {})
  transition.finished
    .catch(() => {})
    .finally(() => {
      delete root.dataset.themeTransition
    })
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'theme',
    type: "'light' | 'dark'",
    description: 'The current appearance. Drives the icon and `aria-pressed`.',
  },
  {
    name: 'onThemeChange',
    type: '(next, variant, trigger: HTMLElement) => void',
    description:
      'Called on press with the next theme, the variant and the button. Apply the theme here, usually inside `document.startViewTransition`, starting from the button.',
  },
  {
    name: 'variant',
    type: "'reveal' | 'eclipse' | 'split' | 'rise'",
    default: "'reveal'",
    description: 'Names the page transition your handler runs and sets a matching icon nudge.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Switch to dark mode' | 'Switch to light mode'",
    description: 'Overrides the accessible name.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    default: 'false',
    description: 'Hides the text for a 38px square button, for narrow headers.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the button.' },
]

export function ThemeSwitchPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const settings = useDemoSettings(DEFAULTS)
  const { variant, iconOnly, pageTransition } = settings.values
  const theme: ThemeSwitchTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  const switchTheme = (next: ThemeSwitchTheme, kind: ThemeSwitchVariant, trigger: HTMLElement) => {
    const apply = () => setTheme(next)
    if (pageTransition) runThemeTransition(apply, kind, next, trigger)
    else apply()
  }

  const usage = toUsageSnippet({
    component: 'ThemeSwitch',
    from: '@/components/ui/theme-switch',
    props: {
      theme: { expression: 'theme' },
      onThemeChange: { expression: 'switchTheme' },
      variant,
      iconOnly,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / theme-switch"
      title="Theme Switch"
      description="A sun and moon button that reports the next theme instead of applying it, so the page can run its own transition: reveal grows a circle from the button, eclipse slides a disc across, split opens from a centre seam and rise lifts in from the bottom. The icons swap as one turn and lean the way the page moves. This demo drives the gallery's theme through next-themes. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSwitch
            label="Icon only"
            checked={iconOnly}
            onCheckedChange={(next) => settings.set('iconOnly', next)}
          />
          <DemoSwitch
            label="Page transition"
            checked={pageTransition}
            onCheckedChange={(next) => settings.set('pageTransition', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/theme-switch/'], usage, props: PROPS }}
    >
      <style>{TRANSITION_CSS}</style>
      <div className="flex flex-col items-center gap-4">
        <ThemeSwitch
          theme={theme}
          variant={variant}
          iconOnly={iconOnly}
          onThemeChange={switchTheme}
        />
        <p className="text-sm text-muted-foreground">
          {theme === 'dark' ? 'Dark' : 'Light'} appearance
        </p>
      </div>
    </DemoPage>
  )
}
