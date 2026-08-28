import type { StoryboardDocument, StoryboardShot } from "./space-storyboard";

const LRC_LINE_PATTERN = /^\[(?:\d{1,3}):\d{2}(?:[.:]\d{1,3})?\]\s*(.*)$/;

export function parseStoryboardLyricsLRC(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }
  const lines: string[] = [];
  for (const rawLine of value.replace(/\r\n?/g, "\n").split("\n")) {
    const match = rawLine.trim().match(LRC_LINE_PATTERN);
    const lyric = match?.[1]?.trim() || "";
    if (lyric) {
      lines.push(lyric);
    }
  }
  return lines;
}

export function storyboardShotLyrics(
  storyboard: Pick<StoryboardDocument, "work_type" | "lyrics_lrc">,
  shot: Pick<StoryboardShot, "lyric_line_indexes">,
): string[] {
  if (storyboard.work_type !== "mv") {
    return [];
  }
  const lines = parseStoryboardLyricsLRC(storyboard.lyrics_lrc);
  return (shot.lyric_line_indexes || [])
    .map((index) => lines[index - 1] || "")
    .filter(Boolean);
}

export function storyboardShotLyricsPrompt(
  storyboard: Pick<StoryboardDocument, "work_type" | "lyrics_lrc">,
  shot: Pick<StoryboardShot, "lyric_line_indexes">,
): string {
  const lyrics = storyboardShotLyrics(storyboard, shot);
  return lyrics.length
    ? `本镜对应歌词：${lyrics.join(" / ")}；必须按歌词语义、情绪和节奏设计画面，不得生成歌词文字`
    : "";
}
