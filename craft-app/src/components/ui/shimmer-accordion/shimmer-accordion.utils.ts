import type { CSSProperties } from 'react'

import type { ShimmerConfig, ShimmerPreset } from './shimmer-accordion.types'

export const SHIMMER_PRESETS = {
  Default: {
    mode: 'line',
    cps: 50,
    icons: true,
    textAlpha: 0.1,
    angle: 0,
    offset: 0,
    stops: [{ color: 'hsla(160,100%,50%,1)', spread: 20 }],
  },
  Subtle: {
    mode: 'line',
    cps: 70,
    icons: false,
    textAlpha: 0.1,
    angle: 0,
    offset: 0,
    stops: [{ color: 'var(--foreground)', spread: 8 }],
  },
  'Neon Duo': {
    mode: 'line',
    cps: 60,
    icons: false,
    textAlpha: 0.04,
    angle: 0,
    offset: 0,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 12 },
      { color: 'hsla(300,100%,70%,1)', spread: 24 },
    ],
  },
  Golden: {
    mode: 'line',
    cps: 70,
    icons: true,
    textAlpha: 0.08,
    angle: 0,
    offset: 0,
    stops: [
      { color: 'hsla(54,100%,81%,1)', spread: 6 },
      { color: 'hsla(25,100%,60%,1)', spread: 12 },
      { color: 'hsla(45,74%,50%,1)', spread: 18 },
    ],
  },
  'Tri-Color': {
    mode: 'line',
    cps: 50,
    icons: true,
    textAlpha: 0.05,
    angle: 0,
    offset: 0,
    stops: [
      { color: 'hsla(219,90%,40%,1)', spread: 3 },
      { color: 'hsla(240,95%,94%,1)', spread: 6 },
      { color: 'hsla(41,100%,50%,1)', spread: 9 },
      { color: 'hsla(9,96%,55%,1)', spread: 12 },
      { color: 'hsla(301,40%,62%,1)', spread: 15 },
    ],
  },
  Sweep: {
    mode: 'sweep',
    cps: 120,
    icons: true,
    textAlpha: 0.1,
    angle: 24,
    offset: 4,
    stops: [{ color: 'hsla(160,100%,50%,1)', spread: 10 }],
  },
  'Sweep Duo': {
    mode: 'sweep',
    cps: 200,
    icons: false,
    textAlpha: 0.05,
    angle: 25,
    offset: 6,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 10 },
      { color: 'hsla(300,100%,70%,1)', spread: 20 },
    ],
  },
  Waterfall: {
    mode: 'vertical',
    cps: 260,
    icons: true,
    textAlpha: 0.08,
    angle: 0,
    offset: 2,
    stops: [
      { color: 'hsla(200,95%,19%,1)', spread: 1.5 },
      { color: 'hsla(200,85%,77%,1)', spread: 3 },
    ],
  },
  Cascade: {
    mode: 'vertical',
    cps: 255,
    icons: false,
    textAlpha: 0.04,
    angle: 0,
    offset: 3,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 1 },
      { color: 'hsla(280,100%,70%,1)', spread: 3 },
    ],
  },
} as const satisfies Record<string, ShimmerPreset>

export type ShimmerPresetName = keyof typeof SHIMMER_PRESETS

/**
 * Turns a shimmer config into CSS custom properties consumed by the
 * stylesheet. The answer's background is a stack of `background-clip: text`
 * gradients: one per coloured band, a mid-tone that becomes the settled text
 * colour, and a faint ghost layer that is always visible. Opening slides
 * every layer except the ghost from off-canvas to `0 0`.
 */
export function buildShimmerStyle({
  mode,
  cps,
  textAlpha,
  angle,
  offset,
  stops,
}: ShimmerConfig): CSSProperties {
  const isVertical = mode === 'vertical'
  const direction = isVertical
    ? '180deg'
    : mode === 'sweep'
      ? `${90 + angle}deg`
      : '90deg'
  const unit = isVertical ? '1lh' : '1ch'
  const closed = isVertical ? '0 200%' : '200% 0'
  const animatedSize = isVertical
    ? `100% calc(200% + ${offset} * 1lh)`
    : `calc(200% + ${offset} * 1ch) 100%`
  const bandEnd = `calc(100% - ${offset} * ${unit})`

  const bands = stops.map((stop) => {
    const bandStart = `calc(100% - ${stop.spread + offset} * ${unit})`
    return `linear-gradient(${direction}, #0000 0 ${bandStart}, ${stop.color} ${bandStart} ${bandEnd}, #0000 ${bandEnd} 100%)`
  })
  const midTone = `linear-gradient(${direction}, color-mix(in oklch, var(--foreground), var(--background) 40%) 0 ${bandEnd}, #0000 ${bandEnd} 100%)`
  const ghost = `linear-gradient(color-mix(in oklch, var(--foreground) ${textAlpha * 100}%, transparent) 0 100%)`

  const animatedLayers = stops.length + 1
  const repeat = (value: string) => Array(animatedLayers).fill(value)

  return {
    '--cps': cps,
    '--shimmer-display': mode === 'line' ? 'inline' : 'inline-block',
    '--shimmer-image': [...bands, midTone, ghost].join(', '),
    '--shimmer-size': [...repeat(animatedSize), '100% 100%'].join(', '),
    '--shimmer-closed': [...repeat(closed), '0 0'].join(', '),
    '--shimmer-open': [...repeat('0 0'), '0 0'].join(', '),
    '--shimmer-selection': stops.at(-1)?.color ?? 'var(--foreground)',
  } as CSSProperties
}
