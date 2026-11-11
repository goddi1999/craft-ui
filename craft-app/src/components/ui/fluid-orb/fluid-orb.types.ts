import type { ComponentProps } from 'react'

export type FluidOrbProps = ComponentProps<'div'> & {
  /** Diameter in pixels. @default 240 */
  size?: number
  /** Hex colour of the fluid — a hex string because the shader needs RGB. @default '#1A73F2' */
  color?: string
}
