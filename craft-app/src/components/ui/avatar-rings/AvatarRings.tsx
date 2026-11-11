import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { OverflowChip, RingFace } from './avatar-rings-parts'
import type { AvatarRingsProps } from './avatar-rings.types'
import { INSTANT, SPRING, STAGGER, pushFor, toneAt } from './avatar-rings.utils'
import { avatarRingsVariants } from './avatar-rings.variants'

/**
 * A row of avatars, each wrapped in a thick coloured ring. They pop in left to
 * right, the hovered one lifts while its neighbours slide aside, and with a
 * selection handler the row is a radiogroup avatar picker.
 */
export function AvatarRings({
  items,
  size,
  ringWidth = 4,
  overlap = 0,
  max,
  selectedId,
  defaultSelectedId = null,
  onSelectedChange,
  selectable,
  label = 'Avatars',
  className,
  onKeyDown,
  ...props
}: AvatarRingsProps) {
  const reduced = useReducedMotion() ?? false
  const picker = selectable ?? (selectedId !== undefined || onSelectedChange !== undefined)
  const [inner, setInner] = useState<string | null>(defaultSelectedId)
  const current = selectedId !== undefined ? selectedId : inner
  const [hovered, setHovered] = useState<number | null>(null)
  const [settled, setSettled] = useState(false)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const visible = max !== undefined && items.length > max ? items.slice(0, Math.max(0, max)) : items
  const hidden = items.length - visible.length

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), (visible.length * STAGGER + 0.6) * 1000)
    return () => clearTimeout(timer)
  }, [visible.length])

  const select = (id: string) => {
    if (selectedId === undefined) setInner(id)
    onSelectedChange?.(id)
  }

  const selectedIndex = visible.findIndex((item) => item.id === current)
  const tabIndex = selectedIndex >= 0 ? selectedIndex : 0

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!picker || event.defaultPrevented) return
    const keys: Record<string, number> = {
      ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1,
    }
    const last = visible.length - 1
    let next: number | undefined
    if (event.key in keys) next = (tabIndex + keys[event.key] + visible.length) % visible.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === undefined || last < 0) return
    event.preventDefault()
    refs.current[next]?.focus()
    select(visible[next].id)
  }

  return (
    <div
      data-slot="avatar-rings"
      role={picker ? 'radiogroup' : 'group'}
      aria-label={label}
      className={cn(avatarRingsVariants({ size }), className)}
      onKeyDown={move}
      onMouseLeave={() => setHovered(null)}
      {...props}
    >
      {visible.map((item, index) => {
        const active = hovered === index
        const selected = item.id === current
        const face = (
          <RingFace
            tone={toneAt(index, item.ring)}
            src={item.src}
            name={item.name}
            ringWidth={ringWidth}
            selected={picker && selected}
            reduced={reduced}
          />
        )
        const motionProps = {
          initial: reduced ? false : { opacity: 0, scale: 0.4, y: 12 },
          animate: {
            opacity: 1,
            scale: active && !reduced ? 1.12 : 1,
            y: active && !reduced ? -2 : 0,
            x: reduced ? 0 : pushFor(index, hovered),
          },
          transition: reduced ? INSTANT : { ...SPRING, delay: settled ? 0 : index * STAGGER },
          style: { marginLeft: index === 0 ? 0 : -overlap, zIndex: active ? 2 : visible.length - index },
          onMouseEnter: () => setHovered(index),
        }
        return picker ? (
          <motion.button
            key={item.id}
            ref={(node) => { refs.current[index] = node }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={item.name}
            title={item.name}
            tabIndex={index === tabIndex ? 0 : -1}
            data-slot="avatar-rings-item"
            data-state={selected ? 'checked' : 'unchecked'}
            className="relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => select(item.id)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            {...motionProps}
          >
            {face}
          </motion.button>
        ) : (
          <motion.span key={item.id} data-slot="avatar-rings-item" className="relative block rounded-full" {...motionProps}>
            {face}
          </motion.span>
        )
      })}
      {hidden > 0 && (
        <OverflowChip
          count={hidden}
          style={{ marginLeft: visible.length === 0 ? 0 : -overlap }}
        />
      )}
    </div>
  )
}
