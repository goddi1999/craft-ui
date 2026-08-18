import { useRef } from 'react'

import { cn } from '@/lib/utils'

import { AnimatedBeam } from './AnimatedBeam'

function Node({
  ref,
  className,
  children,
}: {
  ref: React.RefObject<HTMLDivElement | null>
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background text-sm font-medium shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AnimatedBeamPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const c = useRef<HTMLDivElement>(null)
  const out = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / animated-beam
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Animated beam
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            An SVG path measured between two refs, with a gradient travelling
            along it. The curve re-measures whenever the container resizes.
          </p>
        </header>

        <section
          ref={containerRef}
          className="relative flex h-80 w-full items-center justify-between rounded-2xl border border-border p-10"
        >
          <div className="flex flex-col justify-between gap-8">
            <Node ref={a}>A</Node>
            <Node ref={b}>B</Node>
            <Node ref={c}>C</Node>
          </div>
          <Node ref={hubRef} className="size-16">
            Hub
          </Node>
          <Node ref={out}>Out</Node>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={a}
            toRef={hubRef}
            curvature={-60}
            duration={4}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={b}
            toRef={hubRef}
            duration={5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={c}
            toRef={hubRef}
            curvature={60}
            duration={4.5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={hubRef}
            toRef={out}
            duration={3.5}
            gradientStartColor="#38bdf8"
            gradientStopColor="#22d3ee"
          />
        </section>
      </div>
    </div>
  )
}
