import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

const EASE = [0.4, 0, 0.2, 1] as const

// a white sweep clipped to the text; the pill is always dark glass over the image, so no theme swap
const SHIMMER = {
  backgroundImage:
    'linear-gradient(90deg, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.5) 60%)',
  backgroundSize: '250% 100%',
} as const

type GridRevealCaptionProps = {
  caption: string
  finished: boolean
  reduce: boolean
}

/** Frosted status pill; lines crossfade while the pill resizes to suit. */
export function GridRevealCaption({ caption, finished, reduce }: GridRevealCaptionProps) {
  return (
    <motion.div
      layout
      data-slot="grid-reveal-caption"
      className="pointer-events-none absolute bottom-3 left-3 flex h-6 items-center overflow-hidden bg-black/45 px-2.5 backdrop-blur-md"
      style={{ borderRadius: 9999 }}
      animate={{ opacity: finished ? 0 : 1 }}
      transition={{
        opacity: { duration: 0.28, ease: EASE },
        layout: { duration: 0.28, ease: EASE },
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={caption}
          layout="position"
          className={cn(
            'block text-[11px] leading-6 font-medium whitespace-nowrap',
            reduce ? 'text-white/75' : 'bg-clip-text text-transparent',
          )}
          style={reduce ? undefined : SHIMMER}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            ...(reduce || finished ? {} : { backgroundPosition: ['105% 0%', '-5% 0%'] }),
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduce ? 0 : 0.28,
            ease: EASE,
            backgroundPosition: {
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: [0.45, 0, 0.55, 1],
            },
          }}
        >
          {caption}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}
