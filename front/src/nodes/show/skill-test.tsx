import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { buildRuntimeRequestHeaders, request } from "@dever/front-plugin";
import {
  CheckCircle2,
  Loader2,
  Play,
  Sparkles,
  Square,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import type { NodeItemProps } from "@/page/nodes";
import { runAgentStream, stopAgentStream } from "@/lib/agent/runner";
import { reloadStorePageSchema } from "@/lib/page-schema-reload";
import {
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
  runtimeErrorMessage,
} from "@/lib/runtime-stream-output";
import { getStoreValueByPath } from "@/lib/store";
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from "@/lib/stream";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AgentContentOutputView } from "./agent-content-output";
import { assistantApiRequest, isPlainRecord } from "./assistant-api";
import { resolveSkillDraftPatchPayload } from "./skill-draft-patch";

type SkillTestMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  running?: boolean;
  kind?: "test" | "analysis" | "repair" | "publish";
  result?: SkillTestResponse;
  output?: AgentOutput | null;
  error?: string;
};

type SkillTestResponse = {
  status: number;
  msg: string;
  data: Record<string, unknown>;
};

type AgentOutput = Record<string, unknown>;

type PublishOption = {
  id: string;
  name: string;
};

type PublishOptions = {
  packs: PublishOption[];
  cates: PublishOption[];
};

type PublishForm = {
  key: string;
  name: string;
  description: string;
  packID: string;
  cateID: string;
};

type SkillTestConfigField = {
  id: string;
  key: string;
  targetKey: string;
  name: string;
  type: "text" | "secret";
  required: boolean;
};

type SkillTestConfigValue = {
  key: string;
  target_key: string;
  value: string;
};

const DEFAULT_DRAFT_PATH = "data.actionTarget.testDraft";
const DEFAULT_TEST_API = "/bot/admin/skill_draft/test";
const DEFAULT_PUBLISH_API = "/bot/admin/skill_draft/publish";
const DEFAULT_PUBLISH_OPTIONS_API = "/bot/admin/skill_draft/publish_options";
const DEFAULT_PATCH_API = "/bot/admin/skill_draft/apply_patch";
const DEFAULT_AGENT_KEY = "skill-creator";
const DEFAULT_HEIGHT = "min(calc(85vh - 11rem), 620px)";
const DEFAULT_TIMEOUT_SECONDS = 15;
const ASSISTANT_MESSAGE_STATUS_NORMAL = 1;
const ASSISTANT_MESSAGE_STATUS_ERROR = 2;
const ASSISTANT_MESSAGE_STATUS_RUNNING = 3;

