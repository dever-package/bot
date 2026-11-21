import {
  MIN_STORYBOARD_SHOT_DURATION,
  isStoryboardShotDurationValid,
  storyboardProductionIncludesReferenceImages,
  storyboardProductionIncludesShotVideos,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardShot,
} from "./space-storyboard";
import {
  storyboardReferencePurposeSpec,
  storyboardReferenceValidationError,
} from "./space-storyboard-reference";
import type {
  StoryboardReferencePurposeSpec,
  StoryboardWorkTypeSpec,
} from "./types";

export type StoryboardValidationIssue = {
  id: string;
  message: string;
  severity: "error" | "warning";
  materialId?: string;
  shotId?: string;
};

export type StoryboardValidationOptions = {
  coreOnly?: boolean;
  workTypeSpecs?: StoryboardWorkTypeSpec[];
  purposeSpecs?: StoryboardReferencePurposeSpec[];
};

export function storyboardValidationIssues(
  storyboard: StoryboardDocument,
  options: StoryboardValidationOptions = {},
): StoryboardValidationIssue[] {
  if (storyboard.screenplay && !storyboard.shots.length) {
    return storyboard.screenplay.parts.some((part) => !part.description.trim()) ? [{ id: "screenplay", message: "场次剧本不能为空", severity: "error" }] : [];
  }
  const scope = storyboardValidationScope(storyboard, options);
  const issues: StoryboardValidationIssue[] = [];
  const materialById = new Map<string, StoryboardMaterial>();
  const speechIds = new Set<string>();
  const captionIds = new Set<string>();
  const referenceByKey = new Map(
    storyboard.references.map((reference) => [reference.key, reference]),
  );

  if (options.workTypeSpecs?.length && options.purposeSpecs?.length) {
    const referenceError = storyboardReferenceValidationError(
      storyboard.references,
      storyboard.work_type,
      options.workTypeSpecs,
      options.purposeSpecs,
    );
    if (referenceError) {
      issues.push(errorIssue("references", referenceError));
    }
  }

  for (const material of storyboard.materials) {
    if (!material.id.trim()) {
      issues.push(materialIssue(material, "缺少稳定标识"));
    } else if (materialById.has(material.id)) {
      issues.push(materialIssue(material, `素材标识“${material.id}”重复`));
    }
    if (scope.referenceImages && !material.prompt.trim()) {
      issues.push(materialIssue(material, "生成提示词不能为空"));
    }
    if (material.type !== "character" && material.voice.trim()) {
      issues.push(materialIssue(material, "只有角色可以配置音色"));
    }
    for (const referenceKey of material.reference_keys) {
      const reference = referenceByKey.get(referenceKey);
      if (!reference) {
        issues.push(
          materialIssue(material, `引用了不存在的参考素材“${referenceKey}”`),
        );
      } else if (
        options.purposeSpecs?.length &&
        storyboardReferencePurposeSpec(
          reference.purpose,
          options.purposeSpecs || [],
        )?.material_type !== material.type
      ) {
        issues.push(
          materialIssue(material, `参考素材“${reference.label}”的用途不匹配`),
        );
      }
    }
    materialById.set(material.id, material);
  }

  if (scope.voice) {
    addStoryboardVoiceIssues(storyboard, issues);
  }

  if (!storyboard.shots.length) {
    issues.push(errorIssue("shots", "分镜至少需要一个镜头"));
    return issues;
  }

  const shotIds = new Set<string>();
  storyboard.shots.forEach((shot, index) => {
    const shotNumber = index + 1;
    if (!shot.id.trim() || shotIds.has(shot.id)) {
      issues.push(shotIssue(shot, shotNumber, "镜头标识缺失或重复"));
    }
    shotIds.add(shot.id);
    if (!isStoryboardShotDurationValid(shot.duration)) {
      issues.push(
        shotIssue(
          shot,
          shotNumber,
          `时长必须是不小于 ${MIN_STORYBOARD_SHOT_DURATION} 秒的整数`,
        ),
      );
    }
    if (!shot.description.trim()) {
      issues.push(shotIssue(shot, shotNumber, "镜头描述不能为空"));
    }
    if (scope.shotVideos && !shot.video_prompt.trim()) {
      issues.push(shotIssue(shot, shotNumber, "视频提示词不能为空"));
    }
    for (const referenceKey of shot.reference_keys) {
      const reference = referenceByKey.get(referenceKey);
      if (!reference) {
        issues.push(
          shotIssue(
            shot,
            shotNumber,
            `引用了不存在的参考素材“${referenceKey}”`,
          ),
        );
      } else if (
        options.purposeSpecs?.length &&
        storyboardReferencePurposeSpec(
          reference.purpose,
          options.purposeSpecs || [],
        )?.scope !== "shot"
      ) {
        issues.push(
          shotIssue(
            shot,
            shotNumber,
            `参考素材“${reference.label}”的用途不匹配`,
          ),
        );
      }
    }

    const materialIds = new Set<string>();
    for (const materialId of shot.material_ids) {
      if (!materialById.has(materialId)) {
        issues.push(
          shotIssue(shot, shotNumber, `引用了不存在的素材“${materialId}”`),
        );
      } else if (materialIds.has(materialId)) {
        issues.push(shotIssue(shot, shotNumber, `重复引用素材“${materialId}”`));
      }
      materialIds.add(materialId);
    }

    if (index === 0 && shot.continue_previous) {
      issues.push(shotIssue(shot, shotNumber, "第一个镜头不能承接上一镜头"));
    }
    if (index === 0 && shot.match_previous) {
      issues.push(shotIssue(shot, shotNumber, "第一个镜头不能匹配上一镜头"));
    }
    if (shot.match_previous && shot.continue_previous) {
      issues.push(
        shotIssue(shot, shotNumber, "不能同时匹配上一镜画面和延续上一镜视频"),
      );
    }
    if (scope.voice || scope.subtitles) {
      validateShotSpeech(
        shot,
        shotNumber,
        materialById,
        materialIds,
        speechIds,
        issues,
      );
    }
    if (scope.subtitles) {
      validateShotCaptions(shot, shotNumber, captionIds, issues);
    }
  });

  return issues;
}

