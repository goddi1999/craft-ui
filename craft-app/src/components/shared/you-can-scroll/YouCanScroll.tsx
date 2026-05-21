import { type CSSProperties } from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './you-can-scroll.css'

import { youCanScrollVariants } from './you-can-scroll-variants'
import type { YouCanScrollProps } from './you-can-scroll.types'

const DEFAULT_WORDS = [
  'design.',
  'prototype.',
  'solve.',
  'build.',
  'develop.',
  'debug.',
  'learn.',
  'cook.',
  'ship.',
  'prompt.',
  'collaborate.',
  'create.',
  'inspire.',
  'follow.',
  'innovate.',
  'test.',
  'optimize.',
  'teach.',
  'visualize.',
  'transform.',
  'scale.',
  'do it.',
]

export function YouCanScroll({
  words = DEFAULT_WORDS,
  theme = 'system',
  animate = true,
  snap = true,
  syncScrollbar = true,
  debug = false,
  hueStart = 0,
  hueEnd = 360,
  title = "you can\nscroll.",
  endTitle = 'fin.',
  className,
  style,
  tone,
}: YouCanScrollProps & VariantProps<typeof youCanScrollVariants>) {
  const resolvedWords = words.length > 0 ? words : DEFAULT_WORDS
  const cssVars: CSSProperties = {
    ['--you-can-scroll-start' as string]: hueStart,
    ['--you-can-scroll-end' as string]: hueEnd,
    ...style,
  }

  const [lineOne, lineTwo = ''] = title.split('\n')

  return (
    <div
      data-slot="you-can-scroll"
      data-theme={theme}
      data-animate={animate ? 'true' : 'false'}
      data-snap={snap ? 'true' : 'false'}
      data-sync-scrollbar={syncScrollbar ? 'true' : 'false'}
      data-debug={debug ? 'true' : 'false'}
      className={cn(youCanScrollVariants({ tone }), className)}
      style={cssVars}
    >
      <header>
        <h1 className="you-can-scroll__fluid">
          {lineOne}
          {lineTwo ? (
            <>
              <br />
              {lineTwo}
            </>
          ) : null}
        </h1>
      </header>
      <main>
        <section className="you-can-scroll__content you-can-scroll__fluid">
          <h2>
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="you-can-scroll__sr-only">
              you can ship things.
            </span>
          </h2>
          <ul aria-hidden="true" style={{ ['--count' as string]: resolvedWords.length }}>
            {resolvedWords.map((word, index) => (
              <li key={`${word}-${index}`} style={{ ['--i' as string]: index }}>
                {word}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="you-can-scroll__fluid">{endTitle}</h2>
        </section>
      </main>
    </div>
  )
}