export function ShowSkillTest({ item, store }: NodeItemProps) {
  const draftPath = String(item.meta?.draftPath || DEFAULT_DRAFT_PATH);
  const openPath = String(item.meta?.openPath || "");
  const draft = useStore(store, () => {
    const value = getStoreValueByPath(store, draftPath);
    return isPlainRecord(value) ? value : {};
  });
  const agentKey = useStore(store, () => {
    const configured = valueText(
      getStoreValueByPath(store, String(item.meta?.agentPath || "")),
    );
    return configured || String(item.meta?.agentKey || DEFAULT_AGENT_KEY);
  });
  const agentName = useStore(store, () =>
    valueText(
      getStoreValueByPath(store, String(item.meta?.agentNamePath || "")),
    ),
  );
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true,
  );
  const draftID = positiveNumber(draft.id || draft.draft_id || draft.draftId);
  const draftEditable = Number(draft.status || 0) === 1;
  const draftPublished = Number(draft.status || 0) === 2;
  const testConfigFields = useMemo(() => draftTestConfigFields(draft), [draft]);
  const [input, setInput] = useState("");
  const [testConfigValues, setTestConfigValues] = useState<
    Record<string, string>
  >({});
  const [messages, setMessages] = useState<SkillTestMessage[]>([]);
  const [running, setRunning] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [tested, setTested] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [latestTestResult, setLatestTestResult] =
    useState<SkillTestResponse | null>(null);
  const [repairSaved, setRepairSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(draftPublished);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishForm, setPublishForm] = useState<PublishForm>(() =>
    draftPublishForm({}),
  );
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    packs: [],
    cates: [],
  });
  const [publishOptionsLoading, setPublishOptionsLoading] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [error, setError] = useState("");
  const [requestID, setRequestID] = useState("");
  const [lastStreamID, setLastStreamID] = useState("0-0");
  const [cancelable, setCancelable] = useState(false);
  const [stopping, setStopping] = useState(false);
  const runTokenRef = useRef(0);
  const autoRepairKeyRef = useRef("");
  const testApi = String(item.meta?.testApi || DEFAULT_TEST_API);
  const publishApi = String(item.meta?.publishApi || DEFAULT_PUBLISH_API);
  const publishOptionsApi = String(
    item.meta?.publishOptionsApi || DEFAULT_PUBLISH_OPTIONS_API,
  );
  const reloadPageOnPublish = item.meta?.reloadPageOnPublish !== false;
  const reloadPageOnPublishDelayMs = Math.max(
    0,
    Number(item.meta?.reloadPageOnPublishDelayMs || 500),
  );
  const requestApi = String(item.meta?.requestApi || "/bot/admin/agent/run");
  const streamApi = String(item.meta?.streamApi || "/bot/admin/agent/stream");
  const stopApi = String(item.meta?.stopApi || "/bot/admin/agent/stop");
  const assistantSessionApi = String(
    item.meta?.sessionApi || "/bot/admin/assistant/session",
  );
  const assistantMessageApi = String(
    item.meta?.messageApi || "/bot/admin/assistant/message",
  );
  const skillDraftPatchApi = String(
    item.meta?.skillDraftPatchApi || DEFAULT_PATCH_API,
  );
  const draftAssistantOpenPath = String(
    item.meta?.draftAssistantOpenPath || "state.dialog.draftAssistant",
  );
  const draftAssistantDraftPath = String(
    item.meta?.draftAssistantDraftPath || "data.actionTarget.draftAgent",
  );
  const draftAssistantMetaPath = String(
    item.meta?.draftAssistantMetaPath || "data.actionTarget.draftAssistantMeta",
  );
  const blockMs = Number(item.meta?.blockMs || 1000);
  const autoRepairEnabled = item.meta?.skillDraftAutoRepair !== false;
  const height =
    valueText(item.meta?.height || item.meta?.containerHeight) ||
    DEFAULT_HEIGHT;
  const placeholder = String(
    item.meta?.placeholder || "输入测试参数，每行一个；留空表示不带参数运行。",
  );
  const emptyText = String(
    item.meta?.emptyText ||
      "输入一次测试参数开始测试。系统会先检查技能内容，再在沙箱中运行脚本。",
  );
  const canStart = draftID > 0 && draftEditable && !running && !tested;
  const canPublish =
    draftID > 0 &&
    tested &&
    testPassed &&
    !running &&
    !publishing &&
    !published &&
    draftEditable;
  const publishTitle = published
    ? "当前技能已发布。"
    : testPassed
      ? "测试已通过，可以发布。"
      : "测试通过后才可以发布。";
  const canRepair =
    draftID > 0 &&
    Boolean(agentKey) &&
    Boolean(latestTestResult) &&
    tested &&
    !testPassed &&
    !running &&
    !publishing &&
    draftEditable;

  useEffect(() => {
    if (!modalOpen) {
      return;
    }
    reset();
  }, [draftID, modalOpen]);

  useEffect(() => {
    if (!publishDialogOpen || publishOptionsLoading) {
      return;
    }
    setPublishForm((current) =>
      normalizePublishFormSelections(current, publishOptions),
    );
  }, [publishDialogOpen, publishOptionsLoading, publishOptions]);

  const inputArgs = useMemo(() => splitArgs(input), [input]);

  useEffect(() => {
    if (
      !autoRepairEnabled ||
      !modalOpen ||
      !agentKey ||
      draftID <= 0 ||
      running ||
      publishing ||
      !tested ||
      testPassed ||
      !latestTestResult ||
      !shouldAutoRepairTestFailure(latestTestResult)
    ) {
      return;
    }
    const repairKey = autoRepairSignature(draftID, latestTestResult);
    if (!repairKey || autoRepairKeyRef.current === repairKey) {
      return;
    }
    autoRepairKeyRef.current = repairKey;
    void repairTestFailure();
  }, [
    autoRepairEnabled,
    agentKey,
    draftID,
    latestTestResult,
    modalOpen,
    publishing,
    running,
    tested,
    testPassed,
  ]);

  const startTest = async () => {
    if (!canStart) {
      return;
    }
    const token = runTokenRef.current + 1;
    runTokenRef.current = token;
    autoRepairKeyRef.current = "";
    setRunning(true);
    setRepairing(false);
    setTested(false);
    setTestPassed(false);
    setLatestTestResult(null);
    setRepairSaved(false);
    setPublished(draftPublished);
    setError("");
    setRequestID("");
    setLastStreamID("0-0");
    setCancelable(false);

    const userText = input.trim() || "不带参数运行测试。";
    const testMessageID = `test-${Date.now()}`;
    setMessages([
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: userText,
      },
      {
        id: testMessageID,
        role: "assistant",
        kind: "test",
        text: "正在运行测试...",
        running: true,
      },
    ]);

    try {
      const testResult = await runSkillDraftTest(
        testApi,
        draftID,
        inputArgs,
        draftTestConfigPayload(testConfigFields, testConfigValues),
      );
      if (runTokenRef.current !== token) {
        return;
      }
      const passed = testResult.status === 1;
      setLatestTestResult(testResult);
      setTestPassed(passed);
      setMessages((current) =>
        current.map((message) =>
          message.id === testMessageID
            ? {
                ...message,
                text: testResult.msg,
                running: false,
                result: testResult,
              }
            : message,
        ),
      );

      if (!agentKey) {
        setTested(true);
        return;
      }
      if (!passed && shouldAutoRepairTestFailure(testResult)) {
        return;
      }

      const analysisID = `analysis-${Date.now()}`;
      setMessages((current) => [
        ...current,
        {
          id: analysisID,
          role: "assistant",
          kind: "analysis",
          text: `${agentName || "技能创建工程师"}正在分析测试结果...`,
          running: true,
        },
      ]);
      await explainTestResult({
        token,
        messageID: analysisID,
        testResult,
        args: inputArgs,
      });
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        const message = runtimeErrorMessage(currentError, "测试失败。");
        setError(message);
        setMessages((current) =>
          current.map((item) =>
            item.running
              ? {
                  ...item,
                  text:
                    item.kind === "analysis" || !item.result
                      ? message
                      : item.text,
                  running: false,
                  error:
                    item.kind === "analysis" || !item.result
                      ? message
                      : item.error,
                }
              : item,
          ),
        );
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false);
        setTested(true);
        setCancelable(false);
      }
    }
  };

  const explainTestResult = async ({
    token,
    messageID,
    testResult,
    args,
  }: {
    token: number;
    messageID: string;
    testResult: SkillTestResponse;
    args: string[];
  }) => {
    await runAgentStream<AgentOutput>({
      agent: agentKey,
      input: {
        text: "请根据这次真实技能测试结果判断是否通过；失败时说明原因和修改建议。",
        draft: compactDraft(draft),
        skill_test: testResult.data,
        test_status: testResult.status,
        test_message: testResult.msg,
        test_args: args,
      },
      history: [],
      requestApi,
      streamApi,
      stopApi,
      blockMs,
      onRequestID: (nextRequestID) => {
        if (runTokenRef.current !== token) {
          return;
        }
        setRequestID(valueText(nextRequestID));
      },
      onFrame: (frame: RuntimeStreamFrame<AgentOutput>) => {
        if (runTokenRef.current !== token) {
          return;
        }
        const streamID = valueText(frame?.stream_id);
        if (streamID) {
          setLastStreamID(streamID);
        }
        const frameCancelable = resolveRuntimeFrameCancelable(frame);
        if (frameCancelable != null) {
          setCancelable(frameCancelable);
        }
        const output = frameOutput(frame);
        const text = frameText(frame);
        if (text) {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageID
                ? {
                    ...message,
                    text,
                    output: output || message.output,
                    running: frame.type !== "result",
                  }
                : message,
            ),
          );
        }
        if (frame.type === "result") {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageID
                ? {
                    ...message,
                    text: text || message.text || "AI 已完成测试结果分析。",
                    output: output || message.output,
                    running: false,
                  }
                : message,
            ),
          );
        }
      },
    });
  };

  const repairTestFailure = async () => {
    if (!canRepair || !latestTestResult) {
      return;
    }
    const token = runTokenRef.current + 1;
    runTokenRef.current = token;
    setRunning(true);
    setRepairing(true);
    setRepairSaved(false);
    setError("");
    setRequestID("");
    setLastStreamID("0-0");
    setCancelable(false);

    const contextKey = skillDraftSessionContext(draftID);
    const userText = buildRepairUserMessage(draft, latestTestResult, inputArgs);
    const repairMessageID = `repair-${Date.now()}`;
    setMessages((current) => [
      ...current,
      {
        id: `repair-user-${Date.now()}`,
        role: "user",
        text: "请根据本次测试失败结果修复技能。",
      },
      {
        id: repairMessageID,
        role: "assistant",
        kind: "repair",
        text: `${agentName || "技能创建工程师"}正在修复技能...`,
        running: true,
      },
    ]);

    try {
      const sessionPayload = await loadAssistantSessionForRepair({
        api: assistantSessionApi,
        agentKey,
        agentName,
        contextKey,
      });
      const sessionID = sessionPayload.sessionID;
      const history = assistantSessionHistory(sessionPayload.messages);
      await saveAssistantMessage({
        api: assistantMessageApi,
        sessionID,
        agentKey,
        contextKey,
        role: "user",
        kind: "skill_draft_test_repair",
        text: userText,
        data: {
          draft_id: draftID,
          draft: repairDraftPayload(draft),
          skill_test: latestTestResult.data,
          test_status: latestTestResult.status,
          test_message: latestTestResult.msg,
          test_args: inputArgs,
        },
      });

      let activeRequestID = "";
      let runningMessageSaved = false;
      let runningMessagePromise: Promise<unknown> | null = null;
      let finalOutput: AgentOutput | null = null;

      const saveRunningMessage = (nextRequestID: string) => {
        const normalizedRequestID = valueText(nextRequestID);
        if (!normalizedRequestID || runningMessageSaved) {
          return;
        }
        runningMessageSaved = true;
        runningMessagePromise = saveAssistantMessage({
          api: assistantMessageApi,
          sessionID,
          agentKey,
          contextKey,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: "AI 正在根据测试失败结果修复技能...",
          requestID: normalizedRequestID,
          status: ASSISTANT_MESSAGE_STATUS_RUNNING,
          output: assistantTextOutput("AI 正在根据测试失败结果修复技能..."),
        });
      };

      await runAgentStream<AgentOutput>({
        agent: agentKey,
        input: {
          text: userText,
          draft: repairDraftPayload(draft),
          skill_test: latestTestResult.data,
          test_status: latestTestResult.status,
          test_message: latestTestResult.msg,
          test_args: inputArgs,
          assistant_session_id: sessionID,
        },
        history,
        requestApi,
        streamApi,
        stopApi,
        blockMs,
        onRequestID: (nextRequestID) => {
          if (runTokenRef.current !== token) {
            return;
          }
          activeRequestID = valueText(nextRequestID);
          setRequestID(activeRequestID);
          saveRunningMessage(activeRequestID);
        },
        onFrame: (frame: RuntimeStreamFrame<AgentOutput>) => {
          if (runTokenRef.current !== token) {
            return;
          }
          const streamID = valueText(frame?.stream_id);
          if (streamID) {
            setLastStreamID(streamID);
          }
          const frameCancelable = resolveRuntimeFrameCancelable(frame);
          if (frameCancelable != null) {
            setCancelable(frameCancelable);
          }
          const output = frameOutput(frame);
          const text = frameText(frame);
          if (output) {
            finalOutput = frame.type === "result" ? output : finalOutput;
          }
          setMessages((current) =>
            current.map((message) =>
              message.id === repairMessageID
                ? {
                    ...message,
                    text: text || message.text,
                    output: output || message.output,
                    running: frame.type !== "result",
                  }
                : message,
            ),
          );
        },
      });

      if (runTokenRef.current !== token) {
        return;
      }
      if (runningMessagePromise) {
        await runningMessagePromise.catch(() => undefined);
      }
      const patchPayload = finalOutput
        ? resolveSkillDraftPatchPayload(finalOutput)
        : null;
      if (!patchPayload) {
        const message = "AI 没有返回可保存的技能修复内容。";
        await saveAssistantMessage({
          api: assistantMessageApi,
          sessionID,
          agentKey,
          contextKey,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: message,
          requestID: activeRequestID,
          status: ASSISTANT_MESSAGE_STATUS_ERROR,
          output: assistantTextOutput(message),
        });
        throw new Error(message);
      }

      const applyResult = normalizeActionResponse(
        await request(
          skillDraftPatchApi,
          "post",
          buildRepairPatchRequest({
            draftID,
            draft,
            patchPayload,
            sessionID,
            agentKey,
            contextKey,
          }),
        ),
        "技能修复已保存。",
        "保存技能修复失败。",
      );
      if (applyResult.status !== 1) {
        await saveAssistantMessage({
          api: assistantMessageApi,
          sessionID,
          agentKey,
          contextKey,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: applyResult.msg,
          requestID: activeRequestID,
          status: ASSISTANT_MESSAGE_STATUS_ERROR,
          output: assistantTextOutput(applyResult.msg),
        });
        throw new Error(applyResult.msg);
      }
      syncRepairedDraft(applyResult.data);
      const validationError = skillDraftValidationError(applyResult.data);
      if (validationError) {
        await saveAssistantMessage({
          api: assistantMessageApi,
          sessionID,
          agentKey,
          contextKey,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: validationError,
          requestID: activeRequestID,
          status: ASSISTANT_MESSAGE_STATUS_ERROR,
          output: assistantTextOutput(validationError),
        });
        throw new Error(validationError);
      }

      const savedMessage =
        "AI 已根据测试失败结果修复并保存到当前技能草稿，请重新测试。";
      await saveAssistantMessage({
        api: assistantMessageApi,
        sessionID,
        agentKey,
        contextKey,
        role: "assistant",
        kind: "skill_draft_test_repair",
        text: savedMessage,
        requestID: activeRequestID,
        status: ASSISTANT_MESSAGE_STATUS_NORMAL,
        data: {
          draft_id: draftID,
          patch: patchPayload.patch,
          repair_output: finalOutput,
        },
        output: assistantTextOutput(savedMessage),
      });
      setRepairSaved(true);
      setTested(false);
      setTestPassed(false);
      setLatestTestResult(null);
      setRequestID("");
      setLastStreamID("0-0");
      setMessages((current) =>
        current.map((message) =>
          message.id === repairMessageID
            ? {
                ...message,
                text: savedMessage,
                running: false,
              }
            : message,
        ),
      );
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        const message = runtimeErrorMessage(currentError, "AI 修复失败。");
        setError(message);
        setMessages((current) =>
          current.map((item) =>
            item.id === repairMessageID
              ? {
                  ...item,
                  text: message,
                  running: false,
                  error: message,
                }
              : item,
          ),
        );
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false);
        setRepairing(false);
        setCancelable(false);
      }
    }
  };

  const stop = async () => {
    if (!requestID || !cancelable || stopping) {
      return;
    }
    setStopping(true);
    try {
      await stopAgentStream(requestID, stopApi);
      runTokenRef.current += 1;
      setRunning(false);
      setRepairing(false);
      setCancelable(false);
      setMessages((current) =>
        current.map((message) =>
          message.running
            ? { ...message, running: false, text: message.text || "已停止。" }
            : message,
        ),
      );
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, "停止测试分析失败。"));
    } finally {
      setStopping(false);
    }
  };

  const syncRepairedDraft = (data: Record<string, unknown>) => {
    const draftData = isPlainRecord(data.draft) ? data.draft : null;
    if (!draftData) {
      return;
    }
    store.getState().setValueByPath(draftPath, draftData);
    store.getState().setValueByPath(draftAssistantDraftPath, draftData);
    const rows = getStoreValueByPath(store, "data.table.list");
    if (!Array.isArray(rows)) {
      return;
    }
    store.getState().setValueByPath(
      "data.table.list",
      rows.map((row) =>
        isPlainRecord(row) && positiveNumber(row.id) === draftID
          ? { ...row, ...draftData }
          : row,
      ),
    );
  };

  const openRepairRecord = () => {
    if (draftID <= 0) {
      return;
    }
    const currentDraft = getStoreValueByPath(store, draftPath);
    store
      .getState()
      .setValueByPath(
        draftAssistantDraftPath,
        isPlainRecord(currentDraft) ? currentDraft : draft,
      );
    store.getState().setValueByPath(draftAssistantMetaPath, {
      title: "继续编辑",
      description: "通过 AI 对话继续修改技能；保存后回到列表继续测试或发布。",
    });
    if (openPath) {
      store.getState().setValueByPath(openPath, false);
    }
    store.getState().setValueByPath(draftAssistantOpenPath, true);
  };

  const openPublishDialog = () => {
    if (!canPublish) {
      return;
    }
    setPublishForm(draftPublishForm(draft));
    setPublishError("");
    setPublishDialogOpen(true);
    void loadPublishOptions();
  };

  const loadPublishOptions = async () => {
    setPublishOptionsLoading(true);
    try {
      const response = await request(publishOptionsApi, "post", {});
      setPublishOptions(normalizePublishOptions(response));
    } catch (currentError: unknown) {
      setPublishError(runtimeErrorMessage(currentError, "加载发布选项失败。"));
    } finally {
      setPublishOptionsLoading(false);
    }
  };

  const submitPublish = async () => {
    if (!canPublish) {
      return;
    }
    const name = publishForm.name.trim();
    if (!name) {
      setPublishError("技能名称不能为空。");
      return;
    }
    setPublishing(true);
    setError("");
    setPublishError("");
    const publishMessageID = `publish-${Date.now()}`;
    setMessages((current) => [
      ...current,
      {
        id: publishMessageID,
        role: "assistant",
        kind: "publish",
        text: "正在发布技能...",
        running: true,
      },
    ]);
    try {
      const result = normalizeActionResponse(
        await request(publishApi, "post", {
          id: draftID,
          expected_version: positiveNumber(draft.version),
          name,
          description: publishForm.description.trim(),
          pack_id: positiveNumber(publishForm.packID),
          cate_id: positiveNumber(publishForm.cateID),
        }),
        "发布完成。",
        "发布失败。",
      );
      const ok = result.status === 1;
      setPublished(ok);
      if (ok) {
        setPublishDialogOpen(false);
        schedulePublishReload();
      }
      if (!ok) {
        setPublishError(result.msg);
        setError(result.msg);
      }
      setMessages((current) =>
        current.map((message) =>
          message.id === publishMessageID
            ? {
                ...message,
                text: result.msg,
                running: false,
                error: ok ? "" : result.msg,
              }
            : message,
        ),
      );
    } catch (currentError: unknown) {
      const message = runtimeErrorMessage(currentError, "发布失败。");
      setPublishError(message);
      setError(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === publishMessageID
            ? {
                ...item,
                text: message,
                running: false,
                error: message,
              }
            : item,
        ),
      );
    } finally {
      setPublishing(false);
    }
  };

  const schedulePublishReload = () => {
    if (!reloadPageOnPublish) {
      return;
    }
    window.setTimeout(() => {
      void reloadStorePageSchema(store);
    }, reloadPageOnPublishDelayMs);
  };

  function reset() {
    runTokenRef.current += 1;
    autoRepairKeyRef.current = "";
    setInput("");
    setTestConfigValues({});
    setMessages([]);
    setRunning(false);
    setRepairing(false);
    setTested(false);
    setTestPassed(false);
    setLatestTestResult(null);
    setRepairSaved(false);
    setPublishing(false);
    setPublished(draftPublished);
    setPublishDialogOpen(false);
    setPublishForm(draftPublishForm({}));
    setPublishError("");
    setError("");
    setRequestID("");
    setLastStreamID("0-0");
    setCancelable(false);
    setStopping(false);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void startTest();
    }
  };

  return (
    <div
      className="flex min-h-0 flex-col gap-3 overflow-hidden"
      style={{ height }}
    >
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                message.role === "user"
                  ? "border-primary/20 bg-primary text-primary-foreground"
                  : "bg-muted/35 text-foreground",
              )}
            >
              <SkillTestMessageContent message={message} />
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
        {testConfigFields.length > 0 ? (
          <div className="grid max-h-48 gap-3 overflow-y-auto border-b p-3 sm:grid-cols-2">
            {testConfigFields.map((field) => (
              <label key={field.id} className="grid min-w-0 gap-1.5 text-xs">
                <span className="truncate font-medium text-foreground">
                  {field.name}
                  {field.targetKey ? (
                    <span className="ml-1 font-normal text-muted-foreground">
                      ({field.targetKey})
                    </span>
                  ) : null}
                  {field.required ? (
                    <span className="ml-1 text-destructive">*</span>
                  ) : null}
                </span>
                <Input
                  type={field.type === "secret" ? "password" : "text"}
                  value={testConfigValues[field.id] || ""}
                  disabled={running || publishing || tested || draftID <= 0}
                  autoComplete="off"
                  className="h-9"
                  onChange={(event) => {
                    const value = event.target.value;
                    setTestConfigValues((current) => ({
                      ...current,
                      [field.id]: value,
                    }));
                  }}
                />
              </label>
            ))}
          </div>
        ) : null}
        <Textarea
          value={input}
          disabled={running || publishing || tested || draftID <= 0}
          placeholder={placeholder}
          className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between gap-3 border-t px-3 py-2">
          <div className="min-w-0 truncate text-xs text-muted-foreground">
            {draftID <= 0
              ? "缺少技能草稿，无法测试。"
              : requestID
                ? `RequestID: ${requestID}${lastStreamID !== "0-0" ? ` / ${lastStreamID}` : ""}`
                : running
                  ? repairing
                    ? "AI 正在修复技能，修复记录会保存到继续编辑会话。"
                    : "正在测试技能，结果会显示在上方。"
                  : tested
                    ? "本轮测试已完成；清空后可重新测试。"
                    : repairSaved
                      ? "AI 已修复草稿，请重新测试。"
                      : "本次只执行一轮测试。"}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {repairSaved ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={running || publishing}
                onClick={openRepairRecord}
              >
                查看修复记录
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={running || publishing}
              onClick={reset}
            >
              <Trash2 className="size-3.5" />
              清空
            </Button>
            {running ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!cancelable || stopping}
                onClick={() => void stop()}
              >
                {stopping ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Square className="size-3.5" />
                )}
                停止
              </Button>
            ) : null}
            {tested && !testPassed && latestTestResult ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canRepair}
                onClick={() => void repairTestFailure()}
              >
                {repairing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                AI 修复
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={!canStart}
              onClick={() => void startTest()}
            >
              {running ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              开始测试
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canPublish}
              title={publishTitle}
              onClick={openPublishDialog}
            >
              {publishing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UploadCloud className="size-4" />
              )}
              {published ? "已发布" : "发布"}
            </Button>
          </div>
        </div>
      </div>
      <PublishSettingsDialog
        open={publishDialogOpen}
        form={publishForm}
        options={publishOptions}
        loadingOptions={publishOptionsLoading}
        publishing={publishing}
        error={publishError}
        onOpenChange={(open) => {
          if (!publishing) {
            setPublishDialogOpen(open);
          }
        }}
        onChange={setPublishForm}
        onSubmit={() => void submitPublish()}
      />
    </div>
  );
}

