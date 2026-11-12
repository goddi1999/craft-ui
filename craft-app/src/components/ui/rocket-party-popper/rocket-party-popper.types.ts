import type { ComponentProps } from 'react'

export type RocketPartyStatus = 'idle' | 'launching' | 'celebrating'

/** One piece of confetti, in canvas pixels; `age` and `life` count 60 fps frames. */
export type ConfettiParticle = {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  color: string
  rotation: number
  vRot: number
  wobble: number
  vWobble: number
  life: number
  age: number
  round: boolean
}

/**
 * A rocket on a launchpad. Launch it and it lifts off, then bursts into confetti and shows the
 * milestone with a button to launch again.
 */
export type RocketPartyPopperProps = Omit<ComponentProps<'div'>, 'children' | 'title' | 'ref'> & {
  /** Headline shown once the confetti lands. */
  title?: string
  /** A line under the headline. */
  description?: string
  /** A small badge above the headline, such as `'v2.4.0 Live'`. */
  metric?: string
  /** Label of the launch button. @default 'Launch celebration' */
  triggerLabel?: string
  /** How many pieces of confetti one launch throws. @default 50 */
  confettiCount?: number
  /** Start on the celebration instead of the launchpad. @default false */
  defaultLaunched?: boolean
  /** Called when the rocket is launched. */
  onLaunch?: () => void
  /** Called when Launch again resets it. */
  onReset?: () => void
}
