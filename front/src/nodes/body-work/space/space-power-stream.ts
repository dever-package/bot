import { contentOutputHasMedia } from "../shared/content-output";
import { isPlainRecord } from "../shared/structured-json";
import type { RunningNodeState } from "./space-node-runtime";

// 状态是运行信息；只有正文增量和可展示产物进入内容预览。
export function reduceCanvasPowerStream(
  running: RunningNodeState,
  output: Record<string, unknown>,
): RunningNodeState {
  const event = String(
    output.semantic_event || output.event || "",
  ).toLowerCase();
  const meta = isPlainRecord(output.meta) ? output.meta : {};
  const isStatus = event === "status";
  const isStructuredStatus =
    isStatus && Boolean(String(meta.output_type || ""));
  const hasStructuredStatusPayload =
    isStructuredStatus &&
    Boolean(
      (output.json && typeof output.json === "object") ||
      (meta.storyboard_preview && typeof meta.storyboard_preview === "object"),
    );
  let streamOutput = running.streamOutput;
  if (
    event === "audio_ready" ||
    hasStructuredStatusPayload ||
    contentOutputHasMedia(output)
  ) {
    streamOutput = output;
    if (isStatus && "text" in output) {
      streamOutput = { ...output };
      delete streamOutput.text;
    }
  }
  const deltaText =
    typeof output.text === "string" && (event === "delta" || !event)
      ? output.text
      : "";
  const generatedCount = Number(meta.generated_count);
  const targetCount = Number(meta.target_count);
  return {
    ...running,
    streamText: deltaText
      ? `${running.streamText || ""}${deltaText}`
      : running.streamText,
    streamOutput,
    streamStarted:
      running.streamStarted ||
      Boolean(deltaText) ||
      Boolean(streamOutput) ||
      isStructuredStatus,
    ...(isStatus
      ? {
          statusText:
            typeof output.text === "string" && output.text.trim()
              ? output.text.trim()
              : running.statusText,
          generatedCount:
            Number.isInteger(generatedCount) && generatedCount >= 0
              ? Math.max(running.generatedCount || 0, generatedCount)
              : running.generatedCount,
          targetCount:
            Number.isInteger(targetCount) && targetCount > 0
              ? targetCount
              : running.targetCount,
        }
      : {}),
  };
}
