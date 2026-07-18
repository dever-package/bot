import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clapperboard,
  Loader2,
  Maximize2,
  Music2,
  Play,
  Plus,
  Trash2,
  Volume2,
} from "lucide-react";
import type { ComposerAssetItem } from "./space-prompt-composer";
import { moveOrderedItemById } from "./space-ordered-list";
import {
  emptyVideoComposition,
  VIDEO_COMPOSE_TRANSITIONS,
  videoCompositionDuration,
  type CanvasVideoComposition,
  type VideoComposeAssetReference,
  type VideoComposeClip,
} from "./space-video-compose";
import {
  VideoComposeClipCard,
  type VideoComposeClipPanel,
} from "./space-video-compose-card";
import { VideoComposeAssetPicker } from "./space-video-compose-picker";
import {
  CanvasNodeContentView,
  hasCanvasContent,
} from "./space-content-view";

type PickerTarget = "clip" | "voice" | "background";

export function VideoComposeView({
  composition,
  referenceItems,
  readonly = false,
  running = false,
  fullScreen = false,
  finalOutput,
  onChange,
  onRun,
  onOpenDetail,
}: {
  composition?: CanvasVideoComposition;
  referenceItems: ComposerAssetItem[];
  readonly?: boolean;
  running?: boolean;
  fullScreen?: boolean;
  finalOutput?: unknown;
  onChange?: (composition: CanvasVideoComposition) => void;
  onRun?: (composition: CanvasVideoComposition) => void;
  onOpenDetail?: () => void;
}) {
  const value = composition || emptyVideoComposition();
  const [selectedClipId, setSelectedClipId] = useState(
    value.clips[0]?.id || "",
  );
  const [activePanel, setActivePanel] = useState<VideoComposeClipPanel | "">("");
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | "">("");
  const [draggedId, setDraggedId] = useState("");
  const [dragPlacement, setDragPlacement] = useState<"before" | "after">(
    "before",
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const selectedClip =
    value.clips.find((clip) => clip.id === selectedClipId) || value.clips[0];
  const selectedItem = selectedClip
    ? findReferenceItem(referenceItems, selectedClip.video)
    : undefined;
  const totalDuration = videoCompositionDuration(value);

  const referenceMap = useMemo(() => {
    const result = new Map<string, ComposerAssetItem>();
    for (const item of referenceItems) {
      if (item.refId && item.versionID) {
        result.set(`${item.refId}:${item.versionID}`, item);
      }
    }
    return result;
  }, [referenceItems]);

  const update = (next: CanvasVideoComposition) => {
    if (!readonly) {
      onChange?.(next);
    }
  };
  const updateClip = (clipId: string, patch: Partial<VideoComposeClip>) => {
    update({
      ...value,
      clips: value.clips.map((clip) =>
        clip.id === clipId ? { ...clip, ...patch } : clip,
      ),
    });
  };
  const openPanel = (clipId: string, panel: VideoComposeClipPanel) => {
    setSelectedClipId(clipId);
    setActivePanel((current) =>
      selectedClipId === clipId && current === panel ? "" : panel,
    );
  };
  const chooseReference = (item: ComposerAssetItem) => {
    const reference = referenceFromItem(item);
    if (!reference) {
      return;
    }
    if (pickerTarget === "clip") {
      const clip = createVideoComposeClip(reference);
      update({ ...value, clips: [...value.clips, clip] });
      setSelectedClipId(clip.id);
    } else if (pickerTarget === "voice" && selectedClip) {
      updateClip(selectedClip.id, {
        sound: { ...selectedClip.sound, voice: reference },
      });
    } else if (pickerTarget === "background") {
      update({
        ...value,
        settings: { ...value.settings, backgroundMusic: reference },
      });
    }
    setPickerTarget("");
  };

  const editor = (
    <section
      className={`ws-video-compose ${
        fullScreen ? "is-fullscreen" : "is-compact"
      }`}
    >
      <header className="ws-video-compose-head">
        <div className="ws-video-compose-actions nodrag">
          <span>
            <Clapperboard size={14} />
            视频合成
          </span>
          <small>
            {value.clips.length} 个镜头
            {totalDuration > 0 ? ` · ${formatDuration(totalDuration)} 秒` : ""}
          </small>
        </div>
        <div>
          {!readonly ? (
            <button type="button" onClick={() => setPickerTarget("clip")}>
              <Plus size={13} />
              添加镜头
            </button>
          ) : null}
          {!fullScreen && onOpenDetail ? (
            <button type="button" onClick={onOpenDetail}>
              <Maximize2 size={13} />
              打开合成器
            </button>
          ) : null}
          {onRun ? (
            <button
              type="button"
              className="is-primary"
              disabled={running || readonly || value.clips.length === 0}
              onClick={() => onRun(value)}
            >
              {running ? (
                <Loader2 size={13} className="ws-spin" />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              {running ? "合成中" : "开始合成"}
            </button>
          ) : null}
        </div>
      </header>

      <div
        ref={gridRef}
        className="ws-video-compose-grid nodrag nowheel"
        onDragOver={(event) => {
          if (!draggedId || !gridRef.current) {
            return;
          }
          const bounds = gridRef.current.getBoundingClientRect();
          if (event.clientY < bounds.top + 36) {
            gridRef.current.scrollTop -= 12;
          } else if (event.clientY > bounds.bottom - 36) {
            gridRef.current.scrollTop += 12;
          }
        }}
      >
        {value.clips.length ? (
          value.clips.map((clip, index) => (
            <VideoComposeClipCard
              key={clip.id}
              clip={clip}
              index={index}
              last={index === value.clips.length - 1}
              item={referenceMap.get(
                `${clip.video.assetId}:${clip.video.versionId}`,
              )}
              selected={clip.id === selectedClip?.id}
              readonly={readonly}
              onSelect={() => setSelectedClipId(clip.id)}
              onPanel={(panel) => openPanel(clip.id, panel)}
              onRemove={() => {
                const clips = value.clips.filter((item) => item.id !== clip.id);
                update({ ...value, clips });
                if (selectedClipId === clip.id) {
                  setSelectedClipId(clips[0]?.id || "");
                  setActivePanel("");
                }
              }}
              onDuration={(duration) => {
                if (Math.abs(duration - clip.duration) > 0.05) {
                  updateClip(clip.id, { duration });
                }
              }}
              onDragStart={() => setDraggedId(clip.id)}
              onDragOver={(event) => {
                event.preventDefault();
                const bounds = event.currentTarget.getBoundingClientRect();
                const sameRow = Math.abs(event.clientY - (bounds.top + bounds.height / 2)) <
                  bounds.height / 3;
                setDragPlacement(
                  sameRow
                    ? event.clientX < bounds.left + bounds.width / 2
                      ? "before"
                      : "after"
                    : event.clientY < bounds.top + bounds.height / 2
                      ? "before"
                      : "after",
                );
              }}
              onDrop={() => {
                const clips = moveOrderedItemById(
                  value.clips,
                  draggedId,
                  clip.id,
                  dragPlacement,
                  (item) => item.id,
                );
                if (clips !== value.clips) {
                  update({ ...value, clips });
                }
                setDraggedId("");
              }}
              onDragEnd={() => setDraggedId("")}
            />
          ))
        ) : (
          <button
            type="button"
            className="ws-video-compose-empty"
            disabled={readonly}
            onClick={() => setPickerTarget("clip")}
          >
            <Clapperboard size={26} />
            <strong>等待添加镜头</strong>
            <span>从当前画布选择已经生成的视频素材</span>
          </button>
        )}
      </div>

      {selectedClip && activePanel ? (
        <VideoComposeClipInspector
          clip={selectedClip}
          panel={activePanel}
          readonly={readonly}
          onChange={(patch) => updateClip(selectedClip.id, patch)}
          onChooseVoice={() => setPickerTarget("voice")}
        />
      ) : null}

      {fullScreen ? (
        <VideoComposeGlobalSettings
          composition={value}
          readonly={readonly}
          onChange={update}
          onChooseBackground={() => setPickerTarget("background")}
        />
      ) : null}
    </section>
  );

  return (
    <>
      {fullScreen ? (
        <div className="ws-video-compose-workspace">
          <div className="ws-video-compose-operations">{editor}</div>
          <VideoComposePreview
            clip={selectedClip}
            item={selectedItem}
            finalOutput={finalOutput}
          />
        </div>
      ) : (
        editor
      )}
      {pickerTarget ? (
        <VideoComposeAssetPicker
          title={
            pickerTarget === "clip"
              ? "添加镜头"
              : pickerTarget === "voice"
                ? "选择配音"
                : "选择背景音乐"
          }
          kind={pickerTarget === "clip" ? "video" : "audio"}
          items={referenceItems}
          onSelect={chooseReference}
          onClose={() => setPickerTarget("")}
        />
      ) : null}
    </>
  );
}

function VideoComposeClipInspector({
  clip,
  panel,
  readonly,
  onChange,
  onChooseVoice,
}: {
  clip: VideoComposeClip;
  panel: VideoComposeClipPanel;
  readonly: boolean;
  onChange: (patch: Partial<VideoComposeClip>) => void;
  onChooseVoice: () => void;
}) {
  return (
    <div className="ws-video-compose-inspector nodrag nowheel">
      <strong>
        {panel === "subtitle"
          ? "字幕"
          : panel === "sound"
            ? "声音"
            : "转场"}
      </strong>
      {panel === "subtitle" ? (
        <textarea
          value={clip.subtitle}
          readOnly={readonly}
          placeholder="输入当前镜头字幕..."
          onChange={(event) => onChange({ subtitle: event.target.value })}
        />
      ) : panel === "sound" ? (
        <div className="ws-video-compose-sound-fields">
          <label>
            <input
              type="checkbox"
              checked={clip.sound.keepOriginal}
              disabled={readonly}
              onChange={(event) =>
                onChange({
                  sound: {
                    ...clip.sound,
                    keepOriginal: event.target.checked,
                  },
                })
              }
            />
            保留原声
          </label>
          <label>
            <span>原声音量</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={clip.sound.originalVolume}
              disabled={readonly || !clip.sound.keepOriginal}
              onChange={(event) =>
                onChange({
                  sound: {
                    ...clip.sound,
                    originalVolume: Number(event.target.value),
                  },
                })
              }
            />
            <small>{Math.round(clip.sound.originalVolume * 100)}%</small>
          </label>
          <button type="button" disabled={readonly} onClick={onChooseVoice}>
            <Volume2 size={13} />
            {clip.sound.voice ? clip.sound.voice.label || "更换配音" : "选择配音"}
          </button>
          {clip.sound.voice ? (
            <>
              <label>
                <span>配音音量</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={clip.sound.voiceVolume}
                  disabled={readonly}
                  onChange={(event) =>
                    onChange({
                      sound: {
                        ...clip.sound,
                        voiceVolume: Number(event.target.value),
                      },
                    })
                  }
                />
                <small>{Math.round(clip.sound.voiceVolume * 100)}%</small>
              </label>
              <button
                type="button"
                disabled={readonly}
                onClick={() =>
                  onChange({ sound: { ...clip.sound, voice: undefined } })
                }
              >
                移除配音
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <div className="ws-video-compose-transition-fields">
          {VIDEO_COMPOSE_TRANSITIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={
                clip.transitionToNext.type === option.key ? "is-active" : ""
              }
              disabled={readonly}
              onClick={() =>
                onChange({
                  transitionToNext: {
                    ...clip.transitionToNext,
                    type: option.key,
                  },
                })
              }
            >
              {option.name}
            </button>
          ))}
          {clip.transitionToNext.type !== "none" ? (
            <label>
              <span>时长</span>
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={clip.transitionToNext.durationMs / 1000}
                readOnly={readonly}
                onChange={(event) =>
                  onChange({
                    transitionToNext: {
                      ...clip.transitionToNext,
                      durationMs: Math.round(Number(event.target.value) * 1000),
                    },
                  })
                }
              />
              秒
            </label>
          ) : null}
        </div>
      )}
    </div>
  );
}

function VideoComposeGlobalSettings({
  composition,
  readonly,
  onChange,
  onChooseBackground,
}: {
  composition: CanvasVideoComposition;
  readonly: boolean;
  onChange: (composition: CanvasVideoComposition) => void;
  onChooseBackground: () => void;
}) {
  return (
    <div className="ws-video-compose-global nodrag">
      <label>
        <span>分辨率</span>
        <select
          value={composition.settings.resolution}
          disabled={readonly}
          onChange={(event) =>
            onChange({
              ...composition,
              settings: {
                ...composition.settings,
                resolution: event.target.value,
              },
            })
          }
        >
          <option value="1280x720">720P</option>
          <option value="1920x1080">1080P</option>
          <option value="3840x2160">4K</option>
        </select>
      </label>
      <label>
        <span>帧率</span>
        <select
          value={composition.settings.fps}
          disabled={readonly}
          onChange={(event) =>
            onChange({
              ...composition,
              settings: {
                ...composition.settings,
                fps: Number(event.target.value),
              },
            })
          }
        >
          {[24, 25, 30, 50, 60].map((fps) => (
            <option key={fps} value={fps}>
              {fps} 帧/秒
            </option>
          ))}
        </select>
      </label>
      <button type="button" disabled={readonly} onClick={onChooseBackground}>
        <Music2 size={13} />
        {composition.settings.backgroundMusic?.label || "选择背景音乐"}
      </button>
      {composition.settings.backgroundMusic ? (
        <>
          <label>
            <span>背景音乐音量</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={composition.settings.backgroundMusicVolume}
              disabled={readonly}
              onChange={(event) =>
                onChange({
                  ...composition,
                  settings: {
                    ...composition.settings,
                    backgroundMusicVolume: Number(event.target.value),
                  },
                })
              }
            />
            <small>
              {Math.round(composition.settings.backgroundMusicVolume * 100)}%
            </small>
          </label>
          <button
            type="button"
            disabled={readonly}
            title="移除背景音乐"
            onClick={() =>
              onChange({
                ...composition,
                settings: {
                  ...composition.settings,
                  backgroundMusic: undefined,
                },
              })
            }
          >
            <Trash2 size={13} />
            移除
          </button>
        </>
      ) : null}
    </div>
  );
}

function VideoComposePreview({
  clip,
  item,
  finalOutput,
}: {
  clip?: VideoComposeClip;
  item?: ComposerAssetItem;
  finalOutput?: unknown;
}) {
  const videoUrl = item?.preview.videoUrl || "";
  const hasFinalOutput = hasCanvasContent(finalOutput);
  const [mode, setMode] = useState<"clip" | "final">(
    hasFinalOutput ? "final" : "clip",
  );

  useEffect(() => {
    if (hasFinalOutput) {
      setMode("final");
    }
  }, [hasFinalOutput, finalOutput]);

  const showFinalOutput = mode === "final" && hasFinalOutput;
  return (
    <aside className="ws-video-compose-preview">
      <header>
        <strong>
          {showFinalOutput ? "合成结果" : clip?.title || "视频预览"}
        </strong>
        <div className="ws-video-compose-preview-modes">
          <button
            type="button"
            className={!showFinalOutput ? "is-active" : ""}
            disabled={!clip}
            onClick={() => setMode("clip")}
          >
            当前镜头
          </button>
          <button
            type="button"
            className={showFinalOutput ? "is-active" : ""}
            disabled={!hasFinalOutput}
            onClick={() => setMode("final")}
          >
            合成结果
          </button>
        </div>
      </header>
      <div>
        {showFinalOutput ? (
          <CanvasNodeContentView
            output={finalOutput}
            fallback="视频合成结果"
            className="ws-video-compose-final-output"
          />
        ) : videoUrl ? (
          <video key={videoUrl} src={videoUrl} controls playsInline preload="metadata" />
        ) : item?.preview.imageUrl ? (
          <img src={item.preview.imageUrl} alt="" />
        ) : (
          <span>
            <Play size={28} />
            选择左侧镜头后预览
          </span>
        )}
      </div>
    </aside>
  );
}

function createVideoComposeClip(
  reference: VideoComposeAssetReference,
): VideoComposeClip {
  return {
    id: uniqueClipId(),
    title: reference.label || "镜头",
    video: reference,
    duration: 0,
    subtitle: "",
    sound: {
      keepOriginal: true,
      originalVolume: 1,
      voiceVolume: 1,
    },
    transitionToNext: {
      type: "none",
      durationMs: 500,
    },
  };
}

function referenceFromItem(
  item: ComposerAssetItem,
): VideoComposeAssetReference | null {
  const assetId = Number(item.refId || 0);
  const versionId = Number(item.versionID || 0);
  if (!assetId || !versionId) {
    return null;
  }
  return { assetId, versionId, label: item.title };
}

function findReferenceItem(
  items: ComposerAssetItem[],
  reference: VideoComposeAssetReference,
) {
  return items.find(
    (item) =>
      Number(item.refId || 0) === reference.assetId &&
      Number(item.versionID || 0) === reference.versionId,
  );
}

function uniqueClipId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `clip-${crypto.randomUUID()}`;
  }
  return `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDuration(value: number) {
  return value >= 10 ? Math.round(value).toString() : value.toFixed(1);
}
