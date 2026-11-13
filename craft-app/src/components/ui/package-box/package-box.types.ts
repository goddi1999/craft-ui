import type { ReactNode } from 'react'

type PackageSlipItem = {
  name: string
  qty?: number
  price?: string
}

type PackageSlip = {
  title?: string
  subtitle?: string
  /** Top-right of the paper, e.g. "№ 4821" */
  reference?: string
  date?: string
  recipient?: string
  address?: string
  items?: PackageSlipItem[]
  total?: string
  /** Round stamp at the bottom. Pass "" to hide it. */
  stamp?: string
  /** Small label at the top-left of the paper. */
  eyebrow?: string
}

type PackageBoxColors = {
  /** Cardboard base. All faces are shaded from this one. */
  box?: string
  tape?: string
  paper?: string
  ink?: string
  /** Stamp color. */
  accent?: string
}

type PackageBoxProps = {
  /** Controlled open state. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Replaces the default packing slip (sized 240 × 340). */
  children?: ReactNode
  /** Text for the default packing slip. */
  slip?: PackageSlip
  /** Max width in px. The whole scene scales to fit. @default 460 */
  maxWidth?: number
  colors?: PackageBoxColors
  /** Sticker on the left face. `false` hides it. */
  label?: ReactNode | false
  /** Marks on the right face. `false` hides them. */
  symbols?: ReactNode | false
  /** Packing tape across the top. @default true */
  tape?: boolean
  /** Caption button under the box. Always present for screen readers. @default true */
  hint?: boolean
  openLabel?: string
  closeLabel?: string
  /** Keep the full height reserved while closed, so the page doesn't shift. */
  reserveSpace?: boolean
  className?: string
  paperClassName?: string
}

type ResolvedSlip = Required<Omit<PackageSlip, 'items'>> & {
  items: PackageSlipItem[]
}

export type {
  PackageBoxColors,
  PackageBoxProps,
  PackageSlip,
  PackageSlipItem,
  ResolvedSlip,
}
