import { u as W, c as K, j as he, i as De, e as R, d as re, b as Y, a as $, k as mn, f as Be, R as j, F as Hn, l as fn, S as en } from "./_commonjsHelpers-61wyk6v6.js";
import { j as c, a as P, F as Gn } from "./preloadable-Bomi5PEU.js";
import { b as Ne, a2 as gn, a7 as Vn, aF as qn, a3 as Xn, R as ke, X as Wn, S as Yn, aG as Qn, aH as Zn, aI as Qe, u as Jn, C as pn, T as nn, g as et, c as nt, d as tt, i as hn, aJ as In } from "./vendor-icons-B3DKX3la.js";
import { r as rt } from "./file-kind-UfTAlHnR.js";
import { t as Ke } from "./index-2TBwAJWu.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./styles-jTQUGRbn.css", import.meta.url).href]);
var se;
(function(e) {
  e.DoubleClickItemToExpand = "double-click-item-to-expand", e.ClickItemToExpand = "click-item-to-expand", e.ClickArrowToExpand = "click-arrow-to-expand";
})(se || (se = {}));
var Le = function() {
  return Le = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Le.apply(this, arguments);
}, it = function(e, t) {
  return {
    mode: e.mode,
    createInteractiveElementProps: function(n, r, i, a) {
      return Le(Le({}, t.createInteractiveElementProps(n, r, i, a)), e.createInteractiveElementProps(n, r, i, a));
    }
  };
}, ge = function(e) {
  return e.ctrlKey || navigator.platform.toUpperCase().indexOf("MAC") >= 0 && e.metaKey;
}, at = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = se.DoubleClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(o) {
          var l = o.detail === 0;
          r.focusItem(), o.shiftKey && !l ? r.selectUpTo(!ge(o)) : ge(o) && !l ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : r.selectItem();
        },
        onDoubleClick: function() {
          r.focusItem(), r.selectItem(), t.isFolder && r.toggleExpandedState(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction();
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(o) {
          o.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(o) {
          o.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), ot = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = se.ClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(o) {
          var l = o.detail === 0;
          r.focusItem(), o.shiftKey && !l ? r.selectUpTo(!ge(o)) : ge(o) && !l ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : (t.isFolder && r.toggleExpandedState(), r.selectItem(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction());
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(o) {
          o.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(o) {
          o.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), lt = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = se.ClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(o) {
          var l = o.detail === 0;
          r.focusItem(), o.shiftKey && !l ? r.selectUpTo(!ge(o)) : ge(o) && !l ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : (r.selectItem(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction());
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(o) {
          o.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(o) {
          o.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), tn = function(e, t) {
  switch (e) {
    case se.DoubleClickItemToExpand:
      return new at(t);
    case se.ClickItemToExpand:
      return new ot(t);
    case se.ClickArrowToExpand:
      return new lt(t);
    default:
      throw Error("Unknown interaction mode ".concat(e));
  }
}, wn = he(null), dt = function() {
  return De(wn);
}, st = function(e) {
  var t = e.children, n = z(), r = n.defaultInteractionMode, i = W(function() {
    var a;
    return r && typeof r != "string" ? r.extends ? it(r, tn(r.extends, n)) : r : tn((a = r) !== null && a !== void 0 ? a : se.ClickItemToExpand, n);
  }, []);
  return K(wn.Provider, { value: i }, t);
}, bn = function() {
  var e = z();
  return R(function(t, n) {
    if (t.targetType === "between-items") {
      if (!e.canReorderItems)
        return !1;
    } else if (t.targetType === "root") {
      if (!e.canDropOnFolder)
        return !1;
    } else {
      var r = e.items[t.targetItem];
      if (!r || !e.canDropOnFolder && r.isFolder || !e.canDropOnNonFolder && !r.isFolder || n.some(function(i) {
        return i.index === t.targetItem;
      }))
        return !1;
    }
    return !(e.canDropAt && (!n || !e.canDropAt(n, t)));
  }, [e]);
}, _n = function() {
  var e = z();
  return R(function(t, n) {
    for (var r = e.linearItems[n], i = r[t].depth, a = t; r[a] && r[a].depth !== i - 1; a -= 1)
      ;
    var o = r[a];
    return o || (o = { item: e.trees[n].rootItem, depth: 0 }, a = 0), { parent: o, parentLinearIndex: a };
  }, [e.linearItems, e.trees]);
}, ct = function() {
  var e = z(), t = _n(), n = bn(), r = R(function(i, a, o) {
    var l = t(a, i), u = l.parent, d = l.parentLinearIndex;
    return o.some(function(s) {
      return s.index === u.item;
    }) ? !0 : u.depth === 0 ? !1 : r(i, d, o);
  }, [t]);
  return R(function(i, a) {
    for (
      var o, l, u, d, s = e.linearItems[i], v = [], f = -1, m = 0;
      m < s.length;
      // eslint-disable-next-line no-plusplus
      m++
    ) {
      var h = s[m], b = h.item, p = h.depth;
      if (!(f !== -1 && p > f)) {
        f = -1;
        var g = t(m, i).parent, I = e.items[g.item].children.indexOf(b);
        if (r(i, m, a)) {
          f = p + 1;
          continue;
        }
        var D = {
          targetType: "item",
          parentItem: g.item,
          targetItem: b,
          linearIndex: m,
          depth: p,
          treeId: i
        }, S = {
          targetType: "between-items",
          parentItem: g.item,
          linePosition: "top",
          childIndex: I,
          depth: p,
          treeId: i,
          linearIndex: m
        }, E = {
          targetType: "between-items",
          parentItem: g.item,
          linePosition: "bottom",
          linearIndex: m + 1,
          childIndex: I + 1,
          depth: p,
          treeId: i
        }, B = (l = (o = s[m - 1]) === null || o === void 0 ? void 0 : o.depth) !== null && l !== void 0 ? l : -1, G = (d = (u = s[m + 1]) === null || u === void 0 ? void 0 : u.depth) !== null && d !== void 0 ? d : -1, q = p === B, H = p === G - 1;
        !q && n(S, a) && v.push(S), n(D, a) && v.push(D), !H && n(E, a) && v.push(E);
      }
    }
    return v;
  }, [
    n,
    e.items,
    e.linearItems,
    t,
    r
  ]);
}, Ce = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, Re = function(e, t, n) {
  var r = re();
  Y(function() {
    if (!r.current)
      r.current = Ce([], n, !0), e();
    else {
      var i = r.current.some(function(a, o) {
        return a !== n[o];
      });
      i && (r.current = Ce([], n, !0), e());
    }
  }, Ce(Ce([], t, !0), n, !0));
}, Ae = function() {
  return Ae = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Ae.apply(this, arguments);
}, yn = function(e, t) {
  return e.map(function(n) {
    return [n, t(n)];
  }).reduce(function(n, r) {
    var i, a = r[0], o = r[1];
    return Ae(Ae({}, n), (i = {}, i[a] = o, i));
  }, {});
}, ae = function() {
  return typeof document < "u" ? document : void 0;
};
function Ie(e) {
  e === void 0 && (e = !1);
  var t = re(new Array());
  return Y(function() {
    if (e)
      return function() {
      };
    var n = t.current;
    return function() {
      return n.forEach(function(r) {
        return cancelAnimationFrame(r);
      });
    };
  }, [e, t]), R(function(n) {
    var r = requestAnimationFrame(function() {
      t.current.splice(t.current.indexOf(r), 1), n();
    });
    t.current.push(r);
  }, [t]);
}
var Fe = function(e) {
  var t = re(e);
  return t.current = e, t;
}, oe = function(e) {
  var t = Fe(e);
  return R((function() {
    for (var n = [], r = 0; r < arguments.length; r++)
      n[r] = arguments[r];
    return t.current.apply(t, n);
  }), [
    t
  ]);
}, xn = function() {
  var e = z();
  return oe(function(t, n) {
    return n.map(function(r) {
      return [
        r,
        e.linearItems[t].findIndex(function(i) {
          return i.item === r.index;
        })
      ];
    }).sort(function(r, i) {
      r[0];
      var a = r[1];
      i[0];
      var o = i[1];
      return a - o;
    }).map(function(r) {
      var i = r[0];
      return i;
    });
  });
}, ut = function(e) {
  var t, n = (t = ae()) === null || t === void 0 ? void 0 : t.querySelector('[data-rct-tree="'.concat(e, '"] [data-rct-item-container="true"]'));
  if (n) {
    var r = getComputedStyle(n);
    return n.offsetHeight + Math.max(parseFloat(r.marginTop), parseFloat(r.marginBottom));
  }
  return 5;
}, Dn = function(e, t) {
  return e.clientX <= t.left || e.clientX >= t.right || e.clientY <= t.top || e.clientY >= t.bottom;
}, vt = (
  /** @class */
  (function() {
    function e(t, n, r, i, a, o) {
      this.env = t, this.e = n, this.treeId = r, this.linearIndex = i.linearIndex, this.offset = i.offset, this.indentation = i.indentation, this.targetItem = this.env.linearItems[this.treeId][this.linearIndex], this.getParentOfLinearItem = o, this.draggingItems = a;
    }
    return e.prototype.getEmptyTreeDragPosition = function() {
      return {
        targetType: "root",
        treeId: this.treeId,
        depth: 0,
        linearIndex: 0,
        targetItem: this.env.trees[this.treeId].rootItem
      };
    }, e.prototype.maybeRedirectToParent = function() {
      var t = !this.env.canReorderItems && !this.env.canDropOnNonFolder && !this.env.items[this.targetItem.item].isFolder;
      if (t) {
        var n = this.getParentOfLinearItem(this.linearIndex, this.treeId), r = n.parentLinearIndex, i = n.parent;
        this.targetItem = i, this.linearIndex = r;
      }
    }, e.prototype.maybeReparentUpwards = function() {
      var t, n;
      if (this.indentation !== void 0) {
        var r = this.env.linearItems[this.treeId], i = r[this.linearIndex].depth, a = (
          // itemDepthDifferenceToNextItem/isLastInGroup
          i - ((n = (t = r[this.linearIndex + 1]) === null || t === void 0 ? void 0 : t.depth) !== null && n !== void 0 ? n : 0)
        ), o = this.offset === "bottom" && a > 0;
        if (o) {
          for (var l = Math.max(i - a, this.indentation), u = {
            parentLinearIndex: this.linearIndex,
            parent: this.targetItem
          }, d, s = i; s >= l; s -= 1)
            d = u, u = this.getParentOfLinearItem(u.parentLinearIndex, this.treeId);
          if (this.indentation !== r[this.linearIndex].depth && d) {
            var v = this.env.items[u.parent.item].children.indexOf(d.parent.item) + 1;
            if (!(this.draggingItems && this.isDescendant(this.treeId, u.parentLinearIndex + 1, this.draggingItems)))
              return {
                targetType: "between-items",
                treeId: this.treeId,
                parentItem: u.parent.item,
                depth: l,
                linearIndex: this.linearIndex + 1,
                childIndex: v,
                linePosition: "bottom"
              };
          }
        }
      }
    }, e.prototype.maybeRedirectInsideOpenFolder = function() {
      var t = this.env.linearItems[this.treeId][this.linearIndex + 1], n = !this.env.canDropBelowOpenFolders && t && this.targetItem.depth === t.depth - 1 && this.offset === "bottom";
      n && (this.targetItem = t, this.linearIndex += 1, this.offset = "top");
    }, e.prototype.maybeMapToBottomOffset = function() {
      var t = this.env.linearItems[this.treeId][this.linearIndex - 1];
      if (!(!t || t?.depth === void 0)) {
        var n = t.depth - this.targetItem.depth;
        this.offset === "top" && (n === 0 || n > 0 && this.indentation !== void 0) && (this.offset = "bottom", this.linearIndex -= 1, this.targetItem = this.env.linearItems[this.treeId][this.linearIndex]);
      }
    }, e.prototype.canDropAtCurrentTarget = function() {
      var t = this, n, r = this.env.items[this.targetItem.item];
      return !(!this.offset && !this.env.canDropOnNonFolder && !r.isFolder || !this.offset && !this.env.canDropOnFolder && r.isFolder || this.offset && !this.env.canReorderItems || !((n = this.draggingItems) === null || n === void 0) && n.some(function(i) {
        return i.index === t.targetItem.item;
      }));
    }, e.prototype.getDraggingPosition = function() {
      if (this.env.linearItems[this.treeId].length === 0)
        return this.getEmptyTreeDragPosition();
      if (!(!this.draggingItems || this.linearIndex < 0 || this.linearIndex >= this.env.linearItems[this.treeId].length)) {
        this.maybeRedirectToParent(), this.maybeRedirectInsideOpenFolder(), this.maybeMapToBottomOffset();
        var t = this.maybeReparentUpwards();
        if (t)
          return t;
        if (this.areDraggingItemsDescendantOfTarget() || !this.canDropAtCurrentTarget())
          return "invalid";
        var n = this.getParentOfLinearItem(this.linearIndex, this.treeId).parent, r = this.env.items[n.item].children.indexOf(this.targetItem.item) + (this.offset === "top" ? 0 : 1);
        return this.offset ? {
          targetType: "between-items",
          treeId: this.treeId,
          parentItem: n.item,
          depth: this.targetItem.depth,
          linearIndex: this.linearIndex + (this.offset === "top" ? 0 : 1),
          childIndex: r,
          linePosition: this.offset
        } : {
          targetType: "item",
          treeId: this.treeId,
          parentItem: n.item,
          targetItem: this.targetItem.item,
          depth: this.targetItem.depth,
          linearIndex: this.linearIndex
        };
      }
    }, e.prototype.isDescendant = function(t, n, r) {
      var i = this.getParentOfLinearItem(n, t), a = i.parentLinearIndex, o = i.parent;
      return r.some(function(l) {
        return l.index === o.item;
      }) ? !0 : o.depth === 0 ? !1 : this.isDescendant(t, a, r);
    }, e.prototype.areDraggingItemsDescendantOfTarget = function() {
      return this.draggingItems && this.isDescendant(this.treeId, this.linearIndex, this.draggingItems);
    }, e;
  })()
), mt = function() {
  var e = re("initial"), t = $(void 0), n = t[0], r = t[1], i = re(0), a = z(), o = _n(), l = oe(function(f, m, h) {
    if (!h)
      return !1;
    var b = h.offset, p = h.linearIndex, g = "".concat(m, "__").concat(p, "__").concat(b ?? "", "__").concat(h.indentation);
    return g !== e.current ? (e.current = g, !0) : !1;
  }), u = oe(function(f, m, h) {
    if (h.current) {
      var b = h.current.getBoundingClientRect();
      if (!Dn(f, b)) {
        var p = (f.clientY - b.top) / i.current, g = a.linearItems[m], I = Math.min(Math.max(0, Math.floor(p)), g.length - 1);
        if (g.length === 0)
          return {
            linearIndex: 0,
            offset: "bottom",
            indentation: 0
          };
        var D = g[I], S = a.items[D.item], E = a.renderDepthOffset ? Math.max(Math.floor((f.clientX - b.left) / a.renderDepthOffset), 0) : void 0, B, G = a.canReorderItems ? S?.isFolder && a.canDropOnFolder || a.canDropOnNonFolder ? 0.2 : 0.5 : 0;
        return p - 0.5 >= g.length - 1 ? B = "bottom" : p % 1 < G ? B = "top" : p % 1 > 1 - G && (B = "bottom"), { linearIndex: I, offset: B, indentation: E };
      }
    }
  }), d = oe(function(f, m, h) {
    var b = u(f, m, h);
    if (l(f, m, b))
      return !n || !a.canDragAndDrop || !b || f.clientX < 0 || f.clientY < 0 ? "invalid" : new vt(a, f, m, b, n, o).getDraggingPosition();
  }), s = oe(function(f, m) {
    r(m), e.current = "initial", i.current = ut(f);
  }), v = oe(function() {
    r(void 0), e.current = "initial", i.current = 0;
  });
  return {
    initiateDraggingPosition: s,
    resetDraggingPosition: v,
    draggingItems: n,
    getDraggingPosition: d,
    itemHeight: i
  };
}, kn = he(null), de = function() {
  return De(kn);
}, ft = function(e) {
  var t = e.children, n = z(), r = $(!1), i = r[0], a = r[1], o = $({}), l = o[0], u = o[1], d = $(0), s = d[0], v = d[1], f = $(), m = f[0], h = f[1], b = ct(), p = Ie(), g = xn(), I = mt(), D = I.initiateDraggingPosition, S = I.resetDraggingPosition, E = I.draggingItems, B = I.getDraggingPosition, G = I.itemHeight, q = R(function(_, C) {
    var x;
    if (n.activeTreeId && (!((x = n.viewState[n.activeTreeId]) === null || x === void 0) && x.focusedItem) && n.linearItems && C) {
      var T = n.viewState[n.activeTreeId].focusedItem, M = b(n.activeTreeId, C), w = M.findIndex(function(A) {
        return A.targetType === "item" ? A.targetItem === T : A.targetType === "between-items" ? n.items[A.parentItem].children[A.childIndex] === T : !1;
      });
      v(w ? Math.min(w + 1, M.length - 1) : 0);
    } else
      v(0);
  }, [
    n.activeTreeId,
    n.items,
    n.linearItems,
    n.viewState,
    b
  ]), H = oe(function() {
    a(!1), u({}), v(0), h(void 0), S();
  });
  Re(function() {
    n.activeTreeId && n.linearItems[n.activeTreeId] && l[n.activeTreeId] && q(l[n.activeTreeId], E);
  }, [
    E,
    n.activeTreeId,
    n.linearItems,
    q,
    l
  ], [n.activeTreeId]), Re(function() {
    i && n.activeTreeId && h(l[n.activeTreeId][s]);
  }, [
    s,
    n.activeTreeId,
    i,
    l
  ], [s, n.activeTreeId]);
  var te = bn(), Z = function(_) {
    var C;
    E && !te(_, E) || (h(_), n.setActiveTree(_.treeId), E && n.activeTreeId !== _.treeId && ((C = n.onSelectItems) === null || C === void 0 || C.call(n, E.map(function(x) {
      return x.index;
    }), _.treeId)));
  }, ee = oe(function(_, C, x) {
    if (E) {
      var T = B(_, C, x);
      if (T) {
        if (T === "invalid") {
          h(void 0);
          return;
        }
        Z(T);
      }
    }
  }), O = oe(function(_, C) {
    C.current && Dn(_, C.current.getBoundingClientRect()) && h(void 0);
  }), N = oe(function() {
    !E || !m || !n.onDrop || (n.onDrop(E, m), p(function() {
      var _;
      (_ = n.onFocusItem) === null || _ === void 0 || _.call(n, E[0], m.treeId), H();
    }));
  }), L = R(function(_, C) {
    var x = yn(n.treeIds, function(T) {
      return b(T, _);
    });
    D(C, _), u(x), n.activeTreeId && q(x[n.activeTreeId], _);
  }, [
    n.activeTreeId,
    n.treeIds,
    b,
    D,
    q
  ]), F = R(function() {
    var _, C, x;
    if (n.canDragAndDrop && n.activeTreeId) {
      var T = (C = (_ = n.viewState[n.activeTreeId]) === null || _ === void 0 ? void 0 : _.selectedItems) !== null && C !== void 0 ? C : [
        (x = n.viewState[n.activeTreeId]) === null || x === void 0 ? void 0 : x.focusedItem
      ];
      if (T.length === 0 || T[0] === void 0)
        return;
      var M = g(n.activeTreeId, T.map(function(w) {
        return n.items[w];
      }));
      if (n.canDrag && !n.canDrag(M))
        return;
      L(M, n.activeTreeId), setTimeout(function() {
        a(!0);
      });
    }
  }, [n, g, L]), X = R(function() {
    H();
  }, [H]), V = R(function() {
    N(), H();
  }, [N, H]), U = R(function() {
    v(function(_) {
      return Math.max(0, _ - 1);
    });
  }, []), y = R(function() {
    n.activeTreeId && v(function(_) {
      return Math.min(l[n.activeTreeId].length - 1, _ + 1);
    });
  }, [n.activeTreeId, l]), k = W(function() {
    return {
      onStartDraggingItems: L,
      startProgrammaticDrag: F,
      abortProgrammaticDrag: X,
      completeProgrammaticDrag: V,
      programmaticDragUp: U,
      programmaticDragDown: y,
      draggingItems: E,
      draggingPosition: m,
      itemHeight: G.current,
      isProgrammaticallyDragging: i,
      onDragOverTreeHandler: ee,
      onDragLeaveContainerHandler: O,
      viableDragPositions: l
    };
  }, [
    X,
    V,
    E,
    m,
    i,
    G,
    ee,
    O,
    L,
    y,
    U,
    F,
    l
  ]);
  return Y(function() {
    return window.addEventListener("dragend", H), window.addEventListener("drop", N), function() {
      window.removeEventListener("dragend", H), window.removeEventListener("drop", N);
    };
  }, [N, H]), K(kn.Provider, { value: k }, t);
}, ye = function() {
  return ye = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, ye.apply(this, arguments);
}, gt = function(e, t) {
  var n = z(), r = de();
  mn(e, function() {
    return ye(ye(ye({}, t), n), { treeEnvironmentContext: n, dragAndDropContext: r });
  });
}, Pn = function(e, t, n) {
  return t === void 0 && (t = 50), n === void 0 && (n = 1e4), new Promise(function(r) {
    e() && r();
    var i, a = setInterval(function() {
      e() && i();
    }, t), o = setTimeout(function() {
      i();
    }, n);
    i = function() {
      clearInterval(a), clearTimeout(o), r();
    };
  });
}, Ue = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(o) {
      o(a);
    });
  }
  return new (n || (n = Promise))(function(a, o) {
    function l(s) {
      try {
        d(r.next(s));
      } catch (v) {
        o(v);
      }
    }
    function u(s) {
      try {
        d(r.throw(s));
      } catch (v) {
        o(v);
      }
    }
    function d(s) {
      s.done ? a(s.value) : i(s.value).then(l, u);
    }
    d((r = r.apply(e, t || [])).next());
  });
}, He = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1) throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, o;
  return o = { next: l(0), throw: l(1), return: l(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function l(d) {
    return function(s) {
      return u([d, s]);
    };
  }
  function u(d) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; o && (o = 0, d[0] && (n = 0)), n; ) try {
      if (r = 1, i && (a = d[0] & 2 ? i.return : d[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, d[1])).done) return a;
      switch (i = 0, a && (d = [d[0] & 2, a.value]), d[0]) {
        case 0:
        case 1:
          a = d;
          break;
        case 4:
          return n.label++, { value: d[1], done: !1 };
        case 5:
          n.label++, i = d[1], d = [0];
          continue;
        case 7:
          d = n.ops.pop(), n.trys.pop();
          continue;
        default:
          if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (d[0] === 6 || d[0] === 2)) {
            n = 0;
            continue;
          }
          if (d[0] === 3 && (!a || d[1] > a[0] && d[1] < a[3])) {
            n.label = d[1];
            break;
          }
          if (d[0] === 6 && n.label < a[1]) {
            n.label = a[1], a = d;
            break;
          }
          if (a && n.label < a[2]) {
            n.label = a[2], n.ops.push(d);
            break;
          }
          a[2] && n.ops.pop(), n.trys.pop();
          continue;
      }
      d = t.call(e, n);
    } catch (s) {
      d = [6, s], i = 0;
    } finally {
      r = a = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
  }
}, rn = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, Tn = he(null), pt = function() {
  return De(Tn);
}, Sn = function(e, t, n) {
  return Ue(void 0, void 0, void 0, function() {
    var r, i, a, o, l, u, d;
    return He(this, function(s) {
      for (r = function(v) {
        Pn(function() {
          var f;
          return !!(!((f = t.current) === null || f === void 0) && f[v]);
        }).then(function() {
          var f, m = (f = t.current) === null || f === void 0 ? void 0 : f[v];
          m?.isFolder && (n(m), Sn(v, t, n));
        });
      }, i = 0, a = (d = (u = (l = t.current) === null || l === void 0 ? void 0 : l[e]) === null || u === void 0 ? void 0 : u.children) !== null && d !== void 0 ? d : []; i < a.length; i++)
        o = a[i], r(o);
      return [
        2
        /*return*/
      ];
    });
  });
}, ht = Be(function(e, t) {
  var n = z(), r = n.onCollapseItem, i = n.items, a = n.trees, o = n.viewState, l = n.onExpandItem, u = n.onFocusItem, d = n.setActiveTree, s = n.onRenameItem, v = n.onSelectItems, f = n.onPrimaryAction, m = n.linearItems, h = de(), b = h.abortProgrammaticDrag, p = h.completeProgrammaticDrag, g = h.programmaticDragDown, I = h.programmaticDragUp, D = h.startProgrammaticDrag, S = Fe(i), E = R(function(y, k) {
    r?.(i[y], k);
  }, [i, r]), B = R(function(y, k) {
    l?.(i[y], k);
  }, [i, l]), G = R(function(y, k, _) {
    _ === void 0 && (_ = !0), u?.(i[y], k, _);
  }, [i, u]), q = R(function(y, k) {
    k === void 0 && (k = !0), d(y, k);
  }, [d]), H = R(function(y) {
    var k = m[y], _ = k.findIndex(function(T) {
      var M, w = T.item;
      return w === ((M = o[y]) === null || M === void 0 ? void 0 : M.focusedItem);
    }), C = _ !== void 0 ? Math.min(k.length - 1, _ + 1) : 0, x = i[k[C].item];
    u?.(x, y);
  }, [i, m, u, o]), te = R(function(y) {
    var k = m[y], _ = k.findIndex(function(T) {
      var M, w = T.item;
      return w === ((M = o[y]) === null || M === void 0 ? void 0 : M.focusedItem);
    }), C = _ !== void 0 ? Math.max(0, _ - 1) : 0, x = i[k[C].item];
    u?.(x, y);
  }, [i, m, u, o]), Z = R(function(y, k, _) {
    s?.(i[y], k, _);
  }, [i, s]), ee = R(function(y, k) {
    v?.(y, k);
  }, [v]), O = R(function(y, k) {
    var _, C;
    !((C = (_ = o[k]) === null || _ === void 0 ? void 0 : _.expandedItems) === null || C === void 0) && C.includes(y) ? r?.(i[y], k) : l?.(i[y], k);
  }, [i, r, l, o]), N = R(function(y, k) {
    var _, C, x, T, M;
    !((C = (_ = o[k]) === null || _ === void 0 ? void 0 : _.selectedItems) === null || C === void 0) && C.includes(y) ? v?.((T = (x = o[k].selectedItems) === null || x === void 0 ? void 0 : x.filter(function(w) {
      return w !== y;
    })) !== null && T !== void 0 ? T : [], k) : v?.(rn(rn([], (M = o[k].selectedItems) !== null && M !== void 0 ? M : [], !0), [y], !1), k);
  }, [v, o]), L = R(function(y, k) {
    f?.(i[y], k);
  }, [i, f]), F = R(function(y, k) {
    return Ue(void 0, void 0, void 0, function() {
      var _, C;
      return He(this, function(x) {
        switch (x.label) {
          case 0:
            return _ = k[0], C = k.slice(1), [4, Pn(function() {
              var T;
              return !!(!((T = S.current) === null || T === void 0) && T[_]);
            }).then(function() {
              var T = S.current[_];
              return T ? (l?.(T, y), C.length > 0 ? F(y, C) : Promise.resolve()) : Promise.resolve();
            })];
          case 1:
            return x.sent(), [
              2
              /*return*/
            ];
        }
      });
    });
  }, [S, l]), X = R(function(y) {
    return Ue(void 0, void 0, void 0, function() {
      return He(this, function(k) {
        switch (k.label) {
          case 0:
            return [4, Sn(a[y].rootItem, S, function(_) {
              return l?.(_, y);
            })];
          case 1:
            return k.sent(), [
              2
              /*return*/
            ];
        }
      });
    });
  }, [S, l, a]), V = R(function(y) {
    for (var k, _, C = 0, x = (_ = (k = o[y]) === null || k === void 0 ? void 0 : k.expandedItems) !== null && _ !== void 0 ? _ : []; C < x.length; C++) {
      var T = x[C];
      r?.(i[T], y);
    }
  }, [i, r, o]), U = W(function() {
    return {
      collapseItem: E,
      expandItem: B,
      focusItem: G,
      focusTree: q,
      moveFocusDown: H,
      moveFocusUp: te,
      renameItem: Z,
      selectItems: ee,
      toggleItemExpandedState: O,
      toggleItemSelectStatus: N,
      invokePrimaryAction: L,
      expandAll: X,
      expandSubsequently: F,
      collapseAll: V,
      abortProgrammaticDrag: b,
      completeProgrammaticDrag: p,
      moveProgrammaticDragPositionDown: g,
      moveProgrammaticDragPositionUp: I,
      startProgrammaticDrag: D
    };
  }, [
    E,
    B,
    G,
    q,
    H,
    te,
    Z,
    ee,
    O,
    N,
    L,
    X,
    F,
    V,
    b,
    p,
    g,
    I,
    D
  ]);
  return gt(t, U), K(Tn.Provider, { value: U }, e.children);
}), It = function(e) {
  var t, n, r, i;
  if (e)
    if (e.scrollIntoViewIfNeeded)
      e.scrollIntoViewIfNeeded();
    else {
      var a = e.getBoundingClientRect(), o = a.top >= 0 && a.left >= 0 && a.bottom <= (window.innerHeight || !!(!((n = (t = ae()) === null || t === void 0 ? void 0 : t.documentElement) === null || n === void 0) && n.clientHeight)) && a.right <= (window.innerWidth || !!(!((i = (r = ae()) === null || r === void 0 ? void 0 : r.documentElement) === null || i === void 0) && i.clientWidth));
      o || e.scrollIntoView();
    }
}, ne = function() {
  return ne = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, ne.apply(this, arguments);
}, ce = function() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  return e.filter(function(n) {
    return !!n;
  }).join(" ");
}, wt = function(e, t) {
  return {
    renderItemTitle: function(n) {
      var r = n.title, i = n.context, a = n.info;
      if (!a.isSearching || !i.isSearchMatching)
        return r;
      var o = r.toLowerCase().indexOf(a.search.toLowerCase());
      return j.createElement(
        j.Fragment,
        null,
        o > 0 && j.createElement("span", null, r.slice(0, o)),
        j.createElement("span", { className: "rct-tree-item-search-highlight" }, r.slice(o, o + a.search.length)),
        o + a.search.length < r.length && j.createElement("span", null, r.slice(o + a.search.length, r.length))
      );
    },
    renderItemArrow: function(n) {
      var r = n.item, i = n.context;
      return (
        // Icons from https://blueprintjs.com/docs/#icons
        j.createElement("div", ne({ className: ce(r.isFolder && "rct-tree-item-arrow-isFolder", i.isExpanded && "rct-tree-item-arrow-expanded", "rct-tree-item-arrow") }, i.arrowProps), r.isFolder && (i.isExpanded ? j.createElement(
          "svg",
          { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 16 16", enableBackground: "new 0 0 16 16", xmlSpace: "preserve" },
          j.createElement(
            "g",
            null,
            j.createElement(
              "g",
              null,
              j.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z", className: "rct-tree-item-arrow-path" })
            )
          )
        ) : j.createElement(
          "svg",
          { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 16 16", enableBackground: "new 0 0 16 16", xmlSpace: "preserve" },
          j.createElement(
            "g",
            null,
            j.createElement(
              "g",
              null,
              j.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z", className: "rct-tree-item-arrow-path" })
            )
          )
        )))
      );
    },
    renderItem: function(n) {
      var r = n.item, i = n.depth, a = n.children, o = n.title, l = n.context, u = n.arrow, d = l.isRenaming ? "div" : "button", s = l.isRenaming ? void 0 : "button";
      return j.createElement(
        "li",
        ne({}, l.itemContainerWithChildrenProps, { className: ce("rct-tree-item-li", r.isFolder && "rct-tree-item-li-isFolder", l.isSelected && "rct-tree-item-li-selected", l.isExpanded && "rct-tree-item-li-expanded", l.isFocused && "rct-tree-item-li-focused", l.isDraggingOver && "rct-tree-item-li-dragging-over", l.isSearchMatching && "rct-tree-item-li-search-match") }),
        j.createElement(
          "div",
          ne({}, l.itemContainerWithoutChildrenProps, { style: { "--depthOffset": "".concat((i + 1) * e, "px") }, className: ce("rct-tree-item-title-container", r.isFolder && "rct-tree-item-title-container-isFolder", l.isSelected && "rct-tree-item-title-container-selected", l.isExpanded && "rct-tree-item-title-container-expanded", l.isFocused && "rct-tree-item-title-container-focused", l.isDraggingOver && "rct-tree-item-title-container-dragging-over", l.isSearchMatching && "rct-tree-item-title-container-search-match") }),
          u,
          j.createElement(d, ne({ type: s }, l.interactiveElementProps, { className: ce("rct-tree-item-button", r.isFolder && "rct-tree-item-button-isFolder", l.isSelected && "rct-tree-item-button-selected", l.isExpanded && "rct-tree-item-button-expanded", l.isFocused && "rct-tree-item-button-focused", l.isDraggingOver && "rct-tree-item-button-dragging-over", l.isSearchMatching && "rct-tree-item-button-search-match") }), o)
        ),
        a
      );
    },
    renderRenameInput: function(n) {
      var r = n.inputProps, i = n.inputRef, a = n.submitButtonProps, o = n.submitButtonRef, l = n.formProps;
      return j.createElement(
        "form",
        ne({}, l, { className: "rct-tree-item-renaming-form" }),
        j.createElement("input", ne({}, r, { ref: i, className: "rct-tree-item-renaming-input" })),
        j.createElement("input", ne({}, a, { ref: o, type: "submit", className: "rct-tree-item-renaming-submit-button", value: "🗸" }))
      );
    },
    renderTreeContainer: function(n) {
      var r = n.children, i = n.containerProps, a = n.info;
      return j.createElement(
        "div",
        { className: ce("rct-tree-root", a.isFocused && "rct-tree-root-focus", a.isRenaming && "rct-tree-root-renaming", a.areItemsSelected && "rct-tree-root-itemsselected", t) },
        j.createElement("div", ne({}, i, { style: ne({ minHeight: "30px" }, i.style) }), r)
      );
    },
    renderItemsContainer: function(n) {
      var r = n.children, i = n.containerProps;
      return j.createElement("ul", ne({}, i, { className: "rct-tree-items-container" }), r);
    },
    renderDragBetweenLine: function(n) {
      var r = n.draggingPosition, i = n.lineProps;
      return j.createElement("div", ne({}, i, { style: { left: "".concat(r.depth * e, "px") }, className: ce("rct-tree-drag-between-line", r.targetType === "between-items" && r.linePosition === "top" && "rct-tree-drag-between-line-top", r.targetType === "between-items" && r.linePosition === "bottom" && "rct-tree-drag-between-line-bottom") }));
    },
    renderSearchInput: function(n) {
      var r = n.inputProps;
      return j.createElement(
        "div",
        { className: ce("rct-tree-search-input-container") },
        j.createElement("span", { className: "rct-tree-input-icon" }),
        j.createElement("input", ne({}, r, { className: ce("rct-tree-search-input") }))
      );
    },
    renderLiveDescriptorContainer: function(n) {
      var r = n.tree, i = n.children;
      return j.createElement("div", { id: "rct-livedescription-".concat(r.treeId), style: {
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: "1px",
        overflow: "hidden",
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px"
      } }, i);
    },
    renderDepthOffset: e
  };
}, bt = function(e) {
  var t = e.renderItem, n = e.renderItemTitle, r = e.renderItemArrow, i = e.renderRenameInput, a = e.renderItemsContainer, o = e.renderTreeContainer, l = e.renderDragBetweenLine, u = e.renderSearchInput, d = e.renderLiveDescriptorContainer, s = e.renderDepthOffset, v = W(function() {
    return wt(s ?? 10);
  }, [s]), f = {
    renderItem: t,
    renderItemTitle: n,
    renderItemArrow: r,
    renderRenameInput: i,
    renderItemsContainer: a,
    renderTreeContainer: o,
    renderDragBetweenLine: l,
    renderSearchInput: u,
    renderLiveDescriptorContainer: d,
    renderDepthOffset: s
  }, m = Object.entries(v).reduce(function(h, b) {
    var p = b[0], g = b[1], I = p;
    return f[I] ? h[I] = f[I] : h[I] = g, h;
  }, {});
  return m.renderItem.displayName = "RenderItem", m.renderItemTitle.displayName = "RenderItemTitle", m.renderItemArrow.displayName = "RenderItemArrow", m.renderRenameInput.displayName = "RenderRenameInput", m.renderItemsContainer.displayName = "RenderItemsContainer", m.renderTreeContainer.displayName = "RenderTreeContainer", m.renderDragBetweenLine.displayName = "RenderDragBetweenLine", m.renderSearchInput.displayName = "RenderSearchInput", m;
}, Ze = function(e, t, n, r) {
  var i, a, o;
  r === void 0 && (r = 0);
  for (var l = [], u = 0, d = (a = (i = n[e]) === null || i === void 0 ? void 0 : i.children) !== null && a !== void 0 ? a : []; u < d.length; u++) {
    var s = d[u], v = n[s];
    l.push({ item: s, depth: r }), v && v.isFolder && v.children && (!((o = t.expandedItems) === null || o === void 0) && o.includes(s)) && l.push.apply(l, Ze(s, t, n, r + 1));
  }
  return l;
}, ue = function() {
  return ue = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, ue.apply(this, arguments);
}, _t = function(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
}, yt = function(e) {
  var t = e.onExpandItem, n = e.onCollapseItem, r = e.onDrop, i = _t(e, ["onExpandItem", "onCollapseItem", "onDrop"]), a = $({}), o = a[0], l = a[1], u = $(), d = u[0], s = u[1], v = W(function() {
    return Object.keys(o);
  }, [o]), f = i.onFocusItem, m = i.autoFocus, h = i.onRegisterTree, b = i.onUnregisterTree, p = i.items, g = i.viewState, I = Fe(f), D = Fe(g), S = W(function() {
    return yn(v, function(N) {
      var L;
      return Ze(o[N].rootItem, (L = g[N]) !== null && L !== void 0 ? L : {}, p);
    });
  }, [o, p, v, g]), E = R(function(N, L, F) {
    var X, V, U, y, k, _, C, x, T;
    if (F === void 0 && (F = !0), (m ?? !0) && F) {
      var M = (V = (X = ae()) === null || X === void 0 ? void 0 : X.querySelector('[data-rct-tree="'.concat(L, '"] [data-rct-item-id="').concat(N.index, '"]'))) !== null && V !== void 0 ? V : (U = ae()) === null || U === void 0 ? void 0 : U.querySelector('[data-rct-tree="'.concat(L, '"] [data-rct-item-id]'));
      ((_ = (k = (y = ae()) === null || y === void 0 ? void 0 : y.activeElement) === null || k === void 0 ? void 0 : k.attributes.getNamedItem("data-rct-search-input")) === null || _ === void 0 ? void 0 : _.value) !== "true" ? (C = M?.focus) === null || C === void 0 || C.call(M) : It(M);
    }
    ((x = D.current[L]) === null || x === void 0 ? void 0 : x.focusedItem) !== N.index && ((T = I.current) === null || T === void 0 || T.call(I, N, L));
  }, [m, I, D]), B = R(function(N) {
    l(function(L) {
      var F;
      return ue(ue({}, L), (F = {}, F[N.treeId] = N, F));
    }), h?.(N);
  }, [h]), G = R(function(N) {
    b?.(o[N]), l(function(L) {
      var F = ue({}, L);
      return delete F[N], F;
    });
  }, [b, o]), q = R(function(N, L) {
    n?.(N, L), l(function(F) {
      return F;
    });
  }, [n]), H = R(function(N, L) {
    t?.(N, L), l(function(F) {
      return F;
    });
  }, [t]), te = R(function(N, L) {
    r?.(N, L), l(function(F) {
      return F;
    });
  }, [r]), Z = R(function(N) {
    var L, F, X = (L = ae()) === null || L === void 0 ? void 0 : L.querySelector('[data-rct-tree="'.concat(N, '"] [data-rct-item-focus="true"]'));
    (F = X?.focus) === null || F === void 0 || F.call(X);
  }, []), ee = R(function(N, L) {
    L === void 0 && (L = !0);
    var F = function(V) {
      var U, y;
      L && (m ?? !0) && V && !(!((y = (U = ae()) === null || U === void 0 ? void 0 : U.querySelector('[data-rct-tree="'.concat(V, '"]'))) === null || y === void 0) && y.contains(document.activeElement)) && Z(V);
    };
    if (typeof N == "function")
      s(function(V) {
        var U = N(V);
        return U !== V && F(U), U;
      });
    else {
      var X = N;
      s(X), F(X);
    }
  }, [m, Z]), O = bt(i);
  return ue(ue(ue({}, O), i), { onFocusItem: E, registerTree: B, unregisterTree: G, onExpandItem: H, onCollapseItem: q, onDrop: te, setActiveTree: ee, treeIds: v, trees: o, activeTreeId: d, linearItems: S });
}, Cn = he(null), z = function() {
  return De(Cn);
}, Sr = Be(function(e, t) {
  var n = yt(e), r = e.viewState, i = e.onFocusItem;
  return Y(function() {
    for (var a, o, l, u = 0, d = Object.keys(n.trees); u < d.length; u++) {
      var s = d[u], v = (o = (a = e.items[n.trees[s].rootItem]) === null || a === void 0 ? void 0 : a.children) === null || o === void 0 ? void 0 : o[0], f = v && e.items[v];
      !(!((l = r[s]) === null || l === void 0) && l.focusedItem) && n.trees[s] && f && i?.(f, s, !1);
    }
  }, [n.trees, i, e.items, r]), K(
    Cn.Provider,
    { value: n },
    K(
      st,
      null,
      K(
        ft,
        null,
        K(ht, { ref: t }, e.children)
      )
    )
  );
}), xt = function(e) {
  var t, n = e.treeId, r = de(), i = r.draggingPosition, a = r.itemHeight, o = J().renderers, l = i && i.targetType === "between-items" && i.treeId === n;
  if (!l)
    return null;
  var u = {
    onDragOver: function(d) {
      return d.preventDefault();
    }
    // Allow dropping
  };
  return K("div", { style: {
    position: "absolute",
    left: "0",
    right: "0",
    top: "".concat(((t = i?.linearIndex) !== null && t !== void 0 ? t : 0) * a, "px")
  } }, o.renderDragBetweenLine({
    draggingPosition: i,
    lineProps: u
  }));
}, pe = function(e, t, n) {
  var r = oe(n);
  Y(function() {
    return e ? (e.addEventListener(t, r), function() {
      return e.removeEventListener(t, r);
    }) : function() {
    };
  }, [e, r, t]);
}, Dt = function(e, t, n) {
  var r = $(!1), i = r[0], a = r[1], o = re(!1), l = Ie();
  return pe(e, "focusin", function() {
    i || (a(!0), t?.()), o.current && (o.current = !1);
  }), pe(e, "focusout", function() {
    o.current = !0, l(function() {
      o.current && !e?.contains(document.activeElement) && (n?.(), o.current = !1, a(!1));
    });
  }), i;
}, Ee = function(e, t, n) {
  pe(ae(), "keydown", function(r) {
    n && n && e.toLowerCase() === r.key.toLowerCase() && t(r);
  });
}, an = {
  expandSiblings: ["control+*"],
  moveFocusToFirstItem: ["home"],
  moveFocusToLastItem: ["end"],
  primaryAction: ["enter"],
  renameItem: ["f2"],
  abortRenameItem: ["escape"],
  toggleSelectItem: ["control+ "],
  abortSearch: ["escape", "enter"],
  startSearch: [],
  selectAll: ["control+a"],
  startProgrammaticDnd: ["control+shift+d"],
  completeProgrammaticDnd: ["enter"],
  abortProgrammaticDnd: ["escape"]
}, Oe = function() {
  return Oe = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Oe.apply(this, arguments);
}, En = function() {
  var e = z();
  return W(function() {
    return e.keyboardBindings ? Oe(Oe({}, an), e.keyboardBindings) : an;
  }, [e.keyboardBindings]);
}, kt = ["input", "textarea"], ie = function(e, t, n, r) {
  r === void 0 && (r = !1);
  var i = re([]), a = En(), o = Ie(), l = W(function() {
    return a[e].map(function(u) {
      return u.split("+");
    });
  }, [e, a]);
  pe(ae(), "keydown", function(u) {
    var d;
    if (n !== !1 && !((kt.includes((d = u.target.tagName) === null || d === void 0 ? void 0 : d.toLowerCase()) || u.target.isContentEditable) && !r) && !i.current.includes(u.key)) {
      i.current.push(u.key);
      var s = i.current.map(function(f) {
        return f.toLowerCase();
      }), v = l.map(function(f) {
        return s.map(function(m) {
          return f.includes(m.toLowerCase());
        }).reduce(function(m, h) {
          return m && h;
        }, !0);
      }).reduce(function(f, m) {
        return f || m;
      }, !1);
      v && (i.current.length > 1 || !/^[a-zA-Z\s]$/.test(u.key)) && u.preventDefault();
    }
  }), pe(ae(), "keyup", function(u) {
    if (n !== !1) {
      var d = i.current.map(function(v) {
        return v.toLowerCase();
      }), s = l.map(function(v) {
        return v.map(function(f) {
          return d.includes(f.toLowerCase());
        }).reduce(function(f, m) {
          return f && m;
        }, !0);
      }).reduce(function(v, f) {
        return v || f;
      }, !1);
      s && o(function() {
        return t(u);
      }), i.current = i.current.filter(function(v) {
        return v !== u.key;
      });
    }
  });
}, Pe = function() {
  var e, t = J().treeId, n = z().viewState;
  return (e = n[t]) !== null && e !== void 0 ? e : {};
}, $e = function(e) {
  return z().linearItems[e];
}, Pt = function() {
  var e = J().treeId, t = z(), n = t.onFocusItem, r = t.items, i = $e(e), a = Pe();
  return oe(function(o) {
    var l, u = (l = i.findIndex(function(f) {
      return f.item === a.focusedItem;
    })) !== null && l !== void 0 ? l : 0, d = o(u, i), s = Math.max(0, Math.min(i.length - 1, d)), v = r[i[s].item];
    return n?.(v, e), v;
  });
}, on = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, Tt = function(e) {
  var t = re({
    target: e,
    previous: void 0
  });
  return t.current.target !== e && (t.current.previous = t.current.target, t.current.target = e), t.current.previous;
}, Nn = function(e) {
  var t = Pe(), n = J().treeId, r = $e(n), i = z().onSelectItems, a = Tt(t.focusedItem);
  return R(function(o, l) {
    var u, d;
    l === void 0 && (l = !1);
    var s = o.index, v = function(p, g) {
      var I = on(on([], l ? [] : p, !0), g.filter(function(D) {
        return l || !p.includes(D);
      }), !0);
      i?.(I, n);
    };
    if (t && t.selectedItems && t.selectedItems.length > 0) {
      var f = t.focusedItem === s ? a : t.focusedItem, m = e === "last-focus" ? r.findIndex(function(p) {
        return f === p.item;
      }) : r.findIndex(function(p) {
        var g;
        return (g = t.selectedItems) === null || g === void 0 ? void 0 : g.includes(p.item);
      }), h = r.findIndex(function(p) {
        return p.item === s;
      });
      if (m < h) {
        var b = r.slice(m, h + 1).map(function(p) {
          var g = p.item;
          return g;
        });
        v((u = t.selectedItems) !== null && u !== void 0 ? u : [], b);
      } else {
        var b = r.slice(h, m + 1).map(function(g) {
          var I = g.item;
          return I;
        });
        v((d = t.selectedItems) !== null && d !== void 0 ? d : [], b);
      }
    } else
      i?.([s], n);
  }, [
    t,
    i,
    n,
    e,
    r,
    a
  ]);
}, ln = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, St = function() {
  var e, t = z(), n = J(), r = n.treeId, i = n.setRenamingItem, a = n.setSearch, o = n.renamingItem, l = $e(r), u = de(), d = Pe(), s = Pt(), v = Nn("first-selected"), f = t.activeTreeId === r, m = !!o, h = t.disableArrowKeys, b = !h && f && !m;
  Ee("arrowdown", function(p) {
    if (p.preventDefault(), u.isProgrammaticallyDragging)
      u.programmaticDragDown();
    else {
      var g = s(function(I) {
        return I + 1;
      });
      p.shiftKey && v(g);
    }
  }, b), Ee("arrowup", function(p) {
    if (p.preventDefault(), u.isProgrammaticallyDragging)
      u.programmaticDragUp();
    else {
      var g = s(function(I) {
        return I - 1;
      });
      p.shiftKey && v(g);
    }
  }, b), ie("moveFocusToFirstItem", function(p) {
    p.preventDefault(), s(function() {
      return 0;
    });
  }, f && !u.isProgrammaticallyDragging && !m), ie("moveFocusToLastItem", function(p) {
    p.preventDefault(), s(function(g, I) {
      return I.length - 1;
    });
  }, f && !u.isProgrammaticallyDragging && !m), Ee("arrowright", function(p) {
    p.preventDefault(), s(function(g, I) {
      var D, S, E = t.items[I[g].item];
      if (E.isFolder) {
        if (!((D = d.expandedItems) === null || D === void 0) && D.includes(E.index))
          return g + 1;
        (S = t.onExpandItem) === null || S === void 0 || S.call(t, E, r);
      }
      return g;
    });
  }, b && !u.isProgrammaticallyDragging), Ee("arrowleft", function(p) {
    p.preventDefault(), s(function(g, I) {
      var D, S, E = t.items[I[g].item], B = I[g].depth;
      if (E.isFolder && (!((D = d.expandedItems) === null || D === void 0) && D.includes(E.index)))
        (S = t.onCollapseItem) === null || S === void 0 || S.call(t, E, r);
      else if (B > 0) {
        var G = g;
        for (G; I[G].depth !== B - 1; G -= 1)
          ;
        return G;
      }
      return g;
    });
  }, b && !u.isProgrammaticallyDragging), ie("primaryAction", function(p) {
    var g, I;
    p.preventDefault(), d.focusedItem !== void 0 && ((g = t.onSelectItems) === null || g === void 0 || g.call(t, [d.focusedItem], r), (I = t.onPrimaryAction) === null || I === void 0 || I.call(t, t.items[d.focusedItem], r));
  }, f && !u.isProgrammaticallyDragging && !m), ie("toggleSelectItem", function(p) {
    var g, I, D;
    p.preventDefault(), p.stopPropagation(), d.focusedItem !== void 0 && (d.selectedItems && d.selectedItems.includes(d.focusedItem) ? (g = t.onSelectItems) === null || g === void 0 || g.call(t, d.selectedItems.filter(function(S) {
      return S !== d.focusedItem;
    }), r) : (I = t.onSelectItems) === null || I === void 0 || I.call(t, ln(ln([], (D = d.selectedItems) !== null && D !== void 0 ? D : [], !0), [d.focusedItem], !1), r));
  }, f && !u.isProgrammaticallyDragging && !m), ie("selectAll", function(p) {
    var g;
    p.preventDefault(), (g = t.onSelectItems) === null || g === void 0 || g.call(t, l.map(function(I) {
      var D = I.item;
      return D;
    }), r);
  }, f && !u.isProgrammaticallyDragging && !m), ie("renameItem", function(p) {
    var g;
    if (d.focusedItem !== void 0) {
      p.preventDefault();
      var I = t.items[d.focusedItem];
      I.canRename !== !1 && ((g = t.onStartRenamingItem) === null || g === void 0 || g.call(t, I, r), i(I.index));
    }
  }, f && ((e = t.canRename) !== null && e !== void 0 ? e : !0) && !m), ie("startSearch", function(p) {
    var g, I;
    p.preventDefault(), a(""), (I = (g = document.querySelector('[data-rct-search-input="true"]')) === null || g === void 0 ? void 0 : g.focus) === null || I === void 0 || I.call(g);
  }, f && !u.isProgrammaticallyDragging && !m), ie("startProgrammaticDnd", function(p) {
    p.preventDefault(), u.startProgrammaticDrag();
  }, f && !m), ie("completeProgrammaticDnd", function(p) {
    p.preventDefault(), u.completeProgrammaticDrag();
  }, f && u.isProgrammaticallyDragging && !m), ie("abortProgrammaticDnd", function(p) {
    p.preventDefault(), u.abortProgrammaticDrag();
  }, f && u.isProgrammaticallyDragging && !m);
}, Ln = function(e, t, n) {
  return n.toLowerCase().includes(e.toLowerCase());
}, Ct = function() {
  var e = z(), t = e.doesSearchMatchItem, n = e.items, r = e.getItemTitle, i = e.onFocusItem, a = J(), o = a.search, l = a.treeId, u = $e(l), d = Ie();
  Re(function() {
    o && o.length > 0 && d(function() {
      var s = u.find(function(v) {
        var f = v.item;
        return (t ?? Ln)(o, n[f], r(n[f]));
      });
      s && i?.(n[s.item], l);
    });
  }, [
    t,
    r,
    u,
    n,
    i,
    o,
    l,
    d
  ], [o]);
}, Ge = function() {
  return Ge = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Ge.apply(this, arguments);
}, Et = function(e) {
  var t, n = e.containerRef, r = J(), i = r.search, a = r.setSearch, o = r.treeId, l = r.renderers, u = r.renamingItem, d = z();
  Pe();
  var s = d.activeTreeId === o, v = Ie();
  Ct();
  var f = function() {
    var m, h, b;
    if (a(null), !((m = d.autoFocus) !== null && m !== void 0) || m) {
      var p = (h = ae()) === null || h === void 0 ? void 0 : h.querySelector('[data-rct-tree="'.concat(o, '"] [data-rct-item-focus="true"]'));
      (b = p?.focus) === null || b === void 0 || b.call(p);
    }
  };
  return ie("abortSearch", function() {
    v(function() {
      f();
    });
  }, s && i !== null, !0), pe(n, "keydown", function(m) {
    var h, b, p = m.key.charCodeAt(0);
    (!((h = d.canSearch) !== null && h !== void 0) || h) && (!((b = d.canSearchByStartingTyping) !== null && b !== void 0) || b) && s && i === null && !u && !m.ctrlKey && !m.shiftKey && !m.altKey && !m.metaKey && (p >= 48 && p <= 57 || // number
    // (unicode >= 65 && unicode <= 90) || // uppercase letter
    p >= 97 && p <= 122) && a("");
  }), !(!((t = d.canSearch) !== null && t !== void 0) || t) || i === null ? null : l.renderSearchInput({
    inputProps: Ge({ value: i, onChange: function(m) {
      return a(m.target.value);
    }, onBlur: function() {
      f();
    }, ref: function(m) {
      var h;
      (h = m?.focus) === null || h === void 0 || h.call(m);
    }, "aria-label": "Search for items" }, {
      "data-rct-search-input": "true"
    })
  });
}, Nt = {
  introduction: `
    <p>Accessibility guide for tree {treeLabel}.</p>
    <p>
      Navigate the tree with the arrow keys. Common tree hotkeys apply. Further keybindings are available:
    </p>
    <ul>
      <li>{keybinding:primaryAction} to execute primary action on focused item</li>
      <li>{keybinding:renameItem} to start renaming the focused item</li>
      <li>{keybinding:abortRenameItem} to abort renaming an item</li>
      <li>{keybinding:startProgrammaticDnd} to start dragging selected items</li>
    </ul>
  `,
  renamingItem: `
    <p>Renaming the item {renamingItem}.</p>
    <p>Use the keybinding {keybinding:abortRenameItem} to abort renaming.</p>
  `,
  searching: `
    <p>Searching</p>
  `,
  programmaticallyDragging: `
    <p>Dragging items {dragItems}.</p>
    <p>Press the arrow keys to move the drag target.</p>
    <p>Press {keybinding:completeProgrammaticDnd} to drop or {keybinding:abortProgrammaticDnd} to abort.</p>
  `,
  programmaticallyDraggingTarget: `
    <p>Drop target is {dropTarget}.</p>
  `
}, we = function(e, t, n, r, i) {
  var a = function(o) {
    return t.getItemTitle(t.items[o]);
  };
  return e.replace(/({[^\s}]+)}/g, function(o) {
    var l, u, d, s = o.slice(1, -1);
    switch (s) {
      case "treeLabel":
        return (l = r.treeLabel) !== null && l !== void 0 ? l : "";
      case "renamingItem":
        return r.renamingItem ? a(r.renamingItem) : "None";
      case "dragItems":
        return (d = (u = n.draggingItems) === null || u === void 0 ? void 0 : u.map(function(m) {
          return t.getItemTitle(m);
        }).join(", ")) !== null && d !== void 0 ? d : "None";
      case "dropTarget": {
        if (!n.draggingPosition)
          return "None";
        if (n.draggingPosition.targetType === "item" || n.draggingPosition.targetType === "root")
          return "within ".concat(a(n.draggingPosition.targetItem));
        var v = t.items[n.draggingPosition.parentItem], f = t.getItemTitle(v);
        return n.draggingPosition.childIndex === 0 ? "within ".concat(f, " at the start") : "within ".concat(f, " after ").concat(a(v.children[n.draggingPosition.childIndex - 1]));
      }
      default:
        if (s.startsWith("keybinding:"))
          return i[s.slice(11)][0];
        throw Error("Unknown live descriptor variable {".concat(s, "}"));
    }
  });
}, be = function(e) {
  var t = e.children, n = e.live;
  return K("div", { "aria-live": n, dangerouslySetInnerHTML: { __html: t } });
}, Lt = function() {
  var e = z(), t = J(), n = de(), r = En(), i = W(function() {
    var o;
    return (o = e.liveDescriptors) !== null && o !== void 0 ? o : Nt;
  }, [e.liveDescriptors]), a = t.renderers.renderLiveDescriptorContainer;
  return t.treeInformation.isRenaming ? K(
    a,
    { tree: t },
    K(be, { live: "polite" }, we(i.renamingItem, e, n, t, r))
  ) : t.treeInformation.isSearching ? K(
    a,
    { tree: t },
    K(be, { live: "polite" }, we(i.searching, e, n, t, r))
  ) : t.treeInformation.isProgrammaticallyDragging ? K(
    a,
    { tree: t },
    K(be, { live: "polite" }, we(i.programmaticallyDragging, e, n, t, r)),
    K(be, { live: "assertive" }, we(i.programmaticallyDraggingTarget, e, n, t, r))
  ) : K(
    a,
    { tree: t },
    K(be, { live: "off" }, we(i.introduction, e, n, t, r))
  );
}, Rt = function() {
  var e, t = z();
  return !((e = t.showLiveDescription) !== null && e !== void 0) || e ? K(Lt, null) : null;
}, Ve = function() {
  return Ve = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Ve.apply(this, arguments);
}, At = function() {
  var e = J(), t = e.treeId, n = e.rootItem, r = e.renderers, i = e.treeInformation, a = z(), o = re(), l = de();
  St(), Dt(o.current, function() {
    a.setActiveTree(t);
  }, function() {
    a.setActiveTree(function(v) {
      return v === t ? void 0 : v;
    });
  });
  var u = a.items[n].children, d = K(
    Hn,
    null,
    K(Rt, null),
    K(An, { depth: 0, parentId: n }, u ?? []),
    K(xt, { treeId: t }),
    K(Et, { containerRef: o.current })
  ), s = Ve({ onDragOver: function(v) {
    v.preventDefault(), l.onDragOverTreeHandler(v, t, o);
  }, onDragLeave: function(v) {
    l.onDragLeaveContainerHandler(v, o);
  }, onMouseDown: function() {
    return l.abortProgrammaticDrag();
  }, ref: o, style: { position: "relative" }, role: "tree", "aria-label": i.treeLabelledBy ? void 0 : i.treeLabel, "aria-labelledby": i.treeLabelledBy }, {
    "data-rct-tree": t
  });
  return r.renderTreeContainer({
    children: d,
    info: i,
    containerProps: s
  });
}, Ft = function(e, t, n) {
  var r, i = z(), a = de(), o = (r = i.viewState[e.treeId]) === null || r === void 0 ? void 0 : r.selectedItems;
  return W(function() {
    var l, u;
    return {
      isFocused: i.activeTreeId === e.treeId,
      isRenaming: !!t,
      areItemsSelected: ((l = o?.length) !== null && l !== void 0 ? l : 0) > 0,
      isSearching: n !== null,
      search: n,
      isProgrammaticallyDragging: (u = a.isProgrammaticallyDragging) !== null && u !== void 0 ? u : !1,
      treeId: e.treeId,
      rootItem: e.rootItem,
      treeLabel: e.treeLabel,
      treeLabelledBy: e.treeLabelledBy
    };
  }, [
    i.activeTreeId,
    e.treeId,
    e.rootItem,
    e.treeLabel,
    e.treeLabelledBy,
    t,
    o?.length,
    n,
    a.isProgrammaticallyDragging
  ]);
}, xe = function() {
  return xe = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, xe.apply(this, arguments);
}, Ot = function(e, t) {
  var n = z(), r = J(), i = de();
  mn(e, function() {
    return xe(xe(xe({}, t), { treeEnvironmentContext: n, dragAndDropContext: i, treeContext: r }), r.treeInformation);
  });
}, Mt = he(null), Bt = Be(function(e, t) {
  z();
  var n = J();
  de();
  var r = pt(), i = W(function() {
    return {
      abortRenamingItem: function() {
        n.setRenamingItem(null);
      },
      abortSearch: function() {
        n.setSearch(null);
      },
      collapseItem: function(a) {
        r.collapseItem(a, n.treeId);
      },
      completeRenamingItem: function() {
      },
      expandItem: function(a) {
        r.expandItem(a, n.treeId);
      },
      focusItem: function(a, o) {
        o === void 0 && (o = !0), r.focusItem(a, n.treeId, o);
      },
      focusTree: function(a) {
        a === void 0 && (a = !0), r.focusTree(n.treeId, a);
      },
      invokePrimaryAction: function(a) {
        r.invokePrimaryAction(a, n.treeId);
      },
      moveFocusDown: function() {
        r.moveFocusDown(n.treeId);
      },
      moveFocusUp: function() {
        r.moveFocusUp(n.treeId);
      },
      renameItem: function(a, o) {
        r.renameItem(a, o, n.treeId);
      },
      selectItems: function(a) {
        r.selectItems(a, n.treeId);
      },
      setSearch: function(a) {
        n.setSearch(a);
      },
      startRenamingItem: function(a) {
        n.setRenamingItem(a);
      },
      stopRenamingItem: function() {
        n.setRenamingItem(null);
      },
      toggleItemExpandedState: function(a) {
        r.toggleItemExpandedState(a, n.treeId);
      },
      toggleItemSelectStatus: function(a) {
        r.toggleItemSelectStatus(a, n.treeId);
      },
      expandAll: function() {
        r.expandAll(n.treeId);
      },
      collapseAll: function() {
        r.collapseAll(n.treeId);
      },
      expandSubsequently: function(a) {
        return r.expandSubsequently(n.treeId, a);
      }
    };
  }, [r, n]);
  return Ot(t, i), K(Mt.Provider, { value: i }, e.children);
}), Me = function() {
  return Me = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Me.apply(this, arguments);
}, Rn = he(null), J = function() {
  return De(Rn);
}, Cr = Be(function(e, t) {
  var n, r = z(), i = W(function() {
    return Me(Me({}, r), e);
  }, [e, r]), a = $(null), o = a[0], l = a[1], u = $(null), d = u[0], s = u[1], v = r.items[e.rootItem], f = r.viewState[e.treeId];
  Y(function() {
    return r.registerTree({
      treeId: e.treeId,
      rootItem: e.rootItem
    }), function() {
      return r.unregisterTree(e.treeId);
    };
  }, [e.treeId, e.rootItem]);
  var m = Ft(e, d, o), h = W(function() {
    return {
      treeId: e.treeId,
      rootItem: e.rootItem,
      treeLabel: e.treeLabel,
      treeLabelledBy: e.treeLabelledBy,
      getItemsLinearly: function() {
        return Ze(e.rootItem, f ?? {}, r.items);
      },
      treeInformation: m,
      search: o,
      setSearch: l,
      renamingItem: d,
      setRenamingItem: s,
      renderers: i
    };
  }, [
    r.items,
    e.rootItem,
    e.treeId,
    e.treeLabel,
    e.treeLabelledBy,
    d,
    i,
    o,
    m,
    f
  ]);
  return v === void 0 ? ((n = r.onMissingItems) === null || n === void 0 || n.call(r, [e.rootItem]), null) : K(
    Rn.Provider,
    { value: h },
    K(
      Bt,
      { ref: t },
      K(At, null)
    )
  );
}), An = function(e) {
  for (var t = J(), n = t.renderers, r = t.treeInformation, i = [], a = 0, o = e.children; a < o.length; a++) {
    var l = o[a];
    i.push(j.createElement(Kt, { key: l, itemIndex: l, depth: e.depth }));
  }
  if (i.length === 0)
    return null;
  var u = {
    role: e.depth !== 0 ? "group" : void 0
  };
  return n.renderItemsContainer({
    children: i,
    info: r,
    containerProps: u,
    depth: e.depth,
    parentId: e.parentId
  });
}, ve = function() {
  return ve = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, ve.apply(this, arguments);
}, dn = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, $t = function(e) {
  var t, n, r, i, a = J(), o = a.treeId, l = a.search, u = a.renamingItem, d = a.setRenamingItem, s = z(), v = dt(), f = de(), m = Nn("last-focus"), h = e && s.getItemTitle(e), b = xn(), p = W(function() {
    var S;
    return l === null || l.length === 0 || !e || !h ? !1 : ((S = s.doesSearchMatchItem) !== null && S !== void 0 ? S : Ln)(l, e, h);
  }, [l, e, h, s.doesSearchMatchItem]), g = e && ((n = (t = s.viewState[o]) === null || t === void 0 ? void 0 : t.selectedItems) === null || n === void 0 ? void 0 : n.includes(e.index)), I = e && ((i = (r = s.viewState[o]) === null || r === void 0 ? void 0 : r.expandedItems) === null || i === void 0 ? void 0 : i.includes(e.index)), D = e && u === e.index;
  return W(function() {
    var S, E, B, G, q, H, te, Z, ee;
    if (e) {
      var O = s.viewState[o], N = ((E = (S = O?.selectedItems) === null || S === void 0 ? void 0 : S.map(function(w) {
        return s.items[w];
      })) !== null && E !== void 0 ? E : O?.focusedItem ? [s.items[O?.focusedItem]] : []).filter(function(w) {
        return !!w;
      }), L = !!N.find(function(w) {
        return w.index === e.index;
      }), F = N && ((G = (B = s.canDrag) === null || B === void 0 ? void 0 : B.call(s, N)) !== null && G !== void 0 ? G : !0) && N.map(function(w) {
        var A;
        return (A = w.canMove) !== null && A !== void 0 ? A : !0;
      }).reduce(function(w, A) {
        return w && A;
      }, !0), X = ((H = (q = s.canDrag) === null || q === void 0 ? void 0 : q.call(s, [e])) !== null && H !== void 0 ? H : !0) && ((te = e.canMove) !== null && te !== void 0 ? te : !0), V = s.canDragAndDrop && (L && F || !L && X), U = s.canDragAndDrop && !!(!((ee = (Z = f.viableDragPositions) === null || Z === void 0 ? void 0 : Z[o]) === null || ee === void 0) && ee.find(function(w) {
        return w.targetType === "item" && w.targetItem === e.index;
      })), y = {
        // TODO disable most actions during rename
        primaryAction: function() {
          var w;
          (w = s.onPrimaryAction) === null || w === void 0 || w.call(s, s.items[e.index], o);
        },
        collapseItem: function() {
          var w;
          (w = s.onCollapseItem) === null || w === void 0 || w.call(s, e, o);
        },
        expandItem: function() {
          var w;
          (w = s.onExpandItem) === null || w === void 0 || w.call(s, e, o);
        },
        toggleExpandedState: function() {
          var w, A;
          I ? (w = s.onCollapseItem) === null || w === void 0 || w.call(s, e, o) : (A = s.onExpandItem) === null || A === void 0 || A.call(s, e, o);
        },
        selectItem: function() {
          var w;
          (w = s.onSelectItems) === null || w === void 0 || w.call(s, [e.index], o);
        },
        addToSelectedItems: function() {
          var w, A;
          (w = s.onSelectItems) === null || w === void 0 || w.call(s, dn(dn([], (A = O?.selectedItems) !== null && A !== void 0 ? A : [], !0), [e.index], !1), o);
        },
        unselectItem: function() {
          var w, A, le;
          (w = s.onSelectItems) === null || w === void 0 || w.call(s, (le = (A = O?.selectedItems) === null || A === void 0 ? void 0 : A.filter(function(me) {
            return me !== e.index;
          })) !== null && le !== void 0 ? le : [], o);
        },
        selectUpTo: function(w) {
          m(e, w);
        },
        startRenamingItem: function() {
          d(e.index);
        },
        stopRenamingItem: function() {
          d(null);
        },
        focusItem: function(w) {
          var A;
          w === void 0 && (w = !0), (A = s.onFocusItem) === null || A === void 0 || A.call(s, e, o, w);
        },
        startDragging: function() {
          var w, A, le = (w = O?.selectedItems) !== null && w !== void 0 ? w : [];
          if (le.includes(e.index) || (le = [e.index], (A = s.onSelectItems) === null || A === void 0 || A.call(s, le, o)), V) {
            var me = b(o, le.map(function(Un) {
              return s.items[Un];
            }));
            f.onStartDraggingItems(me, o);
          }
        }
      }, k = {
        isSelected: g,
        isExpanded: I,
        isFocused: O?.focusedItem === e.index,
        isRenaming: D,
        isDraggingOver: f.draggingPosition && f.draggingPosition.targetType === "item" && f.draggingPosition.targetItem === e.index && f.draggingPosition.treeId === o,
        isDraggingOverParent: !1,
        isSearchMatching: p,
        canDrag: V,
        canDropOn: U
      }, _ = ve(ve({}, v.createInteractiveElementProps(e, o, y, k, O)), {
        "data-rct-item-interactive": !0,
        "data-rct-item-focus": k.isFocused ? "true" : "false",
        "data-rct-item-id": e.index
      }), C = ve({}, {
        "data-rct-item-container": "true"
      }), x = {
        role: "treeitem",
        "aria-selected": k.isSelected,
        "aria-expanded": e.isFolder ? k.isExpanded ? "true" : "false" : void 0
      }, T = {
        onClick: function() {
          e.isFolder && y.toggleExpandedState(), y.selectItem();
        },
        onFocus: function() {
          y.focusItem();
        },
        onDragOver: function(w) {
          w.preventDefault();
        },
        "aria-hidden": !0,
        tabIndex: -1
      }, M = O ? Object.entries(O).reduce(function(w, A) {
        var le = A[0], me = A[1];
        return w[le] = Array.isArray(me) ? me.includes(e.index) : me === e.index, w;
      }, {}) : {};
      return ve(ve(ve({}, y), k), { interactiveElementProps: _, itemContainerWithChildrenProps: x, itemContainerWithoutChildrenProps: C, arrowProps: T, viewStateFlags: M });
    }
  }, [
    e,
    s,
    o,
    f,
    g,
    I,
    D,
    p,
    v,
    m,
    d,
    b
  ]);
}, jt = function(e) {
  var t = J(), n = t.renderers, r = t.treeInformation, i = t.setRenamingItem, a = t.treeId, o = z(), l = re(null), u = re(null), d = o.items[e.itemIndex], s = $(o.getItemTitle(d)), v = s[0], f = s[1], m = Ie(!0), h = function() {
    var D;
    (D = o.onAbortRenamingItem) === null || D === void 0 || D.call(o, d, r.treeId), i(null), m(function() {
      o.setActiveTree(a);
    });
  }, b = function() {
    var D;
    (D = o.onRenameItem) === null || D === void 0 || D.call(o, d, v, r.treeId), i(null), m(function() {
      o.setActiveTree(a);
    });
  };
  Re(function() {
    var D, S, E, B;
    o.setActiveTree(a), (!((D = o.autoFocus) !== null && D !== void 0) || D) && ((S = l.current) === null || S === void 0 || S.select(), (B = (E = l.current) === null || E === void 0 ? void 0 : E.focus) === null || B === void 0 || B.call(E));
  }, [o, a], []), ie("abortRenameItem", function() {
    h();
  }, !0, !0);
  var p = {
    value: v,
    onChange: function(D) {
      f(D.target.value);
    },
    onBlur: function(D) {
      (!D.relatedTarget || D.relatedTarget !== u.current) && h();
    },
    "aria-label": "New item name",
    tabIndex: 0
  }, g = {
    onClick: function(D) {
      D.stopPropagation(), b();
    }
  }, I = {
    onSubmit: function(D) {
      D.preventDefault(), b();
    }
  };
  return n.renderRenameInput({
    item: d,
    inputRef: l,
    submitButtonProps: g,
    submitButtonRef: u,
    formProps: I,
    inputProps: p
  });
}, Kt = function(e) {
  var t, n, r, i, a = $(!1), o = a[0], l = a[1], u = J(), d = u.renderers, s = u.treeInformation, v = u.renamingItem, f = z(), m = Pe(), h = f.items[e.itemIndex], b = W(function() {
    var B;
    return (B = m.expandedItems) === null || B === void 0 ? void 0 : B.includes(e.itemIndex);
  }, [e.itemIndex, m.expandedItems]), p = $t(h);
  if (h === void 0 || p === void 0)
    return o || (l(!0), (t = f.onMissingItems) === null || t === void 0 || t.call(f, [e.itemIndex])), null;
  var g = (r = (n = f.shouldRenderChildren) === null || n === void 0 ? void 0 : n.call(f, h, p)) !== null && r !== void 0 ? r : h.isFolder && b, I = h.children && g && j.createElement(An, { depth: e.depth + 1, parentId: e.itemIndex }, h.children), D = f.getItemTitle(h), S = v === e.itemIndex ? j.createElement(jt, { itemIndex: e.itemIndex }) : d.renderItemTitle({
    info: s,
    context: p,
    title: D,
    item: h
  }), E = d.renderItemArrow({
    info: s,
    context: p,
    item: f.items[e.itemIndex]
  });
  return (i = d.renderItem({
    item: f.items[e.itemIndex],
    depth: e.depth,
    title: S,
    arrow: E,
    context: p,
    info: s,
    children: I
  })) !== null && i !== void 0 ? i : null;
};
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const qe = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!qe || Object.keys(qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Fn = qe.request;
async function Q(e, t, n) {
  const r = await Fn(e, t, n);
  return Mn(r) ? On(r) : r;
}
function On(e) {
  if (typeof e.code == "number" && e.code !== 0)
    throw new Error(e.msg || e.message || "请求失败");
  if (typeof e.status == "number" && e.status !== 1)
    throw new Error(e.msg || e.message || "请求失败");
  return e.data;
}
function Mn(e) {
  return typeof e == "object" && e !== null && ("data" in e || "code" in e || "status" in e || "msg" in e || "message" in e);
}
function Er(e) {
  return Q(
    "/bot/admin/knowledge/file_manager_data",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID
    }
  );
}
function Nr(e) {
  return Q(
    "/bot/admin/knowledge/file_content",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID,
      id: e.id
    }
  );
}
function Lr(e) {
  return Q(
    "/bot/admin/knowledge/file_index_detail",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID,
      id: e.id
    }
  );
}
function zt(e) {
  return Q(
    "/bot/admin/knowledge/index_overview",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID
    }
  );
}
function Rr(e) {
  return Q(
    "/bot/admin/knowledge/index_status",
    "get",
    { knowledge_base_id: e.knowledgeBaseID }
  );
}
function Ut(e) {
  return Q("/bot/admin/knowledge/tree", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    parent_id: e.parentID || 0,
    depth: e.depth || 4,
    limit: e.limit || 120
  });
}
function Ht(e) {
  return Q("/bot/admin/knowledge/graph", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    limit: e.limit || 180
  });
}
function Gt(e) {
  return Q("/bot/admin/knowledge/node_open", "get", {
    node_id: e.nodeID
  });
}
function Ar(e) {
  return Q("/bot/admin/knowledge/retrieve_debug", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    agent_id: e.agentID || 0,
    query: e.query,
    limit: e.limit || 8
  });
}
function Fr(e) {
  return Q("/bot/admin/knowledge/create_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    parent: e.parent,
    parent_id: e.parent,
    name: e.name,
    type: e.type,
    content_base64: e.contentBase64 || ""
  });
}
async function Or(e) {
  const t = new FormData();
  t.set("knowledge_base_id", String(e.knowledgeBaseID)), t.set("parent", e.parent), t.set("parent_id", e.parent), t.set("name", e.name), t.set("type", "file"), t.set("upload_id", e.uploadID), t.set("part_number", String(e.partNumber)), t.set("total_parts", String(e.totalParts)), t.set("file", e.chunk, e.name);
  const n = await Fn(
    "/bot/admin/knowledge/create_file",
    "post",
    t
  );
  return Mn(n) ? On(n) : n;
}
function Mr(e) {
  return Q("/bot/admin/knowledge/rename_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    id: e.id,
    name: e.name
  });
}
function Br(e) {
  return Q("/bot/admin/knowledge/save_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    id: e.id,
    content: e.content
  });
}
function $r(e) {
  return Q("/bot/admin/knowledge/index_base", "post", {
    knowledge_base_id: e.knowledgeBaseID
  });
}
function jr(e) {
  return Q("/bot/admin/knowledge/review_doc", "post", {
    doc_ids: [e.docID],
    review_status: e.status
  });
}
function Kr(e) {
  return Q("/bot/admin/knowledge/review_docs", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    review_status: e.status || "pending",
    page: e.page || 1,
    pageSize: e.pageSize || 100
  });
}
function zr(e) {
  return Q("/bot/admin/knowledge/set_expiration", "post", {
    doc_ids: [e.docID],
    expires_at: e.expiresAt || ""
  });
}
function Ur(e) {
  return Q("/bot/admin/knowledge/delete_files", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    ids: e.ids
  });
}
function Hr(e) {
  return Q("/bot/admin/knowledge/move_files", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    ids: e.ids,
    target: e.target,
    operation: "move"
  });
}
function Gr(e, t) {
  return `/bot/admin/knowledge/download_file?${new URLSearchParams({
    knowledge_base_id: String(e),
    id: t
  }).toString()}`;
}
function Vr(e, t) {
  return `/bot/admin/knowledge/download_file?${new URLSearchParams({
    knowledge_base_id: String(e),
    id: t,
    preview: "1"
  }).toString()}`;
}
function qr(e, t) {
  const n = t && t !== "/" ? `${t}/` : "";
  return `/bot/admin/knowledge/download_file?knowledge_base_id=${encodeURIComponent(
    String(e)
  )}&id=${encodeURIComponent(n)}`;
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Xe = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Xe || Object.keys(Xe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Vt = Xe.FirstFrameVideo, qt = fn(
  () => import("./protected-2-nodes-show-knowledge-file-manager-code-editor-tsx-BMGNdNVQ.js").then((e) => ({
    default: e.KnowledgeCodeEditor
  }))
), Xt = fn(
  () => import("./protected-1-nodes-show-knowledge-file-manager-markdown-live-editor-tsx-CzIU-3Q4.js").then((e) => ({
    default: e.MarkdownLiveEditor
  }))
);
function Xr({
  active: e,
  file: t,
  content: n,
  downloadURL: r,
  previewURL: i,
  linkBaseURL: a,
  onUploadAttachments: o,
  onAttachmentError: l,
  onStatusChange: u,
  onChange: d
}) {
  const s = t ? rt(t) : null, v = !!(e && t?.editable && s && Wt(s));
  let f = null;
  return v && t ? f = /* @__PURE__ */ c(en, { fallback: /* @__PURE__ */ c(sn, { onStatusChange: u }), children: /* @__PURE__ */ c(
    Xt,
    {
      active: !0,
      value: n,
      linkBaseURL: a,
      onUploadAttachments: o,
      onAttachmentError: l,
      onStatusChange: u,
      onChange: d
    }
  ) }) : e && t && s && (t.editable ? f = /* @__PURE__ */ c(en, { fallback: /* @__PURE__ */ c(sn, { onStatusChange: u }), children: /* @__PURE__ */ c(
    qt,
    {
      file: t,
      content: n,
      kind: s,
      onChange: d
    }
  ) }) : t.editable || (f = /* @__PURE__ */ c(
    Yt,
    {
      file: t,
      kind: s,
      downloadURL: r,
      previewURL: i,
      onStatusChange: u
    }
  ))), f;
}
function Wt(e) {
  return e === "markdown";
}
function sn({
  onStatusChange: e
}) {
  return Te("编辑器加载中", e), /* @__PURE__ */ P("div", { className: "knowledge-file-preview is-centered", "aria-live": "polite", children: [
    /* @__PURE__ */ c(Ne, { size: 42 }),
    /* @__PURE__ */ c("strong", { children: "编辑器加载中" })
  ] });
}
function Yt({
  file: e,
  kind: t,
  downloadURL: n,
  previewURL: r,
  onStatusChange: i
}) {
  return t === "image" ? /* @__PURE__ */ c(
    Qt,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "video" ? /* @__PURE__ */ c(
    Zt,
    {
      file: e,
      downloadURL: n,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "audio" ? /* @__PURE__ */ c(
    Jt,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "pdf" ? /* @__PURE__ */ c(
    er,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : /* @__PURE__ */ P("div", { className: "knowledge-file-preview is-centered", children: [
    nr(t),
    /* @__PURE__ */ c("strong", { children: e.name }),
    /* @__PURE__ */ c("span", { children: tr(t) }),
    /* @__PURE__ */ c("a", { href: n, target: "_blank", rel: "noreferrer", children: "下载文件" })
  ] });
}
function Qt({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = $(!0);
  return Y(() => {
    i(!0);
  }, [t]), Te(r ? "图片加载中" : "", n), /* @__PURE__ */ c("div", { className: "knowledge-file-preview is-media", children: /* @__PURE__ */ c(
    "img",
    {
      src: t,
      alt: e.name,
      className: r ? "is-loading" : "",
      decoding: "async",
      onLoad: () => i(!1),
      onError: () => i(!1)
    }
  ) });
}
function Zt({
  file: e,
  downloadURL: t,
  previewURL: n,
  onStatusChange: r
}) {
  const [i, a] = $(!0), [o, l] = $(!1);
  return Y(() => {
    a(!0), l(!1);
  }, [n]), Te(i ? "视频加载中" : "", r), o ? /* @__PURE__ */ P("div", { className: "knowledge-file-preview is-centered", children: [
    /* @__PURE__ */ c(gn, { size: 42 }),
    /* @__PURE__ */ c("strong", { children: e.name }),
    /* @__PURE__ */ c("span", { children: "当前浏览器无法播放该视频，可能是编码格式不支持。可以下载后查看。" }),
    /* @__PURE__ */ c("a", { href: t, target: "_blank", rel: "noreferrer", children: "下载文件" })
  ] }) : /* @__PURE__ */ c("div", { className: "knowledge-file-preview is-media", children: /* @__PURE__ */ c(
    Vt,
    {
      src: n,
      controls: !0,
      preload: "metadata",
      onFirstFrameReady: () => a(!1),
      onError: () => {
        a(!1), l(!0);
      }
    }
  ) });
}
function Jt({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = $(!0);
  return Y(() => {
    i(!0);
  }, [t]), Te(r ? "音频加载中" : "", n), /* @__PURE__ */ P("div", { className: "knowledge-file-preview is-centered", children: [
    /* @__PURE__ */ c(Vn, { size: 42 }),
    /* @__PURE__ */ c("strong", { children: e.name }),
    /* @__PURE__ */ c(
      "audio",
      {
        src: t,
        controls: !0,
        onLoadedData: () => i(!1),
        onError: () => i(!1)
      }
    )
  ] });
}
function er({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = $(!0);
  return Y(() => {
    i(!0);
  }, [t]), Te(r ? "文件加载中" : "", n), /* @__PURE__ */ c("div", { className: "knowledge-file-preview is-frame", children: /* @__PURE__ */ c("iframe", { src: t, title: e.name, onLoad: () => i(!1) }) });
}
function Te(e, t) {
  Y(() => {
    t(e ? { label: e } : null);
  }, [e, t]), Y(() => () => t(null), [t]);
}
function nr(e) {
  return e === "office" ? /* @__PURE__ */ c(Ne, { size: 42 }) : e === "archive" ? /* @__PURE__ */ c(qn, { size: 42 }) : e === "video" ? /* @__PURE__ */ c(gn, { size: 42 }) : e === "image" ? /* @__PURE__ */ c(Xn, { size: 42 }) : /* @__PURE__ */ c(Ne, { size: 42 });
}
function tr(e) {
  return e === "office" ? "Office 文件当前支持下载和后续索引抽取，在线预览/编辑后续接 ONLYOFFICE。" : e === "archive" ? "压缩包会保留原文件，后续可做批量导入和索引。" : "该文件暂不支持在线编辑，可以下载查看。";
}
const rr = 2400, ir = 4, ar = 500, or = 240;
function Wr({
  knowledgeBaseID: e,
  mode: t,
  open: n,
  onClose: r,
  onRefreshFiles: i
}) {
  const [a, o] = $(null), [l, u] = $([]), [d, s] = $({ nodes: [], edges: [] }), [v, f] = $("tree"), [m, h] = $(""), [b, p] = $("all"), [g, I] = $(0), [D, S] = $(0), [E, B] = $(null), [G, q] = $(() => /* @__PURE__ */ new Set()), [H, te] = $(!1), [Z, ee] = $(!1), [O, N] = $(!1), L = re(!1), F = W(
    () => jn(d, m, b),
    [d, b, m]
  ), X = Number(t) === 1, V = W(() => a ? Se(a.base.index_status) === "running" || a.docs.running > 0 || a.nodes.running > 0 : !1, [a]);
  Y(() => {
    o(null), u([]), s({ nodes: [], edges: [] }), f("tree"), h(""), p("all"), I(0), S(0), B(null), q(/* @__PURE__ */ new Set()), L.current = !1;
  }, [e]);
  const U = R(
    async (x = !1) => {
      if (e) {
        x || te(!0);
        try {
          const [T, M] = await Promise.all([
            zt({ knowledgeBaseID: e }),
            Ut({
              knowledgeBaseID: e,
              depth: ir,
              limit: ar
            })
          ]);
          o(T), u(M.nodes || []), q((w) => L.current || w.size > 0 ? w : new Set(M.nodes.flatMap((A) => We(A)))), L.current = !0, S((w) => w || hr(M.nodes || [])?.id || 0);
        } catch (T) {
          x || Ke.error(ze(T, "加载知识地图失败"));
        } finally {
          x || te(!1);
        }
      }
    },
    [e]
  ), y = R(
    async (x = !1) => {
      if (e) {
        x || ee(!0);
        try {
          const T = await Ht({
            knowledgeBaseID: e,
            limit: or
          });
          s({
            nodes: T.nodes || [],
            edges: T.edges || []
          });
        } catch (T) {
          x || Ke.error(ze(T, "加载关系图谱失败"));
        } finally {
          x || ee(!1);
        }
      }
    },
    [e]
  );
  Y(() => {
    n && U();
  }, [n, U]), Y(() => {
    !n || v !== "graph" || y();
  }, [n, y, v]), Y(() => {
    if (!n || !V)
      return;
    const x = window.setInterval(() => {
      U(!0), v === "graph" && y(!0), i?.();
    }, rr);
    return () => window.clearInterval(x);
  }, [V, i, n, y, U, v]), Y(() => {
    if (!n)
      return;
    const x = (T) => {
      T.key === "Escape" && r();
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [r, n]), Y(() => {
    if (!n || !D) {
      B(null);
      return;
    }
    N(!0), Gt({ nodeID: D }).then(B).catch((x) => Ke.error(ze(x, "加载知识节点失败"))).finally(() => N(!1));
  }, [n, D]);
  const k = R((x) => {
    q((T) => {
      const M = new Set(T);
      return M.has(x) ? M.delete(x) : M.add(x), M;
    });
  }, []), _ = R(() => {
    q(new Set(l.flatMap((x) => We(x))));
  }, [l]), C = R(() => {
    q(/* @__PURE__ */ new Set());
  }, []);
  return n ? /* @__PURE__ */ c(
    "div",
    {
      className: "knowledge-index-map",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "知识地图",
      onMouseDown: (x) => {
        x.target === x.currentTarget && r();
      },
      children: /* @__PURE__ */ P(
        "div",
        {
          className: "knowledge-index-map__panel",
          onMouseDown: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ P("header", { className: "knowledge-index-map__header", children: [
              /* @__PURE__ */ P("div", { children: [
                /* @__PURE__ */ c("strong", { children: "知识地图" }),
                /* @__PURE__ */ c("span", { children: a?.base.name || "查看索引结构、进度和错误状态" })
              ] }),
              /* @__PURE__ */ P("div", { className: "knowledge-index-map__actions", children: [
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      U(), v === "graph" && y(), i?.();
                    },
                    disabled: H || Z,
                    title: "刷新",
                    children: /* @__PURE__ */ c(ke, { size: 16, className: H || Z ? "is-spinning" : "" })
                  }
                ),
                /* @__PURE__ */ c("button", { type: "button", onClick: r, title: "关闭", "aria-label": "关闭知识地图", children: /* @__PURE__ */ c(Wn, { size: 17 }) })
              ] })
            ] }),
            /* @__PURE__ */ P("section", { className: "knowledge-index-map__overview", children: [
              /* @__PURE__ */ c(lr, { overview: a, loading: H }),
              /* @__PURE__ */ c(dr, { stages: a?.stages || [] }),
              /* @__PURE__ */ c(cn, { title: "文档状态", counts: a?.docs }),
              /* @__PURE__ */ c(cn, { title: "节点状态", counts: a?.nodes })
            ] }),
            /* @__PURE__ */ P("main", { className: "knowledge-index-map__content", children: [
              /* @__PURE__ */ P("section", { className: "knowledge-index-map__tree", children: [
                /* @__PURE__ */ P("div", { className: "knowledge-index-map__section-head", children: [
                  /* @__PURE__ */ P("div", { children: [
                    /* @__PURE__ */ c("strong", { children: v === "tree" ? "目录图谱" : "关系图谱" }),
                    /* @__PURE__ */ c("span", { children: v === "tree" ? "目录 → 文档 → 文档目录节点" : "文档节点 → 概念 → 概念关系" })
                  ] }),
                  /* @__PURE__ */ P("div", { className: "knowledge-index-map__section-actions", children: [
                    /* @__PURE__ */ P("div", { className: "knowledge-index-map-search", children: [
                      /* @__PURE__ */ c(Yn, { size: 14 }),
                      /* @__PURE__ */ c(
                        "input",
                        {
                          value: m,
                          onChange: (x) => h(x.target.value),
                          placeholder: "搜索节点"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c(sr, { value: v, onChange: f }),
                    v === "graph" ? /* @__PURE__ */ c(cr, { value: b, onChange: p }) : null,
                    v === "tree" ? /* @__PURE__ */ P(Gn, { children: [
                      /* @__PURE__ */ c("button", { type: "button", onClick: _, children: "展开" }),
                      /* @__PURE__ */ c("button", { type: "button", onClick: C, children: "收起" })
                    ] }) : /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          y();
                        },
                        disabled: Z,
                        children: "刷新"
                      }
                    )
                  ] })
                ] }),
                v === "tree" ? /* @__PURE__ */ c(
                  ur,
                  {
                    loading: H,
                    tree: l,
                    query: m,
                    expandedIDs: G,
                    selectedNodeID: D,
                    onToggle: k,
                    onSelect: S
                  }
                ) : /* @__PURE__ */ c(
                  vr,
                  {
                    graph: d,
                    loading: Z,
                    enhancedMode: X,
                    query: m,
                    typeFilter: b,
                    selectedNodeID: D,
                    selectedEdgeID: g,
                    onSelectNode: S,
                    onSelectEdge: I
                  }
                )
              ] }),
              /* @__PURE__ */ P("aside", { className: "knowledge-index-map__detail", children: [
                /* @__PURE__ */ c(mr, { detail: E, loading: O }),
                /* @__PURE__ */ c(gr, { edge: Ir(F, g), nodes: F.nodes || [] }),
                /* @__PURE__ */ c(fr, { errors: a?.recent_errors || [] })
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
function lr({
  overview: e,
  loading: t
}) {
  const n = Se(e?.base.index_status), r = je(n), i = Ye(e?.progress || 0, 0, 100), a = r.icon;
  return /* @__PURE__ */ P("article", { className: "knowledge-index-map-summary", children: [
    /* @__PURE__ */ P("div", { className: "knowledge-index-map-summary__title", children: [
      /* @__PURE__ */ P("span", { children: [
        /* @__PURE__ */ c(a, { size: 16, className: n === "running" || t ? "is-spinning" : "" }),
        r.label
      ] }),
      /* @__PURE__ */ P("strong", { children: [
        i,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ c("div", { className: "knowledge-index-map-summary__bar", children: /* @__PURE__ */ c("span", { style: { width: `${i}%` } }) }),
    e?.base.error_message ? /* @__PURE__ */ c("p", { className: "knowledge-index-map-summary__error", children: e.base.error_message }) : /* @__PURE__ */ P("p", { children: [
      "已索引 ",
      e?.docs.success || 0,
      " / ",
      e?.docs.total || 0,
      " 个文档"
    ] })
  ] });
}
function cn({
  title: e,
  counts: t
}) {
  return /* @__PURE__ */ P("article", { className: "knowledge-index-map-status", children: [
    /* @__PURE__ */ c("strong", { children: e }),
    /* @__PURE__ */ P("div", { children: [
      /* @__PURE__ */ c(_e, { status: "success", label: "完成", count: t?.success || 0 }),
      /* @__PURE__ */ c(_e, { status: "running", label: "进行中", count: t?.running || 0 }),
      /* @__PURE__ */ c(_e, { status: "pending", label: "待处理", count: t?.pending || 0 }),
      /* @__PURE__ */ c(_e, { status: "failed", label: "失败", count: t?.failed || 0 })
    ] })
  ] });
}
function dr({ stages: e }) {
  const t = e.filter((n) => n.running > 0 || n.failed > 0);
  return /* @__PURE__ */ P("article", { className: "knowledge-index-map-status", children: [
    /* @__PURE__ */ c("strong", { children: "索引阶段" }),
    t.length ? /* @__PURE__ */ c("div", { children: t.map((n) => /* @__PURE__ */ P(
      "span",
      {
        className: `knowledge-index-map-pill ${n.failed > 0 ? "is-failed" : "is-running"}`,
        children: [
          n.label,
          /* @__PURE__ */ c("b", { children: n.failed > 0 ? n.failed : n.running })
        ]
      },
      n.stage
    )) }) : /* @__PURE__ */ c("p", { className: "knowledge-index-map-status__empty", children: "暂无运行中的阶段" })
  ] });
}
function _e({
  status: e,
  label: t,
  count: n
}) {
  const r = je(e), i = r.icon;
  return /* @__PURE__ */ P("span", { className: `knowledge-index-map-pill is-${r.status}`, children: [
    /* @__PURE__ */ c(i, { size: 13 }),
    t,
    /* @__PURE__ */ c("b", { children: n })
  ] });
}
function sr({
  value: e,
  onChange: t
}) {
  return /* @__PURE__ */ c("div", { className: "knowledge-index-map-tabs", role: "tablist", "aria-label": "知识地图视图", children: [
    { value: "tree", label: "目录" },
    { value: "graph", label: "图谱" }
  ].map((r) => /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": e === r.value,
      className: e === r.value ? "is-active" : "",
      onClick: () => t(r.value),
      children: r.label
    },
    r.value
  )) });
}
function cr({
  value: e,
  onChange: t
}) {
  return /* @__PURE__ */ P(
    "select",
    {
      className: "knowledge-index-map-type-select",
      value: e,
      onChange: (n) => t(n.target.value),
      "aria-label": "图谱类型筛选",
      children: [
        /* @__PURE__ */ c("option", { value: "all", children: "全部" }),
        /* @__PURE__ */ c("option", { value: "concept", children: "概念" }),
        /* @__PURE__ */ c("option", { value: "source", children: "文档节点" }),
        /* @__PURE__ */ c("option", { value: "middle", children: "资源/其他" })
      ]
    }
  );
}
function ur({
  loading: e,
  tree: t,
  query: n,
  expandedIDs: r,
  selectedNodeID: i,
  onToggle: a,
  onSelect: o
}) {
  const l = W(() => $n(t, n), [n, t]);
  return e && !t.length ? /* @__PURE__ */ c(
    fe,
    {
      icon: /* @__PURE__ */ c(ke, { className: "is-spinning", size: 18 }),
      label: "加载地图中"
    }
  ) : l.length ? /* @__PURE__ */ c("div", { className: "knowledge-index-map-tree", children: l.map((u) => /* @__PURE__ */ c(
    Bn,
    {
      node: u,
      level: 0,
      expandedIDs: r,
      selectedNodeID: i,
      onToggle: a,
      onSelect: o
    },
    u.id
  )) }) : /* @__PURE__ */ c(
    fe,
    {
      icon: /* @__PURE__ */ c(hn, { size: 20 }),
      label: t.length ? "没有匹配的节点" : "暂无索引节点，请先更新索引"
    }
  );
}
function vr({
  graph: e,
  loading: t,
  enhancedMode: n,
  query: r,
  typeFilter: i,
  selectedNodeID: a,
  selectedEdgeID: o,
  onSelectNode: l,
  onSelectEdge: u
}) {
  const [d, s] = $(1), [v, f] = $({ x: 0, y: 0 }), m = re(null), h = W(
    () => jn(e, r, i),
    [e, r, i]
  ), b = W(() => br(h), [h]);
  if (t && !e.nodes.length)
    return /* @__PURE__ */ c(
      fe,
      {
        icon: /* @__PURE__ */ c(ke, { className: "is-spinning", size: 18 }),
        label: "加载关系图谱中"
      }
    );
  if (!b.nodes.length || !b.edges.length)
    return /* @__PURE__ */ c(
      fe,
      {
        icon: /* @__PURE__ */ c(Qe, { size: 20 }),
        label: e.nodes.length ? "没有匹配的关系图谱" : n ? "暂无关系图谱，请先更新增强索引" : "当前为轻量检索，未启用智能增强"
      }
    );
  const p = b.edges.length <= 60;
  return /* @__PURE__ */ P("div", { className: "knowledge-index-map-graph", children: [
    /* @__PURE__ */ P("div", { className: "knowledge-index-map-graph__tools", children: [
      /* @__PURE__ */ c("button", { type: "button", onClick: () => s((g) => Ye(g + 0.12, 0.72, 1.8)), children: /* @__PURE__ */ c(Qn, { size: 14 }) }),
      /* @__PURE__ */ c("button", { type: "button", onClick: () => s((g) => Ye(g - 0.12, 0.72, 1.8)), children: /* @__PURE__ */ c(Zn, { size: 14 }) }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: () => {
            s(1), f({ x: 0, y: 0 });
          },
          children: "复位"
        }
      )
    ] }),
    /* @__PURE__ */ P("svg", { viewBox: "0 0 980 560", role: "img", "aria-label": "知识关系图谱", children: [
      /* @__PURE__ */ c("defs", { children: /* @__PURE__ */ c(
        "marker",
        {
          id: "knowledge-graph-arrow",
          viewBox: "0 0 10 10",
          refX: "9",
          refY: "5",
          markerWidth: "6",
          markerHeight: "6",
          orient: "auto-start-reverse",
          children: /* @__PURE__ */ c("path", { d: "M 0 0 L 10 5 L 0 10 z" })
        }
      ) }),
      /* @__PURE__ */ P(
        "g",
        {
          transform: `translate(${v.x}, ${v.y}) scale(${d})`,
          onPointerDown: (g) => {
            m.current = {
              x: g.clientX,
              y: g.clientY,
              offsetX: v.x,
              offsetY: v.y
            }, g.currentTarget.setPointerCapture(g.pointerId);
          },
          onPointerMove: (g) => {
            const I = m.current;
            I && f({
              x: I.offsetX + g.clientX - I.x,
              y: I.offsetY + g.clientY - I.y
            });
          },
          onPointerUp: (g) => {
            m.current = null, g.currentTarget.releasePointerCapture(g.pointerId);
          },
          children: [
            /* @__PURE__ */ c("g", { className: "knowledge-index-map-graph__edges", children: b.edges.map((g) => /* @__PURE__ */ P(
              "g",
              {
                className: o === g.id ? "is-selected" : "",
                onClick: (I) => {
                  I.stopPropagation(), u(g.id);
                },
                children: [
                  /* @__PURE__ */ c("path", { d: g.path, markerEnd: "url(#knowledge-graph-arrow)" }),
                  p ? /* @__PURE__ */ c("text", { x: g.labelX, y: g.labelY, children: vn(g.label || g.edge_type, 12) }) : null
                ]
              },
              g.id || `${g.from_node_id}-${g.to_node_id}-${g.edge_type}`
            )) }),
            /* @__PURE__ */ c("g", { className: "knowledge-index-map-graph__nodes", children: b.nodes.map((g) => /* @__PURE__ */ P(
              "g",
              {
                role: "button",
                tabIndex: 0,
                className: `knowledge-index-map-graph__node is-${g.group}${a === g.id ? " is-selected" : ""}`,
                transform: `translate(${g.x}, ${g.y})`,
                onClick: (I) => {
                  I.stopPropagation(), l(g.id);
                },
                onKeyDown: (I) => {
                  (I.key === "Enter" || I.key === " ") && (I.preventDefault(), l(g.id));
                },
                children: [
                  /* @__PURE__ */ c("circle", { r: g.radius }),
                  /* @__PURE__ */ c("text", { className: "knowledge-index-map-graph__node-title", y: "-3", children: vn(g.title || g.path || String(g.id), 13) }),
                  /* @__PURE__ */ c("text", { className: "knowledge-index-map-graph__node-type", y: "14", children: Je(g.node_type).label })
                ]
              },
              g.id
            )) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ P("div", { className: "knowledge-index-map-graph__legend", children: [
      /* @__PURE__ */ c("span", { className: "is-source", children: "文档/节点" }),
      /* @__PURE__ */ c("span", { className: "is-concept", children: "概念" }),
      /* @__PURE__ */ P("span", { children: [
        "共 ",
        b.nodes.length,
        " 个节点 / ",
        b.edges.length,
        " 条关系"
      ] })
    ] })
  ] });
}
function Bn({
  node: e,
  level: t,
  expandedIDs: n,
  selectedNodeID: r,
  onToggle: i,
  onSelect: a
}) {
  const o = e.children || [], l = o.length > 0 || !!e.children_count, u = n.has(e.id), d = Je(e.node_type), s = Se(e.index_status), v = je(s), f = d.icon, m = v.icon;
  return /* @__PURE__ */ P("div", { className: "knowledge-index-map-tree__node", children: [
    /* @__PURE__ */ P(
      "button",
      {
        type: "button",
        className: `knowledge-index-map-tree__row${r === e.id ? " is-selected" : ""}`,
        style: { paddingLeft: 12 + t * 22 },
        onClick: () => a(e.id),
        children: [
          /* @__PURE__ */ c(
            "span",
            {
              className: "knowledge-index-map-tree__toggle",
              onClick: (h) => {
                h.stopPropagation(), l && i(e.id);
              },
              children: l ? u ? /* @__PURE__ */ c(nt, { size: 15 }) : /* @__PURE__ */ c(tt, { size: 15 }) : null
            }
          ),
          /* @__PURE__ */ c(f, { size: 15 }),
          /* @__PURE__ */ c("span", { className: "knowledge-index-map-tree__title", children: e.title || d.label }),
          /* @__PURE__ */ c(
            "span",
            {
              className: `knowledge-index-map-tree__status is-${v.status}`,
              title: v.label,
              children: /* @__PURE__ */ c(m, { size: 13 })
            }
          )
        ]
      }
    ),
    u && o.length ? /* @__PURE__ */ c("div", { className: "knowledge-index-map-tree__children", children: o.map((h) => /* @__PURE__ */ c(
      Bn,
      {
        node: h,
        level: t + 1,
        expandedIDs: n,
        selectedNodeID: r,
        onToggle: i,
        onSelect: a
      },
      h.id
    )) }) : null
  ] });
}
function mr({
  detail: e,
  loading: t
}) {
  if (t)
    return /* @__PURE__ */ c("section", { className: "knowledge-index-map-card", children: /* @__PURE__ */ c(
      fe,
      {
        icon: /* @__PURE__ */ c(ke, { className: "is-spinning", size: 18 }),
        label: "加载节点中"
      }
    ) });
  if (!e?.node)
    return /* @__PURE__ */ c("section", { className: "knowledge-index-map-card", children: /* @__PURE__ */ c(fe, { icon: /* @__PURE__ */ c(In, { size: 18 }), label: "选择一个节点查看详情" }) });
  const n = e.node;
  return /* @__PURE__ */ P("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ P("div", { className: "knowledge-index-map-card__header", children: [
      /* @__PURE__ */ P("div", { children: [
        /* @__PURE__ */ c("strong", { children: n.title || "未命名节点" }),
        /* @__PURE__ */ P("span", { children: [
          Je(n.node_type).label,
          " · ",
          n.path || "/"
        ] }),
        n.index_stage ? /* @__PURE__ */ P("span", { children: [
          "阶段：",
          yr(n.index_stage)
        ] }) : null
      ] }),
      /* @__PURE__ */ c(
        _e,
        {
          status: Se(n.index_status),
          label: je(n.index_status).label,
          count: 1
        }
      )
    ] }),
    /* @__PURE__ */ c("p", { className: "knowledge-index-map-card__summary", children: n.summary || n.plain_text || n.content || "暂无内容摘要。" }),
    /* @__PURE__ */ c(pr, { values: n.keywords || [] }),
    /* @__PURE__ */ c(un, { title: "子节点", icon: /* @__PURE__ */ c(Qe, { size: 14 }), nodes: e.children || [] }),
    /* @__PURE__ */ c(un, { title: "相关节点", icon: /* @__PURE__ */ c(Jn, { size: 14 }), nodes: e.related || [] })
  ] });
}
function un({
  title: e,
  icon: t,
  nodes: n
}) {
  return /* @__PURE__ */ P("div", { className: "knowledge-index-map-links", children: [
    /* @__PURE__ */ P("h4", { children: [
      t,
      e,
      /* @__PURE__ */ c("span", { children: n.length })
    ] }),
    n.length ? /* @__PURE__ */ c("div", { children: n.slice(0, 8).map((r) => /* @__PURE__ */ c("span", { children: r.title || r.path || `#${r.id}` }, r.id)) }) : /* @__PURE__ */ P("p", { children: [
      "暂无",
      e,
      "。"
    ] })
  ] });
}
function fr({ errors: e }) {
  return /* @__PURE__ */ P("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ c("div", { className: "knowledge-index-map-card__header", children: /* @__PURE__ */ P("div", { children: [
      /* @__PURE__ */ c("strong", { children: "最近错误" }),
      /* @__PURE__ */ c("span", { children: "失败文档会显示在这里" })
    ] }) }),
    e?.length ? /* @__PURE__ */ c("div", { className: "knowledge-index-map-errors", children: e.map((t) => /* @__PURE__ */ P("article", { children: [
      /* @__PURE__ */ c("strong", { children: t.title || t.storage_path || `文档 ${t.id}` }),
      /* @__PURE__ */ c("p", { children: t.error_message || "索引失败" })
    ] }, t.id)) }) : /* @__PURE__ */ c(fe, { icon: /* @__PURE__ */ c(pn, { size: 18 }), label: "暂无索引错误" })
  ] });
}
function gr({
  edge: e,
  nodes: t
}) {
  if (!e)
    return null;
  const n = t.find((i) => i.id === e.from_node_id), r = t.find((i) => i.id === e.to_node_id);
  return /* @__PURE__ */ P("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ c("div", { className: "knowledge-index-map-card__header", children: /* @__PURE__ */ P("div", { children: [
      /* @__PURE__ */ c("strong", { children: e.label || e.edge_type || "关系" }),
      /* @__PURE__ */ P("span", { children: [
        n?.title || `node:${e.from_node_id}`,
        " → ",
        r?.title || `node:${e.to_node_id}`
      ] })
    ] }) }),
    /* @__PURE__ */ c("p", { className: "knowledge-index-map-card__summary", children: e.summary || e.evidence || "暂无关系说明。" }),
    e.evidence ? /* @__PURE__ */ P("div", { className: "knowledge-index-map-edge-evidence", children: [
      /* @__PURE__ */ c("strong", { children: "证据" }),
      /* @__PURE__ */ c("p", { children: e.evidence })
    ] }) : null
  ] });
}
function pr({ values: e }) {
  const t = e.map((n) => n.trim()).filter(Boolean).slice(0, 12);
  return t.length ? /* @__PURE__ */ c("div", { className: "knowledge-index-map-keywords", children: t.map((n) => /* @__PURE__ */ c("span", { children: n }, n)) }) : null;
}
function fe({ icon: e, label: t }) {
  return /* @__PURE__ */ P("div", { className: "knowledge-index-map-state", children: [
    e,
    /* @__PURE__ */ c("span", { children: t })
  ] });
}
function hr(e) {
  for (const t of e)
    if (t)
      return t;
  return null;
}
function We(e) {
  const t = e.children || [];
  return (t.length ? [e.id] : []).concat(t.flatMap(We));
}
function $n(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.flatMap((r) => {
    const i = $n(r.children || [], n);
    return Kn(r, n) || i.length ? [{ ...r, children: i }] : [];
  }) : e;
}
function jn(e, t, n) {
  const r = t.trim().toLowerCase(), i = /* @__PURE__ */ new Set();
  for (const l of e.nodes || [])
    n !== "all" && zn(l) !== n || r && !Kn(l, r) || i.add(l.id);
  const a = (e.edges || []).filter((l) => i.has(l.from_node_id) && i.has(l.to_node_id) ? !0 : r ? wr(l, r) : !1), o = /* @__PURE__ */ new Set();
  for (const l of a)
    o.add(l.from_node_id), o.add(l.to_node_id);
  return {
    nodes: (e.nodes || []).filter((l) => o.has(l.id)),
    edges: a
  };
}
function Ir(e, t) {
  return t && (e.edges || []).find((n) => n.id === t) || null;
}
function Kn(e, t) {
  return [
    e.title,
    e.path,
    e.summary,
    e.content,
    e.plain_text,
    e.node_type
  ].some((n) => String(n || "").toLowerCase().includes(t));
}
function wr(e, t) {
  return [
    e.label,
    e.edge_type,
    e.summary,
    e.evidence
  ].some((n) => String(n || "").toLowerCase().includes(t));
}
function br(e) {
  const t = /* @__PURE__ */ new Set();
  for (const d of e.edges || [])
    d.from_node_id && d.to_node_id && (t.add(d.from_node_id), t.add(d.to_node_id));
  const n = (e.nodes || []).filter((d) => t.has(d.id)).map((d) => ({ ...d, group: zn(d) })), r = ["source", "middle", "concept"], i = r.reduce(
    (d, s) => (d[s] = n.filter((v) => v.group === s), d),
    {}
  ), a = {
    source: 180,
    middle: 500,
    concept: 800
  }, o = r.flatMap((d) => {
    const s = i[d], v = Math.max(54, Math.min(96, 440 / Math.max(s.length - 1, 1))), f = 70 + Math.max(0, (440 - v * (s.length - 1)) / 2);
    return s.map((m, h) => ({
      ...m,
      x: a[d],
      y: s.length === 1 ? 280 : f + h * v,
      radius: _r(m)
    }));
  }), l = new Map(o.map((d) => [d.id, d])), u = (e.edges || []).flatMap((d) => {
    const s = l.get(d.from_node_id), v = l.get(d.to_node_id);
    if (!s || !v)
      return [];
    const f = Math.max(Math.abs(v.x - s.x) * 0.42, 80);
    return [{
      ...d,
      path: `M ${s.x} ${s.y} C ${s.x + f} ${s.y}, ${v.x - f} ${v.y}, ${v.x} ${v.y}`,
      labelX: (s.x + v.x) / 2,
      labelY: (s.y + v.y) / 2 - 6
    }];
  });
  return { nodes: o, edges: u };
}
function zn(e) {
  return e.node_type === "concept" ? "concept" : e.node_type === "doc" || e.node_type === "heading" || e.node_type === "page" ? "source" : "middle";
}
function _r(e) {
  return e.node_type === "concept" ? 34 : e.node_type === "doc" ? 31 : 27;
}
function vn(e, t) {
  const n = String(e || "").trim();
  return n.length <= t ? n : `${n.slice(0, Math.max(t - 1, 1))}…`;
}
function Je(e) {
  return e === "root" || e === "dir" ? { label: "目录", icon: hn } : e === "doc" ? { label: "文档", icon: Ne } : e === "concept" ? { label: "概念", icon: Qe } : { label: e || "节点", icon: In };
}
function Se(e) {
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
function je(e) {
  const t = Se(e);
  return t === "running" ? { status: t, label: "索引中", icon: ke } : t === "pending" ? { status: t, label: "待索引", icon: nn } : t === "failed" ? { status: t, label: "索引失败", icon: et } : t === "success" ? { status: t, label: "已索引", icon: pn } : { status: "", label: "未索引", icon: nn };
}
function yr(e) {
  return {
    pending: "待处理",
    parse: "解析文档",
    nodes: "生成节点",
    summary: "生成摘要",
    graph: "抽取图谱",
    vector: "向量化",
    complete: "完成",
    failed: "失败"
  }[String(e || "").trim()] || e;
}
function Ye(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function ze(e, t) {
  return e instanceof Error ? e.message : t;
}
export {
  Sr as C,
  Xr as K,
  Cr as T,
  Rr as a,
  Nr as b,
  Fr as c,
  Ur as d,
  Lr as e,
  jr as f,
  zr as g,
  Gr as h,
  $r as i,
  qr as j,
  Wr as k,
  Er as l,
  Hr as m,
  Ar as n,
  Kr as o,
  Vr as p,
  Mr as r,
  Br as s,
  Or as u
};
