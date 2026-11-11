import { Children, isValidElement, use } from 'react'
import type { ComponentProps, KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { AppleCarouselTabContext, useAppleCarousel } from './apple-carousel.context'
import type { AppleCarouselControlsProps } from './apple-carousel.types'

export function AppleCarouselControls({
  size = 'default',
  className,
  ...props
}: AppleCarouselControlsProps) {
  return (
    <div
      data-slot="apple-carousel-controls"
      data-size={size}
      className={cn(
        'group/apple-carousel-controls flex items-center justify-center gap-3 pt-6 data-[size=sm]:gap-2 data-[size=sm]:pt-4',
        className,
      )}
      {...props}
    />
  )
}

export function AppleCarouselTabList({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  const tabs = Children.toArray(children).filter(isValidElement)

  return (
    <div
      role="tablist"
      data-slot="apple-carousel-tab-list"
      className={cn(
        'flex h-14 items-center rounded-full bg-muted px-4 group-data-[size=sm]/apple-carousel-controls:h-11 group-data-[size=sm]/apple-carousel-controls:px-3',
        className,
      )}
      {...props}
    >
      {tabs.map((tab, index) => (
        <AppleCarouselTabContext key={tab.key} value={{ index, count: tabs.length }}>
          {tab}
        </AppleCarouselTabContext>
      ))}
    </div>
  )
}

export function AppleCarouselTab({
  className,
  children,
  onClick,
  onFocus,
  onKeyDown,
  ...props
}: ComponentProps<'button'>) {
  const {
    id,
    index: currentIndex,
    isPlaying,
    progressFillRef,
    goTo,
    pause,
  } = useAppleCarousel()
  const tab = use(AppleCarouselTabContext)
  if (!tab) {
    throw new Error('AppleCarouselTab must be a direct child of AppleCarouselTabList')
  }

  const { index, count } = tab
  const isCurrent = index === currentIndex

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    let next: number
    switch (event.key) {
      case 'ArrowLeft':
        next = (index - 1 + count) % count
        break
      case 'ArrowRight':
        next = (index + 1) % count
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = count - 1
        break
      default:
        return
    }

    event.preventDefault()
    goTo(next)
    const tabs = event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
    tabs?.[next]?.focus()
  }

  return (
    <button
      type="button"
      role="tab"
      id={`${id}-tab-${index}`}
      aria-controls={`${id}-item-${index}`}
      aria-selected={isCurrent}
      tabIndex={isCurrent ? 0 : -1}
      data-slot="apple-carousel-tab"
      data-current={isCurrent ? '' : undefined}
      className={cn(
        'relative mx-2 size-2 overflow-hidden rounded-full bg-muted-foreground not-data-current:hover:bg-foreground',
        // Width morphs on screen; the hover color is a quick, small change.
        'transition-[width,background-color] duration-[400ms,150ms] ease-[cubic-bezier(0.645,0.045,0.355,1),ease]',
        'motion-reduce:transition-colors motion-reduce:duration-150 motion-reduce:ease-[ease]',
        'data-current:w-12 group-data-[size=sm]/apple-carousel-controls:data-current:w-6 @max-3xl:data-current:w-8',
        'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) goTo(index)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (isPlaying && event.currentTarget.matches(':focus-visible')) pause()
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span
        ref={isCurrent ? progressFillRef : undefined}
        aria-hidden
        data-slot="apple-carousel-tab-progress"
        className="absolute inset-0 origin-left scale-x-0 rounded-[inherit] bg-foreground"
      />
      <span className="sr-only">{children}</span>
    </button>
  )
}
