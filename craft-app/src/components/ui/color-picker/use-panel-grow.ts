import { animate, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

import {
  CLOSE_SPRING,
  CLOSED_RADIUS,
  CONTENT_RISE,
  DURATION,
  EASE_STANDARD,
  OPEN_RADIUS_GROWTH,
  OPEN_SPRING,
} from './color-picker.constants'
import { clamp, round } from './color-picker.utils'

/**
 * Grows the trigger's box into the panel's box with one progress value, as a clip that springs
 * open; the content fades in behind the leading edge. The panel stays mounted (`shown`) until
 * the closing animation finishes. Reduced motion crossfades instead.
 */
export function usePanelGrow({
  open,
  reduced,
  panelRef,
  triggerRef,
}: {
  open: boolean
  reduced: boolean
  panelRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
}) {
  const [shown, setShown] = useState(open)
  if (open && !shown) setShown(true)
  // read when a closing animation finishes, so a quick reopen keeps the panel
  const openNow = useRef(open)

  const progress = useMotionValue(0)
  const fade = useMotionValue(0)
  const panelWidth = useMotionValue(300)
  const panelHeight = useMotionValue(420)
  const triggerWidth = useMotionValue(160)
  const triggerHeight = useMotionValue(44)

  const clipPath = useTransform(() => {
    const q = clamp(progress.get())
    const right = round((panelWidth.get() - triggerWidth.get()) * (1 - q), 2)
    const bottom = round((panelHeight.get() - triggerHeight.get()) * (1 - q), 2)
    const radius = round(CLOSED_RADIUS + OPEN_RADIUS_GROWTH * q, 2)
    return `inset(0px ${right}px ${bottom}px 0px round ${radius}px)`
  })
  const contentOpacity = useTransform(progress, [0.35, 0.9], [0, 1])
  const contentY = useTransform(progress, [0, 1], [CONTENT_RISE, 0])

  useEffect(() => {
    openNow.current = open
  }, [open])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const trigger = triggerRef.current
    if (!shown || !panel || !trigger) return
    const measure = () => {
      panelWidth.set(panel.offsetWidth)
      panelHeight.set(panel.offsetHeight)
      triggerWidth.set(trigger.offsetWidth)
      triggerHeight.set(trigger.offsetHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [shown, panelRef, triggerRef, panelWidth, panelHeight, triggerWidth, triggerHeight])

  useEffect(() => {
    if (!shown) return
    if (reduced) {
      progress.jump(open ? 1 : progress.get())
      const controls = animate(fade, open ? 1 : 0, {
        duration: DURATION.fast,
        ease: EASE_STANDARD,
      })
      controls.then(() => {
        if (openNow.current) return
        progress.jump(0)
        setShown(false)
      })
      return () => controls.stop()
    }
    fade.jump(1)
    const controls = animate(progress, open ? 1 : 0, open ? OPEN_SPRING : CLOSE_SPRING)
    if (!open)
      controls.then(() => {
        if (!openNow.current) setShown(false)
      })
    return () => controls.stop()
  }, [fade, open, progress, reduced, shown])

  return { shown, clipPath, opacity: fade, contentOpacity, contentY }
}
