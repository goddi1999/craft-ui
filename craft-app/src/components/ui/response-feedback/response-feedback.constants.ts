// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { Feedback } from './response-feedback.types'

// Motion tokens from TuffUI's shared motion file, kept local so this folder
// can be copied on its own.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const spring = { type: 'spring', duration: 0.3, bounce: 0 } as const
export const enter = { duration: 0.2, ease: EASE_OUT } as const
export const exit = { duration: 0.14, ease: EASE_OUT } as const

export const DEFAULT_REASONS = ['Inaccurate', 'Not helpful', 'Too long', 'Unsafe', 'Other']
export const RATING_LABELS = ['Poor', 'Weak', 'Okay', 'Good', 'Great']

export const emptyFeedback: Feedback = {
  rating: null,
  reasons: [],
  note: '',
  status: 'idle',
}

/** Shared press feel for every small control: quick colour change, 0.97 squeeze. */
export const PRESS =
  'transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'
