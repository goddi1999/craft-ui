// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { TraceSpan } from './run-trace.types'

const formatMs = (ms: number) =>
  ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`
const formatTokens = (n: number) =>
  n < 1000 ? `${Math.round(n)}` : `${(n / 1000).toFixed(1)}k`
const formatCost = (usd: number) => `$${usd.toFixed(usd < 0.1 ? 4 : 3)}`

const tokensOf = (s: TraceSpan) => (s.tokens ? s.tokens.input + s.tokens.output : 0)

/** Row per span: one below its parent, pushed further down while it overlaps a sibling. */
function lanes(spans: TraceSpan[], elapsedMs: number) {
  const row = new Map<string, number>()
  const taken: { row: number; from: number; to: number }[] = []
  const place = (parentId: string | undefined, min: number) => {
    for (const s of spans
      .filter((x) => x.parentId === parentId)
      .sort((a, b) => a.startMs - b.startMs)) {
      const to = s.endMs ?? elapsedMs
      let r = min
      while (taken.some((t) => t.row === r && t.from < to && s.startMs < t.to)) r++
      taken.push({ row: r, from: s.startMs, to })
      row.set(s.id, r)
      place(s.id, r + 1)
    }
  }
  place(undefined, 0)
  return row
}

type SpanGroup = {
  name: string
  kind: TraceSpan['kind']
  calls: number
  errors: number
  time: number
  tokens: number
  cost: number
}

/** Totals per span name; LLM spans group by model. Agent spans only wrap children. */
function groupSpans(spans: TraceSpan[], elapsedMs: number) {
  const groups = new Map<string, SpanGroup>()
  for (const s of spans.filter((s) => s.kind !== 'agent')) {
    const name = s.kind === 'llm' ? (s.model ?? s.name) : s.name
    const g = groups.get(name) ?? {
      name,
      kind: s.kind,
      calls: 0,
      errors: 0,
      time: 0,
      tokens: 0,
      cost: 0,
    }
    g.calls++
    if (s.status === 'error') g.errors++
    g.time += (s.endMs ?? elapsedMs) - s.startMs
    g.tokens += tokensOf(s)
    g.cost += s.costUsd ?? 0
    groups.set(name, g)
  }
  return [...groups.values()]
}

export { formatCost, formatMs, formatTokens, groupSpans, lanes, tokensOf }
export type { SpanGroup }
