import {
  CONFETTI_COLORS,
  DRAG,
  FADE_FROM,
  FRAME_MS,
  GRAVITY,
  LIFT,
  MAX_STEP,
  SPREAD,
} from './rocket-party-popper.constants'
import type { ConfettiParticle } from './rocket-party-popper.types'

const random = (min: number, max: number) => min + Math.random() * (max - min)

function spawn(x: number, y: number, scale: number, ink: string): ConfettiParticle {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * SPREAD
  const speed = random(4.8, 12.3) * scale
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - LIFT * scale,
    width: random(4, 8.5) * scale,
    height: random(6, 14) * scale,
    color: color === 'currentColor' ? ink : color,
    rotation: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 10,
    wobble: Math.random() * Math.PI,
    vWobble: random(0.08, 0.18),
    life: random(70, 110),
    age: 0,
    // a third are dots, the rest are strips that flutter
    round: Math.random() < 1 / 3,
  }
}

// moves a piece on by `dt` frames
function step(piece: ConfettiParticle, dt: number): ConfettiParticle {
  const drag = DRAG ** dt
  return {
    ...piece,
    x: piece.x + piece.vx * dt,
    y: piece.y + piece.vy * dt,
    vx: piece.vx * drag,
    vy: piece.vy * drag + GRAVITY * dt,
    rotation: piece.rotation + piece.vRot * dt,
    wobble: piece.wobble + piece.vWobble * dt,
    age: piece.age + dt,
  }
}

function draw(ctx: CanvasRenderingContext2D, piece: ConfettiParticle) {
  const progress = piece.age / piece.life
  const alpha = progress > FADE_FROM ? 1 - (progress - FADE_FROM) / (1 - FADE_FROM) : 1

  ctx.save()
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  ctx.translate(piece.x, piece.y)
  ctx.rotate((piece.rotation * Math.PI) / 180)
  ctx.fillStyle = piece.color

  if (piece.round) {
    ctx.beginPath()
    ctx.arc(0, 0, piece.width / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // squashing the height through the wobble makes the strip look like it flips
    const height = piece.height * Math.sin(piece.wobble)
    ctx.fillRect(-piece.width / 2, -height / 2, piece.width, height)
  }

  ctx.restore()
}

/** Confetti on a canvas, running on its own animation frames outside React. */
export function createConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  let pieces: ConfettiParticle[] = []
  let frame = 0
  let last = 0

  const tick = (now: number) => {
    if (!ctx) return
    // counted in 60 fps frames, so it falls at the same speed on a 120 Hz screen
    const dt = last ? Math.min((now - last) / FRAME_MS, MAX_STEP) : 1
    last = now
    pieces = pieces
      .map((piece) => step(piece, dt))
      .filter((piece) => piece.age < piece.life && piece.y < canvas.height + 40)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach((piece) => draw(ctx, piece))
    frame = pieces.length ? requestAnimationFrame(tick) : 0
  }

  /** Throws `count` pieces up from the middle of the canvas, `top` css px down from its top. */
  const burst = (count: number, top: number) => {
    if (!ctx) return
    const scale = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const width = Math.round(rect.width * scale)
    const height = Math.round(rect.height * scale)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    const ink = getComputedStyle(canvas).color
    const x = (rect.width / 2) * scale
    pieces = Array.from({ length: count }, () => spawn(x, top * scale, scale, ink))
    if (!frame) {
      last = 0
      frame = requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
    pieces = []
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
  }

  return { burst, stop }
}

export type Confetti = ReturnType<typeof createConfetti>
