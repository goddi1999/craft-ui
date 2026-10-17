import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from 'motion/react'
import type { Transition } from 'motion/react'
import {
  Check,
  Download,
  Eraser,
  Play,
  Redo2,
  Square,
  Undo2,
  X,
} from 'lucide-react'
import styles from './signature-pad.module.css'

import {
  PAD_WIDTH,
  INK,
  WIDTHS,
  COLORS,
  SIZES,
  getStrokeOutline,
  outlineToPath,
  strokeOptions,
  strokePath,
  signatureToSvg,
  signatureToPng,
  download,
  PAD_HEIGHT,
} from './signature-pad.utils'
import type {
  InkPoint,
  InkColor,
  InkWidth,
  InkStroke,
} from './signature-pad.utils'

/** Durations, easings, and springs this component animates with. */
const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    standard: [0.22, 1, 0.36, 1],
    /** For elements that move while already on screen. */
    inOut: [0.65, 0, 0.35, 1],
  },
  spring: {
    responsive: { type: 'spring', stiffness: 520, damping: 38 },
    gentle: { type: 'spring', stiffness: 340, damping: 34 },
    /** Presses, toggles, thumbs, and small indicators. */
    snappy: { type: 'spring', visualDuration: 0.26, bounce: 0.12 },
    /** Panels, height changes, and layout shifts. Never overshoots. */
    smooth: { type: 'spring', visualDuration: 0.4, bounce: 0 },
    /** Shape morphs, shared layout highlights, and width changes. */
    morph: { type: 'spring', visualDuration: 0.42, bounce: 0.16 },
  },
  /** Stagger steps in seconds. Keep total stagger under roughly 0.4s. */
  stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 },
  /** Blur radii in px for text and content crossfades. */
  blur: { subtle: 2, soft: 4, text: 8 },
} as const

/**
 * A signature field with real ink. Width follows pen pressure, or speed for a mouse or finger, and the ends taper like a nib
 * lifting off. It keeps undo and redo, clears with a wipe across the pad, replays the signature in its original rhythm,
 * and exports a cropped PNG or SVG. A "Sign here" hint rests on the baseline until the first stroke.
 * Keyboard: Mod+Z undoes, Shift+Mod+Z or Mod+Y redoes, and Delete clears.
 */
export type SignaturePadProps = {
  /** Printed under the baseline, such as the signer's name. */
  signer?: string
  /** Resting hint on the baseline before the first stroke. */
  hint?: string
  defaultColor?: InkColor
  defaultWidth?: InkWidth
  /** Receives the strokes after every change. */
  onChange?: (strokes: InkStroke[]) => void
  /** File name for exports, without extension. */
  fileName?: string
  /** Accessible name of the drawing surface. */
  label?: string
  className?: string
}

/** `fresh` is the stroke just drawn: it is already on screen from the live path, so it appears without a fade. */
type History = {
  past: InkStroke[][]
  present: InkStroke[]
  future: InkStroke[][]
  fresh: string | null
}
type Saved = null | 'png' | 'svg' | 'failed'

const { spring, duration, ease, blur } = motionTokens
const subscribe = () => () => {}
function useReducedFlag() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  return !!useReducedMotion() && hydrated
}

