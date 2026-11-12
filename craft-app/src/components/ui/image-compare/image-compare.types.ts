import type { ReactNode } from 'react'

export type ImageCompareOrientation = 'horizontal' | 'vertical'

/**
 * Before and after, split by a divider. Drag anywhere to move it: the handle follows 1:1,
 * rubber-bands past the edges and stays where it is released. A press on the image springs the
 * divider there; on touch the press waits for a sideways drag so the page still scrolls. Arrow
 * keys step 1% (Shift for 10%), Home and End reveal one side fully, and a double-click on the
 * handle springs it back to the middle.
 */
export type ImageCompareProps = {
  /** The original, shown on the left (or top). Pass an image with its own alt text; it is sized to cover the frame. */
  before: ReactNode
  /** The result, shown on the right (or bottom). */
  after: ReactNode
  /** Where the divider sits, in percent from the left (or top), when controlled. */
  position?: number
  /** Where the divider starts, when uncontrolled. @default 50 */
  defaultPosition?: number
  onPositionChange?: (position: number) => void
  /** Vertical stacks the images top and bottom. Changing it swings the divider a quarter turn. @default 'horizontal' */
  orientation?: ImageCompareOrientation
  /** Captions over each side. They fade as the divider reaches them; false hides them. @default ['Before', 'After'] */
  labels?: [string, string] | false
  /** Accessible name of the divider. @default 'Before and after' */
  label?: string
  /** Frame proportions, as a CSS aspect-ratio. @default '3 / 2' */
  aspectRatio?: string
  className?: string
}

/** Frame size, and the width and height of the before and after captions. */
export type Metrics = { w: number; h: number; bw: number; bh: number; aw: number; ah: number }

export type Drag = {
  pointer: number
  /** Offset between the pointer and the line when the handle was grabbed, in percent. */
  grab: number
  /** True when the press landed on the photo, so the divider springs to it. */
  press: boolean
  started: boolean
  x: number
  y: number
  /** The last unclamped position, in percent. */
  raw: number
}
