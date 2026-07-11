import type { AgentChatSession } from "./api";
import type { ChatMessage } from "./types";

export type SessionView = {
  title: string;
  messages: ChatMessage[];
  oldestMessageID: number;
  canLoadOlder: boolean;
};

export function upsertSession(
  sessions: AgentChatSession[],
  session: AgentChatSession,
  moveToFront: boolean,
) {
  const currentIndex = sessions.findIndex(
    (current) => current.id === session.id,
  );
  if (moveToFront || currentIndex < 0) {
    return [
      session,
      ...sessions.filter((current) => current.id !== session.id),
    ];
  }
  return sessions.map((current) =>
    current.id === session.id ? session : current,
  );
}

export function appendUniqueSessions(
  current: AgentChatSession[],
  incoming: AgentChatSession[],
) {
  const existingIDs = new Set(current.map((session) => session.id));
  return [
    ...current,
    ...incoming.filter((session) => !existingIDs.has(session.id)),
  ];
}

export function prependUniqueMessages(
  current: ChatMessage[],
  incoming: ChatMessage[],
) {
  const existingIDs = new Set(
    current
      .map((message) => message.recordID)
      .filter((id): id is number => Boolean(id)),
  );
  const olderMessages = incoming.filter(
    (message) => !message.recordID || !existingIDs.has(message.recordID),
  );
  return [...olderMessages, ...current];
}

export function mergeLatestMessages(
  current: ChatMessage[],
  incoming: ChatMessage[],
) {
  const incomingRecordIDs = new Set(
    incoming
      .map((message) => message.recordID)
      .filter((id): id is number => Boolean(id)),
  );
  const preservedMessages = current.filter(
    (message) =>
      Boolean(message.recordID) && !incomingRecordIDs.has(message.recordID!),
  );
  return [...preservedMessages, ...incoming];
}
