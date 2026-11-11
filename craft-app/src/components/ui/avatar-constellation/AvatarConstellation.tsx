import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState, type PointerEvent } from 'react'

import { cn } from '@/lib/utils'

import {
  AvatarConstellationDisc,
  AvatarConstellationOrbiter,
} from './avatar-constellation-parts'
import type { AvatarConstellationProps } from './avatar-constellation.types'
import { clamp } from './avatar-constellation.utils'

const POINTER_SPRING = { stiffness: 120, damping: 20, mass: 0.6 }

/**
 * A large avatar disc ringed by smaller tiles. On mount the disc scales in and
 * the tiles spring out from behind it; they then drift in slow circles, lean
 * with the pointer (nearer ones more) and pulse outward when the avatar is
 * clicked. Satellites are plain data, so any icon or element fits a tile.
 */
export function AvatarConstellation({
  center,
  satellites,
  tint = 'lavender',
  centerSize = 38,
  drift = true,
  parallax = true,
  onCenterClick,
  header,
  children,
  stageClassName,
  className,
  ...props
}: AvatarConstellationProps) {
  const reduced = useReducedMotion() ?? false
  const [wave, setWave] = useState(0)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, POINTER_SPRING)
  const pointerY = useSpring(rawY, POINTER_SPRING)

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set(clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1))
    rawY.set(clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1))
  }

  const handleLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const handleCenter = () => {
    setWave((count) => count + 1)
    onCenterClick?.()
  }

  return (
    <div
      data-slot="avatar-constellation"
      className={cn('flex w-full flex-col items-center gap-2', className)}
      {...props}
    >
      {header}
      <div
        data-slot="avatar-constellation-stage"
        className={cn('relative aspect-square w-full max-w-lg', stageClassName)}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {satellites.map((satellite, index) => (
          <AvatarConstellationOrbiter
            key={satellite.id}
            satellite={satellite}
            index={index}
            reduced={reduced}
            drift={drift}
            parallax={parallax}
            pointerX={pointerX}
            pointerY={pointerY}
            wave={wave}
          />
        ))}
        <AvatarConstellationDisc
          center={center}
          tint={tint}
          size={centerSize}
          reduced={reduced}
          pointerX={pointerX}
          pointerY={pointerY}
          parallax={parallax}
          onActivate={handleCenter}
        />
      </div>
      {children}
    </div>
  )
}
