import type { Variants } from 'motion/react'

// how long a checked step stays in place, struck through, before it folds into the completed row
export const SETTLE_MS = 720
export const DONE_TITLE = 'You’re all set'
export const ERROR_FALLBACK = 'That didn’t work. Try again.'

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = { instant: 0.12, fast: 0.16, standard: 0.24 } as const
export const EASE_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1]
// presses, toggles and small indicators; settles fast and never overshoots
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
// panels and height changes
export const SPRING_SMOOTH = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
// the ring's arc and digit columns that change width
export const SPRING_MORPH = { type: 'spring', visualDuration: 0.42, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const BLUR_SOFT = 4

// the CSS side of the check circle's press: uiarc's --ease-spring over 580ms
export const SPRING_EASE =
  'linear(0, 0.0213, 0.0739, 0.1443, 0.2235, 0.305, 0.3849, 0.4606, 0.5305, 0.594, 0.6508, 0.7011, 0.7452, 0.7836, 0.8168, 0.8454, 0.8699, 0.8907, 0.9084, 0.9234, 0.9361, 0.9467, 0.9557, 0.9632, 0.9694, 0.9747, 0.979, 0.9826, 0.9857, 0.9882, 0.9902, 0.992, 0.9934, 0.9946, 0.9955, 0.9963, 1)'

// a title swap rises in from a blur
export const RISE: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: `${0.3 * direction}em`,
    filter: `blur(${BLUR_SOFT}px)`,
  }),
  center: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.22, ease: EASE_ENTER } },
  exit: (direction: number) => ({
    opacity: 0,
    y: `${-0.3 * direction}em`,
    filter: `blur(${BLUR_SUBTLE}px)`,
    transition: { duration: 0.15, ease: EASE_STANDARD },
  }),
}

export const FADE: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

// digits turn in the direction the count moved
export const ROLL: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: `${0.45 * direction}em`,
    filter: `blur(${BLUR_SUBTLE}px)`,
  }),
  center: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: {
      y: SPRING_SNAPPY,
      opacity: { duration: DURATION.fast },
      filter: { duration: DURATION.fast },
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: `${-0.45 * direction}em`,
    filter: `blur(${BLUR_SUBTLE}px)`,
    transition: { duration: 0.14, ease: EASE_STANDARD },
  }),
}
