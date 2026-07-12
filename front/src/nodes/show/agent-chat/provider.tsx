import { useCallback, type PropsWithChildren } from "react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { buildAgentChatAssistantContent } from "./message-content";
import type { AgentChatController, ChatMessage } from "./types";
import type { ReferenceInput } from "./reference";

export function RuntimeProvider({
  controller,
  children,
}: PropsWithChildren<{ controller: AgentChatController }>) {
  const onNew = useCallback(
    async (message: AppendMessage) => {
      const text = message.content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
        .trim();
      if (text) {
        await controller.send(plainReferenceInput(text));
      }
    },
    [controller.send],
  );
  const onCancel = useCallback(() => controller.stop(), [controller.stop]);
  const runtime = useExternalStoreRuntime<ChatMessage>({
    messages: controller.messages,
    isRunning: controller.running,
    isLoading: controller.sessionLoading,
    isDisabled: controller.sessionLoading,
    isSendDisabled: controller.sendDisabled,
    convertMessage,
    onNew,
    onCancel,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

function convertMessage(message: ChatMessage): ThreadMessageLike {
  if (message.role === "user") {
    return {
      id: message.id,
      role: "user",
      content: message.text
        ? [{ type: "text" as const, text: message.text }]
        : [],
      metadata: {
        custom: messageMetadata(message),
      },
    };
  }
  return {
    id: message.id,
    role: "assistant",
    content: buildAgentChatAssistantContent(message),
    status: message.running
      ? { type: "running" }
      : message.error
        ? { type: "incomplete", reason: "error", error: message.text }
        : { type: "complete", reason: "stop" },
    metadata: {
      custom: messageMetadata(message),
    },
  };
}

function messageMetadata(message: ChatMessage) {
  return {
    recordID: message.recordID || 0,
    requestID: message.requestID || "",
    output: message.output,
    activities: message.activities || [],
    sourceText: message.text,
    content: message.content,
  };
}

function plainReferenceInput(text: string): ReferenceInput {
  return {
    text,
    content: {
      version: 1,
      parts: [{ type: "text", text }],
    },
  };
}
