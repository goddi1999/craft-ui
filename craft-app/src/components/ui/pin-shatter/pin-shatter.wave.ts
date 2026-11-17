import { MAX_WAVES, WAVE_AMPLITUDE_PX } from './pin-shatter.constants'

export type Wave = {
  /** Centre in CSS px inside the canvas. */
  x: number
  y: number
  start: number
  duration: number
  maxRadius: number
  /** 0..1. */
  strength: number
}

export type WaveRenderer = {
  canvas: HTMLCanvasElement
  /** Draws the image with every wave's ring pushing its pixels outward. */
  draw: (waves: readonly Wave[], now: number, ratio: number) => void
  dispose: () => void
}

const VERTEX = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAGMENT = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform int u_count;
uniform vec4 u_waves[${MAX_WAVES}];
uniform vec2 u_meta[${MAX_WAVES}];

void main() {
  vec2 pixel = v_uv * u_res;
  vec2 shift = vec2(0.0);
  float crest = 0.0;

  for (int i = 0; i < ${MAX_WAVES}; i++) {
    if (i >= u_count) break;
    vec2 delta = pixel - u_waves[i].xy;
    float dist = length(delta);
    float band = max(u_meta[i].x, 1.0);
    float norm = (dist - u_waves[i].z) / band;
    float envelope = exp(-norm * norm * 2.4) * u_meta[i].y;
    vec2 dir = dist > 0.001 ? delta / dist : vec2(0.0);
    shift -= dir * sin(norm * 4.2) * envelope * u_waves[i].w;
    crest += max(0.0, cos(norm * 2.6)) * envelope * 0.14;
  }

  vec4 colour = texture2D(u_tex, clamp((pixel + shift) / u_res, 0.001, 0.999));
  colour.rgb += vec3(crest);
  gl_FragColor = colour;
}`

/** Fast start, long tail: the ring races out and slows. */
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-9.5 * t))

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

/**
 * Uploads `image` to a texture on `canvas`. Returns null when WebGL is missing
 * or the image is cross-origin without CORS headers (the texture upload throws),
 * so the caller can skip the warp and keep the rings.
 */
export function createWaveRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
): WaveRenderer | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl) return null

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  } catch {
    return null
  }

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const resolution = uniform('u_res')
  const count = uniform('u_count')
  const waveData = uniform('u_waves')
  const metaData = uniform('u_meta')
  const waves = new Float32Array(MAX_WAVES * 4)
  const meta = new Float32Array(MAX_WAVES * 2)

  return {
    canvas,
    draw(active, now, ratio) {
      const width = Math.round(canvas.clientWidth * ratio)
      const height = Math.round(canvas.clientHeight * ratio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
      gl.useProgram(program)
      gl.uniform2f(resolution, width, height)
      gl.uniform1i(count, active.length)

      active.forEach((wave, i) => {
        const t = Math.min(1, (now - wave.start) / wave.duration)
        waves.set(
          [
            wave.x * ratio,
            wave.y * ratio,
            (8 + easeOutExpo(t) * wave.maxRadius) * ratio,
            WAVE_AMPLITUDE_PX * wave.strength * ratio,
          ],
          i * 4,
        )
        meta.set(
          [Math.max(14, wave.maxRadius * 0.22) * ratio, (1 - t) ** 1.35],
          i * 2,
        )
      })
      gl.uniform4fv(waveData, waves)
      gl.uniform2fv(metaData, meta)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    },
    dispose() {
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    },
  }
}
