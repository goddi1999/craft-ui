import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

import { DECODE_FADE, LOCK_SPREAD, LOCK_STAGGER, LOCK_START } from './dynamic-text.constants'
import {
  IDLE,
  MorphEngine,
  measureTokens,
  stepCell,
  writeCell,
  type DecodeCell,
} from './dynamic-text.engine'
import { isBlank, splitGraphemes } from './dynamic-text.utils'

const serverSnapshot = () => IDLE
const fontSizeOf = (el: HTMLElement) => Number.parseFloat(getComputedStyle(el).fontSize)

export function MorphLayer({ text, reduced }: { text: string; reduced: boolean }) {
  const chars = splitGraphemes(text)
  const rootRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [engine] = useState(() => new MorphEngine())
  // server and first client render lay the text out in flow; after mount the
  // glyphs switch to absolutely positioned, physics-driven spans
  const { live, views } = useSyncExternalStore(engine.subscribe, engine.getSnapshot, serverSnapshot)

  useLayoutEffect(() => {
    engine.attach(rootRef.current)
    return () => engine.stop()
  }, [engine])

  useLayoutEffect(() => {
    engine.setReduced(reduced)
  }, [engine, reduced])

  useLayoutEffect(() => {
    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return
    engine.setFontSize(fontSizeOf(root))
    const { tokens, width } = measureTokens(measure, text)
    engine.update(tokens, width)
    engine.kick()
  }, [engine, text])

  // fonts loading or the font size changing move the letters: re-place them
  useEffect(() => {
    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return
    const observer = new ResizeObserver(() => {
      engine.setFontSize(fontSizeOf(root))
      const { tokens, width } = measureTokens(measure, text)
      engine.place(tokens, width)
    })
    observer.observe(measure)
    return () => observer.disconnect()
  }, [engine, text])

  return (
    <span ref={rootRef} className="relative inline-block align-baseline">
      <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute top-0 left-0">
        {chars.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </span>
      {live ? (
        <>
          {/* zero-width space: gives the box a line and a baseline while every glyph is absolute */}
          <span aria-hidden className="inline-block w-0">
            {'​'}
          </span>
          {views.map((view) => (
            <span
              key={view.id}
              ref={engine.refFor(view.id)}
              aria-hidden
              className="absolute top-0 left-0 origin-[50%_80%]"
            >
              {view.char}
            </span>
          ))}
        </>
      ) : (
        <span aria-hidden>
          {chars.map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </span>
      )}
    </span>
  )
}

export function DecodeLayer({
  text,
  running,
  reduced,
}: {
  text: string
  running: boolean
  reduced: boolean
}) {
  const chars = splitGraphemes(text)
  const hostRef = useRef<HTMLSpanElement>(null)
  // what the cells settled on last time, so only changed cells scramble
  const shownRef = useRef<string[] | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !running) return
    const next = splitGraphemes(text)
    const previous = shownRef.current
    shownRef.current = next
    const els = Array.from(host.children) as HTMLElement[]
    // a previous run may have left scrambled glyphs behind: reset to the text
    els.forEach((el, i) => {
      writeCell(el, next[i] ?? '')
      el.removeAttribute('data-scramble')
      el.removeAttribute('data-flash')
    })
    const changed = next
      .map((char, i) => ({ char, i }))
      .filter(({ char, i }) => !isBlank(char) && previous?.[i] !== char)
    if (changed.length === 0) return
    if (reduced) {
      host.animate([{ opacity: 0 }, { opacity: 1 }], DECODE_FADE)
      return
    }
    const stagger = Math.min(LOCK_STAGGER, LOCK_SPREAD / changed.length)
    const cells: DecodeCell[] = []
    changed.forEach(({ char, i }, rank) => {
      const el = els[i]
      if (!el) return
      el.setAttribute('data-scramble', '')
      cells.push({ el, char, lockAt: LOCK_START + rank * stagger, swapAt: 0, state: 'scramble' })
    })
    // one rAF writes every cell: no React render per tick, no layout shift
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      start ||= now
      const t = (now - start) / 1000
      for (const cell of cells) stepCell(cell, t)
      raf = cells.every((cell) => cell.state === 'done') ? 0 : requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      for (const cell of cells) {
        writeCell(cell.el, cell.char)
        cell.el.removeAttribute('data-scramble')
        cell.el.removeAttribute('data-flash')
      }
    }
  }, [text, running, reduced])

  return (
    // monospace on purpose: fixed 1ch cells keep the scramble from shifting the line
    <span ref={hostRef} aria-hidden className="font-mono">
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block w-[1ch] text-center data-flash:text-primary data-scramble:opacity-45"
        >
          {char}
        </span>
      ))}
    </span>
  )
}
