// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { AtSign, FileText, LoaderCircle, Paperclip, Repeat } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useId, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '../button'
import { Kbd } from '../kbd'
import { Segmented } from '../segmented-control'
import { Panel, Shell } from '../surface'

import { RemoveButton } from './agent-composer-parts'
import { ENTER, FOLD, MODES, POP, PRESS_TRANSITION } from './agent-composer.constants'
import type {
  AgentComposerProps,
  ComposerMenuItem,
} from './agent-composer.types'
import { formatTokens } from './agent-composer.utils'

import { cn } from '@/lib/utils'

/** Controlled when `value` is passed, otherwise keeps its own state. */
function useControllable<T>(
  value: T | undefined,
  onChange: ((v: T) => void) | undefined,
  initial: T,
) {
  const [inner, setInner] = useState(initial)
  const set = (next: T) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  return [value ?? inner, set] as const
}

export function AgentComposer({
  value: valueProp,
  onValueChange,
  mode: modeProp,
  onModeChange,
  showModes = true,
  context: contextProp,
  onContextChange,
  files = [],
  commands = [],
  models = [],
  model: modelProp,
  onModelChange,
  status = 'idle',
  queue: queueProp,
  onQueueChange,
  onSubmit,
  onStop,
  allowAttachments = true,
  placeholder = 'Describe the change, @ to add files, / for commands',
  className,
}: AgentComposerProps) {
  const id = useId()
  const textarea = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const seq = useRef(0)
  const [value, setValue] = useControllable(valueProp, onValueChange, '')
  const [mode, setMode] = useControllable(modeProp, onModeChange, 'act')
  const [context, setContext] = useControllable(contextProp, onContextChange, [])
  const [queue, setQueue] = useControllable(queueProp, onQueueChange, [])
  const [model, setModel] = useControllable(
    modelProp,
    onModelChange,
    models[0]?.id ?? '',
  )
  const [active, setActive] = useState(0)
  const [dismissed, setDismissed] = useState<string | null>(null)
  const streaming = status === 'streaming'

  // One menu at a time: "/word" as the whole input, or "@word" at the end of it.
  const slash = /^\/(\S*)$/.exec(value)?.[1]
  const mention = /(?:^|\s)@(\S*)$/.exec(value)?.[1]
  const items: ComposerMenuItem[] =
    slash !== undefined
      ? commands
          .filter((c) => c.name.includes(slash.toLowerCase()))
          .map((c) => ({
            key: c.name,
            label: `/${c.name}`,
            detail: c.description,
            run: () => setValue(`/${c.name} `),
          }))
      : mention !== undefined
        ? files
            .filter(
              (f) =>
                f.path.toLowerCase().includes(mention.toLowerCase()) &&
                !context.some((c) => c.id === f.id),
            )
            .slice(0, 6)
            .map((f) => ({
              key: f.id,
              label: f.path,
              detail: `${formatTokens(f.tokens)} tokens`,
              run: () => {
                setValue(value.replace(/@\S*$/, ''))
                setContext([...context, { id: f.id, name: f.path, tokens: f.tokens }])
              },
            }))
        : []
  const menuOpen = items.length > 0 && dismissed !== value
  const activeIndex = Math.min(active, items.length - 1)

  useLayoutEffect(() => {
    const el = textarea.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [value])

  const canSend = value.trim().length > 0
  const submit = () => {
    if (!canSend) return
    if (streaming)
      setQueue([...queue, { id: `${id}-q${++seq.current}`, text: value.trim() }])
    else {
      onSubmit?.({ text: value.trim(), mode: showModes ? mode : 'act', context, model })
      setContext([])
    }
    setValue('')
  }
  const pick = (item: ComposerMenuItem) => {
    item.run()
    setActive(0)
    textarea.current?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (menuOpen) {
      const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
      if (step) {
        event.preventDefault()
        setActive((activeIndex + step + items.length) % items.length)
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        pick(items[activeIndex])
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setDismissed(value)
        return
      }
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  const total = context.reduce((n, c) => n + c.tokens, 0)
  const current = MODES.find((m) => m.id === mode) ?? MODES[2]
  const currentModel = models.find((m) => m.id === model)
  const showTray = allowAttachments || context.length > 0

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="agent-composer" className={cn('relative max-w-xl', className)}>
        {/* Opened by typing / or @, so it appears instantly: keyboard actions never animate. */}
        {menuOpen && (
          <ul
            id={`${id}-menu`}
            role="listbox"
            aria-label={slash !== undefined ? 'Commands' : 'Files'}
            className="absolute inset-x-0 bottom-full z-10 mb-2 rounded-[1.375rem] bg-popover p-1.5 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          >
            {items.map((item, i) => (
              <li
                key={item.key}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(item)}
                onMouseMove={() => setActive(i)}
                className="flex cursor-pointer items-baseline gap-3 rounded-xl px-3 py-2 text-[0.8125rem] aria-selected:bg-foreground/[0.07]"
              >
                <span className="truncate font-mono">{item.label}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>
        )}
        {(showModes || models.length > 0) && (
          <div className="flex items-center gap-3 px-1 pt-0.5 pb-2">
            {showModes && (
              <Segmented
                label="Mode"
                className="h-7 shrink-0"
                options={MODES.map((m) => ({ value: m.id, label: m.label }))}
                value={mode}
                onValueChange={setMode}
              />
            )}
            {showModes && (
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={ENTER}
                className="hidden min-w-0 truncate text-xs text-muted-foreground @md:block"
              >
                {current.hint}
              </motion.p>
            )}
            {currentModel && (
              <button
                type="button"
                title={`${currentModel.name}${currentModel.description ? ` — ${currentModel.description}` : ''}`}
                aria-label={`Model: ${currentModel.name}. Switch model`}
                onClick={() =>
                  setModel(models[(models.indexOf(currentModel) + 1) % models.length].id)
                }
                className={cn(
                  'ml-auto flex shrink-0 items-center gap-1 rounded-md px-1.5 font-mono text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  PRESS_TRANSITION,
                )}
              >
                {currentModel.id}
                <Repeat fill="currentColor" className="size-3" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <AnimatePresence initial={false}>
          {queue.length > 0 && (
            <motion.div {...FOLD} className="overflow-hidden">
              <p className="px-2.5 pb-1 text-xs text-muted-foreground">
                Queued · {queue.length}
              </p>
              <ol aria-label="Queued messages" className="mb-1.5 space-y-1">
                <AnimatePresence initial={false}>
                  {queue.map((q) => (
                    <motion.li
                      key={q.id}
                      layout
                      {...POP}
                      className="flex items-center gap-2 rounded-xl bg-foreground/[0.04] py-1.5 pr-1 pl-3 text-[0.8125rem]"
                    >
                      <span className="min-w-0 flex-1 truncate">{q.text}</span>
                      <RemoveButton
                        label={`Remove queued message: ${q.text}`}
                        onClick={() => setQueue(queue.filter((x) => x.id !== q.id))}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
        <Panel className="relative">
          {showTray && (
            <ul
              aria-label="Context"
              className="flex flex-wrap items-center gap-1.5 px-3 pt-3"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {context.map((c) => (
                  <motion.li
                    key={c.id}
                    layout
                    {...POP}
                    className="flex h-7 items-center gap-1.5 rounded-lg bg-foreground/[0.05] pr-0.5 pl-2 text-xs"
                  >
                    <FileText
                      fill="currentColor"
                      fillOpacity={0.25}
                      className="size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="max-w-44 truncate font-mono">{c.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatTokens(c.tokens)}
                    </span>
                    <RemoveButton
                      label={`Remove ${c.name}`}
                      onClick={() => setContext(context.filter((x) => x.id !== c.id))}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
              {allowAttachments && (
                <li>
                  <input
                    ref={fileInput}
                    type="file"
                    multiple
                    hidden
                    onChange={(event) => {
                      const added = Array.from(event.target.files ?? []).map((f) => ({
                        id: `${f.name}-${f.size}-${f.lastModified}`,
                        name: f.name,
                        tokens: Math.ceil(f.size / 4), // rough estimate: ~4 bytes per token
                      }))
                      setContext([...context, ...added])
                      event.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs text-muted-foreground outline-none hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
                      PRESS_TRANSITION,
                    )}
                  >
                    <Paperclip fill="currentColor" fillOpacity={0.25} className="size-3.5" aria-hidden="true" />
                    {context.length ? 'Add' : 'Add context'}
                  </button>
                </li>
              )}
              {total > 0 && (
                <li className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                  + {formatTokens(total)} tokens
                </li>
              )}
            </ul>
          )}
          <label htmlFor={`${id}-input`} className="sr-only">
            Message
          </label>
          <textarea
            ref={textarea}
            id={`${id}-input`}
            data-slot="agent-composer-input"
            rows={1}
            value={value}
            placeholder={
              streaming ? 'Add a follow-up — it runs when the agent is done' : placeholder
            }
            onChange={(event) => {
              setValue(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={menuOpen}
            aria-controls={`${id}-menu`}
            aria-activedescendant={menuOpen ? `${id}-opt-${activeIndex}` : undefined}
            className="block max-h-[180px] min-h-16 w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-2 px-2 pb-2 pl-4">
            <p className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs text-muted-foreground">
              {streaming ? (
                <>
                  <LoaderCircle
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="size-3.5 shrink-0 animate-spin text-primary motion-reduce:animate-none"
                  />
                  Working · new messages queue
                </>
              ) : (
                <>
                  <AtSign strokeWidth={2.5} className="size-3 shrink-0" aria-hidden="true" />{' '}
                  files · / commands
                </>
              )}
            </p>
            {streaming && (
              <Button
                type="button"
                variant="ghost"
                onClick={onStop}
                className="px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Stop
              </Button>
            )}
            <Button
              type="button"
              variant={!streaming && (mode === 'act' || !showModes) ? 'default' : 'secondary'}
              disabled={!canSend}
              onClick={submit}
              className={cn(
                'gap-2',
                !streaming &&
                  mode !== 'act' &&
                  showModes &&
                  'bg-foreground text-background hover:bg-foreground/90',
              )}
            >
              {streaming ? 'Queue' : 'Send'}
              <Kbd aria-hidden="true" className="bg-current/15 text-current opacity-80">
                ↵
              </Kbd>
            </Button>
          </div>
        </Panel>
        <p role="status" aria-live="polite" className="sr-only">
          {streaming
            ? `Agent is working${queue.length ? `, ${queue.length} queued` : ''}`
            : ''}
        </p>
      </Shell>
    </MotionConfig>
  )
}
