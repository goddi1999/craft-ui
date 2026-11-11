export type ComposerMode = 'ask' | 'plan' | 'act'
export type ComposerContextItem = { id: string; name: string; tokens: number }
export type ComposerFile = { id: string; path: string; tokens: number }
export type ComposerModel = { id: string; name: string; description?: string }
export type ComposerCommand = { name: string; description: string }
export type ComposerQueued = { id: string; text: string }
export type ComposerMessage = {
  text: string
  mode: ComposerMode
  context: ComposerContextItem[]
  model?: string
}

export type AgentComposerProps = {
  value?: string
  onValueChange?: (value: string) => void
  mode?: ComposerMode
  onModeChange?: (mode: ComposerMode) => void
  /** Hide the Ask / Plan / Act switch with `showModes={false}`. */
  showModes?: boolean
  /** Files and attachments sent with the message, shown in the context tray. */
  context?: ComposerContextItem[]
  onContextChange?: (context: ComposerContextItem[]) => void
  /** Candidates for the @ mention menu. */
  files?: ComposerFile[]
  commands?: ComposerCommand[]
  models?: ComposerModel[]
  model?: string
  onModelChange?: (model: string) => void
  status?: 'idle' | 'streaming'
  /** Messages sent while the agent works. Pop the next one when a run ends. */
  queue?: ComposerQueued[]
  onQueueChange?: (queue: ComposerQueued[]) => void
  onSubmit?: (message: ComposerMessage) => void
  onStop?: () => void
  allowAttachments?: boolean
  placeholder?: string
  className?: string
}

export type ComposerMenuItem = {
  key: string
  label: string
  detail: string
  run: () => void
}
