import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Clapperboard,
  Loader2,
  Maximize2,
  Play,
  Plus,
  Volume2,
} from "lucide-react";
import type { ComposerAssetItem } from "./space-prompt-composer";
import {
  moveOrderedItemById,
  orderItemsByIds,
  sameOrderedIds,
} from "./space-ordered-list";
import {
  emptyVideoComposition,
  formatVideoComposeDuration,
  VIDEO_COMPOSE_TRANSITION_GROUPS,
  videoComposeReferenceKey,
  videoCompositionDuration,
  videoCompositionBlockingIssues,
  type CanvasVideoComposition,
  type VideoComposeAssetReference,
  type VideoComposeClip,
  type VideoComposeGlobalAudioTrack,
  type VideoComposeSpeechTrack,
  type VideoComposeTransitionType,
} from "./space-video-compose";
import {
  VideoComposeClipCard,
  type VideoComposeClipPanel,
} from "./space-video-compose-card";
import { VideoComposeAssetPicker } from "./space-video-compose-picker";
import { CanvasNodeContentView } from "./space-content-view";
import { hasContentOutput } from "../shared/content-output";
import { SpaceTooltip } from "./space-tooltip";
import { FirstFrameVideo } from "../../shared/first-frame-video";

const VIDEO_COMPOSE_RESOLUTION_OPTIONS = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" },
] as const;

