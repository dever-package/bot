import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Music2,
  Video,
  X,
} from "lucide-react";
import { VideoThumbnail } from "../../shared/video-thumbnail";
import type { ComposerAssetItem } from "./types";
import {
  videoComposeMediaReferenceKey,
  type VideoComposeAssetReference,
} from "./space-video-compose";

type VideoComposePickerEntry = {
  item: ComposerAssetItem;
  references: VideoComposeAssetReference[];
};

export function VideoComposeAssetPicker({
  title,
  kind,
  items,
  allowOrderedSelection = false,
  resolveReferences,
  onSelect,
  onClose,
}: {
  title: string;
  kind: "video" | "audio";
  items: ComposerAssetItem[];
  allowOrderedSelection?: boolean;
  resolveReferences: (
    item: ComposerAssetItem,
    kind: "video" | "audio",
  ) => VideoComposeAssetReference[];
  onSelect: (references: VideoComposeAssetReference[]) => void;
  onClose: () => void;
}) {
  const [activeEntry, setActiveEntry] = useState<VideoComposePickerEntry>();
  const [selectionMode, setSelectionMode] = useState<"all" | "custom">("all");
  const [selectedReferences, setSelectedReferences] = useState<
    VideoComposeAssetReference[]
  >([]);
  const availableEntries = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.kind === kind &&
            Number(item.refId || 0) > 0 &&
            Number(item.versionID || 0) > 0,
        )
        .map((item) => ({ item, references: resolveReferences(item, kind) }))
        .filter((entry) => entry.references.length > 0),
    [items, kind, resolveReferences],
  );
  const EmptyIcon = kind === "video" ? Video : Music2;
  const mediaLabel = kind === "video" ? "视频" : "音频";
  const activeReferences = activeEntry?.references || [];
  const confirmedReferences =
    selectionMode === "all" ? activeReferences : selectedReferences;

  const chooseEntry = (entry: VideoComposePickerEntry) => {
    const { references } = entry;
    if (!references.length) {
      return;
    }
    if (references.length === 1) {
      onSelect(references);
      return;
    }
    setActiveEntry(entry);
    setSelectionMode("all");
    setSelectedReferences(allowOrderedSelection ? references : []);
  };
  const startCustomSelection = () => {
    setSelectionMode("custom");
    setSelectedReferences(
      selectedReferences.length ? selectedReferences : activeReferences,
    );
  };
  const toggleReference = (reference: VideoComposeAssetReference) => {
    const key = videoComposeMediaReferenceKey(reference);
    const selectedIndex = selectedReferences.findIndex(
      (item) => videoComposeMediaReferenceKey(item) === key,
    );
    if (selectedIndex >= 0) {
      setSelectedReferences(
        selectedReferences.filter((_, index) => index !== selectedIndex),
      );
      return;
    }
    setSelectedReferences([...selectedReferences, reference]);
  };
  const moveReference = (index: number, offset: number) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= selectedReferences.length) {
      return;
    }
    const next = [...selectedReferences];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setSelectedReferences(next);
  };
  const backToItems = () => {
    setActiveEntry(undefined);
    setSelectionMode("all");
    setSelectedReferences([]);
  };

  return (
    <div className="ws-video-compose-picker-backdrop" onMouseDown={onClose}>
      <section
        className="ws-video-compose-picker"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          {activeEntry ? (
            <button type="button" onClick={backToItems} aria-label="返回素材列表">
              <ArrowLeft size={17} />
            </button>
          ) : null}
          <div>
            <strong>{activeEntry ? activeEntry.item.title : title}</strong>
            <span>
              {activeEntry
                ? allowOrderedSelection
                  ? "选择需要合成的内容，并调整镜头顺序"
                  : `选择一个${mediaLabel}`
                : `选择当前画布中已经生成的${mediaLabel}素材`}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            <X size={17} />
          </button>
        </header>
        {activeEntry ? (
          <div className="ws-video-compose-picker-selection">
            <div className="ws-video-compose-picker-selection-modes">
              <span>
                共 {activeReferences.length} 个{mediaLabel}
              </span>
              {allowOrderedSelection ? (
                <div>
                  <button
                    type="button"
                    className={selectionMode === "all" ? "is-active" : ""}
                    onClick={() => setSelectionMode("all")}
                  >
                    全部
                  </button>
                  <button
                    type="button"
                    className={selectionMode === "custom" ? "is-active" : ""}
                    onClick={startCustomSelection}
                  >
                    自选{" "}
                    {selectionMode === "custom"
                      ? selectedReferences.length
                      : 0}
                    /{activeReferences.length}
                  </button>
                </div>
              ) : null}
            </div>
            <div className="ws-video-compose-picker-media-grid">
              {activeReferences.map((reference, index) => {
                const key = videoComposeMediaReferenceKey(reference);
                if (!allowOrderedSelection) {
                  return (
                    <SingleMediaReferenceOption
                      key={key}
                      kind={kind}
                      reference={reference}
                      index={index}
                      onSelect={() => onSelect([reference])}
                    />
                  );
                }
                const selectedIndex = selectedReferences.findIndex(
                  (item) => videoComposeMediaReferenceKey(item) === key,
                );
                const selected =
                  selectionMode === "all" || selectedIndex >= 0;
                const selectedOrder =
                  selectionMode === "all" ? index : selectedIndex;
                return (
                  <article key={key} className={selected ? "is-selected" : ""}>
                    <button
                      type="button"
                      className="ws-video-compose-picker-media-toggle"
                      onClick={() => {
                        if (selectionMode !== "custom") {
                          setSelectionMode("custom");
                          setSelectedReferences(
                            activeReferences.filter(
                              (item) =>
                                videoComposeMediaReferenceKey(item) !== key,
                            ),
                          );
                          return;
                        }
                        toggleReference(reference);
                      }}
                      aria-pressed={selected}
                    >
                      {reference.mediaUrl ? (
                        <VideoThumbnail
                          src={reference.mediaUrl}
                        />
                      ) : (
                        <Video size={24} />
                      )}
                      {selected ? (
                        <span className="ws-video-compose-picker-media-order">
                          {selectedOrder + 1}
                        </span>
                      ) : null}
                    </button>
                    <div>
                      <strong>{reference.label || `视频 ${index + 1}`}</strong>
                      {selectionMode === "custom" && selectedIndex >= 0 ? (
                        <span className="ws-video-compose-picker-media-actions">
                          <button
                            type="button"
                            disabled={selectedIndex === 0}
                            onClick={() => moveReference(selectedIndex, -1)}
                            aria-label="前移"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={selectedIndex === selectedReferences.length - 1}
                            onClick={() => moveReference(selectedIndex, 1)}
                            aria-label="后移"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </span>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
            {allowOrderedSelection ? (
              <footer>
                <span>
                  将按当前顺序添加 {confirmedReferences.length} 个镜头
                </span>
                <button
                  type="button"
                  disabled={!confirmedReferences.length}
                  onClick={() => onSelect(confirmedReferences)}
                >
                  <Check size={15} />
                  确认添加
                </button>
              </footer>
            ) : null}
          </div>
        ) : (
          <div className="ws-video-compose-picker-grid">
            {availableEntries.length ? (
              availableEntries.map((entry) => {
                const { item, references } = entry;
                const referenceCount = references.length;
                return (
                  <button
                    key={`${item.refId}:${item.versionID}`}
                    type="button"
                    onClick={() => chooseEntry(entry)}
                  >
                    <span className="ws-video-compose-picker-preview">
                      {item.preview.imageUrl ? (
                        <img
                          src={item.preview.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : item.preview.videoUrl ? (
                        <VideoThumbnail
                          src={item.preview.videoUrl}
                        />
                      ) : (
                        <EmptyIcon size={24} />
                      )}
                      {referenceCount > 1 ? (
                        <small>
                          {referenceCount} 个{mediaLabel}
                        </small>
                      ) : null}
                    </span>
                    <strong>{item.title}</strong>
                  </button>
                );
              })
            ) : (
              <div className="ws-video-compose-picker-empty">
                <EmptyIcon size={28} />
                <strong>暂无可用{kind === "video" ? "视频" : "音频"}</strong>
                <span>请先运行对应节点，或通过导入节点添加素材。</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SingleMediaReferenceOption({
  kind,
  reference,
  index,
  onSelect,
}: {
  kind: "video" | "audio";
  reference: VideoComposeAssetReference;
  index: number;
  onSelect: () => void;
}) {
  const mediaLabel = kind === "video" ? "视频" : "音频";
  const label = reference.label || `${mediaLabel} ${index + 1}`;
  return (
    <article>
      <section
        className={`ws-video-compose-picker-single-preview is-${kind}`}
      >
        {kind === "audio" ? (
          <>
            <Music2 size={22} aria-hidden="true" />
            {reference.mediaUrl ? (
              <audio
                src={reference.mediaUrl}
                controls
                preload="none"
                aria-label={label}
              />
            ) : null}
          </>
        ) : reference.mediaUrl ? (
          <VideoThumbnail
            src={reference.mediaUrl}
          />
        ) : (
          <Video size={24} />
        )}
      </section>
      <div>
        <strong>{label}</strong>
        <button
          type="button"
          className="ws-video-compose-picker-single-select"
          onClick={onSelect}
        >
          <Check size={14} />
          选择
        </button>
      </div>
    </article>
  );
}
