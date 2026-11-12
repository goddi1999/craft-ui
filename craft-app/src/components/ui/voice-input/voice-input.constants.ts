export const BAR_COUNT = 48
// one extra bar waits off the right edge, so the row can slide a full bar
// before the samples shift and nothing pops in
export const BAR_IDS = Array.from({ length: BAR_COUNT + 1 }, (_, i) => `bar-${i}`)
// bar width + gap, px
export const BAR_PITCH = 5
// a new sample enters on the right this often, so the history scrolls at
// BAR_PITCH / SAMPLE_MS px per ms
export const SAMPLE_MS = 70
export const REST_LEVEL = 0.12
// shape shown under reduced motion: still bars, no scrolling
export const STILL_LEVELS = BAR_IDS.map(
  (_, i) => 0.25 + 0.5 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)),
)

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_OUT_CSS = 'cubic-bezier(0.23, 1, 0.32, 1)'
// caption and review actions swap with a short blur fade
export const SWAP = { duration: 0.2, ease: EASE_OUT } as const
// out of recording the bars glide (500ms) and settle right to left, 6ms apart
export const SETTLE_STAGGER_MS = 6

// clamped so a backgrounded tab does not fast-forward on return
export const MAX_FRAME_MS = 100
export const CLOCK_TICK_MS = 250

// the ring behind the button swells with the voice, smoothed so it breathes
export const RING_SMOOTHING = 0.18
export const RING_SWELL = 0.22
export const RING_OPACITY = 0.4
export const RING_OPACITY_GAIN = 0.8

// demo loop: rest, record, then a short beat before playback and a longer one after
export const DEMO_DELAYS_MS = { idle: 1200, recording: 3400, review: 500, played: 900 } as const

export const EDGE_MASK =
  'linear-gradient(to right, transparent, black 18%, black 92%, transparent)'
