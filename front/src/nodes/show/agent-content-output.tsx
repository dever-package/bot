import { streamValueText as valueText } from '@/lib/stream'
import { isPlainRecord as isPlainObject } from '@/lib/runtime-stream-output'
import {
  EnergonContentView,
  type EnergonOutput,
} from '@/components/energon/content-view'

export function AgentContentOutputView({
  output,
  streaming = false,
  emptyText = '等待智能体返回。',
}: {
  output: unknown
  streaming?: boolean
  emptyText?: string
}) {
  const markdown = agentMarkdownText(output)
  if (markdown) {
    return <AgentMarkdownView text={markdown} />
  }
  return (
    <EnergonContentView
      output={output as EnergonOutput}
      streaming={streaming}
      emptyText={emptyText}
    />
  )
}

export function readableAssistantText(value: unknown) {
  const text = valueText(value).trim()
  if (!text || isProtocolDraftText(text) || text.includes('```')) {
    return text
  }
  if (hasReadableTextStructure(text)) {
    return text
  }
  return structureCompactAssistantText(text)
}

function AgentMarkdownView({ text }: { text: string }) {
  const blocks = markdownBlocks(text)
  if (blocks.length === 0) {
    return null
  }
  return (
    <div className='space-y-3 text-sm leading-6 text-foreground'>
      {blocks.map((block, index) => (
        <AgentMarkdownBlock
          key={`${block.type}-${index}-${block.text.slice(0, 20)}`}
          block={block}
        />
      ))}
    </div>
  )
}

type AgentMarkdownBlockData = {
  type: 'heading' | 'paragraph' | 'bullet' | 'ordered' | 'table'
  level?: number
  order?: string
  text: string
  header?: string[]
  rows?: string[][]
}

function AgentMarkdownBlock({ block }: { block: AgentMarkdownBlockData }) {
  if (block.type === 'heading') {
    const className =
      block.level === 1
        ? 'text-base font-semibold'
        : 'text-sm font-semibold text-foreground'
    return <div className={className}>{inlineMarkdown(block.text)}</div>
  }
  if (block.type === 'bullet') {
    return (
      <div className='flex gap-2'>
        <span className='mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-primary/60' />
        <div className='min-w-0 flex-1'>{inlineMarkdown(block.text)}</div>
      </div>
    )
  }
  if (block.type === 'ordered') {
    return (
      <div className='flex gap-2'>
        <span className='min-w-5 shrink-0 font-medium text-muted-foreground'>
          {block.order}.
        </span>
        <div className='min-w-0 flex-1'>{inlineMarkdown(block.text)}</div>
      </div>
    )
  }
  if (block.type === 'table') {
    return <AgentMarkdownTable block={block} />
  }
  return <p>{inlineMarkdown(block.text)}</p>
}

