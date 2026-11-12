import { useState } from 'react'

import { cn } from '@/lib/utils'

import type { StreamingReplyProps } from './streaming-reply.types'
import { StreamingTurn } from './streaming-reply-parts'

/**
 * A chat turn where the answer streams in a word at a time: the reply bubble
 * opens from a small "Thinking" pill and grows a line at a time on springs.
 */
export function StreamingReply({
  turns,
  loop = true,
  thinkingLabel = 'Thinking',
  className,
  ...props
}: StreamingReplyProps) {
  const [cycle, setCycle] = useState(0)
  const turn = turns.length > 0 ? turns[cycle % turns.length] : undefined
  // without loop it plays on to the last turn in the list and keeps that on screen
  const holds = !loop && cycle % turns.length === turns.length - 1

  return (
    <div
      data-slot="streaming-reply"
      className={cn('w-full max-w-[360px] text-[15px] leading-[22px]', className)}
      {...props}
    >
      {turn && (
        // a fresh turn per cycle, so every spring and timer starts clean
        <StreamingTurn
          key={cycle}
          turn={turn}
          thinkingLabel={thinkingLabel}
          onDone={holds ? undefined : () => setCycle((current) => current + 1)}
        />
      )}
    </div>
  )
}
