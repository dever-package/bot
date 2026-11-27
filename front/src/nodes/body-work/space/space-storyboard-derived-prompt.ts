import {
  canvasReferenceContentFromTargets,
  canvasReferenceContentFromText,
  canvasReferenceContentText,
  canvasReferenceTargetsFromContent,
} from "./space-reference-content";
import {
  isStoryboardShotPrompt,
  storyboardDerivedManualPrompt,
  storyboardManualPrompt,
} from "./space-storyboard-prompt-override";
import type { CanvasComposerDraft, CanvasReferenceContent, CanvasStoryboardItemConfig } from "./types";

function storyboardPromptBody(prompt: string, content?: CanvasReferenceContent) {
  return (content ? content.parts.map((part) => part.type === "text" ? part.text : "").join("") : prompt).trim();
}

function storyboardGeneratedPromptBody(item: CanvasStoryboardItemConfig) {
  const generated = item.generatedPrompt || "";
  return storyboardPromptBody(generated, canvasReferenceContentFromText(
    generated,
    canvasReferenceTargetsFromContent(item.generatedInputs?.referenceContent),
  ));
}

export function storyboardPromptOverrideAfterEdit(
  item: CanvasStoryboardItemConfig | undefined,
  previous: Pick<CanvasComposerDraft, "prompt" | "promptContent" | "storyboardPromptOverride">,
  nextPrompt: string,
  nextContent?: CanvasReferenceContent,
) {
  if (!isStoryboardShotPrompt(item)) return undefined;
  const edited = storyboardPromptBody(nextPrompt, nextContent);
  if (edited === storyboardPromptBody(previous.prompt || "", previous.promptContent)) {
    return previous.storyboardPromptOverride;
  }
  return edited && edited !== storyboardGeneratedPromptBody(item) ? nextPrompt.trim() : undefined;
}

function storyboardManualComposerDraft(
  draft: CanvasComposerDraft,
  generatedPrompt: string | undefined,
  promptParamKey?: string,
): CanvasComposerDraft {
  if (!generatedPrompt?.trim()) {
    return draft;
  }
  const prompt = storyboardManualPrompt(draft.prompt, generatedPrompt);
  const content = draft.promptContent;
  const contentText = canvasReferenceContentText(content);
  const contentPlainText = content?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
  const hasGeneratedContent = [contentText, contentPlainText].some(
    (text) =>
      Boolean(text?.trim()) && !storyboardManualPrompt(text, generatedPrompt),
  );
  const manualContent = hasGeneratedContent
    ? canvasReferenceContentFromTargets(
        prompt,
        canvasReferenceTargetsFromContent(content),
      )
    : content;
  const promptContent =
    hasGeneratedContent && !manualContent?.parts.length
      ? undefined
      : manualContent;
  let paramValues = draft.paramValues;
  const value = promptParamKey ? paramValues?.[promptParamKey] : undefined;
  if (promptParamKey && typeof value === "string") {
    const manualValue = storyboardManualPrompt(value, generatedPrompt);
    if (manualValue !== value) {
      paramValues = { ...paramValues, [promptParamKey]: manualValue };
    }
  }
  return prompt === draft.prompt &&
    promptContent === content &&
    paramValues === draft.paramValues
    ? draft
    : { ...draft, prompt, promptContent, paramValues };
}

export function storyboardEditableComposerDraft(
  draft: CanvasComposerDraft,
  item: CanvasStoryboardItemConfig | undefined,
  promptParamKey?: string,
): CanvasComposerDraft {
  if (isStoryboardShotPrompt(item)) {
    const text = storyboardDerivedManualPrompt(draft, item) || storyboardGeneratedPromptBody(item);
    const targets = canvasReferenceTargetsFromContent(draft.promptContent);
    const promptContent = targets.length ? canvasReferenceContentFromTargets(text, targets) : undefined;
    const prompt = promptContent ? canvasReferenceContentText(promptContent) : text;
    return {
      ...draft,
      prompt,
      promptContent,
      paramValues: promptParamKey ? { ...draft.paramValues, [promptParamKey]: prompt } : draft.paramValues,
    };
  }
  const generatedPrompt = item?.generatedPrompt;
  const manualDraft = storyboardManualComposerDraft(
    draft,
    generatedPrompt,
    promptParamKey,
  );
  const generated = String(generatedPrompt || "");
  if (!generated.trim()) {
    return manualDraft;
  }
  const structuredText = canvasReferenceContentText(
    manualDraft.promptContent,
  );
  const structuredPlainText = manualDraft.promptContent?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
  const prompt = manualDraft.prompt?.trim()
    ? manualDraft.prompt
    : structuredPlainText?.trim()
      ? structuredText
      : generated;
  let paramValues = manualDraft.paramValues;
  if (promptParamKey && paramValues?.[promptParamKey] !== prompt) {
    paramValues = { ...(paramValues || {}), [promptParamKey]: prompt };
  }
  const promptContent = manualDraft.promptContent
    ? canvasReferenceContentFromTargets(
        prompt,
        canvasReferenceTargetsFromContent(manualDraft.promptContent),
      )
    : manualDraft.promptContent;
  return prompt === manualDraft.prompt &&
    promptContent === manualDraft.promptContent &&
    paramValues === manualDraft.paramValues
    ? manualDraft
    : { ...manualDraft, prompt, promptContent, paramValues };
}
