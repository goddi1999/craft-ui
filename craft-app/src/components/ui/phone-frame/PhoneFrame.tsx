import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FRAME_COLORS, ISLAND_LABELS, ISLAND_SIZES, ISLAND_SPRING, POWER_BUTTON_SHADOW } from './phone-frame.constants'
import { IslandCamera, IslandContent, RailButton, StatusBar } from './phone-frame-parts'
import type { DynamicIslandSize, PhoneFrameProps } from './phone-frame.types'

export function PhoneFrame({
  children,
  dynamicIslandSize = 'default',
  frameColor = 'graphite',
  time = '9:41',
  batteryLevel = 94,
  signalStrength = 2,
  onDynamicIslandTap,
  className,
}: PhoneFrameProps) {
  const reduceMotion = useReducedMotion()
  const [internalSize, setInternalSize] = useState<DynamicIslandSize>(dynamicIslandSize)
  const size = onDynamicIslandTap ? dynamicIslandSize : internalSize
  const transition = reduceMotion ? { duration: 0 } : ISLAND_SPRING
  const material = FRAME_COLORS[frameColor]

  function handleIslandTap() {
    if (onDynamicIslandTap) {
      onDynamicIslandTap()
      return
    }
    setInternalSize((prev) => (prev === 'default' ? 'expanded' : 'default'))
  }

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <div className="relative" style={{ height: 'min(700px, 85vh)', aspectRatio: '71.5 / 149.6' }}>
        <div
          aria-hidden
          className="absolute inset-0 rounded-[55px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_12px_24px_-8px_rgba(0,0,0,0.15)]"
        />
        <div className="absolute inset-0 rounded-[55px] p-[3px]" style={{ background: material.gradient }}>
          <div className="relative size-full overflow-hidden rounded-[52px] bg-[#0a0a0a] p-[3px]">
            <div className="relative size-full overflow-hidden rounded-[49px] bg-background text-foreground">
              <StatusBar time={time} batteryLevel={batteryLevel} signalStrength={signalStrength} />

              <motion.button
                type="button"
                aria-label={ISLAND_LABELS[size]}
                onClick={handleIslandTap}
                initial={false}
                animate={ISLAND_SIZES[size]}
                transition={transition}
                className="absolute top-3 left-1/2 z-20 flex max-w-[calc(100%-18px)] -translate-x-1/2 cursor-pointer items-center justify-center overflow-hidden bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {size === 'default' ? (
                    <motion.div
                      key="camera"
                      aria-hidden
                      className="absolute right-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : undefined}
                    >
                      <IslandCamera />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={size}
                      aria-hidden
                      className="flex size-full items-center justify-center p-3 text-left"
                      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
                      transition={transition}
                    >
                      <IslandContent size={size} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="absolute inset-0 flex flex-col pt-14">{children}</div>

              <div aria-hidden className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-foreground/80" />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute top-[28%] -right-[3px] h-[65px] w-[3px] rounded-r-sm"
          style={{ background: material.button, boxShadow: POWER_BUTTON_SHADOW }}
        />
        <RailButton frameColor={frameColor} className="top-[20%] h-[22px]" />
        <RailButton frameColor={frameColor} className="top-[27%] h-[40px]" />
        <RailButton frameColor={frameColor} className="top-[36%] h-[40px]" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[55px] bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_100%)]"
        />
      </div>
    </div>
  )
}
