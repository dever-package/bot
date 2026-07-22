import { CircleAlert } from "lucide-react";
import type { StoryboardValidationIssue } from "./space-storyboard-validation";

export function StoryboardValidationPanel({
  issues,
  onOpen,
}: {
  issues: StoryboardValidationIssue[];
  onOpen: (issue: StoryboardValidationIssue) => void;
}) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const visibleIssues = [...errors, ...warnings].slice(0, 5);
  return (
    <section
      className={`ws-storyboard-validation ${errors.length ? "is-error" : "is-warning"}`}
      aria-label="分镜预检"
    >
      <header>
        <CircleAlert size={14} />
        <strong>
          {errors.length
            ? `${errors.length} 项需要处理`
            : `${warnings.length} 项建议检查`}
        </strong>
        {issues.length > visibleIssues.length ? (
          <span>另有 {issues.length - visibleIssues.length} 项</span>
        ) : null}
      </header>
      <div>
        {visibleIssues.map((issue, index) => {
          const canOpen = Boolean(issue.materialId || issue.shotId);
          return (
            <button
              key={`${issue.id}:${index}`}
              type="button"
              disabled={!canOpen}
              onClick={() => canOpen && onOpen(issue)}
            >
              <span>{issue.message}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
