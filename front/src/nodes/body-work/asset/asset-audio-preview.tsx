import { EnergonAudioPlayer } from "@/components/energon/content-view";

export function AssetAudioPreview({
  src,
  autoPlay = false,
}: {
  src: string;
  autoPlay?: boolean;
}) {
  return (
    <div className="wb-asset-audio-preview">
      <EnergonAudioPlayer
        src={src}
        autoPlay={autoPlay}
        className="h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
      />
    </div>
  );
}
