import { ArrowRight } from 'lucide-react'
import { motion, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import { CARD_THEMES } from './stacked-cards.constants'
import type { StackedCard } from './stacked-cards.types'
import { cardDepth, stickyTop } from './stacked-cards.utils'

export function StackedCardItem({
  card,
  index,
  total,
  progress,
  reduced,
}: {
  card: StackedCard
  index: number
  total: number
  progress: MotionValue<number>
  reduced: boolean
}) {
  const theme = CARD_THEMES[index % 2 === 0 ? 'dark' : 'light']
  const depth = cardDepth(index, total)
  // shrinks as the next cards slide over it, and grows back on the way up
  const scale = useTransform(progress, depth.range, [1, depth.scale])

  return (
    <div
      className="sticky w-full will-change-transform"
      style={{ top: stickyTop(index), zIndex: index + 1 }}
    >
      <motion.article
        // reduced motion keeps the stacking, which is only layout, and drops the shrink
        style={{ scale: reduced ? 1 : scale, transformOrigin: 'top center' }}
        className={cn(
          'relative w-full overflow-hidden rounded-[22px] border shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-colors duration-300 sm:rounded-[28px] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
          theme.card,
        )}
      >
        <div className="grid h-full min-h-[460px] grid-cols-1 sm:min-h-[500px] md:grid-cols-2">
          <div className="order-2 flex flex-col justify-between p-6 sm:p-10 md:order-1 lg:p-12">
            <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {card.title}
            </h3>

            <div className="pt-6 sm:pt-10">
              <p className={cn('max-w-xl text-sm leading-relaxed sm:text-base lg:text-lg', theme.body)}>
                {card.description}
              </p>

              {card.ctaLabel && card.href && (
                <a
                  href={card.href}
                  className={cn(
                    'mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] motion-reduce:active:scale-100 sm:mt-8 sm:text-sm',
                    theme.cta,
                  )}
                >
                  <span>{card.ctaLabel}</span>
                  <ArrowRight className="size-[15px]" strokeWidth={2} aria-hidden />
                </a>
              )}
            </div>
          </div>

          <div className="relative order-1 h-[220px] min-h-[220px] w-full overflow-hidden sm:h-[280px] md:order-2 md:h-auto">
            <img
              src={card.image}
              alt={card.imageAlt || card.title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 hover:scale-105 motion-reduce:hover:scale-100"
            />
            {/* a soft scrim on mobile, where the image sits above the text */}
            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </motion.article>
    </div>
  )
}
