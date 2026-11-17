import { useState } from 'react'

import { DemoSettings, DemoSlider } from '@/components/shared/demo-controls'
import { type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PIN_SHATTER_IMAGE_SRC, PinShatter } from '@/components/ui/pin-shatter'

const PROPS: DemoPropDoc[] = [
  { name: 'imageSrc', type: 'string', default: 'PIN_SHATTER_IMAGE_SRC', description: 'Leave unset; never change the default image. The image the pin is dropped on. Its edges are the walls and floor the balls bounce off.' },
  { name: 'pinSize', type: 'number', default: '36', description: 'Pin diameter in px; the balls scale with it.' },
  { name: 'dropRadius', type: 'number', default: '56', description: 'Outer radius in px of the shock rings that leave a dropped pin.' },
  { name: 'dropStrength', type: 'number', default: '0.65', description: '0..1 share of the ripple that bends the image itself. 0 keeps only the rings. Warps pixels with WebGL when the image allows CORS; otherwise a lens ring swells the image instead.' },
  { name: 'dropDuration', type: 'number', default: '680', description: 'Ring travel time in ms; the pop and flash scale with it.' },
  { name: 'dockLabel', type: 'string', default: "'Drag the pin onto the image'", description: 'Hint beside the docked pin.' },
  { name: 'onShatter', type: '(point: ImagePinPoint) => void', description: 'Fires when the placed pin is clicked, with its 0..1 position.' },
  { name: 'onShatterEnd', type: '() => void', description: 'Fires once the last ball has faded and the pin is back in the dock.' },
  { name: 'onImageRemove', type: '() => void', description: 'Round X on the frame that removes the image.' },
  { name: 'frameClassName', type: 'string', default: "'h-[min(70dvh,52rem)]'", description: 'Sizes the image frame.' },
]

const USAGE = `<PinShatter
  imageSrc={src}
  pinSize={36}
  dropRadius={56}
  dropStrength={0.65}
  dropDuration={680}
  onShatter={(point) => console.log(point)}
  onShatterEnd={() => console.log('done')}
/>`

export function PinShatterPage() {
  const [pinSize, setPinSize] = useState(36)
  const [dropRadius, setDropRadius] = useState(56)
  const [dropStrength, setDropStrength] = useState(65)
  const [dropDuration, setDropDuration] = useState(680)

  return (
    <DemoPage
      eyebrow="ui / pin-shatter"
      title="Pin Shatter"
      description="Drag the pin from its dock onto the image: it lands with a pop and a flash, two shock rings leave it and the image ripples. Click it and it pops into small matte rubber balls that fall, bounce off the image's edges and each other, and fade away; the pin comes back to the dock. With reduced motion the pin just returns."
      align="stretch"
      settings={
        <DemoSettings>
          <DemoSlider
            label="Pin size"
            value={pinSize}
            onValueChange={setPinSize}
            min={24}
            max={56}
            step={2}
            unit="px"
          />
          <DemoSlider
            label="Ripple radius"
            value={dropRadius}
            onValueChange={setDropRadius}
            min={28}
            max={130}
            step={2}
            unit="px"
          />
          <DemoSlider
            label="Image warp"
            value={dropStrength}
            onValueChange={setDropStrength}
            min={0}
            max={100}
            step={5}
            unit="%"
          />
          <DemoSlider
            label="Duration"
            value={dropDuration}
            onValueChange={setDropDuration}
            min={360}
            max={1200}
            step={20}
            unit="ms"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/pin-shatter/'], usage: USAGE, props: PROPS }}
    >
      <PinShatter
        imageSrc={PIN_SHATTER_IMAGE_SRC}
        pinSize={pinSize}
        dropRadius={dropRadius}
        dropStrength={dropStrength / 100}
        dropDuration={dropDuration}
      />
    </DemoPage>
  )
}
