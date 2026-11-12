import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { PILL_SPRING } from './bottom-bar.constants'
import type { BottomBarProps } from './bottom-bar.types'
import { settle } from './bottom-bar.utils'
import { BottomBarTab } from './bottom-bar-parts'

/**
 * A mobile tab bar. The picked tab opens to show its name in a soft pill, the
 * others close to icons, and the pill chases the tab's live size as they move.
 */
export function BottomBar({
  items,
  value: valueProp,
  defaultValue = items[0]?.value,
  onValueChange,
  className,
  ...props
}: BottomBarProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolled
  const active = items.findIndex((item) => item.value === value)
  // the observer below only needs to start over when the set of tabs changes
  const itemsKey = items.map((item) => item.value).join('\n')

  const barRef = useRef<HTMLElement>(null)
  const targetX = useMotionValue(0)
  const targetWidth = useMotionValue(0)
  const x = useSpring(targetX, settle(PILL_SPRING, reduced))
  const width = useSpring(targetWidth, settle(PILL_SPRING, reduced))
  const placed = useRef(false)

  // the labels change every tab's size while they spring, so the pill follows the
  // picked tab's live box instead of where it will end up
  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const tabs = Array.from(bar.querySelectorAll<HTMLElement>(':scope > [data-slot="bottom-bar-item"]'))
    const measure = (laidOut: boolean) => {
      const tab = tabs[active]
      if (!tab) return
      targetX.set(tab.offsetLeft)
      targetWidth.set(tab.offsetWidth)
      if (placed.current) return
      // first time: be there already, no slide in from the left edge
      x.jump(tab.offsetLeft)
      width.jump(tab.offsetWidth)
      // motion writes the open label's width on the next frame, and the observer's first
      // call comes after that write, so only then is the first spot final
      if (laidOut) placed.current = true
    }
    measure(false)
    const observer = new ResizeObserver(() => measure(true))
    tabs.forEach((tab) => observer.observe(tab))
    return () => observer.disconnect()
  }, [active, itemsKey, targetX, targetWidth, x, width])

  function handleSelect(next: string) {
    if (next === value) return
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <nav
      ref={barRef}
      data-slot="bottom-bar"
      className={cn('relative flex w-fit items-center gap-1 rounded-4xl bg-muted p-2', className)}
      {...props}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-2 left-0 h-11 rounded-full bg-foreground/[0.14]"
        style={{ x, width, opacity: active === -1 ? 0 : 1 }}
      />
      {items.map((item, index) => (
        <BottomBarTab
          key={item.value}
          item={item}
          selected={index === active}
          reduced={reduced}
          onSelect={handleSelect}
        />
      ))}
    </nav>
  )
}
