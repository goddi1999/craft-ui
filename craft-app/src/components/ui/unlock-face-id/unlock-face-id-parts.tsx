import { motion } from 'motion/react'

import {
  BRACKET_DRAW,
  BRACKET_PATHS,
  BRACKET_STAGGER,
  CHECK_PATH,
  CHECK_SPRING,
  CHECK_STROKE_WIDTH,
  EASE_IN_OUT,
  EASE_OUT,
  FACE_DELAY,
  FACE_DRAW,
  FACE_PATHS,
  FACE_STAGGER,
  GLYPH_SPRING,
  INSTANT,
  SCAN_BAND_HEIGHT,
  SCAN_CLIP,
  SCAN_SWEEP,
  SCAN_TRAVEL,
  STROKE_WIDTH,
  SUCCESS_TEXT,
} from './unlock-face-id.constants'

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** The corner brackets and face, drawn stroke by stroke, with a scan band while busy. */
export function FaceGlyph({
  animated,
  clipId,
  gradientId,
  scanning,
  tone,
}: {
  animated: boolean
  clipId: string
  gradientId: string
  scanning: boolean
  // the colour lives on the group so a leaving face keeps the colour it had
  tone: string
}) {
  const draw = (delay: number, duration: number) =>
    animated ? { delay, duration, ease: EASE_OUT } : INSTANT

  return (
    <motion.g
      className={tone}
      style={{ transformOrigin: '50px 50px' }}
      initial={animated ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={animated ? { opacity: 0, scale: 0.82 } : { opacity: 0, transition: INSTANT }}
      transition={animated ? GLYPH_SPRING : INSTANT}
    >
      {BRACKET_PATHS.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          {...STROKE}
          strokeWidth={STROKE_WIDTH}
          initial={{ pathLength: animated ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={draw(index * BRACKET_STAGGER, BRACKET_DRAW)}
        />
      ))}

      {FACE_PATHS.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          {...STROKE}
          strokeWidth={STROKE_WIDTH}
          initial={{ pathLength: animated ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={draw(FACE_DELAY + index * FACE_STAGGER, FACE_DRAW)}
        />
      ))}

      {scanning && animated && (
        <g clipPath={`url(#${clipId})`}>
          <motion.g
            initial={{ y: -SCAN_TRAVEL }}
            animate={{ y: SCAN_TRAVEL }}
            transition={{
              duration: SCAN_SWEEP,
              ease: EASE_IN_OUT,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <rect
              fill={`url(#${gradientId})`}
              height={SCAN_BAND_HEIGHT}
              width={SCAN_CLIP.width}
              x={SCAN_CLIP.x}
              y={50 - SCAN_BAND_HEIGHT / 2}
            />
            <line
              opacity={0.9}
              stroke="var(--primary)"
              strokeLinecap="round"
              strokeWidth={1.5}
              x1={SCAN_CLIP.x + 2}
              x2={SCAN_CLIP.x + SCAN_CLIP.width - 2}
              y1={50 + SCAN_BAND_HEIGHT / 2}
              y2={50 + SCAN_BAND_HEIGHT / 2}
            />
          </motion.g>
        </g>
      )}
    </motion.g>
  )
}

/** The check that replaces the face once unlocked. */
export function CheckGlyph({ animated }: { animated: boolean }) {
  return (
    <motion.g
      className={SUCCESS_TEXT}
      style={{ transformOrigin: '50px 50px' }}
      initial={animated ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={animated ? CHECK_SPRING : INSTANT}
    >
      <motion.path
        d={CHECK_PATH}
        {...STROKE}
        strokeWidth={CHECK_STROKE_WIDTH}
        initial={{ pathLength: animated ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={animated ? CHECK_SPRING : INSTANT}
      />
    </motion.g>
  )
}
