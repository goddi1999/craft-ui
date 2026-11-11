// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import type { Labelled } from './choice-controls.types'

/** Wraps a control with its clickable label and description, when it has a label. */
export function ChoiceField({
  label,
  description,
  className,
  children,
}: Labelled & { children: ReactNode }) {
  if (!label) return <>{children}</>
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 select-none', className)}>
      <span className="flex min-h-5 items-center">{children}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm">{label}</span>
        {description && (
          <span className="block text-[0.8125rem] text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
