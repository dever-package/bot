import { type ComponentType, type ReactNode } from "react";
import { getCompatModule } from "@dever/front-plugin";

type RichTextViewProps = {
  value: unknown;
  className?: string;
};

type RichTextToHtml = (
  value: unknown,
  options?: { wrapper?: boolean },
) => string;

const RichTextView = getCompatModule("@/components/rich-text-view")
  .RichTextView as ComponentType<RichTextViewProps> | undefined;
const richTextToHtml = getCompatModule("@/lib/rich-text-html")
  .richTextToHtml as RichTextToHtml | undefined;

export function BodyRichTextView({
  value,
  className,
  fallback,
}: {
  value: unknown;
  className?: string;
  fallback?: ReactNode;
}) {
  if (!hasBodyRichText(value) || !RichTextView) {
    return <>{fallback}</>;
  }
  return <RichTextView value={value} className={className} />;
}

export function hasBodyRichText(value: unknown) {
  const content = String(value || "").trim();
  if (!content) {
    return false;
  }
  if (!richTextToHtml) {
    return true;
  }
  try {
    return Boolean(richTextToHtml(content, { wrapper: false }).trim());
  } catch {
    return false;
  }
}
