export type LoadingTip = {
  text: string
  /** Any CSS `background` value: a gradient, or `url(...) center / cover`. */
  background: string
  url?: string
}

export type LoadingCarouselAspectRatio = 'video' | 'wide' | 'square'

export type LoadingCarouselTextPosition = 'top' | 'bottom'

export type LoadingCarouselProps = {
  tips?: LoadingTip[]
  className?: string
  autoplayInterval?: number
  showNavigation?: boolean
  showIndicators?: boolean
  showProgress?: boolean
  aspectRatio?: LoadingCarouselAspectRatio
  textPosition?: LoadingCarouselTextPosition
  backgroundTips?: boolean
  backgroundGradient?: boolean
  shuffleTips?: boolean
  onTipChange?: (index: number) => void
}
