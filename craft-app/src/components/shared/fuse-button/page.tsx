import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  FuseButton,
  type FuseCommitOn,
  type FusePosition,
  type FuseSettle,
  type FuseSize,
} from '@/components/ui/fuse-button'

const FUSE_POSITIONS: FusePosition[] = ['outline', 'bottom', 'top']
const COMMIT_MODES: FuseCommitOn[] = ['press', 'fuseEnd']
const SETTLE_MODES: FuseSettle[] = ['reset', 'stay']
const SIZES: FuseSize[] = ['sm', 'md', 'lg']

/** Demo-only surface palettes — each maps to the `background` and `color` props. */
const SURFACES = {
  zinc: { background: '#27272a', color: '#f5f5f5' },
  light: { background: '#f4f4f5', color: '#18181b' },
  indigo: { background: '#312e81', color: '#e0e7ff' },
  emerald: { background: '#064e3b', color: '#d1fae5' },
} as const
type Surface = keyof typeof SURFACES

const FUSE_COLORS = {
  orange: '#ff5e24',
  amber: '#f5a524',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
} as const
type FuseColor = keyof typeof FUSE_COLORS

const SURFACE_NAMES = Object.keys(SURFACES) as Surface[]
const FUSE_COLOR_NAMES = Object.keys(FUSE_COLORS) as FuseColor[]

const IDLE_STATUS = 'Tap the button to arm the fuse.'

const DEFAULTS = {
  label: 'Archive',
  undoLabel: 'Undo',
  doneLabel: 'Archived',
  surface: 'zinc' as Surface,
  fuseColor: 'orange' as FuseColor,
  size: 'md' as FuseSize,
  fuse: 'outline' as FusePosition,
  commitOn: 'press' as FuseCommitOn,
  settle: 'reset' as FuseSettle,
  radius: 22,
  undoWindow: 4000,
  fuseThickness: 1.5,
  crossfadeMs: 200,
  pauseOnHover: true,
  disabled: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  label: 'Archive',
  undoLabel: 'Undo',
  doneLabel: 'Archived',
  color: '#f5f5f5',
  background: '#27272a',
  fuseColor: '#ff5e24',
  size: 'md',
  radius: 22,
  undoWindow: 4000,
  fuse: 'outline',
  fuseThickness: 1.5,
  crossfadeMs: 200,
  commitOn: 'press',
  pauseOnHover: true,
  settle: 'reset',
  disabled: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'label',
    type: 'string',
    default: "'Archive'",
    description: 'Idle action text.',
  },
  {
    name: 'undoLabel',
    type: 'string',
    default: "'Undo'",
    description: 'Label shown while the fuse burns.',
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: "'Archived'",
    description: "Text shown with a check once the fuse burns out (settle 'stay').",
  },
  {
    name: 'icon',
    type: 'ReactNode',
    default: '<Archive />',
    description: 'Idle glyph.',
  },
  {
    name: 'color',
    type: 'string',
    default: "'#f5f5f5'",
    description: 'Ink colour for labels and icons.',
  },
  {
    name: 'background',
    type: 'string',
    default: "'#27272a'",
    description: 'Surface colour of the button.',
  },
  {
    name: 'fuseColor',
    type: 'string',
    default: "'#ff5e24'",
    description: 'Colour of the lit fuse line or ring.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Height 36, 44 or 52px with matching type.',
  },
  {
    name: 'radius',
    type: 'number',
    default: '22',
    description: 'Corner radius in px — 22 is a full pill at md.',
  },
  {
    name: 'undoWindow',
    type: 'number',
    default: '4000',
    description: 'Milliseconds the fuse burns and Undo stays available.',
  },
  {
    name: 'fuse',
    type: "'outline' | 'bottom' | 'top'",
    default: "'outline'",
    description: 'Rim burning clockwise, or a line along the bottom or top edge.',
  },
  {
    name: 'fuseThickness',
    type: 'number',
    default: '1.5',
    description: 'Stroke width or line height of the fuse in px.',
  },
  {
    name: 'crossfadeMs',
    type: 'number',
    default: '200',
    description: 'Blur crossfade duration between faces after a pointer press.',
  },
  {
    name: 'commitOn',
    type: "'press' | 'fuseEnd'",
    default: "'press'",
    description: 'Fire onCommit immediately (with undo) or only once the fuse ends.',
  },
  {
    name: 'settle',
    type: "'reset' | 'stay'",
    default: "'reset'",
    description: 'Return to idle, or stay on the done face after the fuse ends.',
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Hovering with a mouse freezes the fuse.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dims the idle button and ignores presses.',
  },
  {
    name: 'onCommit',
    type: "(reason: 'press' | 'fuseEnd') => void",
    description: 'The primary action.',
  },
  {
    name: 'onUndo',
    type: '() => void',
    description: 'Called when the action is reverted with Undo or Escape.',
  },
  {
    name: 'onFuseEnd',
    type: '() => void',
    description: 'Called when the fuse window closes without an undo.',
  },
  {
    name: 'onPhaseChange',
    type: "(phase: 'idle' | 'armed' | 'settled') => void",
    description: 'Called on every state change.',
  },
  {
    name: 'className / type',
    type: "string / 'button' | 'submit' | 'reset'",
    description: 'Extra root classes and the idle button type.',
  },
]

