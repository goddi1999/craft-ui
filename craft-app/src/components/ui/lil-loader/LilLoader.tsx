import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './lil-loader.css'

export type LilLoaderProps = {
  /** Width/height of the square frame in px. @default 120 */
  size?: number
  /** Seconds for one bar to travel the full stack. @default 3.5 */
  speed?: number
  /** Number of glowing bars in the stack. @default 10 */
  bars?: number
  /** Accessible status text announced to screen readers. @default 'Loading' */
  label?: string
  className?: string
}

/**
 * A tiny framed loader: a stack of glowing rings that rise, swell and shift
 * from pink to amber in a continuous loop.
 */
export function LilLoader({
  size = 120,
  speed = 3.5,
  bars = 10,
  label = 'Loading',
  className,
}: LilLoaderProps) {
  const style = {
    '--lil-loader-size': `${size}px`,
    '--lil-loader-speed': `${speed}s`,
    '--lil-loader-bars': bars,
  } as CSSProperties

  return (
    <div
      data-slot="lil-loader"
      role="status"
      aria-label={label}
      className={cn(className)}
      style={style}
    >
      <div className="lil-loader__stack" aria-hidden="true">
        {Array.from({ length: bars }, (_, idx) => (
          <span
            key={idx}
            className="lil-loader__bar"
            style={{ '--idx': idx } as CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
