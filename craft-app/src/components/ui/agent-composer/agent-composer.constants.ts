// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { ComposerMode } from './agent-composer.types'

export const MODES: { id: ComposerMode; label: string; hint: string }[] = [
  { id: 'ask', label: 'Ask', hint: 'Answers questions, changes nothing' },
  { id: 'plan', label: 'Plan', hint: 'Drafts a plan for you to approve' },
  { id: 'act', label: 'Act', hint: 'Can edit files and run commands' },
]

// Motion tokens (from TuffUI motion-tokens): strong ease-out, exits quicker than entrances.
const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SLIDE = { type: 'spring', duration: 0.3, bounce: 0 } as const
export const ENTER = { duration: 0.2, ease: EASE_OUT } as const
export const LEAVE = { duration: 0.14, ease: EASE_OUT } as const

export const POP = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: ENTER },
  exit: { opacity: 0, scale: 0.95, transition: LEAVE },
  // Neighbors reflow with `layout` when a chip comes or goes.
  transition: SLIDE,
}

export const FOLD = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: ENTER },
  exit: { height: 0, opacity: 0, transition: LEAVE },
}

export const PRESS_TRANSITION =
  'transition-[color,background-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'
