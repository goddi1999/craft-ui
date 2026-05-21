import { cn } from '@/lib/utils'

import type { FauxPipVideoPlayerProps } from './faux-pip-video.types'

export function FauxPipVideoPlayer({
  src,
  title,
  className,
  children,
}: FauxPipVideoPlayerProps) {
  return (
    <div data-slot="faux-pip-video-frame" className={cn(className)}>
      <iframe
        data-slot="faux-pip-video-player"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {children}
    </div>
  )
}
