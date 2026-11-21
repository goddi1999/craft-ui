import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { CURSOR_DELAY_MS, CURSOR_PATH } from './illustration-cursor.constants'
import type { IllustrationCursorProps } from './illustration-cursor.types'
import { useFloatingCursor } from './use-floating-cursor'

export function CursorSvg({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      data-slot="collab-cursor-svg"
      fill="none"
      focusable="false"
      height="18"
      viewBox="0 0 17 18"
      width="17"
      className={cn(flip && '-scale-x-100')}
    >
      <path d={CURSOR_PATH} fill="currentColor" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

/** A named collaborator cursor that fades in and drifts in place. Position it with `style`. */
export function IllustrationCursor({
  name,
  color,
  side,
  delay = false,
  float = true,
  style,
  className,
}: IllustrationCursorProps) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(!delay)
  const floatRef = useFloatingCursor<HTMLDivElement>(visible && float && !reduceMotion)

  useEffect(() => {
    if (!delay) return
    const timer = setTimeout(() => setVisible(true), CURSOR_DELAY_MS)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      data-slot="collab-cursor"
      aria-hidden
      className={cn('pointer-events-none absolute', className)}
      style={style}
    >
      <div
        ref={floatRef}
        className={cn(
          'flex items-start transition-[opacity,filter] duration-500 ease-[cubic-bezier(.23,1,.32,1)] will-change-transform motion-reduce:transition-opacity',
          visible ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px] motion-reduce:blur-0',
        )}
        style={{ color }}
      >
        <CursorSvg flip={side === 'right'} />
        <span
          data-slot="collab-cursor-label"
          className={cn(
            'mt-2.5 rounded px-[7px] py-0.5 text-xs font-medium whitespace-nowrap text-white',
            side === 'left' ? '-ml-0.5' : '-mr-0.5',
          )}
          style={{ background: color }}
        >
          {name}
        </span>
      </div>
    </div>
  )
}
