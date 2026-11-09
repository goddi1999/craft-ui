import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import {
  MorphingDisclosure,
  type MorphingDisclosureBorderStyle,
} from '@/components/ui/morphing-disclosure'

import { DemoPage } from '../demo-page'

const BORDER_STYLES: readonly MorphingDisclosureBorderStyle[] = [
  'border',
  'pseudo',
]
const BORDER_WIDTHS = [1, 2, 4] as const
const BLURS = [0, 4, 10] as const
const SPEEDS = [0.5, 1, 2] as const

export function MorphingDisclosurePage() {
  const [highlight, setHighlight] = useState(true)
  const [bordered, setBordered] = useState(true)
  const [translate, setTranslate] = useState(true)
  const [depth, setDepth] = useState(false)
  const [borderStyle, setBorderStyle] =
    useState<MorphingDisclosureBorderStyle>('border')
  const [borderWidth, setBorderWidth] = useState<number>(2)
  const [blur, setBlur] = useState<number>(4)
  const [speed, setSpeed] = useState<number>(1)

  return (
    <DemoPage
      eyebrow="ui / morphing-disclosure"
      title="Exclusive Morphing Disclosure"
      description="An exclusive <details name> group: opening a row detaches it into its own card — corners round off, borders morph, and the panel springs open with interpolate-size while the copy de-blurs into place."
    >
      <div className="flex w-full flex-col items-center gap-16 pb-24">
        <MorphingDisclosure
          defaultOpenIndex={1}
          highlight={highlight}
          bordered={bordered}
          translate={translate}
          depth={depth}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          blur={blur}
          speed={speed}
        />

        <DemoPanel>
          <DemoToggleRow>
            <DemoToggle
              label="highlight"
              pressed={highlight}
              onPressedChange={setHighlight}
            />
            <DemoToggle
              label="bordered"
              pressed={bordered}
              onPressedChange={setBordered}
            />
            <DemoToggle
              label="translate"
              pressed={translate}
              onPressedChange={setTranslate}
            />
            <DemoToggle
              label="depth"
              pressed={depth}
              onPressedChange={setDepth}
            />
          </DemoToggleRow>
          <DemoControlGroup
            title="style"
            options={BORDER_STYLES}
            value={borderStyle}
            onChange={setBorderStyle}
          />
          <DemoControlGroup
            title="border"
            options={BORDER_WIDTHS}
            value={borderWidth}
            onChange={setBorderWidth}
            format={(width) => `${width}px`}
          />
          <DemoControlGroup
            title="content blur"
            options={BLURS}
            value={blur}
            onChange={setBlur}
            format={(amount) => `${amount}px`}
          />
          <DemoControlGroup
            title="speed"
            options={SPEEDS}
            value={speed}
            onChange={setSpeed}
            format={(multiplier) => `${multiplier}×`}
          />
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