function PublishSettingsDialog({
  open,
  form,
  options,
  loadingOptions,
  publishing,
  error,
  onOpenChange,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: PublishForm;
  options: PublishOptions;
  loadingOptions: boolean;
  publishing: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onChange: (form: PublishForm) => void;
  onSubmit: () => void;
}) {
  const update = (patch: Partial<PublishForm>) => {
    onChange({ ...form, ...patch });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-5 py-4 text-start">
          <DialogTitle>发布设置</DialogTitle>
          <DialogDescription>
            测试通过的技能内容不会在这里修改；这里只调整发布元信息。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-5 py-4">
          <PublishField label="技能标识">
            <Input value={form.key} disabled className="font-mono" />
          </PublishField>
          <PublishField label="技能名称" required>
            <Input
              value={form.name}
              disabled={publishing}
              onChange={(event) => update({ name: event.target.value })}
            />
          </PublishField>
          <PublishField label="技能描述">
            <Textarea
              value={form.description}
              disabled={publishing}
              className="min-h-24 resize-none"
              onChange={(event) => update({ description: event.target.value })}
            />
          </PublishField>
          <PublishField label="技能方案">
            <PublishSelect
              value={form.packID}
              disabled={publishing || loadingOptions}
              options={options.packs}
              placeholder={loadingOptions ? "正在加载..." : "请选择技能方案"}
              onChange={(value) => update({ packID: value })}
            />
          </PublishField>
          <PublishField label="技能分类">
            <PublishSelect
              value={form.cateID}
              disabled={publishing || loadingOptions}
              options={options.cates}
              placeholder={loadingOptions ? "正在加载..." : "请选择技能分类"}
              onChange={(value) => update({ cateID: value })}
            />
          </PublishField>
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 border-t px-5 py-3">
          <Button
            type="button"
            variant="outline"
            disabled={publishing}
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button type="button" disabled={publishing} onClick={onSubmit}>
            {publishing ? <Loader2 className="size-4 animate-spin" /> : null}
            保存并发布
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PublishField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      <span>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function PublishSelect({
  value,
  options,
  disabled,
  placeholder,
  onChange,
}: {
  value: string;
  options: PublishOption[];
  disabled?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const selectedValue = options.some((option) => option.id === value)
    ? value
    : undefined;
  return (
    <Select
      value={selectedValue}
      disabled={disabled}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SkillTestMessageContent({ message }: { message: SkillTestMessage }) {
  if (message.kind === "test" && message.result) {
    return <SkillTestResultView result={message.result} />;
  }
  if (message.kind === "analysis" || message.kind === "repair") {
    return (
      <div className="space-y-2">
        {message.running && !message.output ? (
          <div className="text-muted-foreground">
            <Loader2 className="mr-2 inline size-3.5 animate-spin align-[-2px]" />
            {message.text}
          </div>
        ) : (
          <AgentContentOutputView
            output={message.output || assistantTextOutput(message.text)}
            streaming={message.running}
            emptyText={
              message.kind === "repair"
                ? "等待智能体修复技能。"
                : "等待智能体分析测试结果。"
            }
          />
        )}
      </div>
    );
  }
  return (
    <div className="whitespace-pre-wrap break-words">
      {message.running ? (
        <Loader2 className="mr-2 inline size-3.5 animate-spin align-[-2px]" />
      ) : null}
      {message.text}
    </div>
  );
}

function SkillTestResultView({ result }: { result: SkillTestResponse }) {
  const passed = result.status === 1;
  const data = result.data;
  const tests = recordArray(data.tests);
  if (tests.length === 0 && isPlainRecord(data.test)) {
    tests.push(data.test);
  }
  const issues = arrayText(data.issues);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-medium">
        {passed ? (
          <CheckCircle2 className="size-4 text-emerald-600" />
        ) : (
          <XCircle className="size-4 text-destructive" />
        )}
        <span>{result.msg || (passed ? "测试通过" : "测试未通过")}</span>
      </div>
      {issues.length > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          {issues.map((issue) => (
            <div key={issue}>- {issue}</div>
          ))}
        </div>
      ) : null}
      {tests.map((test, index) => (
        <SkillTestRunView
          key={`${valueText(test.target)}:${valueText(test.script)}:${index}`}
          test={test}
          showDivider={index > 0}
        />
      ))}
    </div>
  );
}

function SkillTestRunView({
  test,
  showDivider,
}: {
  test: Record<string, unknown>;
  showDivider: boolean;
}) {
  const duration = valueText(test.duration_ms);
  return (
    <div className={cn("space-y-2", showDivider && "border-t pt-2")}>
      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div>脚本：{valueText(test.script) || "自动选择"}</div>
        <div>退出码：{valueText(test.exit_code) || "0"}</div>
        <div>耗时：{duration ? `${duration}ms` : "-"}</div>
      </div>
      <TestOutputBlock title="输出" value={valueText(test.stdout)} />
      <TestOutputBlock title="错误输出" value={valueText(test.stderr)} />
      <TestOutputBlock title="异常" value={valueText(test.error)} />
    </div>
  );
}

function TestOutputBlock({ title, value }: { title: string; value: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 text-xs leading-5 text-foreground">
        {value}
      </pre>
    </div>
  );
}

async function runSkillDraftTest(
  api: string,
  draftID: number,
  args: string[],
  config: SkillTestConfigValue[],
) {
  const response = await silentJsonRequest(api, {
    id: draftID,
    args,
    config,
    timeout_seconds: DEFAULT_TIMEOUT_SECONDS,
  });
  return normalizeTestResponse(response);
}

async function silentJsonRequest(api: string, payload: Record<string, unknown>) {
  const response = await fetch(api, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      ...buildRuntimeRequestHeaders({
        contentType: "application/json",
        url: api,
      }),
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!text) {
    return {
      status: response.ok ? 1 : 2,
      msg: response.ok ? "请求成功。" : `请求失败：${response.status}`,
      data: {},
    };
  }
  try {
    return JSON.parse(text);
  } catch {
    return {
      status: 2,
      msg: response.ok ? "响应不是有效 JSON。" : `请求失败：${response.status}`,
      data: { text },
    };
  }
}

function normalizeTestResponse(response: unknown): SkillTestResponse {
  if (!isPlainRecord(response)) {
    return {
      status: 2,
      msg: "测试失败。",
      data: {},
    };
  }
  const status = Number(
    response.status || (Number(response.code) === 0 ? 1 : 0),
  );
  return {
    status: status === 1 ? 1 : 2,
    msg:
      valueText(response.msg || response.message) ||
      (status === 1 ? "测试通过。" : "测试失败。"),
    data: isPlainRecord(response.data) ? response.data : {},
  };
}

function shouldAutoRepairTestFailure(result: SkillTestResponse) {
  if (result.status === 1) {
    return false;
  }
  const data = isPlainRecord(result.data) ? result.data : {};
  return truthyConfigValue(data.repairable);
}

function autoRepairSignature(draftID: number, result: SkillTestResponse) {
  const detail = safeJSONStringify({ message: result.msg, data: result.data });
  return detail ? `${draftID}:${detail.slice(0, 1000)}` : "";
}

function skillDraftValidationError(data: Record<string, unknown>) {
  const validation = isPlainRecord(data.validation) ? data.validation : null;
  if (!validation || valueText(validation.valid) === "true") {
    return "";
  }
  if (validation.valid === true) {
    return "";
  }
  const issues = arrayText(validation.issues);
  if (issues.length === 0) {
    return "";
  }
  const detail = issues.slice(0, 5).join("\n");
  return `AI 修复已保存，但内容检查仍未通过：\n${detail}`;
}

function normalizeActionResponse(
  response: unknown,
  successMessage: string,
  failureMessage: string,
): SkillTestResponse {
  if (!isPlainRecord(response)) {
    return {
      status: 2,
      msg: failureMessage,
      data: {},
    };
  }
  const status = Number(
    response.status || (Number(response.code) === 0 ? 1 : 0),
  );
  return {
    status: status === 1 ? 1 : 2,
    msg:
      valueText(response.msg || response.message) ||
      (status === 1 ? successMessage : failureMessage),
    data: isPlainRecord(response.data) ? response.data : {},
  };
}

function normalizePublishOptions(response: unknown): PublishOptions {
  if (!isPlainRecord(response)) {
    return { packs: [], cates: [] };
  }
  const data = isPlainRecord(response.data) ? response.data : response;
  return {
    packs: publishOptionList(data.packs),
    cates: publishOptionList(data.cates),
  };
}

function publishOptionList(value: unknown): PublishOption[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!isPlainRecord(item)) {
        return null;
      }
      const id = valueText(item.id || item.value || item.key);
      const name = valueText(item.name || item.label || item.title || item.text);
      return id && name ? { id, name } : null;
    })
    .filter((item): item is PublishOption => Boolean(item));
}

