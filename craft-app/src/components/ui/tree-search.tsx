'use client'

import * as React from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { ArrowLeft, ArrowUp, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { BlurredScrollArea } from '@/components/ui/blurred-scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

type TreeSearchNode = {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  children: TreeSearchNode[]
  content?: React.ReactNode
  action?: React.ReactNode
}

type TreeSearchContextValue = {
  query: string
  setQuery: (value: string) => void
  submittedQuery: string
  submitted: boolean
  isLoading: boolean
  submit: () => void
  goBack: () => void
  path: TreeSearchNode[]
  activeItemId: string | null
  items: TreeSearchNode[]
  height: string
  clickedIndexRef: React.MutableRefObject<number | null>
  handleSelectItem: (item: TreeSearchNode, index: number) => void
  onSelect?: (item: TreeSearchNode) => void
}

const TreeSearchContext = React.createContext<TreeSearchContextValue | null>(null)

function useTreeSearch() {
  const context = React.useContext(TreeSearchContext)

  if (!context) {
    throw new Error('TreeSearch components must be used within <TreeSearch>.')
  }

  return context
}

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: {},
}

function isTreeSearchItemElement(
  child: React.ReactNode,
): child is React.ReactElement<TreeSearchItemProps> {
  return React.isValidElement(child) && child.type === TreeSearchItem
}

function isTreeSearchContentElement(
  child: React.ReactNode,
): child is React.ReactElement<TreeSearchContentProps> {
  return React.isValidElement(child) && child.type === TreeSearchContent
}

function isTreeSearchActionElement(
  child: React.ReactNode,
): child is React.ReactElement<TreeSearchActionProps> {
  return React.isValidElement(child) && child.type === TreeSearchAction
}

function parseTreeSearchItems(children: React.ReactNode): TreeSearchNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!isTreeSearchItemElement(child)) return []

    const itemChildren = React.Children.toArray(child.props.children)
    const contentChild = itemChildren.find(isTreeSearchContentElement)
    const actionChild = itemChildren.find(isTreeSearchActionElement)
    const nestedItems = itemChildren.filter(isTreeSearchItemElement)

    return [
      {
        id: child.props.id,
        label: child.props.label,
        description: child.props.description,
        icon: child.props.icon,
        children: parseTreeSearchItems(nestedItems),
        content: contentChild?.props.children,
        action: actionChild?.props.children,
      },
    ]
  })
}

function findTreeSearchResultsChild(children: React.ReactNode) {
  return React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TreeSearchResults,
  ) as React.ReactElement<TreeSearchResultsProps> | undefined
}

interface TreeSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'onSelect'> {
  children: React.ReactNode
  defaultQuery?: string
  query?: string
  onQueryChange?: (value: string) => void
  defaultSubmitted?: boolean
  submitted?: boolean
  onSubmittedChange?: (submitted: boolean) => void
  onSubmit?: (query: string) => void
  onSelect?: (item: TreeSearchNode) => void
  height?: string
  /** When set, loading state is controlled by the parent (e.g. real async search). */
  isLoading?: boolean
  loadingDuration?: number
}

