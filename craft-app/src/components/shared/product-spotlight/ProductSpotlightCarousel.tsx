import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import { cn } from '@/lib/utils'

import type {
  ProductSpotlightCarouselProps,
  ProductSpotlightSlideProps,
} from './product-spotlight.types'

const timelineName = (index: number) => `--product-spotlight-v${index + 1}`

/** One slide. `index` wires it to the marker that tracks it. */
export function ProductSpotlightSlide({
  children,
  index,
  className,
  style,
  ...props
}: ProductSpotlightSlideProps & { index: number }) {
  return (
    <li
      data-slot="product-spotlight-slide"
      className={cn(className)}
      style={
        {
          viewTimeline: `${timelineName(index)} inline`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </li>
  )
}

/**
 * Scroll-snap carousel whose markers stretch on the slides' own view
 * timelines, so the indicator tracks the drag rather than snapping after it.
 */
export function ProductSpotlightCarousel({
  children,
  label = 'Product slides',
  inert = false,
  className,
  style,
  ...props
}: ProductSpotlightCarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [current, setCurrent] = useState(0)

  const count = Children.count(children)
  const timelineScope = Array.from({ length: count }, (_, index) =>
    timelineName(index),
  ).join(', ')

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || count < 2) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const slideWidth = scroller.offsetWidth
        if (slideWidth === 0) return
        const index = Math.round(scroller.scrollLeft / slideWidth)
        if (index >= 0 && index < count) setCurrent(index)
      })
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [count])

  const goTo = useCallback((index: number) => {
    const scroller = scrollerRef.current
    const slide = scroller?.children[index] as HTMLElement | undefined
    if (!slide) return
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    slide.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
    setCurrent(index)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % count
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + count) % count
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = count - 1
    }
    if (next === undefined) return
    event.preventDefault()
    goTo(next)
    markerRefs.current[next]?.focus()
  }

  return (
    <div
      data-slot="product-spotlight-carousel"
      className={cn(className)}
      // Scoping the timeline names here lets the markers, which are siblings
      // of the list, resolve each slide's own view timeline.
      style={{ timelineScope, ...style } as CSSProperties}
      {...props}
    >
      <ul ref={scrollerRef} data-slot="product-spotlight-track">
        {children}
      </ul>
      {count > 1 ? (
        <div
          data-slot="product-spotlight-markers"
          role="tablist"
          aria-label={label}
          onKeyDown={inert ? undefined : onKeyDown}
        >
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              ref={(node) => {
                markerRefs.current[index] = node
              }}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`Slide ${index + 1} of ${count}`}
              tabIndex={inert || index !== current ? -1 : 0}
              style={{ '--timeline': timelineName(index) } as CSSProperties}
              onClick={
                inert
                  ? undefined
                  : (event) => {
                      event.stopPropagation()
                      goTo(index)
                    }
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
