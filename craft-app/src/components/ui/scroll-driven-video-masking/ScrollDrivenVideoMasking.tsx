import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import './scroll-driven-video-masking.css'

export const SCROLL_DRIVEN_VIDEO_MASKING_SRC =
  'https://assets.codepen.io/605876/skateboarder--opt.mp4'

const TOP_SCRIBBLE =
  'M779.402 65.498c-194-9-503 52-503 83s387-53 387-10-523 31-523 101c0 53 784-128 784-54 0 59-937.4 72.7-937.4 141.3 0 45.7 1011.4-124.3 1011.4-75.3s-1029 83-1029 140 1158.998-162.7 1077.998-83c-65.998 65-1099.998 90-1090.998 139 8.7 47.5 1090.998-121 1090.998-53s-1067.998 21-1067.998 110c0 57 919-27 1073.998-33'

const BOTTOM_SCRIBBLE =
  'M-24 22.001c0 29 1075-54 1075-15s-1073 37-1073 76 1068-53 1068-14-1071 39-1071 77 1069-33 1069 5-890 23-890 63 718.5-9.9 716 30c-2 32-65 16-274 54'

export type ScrollDrivenVideoMaskingProps = {
  /** Video revealed through the scribbles and text. @default skateboarder clip */
  src?: string
  /** Small red label above the title. @default 'All-New' */
  eyebrow?: string
  /** Hero title. @default 'CSS Pro' */
  title?: string
  /** Hero subtitle. @default 'Scroll-driven video masks' */
  subtitle?: string
  /** Lines punched out of the mask, each fading in with its own view timeline. */
  lines?: readonly string[]
  /** Word that blurs in as the footer arrives. @default 'Rad.' */
  outro?: string
  /** Small print under the outro. @default 'Pure CSS · view() timelines' */
  note?: string
  /** Blend the mask with the video. Off shows the raw mask layer. @default true */
  blend?: boolean
  /** Outline the mask layer and scribble boxes. @default false */
  debug?: boolean
  /** Extra classes for the root. */
  className?: string
}

/**
 * A sticky video sits behind a blended mask layer. Scroll draws thick
 * scribbles across it with `view()` timelines, then punches lines of text
 * through, so the footage only shows where the ink is.
 */
export function ScrollDrivenVideoMasking({
  src = SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  eyebrow = 'All-New',
  title = 'CSS Pro',
  subtitle = 'Scroll-driven video masks',
  lines = ['All CSS. All powerful.', 'Drop HTML. Style it up.', 'You got this.'],
  outro = 'Rad.',
  note = 'Pure CSS · view() timelines',
  blend = true,
  debug = false,
  className,
}: ScrollDrivenVideoMaskingProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // React does not reflect `muted` as an attribute, and autoplay needs it.
    video.muted = true

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      if (reducedMotion.matches) {
        video.pause()
        return
      }
      void video.play().catch(() => undefined)
    }

    handleMotionChange()
    reducedMotion.addEventListener('change', handleMotionChange)
    return () => reducedMotion.removeEventListener('change', handleMotionChange)
  }, [src])

  return (
    <div
      data-slot="scroll-driven-video-masking"
      data-blend={blend}
      data-debug={debug}
      className={cn(className)}
    >
      <header className="sdvm__header">
        <h2 className="sdvm__title sdvm__fluid">
          <span>{eyebrow}</span>
          {title}
        </h2>
        <p className="sdvm__subtitle sdvm__fluid">{subtitle}</p>
      </header>

      <section className="sdvm__section">
        <div className="sdvm__content">
          <svg
            viewBox="0 0 1025 437"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={TOP_SCRIBBLE}
              strokeWidth="80"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
            />
          </svg>
          <div className="sdvm__text">
            <p className="sdvm__fluid">
              {lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <svg
            viewBox="0 0 1025 370"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={BOTTOM_SCRIBBLE}
              strokeWidth="80"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
            />
          </svg>
          <div className="sdvm__buffer" />
        </div>
        <div className="sdvm__stick">
          <video
            ref={videoRef}
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
      </section>

      <footer className="sdvm__footer">
        <p className="sdvm__outro sdvm__fluid">{outro}</p>
        <p className="sdvm__note">{note}</p>
      </footer>
    </div>
  )
}
