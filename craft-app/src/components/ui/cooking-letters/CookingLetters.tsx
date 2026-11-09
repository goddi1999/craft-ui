import { Fragment, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { COOKING_LETTERS_LINES, splitLine } from './cooking-letters.utils'

import './cooking-letters.css'

export type CookingLettersProps = {
  /** One paragraph per entry; each character becomes a rolling cube. @default COOKING_LETTERS_LINES */
  lines?: readonly string[]
  /** Seconds for one roll cycle. @default 2.2 */
  duration?: number
  /** Tilt the stage in 3D and isolate one line to show how the cubes work. @default false */
  debug?: boolean
  /** In debug mode, drive the roll manually with `progress` instead of looping. @default false */
  scrub?: boolean
  /** Manual roll position (0–100) used when `debug` and `scrub` are on. @default 0 */
  progress?: number
  className?: string
}

/**
 * Lines of type whose letters roll over like little cubes in a staggered,
 * sine-eased wave — pure CSS 3D transforms.
 */
export function CookingLetters({
  lines = COOKING_LETTERS_LINES,
  duration = 2.2,
  debug = false,
  scrub = false,
  progress = 0,
  className,
}: CookingLettersProps) {
  const focusIndex = Math.min(1, lines.length - 1)
  const style = {
    '--cooking-letters-duration': `${duration}s`,
    '--cooking-letters-progress': progress,
  } as CSSProperties

  return (
    <div
      data-slot="cooking-letters"
      data-debug={debug}
      data-scrub={scrub}
      className={cn(className)}
      style={style}
    >
      {lines.map((line, lineIndex) => {
        const { words, total } = splitLine(line)

        return (
          <p
            key={`${line}-${lineIndex}`}
            className="cooking-letters__line"
            data-focus={lineIndex === focusIndex ? '' : undefined}
            style={
              { '--idx': lineIndex, '--char-total': total } as CSSProperties
            }
          >
            <span className="sr-only">{line}</span>
            <span className="cooking-letters__glyphs" aria-hidden="true">
              {words.map((word, wordIndex) => (
                <Fragment key={wordIndex}>
                  {wordIndex > 0 && ' '}
                  <span className="cooking-letters__word">
                    {word.chars.map(({ char, index }) => (
                      <span
                        key={index}
                        className="cooking-letters__char"
                        data-char={char}
                        style={{ '--char-index': index } as CSSProperties}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
          </p>
        )
      })}
    </div>
  )
}
