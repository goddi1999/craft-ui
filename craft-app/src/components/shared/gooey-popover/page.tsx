import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { GooeyPopover } from '@/components/ui/gooey-popover'

const DURATIONS = [0.1, 0.2, 0.4, 1] as const

export function GooeyPopoverPage() {
  const [duration, setDuration] = useState<number>(0.2)

  return (
    <DemoPage
      eyebrow="ui / gooey-popover"
      title="Gooey Popover"
      description="A native [popover] that oozes out of its round trigger — an SVG goo filter melts the blob and panel together, anchored with CSS anchor positioning."
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-16">
        <div className="flex h-56 w-full items-end justify-start px-8">
          <GooeyPopover duration={duration}>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="font-semibold opacity-60">CSS</dt>
              <dd className="text-right opacity-60">v3.0</dd>
              <dt className="font-semibold">API</dt>
              <dd className="text-right">
                <span className="rounded-xs bg-current/15 p-0.5 text-(--gooey-blue)">
                  Popover
                </span>
              </dd>
              <dt className="font-semibold">JavaScript</dt>
              <dd className="text-right">
                <span className="rounded-xs bg-current/15 p-0.5 text-(--gooey-green)">
                  0
                </span>
              </dd>
            </dl>
          </GooeyPopover>
        </div>

        <DemoPanel>
          <DemoControlGroup
            title="Duration"
            options={DURATIONS}
            value={duration}
            onChange={setDuration}
            format={(value) => `${value}s`}
          />
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
