import type { ComponentProps, ReactNode } from 'react'

export type CloudOrbitPerson = {
  id: string
  src: string
  name: string
  /** Any CSS colour for the disc behind the avatar. */
  tint: string
}

export type CloudOrbitItem = {
  id: string
  /** Accessible name; the chip itself is decorative. */
  label: string
  node: ReactNode
}

export type CloudOrbitProps = Omit<ComponentProps<'div'>, 'children'> & {
  people: CloudOrbitPerson[]
  /** Chips that circle the avatar, spread evenly around it. */
  items: CloudOrbitItem[]
  /** Replaces the default cloud mark the loop starts and ends on. */
  cloud?: ReactNode
  /** How long each person stays in the middle, in ms. @default 2600 */
  hold?: number
  /** Freezes the loop where it is. Also pauses itself while off screen. */
  paused?: boolean
}
