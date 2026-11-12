// like.js H = S(1, 520, 13): the heart squashing and bouncing back, a bouncier --spring-pop (520 16)
export const SQUASH_SPRING = { type: 'spring', stiffness: 520, damping: 13, mass: 1 } as const
// like.js F = S(0, 300, 26): the red filling in or draining out
export const FILL_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
// like.js N = S(0, 260, 20): the count rolling by one
export const ROLL_SPRING = { type: 'spring', stiffness: 260, damping: 20, mass: 1 } as const

// like squashes the heart to 60% and throws it up; unlike only dips it a little
export const LIKE_KICK = { from: 0.6, velocity: 9 } as const
export const UNLIKE_KICK = { from: 0.85, velocity: 3 } as const
// past this the heart stops getting wider and only gets taller
export const SQUASH_LIMIT = 1.15

// the dots fly out fast, slow down, shrink and fade within 550 ms
export const BURST_MS = 550
export const DOT_TURN = 0.2
export const DOT_START = 10
export const DOT_REACH = 22
// every other dot flies a little further
export const DOT_EXTRA = 6
export const DOT_SHRINK = 0.7

// px, one row of the count
export const ROW = 22

// fixed colours: the source keeps --heart and the dot colours the same in light and dark.
// --heart, --orange, --yellow, --green, --blue, --purple, --pink, --heart
export const DOT_COLORS = [
  '#ff4d6d',
  '#ff9f0a',
  '#ffd23f',
  '#34d17a',
  '#3ec9ff',
  '#c69bff',
  '#ff6ad5',
  '#ff4d6d',
] as const

export const HEART_PATH =
  'M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.6 3.9 4.5 7.1 4.5c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.2 0 5.4 3.1 4.3 6.4-1.6 4.8-9.2 9.4-9.2 9.4z'
