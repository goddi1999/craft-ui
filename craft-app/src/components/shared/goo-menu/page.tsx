import { Camera, ImageIcon, Link2, Mic } from 'lucide-react'

import { DemoSettings, DemoSlider, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GooMenu, type GooMenuItem } from '@/components/ui/goo-menu'

const ACTIONS: GooMenuItem[] = [
  {
    value: 'screenshot',
    label: 'Screenshot',
    icon: <Camera strokeWidth={1.8} />,
    toast: 'Screenshot attached',
  },
  { value: 'image', label: 'Image', icon: <ImageIcon strokeWidth={1.8} />, toast: 'Image added' },
  { value: 'voice', label: 'Voice note', icon: <Mic strokeWidth={1.8} />, toast: 'Recording' },
  { value: 'link', label: 'Link', icon: <Link2 strokeWidth={1.8} />, toast: 'Link copied' },
]

const DEFAULTS = { blur: 10, radius: 112, toastSeconds: 2.6 }

const COMPONENT_DEFAULTS = { blur: 10, radius: 112, toastDuration: 2600 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'GooMenuItem[]',
    description:
      'The actions, fanned out above the + from left to right: `{ value, label, icon, toast? }`. Without `toast` a pick only closes the menu.',
  },
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Open state on mount when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called when the + is clicked, an action is picked, or Escape or a click outside closes it.',
  },
  {
    name: 'onSelect',
    type: '(value: string) => void',
    description: "Called with the item's `value` on a click, Enter or Space. A drag that lets go is not a pick.",
  },
  { name: 'label', type: 'string', default: "'Actions'", description: 'Accessible name of the + button.' },
  {
    name: 'radius',
    type: 'number',
    default: '112',
    description: 'Distance in px from the + to each bubble. Leave about this much room above it.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '10',
    description: 'Goo strength: higher fuses the bubbles from further away.',
  },
  {
    name: 'toastDuration',
    type: 'number',
    default: '2600',
    description: 'How long the toast stays, in ms.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the 64px root.' },
]

export function GooMenuPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { blur, radius, toastSeconds } = settings.values
  const toastDuration = Math.round(toastSeconds * 1000)

  const usage = toUsageSnippet({
    component: 'GooMenu',
    from: '@/components/ui/goo-menu',
    props: {
      items: { expression: 'actions' },
      onSelect: { expression: 'runAction' },
      blur,
      radius,
      toastDuration,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / goo-menu"
      title="Goo Menu"
      description="A + that pours out liquid bubbles: an SVG goo filter fuses them while they are close, so they peel off like drops, stretch as they fly and snap back with a wobble when you drag one. Pick an action and the + morphs into a toast. Adapted from Design Bookmark's motion studies."
      previewClassName="min-h-[26rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Goo"
            value={blur}
            onValueChange={(next) => settings.set('blur', next)}
            min={4}
            max={20}
            unit="px"
          />
          <DemoSlider
            label="Spread"
            value={radius}
            onValueChange={(next) => settings.set('radius', next)}
            min={88}
            max={140}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Toast"
            value={toastSeconds}
            onValueChange={(next) => settings.set('toastSeconds', next)}
            min={1}
            max={5}
            step={0.2}
            unit="s"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/goo-menu/'], usage, props: PROPS }}
    >
      {/* the bubbles fan out above the +, so it sits low in the stage */}
      <div className="pt-[132px]">
        <GooMenu items={ACTIONS} blur={blur} radius={radius} toastDuration={toastDuration} />
      </div>
    </DemoPage>
  )
}
