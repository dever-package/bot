export const AGENT_CHAT_DOCUMENT_HEADING_SELECTOR =
  "[data-agent-document-heading='true']";

export function findAgentChatDocumentHeading(content: ParentNode, id: string) {
  if (!id) {
    return null;
  }
  return (
    Array.from(
      content.querySelectorAll<HTMLElement>(
        AGENT_CHAT_DOCUMENT_HEADING_SELECTOR,
      ),
    ).find((heading) => heading.id === id) || null
  );
}
