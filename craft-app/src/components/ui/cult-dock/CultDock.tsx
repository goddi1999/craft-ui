import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  CULT_DOCK_BASE_SIZE,
  CULT_DOCK_BOUNCE,
  CULT_DOCK_MAGNIFY,
  CULT_DOCK_OPACITY_SPRING,
  CULT_DOCK_RANGE,
  CULT_DOCK_WIDTH_SPRING,
} from './cult-dock.constants'
import type {
  CultDockCardInnerProps,
  CultDockCardProps,
  CultDockProps,
} from './cult-dock.types'
import { CultDockContext, useCultDock } from './use-cult-dock'

/** A macOS-style dock: cards magnify near the pointer and bounce while open. */
export function CultDock({ magnify = CULT_DOCK_MAGNIFY, className, children }: CultDockProps) {
  const mouseX = useMotionValue(Infinity)
  const reduceMotion = useReducedMotion() ?? false
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggle = useCallback((id: string) => {
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]))
  }, [])

  const value = useMemo(
    () => ({ mouseX, baseSize: CULT_DOCK_BASE_SIZE, magnify, reduceMotion, openIds, toggle }),
    [mouseX, magnify, reduceMotion, openIds, toggle],
  )

  return (
    <CultDockContext.Provider value={value}>
      <div
        data-slot="cult-dock"
        role="toolbar"
        className={cn(
          'flex h-14 items-end gap-3 rounded-xl border bg-muted/80 p-2 shadow-sm transition-colors hover:bg-muted',
          className,
        )}
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {children}
      </div>
    </CultDockContext.Provider>
  )
}

export function CultDockCard({ id, label, className, children }: CultDockCardProps) {
  const dock = useCultDock()
  const cardRef = useRef<HTMLButtonElement>(null)
  const controls = useAnimation()
  const opacity = useSpring(0, CULT_DOCK_OPACITY_SPRING)
  const isOpen = dock.openIds.includes(id)

  const distance = useTransform(dock.mouseX, (x) => {
    const bounds = cardRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - bounds.x - bounds.width / 2
  })
  const widthSync = useTransform(
    distance,
    [-CULT_DOCK_RANGE, 0, CULT_DOCK_RANGE],
    [dock.baseSize, dock.magnify, dock.baseSize],
  )
  const width = useSpring(widthSync, CULT_DOCK_WIDTH_SPRING)

  const handleClick = () => {
    dock.toggle(id)
    if (!isOpen) {
      opacity.set(0.5)
      if (!dock.reduceMotion) {
        controls.start({
          y: -CULT_DOCK_BOUNCE,
          transition: { repeat: Infinity, repeatType: 'reverse', duration: 0.5 },
        })
      }
    } else {
      opacity.set(0)
      controls.start({ y: 0, transition: { duration: dock.reduceMotion ? 0 : 0.5 } })
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        ref={cardRef}
        type="button"
        aria-label={label}
        aria-pressed={isOpen}
        className={cn(
          'aspect-square rounded-lg border bg-background brightness-90 saturate-90 outline-none transition-[filter] duration-200 hover:brightness-110 hover:saturate-100 focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        style={{ width: dock.reduceMotion ? dock.baseSize : width }}
        animate={controls}
        whileTap={dock.reduceMotion ? undefined : { scale: 0.95 }}
        onClick={handleClick}
      >
        {children}
      </motion.button>

      <AnimatePresence mode="popLayout">
        {isOpen ? (
          <motion.div key={id} layoutId={dock.reduceMotion ? undefined : id} className="rounded-full" style={{ opacity }}>
            <motion.div
              exit={{ transition: { duration: 0 } }}
              className="size-1.5 rounded-full bg-foreground"
              style={{ opacity }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function CultDockCardInner({ id, src, children }: CultDockCardInnerProps) {
  const { openIds, reduceMotion } = useCultDock()
  const isOpen = openIds.includes(id)

  return (
    <span className="relative z-0 flex size-full items-center justify-center overflow-hidden rounded-md">
      <img
        className="absolute z-10 translate-y-2.5 scale-125 opacity-40 blur-md"
        src={src}
        alt=""
      />

      <AnimatePresence>
        {isOpen && children ? (
          <motion.div
            className="relative z-0 size-full rounded-full"
            initial={reduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0, filter: 'blur(4px)' }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              transition: reduceMotion ? { duration: 0.15 } : { type: 'spring', delay: 0.2 },
            }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(4px)', transition: { duration: 0 } }}
          >
            <div className="flex size-full flex-col items-center justify-center">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {!isOpen ? (
          <motion.img
            layoutId={reduceMotion ? undefined : id}
            className="relative z-0 size-1/2 rounded-full border border-border"
            src={src}
            alt=""
          />
        ) : null}
      </AnimatePresence>
    </span>
  )
}

export function CultDockDivider() {
  const { reduceMotion } = useCultDock()
  return (
    <motion.div
      role="separator"
      aria-orientation="vertical"
      className={cn('flex h-full items-center p-1.5', !reduceMotion && 'cursor-ns-resize')}
      drag={reduceMotion ? false : 'y'}
      dragConstraints={{ top: -100, bottom: 50 }}
    >
      <span className="h-full w-0.5 rounded bg-foreground/10" />
    </motion.div>
  )
}
