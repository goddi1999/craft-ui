import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { AppTopBar } from './AppTopBar'

type DemoLayoutProps = {
  children?: ReactNode
  backTo?: string
  backLabel?: string
  className?: string
}

export function DemoLayout({
  children,
  backTo = '/',
  backLabel = 'All examples',
  className,
}: DemoLayoutProps) {
  return (
    <div className={cn('relative min-h-svh', className)}>
      <AppTopBar backTo={backTo} backLabel={backLabel} />
      {children ?? <Outlet />}
    </div>
  )
}
