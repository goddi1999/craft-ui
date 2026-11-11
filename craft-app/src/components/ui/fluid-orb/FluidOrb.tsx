import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { FRAG, VERT } from './fluid-orb.shaders'
import type { FluidOrbProps } from './fluid-orb.types'
import { compileShader, hexToRgb } from './fluid-orb.utils'

// two triangles covering clip space; the fragment shader does all the drawing
const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

/**
 * An animated WebGL orb with drifting fluid shading: white at the top, a
 * pale tint through the middle, the full colour pooling at the bottom.
 * Holds a still frame under prefers-reduced-motion.
 */
export function FluidOrb({ size = 240, color = '#1A73F2', className, style, ...props }: FluidOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // kept across rebuilds, so a new colour or size picks up the drift where it was
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true })
    if (!gl) return

    const program = gl.createProgram()
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!program || !vert || !frag) return

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')
    gl.uniform3f(gl.getUniformLocation(program, 'u_color'), ...hexToRgb(color))

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const px = Math.round(size * dpr)
    canvas.width = px
    canvas.height = px
    gl.viewport(0, 0, px, px)
    gl.uniform2f(uResolution, px, px)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    startRef.current ??= performance.now()
    const start = startRef.current
    let raf = 0

    const render = (now: number) => {
      gl.uniform1f(uTime, reduce ? 0 : (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!reduce) raf = requestAnimationFrame(render)
    }
    render(performance.now())

    return () => {
      cancelAnimationFrame(raf)
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      gl.deleteBuffer(buffer)
    }
  }, [size, color])

  return (
    <div
      data-slot="fluid-orb"
      className={cn('relative overflow-hidden rounded-full', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
    </div>
  )
}
