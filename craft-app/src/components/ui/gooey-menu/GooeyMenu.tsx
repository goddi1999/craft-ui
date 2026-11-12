import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useRef } from 'react'

import { cn } from '@/lib/utils'

import {
  CHEVRON_SPRING,
  DEFAULT_OPTIONS,
  DROP_SPRING,
  FADE,
  FOCUS_RING,
  GROW_DELAY,
  GROW_SPRING,
  INSTANT,
  LIST_VARIANTS,
  PANEL_PAD,
  PANEL_RADIUS,
  PILL_HEIGHT,
  ROW_VARIANTS,
  SNAP_SPRING,
  STILL_LIST_VARIANTS,
  STILL_ROW_VARIANTS,
  SURFACE,
  WIDTH,
} from './gooey-menu.constants'
import type { GooeyMenuProps } from './gooey-menu.types'
import { panelMetrics } from './gooey-menu.utils'
import { GooeyOption, GooFilter } from './gooey-menu-parts'
import { useGooeyMenu } from './use-gooey-menu'

/**
 * A dark pill that drops a liquid panel of options. An SVG goo filter melts the panel into the
 * pill while they are close, so it stretches off on a spring and snaps back when you pick.
 */
export function GooeyMenu({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  width = WIDTH,
  label = 'Menu',
  className,
  style,
  onKeyDown,
  ...props
}: GooeyMenuProps) {
  const reduced = useReducedMotion() ?? false
  // useId has characters that break url(#id)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const filterId = `gooey-menu-filter-${id}`
  const listId = `gooey-menu-list-${id}`
  const optionId = (index: number) => `${listId}-${index}`
  const rootRef = useRef<HTMLDivElement>(null)

  const menu = useGooeyMenu({
    rootRef,
    options,
    value,
    defaultValue,
    open: openProp,
    defaultOpen,
    onOpenChange,
    onSelect,
  })
  const panel = panelMetrics(options.length)

  // reduced motion drops the goo and fades the panel in place
  const panelTarget = reduced
    ? { y: panel.top, scaleY: 1, opacity: menu.open ? 1 : 0 }
    : menu.open
      ? { y: panel.top, scaleY: 1, opacity: 1 }
      : { y: 0, scaleY: panel.closedScale, opacity: 1 }
  const panelTransition = reduced
    ? FADE
    : menu.open
      ? { y: DROP_SPRING, scaleY: { ...GROW_SPRING, delay: GROW_DELAY } }
      : { y: SNAP_SPRING, scaleY: SNAP_SPRING }

  return (
    <div
      ref={rootRef}
      data-slot="gooey-menu"
      data-state={menu.open ? 'open' : 'closed'}
      className={cn('relative inline-flex flex-col items-center select-none', className)}
      style={{ width, ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) menu.handleKeyDown(event)
      }}
      {...props}
    >
      <GooFilter id={filterId} />

      <div className="relative" style={{ width, height: panel.total }}>
        {/* only the solid shapes are filtered; text sits above so it stays sharp */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            filter: reduced ? undefined : `url(#${filterId})`,
            transform: 'translateZ(0)',
            isolation: 'isolate',
          }}
        >
          <div
            className={cn('absolute top-0 left-0', SURFACE)}
            style={{ width, height: PILL_HEIGHT, borderRadius: PILL_HEIGHT / 2 }}
          />
          <motion.div
            className={cn('absolute top-0 left-0', SURFACE)}
            style={{
              width,
              height: panel.height,
              transformOrigin: '50% 0%',
              borderRadius: PANEL_RADIUS,
              willChange: 'transform',
            }}
            initial={false}
            animate={panelTarget}
            transition={panelTransition}
          />
        </div>

        <button
          type="button"
          role="combobox"
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={menu.open}
          aria-controls={menu.open ? listId : undefined}
          aria-activedescendant={menu.open ? optionId(menu.activeIndex) : undefined}
          onClick={() => menu.setOpen(!menu.open)}
          className={cn(
            'absolute top-0 left-0 z-20 flex cursor-pointer items-center justify-between gap-3 bg-transparent px-[22px]',
            FOCUS_RING,
          )}
          style={{ width, height: PILL_HEIGHT, borderRadius: PILL_HEIGHT / 2 }}
        >
          <span className="truncate text-[15.5px] font-medium tracking-[0.1px] text-[#F4F4F4]">
            {menu.selected}
          </span>
          <motion.span
            aria-hidden
            className="grid shrink-0 place-items-center text-[#CFCFCF]"
            initial={false}
            animate={{ rotate: menu.open ? 180 : 0 }}
            transition={reduced ? INSTANT : CHEVRON_SPRING}
          >
            <ChevronDown className="size-[18px]" strokeWidth={2.5} />
          </motion.span>
        </button>

        <AnimatePresence>
          {menu.open && (
            <motion.ul
              id={listId}
              role="listbox"
              aria-label={label}
              className="absolute left-0 z-20 m-0 list-none p-0"
              style={{ top: panel.top, width, paddingBlock: PANEL_PAD }}
              // focus stays on the trigger, which owns the keyboard
              onMouseDown={(event) => event.preventDefault()}
              initial="closed"
              animate="open"
              exit="closed"
              variants={reduced ? STILL_LIST_VARIANTS : LIST_VARIANTS}
            >
              {options.map((option, index) => (
                <GooeyOption
                  key={option}
                  id={optionId(index)}
                  label={option}
                  active={index === menu.activeIndex}
                  selected={option === menu.selected}
                  variants={reduced ? STILL_ROW_VARIANTS : ROW_VARIANTS}
                  onHighlight={() => menu.setActiveIndex(index)}
                  onChoose={() => menu.choose(index)}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
