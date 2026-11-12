import type { ComponentProps } from 'react'

/** How many particles orbit: `minimal` drops the outer trailing dot, `dense` adds an inner one. */
export type OrbitalLoadingRingVariant = 'default' | 'dense' | 'minimal'

/**
 * A loader of two counter-rotating orbits around a pulsing core. Every part takes the text
 * colour, so a `text-*` class tints it.
 */
export type OrbitalLoadingRingProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Width and height in px. @default 72 */
  size?: number
  /** Multiplies how fast the orbits turn and the core pulses; 0 holds it still. @default 1 */
  speed?: number
  /** Particle density. @default 'default' */
  variant?: OrbitalLoadingRingVariant
  /** What screen readers announce. @default 'Loading' */
  label?: string
}
