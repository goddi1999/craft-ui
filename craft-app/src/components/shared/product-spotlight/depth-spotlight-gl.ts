import {
  FRAGMENT_SHADER,
  UNIFORM_NAMES,
  VERTEX_SHADER,
  type UniformName,
} from './depth-spotlight-shaders'
import type { SpotlightParams } from './product-spotlight.types'

/*
 * One WebGL context is shared by every instance on the page: each render draws
 * into a single offscreen canvas and is then blitted onto the instance's own
 * 2D canvas. Dozens of cards therefore cost one context, not one each.
 */

type SharedGL = {
  gl: WebGLRenderingContext
  canvas: HTMLCanvasElement
  uniforms: Partial<Record<UniformName, WebGLUniformLocation | null>>
}

let shared: SharedGL | null = null
let sharedFailed = false

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

function initSharedGL(): SharedGL | null {
  if (shared || sharedFailed) return shared
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl', {
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  })
  if (!gl) {
    sharedFailed = true
    return null
  }

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!vs || !fs || !program) {
    sharedFailed = true
    return null
  }
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Program link error:', gl.getProgramInfoLog(program))
    sharedFailed = true
    return null
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0]),
    gl.STATIC_DRAW,
  )

  const aPos = gl.getAttribLocation(program, 'aPos')
  const aTex = gl.getAttribLocation(program, 'aTex')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
  gl.enableVertexAttribArray(aTex)
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8)

  const uniforms: SharedGL['uniforms'] = {}
  for (const name of UNIFORM_NAMES) {
    uniforms[name] = gl.getUniformLocation(program, name)
  }
  gl.uniform1i(uniforms.uImage ?? null, 0)
  gl.uniform1i(uniforms.uDepth ?? null, 1)

  shared = { gl, canvas, uniforms }
  return shared
}

/* ── Image + texture caches, keyed by URL so slides can share ── */

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url)
  if (cached) return cached
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
  imageCache.set(url, promise)
  return promise
}

type TexturePair = {
  image: WebGLTexture | null
  depth: WebGLTexture | null
  width: number
  height: number
}

const textureCache = new Map<string, TexturePair>()

function makeTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  return texture
}

function getTextures(
  gl: WebGLRenderingContext,
  imageEl: HTMLImageElement,
  depthEl: HTMLImageElement,
  key: string,
): TexturePair {
  const cached = textureCache.get(key)
  if (cached) return cached
  const pair: TexturePair = {
    image: makeTexture(gl, imageEl),
    depth: makeTexture(gl, depthEl),
    width: imageEl.naturalWidth,
    height: imageEl.naturalHeight,
  }
  textureCache.set(key, pair)
  return pair
}

