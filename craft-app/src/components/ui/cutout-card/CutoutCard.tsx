import { useMemo, type FocusEventHandler, type MouseEventHandler } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { CORNER_PATH, EASE_OUT } from './cutout-card.constants'
import type {
  CutoutCardActionProps,
  CutoutCardContentProps,
  CutoutCardContextValue,
  CutoutCardFooterProps,
  CutoutCardImageProps,
  CutoutCardInsetLabelProps,
  CutoutCardMediaProps,
  CutoutCardOverlayProps,
  CutoutCardPinProps,
  CutoutCardProps,
  CutoutCornerProps,
} from './cutout-card.types'
import { useControllableState } from './use-controllable-state'
import { CutoutCardContext, useCutoutCard } from './use-cutout-card'

export function CutoutCard({
  className,
  hovered: hoveredProp,
  defaultHovered = false,
  onHoveredChange,
  trackPointerHover = true,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  children,
  ...props
}: CutoutCardProps) {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useControllableState({
    prop: hoveredProp,
    defaultProp: defaultHovered,
    onChange: onHoveredChange,
  })

  const ctx = useMemo<CutoutCardContextValue>(
    () => ({ hovered, setHovered }),
    [hovered, setHovered],
  )

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseEnter?.(e)
    if (!e.defaultPrevented && trackPointerHover) setHovered(true)
  }
  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseLeave?.(e)
    if (!e.defaultPrevented && trackPointerHover) setHovered(false)
  }
  // keyboard users get the same reveal as pointer hover
  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => {
    onFocus?.(e)
    if (!e.defaultPrevented && trackPointerHover) setHovered(true)
  }
  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    onBlur?.(e)
    if (e.defaultPrevented || !trackPointerHover) return
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false)
  }

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.22 : 0.36, ease: EASE_OUT }}
        className={cn(className)}
        data-slot="cutout-card"
        data-state={hovered ? 'hovered' : 'idle'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  )
}

export function CutoutCardMedia({ className, ...props }: CutoutCardMediaProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      data-slot="cutout-card-media"
      {...props}
    />
  )
}

/** Fills its `CutoutCardMedia` parent, which needs a defined block size. */
export function CutoutCardImage({ className, alt = '', ...props }: CutoutCardImageProps) {
  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn(
        'absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105 motion-reduce:transition-none motion-reduce:group-hover/cutout:scale-100',
        className,
      )}
      data-slot="cutout-card-image"
      {...props}
    />
  )
}

export function CutoutCardOverlay({ className, ...props }: CutoutCardOverlayProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 bg-linear-to-t from-background/35 via-transparent to-transparent dark:from-background/50',
        className,
      )}
      data-slot="cutout-card-overlay"
      {...props}
    />
  )
}

export function CutoutCardContent({ className, ...props }: CutoutCardContentProps) {
  return <div className={cn('p-6', className)} data-slot="cutout-card-content" {...props} />
}

export function CutoutCardFooter({ className, ...props }: CutoutCardFooterProps) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      data-slot="cutout-card-footer"
      {...props}
    />
  )
}

/** Decorative concave corner; colour it with `text-*` to match the card surface. */
export function CutoutCorner({
  className,
  size = 32,
  viewBox = '0 0 200 200',
  ...props
}: CutoutCornerProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      className={cn(className)}
      data-slot="cutout-corner"
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  )
}

/** Absolutely positioned strip (e.g. bottom-left "Featured"); add corners as siblings inside. */
export function CutoutCardInsetLabel({ className, ...props }: CutoutCardInsetLabelProps) {
  return (
    <div className={cn('absolute', className)} data-slot="cutout-card-inset-label" {...props} />
  )
}

/** Corner badge shell (e.g. top-right "New"); add corners as siblings inside. */
export function CutoutCardPin({ className, ...props }: CutoutCardPinProps) {
  return <div className={cn('absolute', className)} data-slot="cutout-card-pin" {...props} />
}

export function CutoutCardAction({
  className,
  revealOnHover = true,
  ...props
}: CutoutCardActionProps) {
  const { hovered } = useCutoutCard()
  const reduceMotion = useReducedMotion()
  const visible = !revealOnHover || hovered
  const offset = reduceMotion ? 0 : 8

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : offset }}
      transition={{ duration: reduceMotion ? 0.15 : 0.24, ease: EASE_OUT }}
      className={cn('absolute', revealOnHover && !visible && 'pointer-events-none', className)}
      data-reveal={revealOnHover ? 'hover' : 'always'}
      data-slot="cutout-card-action"
      {...props}
    />
  )
}
