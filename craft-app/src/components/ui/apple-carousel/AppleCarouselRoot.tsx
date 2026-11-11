import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { animate, useInView, useMotionValue, useMotionValueEvent } from 'motion/react'
import type { AnimationPlaybackControls } from 'motion/react'

import { cn } from '@/lib/utils'

import { AppleCarouselContext } from './apple-carousel.context'
import {
  SCROLL_BASE_DURATION,
  SCROLL_EXTRA_CARD_DURATION,
  SCROLL_MAX_DURATION,
  SETTLE_DELAY,
} from './apple-carousel.constants'
import { usePrefersReducedMotion } from './apple-carousel.hooks'
import type {
  AppleCarouselRootProps,
  AppleCarouselPlayback,
} from './apple-carousel.types'
import { getNearestSlide, getRealSlide, getSnapLeft } from './apple-carousel.utils'

export function AppleCarouselRoot({
  duration = 5000,
  loop = true,
  autoPlay = true,
  className,
  ...props
}: AppleCarouselRootProps) {
  const id = useId()
  const viewportRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)

  const [index, setIndex] = useState(0)
  const [playback, setPlayback] = useState<AppleCarouselPlayback>(
    autoPlay ? 'auto' : 'paused',
  )
  const isInView = useInView(viewportRef, { amount: 0.25 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const isPlaying =
    isInView && (playback === 'playing' || (playback === 'auto' && !prefersReducedMotion))

  const ignoreScrollUntilRef = useRef(0)
  const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null)
  const progressAnimationRef = useRef<Animation | null>(null)
  const scrollLeft = useMotionValue(0)

  const play = () => {
    // Only a stopped non-loop gallery can hold a finished progress.
    const timing = progressAnimationRef.current?.effect?.getComputedTiming()
    if (timing?.progress === 1) goTo(0)
    setPlayback('playing')
  }

  const pause = () => setPlayback('paused')

  const isOwnScroll = () =>
    scrollAnimationRef.current !== null ||
    performance.now() < ignoreScrollUntilRef.current

  const writeScrollLeft = (value: number) => {
    const viewport = viewportRef.current
    if (!viewport) return
    ignoreScrollUntilRef.current = performance.now() + SETTLE_DELAY
    viewport.scrollLeft = value
  }

  useMotionValueEvent(scrollLeft, 'change', writeScrollLeft)

  const setScrollAnimation = (controls: AnimationPlaybackControls | null) => {
    scrollAnimationRef.current = controls
    // Mandatory snapping would pull every intermediate scrollLeft back.
    viewportRef.current?.toggleAttribute('data-animating', controls !== null)
  }

  const stopScrollAnimation = () => {
    scrollAnimationRef.current?.stop()
    setScrollAnimation(null)
  }

  const syncFromScroll = () => {
    // An animation already committed its destination, so the cards it passes
    // through must not flash their dots.
    if (scrollAnimationRef.current) return
    const viewport = viewportRef.current
    const slide = viewport && getNearestSlide(viewport, index)
    if (slide) setIndex(Number(slide.dataset.index))
  }

  // Clone and real card look identical, so the jump is invisible.
  const wrapFromClone = () => {
    const viewport = viewportRef.current
    const slide = viewport && getNearestSlide(viewport, index)
    if (!viewport || !slide?.hasAttribute('data-clone')) return

    const realSlide = getRealSlide(viewport, Number(slide.dataset.index))
    if (realSlide) writeScrollLeft(getSnapLeft(viewport, realSlide))
  }

  const scrollToSlide = (slide: HTMLElement) => {
    const viewport = viewportRef.current
    if (!viewport) return

    setIndex(Number(slide.dataset.index))

    const to = getSnapLeft(viewport, slide)
    const distance = Math.abs(to - viewport.scrollLeft)

    if (prefersReducedMotion || distance < 1) {
      stopScrollAnimation()
      writeScrollLeft(to)
      wrapFromClone()
      return
    }

    // A running spring keeps its velocity when retargeted; only an idle one
    // needs to pick up where the user left the scroll position.
    if (!scrollAnimationRef.current) scrollLeft.jump(viewport.scrollLeft)

    const cardsToTravel = Math.max(distance / slide.offsetWidth, 1)
    const controls = animate(scrollLeft, to, {
      type: 'spring',
      bounce: 0,
      visualDuration: Math.min(
        SCROLL_BASE_DURATION + (cardsToTravel - 1) * SCROLL_EXTRA_CARD_DURATION,
        SCROLL_MAX_DURATION,
      ),
      onComplete: () => {
        if (scrollAnimationRef.current !== controls) return
        setScrollAnimation(null)
        wrapFromClone()
      },
    })
    setScrollAnimation(controls)
  }

  const goTo = (next: number) => {
    const viewport = viewportRef.current
    const slide = viewport && getRealSlide(viewport, next)
    if (slide) scrollToSlide(slide)
  }

  const goNext = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    const next = getNearestSlide(viewport, index)?.nextElementSibling
    if (next instanceof HTMLElement) scrollToSlide(next)
    else pause()
  }

  const onViewportScroll = useEffectEvent(() => {
    if (isPlaying && !isOwnScroll()) pause()
    syncFromScroll()
  })

  const onViewportSettled = useEffectEvent(() => {
    if (!isOwnScroll()) wrapFromClone()
  })

  const onViewportInput = useEffectEvent(() => {
    stopScrollAnimation()
    pause()
  })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let frame: number | null = null
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    const handleScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null
          onViewportScroll()
        })
      }
      // `scrollend` is not available everywhere, so a debounce backs it up.
      // Whichever fires first wraps; the other finds a real card and no-ops.
      clearTimeout(settleTimer)
      settleTimer = setTimeout(onViewportSettled, SETTLE_DELAY)
    }

    const handleWheel = (event: WheelEvent) => {
      // Vertical wheels scroll the page, not the gallery.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) onViewportInput()
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    viewport.addEventListener('scrollend', onViewportSettled)
    viewport.addEventListener('pointerdown', onViewportInput)
    viewport.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      viewport.removeEventListener('scrollend', onViewportSettled)
      viewport.removeEventListener('pointerdown', onViewportInput)
      viewport.removeEventListener('wheel', handleWheel)
      if (frame !== null) cancelAnimationFrame(frame)
      clearTimeout(settleTimer)
    }
  }, [])

  const onProgressFinish = useEffectEvent(goNext)

  // The progress fill doubles as the autoplay clock: composited, pauses in
  // place, no per-frame JS. Without a tab list it still runs, targeting nothing.
  useEffect(() => {
    const animation = new Animation(
      new KeyframeEffect(progressFillRef.current, [{ scale: '0 1' }, { scale: '1 1' }], {
        duration,
        fill: 'forwards',
      }),
    )
    animation.onfinish = onProgressFinish
    progressAnimationRef.current = animation

    return () => {
      animation.cancel()
      progressAnimationRef.current = null
    }
  }, [index, duration])

  useEffect(() => {
    const animation = progressAnimationRef.current
    if (!animation) return
    if (isPlaying) animation.play()
    else animation.pause()
  }, [index, duration, isPlaying])

  return (
    <AppleCarouselContext
      value={{
        id,
        index,
        loop,
        isPlaying,
        prefersReducedMotion,
        viewportRef,
        progressFillRef,
        goTo,
        play,
        pause,
      }}
    >
      <div
        data-slot="apple-carousel"
        data-playing={isPlaying ? '' : undefined}
        className={cn('@container relative w-full', className)}
        {...props}
      />
    </AppleCarouselContext>
  )
}