function normalizePublishFormSelections(
  form: PublishForm,
  options: PublishOptions,
): PublishForm {
  const packID = resolvePublishOptionID(form.packID, options.packs);
  const cateID = resolvePublishOptionID(form.cateID, options.cates);
  if (packID === form.packID && cateID === form.cateID) {
    return form;
  }
  return { ...form, packID, cateID };
}

function resolvePublishOptionID(
  value: string,
  options: PublishOption[],
): string {
  if (value && options.some((option) => option.id === value)) {
    return value;
  }
  return options[0]?.id || "";
}

function draftPublishForm(draft: Record<string, unknown>): PublishForm {
  return {
    key: valueText(draft.key),
    name: valueText(draft.name),
    description: valueText(draft.description),
    packID: valueText(draft.pack_id || draft.packId),
    cateID: valueText(draft.cate_id || draft.cateId),
  };
}

function buildRepairUserMessage(
  draft: Record<string, unknown>,
  result: SkillTestResponse,
  args: string[],
) {
  return [
    "请根据本次技能测试失败结果修复当前技能草稿。",
    `技能：${valueText(draft.name) || valueText(draft.key) || "未命名技能"}`,
    `测试参数：${args.length > 0 ? args.join(", ") : "无"}`,
    `测试消息：${result.msg}`,
  ].join("\n");
}

