import type { ComponentProps, ReactNode } from 'react'

import type { Button } from '@/components/ui/button'

/** Named pastel tints; each maps to a CSS variable with light and dark values. */
export type AvatarBubbleTone =
  | 'coral'
  | 'pink'
  | 'lilac'
  | 'periwinkle'
  | 'mint'
  | 'sand'

export type AvatarBubble = {
  id: string
  /** Image URL, cropped to the circle. */
  src: string
  /** Alt text for the avatar. */
  name: string
  tone: AvatarBubbleTone
  /** Left edge, % of container width. May be negative to bleed off the card. */
  x: number
  /** Top edge, % of container height. May be negative. */
  y: number
  /** Diameter, % of container width. */
  size: number
}

/** A bubble position without its avatar, so a layout can be reused with any images. */
export type AvatarBubbleSlot = Pick<AvatarBubble, 'tone' | 'x' | 'y' | 'size'>

export type AvatarBubblesProps = Omit<ComponentProps<'div'>, 'children'> & {
  bubbles: AvatarBubble[]
  /** Text block, anchored bottom left. */
  children?: ReactNode
  /** Anchored bottom right, e.g. `<AvatarBubblesAction />`. */
  action?: ReactNode
  /** Bubbles drift subtly with the pointer. @default true */
  parallax?: boolean
}

export type AvatarBubblesActionProps = ComponentProps<typeof Button>
