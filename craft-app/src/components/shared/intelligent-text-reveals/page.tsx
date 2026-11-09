import { RotateCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IntelligentTextReveals } from '@/components/ui/intelligent-text-reveals'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function IntelligentTextRevealsPage() {
  const [duration, setDuration] = useState(1.4)
  const [delay, setDelay] = useState(0.5)
  const [blur, setBlur] = useState(4)
  const [color, setColor] = useState('#8aaaf0')
  const [signature, setSignature] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  const handleReplay = () => setReplayKey((key) => key + 1)

  return (
    <DemoPage
      eyebrow="ui / intelligent-text-reveals"
      title="Intelligent Text Reveals"
      description="Copy washes in behind a sweeping radial mask, led by a tinted, blurred echo that squeezes the line-height as it passes."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 px-4 pb-20">
        <IntelligentTextReveals
          key={replayKey}
          duration={duration}
          delay={delay}
          blur={blur}
          color={`color-mix(in srgb, ${color} 64%, transparent)`}
          signature={signature}
        >
          Design Engineer, currently with{' '}
          <a href="https://vercel.com/home">Vercel</a>. Formerly CSS + UI DevRel
          at Google.
          <br />
          <br />
          Showing you how to craft high-impact web experiences. Writing{' '}
          <a href="https://newsletter.craftofui.com">"The Craft of UI"</a>.
          Spoken at events all{' '}
          <a href="https://youtu.be/loKm4JcT4U4?si=cJB9Q9Up00LWIJ6S">
            over the world
          </a>{' '}
          and had work featured by many. You can find my work and insights on{' '}
          <a href="https://twitter.com/intent/follow?screen_name=jh3yy">X</a>.
          <br />
          <br />
          Join my course <a href="https://course.craftofui.com">waitlist</a>.
        </IntelligentTextReveals>

        <DemoPanel>
          <Field label={`Duration · ${duration}s`}>
            <Input
              type="range"
              min={0.2}
              max={4}
              step={0.1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </Field>
          <Field label={`Delay · ${delay}s`}>
            <Input
              type="range"
              min={0}
              max={4}
              step={0.1}
              value={delay}
              onChange={(event) => setDelay(Number(event.target.value))}
            />
          </Field>
          <Field label={`Blur · ${blur}px`}>
            <Input
              type="range"
              min={0}
              max={10}
              value={blur}
              onChange={(event) => setBlur(Number(event.target.value))}
            />
          </Field>
          <Field label="Lead tint">
            <Input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-9 cursor-pointer p-1"
            />
          </Field>

          <DemoToggleRow>
            <DemoToggle
              label="Signature"
              pressed={signature}
              onPressedChange={setSignature}
            />
            <Button size="sm" variant="outline" onClick={handleReplay}>
              <RotateCcw />
              Replay
            </Button>
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
