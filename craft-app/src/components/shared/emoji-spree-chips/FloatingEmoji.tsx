import { useState } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { useIsMobile } from './use-is-mobile'

type FloatingEmojiProps = {
  emoji: string
  delay: number
  xOffset: number
  rotate: number
}

/** One emoji thrown up over the chips and dropped back down behind them. */
export function FloatingEmoji({
  emoji,
  delay,
  xOffset,
  rotate,
}: FloatingEmojiProps) {
  const [isAboveChips, setIsAboveChips] = useState(true)
  const isMobile = useIsMobile()

  const peakY = isMobile ? -180 : -260
  const peakScale = isMobile ? 2 : 3
  const layerThreshold = isMobile ? -90 : -130

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.6, rotate: 0 }}
      animate={{
        y: [0, peakY, peakY, 30],
        x: [0, xOffset * (isMobile ? 0.6 : 1), xOffset * (isMobile ? 0.5 : 0.8)],
        opacity: [0, 1, 1, 0],
        scale: [0.6, peakScale, peakScale, 0.6],
        rotate: [0, rotate, rotate * 0.5],
      }}
      transition={{ duration: 1, ease: 'easeInOut', delay }}
      onUpdate={(latest) => {
        if (typeof latest.y === 'number') {
          setIsAboveChips(latest.y < layerThreshold)
        }
      }}
      className={cn(
        'absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl sm:text-6xl',
        isAboveChips ? 'z-30' : 'z-10',
      )}
    >
      {emoji}
    </motion.div>
  )
}
