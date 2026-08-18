import { type VariantProps } from 'class-variance-authority'
import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './scroll-to-type.css'

import { scrollToTypeVariants } from './scroll-to-type-variants'
import type { ScrollToTypeProps } from './scroll-to-type.types'

export function ScrollToType({
  text,
  theme = 'system',
  size = 'default',
  length = 'default',
  cursorHue,
  className,
  style,
  ...props
}: ScrollToTypeProps & VariantProps<typeof scrollToTypeVariants>) {
  // The trailing space gives the caret somewhere to land past the last glyph,
  // which is why the step count is one more than the text length.
  const typed = `${text} `

  const cssVars = {
    '--scroll-to-type-length': typed.length,
    ...(cursorHue === undefined
      ? null
      : { '--scroll-to-type-cursor-hue': cursorHue }),
    ...style,
  } as CSSProperties

  return (
    <section
      data-slot="scroll-to-type"
      data-theme={theme}
      data-size={size}
      data-length={length}
      className={cn(scrollToTypeVariants({ size, length }), className)}
      style={cssVars}
      {...props}
    >
      <div data-slot="scroll-to-type-viewport">
        <h2 data-slot="scroll-to-type-line">
          <span data-slot="scroll-to-type-text">{typed}</span>
        </h2>
      </div>
    </section>
  )
}
