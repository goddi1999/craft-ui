import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { CodeBlock } from '../code-block/CodeBlock'
import { DemoCopyPath } from './DemoCopyPath'
import type { DemoDocsProps } from './demo-docs.types'

/** Neutral so the snippet never competes with the component above it. */
const CODE_ACCENT = '#71717a'

function DocsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

/**
 * shadcn-style docs under every demo: where the files live, how to use the
 * component with the settings above, and its props.
 */
export function DemoDocs({ paths, usage, props, className }: DemoDocsProps) {
  return (
    <div data-slot="demo-docs" className={cn('flex flex-col gap-12', className)}>
      <DocsSection
        title="Installation"
        description="Copy this folder into your project. It is self-contained — no extra package to install."
      >
        <div className="flex flex-col gap-2">
          {paths.map((path) => (
            <DemoCopyPath key={path} path={path} />
          ))}
        </div>
      </DocsSection>

      <DocsSection
        title="Usage"
        description="Follows the settings above — only props you changed from their defaults are written out."
      >
        <CodeBlock
          code={usage}
          language="tsx"
          filename="Example.tsx"
          accent={CODE_ACCENT}
          showLineNumbers={false}
        />
      </DocsSection>

      <DocsSection
        title="API reference"
        description="Every prop you can change, its type and its default."
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Prop</TableHead>
                <TableHead className="px-4">Type</TableHead>
                <TableHead className="px-4">Default</TableHead>
                <TableHead className="px-4">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((prop) => (
                <TableRow key={prop.name}>
                  <TableCell className="px-4 align-top">
                    <code className="font-mono text-[13px] font-medium">
                      {prop.name}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-56 px-4 align-top whitespace-normal">
                    <code className="font-mono text-[13px] break-words text-muted-foreground">
                      {prop.type}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 align-top">
                    <code className="font-mono text-[13px] text-muted-foreground">
                      {prop.default ?? '—'}
                    </code>
                  </TableCell>
                  <TableCell className="min-w-64 px-4 align-top whitespace-normal text-muted-foreground">
                    {prop.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DocsSection>
    </div>
  )
}
