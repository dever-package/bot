function i() {
  const e = /* @__PURE__ */ new Map();
  return (t, s) => {
    const n = e.get(t);
    if (n)
      return n;
    let r;
    return r = Promise.resolve().then(s).finally(() => {
      e.get(t) === r && e.delete(t);
    }), e.set(t, r), r;
  };
}
export {
  i as c
};
