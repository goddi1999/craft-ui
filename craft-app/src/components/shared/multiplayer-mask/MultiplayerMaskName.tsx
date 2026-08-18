import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import type { MultiplayerMaskNameProps } from './multiplayer-mask.types'

/**
 * Splits the name into per-character spans so `label="ring"` can place each one
 * along the avatar circle with `offset-path`. The characters are hidden from
 * assistive tech — the whole name is exposed once, visually hidden.
 */
export function MultiplayerMaskName({
  name,
  className,
  ...props
}: MultiplayerMaskNameProps) {
  return (
    <span
      data-slot="multiplayer-mask-name"
      className={cn(className)}
      {...props}
    >
      <span className="sr-only">{name}</span>
      {Array.from(name).map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-slot="multiplayer-mask-char"
          aria-hidden="true"
          style={{ '--i': index } as CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