type PickerTarget = "clip" | "original" | "speech" | "global";

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
  const [activePanel, setActivePanel] = useState<VideoComposeClipPanel | "">(
    "",
  );
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | "">("");
  const [draggedId, setDraggedId] = useState("");
  const [dragOverId, setDragOverId] = useState("");
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [dragPlacement, setDragPlacement] = useState<"before" | "after">(
    "before",
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const draggedIdRef = useRef("");
  const dragOrderRef = useRef<string[]>([]);
  const visibleClips = useMemo(
    () => orderItemsByIds(value.clips, dragOrder, (clip) => clip.id),
    [dragOrder, value.clips],
  );
  const selectedClip =
    value.clips.find((clip) => clip.id === selectedClipId) || value.clips[0];
  const selectedItem = selectedClip
    ? findReferenceItem(referenceItems, selectedClip.visualVideo)
    : undefined;
  const totalDuration = videoCompositionDuration(value);
  const blockingIssues = videoCompositionBlockingIssues(value);
  const runDisabled =
    running ||
    readonly ||
    value.clips.length === 0 ||
    blockingIssues.length > 0;

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
    } else if (pickerTarget === "original" && selectedClip) {
      updateClip(selectedClip.id, {
        originalAudioSource: reference,
      });
    } else if (pickerTarget === "speech" && selectedClip) {
      const track = createVideoComposeSpeechTrack(reference);
      updateClip(selectedClip.id, {
        speechTracks: [...selectedClip.speechTracks, track],
      });
    } else if (pickerTarget === "global") {
      update({
        ...value,
        audioTracks: [
          ...value.audioTracks,
          createVideoComposeGlobalAudioTrack(reference),
        ],
      });
    }
    setPickerTarget("");
  };
  const beginClipDrag = (clipId: string) => {
    const order = value.clips.map((clip) => clip.id);
    draggedIdRef.current = clipId;
    dragOrderRef.current = order;
    setDraggedId(clipId);
    setDragOverId("");
    setDragOrder(order);
  };
  const previewClipOrder = (
    targetId: string,
    event: DragEvent<HTMLElement>,
  ) => {
    const sourceId = draggedIdRef.current;
    const currentOrder = dragOrderRef.current;
    if (
      !sourceId ||
      !targetId ||
      sourceId === targetId ||
      !currentOrder.includes(sourceId) ||
      !currentOrder.includes(targetId)
    ) {
      return;
    }
    const targetRect = event.currentTarget.getBoundingClientRect();
    const gridRect = event.currentTarget.parentElement?.getBoundingClientRect();
    const hasMultipleColumns = Boolean(
      gridRect && targetRect.width * 1.5 < gridRect.width,
    );
    const placement = hasMultipleColumns
      ? event.clientX < targetRect.left + targetRect.width / 2
        ? "before"
        : "after"
      : event.clientY < targetRect.top + targetRect.height / 2
        ? "before"
        : "after";
    const nextOrder = moveOrderedItemById(
      currentOrder,
      sourceId,
      targetId,
      placement,
      (itemId) => itemId,
    );
    setDragOverId(targetId);
    setDragPlacement(placement);
    if (sameOrderedIds(currentOrder, nextOrder)) {
      return;
    }
    dragOrderRef.current = nextOrder;
    setDragOrder(nextOrder);
  };
  const resetClipDrag = () => {
    draggedIdRef.current = "";
    dragOrderRef.current = [];
    setDraggedId("");
    setDragOverId("");
    setDragOrder([]);
  };
  const commitClipOrder = () => {
    const clips = orderItemsByIds(
      value.clips,
      dragOrderRef.current,
      (clip) => clip.id,
    );
    if (
      !sameOrderedIds(
        value.clips.map((clip) => clip.id),
        clips.map((clip) => clip.id),
      )
    ) {
      update({ ...value, clips });
    }
    resetClipDrag();
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
            {totalDuration > 0
              ? ` · ${formatVideoComposeDuration(totalDuration)} 秒`
              : ""}
            {blockingIssues.length
              ? ` · ${blockingIssues.length} 项待处理`
              : ""}
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
            <SpaceTooltip label={blockingIssues[0] || "开始合成"}>
              <span className="ws-video-compose-tooltip-trigger">
                <button
                  type="button"
                  className="is-primary"
                  disabled={runDisabled}
                  onClick={() => onRun(value)}
                >
                  {running ? (
                    <Loader2 size={13} className="ws-spin" />
                  ) : (
                    <Play size={13} fill="currentColor" />
                  )}
                  {running ? "合成中" : "开始合成"}
                </button>
              </span>
            </SpaceTooltip>
          ) : null}
        </div>
      </header>

      <div
        ref={gridRef}
        className="ws-video-compose-grid nodrag nowheel"
        onDragOver={(event) => {
          if (!draggedIdRef.current || !gridRef.current) {
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
          visibleClips.map((clip, index) => (
            <VideoComposeClipCard
              key={clip.id}
              clip={clip}
              index={index}
              last={index === visibleClips.length - 1}
              item={referenceMap.get(
                videoComposeReferenceKey(clip.visualVideo),
              )}
              selected={clip.id === selectedClip?.id}
              readonly={readonly}
              wholeCardDraggable={fullScreen}
              dragging={draggedId === clip.id}
              dropPlacement={
                dragOverId === clip.id && draggedId !== clip.id
                  ? dragPlacement
                  : undefined
              }
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
                if (clip.duration <= 0 && duration > 0) {
                  updateClip(clip.id, {
                    duration: Math.max(1, Math.floor(duration)),
                  });
                }
              }}
              onDragStart={() => beginClipDrag(clip.id)}
              onDragOver={(event) => previewClipOrder(clip.id, event)}
              onDrop={commitClipOrder}
              onDragEnd={resetClipDrag}
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
          onChooseOriginal={() => setPickerTarget("original")}
          onChooseSpeech={() => setPickerTarget("speech")}
        />
      ) : null}

      {fullScreen ? (
        <VideoComposeGlobalSettings
          composition={value}
          readonly={readonly}
          onChooseAudio={() => setPickerTarget("global")}
          onChange={update}
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
              : pickerTarget === "original"
                ? "选择原声来源"
                : pickerTarget === "global"
                  ? "添加全片声音"
                  : "添加语音"
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
  onChooseOriginal,
  onChooseSpeech,
}: {
  clip: VideoComposeClip;
  panel: VideoComposeClipPanel;
  readonly: boolean;
  onChange: (patch: Partial<VideoComposeClip>) => void;
  onChooseOriginal: () => void;
  onChooseSpeech: () => void;
}) {
  return (
    <div className="ws-video-compose-inspector nodrag nowheel">
      <strong>
        {panel === "sound" ? "声音" : "转场"}
      </strong>
      {panel === "sound" ? (
        <div className="ws-video-compose-sound-fields">
          <button type="button" disabled={readonly} onClick={onChooseOriginal}>
            <Volume2 size={13} />
            {clip.originalAudioSource?.label || "选择原声来源"}
          </button>
          <label>
            <span>原声音量</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={clip.originalVolume}
              disabled={readonly || !clip.originalAudioSource}
              onChange={(event) =>
                onChange({
                  originalVolume: Number(event.target.value),
                })
              }
            />
            <small>{Math.round(clip.originalVolume * 100)}%</small>
          </label>
          {clip.originalAudioSource ? (
            <button
              type="button"
              disabled={readonly}
              onClick={() => onChange({ originalAudioSource: undefined })}
            >
              移除原声
            </button>
          ) : null}
          <button type="button" disabled={readonly} onClick={onChooseSpeech}>
            <Volume2 size={13} />
            添加语音
          </button>
          {clip.speechTracks.map((track, index) => (
            <div className="ws-video-compose-speech-track" key={track.id}>
              <strong>{track.audio?.label || `语音 ${index + 1}`}</strong>
              <label>
                <span>镜头起点</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={track.startTime}
                  readOnly={readonly}
                  onChange={(event) =>
                    onChange({
                      speechTracks: updateSpeechTrack(
                        clip.speechTracks,
                        track.id,
                        { startTime: Number(event.target.value) },
                      ),
                    })
                  }
                />
                秒
              </label>
              <label>
                <span>源起点</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={track.sourceStart}
                  readOnly={readonly}
                  onChange={(event) =>
                    onChange({
                      speechTracks: updateSpeechTrack(
                        clip.speechTracks,
                        track.id,
                        { sourceStart: Number(event.target.value) },
                      ),
                    })
                  }
                />
                秒
              </label>
              <label>
                <span>超出镜头</span>
                <select
                  value={track.fit}
                  disabled={readonly}
                  onChange={(event) =>
                    onChange({
                      speechTracks: updateSpeechTrack(
                        clip.speechTracks,
                        track.id,
                        {
                          fit: event.target.value as VideoComposeSpeechTrack["fit"],
                        },
                      ),
                    })
                  }
                >
                  <option value="trim">自动裁剪</option>
                  <option value="strict">阻止合成</option>
                </select>
              </label>
              <label>
                <span>音量</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={track.volume}
                  disabled={readonly}
                  onChange={(event) =>
                    onChange({
                      speechTracks: updateSpeechTrack(
                        clip.speechTracks,
                        track.id,
                        { volume: Number(event.target.value) },
                      ),
                    })
                  }
                />
                <small>{Math.round(track.volume * 100)}%</small>
              </label>
              <button
                type="button"
                disabled={readonly}
                onClick={() =>
                  onChange({
                    speechTracks: clip.speechTracks.filter(
                      (item) => item.id !== track.id,
                    ),
                  })
                }
              >
                移除
              </button>
            </div>
          ))}
          {clip.blockingIssues.length ? (
            <div className="ws-video-compose-blocking">
              {clip.blockingIssues.map((issue) => (
                <span key={issue}>{issue}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="ws-video-compose-transition-fields">
          <label>
            <span>转场</span>
            <select
              value={clip.transitionToNext.type}
              disabled={readonly}
              onChange={(event) =>
                onChange({
                  transitionToNext: {
                    ...clip.transitionToNext,
                    type: event.target.value as VideoComposeTransitionType,
                  },
                })
              }
            >
              {VIDEO_COMPOSE_TRANSITION_GROUPS.map((group) => (
                <optgroup key={group.name} label={group.name}>
                  {group.options.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
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
  onChooseAudio,
  onChange,
}: {
  composition: CanvasVideoComposition;
  readonly: boolean;
  onChooseAudio: () => void;
  onChange: (composition: CanvasVideoComposition) => void;
}) {
  const knownResolution = VIDEO_COMPOSE_RESOLUTION_OPTIONS.some(
    (option) => option.value === composition.settings.resolution,
  );
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
          {!knownResolution ? (
            <option value={composition.settings.resolution}>
              {composition.settings.resolution.replace("x", " × ")}
            </option>
          ) : null}
          {VIDEO_COMPOSE_RESOLUTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
          <option value={0}>跟随首个镜头</option>
          {[24, 25, 30, 50, 60].map((fps) => (
            <option key={fps} value={fps}>
              {fps} 帧/秒
            </option>
          ))}
        </select>
      </label>
      <div className="ws-video-compose-global-audio">
        <div className="ws-video-compose-global-audio-head">
          <strong>全片声音</strong>
          <button type="button" disabled={readonly} onClick={onChooseAudio}>
            <Plus size={13} />
            添加全片声音
          </button>
        </div>
        {composition.audioTracks.map((track, index) => (
          <div className="ws-video-compose-speech-track" key={track.id}>
            <strong>{track.audio?.label || `全片声音 ${index + 1}`}</strong>
            <label>
              <span>类型</span>
              <select
                value={track.kind}
                disabled={readonly}
                onChange={(event) => {
                  const kind = event.target.value as VideoComposeGlobalAudioTrack["kind"];
                  onChange({
                    ...composition,
                    audioTracks: updateGlobalAudioTrack(
                      composition.audioTracks,
                      track.id,
                      {
                        kind,
                        fit: kind === "music" ? "trim" : "strict",
                        loop: kind === "music" && track.loop,
                        fadeOut: kind === "music" ? Math.max(1, track.fadeOut) : 0,
                      },
                    ),
                  });
                }}
              >
                <option value="music">背景音乐</option>
                <option value="narration">全片语音</option>
              </select>
            </label>
            <label>
              <span>全片起点</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={track.startTime}
                readOnly={readonly}
                onChange={(event) =>
                  onChange({
                    ...composition,
                    audioTracks: updateGlobalAudioTrack(
                      composition.audioTracks,
                      track.id,
                      { startTime: Number(event.target.value) },
                    ),
                  })
                }
              />
              秒
            </label>
            <label>
              <span>源起点</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={track.sourceStart}
                readOnly={readonly}
                onChange={(event) =>
                  onChange({
                    ...composition,
                    audioTracks: updateGlobalAudioTrack(
                      composition.audioTracks,
                      track.id,
                      { sourceStart: Number(event.target.value) },
                    ),
                  })
                }
              />
              秒
            </label>
            <label>
              <span>超出全片</span>
              <select
                value={track.fit}
                disabled={readonly}
                onChange={(event) =>
                  onChange({
                    ...composition,
                    audioTracks: updateGlobalAudioTrack(
                      composition.audioTracks,
                      track.id,
                      {
                        fit: event.target.value as VideoComposeGlobalAudioTrack["fit"],
                      },
                    ),
                  })
                }
              >
                <option value="trim">自动裁剪</option>
                <option value="strict">阻止合成</option>
              </select>
            </label>
            {track.kind === "music" ? (
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={track.loop}
                    disabled={readonly}
                    onChange={(event) =>
                      onChange({
                        ...composition,
                        audioTracks: updateGlobalAudioTrack(
                          composition.audioTracks,
                          track.id,
                          { loop: event.target.checked },
                        ),
                      })
                    }
                  />
                  <span>循环铺满</span>
                </label>
                <label>
                  <span>淡出</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={track.fadeOut}
                    readOnly={readonly}
                    onChange={(event) =>
                      onChange({
                        ...composition,
                        audioTracks: updateGlobalAudioTrack(
                          composition.audioTracks,
                          track.id,
                          { fadeOut: Number(event.target.value) },
                        ),
                      })
                    }
                  />
                  秒
                </label>
              </>
            ) : null}
            <label>
              <span>音量</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={track.volume}
                disabled={readonly}
                onChange={(event) =>
                  onChange({
                    ...composition,
                    audioTracks: updateGlobalAudioTrack(
                      composition.audioTracks,
                      track.id,
                      { volume: Number(event.target.value) },
                    ),
                  })
                }
              />
              <small>{Math.round(track.volume * 100)}%</small>
            </label>
            <button
              type="button"
              disabled={readonly}
              onClick={() =>
                onChange({
                  ...composition,
                  audioTracks: composition.audioTracks.filter(
                    (item) => item.id !== track.id,
                  ),
                })
              }
            >
              移除
            </button>
          </div>
        ))}
      </div>
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
  const hasFinalOutput = hasContentOutput(finalOutput);
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
          <FirstFrameVideo
            key={videoUrl}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : item?.preview.imageUrl ? (
          <img
            src={item.preview.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
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
    visualVideo: reference,
    originalAudioSource: reference,
    duration: 0,
    originalVolume: 1,
    speechTracks: [],
    subtitleTracks: [],
    useOriginalVideo: false,
    blockingIssues: [],
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
  reference?: VideoComposeAssetReference,
) {
  if (!reference) {
    return undefined;
  }
  return items.find(
    (item) =>
      Number(item.refId || 0) === reference.assetId &&
      Number(item.versionID || 0) === reference.versionId,
  );
}

function createVideoComposeSpeechTrack(
  audio: VideoComposeAssetReference,
): VideoComposeSpeechTrack {
  return {
    id: uniqueTrackId(),
    audio,
    startTime: 0,
    sourceStart: 0,
    fit: "trim",
    kind: "dialogue",
    text: "",
    volume: 1,
  };
}

function createVideoComposeGlobalAudioTrack(
  audio: VideoComposeAssetReference,
): VideoComposeGlobalAudioTrack {
  return {
    id: uniqueTrackId("global-audio"),
    audio,
    startTime: 0,
    sourceStart: 0,
    kind: "music",
    volume: 0.35,
    fit: "trim",
    loop: false,
    fadeOut: 1,
  };
}

function updateSpeechTrack(
  tracks: VideoComposeSpeechTrack[],
  trackId: string,
  patch: Partial<VideoComposeSpeechTrack>,
) {
  return tracks.map((track) =>
    track.id === trackId ? { ...track, ...patch } : track,
  );
}

function updateGlobalAudioTrack(
  tracks: VideoComposeGlobalAudioTrack[],
  trackId: string,
  patch: Partial<VideoComposeGlobalAudioTrack>,
) {
  return tracks.map((track) =>
    track.id === trackId ? { ...track, ...patch } : track,
  );
}

function uniqueClipId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `clip-${crypto.randomUUID()}`;
  }
  return `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function uniqueTrackId(prefix = "speech") {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
