import { useId, useMemo, useRef, type CSSProperties } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './curved-scrollbar.css'

import { CurvedScrollbarProvider } from './curved-scrollbar-context'
import { curvedScrollbarVariants } from './curved-scrollbar-variants'
import type { CurvedScrollbarProps } from './curved-scrollbar.types'
import { useCurvedScrollbar } from './use-curved-scrollbar'

const toLength = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value

export function CurvedScrollbar({
  children,
  theme = 'system',
  enabled = true,
  width,
  height,
  radius = 32,
  scrollPadding = 60,
  stroke = 5,
  inset = 6,
  trail = 20,
  thumbSize = 70,
  thumbAlpha = 0.9,
  trackAlpha = 0,
  color = '#f85922',
  size,
  className,
  style,
}: CurvedScrollbarProps & VariantProps<typeof curvedScrollbarVariants>) {
  const animationName = `curved-scrollbar-${useId().replace(/:/g, '')}`
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<SVGSVGElement>(null)
  const thumbRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGPathElement>(null)
  const styleRef = useRef<HTMLStyleElement>(null)

  const scrollbarConfig = useMemo(
    () => ({
      radius,
      scrollPadding,
      stroke,
      inset,
      trail,
      thumbSize,
      finish: 5,
      offsetCorner: -50,
      offsetEnd: 30,
    }),
    [inset, radius, scrollPadding, stroke, thumbSize, trail],
  )

  // Width and height only override the size preset when they are passed.
  const cssVars: CSSProperties = {
    ['--curved-scrollbar-width' as string]: toLength(width),
    ['--curved-scrollbar-height' as string]: toLength(height),
    ['--curved-scrollbar-radius' as string]: radius,
    ['--curved-scrollbar-padding' as string]: `${scrollPadding}px`,
    ['--curved-scrollbar-stroke-width' as string]: stroke,
    ['--curved-scrollbar-color' as string]: color,
    ['--curved-scrollbar-thumb-size' as string]: thumbSize,
    ['--curved-scrollbar-thumb-alpha' as string]: thumbAlpha,
    ['--curved-scrollbar-track-alpha' as string]: trackAlpha,
    ['--curved-scrollbar-animation-name' as string]: animationName,
    ...style,
  }

  useCurvedScrollbar({
    rootRef,
    viewportRef,
    barRef,
    thumbRef,
    trackRef,
    styleRef,
    animationName,
    config: scrollbarConfig,
  })

  return (
    <CurvedScrollbarProvider viewportRef={viewportRef}>
      <section
        ref={rootRef}
        data-slot="curved-scrollbar"
        data-theme={theme}
        data-rounded-scroll={enabled ? 'true' : 'false'}
        className={cn(curvedScrollbarVariants({ size }), className)}
        style={cssVars}
      >
        <svg
          ref={barRef}
          className="curved-scrollbar__bar"
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            ref={thumbRef}
            className="curved-scrollbar__thumb"
            fill="none"
            strokeLinecap="round"
          />
          <path
            ref={trackRef}
            className="curved-scrollbar__track"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <style ref={styleRef} />

        {children}
      </section>
    </CurvedScrollbarProvider>
  )
}
