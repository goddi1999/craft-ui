import { Children, isValidElement, useEffectEvent, useLayoutEffect } from 'react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { CLONE_COUNT } from './apple-carousel.constants'
import {
  AppleCarouselItemContext,
  useAppleCarousel,
  useAppleCarouselItem,
} from './apple-carousel.context'
import { useIsHydrated } from './apple-carousel.hooks'
import { getRealSlide, getSnapLeft } from './apple-carousel.utils'

export function AppleCarouselContent({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  const { index, loop, viewportRef } = useAppleCarousel()
  const isHydrated = useIsHydrated()

  const items = Children.toArray(children).filter(isValidElement)
  const count = items.length
  // Clones wait for hydration: without them the first card already sits at
  // scrollLeft 0, so the server markup renders the right card with no script.
  const cloneCount = loop && isHydrated && count > 1 ? Math.min(CLONE_COUNT, count) : 0

  const alignToCurrent = useEffectEvent(() => {
    const viewport = viewportRef.current
    const slide = viewport && getRealSlide(viewport, index)
    if (viewport && slide) viewport.scrollLeft = getSnapLeft(viewport, slide)
  })

  // Adding or dropping clones shifts every card, including when loop toggles.
  useLayoutEffect(() => {
    alignToCurrent()
  }, [cloneCount])

  return (
    <div
      ref={viewportRef}
      data-slot="apple-carousel-content"
      className={cn(
        'relative [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory overflow-x-auto overflow-y-hidden data-animating:snap-none',
        '[--apple-carousel-gap:--spacing(5)] [--apple-carousel-item-width:min(max(87.5cqw,var(--container-3xs)),var(--container-6xl))] [--apple-carousel-padding:max(6.25cqw,(100cqw-var(--container-6xl))/2)]',
        '@max-3xl:scroll-ps-(--apple-carousel-padding) @max-3xl:[--apple-carousel-item-width:calc(max(87.5cqw,var(--container-3xs))-var(--apple-carousel-gap))]',
        className,
      )}
      {...props}
    >
      <ul
        role="list"
        data-slot="apple-carousel-list"
        className="mx-auto grid w-fit grid-flow-col gap-(--apple-carousel-gap) px-(--apple-carousel-padding)"
      >
        {items.slice(count - cloneCount).map((item, i) => (
          <AppleCarouselItemContext
            key={`${item.key}-leading`}
            value={{ index: count - cloneCount + i, isClone: true }}
          >
            {item}
          </AppleCarouselItemContext>
        ))}
        {items.map((item, i) => (
          <AppleCarouselItemContext key={item.key} value={{ index: i, isClone: false }}>
            {item}
          </AppleCarouselItemContext>
        ))}
        {items.slice(0, cloneCount).map((item, i) => (
          <AppleCarouselItemContext
            key={`${item.key}-trailing`}
            value={{ index: i, isClone: true }}
          >
            {item}
          </AppleCarouselItemContext>
        ))}
      </ul>
    </div>
  )
}

export function AppleCarouselItem({ className, ...props }: ComponentProps<'li'>) {
  const { id } = useAppleCarousel()
  const { index, isCurrent, isClone } = useAppleCarouselItem()

  return (
    <li
      id={isClone ? undefined : `${id}-item-${index}`}
      role={isClone ? undefined : 'tabpanel'}
      aria-labelledby={isClone ? undefined : `${id}-tab-${index}`}
      // Peeking cards stay out of reach: a click there would otherwise follow
      // a link on a card the user isn't looking at.
      inert={isClone || !isCurrent}
      tabIndex={isCurrent && !isClone ? 0 : -1}
      data-slot="apple-carousel-item"
      data-index={index}
      data-clone={isClone ? '' : undefined}
      data-current={isCurrent ? '' : undefined}
      className={cn(
        'relative h-152 w-(--apple-carousel-item-width) snap-center overflow-hidden rounded-4xl bg-muted data-clone:snap-always',
        '@max-5xl:h-140 @max-3xl:h-152 @max-3xl:snap-start',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    />
  )
}
