import { ImageOff } from "lucide-react";
import { contentOutputMediaURLs } from "../shared/content-output";
import type { StoryboardDocument, StoryboardShot } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";
import { resolveNodeDetailMediaOutput } from "./node-detail/node-detail-content";
import {
  normalizeStoryboardFrameMediaItems,
  parseStoryboardShotImageMode,
  storyboardFrameRole,
  storyboardShotImagePlan,
  type StoryboardFrameRole,
} from "./space-storyboard-frame-plan";

type StoryboardFrameMedia = {
  node?: SpaceCanvasNode;
  imageURL: string;
};

type StoryboardFrameSource = {
  node: SpaceCanvasNode;
  mediaIndex: number;
};

type StoryboardFrame = {
  shot: StoryboardShot;
  start: StoryboardFrameMedia;
  end?: StoryboardFrameMedia;
  singleRole?: StoryboardFrameRole;
  references?: StoryboardFrameMedia[];
  emptyLabel?: string;
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
      {frames.map(
        ({ shot, start, end, singleRole, references, emptyLabel }) => (
          <article className="ws-storyboard-board-frame" key={shot.id}>
            <header>
              <strong>{String(shot.order).padStart(2, "0")}</strong>
              <span>{shot.duration} 秒</span>
              <span>{continuityLabel(shot)}</span>
            </header>
            {references ? (
              <div
                className={`ws-storyboard-frame-media is-reference-group${
                  references.length <= 1 ? " is-single" : ""
                }`}
                style={{ aspectRatio: storyboardAspectRatio(storyboard) }}
              >
                {(references.length ? references : [start]).map(
                  (media, index) => (
                    <StoryboardFrameOutput
                      key={`${shot.id}:reference:${index}`}
                      shot={shot}
                      media={media}
                      label={`参考图 ${index + 1}`}
                      emptyLabel="参考图待生成"
                    />
                  ),
                )}
              </div>
            ) : end ? (
              <div
                className="ws-storyboard-frame-media is-paired"
                style={{ aspectRatio: storyboardAspectRatio(storyboard) }}
              >
                <StoryboardFrameOutput
                  shot={shot}
                  media={start}
                  frameRole="start"
                  label="首帧"
                />
                <StoryboardFrameOutput
                  shot={shot}
                  media={end}
                  frameRole="end"
                  label="尾帧"
                />
              </div>
            ) : (
              <div
                className="ws-storyboard-frame-media"
                style={{ aspectRatio: storyboardAspectRatio(storyboard) }}
              >
                <StoryboardFrameOutput
                  shot={shot}
                  media={start}
                  frameRole={singleRole}
                  label={singleRole === "end" ? "尾帧" : undefined}
                  emptyLabel={emptyLabel}
                />
              </div>
            )}
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
              <StoryboardFrameRunError
                start={start}
                end={end}
                references={references}
              />
            </div>
          </article>
        ),
      )}
    </div>
  );
}

function StoryboardFrameRunError({
  start,
  end,
  references,
}: {
  start: StoryboardFrameMedia;
  end?: StoryboardFrameMedia;
  references?: StoryboardFrameMedia[];
}) {
  const error =
    start.node?.runError ||
    end?.node?.runError ||
    references?.find((media) => media.node?.runError)?.node?.runError ||
    "";
  return error ? <small>{error}</small> : null;
}

export function storyboardHasGeneratedFrames(
  storyboard: StoryboardDocument,
  sourceNodeId: string,
  canvasNodes: SpaceCanvasNode[],
) {
  return storyboardFrames(storyboard, sourceNodeId, canvasNodes).some((frame) =>
    Boolean(
      frame.start.imageURL ||
        frame.end?.imageURL ||
        frame.references?.some((media) => media.imageURL),
    ),
  );
}

