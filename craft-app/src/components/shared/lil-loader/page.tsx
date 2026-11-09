import { useState, type ReactNode } from 'react'

import { DemoPanel } from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Input } from '@/components/ui/input'
import { LilLoader } from '@/components/ui/lil-loader'

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

export function LilLoaderPage() {
  const [size, setSize] = useState(120)
  const [speed, setSpeed] = useState(3.5)
  const [bars, setBars] = useState(10)

  return (
    <DemoPage
      eyebrow="ui / lil-loader"
      title="Lil Loader"
      description="A tiny framed loader — a stack of glowing rings that rise, swell and drift from pink to amber, built in pure CSS."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 px-4 pb-20">
        <div className="grid min-h-72 w-full place-items-center rounded-2xl border bg-muted/40 p-10">
          <LilLoader size={size} speed={speed} bars={bars} />
        </div>

        <DemoPanel>
          <Field label={`Size · ${size}px`}>
            <Input
              type="range"
              min={64}
              max={200}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </Field>
          <Field label={`Speed · ${speed}s`}>
            <Input
              type="range"
              min={1}
              max={8}
              step={0.1}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </Field>
          <Field label={`Bars · ${bars}`}>
            <Input
              type="range"
              min={3}
              max={20}
              value={bars}
              onChange={(event) => setBars(Number(event.target.value))}
            />
          </Field>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
