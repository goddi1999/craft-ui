// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ArrowDown, ArrowUp, Check, LoaderCircle, X, type LucideIcon } from 'lucide-react'

import type { StatusTone } from '../status-pill'
import type { EvalFilter, EvalStatus } from './eval-results.types'

/** Columns in the case grid; arrow up and down move by one row. */
const COLS = 12

/** Strong ease-out for the detail panel entrance. */
const enter = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const

// Each status sets its own `--tone` so the folder needs no theme tokens
// beyond shadcn's; light and dark values are tuned for a tint behind a glyph.
const POSITIVE = '[--tone:oklch(0.55_0.15_150)] dark:[--tone:oklch(0.78_0.17_150)]'
const NEGATIVE = '[--tone:oklch(0.55_0.22_27)] dark:[--tone:oklch(0.72_0.18_25)]'
const WARNING = '[--tone:oklch(0.56_0.14_65)] dark:[--tone:oklch(0.83_0.15_82)]'

/** Text colours for deltas, matching the status pill tones. */
const TEXT_POSITIVE = `${POSITIVE} text-(--tone)`
const TEXT_NEGATIVE = `${NEGATIVE} text-(--tone)`
const TEXT_WARNING = `${WARNING} text-(--tone)`

const statuses: Record<
  EvalStatus,
  { label: string; cell: string; icon?: LucideIcon; tone: StatusTone }
> = {
  pending: { label: 'Pending', cell: 'bg-foreground/[0.07]', tone: 'neutral' },
  running: {
    label: 'Running',
    cell: 'bg-primary/20 text-primary',
    icon: LoaderCircle,
    tone: 'brand',
  },
  pass: {
    label: 'Pass',
    cell: `${POSITIVE} bg-(--tone)/15 text-(--tone)`,
    icon: Check,
    tone: 'positive',
  },
  fail: {
    label: 'Fail',
    cell: `${NEGATIVE} bg-(--tone)/80 text-white`,
    icon: X,
    tone: 'negative',
  },
  regressed: {
    label: 'Regressed',
    cell: `${WARNING} bg-(--tone)/85 text-white`,
    icon: ArrowDown,
    tone: 'warning',
  },
  improved: {
    label: 'Improved',
    cell: 'bg-primary/20 text-primary',
    icon: ArrowUp,
    tone: 'brand',
  },
}

const filters: { id: EvalFilter; label: string; match: (s: EvalStatus) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'failed', label: 'Failed', match: (s) => s === 'fail' || s === 'regressed' },
  { id: 'regressed', label: 'Regressed', match: (s) => s === 'regressed' },
  { id: 'improved', label: 'Improved', match: (s) => s === 'improved' },
]

export { COLS, TEXT_NEGATIVE, TEXT_POSITIVE, TEXT_WARNING, enter, filters, statuses }
