import { useEffect, useId, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ChevronLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  HIGHLIGHT_SPRING,
  LABEL_STAGGER_MS,
  OPEN_WIDTH,
  RAIL_WIDTH,
  ROW_STEP,
  TOGGLE_SHIFT,
  TURN_SPRING,
  WIDTH_SPRING,
} from './sidebar-collapse.constants'
import type { SidebarCollapseProps } from './sidebar-collapse.types'
import { clamp01, settle } from './sidebar-collapse.utils'
import { Monogram, NavLabel } from './sidebar-collapse-parts'

/**
 * A sidebar that folds into an icon rail. The arrow turns over and takes the logo's
 * place, and on the way back open the labels cascade in one after another.
 */
export function SidebarCollapse({
  title,
  logo,
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  stagger = LABEL_STAGGER_MS,
  id: idProp,
  className,
  ...props
}: SidebarCollapseProps) {
  const reduced = useReducedMotion() ?? false
  const autoId = useId()
  // the toggle points at the aside, so it needs whichever id the aside ends up with
  const id = idProp ?? autoId
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const [innerValue, setInnerValue] = useState(defaultValue ?? items[0]?.value)
  const open = openProp !== undefined ? openProp : innerOpen
  const value = valueProp !== undefined ? valueProp : innerValue
  const active = items.findIndex((item) => item.value === value)

  // 0 open, 1 closed: turns the arrow, slides the toggle and fades the logo out from under it
  const turn = useMotionValue(open ? 0 : 1)
  const rotate = useTransform(turn, (t) => 180 * t)
  const toggleX = useTransform(turn, (t) => TOGGLE_SHIFT * clamp01(t))
  const logoOpacity = useTransform(turn, (t) => clamp01(1 - t * 2))

  useEffect(() => {
    const controls = animate(turn, open ? 0 : 1, settle(TURN_SPRING, reduced))
    return () => controls.stop()
  }, [open, reduced, turn])

  const handleToggle = () => {
    if (openProp === undefined) setInnerOpen(!open)
    onOpenChange?.(!open)
  }

  const handleSelect = (next: string) => {
    if (valueProp === undefined) setInnerValue(next)
    onValueChange?.(next)
  }

  return (
    <motion.aside
      id={id}
      data-slot="sidebar-collapse"
      data-state={open ? 'open' : 'closed'}
      className={cn('overflow-hidden rounded-3xl bg-muted p-2.5 text-foreground', className)}
      initial={false}
      animate={{ width: open ? OPEN_WIDTH : RAIL_WIDTH }}
      transition={settle(WIDTH_SPRING, reduced)}
      {...props}
    >
      <div className="relative mb-1.5 flex h-11 items-center px-1.5">
        <motion.span className="flex size-7 shrink-0" style={{ opacity: logoOpacity }}>
          {logo ?? <Monogram title={title} />}
        </motion.span>
        <NavLabel
          open={open}
          index={0}
          stagger={stagger}
          reduced={reduced}
          className="ml-2.5 max-w-[104px] text-[15px] font-semibold"
        >
          {title}
        </NavLabel>
        <motion.button
          type="button"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={open}
          aria-controls={id}
          onClick={handleToggle}
          className="absolute top-1 right-0 grid size-9 place-items-center rounded-xl bg-foreground/[0.09] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ x: toggleX }}
        >
          <motion.span className="grid place-items-center" style={{ rotate }}>
            <ChevronLeft className="size-[18px]" strokeWidth={1.9} aria-hidden />
          </motion.span>
        </motion.button>
      </div>

      <nav className="relative flex flex-col gap-0.5">
        {active >= 0 && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-11 rounded-xl bg-foreground/[0.09]"
            initial={false}
            animate={{ y: active * ROW_STEP }}
            transition={settle(HIGHLIGHT_SPRING, reduced)}
          />
        )}
        {items.map((item, index) => {
          const current = index === active
          return (
            <button
              key={item.value}
              type="button"
              aria-current={current ? 'page' : undefined}
              // folded, the label is clipped away, so the tooltip carries it
              title={open ? undefined : item.label}
              onClick={() => handleSelect(item.value)}
              className={cn(
                'relative z-1 flex h-11 shrink-0 items-center rounded-xl px-[11px] text-sm font-medium whitespace-nowrap outline-none transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-ring',
                current ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <span
                aria-hidden
                className="grid size-[22px] shrink-0 place-items-center [&_svg]:size-[22px] [&_svg]:shrink-0"
              >
                {item.icon}
              </span>
              <NavLabel
                open={open}
                index={index + 1}
                stagger={stagger}
                reduced={reduced}
                className="ml-3 max-w-[136px]"
              >
                {item.label}
              </NavLabel>
            </button>
          )
        })}
      </nav>
    </motion.aside>
  )
}
