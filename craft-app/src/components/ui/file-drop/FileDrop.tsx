import { motion, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import { DEFAULT_SAMPLE, LIFT_GROW } from './file-drop.constants'
import type { FileDropProps } from './file-drop.types'
import { clamp01, formatBytes } from './file-drop.utils'
import { DropCore, FileChip, StatusLine, UploadBytes } from './file-drop-parts'
import { useFileDrop } from './use-file-drop'

/**
 * A drop zone that wakes up when a file comes near, gulps it, fills a ring around a
 * rolling percentage and floods green when the upload is done.
 */
export function FileDrop({
  onFilesChange,
  accept,
  multiple = false,
  progress,
  label = 'Drop your file here',
  hint = 'or click to choose one',
  autoPlay = false,
  sample = DEFAULT_SAMPLE,
  disabled = false,
  className,
  ...props
}: FileDropProps) {
  const reduced = useReducedMotion() ?? false
  const { state, values, chip, inputRef, handlers, handlePick } = useFileDrop({
    onFilesChange,
    multiple,
    progress,
    autoPlay,
    sample,
    disabled,
    reduced,
  })
  const zoneScale = useTransform(
    [values.zone, values.lift],
    ([zone, lift]: number[]) => zone * (1 + LIFT_GROW * lift),
  )
  const liftOpacity = useTransform(values.lift, clamp01)

  const title =
    state.phase === 'upload'
      ? `Uploading ${state.file.name}`
      : state.phase === 'done'
        ? 'Upload complete'
        : label
  const announcement =
    state.phase === 'upload'
      ? `Uploading ${state.file.name}`
      : state.phase === 'done'
        ? `Upload complete: ${state.file.name}, ${formatBytes(state.file.size)}`
        : ''

  return (
    <div
      data-slot="file-drop"
      data-state={state.phase}
      className={cn('relative w-74 max-w-full', className)}
      {...props}
    >
      <motion.button
        type="button"
        disabled={disabled}
        {...handlers}
        className="relative block h-54 w-full cursor-pointer overflow-hidden rounded-3xl bg-muted text-foreground outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        style={{ scale: zoneScale }}
      >
        <span className="sr-only">{`${label}. ${hint}`}</span>
        {/* no dashed border: a file over the zone lifts its fill instead */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-foreground/[0.09]"
          style={{ opacity: liftOpacity }}
        />
        <DropCore values={values} />
        <StatusLine
          lineKey={title}
          reduced={reduced}
          className="top-[130px] h-6 text-base leading-6 font-semibold tracking-[-0.015em]"
        >
          {title}
        </StatusLine>
        <StatusLine
          lineKey={
            state.phase === 'upload' ? 'upload' : state.phase === 'done' ? 'done' : `idle:${hint}`
          }
          reduced={reduced}
          className="top-[157px] h-5 text-[13px] leading-5 text-muted-foreground tabular-nums"
        >
          {state.phase === 'upload' ? (
            <UploadBytes progress={values.progress} size={state.file.size} />
          ) : state.phase === 'done' ? (
            `${state.file.name} · ${formatBytes(state.file.size)}`
          ) : (
            hint
          )}
        </StatusLine>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        hidden
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handlePick}
      />
      <FileChip name={sample.name} chip={chip} reduced={reduced} />
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}
