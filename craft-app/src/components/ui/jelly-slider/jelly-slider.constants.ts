// --slider-follow: thumb held by the pointer, no overshoot, no lag
export const FOLLOW_SPRING = { type: 'spring', stiffness: 900, damping: 50, mass: 1 } as const
// --slider-release: letting go after an over-drag, snaps back with a bounce
export const RELEASE_SPRING = { type: 'spring', stiffness: 300, damping: 14, mass: 1 } as const
// --slider-glide (slider.js fallback, not in tokens.css): keyboard moves glide without a jump
export const GLIDE_SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 1 } as const
// --slider-bubble: the value drop rising out of the thumb and sinking back
export const BUBBLE_SPRING = { type: 'spring', stiffness: 420, damping: 22, mass: 1 } as const
// slider.js, hardcoded 260 18: the drop chases the thumb a little late, so it leans
export const LEAN_SPRING = { type: 'spring', stiffness: 260, damping: 18, mass: 1 } as const
// slider.js, hardcoded 520 16 (same as --spring-pop): thumb hover and press scale
export const PRESS_SPRING = { type: 'spring', stiffness: 520, damping: 16, mass: 1 } as const

// --slider-blur: goo strength, higher fuses the drop and thumb from further away
export const GOO_BLUR = 8
// pushes the blurred alpha back to a hard edge, that is what makes it liquid
export const GOO_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10'

// all px. the thumb centre runs from R to width - R so it sits flush with the track ends
export const THUMB_RADIUS = 12
// drawn at 28 so it reads as 24 once the goo filter trims its edge
export const THUMB_DRAWN_RADIUS = 14
export const DROP_RADIUS = 18
// the goo layer hangs past the rail so the drop has room to rise
export const GOO_OVERHANG_X = 40
export const GOO_OVERHANG_Y = 80
// track centre inside the 32px rail
export const TRACK_CENTER = 16
export const DROP_RISE = -38
export const DROP_REST_SCALE = 0.5
// how far an over-drag can stretch past the ends
export const RUBBER_LIMIT = 18

export const HOVER_SCALE = 1.08
export const PRESS_SCALE = 1.16
// px/s of thumb speed for the full stretch, and how much it stretches
export const STRETCH_SPEED = 2400
export const MAX_STRETCH = 0.4
// how much the drop leans per px it trails the thumb, and the most it leans
export const LEAN_PER_PX = 0.9
export const MAX_LEAN = 28

// the scale: a mark every 5% with a taller one and a number every 25%
export const MARK_COUNT = 21
export const MAJOR_EVERY = 5
// arrows move one mark, page keys two
export const ARROW_FRACTION = 0.05
export const PAGE_FRACTION = 0.1
