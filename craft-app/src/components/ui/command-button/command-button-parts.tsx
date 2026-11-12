/** A keycap that lights up while its key is held down. */
export function Key({ label, on = false }: { label: string; on?: boolean }) {
  return (
    <kbd
      data-on={on || undefined}
      // kbd is monospace by default, inherit the text font instead
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-foreground/[0.07] px-1.5 [font-family:inherit] text-[11px] leading-none font-medium text-muted-foreground transition-colors duration-150 data-[on]:bg-foreground/[0.18] data-[on]:text-foreground data-[on]:duration-75"
    >
      {label}
    </kbd>
  )
}
