export type AssetUploadPhase =
  | "preparing"
  | "uploading"
  | "saving"
  | "complete";

export type AssetUploadProgress = {
  phase: AssetUploadPhase;
  fileName: string;
  fileIndex: number;
  fileCount: number;
  loaded: number;
  total: number;
  percent: number;
};

export type AssetUploadOptions = {
  onProgress?: (progress: AssetUploadProgress) => void;
};

export type AssetUploadHandler<Result> = (
  files: File[],
  options?: AssetUploadOptions,
) => Promise<Result[]>;

type UploadSource = {
  name?: string;
  size?: number;
};

export function createSequentialAssetUploadProgress(
  files: UploadSource[],
  onProgress?: (progress: AssetUploadProgress) => void,
) {
  const sources = files.map((file) => ({
    name: String(file.name || ""),
    size: normalizeSize(file.size),
  }));
  const total = sources.reduce((sum, file) => sum + file.size, 0);
  const weights = sources.map((file) => Math.max(file.size, 1));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const ratios = sources.map(() => 0);

  function emit(index: number, phase: AssetUploadPhase) {
    const source = sources[index];
    if (!source || !onProgress) return;

    const loaded = sources.reduce(
      (sum, file, fileIndex) => sum + file.size * ratios[fileIndex],
      0,
    );
    const loadedWeight = weights.reduce(
      (sum, weight, fileIndex) => sum + weight * ratios[fileIndex],
      0,
    );
    onProgress({
      phase,
      fileName: source.name,
      fileIndex: index + 1,
      fileCount: sources.length,
      loaded: Math.round(loaded),
      total,
      percent:
        totalWeight > 0
          ? Math.round(Math.min(1, loadedWeight / totalWeight) * 100)
          : 100,
    });
  }

  function setRatio(index: number, ratio: number, phase: AssetUploadPhase) {
    if (!sources[index]) return;
    ratios[index] = Math.max(ratios[index], clampRatio(ratio));
    emit(index, phase);
  }

  return {
    start(index: number) {
      setRatio(index, 0, "preparing");
    },
    report(
      index: number,
      loaded: number,
      transportTotal: number,
      phase: AssetUploadPhase = "uploading",
    ) {
      const source = sources[index];
      if (!source) return;
      const ratio =
        phase === "saving" || phase === "complete"
          ? 1
          : uploadRatio(loaded, transportTotal, source.size);
      setRatio(index, ratio, phase);
    },
    saving(index: number) {
      setRatio(index, 1, "saving");
    },
    complete(index: number) {
      setRatio(index, 1, "complete");
    },
  };
}

function uploadRatio(loaded: number, total: number, sourceSize: number) {
  const normalizedLoaded = normalizeSize(loaded);
  const normalizedTotal = normalizeSize(total);
  if (normalizedTotal > 0) {
    return normalizedLoaded / normalizedTotal;
  }
  if (sourceSize > 0) {
    return normalizedLoaded / sourceSize;
  }
  return 0;
}

function normalizeSize(value: number | undefined) {
  const size = Number(value || 0);
  return Number.isFinite(size) && size > 0 ? size : 0;
}

function clampRatio(value: number) {
  return Math.max(0, Math.min(Number.isFinite(value) ? value : 0, 1));
}
