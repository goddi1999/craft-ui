import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './text-reveal.css'

import { textRevealVariants } from './text-reveal-variants'
import type { TextRevealProps } from './text-reveal.types'

export function TextReveal({
  text,
  size = 'default',
  length = 'default',
  accent = 'cyan',
  debug = false,
  className,
  style,
  ...props
}: TextRevealProps & VariantProps<typeof textRevealVariants>) {
  return (
    <section
      data-slot="text-reveal"
      data-size={size}
      data-length={length}
      data-accent={accent}
      data-debug={debug}
      className={cn(textRevealVariants({ size, length, accent }), className)}
      style={style}
      {...props}
    >
      <div data-slot="text-reveal-viewport">
        {/* The fill lives on an inline span so every wrapped line gets its own slice of the sweep. */}
        <p data-slot="text-reveal-line">
          <span data-slot="text-reveal-text">{text}</span>
        </p>
      </div>
    </section>
  )
}
