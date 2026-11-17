import { useState } from 'react'

import { DemoSettings, DemoSlider } from '@/components/shared/demo-controls'
import { type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PinShatter } from '@/components/ui/pin-shatter'

const IMAGE_SRC =
  'https://www.apple.com/v/macbook-neo/a/images/overview/product-stories/performance/performance_lifestyle__erk9efbsqgqe_large_2x.jpg'

const PROPS: DemoPropDoc[] = [
  { name: 'imageSrc', type: 'string', description: 'The image the pin is dropped on. Its edges are the walls and floor the balls bounce off.' },
  { name: 'pinSize', type: 'number', default: '36', description: 'Pin diameter in px; the balls scale with it.' },
  { name: 'dockLabel', type: 'string', default: "'Drag the pin onto the image'", description: 'Hint beside the docked pin.' },
  { name: 'onShatter', type: '(point: ImagePinPoint) => void', description: 'Fires when the placed pin is clicked, with its 0..1 position.' },
  { name: 'onShatterEnd', type: '() => void', description: 'Fires once the last ball has faded and the pin is back in the dock.' },
  { name: 'onImageRemove', type: '() => void', description: 'Round X on the frame that removes the image.' },
  { name: 'frameClassName', type: 'string', default: "'h-[min(70dvh,52rem)]'", description: 'Sizes the image frame.' },
]

const USAGE = `<PinShatter
  imageSrc={src}
  pinSize={36}
  onShatter={(point) => console.log(point)}
  onShatterEnd={() => console.log('done')}
/>`

export function PinShatterPage() {
  const [pinSize, setPinSize] = useState(36)

  return (
    <DemoPage
      eyebrow="ui / pin-shatter"
      title="Pin Shatter"
      description="Drag the pin from its dock onto the image, then click it. It pops into small matte rubber balls that fall, bounce off the image's edges and each other, and fade away; the pin comes back to the dock. With reduced motion the pin just returns."
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
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/pin-shatter/'], usage: USAGE, props: PROPS }}
    >
      <PinShatter imageSrc={IMAGE_SRC} pinSize={pinSize} />
    </DemoPage>
  )
}
