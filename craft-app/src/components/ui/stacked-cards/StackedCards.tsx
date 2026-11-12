import { useScroll, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

import type { StackedCardsProps } from './stacked-cards.types'
import { StackedCardItem } from './stacked-cards-parts'

/**
 * Cards that pin and stack as the page scrolls, each shrinking a little as the next slides over
 * it. Plain sticky positioning does the stacking, so the page scroll is never taken over.
 */
export function StackedCards({ cards, title, subtitle, className, ...props }: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  // 0 when the column's top meets the viewport top, 1 when its bottom meets the viewport bottom
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  if (!cards.length) return null

  return (
    <section
      data-slot="stacked-cards"
      aria-label="Stacked Stories"
      className={cn('relative w-full py-8 sm:py-16', className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8 text-center sm:mb-12 sm:text-left">
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div ref={containerRef} className="relative flex flex-col gap-10 pb-24 sm:gap-16 sm:pb-36">
          {cards.map((card, index) => (
            <StackedCardItem
              key={card.id}
              card={card}
              index={index}
              total={cards.length}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
