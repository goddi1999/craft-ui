import { createContext } from 'react'

import type { MarkerRegistry } from './marker-text.types'

// marks register here so MarkerText can measure them and draw in reading order
export const MarkerContext = createContext<MarkerRegistry | null>(null)