function TreeSearch({
  children,
  className,
  defaultQuery = '',
  query: queryProp,
  onQueryChange,
  defaultSubmitted = false,
  submitted: submittedProp,
  onSubmittedChange,
  onSubmit,
  onSelect,
  height = '24rem',
  isLoading: isLoadingProp,
  loadingDuration = 900,
  ...props
}: TreeSearchProps) {
  const isLoadingControlled = isLoadingProp !== undefined
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery)
  const [uncontrolledSubmitted, setUncontrolledSubmitted] = React.useState(defaultSubmitted)
  const [submittedQuery, setSubmittedQuery] = React.useState('')
  const [internalLoading, setInternalLoading] = React.useState(false)
  const [path, setPath] = React.useState<TreeSearchNode[]>([])
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null)
  const clickedIndexRef = React.useRef<number | null>(null)

  const query = queryProp ?? uncontrolledQuery
  const submitted = submittedProp ?? uncontrolledSubmitted
  const isLoading = isLoadingControlled ? Boolean(isLoadingProp) : internalLoading

  const setQuery = React.useCallback(
    (value: string) => {
      if (queryProp === undefined) {
        setUncontrolledQuery(value)
      }
      onQueryChange?.(value)
    },
    [onQueryChange, queryProp],
  )

  const setSubmitted = React.useCallback(
    (value: boolean) => {
      if (submittedProp === undefined) {
        setUncontrolledSubmitted(value)
      }
      onSubmittedChange?.(value)
    },
    [onSubmittedChange, submittedProp],
  )

  const resultsChild = findTreeSearchResultsChild(children)
  const items = React.useMemo(
    () => parseTreeSearchItems(resultsChild?.props.children),
    [resultsChild?.props.children],
  )

  const submit = React.useCallback(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    clickedIndexRef.current = null
    setPath([])
    setActiveItemId(null)
    setSubmittedQuery(trimmed)
    setQuery('')
    if (!isLoadingControlled) {
      setInternalLoading(true)
    }
    setSubmitted(true)
    onSubmit?.(trimmed)
  }, [isLoadingControlled, onSubmit, query, setQuery, setSubmitted])

  React.useEffect(() => {
    if (isLoadingControlled || !internalLoading) return

    const timeout = window.setTimeout(() => {
      setInternalLoading(false)
    }, loadingDuration)

    return () => window.clearTimeout(timeout)
  }, [internalLoading, isLoadingControlled, loadingDuration, submittedQuery])

  const goBack = React.useCallback(() => {
    clickedIndexRef.current = null

    if (path.length > 0) {
      setPath((prev) => prev.slice(0, -1))
      setActiveItemId(null)
      return
    }

    setSubmitted(false)
    setActiveItemId(null)
    setSubmittedQuery('')
    if (!isLoadingControlled) {
      setInternalLoading(false)
    }
  }, [isLoadingControlled, path.length, setSubmitted])

  const handleSelectItem = React.useCallback(
    (item: TreeSearchNode, index: number) => {
      const hasChildren = item.children.length > 0
      const hasContent = item.content != null

      if (hasChildren || hasContent) {
        clickedIndexRef.current = index
        setPath((prev) => [...prev, item])
        setActiveItemId(null)
        return
      }

      setActiveItemId(item.id)
      onSelect?.(item)
    },
    [onSelect],
  )

  const contextValue = React.useMemo<TreeSearchContextValue>(
    () => ({
      query,
      setQuery,
      submittedQuery,
      submitted,
      isLoading,
      submit,
      goBack,
      path,
      activeItemId,
      items,
      height,
      clickedIndexRef,
      handleSelectItem,
      onSelect,
    }),
    [
      query,
      setQuery,
      submittedQuery,
      submitted,
      isLoading,
      submit,
      goBack,
      path,
      activeItemId,
      items,
      height,
      handleSelectItem,
      onSelect,
    ],
  )

  return (
    <TreeSearchContext.Provider value={contextValue}>
      <div
        data-slot="tree-search"
        className={cn('flex w-full flex-col gap-8', className)}
        {...props}
      >
        {children}
      </div>
    </TreeSearchContext.Provider>
  )
}

interface TreeSearchInputProps {
  placeholder?: string
  /** Visually hidden label for screen readers. */
  label?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
  buttonClassName?: string
}

function TreeSearchInput({
  placeholder = 'Ask about pricing',
  label = 'Search',
  className,
  inputClassName,
  disabled = false,
  buttonClassName,
}: TreeSearchInputProps) {
  const { query, setQuery, submit } = useTreeSearch()
  const inputId = React.useId()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  return (
    <form
      data-slot="tree-search-input"
      onSubmit={handleSubmit}
      className={cn('w-full', className)}
    >
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        {label}
      </label>

      <div className="flex items-end gap-4 border-b-[0.5px] border-foreground/70 pb-3">
        <input
          id={inputId}
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-3xl leading-tight font-normal tracking-tight text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-4xl',
            inputClassName,
          )}
        />

        <button
          type="submit"
          disabled={disabled || !query.trim()}
          aria-label="Search"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.8] disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100',
            buttonClassName,
          )}
        >
          <ArrowUp
            className="size-4"
            strokeWidth={2.25}
          />
        </button>
      </div>
    </form>
  )
}

