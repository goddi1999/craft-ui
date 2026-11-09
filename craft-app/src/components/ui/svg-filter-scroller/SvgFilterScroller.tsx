import { useId, type ComponentPropsWithoutRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './svg-filter-scroller.css'

export type SvgFilterScrollerProps = {
  /** Heading copy shown in the scrub stage. @default 'Scroll.' */
  text?: string
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

/**
 * Tall scroll stage whose heading is warped by an SVG displacement filter
 * driven by scroll velocity.
 */
export function SvgFilterScroller({
  text = 'Scroll.',
  className,
  style,
  ...props
}: SvgFilterScrollerProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `displacer-${uid}`

  return (
    <div
      data-slot="svg-filter-scroller"
      className={cn(className)}
      style={
        {
          '--svg-filter-scroller-filter': `url(#${filterId})`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className="svg-filter-scroller__track">
        <div className="svg-filter-scroller__scrub">
          <h1 className="svg-filter-scroller__heading">{text}</h1>
        </div>
      </div>

      <svg
        className="svg-filter-scroller__defs"
        width="0"
        height="0"
        aria-hidden="true"
      >
        <filter
          id={filterId}
          colorInterpolationFilters="sRGB"
          primitiveUnits="objectBoundingBox"
        >
          <feColorMatrix
            result="r"
            in="SourceGraphic"
            values="
			0 0 0 0 1
			0 0 0 0 0
			0 0 0 0 0
			0 0 1 0 0
		"
          />
          <feColorMatrix
            result="g"
            in="SourceGraphic"
            values="
			0 0 0 0 0
			0 0 0 0 1
			0 0 0 0 0
			0 0 1 0 0
		"
          />
          <feColorMatrix
            result="b"
            in="SourceGraphic"
            values="
			0 0 0 0 0
			0 0 0 0 0
			0 0 0 0 1
			0 0 1 0 0
		"
          />
          <feColorMatrix
            result="displace"
            in="SourceGraphic"
            values="
			0 0 0 0 0.5
			1 0 0 -1 1
			0 0 1 0 0
			0 0 0 0 1
		"
          />
          <feDisplacementMap
            result="dr"
            in="r"
            in2="displace"
            scale="0.25"
            yChannelSelector="G"
            xChannelSelector="R"
          />
          <feDisplacementMap
            result="dg"
            in="g"
            in2="displace"
            scale="0.5"
            yChannelSelector="G"
            xChannelSelector="R"
          />
          <feDisplacementMap
            result="db"
            in="b"
            in2="displace"
            scale="0.75"
            yChannelSelector="G"
            xChannelSelector="R"
          />
          <feComposite in2="dr" operator="lighter" />
          <feComposite in2="dg" operator="lighter" />
        </filter>
      </svg>
    </div>
  )
}
