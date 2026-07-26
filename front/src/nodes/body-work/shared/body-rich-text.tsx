import { type ComponentType, type ReactNode } from "react";
import { getCompatModule } from "@dever/front-plugin";

type RichTextViewProps = {
  value: unknown;
  className?: string;
  outline?: BodyRichTextOutlineOptions;
  onOutlineChange?: (items: BodyRichTextOutlineItem[]) => void;
};

export type BodyRichTextOutlineItem = {
  id: string;
  level: number;
  text: string;
};

export type BodyRichTextOutlineOptions = {
  minLevel?: number;
  maxLevel?: number;
  idPrefix?: string;
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
  outline,
  onOutlineChange,
}: {
  value: unknown;
  className?: string;
  fallback?: ReactNode;
  outline?: BodyRichTextOutlineOptions;
  onOutlineChange?: (items: BodyRichTextOutlineItem[]) => void;
}) {
  if (!hasBodyRichText(value) || !RichTextView) {
    return <>{fallback}</>;
  }
  return (
    <RichTextView
      value={value}
      className={className}
      outline={outline}
      onOutlineChange={onOutlineChange}
    />
  );
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
