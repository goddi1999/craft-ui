import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DemoActionProps = {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}

/**
 * A one-shot command in the settings panel — Replay, Shuffle, Trigger. Not a
 * setting, so it has no value and Reset ignores it.
 */
export function DemoAction({
  children,
  onClick,
  disabled,
  className,
}: DemoActionProps) {
  return (
    <Button
      data-slot="demo-action"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-fit self-end transition-transform duration-150 active:scale-[0.97]',
        className,
      )}
    >
      {children}
    </Button>
  )
}
