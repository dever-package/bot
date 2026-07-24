import { AssetKindIcon } from "../asset/asset-preview";
import {
  STORYBOARD_REFERENCE_PURPOSE_LABELS,
  storyboardReferencePurposeOptions,
} from "./space-storyboard-reference";
import { SpaceTooltip } from "./space-tooltip";
import type {
  CanvasStoryboardReference,
  CanvasStoryboardReferencePurpose,
} from "./types";

export function StoryboardInputReferenceEditor({
  references,
  disabled = false,
  onChange,
}: {
  references: CanvasStoryboardReference[];
  disabled?: boolean;
  onChange: (references: CanvasStoryboardReference[]) => void;
}) {
  if (references.length === 0) {
    return null;
  }

  const updateReference = (
    key: string,
    patch: Partial<CanvasStoryboardReference>,
  ) => {
    onChange(
      references.map((reference) =>
        reference.key === key ? { ...reference, ...patch } : reference,
      ),
    );
  };

  return (
    <section className="ws-storyboard-input-references" aria-label="脚本参考素材">
      <header>
        <strong>参考素材</strong>
        <span>为每个素材指定用途，生成后仍可在脚本详情中调整。</span>
      </header>
      <div className="ws-storyboard-input-reference-list">
        {references.map((reference) => (
          <div className="ws-storyboard-input-reference" key={reference.key}>
            <span className="ws-storyboard-input-reference-kind">
              <AssetKindIcon kind={reference.kind} />
            </span>
            <SpaceTooltip label={reference.label}>
              <span className="ws-storyboard-input-reference-name">
                {reference.label}
              </span>
            </SpaceTooltip>
            <select
              className="nodrag nopan"
              value={reference.purpose}
              disabled={disabled}
              aria-label={`${reference.label}的参考用途`}
              onChange={(event) =>
                updateReference(reference.key, {
                  purpose: event.target
                    .value as CanvasStoryboardReferencePurpose,
                })
              }
            >
              {storyboardReferencePurposeOptions(reference.kind).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              className="nodrag nopan"
              value={reference.instruction}
              disabled={disabled}
              aria-label={`${reference.label}的补充说明`}
              placeholder={`${STORYBOARD_REFERENCE_PURPOSE_LABELS[reference.purpose]}说明（可选）`}
              onChange={(event) =>
                updateReference(reference.key, {
                  instruction: event.target.value,
                })
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
