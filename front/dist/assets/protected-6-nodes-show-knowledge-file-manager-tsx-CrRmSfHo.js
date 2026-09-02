import { j as r, a, F as vt } from "./runtime-entry-9YhLBCWA.js";
import { u as Q, d as ie, a as h, e as I, b as H, g as Nn } from "./_commonjsHelpers-C76sftkf.js";
import { l as _t, a as yt, b as cn, c as bt, r as un, d as xt, s as kt, i as Nt, e as Te, f as In, g as It, m as Ct, h as Dt, p as St, j as Ft, C as zt, T as Mt, K as Et, k as Rt, u as Tt, n as Lt, o as Ot } from "./styles-NbvI41Bw.js";
import { A as $t, N as Le, S as Be, C as ke, F as Cn, P as Dn, U as Sn, R as re, a as Pt, b as Ke, c as At, d as Ut, D as Bt, e as Kt, E as qt, f as jt, g as ye, T as Fn, h as Vt } from "./vendor-icons-DgDZMD4Q.js";
import { t as C } from "./index-GiccNT9P.js";
import { b as fn, u as Wt } from "./preloadable-BSZIYdQl.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/confirm-dialog", "@/components/ui/input"]);
const qe = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!qe || Object.keys(qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const S = qe.Button, je = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!je || Object.keys(je).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const Qt = je.ConfirmDialog, Ve = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!Ve || Object.keys(Ve).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const zn = Ve.Input, u = "/", mn = "knowledge-files", Ht = "未命名文档.md", Jt = "新建文件夹", Xt = "dever:bot:knowledge-file-manager:expanded:", Gt = "dever:bot:knowledge-file-manager:last-opened:", te = 8, pn = 168, hn = 184, Yt = 6 * 1024 * 1024, Zt = 2048 * 1024 * 1024, ei = 2400;
function $i({ item: e }) {
  const i = e.meta ?? {}, n = Q(() => Ii(i), [i]), o = ie(null), d = ie(u), v = ie(0), _ = ie(0), [g, f] = h({}), [D, N] = h(
    () => yn(n)
  ), [w, m] = h(""), [O, L] = h(""), [c, z] = h(null), [$, x] = h(null), [p, M] = h(null), [K, q] = h(null), [j, An] = h(""), [Un, Qe] = h(!1), [He, Je] = h(!1), [Bn, Xe] = h(!1), [J, B] = h(null), [Kn, X] = h(!1), [qn, Ge] = h(!1), [Ne, Ye] = h(!1), [Ie, Ze] = h(!1), [jn, Ce] = h(!1), [Vn, ae] = h(!1), [Wn, De] = h(!1), [Qn, Se] = h(!1), [V, ue] = h(null), [fe, Fe] = h(!1), [Hn, Z] = h(null), [en, W] = h(null), le = g.base?.name || "知识库", Jn = _e(g.base?.index_status), me = kn(
    g.drive?.upload_chunk_bytes,
    Yt
  ), pe = kn(
    g.drive?.max_upload_bytes,
    Zt
  ), F = Q(() => Pe(g.files || []), [g.files]), oe = Q(() => $n(F, j), [j, F]), nn = Q(() => bi(F), [F]), G = Q(
    () => gi(oe, le),
    [le, oe]
  ), he = Q(
    () => w ? A(F, w) : null,
    [w, F]
  ), ze = Q(
    () => O ? A(F, O) : null,
    [O, F]
  ), Me = Jn === "running", ee = Bn || Me, ge = Number(g.base?.concept_graph_enabled) === 1, tn = ge ? "更新增强索引" : "更新搜索索引", Xn = _e(c?.index_status), Gn = ee ? "索引中" : tn, P = I(async () => {
    if (n) {
      Qe(!0);
      try {
        f(await _t({ knowledgeBaseID: n }));
      } catch (t) {
        C.error(T(t, "加载知识库失败"));
      } finally {
        Qe(!1);
      }
    }
  }, [n]), rn = I(async () => {
    if (n)
      try {
        const t = await yt({ knowledgeBaseID: n });
        if (_e(t.index_status) !== "running") {
          await P();
          return;
        }
        f(
          (l) => l.base ? {
            ...l,
            base: { ...l.base, index_status: t.index_status }
          } : l
        );
      } catch {
      }
  }, [n, P]);
  H(() => {
    P();
  }, [P]), H(() => {
    if (!n || !Me)
      return;
    const t = window.setInterval(() => {
      rn();
    }, ei);
    return () => window.clearInterval(t);
  }, [Me, n, rn]), H(() => {
    if (!c)
      return;
    const t = A(F, c.id);
    !t || t.type !== "file" || t.index_status === c.index_status || z({ ...c, index_status: t.index_status });
  }, [c, F]), H(() => {
    N(yn(n)), m(""), L(""), z(null), x(null), M(null), q(null), B(null), X(!1), Ce(!1), ae(!1), De(!1), Se(!1), ue(null), Fe(!1), _.current += 1, v.current = 0;
  }, [n]), H(() => {
    const t = () => W(null);
    return window.addEventListener("click", t), window.addEventListener("resize", t), window.addEventListener("scroll", t, !0), () => {
      window.removeEventListener("click", t), window.removeEventListener("resize", t), window.removeEventListener("scroll", t, !0);
    };
  }, []);
  const Yn = I(() => {
    if (!(p?.dirty && !window.confirm("当前文件尚未保存，确定返回上一页吗？"))) {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = "/bot/agent/knowledge_base/list";
    }
  }, [p?.dirty]), E = I(
    (t) => {
      N((l) => {
        const s = t(l);
        return _i(n, s), s;
      });
    },
    [n]
  ), ne = I(
    async (t) => {
      if (!n || t.type !== "file")
        return;
      const l = w, s = O, b = c, y = p, k = _.current + 1;
      _.current = k, m(t.id), L(t.id), q(null), B(null), X(!1), x({ name: t.name || Pn(t.id) }), E((R) => bn(R, t.id));
      try {
        const R = await cn({ knowledgeBaseID: n, id: t.id });
        if (_.current !== k)
          return;
        m(t.id), L(t.id), $e(n, t.id), z(R), x(null), M({
          id: R.id,
          name: R.name,
          content: R.content || "",
          dirty: !1
        });
      } catch (R) {
        _.current === k && (m(l), L(s), z(b), M(y), x(null), C.error(T(R, "打开文件失败")));
      }
    },
    [c, p, O, n, w, E]
  ), we = I(
    (t, l) => {
      n && ue({ type: t, parent: l || u });
    },
    [n]
  ), an = I(
    async (t, l, s) => {
      const b = s.trim();
      if (!n || !b)
        return !1;
      try {
        const y = await bt({
          knowledgeBaseID: n,
          parent: l,
          name: b,
          type: t
        });
        if (f(y), E((k) => new Set(k).add(l)), t === "file" && y.new_id) {
          const k = A(Pe(y.files || []), y.new_id);
          k && await ne(k);
        }
        return C.success(t === "folder" ? "文件夹已创建" : "文件已创建"), !0;
      } catch (y) {
        return C.error(T(y, "创建失败")), !1;
      }
    },
    [n, ne, E]
  ), Zn = I(
    async (t) => {
      if (!(!V || fe)) {
        Fe(!0);
        try {
          await an(V.type, V.parent, t) && ue(null);
        } finally {
          Fe(!1);
        }
      }
    },
    [V, an, fe]
  ), et = I(
    async (t) => {
      if (!n)
        return;
      const l = window.prompt("新名称", t.name);
      if (!(!l?.trim() || l.trim() === t.name))
        try {
          const s = await un({ knowledgeBaseID: n, id: t.id, name: l.trim() });
          f(s);
          const b = s.new_id || t.id;
          if (w === t.id && (m(U(b)), $e(n, b), t.type === "file" && c)) {
            const y = A(Pe(s.files || []), b);
            z({
              ...c,
              id: b,
              name: l.trim(),
              index_status: y?.index_status || c.index_status
            }), M(
              (k) => k && { ...k, id: b, name: l.trim(), dirty: k.dirty }
            );
          }
          C.success("已重命名");
        } catch (s) {
          C.error(T(s, "重命名失败"));
        }
    },
    [c, n, w]
  ), nt = I(
    async (t) => {
      if (!(!n || !window.confirm(`确定删除「${t.name}」吗？`)))
        try {
          f(await xt({ knowledgeBaseID: n, ids: [t.id] })), (w === t.id || Ae(t, w)) && (m(""), z(null), x(null), M(null), q(null), B(null), X(!1));
          const l = Oe(n);
          l && (l === t.id || Ae(t, l)) && se(n), C.success("已删除");
        } catch (l) {
          C.error(T(l, "删除失败"));
        }
    },
    [n, w]
  ), tt = I(async () => {
    if (!(!n || !p || !c)) {
      Je(!0);
      try {
        let t = p.id;
        const l = p.name.trim();
        if (l && l !== c.name) {
          const b = await un({
            knowledgeBaseID: n,
            id: c.id,
            name: l
          });
          f(b), t = b.new_id || c.id;
        }
        const s = c.editable ? await kt({
          knowledgeBaseID: n,
          id: t,
          content: p.content
        }) : await cn({ knowledgeBaseID: n, id: t });
        m(U(s.id)), $e(n, s.id), z(s), B(null), X(!1), M({
          id: s.id,
          name: s.name,
          content: s.content || "",
          dirty: !1
        }), await P(), C.success("已保存");
      } catch (t) {
        C.error(T(t, "保存失败"));
      } finally {
        Je(!1);
      }
    }
  }, [c, p, n, P]), it = I(
    async () => {
      if (!(!n || ee)) {
        ae(!1), Xe(!0);
        try {
          await Nt({ knowledgeBaseID: n }), f(Ni), C.success(ge ? "已开始更新增强索引" : "已开始更新搜索索引"), await P();
        } catch (t) {
          C.error(T(t, "索引启动失败"));
        } finally {
          Xe(!1);
        }
      }
    },
    [ge, ee, n, P]
  ), rt = I(async () => {
    if (!(!n || !c)) {
      X(!0), Ge(!0), B(null);
      try {
        B(await Te({ knowledgeBaseID: n, id: c.id }));
      } catch (t) {
        C.error(T(t, "加载索引详情失败"));
      } finally {
        Ge(!1);
      }
    }
  }, [c, n]), at = I(async (t) => {
    if (!(!c || !J?.doc_id || Ne)) {
      Ye(!0);
      try {
        await In({ docID: J.doc_id, status: t }), B(await Te({ knowledgeBaseID: n, id: c.id })), C.success(En(t));
      } catch (l) {
        C.error(T(l, "更新审核状态失败"));
      } finally {
        Ye(!1);
      }
    }
  }, [c, J?.doc_id, n, Ne]), lt = I(async (t) => {
    if (!(!c || !J?.doc_id || Ie)) {
      Ze(!0);
      try {
        await It({ docID: J.doc_id, expiresAt: t }), B(await Te({ knowledgeBaseID: n, id: c.id })), C.success(t ? "文档过期时间已更新" : "文档过期时间已清除");
      } catch (l) {
        C.error(T(l, "更新过期时间失败"));
      } finally {
        Ze(!1);
      }
    }
  }, [c, J?.doc_id, n, Ie]), ot = I(
    async (t, l) => {
      if (!n)
        return;
      const s = A(F, t), b = l === u ? null : A(F, l);
      if (!s || s.id === u || b && b.type !== "folder")
        return;
      const y = b?.id || u;
      if (s.id === y || y.startsWith(`${s.id}/`)) {
        C.error("不能移动到自身或子目录下");
        return;
      }
      try {
        f(await Ct({ knowledgeBaseID: n, ids: [s.id], target: y })), E((R) => new Set(R).add(y));
        const k = Oe(n);
        k && (k === s.id || Ae(s, k)) && se(n), (w === s.id || w.startsWith(`${s.id}/`)) && (m(""), z(null), x(null), M(null), q(null), B(null), X(!1), se(n)), C.success("已移动");
      } catch (k) {
        C.error(T(k, "移动失败"));
      }
    },
    [n, w, F, E]
  ), ln = I(
    (t) => {
      const l = ze?.type === "folder" ? ze.id : he?.type === "folder" ? he.id : Y(w);
      d.current = t || l || u, o.current?.click();
    },
    [ze, w, he]
  ), st = I(
    async (t) => {
      if (!n || !t?.length)
        return;
      const l = d.current || u, s = Array.from(t);
      try {
        let b = null;
        for (let y = 0; y < s.length; y += 1) {
          const k = s[y];
          k && (Z({
            active: !0,
            currentFile: k.name,
            currentIndex: y + 1,
            total: s.length,
            percent: Ue(y, s.length, 0),
            status: "uploading"
          }), b = await xn({
            knowledgeBaseID: n,
            parent: l,
            file: k,
            name: k.name,
            chunkBytes: me,
            maxBytes: pe,
            onProgress: (R) => {
              Z({
                active: !0,
                currentFile: k.name,
                currentIndex: y + 1,
                total: s.length,
                percent: Ue(y, s.length, R),
                status: "uploading"
              });
            }
          }), Z({
            active: !0,
            currentFile: k.name,
            currentIndex: y + 1,
            total: s.length,
            percent: Ue(y, s.length, 1),
            status: "uploading"
          }));
        }
        b && f(b), E((y) => new Set(y).add(l)), Z({
          active: !1,
          currentFile: s[s.length - 1]?.name || "",
          currentIndex: s.length,
          total: s.length,
          percent: 100,
          status: "done"
        }), C.success("上传完成");
      } catch (b) {
        Z(
          (y) => y ? {
            ...y,
            active: !1,
            status: "error"
          } : null
        ), C.error(T(b, "上传失败"));
      } finally {
        o.current && (o.current.value = ""), window.setTimeout(() => {
          Z(
            (b) => b && !b.active ? null : b
          );
        }, 1800);
      }
    },
    [n, pe, E, me]
  ), on = I((t) => {
    E((l) => {
      const s = new Set(l);
      return s.has(t) ? s.delete(t) : s.add(t), s;
    });
  }, [E]), dt = I(
    (t) => {
      if (L(t.id), t.type === "folder") {
        on(t.id);
        return;
      }
      m(t.id), ne(t);
    },
    [ne, on]
  ), ct = I((t) => {
    m(t.id), L(t.id);
  }, []);
  H(() => {
    if (!n || w || v.current === n || !g.files || g.base?.id !== n)
      return;
    const t = Oe(n);
    if (!t) {
      v.current = n;
      return;
    }
    const l = A(F, t);
    if (v.current = n, !l || l.type !== "file") {
      se(n);
      return;
    }
    E((s) => bn(s, l.id)), ne(l);
  }, [g.files, n, ne, w, F, E]);
  const ut = Q(() => j.trim() ? Array.from(wi(oe)) : vi(D, G), [D, j, G, oe]), ft = w && he?.type === "file" && G[w] ? [w] : [], Ee = O || w, mt = Ee && G[Ee] ? Ee : u, sn = c ? Dt(n, c.id) : "", pt = c ? St(n, c.id) : "", ht = c ? Ft(n, fn(c.id)) : "", dn = !!(p && c), gt = dn && !$, wt = I(
    async (t) => {
      if (!n || !c)
        throw new Error("请先打开一个文档");
      const l = fn(c.id), s = /* @__PURE__ */ new Set(), b = [];
      let y = null;
      for (const k of t) {
        const R = Wt(nn, l, k.name, s);
        s.add(R), y = await xn({
          knowledgeBaseID: n,
          parent: l,
          file: k,
          name: R,
          chunkBytes: me,
          maxBytes: pe
        }), b.push({ name: R });
      }
      return y && f(y), E((k) => new Set(k).add(l)), b;
    },
    [
      c,
      nn,
      n,
      pe,
      E,
      me
    ]
  ), Re = I((t, l) => {
    t.preventDefault(), t.stopPropagation(), ae(!1), W({ x: t.clientX, y: t.clientY, node: l });
  }, []);
  return n ? /* @__PURE__ */ a("div", { className: "knowledge-shell", onContextMenu: (t) => t.preventDefault(), children: [
    /* @__PURE__ */ a("header", { className: "knowledge-toolbar", children: [
      /* @__PURE__ */ a("div", { className: "knowledge-toolbar__title", children: [
        /* @__PURE__ */ r("span", { children: le }),
        /* @__PURE__ */ a("small", { children: [
          g.files?.length || 0,
          " 个节点"
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "knowledge-toolbar__actions", children: [
        /* @__PURE__ */ a(
          S,
          {
            variant: "ghost",
            size: "sm",
            className: "knowledge-toolbar__back",
            onClick: Yn,
            children: [
              /* @__PURE__ */ r($t, { size: 16 }),
              "返回上一页"
            ]
          }
        ),
        /* @__PURE__ */ a(
          S,
          {
            variant: "outline",
            size: "sm",
            onClick: () => Ce(!0),
            children: [
              /* @__PURE__ */ r(Le, { size: 16 }),
              "知识地图"
            ]
          }
        ),
        /* @__PURE__ */ a(
          S,
          {
            variant: "outline",
            size: "sm",
            onClick: () => De(!0),
            children: [
              /* @__PURE__ */ r(Be, { size: 16 }),
              "测试检索"
            ]
          }
        ),
        /* @__PURE__ */ a(
          S,
          {
            variant: "outline",
            size: "sm",
            onClick: () => Se(!0),
            children: [
              /* @__PURE__ */ r(ke, { size: 16 }),
              "待审核"
            ]
          }
        ),
        /* @__PURE__ */ a(
          S,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              W(null), ae(!0);
            },
            disabled: ee,
            children: [
              /* @__PURE__ */ r(Le, { size: 16 }),
              Gn
            ]
          }
        ),
        /* @__PURE__ */ a(S, { variant: "outline", size: "sm", onClick: () => we("folder"), children: [
          /* @__PURE__ */ r(Cn, { size: 16 }),
          "文件夹"
        ] }),
        /* @__PURE__ */ a(S, { variant: "outline", size: "sm", onClick: () => we("file"), children: [
          /* @__PURE__ */ r(Dn, { size: 16 }),
          "文件"
        ] }),
        /* @__PURE__ */ a(S, { variant: "outline", size: "sm", onClick: () => ln(), children: [
          /* @__PURE__ */ r(Sn, { size: 16 }),
          "上传"
        ] }),
        /* @__PURE__ */ r(S, { variant: "outline", size: "sm", onClick: () => {
          P();
        }, children: /* @__PURE__ */ r(re, { size: 16 }) })
      ] }),
      /* @__PURE__ */ r(
        "input",
        {
          ref: o,
          type: "file",
          multiple: !0,
          hidden: !0,
          onChange: (t) => {
            st(t.target.files);
          }
        }
      )
    ] }),
    /* @__PURE__ */ a("main", { className: "knowledge-workspace", children: [
      /* @__PURE__ */ a(
        "aside",
        {
          className: "knowledge-sidebar",
          onContextMenu: (t) => Re(t, null),
          children: [
            /* @__PURE__ */ a(
              "div",
              {
                className: "knowledge-sidebar__search",
                onContextMenu: (t) => t.stopPropagation(),
                children: [
                  /* @__PURE__ */ a("div", { className: "knowledge-toolbar__search", children: [
                    /* @__PURE__ */ r(Be, { size: 16 }),
                    /* @__PURE__ */ r(
                      "input",
                      {
                        value: j,
                        onChange: (t) => An(t.target.value),
                        placeholder: "搜索文件"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r(ui, { progress: Hn })
                ]
              }
            ),
            Un && !g.files?.length ? /* @__PURE__ */ r("div", { className: "knowledge-sidebar__state", children: "加载中..." }) : null,
            oe.length ? /* @__PURE__ */ r(
              "div",
              {
                className: "knowledge-tree",
                onContextMenu: (t) => Re(t, null),
                children: /* @__PURE__ */ r(
                  zt,
                  {
                    items: G,
                    getItemTitle: (t) => t.data.name || "",
                    viewState: {
                      [mn]: {
                        expandedItems: ut,
                        selectedItems: ft,
                        focusedItem: mt
                      }
                    },
                    canDragAndDrop: !0,
                    canDropOnFolder: !0,
                    canReorderItems: !1,
                    canSearch: !1,
                    canDrag: (t) => t.length === 1 && t.every((l) => l.index !== u),
                    canDropAt: (t, l) => yi(t, l, G),
                    onExpandItem: (t) => {
                      t.index !== u && E(
                        (l) => new Set(l).add(String(t.index))
                      );
                    },
                    onCollapseItem: (t) => {
                      t.index !== u && E((l) => {
                        const s = new Set(l);
                        return s.delete(String(t.index)), s;
                      });
                    },
                    onSelectItems: (t) => {
                      const l = String(t[0] || "");
                      if (!l || l === u)
                        return;
                      const s = A(F, l);
                      s?.type === "file" && ct(s);
                    },
                    onFocusItem: (t) => {
                      const l = String(t.index);
                      l && l !== u && L(l);
                    },
                    onPrimaryAction: (t) => {
                      const l = A(F, String(t.index));
                      l && dt(l);
                    },
                    onDrop: (t, l) => {
                      const s = Tn(l, G), [b] = t;
                      !s || !b || ot(String(b.index), s);
                    },
                    renderItemArrow: ({ item: t, context: l }) => /* @__PURE__ */ r(
                      "span",
                      {
                        ...l.arrowProps,
                        className: `knowledge-tree-row__arrow${t.isFolder ? "" : " is-empty"}`,
                        children: t.isFolder ? l.isExpanded ? /* @__PURE__ */ r(At, { size: 17 }) : /* @__PURE__ */ r(Ut, { size: 17 }) : null
                      }
                    ),
                    renderItemTitle: ({ title: t, item: l }) => /* @__PURE__ */ a("span", { className: "knowledge-tree-row__label", children: [
                      l.data.type === "folder" ? /* @__PURE__ */ r(Pt, { size: 16 }) : /* @__PURE__ */ r(Ke, { size: 16 }),
                      /* @__PURE__ */ r("span", { className: "knowledge-tree-row__name", children: t }),
                      l.data.type === "file" ? /* @__PURE__ */ a("span", { className: "knowledge-tree-row__badges", children: [
                        /* @__PURE__ */ r(xe, { sourceType: l.data.source_type }),
                        /* @__PURE__ */ r(be, { status: l.data.index_status, compact: !0 })
                      ] }) : null
                    ] }),
                    renderItem: ({ item: t, depth: l, children: s, title: b, arrow: y, context: k }) => /* @__PURE__ */ r(
                      fi,
                      {
                        item: t,
                        depth: l,
                        title: b,
                        arrow: y,
                        context: k,
                        onContextMenu: Re,
                        children: s
                      }
                    ),
                    children: /* @__PURE__ */ r(Mt, { treeId: mn, rootItem: u, treeLabel: le })
                  }
                )
              }
            ) : /* @__PURE__ */ r("div", { className: "knowledge-sidebar__state", children: j.trim() ? "没有匹配文件" : "右键新建文件夹或文件" })
          ]
        }
      ),
      /* @__PURE__ */ a("section", { className: "knowledge-editor", children: [
        $ ? /* @__PURE__ */ r(ai, { fileName: $.name }) : p && c ? /* @__PURE__ */ a("div", { className: "knowledge-editor__header", children: [
          /* @__PURE__ */ a("div", { className: "knowledge-editor__title", children: [
            /* @__PURE__ */ r(
              zn,
              {
                value: p.name,
                title: p.name,
                onChange: (t) => M(
                  (l) => l && { ...l, name: t.target.value, dirty: !0 }
                )
              }
            ),
            /* @__PURE__ */ r(xe, { sourceType: c?.source_type }),
            /* @__PURE__ */ r(be, { status: Xn })
          ] }),
          /* @__PURE__ */ a("div", { className: "knowledge-editor__actions", children: [
            /* @__PURE__ */ r(Mn, { status: K }),
            /* @__PURE__ */ a(
              S,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  rt();
                },
                children: [
                  /* @__PURE__ */ r(Le, { size: 16 }),
                  "索引详情"
                ]
              }
            ),
            /* @__PURE__ */ a(
              S,
              {
                variant: "outline",
                size: "sm",
                onClick: () => Fi(sn),
                children: [
                  /* @__PURE__ */ r(Bt, { size: 16 }),
                  "下载"
                ]
              }
            ),
            /* @__PURE__ */ a(
              S,
              {
                size: "sm",
                disabled: He || !p.dirty,
                onClick: () => {
                  tt();
                },
                children: [
                  /* @__PURE__ */ r(Kt, { size: 16 }),
                  He ? "保存中" : "保存"
                ]
              }
            )
          ] })
        ] }) : null,
        /* @__PURE__ */ a("div", { className: "knowledge-editor__body", "aria-busy": $ ? !0 : void 0, children: [
          /* @__PURE__ */ r(
            Et,
            {
              active: gt,
              file: c,
              content: p?.content || "",
              downloadURL: sn,
              previewURL: pt,
              linkBaseURL: ht,
              onUploadAttachments: wt,
              onAttachmentError: (t) => C.error(T(t, "附件上传失败")),
              onStatusChange: q,
              onChange: (t) => M((l) => l && { ...l, content: t, dirty: !0 })
            }
          ),
          !$ && !dn ? /* @__PURE__ */ a("div", { className: "knowledge-editor__placeholder", children: [
            /* @__PURE__ */ r(Ke, { size: 42 }),
            /* @__PURE__ */ r("strong", { children: "选择左侧文件查看或编辑" }),
            /* @__PURE__ */ r("span", { children: "右键目录可以新建文件夹、文件或上传资料。" })
          ] }) : null
        ] })
      ] })
    ] }),
    en ? /* @__PURE__ */ r(
      mi,
      {
        state: en,
        onCreateFolder: (t) => {
          W(null), we(
            "folder",
            t?.type === "folder" ? t.id : Y(t?.id || "")
          );
        },
        onCreateFile: (t) => {
          W(null), we(
            "file",
            t?.type === "folder" ? t.id : Y(t?.id || "")
          );
        },
        onUpload: (t) => {
          W(null), ln(
            t?.type === "folder" ? t.id : Y(t?.id || "")
          );
        },
        onRename: (t) => {
          W(null), t && et(t);
        },
        onDelete: (t) => {
          W(null), t && nt(t);
        }
      }
    ) : null,
    Kn ? /* @__PURE__ */ r(
      pi,
      {
        detail: J,
        expirationUpdating: Ie,
        loading: qn,
        reviewing: Ne,
        fileName: c?.name || "",
        onReview: at,
        onExpiration: lt,
        onClose: () => X(!1)
      }
    ) : null,
    /* @__PURE__ */ r(
      Rt,
      {
        knowledgeBaseID: n,
        mode: g.base?.concept_graph_enabled,
        open: jn,
        onClose: () => Ce(!1),
        onRefreshFiles: () => {
          P();
        }
      }
    ),
    Wn ? /* @__PURE__ */ r(
      oi,
      {
        knowledgeBaseID: n,
        baseName: le,
        mode: g.base?.concept_graph_enabled,
        onClose: () => De(!1)
      }
    ) : null,
    Qn ? /* @__PURE__ */ r(
      ni,
      {
        knowledgeBaseID: n,
        onClose: () => Se(!1),
        onUpdated: () => {
          P();
        }
      }
    ) : null,
    V ? /* @__PURE__ */ r(
      ri,
      {
        state: V,
        loading: fe,
        onClose: () => {
          fe || ue(null);
        },
        onSubmit: (t) => {
          Zn(t);
        }
      },
      `${V.type}:${V.parent}`
    ) : null,
    /* @__PURE__ */ r(
      Qt,
      {
        open: Vn,
        onOpenChange: ae,
        title: tn,
        desc: ge ? "将重新解析文档并生成搜索索引，同时更新图谱、向量等增强数据。索引过程中不能重复触发。" : "将重新解析文档并生成本地搜索索引。原文读取不依赖索引，索引过程中不能重复触发。",
        confirmText: "开始更新",
        disabled: ee,
        isLoading: ee,
        handleConfirm: () => {
          it();
        }
      }
    )
  ] }) : /* @__PURE__ */ r("div", { className: "knowledge-shell__empty", children: "未找到知识库ID" });
}
function ni({
  knowledgeBaseID: e,
  onClose: i,
  onUpdated: n
}) {
  const [d, v] = h([]), [_, g] = h(0), [f, D] = h(!0), [N, w] = h(!1), [m, O] = h(1), [L, c] = h(0), z = I(async (p, M) => {
    M ? w(!0) : D(!0);
    try {
      const K = await Ot({
        knowledgeBaseID: e,
        page: p,
        pageSize: 50
      }), q = K.list || [];
      v((j) => M ? ti(j, q) : q), g(K.total || 0), O(p);
    } catch (K) {
      C.error(T(K, "加载待审核文档失败"));
    } finally {
      M ? w(!1) : D(!1);
    }
  }, [e]), $ = I(async () => {
    await z(1, !1);
  }, [z]);
  H(() => {
    $();
  }, [$]);
  const x = I(async (p, M) => {
    c(p);
    try {
      await In({ docID: p, status: M }), C.success(En(M)), await $(), n();
    } catch (K) {
      C.error(T(K, "更新审核状态失败"));
    } finally {
      c(0);
    }
  }, [n, $]);
  return /* @__PURE__ */ r(
    "div",
    {
      className: "knowledge-index-detail knowledge-review-queue",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "待审核文档",
      onClick: i,
      children: /* @__PURE__ */ a("div", { className: "knowledge-index-detail__panel", onClick: (p) => p.stopPropagation(), children: [
        /* @__PURE__ */ a("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ r("strong", { children: "待审核文档" }),
            /* @__PURE__ */ a("span", { children: [
              _,
              " 条待处理内容"
            ] })
          ] }),
          /* @__PURE__ */ r("button", { type: "button", onClick: i, "aria-label": "关闭", children: "×" })
        ] }),
        /* @__PURE__ */ a("div", { className: "knowledge-review-queue__body", children: [
          f ? /* @__PURE__ */ r("div", { className: "knowledge-sidebar__state", children: "加载中..." }) : null,
          !f && d.length === 0 ? /* @__PURE__ */ r("div", { className: "knowledge-sidebar__state", children: "暂无待审核内容" }) : null,
          d.map((p) => /* @__PURE__ */ a("article", { className: "knowledge-review-queue__row", children: [
            /* @__PURE__ */ a("div", { className: "knowledge-review-queue__content", children: [
              /* @__PURE__ */ a("div", { className: "knowledge-review-queue__title", children: [
                /* @__PURE__ */ r("strong", { children: p.title || `文档 ${p.id}` }),
                /* @__PURE__ */ r(xe, { sourceType: p.source_type })
              ] }),
              /* @__PURE__ */ r("p", { children: ii(p) })
            ] }),
            /* @__PURE__ */ a("div", { className: "knowledge-review-queue__actions", children: [
              /* @__PURE__ */ r(
                S,
                {
                  variant: "outline",
                  size: "icon",
                  title: "审核通过",
                  "aria-label": "审核通过",
                  disabled: L > 0,
                  onClick: () => {
                    x(p.id, "approved");
                  },
                  children: /* @__PURE__ */ r(ke, { size: 16 })
                }
              ),
              /* @__PURE__ */ r(
                S,
                {
                  variant: "outline",
                  size: "icon",
                  title: "驳回",
                  "aria-label": "驳回",
                  disabled: L > 0,
                  onClick: () => {
                    x(p.id, "rejected");
                  },
                  children: /* @__PURE__ */ r(ye, { size: 16 })
                }
              )
            ] })
          ] }, p.id)),
          _ > d.length ? /* @__PURE__ */ r("div", { className: "knowledge-review-queue__limit", children: /* @__PURE__ */ r(
            S,
            {
              type: "button",
              variant: "outline",
              disabled: N || L > 0,
              onClick: () => {
                z(m + 1, !0);
              },
              children: N ? "加载中..." : `加载更多 (${d.length}/${_})`
            }
          ) }) : null
        ] })
      ] })
    }
  );
}
function ti(e, i) {
  const n = new Map(e.map((o) => [o.id, o]));
  return i.forEach((o) => n.set(o.id, o)), Array.from(n.values());
}
function ii(e) {
  const i = (e.summary || e.content || "暂无摘要").trim();
  return i.length > 240 ? `${i.slice(0, 240)}...` : i;
}
function ri({
  state: e,
  loading: i,
  onClose: n,
  onSubmit: o
}) {
  const d = ie(null), v = e.type === "folder" ? Jt : Ht, [_, g] = h(v);
  return Nn(() => {
    const f = d.current;
    f && (f.focus(), f.setSelectionRange(0, li(v, e.type)));
  }, [v, e.type]), /* @__PURE__ */ r(
    "div",
    {
      className: "knowledge-index-detail knowledge-name-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e.type === "folder" ? "新建文件夹" : "新建文件",
      onClick: i ? void 0 : n,
      children: /* @__PURE__ */ a(
        "form",
        {
          className: "knowledge-index-detail__panel knowledge-name-dialog__panel",
          onClick: (f) => f.stopPropagation(),
          onSubmit: (f) => {
            f.preventDefault();
            const D = _.trim();
            D && o(D);
          },
          children: [
            /* @__PURE__ */ a("div", { className: "knowledge-index-detail__header", children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ r("strong", { children: e.type === "folder" ? "新建文件夹" : "新建文件" }),
                /* @__PURE__ */ r("span", { children: e.type === "folder" ? "输入文件夹名称" : "输入文件名称" })
              ] }),
              /* @__PURE__ */ r("button", { type: "button", onClick: n, "aria-label": "关闭", disabled: i, children: "×" })
            ] }),
            /* @__PURE__ */ a("div", { className: "knowledge-name-dialog__body", children: [
              /* @__PURE__ */ r("label", { htmlFor: "knowledge-create-node-name", children: e.type === "folder" ? "文件夹名称" : "文件名称" }),
              /* @__PURE__ */ r(
                "input",
                {
                  ref: d,
                  className: "knowledge-name-dialog__input",
                  id: "knowledge-create-node-name",
                  type: "text",
                  value: _,
                  disabled: i,
                  onChange: (f) => g(f.target.value),
                  onKeyDown: (f) => {
                    f.key === "Escape" && !i && (f.preventDefault(), n());
                  }
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "knowledge-name-dialog__footer", children: [
              /* @__PURE__ */ r(S, { type: "button", variant: "outline", onClick: n, disabled: i, children: "取消" }),
              /* @__PURE__ */ r(S, { type: "submit", disabled: i || !_.trim(), children: i ? "创建中" : "确定" })
            ] })
          ]
        }
      )
    }
  );
}
function ai({ fileName: e }) {
  return /* @__PURE__ */ a("div", { className: "knowledge-editor__header", children: [
    /* @__PURE__ */ r("div", { className: "knowledge-editor__title", children: /* @__PURE__ */ r("span", { className: "knowledge-editor__title-text", children: e || "文件" }) }),
    /* @__PURE__ */ r("div", { className: "knowledge-editor__actions", children: /* @__PURE__ */ r(Mn, { status: { label: "文件加载中" } }) })
  ] });
}
function Mn({ status: e }) {
  return e ? /* @__PURE__ */ r("span", { className: "knowledge-editor__status", role: "status", "aria-label": e.label, children: /* @__PURE__ */ r(re, { size: 15 }) }) : null;
}
function li(e, i) {
  if (i === "folder")
    return e.length;
  const n = e.lastIndexOf(".");
  return n > 0 ? n : e.length;
}
function be({
  status: e,
  compact: i
}) {
  const n = ki(e);
  if (!n)
    return null;
  const o = n.icon;
  return /* @__PURE__ */ a(
    "span",
    {
      className: `knowledge-index-status is-${n.status}${i ? " is-compact" : ""}`,
      title: n.label,
      "aria-label": n.label,
      children: [
        /* @__PURE__ */ r(o, { size: i ? 13 : 14 }),
        i ? null : /* @__PURE__ */ r("span", { children: n.label })
      ]
    }
  );
}
function oi({
  knowledgeBaseID: e,
  baseName: i,
  mode: n,
  onClose: o
}) {
  const [d, v] = h(""), [_, g] = h(8), [f, D] = h(!1), [N, w] = h(""), [m, O] = h(null), L = m?.snippets || [], c = Object.entries(m?.source_counts || {}), z = m?.plans || [], $ = I(async () => {
    const x = d.trim();
    if (!e || !x) {
      w("请输入要测试的问题");
      return;
    }
    D(!0), w("");
    try {
      O(await Lt({
        knowledgeBaseID: e,
        query: x,
        limit: _
      }));
    } catch (p) {
      O(null), w(T(p, "测试检索失败"));
    } finally {
      D(!1);
    }
  }, [e, _, d]);
  return /* @__PURE__ */ r(
    "div",
    {
      className: "knowledge-index-detail knowledge-retrieve-test",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "测试检索",
      onClick: o,
      children: /* @__PURE__ */ a("div", { className: "knowledge-index-detail__panel", onClick: (x) => x.stopPropagation(), children: [
        /* @__PURE__ */ a("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ r("strong", { children: "测试检索" }),
            /* @__PURE__ */ a("span", { children: [
              i,
              " · ",
              si(n)
            ] })
          ] }),
          /* @__PURE__ */ r("button", { type: "button", onClick: o, "aria-label": "关闭", children: "×" })
        ] }),
        /* @__PURE__ */ a(
          "form",
          {
            className: "knowledge-retrieve-test__form",
            onSubmit: (x) => {
              x.preventDefault(), $();
            },
            children: [
              /* @__PURE__ */ r(
                zn,
                {
                  value: d,
                  onChange: (x) => v(x.target.value),
                  placeholder: "输入一个问题测试知识库召回",
                  autoFocus: !0
                }
              ),
              /* @__PURE__ */ r(
                "input",
                {
                  className: "knowledge-retrieve-test__limit",
                  type: "number",
                  min: 1,
                  max: 20,
                  value: _,
                  onChange: (x) => g(ce(Number(x.target.value) || 8, 1, 20)),
                  "aria-label": "返回数量"
                }
              ),
              /* @__PURE__ */ a(S, { type: "submit", disabled: f || !d.trim(), children: [
                f ? /* @__PURE__ */ r(re, { className: "knowledge-retrieve-test__spin", size: 15 }) : /* @__PURE__ */ r(Be, { size: 15 }),
                "测试"
              ] })
            ]
          }
        ),
        N ? /* @__PURE__ */ r("div", { className: "knowledge-index-detail__error", children: N }) : null,
        f ? /* @__PURE__ */ a("div", { className: "knowledge-index-detail__loading", children: [
          /* @__PURE__ */ r(re, { size: 18 }),
          "检索测试中"
        ] }) : m ? /* @__PURE__ */ a("div", { className: "knowledge-retrieve-test__body", children: [
          /* @__PURE__ */ a("div", { className: "knowledge-index-detail__meta", children: [
            /* @__PURE__ */ a("span", { children: [
              "问题：",
              m.query || d
            ] }),
            /* @__PURE__ */ a("span", { children: [
              "命中：",
              L.length
            ] }),
            /* @__PURE__ */ r("span", { children: "命中片段为候选，智能体会按需读取原文确认。" }),
            c.map(([x, p]) => /* @__PURE__ */ a("span", { children: [
              gn(x),
              "：",
              p
            ] }, x))
          ] }),
          /* @__PURE__ */ r(de, { title: "命中片段", count: L.length, children: /* @__PURE__ */ r("div", { className: "knowledge-retrieve-test__results", children: L.map((x, p) => /* @__PURE__ */ a("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ a("div", { className: "knowledge-index-detail__card-title", children: [
              /* @__PURE__ */ r("strong", { children: x.title || `片段 ${p + 1}` }),
              /* @__PURE__ */ a("span", { children: [
                gn(x.source || "node"),
                " · ",
                di(x.score)
              ] })
            ] }),
            /* @__PURE__ */ r("p", { children: x.content || "暂无内容。" }),
            /* @__PURE__ */ a("div", { className: "knowledge-retrieve-test__meta", children: [
              /* @__PURE__ */ a("span", { children: [
                "文档：",
                x.doc_id || "-"
              ] }),
              /* @__PURE__ */ a("span", { children: [
                "节点：",
                x.node_id || "-"
              ] }),
              /* @__PURE__ */ a("span", { children: [
                "目录：",
                x.dir_path || "/"
              ] })
            ] })
          ] }, `${x.node_id || p}-${p}`)) }) }),
          z.length ? /* @__PURE__ */ r(de, { title: "检索计划", count: z.length, children: /* @__PURE__ */ r("div", { className: "knowledge-retrieve-test__plans", children: z.map((x, p) => /* @__PURE__ */ r("pre", { children: ci(x) }, p)) }) }) : null
        ] }) : /* @__PURE__ */ r("div", { className: "knowledge-index-detail__empty", children: "输入问题后开始测试。" })
      ] })
    }
  );
}
function si(e) {
  return Number(e) === 2 ? "轻量检索" : Number(e) === 1 ? "智能增强" : "未知模式";
}
function gn(e) {
  const i = String(e || "").trim();
  return {
    node: "关键词",
    graph: "图谱",
    vector: "向量",
    node_vector: "向量",
    planned_doc: "规划文档",
    agentic_knowledge: "综合",
    planner: "规划",
    init: "初始化文件",
    file: "原文",
    file_search: "原文搜索",
    file_read: "原文读取"
  }[i] || i || "未知";
}
function di(e) {
  const i = Number(e);
  return Number.isFinite(i) ? `分数 ${i.toFixed(3)}` : "分数 -";
}
function ci(e) {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}
function xe({ sourceType: e }) {
  return !e || e === "upload" ? null : e === "qa" ? /* @__PURE__ */ r("span", { className: "knowledge-source-tag is-qa", children: "QA 积累" }) : /* @__PURE__ */ r("span", { className: "knowledge-source-tag", children: e });
}
function ui({ progress: e }) {
  if (!e)
    return null;
  const i = ce(Math.round(e.percent), 0, 100);
  return /* @__PURE__ */ a("div", { className: `knowledge-upload-progress is-${e.status}`, role: "status", children: [
    /* @__PURE__ */ a("div", { className: "knowledge-upload-progress__row", children: [
      /* @__PURE__ */ r("span", { children: zi(e.status) }),
      /* @__PURE__ */ a("strong", { children: [
        i,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "knowledge-upload-progress__track", children: /* @__PURE__ */ r("span", { style: { width: `${i}%` } }) }),
    /* @__PURE__ */ a("div", { className: "knowledge-upload-progress__meta", children: [
      /* @__PURE__ */ r("span", { children: e.currentFile || "准备上传" }),
      /* @__PURE__ */ a("em", { children: [
        e.currentIndex,
        "/",
        e.total
      ] })
    ] })
  ] });
}
function fi({
  item: e,
  depth: i,
  title: n,
  arrow: o,
  context: d,
  onContextMenu: v,
  children: _
}) {
  const g = e.index === u ? null : e.data, f = g?.type === "file", D = g ? Math.max(0, g.level) : Math.max(0, i - 1), N = {
    "--knowledge-tree-guide-left": `${12 + Math.max(0, D - 1) * 28 + 9}px`,
    paddingLeft: 12 + D * 28
  };
  return /* @__PURE__ */ a(
    "li",
    {
      ...d.itemContainerWithChildrenProps,
      className: "knowledge-tree__item",
      children: [
        /* @__PURE__ */ a(
          "div",
          {
            ...d.interactiveElementProps,
            className: `knowledge-tree-row${d.isSelected && f ? " is-selected" : ""}${d.isFocused && f ? " is-focused" : ""}${d.isDraggingOver ? " can-drop" : ""}${D === 0 ? " is-root-level" : " is-nested"}`,
            style: N,
            onContextMenu: (w) => v(w, g),
            children: [
              o,
              n,
              /* @__PURE__ */ r(qt, { className: "knowledge-tree-row__more", size: 14 })
            ]
          }
        ),
        _
      ]
    }
  );
}
function mi({
  state: e,
  onCreateFolder: i,
  onCreateFile: n,
  onUpload: o,
  onRename: d,
  onDelete: v
}) {
  const _ = e.node, g = ie(null), [f, D] = h(
    () => _n(
      e.x,
      e.y,
      pn,
      hn
    )
  );
  return Nn(() => {
    const N = g.current?.getBoundingClientRect();
    D(
      _n(
        e.x,
        e.y,
        N?.width || pn,
        N?.height || hn
      )
    );
  }, [e.x, e.y, _]), /* @__PURE__ */ a(
    "div",
    {
      ref: g,
      className: "knowledge-context-menu",
      style: { left: f.left, top: f.top },
      onClick: (N) => N.stopPropagation(),
      onContextMenu: (N) => N.preventDefault(),
      children: [
        /* @__PURE__ */ a("button", { type: "button", onClick: () => i(_), children: [
          /* @__PURE__ */ r(Cn, { size: 15 }),
          "新建文件夹"
        ] }),
        /* @__PURE__ */ a("button", { type: "button", onClick: () => n(_), children: [
          /* @__PURE__ */ r(Dn, { size: 15 }),
          "新建文件"
        ] }),
        /* @__PURE__ */ a("button", { type: "button", onClick: () => o(_), children: [
          /* @__PURE__ */ r(Sn, { size: 15 }),
          "上传文件"
        ] }),
        _ ? /* @__PURE__ */ a(vt, { children: [
          /* @__PURE__ */ r("span", { className: "knowledge-context-menu__sep" }),
          /* @__PURE__ */ a("button", { type: "button", onClick: () => d(_), children: [
            /* @__PURE__ */ r(Ke, { size: 15 }),
            "重命名"
          ] }),
          /* @__PURE__ */ a("button", { type: "button", className: "is-danger", onClick: () => v(_), children: [
            /* @__PURE__ */ r(Vt, { size: 15 }),
            "删除"
          ] })
        ] }) : null
      ]
    }
  );
}
function pi({
  detail: e,
  expirationUpdating: i,
  loading: n,
  reviewing: o,
  fileName: d,
  onReview: v,
  onExpiration: _,
  onClose: g
}) {
  const f = e?.nodes || [], D = e?.edges || [], [N, w] = h(
    wn(e?.expires_at)
  );
  return H(() => {
    w(wn(e?.expires_at));
  }, [e?.doc_id, e?.expires_at]), /* @__PURE__ */ r(
    "div",
    {
      className: "knowledge-index-detail",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "索引详情",
      onClick: g,
      children: /* @__PURE__ */ a("div", { className: "knowledge-index-detail__panel", onClick: (m) => m.stopPropagation(), children: [
        /* @__PURE__ */ a("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ r("strong", { children: "索引详情" }),
            /* @__PURE__ */ r("span", { children: e?.name || d || "当前文件" })
          ] }),
          /* @__PURE__ */ r("button", { type: "button", onClick: g, "aria-label": "关闭", children: "×" })
        ] }),
        n ? /* @__PURE__ */ a("div", { className: "knowledge-index-detail__loading", children: [
          /* @__PURE__ */ r(re, { size: 18 }),
          "加载索引详情中"
        ] }) : e ? /* @__PURE__ */ a("div", { className: "knowledge-index-detail__body", children: [
          /* @__PURE__ */ a("div", { className: "knowledge-index-detail__meta", children: [
            /* @__PURE__ */ r(be, { status: e.index_status }),
            /* @__PURE__ */ r(xe, { sourceType: e.source_type }),
            /* @__PURE__ */ r(hi, { status: e.review_status }),
            /* @__PURE__ */ a("span", { children: [
              "文档ID：",
              e.doc_id || "-"
            ] }),
            /* @__PURE__ */ a("span", { children: [
              "节点：",
              e.node_count || f.length
            ] }),
            /* @__PURE__ */ a("span", { children: [
              "目录：",
              e.dir_path || "/"
            ] }),
            /* @__PURE__ */ a("div", { className: "knowledge-expiration-control", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "datetime-local",
                  value: N,
                  disabled: i,
                  "aria-label": "文档过期时间",
                  onChange: (m) => w(m.target.value)
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  title: "保存过期时间",
                  "aria-label": "保存过期时间",
                  disabled: i || !N,
                  onClick: () => {
                    _(new Date(N).toISOString());
                  },
                  children: /* @__PURE__ */ r(jt, { size: 15 })
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  title: "清除过期时间",
                  "aria-label": "清除过期时间",
                  disabled: i || !N && !e.expires_at,
                  onClick: () => {
                    w(""), _();
                  },
                  children: /* @__PURE__ */ r(ye, { size: 15 })
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "knowledge-review-actions", "aria-label": "文档审核", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  title: "审核通过",
                  "aria-label": "审核通过",
                  disabled: o || e.review_status === "approved",
                  onClick: () => {
                    v("approved");
                  },
                  children: /* @__PURE__ */ r(ke, { size: 15 })
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  title: "驳回文档",
                  "aria-label": "驳回文档",
                  disabled: o || e.review_status === "rejected",
                  onClick: () => {
                    v("rejected");
                  },
                  children: /* @__PURE__ */ r(ye, { size: 15 })
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  title: "重置为待审核",
                  "aria-label": "重置为待审核",
                  disabled: o || e.review_status === "pending",
                  onClick: () => {
                    v("pending");
                  },
                  children: /* @__PURE__ */ r(Fn, { size: 15 })
                }
              )
            ] })
          ] }),
          e.error_message ? /* @__PURE__ */ r("div", { className: "knowledge-index-detail__error", children: e.error_message }) : null,
          /* @__PURE__ */ a(de, { title: "文章摘要", count: e.summary ? 1 : 0, children: [
            /* @__PURE__ */ r("p", { className: "knowledge-index-detail__summary", children: e.summary || "暂无摘要。" }),
            /* @__PURE__ */ r(vn, { values: e.keywords || [] })
          ] }),
          /* @__PURE__ */ r(de, { title: "节点", count: f.length, children: f.map((m) => /* @__PURE__ */ a("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ a("div", { className: "knowledge-index-detail__card-title", children: [
              /* @__PURE__ */ r("strong", { children: m.path || m.title || `#${m.sort}` }),
              /* @__PURE__ */ r(be, { status: m.index_status, compact: !0 })
            ] }),
            /* @__PURE__ */ r("p", { children: m.content_preview || "暂无内容。" }),
            /* @__PURE__ */ r(vn, { values: m.keywords || [], compact: !0 })
          ] }, m.id)) }),
          /* @__PURE__ */ r(de, { title: "关系", count: D.length, children: /* @__PURE__ */ r("div", { className: "knowledge-index-detail__grid", children: D.map((m) => /* @__PURE__ */ a("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ a("div", { className: "knowledge-index-detail__triple", children: [
              /* @__PURE__ */ r("span", { children: m.subject }),
              /* @__PURE__ */ r("em", { children: m.label || m.predicate || m.edge_type || "关联" }),
              /* @__PURE__ */ r("span", { children: m.object })
            ] }),
            /* @__PURE__ */ r("p", { children: m.description || m.evidence || "暂无说明。" })
          ] }, m.id)) }) })
        ] }) : /* @__PURE__ */ r("div", { className: "knowledge-index-detail__empty", children: "暂无索引详情。" })
      ] })
    }
  );
}
function hi({ status: e }) {
  const i = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已驳回",
    expired: "已过期"
  }, n = e || "pending";
  return /* @__PURE__ */ r("span", { className: `knowledge-review-status is-${n}`, children: i[n] });
}
function En(e) {
  return e === "approved" ? "文档已审核通过" : e === "rejected" ? "文档已驳回" : "文档已重置为待审核";
}
function wn(e) {
  if (!e)
    return "";
  const i = new Date(e);
  return Number.isNaN(i.getTime()) ? "" : new Date(i.getTime() - i.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
}
function de({
  title: e,
  count: i,
  children: n
}) {
  return /* @__PURE__ */ a("section", { className: "knowledge-index-detail__section", children: [
    /* @__PURE__ */ a("h3", { children: [
      e,
      /* @__PURE__ */ r("span", { children: i })
    ] }),
    i > 0 || e === "文章摘要" ? n : /* @__PURE__ */ a("div", { className: "knowledge-index-detail__empty", children: [
      "暂无",
      e,
      "。"
    ] })
  ] });
}
function vn({ values: e, compact: i }) {
  const n = e.map((o) => o.trim()).filter(Boolean);
  return n.length ? /* @__PURE__ */ r("div", { className: `knowledge-index-detail__tags${i ? " is-compact" : ""}`, children: n.map((o) => /* @__PURE__ */ r("span", { children: o }, o)) }) : null;
}
function _n(e, i, n, o) {
  if (typeof window > "u")
    return { left: e, top: i };
  const d = Math.max(
    te,
    window.innerWidth - n - te
  ), v = Math.max(
    te,
    window.innerHeight - o - te
  );
  return {
    left: ce(e, te, d),
    top: ce(i, te, v)
  };
}
function gi(e, i) {
  const n = {
    [u]: {
      index: u,
      isFolder: !0,
      canMove: !1,
      canRename: !1,
      data: {
        id: u,
        name: i || "知识库",
        type: "folder",
        parent_id: u,
        path: u,
        level: 0,
        children: e
      },
      children: e.map((d) => d.id)
    }
  }, o = (d) => {
    n[d.id] = {
      index: d.id,
      isFolder: d.type === "folder",
      canMove: !0,
      canRename: !0,
      data: d,
      children: d.type === "folder" ? d.children.map((v) => v.id) : void 0
    }, d.children.forEach(o);
  };
  return e.forEach(o), n;
}
function wi(e) {
  const i = /* @__PURE__ */ new Set([u]), n = (o) => {
    o.type === "folder" && (i.add(o.id), o.children.forEach(n));
  };
  return e.forEach(n), i;
}
function vi(e, i) {
  return Array.from(e).filter((n) => n === u || !!i[n]);
}
function yn(e) {
  if (!e || typeof window > "u")
    return /* @__PURE__ */ new Set([u]);
  try {
    const i = window.localStorage.getItem(Rn(e)), n = JSON.parse(i || "[]");
    return Array.isArray(n) ? /* @__PURE__ */ new Set([u, ...n.map(U).filter((o) => o !== u)]) : /* @__PURE__ */ new Set([u]);
  } catch {
    return /* @__PURE__ */ new Set([u]);
  }
}
function _i(e, i) {
  if (!e || typeof window > "u")
    return;
  const n = Array.from(i).filter((o) => o && o !== u);
  window.localStorage.setItem(Rn(e), JSON.stringify(n));
}
function Rn(e) {
  return `${Xt}${e}`;
}
function Oe(e) {
  if (!e || typeof window > "u")
    return "";
  const i = window.localStorage.getItem(We(e));
  if (!i)
    return "";
  const n = U(i);
  return n === u ? "" : n;
}
function $e(e, i) {
  if (!e || typeof window > "u")
    return;
  const n = U(i);
  if (!n || n === u) {
    se(e);
    return;
  }
  window.localStorage.setItem(We(e), n);
}
function se(e) {
  !e || typeof window > "u" || window.localStorage.removeItem(We(e));
}
function We(e) {
  return `${Gt}${e}`;
}
function bn(e, i) {
  const n = new Set(e);
  let o = Y(i);
  for (; o && o !== u; )
    n.add(o), o = Y(o);
  return n.add(u), n;
}
function yi(e, i, n) {
  const o = Tn(i, n);
  return o ? e.every((d) => {
    const v = String(d.index);
    return v !== u && v !== o && !o.startsWith(`${v}/`);
  }) : !1;
}
function Tn(e, i) {
  if (e.targetType === "root")
    return u;
  if (e.targetType === "item")
    return i[e.targetItem]?.data.type === "folder" ? String(e.targetItem) : "";
  const n = String(e.parentItem || u);
  return n === u ? u : i[n]?.data.type === "folder" ? n : "";
}
function Pe(e) {
  const i = /* @__PURE__ */ new Map(), n = [], o = e.map(xi).sort(On);
  for (const d of o)
    d.type === "folder" && i.set(d.id, d);
  for (const d of o) {
    const v = i.get(d.id) || d, _ = v.parent_id;
    if (!_ || _ === u) {
      n.push(v);
      continue;
    }
    const g = i.get(_);
    g ? g.children.push(v) : n.push(v);
  }
  return Ln(n), n;
}
function bi(e) {
  const i = [], n = (o) => {
    i.push(o), o.children.forEach(n);
  };
  return e.forEach(n), i;
}
function xi(e) {
  const i = U(e.id);
  return {
    ...e,
    id: i,
    name: e.name || Pn(i),
    parent_id: Y(i),
    path: i,
    level: Ci(i),
    children: []
  };
}
function Ln(e) {
  e.sort(On), e.forEach((i) => Ln(i.children));
}
function On(e, i) {
  return e.type !== i.type ? e.type === "folder" ? -1 : 1 : e.name.localeCompare(i.name, "zh-Hans-CN");
}
function $n(e, i) {
  const n = i.trim().toLowerCase();
  return n ? e.flatMap((o) => {
    const d = $n(o.children, n);
    return o.name.toLowerCase().includes(n) || d.length ? [{ ...o, children: d }] : [];
  }) : e;
}
function A(e, i) {
  const n = U(i);
  for (const o of e) {
    if (o.id === n)
      return o;
    const d = A(o.children, n);
    if (d)
      return d;
  }
  return null;
}
function _e(e) {
  switch (String(e || "").trim().toLowerCase()) {
    case "pending":
      return "pending";
    case "running":
      return "running";
    case "success":
      return "success";
    case "failed":
    case "fail":
      return "failed";
    default:
      return "";
  }
}
function ki(e) {
  const i = _e(e);
  return i === "running" ? { status: i, label: "索引中", icon: re } : i === "pending" ? { status: i, label: "待索引", icon: Fn } : i === "failed" ? { status: i, label: "索引失败", icon: ye } : i === "success" ? { status: i, label: "已索引", icon: ke } : null;
}
function Ni(e) {
  const i = (e.files || []).map((n) => ({ ...n, index_status: n.type === "file" ? "running" : n.index_status }));
  return {
    ...e,
    base: e.base ? { ...e.base, index_status: "running" } : e.base,
    files: i
  };
}
function Ae(e, i) {
  return U(i).startsWith(`${e.id}/`);
}
function Ii(e) {
  const i = e.knowledge_base_id || e.knowledgeBaseID || e.base_id || e.baseID || e.id || ve("knowledge_base_id") || ve("knowledgeBaseID") || ve("base_id") || ve("id"), n = Number(i);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function ve(e) {
  return typeof window > "u" ? "" : new URLSearchParams(window.location.search).get(e) || "";
}
function U(e) {
  const i = String(e || "").trim();
  return !i || i === "." ? u : i.replace(/\\/g, "/").replace(/^\/+/, "") || u;
}
function Y(e) {
  const i = U(e);
  return !i || i === u || !i.includes("/") ? u : i.slice(0, i.lastIndexOf("/")) || u;
}
function Pn(e) {
  const i = U(e);
  return i === u ? "知识库" : i.slice(i.lastIndexOf("/") + 1);
}
function Ci(e) {
  const i = U(e);
  return i === u ? 0 : i.split("/").length - 1;
}
async function xn({
  knowledgeBaseID: e,
  parent: i,
  file: n,
  name: o,
  chunkBytes: d,
  maxBytes: v,
  onProgress: _
}) {
  if (n.size > v)
    throw new Error(`文件 ${n.name} 超过 ${Di(v)} 上传限制`);
  const g = Math.max(1, Math.ceil(n.size / d)), f = Si();
  let D = null;
  for (let N = 0; N < g; N += 1) {
    const w = N * d, m = n.slice(w, Math.min(n.size, w + d)), O = await Tt({
      knowledgeBaseID: e,
      parent: i,
      name: o,
      uploadID: f,
      partNumber: N + 1,
      totalParts: g,
      chunk: m
    });
    O.complete && (D = O), _?.((N + 1) / g);
  }
  if (!D)
    throw new Error("上传失败");
  return D;
}
function kn(e, i) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? Math.floor(e) : i;
}
function Di(e) {
  return e >= 1073741824 ? `${Number((e / 1073741824).toFixed(1))}GB` : `${Math.floor(e / 1024 / 1024)}MB`;
}
function Si() {
  const e = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}_${e}`;
}
function Fi(e) {
  const i = window.open(e, "_blank", "noopener,noreferrer");
  i && (i.opener = null);
}
function Ue(e, i, n) {
  const o = Math.max(i, 1);
  return Math.round((e + ce(n, 0, 1)) / o * 100);
}
function zi(e) {
  return e === "reading" ? "读取文件中" : e === "uploading" ? "上传中" : e === "done" ? "上传完成" : "上传失败";
}
function ce(e, i, n) {
  return Math.min(Math.max(e, i), n);
}
function T(e, i) {
  return e instanceof Error ? e.message : i;
}
export {
  $i as ShowKnowledgeFileManager
};
