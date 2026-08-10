import { a as o, j as g, F as Ot } from "./_commonjsHelpers-CTFd9u1x.js";
import { d as Q, c as Z, h as Ue, j as rn, b as S, u as oe, o as te, l as D, v as Mt, f as Nn, R as G, F as Zr, p as At, S as ut, n as zt } from "./react-C7Xtl8sB.js";
import { F as Oe, V as $t, _ as Jr, aS as ei, N as ni, R as ke, X as ti, aT as hn, aU as ri, aV as ii, aL as Zn, e as ai, b as qe, aW as wn, q as nn, j as Bt, p as jt, k as Kt, aX as Ut, A as oi, aR as An, aY as qt, x as Ht, a5 as Vt, aZ as li, I as si, S as di, a_ as ci, a$ as ui, T as fi } from "./vendor-icons-Cc7Kl3It.js";
import { t as Y } from "./index-BxqXLJC9.js";
import { m as mi } from "./button-CpfaQlDK.js";
import { m as vi } from "./confirm-dialog-D2pOx0vH.js";
import { m as gi } from "./input-DLnnH2-7.js";
import { m as pi } from "./in-flight-request-DlB1DJg0.js";
import { m as hi } from "./first-frame-video-BTFoLT0t.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./knowledge-file-manager-jTQUGRbn.css", import.meta.url).href]);
var Ne;
(function(e) {
  e.DoubleClickItemToExpand = "double-click-item-to-expand", e.ClickItemToExpand = "click-item-to-expand", e.ClickArrowToExpand = "click-arrow-to-expand";
})(Ne || (Ne = {}));
var In = function() {
  return In = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, In.apply(this, arguments);
}, wi = function(e, t) {
  return {
    mode: e.mode,
    createInteractiveElementProps: function(n, r, i, a) {
      return In(In({}, t.createInteractiveElementProps(n, r, i, a)), e.createInteractiveElementProps(n, r, i, a));
    }
  };
}, je = function(e) {
  return e.ctrlKey || navigator.platform.toUpperCase().indexOf("MAC") >= 0 && e.metaKey;
}, Ii = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = Ne.DoubleClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(l) {
          var s = l.detail === 0;
          r.focusItem(), l.shiftKey && !s ? r.selectUpTo(!je(l)) : je(l) && !s ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : r.selectItem();
        },
        onDoubleClick: function() {
          r.focusItem(), r.selectItem(), t.isFolder && r.toggleExpandedState(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction();
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(l) {
          l.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(l) {
          l.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), _i = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = Ne.ClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(l) {
          var s = l.detail === 0;
          r.focusItem(), l.shiftKey && !s ? r.selectUpTo(!je(l)) : je(l) && !s ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : (t.isFolder && r.toggleExpandedState(), r.selectItem(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction());
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(l) {
          l.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(l) {
          l.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), xi = (
  /** @class */
  (function() {
    function e(t) {
      this.mode = Ne.ClickItemToExpand, this.environment = t;
    }
    return e.prototype.createInteractiveElementProps = function(t, n, r, i) {
      var a = this;
      return {
        onClick: function(l) {
          var s = l.detail === 0;
          r.focusItem(), l.shiftKey && !s ? r.selectUpTo(!je(l)) : je(l) && !s ? i.isSelected ? r.unselectItem() : r.addToSelectedItems() : (r.selectItem(), (!t.isFolder || a.environment.canInvokePrimaryActionOnItemContainer) && r.primaryAction());
        },
        onFocus: function() {
          r.focusItem();
        },
        onDragStart: function(l) {
          l.dataTransfer.dropEffect = "move", r.startDragging();
        },
        onDragOver: function(l) {
          l.preventDefault();
        },
        draggable: i.canDrag && !i.isRenaming,
        tabIndex: i.isRenaming ? void 0 : i.isFocused ? 0 : -1
      };
    }, e;
  })()
), ft = function(e, t) {
  switch (e) {
    case Ne.DoubleClickItemToExpand:
      return new Ii(t);
    case Ne.ClickItemToExpand:
      return new _i(t);
    case Ne.ClickArrowToExpand:
      return new xi(t);
    default:
      throw Error("Unknown interaction mode ".concat(e));
  }
}, Wt = Ue(null), yi = function() {
  return rn(Wt);
}, bi = function(e) {
  var t = e.children, n = ee(), r = n.defaultInteractionMode, i = Q(function() {
    var a;
    return r && typeof r != "string" ? r.extends ? wi(r, ft(r.extends, n)) : r : ft((a = r) !== null && a !== void 0 ? a : Ne.ClickItemToExpand, n);
  }, []);
  return Z(Wt.Provider, { value: i }, t);
}, Gt = function() {
  var e = ee();
  return S(function(t, n) {
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
}, Xt = function() {
  var e = ee();
  return S(function(t, n) {
    for (var r = e.linearItems[n], i = r[t].depth, a = t; r[a] && r[a].depth !== i - 1; a -= 1)
      ;
    var l = r[a];
    return l || (l = { item: e.trees[n].rootItem, depth: 0 }, a = 0), { parent: l, parentLinearIndex: a };
  }, [e.linearItems, e.trees]);
}, ki = function() {
  var e = ee(), t = Xt(), n = Gt(), r = S(function(i, a, l) {
    var s = t(a, i), c = s.parent, d = s.parentLinearIndex;
    return l.some(function(u) {
      return u.index === c.item;
    }) ? !0 : c.depth === 0 ? !1 : r(i, d, l);
  }, [t]);
  return S(function(i, a) {
    for (
      var l, s, c, d, u = e.linearItems[i], f = [], v = -1, p = 0;
      p < u.length;
      // eslint-disable-next-line no-plusplus
      p++
    ) {
      var y = u[p], I = y.item, _ = y.depth;
      if (!(v !== -1 && _ > v)) {
        v = -1;
        var h = t(p, i).parent, w = e.items[h.item].children.indexOf(I);
        if (r(i, p, a)) {
          v = _ + 1;
          continue;
        }
        var x = {
          targetType: "item",
          parentItem: h.item,
          targetItem: I,
          linearIndex: p,
          depth: _,
          treeId: i
        }, E = {
          targetType: "between-items",
          parentItem: h.item,
          linePosition: "top",
          childIndex: w,
          depth: _,
          treeId: i,
          linearIndex: p
        }, F = {
          targetType: "between-items",
          parentItem: h.item,
          linePosition: "bottom",
          linearIndex: p + 1,
          childIndex: w + 1,
          depth: _,
          treeId: i
        }, j = (s = (l = u[p - 1]) === null || l === void 0 ? void 0 : l.depth) !== null && s !== void 0 ? s : -1, W = (d = (c = u[p + 1]) === null || c === void 0 ? void 0 : c.depth) !== null && d !== void 0 ? d : -1, re = _ === j, ne = _ === W - 1;
        !re && n(E, a) && f.push(E), n(x, a) && f.push(x), !ne && n(F, a) && f.push(F);
      }
    }
    return f;
  }, [
    n,
    e.items,
    e.linearItems,
    t,
    r
  ]);
}, mn = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, _n = function(e, t, n) {
  var r = oe();
  te(function() {
    if (!r.current)
      r.current = mn([], n, !0), e();
    else {
      var i = r.current.some(function(a, l) {
        return a !== n[l];
      });
      i && (r.current = mn([], n, !0), e());
    }
  }, mn(mn([], t, !0), n, !0));
}, xn = function() {
  return xn = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, xn.apply(this, arguments);
}, Yt = function(e, t) {
  return e.map(function(n) {
    return [n, t(n)];
  }).reduce(function(n, r) {
    var i, a = r[0], l = r[1];
    return xn(xn({}, n), (i = {}, i[a] = l, i));
  }, {});
}, Ie = function() {
  return typeof document < "u" ? document : void 0;
};
function He(e) {
  e === void 0 && (e = !1);
  var t = oe(new Array());
  return te(function() {
    if (e)
      return function() {
      };
    var n = t.current;
    return function() {
      return n.forEach(function(r) {
        return cancelAnimationFrame(r);
      });
    };
  }, [e, t]), S(function(n) {
    var r = requestAnimationFrame(function() {
      t.current.splice(t.current.indexOf(r), 1), n();
    });
    t.current.push(r);
  }, [t]);
}
var yn = function(e) {
  var t = oe(e);
  return t.current = e, t;
}, _e = function(e) {
  var t = yn(e);
  return S((function() {
    for (var n = [], r = 0; r < arguments.length; r++)
      n[r] = arguments[r];
    return t.current.apply(t, n);
  }), [
    t
  ]);
}, Qt = function() {
  var e = ee();
  return _e(function(t, n) {
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
      var l = i[1];
      return a - l;
    }).map(function(r) {
      var i = r[0];
      return i;
    });
  });
}, Di = function(e) {
  var t, n = (t = Ie()) === null || t === void 0 ? void 0 : t.querySelector('[data-rct-tree="'.concat(e, '"] [data-rct-item-container="true"]'));
  if (n) {
    var r = getComputedStyle(n);
    return n.offsetHeight + Math.max(parseFloat(r.marginTop), parseFloat(r.marginBottom));
  }
  return 5;
}, Zt = function(e, t) {
  return e.clientX <= t.left || e.clientX >= t.right || e.clientY <= t.top || e.clientY >= t.bottom;
}, Si = (
  /** @class */
  (function() {
    function e(t, n, r, i, a, l) {
      this.env = t, this.e = n, this.treeId = r, this.linearIndex = i.linearIndex, this.offset = i.offset, this.indentation = i.indentation, this.targetItem = this.env.linearItems[this.treeId][this.linearIndex], this.getParentOfLinearItem = l, this.draggingItems = a;
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
        ), l = this.offset === "bottom" && a > 0;
        if (l) {
          for (var s = Math.max(i - a, this.indentation), c = {
            parentLinearIndex: this.linearIndex,
            parent: this.targetItem
          }, d, u = i; u >= s; u -= 1)
            d = c, c = this.getParentOfLinearItem(c.parentLinearIndex, this.treeId);
          if (this.indentation !== r[this.linearIndex].depth && d) {
            var f = this.env.items[c.parent.item].children.indexOf(d.parent.item) + 1;
            if (!(this.draggingItems && this.isDescendant(this.treeId, c.parentLinearIndex + 1, this.draggingItems)))
              return {
                targetType: "between-items",
                treeId: this.treeId,
                parentItem: c.parent.item,
                depth: s,
                linearIndex: this.linearIndex + 1,
                childIndex: f,
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
      var i = this.getParentOfLinearItem(n, t), a = i.parentLinearIndex, l = i.parent;
      return r.some(function(s) {
        return s.index === l.item;
      }) ? !0 : l.depth === 0 ? !1 : this.isDescendant(t, a, r);
    }, e.prototype.areDraggingItemsDescendantOfTarget = function() {
      return this.draggingItems && this.isDescendant(this.treeId, this.linearIndex, this.draggingItems);
    }, e;
  })()
), Ni = function() {
  var e = oe("initial"), t = D(void 0), n = t[0], r = t[1], i = oe(0), a = ee(), l = Xt(), s = _e(function(v, p, y) {
    if (!y)
      return !1;
    var I = y.offset, _ = y.linearIndex, h = "".concat(p, "__").concat(_, "__").concat(I ?? "", "__").concat(y.indentation);
    return h !== e.current ? (e.current = h, !0) : !1;
  }), c = _e(function(v, p, y) {
    if (y.current) {
      var I = y.current.getBoundingClientRect();
      if (!Zt(v, I)) {
        var _ = (v.clientY - I.top) / i.current, h = a.linearItems[p], w = Math.min(Math.max(0, Math.floor(_)), h.length - 1);
        if (h.length === 0)
          return {
            linearIndex: 0,
            offset: "bottom",
            indentation: 0
          };
        var x = h[w], E = a.items[x.item], F = a.renderDepthOffset ? Math.max(Math.floor((v.clientX - I.left) / a.renderDepthOffset), 0) : void 0, j, W = a.canReorderItems ? E?.isFolder && a.canDropOnFolder || a.canDropOnNonFolder ? 0.2 : 0.5 : 0;
        return _ - 0.5 >= h.length - 1 ? j = "bottom" : _ % 1 < W ? j = "top" : _ % 1 > 1 - W && (j = "bottom"), { linearIndex: w, offset: j, indentation: F };
      }
    }
  }), d = _e(function(v, p, y) {
    var I = c(v, p, y);
    if (s(v, p, I))
      return !n || !a.canDragAndDrop || !I || v.clientX < 0 || v.clientY < 0 ? "invalid" : new Si(a, v, p, I, n, l).getDraggingPosition();
  }), u = _e(function(v, p) {
    r(p), e.current = "initial", i.current = Di(v);
  }), f = _e(function() {
    r(void 0), e.current = "initial", i.current = 0;
  });
  return {
    initiateDraggingPosition: u,
    resetDraggingPosition: f,
    draggingItems: n,
    getDraggingPosition: d,
    itemHeight: i
  };
}, Jt = Ue(null), Se = function() {
  return rn(Jt);
}, Pi = function(e) {
  var t = e.children, n = ee(), r = D(!1), i = r[0], a = r[1], l = D({}), s = l[0], c = l[1], d = D(0), u = d[0], f = d[1], v = D(), p = v[0], y = v[1], I = ki(), _ = He(), h = Qt(), w = Ni(), x = w.initiateDraggingPosition, E = w.resetDraggingPosition, F = w.draggingItems, j = w.getDraggingPosition, W = w.itemHeight, re = S(function(N, M) {
    var C;
    if (n.activeTreeId && (!((C = n.viewState[n.activeTreeId]) === null || C === void 0) && C.focusedItem) && n.linearItems && M) {
      var R = n.viewState[n.activeTreeId].focusedItem, K = I(n.activeTreeId, M), k = K.findIndex(function(B) {
        return B.targetType === "item" ? B.targetItem === R : B.targetType === "between-items" ? n.items[B.parentItem].children[B.childIndex] === R : !1;
      });
      f(k ? Math.min(k + 1, K.length - 1) : 0);
    } else
      f(0);
  }, [
    n.activeTreeId,
    n.items,
    n.linearItems,
    n.viewState,
    I
  ]), ne = _e(function() {
    a(!1), c({}), f(0), y(void 0), E();
  });
  _n(function() {
    n.activeTreeId && n.linearItems[n.activeTreeId] && s[n.activeTreeId] && re(s[n.activeTreeId], F);
  }, [
    F,
    n.activeTreeId,
    n.linearItems,
    re,
    s
  ], [n.activeTreeId]), _n(function() {
    i && n.activeTreeId && y(s[n.activeTreeId][u]);
  }, [
    u,
    n.activeTreeId,
    i,
    s
  ], [u, n.activeTreeId]);
  var ue = Gt(), ae = function(N) {
    var M;
    F && !ue(N, F) || (y(N), n.setActiveTree(N.treeId), F && n.activeTreeId !== N.treeId && ((M = n.onSelectItems) === null || M === void 0 || M.call(n, F.map(function(C) {
      return C.index;
    }), N.treeId)));
  }, de = _e(function(N, M, C) {
    if (F) {
      var R = j(N, M, C);
      if (R) {
        if (R === "invalid") {
          y(void 0);
          return;
        }
        ae(R);
      }
    }
  }), U = _e(function(N, M) {
    M.current && Zt(N, M.current.getBoundingClientRect()) && y(void 0);
  }), A = _e(function() {
    !F || !p || !n.onDrop || (n.onDrop(F, p), _(function() {
      var N;
      (N = n.onFocusItem) === null || N === void 0 || N.call(n, F[0], p.treeId), ne();
    }));
  }), O = S(function(N, M) {
    var C = Yt(n.treeIds, function(R) {
      return I(R, N);
    });
    x(M, N), c(C), n.activeTreeId && re(C[n.activeTreeId], N);
  }, [
    n.activeTreeId,
    n.treeIds,
    I,
    x,
    re
  ]), z = S(function() {
    var N, M, C;
    if (n.canDragAndDrop && n.activeTreeId) {
      var R = (M = (N = n.viewState[n.activeTreeId]) === null || N === void 0 ? void 0 : N.selectedItems) !== null && M !== void 0 ? M : [
        (C = n.viewState[n.activeTreeId]) === null || C === void 0 ? void 0 : C.focusedItem
      ];
      if (R.length === 0 || R[0] === void 0)
        return;
      var K = h(n.activeTreeId, R.map(function(k) {
        return n.items[k];
      }));
      if (n.canDrag && !n.canDrag(K))
        return;
      O(K, n.activeTreeId), setTimeout(function() {
        a(!0);
      });
    }
  }, [n, h, O]), ie = S(function() {
    ne();
  }, [ne]), X = S(function() {
    A(), ne();
  }, [A, ne]), J = S(function() {
    f(function(N) {
      return Math.max(0, N - 1);
    });
  }, []), P = S(function() {
    n.activeTreeId && f(function(N) {
      return Math.min(s[n.activeTreeId].length - 1, N + 1);
    });
  }, [n.activeTreeId, s]), L = Q(function() {
    return {
      onStartDraggingItems: O,
      startProgrammaticDrag: z,
      abortProgrammaticDrag: ie,
      completeProgrammaticDrag: X,
      programmaticDragUp: J,
      programmaticDragDown: P,
      draggingItems: F,
      draggingPosition: p,
      itemHeight: W.current,
      isProgrammaticallyDragging: i,
      onDragOverTreeHandler: de,
      onDragLeaveContainerHandler: U,
      viableDragPositions: s
    };
  }, [
    ie,
    X,
    F,
    p,
    i,
    W,
    de,
    U,
    O,
    P,
    J,
    z,
    s
  ]);
  return te(function() {
    return window.addEventListener("dragend", ne), window.addEventListener("drop", A), function() {
      window.removeEventListener("dragend", ne), window.removeEventListener("drop", A);
    };
  }, [A, ne]), Z(Jt.Provider, { value: L }, t);
}, Ze = function() {
  return Ze = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Ze.apply(this, arguments);
}, Ci = function(e, t) {
  var n = ee(), r = Se();
  Mt(e, function() {
    return Ze(Ze(Ze({}, t), n), { treeEnvironmentContext: n, dragAndDropContext: r });
  });
}, er = function(e, t, n) {
  return t === void 0 && (t = 50), n === void 0 && (n = 1e4), new Promise(function(r) {
    e() && r();
    var i, a = setInterval(function() {
      e() && i();
    }, t), l = setTimeout(function() {
      i();
    }, n);
    i = function() {
      clearInterval(a), clearTimeout(l), r();
    };
  });
}, Vn = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(l) {
      l(a);
    });
  }
  return new (n || (n = Promise))(function(a, l) {
    function s(u) {
      try {
        d(r.next(u));
      } catch (f) {
        l(f);
      }
    }
    function c(u) {
      try {
        d(r.throw(u));
      } catch (f) {
        l(f);
      }
    }
    function d(u) {
      u.done ? a(u.value) : i(u.value).then(s, c);
    }
    d((r = r.apply(e, t || [])).next());
  });
}, Wn = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1) throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, l;
  return l = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function s(d) {
    return function(u) {
      return c([d, u]);
    };
  }
  function c(d) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; l && (l = 0, d[0] && (n = 0)), n; ) try {
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
    } catch (u) {
      d = [6, u], i = 0;
    } finally {
      r = a = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
  }
}, mt = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, nr = Ue(null), Ti = function() {
  return rn(nr);
}, tr = function(e, t, n) {
  return Vn(void 0, void 0, void 0, function() {
    var r, i, a, l, s, c, d;
    return Wn(this, function(u) {
      for (r = function(f) {
        er(function() {
          var v;
          return !!(!((v = t.current) === null || v === void 0) && v[f]);
        }).then(function() {
          var v, p = (v = t.current) === null || v === void 0 ? void 0 : v[f];
          p?.isFolder && (n(p), tr(f, t, n));
        });
      }, i = 0, a = (d = (c = (s = t.current) === null || s === void 0 ? void 0 : s[e]) === null || c === void 0 ? void 0 : c.children) !== null && d !== void 0 ? d : []; i < a.length; i++)
        l = a[i], r(l);
      return [
        2
        /*return*/
      ];
    });
  });
}, Ei = Nn(function(e, t) {
  var n = ee(), r = n.onCollapseItem, i = n.items, a = n.trees, l = n.viewState, s = n.onExpandItem, c = n.onFocusItem, d = n.setActiveTree, u = n.onRenameItem, f = n.onSelectItems, v = n.onPrimaryAction, p = n.linearItems, y = Se(), I = y.abortProgrammaticDrag, _ = y.completeProgrammaticDrag, h = y.programmaticDragDown, w = y.programmaticDragUp, x = y.startProgrammaticDrag, E = yn(i), F = S(function(P, L) {
    r?.(i[P], L);
  }, [i, r]), j = S(function(P, L) {
    s?.(i[P], L);
  }, [i, s]), W = S(function(P, L, N) {
    N === void 0 && (N = !0), c?.(i[P], L, N);
  }, [i, c]), re = S(function(P, L) {
    L === void 0 && (L = !0), d(P, L);
  }, [d]), ne = S(function(P) {
    var L = p[P], N = L.findIndex(function(R) {
      var K, k = R.item;
      return k === ((K = l[P]) === null || K === void 0 ? void 0 : K.focusedItem);
    }), M = N !== void 0 ? Math.min(L.length - 1, N + 1) : 0, C = i[L[M].item];
    c?.(C, P);
  }, [i, p, c, l]), ue = S(function(P) {
    var L = p[P], N = L.findIndex(function(R) {
      var K, k = R.item;
      return k === ((K = l[P]) === null || K === void 0 ? void 0 : K.focusedItem);
    }), M = N !== void 0 ? Math.max(0, N - 1) : 0, C = i[L[M].item];
    c?.(C, P);
  }, [i, p, c, l]), ae = S(function(P, L, N) {
    u?.(i[P], L, N);
  }, [i, u]), de = S(function(P, L) {
    f?.(P, L);
  }, [f]), U = S(function(P, L) {
    var N, M;
    !((M = (N = l[L]) === null || N === void 0 ? void 0 : N.expandedItems) === null || M === void 0) && M.includes(P) ? r?.(i[P], L) : s?.(i[P], L);
  }, [i, r, s, l]), A = S(function(P, L) {
    var N, M, C, R, K;
    !((M = (N = l[L]) === null || N === void 0 ? void 0 : N.selectedItems) === null || M === void 0) && M.includes(P) ? f?.((R = (C = l[L].selectedItems) === null || C === void 0 ? void 0 : C.filter(function(k) {
      return k !== P;
    })) !== null && R !== void 0 ? R : [], L) : f?.(mt(mt([], (K = l[L].selectedItems) !== null && K !== void 0 ? K : [], !0), [P], !1), L);
  }, [f, l]), O = S(function(P, L) {
    v?.(i[P], L);
  }, [i, v]), z = S(function(P, L) {
    return Vn(void 0, void 0, void 0, function() {
      var N, M;
      return Wn(this, function(C) {
        switch (C.label) {
          case 0:
            return N = L[0], M = L.slice(1), [4, er(function() {
              var R;
              return !!(!((R = E.current) === null || R === void 0) && R[N]);
            }).then(function() {
              var R = E.current[N];
              return R ? (s?.(R, P), M.length > 0 ? z(P, M) : Promise.resolve()) : Promise.resolve();
            })];
          case 1:
            return C.sent(), [
              2
              /*return*/
            ];
        }
      });
    });
  }, [E, s]), ie = S(function(P) {
    return Vn(void 0, void 0, void 0, function() {
      return Wn(this, function(L) {
        switch (L.label) {
          case 0:
            return [4, tr(a[P].rootItem, E, function(N) {
              return s?.(N, P);
            })];
          case 1:
            return L.sent(), [
              2
              /*return*/
            ];
        }
      });
    });
  }, [E, s, a]), X = S(function(P) {
    for (var L, N, M = 0, C = (N = (L = l[P]) === null || L === void 0 ? void 0 : L.expandedItems) !== null && N !== void 0 ? N : []; M < C.length; M++) {
      var R = C[M];
      r?.(i[R], P);
    }
  }, [i, r, l]), J = Q(function() {
    return {
      collapseItem: F,
      expandItem: j,
      focusItem: W,
      focusTree: re,
      moveFocusDown: ne,
      moveFocusUp: ue,
      renameItem: ae,
      selectItems: de,
      toggleItemExpandedState: U,
      toggleItemSelectStatus: A,
      invokePrimaryAction: O,
      expandAll: ie,
      expandSubsequently: z,
      collapseAll: X,
      abortProgrammaticDrag: I,
      completeProgrammaticDrag: _,
      moveProgrammaticDragPositionDown: h,
      moveProgrammaticDragPositionUp: w,
      startProgrammaticDrag: x
    };
  }, [
    F,
    j,
    W,
    re,
    ne,
    ue,
    ae,
    de,
    U,
    A,
    O,
    ie,
    z,
    X,
    I,
    _,
    h,
    w,
    x
  ]);
  return Ci(t, J), Z(nr.Provider, { value: J }, e.children);
}), Li = function(e) {
  var t, n, r, i;
  if (e)
    if (e.scrollIntoViewIfNeeded)
      e.scrollIntoViewIfNeeded();
    else {
      var a = e.getBoundingClientRect(), l = a.top >= 0 && a.left >= 0 && a.bottom <= (window.innerHeight || !!(!((n = (t = Ie()) === null || t === void 0 ? void 0 : t.documentElement) === null || n === void 0) && n.clientHeight)) && a.right <= (window.innerWidth || !!(!((i = (r = Ie()) === null || r === void 0 ? void 0 : r.documentElement) === null || i === void 0) && i.clientWidth));
      l || e.scrollIntoView();
    }
}, pe = function() {
  return pe = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, pe.apply(this, arguments);
}, Te = function() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  return e.filter(function(n) {
    return !!n;
  }).join(" ");
}, Fi = function(e, t) {
  return {
    renderItemTitle: function(n) {
      var r = n.title, i = n.context, a = n.info;
      if (!a.isSearching || !i.isSearchMatching)
        return r;
      var l = r.toLowerCase().indexOf(a.search.toLowerCase());
      return G.createElement(
        G.Fragment,
        null,
        l > 0 && G.createElement("span", null, r.slice(0, l)),
        G.createElement("span", { className: "rct-tree-item-search-highlight" }, r.slice(l, l + a.search.length)),
        l + a.search.length < r.length && G.createElement("span", null, r.slice(l + a.search.length, r.length))
      );
    },
    renderItemArrow: function(n) {
      var r = n.item, i = n.context;
      return (
        // Icons from https://blueprintjs.com/docs/#icons
        G.createElement("div", pe({ className: Te(r.isFolder && "rct-tree-item-arrow-isFolder", i.isExpanded && "rct-tree-item-arrow-expanded", "rct-tree-item-arrow") }, i.arrowProps), r.isFolder && (i.isExpanded ? G.createElement(
          "svg",
          { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 16 16", enableBackground: "new 0 0 16 16", xmlSpace: "preserve" },
          G.createElement(
            "g",
            null,
            G.createElement(
              "g",
              null,
              G.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z", className: "rct-tree-item-arrow-path" })
            )
          )
        ) : G.createElement(
          "svg",
          { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 16 16", enableBackground: "new 0 0 16 16", xmlSpace: "preserve" },
          G.createElement(
            "g",
            null,
            G.createElement(
              "g",
              null,
              G.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z", className: "rct-tree-item-arrow-path" })
            )
          )
        )))
      );
    },
    renderItem: function(n) {
      var r = n.item, i = n.depth, a = n.children, l = n.title, s = n.context, c = n.arrow, d = s.isRenaming ? "div" : "button", u = s.isRenaming ? void 0 : "button";
      return G.createElement(
        "li",
        pe({}, s.itemContainerWithChildrenProps, { className: Te("rct-tree-item-li", r.isFolder && "rct-tree-item-li-isFolder", s.isSelected && "rct-tree-item-li-selected", s.isExpanded && "rct-tree-item-li-expanded", s.isFocused && "rct-tree-item-li-focused", s.isDraggingOver && "rct-tree-item-li-dragging-over", s.isSearchMatching && "rct-tree-item-li-search-match") }),
        G.createElement(
          "div",
          pe({}, s.itemContainerWithoutChildrenProps, { style: { "--depthOffset": "".concat((i + 1) * e, "px") }, className: Te("rct-tree-item-title-container", r.isFolder && "rct-tree-item-title-container-isFolder", s.isSelected && "rct-tree-item-title-container-selected", s.isExpanded && "rct-tree-item-title-container-expanded", s.isFocused && "rct-tree-item-title-container-focused", s.isDraggingOver && "rct-tree-item-title-container-dragging-over", s.isSearchMatching && "rct-tree-item-title-container-search-match") }),
          c,
          G.createElement(d, pe({ type: u }, s.interactiveElementProps, { className: Te("rct-tree-item-button", r.isFolder && "rct-tree-item-button-isFolder", s.isSelected && "rct-tree-item-button-selected", s.isExpanded && "rct-tree-item-button-expanded", s.isFocused && "rct-tree-item-button-focused", s.isDraggingOver && "rct-tree-item-button-dragging-over", s.isSearchMatching && "rct-tree-item-button-search-match") }), l)
        ),
        a
      );
    },
    renderRenameInput: function(n) {
      var r = n.inputProps, i = n.inputRef, a = n.submitButtonProps, l = n.submitButtonRef, s = n.formProps;
      return G.createElement(
        "form",
        pe({}, s, { className: "rct-tree-item-renaming-form" }),
        G.createElement("input", pe({}, r, { ref: i, className: "rct-tree-item-renaming-input" })),
        G.createElement("input", pe({}, a, { ref: l, type: "submit", className: "rct-tree-item-renaming-submit-button", value: "🗸" }))
      );
    },
    renderTreeContainer: function(n) {
      var r = n.children, i = n.containerProps, a = n.info;
      return G.createElement(
        "div",
        { className: Te("rct-tree-root", a.isFocused && "rct-tree-root-focus", a.isRenaming && "rct-tree-root-renaming", a.areItemsSelected && "rct-tree-root-itemsselected", t) },
        G.createElement("div", pe({}, i, { style: pe({ minHeight: "30px" }, i.style) }), r)
      );
    },
    renderItemsContainer: function(n) {
      var r = n.children, i = n.containerProps;
      return G.createElement("ul", pe({}, i, { className: "rct-tree-items-container" }), r);
    },
    renderDragBetweenLine: function(n) {
      var r = n.draggingPosition, i = n.lineProps;
      return G.createElement("div", pe({}, i, { style: { left: "".concat(r.depth * e, "px") }, className: Te("rct-tree-drag-between-line", r.targetType === "between-items" && r.linePosition === "top" && "rct-tree-drag-between-line-top", r.targetType === "between-items" && r.linePosition === "bottom" && "rct-tree-drag-between-line-bottom") }));
    },
    renderSearchInput: function(n) {
      var r = n.inputProps;
      return G.createElement(
        "div",
        { className: Te("rct-tree-search-input-container") },
        G.createElement("span", { className: "rct-tree-input-icon" }),
        G.createElement("input", pe({}, r, { className: Te("rct-tree-search-input") }))
      );
    },
    renderLiveDescriptorContainer: function(n) {
      var r = n.tree, i = n.children;
      return G.createElement("div", { id: "rct-livedescription-".concat(r.treeId), style: {
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
}, Ri = function(e) {
  var t = e.renderItem, n = e.renderItemTitle, r = e.renderItemArrow, i = e.renderRenameInput, a = e.renderItemsContainer, l = e.renderTreeContainer, s = e.renderDragBetweenLine, c = e.renderSearchInput, d = e.renderLiveDescriptorContainer, u = e.renderDepthOffset, f = Q(function() {
    return Fi(u ?? 10);
  }, [u]), v = {
    renderItem: t,
    renderItemTitle: n,
    renderItemArrow: r,
    renderRenameInput: i,
    renderItemsContainer: a,
    renderTreeContainer: l,
    renderDragBetweenLine: s,
    renderSearchInput: c,
    renderLiveDescriptorContainer: d,
    renderDepthOffset: u
  }, p = Object.entries(f).reduce(function(y, I) {
    var _ = I[0], h = I[1], w = _;
    return v[w] ? y[w] = v[w] : y[w] = h, y;
  }, {});
  return p.renderItem.displayName = "RenderItem", p.renderItemTitle.displayName = "RenderItemTitle", p.renderItemArrow.displayName = "RenderItemArrow", p.renderRenameInput.displayName = "RenderRenameInput", p.renderItemsContainer.displayName = "RenderItemsContainer", p.renderTreeContainer.displayName = "RenderTreeContainer", p.renderDragBetweenLine.displayName = "RenderDragBetweenLine", p.renderSearchInput.displayName = "RenderSearchInput", p;
}, Jn = function(e, t, n, r) {
  var i, a, l;
  r === void 0 && (r = 0);
  for (var s = [], c = 0, d = (a = (i = n[e]) === null || i === void 0 ? void 0 : i.children) !== null && a !== void 0 ? a : []; c < d.length; c++) {
    var u = d[c], f = n[u];
    s.push({ item: u, depth: r }), f && f.isFolder && f.children && (!((l = t.expandedItems) === null || l === void 0) && l.includes(u)) && s.push.apply(s, Jn(u, t, n, r + 1));
  }
  return s;
}, Ee = function() {
  return Ee = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Ee.apply(this, arguments);
}, Oi = function(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
}, Mi = function(e) {
  var t = e.onExpandItem, n = e.onCollapseItem, r = e.onDrop, i = Oi(e, ["onExpandItem", "onCollapseItem", "onDrop"]), a = D({}), l = a[0], s = a[1], c = D(), d = c[0], u = c[1], f = Q(function() {
    return Object.keys(l);
  }, [l]), v = i.onFocusItem, p = i.autoFocus, y = i.onRegisterTree, I = i.onUnregisterTree, _ = i.items, h = i.viewState, w = yn(v), x = yn(h), E = Q(function() {
    return Yt(f, function(A) {
      var O;
      return Jn(l[A].rootItem, (O = h[A]) !== null && O !== void 0 ? O : {}, _);
    });
  }, [l, _, f, h]), F = S(function(A, O, z) {
    var ie, X, J, P, L, N, M, C, R;
    if (z === void 0 && (z = !0), (p ?? !0) && z) {
      var K = (X = (ie = Ie()) === null || ie === void 0 ? void 0 : ie.querySelector('[data-rct-tree="'.concat(O, '"] [data-rct-item-id="').concat(A.index, '"]'))) !== null && X !== void 0 ? X : (J = Ie()) === null || J === void 0 ? void 0 : J.querySelector('[data-rct-tree="'.concat(O, '"] [data-rct-item-id]'));
      ((N = (L = (P = Ie()) === null || P === void 0 ? void 0 : P.activeElement) === null || L === void 0 ? void 0 : L.attributes.getNamedItem("data-rct-search-input")) === null || N === void 0 ? void 0 : N.value) !== "true" ? (M = K?.focus) === null || M === void 0 || M.call(K) : Li(K);
    }
    ((C = x.current[O]) === null || C === void 0 ? void 0 : C.focusedItem) !== A.index && ((R = w.current) === null || R === void 0 || R.call(w, A, O));
  }, [p, w, x]), j = S(function(A) {
    s(function(O) {
      var z;
      return Ee(Ee({}, O), (z = {}, z[A.treeId] = A, z));
    }), y?.(A);
  }, [y]), W = S(function(A) {
    I?.(l[A]), s(function(O) {
      var z = Ee({}, O);
      return delete z[A], z;
    });
  }, [I, l]), re = S(function(A, O) {
    n?.(A, O), s(function(z) {
      return z;
    });
  }, [n]), ne = S(function(A, O) {
    t?.(A, O), s(function(z) {
      return z;
    });
  }, [t]), ue = S(function(A, O) {
    r?.(A, O), s(function(z) {
      return z;
    });
  }, [r]), ae = S(function(A) {
    var O, z, ie = (O = Ie()) === null || O === void 0 ? void 0 : O.querySelector('[data-rct-tree="'.concat(A, '"] [data-rct-item-focus="true"]'));
    (z = ie?.focus) === null || z === void 0 || z.call(ie);
  }, []), de = S(function(A, O) {
    O === void 0 && (O = !0);
    var z = function(X) {
      var J, P;
      O && (p ?? !0) && X && !(!((P = (J = Ie()) === null || J === void 0 ? void 0 : J.querySelector('[data-rct-tree="'.concat(X, '"]'))) === null || P === void 0) && P.contains(document.activeElement)) && ae(X);
    };
    if (typeof A == "function")
      u(function(X) {
        var J = A(X);
        return J !== X && z(J), J;
      });
    else {
      var ie = A;
      u(ie), z(ie);
    }
  }, [p, ae]), U = Ri(i);
  return Ee(Ee(Ee({}, U), i), { onFocusItem: F, registerTree: j, unregisterTree: W, onExpandItem: ne, onCollapseItem: re, onDrop: ue, setActiveTree: de, treeIds: f, trees: l, activeTreeId: d, linearItems: E });
}, rr = Ue(null), ee = function() {
  return rn(rr);
}, Ai = Nn(function(e, t) {
  var n = Mi(e), r = e.viewState, i = e.onFocusItem;
  return te(function() {
    for (var a, l, s, c = 0, d = Object.keys(n.trees); c < d.length; c++) {
      var u = d[c], f = (l = (a = e.items[n.trees[u].rootItem]) === null || a === void 0 ? void 0 : a.children) === null || l === void 0 ? void 0 : l[0], v = f && e.items[f];
      !(!((s = r[u]) === null || s === void 0) && s.focusedItem) && n.trees[u] && v && i?.(v, u, !1);
    }
  }, [n.trees, i, e.items, r]), Z(
    rr.Provider,
    { value: n },
    Z(
      bi,
      null,
      Z(
        Pi,
        null,
        Z(Ei, { ref: t }, e.children)
      )
    )
  );
}), zi = function(e) {
  var t, n = e.treeId, r = Se(), i = r.draggingPosition, a = r.itemHeight, l = ge().renderers, s = i && i.targetType === "between-items" && i.treeId === n;
  if (!s)
    return null;
  var c = {
    onDragOver: function(d) {
      return d.preventDefault();
    }
    // Allow dropping
  };
  return Z("div", { style: {
    position: "absolute",
    left: "0",
    right: "0",
    top: "".concat(((t = i?.linearIndex) !== null && t !== void 0 ? t : 0) * a, "px")
  } }, l.renderDragBetweenLine({
    draggingPosition: i,
    lineProps: c
  }));
}, Ke = function(e, t, n) {
  var r = _e(n);
  te(function() {
    return e ? (e.addEventListener(t, r), function() {
      return e.removeEventListener(t, r);
    }) : function() {
    };
  }, [e, r, t]);
}, $i = function(e, t, n) {
  var r = D(!1), i = r[0], a = r[1], l = oe(!1), s = He();
  return Ke(e, "focusin", function() {
    i || (a(!0), t?.()), l.current && (l.current = !1);
  }), Ke(e, "focusout", function() {
    l.current = !0, s(function() {
      l.current && !e?.contains(document.activeElement) && (n?.(), l.current = !1, a(!1));
    });
  }), i;
}, vn = function(e, t, n) {
  Ke(Ie(), "keydown", function(r) {
    n && n && e.toLowerCase() === r.key.toLowerCase() && t(r);
  });
}, vt = {
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
}, bn = function() {
  return bn = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, bn.apply(this, arguments);
}, ir = function() {
  var e = ee();
  return Q(function() {
    return e.keyboardBindings ? bn(bn({}, vt), e.keyboardBindings) : vt;
  }, [e.keyboardBindings]);
}, Bi = ["input", "textarea"], we = function(e, t, n, r) {
  r === void 0 && (r = !1);
  var i = oe([]), a = ir(), l = He(), s = Q(function() {
    return a[e].map(function(c) {
      return c.split("+");
    });
  }, [e, a]);
  Ke(Ie(), "keydown", function(c) {
    var d;
    if (n !== !1 && !((Bi.includes((d = c.target.tagName) === null || d === void 0 ? void 0 : d.toLowerCase()) || c.target.isContentEditable) && !r) && !i.current.includes(c.key)) {
      i.current.push(c.key);
      var u = i.current.map(function(v) {
        return v.toLowerCase();
      }), f = s.map(function(v) {
        return u.map(function(p) {
          return v.includes(p.toLowerCase());
        }).reduce(function(p, y) {
          return p && y;
        }, !0);
      }).reduce(function(v, p) {
        return v || p;
      }, !1);
      f && (i.current.length > 1 || !/^[a-zA-Z\s]$/.test(c.key)) && c.preventDefault();
    }
  }), Ke(Ie(), "keyup", function(c) {
    if (n !== !1) {
      var d = i.current.map(function(f) {
        return f.toLowerCase();
      }), u = s.map(function(f) {
        return f.map(function(v) {
          return d.includes(v.toLowerCase());
        }).reduce(function(v, p) {
          return v && p;
        }, !0);
      }).reduce(function(f, v) {
        return f || v;
      }, !1);
      u && l(function() {
        return t(c);
      }), i.current = i.current.filter(function(f) {
        return f !== c.key;
      });
    }
  });
}, an = function() {
  var e, t = ge().treeId, n = ee().viewState;
  return (e = n[t]) !== null && e !== void 0 ? e : {};
}, Pn = function(e) {
  return ee().linearItems[e];
}, ji = function() {
  var e = ge().treeId, t = ee(), n = t.onFocusItem, r = t.items, i = Pn(e), a = an();
  return _e(function(l) {
    var s, c = (s = i.findIndex(function(v) {
      return v.item === a.focusedItem;
    })) !== null && s !== void 0 ? s : 0, d = l(c, i), u = Math.max(0, Math.min(i.length - 1, d)), f = r[i[u].item];
    return n?.(f, e), f;
  });
}, gt = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, Ki = function(e) {
  var t = oe({
    target: e,
    previous: void 0
  });
  return t.current.target !== e && (t.current.previous = t.current.target, t.current.target = e), t.current.previous;
}, ar = function(e) {
  var t = an(), n = ge().treeId, r = Pn(n), i = ee().onSelectItems, a = Ki(t.focusedItem);
  return S(function(l, s) {
    var c, d;
    s === void 0 && (s = !1);
    var u = l.index, f = function(_, h) {
      var w = gt(gt([], s ? [] : _, !0), h.filter(function(x) {
        return s || !_.includes(x);
      }), !0);
      i?.(w, n);
    };
    if (t && t.selectedItems && t.selectedItems.length > 0) {
      var v = t.focusedItem === u ? a : t.focusedItem, p = e === "last-focus" ? r.findIndex(function(_) {
        return v === _.item;
      }) : r.findIndex(function(_) {
        var h;
        return (h = t.selectedItems) === null || h === void 0 ? void 0 : h.includes(_.item);
      }), y = r.findIndex(function(_) {
        return _.item === u;
      });
      if (p < y) {
        var I = r.slice(p, y + 1).map(function(_) {
          var h = _.item;
          return h;
        });
        f((c = t.selectedItems) !== null && c !== void 0 ? c : [], I);
      } else {
        var I = r.slice(y, p + 1).map(function(h) {
          var w = h.item;
          return w;
        });
        f((d = t.selectedItems) !== null && d !== void 0 ? d : [], I);
      }
    } else
      i?.([u], n);
  }, [
    t,
    i,
    n,
    e,
    r,
    a
  ]);
}, pt = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, Ui = function() {
  var e, t = ee(), n = ge(), r = n.treeId, i = n.setRenamingItem, a = n.setSearch, l = n.renamingItem, s = Pn(r), c = Se(), d = an(), u = ji(), f = ar("first-selected"), v = t.activeTreeId === r, p = !!l, y = t.disableArrowKeys, I = !y && v && !p;
  vn("arrowdown", function(_) {
    if (_.preventDefault(), c.isProgrammaticallyDragging)
      c.programmaticDragDown();
    else {
      var h = u(function(w) {
        return w + 1;
      });
      _.shiftKey && f(h);
    }
  }, I), vn("arrowup", function(_) {
    if (_.preventDefault(), c.isProgrammaticallyDragging)
      c.programmaticDragUp();
    else {
      var h = u(function(w) {
        return w - 1;
      });
      _.shiftKey && f(h);
    }
  }, I), we("moveFocusToFirstItem", function(_) {
    _.preventDefault(), u(function() {
      return 0;
    });
  }, v && !c.isProgrammaticallyDragging && !p), we("moveFocusToLastItem", function(_) {
    _.preventDefault(), u(function(h, w) {
      return w.length - 1;
    });
  }, v && !c.isProgrammaticallyDragging && !p), vn("arrowright", function(_) {
    _.preventDefault(), u(function(h, w) {
      var x, E, F = t.items[w[h].item];
      if (F.isFolder) {
        if (!((x = d.expandedItems) === null || x === void 0) && x.includes(F.index))
          return h + 1;
        (E = t.onExpandItem) === null || E === void 0 || E.call(t, F, r);
      }
      return h;
    });
  }, I && !c.isProgrammaticallyDragging), vn("arrowleft", function(_) {
    _.preventDefault(), u(function(h, w) {
      var x, E, F = t.items[w[h].item], j = w[h].depth;
      if (F.isFolder && (!((x = d.expandedItems) === null || x === void 0) && x.includes(F.index)))
        (E = t.onCollapseItem) === null || E === void 0 || E.call(t, F, r);
      else if (j > 0) {
        var W = h;
        for (W; w[W].depth !== j - 1; W -= 1)
          ;
        return W;
      }
      return h;
    });
  }, I && !c.isProgrammaticallyDragging), we("primaryAction", function(_) {
    var h, w;
    _.preventDefault(), d.focusedItem !== void 0 && ((h = t.onSelectItems) === null || h === void 0 || h.call(t, [d.focusedItem], r), (w = t.onPrimaryAction) === null || w === void 0 || w.call(t, t.items[d.focusedItem], r));
  }, v && !c.isProgrammaticallyDragging && !p), we("toggleSelectItem", function(_) {
    var h, w, x;
    _.preventDefault(), _.stopPropagation(), d.focusedItem !== void 0 && (d.selectedItems && d.selectedItems.includes(d.focusedItem) ? (h = t.onSelectItems) === null || h === void 0 || h.call(t, d.selectedItems.filter(function(E) {
      return E !== d.focusedItem;
    }), r) : (w = t.onSelectItems) === null || w === void 0 || w.call(t, pt(pt([], (x = d.selectedItems) !== null && x !== void 0 ? x : [], !0), [d.focusedItem], !1), r));
  }, v && !c.isProgrammaticallyDragging && !p), we("selectAll", function(_) {
    var h;
    _.preventDefault(), (h = t.onSelectItems) === null || h === void 0 || h.call(t, s.map(function(w) {
      var x = w.item;
      return x;
    }), r);
  }, v && !c.isProgrammaticallyDragging && !p), we("renameItem", function(_) {
    var h;
    if (d.focusedItem !== void 0) {
      _.preventDefault();
      var w = t.items[d.focusedItem];
      w.canRename !== !1 && ((h = t.onStartRenamingItem) === null || h === void 0 || h.call(t, w, r), i(w.index));
    }
  }, v && ((e = t.canRename) !== null && e !== void 0 ? e : !0) && !p), we("startSearch", function(_) {
    var h, w;
    _.preventDefault(), a(""), (w = (h = document.querySelector('[data-rct-search-input="true"]')) === null || h === void 0 ? void 0 : h.focus) === null || w === void 0 || w.call(h);
  }, v && !c.isProgrammaticallyDragging && !p), we("startProgrammaticDnd", function(_) {
    _.preventDefault(), c.startProgrammaticDrag();
  }, v && !p), we("completeProgrammaticDnd", function(_) {
    _.preventDefault(), c.completeProgrammaticDrag();
  }, v && c.isProgrammaticallyDragging && !p), we("abortProgrammaticDnd", function(_) {
    _.preventDefault(), c.abortProgrammaticDrag();
  }, v && c.isProgrammaticallyDragging && !p);
}, or = function(e, t, n) {
  return n.toLowerCase().includes(e.toLowerCase());
}, qi = function() {
  var e = ee(), t = e.doesSearchMatchItem, n = e.items, r = e.getItemTitle, i = e.onFocusItem, a = ge(), l = a.search, s = a.treeId, c = Pn(s), d = He();
  _n(function() {
    l && l.length > 0 && d(function() {
      var u = c.find(function(f) {
        var v = f.item;
        return (t ?? or)(l, n[v], r(n[v]));
      });
      u && i?.(n[u.item], s);
    });
  }, [
    t,
    r,
    c,
    n,
    i,
    l,
    s,
    d
  ], [l]);
}, Gn = function() {
  return Gn = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Gn.apply(this, arguments);
}, Hi = function(e) {
  var t, n = e.containerRef, r = ge(), i = r.search, a = r.setSearch, l = r.treeId, s = r.renderers, c = r.renamingItem, d = ee();
  an();
  var u = d.activeTreeId === l, f = He();
  qi();
  var v = function() {
    var p, y, I;
    if (a(null), !((p = d.autoFocus) !== null && p !== void 0) || p) {
      var _ = (y = Ie()) === null || y === void 0 ? void 0 : y.querySelector('[data-rct-tree="'.concat(l, '"] [data-rct-item-focus="true"]'));
      (I = _?.focus) === null || I === void 0 || I.call(_);
    }
  };
  return we("abortSearch", function() {
    f(function() {
      v();
    });
  }, u && i !== null, !0), Ke(n, "keydown", function(p) {
    var y, I, _ = p.key.charCodeAt(0);
    (!((y = d.canSearch) !== null && y !== void 0) || y) && (!((I = d.canSearchByStartingTyping) !== null && I !== void 0) || I) && u && i === null && !c && !p.ctrlKey && !p.shiftKey && !p.altKey && !p.metaKey && (_ >= 48 && _ <= 57 || // number
    // (unicode >= 65 && unicode <= 90) || // uppercase letter
    _ >= 97 && _ <= 122) && a("");
  }), !(!((t = d.canSearch) !== null && t !== void 0) || t) || i === null ? null : s.renderSearchInput({
    inputProps: Gn({ value: i, onChange: function(p) {
      return a(p.target.value);
    }, onBlur: function() {
      v();
    }, ref: function(p) {
      var y;
      (y = p?.focus) === null || y === void 0 || y.call(p);
    }, "aria-label": "Search for items" }, {
      "data-rct-search-input": "true"
    })
  });
}, Vi = {
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
}, Ge = function(e, t, n, r, i) {
  var a = function(l) {
    return t.getItemTitle(t.items[l]);
  };
  return e.replace(/({[^\s}]+)}/g, function(l) {
    var s, c, d, u = l.slice(1, -1);
    switch (u) {
      case "treeLabel":
        return (s = r.treeLabel) !== null && s !== void 0 ? s : "";
      case "renamingItem":
        return r.renamingItem ? a(r.renamingItem) : "None";
      case "dragItems":
        return (d = (c = n.draggingItems) === null || c === void 0 ? void 0 : c.map(function(p) {
          return t.getItemTitle(p);
        }).join(", ")) !== null && d !== void 0 ? d : "None";
      case "dropTarget": {
        if (!n.draggingPosition)
          return "None";
        if (n.draggingPosition.targetType === "item" || n.draggingPosition.targetType === "root")
          return "within ".concat(a(n.draggingPosition.targetItem));
        var f = t.items[n.draggingPosition.parentItem], v = t.getItemTitle(f);
        return n.draggingPosition.childIndex === 0 ? "within ".concat(v, " at the start") : "within ".concat(v, " after ").concat(a(f.children[n.draggingPosition.childIndex - 1]));
      }
      default:
        if (u.startsWith("keybinding:"))
          return i[u.slice(11)][0];
        throw Error("Unknown live descriptor variable {".concat(u, "}"));
    }
  });
}, Xe = function(e) {
  var t = e.children, n = e.live;
  return Z("div", { "aria-live": n, dangerouslySetInnerHTML: { __html: t } });
}, Wi = function() {
  var e = ee(), t = ge(), n = Se(), r = ir(), i = Q(function() {
    var l;
    return (l = e.liveDescriptors) !== null && l !== void 0 ? l : Vi;
  }, [e.liveDescriptors]), a = t.renderers.renderLiveDescriptorContainer;
  return t.treeInformation.isRenaming ? Z(
    a,
    { tree: t },
    Z(Xe, { live: "polite" }, Ge(i.renamingItem, e, n, t, r))
  ) : t.treeInformation.isSearching ? Z(
    a,
    { tree: t },
    Z(Xe, { live: "polite" }, Ge(i.searching, e, n, t, r))
  ) : t.treeInformation.isProgrammaticallyDragging ? Z(
    a,
    { tree: t },
    Z(Xe, { live: "polite" }, Ge(i.programmaticallyDragging, e, n, t, r)),
    Z(Xe, { live: "assertive" }, Ge(i.programmaticallyDraggingTarget, e, n, t, r))
  ) : Z(
    a,
    { tree: t },
    Z(Xe, { live: "off" }, Ge(i.introduction, e, n, t, r))
  );
}, Gi = function() {
  var e, t = ee();
  return !((e = t.showLiveDescription) !== null && e !== void 0) || e ? Z(Wi, null) : null;
}, Xn = function() {
  return Xn = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Xn.apply(this, arguments);
}, Xi = function() {
  var e = ge(), t = e.treeId, n = e.rootItem, r = e.renderers, i = e.treeInformation, a = ee(), l = oe(), s = Se();
  Ui(), $i(l.current, function() {
    a.setActiveTree(t);
  }, function() {
    a.setActiveTree(function(f) {
      return f === t ? void 0 : f;
    });
  });
  var c = a.items[n].children, d = Z(
    Zr,
    null,
    Z(Gi, null),
    Z(sr, { depth: 0, parentId: n }, c ?? []),
    Z(zi, { treeId: t }),
    Z(Hi, { containerRef: l.current })
  ), u = Xn({ onDragOver: function(f) {
    f.preventDefault(), s.onDragOverTreeHandler(f, t, l);
  }, onDragLeave: function(f) {
    s.onDragLeaveContainerHandler(f, l);
  }, onMouseDown: function() {
    return s.abortProgrammaticDrag();
  }, ref: l, style: { position: "relative" }, role: "tree", "aria-label": i.treeLabelledBy ? void 0 : i.treeLabel, "aria-labelledby": i.treeLabelledBy }, {
    "data-rct-tree": t
  });
  return r.renderTreeContainer({
    children: d,
    info: i,
    containerProps: u
  });
}, Yi = function(e, t, n) {
  var r, i = ee(), a = Se(), l = (r = i.viewState[e.treeId]) === null || r === void 0 ? void 0 : r.selectedItems;
  return Q(function() {
    var s, c;
    return {
      isFocused: i.activeTreeId === e.treeId,
      isRenaming: !!t,
      areItemsSelected: ((s = l?.length) !== null && s !== void 0 ? s : 0) > 0,
      isSearching: n !== null,
      search: n,
      isProgrammaticallyDragging: (c = a.isProgrammaticallyDragging) !== null && c !== void 0 ? c : !1,
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
    l?.length,
    n,
    a.isProgrammaticallyDragging
  ]);
}, Je = function() {
  return Je = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Je.apply(this, arguments);
}, Qi = function(e, t) {
  var n = ee(), r = ge(), i = Se();
  Mt(e, function() {
    return Je(Je(Je({}, t), { treeEnvironmentContext: n, dragAndDropContext: i, treeContext: r }), r.treeInformation);
  });
}, Zi = Ue(null), Ji = Nn(function(e, t) {
  ee();
  var n = ge();
  Se();
  var r = Ti(), i = Q(function() {
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
      focusItem: function(a, l) {
        l === void 0 && (l = !0), r.focusItem(a, n.treeId, l);
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
      renameItem: function(a, l) {
        r.renameItem(a, l, n.treeId);
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
  return Qi(t, i), Z(Zi.Provider, { value: i }, e.children);
}), kn = function() {
  return kn = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, kn.apply(this, arguments);
}, lr = Ue(null), ge = function() {
  return rn(lr);
}, ea = Nn(function(e, t) {
  var n, r = ee(), i = Q(function() {
    return kn(kn({}, r), e);
  }, [e, r]), a = D(null), l = a[0], s = a[1], c = D(null), d = c[0], u = c[1], f = r.items[e.rootItem], v = r.viewState[e.treeId];
  te(function() {
    return r.registerTree({
      treeId: e.treeId,
      rootItem: e.rootItem
    }), function() {
      return r.unregisterTree(e.treeId);
    };
  }, [e.treeId, e.rootItem]);
  var p = Yi(e, d, l), y = Q(function() {
    return {
      treeId: e.treeId,
      rootItem: e.rootItem,
      treeLabel: e.treeLabel,
      treeLabelledBy: e.treeLabelledBy,
      getItemsLinearly: function() {
        return Jn(e.rootItem, v ?? {}, r.items);
      },
      treeInformation: p,
      search: l,
      setSearch: s,
      renamingItem: d,
      setRenamingItem: u,
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
    l,
    p,
    v
  ]);
  return f === void 0 ? ((n = r.onMissingItems) === null || n === void 0 || n.call(r, [e.rootItem]), null) : Z(
    lr.Provider,
    { value: y },
    Z(
      Ji,
      { ref: t },
      Z(Xi, null)
    )
  );
}), sr = function(e) {
  for (var t = ge(), n = t.renderers, r = t.treeInformation, i = [], a = 0, l = e.children; a < l.length; a++) {
    var s = l[a];
    i.push(G.createElement(ra, { key: s, itemIndex: s, depth: e.depth }));
  }
  if (i.length === 0)
    return null;
  var c = {
    role: e.depth !== 0 ? "group" : void 0
  };
  return n.renderItemsContainer({
    children: i,
    info: r,
    containerProps: c,
    depth: e.depth,
    parentId: e.parentId
  });
}, Le = function() {
  return Le = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, Le.apply(this, arguments);
}, ht = function(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++)
    (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, na = function(e) {
  var t, n, r, i, a = ge(), l = a.treeId, s = a.search, c = a.renamingItem, d = a.setRenamingItem, u = ee(), f = yi(), v = Se(), p = ar("last-focus"), y = e && u.getItemTitle(e), I = Qt(), _ = Q(function() {
    var E;
    return s === null || s.length === 0 || !e || !y ? !1 : ((E = u.doesSearchMatchItem) !== null && E !== void 0 ? E : or)(s, e, y);
  }, [s, e, y, u.doesSearchMatchItem]), h = e && ((n = (t = u.viewState[l]) === null || t === void 0 ? void 0 : t.selectedItems) === null || n === void 0 ? void 0 : n.includes(e.index)), w = e && ((i = (r = u.viewState[l]) === null || r === void 0 ? void 0 : r.expandedItems) === null || i === void 0 ? void 0 : i.includes(e.index)), x = e && c === e.index;
  return Q(function() {
    var E, F, j, W, re, ne, ue, ae, de;
    if (e) {
      var U = u.viewState[l], A = ((F = (E = U?.selectedItems) === null || E === void 0 ? void 0 : E.map(function(k) {
        return u.items[k];
      })) !== null && F !== void 0 ? F : U?.focusedItem ? [u.items[U?.focusedItem]] : []).filter(function(k) {
        return !!k;
      }), O = !!A.find(function(k) {
        return k.index === e.index;
      }), z = A && ((W = (j = u.canDrag) === null || j === void 0 ? void 0 : j.call(u, A)) !== null && W !== void 0 ? W : !0) && A.map(function(k) {
        var B;
        return (B = k.canMove) !== null && B !== void 0 ? B : !0;
      }).reduce(function(k, B) {
        return k && B;
      }, !0), ie = ((ne = (re = u.canDrag) === null || re === void 0 ? void 0 : re.call(u, [e])) !== null && ne !== void 0 ? ne : !0) && ((ue = e.canMove) !== null && ue !== void 0 ? ue : !0), X = u.canDragAndDrop && (O && z || !O && ie), J = u.canDragAndDrop && !!(!((de = (ae = v.viableDragPositions) === null || ae === void 0 ? void 0 : ae[l]) === null || de === void 0) && de.find(function(k) {
        return k.targetType === "item" && k.targetItem === e.index;
      })), P = {
        // TODO disable most actions during rename
        primaryAction: function() {
          var k;
          (k = u.onPrimaryAction) === null || k === void 0 || k.call(u, u.items[e.index], l);
        },
        collapseItem: function() {
          var k;
          (k = u.onCollapseItem) === null || k === void 0 || k.call(u, e, l);
        },
        expandItem: function() {
          var k;
          (k = u.onExpandItem) === null || k === void 0 || k.call(u, e, l);
        },
        toggleExpandedState: function() {
          var k, B;
          w ? (k = u.onCollapseItem) === null || k === void 0 || k.call(u, e, l) : (B = u.onExpandItem) === null || B === void 0 || B.call(u, e, l);
        },
        selectItem: function() {
          var k;
          (k = u.onSelectItems) === null || k === void 0 || k.call(u, [e.index], l);
        },
        addToSelectedItems: function() {
          var k, B;
          (k = u.onSelectItems) === null || k === void 0 || k.call(u, ht(ht([], (B = U?.selectedItems) !== null && B !== void 0 ? B : [], !0), [e.index], !1), l);
        },
        unselectItem: function() {
          var k, B, he;
          (k = u.onSelectItems) === null || k === void 0 || k.call(u, (he = (B = U?.selectedItems) === null || B === void 0 ? void 0 : B.filter(function(xe) {
            return xe !== e.index;
          })) !== null && he !== void 0 ? he : [], l);
        },
        selectUpTo: function(k) {
          p(e, k);
        },
        startRenamingItem: function() {
          d(e.index);
        },
        stopRenamingItem: function() {
          d(null);
        },
        focusItem: function(k) {
          var B;
          k === void 0 && (k = !0), (B = u.onFocusItem) === null || B === void 0 || B.call(u, e, l, k);
        },
        startDragging: function() {
          var k, B, he = (k = U?.selectedItems) !== null && k !== void 0 ? k : [];
          if (he.includes(e.index) || (he = [e.index], (B = u.onSelectItems) === null || B === void 0 || B.call(u, he, l)), X) {
            var xe = I(l, he.map(function(Tn) {
              return u.items[Tn];
            }));
            v.onStartDraggingItems(xe, l);
          }
        }
      }, L = {
        isSelected: h,
        isExpanded: w,
        isFocused: U?.focusedItem === e.index,
        isRenaming: x,
        isDraggingOver: v.draggingPosition && v.draggingPosition.targetType === "item" && v.draggingPosition.targetItem === e.index && v.draggingPosition.treeId === l,
        isDraggingOverParent: !1,
        isSearchMatching: _,
        canDrag: X,
        canDropOn: J
      }, N = Le(Le({}, f.createInteractiveElementProps(e, l, P, L, U)), {
        "data-rct-item-interactive": !0,
        "data-rct-item-focus": L.isFocused ? "true" : "false",
        "data-rct-item-id": e.index
      }), M = Le({}, {
        "data-rct-item-container": "true"
      }), C = {
        role: "treeitem",
        "aria-selected": L.isSelected,
        "aria-expanded": e.isFolder ? L.isExpanded ? "true" : "false" : void 0
      }, R = {
        onClick: function() {
          e.isFolder && P.toggleExpandedState(), P.selectItem();
        },
        onFocus: function() {
          P.focusItem();
        },
        onDragOver: function(k) {
          k.preventDefault();
        },
        "aria-hidden": !0,
        tabIndex: -1
      }, K = U ? Object.entries(U).reduce(function(k, B) {
        var he = B[0], xe = B[1];
        return k[he] = Array.isArray(xe) ? xe.includes(e.index) : xe === e.index, k;
      }, {}) : {};
      return Le(Le(Le({}, P), L), { interactiveElementProps: N, itemContainerWithChildrenProps: C, itemContainerWithoutChildrenProps: M, arrowProps: R, viewStateFlags: K });
    }
  }, [
    e,
    u,
    l,
    v,
    h,
    w,
    x,
    _,
    f,
    p,
    d,
    I
  ]);
}, ta = function(e) {
  var t = ge(), n = t.renderers, r = t.treeInformation, i = t.setRenamingItem, a = t.treeId, l = ee(), s = oe(null), c = oe(null), d = l.items[e.itemIndex], u = D(l.getItemTitle(d)), f = u[0], v = u[1], p = He(!0), y = function() {
    var x;
    (x = l.onAbortRenamingItem) === null || x === void 0 || x.call(l, d, r.treeId), i(null), p(function() {
      l.setActiveTree(a);
    });
  }, I = function() {
    var x;
    (x = l.onRenameItem) === null || x === void 0 || x.call(l, d, f, r.treeId), i(null), p(function() {
      l.setActiveTree(a);
    });
  };
  _n(function() {
    var x, E, F, j;
    l.setActiveTree(a), (!((x = l.autoFocus) !== null && x !== void 0) || x) && ((E = s.current) === null || E === void 0 || E.select(), (j = (F = s.current) === null || F === void 0 ? void 0 : F.focus) === null || j === void 0 || j.call(F));
  }, [l, a], []), we("abortRenameItem", function() {
    y();
  }, !0, !0);
  var _ = {
    value: f,
    onChange: function(x) {
      v(x.target.value);
    },
    onBlur: function(x) {
      (!x.relatedTarget || x.relatedTarget !== c.current) && y();
    },
    "aria-label": "New item name",
    tabIndex: 0
  }, h = {
    onClick: function(x) {
      x.stopPropagation(), I();
    }
  }, w = {
    onSubmit: function(x) {
      x.preventDefault(), I();
    }
  };
  return n.renderRenameInput({
    item: d,
    inputRef: s,
    submitButtonProps: h,
    submitButtonRef: c,
    formProps: w,
    inputProps: _
  });
}, ra = function(e) {
  var t, n, r, i, a = D(!1), l = a[0], s = a[1], c = ge(), d = c.renderers, u = c.treeInformation, f = c.renamingItem, v = ee(), p = an(), y = v.items[e.itemIndex], I = Q(function() {
    var j;
    return (j = p.expandedItems) === null || j === void 0 ? void 0 : j.includes(e.itemIndex);
  }, [e.itemIndex, p.expandedItems]), _ = na(y);
  if (y === void 0 || _ === void 0)
    return l || (s(!0), (t = v.onMissingItems) === null || t === void 0 || t.call(v, [e.itemIndex])), null;
  var h = (r = (n = v.shouldRenderChildren) === null || n === void 0 ? void 0 : n.call(v, y, _)) !== null && r !== void 0 ? r : y.isFolder && I, w = y.children && h && G.createElement(sr, { depth: e.depth + 1, parentId: e.itemIndex }, y.children), x = v.getItemTitle(y), E = f === e.itemIndex ? G.createElement(ta, { itemIndex: e.itemIndex }) : d.renderItemTitle({
    info: u,
    context: _,
    title: x,
    item: y
  }), F = d.renderItemArrow({
    info: u,
    context: _,
    item: v.items[e.itemIndex]
  });
  return (i = d.renderItem({
    item: v.items[e.itemIndex],
    depth: e.depth,
    title: E,
    arrow: F,
    context: _,
    info: u,
    children: w
  })) !== null && i !== void 0 ? i : null;
};
const dr = pi.request;
async function se(e, t, n) {
  const r = await dr(e, t, n);
  return ur(r) ? cr(r) : r;
}
function cr(e) {
  if (typeof e.code == "number" && e.code !== 0)
    throw new Error(e.msg || e.message || "请求失败");
  if (typeof e.status == "number" && e.status !== 1)
    throw new Error(e.msg || e.message || "请求失败");
  return e.data;
}
function ur(e) {
  return typeof e == "object" && e !== null && ("data" in e || "code" in e || "status" in e || "msg" in e || "message" in e);
}
function ia(e) {
  return se(
    "/bot/admin/knowledge/file_manager_data",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID
    }
  );
}
function wt(e) {
  return se(
    "/bot/admin/knowledge/file_content",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID,
      id: e.id
    }
  );
}
function zn(e) {
  return se(
    "/bot/admin/knowledge/file_index_detail",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID,
      id: e.id
    }
  );
}
function aa(e) {
  return se(
    "/bot/admin/knowledge/index_overview",
    "get",
    {
      knowledge_base_id: e.knowledgeBaseID
    }
  );
}
function oa(e) {
  return se(
    "/bot/admin/knowledge/index_status",
    "get",
    { knowledge_base_id: e.knowledgeBaseID }
  );
}
function la(e) {
  return se("/bot/admin/knowledge/tree", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    parent_id: e.parentID || 0,
    depth: e.depth || 4,
    limit: e.limit || 120
  });
}
function sa(e) {
  return se("/bot/admin/knowledge/graph", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    limit: e.limit || 180
  });
}
function da(e) {
  return se("/bot/admin/knowledge/node_open", "get", {
    node_id: e.nodeID
  });
}
function ca(e) {
  return se("/bot/admin/knowledge/retrieve_debug", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    agent_id: e.agentID || 0,
    query: e.query,
    limit: e.limit || 8
  });
}
function ua(e) {
  return se("/bot/admin/knowledge/create_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    parent: e.parent,
    parent_id: e.parent,
    name: e.name,
    type: e.type,
    content_base64: e.contentBase64 || ""
  });
}
async function fa(e) {
  const t = new FormData();
  t.set("knowledge_base_id", String(e.knowledgeBaseID)), t.set("parent", e.parent), t.set("parent_id", e.parent), t.set("name", e.name), t.set("type", "file"), t.set("upload_id", e.uploadID), t.set("part_number", String(e.partNumber)), t.set("total_parts", String(e.totalParts)), t.set("file", e.chunk, e.name);
  const n = await dr(
    "/bot/admin/knowledge/create_file",
    "post",
    t
  );
  return ur(n) ? cr(n) : n;
}
function It(e) {
  return se("/bot/admin/knowledge/rename_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    id: e.id,
    name: e.name
  });
}
function ma(e) {
  return se("/bot/admin/knowledge/save_file", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    id: e.id,
    content: e.content
  });
}
function va(e) {
  return se("/bot/admin/knowledge/index_base", "post", {
    knowledge_base_id: e.knowledgeBaseID
  });
}
function fr(e) {
  return se("/bot/admin/knowledge/review_doc", "post", {
    doc_ids: [e.docID],
    review_status: e.status
  });
}
function ga(e) {
  return se("/bot/admin/knowledge/review_docs", "get", {
    knowledge_base_id: e.knowledgeBaseID,
    review_status: e.status || "pending",
    page: e.page || 1,
    pageSize: e.pageSize || 100
  });
}
function pa(e) {
  return se("/bot/admin/knowledge/set_expiration", "post", {
    doc_ids: [e.docID],
    expires_at: e.expiresAt || ""
  });
}
function ha(e) {
  return se("/bot/admin/knowledge/delete_files", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    ids: e.ids
  });
}
function wa(e) {
  return se("/bot/admin/knowledge/move_files", "post", {
    knowledge_base_id: e.knowledgeBaseID,
    ids: e.ids,
    target: e.target,
    operation: "move"
  });
}
function Ia(e, t) {
  return `/bot/admin/knowledge/download_file?${new URLSearchParams({
    knowledge_base_id: String(e),
    id: t
  }).toString()}`;
}
function _a(e, t) {
  return `/bot/admin/knowledge/download_file?${new URLSearchParams({
    knowledge_base_id: String(e),
    id: t,
    preview: "1"
  }).toString()}`;
}
function xa(e, t) {
  const n = t && t !== "/" ? `${t}/` : "";
  return `/bot/admin/knowledge/download_file?knowledge_base_id=${encodeURIComponent(
    String(e)
  )}&id=${encodeURIComponent(n)}`;
}
function _t(e) {
  return ya(e);
}
function ya(e) {
  const t = ba(e), n = t.lastIndexOf("/");
  return n > 0 ? t.slice(0, n) : "/";
}
function ba(e) {
  const t = String(e || "").trim().replace(/\\/g, "/").replace(/\/+/g, "/");
  return !t || t === "." ? "/" : t.replace(/^\/+/, "") || "/";
}
function ka(e, t, n, r = /* @__PURE__ */ new Set()) {
  const i = mr(n) || "附件", a = new Set(
    e.filter((d) => d.parent_id === t && d.type === "file").map((d) => String(d.name || "").toLowerCase())
  );
  for (const d of r)
    a.add(d.toLowerCase());
  if (!a.has(i.toLowerCase()))
    return i;
  const l = i.lastIndexOf("."), s = l > 0 ? i.slice(0, l) : i, c = l > 0 ? i.slice(l) : "";
  for (let d = 1; d < 1e3; d += 1) {
    const u = `${s} ${d}${c}`;
    if (!a.has(u.toLowerCase()))
      return u;
  }
  return `${s} ${Date.now()}${c}`;
}
function dl(e, t) {
  const n = mr(e);
  if (!n)
    return "";
  const r = Da(n), i = Sa(n);
  return t === "image" ? `![${i}](<${r}>)` : `[${i}](<${r}>)`;
}
function cl(e) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(e);
}
function mr(e) {
  return String(e || "").trim().replace(/\\/g, "-").replace(/\//g, "-").replace(/[\u0000-\u001f]/g, "");
}
function Da(e) {
  return e.split("/").map((t) => encodeURIComponent(t)).join("/");
}
function Sa(e) {
  return e.replace(/([\\\]])/g, "\\$1");
}
const Na = /* @__PURE__ */ new Set(["md", "markdown", "mdown", "mkd"]), Pa = /* @__PURE__ */ new Set(["txt", "log"]), Ca = /* @__PURE__ */ new Set([
  "css",
  "csv",
  "go",
  "graphql",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "less",
  "php",
  "py",
  "rb",
  "rs",
  "scss",
  "sql",
  "toml",
  "ts",
  "tsx",
  "vue",
  "xml",
  "yaml",
  "yml"
]), Ta = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"]), Ea = /* @__PURE__ */ new Set(["avi", "m4v", "mkv", "mov", "mp4", "mpeg", "mpg", "webm"]), La = /* @__PURE__ */ new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav", "weba"]), Fa = /* @__PURE__ */ new Set([
  "doc",
  "docx",
  "odp",
  "ods",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx"
]), Ra = /* @__PURE__ */ new Set(["7z", "gz", "rar", "tar", "zip"]);
function Oa(e) {
  const t = Ma(e.name), n = String(e.mime_type || "").toLowerCase();
  return Na.has(t) ? "markdown" : t === "html" || t === "htm" || n.includes("text/html") ? "html" : Ca.has(t) ? "code" : Pa.has(t) || n.startsWith("text/") ? "text" : t === "pdf" || n.includes("pdf") ? "pdf" : Ta.has(t) || n.startsWith("image/") ? "image" : Ea.has(t) || n.startsWith("video/") ? "video" : La.has(t) || n.startsWith("audio/") ? "audio" : Fa.has(t) || Aa(n) ? "office" : Ra.has(t) ? "archive" : "unknown";
}
function Ma(e) {
  const t = String(e || "").trim().toLowerCase(), n = t.lastIndexOf(".");
  return n >= 0 ? t.slice(n + 1) : "";
}
function Aa(e) {
  return e.includes("msword") || e.includes("ms-excel") || e.includes("ms-powerpoint") || e.includes("officedocument") || e.includes("opendocument");
}
const za = hi.FirstFrameVideo, $a = At(
  () => import("./code-editor-Bzxvv-i1.js").then((e) => e.v).then((e) => ({
    default: e.KnowledgeCodeEditor
  }))
), Ba = At(
  () => import("./markdown-live-editor-BpDuWQ2b.js").then((e) => ({
    default: e.MarkdownLiveEditor
  }))
);
function ja({
  active: e,
  file: t,
  content: n,
  downloadURL: r,
  previewURL: i,
  linkBaseURL: a,
  onUploadAttachments: l,
  onAttachmentError: s,
  onStatusChange: c,
  onChange: d
}) {
  const u = t ? Oa(t) : null, f = !!(e && t?.editable && u && Ka(u));
  let v = null;
  return f && t ? v = /* @__PURE__ */ o(ut, { fallback: /* @__PURE__ */ o(xt, { onStatusChange: c }), children: /* @__PURE__ */ o(
    Ba,
    {
      active: !0,
      value: n,
      linkBaseURL: a,
      onUploadAttachments: l,
      onAttachmentError: s,
      onStatusChange: c,
      onChange: d
    }
  ) }) : e && t && u && (t.editable ? v = /* @__PURE__ */ o(ut, { fallback: /* @__PURE__ */ o(xt, { onStatusChange: c }), children: /* @__PURE__ */ o(
    $a,
    {
      file: t,
      content: n,
      kind: u,
      onChange: d
    }
  ) }) : t.editable || (v = /* @__PURE__ */ o(
    Ua,
    {
      file: t,
      kind: u,
      downloadURL: r,
      previewURL: i,
      onStatusChange: c
    }
  ))), v;
}
function Ka(e) {
  return e === "markdown";
}
function xt({
  onStatusChange: e
}) {
  return on("编辑器加载中", e), /* @__PURE__ */ g("div", { className: "knowledge-file-preview is-centered", "aria-live": "polite", children: [
    /* @__PURE__ */ o(Oe, { size: 42 }),
    /* @__PURE__ */ o("strong", { children: "编辑器加载中" })
  ] });
}
function Ua({
  file: e,
  kind: t,
  downloadURL: n,
  previewURL: r,
  onStatusChange: i
}) {
  return t === "image" ? /* @__PURE__ */ o(
    qa,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "video" ? /* @__PURE__ */ o(
    Ha,
    {
      file: e,
      downloadURL: n,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "audio" ? /* @__PURE__ */ o(
    Va,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : t === "pdf" ? /* @__PURE__ */ o(
    Wa,
    {
      file: e,
      previewURL: r,
      onStatusChange: i
    }
  ) : /* @__PURE__ */ g("div", { className: "knowledge-file-preview is-centered", children: [
    Ga(t),
    /* @__PURE__ */ o("strong", { children: e.name }),
    /* @__PURE__ */ o("span", { children: Xa(t) }),
    /* @__PURE__ */ o("a", { href: n, target: "_blank", rel: "noreferrer", children: "下载文件" })
  ] });
}
function qa({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = D(!0);
  return te(() => {
    i(!0);
  }, [t]), on(r ? "图片加载中" : "", n), /* @__PURE__ */ o("div", { className: "knowledge-file-preview is-media", children: /* @__PURE__ */ o(
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
function Ha({
  file: e,
  downloadURL: t,
  previewURL: n,
  onStatusChange: r
}) {
  const [i, a] = D(!0), [l, s] = D(!1);
  return te(() => {
    a(!0), s(!1);
  }, [n]), on(i ? "视频加载中" : "", r), l ? /* @__PURE__ */ g("div", { className: "knowledge-file-preview is-centered", children: [
    /* @__PURE__ */ o($t, { size: 42 }),
    /* @__PURE__ */ o("strong", { children: e.name }),
    /* @__PURE__ */ o("span", { children: "当前浏览器无法播放该视频，可能是编码格式不支持。可以下载后查看。" }),
    /* @__PURE__ */ o("a", { href: t, target: "_blank", rel: "noreferrer", children: "下载文件" })
  ] }) : /* @__PURE__ */ o("div", { className: "knowledge-file-preview is-media", children: /* @__PURE__ */ o(
    za,
    {
      src: n,
      controls: !0,
      preload: "metadata",
      onFirstFrameReady: () => a(!1),
      onError: () => {
        a(!1), s(!0);
      }
    }
  ) });
}
function Va({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = D(!0);
  return te(() => {
    i(!0);
  }, [t]), on(r ? "音频加载中" : "", n), /* @__PURE__ */ g("div", { className: "knowledge-file-preview is-centered", children: [
    /* @__PURE__ */ o(Jr, { size: 42 }),
    /* @__PURE__ */ o("strong", { children: e.name }),
    /* @__PURE__ */ o(
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
function Wa({
  file: e,
  previewURL: t,
  onStatusChange: n
}) {
  const [r, i] = D(!0);
  return te(() => {
    i(!0);
  }, [t]), on(r ? "文件加载中" : "", n), /* @__PURE__ */ o("div", { className: "knowledge-file-preview is-frame", children: /* @__PURE__ */ o("iframe", { src: t, title: e.name, onLoad: () => i(!1) }) });
}
function on(e, t) {
  te(() => {
    t(e ? { label: e } : null);
  }, [e, t]), te(() => () => t(null), [t]);
}
function Ga(e) {
  return e === "office" ? /* @__PURE__ */ o(Oe, { size: 42 }) : e === "archive" ? /* @__PURE__ */ o(ei, { size: 42 }) : e === "video" ? /* @__PURE__ */ o($t, { size: 42 }) : e === "image" ? /* @__PURE__ */ o(ni, { size: 42 }) : /* @__PURE__ */ o(Oe, { size: 42 });
}
function Xa(e) {
  return e === "office" ? "Office 文件当前支持下载和后续索引抽取，在线预览/编辑后续接 ONLYOFFICE。" : e === "archive" ? "压缩包会保留原文件，后续可做批量导入和索引。" : "该文件暂不支持在线编辑，可以下载查看。";
}
const Ya = 2400, Qa = 4, Za = 500, Ja = 240;
function eo({
  knowledgeBaseID: e,
  mode: t,
  open: n,
  onClose: r,
  onRefreshFiles: i
}) {
  const [a, l] = D(null), [s, c] = D([]), [d, u] = D({ nodes: [], edges: [] }), [f, v] = D("tree"), [p, y] = D(""), [I, _] = D("all"), [h, w] = D(0), [x, E] = D(0), [F, j] = D(null), [W, re] = D(() => /* @__PURE__ */ new Set()), [ne, ue] = D(!1), [ae, de] = D(!1), [U, A] = D(!1), O = oe(!1), z = Q(
    () => pr(d, p, I),
    [d, I, p]
  ), ie = Number(t) === 1, X = Q(() => a ? ln(a.base.index_status) === "running" || a.docs.running > 0 || a.nodes.running > 0 : !1, [a]);
  te(() => {
    l(null), c([]), u({ nodes: [], edges: [] }), v("tree"), y(""), _("all"), w(0), E(0), j(null), re(/* @__PURE__ */ new Set()), O.current = !1;
  }, [e]);
  const J = S(
    async (C = !1) => {
      if (e) {
        C || ue(!0);
        try {
          const [R, K] = await Promise.all([
            aa({ knowledgeBaseID: e }),
            la({
              knowledgeBaseID: e,
              depth: Qa,
              limit: Za
            })
          ]);
          l(R), c(K.nodes || []), re((k) => O.current || k.size > 0 ? k : new Set(K.nodes.flatMap((B) => Yn(B)))), O.current = !0, E((k) => k || fo(K.nodes || [])?.id || 0);
        } catch (R) {
          C || Y.error($n(R, "加载知识地图失败"));
        } finally {
          C || ue(!1);
        }
      }
    },
    [e]
  ), P = S(
    async (C = !1) => {
      if (e) {
        C || de(!0);
        try {
          const R = await sa({
            knowledgeBaseID: e,
            limit: Ja
          });
          u({
            nodes: R.nodes || [],
            edges: R.edges || []
          });
        } catch (R) {
          C || Y.error($n(R, "加载关系图谱失败"));
        } finally {
          C || de(!1);
        }
      }
    },
    [e]
  );
  te(() => {
    n && J();
  }, [n, J]), te(() => {
    !n || f !== "graph" || P();
  }, [n, P, f]), te(() => {
    if (!n || !X)
      return;
    const C = window.setInterval(() => {
      J(!0), f === "graph" && P(!0), i?.();
    }, Ya);
    return () => window.clearInterval(C);
  }, [X, i, n, P, J, f]), te(() => {
    if (!n)
      return;
    const C = (R) => {
      R.key === "Escape" && r();
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [r, n]), te(() => {
    if (!n || !x) {
      j(null);
      return;
    }
    A(!0), da({ nodeID: x }).then(j).catch((C) => Y.error($n(C, "加载知识节点失败"))).finally(() => A(!1));
  }, [n, x]);
  const L = S((C) => {
    re((R) => {
      const K = new Set(R);
      return K.has(C) ? K.delete(C) : K.add(C), K;
    });
  }, []), N = S(() => {
    re(new Set(s.flatMap((C) => Yn(C))));
  }, [s]), M = S(() => {
    re(/* @__PURE__ */ new Set());
  }, []);
  return n ? /* @__PURE__ */ o(
    "div",
    {
      className: "knowledge-index-map",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "知识地图",
      onMouseDown: (C) => {
        C.target === C.currentTarget && r();
      },
      children: /* @__PURE__ */ g(
        "div",
        {
          className: "knowledge-index-map__panel",
          onMouseDown: (C) => C.stopPropagation(),
          children: [
            /* @__PURE__ */ g("header", { className: "knowledge-index-map__header", children: [
              /* @__PURE__ */ g("div", { children: [
                /* @__PURE__ */ o("strong", { children: "知识地图" }),
                /* @__PURE__ */ o("span", { children: a?.base.name || "查看索引结构、进度和错误状态" })
              ] }),
              /* @__PURE__ */ g("div", { className: "knowledge-index-map__actions", children: [
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      J(), f === "graph" && P(), i?.();
                    },
                    disabled: ne || ae,
                    title: "刷新",
                    children: /* @__PURE__ */ o(ke, { size: 16, className: ne || ae ? "is-spinning" : "" })
                  }
                ),
                /* @__PURE__ */ o("button", { type: "button", onClick: r, title: "关闭", "aria-label": "关闭知识地图", children: /* @__PURE__ */ o(ti, { size: 17 }) })
              ] })
            ] }),
            /* @__PURE__ */ g("section", { className: "knowledge-index-map__overview", children: [
              /* @__PURE__ */ o(no, { overview: a, loading: ne }),
              /* @__PURE__ */ o(to, { stages: a?.stages || [] }),
              /* @__PURE__ */ o(yt, { title: "文档状态", counts: a?.docs }),
              /* @__PURE__ */ o(yt, { title: "节点状态", counts: a?.nodes })
            ] }),
            /* @__PURE__ */ g("main", { className: "knowledge-index-map__content", children: [
              /* @__PURE__ */ g("section", { className: "knowledge-index-map__tree", children: [
                /* @__PURE__ */ g("div", { className: "knowledge-index-map__section-head", children: [
                  /* @__PURE__ */ g("div", { children: [
                    /* @__PURE__ */ o("strong", { children: f === "tree" ? "目录图谱" : "关系图谱" }),
                    /* @__PURE__ */ o("span", { children: f === "tree" ? "目录 → 文档 → 文档目录节点" : "文档节点 → 概念 → 概念关系" })
                  ] }),
                  /* @__PURE__ */ g("div", { className: "knowledge-index-map__section-actions", children: [
                    /* @__PURE__ */ g("div", { className: "knowledge-index-map-search", children: [
                      /* @__PURE__ */ o(hn, { size: 14 }),
                      /* @__PURE__ */ o(
                        "input",
                        {
                          value: p,
                          onChange: (C) => y(C.target.value),
                          placeholder: "搜索节点"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ o(ro, { value: f, onChange: v }),
                    f === "graph" ? /* @__PURE__ */ o(io, { value: I, onChange: _ }) : null,
                    f === "tree" ? /* @__PURE__ */ g(Ot, { children: [
                      /* @__PURE__ */ o("button", { type: "button", onClick: N, children: "展开" }),
                      /* @__PURE__ */ o("button", { type: "button", onClick: M, children: "收起" })
                    ] }) : /* @__PURE__ */ o(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          P();
                        },
                        disabled: ae,
                        children: "刷新"
                      }
                    )
                  ] })
                ] }),
                f === "tree" ? /* @__PURE__ */ o(
                  ao,
                  {
                    loading: ne,
                    tree: s,
                    query: p,
                    expandedIDs: W,
                    selectedNodeID: x,
                    onToggle: L,
                    onSelect: E
                  }
                ) : /* @__PURE__ */ o(
                  oo,
                  {
                    graph: d,
                    loading: ae,
                    enhancedMode: ie,
                    query: p,
                    typeFilter: I,
                    selectedNodeID: x,
                    selectedEdgeID: h,
                    onSelectNode: E,
                    onSelectEdge: w
                  }
                )
              ] }),
              /* @__PURE__ */ g("aside", { className: "knowledge-index-map__detail", children: [
                /* @__PURE__ */ o(lo, { detail: F, loading: U }),
                /* @__PURE__ */ o(co, { edge: mo(z, h), nodes: z.nodes || [] }),
                /* @__PURE__ */ o(so, { errors: a?.recent_errors || [] })
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
function no({
  overview: e,
  loading: t
}) {
  const n = ln(e?.base.index_status), r = Cn(n), i = Qn(e?.progress || 0, 0, 100), a = r.icon;
  return /* @__PURE__ */ g("article", { className: "knowledge-index-map-summary", children: [
    /* @__PURE__ */ g("div", { className: "knowledge-index-map-summary__title", children: [
      /* @__PURE__ */ g("span", { children: [
        /* @__PURE__ */ o(a, { size: 16, className: n === "running" || t ? "is-spinning" : "" }),
        r.label
      ] }),
      /* @__PURE__ */ g("strong", { children: [
        i,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ o("div", { className: "knowledge-index-map-summary__bar", children: /* @__PURE__ */ o("span", { style: { width: `${i}%` } }) }),
    e?.base.error_message ? /* @__PURE__ */ o("p", { className: "knowledge-index-map-summary__error", children: e.base.error_message }) : /* @__PURE__ */ g("p", { children: [
      "已索引 ",
      e?.docs.success || 0,
      " / ",
      e?.docs.total || 0,
      " 个文档"
    ] })
  ] });
}
function yt({
  title: e,
  counts: t
}) {
  return /* @__PURE__ */ g("article", { className: "knowledge-index-map-status", children: [
    /* @__PURE__ */ o("strong", { children: e }),
    /* @__PURE__ */ g("div", { children: [
      /* @__PURE__ */ o(Ye, { status: "success", label: "完成", count: t?.success || 0 }),
      /* @__PURE__ */ o(Ye, { status: "running", label: "进行中", count: t?.running || 0 }),
      /* @__PURE__ */ o(Ye, { status: "pending", label: "待处理", count: t?.pending || 0 }),
      /* @__PURE__ */ o(Ye, { status: "failed", label: "失败", count: t?.failed || 0 })
    ] })
  ] });
}
function to({ stages: e }) {
  const t = e.filter((n) => n.running > 0 || n.failed > 0);
  return /* @__PURE__ */ g("article", { className: "knowledge-index-map-status", children: [
    /* @__PURE__ */ o("strong", { children: "索引阶段" }),
    t.length ? /* @__PURE__ */ o("div", { children: t.map((n) => /* @__PURE__ */ g(
      "span",
      {
        className: `knowledge-index-map-pill ${n.failed > 0 ? "is-failed" : "is-running"}`,
        children: [
          n.label,
          /* @__PURE__ */ o("b", { children: n.failed > 0 ? n.failed : n.running })
        ]
      },
      n.stage
    )) }) : /* @__PURE__ */ o("p", { className: "knowledge-index-map-status__empty", children: "暂无运行中的阶段" })
  ] });
}
function Ye({
  status: e,
  label: t,
  count: n
}) {
  const r = Cn(e), i = r.icon;
  return /* @__PURE__ */ g("span", { className: `knowledge-index-map-pill is-${r.status}`, children: [
    /* @__PURE__ */ o(i, { size: 13 }),
    t,
    /* @__PURE__ */ o("b", { children: n })
  ] });
}
function ro({
  value: e,
  onChange: t
}) {
  return /* @__PURE__ */ o("div", { className: "knowledge-index-map-tabs", role: "tablist", "aria-label": "知识地图视图", children: [
    { value: "tree", label: "目录" },
    { value: "graph", label: "图谱" }
  ].map((r) => /* @__PURE__ */ o(
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
function io({
  value: e,
  onChange: t
}) {
  return /* @__PURE__ */ g(
    "select",
    {
      className: "knowledge-index-map-type-select",
      value: e,
      onChange: (n) => t(n.target.value),
      "aria-label": "图谱类型筛选",
      children: [
        /* @__PURE__ */ o("option", { value: "all", children: "全部" }),
        /* @__PURE__ */ o("option", { value: "concept", children: "概念" }),
        /* @__PURE__ */ o("option", { value: "source", children: "文档节点" }),
        /* @__PURE__ */ o("option", { value: "middle", children: "资源/其他" })
      ]
    }
  );
}
function ao({
  loading: e,
  tree: t,
  query: n,
  expandedIDs: r,
  selectedNodeID: i,
  onToggle: a,
  onSelect: l
}) {
  const s = Q(() => gr(t, n), [n, t]);
  return e && !t.length ? /* @__PURE__ */ o(
    Me,
    {
      icon: /* @__PURE__ */ o(ke, { className: "is-spinning", size: 18 }),
      label: "加载地图中"
    }
  ) : s.length ? /* @__PURE__ */ o("div", { className: "knowledge-index-map-tree", children: s.map((c) => /* @__PURE__ */ o(
    vr,
    {
      node: c,
      level: 0,
      expandedIDs: r,
      selectedNodeID: i,
      onToggle: a,
      onSelect: l
    },
    c.id
  )) }) : /* @__PURE__ */ o(
    Me,
    {
      icon: /* @__PURE__ */ o(Kt, { size: 20 }),
      label: t.length ? "没有匹配的节点" : "暂无索引节点，请先更新索引"
    }
  );
}
function oo({
  graph: e,
  loading: t,
  enhancedMode: n,
  query: r,
  typeFilter: i,
  selectedNodeID: a,
  selectedEdgeID: l,
  onSelectNode: s,
  onSelectEdge: c
}) {
  const [d, u] = D(1), [f, v] = D({ x: 0, y: 0 }), p = oe(null), y = Q(
    () => pr(e, r, i),
    [e, r, i]
  ), I = Q(() => go(y), [y]);
  if (t && !e.nodes.length)
    return /* @__PURE__ */ o(
      Me,
      {
        icon: /* @__PURE__ */ o(ke, { className: "is-spinning", size: 18 }),
        label: "加载关系图谱中"
      }
    );
  if (!I.nodes.length || !I.edges.length)
    return /* @__PURE__ */ o(
      Me,
      {
        icon: /* @__PURE__ */ o(Zn, { size: 20 }),
        label: e.nodes.length ? "没有匹配的关系图谱" : n ? "暂无关系图谱，请先更新增强索引" : "当前为轻量检索，未启用智能增强"
      }
    );
  const _ = I.edges.length <= 60;
  return /* @__PURE__ */ g("div", { className: "knowledge-index-map-graph", children: [
    /* @__PURE__ */ g("div", { className: "knowledge-index-map-graph__tools", children: [
      /* @__PURE__ */ o("button", { type: "button", onClick: () => u((h) => Qn(h + 0.12, 0.72, 1.8)), children: /* @__PURE__ */ o(ri, { size: 14 }) }),
      /* @__PURE__ */ o("button", { type: "button", onClick: () => u((h) => Qn(h - 0.12, 0.72, 1.8)), children: /* @__PURE__ */ o(ii, { size: 14 }) }),
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          onClick: () => {
            u(1), v({ x: 0, y: 0 });
          },
          children: "复位"
        }
      )
    ] }),
    /* @__PURE__ */ g("svg", { viewBox: "0 0 980 560", role: "img", "aria-label": "知识关系图谱", children: [
      /* @__PURE__ */ o("defs", { children: /* @__PURE__ */ o(
        "marker",
        {
          id: "knowledge-graph-arrow",
          viewBox: "0 0 10 10",
          refX: "9",
          refY: "5",
          markerWidth: "6",
          markerHeight: "6",
          orient: "auto-start-reverse",
          children: /* @__PURE__ */ o("path", { d: "M 0 0 L 10 5 L 0 10 z" })
        }
      ) }),
      /* @__PURE__ */ g(
        "g",
        {
          transform: `translate(${f.x}, ${f.y}) scale(${d})`,
          onPointerDown: (h) => {
            p.current = {
              x: h.clientX,
              y: h.clientY,
              offsetX: f.x,
              offsetY: f.y
            }, h.currentTarget.setPointerCapture(h.pointerId);
          },
          onPointerMove: (h) => {
            const w = p.current;
            w && v({
              x: w.offsetX + h.clientX - w.x,
              y: w.offsetY + h.clientY - w.y
            });
          },
          onPointerUp: (h) => {
            p.current = null, h.currentTarget.releasePointerCapture(h.pointerId);
          },
          children: [
            /* @__PURE__ */ o("g", { className: "knowledge-index-map-graph__edges", children: I.edges.map((h) => /* @__PURE__ */ g(
              "g",
              {
                className: l === h.id ? "is-selected" : "",
                onClick: (w) => {
                  w.stopPropagation(), c(h.id);
                },
                children: [
                  /* @__PURE__ */ o("path", { d: h.path, markerEnd: "url(#knowledge-graph-arrow)" }),
                  _ ? /* @__PURE__ */ o("text", { x: h.labelX, y: h.labelY, children: kt(h.label || h.edge_type, 12) }) : null
                ]
              },
              h.id || `${h.from_node_id}-${h.to_node_id}-${h.edge_type}`
            )) }),
            /* @__PURE__ */ o("g", { className: "knowledge-index-map-graph__nodes", children: I.nodes.map((h) => /* @__PURE__ */ g(
              "g",
              {
                role: "button",
                tabIndex: 0,
                className: `knowledge-index-map-graph__node is-${h.group}${a === h.id ? " is-selected" : ""}`,
                transform: `translate(${h.x}, ${h.y})`,
                onClick: (w) => {
                  w.stopPropagation(), s(h.id);
                },
                onKeyDown: (w) => {
                  (w.key === "Enter" || w.key === " ") && (w.preventDefault(), s(h.id));
                },
                children: [
                  /* @__PURE__ */ o("circle", { r: h.radius }),
                  /* @__PURE__ */ o("text", { className: "knowledge-index-map-graph__node-title", y: "-3", children: kt(h.title || h.path || String(h.id), 13) }),
                  /* @__PURE__ */ o("text", { className: "knowledge-index-map-graph__node-type", y: "14", children: et(h.node_type).label })
                ]
              },
              h.id
            )) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ g("div", { className: "knowledge-index-map-graph__legend", children: [
      /* @__PURE__ */ o("span", { className: "is-source", children: "文档/节点" }),
      /* @__PURE__ */ o("span", { className: "is-concept", children: "概念" }),
      /* @__PURE__ */ g("span", { children: [
        "共 ",
        I.nodes.length,
        " 个节点 / ",
        I.edges.length,
        " 条关系"
      ] })
    ] })
  ] });
}
function vr({
  node: e,
  level: t,
  expandedIDs: n,
  selectedNodeID: r,
  onToggle: i,
  onSelect: a
}) {
  const l = e.children || [], s = l.length > 0 || !!e.children_count, c = n.has(e.id), d = et(e.node_type), u = ln(e.index_status), f = Cn(u), v = d.icon, p = f.icon;
  return /* @__PURE__ */ g("div", { className: "knowledge-index-map-tree__node", children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: `knowledge-index-map-tree__row${r === e.id ? " is-selected" : ""}`,
        style: { paddingLeft: 12 + t * 22 },
        onClick: () => a(e.id),
        children: [
          /* @__PURE__ */ o(
            "span",
            {
              className: "knowledge-index-map-tree__toggle",
              onClick: (y) => {
                y.stopPropagation(), s && i(e.id);
              },
              children: s ? c ? /* @__PURE__ */ o(Bt, { size: 15 }) : /* @__PURE__ */ o(jt, { size: 15 }) : null
            }
          ),
          /* @__PURE__ */ o(v, { size: 15 }),
          /* @__PURE__ */ o("span", { className: "knowledge-index-map-tree__title", children: e.title || d.label }),
          /* @__PURE__ */ o(
            "span",
            {
              className: `knowledge-index-map-tree__status is-${f.status}`,
              title: f.label,
              children: /* @__PURE__ */ o(p, { size: 13 })
            }
          )
        ]
      }
    ),
    c && l.length ? /* @__PURE__ */ o("div", { className: "knowledge-index-map-tree__children", children: l.map((y) => /* @__PURE__ */ o(
      vr,
      {
        node: y,
        level: t + 1,
        expandedIDs: n,
        selectedNodeID: r,
        onToggle: i,
        onSelect: a
      },
      y.id
    )) }) : null
  ] });
}
function lo({
  detail: e,
  loading: t
}) {
  if (t)
    return /* @__PURE__ */ o("section", { className: "knowledge-index-map-card", children: /* @__PURE__ */ o(
      Me,
      {
        icon: /* @__PURE__ */ o(ke, { className: "is-spinning", size: 18 }),
        label: "加载节点中"
      }
    ) });
  if (!e?.node)
    return /* @__PURE__ */ o("section", { className: "knowledge-index-map-card", children: /* @__PURE__ */ o(Me, { icon: /* @__PURE__ */ o(Ut, { size: 18 }), label: "选择一个节点查看详情" }) });
  const n = e.node;
  return /* @__PURE__ */ g("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ g("div", { className: "knowledge-index-map-card__header", children: [
      /* @__PURE__ */ g("div", { children: [
        /* @__PURE__ */ o("strong", { children: n.title || "未命名节点" }),
        /* @__PURE__ */ g("span", { children: [
          et(n.node_type).label,
          " · ",
          n.path || "/"
        ] }),
        n.index_stage ? /* @__PURE__ */ g("span", { children: [
          "阶段：",
          ho(n.index_stage)
        ] }) : null
      ] }),
      /* @__PURE__ */ o(
        Ye,
        {
          status: ln(n.index_status),
          label: Cn(n.index_status).label,
          count: 1
        }
      )
    ] }),
    /* @__PURE__ */ o("p", { className: "knowledge-index-map-card__summary", children: n.summary || n.plain_text || n.content || "暂无内容摘要。" }),
    /* @__PURE__ */ o(uo, { values: n.keywords || [] }),
    /* @__PURE__ */ o(bt, { title: "子节点", icon: /* @__PURE__ */ o(Zn, { size: 14 }), nodes: e.children || [] }),
    /* @__PURE__ */ o(bt, { title: "相关节点", icon: /* @__PURE__ */ o(ai, { size: 14 }), nodes: e.related || [] })
  ] });
}
function bt({
  title: e,
  icon: t,
  nodes: n
}) {
  return /* @__PURE__ */ g("div", { className: "knowledge-index-map-links", children: [
    /* @__PURE__ */ g("h4", { children: [
      t,
      e,
      /* @__PURE__ */ o("span", { children: n.length })
    ] }),
    n.length ? /* @__PURE__ */ o("div", { children: n.slice(0, 8).map((r) => /* @__PURE__ */ o("span", { children: r.title || r.path || `#${r.id}` }, r.id)) }) : /* @__PURE__ */ g("p", { children: [
      "暂无",
      e,
      "。"
    ] })
  ] });
}
function so({ errors: e }) {
  return /* @__PURE__ */ g("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ o("div", { className: "knowledge-index-map-card__header", children: /* @__PURE__ */ g("div", { children: [
      /* @__PURE__ */ o("strong", { children: "最近错误" }),
      /* @__PURE__ */ o("span", { children: "失败文档会显示在这里" })
    ] }) }),
    e?.length ? /* @__PURE__ */ o("div", { className: "knowledge-index-map-errors", children: e.map((t) => /* @__PURE__ */ g("article", { children: [
      /* @__PURE__ */ o("strong", { children: t.title || t.storage_path || `文档 ${t.id}` }),
      /* @__PURE__ */ o("p", { children: t.error_message || "索引失败" })
    ] }, t.id)) }) : /* @__PURE__ */ o(Me, { icon: /* @__PURE__ */ o(qe, { size: 18 }), label: "暂无索引错误" })
  ] });
}
function co({
  edge: e,
  nodes: t
}) {
  if (!e)
    return null;
  const n = t.find((i) => i.id === e.from_node_id), r = t.find((i) => i.id === e.to_node_id);
  return /* @__PURE__ */ g("section", { className: "knowledge-index-map-card", children: [
    /* @__PURE__ */ o("div", { className: "knowledge-index-map-card__header", children: /* @__PURE__ */ g("div", { children: [
      /* @__PURE__ */ o("strong", { children: e.label || e.edge_type || "关系" }),
      /* @__PURE__ */ g("span", { children: [
        n?.title || `node:${e.from_node_id}`,
        " → ",
        r?.title || `node:${e.to_node_id}`
      ] })
    ] }) }),
    /* @__PURE__ */ o("p", { className: "knowledge-index-map-card__summary", children: e.summary || e.evidence || "暂无关系说明。" }),
    e.evidence ? /* @__PURE__ */ g("div", { className: "knowledge-index-map-edge-evidence", children: [
      /* @__PURE__ */ o("strong", { children: "证据" }),
      /* @__PURE__ */ o("p", { children: e.evidence })
    ] }) : null
  ] });
}
function uo({ values: e }) {
  const t = e.map((n) => n.trim()).filter(Boolean).slice(0, 12);
  return t.length ? /* @__PURE__ */ o("div", { className: "knowledge-index-map-keywords", children: t.map((n) => /* @__PURE__ */ o("span", { children: n }, n)) }) : null;
}
function Me({ icon: e, label: t }) {
  return /* @__PURE__ */ g("div", { className: "knowledge-index-map-state", children: [
    e,
    /* @__PURE__ */ o("span", { children: t })
  ] });
}
function fo(e) {
  for (const t of e)
    if (t)
      return t;
  return null;
}
function Yn(e) {
  const t = e.children || [];
  return (t.length ? [e.id] : []).concat(t.flatMap(Yn));
}
function gr(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.flatMap((r) => {
    const i = gr(r.children || [], n);
    return hr(r, n) || i.length ? [{ ...r, children: i }] : [];
  }) : e;
}
function pr(e, t, n) {
  const r = t.trim().toLowerCase(), i = /* @__PURE__ */ new Set();
  for (const s of e.nodes || [])
    n !== "all" && wr(s) !== n || r && !hr(s, r) || i.add(s.id);
  const a = (e.edges || []).filter((s) => i.has(s.from_node_id) && i.has(s.to_node_id) ? !0 : r ? vo(s, r) : !1), l = /* @__PURE__ */ new Set();
  for (const s of a)
    l.add(s.from_node_id), l.add(s.to_node_id);
  return {
    nodes: (e.nodes || []).filter((s) => l.has(s.id)),
    edges: a
  };
}
function mo(e, t) {
  return t && (e.edges || []).find((n) => n.id === t) || null;
}
function hr(e, t) {
  return [
    e.title,
    e.path,
    e.summary,
    e.content,
    e.plain_text,
    e.node_type
  ].some((n) => String(n || "").toLowerCase().includes(t));
}
function vo(e, t) {
  return [
    e.label,
    e.edge_type,
    e.summary,
    e.evidence
  ].some((n) => String(n || "").toLowerCase().includes(t));
}
function go(e) {
  const t = /* @__PURE__ */ new Set();
  for (const d of e.edges || [])
    d.from_node_id && d.to_node_id && (t.add(d.from_node_id), t.add(d.to_node_id));
  const n = (e.nodes || []).filter((d) => t.has(d.id)).map((d) => ({ ...d, group: wr(d) })), r = ["source", "middle", "concept"], i = r.reduce(
    (d, u) => (d[u] = n.filter((f) => f.group === u), d),
    {}
  ), a = {
    source: 180,
    middle: 500,
    concept: 800
  }, l = r.flatMap((d) => {
    const u = i[d], f = Math.max(54, Math.min(96, 440 / Math.max(u.length - 1, 1))), v = 70 + Math.max(0, (440 - f * (u.length - 1)) / 2);
    return u.map((p, y) => ({
      ...p,
      x: a[d],
      y: u.length === 1 ? 280 : v + y * f,
      radius: po(p)
    }));
  }), s = new Map(l.map((d) => [d.id, d])), c = (e.edges || []).flatMap((d) => {
    const u = s.get(d.from_node_id), f = s.get(d.to_node_id);
    if (!u || !f)
      return [];
    const v = Math.max(Math.abs(f.x - u.x) * 0.42, 80);
    return [{
      ...d,
      path: `M ${u.x} ${u.y} C ${u.x + v} ${u.y}, ${f.x - v} ${f.y}, ${f.x} ${f.y}`,
      labelX: (u.x + f.x) / 2,
      labelY: (u.y + f.y) / 2 - 6
    }];
  });
  return { nodes: l, edges: c };
}
function wr(e) {
  return e.node_type === "concept" ? "concept" : e.node_type === "doc" || e.node_type === "heading" || e.node_type === "page" ? "source" : "middle";
}
function po(e) {
  return e.node_type === "concept" ? 34 : e.node_type === "doc" ? 31 : 27;
}
function kt(e, t) {
  const n = String(e || "").trim();
  return n.length <= t ? n : `${n.slice(0, Math.max(t - 1, 1))}…`;
}
function et(e) {
  return e === "root" || e === "dir" ? { label: "目录", icon: Kt } : e === "doc" ? { label: "文档", icon: Oe } : e === "concept" ? { label: "概念", icon: Zn } : { label: e || "节点", icon: Ut };
}
function ln(e) {
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
function Cn(e) {
  const t = ln(e);
  return t === "running" ? { status: t, label: "索引中", icon: ke } : t === "pending" ? { status: t, label: "待索引", icon: wn } : t === "failed" ? { status: t, label: "索引失败", icon: nn } : t === "success" ? { status: t, label: "已索引", icon: qe } : { status: "", label: "未索引", icon: wn };
}
function ho(e) {
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
function Qn(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function $n(e, t) {
  return e instanceof Error ? e.message : t;
}
const le = mi.Button, wo = vi.ConfirmDialog, Ir = gi.Input, $ = "/", Dt = "knowledge-files", Io = "未命名文档.md", _o = "新建文件夹", xo = "dever:bot:knowledge-file-manager:expanded:", yo = "dever:bot:knowledge-file-manager:last-opened:", Be = 8, St = 168, Nt = 184, Bn = 512 * 1024, bo = 2400;
function ko({ item: e }) {
  const t = e.meta ?? {}, n = Q(() => Xo(t), [t]), r = oe(null), i = oe($), a = oe(0), l = oe(0), [s, c] = D({}), [d, u] = D(
    () => Lt(n)
  ), [f, v] = D(""), [p, y] = D(""), [I, _] = D(null), [h, w] = D(null), [x, E] = D(null), [F, j] = D(null), [W, re] = D(""), [ne, ue] = D(!1), [ae, de] = D(!1), [U, A] = D(!1), [O, z] = D(null), [ie, X] = D(!1), [J, P] = D(!1), [L, N] = D(!1), [M, C] = D(!1), [R, K] = D(!1), [k, B] = D(!1), [he, xe] = D(!1), [Tn, En] = D(!1), [Pe, sn] = D(null), [dn, Ln] = D(!1), [Pr, Ae] = D(null), [tt, Ce] = D(null), Ve = s.base?.name || "知识库", Cr = pn(s.base?.index_status), ce = Q(() => Un(s.files || []), [s.files]), We = Q(() => Sr(ce, W), [W, ce]), rt = Q(() => Ho(ce), [ce]), Fe = Q(
    () => Bo(We, Ve),
    [Ve, We]
  ), cn = Q(
    () => f ? be(ce, f) : null,
    [f, ce]
  ), Fn = Q(
    () => p ? be(ce, p) : null,
    [p, ce]
  ), Rn = Cr === "running", ze = U || Rn, un = Number(s.base?.concept_graph_enabled) === 1, it = un ? "更新增强索引" : "更新搜索索引", Tr = pn(I?.index_status), Er = ze ? "索引中" : it, ye = S(async () => {
    if (n) {
      ue(!0);
      try {
        c(await ia({ knowledgeBaseID: n }));
      } catch (m) {
        Y.error(ve(m, "加载知识库失败"));
      } finally {
        ue(!1);
      }
    }
  }, [n]), at = S(async () => {
    if (n)
      try {
        const m = await oa({ knowledgeBaseID: n });
        if (pn(m.index_status) !== "running") {
          await ye();
          return;
        }
        c(
          (b) => b.base ? {
            ...b,
            base: { ...b.base, index_status: m.index_status }
          } : b
        );
      } catch {
      }
  }, [n, ye]);
  te(() => {
    ye();
  }, [ye]), te(() => {
    if (!n || !Rn)
      return;
    const m = window.setInterval(() => {
      at();
    }, bo);
    return () => window.clearInterval(m);
  }, [Rn, n, at]), te(() => {
    if (!I)
      return;
    const m = be(ce, I.id);
    !m || m.type !== "file" || m.index_status === I.index_status || _({ ...I, index_status: m.index_status });
  }, [I, ce]), te(() => {
    u(Lt(n)), v(""), y(""), _(null), w(null), E(null), j(null), z(null), X(!1), K(!1), B(!1), xe(!1), En(!1), sn(null), Ln(!1), l.current += 1, a.current = 0;
  }, [n]), te(() => {
    const m = () => Ce(null);
    return window.addEventListener("click", m), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), () => {
      window.removeEventListener("click", m), window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0);
    };
  }, []);
  const Lr = S(() => {
    if (!(x?.dirty && !window.confirm("当前文件尚未保存，确定返回上一页吗？"))) {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = "/bot/agent/knowledge_base/list";
    }
  }, [x?.dirty]), fe = S(
    (m) => {
      u((b) => {
        const T = m(b);
        return Uo(n, T), T;
      });
    },
    [n]
  ), $e = S(
    async (m) => {
      if (!n || m.type !== "file")
        return;
      const b = f, T = p, H = I, q = x, V = l.current + 1;
      l.current = V, v(m.id), y(m.id), j(null), z(null), X(!1), w({ name: m.name || Nr(m.id) }), fe((me) => Ft(me, m.id));
      try {
        const me = await wt({ knowledgeBaseID: n, id: m.id });
        if (l.current !== V)
          return;
        v(m.id), y(m.id), Kn(n, m.id), _(me), w(null), E({
          id: me.id,
          name: me.name,
          content: me.content || "",
          dirty: !1
        });
      } catch (me) {
        l.current === V && (v(b), y(T), _(H), E(q), w(null), Y.error(ve(me, "打开文件失败")));
      }
    },
    [I, x, p, n, f, fe]
  ), fn = S(
    (m, b) => {
      n && sn({ type: m, parent: b || $ });
    },
    [n]
  ), ot = S(
    async (m, b, T) => {
      const H = T.trim();
      if (!n || !H)
        return !1;
      try {
        const q = await ua({
          knowledgeBaseID: n,
          parent: b,
          name: H,
          type: m
        });
        if (c(q), fe((V) => new Set(V).add(b)), m === "file" && q.new_id) {
          const V = be(Un(q.files || []), q.new_id);
          V && await $e(V);
        }
        return Y.success(m === "folder" ? "文件夹已创建" : "文件已创建"), !0;
      } catch (q) {
        return Y.error(ve(q, "创建失败")), !1;
      }
    },
    [n, $e, fe]
  ), Fr = S(
    async (m) => {
      if (!(!Pe || dn)) {
        Ln(!0);
        try {
          await ot(Pe.type, Pe.parent, m) && sn(null);
        } finally {
          Ln(!1);
        }
      }
    },
    [Pe, ot, dn]
  ), Rr = S(
    async (m) => {
      if (!n)
        return;
      const b = window.prompt("新名称", m.name);
      if (!(!b?.trim() || b.trim() === m.name))
        try {
          const T = await It({ knowledgeBaseID: n, id: m.id, name: b.trim() });
          c(T);
          const H = T.new_id || m.id;
          if (f === m.id && (v(De(H)), Kn(n, H), m.type === "file" && I)) {
            const q = be(Un(T.files || []), H);
            _({
              ...I,
              id: H,
              name: b.trim(),
              index_status: q?.index_status || I.index_status
            }), E(
              (V) => V && { ...V, id: H, name: b.trim(), dirty: V.dirty }
            );
          }
          Y.success("已重命名");
        } catch (T) {
          Y.error(ve(T, "重命名失败"));
        }
    },
    [I, n, f]
  ), Or = S(
    async (m) => {
      if (!(!n || !window.confirm(`确定删除「${m.name}」吗？`)))
        try {
          c(await ha({ knowledgeBaseID: n, ids: [m.id] })), (f === m.id || qn(m, f)) && (v(""), _(null), w(null), E(null), j(null), z(null), X(!1));
          const b = jn(n);
          b && (b === m.id || qn(m, b)) && Qe(n), Y.success("已删除");
        } catch (b) {
          Y.error(ve(b, "删除失败"));
        }
    },
    [n, f]
  ), Mr = S(async () => {
    if (!(!n || !x || !I)) {
      de(!0);
      try {
        let m = x.id;
        const b = x.name.trim();
        if (b && b !== I.name) {
          const H = await It({
            knowledgeBaseID: n,
            id: I.id,
            name: b
          });
          c(H), m = H.new_id || I.id;
        }
        const T = I.editable ? await ma({
          knowledgeBaseID: n,
          id: m,
          content: x.content
        }) : await wt({ knowledgeBaseID: n, id: m });
        v(De(T.id)), Kn(n, T.id), _(T), z(null), X(!1), E({
          id: T.id,
          name: T.name,
          content: T.content || "",
          dirty: !1
        }), await ye(), Y.success("已保存");
      } catch (m) {
        Y.error(ve(m, "保存失败"));
      } finally {
        de(!1);
      }
    }
  }, [I, x, n, ye]), Ar = S(
    async () => {
      if (!(!n || ze)) {
        B(!1), A(!0);
        try {
          await va({ knowledgeBaseID: n }), c(Go), Y.success(un ? "已开始更新增强索引" : "已开始更新搜索索引"), await ye();
        } catch (m) {
          Y.error(ve(m, "索引启动失败"));
        } finally {
          A(!1);
        }
      }
    },
    [un, ze, n, ye]
  ), zr = S(async () => {
    if (!(!n || !I)) {
      X(!0), P(!0), z(null);
      try {
        z(await zn({ knowledgeBaseID: n, id: I.id }));
      } catch (m) {
        Y.error(ve(m, "加载索引详情失败"));
      } finally {
        P(!1);
      }
    }
  }, [I, n]), $r = S(async (m) => {
    if (!(!I || !O?.doc_id || L)) {
      N(!0);
      try {
        await fr({ docID: O.doc_id, status: m }), z(await zn({ knowledgeBaseID: n, id: I.id })), Y.success(xr(m));
      } catch (b) {
        Y.error(ve(b, "更新审核状态失败"));
      } finally {
        N(!1);
      }
    }
  }, [I, O?.doc_id, n, L]), Br = S(async (m) => {
    if (!(!I || !O?.doc_id || M)) {
      C(!0);
      try {
        await pa({ docID: O.doc_id, expiresAt: m }), z(await zn({ knowledgeBaseID: n, id: I.id })), Y.success(m ? "文档过期时间已更新" : "文档过期时间已清除");
      } catch (b) {
        Y.error(ve(b, "更新过期时间失败"));
      } finally {
        C(!1);
      }
    }
  }, [I, O?.doc_id, n, M]), jr = S(
    async (m, b) => {
      if (!n)
        return;
      const T = be(ce, m), H = b === $ ? null : be(ce, b);
      if (!T || T.id === $ || H && H.type !== "folder")
        return;
      const q = H?.id || $;
      if (T.id === q || q.startsWith(`${T.id}/`)) {
        Y.error("不能移动到自身或子目录下");
        return;
      }
      try {
        c(await wa({ knowledgeBaseID: n, ids: [T.id], target: q })), fe((me) => new Set(me).add(q));
        const V = jn(n);
        V && (V === T.id || qn(T, V)) && Qe(n), (f === T.id || f.startsWith(`${T.id}/`)) && (v(""), _(null), w(null), E(null), j(null), z(null), X(!1), Qe(n)), Y.success("已移动");
      } catch (V) {
        Y.error(ve(V, "移动失败"));
      }
    },
    [n, f, ce, fe]
  ), lt = S(
    (m) => {
      const b = Fn?.type === "folder" ? Fn.id : cn?.type === "folder" ? cn.id : Re(f);
      i.current = m || b || $, r.current?.click();
    },
    [Fn, f, cn]
  ), Kr = S(
    async (m) => {
      if (!n || !m?.length)
        return;
      const b = i.current || $, T = Array.from(m);
      try {
        let H = null;
        for (let q = 0; q < T.length; q += 1) {
          const V = T[q];
          V && (Ae({
            active: !0,
            currentFile: V.name,
            currentIndex: q + 1,
            total: T.length,
            percent: Hn(q, T.length, 0),
            status: "uploading"
          }), H = await Rt({
            knowledgeBaseID: n,
            parent: b,
            file: V,
            name: V.name,
            onProgress: (me) => {
              Ae({
                active: !0,
                currentFile: V.name,
                currentIndex: q + 1,
                total: T.length,
                percent: Hn(q, T.length, me),
                status: "uploading"
              });
            }
          }), Ae({
            active: !0,
            currentFile: V.name,
            currentIndex: q + 1,
            total: T.length,
            percent: Hn(q, T.length, 1),
            status: "uploading"
          }));
        }
        H && c(H), fe((q) => new Set(q).add(b)), Ae({
          active: !1,
          currentFile: T[T.length - 1]?.name || "",
          currentIndex: T.length,
          total: T.length,
          percent: 100,
          status: "done"
        }), Y.success("上传完成");
      } catch (H) {
        Ae(
          (q) => q ? {
            ...q,
            active: !1,
            status: "error"
          } : null
        ), Y.error(ve(H, "上传失败"));
      } finally {
        r.current && (r.current.value = ""), window.setTimeout(() => {
          Ae(
            (H) => H && !H.active ? null : H
          );
        }, 1800);
      }
    },
    [n, fe]
  ), st = S((m) => {
    fe((b) => {
      const T = new Set(b);
      return T.has(m) ? T.delete(m) : T.add(m), T;
    });
  }, [fe]), Ur = S(
    (m) => {
      if (y(m.id), m.type === "folder") {
        st(m.id);
        return;
      }
      v(m.id), $e(m);
    },
    [$e, st]
  ), qr = S((m) => {
    v(m.id), y(m.id);
  }, []);
  te(() => {
    if (!n || f || a.current === n || !s.files || s.base?.id !== n)
      return;
    const m = jn(n);
    if (!m) {
      a.current = n;
      return;
    }
    const b = be(ce, m);
    if (a.current = n, !b || b.type !== "file") {
      Qe(n);
      return;
    }
    fe((T) => Ft(T, b.id)), $e(b);
  }, [s.files, n, $e, f, ce, fe]);
  const Hr = Q(() => W.trim() ? Array.from(jo(We)) : Ko(d, Fe), [d, W, Fe, We]), Vr = f && cn?.type === "file" && Fe[f] ? [f] : [], On = p || f, Wr = On && Fe[On] ? On : $, dt = I ? Ia(n, I.id) : "", Gr = I ? _a(n, I.id) : "", Xr = I ? xa(n, _t(I.id)) : "", ct = !!(x && I), Yr = ct && !h, Qr = S(
    async (m) => {
      if (!n || !I)
        throw new Error("请先打开一个文档");
      const b = _t(I.id), T = /* @__PURE__ */ new Set(), H = [];
      let q = null;
      for (const V of m) {
        const me = ka(rt, b, V.name, T);
        T.add(me), q = await Rt({
          knowledgeBaseID: n,
          parent: b,
          file: V,
          name: me
        }), H.push({ name: me });
      }
      return q && c(q), fe((V) => new Set(V).add(b)), H;
    },
    [I, rt, n, fe]
  ), Mn = S((m, b) => {
    m.preventDefault(), m.stopPropagation(), B(!1), Ce({ x: m.clientX, y: m.clientY, node: b });
  }, []);
  return n ? /* @__PURE__ */ g("div", { className: "knowledge-shell", onContextMenu: (m) => m.preventDefault(), children: [
    /* @__PURE__ */ g("header", { className: "knowledge-toolbar", children: [
      /* @__PURE__ */ g("div", { className: "knowledge-toolbar__title", children: [
        /* @__PURE__ */ o("span", { children: Ve }),
        /* @__PURE__ */ g("small", { children: [
          s.files?.length || 0,
          " 个节点"
        ] })
      ] }),
      /* @__PURE__ */ g("div", { className: "knowledge-toolbar__actions", children: [
        /* @__PURE__ */ g(
          le,
          {
            variant: "ghost",
            size: "sm",
            className: "knowledge-toolbar__back",
            onClick: Lr,
            children: [
              /* @__PURE__ */ o(oi, { size: 16 }),
              "返回上一页"
            ]
          }
        ),
        /* @__PURE__ */ g(
          le,
          {
            variant: "outline",
            size: "sm",
            onClick: () => K(!0),
            children: [
              /* @__PURE__ */ o(An, { size: 16 }),
              "知识地图"
            ]
          }
        ),
        /* @__PURE__ */ g(
          le,
          {
            variant: "outline",
            size: "sm",
            onClick: () => xe(!0),
            children: [
              /* @__PURE__ */ o(hn, { size: 16 }),
              "测试检索"
            ]
          }
        ),
        /* @__PURE__ */ g(
          le,
          {
            variant: "outline",
            size: "sm",
            onClick: () => En(!0),
            children: [
              /* @__PURE__ */ o(qe, { size: 16 }),
              "待审核"
            ]
          }
        ),
        /* @__PURE__ */ g(
          le,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              Ce(null), B(!0);
            },
            disabled: ze,
            children: [
              /* @__PURE__ */ o(An, { size: 16 }),
              Er
            ]
          }
        ),
        /* @__PURE__ */ g(le, { variant: "outline", size: "sm", onClick: () => fn("folder"), children: [
          /* @__PURE__ */ o(qt, { size: 16 }),
          "文件夹"
        ] }),
        /* @__PURE__ */ g(le, { variant: "outline", size: "sm", onClick: () => fn("file"), children: [
          /* @__PURE__ */ o(Ht, { size: 16 }),
          "文件"
        ] }),
        /* @__PURE__ */ g(le, { variant: "outline", size: "sm", onClick: () => lt(), children: [
          /* @__PURE__ */ o(Vt, { size: 16 }),
          "上传"
        ] }),
        /* @__PURE__ */ o(le, { variant: "outline", size: "sm", onClick: () => {
          ye();
        }, children: /* @__PURE__ */ o(ke, { size: 16 }) })
      ] }),
      /* @__PURE__ */ o(
        "input",
        {
          ref: r,
          type: "file",
          multiple: !0,
          hidden: !0,
          onChange: (m) => {
            Kr(m.target.files);
          }
        }
      )
    ] }),
    /* @__PURE__ */ g("main", { className: "knowledge-workspace", children: [
      /* @__PURE__ */ g(
        "aside",
        {
          className: "knowledge-sidebar",
          onContextMenu: (m) => Mn(m, null),
          children: [
            /* @__PURE__ */ g(
              "div",
              {
                className: "knowledge-sidebar__search",
                onContextMenu: (m) => m.stopPropagation(),
                children: [
                  /* @__PURE__ */ g("div", { className: "knowledge-toolbar__search", children: [
                    /* @__PURE__ */ o(hn, { size: 16 }),
                    /* @__PURE__ */ o(
                      "input",
                      {
                        value: W,
                        onChange: (m) => re(m.target.value),
                        placeholder: "搜索文件"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ o(Oo, { progress: Pr })
                ]
              }
            ),
            ne && !s.files?.length ? /* @__PURE__ */ o("div", { className: "knowledge-sidebar__state", children: "加载中..." }) : null,
            We.length ? /* @__PURE__ */ o(
              "div",
              {
                className: "knowledge-tree",
                onContextMenu: (m) => Mn(m, null),
                children: /* @__PURE__ */ o(
                  Ai,
                  {
                    items: Fe,
                    getItemTitle: (m) => m.data.name || "",
                    viewState: {
                      [Dt]: {
                        expandedItems: Hr,
                        selectedItems: Vr,
                        focusedItem: Wr
                      }
                    },
                    canDragAndDrop: !0,
                    canDropOnFolder: !0,
                    canReorderItems: !1,
                    canSearch: !1,
                    canDrag: (m) => m.length === 1 && m.every((b) => b.index !== $),
                    canDropAt: (m, b) => qo(m, b, Fe),
                    onExpandItem: (m) => {
                      m.index !== $ && fe(
                        (b) => new Set(b).add(String(m.index))
                      );
                    },
                    onCollapseItem: (m) => {
                      m.index !== $ && fe((b) => {
                        const T = new Set(b);
                        return T.delete(String(m.index)), T;
                      });
                    },
                    onSelectItems: (m) => {
                      const b = String(m[0] || "");
                      if (!b || b === $)
                        return;
                      const T = be(ce, b);
                      T?.type === "file" && qr(T);
                    },
                    onFocusItem: (m) => {
                      const b = String(m.index);
                      b && b !== $ && y(b);
                    },
                    onPrimaryAction: (m) => {
                      const b = be(ce, String(m.index));
                      b && Ur(b);
                    },
                    onDrop: (m, b) => {
                      const T = br(b, Fe), [H] = m;
                      !T || !H || jr(String(H.index), T);
                    },
                    renderItemArrow: ({ item: m, context: b }) => /* @__PURE__ */ o(
                      "span",
                      {
                        ...b.arrowProps,
                        className: `knowledge-tree-row__arrow${m.isFolder ? "" : " is-empty"}`,
                        children: m.isFolder ? b.isExpanded ? /* @__PURE__ */ o(Bt, { size: 17 }) : /* @__PURE__ */ o(jt, { size: 17 }) : null
                      }
                    ),
                    renderItemTitle: ({ title: m, item: b }) => /* @__PURE__ */ g("span", { className: "knowledge-tree-row__label", children: [
                      b.data.type === "folder" ? /* @__PURE__ */ o(li, { size: 16 }) : /* @__PURE__ */ o(Oe, { size: 16 }),
                      /* @__PURE__ */ o("span", { className: "knowledge-tree-row__name", children: m }),
                      b.data.type === "file" ? /* @__PURE__ */ g("span", { className: "knowledge-tree-row__badges", children: [
                        /* @__PURE__ */ o(Sn, { sourceType: b.data.source_type }),
                        /* @__PURE__ */ o(Dn, { status: b.data.index_status, compact: !0 })
                      ] }) : null
                    ] }),
                    renderItem: ({ item: m, depth: b, children: T, title: H, arrow: q, context: V }) => /* @__PURE__ */ o(
                      Mo,
                      {
                        item: m,
                        depth: b,
                        title: H,
                        arrow: q,
                        context: V,
                        onContextMenu: Mn,
                        children: T
                      }
                    ),
                    children: /* @__PURE__ */ o(ea, { treeId: Dt, rootItem: $, treeLabel: Ve })
                  }
                )
              }
            ) : /* @__PURE__ */ o("div", { className: "knowledge-sidebar__state", children: W.trim() ? "没有匹配文件" : "右键新建文件夹或文件" })
          ]
        }
      ),
      /* @__PURE__ */ g("section", { className: "knowledge-editor", children: [
        h ? /* @__PURE__ */ o(Co, { fileName: h.name }) : x && I ? /* @__PURE__ */ g("div", { className: "knowledge-editor__header", children: [
          /* @__PURE__ */ g("div", { className: "knowledge-editor__title", children: [
            /* @__PURE__ */ o(
              Ir,
              {
                value: x.name,
                title: x.name,
                onChange: (m) => E(
                  (b) => b && { ...b, name: m.target.value, dirty: !0 }
                )
              }
            ),
            /* @__PURE__ */ o(Sn, { sourceType: I?.source_type }),
            /* @__PURE__ */ o(Dn, { status: Tr })
          ] }),
          /* @__PURE__ */ g("div", { className: "knowledge-editor__actions", children: [
            /* @__PURE__ */ o(_r, { status: F }),
            /* @__PURE__ */ g(
              le,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  zr();
                },
                children: [
                  /* @__PURE__ */ o(An, { size: 16 }),
                  "索引详情"
                ]
              }
            ),
            /* @__PURE__ */ g(
              le,
              {
                variant: "outline",
                size: "sm",
                onClick: () => Zo(dt),
                children: [
                  /* @__PURE__ */ o(si, { size: 16 }),
                  "下载"
                ]
              }
            ),
            /* @__PURE__ */ g(
              le,
              {
                size: "sm",
                disabled: ae || !x.dirty,
                onClick: () => {
                  Mr();
                },
                children: [
                  /* @__PURE__ */ o(di, { size: 16 }),
                  ae ? "保存中" : "保存"
                ]
              }
            )
          ] })
        ] }) : null,
        /* @__PURE__ */ g("div", { className: "knowledge-editor__body", "aria-busy": h ? !0 : void 0, children: [
          /* @__PURE__ */ o(
            ja,
            {
              active: Yr,
              file: I,
              content: x?.content || "",
              downloadURL: dt,
              previewURL: Gr,
              linkBaseURL: Xr,
              onUploadAttachments: Qr,
              onAttachmentError: (m) => Y.error(ve(m, "附件上传失败")),
              onStatusChange: j,
              onChange: (m) => E((b) => b && { ...b, content: m, dirty: !0 })
            }
          ),
          !h && !ct ? /* @__PURE__ */ g("div", { className: "knowledge-editor__placeholder", children: [
            /* @__PURE__ */ o(Oe, { size: 42 }),
            /* @__PURE__ */ o("strong", { children: "选择左侧文件查看或编辑" }),
            /* @__PURE__ */ o("span", { children: "右键目录可以新建文件夹、文件或上传资料。" })
          ] }) : null
        ] })
      ] })
    ] }),
    tt ? /* @__PURE__ */ o(
      Ao,
      {
        state: tt,
        onCreateFolder: (m) => {
          Ce(null), fn(
            "folder",
            m?.type === "folder" ? m.id : Re(m?.id || "")
          );
        },
        onCreateFile: (m) => {
          Ce(null), fn(
            "file",
            m?.type === "folder" ? m.id : Re(m?.id || "")
          );
        },
        onUpload: (m) => {
          Ce(null), lt(
            m?.type === "folder" ? m.id : Re(m?.id || "")
          );
        },
        onRename: (m) => {
          Ce(null), m && Rr(m);
        },
        onDelete: (m) => {
          Ce(null), m && Or(m);
        }
      }
    ) : null,
    ie ? /* @__PURE__ */ o(
      zo,
      {
        detail: O,
        expirationUpdating: M,
        loading: J,
        reviewing: L,
        fileName: I?.name || "",
        onReview: $r,
        onExpiration: Br,
        onClose: () => X(!1)
      }
    ) : null,
    /* @__PURE__ */ o(
      eo,
      {
        knowledgeBaseID: n,
        mode: s.base?.concept_graph_enabled,
        open: R,
        onClose: () => K(!1),
        onRefreshFiles: () => {
          ye();
        }
      }
    ),
    he ? /* @__PURE__ */ o(
      Eo,
      {
        knowledgeBaseID: n,
        baseName: Ve,
        mode: s.base?.concept_graph_enabled,
        onClose: () => xe(!1)
      }
    ) : null,
    Tn ? /* @__PURE__ */ o(
      Do,
      {
        knowledgeBaseID: n,
        onClose: () => En(!1),
        onUpdated: () => {
          ye();
        }
      }
    ) : null,
    Pe ? /* @__PURE__ */ o(
      Po,
      {
        state: Pe,
        loading: dn,
        onClose: () => {
          dn || sn(null);
        },
        onSubmit: (m) => {
          Fr(m);
        }
      },
      `${Pe.type}:${Pe.parent}`
    ) : null,
    /* @__PURE__ */ o(
      wo,
      {
        open: k,
        onOpenChange: B,
        title: it,
        desc: un ? "将重新解析文档并生成搜索索引，同时更新图谱、向量等增强数据。索引过程中不能重复触发。" : "将重新解析文档并生成本地搜索索引。原文读取不依赖索引，索引过程中不能重复触发。",
        confirmText: "开始更新",
        disabled: ze,
        isLoading: ze,
        handleConfirm: () => {
          Ar();
        }
      }
    )
  ] }) : /* @__PURE__ */ o("div", { className: "knowledge-shell__empty", children: "未找到知识库ID" });
}
function Do({
  knowledgeBaseID: e,
  onClose: t,
  onUpdated: n
}) {
  const [i, a] = D([]), [l, s] = D(0), [c, d] = D(!0), [u, f] = D(!1), [v, p] = D(1), [y, I] = D(0), _ = S(async (x, E) => {
    E ? f(!0) : d(!0);
    try {
      const F = await ga({
        knowledgeBaseID: e,
        page: x,
        pageSize: 50
      }), j = F.list || [];
      a((W) => E ? So(W, j) : j), s(F.total || 0), p(x);
    } catch (F) {
      Y.error(ve(F, "加载待审核文档失败"));
    } finally {
      E ? f(!1) : d(!1);
    }
  }, [e]), h = S(async () => {
    await _(1, !1);
  }, [_]);
  te(() => {
    h();
  }, [h]);
  const w = S(async (x, E) => {
    I(x);
    try {
      await fr({ docID: x, status: E }), Y.success(xr(E)), await h(), n();
    } catch (F) {
      Y.error(ve(F, "更新审核状态失败"));
    } finally {
      I(0);
    }
  }, [n, h]);
  return /* @__PURE__ */ o(
    "div",
    {
      className: "knowledge-index-detail knowledge-review-queue",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "待审核文档",
      onClick: t,
      children: /* @__PURE__ */ g("div", { className: "knowledge-index-detail__panel", onClick: (x) => x.stopPropagation(), children: [
        /* @__PURE__ */ g("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ g("div", { children: [
            /* @__PURE__ */ o("strong", { children: "待审核文档" }),
            /* @__PURE__ */ g("span", { children: [
              l,
              " 条待处理内容"
            ] })
          ] }),
          /* @__PURE__ */ o("button", { type: "button", onClick: t, "aria-label": "关闭", children: "×" })
        ] }),
        /* @__PURE__ */ g("div", { className: "knowledge-review-queue__body", children: [
          c ? /* @__PURE__ */ o("div", { className: "knowledge-sidebar__state", children: "加载中..." }) : null,
          !c && i.length === 0 ? /* @__PURE__ */ o("div", { className: "knowledge-sidebar__state", children: "暂无待审核内容" }) : null,
          i.map((x) => /* @__PURE__ */ g("article", { className: "knowledge-review-queue__row", children: [
            /* @__PURE__ */ g("div", { className: "knowledge-review-queue__content", children: [
              /* @__PURE__ */ g("div", { className: "knowledge-review-queue__title", children: [
                /* @__PURE__ */ o("strong", { children: x.title || `文档 ${x.id}` }),
                /* @__PURE__ */ o(Sn, { sourceType: x.source_type })
              ] }),
              /* @__PURE__ */ o("p", { children: No(x) })
            ] }),
            /* @__PURE__ */ g("div", { className: "knowledge-review-queue__actions", children: [
              /* @__PURE__ */ o(
                le,
                {
                  variant: "outline",
                  size: "icon",
                  title: "审核通过",
                  "aria-label": "审核通过",
                  disabled: y > 0,
                  onClick: () => {
                    w(x.id, "approved");
                  },
                  children: /* @__PURE__ */ o(qe, { size: 16 })
                }
              ),
              /* @__PURE__ */ o(
                le,
                {
                  variant: "outline",
                  size: "icon",
                  title: "驳回",
                  "aria-label": "驳回",
                  disabled: y > 0,
                  onClick: () => {
                    w(x.id, "rejected");
                  },
                  children: /* @__PURE__ */ o(nn, { size: 16 })
                }
              )
            ] })
          ] }, x.id)),
          l > i.length ? /* @__PURE__ */ o("div", { className: "knowledge-review-queue__limit", children: /* @__PURE__ */ o(
            le,
            {
              type: "button",
              variant: "outline",
              disabled: u || y > 0,
              onClick: () => {
                _(v + 1, !0);
              },
              children: u ? "加载中..." : `加载更多 (${i.length}/${l})`
            }
          ) }) : null
        ] })
      ] })
    }
  );
}
function So(e, t) {
  const n = new Map(e.map((r) => [r.id, r]));
  return t.forEach((r) => n.set(r.id, r)), Array.from(n.values());
}
function No(e) {
  const t = (e.summary || e.content || "暂无摘要").trim();
  return t.length > 240 ? `${t.slice(0, 240)}...` : t;
}
function Po({
  state: e,
  loading: t,
  onClose: n,
  onSubmit: r
}) {
  const i = oe(null), a = e.type === "folder" ? _o : Io, [l, s] = D(a);
  return zt(() => {
    const c = i.current;
    c && (c.focus(), c.setSelectionRange(0, To(a, e.type)));
  }, [a, e.type]), /* @__PURE__ */ o(
    "div",
    {
      className: "knowledge-index-detail knowledge-name-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e.type === "folder" ? "新建文件夹" : "新建文件",
      onClick: t ? void 0 : n,
      children: /* @__PURE__ */ g(
        "form",
        {
          className: "knowledge-index-detail__panel knowledge-name-dialog__panel",
          onClick: (c) => c.stopPropagation(),
          onSubmit: (c) => {
            c.preventDefault();
            const d = l.trim();
            d && r(d);
          },
          children: [
            /* @__PURE__ */ g("div", { className: "knowledge-index-detail__header", children: [
              /* @__PURE__ */ g("div", { children: [
                /* @__PURE__ */ o("strong", { children: e.type === "folder" ? "新建文件夹" : "新建文件" }),
                /* @__PURE__ */ o("span", { children: e.type === "folder" ? "输入文件夹名称" : "输入文件名称" })
              ] }),
              /* @__PURE__ */ o("button", { type: "button", onClick: n, "aria-label": "关闭", disabled: t, children: "×" })
            ] }),
            /* @__PURE__ */ g("div", { className: "knowledge-name-dialog__body", children: [
              /* @__PURE__ */ o("label", { htmlFor: "knowledge-create-node-name", children: e.type === "folder" ? "文件夹名称" : "文件名称" }),
              /* @__PURE__ */ o(
                "input",
                {
                  ref: i,
                  className: "knowledge-name-dialog__input",
                  id: "knowledge-create-node-name",
                  type: "text",
                  value: l,
                  disabled: t,
                  onChange: (c) => s(c.target.value),
                  onKeyDown: (c) => {
                    c.key === "Escape" && !t && (c.preventDefault(), n());
                  }
                }
              )
            ] }),
            /* @__PURE__ */ g("div", { className: "knowledge-name-dialog__footer", children: [
              /* @__PURE__ */ o(le, { type: "button", variant: "outline", onClick: n, disabled: t, children: "取消" }),
              /* @__PURE__ */ o(le, { type: "submit", disabled: t || !l.trim(), children: t ? "创建中" : "确定" })
            ] })
          ]
        }
      )
    }
  );
}
function Co({ fileName: e }) {
  return /* @__PURE__ */ g("div", { className: "knowledge-editor__header", children: [
    /* @__PURE__ */ o("div", { className: "knowledge-editor__title", children: /* @__PURE__ */ o("span", { className: "knowledge-editor__title-text", children: e || "文件" }) }),
    /* @__PURE__ */ o("div", { className: "knowledge-editor__actions", children: /* @__PURE__ */ o(_r, { status: { label: "文件加载中" } }) })
  ] });
}
function _r({ status: e }) {
  return e ? /* @__PURE__ */ o("span", { className: "knowledge-editor__status", role: "status", "aria-label": e.label, children: /* @__PURE__ */ o(ke, { size: 15 }) }) : null;
}
function To(e, t) {
  if (t === "folder")
    return e.length;
  const n = e.lastIndexOf(".");
  return n > 0 ? n : e.length;
}
function Dn({
  status: e,
  compact: t
}) {
  const n = Wo(e);
  if (!n)
    return null;
  const r = n.icon;
  return /* @__PURE__ */ g(
    "span",
    {
      className: `knowledge-index-status is-${n.status}${t ? " is-compact" : ""}`,
      title: n.label,
      "aria-label": n.label,
      children: [
        /* @__PURE__ */ o(r, { size: t ? 13 : 14 }),
        t ? null : /* @__PURE__ */ o("span", { children: n.label })
      ]
    }
  );
}
function Eo({
  knowledgeBaseID: e,
  baseName: t,
  mode: n,
  onClose: r
}) {
  const [i, a] = D(""), [l, s] = D(8), [c, d] = D(!1), [u, f] = D(""), [v, p] = D(null), y = v?.snippets || [], I = Object.entries(v?.source_counts || {}), _ = v?.plans || [], h = S(async () => {
    const w = i.trim();
    if (!e || !w) {
      f("请输入要测试的问题");
      return;
    }
    d(!0), f("");
    try {
      p(await ca({
        knowledgeBaseID: e,
        query: w,
        limit: l
      }));
    } catch (x) {
      p(null), f(ve(x, "测试检索失败"));
    } finally {
      d(!1);
    }
  }, [e, l, i]);
  return /* @__PURE__ */ o(
    "div",
    {
      className: "knowledge-index-detail knowledge-retrieve-test",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "测试检索",
      onClick: r,
      children: /* @__PURE__ */ g("div", { className: "knowledge-index-detail__panel", onClick: (w) => w.stopPropagation(), children: [
        /* @__PURE__ */ g("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ g("div", { children: [
            /* @__PURE__ */ o("strong", { children: "测试检索" }),
            /* @__PURE__ */ g("span", { children: [
              t,
              " · ",
              Lo(n)
            ] })
          ] }),
          /* @__PURE__ */ o("button", { type: "button", onClick: r, "aria-label": "关闭", children: "×" })
        ] }),
        /* @__PURE__ */ g(
          "form",
          {
            className: "knowledge-retrieve-test__form",
            onSubmit: (w) => {
              w.preventDefault(), h();
            },
            children: [
              /* @__PURE__ */ o(
                Ir,
                {
                  value: i,
                  onChange: (w) => a(w.target.value),
                  placeholder: "输入一个问题测试知识库召回",
                  autoFocus: !0
                }
              ),
              /* @__PURE__ */ o(
                "input",
                {
                  className: "knowledge-retrieve-test__limit",
                  type: "number",
                  min: 1,
                  max: 20,
                  value: l,
                  onChange: (w) => s(tn(Number(w.target.value) || 8, 1, 20)),
                  "aria-label": "返回数量"
                }
              ),
              /* @__PURE__ */ g(le, { type: "submit", disabled: c || !i.trim(), children: [
                c ? /* @__PURE__ */ o(ke, { className: "knowledge-retrieve-test__spin", size: 15 }) : /* @__PURE__ */ o(hn, { size: 15 }),
                "测试"
              ] })
            ]
          }
        ),
        u ? /* @__PURE__ */ o("div", { className: "knowledge-index-detail__error", children: u }) : null,
        c ? /* @__PURE__ */ g("div", { className: "knowledge-index-detail__loading", children: [
          /* @__PURE__ */ o(ke, { size: 18 }),
          "检索测试中"
        ] }) : v ? /* @__PURE__ */ g("div", { className: "knowledge-retrieve-test__body", children: [
          /* @__PURE__ */ g("div", { className: "knowledge-index-detail__meta", children: [
            /* @__PURE__ */ g("span", { children: [
              "问题：",
              v.query || i
            ] }),
            /* @__PURE__ */ g("span", { children: [
              "命中：",
              y.length
            ] }),
            /* @__PURE__ */ o("span", { children: "命中片段为候选，智能体会按需读取原文确认。" }),
            I.map(([w, x]) => /* @__PURE__ */ g("span", { children: [
              Pt(w),
              "：",
              x
            ] }, w))
          ] }),
          /* @__PURE__ */ o(en, { title: "命中片段", count: y.length, children: /* @__PURE__ */ o("div", { className: "knowledge-retrieve-test__results", children: y.map((w, x) => /* @__PURE__ */ g("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ g("div", { className: "knowledge-index-detail__card-title", children: [
              /* @__PURE__ */ o("strong", { children: w.title || `片段 ${x + 1}` }),
              /* @__PURE__ */ g("span", { children: [
                Pt(w.source || "node"),
                " · ",
                Fo(w.score)
              ] })
            ] }),
            /* @__PURE__ */ o("p", { children: w.content || "暂无内容。" }),
            /* @__PURE__ */ g("div", { className: "knowledge-retrieve-test__meta", children: [
              /* @__PURE__ */ g("span", { children: [
                "文档：",
                w.doc_id || "-"
              ] }),
              /* @__PURE__ */ g("span", { children: [
                "节点：",
                w.node_id || "-"
              ] }),
              /* @__PURE__ */ g("span", { children: [
                "目录：",
                w.dir_path || "/"
              ] })
            ] })
          ] }, `${w.node_id || x}-${x}`)) }) }),
          _.length ? /* @__PURE__ */ o(en, { title: "检索计划", count: _.length, children: /* @__PURE__ */ o("div", { className: "knowledge-retrieve-test__plans", children: _.map((w, x) => /* @__PURE__ */ o("pre", { children: Ro(w) }, x)) }) }) : null
        ] }) : /* @__PURE__ */ o("div", { className: "knowledge-index-detail__empty", children: "输入问题后开始测试。" })
      ] })
    }
  );
}
function Lo(e) {
  return Number(e) === 2 ? "轻量检索" : Number(e) === 1 ? "智能增强" : "未知模式";
}
function Pt(e) {
  const t = String(e || "").trim();
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
  }[t] || t || "未知";
}
function Fo(e) {
  const t = Number(e);
  return Number.isFinite(t) ? `分数 ${t.toFixed(3)}` : "分数 -";
}
function Ro(e) {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}
function Sn({ sourceType: e }) {
  return !e || e === "upload" ? null : e === "qa" ? /* @__PURE__ */ o("span", { className: "knowledge-source-tag is-qa", children: "QA 积累" }) : /* @__PURE__ */ o("span", { className: "knowledge-source-tag", children: e });
}
function Oo({ progress: e }) {
  if (!e)
    return null;
  const t = tn(Math.round(e.percent), 0, 100);
  return /* @__PURE__ */ g("div", { className: `knowledge-upload-progress is-${e.status}`, role: "status", children: [
    /* @__PURE__ */ g("div", { className: "knowledge-upload-progress__row", children: [
      /* @__PURE__ */ o("span", { children: Jo(e.status) }),
      /* @__PURE__ */ g("strong", { children: [
        t,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ o("div", { className: "knowledge-upload-progress__track", children: /* @__PURE__ */ o("span", { style: { width: `${t}%` } }) }),
    /* @__PURE__ */ g("div", { className: "knowledge-upload-progress__meta", children: [
      /* @__PURE__ */ o("span", { children: e.currentFile || "准备上传" }),
      /* @__PURE__ */ g("em", { children: [
        e.currentIndex,
        "/",
        e.total
      ] })
    ] })
  ] });
}
function Mo({
  item: e,
  depth: t,
  title: n,
  arrow: r,
  context: i,
  onContextMenu: a,
  children: l
}) {
  const s = e.index === $ ? null : e.data, c = s?.type === "file", d = s ? Math.max(0, s.level) : Math.max(0, t - 1), u = {
    "--knowledge-tree-guide-left": `${12 + Math.max(0, d - 1) * 28 + 9}px`,
    paddingLeft: 12 + d * 28
  };
  return /* @__PURE__ */ g(
    "li",
    {
      ...i.itemContainerWithChildrenProps,
      className: "knowledge-tree__item",
      children: [
        /* @__PURE__ */ g(
          "div",
          {
            ...i.interactiveElementProps,
            className: `knowledge-tree-row${i.isSelected && c ? " is-selected" : ""}${i.isFocused && c ? " is-focused" : ""}${i.isDraggingOver ? " can-drop" : ""}${d === 0 ? " is-root-level" : " is-nested"}`,
            style: u,
            onContextMenu: (f) => a(f, s),
            children: [
              r,
              n,
              /* @__PURE__ */ o(ci, { className: "knowledge-tree-row__more", size: 14 })
            ]
          }
        ),
        l
      ]
    }
  );
}
function Ao({
  state: e,
  onCreateFolder: t,
  onCreateFile: n,
  onUpload: r,
  onRename: i,
  onDelete: a
}) {
  const l = e.node, s = oe(null), [c, d] = D(
    () => Et(
      e.x,
      e.y,
      St,
      Nt
    )
  );
  return zt(() => {
    const u = s.current?.getBoundingClientRect();
    d(
      Et(
        e.x,
        e.y,
        u?.width || St,
        u?.height || Nt
      )
    );
  }, [e.x, e.y, l]), /* @__PURE__ */ g(
    "div",
    {
      ref: s,
      className: "knowledge-context-menu",
      style: { left: c.left, top: c.top },
      onClick: (u) => u.stopPropagation(),
      onContextMenu: (u) => u.preventDefault(),
      children: [
        /* @__PURE__ */ g("button", { type: "button", onClick: () => t(l), children: [
          /* @__PURE__ */ o(qt, { size: 15 }),
          "新建文件夹"
        ] }),
        /* @__PURE__ */ g("button", { type: "button", onClick: () => n(l), children: [
          /* @__PURE__ */ o(Ht, { size: 15 }),
          "新建文件"
        ] }),
        /* @__PURE__ */ g("button", { type: "button", onClick: () => r(l), children: [
          /* @__PURE__ */ o(Vt, { size: 15 }),
          "上传文件"
        ] }),
        l ? /* @__PURE__ */ g(Ot, { children: [
          /* @__PURE__ */ o("span", { className: "knowledge-context-menu__sep" }),
          /* @__PURE__ */ g("button", { type: "button", onClick: () => i(l), children: [
            /* @__PURE__ */ o(Oe, { size: 15 }),
            "重命名"
          ] }),
          /* @__PURE__ */ g("button", { type: "button", className: "is-danger", onClick: () => a(l), children: [
            /* @__PURE__ */ o(fi, { size: 15 }),
            "删除"
          ] })
        ] }) : null
      ]
    }
  );
}
function zo({
  detail: e,
  expirationUpdating: t,
  loading: n,
  reviewing: r,
  fileName: i,
  onReview: a,
  onExpiration: l,
  onClose: s
}) {
  const c = e?.nodes || [], d = e?.edges || [], [u, f] = D(
    Ct(e?.expires_at)
  );
  return te(() => {
    f(Ct(e?.expires_at));
  }, [e?.doc_id, e?.expires_at]), /* @__PURE__ */ o(
    "div",
    {
      className: "knowledge-index-detail",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "索引详情",
      onClick: s,
      children: /* @__PURE__ */ g("div", { className: "knowledge-index-detail__panel", onClick: (v) => v.stopPropagation(), children: [
        /* @__PURE__ */ g("div", { className: "knowledge-index-detail__header", children: [
          /* @__PURE__ */ g("div", { children: [
            /* @__PURE__ */ o("strong", { children: "索引详情" }),
            /* @__PURE__ */ o("span", { children: e?.name || i || "当前文件" })
          ] }),
          /* @__PURE__ */ o("button", { type: "button", onClick: s, "aria-label": "关闭", children: "×" })
        ] }),
        n ? /* @__PURE__ */ g("div", { className: "knowledge-index-detail__loading", children: [
          /* @__PURE__ */ o(ke, { size: 18 }),
          "加载索引详情中"
        ] }) : e ? /* @__PURE__ */ g("div", { className: "knowledge-index-detail__body", children: [
          /* @__PURE__ */ g("div", { className: "knowledge-index-detail__meta", children: [
            /* @__PURE__ */ o(Dn, { status: e.index_status }),
            /* @__PURE__ */ o(Sn, { sourceType: e.source_type }),
            /* @__PURE__ */ o($o, { status: e.review_status }),
            /* @__PURE__ */ g("span", { children: [
              "文档ID：",
              e.doc_id || "-"
            ] }),
            /* @__PURE__ */ g("span", { children: [
              "节点：",
              e.node_count || c.length
            ] }),
            /* @__PURE__ */ g("span", { children: [
              "目录：",
              e.dir_path || "/"
            ] }),
            /* @__PURE__ */ g("div", { className: "knowledge-expiration-control", children: [
              /* @__PURE__ */ o(
                "input",
                {
                  type: "datetime-local",
                  value: u,
                  disabled: t,
                  "aria-label": "文档过期时间",
                  onChange: (v) => f(v.target.value)
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  title: "保存过期时间",
                  "aria-label": "保存过期时间",
                  disabled: t || !u,
                  onClick: () => {
                    l(new Date(u).toISOString());
                  },
                  children: /* @__PURE__ */ o(ui, { size: 15 })
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  title: "清除过期时间",
                  "aria-label": "清除过期时间",
                  disabled: t || !u && !e.expires_at,
                  onClick: () => {
                    f(""), l();
                  },
                  children: /* @__PURE__ */ o(nn, { size: 15 })
                }
              )
            ] }),
            /* @__PURE__ */ g("div", { className: "knowledge-review-actions", "aria-label": "文档审核", children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  title: "审核通过",
                  "aria-label": "审核通过",
                  disabled: r || e.review_status === "approved",
                  onClick: () => {
                    a("approved");
                  },
                  children: /* @__PURE__ */ o(qe, { size: 15 })
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  title: "驳回文档",
                  "aria-label": "驳回文档",
                  disabled: r || e.review_status === "rejected",
                  onClick: () => {
                    a("rejected");
                  },
                  children: /* @__PURE__ */ o(nn, { size: 15 })
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  title: "重置为待审核",
                  "aria-label": "重置为待审核",
                  disabled: r || e.review_status === "pending",
                  onClick: () => {
                    a("pending");
                  },
                  children: /* @__PURE__ */ o(wn, { size: 15 })
                }
              )
            ] })
          ] }),
          e.error_message ? /* @__PURE__ */ o("div", { className: "knowledge-index-detail__error", children: e.error_message }) : null,
          /* @__PURE__ */ g(en, { title: "文章摘要", count: e.summary ? 1 : 0, children: [
            /* @__PURE__ */ o("p", { className: "knowledge-index-detail__summary", children: e.summary || "暂无摘要。" }),
            /* @__PURE__ */ o(Tt, { values: e.keywords || [] })
          ] }),
          /* @__PURE__ */ o(en, { title: "节点", count: c.length, children: c.map((v) => /* @__PURE__ */ g("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ g("div", { className: "knowledge-index-detail__card-title", children: [
              /* @__PURE__ */ o("strong", { children: v.path || v.title || `#${v.sort}` }),
              /* @__PURE__ */ o(Dn, { status: v.index_status, compact: !0 })
            ] }),
            /* @__PURE__ */ o("p", { children: v.content_preview || "暂无内容。" }),
            /* @__PURE__ */ o(Tt, { values: v.keywords || [], compact: !0 })
          ] }, v.id)) }),
          /* @__PURE__ */ o(en, { title: "关系", count: d.length, children: /* @__PURE__ */ o("div", { className: "knowledge-index-detail__grid", children: d.map((v) => /* @__PURE__ */ g("article", { className: "knowledge-index-detail__card", children: [
            /* @__PURE__ */ g("div", { className: "knowledge-index-detail__triple", children: [
              /* @__PURE__ */ o("span", { children: v.subject }),
              /* @__PURE__ */ o("em", { children: v.label || v.predicate || v.edge_type || "关联" }),
              /* @__PURE__ */ o("span", { children: v.object })
            ] }),
            /* @__PURE__ */ o("p", { children: v.description || v.evidence || "暂无说明。" })
          ] }, v.id)) }) })
        ] }) : /* @__PURE__ */ o("div", { className: "knowledge-index-detail__empty", children: "暂无索引详情。" })
      ] })
    }
  );
}
function $o({ status: e }) {
  const t = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已驳回",
    expired: "已过期"
  }, n = e || "pending";
  return /* @__PURE__ */ o("span", { className: `knowledge-review-status is-${n}`, children: t[n] });
}
function xr(e) {
  return e === "approved" ? "文档已审核通过" : e === "rejected" ? "文档已驳回" : "文档已重置为待审核";
}
function Ct(e) {
  if (!e)
    return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : new Date(t.getTime() - t.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
}
function en({
  title: e,
  count: t,
  children: n
}) {
  return /* @__PURE__ */ g("section", { className: "knowledge-index-detail__section", children: [
    /* @__PURE__ */ g("h3", { children: [
      e,
      /* @__PURE__ */ o("span", { children: t })
    ] }),
    t > 0 || e === "文章摘要" ? n : /* @__PURE__ */ g("div", { className: "knowledge-index-detail__empty", children: [
      "暂无",
      e,
      "。"
    ] })
  ] });
}
function Tt({ values: e, compact: t }) {
  const n = e.map((r) => r.trim()).filter(Boolean);
  return n.length ? /* @__PURE__ */ o("div", { className: `knowledge-index-detail__tags${t ? " is-compact" : ""}`, children: n.map((r) => /* @__PURE__ */ o("span", { children: r }, r)) }) : null;
}
function Et(e, t, n, r) {
  if (typeof window > "u")
    return { left: e, top: t };
  const i = Math.max(
    Be,
    window.innerWidth - n - Be
  ), a = Math.max(
    Be,
    window.innerHeight - r - Be
  );
  return {
    left: tn(e, Be, i),
    top: tn(t, Be, a)
  };
}
function Bo(e, t) {
  const n = {
    [$]: {
      index: $,
      isFolder: !0,
      canMove: !1,
      canRename: !1,
      data: {
        id: $,
        name: t || "知识库",
        type: "folder",
        parent_id: $,
        path: $,
        level: 0,
        children: e
      },
      children: e.map((i) => i.id)
    }
  }, r = (i) => {
    n[i.id] = {
      index: i.id,
      isFolder: i.type === "folder",
      canMove: !0,
      canRename: !0,
      data: i,
      children: i.type === "folder" ? i.children.map((a) => a.id) : void 0
    }, i.children.forEach(r);
  };
  return e.forEach(r), n;
}
function jo(e) {
  const t = /* @__PURE__ */ new Set([$]), n = (r) => {
    r.type === "folder" && (t.add(r.id), r.children.forEach(n));
  };
  return e.forEach(n), t;
}
function Ko(e, t) {
  return Array.from(e).filter((n) => n === $ || !!t[n]);
}
function Lt(e) {
  if (!e || typeof window > "u")
    return /* @__PURE__ */ new Set([$]);
  try {
    const t = window.localStorage.getItem(yr(e)), n = JSON.parse(t || "[]");
    return Array.isArray(n) ? /* @__PURE__ */ new Set([$, ...n.map(De).filter((r) => r !== $)]) : /* @__PURE__ */ new Set([$]);
  } catch {
    return /* @__PURE__ */ new Set([$]);
  }
}
function Uo(e, t) {
  if (!e || typeof window > "u")
    return;
  const n = Array.from(t).filter((r) => r && r !== $);
  window.localStorage.setItem(yr(e), JSON.stringify(n));
}
function yr(e) {
  return `${xo}${e}`;
}
function jn(e) {
  if (!e || typeof window > "u")
    return "";
  const t = window.localStorage.getItem(nt(e));
  if (!t)
    return "";
  const n = De(t);
  return n === $ ? "" : n;
}
function Kn(e, t) {
  if (!e || typeof window > "u")
    return;
  const n = De(t);
  if (!n || n === $) {
    Qe(e);
    return;
  }
  window.localStorage.setItem(nt(e), n);
}
function Qe(e) {
  !e || typeof window > "u" || window.localStorage.removeItem(nt(e));
}
function nt(e) {
  return `${yo}${e}`;
}
function Ft(e, t) {
  const n = new Set(e);
  let r = Re(t);
  for (; r && r !== $; )
    n.add(r), r = Re(r);
  return n.add($), n;
}
function qo(e, t, n) {
  const r = br(t, n);
  return r ? e.every((i) => {
    const a = String(i.index);
    return a !== $ && a !== r && !r.startsWith(`${a}/`);
  }) : !1;
}
function br(e, t) {
  if (e.targetType === "root")
    return $;
  if (e.targetType === "item")
    return t[e.targetItem]?.data.type === "folder" ? String(e.targetItem) : "";
  const n = String(e.parentItem || $);
  return n === $ ? $ : t[n]?.data.type === "folder" ? n : "";
}
function Un(e) {
  const t = /* @__PURE__ */ new Map(), n = [], r = e.map(Vo).sort(Dr);
  for (const i of r)
    i.type === "folder" && t.set(i.id, i);
  for (const i of r) {
    const a = t.get(i.id) || i, l = a.parent_id;
    if (!l || l === $) {
      n.push(a);
      continue;
    }
    const s = t.get(l);
    s ? s.children.push(a) : n.push(a);
  }
  return kr(n), n;
}
function Ho(e) {
  const t = [], n = (r) => {
    t.push(r), r.children.forEach(n);
  };
  return e.forEach(n), t;
}
function Vo(e) {
  const t = De(e.id);
  return {
    ...e,
    id: t,
    name: e.name || Nr(t),
    parent_id: Re(t),
    path: t,
    level: Yo(t),
    children: []
  };
}
function kr(e) {
  e.sort(Dr), e.forEach((t) => kr(t.children));
}
function Dr(e, t) {
  return e.type !== t.type ? e.type === "folder" ? -1 : 1 : e.name.localeCompare(t.name, "zh-Hans-CN");
}
function Sr(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.flatMap((r) => {
    const i = Sr(r.children, n);
    return r.name.toLowerCase().includes(n) || i.length ? [{ ...r, children: i }] : [];
  }) : e;
}
function be(e, t) {
  const n = De(t);
  for (const r of e) {
    if (r.id === n)
      return r;
    const i = be(r.children, n);
    if (i)
      return i;
  }
  return null;
}
function pn(e) {
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
function Wo(e) {
  const t = pn(e);
  return t === "running" ? { status: t, label: "索引中", icon: ke } : t === "pending" ? { status: t, label: "待索引", icon: wn } : t === "failed" ? { status: t, label: "索引失败", icon: nn } : t === "success" ? { status: t, label: "已索引", icon: qe } : null;
}
function Go(e) {
  const t = (e.files || []).map((n) => ({ ...n, index_status: n.type === "file" ? "running" : n.index_status }));
  return {
    ...e,
    base: e.base ? { ...e.base, index_status: "running" } : e.base,
    files: t
  };
}
function qn(e, t) {
  return De(t).startsWith(`${e.id}/`);
}
function Xo(e) {
  const t = e.knowledge_base_id || e.knowledgeBaseID || e.base_id || e.baseID || e.id || gn("knowledge_base_id") || gn("knowledgeBaseID") || gn("base_id") || gn("id"), n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function gn(e) {
  return typeof window > "u" ? "" : new URLSearchParams(window.location.search).get(e) || "";
}
function De(e) {
  const t = String(e || "").trim();
  return !t || t === "." ? $ : t.replace(/\\/g, "/").replace(/^\/+/, "") || $;
}
function Re(e) {
  const t = De(e);
  return !t || t === $ || !t.includes("/") ? $ : t.slice(0, t.lastIndexOf("/")) || $;
}
function Nr(e) {
  const t = De(e);
  return t === $ ? "知识库" : t.slice(t.lastIndexOf("/") + 1);
}
function Yo(e) {
  const t = De(e);
  return t === $ ? 0 : t.split("/").length - 1;
}
async function Rt({
  knowledgeBaseID: e,
  parent: t,
  file: n,
  name: r,
  onProgress: i
}) {
  const a = Math.max(1, Math.ceil(n.size / Bn)), l = Qo();
  let s = null;
  for (let c = 0; c < a; c += 1) {
    const d = c * Bn, u = n.slice(d, Math.min(n.size, d + Bn)), f = await fa({
      knowledgeBaseID: e,
      parent: t,
      name: r,
      uploadID: l,
      partNumber: c + 1,
      totalParts: a,
      chunk: u
    });
    f.complete && (s = f), i?.((c + 1) / a);
  }
  if (!s)
    throw new Error("上传失败");
  return s;
}
function Qo() {
  const e = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}_${e}`;
}
function Zo(e) {
  const t = window.open(e, "_blank", "noopener,noreferrer");
  t && (t.opener = null);
}
function Hn(e, t, n) {
  const r = Math.max(t, 1);
  return Math.round((e + tn(n, 0, 1)) / r * 100);
}
function Jo(e) {
  return e === "reading" ? "读取文件中" : e === "uploading" ? "上传中" : e === "done" ? "上传完成" : "上传失败";
}
function tn(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function ve(e, t) {
  return e instanceof Error ? e.message : t;
}
const ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowKnowledgeFileManager: ko
}, Symbol.toStringTag, { value: "Module" }));
export {
  dl as a,
  Ma as f,
  cl as i,
  ul as k
};
