// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useSyncExternalStore } from 'react'

import { DAY } from './conversation-list.constants'
import type { Conversation } from './conversation-list.types'

/** The date group a conversation belongs to, relative to `now`. */
export function groupOf(conversation: Conversation, now: Date) {
  if (conversation.pinned) return 'Pinned'
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const t = new Date(conversation.updatedAt).getTime()
  if (t >= start.getTime()) return 'Today'
  if (t >= start.getTime() - DAY) return 'Yesterday'
  if (t >= start.getTime() - 7 * DAY) return 'Previous 7 days'
  return 'Older'
}

// Day groups depend on the viewer's time zone, which prerendered HTML can't know.
// Until hydration finishes everything unpinned sits under "Recent", so server and
// first client render match; the real groups appear right after.
const noop = () => () => {}
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
