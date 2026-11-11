import { createContext, use } from 'react'

import type {
  AppleCarouselContextValue,
  AppleCarouselItemState,
  AppleCarouselTabState,
} from './apple-carousel.types'

export const AppleCarouselContext = createContext<AppleCarouselContextValue | null>(null)

export function useAppleCarousel() {
  const context = use(AppleCarouselContext)
  if (!context) {
    throw new Error('AppleCarousel parts must be used within AppleCarouselRoot')
  }
  return context
}

export const AppleCarouselItemContext = createContext<Omit<
  AppleCarouselItemState,
  'isCurrent'
> | null>(null)

/**
 * State of the enclosing item. Content also renders in loop clones, so check
 * `isClone` before starting media, fetching, or tracking impressions.
 */
export function useAppleCarouselItem(): AppleCarouselItemState {
  const { index: currentIndex } = useAppleCarousel()
  const item = use(AppleCarouselItemContext)
  if (!item) {
    throw new Error(
      'useAppleCarouselItem must be used inside an item of AppleCarouselContent',
    )
  }

  return { ...item, isCurrent: item.index === currentIndex }
}

export const AppleCarouselTabContext = createContext<AppleCarouselTabState | null>(null)
