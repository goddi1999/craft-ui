import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { AvatarBubble, AvatarBubblesActionProps } from './avatar-bubbles.types'
import { TONE_CLASS } from './avatar-bubbles.utils'

const ENTER = { type: 'spring', stiffness: 220, damping: 16, mass: 0.8 } as const
const LIFT = { type: 'spring', stiffness: 380, damping: 26 } as const

type BubbleProps = {
  bubble: AvatarBubble
  index: number
  reduced: boolean
  hovered: string | null
  onHover: (id: string | null) => void
  /** Pointer position in -0.5..0.5, or undefined when parallax is off. */
  pointer?: { x: MotionValue<number>; y: MotionValue<number> }
}

export function AvatarBubblesItem({ bubble, index, reduced, hovered, onHover, pointer }: BubbleProps) {
  const fallback = useMotionValue(0)
  // smaller bubbles sit "closer" and move further
  const depth = 36 - bubble.size * 0.5
  const px = useSpring(useTransform(pointer?.x ?? fallback, (v) => v * depth), { stiffness: 90, damping: 18 })
  const py = useSpring(useTransform(pointer?.y ?? fallback, (v) => v * depth), { stiffness: 90, damping: 18 })

  const active = hovered === bubble.id
  const dimmed = hovered !== null && !active

  return (
    <div
      data-slot="avatar-bubbles-item"
      className="absolute"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: `${bubble.size}%`,
        aspectRatio: '1',
      }}
    >
      <motion.div
        className="size-full"
        initial={reduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...ENTER, delay: 0.1 + index * 0.09 }}
        style={{ originX: 0.5, originY: 0.5, x: pointer && !reduced ? px : 0, y: pointer && !reduced ? py : 0 }}
      >
        <motion.div
          className="size-full"
          animate={reduced ? undefined : { y: [0, -6, 0, 5, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
          transition={{ duration: 7 + index * 1.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
        >
          <motion.div
            data-tone={bubble.tone}
            className={cn(
              'size-full overflow-hidden rounded-full bg-(--bubble) select-none',
              TONE_CLASS[bubble.tone],
            )}
            animate={{
              scale: active && !reduced ? 1.06 : 1,
              y: active && !reduced ? '-3%' : '0%',
              opacity: dimmed ? 0.7 : 1,
            }}
            transition={LIFT}
            onPointerEnter={() => onHover(bubble.id)}
            onPointerLeave={() => onHover(null)}
          >
            <img
              src={bubble.src}
              alt={bubble.name}
              draggable={false}
              className="size-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Round "+" button for the `action` slot; the plus turns 45° on hover or press. */
export function AvatarBubblesAction({
  className,
  children,
  'aria-label': label = 'Add',
  ...props
}: AvatarBubblesActionProps) {
  return (
    <Button
      data-slot="avatar-bubbles-action"
      type="button"
      variant="secondary"
      size="icon-lg"
      aria-label={label}
      className={cn('group/action rounded-full', className)}
      {...props}
    >
      {children ?? (
        <Plus
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover/action:rotate-45 group-active/action:rotate-45 group-focus-visible/action:rotate-45 motion-reduce:transition-none"
        />
      )}
    </Button>
  )
}
