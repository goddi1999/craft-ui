import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { SpeechBubbleRoot, SpeechBubbleTail } from '@/components/ui/speech-bubble'
import { cn } from '@/lib/utils'

import {
  DEFAULT_AVATAR_SIZE,
  DEFAULT_BOUNCE,
  DEFAULT_DURATION,
  DEFAULT_MAX_WIDTH,
  EXIT_RATIO,
  TEXT_BLUR,
  TEXT_SHIFT,
} from './morphing-speech-bubble.constants'
import type { MorphingSpeechBubbleProps } from './morphing-speech-bubble.types'
import { useMeasure } from './use-measure'

/**
 * An avatar with a speech bubble that springs to the size of each new message,
 * like the dynamic island: the shell morphs while the old text blurs out and the new one blurs in.
 */
export function MorphingSpeechBubble({
  message,
  avatarSrc,
  name,
  tone = 'blue',
  side = 'left',
  duration = DEFAULT_DURATION,
  bounce = DEFAULT_BOUNCE,
  blur = true,
  maxWidth = DEFAULT_MAX_WIDTH,
  avatarSize = DEFAULT_AVATAR_SIZE,
  className,
}: MorphingSpeechBubbleProps) {
  const reduced = useReducedMotion() === true
  const [contentRef, size] = useMeasure<HTMLDivElement>()
  const avatarLeft = side === 'left'
  const measured = size.width > 0

  const shell = reduced ? { duration: 0 } : { type: 'spring' as const, duration, bounce }
  const hidden = {
    opacity: 0,
    y: reduced ? 0 : TEXT_SHIFT,
    filter: blur && !reduced ? TEXT_BLUR : 'blur(0px)',
  }

  return (
    <div
      data-slot="morphing-speech-bubble"
      className={cn('flex items-end gap-3', !avatarLeft && 'flex-row-reverse', className)}
    >
      <img
        src={avatarSrc}
        alt={name}
        width={avatarSize}
        height={avatarSize}
        className="shrink-0 rounded-full bg-muted object-cover select-none"
        style={{ width: avatarSize, height: avatarSize }}
        draggable={false}
      />

      <SpeechBubbleRoot tone={tone} className="relative mr-0">
        <SpeechBubbleTail
          side={side}
          className={cn(
            'h-7 md:h-7',
            avatarLeft
              ? 'left-[-10px] md:left-[-10px] lg:left-[-10px]'
              : 'right-[-10px] md:right-[-10px] lg:right-[-10px]',
          )}
        />
        <motion.div
          aria-hidden="true"
          className="relative overflow-hidden rounded-[28px] bg-(--speech-bubble-bg) text-(--speech-bubble-fg)"
          initial={false}
          // until the first measurement the box sizes itself, so mounting never springs open from zero
          animate={measured ? { width: size.width, height: size.height } : undefined}
          transition={shell}
        >
          {/* measured box: sized by the incoming message only, the outgoing one is taken out of flow */}
          <div ref={contentRef} className="w-max px-6 py-4" style={{ maxWidth }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={message}
                className="text-xl leading-[1.05] font-semibold tracking-[-0.05em] text-pretty"
                initial={hidden}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{
                  ...hidden,
                  y: reduced ? 0 : -TEXT_SHIFT,
                  transition: {
                    duration: duration * EXIT_RATIO,
                    ease: [0.23, 1, 0.32, 1],
                  },
                }}
                transition={{
                  duration: duration * 0.8,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {message}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
        <span className="sr-only" aria-live="polite">
          {name}: {message}
        </span>
      </SpeechBubbleRoot>
    </div>
  )
}
