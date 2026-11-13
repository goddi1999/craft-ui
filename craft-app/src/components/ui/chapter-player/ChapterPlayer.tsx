import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { SCENE_FADE } from './chapter-player.constants'
import type { ChapterPlayerProps } from './chapter-player.types'
import { chapterAt, formatTime } from './chapter-player.utils'
import { ChapterButtons, ChapterSteps, PauseMark, Scrubber } from './chapter-player-parts'
import { useChapterClock } from './use-chapter-clock'

/**
 * A stage with named chapters under it, as a row of buttons or a progress stepper. The
 * current chapter takes the theme accent as playback crosses into it; pick a chapter to jump
 * there or drag the tick ruler to scrub. Plays a video when given `src`, otherwise
 * cross-fades each chapter's own content.
 */
export function ChapterPlayer({
  chapters,
  duration: durationProp = 0,
  children,
  src,
  poster,
  autoPlay = true,
  loop = true,
  navigation = 'buttons',
  tapToPause = true,
  color = 'neutral',
  label = 'Chapter player',
  onChapterChange,
  className,
  ...props
}: ChapterPlayerProps) {
  const reduced = useReducedMotion() ?? false
  // your own stage wins over a video
  const hasVideo = Boolean(src) && children === undefined
  const video = useRef<HTMLVideoElement>(null)
  const slider = useRef<HTMLDivElement>(null)
  const playhead = useRef<HTMLDivElement>(null)
  const elapsed = useRef<HTMLSpanElement>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const duration = hasVideo && videoDuration > 0 ? videoDuration : durationProp

  const sorted = useMemo(() => [...chapters].sort((a, b) => a.start - b.start), [chapters])
  const starts = useMemo(() => sorted.map((chapter) => chapter.start), [sorted])

  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const second = useRef(-1)
  const resumeAfterScrub = useRef(false)

  // per frame: move the playhead, and touch React only when the chapter or the second changes
  const onFrame = (time: number) => {
    const progress = duration > 0 ? Math.min(time / duration, 1) : 0
    if (playhead.current) playhead.current.style.transform = `translateX(${progress * 100}%)`

    const index = chapterAt(starts, time)
    if (index !== activeRef.current) {
      activeRef.current = index
      setActive(index)
      onChapterChange?.(index)
    }

    const whole = Math.floor(time)
    if (whole !== second.current && slider.current) {
      second.current = whole
      if (elapsed.current) elapsed.current.textContent = formatTime(time)
      slider.current.setAttribute('aria-valuenow', String(whole))
      slider.current.setAttribute(
        'aria-valuetext',
        `${formatTime(time)} of ${formatTime(duration)}, ${sorted[index]?.label ?? ''}`,
      )
    }
  }

  const clock = useChapterClock({
    duration,
    loop,
    autoPlay: autoPlay && !reduced,
    videoRef: video,
    hasVideo,
    onFrame,
  })

  const scene = sorted[active]

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="chapter-player"
      className={cn('flex w-full max-w-3xl flex-col', className)}
      {...props}
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45),0_0_0_1px_rgb(0_0_0/0.04)] dark:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)]">
        {children !== undefined ? (
          // a stage of your own: the player only keeps time and passes the chapter down
          <div className="absolute inset-0">
            {typeof children === 'function'
              ? children({ index: active, chapter: scene, playing: clock.playing, seek: clock.seek })
              : children}
          </div>
        ) : hasVideo ? (
          <video
            ref={video}
            src={src}
            poster={poster}
            muted
            playsInline
            loop={loop}
            preload="metadata"
            onLoadedMetadata={(event) => {
              setVideoDuration(event.currentTarget.duration)
              clock.report()
            }}
            onEnded={() => clock.setPlaying(false)}
            className="size-full object-cover"
          />
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key={`${active}-${scene?.label}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0.2 } : SCENE_FADE}
            >
              {scene?.content}
            </motion.div>
          </AnimatePresence>
        )}

        {tapToPause && (
        <button
          type="button"
          onClick={clock.toggle}
          aria-label={clock.playing ? 'Pause' : 'Play'}
          className="absolute inset-0 cursor-pointer rounded-2xl outline-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <PauseMark playing={clock.playing} />
        </button>
        )}
      </div>

      {/* the theme's accent hook: inside it `--primary` is that colour, for the buttons and labels */}
      <div data-accent={color === 'neutral' ? undefined : color}>
        {navigation === 'stepper' ? (
          <ChapterSteps
            chapters={sorted}
            active={active}
            color={color}
            reduced={reduced}
            onSelect={(index) => clock.seek(sorted[index].start)}
          />
        ) : (
          <ChapterButtons
            chapters={sorted}
            active={active}
            reduced={reduced}
            onSelect={(index) => clock.seek(sorted[index].start)}
          />
        )}

        <Scrubber
          duration={duration}
          label="Seek"
          sliderRef={slider}
          playheadRef={playhead}
          elapsedRef={elapsed}
          getTime={() => clock.time.current}
          onSeek={clock.seek}
          onScrubStart={() => {
            resumeAfterScrub.current = clock.playing
            clock.setPlaying(false)
          }}
          onScrubEnd={() => {
            if (resumeAfterScrub.current) clock.setPlaying(true)
          }}
        />
      </div>
    </div>
  )
}
