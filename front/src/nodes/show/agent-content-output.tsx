import { streamValueText as valueText } from '@/lib/stream'
import { EnergonContentView } from '@/components/energon/content-view'

export function AgentContentOutputView({
  output,
  streaming = false,
  emptyText = '等待智能体返回。',
}: {
  output: unknown
  streaming?: boolean
  emptyText?: string
}) {
  return (
    <EnergonContentView
      output={output}
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
