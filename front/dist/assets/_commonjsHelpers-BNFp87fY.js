import { c as n } from "./createLucideIcon-fWv1XcFy.js";
const s = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], a = n("plus", s);
function p(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function f(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var c = e.default;
  if (typeof c == "function") {
    var t = function r() {
      var o = !1;
      try {
        o = this instanceof r;
      } catch {
      }
      return o ? Reflect.construct(c, arguments, this.constructor) : c.apply(this, arguments);
    };
    t.prototype = c.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(t, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), t;
}
export {
  a as P,
  p as a,
  f as g
};
