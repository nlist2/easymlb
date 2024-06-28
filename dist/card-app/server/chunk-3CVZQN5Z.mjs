import "./polyfills.server.mjs";
var v = Object.create;
var n = Object.defineProperty,
  w = Object.defineProperties,
  x = Object.getOwnPropertyDescriptor,
  y = Object.getOwnPropertyDescriptors,
  z = Object.getOwnPropertyNames,
  m = Object.getOwnPropertySymbols,
  A = Object.getPrototypeOf,
  o = Object.prototype.hasOwnProperty,
  s = Object.prototype.propertyIsEnumerable;
var l = (a, b) => ((b = Symbol[a]) ? b : Symbol.for("Symbol." + a));
var r = (a, b, c) =>
    b in a
      ? n(a, b, { enumerable: !0, configurable: !0, writable: !0, value: c })
      : (a[b] = c),
  C = (a, b) => {
    for (var c in (b ||= {})) o.call(b, c) && r(a, c, b[c]);
    if (m) for (var c of m(b)) s.call(b, c) && r(a, c, b[c]);
    return a;
  },
  D = (a, b) => w(a, y(b));
var E = ((a) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(a, { get: (b, c) => (typeof require < "u" ? require : b)[c] })
      : a)(function (a) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + a + '" is not supported');
});
var F = (a) => (typeof a == "symbol" ? a : a + ""),
  G = (a, b) => {
    var c = {};
    for (var d in a) o.call(a, d) && b.indexOf(d) < 0 && (c[d] = a[d]);
    if (a != null && m)
      for (var d of m(a)) b.indexOf(d) < 0 && s.call(a, d) && (c[d] = a[d]);
    return c;
  };
var H = (a, b) => () => (b || a((b = { exports: {} }).exports, b), b.exports),
  I = (a, b) => {
    for (var c in b) n(a, c, { get: b[c], enumerable: !0 });
  },
  B = (a, b, c, d) => {
    if ((b && typeof b == "object") || typeof b == "function")
      for (let e of z(b))
        !o.call(a, e) &&
          e !== c &&
          n(a, e, {
            get: () => b[e],
            enumerable: !(d = x(b, e)) || d.enumerable,
          });
    return a;
  };
var J = (a, b, c) => (
  (c = a != null ? v(A(a)) : {}),
  B(
    b || !a || !a.__esModule
      ? n(c, "default", { value: a, enumerable: !0 })
      : c,
    a,
  )
);
var K = (a, b, c) =>
    new Promise((d, e) => {
      var f = (g) => {
          try {
            i(c.next(g));
          } catch (j) {
            e(j);
          }
        },
        h = (g) => {
          try {
            i(c.throw(g));
          } catch (j) {
            e(j);
          }
        },
        i = (g) => (g.done ? d(g.value) : Promise.resolve(g.value).then(f, h));
      i((c = c.apply(a, b)).next());
    }),
  t = function (a, b) {
    (this[0] = a), (this[1] = b);
  },
  L = (a, b, c) => {
    var d = (h, i, g, j) => {
        try {
          var p = c[h](i),
            q = (i = p.value) instanceof t,
            u = p.done;
          Promise.resolve(q ? i[0] : i)
            .then((k) =>
              q
                ? d(
                    h === "return" ? h : "next",
                    i[1] ? { done: k.done, value: k.value } : k,
                    g,
                    j,
                  )
                : g({ value: k, done: u }),
            )
            .catch((k) => d("throw", k, g, j));
        } catch (k) {
          j(k);
        }
      },
      e = (h) => (f[h] = (i) => new Promise((g, j) => d(h, i, g, j))),
      f = {};
    return (
      (c = c.apply(a, b)),
      (f[l("asyncIterator")] = () => f),
      e("next"),
      e("throw"),
      e("return"),
      f
    );
  },
  M = (a) => {
    var b = a[l("asyncIterator")],
      c = !1,
      d,
      e = {};
    return (
      b == null
        ? ((b = a[l("iterator")]()), (d = (f) => (e[f] = (h) => b[f](h))))
        : ((b = b.call(a)),
          (d = (f) =>
            (e[f] = (h) => {
              if (c) {
                if (((c = !1), f === "throw")) throw h;
                return h;
              }
              return (
                (c = !0),
                {
                  done: !1,
                  value: new t(
                    new Promise((i) => {
                      var g = b[f](h);
                      if (!(g instanceof Object))
                        throw TypeError("Object expected");
                      i(g);
                    }),
                    1,
                  ),
                }
              );
            }))),
      (e[l("iterator")] = () => e),
      d("next"),
      "throw" in b
        ? d("throw")
        : (e.throw = (f) => {
            throw f;
          }),
      "return" in b && d("return"),
      e
    );
  },
  N = (a, b, c) =>
    (b = a[l("asyncIterator")])
      ? b.call(a)
      : ((a = a[l("iterator")]()),
        (b = {}),
        (c = (d, e) =>
          (e = a[d]) &&
          (b[d] = (f) =>
            new Promise(
              (h, i, g) => (
                (f = e.call(a, f)),
                (g = f.done),
                Promise.resolve(f.value).then(
                  (j) => h({ value: j, done: g }),
                  i,
                )
              ),
            ))),
        c("next"),
        c("return"),
        b);
export {
  C as a,
  D as b,
  E as c,
  F as d,
  G as e,
  H as f,
  I as g,
  J as h,
  K as i,
  t as j,
  L as k,
  M as l,
  N as m,
};
