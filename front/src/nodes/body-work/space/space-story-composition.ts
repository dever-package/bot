import { STORY_COMPOSE_NODE_PREFIX } from "./space-canvas-edge";
import { createLocalNode, nextCanvasNodeNo } from "./space-model";
import { storySettingDocument } from "./space-story-setting";
import { firstAvailablePower, stableToken } from "./space-storyboard-derived-groups";
import { parseStoryboardOutput } from "./space-storyboard";
import { emptyVideoComposition, type VideoComposeClip } from "./space-video-compose";
import type { AssetCate, PowerOption, SpaceCanvasState } from "./types";

// One ordinary composition node joins the selected chapters in manuscript order.
// Chapter images and videos remain owned by their existing production nodes.
export function syncStoryComposition(input: {
  canvas: SpaceCanvasState;
  assetCate: AssetCate;
  powers: PowerOption[];
}): SpaceCanvasState {
  let canvas = input.canvas;
  for (const story of input.canvas.nodes) {
    const work = storySettingDocument(story);
    if (!work) continue;
    const assetId = Number(story.asset?.id || story.resultRef?.asset_id);
    const chapters = work.units.flatMap((unit) => {
      const board = canvas.nodes.find((node) =>
        node.composerDraft?.promptContent?.parts.some((part) =>
          part.type === "reference" && part.ref_type === "asset" &&
          part.ref_id === assetId && part.ref_content_selection?.kind === "unit" &&
          part.ref_content_selection.ids.length === 1 && part.ref_content_selection.ids[0] === unit.id,
        ),
      );
      if (!board) return [];
      const composition = canvas.nodes.find((node) =>
        node.storyboardItem?.sourceNodeId === board.id && node.storyboardItem.itemType === "video_compose",
      );
      return [{ unit, board, composition }];
    });
    const id = STORY_COMPOSE_NODE_PREFIX + stableToken(story.id);
    const existing = canvas.nodes.find((node) => node.id === id);
    if (!existing && chapters.length < 2) continue;
    const power = firstAvailablePower(input.powers, "video", "video_compose");
    const node = existing || createLocalNode("power", input.assetCate,
      nextCanvasNodeNo(canvas.nodes, canvas.nextNodeNo),
      { x: Math.max(...chapters.map(({ board }) => board.x + board.width)) + 360, y: story.y },
      power ? { power } : undefined,
    );
    const composition = existing?.composerDraft?.videoComposition || emptyVideoComposition();
    const prefix = id + "-chapter-";
    const isChapterClip = (clip: VideoComposeClip) => clip.sourceEdgeId?.startsWith(prefix);
    const edges = canvas.edges.filter((edge) => !edge.id.startsWith(prefix));
    let sourceChanged = Boolean(existing) &&
      JSON.stringify(composition.clips.filter(isChapterClip).map((clip) => clip.id)) !== JSON.stringify(chapters.map(({ unit }) => unit.id));
    const chapterClips: VideoComposeClip[] = chapters.map(({ unit, board, composition: source }) => {
      const edgeId = prefix + stableToken(unit.id);
      if (source) edges.push({ id: edgeId, from: source.id, to: id, purpose: "dependency" });
      const assetId = Number(source?.resultRef?.asset_id || source?.asset?.id || 0);
      const versionId = Number(source?.resultRef?.version_id || source?.asset?.version_id || 0);
      const reference = assetId && versionId ? { assetId, versionId, label: unit.title } : undefined;
      const boardDocument = parseStoryboardOutput([board.asset?.version?.content, board.resultOutput]);
      const previous = composition.clips.find((clip) => clip.id === unit.id);
      const duration = boardDocument?.target_duration || previous?.duration || 0;
      if (existing && previous?.duration !== duration) sourceChanged = true;
      if (existing && JSON.stringify(previous?.visualVideo) !== JSON.stringify(reference) &&
          (!existing.resultRef?.execution_id || existing.resultRef.execution_id !== source?.resultRef?.execution_id)) {
        sourceChanged = true;
      }
      return {
        ...previous,
        id: unit.id, title: unit.title, sourceEdgeId: edgeId,
        visualVideo: reference,
        originalAudioSource: previous?.originalAudioSource &&
          JSON.stringify(previous.originalAudioSource) !== JSON.stringify(previous.visualVideo)
          ? previous.originalAudioSource : reference,
        duration,
        originalVolume: previous?.originalVolume ?? 1,
        speechTracks: previous?.speechTracks || [],
        subtitleTracks: previous?.subtitleTracks || [],
        useOriginalVideo: previous?.useOriginalVideo ?? true,
        blockingIssues: reference ? [] : ["等待本章视频生成"],
        transitionToNext: previous?.transitionToNext || { type: "none", durationMs: 0 },
      };
    });
    const clips: VideoComposeClip[] = [];
    let chapterIndex = 0;
    for (const clip of composition.clips) {
      if (!isChapterClip(clip)) {
        clips.push(clip);
      } else if (chapterIndex < chapterClips.length) {
        clips.push(chapterClips[chapterIndex++]);
      }
    }
    clips.push(...chapterClips.slice(chapterIndex));
    const updated = {
      ...node, id, title: existing?.title || "全片合成", kind: "video", outputType: "video_compose",
      description: "按章节顺序合成整部视频。",
      composerDraft: { ...node.composerDraft, videoComposition: { ...composition, clips } },
    };
    if (sourceChanged) {
      delete updated.asset;
      delete updated.resultRef;
      delete updated.resultOutput;
      delete updated.resultView;
    }
    if (existing && JSON.stringify(existing) === JSON.stringify(updated) && JSON.stringify(canvas.edges) === JSON.stringify(edges)) continue;
    canvas = {
      ...canvas,
      nodes: existing ? canvas.nodes.map((item) => item.id === id ? updated : item) : [...canvas.nodes, updated],
      edges,
      nextNodeNo: nextCanvasNodeNo([...canvas.nodes, updated], canvas.nextNodeNo),
    };
  }
  return canvas;
}
