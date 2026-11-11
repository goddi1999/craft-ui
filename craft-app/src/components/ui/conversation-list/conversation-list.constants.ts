// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
// Motion tokens from TuffUI's shared motion file, kept local so this folder
// can be copied on its own.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const enter = { duration: 0.2, ease: EASE_OUT } as const
export const exit = { duration: 0.14, ease: EASE_OUT } as const

export const DAY = 86_400_000

export const GROUP_ORDER = [
  'Pinned',
  'Today',
  'Yesterday',
  'Previous 7 days',
  'Older',
  'Recent',
] as const