export function FuseButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    label,
    undoLabel,
    doneLabel,
    surface,
    fuseColor,
    size,
    fuse,
    commitOn,
    settle,
    radius,
    undoWindow,
    fuseThickness,
    crossfadeMs,
    pauseOnHover,
    disabled,
  } = settings.values
  const [status, setStatus] = useState(IDLE_STATUS)
  const [remountCount, setRemountCount] = useState(0)
  const { background, color } = SURFACES[surface]

  const handleBackToIdle = () => {
    setRemountCount((count) => count + 1)
    setStatus(IDLE_STATUS)
  }

  const usage = toUsageSnippet({
    component: 'FuseButton',
    from: '@/components/ui/fuse-button',
    props: {
      label,
      undoLabel,
      doneLabel,
      color,
      background,
      fuseColor: FUSE_COLORS[fuseColor],
      size,
      radius,
      undoWindow,
      fuse,
      fuseThickness,
      crossfadeMs,
      commitOn,
      settle,
      pauseOnHover,
      disabled,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / fuse-button"
      title="Fuse Button"
      description="A commit button that arms a burning fuse instead of showing a confirm dialog — tap again, or wait it out, before it locks in."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={20}
          />
          <DemoTextField
            label="Undo label"
            value={undoLabel}
            onValueChange={(value) => settings.set('undoLabel', value)}
            maxLength={20}
          />
          <DemoTextField
            label="Done label"
            value={doneLabel}
            onValueChange={(value) => settings.set('doneLabel', value)}
            maxLength={20}
          />
          <DemoControlGroup
            title="Surface"
            options={SURFACE_NAMES}
            value={surface}
            onChange={(value) => settings.set('surface', value)}
          />
          <DemoControlGroup
            title="Fuse color"
            options={FUSE_COLOR_NAMES}
            value={fuseColor}
            onChange={(value) => settings.set('fuseColor', value)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Fuse"
            options={FUSE_POSITIONS}
            value={fuse}
            onChange={(value) => settings.set('fuse', value)}
          />
          <DemoControlGroup
            title="Commit on"
            options={COMMIT_MODES}
            value={commitOn}
            onChange={(value) => settings.set('commitOn', value)}
          />
          <DemoControlGroup
            title="After the fuse"
            options={SETTLE_MODES}
            value={settle}
            onChange={(value) => settings.set('settle', value)}
          />
          <DemoSlider
            label="Radius"
            value={radius}
            onValueChange={(value) => settings.set('radius', value)}
            min={0}
            max={28}
            unit="px"
          />
          <DemoSlider
            label="Undo window"
            value={undoWindow}
            onValueChange={(value) => settings.set('undoWindow', value)}
            min={1000}
            max={8000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="Fuse thickness"
            value={fuseThickness}
            onValueChange={(value) => settings.set('fuseThickness', value)}
            min={1}
            max={4}
            step={0.25}
            unit="px"
          />
          <DemoSlider
            label="Crossfade"
            value={crossfadeMs}
            onValueChange={(value) => settings.set('crossfadeMs', value)}
            min={0}
            max={600}
            step={25}
            unit="ms"
          />
          <DemoSwitch
            label="Pause on hover"
            checked={pauseOnHover}
            onCheckedChange={(value) => settings.set('pauseOnHover', value)}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(value) => settings.set('disabled', value)}
          />
          <DemoAction onClick={handleBackToIdle}>Back to idle</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/fuse-button/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <FuseButton
          key={remountCount}
          label={label}
          undoLabel={undoLabel}
          doneLabel={doneLabel}
          color={color}
          background={background}
          fuseColor={FUSE_COLORS[fuseColor]}
          size={size}
          radius={radius}
          undoWindow={undoWindow}
          fuse={fuse}
          fuseThickness={fuseThickness}
          crossfadeMs={crossfadeMs}
          commitOn={commitOn}
          settle={settle}
          pauseOnHover={pauseOnHover}
          disabled={disabled}
          onCommit={(reason) => setStatus(`Committed (${reason})`)}
          onUndo={() => setStatus('Undone')}
          onFuseEnd={() => setStatus('Fuse reached the end')}
          onPhaseChange={(phase) => {
            if (phase === 'armed') setStatus('Armed — undo or wait')
          }}
        />
        <p className="h-4 text-xs text-muted-foreground" aria-live="polite">
          {status}
        </p>
      </div>
    </DemoPage>
  )
}
