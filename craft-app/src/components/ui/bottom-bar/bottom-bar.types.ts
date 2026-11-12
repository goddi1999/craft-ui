import type { ComponentProps, ReactNode } from 'react'

export type BottomBarItem = {
  value: string
  /** Shown next to the icon while the tab is picked, and always read out. */
  label: string
  /** Sized to 22px. Pass it bare, e.g. `<House />`. */
  icon: ReactNode
}

export type BottomBarProps = Omit<ComponentProps<'nav'>, 'children' | 'defaultValue' | 'onChange'> & {
  items: readonly BottomBarItem[]
  /** Controlled picked tab. Use together with `onValueChange`. */
  value?: string
  /** Picked tab when uncontrolled. @default items[0].value */
  defaultValue?: string
  /** Called when the user picks a tab. */
  onValueChange?: (value: string) => void
}
