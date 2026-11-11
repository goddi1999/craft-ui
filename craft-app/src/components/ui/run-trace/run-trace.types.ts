// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type SpanKind = 'llm' | 'tool' | 'agent' | 'retrieval'

type TraceSpan = {
  id: string
  parentId?: string
  name: string
  kind: SpanKind
  /** Offset from the start of the run. */
  startMs: number
  /** Leave undefined while the span is still running. */
  endMs?: number
  model?: string
  tokens?: { input: number; output: number }
  costUsd?: number
  status?: 'ok' | 'error'
}

type RunTraceProps = {
  data: { spans: TraceSpan[]; elapsedMs: number }
  /** `flame` is a zoomable flame graph; `breakdown` totals time, tokens and cost by name. */
  view?: 'flame' | 'breakdown'
  /** Called when the flame graph zooms into a span, or back out (`null`). */
  onZoom?: (span: TraceSpan | null) => void
  className?: string
}

type TraceMetric = 'time' | 'tokens' | 'cost'

export type { RunTraceProps, SpanKind, TraceMetric, TraceSpan }
