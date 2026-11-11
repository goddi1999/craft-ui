// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { X } from 'lucide-react'

import { Button } from '../button'

import { cn } from '@/lib/utils'

/** Icon-only remove button: the existing Button with a visible-less label. */
export function RemoveButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn('size-6 rounded-md text-muted-foreground', className)}
    >
      <X strokeWidth={2.5} aria-hidden="true" className="size-3.5" />
    </Button>
  )
}
