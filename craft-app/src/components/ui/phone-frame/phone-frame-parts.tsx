import { AlignJustify, AudioLines, Heart, Mic, Music, Pause, Play, SkipBack, SkipForward, Wifi } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  FRAME_COLORS,
  ISLAND_ART,
  PROGRESS_RING_RADIUS,
  RAIL_LIGHTING,
  SIGNAL_BARS,
  WAVEFORM_BARS,
} from './phone-frame.constants'
import type { DynamicIslandSize, PhoneFrameColor } from './phone-frame.types'

export function RailButton({ frameColor, className }: { frameColor: PhoneFrameColor; className?: string }) {
  const lighting = frameColor === 'gold' ? RAIL_LIGHTING.gold : RAIL_LIGHTING.neutral
  return (
    <div
      aria-hidden
      className={cn(
        'absolute -left-[3px] isolate w-[3px] overflow-visible rounded-l-sm',
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-l-sm before:content-['']",
        lighting.beforeShadow,
        "after:pointer-events-none after:absolute after:-right-px after:-left-px after:top-[calc(100%-2px)] after:z-0 after:h-2.5 after:opacity-[0.72] after:blur-xs after:content-['']",
        lighting.afterClasses,
        className,
      )}
      style={{ background: FRAME_COLORS[frameColor].button, boxShadow: lighting.boxShadow }}
    />
  )
}

export function StatusBar({
  time,
  batteryLevel,
  signalStrength,
}: {
  time: string
  batteryLevel: number
  signalStrength: number
}) {
  const battery = Math.max(0, Math.min(100, batteryLevel))
  const signal = Math.max(0, Math.min(4, signalStrength))

  return (
    <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-6 pt-4 text-xs font-medium text-foreground">
      <span className="sr-only">
        {`Time ${time}, signal ${signal} of 4 bars, Wi-Fi connected, battery ${Math.round(battery)}%`}
      </span>
      <div aria-hidden className="mt-1 ml-1 flex w-14 items-center">
        <span className="text-[14px] font-semibold tracking-tight">{time}</span>
      </div>
      <div aria-hidden className="flex w-17 items-center justify-end gap-[5px]">
        <div className="flex items-end gap-px">
          {SIGNAL_BARS.map((bar) => (
            <div
              key={bar}
              className={cn('w-[3px] rounded-[1px] bg-current', bar > signal && 'opacity-30')}
              style={{ height: 3 + bar * 2 }}
            />
          ))}
        </div>
        <Wifi className="size-3.5" strokeWidth={2} />
        <div className="flex items-center">
          <div className="relative h-[12px] w-[24px] rounded-[4px] border border-current/20">
            <div
              className="absolute top-[1.2px] bottom-px left-[1.2px] rounded-[2.5px] bg-current/90 transition-[width] motion-reduce:transition-none"
              style={{ width: battery * 0.19 }}
            />
          </div>
          <div className="ml-[0.5px] h-[5px] w-[1.5px] rounded-r-sm bg-current/40" />
        </div>
      </div>
    </div>
  )
}

export function IslandCamera() {
  return (
    <div
      className="size-[10px] rounded-full"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #2a3a5a 0%, #0f1520 60%, #000 100%)',
        boxShadow: 'inset 0 0 2px rgba(100, 150, 255, 0.3)',
      }}
    />
  )
}

function Waveform({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-5 items-end gap-px', className)}>
      {WAVEFORM_BARS.map((height, index) => (
        <span key={index} className="w-1 min-w-px rounded-full bg-rose-400/95" style={{ height }} />
      ))}
    </div>
  )
}

function ProgressRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * PROGRESS_RING_RADIUS
  return (
    <span className="relative inline-flex size-10 items-center justify-center">
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={PROGRESS_RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" />
        <circle
          cx="22"
          cy="22"
          r={PROGRESS_RING_RADIUS}
          fill="none"
          stroke="#1db954"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
      <span className="flex size-8 items-center justify-center rounded-full bg-white/[0.14]">
        <Pause className="size-3.5 text-white" strokeWidth={2.5} />
      </span>
    </span>
  )
}

const CONTROL = 'flex size-7.5 shrink-0 items-center justify-center rounded-full bg-white/[0.14] text-white'

/** Decorative now-playing content for the opened island sizes. */
export function IslandContent({ size }: { size: Exclude<DynamicIslandSize, 'default'> }) {
  if (size === 'expanded') {
    return (
      <div className="flex size-full items-center justify-between gap-3 px-0.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1db954]">
            <AudioLines className="size-[18px] text-black" strokeWidth={2.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-white/65">Night Shift</p>
            <p className="truncate text-[14px] leading-tight font-semibold">Let You Go</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ProgressRing progress={0.72} />
          <span className="flex size-9 items-center justify-center rounded-full bg-white/[0.14]">
            <SkipForward className="size-4" strokeWidth={2.25} />
          </span>
        </div>
      </div>
    )
  }

  if (size === 'large') {
    return (
      <div className="flex size-full flex-col justify-between gap-1">
        <div className="flex items-center gap-2.5">
          <div className={cn('size-14 shrink-0 rounded-xl', ISLAND_ART)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold tracking-wide uppercase">The Move</p>
            <p className="truncate text-[11px] text-white/55">Space Rangers</p>
          </div>
          <Waveform className="h-12" />
        </div>
        <div className="space-y-1 px-2 pb-2">
          <div className="flex justify-between text-[9px] font-medium text-white/45 tabular-nums">
            <span>1:20</span>
            <span>-1:48</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/16">
            <div className="h-full w-[41%] rounded-full bg-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col gap-2.5">
      <div className="mt-0.5 flex items-center justify-between text-[10px] font-medium tabular-nums">
        <span className="ml-2 text-white/90">0:42</span>
        <AudioLines className="mr-2 size-[18px] text-[#1db954]" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-2.5">
        <div className={cn('size-10 shrink-0 rounded-full', ISLAND_ART)} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-white/65">Night Shift</p>
          <p className="text-[15px] leading-snug font-semibold tracking-tight">Let You Go</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <span className={CONTROL}>
            <Mic className="size-3.5 text-white/80" strokeWidth={2.5} />
          </span>
          <span className={CONTROL}>
            <Music className="size-3.5 text-white/80" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-white/45 tabular-nums">
        <span>1:40</span>
        <div className="relative flex h-4 w-full items-center">
          <div className="h-1 w-full rounded-full bg-white/14" />
          <div className="absolute top-1/2 left-0 h-1 w-[48%] -translate-y-1/2 rounded-l-full bg-white" />
          <div className="absolute top-1/2 left-[48%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/25 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]" />
        </div>
        <span>3:20</span>
      </div>
      <div className="mt-2 grid grid-cols-5 place-items-center gap-1">
        <span className={CONTROL}>
          <Heart className="size-[15px]" strokeWidth={2} />
        </span>
        <span className={CONTROL}>
          <SkipBack className="size-[17px]" strokeWidth={2} />
        </span>
        <span className={CONTROL}>
          <Play className="ml-0.5 size-[17px] fill-current" strokeWidth={0} />
        </span>
        <span className={CONTROL}>
          <SkipForward className="size-[17px]" strokeWidth={2} />
        </span>
        <span className={CONTROL}>
          <AlignJustify className="size-[15px]" strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}
