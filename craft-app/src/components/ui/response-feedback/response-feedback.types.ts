// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** `up` / `down` from the thumbs, or 1–5 from the detailed rating. */
type FeedbackRating = 'up' | 'down' | 1 | 2 | 3 | 4 | 5

/** `open` shows the reasons form, `sent` the thank-you. */
type FeedbackStatus = 'idle' | 'open' | 'sent'

type Feedback = {
  rating: FeedbackRating | null
  reasons: string[]
  note: string
  status: FeedbackStatus
}

type ResponseFeedbackVariant = 'inline' | 'detailed'

type ResponseFeedbackProps = {
  /** Controlled state. Leave it out and the component keeps its own. */
  value?: Feedback
  onValueChange?: (value: Feedback) => void
  /** Called on a thumbs up, or when a down vote or a 1–5 rating is chosen. */
  onRate?: (rating: FeedbackRating) => void
  onSubmit?: (feedback: {
    rating: FeedbackRating
    reasons: string[]
    note: string
  }) => void
  /** Shown for `undoMs` after a submit. */
  onUndo?: () => void
  undoMs?: number
  onCopy?: () => void
  onRegenerate?: () => void
  reasons?: string[]
  /** `inline` thumbs under an answer; `detailed` a 1–5 rating with reasons always shown. */
  variant?: ResponseFeedbackVariant
  className?: string
}

export type {
  Feedback,
  FeedbackRating,
  FeedbackStatus,
  ResponseFeedbackProps,
  ResponseFeedbackVariant,
}
