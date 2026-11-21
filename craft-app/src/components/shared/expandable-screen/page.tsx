import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { DemoSettings, DemoSlider, DemoSwitch } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DEFAULT_ANIMATION_DURATION,
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from '@/components/ui/expandable-screen'

const PROPS: DemoPropDoc[] = [
  { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Start open.' },
  { name: 'onExpandChange', type: '(expanded: boolean) => void', description: 'Called on open and close.' },
  { name: 'layoutId', type: 'string', default: "'expandable-card'", description: 'Shared layout id; unique per instance on a page.' },
  { name: 'triggerRadius', type: 'string', default: "'100px'", description: 'Corner radius of the closed card.' },
  { name: 'contentRadius', type: 'string', default: "'24px'", description: 'Corner radius of the open screen.' },
  { name: 'animationDuration', type: 'number', default: '0.3', description: 'Morph duration in seconds.' },
  { name: 'lockScroll', type: 'boolean', default: 'true', description: 'Lock body scroll while open.' },
]

export function ExpandableScreenPage() {
  const [duration, setDuration] = useState(DEFAULT_ANIMATION_DURATION)
  const [lockScroll, setLockScroll] = useState(true)

  const usage = toUsageSnippet({
    component: 'ExpandableScreen',
    from: '@/components/ui/expandable-screen',
    props: { animationDuration: duration, lockScroll },
    defaults: { animationDuration: DEFAULT_ANIMATION_DURATION, lockScroll: true },
  })

  return (
    <DemoPage
      eyebrow="ui / expandable-screen"
      title="Expandable Screen"
      description="A pill-shaped card that morphs into a full-screen view through a shared layout. Escape or the close button morphs it back. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoSlider label="Duration" value={duration} onValueChange={setDuration} min={0.1} max={1.2} step={0.05} unit="s" />
          <DemoSwitch label="Lock scroll" checked={lockScroll} onCheckedChange={setLockScroll} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/expandable-screen/'], usage, props: PROPS }}
    >
      <div className="flex h-[260px] w-full items-center justify-center">
        <ExpandableScreen layoutId="expandable-screen-demo" animationDuration={duration} lockScroll={lockScroll}>
          <ExpandableScreenTrigger>
            <div className="relative z-10 flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
              Request a demo <ArrowRight className="size-4" aria-hidden />
            </div>
          </ExpandableScreenTrigger>
          <ExpandableScreenContent className="bg-primary">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center gap-4 p-10 text-primary-foreground">
              <h2 className="text-4xl font-semibold tracking-tight">Let's talk</h2>
              <p className="text-primary-foreground/70">
                The card you clicked grew into this screen. Press Escape or the close button to shrink it back.
              </p>
            </div>
          </ExpandableScreenContent>
        </ExpandableScreen>
      </div>
    </DemoPage>
  )
}
