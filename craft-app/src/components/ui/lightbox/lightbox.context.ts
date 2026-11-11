import { createContext, useContext } from 'react'

import type { LightboxContextValue } from './lightbox.types'

export const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) throw new Error('Lightbox parts must be rendered inside <Lightbox>')
  return context
}

type ItemContextValue = { index: number }

export const LightboxItemContext = createContext<ItemContextValue | null>(null)

export function useLightboxItem() {
  const context = useContext(LightboxItemContext)
  if (!context) throw new Error('<LightboxZoom> must be rendered inside <LightboxItem>')
  return context
}
