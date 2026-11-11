import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Emoji } from './emoji-reaction-emoji'
import { SmileIcon } from './emoji-reaction-smile-icon'
import { EASE_OUT, type SIZES } from './emoji-reaction.constants'
import type { EmojiData } from './emoji-reaction.types'

type TriggerGlyphProps = {
  open: boolean
  /** The last reaction sent, shown on the closed trigger. */
  last: string | null
  data: EmojiData
  size: (typeof SIZES)[keyof typeof SIZES]
  reduced: boolean
}

/**
 * The trigger shows a smile, the close mark, or the last reaction. Swapping
 * between them cross-fades through a little blur, so it reads as one button
 * changing instead of two icons trading places.
 */
export function TriggerGlyph({ open, last, data, size, reduced }: TriggerGlyphProps) {
  const key = open ? 'close' : (last ?? 'smile')
  const hidden = { opacity: 0, scale: reduced ? 1 : 0.7, filter: reduced ? 'blur(0px)' : 'blur(2px)' }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={key}
        className="grid place-items-center"
        initial={hidden}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={hidden}
        transition={{ duration: reduced ? 0.1 : 0.18, ease: EASE_OUT }}
      >
        {open ? (
          <X className={size.icon} strokeWidth={2} />
        ) : last ? (
          <Emoji name={last} data={data} size={size.emoji * 0.72} />
        ) : (
          <SmileIcon className={size.icon} />
        )}
      </motion.span>
    </AnimatePresence>
  )
}
