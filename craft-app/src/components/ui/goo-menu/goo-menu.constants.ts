// goo.js sizes: the + pill is MS tall (and as wide when idle), bubbles are BS
export const MAIN_SIZE = 64
export const BUBBLE_SIZE = 48
// the toast pill is as wide as its content plus this
export const TOAST_PADDING = 44

// the filtered layer from goo.css: room for the bubbles, a drag and a wide toast.
// the + sits at (originX, originY) inside it
export const LAYER = { width: 420, height: 320, originX: 210, originY: 250 } as const

// --goo-radius: px from the + to each bubble
export const RADIUS = 112
// --goo-blur: goo strength, higher fuses bubbles from further away
export const BLUR = 10
// --goo-stagger: ms between bubbles
export const STAGGER_MS = 45
// closing runs the stagger backwards at two thirds of the gap
export const CLOSE_STAGGER = 0.66
// --goo-toast-ms: how long the toast stays
export const TOAST_MS = 2600
// goo.js: a click lets the bubble pop first, closes, then morphs once the bubbles are in
export const SELECT_CLOSE_MS = 80
export const SELECT_TOAST_MS = 320
// the keyboard closes straight away, so the toast comes a touch sooner
export const KEY_TOAST_MS = 300

// bubble angles in degrees, 0 is right and negative is up.
// goo.js lifts the middle two of four a little, so four keep its exact angles
export const FOUR_ANGLES = [-160, -117, -63, -20] as const
export const ARC = { start: -160, end: -20 } as const

// --goo-out: bubbles flying out
export const OUT_SPRING = { type: 'spring', stiffness: 230, damping: 15, mass: 1 } as const
// --goo-in: bubbles returning
export const IN_SPRING = { type: 'spring', stiffness: 520, damping: 34, mass: 1 } as const
// --goo-release: snap back after a drag, with a wobble
export const RELEASE_SPRING = { type: 'spring', stiffness: 300, damping: 12, mass: 1 } as const
// --goo-toast: + morphing into the toast pill
export const TOAST_SPRING = { type: 'spring', stiffness: 260, damping: 17, mass: 1 } as const
// goo.js endToast, no token: the pill shrinking back to the +
export const UNTOAST_SPRING = { type: 'spring', stiffness: 320, damping: 22, mass: 1 } as const
// --spring-pop: the + squashing when it opens, closes or toasts
export const POP_SPRING = { type: 'spring', stiffness: 520, damping: 16, mass: 1 } as const
// goo.js, no token: the + turning into a ×
export const TURN_SPRING = { type: 'spring', stiffness: 320, damping: 20, mass: 1 } as const
// --spring-follow: a bubble held by the pointer, no overshoot, no lag
export const FOLLOW_SPRING = { type: 'spring', stiffness: 900, damping: 50, mass: 1 } as const
// goo.js bubble scale, no tokens: growing on open, shrinking on close, hover and press
export const GROW_SPRING = { type: 'spring', stiffness: 300, damping: 14, mass: 1 } as const
export const SHRINK_SPRING = { type: 'spring', stiffness: 420, damping: 30, mass: 1 } as const
export const HOVER_SPRING = { type: 'spring', stiffness: 500, damping: 18, mass: 1 } as const

// scale velocity kicks from goo.js, negative squashes
export const OPEN_KICK = -3
export const CLOSE_KICK = -1.6
export const TOAST_KICK = -2
export const UNTOAST_KICK = -1.5
export const PRESS_KICK = 4

// degrees the + turns to become a ×
export const TURN = 135
export const SCALE = { closed: 0.5, open: 1, hover: 1.14, press: 0.92, drag: 1.08 } as const
// the idle + breathes: scale amount and speed in rad/s
export const BREATHE = { amount: 0.015, speed: 2.2 } as const

// px a press has to travel before it is a drag
export const DRAG_SLOP = 4
// rubber band: a pull gives less the further it goes, never past BAND_LIMIT px
export const BAND_LIMIT = 70
export const BAND_GIVE = 0.55
// squash and stretch: speed in px/s that adds 1 to the stretch, and the cap
export const STRETCH_SPEED = 2600
export const MAX_STRETCH = 0.32
// bubble icons fade in between these distances from the +, px
export const FADE_START = 18
export const FADE_LENGTH = 40

// the goo needs an opaque fill (a see-through one falls under the alpha threshold),
// so this mixes the --fill-2 look onto the card instead of using foreground/10
export const BLOB = 'bg-[color-mix(in_oklch,var(--foreground)_10%,var(--card))]'
