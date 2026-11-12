import { ArrowUp, Mic, Pause, Play, X } from 'lucide-react'
import { motion } from 'motion/react'
import type { Ref } from 'react'

import { cn } from '@/lib/utils'

import { SWAP } from './voice-input.constants'

type Face = 'mic' | 'stop' | 'play' | 'pause'

const FACE =
  'absolute transition-[opacity,filter,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-opacity'
const ICON = 'size-6 text-foreground/90'

const faceState = (visible: boolean) =>
  visible ? 'scale-100 opacity-100 blur-none' : 'scale-50 opacity-0 blur-[3px]'

/**
 * Mic, stop, play and pause stay mounted and crossfade with a little blur,
 * so every swap reads as one control changing state.
 */
export function ButtonFaces({ visible }: { visible: Record<Face, boolean> }) {
  return (
    <>
      <Mic aria-hidden className={cn(FACE, ICON, faceState(visible.mic))} />
      <span
        aria-hidden
        className={cn(FACE, 'size-5 rounded-[5px] bg-foreground', faceState(visible.stop))}
      />
      <Play aria-hidden className={cn(FACE, ICON, 'fill-current', faceState(visible.play))} />
      <Pause aria-hidden className={cn(FACE, ICON, 'fill-current', faceState(visible.pause))} />
    </>
  )
}

const ACTION =
  'flex h-7 items-center gap-1 rounded-lg text-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring'

export function ReviewActions({
  onDiscard,
  onSend,
  ref,
}: {
  onDiscard: () => void
  onSend: () => void
  // popLayout measures the leaving element through this ref
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-1"
      initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(2px)' }}
      transition={SWAP}
    >
      <button
        type="button"
        onClick={onDiscard}
        className={cn(
          ACTION,
          'px-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
        )}
      >
        <X aria-hidden className="size-3.5" />
        Discard
      </button>
      <button
        type="button"
        onClick={onSend}
        className={cn(ACTION, 'bg-primary px-2.5 text-primary-foreground hover:bg-primary/80')}
      >
        Send
        <ArrowUp aria-hidden className="size-3.5" />
      </button>
    </motion.div>
  )
}

export function Caption({ children, ref }: { children: string; ref?: Ref<HTMLSpanElement> }) {
  return (
    <motion.span
      ref={ref}
      className="text-xs text-foreground/70"
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(2px)' }}
      transition={SWAP}
    >
      {children}
    </motion.span>
  )
}