/** Maps the image onto the canvas the way `object-fit: cover` would. */
function computeCoverUv(
  imageW: number,
  imageH: number,
  canvasW: number,
  canvasH: number,
) {
  const imageAspect = imageW / imageH
  const canvasAspect = canvasW / canvasH
  let scaleX = 1
  let scaleY = 1
  let offsetX = 0
  let offsetY = 0
  if (imageAspect > canvasAspect) {
    scaleX = canvasAspect / imageAspect
    offsetX = (1 - scaleX) / 2
  } else {
    scaleY = imageAspect / canvasAspect
    offsetY = (1 - scaleY) / 2
  }
  return { scaleX, scaleY, offsetX, offsetY }
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

/** Turns "milliseconds to reach ~95%" into a per-frame lerp factor at 60fps. */
function msToLerp(ms: number) {
  if (ms <= 0) return 1
  const frames = (ms / 1000) * 60
  return 1 - Math.exp(-3 / frames)
}

/* ── Render manager: one rAF for the whole page, idle when settled ── */

const renderManager = {
  active: new Set<SpotlightInstance>(),
  running: false,
  add(instance: SpotlightInstance) {
    this.active.add(instance)
    this.start()
  },
  remove(instance: SpotlightInstance) {
    this.active.delete(instance)
    if (this.active.size === 0) this.running = false
  },
  start() {
    if (this.running) return
    this.running = true
    requestAnimationFrame(renderManager.loop)
  },
  loop() {
    for (const instance of renderManager.active) {
      if (instance.renderFrame()) renderManager.active.delete(instance)
    }
    if (renderManager.active.size === 0) {
      renderManager.running = false
    } else {
      requestAnimationFrame(renderManager.loop)
    }
  },
}

export type SpotlightInstanceOptions = {
  src: string
  depth: string
  params: SpotlightParams
}

export class SpotlightInstance {
  private canvas: HTMLCanvasElement
  private ctx2d: CanvasRenderingContext2D | null = null
  private textures: TexturePair | null = null
  private cover = { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 }
  private width = 0
  private height = 0
  private smoothed = { x: 0.5, y: 0.5 }
  private hoverMix = 0
  private pointer = { x: 0.5, y: 0.5 }
  private activeState = false
  private ready = false
  private destroyed = false

  params: SpotlightParams

  constructor(canvas: HTMLCanvasElement, params: SpotlightParams) {
    this.canvas = canvas
    this.params = params
  }

  /** Paints the plain product image so something is visible before GL is up. */
  async drawPlaceholder(src: string) {
    let image: HTMLImageElement
    try {
      image = await loadImage(src)
    } catch {
      return
    }
    if (this.destroyed || this.ready) return
    this.measure()
    const ctx = this.canvas.getContext('2d')
    if (!ctx || this.width === 0 || this.height === 0) return
    const imageAspect = image.naturalWidth / image.naturalHeight
    const canvasAspect = this.width / this.height
    let sw: number
    let sh: number
    let sx: number
    let sy: number
    if (imageAspect > canvasAspect) {
      sh = image.naturalHeight
      sw = sh * canvasAspect
      sx = (image.naturalWidth - sw) / 2
      sy = 0
    } else {
      sw = image.naturalWidth
      sh = sw / canvasAspect
      sx = 0
      sy = (image.naturalHeight - sh) / 2
    }
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, this.width, this.height)
  }

  private measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const width = Math.round(rect.width * dpr)
    const height = Math.round(rect.height * dpr)
    if (width === 0 || height === 0) return false
    if (width !== this.width || height !== this.height) {
      this.width = width
      this.height = height
      this.canvas.width = width
      this.canvas.height = height
      return true
    }
    return false
  }

  async setup({ src, depth }: { src: string; depth: string }) {
    if (this.ready || this.destroyed) return
    let imageEl: HTMLImageElement
    let depthEl: HTMLImageElement
    try {
      ;[imageEl, depthEl] = await Promise.all([loadImage(src), loadImage(depth)])
    } catch {
      return
    }
    if (this.destroyed) return

    const gl = initSharedGL()
    if (!gl) return

    this.measure()
    if (this.width === 0 || this.height === 0) return

    this.ctx2d = this.canvas.getContext('2d')
    if (!this.ctx2d) return

    try {
      this.textures = getTextures(gl.gl, imageEl, depthEl, `${src}|${depth}`)
    } catch {
      // A tainted canvas (missing CORS headers) leaves the placeholder up.
      return
    }
    this.cover = computeCoverUv(
      this.textures.width,
      this.textures.height,
      this.width,
      this.height,
    )
    this.ready = true
    renderManager.add(this)
  }

  setPointer(x: number, y: number) {
    this.pointer.x = x
    this.pointer.y = y
  }

  setActive(active: boolean) {
    this.activeState = active
  }

  wake() {
    if (this.ready && !this.destroyed) renderManager.add(this)
  }

  sleep() {
    renderManager.remove(this)
  }

  resize() {
    if (!this.ready) return
    if (this.measure() && this.textures) {
      this.cover = computeCoverUv(
        this.textures.width,
        this.textures.height,
        this.width,
        this.height,
      )
    }
    this.wake()
  }

  destroy() {
    this.destroyed = true
    renderManager.remove(this)
  }

  /** @returns true once the instance has settled and can stop being ticked. */
  renderFrame(): boolean {
    if (!this.ready || !this.ctx2d || this.destroyed) return true
    const gl = shared
    if (!gl || !this.textures) return true

    const p = this.params
    const active = this.activeState
    const lerp = msToLerp(active ? p.trackingSpeed : p.returnSpeed)
    const targetX = active ? this.pointer.x : 0.5
    const targetY = active ? this.pointer.y : 0.5
    this.smoothed.x += (targetX - this.smoothed.x) * lerp
    this.smoothed.y += (targetY - this.smoothed.y) * lerp
    this.hoverMix +=
      ((active ? 1 : 0) - this.hoverMix) * msToLerp(active ? p.fadeIn : p.fadeOut)

    const EPS = 1e-4
    const settled =
      !active &&
      Math.abs(this.smoothed.x - targetX) < EPS &&
      Math.abs(this.smoothed.y - targetY) < EPS &&
      this.hoverMix < EPS

    if (settled) {
      this.smoothed.x = targetX
      this.smoothed.y = targetY
      this.hoverMix = 0
    }

    const { gl: ctx, uniforms: u, canvas: glCanvas } = gl
    if (glCanvas.width !== this.width || glCanvas.height !== this.height) {
      glCanvas.width = this.width
      glCanvas.height = this.height
      ctx.viewport(0, 0, this.width, this.height)
    }

    ctx.uniform2f(u.uMouse ?? null, this.smoothed.x, this.smoothed.y)
    ctx.uniform2f(u.uRes ?? null, this.width, this.height)
    ctx.uniform1f(u.uLightH ?? null, p.lightHeight)
    ctx.uniform1f(u.uStrength ?? null, p.shadowStrength)
    ctx.uniform1f(u.uSoft ?? null, p.shadowSoftness)
    ctx.uniform1f(u.uMinBri ?? null, p.minBrightness)
    ctx.uniform1f(u.uNorm ?? null, p.normalStrength)
    ctx.uniform1f(u.uPara ?? null, p.parallax)
    ctx.uniform1f(u.uAO ?? null, p.aoStrength)
    ctx.uniform1f(u.uHover ?? null, this.hoverMix)
    ctx.uniform1f(u.uSpotR ?? null, p.spotRadius)
    ctx.uniform1f(u.uSpotFloor ?? null, p.spotFloor)
    ctx.uniform1f(u.uShadLen ?? null, p.shadowLength)
    ctx.uniform1f(u.uBoost ?? null, p.lightBoost)
    ctx.uniform1f(u.uHighlight ?? null, p.highlight)
    ctx.uniform1f(u.uSpotFalloff ?? null, p.spotFalloff)
    const [r, g, b] = hexToRgb(p.spotColor)
    ctx.uniform3f(u.uSpotColor ?? null, r, g, b)
    ctx.uniform2f(u.uUvScale ?? null, this.cover.scaleX, this.cover.scaleY)
    ctx.uniform2f(u.uUvOffset ?? null, this.cover.offsetX, this.cover.offsetY)

    ctx.activeTexture(ctx.TEXTURE0)
    ctx.bindTexture(ctx.TEXTURE_2D, this.textures.image)
    ctx.activeTexture(ctx.TEXTURE1)
    ctx.bindTexture(ctx.TEXTURE_2D, this.textures.depth)

    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4)
    this.ctx2d.drawImage(glCanvas, 0, 0)

    return settled
  }
}

export { msToLerp }
