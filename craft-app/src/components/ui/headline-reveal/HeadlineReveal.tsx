import { Fragment, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  BLUR_SOFT,
  BLUR_TEXT,
  CLIP,
  KEYFRAMES,
  KEYFRAMES_HREF,
  MAX_STAGGER,
  STAGGER_WORD,
  WORD,
} from './headline-reveal.constants'
import type { HeadlineRevealProps } from './headline-reveal.types'
import { toLines } from './headline-reveal.utils'

/**
 * Reveals a headline once, as it mounts: each word rises out of its own clip while it sharpens
 * from a soft blur. The entrance runs in CSS, so it starts on first paint and never leaves text
 * hidden when scripts are slow. Change the element's `key` to replay it. Adapted from uiarc.
 */
export function HeadlineReveal({
  text,
  as: Tag = 'h2',
  delay = 0,
  id,
  className,
}: HeadlineRevealProps) {
  const { lines, count } = toLines(text)
  const step = Math.min(STAGGER_WORD, MAX_STAGGER / Math.max(count, 1))
  const blur = Tag === 'p' ? BLUR_SOFT : BLUR_TEXT
  const spoken = text.replace(/\n/g, ' ')
  // a heading takes its name from aria-label, so the sentence is read once;
  // a paragraph cannot be named, so it keeps a hidden copy
  const named = Tag !== 'p'

  return (
    <>
      <style href={KEYFRAMES_HREF} precedence="default">
        {KEYFRAMES}
      </style>
      <Tag
        id={id}
        data-slot="headline-reveal"
        aria-label={named ? spoken : undefined}
        className={cn('m-0 max-w-[24ch] overflow-visible text-balance text-foreground', className)}
        style={{ '--reveal-blur': `${blur}px` } as CSSProperties}
      >
        {named ? null : <span className="sr-only select-none">{spoken}</span>}
        {lines.map(({ words, start }, lineIndex) => (
          <Fragment key={lineIndex}>
            <span className="block" aria-hidden="true">
              {words.map((word, wordIndex) => {
                const position = start + wordIndex
                // each line break adds one more step, so a new line starts a beat later
                const wait = delay + (position + lineIndex) * step
                return (
                  <Fragment key={`${word}-${position}`}>
                    <span className={CLIP}>
                      <span
                        className={WORD}
                        style={{ '--reveal-delay': `${wait}s` } as CSSProperties}
                      >
                        {word}
                      </span>
                    </span>
                    {wordIndex < words.length - 1 ? ' ' : null}
                  </Fragment>
                )
              })}
            </span>
            {lineIndex < lines.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </Tag>
    </>
  )
}
