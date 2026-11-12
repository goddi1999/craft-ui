import type { FileDropSample } from './file-drop.types'

// drop.js FX/FY = S(0, 90, 15): the sample file drifting in on a lazy spring
export const CARRY_SPRING = { type: 'spring', stiffness: 90, damping: 15, mass: 1 } as const
// drop.js tune(150, 18): the sample hanging just off the circle
export const HOVER_SPRING = { type: 'spring', stiffness: 150, damping: 18, mass: 1 } as const
// drop.js tune(520, 36): the sample dropping onto the circle
export const DROP_SPRING = { type: 'spring', stiffness: 520, damping: 36, mass: 1 } as const
// drop.js FS = S(1, 520, 34): the sample shrinking into the circle
export const SHRINK_SPRING = { type: 'spring', stiffness: 520, damping: 34, mass: 1 } as const
// drop.js FO = S(0, 500, 40): the sample fading
export const FADE_SPRING = { type: 'spring', stiffness: 500, damping: 40, mass: 1 } as const
// drop.js ZS = S(1, 380, 16): the zone giving a little when pressed or fed
export const ZONE_SPRING = { type: 'spring', stiffness: 380, damping: 16, mass: 1 } as const
// drop.js ZH = S(0, 300, 26): the zone lifting while a file hovers over it
export const LIFT_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
// drop.js CS = S(1, 420, 14): the circle gulping the file, and dipping when it is done
export const GULP_SPRING = { type: 'spring', stiffness: 420, damping: 14, mass: 1 } as const
// drop.js UP and PO = S(_, 420, 30): the arrow and the percentage swapping places
export const ICON_SPRING = { type: 'spring', stiffness: 420, damping: 30, mass: 1 } as const
// drop.js RO = S(0, 300, 30): the progress ring fading in and out
export const RING_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const
// drop.js G = S(0, 260, 21): green flooding the circle
export const FLOOD_SPRING = { type: 'spring', stiffness: 260, damping: 21, mass: 1 } as const
// drop.js K = S(0, 200, 26): the check drawing itself
export const CHECK_SPRING = { type: 'spring', stiffness: 200, damping: 26, mass: 1 } as const
// drop.js line springs S(1, 360, 30): the old line leaving upward as the new one rises
export const LINE_SPRING = { type: 'spring', stiffness: 360, damping: 30, mass: 1 } as const
// --spring-follow (900 50): the ring following real upload progress, no overshoot, no lag
export const FOLLOW_SPRING = { type: 'spring', stiffness: 900, damping: 50, mass: 1 } as const

// drop.js DUR = 2.1: how long the simulated upload takes
export const UPLOAD_MS = 2100
// how long the done state stays before the zone resets
export const DONE_HOLD_MS = 2600
// autoplay rests this long in the idle state before the next sample
export const AUTO_REST_MS = 1100
// and waits this long after the viewer touches it
export const USER_PAUSE_MS = 8000
// dragover fires every ~50 ms; the lift stays on this long after the last one
export const DRAG_GRACE_MS = 200

// the sample's flight: it comes close at 700 ms, hangs by the circle at 1250, drops at 2000
export const SAMPLE_NEAR_MS = 700
export const SAMPLE_HOVER_MS = 1250
export const SAMPLE_DROP_MS = 2000
// and fades 160 ms into the drop, once it is mostly inside the circle
export const SAMPLE_FADE_MS = 160
// px from the circle's centre
export const SAMPLE_FROM = { x: 320, y: 190 }
export const SAMPLE_PASS = { x: 78, y: 62 }
export const SAMPLE_HOVER = { x: 8, y: 6 }
export const DEFAULT_SAMPLE: FileDropSample = { name: 'brief.pdf', size: 2_400_000 }

// the pokes: something jumps there and springs back to 1
export const GULP_SCALE = 1.2
export const DONE_SCALE = 0.84
export const FED_SCALE = 0.965
export const PRESS_SCALE = 0.975

// a hovering file grows the zone 2.5% and lifts the circle 5 px
export const LIFT_GROW = 0.025
export const LIFT_RISE = -5
// the arrow bobs 3.5 px at 7 rad/s while a file hovers
export const BOB_HEIGHT = 3.5
export const BOB_SPEED = 7
// the arrow leaves upward as the percentage takes over
export const ARROW_RISE = -12
// deg of lean per px/s of sideways speed, and the most it leans
export const LEAN = 0.04
export const MAX_LEAN = 16

export const RING_RADIUS = 33
export const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
export const CHECK_LENGTH = 24
// px the status lines travel as they roll
export const LINE_SHIFT = 16
// longer names keep their start and their extension
export const NAME_LIMIT = 20

// fixed colour: the source keeps --green the same in light and dark, with a black check on top
export const DONE_GREEN = 'bg-[#34d17a]'
