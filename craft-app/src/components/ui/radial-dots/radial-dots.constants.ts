// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** Fixed drawing space; the SVG scales to its container. */
export const SIZE = 300
export const C = SIZE / 2
/** Radius of the empty middle that holds the headline. */
export const INNER = 70
/** Dot rings per sector. */
export const RINGS = 8
/** Distance between rings. */
export const RING = 8
/** Dots side by side across one sector. */
export const LANES = 3

// Blue, then foreground, then a muted foreground: readable on both themes.
export const PALETTE = [
  'oklch(0.62 0.19 255)',
  'var(--foreground)',
  'color-mix(in oklab, var(--foreground) 45%, transparent)',
]

/** Shared motion value: strong ease-out for things that enter. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
