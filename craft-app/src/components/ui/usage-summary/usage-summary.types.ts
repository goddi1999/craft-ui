// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type UsageModel = {
  id: string
  name: string
  /** Any CSS color. Defaults to the built-in palette by position. */
  color?: string
}

type UsageDay = {
  /** ISO date, such as "2026-11-03". */
  date: string
  /** Tokens and cost per model id. Missing models count as zero. */
  byModel: Record<string, { tokens: number; cost: number }>
}

type UsageSummaryProps = {
  data: {
    days: UsageDay[]
    models: UsageModel[]
    /** Total cost of the previous period of the same length, for the delta. */
    previousCost?: number
    budget?: { limit: number; label?: string }
  }
  /** ISO 4217 code used to format costs. */
  currency?: string
  /** Share of the budget (0–1) past which the budget bar warns. */
  warnAt?: number
  title?: string
  onSelectDay?: (day: UsageDay) => void
  className?: string
}

/** A model with its colour resolved. */
type ColoredModel = UsageModel & { color: string }

export type { ColoredModel, UsageDay, UsageModel, UsageSummaryProps }
