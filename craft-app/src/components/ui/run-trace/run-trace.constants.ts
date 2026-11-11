// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { SpanKind } from './run-trace.types'

// The LLM block follows the theme's primary colour; the others are fixed hues
// with dark ink, readable in both themes.
const kinds: Record<SpanKind, { label: string; color: string; ink: string }> = {
  llm: { label: 'LLM', color: 'var(--primary)', ink: 'var(--primary-foreground)' },
  tool: { label: 'Tool', color: '#40b4ff', ink: '#04263d' },
  agent: { label: 'Agent', color: '#bf5af2', ink: '#26073a' },
  retrieval: { label: 'Retrieval', color: '#f5c000', ink: '#3d2e00' },
}

/** Failed spans: a red block with white ink, tuned per theme. */
const ERROR_BLOCK =
  '[--tone:oklch(0.6_0.22_27)] dark:[--tone:oklch(0.68_0.19_25)] bg-(--tone) text-white'
const ERROR_TEXT =
  '[--tone:oklch(0.55_0.22_27)] dark:[--tone:oklch(0.72_0.18_25)] text-(--tone)'

// Movement on screen: zoom is a spatial move, so it gets a strong
// ease-in-out and a little more time.
const zoomMove = { duration: 0.35, ease: [0.77, 0, 0.175, 1] } as const

/** Instant transition for keyboard-initiated changes. */
const instant = { duration: 0 } as const

/** Height of one flame row, in px. */
const LANE_PX = 30

// Rough glyph widths at 11px, for deciding what fits in a block.
const NAME_PX = 6.3
const MONO_PX = 6.7
const PAD_PX = 16

export {
  ERROR_BLOCK,
  ERROR_TEXT,
  LANE_PX,
  MONO_PX,
  NAME_PX,
  PAD_PX,
  instant,
  kinds,
  zoomMove,
}
