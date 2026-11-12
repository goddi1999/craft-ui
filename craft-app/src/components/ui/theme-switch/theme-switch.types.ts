/** Names the page transition the caller runs; the icon leans the way it travels. */
export type ThemeSwitchVariant = 'reveal' | 'eclipse' | 'split' | 'rise'

export type ThemeSwitchTheme = 'light' | 'dark'

/**
 * A secondary button that swaps a sun and moon and reports the next theme. It never applies
 * the theme itself: run the change in `onThemeChange`, usually inside a view transition that
 * starts from the button.
 */
export type ThemeSwitchProps = {
  /** The current appearance. Drives the icon and `aria-pressed`. */
  theme: ThemeSwitchTheme
  /** The page transition the caller runs, which also sets the icon nudge. @default 'reveal' */
  variant?: ThemeSwitchVariant
  /** Called on press with the next theme, the variant and the button to start a transition from. */
  onThemeChange: (
    next: ThemeSwitchTheme,
    variant: ThemeSwitchVariant,
    trigger: HTMLElement,
  ) => void
  /** Overrides the accessible name. @default 'Switch to dark mode' or 'Switch to light mode' */
  label?: string
  /** Hides the text for a 38px square button. @default false */
  iconOnly?: boolean
  className?: string
}
