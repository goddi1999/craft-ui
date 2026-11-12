import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CLOSED,
  HEIGHT_SPRING,
  OPEN_WIDTH,
  RADIUS,
  SURFACE,
  TOGGLE_SPRING,
  WIDTH_SPRING,
} from './dynamic-menu.constants'
import type { DynamicMenuItem, DynamicMenuProps } from './dynamic-menu.types'
import { MenuLink, ToggleIcon } from './dynamic-menu-parts'
import { clamp, openHeight, withReducedMotion } from './dynamic-menu.utils'

/**
 * A small pill with a two-line toggle that springs open into a panel: width first, height
 * a little softer behind it, the lines turn into a cross and the links rise in one by one.
 */
export function DynamicMenu({
  brand,
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  openWidth = OPEN_WIDTH,
  closedWidth = CLOSED.width,
  className,
  style,
  onKeyDown,
  ...props
}: DynamicMenuProps) {
  const reduced = useReducedMotion() ?? false
  const listId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = openProp === undefined ? uncontrolledOpen : openProp

  const toggle = useMotionValue(open ? 1 : 0)
  const radius = useTransform(
    toggle,
    (t) => RADIUS.closed + (RADIUS.open - RADIUS.closed) * clamp(t, 0, 1),
  )

  // an effect so a controlled open animates the toggle too
  useEffect(() => {
    animate(toggle, open ? 1 : 0, withReducedMotion(TOGGLE_SPRING, reduced))
  }, [open, reduced, toggle])

  useEffect(() => () => toggle.stop(), [toggle])

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleSelect = (item: DynamicMenuItem, event: MouseEvent<HTMLAnchorElement>) => {
    onSelect?.(item, event)
    setOpen(false)
    // the links go inert as it closes, so keep focus on the toggle
    triggerRef.current?.focus()
  }

  return (
    <motion.nav
      data-slot="dynamic-menu"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        // the panel clips its corners, so the toggle's focus ring is drawn on the panel
        'relative max-w-full overflow-hidden text-foreground has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring',
        SURFACE,
        className,
      )}
      initial={false}
      animate={{
        width: open ? openWidth : closedWidth,
        height: open ? openHeight(items.length) : CLOSED.height,
      }}
      transition={{
        width: withReducedMotion(WIDTH_SPRING, reduced),
        height: withReducedMotion(HEIGHT_SPRING, reduced),
      }}
      style={{ ...style, borderRadius: radius }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(!open)}
        className="absolute inset-x-0 top-0 flex h-[52px] items-center justify-between gap-3 pr-3.5 pl-5 outline-none"
      >
        <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">{brand}</span>
        <ToggleIcon progress={toggle} />
      </button>

      <ul id={listId} inert={!open} className="absolute inset-x-0 top-[52px] px-2.5 pt-1 pb-2.5">
        {items.map((item, index) => (
          <MenuLink
            key={item.label}
            item={item}
            index={index}
            count={items.length}
            open={open}
            reduced={reduced}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </motion.nav>
  )
}
