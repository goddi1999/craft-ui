import { useRef, type CSSProperties } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './faux-pip-video.css'

import { fauxPipVideoVariants } from './faux-pip-video-variants'
import type { FauxPipVideoProps } from './faux-pip-video.types'
import { FauxPipVideoPlayer } from './FauxPipVideoPlayer'
import { FauxPipVideoSentinel } from './FauxPipVideoSentinel'
import { FauxPipVideoShell } from './FauxPipVideoShell'
import { useScrollStateStuck } from './use-scroll-state-stuck'

export function FauxPipVideo({
  src,
  title = 'Video player',
  children,
  header,
  contentWidth,
  margin = 0.1,
  gutter = 1,
  pipWidth = 260,
  duration = 0.26,
  navHeight = 56,
  debug = false,
  size = 'default',
  className,
  style,
}: FauxPipVideoProps & VariantProps<typeof fauxPipVideoVariants>) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useScrollStateStuck(sentinelRef)

  const cssVars: CSSProperties = {
    ...(contentWidth !== undefined && {
      ['--faux-pip-content-width' as string]: `${contentWidth}px`,
    }),
    ['--faux-pip-margin' as string]: margin,
    ['--faux-pip-gutter' as string]: gutter,
    ['--faux-pip-width' as string]: pipWidth,
    ['--faux-pip-duration' as string]: duration,
    ['--faux-pip-nav-height' as string]: `${navHeight}px`,
    ...style,
  }

  return (
    <div
      data-slot="faux-pip-video"
      data-debug={debug ? 'true' : 'false'}
      className={cn(fauxPipVideoVariants({ size }), className)}
      style={cssVars}
    >
      <div data-slot="faux-pip-video-backdrop">
        <FauxPipVideoSentinel ref={sentinelRef} />
      </div>
      <FauxPipVideoShell>
        <FauxPipVideoPlayer src={src} title={title} />
      </FauxPipVideoShell>
      {header ? (
        <div data-slot="faux-pip-video-header">{header}</div>
      ) : null}
      <div data-slot="faux-pip-video-content">{children}</div>
    </div>
  )
}
