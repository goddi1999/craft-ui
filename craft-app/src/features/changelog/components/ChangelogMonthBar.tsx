import { forwardRef, useId } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'

import { cn } from '@/lib/utils'

import { BLUR, INSTANT, MORPH, NO_BLUR } from '../changelog.constants'
import type { ChangelogMonth } from '../changelog.types'
import type { ActiveMonth } from '../hooks/useActiveMonth'

/** The label rises when you scroll to an older month and falls when you scroll back. */
const rise: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * 14,
    filter: BLUR,
  }),
  center: { opacity: 1, y: 0, filter: NO_BLUR },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -14,
    filter: BLUR,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  }),
}

type ChangelogMonthBarProps = {
  months: ChangelogMonth[]
  active: ActiveMonth
  reduce: boolean
  onJump: (key: string) => void
}

/** Sticky pill under the top bar: the month in view, and a jump link per month. */
export const ChangelogMonthBar = forwardRef<HTMLDivElement, ChangelogMonthBarProps>(
  function ChangelogMonthBar({ months, active, reduce, onJump }, ref) {
    const pillId = useId()
    const current = months.find((month) => month.key === active.key) ?? months[0]

    return (
      // the fade behind the pill keeps scrolled content out from under the top bar
      <div
        ref={ref}
        className="sticky top-0 z-20 -mx-4 bg-linear-to-b from-background from-80% to-transparent px-4 pt-16 pb-4"
      >
        <div className="flex h-12 items-center justify-between gap-4 rounded-full border bg-background/80 pr-1.5 pl-5 shadow-sm backdrop-blur-xl">
          <div className="hidden min-w-0 items-baseline gap-3 sm:flex" aria-hidden="true">
            <span className="relative inline-flex overflow-hidden text-sm font-medium whitespace-nowrap">
              <AnimatePresence mode="popLayout" initial={false} custom={active.direction}>
                <motion.span
                  key={current?.key}
                  custom={active.direction}
                  variants={rise}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={reduce ? INSTANT : MORPH}
                  className="inline-block"
                >
                  {current?.label}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {current?.count} {current?.count === 1 ? 'component' : 'components'}
            </span>
          </div>

          <nav aria-label="Jump to month" className="-mr-1 overflow-x-auto sm:mr-0">
            <ul className="flex items-center">
              {months.map((month) => {
                const selected = month.key === current?.key
                return (
                  <li key={month.key}>
                    <button
                      type="button"
                      onClick={() => onJump(month.key)}
                      aria-label={`Jump to ${month.label}`}
                      aria-current={selected ? 'true' : undefined}
                      className={cn(
                        'relative h-9 rounded-full px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring',
                        selected
                          ? 'text-background'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId={pillId}
                          className="absolute inset-0 rounded-full bg-foreground"
                          transition={reduce ? INSTANT : MORPH}
                        />
                      )}
                      <span className="relative">{month.short}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    )
  },
)
