import { type VariantProps } from 'class-variance-authority'
import { type CSSProperties, useState } from 'react'

import { cn } from '@/lib/utils'

import './number-animation.css'

import { numberAnimationVariants } from './number-animation-variants'
import type { NumberAnimationProps } from './number-animation.types'

export function NumberAnimation({
  value,
  size = 'default',
  mode = 'transition',
  suffix = '%',
  duration = 1,
  label,
  className,
  style,
  ...props
}: NumberAnimationProps & VariantProps<typeof numberAnimationVariants>) {
  // Animation mode needs the value it is travelling *from*, so track the last
  // one and adjust during render rather than in an effect.
  const [settled, setSettled] = useState(value)
  const [origin, setOrigin] = useState(0)
  const [run, setRun] = useState(0)

  if (settled !== value) {
    setOrigin(settled)
    setSettled(value)
    setRun((current) => current + 1)
  }

  const isAnimation = mode === 'animation'

  const counterVars = {
    '--number-animation-duration': `${duration}s`,
    '--number-animation-suffix': `"${suffix}"`,
    // transition mode interpolates the property itself; animation mode holds
    // the origin and adds the delta on top of it
    '--number-animation-value': isAnimation ? origin : value,
    ...(isAnimation
      ? { '--number-animation-reference': value - origin }
      : null),
  } as CSSProperties

  return (
    <div
      data-slot="number-animation-root"
      className={cn(className)}
      style={style}
      {...props}
    >
      <span className="sr-only">
        {label ? `${label}: ` : ''}
        {value}
        {suffix}
      </span>
      <span
        // remounting is what replays the keyframe for a fresh delta
        key={isAnimation ? run : 'transition'}
        data-slot="number-animation"
        data-size={size}
        data-mode={mode}
        aria-hidden="true"
        className={numberAnimationVariants({ size, mode })}
        style={counterVars}
      />
    </div>
  )
}