function AgentMarkdownTable({ block }: { block: AgentMarkdownBlockData }) {
  const header = block.header || []
  const rows = block.rows || []
  if (header.length === 0 && rows.length === 0) {
    return null
  }
  return (
    <div className='overflow-x-auto rounded-md border bg-background/70'>
      <table className='w-full min-w-max border-collapse text-left text-xs'>
        {header.length > 0 ? (
          <thead className='bg-muted/70'>
            <tr>
              {header.map((cell, index) => (
                <th
                  key={`${cell}-${index}`}
                  className='border-b px-2.5 py-1.5 font-medium'
                >
                  {inlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='border-b last:border-0'>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className='px-2.5 py-1.5'>
                  {inlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function agentMarkdownText(output: unknown) {
  if (Array.isArray(output)) {
    if (output.length !== 1) {
      return ''
    }
    return agentMarkdownText(output[0])
  }
  if (!isPlainObject(output)) {
    return typeof output === 'string' ? readableAssistantText(output) : ''
  }
  const content = isPlainObject(output.content) ? output.content : null
  const format = valueText(content?.format || output.format).toLowerCase()
  const text = valueText(content?.text || output.text).trim()
  if (!text) {
    return ''
  }
  return format === 'markdown' || looksLikeMarkdown(text)
    ? readableAssistantText(text)
    : ''
}

function looksLikeMarkdown(text: string) {
  return /(^|\n)(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(text)
}

function markdownBlocks(text: string): AgentMarkdownBlockData[] {
  const lines = readableAssistantText(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
  const blocks: AgentMarkdownBlockData[] = []
  for (let index = 0; index < lines.length; index += 1) {
    if (isMarkdownTableStart(lines, index)) {
      const [table, nextIndex] = markdownTableBlock(lines, index)
      blocks.push(table)
      index = nextIndex - 1
      continue
    }
    const block = markdownBlock(lines[index])
    if (block) {
      blocks.push(block)
    }
  }
  return blocks
}

function markdownBlock(line: string): AgentMarkdownBlockData | null {
  if (!line) {
    return null
  }
  const heading = line.match(/^(#{1,6})\s+(.+)$/)
  if (heading) {
    return {
      type: 'heading',
      level: heading[1].length,
      text: heading[2].trim(),
    }
  }
  const ordered = line.match(/^(\d{1,2})\.\s+(.+)$/)
  if (ordered) {
    return {
      type: 'ordered',
      order: ordered[1],
      text: ordered[2].trim(),
    }
  }
  const bullet = line.match(/^[-*]\s+(.+)$/)
  if (bullet) {
    return {
      type: 'bullet',
      text: bullet[1].trim(),
    }
  }
  return {
    type: 'paragraph',
    text: line,
  }
}

function isMarkdownTableStart(lines: string[], index: number) {
  return (
    isMarkdownTableRow(lines[index]) &&
    index + 1 < lines.length &&
    isMarkdownTableSeparator(lines[index + 1])
  )
}

function markdownTableBlock(
  lines: string[],
  start: number
): [AgentMarkdownBlockData, number] {
  const header = markdownTableCells(lines[start])
  const rows: string[][] = []
  let index = start + 2
  while (index < lines.length && isMarkdownTableRow(lines[index])) {
    if (!isMarkdownTableSeparator(lines[index])) {
      rows.push(markdownTableCells(lines[index]))
    }
    index += 1
  }
  return [
    {
      type: 'table',
      text: '',
      header,
      rows,
    },
    index,
  ]
}

function isMarkdownTableRow(line: string) {
  return line.includes('|') && markdownTableCells(line).length >= 2
}

function isMarkdownTableSeparator(line: string) {
  const cells = markdownTableCells(line)
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

function markdownTableCells(line: string) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    const strong = part.match(/^\*\*([^*]+)\*\*$/)
    if (strong) {
      return <strong key={index}>{strong[1]}</strong>
    }
    return <span key={index}>{part}</span>
  })
}

function isProtocolDraftText(value: unknown) {
  const text = valueText(value).trim()
  if (!text) {
    return false
  }
  if (
    text.includes('```agent-interaction') ||
    text.includes('```agent-action') ||
    text.includes('```agent-result') ||
    text.includes('```agent-output')
  ) {
    return true
  }
  return false
}

function hasReadableTextStructure(text: string) {
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length >= 3) {
    return true
  }
  return lines.some((line) =>
    /^(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(line)
  )
}

function structureCompactAssistantText(text: string) {
  let result = text.replace(/[ \t]+/g, ' ')
  result = result.replace(/([：:。！？!?；;])(?=\d{1,2}\.[^\d\s])/g, '$1\n\n')
  result = result.replace(
    /([^\n])(\d{1,2})\.([^\s\d])/g,
    (_match, prefix: string, index: string, next: string) =>
      `${prefix}\n\n${index}. ${next}`
  )
  result = result.replace(
    /(^|\n)(\d{1,2})\.\s*([^\n-]{2,42})\s*-\s*/g,
    (_match, prefix: string, index: string, title: string) =>
      `${prefix}${index}. ${title.trim()}\n- `
  )
  result = result.replace(/(^|\n)(\d{1,2})\.([^\s])/g, '$1$2. $3')
  result = result.replace(/([：:。！？!?；;])\s*-\s*/g, '$1\n- ')
  result = result.replace(/\n-\s*/g, '\n- ')
  result = result.replace(/\n{3,}/g, '\n\n')
  return result.trim()
}
