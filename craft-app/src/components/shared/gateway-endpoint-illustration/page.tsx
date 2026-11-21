import { useState } from 'react'

import { DemoSettings, DemoSlider, DemoSwitch } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GatewayEndpointIllustration } from '@/components/ui/gateway-endpoint-illustration'

const DEFAULT_WIDTH = 264

const PROPS: DemoPropDoc[] = [
  { name: 'width', type: 'number', default: '264', description: 'Rendered width; the viewBox stays 264 × 120.' },
  { name: 'height', type: 'number', default: '120', description: 'Rendered height.' },
  { name: 'showRadialCircles', type: 'boolean', default: 'true', description: 'Draw the fading rings around the hub.' },
  {
    name: 'topLeftLineColor … bottomRightLineColor',
    type: 'string',
    description: 'Colour of each provider line (blue, teal, red, amber by default).',
  },
  {
    name: 'circleStrokeColor, iconColor, logoColor, iconBoxFill, iconBoxStroke',
    type: 'string',
    description: 'Default to theme tokens so the drawing follows light and dark mode.',
  },
  {
    name: 'topLeftIcon … bottomRightIcon',
    type: 'ReactNode',
    description: 'SVG content for each bubble; defaults to OpenAI, Anthropic, xAI and a "more" glyph.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the svg.' },
]

export function GatewayEndpointIllustrationPage() {
  const [width, setWidth] = useState(DEFAULT_WIDTH * 1.5)
  const [showRadialCircles, setShowRadialCircles] = useState(true)
  const [colouredLines, setColouredLines] = useState(true)
  const lineColor = colouredLines ? undefined : 'var(--muted-foreground)'

  const usage = toUsageSnippet({
    component: 'GatewayEndpointIllustration',
    from: '@/components/ui/gateway-endpoint-illustration',
    props: { width, showRadialCircles },
    defaults: { width: DEFAULT_WIDTH, showRadialCircles: true },
  })

  return (
    <DemoPage
      eyebrow="ui / gateway-endpoint-illustration"
      title="Gateway Endpoint Illustration"
      description="A decorative SVG of one endpoint fanning out through a hub to four model providers. Colours default to theme tokens. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoSlider label="Width" value={width} onValueChange={setWidth} min={200} max={560} step={8} unit="px" />
          <DemoSwitch label="Radial circles" checked={showRadialCircles} onCheckedChange={setShowRadialCircles} />
          <DemoSwitch label="Coloured lines" checked={colouredLines} onCheckedChange={setColouredLines} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/gateway-endpoint-illustration/'], usage, props: PROPS }}
    >
      <div className="flex min-h-[260px] w-full items-center justify-center">
        <GatewayEndpointIllustration
          width={width}
          height={(width * 120) / DEFAULT_WIDTH}
          showRadialCircles={showRadialCircles}
          topLeftLineColor={lineColor}
          bottomLeftLineColor={lineColor}
          topRightLineColor={lineColor}
          bottomRightLineColor={lineColor}
          className="max-w-full"
        />
      </div>
    </DemoPage>
  )
}
