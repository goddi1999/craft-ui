// --spring-soft: the number rolling in and settling, no bounce to speak of
export const ROLL_SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 1 } as const
// stepper.js, no token: the button kicked sideways at the limit, stiff and loose so it shakes
export const SHAKE_SPRING = { type: 'spring', stiffness: 600, damping: 14, mass: 1 } as const
// stepper.js, no token: the number nudged the same way
export const NUDGE_SPRING = { type: 'spring', stiffness: 500, damping: 16, mass: 1 } as const

// stepper.js kicks in its own units per second, and the px each unit moves on screen.
// as in the source the shake peaks around 0.5px and the nudge around 0.2px: a feel, not a wiggle
export const SHAKE_KICK = 300
export const SHAKE_PX = 0.06
export const NUDGE_KICK = 160
export const NUDGE_PX = 0.04

// --surface on the stage: a raised row in both themes
export const SURFACE = 'bg-muted'
// --fill-2: the round buttons
export const BUTTON_FILL = 'bg-foreground/[0.09]'
