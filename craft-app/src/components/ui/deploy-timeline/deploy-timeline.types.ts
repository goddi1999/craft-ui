// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type DeployKind = 'prompt' | 'model'

type Deploy = {
  id: string
  /** Short name on the rail: a prompt version ("v13") or a model id ("o4-mini"). */
  version: string
  /** Prompt deploys draw as dots, model swaps as diamonds. */
  kind: DeployKind
  /** What changed, shown in the callout, e.g. "stricter escalation rules". */
  label?: string
  /** When it shipped. Strings are parsed with `new Date()`. */
  at: Date | string | number
  /** Eval score it shipped with, 0–1. Deltas read in points (×100). */
  score: number
  /** Minutes until it was rolled back. Marks the deploy as a regression. */
  rolledBackAfter?: number
  /** Share of traffic, 0–1, while the deploy runs as a canary next to the live version. */
  canary?: number
}

type DeployStat = {
  label: string
  value: string
  tone?: 'neutral' | 'brand' | 'negative'
}

type DeployTimelineProps = {
  /** Deploys in any order; they are sorted by `at`. */
  deploys: Deploy[]
  /** Minimum eval score. Drawn as a dashed line; deploys under it count as regressions. */
  threshold?: number
  /** Right end of the score line. Defaults to the end of `range`. */
  now?: Date | string | number
  /** Time window of the axis. Defaults to a little around the first deploy and `now`. */
  range?: [Date | string | number, Date | string | number]
  /** Pulses the end of the line while traffic is still being scored. */
  live?: boolean
  title?: string
  subtitle?: string
  /** Chips under the chart. Defaults to live version, canary, eval and deploy count; `[]` hides them. */
  stats?: DeployStat[]
  /** Controlled selection. Defaults to internal state. */
  selectedId?: string | null
  /** Called when a marker is clicked; `null` when the selection is cleared. */
  onSelect?: (deploy: Deploy | null) => void
  /** Shows a Compare button: the selected deploy (or the last good one before live) against live. */
  onCompare?: (deploy: Deploy, live: Deploy) => void
  /** Shows a Roll back button for the selected deploy (or the last good one before live). */
  onRollback?: (deploy: Deploy) => void
  /** Extra content in the header, before the buttons. */
  aside?: React.ReactNode
  /** Draws the line in from the left on mount. Off renders the finished chart. */
  intro?: boolean
  formatScore?: (score: number) => string
  /** Formats dates on the axis and in the callout. Defaults to "Nov 2" in UTC. */
  formatDate?: (date: Date) => string
  className?: string
}

type DeployStatus = 'live' | 'canary' | 'rolled-back' | 'below' | 'shipped'

type DeployItem = {
  d: Deploy
  at: number
  status: DeployStatus
  /** Score of the version it replaced (or of live, for a canary). */
  before: number | null
  regression: boolean
}

type ScoreSegment = {
  owner: string
  from: number
  to: number
  score: number
  regression: boolean
}

export type {
  Deploy,
  DeployItem,
  DeployKind,
  DeployStat,
  DeployStatus,
  DeployTimelineProps,
  ScoreSegment,
}
