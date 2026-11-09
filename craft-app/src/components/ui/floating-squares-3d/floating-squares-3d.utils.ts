export type FloatingSquare = {
  /** Vertical position as a percentage of the plane height. */
  y: number
  /** Seconds to rewind the animation so squares start mid-flight. */
  delay: number
  /** Seconds for one pass across the plane. */
  duration: number
  hue: number
}

/** Small deterministic PRNG so the layout is stable across renders. */
function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSquares(count: number, seed: number): FloatingSquare[] {
  const random = mulberry32(seed)

  return Array.from({ length: count }, () => ({
    delay: random() * 8,
    duration: random() * 8 + 4,
    hue: Math.floor(random() * 360),
    y: Math.floor(random() * 100),
  }))
}
