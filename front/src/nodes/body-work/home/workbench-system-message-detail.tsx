import type { ComponentType } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  getCompatModule,
} from "@dever/front-plugin";
import type { WorkbenchSystemMessage } from "./workbench-api";

type MessageContentViewProps = {
  output?: unknown;
  emptyText?: string;
  className?: string;
  markdownClassName?: string;
  richClassName?: string;
  mediaLayout?: "default" | "chat" | "detail";
};

const contentViewModule = getCompatModule(
  "@/components/energon/content-view",
) as {
  ContentView?: ComponentType<MessageContentViewProps>;
  EnergonContentView?: ComponentType<MessageContentViewProps>;
};
const MessageContentView =
  contentViewModule.ContentView || contentViewModule.EnergonContentView;

export function WorkbenchSystemMessageDetail({
  message,
  publishedAtLabel,
  onClose,
}: {
  message: WorkbenchSystemMessage;
  publishedAtLabel: string;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="hb-system-message-detail sm:max-w-2xl">
        <DialogHeader className="hb-system-message-detail-header">
          <DialogTitle>系统消息</DialogTitle>
          <DialogDescription className="sr-only">
            查看官方消息详情
          </DialogDescription>
        </DialogHeader>

        <div className="hb-system-message-detail-body">
          <header className="hb-system-message-detail-article-header">
            <h2>{message.title || "系统消息"}</h2>
            <time dateTime={message.publishedAt}>{publishedAtLabel}</time>
          </header>
          {MessageContentView ? (
            <MessageContentView
              output={{ text: message.content }}
              emptyText="暂无消息内容。"
              markdownClassName="hb-system-message-detail-content"
              richClassName="hb-system-message-detail-content"
              mediaLayout="detail"
            />
          ) : (
            <p className="hb-system-message-detail-content">
              {message.content || "暂无消息内容。"}
            </p>
          )}
        </div>

        <DialogFooter className="hb-system-message-detail-footer">
          <Button onClick={onClose}>我知道了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
