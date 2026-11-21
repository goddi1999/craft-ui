import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'

import { DemoAction, DemoControlGroup, DemoSettings, DemoSlider } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PhoneFrame, type DynamicIslandSize, type PhoneFrameColor } from '@/components/ui/phone-frame'

const SIZES: readonly DynamicIslandSize[] = ['default', 'expanded', 'large', 'ultra']
const COLORS: readonly PhoneFrameColor[] = ['graphite', 'silver', 'gold', 'blue']
const SIGNALS = [0, 1, 2, 3, 4] as const

const DEFAULTS = { size: 'default', color: 'graphite', battery: 94, signal: 2 } as const

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'Screen content, laid out below the status bar.' },
  {
    name: 'dynamicIslandSize',
    type: "'default' | 'expanded' | 'large' | 'ultra'",
    default: "'default'",
    description: 'Island size preset. Controlled when onDynamicIslandTap is set.',
  },
  {
    name: 'onDynamicIslandTap',
    type: '() => void',
    description: 'Called when the island is tapped. Without it the island toggles default and expanded itself.',
  },
  { name: 'frameColor', type: "'graphite' | 'silver' | 'gold' | 'blue'", default: "'graphite'", description: 'Frame material.' },
  { name: 'time', type: 'string', default: "'9:41'", description: 'Time shown in the status bar.' },
  { name: 'batteryLevel', type: 'number', default: '94', description: 'Battery level, 0–100.' },
  { name: 'signalStrength', type: 'number', default: '2', description: 'Signal bars, 0–4.' },
  { name: 'className', type: 'string', description: 'Merged onto the outer wrapper.' },
]

function nextSize(size: DynamicIslandSize) {
  return SIZES[(SIZES.indexOf(size) + 1) % SIZES.length]
}

export function PhoneFramePage() {
  const [size, setSize] = useState<DynamicIslandSize>(DEFAULTS.size)
  const [color, setColor] = useState<PhoneFrameColor>(DEFAULTS.color)
  const [battery, setBattery] = useState<number>(DEFAULTS.battery)
  const [signal, setSignal] = useState<number>(DEFAULTS.signal)

  const canReset =
    size !== DEFAULTS.size || color !== DEFAULTS.color || battery !== DEFAULTS.battery || signal !== DEFAULTS.signal

  function handleCycle() {
    setSize(nextSize)
  }

  function handleReset() {
    setSize(DEFAULTS.size)
    setColor(DEFAULTS.color)
    setBattery(DEFAULTS.battery)
    setSignal(DEFAULTS.signal)
  }

  const usage = toUsageSnippet({
    component: 'PhoneFrame',
    from: '@/components/ui/phone-frame',
    props: { frameColor: color, dynamicIslandSize: size, batteryLevel: battery, signalStrength: signal },
    defaults: { frameColor: 'graphite', dynamicIslandSize: 'default', batteryLevel: 94, signalStrength: 2 },
  })

  return (
    <DemoPage
      eyebrow="ui / phone-frame"
      title="Phone Frame"
      description="A phone mockup with a metal frame, live status bar and a tappable island that springs between four size presets. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={handleReset} canReset={canReset}>
          <DemoControlGroup title="Frame" options={COLORS} value={color} onChange={setColor} />
          <DemoSlider label="Battery" value={battery} onValueChange={setBattery} min={0} max={100} unit="%" />
          <DemoControlGroup title="Signal" options={SIGNALS} value={signal} onChange={setSignal} />
          <DemoAction onClick={handleCycle}>
            <MousePointerClick className="size-4" aria-hidden /> Cycle island
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/phone-frame/'], usage, props: PROPS }}
    >
      <PhoneFrame
        frameColor={color}
        dynamicIslandSize={size}
        batteryLevel={battery}
        signalStrength={signal}
        onDynamicIslandTap={handleCycle}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Phone Frame</h2>
          <p className="text-sm text-muted-foreground">Tap the island to cycle through dynamic island sizes</p>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Current: {size}
          </span>
        </div>
      </PhoneFrame>
    </DemoPage>
  )
}
