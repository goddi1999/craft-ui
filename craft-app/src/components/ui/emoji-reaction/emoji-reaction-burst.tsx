import { motion } from 'motion/react'
import { memo } from 'react'

import { EASE, SWAY } from './emoji-reaction.constants'
import { Emoji } from './emoji-reaction-emoji'
import type { EmojiData, Particle } from './emoji-reaction.types'

type BurstEmojiProps = {
  particle: Particle
  size: number
  data: EmojiData
  onDone: (id: number) => void
}

// memo, a parent render restarts the flight and replays its delay
export const BurstEmoji = memo(function BurstEmoji({ particle, size, data, onDone }: BurstEmojiProps) {
  return (
    <motion.span
      className="pointer-events-none absolute z-0 will-change-transform"
      style={{
        left: particle.originX,
        top: particle.originY,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{
        x: particle.x,
        y: 0,
        scale: 0.6,
        opacity: 0,
        rotate: 0,
        filter: 'blur(0px)',
      }}
      animate={{
        // shares the parent ease with y, any override here bends the path sideways
        x: particle.x + particle.drift,
        y: -particle.travel,
        scale: [0.6, particle.scale * 1.15, particle.scale, particle.scale * 0.75],
        rotate: [0, particle.tilt, -particle.tilt * 0.65, particle.tilt * 0.35],
        opacity: [0, 1, 1, 0],
        filter: ['blur(0px)', 'blur(0px)', `blur(${particle.blurRatio * size}px)`],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: EASE,
        // inherit, a per value transition replaces the parent one without it
        rotate: { inherit: true, times: SWAY, ease: 'easeInOut' },
        scale: { inherit: true, times: [0, 0.1, 0.22, 1], ease: 'easeOut' },
        opacity: {
          inherit: true,
          times: [0, 0.03, particle.fadeAt, 1],
          ease: 'linear',
        },
        // no ease override, blur has to track the climb curve or it lags the rise
        filter: { inherit: true, times: [0, 0.12, 1] },
      }}
      onAnimationComplete={() => onDone(particle.id)}
    >
      <Emoji name={particle.name} data={data} size={size} />
    </motion.span>
  )
})
