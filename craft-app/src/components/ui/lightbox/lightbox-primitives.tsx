import { Dialog as DialogPrimitive } from 'radix-ui'
import { motion, useTransform, type MotionStyle } from 'motion/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  LightboxItemContext,
  useLightbox,
  useLightboxItem,
} from './lightbox.context'
import type {
  LightboxCounterProps,
  LightboxItemProps,
  LightboxMediaProps,
  LightboxThumbnailProps,
  LightboxTriggerProps,
  LightboxZoomProps,
} from './lightbox.types'
import { KEYBOARD_PAN, prefersReducedMotion } from './lightbox.utils'
import { useZoomGestures } from './use-zoom-gestures'

/** Unstyled behaviour; `lightbox-parts.tsx` adds the look. */

export function LightboxPrimitiveTrigger({
  index = 0,
  children,
  onClick,
  ref,
  ...props
}: LightboxTriggerProps) {
  const { openAt, thumbs, triggers } = useLightbox()

  const setTrigger = useCallback(
    (element: HTMLButtonElement | null) => {
      if (element) triggers.current.set(index, element)
      else triggers.current.delete(index)
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    },
    [index, ref, triggers],
  )

  const imageRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) thumbs.current.set(index, element)
      else thumbs.current.delete(index)
    },
    [index, thumbs],
  )

  return (
    <button
      ref={setTrigger}
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) openAt(index)
      }}
      {...props}
    >
      {typeof children === 'function' ? children({ imageRef }) : children}
    </button>
  )
}

