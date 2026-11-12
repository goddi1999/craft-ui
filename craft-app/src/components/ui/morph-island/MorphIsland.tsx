import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { NEXT_STATE, TIMER_SECONDS } from './morph-island.constants'
import type { MorphIslandProps, MorphIslandState } from './morph-island.types'
import { CallContent, TimerContent, UploadContent } from './morph-island-parts'
import { useIslandActivity } from './use-island-activity'
import { useIslandMorph } from './use-island-morph'

/**
 * A grey pill that morphs between live activities (timer, upload, call), its width
 * and height on separate springs while the content cross-fades with blur.
 */
export function MorphIsland({
  value: valueProp,
  defaultValue = 'idle',
  onValueChange,
  timerLabel = 'Timer',
  timerSeconds = TIMER_SECONDS,
  uploadLabel = 'Uploading',
  uploadFile = 'file.zip',
  uploadProgress,
  callerName = 'Unknown caller',
  callerDetail = 'Incoming call',
  callerAvatar,
  onAccept,
  onDecline,
  className,
  style,
  ...props
}: MorphIslandProps) {
  const reduced = useReducedMotion() ?? false
  const [inner, setInner] = useState(defaultValue)
  const state = valueProp !== undefined ? valueProp : inner
  const { width, height, borderRadius, scale, press } = useIslandMorph(state, reduced)
  const { clock, percent, dashOffset } = useIslandActivity(state, timerSeconds, uploadProgress)

  const setState = (next: MorphIslandState) => {
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  const handleAccept = () => {
    onAccept?.()
    setState('idle')
  }

  const handleDecline = () => {
    onDecline?.()
    setState('idle')
  }

  // the visible text ticks every second, so only the change of activity is announced
  const announcement = {
    idle: '',
    timer: `${timerLabel} timer started`,
    upload: `${uploadLabel} ${uploadFile}`,
    call: `${callerDetail}, ${callerName}`,
  }[state]

  return (
    <motion.div
      data-slot="morph-island"
      data-state={state}
      className={cn('relative shrink-0 overflow-hidden bg-muted text-foreground select-none', className)}
      style={{ ...style, width, height, borderRadius, scale }}
      onPointerDown={press}
      {...props}
    >
      <button
        type="button"
        aria-label="Show next activity"
        onClick={() => setState(NEXT_STATE[state])}
        className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      />
      <TimerContent
        active={state === 'timer'}
        reduced={reduced}
        label={timerLabel}
        clock={clock}
      />
      <UploadContent
        active={state === 'upload'}
        reduced={reduced}
        label={uploadLabel}
        file={uploadFile}
        percent={percent}
        dashOffset={dashOffset}
      />
      <CallContent
        active={state === 'call'}
        reduced={reduced}
        name={callerName}
        detail={callerDetail}
        avatar={callerAvatar}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </motion.div>
  )
}
