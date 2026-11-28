import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { AutoplayTabsContext } from './autoplay-tabs.context'
import { usePrefersReducedMotion } from './autoplay-tabs.hooks'
import type { AutoplayTabsRootProps } from './autoplay-tabs.types'

// `auto` holds back under reduced motion. Pressing play is an explicit opt-in,
// so `playing` ignores that preference.
type Playback = 'auto' | 'playing' | 'paused'

export function AutoplayTabsRoot({
  count,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  duration = 5000,
  loop = true,
  autoPlay = true,
  size = 'default',
  className,
  ...props
}: AutoplayTabsRootProps) {
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const progressAnimationRef = useRef<Animation | null>(null)

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const [playback, setPlayback] = useState<Playback>(autoPlay ? 'auto' : 'paused')
  const prefersReducedMotion = usePrefersReducedMotion()
  const isPlaying =
    playback === 'playing' || (playback === 'auto' && !prefersReducedMotion)

  const select = (next: number) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const play = () => {
    // Only a stopped non-loop run can hold a finished progress.
    const timing = progressAnimationRef.current?.effect?.getComputedTiming()
    if (timing?.progress === 1) select(0)
    setPlayback('playing')
  }

  const pause = () => setPlayback('paused')

  const onProgressFinish = useEffectEvent(() => {
    if (value < count - 1) select(value + 1)
    else if (loop) select(0)
    else pause()
  })

  // The progress fill doubles as the autoplay clock: composited, pauses in
  // place, no per-frame JS.
  useEffect(() => {
    const animation = new Animation(
      new KeyframeEffect(progressFillRef.current, [{ scale: '0 1' }, { scale: '1 1' }], {
        duration,
        fill: 'forwards',
      }),
    )
    animation.onfinish = onProgressFinish
    progressAnimationRef.current = animation

    return () => {
      animation.cancel()
      progressAnimationRef.current = null
    }
  }, [value, duration])

  useEffect(() => {
    const animation = progressAnimationRef.current
    if (!animation) return
    if (isPlaying) animation.play()
    else animation.pause()
  }, [value, duration, isPlaying])

  return (
    <AutoplayTabsContext
      value={{
        value,
        isPlaying,
        prefersReducedMotion,
        progressFillRef,
        select,
        play,
        pause,
      }}
    >
      <div
        data-slot="autoplay-tabs"
        data-size={size}
        data-playing={isPlaying ? '' : undefined}
        className={cn(
          'group/autoplay-tabs flex items-center justify-center gap-3 data-[size=sm]:gap-2',
          className,
        )}
        {...props}
      />
    </AutoplayTabsContext>
  )
}
