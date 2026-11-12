import { Search, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  FOCUS_RING,
  HELD_MODIFIERS,
  KBD,
  KBD_SIZES,
  POP,
  SPRING_EASE,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
} from './shortcut-recorder.constants'
import type {
  ShortcutKbdProps,
  ShortcutKeysProps,
  ShortcutListProps,
} from './shortcut-recorder.types'
import { searchAliases, searchWords, shortcutTokens } from './shortcut-recorder.utils'
import { usePlatform } from './use-platform'
import { usePressedKeys } from './use-pressed-keys'

/** A key cap. Use it inline in copy, in menus, or through `ShortcutKeys` for a whole combination. */
export function ShortcutKbd({
  pressed = false,
  size = 'md',
  className,
  style,
  children,
  ...props
}: ShortcutKbdProps) {
  return (
    <kbd
      {...props}
      data-slot="shortcut-kbd"
      data-size={size}
      data-pressed={pressed || undefined}
      className={cn(KBD, KBD_SIZES[size], className)}
      style={{ '--shortcut-spring': SPRING_EASE, ...style } as CSSProperties}
    >
      {children}
    </kbd>
  )
}

/** A shortcut as key caps, with a spoken label for assistive technology. */
export function ShortcutKeys({
  shortcut,
  platform: platformProp,
  pressed,
  size = 'md',
  className,
}: ShortcutKeysProps) {
  const platform = usePlatform(platformProp)
  const tokens = shortcutTokens(shortcut, platform)

  return (
    <span
      data-slot="shortcut-keys"
      role="img"
      aria-label={tokens.map((token) => token.spoken).join(' ')}
      className={cn('inline-flex flex-none items-center gap-1', className)}
    >
      {tokens.map((token, index) => (
        <ShortcutKbd
          key={`${index}-${token.id}`}
          size={size}
          pressed={pressed?.has(token.id)}
          aria-hidden="true"
        >
          {token.label}
        </ShortcutKbd>
      ))}
    </span>
  )
}

/**
 * A searchable, grouped cheatsheet. Holding a modifier lights that cap in every row and fades
 * rows that do not use it; a row whose whole combination is down lights up.
 */
export function ShortcutList({
  groups,
  label = 'Keyboard shortcuts',
  searchable = true,
  searchPlaceholder = 'Search shortcuts',
  highlightPressed = true,
  platform: platformProp,
  className,
}: ShortcutListProps) {
  const reduced = useReducedMotion() === true
  const platform = usePlatform(platformProp)
  const held = usePressedKeys(highlightPressed)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const heldMods = [...held].filter((key) => HELD_MODIFIERS.includes(key))
  const words = searchWords(query)
  const aliases = searchAliases(platform)

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!words.length) return true
        const tokens = shortcutTokens(item.shortcut, platform)
        const keys = tokens.map((token) => `${token.spoken} ${token.label}`).join(' ')
        const haystack = `${item.label} ${group.label} ${item.keywords ?? ''} ${keys}`.toLowerCase()
        return words.every(
          (word) => haystack.includes(aliases[word] ?? word) || haystack.includes(word),
        )
      }),
    }))
    .filter((group) => group.items.length)

  const total = filtered.reduce((sum, group) => sum + group.items.length, 0)
  const rowTransition = reduced ? { duration: 0 } : SPRING_SMOOTH
  const fold = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
      }

  return (
    <section
      data-slot="shortcut-list"
      aria-label={label}
      className={cn('@container grid min-w-0 gap-3', className)}
    >
      {searchable ? (
        <div className="box-border flex h-9 items-center gap-2 rounded-[1.125rem] border border-border bg-card pr-1.5 pl-3 transition-[border-color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] focus-within:border-foreground motion-reduce:transition-none">
          <Search className="flex-none text-muted-foreground" size={16} strokeWidth={1.75} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault()
                setQuery('')
              }
            }}
            className="h-full min-w-0 flex-1 appearance-none bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="flex-none text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {query ? `${total} ${total === 1 ? 'match' : 'matches'}` : ''}
          </span>
          <AnimatePresence initial={false}>
            {query ? (
              <motion.button
                key="clear"
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
                {...POP}
                transition={reduced ? { duration: 0 } : SPRING_SNAPPY}
                className={cn(
                  'grid size-6 flex-none cursor-pointer place-items-center rounded-full bg-foreground/8 text-muted-foreground focus-visible:bg-foreground/14 focus-visible:text-foreground',
                  FOCUS_RING,
                )}
              >
                <X size={14} strokeWidth={1.75} aria-hidden="true" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      <div className="grid items-start gap-x-6 @min-[520px]:grid-cols-2">
        <AnimatePresence initial={false}>
          {filtered.map((group) => (
            <motion.section
              key={group.label}
              aria-label={group.label}
              className="-mx-2 overflow-hidden px-2"
              {...fold}
              transition={rowTransition}
            >
              <h4 className="pt-3 pb-1 text-xs font-normal text-muted-foreground">{group.label}</h4>
              <ul className="grid">
                <AnimatePresence initial={false}>
                  {group.items.map((item) => {
                    const ids = shortcutTokens(item.shortcut, platform).map((token) => token.id)
                    const match = held.size > 0 && ids.every((key) => held.has(key))
                    const dim =
                      heldMods.length > 0 && !match && !heldMods.every((mod) => ids.includes(mod))
                    return (
                      <motion.li
                        key={item.label}
                        data-match={match || undefined}
                        data-dim={dim || undefined}
                        className="-mx-2 overflow-hidden"
                        {...fold}
                        transition={rowTransition}
                      >
                        {/* fades without the held modifiers, lights when the whole chord is down */}
                        <span
                          className={cn(
                            'flex min-h-9 items-center justify-between gap-3 rounded-[10px] px-2 transition-[opacity,background-color] duration-240 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
                            '[li+li>&]:shadow-[inset_0_1px_0_var(--border)] [li[data-match]+li>&]:shadow-none',
                            dim && 'opacity-38',
                            match && 'bg-primary/10 shadow-none [li+li>&]:shadow-none',
                          )}
                        >
                          <span
                            className={cn(
                              'min-w-0 truncate text-sm transition-colors duration-160 motion-reduce:transition-none',
                              match ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {item.label}
                          </span>
                          <ShortcutKeys
                            shortcut={item.shortcut}
                            platform={platform}
                            pressed={held}
                            size="sm"
                          />
                        </span>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>
        {total === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No shortcuts match “{query.trim()}”</p>
        ) : null}
      </div>
    </section>
  )
}
