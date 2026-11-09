import { useState, type ReactNode } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { CookingLetters } from '@/components/ui/cooking-letters'
import { Input } from '@/components/ui/input'

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

export function CookingLettersPage() {
  const [duration, setDuration] = useState(2.2)
  const [debug, setDebug] = useState(false)
  const [scrub, setScrub] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDebugChange = (next: boolean) => {
    setDebug(next)
    if (!next) setScrub(false)
  }

  return (
    <DemoPage
      eyebrow="ui / cooking-letters"
      title="Cooking Letters"
      description="Every letter is a tiny CSS cube that rolls over in a sine-staggered wave — flip on debug to tilt the stage and scrub a line."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-16 px-4 pb-20">
        <div className="grid min-h-96 w-full place-items-center overflow-hidden py-10">
          <CookingLetters
            duration={duration}
            debug={debug}
            scrub={scrub}
            progress={progress}
          />
        </div>

        <DemoPanel>
          <Field label={`Duration · ${duration}s`}>
            <Input
              type="range"
              min={0.8}
              max={5}
              step={0.1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </Field>

          <DemoToggleRow>
            <DemoToggle
              label="Debug"
              pressed={debug}
              onPressedChange={handleDebugChange}
            />
            {debug && (
              <DemoToggle
                label="Scrub"
                pressed={scrub}
                onPressedChange={setScrub}
              />
            )}
          </DemoToggleRow>

          {debug && scrub && (
            <Field label={`Progress · ${progress}`}>
              <Input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
              />
            </Field>
          )}
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
