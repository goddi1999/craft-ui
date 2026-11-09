import type { ReactNode } from 'react'

export type MorphingDisclosureItem = {
  /** Summary text. */
  title: string
  /** Panel body revealed when open. */
  content: ReactNode
  /** Leading glyph in the summary row. */
  icon?: ReactNode
}

export type MorphingDisclosureBorderStyle = 'border' | 'pseudo'

export type MorphingDisclosureProps = {
  /** Disclosures to render; only one can be open at a time. @default MORPHING_DISCLOSURE_ITEMS */
  items?: readonly MorphingDisclosureItem[]
  /** Index open on first render. */
  defaultOpenIndex?: number
  /** Draw separators between closed rows. @default true */
  bordered?: boolean
  /** Push siblings away from the open row so it detaches into its own card. @default true */
  translate?: boolean
  /** Give the open row a high-contrast border. @default true */
  highlight?: boolean
  /** Lift the open row towards the viewer in 3D and fade the rest. @default false */
  depth?: boolean
  /** How the outline is drawn — real borders or pseudo-element rings. @default 'border' */
  borderStyle?: MorphingDisclosureBorderStyle
  /** Border width in px. @default 2 */
  borderWidth?: number
  /** Content blur while closed, in px. @default 4 */
  blur?: number
  /** Content opacity while closed. @default 0.4 */
  contentOpacity?: number
  /** Content vertical offset while closed, in rem. @default 1 */
  contentOffset?: number
  /** Gap opened around the active row, in rem. @default 1.5 */
  gap?: number
  /** Z distance for the depth effect, in rem. @default 0.5 */
  depthAmount?: number
  /** Animation speed multiplier. @default 1 */
  speed?: number
  /** Extra classes for the root element. */
  className?: string
}
