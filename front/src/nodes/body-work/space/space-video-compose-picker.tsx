import { Music2, Video, X } from "lucide-react";
import type { ComposerAssetItem } from "./space-prompt-composer";

export function VideoComposeAssetPicker({
  title,
  kind,
  items,
  onSelect,
  onClose,
}: {
  title: string;
  kind: "video" | "audio";
  items: ComposerAssetItem[];
  onSelect: (item: ComposerAssetItem) => void;
  onClose: () => void;
}) {
  const availableItems = items.filter(
    (item) =>
      item.kind === kind && Number(item.refId || 0) > 0 && Number(item.versionID || 0) > 0,
  );
  const EmptyIcon = kind === "video" ? Video : Music2;
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
          <div>
            <strong>{title}</strong>
            <span>选择当前画布中已经生成的{kind === "video" ? "视频" : "音频"}素材</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            <X size={17} />
          </button>
        </header>
        <div className="ws-video-compose-picker-grid">
          {availableItems.length ? (
            availableItems.map((item) => (
              <button
                key={`${item.refId}:${item.versionID}`}
                type="button"
                onClick={() => onSelect(item)}
              >
                <span className="ws-video-compose-picker-preview">
                  {item.preview.imageUrl ? (
                    <img src={item.preview.imageUrl} alt="" />
                  ) : item.preview.videoUrl ? (
                    <video
                      src={item.preview.videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <EmptyIcon size={24} />
                  )}
                </span>
                <strong>{item.title}</strong>
              </button>
            ))
          ) : (
            <div className="ws-video-compose-picker-empty">
              <EmptyIcon size={28} />
              <strong>暂无可用{kind === "video" ? "视频" : "音频"}</strong>
              <span>请先运行对应节点，或通过导入节点添加素材。</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
