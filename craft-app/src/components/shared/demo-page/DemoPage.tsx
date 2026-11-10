import { cn } from '@/lib/utils'

import { DemoDocs } from '../demo-docs/DemoDocs'
import { demoPagePreviewVariants } from './demo-page-variants'
import type { DemoPageProps } from './demo-page.types'

const SETTINGS_PADDING = 'p-5 sm:p-6'

/**
 * The shell every demo page shares, in the same order on every page:
 * title → live preview → settings (always at the bottom of the preview) →
 * installation path, usage snippet, API reference.
 */
export function DemoPage({
  eyebrow,
  title,
  description,
  align = 'center',
  layout = 'card',
  bleed = false,
  previewClassName,
  settings,
  docs,
  children,
  className,
}: DemoPageProps) {
  const isFullscreen = layout === 'fullscreen'

  return (
    <div
      data-slot="demo-page"
      className={cn(
        'flex min-h-svh flex-col bg-background text-foreground',
        className,
      )}
    >
      <header className="mx-auto w-full max-w-2xl px-4 pt-20 pb-10 text-center">
        <p className="font-mono text-xs text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-balance">
          {title}
        </h1>
        <div className="mx-auto mt-4 max-w-xl text-sm text-pretty text-muted-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-foreground">
          {description}
        </div>
      </header>

      {isFullscreen ? (
        <div data-slot="demo-preview" className={cn('w-full', previewClassName)}>
          {children}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pt-0 pb-24">
        {isFullscreen ? (
          settings ? (
            <div
              data-slot="demo-settings-card"
              className={cn('mt-12 rounded-2xl border bg-card', SETTINGS_PADDING)}
            >
              {settings}
            </div>
          ) : null
        ) : (
          <div
            data-slot="demo-preview-card"
            className="overflow-hidden rounded-2xl border bg-card"
          >
            <div
              data-slot="demo-preview"
              className={cn(demoPagePreviewVariants({ align, bleed }), previewClassName)}
            >
              {children}
            </div>
            {settings ? (
              <div
                data-slot="demo-settings-footer"
                className={cn('border-t bg-muted/30', SETTINGS_PADDING)}
              >
                {settings}
              </div>
            ) : null}
          </div>
        )}

        {docs ? <DemoDocs {...docs} /> : null}
      </div>
    </div>
  )
}