function repairDraftPayload(draft: Record<string, unknown>) {
  return {
    id: draft.id || draft.draft_id || draft.draftId,
    version: draft.version,
    key: draft.key,
    name: draft.name,
    description: draft.description,
    pack_id: draft.pack_id || draft.packId,
    cate_id: draft.cate_id || draft.cateId,
    skill_md: draft.skill_md || draft.skillMd,
    files_json: draft.files_json || draft.filesJson,
    manifest: draft.manifest,
  };
}

function skillDraftSessionContext(draftID: number) {
  return `skill_draft:${draftID}`;
}

async function loadAssistantSessionForRepair({
  api,
  agentKey,
  agentName,
  contextKey,
}: {
  api: string;
  agentKey: string;
  agentName: string;
  contextKey: string;
}): Promise<{ sessionID: number; messages: unknown[] }> {
  const payload = await assistantApiRequest(api, {
    agent_key: agentKey,
    context_key: contextKey,
    title: agentName ? `${agentName} 会话` : "技能创建工程师会话",
    limit: 80,
  });
  const session = isPlainRecord(payload.session) ? payload.session : {};
  const sessionID = positiveNumber(session.id);
  if (sessionID <= 0) {
    throw new Error("创建技能修复会话失败。");
  }
  return {
    sessionID,
    messages: Array.isArray(payload.messages) ? payload.messages : [],
  };
}

