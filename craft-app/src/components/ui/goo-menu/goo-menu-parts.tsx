import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { animate, motion, useTransform, useVelocity } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  BLOB,
  BUBBLE_SIZE,
  DRAG_SLOP,
  FOLLOW_SPRING,
  HOVER_SPRING,
  LAYER,
  PRESS_KICK,
  RELEASE_SPRING,
  SCALE,
} from './goo-menu.constants'
import type { GooMenuItem } from './goo-menu.types'
import {
  blobTransform,
  iconOpacity,
  rubberBand,
  withReducedMotion,
  type Point,
} from './goo-menu.utils'
import { flyTo, type Bubble, type SelectVia } from './use-goo-menu'

/** Blur, then a hard alpha threshold: shapes that come close melt into one. */
export function GooFilter({ id, blur }: { id: string; blur: number }) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>
  )
}

/** The liquid half of a bubble, inside the goo layer. */
export function BubbleBlob({ bubble, reduced }: { bubble: Bubble; reduced: boolean }) {
  const vx = useVelocity(bubble.x)
  const vy = useVelocity(bubble.y)
  const transform = useTransform(() => {
    const x = bubble.x.get()
    const y = bubble.y.get()
    const scale = bubble.scale.get()
    const speedX = vx.get()
    const speedY = vy.get()
    // reduced motion keeps the drop round
    return reduced ? blobTransform(x, y, 0, 0, scale) : blobTransform(x, y, speedX, speedY, scale)
  })

  return (
    <motion.div
      className={cn('absolute size-12 rounded-full', BLOB)}
      style={{
        left: LAYER.originX - BUBBLE_SIZE / 2,
        top: LAYER.originY - BUBBLE_SIZE / 2,
        transform,
      }}
    />
  )
}

type Drag = { id: number; x: number; y: number; live: boolean }

/** The button half of a bubble: icon, tooltip, hover, rubber-band drag and pick. */
export function BubbleButton({
  item,
  bubble,
  home,
  open,
  reduced,
  onSelect,
  onDrag,
}: {
  item: GooMenuItem
  bubble: Bubble
  home: Point
  open: boolean
  reduced: boolean
  onSelect: (via: SelectVia) => void
  onDrag: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const drag = useRef<Drag | null>(null)
  // a drag ends in a click too, which must not count as a pick
  const dragged = useRef(false)
  const opacity = useTransform(() => iconOpacity(bubble.x.get(), bubble.y.get()))

  // the menu can close under a still pointer, and an inert button never hears pointerleave
  if (!open && hovered) setHovered(false)

  const scaleTo = (target: number, velocity?: number) => {
    const spring = withReducedMotion(HOVER_SPRING, reduced)
    animate(bubble.scale, target, velocity === undefined ? spring : { ...spring, velocity })
  }

  const handlePointerEnter = () => {
    if (!open) return
    setHovered(true)
    scaleTo(SCALE.hover)
  }

  const handlePointerLeave = () => {
    setHovered(false)
    if (open && !drag.current) scaleTo(SCALE.open)
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!open) return
    dragged.current = false
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, live: false }
    event.currentTarget.setPointerCapture(event.pointerId)
    scaleTo(SCALE.press)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    const distance = Math.hypot(dx, dy)

    if (!current.live) {
      if (distance <= DRAG_SLOP) return
      drag.current = { ...current, live: true }
      setHovered(false)
      scaleTo(SCALE.drag)
    }

    const give = rubberBand(distance) / distance
    onDrag()
    flyTo(
      bubble,
      { x: home.x + dx * give, y: home.y + dy * give },
      withReducedMotion(FOLLOW_SPRING, reduced),
    )
  }

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    drag.current = null

    if (current.live) {
      // let go: it snaps home with a wobble
      dragged.current = event.type === 'pointerup'
      flyTo(bubble, home, withReducedMotion(RELEASE_SPRING, reduced))
      scaleTo(SCALE.open)
    } else if (event.type === 'pointerup') {
      scaleTo(SCALE.open, reduced ? undefined : bubble.scale.getVelocity() + PRESS_KICK)
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (dragged.current) {
      dragged.current = false
      return
    }
    // keyboard and assistive tech clicks have no pointer behind them
    onSelect(event.detail === 0 ? 'keyboard' : 'pointer')
  }

  return (
    <motion.button
      type="button"
      aria-label={item.label}
      inert={!open}
      data-hovered={hovered || undefined}
      className="group/bubble pointer-events-auto absolute top-1/2 left-1/2 -mt-6 -ml-6 grid size-12 touch-none place-items-center rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-5"
      style={{ x: bubble.x, y: bubble.y, scale: bubble.scale, opacity }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClick={handleClick}
    >
      {item.icon}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 rounded-full bg-foreground px-[9px] py-[5px] text-xs font-medium whitespace-nowrap text-background opacity-0 [transform:translate(-50%,4px)_scale(.9)] [transition:opacity_.15s,transform_.25s_cubic-bezier(.34,1.56,.64,1)] group-data-[hovered]/bubble:opacity-100 group-data-[hovered]/bubble:[transform:translate(-50%,0)_scale(1)]"
      >
        {item.label}
      </span>
    </motion.button>
  )
}
