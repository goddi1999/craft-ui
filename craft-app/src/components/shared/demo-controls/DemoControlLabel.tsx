import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DemoControlLabelProps = {
  children: ReactNode
  htmlFor?: string
  id?: string
  className?: string
}

/** The one label style every demo setting uses. */
export function DemoControlLabel({
  children,
  htmlFor,
  id,
  className,
}: DemoControlLabelProps) {
  const Tag = htmlFor ? 'label' : 'p'
  return (
    <Tag
      id={id}
      htmlFor={htmlFor}
      className={cn('text-sm font-medium text-foreground', className)}
    >
      {children}
    </Tag>
  )
}
