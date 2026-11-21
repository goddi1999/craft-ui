import { motion } from 'motion/react'
import { useState } from 'react'

import {
  SpeechBubbleBody,
  SpeechBubbleRoot,
  SpeechBubbleTail,
  SpeechBubbleText,
} from '@/components/ui/speech-bubble'
import { cn } from '@/lib/utils'

import type { AvatarOrbitBubbleTone } from './avatar-orbit.types'
import {
  BUBBLE_LAG,
  BUBBLE_TONES,
  drift,
  hoverSpring,
  popSpring,
  spawnSpring,
  type Placement,
} from './avatar-orbit.utils'

type MemberProps = {
  src: string
  name: string
  bubble?: string
  tone: AvatarOrbitBubbleTone
  placement: Placement
  size: number
  index: number
  delay: number
  reduced: boolean
}

/** One avatar: springs out from the centre, drifts, lifts on hover, and carries its bubble. */
export function AvatarOrbitMember({
  src,
  name,
  bubble,
  tone,
  placement,
  size,
  index,
  delay,
  reduced,
}: MemberProps) {
  const { x, y, side } = placement
  const sign = index % 2 === 0 ? 1 : -1
  // spring out only once the image has arrived, so a slow network never shows a half-drawn face
  const [loaded, setLoaded] = useState(false)
  const shown = loaded || reduced

  return (
    <li
      data-slot="avatar-orbit-member"
      className="absolute transition-[z-index] hover:z-20"
      style={{
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        width: `${size}cqw`,
        height: `${size}cqw`,
        marginLeft: `${-size / 2}cqw`,
        marginTop: `${-size / 2}cqw`,
      }}
    >
      <motion.div
        className="size-full"
        initial={reduced ? false : { x: `${-x}cqw`, y: `${-y}cqw`, scale: 0.2, opacity: 0 }}
        animate={shown ? { x: 0, y: 0, scale: 1, opacity: 1 } : undefined}
        transition={{ ...spawnSpring, delay }}
      >
        <motion.div
          className="size-full"
          animate={
            reduced || !shown
              ? undefined
              : {
                  y: ['0cqw', `${-1.4 * sign}cqw`, '0cqw'],
                  x: ['0cqw', `${0.6 * sign}cqw`, '0cqw'],
                }
          }
          transition={drift(index, delay)}
        >
          <motion.img
            data-slot="avatar-orbit-avatar"
            src={src}
            alt={name}
            draggable={false}
            ref={(node) => {
              if (node?.complete) setLoaded(true)
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className="size-full cursor-pointer object-contain drop-shadow-[0_1.2cqw_1.6cqw_rgb(0_0_0/0.18)] select-none"
            whileHover={reduced ? undefined : { scale: 1.1, y: '-1cqw' }}
            transition={hoverSpring}
          />
        </motion.div>
      </motion.div>
      {bubble ? (
        <AvatarOrbitBubble
          tone={tone}
          side={side}
          delay={delay + BUBBLE_LAG}
          reduced={reduced}
          shown={shown}
        >
          {bubble}
        </AvatarOrbitBubble>
      ) : null}
    </li>
  )
}

type BubbleProps = {
  children: string
  tone: AvatarOrbitBubbleTone
  side: Placement['side']
  delay: number
  reduced: boolean
  shown: boolean
}

/** Decorative speech bubble; the tail sits on the corner facing its avatar. */
function AvatarOrbitBubble({ children, tone, side, delay, reduced, shown }: BubbleProps) {
  const left = side === 'left'

  return (
    <motion.span
      aria-hidden="true"
      data-slot="avatar-orbit-bubble"
      className={cn(
        'pointer-events-none absolute -top-[4cqw] z-10',
        left ? 'right-[72%] origin-bottom-right' : 'left-[72%] origin-bottom-left',
      )}
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      animate={shown ? { scale: 1, opacity: 1 } : undefined}
      transition={{ ...popSpring, delay }}
    >
      {/* tones override the bubble's colour variables, so they go after its defaults */}
      <SpeechBubbleRoot className={cn('mr-0', BUBBLE_TONES[tone])}>
        <SpeechBubbleBody className="px-[3.6cqw] py-[2.2cqw] lg:px-[3.6cqw] lg:py-[2.2cqw]">
          <SpeechBubbleTail
            side={left ? 'right' : 'left'}
            className={cn(
              'h-[3cqw] w-auto md:h-[3cqw]',
              left
                ? 'right-[-1cqw] md:right-[-1cqw] lg:right-[-1cqw]'
                : 'left-[-1cqw] md:left-[-1cqw] lg:left-[-1cqw]',
            )}
          />
          <SpeechBubbleText className="text-[3.6cqw] whitespace-nowrap md:text-[3.6cqw] lg:text-[3.6cqw]">
            {children}
          </SpeechBubbleText>
        </SpeechBubbleBody>
      </SpeechBubbleRoot>
    </motion.span>
  )
}
