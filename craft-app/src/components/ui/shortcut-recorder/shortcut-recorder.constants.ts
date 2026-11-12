import type { Variants } from 'motion/react'

import type { ShortcutBinding } from './shortcut-recorder.types'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = { fast: 0.16, standard: 0.24 } as const
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: Bezier = [0.65, 0, 0.35, 1]
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SPRING_SMOOTH = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
export const STAGGER_ITEM = 0.035
export const BLUR_SUBTLE = 2
export const BLUR_SOFT = 4

// the css side of uiarc's --ease-spring over 580ms, for the key cap press
export const SPRING_EASE =
  'linear(0, 0.0213, 0.0739, 0.1443, 0.2235, 0.305, 0.3849, 0.4606, 0.5305, 0.594, 0.6508, 0.7011, 0.7452, 0.7836, 0.8168, 0.8454, 0.8699, 0.8907, 0.9084, 0.9234, 0.9361, 0.9467, 0.9557, 0.9632, 0.9694, 0.9747, 0.979, 0.9826, 0.9857, 0.9882, 0.9902, 0.992, 0.9934, 0.9946, 0.9955, 0.9963, 1)'

// how long a freshly recorded shortcut stays lit
export const SETTLE_MS = 700

export const MODIFIER_ORDER = ['mod', 'ctrl', 'alt', 'shift', 'meta'] as const
export const HELD_MODIFIERS = ['meta', 'ctrl', 'alt', 'shift']

export const CODE_KEYS: Record<string, string> = {
  Comma: ',',
  Period: '.',
  Slash: '/',
  Semicolon: ';',
  Quote: "'",
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Minus: '-',
  Equal: '=',
  Backquote: '`',
  Space: 'space',
  Enter: 'enter',
  NumpadEnter: 'enter',
  Escape: 'escape',
  Backspace: 'backspace',
  Delete: 'delete',
  Tab: 'tab',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
}

export const MODIFIER_KEYS: Record<string, string> = {
  Meta: 'meta',
  OS: 'meta',
  Control: 'ctrl',
  Alt: 'alt',
  AltGraph: 'alt',
  Shift: 'shift',
}

// [cap, spoken]
export const MAC_KEYS: Record<string, [string, string]> = {
  enter: ['↩', 'Return'],
  backspace: ['⌫', 'Delete'],
  delete: ['⌦', 'Forward delete'],
  tab: ['⇥', 'Tab'],
  escape: ['esc', 'Escape'],
}

export const SHARED_KEYS: Record<string, [string, string]> = {
  space: ['Space', 'Space'],
  enter: ['Enter', 'Enter'],
  escape: ['Esc', 'Escape'],
  backspace: ['Backspace', 'Backspace'],
  delete: ['Del', 'Delete'],
  tab: ['Tab', 'Tab'],
  up: ['↑', 'Up arrow'],
  down: ['↓', 'Down arrow'],
  left: ['←', 'Left arrow'],
  right: ['→', 'Right arrow'],
  home: ['Home', 'Home'],
  end: ['End', 'End'],
  pageup: ['PgUp', 'Page up'],
  pagedown: ['PgDn', 'Page down'],
  ',': [',', 'Comma'],
  '.': ['.', 'Period'],
  '/': ['/', 'Slash'],
  ';': [';', 'Semicolon'],
  "'": ["'", 'Quote'],
  '[': ['[', 'Left bracket'],
  ']': [']', 'Right bracket'],
  '\\': ['\\', 'Backslash'],
  '-': ['-', 'Minus'],
  '=': ['=', 'Equals'],
  '`': ['`', 'Backtick'],
}

// combinations the browser or system keeps for itself
export const RESERVED: ShortcutBinding[] = [
  { shortcut: 'mod+w', label: 'Close tab' },
  { shortcut: 'mod+t', label: 'New tab' },
  { shortcut: 'mod+n', label: 'New window' },
  { shortcut: 'mod+q', label: 'Quit' },
  { shortcut: 'mod+l', label: 'Address bar' },
  { shortcut: 'mod+r', label: 'Reload' },
  { shortcut: 'mod+shift+t', label: 'Reopen tab' },
  { shortcut: 'mod+c', label: 'Copy' },
  { shortcut: 'mod+v', label: 'Paste' },
  { shortcut: 'mod+x', label: 'Cut' },
  { shortcut: 'mod+z', label: 'Undo' },
  { shortcut: 'mod+a', label: 'Select all' },
]

// caps pop in one after another and settle without overshoot
export const CHIP: Variants = {
  enter: { opacity: 0, scale: 0.72, y: 4, filter: `blur(${BLUR_SUBTLE}px)` },
  rest: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      ...SPRING_SNAPPY,
      delay: index * STAGGER_ITEM,
      opacity: { duration: 0.14, delay: index * STAGGER_ITEM },
      filter: { duration: 0.16, delay: index * STAGGER_ITEM },
    },
  }),
  exit: { opacity: 0, scale: 0.8, filter: `blur(${BLUR_SUBTLE}px)`, transition: { duration: 0.1 } },
}

export const CHIP_FADE: Variants = {
  enter: { opacity: 0 },
  rest: { opacity: 1, scale: 1, y: 0, filter: 'none', transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.06 } },
}

// small round buttons that grow in beside the field
export const POP = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.1 } },
} as const

export const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'
export const NO_TAP = '[-webkit-tap-highlight-color:transparent]'

// a one pixel edge with a heavier bottom reads as a key without a shadow; held, it drops a pixel
export const KBD =
  'inline-grid box-border place-items-center border border-b-2 border-foreground/25 bg-popover pb-px text-xs leading-none font-medium tracking-normal whitespace-nowrap text-foreground tabular-nums [transition:translate_580ms_var(--shortcut-spring),border-color_160ms_cubic-bezier(.22,1,.36,1),background-color_160ms_cubic-bezier(.22,1,.36,1),color_160ms_cubic-bezier(.22,1,.36,1),border-bottom-width_160ms_cubic-bezier(.22,1,.36,1)] data-pressed:translate-y-px data-pressed:border-b data-pressed:border-primary/55 data-pressed:bg-primary/10 data-pressed:text-primary data-pressed:duration-90 data-[tone=warning]:border-amber-500/55 data-[tone=warning]:bg-amber-500/12 data-[tone=warning]:text-foreground motion-reduce:transition-none motion-reduce:data-pressed:translate-y-0'

export const KBD_SIZES = {
  sm: 'h-[22px] min-w-[22px] rounded-[7px] px-[5px]',
  md: 'h-[26px] min-w-[26px] rounded-lg px-[7px]',
} as const

export const ACTION_BUTTON =
  'grid size-8 cursor-pointer place-items-center rounded-[calc(1.125rem-5px)] text-muted-foreground outline-none [-webkit-tap-highlight-color:transparent] transition-colors duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-muted active:text-foreground motion-reduce:transition-none'

export const LINK_BUTTON =
  'cursor-pointer rounded-sm font-medium text-foreground underline decoration-foreground/25 underline-offset-[3px] outline-none transition-[text-decoration-color,color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:decoration-current focus-visible:decoration-current focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none'

export const LINK_QUIET = 'font-normal text-muted-foreground no-underline hover:text-foreground'
