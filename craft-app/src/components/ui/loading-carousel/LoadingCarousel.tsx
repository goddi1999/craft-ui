import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_AUTOPLAY_INTERVAL,
  DEFAULT_TIPS,
  FADE_VARIANTS,
  SLIDE_VARIANTS,
  TEXT_VARIANTS,
} from './loading-carousel.constants'
import { loadingCarouselSlideVariants } from './loading-carousel-variants'
import type { LoadingCarouselProps, LoadingTip } from './loading-carousel.types'
import { useLoadingCarousel } from './use-loading-carousel'

function TipText({ tip, className }: { tip: LoadingTip; className: string }) {
  if (tip.url === undefined) return <p className={className}>{tip.text}</p>
  return (
    <a
      href={tip.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {tip.text}
    </a>
  )
}

const NAV_BUTTON =
  'absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-transform hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.96]'

export function LoadingCarousel({
  tips = DEFAULT_TIPS,
  className,
  autoplayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  showNavigation = false,
  showIndicators = true,
  showProgress = true,
  aspectRatio = 'video',
  textPosition = 'bottom',
  backgroundTips = false,
  backgroundGradient = false,
  shuffleTips = false,
  onTipChange,
}: LoadingCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const paused = isHovered || isFocused
  const { items, current, direction, goNext, goPrev, select } = useLoadingCarousel({
    items: tips,
    interval: autoplayInterval,
    shuffleItems: shuffleTips,
    paused,
    onChange: onTipChange,
  })
  const tip = items[current]
  const isTop = textPosition === 'top'

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
  }

  const caption = (
    <div className="flex min-w-0 items-center gap-2 text-primary">
      {backgroundTips ? (
        <>
          <span className="text-sm font-medium whitespace-nowrap tabular-nums">
            Tip {current + 1}/{items.length}
          </span>
          <ChevronRight aria-hidden className="size-4" />
        </>
      ) : (
        <TipText
          tip={tip}
          className="max-w-full text-base leading-tight font-medium tracking-tight text-pretty break-words lg:text-xl xl:font-semibold"
        />
      )}
    </div>
  )

  const footer = (
    <div className="bg-muted p-4 sm:p-5">
      <div
        className={cn(
          'flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-center',
          showIndicators && !backgroundTips && 'sm:flex-col sm:items-start',
          isTop && !backgroundTips && 'flex-col-reverse sm:flex-col-reverse',
        )}
      >
        {showIndicators ? (
          <div className="flex w-full gap-2 overflow-x-auto pb-1 sm:pb-0">
            {items.map((item, index) => {
              const isActive = index === current
              const isComplete = index < current
              return (
                <button
                  key={item.text}
                  type="button"
                  className="flex h-10 min-w-8 flex-1 items-center rounded-full transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-muted focus-visible:outline-none active:scale-[0.96] sm:min-w-0"
                  onClick={() => select(index)}
                  aria-label={`Go to tip ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/15">
                    {showProgress && isComplete ? (
                      <span className="absolute inset-0 rounded-full bg-foreground/70" />
                    ) : null}
                    {showProgress && isActive ? (
                      <motion.span
                        key={`${current}-${paused}`}
                        initial={{ scaleX: reduceMotion || paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={
                          reduceMotion || paused
                            ? { duration: 0 }
                            : { duration: autoplayInterval / 1000, ease: 'linear' }
                        }
                        className="absolute inset-0 origin-left rounded-full bg-foreground/70"
                      />
                    ) : null}
                    {showProgress ? null : (
                      <span
                        className={cn(
                          'absolute inset-0 origin-left rounded-full bg-foreground/70 transition-transform duration-300 ease-out motion-reduce:duration-0',
                          isActive ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
        {caption}
      </div>
    </div>
  )

  const slide = (
    <div className="relative overflow-hidden">
      <div className={loadingCarouselSlideVariants({ aspectRatio })}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={tip.text}
            role="group"
            aria-roledescription="slide"
            aria-label={`${current + 1} of ${items.length}`}
            custom={direction}
            variants={reduceMotion ? FADE_VARIANTS : SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0.2 } : { duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ background: tip.background }}
          >
            {backgroundGradient ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            ) : null}
            {backgroundTips ? (
              <motion.div
                variants={TEXT_VARIANTS}
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                className={cn('absolute inset-x-0 min-w-0 p-4 sm:p-6 md:p-8', isTop ? 'top-0' : 'bottom-0')}
              >
                <TipText
                  tip={tip}
                  className="text-center text-base leading-relaxed font-medium tracking-tight text-pretty break-words text-white sm:text-lg md:text-left md:text-xl lg:text-2xl lg:font-bold"
                />
              </motion.div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
      {showNavigation ? (
        <>
          <button type="button" aria-label="Previous tip" onClick={goPrev} className={cn(NAV_BUTTON, 'left-2')}>
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button type="button" aria-label="Next tip" onClick={goNext} className={cn(NAV_BUTTON, 'right-2')}>
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </>
      ) : null}
    </div>
  )

  return (
    <motion.section
      aria-roledescription="carousel"
      aria-label="Loading tips"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      className={cn(
        'mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border',
        className,
      )}
    >
      <p className="sr-only" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
        Tip {current + 1} of {items.length}: {tip.text}
      </p>
      {isTop && !backgroundTips ? footer : null}
      {slide}
      {isTop && !backgroundTips ? null : footer}
    </motion.section>
  )
}
