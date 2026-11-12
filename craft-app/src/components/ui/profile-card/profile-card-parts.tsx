import { cn } from '@/lib/utils'

import { COVER_LAYERS } from './profile-card.constants'

/** The painted blue moon behind the cover, all gradients, no image. */
export function CoverArtwork() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-black">
      {COVER_LAYERS.map((layer) => (
        <div key={layer} className={cn('absolute', layer)} />
      ))}
    </div>
  )
}

/** A blue star burst with a tick. */
export function VerifiedIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 27 27" fill="none" aria-hidden className="shrink-0">
      <path
        d="M13.5 .8L16.1 2.15L19 1.9L20.7 4.25L23.4 5.15L23.55 8.05L25.25 10.45L23.75 12.95L23.9 15.85L21.35 17.2L20.05 19.85L17.15 19.7L14.7 21.3L12.2 19.8L9.3 19.95L7.95 17.4L5.3 16.1L5.45 13.2L3.9 10.75L5.4 8.3L5.25 5.4L7.9 4.1L9.2 1.45L12.1 1.6L13.5 .8Z"
        fill="#1597E8"
      />
      <path
        d="M9.3 10.9L12.05 13.6L18 7.8"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke="#8799D4" strokeWidth="1.8" strokeLinecap="round">
        <path d="M10 13.9L14 10.1" />
        <path d="M9.2 16.8L7.65 18.35C6.15 19.85 3.7 19.85 2.2 18.35C0.7 16.85 0.7 14.4 2.2 12.9L6.7 8.4C8.2 6.9 10.65 6.9 12.15 8.4" />
        <path d="M11.85 15.6C13.35 17.1 15.8 17.1 17.3 15.6L21.8 11.1C23.3 9.6 23.3 7.15 21.8 5.65C20.3 4.15 17.85 4.15 16.35 5.65L14.8 7.2" />
      </g>
    </svg>
  )
}

/** The X (formerly Twitter) logo. */
export function XLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** The avatar used when none is passed. */
export function ProfileMark() {
  return (
    <svg width="60" height="60" viewBox="0 0 82 82" fill="none" aria-hidden>
      <rect width="82" height="82" rx="23" fill="#DCE5FF" />
      <path d="M29 20H48V38H29V20Z" fill="#000" />
      <path d="M48 20H67V47L48 58V20Z" fill="#000" />
      <path d="M29 38H48V67L29 57V38Z" fill="#000" />
      <path d="M48 48H67V67H48V48Z" fill="#000" />
    </svg>
  )
}
