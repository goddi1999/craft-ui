import {
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PackageBox } from '@/components/ui/package-box'

const DEFAULTS = {
  title: 'Thank you, Ana.',
  tape: true,
  hint: true,
  reserveSpace: false,
  open: false,
}

const COMPONENT_DEFAULTS = {
  maxWidth: 460,
  tape: true,
  hint: true,
  openLabel: 'Click to open',
  closeLabel: 'Close',
  reserveSpace: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state. Omit for uncontrolled with `defaultOpen`.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Initial open state when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires whenever the box opens or closes.',
  },
  {
    name: 'slip',
    type: 'PackageSlip',
    description: 'Text for the default packing slip (title, items, stamp, …).',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Replaces the default slip. Sized 240 × 340 design px.',
  },
  {
    name: 'colors',
    type: 'PackageBoxColors',
    description: '`box`, `tape`, `paper`, `ink`, `accent` CSS colors.',
  },
  {
    name: 'maxWidth',
    type: 'number',
    default: '460',
    description: 'Max width in px; the scene scales to fit.',
  },
  {
    name: 'tape',
    type: 'boolean',
    default: 'true',
    description: 'Packing tape across the top seam.',
  },
  {
    name: 'hint',
    type: 'boolean',
    default: 'true',
    description: 'Visible caption button. Always present for screen readers when false.',
  },
  {
    name: 'label',
    type: 'ReactNode | false',
    description: 'Sticker on the front face. `false` hides it.',
  },
  {
    name: 'symbols',
    type: 'ReactNode | false',
    description: 'Marks on the side face. `false` hides them.',
  },
  {
    name: 'reserveSpace',
    type: 'boolean',
    default: 'false',
    description: 'Keep the open height reserved while closed so the page does not shift.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
  { name: 'paperClassName', type: 'string', description: 'Merged onto the paper.' },
]

export function PackageBoxPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, tape, hint, reserveSpace, open } = settings.values

  const usage = toUsageSnippet({
    component: 'PackageBox',
    from: '@/components/ui/package-box',
    props: {
      slip: title === DEFAULTS.title ? undefined : { expression: `{ title: '${title.replace(/'/g, "\\'")}' }` },
      tape,
      hint,
      reserveSpace,
      open: open || undefined,
      onOpenChange: open ? { expression: 'setOpen' } : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / package-box"
      title="Package Box"
      description="A cardboard package drawn in CSS 3D. Click and the tape splits, the flaps fold open, and a packing slip rises out and turns to face you. Escape closes. Pure Motion — no images."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Slip title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
            maxLength={48}
          />
          <DemoSwitch
            label="Tape"
            checked={tape}
            onCheckedChange={(next) => settings.set('tape', next)}
          />
          <DemoSwitch
            label="Hint button"
            checked={hint}
            onCheckedChange={(next) => settings.set('hint', next)}
          />
          <DemoSwitch
            label="Reserve space"
            checked={reserveSpace}
            onCheckedChange={(next) => settings.set('reserveSpace', next)}
          />
          <DemoSwitch
            label="Start open"
            checked={open}
            onCheckedChange={(next) => settings.set('open', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/package-box/'], usage, props: PROPS }}
    >
      <div className="flex w-full justify-center rounded-2xl border bg-[#f4f3f0] p-4 shadow-xs sm:p-8 dark:bg-neutral-900">
        <PackageBox
          key={`${open}-${reserveSpace}`}
          defaultOpen={open}
          tape={tape}
          hint={hint}
          reserveSpace={reserveSpace}
          slip={{ title: title || 'Untitled' }}
        />
      </div>
    </DemoPage>
  )
}
