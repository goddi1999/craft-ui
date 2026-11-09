import { type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import './css-sprite-scrubbing.css'

const DEFAULT_FRAME_URL =
  'https://assets.codepen.io/605876/airpods-${i}.png?format=avif'

const DEFAULT_FRAME_COUNT = 65

export type CssSpriteScrubbingProps = {
  /** Number of frames (0..frameCount-1). @default 65 */
  frameCount?: number
  /**
   * URL template with `${i}` replaced by the frame index.
   * @default AirPods CodePen CDN template
   */
  frameUrl?: string
  /** Main sticky title. @default 'CSS Pro' */
  title?: string
  /** Small label above the title. @default 'All-New' */
  titleEyebrow?: string
  /** Sticky subtitle lines. @default ['Sprite Animation.', 'Now scrubbed.'] */
  subtitle?: string | string[]
  /** Autoplay the sequence instead of scroll-scrubbing. @default false */
  play?: boolean
  /** Snap translate to integer frames while scrubbing. @default true */
  steps?: boolean
  /** Scroll height of the scrub section in vh units. @default 300 */
  scrubHeightVh?: number
  /** Transition duration (s) when stepping between frames. @default 0 */
  transitionSeconds?: number
  /** Optional content below the scrub header. */
  children?: ReactNode
  /** Extra classes for the root. */
  className?: string
  /** Inline styles for the root. */
  style?: CSSProperties
}

function resolveFrameUrl(template: string, index: number) {
  return template.replaceAll('${i}', String(index)).replaceAll('{i}', String(index))
}

export function CssSpriteScrubbing({
  frameCount = DEFAULT_FRAME_COUNT,
  frameUrl = DEFAULT_FRAME_URL,
  title = 'CSS Pro',
  titleEyebrow = 'All-New',
  subtitle = ['Sprite Animation.', 'Now scrubbed.'],
  play = false,
  steps = true,
  scrubHeightVh = 300,
  transitionSeconds = 0,
  children,
  className,
  style,
}: CssSpriteScrubbingProps) {
  const frames = Math.max(1, frameCount)
  const lastFrame = frames - 1
  const subtitleLines = Array.isArray(subtitle) ? subtitle : [subtitle]

  const cssVars: CSSProperties = {
    ['--css-scrub-height' as string]: scrubHeightVh,
    ['--css-scrub-transition' as string]: transitionSeconds,
    ['--css-scrub-frames' as string]: lastFrame,
    ...style,
  }

  const trackPlayStyle: CSSProperties | undefined = play
    ? {
        animationDuration: steps ? '2s' : '60s',
        animationTimingFunction: steps ? `steps(${lastFrame})` : 'linear',
      }
    : undefined

  return (
    <div
      data-slot="css-sprite-scrubbing"
      data-play={play ? 'true' : 'false'}
      data-steps={steps ? 'true' : 'false'}
      className={cn(className)}
      style={cssVars}
    >
      <header className="css-scrub__header">
        <div className="css-scrub__title">
          <h1 className="css-scrub__heading">
            <span className="css-scrub__eyebrow">{titleEyebrow}</span>
            {title}
          </h1>
        </div>

        <div className="css-scrub__subtitle">
          <h2 className="css-scrub__subheading">
            {subtitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>

        <div className="css-scrub__timeline">
          <div className="css-scrub__track" style={trackPlayStyle}>
            {Array.from({ length: frames }, (_, index) => (
              <img
                key={index}
                src={resolveFrameUrl(frameUrl, index)}
                alt={index === 0 ? title : undefined}
                aria-hidden={index === 0 ? undefined : true}
              />
            ))}
          </div>
        </div>
      </header>

      {children ? <div className="css-scrub__body">{children}</div> : null}
    </div>
  )
}
