// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { SCOPES } from './tool-approval-queue.constants'
import type { GrantScope, ToolApprovalRequest } from './tool-approval-queue.types'

export const scopeText = (scope: GrantScope) =>
  SCOPES.find((s) => s.id === scope)!.label.toLowerCase()

/** The thing a request acts on, shown after the tool name. */
export const targetOf = (payload: ToolApprovalRequest['payload']) =>
  payload.kind === 'shell'
    ? payload.command
    : payload.kind === 'diff'
      ? payload.path
      : payload.kind === 'email'
        ? payload.to
        : ''
