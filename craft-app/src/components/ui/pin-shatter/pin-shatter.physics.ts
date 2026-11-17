import {
  AIR_DRAG,
  BALL_COUNT,
  BALL_RADIUS_MIN,
  BALL_RADIUS_SHARE,
  BURST_LIFT_MAX,
  BURST_LIFT_MIN,
  BURST_SPEED_MAX,
  BURST_SPEED_MIN,
  BURST_START,
  FADE_BOUNCES,
  FADE_S,
  FADE_SETTLED_BOUNCES,
  FADE_SETTLED_SPEED,
  FLOOR_GRIP,
  GRAVITY,
  MAX_LIFE_S,
  REST_SPEED,
  RESTITUTION,
  SQUASH_BALL,
  SQUASH_FLOOR,
  SQUASH_RECOVERY,
  SQUASH_SPEED_BALL,
  SQUASH_SPEED_FLOOR,
  WALL_RESTITUTION,
} from './pin-shatter.constants'

export type Point = { x: number; y: number }

export type Bounds = { width: number; height: number }

export type Ball = Point & {
  vx: number
  vy: number
  radius: number
  mass: number
  /** Stretch along `squashAngle`; the ball is thinner across it. 1 = round. */
  stretch: number
  squashAngle: number
  bounces: number
  age: number
  /** Seconds spent fading; 0 while the ball is still live. */
  fade: number
}

type Random = () => number

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

/** Balls ring the pin's centre and fly outward from it. */
export function createBalls(
  origin: Point,
  pinRadius: number,
  random: Random = Math.random,
): Ball[] {
  return Array.from({ length: BALL_COUNT }, (_, i) => {
    const heading = ((i + (random() - 0.5) * 0.9) / BALL_COUNT) * Math.PI * 2
    const speed = lerp(BURST_SPEED_MIN, BURST_SPEED_MAX, random())
    const radius = Math.max(
      BALL_RADIUS_MIN,
      pinRadius * BALL_RADIUS_SHARE * lerp(0.85, 1.2, random()),
    )
    return {
      x: origin.x + Math.cos(heading) * pinRadius * BURST_START,
      y: origin.y + Math.sin(heading) * pinRadius * BURST_START,
      vx: Math.cos(heading) * speed,
      vy:
        Math.sin(heading) * speed -
        lerp(BURST_LIFT_MIN, BURST_LIFT_MAX, random()),
      radius,
      mass: radius * radius,
      stretch: 1,
      squashAngle: 0,
      bounces: 0,
      age: 0,
      fade: 0,
    }
  })
}

function squash(ball: Ball, angle: number, amount: number) {
  ball.squashAngle = angle
  ball.stretch = 1 + amount
}

/** Opacity of a ball: 1 while live, 0 once its fade is over. */
export const ballAlpha = (ball: Ball) => Math.max(0, 1 - ball.fade / FADE_S)

/**
 * Advances every ball by `dt` seconds: gravity, air drag, bounces off the
 * floor and both walls, squash on impact, and ball-against-ball collisions.
 * Mutates `balls` so the frame loop allocates nothing. Returns the balls that
 * are still visible.
 */
export function stepBalls(balls: Ball[], dt: number, bounds: Bounds): Ball[] {
  const drag = Math.exp(-AIR_DRAG * dt)
  const recover = Math.min(1, SQUASH_RECOVERY * dt)

  for (const ball of balls) {
    ball.age += dt
    ball.vx *= drag
    ball.vy = ball.vy * drag + GRAVITY * dt
    ball.x += ball.vx * dt
    ball.y += ball.vy * dt
    ball.stretch += (1 - ball.stretch) * recover

    if (ball.x < ball.radius) {
      const impact = Math.abs(ball.vx)
      ball.x = ball.radius
      ball.vx = impact * WALL_RESTITUTION
      if (impact > 45) squash(ball, 90, Math.min(SQUASH_FLOOR, impact / SQUASH_SPEED_FLOOR))
    } else if (ball.x > bounds.width - ball.radius) {
      const impact = Math.abs(ball.vx)
      ball.x = bounds.width - ball.radius
      ball.vx = -impact * WALL_RESTITUTION
      if (impact > 45) squash(ball, 90, Math.min(SQUASH_FLOOR, impact / SQUASH_SPEED_FLOOR))
    }

    if (ball.y < ball.radius) {
      ball.y = ball.radius
      ball.vy = Math.abs(ball.vy) * WALL_RESTITUTION
    }

    const floor = bounds.height - ball.radius
    if (ball.y >= floor) {
      ball.y = floor
      const impact = Math.abs(ball.vy)
      if (impact > REST_SPEED) {
        ball.vy = -impact * RESTITUTION
        ball.vx *= FLOOR_GRIP
        ball.bounces += 1
        squash(ball, 0, Math.min(SQUASH_FLOOR, impact / SQUASH_SPEED_FLOOR))
      } else {
        ball.vy = 0
        ball.vx *= FLOOR_GRIP ** (dt * 60)
      }
    }
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) collide(balls[i], balls[j])
  }

  for (const ball of balls) {
    const settled =
      ball.bounces >= FADE_SETTLED_BOUNCES &&
      Math.hypot(ball.vx, ball.vy) < FADE_SETTLED_SPEED
    if (ball.fade > 0 || ball.bounces >= FADE_BOUNCES || settled || ball.age > MAX_LIFE_S) {
      ball.fade += dt
    }
  }

  return balls.filter((ball) => ballAlpha(ball) > 0)
}

/** Pushes two overlapping balls apart and swaps momentum along their contact line. */
function collide(a: Ball, b: Ball) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const reach = a.radius + b.radius
  const distanceSq = dx * dx + dy * dy
  if (distanceSq < 0.0001 || distanceSq >= reach * reach) return

  const distance = Math.sqrt(distanceSq)
  const nx = dx / distance
  const ny = dy / distance
  const overlap = reach - distance
  const total = a.mass + b.mass
  a.x -= nx * overlap * (b.mass / total)
  a.y -= ny * overlap * (b.mass / total)
  b.x += nx * overlap * (a.mass / total)
  b.y += ny * overlap * (a.mass / total)

  const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
  if (approach >= 0) return

  const impulse = (-(1 + RESTITUTION) * approach) / (1 / a.mass + 1 / b.mass)
  a.vx -= (impulse * nx) / a.mass
  a.vy -= (impulse * ny) / a.mass
  b.vx += (impulse * nx) / b.mass
  b.vy += (impulse * ny) / b.mass

  const speed = -approach
  if (speed > 70) {
    const angle = (Math.atan2(ny, nx) * 180) / Math.PI + 90
    const amount = Math.min(SQUASH_BALL, speed / SQUASH_SPEED_BALL)
    squash(a, angle, amount)
    squash(b, angle, amount)
  }
}
