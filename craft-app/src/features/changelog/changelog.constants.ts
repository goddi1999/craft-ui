import type { Transition } from 'motion/react'

export const REPO_URL = 'https://github.com/goddi1999/craft-ui'
export const commitUrl = (hash: string) => `${REPO_URL}/commit/${hash}`

/** Cards shown per release before "Show more". */
export const VISIBLE_CARDS = 4

// motion values from the Arc changelog feed (MIT, Elia Kuratli)
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const SNAPPY: Transition = {
  type: 'spring',
  visualDuration: 0.26,
  bounce: 0,
}
export const SMOOTH: Transition = {
  type: 'spring',
  visualDuration: 0.4,
  bounce: 0,
}
export const MORPH: Transition = {
  type: 'spring',
  visualDuration: 0.42,
  bounce: 0,
}
export const INSTANT: Transition = { duration: 0 }
export const BLUR = 'blur(4px)'
export const NO_BLUR = 'blur(0px)'
