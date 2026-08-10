import { embeddedJSONValues, isPlainRecord } from "./structured-json";

export type MediaContentKind = "image" | "video" | "audio" | "file";

export type MediaContentItem = {
  url: string;
  thumbnail?: string;
};

export type MediaContentIndex<Kind extends MediaContentKind> = Record<
  Kind,
  Map<string, MediaContentItem>
>;

type MutableMediaContentIndex = Partial<
  Record<MediaContentKind, Map<string, MediaContentItem>>
>;

type CollectMediaContentOptions<Kind extends MediaContentKind> = {
  kind?: Kind;
  seen?: Set<object>;
};

type MediaContentCollector = {
  media: MutableMediaContentIndex;
  enabledKinds: readonly MediaContentKind[];
  seen: Set<object>;
  requestedKind?: MediaContentKind;
};

const MEDIA_CONTENT_FIELDS: Record<
  MediaContentKind,
  { direct: readonly string[]; collections: readonly string[] }
> = {
  image: {
    direct: ["image", "image_url", "imageUrl"],
    collections: ["images", "image_urls", "imageUrls"],
  },
  video: {
    direct: ["video", "video_url", "videoUrl"],
    collections: ["videos", "video_urls", "videoUrls"],
  },
  audio: {
    direct: ["audio", "audio_url", "audioUrl"],
    collections: ["audios", "audio_urls", "audioUrls"],
  },
  file: {
    direct: ["file", "file_url", "fileUrl"],
    collections: ["files", "file_urls", "fileUrls"],
  },
};

const MEDIA_CONTENT_NESTED_FIELDS = [
  "rich",
  "content",
  "output",
  "result",
  "data",
  "body",
  "value",
  "json",
  "media_files",
  "mediaFiles",
  "text",
] as const;

export function createMediaContentIndex<Kind extends MediaContentKind>(
  kinds: readonly Kind[],
): MediaContentIndex<Kind> {
  return Object.fromEntries(
    kinds.map((kind) => [kind, new Map<string, MediaContentItem>()]),
  ) as MediaContentIndex<Kind>;
}

export function collectMediaContent<Kind extends MediaContentKind>(
  media: MediaContentIndex<Kind>,
  value: unknown,
  options: CollectMediaContentOptions<Kind> = {},
) {
  const collector: MediaContentCollector = {
    media,
    enabledKinds: Object.keys(media) as Kind[],
    seen: options.seen || new Set<object>(),
    requestedKind: options.kind,
  };
  collectMediaContentValue(value, collector, 0, options.kind);
}

export function extractMediaContentItems(
  value: unknown,
  kind: MediaContentKind,
): MediaContentItem[] {
  const kinds: MediaContentKind[] =
    kind === "audio" ? ["audio", "image"] : [kind];
  const media = createMediaContentIndex(kinds);
  collectMediaContent(media, value, { kind });
  pairOrderedAudioCoverItems(media);
  return Array.from(media[kind].values());
}

export function pairOrderedAudioCoverItems(
  media: MutableMediaContentIndex,
) {
  const audioItems = media.audio;
  const imageItems = media.image;
  if (
    !audioItems ||
    !imageItems ||
    audioItems.size === 0 ||
    audioItems.size !== imageItems.size
  ) {
    return;
  }

  const covers = Array.from(imageItems.values());
  Array.from(audioItems.values()).forEach((audio, index) => {
    if (audio.thumbnail) {
      return;
    }
    const thumbnail = normalizeMediaContentThumbnail(
      "audio",
      audio.url,
      covers[index]?.url || "",
    );
    if (thumbnail) {
      audioItems.set(audio.url, { ...audio, thumbnail });
    }
  });
}

