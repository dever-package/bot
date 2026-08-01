import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, X } from "lucide-react";
import {
  normalizeStoryboardProductionPlan,
  storyboardHasVisibleDialogue,
  storyboardProductionIncludesComposition,
  storyboardProductionIncludesLipSync,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardSpeechCount,
  storyboardSubtitleCount,
  storyboardTotalDuration,
  type StoryboardDocument,
  type StoryboardOutputTarget,
  type StoryboardProductionMode,
  type StoryboardProductionPlan,
} from "./space-storyboard";

const OUTPUT_TARGETS: Array<{
  value: StoryboardOutputTarget;
  title: string;
  description: string;
}> = [
  {
    value: "shot_images",
    title: "生成故事板",
    description: "生成素材设定和逐镜头故事板关键帧，之后可在画布中自行连接视频节点。",
  },
  {
    value: "shot_videos",
    title: "生成镜头视频",
    description: "生成各个镜头及所选附加内容，不创建最终视频合成。",
  },
  {
    value: "final_video",
    title: "生成完整成片",
    description: "创建完整镜头制作流程和视频合成，继续完成整条成片。",
  },
];

export function StoryboardConfirmDialog({
  storyboard,
  submitting,
  portalContainer,
  onClose,
  onConfirm,
}: {
  storyboard: StoryboardDocument;
  submitting: boolean;
  portalContainer: Element | null;
  onClose: () => void;
  onConfirm: (plan: StoryboardProductionPlan) => boolean | Promise<boolean>;
}) {
  const [plan, setPlan] = useState<StoryboardProductionPlan>(() =>
    confirmationProductionPlan(storyboard.production_plan),
  );
  const speechCount = storyboardSpeechCount(storyboard);
  const subtitleCount = storyboardSubtitleCount(storyboard);
  const hasVisibleDialogue = storyboard.shots.some(
    storyboardHasVisibleDialogue,
  );
  const effectiveStoryboard = useMemo(
    () => ({ ...storyboard, production_plan: plan }),
    [plan, storyboard],
  );
  const productionSteps = useMemo(
    () => storyboardProductionSteps(effectiveStoryboard),
    [effectiveStoryboard],
  );
  const includesShotVideos = storyboardProductionIncludesShotVideos(
    effectiveStoryboard,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  const updateMode = (
    key: "voice_mode" | "subtitle_mode" | "lip_sync_mode",
    enabled: boolean,
  ) => {
    setPlan((current) => ({
      ...current,
      [key]: enabled ? "auto" : "off",
    }));
  };

  const submit = async () => {
    const confirmed = await onConfirm(
      effectiveProductionPlan(plan, {
        speech: speechCount > 0,
        subtitles: subtitleCount > 0,
        visibleDialogue: hasVisibleDialogue,
      }),
    );
    if (confirmed) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop"
      onMouseDown={() => {
        if (!submitting) {
          onClose();
        }
      }}
    >
      <section
        className="ws-storyboard-shot-dialog ws-storyboard-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="确认分镜制作方案"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <strong>确认分镜并创建制作区</strong>
            <span>确认后脚本进入只读状态，需要修改时可创建修订稿。</span>
          </div>
          <button
            type="button"
            aria-label="关闭"
            disabled={submitting}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="ws-storyboard-confirm-body nowheel">
          <div className="ws-storyboard-confirm-summary">
            <strong>{storyboard.title.trim() || "分镜脚本"}</strong>
            <span>{storyboard.shots.length} 个镜头</span>
            <span>{storyboardTotalDuration(storyboard)} 秒</span>
            <span>{speechCount} 条语音</span>
          </div>

          <fieldset className="ws-storyboard-confirm-section">
            <legend>产出目标</legend>
            <div className="ws-storyboard-output-options">
              {OUTPUT_TARGETS.map((option) => (
                <label
                  key={option.value}
                  className={
                    plan.output_target === option.value ? "is-selected" : ""
                  }
                >
                  <input
                    type="radio"
                    name="storyboard-output-target"
                    value={option.value}
                    checked={plan.output_target === option.value}
                    disabled={submitting}
                    onChange={() =>
                      setPlan((current) => ({
                        ...current,
                        output_target: option.value,
                      }))
                    }
                  />
                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                  {plan.output_target === option.value ? (
                    <Check size={16} aria-hidden="true" />
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>

          {includesShotVideos ? (
            <fieldset className="ws-storyboard-confirm-section">
              <legend>附加内容</legend>
              <ProductionSwitch
                title="配音"
                description={
                  speechCount > 0
                    ? `按脚本中的 ${speechCount} 条对白或旁白创建配音。`
                    : "当前脚本没有对白或旁白。"
                }
                checked={speechCount > 0 && plan.voice_mode === "auto"}
                disabled={submitting || speechCount === 0}
                onChange={(checked) => updateMode("voice_mode", checked)}
              />
              <ProductionSwitch
                title="字幕"
                description={
                  subtitleCount > 0
                    ? `按脚本中的 ${subtitleCount} 条字幕内容创建字幕组。`
                    : "当前脚本没有可用字幕内容。"
                }
                checked={
                  subtitleCount > 0 && plan.subtitle_mode === "auto"
                }
                disabled={submitting || subtitleCount === 0}
                onChange={(checked) => updateMode("subtitle_mode", checked)}
              />
              <ProductionSwitch
                title="口型同步"
                description={
                  hasVisibleDialogue
                    ? "仅对出镜对白创建口型同步，默认关闭。"
                    : "当前脚本没有需要同步口型的出镜对白。"
                }
                checked={
                  hasVisibleDialogue &&
                  plan.voice_mode === "auto" &&
                  plan.lip_sync_mode === "auto"
                }
                disabled={
                  submitting ||
                  !hasVisibleDialogue ||
                  plan.voice_mode !== "auto"
                }
                onChange={(checked) => updateMode("lip_sync_mode", checked)}
              />
            </fieldset>
          ) : null}

          <section className="ws-storyboard-confirm-section">
            <div className="ws-storyboard-confirm-section-title">
              <strong>制作流程</strong>
              <span>镜头参考图由分镜连续性自动判断，无需手动选择。</span>
            </div>
            <div className="ws-storyboard-production-flow">
              {productionSteps.map((step, index) => (
                <span key={step}>
                  {index > 0 ? <i aria-hidden="true">/</i> : null}
                  {step}
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer>
          <button type="button" disabled={submitting} onClick={onClose}>
            返回修改
          </button>
          <button
            type="button"
            className="is-primary"
            disabled={submitting}
            onClick={() => void submit()}
          >
            {submitting ? (
              <Loader2 size={15} className="ws-spin" />
            ) : (
              <Check size={15} />
            )}
            {submitting ? "确认中" : "确认并创建"}
          </button>
        </footer>
      </section>
    </div>,
    portalContainer || document.body,
  );
}

function ProductionSwitch({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`ws-storyboard-production-switch${disabled ? " is-disabled" : ""}`}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i aria-hidden="true" />
    </label>
  );
}

function effectiveProductionPlan(
  plan: StoryboardProductionPlan,
  available: {
    speech: boolean;
    subtitles: boolean;
    visibleDialogue: boolean;
  },
): StoryboardProductionPlan {
  if (!["shot_videos", "final_video"].includes(plan.output_target)) {
    return {
      ...plan,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off",
    };
  }
  const voiceMode: StoryboardProductionMode =
    available.speech && plan.voice_mode === "auto" ? "auto" : "off";
  return {
    ...plan,
    voice_mode: voiceMode,
    subtitle_mode:
      available.subtitles && plan.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode:
      available.visibleDialogue &&
      voiceMode === "auto" &&
      plan.lip_sync_mode === "auto"
        ? "auto"
        : "off",
  };
}

function storyboardProductionSteps(storyboard: StoryboardDocument) {
  if (storyboard.production_plan.output_target === "storyboard_only") {
    return ["确认分镜"];
  }
  const steps = [
    ...(storyboard.materials.length ? ["素材设定"] : []),
    "镜头参考图",
  ];
  if (storyboardProductionIncludesShotVideos(storyboard)) {
    steps.push("镜头视频");
  }
  if (storyboardProductionIncludesVoice(storyboard)) {
    steps.push("配音");
  }
  if (storyboardProductionIncludesSubtitles(storyboard)) {
    steps.push("字幕");
  }
  if (storyboardProductionIncludesLipSync(storyboard)) {
    steps.push("口型同步");
  }
  if (storyboardProductionIncludesComposition(storyboard)) {
    steps.push("视频合成");
  }
  return steps;
}

function confirmationProductionPlan(value: unknown): StoryboardProductionPlan {
  const plan = normalizeStoryboardProductionPlan(value);
  return plan.output_target === "storyboard_only"
    ? { ...plan, output_target: "shot_images" }
    : plan;
}
