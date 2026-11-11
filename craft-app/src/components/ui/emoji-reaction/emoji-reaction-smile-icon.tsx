/** Smiley with a plus — the "add a reaction" glyph. */
export function SmileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M21 12a9 9 0 1 1-9-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8.9" cy="10" r="1.35" fill="currentColor" />
      <circle cx="15.1" cy="10" r="1.35" fill="currentColor" />
      <path d="M8 13.9a4.7 4.7 0 0 0 8 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M19 2.5v5M21.5 5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
