import {
  MAX_STORYBOARD_SHOTS,
  STORYBOARD_TRANSITION_TYPES,
  isStoryboardShotDurationValid,
  storyboardShotLinksPreviousState,
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
  const referenceByKey = new Map(
    storyboard.references.map((reference) => [reference.key, reference]),
  );
  const assignedReferenceKeys = new Set<string>();

  if (!storyboard.title.trim()) {
    issues.push(errorIssue("title", "分镜标题不能为空"));
  }
  if (!storyboard.summary.trim()) {
    issues.push(errorIssue("summary", "请补充整个脚本的内容简介"));
  }
  if (!storyboard.storyline.setup.trim()) {
    issues.push(errorIssue("storyline:setup", "请补充故事起点"));
  }
  if (!storyboard.storyline.development.trim()) {
    issues.push(errorIssue("storyline:development", "请补充核心推进"));
  }
  if (!storyboard.storyline.payoff.trim()) {
    issues.push(errorIssue("storyline:payoff", "请补充结果落点"));
  }
  if (!storyboard.style_prompt.trim()) {
    issues.push(errorIssue("style", "请设置整部作品的统一视觉风格"));
  }
  if (
    !Number.isInteger(storyboard.target_shot_count) ||
    storyboard.target_shot_count < 1 ||
    storyboard.target_shot_count > MAX_STORYBOARD_SHOTS
  ) {
    issues.push(
      errorIssue(
        "target_shot_count",
        `目标镜头数必须是 1 到 ${MAX_STORYBOARD_SHOTS} 的整数`,
      ),
    );
  }
  if (storyboard.target_shot_count !== storyboard.shots.length) {
    issues.push(errorIssue("target_shot_count", "目标镜头数与实际镜头数不一致"));
  }
  const totalDuration = storyboard.shots.reduce(
    (total, shot) => total + shot.duration,
    0,
  );
  if (!Number.isInteger(storyboard.target_duration) || storyboard.target_duration < 4) {
    issues.push(errorIssue("target_duration", "目标总时长必须是不小于 4 秒的整数"));
  } else if (storyboard.target_duration !== totalDuration) {
    issues.push(errorIssue("target_duration", "目标总时长与镜头时长之和不一致"));
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
    if (material.type !== "character" && material.voice.trim()) {
      issues.push(materialIssue(material, "只有角色可以配置音色"));
    }
    for (const referenceKey of material.reference_keys) {
      const reference = referenceByKey.get(referenceKey);
      if (!reference) {
        issues.push(materialIssue(material, `引用了不存在的参考素材“${referenceKey}”`));
      } else if (reference.purpose !== material.type) {
        issues.push(materialIssue(material, `参考素材“${reference.label}”的用途不匹配`));
      } else {
        assignedReferenceKeys.add(referenceKey);
      }
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
  let previousExitState = "";
  let continuityChainLength = 0;
  const shotIds = new Set<string>();
  const shotBeats = new Map<string, number>();
  const shotDescriptions = new Map<string, number>();
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
    if (!shot.beat.trim()) {
      issues.push(shotIssue(shot, shotNumber, "请填写本镜变化"));
    } else {
      addDuplicateShotWarning(shotBeats, shot.beat, shot, shotNumber, "本镜变化", issues);
    }
    if (index === 0 && shot.transition.trim()) {
      issues.push(shotIssue(shot, shotNumber, "第一镜不能填写上镜承接关系"));
    } else if (index > 0 && !shot.transition.trim()) {
      issues.push(shotIssue(shot, shotNumber, "请说明与上一镜头的承接关系"));
    }
    if (!shot.description.trim()) {
      issues.push(shotIssue(shot, shotNumber, "镜头描述不能为空"));
    } else {
      addDuplicateShotWarning(
        shotDescriptions,
        shot.description,
        shot,
        shotNumber,
        "镜头描述",
        issues,
      );
    }
    if (!shot.video_prompt.trim()) {
      issues.push(shotIssue(shot, shotNumber, "视频提示词不能为空"));
    }
    for (const referenceKey of shot.reference_keys) {
      const reference = referenceByKey.get(referenceKey);
      if (!reference) {
        issues.push(
          shotIssue(shot, shotNumber, `引用了不存在的参考素材“${referenceKey}”`),
        );
      } else if (reference.purpose !== "shot") {
        issues.push(
          shotIssue(shot, shotNumber, `参考素材“${reference.label}”的用途不匹配`),
        );
      } else {
        assignedReferenceKeys.add(referenceKey);
      }
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
    if (index === 0 && shot.match_previous) {
      issues.push(shotIssue(shot, shotNumber, "第一个镜头不能匹配上一镜头"));
    }
    if (shot.match_previous && shot.continue_previous) {
      issues.push(shotIssue(shot, shotNumber, "不能同时匹配上一镜画面和延续上一镜视频"));
    }
    const entryState = shot.continuity_state?.entry.trim() || "";
    const exitState = shot.continuity_state?.exit.trim() || "";
    if (!entryState) {
      issues.push(shotIssue(shot, shotNumber, "请填写入镜状态"));
    }
    if (!exitState) {
      issues.push(shotIssue(shot, shotNumber, "请填写出镜状态"));
    }
    if (
      storyboardShotLinksPreviousState(shot, index) &&
      entryState !== previousExitState
    ) {
      issues.push(
        shotIssue(shot, shotNumber, "入镜状态必须与上一镜头的出镜状态完全一致"),
      );
    }
    if (!STORYBOARD_TRANSITION_TYPES.includes(shot.transition_type)) {
      issues.push(shotIssue(shot, shotNumber, "结构化转场类型无效"));
    }
    if (
      index === 0 &&
      (shot.transition_type !== "none" || shot.transition_duration_ms !== 0)
    ) {
      issues.push(shotIssue(shot, shotNumber, "第一镜不能配置转场效果"));
    } else if (
      shot.transition_type === "none" &&
      shot.transition_duration_ms !== 0
    ) {
      issues.push(shotIssue(shot, shotNumber, "硬切的转场时长必须为 0"));
    } else if (
      shot.transition_type !== "none" &&
      (shot.transition_duration_ms < 100 || shot.transition_duration_ms > 5000)
    ) {
      issues.push(shotIssue(shot, shotNumber, "转场时长必须是 100 到 5000 毫秒"));
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
    previousExitState = exitState;
  });

  for (const reference of storyboard.references) {
    if (
      reference.purpose !== "visual_style" &&
      reference.purpose !== "motion_style" &&
      !assignedReferenceKeys.has(reference.key)
    ) {
      issues.push(
        errorIssue(
          `reference:${reference.key}`,
          `参考素材“${reference.label}”尚未关联到具体目标`,
        ),
      );
    }
  }

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
        errorIssueForShot(
          `shot:${shot.id}:speech:${current.speech.id}:duration`,
          `镜头 ${shotNumber} 的语音按正常语速可能无法在镜头内说完`,
          shot.id,
        ),
      );
    }
    const next = timeline[index + 1];
    if (next && current.end > next.start + 0.01) {
      issues.push(
        errorIssueForShot(
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

function errorIssueForShot(
  id: string,
  message: string,
  shotId: string,
): StoryboardValidationIssue {
  return { id, message, severity: "error", shotId };
}

function addDuplicateShotWarning(
  usedValues: Map<string, number>,
  value: string,
  shot: StoryboardShot,
  shotNumber: number,
  label: string,
  issues: StoryboardValidationIssue[],
) {
  const key = value.replace(/\s+/g, "").toLocaleLowerCase();
  const previous = usedValues.get(key);
  if (previous) {
    issues.push(
      warningIssue(
        `shot:${shot.id}:${label}:duplicate`,
        `镜头 ${shotNumber} 的${label}与镜头 ${previous} 重复，建议审查是否有新的叙事作用`,
        shot.id,
      ),
    );
  } else {
    usedValues.set(key, shotNumber);
  }
}
