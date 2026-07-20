import { EnergonAudioPlayer } from "@/components/energon/content-view";
import { FileText } from "lucide-react";

export function AssetAudioPreview({
  src,
  prompt = "",
  detailed = false,
}: {
  src: string;
  prompt?: string;
  detailed?: boolean;
}) {
  const player = (
    <div
      className={[
        "wb-asset-audio-preview",
        detailed ? "is-detail" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <EnergonAudioPlayer
        src={src}
        detailed={detailed}
        className="h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
      />
    </div>
  );

  if (!detailed) {
    return player;
  }
  return (
    <div className="wb-asset-audio-detail">
      {player}
      {prompt ? (
        <section className="wb-asset-audio-prompt">
          <header>
            <FileText aria-hidden="true" />
            <strong>语音文本</strong>
          </header>
          <p>{prompt}</p>
        </section>
      ) : null}
    </div>
  );
}
