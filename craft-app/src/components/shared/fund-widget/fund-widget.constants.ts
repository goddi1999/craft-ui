import type { Transition } from 'motion/react'

import type { FundItem } from './fund-widget.types'

export const FUND_CARD_HEIGHT = 320

/** Past this drag distance (px) the deck settles on the next card. */
export const DRAG_BUFFER = 40

export const FUND_WIDGET_SPRING: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 40,
}

export const DEFAULT_FUND_DATA: FundItem[] = [
  { id: 'stocks', label: 'Stocks', value: '2.7Cr', change: '12%', trend: 'up' },
  { id: 'funds', label: 'Funds', value: '3.5Cr', change: '8%', trend: 'up' },
  { id: 'deposits', label: 'Deposits', value: '1.2Cr', change: '6%', trend: 'up' },
]
