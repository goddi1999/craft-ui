import { useId, useRef, type PointerEvent } from 'react'

import { cn } from '@/lib/utils'

import { ArcGradients, ArcStrokes, Dots } from './agent-computer-icon-parts'
import { BOT_COLORS, DOT, NOTIFY, SCALE, VIEW } from './agent-computer-icon.constants'
import type { AgentComputerIconProps, BotColor } from './agent-computer-icon.types'
import { phaseFrom } from './agent-computer-icon.utils'
import { useBotMotion } from './use-bot-motion'

/**
 * A bot avatar in the grokbots.ai studio style: one flat colour with two pill eyes cut clean
 * through it, so whatever sits behind shows in the eyes. Shapes and faces morph into each other,
 * the gaze drifts and blinks while idle, it can follow the pointer, and it plays the studio's
 * Move states on cue.
 */
export function AgentComputerIcon({
  shape = 'circle',
  face = 'neutral',
  color = 'blue',
  size = 48,
  online = false,
  animated = true,
  lookAtCursor = false,
  motion = 'idle',
  motionKey,
  onMotionEnd,
  paused = false,
  label,
  className,
  onPointerEnter,
  ...props
}: AgentComputerIconProps) {
  const id = useId()
  const prefix = `bot-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const svg = useRef<SVGSVGElement>(null)
  const body = useRef<SVGRectElement>(null)
  const outline = useRef<SVGPathElement>(null)
  const leftEye = useRef<SVGPathElement>(null)
  const rightEye = useRef<SVGPathElement>(null)
  const notch = useRef<SVGCircleElement>(null)
  const dot = useRef<SVGCircleElement>(null)
  const { initial, effects, blink } = useBotMotion({
    refs: { svg, body, shape: outline, eyes: [leftEye, rightEye], notch, dot },
    shape,
    face,
    animated,
    lookAtCursor,
    online,
    motion,
    motionKey,
    onMotionEnd,
    paused,
    phase: phaseFrom(id),
  })
  const fill = BOT_COLORS[color as BotColor] ?? color
  const [left, right] = initial.eyes
  const badgeRadius = DOT.radius * SCALE * initial.badge.scale

  const handlePointerEnter = (event: PointerEvent<SVGSVGElement>) => {
    onPointerEnter?.(event)
    // it notices you
    if (event.pointerType !== 'touch') blink()
  }

  return (
    <svg
      {...props}
      ref={svg}
      data-slot="agent-computer-icon"
      viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onPointerEnter={handlePointerEnter}
      className={cn('inline-block shrink-0 overflow-visible', className)}
    >
      <defs>
        <mask
          id={`${prefix}-mask`}
          maskUnits="userSpaceOnUse"
          x={-VIEW * 2}
          y={-VIEW * 2}
          width={VIEW * 4}
          height={VIEW * 4}
        >
          <path ref={outline} d={initial.body} fill="#fff" />
          <path
            ref={leftEye}
            d={left?.d}
            transform={left?.transform}
            opacity={left?.opacity ?? 0}
            fill="#000"
          />
          <path
            ref={rightEye}
            d={right?.d}
            transform={right?.transform}
            opacity={right?.opacity ?? 0}
            fill="#000"
          />
          {online ? (
            <circle
              ref={notch}
              cx={initial.badge.x}
              cy={initial.badge.y}
              r={(DOT.radius + DOT.gap) * SCALE * initial.badge.scale}
              fill="#000"
            />
          ) : null}
          {effects.notif ? (
            <circle cx={effects.notif.x} cy={effects.notif.y} r={effects.notif.notch} fill="#000" />
          ) : null}
        </mask>
        <ArcGradients arcs={effects.arcs} prefix={prefix} />
      </defs>
      <ArcStrokes arcs={effects.arcs} side="back" prefix={prefix} />
      {effects.dotsBehind ? <Dots dots={effects.dots} fill={fill} /> : null}
      <rect
        ref={body}
        x={-VIEW * 2}
        y={-VIEW * 2}
        width={VIEW * 4}
        height={VIEW * 4}
        fill={fill}
        opacity={initial.bodyAlpha}
        mask={`url(#${prefix}-mask)`}
      />
      {effects.dotsBehind ? null : <Dots dots={effects.dots} fill={fill} />}
      {effects.notif ? (
        <circle cx={effects.notif.x} cy={effects.notif.y} r={effects.notif.r} fill={NOTIFY.color} />
      ) : null}
      {online ? (
        <circle ref={dot} cx={initial.badge.x} cy={initial.badge.y} r={badgeRadius} fill={DOT.color} />
      ) : null}
      <ArcStrokes arcs={effects.arcs} side="front" prefix={prefix} />
    </svg>
  )
}
