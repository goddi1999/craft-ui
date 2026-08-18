import { type VariantProps } from 'class-variance-authority'
import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './multiplayer-mask.css'

import { multiplayerMaskVariants } from './multiplayer-mask-variants'
import type { MultiplayerMaskProps } from './multiplayer-mask.types'

export function MultiplayerMask({
  children,
  size = 'default',
  direction = 'ltr',
  label = 'ring',
  theme = 'system',
  movement,
  transition,
  ringOffset,
  border,
  column,
  glow = false,
  debug = false,
  className,
  style,
  ...props
}: MultiplayerMaskProps & VariantProps<typeof multiplayerMaskVariants>) {
  const cssVars = {
    ...(movement === undefined
      ? null
      : { '--multiplayer-mask-movement': movement }),
    ...(transition === undefined
      ? null
      : { '--multiplayer-mask-transition': transition }),
    ...(ringOffset === undefined
      ? null
      : { '--multiplayer-mask-offset': ringOffset }),
    ...(border === undefined ? null : { '--multiplayer-mask-border': border }),
    ...(column === undefined ? null : { '--multiplayer-mask-column': column }),
    ...style,
  } as CSSProperties

  return (
    <div
      data-slot="multiplayer-mask"
      data-size={size}
      data-direction={direction}
      data-label={label}
      data-theme={theme}
      data-glow={glow}
      data-debug={debug}
      className={cn(multiplayerMaskVariants({ size }), className)}
      style={cssVars}
      {...props}
    >
      {children}
    </div>
  )
}
