// ticket.js, hardcoded 220 18: tilt chasing the pointer, and the idle float
export const TILT_SPRING = { type: 'spring', stiffness: 220, damping: 18, mass: 1 } as const
// --ticket-flip: turning over to the back, a little overshoot
export const FLIP_SPRING = { type: 'spring', stiffness: 170, damping: 15, mass: 1 } as const
// ticket.js, hardcoded 300 26: glare brightening under the pointer
export const GLARE_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
// ticket.js, hardcoded 300 18: the press dip and the hop on flip
export const LIFT_SPRING = { type: 'spring', stiffness: 300, damping: 18, mass: 1 } as const

// --ticket-tilt: deg at the edge of the card
export const TILT = 14
// --ticket-depth: px the front layer slides at full tilt (ticket.js falls back to 18, the token wins)
export const DEPTH = 12
// share of DEPTH each layer moves, the picture sits far back and the text near the glass
export const IMAGE_DEPTH = 0.25
export const TEXT_DEPTH = 0.9

export const PRESS_SCALE = 0.97
// scale units per second added on flip, so it hops as it turns
export const FLIP_KICK = 1.5

// untouched, it floats so the depth shows without a cursor: deg and rad/s per axis
export const FLOAT_X = 4
export const FLOAT_X_SPEED = 0.9
export const FLOAT_Y = 7
export const FLOAT_Y_SPEED = 0.7

// glare: dim at rest, full under the pointer; without one it drifts around a spot near the top
export const IDLE_GLARE = 0.25
export const GLARE_REST_X = 50
export const GLARE_REST_Y = 30
export const GLARE_DRIFT = 30

// the faint grid behind the title when there is no picture
const GRID_LINE = 'color-mix(in oklab, var(--foreground) 5%, transparent)'
export const GRID_STYLE = {
  backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
}

// a QR-looking pattern: 25 cells, three finder squares, a fixed seed so it never changes
export const QR_CELLS = 25
export const QR_SEED = 42
