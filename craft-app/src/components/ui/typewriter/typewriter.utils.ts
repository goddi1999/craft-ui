import {
  BURST_FACTOR,
  HESITATE_CHANCE,
  HESITATE_FACTOR,
  KEY_ROWS,
  VARIANCE,
} from './typewriter.constants'

/** The keys around a letter on a QWERTY keyboard, in the same case. */
export function neighbours(char: string) {
  const lower = char.toLowerCase()
  const row = KEY_ROWS.findIndex((keys) => keys.includes(lower))
  if (row === -1) return ''
  const col = KEY_ROWS[row].indexOf(lower)
  const around = [
    KEY_ROWS[row][col - 1],
    KEY_ROWS[row][col + 1],
    KEY_ROWS[row - 1]?.[col],
    KEY_ROWS[row + 1]?.[col],
  ]
    .filter(Boolean)
    .join('')
  return char === lower ? around : around.toUpperCase()
}

/** Small seeded generator (Park-Miller), 0 to 1. */
export function createRandom(seed: number) {
  let state = (Math.abs(Math.floor(seed)) % 2_147_483_646) + 1
  return () => {
    state = (state * 16_807) % 2_147_483_647
    return (state - 1) / 2_147_483_646
  }
}

export function typingDelay(typingSpeed: number, naturalVariance: boolean, random: () => number) {
  if (!naturalVariance) return typingSpeed
  const roll = random()
  if (roll < HESITATE_CHANCE) return typingSpeed * HESITATE_FACTOR
  if (roll > 1 - HESITATE_CHANCE) return typingSpeed * BURST_FACTOR
  return typingSpeed * (1 - VARIANCE + random() * VARIANCE * 2)
}
