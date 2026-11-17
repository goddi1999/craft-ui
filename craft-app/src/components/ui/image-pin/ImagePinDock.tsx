import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DOCK_LABEL_BLUR,
  DOCK_LABEL_IN,
  DOCK_LABEL_OUT,
  DOCK_LABEL_SCALE,
  DOCK_MAX_RADIUS,
} from './image-pin-dock.constants'
import { useImagePinDockMorph } from './use-image-pin-dock-morph'

export type ImagePinDockProps = {
  /** Hint beside the pin well — morphs the pill when it changes. */
  label: string
  /** Docked pin control; leave empty while the pin is on the image. */
  pin?: ReactNode
  className?: string
}

type Size = { width: number; height: number }

/**
 * Dashed pill under the board. When `label` changes it springs width/height
 * like MorphIsland and cross-fades the text with a short blur.
 */
export function ImagePinDock({ label, pin, className }: ImagePinDockProps) {
  const reduced = useReducedMotion() ?? false
  const measureRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const { width, height, borderRadius } = useImagePinDockMorph(size, reduced)

  useLayoutEffect(() => {
    const node = measureRef.current
    if (!node) return

    const read = () => {
      const next = { width: node.offsetWidth, height: node.offsetHeight }
      setSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      )
    }

    read()
    const observer = new ResizeObserver(read)
    observer.observe(node)
    return () => observer.disconnect()
  }, [label, pin])

  const shown = {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: DOCK_LABEL_IN,
  }
  const hidden = reduced
    ? { opacity: 0, transition: DOCK_LABEL_OUT }
    : {
        opacity: 0,
        filter: DOCK_LABEL_BLUR,
        scale: DOCK_LABEL_SCALE,
        transition: DOCK_LABEL_OUT,
      }

  const measured = size.width > 0 && size.height > 0

  return (
    <motion.div
      data-slot="image-pin-dock"
      className={cn(
        'relative self-center overflow-hidden border border-dashed border-muted-foreground/30 bg-muted/40',
        !measured && 'w-max',
        className,
      )}
      style={
        measured
          ? { width, height, borderRadius }
          : { borderRadius: DOCK_MAX_RADIUS }
      }
    >
      {/* Invisible sizer: natural width of pin well + current label */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 flex w-max items-center gap-3 py-2 pr-4 pl-2 opacity-0"
      >
        <span className="size-10 shrink-0" />
        <span className="text-sm whitespace-nowrap">{label}</span>
      </div>

      <div className="flex h-full items-center gap-3 pr-4 pl-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
          {pin}
        </span>
        <span className="relative flex min-w-0 flex-1 items-center overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={label}
              className="block text-sm whitespace-nowrap text-muted-foreground"
              initial={hidden}
              animate={shown}
              exit={hidden}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </motion.div>
  )
}
