import {
  ARC,
  DROP,
  ENTER_STAGGER,
  FADE_RATE,
  FALL_DRIFT,
  FALL_FADE,
  FLASH_FOR,
  GRAVITY,
  LAND_SQUASH,
  LIFT_SPRING,
  MAX_ARC,
  MAX_ENTER_SPREAD,
  MAX_FRAME,
  ROLL,
  ROLL_OUT,
  ROLL_SPRING,
  SQUASH_SPRING,
  STEP,
  SWAP_EVERY,
  TILT_MIN,
  TILT_SPREAD,
  TILT_SPRING,
  TRAVEL_SPRING,
  WIDTH_SPRING,
} from './dynamic-text.constants'
import { clamp01, isBlank, isDigit, poolFor, randomFrom, splitGraphemes } from './dynamic-text.utils'

type Phase = 'rest' | 'travel' | 'drop' | 'fall' | 'roll' | 'fade'

type Glyph = {
  id: number
  char: string
  digit: boolean
  /** Digit position counted from the right, so prices roll like counters. */
  slot: number
  el: HTMLSpanElement | null
  phase: Phase
  leaving: boolean
  delay: number
  x: number
  vx: number
  tx: number
  x0: number
  arc: number
  y: number
  vy: number
  ty: number
  r: number
  vr: number
  tr: number
  sq: number
  vsq: number
  o: number
}

export type Token = { char: string; x: number; digit: boolean; slot: number }

export type GlyphView = { id: number; char: string }

export type MorphSnapshot = { live: boolean; views: GlyphView[] }

// before mount (and on the server) the text is laid out in flow
export const IDLE: MorphSnapshot = { live: false, views: [] }

