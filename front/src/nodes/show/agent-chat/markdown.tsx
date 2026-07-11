import { memo, type ComponentProps } from "react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownComponents = NonNullable<
  ComponentProps<typeof MarkdownTextPrimitive>["components"]
>;

const markdownComponents: MarkdownComponents = {
  a({ children, node, ...props }) {
    void node;
    return (
      <a {...props} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

const markdownPlugins = [remarkGfm];

function normalizeMarkdownSource(value: unknown) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(
      /(^|\n)([ \t\u00a0\u3000]{0,3})(#{1,6})(?!#)([ \t\u00a0\u3000]*)(?=\S)/g,
      normalizeMarkdownHeadingMarker,
    );
}

function normalizeMarkdownHeadingMarker(
  match: string,
  start: string,
  indent: string,
  marker: string,
  gap: string,
) {
  if (marker.length === 1 && gap.length === 0) {
    return match;
  }
  return `${start}${indent}${marker} `;
}

export const StreamingMarkdown = memo(function StreamingMarkdown({
  running,
  error,
}: {
  running: boolean;
  error: boolean;
}) {
  return (
    <MarkdownTextPrimitive
      skipHtml
      defer
      smooth={{
        drainMs: 180,
        maxCharIntervalMs: 18,
        maxCharsPerFrame: 28,
        minCommitMs: 16,
      }}
      remarkPlugins={markdownPlugins}
      components={markdownComponents}
      preprocess={normalizeMarkdownSource}
      className={cn(
        markdownClassName,
        running && "agent-chat-streaming-markdown",
        error && "text-destructive",
      )}
    />
  );
});

const markdownClassName = cn(
  "min-w-0 text-base leading-7 text-foreground",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]",
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold",
  "[&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_h4]:mb-1.5 [&_h4]:mt-3 [&_h4]:text-base [&_h4]:font-semibold",
  "[&_h5]:mb-1.5 [&_h5]:mt-3 [&_h5]:text-base [&_h5]:font-medium",
  "[&_h6]:mb-1.5 [&_h6]:mt-3 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-muted-foreground",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_img]:my-4 [&_img]:block [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-muted/60",
  "[&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_strong]:font-semibold [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse",
  "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
);
