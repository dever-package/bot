import {
  isStoryboardShotDurationValid,
  storyboardVisibleSpeakerIds,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";

export type StoryboardValidationIssue = {
  id: string;
  message: string;
  severity: "error" | "warning";
  materialId?: string;
  shotId?: string;
};

export function storyboardValidationIssues(
  storyboard: StoryboardDocument,
): StoryboardValidationIssue[] {
  const issues: StoryboardValidationIssue[] = [];
  const materialById = new Map<string, StoryboardMaterial>();
  const materialNames = new Set<string>();
  const speechIds = new Set<string>();
  const captionIds = new Set<string>();

  if (!storyboard.title.trim()) {
    issues.push(errorIssue("title", "分镜标题不能为空"));
  }
  if (!storyboard.summary.trim()) {
    issues.push(errorIssue("summary", "请补充整个脚本的内容简介"));
  }
  if (!storyboard.style_prompt.trim()) {
    issues.push(errorIssue("style", "请设置整部作品的统一视觉风格"));
  }

  for (const material of storyboard.materials) {
    const materialName = material.name.trim();
    const nameKey = materialName.toLocaleLowerCase();
    if (!material.id.trim()) {
      issues.push(materialIssue(material, "缺少稳定标识"));
    } else if (materialById.has(material.id)) {
      issues.push(materialIssue(material, `素材标识“${material.id}”重复`));
    }
    if (!materialName) {
      issues.push(materialIssue(material, "名称不能为空"));
    } else if (materialNames.has(nameKey)) {
      issues.push(materialIssue(material, `素材名称“${materialName}”重复`));
    }
    if (!material.prompt.trim()) {
      issues.push(materialIssue(material, "生成提示词不能为空"));
    }
    materialNames.add(nameKey);
    materialById.set(material.id, material);
  }

  if (!storyboard.shots.length) {
    issues.push(errorIssue("shots", "分镜至少需要一个镜头"));
    return issues;
  }

  let previousMaterialIds = new Set<string>();
  let previousVisibleDialogue = false;
  let continuityChainLength = 0;
  const shotIds = new Set<string>();
  storyboard.shots.forEach((shot, index) => {
    const shotNumber = index + 1;
    if (!shot.id.trim() || shotIds.has(shot.id)) {
      issues.push(shotIssue(shot, shotNumber, "镜头标识缺失或重复"));
    }
    shotIds.add(shot.id);
    if (!isStoryboardShotDurationValid(shot.duration)) {
      issues.push(
        shotIssue(shot, shotNumber, "时长必须是不小于 4 秒的整数"),
      );
    }
    if (!shot.description.trim()) {
      issues.push(shotIssue(shot, shotNumber, "镜头描述不能为空"));
    }
    if (!shot.video_prompt.trim()) {
      issues.push(shotIssue(shot, shotNumber, "视频提示词不能为空"));
    }

    const materialIds = new Set<string>();
    for (const materialId of shot.material_ids) {
      if (!materialById.has(materialId)) {
        issues.push(
          shotIssue(shot, shotNumber, `引用了不存在的素材“${materialId}”`),
        );
      } else if (materialIds.has(materialId)) {
        issues.push(
          shotIssue(shot, shotNumber, `重复引用素材“${materialId}”`),
        );
      }
      materialIds.add(materialId);
    }

    if (index === 0 && shot.continue_previous) {
      issues.push(shotIssue(shot, shotNumber, "第一个镜头不能承接上一镜头"));
    }
    if (shot.continue_previous) {
      continuityChainLength += 1;
      if (!shot.continuity_anchor.trim()) {
        issues.push(shotIssue(shot, shotNumber, "请填写连续性锚点"));
      }
      if (continuityChainLength >= 3) {
        issues.push(
          shotIssue(shot, shotNumber, "连续镜头链最多包含 3 个镜头"),
        );
      }
      if (!sameStringSet(previousMaterialIds, materialIds)) {
        issues.push(
          shotIssue(
            shot,
            shotNumber,
            "连续镜头不能新增、移除或更换角色、场景或道具",
          ),
        );
      }
    } else {
      continuityChainLength = 0;
    }

    const visibleDialogue = validateShotSpeech(
      shot,
      shotNumber,
      materialById,
      materialIds,
      speechIds,
      issues,
    );
    if (shot.continue_previous && (previousVisibleDialogue || visibleDialogue)) {
      issues.push(
        shotIssue(shot, shotNumber, "出镜对白不能跨越连续镜头边界"),
      );
    }
    validateShotCaptions(shot, shotNumber, captionIds, issues);
    previousMaterialIds = materialIds;
    previousVisibleDialogue = visibleDialogue;
  });

  return issues;
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

  const visibleSpeakers = storyboardVisibleSpeakerIds(shot);
  if (visibleSpeakers.size > 1) {
    issues.push(shotIssue(shot, shotNumber, "最多只能有一个出镜说话角色"));
  }
  validateEstimatedSpeechTimeline(shot, shotNumber, issues);
  return visibleSpeakers.size > 0;
}

function validateEstimatedSpeechTimeline(
  shot: StoryboardShot,
  shotNumber: number,
  issues: StoryboardValidationIssue[],
) {
  const timeline = shot.speech
    .filter((speech) => speech.text.trim())
    .map((speech) => ({
      speech,
      start: speech.start_time,
      end:
        speech.start_time +
        Math.max(0.6, estimatedSpeechCharacterCount(speech) / 3.5),
    }))
    .sort((left, right) => left.start - right.start);
  for (let index = 0; index < timeline.length; index += 1) {
    const current = timeline[index];
    if (current.end > shot.duration + 0.01) {
      issues.push(
        warningIssue(
          `shot:${shot.id}:speech:${current.speech.id}:duration`,
          `镜头 ${shotNumber} 的语音按正常语速可能无法在镜头内说完`,
          shot.id,
        ),
      );
    }
    const next = timeline[index + 1];
    if (next && current.end > next.start + 0.01) {
      issues.push(
        warningIssue(
          `shot:${shot.id}:speech:${current.speech.id}:overlap`,
          `镜头 ${shotNumber} 的相邻语音按正常语速可能重叠`,
          shot.id,
        ),
      );
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

function estimatedSpeechCharacterCount(speech: StoryboardSpeech) {
  return [...speech.text.replace(/\s+/g, "")].length;
}

function sameStringSet(left: Set<string>, right: Set<string>) {
  if (left.size !== right.size) {
    return false;
  }
  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }
  return true;
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

function warningIssue(
  id: string,
  message: string,
  shotId: string,
): StoryboardValidationIssue {
  return { id, message, severity: "warning", shotId };
}
