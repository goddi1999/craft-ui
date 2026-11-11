import type { ComponentProps, ReactNode } from 'react'

export type AvatarConstellationTint = 'lavender' | 'mint' | 'peach' | 'sky' | 'rose'

export type AvatarConstellationCenter = {
  /** Image URL of the avatar. */
  src: string
  /** Alt text for the avatar. */
  name: string
}

export type AvatarConstellationSatellite = {
  id: string
  /** An icon or any small element; svg children fill about half the tile. */
  node: ReactNode
  /** Centre of the tile, as a percentage of the stage width (0-100). */
  x: number
  /** Centre of the tile, as a percentage of the stage height (0-100). */
  y: number
  /** Diameter of the tile, as a percentage of the stage width. */
  size: number
  /**
   * 0 (far) to 1 (near). Nearer tiles move more with the pointer; above 0.6
   * the tile sits in front of the centre disc, otherwise it tucks behind it.
   * Defaults to 0.5.
   */
  depth?: number
  /** Accessible name. Without it the tile is decorative and hidden from assistive tech. */
  label?: string
}

export type AvatarConstellationProps = Omit<ComponentProps<'div'>, 'children'> & {
  center: AvatarConstellationCenter
  satellites: readonly AvatarConstellationSatellite[]
  /** Colour of the centre disc; follows light and dark theme. Defaults to 'lavender'. */
  tint?: AvatarConstellationTint
  /** Diameter of the centre disc as a percentage of the stage width. Defaults to 38. */
  centerSize?: number
  /** Slow orbit-like drift of every satellite. Defaults to true. */
  drift?: boolean
  /** Satellites follow the pointer, nearer ones more. Defaults to true. */
  parallax?: boolean
  /** Called when the centre avatar is activated, after the wave starts. */
  onCenterClick?: () => void
  /** Shown above the stage, e.g. an eyebrow. */
  header?: ReactNode
  /** Shown below the stage, e.g. a title. */
  children?: ReactNode
  /** Classes for the square stage that holds the discs. */
  stageClassName?: string
}
