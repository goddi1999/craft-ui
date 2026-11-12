import { useId, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { BLOB, BLUR, LAYER, RADIUS, TOAST_MS } from './goo-menu.constants'
import type { GooMenuProps } from './goo-menu.types'
import { BubbleBlob, BubbleButton, GooFilter } from './goo-menu-parts'
import { useGooMenu } from './use-goo-menu'

/**
 * A + that pours out liquid bubbles. An SVG goo filter fuses them while they are close,
 * so they peel off like drops; picking one pulls them back in and the + morphs into a toast.
 */
export function GooMenu({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  label = 'Actions',
  radius = RADIUS,
  blur = BLUR,
  toastDuration = TOAST_MS,
  className,
  ...props
}: GooMenuProps) {
  const reduced = useReducedMotion() ?? false
  // useId has characters that break url(#id)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const filterId = `goo-menu-filter-${id}`
  const groupId = `goo-menu-actions-${id}`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const toastRef = useRef<HTMLSpanElement>(null)

  const menu = useGooMenu({
    items,
    openProp,
    defaultOpen,
    onOpenChange,
    onSelect,
    radius,
    toastDuration,
    reduced,
    rootRef,
    triggerRef,
    toastRef,
  })
  const toastItem = menu.toast ? items[menu.toast.index] : undefined
  const toasting = menu.toast?.shown === true

  return (
    <div
      ref={rootRef}
      data-slot="goo-menu"
      data-state={menu.open ? 'open' : 'closed'}
      className={cn('relative size-16 shrink-0 select-none', className)}
      {...props}
    >
      <GooFilter id={filterId} blur={blur} />

      {/* only the blobs are filtered; icons and text sit above so they stay sharp */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: `calc(50% - ${LAYER.originX}px)`,
          top: `calc(50% - ${LAYER.originY}px)`,
          width: LAYER.width,
          height: LAYER.height,
          filter: `url(#${filterId})`,
        }}
      >
        {menu.bubbles.map((bubble, i) => (
          <BubbleBlob key={i} bubble={bubble} reduced={reduced} />
        ))}
        <motion.div
          className={cn('absolute h-16 rounded-full', BLOB)}
          style={{
            left: LAYER.originX,
            top: LAYER.originY,
            width: menu.width,
            x: '-50%',
            y: '-50%',
            scale: menu.scale,
          }}
        />
      </div>

      <div id={groupId} role="group" aria-label={label} className="pointer-events-none absolute inset-0">
        {items.map((item, i) => (
          <BubbleButton
            key={item.value}
            item={item}
            bubble={menu.bubbles[i]}
            home={menu.homes[i]}
            open={menu.open}
            reduced={reduced}
            onSelect={(via) => menu.select(i, via)}
            onDrag={() => menu.cancelFlight(i)}
          />
        ))}
      </div>

      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={menu.open}
        aria-controls={groupId}
        data-toast={toasting || undefined}
        onClick={menu.toggle}
        className="group/main absolute top-1/2 left-1/2 h-16 touch-none overflow-hidden rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ width: menu.width, x: '-50%', y: '-50%', scale: menu.scale }}
      >
        <motion.span
          aria-hidden
          className="absolute top-1/2 left-1/2 -mt-3 -ml-3 grid size-6 place-items-center transition-opacity duration-200 group-data-[toast]/main:opacity-0"
          style={{ rotate: menu.rotation }}
        >
          <Plus className="size-[22px]" strokeWidth={2.2} />
        </motion.span>
        {/* centred and never squeezed, so it can be measured and the pill grows around it */}
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span
            ref={toastRef}
            className="flex shrink-0 items-center gap-2 text-base leading-none font-medium tracking-[-0.01em] whitespace-nowrap opacity-0 [filter:blur(4px)] [transform:translateY(6px)] [transition:opacity_.15s,filter_.15s,transform_.2s] group-data-[toast]/main:opacity-100 group-data-[toast]/main:[filter:none] group-data-[toast]/main:[transform:none] group-data-[toast]/main:[transition:opacity_.35s_.08s,filter_.35s_.08s,transform_.5s_cubic-bezier(.16,1,.3,1)_.08s] [&_svg]:size-5 [&_svg]:shrink-0"
          >
            {toastItem?.icon}
            {toastItem?.toast}
          </span>
        </span>
      </motion.button>

      <span role="status" className="sr-only">
        {toasting ? toastItem?.toast : null}
      </span>
    </div>
  )
}
