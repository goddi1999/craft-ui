import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100000001] flex justify-start p-4">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="pointer-events-auto bg-background/80 backdrop-blur-sm"
        >
          <Link to={backTo}>← {backLabel}</Link>
        </Button>
      </div>
      {children ?? <Outlet />}
    </div>
  )
}
