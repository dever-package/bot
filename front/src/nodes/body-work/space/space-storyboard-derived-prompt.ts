import {
  canvasReferenceContentFromTargets,
  canvasReferenceContentText,
  canvasReferenceTargetsFromContent,
} from "./space-reference-content";
import type { CanvasComposerDraft } from "./types";

export function storyboardManualPrompt(
  currentPrompt: string | undefined,
  generatedPrompt: string | undefined,
) {
  const current = String(currentPrompt || "");
  return current.trim() &&
    current.trim() === String(generatedPrompt || "").trim()
    ? ""
    : current;
}

export function isStoryboardManualPromptOverridden(
  currentPrompt: string | undefined,
  generatedPrompt: string | undefined,
) {
  return Boolean(storyboardManualPrompt(currentPrompt, generatedPrompt).trim());
}

export function storyboardManualComposerDraft(
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
  generatedPrompt: string | undefined,
  promptParamKey?: string,
): CanvasComposerDraft {
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