async function saveAssistantMessage({
  api,
  sessionID,
  agentKey,
  contextKey,
  role,
  kind,
  text,
  data,
  output,
  requestID,
  status,
}: {
  api: string;
  sessionID: number;
  agentKey: string;
  contextKey: string;
  role: "user" | "assistant";
  kind: string;
  text: string;
  data?: Record<string, unknown>;
  output?: unknown;
  requestID?: string;
  status?: number;
}): Promise<Record<string, unknown>> {
  if (sessionID <= 0) {
    return {};
  }
  return await assistantApiRequest(api, {
    session_id: sessionID,
    agent_key: agentKey,
    context_key: contextKey,
    role,
    kind,
    text,
    content: {
      kind,
      data: data || {},
    },
    output: output || {},
    request_id: requestID || "",
    status: status || ASSISTANT_MESSAGE_STATUS_NORMAL,
  });
}

function assistantSessionHistory(rows: unknown[]): Record<string, unknown>[] {
  return rows
    .map((row) => assistantSessionHistoryRow(row))
    .filter((row): row is Record<string, unknown> => Boolean(row));
}

function assistantSessionHistoryRow(
  value: unknown,
): Record<string, unknown> | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  const role = valueText(value.role) === "user" ? "user" : "assistant";
  const content = isPlainRecord(value.content) ? value.content : {};
  const output = isPlainRecord(value.output) ? value.output : {};
  const row: Record<string, unknown> = {
    role,
    text: valueText(value.text),
  };
  const kind = valueText(content.kind || value.kind);
  if (kind) {
    row.type = kind;
  }
  if (isPlainRecord(content.data)) {
    row.data = content.data;
  }
  if (Object.keys(output).length > 0) {
    row.output = output;
  }
  return row;
}

