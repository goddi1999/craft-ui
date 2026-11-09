import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import {
  SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  ScrollDrivenVideoMasking,
} from '@/components/ui/scroll-driven-video-masking'

import { DemoPage } from '../demo-page'

const VIDEOS = {
  Skateboarder: SCROLL_DRIVEN_VIDEO_MASKING_SRC,
  Astley: 'https://assets.codepen.io/605876/astley-short.mp4',
} as const

type VideoName = keyof typeof VIDEOS

const VIDEO_NAMES = Object.keys(VIDEOS) as VideoName[]

export function ScrollDrivenVideoMaskingPage() {
  const [video, setVideo] = useState<VideoName>('Skateboarder')
  const [blend, setBlend] = useState(true)
  const [debug, setDebug] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / scroll-driven-video-masking"
      title="Scroll-Driven Video Masking"
      description="A sticky video plays behind a blended mask layer — scroll draws thick scribbles and punches text through it with view() timelines, so the footage shows only where the ink is."
      align="stretch"
    >
      <div className="flex w-full flex-col items-center gap-12">
        <DemoPanel className="max-w-md">
          <DemoControlGroup
            title="Video"
            options={VIDEO_NAMES}
            value={video}
            onChange={setVideo}
          />
          <DemoToggleRow>
            <DemoToggle
              label="mix-blend-mode"
              pressed={blend}
              onPressedChange={setBlend}
            />
            <DemoToggle
              label="Debug"
              pressed={debug}
              onPressedChange={setDebug}
            />
          </DemoToggleRow>
        </DemoPanel>

        <div className="-mx-4 w-[calc(100%+2rem)]">
          <ScrollDrivenVideoMasking
            src={VIDEOS[video]}
            blend={blend}
            debug={debug}
          />
        </div>
      </div>
    </DemoPage>
  )
}
