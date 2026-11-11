// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import {
  Mail,
  FileDiff,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  SquareTerminal,
  Wrench,
} from 'lucide-react'

import type { GrantScope } from './tool-approval-queue.types'

/** Strong ease-out for things that enter or leave. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Exits run faster than entrances. */
export const EXIT_FAST = { duration: 0.14, ease: EASE_OUT } as const

/** Keyboard-initiated changes and reduced motion never wait. */
export const INSTANT = { duration: 0 } as const

// Height morphs on a damped spring; opacity leads on enter and exits faster.
export const REVEAL = {
  height: { type: 'spring', duration: 0.35, bounce: 0 },
  opacity: { duration: 0.2, ease: EASE_OUT },
} as const

// Each tone defines its own colour variable (same values as StatusPill) so the
// folder needs no theme tokens beyond shadcn's.
export const TONE = {
  positive: '[--tone:oklch(0.55_0.15_150)] dark:[--tone:oklch(0.78_0.17_150)]',
  negative: '[--tone:oklch(0.55_0.22_27)] dark:[--tone:oklch(0.72_0.18_25)]',
  warning: '[--tone:oklch(0.56_0.14_65)] dark:[--tone:oklch(0.83_0.15_82)]',
} as const

export const RISKS = {
  high: { label: 'High risk', short: 'High', icon: ShieldOff, text: `${TONE.negative} text-(--tone)` },
  medium: { label: 'Medium risk', short: 'Medium', icon: ShieldAlert, text: `${TONE.warning} text-(--tone)` },
  low: { label: 'Low risk', short: 'Low', icon: ShieldCheck, text: `${TONE.positive} text-(--tone)` },
} as const

export const SCOPES: { id: GrantScope; label: string }[] = [
  { id: 'once', label: 'Once' },
  { id: 'session', label: 'This session' },
  { id: 'always', label: 'Always' },
]

export const KIND_ICONS = {
  shell: SquareTerminal,
  diff: FileDiff,
  email: Mail,
  json: Wrench,
}

/** Group order when the layout is `grouped`. */
export const RISK_ORDER = ['high', 'medium', 'low'] as const
