export type StyleableSelectTheme = 'system' | 'light' | 'dark'

export type StyleableSelectProps = {
  options?: string[]
  value?: string
  onValueChange?: (value: string) => void
  labelPrefix?: string
  theme?: StyleableSelectTheme
  className?: string
  fullPage?: boolean
}
