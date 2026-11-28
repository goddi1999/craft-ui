import { createContext, use } from 'react'

import type {
  AutoplayTabsContextValue,
  AutoplayTabsTabState,
} from './autoplay-tabs.types'

export const AutoplayTabsContext = createContext<AutoplayTabsContextValue | null>(null)

export function useAutoplayTabs() {
  const context = use(AutoplayTabsContext)
  if (!context) {
    throw new Error('AutoplayTabs parts must be used within AutoplayTabsRoot')
  }
  return context
}

export const AutoplayTabsTabContext = createContext<AutoplayTabsTabState | null>(null)
