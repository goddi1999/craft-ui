import { useTheme } from 'next-themes'
import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DEFAULT_THEMES,
  ThemeSelector,
  type ThemeOption,
} from '@/components/ui/theme-selector'

const EXTRA_THEMES: ThemeOption[] = [
  {
    value: 'dim',
    label: 'Dim',
    colors: {
      sidebar: '#22262E',
      panel: '#1A1D23',
      border: 'transparent',
      strong: '#4B5260',
      muted: '#2E333D',
      tile: '#262A32',
    },
  },
  {
    value: 'sepia',
    label: 'Sepia',
    colors: {
      sidebar: '#F6F0E4',
      panel: '#FBF7EF',
      border: 'rgba(60, 40, 10, 0.08)',
      strong: '#D9CBB0',
      muted: '#EBE1CE',
      tile: '#F1E9DA',
    },
  },
]

const THEME_SETS = ['two', 'four'] as const
const THEME_SET_LABELS: Record<(typeof THEME_SETS)[number], string> = {
  two: 'Light & dark',
  four: 'Four',
}
const THEME_SET_OPTIONS: Record<(typeof THEME_SETS)[number], ThemeOption[]> = {
  two: DEFAULT_THEMES,
  four: [...DEFAULT_THEMES, ...EXTRA_THEMES],
}

// the extra palettes have no app theme of their own, so they drive the nearest one
const APP_MODE: Record<string, string> = {
  dark: 'dark',
  light: 'light',
  dim: 'dark',
  sepia: 'light',
}

const SIZES = ['sm', 'md', 'lg'] as const
const SIZE_CLASS: Record<(typeof SIZES)[number], string | undefined> = {
  sm: 'w-28',
  md: undefined,
  lg: 'w-52',
}

const DEFAULTS = {
  themeSet: 'two' as (typeof THEME_SETS)[number],
  size: 'md' as (typeof SIZES)[number],
  labels: true,
  disabled: false,
  driveApp: true,
}

const COMPONENT_DEFAULTS = {
  labels: true,
  disabled: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'themes',
    type: 'ThemeOption[]',
    default: 'DEFAULT_THEMES',
    description:
      'Themes to show, each with a value, a label and a six-colour palette for its preview. Defaults to dark and light.',
  },
  {
    name: 'value',
    type: 'string | null',
    description:
      'Controlled selection. Pass null until the theme is known (e.g. before hydration) so nothing is selected yet.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Starting theme when uncontrolled. Falls back to the first theme.',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    description: 'Fires with the new value when a different theme is picked.',
  },
  {
    name: 'labels',
    type: 'boolean',
    default: 'true',
    description: "Shows each theme's label under its preview, brightened on the selected one.",
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Blocks selection and dims every preview.',
  },
  {
    name: 'itemClassName',
    type: 'string',
    description:
      'Classes for each preview, for sizing. Each is w-40 at 4:3 by default, and everything inside scales with it.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the row that wraps the previews.' },
]

export function ThemeSelectorPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [picked, setPicked] = useState('dark')
  const settings = useDemoSettings(DEFAULTS)
  const { themeSet, size, labels, disabled, driveApp } = settings.values

  const themes = THEME_SET_OPTIONS[themeSet]
  const isListed = themes.some((theme) => theme.value === picked)
  const localValue = isListed ? picked : themes[0].value
  // the app theme wins, unless the picked palette already maps onto it
  const appValue = resolvedTheme
    ? isListed && APP_MODE[picked] === resolvedTheme
      ? picked
      : resolvedTheme
    : null
  const value = driveApp ? appValue : localValue

  const handleChange = (next: string) => {
    setPicked(next)
    if (driveApp) setTheme(APP_MODE[next] ?? next)
  }

  const usage = toUsageSnippet({
    component: 'ThemeSelector',
    from: '@/components/ui/theme-selector',
    props: {
      themes: themeSet === 'four' ? { expression: 'themes' } : undefined,
      value: { expression: 'theme' },
      onChange: { expression: 'setTheme' },
      labels,
      disabled,
      itemClassName: SIZE_CLASS[size],
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / theme-selector"
      title="Theme Selector"
      description="A row of miniature app previews, one per theme, with a ring that marks the one you pick. Hover shows a faint ring; arrow keys move between themes and select as they go, Home and End jump to the ends."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Themes"
            options={THEME_SETS}
            value={themeSet}
            onChange={(next) => settings.set('themeSet', next)}
            format={(option) => THEME_SET_LABELS[option]}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSwitch
            label="Drive app theme"
            checked={driveApp}
            onCheckedChange={(next) => settings.set('driveApp', next)}
          />
          <DemoSwitch
            label="Labels"
            checked={labels}
            onCheckedChange={(next) => settings.set('labels', next)}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/theme-selector/'], usage, props: PROPS }}
    >
      <div className="flex max-w-full min-w-0 flex-col gap-4 rounded-[22px] border bg-background px-5 py-4 font-runde">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold tracking-[-0.01em] text-foreground">Theme</p>
          <p className="text-[13px] font-medium text-muted-foreground">
            Pick how the interface looks.
          </p>
        </div>
        <ThemeSelector
          themes={themes}
          value={value}
          onChange={handleChange}
          labels={labels}
          disabled={disabled}
          itemClassName={SIZE_CLASS[size]}
        />
      </div>
    </DemoPage>
  )
}
