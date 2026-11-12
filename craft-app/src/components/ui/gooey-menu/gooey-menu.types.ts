import type { ComponentProps } from 'react'

/**
 * A dark pill that drops a liquid panel of options. Arrow keys move the highlight, Enter or
 * Space picks, Escape and a click outside close it.
 */
export type GooeyMenuProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
  /**
   * The options, top to bottom. Each label is also its key, so keep them unique.
   * @default ['Home', 'About', 'Projects', 'Contact', 'Book a call', 'Follow us']
   */
  options?: readonly string[]
  /** The selected option, when controlled. */
  value?: string
  /** The selected option on mount, when uncontrolled. @default options[0] */
  defaultValue?: string
  /** Controlled open state. */
  open?: boolean
  /** Open state on mount, when uncontrolled. @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called with the option and its index when one is picked. */
  onSelect?: (option: string, index: number) => void
  /** Width of the pill and the panel in px. @default 306 */
  width?: number
  /** Accessible name of the trigger; the selected option is read as its value. @default 'Menu' */
  label?: string
}