function buildRepairPatchRequest({
  draftID,
  draft,
  patchPayload,
  sessionID,
  agentKey,
  contextKey,
}: {
  draftID: number;
  draft: Record<string, unknown>;
  patchPayload: Record<string, unknown>;
  sessionID: number;
  agentKey: string;
  contextKey: string;
}) {
  return {
    ...patchPayload,
    id: draftID,
    expected_version: positiveNumber(draft.version),
    pack_id:
      positiveNumber(patchPayload.pack_id || patchPayload.packId) ||
      positiveNumber(draft.pack_id || draft.packId),
    cate_id:
      positiveNumber(patchPayload.cate_id || patchPayload.cateId) ||
      positiveNumber(draft.cate_id || draft.cateId),
    assistant_session_id: sessionID,
    assistant_agent_key: agentKey,
    assistant_context_key: contextKey,
  };
}

function frameOutput(frame: RuntimeStreamFrame<AgentOutput>) {
  const output = normalizeRuntimeFrameOutput(frame?.output, frame);
  return isPlainRecord(output) ? output : null;
}

function frameText(frame: RuntimeStreamFrame<AgentOutput>) {
  const output = frameOutput(frame);
  if (!isPlainRecord(output)) {
    return valueText(frame?.msg);
  }
  return (
    valueText(output.text) ||
    valueText(output.content) ||
    valueText(output.message) ||
    valueText(output.result) ||
    valueText(frame?.msg)
  );
}

