import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { animate } from 'motion/react'

import {
  AUTO_REST_MS,
  DONE_HOLD_MS,
  DRAG_GRACE_MS,
  FOLLOW_SPRING,
  HOVER_SPRING,
  SAMPLE_DROP_MS,
  SAMPLE_FADE_MS,
  SAMPLE_HOVER,
  SAMPLE_HOVER_MS,
  SAMPLE_NEAR_MS,
  UPLOAD_MS,
  USER_PAUSE_MS,
} from './file-drop.constants'
import type { FileDropSample, FileDropState } from './file-drop.types'
import { clamp01, describeFiles, pace, settle, shortName } from './file-drop.utils'
import { useDropMotion } from './use-drop-motion'

type Options = {
  onFilesChange?: (files: File[]) => void
  multiple: boolean
  progress: number | undefined
  autoPlay: boolean
  sample: FileDropSample
  disabled: boolean
  reduced: boolean
}

/** The zone's state machine: idle → (carry) → upload → done → idle, fed by real files or the sample. */
export function useFileDrop({
  onFilesChange,
  multiple,
  progress,
  autoPlay,
  sample,
  disabled,
  reduced,
}: Options) {
  const [state, setState] = useState<FileDropState>({ phase: 'idle' })
  // the sample is right beside the zone, or a real file is being dragged over it
  const [near, setNear] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drop = useDropMotion(state.phase, near || dragging, reduced)
  const { progress: shown } = drop.values
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef(new Set<number>())
  const dragTimer = useRef<number | undefined>(undefined)
  const userUntil = useRef(0)

  const later = (ms: number, callback: () => void) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id)
      callback()
    }, ms)
    timers.current.add(id)
  }

  // drops whatever the last run still had planned: the sample's flight, the reset after done
  const cancelRun = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current.clear()
  }

  const markUser = () => {
    userUntil.current = performance.now() + USER_PAUSE_MS
  }

  const begin = (name: string, size: number, isSample: boolean) => {
    setState({ phase: 'upload', file: { name: shortName(name), size, sample: isSample } })
    setNear(false)
    shown.jump(0)
    drop.feed()
  }

  const finish = () => {
    setState((current) =>
      current.phase === 'upload' ? { phase: 'done', file: current.file } : current,
    )
    drop.finish()
    later(DONE_HOLD_MS, () => setState({ phase: 'idle' }))
  }

  const playSample = () => {
    cancelRun()
    setState({ phase: 'carry' })
    drop.launchChip()
    later(SAMPLE_NEAR_MS, () => setNear(true))
    later(SAMPLE_HOVER_MS, () => drop.glideChip(SAMPLE_HOVER, HOVER_SPRING))
    later(SAMPLE_DROP_MS, () => {
      drop.dropChip()
      later(SAMPLE_FADE_MS, drop.hideChip)
      begin(sample.name, sample.size, true)
    })
  }

  const take = (list: FileList | null) => {
    if (disabled || !list || list.length === 0 || state.phase === 'upload') return
    const files = multiple ? Array.from(list) : [list[0]]
    cancelRun()
    drop.hideChip()
    onFilesChange?.(files)
    const { name, size } = describeFiles(files)
    begin(name, size, false)
  }

  const handleUploaded = useEffectEvent(() => finish())
  const handleAutoPlay = useEffectEvent(() => playSample())

  const simulated = state.phase === 'upload' && (state.file.sample || progress === undefined)
  const following = state.phase === 'upload' && !simulated

  useEffect(() => {
    if (!simulated) return
    const controls = animate(shown, 1, {
      duration: UPLOAD_MS / 1000,
      ease: pace,
      onComplete: () => handleUploaded(),
    })
    return () => controls.stop()
  }, [simulated, shown])

  useEffect(() => {
    if (!following || progress === undefined) return
    const target = clamp01(progress)
    const controls = animate(shown, target, {
      ...settle(FOLLOW_SPRING, reduced),
      onComplete: () => {
        if (target >= 1) handleUploaded()
      },
    })
    return () => controls.stop()
  }, [following, progress, reduced, shown])

  useEffect(() => {
    if (!autoPlay || disabled || state.phase !== 'idle') return
    const idleSince = performance.now()
    let timer = window.setTimeout(tick, AUTO_REST_MS)
    // waits out the rest and any pause the viewer started, then carries the next sample in
    function tick() {
      const wait = Math.max(idleSince + AUTO_REST_MS, userUntil.current) - performance.now()
      if (wait > 0) timer = window.setTimeout(tick, wait)
      else handleAutoPlay()
    }
    return () => window.clearTimeout(timer)
  }, [autoPlay, disabled, state.phase])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((id) => window.clearTimeout(id))
      window.clearTimeout(dragTimer.current)
    }
  }, [])

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (disabled) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    markUser()
    // a real file wins over the sample
    if (state.phase === 'carry') {
      cancelRun()
      setState({ phase: 'idle' })
      setNear(false)
      drop.hideChip()
    }
    setDragging(true)
    window.clearTimeout(dragTimer.current)
    dragTimer.current = window.setTimeout(() => setDragging(false), DRAG_GRACE_MS)
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    if (disabled) return
    event.preventDefault()
    markUser()
    window.clearTimeout(dragTimer.current)
    setDragging(false)
    take(event.dataTransfer.files)
  }

  const handleClick = () => {
    markUser()
    if (state.phase !== 'upload') inputRef.current?.click()
  }

  const handlePick = (event: ChangeEvent<HTMLInputElement>) => {
    markUser()
    take(event.target.files)
    // so picking the same file again still counts as a change
    event.target.value = ''
  }

  return {
    state,
    values: drop.values,
    chip: drop.chip,
    inputRef,
    handlers: {
      onClick: handleClick,
      onPointerDown: drop.press,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    handlePick,
  }
}
