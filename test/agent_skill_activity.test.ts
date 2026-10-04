import assert from "node:assert/strict";
import test from "node:test";

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { appRuntime: {}, location: { origin: "https://fixture.invalid", host: "fixture.invalid" } },
});

const activityModule = import("../front/src/nodes/shared/agent-output/activity.ts")
  .finally(() => Reflect.deleteProperty(globalThis, "window"));

function skillActivity(event: string, status: string) {
  return {
    event,
    text: status === "failed" ? "HTTP 请求失败（状态码 401：鉴权失败）" : "知识探索 · 技能请求",
    meta: {
      tool_call_id: "skill-request",
      tool_name: "http_request",
      tool_kind: "skill",
      tool_title: "知识探索 · 技能请求",
      skill_key: "research-fixture",
      skill_name: "知识探索",
      skill_action: "技能请求",
      tool_status: status,
    },
  };
}

test("live and recovered skill activities keep the same actual identity and action", async () => {
  const { mergeAgentChatActivities, readAgentChatActivities, readAgentChatActivity } = await activityModule;
  const started = readAgentChatActivity(skillActivity("tool_start", "running"));
  const finished = readAgentChatActivity(skillActivity("tool_result", "succeeded"));
  assert.ok(started);
  assert.ok(finished);
  const live = mergeAgentChatActivities([started], finished);
  const recovered = readAgentChatActivities({ activities: [skillActivity("tool_result", "succeeded")] });
  assert.equal(live[0].title, "知识探索 · 技能请求");
  assert.equal(live[0].title, recovered[0].title);
  assert.equal(live[0].status, recovered[0].status);
  assert.equal(live.length, 1);
});

test("reused and restored skill loads remain visibly distinct after hydration", async () => {
  const { readAgentChatActivities, readAgentChatActivity } = await activityModule;
  for (const action of ["技能加载", "复用已加载技能", "恢复已加载技能"]) {
    const output = skillActivity("tool_result", "succeeded");
    output.meta.tool_name = "load_skill";
    output.meta.skill_action = action;
    output.meta.tool_title = `知识探索 · ${action}`;
    output.text = `知识探索 · ${action}完成`;
    const live = readAgentChatActivity(output);
    const recovered = readAgentChatActivities({ activities: [output] })[0];
    assert.equal(live?.title, `知识探索 · ${action}`);
    assert.equal(recovered.title, live?.title);
    assert.equal(recovered.text, output.text);
  }
});

test("HTTP errors stay failed after activity hydration", async () => {
  const { readAgentChatActivities, readAgentChatActivity } = await activityModule;
  const output = { ...skillActivity("tool_error", "failed"), error: "HTTP 请求失败（状态码 401：鉴权失败）" };
  const live = readAgentChatActivity(output);
  const recovered = readAgentChatActivities({ activities: [output] })[0];
  assert.equal(live?.status, "failed");
  assert.equal(recovered.status, "failed");
  assert.equal(recovered.error, output.error);
  assert.equal(recovered.title, "知识探索 · 技能请求");
});

test("missing configuration stays a visible failure rather than completion", async () => {
  const { readAgentChatActivities, readAgentChatActivity } = await activityModule;
  const blocked = {
    ...skillActivity("tool_error", "blocked"),
    text: "该技能需要补充配置后才能运行",
    error: "该技能需要补充配置后才能运行",
    outcome: "blocked",
    outcome_code: "missing_config",
  };
  assert.equal(readAgentChatActivity(blocked)?.status, "failed");
  assert.equal(readAgentChatActivities({ activities: [blocked] })[0].status, "failed");
});
