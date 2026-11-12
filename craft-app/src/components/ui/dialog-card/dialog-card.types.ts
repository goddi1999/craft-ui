import type { ComponentProps, ReactNode } from 'react'

/**
 * A card for browsable items such as projects, listings or posts. With `details` the whole card
 * opens and grows into a quick look dialog: the surface, photo and copy travel on one spring while
 * the details settle in beneath them, and Escape or the close button morphs it back.
 */
export type DialogCardProps = Omit<
  ComponentProps<'article'>,
  'title' | 'ref' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Heading of the card. In the quick look it becomes the dialog's title. */
  title: string
  /** One or two lines under the title. Its line length is kept in the quick look, so it never rewraps. */
  description?: string
  /** A photo or illustration across the top. It drifts in a little while the card is pointed at. */
  media?: ReactNode
  /** Buttons or links in the footer. They sit above the card's hit area, so they never open it. */
  action?: ReactNode
  /** A small leading visual for the footer, such as the owner's avatar. */
  avatar?: ReactNode
  /** Who the card belongs to, such as the owner's name. */
  meta?: ReactNode
  /** A short status under the meta, such as "Updated 2 hours ago". Changed words rise in and are announced politely. */
  status?: string
  /** Content for a quick look. When set, the whole card opens and grows into a larger view. */
  details?: ReactNode
  /** Whether the quick look is open, when controlled. */
  open?: boolean
  /** Whether the quick look starts open, when uncontrolled. @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Pixel radii for the morph, and the description's line length in the card. */
export type Geometry = { card?: number; panel?: number; measure?: number }

/** The card's box on screen, where the quick look lands when it closes. */
export type Landing = { top: number; left: number; width: number; height: number }

export type Side = 'card' | 'panel'
