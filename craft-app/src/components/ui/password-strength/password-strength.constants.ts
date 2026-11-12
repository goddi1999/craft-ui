// --spring-soft: each bar's width
export const BAR_SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 1 } as const
// pass.js, no token: the strength word rising in
export const WORD_SPRING = { type: 'spring', stiffness: 300, damping: 24, mass: 1 } as const
// pass.js, no token: the eye's slash drawing and the pupil shrinking
export const EYE_SPRING = { type: 'spring', stiffness: 300, damping: 24, mass: 1 } as const

// pass.js: each bar starts a beat after the one before
export const BAR_STAGGER_MS = 60
// a bar may overshoot a little past full, the track clips it
export const BAR_OVERSHOOT = 1.05
// px the word rises from
export const WORD_RISE = 6
// the slash is ~21.2 units long, a hair more hides it completely
export const SLASH_LENGTH = 22
// pupil scale while the password is hidden
export const PUPIL_HIDDEN = 0.5

export const WORDS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'] as const

// one bar per point of score; all filled bars share the colour of the current score.
// --red maps to destructive. orange, yellow and green have no shadcn token so they stay fixed;
// the word gets the source's darker light-mode text shades so it reads on a light card
export const LEVELS = [
  { bar: 'bg-destructive', text: 'text-destructive' },
  { bar: 'bg-[#ff9f0a]', text: 'text-[#c2660a] dark:text-[#ff9f0a]' },
  { bar: 'bg-[#ffd23f]', text: 'text-[#a16207] dark:text-[#ffd23f]' },
  { bar: 'bg-[#34d17a]', text: 'text-[#15803d] dark:text-[#34d17a]' },
] as const
