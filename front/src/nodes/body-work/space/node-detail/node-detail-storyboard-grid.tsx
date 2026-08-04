import { ImagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  ReferenceOption,
  ReferencePart,
  ReferenceProvider,
} from "../../../show/agent-chat/reference";
import type {
  StoryboardGridDocument,
  StoryboardGridFrame,
} from "../../shared/content-output";
import { StoryboardGridView } from "../../shared/storyboard-grid-view";

export function NodeDetailStoryboardGrid({
  grid,
  readonly,
  referenceProvider,
  onChange,
}: {
  grid: StoryboardGridDocument;
  readonly: boolean;
  referenceProvider?: ReferenceProvider;
  onChange: (grid: StoryboardGridDocument) => void;
}) {
  const [activeFrameIndex, setActiveFrameIndex] = useState<number | null>(null);
  const selectedReferences = useMemo(
    () => storyboardGridReferences(grid),
    [grid],
  );

  function updateFrame(index: number, patch: Partial<StoryboardGridFrame>) {
    onChange({
      ...grid,
      frames: grid.frames.map((frame, frameIndex) =>
        frameIndex === index ? { ...frame, ...patch } : frame,
      ),
    });
  }

  async function replaceFrame(option: ReferenceOption) {
    if (activeFrameIndex === null || option.refType !== "asset") return;
    try {
      const image = await referenceOptionImage(referenceProvider, option);
      if (!image) {
        toast.error("所选资产当前版本没有可用图片");
        return;
      }
      updateFrame(activeFrameIndex, {
        image,
        assetID: option.refId,
        assetVersionID: Number(option.versionID || 0),
        status: "success",
        error: "",
      });
      setActiveFrameIndex(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "读取图片资产失败");
    }
  }

  return (
    <div className="ws-node-detail-storyboard-grid">
      <StoryboardGridView
        grid={grid}
        variant="detail"
        readonly={readonly}
        onFrameChange={updateFrame}
        renderFrameAction={
          !readonly && referenceProvider?.renderPicker
            ? (frame, index) => (
                <button
                  type="button"
                  className="ws-storyboard-grid-output-replace"
                  onClick={() => setActiveFrameIndex(index)}
                >
                  <ImagePlus size={14} />
                  <span>{frame.image ? "替换图片" : "导入图片"}</span>
                </button>
              )
            : undefined
        }
      />
      {referenceProvider?.renderPicker?.({
        open: activeFrameIndex !== null,
        acceptedKinds: ["image"],
        maxSelection: 1,
        selectedReferences,
        onSelect: (option) => void replaceFrame(option),
        onClose: () => setActiveFrameIndex(null),
      })}
    </div>
  );
}

function storyboardGridReferences(
  grid: StoryboardGridDocument,
): Extract<ReferencePart, { type: "reference" }>[] {
  return grid.frames.flatMap((frame) =>
    frame.assetID > 0
      ? [
          {
            type: "reference" as const,
            ref_type: "asset" as const,
            ref_id: frame.assetID,
            ref_version_id: frame.assetVersionID || undefined,
            label: frame.title,
          },
        ]
      : [],
  );
}

async function referenceOptionImage(
  provider: ReferenceProvider | undefined,
  option: ReferenceOption,
) {
  const direct = option.preview?.sourceUrl || option.preview?.url;
  if (direct) return direct;
  if (!provider?.loadPreview) return "";
  const preview = await provider.loadPreview({
    refType: option.refType,
    refId: option.refId,
    label: option.label,
    trigger: option.trigger,
    versionId: option.versionID,
  });
  return preview.media.find((media) => media.kind === "image")?.url || "";
}
