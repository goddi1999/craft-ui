import { cn } from '@/lib/utils'

import { MultiplayerMaskName } from './MultiplayerMaskName'
import type { MultiplayerMaskItemProps } from './multiplayer-mask.types'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
}

export function MultiplayerMaskItem({
  name,
  avatar,
  fallback,
  className,
  ...props
}: MultiplayerMaskItemProps) {
  return (
    <li data-slot="multiplayer-mask-item" className={cn(className)} {...props}>
      <MultiplayerMaskName name={name} />
      <div data-slot="multiplayer-mask-avatar-holder">
        <span data-slot="multiplayer-mask-avatar">
          {avatar ? (
            <img src={avatar} alt="" loading="lazy" decoding="async" />
          ) : (
            <span data-slot="multiplayer-mask-fallback" aria-hidden="true">
              {fallback ?? getInitials(name)}
            </span>
          )}
        </span>
      </div>
    </li>
  )
}
