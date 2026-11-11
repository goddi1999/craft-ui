// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export type ToolRisk = 'low' | 'medium' | 'high'
export type GrantScope = 'once' | 'session' | 'always'
export type ToolDecision = 'approved' | 'denied'
export type DiffLine = { type: 'add' | 'remove' | 'context'; text: string }

export type ToolApprovalPayload =
  | { kind: 'shell'; command: string; cwd?: string }
  | { kind: 'diff'; path: string; lines: DiffLine[] }
  | { kind: 'email'; to: string; subject: string; body: string }
  | { kind: 'json'; args: Record<string, unknown> }

export type ToolApprovalRequest = {
  id: string
  /** Tool identifier, shown in mono, e.g. `bash`, `fs.write`, `slack.post`. */
  tool: string
  /** Human summary of what the agent wants to do. */
  title: string
  risk: ToolRisk
  agent?: string
  /** Resolve from your own data to move the request into the resolved log. */
  status?: 'pending' | ToolDecision
  /** Scope of an already resolved request, for the log. */
  scope?: GrantScope
  payload: ToolApprovalPayload
}

export type ToolApprovalQueueProps = {
  data: ToolApprovalRequest[]
  /** `grouped` sections requests by risk; `flat` keeps arrival order. */
  layout?: 'grouped' | 'flat'
  /** Called for one request (row actions) or several (bulk bar). */
  onDecide?: (
    requests: ToolApprovalRequest[],
    decision: ToolDecision,
    scope: GrantScope,
  ) => void
  /** Shows Undo in the resolved log for `undoMs` after a decision made here. */
  onUndo?: (request: ToolApprovalRequest) => void
  undoMs?: number
  /** Controlled selection of request ids. */
  selected?: string[]
  onSelectedChange?: (ids: string[]) => void
  /** Request id to open on mount. */
  defaultExpanded?: string
  className?: string
}

export type Resolution = {
  decision: ToolDecision
  scope: GrantScope
  undoable: boolean
}
