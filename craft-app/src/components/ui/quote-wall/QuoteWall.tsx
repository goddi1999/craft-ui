import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { ACCENT, EASE, FOCUS_MS } from './quote-wall.constants'
import type { QuoteWallProps } from './quote-wall.types'
import { QuoteAvatar } from './quote-wall-parts'

/**
 * Testimonials set as one running paragraph, each quote led by a tiny avatar. Point at a quote
 * (or tap, or tab to it) and the rest blur back while the author's name appears beside it.
 */
export function QuoteWall({
  quotes,
  alternate = true,
  accentClassName = ACCENT,
  className,
  style,
  ...props
}: QuoteWallProps) {
  const root = useRef<HTMLParagraphElement>(null)
  const [active, setActive] = useState<string | null>(null)
  // when the name would run off the right edge it tucks under the quote's end instead
  const [flip, setFlip] = useState(false)
  const lastPointer = useRef('mouse')

  const activate = (id: string, quote: HTMLElement) => {
    const label = quote.querySelector<HTMLElement>('[data-attribution]')
    const bounds = root.current?.getBoundingClientRect()
    if (label && bounds) {
      const rect = label.getBoundingClientRect()
      // measured where it sits by default; a flipped label belongs to the previous quote
      setFlip(label.dataset.flipped !== 'true' && rect.right > bounds.right)
    }
    setActive(id)
  }

  // a tap anywhere outside lets go of the quote
  useEffect(() => {
    if (!active) return
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setActive(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [active])

  const onKeyDown = (event: KeyboardEvent<HTMLParagraphElement>) => {
    if (event.key === 'Escape' && active) {
      setActive(null)
      ;(document.activeElement as HTMLElement | null)?.blur()
    }
  }

  return (
    <p
      ref={root}
      data-slot="quote-wall"
      data-active={active ? '' : undefined}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setActive(null)
      }}
      onKeyDown={onKeyDown}
      className={cn('group/wall text-pretty text-foreground', className)}
      style={{ '--wall-ms': `${FOCUS_MS}ms`, '--wall-ease': EASE, ...style } as CSSProperties}
      {...props}
    >
      {quotes.map((quote, index) => {
        const on = quote.id === active
        return (
          <span key={quote.id}>
            <span
              tabIndex={0}
              data-on={on ? '' : undefined}
              onPointerEnter={(event) => {
                lastPointer.current = event.pointerType
                if (event.pointerType === 'mouse') activate(quote.id, event.currentTarget)
              }}
              onPointerDown={(event) => {
                lastPointer.current = event.pointerType
              }}
              onClick={(event) => {
                // mouse already focused it on hover; touch and pen tap to toggle
                if (lastPointer.current === 'mouse') return
                if (on) setActive(null)
                else activate(quote.id, event.currentTarget)
              }}
              onFocus={(event) => {
                if (!on) activate(quote.id, event.currentTarget)
              }}
              className={cn(
                'group/quote relative cursor-default rounded-sm outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring',
                'transition-[opacity,filter,color] duration-(--wall-ms) ease-(--wall-ease)',
                alternate && index % 2 === 1 && 'text-muted-foreground',
                // blurring every quote is costly on phones, where the fade alone does the job
                'group-data-active/wall:opacity-15 pointer-fine:group-data-active/wall:blur-[2.5px] motion-reduce:group-data-active/wall:blur-none',
                'data-on:text-foreground data-on:opacity-100 data-on:blur-none',
              )}
            >
              <QuoteAvatar avatar={quote.avatar} author={quote.author} />
              {quote.text}
              {/* a zero-width anchor at the quote's end, so the name never reflows the paragraph */}
              <span className="relative inline-block h-[1em] w-0 align-[-0.12em]">
                <span
                  data-attribution
                  data-flipped={on && flip ? 'true' : undefined}
                  className={cn(
                    'pointer-events-none absolute flex flex-col gap-px font-mono text-[10px] leading-tight tracking-wide whitespace-nowrap uppercase opacity-0',
                    'transition-[opacity,translate] duration-(--wall-ms) ease-(--wall-ease) motion-reduce:translate-y-0',
                    'translate-y-0.5 group-data-on/quote:translate-y-0 group-data-on/quote:opacity-100',
                    on && flip ? 'top-[1.35em] right-0 items-end' : 'top-[0.1em] left-[0.7em]',
                  )}
                >
                  <span className={accentClassName}>{quote.author}</span>
                  {quote.role && <span className="pl-[3.5ch] text-muted-foreground">{quote.role}</span>}
                </span>
              </span>
            </span>{' '}
          </span>
        )
      })}
    </p>
  )
}
