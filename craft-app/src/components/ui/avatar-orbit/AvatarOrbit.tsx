import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { AvatarOrbitMember } from './avatar-orbit-parts'
import type { AvatarOrbitProps } from './avatar-orbit.types'
import { SPAWN_STAGGER, place, spawnSpring } from './avatar-orbit.utils'

/**
 * A square stage with a centre slot ringed by avatars. Avatars spring out from
 * the centre in turn, drift gently, and lift on hover; optional speech bubbles
 * pop in beside them. Everything is sized in `cqw`, so the stage scales with
 * its container. Honours reduced motion by rendering the settled layout.
 */
export function AvatarOrbit({
  members,
  center,
  radius = 32,
  startAngle = -90,
  avatarSize = 26,
  bubbleTone = 'blue',
  className,
  ...props
}: AvatarOrbitProps) {
  const reduced = useReducedMotion() ?? false
  const hole = radius * 1.5

  return (
    <div
      data-slot="avatar-orbit"
      className={cn('@container relative aspect-square w-full', className)}
      {...props}
    >
      {center ? (
        <motion.div
          data-slot="avatar-orbit-center"
          className="absolute top-1/2 left-1/2"
          style={{
            width: `${hole}cqw`,
            height: `${hole}cqw`,
            marginLeft: `${-hole / 2}cqw`,
            marginTop: `${-hole / 2}cqw`,
          }}
          initial={reduced ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spawnSpring}
        >
          {center}
        </motion.div>
      ) : null}
      <ul data-slot="avatar-orbit-ring" className="absolute inset-0 m-0 list-none p-0">
        {members.map((member, index) => (
          <AvatarOrbitMember
            key={member.id}
            src={member.src}
            name={member.name}
            bubble={member.bubble}
            tone={bubbleTone}
            placement={place(member, index, members.length, radius, startAngle)}
            size={avatarSize}
            index={index}
            delay={0.1 + index * SPAWN_STAGGER}
            reduced={reduced}
          />
        ))}
      </ul>
    </div>
  )
}
