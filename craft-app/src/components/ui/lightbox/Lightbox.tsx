import { Dialog as DialogPrimitive } from 'radix-ui'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { LightboxContext } from './lightbox.context'
import type {
  LightboxContextValue,
  LightboxMediaEntry,
  LightboxProps,
} from './lightbox.types'
import {
  clamp,
  fadeMedia,
  morphMedia,
  prefersReducedMotion,
  settleFrames,
} from './lightbox.utils'
import { useControllableState } from './use-controllable-state'
import { useLightboxZoom } from './use-lightbox-zoom'
import { useSlidesMotion } from './use-slides-motion'

/**
 * Owns the open/index state and the open/close choreography. The dialog itself
 * (portal, focus trap, scroll lock, Escape) comes from Radix; it is kept
 * mounted until the closing morph has finished.
 */
export function Lightbox({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  handle,
  children,
}: LightboxProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  })
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [captions, setCaptions] = useState<Record<number, string | undefined>>({})

  const zoom = useLightboxZoom()
  const slides = useSlidesMotion()

  const thumbs = useRef(new Map<number, HTMLElement>())
  const triggers = useRef(new Map<number, HTMLElement>())
  const media = useRef(new Map<number, LightboxMediaEntry>())
  const draggedRef = useRef(false)
  const contentMounted = useRef(false)
  const choreography = useRef(0)

  const total = Object.keys(captions).length
  const indexRef = useRef(index)
  const totalRef = useRef(total)
  useLayoutEffect(() => {
    indexRef.current = index
    totalRef.current = total
  })

  if (open && !mounted) setMounted(true)

  const openAt = useCallback(
    (next: number) => {
      zoom.reset()
      setIndex(next)
      setOpen(true)
    },
    [setIndex, setOpen, zoom],
  )

  const close = useCallback(() => setOpen(false), [setOpen])

  const goTo = useCallback(
    (next: number) => {
      const target = clamp(next, 0, Math.max(totalRef.current - 1, 0))
      if (target === indexRef.current) return
      zoom.reset()
      setIndex(target)
    },
    [setIndex, zoom],
  )

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const previous = useCallback(() => goTo(indexRef.current - 1), [goTo])

  const registerItem = useCallback((itemIndex: number, caption: string | undefined) => {
    setCaptions((current) => ({ ...current, [itemIndex]: caption }))
    return () =>
      setCaptions((current) => {
        const rest = { ...current }
        delete rest[itemIndex]
        return rest
      })
  }, [])

  useEffect(() => handle?.bind({ open: openAt, close }), [handle, openAt, close])

  // One frame after mount, so the backdrop and chrome have a state to fade from.
  useEffect(() => {
    if (!open || !mounted) {
      setShown(false)
      return
    }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setShown(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [open, mounted])

  const runEnter = useCallback(async () => {
    const entry = media.current.get(indexRef.current)
    if (!entry) return
    const token = ++choreography.current
    // Hidden until measured: the track's own position settles a frame later.
    entry.media.style.opacity = '0'
    await settleFrames()
    if (token !== choreography.current) return

    const thumb = thumbs.current.get(indexRef.current)
    if (prefersReducedMotion()) {
      entry.media.style.opacity = ''
      return
    }
    const morphed = thumb
      ? await morphMedia({ media: entry.media, thumb, direction: 'in' })
      : false
    if (!morphed && token === choreography.current) await fadeMedia(entry.media, 'in')
  }, [])

  const registerContent = useCallback(() => {
    contentMounted.current = true
    runEnter()
    return () => {
      contentMounted.current = false
    }
  }, [runEnter])

  // Re-opening while the closing morph is still running.
  const wasOpen = useRef(open)
  useEffect(() => {
    if (open && !wasOpen.current && contentMounted.current) runEnter()
    wasOpen.current = open
  }, [open, runEnter])

  useEffect(() => {
    if (open || !mounted) return
    const token = ++choreography.current

    const run = async () => {
      const entry = media.current.get(indexRef.current)
      if (entry && !prefersReducedMotion()) {
        if (zoom.scale.get() > 1.01) {
          zoom.reset()
          await settleFrames()
        }
        const thumb = thumbs.current.get(indexRef.current)
        const morphed = thumb
          ? await morphMedia({ media: entry.media, thumb, direction: 'out' })
          : false
        if (!morphed) await fadeMedia(entry.media, 'out')
      }
      if (token !== choreography.current) return
      slides.dragY.jump(0)
      setPulling(false)
      setMounted(false)
    }
    run()
  }, [open, mounted, slides, zoom])

  const value: LightboxContextValue = {
    open,
    shown,
    index,
    total,
    captions,
    pulling,
    setPulling,
    openAt,
    close,
    goTo,
    next,
    previous,
    registerItem,
    thumbs,
    triggers,
    media,
    draggedRef,
    indexRef,
    registerContent,
    zoom,
    slides,
  }

  return (
    <LightboxContext.Provider value={value}>
      <DialogPrimitive.Root
        open={mounted}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) close()
        }}
      >
        {children}
      </DialogPrimitive.Root>
    </LightboxContext.Provider>
  )
}