export function SignaturePad({
  signer,
  hint = 'Sign here',
  defaultColor = 'black',
  defaultWidth = 'medium',
  onChange,
  fileName = 'signature',
  label = 'Signature pad',
  className,
}: SignaturePadProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const reduced = useReducedFlag()
  const [history, setHistory] = useState<History>({
    past: [],
    present: [],
    future: [],
    fresh: null,
  })
  const [color, setColor] = useState<InkColor>(defaultColor)
  const [width, setWidth] = useState<InkWidth>(defaultWidth)
  const [drawing, setDrawing] = useState(false)
  const [wiping, setWiping] = useState(false)
  const [replay, setReplay] = useState<{
    at: number
    offsets: number[]
  } | null>(null)
  const [saved, setSaved] = useState<Saved>(null)
  const [status, setStatus] = useState('')

  const padRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<SVGPathElement>(null)
  const live = useRef<{ id: number; stroke: InkStroke; stamp: number } | null>(
    null,
  )
  const replayFrame = useRef(0)
  const savedTimer = useRef(0)
  const wipeAnimation = useRef<{
    stop: () => void
    complete: () => void
  } | null>(null)
  const counter = useRef(0)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const strokes = history.present
  const empty = strokes.length === 0
  const replaying = replay !== null

  useEffect(() => {
    onChangeRef.current?.(strokes)
  }, [strokes])
  useEffect(
    () => () => {
      cancelAnimationFrame(replayFrame.current)
      window.clearTimeout(savedTimer.current)
    },
    [],
  )

  const commit = useCallback(
    (next: InkStroke[], fresh: string | null = null) => {
      setHistory((current) => ({
        past: [...current.past, current.present].slice(-60),
        present: next,
        future: [],
        fresh,
      }))
    },
    [],
  )

  const stopReplay = useCallback(() => {
    cancelAnimationFrame(replayFrame.current)
    setReplay(null)
  }, [])
  /** A wipe in flight completes at once, so whatever comes next starts from a clear pad. */
  const settleWipe = useCallback(() => {
    wipeAnimation.current?.complete()
  }, [])

  function toPad(event: { clientX: number; clientY: number }) {
    const box = padRef.current!.getBoundingClientRect()
    return {
      x: ((event.clientX - box.left) / box.width) * PAD_WIDTH,
      y: ((event.clientY - box.top) / box.height) * PAD_HEIGHT,
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (live.current || (event.pointerType === 'mouse' && event.button !== 0))
      return
    event.preventDefault()
    settleWipe()
    if (replaying) stopReplay()
    padRef.current?.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    const { x, y } = toPad(event)
    const now = event.nativeEvent.timeStamp
    counter.current += 1
    const pen = event.pointerType === 'pen' && event.pressure > 0
    live.current = {
      id: event.pointerId,
      stamp: event.nativeEvent.timeStamp,
      stroke: {
        id: `${uid}-${counter.current}`,
        color,
        width,
        at: now,
        points: [{ x, y, p: pen ? event.pressure : -1, t: 0 }],
      },
    }
    setDrawing(true)
    paintLive()
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = live.current
    if (!current || current.id !== event.pointerId) return
    const samples =
      typeof event.nativeEvent.getCoalescedEvents === 'function'
        ? event.nativeEvent.getCoalescedEvents()
        : []
    const list = samples.length ? samples : [event.nativeEvent]
    for (const sample of list) {
      const { x, y } = toPad(sample)
      const pen = sample.pointerType === 'pen' && sample.pressure > 0
      current.stroke.points.push({
        x,
        y,
        p: pen ? sample.pressure : -1,
        t: Math.max(
          current.stroke.points[current.stroke.points.length - 1]!.t,
          sample.timeStamp - current.stamp,
        ),
      })
    }
    paintLive()
  }
  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const current = live.current
    if (!current || current.id !== event.pointerId) return
    live.current = null
    commit([...strokes, current.stroke], current.stroke.id)
    liveRef.current?.setAttribute('d', '')
    setDrawing(false)
    setStatus(`Stroke added. ${strokes.length + 1} in the signature.`)
  }
  function paintLive() {
    const current = live.current
    if (!current || !liveRef.current) return
    liveRef.current.setAttribute(
      'd',
      outlineToPath(
        getStrokeOutline(
          current.stroke.points,
          strokeOptions(current.stroke, false),
        ),
      ),
    )
  }

  function undo() {
    if (!history.past.length || live.current) return
    settleWipe()
    stopReplay()
    setHistory((current) =>
      current.past.length
        ? {
            past: current.past.slice(0, -1),
            present: current.past[current.past.length - 1]!,
            future: [current.present, ...current.future],
            fresh: null,
          }
        : current,
    )
    setStatus('Undone')
  }
  function redo() {
    if (!history.future.length || live.current) return
    settleWipe()
    stopReplay()
    setHistory((current) =>
      current.future.length
        ? {
            past: [...current.past, current.present],
            present: current.future[0]!,
            future: current.future.slice(1),
            fresh: null,
          }
        : current,
    )
    setStatus('Redone')
  }

  function clear() {
    if (empty || wiping || live.current) return
    stopReplay()
    const node = inkRef.current
    const finish = () => {
      wipeAnimation.current = null
      commit([])
      setWiping(false)
      setStatus('Signature cleared. Undo brings it back.')
      // Lift the clip only once the wiped strokes have left, so they never flash back for a frame.
      if (node)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            node.style.clipPath = ''
          }),
        )
    }
    if (!node || reduced) {
      finish()
      return
    }
    setWiping(true)
    // The ink is cut away behind a squeegee edge that sweeps across the pad; the edge itself is drawn by the sweep element.
    const controls = animate(
      node,
      { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 100%)'] },
      { duration: 0.56, ease: [...ease.inOut] },
    )
    wipeAnimation.current = {
      stop: () => controls.stop(),
      complete: () => {
        controls.complete()
      },
    }
    controls.then(finish)
  }

  function toggleReplay() {
    if (replaying) {
      stopReplay()
      setStatus('Replay stopped')
      return
    }
    if (empty || live.current) return
    settleWipe()
    // Build a timeline: each stroke keeps its own rhythm, and pauses between strokes are capped so the replay never stalls.
    const offsets: number[] = []
    let cursor = 0
    strokes.forEach((stroke, index) => {
      if (index > 0) {
        const previous = strokes[index - 1]!
        const gap =
          stroke.at -
          (previous.at + previous.points[previous.points.length - 1]!.t)
        cursor += Math.min(260, Math.max(90, gap))
      }
      offsets.push(cursor)
      cursor += stroke.points[stroke.points.length - 1]!.t
    })
    const speed = Math.max(1, cursor / 3200)
    const total = cursor + 120
    const begin = performance.now()
    const tick = (now: number) => {
      const at = (now - begin) * speed
      if (at >= total) {
        setReplay(null)
        setStatus('Replay finished')
        return
      }
      setReplay({ at, offsets })
      replayFrame.current = requestAnimationFrame(tick)
    }
    setReplay({ at: 0, offsets })
    setStatus('Replaying signature')
    replayFrame.current = requestAnimationFrame(tick)
  }
  async function save(kind: 'png' | 'svg') {
    if (empty) return
    window.clearTimeout(savedTimer.current)
    try {
      const blob =
        kind === 'svg'
          ? new Blob([signatureToSvg(strokes)], { type: 'image/svg+xml' })
          : await signatureToPng(strokes)
      download(blob, `${fileName}.${kind}`)
      setSaved(kind)
      setStatus(`Saved ${fileName}.${kind}`)
    } catch {
      setSaved('failed')
      setStatus('Export failed. Try again.')
    }
    savedTimer.current = window.setTimeout(() => setSaved(null), 1800)
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const mod = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()
    if (mod && key === 'z') {
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    } else if (mod && key === 'y') {
      event.preventDefault()
      redo()
    } else if (
      !mod &&
      (event.key === 'Delete' || event.key === 'Backspace') &&
      event.currentTarget === event.target
    ) {
      event.preventDefault()
      clear()
    } else if (event.key === 'Escape' && replaying) {
      stopReplay()
    }
  }

  // During replay each stroke shows only the part drawn so far, and the nib rides its newest point.
  let nib: InkPoint | null = null,
    nibColor: InkColor = color
  const visible: { stroke: InkStroke; d: string | null }[] = []
  for (let index = 0; index < strokes.length; index++) {
    const stroke = strokes[index]!
    if (replay === null) {
      visible.push({ stroke, d: null })
      continue
    }
    const local = replay.at - (replay.offsets[index] ?? 0)
    const lastT = stroke.points[stroke.points.length - 1]!.t
    if (local < 0) {
      visible.push({ stroke, d: '' })
      continue
    }
    if (local >= lastT) {
      visible.push({ stroke, d: null })
      continue
    }
    nib =
      [...stroke.points].reverse().find((point) => point.t <= local) ?? stroke.points[0]!
    nibColor = stroke.color
    visible.push({ stroke, d: strokePath(stroke, local) })
  }
  const showHint = empty && !drawing && !wiping
  const hintHidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 6, scale: 0.97, filter: `blur(${blur.soft}px)` }
  const t: Transition = reduced ? { duration: duration.instant } : spring.snappy

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-ink={color}
    >
      <div
        ref={padRef}
        className={styles.pad}
        tabIndex={0}
        role="img"
        aria-roledescription="signature pad"
        aria-label={`${label}. ${empty ? 'Empty.' : `${strokes.length} ${strokes.length === 1 ? 'stroke' : 'strokes'}.`} Draw with a pointer, pen, or finger.`}
        aria-describedby={`${uid}-keys`}
        data-drawing={drawing ? '' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className={styles.guide} aria-hidden="true">
          <X className={styles.mark} size={14} strokeWidth={1.75} />
          <span className={styles.baseline} />
          {signer && <span className={styles.signer}>{signer}</span>}
          <AnimatePresence initial={false}>
            {showHint && (
              <motion.span
                key="hint"
                className={styles.hint}
                initial={hintHidden}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{
                  ...hintHidden,
                  transition: {
                    duration: duration.fast,
                    ease: [...ease.standard],
                  },
                }}
                transition={
                  reduced
                    ? { duration: duration.instant }
                    : { duration: duration.standard, ease: [...ease.enter] }
                }
              >
                {hint}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div ref={inkRef} className={styles.ink}>
          <svg
            viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <AnimatePresence initial={false}>
              {visible.map(({ stroke, d }) => (
                <motion.path
                  key={stroke.id}
                  className={styles.stroke}
                  data-color={stroke.color}
                  d={d ?? strokePath(stroke)}
                  initial={history.fresh === stroke.id ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: wiping ? 0 : duration.standard,
                      ease: [...ease.standard],
                    },
                  }}
                  transition={{
                    duration: duration.standard,
                    ease: [...ease.standard],
                  }}
                />
              ))}
            </AnimatePresence>
            <path ref={liveRef} className={styles.stroke} data-color={color} />
            {nib && (
              <circle
                className={styles.nib}
                data-color={nibColor}
                cx={nib.x}
                cy={nib.y}
                r={WIDTHS[width].size * 0.9}
              />
            )}
          </svg>
        </div>
        {wiping && (
          <motion.span
            className={styles.sweep}
            aria-hidden="true"
            initial={{ x: '0%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.56,
              ease: [...ease.inOut],
              opacity: { duration: 0.56, times: [0, 0.12, 0.85, 1] },
            }}
          />
        )}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.group}>
          <Choice
            label="Ink color"
            options={COLORS}
            value={color}
            onChange={(next) => {
              setColor(next)
              setStatus(`${INK[next].label} selected`)
            }}
            layoutId={`${uid}-color`}
            reduced={reduced}
            render={(option) => (
              <span className={styles.swatch} data-color={option} />
            )}
            name={(option) => INK[option].label}
          />
          <span className={styles.divider} aria-hidden="true" />
          <Choice
            label="Stroke width"
            options={SIZES}
            value={width}
            onChange={(next) => {
              setWidth(next)
              setStatus(`${WIDTHS[next].label} nib selected`)
            }}
            layoutId={`${uid}-width`}
            reduced={reduced}
            render={(option) => (
              <span
                className={styles.weight}
                style={{
                  width: WIDTHS[option].size + 2,
                  height: WIDTHS[option].size + 2,
                }}
              />
            )}
            name={(option) => WIDTHS[option].label}
          />
        </div>
        <div className={styles.group}>
          <IconButton
            label="Undo"
            onClick={undo}
            disabled={!history.past.length || wiping}
          >
            <Undo2 size={18} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Redo"
            onClick={redo}
            disabled={!history.future.length || wiping}
          >
            <Redo2 size={18} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
          <IconButton
            label={replaying ? 'Stop replay' : 'Replay signature'}
            onClick={toggleReplay}
            disabled={empty || wiping}
            pressed={replaying}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={replaying ? 'stop' : 'play'}
                className={styles.swap}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={t}
              >
                {replaying ? (
                  <Square size={15} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Play size={17} strokeWidth={1.75} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </IconButton>
          <IconButton
            label="Clear signature"
            onClick={clear}
            disabled={empty || wiping}
          >
            <Eraser size={18} strokeWidth={1.75} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className={styles.exports}>
        <span className={styles.exportLabel}>Save as</span>
        {(['png', 'svg'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            className={styles.export}
            onClick={() => save(kind)}
            disabled={empty}
            aria-label={`Download ${kind.toUpperCase()}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={
                  saved === kind
                    ? 'done'
                    : saved === 'failed'
                      ? 'failed'
                      : 'idle'
                }
                className={styles.exportContent}
                initial={{
                  opacity: 0,
                  y: reduced ? 0 : 4,
                  filter: reduced ? 'blur(0px)' : `blur(${blur.subtle}px)`,
                }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  y: reduced ? 0 : -4,
                  transition: { duration: duration.instant },
                }}
                transition={
                  reduced
                    ? { duration: duration.instant }
                    : { duration: duration.fast, ease: [...ease.enter] }
                }
              >
                {saved === kind ? (
                  <>
                    <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                    Saved
                  </>
                ) : (
                  <>
                    <Download size={15} strokeWidth={1.75} aria-hidden="true" />
                    {kind.toUpperCase()}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        ))}
      </div>
      <p id={`${uid}-keys`} className={styles.srOnly}>
        Press Control or Command Z to undo, add Shift to redo, and Delete to
        clear.
      </p>
      <p className={styles.srOnly} role="status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  pressed?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
    >
      {children}
    </button>
  )
}

/** A compact radio group with a highlight that glides to the chosen option. Arrow keys move the choice. */
function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
  render,
  name,
  layoutId,
  reduced,
}: {
  label: string
  options: T[]
  value: T
  onChange: (value: T) => void
  render: (option: T) => ReactNode
  name: (option: T) => string
  layoutId: string
  reduced: boolean
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (!step) return
    event.preventDefault()
    const index =
      (options.indexOf(value) + step + options.length) % options.length
    onChange(options[index]!)
    refs.current[index]?.focus()
  }
  return (
    <div
      className={styles.choice}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {options.map((option, index) => (
        <button
          key={option}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="button"
          role="radio"
          aria-checked={option === value}
          aria-label={name(option)}
          title={name(option)}
          tabIndex={option === value ? 0 : -1}
          className={styles.option}
          onClick={() => onChange(option)}
        >
          {option === value && (
            <motion.span
              layoutId={layoutId}
              className={styles.selected}
              transition={reduced ? { duration: 0 } : spring.morph}
            />
          )}
          {render(option)}
        </button>
      ))}
    </div>
  )
}
