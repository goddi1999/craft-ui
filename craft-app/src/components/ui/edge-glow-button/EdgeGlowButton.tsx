import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { EdgeGlowArrow, EdgeGlowLight, EdgeGlowRing } from './edge-glow-button-parts'
import { useEdgeGlow } from './use-edge-glow'

export type EdgeGlowButtonProps = Omit<ComponentProps<'button'>, 'ref'> & {
  /** Show the trailing arrow after the label. @default true */
  arrow?: boolean
}

/**
 * A pill button with a warm light that springs after the pointer and lights the edge it nears.
 */
export function EdgeGlowButton({
  arrow = true,
  className,
  children,
  type = 'button',
  ...props
}: EdgeGlowButtonProps) {
  const { containerRef, buttonRef, lightRef, rightGlowRef, leftGlowRef } = useEdgeGlow()

  return (
    <div ref={containerRef} className="relative z-10 inline-flex items-center">
      <EdgeGlowRing ref={rightGlowRef} />
      <EdgeGlowRing ref={leftGlowRef} mirrored />
      <button
        ref={buttonRef}
        type={type}
        data-slot="edge-glow-button"
        className={cn(
          'relative isolate z-10 flex h-10 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-full',
          'border border-white/60 bg-[#d1d1d1] px-13 text-xs leading-none font-bold tracking-[-0.015em] text-[#5a250a] uppercase',
          'transition-transform duration-150 ease-out active:scale-[0.97]',
          'focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ff8964]',
          className,
        )}
        {...props}
      >
        <EdgeGlowLight ref={lightRef} />
        <span>{children}</span>
        {arrow ? <EdgeGlowArrow /> : null}
      </button>
    </div>
  )
}
