// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { LucideIcon } from 'lucide-react'

type PromptSuggestion = {
  id: string
  title: string
  /** Second line on cards; ignored by chips. */
  hint?: string
  icon?: LucideIcon
  /** Text to send; defaults to the title. */
  prompt?: string
}

type PromptSuggestionsVariant = 'cards' | 'chips'

type PromptSuggestionsProps = {
  data: PromptSuggestion[]
  /** `cards` for an empty chat, `chips` for follow-ups under an answer. */
  variant?: PromptSuggestionsVariant
  onSelect: (suggestion: PromptSuggestion, prompt: string) => void
  /** Shows a refresh button (chips) that asks for new suggestions. */
  onRefresh?: () => void
  refreshing?: boolean
  heading?: string
  className?: string
}

export type { PromptSuggestion, PromptSuggestionsProps, PromptSuggestionsVariant }
