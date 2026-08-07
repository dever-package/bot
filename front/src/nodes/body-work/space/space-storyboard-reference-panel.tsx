import { Link2 } from "lucide-react";
import {
  STORYBOARD_REFERENCE_PURPOSE_LABELS,
  storyboardReferencePurposeOptions,
} from "./space-storyboard-reference";
import {
  CanvasReferenceTextWithAdapter,
  useCanvasReferenceAdapter,
} from "./space-reference-editor";
import type {
  CanvasReferenceContent,
  CanvasStoryboardReference,
  CanvasStoryboardReferencePurpose,
  ComposerAssetItem,
} from "./types";
import type {
  StoryboardDocument,
  StoryboardMaterialType,
} from "./space-storyboard";

export function StoryboardReferencePanel({
  storyboard,
  referenceItems,
  editable,
  disabled,
  onChange,
}: {
  storyboard: StoryboardDocument;
  referenceItems: ComposerAssetItem[];
  editable: boolean;
  disabled: boolean;
  onChange: (storyboard: StoryboardDocument) => void;
}) {
  const adapter = useCanvasReferenceAdapter(referenceItems);
  if (storyboard.references.length === 0) {
    return null;
  }

  const updateReference = (
    key: string,
    patch: Partial<CanvasStoryboardReference>,
    resetTarget = false,
  ) => {
    let next = resetTarget
      ? clearStoryboardReferenceTarget(storyboard, key)
      : storyboard;
    next = {
      ...next,
      references: next.references.map((reference) =>
        reference.key === key ? { ...reference, ...patch } : reference,
      ),
    };
    if (resetTarget) {
      const updated = next.references.find((reference) => reference.key === key);
      const options = updated
        ? storyboardReferenceTargetOptions(next, updated)
        : [];
      if (options.length === 1) {
        next = assignStoryboardReferenceTarget(next, key, options[0].value);
      }
    }
    onChange(next);
  };

  return (
    <section className="ws-storyboard-references" aria-label="参考素材">
      <header>
        <Link2 size={14} />
        <strong>参考素材</strong>
        <span>{storyboard.references.length} 项</span>
      </header>
      <div className="ws-storyboard-reference-list">
        {storyboard.references.map((reference) => {
          const targetOptions = storyboardReferenceTargetOptions(
            storyboard,
            reference,
          );
          const target = storyboardReferenceTarget(storyboard, reference.key);
          return (
            <div className="ws-storyboard-reference-row" key={reference.key}>
              <CanvasReferenceTextWithAdapter
                className="ws-storyboard-reference-asset"
                value={`@${reference.label}`}
                content={storyboardReferenceContent(reference)}
                adapter={adapter}
              />
              {editable ? (
                <>
                  <select
                    className="nodrag nopan"
                    value={reference.purpose}
                    disabled={disabled}
                    aria-label={`${reference.label}的参考用途`}
                    onChange={(event) =>
                      updateReference(
                        reference.key,
                        {
                          purpose: event.target
                            .value as CanvasStoryboardReferencePurpose,
                        },
                        true,
                      )
                    }
                  >
                    {storyboardReferencePurposeOptions(reference.kind).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                  {isDirectReferencePurpose(reference.purpose) ? (
                    <select
                      className="nodrag nopan"
                      value={target}
                      disabled={disabled}
                      aria-label={`${reference.label}的关联目标`}
                      onChange={(event) =>
                        onChange(
                          assignStoryboardReferenceTarget(
                            storyboard,
                            reference.key,
                            event.target.value,
                          ),
                        )
                      }
                    >
                      <option value="">选择关联目标</option>
                      {targetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="ws-storyboard-reference-global">全局应用</span>
                  )}
                  <input
                    className="nodrag nopan"
                    value={reference.instruction}
                    disabled={disabled}
                    aria-label={`${reference.label}的补充说明`}
                    placeholder="补充说明（可选）"
                    onChange={(event) =>
                      updateReference(reference.key, {
                        instruction: event.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <span className="ws-storyboard-reference-purpose">
                    {STORYBOARD_REFERENCE_PURPOSE_LABELS[reference.purpose]}
                  </span>
                  <span className="ws-storyboard-reference-target">
                    {storyboardReferenceTargetLabel(storyboard, target) ||
                      (isDirectReferencePurpose(reference.purpose)
                        ? "未关联"
                        : "全局应用")}
                  </span>
                  {reference.instruction ? (
                    <span className="ws-storyboard-reference-instruction">
                      {reference.instruction}
                    </span>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function storyboardReferenceContent(
  reference: CanvasStoryboardReference,
): CanvasReferenceContent {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: reference.asset_id,
        label: reference.label,
        ref_trigger: "@",
        ref_version_id: reference.version_id,
      },
    ],
  };
}

function storyboardReferenceTargetOptions(
  storyboard: StoryboardDocument,
  reference: CanvasStoryboardReference,
) {
  if (isMaterialReferencePurpose(reference.purpose)) {
    return storyboard.materials
      .filter((material) => material.type === reference.purpose)
      .map((material) => ({
        value: `material:${material.id}`,
        label: material.name,
      }));
  }
  if (reference.purpose === "shot") {
    return storyboard.shots.map((shot, index) => ({
      value: `shot:${shot.id}`,
      label: `镜头 ${shot.order || index + 1}`,
    }));
  }
  return [];
}

function storyboardReferenceTarget(
  storyboard: StoryboardDocument,
  referenceKey: string,
) {
  const material = storyboard.materials.find((item) =>
    item.reference_keys.includes(referenceKey),
  );
  if (material) {
    return `material:${material.id}`;
  }
  const shot = storyboard.shots.find((item) =>
    item.reference_keys.includes(referenceKey),
  );
  return shot ? `shot:${shot.id}` : "";
}

function storyboardReferenceTargetLabel(
  storyboard: StoryboardDocument,
  target: string,
) {
  const [type, id] = target.split(":", 2);
  if (type === "material") {
    return (
      storyboard.materials.find((material) => material.id === id)?.name || ""
    );
  }
  if (type === "shot") {
    const index = storyboard.shots.findIndex((shot) => shot.id === id);
    return index >= 0
      ? `镜头 ${storyboard.shots[index].order || index + 1}`
      : "";
  }
  return "";
}

function assignStoryboardReferenceTarget(
  storyboard: StoryboardDocument,
  referenceKey: string,
  target: string,
) {
  const cleared = clearStoryboardReferenceTarget(storyboard, referenceKey);
  if (!target) {
    return cleared;
  }
  const [type, id] = target.split(":", 2);
  if (type === "material") {
    return {
      ...cleared,
      materials: cleared.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              reference_keys: [...material.reference_keys, referenceKey],
            }
          : material,
      ),
    };
  }
  if (type === "shot") {
    return {
      ...cleared,
      shots: cleared.shots.map((shot) =>
        shot.id === id
          ? { ...shot, reference_keys: [...shot.reference_keys, referenceKey] }
          : shot,
      ),
    };
  }
  return cleared;
}

function clearStoryboardReferenceTarget(
  storyboard: StoryboardDocument,
  referenceKey: string,
) {
  return {
    ...storyboard,
    materials: storyboard.materials.map((material) => ({
      ...material,
      reference_keys: material.reference_keys.filter(
        (key) => key !== referenceKey,
      ),
    })),
    shots: storyboard.shots.map((shot) => ({
      ...shot,
      reference_keys: shot.reference_keys.filter((key) => key !== referenceKey),
    })),
  };
}

function isMaterialReferencePurpose(
  purpose: CanvasStoryboardReferencePurpose,
): purpose is StoryboardMaterialType {
  return purpose === "character" || purpose === "scene" || purpose === "prop";
}

function isDirectReferencePurpose(
  purpose: CanvasStoryboardReferencePurpose,
) {
  return isMaterialReferencePurpose(purpose) || purpose === "shot";
}
