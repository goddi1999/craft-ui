import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { BAR } from './theme-selector.constants'
import type { ThemePalette } from './theme-selector.types'

/** A miniature app — sidebar, panel and tiles — painted with one theme's palette. */
export function ThemeSelectorPreview({ colors }: { colors: ThemePalette }) {
  const vars = {
    '--ts-sidebar': colors.sidebar,
    '--ts-panel': colors.panel,
    '--ts-border': colors.border,
    '--ts-strong': colors.strong,
    '--ts-muted': colors.muted,
    '--ts-tile': colors.tile,
  } as CSSProperties

  return (
    <span
      aria-hidden
      data-slot="theme-selector-preview"
      style={vars}
      // bleeds past the right and bottom edges so only the top-left corner shows
      className="absolute top-[13cqw] -right-[10cqw] -bottom-[10cqw] left-[13cqw] flex rounded-tl-[5cqw] bg-(--ts-sidebar) shadow-[0_0_0_1px_var(--ts-border),0_1px_2px_rgba(0,0,0,0.06)]"
    >
      <span className="flex w-[25cqw] shrink-0 flex-col px-[3cqw] pt-[4cqw] pb-[14cqw]">
        <span className="flex gap-[1.3cqw] px-[1.2cqw]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[2cqw] rounded-full bg-(--ts-muted)" />
          ))}
        </span>
        <span className="mt-[4cqw] flex flex-col gap-[1cqw]">
          <span className="flex h-[4.6cqw] items-center rounded-[1.6cqw] bg-(--ts-muted) px-[1.2cqw]">
            <span className={cn(BAR, 'w-[10cqw] bg-(--ts-strong)')} />
          </span>
          <span className="flex h-[4.6cqw] items-center px-[1.2cqw]">
            <span className={cn(BAR, 'w-[13cqw] bg-(--ts-muted)')} />
          </span>
          <span className="flex h-[4.6cqw] items-center px-[1.2cqw]">
            <span className={cn(BAR, 'w-[8cqw] bg-(--ts-muted)')} />
          </span>
        </span>
        <span className="mt-auto flex items-center gap-[1.6cqw] px-[1.2cqw]">
          <span className="size-[4.4cqw] shrink-0 rounded-full bg-(--ts-strong)" />
          <span className={cn(BAR, 'w-[7cqw] bg-(--ts-muted)')} />
        </span>
      </span>
      <span className="mt-[3cqw] flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-[4cqw] bg-(--ts-panel) pt-[5cqw] pl-[5cqw] shadow-[0_0_0_1px_var(--ts-border)]">
        <span className="flex flex-col gap-[2cqw]">
          <span className={cn(BAR, 'w-[11cqw] bg-(--ts-strong)')} />
          <span className={cn(BAR, 'w-[19cqw] bg-(--ts-muted)')} />
        </span>
        <span className="mt-[5cqw] flex gap-[2.5cqw]">
          {[0, 1, 2].map((tile) => (
            <span
              key={tile}
              className="h-[12cqw] w-[19cqw] shrink-0 rounded-[2.4cqw] bg-(--ts-tile) shadow-[0_0_0_1px_var(--ts-border)]"
            />
          ))}
        </span>
        <span className="mt-[2.5cqw] h-[20cqw] w-[70cqw] shrink-0 rounded-[2.4cqw] bg-(--ts-tile) shadow-[0_0_0_1px_var(--ts-border)]" />
      </span>
    </span>
  )
}