interface TreeSearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  height?: string
  searchLabel?: string
  summaryLabel?: string
  /** Shown at the root results level when the search finished with zero items. */
  empty?: React.ReactNode
}

function TreeSearchSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  )
}

function TreeSearchSummarySkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded-sm bg-foreground/10" />
        <Skeleton className="h-3.5 w-[96%] rounded-sm bg-foreground/10" />
        <Skeleton className="h-3.5 w-[88%] rounded-sm bg-foreground/10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded-sm bg-foreground/10" />
        <Skeleton className="h-3.5 w-[92%] rounded-sm bg-foreground/10" />
        <Skeleton className="h-3.5 w-[76%] rounded-sm bg-foreground/10" />
      </div>
    </div>
  )
}

function TreeSearchResultIcon({ icon }: { icon?: React.ReactNode }) {
  return (
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground">
      {icon ?? (
        <FileText
          className="size-4"
          strokeWidth={1.75}
        />
      )}
    </span>
  )
}

function TreeSearchNestedItems({
  items,
  onSelect,
}: {
  items: TreeSearchNode[]
  onSelect: (item: TreeSearchNode, index: number) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="relative mt-2 ml-2.5 border-l border-foreground/25 pl-4">
      <ul className="space-y-2">
        {items.map((child, index) => (
          <li key={child.id}>
            <button
              type="button"
              onClick={() => onSelect(child, index)}
              className="group w-full text-left"
            >
              <span className="block text-sm leading-snug text-foreground/90 transition-colors group-hover:text-foreground">
                {child.label}
              </span>
              {child.description ? (
                <span className="mt-0.5 block text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                  {child.description}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TreeSearchResults({
  className,
  height: heightProp,
  searchLabel = 'Your search',
  summaryLabel = 'Summary',
  empty,
  ...props
}: TreeSearchResultsProps) {
  const {
    submitted,
    submittedQuery,
    isLoading,
    goBack,
    path,
    activeItemId,
    items,
    height,
    clickedIndexRef,
    handleSelectItem,
  } = useTreeSearch()

  const resolvedHeight = heightProp ?? height
  const currentParent = path[path.length - 1]
  const currentContent = currentParent?.content
  const currentAction = currentParent?.action
  const currentItems = currentParent ? currentParent.children : items
  const listKey = currentParent?.id ?? 'root'
  const isContentView = currentContent != null
  const showInlineChildren = path.length === 0

  const itemVariants: Variants = React.useMemo(
    () => ({
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      exit: (index: number) => {
        const clickedIndex = clickedIndexRef.current
        if (clickedIndex === null) {
          return { opacity: 0, y: -10, transition: { duration: 0.2 } }
        }
        if (index === clickedIndex) {
          return { opacity: 0, transition: { duration: 0.2 } }
        }
        return {
          opacity: 0,
          y: index < clickedIndex ? -100 : 100,
          transition: { duration: 0.3, ease: 'easeOut' },
        }
      },
    }),
    [clickedIndexRef],
  )

  if (!submitted) {
    return null
  }

  const searchHeader = (
    <section className="shrink-0 space-y-3 pb-6">
      <TreeSearchSectionLabel>{searchLabel}</TreeSearchSectionLabel>
      <h2 className="text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl">
        {submittedQuery}
      </h2>
    </section>
  )

  const listResultsBody = (
    <AnimatePresence mode="wait">
      <motion.section
        key={`${listKey}-${submittedQuery}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        className="space-y-4"
      >
        <TreeSearchSectionLabel>{summaryLabel}</TreeSearchSectionLabel>

        {isLoading ? (
          <TreeSearchSummarySkeleton />
        ) : currentItems.length === 0 && empty ? (
          empty
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col gap-6"
          >
            {currentItems.map((item, index) => {
              const hasChildren = item.children.length > 0
              const hasContent = item.content != null
              const isNavigable = hasChildren || hasContent
              const isActive = activeItemId === item.id

              return (
                <motion.li
                  key={item.id}
                  custom={index}
                  variants={itemVariants}
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectItem(item, index)}
                    aria-current={isActive || undefined}
                    className={cn(
                      'group flex w-full items-start gap-3 text-left transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100',
                    )}
                  >
                    <TreeSearchResultIcon icon={item.icon} />
                    <span className="min-w-0 flex-1">
                      <motion.span
                        layoutId={isNavigable ? `tree-search-label-${item.id}` : undefined}
                        className="block text-sm leading-relaxed font-normal text-foreground sm:text-base"
                      >
                        {item.label}
                      </motion.span>
                      {item.description ? (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </button>

                  {showInlineChildren && hasChildren ? (
                    <TreeSearchNestedItems
                      items={item.children}
                      onSelect={(child, childIndex) => handleSelectItem(child, childIndex)}
                    />
                  ) : null}
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </motion.section>
    </AnimatePresence>
  )

  const usesFlexHeight = resolvedHeight === '100%'

  return (
    <div
      data-slot="tree-search-results"
      className={cn('flex w-full min-h-0 flex-col', className)}
      style={usesFlexHeight ? undefined : { height: resolvedHeight }}
      {...props}
    >
      {path.length > 0 ? (
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="mb-5 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeft
            className="size-4"
            strokeWidth={1.75}
          />
        </button>
      ) : null}

      <div className={cn('flex min-h-0 flex-1 flex-col', path.length > 0 && 'h-[calc(100%-3rem)]')}>
        {isContentView ? (
          <>
            {searchHeader}

            <AnimatePresence mode="wait">
              <motion.section
                key={`${listKey}-${submittedQuery}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                className="flex flex-col gap-4"
              >
                <TreeSearchSectionLabel>{summaryLabel}</TreeSearchSectionLabel>

                {currentParent ? (
                  <motion.h3
                    layoutId={`tree-search-label-${currentParent.id}`}
                    className="shrink-0 text-sm leading-relaxed font-normal text-foreground sm:text-base"
                  >
                    {currentParent.label}
                  </motion.h3>
                ) : null}

                <BlurredScrollArea
                  className="h-80 w-full shrink-0"
                  viewportClassName="pr-1 [&>div]:!block [&>div]:min-h-0"
                  hideScrollBar
                >
                  <div className="w-full text-sm leading-relaxed text-foreground/90">
                    {currentContent}
                  </div>
                </BlurredScrollArea>

                {currentAction ? <div className="shrink-0 pt-2">{currentAction}</div> : null}
              </motion.section>
            </AnimatePresence>
          </>
        ) : (
          <>
            {searchHeader}
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
              <BlurredScrollArea
                className="flex h-full min-h-0 w-full flex-1 flex-col"
                viewportClassName="min-h-0 max-h-full flex-1 basis-0 pr-1 [&>div]:!block [&>div]:min-h-0"
                hideScrollBar
              >
                <div className="pb-8">{listResultsBody}</div>
              </BlurredScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface TreeSearchItemProps {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Declarative marker. Its props are read off the element by
 * `parseTreeSearchItems` and it never renders, so the parameter is required by
 * the JSX API but unused in the body.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TreeSearchItem(_props: TreeSearchItemProps) {
  return null
}

interface TreeSearchContentProps {
  children: React.ReactNode
}

/** Declarative marker for an item's drill-in pane. Same contract as TreeSearchItem. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TreeSearchContent(_props: TreeSearchContentProps) {
  return null
}

interface TreeSearchActionProps {
  children: React.ReactNode
}

/** Pinned below the drill-in scroll body so scroll fades never cover it. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TreeSearchAction(_props: TreeSearchActionProps) {
  return null
}

export {
  TreeSearch,
  TreeSearchInput,
  TreeSearchResults,
  TreeSearchItem,
  TreeSearchContent,
  TreeSearchAction,
  // The hook is how children read tree state; moving it to its own file would break
  // the compound-component shape this file is built around.
  // eslint-disable-next-line react-refresh/only-export-components
  useTreeSearch,
}
export type {
  TreeSearchProps,
  TreeSearchInputProps,
  TreeSearchResultsProps,
  TreeSearchItemProps,
  TreeSearchContentProps,
  TreeSearchActionProps,
  TreeSearchNode,
}
