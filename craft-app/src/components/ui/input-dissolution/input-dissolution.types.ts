import type { ACCENT_TOKENS } from './input-dissolution.constants'

export type InputDissolutionNoise = 'fractalNoise' | 'turbulence'

/** A theme accent token (`--oklch-*` in index.css). */
export type InputDissolutionAccent = (typeof ACCENT_TOKENS)[number]

/** What a correct submit plays: the noise dissolve, or a lift with an elastic settle. */
export type InputDissolutionEffect = 'dissolve' | 'bounce'

export type InputDissolutionProps = {
  /** Placeholder shown in the empty field. @default 'rockstar@ui.dev' */
  placeholder?: string
  /** Accessible name for the email field. @default 'Email address' */
  label?: string
  /** Submit button text, rendered as `[LABEL]`. @default 'Enlist' */
  submitLabel?: string
  /** Called with the email when a valid value is submitted, before its effect plays. */
  onSubmit?: (value: string) => void
  /** Correct: dissolve the text, or bounce and clear it. @default 'dissolve' */
  effect?: InputDissolutionEffect
  /** Wrong: a small shake. Off: only the invalid state shows. @default true */
  shake?: boolean
  /** Decides what counts as correct. @default the field's own email check */
  validate?: (value: string) => boolean
  /** Dissolve right-to-left instead of left-to-right. @default false */
  rtl?: boolean
  /** Seconds the dissolve sweep takes. @default 2 */
  speed?: number
  /** Run the text copy through the blur + displacement filter. @default true */
  filtered?: boolean
  /** Freeze the sweep and drive it from `progress` instead. @default false */
  debug?: boolean
  /** In debug, tilt the stage and pull each pass apart in 3D. @default false */
  explode?: boolean
  /** Manual sweep position (0–100) used in debug. @default 0 */
  progress?: number
  /** Text colour. Any CSS colour. @default 'var(--foreground)' */
  color?: string
  /**
   * The block caret and the text selection. A theme token name (`'blue'`, `'pink'`, …) uses
   * that `--oklch-*` colour; anything else is taken as a CSS colour. @default '#ff1e1e'
   */
  accent?: InputDissolutionAccent | (string & {})
  /** A line under the field, darker while focused. @default false */
  underline?: boolean
  /** Colour of the underline after a wrong submit. @default 'var(--destructive)' */
  invalidColor?: string
  /** feTurbulence base frequency — higher means finer grains. @default 1.8 */
  baseFrequency?: number
  /** feTurbulence octaves. @default 10 */
  numOctaves?: number
  /** feTurbulence seed. @default 1 */
  seed?: number
  /** feTurbulence noise type. @default 'fractalNoise' */
  noiseType?: InputDissolutionNoise
  /** feDisplacementMap scale — how far the grains scatter. @default 20 */
  displacementScale?: number
  className?: string
}
