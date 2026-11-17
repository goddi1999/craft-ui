import { ballAlpha, type Ball } from './pin-shatter.physics'

/** Clears the canvas and draws each ball as a flat, matte disc in the pin's own colour. */
export function paintBalls(
  ctx: CanvasRenderingContext2D,
  balls: readonly Ball[],
  fill: string,
  ratio: number,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = fill

  for (const ball of balls) {
    const thin = 1 - (ball.stretch - 1) * 0.85
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.translate(ball.x, ball.y)
    ctx.rotate((ball.squashAngle * Math.PI) / 180)
    ctx.scale(ball.stretch, thin)
    ctx.globalAlpha = ballAlpha(ball)
    ctx.beginPath()
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
