import type { ComponentProps } from 'react'

/** A pretend file for the autoplay demo; only its name and size are shown. */
export type FileDropSample = { name: string; size: number }

export type FileDropProps = Omit<ComponentProps<'div'>, 'children' | 'onChange'> & {
  /** Called with the dropped or picked files. Nothing is uploaded for you. */
  onFilesChange?: (files: File[]) => void
  /** Passed to the file picker. Dropped files are not filtered, so check them in `onFilesChange`. */
  accept?: string
  /** Take every dropped or picked file instead of the first. @default false */
  multiple?: boolean
  /** Real upload progress from 0 to 1; the zone turns green at 1. Leave it out to play a simulated upload. Set it back to 0 for each new file. */
  progress?: number
  /** First line while idle. @default 'Drop your file here' */
  label?: string
  /** Second line while idle. @default 'or click to choose one' */
  hint?: string
  /** While idle, carry `sample` in and upload it on a loop; pauses for 8 s whenever someone interacts. @default false */
  autoPlay?: boolean
  /** The pretend file autoplay carries in. @default { name: 'brief.pdf', size: 2_400_000 } */
  sample?: FileDropSample
  /** @default false */
  disabled?: boolean
}

export type FileDropUpload = { name: string; size: number; sample: boolean }

export type FileDropState =
  | { phase: 'idle' }
  | { phase: 'carry' }
  | { phase: 'upload'; file: FileDropUpload }
  | { phase: 'done'; file: FileDropUpload }

export type FileDropPhase = FileDropState['phase']
