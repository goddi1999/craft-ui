// --hold-ms: how long you have to hold
export const HOLD_MS = 1200
// --hold-done-ms: how long the check stays before it turns back into the pill
export const DONE_MS = 1700

// pill size from hold.css; when done it shrinks to a circle as wide as it is tall
export const WIDTH = 220
export const HEIGHT = 56

// --hold-release: the fill springing back when let go early, it dips a hair below zero
export const RELEASE_SPRING = { type: 'spring', stiffness: 260, damping: 14, mass: 1 } as const
// --hold-morph: pill -> circle
export const MORPH_SPRING = { type: 'spring', stiffness: 320, damping: 20, mass: 1 } as const
// --hold-morph at 0.8 stiffness: circle -> pill, a touch softer on the way back
export const UNMORPH_SPRING = { type: 'spring', stiffness: 256, damping: 20, mass: 1 } as const
// hold.js press squash, no token: quick, barely any bounce
export const PRESS_SPRING = { type: 'spring', stiffness: 520, damping: 20, mass: 1 } as const
// hold.js "no" wobble, no token: stiff and loose so it shakes a few times
export const SHAKE_SPRING = { type: 'spring', stiffness: 700, damping: 9, mass: 1 } as const

export const PRESS_SCALE = 0.96
// px/s kick for the wobble, scaled by how far the fill got
export const SHAKE_KICK = 260
// extra scale velocity when it completes, the little pop
export const DONE_POP = 2.5

// hold.css: the check fades in, then draws itself
export const CHECK_FADE = { duration: 0.1, delay: 0.12 } as const
export const CHECK_DRAW = { duration: 0.45, delay: 0.16, ease: [0.65, 0, 0.35, 1] } as const
export const INSTANT = { duration: 0 } as const

export const HOLD_KEYS = [' ', 'Enter']

// --green has no shadcn token; the source keeps it the same in both themes, so do we
export const DONE_SURFACE = 'bg-[#34d17a]'
export const CHECK_COLOR = 'text-black'
