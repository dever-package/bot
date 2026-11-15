import type { StoryboardDocument } from "./space-storyboard";

export type ChapterScreenplay = {
  source: {
    work_asset_id: number;
    work_version_id: number;
    unit_id: string;
    asset_id: number;
    version_id: number;
  };
  source_passages: { id: string; text: string }[];
  parts: {
    title: string;
    description: string;
    source_start: number;
    source_end: number;
    target_duration: number;
    connection: "reset" | "match" | "continue";
  }[];
};

export function ScreenplayScenes({
  storyboard,
  editable,
  onChange,
}: {
  storyboard: StoryboardDocument;
  editable: boolean;
  onChange?: (document: StoryboardDocument) => void;
}) {
  const script = storyboard.screenplay;
  if (!script) return null;
  return (
    <section className="ws-screenplay">
      <p>系统按本章正文自动拆分场景，再生成镜头；这里可以对照原文查看剧本。</p>
      {script.parts.map((part, index) => (
        <article key={index}>
          <strong>
            {index + 1}. {part.title}
          </strong>
          <small>
            原文第 {part.source_start}—{part.source_end} 段 ·{" "}
            {part.connection === "reset"
              ? "换场"
              : part.connection === "match"
                ? "同场换机位"
                : "动作接续"}
          </small>
          {editable ? (
            <textarea
              className="nodrag nopan nowheel"
              aria-label={part.title}
              value={part.description}
              onChange={(event) =>
                onChange?.({
                  ...storyboard,
                  screenplay: {
                    ...script,
                    parts: script.parts.map((scene, i) =>
                      i === index
                        ? { ...scene, description: event.target.value }
                        : scene,
                    ),
                  },
                })
              }
            />
          ) : (
            <p>{part.description}</p>
          )}
          <details>
            <summary>对照原文</summary>
            <p>
              {script.source_passages
                .slice(part.source_start - 1, part.source_end)
                .map((passage) => passage.text)
                .join("")}
            </p>
          </details>
        </article>
      ))}
    </section>
  );
}
