import { SHATTER_FADE_S } from './pin-shatter.constants'
import { ballAlpha, type Ball } from './pin-shatter.physics'

/** Ease-out, so the colour turns fast and settles. */
const turned = (age: number) => 1 - (1 - Math.min(1, age / SHATTER_FADE_S)) ** 3

/**
 * Clears the canvas and draws each ball as a flat, matte disc in the pin's own
 * colour. With `tint`, a second disc of that colour is laid over the first with
 * rising opacity, so the ball fades to it without any colour maths.
 */
export function paintBalls(
  ctx: CanvasRenderingContext2D,
  balls: readonly Ball[],
  fill: string,
  ratio: number,
  tint?: string,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const ball of balls) {
    const thin = 1 - (ball.stretch - 1) * 0.85
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.translate(ball.x, ball.y)
    ctx.rotate((ball.squashAngle * Math.PI) / 180)
    ctx.scale(ball.stretch, thin)
    const alpha = ballAlpha(ball)
    ctx.beginPath()
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2)
    ctx.globalAlpha = alpha
    ctx.fillStyle = fill
    ctx.fill()
    if (tint) {
      ctx.globalAlpha = alpha * turned(ball.age)
      ctx.fillStyle = tint
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}
