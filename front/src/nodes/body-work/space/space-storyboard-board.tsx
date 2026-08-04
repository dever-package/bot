import { ImageOff } from "lucide-react";
import { contentOutputMediaURLs } from "../shared/content-output";
import type { StoryboardDocument, StoryboardShot } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";
import { resolveNodeDetailMediaOutput } from "./node-detail/node-detail-content";

type StoryboardFrame = {
  shot: StoryboardShot;
  node?: SpaceCanvasNode;
  imageURL: string;
};

export function StoryboardBoard({
  storyboard,
  sourceNodeId,
  canvasNodes,
}: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  canvasNodes: SpaceCanvasNode[];
}) {
  const frames = storyboardFrames(storyboard, sourceNodeId, canvasNodes);
  return (
    <div className="ws-storyboard-board" aria-label="画面预览">
      {frames.map(({ shot, node, imageURL }) => (
        <article className="ws-storyboard-frame" key={shot.id}>
          <header>
            <strong>{String(shot.order).padStart(2, "0")}</strong>
            <span>{shot.duration} 秒</span>
            <span>{continuityLabel(shot)}</span>
          </header>
          <div
            className="ws-storyboard-frame-media"
            style={{ aspectRatio: storyboardAspectRatio(storyboard) }}
          >
            {imageURL ? (
              <a href={imageURL} target="_blank" rel="noreferrer">
                <img
                  src={imageURL}
                  alt={`镜头 ${shot.order} 故事板`}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ) : (
              <div className="ws-storyboard-frame-empty">
                <ImageOff size={22} />
                <span>{emptyFrameLabel(shot, node)}</span>
              </div>
            )}
          </div>
          <div className="ws-storyboard-frame-copy">
            <strong>{shot.beat}</strong>
            <span>{shot.camera_instruction || "固定机位"}</span>
            <div className="ws-storyboard-frame-continuity">
              <p>
                <b>入</b>
                <span>{shot.continuity_state.entry}</span>
              </p>
              <p>
                <b>出</b>
                <span>{shot.continuity_state.exit}</span>
              </p>
            </div>
            {node?.runError ? <small>{node.runError}</small> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function storyboardHasGeneratedFrames(
  storyboard: StoryboardDocument,
  sourceNodeId: string,
  canvasNodes: SpaceCanvasNode[],
) {
  return storyboardFrames(storyboard, sourceNodeId, canvasNodes).some(
    (frame) => Boolean(frame.imageURL),
  );
}

function storyboardFrames(
  storyboard: StoryboardDocument,
  sourceNodeId: string,
  canvasNodes: SpaceCanvasNode[],
): StoryboardFrame[] {
  const nodesByShotId = new Map<string, SpaceCanvasNode>();
  for (const node of canvasNodes) {
    const item = node.storyboardItem;
    if (
      item?.sourceNodeId === sourceNodeId &&
      item.itemType === "shot_image" &&
      item.shotId
    ) {
      nodesByShotId.set(item.shotId, node);
    }
  }
  return storyboard.shots.map((shot) => {
    const node = nodesByShotId.get(shot.id);
    const output = node ? resolveNodeDetailMediaOutput(node) : undefined;
    const imageURL = output
      ? contentOutputMediaURLs(output, "image")[0] || ""
      : "";
    return { shot, node, imageURL };
  });
}

function continuityLabel(shot: StoryboardShot) {
  if (shot.continue_previous) return "尾帧续接";
  if (shot.match_previous) return "画面匹配";
  return "新镜头";
}

function emptyFrameLabel(shot: StoryboardShot, node?: SpaceCanvasNode) {
  if (node?.runError) return "生成失败";
  if (node) return "暂无结果";
  if (shot.continue_previous) return "沿用上一镜尾帧";
  return "待生成";
}

function storyboardAspectRatio(storyboard: StoryboardDocument) {
  return storyboard.aspect_ratio.replace(":", " / ");
}
