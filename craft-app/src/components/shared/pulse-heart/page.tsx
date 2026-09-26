import { useState, type ReactNode } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Input } from '@/components/ui/input'
import { PulseHeart, type PulseHeartIcon } from '@/components/ui/pulse-heart'

const ICONS: PulseHeartIcon[] = ['heart', 'star', 'thumb']

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

export function PulseHeartPage() {
  const [count, setCount] = useState(1248)
  const [showCount, setShowCount] = useState(true)
  const [icon, setIcon] = useState<PulseHeartIcon>('heart')
  const [idleOutline, setIdleOutline] = useState(true)
  const [likedColor, setLikedColor] = useState('#ff4d4d')
  const [idleColor, setIdleColor] = useState('#8b8b93')
  const [pillColor, setPillColor] = useState('#232326')
  const [textColor, setTextColor] = useState('#ffffff')
  const [size, setSize] = useState(40)
  const [corner, setCorner] = useState(32)
  const [duration, setDuration] = useState(560)
  const [dotSize, setDotSize] = useState(0.3)
  const [overshoot, setOvershoot] = useState(1.7)
  const [beat, setBeat] = useState(3)
  const [rollDuration, setRollDuration] = useState(350)
  const [disabled, setDisabled] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / pulse-heart"
      title="Pulse Heart"
      description="A like pill that swells through a bezier overshoot on toggle, while its count rolls like an odometer digit."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-20 lg:flex-row lg:items-start">
        <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border bg-zinc-900 p-10">
          <PulseHeart
            key={`${icon}-${idleOutline}-${showCount}-${disabled}`}
            count={count}
            showCount={showCount}
            icon={icon}
            idleOutline={idleOutline}
            likedColor={likedColor}
            idleColor={idleColor}
            pillColor={pillColor}
            textColor={textColor}
            size={size}
            corner={corner}
            duration={duration}
            dotSize={dotSize}
            overshoot={overshoot}
            beat={beat}
            rollDuration={rollDuration}
            disabled={disabled}
            defaultLiked={false}
            onChange={(_liked, next) => setCount(next)}
          />
        </div>

        <DemoPanel className="max-w-md shrink-0">
          <Field label="Count">
            <Input
              type="number"
              min={0}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 0)}
            />
          </Field>

          <DemoControlGroup
            title="icon"
            options={ICONS}
            value={icon}
            onChange={setIcon}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Liked color">
              <Input
                type="color"
                value={likedColor}
                onChange={(e) => setLikedColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
            <Field label="Idle color">
              <Input
                type="color"
                value={idleColor}
                onChange={(e) => setIdleColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
            <Field label="Pill color">
              <Input
                type="color"
                value={pillColor}
                onChange={(e) => setPillColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
            <Field label="Text color">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-9 cursor-pointer p-1"
              />
            </Field>
          </div>

          <Field label={`Size · ${size}px`}>
            <Input
              type="range"
              min={24}
              max={72}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </Field>
          <Field label={`Corner · ${corner}px`}>
            <Input
              type="range"
              min={0}
              max={40}
              value={corner}
              onChange={(e) => setCorner(Number(e.target.value))}
            />
          </Field>
          <Field label={`Duration · ${duration}ms`}>
            <Input
              type="range"
              min={200}
              max={1200}
              step={10}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </Field>
          <Field label={`Dot size · ${dotSize}`}>
            <Input
              type="range"
              min={0.1}
              max={0.8}
              step={0.05}
              value={dotSize}
              onChange={(e) => setDotSize(Number(e.target.value))}
            />
          </Field>
          <Field label={`Overshoot · ${overshoot}`}>
            <Input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={overshoot}
              onChange={(e) => setOvershoot(Number(e.target.value))}
            />
          </Field>
          <Field label={`Beat · ${beat}%`}>
            <Input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={beat}
              onChange={(e) => setBeat(Number(e.target.value))}
            />
          </Field>
          <Field label={`Roll · ${rollDuration}ms`}>
            <Input
              type="range"
              min={100}
              max={800}
              step={10}
              value={rollDuration}
              onChange={(e) => setRollDuration(Number(e.target.value))}
            />
          </Field>

          <DemoToggleRow>
            <DemoToggle
              label="Show count"
              pressed={showCount}
              onPressedChange={setShowCount}
            />
            <DemoToggle
              label="Idle outline"
              pressed={idleOutline}
              onPressedChange={setIdleOutline}
            />
            <DemoToggle
              label="Disabled"
              pressed={disabled}
              onPressedChange={setDisabled}
            />
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
