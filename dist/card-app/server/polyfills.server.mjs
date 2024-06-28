import { createRequire } from "node:module";
globalThis["require"] ??= createRequire(import.meta.url);
var Gr = ((v) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(v, { get: (N, d) => (typeof require < "u" ? require : N)[d] })
      : v)(function (v) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + v + '" is not supported');
});
(function (v) {
  let N = v.performance;
  function d(ee) {
    N && N.mark && N.mark(ee);
  }
  function u(ee, i) {
    N && N.measure && N.measure(ee, i);
  }
  d("Zone");
  let a = v.__Zone_symbol_prefix || "__zone_symbol__";
  function n(ee) {
    return a + ee;
  }
  let c = v[n("forceDuplicateZoneCheck")] === !0;
  if (v.Zone) {
    if (c || typeof v.Zone.__symbol__ != "function")
      throw new Error("Zone already loaded.");
    return v.Zone;
  }
  let ne = class ne {
    static assertZonePatched() {
      if (v.Promise !== o.ZoneAwarePromise)
        throw new Error(
          "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)",
        );
    }
    static get root() {
      let i = ne.current;
      for (; i.parent; ) i = i.parent;
      return i;
    }
    static get current() {
      return p.zone;
    }
    static get currentTask() {
      return D;
    }
    static __load_patch(i, g, k = !1) {
      if (o.hasOwnProperty(i)) {
        if (!k && c) throw Error("Already loaded patch: " + i);
      } else if (!v["__Zone_disable_" + i]) {
        let W = "Zone:" + i;
        d(W), (o[i] = g(v, ne, r)), u(W, W);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(i, g) {
      (this._parent = i),
        (this._name = g ? g.name || "unnamed" : "<root>"),
        (this._properties = (g && g.properties) || {}),
        (this._zoneDelegate = new s(
          this,
          this._parent && this._parent._zoneDelegate,
          g,
        ));
    }
    get(i) {
      let g = this.getZoneWith(i);
      if (g) return g._properties[i];
    }
    getZoneWith(i) {
      let g = this;
      for (; g; ) {
        if (g._properties.hasOwnProperty(i)) return g;
        g = g._parent;
      }
      return null;
    }
    fork(i) {
      if (!i) throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, i);
    }
    wrap(i, g) {
      if (typeof i != "function")
        throw new Error("Expecting function got: " + i);
      let k = this._zoneDelegate.intercept(this, i, g),
        W = this;
      return function () {
        return W.runGuarded(k, this, arguments, g);
      };
    }
    run(i, g, k, W) {
      p = { parent: p, zone: this };
      try {
        return this._zoneDelegate.invoke(this, i, g, k, W);
      } finally {
        p = p.parent;
      }
    }
    runGuarded(i, g = null, k, W) {
      p = { parent: p, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, i, g, k, W);
        } catch (ve) {
          if (this._zoneDelegate.handleError(this, ve)) throw ve;
        }
      } finally {
        p = p.parent;
      }
    }
    runTask(i, g, k) {
      if (i.zone != this)
        throw new Error(
          "A task can only be run in the zone of creation! (Creation: " +
            (i.zone || S).name +
            "; Execution: " +
            this.name +
            ")",
        );
      if (i.state === m && (i.type === f || i.type === $)) return;
      let W = i.state != Y;
      W && i._transitionTo(Y, J), i.runCount++;
      let ve = D;
      (D = i), (p = { parent: p, zone: this });
      try {
        i.type == $ && i.data && !i.data.isPeriodic && (i.cancelFn = void 0);
        try {
          return this._zoneDelegate.invokeTask(this, i, g, k);
        } catch (Z) {
          if (this._zoneDelegate.handleError(this, Z)) throw Z;
        }
      } finally {
        i.state !== m &&
          i.state !== L &&
          (i.type == f || (i.data && i.data.isPeriodic)
            ? W && i._transitionTo(J, Y)
            : ((i.runCount = 0),
              this._updateTaskCount(i, -1),
              W && i._transitionTo(m, Y, m))),
          (p = p.parent),
          (D = ve);
      }
    }
    scheduleTask(i) {
      if (i.zone && i.zone !== this) {
        let k = this;
        for (; k; ) {
          if (k === i.zone)
            throw Error(
              `can not reschedule task to ${this.name} which is descendants of the original zone ${i.zone.name}`,
            );
          k = k.parent;
        }
      }
      i._transitionTo(ie, m);
      let g = [];
      (i._zoneDelegates = g), (i._zone = this);
      try {
        i = this._zoneDelegate.scheduleTask(this, i);
      } catch (k) {
        throw (
          (i._transitionTo(L, ie, m),
          this._zoneDelegate.handleError(this, k),
          k)
        );
      }
      return (
        i._zoneDelegates === g && this._updateTaskCount(i, 1),
        i.state == ie && i._transitionTo(J, ie),
        i
      );
    }
    scheduleMicroTask(i, g, k, W) {
      return this.scheduleTask(new E(P, i, g, k, W, void 0));
    }
    scheduleMacroTask(i, g, k, W, ve) {
      return this.scheduleTask(new E($, i, g, k, W, ve));
    }
    scheduleEventTask(i, g, k, W, ve) {
      return this.scheduleTask(new E(f, i, g, k, W, ve));
    }
    cancelTask(i) {
      if (i.zone != this)
        throw new Error(
          "A task can only be cancelled in the zone of creation! (Creation: " +
            (i.zone || S).name +
            "; Execution: " +
            this.name +
            ")",
        );
      if (!(i.state !== J && i.state !== Y)) {
        i._transitionTo(F, J, Y);
        try {
          this._zoneDelegate.cancelTask(this, i);
        } catch (g) {
          throw (
            (i._transitionTo(L, F), this._zoneDelegate.handleError(this, g), g)
          );
        }
        return (
          this._updateTaskCount(i, -1),
          i._transitionTo(m, F),
          (i.runCount = 0),
          i
        );
      }
    }
    _updateTaskCount(i, g) {
      let k = i._zoneDelegates;
      g == -1 && (i._zoneDelegates = null);
      for (let W = 0; W < k.length; W++) k[W]._updateTaskCount(i.type, g);
    }
  };
  ne.__symbol__ = n;
  let l = ne,
    h = {
      name: "",
      onHasTask: (ee, i, g, k) => ee.hasTask(g, k),
      onScheduleTask: (ee, i, g, k) => ee.scheduleTask(g, k),
      onInvokeTask: (ee, i, g, k, W, ve) => ee.invokeTask(g, k, W, ve),
      onCancelTask: (ee, i, g, k) => ee.cancelTask(g, k),
    };
  class s {
    constructor(i, g, k) {
      (this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
        (this.zone = i),
        (this._parentDelegate = g),
        (this._forkZS = k && (k && k.onFork ? k : g._forkZS)),
        (this._forkDlgt = k && (k.onFork ? g : g._forkDlgt)),
        (this._forkCurrZone = k && (k.onFork ? this.zone : g._forkCurrZone)),
        (this._interceptZS = k && (k.onIntercept ? k : g._interceptZS)),
        (this._interceptDlgt = k && (k.onIntercept ? g : g._interceptDlgt)),
        (this._interceptCurrZone =
          k && (k.onIntercept ? this.zone : g._interceptCurrZone)),
        (this._invokeZS = k && (k.onInvoke ? k : g._invokeZS)),
        (this._invokeDlgt = k && (k.onInvoke ? g : g._invokeDlgt)),
        (this._invokeCurrZone =
          k && (k.onInvoke ? this.zone : g._invokeCurrZone)),
        (this._handleErrorZS = k && (k.onHandleError ? k : g._handleErrorZS)),
        (this._handleErrorDlgt =
          k && (k.onHandleError ? g : g._handleErrorDlgt)),
        (this._handleErrorCurrZone =
          k && (k.onHandleError ? this.zone : g._handleErrorCurrZone)),
        (this._scheduleTaskZS =
          k && (k.onScheduleTask ? k : g._scheduleTaskZS)),
        (this._scheduleTaskDlgt =
          k && (k.onScheduleTask ? g : g._scheduleTaskDlgt)),
        (this._scheduleTaskCurrZone =
          k && (k.onScheduleTask ? this.zone : g._scheduleTaskCurrZone)),
        (this._invokeTaskZS = k && (k.onInvokeTask ? k : g._invokeTaskZS)),
        (this._invokeTaskDlgt = k && (k.onInvokeTask ? g : g._invokeTaskDlgt)),
        (this._invokeTaskCurrZone =
          k && (k.onInvokeTask ? this.zone : g._invokeTaskCurrZone)),
        (this._cancelTaskZS = k && (k.onCancelTask ? k : g._cancelTaskZS)),
        (this._cancelTaskDlgt = k && (k.onCancelTask ? g : g._cancelTaskDlgt)),
        (this._cancelTaskCurrZone =
          k && (k.onCancelTask ? this.zone : g._cancelTaskCurrZone)),
        (this._hasTaskZS = null),
        (this._hasTaskDlgt = null),
        (this._hasTaskDlgtOwner = null),
        (this._hasTaskCurrZone = null);
      let W = k && k.onHasTask,
        ve = g && g._hasTaskZS;
      (W || ve) &&
        ((this._hasTaskZS = W ? k : h),
        (this._hasTaskDlgt = g),
        (this._hasTaskDlgtOwner = this),
        (this._hasTaskCurrZone = i),
        k.onScheduleTask ||
          ((this._scheduleTaskZS = h),
          (this._scheduleTaskDlgt = g),
          (this._scheduleTaskCurrZone = this.zone)),
        k.onInvokeTask ||
          ((this._invokeTaskZS = h),
          (this._invokeTaskDlgt = g),
          (this._invokeTaskCurrZone = this.zone)),
        k.onCancelTask ||
          ((this._cancelTaskZS = h),
          (this._cancelTaskDlgt = g),
          (this._cancelTaskCurrZone = this.zone)));
    }
    fork(i, g) {
      return this._forkZS
        ? this._forkZS.onFork(this._forkDlgt, this.zone, i, g)
        : new l(i, g);
    }
    intercept(i, g, k) {
      return this._interceptZS
        ? this._interceptZS.onIntercept(
            this._interceptDlgt,
            this._interceptCurrZone,
            i,
            g,
            k,
          )
        : g;
    }
    invoke(i, g, k, W, ve) {
      return this._invokeZS
        ? this._invokeZS.onInvoke(
            this._invokeDlgt,
            this._invokeCurrZone,
            i,
            g,
            k,
            W,
            ve,
          )
        : g.apply(k, W);
    }
    handleError(i, g) {
      return this._handleErrorZS
        ? this._handleErrorZS.onHandleError(
            this._handleErrorDlgt,
            this._handleErrorCurrZone,
            i,
            g,
          )
        : !0;
    }
    scheduleTask(i, g) {
      let k = g;
      if (this._scheduleTaskZS)
        this._hasTaskZS && k._zoneDelegates.push(this._hasTaskDlgtOwner),
          (k = this._scheduleTaskZS.onScheduleTask(
            this._scheduleTaskDlgt,
            this._scheduleTaskCurrZone,
            i,
            g,
          )),
          k || (k = g);
      else if (g.scheduleFn) g.scheduleFn(g);
      else if (g.type == P) w(g);
      else throw new Error("Task is missing scheduleFn.");
      return k;
    }
    invokeTask(i, g, k, W) {
      return this._invokeTaskZS
        ? this._invokeTaskZS.onInvokeTask(
            this._invokeTaskDlgt,
            this._invokeTaskCurrZone,
            i,
            g,
            k,
            W,
          )
        : g.callback.apply(k, W);
    }
    cancelTask(i, g) {
      let k;
      if (this._cancelTaskZS)
        k = this._cancelTaskZS.onCancelTask(
          this._cancelTaskDlgt,
          this._cancelTaskCurrZone,
          i,
          g,
        );
      else {
        if (!g.cancelFn) throw Error("Task is not cancelable");
        k = g.cancelFn(g);
      }
      return k;
    }
    hasTask(i, g) {
      try {
        this._hasTaskZS &&
          this._hasTaskZS.onHasTask(
            this._hasTaskDlgt,
            this._hasTaskCurrZone,
            i,
            g,
          );
      } catch (k) {
        this.handleError(i, k);
      }
    }
    _updateTaskCount(i, g) {
      let k = this._taskCounts,
        W = k[i],
        ve = (k[i] = W + g);
      if (ve < 0) throw new Error("More tasks executed then were scheduled.");
      if (W == 0 || ve == 0) {
        let Z = {
          microTask: k.microTask > 0,
          macroTask: k.macroTask > 0,
          eventTask: k.eventTask > 0,
          change: i,
        };
        this.hasTask(this.zone, Z);
      }
    }
  }
  class E {
    constructor(i, g, k, W, ve, Z) {
      if (
        ((this._zone = null),
        (this.runCount = 0),
        (this._zoneDelegates = null),
        (this._state = "notScheduled"),
        (this.type = i),
        (this.source = g),
        (this.data = W),
        (this.scheduleFn = ve),
        (this.cancelFn = Z),
        !k)
      )
        throw new Error("callback is not defined");
      this.callback = k;
      let G = this;
      i === f && W && W.useG
        ? (this.invoke = E.invokeTask)
        : (this.invoke = function () {
            return E.invokeTask.call(v, G, this, arguments);
          });
    }
    static invokeTask(i, g, k) {
      i || (i = this), O++;
      try {
        return i.runCount++, i.zone.runTask(i, g, k);
      } finally {
        O == 1 && _(), O--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(m, ie);
    }
    _transitionTo(i, g, k) {
      if (this._state === g || this._state === k)
        (this._state = i), i == m && (this._zoneDelegates = null);
      else
        throw new Error(
          `${this.type} '${this.source}': can not transition to '${i}', expecting state '${g}'${k ? " or '" + k + "'" : ""}, was '${this._state}'.`,
        );
    }
    toString() {
      return this.data && typeof this.data.handleId < "u"
        ? this.data.handleId.toString()
        : Object.prototype.toString.call(this);
    }
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount,
      };
    }
  }
  let b = n("setTimeout"),
    y = n("Promise"),
    x = n("then"),
    R = [],
    I = !1,
    re;
  function B(ee) {
    if ((re || (v[y] && (re = v[y].resolve(0))), re)) {
      let i = re[x];
      i || (i = re.then), i.call(re, ee);
    } else v[b](ee, 0);
  }
  function w(ee) {
    O === 0 && R.length === 0 && B(_), ee && R.push(ee);
  }
  function _() {
    if (!I) {
      for (I = !0; R.length; ) {
        let ee = R;
        R = [];
        for (let i = 0; i < ee.length; i++) {
          let g = ee[i];
          try {
            g.zone.runTask(g, null, null);
          } catch (k) {
            r.onUnhandledError(k);
          }
        }
      }
      r.microtaskDrainDone(), (I = !1);
    }
  }
  let S = { name: "NO ZONE" },
    m = "notScheduled",
    ie = "scheduling",
    J = "scheduled",
    Y = "running",
    F = "canceling",
    L = "unknown",
    P = "microTask",
    $ = "macroTask",
    f = "eventTask",
    o = {},
    r = {
      symbol: n,
      currentZoneFrame: () => p,
      onUnhandledError: z,
      microtaskDrainDone: z,
      scheduleMicroTask: w,
      showUncaughtError: () => !l[n("ignoreConsoleErrorUncaughtError")],
      patchEventTarget: () => [],
      patchOnProperties: z,
      patchMethod: () => z,
      bindArguments: () => [],
      patchThen: () => z,
      patchMacroTask: () => z,
      patchEventPrototype: () => z,
      isIEOrEdge: () => !1,
      getGlobalObjects: () => {},
      ObjectDefineProperty: () => z,
      ObjectGetOwnPropertyDescriptor: () => {},
      ObjectCreate: () => {},
      ArraySlice: () => [],
      patchClass: () => z,
      wrapWithCurrentZone: () => z,
      filterProperties: () => [],
      attachOriginToPatched: () => z,
      _redefineProperty: () => z,
      patchCallbacks: () => z,
      nativeScheduleMicroTask: B,
    },
    p = { parent: null, zone: new l(null, null) },
    D = null,
    O = 0;
  function z() {}
  return u("Zone", "Zone"), (v.Zone = l);
})(globalThis);
var En = Object.getOwnPropertyDescriptor,
  Ri = Object.defineProperty,
  ea = Object.getPrototypeOf,
  Oi = Array.prototype.slice,
  ta = "addEventListener",
  ra = "removeEventListener";
Zone.__symbol__(ta);
Zone.__symbol__(ra);
var It = "true",
  Rt = "false",
  zr = Zone.__symbol__("");
function Hi(v, N) {
  return Zone.current.wrap(v, N);
}
function na(v, N, d, u, a) {
  return Zone.current.scheduleMacroTask(v, N, d, u, a);
}
var je = Zone.__symbol__,
  Xr = typeof window < "u",
  Yr = Xr ? window : void 0,
  at = (Xr && Yr) || globalThis,
  qi = "removeAttribute";
function Pi(v, N) {
  for (let d = v.length - 1; d >= 0; d--)
    typeof v[d] == "function" && (v[d] = Hi(v[d], N + "_" + d));
  return v;
}
function Bi(v) {
  return v
    ? v.writable === !1
      ? !1
      : !(typeof v.get == "function" && typeof v.set > "u")
    : !0;
}
var aa = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope,
  ia =
    !("nw" in at) &&
    typeof at.process < "u" &&
    {}.toString.call(at.process) === "[object process]",
  Fi = !ia && !aa && !!(Xr && Yr.HTMLElement),
  Qn =
    typeof at.process < "u" &&
    {}.toString.call(at.process) === "[object process]" &&
    !aa &&
    !!(Xr && Yr.HTMLElement),
  Wr = {},
  $n = function (v) {
    if (((v = v || at.event), !v)) return;
    let N = Wr[v.type];
    N || (N = Wr[v.type] = je("ON_PROPERTY" + v.type));
    let d = this || v.target || at,
      u = d[N],
      a;
    if (Fi && d === Yr && v.type === "error") {
      let n = v;
      (a =
        u && u.call(this, n.message, n.filename, n.lineno, n.colno, n.error)),
        a === !0 && v.preventDefault();
    } else
      (a = u && u.apply(this, arguments)),
        a != null && !a && v.preventDefault();
    return a;
  };
function Jn(v, N, d) {
  let u = En(v, N);
  if (
    (!u && d && En(d, N) && (u = { enumerable: !0, configurable: !0 }),
    !u || !u.configurable)
  )
    return;
  let a = je("on" + N + "patched");
  if (v.hasOwnProperty(a) && v[a]) return;
  delete u.writable, delete u.value;
  let n = u.get,
    c = u.set,
    l = N.slice(2),
    h = Wr[l];
  h || (h = Wr[l] = je("ON_PROPERTY" + l)),
    (u.set = function (s) {
      let E = this;
      if ((!E && v === at && (E = at), !E)) return;
      typeof E[h] == "function" && E.removeEventListener(l, $n),
        c && c.call(E, null),
        (E[h] = s),
        typeof s == "function" && E.addEventListener(l, $n, !1);
    }),
    (u.get = function () {
      let s = this;
      if ((!s && v === at && (s = at), !s)) return null;
      let E = s[h];
      if (E) return E;
      if (n) {
        let b = n.call(this);
        if (b)
          return (
            u.set.call(this, b),
            typeof s[qi] == "function" && s.removeAttribute(N),
            b
          );
      }
      return null;
    }),
    Ri(v, N, u),
    (v[a] = !0);
}
function Ui(v, N, d) {
  if (N) for (let u = 0; u < N.length; u++) Jn(v, "on" + N[u], d);
  else {
    let u = [];
    for (let a in v) a.slice(0, 2) == "on" && u.push(a);
    for (let a = 0; a < u.length; a++) Jn(v, u[a], d);
  }
}
je("originalInstance");
function ji(v, N) {
  if (typeof Object.getOwnPropertySymbols != "function") return;
  Object.getOwnPropertySymbols(v).forEach((u) => {
    let a = Object.getOwnPropertyDescriptor(v, u);
    Object.defineProperty(N, u, {
      get: function () {
        return v[u];
      },
      set: function (n) {
        (a && (!a.writable || typeof a.set != "function")) || (v[u] = n);
      },
      enumerable: a ? a.enumerable : !0,
      configurable: a ? a.configurable : !0,
    });
  });
}
var sa = !1;
function Vi(v) {
  sa = v;
}
function tr(v, N, d) {
  let u = v;
  for (; u && !u.hasOwnProperty(N); ) u = ea(u);
  !u && v[N] && (u = v);
  let a = je(N),
    n = null;
  if (u && (!(n = u[a]) || !u.hasOwnProperty(a))) {
    n = u[a] = u[N];
    let c = u && En(u, N);
    if (Bi(c)) {
      let l = d(n, a, N);
      (u[N] = function () {
        return l(this, arguments);
      }),
        _r(u[N], n),
        sa && ji(n, u[N]);
    }
  }
  return n;
}
function Kr(v, N, d) {
  let u = null;
  function a(n) {
    let c = n.data;
    return (
      (c.args[c.cbIdx] = function () {
        n.invoke.apply(this, arguments);
      }),
      u.apply(c.target, c.args),
      n
    );
  }
  u = tr(
    v,
    N,
    (n) =>
      function (c, l) {
        let h = d(c, l);
        return h.cbIdx >= 0 && typeof l[h.cbIdx] == "function"
          ? na(h.name, l[h.cbIdx], h, a)
          : n.apply(c, l);
      },
  );
}
function Gi(v, N, d) {
  let u = null;
  function a(n) {
    let c = n.data;
    return (
      (c.args[c.cbIdx] = function () {
        n.invoke.apply(this, arguments);
      }),
      u.apply(c.target, c.args),
      n
    );
  }
  u = tr(
    v,
    N,
    (n) =>
      function (c, l) {
        let h = d(c, l);
        return h.cbIdx >= 0 && typeof l[h.cbIdx] == "function"
          ? Zone.current.scheduleMicroTask(h.name, l[h.cbIdx], h, a)
          : n.apply(c, l);
      },
  );
}
function _r(v, N) {
  v[je("OriginalDelegate")] = N;
}
Zone.__load_patch("ZoneAwarePromise", (v, N, d) => {
  let u = Object.getOwnPropertyDescriptor,
    a = Object.defineProperty;
  function n(Z) {
    if (Z && Z.toString === Object.prototype.toString) {
      let G = Z.constructor && Z.constructor.name;
      return (G || "") + ": " + JSON.stringify(Z);
    }
    return Z ? Z.toString() : Object.prototype.toString.call(Z);
  }
  let c = d.symbol,
    l = [],
    h = v[c("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1,
    s = c("Promise"),
    E = c("then"),
    b = "__creationTrace__";
  (d.onUnhandledError = (Z) => {
    if (d.showUncaughtError()) {
      let G = Z && Z.rejection;
      G
        ? console.error(
            "Unhandled Promise rejection:",
            G instanceof Error ? G.message : G,
            "; Zone:",
            Z.zone.name,
            "; Task:",
            Z.task && Z.task.source,
            "; Value:",
            G,
            G instanceof Error ? G.stack : void 0,
          )
        : console.error(Z);
    }
  }),
    (d.microtaskDrainDone = () => {
      for (; l.length; ) {
        let Z = l.shift();
        try {
          Z.zone.runGuarded(() => {
            throw Z.throwOriginal ? Z.rejection : Z;
          });
        } catch (G) {
          x(G);
        }
      }
    });
  let y = c("unhandledPromiseRejectionHandler");
  function x(Z) {
    d.onUnhandledError(Z);
    try {
      let G = N[y];
      typeof G == "function" && G.call(this, Z);
    } catch {}
  }
  function R(Z) {
    return Z && Z.then;
  }
  function I(Z) {
    return Z;
  }
  function re(Z) {
    return i.reject(Z);
  }
  let B = c("state"),
    w = c("value"),
    _ = c("finally"),
    S = c("parentPromiseValue"),
    m = c("parentPromiseState"),
    ie = "Promise.then",
    J = null,
    Y = !0,
    F = !1,
    L = 0;
  function P(Z, G) {
    return (H) => {
      try {
        r(Z, G, H);
      } catch (K) {
        r(Z, !1, K);
      }
    };
  }
  let $ = function () {
      let Z = !1;
      return function (H) {
        return function () {
          Z || ((Z = !0), H.apply(null, arguments));
        };
      };
    },
    f = "Promise resolved with itself",
    o = c("currentTaskTrace");
  function r(Z, G, H) {
    let K = $();
    if (Z === H) throw new TypeError(f);
    if (Z[B] === J) {
      let le = null;
      try {
        (typeof H == "object" || typeof H == "function") && (le = H && H.then);
      } catch (de) {
        return (
          K(() => {
            r(Z, !1, de);
          })(),
          Z
        );
      }
      if (
        G !== F &&
        H instanceof i &&
        H.hasOwnProperty(B) &&
        H.hasOwnProperty(w) &&
        H[B] !== J
      )
        D(H), r(Z, H[B], H[w]);
      else if (G !== F && typeof le == "function")
        try {
          le.call(H, K(P(Z, G)), K(P(Z, !1)));
        } catch (de) {
          K(() => {
            r(Z, !1, de);
          })();
        }
      else {
        Z[B] = G;
        let de = Z[w];
        if (
          ((Z[w] = H),
          Z[_] === _ && G === Y && ((Z[B] = Z[m]), (Z[w] = Z[S])),
          G === F && H instanceof Error)
        ) {
          let se = N.currentTask && N.currentTask.data && N.currentTask.data[b];
          se &&
            a(H, o, {
              configurable: !0,
              enumerable: !1,
              writable: !0,
              value: se,
            });
        }
        for (let se = 0; se < de.length; )
          O(Z, de[se++], de[se++], de[se++], de[se++]);
        if (de.length == 0 && G == F) {
          Z[B] = L;
          let se = H;
          try {
            throw new Error(
              "Uncaught (in promise): " +
                n(H) +
                (H && H.stack
                  ? `
` + H.stack
                  : ""),
            );
          } catch (me) {
            se = me;
          }
          h && (se.throwOriginal = !0),
            (se.rejection = H),
            (se.promise = Z),
            (se.zone = N.current),
            (se.task = N.currentTask),
            l.push(se),
            d.scheduleMicroTask();
        }
      }
    }
    return Z;
  }
  let p = c("rejectionHandledHandler");
  function D(Z) {
    if (Z[B] === L) {
      try {
        let G = N[p];
        G &&
          typeof G == "function" &&
          G.call(this, { rejection: Z[w], promise: Z });
      } catch {}
      Z[B] = F;
      for (let G = 0; G < l.length; G++) Z === l[G].promise && l.splice(G, 1);
    }
  }
  function O(Z, G, H, K, le) {
    D(Z);
    let de = Z[B],
      se = de
        ? typeof K == "function"
          ? K
          : I
        : typeof le == "function"
          ? le
          : re;
    G.scheduleMicroTask(
      ie,
      () => {
        try {
          let me = Z[w],
            ge = !!H && _ === H[_];
          ge && ((H[S] = me), (H[m] = de));
          let _e = G.run(se, void 0, ge && se !== re && se !== I ? [] : [me]);
          r(H, !0, _e);
        } catch (me) {
          r(H, !1, me);
        }
      },
      H,
    );
  }
  let z = "function ZoneAwarePromise() { [native code] }",
    ne = function () {},
    ee = v.AggregateError;
  class i {
    static toString() {
      return z;
    }
    static resolve(G) {
      return G instanceof i ? G : r(new this(null), Y, G);
    }
    static reject(G) {
      return r(new this(null), F, G);
    }
    static withResolvers() {
      let G = {};
      return (
        (G.promise = new i((H, K) => {
          (G.resolve = H), (G.reject = K);
        })),
        G
      );
    }
    static any(G) {
      if (!G || typeof G[Symbol.iterator] != "function")
        return Promise.reject(new ee([], "All promises were rejected"));
      let H = [],
        K = 0;
      try {
        for (let se of G) K++, H.push(i.resolve(se));
      } catch {
        return Promise.reject(new ee([], "All promises were rejected"));
      }
      if (K === 0)
        return Promise.reject(new ee([], "All promises were rejected"));
      let le = !1,
        de = [];
      return new i((se, me) => {
        for (let ge = 0; ge < H.length; ge++)
          H[ge].then(
            (_e) => {
              le || ((le = !0), se(_e));
            },
            (_e) => {
              de.push(_e),
                K--,
                K === 0 &&
                  ((le = !0), me(new ee(de, "All promises were rejected")));
            },
          );
      });
    }
    static race(G) {
      let H,
        K,
        le = new this((me, ge) => {
          (H = me), (K = ge);
        });
      function de(me) {
        H(me);
      }
      function se(me) {
        K(me);
      }
      for (let me of G) R(me) || (me = this.resolve(me)), me.then(de, se);
      return le;
    }
    static all(G) {
      return i.allWithCallback(G);
    }
    static allSettled(G) {
      return (this && this.prototype instanceof i ? this : i).allWithCallback(
        G,
        {
          thenCallback: (K) => ({ status: "fulfilled", value: K }),
          errorCallback: (K) => ({ status: "rejected", reason: K }),
        },
      );
    }
    static allWithCallback(G, H) {
      let K,
        le,
        de = new this((_e, Ae) => {
          (K = _e), (le = Ae);
        }),
        se = 2,
        me = 0,
        ge = [];
      for (let _e of G) {
        R(_e) || (_e = this.resolve(_e));
        let Ae = me;
        try {
          _e.then(
            (Me) => {
              (ge[Ae] = H ? H.thenCallback(Me) : Me), se--, se === 0 && K(ge);
            },
            (Me) => {
              H
                ? ((ge[Ae] = H.errorCallback(Me)), se--, se === 0 && K(ge))
                : le(Me);
            },
          );
        } catch (Me) {
          le(Me);
        }
        se++, me++;
      }
      return (se -= 2), se === 0 && K(ge), de;
    }
    constructor(G) {
      let H = this;
      if (!(H instanceof i)) throw new Error("Must be an instanceof Promise.");
      (H[B] = J), (H[w] = []);
      try {
        let K = $();
        G && G(K(P(H, Y)), K(P(H, F)));
      } catch (K) {
        r(H, !1, K);
      }
    }
    get [Symbol.toStringTag]() {
      return "Promise";
    }
    get [Symbol.species]() {
      return i;
    }
    then(G, H) {
      let K = this.constructor?.[Symbol.species];
      (!K || typeof K != "function") && (K = this.constructor || i);
      let le = new K(ne),
        de = N.current;
      return (
        this[B] == J ? this[w].push(de, le, G, H) : O(this, de, le, G, H), le
      );
    }
    catch(G) {
      return this.then(null, G);
    }
    finally(G) {
      let H = this.constructor?.[Symbol.species];
      (!H || typeof H != "function") && (H = i);
      let K = new H(ne);
      K[_] = _;
      let le = N.current;
      return this[B] == J ? this[w].push(le, K, G, G) : O(this, le, K, G, G), K;
    }
  }
  (i.resolve = i.resolve),
    (i.reject = i.reject),
    (i.race = i.race),
    (i.all = i.all);
  let g = (v[s] = v.Promise);
  v.Promise = i;
  let k = c("thenPatched");
  function W(Z) {
    let G = Z.prototype,
      H = u(G, "then");
    if (H && (H.writable === !1 || !H.configurable)) return;
    let K = G.then;
    (G[E] = K),
      (Z.prototype.then = function (le, de) {
        return new i((me, ge) => {
          K.call(this, me, ge);
        }).then(le, de);
      }),
      (Z[k] = !0);
  }
  d.patchThen = W;
  function ve(Z) {
    return function (G, H) {
      let K = Z.apply(G, H);
      if (K instanceof i) return K;
      let le = K.constructor;
      return le[k] || W(le), K;
    };
  }
  return (
    g && (W(g), tr(v, "fetch", (Z) => ve(Z))),
    (Promise[N.__symbol__("uncaughtPromiseErrors")] = l),
    i
  );
});
Zone.__load_patch("toString", (v) => {
  let N = Function.prototype.toString,
    d = je("OriginalDelegate"),
    u = je("Promise"),
    a = je("Error"),
    n = function () {
      if (typeof this == "function") {
        let s = this[d];
        if (s)
          return typeof s == "function"
            ? N.call(s)
            : Object.prototype.toString.call(s);
        if (this === Promise) {
          let E = v[u];
          if (E) return N.call(E);
        }
        if (this === Error) {
          let E = v[a];
          if (E) return N.call(E);
        }
      }
      return N.call(this);
    };
  (n[d] = N), (Function.prototype.toString = n);
  let c = Object.prototype.toString,
    l = "[object Promise]";
  Object.prototype.toString = function () {
    return typeof Promise == "function" && this instanceof Promise
      ? l
      : c.call(this);
  };
});
Zone.__load_patch("node_util", (v, N, d) => {
  (d.patchOnProperties = Ui),
    (d.patchMethod = tr),
    (d.bindArguments = Pi),
    (d.patchMacroTask = Kr),
    Vi(!0);
});
var er = !1;
if (typeof window < "u")
  try {
    let v = Object.defineProperty({}, "passive", {
      get: function () {
        er = !0;
      },
    });
    window.addEventListener("test", v, v),
      window.removeEventListener("test", v, v);
  } catch {
    er = !1;
  }
var Zi = { useG: !0 },
  nt = {},
  zi = {},
  oa = new RegExp("^" + zr + "(\\w+)(true|false)$"),
  Wi = je("propagationStopped");
function ca(v, N) {
  let d = (N ? N(v) : v) + Rt,
    u = (N ? N(v) : v) + It,
    a = zr + d,
    n = zr + u;
  (nt[v] = {}), (nt[v][Rt] = a), (nt[v][It] = n);
}
function Ki(v, N, d, u) {
  let a = (u && u.add) || ta,
    n = (u && u.rm) || ra,
    c = (u && u.listeners) || "eventListeners",
    l = (u && u.rmAll) || "removeAllListeners",
    h = je(a),
    s = "." + a + ":",
    E = "prependListener",
    b = "." + E + ":",
    y = function (w, _, S) {
      if (w.isRemoved) return;
      let m = w.callback;
      typeof m == "object" &&
        m.handleEvent &&
        ((w.callback = (Y) => m.handleEvent(Y)), (w.originalDelegate = m));
      let ie;
      try {
        w.invoke(w, _, [S]);
      } catch (Y) {
        ie = Y;
      }
      let J = w.options;
      if (J && typeof J == "object" && J.once) {
        let Y = w.originalDelegate ? w.originalDelegate : w.callback;
        _[n].call(_, S.type, Y, J);
      }
      return ie;
    };
  function x(w, _, S) {
    if (((_ = _ || v.event), !_)) return;
    let m = w || _.target || v,
      ie = m[nt[_.type][S ? It : Rt]];
    if (ie) {
      let J = [];
      if (ie.length === 1) {
        let Y = y(ie[0], m, _);
        Y && J.push(Y);
      } else {
        let Y = ie.slice();
        for (let F = 0; F < Y.length && !(_ && _[Wi] === !0); F++) {
          let L = y(Y[F], m, _);
          L && J.push(L);
        }
      }
      if (J.length === 1) throw J[0];
      for (let Y = 0; Y < J.length; Y++) {
        let F = J[Y];
        N.nativeScheduleMicroTask(() => {
          throw F;
        });
      }
    }
  }
  let R = function (w) {
      return x(this, w, !1);
    },
    I = function (w) {
      return x(this, w, !0);
    };
  function re(w, _) {
    if (!w) return !1;
    let S = !0;
    _ && _.useG !== void 0 && (S = _.useG);
    let m = _ && _.vh,
      ie = !0;
    _ && _.chkDup !== void 0 && (ie = _.chkDup);
    let J = !1;
    _ && _.rt !== void 0 && (J = _.rt);
    let Y = w;
    for (; Y && !Y.hasOwnProperty(a); ) Y = ea(Y);
    if ((!Y && w[a] && (Y = w), !Y || Y[h])) return !1;
    let F = _ && _.eventNameToString,
      L = {},
      P = (Y[h] = Y[a]),
      $ = (Y[je(n)] = Y[n]),
      f = (Y[je(c)] = Y[c]),
      o = (Y[je(l)] = Y[l]),
      r;
    _ && _.prepend && (r = Y[je(_.prepend)] = Y[_.prepend]);
    function p(H, K) {
      return !er && typeof H == "object" && H
        ? !!H.capture
        : !er || !K
          ? H
          : typeof H == "boolean"
            ? { capture: H, passive: !0 }
            : H
              ? typeof H == "object" && H.passive !== !1
                ? { ...H, passive: !0 }
                : H
              : { passive: !0 };
    }
    let D = function (H) {
        if (!L.isExisting)
          return P.call(L.target, L.eventName, L.capture ? I : R, L.options);
      },
      O = function (H) {
        if (!H.isRemoved) {
          let K = nt[H.eventName],
            le;
          K && (le = K[H.capture ? It : Rt]);
          let de = le && H.target[le];
          if (de) {
            for (let se = 0; se < de.length; se++)
              if (de[se] === H) {
                de.splice(se, 1),
                  (H.isRemoved = !0),
                  de.length === 0 &&
                    ((H.allRemoved = !0), (H.target[le] = null));
                break;
              }
          }
        }
        if (H.allRemoved)
          return $.call(H.target, H.eventName, H.capture ? I : R, H.options);
      },
      z = function (H) {
        return P.call(L.target, L.eventName, H.invoke, L.options);
      },
      ne = function (H) {
        return r.call(L.target, L.eventName, H.invoke, L.options);
      },
      ee = function (H) {
        return $.call(H.target, H.eventName, H.invoke, H.options);
      },
      i = S ? D : z,
      g = S ? O : ee,
      k = function (H, K) {
        let le = typeof K;
        return (
          (le === "function" && H.callback === K) ||
          (le === "object" && H.originalDelegate === K)
        );
      },
      W = _ && _.diff ? _.diff : k,
      ve = Zone[je("UNPATCHED_EVENTS")],
      Z = v[je("PASSIVE_EVENTS")],
      G = function (H, K, le, de, se = !1, me = !1) {
        return function () {
          let ge = this || v,
            _e = arguments[0];
          _ && _.transferEventName && (_e = _.transferEventName(_e));
          let Ae = arguments[1];
          if (!Ae) return H.apply(this, arguments);
          if (ia && _e === "uncaughtException") return H.apply(this, arguments);
          let Me = !1;
          if (typeof Ae != "function") {
            if (!Ae.handleEvent) return H.apply(this, arguments);
            Me = !0;
          }
          if (m && !m(H, Ae, ge, arguments)) return;
          let Ke = er && !!Z && Z.indexOf(_e) !== -1,
            Fe = p(arguments[2], Ke),
            Ot =
              Fe &&
              typeof Fe == "object" &&
              Fe.signal &&
              typeof Fe.signal == "object"
                ? Fe.signal
                : void 0;
          if (Ot?.aborted) return;
          if (ve) {
            for (let be = 0; be < ve.length; be++)
              if (_e === ve[be])
                return Ke ? H.call(ge, _e, Ae, Fe) : H.apply(this, arguments);
          }
          let et = Fe ? (typeof Fe == "boolean" ? !0 : Fe.capture) : !1,
            Ht = Fe && typeof Fe == "object" ? Fe.once : !1,
            Ue = Zone.current,
            nr = nt[_e];
          nr || (ca(_e, F), (nr = nt[_e]));
          let Ne = nr[et ? It : Rt],
            lt = ge[Ne],
            ar = !1;
          if (lt) {
            if (((ar = !0), ie)) {
              for (let be = 0; be < lt.length; be++) if (W(lt[be], Ae)) return;
            }
          } else lt = ge[Ne] = [];
          let Wt,
            ir = ge.constructor.name,
            sr = zi[ir];
          sr && (Wt = sr[_e]),
            Wt || (Wt = ir + K + (F ? F(_e) : _e)),
            (L.options = Fe),
            Ht && (L.options.once = !1),
            (L.target = ge),
            (L.capture = et),
            (L.eventName = _e),
            (L.isExisting = ar);
          let ut = S ? Zi : void 0;
          ut && (ut.taskData = L), Ot && (L.options.signal = void 0);
          let Xe = Ue.scheduleEventTask(Wt, Ae, ut, le, de);
          if (
            (Ot &&
              ((L.options.signal = Ot),
              H.call(
                Ot,
                "abort",
                () => {
                  Xe.zone.cancelTask(Xe);
                },
                { once: !0 },
              )),
            (L.target = null),
            ut && (ut.taskData = null),
            Ht && (Fe.once = !0),
            (!er && typeof Xe.options == "boolean") || (Xe.options = Fe),
            (Xe.target = ge),
            (Xe.capture = et),
            (Xe.eventName = _e),
            Me && (Xe.originalDelegate = Ae),
            me ? lt.unshift(Xe) : lt.push(Xe),
            se)
          )
            return ge;
        };
      };
    return (
      (Y[a] = G(P, s, i, g, J)),
      r && (Y[E] = G(r, b, ne, g, J, !0)),
      (Y[n] = function () {
        let H = this || v,
          K = arguments[0];
        _ && _.transferEventName && (K = _.transferEventName(K));
        let le = arguments[2],
          de = le ? (typeof le == "boolean" ? !0 : le.capture) : !1,
          se = arguments[1];
        if (!se) return $.apply(this, arguments);
        if (m && !m($, se, H, arguments)) return;
        let me = nt[K],
          ge;
        me && (ge = me[de ? It : Rt]);
        let _e = ge && H[ge];
        if (_e)
          for (let Ae = 0; Ae < _e.length; Ae++) {
            let Me = _e[Ae];
            if (W(Me, se)) {
              if (
                (_e.splice(Ae, 1),
                (Me.isRemoved = !0),
                _e.length === 0 &&
                  ((Me.allRemoved = !0), (H[ge] = null), typeof K == "string"))
              ) {
                let Ke = zr + "ON_PROPERTY" + K;
                H[Ke] = null;
              }
              return Me.zone.cancelTask(Me), J ? H : void 0;
            }
          }
        return $.apply(this, arguments);
      }),
      (Y[c] = function () {
        let H = this || v,
          K = arguments[0];
        _ && _.transferEventName && (K = _.transferEventName(K));
        let le = [],
          de = la(H, F ? F(K) : K);
        for (let se = 0; se < de.length; se++) {
          let me = de[se],
            ge = me.originalDelegate ? me.originalDelegate : me.callback;
          le.push(ge);
        }
        return le;
      }),
      (Y[l] = function () {
        let H = this || v,
          K = arguments[0];
        if (K) {
          _ && _.transferEventName && (K = _.transferEventName(K));
          let le = nt[K];
          if (le) {
            let de = le[Rt],
              se = le[It],
              me = H[de],
              ge = H[se];
            if (me) {
              let _e = me.slice();
              for (let Ae = 0; Ae < _e.length; Ae++) {
                let Me = _e[Ae],
                  Ke = Me.originalDelegate ? Me.originalDelegate : Me.callback;
                this[n].call(this, K, Ke, Me.options);
              }
            }
            if (ge) {
              let _e = ge.slice();
              for (let Ae = 0; Ae < _e.length; Ae++) {
                let Me = _e[Ae],
                  Ke = Me.originalDelegate ? Me.originalDelegate : Me.callback;
                this[n].call(this, K, Ke, Me.options);
              }
            }
          }
        } else {
          let le = Object.keys(H);
          for (let de = 0; de < le.length; de++) {
            let se = le[de],
              me = oa.exec(se),
              ge = me && me[1];
            ge && ge !== "removeListener" && this[l].call(this, ge);
          }
          this[l].call(this, "removeListener");
        }
        if (J) return this;
      }),
      _r(Y[a], P),
      _r(Y[n], $),
      o && _r(Y[l], o),
      f && _r(Y[c], f),
      !0
    );
  }
  let B = [];
  for (let w = 0; w < d.length; w++) B[w] = re(d[w], u);
  return B;
}
function la(v, N) {
  if (!N) {
    let n = [];
    for (let c in v) {
      let l = oa.exec(c),
        h = l && l[1];
      if (h && (!N || h === N)) {
        let s = v[c];
        if (s) for (let E = 0; E < s.length; E++) n.push(s[E]);
      }
    }
    return n;
  }
  let d = nt[N];
  d || (ca(N), (d = nt[N]));
  let u = v[d[Rt]],
    a = v[d[It]];
  return u ? (a ? u.concat(a) : u.slice()) : a ? a.slice() : [];
}
Zone.__load_patch("EventEmitter", (v, N, d) => {
  let u = "addListener",
    a = "prependListener",
    n = "removeListener",
    c = "removeAllListeners",
    l = "listeners",
    h = "on",
    s = "off",
    E = function (R, I) {
      return R.callback === I || R.callback.listener === I;
    },
    b = function (R) {
      return typeof R == "string"
        ? R
        : R
          ? R.toString().replace("(", "_").replace(")", "_")
          : "";
    };
  function y(R) {
    let I = Ki(v, d, [R], {
      useG: !1,
      add: u,
      rm: n,
      prepend: a,
      rmAll: c,
      listeners: l,
      chkDup: !1,
      rt: !0,
      diff: E,
      eventNameToString: b,
    });
    I && I[0] && ((R[h] = R[u]), (R[s] = R[n]));
  }
  let x;
  try {
    x = Gr("events");
  } catch {}
  x && x.EventEmitter && y(x.EventEmitter.prototype);
});
Zone.__load_patch("fs", (v, N, d) => {
  let u;
  try {
    u = Gr("fs");
  } catch {}
  if (!u) return;
  [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "exists",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "read",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "write",
    "writeFile",
  ]
    .filter((c) => !!u[c] && typeof u[c] == "function")
    .forEach((c) => {
      Kr(u, c, (l, h) => ({
        name: "fs." + c,
        args: h,
        cbIdx: h.length > 0 ? h.length - 1 : -1,
        target: l,
      }));
    });
  let n = u.realpath?.[d.symbol("OriginalDelegate")];
  n?.native &&
    ((u.realpath.native = n.native),
    Kr(u.realpath, "native", (c, l) => ({
      args: l,
      target: c,
      cbIdx: l.length > 0 ? l.length - 1 : -1,
      name: "fs.realpath.native",
    })));
});
function Xi(v, N) {
  N.patchMethod(
    v,
    "queueMicrotask",
    (d) =>
      function (u, a) {
        Zone.current.scheduleMicroTask("queueMicrotask", a[0]);
      },
  );
}
var Zr = je("zoneTask");
function Qt(v, N, d, u) {
  let a = null,
    n = null;
  (N += u), (d += u);
  let c = {};
  function l(s) {
    let E = s.data;
    return (
      (E.args[0] = function () {
        return s.invoke.apply(this, arguments);
      }),
      (E.handleId = a.apply(v, E.args)),
      s
    );
  }
  function h(s) {
    return n.call(v, s.data.handleId);
  }
  (a = tr(
    v,
    N,
    (s) =>
      function (E, b) {
        if (typeof b[0] == "function") {
          let y = {
              isPeriodic: u === "Interval",
              delay: u === "Timeout" || u === "Interval" ? b[1] || 0 : void 0,
              args: b,
            },
            x = b[0];
          b[0] = function () {
            try {
              return x.apply(this, arguments);
            } finally {
              y.isPeriodic ||
                (typeof y.handleId == "number"
                  ? delete c[y.handleId]
                  : y.handleId && (y.handleId[Zr] = null));
            }
          };
          let R = na(N, b[0], y, l, h);
          if (!R) return R;
          let I = R.data.handleId;
          return (
            typeof I == "number" ? (c[I] = R) : I && (I[Zr] = R),
            I &&
              I.ref &&
              I.unref &&
              typeof I.ref == "function" &&
              typeof I.unref == "function" &&
              ((R.ref = I.ref.bind(I)), (R.unref = I.unref.bind(I))),
            typeof I == "number" || I ? I : R
          );
        } else return s.apply(v, b);
      },
  )),
    (n = tr(
      v,
      d,
      (s) =>
        function (E, b) {
          let y = b[0],
            x;
          typeof y == "number" ? (x = c[y]) : ((x = y && y[Zr]), x || (x = y)),
            x && typeof x.type == "string"
              ? x.state !== "notScheduled" &&
                ((x.cancelFn && x.data.isPeriodic) || x.runCount === 0) &&
                (typeof y == "number" ? delete c[y] : y && (y[Zr] = null),
                x.zone.cancelTask(x))
              : s.apply(v, b);
        },
    ));
}
var $t = "set",
  Jt = "clear";
Zone.__load_patch("node_timers", (v, N) => {
  let d = !1;
  try {
    let u = Gr("timers");
    if (!(v.setTimeout === u.setTimeout) && !Qn) {
      let n = u.setTimeout;
      u.setTimeout = function () {
        return (d = !0), n.apply(this, arguments);
      };
      let c = v.setTimeout(() => {}, 100);
      clearTimeout(c), (u.setTimeout = n);
    }
    Qt(u, $t, Jt, "Timeout"),
      Qt(u, $t, Jt, "Interval"),
      Qt(u, $t, Jt, "Immediate");
  } catch {}
  Qn ||
    (d
      ? ((v[N.__symbol__("setTimeout")] = v.setTimeout),
        (v[N.__symbol__("setInterval")] = v.setInterval),
        (v[N.__symbol__("setImmediate")] = v.setImmediate))
      : (Qt(v, $t, Jt, "Timeout"),
        Qt(v, $t, Jt, "Interval"),
        Qt(v, $t, Jt, "Immediate")));
});
Zone.__load_patch("nextTick", () => {
  Gi(process, "nextTick", (v, N) => ({
    name: "process.nextTick",
    args: N,
    cbIdx: N.length > 0 && typeof N[0] == "function" ? 0 : -1,
    target: process,
  }));
});
Zone.__load_patch("handleUnhandledPromiseRejection", (v, N, d) => {
  (N[d.symbol("unhandledPromiseRejectionHandler")] = u("unhandledRejection")),
    (N[d.symbol("rejectionHandledHandler")] = u("rejectionHandled"));
  function u(a) {
    return function (n) {
      la(process, a).forEach((l) => {
        a === "unhandledRejection"
          ? l.invoke(n.rejection, n.promise)
          : a === "rejectionHandled" && l.invoke(n.promise);
      });
    };
  }
});
Zone.__load_patch("crypto", () => {
  let v;
  try {
    v = Gr("crypto");
  } catch {}
  v &&
    ["randomBytes", "pbkdf2"].forEach((d) => {
      Kr(v, d, (u, a) => ({
        name: "crypto." + d,
        args: a,
        cbIdx:
          a.length > 0 && typeof a[a.length - 1] == "function"
            ? a.length - 1
            : -1,
        target: v,
      }));
    });
});
Zone.__load_patch("console", (v, N) => {
  [
    "dir",
    "log",
    "info",
    "error",
    "warn",
    "assert",
    "debug",
    "timeEnd",
    "trace",
  ].forEach((u) => {
    let a = (console[N.__symbol__(u)] = console[u]);
    a &&
      (console[u] = function () {
        let n = Oi.call(arguments);
        return N.current === N.root ? a.apply(this, n) : N.root.run(a, this, n);
      });
  });
});
Zone.__load_patch("queueMicrotask", (v, N, d) => {
  Xi(v, d);
});
var Yi = Object.getOwnPropertyNames,
  ue = (v, N) =>
    function () {
      return N || (0, v[Yi(v)[0]])((N = { exports: {} }).exports, N), N.exports;
    },
  br = ue({
    "external/npm/node_modules/domino/lib/Event.js"(v, N) {
      "use strict";
      (N.exports = d),
        (d.CAPTURING_PHASE = 1),
        (d.AT_TARGET = 2),
        (d.BUBBLING_PHASE = 3);
      function d(u, a) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = d.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          u && (this.type = u),
          a)
        )
          for (var n in a) this[n] = a[n];
      }
      d.prototype = Object.create(Object.prototype, {
        constructor: { value: d },
        stopPropagation: {
          value: function () {
            this._propagationStopped = !0;
          },
        },
        stopImmediatePropagation: {
          value: function () {
            (this._propagationStopped = !0),
              (this._immediatePropagationStopped = !0);
          },
        },
        preventDefault: {
          value: function () {
            this.cancelable && (this.defaultPrevented = !0);
          },
        },
        initEvent: {
          value: function (a, n, c) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = a),
                (this.bubbles = n),
                (this.cancelable = c));
          },
        },
      });
    },
  }),
  fa = ue({
    "external/npm/node_modules/domino/lib/UIEvent.js"(v, N) {
      "use strict";
      var d = br();
      N.exports = u;
      function u() {
        d.call(this), (this.view = null), (this.detail = 0);
      }
      u.prototype = Object.create(d.prototype, {
        constructor: { value: u },
        initUIEvent: {
          value: function (a, n, c, l, h) {
            this.initEvent(a, n, c), (this.view = l), (this.detail = h);
          },
        },
      });
    },
  }),
  ha = ue({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(v, N) {
      "use strict";
      var d = fa();
      N.exports = u;
      function u() {
        d.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      u.prototype = Object.create(d.prototype, {
        constructor: { value: u },
        initMouseEvent: {
          value: function (a, n, c, l, h, s, E, b, y, x, R, I, re, B, w) {
            switch (
              (this.initEvent(a, n, c, l, h),
              (this.screenX = s),
              (this.screenY = E),
              (this.clientX = b),
              (this.clientY = y),
              (this.ctrlKey = x),
              (this.altKey = R),
              (this.shiftKey = I),
              (this.metaKey = re),
              (this.button = B),
              B)
            ) {
              case 0:
                this.buttons = 1;
                break;
              case 1:
                this.buttons = 4;
                break;
              case 2:
                this.buttons = 2;
                break;
              default:
                this.buttons = 0;
                break;
            }
            this.relatedTarget = w;
          },
        },
        getModifierState: {
          value: function (a) {
            switch (a) {
              case "Alt":
                return this.altKey;
              case "Control":
                return this.ctrlKey;
              case "Shift":
                return this.shiftKey;
              case "Meta":
                return this.metaKey;
              default:
                return !1;
            }
          },
        },
      });
    },
  }),
  vn = ue({
    "external/npm/node_modules/domino/lib/DOMException.js"(v, N) {
      "use strict";
      N.exports = L;
      var d = 1,
        u = 3,
        a = 4,
        n = 5,
        c = 7,
        l = 8,
        h = 9,
        s = 11,
        E = 12,
        b = 13,
        y = 14,
        x = 15,
        R = 17,
        I = 18,
        re = 19,
        B = 20,
        w = 21,
        _ = 22,
        S = 23,
        m = 24,
        ie = 25,
        J = [
          null,
          "INDEX_SIZE_ERR",
          null,
          "HIERARCHY_REQUEST_ERR",
          "WRONG_DOCUMENT_ERR",
          "INVALID_CHARACTER_ERR",
          null,
          "NO_MODIFICATION_ALLOWED_ERR",
          "NOT_FOUND_ERR",
          "NOT_SUPPORTED_ERR",
          "INUSE_ATTRIBUTE_ERR",
          "INVALID_STATE_ERR",
          "SYNTAX_ERR",
          "INVALID_MODIFICATION_ERR",
          "NAMESPACE_ERR",
          "INVALID_ACCESS_ERR",
          null,
          "TYPE_MISMATCH_ERR",
          "SECURITY_ERR",
          "NETWORK_ERR",
          "ABORT_ERR",
          "URL_MISMATCH_ERR",
          "QUOTA_EXCEEDED_ERR",
          "TIMEOUT_ERR",
          "INVALID_NODE_TYPE_ERR",
          "DATA_CLONE_ERR",
        ],
        Y = [
          null,
          "INDEX_SIZE_ERR (1): the index is not in the allowed range",
          null,
          "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model",
          "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required",
          "INVALID_CHARACTER_ERR (5): the string contains invalid characters",
          null,
          "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified",
          "NOT_FOUND_ERR (8): the object can not be found here",
          "NOT_SUPPORTED_ERR (9): this operation is not supported",
          "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute",
          "INVALID_STATE_ERR (11): the object is in an invalid state",
          "SYNTAX_ERR (12): the string did not match the expected pattern",
          "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way",
          "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML",
          "INVALID_ACCESS_ERR (15): the object does not support the operation or argument",
          null,
          "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type",
          "SECURITY_ERR (18): the operation is insecure",
          "NETWORK_ERR (19): a network error occurred",
          "ABORT_ERR (20): the user aborted an operation",
          "URL_MISMATCH_ERR (21): the given URL does not match another URL",
          "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded",
          "TIMEOUT_ERR (23): a timeout occurred",
          "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation",
          "DATA_CLONE_ERR (25): the object can not be cloned.",
        ],
        F = {
          INDEX_SIZE_ERR: d,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: u,
          WRONG_DOCUMENT_ERR: a,
          INVALID_CHARACTER_ERR: n,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: c,
          NOT_FOUND_ERR: l,
          NOT_SUPPORTED_ERR: h,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: s,
          SYNTAX_ERR: E,
          INVALID_MODIFICATION_ERR: b,
          NAMESPACE_ERR: y,
          INVALID_ACCESS_ERR: x,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: R,
          SECURITY_ERR: I,
          NETWORK_ERR: re,
          ABORT_ERR: B,
          URL_MISMATCH_ERR: w,
          QUOTA_EXCEEDED_ERR: _,
          TIMEOUT_ERR: S,
          INVALID_NODE_TYPE_ERR: m,
          DATA_CLONE_ERR: ie,
        };
      function L(f) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = f),
          (this.message = Y[f]),
          (this.name = J[f]);
      }
      L.prototype.__proto__ = Error.prototype;
      for ($ in F)
        (P = { value: F[$] }),
          Object.defineProperty(L, $, P),
          Object.defineProperty(L.prototype, $, P);
      var P, $;
    },
  }),
  Tn = ue({
    "external/npm/node_modules/domino/lib/config.js"(v) {
      v.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  Be = ue({
    "external/npm/node_modules/domino/lib/utils.js"(v) {
      "use strict";
      var N = vn(),
        d = N,
        u = Tn().isApiWritable;
      (v.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (v.IndexSizeError = function () {
          throw new N(d.INDEX_SIZE_ERR);
        }),
        (v.HierarchyRequestError = function () {
          throw new N(d.HIERARCHY_REQUEST_ERR);
        }),
        (v.WrongDocumentError = function () {
          throw new N(d.WRONG_DOCUMENT_ERR);
        }),
        (v.InvalidCharacterError = function () {
          throw new N(d.INVALID_CHARACTER_ERR);
        }),
        (v.NoModificationAllowedError = function () {
          throw new N(d.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (v.NotFoundError = function () {
          throw new N(d.NOT_FOUND_ERR);
        }),
        (v.NotSupportedError = function () {
          throw new N(d.NOT_SUPPORTED_ERR);
        }),
        (v.InvalidStateError = function () {
          throw new N(d.INVALID_STATE_ERR);
        }),
        (v.SyntaxError = function () {
          throw new N(d.SYNTAX_ERR);
        }),
        (v.InvalidModificationError = function () {
          throw new N(d.INVALID_MODIFICATION_ERR);
        }),
        (v.NamespaceError = function () {
          throw new N(d.NAMESPACE_ERR);
        }),
        (v.InvalidAccessError = function () {
          throw new N(d.INVALID_ACCESS_ERR);
        }),
        (v.TypeMismatchError = function () {
          throw new N(d.TYPE_MISMATCH_ERR);
        }),
        (v.SecurityError = function () {
          throw new N(d.SECURITY_ERR);
        }),
        (v.NetworkError = function () {
          throw new N(d.NETWORK_ERR);
        }),
        (v.AbortError = function () {
          throw new N(d.ABORT_ERR);
        }),
        (v.UrlMismatchError = function () {
          throw new N(d.URL_MISMATCH_ERR);
        }),
        (v.QuotaExceededError = function () {
          throw new N(d.QUOTA_EXCEEDED_ERR);
        }),
        (v.TimeoutError = function () {
          throw new N(d.TIMEOUT_ERR);
        }),
        (v.InvalidNodeTypeError = function () {
          throw new N(d.INVALID_NODE_TYPE_ERR);
        }),
        (v.DataCloneError = function () {
          throw new N(d.DATA_CLONE_ERR);
        }),
        (v.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (v.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass.",
          );
        }),
        (v.assert = function (a, n) {
          if (!a)
            throw new Error(
              "Assertion failed: " +
                (n || "") +
                `
` +
                new Error().stack,
            );
        }),
        (v.expose = function (a, n) {
          for (var c in a)
            Object.defineProperty(n.prototype, c, { value: a[c], writable: u });
        }),
        (v.merge = function (a, n) {
          for (var c in n) a[c] = n[c];
        }),
        (v.documentOrder = function (a, n) {
          return 3 - (a.compareDocumentPosition(n) & 6);
        }),
        (v.toASCIILowerCase = function (a) {
          return a.replace(/[A-Z]+/g, function (n) {
            return n.toLowerCase();
          });
        }),
        (v.toASCIIUpperCase = function (a) {
          return a.replace(/[a-z]+/g, function (n) {
            return n.toUpperCase();
          });
        });
    },
  }),
  da = ue({
    "external/npm/node_modules/domino/lib/EventTarget.js"(v, N) {
      "use strict";
      var d = br(),
        u = ha(),
        a = Be();
      N.exports = n;
      function n() {}
      n.prototype = {
        addEventListener: function (l, h, s) {
          if (h) {
            s === void 0 && (s = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[l] || (this._listeners[l] = []);
            for (var E = this._listeners[l], b = 0, y = E.length; b < y; b++) {
              var x = E[b];
              if (x.listener === h && x.capture === s) return;
            }
            var R = { listener: h, capture: s };
            typeof h == "function" && (R.f = h), E.push(R);
          }
        },
        removeEventListener: function (l, h, s) {
          if ((s === void 0 && (s = !1), this._listeners)) {
            var E = this._listeners[l];
            if (E)
              for (var b = 0, y = E.length; b < y; b++) {
                var x = E[b];
                if (x.listener === h && x.capture === s) {
                  E.length === 1
                    ? (this._listeners[l] = void 0)
                    : E.splice(b, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (l) {
          return this._dispatchEvent(l, !1);
        },
        _dispatchEvent: function (l, h) {
          typeof h != "boolean" && (h = !1);
          function s(I, re) {
            var B = re.type,
              w = re.eventPhase;
            if (
              ((re.currentTarget = I),
              w !== d.CAPTURING_PHASE && I._handlers && I._handlers[B])
            ) {
              var _ = I._handlers[B],
                S;
              if (typeof _ == "function") S = _.call(re.currentTarget, re);
              else {
                var m = _.handleEvent;
                if (typeof m != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function.",
                  );
                S = m.call(_, re);
              }
              switch (re.type) {
                case "mouseover":
                  S === !0 && re.preventDefault();
                  break;
                case "beforeunload":
                default:
                  S === !1 && re.preventDefault();
                  break;
              }
            }
            var ie = I._listeners && I._listeners[B];
            if (ie) {
              ie = ie.slice();
              for (var J = 0, Y = ie.length; J < Y; J++) {
                if (re._immediatePropagationStopped) return;
                var F = ie[J];
                if (
                  !(
                    (w === d.CAPTURING_PHASE && !F.capture) ||
                    (w === d.BUBBLING_PHASE && F.capture)
                  )
                )
                  if (F.f) F.f.call(re.currentTarget, re);
                  else {
                    var L = F.listener.handleEvent;
                    if (typeof L != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function.",
                      );
                    L.call(F.listener, re);
                  }
              }
            }
          }
          (!l._initialized || l._dispatching) && a.InvalidStateError(),
            (l.isTrusted = h),
            (l._dispatching = !0),
            (l.target = this);
          for (var E = [], b = this.parentNode; b; b = b.parentNode) E.push(b);
          l.eventPhase = d.CAPTURING_PHASE;
          for (
            var y = E.length - 1;
            y >= 0 && (s(E[y], l), !l._propagationStopped);
            y--
          );
          if (
            (l._propagationStopped ||
              ((l.eventPhase = d.AT_TARGET), s(this, l)),
            l.bubbles && !l._propagationStopped)
          ) {
            l.eventPhase = d.BUBBLING_PHASE;
            for (
              var x = 0, R = E.length;
              x < R && (s(E[x], l), !l._propagationStopped);
              x++
            );
          }
          if (
            ((l._dispatching = !1),
            (l.eventPhase = d.AT_TARGET),
            (l.currentTarget = null),
            h && !l.defaultPrevented && l instanceof u)
          )
            switch (l.type) {
              case "mousedown":
                this._armed = { x: l.clientX, y: l.clientY, t: l.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(l) && this._doClick(l), (this._armed = null);
                break;
            }
          return !l.defaultPrevented;
        },
        _isClick: function (c) {
          return (
            this._armed !== null &&
            c.type === "mouseup" &&
            c.isTrusted &&
            c.button === 0 &&
            c.timeStamp - this._armed.t < 1e3 &&
            Math.abs(c.clientX - this._armed.x) < 10 &&
            Math.abs(c.clientY - this._armed.Y) < 10
          );
        },
        _doClick: function (c) {
          if (!this._click_in_progress) {
            this._click_in_progress = !0;
            for (var l = this; l && !l._post_click_activation_steps; )
              l = l.parentNode;
            l &&
              l._pre_click_activation_steps &&
              l._pre_click_activation_steps();
            var h = this.ownerDocument.createEvent("MouseEvent");
            h.initMouseEvent(
              "click",
              !0,
              !0,
              this.ownerDocument.defaultView,
              1,
              c.screenX,
              c.screenY,
              c.clientX,
              c.clientY,
              c.ctrlKey,
              c.altKey,
              c.shiftKey,
              c.metaKey,
              c.button,
              null,
            );
            var s = this._dispatchEvent(h, !0);
            l &&
              (s
                ? l._post_click_activation_steps &&
                  l._post_click_activation_steps(h)
                : l._cancelled_activation_steps &&
                  l._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (l, h) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[l] = h);
        },
        _getEventHandler: function (l) {
          return (this._handlers && this._handlers[l]) || null;
        },
      };
    },
  }),
  pa = ue({
    "external/npm/node_modules/domino/lib/LinkedList.js"(v, N) {
      "use strict";
      var d = Be(),
        u = (N.exports = {
          valid: function (a) {
            return (
              d.assert(a, "list falsy"),
              d.assert(a._previousSibling, "previous falsy"),
              d.assert(a._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (a, n) {
            d.assert(u.valid(a) && u.valid(n));
            var c = a,
              l = a._previousSibling,
              h = n,
              s = n._previousSibling;
            (c._previousSibling = s),
              (l._nextSibling = h),
              (s._nextSibling = c),
              (h._previousSibling = l),
              d.assert(u.valid(a) && u.valid(n));
          },
          replace: function (a, n) {
            d.assert(u.valid(a) && (n === null || u.valid(n))),
              n !== null && u.insertBefore(n, a),
              u.remove(a),
              d.assert(u.valid(a) && (n === null || u.valid(n)));
          },
          remove: function (a) {
            d.assert(u.valid(a));
            var n = a._previousSibling;
            if (n !== a) {
              var c = a._nextSibling;
              (n._nextSibling = c),
                (c._previousSibling = n),
                (a._previousSibling = a._nextSibling = a),
                d.assert(u.valid(a));
            }
          },
        });
    },
  }),
  ma = ue({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(v, N) {
      "use strict";
      N.exports = {
        serializeOne: re,
        ɵescapeMatchingClosingTag: y,
        ɵescapeClosingCommentTag: R,
        ɵescapeProcessingInstructionContent: I,
      };
      var d = Be(),
        u = d.NAMESPACE,
        a = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        n = {
          area: !0,
          base: !0,
          basefont: !0,
          bgsound: !0,
          br: !0,
          col: !0,
          embed: !0,
          frame: !0,
          hr: !0,
          img: !0,
          input: !0,
          keygen: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
        },
        c = {},
        l = /[&<>\u00A0]/g,
        h = /[&"<>\u00A0]/g;
      function s(B) {
        return l.test(B)
          ? B.replace(l, (w) => {
              switch (w) {
                case "&":
                  return "&amp;";
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : B;
      }
      function E(B) {
        return h.test(B)
          ? B.replace(h, (w) => {
              switch (w) {
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "&":
                  return "&amp;";
                case '"':
                  return "&quot;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : B;
      }
      function b(B) {
        var w = B.namespaceURI;
        return w
          ? w === u.XML
            ? "xml:" + B.localName
            : w === u.XLINK
              ? "xlink:" + B.localName
              : w === u.XMLNS
                ? B.localName === "xmlns"
                  ? "xmlns"
                  : "xmlns:" + B.localName
                : B.name
          : B.localName;
      }
      function y(B, w) {
        let _ = "</" + w;
        if (!B.toLowerCase().includes(_)) return B;
        let S = [...B],
          m = B.matchAll(new RegExp(_, "ig"));
        for (let ie of m) S[ie.index] = "&lt;";
        return S.join("");
      }
      var x = /--!?>/;
      function R(B) {
        return x.test(B) ? B.replace(/(--\!?)>/g, "$1&gt;") : B;
      }
      function I(B) {
        return B.includes(">") ? B.replaceAll(">", "&gt;") : B;
      }
      function re(B, w) {
        var _ = "";
        switch (B.nodeType) {
          case 1:
            var S = B.namespaceURI,
              m = S === u.HTML,
              ie = m || S === u.SVG || S === u.MATHML ? B.localName : B.tagName;
            _ += "<" + ie;
            for (var J = 0, Y = B._numattrs; J < Y; J++) {
              var F = B._attr(J);
              (_ += " " + b(F)),
                F.value !== void 0 && (_ += '="' + E(F.value) + '"');
            }
            if (((_ += ">"), !(m && n[ie]))) {
              var L = B.serialize();
              a[ie.toUpperCase()] && (L = y(L, ie)),
                m &&
                  c[ie] &&
                  L.charAt(0) ===
                    `
` &&
                  (_ += `
`),
                (_ += L),
                (_ += "</" + ie + ">");
            }
            break;
          case 3:
          case 4:
            var P;
            w.nodeType === 1 && w.namespaceURI === u.HTML
              ? (P = w.tagName)
              : (P = ""),
              a[P] || (P === "NOSCRIPT" && w.ownerDocument._scripting_enabled)
                ? (_ += B.data)
                : (_ += s(B.data));
            break;
          case 8:
            _ += "<!--" + R(B.data) + "-->";
            break;
          case 7:
            let $ = I(B.data);
            _ += "<?" + B.target + " " + $ + "?>";
            break;
          case 10:
            (_ += "<!DOCTYPE " + B.name), (_ += ">");
            break;
          default:
            d.InvalidStateError();
        }
        return _;
      }
    },
  }),
  Ge = ue({
    "external/npm/node_modules/domino/lib/Node.js"(v, N) {
      "use strict";
      N.exports = c;
      var d = da(),
        u = pa(),
        a = ma(),
        n = Be();
      function c() {
        d.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var l = (c.ELEMENT_NODE = 1),
        h = (c.ATTRIBUTE_NODE = 2),
        s = (c.TEXT_NODE = 3),
        E = (c.CDATA_SECTION_NODE = 4),
        b = (c.ENTITY_REFERENCE_NODE = 5),
        y = (c.ENTITY_NODE = 6),
        x = (c.PROCESSING_INSTRUCTION_NODE = 7),
        R = (c.COMMENT_NODE = 8),
        I = (c.DOCUMENT_NODE = 9),
        re = (c.DOCUMENT_TYPE_NODE = 10),
        B = (c.DOCUMENT_FRAGMENT_NODE = 11),
        w = (c.NOTATION_NODE = 12),
        _ = (c.DOCUMENT_POSITION_DISCONNECTED = 1),
        S = (c.DOCUMENT_POSITION_PRECEDING = 2),
        m = (c.DOCUMENT_POSITION_FOLLOWING = 4),
        ie = (c.DOCUMENT_POSITION_CONTAINS = 8),
        J = (c.DOCUMENT_POSITION_CONTAINED_BY = 16),
        Y = (c.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      c.prototype = Object.create(d.prototype, {
        baseURI: { get: n.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === l
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: n.shouldOverride },
        firstChild: { get: n.shouldOverride },
        lastChild: { get: n.shouldOverride },
        isConnected: {
          get: function () {
            let F = this;
            for (; F != null; ) {
              if (F.nodeType === c.DOCUMENT_NODE) return !0;
              (F = F.parentNode),
                F != null &&
                  F.nodeType === c.DOCUMENT_FRAGMENT_NODE &&
                  (F = F.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var F = this.parentNode;
            return !F || this === F.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var F = this.parentNode,
              L = this._nextSibling;
            return !F || L === F.firstChild ? null : L;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (F) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (F) {},
        },
        _countChildrenOfType: {
          value: function (F) {
            for (var L = 0, P = this.firstChild; P !== null; P = P.nextSibling)
              P.nodeType === F && L++;
            return L;
          },
        },
        _ensureInsertValid: {
          value: function (L, P, $) {
            var f = this,
              o,
              r;
            if (!L.nodeType) throw new TypeError("not a node");
            switch (f.nodeType) {
              case I:
              case B:
              case l:
                break;
              default:
                n.HierarchyRequestError();
            }
            switch (
              (L.isAncestor(f) && n.HierarchyRequestError(),
              (P !== null || !$) && P.parentNode !== f && n.NotFoundError(),
              L.nodeType)
            ) {
              case B:
              case re:
              case l:
              case s:
              case x:
              case R:
                break;
              default:
                n.HierarchyRequestError();
            }
            if (f.nodeType === I)
              switch (L.nodeType) {
                case s:
                  n.HierarchyRequestError();
                  break;
                case B:
                  switch (
                    (L._countChildrenOfType(s) > 0 && n.HierarchyRequestError(),
                    L._countChildrenOfType(l))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (P !== null)
                        for (
                          $ && P.nodeType === re && n.HierarchyRequestError(),
                            r = P.nextSibling;
                          r !== null;
                          r = r.nextSibling
                        )
                          r.nodeType === re && n.HierarchyRequestError();
                      (o = f._countChildrenOfType(l)),
                        $
                          ? o > 0 && n.HierarchyRequestError()
                          : (o > 1 || (o === 1 && P.nodeType !== l)) &&
                            n.HierarchyRequestError();
                      break;
                    default:
                      n.HierarchyRequestError();
                  }
                  break;
                case l:
                  if (P !== null)
                    for (
                      $ && P.nodeType === re && n.HierarchyRequestError(),
                        r = P.nextSibling;
                      r !== null;
                      r = r.nextSibling
                    )
                      r.nodeType === re && n.HierarchyRequestError();
                  (o = f._countChildrenOfType(l)),
                    $
                      ? o > 0 && n.HierarchyRequestError()
                      : (o > 1 || (o === 1 && P.nodeType !== l)) &&
                        n.HierarchyRequestError();
                  break;
                case re:
                  if (P === null)
                    f._countChildrenOfType(l) && n.HierarchyRequestError();
                  else
                    for (
                      r = f.firstChild;
                      r !== null && r !== P;
                      r = r.nextSibling
                    )
                      r.nodeType === l && n.HierarchyRequestError();
                  (o = f._countChildrenOfType(re)),
                    $
                      ? o > 0 && n.HierarchyRequestError()
                      : (o > 1 || (o === 1 && P.nodeType !== re)) &&
                        n.HierarchyRequestError();
                  break;
              }
            else L.nodeType === re && n.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (L, P) {
            var $ = this;
            $._ensureInsertValid(L, P, !0);
            var f = P;
            return (
              f === L && (f = L.nextSibling),
              $.doc.adoptNode(L),
              L._insertOrReplace($, f, !1),
              L
            );
          },
        },
        appendChild: {
          value: function (F) {
            return this.insertBefore(F, null);
          },
        },
        _appendChild: {
          value: function (F) {
            F._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (L) {
            var P = this;
            if (!L.nodeType) throw new TypeError("not a node");
            return L.parentNode !== P && n.NotFoundError(), L.remove(), L;
          },
        },
        replaceChild: {
          value: function (L, P) {
            var $ = this;
            return (
              $._ensureInsertValid(L, P, !1),
              L.doc !== $.doc && $.doc.adoptNode(L),
              L._insertOrReplace($, P, !0),
              P
            );
          },
        },
        contains: {
          value: function (L) {
            return L === null
              ? !1
              : this === L
                ? !0
                : (this.compareDocumentPosition(L) & J) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (L) {
            if (this === L) return 0;
            if (this.doc !== L.doc || this.rooted !== L.rooted) return _ + Y;
            for (var P = [], $ = [], f = this; f !== null; f = f.parentNode)
              P.push(f);
            for (f = L; f !== null; f = f.parentNode) $.push(f);
            if ((P.reverse(), $.reverse(), P[0] !== $[0])) return _ + Y;
            f = Math.min(P.length, $.length);
            for (var o = 1; o < f; o++)
              if (P[o] !== $[o]) return P[o].index < $[o].index ? m : S;
            return P.length < $.length ? m + J : S + ie;
          },
        },
        isSameNode: {
          value: function (L) {
            return this === L;
          },
        },
        isEqualNode: {
          value: function (L) {
            if (!L || L.nodeType !== this.nodeType || !this.isEqual(L))
              return !1;
            for (
              var P = this.firstChild, $ = L.firstChild;
              P && $;
              P = P.nextSibling, $ = $.nextSibling
            )
              if (!P.isEqualNode($)) return !1;
            return P === null && $ === null;
          },
        },
        cloneNode: {
          value: function (F) {
            var L = this.clone();
            if (F)
              for (var P = this.firstChild; P !== null; P = P.nextSibling)
                L._appendChild(P.cloneNode(!0));
            return L;
          },
        },
        lookupPrefix: {
          value: function (L) {
            var P;
            if (L === "" || L === null || L === void 0) return null;
            switch (this.nodeType) {
              case l:
                return this._lookupNamespacePrefix(L, this);
              case I:
                return (P = this.documentElement), P ? P.lookupPrefix(L) : null;
              case y:
              case w:
              case B:
              case re:
                return null;
              case h:
                return (P = this.ownerElement), P ? P.lookupPrefix(L) : null;
              default:
                return (P = this.parentElement), P ? P.lookupPrefix(L) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (L) {
            (L === "" || L === void 0) && (L = null);
            var P;
            switch (this.nodeType) {
              case l:
                return n.shouldOverride();
              case I:
                return (
                  (P = this.documentElement), P ? P.lookupNamespaceURI(L) : null
                );
              case y:
              case w:
              case re:
              case B:
                return null;
              case h:
                return (
                  (P = this.ownerElement), P ? P.lookupNamespaceURI(L) : null
                );
              default:
                return (
                  (P = this.parentElement), P ? P.lookupNamespaceURI(L) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (L) {
            (L === "" || L === void 0) && (L = null);
            var P = this.lookupNamespaceURI(null);
            return P === L;
          },
        },
        index: {
          get: function () {
            var F = this.parentNode;
            if (this === F.firstChild) return 0;
            var L = F.childNodes;
            if (this._index === void 0 || L[this._index] !== this) {
              for (var P = 0; P < L.length; P++) L[P]._index = P;
              n.assert(L[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (F) {
            if (this.doc !== F.doc || this.rooted !== F.rooted) return !1;
            for (var L = F; L; L = L.parentNode) if (L === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (F) {
            F.ownerDocument === null
              ? (F.ownerDocument = this.doc)
              : F.ownerDocument !== this.doc && n.WrongDocumentError();
          },
        },
        removeChildren: { value: n.shouldOverride },
        _insertOrReplace: {
          value: function (L, P, $) {
            var f = this,
              o,
              r;
            if (
              (f.nodeType === B && f.rooted && n.HierarchyRequestError(),
              L._childNodes &&
                ((o = P === null ? L._childNodes.length : P.index),
                f.parentNode === L))
            ) {
              var p = f.index;
              p < o && o--;
            }
            $ && (P.rooted && P.doc.mutateRemove(P), (P.parentNode = null));
            var D = P;
            D === null && (D = L.firstChild);
            var O = f.rooted && L.rooted;
            if (f.nodeType === B) {
              for (
                var z = [0, $ ? 1 : 0], ne, ee = f.firstChild;
                ee !== null;
                ee = ne
              )
                (ne = ee.nextSibling), z.push(ee), (ee.parentNode = L);
              var i = z.length;
              if (
                ($
                  ? u.replace(D, i > 2 ? z[2] : null)
                  : i > 2 && D !== null && u.insertBefore(z[2], D),
                L._childNodes)
              )
                for (
                  z[0] = P === null ? L._childNodes.length : P._index,
                    L._childNodes.splice.apply(L._childNodes, z),
                    r = 2;
                  r < i;
                  r++
                )
                  z[r]._index = z[0] + (r - 2);
              else
                L._firstChild === P &&
                  (i > 2
                    ? (L._firstChild = z[2])
                    : $ && (L._firstChild = null));
              if (
                (f._childNodes
                  ? (f._childNodes.length = 0)
                  : (f._firstChild = null),
                L.rooted)
              )
                for (L.modify(), r = 2; r < i; r++) L.doc.mutateInsert(z[r]);
            } else {
              if (P === f) return;
              O ? f._remove() : f.parentNode && f.remove(),
                (f.parentNode = L),
                $
                  ? (u.replace(D, f),
                    L._childNodes
                      ? ((f._index = o), (L._childNodes[o] = f))
                      : L._firstChild === P && (L._firstChild = f))
                  : (D !== null && u.insertBefore(f, D),
                    L._childNodes
                      ? ((f._index = o), L._childNodes.splice(o, 0, f))
                      : L._firstChild === P && (L._firstChild = f)),
                O
                  ? (L.modify(), L.doc.mutateMove(f))
                  : L.rooted && (L.modify(), L.doc.mutateInsert(f));
            }
          },
        },
        lastModTime: {
          get: function () {
            return (
              this._lastModTime || (this._lastModTime = this.doc.modclock),
              this._lastModTime
            );
          },
        },
        modify: {
          value: function () {
            if (this.doc.modclock)
              for (
                var F = ++this.doc.modclock, L = this;
                L;
                L = L.parentElement
              )
                L._lastModTime && (L._lastModTime = F);
          },
        },
        doc: {
          get: function () {
            return this.ownerDocument || this;
          },
        },
        rooted: {
          get: function () {
            return !!this._nid;
          },
        },
        normalize: {
          value: function () {
            for (var F, L = this.firstChild; L !== null; L = F)
              if (
                ((F = L.nextSibling),
                L.normalize && L.normalize(),
                L.nodeType === c.TEXT_NODE)
              ) {
                if (L.nodeValue === "") {
                  this.removeChild(L);
                  continue;
                }
                var P = L.previousSibling;
                P !== null &&
                  P.nodeType === c.TEXT_NODE &&
                  (P.appendData(L.nodeValue), this.removeChild(L));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var F = "", L = this.firstChild; L !== null; L = L.nextSibling)
              F += a.serializeOne(L, this);
            return F;
          },
        },
        outerHTML: {
          get: function () {
            return a.serializeOne(this, { nodeType: 0 });
          },
          set: n.nyi,
        },
        ELEMENT_NODE: { value: l },
        ATTRIBUTE_NODE: { value: h },
        TEXT_NODE: { value: s },
        CDATA_SECTION_NODE: { value: E },
        ENTITY_REFERENCE_NODE: { value: b },
        ENTITY_NODE: { value: y },
        PROCESSING_INSTRUCTION_NODE: { value: x },
        COMMENT_NODE: { value: R },
        DOCUMENT_NODE: { value: I },
        DOCUMENT_TYPE_NODE: { value: re },
        DOCUMENT_FRAGMENT_NODE: { value: B },
        NOTATION_NODE: { value: w },
        DOCUMENT_POSITION_DISCONNECTED: { value: _ },
        DOCUMENT_POSITION_PRECEDING: { value: S },
        DOCUMENT_POSITION_FOLLOWING: { value: m },
        DOCUMENT_POSITION_CONTAINS: { value: ie },
        DOCUMENT_POSITION_CONTAINED_BY: { value: J },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: Y },
      });
    },
  }),
  Qi = ue({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(v, N) {
      "use strict";
      N.exports = class extends Array {
        constructor(u) {
          if ((super((u && u.length) || 0), u)) for (var a in u) this[a] = u[a];
        }
        item(u) {
          return this[u] || null;
        }
      };
    },
  }),
  $i = ue({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(v, N) {
      "use strict";
      function d(a) {
        return this[a] || null;
      }
      function u(a) {
        return a || (a = []), (a.item = d), a;
      }
      N.exports = u;
    },
  }),
  rr = ue({
    "external/npm/node_modules/domino/lib/NodeList.js"(v, N) {
      "use strict";
      var d;
      try {
        d = Qi();
      } catch {
        d = $i();
      }
      N.exports = d;
    },
  }),
  yn = ue({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(v, N) {
      "use strict";
      N.exports = a;
      var d = Ge(),
        u = rr();
      function a() {
        d.call(this), (this._firstChild = this._childNodes = null);
      }
      a.prototype = Object.create(d.prototype, {
        hasChildNodes: {
          value: function () {
            return this._childNodes
              ? this._childNodes.length > 0
              : this._firstChild !== null;
          },
        },
        childNodes: {
          get: function () {
            return this._ensureChildNodes(), this._childNodes;
          },
        },
        firstChild: {
          get: function () {
            return this._childNodes
              ? this._childNodes.length === 0
                ? null
                : this._childNodes[0]
              : this._firstChild;
          },
        },
        lastChild: {
          get: function () {
            var n = this._childNodes,
              c;
            return n
              ? n.length === 0
                ? null
                : n[n.length - 1]
              : ((c = this._firstChild),
                c === null ? null : c._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var n = this._firstChild,
                c = n,
                l = (this._childNodes = new u());
              if (n)
                do l.push(c), (c = c._nextSibling);
                while (c !== n);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var c = this.rooted ? this.ownerDocument : null,
                l = this.firstChild,
                h;
              l !== null;

            )
              (h = l),
                (l = h.nextSibling),
                c && c.mutateRemove(h),
                (h.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  wn = ue({
    "external/npm/node_modules/domino/lib/xmlnames.js"(v) {
      "use strict";
      (v.isValidName = I), (v.isValidQName = re);
      var N = /^[_:A-Za-z][-.:\w]+$/,
        d = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        u =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        a =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        n = "[" + u + "][" + a + "]*",
        c = u + ":",
        l = a + ":",
        h = new RegExp("^[" + c + "][" + l + "]*$"),
        s = new RegExp("^(" + n + "|" + n + ":" + n + ")$"),
        E = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        b = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        y = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (u += "\uD800-\u{EFC00}-\uDFFF"),
        (a += "\uD800-\u{EFC00}-\uDFFF"),
        (n = "[" + u + "][" + a + "]*"),
        (c = u + ":"),
        (l = a + ":");
      var x = new RegExp("^[" + c + "][" + l + "]*$"),
        R = new RegExp("^(" + n + "|" + n + ":" + n + ")$");
      function I(B) {
        if (N.test(B) || h.test(B)) return !0;
        if (!E.test(B) || !x.test(B)) return !1;
        var w = B.match(b),
          _ = B.match(y);
        return _ !== null && 2 * _.length === w.length;
      }
      function re(B) {
        if (d.test(B) || s.test(B)) return !0;
        if (!E.test(B) || !R.test(B)) return !1;
        var w = B.match(b),
          _ = B.match(y);
        return _ !== null && 2 * _.length === w.length;
      }
    },
  }),
  ga = ue({
    "external/npm/node_modules/domino/lib/attributes.js"(v) {
      "use strict";
      var N = Be();
      v.property = function (u) {
        if (Array.isArray(u.type)) {
          var a = Object.create(null);
          u.type.forEach(function (l) {
            a[l.value || l] = l.alias || l;
          });
          var n = u.missing;
          n === void 0 && (n = null);
          var c = u.invalid;
          return (
            c === void 0 && (c = n),
            {
              get: function () {
                var l = this._getattr(u.name);
                return l === null
                  ? n
                  : ((l = a[l.toLowerCase()]),
                    l !== void 0 ? l : c !== null ? c : l);
              },
              set: function (l) {
                this._setattr(u.name, l);
              },
            }
          );
        } else {
          if (u.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(u.name);
              },
              set: function (l) {
                l ? this._setattr(u.name, "") : this.removeAttribute(u.name);
              },
            };
          if (
            u.type === Number ||
            u.type === "long" ||
            u.type === "unsigned long" ||
            u.type === "limited unsigned long with fallback"
          )
            return d(u);
          if (!u.type || u.type === String)
            return {
              get: function () {
                return this._getattr(u.name) || "";
              },
              set: function (l) {
                u.treatNullAsEmptyString && l === null && (l = ""),
                  this._setattr(u.name, l);
              },
            };
          if (typeof u.type == "function") return u.type(u.name, u);
        }
        throw new Error("Invalid attribute definition");
      };
      function d(u) {
        var a;
        typeof u.default == "function"
          ? (a = u.default)
          : typeof u.default == "number"
            ? (a = function () {
                return u.default;
              })
            : (a = function () {
                N.assert(!1, typeof u.default);
              });
        var n = u.type === "unsigned long",
          c = u.type === "long",
          l = u.type === "limited unsigned long with fallback",
          h = u.min,
          s = u.max,
          E = u.setmin;
        return (
          h === void 0 && (n && (h = 0), c && (h = -2147483648), l && (h = 1)),
          s === void 0 && (n || c || l) && (s = 2147483647),
          {
            get: function () {
              var b = this._getattr(u.name),
                y = u.float ? parseFloat(b) : parseInt(b, 10);
              if (
                b === null ||
                !isFinite(y) ||
                (h !== void 0 && y < h) ||
                (s !== void 0 && y > s)
              )
                return a.call(this);
              if (n || c || l) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(b)) return a.call(this);
                y = y | 0;
              }
              return y;
            },
            set: function (b) {
              u.float || (b = Math.floor(b)),
                E !== void 0 &&
                  b < E &&
                  N.IndexSizeError(u.name + " set to " + b),
                n
                  ? (b = b < 0 || b > 2147483647 ? a.call(this) : b | 0)
                  : l
                    ? (b = b < 1 || b > 2147483647 ? a.call(this) : b | 0)
                    : c &&
                      (b =
                        b < -2147483648 || b > 2147483647
                          ? a.call(this)
                          : b | 0),
                this._setattr(u.name, String(b));
            },
          }
        );
      }
      v.registerChangeHandler = function (u, a, n) {
        var c = u.prototype;
        Object.prototype.hasOwnProperty.call(c, "_attributeChangeHandlers") ||
          (c._attributeChangeHandlers = Object.create(
            c._attributeChangeHandlers || null,
          )),
          (c._attributeChangeHandlers[a] = n);
      };
    },
  }),
  Ji = ue({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(v, N) {
      "use strict";
      N.exports = u;
      var d = Ge();
      function u(a, n) {
        (this.root = a),
          (this.filter = n),
          (this.lastModTime = a.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      u.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (a) {
            return (
              this.checkcache(),
              !this.done && a >= this.cache.length && this.traverse(),
              this.cache[a]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var a = this.cache.length - 1; a >= 0; a--) this[a] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (a) {
            a !== void 0 && a++;
            for (var n; (n = this.next()) !== null; )
              if (
                ((this[this.cache.length] = n),
                this.cache.push(n),
                a && this.cache.length === a)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var a =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              n;
            for (
              a.nodeType === d.DOCUMENT_NODE
                ? (n = a.documentElement)
                : (n = a.nextElement(this.root));
              n;

            ) {
              if (this.filter(n)) return n;
              n = n.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  _a = ue({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(v, N) {
      "use strict";
      var d = Be();
      N.exports = u;
      function u(h, s) {
        (this._getString = h),
          (this._setString = s),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(u.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (h) {
            var s = l(this);
            return h < 0 || h >= s.length ? null : s[h];
          },
        },
        contains: {
          value: function (h) {
            h = String(h);
            var s = l(this);
            return s.indexOf(h) > -1;
          },
        },
        add: {
          value: function () {
            for (var h = l(this), s = 0, E = arguments.length; s < E; s++) {
              var b = n(arguments[s]);
              h.indexOf(b) < 0 && h.push(b);
            }
            this._update(h);
          },
        },
        remove: {
          value: function () {
            for (var h = l(this), s = 0, E = arguments.length; s < E; s++) {
              var b = n(arguments[s]),
                y = h.indexOf(b);
              y > -1 && h.splice(y, 1);
            }
            this._update(h);
          },
        },
        toggle: {
          value: function (s, E) {
            return (
              (s = n(s)),
              this.contains(s)
                ? E === void 0 || E === !1
                  ? (this.remove(s), !1)
                  : !0
                : E === void 0 || E === !0
                  ? (this.add(s), !0)
                  : !1
            );
          },
        },
        replace: {
          value: function (s, E) {
            String(E) === "" && d.SyntaxError(), (s = n(s)), (E = n(E));
            var b = l(this),
              y = b.indexOf(s);
            if (y < 0) return !1;
            var x = b.indexOf(E);
            return (
              x < 0
                ? (b[y] = E)
                : y < x
                  ? ((b[y] = E), b.splice(x, 1))
                  : b.splice(y, 1),
              this._update(b),
              !0
            );
          },
        },
        toString: {
          value: function () {
            return this._getString();
          },
        },
        value: {
          get: function () {
            return this._getString();
          },
          set: function (h) {
            this._setString(h), this._update();
          },
        },
        _update: {
          value: function (h) {
            h
              ? (a(this, h), this._setString(h.join(" ").trim()))
              : a(this, l(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function a(h, s) {
        var E = h._length,
          b;
        for (h._length = s.length, b = 0; b < s.length; b++) h[b] = s[b];
        for (; b < E; b++) h[b] = void 0;
      }
      function n(h) {
        return (
          (h = String(h)),
          h === "" && d.SyntaxError(),
          /[ \t\r\n\f]/.test(h) && d.InvalidCharacterError(),
          h
        );
      }
      function c(h) {
        for (var s = h._length, E = Array(s), b = 0; b < s; b++) E[b] = h[b];
        return E;
      }
      function l(h) {
        var s = h._getString();
        if (s === h._lastStringValue) return c(h);
        var E = s.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (E === "") return [];
        var b = Object.create(null);
        return E.split(/[ \t\r\n\f]+/g).filter(function (y) {
          var x = "$" + y;
          return b[x] ? !1 : ((b[x] = !0), !0);
        });
      }
    },
  }),
  Nn = ue({
    "external/npm/node_modules/domino/lib/select.js"(v, N) {
      "use strict";
      var d = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        u = function (f, o) {
          return f.compareDocumentPosition(o);
        },
        a = function (f, o) {
          return u(f, o) & 2 ? 1 : -1;
        },
        n = function (f) {
          for (; (f = f.nextSibling) && f.nodeType !== 1; );
          return f;
        },
        c = function (f) {
          for (; (f = f.previousSibling) && f.nodeType !== 1; );
          return f;
        },
        l = function (f) {
          if ((f = f.firstChild))
            for (; f.nodeType !== 1 && (f = f.nextSibling); );
          return f;
        },
        h = function (f) {
          if ((f = f.lastChild))
            for (; f.nodeType !== 1 && (f = f.previousSibling); );
          return f;
        },
        s = function (f) {
          if (!f.parentNode) return !1;
          var o = f.parentNode.nodeType;
          return o === 1 || o === 9;
        },
        E = function (f) {
          if (!f) return f;
          var o = f[0];
          return o === '"' || o === "'"
            ? (f[f.length - 1] === o ? (f = f.slice(1, -1)) : (f = f.slice(1)),
              f.replace(m.str_escape, function (r) {
                var p = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(r);
                if (!p) return r.slice(1);
                if (p[2]) return "";
                var D = parseInt(p[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(D)
                  : String.fromCharCode(D);
              }))
            : m.ident.test(f)
              ? b(f)
              : f;
        },
        b = function (f) {
          return f.replace(m.escape, function (o) {
            var r = /^\\([0-9A-Fa-f]+)/.exec(o);
            if (!r) return o[1];
            var p = parseInt(r[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(p)
              : String.fromCharCode(p);
          });
        },
        y = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (f, o) {
                for (var r = this.length; r--; ) if (this[r] === o) return r;
                return -1;
              };
        })(),
        x = function (f, o) {
          var r = m.inside.source.replace(/</g, f).replace(/>/g, o);
          return new RegExp(r);
        },
        R = function (f, o, r) {
          return (
            (f = f.source), (f = f.replace(o, r.source || r)), new RegExp(f)
          );
        },
        I = function (f, o) {
          return f
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", o)
            .join("/");
        },
        re = function (f, o) {
          var r = f.replace(/\s+/g, ""),
            p;
          return (
            r === "even"
              ? (r = "2n+0")
              : r === "odd"
                ? (r = "2n+1")
                : r.indexOf("n") === -1 && (r = "0n" + r),
            (p = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(r)),
            {
              group: p[1] === "-" ? -(p[2] || 1) : +(p[2] || 1),
              offset: p[4] ? (p[3] === "-" ? -p[4] : +p[4]) : 0,
            }
          );
        },
        B = function (f, o, r) {
          var p = re(f),
            D = p.group,
            O = p.offset,
            z = r ? h : l,
            ne = r ? c : n;
          return function (ee) {
            if (s(ee))
              for (var i = z(ee.parentNode), g = 0; i; ) {
                if ((o(i, ee) && g++, i === ee))
                  return (g -= O), D && g ? g % D === 0 && g < 0 == D < 0 : !g;
                i = ne(i);
              }
          };
        },
        w = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (f) {
            return (
              (f = f.toLowerCase()),
              function (o) {
                return o.nodeName.toLowerCase() === f;
              }
            );
          },
          attr: function (f, o, r, p) {
            return (
              (o = _[o]),
              function (D) {
                var O;
                switch (f) {
                  case "for":
                    O = D.htmlFor;
                    break;
                  case "class":
                    (O = D.className),
                      O === "" && D.getAttribute("class") == null && (O = null);
                    break;
                  case "href":
                  case "src":
                    O = D.getAttribute(f, 2);
                    break;
                  case "title":
                    O = D.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (D.getAttribute) {
                      O = D.getAttribute(f);
                      break;
                    }
                  default:
                    if (D.hasAttribute && !D.hasAttribute(f)) break;
                    O =
                      D[f] != null ? D[f] : D.getAttribute && D.getAttribute(f);
                    break;
                }
                if (O != null)
                  return (
                    (O = O + ""),
                    p && ((O = O.toLowerCase()), (r = r.toLowerCase())),
                    o(O, r)
                  );
              }
            );
          },
          ":first-child": function (f) {
            return !c(f) && s(f);
          },
          ":last-child": function (f) {
            return !n(f) && s(f);
          },
          ":only-child": function (f) {
            return !c(f) && !n(f) && s(f);
          },
          ":nth-child": function (f, o) {
            return B(
              f,
              function () {
                return !0;
              },
              o,
            );
          },
          ":nth-last-child": function (f) {
            return w[":nth-child"](f, !0);
          },
          ":root": function (f) {
            return f.ownerDocument.documentElement === f;
          },
          ":empty": function (f) {
            return !f.firstChild;
          },
          ":not": function (f) {
            var o = P(f);
            return function (r) {
              return !o(r);
            };
          },
          ":first-of-type": function (f) {
            if (s(f)) {
              for (var o = f.nodeName; (f = c(f)); )
                if (f.nodeName === o) return;
              return !0;
            }
          },
          ":last-of-type": function (f) {
            if (s(f)) {
              for (var o = f.nodeName; (f = n(f)); )
                if (f.nodeName === o) return;
              return !0;
            }
          },
          ":only-of-type": function (f) {
            return w[":first-of-type"](f) && w[":last-of-type"](f);
          },
          ":nth-of-type": function (f, o) {
            return B(
              f,
              function (r, p) {
                return r.nodeName === p.nodeName;
              },
              o,
            );
          },
          ":nth-last-of-type": function (f) {
            return w[":nth-of-type"](f, !0);
          },
          ":checked": function (f) {
            return !!(f.checked || f.selected);
          },
          ":indeterminate": function (f) {
            return !w[":checked"](f);
          },
          ":enabled": function (f) {
            return !f.disabled && f.type !== "hidden";
          },
          ":disabled": function (f) {
            return !!f.disabled;
          },
          ":target": function (f) {
            return f.id === d.location.hash.substring(1);
          },
          ":focus": function (f) {
            return f === f.ownerDocument.activeElement;
          },
          ":is": function (f) {
            return P(f);
          },
          ":matches": function (f) {
            return w[":is"](f);
          },
          ":nth-match": function (f, o) {
            var r = f.split(/\s*,\s*/),
              p = r.shift(),
              D = P(r.join(","));
            return B(p, D, o);
          },
          ":nth-last-match": function (f) {
            return w[":nth-match"](f, !0);
          },
          ":links-here": function (f) {
            return f + "" == d.location + "";
          },
          ":lang": function (f) {
            return function (o) {
              for (; o; ) {
                if (o.lang) return o.lang.indexOf(f) === 0;
                o = o.parentNode;
              }
            };
          },
          ":dir": function (f) {
            return function (o) {
              for (; o; ) {
                if (o.dir) return o.dir === f;
                o = o.parentNode;
              }
            };
          },
          ":scope": function (f, o) {
            var r = o || f.ownerDocument;
            return r.nodeType === 9 ? f === r.documentElement : f === r;
          },
          ":any-link": function (f) {
            return typeof f.href == "string";
          },
          ":local-link": function (f) {
            if (f.nodeName) return f.href && f.host === d.location.host;
            var o = +f + 1;
            return function (r) {
              if (r.href) {
                var p = d.location + "",
                  D = r + "";
                return I(p, o) === I(D, o);
              }
            };
          },
          ":default": function (f) {
            return !!f.defaultSelected;
          },
          ":valid": function (f) {
            return f.willValidate || (f.validity && f.validity.valid);
          },
          ":invalid": function (f) {
            return !w[":valid"](f);
          },
          ":in-range": function (f) {
            return f.value > f.min && f.value <= f.max;
          },
          ":out-of-range": function (f) {
            return !w[":in-range"](f);
          },
          ":required": function (f) {
            return !!f.required;
          },
          ":optional": function (f) {
            return !f.required;
          },
          ":read-only": function (f) {
            if (f.readOnly) return !0;
            var o = f.getAttribute("contenteditable"),
              r = f.contentEditable,
              p = f.nodeName.toLowerCase();
            return (
              (p = p !== "input" && p !== "textarea"),
              (p || f.disabled) && o == null && r !== "true"
            );
          },
          ":read-write": function (f) {
            return !w[":read-only"](f);
          },
          ":hover": function () {
            throw new Error(":hover is not supported.");
          },
          ":active": function () {
            throw new Error(":active is not supported.");
          },
          ":link": function () {
            throw new Error(":link is not supported.");
          },
          ":visited": function () {
            throw new Error(":visited is not supported.");
          },
          ":column": function () {
            throw new Error(":column is not supported.");
          },
          ":nth-column": function () {
            throw new Error(":nth-column is not supported.");
          },
          ":nth-last-column": function () {
            throw new Error(":nth-last-column is not supported.");
          },
          ":current": function () {
            throw new Error(":current is not supported.");
          },
          ":past": function () {
            throw new Error(":past is not supported.");
          },
          ":future": function () {
            throw new Error(":future is not supported.");
          },
          ":contains": function (f) {
            return function (o) {
              var r = o.innerText || o.textContent || o.value || "";
              return r.indexOf(f) !== -1;
            };
          },
          ":has": function (f) {
            return function (o) {
              return $(f, o).length > 0;
            };
          },
        },
        _ = {
          "-": function () {
            return !0;
          },
          "=": function (f, o) {
            return f === o;
          },
          "*=": function (f, o) {
            return f.indexOf(o) !== -1;
          },
          "~=": function (f, o) {
            var r, p, D, O;
            for (p = 0; ; p = r + 1) {
              if (((r = f.indexOf(o, p)), r === -1)) return !1;
              if (
                ((D = f[r - 1]),
                (O = f[r + o.length]),
                (!D || D === " ") && (!O || O === " "))
              )
                return !0;
            }
          },
          "|=": function (f, o) {
            var r = f.indexOf(o),
              p;
            if (r === 0) return (p = f[r + o.length]), p === "-" || !p;
          },
          "^=": function (f, o) {
            return f.indexOf(o) === 0;
          },
          "$=": function (f, o) {
            var r = f.lastIndexOf(o);
            return r !== -1 && r + o.length === f.length;
          },
          "!=": function (f, o) {
            return f !== o;
          },
        },
        S = {
          " ": function (f) {
            return function (o) {
              for (; (o = o.parentNode); ) if (f(o)) return o;
            };
          },
          ">": function (f) {
            return function (o) {
              if ((o = o.parentNode)) return f(o) && o;
            };
          },
          "+": function (f) {
            return function (o) {
              if ((o = c(o))) return f(o) && o;
            };
          },
          "~": function (f) {
            return function (o) {
              for (; (o = c(o)); ) if (f(o)) return o;
            };
          },
          noop: function (f) {
            return function (o) {
              return f(o) && o;
            };
          },
          ref: function (f, o) {
            var r;
            function p(D) {
              for (
                var O = D.ownerDocument,
                  z = O.getElementsByTagName("*"),
                  ne = z.length;
                ne--;

              )
                if (((r = z[ne]), p.test(D))) return (r = null), !0;
              r = null;
            }
            return (
              (p.combinator = function (D) {
                if (!(!r || !r.getAttribute)) {
                  var O = r.getAttribute(o) || "";
                  if (
                    (O[0] === "#" && (O = O.substring(1)), O === D.id && f(r))
                  )
                    return r;
                }
              }),
              p
            );
          },
        },
        m = {
          escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
          str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
          nonascii: /[\u00A0-\uFFFF]/,
          cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
          qname: /^ *(cssid|\*)/,
          simple: /^(?:([.#]cssid)|pseudo|attr)/,
          ref: /^ *\/(cssid)\/ */,
          combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
          attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
          pseudo: /^(:cssid)(?:\((inside)\))?/,
          inside:
            /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
          ident: /^(cssid)$/,
        };
      (m.cssid = R(m.cssid, "nonascii", m.nonascii)),
        (m.cssid = R(m.cssid, "escape", m.escape)),
        (m.qname = R(m.qname, "cssid", m.cssid)),
        (m.simple = R(m.simple, "cssid", m.cssid)),
        (m.ref = R(m.ref, "cssid", m.cssid)),
        (m.attr = R(m.attr, "cssid", m.cssid)),
        (m.pseudo = R(m.pseudo, "cssid", m.cssid)),
        (m.inside = R(m.inside, `[^"'>]*`, m.inside)),
        (m.attr = R(m.attr, "inside", x("\\[", "\\]"))),
        (m.pseudo = R(m.pseudo, "inside", x("\\(", "\\)"))),
        (m.simple = R(m.simple, "pseudo", m.pseudo)),
        (m.simple = R(m.simple, "attr", m.attr)),
        (m.ident = R(m.ident, "cssid", m.cssid)),
        (m.str_escape = R(m.str_escape, "escape", m.escape));
      var ie = function (f) {
          for (
            var o = f.replace(/^\s+|\s+$/g, ""),
              r,
              p = [],
              D = [],
              O,
              z,
              ne,
              ee,
              i;
            o;

          ) {
            if ((ne = m.qname.exec(o)))
              (o = o.substring(ne[0].length)), (z = b(ne[1])), D.push(J(z, !0));
            else if ((ne = m.simple.exec(o)))
              (o = o.substring(ne[0].length)),
                (z = "*"),
                D.push(J(z, !0)),
                D.push(J(ne));
            else throw new SyntaxError("Invalid selector.");
            for (; (ne = m.simple.exec(o)); )
              (o = o.substring(ne[0].length)), D.push(J(ne));
            if (
              (o[0] === "!" &&
                ((o = o.substring(1)),
                (O = L()),
                (O.qname = z),
                D.push(O.simple)),
              (ne = m.ref.exec(o)))
            ) {
              (o = o.substring(ne[0].length)),
                (i = S.ref(Y(D), b(ne[1]))),
                p.push(i.combinator),
                (D = []);
              continue;
            }
            if ((ne = m.combinator.exec(o))) {
              if (
                ((o = o.substring(ne[0].length)),
                (ee = ne[1] || ne[2] || ne[3]),
                ee === ",")
              ) {
                p.push(S.noop(Y(D)));
                break;
              }
            } else ee = "noop";
            if (!S[ee]) throw new SyntaxError("Bad combinator.");
            p.push(S[ee](Y(D))), (D = []);
          }
          return (
            (r = F(p)),
            (r.qname = z),
            (r.sel = o),
            O &&
              ((O.lname = r.qname),
              (O.test = r),
              (O.qname = O.qname),
              (O.sel = r.sel),
              (r = O)),
            i && ((i.test = r), (i.qname = r.qname), (i.sel = r.sel), (r = i)),
            r
          );
        },
        J = function (f, o) {
          if (o) return f === "*" ? w["*"] : w.type(f);
          if (f[1])
            return f[1][0] === "."
              ? w.attr("class", "~=", b(f[1].substring(1)), !1)
              : w.attr("id", "=", b(f[1].substring(1)), !1);
          if (f[2]) return f[3] ? w[b(f[2])](E(f[3])) : w[b(f[2])];
          if (f[4]) {
            var r = f[6],
              p = /["'\s]\s*I$/i.test(r);
            return (
              p && (r = r.replace(/\s*I$/i, "")),
              w.attr(b(f[4]), f[5] || "-", E(r), p)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        Y = function (f) {
          var o = f.length,
            r;
          return o < 2
            ? f[0]
            : function (p) {
                if (p) {
                  for (r = 0; r < o; r++) if (!f[r](p)) return;
                  return !0;
                }
              };
        },
        F = function (f) {
          return f.length < 2
            ? function (o) {
                return !!f[0](o);
              }
            : function (o) {
                for (var r = f.length; r--; ) if (!(o = f[r](o))) return;
                return !0;
              };
        },
        L = function () {
          var f;
          function o(r) {
            for (
              var p = r.ownerDocument,
                D = p.getElementsByTagName(o.lname),
                O = D.length;
              O--;

            )
              if (o.test(D[O]) && f === r) return (f = null), !0;
            f = null;
          }
          return (
            (o.simple = function (r) {
              return (f = r), !0;
            }),
            o
          );
        },
        P = function (f) {
          for (var o = ie(f), r = [o]; o.sel; ) (o = ie(o.sel)), r.push(o);
          return r.length < 2
            ? o
            : function (p) {
                for (var D = r.length, O = 0; O < D; O++)
                  if (r[O](p)) return !0;
              };
        },
        $ = function (f, o) {
          for (
            var r = [],
              p = ie(f),
              D = o.getElementsByTagName(p.qname),
              O = 0,
              z;
            (z = D[O++]);

          )
            p(z) && r.push(z);
          if (p.sel) {
            for (; p.sel; )
              for (
                p = ie(p.sel), D = o.getElementsByTagName(p.qname), O = 0;
                (z = D[O++]);

              )
                p(z) && y.call(r, z) === -1 && r.push(z);
            r.sort(a);
          }
          return r;
        };
      (N.exports = v =
        function (f, o) {
          var r, p;
          if (o.nodeType !== 11 && f.indexOf(" ") === -1) {
            if (
              f[0] === "#" &&
              o.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(f) &&
              o.doc._hasMultipleElementsWithId &&
              ((r = f.substring(1)), !o.doc._hasMultipleElementsWithId(r))
            )
              return (p = o.doc.getElementById(r)), p ? [p] : [];
            if (f[0] === "." && /^\.\w+$/.test(f))
              return o.getElementsByClassName(f.substring(1));
            if (/^\w+$/.test(f)) return o.getElementsByTagName(f);
          }
          return $(f, o);
        }),
        (v.selectors = w),
        (v.operators = _),
        (v.combinators = S),
        (v.matches = function (f, o) {
          var r = { sel: o };
          do if (((r = ie(r.sel)), r(f))) return !0;
          while (r.sel);
          return !1;
        });
    },
  }),
  Sn = ue({
    "external/npm/node_modules/domino/lib/ChildNode.js"(v, N) {
      "use strict";
      var d = Ge(),
        u = pa(),
        a = function (c, l) {
          for (var h = c.createDocumentFragment(), s = 0; s < l.length; s++) {
            var E = l[s],
              b = E instanceof d;
            h.appendChild(b ? E : c.createTextNode(String(E)));
          }
          return h;
        },
        n = {
          after: {
            value: function () {
              var l = Array.prototype.slice.call(arguments),
                h = this.parentNode,
                s = this.nextSibling;
              if (h !== null) {
                for (
                  ;
                  s &&
                  l.some(function (b) {
                    return b === s;
                  });

                )
                  s = s.nextSibling;
                var E = a(this.doc, l);
                h.insertBefore(E, s);
              }
            },
          },
          before: {
            value: function () {
              var l = Array.prototype.slice.call(arguments),
                h = this.parentNode,
                s = this.previousSibling;
              if (h !== null) {
                for (
                  ;
                  s &&
                  l.some(function (y) {
                    return y === s;
                  });

                )
                  s = s.previousSibling;
                var E = a(this.doc, l),
                  b = s ? s.nextSibling : h.firstChild;
                h.insertBefore(E, b);
              }
            },
          },
          remove: {
            value: function () {
              this.parentNode !== null &&
                (this.doc &&
                  (this.doc._preremoveNodeIterators(this),
                  this.rooted && this.doc.mutateRemove(this)),
                this._remove(),
                (this.parentNode = null));
            },
          },
          _remove: {
            value: function () {
              var l = this.parentNode;
              l !== null &&
                (l._childNodes
                  ? l._childNodes.splice(this.index, 1)
                  : l._firstChild === this &&
                    (this._nextSibling === this
                      ? (l._firstChild = null)
                      : (l._firstChild = this._nextSibling)),
                u.remove(this),
                l.modify());
            },
          },
          replaceWith: {
            value: function () {
              var l = Array.prototype.slice.call(arguments),
                h = this.parentNode,
                s = this.nextSibling;
              if (h !== null) {
                for (
                  ;
                  s &&
                  l.some(function (b) {
                    return b === s;
                  });

                )
                  s = s.nextSibling;
                var E = a(this.doc, l);
                this.parentNode === h
                  ? h.replaceChild(E, this)
                  : h.insertBefore(E, s);
              }
            },
          },
        };
      N.exports = n;
    },
  }),
  ba = ue({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(v, N) {
      "use strict";
      var d = Ge(),
        u = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var a = this.nextSibling; a !== null; a = a.nextSibling)
                  if (a.nodeType === d.ELEMENT_NODE) return a;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var a = this.previousSibling;
                  a !== null;
                  a = a.previousSibling
                )
                  if (a.nodeType === d.ELEMENT_NODE) return a;
              }
              return null;
            },
          },
        };
      N.exports = u;
    },
  }),
  Ea = ue({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(v, N) {
      "use strict";
      N.exports = u;
      var d = Be();
      function u(a) {
        this.element = a;
      }
      Object.defineProperties(u.prototype, {
        length: { get: d.shouldOverride },
        item: { value: d.shouldOverride },
        getNamedItem: {
          value: function (n) {
            return this.element.getAttributeNode(n);
          },
        },
        getNamedItemNS: {
          value: function (n, c) {
            return this.element.getAttributeNodeNS(n, c);
          },
        },
        setNamedItem: { value: d.nyi },
        setNamedItemNS: { value: d.nyi },
        removeNamedItem: {
          value: function (n) {
            var c = this.element.getAttributeNode(n);
            if (c) return this.element.removeAttribute(n), c;
            d.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (n, c) {
            var l = this.element.getAttributeNodeNS(n, c);
            if (l) return this.element.removeAttributeNS(n, c), l;
            d.NotFoundError();
          },
        },
      });
    },
  }),
  Er = ue({
    "external/npm/node_modules/domino/lib/Element.js"(v, N) {
      "use strict";
      N.exports = w;
      var d = wn(),
        u = Be(),
        a = u.NAMESPACE,
        n = ga(),
        c = Ge(),
        l = rr(),
        h = ma(),
        s = Ji(),
        E = vn(),
        b = _a(),
        y = Nn(),
        x = yn(),
        R = Sn(),
        I = ba(),
        re = Ea(),
        B = Object.create(null);
      function w(o, r, p, D) {
        x.call(this),
          (this.nodeType = c.ELEMENT_NODE),
          (this.ownerDocument = o),
          (this.localName = r),
          (this.namespaceURI = p),
          (this.prefix = D),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function _(o, r) {
        if (o.nodeType === c.TEXT_NODE) r.push(o._data);
        else
          for (var p = 0, D = o.childNodes.length; p < D; p++)
            _(o.childNodes[p], r);
      }
      (w.prototype = Object.create(x.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === a.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var r;
              if (
                (this.prefix === null
                  ? (r = this.localName)
                  : (r = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var p = B[r];
                p || (B[r] = p = u.toASCIIUpperCase(r)), (r = p);
              }
              this._tagName = r;
            }
            return this._tagName;
          },
        },
        nodeName: {
          get: function () {
            return this.tagName;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: {
          get: function () {
            var o = [];
            return _(this, o), o.join("");
          },
          set: function (o) {
            this.removeChildren(),
              o != null &&
                o !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(o));
          },
        },
        innerText: {
          get: function () {
            var o = [];
            return (
              _(this, o),
              o
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (o) {
            this.removeChildren(),
              o != null &&
                o !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(o));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: u.nyi,
        },
        outerHTML: {
          get: function () {
            return h.serializeOne(this, { nodeType: 0 });
          },
          set: function (o) {
            var r = this.ownerDocument,
              p = this.parentNode;
            if (p !== null) {
              p.nodeType === c.DOCUMENT_NODE && u.NoModificationAllowedError(),
                p.nodeType === c.DOCUMENT_FRAGMENT_NODE &&
                  (p = p.ownerDocument.createElement("body"));
              var D = r.implementation.mozHTMLParser(r._address, p);
              D.parse(o === null ? "" : String(o), !0),
                this.replaceWith(D._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (r, p) {
            var D = !1;
            switch (r) {
              case "beforebegin":
                D = !0;
              case "afterend":
                var O = this.parentNode;
                return O === null
                  ? null
                  : O.insertBefore(p, D ? this : this.nextSibling);
              case "afterbegin":
                D = !0;
              case "beforeend":
                return this.insertBefore(p, D ? this.firstChild : null);
              default:
                return u.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (r, p) {
            if (p.nodeType !== c.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (r = u.toASCIILowerCase(String(r))), this._insertAdjacent(r, p)
            );
          },
        },
        insertAdjacentText: {
          value: function (r, p) {
            var D = this.ownerDocument.createTextNode(p);
            (r = u.toASCIILowerCase(String(r))), this._insertAdjacent(r, D);
          },
        },
        insertAdjacentHTML: {
          value: function (r, p) {
            (r = u.toASCIILowerCase(String(r))), (p = String(p));
            var D;
            switch (r) {
              case "beforebegin":
              case "afterend":
                (D = this.parentNode),
                  (D === null || D.nodeType === c.DOCUMENT_NODE) &&
                    u.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                D = this;
                break;
              default:
                u.SyntaxError();
            }
            (!(D instanceof w) ||
              (D.ownerDocument.isHTML &&
                D.localName === "html" &&
                D.namespaceURI === a.HTML)) &&
              (D = D.ownerDocument.createElementNS(a.HTML, "body"));
            var O = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              D,
            );
            O.parse(p, !0), this._insertAdjacent(r, O._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new J(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new m(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var o = this.firstChild; o !== null; o = o.nextSibling)
              if (o.nodeType === c.ELEMENT_NODE) return o;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var o = this.lastChild; o !== null; o = o.previousSibling)
              if (o.nodeType === c.ELEMENT_NODE) return o;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (o) {
            o || (o = this.ownerDocument.documentElement);
            var r = this.firstElementChild;
            if (!r) {
              if (this === o) return null;
              r = this.nextElementSibling;
            }
            if (r) return r;
            for (var p = this.parentElement; p && p !== o; p = p.parentElement)
              if (((r = p.nextElementSibling), r)) return r;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (r) {
            var p;
            return r
              ? (r === "*"
                  ? (p = function () {
                      return !0;
                    })
                  : this.isHTML
                    ? (p = F(r))
                    : (p = Y(r)),
                new s(this, p))
              : new l();
          },
        },
        getElementsByTagNameNS: {
          value: function (r, p) {
            var D;
            return (
              r === "*" && p === "*"
                ? (D = function () {
                    return !0;
                  })
                : r === "*"
                  ? (D = Y(p))
                  : p === "*"
                    ? (D = L(r))
                    : (D = P(r, p)),
              new s(this, D)
            );
          },
        },
        getElementsByClassName: {
          value: function (r) {
            if (((r = String(r).trim()), r === "")) {
              var p = new l();
              return p;
            }
            return (r = r.split(/[ \t\r\n\f]+/)), new s(this, $(r));
          },
        },
        getElementsByName: {
          value: function (r) {
            return new s(this, f(String(r)));
          },
        },
        clone: {
          value: function () {
            var r;
            this.namespaceURI !== a.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (r = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName,
                ))
              : (r = this.ownerDocument.createElement(this.localName));
            for (var p = 0, D = this._attrKeys.length; p < D; p++) {
              var O = this._attrKeys[p],
                z = this._attrsByLName[O],
                ne = z.cloneNode();
              ne._setOwnerElement(r),
                (r._attrsByLName[O] = ne),
                r._addQName(ne);
            }
            return (r._attrKeys = this._attrKeys.concat()), r;
          },
        },
        isEqual: {
          value: function (r) {
            if (
              this.localName !== r.localName ||
              this.namespaceURI !== r.namespaceURI ||
              this.prefix !== r.prefix ||
              this._numattrs !== r._numattrs
            )
              return !1;
            for (var p = 0, D = this._numattrs; p < D; p++) {
              var O = this._attr(p);
              if (
                !r.hasAttributeNS(O.namespaceURI, O.localName) ||
                r.getAttributeNS(O.namespaceURI, O.localName) !== O.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (r, p) {
            if (
              this.namespaceURI &&
              this.namespaceURI === r &&
              this.prefix !== null &&
              p.lookupNamespaceURI(this.prefix) === r
            )
              return this.prefix;
            for (var D = 0, O = this._numattrs; D < O; D++) {
              var z = this._attr(D);
              if (
                z.prefix === "xmlns" &&
                z.value === r &&
                p.lookupNamespaceURI(z.localName) === r
              )
                return z.localName;
            }
            var ne = this.parentElement;
            return ne ? ne._lookupNamespacePrefix(r, p) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (r) {
            if (
              ((r === "" || r === void 0) && (r = null),
              this.namespaceURI !== null && this.prefix === r)
            )
              return this.namespaceURI;
            for (var p = 0, D = this._numattrs; p < D; p++) {
              var O = this._attr(p);
              if (
                O.namespaceURI === a.XMLNS &&
                ((O.prefix === "xmlns" && O.localName === r) ||
                  (r === null && O.prefix === null && O.localName === "xmlns"))
              )
                return O.value || null;
            }
            var z = this.parentElement;
            return z ? z.lookupNamespaceURI(r) : null;
          },
        },
        getAttribute: {
          value: function (r) {
            var p = this.getAttributeNode(r);
            return p ? p.value : null;
          },
        },
        getAttributeNS: {
          value: function (r, p) {
            var D = this.getAttributeNodeNS(r, p);
            return D ? D.value : null;
          },
        },
        getAttributeNode: {
          value: function (r) {
            (r = String(r)),
              /[A-Z]/.test(r) && this.isHTML && (r = u.toASCIILowerCase(r));
            var p = this._attrsByQName[r];
            return p ? (Array.isArray(p) && (p = p[0]), p) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (r, p) {
            (r = r == null ? "" : String(r)), (p = String(p));
            var D = this._attrsByLName[r + "|" + p];
            return D || null;
          },
        },
        hasAttribute: {
          value: function (r) {
            return (
              (r = String(r)),
              /[A-Z]/.test(r) && this.isHTML && (r = u.toASCIILowerCase(r)),
              this._attrsByQName[r] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (r, p) {
            (r = r == null ? "" : String(r)), (p = String(p));
            var D = r + "|" + p;
            return this._attrsByLName[D] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (r, p) {
            (r = String(r)),
              d.isValidName(r) || u.InvalidCharacterError(),
              /[A-Z]/.test(r) && this.isHTML && (r = u.toASCIILowerCase(r));
            var D = this._attrsByQName[r];
            return D === void 0
              ? p === void 0 || p === !0
                ? (this._setAttribute(r, ""), !0)
                : !1
              : p === void 0 || p === !1
                ? (this.removeAttribute(r), !1)
                : !0;
          },
        },
        _setAttribute: {
          value: function (r, p) {
            var D = this._attrsByQName[r],
              O;
            D
              ? Array.isArray(D) && (D = D[0])
              : ((D = this._newattr(r)), (O = !0)),
              (D.value = p),
              this._attributes && (this._attributes[r] = D),
              O && this._newattrhook && this._newattrhook(r, p);
          },
        },
        setAttribute: {
          value: function (r, p) {
            (r = String(r)),
              d.isValidName(r) || u.InvalidCharacterError(),
              /[A-Z]/.test(r) && this.isHTML && (r = u.toASCIILowerCase(r)),
              this._setAttribute(r, String(p));
          },
        },
        _setAttributeNS: {
          value: function (r, p, D) {
            var O = p.indexOf(":"),
              z,
              ne;
            O < 0
              ? ((z = null), (ne = p))
              : ((z = p.substring(0, O)), (ne = p.substring(O + 1))),
              (r === "" || r === void 0) && (r = null);
            var ee = (r === null ? "" : r) + "|" + ne,
              i = this._attrsByLName[ee],
              g;
            i ||
              ((i = new S(this, ne, z, r)),
              (g = !0),
              (this._attrsByLName[ee] = i),
              this._attributes && (this._attributes[this._attrKeys.length] = i),
              this._attrKeys.push(ee),
              this._addQName(i)),
              (i.value = D),
              g && this._newattrhook && this._newattrhook(p, D);
          },
        },
        setAttributeNS: {
          value: function (r, p, D) {
            (r = r == null || r === "" ? null : String(r)),
              (p = String(p)),
              d.isValidQName(p) || u.InvalidCharacterError();
            var O = p.indexOf(":"),
              z = O < 0 ? null : p.substring(0, O);
            ((z !== null && r === null) ||
              (z === "xml" && r !== a.XML) ||
              ((p === "xmlns" || z === "xmlns") && r !== a.XMLNS) ||
              (r === a.XMLNS && !(p === "xmlns" || z === "xmlns"))) &&
              u.NamespaceError(),
              this._setAttributeNS(r, p, String(D));
          },
        },
        setAttributeNode: {
          value: function (r) {
            if (r.ownerElement !== null && r.ownerElement !== this)
              throw new E(E.INUSE_ATTRIBUTE_ERR);
            var p = null,
              D = this._attrsByQName[r.name];
            if (D) {
              if (
                (Array.isArray(D) || (D = [D]),
                D.some(function (O) {
                  return O === r;
                }))
              )
                return r;
              if (r.ownerElement !== null) throw new E(E.INUSE_ATTRIBUTE_ERR);
              D.forEach(function (O) {
                this.removeAttributeNode(O);
              }, this),
                (p = D[0]);
            }
            return this.setAttributeNodeNS(r), p;
          },
        },
        setAttributeNodeNS: {
          value: function (r) {
            if (r.ownerElement !== null) throw new E(E.INUSE_ATTRIBUTE_ERR);
            var p = r.namespaceURI,
              D = (p === null ? "" : p) + "|" + r.localName,
              O = this._attrsByLName[D];
            return (
              O && this.removeAttributeNode(O),
              r._setOwnerElement(this),
              (this._attrsByLName[D] = r),
              this._attributes && (this._attributes[this._attrKeys.length] = r),
              this._attrKeys.push(D),
              this._addQName(r),
              this._newattrhook && this._newattrhook(r.name, r.value),
              O || null
            );
          },
        },
        removeAttribute: {
          value: function (r) {
            (r = String(r)),
              /[A-Z]/.test(r) && this.isHTML && (r = u.toASCIILowerCase(r));
            var p = this._attrsByQName[r];
            if (p) {
              Array.isArray(p)
                ? p.length > 2
                  ? (p = p.shift())
                  : ((this._attrsByQName[r] = p[1]), (p = p[0]))
                : (this._attrsByQName[r] = void 0);
              var D = p.namespaceURI,
                O = (D === null ? "" : D) + "|" + p.localName;
              this._attrsByLName[O] = void 0;
              var z = this._attrKeys.indexOf(O);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, z, 1),
                (this._attributes[r] = void 0)),
                this._attrKeys.splice(z, 1);
              var ne = p.onchange;
              p._setOwnerElement(null),
                ne && ne.call(p, this, p.localName, p.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(p);
            }
          },
        },
        removeAttributeNS: {
          value: function (r, p) {
            (r = r == null ? "" : String(r)), (p = String(p));
            var D = r + "|" + p,
              O = this._attrsByLName[D];
            if (O) {
              this._attrsByLName[D] = void 0;
              var z = this._attrKeys.indexOf(D);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, z, 1),
                this._attrKeys.splice(z, 1),
                this._removeQName(O);
              var ne = O.onchange;
              O._setOwnerElement(null),
                ne && ne.call(O, this, O.localName, O.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(O);
            }
          },
        },
        removeAttributeNode: {
          value: function (r) {
            var p = r.namespaceURI,
              D = (p === null ? "" : p) + "|" + r.localName;
            return (
              this._attrsByLName[D] !== r && u.NotFoundError(),
              this.removeAttributeNS(p, r.localName),
              r
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var r = this;
            return this._attrKeys.map(function (p) {
              return r._attrsByLName[p].name;
            });
          },
        },
        _getattr: {
          value: function (r) {
            var p = this._attrsByQName[r];
            return p ? p.value : null;
          },
        },
        _setattr: {
          value: function (r, p) {
            var D = this._attrsByQName[r],
              O;
            D || ((D = this._newattr(r)), (O = !0)),
              (D.value = String(p)),
              this._attributes && (this._attributes[r] = D),
              O && this._newattrhook && this._newattrhook(r, p);
          },
        },
        _newattr: {
          value: function (r) {
            var p = new S(this, r, null, null),
              D = "|" + r;
            return (
              (this._attrsByQName[r] = p),
              (this._attrsByLName[D] = p),
              this._attributes && (this._attributes[this._attrKeys.length] = p),
              this._attrKeys.push(D),
              p
            );
          },
        },
        _addQName: {
          value: function (o) {
            var r = o.name,
              p = this._attrsByQName[r];
            p
              ? Array.isArray(p)
                ? p.push(o)
                : (this._attrsByQName[r] = [p, o])
              : (this._attrsByQName[r] = o),
              this._attributes && (this._attributes[r] = o);
          },
        },
        _removeQName: {
          value: function (o) {
            var r = o.name,
              p = this._attrsByQName[r];
            if (Array.isArray(p)) {
              var D = p.indexOf(o);
              u.assert(D !== -1),
                p.length === 2
                  ? ((this._attrsByQName[r] = p[1 - D]),
                    this._attributes &&
                      (this._attributes[r] = this._attrsByQName[r]))
                  : (p.splice(D, 1),
                    this._attributes &&
                      this._attributes[r] === o &&
                      (this._attributes[r] = p[0]));
            } else
              u.assert(p === o),
                (this._attrsByQName[r] = void 0),
                this._attributes && (this._attributes[r] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (o) {
            return this._attrsByLName[this._attrKeys[o]];
          },
        },
        id: n.property({ name: "id" }),
        className: n.property({ name: "class" }),
        classList: {
          get: function () {
            var o = this;
            if (this._classList) return this._classList;
            var r = new b(
              function () {
                return o.className || "";
              },
              function (p) {
                o.className = p;
              },
            );
            return (this._classList = r), r;
          },
          set: function (o) {
            this.className = o;
          },
        },
        matches: {
          value: function (o) {
            return y.matches(this, o);
          },
        },
        closest: {
          value: function (o) {
            var r = this;
            do {
              if (r.matches && r.matches(o)) return r;
              r = r.parentElement || r.parentNode;
            } while (r !== null && r.nodeType === c.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (o) {
            return y(o, this)[0];
          },
        },
        querySelectorAll: {
          value: function (o) {
            var r = y(o, this);
            return r.item ? r : new l(r);
          },
        },
      })),
        Object.defineProperties(w.prototype, R),
        Object.defineProperties(w.prototype, I),
        n.registerChangeHandler(w, "id", function (o, r, p, D) {
          o.rooted &&
            (p && o.ownerDocument.delId(p, o),
            D && o.ownerDocument.addId(D, o));
        }),
        n.registerChangeHandler(w, "class", function (o, r, p, D) {
          o._classList && o._classList._update();
        });
      function S(o, r, p, D, O) {
        (this.localName = r),
          (this.prefix = p === null || p === "" ? null : "" + p),
          (this.namespaceURI = D === null || D === "" ? null : "" + D),
          (this.data = O),
          this._setOwnerElement(o);
      }
      (S.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (r) {
            (this._ownerElement = r),
              this.prefix === null && this.namespaceURI === null && r
                ? (this.onchange = r._attributeChangeHandlers[this.localName])
                : (this.onchange = null);
          },
        },
        name: {
          get: function () {
            return this.prefix
              ? this.prefix + ":" + this.localName
              : this.localName;
          },
        },
        specified: {
          get: function () {
            return !0;
          },
        },
        value: {
          get: function () {
            return this.data;
          },
          set: function (o) {
            var r = this.data;
            (o = o === void 0 ? "" : o + ""),
              o !== r &&
                ((this.data = o),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, r, o),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, r)));
          },
        },
        cloneNode: {
          value: function (r) {
            return new S(
              null,
              this.localName,
              this.prefix,
              this.namespaceURI,
              this.data,
            );
          },
        },
        nodeType: {
          get: function () {
            return c.ATTRIBUTE_NODE;
          },
        },
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return this.value;
          },
          set: function (o) {
            this.value = o;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (o) {
            o == null && (o = ""), (this.value = o);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (o) {
            o == null && (o = ""), (this.value = o);
          },
        },
      })),
        (w._Attr = S);
      function m(o) {
        re.call(this, o);
        for (var r in o._attrsByQName) this[r] = o._attrsByQName[r];
        for (var p = 0; p < o._attrKeys.length; p++)
          this[p] = o._attrsByLName[o._attrKeys[p]];
      }
      m.prototype = Object.create(re.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (o) {
            return (
              (o = o >>> 0),
              o >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[o]]
            );
          },
        },
      });
      var ie;
      (ie = globalThis.Symbol) != null &&
        ie.iterator &&
        (m.prototype[globalThis.Symbol.iterator] = function () {
          var o = 0,
            r = this.length,
            p = this;
          return {
            next: function () {
              return o < r ? { value: p.item(o++) } : { done: !0 };
            },
          };
        });
      function J(o) {
        (this.element = o), this.updateCache();
      }
      J.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (r) {
            return this.updateCache(), this.childrenByNumber[r] || null;
          },
        },
        namedItem: {
          value: function (r) {
            return this.updateCache(), this.childrenByName[r] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var r =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var p =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  D = 0;
                D < p;
                D++
              )
                this[D] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var O = this.element.firstChild;
                O !== null;
                O = O.nextSibling
              )
                if (O.nodeType === c.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = O),
                    this.childrenByNumber.push(O);
                  var z = O.getAttribute("id");
                  z && !this.childrenByName[z] && (this.childrenByName[z] = O);
                  var ne = O.getAttribute("name");
                  ne &&
                    this.element.namespaceURI === a.HTML &&
                    r.test(this.element.localName) &&
                    !this.childrenByName[ne] &&
                    (this.childrenByName[z] = O);
                }
            }
          },
        },
      });
      function Y(o) {
        return function (r) {
          return r.localName === o;
        };
      }
      function F(o) {
        var r = u.toASCIILowerCase(o);
        return r === o
          ? Y(o)
          : function (p) {
              return p.isHTML ? p.localName === r : p.localName === o;
            };
      }
      function L(o) {
        return function (r) {
          return r.namespaceURI === o;
        };
      }
      function P(o, r) {
        return function (p) {
          return p.namespaceURI === o && p.localName === r;
        };
      }
      function $(o) {
        return function (r) {
          return o.every(function (p) {
            return r.classList.contains(p);
          });
        };
      }
      function f(o) {
        return function (r) {
          return r.namespaceURI !== a.HTML ? !1 : r.getAttribute("name") === o;
        };
      }
    },
  }),
  va = ue({
    "external/npm/node_modules/domino/lib/Leaf.js"(v, N) {
      "use strict";
      N.exports = l;
      var d = Ge(),
        u = rr(),
        a = Be(),
        n = a.HierarchyRequestError,
        c = a.NotFoundError;
      function l() {
        d.call(this);
      }
      l.prototype = Object.create(d.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (h, s) {
            if (!h.nodeType) throw new TypeError("not a node");
            n();
          },
        },
        replaceChild: {
          value: function (h, s) {
            if (!h.nodeType) throw new TypeError("not a node");
            n();
          },
        },
        removeChild: {
          value: function (h) {
            if (!h.nodeType) throw new TypeError("not a node");
            c();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new u()), this._childNodes
            );
          },
        },
      });
    },
  }),
  Qr = ue({
    "external/npm/node_modules/domino/lib/CharacterData.js"(v, N) {
      "use strict";
      N.exports = c;
      var d = va(),
        u = Be(),
        a = Sn(),
        n = ba();
      function c() {
        d.call(this);
      }
      (c.prototype = Object.create(d.prototype, {
        substringData: {
          value: function (h, s) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (h = h >>> 0),
              (s = s >>> 0),
              (h > this.data.length || h < 0 || s < 0) && u.IndexSizeError(),
              this.data.substring(h, h + s)
            );
          },
        },
        appendData: {
          value: function (h) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(h);
          },
        },
        insertData: {
          value: function (h, s) {
            return this.replaceData(h, 0, s);
          },
        },
        deleteData: {
          value: function (h, s) {
            return this.replaceData(h, s, "");
          },
        },
        replaceData: {
          value: function (h, s, E) {
            var b = this.data,
              y = b.length;
            (h = h >>> 0),
              (s = s >>> 0),
              (E = String(E)),
              (h > y || h < 0) && u.IndexSizeError(),
              h + s > y && (s = y - h);
            var x = b.substring(0, h),
              R = b.substring(h + s);
            this.data = x + E + R;
          },
        },
        isEqual: {
          value: function (h) {
            return this._data === h._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(c.prototype, a),
        Object.defineProperties(c.prototype, n);
    },
  }),
  Ta = ue({
    "external/npm/node_modules/domino/lib/Text.js"(v, N) {
      "use strict";
      N.exports = n;
      var d = Be(),
        u = Ge(),
        a = Qr();
      function n(l, h) {
        a.call(this),
          (this.nodeType = u.TEXT_NODE),
          (this.ownerDocument = l),
          (this._data = h),
          (this._index = void 0);
      }
      var c = {
        get: function () {
          return this._data;
        },
        set: function (l) {
          l == null ? (l = "") : (l = String(l)),
            l !== this._data &&
              ((this._data = l),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      n.prototype = Object.create(a.prototype, {
        nodeName: { value: "#text" },
        nodeValue: c,
        textContent: c,
        innerText: c,
        data: {
          get: c.get,
          set: function (l) {
            c.set.call(this, l === null ? "" : String(l));
          },
        },
        splitText: {
          value: function (h) {
            (h > this._data.length || h < 0) && d.IndexSizeError();
            var s = this._data.substring(h),
              E = this.ownerDocument.createTextNode(s);
            this.data = this.data.substring(0, h);
            var b = this.parentNode;
            return b !== null && b.insertBefore(E, this.nextSibling), E;
          },
        },
        wholeText: {
          get: function () {
            for (
              var h = this.textContent, s = this.nextSibling;
              s && s.nodeType === u.TEXT_NODE;
              s = s.nextSibling
            )
              h += s.textContent;
            return h;
          },
        },
        replaceWholeText: { value: d.nyi },
        clone: {
          value: function () {
            return new n(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  ya = ue({
    "external/npm/node_modules/domino/lib/Comment.js"(v, N) {
      "use strict";
      N.exports = a;
      var d = Ge(),
        u = Qr();
      function a(c, l) {
        u.call(this),
          (this.nodeType = d.COMMENT_NODE),
          (this.ownerDocument = c),
          (this._data = l);
      }
      var n = {
        get: function () {
          return this._data;
        },
        set: function (c) {
          c == null ? (c = "") : (c = String(c)),
            (this._data = c),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      a.prototype = Object.create(u.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: n,
        textContent: n,
        innerText: n,
        data: {
          get: n.get,
          set: function (c) {
            n.set.call(this, c === null ? "" : String(c));
          },
        },
        clone: {
          value: function () {
            return new a(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  wa = ue({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(v, N) {
      "use strict";
      N.exports = h;
      var d = Ge(),
        u = rr(),
        a = yn(),
        n = Er(),
        c = Nn(),
        l = Be();
      function h(s) {
        a.call(this),
          (this.nodeType = d.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = s);
      }
      h.prototype = Object.create(a.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          n.prototype,
          "textContent",
        ),
        innerText: Object.getOwnPropertyDescriptor(n.prototype, "innerText"),
        querySelector: {
          value: function (s) {
            var E = this.querySelectorAll(s);
            return E.length ? E[0] : null;
          },
        },
        querySelectorAll: {
          value: function (s) {
            var E = Object.create(this);
            (E.isHTML = !0),
              (E.getElementsByTagName = n.prototype.getElementsByTagName),
              (E.nextElement = Object.getOwnPropertyDescriptor(
                n.prototype,
                "firstElementChild",
              ).get);
            var b = c(s, E);
            return b.item ? b : new u(b);
          },
        },
        clone: {
          value: function () {
            return new h(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (E) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: l.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: l.nyi,
        },
      });
    },
  }),
  Na = ue({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(v, N) {
      "use strict";
      N.exports = a;
      var d = Ge(),
        u = Qr();
      function a(c, l, h) {
        u.call(this),
          (this.nodeType = d.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = c),
          (this.target = l),
          (this._data = h);
      }
      var n = {
        get: function () {
          return this._data;
        },
        set: function (c) {
          c == null ? (c = "") : (c = String(c)),
            (this._data = c),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      a.prototype = Object.create(u.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: n,
        textContent: n,
        innerText: n,
        data: {
          get: n.get,
          set: function (c) {
            n.set.call(this, c === null ? "" : String(c));
          },
        },
        clone: {
          value: function () {
            return new a(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (l) {
            return this.target === l.target && this._data === l._data;
          },
        },
      });
    },
  }),
  $r = ue({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(v, N) {
      "use strict";
      var d = {
        FILTER_ACCEPT: 1,
        FILTER_REJECT: 2,
        FILTER_SKIP: 3,
        SHOW_ALL: 4294967295,
        SHOW_ELEMENT: 1,
        SHOW_ATTRIBUTE: 2,
        SHOW_TEXT: 4,
        SHOW_CDATA_SECTION: 8,
        SHOW_ENTITY_REFERENCE: 16,
        SHOW_ENTITY: 32,
        SHOW_PROCESSING_INSTRUCTION: 64,
        SHOW_COMMENT: 128,
        SHOW_DOCUMENT: 256,
        SHOW_DOCUMENT_TYPE: 512,
        SHOW_DOCUMENT_FRAGMENT: 1024,
        SHOW_NOTATION: 2048,
      };
      N.exports = d.constructor = d.prototype = d;
    },
  }),
  Sa = ue({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(v, N) {
      "use strict";
      var d = (N.exports = {
        nextSkippingChildren: u,
        nextAncestorSibling: a,
        next: n,
        previous: l,
        deepLastChild: c,
      });
      function u(h, s) {
        return h === s
          ? null
          : h.nextSibling !== null
            ? h.nextSibling
            : a(h, s);
      }
      function a(h, s) {
        for (h = h.parentNode; h !== null; h = h.parentNode) {
          if (h === s) return null;
          if (h.nextSibling !== null) return h.nextSibling;
        }
        return null;
      }
      function n(h, s) {
        var E;
        return (
          (E = h.firstChild),
          E !== null
            ? E
            : h === s
              ? null
              : ((E = h.nextSibling), E !== null ? E : a(h, s))
        );
      }
      function c(h) {
        for (; h.lastChild; ) h = h.lastChild;
        return h;
      }
      function l(h, s) {
        var E;
        return (
          (E = h.previousSibling),
          E !== null ? c(E) : ((E = h.parentNode), E === s ? null : E)
        );
      }
    },
  }),
  es = ue({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(v, N) {
      "use strict";
      N.exports = E;
      var d = Ge(),
        u = $r(),
        a = Sa(),
        n = Be(),
        c = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        l = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function h(b, y) {
        var x, R, I, re, B;
        for (R = b._currentNode[c[y]]; R !== null; ) {
          if (((re = b._internalFilter(R)), re === u.FILTER_ACCEPT))
            return (b._currentNode = R), R;
          if (re === u.FILTER_SKIP && ((x = R[c[y]]), x !== null)) {
            R = x;
            continue;
          }
          for (; R !== null; ) {
            if (((B = R[l[y]]), B !== null)) {
              R = B;
              break;
            }
            if (
              ((I = R.parentNode),
              I === null || I === b.root || I === b._currentNode)
            )
              return null;
            R = I;
          }
        }
        return null;
      }
      function s(b, y) {
        var x, R, I;
        if (((x = b._currentNode), x === b.root)) return null;
        for (;;) {
          for (I = x[l[y]]; I !== null; ) {
            if (((x = I), (R = b._internalFilter(x)), R === u.FILTER_ACCEPT))
              return (b._currentNode = x), x;
            (I = x[c[y]]),
              (R === u.FILTER_REJECT || I === null) && (I = x[l[y]]);
          }
          if (
            ((x = x.parentNode),
            x === null ||
              x === b.root ||
              b._internalFilter(x) === u.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function E(b, y, x) {
        (!b || !b.nodeType) && n.NotSupportedError(),
          (this._root = b),
          (this._whatToShow = Number(y) || 0),
          (this._filter = x || null),
          (this._active = !1),
          (this._currentNode = b);
      }
      Object.defineProperties(E.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        currentNode: {
          get: function () {
            return this._currentNode;
          },
          set: function (y) {
            if (!(y instanceof d)) throw new TypeError("Not a Node");
            this._currentNode = y;
          },
        },
        _internalFilter: {
          value: function (y) {
            var x, R;
            if (
              (this._active && n.InvalidStateError(),
              !((1 << (y.nodeType - 1)) & this._whatToShow))
            )
              return u.FILTER_SKIP;
            if (((R = this._filter), R === null)) x = u.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof R == "function" ? (x = R(y)) : (x = R.acceptNode(y));
              } finally {
                this._active = !1;
              }
            }
            return +x;
          },
        },
        parentNode: {
          value: function () {
            for (var y = this._currentNode; y !== this.root; ) {
              if (((y = y.parentNode), y === null)) return null;
              if (this._internalFilter(y) === u.FILTER_ACCEPT)
                return (this._currentNode = y), y;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return h(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return h(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return s(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return s(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var y, x, R, I;
            for (y = this._currentNode; y !== this._root; ) {
              for (R = y.previousSibling; R; R = y.previousSibling)
                if (
                  ((y = R),
                  (x = this._internalFilter(y)),
                  x !== u.FILTER_REJECT)
                ) {
                  for (
                    I = y.lastChild;
                    I &&
                    ((y = I),
                    (x = this._internalFilter(y)),
                    x !== u.FILTER_REJECT);
                    I = y.lastChild
                  );
                  if (x === u.FILTER_ACCEPT) return (this._currentNode = y), y;
                }
              if (y === this.root || y.parentNode === null) return null;
              if (
                ((y = y.parentNode),
                this._internalFilter(y) === u.FILTER_ACCEPT)
              )
                return (this._currentNode = y), y;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var y, x, R, I;
            (y = this._currentNode), (x = u.FILTER_ACCEPT);
            e: for (;;) {
              for (R = y.firstChild; R; R = y.firstChild) {
                if (
                  ((y = R),
                  (x = this._internalFilter(y)),
                  x === u.FILTER_ACCEPT)
                )
                  return (this._currentNode = y), y;
                if (x === u.FILTER_REJECT) break;
              }
              for (
                I = a.nextSkippingChildren(y, this.root);
                I;
                I = a.nextSkippingChildren(y, this.root)
              ) {
                if (
                  ((y = I),
                  (x = this._internalFilter(y)),
                  x === u.FILTER_ACCEPT)
                )
                  return (this._currentNode = y), y;
                if (x === u.FILTER_SKIP) continue e;
              }
              return null;
            }
          },
        },
        toString: {
          value: function () {
            return "[object TreeWalker]";
          },
        },
      });
    },
  }),
  ts = ue({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(v, N) {
      "use strict";
      N.exports = h;
      var d = $r(),
        u = Sa(),
        a = Be();
      function n(s, E, b) {
        return b ? u.next(s, E) : s === E ? null : u.previous(s, null);
      }
      function c(s, E) {
        for (; E; E = E.parentNode) if (s === E) return !0;
        return !1;
      }
      function l(s, E) {
        var b, y;
        for (b = s._referenceNode, y = s._pointerBeforeReferenceNode; ; ) {
          if (y === E) y = !y;
          else if (((b = n(b, s._root, E)), b === null)) return null;
          var x = s._internalFilter(b);
          if (x === d.FILTER_ACCEPT) break;
        }
        return (s._referenceNode = b), (s._pointerBeforeReferenceNode = y), b;
      }
      function h(s, E, b) {
        (!s || !s.nodeType) && a.NotSupportedError(),
          (this._root = s),
          (this._referenceNode = s),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(E) || 0),
          (this._filter = b || null),
          (this._active = !1),
          s.doc._attachNodeIterator(this);
      }
      Object.defineProperties(h.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        referenceNode: {
          get: function () {
            return this._referenceNode;
          },
        },
        pointerBeforeReferenceNode: {
          get: function () {
            return this._pointerBeforeReferenceNode;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        _internalFilter: {
          value: function (E) {
            var b, y;
            if (
              (this._active && a.InvalidStateError(),
              !((1 << (E.nodeType - 1)) & this._whatToShow))
            )
              return d.FILTER_SKIP;
            if (((y = this._filter), y === null)) b = d.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof y == "function" ? (b = y(E)) : (b = y.acceptNode(E));
              } finally {
                this._active = !1;
              }
            }
            return +b;
          },
        },
        _preremove: {
          value: function (E) {
            if (!c(E, this._root) && c(E, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var b = E; b.lastChild; ) b = b.lastChild;
                if (((b = u.next(b, this.root)), b)) {
                  this._referenceNode = b;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (E.previousSibling === null)
                this._referenceNode = E.parentNode;
              else {
                this._referenceNode = E.previousSibling;
                var y;
                for (
                  y = this._referenceNode.lastChild;
                  y;
                  y = this._referenceNode.lastChild
                )
                  this._referenceNode = y;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return l(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return l(this, !1);
          },
        },
        detach: { value: function () {} },
        toString: {
          value: function () {
            return "[object NodeIterator]";
          },
        },
      });
    },
  }),
  kn = ue({
    "external/npm/node_modules/domino/lib/URL.js"(v, N) {
      "use strict";
      N.exports = d;
      function d(u) {
        if (!u) return Object.create(d.prototype);
        this.url = u.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var a = d.pattern.exec(this.url);
        if (a) {
          if ((a[2] && (this.scheme = a[2]), a[4])) {
            var n = a[4].match(d.userinfoPattern);
            if (
              (n &&
                ((this.username = n[1]),
                (this.password = n[3]),
                (a[4] = a[4].substring(n[0].length))),
              a[4].match(d.portPattern))
            ) {
              var c = a[4].lastIndexOf(":");
              (this.host = a[4].substring(0, c)),
                (this.port = a[4].substring(c + 1));
            } else this.host = a[4];
          }
          a[5] && (this.path = a[5]),
            a[6] && (this.query = a[7]),
            a[8] && (this.fragment = a[9]);
        }
      }
      (d.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (d.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (d.portPattern = /:\d+$/),
        (d.authorityPattern = /^[^:\/?#]+:\/\//),
        (d.hierarchyPattern = /^[^:\/?#]+:\//),
        (d.percentEncode = function (a) {
          var n = a.charCodeAt(0);
          if (n < 256) return "%" + n.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (d.prototype = {
          constructor: d,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return d.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return d.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var u = "";
            return (
              this.scheme !== void 0 && (u += this.scheme + ":"),
              this.isAbsolute() &&
                ((u += "//"),
                (this.username || this.password) &&
                  ((u += this.username || ""),
                  this.password && (u += ":" + this.password),
                  (u += "@")),
                this.host && (u += this.host)),
              this.port !== void 0 && (u += ":" + this.port),
              this.path !== void 0 && (u += this.path),
              this.query !== void 0 && (u += "?" + this.query),
              this.fragment !== void 0 && (u += "#" + this.fragment),
              u
            );
          },
          resolve: function (u) {
            var a = this,
              n = new d(u),
              c = new d();
            return (
              n.scheme !== void 0
                ? ((c.scheme = n.scheme),
                  (c.username = n.username),
                  (c.password = n.password),
                  (c.host = n.host),
                  (c.port = n.port),
                  (c.path = h(n.path)),
                  (c.query = n.query))
                : ((c.scheme = a.scheme),
                  n.host !== void 0
                    ? ((c.username = n.username),
                      (c.password = n.password),
                      (c.host = n.host),
                      (c.port = n.port),
                      (c.path = h(n.path)),
                      (c.query = n.query))
                    : ((c.username = a.username),
                      (c.password = a.password),
                      (c.host = a.host),
                      (c.port = a.port),
                      n.path
                        ? (n.path.charAt(0) === "/"
                            ? (c.path = h(n.path))
                            : ((c.path = l(a.path, n.path)),
                              (c.path = h(c.path))),
                          (c.query = n.query))
                        : ((c.path = a.path),
                          n.query !== void 0
                            ? (c.query = n.query)
                            : (c.query = a.query)))),
              (c.fragment = n.fragment),
              c.toString()
            );
            function l(s, E) {
              if (a.host !== void 0 && !a.path) return "/" + E;
              var b = s.lastIndexOf("/");
              return b === -1 ? E : s.substring(0, b + 1) + E;
            }
            function h(s) {
              if (!s) return s;
              for (var E = ""; s.length > 0; ) {
                if (s === "." || s === "..") {
                  s = "";
                  break;
                }
                var b = s.substring(0, 2),
                  y = s.substring(0, 3),
                  x = s.substring(0, 4);
                if (y === "../") s = s.substring(3);
                else if (b === "./") s = s.substring(2);
                else if (y === "/./") s = "/" + s.substring(3);
                else if (b === "/." && s.length === 2) s = "/";
                else if (x === "/../" || (y === "/.." && s.length === 3))
                  (s = "/" + s.substring(4)), (E = E.replace(/\/?[^\/]*$/, ""));
                else {
                  var R = s.match(/(\/?([^\/]*))/)[0];
                  (E += R), (s = s.substring(R.length));
                }
              }
              return E;
            }
          },
        });
    },
  }),
  rs = ue({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(v, N) {
      "use strict";
      N.exports = u;
      var d = br();
      function u(a, n) {
        d.call(this, a, n);
      }
      u.prototype = Object.create(d.prototype, { constructor: { value: u } });
    },
  }),
  ka = ue({
    "external/npm/node_modules/domino/lib/events.js"(v, N) {
      "use strict";
      N.exports = {
        Event: br(),
        UIEvent: fa(),
        MouseEvent: ha(),
        CustomEvent: rs(),
      };
    },
  }),
  ns = ue({
    "external/npm/node_modules/domino/lib/style_parser.js"(v) {
      "use strict";
      Object.defineProperty(v, "__esModule", { value: !0 }),
        (v.hyphenate = v.parse = void 0);
      function N(u) {
        let a = [],
          n = 0,
          c = 0,
          l = 0,
          h = 0,
          s = 0,
          E = null;
        for (; n < u.length; )
          switch (u.charCodeAt(n++)) {
            case 40:
              c++;
              break;
            case 41:
              c--;
              break;
            case 39:
              l === 0
                ? (l = 39)
                : l === 39 && u.charCodeAt(n - 1) !== 92 && (l = 0);
              break;
            case 34:
              l === 0
                ? (l = 34)
                : l === 34 && u.charCodeAt(n - 1) !== 92 && (l = 0);
              break;
            case 58:
              !E &&
                c === 0 &&
                l === 0 &&
                ((E = d(u.substring(s, n - 1).trim())), (h = n));
              break;
            case 59:
              if (E && h > 0 && c === 0 && l === 0) {
                let y = u.substring(h, n - 1).trim();
                a.push(E, y), (s = n), (h = 0), (E = null);
              }
              break;
          }
        if (E && h) {
          let b = u.slice(h).trim();
          a.push(E, b);
        }
        return a;
      }
      v.parse = N;
      function d(u) {
        return u
          .replace(/[a-z][A-Z]/g, (a) => a.charAt(0) + "-" + a.charAt(1))
          .toLowerCase();
      }
      v.hyphenate = d;
    },
  }),
  Cn = ue({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(v, N) {
      "use strict";
      var { parse: d } = ns();
      N.exports = function (h) {
        let s = new a(h),
          E = {
            get: function (b, y) {
              return y in b ? b[y] : b.getPropertyValue(u(y));
            },
            has: function (b, y) {
              return !0;
            },
            set: function (b, y, x) {
              return y in b ? (b[y] = x) : b.setProperty(u(y), x ?? void 0), !0;
            },
          };
        return new Proxy(s, E);
      };
      function u(h) {
        return h.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function a(h) {
        this._element = h;
      }
      var n = "!important";
      function c(h) {
        let s = { property: {}, priority: {} };
        if (!h) return s;
        let E = d(h);
        if (E.length < 2) return s;
        for (let b = 0; b < E.length; b += 2) {
          let y = E[b],
            x = E[b + 1];
          x.endsWith(n) &&
            ((s.priority[y] = "important"), (x = x.slice(0, -n.length).trim())),
            (s.property[y] = x);
        }
        return s;
      }
      var l = {};
      a.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var h = this.cssText;
              (this._parsedStyles = c(h)),
                (this._lastParsedText = h),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var h = this._parsed,
              s = "";
            for (var E in h.property)
              s && (s += " "),
                (s += E + ": " + h.property[E]),
                h.priority[E] && (s += " !" + h.priority[E]),
                (s += ";");
            (this.cssText = s), (this._lastParsedText = s), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (h) {
            this._element.setAttribute("style", h);
          },
        },
        length: {
          get: function () {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names.length
            );
          },
        },
        item: {
          value: function (h) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names[h]
            );
          },
        },
        getPropertyValue: {
          value: function (h) {
            return (h = h.toLowerCase()), this._parsed.property[h] || "";
          },
        },
        getPropertyPriority: {
          value: function (h) {
            return (h = h.toLowerCase()), this._parsed.priority[h] || "";
          },
        },
        setProperty: {
          value: function (h, s, E) {
            if (
              ((h = h.toLowerCase()),
              s == null && (s = ""),
              E == null && (E = ""),
              s !== l && (s = "" + s),
              (s = s.trim()),
              s === "")
            ) {
              this.removeProperty(h);
              return;
            }
            if (!(E !== "" && E !== l && !/^important$/i.test(E))) {
              var b = this._parsed;
              if (s === l) {
                if (!b.property[h]) return;
                E !== "" ? (b.priority[h] = "important") : delete b.priority[h];
              } else {
                if (s.includes(";") && !s.includes("data:")) return;
                var y = c(h + ":" + s);
                if (
                  Object.getOwnPropertyNames(y.property).length === 0 ||
                  Object.getOwnPropertyNames(y.priority).length !== 0
                )
                  return;
                for (var x in y.property)
                  (b.property[x] = y.property[x]),
                    E !== l &&
                      (E !== ""
                        ? (b.priority[x] = "important")
                        : b.priority[x] && delete b.priority[x]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (h, s) {
            return this.setProperty(h, s, l);
          },
        },
        setPropertyPriority: {
          value: function (h, s) {
            return this.setProperty(h, l, s);
          },
        },
        removeProperty: {
          value: function (h) {
            h = h.toLowerCase();
            var s = this._parsed;
            h in s.property &&
              (delete s.property[h], delete s.priority[h], this._serialize());
          },
        },
      });
    },
  }),
  Ca = ue({
    "external/npm/node_modules/domino/lib/URLUtils.js"(v, N) {
      "use strict";
      var d = kn();
      N.exports = u;
      function u() {}
      (u.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new d(this.href);
          },
        },
        protocol: {
          get: function () {
            var a = this._url;
            return a && a.scheme ? a.scheme + ":" : ":";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              ((a = a.replace(/:+$/, "")),
              (a = a.replace(/[^-+\.a-zA-Z0-9]/g, d.percentEncode)),
              a.length > 0 && ((c.scheme = a), (n = c.toString()))),
              (this.href = n);
          },
        },
        host: {
          get: function () {
            var a = this._url;
            return a.isAbsolute() && a.isAuthorityBased()
              ? a.host + (a.port ? ":" + a.port : "")
              : "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              c.isAuthorityBased() &&
              ((a = a.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                d.percentEncode,
              )),
              a.length > 0 &&
                ((c.host = a), delete c.port, (n = c.toString()))),
              (this.href = n);
          },
        },
        hostname: {
          get: function () {
            var a = this._url;
            return a.isAbsolute() && a.isAuthorityBased() ? a.host : "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              c.isAuthorityBased() &&
              ((a = a.replace(/^\/+/, "")),
              (a = a.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                d.percentEncode,
              )),
              a.length > 0 && ((c.host = a), (n = c.toString()))),
              (this.href = n);
          },
        },
        port: {
          get: function () {
            var a = this._url;
            return a.isAbsolute() && a.isAuthorityBased() && a.port !== void 0
              ? a.port
              : "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              c.isAuthorityBased() &&
              ((a = "" + a),
              (a = a.replace(/[^0-9].*$/, "")),
              (a = a.replace(/^0+/, "")),
              a.length === 0 && (a = "0"),
              parseInt(a, 10) <= 65535 && ((c.port = a), (n = c.toString()))),
              (this.href = n);
          },
        },
        pathname: {
          get: function () {
            var a = this._url;
            return a.isAbsolute() && a.isHierarchical() ? a.path : "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              c.isHierarchical() &&
              (a.charAt(0) !== "/" && (a = "/" + a),
              (a = a.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                d.percentEncode,
              )),
              (c.path = a),
              (n = c.toString())),
              (this.href = n);
          },
        },
        search: {
          get: function () {
            var a = this._url;
            return a.isAbsolute() && a.isHierarchical() && a.query !== void 0
              ? "?" + a.query
              : "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              c.isHierarchical() &&
              (a.charAt(0) === "?" && (a = a.substring(1)),
              (a = a.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                d.percentEncode,
              )),
              (c.query = a),
              (n = c.toString())),
              (this.href = n);
          },
        },
        hash: {
          get: function () {
            var a = this._url;
            return a == null || a.fragment == null || a.fragment === ""
              ? ""
              : "#" + a.fragment;
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            a.charAt(0) === "#" && (a = a.substring(1)),
              (a = a.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                d.percentEncode,
              )),
              (c.fragment = a),
              (n = c.toString()),
              (this.href = n);
          },
        },
        username: {
          get: function () {
            var a = this._url;
            return a.username || "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              ((a = a.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                d.percentEncode,
              )),
              (c.username = a),
              (n = c.toString())),
              (this.href = n);
          },
        },
        password: {
          get: function () {
            var a = this._url;
            return a.password || "";
          },
          set: function (a) {
            var n = this.href,
              c = new d(n);
            c.isAbsolute() &&
              (a === ""
                ? (c.password = null)
                : ((a = a.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    d.percentEncode,
                  )),
                  (c.password = a)),
              (n = c.toString())),
              (this.href = n);
          },
        },
        origin: {
          get: function () {
            var a = this._url;
            if (a == null) return "";
            var n = function (c) {
              var l = [a.scheme, a.host, +a.port || c];
              return l[0] + "://" + l[1] + (l[2] === c ? "" : ":" + l[2]);
            };
            switch (a.scheme) {
              case "ftp":
                return n(21);
              case "gopher":
                return n(70);
              case "http":
              case "ws":
                return n(80);
              case "https":
              case "wss":
                return n(443);
              default:
                return a.scheme + "://";
            }
          },
        },
      })),
        (u._inherit = function (a) {
          Object.getOwnPropertyNames(u.prototype).forEach(function (n) {
            if (!(n === "constructor" || n === "href")) {
              var c = Object.getOwnPropertyDescriptor(u.prototype, n);
              Object.defineProperty(a, n, c);
            }
          });
        });
    },
  }),
  La = ue({
    "external/npm/node_modules/domino/lib/defineElement.js"(v, N) {
      "use strict";
      var d = ga(),
        u = Tn().isApiWritable;
      N.exports = function (l, h, s, E) {
        var b = l.ctor;
        if (b) {
          var y = l.props || {};
          if (l.attributes)
            for (var x in l.attributes) {
              var R = l.attributes[x];
              (typeof R != "object" || Array.isArray(R)) && (R = { type: R }),
                R.name || (R.name = x.toLowerCase()),
                (y[x] = d.property(R));
            }
          (y.constructor = { value: b, writable: u }),
            (b.prototype = Object.create((l.superclass || h).prototype, y)),
            l.events && c(b, l.events),
            (s[l.name] = b);
        } else b = h;
        return (
          (l.tags || (l.tag && [l.tag]) || []).forEach(function (I) {
            E[I] = b;
          }),
          b
        );
      };
      function a(l, h, s, E) {
        (this.body = l),
          (this.document = h),
          (this.form = s),
          (this.element = E);
      }
      a.prototype.build = function () {
        return () => {};
      };
      function n(l, h, s, E) {
        var b = l.ownerDocument || Object.create(null),
          y = l.form || Object.create(null);
        l[h] = new a(E, b, y, l).build();
      }
      function c(l, h) {
        var s = l.prototype;
        h.forEach(function (E) {
          Object.defineProperty(s, "on" + E, {
            get: function () {
              return this._getEventHandler(E);
            },
            set: function (b) {
              this._setEventHandler(E, b);
            },
          }),
            d.registerChangeHandler(l, "on" + E, n);
        });
      }
    },
  }),
  Ln = ue({
    "external/npm/node_modules/domino/lib/htmlelts.js"(v) {
      "use strict";
      var N = Ge(),
        d = Er(),
        u = Cn(),
        a = Be(),
        n = Ca(),
        c = La(),
        l = (v.elements = {}),
        h = Object.create(null);
      v.createElement = function (w, _, S) {
        var m = h[_] || re;
        return new m(w, _, S);
      };
      function s(w) {
        return c(w, I, l, h);
      }
      function E(w) {
        return {
          get: function () {
            var _ = this._getattr(w);
            if (_ === null) return "";
            var S = this.doc._resolve(_);
            return S === null ? _ : S;
          },
          set: function (_) {
            this._setattr(w, _);
          },
        };
      }
      function b(w) {
        return {
          get: function () {
            var _ = this._getattr(w);
            return _ === null
              ? null
              : _.toLowerCase() === "use-credentials"
                ? "use-credentials"
                : "anonymous";
          },
          set: function (_) {
            _ == null ? this.removeAttribute(w) : this._setattr(w, _);
          },
        };
      }
      var y = {
          type: [
            "",
            "no-referrer",
            "no-referrer-when-downgrade",
            "same-origin",
            "origin",
            "strict-origin",
            "origin-when-cross-origin",
            "strict-origin-when-cross-origin",
            "unsafe-url",
          ],
          missing: "",
        },
        x = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        R = function (w, _, S) {
          I.call(this, w, _, S), (this._form = null);
        },
        I = (v.HTMLElement = s({
          superclass: d,
          name: "HTMLElement",
          ctor: function (_, S, m) {
            d.call(this, _, S, a.NAMESPACE.HTML, m);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (w) {
                this._innerHTML = w;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (w) {
                var _ = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this,
                );
                _.parse(w === null ? "" : String(w), !0);
                for (
                  var S = this instanceof h.template ? this.content : this;
                  S.hasChildNodes();

                )
                  S.removeChild(S.firstChild);
                S.appendChild(_._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new u(this)), this._style;
              },
              set: function (w) {
                w == null && (w = ""), this._setattr("style", String(w));
              },
            },
            blur: { value: function () {} },
            focus: { value: function () {} },
            forceSpellCheck: { value: function () {} },
            click: {
              value: function () {
                if (!this._click_in_progress) {
                  this._click_in_progress = !0;
                  try {
                    this._pre_click_activation_steps &&
                      this._pre_click_activation_steps();
                    var w = this.ownerDocument.createEvent("MouseEvent");
                    w.initMouseEvent(
                      "click",
                      !0,
                      !0,
                      this.ownerDocument.defaultView,
                      1,
                      0,
                      0,
                      0,
                      0,
                      !1,
                      !1,
                      !1,
                      !1,
                      0,
                      null,
                    );
                    var _ = this.dispatchEvent(w);
                    _
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(w)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: a.nyi },
          },
          attributes: {
            title: String,
            lang: String,
            dir: { type: ["ltr", "rtl", "auto"], missing: "" },
            draggable: { type: ["true", "false"], treatNullAsEmptyString: !0 },
            spellcheck: { type: ["true", "false"], missing: "" },
            enterKeyHint: {
              type: [
                "enter",
                "done",
                "go",
                "next",
                "previous",
                "search",
                "send",
              ],
              missing: "",
            },
            autoCapitalize: {
              type: ["off", "on", "none", "sentences", "words", "characters"],
              missing: "",
            },
            autoFocus: Boolean,
            accessKey: String,
            nonce: String,
            hidden: Boolean,
            translate: { type: ["no", "yes"], missing: "" },
            tabIndex: {
              type: "long",
              default: function () {
                return this.tagName in x || this.contentEditable ? 0 : -1;
              },
            },
          },
          events: [
            "abort",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "contextmenu",
            "cuechange",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "mousedown",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "mousewheel",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "readystatechange",
            "reset",
            "seeked",
            "seeking",
            "select",
            "show",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting",
            "blur",
            "error",
            "focus",
            "load",
            "scroll",
          ],
        })),
        re = s({
          name: "HTMLUnknownElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        B = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      s({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (_, S, m) {
          I.call(this, _, S, m);
        },
        props: {
          _post_click_activation_steps: {
            value: function (w) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: E,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: y,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        n._inherit(h.a.prototype),
        s({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: E,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: y,
            noHref: Boolean,
          },
        }),
        n._inherit(h.area.prototype),
        s({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { clear: String },
        }),
        s({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { target: String },
        }),
        s({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          events: [
            "afterprint",
            "beforeprint",
            "beforeunload",
            "blur",
            "error",
            "focus",
            "hashchange",
            "load",
            "message",
            "offline",
            "online",
            "pagehide",
            "pageshow",
            "popstate",
            "resize",
            "scroll",
            "storage",
            "unload",
          ],
          attributes: {
            text: { type: String, treatNullAsEmptyString: !0 },
            link: { type: String, treatNullAsEmptyString: !0 },
            vLink: { type: String, treatNullAsEmptyString: !0 },
            aLink: { type: String, treatNullAsEmptyString: !0 },
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            background: String,
          },
        }),
        s({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: {
            name: String,
            value: String,
            disabled: Boolean,
            autofocus: Boolean,
            type: {
              type: ["submit", "reset", "button", "menu"],
              missing: "submit",
            },
            formTarget: String,
            formAction: E,
            formNoValidate: Boolean,
            formMethod: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "",
            },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
          },
        }),
        s({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { compact: Boolean },
        }),
        s({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { value: String },
        }),
        s({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        s({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { open: Boolean },
        }),
        s({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { align: String },
        }),
        s({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            src: E,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        s({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: { disabled: Boolean, name: String },
        }),
        s({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            action: String,
            autocomplete: { type: ["on", "off"], missing: "on" },
            name: String,
            acceptCharset: { name: "accept-charset" },
            target: String,
            noValidate: Boolean,
            method: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "get",
            },
            enctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
            encoding: {
              name: "enctype",
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
          },
        }),
        s({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        s({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        s({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { align: String },
        }),
        s({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { xmlns: E, version: String },
        }),
        s({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            src: E,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: y,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: E,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            alt: String,
            src: E,
            srcset: String,
            crossOrigin: b,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: y,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: E,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: E,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: {
            form: B.form,
            _post_click_activation_steps: {
              value: function (w) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var _ = this.form.getElementsByName(this.name),
                      S = _.length - 1;
                    S >= 0;
                    S--
                  ) {
                    var m = _[S];
                    m.checked = m === this;
                  }
              },
            },
          },
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            accept: String,
            alt: String,
            max: String,
            min: String,
            pattern: String,
            placeholder: String,
            step: String,
            dirName: String,
            defaultValue: { name: "value" },
            multiple: Boolean,
            required: Boolean,
            readOnly: Boolean,
            checked: Boolean,
            value: String,
            src: E,
            defaultChecked: { name: "checked", type: Boolean },
            size: { type: "unsigned long", default: 20, min: 1, setmin: 1 },
            width: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            height: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            autocomplete: String,
            type: {
              type: [
                "text",
                "hidden",
                "search",
                "tel",
                "url",
                "email",
                "password",
                "datetime",
                "date",
                "month",
                "week",
                "time",
                "datetime-local",
                "number",
                "range",
                "color",
                "checkbox",
                "radio",
                "file",
                "submit",
                "image",
                "reset",
                "button",
              ],
              missing: "text",
            },
            formTarget: String,
            formNoValidate: Boolean,
            formMethod: { type: ["get", "post"], invalid: "get", missing: "" },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
            align: String,
            useMap: String,
          },
        }),
        s({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        s({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        s({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        s({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { align: String },
        }),
        s({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            href: E,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: b,
            nonce: String,
            integrity: String,
            referrerPolicy: y,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        s({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { name: String },
        }),
        s({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        s({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        s({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
        }),
        s({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { cite: E, dateTime: String },
        }),
        s({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            _numitems: {
              get: function () {
                var w = 0;
                return (
                  this.childNodes.forEach(function (_) {
                    _.nodeType === N.ELEMENT_NODE && _.tagName === "LI" && w++;
                  }),
                  w
                );
              },
            },
          },
          attributes: {
            type: String,
            reversed: Boolean,
            start: {
              type: "long",
              default: function () {
                return this.reversed ? this._numitems : 1;
              },
            },
            compact: Boolean,
          },
        }),
        s({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: {
            data: E,
            type: String,
            name: String,
            useMap: String,
            typeMustMatch: Boolean,
            width: String,
            height: String,
            align: String,
            archive: String,
            code: String,
            declare: Boolean,
            hspace: { type: "unsigned long", default: 0 },
            standby: String,
            vspace: { type: "unsigned long", default: 0 },
            codeBase: E,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        s({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            form: {
              get: function () {
                for (
                  var w = this.parentNode;
                  w && w.nodeType === N.ELEMENT_NODE;

                ) {
                  if (w.localName === "select") return w.form;
                  w = w.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (w) {
                this._setattr("value", w);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (w) {
                this.textContent = w;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        s({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: { name: String },
        }),
        s({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { align: String },
        }),
        s({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        s({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        s({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: B,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        s({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { cite: E },
        }),
        s({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            text: {
              get: function () {
                for (
                  var w = "", _ = 0, S = this.childNodes.length;
                  _ < S;
                  _++
                ) {
                  var m = this.childNodes[_];
                  m.nodeType === N.TEXT_NODE && (w += m._data);
                }
                return w;
              },
              set: function (w) {
                this.removeChildren(),
                  w !== null &&
                    w !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(w));
              },
            },
          },
          attributes: {
            src: E,
            type: String,
            charset: String,
            referrerPolicy: y,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: b,
            nonce: String,
            integrity: String,
          },
        }),
        s({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: {
            form: B.form,
            options: {
              get: function () {
                return this.getElementsByTagName("option");
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            multiple: Boolean,
            required: Boolean,
            size: { type: "unsigned long", default: 0 },
          },
        }),
        s({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        s({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        s({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { align: String },
        }),
        s({
          name: "HTMLTableCellElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            colSpan: { type: "unsigned long", default: 1 },
            rowSpan: { type: "unsigned long", default: 1 },
            scope: {
              type: ["row", "col", "rowgroup", "colgroup"],
              missing: "",
            },
            abbr: String,
            align: String,
            axis: String,
            height: String,
            width: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            noWrap: Boolean,
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            span: {
              type: "limited unsigned long with fallback",
              default: 1,
              min: 1,
            },
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            width: String,
          },
        }),
        s({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            border: String,
            frame: String,
            rules: String,
            summary: String,
            width: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            cellPadding: { type: String, treatNullAsEmptyString: !0 },
            cellSpacing: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m),
              (this._contentFragment = _._templateDoc.createDocumentFragment());
          },
          props: {
            content: {
              get: function () {
                return this._contentFragment;
              },
            },
            serialize: {
              value: function () {
                return this.content.serialize();
              },
            },
          },
        }),
        s({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            cells: {
              get: function () {
                return this.querySelectorAll("td,th");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
          },
        }),
        s({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (_, S, m) {
            R.call(this, _, S, m);
          },
          props: {
            form: B.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (w) {
                this.textContent = w;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (w) {
                this.defaultValue = w;
              },
            },
            textLength: {
              get: function () {
                return this.value.length;
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            placeholder: String,
            wrap: String,
            dirName: String,
            required: Boolean,
            readOnly: Boolean,
            rows: { type: "limited unsigned long with fallback", default: 2 },
            cols: { type: "limited unsigned long with fallback", default: 20 },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
          },
        }),
        s({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        s({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        s({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { type: String, compact: Boolean },
        }),
        s({
          name: "HTMLMediaElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            src: E,
            crossOrigin: b,
            preload: {
              type: ["metadata", "none", "auto", { value: "", alias: "auto" }],
              missing: "auto",
            },
            loop: Boolean,
            autoplay: Boolean,
            mediaGroup: String,
            controls: Boolean,
            defaultMuted: { name: "muted", type: Boolean },
          },
        }),
        s({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: l.HTMLMediaElement,
          ctor: function (_, S, m) {
            l.HTMLMediaElement.call(this, _, S, m);
          },
        }),
        s({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: l.HTMLMediaElement,
          ctor: function (_, S, m) {
            l.HTMLMediaElement.call(this, _, S, m);
          },
          attributes: {
            poster: E,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        s({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: l.HTMLTableCellElement,
          ctor: function (_, S, m) {
            l.HTMLTableCellElement.call(this, _, S, m);
          },
        }),
        s({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: l.HTMLTableCellElement,
          ctor: function (_, S, m) {
            l.HTMLTableCellElement.call(this, _, S, m);
          },
        }),
        s({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        s({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
        }),
        s({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            getContext: { value: a.nyi },
            probablySupportsContext: { value: a.nyi },
            setContext: { value: a.nyi },
            transferControlToProxy: { value: a.nyi },
            toDataURL: { value: a.nyi },
            toBlob: { value: a.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        s({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            show: { value: a.nyi },
            showModal: { value: a.nyi },
            close: { value: a.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        s({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          props: {
            _label: {
              get: function () {
                var w = this._getattr("label");
                return w !== null && w !== ""
                  ? w
                  : ((w = this.textContent),
                    w.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var w = this._getattr("label");
                return w !== null ? w : this._label;
              },
              set: function (w) {
                this._setattr("label", w);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: E,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        s({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: E,
            type: String,
            width: String,
            height: String,
          },
        }),
        s({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            src: E,
            srclang: String,
            label: String,
            default: Boolean,
            kind: {
              type: [
                "subtitles",
                "captions",
                "descriptions",
                "chapters",
                "metadata",
              ],
              missing: "subtitles",
              invalid: "metadata",
            },
          },
          props: {
            NONE: {
              get: function () {
                return 0;
              },
            },
            LOADING: {
              get: function () {
                return 1;
              },
            },
            LOADED: {
              get: function () {
                return 2;
              },
            },
            ERROR: {
              get: function () {
                return 3;
              },
            },
            readyState: { get: a.nyi },
            track: { get: a.nyi },
          },
        }),
        s({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        s({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (_, S, m) {
            I.call(this, _, S, m);
          },
          attributes: { compact: Boolean },
        }),
        s({
          tags: [
            "abbr",
            "address",
            "article",
            "aside",
            "b",
            "bdi",
            "bdo",
            "cite",
            "content",
            "code",
            "dd",
            "dfn",
            "dt",
            "em",
            "figcaption",
            "figure",
            "footer",
            "header",
            "hgroup",
            "i",
            "kbd",
            "main",
            "mark",
            "nav",
            "noscript",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "section",
            "small",
            "strong",
            "sub",
            "summary",
            "sup",
            "u",
            "var",
            "wbr",
            "acronym",
            "basefont",
            "big",
            "center",
            "nobr",
            "noembed",
            "noframes",
            "plaintext",
            "strike",
            "tt",
          ],
        });
    },
  }),
  Da = ue({
    "external/npm/node_modules/domino/lib/svg.js"(v) {
      "use strict";
      var N = Er(),
        d = La(),
        u = Be(),
        a = Cn(),
        n = (v.elements = {}),
        c = Object.create(null);
      v.createElement = function (s, E, b) {
        var y = c[E] || h;
        return new y(s, E, b);
      };
      function l(s) {
        return d(s, h, n, c);
      }
      var h = l({
        superclass: N,
        name: "SVGElement",
        ctor: function (E, b, y) {
          N.call(this, E, b, u.NAMESPACE.SVG, y);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new a(this)), this._style;
            },
          },
        },
      });
      l({
        name: "SVGSVGElement",
        ctor: function (E, b, y) {
          h.call(this, E, b, y);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return v.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        l({
          tags: [
            "a",
            "altGlyph",
            "altGlyphDef",
            "altGlyphItem",
            "animate",
            "animateColor",
            "animateMotion",
            "animateTransform",
            "circle",
            "clipPath",
            "color-profile",
            "cursor",
            "defs",
            "desc",
            "ellipse",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDiffuseLighting",
            "feDisplacementMap",
            "feDistantLight",
            "feFlood",
            "feFuncA",
            "feFuncB",
            "feFuncG",
            "feFuncR",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMergeNode",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence",
            "filter",
            "font",
            "font-face",
            "font-face-format",
            "font-face-name",
            "font-face-src",
            "font-face-uri",
            "foreignObject",
            "g",
            "glyph",
            "glyphRef",
            "hkern",
            "image",
            "line",
            "linearGradient",
            "marker",
            "mask",
            "metadata",
            "missing-glyph",
            "mpath",
            "path",
            "pattern",
            "polygon",
            "polyline",
            "radialGradient",
            "rect",
            "script",
            "set",
            "stop",
            "style",
            "switch",
            "symbol",
            "text",
            "textPath",
            "title",
            "tref",
            "tspan",
            "use",
            "view",
            "vkern",
          ],
        });
    },
  }),
  as = ue({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(v, N) {
      "use strict";
      N.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  Dn = ue({
    "external/npm/node_modules/domino/lib/Document.js"(v, N) {
      "use strict";
      N.exports = F;
      var d = Ge(),
        u = rr(),
        a = yn(),
        n = Er(),
        c = Ta(),
        l = ya(),
        h = br(),
        s = wa(),
        E = Na(),
        b = Jr(),
        y = es(),
        x = ts(),
        R = $r(),
        I = kn(),
        re = Nn(),
        B = ka(),
        w = wn(),
        _ = Ln(),
        S = Da(),
        m = Be(),
        ie = as(),
        J = m.NAMESPACE,
        Y = Tn().isApiWritable;
      function F(i, g) {
        a.call(this),
          (this.nodeType = d.DOCUMENT_NODE),
          (this.isHTML = i),
          (this._address = g || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new b(this)),
          (this.ownerDocument = null),
          (this._contentType = i ? "text/html" : "application/xml"),
          (this.doctype = null),
          (this.documentElement = null),
          (this._templateDocCache = null),
          (this._nodeIterators = null),
          (this._nid = 1),
          (this._nextnid = 2),
          (this._nodes = [null, this]),
          (this.byId = Object.create(null)),
          (this.modclock = 0);
      }
      var L = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        P = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        $ = function (i, g, k) {
          return {
            get: function () {
              var W = i.call(this);
              return W ? W[g] : k;
            },
            set: function (W) {
              var ve = i.call(this);
              ve && (ve[g] = W);
            },
          };
        };
      function f(i, g) {
        var k, W, ve;
        return (
          i === "" && (i = null),
          w.isValidQName(g) || m.InvalidCharacterError(),
          (k = null),
          (W = g),
          (ve = g.indexOf(":")),
          ve >= 0 && ((k = g.substring(0, ve)), (W = g.substring(ve + 1))),
          k !== null && i === null && m.NamespaceError(),
          k === "xml" && i !== J.XML && m.NamespaceError(),
          (k === "xmlns" || g === "xmlns") &&
            i !== J.XMLNS &&
            m.NamespaceError(),
          i === J.XMLNS &&
            !(k === "xmlns" || g === "xmlns") &&
            m.NamespaceError(),
          { namespace: i, prefix: k, localName: W }
        );
      }
      F.prototype = Object.create(a.prototype, {
        _setMutationHandler: {
          value: function (i) {
            this.mutationHandler = i;
          },
        },
        _dispatchRendererEvent: {
          value: function (i, g, k) {
            var W = this._nodes[i];
            W && W._dispatchEvent(new h(g, k), !0);
          },
        },
        nodeName: { value: "#document" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        documentURI: {
          get: function () {
            return this._address;
          },
          set: m.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (i) {
            return new c(this, String(i));
          },
        },
        createComment: {
          value: function (i) {
            return new l(this, i);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new s(this);
          },
        },
        createProcessingInstruction: {
          value: function (i, g) {
            return (
              (!w.isValidName(i) || g.indexOf("?>") !== -1) &&
                m.InvalidCharacterError(),
              new E(this, i, g)
            );
          },
        },
        createAttribute: {
          value: function (i) {
            return (
              (i = String(i)),
              w.isValidName(i) || m.InvalidCharacterError(),
              this.isHTML && (i = m.toASCIILowerCase(i)),
              new n._Attr(null, i, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (i, g) {
            (i = i == null || i === "" ? null : String(i)), (g = String(g));
            var k = f(i, g);
            return new n._Attr(null, k.localName, k.prefix, k.namespace, "");
          },
        },
        createElement: {
          value: function (i) {
            return (
              (i = String(i)),
              w.isValidName(i) || m.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(i) && (i = m.toASCIILowerCase(i)),
                  _.createElement(this, i, null))
                : this.contentType === "application/xhtml+xml"
                  ? _.createElement(this, i, null)
                  : new n(this, i, null, null)
            );
          },
          writable: Y,
        },
        createElementNS: {
          value: function (i, g) {
            (i = i == null || i === "" ? null : String(i)), (g = String(g));
            var k = f(i, g);
            return this._createElementNS(k.localName, k.namespace, k.prefix);
          },
          writable: Y,
        },
        _createElementNS: {
          value: function (i, g, k) {
            return g === J.HTML
              ? _.createElement(this, i, k)
              : g === J.SVG
                ? S.createElement(this, i, k)
                : new n(this, i, g, k);
          },
        },
        createEvent: {
          value: function (g) {
            g = g.toLowerCase();
            var k = P[g] || g,
              W = B[L[k]];
            if (W) {
              var ve = new W();
              return (ve._initialized = !1), ve;
            } else m.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (i, g, k) {
            if (!i) throw new TypeError("root argument is required");
            if (!(i instanceof d)) throw new TypeError("root not a node");
            return (
              (g = g === void 0 ? R.SHOW_ALL : +g),
              (k = k === void 0 ? null : k),
              new y(i, g, k)
            );
          },
        },
        createNodeIterator: {
          value: function (i, g, k) {
            if (!i) throw new TypeError("root argument is required");
            if (!(i instanceof d)) throw new TypeError("root not a node");
            return (
              (g = g === void 0 ? R.SHOW_ALL : +g),
              (k = k === void 0 ? null : k),
              new x(i, g, k)
            );
          },
        },
        _attachNodeIterator: {
          value: function (i) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(i);
          },
        },
        _detachNodeIterator: {
          value: function (i) {
            var g = this._nodeIterators.indexOf(i);
            this._nodeIterators.splice(g, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (i) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (g) {
                g._preremove(i);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var g = this.firstChild; g !== null; g = g.nextSibling)
              g.nodeType === d.DOCUMENT_TYPE_NODE
                ? (this.doctype = g)
                : g.nodeType === d.ELEMENT_NODE && (this.documentElement = g);
          },
        },
        insertBefore: {
          value: function (g, k) {
            return (
              d.prototype.insertBefore.call(this, g, k),
              this._updateDocTypeElement(),
              g
            );
          },
        },
        replaceChild: {
          value: function (g, k) {
            return (
              d.prototype.replaceChild.call(this, g, k),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        removeChild: {
          value: function (g) {
            return (
              d.prototype.removeChild.call(this, g),
              this._updateDocTypeElement(),
              g
            );
          },
        },
        getElementById: {
          value: function (i) {
            var g = this.byId[i];
            return g ? (g instanceof ee ? g.getFirst() : g) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (i) {
            return this.byId[i] instanceof ee;
          },
        },
        getElementsByName: { value: n.prototype.getElementsByName },
        getElementsByTagName: { value: n.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: n.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: n.prototype.getElementsByClassName },
        adoptNode: {
          value: function (g) {
            return (
              g.nodeType === d.DOCUMENT_NODE && m.NotSupportedError(),
              g.nodeType === d.ATTRIBUTE_NODE ||
                (g.parentNode && g.parentNode.removeChild(g),
                g.ownerDocument !== this && ne(g, this)),
              g
            );
          },
        },
        importNode: {
          value: function (g, k) {
            return this.adoptNode(g.cloneNode(k));
          },
          writable: Y,
        },
        origin: {
          get: function () {
            return null;
          },
        },
        characterSet: {
          get: function () {
            return "UTF-8";
          },
        },
        contentType: {
          get: function () {
            return this._contentType;
          },
        },
        URL: {
          get: function () {
            return this._address;
          },
        },
        domain: { get: m.nyi, set: m.nyi },
        referrer: { get: m.nyi },
        cookie: { get: m.nyi, set: m.nyi },
        lastModified: { get: m.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: m.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var i = this._titleElement,
              g = i ? i.textContent : "";
            return g.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (i) {
            var g = this._titleElement,
              k = this.head;
            (!g && !k) ||
              (g || ((g = this.createElement("title")), k.appendChild(g)),
              (g.textContent = i));
          },
        },
        dir: $(
          function () {
            var i = this.documentElement;
            if (i && i.tagName === "HTML") return i;
          },
          "dir",
          "",
        ),
        fgColor: $(
          function () {
            return this.body;
          },
          "text",
          "",
        ),
        linkColor: $(
          function () {
            return this.body;
          },
          "link",
          "",
        ),
        vlinkColor: $(
          function () {
            return this.body;
          },
          "vLink",
          "",
        ),
        alinkColor: $(
          function () {
            return this.body;
          },
          "aLink",
          "",
        ),
        bgColor: $(
          function () {
            return this.body;
          },
          "bgColor",
          "",
        ),
        charset: {
          get: function () {
            return this.characterSet;
          },
        },
        inputEncoding: {
          get: function () {
            return this.characterSet;
          },
        },
        scrollingElement: {
          get: function () {
            return this._quirks ? this.body : this.documentElement;
          },
        },
        body: {
          get: function () {
            return r(this.documentElement, "body");
          },
          set: m.nyi,
        },
        head: {
          get: function () {
            return r(this.documentElement, "head");
          },
        },
        images: { get: m.nyi },
        embeds: { get: m.nyi },
        plugins: { get: m.nyi },
        links: { get: m.nyi },
        forms: { get: m.nyi },
        scripts: { get: m.nyi },
        applets: {
          get: function () {
            return [];
          },
        },
        activeElement: {
          get: function () {
            return null;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: m.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: m.nyi,
        },
        write: {
          value: function (i) {
            if ((this.isHTML || m.InvalidStateError(), !!this._parser)) {
              this._parser;
              var g = arguments.join("");
              this._parser.parse(g);
            }
          },
        },
        writeln: {
          value: function (g) {
            this.write(
              Array.prototype.join.call(arguments, "") +
                `
`,
            );
          },
        },
        open: {
          value: function () {
            this.documentElement = null;
          },
        },
        close: {
          value: function () {
            (this.readyState = "interactive"),
              this._dispatchEvent(new h("readystatechange"), !0),
              this._dispatchEvent(new h("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new h("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new h("load"), !0);
          },
        },
        clone: {
          value: function () {
            var g = new F(this.isHTML, this._address);
            return (
              (g._quirks = this._quirks),
              (g._contentType = this._contentType),
              g
            );
          },
        },
        cloneNode: {
          value: function (g) {
            var k = d.prototype.cloneNode.call(this, !1);
            if (g)
              for (var W = this.firstChild; W !== null; W = W.nextSibling)
                k._appendChild(k.importNode(W, !0));
            return k._updateDocTypeElement(), k;
          },
        },
        isEqual: {
          value: function (g) {
            return !0;
          },
        },
        mutateValue: {
          value: function (i) {
            this.mutationHandler &&
              this.mutationHandler({ type: ie.VALUE, target: i, data: i.data });
          },
        },
        mutateAttr: {
          value: function (i, g) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ie.ATTR,
                target: i.ownerElement,
                attr: i,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (i) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ie.REMOVE_ATTR,
                target: i.ownerElement,
                attr: i,
              });
          },
        },
        mutateRemove: {
          value: function (i) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ie.REMOVE,
                target: i.parentNode,
                node: i,
              }),
              z(i);
          },
        },
        mutateInsert: {
          value: function (i) {
            O(i),
              this.mutationHandler &&
                this.mutationHandler({
                  type: ie.INSERT,
                  target: i.parentNode,
                  node: i,
                });
          },
        },
        mutateMove: {
          value: function (i) {
            this.mutationHandler &&
              this.mutationHandler({ type: ie.MOVE, target: i });
          },
        },
        addId: {
          value: function (g, k) {
            var W = this.byId[g];
            W
              ? (W instanceof ee || ((W = new ee(W)), (this.byId[g] = W)),
                W.add(k))
              : (this.byId[g] = k);
          },
        },
        delId: {
          value: function (g, k) {
            var W = this.byId[g];
            m.assert(W),
              W instanceof ee
                ? (W.del(k), W.length === 1 && (this.byId[g] = W.downgrade()))
                : (this.byId[g] = void 0);
          },
        },
        _resolve: {
          value: function (i) {
            return new I(this._documentBaseURL).resolve(i);
          },
        },
        _documentBaseURL: {
          get: function () {
            var i = this._address;
            i === "about:blank" && (i = "/");
            var g = this.querySelector("base[href]");
            return g ? new I(i).resolve(g.getAttribute("href")) : i;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var i = new F(this.isHTML, this._address);
              this._templateDocCache = i._templateDocCache = i;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (i) {
            return re(i, this)[0];
          },
        },
        querySelectorAll: {
          value: function (i) {
            var g = re(i, this);
            return g.item ? g : new u(g);
          },
        },
      });
      var o = [
        "abort",
        "canplay",
        "canplaythrough",
        "change",
        "click",
        "contextmenu",
        "cuechange",
        "dblclick",
        "drag",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "dragstart",
        "drop",
        "durationchange",
        "emptied",
        "ended",
        "input",
        "invalid",
        "keydown",
        "keypress",
        "keyup",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mousedown",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup",
        "mousewheel",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "readystatechange",
        "reset",
        "seeked",
        "seeking",
        "select",
        "show",
        "stalled",
        "submit",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
        "blur",
        "error",
        "focus",
        "load",
        "scroll",
      ];
      o.forEach(function (i) {
        Object.defineProperty(F.prototype, "on" + i, {
          get: function () {
            return this._getEventHandler(i);
          },
          set: function (g) {
            this._setEventHandler(i, g);
          },
        });
      });
      function r(i, g) {
        if (i && i.isHTML) {
          for (var k = i.firstChild; k !== null; k = k.nextSibling)
            if (
              k.nodeType === d.ELEMENT_NODE &&
              k.localName === g &&
              k.namespaceURI === J.HTML
            )
              return k;
        }
        return null;
      }
      function p(i) {
        if (
          ((i._nid = i.ownerDocument._nextnid++),
          (i.ownerDocument._nodes[i._nid] = i),
          i.nodeType === d.ELEMENT_NODE)
        ) {
          var g = i.getAttribute("id");
          g && i.ownerDocument.addId(g, i), i._roothook && i._roothook();
        }
      }
      function D(i) {
        if (i.nodeType === d.ELEMENT_NODE) {
          var g = i.getAttribute("id");
          g && i.ownerDocument.delId(g, i);
        }
        (i.ownerDocument._nodes[i._nid] = void 0), (i._nid = void 0);
      }
      function O(i) {
        if ((p(i), i.nodeType === d.ELEMENT_NODE))
          for (var g = i.firstChild; g !== null; g = g.nextSibling) O(g);
      }
      function z(i) {
        D(i);
        for (var g = i.firstChild; g !== null; g = g.nextSibling) z(g);
      }
      function ne(i, g) {
        (i.ownerDocument = g),
          (i._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(i, "_tagName") &&
            (i._tagName = void 0);
        for (var k = i.firstChild; k !== null; k = k.nextSibling) ne(k, g);
      }
      function ee(i) {
        (this.nodes = Object.create(null)),
          (this.nodes[i._nid] = i),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (ee.prototype.add = function (i) {
        this.nodes[i._nid] ||
          ((this.nodes[i._nid] = i), this.length++, (this.firstNode = void 0));
      }),
        (ee.prototype.del = function (i) {
          this.nodes[i._nid] &&
            (delete this.nodes[i._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (ee.prototype.getFirst = function () {
          if (!this.firstNode) {
            var i;
            for (i in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[i]) &
                  d.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[i]);
          }
          return this.firstNode;
        }),
        (ee.prototype.downgrade = function () {
          if (this.length === 1) {
            var i;
            for (i in this.nodes) return this.nodes[i];
          }
          return this;
        });
    },
  }),
  An = ue({
    "external/npm/node_modules/domino/lib/DocumentType.js"(v, N) {
      "use strict";
      N.exports = n;
      var d = Ge(),
        u = va(),
        a = Sn();
      function n(c, l, h, s) {
        u.call(this),
          (this.nodeType = d.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = c || null),
          (this.name = l),
          (this.publicId = h || ""),
          (this.systemId = s || "");
      }
      (n.prototype = Object.create(u.prototype, {
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        clone: {
          value: function () {
            return new n(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId,
            );
          },
        },
        isEqual: {
          value: function (l) {
            return (
              this.name === l.name &&
              this.publicId === l.publicId &&
              this.systemId === l.systemId
            );
          },
        },
      })),
        Object.defineProperties(n.prototype, a);
    },
  }),
  Mn = ue({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(v, N) {
      "use strict";
      N.exports = be;
      var d = Dn(),
        u = An(),
        a = Ge(),
        n = Be().NAMESPACE,
        c = Ln(),
        l = c.elements,
        h = Function.prototype.apply.bind(Array.prototype.push),
        s = -1,
        E = 1,
        b = 2,
        y = 3,
        x = 4,
        R = 5,
        I = [],
        re =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        B = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        w =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        _ =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        S = Object.create(null);
      (S[n.HTML] = {
        __proto__: null,
        address: !0,
        applet: !0,
        area: !0,
        article: !0,
        aside: !0,
        base: !0,
        basefont: !0,
        bgsound: !0,
        blockquote: !0,
        body: !0,
        br: !0,
        button: !0,
        caption: !0,
        center: !0,
        col: !0,
        colgroup: !0,
        dd: !0,
        details: !0,
        dir: !0,
        div: !0,
        dl: !0,
        dt: !0,
        embed: !0,
        fieldset: !0,
        figcaption: !0,
        figure: !0,
        footer: !0,
        form: !0,
        frame: !0,
        frameset: !0,
        h1: !0,
        h2: !0,
        h3: !0,
        h4: !0,
        h5: !0,
        h6: !0,
        head: !0,
        header: !0,
        hgroup: !0,
        hr: !0,
        html: !0,
        iframe: !0,
        img: !0,
        input: !0,
        li: !0,
        link: !0,
        listing: !0,
        main: !0,
        marquee: !0,
        menu: !0,
        meta: !0,
        nav: !0,
        noembed: !0,
        noframes: !0,
        noscript: !0,
        object: !0,
        ol: !0,
        p: !0,
        param: !0,
        plaintext: !0,
        pre: !0,
        script: !0,
        section: !0,
        select: !0,
        source: !0,
        style: !0,
        summary: !0,
        table: !0,
        tbody: !0,
        td: !0,
        template: !0,
        textarea: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        title: !0,
        tr: !0,
        track: !0,
        ul: !0,
        wbr: !0,
        xmp: !0,
      }),
        (S[n.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (S[n.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var m = Object.create(null);
      m[n.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var ie = Object.create(null);
      ie[n.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var J = Object.create(null);
      J[n.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var Y = Object.create(null);
      Y[n.HTML] = {
        __proto__: null,
        dd: !0,
        dt: !0,
        li: !0,
        menuitem: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
      };
      var F = Object.create(null);
      F[n.HTML] = {
        __proto__: null,
        caption: !0,
        colgroup: !0,
        dd: !0,
        dt: !0,
        li: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
        tbody: !0,
        td: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        tr: !0,
      };
      var L = Object.create(null);
      L[n.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var P = Object.create(null);
      P[n.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var $ = Object.create(null);
      $[n.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var f = Object.create(null);
      f[n.HTML] = {
        __proto__: null,
        button: !0,
        fieldset: !0,
        input: !0,
        keygen: !0,
        object: !0,
        output: !0,
        select: !0,
        textarea: !0,
        img: !0,
      };
      var o = Object.create(null);
      (o[n.HTML] = {
        __proto__: null,
        applet: !0,
        caption: !0,
        html: !0,
        table: !0,
        td: !0,
        th: !0,
        marquee: !0,
        object: !0,
        template: !0,
      }),
        (o[n.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (o[n.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var r = Object.create(o);
      (r[n.HTML] = Object.create(o[n.HTML])),
        (r[n.HTML].ol = !0),
        (r[n.HTML].ul = !0);
      var p = Object.create(o);
      (p[n.HTML] = Object.create(o[n.HTML])), (p[n.HTML].button = !0);
      var D = Object.create(null);
      D[n.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var O = Object.create(null);
      O[n.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var z = Object.create(null);
      z[n.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var ne = Object.create(null);
      ne[n.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var ee = {
          __proto__: null,
          "xlink:actuate": n.XLINK,
          "xlink:arcrole": n.XLINK,
          "xlink:href": n.XLINK,
          "xlink:role": n.XLINK,
          "xlink:show": n.XLINK,
          "xlink:title": n.XLINK,
          "xlink:type": n.XLINK,
          "xml:base": n.XML,
          "xml:lang": n.XML,
          "xml:space": n.XML,
          xmlns: n.XMLNS,
          "xmlns:xlink": n.XMLNS,
        },
        i = {
          __proto__: null,
          attributename: "attributeName",
          attributetype: "attributeType",
          basefrequency: "baseFrequency",
          baseprofile: "baseProfile",
          calcmode: "calcMode",
          clippathunits: "clipPathUnits",
          diffuseconstant: "diffuseConstant",
          edgemode: "edgeMode",
          filterunits: "filterUnits",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          limitingconeangle: "limitingConeAngle",
          markerheight: "markerHeight",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          numoctaves: "numOctaves",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          refx: "refX",
          refy: "refY",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stitchtiles: "stitchTiles",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textlength: "textLength",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          xchannelselector: "xChannelSelector",
          ychannelselector: "yChannelSelector",
          zoomandpan: "zoomAndPan",
        },
        g = {
          __proto__: null,
          altglyph: "altGlyph",
          altglyphdef: "altGlyphDef",
          altglyphitem: "altGlyphItem",
          animatecolor: "animateColor",
          animatemotion: "animateMotion",
          animatetransform: "animateTransform",
          clippath: "clipPath",
          feblend: "feBlend",
          fecolormatrix: "feColorMatrix",
          fecomponenttransfer: "feComponentTransfer",
          fecomposite: "feComposite",
          feconvolvematrix: "feConvolveMatrix",
          fediffuselighting: "feDiffuseLighting",
          fedisplacementmap: "feDisplacementMap",
          fedistantlight: "feDistantLight",
          feflood: "feFlood",
          fefunca: "feFuncA",
          fefuncb: "feFuncB",
          fefuncg: "feFuncG",
          fefuncr: "feFuncR",
          fegaussianblur: "feGaussianBlur",
          feimage: "feImage",
          femerge: "feMerge",
          femergenode: "feMergeNode",
          femorphology: "feMorphology",
          feoffset: "feOffset",
          fepointlight: "fePointLight",
          fespecularlighting: "feSpecularLighting",
          fespotlight: "feSpotLight",
          fetile: "feTile",
          feturbulence: "feTurbulence",
          foreignobject: "foreignObject",
          glyphref: "glyphRef",
          lineargradient: "linearGradient",
          radialgradient: "radialGradient",
          textpath: "textPath",
        },
        k = {
          __proto__: null,
          0: 65533,
          128: 8364,
          130: 8218,
          131: 402,
          132: 8222,
          133: 8230,
          134: 8224,
          135: 8225,
          136: 710,
          137: 8240,
          138: 352,
          139: 8249,
          140: 338,
          142: 381,
          145: 8216,
          146: 8217,
          147: 8220,
          148: 8221,
          149: 8226,
          150: 8211,
          151: 8212,
          152: 732,
          153: 8482,
          154: 353,
          155: 8250,
          156: 339,
          158: 382,
          159: 376,
        },
        W = {
          __proto__: null,
          AElig: 198,
          "AElig;": 198,
          AMP: 38,
          "AMP;": 38,
          Aacute: 193,
          "Aacute;": 193,
          "Abreve;": 258,
          Acirc: 194,
          "Acirc;": 194,
          "Acy;": 1040,
          "Afr;": [55349, 56580],
          Agrave: 192,
          "Agrave;": 192,
          "Alpha;": 913,
          "Amacr;": 256,
          "And;": 10835,
          "Aogon;": 260,
          "Aopf;": [55349, 56632],
          "ApplyFunction;": 8289,
          Aring: 197,
          "Aring;": 197,
          "Ascr;": [55349, 56476],
          "Assign;": 8788,
          Atilde: 195,
          "Atilde;": 195,
          Auml: 196,
          "Auml;": 196,
          "Backslash;": 8726,
          "Barv;": 10983,
          "Barwed;": 8966,
          "Bcy;": 1041,
          "Because;": 8757,
          "Bernoullis;": 8492,
          "Beta;": 914,
          "Bfr;": [55349, 56581],
          "Bopf;": [55349, 56633],
          "Breve;": 728,
          "Bscr;": 8492,
          "Bumpeq;": 8782,
          "CHcy;": 1063,
          COPY: 169,
          "COPY;": 169,
          "Cacute;": 262,
          "Cap;": 8914,
          "CapitalDifferentialD;": 8517,
          "Cayleys;": 8493,
          "Ccaron;": 268,
          Ccedil: 199,
          "Ccedil;": 199,
          "Ccirc;": 264,
          "Cconint;": 8752,
          "Cdot;": 266,
          "Cedilla;": 184,
          "CenterDot;": 183,
          "Cfr;": 8493,
          "Chi;": 935,
          "CircleDot;": 8857,
          "CircleMinus;": 8854,
          "CirclePlus;": 8853,
          "CircleTimes;": 8855,
          "ClockwiseContourIntegral;": 8754,
          "CloseCurlyDoubleQuote;": 8221,
          "CloseCurlyQuote;": 8217,
          "Colon;": 8759,
          "Colone;": 10868,
          "Congruent;": 8801,
          "Conint;": 8751,
          "ContourIntegral;": 8750,
          "Copf;": 8450,
          "Coproduct;": 8720,
          "CounterClockwiseContourIntegral;": 8755,
          "Cross;": 10799,
          "Cscr;": [55349, 56478],
          "Cup;": 8915,
          "CupCap;": 8781,
          "DD;": 8517,
          "DDotrahd;": 10513,
          "DJcy;": 1026,
          "DScy;": 1029,
          "DZcy;": 1039,
          "Dagger;": 8225,
          "Darr;": 8609,
          "Dashv;": 10980,
          "Dcaron;": 270,
          "Dcy;": 1044,
          "Del;": 8711,
          "Delta;": 916,
          "Dfr;": [55349, 56583],
          "DiacriticalAcute;": 180,
          "DiacriticalDot;": 729,
          "DiacriticalDoubleAcute;": 733,
          "DiacriticalGrave;": 96,
          "DiacriticalTilde;": 732,
          "Diamond;": 8900,
          "DifferentialD;": 8518,
          "Dopf;": [55349, 56635],
          "Dot;": 168,
          "DotDot;": 8412,
          "DotEqual;": 8784,
          "DoubleContourIntegral;": 8751,
          "DoubleDot;": 168,
          "DoubleDownArrow;": 8659,
          "DoubleLeftArrow;": 8656,
          "DoubleLeftRightArrow;": 8660,
          "DoubleLeftTee;": 10980,
          "DoubleLongLeftArrow;": 10232,
          "DoubleLongLeftRightArrow;": 10234,
          "DoubleLongRightArrow;": 10233,
          "DoubleRightArrow;": 8658,
          "DoubleRightTee;": 8872,
          "DoubleUpArrow;": 8657,
          "DoubleUpDownArrow;": 8661,
          "DoubleVerticalBar;": 8741,
          "DownArrow;": 8595,
          "DownArrowBar;": 10515,
          "DownArrowUpArrow;": 8693,
          "DownBreve;": 785,
          "DownLeftRightVector;": 10576,
          "DownLeftTeeVector;": 10590,
          "DownLeftVector;": 8637,
          "DownLeftVectorBar;": 10582,
          "DownRightTeeVector;": 10591,
          "DownRightVector;": 8641,
          "DownRightVectorBar;": 10583,
          "DownTee;": 8868,
          "DownTeeArrow;": 8615,
          "Downarrow;": 8659,
          "Dscr;": [55349, 56479],
          "Dstrok;": 272,
          "ENG;": 330,
          ETH: 208,
          "ETH;": 208,
          Eacute: 201,
          "Eacute;": 201,
          "Ecaron;": 282,
          Ecirc: 202,
          "Ecirc;": 202,
          "Ecy;": 1069,
          "Edot;": 278,
          "Efr;": [55349, 56584],
          Egrave: 200,
          "Egrave;": 200,
          "Element;": 8712,
          "Emacr;": 274,
          "EmptySmallSquare;": 9723,
          "EmptyVerySmallSquare;": 9643,
          "Eogon;": 280,
          "Eopf;": [55349, 56636],
          "Epsilon;": 917,
          "Equal;": 10869,
          "EqualTilde;": 8770,
          "Equilibrium;": 8652,
          "Escr;": 8496,
          "Esim;": 10867,
          "Eta;": 919,
          Euml: 203,
          "Euml;": 203,
          "Exists;": 8707,
          "ExponentialE;": 8519,
          "Fcy;": 1060,
          "Ffr;": [55349, 56585],
          "FilledSmallSquare;": 9724,
          "FilledVerySmallSquare;": 9642,
          "Fopf;": [55349, 56637],
          "ForAll;": 8704,
          "Fouriertrf;": 8497,
          "Fscr;": 8497,
          "GJcy;": 1027,
          GT: 62,
          "GT;": 62,
          "Gamma;": 915,
          "Gammad;": 988,
          "Gbreve;": 286,
          "Gcedil;": 290,
          "Gcirc;": 284,
          "Gcy;": 1043,
          "Gdot;": 288,
          "Gfr;": [55349, 56586],
          "Gg;": 8921,
          "Gopf;": [55349, 56638],
          "GreaterEqual;": 8805,
          "GreaterEqualLess;": 8923,
          "GreaterFullEqual;": 8807,
          "GreaterGreater;": 10914,
          "GreaterLess;": 8823,
          "GreaterSlantEqual;": 10878,
          "GreaterTilde;": 8819,
          "Gscr;": [55349, 56482],
          "Gt;": 8811,
          "HARDcy;": 1066,
          "Hacek;": 711,
          "Hat;": 94,
          "Hcirc;": 292,
          "Hfr;": 8460,
          "HilbertSpace;": 8459,
          "Hopf;": 8461,
          "HorizontalLine;": 9472,
          "Hscr;": 8459,
          "Hstrok;": 294,
          "HumpDownHump;": 8782,
          "HumpEqual;": 8783,
          "IEcy;": 1045,
          "IJlig;": 306,
          "IOcy;": 1025,
          Iacute: 205,
          "Iacute;": 205,
          Icirc: 206,
          "Icirc;": 206,
          "Icy;": 1048,
          "Idot;": 304,
          "Ifr;": 8465,
          Igrave: 204,
          "Igrave;": 204,
          "Im;": 8465,
          "Imacr;": 298,
          "ImaginaryI;": 8520,
          "Implies;": 8658,
          "Int;": 8748,
          "Integral;": 8747,
          "Intersection;": 8898,
          "InvisibleComma;": 8291,
          "InvisibleTimes;": 8290,
          "Iogon;": 302,
          "Iopf;": [55349, 56640],
          "Iota;": 921,
          "Iscr;": 8464,
          "Itilde;": 296,
          "Iukcy;": 1030,
          Iuml: 207,
          "Iuml;": 207,
          "Jcirc;": 308,
          "Jcy;": 1049,
          "Jfr;": [55349, 56589],
          "Jopf;": [55349, 56641],
          "Jscr;": [55349, 56485],
          "Jsercy;": 1032,
          "Jukcy;": 1028,
          "KHcy;": 1061,
          "KJcy;": 1036,
          "Kappa;": 922,
          "Kcedil;": 310,
          "Kcy;": 1050,
          "Kfr;": [55349, 56590],
          "Kopf;": [55349, 56642],
          "Kscr;": [55349, 56486],
          "LJcy;": 1033,
          LT: 60,
          "LT;": 60,
          "Lacute;": 313,
          "Lambda;": 923,
          "Lang;": 10218,
          "Laplacetrf;": 8466,
          "Larr;": 8606,
          "Lcaron;": 317,
          "Lcedil;": 315,
          "Lcy;": 1051,
          "LeftAngleBracket;": 10216,
          "LeftArrow;": 8592,
          "LeftArrowBar;": 8676,
          "LeftArrowRightArrow;": 8646,
          "LeftCeiling;": 8968,
          "LeftDoubleBracket;": 10214,
          "LeftDownTeeVector;": 10593,
          "LeftDownVector;": 8643,
          "LeftDownVectorBar;": 10585,
          "LeftFloor;": 8970,
          "LeftRightArrow;": 8596,
          "LeftRightVector;": 10574,
          "LeftTee;": 8867,
          "LeftTeeArrow;": 8612,
          "LeftTeeVector;": 10586,
          "LeftTriangle;": 8882,
          "LeftTriangleBar;": 10703,
          "LeftTriangleEqual;": 8884,
          "LeftUpDownVector;": 10577,
          "LeftUpTeeVector;": 10592,
          "LeftUpVector;": 8639,
          "LeftUpVectorBar;": 10584,
          "LeftVector;": 8636,
          "LeftVectorBar;": 10578,
          "Leftarrow;": 8656,
          "Leftrightarrow;": 8660,
          "LessEqualGreater;": 8922,
          "LessFullEqual;": 8806,
          "LessGreater;": 8822,
          "LessLess;": 10913,
          "LessSlantEqual;": 10877,
          "LessTilde;": 8818,
          "Lfr;": [55349, 56591],
          "Ll;": 8920,
          "Lleftarrow;": 8666,
          "Lmidot;": 319,
          "LongLeftArrow;": 10229,
          "LongLeftRightArrow;": 10231,
          "LongRightArrow;": 10230,
          "Longleftarrow;": 10232,
          "Longleftrightarrow;": 10234,
          "Longrightarrow;": 10233,
          "Lopf;": [55349, 56643],
          "LowerLeftArrow;": 8601,
          "LowerRightArrow;": 8600,
          "Lscr;": 8466,
          "Lsh;": 8624,
          "Lstrok;": 321,
          "Lt;": 8810,
          "Map;": 10501,
          "Mcy;": 1052,
          "MediumSpace;": 8287,
          "Mellintrf;": 8499,
          "Mfr;": [55349, 56592],
          "MinusPlus;": 8723,
          "Mopf;": [55349, 56644],
          "Mscr;": 8499,
          "Mu;": 924,
          "NJcy;": 1034,
          "Nacute;": 323,
          "Ncaron;": 327,
          "Ncedil;": 325,
          "Ncy;": 1053,
          "NegativeMediumSpace;": 8203,
          "NegativeThickSpace;": 8203,
          "NegativeThinSpace;": 8203,
          "NegativeVeryThinSpace;": 8203,
          "NestedGreaterGreater;": 8811,
          "NestedLessLess;": 8810,
          "NewLine;": 10,
          "Nfr;": [55349, 56593],
          "NoBreak;": 8288,
          "NonBreakingSpace;": 160,
          "Nopf;": 8469,
          "Not;": 10988,
          "NotCongruent;": 8802,
          "NotCupCap;": 8813,
          "NotDoubleVerticalBar;": 8742,
          "NotElement;": 8713,
          "NotEqual;": 8800,
          "NotEqualTilde;": [8770, 824],
          "NotExists;": 8708,
          "NotGreater;": 8815,
          "NotGreaterEqual;": 8817,
          "NotGreaterFullEqual;": [8807, 824],
          "NotGreaterGreater;": [8811, 824],
          "NotGreaterLess;": 8825,
          "NotGreaterSlantEqual;": [10878, 824],
          "NotGreaterTilde;": 8821,
          "NotHumpDownHump;": [8782, 824],
          "NotHumpEqual;": [8783, 824],
          "NotLeftTriangle;": 8938,
          "NotLeftTriangleBar;": [10703, 824],
          "NotLeftTriangleEqual;": 8940,
          "NotLess;": 8814,
          "NotLessEqual;": 8816,
          "NotLessGreater;": 8824,
          "NotLessLess;": [8810, 824],
          "NotLessSlantEqual;": [10877, 824],
          "NotLessTilde;": 8820,
          "NotNestedGreaterGreater;": [10914, 824],
          "NotNestedLessLess;": [10913, 824],
          "NotPrecedes;": 8832,
          "NotPrecedesEqual;": [10927, 824],
          "NotPrecedesSlantEqual;": 8928,
          "NotReverseElement;": 8716,
          "NotRightTriangle;": 8939,
          "NotRightTriangleBar;": [10704, 824],
          "NotRightTriangleEqual;": 8941,
          "NotSquareSubset;": [8847, 824],
          "NotSquareSubsetEqual;": 8930,
          "NotSquareSuperset;": [8848, 824],
          "NotSquareSupersetEqual;": 8931,
          "NotSubset;": [8834, 8402],
          "NotSubsetEqual;": 8840,
          "NotSucceeds;": 8833,
          "NotSucceedsEqual;": [10928, 824],
          "NotSucceedsSlantEqual;": 8929,
          "NotSucceedsTilde;": [8831, 824],
          "NotSuperset;": [8835, 8402],
          "NotSupersetEqual;": 8841,
          "NotTilde;": 8769,
          "NotTildeEqual;": 8772,
          "NotTildeFullEqual;": 8775,
          "NotTildeTilde;": 8777,
          "NotVerticalBar;": 8740,
          "Nscr;": [55349, 56489],
          Ntilde: 209,
          "Ntilde;": 209,
          "Nu;": 925,
          "OElig;": 338,
          Oacute: 211,
          "Oacute;": 211,
          Ocirc: 212,
          "Ocirc;": 212,
          "Ocy;": 1054,
          "Odblac;": 336,
          "Ofr;": [55349, 56594],
          Ograve: 210,
          "Ograve;": 210,
          "Omacr;": 332,
          "Omega;": 937,
          "Omicron;": 927,
          "Oopf;": [55349, 56646],
          "OpenCurlyDoubleQuote;": 8220,
          "OpenCurlyQuote;": 8216,
          "Or;": 10836,
          "Oscr;": [55349, 56490],
          Oslash: 216,
          "Oslash;": 216,
          Otilde: 213,
          "Otilde;": 213,
          "Otimes;": 10807,
          Ouml: 214,
          "Ouml;": 214,
          "OverBar;": 8254,
          "OverBrace;": 9182,
          "OverBracket;": 9140,
          "OverParenthesis;": 9180,
          "PartialD;": 8706,
          "Pcy;": 1055,
          "Pfr;": [55349, 56595],
          "Phi;": 934,
          "Pi;": 928,
          "PlusMinus;": 177,
          "Poincareplane;": 8460,
          "Popf;": 8473,
          "Pr;": 10939,
          "Precedes;": 8826,
          "PrecedesEqual;": 10927,
          "PrecedesSlantEqual;": 8828,
          "PrecedesTilde;": 8830,
          "Prime;": 8243,
          "Product;": 8719,
          "Proportion;": 8759,
          "Proportional;": 8733,
          "Pscr;": [55349, 56491],
          "Psi;": 936,
          QUOT: 34,
          "QUOT;": 34,
          "Qfr;": [55349, 56596],
          "Qopf;": 8474,
          "Qscr;": [55349, 56492],
          "RBarr;": 10512,
          REG: 174,
          "REG;": 174,
          "Racute;": 340,
          "Rang;": 10219,
          "Rarr;": 8608,
          "Rarrtl;": 10518,
          "Rcaron;": 344,
          "Rcedil;": 342,
          "Rcy;": 1056,
          "Re;": 8476,
          "ReverseElement;": 8715,
          "ReverseEquilibrium;": 8651,
          "ReverseUpEquilibrium;": 10607,
          "Rfr;": 8476,
          "Rho;": 929,
          "RightAngleBracket;": 10217,
          "RightArrow;": 8594,
          "RightArrowBar;": 8677,
          "RightArrowLeftArrow;": 8644,
          "RightCeiling;": 8969,
          "RightDoubleBracket;": 10215,
          "RightDownTeeVector;": 10589,
          "RightDownVector;": 8642,
          "RightDownVectorBar;": 10581,
          "RightFloor;": 8971,
          "RightTee;": 8866,
          "RightTeeArrow;": 8614,
          "RightTeeVector;": 10587,
          "RightTriangle;": 8883,
          "RightTriangleBar;": 10704,
          "RightTriangleEqual;": 8885,
          "RightUpDownVector;": 10575,
          "RightUpTeeVector;": 10588,
          "RightUpVector;": 8638,
          "RightUpVectorBar;": 10580,
          "RightVector;": 8640,
          "RightVectorBar;": 10579,
          "Rightarrow;": 8658,
          "Ropf;": 8477,
          "RoundImplies;": 10608,
          "Rrightarrow;": 8667,
          "Rscr;": 8475,
          "Rsh;": 8625,
          "RuleDelayed;": 10740,
          "SHCHcy;": 1065,
          "SHcy;": 1064,
          "SOFTcy;": 1068,
          "Sacute;": 346,
          "Sc;": 10940,
          "Scaron;": 352,
          "Scedil;": 350,
          "Scirc;": 348,
          "Scy;": 1057,
          "Sfr;": [55349, 56598],
          "ShortDownArrow;": 8595,
          "ShortLeftArrow;": 8592,
          "ShortRightArrow;": 8594,
          "ShortUpArrow;": 8593,
          "Sigma;": 931,
          "SmallCircle;": 8728,
          "Sopf;": [55349, 56650],
          "Sqrt;": 8730,
          "Square;": 9633,
          "SquareIntersection;": 8851,
          "SquareSubset;": 8847,
          "SquareSubsetEqual;": 8849,
          "SquareSuperset;": 8848,
          "SquareSupersetEqual;": 8850,
          "SquareUnion;": 8852,
          "Sscr;": [55349, 56494],
          "Star;": 8902,
          "Sub;": 8912,
          "Subset;": 8912,
          "SubsetEqual;": 8838,
          "Succeeds;": 8827,
          "SucceedsEqual;": 10928,
          "SucceedsSlantEqual;": 8829,
          "SucceedsTilde;": 8831,
          "SuchThat;": 8715,
          "Sum;": 8721,
          "Sup;": 8913,
          "Superset;": 8835,
          "SupersetEqual;": 8839,
          "Supset;": 8913,
          THORN: 222,
          "THORN;": 222,
          "TRADE;": 8482,
          "TSHcy;": 1035,
          "TScy;": 1062,
          "Tab;": 9,
          "Tau;": 932,
          "Tcaron;": 356,
          "Tcedil;": 354,
          "Tcy;": 1058,
          "Tfr;": [55349, 56599],
          "Therefore;": 8756,
          "Theta;": 920,
          "ThickSpace;": [8287, 8202],
          "ThinSpace;": 8201,
          "Tilde;": 8764,
          "TildeEqual;": 8771,
          "TildeFullEqual;": 8773,
          "TildeTilde;": 8776,
          "Topf;": [55349, 56651],
          "TripleDot;": 8411,
          "Tscr;": [55349, 56495],
          "Tstrok;": 358,
          Uacute: 218,
          "Uacute;": 218,
          "Uarr;": 8607,
          "Uarrocir;": 10569,
          "Ubrcy;": 1038,
          "Ubreve;": 364,
          Ucirc: 219,
          "Ucirc;": 219,
          "Ucy;": 1059,
          "Udblac;": 368,
          "Ufr;": [55349, 56600],
          Ugrave: 217,
          "Ugrave;": 217,
          "Umacr;": 362,
          "UnderBar;": 95,
          "UnderBrace;": 9183,
          "UnderBracket;": 9141,
          "UnderParenthesis;": 9181,
          "Union;": 8899,
          "UnionPlus;": 8846,
          "Uogon;": 370,
          "Uopf;": [55349, 56652],
          "UpArrow;": 8593,
          "UpArrowBar;": 10514,
          "UpArrowDownArrow;": 8645,
          "UpDownArrow;": 8597,
          "UpEquilibrium;": 10606,
          "UpTee;": 8869,
          "UpTeeArrow;": 8613,
          "Uparrow;": 8657,
          "Updownarrow;": 8661,
          "UpperLeftArrow;": 8598,
          "UpperRightArrow;": 8599,
          "Upsi;": 978,
          "Upsilon;": 933,
          "Uring;": 366,
          "Uscr;": [55349, 56496],
          "Utilde;": 360,
          Uuml: 220,
          "Uuml;": 220,
          "VDash;": 8875,
          "Vbar;": 10987,
          "Vcy;": 1042,
          "Vdash;": 8873,
          "Vdashl;": 10982,
          "Vee;": 8897,
          "Verbar;": 8214,
          "Vert;": 8214,
          "VerticalBar;": 8739,
          "VerticalLine;": 124,
          "VerticalSeparator;": 10072,
          "VerticalTilde;": 8768,
          "VeryThinSpace;": 8202,
          "Vfr;": [55349, 56601],
          "Vopf;": [55349, 56653],
          "Vscr;": [55349, 56497],
          "Vvdash;": 8874,
          "Wcirc;": 372,
          "Wedge;": 8896,
          "Wfr;": [55349, 56602],
          "Wopf;": [55349, 56654],
          "Wscr;": [55349, 56498],
          "Xfr;": [55349, 56603],
          "Xi;": 926,
          "Xopf;": [55349, 56655],
          "Xscr;": [55349, 56499],
          "YAcy;": 1071,
          "YIcy;": 1031,
          "YUcy;": 1070,
          Yacute: 221,
          "Yacute;": 221,
          "Ycirc;": 374,
          "Ycy;": 1067,
          "Yfr;": [55349, 56604],
          "Yopf;": [55349, 56656],
          "Yscr;": [55349, 56500],
          "Yuml;": 376,
          "ZHcy;": 1046,
          "Zacute;": 377,
          "Zcaron;": 381,
          "Zcy;": 1047,
          "Zdot;": 379,
          "ZeroWidthSpace;": 8203,
          "Zeta;": 918,
          "Zfr;": 8488,
          "Zopf;": 8484,
          "Zscr;": [55349, 56501],
          aacute: 225,
          "aacute;": 225,
          "abreve;": 259,
          "ac;": 8766,
          "acE;": [8766, 819],
          "acd;": 8767,
          acirc: 226,
          "acirc;": 226,
          acute: 180,
          "acute;": 180,
          "acy;": 1072,
          aelig: 230,
          "aelig;": 230,
          "af;": 8289,
          "afr;": [55349, 56606],
          agrave: 224,
          "agrave;": 224,
          "alefsym;": 8501,
          "aleph;": 8501,
          "alpha;": 945,
          "amacr;": 257,
          "amalg;": 10815,
          amp: 38,
          "amp;": 38,
          "and;": 8743,
          "andand;": 10837,
          "andd;": 10844,
          "andslope;": 10840,
          "andv;": 10842,
          "ang;": 8736,
          "ange;": 10660,
          "angle;": 8736,
          "angmsd;": 8737,
          "angmsdaa;": 10664,
          "angmsdab;": 10665,
          "angmsdac;": 10666,
          "angmsdad;": 10667,
          "angmsdae;": 10668,
          "angmsdaf;": 10669,
          "angmsdag;": 10670,
          "angmsdah;": 10671,
          "angrt;": 8735,
          "angrtvb;": 8894,
          "angrtvbd;": 10653,
          "angsph;": 8738,
          "angst;": 197,
          "angzarr;": 9084,
          "aogon;": 261,
          "aopf;": [55349, 56658],
          "ap;": 8776,
          "apE;": 10864,
          "apacir;": 10863,
          "ape;": 8778,
          "apid;": 8779,
          "apos;": 39,
          "approx;": 8776,
          "approxeq;": 8778,
          aring: 229,
          "aring;": 229,
          "ascr;": [55349, 56502],
          "ast;": 42,
          "asymp;": 8776,
          "asympeq;": 8781,
          atilde: 227,
          "atilde;": 227,
          auml: 228,
          "auml;": 228,
          "awconint;": 8755,
          "awint;": 10769,
          "bNot;": 10989,
          "backcong;": 8780,
          "backepsilon;": 1014,
          "backprime;": 8245,
          "backsim;": 8765,
          "backsimeq;": 8909,
          "barvee;": 8893,
          "barwed;": 8965,
          "barwedge;": 8965,
          "bbrk;": 9141,
          "bbrktbrk;": 9142,
          "bcong;": 8780,
          "bcy;": 1073,
          "bdquo;": 8222,
          "becaus;": 8757,
          "because;": 8757,
          "bemptyv;": 10672,
          "bepsi;": 1014,
          "bernou;": 8492,
          "beta;": 946,
          "beth;": 8502,
          "between;": 8812,
          "bfr;": [55349, 56607],
          "bigcap;": 8898,
          "bigcirc;": 9711,
          "bigcup;": 8899,
          "bigodot;": 10752,
          "bigoplus;": 10753,
          "bigotimes;": 10754,
          "bigsqcup;": 10758,
          "bigstar;": 9733,
          "bigtriangledown;": 9661,
          "bigtriangleup;": 9651,
          "biguplus;": 10756,
          "bigvee;": 8897,
          "bigwedge;": 8896,
          "bkarow;": 10509,
          "blacklozenge;": 10731,
          "blacksquare;": 9642,
          "blacktriangle;": 9652,
          "blacktriangledown;": 9662,
          "blacktriangleleft;": 9666,
          "blacktriangleright;": 9656,
          "blank;": 9251,
          "blk12;": 9618,
          "blk14;": 9617,
          "blk34;": 9619,
          "block;": 9608,
          "bne;": [61, 8421],
          "bnequiv;": [8801, 8421],
          "bnot;": 8976,
          "bopf;": [55349, 56659],
          "bot;": 8869,
          "bottom;": 8869,
          "bowtie;": 8904,
          "boxDL;": 9559,
          "boxDR;": 9556,
          "boxDl;": 9558,
          "boxDr;": 9555,
          "boxH;": 9552,
          "boxHD;": 9574,
          "boxHU;": 9577,
          "boxHd;": 9572,
          "boxHu;": 9575,
          "boxUL;": 9565,
          "boxUR;": 9562,
          "boxUl;": 9564,
          "boxUr;": 9561,
          "boxV;": 9553,
          "boxVH;": 9580,
          "boxVL;": 9571,
          "boxVR;": 9568,
          "boxVh;": 9579,
          "boxVl;": 9570,
          "boxVr;": 9567,
          "boxbox;": 10697,
          "boxdL;": 9557,
          "boxdR;": 9554,
          "boxdl;": 9488,
          "boxdr;": 9484,
          "boxh;": 9472,
          "boxhD;": 9573,
          "boxhU;": 9576,
          "boxhd;": 9516,
          "boxhu;": 9524,
          "boxminus;": 8863,
          "boxplus;": 8862,
          "boxtimes;": 8864,
          "boxuL;": 9563,
          "boxuR;": 9560,
          "boxul;": 9496,
          "boxur;": 9492,
          "boxv;": 9474,
          "boxvH;": 9578,
          "boxvL;": 9569,
          "boxvR;": 9566,
          "boxvh;": 9532,
          "boxvl;": 9508,
          "boxvr;": 9500,
          "bprime;": 8245,
          "breve;": 728,
          brvbar: 166,
          "brvbar;": 166,
          "bscr;": [55349, 56503],
          "bsemi;": 8271,
          "bsim;": 8765,
          "bsime;": 8909,
          "bsol;": 92,
          "bsolb;": 10693,
          "bsolhsub;": 10184,
          "bull;": 8226,
          "bullet;": 8226,
          "bump;": 8782,
          "bumpE;": 10926,
          "bumpe;": 8783,
          "bumpeq;": 8783,
          "cacute;": 263,
          "cap;": 8745,
          "capand;": 10820,
          "capbrcup;": 10825,
          "capcap;": 10827,
          "capcup;": 10823,
          "capdot;": 10816,
          "caps;": [8745, 65024],
          "caret;": 8257,
          "caron;": 711,
          "ccaps;": 10829,
          "ccaron;": 269,
          ccedil: 231,
          "ccedil;": 231,
          "ccirc;": 265,
          "ccups;": 10828,
          "ccupssm;": 10832,
          "cdot;": 267,
          cedil: 184,
          "cedil;": 184,
          "cemptyv;": 10674,
          cent: 162,
          "cent;": 162,
          "centerdot;": 183,
          "cfr;": [55349, 56608],
          "chcy;": 1095,
          "check;": 10003,
          "checkmark;": 10003,
          "chi;": 967,
          "cir;": 9675,
          "cirE;": 10691,
          "circ;": 710,
          "circeq;": 8791,
          "circlearrowleft;": 8634,
          "circlearrowright;": 8635,
          "circledR;": 174,
          "circledS;": 9416,
          "circledast;": 8859,
          "circledcirc;": 8858,
          "circleddash;": 8861,
          "cire;": 8791,
          "cirfnint;": 10768,
          "cirmid;": 10991,
          "cirscir;": 10690,
          "clubs;": 9827,
          "clubsuit;": 9827,
          "colon;": 58,
          "colone;": 8788,
          "coloneq;": 8788,
          "comma;": 44,
          "commat;": 64,
          "comp;": 8705,
          "compfn;": 8728,
          "complement;": 8705,
          "complexes;": 8450,
          "cong;": 8773,
          "congdot;": 10861,
          "conint;": 8750,
          "copf;": [55349, 56660],
          "coprod;": 8720,
          copy: 169,
          "copy;": 169,
          "copysr;": 8471,
          "crarr;": 8629,
          "cross;": 10007,
          "cscr;": [55349, 56504],
          "csub;": 10959,
          "csube;": 10961,
          "csup;": 10960,
          "csupe;": 10962,
          "ctdot;": 8943,
          "cudarrl;": 10552,
          "cudarrr;": 10549,
          "cuepr;": 8926,
          "cuesc;": 8927,
          "cularr;": 8630,
          "cularrp;": 10557,
          "cup;": 8746,
          "cupbrcap;": 10824,
          "cupcap;": 10822,
          "cupcup;": 10826,
          "cupdot;": 8845,
          "cupor;": 10821,
          "cups;": [8746, 65024],
          "curarr;": 8631,
          "curarrm;": 10556,
          "curlyeqprec;": 8926,
          "curlyeqsucc;": 8927,
          "curlyvee;": 8910,
          "curlywedge;": 8911,
          curren: 164,
          "curren;": 164,
          "curvearrowleft;": 8630,
          "curvearrowright;": 8631,
          "cuvee;": 8910,
          "cuwed;": 8911,
          "cwconint;": 8754,
          "cwint;": 8753,
          "cylcty;": 9005,
          "dArr;": 8659,
          "dHar;": 10597,
          "dagger;": 8224,
          "daleth;": 8504,
          "darr;": 8595,
          "dash;": 8208,
          "dashv;": 8867,
          "dbkarow;": 10511,
          "dblac;": 733,
          "dcaron;": 271,
          "dcy;": 1076,
          "dd;": 8518,
          "ddagger;": 8225,
          "ddarr;": 8650,
          "ddotseq;": 10871,
          deg: 176,
          "deg;": 176,
          "delta;": 948,
          "demptyv;": 10673,
          "dfisht;": 10623,
          "dfr;": [55349, 56609],
          "dharl;": 8643,
          "dharr;": 8642,
          "diam;": 8900,
          "diamond;": 8900,
          "diamondsuit;": 9830,
          "diams;": 9830,
          "die;": 168,
          "digamma;": 989,
          "disin;": 8946,
          "div;": 247,
          divide: 247,
          "divide;": 247,
          "divideontimes;": 8903,
          "divonx;": 8903,
          "djcy;": 1106,
          "dlcorn;": 8990,
          "dlcrop;": 8973,
          "dollar;": 36,
          "dopf;": [55349, 56661],
          "dot;": 729,
          "doteq;": 8784,
          "doteqdot;": 8785,
          "dotminus;": 8760,
          "dotplus;": 8724,
          "dotsquare;": 8865,
          "doublebarwedge;": 8966,
          "downarrow;": 8595,
          "downdownarrows;": 8650,
          "downharpoonleft;": 8643,
          "downharpoonright;": 8642,
          "drbkarow;": 10512,
          "drcorn;": 8991,
          "drcrop;": 8972,
          "dscr;": [55349, 56505],
          "dscy;": 1109,
          "dsol;": 10742,
          "dstrok;": 273,
          "dtdot;": 8945,
          "dtri;": 9663,
          "dtrif;": 9662,
          "duarr;": 8693,
          "duhar;": 10607,
          "dwangle;": 10662,
          "dzcy;": 1119,
          "dzigrarr;": 10239,
          "eDDot;": 10871,
          "eDot;": 8785,
          eacute: 233,
          "eacute;": 233,
          "easter;": 10862,
          "ecaron;": 283,
          "ecir;": 8790,
          ecirc: 234,
          "ecirc;": 234,
          "ecolon;": 8789,
          "ecy;": 1101,
          "edot;": 279,
          "ee;": 8519,
          "efDot;": 8786,
          "efr;": [55349, 56610],
          "eg;": 10906,
          egrave: 232,
          "egrave;": 232,
          "egs;": 10902,
          "egsdot;": 10904,
          "el;": 10905,
          "elinters;": 9191,
          "ell;": 8467,
          "els;": 10901,
          "elsdot;": 10903,
          "emacr;": 275,
          "empty;": 8709,
          "emptyset;": 8709,
          "emptyv;": 8709,
          "emsp13;": 8196,
          "emsp14;": 8197,
          "emsp;": 8195,
          "eng;": 331,
          "ensp;": 8194,
          "eogon;": 281,
          "eopf;": [55349, 56662],
          "epar;": 8917,
          "eparsl;": 10723,
          "eplus;": 10865,
          "epsi;": 949,
          "epsilon;": 949,
          "epsiv;": 1013,
          "eqcirc;": 8790,
          "eqcolon;": 8789,
          "eqsim;": 8770,
          "eqslantgtr;": 10902,
          "eqslantless;": 10901,
          "equals;": 61,
          "equest;": 8799,
          "equiv;": 8801,
          "equivDD;": 10872,
          "eqvparsl;": 10725,
          "erDot;": 8787,
          "erarr;": 10609,
          "escr;": 8495,
          "esdot;": 8784,
          "esim;": 8770,
          "eta;": 951,
          eth: 240,
          "eth;": 240,
          euml: 235,
          "euml;": 235,
          "euro;": 8364,
          "excl;": 33,
          "exist;": 8707,
          "expectation;": 8496,
          "exponentiale;": 8519,
          "fallingdotseq;": 8786,
          "fcy;": 1092,
          "female;": 9792,
          "ffilig;": 64259,
          "fflig;": 64256,
          "ffllig;": 64260,
          "ffr;": [55349, 56611],
          "filig;": 64257,
          "fjlig;": [102, 106],
          "flat;": 9837,
          "fllig;": 64258,
          "fltns;": 9649,
          "fnof;": 402,
          "fopf;": [55349, 56663],
          "forall;": 8704,
          "fork;": 8916,
          "forkv;": 10969,
          "fpartint;": 10765,
          frac12: 189,
          "frac12;": 189,
          "frac13;": 8531,
          frac14: 188,
          "frac14;": 188,
          "frac15;": 8533,
          "frac16;": 8537,
          "frac18;": 8539,
          "frac23;": 8532,
          "frac25;": 8534,
          frac34: 190,
          "frac34;": 190,
          "frac35;": 8535,
          "frac38;": 8540,
          "frac45;": 8536,
          "frac56;": 8538,
          "frac58;": 8541,
          "frac78;": 8542,
          "frasl;": 8260,
          "frown;": 8994,
          "fscr;": [55349, 56507],
          "gE;": 8807,
          "gEl;": 10892,
          "gacute;": 501,
          "gamma;": 947,
          "gammad;": 989,
          "gap;": 10886,
          "gbreve;": 287,
          "gcirc;": 285,
          "gcy;": 1075,
          "gdot;": 289,
          "ge;": 8805,
          "gel;": 8923,
          "geq;": 8805,
          "geqq;": 8807,
          "geqslant;": 10878,
          "ges;": 10878,
          "gescc;": 10921,
          "gesdot;": 10880,
          "gesdoto;": 10882,
          "gesdotol;": 10884,
          "gesl;": [8923, 65024],
          "gesles;": 10900,
          "gfr;": [55349, 56612],
          "gg;": 8811,
          "ggg;": 8921,
          "gimel;": 8503,
          "gjcy;": 1107,
          "gl;": 8823,
          "glE;": 10898,
          "gla;": 10917,
          "glj;": 10916,
          "gnE;": 8809,
          "gnap;": 10890,
          "gnapprox;": 10890,
          "gne;": 10888,
          "gneq;": 10888,
          "gneqq;": 8809,
          "gnsim;": 8935,
          "gopf;": [55349, 56664],
          "grave;": 96,
          "gscr;": 8458,
          "gsim;": 8819,
          "gsime;": 10894,
          "gsiml;": 10896,
          gt: 62,
          "gt;": 62,
          "gtcc;": 10919,
          "gtcir;": 10874,
          "gtdot;": 8919,
          "gtlPar;": 10645,
          "gtquest;": 10876,
          "gtrapprox;": 10886,
          "gtrarr;": 10616,
          "gtrdot;": 8919,
          "gtreqless;": 8923,
          "gtreqqless;": 10892,
          "gtrless;": 8823,
          "gtrsim;": 8819,
          "gvertneqq;": [8809, 65024],
          "gvnE;": [8809, 65024],
          "hArr;": 8660,
          "hairsp;": 8202,
          "half;": 189,
          "hamilt;": 8459,
          "hardcy;": 1098,
          "harr;": 8596,
          "harrcir;": 10568,
          "harrw;": 8621,
          "hbar;": 8463,
          "hcirc;": 293,
          "hearts;": 9829,
          "heartsuit;": 9829,
          "hellip;": 8230,
          "hercon;": 8889,
          "hfr;": [55349, 56613],
          "hksearow;": 10533,
          "hkswarow;": 10534,
          "hoarr;": 8703,
          "homtht;": 8763,
          "hookleftarrow;": 8617,
          "hookrightarrow;": 8618,
          "hopf;": [55349, 56665],
          "horbar;": 8213,
          "hscr;": [55349, 56509],
          "hslash;": 8463,
          "hstrok;": 295,
          "hybull;": 8259,
          "hyphen;": 8208,
          iacute: 237,
          "iacute;": 237,
          "ic;": 8291,
          icirc: 238,
          "icirc;": 238,
          "icy;": 1080,
          "iecy;": 1077,
          iexcl: 161,
          "iexcl;": 161,
          "iff;": 8660,
          "ifr;": [55349, 56614],
          igrave: 236,
          "igrave;": 236,
          "ii;": 8520,
          "iiiint;": 10764,
          "iiint;": 8749,
          "iinfin;": 10716,
          "iiota;": 8489,
          "ijlig;": 307,
          "imacr;": 299,
          "image;": 8465,
          "imagline;": 8464,
          "imagpart;": 8465,
          "imath;": 305,
          "imof;": 8887,
          "imped;": 437,
          "in;": 8712,
          "incare;": 8453,
          "infin;": 8734,
          "infintie;": 10717,
          "inodot;": 305,
          "int;": 8747,
          "intcal;": 8890,
          "integers;": 8484,
          "intercal;": 8890,
          "intlarhk;": 10775,
          "intprod;": 10812,
          "iocy;": 1105,
          "iogon;": 303,
          "iopf;": [55349, 56666],
          "iota;": 953,
          "iprod;": 10812,
          iquest: 191,
          "iquest;": 191,
          "iscr;": [55349, 56510],
          "isin;": 8712,
          "isinE;": 8953,
          "isindot;": 8949,
          "isins;": 8948,
          "isinsv;": 8947,
          "isinv;": 8712,
          "it;": 8290,
          "itilde;": 297,
          "iukcy;": 1110,
          iuml: 239,
          "iuml;": 239,
          "jcirc;": 309,
          "jcy;": 1081,
          "jfr;": [55349, 56615],
          "jmath;": 567,
          "jopf;": [55349, 56667],
          "jscr;": [55349, 56511],
          "jsercy;": 1112,
          "jukcy;": 1108,
          "kappa;": 954,
          "kappav;": 1008,
          "kcedil;": 311,
          "kcy;": 1082,
          "kfr;": [55349, 56616],
          "kgreen;": 312,
          "khcy;": 1093,
          "kjcy;": 1116,
          "kopf;": [55349, 56668],
          "kscr;": [55349, 56512],
          "lAarr;": 8666,
          "lArr;": 8656,
          "lAtail;": 10523,
          "lBarr;": 10510,
          "lE;": 8806,
          "lEg;": 10891,
          "lHar;": 10594,
          "lacute;": 314,
          "laemptyv;": 10676,
          "lagran;": 8466,
          "lambda;": 955,
          "lang;": 10216,
          "langd;": 10641,
          "langle;": 10216,
          "lap;": 10885,
          laquo: 171,
          "laquo;": 171,
          "larr;": 8592,
          "larrb;": 8676,
          "larrbfs;": 10527,
          "larrfs;": 10525,
          "larrhk;": 8617,
          "larrlp;": 8619,
          "larrpl;": 10553,
          "larrsim;": 10611,
          "larrtl;": 8610,
          "lat;": 10923,
          "latail;": 10521,
          "late;": 10925,
          "lates;": [10925, 65024],
          "lbarr;": 10508,
          "lbbrk;": 10098,
          "lbrace;": 123,
          "lbrack;": 91,
          "lbrke;": 10635,
          "lbrksld;": 10639,
          "lbrkslu;": 10637,
          "lcaron;": 318,
          "lcedil;": 316,
          "lceil;": 8968,
          "lcub;": 123,
          "lcy;": 1083,
          "ldca;": 10550,
          "ldquo;": 8220,
          "ldquor;": 8222,
          "ldrdhar;": 10599,
          "ldrushar;": 10571,
          "ldsh;": 8626,
          "le;": 8804,
          "leftarrow;": 8592,
          "leftarrowtail;": 8610,
          "leftharpoondown;": 8637,
          "leftharpoonup;": 8636,
          "leftleftarrows;": 8647,
          "leftrightarrow;": 8596,
          "leftrightarrows;": 8646,
          "leftrightharpoons;": 8651,
          "leftrightsquigarrow;": 8621,
          "leftthreetimes;": 8907,
          "leg;": 8922,
          "leq;": 8804,
          "leqq;": 8806,
          "leqslant;": 10877,
          "les;": 10877,
          "lescc;": 10920,
          "lesdot;": 10879,
          "lesdoto;": 10881,
          "lesdotor;": 10883,
          "lesg;": [8922, 65024],
          "lesges;": 10899,
          "lessapprox;": 10885,
          "lessdot;": 8918,
          "lesseqgtr;": 8922,
          "lesseqqgtr;": 10891,
          "lessgtr;": 8822,
          "lesssim;": 8818,
          "lfisht;": 10620,
          "lfloor;": 8970,
          "lfr;": [55349, 56617],
          "lg;": 8822,
          "lgE;": 10897,
          "lhard;": 8637,
          "lharu;": 8636,
          "lharul;": 10602,
          "lhblk;": 9604,
          "ljcy;": 1113,
          "ll;": 8810,
          "llarr;": 8647,
          "llcorner;": 8990,
          "llhard;": 10603,
          "lltri;": 9722,
          "lmidot;": 320,
          "lmoust;": 9136,
          "lmoustache;": 9136,
          "lnE;": 8808,
          "lnap;": 10889,
          "lnapprox;": 10889,
          "lne;": 10887,
          "lneq;": 10887,
          "lneqq;": 8808,
          "lnsim;": 8934,
          "loang;": 10220,
          "loarr;": 8701,
          "lobrk;": 10214,
          "longleftarrow;": 10229,
          "longleftrightarrow;": 10231,
          "longmapsto;": 10236,
          "longrightarrow;": 10230,
          "looparrowleft;": 8619,
          "looparrowright;": 8620,
          "lopar;": 10629,
          "lopf;": [55349, 56669],
          "loplus;": 10797,
          "lotimes;": 10804,
          "lowast;": 8727,
          "lowbar;": 95,
          "loz;": 9674,
          "lozenge;": 9674,
          "lozf;": 10731,
          "lpar;": 40,
          "lparlt;": 10643,
          "lrarr;": 8646,
          "lrcorner;": 8991,
          "lrhar;": 8651,
          "lrhard;": 10605,
          "lrm;": 8206,
          "lrtri;": 8895,
          "lsaquo;": 8249,
          "lscr;": [55349, 56513],
          "lsh;": 8624,
          "lsim;": 8818,
          "lsime;": 10893,
          "lsimg;": 10895,
          "lsqb;": 91,
          "lsquo;": 8216,
          "lsquor;": 8218,
          "lstrok;": 322,
          lt: 60,
          "lt;": 60,
          "ltcc;": 10918,
          "ltcir;": 10873,
          "ltdot;": 8918,
          "lthree;": 8907,
          "ltimes;": 8905,
          "ltlarr;": 10614,
          "ltquest;": 10875,
          "ltrPar;": 10646,
          "ltri;": 9667,
          "ltrie;": 8884,
          "ltrif;": 9666,
          "lurdshar;": 10570,
          "luruhar;": 10598,
          "lvertneqq;": [8808, 65024],
          "lvnE;": [8808, 65024],
          "mDDot;": 8762,
          macr: 175,
          "macr;": 175,
          "male;": 9794,
          "malt;": 10016,
          "maltese;": 10016,
          "map;": 8614,
          "mapsto;": 8614,
          "mapstodown;": 8615,
          "mapstoleft;": 8612,
          "mapstoup;": 8613,
          "marker;": 9646,
          "mcomma;": 10793,
          "mcy;": 1084,
          "mdash;": 8212,
          "measuredangle;": 8737,
          "mfr;": [55349, 56618],
          "mho;": 8487,
          micro: 181,
          "micro;": 181,
          "mid;": 8739,
          "midast;": 42,
          "midcir;": 10992,
          middot: 183,
          "middot;": 183,
          "minus;": 8722,
          "minusb;": 8863,
          "minusd;": 8760,
          "minusdu;": 10794,
          "mlcp;": 10971,
          "mldr;": 8230,
          "mnplus;": 8723,
          "models;": 8871,
          "mopf;": [55349, 56670],
          "mp;": 8723,
          "mscr;": [55349, 56514],
          "mstpos;": 8766,
          "mu;": 956,
          "multimap;": 8888,
          "mumap;": 8888,
          "nGg;": [8921, 824],
          "nGt;": [8811, 8402],
          "nGtv;": [8811, 824],
          "nLeftarrow;": 8653,
          "nLeftrightarrow;": 8654,
          "nLl;": [8920, 824],
          "nLt;": [8810, 8402],
          "nLtv;": [8810, 824],
          "nRightarrow;": 8655,
          "nVDash;": 8879,
          "nVdash;": 8878,
          "nabla;": 8711,
          "nacute;": 324,
          "nang;": [8736, 8402],
          "nap;": 8777,
          "napE;": [10864, 824],
          "napid;": [8779, 824],
          "napos;": 329,
          "napprox;": 8777,
          "natur;": 9838,
          "natural;": 9838,
          "naturals;": 8469,
          nbsp: 160,
          "nbsp;": 160,
          "nbump;": [8782, 824],
          "nbumpe;": [8783, 824],
          "ncap;": 10819,
          "ncaron;": 328,
          "ncedil;": 326,
          "ncong;": 8775,
          "ncongdot;": [10861, 824],
          "ncup;": 10818,
          "ncy;": 1085,
          "ndash;": 8211,
          "ne;": 8800,
          "neArr;": 8663,
          "nearhk;": 10532,
          "nearr;": 8599,
          "nearrow;": 8599,
          "nedot;": [8784, 824],
          "nequiv;": 8802,
          "nesear;": 10536,
          "nesim;": [8770, 824],
          "nexist;": 8708,
          "nexists;": 8708,
          "nfr;": [55349, 56619],
          "ngE;": [8807, 824],
          "nge;": 8817,
          "ngeq;": 8817,
          "ngeqq;": [8807, 824],
          "ngeqslant;": [10878, 824],
          "nges;": [10878, 824],
          "ngsim;": 8821,
          "ngt;": 8815,
          "ngtr;": 8815,
          "nhArr;": 8654,
          "nharr;": 8622,
          "nhpar;": 10994,
          "ni;": 8715,
          "nis;": 8956,
          "nisd;": 8954,
          "niv;": 8715,
          "njcy;": 1114,
          "nlArr;": 8653,
          "nlE;": [8806, 824],
          "nlarr;": 8602,
          "nldr;": 8229,
          "nle;": 8816,
          "nleftarrow;": 8602,
          "nleftrightarrow;": 8622,
          "nleq;": 8816,
          "nleqq;": [8806, 824],
          "nleqslant;": [10877, 824],
          "nles;": [10877, 824],
          "nless;": 8814,
          "nlsim;": 8820,
          "nlt;": 8814,
          "nltri;": 8938,
          "nltrie;": 8940,
          "nmid;": 8740,
          "nopf;": [55349, 56671],
          not: 172,
          "not;": 172,
          "notin;": 8713,
          "notinE;": [8953, 824],
          "notindot;": [8949, 824],
          "notinva;": 8713,
          "notinvb;": 8951,
          "notinvc;": 8950,
          "notni;": 8716,
          "notniva;": 8716,
          "notnivb;": 8958,
          "notnivc;": 8957,
          "npar;": 8742,
          "nparallel;": 8742,
          "nparsl;": [11005, 8421],
          "npart;": [8706, 824],
          "npolint;": 10772,
          "npr;": 8832,
          "nprcue;": 8928,
          "npre;": [10927, 824],
          "nprec;": 8832,
          "npreceq;": [10927, 824],
          "nrArr;": 8655,
          "nrarr;": 8603,
          "nrarrc;": [10547, 824],
          "nrarrw;": [8605, 824],
          "nrightarrow;": 8603,
          "nrtri;": 8939,
          "nrtrie;": 8941,
          "nsc;": 8833,
          "nsccue;": 8929,
          "nsce;": [10928, 824],
          "nscr;": [55349, 56515],
          "nshortmid;": 8740,
          "nshortparallel;": 8742,
          "nsim;": 8769,
          "nsime;": 8772,
          "nsimeq;": 8772,
          "nsmid;": 8740,
          "nspar;": 8742,
          "nsqsube;": 8930,
          "nsqsupe;": 8931,
          "nsub;": 8836,
          "nsubE;": [10949, 824],
          "nsube;": 8840,
          "nsubset;": [8834, 8402],
          "nsubseteq;": 8840,
          "nsubseteqq;": [10949, 824],
          "nsucc;": 8833,
          "nsucceq;": [10928, 824],
          "nsup;": 8837,
          "nsupE;": [10950, 824],
          "nsupe;": 8841,
          "nsupset;": [8835, 8402],
          "nsupseteq;": 8841,
          "nsupseteqq;": [10950, 824],
          "ntgl;": 8825,
          ntilde: 241,
          "ntilde;": 241,
          "ntlg;": 8824,
          "ntriangleleft;": 8938,
          "ntrianglelefteq;": 8940,
          "ntriangleright;": 8939,
          "ntrianglerighteq;": 8941,
          "nu;": 957,
          "num;": 35,
          "numero;": 8470,
          "numsp;": 8199,
          "nvDash;": 8877,
          "nvHarr;": 10500,
          "nvap;": [8781, 8402],
          "nvdash;": 8876,
          "nvge;": [8805, 8402],
          "nvgt;": [62, 8402],
          "nvinfin;": 10718,
          "nvlArr;": 10498,
          "nvle;": [8804, 8402],
          "nvlt;": [60, 8402],
          "nvltrie;": [8884, 8402],
          "nvrArr;": 10499,
          "nvrtrie;": [8885, 8402],
          "nvsim;": [8764, 8402],
          "nwArr;": 8662,
          "nwarhk;": 10531,
          "nwarr;": 8598,
          "nwarrow;": 8598,
          "nwnear;": 10535,
          "oS;": 9416,
          oacute: 243,
          "oacute;": 243,
          "oast;": 8859,
          "ocir;": 8858,
          ocirc: 244,
          "ocirc;": 244,
          "ocy;": 1086,
          "odash;": 8861,
          "odblac;": 337,
          "odiv;": 10808,
          "odot;": 8857,
          "odsold;": 10684,
          "oelig;": 339,
          "ofcir;": 10687,
          "ofr;": [55349, 56620],
          "ogon;": 731,
          ograve: 242,
          "ograve;": 242,
          "ogt;": 10689,
          "ohbar;": 10677,
          "ohm;": 937,
          "oint;": 8750,
          "olarr;": 8634,
          "olcir;": 10686,
          "olcross;": 10683,
          "oline;": 8254,
          "olt;": 10688,
          "omacr;": 333,
          "omega;": 969,
          "omicron;": 959,
          "omid;": 10678,
          "ominus;": 8854,
          "oopf;": [55349, 56672],
          "opar;": 10679,
          "operp;": 10681,
          "oplus;": 8853,
          "or;": 8744,
          "orarr;": 8635,
          "ord;": 10845,
          "order;": 8500,
          "orderof;": 8500,
          ordf: 170,
          "ordf;": 170,
          ordm: 186,
          "ordm;": 186,
          "origof;": 8886,
          "oror;": 10838,
          "orslope;": 10839,
          "orv;": 10843,
          "oscr;": 8500,
          oslash: 248,
          "oslash;": 248,
          "osol;": 8856,
          otilde: 245,
          "otilde;": 245,
          "otimes;": 8855,
          "otimesas;": 10806,
          ouml: 246,
          "ouml;": 246,
          "ovbar;": 9021,
          "par;": 8741,
          para: 182,
          "para;": 182,
          "parallel;": 8741,
          "parsim;": 10995,
          "parsl;": 11005,
          "part;": 8706,
          "pcy;": 1087,
          "percnt;": 37,
          "period;": 46,
          "permil;": 8240,
          "perp;": 8869,
          "pertenk;": 8241,
          "pfr;": [55349, 56621],
          "phi;": 966,
          "phiv;": 981,
          "phmmat;": 8499,
          "phone;": 9742,
          "pi;": 960,
          "pitchfork;": 8916,
          "piv;": 982,
          "planck;": 8463,
          "planckh;": 8462,
          "plankv;": 8463,
          "plus;": 43,
          "plusacir;": 10787,
          "plusb;": 8862,
          "pluscir;": 10786,
          "plusdo;": 8724,
          "plusdu;": 10789,
          "pluse;": 10866,
          plusmn: 177,
          "plusmn;": 177,
          "plussim;": 10790,
          "plustwo;": 10791,
          "pm;": 177,
          "pointint;": 10773,
          "popf;": [55349, 56673],
          pound: 163,
          "pound;": 163,
          "pr;": 8826,
          "prE;": 10931,
          "prap;": 10935,
          "prcue;": 8828,
          "pre;": 10927,
          "prec;": 8826,
          "precapprox;": 10935,
          "preccurlyeq;": 8828,
          "preceq;": 10927,
          "precnapprox;": 10937,
          "precneqq;": 10933,
          "precnsim;": 8936,
          "precsim;": 8830,
          "prime;": 8242,
          "primes;": 8473,
          "prnE;": 10933,
          "prnap;": 10937,
          "prnsim;": 8936,
          "prod;": 8719,
          "profalar;": 9006,
          "profline;": 8978,
          "profsurf;": 8979,
          "prop;": 8733,
          "propto;": 8733,
          "prsim;": 8830,
          "prurel;": 8880,
          "pscr;": [55349, 56517],
          "psi;": 968,
          "puncsp;": 8200,
          "qfr;": [55349, 56622],
          "qint;": 10764,
          "qopf;": [55349, 56674],
          "qprime;": 8279,
          "qscr;": [55349, 56518],
          "quaternions;": 8461,
          "quatint;": 10774,
          "quest;": 63,
          "questeq;": 8799,
          quot: 34,
          "quot;": 34,
          "rAarr;": 8667,
          "rArr;": 8658,
          "rAtail;": 10524,
          "rBarr;": 10511,
          "rHar;": 10596,
          "race;": [8765, 817],
          "racute;": 341,
          "radic;": 8730,
          "raemptyv;": 10675,
          "rang;": 10217,
          "rangd;": 10642,
          "range;": 10661,
          "rangle;": 10217,
          raquo: 187,
          "raquo;": 187,
          "rarr;": 8594,
          "rarrap;": 10613,
          "rarrb;": 8677,
          "rarrbfs;": 10528,
          "rarrc;": 10547,
          "rarrfs;": 10526,
          "rarrhk;": 8618,
          "rarrlp;": 8620,
          "rarrpl;": 10565,
          "rarrsim;": 10612,
          "rarrtl;": 8611,
          "rarrw;": 8605,
          "ratail;": 10522,
          "ratio;": 8758,
          "rationals;": 8474,
          "rbarr;": 10509,
          "rbbrk;": 10099,
          "rbrace;": 125,
          "rbrack;": 93,
          "rbrke;": 10636,
          "rbrksld;": 10638,
          "rbrkslu;": 10640,
          "rcaron;": 345,
          "rcedil;": 343,
          "rceil;": 8969,
          "rcub;": 125,
          "rcy;": 1088,
          "rdca;": 10551,
          "rdldhar;": 10601,
          "rdquo;": 8221,
          "rdquor;": 8221,
          "rdsh;": 8627,
          "real;": 8476,
          "realine;": 8475,
          "realpart;": 8476,
          "reals;": 8477,
          "rect;": 9645,
          reg: 174,
          "reg;": 174,
          "rfisht;": 10621,
          "rfloor;": 8971,
          "rfr;": [55349, 56623],
          "rhard;": 8641,
          "rharu;": 8640,
          "rharul;": 10604,
          "rho;": 961,
          "rhov;": 1009,
          "rightarrow;": 8594,
          "rightarrowtail;": 8611,
          "rightharpoondown;": 8641,
          "rightharpoonup;": 8640,
          "rightleftarrows;": 8644,
          "rightleftharpoons;": 8652,
          "rightrightarrows;": 8649,
          "rightsquigarrow;": 8605,
          "rightthreetimes;": 8908,
          "ring;": 730,
          "risingdotseq;": 8787,
          "rlarr;": 8644,
          "rlhar;": 8652,
          "rlm;": 8207,
          "rmoust;": 9137,
          "rmoustache;": 9137,
          "rnmid;": 10990,
          "roang;": 10221,
          "roarr;": 8702,
          "robrk;": 10215,
          "ropar;": 10630,
          "ropf;": [55349, 56675],
          "roplus;": 10798,
          "rotimes;": 10805,
          "rpar;": 41,
          "rpargt;": 10644,
          "rppolint;": 10770,
          "rrarr;": 8649,
          "rsaquo;": 8250,
          "rscr;": [55349, 56519],
          "rsh;": 8625,
          "rsqb;": 93,
          "rsquo;": 8217,
          "rsquor;": 8217,
          "rthree;": 8908,
          "rtimes;": 8906,
          "rtri;": 9657,
          "rtrie;": 8885,
          "rtrif;": 9656,
          "rtriltri;": 10702,
          "ruluhar;": 10600,
          "rx;": 8478,
          "sacute;": 347,
          "sbquo;": 8218,
          "sc;": 8827,
          "scE;": 10932,
          "scap;": 10936,
          "scaron;": 353,
          "sccue;": 8829,
          "sce;": 10928,
          "scedil;": 351,
          "scirc;": 349,
          "scnE;": 10934,
          "scnap;": 10938,
          "scnsim;": 8937,
          "scpolint;": 10771,
          "scsim;": 8831,
          "scy;": 1089,
          "sdot;": 8901,
          "sdotb;": 8865,
          "sdote;": 10854,
          "seArr;": 8664,
          "searhk;": 10533,
          "searr;": 8600,
          "searrow;": 8600,
          sect: 167,
          "sect;": 167,
          "semi;": 59,
          "seswar;": 10537,
          "setminus;": 8726,
          "setmn;": 8726,
          "sext;": 10038,
          "sfr;": [55349, 56624],
          "sfrown;": 8994,
          "sharp;": 9839,
          "shchcy;": 1097,
          "shcy;": 1096,
          "shortmid;": 8739,
          "shortparallel;": 8741,
          shy: 173,
          "shy;": 173,
          "sigma;": 963,
          "sigmaf;": 962,
          "sigmav;": 962,
          "sim;": 8764,
          "simdot;": 10858,
          "sime;": 8771,
          "simeq;": 8771,
          "simg;": 10910,
          "simgE;": 10912,
          "siml;": 10909,
          "simlE;": 10911,
          "simne;": 8774,
          "simplus;": 10788,
          "simrarr;": 10610,
          "slarr;": 8592,
          "smallsetminus;": 8726,
          "smashp;": 10803,
          "smeparsl;": 10724,
          "smid;": 8739,
          "smile;": 8995,
          "smt;": 10922,
          "smte;": 10924,
          "smtes;": [10924, 65024],
          "softcy;": 1100,
          "sol;": 47,
          "solb;": 10692,
          "solbar;": 9023,
          "sopf;": [55349, 56676],
          "spades;": 9824,
          "spadesuit;": 9824,
          "spar;": 8741,
          "sqcap;": 8851,
          "sqcaps;": [8851, 65024],
          "sqcup;": 8852,
          "sqcups;": [8852, 65024],
          "sqsub;": 8847,
          "sqsube;": 8849,
          "sqsubset;": 8847,
          "sqsubseteq;": 8849,
          "sqsup;": 8848,
          "sqsupe;": 8850,
          "sqsupset;": 8848,
          "sqsupseteq;": 8850,
          "squ;": 9633,
          "square;": 9633,
          "squarf;": 9642,
          "squf;": 9642,
          "srarr;": 8594,
          "sscr;": [55349, 56520],
          "ssetmn;": 8726,
          "ssmile;": 8995,
          "sstarf;": 8902,
          "star;": 9734,
          "starf;": 9733,
          "straightepsilon;": 1013,
          "straightphi;": 981,
          "strns;": 175,
          "sub;": 8834,
          "subE;": 10949,
          "subdot;": 10941,
          "sube;": 8838,
          "subedot;": 10947,
          "submult;": 10945,
          "subnE;": 10955,
          "subne;": 8842,
          "subplus;": 10943,
          "subrarr;": 10617,
          "subset;": 8834,
          "subseteq;": 8838,
          "subseteqq;": 10949,
          "subsetneq;": 8842,
          "subsetneqq;": 10955,
          "subsim;": 10951,
          "subsub;": 10965,
          "subsup;": 10963,
          "succ;": 8827,
          "succapprox;": 10936,
          "succcurlyeq;": 8829,
          "succeq;": 10928,
          "succnapprox;": 10938,
          "succneqq;": 10934,
          "succnsim;": 8937,
          "succsim;": 8831,
          "sum;": 8721,
          "sung;": 9834,
          sup1: 185,
          "sup1;": 185,
          sup2: 178,
          "sup2;": 178,
          sup3: 179,
          "sup3;": 179,
          "sup;": 8835,
          "supE;": 10950,
          "supdot;": 10942,
          "supdsub;": 10968,
          "supe;": 8839,
          "supedot;": 10948,
          "suphsol;": 10185,
          "suphsub;": 10967,
          "suplarr;": 10619,
          "supmult;": 10946,
          "supnE;": 10956,
          "supne;": 8843,
          "supplus;": 10944,
          "supset;": 8835,
          "supseteq;": 8839,
          "supseteqq;": 10950,
          "supsetneq;": 8843,
          "supsetneqq;": 10956,
          "supsim;": 10952,
          "supsub;": 10964,
          "supsup;": 10966,
          "swArr;": 8665,
          "swarhk;": 10534,
          "swarr;": 8601,
          "swarrow;": 8601,
          "swnwar;": 10538,
          szlig: 223,
          "szlig;": 223,
          "target;": 8982,
          "tau;": 964,
          "tbrk;": 9140,
          "tcaron;": 357,
          "tcedil;": 355,
          "tcy;": 1090,
          "tdot;": 8411,
          "telrec;": 8981,
          "tfr;": [55349, 56625],
          "there4;": 8756,
          "therefore;": 8756,
          "theta;": 952,
          "thetasym;": 977,
          "thetav;": 977,
          "thickapprox;": 8776,
          "thicksim;": 8764,
          "thinsp;": 8201,
          "thkap;": 8776,
          "thksim;": 8764,
          thorn: 254,
          "thorn;": 254,
          "tilde;": 732,
          times: 215,
          "times;": 215,
          "timesb;": 8864,
          "timesbar;": 10801,
          "timesd;": 10800,
          "tint;": 8749,
          "toea;": 10536,
          "top;": 8868,
          "topbot;": 9014,
          "topcir;": 10993,
          "topf;": [55349, 56677],
          "topfork;": 10970,
          "tosa;": 10537,
          "tprime;": 8244,
          "trade;": 8482,
          "triangle;": 9653,
          "triangledown;": 9663,
          "triangleleft;": 9667,
          "trianglelefteq;": 8884,
          "triangleq;": 8796,
          "triangleright;": 9657,
          "trianglerighteq;": 8885,
          "tridot;": 9708,
          "trie;": 8796,
          "triminus;": 10810,
          "triplus;": 10809,
          "trisb;": 10701,
          "tritime;": 10811,
          "trpezium;": 9186,
          "tscr;": [55349, 56521],
          "tscy;": 1094,
          "tshcy;": 1115,
          "tstrok;": 359,
          "twixt;": 8812,
          "twoheadleftarrow;": 8606,
          "twoheadrightarrow;": 8608,
          "uArr;": 8657,
          "uHar;": 10595,
          uacute: 250,
          "uacute;": 250,
          "uarr;": 8593,
          "ubrcy;": 1118,
          "ubreve;": 365,
          ucirc: 251,
          "ucirc;": 251,
          "ucy;": 1091,
          "udarr;": 8645,
          "udblac;": 369,
          "udhar;": 10606,
          "ufisht;": 10622,
          "ufr;": [55349, 56626],
          ugrave: 249,
          "ugrave;": 249,
          "uharl;": 8639,
          "uharr;": 8638,
          "uhblk;": 9600,
          "ulcorn;": 8988,
          "ulcorner;": 8988,
          "ulcrop;": 8975,
          "ultri;": 9720,
          "umacr;": 363,
          uml: 168,
          "uml;": 168,
          "uogon;": 371,
          "uopf;": [55349, 56678],
          "uparrow;": 8593,
          "updownarrow;": 8597,
          "upharpoonleft;": 8639,
          "upharpoonright;": 8638,
          "uplus;": 8846,
          "upsi;": 965,
          "upsih;": 978,
          "upsilon;": 965,
          "upuparrows;": 8648,
          "urcorn;": 8989,
          "urcorner;": 8989,
          "urcrop;": 8974,
          "uring;": 367,
          "urtri;": 9721,
          "uscr;": [55349, 56522],
          "utdot;": 8944,
          "utilde;": 361,
          "utri;": 9653,
          "utrif;": 9652,
          "uuarr;": 8648,
          uuml: 252,
          "uuml;": 252,
          "uwangle;": 10663,
          "vArr;": 8661,
          "vBar;": 10984,
          "vBarv;": 10985,
          "vDash;": 8872,
          "vangrt;": 10652,
          "varepsilon;": 1013,
          "varkappa;": 1008,
          "varnothing;": 8709,
          "varphi;": 981,
          "varpi;": 982,
          "varpropto;": 8733,
          "varr;": 8597,
          "varrho;": 1009,
          "varsigma;": 962,
          "varsubsetneq;": [8842, 65024],
          "varsubsetneqq;": [10955, 65024],
          "varsupsetneq;": [8843, 65024],
          "varsupsetneqq;": [10956, 65024],
          "vartheta;": 977,
          "vartriangleleft;": 8882,
          "vartriangleright;": 8883,
          "vcy;": 1074,
          "vdash;": 8866,
          "vee;": 8744,
          "veebar;": 8891,
          "veeeq;": 8794,
          "vellip;": 8942,
          "verbar;": 124,
          "vert;": 124,
          "vfr;": [55349, 56627],
          "vltri;": 8882,
          "vnsub;": [8834, 8402],
          "vnsup;": [8835, 8402],
          "vopf;": [55349, 56679],
          "vprop;": 8733,
          "vrtri;": 8883,
          "vscr;": [55349, 56523],
          "vsubnE;": [10955, 65024],
          "vsubne;": [8842, 65024],
          "vsupnE;": [10956, 65024],
          "vsupne;": [8843, 65024],
          "vzigzag;": 10650,
          "wcirc;": 373,
          "wedbar;": 10847,
          "wedge;": 8743,
          "wedgeq;": 8793,
          "weierp;": 8472,
          "wfr;": [55349, 56628],
          "wopf;": [55349, 56680],
          "wp;": 8472,
          "wr;": 8768,
          "wreath;": 8768,
          "wscr;": [55349, 56524],
          "xcap;": 8898,
          "xcirc;": 9711,
          "xcup;": 8899,
          "xdtri;": 9661,
          "xfr;": [55349, 56629],
          "xhArr;": 10234,
          "xharr;": 10231,
          "xi;": 958,
          "xlArr;": 10232,
          "xlarr;": 10229,
          "xmap;": 10236,
          "xnis;": 8955,
          "xodot;": 10752,
          "xopf;": [55349, 56681],
          "xoplus;": 10753,
          "xotime;": 10754,
          "xrArr;": 10233,
          "xrarr;": 10230,
          "xscr;": [55349, 56525],
          "xsqcup;": 10758,
          "xuplus;": 10756,
          "xutri;": 9651,
          "xvee;": 8897,
          "xwedge;": 8896,
          yacute: 253,
          "yacute;": 253,
          "yacy;": 1103,
          "ycirc;": 375,
          "ycy;": 1099,
          yen: 165,
          "yen;": 165,
          "yfr;": [55349, 56630],
          "yicy;": 1111,
          "yopf;": [55349, 56682],
          "yscr;": [55349, 56526],
          "yucy;": 1102,
          yuml: 255,
          "yuml;": 255,
          "zacute;": 378,
          "zcaron;": 382,
          "zcy;": 1079,
          "zdot;": 380,
          "zeetrf;": 8488,
          "zeta;": 950,
          "zfr;": [55349, 56631],
          "zhcy;": 1078,
          "zigrarr;": 8669,
          "zopf;": [55349, 56683],
          "zscr;": [55349, 56527],
          "zwj;": 8205,
          "zwnj;": 8204,
        },
        ve =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        Z = 32,
        G = /[^\r"&\u0000]+/g,
        H = /[^\r'&\u0000]+/g,
        K = /[^\r\t\n\f &>\u0000]+/g,
        le = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        de = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        se = /[^\]\r\u0000\uffff]*/g,
        me = /[^&<\r\u0000\uffff]*/g,
        ge = /[^<\r\u0000\uffff]*/g,
        _e = /[^\r\u0000\uffff]*/g,
        Ae = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        Me =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        Ke = /[^\x09\x0A\x0C\x0D\x20]/,
        Fe = /[^\x09\x0A\x0C\x0D\x20]/g,
        Ot = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        et = /^[\x09\x0A\x0C\x0D\x20]+/,
        Ht = /\x00/g;
      function Ue(U) {
        var V = 16384;
        if (U.length < V) return String.fromCharCode.apply(String, U);
        for (var ce = "", te = 0; te < U.length; te += V)
          ce += String.fromCharCode.apply(String, U.slice(te, te + V));
        return ce;
      }
      function nr(U) {
        for (var V = [], ce = 0; ce < U.length; ce++) V[ce] = U.charCodeAt(ce);
        return V;
      }
      function Ne(U, V) {
        if (typeof V == "string")
          return U.namespaceURI === n.HTML && U.localName === V;
        var ce = V[U.namespaceURI];
        return ce && ce[U.localName];
      }
      function lt(U) {
        return Ne(U, z);
      }
      function ar(U) {
        if (Ne(U, ne)) return !0;
        if (U.namespaceURI === n.MATHML && U.localName === "annotation-xml") {
          var V = U.getAttribute("encoding");
          if (
            (V && (V = V.toLowerCase()),
            V === "text/html" || V === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function Wt(U) {
        return U in g ? g[U] : U;
      }
      function ir(U) {
        for (var V = 0, ce = U.length; V < ce; V++)
          U[V][0] in i && (U[V][0] = i[U[V][0]]);
      }
      function sr(U) {
        for (var V = 0, ce = U.length; V < ce; V++)
          if (U[V][0] === "definitionurl") {
            U[V][0] = "definitionURL";
            break;
          }
      }
      function ut(U) {
        for (var V = 0, ce = U.length; V < ce; V++)
          U[V][0] in ee && U[V].push(ee[U[V][0]]);
      }
      function Xe(U, V) {
        for (var ce = 0, te = U.length; ce < te; ce++) {
          var Ie = U[ce][0],
            ae = U[ce][1];
          V.hasAttribute(Ie) || V._setAttribute(Ie, ae);
        }
      }
      (be.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (be.ElementStack.prototype.push = function (U) {
          this.elements.push(U), (this.top = U);
        }),
        (be.ElementStack.prototype.pop = function (U) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (be.ElementStack.prototype.popTag = function (U) {
          for (var V = this.elements.length - 1; V > 0; V--) {
            var ce = this.elements[V];
            if (Ne(ce, U)) break;
          }
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (be.ElementStack.prototype.popElementType = function (U) {
          for (
            var V = this.elements.length - 1;
            V > 0 && !(this.elements[V] instanceof U);
            V--
          );
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (be.ElementStack.prototype.popElement = function (U) {
          for (
            var V = this.elements.length - 1;
            V > 0 && this.elements[V] !== U;
            V--
          );
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (be.ElementStack.prototype.removeElement = function (U) {
          if (this.top === U) this.pop();
          else {
            var V = this.elements.lastIndexOf(U);
            V !== -1 && this.elements.splice(V, 1);
          }
        }),
        (be.ElementStack.prototype.clearToContext = function (U) {
          for (
            var V = this.elements.length - 1;
            V > 0 && !Ne(this.elements[V], U);
            V--
          );
          (this.elements.length = V + 1), (this.top = this.elements[V]);
        }),
        (be.ElementStack.prototype.contains = function (U) {
          return this.inSpecificScope(U, Object.create(null));
        }),
        (be.ElementStack.prototype.inSpecificScope = function (U, V) {
          for (var ce = this.elements.length - 1; ce >= 0; ce--) {
            var te = this.elements[ce];
            if (Ne(te, U)) return !0;
            if (Ne(te, V)) return !1;
          }
          return !1;
        }),
        (be.ElementStack.prototype.elementInSpecificScope = function (U, V) {
          for (var ce = this.elements.length - 1; ce >= 0; ce--) {
            var te = this.elements[ce];
            if (te === U) return !0;
            if (Ne(te, V)) return !1;
          }
          return !1;
        }),
        (be.ElementStack.prototype.elementTypeInSpecificScope = function (
          U,
          V,
        ) {
          for (var ce = this.elements.length - 1; ce >= 0; ce--) {
            var te = this.elements[ce];
            if (te instanceof U) return !0;
            if (Ne(te, V)) return !1;
          }
          return !1;
        }),
        (be.ElementStack.prototype.inScope = function (U) {
          return this.inSpecificScope(U, o);
        }),
        (be.ElementStack.prototype.elementInScope = function (U) {
          return this.elementInSpecificScope(U, o);
        }),
        (be.ElementStack.prototype.elementTypeInScope = function (U) {
          return this.elementTypeInSpecificScope(U, o);
        }),
        (be.ElementStack.prototype.inButtonScope = function (U) {
          return this.inSpecificScope(U, p);
        }),
        (be.ElementStack.prototype.inListItemScope = function (U) {
          return this.inSpecificScope(U, r);
        }),
        (be.ElementStack.prototype.inTableScope = function (U) {
          return this.inSpecificScope(U, D);
        }),
        (be.ElementStack.prototype.inSelectScope = function (U) {
          for (var V = this.elements.length - 1; V >= 0; V--) {
            var ce = this.elements[V];
            if (ce.namespaceURI !== n.HTML) return !1;
            var te = ce.localName;
            if (te === U) return !0;
            if (te !== "optgroup" && te !== "option") return !1;
          }
          return !1;
        }),
        (be.ElementStack.prototype.generateImpliedEndTags = function (U, V) {
          for (
            var ce = V ? F : Y, te = this.elements.length - 1;
            te >= 0;
            te--
          ) {
            var Ie = this.elements[te];
            if ((U && Ne(Ie, U)) || !Ne(this.elements[te], ce)) break;
          }
          (this.elements.length = te + 1), (this.top = this.elements[te]);
        }),
        (be.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (be.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (be.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (be.ActiveFormattingElements.prototype.push = function (U, V) {
          for (
            var ce = 0, te = this.list.length - 1;
            te >= 0 && this.list[te] !== this.MARKER;
            te--
          )
            if (qt(U, this.list[te], this.attrs[te]) && (ce++, ce === 3)) {
              this.list.splice(te, 1), this.attrs.splice(te, 1);
              break;
            }
          this.list.push(U);
          for (var Ie = [], ae = 0; ae < V.length; ae++) Ie[ae] = V[ae];
          this.attrs.push(Ie);
          function qt(bt, Pt, ft) {
            if (bt.localName !== Pt.localName || bt._numattrs !== ft.length)
              return !1;
            for (var ze = 0, vr = ft.length; ze < vr; ze++) {
              var Bt = ft[ze][0],
                A = ft[ze][1];
              if (!bt.hasAttribute(Bt) || bt.getAttribute(Bt) !== A) return !1;
            }
            return !0;
          }
        }),
        (be.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var U = this.list.length - 1;
            U >= 0 && this.list[U] !== this.MARKER;
            U--
          );
          U < 0 && (U = 0), (this.list.length = U), (this.attrs.length = U);
        }),
        (be.ActiveFormattingElements.prototype.findElementByTag = function (U) {
          for (var V = this.list.length - 1; V >= 0; V--) {
            var ce = this.list[V];
            if (ce === this.MARKER) break;
            if (ce.localName === U) return ce;
          }
          return null;
        }),
        (be.ActiveFormattingElements.prototype.indexOf = function (U) {
          return this.list.lastIndexOf(U);
        }),
        (be.ActiveFormattingElements.prototype.remove = function (U) {
          var V = this.list.lastIndexOf(U);
          V !== -1 && (this.list.splice(V, 1), this.attrs.splice(V, 1));
        }),
        (be.ActiveFormattingElements.prototype.replace = function (U, V, ce) {
          var te = this.list.lastIndexOf(U);
          te !== -1 && ((this.list[te] = V), (this.attrs[te] = ce));
        }),
        (be.ActiveFormattingElements.prototype.insertAfter = function (U, V) {
          var ce = this.list.lastIndexOf(U);
          ce !== -1 &&
            (this.list.splice(ce, 0, V), this.attrs.splice(ce, 0, V));
        });
      function be(U, V, ce) {
        var te = null,
          Ie = 0,
          ae = 0,
          qt = !1,
          bt = !1,
          Pt = 0,
          ft = [],
          ze = "",
          vr = !0,
          Bt = 0,
          A = ye,
          Et,
          Oe,
          Le = "",
          Tr = "",
          De = [],
          Ye = "",
          We = "",
          xe = [],
          vt = [],
          Tt = [],
          yt = [],
          tt = [],
          yr = !1,
          j = Li,
          ht = null,
          dt = [],
          C = new be.ElementStack(),
          Te = new be.ActiveFormattingElements(),
          Ft = V !== void 0,
          wr = null,
          pt = null,
          Nr = !0;
        V && (Nr = V.ownerDocument._scripting_enabled),
          ce && ce.scripting_enabled === !1 && (Nr = !1);
        var He = !0,
          en = !1,
          Sr,
          tn,
          X = [],
          wt = !1,
          Ut = !1,
          kr = {
            document: function () {
              return Se;
            },
            _asDocumentFragment: function () {
              for (
                var e = Se.createDocumentFragment(), t = Se.firstChild;
                t.hasChildNodes();

              )
                e.appendChild(t.firstChild);
              return e;
            },
            pause: function () {
              Bt++;
            },
            resume: function () {
              Bt--, this.parse("");
            },
            parse: function (e, t, T) {
              var M;
              return Bt > 0
                ? ((ze += e), !0)
                : (Pt === 0
                    ? (ze && ((e = ze + e), (ze = "")),
                      t && ((e += "\uFFFF"), (qt = !0)),
                      (te = e),
                      (Ie = e.length),
                      (ae = 0),
                      vr && ((vr = !1), te.charCodeAt(0) === 65279 && (ae = 1)),
                      Pt++,
                      (M = In(T)),
                      (ze = te.substring(ae, Ie)),
                      Pt--)
                    : (Pt++,
                      ft.push(te, Ie, ae),
                      (te = e),
                      (Ie = e.length),
                      (ae = 0),
                      In(),
                      (M = !1),
                      (ze = te.substring(ae, Ie)),
                      (ae = ft.pop()),
                      (Ie = ft.pop()),
                      (te = ft.pop()),
                      ze &&
                        ((te = ze + te.substring(ae)),
                        (Ie = te.length),
                        (ae = 0),
                        (ze = "")),
                      Pt--),
                  M);
            },
          },
          Se = new d(!0, U);
        if (((Se._parser = kr), (Se._scripting_enabled = Nr), V)) {
          if (
            (V.ownerDocument._quirks && (Se._quirks = !0),
            V.ownerDocument._limitedQuirks && (Se._limitedQuirks = !0),
            V.namespaceURI === n.HTML)
          )
            switch (V.localName) {
              case "title":
              case "textarea":
                A = Ct;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                A = on;
                break;
            }
          var xn = Se.createElement("html");
          Se._appendChild(xn),
            C.push(xn),
            V instanceof l.HTMLTemplateElement && dt.push(_n),
            hr();
          for (var or = V; or !== null; or = or.parentElement)
            if (or instanceof l.HTMLFormElement) {
              pt = or;
              break;
            }
        }
        function In(e) {
          for (var t, T, M, q; ae < Ie; ) {
            if (Bt > 0 || (e && e())) return !0;
            switch (typeof A.lookahead) {
              case "undefined":
                if (((t = te.charCodeAt(ae++)), bt && ((bt = !1), t === 10))) {
                  ae++;
                  continue;
                }
                switch (t) {
                  case 13:
                    ae < Ie ? te.charCodeAt(ae) === 10 && ae++ : (bt = !0),
                      A(10);
                    break;
                  case 65535:
                    if (qt && ae === Ie) {
                      A(s);
                      break;
                    }
                  default:
                    A(t);
                    break;
                }
                break;
              case "number":
                t = te.charCodeAt(ae);
                var Q = A.lookahead,
                  he = !0;
                if ((Q < 0 && ((he = !1), (Q = -Q)), Q < Ie - ae))
                  (T = he ? te.substring(ae, ae + Q) : null), (q = !1);
                else if (qt)
                  (T = he ? te.substring(ae, Ie) : null),
                    (q = !0),
                    t === 65535 && ae === Ie - 1 && (t = s);
                else return !0;
                A(t, T, q);
                break;
              case "string":
                (t = te.charCodeAt(ae)), (M = A.lookahead);
                var we = te.indexOf(M, ae);
                if (we !== -1) (T = te.substring(ae, we + M.length)), (q = !1);
                else {
                  if (!qt) return !0;
                  (T = te.substring(ae, Ie)),
                    t === 65535 && ae === Ie - 1 && (t = s),
                    (q = !0);
                }
                A(t, T, q);
                break;
            }
          }
          return !1;
        }
        function Nt(e, t) {
          for (var T = 0; T < tt.length; T++) if (tt[T][0] === e) return;
          t !== void 0 ? tt.push([e, t]) : tt.push([e]);
        }
        function xa() {
          Me.lastIndex = ae - 1;
          var e = Me.exec(te);
          if (!e) throw new Error("should never happen");
          var t = e[1];
          if (!t) return !1;
          var T = e[2],
            M = T.length;
          switch (T[0]) {
            case '"':
            case "'":
              (T = T.substring(1, M - 1)), (ae += e[0].length - 1), (A = fn);
              break;
            default:
              (A = ct), (ae += e[0].length - 1), (T = T.substring(0, M - 1));
              break;
          }
          for (var q = 0; q < tt.length; q++) if (tt[q][0] === t) return !0;
          return tt.push([t, T]), !0;
        }
        function Ia() {
          (yr = !1), (Le = ""), (tt.length = 0);
        }
        function cr() {
          (yr = !0), (Le = ""), (tt.length = 0);
        }
        function mt() {
          De.length = 0;
        }
        function rn() {
          Ye = "";
        }
        function nn() {
          We = "";
        }
        function Rn() {
          xe.length = 0;
        }
        function Kt() {
          (vt.length = 0), (Tt = null), (yt = null);
        }
        function Cr() {
          Tt = [];
        }
        function St() {
          yt = [];
        }
        function ke() {
          en = !0;
        }
        function Ra() {
          return C.top && C.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function Qe(e) {
          return Tr === e;
        }
        function Xt() {
          if (X.length > 0) {
            var e = Ue(X);
            if (
              ((X.length = 0),
              Ut &&
                ((Ut = !1),
                e[0] ===
                  `
` && (e = e.substring(1)),
                e.length === 0))
            )
              return;
            Pe(E, e), (wt = !1);
          }
          Ut = !1;
        }
        function lr(e) {
          e.lastIndex = ae - 1;
          var t = e.exec(te);
          if (t && t.index === ae - 1)
            return (
              (t = t[0]),
              (ae += t.length - 1),
              qt && ae === Ie && ((t = t.slice(0, -1)), ae--),
              t
            );
          throw new Error("should never happen");
        }
        function ur(e) {
          e.lastIndex = ae - 1;
          var t = e.exec(te)[0];
          return t ? (Oa(t), (ae += t.length - 1), !0) : !1;
        }
        function Oa(e) {
          X.length > 0 && Xt(),
            !(
              Ut &&
              ((Ut = !1),
              e[0] ===
                `
` && (e = e.substring(1)),
              e.length === 0)
            ) && Pe(E, e);
        }
        function gt() {
          if (yr) Pe(y, Le);
          else {
            var e = Le;
            (Le = ""), (Tr = e), Pe(b, e, tt);
          }
        }
        function Ha() {
          if (ae === Ie) return !1;
          Ae.lastIndex = ae;
          var e = Ae.exec(te);
          if (!e) throw new Error("should never happen");
          var t = e[2];
          if (!t) return !1;
          var T = e[1];
          return (
            T
              ? ((ae += t.length + 2), Pe(y, t))
              : ((ae += t.length + 1), (Tr = t), Pe(b, t, I)),
            !0
          );
        }
        function qa() {
          yr ? Pe(y, Le, null, !0) : Pe(b, Le, tt, !0);
        }
        function Ce() {
          Pe(R, Ue(vt), Tt ? Ue(Tt) : void 0, yt ? Ue(yt) : void 0);
        }
        function Ee() {
          Xt(), j(s), (Se.modclock = 1);
        }
        var Pe = (kr.insertToken = function (t, T, M, q) {
          Xt();
          var Q = C.top;
          !Q || Q.namespaceURI === n.HTML
            ? j(t, T, M, q)
            : t !== b && t !== E
              ? Yn(t, T, M, q)
              : (lt(Q) &&
                    (t === E ||
                      (t === b && T !== "mglyph" && T !== "malignmark"))) ||
                  (t === b &&
                    T === "svg" &&
                    Q.namespaceURI === n.MATHML &&
                    Q.localName === "annotation-xml") ||
                  ar(Q)
                ? ((tn = !0), j(t, T, M, q), (tn = !1))
                : Yn(t, T, M, q);
        });
        function it(e) {
          var t = C.top;
          kt && Ne(t, J)
            ? Dr(function (T) {
                return T.createComment(e);
              })
            : (t instanceof l.HTMLTemplateElement && (t = t.content),
              t._appendChild(t.ownerDocument.createComment(e)));
        }
        function st(e) {
          var t = C.top;
          if (kt && Ne(t, J))
            Dr(function (M) {
              return M.createTextNode(e);
            });
          else {
            t instanceof l.HTMLTemplateElement && (t = t.content);
            var T = t.lastChild;
            T && T.nodeType === a.TEXT_NODE
              ? T.appendData(e)
              : t._appendChild(t.ownerDocument.createTextNode(e));
          }
        }
        function fr(e, t, T) {
          var M = c.createElement(e, t, null);
          if (T)
            for (var q = 0, Q = T.length; q < Q; q++)
              M._setAttribute(T[q][0], T[q][1]);
          return M;
        }
        var kt = !1;
        function pe(e, t) {
          var T = Lr(function (M) {
            return fr(M, e, t);
          });
          return Ne(T, f) && (T._form = pt), T;
        }
        function Lr(e) {
          var t;
          return (
            kt && Ne(C.top, J)
              ? (t = Dr(e))
              : C.top instanceof l.HTMLTemplateElement
                ? ((t = e(C.top.content.ownerDocument)),
                  C.top.content._appendChild(t))
                : ((t = e(C.top.ownerDocument)), C.top._appendChild(t)),
            C.push(t),
            t
          );
        }
        function an(e, t, T) {
          return Lr(function (M) {
            var q = M._createElementNS(e, T, null);
            if (t)
              for (var Q = 0, he = t.length; Q < he; Q++) {
                var we = t[Q];
                we.length === 2
                  ? q._setAttribute(we[0], we[1])
                  : q._setAttributeNS(we[2], we[0], we[1]);
              }
            return q;
          });
        }
        function On(e) {
          for (var t = C.elements.length - 1; t >= 0; t--)
            if (C.elements[t] instanceof e) return t;
          return -1;
        }
        function Dr(e) {
          var t,
            T,
            M = -1,
            q = -1,
            Q;
          if (
            ((M = On(l.HTMLTableElement)),
            (q = On(l.HTMLTemplateElement)),
            q >= 0 && (M < 0 || q > M)
              ? (t = C.elements[q])
              : M >= 0 &&
                ((t = C.elements[M].parentNode),
                t ? (T = C.elements[M]) : (t = C.elements[M - 1])),
            t || (t = C.elements[0]),
            t instanceof l.HTMLTemplateElement && (t = t.content),
            (Q = e(t.ownerDocument)),
            Q.nodeType === a.TEXT_NODE)
          ) {
            var he;
            if (
              (T ? (he = T.previousSibling) : (he = t.lastChild),
              he && he.nodeType === a.TEXT_NODE)
            )
              return he.appendData(Q.data), Q;
          }
          return T ? t.insertBefore(Q, T) : t._appendChild(Q), Q;
        }
        function hr() {
          for (var e = !1, t = C.elements.length - 1; t >= 0; t--) {
            var T = C.elements[t];
            if (
              (t === 0 && ((e = !0), Ft && (T = V)), T.namespaceURI === n.HTML)
            ) {
              var M = T.localName;
              switch (M) {
                case "select":
                  for (var q = t; q > 0; ) {
                    var Q = C.elements[--q];
                    if (Q instanceof l.HTMLTemplateElement) break;
                    if (Q instanceof l.HTMLTableElement) {
                      j = Vr;
                      return;
                    }
                  }
                  j = _t;
                  return;
                case "tr":
                  j = mr;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  j = Zt;
                  return;
                case "caption":
                  j = gn;
                  return;
                case "colgroup":
                  j = jr;
                  return;
                case "table":
                  j = $e;
                  return;
                case "template":
                  j = dt[dt.length - 1];
                  return;
                case "body":
                  j = fe;
                  return;
                case "frameset":
                  j = bn;
                  return;
                case "html":
                  wr === null ? (j = Fr) : (j = mn);
                  return;
                default:
                  if (!e) {
                    if (M === "head") {
                      j = qe;
                      return;
                    }
                    if (M === "td" || M === "th") {
                      j = Yt;
                      return;
                    }
                  }
              }
            }
            if (e) {
              j = fe;
              return;
            }
          }
        }
        function Ar(e, t) {
          pe(e, t), (A = dr), (ht = j), (j = Ur);
        }
        function Pa(e, t) {
          pe(e, t), (A = Ct), (ht = j), (j = Ur);
        }
        function sn(e, t) {
          return {
            elt: fr(e, Te.list[t].localName, Te.attrs[t]),
            attrs: Te.attrs[t],
          };
        }
        function Ze() {
          if (Te.list.length !== 0) {
            var e = Te.list[Te.list.length - 1];
            if (e !== Te.MARKER && C.elements.lastIndexOf(e) === -1) {
              for (
                var t = Te.list.length - 2;
                t >= 0 &&
                ((e = Te.list[t]),
                !(e === Te.MARKER || C.elements.lastIndexOf(e) !== -1));
                t--
              );
              for (t = t + 1; t < Te.list.length; t++) {
                var T = Lr(function (M) {
                  return sn(M, t).elt;
                });
                Te.list[t] = T;
              }
            }
          }
        }
        var Mr = { localName: "BM" };
        function Ba(e) {
          if (Ne(C.top, e) && Te.indexOf(C.top) === -1) return C.pop(), !0;
          for (var t = 0; t < 8; ) {
            t++;
            var T = Te.findElementByTag(e);
            if (!T) return !1;
            var M = C.elements.lastIndexOf(T);
            if (M === -1) return Te.remove(T), !0;
            if (!C.elementInScope(T)) return !0;
            for (var q = null, Q, he = M + 1; he < C.elements.length; he++)
              if (Ne(C.elements[he], S)) {
                (q = C.elements[he]), (Q = he);
                break;
              }
            if (q) {
              var we = C.elements[M - 1];
              Te.insertAfter(T, Mr);
              for (
                var Re = q, Ve = q, Je = Q, rt, zt = 0;
                zt++, (Re = C.elements[--Je]), Re !== T;

              ) {
                if (
                  ((rt = Te.indexOf(Re)),
                  zt > 3 && rt !== -1 && (Te.remove(Re), (rt = -1)),
                  rt === -1)
                ) {
                  C.removeElement(Re);
                  continue;
                }
                var xt = sn(we.ownerDocument, rt);
                Te.replace(Re, xt.elt, xt.attrs),
                  (C.elements[Je] = xt.elt),
                  (Re = xt.elt),
                  Ve === q && (Te.remove(Mr), Te.insertAfter(xt.elt, Mr)),
                  Re._appendChild(Ve),
                  (Ve = Re);
              }
              kt && Ne(we, J)
                ? Dr(function () {
                    return Ve;
                  })
                : we instanceof l.HTMLTemplateElement
                  ? we.content._appendChild(Ve)
                  : we._appendChild(Ve);
              for (
                var gr = sn(q.ownerDocument, Te.indexOf(T));
                q.hasChildNodes();

              )
                gr.elt._appendChild(q.firstChild);
              q._appendChild(gr.elt),
                Te.remove(T),
                Te.replace(Mr, gr.elt, gr.attrs),
                C.removeElement(T);
              var Ii = C.elements.lastIndexOf(q);
              C.elements.splice(Ii + 1, 0, gr.elt);
            } else return C.popElement(T), Te.remove(T), !0;
          }
          return !0;
        }
        function Fa() {
          C.pop(), (j = ht);
        }
        function jt() {
          delete Se._parser,
            (C.elements.length = 0),
            Se.defaultView &&
              Se.defaultView.dispatchEvent(new l.Event("load", {}));
        }
        function oe(e, t) {
          (A = t), ae--;
        }
        function ye(e) {
          switch (e) {
            case 38:
              (Et = ye), (A = pr);
              break;
            case 60:
              if (Ha()) break;
              A = Ua;
              break;
            case 0:
              X.push(e), (wt = !0);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(me) || X.push(e);
              break;
          }
        }
        function Ct(e) {
          switch (e) {
            case 38:
              (Et = Ct), (A = pr);
              break;
            case 60:
              A = Va;
              break;
            case 0:
              X.push(65533), (wt = !0);
              break;
            case -1:
              Ee();
              break;
            default:
              X.push(e);
              break;
          }
        }
        function dr(e) {
          switch (e) {
            case 60:
              A = za;
              break;
            case 0:
              X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(ge) || X.push(e);
              break;
          }
        }
        function Lt(e) {
          switch (e) {
            case 60:
              A = Xa;
              break;
            case 0:
              X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(ge) || X.push(e);
              break;
          }
        }
        function on(e) {
          switch (e) {
            case 0:
              X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(_e) || X.push(e);
              break;
          }
        }
        function Ua(e) {
          switch (e) {
            case 33:
              A = Bn;
              break;
            case 47:
              A = ja;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ia(), oe(e, Hn);
              break;
            case 63:
              oe(e, Or);
              break;
            default:
              X.push(60), oe(e, ye);
              break;
          }
        }
        function ja(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              cr(), oe(e, Hn);
              break;
            case 62:
              A = ye;
              break;
            case -1:
              X.push(60), X.push(47), Ee();
              break;
            default:
              oe(e, Or);
              break;
          }
        }
        function Hn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = ct;
              break;
            case 47:
              A = At;
              break;
            case 62:
              (A = ye), gt();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Le += String.fromCharCode(e + 32);
              break;
            case 0:
              Le += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            default:
              Le += lr(le);
              break;
          }
        }
        function Va(e) {
          e === 47 ? (mt(), (A = Ga)) : (X.push(60), oe(e, Ct));
        }
        function Ga(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              cr(), oe(e, Za);
              break;
            default:
              X.push(60), X.push(47), oe(e, Ct);
              break;
          }
        }
        function Za(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Le)) {
                A = ct;
                return;
              }
              break;
            case 47:
              if (Qe(Le)) {
                A = At;
                return;
              }
              break;
            case 62:
              if (Qe(Le)) {
                (A = ye), gt();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(e + 32)), De.push(e);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          X.push(60), X.push(47), h(X, De), oe(e, Ct);
        }
        function za(e) {
          e === 47 ? (mt(), (A = Wa)) : (X.push(60), oe(e, dr));
        }
        function Wa(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              cr(), oe(e, Ka);
              break;
            default:
              X.push(60), X.push(47), oe(e, dr);
              break;
          }
        }
        function Ka(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Le)) {
                A = ct;
                return;
              }
              break;
            case 47:
              if (Qe(Le)) {
                A = At;
                return;
              }
              break;
            case 62:
              if (Qe(Le)) {
                (A = ye), gt();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(e + 32)), De.push(e);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          X.push(60), X.push(47), h(X, De), oe(e, dr);
        }
        function Xa(e) {
          switch (e) {
            case 47:
              mt(), (A = Ya);
              break;
            case 33:
              (A = $a), X.push(60), X.push(33);
              break;
            default:
              X.push(60), oe(e, Lt);
              break;
          }
        }
        function Ya(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              cr(), oe(e, Qa);
              break;
            default:
              X.push(60), X.push(47), oe(e, Lt);
              break;
          }
        }
        function Qa(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Le)) {
                A = ct;
                return;
              }
              break;
            case 47:
              if (Qe(Le)) {
                A = At;
                return;
              }
              break;
            case 62:
              if (Qe(Le)) {
                (A = ye), gt();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(e + 32)), De.push(e);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          X.push(60), X.push(47), h(X, De), oe(e, Lt);
        }
        function $a(e) {
          e === 45 ? ((A = Ja), X.push(45)) : oe(e, Lt);
        }
        function Ja(e) {
          e === 45 ? ((A = qn), X.push(45)) : oe(e, Lt);
        }
        function ot(e) {
          switch (e) {
            case 45:
              (A = ei), X.push(45);
              break;
            case 60:
              A = cn;
              break;
            case 0:
              X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              X.push(e);
              break;
          }
        }
        function ei(e) {
          switch (e) {
            case 45:
              (A = qn), X.push(45);
              break;
            case 60:
              A = cn;
              break;
            case 0:
              (A = ot), X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (A = ot), X.push(e);
              break;
          }
        }
        function qn(e) {
          switch (e) {
            case 45:
              X.push(45);
              break;
            case 60:
              A = cn;
              break;
            case 62:
              (A = Lt), X.push(62);
              break;
            case 0:
              (A = ot), X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (A = ot), X.push(e);
              break;
          }
        }
        function cn(e) {
          switch (e) {
            case 47:
              mt(), (A = ti);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              mt(), X.push(60), oe(e, ni);
              break;
            default:
              X.push(60), oe(e, ot);
              break;
          }
        }
        function ti(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              cr(), oe(e, ri);
              break;
            default:
              X.push(60), X.push(47), oe(e, ot);
              break;
          }
        }
        function ri(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Le)) {
                A = ct;
                return;
              }
              break;
            case 47:
              if (Qe(Le)) {
                A = At;
                return;
              }
              break;
            case 62:
              if (Qe(Le)) {
                (A = ye), gt();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(e + 32)), De.push(e);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          X.push(60), X.push(47), h(X, De), oe(e, ot);
        }
        function ni(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              Ue(De) === "script" ? (A = Dt) : (A = ot), X.push(e);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              De.push(e + 32), X.push(e);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              De.push(e), X.push(e);
              break;
            default:
              oe(e, ot);
              break;
          }
        }
        function Dt(e) {
          switch (e) {
            case 45:
              (A = ai), X.push(45);
              break;
            case 60:
              (A = ln), X.push(60);
              break;
            case 0:
              X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              X.push(e);
              break;
          }
        }
        function ai(e) {
          switch (e) {
            case 45:
              (A = ii), X.push(45);
              break;
            case 60:
              (A = ln), X.push(60);
              break;
            case 0:
              (A = Dt), X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (A = Dt), X.push(e);
              break;
          }
        }
        function ii(e) {
          switch (e) {
            case 45:
              X.push(45);
              break;
            case 60:
              (A = ln), X.push(60);
              break;
            case 62:
              (A = Lt), X.push(62);
              break;
            case 0:
              (A = Dt), X.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (A = Dt), X.push(e);
              break;
          }
        }
        function ln(e) {
          e === 47 ? (mt(), (A = si), X.push(47)) : oe(e, Dt);
        }
        function si(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              Ue(De) === "script" ? (A = ot) : (A = Dt), X.push(e);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              De.push(e + 32), X.push(e);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              De.push(e), X.push(e);
              break;
            default:
              oe(e, Dt);
              break;
          }
        }
        function ct(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              A = At;
              break;
            case 62:
              (A = ye), gt();
              break;
            case -1:
              Ee();
              break;
            case 61:
              rn(), (Ye += String.fromCharCode(e)), (A = un);
              break;
            default:
              if (xa()) break;
              rn(), oe(e, un);
              break;
          }
        }
        function un(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              oe(e, oi);
              break;
            case 61:
              A = Pn;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Ye += String.fromCharCode(e + 32);
              break;
            case 0:
              Ye += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              Ye += lr(de);
              break;
          }
        }
        function oi(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              Nt(Ye), (A = At);
              break;
            case 61:
              A = Pn;
              break;
            case 62:
              (A = ye), Nt(Ye), gt();
              break;
            case -1:
              Nt(Ye), Ee();
              break;
            default:
              Nt(Ye), rn(), oe(e, un);
              break;
          }
        }
        function Pn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              nn(), (A = xr);
              break;
            case 39:
              nn(), (A = Ir);
              break;
            case 62:
            default:
              nn(), oe(e, Rr);
              break;
          }
        }
        function xr(e) {
          switch (e) {
            case 34:
              Nt(Ye, We), (A = fn);
              break;
            case 38:
              (Et = xr), (A = pr);
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            case 10:
              We += String.fromCharCode(e);
              break;
            default:
              We += lr(G);
              break;
          }
        }
        function Ir(e) {
          switch (e) {
            case 39:
              Nt(Ye, We), (A = fn);
              break;
            case 38:
              (Et = Ir), (A = pr);
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            case 10:
              We += String.fromCharCode(e);
              break;
            default:
              We += lr(H);
              break;
          }
        }
        function Rr(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              Nt(Ye, We), (A = ct);
              break;
            case 38:
              (Et = Rr), (A = pr);
              break;
            case 62:
              Nt(Ye, We), (A = ye), gt();
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              ae--, (A = ye);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              We += lr(K);
              break;
          }
        }
        function fn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = ct;
              break;
            case 47:
              A = At;
              break;
            case 62:
              (A = ye), gt();
              break;
            case -1:
              Ee();
              break;
            default:
              oe(e, ct);
              break;
          }
        }
        function At(e) {
          switch (e) {
            case 62:
              (A = ye), qa(!0);
              break;
            case -1:
              Ee();
              break;
            default:
              oe(e, ct);
              break;
          }
        }
        function Or(e, t, T) {
          var M = t.length;
          T ? (ae += M - 1) : (ae += M);
          var q = t.substring(0, M - 1);
          (q = q.replace(/\u0000/g, "\uFFFD")),
            (q = q.replace(
              /\u000D\u000A/g,
              `
`,
            )),
            (q = q.replace(
              /\u000D/g,
              `
`,
            )),
            Pe(x, q),
            (A = ye);
        }
        Or.lookahead = ">";
        function Bn(e, t, T) {
          if (t[0] === "-" && t[1] === "-") {
            (ae += 2), Rn(), (A = ci);
            return;
          }
          t.toUpperCase() === "DOCTYPE"
            ? ((ae += 7), (A = mi))
            : t === "[CDATA[" && Ra()
              ? ((ae += 7), (A = pn))
              : (A = Or);
        }
        Bn.lookahead = 7;
        function ci(e) {
          switch ((Rn(), e)) {
            case 45:
              A = li;
              break;
            case 62:
              (A = ye), Pe(x, Ue(xe));
              break;
            default:
              oe(e, Vt);
              break;
          }
        }
        function li(e) {
          switch (e) {
            case 45:
              A = Hr;
              break;
            case 62:
              (A = ye), Pe(x, Ue(xe));
              break;
            case -1:
              Pe(x, Ue(xe)), Ee();
              break;
            default:
              xe.push(45), oe(e, Vt);
              break;
          }
        }
        function Vt(e) {
          switch (e) {
            case 60:
              xe.push(e), (A = ui);
              break;
            case 45:
              A = hn;
              break;
            case 0:
              xe.push(65533);
              break;
            case -1:
              Pe(x, Ue(xe)), Ee();
              break;
            default:
              xe.push(e);
              break;
          }
        }
        function ui(e) {
          switch (e) {
            case 33:
              xe.push(e), (A = fi);
              break;
            case 60:
              xe.push(e);
              break;
            default:
              oe(e, Vt);
              break;
          }
        }
        function fi(e) {
          switch (e) {
            case 45:
              A = hi;
              break;
            default:
              oe(e, Vt);
              break;
          }
        }
        function hi(e) {
          switch (e) {
            case 45:
              A = di;
              break;
            default:
              oe(e, hn);
              break;
          }
        }
        function di(e) {
          switch (e) {
            case 62:
            case -1:
              oe(e, Hr);
              break;
            default:
              oe(e, Hr);
              break;
          }
        }
        function hn(e) {
          switch (e) {
            case 45:
              A = Hr;
              break;
            case -1:
              Pe(x, Ue(xe)), Ee();
              break;
            default:
              xe.push(45), oe(e, Vt);
              break;
          }
        }
        function Hr(e) {
          switch (e) {
            case 62:
              (A = ye), Pe(x, Ue(xe));
              break;
            case 33:
              A = pi;
              break;
            case 45:
              xe.push(45);
              break;
            case -1:
              Pe(x, Ue(xe)), Ee();
              break;
            default:
              xe.push(45), xe.push(45), oe(e, Vt);
              break;
          }
        }
        function pi(e) {
          switch (e) {
            case 45:
              xe.push(45), xe.push(45), xe.push(33), (A = hn);
              break;
            case 62:
              (A = ye), Pe(x, Ue(xe));
              break;
            case -1:
              Pe(x, Ue(xe)), Ee();
              break;
            default:
              xe.push(45), xe.push(45), xe.push(33), oe(e, Vt);
              break;
          }
        }
        function mi(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Fn;
              break;
            case -1:
              Kt(), ke(), Ce(), Ee();
              break;
            default:
              oe(e, Fn);
              break;
          }
        }
        function Fn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Kt(), vt.push(e + 32), (A = dn);
              break;
            case 0:
              Kt(), vt.push(65533), (A = dn);
              break;
            case 62:
              Kt(), ke(), (A = ye), Ce();
              break;
            case -1:
              Kt(), ke(), Ce(), Ee();
              break;
            default:
              Kt(), vt.push(e), (A = dn);
              break;
          }
        }
        function dn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Un;
              break;
            case 62:
              (A = ye), Ce();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              vt.push(e + 32);
              break;
            case 0:
              vt.push(65533);
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              vt.push(e);
              break;
          }
        }
        function Un(e, t, T) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              ae += 1;
              break;
            case 62:
              (A = ye), (ae += 1), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              (t = t.toUpperCase()),
                t === "PUBLIC"
                  ? ((ae += 6), (A = gi))
                  : t === "SYSTEM"
                    ? ((ae += 6), (A = Ei))
                    : (ke(), (A = Mt));
              break;
          }
        }
        Un.lookahead = 6;
        function gi(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = _i;
              break;
            case 34:
              Cr(), (A = jn);
              break;
            case 39:
              Cr(), (A = Vn);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function _i(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Cr(), (A = jn);
              break;
            case 39:
              Cr(), (A = Vn);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function jn(e) {
          switch (e) {
            case 34:
              A = Gn;
              break;
            case 0:
              Tt.push(65533);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              Tt.push(e);
              break;
          }
        }
        function Vn(e) {
          switch (e) {
            case 39:
              A = Gn;
              break;
            case 0:
              Tt.push(65533);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              Tt.push(e);
              break;
          }
        }
        function Gn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = bi;
              break;
            case 62:
              (A = ye), Ce();
              break;
            case 34:
              St(), (A = qr);
              break;
            case 39:
              St(), (A = Pr);
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function bi(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = ye), Ce();
              break;
            case 34:
              St(), (A = qr);
              break;
            case 39:
              St(), (A = Pr);
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function Ei(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = vi;
              break;
            case 34:
              St(), (A = qr);
              break;
            case 39:
              St(), (A = Pr);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function vi(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              St(), (A = qr);
              break;
            case 39:
              St(), (A = Pr);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              ke(), (A = Mt);
              break;
          }
        }
        function qr(e) {
          switch (e) {
            case 34:
              A = Zn;
              break;
            case 0:
              yt.push(65533);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              yt.push(e);
              break;
          }
        }
        function Pr(e) {
          switch (e) {
            case 39:
              A = Zn;
              break;
            case 0:
              yt.push(65533);
              break;
            case 62:
              ke(), (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              yt.push(e);
              break;
          }
        }
        function Zn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = ye), Ce();
              break;
            case -1:
              ke(), Ce(), Ee();
              break;
            default:
              A = Mt;
              break;
          }
        }
        function Mt(e) {
          switch (e) {
            case 62:
              (A = ye), Ce();
              break;
            case -1:
              Ce(), Ee();
              break;
            default:
              break;
          }
        }
        function pn(e) {
          switch (e) {
            case 93:
              A = Ti;
              break;
            case -1:
              Ee();
              break;
            case 0:
              wt = !0;
            default:
              ur(se) || X.push(e);
              break;
          }
        }
        function Ti(e) {
          switch (e) {
            case 93:
              A = yi;
              break;
            default:
              X.push(93), oe(e, pn);
              break;
          }
        }
        function yi(e) {
          switch (e) {
            case 93:
              X.push(93);
              break;
            case 62:
              Xt(), (A = ye);
              break;
            default:
              X.push(93), X.push(93), oe(e, pn);
              break;
          }
        }
        function pr(e) {
          switch ((mt(), De.push(38), e)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              oe(e, Gt);
              break;
            case 35:
              De.push(e), (A = wi);
              break;
            default:
              oe(e, zn);
              break;
          }
        }
        function zn(e) {
          ve.lastIndex = ae;
          var t = ve.exec(te);
          if (!t) throw new Error("should never happen");
          var T = t[1];
          if (!T) {
            A = Gt;
            return;
          }
          switch (((ae += T.length), h(De, nr(T)), Et)) {
            case xr:
            case Ir:
            case Rr:
              if (T[T.length - 1] !== ";" && /[=A-Za-z0-9]/.test(te[ae])) {
                A = Gt;
                return;
              }
              break;
            default:
              break;
          }
          mt();
          var M = W[T];
          typeof M == "number" ? De.push(M) : h(De, M), (A = Gt);
        }
        zn.lookahead = -Z;
        function wi(e) {
          switch (((Oe = 0), e)) {
            case 120:
            case 88:
              De.push(e), (A = Ni);
              break;
            default:
              oe(e, Si);
              break;
          }
        }
        function Ni(e) {
          switch (e) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              oe(e, ki);
              break;
            default:
              oe(e, Gt);
              break;
          }
        }
        function Si(e) {
          switch (e) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              oe(e, Ci);
              break;
            default:
              oe(e, Gt);
              break;
          }
        }
        function ki(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (Oe *= 16), (Oe += e - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (Oe *= 16), (Oe += e - 87);
              break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Oe *= 16), (Oe += e - 48);
              break;
            case 59:
              A = Br;
              break;
            default:
              oe(e, Br);
              break;
          }
        }
        function Ci(e) {
          switch (e) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Oe *= 10), (Oe += e - 48);
              break;
            case 59:
              A = Br;
              break;
            default:
              oe(e, Br);
              break;
          }
        }
        function Br(e) {
          Oe in k
            ? (Oe = k[Oe])
            : (Oe > 1114111 || (Oe >= 55296 && Oe < 57344)) && (Oe = 65533),
            mt(),
            Oe <= 65535
              ? De.push(Oe)
              : ((Oe = Oe - 65536),
                De.push(55296 + (Oe >> 10)),
                De.push(56320 + (Oe & 1023))),
            oe(e, Gt);
        }
        function Gt(e) {
          switch (Et) {
            case xr:
            case Ir:
            case Rr:
              We += Ue(De);
              break;
            default:
              h(X, De);
              break;
          }
          oe(e, Et);
        }
        function Li(e, t, T, M) {
          switch (e) {
            case 1:
              if (((t = t.replace(et, "")), t.length === 0)) return;
              break;
            case 4:
              Se._appendChild(Se.createComment(t));
              return;
            case 5:
              var q = t,
                Q = T,
                he = M;
              Se.appendChild(new u(Se, q, Q, he)),
                en ||
                q.toLowerCase() !== "html" ||
                re.test(Q) ||
                (he && he.toLowerCase() === B) ||
                (he === void 0 && w.test(Q))
                  ? (Se._quirks = !0)
                  : (_.test(Q) || (he !== void 0 && w.test(Q))) &&
                    (Se._limitedQuirks = !0),
                (j = Wn);
              return;
          }
          (Se._quirks = !0), (j = Wn), j(e, t, T, M);
        }
        function Wn(e, t, T, M) {
          var q;
          switch (e) {
            case 1:
              if (((t = t.replace(et, "")), t.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              Se._appendChild(Se.createComment(t));
              return;
            case 2:
              if (t === "html") {
                (q = fr(Se, t, T)), C.push(q), Se.appendChild(q), (j = Fr);
                return;
              }
              break;
            case 3:
              switch (t) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (q = fr(Se, "html", null)),
            C.push(q),
            Se.appendChild(q),
            (j = Fr),
            j(e, t, T, M);
        }
        function Fr(e, t, T, M) {
          switch (e) {
            case 1:
              if (((t = t.replace(et, "")), t.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              it(t);
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "head":
                  var q = pe(t, T);
                  (wr = q), (j = qe);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          Fr(b, "head", null), j(e, t, T, M);
        }
        function qe(e, t, T, M) {
          switch (e) {
            case 1:
              var q = t.match(et);
              if (
                (q && (st(q[0]), (t = t.substring(q[0].length))),
                t.length === 0)
              )
                return;
              break;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  pe(t, T), C.pop();
                  return;
                case "title":
                  Pa(t, T);
                  return;
                case "noscript":
                  if (!Nr) {
                    pe(t, T), (j = Kn);
                    return;
                  }
                case "noframes":
                case "style":
                  Ar(t, T);
                  return;
                case "script":
                  Lr(function (Q) {
                    var he = fr(Q, t, T);
                    return (
                      (he._parser_inserted = !0),
                      (he._force_async = !1),
                      Ft && (he._already_started = !0),
                      Xt(),
                      he
                    );
                  }),
                    (A = Lt),
                    (ht = j),
                    (j = Ur);
                  return;
                case "template":
                  pe(t, T), Te.insertMarker(), (He = !1), (j = _n), dt.push(j);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "head":
                  C.pop(), (j = mn);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!C.contains("template")) return;
                  C.generateImpliedEndTags(null, "thorough"),
                    C.popTag("template"),
                    Te.clearToMarker(),
                    dt.pop(),
                    hr();
                  return;
                default:
                  return;
              }
              break;
          }
          qe(y, "head", null), j(e, t, T, M);
        }
        function Kn(e, t, T, M) {
          switch (e) {
            case 5:
              return;
            case 4:
              qe(e, t);
              return;
            case 1:
              var q = t.match(et);
              if (
                (q && (qe(e, q[0]), (t = t.substring(q[0].length))),
                t.length === 0)
              )
                return;
              break;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  qe(e, t, T);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "noscript":
                  C.pop(), (j = qe);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          Kn(y, "noscript", null), j(e, t, T, M);
        }
        function mn(e, t, T, M) {
          switch (e) {
            case 1:
              var q = t.match(et);
              if (
                (q && (st(q[0]), (t = t.substring(q[0].length))),
                t.length === 0)
              )
                return;
              break;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "body":
                  pe(t, T), (He = !1), (j = fe);
                  return;
                case "frameset":
                  pe(t, T), (j = bn);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  C.push(wr), qe(b, t, T), C.removeElement(wr);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "template":
                  return qe(e, t, T, M);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          mn(b, "body", null), (He = !0), j(e, t, T, M);
        }
        function fe(e, t, T, M) {
          var q, Q, he, we;
          switch (e) {
            case 1:
              if (wt && ((t = t.replace(Ht, "")), t.length === 0)) return;
              He && Ke.test(t) && (He = !1), Ze(), st(t);
              return;
            case 5:
              return;
            case 4:
              it(t);
              return;
            case -1:
              if (dt.length) return _n(e);
              jt();
              return;
            case 2:
              switch (t) {
                case "html":
                  if (C.contains("template")) return;
                  Xe(T, C.elements[0]);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  qe(b, t, T);
                  return;
                case "body":
                  if (
                    ((q = C.elements[1]),
                    !q ||
                      !(q instanceof l.HTMLBodyElement) ||
                      C.contains("template"))
                  )
                    return;
                  (He = !1), Xe(T, q);
                  return;
                case "frameset":
                  if (
                    !He ||
                    ((q = C.elements[1]),
                    !q || !(q instanceof l.HTMLBodyElement))
                  )
                    return;
                  for (
                    q.parentNode && q.parentNode.removeChild(q);
                    !(C.top instanceof l.HTMLHtmlElement);

                  )
                    C.pop();
                  pe(t, T), (j = bn);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "main":
                case "nav":
                case "ol":
                case "p":
                case "section":
                case "summary":
                case "ul":
                  C.inButtonScope("p") && fe(y, "p"), pe(t, T);
                  return;
                case "menu":
                  C.inButtonScope("p") && fe(y, "p"),
                    Ne(C.top, "menuitem") && C.pop(),
                    pe(t, T);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  C.inButtonScope("p") && fe(y, "p"),
                    C.top instanceof l.HTMLHeadingElement && C.pop(),
                    pe(t, T);
                  return;
                case "pre":
                case "listing":
                  C.inButtonScope("p") && fe(y, "p"),
                    pe(t, T),
                    (Ut = !0),
                    (He = !1);
                  return;
                case "form":
                  if (pt && !C.contains("template")) return;
                  C.inButtonScope("p") && fe(y, "p"),
                    (we = pe(t, T)),
                    C.contains("template") || (pt = we);
                  return;
                case "li":
                  for (He = !1, Q = C.elements.length - 1; Q >= 0; Q--) {
                    if (((he = C.elements[Q]), he instanceof l.HTMLLIElement)) {
                      fe(y, "li");
                      break;
                    }
                    if (Ne(he, S) && !Ne(he, m)) break;
                  }
                  C.inButtonScope("p") && fe(y, "p"), pe(t, T);
                  return;
                case "dd":
                case "dt":
                  for (He = !1, Q = C.elements.length - 1; Q >= 0; Q--) {
                    if (((he = C.elements[Q]), Ne(he, ie))) {
                      fe(y, he.localName);
                      break;
                    }
                    if (Ne(he, S) && !Ne(he, m)) break;
                  }
                  C.inButtonScope("p") && fe(y, "p"), pe(t, T);
                  return;
                case "plaintext":
                  C.inButtonScope("p") && fe(y, "p"), pe(t, T), (A = on);
                  return;
                case "button":
                  C.inScope("button")
                    ? (fe(y, "button"), j(e, t, T, M))
                    : (Ze(), pe(t, T), (He = !1));
                  return;
                case "a":
                  var Re = Te.findElementByTag("a");
                  Re && (fe(y, t), Te.remove(Re), C.removeElement(Re));
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  Ze(), Te.push(pe(t, T), T);
                  return;
                case "nobr":
                  Ze(), C.inScope(t) && (fe(y, t), Ze()), Te.push(pe(t, T), T);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  Ze(), pe(t, T), Te.insertMarker(), (He = !1);
                  return;
                case "table":
                  !Se._quirks && C.inButtonScope("p") && fe(y, "p"),
                    pe(t, T),
                    (He = !1),
                    (j = $e);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  Ze(), pe(t, T), C.pop(), (He = !1);
                  return;
                case "input":
                  Ze(), (we = pe(t, T)), C.pop();
                  var Ve = we.getAttribute("type");
                  (!Ve || Ve.toLowerCase() !== "hidden") && (He = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  pe(t, T), C.pop();
                  return;
                case "hr":
                  C.inButtonScope("p") && fe(y, "p"),
                    Ne(C.top, "menuitem") && C.pop(),
                    pe(t, T),
                    C.pop(),
                    (He = !1);
                  return;
                case "image":
                  fe(b, "img", T, M);
                  return;
                case "textarea":
                  pe(t, T), (Ut = !0), (He = !1), (A = Ct), (ht = j), (j = Ur);
                  return;
                case "xmp":
                  C.inButtonScope("p") && fe(y, "p"), Ze(), (He = !1), Ar(t, T);
                  return;
                case "iframe":
                  (He = !1), Ar(t, T);
                  return;
                case "noembed":
                  Ar(t, T);
                  return;
                case "select":
                  Ze(),
                    pe(t, T),
                    (He = !1),
                    j === $e || j === gn || j === Zt || j === mr || j === Yt
                      ? (j = Vr)
                      : (j = _t);
                  return;
                case "optgroup":
                case "option":
                  C.top instanceof l.HTMLOptionElement && fe(y, "option"),
                    Ze(),
                    pe(t, T);
                  return;
                case "menuitem":
                  Ne(C.top, "menuitem") && C.pop(), Ze(), pe(t, T);
                  return;
                case "rb":
                case "rtc":
                  C.inScope("ruby") && C.generateImpliedEndTags(), pe(t, T);
                  return;
                case "rp":
                case "rt":
                  C.inScope("ruby") && C.generateImpliedEndTags("rtc"),
                    pe(t, T);
                  return;
                case "math":
                  Ze(), sr(T), ut(T), an(t, T, n.MATHML), M && C.pop();
                  return;
                case "svg":
                  Ze(), ir(T), ut(T), an(t, T, n.SVG), M && C.pop();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "frame":
                case "head":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              Ze(), pe(t, T);
              return;
            case 3:
              switch (t) {
                case "template":
                  qe(y, t, T);
                  return;
                case "body":
                  if (!C.inScope("body")) return;
                  j = Xn;
                  return;
                case "html":
                  if (!C.inScope("body")) return;
                  (j = Xn), j(e, t, T);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "button":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "listing":
                case "main":
                case "menu":
                case "nav":
                case "ol":
                case "pre":
                case "section":
                case "summary":
                case "ul":
                  if (!C.inScope(t)) return;
                  C.generateImpliedEndTags(), C.popTag(t);
                  return;
                case "form":
                  if (C.contains("template")) {
                    if (!C.inScope("form")) return;
                    C.generateImpliedEndTags(), C.popTag("form");
                  } else {
                    var Je = pt;
                    if (((pt = null), !Je || !C.elementInScope(Je))) return;
                    C.generateImpliedEndTags(), C.removeElement(Je);
                  }
                  return;
                case "p":
                  C.inButtonScope(t)
                    ? (C.generateImpliedEndTags(t), C.popTag(t))
                    : (fe(b, t, null), j(e, t, T, M));
                  return;
                case "li":
                  if (!C.inListItemScope(t)) return;
                  C.generateImpliedEndTags(t), C.popTag(t);
                  return;
                case "dd":
                case "dt":
                  if (!C.inScope(t)) return;
                  C.generateImpliedEndTags(t), C.popTag(t);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!C.elementTypeInScope(l.HTMLHeadingElement)) return;
                  C.generateImpliedEndTags(),
                    C.popElementType(l.HTMLHeadingElement);
                  return;
                case "sarcasm":
                  break;
                case "a":
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "nobr":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  var rt = Ba(t);
                  if (rt) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!C.inScope(t)) return;
                  C.generateImpliedEndTags(), C.popTag(t), Te.clearToMarker();
                  return;
                case "br":
                  fe(b, t, null);
                  return;
              }
              for (Q = C.elements.length - 1; Q >= 0; Q--)
                if (((he = C.elements[Q]), Ne(he, t))) {
                  C.generateImpliedEndTags(t), C.popElement(he);
                  break;
                } else if (Ne(he, S)) return;
              return;
          }
        }
        function Ur(e, t, T, M) {
          switch (e) {
            case 1:
              st(t);
              return;
            case -1:
              C.top instanceof l.HTMLScriptElement &&
                (C.top._already_started = !0),
                C.pop(),
                (j = ht),
                j(e);
              return;
            case 3:
              t === "script" ? Fa() : (C.pop(), (j = ht));
              return;
            default:
              return;
          }
        }
        function $e(e, t, T, M) {
          function q(he) {
            for (var we = 0, Re = he.length; we < Re; we++)
              if (he[we][0] === "type") return he[we][1].toLowerCase();
            return null;
          }
          switch (e) {
            case 1:
              if (tn) {
                fe(e, t, T, M);
                return;
              } else if (Ne(C.top, J)) {
                (Sr = []), (ht = j), (j = Di), j(e, t, T, M);
                return;
              }
              break;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case 2:
              switch (t) {
                case "caption":
                  C.clearToContext(L), Te.insertMarker(), pe(t, T), (j = gn);
                  return;
                case "colgroup":
                  C.clearToContext(L), pe(t, T), (j = jr);
                  return;
                case "col":
                  $e(b, "colgroup", null), j(e, t, T, M);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  C.clearToContext(L), pe(t, T), (j = Zt);
                  return;
                case "td":
                case "th":
                case "tr":
                  $e(b, "tbody", null), j(e, t, T, M);
                  return;
                case "table":
                  if (!C.inTableScope(t)) return;
                  $e(y, t), j(e, t, T, M);
                  return;
                case "style":
                case "script":
                case "template":
                  qe(e, t, T, M);
                  return;
                case "input":
                  var Q = q(T);
                  if (Q !== "hidden") break;
                  pe(t, T), C.pop();
                  return;
                case "form":
                  if (pt || C.contains("template")) return;
                  (pt = pe(t, T)), C.popElement(pt);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "table":
                  if (!C.inTableScope(t)) return;
                  C.popTag(t), hr();
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
                case "template":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case -1:
              fe(e, t, T, M);
              return;
          }
          (kt = !0), fe(e, t, T, M), (kt = !1);
        }
        function Di(e, t, T, M) {
          if (e === E) {
            if (wt && ((t = t.replace(Ht, "")), t.length === 0)) return;
            Sr.push(t);
          } else {
            var q = Sr.join("");
            (Sr.length = 0),
              Ke.test(q) ? ((kt = !0), fe(E, q), (kt = !1)) : st(q),
              (j = ht),
              j(e, t, T, M);
          }
        }
        function gn(e, t, T, M) {
          function q() {
            return C.inTableScope("caption")
              ? (C.generateImpliedEndTags(),
                C.popTag("caption"),
                Te.clearToMarker(),
                (j = $e),
                !0)
              : !1;
          }
          switch (e) {
            case 2:
              switch (t) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  q() && j(e, t, T, M);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "caption":
                  q();
                  return;
                case "table":
                  q() && j(e, t, T, M);
                  return;
                case "body":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              break;
          }
          fe(e, t, T, M);
        }
        function jr(e, t, T, M) {
          switch (e) {
            case 1:
              var q = t.match(et);
              if (
                (q && (st(q[0]), (t = t.substring(q[0].length))),
                t.length === 0)
              )
                return;
              break;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "col":
                  pe(t, T), C.pop();
                  return;
                case "template":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "colgroup":
                  if (!Ne(C.top, "colgroup")) return;
                  C.pop(), (j = $e);
                  return;
                case "col":
                  return;
                case "template":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case -1:
              fe(e, t, T, M);
              return;
          }
          Ne(C.top, "colgroup") && (jr(y, "colgroup"), j(e, t, T, M));
        }
        function Zt(e, t, T, M) {
          function q() {
            (!C.inTableScope("tbody") &&
              !C.inTableScope("thead") &&
              !C.inTableScope("tfoot")) ||
              (C.clearToContext(P),
              Zt(y, C.top.localName, null),
              j(e, t, T, M));
          }
          switch (e) {
            case 2:
              switch (t) {
                case "tr":
                  C.clearToContext(P), pe(t, T), (j = mr);
                  return;
                case "th":
                case "td":
                  Zt(b, "tr", null), j(e, t, T, M);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  q();
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "table":
                  q();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  C.inTableScope(t) && (C.clearToContext(P), C.pop(), (j = $e));
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                case "tr":
                  return;
              }
              break;
          }
          $e(e, t, T, M);
        }
        function mr(e, t, T, M) {
          function q() {
            return C.inTableScope("tr")
              ? (C.clearToContext($), C.pop(), (j = Zt), !0)
              : !1;
          }
          switch (e) {
            case 2:
              switch (t) {
                case "th":
                case "td":
                  C.clearToContext($), pe(t, T), (j = Yt), Te.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  q() && j(e, t, T, M);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "tr":
                  q();
                  return;
                case "table":
                  q() && j(e, t, T, M);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  C.inTableScope(t) && q() && j(e, t, T, M);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                  return;
              }
              break;
          }
          $e(e, t, T, M);
        }
        function Yt(e, t, T, M) {
          switch (e) {
            case 2:
              switch (t) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  C.inTableScope("td")
                    ? (Yt(y, "td"), j(e, t, T, M))
                    : C.inTableScope("th") && (Yt(y, "th"), j(e, t, T, M));
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "td":
                case "th":
                  if (!C.inTableScope(t)) return;
                  C.generateImpliedEndTags(),
                    C.popTag(t),
                    Te.clearToMarker(),
                    (j = mr);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                  return;
                case "table":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  if (!C.inTableScope(t)) return;
                  Yt(y, C.inTableScope("td") ? "td" : "th"), j(e, t, T, M);
                  return;
              }
              break;
          }
          fe(e, t, T, M);
        }
        function _t(e, t, T, M) {
          switch (e) {
            case 1:
              if (wt && ((t = t.replace(Ht, "")), t.length === 0)) return;
              st(t);
              return;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case -1:
              fe(e, t, T, M);
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "option":
                  C.top instanceof l.HTMLOptionElement && _t(y, t), pe(t, T);
                  return;
                case "optgroup":
                  C.top instanceof l.HTMLOptionElement && _t(y, "option"),
                    C.top instanceof l.HTMLOptGroupElement && _t(y, t),
                    pe(t, T);
                  return;
                case "select":
                  _t(y, t);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!C.inSelectScope("select")) return;
                  _t(y, "select"), j(e, t, T, M);
                  return;
                case "script":
                case "template":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case 3:
              switch (t) {
                case "optgroup":
                  C.top instanceof l.HTMLOptionElement &&
                    C.elements[C.elements.length - 2] instanceof
                      l.HTMLOptGroupElement &&
                    _t(y, "option"),
                    C.top instanceof l.HTMLOptGroupElement && C.pop();
                  return;
                case "option":
                  C.top instanceof l.HTMLOptionElement && C.pop();
                  return;
                case "select":
                  if (!C.inSelectScope(t)) return;
                  C.popTag(t), hr();
                  return;
                case "template":
                  qe(e, t, T, M);
                  return;
              }
              break;
          }
        }
        function Vr(e, t, T, M) {
          switch (t) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (e) {
                case 2:
                  Vr(y, "select"), j(e, t, T, M);
                  return;
                case 3:
                  C.inTableScope(t) && (Vr(y, "select"), j(e, t, T, M));
                  return;
              }
          }
          _t(e, t, T, M);
        }
        function _n(e, t, T, M) {
          function q(Q) {
            (j = Q), (dt[dt.length - 1] = j), j(e, t, T, M);
          }
          switch (e) {
            case 1:
            case 4:
            case 5:
              fe(e, t, T, M);
              return;
            case -1:
              C.contains("template")
                ? (C.popTag("template"),
                  Te.clearToMarker(),
                  dt.pop(),
                  hr(),
                  j(e, t, T, M))
                : jt();
              return;
            case 2:
              switch (t) {
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  qe(e, t, T, M);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  q($e);
                  return;
                case "col":
                  q(jr);
                  return;
                case "tr":
                  q(Zt);
                  return;
                case "td":
                case "th":
                  q(mr);
                  return;
              }
              q(fe);
              return;
            case 3:
              switch (t) {
                case "template":
                  qe(e, t, T, M);
                  return;
                default:
                  return;
              }
          }
        }
        function Xn(e, t, T, M) {
          switch (e) {
            case 1:
              if (Ke.test(t)) break;
              fe(e, t);
              return;
            case 4:
              C.elements[0]._appendChild(Se.createComment(t));
              return;
            case 5:
              return;
            case -1:
              jt();
              return;
            case 2:
              if (t === "html") {
                fe(e, t, T, M);
                return;
              }
              break;
            case 3:
              if (t === "html") {
                if (Ft) return;
                j = Mi;
                return;
              }
              break;
          }
          (j = fe), j(e, t, T, M);
        }
        function bn(e, t, T, M) {
          switch (e) {
            case 1:
              (t = t.replace(Fe, "")), t.length > 0 && st(t);
              return;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case -1:
              jt();
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "frameset":
                  pe(t, T);
                  return;
                case "frame":
                  pe(t, T), C.pop();
                  return;
                case "noframes":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case 3:
              if (t === "frameset") {
                if (Ft && C.top instanceof l.HTMLHtmlElement) return;
                C.pop(),
                  !Ft && !(C.top instanceof l.HTMLFrameSetElement) && (j = Ai);
                return;
              }
              break;
          }
        }
        function Ai(e, t, T, M) {
          switch (e) {
            case 1:
              (t = t.replace(Fe, "")), t.length > 0 && st(t);
              return;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case -1:
              jt();
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "noframes":
                  qe(e, t, T, M);
                  return;
              }
              break;
            case 3:
              if (t === "html") {
                j = xi;
                return;
              }
              break;
          }
        }
        function Mi(e, t, T, M) {
          switch (e) {
            case 1:
              if (Ke.test(t)) break;
              fe(e, t, T, M);
              return;
            case 4:
              Se._appendChild(Se.createComment(t));
              return;
            case 5:
              fe(e, t, T, M);
              return;
            case -1:
              jt();
              return;
            case 2:
              if (t === "html") {
                fe(e, t, T, M);
                return;
              }
              break;
          }
          (j = fe), j(e, t, T, M);
        }
        function xi(e, t, T, M) {
          switch (e) {
            case 1:
              (t = t.replace(Fe, "")), t.length > 0 && fe(e, t, T, M);
              return;
            case 4:
              Se._appendChild(Se.createComment(t));
              return;
            case 5:
              fe(e, t, T, M);
              return;
            case -1:
              jt();
              return;
            case 2:
              switch (t) {
                case "html":
                  fe(e, t, T, M);
                  return;
                case "noframes":
                  qe(e, t, T, M);
                  return;
              }
              break;
          }
        }
        function Yn(e, t, T, M) {
          function q(Re) {
            for (var Ve = 0, Je = Re.length; Ve < Je; Ve++)
              switch (Re[Ve][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var Q;
          switch (e) {
            case 1:
              He && Ot.test(t) && (He = !1),
                wt && (t = t.replace(Ht, "\uFFFD")),
                st(t);
              return;
            case 4:
              it(t);
              return;
            case 5:
              return;
            case 2:
              switch (t) {
                case "font":
                  if (!q(T)) break;
                case "b":
                case "big":
                case "blockquote":
                case "body":
                case "br":
                case "center":
                case "code":
                case "dd":
                case "div":
                case "dl":
                case "dt":
                case "em":
                case "embed":
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                case "head":
                case "hr":
                case "i":
                case "img":
                case "li":
                case "listing":
                case "menu":
                case "meta":
                case "nobr":
                case "ol":
                case "p":
                case "pre":
                case "ruby":
                case "s":
                case "small":
                case "span":
                case "strong":
                case "strike":
                case "sub":
                case "sup":
                case "table":
                case "tt":
                case "u":
                case "ul":
                case "var":
                  if (Ft) break;
                  do C.pop(), (Q = C.top);
                  while (Q.namespaceURI !== n.HTML && !lt(Q) && !ar(Q));
                  Pe(e, t, T, M);
                  return;
              }
              (Q = C.elements.length === 1 && Ft ? V : C.top),
                Q.namespaceURI === n.MATHML
                  ? sr(T)
                  : Q.namespaceURI === n.SVG && ((t = Wt(t)), ir(T)),
                ut(T),
                an(t, T, Q.namespaceURI),
                M && (t === "script" && (Q.namespaceURI, n.SVG), C.pop());
              return;
            case 3:
              if (
                ((Q = C.top),
                t === "script" &&
                  Q.namespaceURI === n.SVG &&
                  Q.localName === "script")
              )
                C.pop();
              else
                for (var he = C.elements.length - 1, we = C.elements[he]; ; ) {
                  if (we.localName.toLowerCase() === t) {
                    C.popElement(we);
                    break;
                  }
                  if (((we = C.elements[--he]), we.namespaceURI === n.HTML)) {
                    j(e, t, T, M);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (kr.testTokenizer = function (e, t, T, M) {
            var q = [];
            switch (t) {
              case "PCDATA state":
                A = ye;
                break;
              case "RCDATA state":
                A = Ct;
                break;
              case "RAWTEXT state":
                A = dr;
                break;
              case "PLAINTEXT state":
                A = on;
                break;
            }
            if (
              (T && (Tr = T),
              (Pe = function (he, we, Re, Ve) {
                switch ((Xt(), he)) {
                  case 1:
                    q.length > 0 && q[q.length - 1][0] === "Character"
                      ? (q[q.length - 1][1] += we)
                      : q.push(["Character", we]);
                    break;
                  case 4:
                    q.push(["Comment", we]);
                    break;
                  case 5:
                    q.push([
                      "DOCTYPE",
                      we,
                      Re === void 0 ? null : Re,
                      Ve === void 0 ? null : Ve,
                      !en,
                    ]);
                    break;
                  case 2:
                    for (
                      var Je = Object.create(null), rt = 0;
                      rt < Re.length;
                      rt++
                    ) {
                      var zt = Re[rt];
                      zt.length === 1 ? (Je[zt[0]] = "") : (Je[zt[0]] = zt[1]);
                    }
                    var xt = ["StartTag", we, Je];
                    Ve && xt.push(!0), q.push(xt);
                    break;
                  case 3:
                    q.push(["EndTag", we]);
                    break;
                  case -1:
                    break;
                }
              }),
              !M)
            )
              this.parse(e, !0);
            else {
              for (var Q = 0; Q < e.length; Q++) this.parse(e[Q]);
              this.parse("", !0);
            }
            return q;
          }),
          kr
        );
      }
    },
  }),
  Jr = ue({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(v, N) {
      "use strict";
      N.exports = l;
      var d = Dn(),
        u = An(),
        a = Mn(),
        n = Be(),
        c = wn();
      function l(s) {
        this.contextObject = s;
      }
      var h = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      l.prototype = {
        hasFeature: function (E, b) {
          var y = h[(E || "").toLowerCase()];
          return (y && y[b || ""]) || !1;
        },
        createDocumentType: function (E, b, y) {
          return (
            c.isValidQName(E) || n.InvalidCharacterError(),
            new u(this.contextObject, E, b, y)
          );
        },
        createDocument: function (E, b, y) {
          var x = new d(!1, null),
            R;
          return (
            b ? (R = x.createElementNS(E, b)) : (R = null),
            y && x.appendChild(y),
            R && x.appendChild(R),
            E === n.NAMESPACE.HTML
              ? (x._contentType = "application/xhtml+xml")
              : E === n.NAMESPACE.SVG
                ? (x._contentType = "image/svg+xml")
                : (x._contentType = "application/xml"),
            x
          );
        },
        createHTMLDocument: function (E) {
          var b = new d(!0, null);
          b.appendChild(new u(b, "html"));
          var y = b.createElement("html");
          b.appendChild(y);
          var x = b.createElement("head");
          if ((y.appendChild(x), E !== void 0)) {
            var R = b.createElement("title");
            x.appendChild(R), R.appendChild(b.createTextNode(E));
          }
          return y.appendChild(b.createElement("body")), (b.modclock = 1), b;
        },
        mozSetOutputMutationHandler: function (s, E) {
          s.mutationHandler = E;
        },
        mozGetInputMutationHandler: function (s) {
          n.nyi();
        },
        mozHTMLParser: a,
      };
    },
  }),
  is = ue({
    "external/npm/node_modules/domino/lib/Location.js"(v, N) {
      "use strict";
      var d = kn(),
        u = Ca();
      N.exports = a;
      function a(n, c) {
        (this._window = n), (this._href = c);
      }
      a.prototype = Object.create(u.prototype, {
        constructor: { value: a },
        href: {
          get: function () {
            return this._href;
          },
          set: function (n) {
            this.assign(n);
          },
        },
        assign: {
          value: function (n) {
            var c = new d(this._href),
              l = c.resolve(n);
            this._href = l;
          },
        },
        replace: {
          value: function (n) {
            this.assign(n);
          },
        },
        reload: {
          value: function () {
            this.assign(this.href);
          },
        },
        toString: {
          value: function () {
            return this.href;
          },
        },
      });
    },
  }),
  ss = ue({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(v, N) {
      "use strict";
      var d = Object.create(null, {
        appCodeName: { value: "Mozilla" },
        appName: { value: "Netscape" },
        appVersion: { value: "4.0" },
        platform: { value: "" },
        product: { value: "Gecko" },
        productSub: { value: "20100101" },
        userAgent: { value: "" },
        vendor: { value: "" },
        vendorSub: { value: "" },
        taintEnabled: {
          value: function () {
            return !1;
          },
        },
      });
      N.exports = d;
    },
  }),
  os = ue({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(v, N) {
      "use strict";
      var d = { setTimeout, clearTimeout, setInterval, clearInterval };
      N.exports = d;
    },
  }),
  Aa = ue({
    "external/npm/node_modules/domino/lib/impl.js"(v, N) {
      "use strict";
      var d = Be();
      (v = N.exports =
        {
          CSSStyleDeclaration: Cn(),
          CharacterData: Qr(),
          Comment: ya(),
          DOMException: vn(),
          DOMImplementation: Jr(),
          DOMTokenList: _a(),
          Document: Dn(),
          DocumentFragment: wa(),
          DocumentType: An(),
          Element: Er(),
          HTMLParser: Mn(),
          NamedNodeMap: Ea(),
          Node: Ge(),
          NodeList: rr(),
          NodeFilter: $r(),
          ProcessingInstruction: Na(),
          Text: Ta(),
          Window: Ma(),
        }),
        d.merge(v, ka()),
        d.merge(v, Ln().elements),
        d.merge(v, Da().elements);
    },
  }),
  Ma = ue({
    "external/npm/node_modules/domino/lib/Window.js"(v, N) {
      "use strict";
      var d = Jr(),
        u = da(),
        a = is(),
        n = Be();
      N.exports = c;
      function c(l) {
        (this.document = l || new d(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new a(
            this,
            this.document._address || "about:blank",
          ));
      }
      (c.prototype = Object.create(u.prototype, {
        console: { value: console },
        history: { value: { back: n.nyi, forward: n.nyi, go: n.nyi } },
        navigator: { value: ss() },
        window: {
          get: function () {
            return this;
          },
        },
        self: {
          get: function () {
            return this;
          },
        },
        frames: {
          get: function () {
            return this;
          },
        },
        parent: {
          get: function () {
            return this;
          },
        },
        top: {
          get: function () {
            return this;
          },
        },
        length: { value: 0 },
        frameElement: { value: null },
        opener: { value: null },
        onload: {
          get: function () {
            return this._getEventHandler("load");
          },
          set: function (l) {
            this._setEventHandler("load", l);
          },
        },
        getComputedStyle: {
          value: function (h) {
            return h.style;
          },
        },
      })),
        n.expose(os(), c),
        n.expose(Aa(), c);
    },
  }),
  cs = ue({
    "external/npm/node_modules/domino/lib/index.js"(v) {
      var N = Jr(),
        d = Mn(),
        u = Ma(),
        a = Aa();
      (v.createDOMImplementation = function () {
        return new N(null);
      }),
        (v.createDocument = function (n, c) {
          if (n || c) {
            var l = new d();
            return l.parse(n || "", !0), l.document();
          }
          return new N(null).createHTMLDocument("");
        }),
        (v.createIncrementalHTMLParser = function () {
          var n = new d();
          return {
            write: function (c) {
              c.length > 0 &&
                n.parse(c, !1, function () {
                  return !0;
                });
            },
            end: function (c) {
              n.parse(c || "", !0, function () {
                return !0;
              });
            },
            process: function (c) {
              return n.parse("", !1, c);
            },
            document: function () {
              return n.document();
            },
          };
        }),
        (v.createWindow = function (n, c) {
          var l = v.createDocument(n);
          return c !== void 0 && (l._address = c), new a.Window(l);
        }),
        (v.impl = a);
    },
  }),
  ua = cs();
function ls() {
  Object.assign(globalThis, ua.impl),
    (globalThis.KeyboardEvent = ua.impl.Event);
}
ls();
