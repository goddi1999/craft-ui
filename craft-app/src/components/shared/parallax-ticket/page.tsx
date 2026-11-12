import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ParallaxTicket, type ParallaxTicketDetail } from '@/components/ui/parallax-ticket'

// bundled under public/, the Dragon Bridge lit up at night
const IMAGE = '/apple-carousel/7.webp'

const SEATS: ParallaxTicketDetail[] = [
  { label: 'Row', value: 'C' },
  { label: 'Seat', value: '12' },
  { label: 'Gate', value: '2' },
]

const DEFAULTS = {
  tilt: 14,
  depth: 12,
  picture: true,
}

const COMPONENT_DEFAULTS = { tilt: 14, depth: 12 }

const PROPS: DemoPropDoc[] = [
  { name: 'title', type: 'ReactNode', description: 'Big text on the front, nearest the glass. Break it with `<br />`.' },
  { name: 'subtitle', type: 'ReactNode', description: 'Small line under the title, e.g. date, time and place.' },
  { name: 'code', type: 'ReactNode', description: 'Right side of that line, e.g. the ticket number.' },
  {
    name: 'image',
    type: 'string',
    description: 'Front picture, set furthest back. Without one the front is a faint grid and the text uses theme colours.',
  },
  {
    name: 'details',
    type: '{ label: string; value: string }[]',
    default: '[]',
    description: 'Shown under the code on the back, e.g. row, seat and gate.',
  },
  { name: 'hint', type: 'ReactNode', default: "'Tap to flip back'", description: 'Small text at the bottom of the back.' },
  { name: 'flipped', type: 'boolean', description: 'Controlled side. Use with `onFlippedChange`.' },
  { name: 'defaultFlipped', type: 'boolean', default: 'false', description: 'Starting side when uncontrolled.' },
  {
    name: 'onFlippedChange',
    type: '(flipped: boolean) => void',
    description: 'Fires on click, Enter or Space.',
  },
  { name: 'tilt', type: 'number', default: '14', description: 'Degrees it tilts at the edge under the pointer.' },
  {
    name: 'depth',
    type: 'number',
    default: '12',
    description: 'Px the text layer slides at full tilt; the picture moves a quarter of that.',
  },
  { name: 'aria-label', type: 'string', description: 'Name of the ticket button, e.g. `Launch Night ticket`.' },
  { name: 'className', type: 'string', description: 'Merged onto the stage. It is 264 × 356px by default.' },
]

export function ParallaxTicketPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { tilt, depth, picture } = settings.values
  const [flipped, setFlipped] = useState(false)

  const usage = toUsageSnippet({
    component: 'ParallaxTicket',
    from: '@/components/ui/parallax-ticket',
    props: {
      title: { expression: '<>Launch<br />Night</>' },
      subtitle: 'Dec 4 · 19:30 · Da Nang',
      code: 'No. 0042',
      image: picture ? IMAGE : undefined,
      details: {
        expression: "[{ label: 'Row', value: 'C' }, { label: 'Seat', value: '12' }, { label: 'Gate', value: '2' }]",
      },
      tilt,
      depth,
      'aria-label': 'Launch Night ticket',
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / parallax-ticket"
      title="Parallax Ticket"
      description="A layered ticket that tilts toward the cursor: the picture sits far back, the title floats near the glass, and a glare follows the pointer. Click it and it flips on a spring that overshoots a little to show the code on the back; left alone, it drifts so the depth still shows. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Tilt"
            value={tilt}
            onValueChange={(next) => settings.set('tilt', next)}
            min={0}
            max={24}
            unit="°"
          />
          <DemoSlider
            label="Depth"
            value={depth}
            onValueChange={(next) => settings.set('depth', next)}
            min={0}
            max={30}
            unit="px"
          />
          <DemoSwitch
            label="Picture"
            checked={picture}
            onCheckedChange={(next) => settings.set('picture', next)}
          />
          <DemoAction onClick={() => setFlipped((value) => !value)}>
            {flipped ? 'Show the front' : 'Show the back'}
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/parallax-ticket/'], usage, props: PROPS }}
    >
      <ParallaxTicket
        title={
          <>
            Launch
            <br />
            Night
          </>
        }
        subtitle="Dec 4 · 19:30 · Da Nang"
        code="No. 0042"
        image={picture ? IMAGE : undefined}
        details={SEATS}
        flipped={flipped}
        onFlippedChange={setFlipped}
        tilt={tilt}
        depth={depth}
        aria-label="Launch Night ticket"
      />
    </DemoPage>
  )
}