function assistantTextOutput(text: string): AgentOutput {
  return {
    text,
    content: {
      format: "markdown",
      text,
    },
  };
}

function compactDraft(draft: Record<string, unknown>) {
  return {
    id: draft.id,
    key: draft.key,
    name: draft.name,
    description: draft.description,
    manifest: draft.manifest,
  };
}

function draftTestConfigFields(
  draft: Record<string, unknown>,
): SkillTestConfigField[] {
  const manifest = recordFromJSON(draft.manifest);
  const configs = Array.isArray(manifest.config) ? manifest.config : [];
  const fields: SkillTestConfigField[] = [];
  const seen = new Set<string>();
  configs.forEach((value) => {
    if (!isPlainRecord(value)) {
      return;
    }
    const key = valueText(value.key).trim();
    if (!key) {
      return;
    }
    const targetKey = valueText(
      value.target_key || value.targetKey || value.target,
    ).trim();
    const id = JSON.stringify([targetKey, key]);
    if (seen.has(id)) {
      return;
    }
    seen.add(id);
    fields.push({
      id,
      key,
      targetKey,
      name: valueText(value.name).trim() || key,
      type:
        valueText(value.type).trim().toLowerCase() === "secret"
          ? "secret"
          : "text",
      required: truthyConfigValue(value.required),
    });
  });
  return fields;
}

function draftTestConfigPayload(
  fields: SkillTestConfigField[],
  values: Record<string, string>,
): SkillTestConfigValue[] {
  return fields.flatMap((field) => {
    const value = values[field.id] || "";
    if (!value.trim()) {
      return [];
    }
    return [{ key: field.key, target_key: field.targetKey, value }];
  });
}

function recordFromJSON(value: unknown): Record<string, unknown> {
  if (isPlainRecord(value)) {
    return value;
  }
  if (typeof value !== "string" || !value.trim()) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(value);
    return isPlainRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function truthyConfigValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return ["1", "true", "yes", "on"].includes(
    valueText(value).trim().toLowerCase(),
  );
}

function splitArgs(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayText(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => valueText(item)).filter(Boolean)
    : [];
}

function recordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isPlainRecord);
}

function safeJSONStringify(value: unknown) {
  try {
    const text = JSON.stringify(value, null, 2);
    return text.length > 6000 ? `${text.slice(0, 6000)}\n...` : text;
  } catch {
    return valueText(value);
  }
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}
