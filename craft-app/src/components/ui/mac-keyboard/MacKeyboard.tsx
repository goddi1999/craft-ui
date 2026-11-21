import { cn } from '@/lib/utils'

import { ArrowCluster, Key, SpaceKey, TouchIdKey } from './mac-keyboard-parts'
import { KEY_ROWS } from './mac-keyboard.constants'
import type { KeyboardKey, SpecialKeyDef, MacKeyboardProps } from './mac-keyboard.types'

function isSpecialKey(key: KeyboardKey): key is SpecialKeyDef {
  return key.kind !== undefined
}

function renderKey(key: KeyboardKey) {
  if (!isSpecialKey(key)) return <Key key={key.id} def={key} />
  if (key.kind === 'touch-id') return <TouchIdKey key={key.id} />
  if (key.kind === 'space') return <SpaceKey key={key.id} />
  return <ArrowCluster key={key.id} />
}

/** Laptop keyboard illustration whose keys press down on click. Decorative: aria-hidden. */
export function MacKeyboard({ className }: MacKeyboardProps) {
  const lastRow = KEY_ROWS.length - 1
  return (
    <div aria-hidden className={cn('mx-auto w-full max-w-3xl', className)}>
      <div className="rounded-xl bg-muted p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-border sm:rounded-2xl sm:p-2.5 md:p-3">
        {KEY_ROWS.map((row, i) => (
          <div
            key={i}
            className={cn('flex gap-[3px] sm:gap-1', i === lastRow ? 'items-end' : 'mb-[3px] sm:mb-1')}
          >
            {row.map(renderKey)}
          </div>
        ))}
      </div>
    </div>
  )
}
