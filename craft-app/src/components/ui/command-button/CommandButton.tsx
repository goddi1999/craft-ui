import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Search } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

import { cn } from '@/lib/utils'

import {
  HOVER,
  MAC_LABELS,
  PC_LABELS,
  PRESS_SPRING,
  PRESSED_SCALE,
  RADIUS,
  SWAP_EXIT,
  SWAP_HIDDEN,
  SWAP_SHOWN,
} from './command-button.constants'
import type { CommandButtonProps } from './command-button.types'
import { Key } from './command-button-parts'
import {
  NOTHING_HELD,
  isDown,
  isTyping,
  matchesKey,
  noSubscribe,
  openSpring,
  parseShortcut,
  readIsMac,
  sameHeld,
  toAriaShortcut,
  type HeldKeys,
} from './command-button.utils'

/**
 * A quiet button that carries its own keyboard shortcut. Click it or press the keys
 * and the pill stretches open into a search field, keycaps lighting as they go down.
 */
export function CommandButton({
  children = 'Search',
  shortcut = 'mod+k',
  placeholder = 'Search',
  onSearch,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  width = 300,
  bounce = 30,
  autoClose,
  className,
  style,
  ...props
}: CommandButtonProps) {
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const reduced = useReducedMotion() ?? false
  // null on the server and in the first client render, so the markup matches; then the real answer
  const mac = useSyncExternalStore(noSubscribe, readIsMac, () => null)
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = openProp !== undefined ? openProp : innerOpen
  const [query, setQuery] = useState('')
  // which keys are down: this one is state, the caps need to re-render
  const [held, setHeld] = useState<HeldKeys>(NOTHING_HELD)

  // the press is a motion value with a spring on it, so a press never re-renders
  const pressTarget = useMotionValue(1)
  const scale = useSpring(pressTarget, PRESS_SPRING)

  // only a real person's press takes the focus; a scripted one (a demo playing by itself) must not
  const takeFocus = useRef(false)
  // Escape closes and blurs, and the blur would close it a second time
  const openNow = useRef(open)
  useLayoutEffect(() => {
    openNow.current = open
  })

  const { modifiers, key } = parseShortcut(shortcut)
  const labels = mac === false ? PC_LABELS : MAC_LABELS

  const press = (down: boolean) => pressTarget.set(down && !reduced ? PRESSED_SCALE : 1)

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }

  const openWith = (trusted: boolean) => {
    takeFocus.current = trusted
    setOpen(true)
  }

  const close = () => {
    if (!openNow.current) return
    openNow.current = false
    setOpen(false)
    setQuery('')
    input.current?.blur()
  }

  const syncKeys = useEffectEvent((event: KeyboardEvent, down: boolean) => {
    if (mac === null) return
    const next = {
      mods: modifiers.filter((m) => isDown(m, event, mac)),
      key: down && matchesKey(event, key),
    }
    setHeld((current) => (sameHeld(current, next) ? current : next))
    press(next.key || next.mods.length > 0)
  })

  const handleWindowKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (mac === null || open) return
    // a shortcut with no real modifier must not fire while typing somewhere else
    if (!modifiers.some((m) => m !== 'shift') && isTyping(event.target)) return
    syncKeys(event, true)
    if (!event.repeat && modifiers.every((m) => isDown(m, event, mac)) && matchesKey(event, key)) {
      event.preventDefault()
      openWith(event.isTrusted)
    }
  })

  const releaseKeys = useEffectEvent(() => {
    setHeld(NOTHING_HELD)
    press(false)
  })

  const handlePointerAway = useEffectEvent((event: PointerEvent) => {
    if (!root.current?.contains(event.target as Node)) close()
  })

  const foldBack = useEffectEvent(close)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => handleWindowKeyDown(event)
    const onKeyUp = (event: KeyboardEvent) => syncKeys(event, false)
    const onBlur = () => releaseKeys()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  // a click outside folds it back
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => handlePointerAway(event)
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !autoClose || query) return
    const timer = setTimeout(() => foldBack(), autoClose)
    return () => clearTimeout(timer)
  }, [open, autoClose, query])

  return (
    <motion.div
      ref={root}
      layout
      data-slot="command-button"
      data-state={open ? 'open' : 'closed'}
      transition={{ layout: reduced ? { duration: 0 } : openSpring(bounce) }}
      style={{ ...style, scale, borderRadius: RADIUS, width: open ? width : 'auto' }}
      onPointerDown={() => {
        if (!open) press(true)
      }}
      onPointerUp={() => press(false)}
      onPointerLeave={() => press(false)}
      className={cn(
        'relative flex h-10 items-center overflow-hidden bg-muted text-sm font-medium text-foreground/85 transition-colors duration-150 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring',
        !open && HOVER,
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.div
            key="field"
            className="flex w-full items-center gap-2.5 pr-2.5 pl-3.5"
            initial={SWAP_HIDDEN}
            animate={SWAP_SHOWN}
            exit={SWAP_EXIT}
            onAnimationStart={() => {
              if (takeFocus.current) input.current?.focus({ preventScroll: true })
            }}
          >
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
            <input
              ref={input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') close()
                if (event.key === 'Enter' && query.trim()) onSearch?.(query.trim())
              }}
              onBlur={() => {
                if (!query) close()
              }}
              placeholder={placeholder}
              aria-label={placeholder}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Key label="Esc" />
          </motion.div>
        ) : (
          <motion.button
            key="button"
            type="button"
            aria-keyshortcuts={toAriaShortcut(modifiers, key, mac)}
            aria-expanded={false}
            onClick={(event) => openWith(event.isTrusted)}
            className="flex h-10 cursor-pointer items-center gap-3 pr-2.5 pl-4 whitespace-nowrap outline-none select-none"
            initial={SWAP_HIDDEN}
            animate={SWAP_SHOWN}
            exit={SWAP_EXIT}
          >
            {children}
            <span
              aria-hidden
              className={cn(
                'flex items-center gap-1 transition-opacity duration-200',
                mac === null && 'opacity-0',
              )}
            >
              {modifiers.map((m) => (
                <Key key={m} label={labels[m]} on={held.mods.includes(m)} />
              ))}
              <Key label={key.length === 1 ? key.toUpperCase() : key} on={held.key} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
