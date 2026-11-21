import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { TAIL_PATH } from './speech-bubble.constants'
import type {
  SpeechBubbleProps,
  SpeechBubbleRootProps,
  SpeechBubbleTailProps,
} from './speech-bubble.types'
import { speechBubbleVariants } from './speech-bubble-variants'

export function SpeechBubbleRoot({ className, tone, ...props }: SpeechBubbleRootProps) {
  return (
    <div
      data-slot="speech-bubble"
      className={cn(speechBubbleVariants({ tone }), 'mr-12', className)}
      {...props}
    />
  )
}

export function SpeechBubbleBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="speech-bubble-body"
      className={cn(
        'relative flex w-fit items-center rounded-full bg-(--speech-bubble-bg) px-6 py-6 text-(--speech-bubble-fg) transition-colors lg:px-10 lg:py-5',
        className,
      )}
      {...props}
    />
  )
}

export function SpeechBubbleTail({ className, side = 'right', ...props }: SpeechBubbleTailProps) {
  return (
    <svg
      data-slot="speech-bubble-tail"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 53 45"
      width="53"
      height="45"
      fill="none"
      className={cn(
        'absolute bottom-0 h-6 transition-colors md:h-auto',
        side === 'right'
          ? 'right-[-17px] -rotate-5 md:right-[-7px] lg:right-[-9px]'
          : 'left-[-17px] -scale-x-100 rotate-5 md:left-[-7px] lg:left-[-9px]',
        className,
      )}
      {...props}
    >
      <path className="fill-(--speech-bubble-bg) transition-colors" d={TAIL_PATH} />
    </svg>
  )
}

export function SpeechBubbleText({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="speech-bubble-text"
      className={cn(
        'relative text-base leading-[0.9] font-semibold tracking-[-0.06em] text-balance md:text-2xl lg:text-[2rem]',
        className,
      )}
      {...props}
    />
  )
}

export function SpeechBubbleCursor({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="speech-bubble-cursor"
      className={cn(
        'relative ml-2 hidden h-6 w-4 animate-pulse bg-muted-foreground motion-reduce:animate-none md:block',
        className,
      )}
      {...props}
    />
  )
}

export function SpeechBubble({
  children,
  className,
  showCursor = true,
  side = 'right',
  tone,
}: SpeechBubbleProps) {
  return (
    <SpeechBubbleRoot tone={tone} className={className}>
      <SpeechBubbleBody>
        <SpeechBubbleTail side={side} />
        <SpeechBubbleText>{children}</SpeechBubbleText>
        {showCursor ? <SpeechBubbleCursor /> : null}
      </SpeechBubbleBody>
    </SpeechBubbleRoot>
  )
}
