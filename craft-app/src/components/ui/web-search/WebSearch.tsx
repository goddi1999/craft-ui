import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  CARD,
  COLUMNS,
  FOCUS_RING,
  INSTANT,
  LIFT_SHADOW,
  STAGGER,
  START,
  STEP,
  SURFACE,
  SURFACE_HOVER,
  SWAP,
  cardVariants,
  swapVariants,
} from './web-search.constants'
import { useSize } from './web-search-hooks'
import {
  Collapse,
  FaviconStack,
  GlobeTile,
  LessCard,
  MoreCard,
  OpenChevron,
  Shimmer,
  SkeletonCard,
  SourceCard,
} from './web-search-parts'
import type { WebSearchProps } from './web-search.types'

/**
 * The sources behind an AI answer: a pill whose ring fills as results land,
 * a stack of favicons, and a grid of source cards that collapses behind it.
 * While searching the label shimmers and empty slots hold the first row.
 */
export function WebSearch({
  sources,
  status = 'done',
  query,
  label,
  progress,
  linked = true,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
  ...props
}: WebSearchProps) {
  const reduced = !!useReducedMotion()
  const [openState, setOpenState] = useState(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const [measureRef, labelWidth] = useSize<HTMLSpanElement>('width')

  const searching = status === 'searching'
  const isOpen = open ?? openState
  const count = sources.length
  const ring = Math.min(
    1,
    Math.max(0, progress ?? (count === 0 ? START : 1 - (1 - STEP) ** count)),
  )
  const text =
    label ??
    (searching
      ? query
        ? `Searching “${query}”`
        : 'Searching the web'
      : `Searched ${count} ${count === 1 ? 'site' : 'sites'}`)

  // the last slot belongs to the more card from the fourth result on, so no card ever has to turn into it
  const overflow = !expanded && count >= COLUMNS
  const shown = overflow ? sources.slice(0, COLUMNS - 1) : sources
  const hidden = overflow ? sources.slice(COLUMNS - 1) : []
  // empty slots keep the first row full while results are still landing
  const skeletons = searching && !overflow ? Math.max(0, COLUMNS - count) : 0

  const handleToggle = () => {
    const next = !isOpen
    if (open === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  const swap = reduced ? INSTANT : SWAP
  // after expanding, the stagger starts at the first card that was hidden
  const stagger = (i: number): Transition =>
    reduced
      ? INSTANT
      : { ...CARD, delay: Math.max(0, i - (expanded ? COLUMNS - 1 : 0)) * STAGGER }

  const cell = (key: string, i: number, child: ReactNode) => (
    <motion.li
      key={key}
      className="group/card"
      layout={!reduced}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={stagger(i)}
    >
      {child}
    </motion.li>
  )

  return (
    <div
      data-slot="web-search"
      data-status={status}
      data-open={isOpen || undefined}
      className={cn('flex w-[560px] max-w-full flex-col font-runde text-foreground', className)}
      {...props}
    >
      <button
        type="button"
        data-slot="web-search-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={cn(
          'group flex h-10 w-fit max-w-full cursor-pointer items-center gap-2.5 rounded-full pr-3.5 pl-1.5 text-left transition-[background-color,box-shadow]',
          SURFACE,
          SURFACE_HOVER,
          LIFT_SHADOW,
          FOCUS_RING,
        )}
      >
        <GlobeTile searching={searching} progress={ring} reduced={reduced} />

        {/* the label springs between widths, so the icons beside it glide instead of jumping */}
        <motion.span
          aria-live="polite"
          className="relative grid min-w-0 overflow-x-clip"
          initial={false}
          animate={{ width: labelWidth ?? 'auto' }}
          transition={swap}
        >
          <span
            ref={measureRef}
            aria-hidden
            className="pointer-events-none invisible absolute top-0 left-0 text-[14px] font-semibold whitespace-nowrap"
          >
            {text}
          </span>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={text}
              variants={swapVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={swap}
              className="truncate text-[14px] font-semibold whitespace-nowrap"
            >
              {searching ? <Shimmer reduced={reduced}>{text}</Shimmer> : text}
            </motion.span>
          </AnimatePresence>
        </motion.span>

        <FaviconStack sources={sources} reduced={reduced} />
        <OpenChevron open={isOpen} reduced={reduced} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (count > 0 || searching) && (
          <Collapse key="sources" reduced={reduced}>
            <ol
              data-slot="web-search-sources"
              className="relative grid grid-cols-2 gap-2 pt-2.5 sm:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {shown.map((source, i) =>
                  cell(source.id, i, <SourceCard source={source} index={i + 1} linked={linked} />),
                )}
                {Array.from({ length: skeletons }, (_, i) => (
                  <motion.li
                    key={`skeleton-${count + i}`}
                    aria-hidden
                    layout={!reduced}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={stagger(count + i)}
                  >
                    <SkeletonCard reduced={reduced} delay={i * 0.12} />
                  </motion.li>
                ))}
                {hidden.length > 0 &&
                  cell(
                    'more',
                    COLUMNS - 1,
                    <MoreCard sources={hidden} onClick={() => setExpanded(true)} reduced={reduced} />,
                  )}
                {expanded &&
                  count >= COLUMNS &&
                  cell('less', count, <LessCard onClick={() => setExpanded(false)} />)}
              </AnimatePresence>
            </ol>
          </Collapse>
        )}
      </AnimatePresence>
    </div>
  )
}
