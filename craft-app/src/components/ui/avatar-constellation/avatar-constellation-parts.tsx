import {
  motion,
  useAnimate,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import type {
  AvatarConstellationCenter,
  AvatarConstellationSatellite,
  AvatarConstellationTint,
} from './avatar-constellation.types'
import { TINT_CLASS, orbit, outward, stackOrder, toDepth } from './avatar-constellation.utils'

const ENTRANCE = { type: 'spring', stiffness: 170, damping: 15 } as const

type CenterProps = {
  center: AvatarConstellationCenter
  tint: AvatarConstellationTint
  size: number
  reduced: boolean
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  parallax: boolean
  onActivate: () => void
}

export function AvatarConstellationDisc({
  center,
  tint,
  size,
  reduced,
  pointerX,
  pointerY,
  parallax,
  onActivate,
}: CenterProps) {
  const amp = parallax && !reduced ? -6 : 0
  const x = useTransform(pointerX, (value) => value * amp)
  const y = useTransform(pointerY, (value) => value * amp)

  return (
    <div
      className="absolute z-10"
      style={{ left: `${50 - size / 2}%`, top: `${50 - size / 2}%`, width: `${size}%`, height: `${size}%` }}
    >
      <motion.div className="size-full" style={{ x, y }}>
        <motion.button
          type="button"
          data-slot="avatar-constellation-center"
          onClick={onActivate}
          initial={reduced ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduced ? { duration: 0.2 } : { ...ENTRANCE, damping: 17 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          className={cn(
            'relative block size-full cursor-pointer overflow-hidden rounded-full',
            'bg-(--ac-tint) shadow-2xl ring-1 ring-foreground/10',
            'outline-none focus-visible:ring-4 focus-visible:ring-ring/60',
            TINT_CLASS[tint],
          )}
        >
          <img
            src={center.src}
            alt={center.name}
            draggable={false}
            className="size-full object-contain p-[9%] select-none"
          />
        </motion.button>
      </motion.div>
    </div>
  )
}

type SatelliteProps = {
  satellite: AvatarConstellationSatellite
  index: number
  reduced: boolean
  drift: boolean
  parallax: boolean
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  /** Increments on each wave. */
  wave: number
}

export function AvatarConstellationOrbiter({
  satellite,
  index,
  reduced,
  drift,
  parallax,
  pointerX,
  pointerY,
  wave,
}: SatelliteProps) {
  const { id, node, x, y, size, label } = satellite
  const depth = toDepth(satellite.depth)
  const [hot, setHot] = useState(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()

  const amp = parallax && !reduced ? 8 + depth * 26 : 0
  const px = useTransform(pointerX, (value) => value * amp)
  const py = useTransform(pointerY, (value) => value * amp)

  const path = orbit(index)
  const delay = 0.3 + index * 0.07
  const toCentre = {
    x: `${((50 - x) / size) * 100}%`,
    y: `${((50 - y) / size) * 100}%`,
  }

  useEffect(() => {
    if (wave === 0 || reduced || !scope.current) return
    const { ux, uy, distance } = outward(x, y)
    const push = 22
    animate(
      scope.current,
      { x: [0, ux * push, 0], y: [0, uy * push, 0], scale: [1, 1.14, 1] },
      { duration: 0.7, ease: 'easeOut', delay: distance * 0.003 },
    )
  }, [wave, reduced, x, y, animate, scope])

  return (
    <motion.div
      data-slot="avatar-constellation-satellite"
      data-id={id}
      className="absolute"
      style={{
        left: `${x - size / 2}%`,
        top: `${y - size / 2}%`,
        width: `${size}%`,
        height: `${size}%`,
        zIndex: hot ? 30 : stackOrder(depth),
        x: px,
        y: py,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setHot(true)}
      onHoverEnd={() => setHot(false)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <motion.div
        className="size-full"
        initial={reduced ? { opacity: 0 } : { ...toCentre, scale: 0.3, opacity: 0 }}
        animate={{ x: '0%', y: '0%', scale: 1, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.2, delay }
            : { ...ENTRANCE, delay, opacity: { duration: 0.25, delay } }
        }
      >
        <motion.div
          className="size-full"
          animate={drift && !reduced ? { x: path.x, y: path.y } : { x: 0, y: 0 }}
          transition={
            drift && !reduced
              ? { duration: path.duration, ease: 'linear', repeat: Infinity }
              : { duration: 0.4 }
          }
        >
          <div ref={scope} className="size-full">
            <div
              className={cn(
                'flex size-full items-center justify-center rounded-full',
                'bg-card text-card-foreground dark:bg-muted shadow-xl ring-1 ring-foreground/10',
                '[&>svg]:size-[48%]',
              )}
            >
              {node}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
