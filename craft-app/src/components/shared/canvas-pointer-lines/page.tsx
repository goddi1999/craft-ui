import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { CanvasPointerLines } from '@/components/ui/canvas-pointer-lines'

const CELL_OPTIONS = [16, 28, 40, 56] as const
const LENGTH_OPTIONS = [0.4, 0.75, 1] as const
const WIDTH_OPTIONS = [1, 3, 6] as const
const MASK_SIZE_OPTIONS = [60, 100, 180] as const

export function CanvasPointerLinesPage() {
  const [cell, setCell] = useState<(typeof CELL_OPTIONS)[number]>(28)
  const [lineLength, setLineLength] =
    useState<(typeof LENGTH_OPTIONS)[number]>(0.75)
  const [strokeWidth, setStrokeWidth] =
    useState<(typeof WIDTH_OPTIONS)[number]>(3)
  const [maskSize, setMaskSize] =
    useState<(typeof MASK_SIZE_OPTIONS)[number]>(100)
  const [spotlight, setSpotlight] = useState(true)
  const [fadeMask, setFadeMask] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / canvas-pointer-lines"
      title="Configurable Canvas Pointer Lines"
      description="A grid of short strokes that rotate toward the pointer, with optional radial spotlight and linear fade masks."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-20">
        <div className="overflow-hidden rounded-2xl border bg-background p-6">
          <CanvasPointerLines
            cell={cell}
            lineLength={lineLength}
            strokeWidth={strokeWidth}
            spotlight={spotlight}
            maskSize={maskSize}
            intensity={0.9}
            stopOne={fadeMask ? 40 : 100}
            stopTwo={fadeMask ? 100 : 100}
            maskAngle={fadeMask ? 90 : 0}
            width="100%"
            height={220}
            className="block w-full"
          />
        </div>

        <DemoPanel className="mx-auto max-w-2xl">
          <DemoControlGroup
            title="Cell size"
            options={[...CELL_OPTIONS]}
            value={cell}
            onChange={setCell}
            format={(n) => `${n}px`}
          />
          <DemoControlGroup
            title="Line length"
            options={[...LENGTH_OPTIONS]}
            value={lineLength}
            onChange={setLineLength}
            format={(n) => `${Math.round(n * 100)}%`}
          />
          <DemoControlGroup
            title="Stroke width"
            options={[...WIDTH_OPTIONS]}
            value={strokeWidth}
            onChange={setStrokeWidth}
            format={(n) => `${n}px`}
          />
          <DemoControlGroup
            title="Spotlight size"
            options={[...MASK_SIZE_OPTIONS]}
            value={maskSize}
            onChange={setMaskSize}
            format={(n) => `${n}px`}
          />
          <DemoToggleRow>
            <DemoToggle
              label="Spotlight"
              pressed={spotlight}
              onPressedChange={setSpotlight}
            />
            <DemoToggle
              label="Fade mask"
              pressed={fadeMask}
              onPressedChange={setFadeMask}
            />
          </DemoToggleRow>
          <p className="text-sm text-muted-foreground">
            Move the pointer over the canvas. Size and stroke props rebuild the
            grid; spotlight and mask props update CSS variables live.
          </p>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
