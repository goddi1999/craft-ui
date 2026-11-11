import type { ComponentProps, ReactNode } from 'react'

export type AvatarOrbitBubbleSide = 'left' | 'right'

/** `blue` reads `--avatar-orbit-bubble` (iOS blue by default); the others follow the theme. */
export type AvatarOrbitBubbleTone = 'blue' | 'neutral' | 'primary'

export type AvatarOrbitMember = {
  id: string
  /** Image URL of the avatar. */
  src: string
  /** Used as the image's alt text. */
  name: string
  /** Speech bubble text, tucked beside the avatar. */
  bubble?: string
  /** Which side of the avatar the bubble sits on. Defaults to the side facing away from the centre. */
  bubbleSide?: AvatarOrbitBubbleSide
  /** Degrees, 0 = right, 90 = down. Overrides the even spacing. */
  angle?: number
  /** Overrides the ring `radius` for this member. */
  radius?: number
}

export type AvatarOrbitProps = ComponentProps<'div'> & {
  members: AvatarOrbitMember[]
  /** Rendered in the middle of the ring, sized to fill the space inside it. */
  center?: ReactNode
  /** Ring radius as a percentage of the stage width. @default 32 */
  radius?: number
  /** Angle of the first member, in degrees (-90 is the top). @default -90 */
  startAngle?: number
  /** Avatar diameter as a percentage of the stage width. @default 26 */
  avatarSize?: number
  /** @default 'blue' */
  bubbleTone?: AvatarOrbitBubbleTone
}
