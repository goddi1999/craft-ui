import { useState, type ReactNode } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Input } from '@/components/ui/input'
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

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function FuseButtonPage() {
  const [label, setLabel] = useState('Archive')
  const [undoLabel, setUndoLabel] = useState('Undo')
  const [doneLabel, setDoneLabel] = useState('Archived')
  const [color, setColor] = useState('#f5f5f5')
  const [background, setBackground] = useState('#27272a')
  const [fuseColor, setFuseColor] = useState('#ff5e24')
  const [size, setSize] = useState<FuseSize>('md')
  const [radius, setRadius] = useState(22)
  const [undoWindow, setUndoWindow] = useState(4000)
  const [fuse, setFuse] = useState<FusePosition>('outline')
  const [fuseThickness, setFuseThickness] = useState(1.5)
  const [crossfadeMs, setCrossfadeMs] = useState(200)
  const [commitOn, setCommitOn] = useState<FuseCommitOn>('press')
  const [settle, setSettle] = useState<FuseSettle>('reset')
  const [pauseOnHover, setPauseOnHover] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [status, setStatus] = useState('Tap Archive to arm the fuse.')
  const [replayKey, setReplayKey] = useState(0)

  return (
    <DemoPage
      eyebrow="ui / fuse-button"
      title="Fuse Button"
      description="A commit button that arms a burning fuse instead of showing a confirm dialog — tap again, or wait it out, before it locks in."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-20 lg:flex-row lg:items-start">
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-4 rounded-2xl border bg-zinc-900 p-10">
          <FuseButton
            key={`${fuse}-${commitOn}-${settle}-${pauseOnHover}-${size}-${disabled}-${replayKey}`}
            label={label}
            undoLabel={undoLabel}
            doneLabel={doneLabel}
            color={color}
            background={background}
            fuseColor={fuseColor}
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

        <DemoPanel className="max-w-md shrink-0">
          <Field label="Label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <Field label="Undo label">
            <Input
              value={undoLabel}
              onChange={(e) => setUndoLabel(e.target.value)}
            />
          </Field>
          <Field label="Done label">
            <Input
              value={doneLabel}
              onChange={(e) => setDoneLabel(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Text">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
            <Field label="Background">
              <Input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
            <Field label="Fuse color">
              <Input
                type="color"
                value={fuseColor}
                onChange={(e) => setFuseColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
          </div>

          <DemoControlGroup
            title="size"
            options={SIZES}
            value={size}
            onChange={setSize}
          />
          <DemoControlGroup
            title="fuse style"
            options={FUSE_POSITIONS}
            value={fuse}
            onChange={setFuse}
          />
          <DemoControlGroup
            title="commit on"
            options={COMMIT_MODES}
            value={commitOn}
            onChange={setCommitOn}
          />
          <DemoControlGroup
            title="after fuse"
            options={SETTLE_MODES}
            value={settle}
            onChange={setSettle}
          />

          <Field label={`Radius · ${radius}px`}>
            <Input
              type="range"
              min={0}
              max={28}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </Field>
          <Field label={`Undo window · ${undoWindow}ms`}>
            <Input
              type="range"
              min={1000}
              max={8000}
              step={100}
              value={undoWindow}
              onChange={(e) => setUndoWindow(Number(e.target.value))}
            />
          </Field>
          <Field label={`Fuse thickness · ${fuseThickness}px`}>
            <Input
              type="range"
              min={1}
              max={4}
              step={0.25}
              value={fuseThickness}
              onChange={(e) => setFuseThickness(Number(e.target.value))}
            />
          </Field>
          <Field label={`Crossfade · ${crossfadeMs}ms`}>
            <Input
              type="range"
              min={0}
              max={600}
              step={25}
              value={crossfadeMs}
              onChange={(e) => setCrossfadeMs(Number(e.target.value))}
            />
          </Field>

          <DemoToggleRow>
            <DemoToggle
              label="Pause on hover"
              pressed={pauseOnHover}
              onPressedChange={setPauseOnHover}
            />
            <DemoToggle
              label="Disabled"
              pressed={disabled}
              onPressedChange={setDisabled}
            />
            <DemoToggle
              label="Reset"
              pressed={false}
              onPressedChange={() => {
                setReplayKey((n) => n + 1)
                setStatus('Tap Archive to arm the fuse.')
              }}
            />
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
