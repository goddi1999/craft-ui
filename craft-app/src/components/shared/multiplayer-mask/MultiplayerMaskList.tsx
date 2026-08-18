import { cn } from '@/lib/utils'

import type { MultiplayerMaskListProps } from './multiplayer-mask.types'

export function MultiplayerMaskList({
  children,
  className,
  ...props
}: MultiplayerMaskListProps) {
  return (
    <ul data-slot="multiplayer-mask-list" className={cn(className)} {...props}>
      {children}
    </ul>
  )
}
