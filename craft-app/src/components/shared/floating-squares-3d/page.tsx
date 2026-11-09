import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import { FloatingSquares3D } from '@/components/ui/floating-squares-3d'

const COUNTS = [10, 20, 40] as const
const ROTATIONS = [0, 20, 40, 60] as const

export function FloatingSquares3DPage() {
  const [count, setCount] = useState<number>(20)
  const [rotate, setRotate] = useState<number>(40)
  const [seed, setSeed] = useState(1)
  const [showGuides, setShowGuides] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / floating-squares-3d"
      title="Floating Squares 3D"
      description="Colourful squares drift across a plane swung away in 3D, with a mask feathering both edges so they fade in and out of view."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10">
        <FloatingSquares3D
          count={count}
          rotate={rotate}
          seed={seed}
          showGuides={showGuides}
        />

        <DemoPanel>
          <DemoControlGroup
            title="Squares"
            options={COUNTS}
            value={count}
            onChange={setCount}
          />
          <DemoControlGroup
            title="Tilt"
            options={ROTATIONS}
            value={rotate}
            onChange={setRotate}
            format={(value) => `${value}°`}
          />
          <DemoToggleRow>
            <DemoToggle
              label="Show plane"
              pressed={showGuides}
              onPressedChange={setShowGuides}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSeed((value) => value + 1)}
            >
              Shuffle
            </Button>
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
