/** Composition box in px; the icon sits at its centre and the guides line up with it. */
const BOX = { width: 740, height: 416 }
const CX = BOX.width / 2
const CY = BOX.height / 2
/** Guide lines run far past the box; the frame clips them and the mask fades them. */
const FAR = 2000

const DASHED = [241.5, 279, 461, 498.5]
const DASHED_Y = [79, 117, 299, 336]

/** Faint construction lines behind the icon, like an icon-grid template. */
function Guides() {
  return (
    <svg
      aria-hidden
      width={BOX.width}
      height={BOX.height}
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:scale-75"
    >
      <line x1={-FAR} y1={CY} x2={BOX.width + FAR} y2={CY} />
      <line x1={CX} y1={-FAR} x2={CX} y2={BOX.height + FAR} />
      <line x1={CX - FAR} y1={CY - FAR} x2={CX + FAR} y2={CY + FAR} />
      <line x1={CX + FAR} y1={CY - FAR} x2={CX - FAR} y2={CY + FAR} />
      <g strokeDasharray="4 4">
        {DASHED.map((x) => (
          <line key={`x${x}`} x1={x} y1={-FAR} x2={x} y2={BOX.height + FAR} />
        ))}
        {DASHED_Y.map((y) => (
          <line key={`y${y}`} x1={-FAR} y1={y} x2={BOX.width + FAR} y2={y} />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={91} />
      <circle cx={CX} cy={CY} r={129} />
    </svg>
  )
}

/** Empty-picture icon geometry (center illustration — not a photo). */
const ICON = {
  x: 231.5,
  y: 106.5,
  width: 277,
  height: 203,
  radius: 26,
  stroke: 18,
  leg: 56,
}

/** Local top-left L; placed with `translate(corner) rotate(deg)`. */
function iconCornerPath() {
  const half = ICON.stroke / 2
  const arc = ICON.radius - half
  return [
    `M ${half} ${ICON.leg}`,
    `L ${half} ${ICON.radius}`,
    `A ${arc} ${arc} 0 0 1 ${ICON.radius} ${half}`,
    `L ${ICON.leg} ${half}`,
  ].join(' ')
}

const ICON_CORNER_PATH = iconCornerPath()

const ICON_CORNERS = [
  { x: ICON.x, y: ICON.y, rotate: 0 },
  { x: ICON.x + ICON.width, y: ICON.y, rotate: 90 },
  { x: ICON.x + ICON.width, y: ICON.y + ICON.height, rotate: 180 },
  { x: ICON.x, y: ICON.y + ICON.height, rotate: 270 },
] as const

/**
 * Empty-picture mark: four thick rounded corner brackets (no closed edge) and
 * an optional filled block in the top-left. Pure SVG — not an image file.
 */
function EmptyImageIcon({
  showInnerRect,
  frame = 'corners',
}: {
  showInnerRect: boolean
  /** `corners` = open L-brackets; `full` = closed rounded rect. */
  frame?: 'corners' | 'full'
}) {
  return (
    <svg
      aria-hidden
      width={BOX.width}
      height={BOX.height}
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      fill="none"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:scale-75"
    >
      <g className="origin-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {frame === 'full' ? (
          <rect
            x={ICON.x}
            y={ICON.y}
            width={ICON.width}
            height={ICON.height}
            rx={ICON.radius}
            stroke="currentColor"
            strokeWidth={ICON.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          ICON_CORNERS.map(({ x, y, rotate }) => (
            <path
              key={`${x}-${y}-${rotate}`}
              d={ICON_CORNER_PATH}
              stroke="currentColor"
              strokeWidth={ICON.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${x} ${y}) rotate(${rotate})`}
            />
          ))
        )}
        {showInnerRect ? (
          <rect
            x={260}
            y={135}
            width={110}
            height={73}
            rx={8}
            fill="currentColor"
          />
        ) : null}
      </g>
    </svg>
  )
}

const GUIDE_MASK =
  'radial-gradient(ellipse 55% 60% at 50% 50%, #000 35%, transparent 100%)'

export type ImagePinEmptyArtProps = {
  label: string
  hint?: string
  /** The filled block in the icon's top-left corner. */
  showInnerRect?: boolean
  /**
   * How the centre empty-picture mark is drawn.
   * `corners` = four L-brackets only; `full` = closed rounded rect.
   * @default 'corners'
   */
  iconFrame?: 'corners' | 'full'
}

/**
 * Centre empty-state art: guides + SVG picture mark + label.
 * Not a photo — all SVG. Outer brackets live in `@/components/ui/corner-frame`.
 */
export function ImagePinEmptyArt({
  label,
  hint,
  showInnerRect = true,
  iconFrame = 'corners',
}: ImagePinEmptyArtProps) {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 text-foreground/10"
        style={{ maskImage: GUIDE_MASK, WebkitMaskImage: GUIDE_MASK }}
      >
        <Guides />
      </span>

      <span className="pointer-events-none absolute inset-0 text-foreground/25">
        <EmptyImageIcon showInnerRect={showInnerRect} frame={iconFrame} />
      </span>

      <span className="pointer-events-none absolute top-[calc(50%+140px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 whitespace-nowrap max-sm:top-[calc(50%+106px)]">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </>
  )
}
