import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { RevealSignature } from './RevealSignature'

import './intelligent-text-reveals.css'

export type IntelligentTextRevealsProps = {
  /** Rich copy to reveal (text, links, `<br />`s). Rendered three times: sizer, tinted lead and real text. */
  children: ReactNode
  /** Seconds for the wipe to travel the block. @default 1.4 */
  duration?: number
  /** Seconds before the wipe starts. @default 0.5 */
  delay?: number
  /** Tint of the blurred lead edge (any CSS color). @default 'hsl(220 73% 72% / 0.64)' */
  color?: string
  /** Blur of the lead edge in px. @default 4 */
  blur?: number
  /** Draw the hand-sketched bear signature after the copy lands. @default true */
  signature?: boolean
  className?: string
}

/**
 * A paragraph that washes in behind a sweeping radial mask, led by a tinted,
 * blurred copy that compresses the line-height as it passes. Remount (e.g.
 * change `key`) to replay.
 */
export function IntelligentTextReveals({
  children,
  duration = 1.4,
  delay = 0.5,
  color = 'hsl(220 73% 72% / 0.64)',
  blur = 4,
  signature = true,
  className,
}: IntelligentTextRevealsProps) {
  const style = {
    '--itr-duration': duration,
    '--itr-delay': delay,
    '--itr-color': color,
    '--itr-blur': blur,
  } as CSSProperties

  return (
    <div
      data-slot="intelligent-text-reveals"
      data-signature={signature}
      className={cn(className)}
      style={style}
    >
      <div className="itr__main">
        <div className="itr__container">
          <div className="itr__text" aria-hidden="true" inert>
            {children}
          </div>
          <div className="itr__dupe itr__dupe--hide" aria-hidden="true" inert>
            <div className="itr__dupe-content">{children}</div>
          </div>
          <div className="itr__dupe itr__dupe--reveal">
            <div className="itr__dupe-content">{children}</div>
          </div>
        </div>
        <hr className="itr__rule" />
        {signature && <RevealSignature />}
      </div>
    </div>
  )
}
