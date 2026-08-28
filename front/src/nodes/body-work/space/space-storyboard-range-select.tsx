import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { ComposerMenu } from "./space-prompt-composer";
import {
  formatStoryboardRangeTime,
  normalizeStoryboardRangeSelection,
  splitStoryboardRangeTime,
  storyboardRangePositionBounds,
  storyboardRangeTimeMilliseconds,
} from "./space-storyboard-range";

const MILLISECONDS_PER_SECOND = 1000;

export function StoryboardRangeSelect({
  startMs,
  endMs,
  soundtrackDurationMs,
  soundtrackUrl,
  disabled = false,
  openKey,
  onToggle,
  onChange,
}: {
  startMs: number;
  endMs?: number;
  soundtrackDurationMs?: number;
  soundtrackUrl?: string;
  disabled?: boolean;
  openKey: string;
  onToggle: (key: string) => void;
  onChange: (startMs: number, endMs?: number) => void;
}) {
  const soundtrackDuration = useSoundtrackDuration(
    soundtrackDurationMs,
    soundtrackUrl,
  );
  const savedSelection = useMemo(
    () =>
      normalizeStoryboardRangeSelection(
        startMs,
        endMs,
        soundtrackDuration.durationMs,
      ),
    [endMs, soundtrackDuration.durationMs, startMs],
  );
  const selectionKey = savedSelection
    ? `${savedSelection.startMs}:${savedSelection.endMs}:${savedSelection.soundtrackDurationMs}`
    : "unavailable";
  const [draft, setDraft] = useState<{
    key: string;
    startMs: number;
    endMs?: number;
  }>({ key: "", startMs: 0 });
  const selectedStartMs =
    draft.key === selectionKey ? draft.startMs : savedSelection?.startMs || 0;
  const selectedEndMs =
    draft.key === selectionKey ? draft.endMs : savedSelection?.endMs;
  const selection = normalizeStoryboardRangeSelection(
    selectedStartMs,
    selectedEndMs,
    soundtrackDuration.durationMs,
  );
  const bounds = selection
    ? storyboardRangePositionBounds(selection)
    : undefined;
  const fullSoundtrack = Boolean(
    savedSelection &&
    savedSelection.startMs === 0 &&
    savedSelection.endMs === savedSelection.soundtrackDurationMs,
  );
  const label = savedSelection
    ? fullSoundtrack
      ? "全曲"
      : `${formatStoryboardRangeTime(savedSelection.startMs)}–${formatStoryboardRangeTime(savedSelection.endMs)}`
    : "制作范围";

  return (
    <ComposerMenu
      id="storyboard-time-range"
      openKey={openKey}
      label={label}
      icon={<Clock3 size={15} />}
      filled={Boolean(savedSelection && !fullSoundtrack)}
      disabled={disabled}
      onToggle={onToggle}
    >
      <form
        className="ws-storyboard-range-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!selection) {
            return;
          }
          onChange(selection.startMs, selection.endMs);
          onToggle("");
        }}
      >
        {selection && bounds ? (
          <>
            <StoryboardRangeTimeSelect
              label="开始位置"
              ariaLabelPrefix="开始位置"
              valueMs={selection.startMs}
              minMs={bounds.start.minMs}
              maxMs={bounds.start.maxMs}
              disabled={disabled}
              onChange={(nextStartMs) =>
                setDraft({
                  key: selectionKey,
                  startMs: nextStartMs,
                  endMs: selection.endMs,
                })
              }
            />
            <StoryboardRangeTimeSelect
              label="结束位置"
              ariaLabelPrefix="结束位置"
              valueMs={selection.endMs}
              minMs={bounds.end.minMs}
              maxMs={bounds.end.maxMs}
              disabled={disabled}
              onChange={(nextEndMs) =>
                setDraft({
                  key: selectionKey,
                  startMs: selection.startMs,
                  endMs: nextEndMs,
                })
              }
            />
          </>
        ) : (
          <p className="ws-storyboard-range-status">
            {soundtrackDuration.loading
              ? "正在读取音轨时长..."
              : "无法读取音轨时长"}
          </p>
        )}
        <button type="submit" disabled={disabled || !selection}>
          确定
        </button>
      </form>
    </ComposerMenu>
  );
}