export function LightboxPrimitiveBackdrop({
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  const { shown, pulling, slides } = useLightbox()
  // Pulling the photo down fades the backdrop out to 40% over 400px.
  const progress = useTransform(slides.dragY, (value) => Math.min(Math.abs(value) / 400, 1))

  return (
    <DialogPrimitive.Overlay asChild>
      <motion.div
        data-slot="lightbox-backdrop"
        data-open={shown ? '' : undefined}
        data-pulling={pulling ? '' : undefined}
        style={{ '--lightbox-pull-progress': progress } as MotionStyle}
        className={className}
        {...props}
      />
    </DialogPrimitive.Overlay>
  )
}

export function LightboxPrimitiveContent({
  children,
  className,
  onClick,
  onPointerDownCapture,
  'aria-label': label,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  const lightbox = useLightbox()
  const { shown, pulling, zoom, registerContent } = lightbox

  useEffect(() => registerContent(), [registerContent])

  // On the document, not the dialog: a button that disables itself (Next on
  // the last slide) drops focus to <body>, and the keys must keep working.
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      const { zoomStep } = zoom.configRef.current
      const rtl = getComputedStyle(document.documentElement).direction === 'rtl'
      const pan = (dx: number, dy: number) => {
        event.preventDefault()
        zoom.panBy(dx, dy)
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (zoom.zoomed) pan(KEYBOARD_PAN, 0)
          else if (rtl) lightbox.next()
          else lightbox.previous()
          break
        case 'ArrowRight':
          if (zoom.zoomed) pan(-KEYBOARD_PAN, 0)
          else if (rtl) lightbox.previous()
          else lightbox.next()
          break
        case 'ArrowUp':
          if (zoom.zoomed) pan(0, KEYBOARD_PAN)
          break
        case 'ArrowDown':
          if (zoom.zoomed) pan(0, -KEYBOARD_PAN)
          break
        case '+':
        case '=':
          zoom.zoomBy(zoomStep)
          break
        case '-':
          zoom.zoomBy(1 / zoomStep)
          break
        case '0':
          zoom.reset(!prefersReducedMotion())
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, zoom])

  // A click on empty space (not on a photo or control) dismisses. Decided on
  // pointer down: a captured pointer retargets the click to the slide itself.
  const handlePointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDownCapture?.(event)
    const slot = (event.target as HTMLElement).dataset.slot
    lightbox.draggedRef.current = !(slot && DISMISS_SLOTS.has(slot))
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    // detail 0 is a keyboard-activated click, which never dismisses.
    if (event.defaultPrevented || event.detail === 0 || lightbox.draggedRef.current) return
    lightbox.close()
  }

  return (
    <DialogPrimitive.Content
      data-slot="lightbox-content"
      data-open={shown ? '' : undefined}
      data-zoomed={zoom.zoomed ? '' : undefined}
      data-pulling={pulling ? '' : undefined}
      aria-describedby={undefined}
      onClick={handleClick}
      onPointerDownCapture={handlePointerDownCapture}
      onCloseAutoFocus={(event) => {
        // No Radix trigger exists, so return focus to the thumbnail we closed onto.
        event.preventDefault()
        lightbox.triggers.current.get(lightbox.indexRef.current)?.focus()
      }}
      aria-label={label}
      className={className}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">{label ?? 'Lightbox'}</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  )
}

const DISMISS_SLOTS = new Set([
  'lightbox-content',
  'lightbox-slides',
  'lightbox-slide',
  'lightbox-item',
  'lightbox-zoom',
])

export function LightboxPrimitiveSlides({
  className,
  children,
  style,
  ...props
}: ComponentProps<'div'>) {
  const { index, slides } = useLightbox()
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useTransform([slides.baseX, slides.dragX], ([base, drag]: number[]) => base + drag)

  const measure = useCallback(() => {
    const [first, second] = Array.from(trackRef.current?.children ?? []) as HTMLElement[]
    if (!first) return
    slides.stepRef.current = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
  }, [slides])

  // Park the track on the open slide before the first paint.
  useLayoutEffect(() => {
    measure()
    slides.targetRef.current = index
    slides.baseX.jump(-index * slides.stepRef.current)
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(() => {
      measure()
      slides.baseX.jump(-slides.targetRef.current * slides.stepRef.current)
    })
    observer.observe(track)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only; index changes glide below
  }, [])

  useEffect(() => {
    if (slides.targetRef.current !== index) slides.glideTo(index)
  }, [index, slides])

  return (
    <div
      data-slot="lightbox-slides"
      className={cn('relative overflow-hidden', className)}
      style={style}
      {...props}
    >
      <motion.div
        ref={trackRef}
        data-slot="lightbox-track"
        style={{ x, y: slides.dragY }}
        className="relative flex size-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}

export function LightboxPrimitiveSlide(props: ComponentProps<'div'>) {
  return <div {...props} />
}

export function LightboxPrimitiveItem({
  index,
  caption,
  children,
  ...props
}: LightboxItemProps) {
  const { registerItem } = useLightbox()
  useLayoutEffect(() => registerItem(index, caption), [registerItem, index, caption])

  return (
    <LightboxItemContext.Provider value={{ index }}>
      <div {...props}>{children}</div>
    </LightboxItemContext.Provider>
  )
}

export function LightboxPrimitiveZoom({
  minZoom = 1,
  maxZoom = 4,
  zoomStep = 2,
  scrollToZoom = false,
  wheelSensitivity = 100,
  className,
  children,
  ...props
}: LightboxZoomProps) {
  const lightbox = useLightbox()
  const { index: itemIndex } = useLightboxItem()
  const { zoom, media } = lightbox
  const active = lightbox.index === itemIndex
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useZoomGestures(ref, active)

  // Only the open slide reads the shared zoom values; its neighbours stay at 1.
  useLayoutEffect(() => {
    if (!active) return
    zoom.configRef.current = { minZoom, maxZoom, zoomStep, scrollToZoom, wheelSensitivity }
    zoom.boundsRef.current = () => {
      const container = ref.current
      const photo = innerRef.current?.firstElementChild as HTMLElement | null
      return {
        media: { width: photo?.offsetWidth ?? 0, height: photo?.offsetHeight ?? 0 },
        container: { width: container?.clientWidth ?? 0, height: container?.clientHeight ?? 0 },
      }
    }
  }, [active, minZoom, maxZoom, zoomStep, scrollToZoom, wheelSensitivity, zoom])

  useLayoutEffect(() => {
    const zoomEl = ref.current
    const mediaEl = innerRef.current?.firstElementChild as HTMLElement | null
    if (!zoomEl || !mediaEl) return
    media.current.set(itemIndex, { zoom: zoomEl, media: mediaEl })
    return () => {
      media.current.delete(itemIndex)
    }
  }, [itemIndex, media])

  return (
    <div
      ref={ref}
      data-slot="lightbox-zoom"
      data-zoom={active && zoom.zoomed ? '' : undefined}
      className={cn('flex size-full touch-none items-center justify-center', className)}
      {...props}
    >
      <motion.div
        ref={innerRef}
        className="flex size-full items-center justify-center"
        style={active ? { x: zoom.x, y: zoom.y, scale: zoom.scale } : undefined}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function LightboxPrimitiveMedia({
  width,
  height,
  className,
  style,
  ...props
}: LightboxMediaProps) {
  return (
    <div
      data-slot="lightbox-media"
      className={cn('relative shrink-0', className)}
      style={{
        aspectRatio: `${width} / ${height}`,
        // Contain: as wide as the slide allows, never taller than it.
        width: `min(100cqw, calc(100cqh * ${width / height}))`,
        ...style,
      }}
      {...props}
    />
  )
}

export function LightboxPrimitiveCounter({ children, ...props }: LightboxCounterProps) {
  const { index, total } = useLightbox()
  const state = { current: index + 1, total }
  return (
    <span aria-live="polite" {...props}>
      {typeof children === 'function' ? children(state) : (children ?? `${state.current} / ${state.total}`)}
    </span>
  )
}

export function LightboxPrimitiveCaption({ children, ...props }: ComponentProps<'p'>) {
  const { index, captions } = useLightbox()
  return (
    <p aria-live="polite" {...props}>
      {children ?? captions[index]}
    </p>
  )
}

export function LightboxPrimitiveThumbnailStrip({
  children,
  ...props
}: ComponentProps<'div'>) {
  const { index } = useLightbox()
  const ref = useRef<HTMLDivElement>(null)

  // Keeps the open slide's thumbnail centred in the strip.
  useEffect(() => {
    const strip = ref.current
    const thumb = strip?.querySelector<HTMLElement>(`[data-index="${index}"]`)
    if (!strip || !thumb) return
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [index])

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
}

export function LightboxPrimitiveThumbnail({
  index,
  onClick,
  ...props
}: LightboxThumbnailProps) {
  const lightbox = useLightbox()
  const active = lightbox.index === index

  return (
    <button
      type="button"
      data-index={index}
      data-active={active ? '' : undefined}
      aria-current={active ? 'true' : undefined}
      aria-label={`Go to slide ${index + 1}`}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) lightbox.goTo(index)
      }}
      {...props}
    />
  )
}
