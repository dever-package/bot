import { s as Se } from "./writing-reference-Bgk4pNta.js";
import { q as he, d as ke, f as Ve, g as Be, Z as Pe, _ as te, $ as re, a0 as Le, Q as qe, a1 as Ge, a2 as ze, a3 as je, P as Ye } from "./asset-preview-Bb3VoJnt.js";
import { x as be, ah as He, a5 as Je } from "./asset-audio-preview-Cezm24us.js";
import { i as Qe } from "./space-assistant-layout-Drz4je9C.js";
function we(e, t) {
  return `${e}:${t}`;
}
const We = [
  "characters",
  "scenes",
  "props"
], Qt = [
  z("characters", "角色组", "character", 0),
  z("scenes", "场景组", "scene", 1),
  z("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: We,
    layoutIndex: 0,
    enabled: he,
    items: Xe
  },
  {
    key: "shots",
    title: "镜头视频组",
    itemType: "shot",
    powerKind: "video",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ["shot_images"],
    layoutIndex: 1,
    enabled: ke,
    items: Ze
  },
  {
    key: "speech",
    title: "配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: Ve,
    items: rt
  },
  {
    key: "subtitles",
    title: "字幕组",
    itemType: "subtitle",
    powerKind: "text",
    outputType: "general",
    local: !0,
    direction: "downstream",
    layoutIndex: 3,
    enabled: Be,
    items: it
  }
];
function Ze(e) {
  const t = Le(e), n = Pe(e.shots);
  return e.shots.map((r, i) => {
    const o = i === 0 && e.chapter_boundary?.connection === "continue" ? te({ ...r, continue_previous: !0 }) : n[i], s = ft(
      e,
      r,
      i,
      o
    );
    return {
      type: "shot",
      visualContext: ne(e, re(e, r)),
      id: r.id,
      title: `镜头 ${r.order || i + 1}`,
      prompt: _t(
        e,
        r,
        s.externalReferences
      ),
      ...s,
      paramValues: St(
        e,
        r,
        o
      ),
      shotId: r.id,
      shotImageMode: o?.mode,
      sharedEndShotId: o?.mode === "next_first" ? r.shared_end_shot_id : void 0,
      sharedStartShotId: r.continue_previous && i > 0 ? e.shots[i - 1].id : void 0,
      shotDuration: r.duration,
      requiredDurationValues: t,
      continuityAnchor: r.continuity_anchor
    };
  });
}
function Xe(e) {
  const t = Pe(e.shots);
  return e.shots.flatMap((n, r) => {
    const i = r === 0 && e.chapter_boundary?.connection === "continue" ? te({ ...n, continue_previous: !0 }) : t[r];
    if (i.nodeMode === "none")
      return [];
    const o = i.nodeMode === "last_frame" ? "end" : "start", s = ct(
      e,
      n,
      r,
      o
    ), c = tt(
      e,
      n,
      i.nodeMode,
      s
    );
    return [
      {
        type: "shot_image",
        visualContext: ne(e, re(e, n)),
        id: n.id,
        title: et(
          n.order || r + 1,
          i.nodeMode
        ),
        prompt: c.prompt,
        dependencyItems: s.dependencyItems,
        referenceItems: s.referenceItems,
        externalReferences: s.externalReferences,
        paramValues: vt(e),
        shotId: n.id,
        shotImageMode: i.nodeMode,
        frameMediaItems: i.frameMediaItems,
        imageSequenceFrames: c.frames
      }
    ];
  });
}
function et(e, t) {
  return `镜头 ${e} ${je[t]}`;
}
function tt(e, t, n, r) {
  switch (n) {
    case "first_last": {
      const i = lt(e, t);
      return {
        prompt: pt(i),
        frames: i
      };
    }
    case "references":
      return {
        prompt: mt(e, t)
      };
    case "last_frame":
      return {
        prompt: pe(
          e,
          t,
          "end",
          r.anchorLabel,
          r.referenceMaterials,
          r.externalReferences
        )
      };
    default:
      return {
        prompt: pe(
          e,
          t,
          "start",
          r.anchorLabel,
          r.referenceMaterials,
          r.externalReferences
        )
      };
  }
}
function z(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (i, o) => he(i) && i.materials.some(le(n, o)),
    items: (i, o) => i.materials.filter(le(n, o)).map((s) => {
      const c = gt(
        i,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: st(s),
        visualContext: ne(i, [s]),
        externalReferences: c
      };
    })
  };
}
function le(e, t) {
  return (n) => n.type === e && !t?.settingItemKeys?.has(
    we(n.type, n.id)
  );
}
function rt(e) {
  const t = e.narrator_voice.trim();
  return [...qe(e).map(({ speech: r, shotId: i }, o) => ({
    type: "speech",
    id: r.id,
    title: `旁白 ${o + 1}`,
    prompt: r.text.trim(),
    ...t ? { paramValues: { voice: t } } : {},
    shotId: i,
    speechId: r.id,
    speechKind: "narration",
    startTime: r.start_time
  })), ...e.shots.flatMap(
    (r, i) => r.speech.filter((o) => o.kind === "dialogue" && o.text.trim()).map((o, s) => {
      const c = nt(e, o);
      return {
        type: "speech",
        id: o.id,
        title: ot(
          e,
          o,
          r.order || i + 1,
          s
        ),
        prompt: o.text.trim(),
        ...c ? { paramValues: { voice: c } } : {},
        shotId: r.id,
        speechId: o.id,
        characterId: o.character_id,
        speechKind: o.kind,
        speakerMode: o.speaker_mode,
        startTime: o.start_time,
        shotDuration: r.duration
      };
    })
  )];
}
function nt(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function it(e) {
  return e.shots.flatMap((t, n) => {
    const r = Ge(t);
    return r.length ? [
      {
        type: "subtitle",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 字幕`,
        prompt: r.map((i) => i.text).join(" / "),
        localOutput: {
          type: "storyboard_subtitles",
          shot_id: t.id,
          tracks: r
        },
        shotId: t.id,
        shotDuration: t.duration
      }
    ] : [];
  });
}
function ot(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const i = e.materials.find(
    (o) => o.type === "character" && o.id === t.character_id
  );
  return `镜头 ${n} ${i?.name || "角色"}配音`;
}
function ne(e, t) {
  return JSON.stringify([
    e.visual_mode,
    e.style_prompt.trim(),
    t.map((n) => [n.id, n.type, n.name, n.prompt.trim()])
  ]);
}
function st(e) {
  return e.prompt.trim() || `${e.name}素材`;
}
function at(e) {
  return e.map((t) => ({
    type: t.type,
    id: t.id
  }));
}
function ct(e, t, n, r) {
  const i = n === 0 && e.chapter_boundary?.connection === "continue" ? [{ ...t, continue_previous: !0 }, ...e.shots.slice(1)] : e.shots, o = ze(
    i,
    n,
    r,
    e.materials
  ), s = new Set(o.materialIDs), c = re(e, t).filter(
    (p) => s.has(p.id)
  ), a = at(c), d = ut(
    e,
    o.referenceKeys,
    o.includeGlobalReferences,
    c
  ), l = o.anchorID, f = ke(e) && t.continue_previous && l && l !== t.id, u = l ? { type: f ? "shot" : "shot_image", id: l } : void 0;
  return {
    anchorLabel: dt(e, t, n, r, o),
    dependencyItems: u ? [u] : [],
    // A video dependency supplies its extracted tail at runtime, not the video
    // itself as an ordinary image-model reference.
    referenceItems: [...u && !f ? [u] : [], ...a],
    referenceMaterials: c,
    externalReferences: d
  };
}
function ut(e, t, n, r) {
  const i = new Set(
    r.flatMap((s) => s.reference_keys)
  );
  if (r.length)
    for (const s of oe(e, "image"))
      i.add(s.key);
  const o = new Set(t);
  return se(
    e.references.filter(
      (s) => s.kind === "image" && !i.has(s.key) && (Ie.image.has(s.purpose) ? n : o.has(s.key))
    )
  );
}
function dt(e, t, n, r, i) {
  const { anchorID: o, anchorFrameRole: s, anchorShotIndex: c } = i;
  if (!o)
    return "";
  if (o === t.id)
    return "本镜头首帧";
  const a = e.shots[c];
  if (!a)
    return "";
  const d = c === n - 1 ? "上一镜头" : "镜头", l = s === "end" ? "尾帧" : "连续性参考帧";
  return r === "start" ? `${d} ${a.order || c + 1} 的${l}` : `${d} ${a.order || c + 1} 的${l}规划图`;
}
function ft(e, t, n, r) {
  const i = yt(e, t), o = {
    type: "shot_image",
    id: t.id
  }, s = r.nodeMode === "none" ? [] : [o];
  if (r.mode === "next_first" && t.shared_end_shot_id) {
    const a = { type: "shot_image", id: t.shared_end_shot_id };
    return {
      dependencyItems: [],
      referenceItems: [...s, a],
      externalReferences: i
    };
  }
  const c = n > 0 ? e.shots[n - 1] : void 0;
  return t.continue_previous && c ? {
    dependencyItems: [{ type: "shot", id: c.id }],
    referenceItems: s,
    externalReferences: i
  } : {
    dependencyItems: [],
    referenceItems: s,
    externalReferences: i
  };
}
function pe(e, t, n, r, i, o = []) {
  return Y(t, n);
}
function mt(e, t, n) {
  return ie([
    `镜头画面：${t.description.trim()}`,
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `起始状态：${t.continuity_state.entry.trim()}`,
    t.start_framing?.trim() ? `静态构图：${t.start_framing.trim()}` : ""
  ]);
}
function lt(e, t, n) {
  const r = Y(t, "start"), i = Y(t, "end");
  return [
    {
      title: "首帧",
      description: t.continuity_state.entry.trim(),
      prompt: r
    },
    {
      title: "尾帧",
      description: t.continuity_state.exit.trim(),
      prompt: i
    }
  ];
}
function pt(e) {
  return [
    `首帧：${e[0]?.prompt || ""}`,
    `尾帧：${e[1]?.prompt || ""}`
  ].join(`

`);
}
function Y(e, t) {
  const n = t === "end" ? e.continuity_state.exit.trim() : e.continuity_state.entry.trim();
  return ie([
    e.camera_instruction.trim() ? `取景：${e.camera_instruction.trim()}` : "",
    e.spatial_layout.trim() ? `空间关系：${e.spatial_layout.trim()}` : "",
    `${t === "end" ? "尾帧" : "首帧"}状态：${n}`,
    (t === "end" ? e.end_framing : e.start_framing)?.trim() ? `静态构图：${(t === "end" ? e.end_framing : e.start_framing)?.trim()}` : ""
  ]);
}
function _t(e, t, n = [], r) {
  return ie([
    `画面内容：${t.description.trim()}`,
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `起始状态：${t.continuity_state.entry.trim()}`,
    t.start_framing?.trim() ? `起始构图：${t.start_framing.trim()}` : "",
    `结束状态：${t.continuity_state.exit.trim()}`,
    t.end_framing?.trim() ? `结束构图：${t.end_framing.trim()}` : "",
    t.camera_instruction.trim() ? `运镜：${t.camera_instruction.trim()}` : "",
    t.video_prompt.trim() ? `镜内动作与声音：${t.video_prompt.trim()}` : "",
    ...Ye(e) ? [
      "声音方式：视频原声",
      ...t.speech.filter((i) => i.text.trim()).map((i) => {
        const o = e.materials.find((a) => a.id === i.character_id), s = i.kind === "narration" ? "旁白" : o?.name || i.character_id, c = i.kind === "narration" ? e.narrator_voice : o?.voice;
        return `${i.start_time}秒，${s}（${i.kind === "narration" || i.speaker_mode === "offscreen" ? "画外" : "出镜"}）：${i.text}${c ? `；声线：${c}` : ""}`;
      })
    ] : []
  ]);
}
function ie(e) {
  return e.filter(Boolean).join(`
`);
}
function gt(e, t) {
  return se([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...oe(e, "image")
  ]);
}
function yt(e, t) {
  return se([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...oe(e, "video")
  ]);
}
const Ie = {
  image: /* @__PURE__ */ new Set([
    "visual_style",
    "brand_style"
  ]),
  video: /* @__PURE__ */ new Set([
    "visual_style",
    "motion_style",
    "performance",
    "brand_style"
  ])
};
function oe(e, t) {
  const n = Ie[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function se(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function vt(e) {
  return { aspectRatio: e.aspect_ratio };
}
function St(e, t, n) {
  const r = n || te(t);
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration,
    referenceMode: r.referenceMode
  };
}
function ht(e) {
  return Se(e)?.materials || [];
}
function ae(e, t) {
  return e.find((n) => n.id === t && n.type === "power" && n.outputType === "setting");
}
function Wt(e, t, n) {
  for (const r of t) {
    if ((r.logicalTo || r.to) !== n || r.executionMode === "manual") continue;
    const i = ae(e, r.logicalFrom || r.from);
    if (i) return i;
  }
}
function Zt(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of t) {
    if ((i.logicalTo || i.to) !== n || i.executionMode === "manual")
      continue;
    const o = ae(e, i.logicalFrom || i.from);
    if (o)
      for (const s of e) {
        const c = s.storyboardItem;
        c?.sourceNodeId === o.id && ["character", "scene", "prop"].includes(c.itemType) && r.set(we(c.itemType, c.itemId), s);
      }
  }
  return r;
}
function Xt(e, t) {
  const n = e.storyboardItem;
  if (!n || !["character", "scene", "prop"].includes(n.itemType) || !e.asset && !e.resultRef && e.resultOutput == null)
    return "";
  const r = ae(t, n.sourceNodeId);
  if (!r) return "";
  const i = ht(r).find(
    (c) => c.id === n.itemId
  );
  if (!i) return "此设定已移除；旧形象仍保留，请更新分镜引用";
  const o = e.asset?.version?.source?.story_setting;
  if (!o) return "此形象尚未绑定当前设定，请重新生成";
  if (o.name !== i.name || o.prompt !== i.prompt)
    return "设定已更新；当前显示旧形象，重新生成后用于后续制作";
  const s = Se(r);
  return o.visual_mode !== s.visual_mode || o.aspect_ratio !== s.aspect_ratio || o.style_prompt_input !== s.style_prompt ? "全片画风或画幅已更新；当前显示旧形象，请重新生成" : "";
}
const Me = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function er(e) {
  return e.type === "file" || e.type === "files";
}
function kt(e) {
  return e.type === "prompt";
}
function tr(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function rr(e) {
  const t = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(ce).filter((n) => !!n)
    )
  );
  return t.length > 0 ? t : [];
}
function Pt(e) {
  return (e.accepted_kinds || []).map(ce).filter(
    (t) => !!t && Me.has(t)
  );
}
function D(e) {
  const t = ce(e);
  return t && Me.has(t) ? t : void 0;
}
function bt(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function ce(e) {
  const t = String(e || "").toLowerCase();
  return t === "rich" ? "richtext" : t === "music" ? "audio" : [
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ].includes(t) ? t : void 0;
}
function wt(e, t) {
  return !!(e && Qe(e.source_rule) && t > 0 && !e.sources.some(
    (n) => n.target_id === t || n.id === t
  ));
}
function nr(e, t) {
  return wt(e, t.selectedTargetId || 0) ? t.paramValues || {} : Mt(e.params || [], t);
}
function It(e) {
  const t = e.default_value ?? "";
  if (e.type === "switch")
    return xt(t);
  if (e.type === "multi_option")
    return ue(e, _e(t));
  if (e.type === "files")
    return de(_e(t));
  if (e.type === "option" || e.type === "select") {
    const n = k(e.options || [], t) || e.options?.[0];
    return A(
      e,
      M(n) || t
    );
  }
  return A(e, t);
}
function Re(e) {
  const t = {};
  for (const n of e)
    !n.key || n.type === "description" || n.defer_default || (t[n.key] = It(n));
  return t;
}
function ir(e) {
  const t = [], n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (!r.group) {
      t.push({ key: `param:${r.key}`, param: r });
      continue;
    }
    let i = n.get(r.group.id);
    i || (i = { key: `group:${r.group.id}`, group: r.group, params: [] }, n.set(r.group.id, i), t.push(i)), i.params.push(r);
  }
  return t;
}
function or(e, t, n) {
  const r = Re(e), i = new Map(
    n.map((o) => [o.key, o])
  );
  for (const o of e) {
    const s = i.get(o.key);
    o.key && s && Object.prototype.hasOwnProperty.call(t, o.key) && $t(o, s, t[o.key]) && (r[o.key] = ue(o, t[o.key]));
  }
  return r;
}
function Mt(e, t) {
  const n = Re(e), r = t.paramValues || {};
  for (const o of e)
    o.key && Object.prototype.hasOwnProperty.call(r, o.key) && (n[o.key] = ue(
      o,
      r[o.key]
    ));
  const i = e.find(kt);
  return i?.key && t.prompt?.trim() && (n[i.key] = t.prompt), Rt(e, n, void 0, r);
}
function A(e, t) {
  if (e.value_type !== "number" || t === "")
    return t;
  const n = Number(t);
  return Number.isFinite(n) ? n : t;
}
function Rt(e, t, n, r = t) {
  const i = { ...t };
  for (const o of e) {
    const s = o.option_filter_key;
    if (!s) continue;
    const c = e.find((d) => d.key === s);
    if (!c) continue;
    const a = k(o.options || [], t[o.key]);
    if (!Object.prototype.hasOwnProperty.call(r, s) && a?.group) {
      const d = k(c.options || [], a.group);
      d && (i[s] = M(d));
    }
    if ((n === s || !Object.prototype.hasOwnProperty.call(r, o.key)) && a?.group !== String(i[s] || "")) {
      const d = (o.options || []).find((l) => l.group === String(i[s] || ""));
      i[o.key] = d ? M(d) : "";
    }
  }
  return i;
}
function ue(e, t) {
  if (e.type === "option" || e.type === "select") {
    const n = k(e.options || [], t) || k(e.options || [], e.default_value) || e.options?.[0];
    return A(
      e,
      M(n) || t
    );
  }
  return e.type === "multi_option" ? de(t).map((n) => {
    const r = k(e.options || [], n);
    return A(
      e,
      M(r) || n
    );
  }) : A(e, t);
}
function $t(e, t, n) {
  if (e.type !== t.type || e.value_type !== t.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!k(r, n);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || de(n).every(
      (i) => !!k(r, i)
    );
  }
  return e.value_type === "number" ? n === "" || Number.isFinite(Number(n)) : !0;
}
function M(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function k(e, t) {
  const n = String(t ?? "").trim();
  if (!n)
    return;
  const r = [
    (i) => i.native_value,
    (i) => i.value,
    (i) => i.name,
    (i) => i.id
  ];
  for (const i of r) {
    const o = e.find(
      (s) => String(i(s) ?? "").trim() === n
    );
    if (o)
      return o;
  }
}
function sr(e, t, n = [e]) {
  return t.some(
    (r) => k(n, r) === e
  );
}
function _e(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function de(e) {
  return Array.isArray(e) ? e.map((t) => String(t)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function xt(e) {
  if (typeof e == "boolean")
    return e;
  const t = String(e ?? "").trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes" || t === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params", "@/components/searchable-option-picker"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const J = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const U = H, $e = U.filterActivePowerParams || ((e) => e), ar = U.isPowerParamConditionController || (() => !1), cr = U.shouldDisplayPowerParam || (() => !0), ur = J.SearchableOptionPicker, dr = U.PowerParamOptionDialog, fr = U.normalizeParamPreviewType;
U.PowerParamField;
U.PowerParamPopover;
function T(e, t, n = []) {
  return (e?.parts || []).filter((r) => {
    if (r.type !== "reference") return !1;
    const i = n.find(
      ({ edge: o }) => o.id === r.ref_origin_id
    );
    return (i ? P(i.source) : D(
      B(t, r)?.kind
    )) === "image";
  });
}
function b(e) {
  return `${e.ref_type}:${e.ref_id}:${e.ref_version_id || 0}:${e.ref_origin_id || ""}`;
}
function ge(e, t, n) {
  const r = e.find(Oe);
  return `${r ? M(
    k(r.options || [], t[r.key])
  ) : "default"}:${n}`;
}
function Ot(e, t, n, r, i) {
  return {
    ...e,
    [t]: {
      version: 1,
      parts: T(n, r, i)
    }
  };
}
function mr({
  content: e,
  items: t,
  connections: n,
  params: r,
  previousValues: i,
  nextValues: o,
  previousMode: s,
  nextMode: c,
  selections: a
}) {
  const d = Ot(
    a,
    ge(r, i, s),
    e,
    t,
    n
  ), l = ge(r, o, c), f = new Map(
    T(d[l], t, n).map((m) => [
      b(m),
      m
    ])
  ), u = new Set(
    T(e, t, n)
  ), p = Ce(
    $e(r, o)
  ), _ = O(p, "image", c), y = c === "shared_reference" && _.some(x);
  return { content: e && {
    ...e,
    parts: e.parts.map((m) => {
      if (m.type !== "reference" || !u.has(m)) return m;
      const v = f.get(b(m));
      if (v)
        return {
          ...m,
          usage: v.usage,
          ref_media_url: v.ref_media_url,
          ref_media_index: v.ref_media_index,
          ref_media_items: v.ref_media_items,
          ref_media_excluded: v.ref_media_excluded
        };
      if (d[l])
        return {
          ...m,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: [],
          ref_media_excluded: !0
        };
      if (y) {
        const h = m.ref_media_items?.length === 1 ? m.ref_media_items[0] : m.ref_media_url || m.ref_media_index ? {
          url: m.ref_media_url || "",
          index: m.ref_media_index || 0
        } : m.ref_media_count === 1 ? { url: "", index: 1 } : void 0, C = _.find(
          (F) => K(F.key)
        )?.key;
        return {
          ...m,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: h && C ? [{ ...h, usage: C }] : [],
          ref_media_excluded: !h
        };
      }
      const I = _[0]?.key;
      return {
        ...m,
        usage: I,
        ref_media_excluded: void 0,
        ref_media_items: m.ref_media_items?.map((h) => ({
          ...h,
          usage: void 0
        }))
      };
    })
  }, selections: d };
}
function xe(e) {
  return e.flatMap((t) => t.ref_media_excluded ? [] : (t.ref_media_items?.length ? t.ref_media_items : t.ref_media_url || t.ref_media_index ? [
    {
      url: t.ref_media_url || "",
      index: t.ref_media_index || 0,
      usage: t.usage
    }
  ] : t.ref_media_count === 1 && t.usage ? [{ url: "", index: 1, usage: t.usage }] : []).filter((r) => r.usage && Fe(r.usage)).map((r) => ({ part: t, media: r })));
}
function lr(e, t, n, r) {
  const i = xe(t);
  if (r && i.find(
    (c) => c.media.usage !== n && b(c.part) === b(r.part) && (c.media.url ? c.media.url === r.media.url : c.media.index === r.media.index)
  ))
    throw new Error("这张图片已用于另一个位置，请先取消原有选择");
  const s = new Set(t.map(b));
  return {
    ...e,
    parts: e.parts.map((c) => {
      if (c.type !== "reference" || !s.has(b(c)))
        return c;
      const a = b(c), d = i.filter(
        (l) => b(l.part) === a && l.media.usage !== n
      ).map((l) => l.media);
      return r && a === b(r.part) && d.push({ ...r.media, usage: n }), {
        ...c,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: d,
        ref_media_excluded: d.length === 0
      };
    })
  };
}
const Ct = "referencemode", Ft = "references";
function pr({
  node: e,
  content: t,
  items: n,
  connections: r,
  params: i,
  values: o,
  requestedMode: s,
  additionalSources: c = []
}) {
  const a = Ce(
    $e(i, o)
  ), d = e.outputType || e.power?.outputType;
  return Dt({
    targetKind: d && d !== "general" ? void 0 : P(e) || e.power?.kind || e.kind,
    content: t,
    items: n,
    connections: r,
    mediaOptions: a,
    requestedMode: s,
    additionalSources: c
  });
}
function _r(e, t) {
  return e.flatMap(({ edge: n, source: r }) => {
    const i = Ne(t, r), o = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return o <= 0 ? [] : [
      {
        refType: "asset",
        refId: o,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: Ae(r, i),
        usage: String(n.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: n.id,
        contentSelection: i?.contentSelection,
        mediaCount: R(r)
      }
    ];
  });
}
function P(e) {
  if (!e)
    return;
  const t = [e.kind, e.asset?.kind, e.power?.kind], n = [e.asset?.version?.content, e.resultOutput];
  if (be(n)?.frames.some((o) => !!o.image))
    return "image";
  let i = !1;
  for (const o of t) {
    const s = D(o);
    if (s === "file") {
      i = !0;
      continue;
    }
    if (s)
      return s;
  }
  return i && Ut(n) ? "file" : void 0;
}
function Kt(e) {
  return !!P(e);
}
function Ut(e) {
  return e.some(
    (t) => Q(t, /* @__PURE__ */ new Set(), 0)
  );
}
function Q(e, t, n) {
  if (e == null || n > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((i) => Q(i, t, n + 1));
  if (typeof e != "object" || t.has(e))
    return !1;
  t.add(e);
  const r = e;
  return [
    r.file,
    r.files,
    r.file_url,
    r.fileUrl,
    r.url,
    r.src,
    r.download,
    r.download_url,
    r.downloadUrl,
    r.open_url,
    r.path,
    r.output,
    r.result,
    r.data,
    r.content,
    r.body,
    r.value,
    r.json,
    r.media_files,
    r.mediaFiles
  ].some((i) => Q(i, t, n + 1));
}
function gr(e, t, n) {
  return n.some((i) => {
    const o = P(i);
    return o === "video" || o === "audio";
  }) && Et(
    e,
    t,
    Ft
  ) || t;
}
function Oe(e) {
  return V(e.key) === Ct;
}
function Et(e, t, n) {
  const r = e.find(Oe);
  if (!r?.key)
    return t;
  const i = k(
    r.options || [],
    n
  );
  if (!i)
    return;
  const o = k(
    r.options || [],
    t[r.key]
  );
  return M(o) === M(i) ? t : {
    ...t,
    [r.key]: M(i)
  };
}
function Ce(e) {
  const t = e.flatMap((n) => {
    if (n.type !== "file" && n.type !== "files")
      return [];
    const r = String(n.key || "").trim(), i = Pt(n);
    return !r || i.length === 0 ? [] : [
      {
        key: r,
        label: String(n.name || r),
        maxFiles: bt(n),
        acceptedKinds: i
      }
    ];
  });
  return N(
    t.map(
      (n) => x(n) ? { ...n, maxFiles: 1 } : n
    )
  );
}
function yr(e) {
  return e.find((t) => K(t.key))?.key || "firstFrame";
}
function Dt({
  targetKind: e,
  content: t,
  items: n,
  connections: r,
  mediaOptions: i,
  requestedMode: o,
  additionalSources: s = []
}) {
  const c = At(
    t,
    n,
    r,
    s
  ), a = c.reduce(
    (g, Te) => g + Te.amount,
    0
  ), d = c.some((g) => K(g.usage)) && c.some((g) => L(g.usage)), l = D(e) === "video" && i.some((g) => g.acceptedKinds.includes("image")), f = O(
    i,
    "image",
    "per_image"
  ), u = O(
    i,
    "image",
    "shared_reference"
  ), p = f.length > 0, _ = u.some(x), y = (!_ || c.every((g) => g.amount === 1)) && Vt(u, a), S = u.length > 0, m = _ ? u.filter(x) : [], v = [
    {
      value: "per_image",
      label: "每图一条视频",
      enabled: p,
      reason: p ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: _ ? m.some((g) => L(g.key)) ? "首尾帧生成" : "首帧生成" : "多图共同参考",
      enabled: S,
      reason: S ? void 0 : _ ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!l)
    return {
      active: !1,
      imageCount: a,
      structured: c.some((g) => g.structured),
      explicitFramePair: d,
      options: v,
      frameUsages: m,
      error: ""
    };
  const I = c.some((g) => g.structured), h = d && S ? "shared_reference" : I && p ? "per_image" : S && y ? "shared_reference" : "per_image", C = v.find(
    (g) => g.value === o
  ), F = C?.value || h, me = v.some((g) => g.enabled);
  return {
    active: l,
    imageCount: a,
    structured: I,
    explicitFramePair: d,
    mode: me ? F : void 0,
    defaultMode: h,
    options: v,
    frameUsages: m,
    error: me ? C && !C.enabled ? C.reason || "当前能力不支持该生成方式" : F === "shared_reference" && _ && c.some(
      (g) => g.amount > 0 && L(g.usage)
    ) && !c.some(
      (g) => g.amount > 0 && K(g.usage)
    ) ? "选择尾帧时请同时选择首帧" : F === "shared_reference" && _ && a > 2 ? "首帧和尾帧各选择1张图片" : F === "shared_reference" && _ && a === 0 && c.length > 0 ? "请选择首帧图片" : F === "per_image" && a === 0 && c.length > 0 ? "请选择用于生成视频的图片" : "" : "当前能力无法接收这组图片素材"
  };
}
function At(e, t, n, r) {
  const i = new Map(
    n.map(
      (a) => [
        w(
          a.edge.id,
          $(a)
        ),
        a
      ]
    )
  ), o = /* @__PURE__ */ new Set(), s = [];
  for (const a of e?.parts || []) {
    if (a.type !== "reference" || !fe(a.ref_type))
      continue;
    const d = a.ref_type === "asset" && a.ref_origin_id ? i.get(
      w(a.ref_origin_id, a.ref_id)
    ) : void 0, l = d ? Ne(t, d.source) : B(t, a);
    if ((d ? P(d.source) : D(l?.kind)) !== "image")
      continue;
    d && o.add(
      w(
        d.edge.id,
        $(d)
      )
    );
    const u = d ? R(d.source) : G(l, "image", a.ref_media_count);
    s.push(
      ...ee(
        a,
        u,
        d?.edge.mediaUsage
      ).map((p) => ({
        amount: p.amount,
        usage: p.usage,
        structured: j(d?.source, l)
      }))
    );
  }
  for (const a of n) {
    const d = w(
      a.edge.id,
      $(a)
    );
    o.has(d) || P(a.source) !== "image" || s.push({
      amount: R(a.source),
      usage: String(a.edge.mediaUsage || ""),
      structured: j(a.source)
    });
  }
  const c = new Set(
    n.map((a) => a.source.id)
  );
  for (const a of r)
    c.has(a.id) || P(a) !== "image" || s.push({
      amount: R(a),
      usage: "",
      structured: j(a)
    });
  return s;
}
function j(e, t) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || be([
    e?.asset?.version?.content,
    e?.resultOutput,
    t?.output,
    t?.asset
  ]));
}
function Nt(e, t) {
  return e.find((n) => n.key === t);
}
function K(e) {
  const t = V(e);
  return t === "firstframe" || t === "startframe";
}
function L(e) {
  const t = V(e);
  return t === "lastframe" || t === "endframe";
}
function Fe(e) {
  const t = V(e);
  return t === "firstframe" || t === "startframe" || t === "lastframe" || t === "endframe";
}
function Tt(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const t = V(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    t
  );
}
function N(e) {
  return e.map((t, n) => ({ option: t, index: n })).sort(
    (t, n) => ye(t.option) - ye(n.option) || t.index - n.index
  ).map(({ option: t }) => t);
}
function ye(e) {
  return Tt(e) ? 0 : K(e.key) ? 1 : L(e.key) ? 2 : 3;
}
function x(e) {
  return Fe(e.key);
}
function O(e, t, n) {
  const r = e.filter(
    (s) => s.acceptedKinds.includes(t)
  );
  if (t !== "image" || !n)
    return r;
  const i = r.filter((s) => !x(s));
  if (n === "shared_reference")
    return N(i.length > 0 ? i : r);
  const o = r.filter((s) => K(s.key));
  return o.length > 0 ? N(o) : N(i);
}
function vr(e, t) {
  if (!t)
    return e;
  const n = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const i of O(
      e,
      r,
      t
    ))
      n.add(i);
  return e.filter((r) => n.has(r));
}
function Vt(e, t) {
  let n = t;
  for (const r of e) {
    const i = E(r);
    if (i <= 0 || (n -= i, n <= 0))
      return !0;
  }
  return !1;
}
function V(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Sr(e, t, n, r, i = {}, o = !1, s) {
  const c = new Map(
    (t?.parts || []).flatMap(
      (f) => f.type === "reference" && f.ref_type === "asset" && f.ref_origin === "edge" && f.ref_origin_id ? [
        [
          w(f.ref_origin_id, f.ref_id),
          f
        ]
      ] : []
    )
  ), a = e.flatMap(
    (f) => {
      const u = P(f.source);
      if (!u)
        return [];
      const p = R(f.source), _ = c.get(
        w(
          f.edge.id,
          $(f)
        )
      );
      return ee(
        _,
        p,
        Lt(f, i)
      ).map((y, S) => ({
        referenceKey: `${zt(f)}:${S}`,
        label: Gt(f),
        kind: u,
        ...y,
        required: !0
      }));
    }
  );
  for (const [f, u] of (t?.parts || []).entries()) {
    if (u.type !== "reference" || !fe(u.ref_type) || u.ref_origin === "edge")
      continue;
    const p = B(n, u), _ = D(p?.kind);
    _ && a.push(
      ...ee(
        u,
        G(p, _, u.ref_media_count)
      ).map((y, S) => ({
        referenceKey: `${u.ref_type}:${u.ref_id}:${f}:${S}`,
        label: String(u.label || p?.title || "引用素材"),
        kind: _,
        ...y,
        required: o
      }))
    );
  }
  const d = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  for (const f of a) {
    if (f.amount === 0) continue;
    const u = `${f.referenceKey}:${f.usage}`;
    if (l.has(u))
      continue;
    l.add(u);
    const p = O(
      r,
      f.kind,
      s
    );
    if (p.length === 0) {
      if (f.required)
        return `当前能力未配置可接收${De(f.kind)}素材的参数`;
      continue;
    }
    const _ = Nt(p, f.usage);
    if (f.usage && !_)
      return `「${f.label}」的素材用途与当前能力参数不兼容`;
    const y = _ || (p.length === 1 ? p[0] : void 0);
    if (!y)
      return `请为「${f.label}」选择素材用途`;
    const S = f.kind === "image" && s === "per_image", m = S ? 1 : f.amount, v = E(y) > 0 ? Math.max(
      E(y) - (d.get(y.key) || 0),
      0
    ) : 0;
    if (!S && !f.mediaSelected && f.mediaCount > 1 && E(y) > 0 && f.mediaCount > v)
      return `「${f.label}」包含 ${f.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!Z(y, d, m))
      return `${y.label}参数最多接收 ${E(y)} 个素材`;
    S || q(d, y.key, m);
  }
  return "";
}
function hr(e, t, n, r, i = [], o) {
  const s = n.filter(Kt), c = s.flatMap((u) => {
    const p = P(u);
    return p ? [p] : [];
  }), a = N(
    t.filter(
      (u) => c.every(
        (p) => O([u], p, o).includes(
          u
        )
      )
    )
  );
  if (c.length === 0 || a.length === 0) {
    const u = c[0];
    return {
      usage: void 0,
      error: c.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${De(u || "file")}素材的参数`
    };
  }
  if (o === "shared_reference" && c.every((u) => u === "image") && a.some(x))
    return { usage: a[0].key, error: "" };
  const d = Bt(
    e,
    t,
    r,
    i,
    o
  ), l = o === "per_image" && c.every((u) => u === "image") ? 1 : s.reduce(
    (u, p) => u + R(p),
    0
  ), f = Ke(
    a,
    d,
    l
  );
  return f ? {
    usage: f.key,
    error: ""
  } : {
    usage: void 0,
    error: `${a[0].label}参数已达到素材数量上限`
  };
}
function kr(e, t, n, r, i, o) {
  if (!t || r.length === 0)
    return { content: t, assignments: {} };
  if (o === "shared_reference" && O(r, "image", o).some(
    x
  )) {
    const u = T(
      e,
      n,
      i
    ), p = new Set(u.map(b)), _ = new Set(T(t, n, i)), y = new Set(
      xe(u).map((m) => m.media.usage)
    ), S = t.parts.map((m) => {
      if (m.type !== "reference" || !_.has(m) || p.has(b(m)) || m.ref_media_excluded || m.ref_media_items?.length)
        return m;
      const v = m.usage || r.find((h) => K(h.key))?.key, I = G(
        B(n, m),
        "image",
        m.ref_media_count
      );
      return v && !y.has(v) && (m.ref_media_url || m.ref_media_index || I === 1) ? (y.add(v), { ...m, usage: v }) : {
        ...m,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: [],
        ref_media_excluded: !0
      };
    });
    return { content: { ...t, parts: S }, assignments: {} };
  }
  const s = new Map(
    W(
      e,
      n,
      i,
      o
    ).map((u) => [u.key, u])
  ), a = [...W(
    t,
    n,
    i,
    o
  )].sort((u, p) => {
    const _ = ve(
      u,
      s.get(u.key)
    ), y = ve(
      p,
      s.get(p.key)
    );
    return _ - y || u.partIndex - p.partIndex;
  }), d = t.parts.map((u) => ({ ...u })), l = {}, f = /* @__PURE__ */ new Map();
  for (const u of a) {
    if (u.amount === 0) continue;
    const p = s.get(u.key), _ = O(
      r,
      u.kind,
      o
    ), y = u.usage && u.usage !== p?.usage ? u.usage : "", m = Ke(
      _,
      f,
      u.kind === "image" && o === "per_image" ? 1 : u.amount,
      y,
      p?.usage || u.usage
    )?.key || "";
    m && (u.kind === "image" && o === "per_image" || q(f, m, u.amount));
    const v = d[u.partIndex];
    v?.type === "reference" && (v.usage = m || void 0, v.ref_media_items?.length && (v.ref_media_items = v.ref_media_items.map((I) => ({
      ...I,
      usage: _.some((h) => h.key === I.usage) ? I.usage : m || void 0
    })))), u.connection && m !== String(u.connection.edge.mediaUsage || "") && (l[u.connection.edge.id] = m || void 0);
  }
  return { content: { ...t, parts: d }, assignments: l };
}
function Bt(e, t, n, r = [], i) {
  const o = /* @__PURE__ */ new Map(), s = W(
    n,
    r,
    e,
    i
  ), c = /* @__PURE__ */ new Set();
  for (const a of s) {
    const d = t.find((l) => l.key === a.usage);
    d && !(a.kind === "image" && i === "per_image") && q(o, d.key, a.amount), a.connection && c.add(
      w(
        a.connection.edge.id,
        $(a.connection)
      )
    );
  }
  for (const a of e) {
    const d = w(
      a.edge.id,
      $(a)
    );
    if (c.has(d))
      continue;
    const l = String(a.edge.mediaUsage || ""), f = t.find((u) => u.key === l);
    f && !(P(a.source) === "image" && i === "per_image") && q(
      o,
      f.key,
      R(a.source)
    );
  }
  return o;
}
function Lt(e, t) {
  return String(
    Object.prototype.hasOwnProperty.call(t, e.edge.id) ? t[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function W(e, t, n, r) {
  if (!e)
    return [];
  const i = new Map(
    n.map((s) => [
      w(
        s.edge.id,
        $(s)
      ),
      s
    ])
  ), o = /* @__PURE__ */ new Map();
  return e.parts.flatMap((s, c) => {
    if (s.type !== "reference" || !fe(s.ref_type))
      return [];
    const a = s.ref_type === "asset" && s.ref_origin_id ? i.get(
      w(s.ref_origin_id, s.ref_id)
    ) : void 0, d = B(t, s), l = a ? P(a.source) : D(d?.kind);
    if (!l)
      return [];
    const f = a ? `edge:${w(
      a.edge.id,
      $(a)
    )}` : `${s.ref_type}:${s.ref_id}:${s.ref_version_id || 0}`, u = o.get(f) || 0;
    return o.set(f, u + 1), [
      {
        key: a ? f : `${f}:${u}`,
        partIndex: c,
        kind: l,
        amount: s.ref_media_excluded ? 0 : l === "image" && r === "per_image" ? 1 : a ? X(
          s,
          R(a.source)
        ) : X(
          s,
          G(
            d,
            l,
            s.ref_media_count
          )
        ),
        usage: String(s.usage || ""),
        connection: a
      }
    ];
  });
}
function ve(e, t) {
  return e.usage && e.usage !== t?.usage ? 0 : t ? 1 : 2;
}
function Ke(e, t, n, ...r) {
  for (const i of r) {
    const o = e.find((s) => s.key === i);
    if (o && Z(o, t, n))
      return o;
  }
  return e.find(
    (i) => Z(i, t, n)
  );
}
function E(e) {
  return x(e) ? 1 : e.maxFiles;
}
function Z(e, t, n = 1) {
  const r = E(e);
  return r <= 0 || (t.get(e.key) || 0) + n <= r;
}
function q(e, t, n = 1) {
  e.set(t, (e.get(t) || 0) + n);
}
function Ue(e, t) {
  return qt(e, t).map((n) => n.url);
}
function qt(e, t) {
  if (t === "image") {
    const n = He(e);
    if (n.length > 0)
      return n.map((r) => ({ url: r, thumbnail: r }));
  }
  return Je(e, t);
}
function R(e) {
  const t = P(e);
  return !e || !t || t === "file" ? 1 : Math.max(
    1,
    Ue(
      [e.asset?.version?.content, e.resultOutput],
      t
    ).length
  );
}
function G(e, t, n = 0) {
  return !e || t === "file" ? Math.max(1, n) : Math.max(
    1,
    n,
    Ue(e.output, t).length
  );
}
function Ee(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function X(e, t) {
  return e?.ref_media_excluded ? 0 : (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : Ee(e) ? 1 : Math.max(1, t);
}
function ee(e, t, n = "") {
  const r = String(e?.usage || n || "");
  return e?.ref_media_excluded ? [{ amount: 0, mediaCount: t, mediaSelected: !0, usage: r }] : e?.ref_media_items?.length ? e.ref_media_items.map((i) => ({
    amount: 1,
    mediaCount: t,
    mediaSelected: !0,
    usage: i.usage || r
  })) : [
    {
      amount: X(e, t),
      mediaCount: t,
      mediaSelected: Ee(e),
      usage: r
    }
  ];
}
function w(e, t) {
  return `${String(e || "")}:${Number(t || 0)}`;
}
function fe(e) {
  return e === "asset" || e === "material";
}
function B(e, t) {
  return e.find(
    (n) => (n.refType || "asset") === t.ref_type && Number(n.refId || 0) === Number(t.ref_id || 0) && (!t.ref_version_id || Number(n.versionID || 0) === Number(t.ref_version_id))
  );
}
function $(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function De(e) {
  switch (e) {
    case "image":
      return "图片";
    case "video":
      return "视频";
    case "audio":
      return "音频";
    default:
      return "文件";
  }
}
function Gt(e) {
  return Ae(e.source);
}
function Ae(e, t) {
  for (const n of [e.asset?.name, t?.title, e.title]) {
    const r = String(n || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function zt(e) {
  const t = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return t > 0 ? `asset:${t}` : `node:${e.source.id}`;
}
function Ne(e, t) {
  const n = Number(t.asset?.id || t.resultRef?.asset_id || 0), r = Number(
    t.asset?.version?.id || t.asset?.version_id || t.resultRef?.version_id || 0
  );
  return e.find(
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === n && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === t.id);
}
export {
  pr as A,
  $e as B,
  Ce as C,
  vr as D,
  cr as E,
  Sr as F,
  Ot as G,
  ge as H,
  yr as I,
  mr as J,
  Rt as K,
  or as L,
  Zt as M,
  Qt as N,
  we as O,
  dr as P,
  Re as Q,
  Xt as R,
  ur as S,
  Kt as T,
  Mt as U,
  hr as V,
  ae as W,
  P as a,
  Ne as b,
  Ue as c,
  qt as d,
  rr as e,
  tr as f,
  ar as g,
  ir as h,
  er as i,
  Oe as j,
  _r as k,
  T as l,
  lr as m,
  X as n,
  fr as o,
  ue as p,
  xt as q,
  kr as r,
  Wt as s,
  k as t,
  M as u,
  sr as v,
  kt as w,
  nr as x,
  wt as y,
  gr as z
};
