import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { AVATAR_TINTS } from './quote-wall.constants'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function tintFor(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length]
}

/** A text-height avatar that sits in the line like a glyph. */
export function QuoteAvatar({ avatar, author }: { avatar?: string | ReactNode; author: string }) {
  const box =
    'mr-[0.25em] inline-grid size-[1.05em] shrink-0 -translate-y-[0.08em] place-items-center overflow-hidden rounded-full align-middle'

  if (typeof avatar === 'string') {
    return <img src={avatar} alt="" className={cn(box, 'object-cover')} draggable={false} />
  }
  // the box is sized in the line's em; the label inside gets its own smaller font size
  if (avatar) {
    return (
      <span aria-hidden className={cn(box, 'bg-muted')}>
        <span className="text-[0.6em] leading-none">{avatar}</span>
      </span>
    )
  }
  return (
    <span aria-hidden className={cn(box, 'bg-linear-to-br text-white', tintFor(author))}>
      <span className="text-[0.4em] leading-none font-semibold tracking-tight">{initials(author)}</span>
    </span>
  )
}
