import type { ComponentProps } from 'react'

/** The six colours a miniature app preview is painted with. */
export type ThemePalette = {
  sidebar: string
  panel: string
  border: string
  strong: string
  muted: string
  tile: string
}

export type ThemeOption = {
  value: string
  label: string
  colors: ThemePalette
}

export type ThemeSelectorProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  /** Themes to show, each with a palette for its preview. @default DEFAULT_THEMES */
  themes?: ThemeOption[]
  /** Controlled value. `null` keeps it controlled with nothing picked yet. */
  value?: string | null
  /** Starting theme when uncontrolled. Falls back to the first theme. */
  defaultValue?: string
  /** Fires with the new value when a different theme is picked. */
  onChange?: (value: string) => void
  /** Show each theme's label under its preview. @default true */
  labels?: boolean
  /** Block selection and dim every preview. @default false */
  disabled?: boolean
  /** Classes for each preview button, for sizing. Everything inside scales with it. */
  itemClassName?: string
}
