import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { ARROW_ICONS, CORNER_CLASSES, SIZE_CLASSES } from './mac-keyboard.constants'
import type { KeyDef } from './mac-keyboard.types'

const ICON_CLASS = 'text-muted-foreground'

export const KEYCAP_SURFACE = cn(
  'rounded-[4px] bg-gradient-to-b from-background to-background/90 text-foreground',
  'shadow-[0_1px_1px_rgba(0,0,0,0.06)] ring-1 ring-border',
  'transition-[transform,background-color,box-shadow] duration-75 ease-out',
  'active:scale-[0.98] active:from-muted active:to-muted active:shadow-inner',
  'motion-reduce:transition-none motion-reduce:active:scale-100',
  'cursor-pointer select-none',
)

type KeycapProps = { className?: string; children?: ReactNode }

export function Keycap({ className, children }: KeycapProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        'flex h-10 flex-col items-center justify-center text-sm font-normal sm:h-11 sm:text-base md:h-12',
        KEYCAP_SURFACE,
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Key({ def, className }: { def: KeyDef; className?: string }) {
  const { size = '1u', corner = 'none', icons = [], iconSize = 12 } = def
  const word = def.word ? (
    <span
      className={cn(
        'absolute bottom-1 text-[10px] text-muted-foreground sm:text-[11px]',
        def.wordAlign === 'bottom-right' ? 'right-2' : 'left-2',
      )}
    >
      {def.word}
    </span>
  ) : null

  return (
    <Keycap className={cn(SIZE_CLASSES[size], CORNER_CLASSES[corner], def.word && 'relative', className)}>
      {def.indicator ? (
        <span className="absolute top-2 left-1.5 size-1 rounded-full bg-muted-foreground/60" />
      ) : null}
      {def.symbol ? (
        <span className="text-[10px] leading-none font-light text-muted-foreground sm:text-[11px]">
          {def.symbol}
        </span>
      ) : null}
      {icons.length > 0 ? (
        <span className="flex items-center justify-center">
          {icons.map((Icon, i) => (
            <Icon
              key={i}
              size={iconSize}
              strokeWidth={1.5}
              className={cn(ICON_CLASS, icons.length > 1 && i === 0 && '-mr-0.5', def.iconClassName)}
            />
          ))}
        </span>
      ) : null}
      {def.label ? (
        <span className={cn(def.symbol && 'leading-tight', def.id === 'esc' && 'text-[10px] text-muted-foreground sm:text-[11px]')}>
          {def.label}
        </span>
      ) : null}
      {def.secondaryLabel ? (
        <span className={cn('text-[7px] leading-none font-light text-muted-foreground sm:text-[8px]', icons.length > 0 && 'mt-3')}>
          {def.secondaryLabel}
        </span>
      ) : null}
      {word}
    </Keycap>
  )
}

export function TouchIdKey() {
  return (
    <Keycap className={cn('size-10 overflow-hidden rounded-tr-xl sm:size-11 md:size-12')}>
      <span className="size-7 rounded-full border-2 border-muted-foreground/60 shadow-inner ring-1 ring-border sm:size-8 md:size-9" />
    </Keycap>
  )
}

export function SpaceKey() {
  return <Keycap className="w-[100px] sm:w-[140px] md:w-[280px]" />
}

const ARROW_W = 'w-8 sm:w-9 md:w-10'
const HALF_H = 'h-[19px] sm:h-[21px] md:h-[23px]'

export function ArrowCluster() {
  const { left: Left, up: Up, down: Down, right: Right } = ARROW_ICONS
  return (
    <div className="flex items-center gap-[3px] sm:gap-1">
      <Keycap className={ARROW_W}>
        <Left size={12} strokeWidth={1.5} className={ICON_CLASS} />
      </Keycap>
      <div className="flex flex-col gap-px">
        <Keycap className={cn(ARROW_W, HALF_H, 'rounded-b-none')}>
          <Up size={10} strokeWidth={1.5} className={ICON_CLASS} />
        </Keycap>
        <Keycap className={cn(ARROW_W, HALF_H, 'rounded-t-none')}>
          <Down size={10} strokeWidth={1.5} className={ICON_CLASS} />
        </Keycap>
      </div>
      <Keycap className={cn(ARROW_W, 'rounded-br-xl')}>
        <Right size={12} strokeWidth={1.5} className={ICON_CLASS} />
      </Keycap>
    </div>
  )
}
