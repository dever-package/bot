import { useMemo, useState } from "react";
import { ArrowLeft, Check, Music2, X } from "lucide-react";
import type { ComposerAssetItem } from "./types";
import {
  videoComposeMediaReferenceKey,
  type VideoComposeAssetReference,
} from "./space-video-compose";

type VideoComposePickerEntry = {
  item: ComposerAssetItem;
  references: VideoComposeAssetReference[];
};

export function VideoComposeAudioPicker({
  title,
  items,
  resolveReferences,
  onSelect,
  onClose,
}: {
  title: string;
  items: ComposerAssetItem[];
  resolveReferences: (
    item: ComposerAssetItem,
    kind: "audio",
  ) => VideoComposeAssetReference[];
  onSelect: (references: VideoComposeAssetReference[]) => void;
  onClose: () => void;
}) {
  const [activeEntry, setActiveEntry] = useState<VideoComposePickerEntry>();
  const availableEntries = useMemo(
    () =>
      items
        .filter((item) => item.kind === "audio")
        .map((item) => ({ item, references: resolveReferences(item, "audio") }))
        .filter((entry) => entry.references.length > 0),
    [items, resolveReferences],
  );

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
            <button
              type="button"
              onClick={() => setActiveEntry(undefined)}
              aria-label="返回素材列表"
            >
              <ArrowLeft size={17} />
            </button>
          ) : null}
          <div>
            <strong>{activeEntry ? activeEntry.item.title : title}</strong>
            <span>
              {activeEntry ? "选择一个音频" : "选择当前画布中已经生成的音频素材"}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            <X size={17} />
          </button>
        </header>
        {activeEntry ? (
          <div className="ws-video-compose-picker-selection">
            <div className="ws-video-compose-picker-selection-modes">
              <span>共 {activeEntry.references.length} 个音频</span>
            </div>
            <div className="ws-video-compose-picker-media-grid">
              {activeEntry.references.map((reference, index) => {
                const label = reference.label || `音频 ${index + 1}`;
                return (
                  <article key={videoComposeMediaReferenceKey(reference)}>
                    <section className="ws-video-compose-picker-single-preview">
                      <Music2 size={22} aria-hidden="true" />
                      {reference.mediaUrl ? (
                        <audio
                          src={reference.mediaUrl}
                          controls
                          preload="none"
                          aria-label={label}
                        />
                      ) : null}
                    </section>
                    <div>
                      <strong>{label}</strong>
                      <button
                        type="button"
                        className="ws-video-compose-picker-single-select"
                        onClick={() => onSelect([reference])}
                      >
                        <Check size={14} />
                        选择
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="ws-video-compose-picker-grid">
            {availableEntries.length ? (
              availableEntries.map((entry) => {
                const { item, references } = entry;
                return (
                  <button
                    key={`${item.refId}:${item.versionID}`}
                    type="button"
                    onClick={() => {
                      if (references.length === 1) onSelect(references);
                      else setActiveEntry(entry);
                    }}
                  >
                    <span className="ws-video-compose-picker-preview">
                      {item.preview.imageUrl ? (
                        <img
                          src={item.preview.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <Music2 size={24} />
                      )}
                      {references.length > 1 ? <small>{references.length} 个音频</small> : null}
                    </span>
                    <strong>{item.title}</strong>
                  </button>
                );
              })
            ) : (
              <div className="ws-video-compose-picker-empty">
                <Music2 size={28} />
                <strong>暂无可用音频</strong>
                <span>请先运行对应节点，或通过引用节点添加素材。</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
