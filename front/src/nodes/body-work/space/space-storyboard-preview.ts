import type { StoryboardMaterial, StoryboardShot } from "./space-storyboard";

export type StoryboardReadableShot = Pick<
  StoryboardShot,
  | "id"
  | "order"
  | "duration"
  | "beat"
  | "description"
  | "camera_instruction"
  | "start_framing"
  | "shared_end_shot_id"
> & {
  speech: Pick<
    StoryboardShot["speech"][number],
    "id" | "kind" | "text" | "character_id"
  >[];
};
export type StoryboardReadingContext = {
  materials: Pick<StoryboardMaterial, "id" | "name">[];
  aspect_ratio?: string;
  shots?: readonly Pick<StoryboardShot, "id" | "order">[];
};
export type StoryboardStreamPreview = Omit<StoryboardReadingContext, "shots"> & {
  title?: string;
  shots: StoryboardReadableShot[];
};

/** 流式草稿只供阅读；未闭合字段不补成可保存、可制作的最终分镜。 */
export function storyboardStreamPreview(
  output: unknown,
): StoryboardStreamPreview | null {
  const row = record(output);
  const preview = record(record(row?.meta)?.storyboard_preview);
  if (preview?.type !== "storyboard" || !Array.isArray(preview.shots))
    return null;
  const shots: StoryboardReadableShot[] = [];
  for (const raw of preview.shots) {
    const shot = record(raw);
    if (
      !shot ||
      typeof shot.id !== "string" ||
      !shot.id.trim() ||
      !Number.isInteger(shot.order) ||
      !Number.isFinite(shot.duration) ||
      Number(shot.duration) <= 0 ||
      typeof shot.description !== "string" ||
      typeof shot.beat !== "string" ||
      typeof shot.camera_instruction !== "string" ||
      !Array.isArray(shot.speech)
    )
      continue;
    const speech: StoryboardReadableShot["speech"] = [];
    for (const rawSpeech of shot.speech) {
      const entry = record(rawSpeech);
      if (
        entry &&
        typeof entry.id === "string" &&
        typeof entry.text === "string" &&
        (entry.kind === "dialogue" || entry.kind === "narration")
      )
        speech.push({
          id: entry.id,
          kind: entry.kind,
          text: entry.text,
          ...(typeof entry.character_id === "string"
            ? { character_id: entry.character_id }
            : {}),
        });
    }
    shots.push({
      id: shot.id,
      order: Number(shot.order),
      duration: Number(shot.duration),
      beat: shot.beat,
      description: shot.description,
      camera_instruction: shot.camera_instruction,
      ...(typeof shot.start_framing === "string"
        ? { start_framing: shot.start_framing }
        : {}),
      speech,
    });
  }
  const materials = (
    Array.isArray(preview.materials) ? preview.materials : []
  ).flatMap((raw) => {
    const material = record(raw);
    return material &&
      typeof material.id === "string" &&
      typeof material.name === "string"
      ? [{ id: material.id, name: material.name }]
      : [];
  });
  return {
    shots,
    materials,
    ...(typeof preview.title === "string" ? { title: preview.title } : {}),
    ...(typeof preview.aspect_ratio === "string" &&
    /^\d+:\d+$/.test(preview.aspect_ratio)
      ? { aspect_ratio: preview.aspect_ratio }
      : {}),
  };
}
function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
