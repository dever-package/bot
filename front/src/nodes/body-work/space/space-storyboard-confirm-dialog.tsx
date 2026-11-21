import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@dever/front-plugin";
import { Check, Loader2, X } from "lucide-react";
import { useId, useMemo, useState, type ReactNode } from "react";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "../shared/detail-dialog";
import {
  storyboardConfirmationProductionPlan,
  storyboardProductionIncludesComposition,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardSpeechCount,
  storyboardSubtitleCount,
  storyboardTotalDuration,
  storyboardUsesSoundtrackOnlyAudio,
  type StoryboardDocument,
  type StoryboardOutputTarget,
  type StoryboardVoiceMode,
  type StoryboardProductionPlan,
} from "./space-storyboard";
import "./space-storyboard-view.css";

type OutputTargetOption = {
  value: StoryboardOutputTarget;
  title: string;
  description: string;
};

const OUTPUT_TARGETS: OutputTargetOption[] = [
  {
    value: "shot_images",
    title: "参考图",
    description: "生成素材设定和逐镜参考图，之后可自行连线继续制作。",
  },
  {
    value: "shot_videos",
    title: "镜头视频",
    description: "生成参考图、各镜头视频和所选附加内容，不创建最终合成。",
  },
  {
    value: "final_video",
    title: "完整视频",
    description: "生成参考图、各镜头视频和所选附加内容，并完成视频合成。",
  },
];

const VOICE_OPTIONS: { value: StoryboardVoiceMode; title: string }[] = [
  { value: "native", title: "视频原声" },
  { value: "auto", title: "独立配音" },
  { value: "off", title: "不加声音" },
];

export function StoryboardConfirmDialog({
  errorFeedback,
  storyboard,
  submitting,
  onClose,
  onConfirm,
}: {
  storyboard: StoryboardDocument;
  errorFeedback?: ReactNode;
  submitting: boolean;
  onClose: () => void;
  onConfirm: (plan: StoryboardProductionPlan) => boolean | Promise<boolean>;
}) {
  const [plan, setPlan] = useState<StoryboardProductionPlan>(() =>
    storyboardConfirmationProductionPlan(storyboard),
  );
  const speechCount = storyboardSpeechCount(storyboard);
  const subtitleCount = storyboardSubtitleCount(storyboard);
  const soundtrackOnly = storyboardUsesSoundtrackOnlyAudio(storyboard);
  const voiceGroupId = useId();
  const effectivePlan = useMemo(
    () =>
      effectiveProductionPlan(plan, {
        speech: speechCount > 0,
        subtitles: subtitleCount > 0,
        soundtrackOnly,
      }),
    [plan, speechCount, subtitleCount, soundtrackOnly],
  );
  const effectiveStoryboard = useMemo(
    () => ({ ...storyboard, production_plan: effectivePlan }),
    [effectivePlan, storyboard],
  );
  const productionSteps = useMemo(
    () => storyboardProductionSteps(effectiveStoryboard),
    [effectiveStoryboard],
  );
  const includesShotVideos = storyboardProductionIncludesShotVideos(
    effectiveStoryboard,
  );
  const voiceDescription = effectivePlan.voice_mode === "native"
    ? `需要支持原声的视频模型。${speechCount > 0 ? "按脚本生成台词与环境声。" : "只生成环境声与动作音效。"}`
    : effectivePlan.voice_mode === "auto"
      ? `按脚本中的 ${speechCount} 条对白或旁白创建配音。`
      : "不生成配音，合成时静音镜头原声。";

  const [returnFocus] = useState(() =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null,
  );

  const submit = async () => {
    const confirmed = await onConfirm(effectivePlan);
    if (confirmed) {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(open: boolean) => !open && !submitting && onClose()}>
      <DialogContent
        className="ws-storyboard-shot-dialog ws-storyboard-confirm-dialog nodrag nopan nowheel"
        layerClassName="wb-detail-backdrop is-dialog-layer"
        layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX}
        showCloseButton={false}
        onCloseAutoFocus={(event: Event) => {
          if (returnFocus?.isConnected) {
            event.preventDefault();
            returnFocus.focus({ preventScroll: true });
          }
        }}
      >
        <header>
          <div>
            <DialogTitle>确认分镜</DialogTitle>
            <DialogDescription asChild>
              <span>这一步只创建制作区，点击「开始制作」后才会生成内容。</span>
            </DialogDescription>
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
          {errorFeedback}
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
              <legend>声音与字幕</legend>
              {soundtrackOnly ? (
                <p className="ws-storyboard-confirm-note">MV 只使用歌曲音轨，不生成配音或字幕。</p>
              ) : (
                <>
                  <div className="ws-storyboard-voice-options" role="radiogroup" aria-label="声音模式" aria-describedby={voiceGroupId}>
                    {VOICE_OPTIONS.map(({ value, title }) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name={voiceGroupId}
                          value={value}
                          checked={effectivePlan.voice_mode === value}
                          disabled={submitting || (value === "auto" && speechCount === 0)}
                          onChange={() => setPlan((current) => ({ ...current, voice_mode: value }))}
                        />
                        {title}
                      </label>
                    ))}
                  </div>
                  <p id={voiceGroupId} className="ws-storyboard-confirm-note">
                    {voiceDescription}
                    {speechCount === 0 ? " 没有对白或旁白，不能独立配音。" : null}
                  </p>
                  <ProductionSwitch
                    title="字幕"
                    description={
                      subtitleCount > 0
                        ? `按脚本中的 ${subtitleCount} 条字幕内容创建字幕组。`
                        : "当前脚本没有可用字幕内容。"
                    }
                    checked={effectivePlan.subtitle_mode === "auto"}
                    disabled={submitting || subtitleCount === 0}
                    onChange={(checked) => setPlan((current) => ({ ...current, subtitle_mode: checked ? "auto" : "off" }))}
                  />
                </>
              )}
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
            {submitting ? "创建中" : "确认并创建制作区"}
          </button>
        </footer>
      </DialogContent>
    </Dialog>
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
        role="switch"
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
    soundtrackOnly: boolean;
  },
): StoryboardProductionPlan {
  if (available.soundtrackOnly || !["shot_videos", "final_video"].includes(plan.output_target)) {
    return {
      ...plan,
      voice_mode: "off",
      subtitle_mode: "off",
    };
  }
  const voiceMode: StoryboardVoiceMode = plan.voice_mode === "native"
    ? "native" : available.speech && plan.voice_mode === "auto" ? "auto" : "off";
  return {
    ...plan,
    voice_mode: voiceMode,
    subtitle_mode:
      available.subtitles && plan.subtitle_mode === "auto" ? "auto" : "off",
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
  if (storyboardProductionIncludesComposition(storyboard)) {
    steps.push("视频合成");
  }
  return steps;
}