function collectMediaContentValue(
  value: unknown,
  collector: MediaContentCollector,
  depth: number,
  fieldKind?: MediaContentKind,
  inheritedThumbnail = "",
): void {
  if (value == null || depth > 12) {
    return;
  }
  if (Array.isArray(value)) {
    const thumbnail = value.length > 1 ? "" : inheritedThumbnail;
    value.forEach((item) =>
      collectMediaContentValue(
        item,
        collector,
        depth + 1,
        fieldKind,
        thumbnail,
      ),
    );
    return;
  }
  if (typeof value === "string") {
    const embedded = embeddedJSONValues(value);
    if (embedded.length > 0) {
      embedded.forEach((parsed) =>
        collectMediaContentValue(
          parsed,
          collector,
          depth + 1,
          fieldKind,
          inheritedThumbnail,
        ),
      );
      return;
    }
    const kind =
      fieldKind || collector.requestedKind || mediaContentKindFromURL(value);
    if (kind && collector.media[kind] && isMediaContentURL(value)) {
      appendMediaContent(
        collector.media,
        kind,
        value.trim(),
        inheritedThumbnail,
      );
    }
    return;
  }
  if (typeof value !== "object" || collector.seen.has(value)) {
    return;
  }
  collector.seen.add(value);

  const record = value as Record<string, unknown>;
  const attrs = isPlainRecord(record.attrs) ? record.attrs : undefined;
  const explicitKind = mediaContentKindFromType(
    record.type,
    record.kind,
    record.media_type,
    record.mediaType,
    record.mime,
  );
  const thumbnail = firstMediaContentThumbnail(
    record,
    attrs,
    inheritedThumbnail,
  );
  const contextualKind = fieldKind || collector.requestedKind;
  if (
    contextualKind &&
    collector.media[contextualKind] &&
    (!explicitKind || explicitKind === contextualKind)
  ) {
    for (const direct of genericMediaContentValues(record, contextualKind)) {
      collectMediaContentValue(
        direct,
        collector,
        depth + 1,
        contextualKind,
        thumbnail,
      );
    }
  }

  for (const kind of collector.enabledKinds) {
    const fields = MEDIA_CONTENT_FIELDS[kind];
    for (const key of fields.direct) {
      collectMediaContentValue(
        record[key],
        collector,
        depth + 1,
        kind,
        thumbnail,
      );
    }
    for (const key of fields.collections) {
      collectMediaContentValue(
        record[key],
        collector,
        depth + 1,
        kind,
        thumbnail,
      );
    }
  }

  if (explicitKind && collector.media[explicitKind]) {
    for (const direct of genericMediaContentValues(record, explicitKind)) {
      collectMediaContentValue(
        direct,
        collector,
        depth + 1,
        explicitKind,
        thumbnail,
      );
    }
    collectMediaContentValue(
      record.attrs,
      collector,
      depth + 1,
      explicitKind,
      thumbnail,
    );
  }

  for (const key of MEDIA_CONTENT_NESTED_FIELDS) {
    collectMediaContentValue(
      record[key],
      collector,
      depth + 1,
    );
  }
}

function genericMediaContentValues(
  record: Record<string, unknown>,
  kind: MediaContentKind,
) {
  const values = [
    record.url,
    record.src,
    record.file_url,
    record.fileUrl,
    record.download_url,
    record.downloadUrl,
  ];
  if (kind === "file") {
    values.push(record.download, record.open_url, record.openUrl, record.path);
  }
  return values;
}

function appendMediaContent(
  media: MutableMediaContentIndex,
  kind: MediaContentKind,
  url: string,
  thumbnail: string,
) {
  const items = media[kind];
  if (!items) {
    return;
  }
  const normalizedThumbnail = normalizeMediaContentThumbnail(
    kind,
    url,
    thumbnail,
  );
  const existing = items.get(url);
  if (existing?.thumbnail || !normalizedThumbnail) {
    if (!existing) {
      items.set(url, { url });
    }
    return;
  }
  items.set(url, { url, thumbnail: normalizedThumbnail });
}

function normalizeMediaContentThumbnail(
  kind: MediaContentKind,
  mediaURL: string,
  thumbnail: string,
) {
  const value = thumbnail.trim();
  if (!value || (kind !== "image" && value === mediaURL.trim())) {
    return "";
  }
  return value;
}

function firstMediaContentThumbnail(
  record: Record<string, unknown>,
  attrs: Record<string, unknown> | undefined,
  fallback: string,
) {
  for (const value of [
    record.thumbnail,
    record.thumbnail_url,
    record.thumbnailUrl,
    record.poster,
    record.poster_url,
    record.posterUrl,
    record.cover,
    record.cover_url,
    record.coverUrl,
    record.first_frame_url,
    record.firstFrameUrl,
    attrs?.thumbnail,
    attrs?.thumbnail_url,
    attrs?.thumbnailUrl,
    attrs?.poster,
    attrs?.cover,
    fallback,
  ]) {
    if (typeof value === "string" && isMediaContentURL(value)) {
      return value.trim();
    }
  }
  return "";
}

function mediaContentKindFromType(...values: unknown[]) {
  for (const value of values) {
    const normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    if (
      ["image", "mediaimage", "editormediaimage"].includes(normalized) ||
      normalized.startsWith("image/")
    ) {
      return "image" as const;
    }
    if (
      ["video", "mediavideo", "editormediavideo"].includes(normalized) ||
      normalized.startsWith("video/")
    ) {
      return "video" as const;
    }
    if (
      ["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
        normalized,
      ) ||
      normalized.startsWith("audio/")
    ) {
      return "audio" as const;
    }
    if (
      ["file", "mediafile", "editormediafile"].includes(normalized) ||
      normalized.startsWith("application/") ||
      normalized.startsWith("text/")
    ) {
      return "file" as const;
    }
  }
  return undefined;
}

function mediaContentKindFromURL(value: string) {
  const url = value.trim();
  if (
    /^data:image\//i.test(url) ||
    /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(url)
  ) {
    return "image" as const;
  }
  if (
    /^data:video\//i.test(url) ||
    /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url)
  ) {
    return "video" as const;
  }
  if (
    /^data:audio\//i.test(url) ||
    /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(url)
  ) {
    return "audio" as const;
  }
  return undefined;
}

function isMediaContentURL(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(value.trim());
}
