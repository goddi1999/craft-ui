// the dial sweeps 270deg, from -135deg (bottom left) to 135deg (bottom right)
export const SWEEP = 270
export const START_ANGLE = -135

// svg units, the viewBox is 100 wide
export const RADIUS = 40
export const STROKE = 5
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS
export const ARC = CIRCUMFERENCE * (SWEEP / 360)

// knob diameter as a fraction of the size prop
export const KNOB = 0.65

// momentum is in degrees per frame, and loses 8% of it every frame
export const FRICTION = 0.92
export const MIN_FLING = 0.4
export const REST_VELOCITY = 0.05
// letting go after holding still this long, in ms, does not fling
export const FLING_WINDOW = 80

// easeui's springSnappy, inlined so the folder copies on its own
export const SNAP_SPRING = { type: 'spring', stiffness: 380, damping: 30, mass: 0.5 } as const
export const INSTANT = { duration: 0 } as const
