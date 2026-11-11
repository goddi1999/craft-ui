// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type ToolCallMetric = 'calls' | 'latency' | 'errors'

type ToolCallNode = {
  id: string
  /** Tool name, e.g. `refund.create`. */
  label: string
  /** Calls in the window. */
  calls: number
  /** Median latency in milliseconds. */
  p50Ms: number
  /** Share of calls that failed, `0…1`. */
  errorRate: number
  /** Retried calls in the window. */
  retries?: number
}

type ToolCallStat = {
  label: string
  value: React.ReactNode
  /** Draws the value in the accent colour. */
  accent?: boolean
}

type ToolCallGraphProps = {
  /** The caller on the left. `meta` is a short second line, e.g. "agent · 3.1k runs". */
  agent: { label: string; meta?: string }
  /** Tools in the order they are drawn, top to bottom. */
  tools: ToolCallNode[]
  /** Controlled metric. Pair with `onMetricChange`. */
  metric?: ToolCallMetric
  defaultMetric?: ToolCallMetric
  onMetricChange?: (metric: ToolCallMetric) => void
  /** Tool to pick out. Defaults to the highest value of the current metric; `null` for none. */
  highlight?: string | null
  /** Error rate from which a tool reads as failing, `0…1`. */
  errorThreshold?: number
  title?: string
  subtitle?: string
  /** Footer row. Defaults to total calls, error rate and retries. */
  stats?: ToolCallStat[]
  formatLatency?: (ms: number) => string
  /** Called when a tool node is clicked or pressed. */
  onSelect?: (id: string) => void
  className?: string
}

type HotTone = 'brand' | 'negative'

export type { HotTone, ToolCallGraphProps, ToolCallMetric, ToolCallNode, ToolCallStat }
