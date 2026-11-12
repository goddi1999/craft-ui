import { Check, Pipette } from 'lucide-react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  CHECKER,
  DEFAULT_COLOR,
  EASE_STANDARD,
  FALLBACK_HSVA,
  FORMAT_NAMES,
  FORMATS,
  HUE_TRACK,
  ICON_BUTTON,
  INVALID_MESSAGE,
  SHAKE,
  SHAKE_DURATION,
} from './color-picker.constants'
import type { ActiveThumb, ColorFormat, ColorPickerProps, Hsva } from './color-picker.types'
import {
  clamp,
  formatColor,
  parseColor,
  pickScreenColor,
  supportsEyeDropper,
  toCss,
  toHex,
} from './color-picker.utils'
import { Chip, ChipLabel, ColorArea, ContrastReadout, Slider, SwatchRow } from './color-picker-parts'
import { TextMorph } from './text-morph'
import { useFormatMorph } from './use-format-morph'
import { usePanelGrow } from './use-panel-grow'

/**
 * A colour field whose swatch grows into a full picker: an area for saturation and brightness,
 * hue and opacity sliders, a text field in hex, RGB, HSL or OKLCH, an eyedropper where the
 * browser has one, a contrast readout and saved swatches. Adapted from uiarc.
 */
export function ColorPicker({
  value,
  defaultValue = DEFAULT_COLOR,
  onValueChange,
  background = '#FFFFFF',
  label = 'Color',
  swatches: swatchesProp,
  defaultSwatches,
  onSwatchesChange,
  maxSwatches = 7,
  defaultFormat = 'hex',
  className,
}: ColorPickerProps) {
  const panelId = useId()
  const errorId = useId()
  const reduced = useReducedMotion() === true
  const canPick = supportsEyeDropper()

  const [hsva, setHsva] = useState<Hsva>(
    () => parseColor(value ?? defaultValue) ?? FALLBACK_HSVA,
  )
  // a new `value` replaces the colour, unless it is the hex we just reported
  const [synced, setSynced] = useState(value)
  if (value !== undefined && value !== synced) {
    setSynced(value)
    if (value.toUpperCase() !== toHex(hsva)) {
      const next = parseColor(value, hsva.h)
      if (next) setHsva(next)
    }
  }
  const [ownSwatches, setOwnSwatches] = useState(defaultSwatches ?? [])
  const swatches = swatchesProp ?? ownSwatches
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<ColorFormat>(defaultFormat)
  const [draft, setDraft] = useState<string | null>(null)
  const [invalid, setInvalid] = useState(false)
  const [active, setActive] = useState<ActiveThumb>(null)
  const [morphText, startMorph] = useFormatMorph()

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const areaThumbRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldX = useMotionValue(0)
  const panel = usePanelGrow({ open, reduced, panelRef, triggerRef })

  const hex = toHex(hsva)
  const css = toCss(hsva)
  const opaque = toCss(hsva, true)
  const text = formatColor(hsva, kind)

  const commit = (next: Hsva) => {
    setHsva(next)
    const nextHex = toHex(next)
    if (nextHex !== hex) onValueChange?.(nextHex)
  }

  const setSwatches = (next: typeof swatches) => {
    if (!swatchesProp) setOwnSwatches(next)
    onSwatchesChange?.(next)
  }

  const hide = (returnFocus = true) => {
    setOpen(false)
    setDraft(null)
    setInvalid(false)
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true })
  }

  // Escape closes and returns focus if it was inside; a press outside closes without stealing it
  const dismiss = useEffectEvent((event: Event) => {
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Escape') return
      hide(!!rootRef.current?.contains(document.activeElement))
      return
    }
    if (!rootRef.current?.contains(event.target as Node)) hide(false)
  })

  useEffect(() => {
    if (!open) return
    const listener = (event: Event) => dismiss(event)
    document.addEventListener('pointerdown', listener, true)
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('pointerdown', listener, true)
      document.removeEventListener('keydown', listener)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => areaThumbRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [open])

  const cycleFormat = () => {
    const next = FORMATS[(FORMATS.indexOf(kind) + 1) % FORMATS.length]
    setKind(next)
    setDraft(null)
    setInvalid(false)
    if (!reduced) startMorph(text, formatColor(hsva, next))
  }

  // true when there was nothing to submit or it parsed; a bad value shakes the field
  const submitDraft = () => {
    if (draft === null) return true
    const next = parseColor(draft, hsva.h)
    if (!next) {
      setInvalid(true)
      if (!reduced) animate(fieldX, SHAKE, { duration: SHAKE_DURATION, ease: EASE_STANDARD })
      return false
    }
    commit(next)
    setDraft(null)
    setInvalid(false)
    return true
  }

  const pickFromScreen = () => {
    pickScreenColor()
      .then((picked) => {
        const next = parseColor(picked, hsva.h)
        if (next) commit({ ...next, a: hsva.a })
      })
      .catch(() => {})
  }

  const applySwatch = (color: string) => {
    const next = parseColor(color, hsva.h)
    if (next) commit(next)
  }

  return (
    <div
      ref={rootRef}
      data-slot="color-picker"
      className={cn('relative inline-block tracking-[-0.01em] text-foreground', CHECKER, className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? hide() : setOpen(true))}
        className="flex h-11 items-center gap-2.5 rounded-[22px] border border-border bg-popover py-1.5 pr-4 pl-1.5 shadow-xs outline-none transition-colors duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] [-webkit-tap-highlight-color:transparent] hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring contrast-more:border-foreground/40"
      >
        <Chip color={css} />
        <ChipLabel label={label} hex={hex} />
      </button>

      {panel.shown && (
        // the drop shadow follows the clipped shape, so it grows with the panel
        <div
          data-open={open || undefined}
          className="pointer-events-none absolute -top-px -left-px z-20 [filter:drop-shadow(0_18px_36px_oklch(0%_0_0/0.12))_drop-shadow(0_2px_6px_oklch(0%_0_0/0.06))] data-open:pointer-events-auto dark:[filter:drop-shadow(0_20px_44px_oklch(0%_0_0/0.5))]"
        >
          <motion.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={`${label} color`}
            inert={!open}
            style={{ clipPath: panel.clipPath, opacity: panel.opacity }}
            className="w-[min(19rem,calc(100vw_-_32px))] rounded-[26px] border border-border bg-popover pb-3.5 will-change-[clip-path] contrast-more:border-foreground/40"
          >
            <div className="flex h-11 items-center gap-2.5 p-1.5">
              <Chip color={css} />
              <ChipLabel label={label} hex={hex} className="flex-1" />
              <motion.span style={{ opacity: panel.contentOpacity }} className="flex gap-0.5">
                {canPick && (
                  <button
                    type="button"
                    aria-label="Pick a color from the screen"
                    onClick={pickFromScreen}
                    className={ICON_BUTTON}
                  >
                    <Pipette className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Done"
                  onClick={() => hide()}
                  className={ICON_BUTTON}
                >
                  <Check className="size-[18px]" strokeWidth={1.75} aria-hidden />
                </button>
              </motion.span>
            </div>

            {/* one column locked to the panel, so a wider grade label never widens the sliders */}
            <motion.div
              style={{ opacity: panel.contentOpacity, y: panel.contentY }}
              className="grid grid-cols-[minmax(0,1fr)] gap-3.5 px-3.5 pt-2"
            >
              <ColorArea
                hsva={hsva}
                reduced={reduced}
                active={active === 'area'}
                onActive={(on) => setActive(on ? 'area' : null)}
                onChange={commit}
                thumbRef={areaThumbRef}
              />
              <Slider
                label="Hue"
                value={hsva.h}
                valueText={`${Math.round(hsva.h)} degrees`}
                max={360}
                track={HUE_TRACK}
                fill={`hsl(${hsva.h} 100% 50%)`}
                reduced={reduced}
                active={active === 'hue'}
                onActive={(on) => setActive(on ? 'hue' : null)}
                onChange={(h) => commit({ ...hsva, h: clamp(h, 0, 359.9) })}
              />
              <Slider
                label="Opacity"
                value={hsva.a * 100}
                valueText={`${Math.round(hsva.a * 100)}%`}
                max={100}
                track={`linear-gradient(to right, transparent 11px, ${opaque} calc(100% - 11px)), var(--checker)`}
                fill={css}
                reduced={reduced}
                active={active === 'alpha'}
                onActive={(on) => setActive(on ? 'alpha' : null)}
                onChange={(a) => commit({ ...hsva, a: clamp(a / 100) })}
              />

              <motion.div
                data-invalid={invalid || undefined}
                style={{ x: fieldX }}
                className="mt-0.5 flex h-10 items-stretch overflow-hidden rounded-[14px] border border-border bg-muted transition-colors duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] data-invalid:border-destructive contrast-more:border-foreground/40"
              >
                <button
                  type="button"
                  onClick={cycleFormat}
                  aria-label={`Format: ${FORMAT_NAMES[kind]}. Switch format`}
                  className="flex min-w-14 items-center justify-center border-r border-border px-2.5 text-xs font-medium text-foreground outline-none transition-colors duration-160 hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <TextMorph>{FORMAT_NAMES[kind]}</TextMorph>
                </button>
                <span className="relative flex min-w-0 flex-1">
                  <input
                    ref={inputRef}
                    value={draft ?? text}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label={`${label} in ${FORMAT_NAMES[kind]}`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? errorId : undefined}
                    data-morphing={morphText !== null ? '' : undefined}
                    onChange={(event) => {
                      setDraft(event.target.value)
                      setInvalid(false)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        if (submitDraft()) event.currentTarget.select()
                      }
                      // Escape first drops the edit; only a second Escape closes the panel
                      if (event.key === 'Escape' && draft !== null) {
                        event.stopPropagation()
                        event.nativeEvent.stopImmediatePropagation()
                        setDraft(null)
                        setInvalid(false)
                      }
                    }}
                    onBlur={() => {
                      if (submitDraft()) return
                      setDraft(null)
                      setInvalid(false)
                    }}
                    className="w-full min-w-0 bg-transparent px-2.5 text-xs text-foreground tabular-nums caret-foreground outline-none data-morphing:text-transparent"
                  />
                  {morphText !== null && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-2.5 text-xs whitespace-nowrap text-foreground tabular-nums"
                    >
                      <TextMorph>{morphText}</TextMorph>
                    </span>
                  )}
                </span>
              </motion.div>
              <p
                id={errorId}
                aria-live="polite"
                className="mx-0.5 -mt-2.5 -mb-1 text-xs text-destructive empty:hidden"
              >
                {invalid ? INVALID_MESSAGE : ''}
              </p>

              <ContrastReadout hsva={hsva} background={background} reduced={reduced} />

              <SwatchRow
                swatches={swatches}
                hex={hex}
                max={maxSwatches}
                reduced={reduced}
                onChange={setSwatches}
                onApply={applySwatch}
                onEmptied={() => inputRef.current?.focus({ preventScroll: true })}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
