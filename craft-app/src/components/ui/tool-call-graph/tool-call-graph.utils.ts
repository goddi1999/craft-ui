// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { GAP, ROW } from './tool-call-graph.constants'
import type { ToolCallMetric, ToolCallNode } from './tool-call-graph.types'

export const round = (n: number) => Math.round(n * 100) / 100
export const count = (n: number) => Math.round(n).toLocaleString('en-US')
export const percent = (r: number) => `${(r * 100).toFixed(1)}%`
export const seconds = (ms: number) =>
  ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`

export const valueOf = (t: ToolCallNode, metric: ToolCallMetric) =>
  metric === 'calls' ? t.calls : metric === 'latency' ? t.p50Ms : t.errorRate

/** Bezier edges from the agent (left, centred) to each tool row (right). */
export function buildEdges(
  tools: ToolCallNode[],
  metric: ToolCallMetric,
  width: number,
  max: number,
) {
  const n = tools.length
  const height = Math.max(n * ROW + (n - 1) * GAP, ROW)
  const edges = tools.map((t, i) => {
    const norm = max > 0 ? valueOf(t, metric) / max : 0
    // Edges leave the agent a hair apart, so heavy ones never merge into a blob.
    const y0 = height / 2 + (i - (n - 1) / 2) * 2
    const y1 = i * (ROW + GAP) + ROW / 2
    const w = width
    return {
      t,
      norm,
      d: `M0 ${round(y0)}C${round(w * 0.55)} ${round(y0)} ${round(w * 0.45)} ${round(y1)} ${round(w)} ${round(y1)}`,
    }
  })
  return { height, edges }
}
