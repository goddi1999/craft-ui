import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CLOUD_MS,
  COLLAPSE_MS,
  EASE_OUT,
  SWAP_SPRING,
} from './cloud-orbit.constants'
import type { CloudOrbitProps } from './cloud-orbit.types'
import { SWAP_ANGLE } from './cloud-orbit.utils'
import { CloudMark, OrbitAvatar, OrbitChip } from './cloud-orbit-parts'

type Phase = 'cloud' | 'orbit' | 'collapse'

/**
 * Cloud → person with orbiting app chips → next person … → back into the cloud, on a loop.
 * Built for a dark surface: the chips are translucent white.
 */
export function CloudOrbit({
  people,
  items,
  cloud,
  hold = 2600,
  paused = false,
  className,
  style,
  ...props
}: CloudOrbitProps) {
  const reduce = useReducedMotion()
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const running = inView && !paused && people.length > 0

  const [phase, setPhase] = useState<Phase>('cloud')
  const [index, setIndex] = useState(0)
  const angle = useMotionValue(-Math.PI / 2 + 0.4)

  useEffect(() => {
    if (!running) return
    const timers: number[] = []
    let cancelled = false
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)))

    const loop = async () => {
      while (!cancelled) {
        setIndex(0)
        setPhase('cloud')
        await wait(CLOUD_MS)
        setPhase('orbit')
        for (let i = 0; i < people.length && !cancelled; i++) {
          setIndex(i)
          await wait(hold)
        }
        setPhase('collapse')
        await wait(COLLAPSE_MS)
      }
    }
    void loop()

    return () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
    }
  }, [running, people.length, hold])

  // each change of person turns the whole orbit, so the chips trade places instead of teleporting
  const turned = useRef(0)
  useEffect(() => {
    if (index === turned.current) return
    turned.current = index
    if (index === 0) return
    const target = angle.get() + SWAP_ANGLE
    if (reduce) angle.set(target)
    else animate(angle, target, SWAP_SPRING)
  }, [index, angle, reduce])

  const showScene = phase === 'orbit'
  const person = people[Math.min(index, people.length - 1)]

  return (
    <div
      ref={stage}
      data-slot="cloud-orbit"
      data-phase={phase}
      role="img"
      aria-label="An account connecting people and apps"
      className={cn('relative aspect-square w-full overflow-hidden', className)}
      style={{ containerType: 'inline-size', ...style }}
      {...props}
    >
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 z-[4] -mt-[48cqw] -ml-[48cqw] aspect-square w-[96cqw]"
        initial={false}
        animate={{
          opacity: showScene ? 0 : 1,
          scale: showScene ? 0.7 : 1,
          filter: showScene && !reduce ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{ duration: showScene ? 0.45 : 0.3, ease: EASE_OUT }}
      >
        {cloud ?? <CloudMark />}
      </motion.div>

      {person && <OrbitAvatar person={person} visible={showScene} />}

      {items.map((item, i) => (
        <OrbitChip
          key={item.id}
          index={i}
          count={items.length}
          angle={angle}
          visible={showScene}
        >
          {item.node}
        </OrbitChip>
      ))}

      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  )
}
