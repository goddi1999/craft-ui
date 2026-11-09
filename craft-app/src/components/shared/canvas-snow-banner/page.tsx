import { useState, type ReactNode } from 'react'

import { DemoPanel } from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { CanvasSnowBanner } from '@/components/ui/canvas-snow-banner'
import { Input } from '@/components/ui/input'

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function CanvasSnowBannerPage() {
  const [height, setHeight] = useState(120)
  const [amount, setAmount] = useState(200)
  const [sway, setSway] = useState(200)

  return (
    <DemoPage
      eyebrow="ui / canvas-snow-banner"
      title="Canvas Snow Banner"
      description="A fading canvas strip of asterisk snowflakes, driven by the GSAP ticker with wind sway and density controls."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-20 lg:flex-row lg:items-start">
        <div className="relative min-h-48 flex-1 overflow-hidden rounded-2xl border bg-zinc-950">
          <CanvasSnowBanner
            height={height}
            amount={amount}
            sway={sway}
            className="absolute inset-x-0 top-0"
          />
          <div className="flex h-48 items-end justify-center p-8">
            <p className="text-sm text-zinc-400">Snow falls across the top edge</p>
          </div>
        </div>

        <DemoPanel className="max-w-md shrink-0">
          <Field label={`Height · ${height}px`}>
            <Input
              type="range"
              min={80}
              max={300}
              step={1}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </Field>
          <Field label={`Amount · ${amount}`}>
            <Input
              type="range"
              min={10}
              max={500}
              step={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Field>
          <Field label={`Wind (x) · ${sway}`}>
            <Input
              type="range"
              min={-500}
              max={500}
              step={1}
              value={sway}
              onChange={(e) => setSway(Number(e.target.value))}
            />
          </Field>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
