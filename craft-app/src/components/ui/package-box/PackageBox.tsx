import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

import { cn } from '@/lib/utils'

import {
  Flap,
  HintButton,
  Slip,
  Sticker,
  Symbols,
  TapeTail,
  Wall,
} from './package-box-parts'
import {
  BOX_CENTER_FROM_BOTTOM,
  CLOSE_SECONDS,
  DEFAULT_COLORS,
  DEFAULT_SLIP,
  EASE_FLAP,
  EASE_RISE,
  EASE_SHOW,
  H2,
  H_CLOSED,
  H_OPEN,
  MAJOR_OPEN,
  MINOR_OPEN,
  OPEN_SECONDS,
  PAPER_H,
  PAPER_W,
  S,
  STAGE_W,
  TAPE_W,
  TILT,
  TURN,
} from './package-box.constants'
import type { PackageBoxProps, ResolvedSlip } from './package-box.types'
import { FACE, paperPose } from './package-box.utils'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * A cardboard package. Click and the tape splits, the flaps fold open, and a
 * paper document rises out and turns to face you — pure CSS 3D + Motion.
 */
export function PackageBox({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  slip,
  maxWidth = 460,
  colors,
  label,
  symbols,
  tape = true,
  hint = true,
  openLabel = 'Click to open',
  closeLabel = 'Close',
  reserveSpace = false,
  className,
  paperClassName,
}: PackageBoxProps) {
  const reduce = useReducedMotion() === true
  const paperId = useId().replace(/[^\w-]/g, '')

  const [inner, setInner] = useState(defaultOpen)
  const isOpen = open ?? inner
  const [hovered, setHovered] = useState(false)
  const [ready, setReady] = useState(false)
  const [fineHover, setFineHover] = useState(false)

  const handleToggle = useCallback(() => {
    const next = !isOpen
    if (open === undefined) setInner(next)
    onOpenChange?.(next)
  }, [isOpen, open, onOpenChange])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFineHover(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // One value drives everything: 0 closed → 1 open. Closing plays the same film reverse.
  const t = useMotionValue(defaultOpen ? 1 : 0)
  useEffect(() => {
    const controls = animate(
      t,
      isOpen ? 1 : 0,
      reduce
        ? { duration: 0.01 }
        : { duration: isOpen ? OPEN_SECONDS : CLOSE_SECONDS, ease: 'linear' },
    )
    return () => controls.stop()
  }, [isOpen, reduce, t])

  const cut = useTransform(t, [0, 0.08], [0, 1])
  const majorF = useTransform(t, [0.08, 0.34], [-90, MAJOR_OPEN], {
    ease: EASE_FLAP,
    clamp: false,
  })
  const majorB = useTransform(t, [0.11, 0.37], [-90, MAJOR_OPEN], {
    ease: EASE_FLAP,
    clamp: false,
  })
  const minorR = useTransform(t, [0.26, 0.5], [-90, MINOR_OPEN], {
    ease: EASE_FLAP,
    clamp: false,
  })
  const minorL = useTransform(t, [0.29, 0.53], [-90, MINOR_OPEN], {
    ease: EASE_FLAP,
    clamp: false,
  })
  const rise = useTransform(t, [0.46, 0.78], [0, 1], { ease: EASE_RISE })
  const show = useTransform(t, [0.66, 1], [0, 1], { ease: EASE_SHOW })

  const paperTransform = useTransform([rise, show], ([r, s]) =>
    paperPose(r as number, s as number),
  )
  const tapeH = useTransform(cut, [0, 1], [TAPE_W / 2, TAPE_W / 2 - 0.9])

  const wrapRef = useRef<HTMLDivElement>(null)
  const scale = useMotionValue(1)
  const grow = useTransform(
    [rise, show],
    ([r, s]) => 0.65 * (r as number) + 0.35 * (s as number),
  )
  const height = useTransform([grow, scale], ([g, sc]) =>
    (reserveSpace ? H_OPEN : H_CLOSED + (H_OPEN - H_CLOSED) * (g as number)) *
    (sc as number),
  )

  useIsomorphicLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      scale.set(el.clientWidth / STAGE_W)
      setReady(true)
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scale])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleToggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, handleToggle])

  const theme = {
    '--box': colors?.box ?? DEFAULT_COLORS.box,
    '--tape': colors?.tape ?? DEFAULT_COLORS.tape,
    '--paper': colors?.paper ?? DEFAULT_COLORS.paper,
    '--ink': colors?.ink ?? DEFAULT_COLORS.ink,
    '--accent': colors?.accent ?? DEFAULT_COLORS.accent,
  } as CSSProperties

  const tapeStyle: CSSProperties = {
    background:
      'linear-gradient(180deg, color-mix(in srgb, var(--tape), white 18%), var(--tape) 55%, color-mix(in srgb, var(--tape), black 8%))',
    boxShadow: '0 0 0 0.5px rgba(80,50,20,0.18)',
  }

  const slipData: ResolvedSlip = {
    ...DEFAULT_SLIP,
    ...slip,
    items: slip?.items ?? DEFAULT_SLIP.items,
  }

  const lift = fineHover && hovered && !isOpen && !reduce

  return (
    <div
      data-slot="package-box"
      className={cn('mx-auto w-full overflow-hidden', className)}
      style={{ maxWidth }}
    >
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{ ...theme, opacity: ready ? 1 : 0 }}
      >
        <motion.div className="relative w-full" style={{ height }}>
          <motion.div
            className="absolute bottom-0 left-1/2"
            style={{
              width: STAGE_W,
              height: H_OPEN,
              x: '-50%',
              scale,
              transformOrigin: '50% 100%',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              className="absolute inset-0 touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
              style={{ pointerEvents: 'none' }}
              animate={{ y: lift ? -4 : 0 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
              whileTap={reduce ? undefined : { scale: 0.99 }}
              onHoverStart={() => fineHover && setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              onClick={handleToggle}
            >
              <div
                className="absolute inset-0"
                style={{
                  perspective: 2200,
                  perspectiveOrigin: '50% 38%',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: STAGE_W / 2 - H2,
                    top: H_OPEN - BOX_CENTER_FROM_BOTTOM - H2,
                    width: S,
                    height: S,
                    transform: `rotateX(${TILT}deg) rotateY(${TURN}deg)`,
                    cursor: 'pointer',
                    pointerEvents: 'none',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: -70,
                      top: -70,
                      width: S + 140,
                      height: S + 140,
                      transform: `rotateX(90deg) translateZ(${-H2 - 3}px)`,
                      background:
                        'radial-gradient(closest-side, rgba(45,28,10,0.34), rgba(45,28,10,0.14) 58%, transparent 100%)',
                    }}
                  />

                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Wall
                      transform={`rotateX(-90deg) translateZ(${H2}px)`}
                      outer={FACE.floor}
                      inner={FACE.floor}
                    />

                    <Wall
                      transform={`rotateY(180deg) translateZ(${H2}px)`}
                      outer={FACE.left}
                      flap={
                        <Flap
                          angle={majorB}
                          tapeHalf={
                            tape ? (
                              <motion.div
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  height: tapeH,
                                  ...tapeStyle,
                                }}
                              />
                            ) : undefined
                          }
                        />
                      }
                    />
                    <Wall
                      transform={`rotateY(-90deg) translateZ(${H2}px)`}
                      outer={FACE.right}
                      flap={<Flap angle={minorL} minor />}
                    >
                      {tape && <TapeTail cut={cut} style={tapeStyle} />}
                    </Wall>

                    <Wall
                      transform={`translateZ(${H2}px)`}
                      outer={FACE.left}
                      outerStyle={{
                        boxShadow:
                          'inset -12px 0 20px -12px rgba(60,30,5,0.3), inset 0 10px 14px -10px rgba(255,255,255,0.2)',
                      }}
                      flap={
                        <Flap
                          angle={majorF}
                          tapeHalf={
                            tape ? (
                              <motion.div
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  height: tapeH,
                                  ...tapeStyle,
                                }}
                              />
                            ) : undefined
                          }
                        />
                      }
                    >
                      {label !== false && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '58%',
                            top: '20%',
                            width: '33%',
                            height: '38%',
                          }}
                        >
                          {label ?? <Sticker />}
                        </div>
                      )}
                    </Wall>
                    <Wall
                      transform={`rotateY(90deg) translateZ(${H2}px)`}
                      outer={FACE.right}
                      outerStyle={{
                        boxShadow:
                          'inset 12px 0 20px -12px rgba(30,15,0,0.35), inset 0 10px 14px -10px rgba(255,255,255,0.1)',
                      }}
                      flap={<Flap angle={minorR} minor />}
                    >
                      {tape && <TapeTail cut={cut} style={tapeStyle} />}
                      {symbols !== false && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '36%',
                            top: '58%',
                            width: '58%',
                            height: '32%',
                          }}
                        >
                          {symbols ?? <Symbols />}
                        </div>
                      )}
                    </Wall>
                  </div>

                  <motion.div
                    id={paperId}
                    role="document"
                    aria-label="Document"
                    aria-hidden={!isOpen}
                    inert={!isOpen ? true : undefined}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      'overflow-hidden rounded-[3px] font-sans antialiased',
                      paperClassName,
                    )}
                    style={{
                      position: 'absolute',
                      left: H2 - PAPER_W / 2,
                      top: H2 - PAPER_H / 2,
                      width: PAPER_W,
                      height: PAPER_H,
                      transform: paperTransform,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      color: 'var(--ink)',
                      cursor: 'default',
                      pointerEvents: isOpen ? 'auto' : 'none',
                      background:
                        'linear-gradient(180deg, transparent 33%, rgba(0,0,0,0.035) 33.3%, transparent 34%, transparent 66.3%, rgba(0,0,0,0.035) 66.6%, transparent 67.3%), radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.7), transparent 60%), var(--paper)',
                      boxShadow:
                        '0 1px 0 rgba(0,0,0,0.05), 0 14px 28px -10px rgba(40,25,10,0.35), 0 2px 6px rgba(40,25,10,0.12)',
                    }}
                  >
                    {children ?? <Slip data={slipData} />}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <HintButton
        hint={hint}
        isOpen={isOpen}
        openLabel={openLabel}
        closeLabel={closeLabel}
        paperId={paperId}
        onToggle={handleToggle}
      />
    </div>
  )
}
