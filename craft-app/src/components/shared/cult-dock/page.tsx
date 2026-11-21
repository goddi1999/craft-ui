import { Camera, Code, Mail, Music, Settings, type LucideIcon } from 'lucide-react'

import { DemoSettings, DemoSlider, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  CULT_DOCK_MAGNIFY,
  CultDock,
  CultDockCard,
  CultDockCardInner,
  CultDockDivider,
} from '@/components/ui/cult-dock'

// gradient tiles as data URIs so the demo needs no network images
function tile(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const APPS: { id: string; label: string; src: string; icon: LucideIcon }[] = [
  { id: '0', label: 'Mail', src: tile('#38bdf8', '#2563eb'), icon: Mail },
  { id: '1', label: 'Music', src: tile('#fb7185', '#e11d48'), icon: Music },
  { id: '2', label: 'Camera', src: tile('#fbbf24', '#ea580c'), icon: Camera },
  { id: '3', label: 'Code', src: tile('#a78bfa', '#7c3aed'), icon: Code },
]
const SYSTEM = { id: '4', label: 'Settings', src: tile('#a3a3a3', '#404040'), icon: Settings }

const DEFAULTS = { magnify: CULT_DOCK_MAGNIFY }

const PROPS: DemoPropDoc[] = [
  { name: 'magnify', type: 'number', default: '80', description: 'CultDock: width in px of the card right under the pointer.' },
  { name: 'id', type: 'string', description: 'CultDockCard / CultDockCardInner: shared id that ties the icon to its open dot.' },
  { name: 'label', type: 'string', description: 'CultDockCard: accessible name of the button.' },
  { name: 'src', type: 'string', description: 'CultDockCardInner: icon image, with a blurred copy behind it.' },
  { name: 'children', type: 'ReactNode', description: 'CultDockCardInner: shown in place of the icon while open.' },
  { name: 'className', type: 'string', description: 'Merged onto the dock or card button.' },
]

function App({ id, label, src, icon: Icon }: (typeof APPS)[number]) {
  return (
    <CultDockCard id={id} label={label}>
      <CultDockCardInner id={id} src={src}>
        <Icon className="size-4 text-foreground" aria-hidden />
      </CultDockCardInner>
    </CultDockCard>
  )
}

export function CultDockPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { magnify } = settings.values

  const usage = toUsageSnippet({
    component: 'CultDock',
    from: '@/components/ui/cult-dock',
    props: { magnify },
    defaults: { magnify: CULT_DOCK_MAGNIFY },
  })

  return (
    <DemoPage
      eyebrow="ui / cult-dock"
      title="Cult Dock"
      description="A macOS-style dock. Cards swell as the pointer passes; click one to open it, and it bounces while its icon slides down into the dot beneath. Drag the divider up and down. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Magnify"
            value={magnify}
            onValueChange={(next) => settings.set('magnify', next)}
            min={40}
            max={112}
            step={4}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/cult-dock/'], usage, props: PROPS }}
    >
      <div className="flex h-[220px] w-full items-end justify-center pb-6">
        <CultDock magnify={magnify}>
          {APPS.map((app) => (
            <App key={app.id} {...app} />
          ))}
          <CultDockDivider />
          <App {...SYSTEM} />
        </CultDock>
      </div>
    </DemoPage>
  )
}