function addStoryboardVoiceIssues(
  storyboard: StoryboardDocument,
  issues: StoryboardValidationIssue[],
) {
  const speakingCharacterIds = new Set<string>();
  let hasNarration = false;
  for (const shot of storyboard.shots) {
    for (const speech of shot.speech) {
      if (!speech.text.trim()) {
        continue;
      }
      if (speech.kind === "narration") {
        hasNarration = true;
      } else if (speech.character_id) {
        speakingCharacterIds.add(speech.character_id);
      }
    }
  }

  if (hasNarration && !storyboard.narrator_voice.trim()) {
    issues.push(errorIssue("narrator_voice", "旁白：请选择音色"));
  }
  for (const material of storyboard.materials) {
    if (
      speakingCharacterIds.has(material.id) &&
      material.type === "character" &&
      !material.voice.trim()
    ) {
      issues.push(materialIssue(material, "请选择音色"));
    }
  }
}

function validateShotSpeech(
  shot: StoryboardShot,
  shotNumber: number,
  materialById: Map<string, StoryboardMaterial>,
  shotMaterialIds: Set<string>,
  usedIds: Set<string>,
  issues: StoryboardValidationIssue[],
) {
  for (const speech of shot.speech) {
    if (!speech.id.trim() || usedIds.has(speech.id)) {
      issues.push(shotIssue(shot, shotNumber, "语音标识缺失或重复"));
    }
    usedIds.add(speech.id);
    if (!speech.text.trim()) {
      issues.push(shotIssue(shot, shotNumber, "对白或旁白文本不能为空"));
    }
    if (speech.start_time < 0 || speech.start_time >= shot.duration) {
      issues.push(shotIssue(shot, shotNumber, "语音开始时间超出镜头范围"));
    }
    if (speech.kind !== "dialogue") {
      continue;
    }
    const characterId = speech.character_id || "";
    if (materialById.get(characterId)?.type !== "character") {
      issues.push(shotIssue(shot, shotNumber, "对白没有选择有效角色"));
    } else if (!shotMaterialIds.has(characterId)) {
      issues.push(shotIssue(shot, shotNumber, "对白角色未关联到当前镜头"));
    }
  }

}

function validateShotCaptions(
  shot: StoryboardShot,
  shotNumber: number,
  usedIds: Set<string>,
  issues: StoryboardValidationIssue[],
) {
  for (const caption of shot.captions) {
    if (!caption.id.trim() || usedIds.has(caption.id)) {
      issues.push(shotIssue(shot, shotNumber, "字幕标识缺失或重复"));
    }
    usedIds.add(caption.id);
    if (!caption.text.trim()) {
      issues.push(shotIssue(shot, shotNumber, "字幕文案不能为空"));
    }
    if (
      caption.start_time < 0 ||
      caption.end_time <= caption.start_time ||
      caption.end_time > shot.duration
    ) {
      issues.push(shotIssue(shot, shotNumber, "字幕时间范围超出镜头"));
    }
  }
}

function storyboardValidationScope(
  storyboard: StoryboardDocument,
  options: StoryboardValidationOptions,
) {
  if (options.coreOnly) {
    return {
      referenceImages: false,
      shotVideos: false,
      voice: false,
      subtitles: false,
    };
  }
  return {
    referenceImages: storyboardProductionIncludesReferenceImages(storyboard),
    shotVideos: storyboardProductionIncludesShotVideos(storyboard),
    voice: storyboardProductionIncludesVoice(storyboard),
    subtitles: storyboardProductionIncludesSubtitles(storyboard),
  };
}

function errorIssue(id: string, message: string): StoryboardValidationIssue {
  return { id, message, severity: "error" };
}

function materialIssue(
  material: StoryboardMaterial,
  message: string,
): StoryboardValidationIssue {
  return {
    id: `material:${material.id}:${message}`,
    message: `${material.name || "未命名素材"}：${message}`,
    severity: "error",
    materialId: material.id,
  };
}

function shotIssue(
  shot: StoryboardShot,
  shotNumber: number,
  message: string,
): StoryboardValidationIssue {
  return {
    id: `shot:${shot.id}:${message}`,
    message: `镜头 ${shotNumber}：${message}`,
    severity: "error",
    shotId: shot.id,
  };
}
