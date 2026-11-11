import { useEffect, useId, type ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTime,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { Cloud } from 'lucide-react'

import {
  EASE_OUT,
  ENTER_SPRING,
  ENTER_STAGGER,
  EXIT_SPRING,
  EXIT_STAGGER,
} from './cloud-orbit.constants'
import type { CloudOrbitPerson } from './cloud-orbit.types'
import { avatarStyle, chipStyle, placeChip } from './cloud-orbit.utils'

/** The mark the loop opens and closes on: a lucide cloud with a sky-blue gradient fill. */
export function CloudMark() {
  const gradient = useId()
  return (
    <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={gradient} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#6fd8ff" />
          <stop offset="0.55" stopColor="#1fa0ff" />
          <stop offset="1" stopColor="#1668f0" />
        </linearGradient>
      </defs>
      <Cloud
        width={24}
        height={24}
        fill={`url(#${gradient})`}
        stroke={`url(#${gradient})`}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

type OrbitChipProps = {
  index: number
  count: number
  angle: MotionValue<number>
  visible: boolean
  children: ReactNode
}

export function OrbitChip({ index, count, angle, visible, children }: OrbitChipProps) {
  const reduce = useReducedMotion()
  const spread = useMotionValue(0)

  useEffect(() => {
    if (reduce) {
      spread.set(visible ? 1 : 0)
      return
    }
    // the chips start small and close to the centre, so everything grows out of the cloud
    const controls = animate(spread, visible ? 1 : 0, {
      ...(visible ? ENTER_SPRING : EXIT_SPRING),
      delay: (visible ? ENTER_STAGGER : EXIT_STAGGER) * (index + 1),
    })
    return () => controls.stop()
  }, [visible, reduce, index, spread])

  // a shared clock in seconds; reduced motion holds every chip still
  const clock = useTime()
  const time = useTransform(clock, (ms) => (reduce ? 0 : ms / 1000))

  const transform = useTransform([angle, spread, time], ([a, s, t]: number[]) =>
    placeChip(a, index, count, s, t).transform,
  )
  const zIndex = useTransform([angle, spread], ([a, s]: number[]) =>
    placeChip(a, index, count, s, 0).zIndex,
  )
  const opacity = useTransform([angle, spread], ([a, s]: number[]) =>
    placeChip(a, index, count, s, 0).opacity,
  )

  return (
    <motion.div
      data-slot="cloud-orbit-chip"
      aria-hidden
      className="absolute top-1/2 left-1/2 grid place-items-center rounded-full bg-white/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/10 will-change-transform"
      style={{ ...chipStyle, transform, zIndex, opacity }}
    >
      {children}
    </motion.div>
  )
}

/** The person in the middle; changes cross-fade through a little blur so they read as one thing. */
export function OrbitAvatar({
  person,
  visible,
}: {
  person: CloudOrbitPerson
  visible: boolean
}) {
  const reduce = useReducedMotion()
  const blur = reduce ? 'blur(0px)' : 'blur(3px)'

  return (
    <div
      data-slot="cloud-orbit-avatar"
      className="absolute top-1/2 left-1/2 z-[2]"
      style={avatarStyle}
    >
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            key={person.id}
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{ backgroundColor: person.tint }}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92, filter: blur }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.55, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              scale: reduce ? 1 : 0.96,
              filter: blur,
              // leaving is quicker than arriving, so the new person is never waiting on the old one
              transition: { duration: 0.35, ease: EASE_OUT },
            }}
          >
            <img
              src={person.src}
              alt={person.name}
              draggable={false}
              className="size-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