function StoryboardRangeTimeSelect({
  label,
  ariaLabelPrefix,
  valueMs,
  minMs,
  maxMs,
  disabled,
  onChange,
}: {
  label: string;
  ariaLabelPrefix: string;
  valueMs: number;
  minMs: number;
  maxMs: number;
  disabled: boolean;
  onChange: (valueMs: number) => void;
}) {
  const value = splitStoryboardRangeTime(valueMs);
  const minimum = splitStoryboardRangeTime(minMs);
  const maximum = splitStoryboardRangeTime(maxMs);
  const minuteOptions = numberRange(minimum.minutes, maximum.minutes);
  const secondBounds = secondsBoundsForMinute(value.minutes, minimum, maximum);
  const secondOptions = numberRange(secondBounds.minimum, secondBounds.maximum);

  return (
    <div className="ws-storyboard-range-field">
      <span>{label}</span>
      <div className="ws-storyboard-range-time">
        <select
          value={value.minutes}
          disabled={disabled}
          aria-label={`${ariaLabelPrefix}分钟`}
          onChange={(event) => {
            const minutes = Number(event.target.value);
            const nextSecondBounds = secondsBoundsForMinute(
              minutes,
              minimum,
              maximum,
            );
            onChange(
              storyboardRangeTimeMilliseconds({
                minutes,
                seconds: clamp(
                  value.seconds,
                  nextSecondBounds.minimum,
                  nextSecondBounds.maximum,
                ),
              }),
            );
          }}
        >
          {minuteOptions.map((minute) => (
            <option key={minute} value={minute}>
              {minute}分
            </option>
          ))}
        </select>
        <select
          value={value.seconds}
          disabled={disabled}
          aria-label={`${ariaLabelPrefix}秒数`}
          onChange={(event) =>
            onChange(
              storyboardRangeTimeMilliseconds({
                ...value,
                seconds: Number(event.target.value),
              }),
            )
          }
        >
          {secondOptions.map((second) => (
            <option key={second} value={second}>
              {String(second).padStart(2, "0")}秒
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function useSoundtrackDuration(
  configuredDurationMs?: number,
  soundtrackUrl?: string,
) {
  const configuredDuration = wholeSecondDuration(configuredDurationMs);
  const audioUrl = String(soundtrackUrl || "").trim();
  const [probe, setProbe] = useState({
    audioUrl: "",
    durationMs: 0,
    failed: false,
  });

  useEffect(() => {
    if (configuredDuration || !audioUrl) {
      return;
    }
    const audio = document.createElement("audio");
    let active = true;
    const finish = (durationMs: number) => {
      if (!active) {
        return;
      }
      const duration = wholeSecondDuration(durationMs);
      setProbe({ audioUrl, durationMs: duration, failed: !duration });
    };
    const handleLoadedMetadata = () => finish(audio.duration * 1000);
    const handleError = () => finish(0);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.src = audioUrl;
    audio.load();
    return () => {
      active = false;
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeAttribute("src");
      audio.load();
    };
  }, [audioUrl, configuredDuration]);

  const currentProbe = probe.audioUrl === audioUrl ? probe : undefined;
  const durationMs = configuredDuration || currentProbe?.durationMs || 0;
  return {
    durationMs,
    loading: !durationMs && Boolean(audioUrl) && !currentProbe?.failed,
  };
}

function secondsBoundsForMinute(
  minutes: number,
  minimum: ReturnType<typeof splitStoryboardRangeTime>,
  maximum: ReturnType<typeof splitStoryboardRangeTime>,
) {
  return {
    minimum: minutes === minimum.minutes ? minimum.seconds : 0,
    maximum: minutes === maximum.minutes ? maximum.seconds : 59,
  };
}

function numberRange(minimum: number, maximum: number) {
  return Array.from(
    { length: Math.max(0, maximum - minimum + 1) },
    (_, index) => minimum + index,
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function wholeSecondDuration(value?: number) {
  const duration = Number(value);
  return Number.isFinite(duration) && duration >= MILLISECONDS_PER_SECOND
    ? Math.floor(duration / MILLISECONDS_PER_SECOND) * MILLISECONDS_PER_SECOND
    : 0;
}