function paint(g: Glyph) {
  if (!g.el) return
  const sy = 1 + g.sq
  const sx = 1 - g.sq * 0.6
  g.el.style.transform = `translate3d(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px, 0) rotate(${g.r.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
  g.el.style.opacity = g.o.toFixed(3)
}

function stepSquash(g: Glyph, h: number) {
  if (g.sq === 0 && g.vsq === 0) return
  g.vsq += (-SQUASH_SPRING.stiffness * g.sq - SQUASH_SPRING.damping * g.vsq) * h
  g.sq += g.vsq * h
  if (Math.abs(g.sq) < 0.001 && Math.abs(g.vsq) < 0.01) {
    g.sq = 0
    g.vsq = 0
  }
}

function stepTravel(g: Glyph, h: number) {
  // lift along a shallow arc that peaks halfway, so crossing letters pass
  // over and under each other instead of through
  const span = Math.abs(g.tx - g.x0)
  const p = span < 0.5 ? 1 : clamp01(1 - Math.abs(g.tx - g.x) / span)
  g.ty = g.arc * 4 * p * (1 - p)
  g.vx += (-TRAVEL_SPRING.stiffness * (g.x - g.tx) - TRAVEL_SPRING.damping * g.vx) * h
  g.x += g.vx * h
  g.vy += (-LIFT_SPRING.stiffness * (g.y - g.ty) - LIFT_SPRING.damping * g.vy) * h
  g.y += g.vy * h
  g.o = Math.min(1, g.o + FADE_RATE * h)
}

function stepDrop(g: Glyph, h: number, em: number) {
  g.vy += GRAVITY * em * h
  g.y += g.vy * h
  if (g.y >= 0) {
    // landing: one squash, then the spring takes it back
    g.y = 0
    g.vy = 0
    g.sq = LAND_SQUASH
    g.phase = 'rest'
  }
  g.o = clamp01(1 + g.y / (DROP * em))
}

function stepFall(g: Glyph, h: number, em: number) {
  g.vy += GRAVITY * em * h
  g.y += g.vy * h
  g.x += g.vx * h
  g.vr += (-TILT_SPRING.stiffness * (g.r - g.tr) - TILT_SPRING.damping * g.vr) * h
  g.r += g.vr * h
  g.o = Math.min(g.o, clamp01(1 - g.y / (FALL_FADE * em)))
}

function stepRoll(g: Glyph, h: number, em: number) {
  g.vy += (-ROLL_SPRING.stiffness * (g.y - g.ty) - ROLL_SPRING.damping * g.vy) * h
  g.y += g.vy * h
  g.o = clamp01(1 - Math.abs(g.y) / (ROLL * em))
}

function stepFade(g: Glyph, h: number) {
  g.o = clamp01(g.o + (g.leaving ? -FADE_RATE : FADE_RATE) * h)
}

function stepGlyph(g: Glyph, h: number, em: number) {
  if (g.phase === 'travel') stepTravel(g, h)
  else if (g.phase === 'drop') stepDrop(g, h, em)
  else if (g.phase === 'fall') stepFall(g, h, em)
  else if (g.phase === 'roll') stepRoll(g, h, em)
  else if (g.phase === 'fade') stepFade(g, h)
  stepSquash(g, h)
}

const isGone = (g: Glyph) => g.leaving && g.o <= 0.002

/** Moves a glyph into rest once it has arrived. True while it is still moving. */
function settle(g: Glyph): boolean {
  if (g.leaving) return !isGone(g)
  const arrived =
    Math.abs(g.x - g.tx) < 0.05 &&
    Math.abs(g.vx) < 0.5 &&
    Math.abs(g.y) < 0.05 &&
    Math.abs(g.vy) < 0.5
  const done =
    (g.phase === 'travel' && arrived) ||
    (g.phase === 'roll' && arrived) ||
    (g.phase === 'fade' && g.o >= 1)
  if (done) {
    g.x = g.tx
    g.y = 0
    g.vx = 0
    g.vy = 0
    g.o = 1
    g.phase = 'rest'
  }
  return g.phase !== 'rest' || g.sq !== 0
}

const digitsOf = (chars: { digit: boolean; char: string }[]) =>
  Number(
    chars
      .filter((c) => c.digit)
      .map((c) => c.char)
      .join(''),
  )

/** Direction digits roll: 1 when the number grew (old goes up, new comes up). */
const rollDirection = (previous: Glyph[], tokens: Token[]) =>
  digitsOf(tokens) < digitsOf(previous) ? -1 : 1

/** Squeezes the entering stagger so a long string does not trickle in. */
function capStagger(glyphs: Glyph[], entering: number) {
  const spread = entering * ENTER_STAGGER
  if (spread <= MAX_ENTER_SPREAD) return
  for (const g of glyphs) g.delay *= MAX_ENTER_SPREAD / spread
}

/**
 * Letters as physical objects. Steps every glyph with its own springs and
 * gravity in a rAF loop that writes transforms straight to the DOM, and only
 * tells React (as an external store) when glyphs are added or removed.
 */
export class MorphEngine {
  private glyphs: Glyph[] = []
  /** The glyphs that spell the current text, in order. */
  private order: Glyph[] = []
  private root: HTMLSpanElement | null = null
  private reduced = false
  private started = false
  private em = 16
  private w = 0
  private vw = 0
  private tw = 0
  private nextId = 0
  private raf = 0
  private last = 0
  private snapshot: MorphSnapshot = IDLE
  private readonly listeners = new Set<() => void>()
  private readonly refs = new Map<number, (el: HTMLSpanElement | null) => void>()

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => this.snapshot

  private emit() {
    this.snapshot = {
      live: this.started,
      views: this.glyphs.map((g) => ({ id: g.id, char: g.char })),
    }
    for (const listener of this.listeners) listener()
  }

  attach(root: HTMLSpanElement | null) {
    this.root = root
  }

  setReduced(reduced: boolean) {
    this.reduced = reduced
  }

  setFontSize(px: number) {
    this.em = px
  }

  /** A stable ref callback per glyph, so React never re-attaches it. */
  refFor(id: number) {
    let ref = this.refs.get(id)
    if (!ref) {
      ref = (el: HTMLSpanElement | null) => {
        const glyph = this.glyphs.find((g) => g.id === id)
        if (glyph) {
          glyph.el = el
          paint(glyph)
        }
      }
      this.refs.set(id, ref)
    }
    return ref
  }

  private create(t: Token): Glyph {
    const glyph: Glyph = {
      id: this.nextId++,
      char: t.char,
      digit: t.digit,
      slot: t.slot,
      el: null,
      phase: 'rest',
      leaving: false,
      delay: 0,
      x: t.x,
      vx: 0,
      tx: t.x,
      x0: t.x,
      arc: 0,
      y: 0,
      vy: 0,
      ty: 0,
      r: 0,
      vr: 0,
      tr: 0,
      sq: 0,
      vsq: 0,
      o: 1,
    }
    this.glyphs.push(glyph)
    return glyph
  }

  private move(g: Glyph, t: Token, instant: boolean) {
    g.slot = t.slot
    g.tx = t.x
    if (instant) {
      g.x = t.x
      g.y = 0
      g.vx = 0
      g.vy = 0
      g.phase = g.o < 1 ? 'fade' : 'rest'
      return
    }
    if (g.phase === 'rest' && Math.abs(t.x - g.x) < 0.5) {
      g.x = t.x
      return
    }
    // redirects keep the current position and velocity: no restart
    g.x0 = g.x
    g.delay = 0
    const distance = t.x - g.x
    g.arc = -Math.sign(distance) * Math.min(MAX_ARC * this.em, Math.abs(distance) * ARC)
    g.phase = 'travel'
  }

  private enter(g: Glyph, dir: number, instant: boolean, index: number) {
    g.o = 0
    if (instant) {
      g.phase = 'fade'
      return
    }
    if (g.digit) {
      g.y = dir * ROLL * this.em
      g.ty = 0
      g.phase = 'roll'
      return
    }
    g.y = -DROP * this.em
    g.phase = 'drop'
    g.delay = index * ENTER_STAGGER
  }

  private leave(g: Glyph, dir: number, instant: boolean) {
    g.leaving = true
    g.delay = 0
    if (instant) {
      g.phase = 'fade'
      return
    }
    if (g.digit) {
      g.phase = 'roll'
      g.ty = -dir * ROLL * ROLL_OUT * this.em
      return
    }
    // tip toward the side it sits on and drift that way a little
    const side = g.x + this.em * 0.3 < this.tw / 2 ? -1 : 1
    g.tr = side * (TILT_MIN + ((g.id * 7) % TILT_SPREAD))
    g.vx = side * FALL_DRIFT * this.em
    g.vy = Math.max(g.vy, 0)
    g.phase = 'fall'
  }

  /** Re-places the current text after a resize or a font load. */
  place(tokens: Token[], width: number) {
    if (tokens.length !== this.order.length) return
    tokens.forEach((t, i) => {
      const g = this.order[i]
      g.tx = t.x
      if (g.phase === 'rest') {
        g.x = t.x
        paint(g)
      }
    })
    this.tw = width
    if (!this.raf) {
      this.w = width
      this.paintWidth()
    }
  }

  update(tokens: Token[], width: number) {
    if (!this.started) {
      // first paint: put everything in place, no animation
      this.started = true
      this.order = tokens.map((t) => this.create(t))
      this.w = width
      this.tw = width
      this.paintWidth()
      this.emit()
      return
    }
    const instant = this.reduced
    const letters = new Map<string, Glyph[]>()
    const slots = new Map<number, Glyph>()
    for (const g of this.order) {
      if (g.digit) slots.set(g.slot, g)
      else letters.set(g.char, [...(letters.get(g.char) ?? []), g])
    }
    const dir = rollDirection(this.order, tokens)
    const next: Glyph[] = []
    let entering = 0
    for (const t of tokens) {
      let old: Glyph | undefined
      if (t.digit) {
        old = slots.get(t.slot)
        slots.delete(t.slot)
      } else {
        old = letters.get(t.char)?.shift()
      }
      if (old && old.char === t.char) {
        this.move(old, t, instant)
        next.push(old)
        continue
      }
      if (old) this.leave(old, dir, instant)
      const g = this.create(t)
      this.enter(g, dir, instant, entering++)
      next.push(g)
    }
    capStagger(next, entering)
    for (const list of letters.values()) {
      for (const g of list) this.leave(g, dir, instant)
    }
    for (const g of slots.values()) this.leave(g, dir, instant)
    this.order = next
    this.tw = width
    if (instant) {
      this.w = width
      this.vw = 0
      this.paintWidth()
    }
    this.emit()
  }

  private paintWidth() {
    if (this.root) this.root.style.width = `${this.w.toFixed(2)}px`
  }

  private stepWidth(dt: number) {
    if (Math.abs(this.w - this.tw) < 0.1 && Math.abs(this.vw) < 0.1) {
      if (this.w !== this.tw) {
        this.w = this.tw
        this.vw = 0
        this.paintWidth()
      }
      return false
    }
    let t = dt
    while (t > 1e-6) {
      const h = Math.min(STEP, t)
      this.vw += (-WIDTH_SPRING.stiffness * (this.w - this.tw) - WIDTH_SPRING.damping * this.vw) * h
      this.w += this.vw * h
      t -= h
    }
    this.paintWidth()
    return true
  }

  private stepAll(dt: number) {
    let moving = false
    for (const g of this.glyphs) {
      if (g.delay > 0) {
        g.delay -= dt
        moving = true
        continue
      }
      let t = dt
      while (t > 1e-6) {
        const h = Math.min(STEP, t)
        stepGlyph(g, h, this.em)
        t -= h
      }
      if (settle(g)) moving = true
      paint(g)
    }
    return moving
  }

  private readonly tick = (now: number) => {
    const dt = this.last ? Math.min(MAX_FRAME, (now - this.last) / 1000) : 1 / 60
    this.last = now
    const moving = this.stepAll(dt)
    const resizing = this.stepWidth(dt)
    if (this.glyphs.some(isGone)) {
      for (const g of this.glyphs) {
        if (isGone(g)) this.refs.delete(g.id)
      }
      this.glyphs = this.glyphs.filter((g) => !isGone(g))
      // the only time React hears from the loop: a letter has finished leaving
      this.emit()
    }
    // sleep once everything has settled
    this.raf = moving || resizing ? requestAnimationFrame(this.tick) : 0
  }

  kick() {
    if (!this.raf) {
      this.last = 0
      this.raf = requestAnimationFrame(this.tick)
    }
  }

  stop() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }
}

/** Reads where each character of `text` sits, from the hidden measure row. */
export function measureTokens(measure: HTMLElement, text: string) {
  const chars = splitGraphemes(text)
  const cells = measure.children
  const tokens: Token[] = []
  chars.forEach((char, i) => {
    const cell = cells[i] as HTMLElement | undefined
    if (!cell || isBlank(char)) return
    tokens.push({ char, x: cell.offsetLeft, digit: isDigit(char), slot: 0 })
  })
  let slot = 0
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].digit) tokens[i].slot = slot++
  }
  return { tokens, width: measure.offsetWidth }
}

export type DecodeCell = {
  el: HTMLElement
  char: string
  lockAt: number
  swapAt: number
  state: 'scramble' | 'flash' | 'done'
}

/** Writes a cell's text node directly, skipping React for every scramble frame. */
export function writeCell(cell: Element | undefined, char: string) {
  const node = cell?.firstChild
  if (node && node.nodeValue !== char) node.nodeValue = char
}

export function stepCell(cell: DecodeCell, t: number) {
  if (cell.state === 'flash') {
    if (t >= cell.lockAt + FLASH_FOR) {
      cell.el.removeAttribute('data-flash')
      cell.state = 'done'
    }
    return
  }
  if (t >= cell.lockAt) {
    writeCell(cell.el, cell.char)
    cell.el.removeAttribute('data-scramble')
    cell.el.setAttribute('data-flash', '')
    cell.state = 'flash'
    return
  }
  if (t >= cell.swapAt) {
    writeCell(cell.el, randomFrom(poolFor(cell.char)))
    cell.swapAt = t + SWAP_EVERY
  }
}
