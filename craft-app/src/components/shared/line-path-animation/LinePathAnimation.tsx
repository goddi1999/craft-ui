import { useRef } from 'react'

import { cn } from '@/lib/utils'

import './line-path-animation.css'

import type { LinePathAnimationProps } from './line-path-animation.types'
import { useLinePathAnimation } from './use-line-path-animation'

const DEFAULT_STEPS = ['Perhaps.', 'We could scroll', 'to the root', 'of it.']

export function LinePathAnimation({
  theme = 'system',
  title = 'The Problem.',
  steps = DEFAULT_STEPS,
  className,
  style,
}: LinePathAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  useLinePathAnimation(rootRef)

  return (
    <div
      data-slot="line-path-animation"
      data-theme={theme}
      className={cn(className)}
      style={style}
    >
      <div ref={rootRef} className="line-path-animation__scroller">
        <main>
          <section className="line-path-animation__hero">
            <h1>{title}</h1>
          </section>
          <div className="line-path-animation__content">
            <svg viewBox="0 0 1440 4096" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="backers">
                <path d="M-3317 96H387c276.142 0 500 223.858 500 500v1064.51c0 99.41-80.589 180-180 180H434.99c-99.412 0-180.001 80.58-180.001 180V4248" />
                <path d="M4379 804H1387c-276.14 0-499.997 223.86-499.997 500v356.51c0 99.41-80.589 180-180 180H434.991c-99.411 0-180 80.59-180 180V4248" />
                <path d="M4423 96H1387.02c-276.14 0-500.001 223.858-500.001 500.001V1660.51c0 99.41-80.589 180-180 180H434.995c-99.411 0-180 80.59-180 180l.001 2227.49" />
              </g>
              <g className="fillers">
                <path d="M-3317 96H387c276.142 0 500 223.858 500 500v1064.51c0 99.41-80.589 180-180 180H434.99c-99.412 0-180.001 80.58-180.001 180V4248" />
                <path d="M4379 804H1387c-276.14 0-499.997 223.86-499.997 500v356.51c0 99.41-80.589 180-180 180H434.991c-99.411 0-180 80.59-180 180V4248" />
                <path d="M4423 96H1387.02c-276.14 0-500.001 223.858-500.001 500.001V1660.51c0 99.41-80.589 180-180 180H434.995c-99.411 0-180 80.59-180 180l.001 2227.49" />
              </g>
            </svg>
            {steps.map((step, index) => (
              <section key={step}>
                <h2 data-align={index > 1 ? 'right' : 'left'}>{step}</h2>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
