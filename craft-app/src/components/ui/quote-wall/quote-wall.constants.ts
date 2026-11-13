// the reference swaps focus in ~120ms; it is hovered tens of times a visit, so keep it short
export const FOCUS_MS = 140
export const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export const ACCENT = 'text-[#F2610D] dark:text-[#FF8A3D]'

// initials avatars get one of these when there is no image
export const AVATAR_TINTS = [
  'from-[#FFB36B] to-[#FF6A3D]',
  'from-[#7CC4FF] to-[#3E63F5]',
  'from-[#B78CFF] to-[#7A3FE0]',
  'from-[#6BE0A8] to-[#1FA86B]',
  'from-[#FF8FB8] to-[#E0457A]',
  'from-[#C9C9CF] to-[#7C7C86]',
] as const