function storyboardFrames(
  storyboard: StoryboardDocument,
  sourceNodeId: string,
  canvasNodes: SpaceCanvasNode[],
): StoryboardFrame[] {
  const nodesByShotId = new Map<
    string,
    Partial<Record<StoryboardFrameRole, StoryboardFrameSource>> & {
      referenceNode?: SpaceCanvasNode;
    }
  >();
  for (const node of canvasNodes) {
    const item = node.storyboardItem;
    if (
      item?.sourceNodeId === sourceNodeId &&
      item.itemType === "shot_image" &&
      item.shotId
    ) {
      const frames = nodesByShotId.get(item.shotId) || {};
      if (parseStoryboardShotImageMode(item.shotImageMode) === "references") {
        frames.referenceNode = node;
        nodesByShotId.set(item.shotId, frames);
        continue;
      }
      const frameMediaItems = normalizeStoryboardFrameMediaItems(
        item.frameMediaItems,
      );
      if (frameMediaItems.length) {
        for (const frame of frameMediaItems) {
          frames[frame.frameRole] = {
            node,
            mediaIndex: frame.mediaIndex,
          };
        }
      } else {
        frames[storyboardFrameRole(item.frameRole)] = {
          node,
          mediaIndex: 1,
        };
      }
      nodesByShotId.set(item.shotId, frames);
    }
  }
  return storyboard.shots.map((shot) => {
    const nodes = nodesByShotId.get(shot.id);
    const imagePlan = storyboardShotImagePlan(shot);
    if (imagePlan.nodeMode === "references") {
      return {
        shot,
        start: storyboardFrameMedia(),
        references: storyboardReferenceMedia(nodes?.referenceNode),
      };
    }
    if (imagePlan.nodeMode === "last_frame") {
      return {
        shot,
        start: storyboardFrameMedia(nodes?.end),
        singleRole: "end" as const,
      };
    }
    if (imagePlan.nodeMode === "none") {
      return {
        shot,
        start: storyboardFrameMedia(),
        emptyLabel: shot.continue_previous
          ? "沿用上一镜尾帧"
          : "无需参考图",
      };
    }
    return {
      shot,
      start: storyboardFrameMedia(nodes?.start),
      ...(nodes?.end ? { end: storyboardFrameMedia(nodes.end) } : {}),
    };
  });
}

function storyboardReferenceMedia(
  node?: SpaceCanvasNode,
): StoryboardFrameMedia[] {
  const output = node ? resolveNodeDetailMediaOutput(node) : undefined;
  const imageURLs = output ? contentOutputMediaURLs(output, "image") : [];
  return imageURLs.slice(0, 4).map((imageURL) => ({ node, imageURL }));
}

function storyboardFrameMedia(
  source?: StoryboardFrameSource,
): StoryboardFrameMedia {
  const output = source
    ? resolveNodeDetailMediaOutput(source.node)
    : undefined;
  return {
    node: source?.node,
    imageURL: output
      ? storyboardFrameImageURL(output, source?.mediaIndex || 1)
      : "",
  };
}

function storyboardFrameImageURL(output: unknown, mediaIndex: number) {
  const row =
    output && typeof output === "object" && !Array.isArray(output)
      ? (output as Record<string, unknown>)
      : undefined;
  const meta =
    row?.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
      ? (row.meta as Record<string, unknown>)
      : undefined;
  const items = Array.isArray(meta?.items) ? meta.items : [];
  const plannedItem = items.find((candidate) => {
    if (
      !candidate ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return false;
    }
    return Number((candidate as Record<string, unknown>).order) === mediaIndex;
  }) as Record<string, unknown> | undefined;
  const plannedImage = String(plannedItem?.image || "").trim();
  return (
    plannedImage ||
    contentOutputMediaURLs(output, "image")[mediaIndex - 1] ||
    ""
  );
}

function StoryboardFrameOutput({
  shot,
  media,
  frameRole,
  label,
  emptyLabel,
}: {
  shot: StoryboardShot;
  media: StoryboardFrameMedia;
  frameRole?: StoryboardFrameRole;
  label?: string;
  emptyLabel?: string;
}) {
  const content = media.imageURL ? (
    <a href={media.imageURL} target="_blank" rel="noreferrer">
      <img
        src={media.imageURL}
        alt={`镜头 ${shot.order}${label ? ` ${label}` : " 故事板"}`}
        loading="lazy"
        decoding="async"
      />
    </a>
  ) : (
    <div className="ws-storyboard-frame-empty">
      <ImageOff size={22} />
      <span>{emptyLabel || emptyFrameLabel(shot, media.node, frameRole)}</span>
    </div>
  );
  if (!label) {
    return content;
  }
  return (
    <div className="ws-storyboard-frame-slot">
      <span className="ws-storyboard-frame-role">{label}</span>
      {content}
    </div>
  );
}

function continuityLabel(shot: StoryboardShot) {
  if (shot.continue_previous) return "尾帧续接";
  if (shot.match_previous) return "画面匹配";
  return "新镜头";
}

function emptyFrameLabel(
  shot: StoryboardShot,
  node?: SpaceCanvasNode,
  frameRole?: StoryboardFrameRole,
) {
  if (node?.runError) return "生成失败";
  if (node) return "暂无结果";
  if (frameRole === "end") return "尾帧待生成";
  if (frameRole === "start" && shot.continue_previous) {
    return "运行时取上一镜尾帧";
  }
  if (shot.continue_previous) return "沿用上一镜尾帧";
  return "待生成";
}

function storyboardAspectRatio(storyboard: StoryboardDocument) {
  return storyboard.aspect_ratio.replace(":", " / ");
}
