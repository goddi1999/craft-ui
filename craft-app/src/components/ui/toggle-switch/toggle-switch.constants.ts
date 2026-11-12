// switch.js position spring (no token): the knob lands on the far side with a small bounce
export const POSITION_SPRING = { type: 'spring', stiffness: 320, damping: 18, mass: 1 } as const
// switch.js stretch spring (no token): kicked on every flip, it swells and settles back to 0
export const STRETCH_SPRING = { type: 'spring', stiffness: 300, damping: 20, mass: 1 } as const
// the kick in stretch units per second; big enough that the stretch maxes out for a moment
export const STRETCH_KICK = 60

export const KNOB = 26
export const INSET = 3
export const TRACK_WIDTH = 52
export const TRAVEL = TRACK_WIDTH - KNOB - INSET * 2
// px the knob grows toward where it is going
export const STRETCH = 10

// green is the source's --green, a status colour with no theme token, same in both themes
export const TRACK_COLORS = {
  green: 'bg-[#34D17A]',
  primary: 'bg-primary',
} as const

// background reads on both the grey track and the primary fill, in light and dark
export const KNOB_COLORS = {
  green: 'bg-white',
  primary: 'bg-background',
} as const
