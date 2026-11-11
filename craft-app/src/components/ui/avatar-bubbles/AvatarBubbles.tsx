import { useMotionValue, useReducedMotion } from 'motion/react'
import { useState, type PointerEvent } from 'react'

import { cn } from '@/lib/utils'

import { AvatarBubblesItem } from './avatar-bubbles-parts'
import type { AvatarBubblesProps } from './avatar-bubbles.types'

/**
 * A rounded card that clips a loose cluster of pastel avatar circles, bleeding
 * off its edges. Bubbles spring in staggered, float out of sync, lift on hover
 * while the rest dim, and drift subtly with the pointer. Children sit bottom
 * left, `action` bottom right.
 */
export function AvatarBubbles({
  bubbles,
  children,
  action,
  parallax = true,
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: AvatarBubblesProps) {
  const reduced = useReducedMotion() ?? false
  const [hovered, setHovered] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const pointer = parallax && !reduced ? { x, y } : undefined

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const handleLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      data-slot="avatar-bubbles"
      className={cn(
        '@container relative isolate aspect-[4/3] w-full overflow-hidden rounded-[clamp(1.5rem,5cqw,2.5rem)] border bg-card text-card-foreground shadow-sm',
        className,
      )}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      <div data-slot="avatar-bubbles-field" className="absolute inset-0">
        {bubbles.map((bubble, index) => (
          <AvatarBubblesItem
            key={bubble.id}
            bubble={bubble}
            index={index}
            reduced={reduced}
            hovered={hovered}
            onHover={setHovered}
            pointer={pointer}
          />
        ))}
      </div>

      {children ? (
        <div
          data-slot="avatar-bubbles-content"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-[6cqw]"
        >
          {children}
        </div>
      ) : null}

      {action ? (
        <div data-slot="avatar-bubbles-action-slot" className="absolute right-[4cqw] bottom-[4cqw] z-10">
          {action}
        </div>
      ) : null}
    </div>
  )
}
