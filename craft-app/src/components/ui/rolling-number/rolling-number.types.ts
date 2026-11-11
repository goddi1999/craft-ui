// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type RollingNumberProps = {
  /** A number (formatted with `format` or en-US grouping) or a preformatted string like "87.2k". */
  value: number | string
  format?: (value: number) => string
  /** Delay between neighbouring digits, right to left, in ms. */
  stagger?: number
  className?: string
}

export type { RollingNumberProps }
