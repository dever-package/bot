import { Link2 } from "lucide-react";
import {
  storyboardReferencePurposeLabel,
  storyboardReferencePurposeOptions,
  storyboardReferencePurposeSpec,
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
  StoryboardReferencePurposeSpec,
  StoryboardWorkType,
} from "./types";
import type { StoryboardDocument } from "./space-storyboard";

export function StoryboardReferencePanel({
  storyboard,
  referenceItems,
  workType,
  purposeSpecs,
  editable,
  disabled,
  onChange,
}: {
  storyboard: StoryboardDocument;
  referenceItems: ComposerAssetItem[];
  workType: StoryboardWorkType;
  purposeSpecs: StoryboardReferencePurposeSpec[];
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
        ? storyboardReferenceTargetOptions(next, updated, purposeSpecs)
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
            purposeSpecs,
          );
          const target = storyboardReferenceTarget(storyboard, reference.key);
          const purposeOptions = storyboardReferencePurposeOptions(
            reference.kind,
            workType,
            purposeSpecs,
          );
          const purposeIsValid = purposeOptions.some(
            (option) => option.value === reference.purpose,
          );
          return (
            <div
              className={`ws-storyboard-reference-row ${
                purposeIsValid ? "" : "is-invalid"
              }`}
              key={reference.key}
            >
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
                    {!purposeIsValid ? (
                      <option value={reference.purpose}>
                        {storyboardReferencePurposeLabel(
                          reference.purpose,
                          purposeSpecs,
                        )}（当前类型不支持）
                      </option>
                    ) : null}
                    {purposeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {isDirectReferencePurpose(
                    reference.purpose,
                    purposeSpecs,
                  ) ? (
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
                    <span className="ws-storyboard-reference-global">
                      {storyboardReferenceScopeLabel(
                        reference.purpose,
                        purposeSpecs,
                      )}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="ws-storyboard-reference-purpose">
                    {storyboardReferencePurposeLabel(
                      reference.purpose,
                      purposeSpecs,
                    )}
                  </span>
                  <span className="ws-storyboard-reference-target">
                    {storyboardReferenceTargetLabel(storyboard, target) ||
                      (isDirectReferencePurpose(
                        reference.purpose,
                        purposeSpecs,
                      )
                        ? "未关联"
                        : storyboardReferenceScopeLabel(
                            reference.purpose,
                            purposeSpecs,
                          ))}
                  </span>
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
        purpose: reference.purpose,
        ref_trigger: "@",
        ref_version_id: reference.version_id,
      },
    ],
  };
}

function storyboardReferenceTargetOptions(
  storyboard: StoryboardDocument,
  reference: CanvasStoryboardReference,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const purposeSpec = storyboardReferencePurposeSpec(
    reference.purpose,
    purposeSpecs,
  );
  if (purposeSpec?.scope === "material") {
    return storyboard.materials
      .filter((material) => material.type === purposeSpec.material_type)
      .map((material) => ({
        value: `material:${material.id}`,
        label: material.name,
      }));
  }
  if (purposeSpec?.scope === "shot") {
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

function isDirectReferencePurpose(
  purpose: CanvasStoryboardReferencePurpose,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const scope = storyboardReferencePurposeSpec(purpose, purposeSpecs)?.scope;
  return scope === "material" || scope === "shot";
}

function storyboardReferenceScopeLabel(
  purpose: CanvasStoryboardReferencePurpose,
  purposeSpecs: StoryboardReferencePurposeSpec[],
) {
  const purposeSpec = storyboardReferencePurposeSpec(purpose, purposeSpecs);
  if (!purposeSpec) {
    return "用途无效";
  }
  switch (purposeSpec.scope) {
    case "composition":
      return "合成应用";
    case "context":
      return "上下文参考";
    default:
      return "全局应用";
  }
}
