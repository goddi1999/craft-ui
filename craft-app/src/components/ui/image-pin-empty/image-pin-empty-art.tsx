/** Matches `rounded-4xl` (2rem) so the arcs follow the box's own curve. */
const CORNER_RADIUS = 32;
const CORNER_STROKE = 4;
const HALF = CORNER_STROKE / 2;
/** Quarter circle inset by half the stroke so it sits inside the box. */
const CORNER_PATH = `M ${HALF} ${CORNER_RADIUS} A ${CORNER_RADIUS - HALF} ${CORNER_RADIUS - HALF} 0 0 1 ${CORNER_RADIUS} ${HALF}`;

const CORNERS = [
  "top-0 left-0",
  "top-0 right-0 rotate-90",
  "right-0 bottom-0 rotate-180",
  "bottom-0 left-0 -rotate-90",
];

/** Four disconnected rounded corner arcs with round line ends, in place of a border. */
export function CornerArcs() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 text-foreground/25"
    >
      {CORNERS.map((position) => (
        <svg
          key={position}
          width={CORNER_RADIUS}
          height={CORNER_RADIUS}
          viewBox={`0 0 ${CORNER_RADIUS} ${CORNER_RADIUS}`}
          overflow="visible"
          fill="none"
          className={`absolute ${position}`}
        >
          <path
            d={CORNER_PATH}
            stroke="currentColor"
            strokeWidth={CORNER_STROKE}
            strokeLinecap="round"
          />
        </svg>
      ))}
    </span>
  );
}

/** Composition box in px; the icon sits at its centre and the guides line up with it. */
const BOX = { width: 740, height: 416 };
const CX = BOX.width / 2;
const CY = BOX.height / 2;
/** Guide lines run far past the box; the frame clips them and the mask fades them. */
const FAR = 2000;

const DASHED = [241.5, 279, 461, 498.5];
const DASHED_Y = [79, 117, 299, 336];

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
  );
}

/** An empty picture: rounded outline with a filled block in the top-left corner. */
function EmptyImageIcon({ showInnerRect }: { showInnerRect: boolean }) {
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
        <rect
          x={231.5}
          y={106.5}
          width={277}
          height={203}
          rx={26}
          stroke="currentColor"
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
  );
}

const GUIDE_MASK =
  "radial-gradient(ellipse 55% 60% at 50% 50%, #000 35%, transparent 100%)";

export type ImagePinEmptyArtProps = {
  label: string;
  hint?: string;
  /** The filled block in the icon's top-left corner. */
  showInnerRect?: boolean;
};

/**
 * Guides, icon and text, centred in a positioned parent.
 */
export function ImagePinEmptyArt({
  label,
  hint,
  showInnerRect = true,
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
        <EmptyImageIcon showInnerRect={showInnerRect} />
      </span>

      <span className="pointer-events-none absolute top-[calc(50%+140px)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 whitespace-nowrap max-sm:top-[calc(50%+106px)]">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </>
  );
}
