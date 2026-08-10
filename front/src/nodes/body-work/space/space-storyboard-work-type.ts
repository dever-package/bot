// The backend registry owns the allowed values. The frontend only validates
// that persisted and selected values are stable, non-empty registry keys.
export type StoryboardWorkType = string;

export function isStoryboardWorkTypeKey(
  value: unknown,
): value is StoryboardWorkType {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value
  );
}
