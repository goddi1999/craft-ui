import { createContext, useContext } from 'react'

import type { CultDockContextValue } from './cult-dock.types'

export const CultDockContext = createContext<CultDockContextValue | null>(null)

export function useCultDock() {
  const context = useContext(CultDockContext)
  if (!context) throw new Error('useCultDock must be used inside <CultDock>')
  return context
}
