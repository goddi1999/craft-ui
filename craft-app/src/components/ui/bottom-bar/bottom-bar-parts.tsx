import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import {
  LABEL_GAP,
  LABEL_SPRING,
  POP_FROM,
  POP_SPRING,
  POP_VELOCITY,
} from './bottom-bar.constants'
import type { BottomBarItem } from './bottom-bar.types'
import { clamp01, settle } from './bottom-bar.utils'

// a squash that springs back past 1, decorative so reduced motion skips it
function popIcon(scale: MotionValue<number>, reduced: boolean) {
  if (reduced) return
  scale.jump(POP_FROM)
  animate(scale, 1, { ...POP_SPRING, velocity: POP_VELOCITY })
}

export function BottomBarTab({
  item,
  selected,
  reduced,
  onSelect,
}: {
  item: BottomBarItem
  selected: boolean
  reduced: boolean
  onSelect: (value: string) => void
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  // 0 closed, 1 open: the width is open × the label's natural width
  const open = useMotionValue(selected ? 1 : 0)
  const natural = useMotionValue(0)
  const scale = useMotionValue(1)
  const previous = useRef(selected)

  const width = useTransform([open, natural], ([progress, full]: number[]) => Math.max(0, progress) * full)
  const paddingLeft = useTransform(open, (progress) => clamp01(progress) * LABEL_GAP)
  // the text waits until the label is a third open, so it never shows squeezed
  const opacity = useTransform(open, (progress) => clamp01(progress * 1.4 - 0.4))

  // measured once and again if the font swaps in late
  useLayoutEffect(() => {
    const text = textRef.current
    if (!text) return
    const measure = () => natural.set(text.offsetWidth + LABEL_GAP)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(text)
    return () => observer.disconnect()
  }, [natural])

  useEffect(() => {
    if (previous.current === selected) return
    previous.current = selected
    animate(open, selected ? 1 : 0, settle(LABEL_SPRING, reduced))
    if (selected) popIcon(scale, reduced)
  }, [selected, reduced, open, scale])

  useEffect(
    () => () => {
      open.stop()
      scale.stop()
    },
    [open, scale],
  )

  function handleClick() {
    // picking the tab you are on still pops, like the source
    if (selected) popIcon(scale, reduced)
    onSelect(item.value)
  }

  return (
    <button
      type="button"
      data-slot="bottom-bar-item"
      aria-current={selected ? 'page' : undefined}
      onClick={handleClick}
      className={cn(
        'relative z-10 flex h-11 shrink-0 items-center overflow-hidden rounded-full px-[13px] text-muted-foreground outline-none transition-colors duration-[250ms] focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'text-foreground',
      )}
    >
      <motion.span
        aria-hidden
        className="grid shrink-0 place-items-center will-change-transform [&_svg]:size-[22px] [&_svg]:[stroke-width:1.9]"
        style={{ scale }}
      >
        {item.icon}
      </motion.span>
      <motion.span
        className="block overflow-hidden text-sm font-medium whitespace-nowrap"
        style={{ width, paddingLeft, opacity }}
      >
        <span ref={textRef} className="inline-block">
          {item.label}
        </span>
      </motion.span>
    </button>
  )
}
