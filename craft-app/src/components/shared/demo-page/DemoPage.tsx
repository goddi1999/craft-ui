import { cn } from '@/lib/utils'

import { demoPageStageVariants } from './demo-page-variants'
import type { DemoPageProps } from './demo-page.types'

/**
 * The shell every demo page shares: a titled header above a stage that holds
 * the component being shown.
 */
export function DemoPage({
  eyebrow,
  title,
  description,
  align = 'center',
  children,
  className,
}: DemoPageProps) {
  return (
    <div
      className={cn(
        'flex min-h-svh flex-col bg-background text-foreground',
        className,
      )}
    >
      <header className="mx-auto w-full max-w-2xl px-4 pt-20 pb-12 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          {description}
        </p>
      </header>

      <div className={demoPageStageVariants({ align })}>{children}</div>
    </div>
  )
}
