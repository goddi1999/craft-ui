import { AnimatePresence, motion } from 'motion/react'

import { MORPH } from './collapsible-toc.constants'

/**
 * Swaps one label for another letter by letter. Letters are keyed by word and position in
 * the word, so a shared word ("menu") slides as a block and only the letters that differ fade.
 */
export function MorphLabel({ text, reduced }: { text: string; reduced: boolean }) {
  if (reduced) return <span>{text}</span>

  const letters = text.split(' ').flatMap((word, wordIndex) => {
    const seen: Record<string, number> = {}
    const chars = [...word].map((char) => {
      seen[char] = (seen[char] ?? 0) + 1
      return { char, key: `${wordIndex}:${char}:${seen[char]}` }
    })
    return wordIndex === 0 ? chars : [{ char: ' ', key: `${wordIndex}:space` }, ...chars]
  })

  return (
    <span aria-hidden className="relative inline-flex whitespace-pre">
      <AnimatePresence mode="popLayout" initial={false}>
        {letters.map(({ char, key }) => (
          <motion.span
            key={key}
            layout="position"
            initial={{ opacity: 0, filter: 'blur(2px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(2px)' }}
            transition={MORPH}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

/** A filled panel glyph: a rounded square with the sidebar bar knocked out. */
export function PanelGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0">
      <rect width="16" height="16" rx="4" fill="currentColor" />
      <rect x="4" y="3.5" width="2" height="9" rx="1" className="fill-background" />
    </svg>
  )
}
