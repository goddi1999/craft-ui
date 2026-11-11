import { useId, type CSSProperties, type ReactNode } from 'react'
import {
  Camera,
  KeyRound,
  Presentation,
  Share2,
  Star,
  Volume2,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import './scroll-driven-gooey-island.css'

const DEFAULT_AVATAR =
  'https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg'

export type ScrollDrivenGooeyIslandProps = {
  /** Display name under the avatar. @default 'Your Name.' */
  name?: string
  /** Avatar image URL. */
  avatarSrc?: string
  /** Accessible alt text for the avatar. @default 'Your avatar' */
  avatarAlt?: string
  /** Settings / action list below the sticky header. */
  children?: ReactNode
  /** Extra classes for the root. */
  className?: string
  /**
   * Inline styles for the root. Set `--sdgi-frame-height` to size the frame
   * (default `100svh`); the content scrolls inside it.
   */
  style?: CSSProperties
}

function DefaultSettingsList() {
  return (
    <ul className="sdgi__list">
      <li>
        <button type="button">
          <Camera aria-hidden="true" strokeWidth={1.5} />
          Change Profile Photo
        </button>
      </li>
      <li>
        <div className="sdgi__context">
          <Star aria-hidden="true" strokeWidth={1.5} />
          <p>Your account is protected by 2-Step Verification.</p>
        </div>
        <button type="button">
          <KeyRound aria-hidden="true" strokeWidth={1.5} />
          Reset Password
        </button>
      </li>
      <li>
        <button type="button">
          <Presentation aria-hidden="true" strokeWidth={1.5} />
          Your Activity
        </button>
      </li>
      <li>
        <button type="button">
          <Volume2 aria-hidden="true" strokeWidth={1.5} />
          Ad Preferences
        </button>
      </li>
      <li>
        <button type="button">
          <Share2 aria-hidden="true" strokeWidth={1.5} />
          Share with Network
        </button>
      </li>
    </ul>
  )
}

export function ScrollDrivenGooeyIsland({
  name = 'Your Name.',
  avatarSrc = DEFAULT_AVATAR,
  avatarAlt = 'Your avatar',
  children,
  className,
  style,
}: ScrollDrivenGooeyIslandProps) {
  const uid = useId().replace(/:/g, '')
  const fancyGooId = `sdgi-fancy-goo-${uid}`
  const oldGooId = `sdgi-old-goo-${uid}`

  return (
    <div
      data-slot="scroll-driven-gooey-island"
      className={cn(className)}
      style={style}
    >
      <div className="sdgi__scroller">
        <div className="sdgi__page">
          <header className="sdgi__header">
            <div className="sdgi__island-container">
              <div
                className="sdgi__island"
                style={{ filter: `url(#${fancyGooId})` }}
              >
                <div className="sdgi__island-bar" />
                <div className="sdgi__avatar">
                  <img src={avatarSrc} alt={avatarAlt} />
                </div>
              </div>
            </div>
            <h2 className="sdgi__title">{name}</h2>
          </header>

          <div className="sdgi__main">
            {children ?? <DefaultSettingsList />}
          </div>
        </div>
      </div>

      <svg
        width="0"
        height="0"
        className="sdgi__sr-only"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id={oldGooId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          <filter id={fancyGooId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
