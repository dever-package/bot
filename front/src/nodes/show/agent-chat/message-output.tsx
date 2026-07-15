import {
  EnergonContentView,
  normalizeEnergonOutput,
  type EnergonOutput,
} from "@/components/energon/content-view";
import { FileText, ImageIcon, Loader2, Video, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentChatMediaPreview } from "./media-inspector";
import {
  artifactDisplayOutput,
  readAgentChatArtifacts,
  type AgentChatArtifact,
} from "./artifact";

const contentKeys = [
  "rich",
  "images",
  "videos",
  "audios",
  "files",
] as const;

type AgentChatMessageOutputProps = {
  output: unknown;
  excludeOutputs?: unknown[];
  excludeText?: string;
  className?: string;
};

export function AgentChatMessageOutput({
  output,
  excludeOutputs = [],
  excludeText = "",
  className,
}: AgentChatMessageOutputProps) {
  const onMediaPreview = useAgentChatMediaPreview();
  const displayOutput = agentChatMessageOutputWithOptions(output, {
    excludedKeys: displayKeys(excludeOutputs),
    excludeText,
  });
  const excludedArtifactIDs = new Set(
    excludeOutputs.flatMap((value) =>
      readAgentChatArtifacts(value).map((artifact) => artifact.id),
    ),
  );
  const generatingArtifacts = readAgentChatArtifacts(output).filter(
    (artifact) =>
      artifact.status === "generating" && !excludedArtifactIDs.has(artifact.id),
  );

  if (displayOutput.length === 0 && generatingArtifacts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "agent-chat-message-output mt-4 min-w-0 max-w-full",
        className,
      )}
    >
      {generatingArtifacts.length > 0 ? (
        <ArtifactRecoveryPlaceholder artifacts={generatingArtifacts} />
      ) : null}
      {displayOutput.length > 0 ? (
        <EnergonContentView
          output={displayOutput}
          mediaLayout="chat"
          onMediaPreview={onMediaPreview}
        />
      ) : null}
    </div>
  );
}

function ArtifactRecoveryPlaceholder({
  artifacts,
}: {
  artifacts: AgentChatArtifact[];
}) {
  return (
    <div className="agent-chat-media-grid" role="status" aria-label="素材生成中">
      {artifacts.map((artifact) => {
        const Icon = artifactPlaceholderIcon(artifact.kind);
        const visual = artifact.kind === "image" || artifact.kind === "video";
        return (
          <div
            key={artifact.id}
            className={cn(
              "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
              visual ? "items-center justify-center" : "h-24 items-center px-5",
            )}
            style={visual ? { aspectRatio: artifact.kind === "video" ? "16 / 9" : "4 / 3" } : undefined}
          >
            <Icon className="agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" />
            <Loader2 className="agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" />
          </div>
        );
      })}
    </div>
  );
}

function artifactPlaceholderIcon(kind: AgentChatArtifact["kind"]) {
  if (kind === "image") return ImageIcon;
  if (kind === "video") return Video;
  if (kind === "audio") return Volume2;
  return FileText;
}

export function hasAgentChatMessageOutput(output: unknown) {
  return agentChatDisplayOutput(output).length > 0;
}

export function agentChatDisplayOutput(output: unknown) {
  return agentChatMessageOutputWithOptions(output, {
    excludedKeys: new Set(),
    excludeText: "",
  });
}

type DisplayOptions = {
  excludedKeys: Set<(typeof contentKeys)[number]>;
  excludeText: string;
};

function agentChatMessageOutputWithOptions(
  output: unknown,
  options: DisplayOptions,
) {
  return normalizeDisplayOutputs(output)
    .map((item) => pickDisplayOutput(item, options))
    .filter((item): item is EnergonOutput => Boolean(item));
}

function normalizeDisplayOutputs(output: unknown) {
  const values = normalizeEnergonOutput(output);
  const artifacts = artifactDisplayOutput(output);
  return Object.keys(artifacts).length > 0 ? [...values, artifacts] : values;
}

function pickDisplayOutput(
  output: EnergonOutput,
  options: DisplayOptions,
): EnergonOutput | null {
  const result: EnergonOutput = {};
  for (const key of contentKeys) {
    if (options.excludedKeys.has(key)) {
      continue;
    }
    const value = withoutTextMedia(output[key], key, options.excludeText);
    if (hasDisplayValue(value)) {
      result[key] = value;
    }
  }
  if (Object.keys(result).length === 0) {
    return null;
  }
  if (hasDisplayValue(output.title)) {
    result.title = output.title;
  }
  if (output.meta) {
    result.meta = output.meta;
  }
  return result;
}

function displayKeys(outputs: unknown[]) {
  const keys = new Set<(typeof contentKeys)[number]>();
  for (const output of outputs) {
    for (const item of normalizeDisplayOutputs(output)) {
      for (const key of contentKeys) {
        if (hasDisplayValue(item[key])) {
          keys.add(key);
        }
      }
    }
  }
  return keys;
}

function withoutTextMedia(
  value: unknown,
  key: (typeof contentKeys)[number],
  text: string,
) {
  if (key === "rich" || !text || !Array.isArray(value)) {
    return value;
  }
  return value.filter(
    (item) => typeof item !== "string" || !text.includes(item),
  );
}

function hasDisplayValue(value: unknown) {
  if (value == null || value === "") {
    return false;
  }
  return !Array.isArray(value) || value.length > 0;
}
