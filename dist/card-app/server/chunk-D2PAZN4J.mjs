import "./polyfills.server.mjs";
import { a as ee, b as nt, e as Ua, i as ei } from "./chunk-3CVZQN5Z.mjs";
var Wg = null,
  Va = !1,
  sd = 1,
  $a = Symbol("SIGNAL");
function xe(t) {
  let e = Wg;
  return (Wg = t), e;
}
function uT() {
  return Va;
}
var ad = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function dT(t) {
  if (!(fd(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === sd)) {
    if (!t.producerMustRecompute(t) && !za(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = sd);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = sd);
  }
}
function fT(t) {
  if (t.liveConsumerNode === void 0) return;
  let e = Va;
  Va = !0;
  try {
    for (let n of t.liveConsumerNode) n.dirty || Qg(n);
  } finally {
    Va = e;
  }
}
function Qg(t) {
  (t.dirty = !0), fT(t), t.consumerMarkedDirty?.(t);
}
function cd(t) {
  return t && (t.nextProducerIndex = 0), xe(t);
}
function ld(t, e) {
  if (
    (xe(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (fd(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        dd(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function za(t) {
  qa(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (dT(n), r !== n.version)) return !0;
  }
  return !1;
}
function ud(t) {
  if ((qa(t), fd(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      dd(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function dd(t, e) {
  if ((hT(t), qa(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      dd(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    qa(i), (i.producerIndexOfThis[r] = e);
  }
}
function fd(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function qa(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function hT(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function pT() {
  throw new Error();
}
var mT = pT;
function Kg(t) {
  mT = t;
}
function Yg(t, e, n) {
  let r = Object.create(gT);
  n && (r.consumerAllowSignalWrites = !0), (r.fn = t), (r.schedule = e);
  let i = (c) => {
    r.cleanupFn = c;
  };
  function s(c) {
    return c.fn === null && c.schedule === null;
  }
  function o(c) {
    s(c) ||
      (ud(c),
      c.cleanupFn(),
      (c.fn = null),
      (c.schedule = null),
      (c.cleanupFn = od));
  }
  let a = () => {
    if (r.fn === null) return;
    if (uT())
      throw new Error(
        "Schedulers cannot synchronously execute watches while scheduling.",
      );
    if (((r.dirty = !1), r.hasRun && !za(r))) return;
    r.hasRun = !0;
    let c = cd(r);
    try {
      r.cleanupFn(), (r.cleanupFn = od), r.fn(i);
    } finally {
      ld(r, c);
    }
  };
  return (
    (r.ref = {
      notify: () => Qg(r),
      run: a,
      cleanup: () => r.cleanupFn(),
      destroy: () => o(r),
      [$a]: r,
    }),
    r.ref
  );
}
var od = () => {},
  gT = nt(ee({}, ad), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !1,
    consumerMarkedDirty: (t) => {
      t.schedule !== null && t.schedule(t.ref);
    },
    hasRun: !1,
    cleanupFn: od,
  });
function ue(t) {
  return typeof t == "function";
}
function Pi(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Ga = Pi(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    },
);
function ti(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var rt = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let s of n) s.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (ue(r))
        try {
          r();
        } catch (s) {
          e = s instanceof Ga ? s.errors : [s];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let s of i)
          try {
            Zg(s);
          } catch (o) {
            (e = e ?? []),
              o instanceof Ga ? (e = [...e, ...o.errors]) : e.push(o);
          }
      }
      if (e) throw new Ga(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) Zg(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && ti(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && ti(n, e), e instanceof t && e._removeParent(this);
  }
};
rt.EMPTY = (() => {
  let t = new rt();
  return (t.closed = !0), t;
})();
var hd = rt.EMPTY;
function Wa(t) {
  return (
    t instanceof rt ||
    (t && "closed" in t && ue(t.remove) && ue(t.add) && ue(t.unsubscribe))
  );
}
function Zg(t) {
  ue(t) ? t() : t.unsubscribe();
}
var sn = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Fi = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = Fi;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = Fi;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Qa(t) {
  Fi.setTimeout(() => {
    let { onUnhandledError: e } = sn;
    if (e) e(t);
    else throw t;
  });
}
function ni() {}
var Xg = pd("C", void 0, void 0);
function Jg(t) {
  return pd("E", void 0, t);
}
function ey(t) {
  return pd("N", t, void 0);
}
function pd(t, e, n) {
  return { kind: t, value: e, error: n };
}
var ri = null;
function ji(t) {
  if (sn.useDeprecatedSynchronousErrorHandling) {
    let e = !ri;
    if ((e && (ri = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = ri;
      if (((ri = null), n)) throw r;
    }
  } else t();
}
function ty(t) {
  sn.useDeprecatedSynchronousErrorHandling &&
    ri &&
    ((ri.errorThrown = !0), (ri.error = t));
}
var ii = class extends rt {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Wa(e) && e.add(this))
          : (this.destination = ET);
    }
    static create(e, n, r) {
      return new Vn(e, n, r);
    }
    next(e) {
      this.isStopped ? gd(ey(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? gd(Jg(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? gd(Xg, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  yT = Function.prototype.bind;
function md(t, e) {
  return yT.call(t, e);
}
var yd = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          Ka(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          Ka(r);
        }
      else Ka(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          Ka(n);
        }
    }
  },
  Vn = class extends ii {
    constructor(e, n, r) {
      super();
      let i;
      if (ue(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let s;
        this && sn.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && md(e.next, s),
              error: e.error && md(e.error, s),
              complete: e.complete && md(e.complete, s),
            }))
          : (i = e);
      }
      this.destination = new yd(i);
    }
  };
function Ka(t) {
  sn.useDeprecatedSynchronousErrorHandling ? ty(t) : Qa(t);
}
function vT(t) {
  throw t;
}
function gd(t, e) {
  let { onStoppedNotification: n } = sn;
  n && Fi.setTimeout(() => n(t, e));
}
var ET = { closed: !0, next: ni, error: vT, complete: ni };
var Bi = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function _t(t) {
  return t;
}
function vd(...t) {
  return Ed(t);
}
function Ed(t) {
  return t.length === 0
    ? _t
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n);
        };
}
var Ae = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let s = wT(n) ? n : new Vn(n, r, i);
      return (
        ji(() => {
          let { operator: o, source: a } = this;
          s.add(
            o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s),
          );
        }),
        s
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = ny(r)),
        new r((i, s) => {
          let o = new Vn({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                s(c), o.unsubscribe();
              }
            },
            error: s,
            complete: i,
          });
          this.subscribe(o);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Bi]() {
      return this;
    }
    pipe(...n) {
      return Ed(n)(this);
    }
    toPromise(n) {
      return (
        (n = ny(n)),
        new n((r, i) => {
          let s;
          this.subscribe(
            (o) => (s = o),
            (o) => i(o),
            () => r(s),
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function ny(t) {
  var e;
  return (e = t ?? sn.Promise) !== null && e !== void 0 ? e : Promise;
}
function bT(t) {
  return t && ue(t.next) && ue(t.error) && ue(t.complete);
}
function wT(t) {
  return (t && t instanceof ii) || (bT(t) && Wa(t));
}
function bd(t) {
  return ue(t?.lift);
}
function ye(t) {
  return (e) => {
    if (bd(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function me(t, e, n, r, i) {
  return new wd(t, e, n, r, i);
}
var wd = class extends ii {
  constructor(e, n, r, i, s, o) {
    super(e),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Hi() {
  return ye((t, e) => {
    let n = null;
    t._refCount++;
    let r = me(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        s = n;
      (n = null), i && (!s || i === s) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var Ui = class extends Ae {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      bd(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new rt();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          me(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown(),
          ),
        ),
      ),
        e.closed && ((this._connection = null), (e = rt.EMPTY));
    }
    return e;
  }
  refCount() {
    return Hi()(this);
  }
};
var ry = Pi(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var it = (() => {
    class t extends Ae {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Ya(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new ry();
      }
      next(n) {
        ji(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        ji(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        ji(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: s } = this;
        return r || i
          ? hd
          : ((this.currentObservers = null),
            s.push(n),
            new rt(() => {
              (this.currentObservers = null), ti(s, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this;
        r ? n.error(i) : s && n.complete();
      }
      asObservable() {
        let n = new Ae();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new Ya(e, n)), t;
  })(),
  Ya = class extends it {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : hd;
    }
  };
var ht = class extends it {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Gs = {
  now() {
    return (Gs.delegate || Date).now();
  },
  delegate: void 0,
};
var Za = class extends it {
  constructor(e = 1 / 0, n = 1 / 0, r = Gs) {
    super(),
      (this._bufferSize = e),
      (this._windowTime = n),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = n === 1 / 0),
      (this._bufferSize = Math.max(1, e)),
      (this._windowTime = Math.max(1, n));
  }
  next(e) {
    let {
      isStopped: n,
      _buffer: r,
      _infiniteTimeWindow: i,
      _timestampProvider: s,
      _windowTime: o,
    } = this;
    n || (r.push(e), !i && r.push(s.now() + o)),
      this._trimBuffer(),
      super.next(e);
  }
  _subscribe(e) {
    this._throwIfClosed(), this._trimBuffer();
    let n = this._innerSubscribe(e),
      { _infiniteTimeWindow: r, _buffer: i } = this,
      s = i.slice();
    for (let o = 0; o < s.length && !e.closed; o += r ? 1 : 2) e.next(s[o]);
    return this._checkFinalizedStatuses(e), n;
  }
  _trimBuffer() {
    let {
        _bufferSize: e,
        _timestampProvider: n,
        _buffer: r,
        _infiniteTimeWindow: i,
      } = this,
      s = (i ? 1 : 2) * e;
    if ((e < 1 / 0 && s < r.length && r.splice(0, r.length - s), !i)) {
      let o = n.now(),
        a = 0;
      for (let c = 1; c < r.length && r[c] <= o; c += 2) a = c;
      a && r.splice(0, a + 1);
    }
  }
};
var Xa = class extends rt {
  constructor(e, n) {
    super();
  }
  schedule(e, n = 0) {
    return this;
  }
};
var Ws = {
  setInterval(t, e, ...n) {
    let { delegate: r } = Ws;
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n);
  },
  clearInterval(t) {
    let { delegate: e } = Ws;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Vi = class extends Xa {
  constructor(e, n) {
    super(e, n), (this.scheduler = e), (this.work = n), (this.pending = !1);
  }
  schedule(e, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      s = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(s, i, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(s, this.id, n)),
      this
    );
  }
  requestAsyncId(e, n, r = 0) {
    return Ws.setInterval(e.flush.bind(e, this), r);
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && Ws.clearInterval(n);
  }
  execute(e, n) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let r = this._execute(e, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, n) {
    let r = !1,
      i;
    try {
      this.work(e);
    } catch (s) {
      (r = !0), (i = s || new Error("Scheduled action threw falsy error"));
    }
    if (r) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: n } = this,
        { actions: r } = n;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        ti(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var DT = 1,
  Dd,
  _d = {};
function iy(t) {
  return t in _d ? (delete _d[t], !0) : !1;
}
var sy = {
  setImmediate(t) {
    let e = DT++;
    return (
      (_d[e] = !0),
      Dd || (Dd = Promise.resolve()),
      Dd.then(() => iy(e) && t()),
      e
    );
  },
  clearImmediate(t) {
    iy(t);
  },
};
var { setImmediate: _T, clearImmediate: TT } = sy,
  Qs = {
    setImmediate(...t) {
      let { delegate: e } = Qs;
      return (e?.setImmediate || _T)(...t);
    },
    clearImmediate(t) {
      let { delegate: e } = Qs;
      return (e?.clearImmediate || TT)(t);
    },
    delegate: void 0,
  };
var Ja = class extends Vi {
  constructor(e, n) {
    super(e, n), (this.scheduler = e), (this.work = n);
  }
  requestAsyncId(e, n, r = 0) {
    return r !== null && r > 0
      ? super.requestAsyncId(e, n, r)
      : (e.actions.push(this),
        e._scheduled ||
          (e._scheduled = Qs.setImmediate(e.flush.bind(e, void 0))));
  }
  recycleAsyncId(e, n, r = 0) {
    var i;
    if (r != null ? r > 0 : this.delay > 0)
      return super.recycleAsyncId(e, n, r);
    let { actions: s } = e;
    n != null &&
      ((i = s[s.length - 1]) === null || i === void 0 ? void 0 : i.id) !== n &&
      (Qs.clearImmediate(n), e._scheduled === n && (e._scheduled = void 0));
  }
};
var qi = class t {
  constructor(e, n = t.now) {
    (this.schedulerActionCtor = e), (this.now = n);
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n);
  }
};
qi.now = Gs.now;
var $i = class extends qi {
  constructor(e, n = qi.now) {
    super(e, n), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: n } = this;
    if (this._active) {
      n.push(e);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = e.execute(e.state, e.delay))) break;
    while ((e = n.shift()));
    if (((this._active = !1), r)) {
      for (; (e = n.shift()); ) e.unsubscribe();
      throw r;
    }
  }
};
var ec = class extends $i {
  flush(e) {
    this._active = !0;
    let n = this._scheduled;
    this._scheduled = void 0;
    let { actions: r } = this,
      i;
    e = e || r.shift();
    do if ((i = e.execute(e.state, e.delay))) break;
    while ((e = r[0]) && e.id === n && r.shift());
    if (((this._active = !1), i)) {
      for (; (e = r[0]) && e.id === n && r.shift(); ) e.unsubscribe();
      throw i;
    }
  }
};
var ST = new ec(Ja);
var si = new $i(Vi),
  oy = si;
var Tt = new Ae((t) => t.complete());
function tc(t) {
  return t && ue(t.schedule);
}
function Td(t) {
  return t[t.length - 1];
}
function nc(t) {
  return ue(Td(t)) ? t.pop() : void 0;
}
function En(t) {
  return tc(Td(t)) ? t.pop() : void 0;
}
function ay(t, e) {
  return typeof Td(t) == "number" ? t.pop() : e;
}
function XP(t, e) {
  var n = {};
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) &&
      e.indexOf(r) < 0 &&
      (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(t); i < r.length; i++)
      e.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(t, r[i]) &&
        (n[r[i]] = t[r[i]]);
  return n;
}
function ly(t, e, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s);
        });
  }
  return new (n || (n = Promise))(function (s, o) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        o(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        o(d);
      }
    }
    function l(u) {
      u.done ? s(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
}
function cy(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function oi(t) {
  return this instanceof oi ? ((this.v = t), this) : new oi(t);
}
function uy(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    s = [];
  return (
    (i = {}),
    o("next"),
    o("throw"),
    o("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function o(m) {
    r[m] &&
      (i[m] = function (E) {
        return new Promise(function (C, M) {
          s.push([m, E, C, M]) > 1 || a(m, E);
        });
      });
  }
  function a(m, E) {
    try {
      c(r[m](E));
    } catch (C) {
      d(s[0][3], C);
    }
  }
  function c(m) {
    m.value instanceof oi
      ? Promise.resolve(m.value.v).then(l, u)
      : d(s[0][2], m);
  }
  function l(m) {
    a("next", m);
  }
  function u(m) {
    a("throw", m);
  }
  function d(m, E) {
    m(E), s.shift(), s.length && a(s[0][0], s[0][1]);
  }
}
function dy(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof cy == "function" ? cy(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(s) {
    n[s] =
      t[s] &&
      function (o) {
        return new Promise(function (a, c) {
          (o = t[s](o)), i(a, c, o.done, o.value);
        });
      };
  }
  function i(s, o, a, c) {
    Promise.resolve(c).then(function (l) {
      s({ value: l, done: a });
    }, o);
  }
}
var zi = (t) => t && typeof t.length == "number" && typeof t != "function";
function rc(t) {
  return ue(t?.then);
}
function ic(t) {
  return ue(t[Bi]);
}
function sc(t) {
  return Symbol.asyncIterator && ue(t?.[Symbol.asyncIterator]);
}
function oc(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function CT() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var ac = CT();
function cc(t) {
  return ue(t?.[ac]);
}
function lc(t) {
  return uy(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield oi(n.read());
        if (i) return yield oi(void 0);
        yield yield oi(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function uc(t) {
  return ue(t?.getReader);
}
function Pe(t) {
  if (t instanceof Ae) return t;
  if (t != null) {
    if (ic(t)) return IT(t);
    if (zi(t)) return MT(t);
    if (rc(t)) return NT(t);
    if (sc(t)) return fy(t);
    if (cc(t)) return AT(t);
    if (uc(t)) return xT(t);
  }
  throw oc(t);
}
function IT(t) {
  return new Ae((e) => {
    let n = t[Bi]();
    if (ue(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function MT(t) {
  return new Ae((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function NT(t) {
  return new Ae((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n),
    ).then(null, Qa);
  });
}
function AT(t) {
  return new Ae((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function fy(t) {
  return new Ae((e) => {
    RT(t, e).catch((n) => e.error(n));
  });
}
function xT(t) {
  return fy(lc(t));
}
function RT(t, e) {
  var n, r, i, s;
  return ly(this, void 0, void 0, function* () {
    try {
      for (n = dy(t); (r = yield n.next()), !r.done; ) {
        let o = r.value;
        if ((e.next(o), e.closed)) return;
      }
    } catch (o) {
      i = { error: o };
    } finally {
      try {
        r && !r.done && (s = n.return) && (yield s.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Ot(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(s), !i)) return s;
}
function dc(t, e = 0) {
  return ye((n, r) => {
    n.subscribe(
      me(
        r,
        (i) => Ot(r, t, () => r.next(i), e),
        () => Ot(r, t, () => r.complete(), e),
        (i) => Ot(r, t, () => r.error(i), e),
      ),
    );
  });
}
function fc(t, e = 0) {
  return ye((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function hy(t, e) {
  return Pe(t).pipe(fc(e), dc(e));
}
function py(t, e) {
  return Pe(t).pipe(fc(e), dc(e));
}
function my(t, e) {
  return new Ae((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function gy(t, e) {
  return new Ae((n) => {
    let r;
    return (
      Ot(n, e, () => {
        (r = t[ac]()),
          Ot(
            n,
            e,
            () => {
              let i, s;
              try {
                ({ value: i, done: s } = r.next());
              } catch (o) {
                n.error(o);
                return;
              }
              s ? n.complete() : n.next(i);
            },
            0,
            !0,
          );
      }),
      () => ue(r?.return) && r.return()
    );
  });
}
function hc(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new Ae((n) => {
    Ot(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      Ot(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function yy(t, e) {
  return hc(lc(t), e);
}
function vy(t, e) {
  if (t != null) {
    if (ic(t)) return hy(t, e);
    if (zi(t)) return my(t, e);
    if (rc(t)) return py(t, e);
    if (sc(t)) return hc(t, e);
    if (cc(t)) return gy(t, e);
    if (uc(t)) return yy(t, e);
  }
  throw oc(t);
}
function Ke(t, e) {
  return e ? vy(t, e) : Pe(t);
}
function he(...t) {
  let e = En(t);
  return Ke(t, e);
}
function Gi(t, e) {
  let n = ue(t) ? t : () => t,
    r = (i) => i.error(n());
  return new Ae(e ? (i) => e.schedule(r, 0, i) : r);
}
function Sd(t) {
  return !!t && (t instanceof Ae || (ue(t.lift) && ue(t.subscribe)));
}
var qn = Pi(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function Ey(t) {
  return t instanceof Date && !isNaN(t);
}
function Te(t, e) {
  return ye((n, r) => {
    let i = 0;
    n.subscribe(
      me(r, (s) => {
        r.next(t.call(e, s, i++));
      }),
    );
  });
}
var { isArray: OT } = Array;
function kT(t, e) {
  return OT(e) ? t(...e) : t(e);
}
function Wi(t) {
  return Te((e) => kT(t, e));
}
var { isArray: LT } = Array,
  { getPrototypeOf: PT, prototype: FT, keys: jT } = Object;
function pc(t) {
  if (t.length === 1) {
    let e = t[0];
    if (LT(e)) return { args: e, keys: null };
    if (BT(e)) {
      let n = jT(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function BT(t) {
  return t && typeof t == "object" && PT(t) === FT;
}
function mc(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function gc(...t) {
  let e = En(t),
    n = nc(t),
    { args: r, keys: i } = pc(t);
  if (r.length === 0) return Ke([], e);
  let s = new Ae(HT(r, e, i ? (o) => mc(i, o) : _t));
  return n ? s.pipe(Wi(n)) : s;
}
function HT(t, e, n = _t) {
  return (r) => {
    by(
      e,
      () => {
        let { length: i } = t,
          s = new Array(i),
          o = i,
          a = i;
        for (let c = 0; c < i; c++)
          by(
            e,
            () => {
              let l = Ke(t[c], e),
                u = !1;
              l.subscribe(
                me(
                  r,
                  (d) => {
                    (s[c] = d), u || ((u = !0), a--), a || r.next(n(s.slice()));
                  },
                  () => {
                    --o || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function by(t, e, n) {
  t ? Ot(n, t, e) : e();
}
function wy(t, e, n, r, i, s, o, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    m = () => {
      d && !c.length && !l && e.complete();
    },
    E = (M) => (l < r ? C(M) : c.push(M)),
    C = (M) => {
      s && e.next(M), l++;
      let P = !1;
      Pe(n(M, u++)).subscribe(
        me(
          e,
          (A) => {
            i?.(A), s ? E(A) : e.next(A);
          },
          () => {
            P = !0;
          },
          void 0,
          () => {
            if (P)
              try {
                for (l--; c.length && l < r; ) {
                  let A = c.shift();
                  o ? Ot(e, o, () => C(A)) : C(A);
                }
                m();
              } catch (A) {
                e.error(A);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      me(e, E, () => {
        (d = !0), m();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function Ye(t, e, n = 1 / 0) {
  return ue(e)
    ? Ye((r, i) => Te((s, o) => e(r, s, i, o))(Pe(t(r, i))), n)
    : (typeof e == "number" && (n = e), ye((r, i) => wy(r, i, t, n)));
}
function Ks(t = 1 / 0) {
  return Ye(_t, t);
}
function Dy() {
  return Ks(1);
}
function vr(...t) {
  return Dy()(Ke(t, En(t)));
}
function yc(t) {
  return new Ae((e) => {
    Pe(t()).subscribe(e);
  });
}
function UT(...t) {
  let e = nc(t),
    { args: n, keys: r } = pc(t),
    i = new Ae((s) => {
      let { length: o } = n;
      if (!o) {
        s.complete();
        return;
      }
      let a = new Array(o),
        c = o,
        l = o;
      for (let u = 0; u < o; u++) {
        let d = !1;
        Pe(n[u]).subscribe(
          me(
            s,
            (m) => {
              d || ((d = !0), l--), (a[u] = m);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || s.next(r ? mc(r, a) : a), s.complete());
            },
          ),
        );
      }
    });
  return e ? i.pipe(Wi(e)) : i;
}
var VT = ["addListener", "removeListener"],
  qT = ["addEventListener", "removeEventListener"],
  $T = ["on", "off"];
function Cd(t, e, n, r) {
  if ((ue(n) && ((r = n), (n = void 0)), r)) return Cd(t, e, n).pipe(Wi(r));
  let [i, s] = WT(t)
    ? qT.map((o) => (a) => t[o](e, a, n))
    : zT(t)
      ? VT.map(_y(t, e))
      : GT(t)
        ? $T.map(_y(t, e))
        : [];
  if (!i && zi(t)) return Ye((o) => Cd(o, e, n))(Pe(t));
  if (!i) throw new TypeError("Invalid event target");
  return new Ae((o) => {
    let a = (...c) => o.next(1 < c.length ? c : c[0]);
    return i(a), () => s(a);
  });
}
function _y(t, e) {
  return (n) => (r) => t[n](e, r);
}
function zT(t) {
  return ue(t.addListener) && ue(t.removeListener);
}
function GT(t) {
  return ue(t.on) && ue(t.off);
}
function WT(t) {
  return ue(t.addEventListener) && ue(t.removeEventListener);
}
function vc(t = 0, e, n = oy) {
  let r = -1;
  return (
    e != null && (tc(e) ? (n = e) : (r = e)),
    new Ae((i) => {
      let s = Ey(t) ? +t - n.now() : t;
      s < 0 && (s = 0);
      let o = 0;
      return n.schedule(function () {
        i.closed ||
          (i.next(o++), 0 <= r ? this.schedule(void 0, r) : i.complete());
      }, s);
    })
  );
}
function QT(...t) {
  let e = En(t),
    n = ay(t, 1 / 0),
    r = t;
  return r.length ? (r.length === 1 ? Pe(r[0]) : Ks(n)(Ke(r, e))) : Tt;
}
function St(t, e) {
  return ye((n, r) => {
    let i = 0;
    n.subscribe(me(r, (s) => t.call(e, s, i++) && r.next(s)));
  });
}
function Ty(t) {
  return ye((e, n) => {
    let r = !1,
      i = null,
      s = null,
      o = !1,
      a = () => {
        if ((s?.unsubscribe(), (s = null), r)) {
          r = !1;
          let l = i;
          (i = null), n.next(l);
        }
        o && n.complete();
      },
      c = () => {
        (s = null), o && n.complete();
      };
    e.subscribe(
      me(
        n,
        (l) => {
          (r = !0), (i = l), s || Pe(t(l)).subscribe((s = me(n, a, c)));
        },
        () => {
          (o = !0), (!r || !s || s.closed) && n.complete();
        },
      ),
    );
  });
}
function KT(t, e = si) {
  return Ty(() => vc(t, e));
}
function Er(t) {
  return ye((e, n) => {
    let r = null,
      i = !1,
      s;
    (r = e.subscribe(
      me(n, void 0, void 0, (o) => {
        (s = Pe(t(o, Er(t)(e)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0);
      }),
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n));
  });
}
function Sy(t, e, n, r, i) {
  return (s, o) => {
    let a = n,
      c = e,
      l = 0;
    s.subscribe(
      me(
        o,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), r && o.next(c);
        },
        i &&
          (() => {
            a && o.next(c), o.complete();
          }),
      ),
    );
  };
}
function br(t, e) {
  return ue(e) ? Ye(t, e, 1) : Ye(t, 1);
}
function YT(t, e = si) {
  return ye((n, r) => {
    let i = null,
      s = null,
      o = null,
      a = () => {
        if (i) {
          i.unsubscribe(), (i = null);
          let l = s;
          (s = null), r.next(l);
        }
      };
    function c() {
      let l = o + t,
        u = e.now();
      if (u < l) {
        (i = this.schedule(void 0, l - u)), r.add(i);
        return;
      }
      a();
    }
    n.subscribe(
      me(
        r,
        (l) => {
          (s = l), (o = e.now()), i || ((i = e.schedule(c, t)), r.add(i));
        },
        () => {
          a(), r.complete();
        },
        void 0,
        () => {
          s = i = null;
        },
      ),
    );
  });
}
function wr(t) {
  return ye((e, n) => {
    let r = !1;
    e.subscribe(
      me(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(t), n.complete();
        },
      ),
    );
  });
}
function Zt(t) {
  return t <= 0
    ? () => Tt
    : ye((e, n) => {
        let r = 0;
        e.subscribe(
          me(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          }),
        );
      });
}
function Cy() {
  return ye((t, e) => {
    t.subscribe(me(e, ni));
  });
}
function Ys(t) {
  return Te(() => t);
}
function Id(t, e) {
  return e
    ? (n) => vr(e.pipe(Zt(1), Cy()), n.pipe(Id(t)))
    : Ye((n, r) => Pe(t(n, r)).pipe(Zt(1), Ys(n)));
}
function ZT(t, e = si) {
  let n = vc(t, e);
  return Id(() => n);
}
function XT(t, e = _t) {
  return (
    (t = t ?? JT),
    ye((n, r) => {
      let i,
        s = !0;
      n.subscribe(
        me(r, (o) => {
          let a = e(o);
          (s || !t(i, a)) && ((s = !1), (i = a), r.next(o));
        }),
      );
    })
  );
}
function JT(t, e) {
  return t === e;
}
function Ec(t = eS) {
  return ye((e, n) => {
    let r = !1;
    e.subscribe(
      me(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t())),
      ),
    );
  });
}
function eS() {
  return new qn();
}
function Dr(t) {
  return ye((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function on(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? St((i, s) => t(i, s, r)) : _t,
      Zt(1),
      n ? wr(e) : Ec(() => new qn()),
    );
}
function Qi(t) {
  return t <= 0
    ? () => Tt
    : ye((e, n) => {
        let r = [];
        e.subscribe(
          me(
            n,
            (i) => {
              r.push(i), t < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Md(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? St((i, s) => t(i, s, r)) : _t,
      Qi(1),
      n ? wr(e) : Ec(() => new qn()),
    );
}
function Nd(t, e) {
  return ye(Sy(t, e, arguments.length >= 2, !0));
}
function xd(t = {}) {
  let {
    connector: e = () => new it(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: i = !0,
  } = t;
  return (s) => {
    let o,
      a,
      c,
      l = 0,
      u = !1,
      d = !1,
      m = () => {
        a?.unsubscribe(), (a = void 0);
      },
      E = () => {
        m(), (o = c = void 0), (u = d = !1);
      },
      C = () => {
        let M = o;
        E(), M?.unsubscribe();
      };
    return ye((M, P) => {
      l++, !d && !u && m();
      let A = (c = c ?? e());
      P.add(() => {
        l--, l === 0 && !d && !u && (a = Ad(C, i));
      }),
        A.subscribe(P),
        !o &&
          l > 0 &&
          ((o = new Vn({
            next: (_) => A.next(_),
            error: (_) => {
              (d = !0), m(), (a = Ad(E, n, _)), A.error(_);
            },
            complete: () => {
              (u = !0), m(), (a = Ad(E, r)), A.complete();
            },
          })),
          Pe(M).subscribe(o));
    })(s);
  };
}
function Ad(t, e, ...n) {
  if (e === !0) {
    t();
    return;
  }
  if (e === !1) return;
  let r = new Vn({
    next: () => {
      r.unsubscribe(), t();
    },
  });
  return Pe(e(...n)).subscribe(r);
}
function tS(t, e, n) {
  let r,
    i = !1;
  return (
    t && typeof t == "object"
      ? ({
          bufferSize: r = 1 / 0,
          windowTime: e = 1 / 0,
          refCount: i = !1,
          scheduler: n,
        } = t)
      : (r = t ?? 1 / 0),
    xd({
      connector: () => new Za(r, e, n),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: i,
    })
  );
}
function nS(t) {
  return St((e, n) => t <= n);
}
function Rd(...t) {
  let e = En(t);
  return ye((n, r) => {
    (e ? vr(t, n, e) : vr(t, n)).subscribe(r);
  });
}
function Ft(t, e) {
  return ye((n, r) => {
    let i = null,
      s = 0,
      o = !1,
      a = () => o && !i && r.complete();
    n.subscribe(
      me(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = s++;
          Pe(t(c, u)).subscribe(
            (i = me(
              r,
              (d) => r.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              },
            )),
          );
        },
        () => {
          (o = !0), a();
        },
      ),
    );
  });
}
function Od(t) {
  return ye((e, n) => {
    Pe(t).subscribe(me(n, () => n.complete(), ni)), !n.closed && e.subscribe(n);
  });
}
function at(t, e, n) {
  let r = ue(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? ye((i, s) => {
        var o;
        (o = r.subscribe) === null || o === void 0 || o.call(r);
        let a = !0;
        i.subscribe(
          me(
            s,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), s.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                s.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                s.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            },
          ),
        );
      })
    : _t;
}
var vv = "https://g.co/ng/security#xss",
  $ = class extends Error {
    constructor(e, n) {
      super(ll(e, n)), (this.code = e);
    }
  };
function ll(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function wo(t) {
  return { toString: t }.toString();
}
var bc = "__parameters__";
function rS(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function Ev(t, e, n) {
  return wo(() => {
    let r = rS(e);
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this;
      let o = new i(...s);
      return (a.annotation = o), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(bc)
          ? c[bc]
          : Object.defineProperty(c, bc, { value: [] })[bc];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(o), c;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var Tr = globalThis;
function Ve(t) {
  for (let e in t) if (t[e] === Ve) return e;
  throw Error("Could not find renamed property on target object.");
}
function iS(t, e) {
  for (let n in e) e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
}
function Mt(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(Mt).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function Yd(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
      ? t
      : t + " " + e;
}
var sS = Ve({ __forward_ref__: Ve });
function bv(t) {
  return (
    (t.__forward_ref__ = bv),
    (t.toString = function () {
      return Mt(this());
    }),
    t
  );
}
function Ct(t) {
  return wv(t) ? t() : t;
}
function wv(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(sS) && t.__forward_ref__ === bv
  );
}
function Z(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Ar(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function ul(t) {
  return Iy(t, _v) || Iy(t, Tv);
}
function Dv(t) {
  return ul(t) !== null;
}
function Iy(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function oS(t) {
  let e = t && (t[_v] || t[Tv]);
  return e || null;
}
function My(t) {
  return t && (t.hasOwnProperty(Ny) || t.hasOwnProperty(aS)) ? t[Ny] : null;
}
var _v = Ve({ ɵprov: Ve }),
  Ny = Ve({ ɵinj: Ve }),
  Tv = Ve({ ngInjectableDef: Ve }),
  aS = Ve({ ngInjectorDef: Ve }),
  oe = class {
    constructor(e, n) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = Z({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Sv(t) {
  return t && !!t.ɵproviders;
}
var cS = Ve({ ɵcmp: Ve }),
  lS = Ve({ ɵdir: Ve }),
  uS = Ve({ ɵpipe: Ve }),
  dS = Ve({ ɵmod: Ve }),
  Pc = Ve({ ɵfac: Ve }),
  Zs = Ve({ __NG_ELEMENT_ID__: Ve }),
  Ay = Ve({ __NG_ENV_ID__: Ve });
function bn(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function fS(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
      ? t.type.name || t.type.toString()
      : bn(t);
}
function hS(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new $(-200, t);
}
function gh(t, e) {
  throw new $(-201, !1);
}
var Ce = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(Ce || {}),
  Zd;
function Cv() {
  return Zd;
}
function Xt(t) {
  let e = Zd;
  return (Zd = t), e;
}
function Iv(t, e, n) {
  let r = ul(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & Ce.Optional) return null;
  if (e !== void 0) return e;
  gh(t, "Injector");
}
var pS = {},
  eo = pS,
  Xd = "__NG_DI_FLAG__",
  Fc = "ngTempTokenPath",
  mS = "ngTokenPath",
  gS = /\n/gm,
  yS = "\u0275",
  xy = "__source",
  Ji;
function vS() {
  return Ji;
}
function _r(t) {
  let e = Ji;
  return (Ji = t), e;
}
function ES(t, e = Ce.Default) {
  if (Ji === void 0) throw new $(-203, !1);
  return Ji === null
    ? Iv(t, void 0, e)
    : Ji.get(t, e & Ce.Optional ? null : void 0, e);
}
function ie(t, e = Ce.Default) {
  return (Cv() || ES)(Ct(t), e);
}
function G(t, e = Ce.Default) {
  return ie(t, dl(e));
}
function dl(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Jd(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = Ct(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new $(900, !1);
      let i,
        s = Ce.Default;
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = bS(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a);
      }
      e.push(ie(i, s));
    } else e.push(ie(r));
  }
  return e;
}
function Mv(t, e) {
  return (t[Xd] = e), (t.prototype[Xd] = e), t;
}
function bS(t) {
  return t[Xd];
}
function wS(t, e, n, r) {
  let i = t[Fc];
  throw (
    (e[xy] && i.unshift(e[xy]),
    (t.message = DS(
      `
` + t.message,
      i,
      n,
      r,
    )),
    (t[mS] = i),
    (t[Fc] = null),
    t)
  );
}
function DS(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == yS
      ? t.slice(2)
      : t;
  let i = Mt(e);
  if (Array.isArray(e)) i = e.map(Mt).join(" -> ");
  else if (typeof e == "object") {
    let s = [];
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o];
        s.push(o + ":" + (typeof a == "string" ? JSON.stringify(a) : Mt(a)));
      }
    i = `{${s.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    gS,
    `
  `,
  )}`;
}
var us = Mv(Ev("Optional"), 8);
var yh = Mv(Ev("SkipSelf"), 4);
function ts(t, e) {
  let n = t.hasOwnProperty(Pc);
  return n ? t[Pc] : null;
}
function _S(t, e, n) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; r++) {
    let i = t[r],
      s = e[r];
    if ((n && ((i = n(i)), (s = n(s))), s !== i)) return !1;
  }
  return !0;
}
function TS(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function vh(t, e) {
  t.forEach((n) => (Array.isArray(n) ? vh(n, e) : e(n)));
}
function Nv(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function jc(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function SS(t, e) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(e);
  return n;
}
function CS(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let s = i - 2;
      (t[i] = t[s]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function Eh(t, e, n) {
  let r = Do(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), CS(t, r, e, n)), r;
}
function kd(t, e) {
  let n = Do(t, e);
  if (n >= 0) return t[n | 1];
}
function Do(t, e) {
  return IS(t, e, 1);
}
function IS(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let s = r + ((i - r) >> 1),
      o = t[s << n];
    if (e === o) return s << n;
    o > e ? (i = s) : (r = s + 1);
  }
  return ~(i << n);
}
var ns = {},
  It = [],
  ci = new oe(""),
  Av = new oe("", -1),
  xv = new oe(""),
  Bc = class {
    get(e, n = eo) {
      if (n === eo) {
        let r = new Error(`NullInjectorError: No provider for ${Mt(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Rv = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Rv || {}),
  un = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(un || {}),
  zn = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(zn || {});
function MS(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let s = e.length;
      if (i + s === r || t.charCodeAt(i + s) <= 32) return i;
    }
    n = i + 1;
  }
}
function ef(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let s = n[r++],
        o = n[r++],
        a = n[r++];
      t.setAttribute(e, o, a, s);
    } else {
      let s = i,
        o = n[++r];
      NS(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++;
    }
  }
  return r;
}
function Ov(t) {
  return t === 3 || t === 4 || t === 6;
}
function NS(t) {
  return t.charCodeAt(0) === 64;
}
function to(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? Ry(t, n, i, null, e[++r])
              : Ry(t, n, i, null, null));
      }
    }
  return t;
}
function Ry(t, e, n, r, i) {
  let s = 0,
    o = t.length;
  if (e === -1) o = -1;
  else
    for (; s < t.length; ) {
      let a = t[s++];
      if (typeof a == "number") {
        if (a === e) {
          o = -1;
          break;
        } else if (a > e) {
          o = s - 1;
          break;
        }
      }
    }
  for (; s < t.length; ) {
    let a = t[s];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[s + 1] = i);
        return;
      } else if (r === t[s + 1]) {
        t[s + 2] = i;
        return;
      }
    }
    s++, r !== null && s++, i !== null && s++;
  }
  o !== -1 && (t.splice(o, 0, e), (s = o + 1)),
    t.splice(s++, 0, n),
    r !== null && t.splice(s++, 0, r),
    i !== null && t.splice(s++, 0, i);
}
var kv = "ng-template";
function AS(t, e, n, r) {
  let i = 0;
  if (r) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && MS(e[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (bh(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let s;
    for (; ++i < e.length && typeof (s = e[i]) == "string"; )
      if (s.toLowerCase() === n) return !0;
  }
  return !1;
}
function bh(t) {
  return t.type === 4 && t.value !== kv;
}
function xS(t, e, n) {
  let r = t.type === 4 && !n ? kv : t.value;
  return e === r;
}
function RS(t, e, n) {
  let r = 4,
    i = t.attrs,
    s = i !== null ? LS(i) : 0,
    o = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!o && !an(r) && !an(c)) return !1;
      if (o && an(c)) continue;
      (o = !1), (r = c | (r & 1));
      continue;
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !xS(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (an(r)) return !1;
          o = !0;
        }
      } else if (r & 8) {
        if (i === null || !AS(t, i, c, n)) {
          if (an(r)) return !1;
          o = !0;
        }
      } else {
        let l = e[++a],
          u = OS(c, i, bh(t), n);
        if (u === -1) {
          if (an(r)) return !1;
          o = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > s ? (d = "") : (d = i[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (an(r)) return !1;
            o = !0;
          }
        }
      }
  }
  return an(r) || o;
}
function an(t) {
  return (t & 1) === 0;
}
function OS(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let s = !1;
    for (; i < e.length; ) {
      let o = e[i];
      if (o === t) return i;
      if (o === 3 || o === 6) s = !0;
      else if (o === 1 || o === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (o === 4) break;
        if (o === 0) {
          i += 4;
          continue;
        }
      }
      i += s ? 1 : 2;
    }
    return -1;
  } else return PS(e, t);
}
function Lv(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (RS(t, e[r], n)) return !0;
  return !1;
}
function kS(t) {
  let e = t.attrs;
  if (e != null) {
    let n = e.indexOf(5);
    if (!(n & 1)) return e[n + 1];
  }
  return null;
}
function LS(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (Ov(n)) return e;
  }
  return t.length;
}
function PS(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == "number") return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function FS(t, e) {
  e: for (let n = 0; n < e.length; n++) {
    let r = e[n];
    if (t.length === r.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== r[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Oy(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function jS(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    s = !1;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + o) : r & 4 && (i += " " + o);
    else
      i !== "" && !an(o) && ((e += Oy(s, i)), (i = "")),
        (r = o),
        (s = s || !an(r));
    n++;
  }
  return i !== "" && (e += Oy(s, i)), e;
}
function BS(t) {
  return t.map(jS).join(",");
}
function HS(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      i === 2 ? s !== "" && e.push(s, t[++r]) : i === 8 && n.push(s);
    else {
      if (!an(i)) break;
      i = s;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function Pv(t) {
  return wo(() => {
    let e = Uv(t),
      n = nt(ee({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Rv.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || un.Emulated,
        styles: t.styles || It,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Vv(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = Ly(r, !1)), (n.pipeDefs = Ly(r, !0)), (n.id = qS(n)), n
    );
  });
}
function US(t) {
  return Ir(t) || Fv(t);
}
function VS(t) {
  return t !== null;
}
function xr(t) {
  return wo(() => ({
    type: t.type,
    bootstrap: t.bootstrap || It,
    declarations: t.declarations || It,
    imports: t.imports || It,
    exports: t.exports || It,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function ky(t, e) {
  if (t == null) return ns;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        a = zn.None;
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = a !== zn.None ? [r, a] : r), (e[s] = o)) : (n[s] = r);
    }
  return n;
}
function Rr(t) {
  return wo(() => {
    let e = Uv(t);
    return Vv(e), e;
  });
}
function Ir(t) {
  return t[cS] || null;
}
function Fv(t) {
  return t[lS] || null;
}
function jv(t) {
  return t[uS] || null;
}
function Bv(t) {
  let e = Ir(t) || Fv(t) || jv(t);
  return e !== null ? e.standalone : !1;
}
function Hv(t, e) {
  let n = t[dS] || null;
  if (!n && e === !0)
    throw new Error(`Type ${Mt(t)} does not have '\u0275mod' property.`);
  return n;
}
function Uv(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || ns,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || It,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ky(t.inputs, e),
    outputs: ky(t.outputs),
    debugInfo: null,
  };
}
function Vv(t) {
  t.features?.forEach((e) => e(t));
}
function Ly(t, e) {
  if (!t) return null;
  let n = e ? jv : US;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(VS);
}
function qS(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
function Tn(t) {
  return { ɵproviders: t };
}
function $S(...t) {
  return { ɵproviders: qv(!0, t), ɵfromNgModule: !0 };
}
function qv(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o);
    };
  return (
    vh(e, (o) => {
      let a = o;
      tf(a, s, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && $v(i, s),
    n
  );
}
function $v(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    wh(i, (s) => {
      e(s, r);
    });
  }
}
function tf(t, e, n, r) {
  if (((t = Ct(t)), !t)) return !1;
  let i = null,
    s = My(t),
    o = !s && Ir(t);
  if (!s && !o) {
    let c = t.ngModule;
    if (((s = My(c)), s)) i = c;
    else return !1;
  } else {
    if (o && !o.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (o) {
    if (a) return !1;
    if ((r.add(i), o.dependencies)) {
      let c =
        typeof o.dependencies == "function" ? o.dependencies() : o.dependencies;
      for (let l of c) tf(l, e, n, r);
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i);
      let l;
      try {
        vh(s.imports, (u) => {
          tf(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && $v(l, e);
    }
    if (!a) {
      let l = ts(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: It }, i),
        e({ provide: xv, useValue: i, multi: !0 }, i),
        e({ provide: ci, useValue: () => ie(i), multi: !0 }, i);
    }
    let c = s.providers;
    if (c != null && !a) {
      let l = t;
      wh(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function wh(t, e) {
  for (let n of t)
    Sv(n) && (n = n.ɵproviders), Array.isArray(n) ? wh(n, e) : e(n);
}
var zS = Ve({ provide: String, useValue: Ve });
function zv(t) {
  return t !== null && typeof t == "object" && zS in t;
}
function GS(t) {
  return !!(t && t.useExisting);
}
function WS(t) {
  return !!(t && t.useFactory);
}
function rs(t) {
  return typeof t == "function";
}
function QS(t) {
  return !!t.useClass;
}
var fl = new oe(""),
  Mc = {},
  KS = {},
  Ld;
function Dh() {
  return Ld === void 0 && (Ld = new Bc()), Ld;
}
var kt = class {},
  no = class extends kt {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        rf(e, (o) => this.processProvider(o)),
        this.records.set(Av, Ki(void 0, this)),
        i.has("environment") && this.records.set(kt, Ki(void 0, this));
      let s = this.records.get(fl);
      s != null && typeof s.value == "string" && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(xv, It, Ce.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = xe(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          xe(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = _r(this),
        r = Xt(void 0),
        i;
      try {
        return e();
      } finally {
        _r(n), Xt(r);
      }
    }
    get(e, n = eo, r = Ce.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Ay))) return e[Ay](this);
      r = dl(r);
      let i,
        s = _r(this),
        o = Xt(void 0);
      try {
        if (!(r & Ce.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = eC(e) && ul(e);
            l && this.injectableDefInScope(l)
              ? (c = Ki(nf(e), Mc))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & Ce.Self ? Dh() : this.parent;
        return (n = r & Ce.Optional && n === eo ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Fc] = a[Fc] || []).unshift(Mt(e)), s)) throw a;
          return wS(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Xt(o), _r(s);
      }
    }
    resolveInjectorInitializers() {
      let e = xe(null),
        n = _r(this),
        r = Xt(void 0),
        i;
      try {
        let s = this.get(ci, It, Ce.Self);
        for (let o of s) o();
      } finally {
        _r(n), Xt(r), xe(e);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(Mt(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new $(205, !1);
    }
    processProvider(e) {
      e = Ct(e);
      let n = rs(e) ? e : Ct(e && e.provide),
        r = ZS(e);
      if (!rs(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = Ki(void 0, Mc, !0)),
          (i.factory = () => Jd(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      let r = xe(null);
      try {
        return (
          n.value === Mc && ((n.value = KS), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            JS(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        xe(r);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = Ct(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function nf(t) {
  let e = ul(t),
    n = e !== null ? e.factory : ts(t);
  if (n !== null) return n;
  if (t instanceof oe) throw new $(204, !1);
  if (t instanceof Function) return YS(t);
  throw new $(204, !1);
}
function YS(t) {
  if (t.length > 0) throw new $(204, !1);
  let n = oS(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function ZS(t) {
  if (zv(t)) return Ki(void 0, t.useValue);
  {
    let e = Gv(t);
    return Ki(e, Mc);
  }
}
function Gv(t, e, n) {
  let r;
  if (rs(t)) {
    let i = Ct(t);
    return ts(i) || nf(i);
  } else if (zv(t)) r = () => Ct(t.useValue);
  else if (WS(t)) r = () => t.useFactory(...Jd(t.deps || []));
  else if (GS(t)) r = () => ie(Ct(t.useExisting));
  else {
    let i = Ct(t && (t.useClass || t.provide));
    if (XS(t)) r = () => new i(...Jd(t.deps));
    else return ts(i) || nf(i);
  }
  return r;
}
function Ki(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function XS(t) {
  return !!t.deps;
}
function JS(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function eC(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof oe);
}
function rf(t, e) {
  for (let n of t)
    Array.isArray(n) ? rf(n, e) : n && Sv(n) ? rf(n.ɵproviders, e) : e(n);
}
function Yn(t, e) {
  t instanceof no && t.assertNotDestroyed();
  let n,
    r = _r(t),
    i = Xt(void 0);
  try {
    return e();
  } finally {
    _r(r), Xt(i);
  }
}
function Wv() {
  return Cv() !== void 0 || vS() != null;
}
function tC(t) {
  if (!Wv()) throw new $(-203, !1);
}
function nC(t) {
  let e = Tr.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function rC(t) {
  return typeof t == "function";
}
var st = 0,
  fe = 1,
  de = 2,
  lt = 3,
  ln = 4,
  Ht = 5,
  jt = 6,
  ro = 7,
  pt = 8,
  is = 9,
  dn = 10,
  He = 11,
  io = 12,
  Py = 13,
  ds = 14,
  Nt = 15,
  _o = 16,
  Yi = 17,
  Gn = 18,
  hl = 19,
  Qv = 20,
  Sr = 21,
  Nc = 22,
  li = 23,
  We = 25,
  _h = 1,
  so = 6,
  Wn = 7,
  Hc = 8,
  ss = 9,
  dt = 10,
  Th = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(Th || {});
function $n(t) {
  return Array.isArray(t) && typeof t[_h] == "object";
}
function Ut(t) {
  return Array.isArray(t) && t[_h] === !0;
}
function Sh(t) {
  return (t.flags & 4) !== 0;
}
function fs(t) {
  return t.componentOffset > -1;
}
function pl(t) {
  return (t.flags & 1) === 1;
}
function Qn(t) {
  return !!t.template;
}
function Ch(t) {
  return (t[de] & 512) !== 0;
}
function iC(t) {
  return (t.type & 16) === 16;
}
function sC(t) {
  return (t[de] & 32) === 32;
}
var sf = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Kv(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r);
}
function To() {
  return Yv;
}
function Yv(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = aC), oC;
}
To.ngInherit = !0;
function oC() {
  let t = Xv(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === ns) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function aC(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = Xv(t) || cC(t, { previous: ns, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    l = c[s];
  (a[s] = new sf(l && l.currentValue, n, c === ns)), Kv(t, e, i, n);
}
var Zv = "__ngSimpleChanges__";
function Xv(t) {
  return t[Zv] || null;
}
function cC(t, e) {
  return (t[Zv] = e);
}
var Fy = null;
var wn = function (t, e, n) {
    Fy?.(t, e, n);
  },
  Jv = "svg",
  lC = "math",
  uC = !1;
function dC() {
  return uC;
}
function ct(t) {
  for (; Array.isArray(t); ) t = t[st];
  return t;
}
function Ih(t) {
  for (; Array.isArray(t); ) {
    if (typeof t[_h] == "object") return t;
    t = t[st];
  }
  return null;
}
function eE(t, e) {
  return ct(e[t]);
}
function Vt(t, e) {
  return ct(e[t.index]);
}
function Mh(t, e) {
  return t.data[e];
}
function fC(t, e) {
  return t[e];
}
function Or(t, e) {
  let n = e[t];
  return $n(n) ? n : n[st];
}
function hC(t) {
  return (t[de] & 4) === 4;
}
function Nh(t) {
  return (t[de] & 128) === 128;
}
function pC(t) {
  return Ut(t[lt]);
}
function os(t, e) {
  return e == null ? null : t[e];
}
function tE(t) {
  t[Yi] = 0;
}
function mC(t) {
  t[de] & 1024 || ((t[de] |= 1024), Nh(t) && oo(t));
}
function gC(t, e) {
  for (; t > 0; ) (e = e[ds]), t--;
  return e;
}
function Ah(t) {
  return !!(t[de] & 9216 || t[li]?.dirty);
}
function of(t) {
  t[dn].changeDetectionScheduler?.notify(1),
    Ah(t)
      ? oo(t)
      : t[de] & 64 &&
        (dC()
          ? ((t[de] |= 1024), oo(t))
          : t[dn].changeDetectionScheduler?.notify());
}
function oo(t) {
  t[dn].changeDetectionScheduler?.notify();
  let e = ao(t);
  for (; e !== null && !(e[de] & 8192 || ((e[de] |= 8192), !Nh(e))); )
    e = ao(e);
}
function nE(t, e) {
  if ((t[de] & 256) === 256) throw new $(911, !1);
  t[Sr] === null && (t[Sr] = []), t[Sr].push(e);
}
function yC(t, e) {
  if (t[Sr] === null) return;
  let n = t[Sr].indexOf(e);
  n !== -1 && t[Sr].splice(n, 1);
}
function ao(t) {
  let e = t[lt];
  return Ut(e) ? e[lt] : e;
}
var Ee = {
  lFrame: lE(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
function vC() {
  return Ee.lFrame.elementDepthCount;
}
function EC() {
  Ee.lFrame.elementDepthCount++;
}
function bC() {
  Ee.lFrame.elementDepthCount--;
}
function rE() {
  return Ee.bindingsEnabled;
}
function hs() {
  return Ee.skipHydrationRootTNode !== null;
}
function wC(t) {
  return Ee.skipHydrationRootTNode === t;
}
function DC(t) {
  Ee.skipHydrationRootTNode = t;
}
function _C() {
  Ee.skipHydrationRootTNode = null;
}
function De() {
  return Ee.lFrame.lView;
}
function et() {
  return Ee.lFrame.tView;
}
function Gj(t) {
  return (Ee.lFrame.contextLView = t), t[pt];
}
function Wj(t) {
  return (Ee.lFrame.contextLView = null), t;
}
function vt() {
  let t = iE();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function iE() {
  return Ee.lFrame.currentTNode;
}
function TC() {
  let t = Ee.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function yi(t, e) {
  let n = Ee.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function xh() {
  return Ee.lFrame.isParent;
}
function Rh() {
  Ee.lFrame.isParent = !1;
}
function SC() {
  return Ee.lFrame.contextLView;
}
function sE() {
  let t = Ee.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function CC() {
  return Ee.lFrame.bindingIndex;
}
function IC(t) {
  return (Ee.lFrame.bindingIndex = t);
}
function vi() {
  return Ee.lFrame.bindingIndex++;
}
function Oh(t) {
  let e = Ee.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function MC() {
  return Ee.lFrame.inI18n;
}
function NC(t, e) {
  let n = Ee.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), af(e);
}
function AC() {
  return Ee.lFrame.currentDirectiveIndex;
}
function af(t) {
  Ee.lFrame.currentDirectiveIndex = t;
}
function kh(t) {
  let e = Ee.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function oE() {
  return Ee.lFrame.currentQueryIndex;
}
function Lh(t) {
  Ee.lFrame.currentQueryIndex = t;
}
function xC(t) {
  let e = t[fe];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Ht] : null;
}
function aE(t, e, n) {
  if (n & Ce.SkipSelf) {
    let i = e,
      s = t;
    for (; (i = i.parent), i === null && !(n & Ce.Host); )
      if (((i = xC(s)), i === null || ((s = s[ds]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = s);
  }
  let r = (Ee.lFrame = cE());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Ph(t) {
  let e = cE(),
    n = t[fe];
  (Ee.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function cE() {
  let t = Ee.lFrame,
    e = t === null ? null : t.child;
  return e === null ? lE(t) : e;
}
function lE(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function uE() {
  let t = Ee.lFrame;
  return (Ee.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var dE = uE;
function Fh() {
  let t = uE();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function RC(t) {
  return (Ee.lFrame.contextLView = gC(t, Ee.lFrame.contextLView))[pt];
}
function Zn() {
  return Ee.lFrame.selectedIndex;
}
function ui(t) {
  Ee.lFrame.selectedIndex = t;
}
function So() {
  let t = Ee.lFrame;
  return Mh(t.tView, t.selectedIndex);
}
function Qj() {
  Ee.lFrame.currentNamespace = Jv;
}
function fE() {
  return Ee.lFrame.currentNamespace;
}
var hE = !0;
function ml() {
  return hE;
}
function Sn(t) {
  hE = t;
}
function OC(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype;
  if (r) {
    let o = Yv(e);
    (n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s));
}
function gl(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let s = t.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = s;
    o && (t.contentHooks ??= []).push(-n, o),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      l &&
        ((t.viewHooks ??= []).push(n, l), (t.viewCheckHooks ??= []).push(n, l)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function Ac(t, e, n) {
  pE(t, e, 3, n);
}
function xc(t, e, n, r) {
  (t[de] & 3) === n && pE(t, e, n, r);
}
function Pd(t, e) {
  let n = t[de];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[de] = n));
}
function pE(t, e, n, r) {
  let i = r !== void 0 ? t[Yi] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0;
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[Yi] += 65536),
        (a < s || s == -1) &&
          (kC(t, n, e, c), (t[Yi] = (t[Yi] & 4294901760) + c + 2)),
        c++;
}
function jy(t, e) {
  wn(4, t, e);
  let n = xe(null);
  try {
    e.call(t);
  } finally {
    xe(n), wn(5, t, e);
  }
}
function kC(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o];
  i
    ? t[de] >> 14 < t[Yi] >> 16 &&
      (t[de] & 3) === e &&
      ((t[de] += 16384), jy(a, s))
    : jy(a, s);
}
var es = -1,
  di = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function LC(t) {
  return t instanceof di;
}
function PC(t) {
  return (
    t != null &&
    typeof t == "object" &&
    (t.insertBeforeIndex === null ||
      typeof t.insertBeforeIndex == "number" ||
      Array.isArray(t.insertBeforeIndex))
  );
}
function FC(t) {
  return (t.flags & 8) !== 0;
}
function jC(t) {
  return (t.flags & 16) !== 0;
}
function mE(t) {
  return t !== es;
}
function Uc(t) {
  return t & 32767;
}
function BC(t) {
  return t >> 16;
}
function Vc(t, e) {
  let n = BC(t),
    r = e;
  for (; n > 0; ) (r = r[ds]), n--;
  return r;
}
var cf = !0;
function By(t) {
  let e = cf;
  return (cf = t), e;
}
var HC = 256,
  gE = HC - 1,
  yE = 5,
  UC = 0,
  Dn = {};
function VC(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Zs) && (r = n[Zs]),
    r == null && (r = n[Zs] = UC++);
  let i = r & gE,
    s = 1 << i;
  e.data[t + (i >> yE)] |= s;
}
function qc(t, e) {
  let n = vE(t, e);
  if (n !== -1) return n;
  let r = e[fe];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Fd(r.data, t),
    Fd(e, null),
    Fd(r.blueprint, null));
  let i = jh(t, e),
    s = t.injectorIndex;
  if (mE(i)) {
    let o = Uc(i),
      a = Vc(i, e),
      c = a[fe].data;
    for (let l = 0; l < 8; l++) e[s + l] = a[o + l] | c[o + l];
  }
  return (e[s + 8] = i), s;
}
function Fd(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function vE(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function jh(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = _E(i)), r === null)) return es;
    if ((n++, (i = i[ds]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return es;
}
function lf(t, e, n) {
  VC(t, e, n);
}
function qC(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let n = t.attrs;
  if (n) {
    let r = n.length,
      i = 0;
    for (; i < r; ) {
      let s = n[i];
      if (Ov(s)) break;
      if (s === 0) i = i + 2;
      else if (typeof s == "number")
        for (i++; i < r && typeof n[i] == "string"; ) i++;
      else {
        if (s === e) return n[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function EE(t, e, n) {
  if (n & Ce.Optional || t !== void 0) return t;
  gh(e, "NodeInjector");
}
function bE(t, e, n, r) {
  if (
    (n & Ce.Optional && r === void 0 && (r = null), !(n & (Ce.Self | Ce.Host)))
  ) {
    let i = t[is],
      s = Xt(void 0);
    try {
      return i ? i.get(e, r, n & Ce.Optional) : Iv(e, r, n & Ce.Optional);
    } finally {
      Xt(s);
    }
  }
  return EE(r, e, n);
}
function wE(t, e, n, r = Ce.Default, i) {
  if (t !== null) {
    if (e[de] & 2048 && !(r & Ce.Self)) {
      let o = WC(t, e, n, r, Dn);
      if (o !== Dn) return o;
    }
    let s = DE(t, e, n, r, Dn);
    if (s !== Dn) return s;
  }
  return bE(e, n, r, i);
}
function DE(t, e, n, r, i) {
  let s = zC(n);
  if (typeof s == "function") {
    if (!aE(e, t, r)) return r & Ce.Host ? EE(i, n, r) : bE(e, n, r, i);
    try {
      let o;
      if (((o = s(r)), o == null && !(r & Ce.Optional))) gh(n);
      else return o;
    } finally {
      dE();
    }
  } else if (typeof s == "number") {
    let o = null,
      a = vE(t, e),
      c = es,
      l = r & Ce.Host ? e[Nt][Ht] : null;
    for (
      (a === -1 || r & Ce.SkipSelf) &&
      ((c = a === -1 ? jh(t, e) : e[a + 8]),
      c === es || !Uy(r, !1)
        ? (a = -1)
        : ((o = e[fe]), (a = Uc(c)), (e = Vc(c, e))));
      a !== -1;

    ) {
      let u = e[fe];
      if (Hy(s, a, u.data)) {
        let d = $C(a, e, n, o, r, l);
        if (d !== Dn) return d;
      }
      (c = e[a + 8]),
        c !== es && Uy(r, e[fe].data[a + 8] === l) && Hy(s, a, e)
          ? ((o = u), (a = Uc(c)), (e = Vc(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function $C(t, e, n, r, i, s) {
  let o = e[fe],
    a = o.data[t + 8],
    c = r == null ? fs(a) && cf : r != o && (a.type & 3) !== 0,
    l = i & Ce.Host && s === a,
    u = Rc(a, o, n, c, l);
  return u !== null ? fi(e, o, u, a) : Dn;
}
function Rc(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    a = s & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = s >> 20,
    d = r ? a : a + u,
    m = i ? a + u : l;
  for (let E = d; E < m; E++) {
    let C = o[E];
    if ((E < c && n === C) || (E >= c && C.type === n)) return E;
  }
  if (i) {
    let E = o[c];
    if (E && Qn(E) && E.type === n) return c;
  }
  return null;
}
function fi(t, e, n, r) {
  let i = t[n],
    s = e.data;
  if (LC(i)) {
    let o = i;
    o.resolving && hS(fS(s[n]));
    let a = By(o.canSeeViewProviders);
    o.resolving = !0;
    let c,
      l = o.injectImpl ? Xt(o.injectImpl) : null,
      u = aE(t, r, Ce.Default);
    try {
      (i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && OC(n, s[n], e);
    } finally {
      l !== null && Xt(l), By(a), (o.resolving = !1), dE();
    }
  }
  return i;
}
function zC(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Zs) ? t[Zs] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & gE : GC) : e;
}
function Hy(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> yE)] & r);
}
function Uy(t, e) {
  return !(t & Ce.Self) && !(t & Ce.Host && e);
}
var ai = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return wE(this._tNode, this._lView, e, dl(r), n);
  }
};
function GC() {
  return new ai(vt(), De());
}
function Bh(t) {
  return wo(() => {
    let e = t.prototype.constructor,
      n = e[Pc] || uf(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let s = i[Pc] || uf(i);
      if (s && s !== n) return s;
      i = Object.getPrototypeOf(i);
    }
    return (s) => new s();
  });
}
function uf(t) {
  return wv(t)
    ? () => {
        let e = uf(Ct(t));
        return e && e();
      }
    : ts(t);
}
function WC(t, e, n, r, i) {
  let s = t,
    o = e;
  for (; s !== null && o !== null && o[de] & 2048 && !(o[de] & 512); ) {
    let a = DE(s, o, n, r | Ce.Self, Dn);
    if (a !== Dn) return a;
    let c = s.parent;
    if (!c) {
      let l = o[Qv];
      if (l) {
        let u = l.get(n, Dn, r);
        if (u !== Dn) return u;
      }
      (c = _E(o)), (o = o[ds]);
    }
    s = c;
  }
  return i;
}
function _E(t) {
  let e = t[fe],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[Ht] : null;
}
function TE(t) {
  return qC(vt(), t);
}
function Vy(t, e = null, n = null, r) {
  let i = SE(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function SE(t, e = null, n = null, r, i = new Set()) {
  let s = [n || It, $S(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : Mt(t))),
    new no(s, e || Dh(), r || null, i)
  );
}
var Jt = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Vy({ name: "" }, i, r, "");
      {
        let s = r.name ?? "";
        return Vy({ name: s }, r.parent, r.providers, s);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = eo),
    (e.NULL = new Bc()),
    (e.ɵprov = Z({ token: e, providedIn: "any", factory: () => ie(Av) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var QC = "ngOriginalError";
function jd(t) {
  return t[QC];
}
var fn = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && jd(e);
      for (; n && jd(n); ) n = jd(n);
      return n || null;
    }
  },
  CE = new oe("", {
    providedIn: "root",
    factory: () => G(fn).handleError.bind(void 0),
  }),
  Hh = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = KC), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  df = class extends Hh {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return nE(this._lView, e), () => yC(this._lView, e);
    }
  };
function KC() {
  return new df(De());
}
function YC() {
  return ps(vt(), De());
}
function ps(t, e) {
  return new Xn(Vt(t, e));
}
var Xn = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = YC;
  let t = e;
  return t;
})();
function ZC(t) {
  return t instanceof Xn ? t.nativeElement : t;
}
var ff = class extends it {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      Wv() && (this.destroyRef = G(Hh, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let n = xe(null);
    try {
      super.next(e);
    } finally {
      xe(n);
    }
  }
  subscribe(e, n, r) {
    let i = e,
      s = n || (() => null),
      o = r;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (s = c.error?.bind(c)), (o = c.complete?.bind(c));
    }
    this.__isAsync && ((s = Bd(s)), i && (i = Bd(i)), o && (o = Bd(o)));
    let a = super.subscribe({ next: i, error: s, complete: o });
    return e instanceof rt && e.add(a), a;
  }
};
function Bd(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var yt = ff;
function XC() {
  return this._results[Symbol.iterator]();
}
var hf = class t {
    get changes() {
      return (this._changes ??= new yt());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._onDirty = void 0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let n = t.prototype;
      n[Symbol.iterator] || (n[Symbol.iterator] = XC);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, n) {
      return this._results.reduce(e, n);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, n) {
      this.dirty = !1;
      let r = TS(e);
      (this._changesDetected = !_S(this._results, r, n)) &&
        ((this._results = r),
        (this.length = r.length),
        (this.last = r[this.length - 1]),
        (this.first = r[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    onDirty(e) {
      this._onDirty = e;
    }
    setDirty() {
      (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  co = "ngSkipHydration",
  JC = "ngskiphydration";
function IE(t) {
  let e = t.mergedAttrs;
  if (e === null) return !1;
  for (let n = 0; n < e.length; n += 2) {
    let r = e[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === JC) return !0;
  }
  return !1;
}
function ME(t) {
  return t.hasAttribute(co);
}
function $c(t) {
  return (t.flags & 128) === 128;
}
function zc(t) {
  if ($c(t)) return !0;
  let e = t.parent;
  for (; e; ) {
    if ($c(t) || IE(e)) return !0;
    e = e.parent;
  }
  return !1;
}
var NE = new Map(),
  eI = 0;
function tI() {
  return eI++;
}
function nI(t) {
  NE.set(t[hl], t);
}
function rI(t) {
  NE.delete(t[hl]);
}
var qy = "__ngContext__";
function Mr(t, e) {
  $n(e) ? ((t[qy] = e[hl]), nI(e)) : (t[qy] = e);
}
function AE(t) {
  return RE(t[io]);
}
function xE(t) {
  return RE(t[ln]);
}
function RE(t) {
  for (; t !== null && !Ut(t); ) t = t[ln];
  return t;
}
var pf;
function yl(t) {
  pf = t;
}
function vl() {
  if (pf !== void 0) return pf;
  if (typeof document < "u") return document;
  throw new $(210, !1);
}
var ms = new oe("", { providedIn: "root", factory: () => iI }),
  iI = "ng",
  Co = new oe(""),
  Lt = new oe("", { providedIn: "platform", factory: () => "unknown" });
var Uh = new oe(""),
  Vh = new oe("", {
    providedIn: "root",
    factory: () =>
      vl().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function sI() {
  let t = new Cn();
  return G(Lt) === "browser" && (t.store = oI(vl(), G(ms))), t;
}
var Cn = (() => {
  let e = class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    get(r, i) {
      return this.store[r] !== void 0 ? this.store[r] : i;
    }
    set(r, i) {
      this.store[r] = i;
    }
    remove(r) {
      delete this.store[r];
    }
    hasKey(r) {
      return this.store.hasOwnProperty(r);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(r, i) {
      this.onSerializeCallbacks[r] = i;
    }
    toJson() {
      for (let r in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(r))
          try {
            this.store[r] = this.onSerializeCallbacks[r]();
          } catch (i) {
            console.warn("Exception in onSerialize callback: ", i);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  };
  e.ɵprov = Z({ token: e, providedIn: "root", factory: sI });
  let t = e;
  return t;
})();
function oI(t, e) {
  let n = t.getElementById(e + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + e, r);
    }
  return {};
}
var qh = "h",
  $h = "b",
  lo = (function (t) {
    return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
  })(lo || {}),
  mf = "e",
  gf = "t",
  uo = "c",
  Gc = "x",
  as = "r",
  yf = "i",
  vf = "n",
  Oc = "d",
  aI = "__nghData__",
  zh = aI,
  Xs = "ngh",
  Gh = "nghm",
  OE = () => null;
function cI(t, e, n = !1) {
  let r = t.getAttribute(Xs);
  if (r == null) return null;
  let [i, s] = r.split("|");
  if (((r = n ? s : i), !r)) return null;
  let o = s ? `|${s}` : "",
    a = n ? i : o,
    c = {};
  if (r !== "") {
    let u = e.get(Cn, null, { optional: !0 });
    u !== null && (c = u.get(zh, [])[Number(r)]);
  }
  let l = { data: c, firstChild: t.firstChild ?? null };
  return (
    n && ((l.firstChild = t), El(l, 0, t.nextSibling)),
    a ? t.setAttribute(Xs, a) : t.removeAttribute(Xs),
    l
  );
}
function lI() {
  OE = cI;
}
function Wh(t, e, n = !1) {
  return OE(t, e, n);
}
function kE(t) {
  let e = t._lView;
  return e[fe].type === 2 ? null : (Ch(e) && (e = e[We]), e);
}
function uI(t) {
  return t.textContent?.replace(/\s/gm, "");
}
function dI(t) {
  let e = vl(),
    n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
      acceptNode(s) {
        let o = uI(s);
        return o === "ngetn" || o === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    i = [];
  for (; (r = n.nextNode()); ) i.push(r);
  for (let s of i)
    s.textContent === "ngetn"
      ? s.replaceWith(e.createTextNode(""))
      : s.remove();
}
function El(t, e, n) {
  (t.segmentHeads ??= {}), (t.segmentHeads[e] = n);
}
function Ef(t, e) {
  return t.segmentHeads?.[e] ?? null;
}
function fI(t, e) {
  let n = t.data,
    r = n[mf]?.[e] ?? null;
  return r === null && n[uo]?.[e] && (r = Qh(t, e)), r;
}
function LE(t, e) {
  return t.data[uo]?.[e] ?? null;
}
function Qh(t, e) {
  let n = LE(t, e) ?? [],
    r = 0;
  for (let i of n) r += i[as] * (i[Gc] ?? 1);
  return r;
}
function bl(t, e) {
  if (typeof t.disconnectedNodes > "u") {
    let n = t.data[Oc];
    t.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!t.disconnectedNodes?.has(e);
}
var Zi = new oe(""),
  PE = !1,
  FE = new oe("", { providedIn: "root", factory: () => PE }),
  hI = new oe(""),
  wc;
function pI() {
  if (wc === void 0 && ((wc = null), Tr.trustedTypes))
    try {
      wc = Tr.trustedTypes.createPolicy("angular", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return wc;
}
function wl(t) {
  return pI()?.createHTML(t) || t;
}
var Kn = class {
    constructor(e) {
      this.changingThisBreaksApplicationSecurity = e;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${vv})`;
    }
  },
  bf = class extends Kn {
    getTypeName() {
      return "HTML";
    }
  },
  wf = class extends Kn {
    getTypeName() {
      return "Style";
    }
  },
  Df = class extends Kn {
    getTypeName() {
      return "Script";
    }
  },
  _f = class extends Kn {
    getTypeName() {
      return "URL";
    }
  },
  Tf = class extends Kn {
    getTypeName() {
      return "ResourceURL";
    }
  };
function In(t) {
  return t instanceof Kn ? t.changingThisBreaksApplicationSecurity : t;
}
function Ei(t, e) {
  let n = mI(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${vv})`);
  }
  return n === e;
}
function mI(t) {
  return (t instanceof Kn && t.getTypeName()) || null;
}
function jE(t) {
  return new bf(t);
}
function BE(t) {
  return new wf(t);
}
function HE(t) {
  return new Df(t);
}
function UE(t) {
  return new _f(t);
}
function VE(t) {
  return new Tf(t);
}
function gI(t) {
  let e = new Cf(t);
  return yI() ? new Sf(e) : e;
}
var Sf = class {
    constructor(e) {
      this.inertDocumentHelper = e;
    }
    getInertBodyElement(e) {
      e = "<body><remove></remove>" + e;
      try {
        let n = new window.DOMParser().parseFromString(wl(e), "text/html").body;
        return n === null
          ? this.inertDocumentHelper.getInertBodyElement(e)
          : (n.removeChild(n.firstChild), n);
      } catch {
        return null;
      }
    }
  },
  Cf = class {
    constructor(e) {
      (this.defaultDoc = e),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            "sanitization-inert",
          ));
    }
    getInertBodyElement(e) {
      let n = this.inertDocument.createElement("template");
      return (n.innerHTML = wl(e)), n;
    }
  };
function yI() {
  try {
    return !!new window.DOMParser().parseFromString(wl(""), "text/html");
  } catch {
    return !1;
  }
}
var vI = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Dl(t) {
  return (t = String(t)), t.match(vI) ? t : "unsafe:" + t;
}
function Jn(t) {
  let e = {};
  for (let n of t.split(",")) e[n] = !0;
  return e;
}
function Io(...t) {
  let e = {};
  for (let n of t) for (let r in n) n.hasOwnProperty(r) && (e[r] = !0);
  return e;
}
var qE = Jn("area,br,col,hr,img,wbr"),
  $E = Jn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  zE = Jn("rp,rt"),
  EI = Io(zE, $E),
  bI = Io(
    $E,
    Jn(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul",
    ),
  ),
  wI = Io(
    zE,
    Jn(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video",
    ),
  ),
  $y = Io(qE, bI, wI, EI),
  GE = Jn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  DI = Jn(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width",
  ),
  _I = Jn(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext",
  ),
  TI = Io(GE, DI, _I),
  SI = Jn("script,style,template"),
  If = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(e) {
      let n = e.firstChild,
        r = !0,
        i = [];
      for (; n; ) {
        if (
          (n.nodeType === Node.ELEMENT_NODE
            ? (r = this.startElement(n))
            : n.nodeType === Node.TEXT_NODE
              ? this.chars(n.nodeValue)
              : (this.sanitizedSomething = !0),
          r && n.firstChild)
        ) {
          i.push(n), (n = MI(n));
          continue;
        }
        for (; n; ) {
          n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
          let s = II(n);
          if (s) {
            n = s;
            break;
          }
          n = i.pop();
        }
      }
      return this.buf.join("");
    }
    startElement(e) {
      let n = zy(e).toLowerCase();
      if (!$y.hasOwnProperty(n))
        return (this.sanitizedSomething = !0), !SI.hasOwnProperty(n);
      this.buf.push("<"), this.buf.push(n);
      let r = e.attributes;
      for (let i = 0; i < r.length; i++) {
        let s = r.item(i),
          o = s.name,
          a = o.toLowerCase();
        if (!TI.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let c = s.value;
        GE[a] && (c = Dl(c)), this.buf.push(" ", o, '="', Gy(c), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(e) {
      let n = zy(e).toLowerCase();
      $y.hasOwnProperty(n) &&
        !qE.hasOwnProperty(n) &&
        (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
    }
    chars(e) {
      this.buf.push(Gy(e));
    }
  };
function CI(t, e) {
  return (
    (t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function II(t) {
  let e = t.nextSibling;
  if (e && t !== e.previousSibling) throw WE(e);
  return e;
}
function MI(t) {
  let e = t.firstChild;
  if (e && CI(t, e)) throw WE(e);
  return e;
}
function zy(t) {
  let e = t.nodeName;
  return typeof e == "string" ? e : "FORM";
}
function WE(t) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${t.outerHTML}`,
  );
}
var NI = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  AI = /([^\#-~ |!])/g;
function Gy(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(NI, function (e) {
      let n = e.charCodeAt(0),
        r = e.charCodeAt(1);
      return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";";
    })
    .replace(AI, function (e) {
      return "&#" + e.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var Dc;
function QE(t, e) {
  let n = null;
  try {
    Dc = Dc || gI(t);
    let r = e ? String(e) : "";
    n = Dc.getInertBodyElement(r);
    let i = 5,
      s = r;
    do {
      if (i === 0)
        throw new Error(
          "Failed to sanitize html because the input is unstable",
        );
      i--, (r = s), (s = n.innerHTML), (n = Dc.getInertBodyElement(r));
    } while (r !== s);
    let a = new If().sanitizeChildren(Wy(n) || n);
    return wl(a);
  } finally {
    if (n) {
      let r = Wy(n) || n;
      for (; r.firstChild; ) r.removeChild(r.firstChild);
    }
  }
}
function Wy(t) {
  return "content" in t && xI(t) ? t.content : null;
}
function xI(t) {
  return t.nodeType === Node.ELEMENT_NODE && t.nodeName === "TEMPLATE";
}
var er = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(er || {});
function Kj(t) {
  let e = RI();
  return e ? e.sanitize(er.URL, t) || "" : Ei(t, "URL") ? In(t) : Dl(bn(t));
}
function RI() {
  let t = De();
  return t && t[dn].sanitizer;
}
var OI = /^>|^->|<!--|-->|--!>|<!-$/g,
  kI = /(<|>)/g,
  LI = "\u200B$1\u200B";
function PI(t) {
  return t.replace(OI, (e) => e.replace(kI, LI));
}
function FI(t) {
  return t.ownerDocument.body;
}
function KE(t) {
  return t instanceof Function ? t() : t;
}
function _c(t) {
  return (t ?? G(Jt)).get(Lt) === "browser";
}
var _n = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(_n || {}),
  jI;
function Kh(t, e) {
  return jI(t, e);
}
function Xi(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1;
    Ut(r) ? (s = r) : $n(r) && ((o = !0), (r = r[st]));
    let a = ct(r);
    t === 0 && n !== null
      ? i == null
        ? XE(e, n, a)
        : Wc(e, n, a, i || null, !0)
      : t === 1 && n !== null
        ? Wc(e, n, a, i || null, !0)
        : t === 2
          ? ep(e, a, o)
          : t === 3 && e.destroyNode(a),
      s != null && JI(e, t, s, n, i);
  }
}
function Yh(t, e) {
  return t.createText(e);
}
function BI(t, e, n) {
  t.setValue(e, n);
}
function Zh(t, e) {
  return t.createComment(PI(e));
}
function _l(t, e, n) {
  return t.createElement(e, n);
}
function HI(t, e) {
  YE(t, e), (e[st] = null), (e[Ht] = null);
}
function UI(t, e, n, r, i, s) {
  (r[st] = i), (r[Ht] = e), Cl(t, r, n, 1, i, s);
}
function YE(t, e) {
  e[dn].changeDetectionScheduler?.notify(1), Cl(t, e, e[He], 2, null, null);
}
function VI(t) {
  let e = t[io];
  if (!e) return Hd(t[fe], t);
  for (; e; ) {
    let n = null;
    if ($n(e)) n = e[io];
    else {
      let r = e[dt];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[ln] && e !== t; ) $n(e) && Hd(e[fe], e), (e = e[lt]);
      e === null && (e = t), $n(e) && Hd(e[fe], e), (n = e && e[ln]);
    }
    e = n;
  }
}
function qI(t, e, n, r) {
  let i = dt + r,
    s = n.length;
  r > 0 && (n[i - 1][ln] = e),
    r < s - dt
      ? ((e[ln] = n[i]), Nv(n, dt + r, e))
      : (n.push(e), (e[ln] = null)),
    (e[lt] = n);
  let o = e[_o];
  o !== null && n !== o && $I(o, e);
  let a = e[Gn];
  a !== null && a.insertView(t), of(e), (e[de] |= 128);
}
function $I(t, e) {
  let n = t[ss],
    i = e[lt][lt][Nt];
  e[Nt] !== i && (t[de] |= Th.HasTransplantedViews),
    n === null ? (t[ss] = [e]) : n.push(e);
}
function ZE(t, e) {
  let n = t[ss],
    r = n.indexOf(e);
  n.splice(r, 1);
}
function fo(t, e) {
  if (t.length <= dt) return;
  let n = dt + e,
    r = t[n];
  if (r) {
    let i = r[_o];
    i !== null && i !== t && ZE(i, r), e > 0 && (t[n - 1][ln] = r[ln]);
    let s = jc(t, dt + e);
    HI(r[fe], r);
    let o = s[Gn];
    o !== null && o.detachView(s[fe]),
      (r[lt] = null),
      (r[ln] = null),
      (r[de] &= -129);
  }
  return r;
}
function Tl(t, e) {
  if (!(e[de] & 256)) {
    let n = e[He];
    n.destroyNode && Cl(t, e, n, 3, null, null), VI(e);
  }
}
function Hd(t, e) {
  if (e[de] & 256) return;
  let n = xe(null);
  try {
    (e[de] &= -129),
      (e[de] |= 256),
      e[li] && ud(e[li]),
      GI(t, e),
      zI(t, e),
      e[fe].type === 1 && e[He].destroy();
    let r = e[_o];
    if (r !== null && Ut(e[lt])) {
      r !== e[lt] && ZE(r, e);
      let i = e[Gn];
      i !== null && i.detachView(t);
    }
    rI(e);
  } finally {
    xe(n);
  }
}
function zI(t, e) {
  let n = t.cleanup,
    r = e[ro];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let o = n[s + 3];
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2);
      } else {
        let o = r[n[s + 1]];
        n[s].call(o);
      }
  r !== null && (e[ro] = null);
  let i = e[Sr];
  if (i !== null) {
    e[Sr] = null;
    for (let s = 0; s < i.length; s++) {
      let o = i[s];
      o();
    }
  }
}
function GI(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof di)) {
        let s = n[r + 1];
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1];
            wn(4, a, c);
            try {
              c.call(a);
            } finally {
              wn(5, a, c);
            }
          }
        else {
          wn(4, i, s);
          try {
            s.call(i);
          } finally {
            wn(5, i, s);
          }
        }
      }
    }
}
function Xh(t, e, n) {
  return WI(t, e.parent, n);
}
function WI(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[st];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i];
      if (s === un.None || s === un.Emulated) return null;
    }
    return Vt(r, n);
  }
}
function Wc(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function XE(t, e, n) {
  t.appendChild(e, n);
}
function Qy(t, e, n, r, i) {
  r !== null ? Wc(t, e, n, r, i) : XE(t, e, n);
}
function QI(t, e, n, r) {
  t.removeChild(e, n, r);
}
function Jh(t, e) {
  return t.parentNode(e);
}
function KI(t, e) {
  return t.nextSibling(e);
}
function JE(t, e, n) {
  return ZI(t, e, n);
}
function YI(t, e, n) {
  return t.type & 40 ? Vt(t, n) : null;
}
var ZI = YI,
  Ky;
function Sl(t, e, n, r) {
  let i = Xh(t, r, e),
    s = e[He],
    o = r.parent || e[Ht],
    a = JE(o, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Qy(s, i, n[c], a, !1);
    else Qy(s, i, n, a, !1);
  Ky !== void 0 && Ky(s, r, e, n, i);
}
function Js(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return Vt(e, t);
    if (n & 4) return Mf(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return Js(t, r);
      {
        let i = t[e.index];
        return Ut(i) ? Mf(-1, i) : ct(i);
      }
    } else {
      if (n & 32) return Kh(e, t)() || ct(t[e.index]);
      {
        let r = eb(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = ao(t[Nt]);
          return Js(i, r);
        } else return Js(t, e.next);
      }
    }
  }
  return null;
}
function eb(t, e) {
  if (e !== null) {
    let r = t[Nt][Ht],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function Mf(t, e) {
  let n = dt + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[fe].firstChild;
    if (i !== null) return Js(r, i);
  }
  return e[Wn];
}
function ep(t, e, n) {
  let r = Jh(t, e);
  r && QI(t, r, e, n);
}
function tb(t) {
  t.textContent = "";
}
function tp(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (o && e === 0 && (a && Mr(ct(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) tp(t, e, n.child, r, i, s, !1), Xi(e, t, i, a, s);
      else if (c & 32) {
        let l = Kh(n, r),
          u;
        for (; (u = l()); ) Xi(e, t, i, u, s);
        Xi(e, t, i, a, s);
      } else c & 16 ? nb(t, e, r, n, i, s) : Xi(e, t, i, a, s);
    n = o ? n.projectionNext : n.next;
  }
}
function Cl(t, e, n, r, i, s) {
  tp(n, r, t.firstChild, e, i, s, !1);
}
function XI(t, e, n) {
  let r = e[He],
    i = Xh(t, n, e),
    s = n.parent || e[Ht],
    o = JE(s, n, e);
  nb(r, 0, e, n, i, o);
}
function nb(t, e, n, r, i, s) {
  let o = n[Nt],
    c = o[Ht].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Xi(e, t, i, u, s);
    }
  else {
    let l = c,
      u = o[lt];
    $c(r) && (l.flags |= 128), tp(t, e, l, u, i, s, !0);
  }
}
function JI(t, e, n, r, i) {
  let s = n[Wn],
    o = ct(n);
  s !== o && Xi(e, t, r, s, i);
  for (let a = dt; a < n.length; a++) {
    let c = n[a];
    Cl(c[fe], c, t, e, r, s);
  }
}
function e1(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let s = r.indexOf("-") === -1 ? void 0 : _n.DashCase;
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (s |= _n.Important)),
        t.setStyle(n, r, i, s));
  }
}
function t1(t, e, n) {
  t.setAttribute(e, "style", n);
}
function rb(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function ib(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n;
  r !== null && ef(t, e, r),
    i !== null && rb(t, e, i),
    s !== null && t1(t, e, s);
}
var qt = {};
function Yj(t = 1) {
  sb(et(), De(), Zn() + t, !1);
}
function sb(t, e, n, r) {
  if (!r)
    if ((e[de] & 3) === 3) {
      let s = t.preOrderCheckHooks;
      s !== null && Ac(e, s, n);
    } else {
      let s = t.preOrderHooks;
      s !== null && xc(e, s, 0, n);
    }
  ui(n);
}
function Et(t, e = Ce.Default) {
  let n = De();
  if (n === null) return ie(t, e);
  let r = vt();
  return wE(r, n, Ct(t), e);
}
function n1() {
  let t = "invalid";
  throw new Error(t);
}
function ob(t, e, n, r, i, s) {
  let o = xe(null);
  try {
    let a = null;
    i & zn.SignalBased && (a = e[r][$a]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & zn.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : Kv(e, a, r, s);
  } finally {
    xe(o);
  }
}
function r1(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) ui(~i);
        else {
          let s = i,
            o = n[++r],
            a = n[++r];
          NC(o, s);
          let c = e[s];
          a(2, c);
        }
      }
    } finally {
      ui(-1);
    }
}
function Il(t, e, n, r, i, s, o, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[st] = i),
    (d[de] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[de] & 2048)) && (d[de] |= 2048),
    tE(d),
    (d[lt] = d[ds] = t),
    (d[pt] = n),
    (d[dn] = o || (t && t[dn])),
    (d[He] = a || (t && t[He])),
    (d[is] = c || (t && t[is]) || null),
    (d[Ht] = s),
    (d[hl] = tI()),
    (d[jt] = u),
    (d[Qv] = l),
    (d[Nt] = e.type == 2 ? t[Nt] : d),
    d
  );
}
function gs(t, e, n, r, i) {
  let s = t.data[e];
  if (s === null) (s = i1(t, e, n, r, i)), MC() && (s.flags |= 32);
  else if (s.type & 64) {
    (s.type = n), (s.value = r), (s.attrs = i);
    let o = TC();
    s.injectorIndex = o === null ? -1 : o.injectorIndex;
  }
  return yi(s, !0), s;
}
function i1(t, e, n, r, i) {
  let s = iE(),
    o = xh(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = d1(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  );
}
function ab(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function cb(t, e, n, r, i) {
  let s = Zn(),
    o = r & 2;
  try {
    ui(-1), o && e.length > We && sb(t, e, We, !1), wn(o ? 2 : 0, i), n(r, i);
  } finally {
    ui(s), wn(o ? 3 : 1, i);
  }
}
function np(t, e, n) {
  if (Sh(e)) {
    let r = xe(null);
    try {
      let i = e.directiveStart,
        s = e.directiveEnd;
      for (let o = i; o < s; o++) {
        let a = t.data[o];
        if (a.contentQueries) {
          let c = n[o];
          a.contentQueries(1, c, o);
        }
      }
    } finally {
      xe(r);
    }
  }
}
function rp(t, e, n) {
  rE() && (y1(t, e, n, Vt(n, e)), (n.flags & 64) === 64 && fb(t, e, n));
}
function ip(t, e, n = Vt) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        a = o === -1 ? n(e, t) : t[o];
      t[i++] = a;
    }
  }
}
function lb(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = sp(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id,
      ))
    : e;
}
function sp(t, e, n, r, i, s, o, a, c, l, u) {
  let d = We + r,
    m = d + i,
    E = s1(d, m),
    C = typeof l == "function" ? l() : l;
  return (E[fe] = {
    type: t,
    blueprint: E,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: E.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: m,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof s == "function" ? s() : s,
    pipeRegistry: typeof o == "function" ? o() : o,
    firstChild: null,
    schemas: c,
    consts: C,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function s1(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : qt);
  return n;
}
function o1(t, e, n, r) {
  let s = r.get(FE, PE) || n === un.ShadowDom,
    o = t.selectRootElement(e, s);
  return a1(o), o;
}
function a1(t) {
  ub(t);
}
var ub = () => null;
function c1(t) {
  ME(t) ? tb(t) : dI(t);
}
function l1() {
  ub = c1;
}
function u1(t, e, n, r) {
  let i = mb(e);
  i.push(n), t.firstCreatePass && gb(t).push(r, i.length - 1);
}
function d1(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0;
  return (
    hs() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: o,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: s,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Yy(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue;
    let o = e[s];
    if (o === void 0) continue;
    r ??= {};
    let a,
      c = zn.None;
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o);
    let l = s;
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue;
      l = i[s];
    }
    t === 0 ? Zy(r, n, l, a, c) : Zy(r, n, l, a);
  }
  return r;
}
function Zy(t, e, n, r, i) {
  let s;
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i);
}
function f1(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    s = t.data,
    o = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = s[u],
      m = n ? n.get(d) : null,
      E = m ? m.inputs : null,
      C = m ? m.outputs : null;
    (c = Yy(0, d.inputs, u, c, E)), (l = Yy(1, d.outputs, u, l, C));
    let M = c !== null && o !== null && !bh(e) ? M1(c, u, o) : null;
    a.push(M);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function h1(t) {
  return t === "class"
    ? "className"
    : t === "for"
      ? "htmlFor"
      : t === "formaction"
        ? "formAction"
        : t === "innerHtml"
          ? "innerHTML"
          : t === "readonly"
            ? "readOnly"
            : t === "tabindex"
              ? "tabIndex"
              : t;
}
function Ml(t, e, n, r, i, s, o, a) {
  let c = Vt(e, n),
    l = e.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (ap(t, n, u, r, i), fs(e) && p1(n, e.index))
    : e.type & 3
      ? ((r = h1(r)),
        (i = o != null ? o(i, e.value || "", r) : i),
        s.setProperty(c, r, i))
      : e.type & 12;
}
function p1(t, e) {
  let n = Or(e, t);
  n[de] & 16 || (n[de] |= 64);
}
function op(t, e, n, r) {
  if (rE()) {
    let i = r === null ? null : { "": -1 },
      s = E1(t, n),
      o,
      a;
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && db(t, e, n, o, i, a),
      i && b1(n, r, i);
  }
  n.mergedAttrs = to(n.mergedAttrs, n.attrs);
}
function db(t, e, n, r, i, s) {
  for (let l = 0; l < r.length; l++) lf(qc(n, e), t, r[l].type);
  D1(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let o = !1,
    a = !1,
    c = ab(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = to(n.mergedAttrs, u.hostAttrs)),
      _1(t, n, e, c, u),
      w1(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !o &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (o = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  f1(t, n, s);
}
function m1(t, e, n, r, i) {
  let s = i.hostBindings;
  if (s) {
    let o = t.hostBindingOpCodes;
    o === null && (o = t.hostBindingOpCodes = []);
    let a = ~e.index;
    g1(o) != a && o.push(a), o.push(n, r, s);
  }
}
function g1(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function y1(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd;
  fs(n) && T1(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || qc(n, e),
    Mr(r, e);
  let o = n.initialInputs;
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      l = fi(e, t, a, n);
    if ((Mr(l, e), o !== null && I1(e, a - i, l, c, n, o), Qn(c))) {
      let u = Or(n.index, e);
      u[pt] = fi(e, t, a, n);
    }
  }
}
function fb(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = AC();
  try {
    ui(s);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      af(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          v1(c, l);
    }
  } finally {
    ui(-1), af(o);
  }
}
function v1(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function E1(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s];
      if (Lv(e, o.selectors, !1))
        if ((r || (r = []), Qn(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o);
            let c = a.length;
            Nf(t, e, c);
          } else r.unshift(o), Nf(t, e, 0);
        else
          (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o);
    }
  return r === null ? null : [r, i];
}
function Nf(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function b1(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]];
      if (s == null) throw new $(-301, !1);
      r.push(e[i], s);
    }
  }
}
function w1(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    Qn(e) && (n[""] = t);
  }
}
function D1(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function _1(t, e, n, r, i) {
  t.data[r] = i;
  let s = i.factory || (i.factory = ts(i.type, !0)),
    o = new di(s, Qn(i), Et);
  (t.blueprint[r] = o), (n[r] = o), m1(t, e, r, ab(t, n, i.hostVars, qt), i);
}
function T1(t, e, n) {
  let r = Vt(e, t),
    i = lb(n),
    s = t[dn].rendererFactory,
    o = 16;
  n.signals ? (o = 4096) : n.onPush && (o = 64);
  let a = Nl(
    t,
    Il(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null),
  );
  t[e.index] = a;
}
function S1(t, e, n, r, i, s) {
  let o = Vt(t, e);
  C1(e[He], o, s, t.value, n, r, i);
}
function C1(t, e, n, r, i, s, o) {
  if (s == null) t.removeAttribute(e, i, n);
  else {
    let a = o == null ? bn(s) : o(s, r || "", i);
    t.setAttribute(e, i, a, n);
  }
}
function I1(t, e, n, r, i, s) {
  let o = s[e];
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        l = o[a++],
        u = o[a++],
        d = o[a++];
      ob(r, n, c, l, u, d);
    }
}
function M1(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (s === 0) {
      i += 4;
      continue;
    } else if (s === 5) {
      i += 2;
      continue;
    }
    if (typeof s == "number") break;
    if (t.hasOwnProperty(s)) {
      r === null && (r = []);
      let o = t[s];
      for (let a = 0; a < o.length; a += 3)
        if (o[a] === e) {
          r.push(s, o[a + 1], o[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function hb(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function pb(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = xe(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1];
        if (o !== -1) {
          let a = t.data[o];
          Lh(s), a.contentQueries(2, e[o], o);
        }
      }
    } finally {
      xe(r);
    }
  }
}
function Nl(t, e) {
  return t[io] ? (t[Py][ln] = e) : (t[io] = e), (t[Py] = e), e;
}
function Af(t, e, n) {
  Lh(0);
  let r = xe(null);
  try {
    e(t, n);
  } finally {
    xe(r);
  }
}
function mb(t) {
  return t[ro] || (t[ro] = []);
}
function gb(t) {
  return t.cleanup || (t.cleanup = []);
}
function yb(t, e, n) {
  return (t === null || Qn(t)) && (n = Ih(n[e.index])), n[He];
}
function vb(t, e) {
  let n = t[is],
    r = n ? n.get(fn, null) : null;
  r && r.handleError(e);
}
function ap(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      l = e[o],
      u = t.data[o];
    ob(u, l, r, a, c, i);
  }
}
function Eb(t, e, n) {
  let r = eE(e, t);
  BI(t[He], r, n);
}
function N1(t, e) {
  let n = Or(e, t),
    r = n[fe];
  A1(r, n);
  let i = n[st];
  i !== null && n[jt] === null && (n[jt] = Wh(i, n[is])), cp(r, n, n[pt]);
}
function A1(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function cp(t, e, n) {
  Ph(e);
  try {
    let r = t.viewQuery;
    r !== null && Af(1, r, n);
    let i = t.template;
    i !== null && cb(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[Gn]?.finishViewCreation(t),
      t.staticContentQueries && pb(t, e),
      t.staticViewQueries && Af(2, t.viewQuery, n);
    let s = t.components;
    s !== null && x1(e, s);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[de] &= -5), Fh();
  }
}
function x1(t, e) {
  for (let n = 0; n < e.length; n++) N1(t, e[n]);
}
function Al(t, e, n, r) {
  let i = xe(null);
  try {
    let s = e.tView,
      a = t[de] & 4096 ? 4096 : 16,
      c = Il(
        t,
        s,
        n,
        a,
        null,
        e,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = t[e.index];
    c[_o] = l;
    let u = t[Gn];
    return u !== null && (c[Gn] = u.createEmbeddedView(s)), cp(s, c, n), c;
  } finally {
    xe(i);
  }
}
function bb(t, e) {
  let n = dt + e;
  if (n < t.length) return t[n];
}
function ho(t, e) {
  return !e || e.firstChild === null || $c(t);
}
function xl(t, e, n, r = !0) {
  let i = e[fe];
  if ((qI(i, e, t, n), r)) {
    let o = Mf(n, t),
      a = e[He],
      c = Jh(a, t[Wn]);
    c !== null && UI(i, t[Ht], a, e, c, o);
  }
  let s = e[jt];
  s !== null && s.firstChild !== null && (s.firstChild = null);
}
function wb(t, e) {
  let n = fo(t, e);
  return n !== void 0 && Tl(n[fe], n), n;
}
function po(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index];
    s !== null && r.push(ct(s)), Ut(s) && Db(s, r);
    let o = n.type;
    if (o & 8) po(t, e, n.child, r);
    else if (o & 32) {
      let a = Kh(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (o & 16) {
      let a = eb(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = ao(e[Nt]);
        po(c[fe], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function Db(t, e) {
  for (let n = dt; n < t.length; n++) {
    let r = t[n],
      i = r[fe].firstChild;
    i !== null && po(r[fe], r, i, e);
  }
  t[Wn] !== t[st] && e.push(t[Wn]);
}
var _b = [];
function R1(t) {
  return t[li] ?? O1(t);
}
function O1(t) {
  let e = _b.pop() ?? Object.create(L1);
  return (e.lView = t), e;
}
function k1(t) {
  t.lView[li] !== t && ((t.lView = null), _b.push(t));
}
var L1 = nt(ee({}, ad), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      oo(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[li] = this;
    },
  }),
  Tb = 100;
function Sb(t, e = !0, n = 0) {
  let r = t[dn],
    i = r.rendererFactory,
    s = !1;
  s || i.begin?.();
  try {
    P1(t, n);
  } catch (o) {
    throw (e && vb(t, o), o);
  } finally {
    s || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function P1(t, e) {
  xf(t, e);
  let n = 0;
  for (; Ah(t); ) {
    if (n === Tb) throw new $(103, !1);
    n++, xf(t, 1);
  }
}
function F1(t, e, n, r) {
  let i = e[de];
  if ((i & 256) === 256) return;
  let s = !1;
  !s && e[dn].inlineEffectRunner?.flush(), Ph(e);
  let o = null,
    a = null;
  !s && j1(t) && ((a = R1(e)), (o = cd(a)));
  try {
    tE(e), IC(t.bindingStartIndex), n !== null && cb(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && Ac(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && xc(e, d, 0, null), Pd(e, 0);
      }
    if ((B1(e), Cb(e, 0), t.contentQueries !== null && pb(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && Ac(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && xc(e, d, 1), Pd(e, 1);
      }
    r1(t, e);
    let l = t.components;
    l !== null && Mb(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && Af(2, u, r), !s))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && Ac(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && xc(e, d, 2), Pd(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Nc])) {
      for (let d of e[Nc]) d();
      e[Nc] = null;
    }
    s || (e[de] &= -73);
  } catch (c) {
    throw (oo(e), c);
  } finally {
    a !== null && (ld(a, o), k1(a)), Fh();
  }
}
function j1(t) {
  return t.type !== 2;
}
function Cb(t, e) {
  for (let n = AE(t); n !== null; n = xE(n))
    for (let r = dt; r < n.length; r++) {
      let i = n[r];
      Ib(i, e);
    }
}
function B1(t) {
  for (let e = AE(t); e !== null; e = xE(e)) {
    if (!(e[de] & Th.HasTransplantedViews)) continue;
    let n = e[ss];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[lt];
      mC(i);
    }
  }
}
function H1(t, e, n) {
  let r = Or(e, t);
  Ib(r, n);
}
function Ib(t, e) {
  Nh(t) && xf(t, e);
}
function xf(t, e) {
  let r = t[fe],
    i = t[de],
    s = t[li],
    o = !!(e === 0 && i & 16);
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && za(s))),
    s && (s.dirty = !1),
    (t[de] &= -9217),
    o)
  )
    F1(r, t, r.template, t[pt]);
  else if (i & 8192) {
    Cb(t, 1);
    let a = r.components;
    a !== null && Mb(t, a, 1);
  }
}
function Mb(t, e, n) {
  for (let r = 0; r < e.length; r++) H1(t, e[r], n);
}
function lp(t) {
  for (t[dn].changeDetectionScheduler?.notify(); t; ) {
    t[de] |= 64;
    let e = ao(t);
    if (Ch(t) && !e) return t;
    t = e;
  }
  return null;
}
var hi = class {
    get rootNodes() {
      let e = this._lView,
        n = e[fe];
      return po(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[pt];
    }
    set context(e) {
      this._lView[pt] = e;
    }
    get destroyed() {
      return (this._lView[de] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[lt];
        if (Ut(e)) {
          let n = e[Hc],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (fo(e, r), jc(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Tl(this._lView[fe], this._lView);
    }
    onDestroy(e) {
      nE(this._lView, e);
    }
    markForCheck() {
      lp(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[de] &= -129;
    }
    reattach() {
      of(this._lView), (this._lView[de] |= 128);
    }
    detectChanges() {
      (this._lView[de] |= 1024), Sb(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new $(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), YE(this._lView[fe], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new $(902, !1);
      (this._appRef = e), of(this._lView);
    }
  },
  pi = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = q1;
    let t = e;
    return t;
  })(),
  U1 = pi,
  V1 = class extends U1 {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n);
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = Al(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new hi(i);
    }
  };
function q1() {
  return Rl(vt(), De());
}
function Rl(t, e) {
  return t.type & 4 ? new V1(e, t, ps(t, e)) : null;
}
var Rf = "<-- AT THIS LOCATION";
function $1(t) {
  switch (t) {
    case 4:
      return "view container";
    case 2:
      return "element";
    case 8:
      return "ng-container";
    case 32:
      return "icu";
    case 64:
      return "i18n";
    case 16:
      return "projection";
    case 1:
      return "text";
    default:
      return "<unknown>";
  }
}
function z1(t, e) {
  let n = `During serialization, Angular was unable to find an element in the DOM:

`,
    r = `${Y1(t, e, !1)}

`,
    i = X1();
  throw new $(-502, n + r + i);
}
function G1(t) {
  let e =
      "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n",
    n = `${Z1(t)}

`,
    r = e + n + J1();
  return new $(-503, r);
}
function W1(t) {
  let e = [];
  if (t.attrs)
    for (let n = 0; n < t.attrs.length; ) {
      let r = t.attrs[n++];
      if (typeof r == "number") break;
      let i = t.attrs[n++];
      e.push(`${r}="${Qc(i)}"`);
    }
  return e.join(" ");
}
var Q1 = new Set(["ngh", "ng-version", "ng-server-context"]);
function K1(t) {
  let e = [];
  for (let n = 0; n < t.attributes.length; n++) {
    let r = t.attributes[n];
    Q1.has(r.name) || e.push(`${r.name}="${Qc(r.value)}"`);
  }
  return e.join(" ");
}
function Ud(t, e = "\u2026") {
  switch (t.type) {
    case 1:
      return `#text${t.value ? `(${t.value})` : ""}`;
    case 2:
      let r = W1(t),
        i = t.value.toLowerCase();
      return `<${i}${r ? " " + r : ""}>${e}</${i}>`;
    case 8:
      return "<!-- ng-container -->";
    case 4:
      return "<!-- container -->";
    default:
      return `#node(${$1(t.type)})`;
  }
}
function kc(t, e = "\u2026") {
  let n = t;
  switch (n.nodeType) {
    case Node.ELEMENT_NODE:
      let r = n.tagName.toLowerCase(),
        i = K1(n);
      return `<${r}${i ? " " + i : ""}>${e}</${r}>`;
    case Node.TEXT_NODE:
      let s = n.textContent ? Qc(n.textContent) : "";
      return `#text${s ? `(${s})` : ""}`;
    case Node.COMMENT_NODE:
      return `<!-- ${Qc(n.textContent ?? "")} -->`;
    default:
      return `#node(${n.nodeType})`;
  }
}
function Y1(t, e, n) {
  let r = "  ",
    i = "";
  e.prev
    ? ((i +=
        r +
        `\u2026
`),
      (i +=
        r +
        Ud(e.prev) +
        `
`))
    : e.type &&
      e.type & 12 &&
      (i +=
        r +
        `\u2026
`),
    n
      ? ((i +=
          r +
          Ud(e) +
          `
`),
        (i +=
          r +
          `<!-- container -->  ${Rf}
`))
      : (i +=
          r +
          Ud(e) +
          `  ${Rf}
`),
    (i +=
      r +
      `\u2026
`);
  let s = e.type ? Xh(t[fe], e, t) : null;
  return (
    s &&
      (i = kc(
        s,
        `
` + i,
      )),
    i
  );
}
function Z1(t) {
  let e = "  ",
    n = "",
    r = t;
  return (
    r.previousSibling &&
      ((n +=
        e +
        `\u2026
`),
      (n +=
        e +
        kc(r.previousSibling) +
        `
`)),
    (n +=
      e +
      kc(r) +
      `  ${Rf}
`),
    t.nextSibling &&
      (n +=
        e +
        `\u2026
`),
    t.parentNode &&
      (n = kc(
        r.parentNode,
        `
` + n,
      )),
    n
  );
}
function X1(t) {
  return `To fix this problem:
  * check ${t ? `the "${t}"` : "corresponding"} component for hydration-related issues
  * check to see if your template has valid HTML structure
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function J1() {
  return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function eM(t) {
  return t.replace(/\s+/gm, "");
}
function Qc(t, e = 50) {
  return t
    ? ((t = eM(t)), t.length > e ? `${t.substring(0, e - 1)}\u2026` : t)
    : "";
}
function Nb(t) {
  let e = t[so] ?? [],
    r = t[lt][He];
  for (let i of e) tM(i, r);
  t[so] = It;
}
function tM(t, e) {
  let n = 0,
    r = t.firstChild;
  if (r) {
    let i = t.data[as];
    for (; n < i; ) {
      let s = r.nextSibling;
      ep(e, r, !1), (r = s), n++;
    }
  }
}
function Ab(t) {
  Nb(t);
  for (let e = dt; e < t.length; e++) Kc(t[e]);
}
function nM(t) {
  let e = t[jt]?.i18nNodes;
  if (e) {
    let n = t[He];
    for (let r of e.values()) ep(n, r, !1);
    t[jt].i18nNodes = void 0;
  }
}
function Kc(t) {
  nM(t);
  let e = t[fe];
  for (let n = We; n < e.bindingStartIndex; n++)
    if (Ut(t[n])) {
      let r = t[n];
      Ab(r);
    } else $n(t[n]) && Kc(t[n]);
}
function rM(t) {
  let e = t._views;
  for (let n of e) {
    let r = kE(n);
    if (r !== null && r[st] !== null)
      if ($n(r)) Kc(r);
      else {
        let i = r[st];
        Kc(i), Ab(r);
      }
  }
}
var iM = new RegExp(`^(\\d+)*(${$h}|${qh})*(.*)`);
function sM(t, e) {
  let n = [t];
  for (let r of e) {
    let i = n.length - 1;
    if (i > 0 && n[i - 1] === r) {
      let s = n[i] || 1;
      n[i] = s + 1;
    } else n.push(r, "");
  }
  return n.join("");
}
function oM(t) {
  let e = t.match(iM),
    [n, r, i, s] = e,
    o = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of s.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [o, ...a];
}
function aM(t) {
  return !t.prev && t.parent?.type === 8;
}
function Vd(t) {
  return t.index - We;
}
function mo(t, e) {
  return !(t.type & 16) && !!e[t.index] && !ct(e[t.index])?.isConnected;
}
function cM(t, e) {
  let n = t.i18nNodes;
  if (n) {
    let r = n.get(e);
    return r && n.delete(e), r;
  }
  return null;
}
function Ol(t, e, n, r) {
  let i = Vd(r),
    s = cM(t, i);
  if (!s) {
    let o = t.data[vf];
    if (o?.[i]) s = uM(o[i], n);
    else if (e.firstChild === r) s = t.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (aM(r)) {
        let l = Vd(r.parent);
        s = Ef(t, l);
      } else {
        let l = Vt(c, n);
        if (a) s = l.firstChild;
        else {
          let u = Vd(c),
            d = Ef(t, u);
          if (c.type === 2 && d) {
            let E = Qh(t, u) + 1;
            s = kl(E, d);
          } else s = l.nextSibling;
        }
      }
    }
  }
  return s;
}
function kl(t, e) {
  let n = e;
  for (let r = 0; r < t; r++) n = n.nextSibling;
  return n;
}
function lM(t, e) {
  let n = t;
  for (let r = 0; r < e.length; r += 2) {
    let i = e[r],
      s = e[r + 1];
    for (let o = 0; o < s; o++)
      switch (i) {
        case lo.FirstChild:
          n = n.firstChild;
          break;
        case lo.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function uM(t, e) {
  let [n, ...r] = oM(t),
    i;
  if (n === qh) i = e[Nt][st];
  else if (n === $h) i = FI(e[Nt][st]);
  else {
    let s = Number(n);
    i = ct(e[s + We]);
  }
  return lM(i, r);
}
function Of(t, e) {
  if (t === e) return [];
  if (t.parentElement == null || e.parentElement == null) return null;
  if (t.parentElement === e.parentElement) return dM(t, e);
  {
    let n = e.parentElement,
      r = Of(t, n),
      i = Of(n.firstChild, e);
    return !r || !i ? null : [...r, lo.FirstChild, ...i];
  }
}
function dM(t, e) {
  let n = [],
    r = null;
  for (r = t; r != null && r !== e; r = r.nextSibling) n.push(lo.NextSibling);
  return r == null ? null : n;
}
function Xy(t, e, n) {
  let r = Of(t, e);
  return r === null ? null : sM(n, r);
}
function fM(t, e) {
  let n = t.parent,
    r,
    i,
    s;
  for (; n !== null && mo(n, e); ) n = n.parent;
  n === null || !(n.type & 3)
    ? ((r = s = qh), (i = e[Nt][st]))
    : ((r = n.index), (i = ct(e[r])), (s = bn(r - We)));
  let o = ct(e[t.index]);
  if (t.type & 12) {
    let c = Js(e, t);
    c && (o = c);
  }
  let a = Xy(i, o, s);
  if (a === null && i !== o) {
    let c = i.ownerDocument.body;
    if (((a = Xy(c, o, $h)), a === null)) throw z1(e, t);
  }
  return a;
}
function hM(t, e) {
  let n = [];
  for (let r of e)
    for (let i = 0; i < (r[Gc] ?? 1); i++) {
      let s = { data: r, firstChild: null };
      r[as] > 0 && ((s.firstChild = t), (t = kl(r[as], t))), n.push(s);
    }
  return [t, n];
}
var xb = () => null;
function pM(t, e) {
  let n = t[so];
  return !e || n === null || n.length === 0
    ? null
    : n[0].data[yf] === e
      ? n.shift()
      : (Nb(t), null);
}
function mM() {
  xb = pM;
}
function go(t, e) {
  return xb(t, e);
}
var yo = class {},
  kf = class {},
  Yc = class {};
function gM(t) {
  let e = Error(`No component factory found for ${Mt(t)}.`);
  return (e[yM] = t), e;
}
var yM = "ngComponent";
var Lf = class {
    resolveComponentFactory(e) {
      throw gM(e);
    }
  },
  Ll = (() => {
    let e = class e {};
    e.NULL = new Lf();
    let t = e;
    return t;
  })(),
  mi = class {},
  bi = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => vM();
    let t = e;
    return t;
  })();
function vM() {
  let t = De(),
    e = vt(),
    n = Or(e.index, t);
  return ($n(n) ? n : t)[He];
}
var EM = (() => {
    let e = class e {};
    e.ɵprov = Z({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  qd = {};
var Jy = new Set();
function Mn(t) {
  Jy.has(t) ||
    (Jy.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function ev(...t) {}
function bM() {
  let t = typeof Tr.requestAnimationFrame == "function",
    e = Tr[t ? "requestAnimationFrame" : "setTimeout"],
    n = Tr[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var $e = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new yt(!1)),
        (this.onMicrotaskEmpty = new yt(!1)),
        (this.onStable = new yt(!1)),
        (this.onError = new yt(!1)),
        typeof Zone > "u")
      )
        throw new $(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = bM().nativeRequestAnimationFrame),
        _M(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new $(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new $(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask("NgZoneEvent: " + i, e, wM, ev, ev);
      try {
        return s.runTask(o, n, r);
      } finally {
        s.cancelTask(o);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  wM = {};
function up(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function DM(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Tr,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Pf(t),
                (t.isCheckStableRunning = !0),
                up(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {},
          )),
          t.fakeTopEventTask.invoke();
      },
    )),
    Pf(t));
}
function _M(t) {
  let e = () => {
    DM(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (TM(a)) return n.invokeTask(i, s, o, a);
      try {
        return tv(t), n.invokeTask(i, s, o, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          nv(t);
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return tv(t), n.invoke(i, s, o, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), nv(t);
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == "microTask"
            ? ((t._hasPendingMicrotasks = s.microTask), Pf(t), up(t))
            : s.change == "macroTask" &&
              (t.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  });
}
function Pf(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function tv(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function nv(t) {
  t._nesting--, up(t);
}
var Ff = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new yt()),
      (this.onMicrotaskEmpty = new yt()),
      (this.onStable = new yt()),
      (this.onError = new yt());
  }
  run(e, n, r) {
    return e.apply(n, r);
  }
  runGuarded(e, n, r) {
    return e.apply(n, r);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, n, r, i) {
    return e.apply(n, r);
  }
};
function TM(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function SM(t = "zone.js", e) {
  return t === "noop" ? new Ff() : t === "zone.js" ? new $e(e) : t;
}
var Rb = (() => {
  let e = class e {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let r = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let i of r) i();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  e.ɵprov = Z({ token: e, providedIn: "root", factory: () => new e() });
  let t = e;
  return t;
})();
function Zc(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      if (typeof a == "number") s = a;
      else if (s == 1) i = Yd(i, a);
      else if (s == 2) {
        let c = a,
          l = e[++o];
        r = Yd(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Xc = class extends Ll {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = Ir(e);
    return new vo(n, this.ngModule);
  }
};
function rv(t) {
  let e = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let r = t[n];
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return e;
}
function CM(t) {
  let e = t.toLowerCase();
  return e === "svg" ? Jv : e === "math" ? lC : null;
}
var jf = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = dl(r);
      let i = this.injector.get(e, qd, r);
      return i !== qd || n === qd ? i : this.parentInjector.get(e, n, r);
    }
  },
  vo = class extends Yc {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = rv(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return rv(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = BS(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      let s = xe(null);
      try {
        i = i || this.ngModule;
        let o = i instanceof kt ? i : i?.injector;
        o &&
          this.componentDef.getStandaloneInjector !== null &&
          (o = this.componentDef.getStandaloneInjector(o) || o);
        let a = o ? new jf(e, o) : e,
          c = a.get(mi, null);
        if (c === null) throw new $(407, !1);
        let l = a.get(EM, null),
          u = a.get(Rb, null),
          d = a.get(yo, null),
          m = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: d,
          },
          E = c.createRenderer(null, this.componentDef),
          C = this.componentDef.selectors[0][0] || "div",
          M = r
            ? o1(E, r, this.componentDef.encapsulation, a)
            : _l(E, C, CM(C)),
          P = 512;
        this.componentDef.signals
          ? (P |= 4096)
          : this.componentDef.onPush || (P |= 16);
        let A = null;
        M !== null && (A = Wh(M, a, !0));
        let _ = sp(0, null, null, 1, 0, null, null, null, null, null, null),
          w = Il(null, _, null, P, null, null, m, E, a, null, A);
        Ph(w);
        let T, b;
        try {
          let J = this.componentDef,
            ne,
            ve = null;
          J.findHostDirectiveDefs
            ? ((ne = []),
              (ve = new Map()),
              J.findHostDirectiveDefs(J, ne, ve),
              ne.push(J))
            : (ne = [J]);
          let z = IM(w, M),
            O = MM(z, M, J, ne, w, m, E);
          (b = Mh(_, We)),
            M && xM(E, J, M, r),
            n !== void 0 && RM(b, this.ngContentSelectors, n),
            (T = AM(O, J, ne, ve, w, [OM])),
            cp(_, w, null);
        } finally {
          Fh();
        }
        return new Bf(this.componentType, T, ps(b, w), w, b);
      } finally {
        xe(s);
      }
    }
  },
  Bf = class extends kf {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new hi(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let s = this._rootLView;
        ap(s[fe], s, i, e, n), this.previousInputValues.set(e, n);
        let o = Or(this._tNode.index, s);
        lp(o);
      }
    }
    get injector() {
      return new ai(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function IM(t, e) {
  let n = t[fe],
    r = We;
  return (t[r] = e), gs(n, r, 2, "#host", null);
}
function MM(t, e, n, r, i, s, o) {
  let a = i[fe];
  NM(r, t, e, o);
  let c = null;
  e !== null && (c = Wh(e, i[is]));
  let l = s.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Il(i, lb(n), null, u, i[t.index], t, s, l, null, null, c);
  return (
    a.firstCreatePass && Nf(a, t, r.length - 1), Nl(i, d), (i[t.index] = d)
  );
}
function NM(t, e, n, r) {
  for (let i of t) e.mergedAttrs = to(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Zc(e, e.mergedAttrs, !0), n !== null && ib(r, n, e));
}
function AM(t, e, n, r, i, s) {
  let o = vt(),
    a = i[fe],
    c = Vt(o, i);
  db(a, i, o, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = o.directiveStart + u,
      m = fi(i, a, d, o);
    Mr(m, i);
  }
  fb(a, i, o), c && Mr(c, i);
  let l = fi(i, a, o.directiveStart + o.componentOffset, o);
  if (((t[pt] = i[pt] = l), s !== null)) for (let u of s) u(l, e);
  return np(a, o, i), l;
}
function xM(t, e, n, r) {
  if (r) ef(t, n, ["ng-version", "17.3.6"]);
  else {
    let { attrs: i, classes: s } = HS(e.selectors[0]);
    i && ef(t, n, i), s && s.length > 0 && rb(t, n, s.join(" "));
  }
}
function RM(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let s = n[i];
    r.push(s != null ? Array.from(s) : null);
  }
}
function OM() {
  let t = vt();
  gl(De()[fe], t);
}
var tr = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = kM;
  let t = e;
  return t;
})();
function kM() {
  let t = vt();
  return kb(t, De());
}
var LM = tr,
  Ob = class extends LM {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return ps(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new ai(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = jh(this._hostTNode, this._hostLView);
      if (mE(e)) {
        let n = Vc(e, this._hostLView),
          r = Uc(e),
          i = n[fe].data[r + 8];
        return new ai(i, n);
      } else return new ai(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = iv(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - dt;
    }
    createEmbeddedView(e, n, r) {
      let i, s;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (s = r.injector));
      let o = go(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, s, o);
      return this.insertImpl(a, i, ho(this._hostTNode, o)), a;
    }
    createComponent(e, n, r, i, s) {
      let o = e && !rC(e),
        a;
      if (o) a = n;
      else {
        let C = n || {};
        (a = C.index),
          (r = C.injector),
          (i = C.projectableNodes),
          (s = C.environmentInjector || C.ngModuleRef);
      }
      let c = o ? e : new vo(Ir(e)),
        l = r || this.parentInjector;
      if (!s && c.ngModule == null) {
        let M = (o ? l : this.parentInjector).get(kt, null);
        M && (s = M);
      }
      let u = Ir(c.componentType ?? {}),
        d = go(this._lContainer, u?.id ?? null),
        m = d?.firstChild ?? null,
        E = c.create(l, i, m, s);
      return this.insertImpl(E.hostView, a, ho(this._hostTNode, d)), E;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (pC(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[lt],
            l = new Ob(c, c[Ht], c[lt]);
          l.detach(l.indexOf(e));
        }
      }
      let s = this._adjustIndex(n),
        o = this._lContainer;
      return xl(o, i, s, r), e.attachToViewContainerRef(), Nv($d(o), s, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = iv(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = fo(this._lContainer, n);
      r && (jc($d(this._lContainer), n), Tl(r[fe], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = fo(this._lContainer, n);
      return r && jc($d(this._lContainer), n) != null ? new hi(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function iv(t) {
  return t[Hc];
}
function $d(t) {
  return t[Hc] || (t[Hc] = []);
}
function kb(t, e) {
  let n,
    r = e[t.index];
  return (
    Ut(r) ? (n = r) : ((n = hb(r, e, null, t)), (e[t.index] = n), Nl(e, n)),
    Lb(n, e, t, r),
    new Ob(n, t, e)
  );
}
function PM(t, e) {
  let n = t[He],
    r = n.createComment(""),
    i = Vt(e, t),
    s = Jh(n, i);
  return Wc(n, s, r, KI(n, i), !1), r;
}
var Lb = Pb,
  dp = () => !1;
function FM(t, e, n) {
  return dp(t, e, n);
}
function Pb(t, e, n, r) {
  if (t[Wn]) return;
  let i;
  n.type & 8 ? (i = ct(r)) : (i = PM(e, n)), (t[Wn] = i);
}
function jM(t, e, n) {
  if (t[Wn] && t[so]) return !0;
  let r = n[jt],
    i = e.index - We;
  if (!r || zc(e) || bl(r, i)) return !1;
  let o = Ef(r, i),
    a = r.data[uo]?.[i],
    [c, l] = hM(o, a);
  return (t[Wn] = c), (t[so] = l), !0;
}
function BM(t, e, n, r) {
  dp(t, n, e) || Pb(t, e, n, r);
}
function HM() {
  (Lb = BM), (dp = jM);
}
var Hf = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Uf = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let n = e.queries;
      if (n !== null) {
        let r = e.contentQueries !== null ? e.contentQueries[0] : n.length,
          i = [];
        for (let s = 0; s < r; s++) {
          let o = n.getByIndex(s),
            a = this.queries[o.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let n = 0; n < this.queries.length; n++)
        fp(e, n).matches !== null && this.queries[n].setDirty();
    }
  },
  Jc = class {
    constructor(e, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof e == "string" ? (this.predicate = QM(e)) : (this.predicate = e);
    }
  },
  Vf = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(e, n);
    }
    elementEnd(e) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(e);
    }
    embeddedTView(e) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let i = n !== null ? n.length : 0,
          s = this.getByIndex(r).embeddedTView(e, i);
        s &&
          ((s.indexInDeclarationView = r), n !== null ? n.push(s) : (n = [s]));
      }
      return n !== null ? new t(n) : null;
    }
    template(e, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(e, n);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  qf = class t {
    constructor(e, n = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = n);
    }
    elementStart(e, n) {
      this.isApplyingToNode(n) && this.matchTNode(e, n);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, n) {
      this.elementStart(e, n);
    }
    embeddedTView(e, n) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, n),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = e.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let i = 0; i < r.length; i++) {
          let s = r[i];
          this.matchTNodeWithReadOption(e, n, UM(n, s)),
            this.matchTNodeWithReadOption(e, n, Rc(n, e, s, !1, !1));
        }
      else
        r === pi
          ? n.type & 4 && this.matchTNodeWithReadOption(e, n, -1)
          : this.matchTNodeWithReadOption(e, n, Rc(n, e, r, !1, !1));
    }
    matchTNodeWithReadOption(e, n, r) {
      if (r !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === Xn || i === tr || (i === pi && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let s = Rc(n, e, i, !1, !1);
            s !== null && this.addMatch(n.index, s);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(e, n) {
      this.matches === null ? (this.matches = [e, n]) : this.matches.push(e, n);
    }
  };
function UM(t, e) {
  let n = t.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === e) return n[r + 1];
  }
  return null;
}
function VM(t, e) {
  return t.type & 11 ? ps(t, e) : t.type & 4 ? Rl(t, e) : null;
}
function qM(t, e, n, r) {
  return n === -1 ? VM(e, t) : n === -2 ? $M(t, e, r) : fi(t, t[fe], n, e);
}
function $M(t, e, n) {
  if (n === Xn) return ps(e, t);
  if (n === pi) return Rl(e, t);
  if (n === tr) return kb(e, t);
}
function Fb(t, e, n, r) {
  let i = e[Gn].queries[r];
  if (i.matches === null) {
    let s = t.data,
      o = n.matches,
      a = [];
    for (let c = 0; o !== null && c < o.length; c += 2) {
      let l = o[c];
      if (l < 0) a.push(null);
      else {
        let u = s[l];
        a.push(qM(e, u, o[c + 1], n.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function $f(t, e, n, r) {
  let i = t.queries.getByIndex(n),
    s = i.matches;
  if (s !== null) {
    let o = Fb(t, e, i, n);
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a];
      if (c > 0) r.push(o[a / 2]);
      else {
        let l = s[a + 1],
          u = e[-c];
        for (let d = dt; d < u.length; d++) {
          let m = u[d];
          m[_o] === m[lt] && $f(m[fe], m, l, r);
        }
        if (u[ss] !== null) {
          let d = u[ss];
          for (let m = 0; m < d.length; m++) {
            let E = d[m];
            $f(E[fe], E, l, r);
          }
        }
      }
    }
  }
  return r;
}
function zM(t, e) {
  return t[Gn].queries[e].queryList;
}
function jb(t, e, n) {
  let r = new hf((n & 4) === 4);
  return (
    u1(t, e, r, r.destroy), (e[Gn] ??= new Uf()).queries.push(new Hf(r)) - 1
  );
}
function GM(t, e, n) {
  let r = et();
  return (
    r.firstCreatePass &&
      (Bb(r, new Jc(t, e, n), -1), (e & 2) === 2 && (r.staticViewQueries = !0)),
    jb(r, De(), e)
  );
}
function WM(t, e, n, r) {
  let i = et();
  if (i.firstCreatePass) {
    let s = vt();
    Bb(i, new Jc(e, n, r), s.index),
      KM(i, t),
      (n & 2) === 2 && (i.staticContentQueries = !0);
  }
  return jb(i, De(), n);
}
function QM(t) {
  return t.split(",").map((e) => e.trim());
}
function Bb(t, e, n) {
  t.queries === null && (t.queries = new Vf()), t.queries.track(new qf(e, n));
}
function KM(t, e) {
  let n = t.contentQueries || (t.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  e !== r && n.push(t.queries.length - 1, e);
}
function fp(t, e) {
  return t.queries.getByIndex(e);
}
function YM(t, e) {
  let n = t[fe],
    r = fp(n, e);
  return r.crossesNgTemplate ? $f(n, t, e, []) : Fb(n, t, r, e);
}
function Jj(t) {
  return typeof t == "function" && t[$a] !== void 0;
}
function ZM(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let s = n.get(i);
    if (!s) {
      let o = t(i);
      n.set(i, (s = o.then(tN)));
    }
    return s;
  }
  return (
    el.forEach((i, s) => {
      let o = [];
      i.templateUrl &&
        o.push(
          r(i.templateUrl).then((l) => {
            i.template = l;
          }),
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple",
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, m) => {
          a.push(""),
            o.push(
              r(d).then((E) => {
                (a[l + m] = E),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              }),
            );
        });
      } else
        i.styleUrl &&
          o.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            }),
          );
      let c = Promise.all(o).then(() => nN(s));
      e.push(c);
    }),
    JM(),
    Promise.all(e).then(() => {})
  );
}
var el = new Map(),
  XM = new Set();
function JM() {
  let t = el;
  return (el = new Map()), t;
}
function eN() {
  return el.size === 0;
}
function tN(t) {
  return typeof t == "string" ? t : t.text();
}
function nN(t) {
  XM.delete(t);
}
function rN(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function iN(t) {
  let e = rN(t.type),
    n = !0,
    r = [t];
  for (; e; ) {
    let i;
    if (Qn(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new $(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (n) {
        r.push(i);
        let o = t;
        (o.inputs = Tc(t.inputs)),
          (o.inputTransforms = Tc(t.inputTransforms)),
          (o.declaredInputs = Tc(t.declaredInputs)),
          (o.outputs = Tc(t.outputs));
        let a = i.hostBindings;
        a && lN(t, a);
        let c = i.viewQuery,
          l = i.contentQueries;
        if (
          (c && aN(t, c),
          l && cN(t, l),
          sN(t, i),
          iS(t.outputs, i.outputs),
          Qn(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let s = i.features;
      if (s)
        for (let o = 0; o < s.length; o++) {
          let a = s[o];
          a && a.ngInherit && a(t), a === iN && (n = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  oN(r);
}
function sN(t, e) {
  for (let n in e.inputs) {
    if (!e.inputs.hasOwnProperty(n) || t.inputs.hasOwnProperty(n)) continue;
    let r = e.inputs[n];
    if (
      r !== void 0 &&
      ((t.inputs[n] = r),
      (t.declaredInputs[n] = e.declaredInputs[n]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(r) ? r[0] : r;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function oN(t) {
  let e = 0,
    n = null;
  for (let r = t.length - 1; r >= 0; r--) {
    let i = t[r];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = to(i.hostAttrs, (n = to(n, i.hostAttrs))));
  }
}
function Tc(t) {
  return t === ns ? {} : t === It ? [] : t;
}
function aN(t, e) {
  let n = t.viewQuery;
  n
    ? (t.viewQuery = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.viewQuery = e);
}
function cN(t, e) {
  let n = t.contentQueries;
  n
    ? (t.contentQueries = (r, i, s) => {
        e(r, i, s), n(r, i, s);
      })
    : (t.contentQueries = e);
}
function lN(t, e) {
  let n = t.hostBindings;
  n
    ? (t.hostBindings = (r, i) => {
        e(r, i), n(r, i);
      })
    : (t.hostBindings = e);
}
function Hb(t) {
  let e = t.inputConfig,
    n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r];
      Array.isArray(i) && i[3] && (n[r] = i[3]);
    }
  t.inputTransforms = n;
}
var Nr = class {},
  Eo = class {};
var tl = class extends Nr {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Xc(this));
      let i = Hv(e);
      (this._bootstrapComponents = KE(i.bootstrap)),
        (this._r3Injector = SE(
          e,
          n,
          [
            { provide: Nr, useValue: this },
            { provide: Ll, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Mt(e),
          new Set(["environment"]),
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  nl = class extends Eo {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new tl(this.moduleType, e, []);
    }
  };
function uN(t, e, n) {
  return new tl(t, e, n);
}
var rl = class extends Nr {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Xc(this)),
      (this.instance = null);
    let n = new no(
      [
        ...e.providers,
        { provide: Nr, useValue: this },
        { provide: Ll, useValue: this.componentFactoryResolver },
      ],
      e.parent || Dh(),
      e.debugName,
      new Set(["environment"]),
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function hp(t, e, n = null) {
  return new rl({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var kr = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ht(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ub(t) {
  return pp(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function dN(t, e) {
  if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]);
  else {
    let n = t[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) e(r.value);
  }
}
function pp(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function Vb(t, e, n) {
  return (t[e] = n);
}
function fN(t, e) {
  return t[e];
}
function Bt(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function sv(t, e, n, r) {
  let i = Bt(t, e, n);
  return Bt(t, e + 1, r) || i;
}
function hN(t, e, n, r, i, s) {
  let o = sv(t, e, n, r);
  return sv(t, e + 2, i, s) || o;
}
function Mo(t) {
  return (t.flags & 32) === 32;
}
function pN(t, e, n, r, i, s, o, a, c) {
  let l = e.consts,
    u = gs(e, t, 4, o || null, os(l, a));
  op(e, n, u, os(l, c)), gl(e, u);
  let d = (u.tView = sp(
    2,
    u,
    r,
    i,
    s,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    l,
    null,
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))),
    u
  );
}
function zf(t, e, n, r, i, s, o, a) {
  let c = De(),
    l = et(),
    u = t + We,
    d = l.firstCreatePass ? pN(u, l, c, e, n, r, i, s, o) : l.data[u];
  yi(d, !1);
  let m = qb(l, c, d, t);
  ml() && Sl(l, c, m, d), Mr(m, c);
  let E = hb(m, c, m, d);
  return (
    (c[u] = E),
    Nl(c, E),
    FM(E, d, c),
    pl(d) && rp(l, c, d),
    o != null && ip(c, d, a),
    zf
  );
}
var qb = $b;
function $b(t, e, n, r) {
  return Sn(!0), e[He].createComment("");
}
function mN(t, e, n, r) {
  let i = e[jt],
    s = !i || hs() || Mo(n) || bl(i, r);
  if ((Sn(s), s)) return $b(t, e, n, r);
  let o = i.data[gf]?.[r] ?? null;
  o !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = o);
  let a = Ol(i, t, e, n);
  El(i, r, a);
  let c = Qh(i, r);
  return kl(c, a);
}
function gN() {
  qb = mN;
}
function zb(t, e, n, r) {
  let i = De(),
    s = vi();
  if (Bt(i, s, e)) {
    let o = et(),
      a = So();
    S1(a, i, t, e, n, r);
  }
  return zb;
}
function Gb(t, e, n, r) {
  return Bt(t, vi(), n) ? e + bn(n) + r : qt;
}
function yN(t, e, n, r, i, s, o, a, c, l, u, d) {
  let m = CC(),
    E = hN(t, m, n, i, o, c);
  return (
    (E = Bt(t, m + 4, u) || E),
    Oh(5),
    E ? e + bn(n) + r + bn(i) + s + bn(o) + a + bn(c) + l + bn(u) + d : qt
  );
}
function Sc(t, e) {
  return (t << 17) | (e << 2);
}
function gi(t) {
  return (t >> 17) & 32767;
}
function vN(t) {
  return (t & 2) == 2;
}
function EN(t, e) {
  return (t & 131071) | (e << 17);
}
function Gf(t) {
  return t | 2;
}
function cs(t) {
  return (t & 131068) >> 2;
}
function zd(t, e) {
  return (t & -131069) | (e << 2);
}
function bN(t) {
  return (t & 1) === 1;
}
function Wf(t) {
  return t | 1;
}
function wN(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = gi(o),
    c = cs(o);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Do(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let m = gi(t[a + 1]);
      (t[r + 1] = Sc(m, a)),
        m !== 0 && (t[m + 1] = zd(t[m + 1], r)),
        (t[a + 1] = EN(t[a + 1], r));
    } else
      (t[r + 1] = Sc(a, 0)), a !== 0 && (t[a + 1] = zd(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = Sc(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = zd(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = Gf(t[r + 1])),
    ov(t, u, r, !0),
    ov(t, u, r, !1),
    DN(e, u, t, r, s),
    (o = Sc(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o);
}
function DN(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles;
  s != null &&
    typeof e == "string" &&
    Do(s, e) >= 0 &&
    (n[r + 1] = Wf(n[r + 1]));
}
function ov(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? gi(i) : cs(i),
    a = !1;
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      l = t[o + 1];
    _N(c, e) && ((a = !0), (t[o + 1] = r ? Wf(l) : Gf(l))),
      (o = r ? gi(l) : cs(l));
  }
  a && (t[n + 1] = r ? Gf(i) : Wf(i));
}
function _N(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
      ? Do(t, e) >= 0
      : !1;
}
var cn = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function TN(t) {
  return t.substring(cn.key, cn.keyEnd);
}
function SN(t) {
  return CN(t), Wb(t, Qb(t, 0, cn.textEnd));
}
function Wb(t, e) {
  let n = cn.textEnd;
  return n === e ? -1 : ((e = cn.keyEnd = IN(t, (cn.key = e), n)), Qb(t, e, n));
}
function CN(t) {
  (cn.key = 0),
    (cn.keyEnd = 0),
    (cn.value = 0),
    (cn.valueEnd = 0),
    (cn.textEnd = t.length);
}
function Qb(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++;
  return e;
}
function IN(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++;
  return e;
}
function MN(t, e, n) {
  let r = De(),
    i = vi();
  if (Bt(r, i, e)) {
    let s = et(),
      o = So();
    Ml(s, o, r, t, e, r[He], n, !1);
  }
  return MN;
}
function Qf(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? "class" : "style";
  ap(t, n, s[o], o, r);
}
function Kb(t, e, n) {
  return Yb(t, e, n, !1), Kb;
}
function NN(t, e) {
  return Yb(t, e, null, !0), NN;
}
function e3(t) {
  xN(FN, AN, t, !0);
}
function AN(t, e) {
  for (let n = SN(e); n >= 0; n = Wb(e, n)) Eh(t, TN(e), !0);
}
function Yb(t, e, n, r) {
  let i = De(),
    s = et(),
    o = Oh(2);
  if ((s.firstUpdatePass && Xb(s, t, o, r), e !== qt && Bt(i, o, e))) {
    let a = s.data[Zn()];
    Jb(s, a, i, i[He], t, (i[o + 1] = BN(e, n)), r, o);
  }
}
function xN(t, e, n, r) {
  let i = et(),
    s = Oh(2);
  i.firstUpdatePass && Xb(i, null, s, r);
  let o = De();
  if (n !== qt && Bt(o, s, n)) {
    let a = i.data[Zn()];
    if (e0(a, r) && !Zb(i, s)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (n = Yd(c, n || "")), Qf(i, a, o, n, r);
    } else jN(i, a, o, o[He], o[s + 1], (o[s + 1] = PN(t, e, n)), r, s);
  }
}
function Zb(t, e) {
  return e >= t.expandoStartIndex;
}
function Xb(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let s = i[Zn()],
      o = Zb(t, n);
    e0(s, r) && e === null && !o && (e = !1),
      (e = RN(i, s, e, r)),
      wN(i, s, e, n, o, r);
  }
}
function RN(t, e, n, r) {
  let i = kh(t),
    s = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = Gd(null, t, e, n, r)), (n = bo(n, e.attrs, r)), (s = null));
  else {
    let o = e.directiveStylingLast;
    if (o === -1 || t[o] !== i)
      if (((n = Gd(i, t, e, n, r)), s === null)) {
        let c = ON(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Gd(null, t, e, c[1], r)),
          (c = bo(c, e.attrs, r)),
          kN(t, e, r, c));
      } else s = LN(t, e, r);
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  );
}
function ON(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (cs(r) !== 0) return t[gi(r)];
}
function kN(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[gi(i)] = r;
}
function LN(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs;
    r = bo(r, o, n);
  }
  return bo(r, e.attrs, n);
}
function Gd(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = bo(r, s.hostAttrs, i)), s !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function bo(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s];
      typeof o == "number"
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Eh(t, o, n ? !0 : e[++s]));
    }
  return t === void 0 ? null : t;
}
function PN(t, e, n) {
  if (n == null || n === "") return It;
  let r = [],
    i = In(n);
  if (Array.isArray(i)) for (let s = 0; s < i.length; s++) t(r, i[s], !0);
  else if (typeof i == "object")
    for (let s in i) i.hasOwnProperty(s) && t(r, s, i[s]);
  else typeof i == "string" && e(r, i);
  return r;
}
function FN(t, e, n) {
  let r = String(e);
  r !== "" && !r.includes(" ") && Eh(t, r, n);
}
function jN(t, e, n, r, i, s, o, a) {
  i === qt && (i = It);
  let c = 0,
    l = 0,
    u = 0 < i.length ? i[0] : null,
    d = 0 < s.length ? s[0] : null;
  for (; u !== null || d !== null; ) {
    let m = c < i.length ? i[c + 1] : void 0,
      E = l < s.length ? s[l + 1] : void 0,
      C = null,
      M;
    u === d
      ? ((c += 2), (l += 2), m !== E && ((C = d), (M = E)))
      : d === null || (u !== null && u < d)
        ? ((c += 2), (C = u))
        : ((l += 2), (C = d), (M = E)),
      C !== null && Jb(t, e, n, r, C, M, o, a),
      (u = c < i.length ? i[c] : null),
      (d = l < s.length ? s[l] : null);
  }
}
function Jb(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = bN(l) ? av(c, e, n, i, cs(l), o) : void 0;
  if (!il(u)) {
    il(s) || (vN(l) && (s = av(c, null, n, i, a, o)));
    let d = eE(Zn(), n);
    e1(r, o, d, i, s);
  }
}
function av(t, e, n, r, i, s) {
  let o = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      m = n[i + 1];
    m === qt && (m = d ? It : void 0);
    let E = d ? kd(m, r) : u === r ? m : void 0;
    if ((l && !il(E) && (E = kd(c, r)), il(E) && ((a = E), o))) return a;
    let C = t[i + 1];
    i = o ? gi(C) : cs(C);
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles;
    c != null && (a = kd(c, r));
  }
  return a;
}
function il(t) {
  return t !== void 0;
}
function BN(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = Mt(In(t)))),
    t
  );
}
function e0(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var Kf = class {
  destroy(e) {}
  updateValue(e, n) {}
  swap(e, n) {
    let r = Math.min(e, n),
      i = Math.max(e, n),
      s = this.detach(i);
    if (i - r > 1) {
      let o = this.detach(r);
      this.attach(r, s), this.attach(i, o);
    } else this.attach(r, s);
  }
  move(e, n) {
    this.attach(n, this.detach(e));
  }
};
function Wd(t, e, n, r, i) {
  return t === n && Object.is(e, r) ? 1 : Object.is(i(t, e), i(n, r)) ? -1 : 0;
}
function HN(t, e, n) {
  let r,
    i,
    s = 0,
    o = t.length - 1;
  if (Array.isArray(e)) {
    let a = e.length - 1;
    for (; s <= o && s <= a; ) {
      let c = t.at(s),
        l = e[s],
        u = Wd(s, c, s, l, n);
      if (u !== 0) {
        u < 0 && t.updateValue(s, l), s++;
        continue;
      }
      let d = t.at(o),
        m = e[a],
        E = Wd(o, d, a, m, n);
      if (E !== 0) {
        E < 0 && t.updateValue(o, m), o--, a--;
        continue;
      }
      let C = n(s, c),
        M = n(o, d),
        P = n(s, l);
      if (Object.is(P, M)) {
        let A = n(a, m);
        Object.is(A, C)
          ? (t.swap(s, o), t.updateValue(o, m), a--, o--)
          : t.move(o, s),
          t.updateValue(s, l),
          s++;
        continue;
      }
      if (((r ??= new sl()), (i ??= lv(t, s, o, n)), Yf(t, r, s, P)))
        t.updateValue(s, l), s++, o++;
      else if (i.has(P)) r.set(C, t.detach(s)), o--;
      else {
        let A = t.create(s, e[s]);
        t.attach(s, A), s++, o++;
      }
    }
    for (; s <= a; ) cv(t, r, n, s, e[s]), s++;
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      c = a.next();
    for (; !c.done && s <= o; ) {
      let l = t.at(s),
        u = c.value,
        d = Wd(s, l, s, u, n);
      if (d !== 0) d < 0 && t.updateValue(s, u), s++, (c = a.next());
      else {
        (r ??= new sl()), (i ??= lv(t, s, o, n));
        let m = n(s, u);
        if (Yf(t, r, s, m)) t.updateValue(s, u), s++, o++, (c = a.next());
        else if (!i.has(m))
          t.attach(s, t.create(s, u)), s++, o++, (c = a.next());
        else {
          let E = n(s, l);
          r.set(E, t.detach(s)), o--;
        }
      }
    }
    for (; !c.done; ) cv(t, r, n, t.length, c.value), (c = a.next());
  }
  for (; s <= o; ) t.destroy(t.detach(o--));
  r?.forEach((a) => {
    t.destroy(a);
  });
}
function Yf(t, e, n, r) {
  return e !== void 0 && e.has(r)
    ? (t.attach(n, e.get(r)), e.delete(r), !0)
    : !1;
}
function cv(t, e, n, r, i) {
  if (Yf(t, e, r, n(r, i))) t.updateValue(r, i);
  else {
    let s = t.create(r, i);
    t.attach(r, s);
  }
}
function lv(t, e, n, r) {
  let i = new Set();
  for (let s = e; s <= n; s++) i.add(r(s, t.at(s)));
  return i;
}
var sl = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(e) {
    return this.kvMap.has(e);
  }
  delete(e) {
    if (!this.has(e)) return !1;
    let n = this.kvMap.get(e);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(e, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(e),
      !0
    );
  }
  get(e) {
    return this.kvMap.get(e);
  }
  set(e, n) {
    if (this.kvMap.has(e)) {
      let r = this.kvMap.get(e);
      this._vMap === void 0 && (this._vMap = new Map());
      let i = this._vMap;
      for (; i.has(r); ) r = i.get(r);
      i.set(r, n);
    } else this.kvMap.set(e, n);
  }
  forEach(e) {
    for (let [n, r] of this.kvMap)
      if ((e(r, n), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(r); ) (r = i.get(r)), e(r, n);
      }
  }
};
function t3(t, e, n) {
  Mn("NgControlFlow");
  let r = De(),
    i = vi(),
    s = eh(r, We + t),
    o = 0;
  if (Bt(r, i, e)) {
    let a = xe(null);
    try {
      if ((wb(s, o), e !== -1)) {
        let c = th(r[fe], We + e),
          l = go(s, c.tView.ssrId),
          u = Al(r, c, n, { dehydratedView: l });
        xl(s, u, o, ho(c, l));
      }
    } finally {
      xe(a);
    }
  } else {
    let a = bb(s, o);
    a !== void 0 && (a[pt] = n);
  }
}
var Zf = class {
  constructor(e, n, r) {
    (this.lContainer = e), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - dt;
  }
};
function n3(t, e) {
  return e;
}
var Xf = class {
  constructor(e, n, r) {
    (this.hasEmptyBlock = e), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function r3(t, e, n, r, i, s, o, a, c, l, u, d, m) {
  Mn("NgControlFlow");
  let E = c !== void 0,
    C = De(),
    M = a ? o.bind(C[Nt][pt]) : o,
    P = new Xf(E, M);
  (C[We + t] = P), zf(t + 1, e, n, r, i, s), E && zf(t + 2, c, l, u, d, m);
}
var Jf = class extends Kf {
  constructor(e, n, r) {
    super(),
      (this.lContainer = e),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - dt;
  }
  at(e) {
    return this.getLView(e)[pt].$implicit;
  }
  attach(e, n) {
    let r = n[jt];
    (this.needsIndexUpdate ||= e !== this.length),
      xl(this.lContainer, n, e, ho(this.templateTNode, r));
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), UN(this.lContainer, e)
    );
  }
  create(e, n) {
    let r = go(this.lContainer, this.templateTNode.tView.ssrId);
    return Al(
      this.hostLView,
      this.templateTNode,
      new Zf(this.lContainer, n, e),
      { dehydratedView: r },
    );
  }
  destroy(e) {
    Tl(e[fe], e);
  }
  updateValue(e, n) {
    this.getLView(e)[pt].$implicit = n;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[pt].$index = e;
  }
  getLView(e) {
    return VN(this.lContainer, e);
  }
};
function i3(t) {
  let e = xe(null),
    n = Zn();
  try {
    let r = De(),
      i = r[fe],
      s = r[n];
    if (s.liveCollection === void 0) {
      let a = n + 1,
        c = eh(r, a),
        l = th(i, a);
      s.liveCollection = new Jf(c, r, l);
    } else s.liveCollection.reset();
    let o = s.liveCollection;
    if ((HN(o, t, s.trackByFn), o.updateIndexes(), s.hasEmptyBlock)) {
      let a = vi(),
        c = o.length === 0;
      if (Bt(r, a, c)) {
        let l = n + 2,
          u = eh(r, l);
        if (c) {
          let d = th(i, l),
            m = go(u, d.tView.ssrId),
            E = Al(r, d, void 0, { dehydratedView: m });
          xl(u, E, 0, ho(d, m));
        } else wb(u, 0);
      }
    }
  } finally {
    xe(e);
  }
}
function eh(t, e) {
  return t[e];
}
function UN(t, e) {
  return fo(t, e);
}
function VN(t, e) {
  return bb(t, e);
}
function th(t, e) {
  return Mh(t, e);
}
function qN(t, e, n, r, i, s) {
  let o = e.consts,
    a = os(o, i),
    c = gs(e, t, 2, r, a);
  return (
    op(e, n, c, os(o, s)),
    c.attrs !== null && Zc(c, c.attrs, !1),
    c.mergedAttrs !== null && Zc(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function t0(t, e, n, r) {
  let i = De(),
    s = et(),
    o = We + t,
    a = i[He],
    c = s.firstCreatePass ? qN(o, s, i, e, n, r) : s.data[o],
    l = r0(s, i, c, a, e, t);
  i[o] = l;
  let u = pl(c);
  return (
    yi(c, !0),
    ib(a, l, c),
    !Mo(c) && ml() && Sl(s, i, l, c),
    vC() === 0 && Mr(l, i),
    EC(),
    u && (rp(s, i, c), np(s, c, i)),
    r !== null && ip(i, c),
    t0
  );
}
function n0() {
  let t = vt();
  xh() ? Rh() : ((t = t.parent), yi(t, !1));
  let e = t;
  wC(e) && _C(), bC();
  let n = et();
  return (
    n.firstCreatePass && (gl(n, t), Sh(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      FC(e) &&
      Qf(n, e, De(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      jC(e) &&
      Qf(n, e, De(), e.stylesWithoutHost, !1),
    n0
  );
}
function mp(t, e, n, r) {
  return t0(t, e, n, r), n0(), mp;
}
var r0 = (t, e, n, r, i, s) => (Sn(!0), _l(r, i, fE()));
function $N(t, e, n, r, i, s) {
  let o = e[jt],
    a = !o || hs() || Mo(n) || bl(o, s);
  if ((Sn(a), a)) return _l(r, i, fE());
  let c = Ol(o, t, e, n);
  return (
    LE(o, s) && El(o, s, c.nextSibling),
    o && (IE(n) || ME(c)) && fs(n) && (DC(n), tb(c)),
    c
  );
}
function zN() {
  r0 = $N;
}
function GN(t, e, n, r, i) {
  let s = e.consts,
    o = os(s, r),
    a = gs(e, t, 8, "ng-container", o);
  o !== null && Zc(a, o, !0);
  let c = os(s, i);
  return op(e, n, a, c), e.queries !== null && e.queries.elementStart(e, a), a;
}
function i0(t, e, n) {
  let r = De(),
    i = et(),
    s = t + We,
    o = i.firstCreatePass ? GN(s, i, r, e, n) : i.data[s];
  yi(o, !0);
  let a = o0(i, r, o, t);
  return (
    (r[s] = a),
    ml() && Sl(i, r, a, o),
    Mr(a, r),
    pl(o) && (rp(i, r, o), np(i, o, r)),
    n != null && ip(r, o),
    i0
  );
}
function s0() {
  let t = vt(),
    e = et();
  return (
    xh() ? Rh() : ((t = t.parent), yi(t, !1)),
    e.firstCreatePass && (gl(e, t), Sh(t) && e.queries.elementEnd(t)),
    s0
  );
}
function WN(t, e, n) {
  return i0(t, e, n), s0(), WN;
}
var o0 = (t, e, n, r) => (Sn(!0), Zh(e[He], ""));
function QN(t, e, n, r) {
  let i,
    s = e[jt],
    o = !s || hs() || Mo(n);
  if ((Sn(o), o)) return Zh(e[He], "");
  let a = Ol(s, t, e, n),
    c = fI(s, r);
  return El(s, r, a), (i = kl(c, a)), i;
}
function KN() {
  o0 = QN;
}
function s3() {
  return De();
}
function YN(t, e, n) {
  let r = De(),
    i = vi();
  if (Bt(r, i, e)) {
    let s = et(),
      o = So();
    Ml(s, o, r, t, e, r[He], n, !0);
  }
  return YN;
}
function ZN(t, e, n) {
  let r = De(),
    i = vi();
  if (Bt(r, i, e)) {
    let s = et(),
      o = So(),
      a = kh(s.data),
      c = yb(a, o, r);
    Ml(s, o, r, t, e, c, n, !0);
  }
  return ZN;
}
var ls = "en-US";
var XN = ls;
function a0(t) {
  typeof t == "string" && (XN = t.toLowerCase().replace(/_/g, "-"));
}
function c0(t, e, n) {
  let r = t[He];
  switch (n) {
    case Node.COMMENT_NODE:
      return Zh(r, e);
    case Node.TEXT_NODE:
      return Yh(r, e);
    case Node.ELEMENT_NODE:
      return _l(r, e, null);
  }
}
var JN = (t, e, n, r) => (Sn(!0), c0(t, n, r));
function eA(t, e, n, r) {
  return Sn(!0), c0(t, n, r);
}
function tA() {
  JN = eA;
}
function l0(t, e, n, r) {
  let i = De(),
    s = et(),
    o = vt();
  return u0(s, i, i[He], o, t, e, r), l0;
}
function nA(t, e) {
  let n = vt(),
    r = De(),
    i = et(),
    s = kh(i.data),
    o = yb(s, n, r);
  return u0(i, r, o, n, t, e), nA;
}
function rA(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s];
      if (o === n && i[s + 1] === r) {
        let a = e[ro],
          c = i[s + 2];
        return a.length > c ? a[c] : null;
      }
      typeof o == "string" && (s += 2);
    }
  return null;
}
function u0(t, e, n, r, i, s, o) {
  let a = pl(r),
    l = t.firstCreatePass && gb(t),
    u = e[pt],
    d = mb(e),
    m = !0;
  if (r.type & 3 || o) {
    let M = Vt(r, e),
      P = o ? o(M) : M,
      A = d.length,
      _ = o ? (T) => o(ct(T[r.index])) : r.index,
      w = null;
    if ((!o && a && (w = rA(t, e, i, r.index)), w !== null)) {
      let T = w.__ngLastListenerFn__ || w;
      (T.__ngNextListenerFn__ = s), (w.__ngLastListenerFn__ = s), (m = !1);
    } else {
      s = dv(r, e, u, s, !1);
      let T = n.listen(P, i, s);
      d.push(s, T), l && l.push(i, _, A, A + 1);
    }
  } else s = dv(r, e, u, s, !1);
  let E = r.outputs,
    C;
  if (m && E !== null && (C = E[i])) {
    let M = C.length;
    if (M)
      for (let P = 0; P < M; P += 2) {
        let A = C[P],
          _ = C[P + 1],
          b = e[A][_].subscribe(s),
          J = d.length;
        d.push(s, b), l && l.push(i, r.index, J, -(J + 1));
      }
  }
}
function uv(t, e, n, r) {
  let i = xe(null);
  try {
    return wn(6, e, n), n(r) !== !1;
  } catch (s) {
    return vb(t, s), !1;
  } finally {
    wn(7, e, n), xe(i);
  }
}
function dv(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r;
    let a = t.componentOffset > -1 ? Or(t.index, e) : e;
    lp(a);
    let c = uv(e, n, r, o),
      l = s.__ngNextListenerFn__;
    for (; l; ) (c = uv(e, n, l, o) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && o.preventDefault(), c;
  };
}
function o3(t = 1) {
  return RC(t);
}
function iA(t, e) {
  let n = null,
    r = kS(t);
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s === "*") {
      n = i;
      continue;
    }
    if (r === null ? Lv(t, s, !0) : FS(r, s)) return i;
  }
  return n;
}
function a3(t) {
  let e = De()[Nt][Ht];
  if (!e.projection) {
    let n = t ? t.length : 1,
      r = (e.projection = SS(n, null)),
      i = r.slice(),
      s = e.child;
    for (; s !== null; ) {
      let o = t ? iA(s, t) : 0;
      o !== null && (i[o] ? (i[o].projectionNext = s) : (r[o] = s), (i[o] = s)),
        (s = s.next);
    }
  }
}
function c3(t, e = 0, n) {
  let r = De(),
    i = et(),
    s = gs(i, We + t, 16, null, n || null);
  s.projection === null && (s.projection = e),
    Rh(),
    (!r[jt] || hs()) && (s.flags & 32) !== 32 && XI(i, r, s);
}
function sA(t, e, n) {
  return d0(t, "", e, "", n), sA;
}
function d0(t, e, n, r, i) {
  let s = De(),
    o = Gb(s, e, n, r);
  if (o !== qt) {
    let a = et(),
      c = So();
    Ml(a, c, s, t, o, s[He], i, !1);
  }
  return d0;
}
function oA(t, e, n, r) {
  WM(t, e, n, r);
}
function l3(t, e, n) {
  GM(t, e, n);
}
function aA(t) {
  let e = De(),
    n = et(),
    r = oE();
  Lh(r + 1);
  let i = fp(n, r);
  if (t.dirty && hC(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let s = YM(e, r);
      t.reset(s, ZC), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function cA() {
  return zM(De(), oE());
}
function u3(t) {
  let e = SC();
  return fC(e, We + t);
}
function d3(t, e = "") {
  let n = De(),
    r = et(),
    i = t + We,
    s = r.firstCreatePass ? gs(r, i, 1, e, null) : r.data[i],
    o = f0(r, n, s, e, t);
  (n[i] = o), ml() && Sl(r, n, o, s), yi(s, !1);
}
var f0 = (t, e, n, r, i) => (Sn(!0), Yh(e[He], r));
function lA(t, e, n, r, i) {
  let s = e[jt],
    o = !s || hs() || Mo(n) || bl(s, i);
  return Sn(o), o ? Yh(e[He], r) : Ol(s, t, e, n);
}
function uA() {
  f0 = lA;
}
function dA(t) {
  return h0("", t, ""), dA;
}
function h0(t, e, n) {
  let r = De(),
    i = Gb(r, t, e, n);
  return i !== qt && Eb(r, Zn(), i), h0;
}
function fA(t, e, n, r, i, s, o, a, c, l, u) {
  let d = De(),
    m = yN(d, t, e, n, r, i, s, o, a, c, l, u);
  return m !== qt && Eb(d, Zn(), m), fA;
}
function hA(t, e, n) {
  let r = et();
  if (r.firstCreatePass) {
    let i = Qn(t);
    nh(n, r.data, r.blueprint, i, !0), nh(e, r.data, r.blueprint, i, !1);
  }
}
function nh(t, e, n, r, i) {
  if (((t = Ct(t)), Array.isArray(t)))
    for (let s = 0; s < t.length; s++) nh(t[s], e, n, r, i);
  else {
    let s = et(),
      o = De(),
      a = vt(),
      c = rs(t) ? t : Ct(t.provide),
      l = Gv(t),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      m = a.providerIndexes >> 20;
    if (rs(t) || !t.multi) {
      let E = new di(l, i, Et),
        C = Kd(c, e, i ? u : u + m, d);
      C === -1
        ? (lf(qc(a, o), s, c),
          Qd(s, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(E),
          o.push(E))
        : ((n[C] = E), (o[C] = E));
    } else {
      let E = Kd(c, e, u + m, d),
        C = Kd(c, e, u, u + m),
        M = E >= 0 && n[E],
        P = C >= 0 && n[C];
      if ((i && !P) || (!i && !M)) {
        lf(qc(a, o), s, c);
        let A = gA(i ? mA : pA, n.length, i, r, l);
        !i && P && (n[C].providerFactory = A),
          Qd(s, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(A),
          o.push(A);
      } else {
        let A = p0(n[i ? C : E], l, !i && r);
        Qd(s, t, E > -1 ? E : C, A);
      }
      !i && r && P && n[C].componentProviders++;
    }
  }
}
function Qd(t, e, n, r) {
  let i = rs(e),
    s = QS(e);
  if (i || s) {
    let c = (s ? Ct(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let l = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function p0(t, e, n) {
  return n && t.componentProviders++, t.multi.push(e) - 1;
}
function Kd(t, e, n, r) {
  for (let i = n; i < r; i++) if (e[i] === t) return i;
  return -1;
}
function pA(t, e, n, r) {
  return rh(this.multi, []);
}
function mA(t, e, n, r) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let o = this.providerFactory.componentProviders,
      a = fi(n, n[fe], this.providerFactory.index, r);
    (s = a.slice(0, o)), rh(i, s);
    for (let c = o; c < a.length; c++) s.push(a[c]);
  } else (s = []), rh(i, s);
  return s;
}
function rh(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    e.push(r());
  }
  return e;
}
function gA(t, e, n, r, i) {
  let s = new di(t, n, Et);
  return (
    (s.multi = []),
    (s.index = e),
    (s.componentProviders = 0),
    p0(s, i, r && !n),
    s
  );
}
function f3(t, e = []) {
  return (n) => {
    n.providersResolver = (r, i) => hA(r, i ? i(t) : t, e);
  };
}
var yA = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = qv(!1, r.type),
          s =
            i.length > 0
              ? hp([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, s);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = Z({
    token: e,
    providedIn: "environment",
    factory: () => new e(ie(kt)),
  });
  let t = e;
  return t;
})();
function m0(t) {
  Mn("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(yA).getOrCreateStandaloneInjector(t));
}
function h3(t, e, n) {
  let r = sE() + t,
    i = De();
  return i[r] === qt ? Vb(i, r, n ? e.call(n) : e()) : fN(i, r);
}
function p3(t, e, n, r) {
  return EA(De(), sE(), t, e, n, r);
}
function vA(t, e) {
  let n = t[e];
  return n === qt ? void 0 : n;
}
function EA(t, e, n, r, i, s) {
  let o = e + n;
  return Bt(t, o, i) ? Vb(t, o + 1, s ? r.call(s, i) : r(i)) : vA(t, o + 1);
}
function m3(t, e) {
  return Rl(t, e);
}
var Cc = null;
function bA(t) {
  (Cc !== null &&
    (t.defaultEncapsulation !== Cc.defaultEncapsulation ||
      t.preserveWhitespaces !== Cc.preserveWhitespaces)) ||
    (Cc = t);
}
var Pl = (() => {
  let e = class e {
    log(r) {
      console.log(r);
    }
    warn(r) {
      console.warn(r);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var Fl = new oe(""),
  g0 = new oe(""),
  gp = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          yp || (wA(s), s.addToWindow(i)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                $e.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb();
            }
          });
        else {
          let r = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(r) ? (clearTimeout(i.timeoutId), !1) : !0,
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, i, s) {
        let o = -1;
        i &&
          i > 0 &&
          (o = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== o,
            )),
              r();
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: o, updateCb: s });
      }
      whenStable(r, i, s) {
        if (s && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
          );
        this.addCallback(r, i, s), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, i, s) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie($e), ie(y0), ie(g0));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  y0 = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, i) {
        this._applications.set(r, i);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, i = !0) {
        return yp?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function wA(t) {
  yp = t;
}
var yp;
function No(t) {
  return !!t && typeof t.then == "function";
}
function v0(t) {
  return !!t && typeof t.subscribe == "function";
}
var E0 = new oe(""),
  vp = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = G(E0, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let s of this.appInits) {
          let o = s();
          if (No(o)) r.push(o);
          else if (v0(o)) {
            let a = new Promise((c, l) => {
              o.subscribe({ complete: c, error: l });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((s) => {
            this.reject(s);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ys = new oe("");
function b0() {
  Kg(() => {
    throw new $(600, !1);
  });
}
function DA(t) {
  return t.isBoundToModule;
}
function w0(t, e, n) {
  try {
    let r = n();
    return No(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function D0(t, e) {
  return Array.isArray(e) ? e.reduce(D0, t) : ee(ee({}, t), e);
}
var hn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = G(CE)),
        (this.afterRenderEffectManager = G(Rb)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new it()),
        (this.afterTick = new it()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = G(kr).hasPendingTasks.pipe(Te((r) => !r))),
        (this._injector = G(kt));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let s = r instanceof Yc;
      if (!this._injector.get(vp).done) {
        let E = !s && Bv(r),
          C = !1;
        throw new $(405, C);
      }
      let a;
      s ? (a = r) : (a = this._injector.get(Ll).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = DA(a) ? void 0 : this._injector.get(Nr),
        l = i || a.selector,
        u = a.create(Jt.NULL, [], l, c),
        d = u.location.nativeElement,
        m = u.injector.get(Fl, null);
      return (
        m?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            Lc(this.components, u),
            m?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new $(101, !1);
      let i = xe(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (s) {
        this.internalErrorHandler(s);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), xe(i);
      }
    }
    detectChangesInAttachedViews(r) {
      let i = 0,
        s = this.afterRenderEffectManager;
      for (;;) {
        if (i === Tb) throw new $(103, !1);
        if (r) {
          let o = i === 0;
          this.beforeRender.next(o);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            _A(a, o, c);
        }
        if (
          (i++,
          s.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: o }) => ih(o),
          ) &&
            (s.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: o }) => ih(o),
            )))
        )
          break;
      }
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      Lc(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(ys, []);
      [...this._bootstrapListeners, ...i].forEach((s) => s(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => Lc(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new $(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Lc(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var Ic;
function Ao(t) {
  Ic ??= new WeakMap();
  let e = Ic.get(t);
  if (e) return e;
  let n = t.isStable
    .pipe(on((r) => r))
    .toPromise()
    .then(() => {});
  return Ic.set(t, n), t.onDestroy(() => Ic?.delete(t)), n;
}
function _A(t, e, n) {
  (!e && !ih(t)) || TA(t, n, e);
}
function ih(t) {
  return Ah(t);
}
function TA(t, e, n) {
  let r;
  n ? ((r = 0), (t[de] |= 1024)) : t[de] & 64 ? (r = 0) : (r = 1), Sb(t, e, r);
}
var sh = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  Ep = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new nl(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          s = Hv(r),
          o = KE(s.declarations).reduce((a, c) => {
            let l = Ir(c);
            return l && a.push(new vo(l)), a;
          }, []);
        return new sh(i, o);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  SA = new oe("");
function CA(t, e, n) {
  let r = new nl(n);
  return Promise.resolve(r);
}
function fv(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var IA = (() => {
  let e = class e {
    constructor() {
      (this.zone = G($e)), (this.applicationRef = G(hn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function _0(t) {
  return [
    { provide: $e, useFactory: t },
    {
      provide: ci,
      multi: !0,
      useFactory: () => {
        let e = G(IA, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: ci,
      multi: !0,
      useFactory: () => {
        let e = G(AA);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: CE, useFactory: MA },
  ];
}
function MA() {
  let t = G($e),
    e = G(fn);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function NA(t) {
  let e = _0(() => new $e(T0(t)));
  return Tn([[], e]);
}
function T0(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var AA = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new rt()),
        (this.initialized = !1),
        (this.zone = G($e)),
        (this.pendingTasks = G(kr));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              $e.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            $e.assertInAngularZone(), (r ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function xA() {
  return (typeof $localize < "u" && $localize.locale) || ls;
}
var jl = new oe("", {
  providedIn: "root",
  factory: () => G(jl, Ce.Optional | Ce.SkipSelf) || xA(),
});
var bp = new oe(""),
  S0 = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let s = SM(
          i?.ngZone,
          T0({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          }),
        );
        return s.run(() => {
          let o = uN(
              r.moduleType,
              this.injector,
              _0(() => s),
            ),
            a = o.injector.get(fn, null);
          return (
            s.runOutsideAngular(() => {
              let c = s.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              o.onDestroy(() => {
                Lc(this._modules, o), c.unsubscribe();
              });
            }),
            w0(a, s, () => {
              let c = o.injector.get(vp);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = o.injector.get(jl, ls);
                  return a0(l || ls), this._moduleDoBootstrap(o), o;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let s = D0({}, i);
        return CA(this.injector, s, r).then((o) =>
          this.bootstrapModuleFactory(o, s),
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(hn);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((s) => i.bootstrap(s));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(i);
        else throw new $(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new $(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let r = this._injector.get(bp, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(Jt));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Cr = null,
  Bl = new oe("");
function RA(t) {
  if (Cr && !Cr.get(Bl, !1)) throw new $(400, !1);
  b0(), (Cr = t);
  let e = t.get(S0);
  return M0(t), e;
}
function Hl(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new oe(r);
  return (s = []) => {
    let o = I0();
    if (!o || o.injector.get(Bl, !1)) {
      let a = [...n, ...s, { provide: i, useValue: !0 }];
      t ? t(a) : RA(C0(a, r));
    }
    return OA(i);
  };
}
function C0(t = [], e) {
  return Jt.create({
    name: e,
    providers: [
      { provide: fl, useValue: "platform" },
      { provide: bp, useValue: new Set([() => (Cr = null)]) },
      ...t,
    ],
  });
}
function OA(t) {
  let e = I0();
  if (!e) throw new $(401, !1);
  return e;
}
function I0() {
  return Cr?.get(S0) ?? null;
}
function kA(t = []) {
  if (Cr) return Cr;
  let e = C0(t);
  return (Cr = e), b0(), M0(e), e;
}
function M0(t) {
  t.get(Co, null)?.forEach((n) => n());
}
var vs = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = LA;
  let t = e;
  return t;
})();
function LA(t) {
  return PA(vt(), De(), (t & 16) === 16);
}
function PA(t, e, n) {
  if (fs(t) && !n) {
    let r = Or(t.index, e);
    return new hi(r, r);
  } else if (t.type & 47) {
    let r = e[Nt];
    return new hi(r, e);
  }
  return null;
}
var oh = class {
    constructor() {}
    supports(e) {
      return Ub(e);
    }
    create(e) {
      return new ah(e);
    }
  },
  FA = (t, e) => e,
  ah = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || FA);
    }
    forEachItem(e) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) e(n);
    }
    forEachOperation(e) {
      let n = this._itHead,
        r = this._removalsHead,
        i = 0,
        s = null;
      for (; n || r; ) {
        let o = !r || (n && n.currentIndex < hv(r, i, s)) ? n : r,
          a = hv(o, i, s),
          c = o.currentIndex;
        if (o === r) i--, (r = r._nextRemoved);
        else if (((n = n._next), o.previousIndex == null)) i++;
        else {
          s || (s = []);
          let l = a - i,
            u = c - i;
          if (l != u) {
            for (let m = 0; m < l; m++) {
              let E = m < s.length ? s[m] : (s[m] = 0),
                C = E + m;
              u <= C && C < l && (s[m] = E + 1);
            }
            let d = o.previousIndex;
            s[d] = u - l;
          }
        }
        a !== c && e(o, a, c);
      }
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachMovedItem(e) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    forEachIdentityChange(e) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        e(n);
    }
    diff(e) {
      if ((e == null && (e = []), !Ub(e))) throw new $(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._itHead,
        r = !1,
        i,
        s,
        o;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (s = e[a]),
            (o = this._trackByFn(a, s)),
            n === null || !Object.is(n.trackById, o)
              ? ((n = this._mismatch(n, s, o, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, s, o, a)),
                Object.is(n.item, s) || this._addIdentityChange(n, s)),
            (n = n._next);
      } else
        (i = 0),
          dN(e, (a) => {
            (o = this._trackByFn(i, a)),
              n === null || !Object.is(n.trackById, o)
                ? ((n = this._mismatch(n, a, o, i)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, o, i)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(n), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, n, r, i) {
      let s;
      return (
        e === null ? (s = this._itTail) : ((s = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        e !== null
          ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
            this._reinsertAfter(e, s, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, i)),
            e !== null
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, s, i))
              : (e = this._addAfter(new ch(n, r), s, i))),
        e
      );
    }
    _verifyReinsertion(e, n, r, i) {
      let s =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        s !== null
          ? (e = this._reinsertAfter(s, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let n = e._next;
        this._addToRemovals(this._unlink(e)), (e = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        s = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = s) : (i._nextRemoved = s),
        s === null ? (this._removalsTail = i) : (s._prevRemoved = i),
        this._insertAfter(e, n, r),
        this._addToMoves(e, r),
        e
      );
    }
    _moveAfter(e, n, r) {
      return (
        this._unlink(e), this._insertAfter(e, n, r), this._addToMoves(e, r), e
      );
    }
    _addAfter(e, n, r) {
      return (
        this._insertAfter(e, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, n, r) {
      let i = n === null ? this._itHead : n._next;
      return (
        (e._next = i),
        (e._prev = n),
        i === null ? (this._itTail = e) : (i._prev = e),
        n === null ? (this._itHead = e) : (n._next = e),
        this._linkedRecords === null && (this._linkedRecords = new ol()),
        this._linkedRecords.put(e),
        (e.currentIndex = r),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let n = e._prev,
        r = e._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        e
      );
    }
    _addToMoves(e, n) {
      return (
        e.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new ol()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, n) {
      return (
        (e.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  ch = class {
    constructor(e, n) {
      (this.item = e),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  lh = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, e))
          return r;
      return null;
    }
    remove(e) {
      let n = e._prevDup,
        r = e._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  ol = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let n = e.trackById,
        r = this.map.get(n);
      r || ((r = new lh()), this.map.set(n, r)), r.add(e);
    }
    get(e, n) {
      let r = e,
        i = this.map.get(r);
      return i ? i.get(e, n) : null;
    }
    remove(e) {
      let n = e.trackById;
      return this.map.get(n).remove(e) && this.map.delete(n), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function hv(t, e, n) {
  let r = t.previousIndex;
  if (r === null) return r;
  let i = 0;
  return n && r < n.length && (i = n[r]), r + e + i;
}
var uh = class {
    constructor() {}
    supports(e) {
      return e instanceof Map || pp(e);
    }
    create() {
      return new dh();
    }
  },
  dh = class {
    constructor() {
      (this._records = new Map()),
        (this._mapHead = null),
        (this._appendAfter = null),
        (this._previousMapHead = null),
        (this._changesHead = null),
        (this._changesTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(e) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) e(n);
    }
    forEachPreviousItem(e) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) e(n);
    }
    forEachChangedItem(e) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) e(n);
    }
    forEachAddedItem(e) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n);
    }
    forEachRemovedItem(e) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n);
    }
    diff(e) {
      if (!e) e = new Map();
      else if (!(e instanceof Map || pp(e))) throw new $(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(e, (r, i) => {
          if (n && n.key === i)
            this._maybeAddToChanges(n, r),
              (this._appendAfter = n),
              (n = n._next);
          else {
            let s = this._getOrCreateRecordForKey(i, r);
            n = this._insertBeforeOrAppend(n, s);
          }
        }),
        n)
      ) {
        n._prev && (n._prev._next = null), (this._removalsHead = n);
        for (let r = n; r !== null; r = r._nextRemoved)
          r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(e, n) {
      if (e) {
        let r = e._prev;
        return (
          (n._next = e),
          (n._prev = r),
          (e._prev = n),
          r && (r._next = n),
          e === this._mapHead && (this._mapHead = n),
          (this._appendAfter = e),
          e
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(e, n) {
      if (this._records.has(e)) {
        let i = this._records.get(e);
        this._maybeAddToChanges(i, n);
        let s = i._prev,
          o = i._next;
        return (
          s && (s._next = o),
          o && (o._prev = s),
          (i._next = null),
          (i._prev = null),
          i
        );
      }
      let r = new fh(e);
      return (
        this._records.set(e, r),
        (r.currentValue = n),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (
          this._previousMapHead = this._mapHead, e = this._previousMapHead;
          e !== null;
          e = e._next
        )
          e._nextPrevious = e._next;
        for (e = this._changesHead; e !== null; e = e._nextChanged)
          e.previousValue = e.currentValue;
        for (e = this._additionsHead; e != null; e = e._nextAdded)
          e.previousValue = e.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(e, n) {
      Object.is(n, e.currentValue) ||
        ((e.previousValue = e.currentValue),
        (e.currentValue = n),
        this._addToChanges(e));
    }
    _addToAdditions(e) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = e)
        : ((this._additionsTail._nextAdded = e), (this._additionsTail = e));
    }
    _addToChanges(e) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = e)
        : ((this._changesTail._nextChanged = e), (this._changesTail = e));
    }
    _forEach(e, n) {
      e instanceof Map
        ? e.forEach(n)
        : Object.keys(e).forEach((r) => n(e[r], r));
    }
  },
  fh = class {
    constructor(e) {
      (this.key = e),
        (this.previousValue = null),
        (this.currentValue = null),
        (this._nextPrevious = null),
        (this._next = null),
        (this._prev = null),
        (this._nextAdded = null),
        (this._nextRemoved = null),
        (this._nextChanged = null);
    }
  };
function pv() {
  return new wp([new oh()]);
}
var wp = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i != null) {
        let s = i.factories.slice();
        r = r.concat(s);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || pv()),
        deps: [[e, new yh(), new us()]],
      };
    }
    find(r) {
      let i = this.factories.find((s) => s.supports(r));
      if (i != null) return i;
      throw new $(901, !1);
    }
  };
  e.ɵprov = Z({ token: e, providedIn: "root", factory: pv });
  let t = e;
  return t;
})();
function mv() {
  return new Dp([new uh()]);
}
var Dp = (() => {
  let e = class e {
    constructor(r) {
      this.factories = r;
    }
    static create(r, i) {
      if (i) {
        let s = i.factories.slice();
        r = r.concat(s);
      }
      return new e(r);
    }
    static extend(r) {
      return {
        provide: e,
        useFactory: (i) => e.create(r, i || mv()),
        deps: [[e, new yh(), new us()]],
      };
    }
    find(r) {
      let i = this.factories.find((s) => s.supports(r));
      if (i) return i;
      throw new $(901, !1);
    }
  };
  e.ɵprov = Z({ token: e, providedIn: "root", factory: mv });
  let t = e;
  return t;
})();
var _p = Hl(null, "core", []);
function N0(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = kA(r),
      s = [NA(), ...(n || [])],
      a = new rl({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get($e);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let l = a.get(fn, null),
        u;
      c.runOutsideAngular(() => {
        u = c.onError.subscribe({
          next: (E) => {
            l.handleError(E);
          },
        });
      });
      let d = () => a.destroy(),
        m = i.get(bp);
      return (
        m.add(d),
        a.onDestroy(() => {
          u.unsubscribe(), m.delete(d);
        }),
        w0(l, c, () => {
          let E = a.get(vp);
          return (
            E.runInitializers(),
            E.donePromise.then(() => {
              let C = a.get(jl, ls);
              a0(C || ls);
              let M = a.get(hn);
              return e !== void 0 && M.bootstrap(e), M;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
var gv = !1,
  A0 = !1;
function jA() {
  gv || ((gv = !0), lI(), zN(), uA(), KN(), gN(), HM(), mM(), l1(), tA());
}
function BA(t, e) {
  return Ao(t);
}
function x0() {
  return Tn([
    {
      provide: Zi,
      useFactory: () => {
        let t = !0;
        return (
          _c() && (t = !!G(Cn, { optional: !0 })?.get(zh, null)),
          t && Mn("NgHydration"),
          t
        );
      },
    },
    {
      provide: ci,
      useValue: () => {
        (A0 = !!G(hI, { optional: !0 })), _c() && G(Zi) && (UA(), jA());
      },
      multi: !0,
    },
    { provide: FE, useFactory: () => _c() && G(Zi) },
    {
      provide: ys,
      useFactory: () => {
        if (_c() && G(Zi)) {
          let t = G(hn),
            e = G(Jt);
          return () => {
            BA(t, e).then(() => {
              rM(t);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function HA() {
  return A0;
}
function UA() {
  let t = vl(),
    e;
  for (let n of t.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === Gh) {
      e = n;
      break;
    }
  if (!e) throw new $(-507, !1);
}
var hh = class {
    constructor() {
      (this.views = []), (this.indexByContent = new Map());
    }
    add(e) {
      let n = JSON.stringify(e);
      if (!this.indexByContent.has(n)) {
        let r = this.views.length;
        return this.views.push(e), this.indexByContent.set(n, r), r;
      }
      return this.indexByContent.get(n);
    }
    getAll() {
      return this.views;
    }
  },
  VA = 0;
function R0(t) {
  return t.ssrId || (t.ssrId = `t${VA++}`), t.ssrId;
}
function O0(t, e, n) {
  let r = [];
  return po(t, e, n, r), r.length;
}
function qA(t) {
  let e = [];
  return Db(t, e), e.length;
}
function k0(t, e) {
  let n = t[st];
  return n && !n.hasAttribute(co) ? cl(n, t, e) : null;
}
function L0(t, e) {
  let n = Ih(t[st]),
    r = k0(n, e),
    i = ct(n[st]),
    s = t[lt],
    o = cl(i, s, e),
    a = n[He],
    c = `${r}|${o}`;
  a.setAttribute(i, Xs, c);
}
function P0(t, e) {
  let n = new hh(),
    r = new Map(),
    i = t._views;
  for (let a of i) {
    let c = kE(a);
    if (c !== null) {
      let l = { serializedViewCollection: n, corruptedTextNodes: r };
      Ut(c) ? L0(c, l) : k0(c, l), WA(r, e);
    }
  }
  let s = n.getAll();
  t.injector.get(Cn).set(zh, s);
}
function $A(t, e) {
  let n = [],
    r = "";
  for (let i = dt; i < t.length; i++) {
    let s = t[i],
      o,
      a,
      c;
    if (Ch(s) && ((s = s[We]), Ut(s))) {
      (a = qA(s) + 1), L0(s, e);
      let u = Ih(s[st]);
      c = { [yf]: u[fe].ssrId, [as]: a };
    }
    if (!c) {
      let u = s[fe];
      u.type === 1
        ? ((o = u.ssrId), (a = 1))
        : ((o = R0(u)), (a = O0(u, s, u.firstChild))),
        (c = ee({ [yf]: o, [as]: a }, F0(t[i], e)));
    }
    let l = JSON.stringify(c);
    if (n.length > 0 && l === r) {
      let u = n[n.length - 1];
      (u[Gc] ??= 1), u[Gc]++;
    } else (r = l), n.push(c);
  }
  return n;
}
function al(t, e, n) {
  let r = e.index - We;
  (t[vf] ??= {}), (t[vf][r] = fM(e, n));
}
function yv(t, e) {
  let n = e.index - We;
  (t[Oc] ??= []), t[Oc].includes(n) || t[Oc].push(n);
}
function F0(t, e) {
  let n = {},
    r = t[fe];
  for (let i = We; i < r.bindingStartIndex; i++) {
    let s = r.data[i],
      o = i - We;
    if (PC(s)) {
      if (mo(s, t) && QA(s)) {
        yv(n, s);
        continue;
      }
      if (Array.isArray(s.projection)) {
        for (let a of s.projection)
          if (a)
            if (!Array.isArray(a))
              !iC(a) && !zc(a) && (mo(a, t) ? yv(n, a) : al(n, a, t));
            else throw G1(ct(t[i]));
      }
      if ((zA(n, s, t), Ut(t[i]))) {
        let a = s.tView;
        a !== null && ((n[gf] ??= {}), (n[gf][o] = R0(a)));
        let c = t[i][st];
        if (Array.isArray(c)) {
          let l = ct(c);
          l.hasAttribute(co) || cl(l, c, e);
        }
        (n[uo] ??= {}), (n[uo][o] = $A(t[i], e));
      } else if (Array.isArray(t[i])) {
        let a = ct(t[i][st]);
        a.hasAttribute(co) || cl(a, t[i], e);
      } else if (s.type & 8) (n[mf] ??= {}), (n[mf][o] = O0(r, t, s.child));
      else if (s.type & 16) {
        let a = s.next;
        for (; a !== null && a.type & 16; ) a = a.next;
        a && !zc(a) && al(n, a, t);
      } else if (s.type & 1) {
        let a = ct(t[i]);
        a.textContent === ""
          ? e.corruptedTextNodes.set(a, "ngetn")
          : a.nextSibling?.nodeType === Node.TEXT_NODE &&
            e.corruptedTextNodes.set(a, "ngtns");
      }
    }
  }
  return n;
}
function zA(t, e, n) {
  e.projectionNext &&
    e.projectionNext !== e.next &&
    !zc(e.projectionNext) &&
    al(t, e.projectionNext, n),
    e.prev === null &&
      e.parent !== null &&
      mo(e.parent, n) &&
      !mo(e, n) &&
      al(t, e, n);
}
function GA(t) {
  let e = t[pt];
  return e?.constructor
    ? Ir(e.constructor)?.encapsulation === un.ShadowDom
    : !1;
}
function cl(t, e, n) {
  let r = e[He];
  if ((sC(e) && !HA()) || GA(e)) return r.setAttribute(t, co, ""), null;
  {
    let i = F0(e, n),
      s = n.serializedViewCollection.add(i);
    return r.setAttribute(t, Xs, s.toString()), s;
  }
}
function WA(t, e) {
  for (let [n, r] of t) n.after(e.createComment(r));
}
function QA(t) {
  let e = t;
  for (; e != null; ) {
    if (fs(e)) return !0;
    e = e.parent;
  }
  return !1;
}
function j0(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function KA(t, e = NaN) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t)) ? Number(t) : e;
}
var YA = new oe("", { providedIn: "root", factory: () => G(ZA) }),
  ZA = (() => {
    let e = class e {};
    e.ɵprov = Z({ token: e, providedIn: "root", factory: () => new ph() });
    let t = e;
    return t;
  })(),
  ph = class {
    constructor() {
      (this.queuedEffectCount = 0),
        (this.queues = new Map()),
        (this.pendingTasks = G(kr)),
        (this.taskId = null);
    }
    scheduleEffect(e) {
      if ((this.enqueue(e), this.taskId === null)) {
        let n = (this.taskId = this.pendingTasks.add());
        queueMicrotask(() => {
          this.flush(), this.pendingTasks.remove(n), (this.taskId = null);
        });
      }
    }
    enqueue(e) {
      let n = e.creationZone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(e) || (this.queuedEffectCount++, r.add(e));
    }
    flush() {
      for (; this.queuedEffectCount > 0; )
        for (let [e, n] of this.queues)
          e === null ? this.flushQueue(n) : e.run(() => this.flushQueue(n));
    }
    flushQueue(e) {
      for (let n of e) e.delete(n), this.queuedEffectCount--, n.run();
    }
  },
  mh = class {
    constructor(e, n, r, i, s, o) {
      (this.scheduler = e),
        (this.effectFn = n),
        (this.creationZone = r),
        (this.injector = s),
        (this.watcher = Yg(
          (a) => this.runEffect(a),
          () => this.schedule(),
          o,
        )),
        (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()));
    }
    runEffect(e) {
      try {
        this.effectFn(e);
      } catch (n) {
        this.injector.get(fn, null, { optional: !0 })?.handleError(n);
      }
    }
    run() {
      this.watcher.run();
    }
    schedule() {
      this.scheduler.scheduleEffect(this);
    }
    destroy() {
      this.watcher.destroy(), this.unregisterOnDestroy?.();
    }
  };
function XA(t, e) {
  Mn("NgSignals"), !e?.injector && tC(XA);
  let n = e?.injector ?? G(Jt),
    r = e?.manualCleanup !== !0 ? n.get(Hh) : null,
    i = new mh(
      n.get(YA),
      t,
      typeof Zone > "u" ? null : Zone.current,
      r,
      n,
      e?.allowSignalWrites ?? !1,
    ),
    s = n.get(vs, null, { optional: !0 });
  return (
    !s || !(s._lView[de] & 8)
      ? i.watcher.notify()
      : (s._lView[Nc] ??= []).push(i.watcher.notify),
    i
  );
}
function g3(...t) {
  return t.reduce(
    (e, n) =>
      Object.assign(e, n, { providers: [...e.providers, ...n.providers] }),
    { providers: [] },
  );
}
var $0 = null;
function Nn() {
  return $0;
}
function Vl(t) {
  $0 ??= t;
}
var Ul = class {};
var ze = new oe(""),
  Ro = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(JA), providedIn: "platform" }));
    let t = e;
    return t;
  })();
var JA = (() => {
  let e = class e extends Ro {
    constructor() {
      super(),
        (this._doc = G(ze)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Nn().getBaseHref(this._doc);
    }
    onPopState(r) {
      let i = Nn().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", r, !1),
        () => i.removeEventListener("popstate", r)
      );
    }
    onHashChange(r) {
      let i = Nn().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", r, !1),
        () => i.removeEventListener("hashchange", r)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(r) {
      this._location.pathname = r;
    }
    pushState(r, i, s) {
      this._history.pushState(r, i, s);
    }
    replaceState(r, i, s) {
      this._history.replaceState(r, i, s);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(r = 0) {
      this._history.go(r);
    }
    getState() {
      return this._history.state;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: () => new e(), providedIn: "platform" }));
  let t = e;
  return t;
})();
function z0(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function B0(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function Di(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var ql = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(G0), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ex = new oe(""),
  G0 = (() => {
    let e = class e extends ql {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            G(ze).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return z0(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + Di(this._platformLocation.search),
          s = this._platformLocation.hash;
        return s && r ? `${i}${s}` : i;
      }
      pushState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + Di(o));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, s, o) {
        let a = this.prepareExternalUrl(s + Di(o));
        this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(Ro), ie(ex, 8));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var Oo = (() => {
  let e = class e {
    constructor(r) {
      (this._subject = new yt()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = rx(B0(H0(i)))),
        this._locationStrategy.onPopState((s) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: s.state,
            type: s.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(r = !1) {
      return this.normalize(this._locationStrategy.path(r));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(r, i = "") {
      return this.path() == this.normalize(r + Di(i));
    }
    normalize(r) {
      return e.stripTrailingSlash(nx(this._basePath, H0(r)));
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== "/" && (r = "/" + r),
        this._locationStrategy.prepareExternalUrl(r)
      );
    }
    go(r, i = "", s = null) {
      this._locationStrategy.pushState(s, "", r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Di(i)), s);
    }
    replaceState(r, i = "", s = null) {
      this._locationStrategy.replaceState(s, "", r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Di(i)), s);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(r = 0) {
      this._locationStrategy.historyGo?.(r);
    }
    onUrlChange(r) {
      return (
        this._urlChangeListeners.push(r),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(r);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(r = "", i) {
      this._urlChangeListeners.forEach((s) => s(r, i));
    }
    subscribe(r, i, s) {
      return this._subject.subscribe({ next: r, error: i, complete: s });
    }
  };
  (e.normalizeQueryParams = Di),
    (e.joinWithSlash = z0),
    (e.stripTrailingSlash = B0),
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ql));
    }),
    (e.ɵprov = Z({ token: e, factory: () => tx(), providedIn: "root" }));
  let t = e;
  return t;
})();
function tx() {
  return new Oo(ie(ql));
}
function nx(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function H0(t) {
  return t.replace(/\/index.html$/, "");
}
function rx(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function $l(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, s] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(s);
  }
  return null;
}
var Tp = /\s+/,
  U0 = [],
  B3 = (() => {
    let e = class e {
      constructor(r, i) {
        (this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = U0),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Tp) : U0;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(Tp) : r;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let r = this.rawClass;
        if (Array.isArray(r) || r instanceof Set)
          for (let i of r) this._updateState(i, !0);
        else if (r != null)
          for (let i of Object.keys(r)) this._updateState(i, !!r[i]);
        this._applyStateDiff();
      }
      _updateState(r, i) {
        let s = this.stateMap.get(r);
        s !== void 0
          ? (s.enabled !== i && ((s.changed = !0), (s.enabled = i)),
            (s.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            s = r[1];
          s.changed
            ? (this._toggleClass(i, s.enabled), (s.changed = !1))
            : s.touched ||
              (s.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (s.touched = !1);
        }
      }
      _toggleClass(r, i) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(Tp).forEach((s) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, s)
                : this._renderer.removeClass(this._ngEl.nativeElement, s);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Et(Xn), Et(bi));
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [zn.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Sp = class {
    constructor(e, n, r, i) {
      (this.$implicit = e),
        (this.ngForOf = n),
        (this.index = r),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  H3 = (() => {
    let e = class e {
      set ngForOf(r) {
        (this._ngForOf = r), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(r) {
        this._trackByFn = r;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(r, i, s) {
        (this._viewContainer = r),
          (this._template = i),
          (this._differs = s),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(r) {
        r && (this._template = r);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let r = this._ngForOf;
          if (!this._differ && r)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(r).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let r = this._differ.diff(this._ngForOf);
          r && this._applyChanges(r);
        }
      }
      _applyChanges(r) {
        let i = this._viewContainer;
        r.forEachOperation((s, o, a) => {
          if (s.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Sp(s.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a,
            );
          else if (a == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let c = i.get(o);
            i.move(c, a), V0(c, s);
          }
        });
        for (let s = 0, o = i.length; s < o; s++) {
          let c = i.get(s).context;
          (c.index = s), (c.count = o), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((s) => {
          let o = i.get(s.currentIndex);
          V0(o, s);
        });
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Et(tr), Et(pi), Et(wp));
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function V0(t, e) {
  t.context.$implicit = e.item;
}
var U3 = (() => {
    let e = class e {
      constructor(r, i) {
        (this._viewContainer = r),
          (this._context = new Cp()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(r) {
        (this._context.$implicit = this._context.ngIf = r), this._updateView();
      }
      set ngIfThen(r) {
        q0("ngIfThen", r),
          (this._thenTemplateRef = r),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(r) {
        q0("ngIfElse", r),
          (this._elseTemplateRef = r),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngTemplateContextGuard(r, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Et(tr), Et(pi));
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Cp = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function q0(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${Mt(e)}'.`);
}
var V3 = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this._ngEl = r),
          (this._differs = i),
          (this._renderer = s),
          (this._ngStyle = null),
          (this._differ = null);
      }
      set ngStyle(r) {
        (this._ngStyle = r),
          !this._differ && r && (this._differ = this._differs.find(r).create());
      }
      ngDoCheck() {
        if (this._differ) {
          let r = this._differ.diff(this._ngStyle);
          r && this._applyChanges(r);
        }
      }
      _setStyle(r, i) {
        let [s, o] = r.split("."),
          a = s.indexOf("-") === -1 ? void 0 : _n.DashCase;
        i != null
          ? this._renderer.setStyle(
              this._ngEl.nativeElement,
              s,
              o ? `${i}${o}` : i,
              a,
            )
          : this._renderer.removeStyle(this._ngEl.nativeElement, s, a);
      }
      _applyChanges(r) {
        r.forEachRemovedItem((i) => this._setStyle(i.key, null)),
          r.forEachAddedItem((i) => this._setStyle(i.key, i.currentValue)),
          r.forEachChangedItem((i) => this._setStyle(i.key, i.currentValue));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Et(Xn), Et(Dp), Et(bi));
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["", "ngStyle", ""]],
        inputs: { ngStyle: "ngStyle" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  q3 = (() => {
    let e = class e {
      constructor(r) {
        (this._viewContainerRef = r),
          (this._viewRef = null),
          (this.ngTemplateOutletContext = null),
          (this.ngTemplateOutlet = null),
          (this.ngTemplateOutletInjector = null);
      }
      ngOnChanges(r) {
        if (this._shouldRecreateView(r)) {
          let i = this._viewContainerRef;
          if (
            (this._viewRef && i.remove(i.indexOf(this._viewRef)),
            !this.ngTemplateOutlet)
          ) {
            this._viewRef = null;
            return;
          }
          let s = this._createContextForwardProxy();
          this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, s, {
            injector: this.ngTemplateOutletInjector ?? void 0,
          });
        }
      }
      _shouldRecreateView(r) {
        return !!r.ngTemplateOutlet || !!r.ngTemplateOutletInjector;
      }
      _createContextForwardProxy() {
        return new Proxy(
          {},
          {
            set: (r, i, s) =>
              this.ngTemplateOutletContext
                ? Reflect.set(this.ngTemplateOutletContext, i, s)
                : !1,
            get: (r, i, s) => {
              if (this.ngTemplateOutletContext)
                return Reflect.get(this.ngTemplateOutletContext, i, s);
            },
          },
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(Et(tr));
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["", "ngTemplateOutlet", ""]],
        inputs: {
          ngTemplateOutletContext: "ngTemplateOutletContext",
          ngTemplateOutlet: "ngTemplateOutlet",
          ngTemplateOutletInjector: "ngTemplateOutletInjector",
        },
        standalone: !0,
        features: [To],
      }));
    let t = e;
    return t;
  })();
var ix = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = xr({ type: e })),
      (e.ɵinj = Ar({}));
    let t = e;
    return t;
  })(),
  Np = "browser",
  Ap = "server";
function sx(t) {
  return t === Np;
}
function ko(t) {
  return t === Ap;
}
var xp = (() => {
    let e = class e {};
    e.ɵprov = Z({
      token: e,
      providedIn: "root",
      factory: () => (sx(G(Lt)) ? new Ip(G(ze), window) : new xo()),
    });
    let t = e;
    return t;
  })(),
  Ip = class {
    constructor(e, n) {
      (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let n = ox(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        s = this.offset();
      this.window.scrollTo(r - s[0], i - s[1]);
    }
  };
function ox(t, e) {
  let n = t.getElementById(e) || t.getElementsByName(e)[0];
  if (n) return n;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let s = i.shadowRoot;
      if (s) {
        let o = s.getElementById(e) || s.querySelector(`[name="${e}"]`);
        if (o) return o;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var xo = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Lr = class {};
var Po = class {},
  Wl = class {},
  Fr = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`,
                    )
                    .forEach((n) => {
                      let r = n.indexOf(":");
                      if (r > 0) {
                        let i = n.slice(0, r),
                          s = i.toLowerCase(),
                          o = n.slice(r + 1).trim();
                        this.maybeSetNormalizedName(i, s),
                          this.headers.has(s)
                            ? this.headers.get(s).push(o)
                            : this.headers.set(s, [o]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
              ? ((this.headers = new Map()),
                e.forEach((n, r) => {
                  this.setHeaderEntries(r, n);
                }))
              : (this.lazyInit = () => {
                  (this.headers = new Map()),
                    Object.entries(e).forEach(([n, r]) => {
                      this.setHeaderEntries(n, r);
                    });
                })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let n = this.headers.get(e.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, n) {
      return this.clone({ name: e, value: n, op: "a" });
    }
    set(e, n) {
      return this.clone({ name: e, value: n, op: "s" });
    }
    delete(e, n) {
      return this.clone({ name: e, value: n, op: "d" });
    }
    maybeSetNormalizedName(e, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((n) => {
          this.headers.set(n, e.headers.get(n)),
            this.normalizedNames.set(n, e.normalizedNames.get(n));
        });
    }
    clone(e) {
      let n = new t();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        n
      );
    }
    applyUpdate(e) {
      let n = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let r = e.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(e.name, n);
          let i = (e.op === "a" ? this.headers.get(n) : void 0) || [];
          i.push(...r), this.headers.set(n, i);
          break;
        case "d":
          let s = e.value;
          if (!s) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let o = this.headers.get(n);
            if (!o) return;
            (o = o.filter((a) => s.indexOf(a) === -1)),
              o.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, o);
          }
          break;
      }
    }
    setHeaderEntries(e, n) {
      let r = (Array.isArray(n) ? n : [n]).map((s) => s.toString()),
        i = e.toLowerCase();
      this.headers.set(i, r), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          e(this.normalizedNames.get(n), this.headers.get(n)),
        );
    }
  };
var Op = class {
  encodeKey(e) {
    return W0(e);
  }
  encodeValue(e) {
    return W0(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function lx(t, e) {
  let n = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let s = i.indexOf("="),
            [o, a] =
              s == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, s)), e.decodeValue(i.slice(s + 1))],
            c = n.get(o) || [];
          c.push(a), n.set(o, c);
        }),
    n
  );
}
var ux = /%(\d[a-f0-9])/gi,
  dx = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function W0(t) {
  return encodeURIComponent(t).replace(ux, (e, n) => dx[n] ?? e);
}
function zl(t) {
  return `${t}`;
}
var Pr = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new Op()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = lx(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((n) => {
            let r = e.fromObject[n],
              i = Array.isArray(r) ? r.map(zl) : [zl(r)];
            this.map.set(n, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let n = this.map.get(e);
    return n ? n[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, n) {
    return this.clone({ param: e, value: n, op: "a" });
  }
  appendAll(e) {
    let n = [];
    return (
      Object.keys(e).forEach((r) => {
        let i = e[r];
        Array.isArray(i)
          ? i.forEach((s) => {
              n.push({ param: r, value: s, op: "a" });
            })
          : n.push({ param: r, value: i, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(e, n) {
    return this.clone({ param: e, value: n, op: "s" });
  }
  delete(e, n) {
    return this.clone({ param: e, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let n = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let n = new t({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(e)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let n = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              n.push(zl(e.value)), this.map.set(e.param, n);
              break;
            case "d":
              if (e.value !== void 0) {
                let r = this.map.get(e.param) || [],
                  i = r.indexOf(zl(e.value));
                i !== -1 && r.splice(i, 1),
                  r.length > 0
                    ? this.map.set(e.param, r)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var kp = class {
  constructor() {
    this.map = new Map();
  }
  set(e, n) {
    return this.map.set(e, n), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function fx(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Q0(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function K0(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function Y0(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function hx(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var Lo = class t {
    constructor(e, n, r, i) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let s;
      if (
        (fx(this.method) || i
          ? ((this.body = r !== void 0 ? r : null), (s = i))
          : (s = r),
        s &&
          ((this.reportProgress = !!s.reportProgress),
          (this.withCredentials = !!s.withCredentials),
          s.responseType && (this.responseType = s.responseType),
          s.headers && (this.headers = s.headers),
          s.context && (this.context = s.context),
          s.params && (this.params = s.params),
          (this.transferCache = s.transferCache)),
        (this.headers ??= new Fr()),
        (this.context ??= new kp()),
        !this.params)
      )
        (this.params = new Pr()), (this.urlWithParams = n);
      else {
        let o = this.params.toString();
        if (o.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + o;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
            Q0(this.body) ||
            K0(this.body) ||
            Y0(this.body) ||
            hx(this.body)
          ? this.body
          : this.body instanceof Pr
            ? this.body.toString()
            : typeof this.body == "object" ||
                typeof this.body == "boolean" ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || Y0(this.body)
        ? null
        : K0(this.body)
          ? this.body.type || null
          : Q0(this.body)
            ? null
            : typeof this.body == "string"
              ? "text/plain"
              : this.body instanceof Pr
                ? "application/x-www-form-urlencoded;charset=UTF-8"
                : typeof this.body == "object" ||
                    typeof this.body == "number" ||
                    typeof this.body == "boolean"
                  ? "application/json"
                  : null;
    }
    clone(e = {}) {
      let n = e.method || this.method,
        r = e.url || this.url,
        i = e.responseType || this.responseType,
        s = e.transferCache ?? this.transferCache,
        o = e.body !== void 0 ? e.body : this.body,
        a = e.withCredentials ?? this.withCredentials,
        c = e.reportProgress ?? this.reportProgress,
        l = e.headers || this.headers,
        u = e.params || this.params,
        d = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (l = Object.keys(e.setHeaders).reduce(
            (m, E) => m.set(E, e.setHeaders[E]),
            l,
          )),
        e.setParams &&
          (u = Object.keys(e.setParams).reduce(
            (m, E) => m.set(E, e.setParams[E]),
            u,
          )),
        new t(n, r, o, {
          params: u,
          headers: l,
          context: d,
          reportProgress: c,
          responseType: i,
          withCredentials: a,
          transferCache: s,
        })
      );
    }
  },
  Es = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Es || {}),
  Fo = class {
    constructor(e, n = Kl.Ok, r = "OK") {
      (this.headers = e.headers || new Fr()),
        (this.status = e.status !== void 0 ? e.status : n),
        (this.statusText = e.statusText || r),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Lp = class t extends Fo {
    constructor(e = {}) {
      super(e), (this.type = Es.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  bs = class t extends Fo {
    constructor(e = {}) {
      super(e),
        (this.type = Es.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Ql = class extends Fo {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${e.url || "(unknown url)"}`)
          : (this.message = `Http failure response for ${e.url || "(unknown url)"}: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  Kl = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (t[(t.NoContent = 204)] = "NoContent"),
      (t[(t.ResetContent = 205)] = "ResetContent"),
      (t[(t.PartialContent = 206)] = "PartialContent"),
      (t[(t.MultiStatus = 207)] = "MultiStatus"),
      (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
      (t[(t.ImUsed = 226)] = "ImUsed"),
      (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
      (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
      (t[(t.Found = 302)] = "Found"),
      (t[(t.SeeOther = 303)] = "SeeOther"),
      (t[(t.NotModified = 304)] = "NotModified"),
      (t[(t.UseProxy = 305)] = "UseProxy"),
      (t[(t.Unused = 306)] = "Unused"),
      (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
      (t[(t.BadRequest = 400)] = "BadRequest"),
      (t[(t.Unauthorized = 401)] = "Unauthorized"),
      (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
      (t[(t.Forbidden = 403)] = "Forbidden"),
      (t[(t.NotFound = 404)] = "NotFound"),
      (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
      (t[(t.Conflict = 409)] = "Conflict"),
      (t[(t.Gone = 410)] = "Gone"),
      (t[(t.LengthRequired = 411)] = "LengthRequired"),
      (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
      (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (t[(t.UriTooLong = 414)] = "UriTooLong"),
      (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
      (t[(t.ImATeapot = 418)] = "ImATeapot"),
      (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (t[(t.Locked = 423)] = "Locked"),
      (t[(t.FailedDependency = 424)] = "FailedDependency"),
      (t[(t.TooEarly = 425)] = "TooEarly"),
      (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
      (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
      (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (t[(t.InternalServerError = 500)] = "InternalServerError"),
      (t[(t.NotImplemented = 501)] = "NotImplemented"),
      (t[(t.BadGateway = 502)] = "BadGateway"),
      (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
      (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
      (t[(t.LoopDetected = 508)] = "LoopDetected"),
      (t[(t.NotExtended = 510)] = "NotExtended"),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      t
    );
  })(Kl || {});
function Rp(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var px = (() => {
  let e = class e {
    constructor(r) {
      this.handler = r;
    }
    request(r, i, s = {}) {
      let o;
      if (r instanceof Lo) o = r;
      else {
        let l;
        s.headers instanceof Fr ? (l = s.headers) : (l = new Fr(s.headers));
        let u;
        s.params &&
          (s.params instanceof Pr
            ? (u = s.params)
            : (u = new Pr({ fromObject: s.params }))),
          (o = new Lo(r, i, s.body !== void 0 ? s.body : null, {
            headers: l,
            context: s.context,
            params: u,
            reportProgress: s.reportProgress,
            responseType: s.responseType || "json",
            withCredentials: s.withCredentials,
            transferCache: s.transferCache,
          }));
      }
      let a = he(o).pipe(br((l) => this.handler.handle(l)));
      if (r instanceof Lo || s.observe === "events") return a;
      let c = a.pipe(St((l) => l instanceof bs));
      switch (s.observe || "body") {
        case "body":
          switch (o.responseType) {
            case "arraybuffer":
              return c.pipe(
                Te((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return l.body;
                }),
              );
            case "blob":
              return c.pipe(
                Te((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return l.body;
                }),
              );
            case "text":
              return c.pipe(
                Te((l) => {
                  if (l.body !== null && typeof l.body != "string")
                    throw new Error("Response is not a string.");
                  return l.body;
                }),
              );
            case "json":
            default:
              return c.pipe(Te((l) => l.body));
          }
        case "response":
          return c;
        default:
          throw new Error(`Unreachable: unhandled observe type ${s.observe}}`);
      }
    }
    delete(r, i = {}) {
      return this.request("DELETE", r, i);
    }
    get(r, i = {}) {
      return this.request("GET", r, i);
    }
    head(r, i = {}) {
      return this.request("HEAD", r, i);
    }
    jsonp(r, i) {
      return this.request("JSONP", r, {
        params: new Pr().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(r, i = {}) {
      return this.request("OPTIONS", r, i);
    }
    patch(r, i, s = {}) {
      return this.request("PATCH", r, Rp(s, i));
    }
    post(r, i, s = {}) {
      return this.request("POST", r, Rp(s, i));
    }
    put(r, i, s = {}) {
      return this.request("PUT", r, Rp(s, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(ie(Po));
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function aw(t, e) {
  return e(t);
}
function mx(t, e) {
  return (n, r) => e.intercept(n, { handle: (i) => t(i, r) });
}
function gx(t, e, n) {
  return (r, i) => Yn(n, () => e(r, (s) => t(s, i)));
}
var yx = new oe(""),
  Pp = new oe(""),
  Zl = new oe(""),
  vx = new oe("");
function Ex() {
  let t = null;
  return (e, n) => {
    t === null && (t = (G(yx, { optional: !0 }) ?? []).reduceRight(mx, aw));
    let r = G(kr),
      i = r.add();
    return t(e, n).pipe(Dr(() => r.remove(i)));
  };
}
var Z0 = (() => {
  let e = class e extends Po {
    constructor(r, i) {
      super(),
        (this.backend = r),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = G(kr));
      let s = G(vx, { optional: !0 });
      this.backend = s ?? r;
    }
    handle(r) {
      if (this.chain === null) {
        let s = Array.from(
          new Set([...this.injector.get(Pp), ...this.injector.get(Zl, [])]),
        );
        this.chain = s.reduceRight((o, a) => gx(o, a, this.injector), aw);
      }
      let i = this.pendingTasks.add();
      return this.chain(r, (s) => this.backend.handle(s)).pipe(
        Dr(() => this.pendingTasks.remove(i)),
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(ie(Wl), ie(kt));
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var bx = /^\)\]\}',?\n/;
function wx(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
      ? t.getResponseHeader("X-Request-URL")
      : null;
}
var X0 = (() => {
    let e = class e {
      constructor(r) {
        this.xhrFactory = r;
      }
      handle(r) {
        if (r.method === "JSONP") throw new $(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? Ke(i.ɵloadImpl()) : he(null)).pipe(
          Ft(
            () =>
              new Ae((o) => {
                let a = i.build();
                if (
                  (a.open(r.method, r.urlWithParams),
                  r.withCredentials && (a.withCredentials = !0),
                  r.headers.forEach((P, A) =>
                    a.setRequestHeader(P, A.join(",")),
                  ),
                  r.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*",
                    ),
                  !r.headers.has("Content-Type"))
                ) {
                  let P = r.detectContentTypeHeader();
                  P !== null && a.setRequestHeader("Content-Type", P);
                }
                if (r.responseType) {
                  let P = r.responseType.toLowerCase();
                  a.responseType = P !== "json" ? P : "text";
                }
                let c = r.serializeBody(),
                  l = null,
                  u = () => {
                    if (l !== null) return l;
                    let P = a.statusText || "OK",
                      A = new Fr(a.getAllResponseHeaders()),
                      _ = wx(a) || r.url;
                    return (
                      (l = new Lp({
                        headers: A,
                        status: a.status,
                        statusText: P,
                        url: _,
                      })),
                      l
                    );
                  },
                  d = () => {
                    let { headers: P, status: A, statusText: _, url: w } = u(),
                      T = null;
                    A !== Kl.NoContent &&
                      (T =
                        typeof a.response > "u" ? a.responseText : a.response),
                      A === 0 && (A = T ? Kl.Ok : 0);
                    let b = A >= 200 && A < 300;
                    if (r.responseType === "json" && typeof T == "string") {
                      let J = T;
                      T = T.replace(bx, "");
                      try {
                        T = T !== "" ? JSON.parse(T) : null;
                      } catch (ne) {
                        (T = J), b && ((b = !1), (T = { error: ne, text: T }));
                      }
                    }
                    b
                      ? (o.next(
                          new bs({
                            body: T,
                            headers: P,
                            status: A,
                            statusText: _,
                            url: w || void 0,
                          }),
                        ),
                        o.complete())
                      : o.error(
                          new Ql({
                            error: T,
                            headers: P,
                            status: A,
                            statusText: _,
                            url: w || void 0,
                          }),
                        );
                  },
                  m = (P) => {
                    let { url: A } = u(),
                      _ = new Ql({
                        error: P,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: A || void 0,
                      });
                    o.error(_);
                  },
                  E = !1,
                  C = (P) => {
                    E || (o.next(u()), (E = !0));
                    let A = { type: Es.DownloadProgress, loaded: P.loaded };
                    P.lengthComputable && (A.total = P.total),
                      r.responseType === "text" &&
                        a.responseText &&
                        (A.partialText = a.responseText),
                      o.next(A);
                  },
                  M = (P) => {
                    let A = { type: Es.UploadProgress, loaded: P.loaded };
                    P.lengthComputable && (A.total = P.total), o.next(A);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", m),
                  a.addEventListener("timeout", m),
                  a.addEventListener("abort", m),
                  r.reportProgress &&
                    (a.addEventListener("progress", C),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", M)),
                  a.send(c),
                  o.next({ type: Es.Sent }),
                  () => {
                    a.removeEventListener("error", m),
                      a.removeEventListener("abort", m),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", m),
                      r.reportProgress &&
                        (a.removeEventListener("progress", C),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", M)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              }),
          ),
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(Lr));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  cw = new oe(""),
  Dx = "XSRF-TOKEN",
  _x = new oe("", { providedIn: "root", factory: () => Dx }),
  Tx = "X-XSRF-TOKEN",
  Sx = new oe("", { providedIn: "root", factory: () => Tx }),
  Yl = class {},
  Cx = (() => {
    let e = class e {
      constructor(r, i, s) {
        (this.doc = r),
          (this.platform = i),
          (this.cookieName = s),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let r = this.doc.cookie || "";
        return (
          r !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = $l(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze), ie(Lt), ie(_x));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Ix(t, e) {
  let n = t.url.toLowerCase();
  if (
    !G(cw) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return e(t);
  let r = G(Yl).getToken(),
    i = G(Sx);
  return (
    r != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, r) })),
    e(t)
  );
}
var lw = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(lw || {});
function Mx(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function Nx(...t) {
  let e = [
    px,
    X0,
    Z0,
    { provide: Po, useExisting: Z0 },
    { provide: Wl, useExisting: X0 },
    { provide: Pp, useValue: Ix, multi: !0 },
    { provide: cw, useValue: !0 },
    { provide: Yl, useClass: Cx },
  ];
  for (let n of t) e.push(...n.ɵproviders);
  return Tn(e);
}
var J0 = new oe("");
function Ax() {
  return Mx(lw.LegacyInterceptors, [
    { provide: J0, useFactory: Ex },
    { provide: Pp, useExisting: J0, multi: !0 },
  ]);
}
var xx = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = xr({ type: e })),
    (e.ɵinj = Ar({ providers: [Nx(Ax())] }));
  let t = e;
  return t;
})();
var ew = "b",
  tw = "h",
  nw = "s",
  rw = "st",
  iw = "u",
  sw = "rt",
  Gl = new oe(""),
  Rx = ["GET", "HEAD"];
function Ox(t, e) {
  let d = G(Gl),
    { isCacheActive: n } = d,
    r = Ua(d, ["isCacheActive"]),
    { transferCache: i, method: s } = t;
  if (
    !n ||
    (s === "POST" && !r.includePostRequests && !i) ||
    (s !== "POST" && !Rx.includes(s)) ||
    i === !1 ||
    r.filter?.(t) === !1
  )
    return e(t);
  let o = G(Cn),
    a = Lx(t),
    c = o.get(a, null),
    l = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (l = i.includeHeaders), c)) {
    let { [ew]: m, [sw]: E, [tw]: C, [nw]: M, [rw]: P, [iw]: A } = c,
      _ = m;
    switch (E) {
      case "arraybuffer":
        _ = new TextEncoder().encode(m).buffer;
        break;
      case "blob":
        _ = new Blob([m]);
        break;
    }
    let w = new Fr(C);
    return he(
      new bs({ body: _, headers: w, status: M, statusText: P, url: A }),
    );
  }
  let u = ko(G(Lt));
  return e(t).pipe(
    at((m) => {
      m instanceof bs &&
        u &&
        o.set(a, {
          [ew]: m.body,
          [tw]: kx(m.headers, l),
          [nw]: m.status,
          [rw]: m.statusText,
          [iw]: m.url || "",
          [sw]: t.responseType,
        });
    }),
  );
}
function kx(t, e) {
  if (!e) return {};
  let n = {};
  for (let r of e) {
    let i = t.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function ow(t) {
  return [...t.keys()]
    .sort()
    .map((e) => `${e}=${t.getAll(e)}`)
    .join("&");
}
function Lx(t) {
  let { params: e, method: n, responseType: r, url: i } = t,
    s = ow(e),
    o = t.serializeBody();
  o instanceof URLSearchParams ? (o = ow(o)) : typeof o != "string" && (o = "");
  let a = [n, r, i, o, s].join("|"),
    c = Px(a);
  return c;
}
function Px(t) {
  let e = 0;
  for (let n of t) e = (Math.imul(31, e) + n.charCodeAt(0)) << 0;
  return (e += 2147483648), e.toString();
}
function uw(t) {
  return [
    {
      provide: Gl,
      useFactory: () => (
        Mn("NgHttpTransferCache"), ee({ isCacheActive: !0 }, t)
      ),
    },
    { provide: Zl, useValue: Ox, multi: !0, deps: [Cn, Gl] },
    {
      provide: ys,
      multi: !0,
      useFactory: () => {
        let e = G(hn),
          n = G(Gl);
        return () => {
          Ao(e).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
var Bp = class extends Ul {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Bo = class t extends Bp {
    static makeCurrent() {
      Vl(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? window
        : n === "document"
          ? e
          : n === "body"
            ? e.body
            : null;
    }
    getBaseHref(e) {
      let n = Fx();
      return n == null ? null : jx(n);
    }
    resetBaseElement() {
      jo = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return $l(document.cookie, e);
    }
  },
  jo = null;
function Fx() {
  return (
    (jo = jo || document.querySelector("base")),
    jo ? jo.getAttribute("href") : null
  );
}
function jx(t) {
  return new URL(t, document.baseURI).pathname;
}
var Bx = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ho = new oe(""),
  hw = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((s) => {
            s.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, s) {
        return this._findPluginFor(i).addEventListener(r, i, s);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(r))), !i))
          throw new $(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(Ho), ie($e));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ws = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Fp = "ng-app-id",
  pw = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ko(o)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((s) => s.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Fp}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((s) => {
              s.textContent != null && i.set(s.textContent, s);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let s = this.styleRef;
        if (s.has(r)) {
          let o = s.get(r);
          return (o.usage += i), o.usage;
        }
        return s.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let s = this.styleNodesInDOM,
          o = s?.get(i);
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(Fp), o;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Fp, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let s = this.getStyleElement(r, i),
          o = this.styleRef,
          a = o.get(i)?.elements;
        a ? a.push(s) : o.set(i, { elements: [s], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze), ie(ms), ie(Vh, 8), ie(Lt));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  jp = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Vp = /%COMP%/g,
  mw = "%COMP%",
  Hx = `_nghost-${mw}`,
  Ux = `_ngcontent-${mw}`,
  Vx = !0,
  qx = new oe("", { providedIn: "root", factory: () => Vx });
function $x(t) {
  return Ux.replace(Vp, t);
}
function zx(t) {
  return Hx.replace(Vp, t);
}
function gw(t, e) {
  return e.map((n) => n.replace(Vp, t));
}
var Xl = (() => {
    let e = class e {
      constructor(r, i, s, o, a, c, l, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = s),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ko(c)),
          (this.defaultRenderer = new Uo(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === un.ShadowDom &&
          (i = nt(ee({}, i), { encapsulation: un.Emulated }));
        let s = this.getOrCreateRenderer(r, i);
        return (
          s instanceof Jl
            ? s.applyToHost(r)
            : s instanceof Vo && s.applyStyles(),
          s
        );
      }
      getOrCreateRenderer(r, i) {
        let s = this.rendererByCompId,
          o = s.get(i.id);
        if (!o) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            m = this.platformIsServer;
          switch (i.encapsulation) {
            case un.Emulated:
              o = new Jl(l, u, i, this.appId, d, a, c, m);
              break;
            case un.ShadowDom:
              return new Hp(l, u, r, i, a, c, this.nonce, m);
            default:
              o = new Vo(l, u, i, d, a, c, m);
              break;
          }
          s.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        ie(hw),
        ie(pw),
        ie(ms),
        ie(qx),
        ie(ze),
        ie(Lt),
        ie($e),
        ie(Vh),
      );
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Uo = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(jp[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (dw(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (dw(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new $(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let s = jp[i];
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = jp[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (_n.DashCase | _n.Important)
        ? e.style.setProperty(n, r, i & _n.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & _n.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == "string" &&
        ((e = Nn().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r),
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function dw(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Hp = class extends Uo {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = gw(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Vo = class extends Uo {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? gw(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Jl = class extends Vo {
    constructor(e, n, r, i, s, o, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, s, o, a, c, l),
        (this.contentAttr = $x(l)),
        (this.hostAttr = zx(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Gx = (() => {
    let e = class e extends ws {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return (
          r.addEventListener(i, s, !1), () => this.removeEventListener(r, i, s)
        );
      }
      removeEventListener(r, i, s) {
        return r.removeEventListener(i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  fw = ["alt", "control", "meta", "shift"],
  Wx = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Qx = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  Kx = (() => {
    let e = class e extends ws {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, s) {
        let o = e.parseEventName(i),
          a = e.eventCallback(o.fullKey, s, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Nn().onAndCancel(r, o.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          s = i.shift();
        if (i.length === 0 || !(s === "keydown" || s === "keyup")) return null;
        let o = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          fw.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = s), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(r, i) {
        let s = Wx[r.key] || r.key,
          o = "";
        return (
          i.indexOf("code.") > -1 && ((s = r.code), (o = "code.")),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === " " ? (s = "space") : s === "." && (s = "dot"),
              fw.forEach((a) => {
                if (a !== s) {
                  let c = Qx[a];
                  c(r) && (o += a + ".");
                }
              }),
              (o += s),
              o === i)
        );
      }
      static eventCallback(r, i, s) {
        return (o) => {
          e.matchEventFullKeyCode(o, r) && s.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function f4(t, e) {
  return N0(ee({ rootComponent: t }, Yx(e)));
}
function Yx(t) {
  return {
    appProviders: [...tR, ...(t?.providers ?? [])],
    platformProviders: eR,
  };
}
function Zx() {
  Bo.makeCurrent();
}
function Xx() {
  return new fn();
}
function Jx() {
  return yl(document), document;
}
var eR = [
  { provide: Lt, useValue: Np },
  { provide: Co, useValue: Zx, multi: !0 },
  { provide: ze, useFactory: Jx, deps: [] },
];
var tR = [
  { provide: fl, useValue: "root" },
  { provide: fn, useFactory: Xx, deps: [] },
  { provide: Ho, useClass: Gx, multi: !0, deps: [ze, $e, Lt] },
  { provide: Ho, useClass: Kx, multi: !0, deps: [ze] },
  Xl,
  pw,
  hw,
  { provide: mi, useExisting: Xl },
  { provide: Lr, useClass: Bx, deps: [] },
  [],
];
var yw = (() => {
  let e = class e {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(ie(ze));
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var nR = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({
        token: e,
        factory: function (i) {
          let s = null;
          return i ? (s = new (i || e)()) : (s = ie(rR)), s;
        },
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  rR = (() => {
    let e = class e extends nR {
      constructor(r) {
        super(), (this._doc = r);
      }
      sanitize(r, i) {
        if (i == null) return null;
        switch (r) {
          case er.NONE:
            return i;
          case er.HTML:
            return Ei(i, "HTML") ? In(i) : QE(this._doc, String(i)).toString();
          case er.STYLE:
            return Ei(i, "Style") ? In(i) : i;
          case er.SCRIPT:
            if (Ei(i, "Script")) return In(i);
            throw new $(5200, !1);
          case er.URL:
            return Ei(i, "URL") ? In(i) : Dl(String(i));
          case er.RESOURCE_URL:
            if (Ei(i, "ResourceURL")) return In(i);
            throw new $(5201, !1);
          default:
            throw new $(5202, !1);
        }
      }
      bypassSecurityTrustHtml(r) {
        return jE(r);
      }
      bypassSecurityTrustStyle(r) {
        return BE(r);
      }
      bypassSecurityTrustScript(r) {
        return HE(r);
      }
      bypassSecurityTrustUrl(r) {
        return UE(r);
      }
      bypassSecurityTrustResourceUrl(r) {
        return VE(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Up = (function (t) {
    return (
      (t[(t.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
      (t[(t.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
      t
    );
  })(Up || {});
function h4(...t) {
  let e = [],
    n = new Set(),
    r = n.has(Up.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: s } of t) n.add(s), i.length && e.push(i);
  return Tn([[], x0(), n.has(Up.NoHttpTransferCache) || r ? [] : uw({}), e]);
}
var be = (function (t) {
    return (
      (t[(t.State = 0)] = "State"),
      (t[(t.Transition = 1)] = "Transition"),
      (t[(t.Sequence = 2)] = "Sequence"),
      (t[(t.Group = 3)] = "Group"),
      (t[(t.Animate = 4)] = "Animate"),
      (t[(t.Keyframes = 5)] = "Keyframes"),
      (t[(t.Style = 6)] = "Style"),
      (t[(t.Trigger = 7)] = "Trigger"),
      (t[(t.Reference = 8)] = "Reference"),
      (t[(t.AnimateChild = 9)] = "AnimateChild"),
      (t[(t.AnimateRef = 10)] = "AnimateRef"),
      (t[(t.Query = 11)] = "Query"),
      (t[(t.Stagger = 12)] = "Stagger"),
      t
    );
  })(be || {}),
  An = "*";
function m4(t, e) {
  return { type: be.Trigger, name: t, definitions: e, options: {} };
}
function g4(t, e = null) {
  return { type: be.Animate, styles: e, timings: t };
}
function vw(t, e = null) {
  return { type: be.Sequence, steps: t, options: e };
}
function qp(t) {
  return { type: be.Style, styles: t, offset: null };
}
function y4(t, e, n) {
  return { type: be.State, name: t, styles: e, options: n };
}
function v4(t, e, n = null) {
  return { type: be.Transition, expr: t, animation: e, options: n };
}
var jr = class {
    constructor(e = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  qo = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let n = 0,
        r = 0,
        i = 0,
        s = this.players.length;
      s == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((o) => {
            o.onDone(() => {
              ++n == s && this._onFinish();
            }),
              o.onDestroy(() => {
                ++r == s && this._onDestroy();
              }),
              o.onStart(() => {
                ++i == s && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (o, a) => Math.max(o, a.totalTime),
          0,
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let n = e * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null,
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  eu = "!";
function Ew(t) {
  return new $(3e3, !1);
}
function sR() {
  return new $(3100, !1);
}
function oR() {
  return new $(3101, !1);
}
function aR(t) {
  return new $(3001, !1);
}
function cR(t) {
  return new $(3003, !1);
}
function lR(t) {
  return new $(3004, !1);
}
function uR(t, e) {
  return new $(3005, !1);
}
function dR() {
  return new $(3006, !1);
}
function fR() {
  return new $(3007, !1);
}
function hR(t, e) {
  return new $(3008, !1);
}
function pR(t) {
  return new $(3002, !1);
}
function mR(t, e, n, r, i) {
  return new $(3010, !1);
}
function gR() {
  return new $(3011, !1);
}
function yR() {
  return new $(3012, !1);
}
function vR() {
  return new $(3200, !1);
}
function ER() {
  return new $(3202, !1);
}
function bR() {
  return new $(3013, !1);
}
function wR(t) {
  return new $(3014, !1);
}
function DR(t) {
  return new $(3015, !1);
}
function _R(t) {
  return new $(3016, !1);
}
function TR(t, e) {
  return new $(3404, !1);
}
function SR(t) {
  return new $(3502, !1);
}
function CR(t) {
  return new $(3503, !1);
}
function IR() {
  return new $(3300, !1);
}
function MR(t) {
  return new $(3504, !1);
}
function NR(t) {
  return new $(3301, !1);
}
function AR(t, e) {
  return new $(3302, !1);
}
function xR(t) {
  return new $(3303, !1);
}
function RR(t, e) {
  return new $(3400, !1);
}
function OR(t) {
  return new $(3401, !1);
}
function kR(t) {
  return new $(3402, !1);
}
function LR(t, e) {
  return new $(3505, !1);
}
function Br(t) {
  switch (t.length) {
    case 0:
      return new jr();
    case 1:
      return t[0];
    default:
      return new qo(t);
  }
}
function Ow(t, e, n = new Map(), r = new Map()) {
  let i = [],
    s = [],
    o = -1,
    a = null;
  if (
    (e.forEach((c) => {
      let l = c.get("offset"),
        u = l == o,
        d = (u && a) || new Map();
      c.forEach((m, E) => {
        let C = E,
          M = m;
        if (E !== "offset")
          switch (((C = t.normalizePropertyName(C, i)), M)) {
            case eu:
              M = n.get(E);
              break;
            case An:
              M = r.get(E);
              break;
            default:
              M = t.normalizeStyleValue(E, C, M, i);
              break;
          }
        d.set(C, M);
      }),
        u || s.push(d),
        (a = d),
        (o = l);
    }),
    i.length)
  )
    throw SR(i);
  return s;
}
function fm(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && $p(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && $p(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && $p(n, "destroy", t)));
      break;
  }
}
function $p(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    s = hm(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i,
    ),
    o = t._data;
  return o != null && (s._data = o), s;
}
function hm(t, e, n, r, i = "", s = 0, o) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: s,
    disabled: !!o,
  };
}
function zt(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function bw(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var PR = typeof document > "u" ? null : document.documentElement;
function pm(t) {
  let e = t.parentNode || t.host || null;
  return e === PR ? null : e;
}
function FR(t) {
  return t.substring(1, 6) == "ebkit";
}
var _i = null,
  ww = !1;
function jR(t) {
  _i ||
    ((_i = BR() || {}), (ww = _i.style ? "WebkitAppearance" in _i.style : !1));
  let e = !0;
  return (
    _i.style &&
      !FR(t) &&
      ((e = t in _i.style),
      !e &&
        ww &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in _i.style)),
    e
  );
}
function BR() {
  return typeof document < "u" ? document.body : null;
}
function kw(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = pm(e);
  }
  return !1;
}
function Lw(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var mm = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return jR(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return kw(r, i);
      }
      getParentElement(r) {
        return pm(r);
      }
      query(r, i, s) {
        return Lw(r, i, s);
      }
      computeStyle(r, i, s) {
        return s || "";
      }
      animate(r, i, s, o, a, c = [], l) {
        return new jr(s, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Em = class Em {};
Em.NOOP = new mm();
var Ci = Em,
  Ii = class {};
var HR = 1e3,
  Pw = "{{",
  UR = "}}",
  Fw = "ng-enter",
  Yp = "ng-leave",
  tu = "ng-trigger",
  ou = ".ng-trigger",
  Dw = "ng-animating",
  Zp = ".ng-animating";
function nr(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : Xp(parseFloat(e[1]), e[2]);
}
function Xp(t, e) {
  switch (e) {
    case "s":
      return t * HR;
    default:
      return t;
  }
}
function au(t, e, n) {
  return t.hasOwnProperty("duration") ? t : VR(t, e, n);
}
function VR(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    s = 0,
    o = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(Ew(t)), { duration: 0, delay: 0, easing: "" };
    i = Xp(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (s = Xp(parseFloat(c), a[4]));
    let l = a[5];
    l && (o = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(sR()), (a = !0)),
      s < 0 && (e.push(oR()), (a = !0)),
      a && e.splice(c, 0, Ew(t));
  }
  return { duration: i, delay: s, easing: o };
}
function qR(t) {
  return t.length
    ? t[0] instanceof Map
      ? t
      : t.map((e) => new Map(Object.entries(e)))
    : [];
}
function xn(t, e, n) {
  e.forEach((r, i) => {
    let s = gm(i);
    n && !n.has(i) && n.set(i, t.style[s]), (t.style[s] = r);
  });
}
function Si(t, e) {
  e.forEach((n, r) => {
    let i = gm(r);
    t.style[i] = "";
  });
}
function $o(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : vw(t)) : t;
}
function $R(t, e, n) {
  let r = e.params || {},
    i = jw(t);
  i.length &&
    i.forEach((s) => {
      r.hasOwnProperty(s) || n.push(aR(s));
    });
}
var Jp = new RegExp(`${Pw}\\s*(.+?)\\s*${UR}`, "g");
function jw(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = Jp.exec(t)); ) e.push(n[1]);
    Jp.lastIndex = 0;
  }
  return e;
}
function Go(t, e, n) {
  let r = `${t}`,
    i = r.replace(Jp, (s, o) => {
      let a = e[o];
      return a == null && (n.push(cR(o)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
var zR = /-+([a-z0-9])/g;
function gm(t) {
  return t.replace(zR, (...e) => e[1].toUpperCase());
}
function GR(t, e) {
  return t === 0 || e === 0;
}
function WR(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((s, o) => {
        r.has(o) || i.push(o), r.set(o, s);
      }),
      i.length)
    )
      for (let s = 1; s < e.length; s++) {
        let o = e[s];
        i.forEach((a) => o.set(a, ym(t, a)));
      }
  }
  return e;
}
function $t(t, e, n) {
  switch (e.type) {
    case be.Trigger:
      return t.visitTrigger(e, n);
    case be.State:
      return t.visitState(e, n);
    case be.Transition:
      return t.visitTransition(e, n);
    case be.Sequence:
      return t.visitSequence(e, n);
    case be.Group:
      return t.visitGroup(e, n);
    case be.Animate:
      return t.visitAnimate(e, n);
    case be.Keyframes:
      return t.visitKeyframes(e, n);
    case be.Style:
      return t.visitStyle(e, n);
    case be.Reference:
      return t.visitReference(e, n);
    case be.AnimateChild:
      return t.visitAnimateChild(e, n);
    case be.AnimateRef:
      return t.visitAnimateRef(e, n);
    case be.Query:
      return t.visitQuery(e, n);
    case be.Stagger:
      return t.visitStagger(e, n);
    default:
      throw lR(e.type);
  }
}
function ym(t, e) {
  return window.getComputedStyle(t)[e];
}
var QR = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  cu = class extends Ii {
    normalizePropertyName(e, n) {
      return gm(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let s = "",
        o = r.toString().trim();
      if (QR.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") s = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(uR(e, r));
        }
      return o + s;
    }
  };
var lu = "*";
function KR(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => YR(r, n, e))
      : n.push(t),
    n
  );
}
function YR(t, e, n) {
  if (t[0] == ":") {
    let c = ZR(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(DR(t)), e;
  let i = r[1],
    s = r[2],
    o = r[3];
  e.push(_w(i, o));
  let a = i == lu && o == lu;
  s[0] == "<" && !a && e.push(_w(o, i));
}
function ZR(t, e) {
  switch (t) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ":decrement":
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return e.push(_R(t)), "* => *";
  }
}
var nu = new Set(["true", "1"]),
  ru = new Set(["false", "0"]);
function _w(t, e) {
  let n = nu.has(t) || ru.has(t),
    r = nu.has(e) || ru.has(e);
  return (i, s) => {
    let o = t == lu || t == i,
      a = e == lu || e == s;
    return (
      !o && n && typeof i == "boolean" && (o = i ? nu.has(t) : ru.has(t)),
      !a && r && typeof s == "boolean" && (a = s ? nu.has(e) : ru.has(e)),
      o && a
    );
  };
}
var Bw = ":self",
  XR = new RegExp(`s*${Bw}s*,?`, "g");
function Hw(t, e, n, r) {
  return new em(t).build(e, n, r);
}
var Tw = "",
  em = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new tm(n);
      return this._resetContextStyleTimingState(i), $t(this, $o(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = Tw),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(Tw, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        s = [],
        o = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(dR()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == be.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), s.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == be.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), o.push(c);
          } else n.errors.push(fR());
        }),
        {
          type: be.Trigger,
          name: e.name,
          states: s,
          transitions: o,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, n) {
      let r = this.visitStyle(e.styles, n),
        i = (e.options && e.options.params) || null;
      if (r.containsDynamicStyles) {
        let s = new Set(),
          o = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((c) => {
              jw(c).forEach((l) => {
                o.hasOwnProperty(l) || s.add(l);
              });
            });
        }),
          s.size && n.errors.push(hR(e.name, [...s.values()]));
      }
      return {
        type: be.State,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = $t(this, $o(e.animation), n),
        i = KR(e.expr, n.errors);
      return {
        type: be.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: Ti(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: be.Sequence,
        steps: e.steps.map((r) => $t(this, r, n)),
        options: Ti(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        s = e.steps.map((o) => {
          n.currentTime = r;
          let a = $t(this, o, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i),
        { type: be.Group, steps: s, options: Ti(e.options) }
      );
    }
    visitAnimate(e, n) {
      let r = nO(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        s = e.styles ? e.styles : qp({});
      if (s.type == be.Keyframes) i = this.visitKeyframes(s, n);
      else {
        let o = e.styles,
          a = !1;
        if (!o) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (o = qp(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(o, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: be.Animate, timings: r, style: i, options: null }
      );
    }
    visitStyle(e, n) {
      let r = this._makeStyleAst(e, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(e, n) {
      let r = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == "string"
          ? a === An
            ? r.push(a)
            : n.errors.push(pR(a))
          : r.push(new Map(Object.entries(a)));
      let s = !1,
        o = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((o = a.get("easing")), a.delete("easing")), !s)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(Pw) >= 0) {
                s = !0;
                break;
              }
          }
        }),
        {
          type: be.Style,
          styles: r,
          easing: o,
          offset: e.offset,
          containsDynamicStyles: s,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        s = n.currentTime;
      r && s > 0 && (s -= r.duration + r.delay),
        e.styles.forEach((o) => {
          typeof o != "string" &&
            o.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (s != i &&
                  s >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(mR(c, u.startTime, u.endTime, s, i)),
                  (d = !1)),
                (s = u.startTime)),
                d && l.set(c, { startTime: s, endTime: i }),
                n.options && $R(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: be.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(gR()), r;
      let i = 1,
        s = 0,
        o = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((A) => {
          let _ = this._makeStyleAst(A, n),
            w = _.offset != null ? _.offset : tO(_.styles),
            T = 0;
          return (
            w != null && (s++, (T = _.offset = w)),
            (c = c || T < 0 || T > 1),
            (a = a || T < l),
            (l = T),
            o.push(T),
            _
          );
        });
      c && n.errors.push(yR()), a && n.errors.push(vR());
      let d = e.steps.length,
        m = 0;
      s > 0 && s < d ? n.errors.push(ER()) : s == 0 && (m = i / (d - 1));
      let E = d - 1,
        C = n.currentTime,
        M = n.currentAnimateTimings,
        P = M.duration;
      return (
        u.forEach((A, _) => {
          let w = m > 0 ? (_ == E ? 1 : m * _) : o[_],
            T = w * P;
          (n.currentTime = C + M.delay + T),
            (M.duration = T),
            this._validateStyleAst(A, n),
            (A.offset = w),
            r.styles.push(A);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: be.Reference,
        animation: $t(this, $o(e.animation), n),
        options: Ti(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: be.AnimateChild, options: Ti(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: be.AnimateRef,
        animation: this.visitReference(e.animation, n),
        options: Ti(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [s, o] = JR(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + s : s),
        zt(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = $t(this, $o(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: be.Query,
          selector: s,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: o,
          animation: a,
          originalSelector: e.selector,
          options: Ti(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(bR());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : au(e.timings, n.errors, !0);
      return {
        type: be.Stagger,
        animation: $t(this, $o(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function JR(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == Bw);
  return (
    e && (t = t.replace(XR, "")),
    (t = t
      .replace(/@\*/g, ou)
      .replace(/@\w+/g, (n) => ou + "-" + n.slice(1))
      .replace(/:animating/g, Zp)),
    [t, e]
  );
}
function eO(t) {
  return t ? ee({}, t) : null;
}
var tm = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function tO(t) {
  if (typeof t == "string") return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((n) => {
      if (n instanceof Map && n.has("offset")) {
        let r = n;
        (e = parseFloat(r.get("offset"))), r.delete("offset");
      }
    });
  else if (t instanceof Map && t.has("offset")) {
    let n = t;
    (e = parseFloat(n.get("offset"))), n.delete("offset");
  }
  return e;
}
function nO(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let s = au(t, e).duration;
    return zp(s, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((s) => s.charAt(0) == "{" && s.charAt(1) == "{")) {
    let s = zp(0, 0, "");
    return (s.dynamic = !0), (s.strValue = n), s;
  }
  let i = au(n, e);
  return zp(i.duration, i.delay, i.easing);
}
function Ti(t) {
  return (
    t ? ((t = ee({}, t)), t.params && (t.params = eO(t.params))) : (t = {}), t
  );
}
function zp(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function vm(t, e, n, r, i, s, o = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: s,
    totalTime: i + s,
    easing: o,
    subTimeline: a,
  };
}
var Wo = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, n) {
      let r = this._map.get(e);
      r || this._map.set(e, (r = [])), r.push(...n);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  rO = 1,
  iO = ":enter",
  sO = new RegExp(iO, "g"),
  oO = ":leave",
  aO = new RegExp(oO, "g");
function Uw(t, e, n, r, i, s = new Map(), o = new Map(), a, c, l = []) {
  return new nm().buildKeyframes(t, e, n, r, i, s, o, a, c, l);
}
var nm = class {
    buildKeyframes(e, n, r, i, s, o, a, c, l, u = []) {
      l = l || new Wo();
      let d = new rm(e, n, l, i, s, u, []);
      d.options = c;
      let m = c.delay ? nr(c.delay) : 0;
      d.currentTimeline.delayNextStep(m),
        d.currentTimeline.setStyles([o], null, d.errors, c),
        $t(this, r, d);
      let E = d.timelines.filter((C) => C.containsAnimation());
      if (E.length && a.size) {
        let C;
        for (let M = E.length - 1; M >= 0; M--) {
          let P = E[M];
          if (P.element === n) {
            C = P;
            break;
          }
        }
        C &&
          !C.allowOnlyTimelineStyles() &&
          C.setStyles([a], null, d.errors, c);
      }
      return E.length
        ? E.map((C) => C.buildKeyframes())
        : [vm(n, [], [], [], 0, m, "", !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          s = n.currentTimeline.currentTime,
          o = this._visitSubInstructions(r, i, i.options);
        s != o && n.transformIntoNewTimeline(o);
      }
      n.previousNode = e;
    }
    visitAnimateRef(e, n) {
      let r = n.createSubContext(e.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], n, r),
        this.visitReference(e.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = e);
    }
    _applyAnimationRefDelays(e, n, r) {
      for (let i of e) {
        let s = i?.delay;
        if (s) {
          let o =
            typeof s == "number" ? s : nr(Go(s, i?.params ?? {}, n.errors));
          r.delayNextStep(o);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let s = n.currentTimeline.currentTime,
        o = r.duration != null ? nr(r.duration) : null,
        a = r.delay != null ? nr(r.delay) : null;
      return (
        o !== 0 &&
          e.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, o, a);
            s = Math.max(s, l.duration + l.delay);
          }),
        s
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        $t(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        s = e.options;
      if (
        s &&
        (s.params || s.delay) &&
        ((i = n.createSubContext(s)),
        i.transformIntoNewTimeline(),
        s.delay != null)
      ) {
        i.previousNode.type == be.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = uu));
        let o = nr(s.delay);
        i.delayNextStep(o);
      }
      e.steps.length &&
        (e.steps.forEach((o) => $t(this, o, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        s = e.options && e.options.delay ? nr(e.options.delay) : 0;
      e.steps.forEach((o) => {
        let a = n.createSubContext(e.options);
        s && a.delayNextStep(s),
          $t(this, o, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((o) => n.currentTimeline.mergeTimelineCollectedStyles(o)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? Go(r, n.params, n.errors) : r;
        return au(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let s = e.style;
      s.type == be.Keyframes
        ? this.visitKeyframes(s, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(s, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let s = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(s)
        : r.setStyles(e.styles, s, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        s = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * s),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + s),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        s = i.delay ? nr(i.delay) : 0;
      s &&
        (n.previousNode.type === be.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = uu));
      let o = r,
        a = n.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          n.errors,
        );
      n.currentQueryTotal = a.length;
      let c = null;
      a.forEach((l, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(e.options, l);
        s && d.delayNextStep(s),
          l === n.element && (c = d.currentTimeline),
          $t(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let m = d.currentTimeline.currentTime;
        o = Math.max(o, m);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(o),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        s = e.timings,
        o = Math.abs(s.duration),
        a = o * (n.currentQueryTotal - 1),
        c = o * n.currentQueryIndex;
      switch (s.duration < 0 ? "reverse" : s.easing) {
        case "reverse":
          c = a - c;
          break;
        case "full":
          c = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      c && u.delayNextStep(c);
      let d = u.currentTime;
      $t(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  uu = {},
  rm = class t {
    constructor(e, n, r, i, s, o, a, c) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = s),
        (this.errors = o),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = uu),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new du(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = nr(r.duration)),
        r.delay != null && (i.delay = nr(r.delay));
      let s = r.params;
      if (s) {
        let o = i.params;
        o || (o = this.options.params = {}),
          Object.keys(s).forEach((a) => {
            (!n || !o.hasOwnProperty(a)) && (o[a] = Go(s[a], o, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (e.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, n, r) {
      let i = n || this.element,
        s = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0),
        );
      return (
        (s.previousNode = this.previousNode),
        (s.currentAnimateTimings = this.currentAnimateTimings),
        (s.options = this._copyOptions()),
        s.updateOptions(e),
        (s.currentQueryIndex = this.currentQueryIndex),
        (s.currentQueryTotal = this.currentQueryTotal),
        (s.parentContext = this),
        this.subContextCount++,
        s
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = uu),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, n, r) {
      let i = {
          duration: n ?? e.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
          easing: "",
        },
        s = new im(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe,
        );
      return this.timelines.push(s), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, s, o) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(sO, "." + this._enterClassName)),
          (e = e.replace(aO, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !s && a.length == 0 && o.push(wR(n)), a;
    }
  },
  du = class t {
    constructor(e, n, r, i) {
      (this._driver = e),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + e),
          n && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, n) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          n || this.currentTime,
          this._elementTimelineStylesLookup,
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += rO), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, n) {
      this._localTimelineStyles.set(e, n),
        this._globalTimelineStyles.set(e, n),
        this._styleSummary.set(e, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set("easing", e);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || An), this._currentKeyframe.set(n, An);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let s = (i && i.params) || {},
        o = cO(e, this._globalTimelineStyles);
      for (let [a, c] of o) {
        let l = Go(c, s, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? An),
          this._updateStyle(a, l);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, n) => {
          this._currentKeyframe.set(n, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, n] of this._localTimelineStyles)
        this._pendingStyles.set(e, n), this._updateStyle(e, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let n in this._currentKeyframe) e.push(n);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, c) => {
        let l = new Map([...this._backFill, ...a]);
        l.forEach((u, d) => {
          u === eu ? e.add(d) : u === An && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let s = [...e.values()],
        o = [...n.values()];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return vm(
        this.element,
        i,
        s,
        o,
        this.duration,
        this.startTime,
        this.easing,
        !1,
      );
    }
  },
  im = class extends du {
    constructor(e, n, r, i, s, o, a = !1) {
      super(e, n, o.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = s),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: o.duration,
          delay: o.delay,
          easing: o.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let s = [],
          o = r + n,
          a = n / o,
          c = new Map(e[0]);
        c.set("offset", 0), s.push(c);
        let l = new Map(e[0]);
        l.set("offset", Sw(a)), s.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let m = new Map(e[d]),
            E = m.get("offset"),
            C = n + E * r;
          m.set("offset", Sw(C / o)), s.push(m);
        }
        (r = o), (n = 0), (i = ""), (e = s);
      }
      return vm(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0,
      );
    }
  };
function Sw(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function cO(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r ??= e.keys();
        for (let s of r) n.set(s, An);
      } else for (let [s, o] of i) n.set(s, o);
    }),
    n
  );
}
function Cw(t, e, n, r, i, s, o, a, c, l, u, d, m) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: s,
    toState: r,
    toStyles: o,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: m,
  };
}
var Gp = {},
  fu = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return lO(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, s, o, a, c, l, u) {
      let d = [],
        m = (this.ast.options && this.ast.options.params) || Gp,
        E = (a && a.params) || Gp,
        C = this.buildStyles(r, E, d),
        M = (c && c.params) || Gp,
        P = this.buildStyles(i, M, d),
        A = new Set(),
        _ = new Map(),
        w = new Map(),
        T = i === "void",
        b = { params: Vw(M, m), delay: this.ast.options?.delay },
        J = u ? [] : Uw(e, n, this.ast.animation, s, o, C, P, b, l, d),
        ne = 0;
      return (
        J.forEach((ve) => {
          ne = Math.max(ve.duration + ve.delay, ne);
        }),
        d.length
          ? Cw(n, this._triggerName, r, i, T, C, P, [], [], _, w, ne, d)
          : (J.forEach((ve) => {
              let z = ve.element,
                O = zt(_, z, new Set());
              ve.preStyleProps.forEach((Y) => O.add(Y));
              let j = zt(w, z, new Set());
              ve.postStyleProps.forEach((Y) => j.add(Y)), z !== n && A.add(z);
            }),
            Cw(
              n,
              this._triggerName,
              r,
              i,
              T,
              C,
              P,
              J,
              [...A.values()],
              _,
              w,
              ne,
            ))
      );
    }
  };
function lO(t, e, n, r, i) {
  return t.some((s) => s(e, n, r, i));
}
function Vw(t, e) {
  let n = ee({}, e);
  return (
    Object.entries(t).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var sm = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = Vw(e, this.defaultParams);
    return (
      this.styles.styles.forEach((s) => {
        typeof s != "string" &&
          s.forEach((o, a) => {
            o && (o = Go(o, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (o = this.normalizer.normalizeStyleValue(a, c, o, n)), r.set(a, o);
          });
      }),
      r
    );
  }
};
function uO(t, e, n) {
  return new om(t, e, n);
}
var om = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let s = (i.options && i.options.params) || {};
        this.states.set(i.name, new sm(i.style, s, r));
      }),
      Iw(this.states, "true", "1"),
      Iw(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new fu(e, i, this.states));
      }),
      (this.fallbackTransition = dO(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((o) => o.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function dO(t, e, n) {
  let r = [(o, a) => !0],
    i = { type: be.Sequence, steps: [], options: null },
    s = {
      type: be.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new fu(t, s, e);
}
function Iw(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var fO = new Wo(),
  am = class {
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, n) {
      let r = [],
        i = [],
        s = Hw(this._driver, n, r, i);
      if (r.length) throw CR(r);
      i.length && void 0, this._animations.set(e, s);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        s = Ow(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, s, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        s = this._animations.get(e),
        o,
        a = new Map();
      if (
        (s
          ? ((o = Uw(
              this._driver,
              n,
              s,
              Fw,
              Yp,
              new Map(),
              new Map(),
              r,
              fO,
              i,
            )),
            o.forEach((u) => {
              let d = zt(a, u.element, new Map());
              u.postStyleProps.forEach((m) => d.set(m, null));
            }))
          : (i.push(IR()), (o = [])),
        i.length)
      )
        throw MR(i);
      a.forEach((u, d) => {
        u.forEach((m, E) => {
          u.set(E, this._driver.computeStyle(d, E, An));
        });
      });
      let c = o.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = Br(c);
      return (
        this._playersById.set(e, l),
        l.onDestroy(() => this.destroy(e)),
        this.players.push(l),
        l
      );
    }
    destroy(e) {
      let n = this._getPlayer(e);
      n.destroy(), this._playersById.delete(e);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(e) {
      let n = this._playersById.get(e);
      if (!n) throw NR(e);
      return n;
    }
    listen(e, n, r, i) {
      let s = hm(n, "", "", "");
      return fm(this._getPlayer(e), r, s, i), () => {};
    }
    command(e, n, r, i) {
      if (r == "register") {
        this.register(e, i[0]);
        return;
      }
      if (r == "create") {
        let o = i[0] || {};
        this.create(e, n, o);
        return;
      }
      let s = this._getPlayer(e);
      switch (r) {
        case "play":
          s.play();
          break;
        case "pause":
          s.pause();
          break;
        case "reset":
          s.reset();
          break;
        case "restart":
          s.restart();
          break;
        case "finish":
          s.finish();
          break;
        case "init":
          s.init();
          break;
        case "setPosition":
          s.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  Mw = "ng-animate-queued",
  hO = ".ng-animate-queued",
  Wp = "ng-animate-disabled",
  pO = ".ng-animate-disabled",
  mO = "ng-star-inserted",
  gO = ".ng-star-inserted",
  yO = [],
  qw = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  vO = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  pn = "__ng_removed",
  Qo = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = bO(i)), r)) {
        let s = e,
          { value: o } = s,
          a = Ua(s, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let n = e.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  zo = "void",
  Qp = new Qo(zo),
  cm = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        en(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw AR(r, n);
      if (r == null || r.length == 0) throw xR(n);
      if (!wO(r)) throw RR(r, n);
      let s = zt(this._elementListeners, e, []),
        o = { name: n, phase: r, callback: i };
      s.push(o);
      let a = zt(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (en(e, tu), en(e, tu + "-" + n), a.set(n, Qp)),
        () => {
          this._engine.afterFlush(() => {
            let c = s.indexOf(o);
            c >= 0 && s.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw OR(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let s = this._getTrigger(n),
        o = new Ko(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (en(e, tu),
        en(e, tu + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new Qo(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = Qp),
        !(l.value === zo) && c.value === l.value)
      ) {
        if (!TO(c.params, l.params)) {
          let M = [],
            P = s.matchStyles(c.value, c.params, M),
            A = s.matchStyles(l.value, l.params, M);
          M.length
            ? this._engine.reportError(M)
            : this._engine.afterFlush(() => {
                Si(e, P), xn(e, A);
              });
        }
        return;
      }
      let m = zt(this._engine.playersByElement, e, []);
      m.forEach((M) => {
        M.namespaceId == this.id &&
          M.triggerName == n &&
          M.queued &&
          M.destroy();
      });
      let E = s.matchTransition(c.value, l.value, e, l.params),
        C = !1;
      if (!E) {
        if (!i) return;
        (E = s.fallbackTransition), (C = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: E,
          fromState: c,
          toState: l,
          player: o,
          isFallbackTransition: C,
        }),
        C ||
          (en(e, Mw),
          o.onStart(() => {
            Ds(e, Mw);
          })),
        o.onDone(() => {
          let M = this.players.indexOf(o);
          M >= 0 && this.players.splice(M, 1);
          let P = this._engine.playersByElement.get(e);
          if (P) {
            let A = P.indexOf(o);
            A >= 0 && P.splice(A, 1);
          }
        }),
        this.players.push(o),
        m.push(o),
        o
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((n) => n.delete(e)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != e),
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let n = this._engine.playersByElement.get(e);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, n) {
      let r = this._engine.driver.query(e, ou, !0);
      r.forEach((i) => {
        if (i[pn]) return;
        let s = this._engine.fetchNamespacesByElement(i);
        s.size
          ? s.forEach((o) => o.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i)),
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let s = this._engine.statesByElement.get(e),
        o = new Map();
      if (s) {
        let a = [];
        if (
          (s.forEach((c, l) => {
            if ((o.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(e, l, zo, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, o),
            r && Br(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let n = this._elementListeners.get(e),
        r = this._engine.statesByElement.get(e);
      if (n && r) {
        let i = new Set();
        n.forEach((s) => {
          let o = s.name;
          if (i.has(o)) return;
          i.add(o);
          let c = this._triggers.get(o).fallbackTransition,
            l = r.get(o) || Qp,
            u = new Qo(zo),
            d = new Ko(this.id, o, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: o,
              transition: c,
              fromState: l,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, n) {
      let r = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
        this.triggerLeaveAnimation(e, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let s = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (s && s.length) i = !0;
        else {
          let o = e;
          for (; (o = o.parentNode); )
            if (r.statesByElement.get(o)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let s = e[pn];
        (!s || s === qw) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      en(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let s = r.element,
            o = this._elementListeners.get(s);
          o &&
            o.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = hm(
                  s,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value,
                );
                (c._data = e), fm(r.player, a.phase, c, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let s = r.transition.ast.depCount,
            o = i.transition.ast.depCount;
          return s == 0 || o == 0
            ? s - o
            : this._engine.driver.containsElement(r.element, i.element)
              ? 1
              : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  lm = class {
    _onRemovalComplete(e, n) {
      this.onRemovalComplete(e, n);
    }
    constructor(e, n, r, i) {
      (this.bodyNode = e),
        (this.driver = n),
        (this._normalizer = r),
        (this.scheduler = i),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (s, o) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && e.push(r);
          });
        }),
        e
      );
    }
    createNamespace(e, n) {
      let r = new cm(e, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[e] = r)
      );
    }
    _balanceNamespaceList(e, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let o = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, e), (o = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        o || r.unshift(e);
      } else r.push(e);
      return i.set(n, e), e;
    }
    register(e, n) {
      let r = this._namespaceLookup[e];
      return r || (r = this.createNamespace(e, n)), r;
    }
    registerTrigger(e, n, r) {
      let i = this._namespaceLookup[e];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(e, n) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let n = new Set(),
        r = this.statesByElement.get(e);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let s = this._fetchNamespace(i.namespaceId);
            s && n.add(s);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (iu(n)) {
        let s = this._fetchNamespace(e);
        if (s) return s.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!iu(n)) return;
      let s = n[pn];
      if (s && s.setForRemoval) {
        (s.setForRemoval = !1), (s.setForMove = !0);
        let o = this.collectedLeaveElements.indexOf(n);
        o >= 0 && this.collectedLeaveElements.splice(o, 1);
      }
      if (e) {
        let o = this._fetchNamespace(e);
        o && o.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), en(e, Wp))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), Ds(e, Wp));
    }
    removeNode(e, n, r) {
      if (iu(n)) {
        this.scheduler?.notify();
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let s = this.namespacesByHostElement.get(n);
        s && s.id !== e && s.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, s) {
      this.collectedLeaveElements.push(n),
        (n[pn] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: s,
        });
    }
    listen(e, n, r, i, s) {
      return iu(n) ? this._fetchNamespace(e).listen(n, r, i, s) : () => {};
    }
    _buildInstruction(e, n, r, i, s) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        r,
        i,
        e.fromState.options,
        e.toState.options,
        n,
        s,
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, ou, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Zp, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(e) {
      let n = this.playersByElement.get(e);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let n = this.playersByQueriedElement.get(e);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return Br(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[pn];
      if (n && n.setForRemoval) {
        if (((e[pn] = qw), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(Wp) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, pO, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(e = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i),
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          en(i, mO);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, e);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? Br(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw kR(e);
    }
    _flushAnimations(e, n) {
      let r = new Wo(),
        i = [],
        s = new Map(),
        o = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((y) => {
        u.add(y);
        let I = this.driver.query(y, hO, !0);
        for (let R = 0; R < I.length; R++) u.add(I[R]);
      });
      let d = this.bodyNode,
        m = Array.from(this.statesByElement.keys()),
        E = xw(m, this.collectedEnterElements),
        C = new Map(),
        M = 0;
      E.forEach((y, I) => {
        let R = Fw + M++;
        C.set(I, R), y.forEach((V) => en(V, R));
      });
      let P = [],
        A = new Set(),
        _ = new Set();
      for (let y = 0; y < this.collectedLeaveElements.length; y++) {
        let I = this.collectedLeaveElements[y],
          R = I[pn];
        R &&
          R.setForRemoval &&
          (P.push(I),
          A.add(I),
          R.hasAnimation
            ? this.driver.query(I, gO, !0).forEach((V) => A.add(V))
            : _.add(I));
      }
      let w = new Map(),
        T = xw(m, Array.from(A));
      T.forEach((y, I) => {
        let R = Yp + M++;
        w.set(I, R), y.forEach((V) => en(V, R));
      }),
        e.push(() => {
          E.forEach((y, I) => {
            let R = C.get(I);
            y.forEach((V) => Ds(V, R));
          }),
            T.forEach((y, I) => {
              let R = w.get(I);
              y.forEach((V) => Ds(V, R));
            }),
            P.forEach((y) => {
              this.processLeaveNode(y);
            });
        });
      let b = [],
        J = [];
      for (let y = this._namespaceList.length - 1; y >= 0; y--)
        this._namespaceList[y].drainQueuedTransitions(n).forEach((R) => {
          let V = R.player,
            K = R.element;
          if ((b.push(V), this.collectedEnterElements.length)) {
            let ut = K[pn];
            if (ut && ut.setForMove) {
              if (
                ut.previousTriggersValues &&
                ut.previousTriggersValues.has(R.triggerName)
              ) {
                let kn = ut.previousTriggersValues.get(R.triggerName),
                  At = this.statesByElement.get(R.element);
                if (At && At.has(R.triggerName)) {
                  let Ri = At.get(R.triggerName);
                  (Ri.value = kn), At.set(R.triggerName, Ri);
                }
              }
              V.destroy();
              return;
            }
          }
          let ge = !d || !this.driver.containsElement(d, K),
            S = w.get(K),
            k = C.get(K),
            q = this._buildInstruction(R, r, k, S, ge);
          if (q.errors && q.errors.length) {
            J.push(q);
            return;
          }
          if (ge) {
            V.onStart(() => Si(K, q.fromStyles)),
              V.onDestroy(() => xn(K, q.toStyles)),
              i.push(V);
            return;
          }
          if (R.isFallbackTransition) {
            V.onStart(() => Si(K, q.fromStyles)),
              V.onDestroy(() => xn(K, q.toStyles)),
              i.push(V);
            return;
          }
          let Ie = [];
          q.timelines.forEach((ut) => {
            (ut.stretchStartingKeyframe = !0),
              this.disabledNodes.has(ut.element) || Ie.push(ut);
          }),
            (q.timelines = Ie),
            r.append(K, q.timelines);
          let wt = { instruction: q, player: V, element: K };
          o.push(wt),
            q.queriedElements.forEach((ut) => zt(a, ut, []).push(V)),
            q.preStyleProps.forEach((ut, kn) => {
              if (ut.size) {
                let At = c.get(kn);
                At || c.set(kn, (At = new Set())),
                  ut.forEach((Ri, Ls) => At.add(Ls));
              }
            }),
            q.postStyleProps.forEach((ut, kn) => {
              let At = l.get(kn);
              At || l.set(kn, (At = new Set())),
                ut.forEach((Ri, Ls) => At.add(Ls));
            });
        });
      if (J.length) {
        let y = [];
        J.forEach((I) => {
          y.push(LR(I.triggerName, I.errors));
        }),
          b.forEach((I) => I.destroy()),
          this.reportError(y);
      }
      let ne = new Map(),
        ve = new Map();
      o.forEach((y) => {
        let I = y.element;
        r.has(I) &&
          (ve.set(I, I),
          this._beforeAnimationBuild(y.player.namespaceId, y.instruction, ne));
      }),
        i.forEach((y) => {
          let I = y.element;
          this._getPreviousPlayers(
            I,
            !1,
            y.namespaceId,
            y.triggerName,
            null,
          ).forEach((V) => {
            zt(ne, I, []).push(V), V.destroy();
          });
        });
      let z = P.filter((y) => Rw(y, c, l)),
        O = new Map();
      Aw(O, this.driver, _, l, An).forEach((y) => {
        Rw(y, c, l) && z.push(y);
      });
      let Y = new Map();
      E.forEach((y, I) => {
        Aw(Y, this.driver, new Set(y), c, eu);
      }),
        z.forEach((y) => {
          let I = O.get(y),
            R = Y.get(y);
          O.set(y, new Map([...(I?.entries() ?? []), ...(R?.entries() ?? [])]));
        });
      let v = [],
        g = [],
        p = {};
      o.forEach((y) => {
        let { element: I, player: R, instruction: V } = y;
        if (r.has(I)) {
          if (u.has(I)) {
            R.onDestroy(() => xn(I, V.toStyles)),
              (R.disabled = !0),
              R.overrideTotalTime(V.totalTime),
              i.push(R);
            return;
          }
          let K = p;
          if (ve.size > 1) {
            let S = I,
              k = [];
            for (; (S = S.parentNode); ) {
              let q = ve.get(S);
              if (q) {
                K = q;
                break;
              }
              k.push(S);
            }
            k.forEach((q) => ve.set(q, K));
          }
          let ge = this._buildAnimation(R.namespaceId, V, ne, s, Y, O);
          if ((R.setRealPlayer(ge), K === p)) v.push(R);
          else {
            let S = this.playersByElement.get(K);
            S && S.length && (R.parentPlayer = Br(S)), i.push(R);
          }
        } else
          Si(I, V.fromStyles),
            R.onDestroy(() => xn(I, V.toStyles)),
            g.push(R),
            u.has(I) && i.push(R);
      }),
        g.forEach((y) => {
          let I = s.get(y.element);
          if (I && I.length) {
            let R = Br(I);
            y.setRealPlayer(R);
          }
        }),
        i.forEach((y) => {
          y.parentPlayer ? y.syncPlayerEvents(y.parentPlayer) : y.destroy();
        });
      for (let y = 0; y < P.length; y++) {
        let I = P[y],
          R = I[pn];
        if ((Ds(I, Yp), R && R.hasAnimation)) continue;
        let V = [];
        if (a.size) {
          let ge = a.get(I);
          ge && ge.length && V.push(...ge);
          let S = this.driver.query(I, Zp, !0);
          for (let k = 0; k < S.length; k++) {
            let q = a.get(S[k]);
            q && q.length && V.push(...q);
          }
        }
        let K = V.filter((ge) => !ge.destroyed);
        K.length ? DO(this, I, K) : this.processLeaveNode(I);
      }
      return (
        (P.length = 0),
        v.forEach((y) => {
          this.players.push(y),
            y.onDone(() => {
              y.destroy();
              let I = this.players.indexOf(y);
              this.players.splice(I, 1);
            }),
            y.play();
        }),
        v
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, s) {
      let o = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (o = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let c = !s || s == zo;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || o.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (o = o.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName)),
          )),
        o
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        s = n.element,
        o = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== s,
          d = zt(r, l, []);
        this._getPreviousPlayers(l, u, o, a, n.toState).forEach((E) => {
          let C = E.getRealPlayer();
          C.beforeDestroy && C.beforeDestroy(), E.destroy(), d.push(E);
        });
      }
      Si(s, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, s, o) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        m = n.timelines.map((C) => {
          let M = C.element;
          u.add(M);
          let P = M[pn];
          if (P && P.removedBeforeQueried) return new jr(C.duration, C.delay);
          let A = M !== c,
            _ = _O((r.get(M) || yO).map((ne) => ne.getRealPlayer())).filter(
              (ne) => {
                let ve = ne;
                return ve.element ? ve.element === M : !1;
              },
            ),
            w = s.get(M),
            T = o.get(M),
            b = Ow(this._normalizer, C.keyframes, w, T),
            J = this._buildPlayer(C, b, _);
          if ((C.subTimeline && i && d.add(M), A)) {
            let ne = new Ko(e, a, M);
            ne.setRealPlayer(J), l.push(ne);
          }
          return J;
        });
      l.forEach((C) => {
        zt(this.playersByQueriedElement, C.element, []).push(C),
          C.onDone(() => EO(this.playersByQueriedElement, C.element, C));
      }),
        u.forEach((C) => en(C, Dw));
      let E = Br(m);
      return (
        E.onDestroy(() => {
          u.forEach((C) => Ds(C, Dw)), xn(c, n.toStyles);
        }),
        d.forEach((C) => {
          zt(i, C, []).push(E);
        }),
        E
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new jr(e.duration, e.delay);
    }
  },
  Ko = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new jr()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => fm(e, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let n = this._player;
      n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, n) {
      zt(this._queuedCallbacks, e, []).push(n);
    }
    onDone(e) {
      this.queued && this._queueEvent("done", e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent("start", e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(e);
    }
  };
function EO(t, e, n) {
  let r = t.get(e);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && t.delete(e);
  }
  return r;
}
function bO(t) {
  return t ?? null;
}
function iu(t) {
  return t && t.nodeType === 1;
}
function wO(t) {
  return t == "start" || t == "done";
}
function Nw(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function Aw(t, e, n, r, i) {
  let s = [];
  n.forEach((c) => s.push(Nw(c)));
  let o = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let m = e.computeStyle(l, d, i);
      u.set(d, m), (!m || m.length == 0) && ((l[pn] = vO), o.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => Nw(c, s[a++])), o;
}
function xw(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    s = new Map();
  function o(a) {
    if (!a) return r;
    let c = s.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = o(l)), s.set(a, c), c;
  }
  return (
    e.forEach((a) => {
      let c = o(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function en(t, e) {
  t.classList?.add(e);
}
function Ds(t, e) {
  t.classList?.remove(e);
}
function DO(t, e, n) {
  Br(n).onDone(() => t.processLeaveNode(e));
}
function _O(t) {
  let e = [];
  return $w(t, e), e;
}
function $w(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof qo ? $w(r.players, e) : e.push(r);
  }
}
function TO(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let s = n[i];
    if (!e.hasOwnProperty(s) || t[s] !== e[s]) return !1;
  }
  return !0;
}
function Rw(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((s) => i.add(s)) : e.set(t, r), n.delete(t), !0;
}
var Ts = class {
  constructor(e, n, r, i) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (s, o) => {}),
      (this._transitionEngine = new lm(e.body, n, r, i)),
      (this._timelineEngine = new am(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (s, o) =>
        this.onRemovalComplete(s, o));
  }
  registerTrigger(e, n, r, i, s) {
    let o = e + "-" + i,
      a = this._triggerCache[o];
    if (!a) {
      let c = [],
        l = [],
        u = Hw(this._driver, s, c, l);
      if (c.length) throw TR(i, c);
      l.length && void 0,
        (a = uO(i, u, this._normalizer)),
        (this._triggerCache[o] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(e, n) {
    this._transitionEngine.register(e, n);
  }
  destroy(e, n) {
    this._transitionEngine.destroy(e, n);
  }
  onInsert(e, n, r, i) {
    this._transitionEngine.insertNode(e, n, r, i);
  }
  onRemove(e, n, r) {
    this._transitionEngine.removeNode(e, n, r);
  }
  disableAnimations(e, n) {
    this._transitionEngine.markElementAsDisabled(e, n);
  }
  process(e, n, r, i) {
    if (r.charAt(0) == "@") {
      let [s, o] = bw(r),
        a = i;
      this._timelineEngine.command(s, n, o, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, s) {
    if (r.charAt(0) == "@") {
      let [o, a] = bw(r);
      return this._timelineEngine.listen(o, n, a, s);
    }
    return this._transitionEngine.listen(e, n, r, i, s);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function SO(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = Kp(e[0])), e.length > 1 && (r = Kp(e[e.length - 1])))
      : e instanceof Map && (n = Kp(e)),
    n || r ? new um(t, n, r) : null
  );
}
var _s = class _s {
  constructor(e, n, r) {
    (this._element = e),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = _s.initialStylesByElement.get(e);
    i || _s.initialStylesByElement.set(e, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        xn(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (xn(this._element, this._initialStyles),
        this._endStyles &&
          (xn(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (_s.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (Si(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (Si(this._element, this._endStyles), (this._endStyles = null)),
        xn(this._element, this._initialStyles),
        (this._state = 3));
  }
};
_s.initialStylesByElement = new WeakMap();
var um = _s;
function Kp(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      CO(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function CO(t) {
  return t === "display" || t === "position";
}
var hu = class {
    constructor(e, n, r, i) {
      (this.element = e),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options,
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener("finish", n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let n = [];
      return (
        e.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(e, n, r) {
      return e.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== "offset" && e.set(i, this._finished ? r : ym(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  pu = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, n) {
      return !1;
    }
    containsElement(e, n) {
      return kw(e, n);
    }
    getParentElement(e) {
      return pm(e);
    }
    query(e, n, r) {
      return Lw(e, n, r);
    }
    computeStyle(e, n, r) {
      return ym(e, n);
    }
    animate(e, n, r, i, s, o = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      s && (c.easing = s);
      let l = new Map(),
        u = o.filter((E) => E instanceof hu);
      GR(r, i) &&
        u.forEach((E) => {
          E.currentSnapshot.forEach((C, M) => l.set(M, C));
        });
      let d = qR(n).map((E) => new Map(E));
      d = WR(e, d, l);
      let m = SO(e, d);
      return new hu(e, d, c, m);
    }
  };
var su = "@",
  zw = "@.disabled",
  mu = class {
    constructor(e, n, r, i) {
      (this.namespaceId = e),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, n) {
      return this.delegate.createElement(e, n);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, n) {
      this.delegate.appendChild(e, n),
        this.engine.onInsert(this.namespaceId, n, e, !1);
    }
    insertBefore(e, n, r, i = !0) {
      this.delegate.insertBefore(e, n, r),
        this.engine.onInsert(this.namespaceId, n, e, i);
    }
    removeChild(e, n, r) {
      this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(e, n) {
      return this.delegate.selectRootElement(e, n);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, n, r, i) {
      this.delegate.setAttribute(e, n, r, i);
    }
    removeAttribute(e, n, r) {
      this.delegate.removeAttribute(e, n, r);
    }
    addClass(e, n) {
      this.delegate.addClass(e, n);
    }
    removeClass(e, n) {
      this.delegate.removeClass(e, n);
    }
    setStyle(e, n, r, i) {
      this.delegate.setStyle(e, n, r, i);
    }
    removeStyle(e, n, r) {
      this.delegate.removeStyle(e, n, r);
    }
    setProperty(e, n, r) {
      n.charAt(0) == su && n == zw
        ? this.disableAnimations(e, !!r)
        : this.delegate.setProperty(e, n, r);
    }
    setValue(e, n) {
      this.delegate.setValue(e, n);
    }
    listen(e, n, r) {
      return this.delegate.listen(e, n, r);
    }
    disableAnimations(e, n) {
      this.engine.disableAnimations(e, n);
    }
  },
  dm = class extends mu {
    constructor(e, n, r, i, s) {
      super(n, r, i, s), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == su
        ? n.charAt(1) == "." && n == zw
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == su) {
        let i = IO(e),
          s = n.slice(1),
          o = "";
        return (
          s.charAt(0) != su && ([s, o] = MO(s)),
          this.engine.listen(this.namespaceId, i, s, o, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function IO(t) {
  switch (t) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return t;
  }
}
function MO(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var gu = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, s) => {
        let o = s?.parentNode(i);
        o && s.removeChild(o, i);
      });
  }
  createRenderer(e, n) {
    let r = "",
      i = this.delegate.createRenderer(e, n);
    if (!e || !n?.data?.animation) {
      let l = this._rendererCache,
        u = l.get(i);
      if (!u) {
        let d = () => l.delete(i);
        (u = new mu(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let s = n.id,
      o = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(o, e);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(s, o, e, l.name, l);
    };
    return n.data.animation.forEach(a), new dm(this, o, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, n, r) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((s) => {
            let [o, a] = s;
            o(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var xO = (() => {
  let e = class e extends Ts {
    constructor(r, i, s) {
      super(r, i, s, G(yo, { optional: !0 }));
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(ie(ze), ie(Ci), ie(Ii));
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function RO() {
  return new cu();
}
function OO(t, e, n) {
  return new gu(t, e, n);
}
var Gw = [
    { provide: Ii, useFactory: RO },
    { provide: Ts, useClass: xO },
    { provide: mi, useFactory: OO, deps: [Xl, Ts, $e] },
  ],
  kO = [
    { provide: Ci, useFactory: () => new pu() },
    { provide: Uh, useValue: "BrowserAnimations" },
    ...Gw,
  ],
  LO = [
    { provide: Ci, useClass: mm },
    { provide: Uh, useValue: "NoopAnimations" },
    ...Gw,
  ];
function x4() {
  return Mn("NgEagerAnimations"), [...kO];
}
function Ww() {
  return [...LO];
}
var PO = Object.getOwnPropertyNames,
  ae = (t, e) =>
    function () {
      return e || (0, t[PO(t)[0]])((e = { exports: {} }).exports, e), e.exports;
    },
  Yo = ae({
    "external/npm/node_modules/domino/lib/Event.js"(t, e) {
      "use strict";
      (e.exports = n),
        (n.CAPTURING_PHASE = 1),
        (n.AT_TARGET = 2),
        (n.BUBBLING_PHASE = 3);
      function n(r, i) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = n.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          r && (this.type = r),
          i)
        )
          for (var s in i) this[s] = i[s];
      }
      n.prototype = Object.create(Object.prototype, {
        constructor: { value: n },
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
          value: function (i, s, o) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = i),
                (this.bubbles = s),
                (this.cancelable = o));
          },
        },
      });
    },
  }),
  Qw = ae({
    "external/npm/node_modules/domino/lib/UIEvent.js"(t, e) {
      "use strict";
      var n = Yo();
      e.exports = r;
      function r() {
        n.call(this), (this.view = null), (this.detail = 0);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initUIEvent: {
          value: function (i, s, o, a, c) {
            this.initEvent(i, s, o), (this.view = a), (this.detail = c);
          },
        },
      });
    },
  }),
  Kw = ae({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(t, e) {
      "use strict";
      var n = Qw();
      e.exports = r;
      function r() {
        n.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initMouseEvent: {
          value: function (i, s, o, a, c, l, u, d, m, E, C, M, P, A, _) {
            switch (
              (this.initEvent(i, s, o, a, c),
              (this.screenX = l),
              (this.screenY = u),
              (this.clientX = d),
              (this.clientY = m),
              (this.ctrlKey = E),
              (this.altKey = C),
              (this.shiftKey = M),
              (this.metaKey = P),
              (this.button = A),
              A)
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
            this.relatedTarget = _;
          },
        },
        getModifierState: {
          value: function (i) {
            switch (i) {
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
  Dm = ae({
    "external/npm/node_modules/domino/lib/DOMException.js"(t, e) {
      "use strict";
      e.exports = O;
      var n = 1,
        r = 3,
        i = 4,
        s = 5,
        o = 7,
        a = 8,
        c = 9,
        l = 11,
        u = 12,
        d = 13,
        m = 14,
        E = 15,
        C = 17,
        M = 18,
        P = 19,
        A = 20,
        _ = 21,
        w = 22,
        T = 23,
        b = 24,
        J = 25,
        ne = [
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
        ve = [
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
        z = {
          INDEX_SIZE_ERR: n,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: r,
          WRONG_DOCUMENT_ERR: i,
          INVALID_CHARACTER_ERR: s,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: o,
          NOT_FOUND_ERR: a,
          NOT_SUPPORTED_ERR: c,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: l,
          SYNTAX_ERR: u,
          INVALID_MODIFICATION_ERR: d,
          NAMESPACE_ERR: m,
          INVALID_ACCESS_ERR: E,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: C,
          SECURITY_ERR: M,
          NETWORK_ERR: P,
          ABORT_ERR: A,
          URL_MISMATCH_ERR: _,
          QUOTA_EXCEEDED_ERR: w,
          TIMEOUT_ERR: T,
          INVALID_NODE_TYPE_ERR: b,
          DATA_CLONE_ERR: J,
        };
      function O(v) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = v),
          (this.message = ve[v]),
          (this.name = ne[v]);
      }
      O.prototype.__proto__ = Error.prototype;
      for (Y in z)
        (j = { value: z[Y] }),
          Object.defineProperty(O, Y, j),
          Object.defineProperty(O.prototype, Y, j);
      var j, Y;
    },
  }),
  _m = ae({
    "external/npm/node_modules/domino/lib/config.js"(t) {
      t.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  ot = ae({
    "external/npm/node_modules/domino/lib/utils.js"(t) {
      "use strict";
      var e = Dm(),
        n = e,
        r = _m().isApiWritable;
      (t.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (t.IndexSizeError = function () {
          throw new e(n.INDEX_SIZE_ERR);
        }),
        (t.HierarchyRequestError = function () {
          throw new e(n.HIERARCHY_REQUEST_ERR);
        }),
        (t.WrongDocumentError = function () {
          throw new e(n.WRONG_DOCUMENT_ERR);
        }),
        (t.InvalidCharacterError = function () {
          throw new e(n.INVALID_CHARACTER_ERR);
        }),
        (t.NoModificationAllowedError = function () {
          throw new e(n.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (t.NotFoundError = function () {
          throw new e(n.NOT_FOUND_ERR);
        }),
        (t.NotSupportedError = function () {
          throw new e(n.NOT_SUPPORTED_ERR);
        }),
        (t.InvalidStateError = function () {
          throw new e(n.INVALID_STATE_ERR);
        }),
        (t.SyntaxError = function () {
          throw new e(n.SYNTAX_ERR);
        }),
        (t.InvalidModificationError = function () {
          throw new e(n.INVALID_MODIFICATION_ERR);
        }),
        (t.NamespaceError = function () {
          throw new e(n.NAMESPACE_ERR);
        }),
        (t.InvalidAccessError = function () {
          throw new e(n.INVALID_ACCESS_ERR);
        }),
        (t.TypeMismatchError = function () {
          throw new e(n.TYPE_MISMATCH_ERR);
        }),
        (t.SecurityError = function () {
          throw new e(n.SECURITY_ERR);
        }),
        (t.NetworkError = function () {
          throw new e(n.NETWORK_ERR);
        }),
        (t.AbortError = function () {
          throw new e(n.ABORT_ERR);
        }),
        (t.UrlMismatchError = function () {
          throw new e(n.URL_MISMATCH_ERR);
        }),
        (t.QuotaExceededError = function () {
          throw new e(n.QUOTA_EXCEEDED_ERR);
        }),
        (t.TimeoutError = function () {
          throw new e(n.TIMEOUT_ERR);
        }),
        (t.InvalidNodeTypeError = function () {
          throw new e(n.INVALID_NODE_TYPE_ERR);
        }),
        (t.DataCloneError = function () {
          throw new e(n.DATA_CLONE_ERR);
        }),
        (t.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (t.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass.",
          );
        }),
        (t.assert = function (i, s) {
          if (!i)
            throw new Error(
              "Assertion failed: " +
                (s || "") +
                `
` +
                new Error().stack,
            );
        }),
        (t.expose = function (i, s) {
          for (var o in i)
            Object.defineProperty(s.prototype, o, { value: i[o], writable: r });
        }),
        (t.merge = function (i, s) {
          for (var o in s) i[o] = s[o];
        }),
        (t.documentOrder = function (i, s) {
          return 3 - (i.compareDocumentPosition(s) & 6);
        }),
        (t.toASCIILowerCase = function (i) {
          return i.replace(/[A-Z]+/g, function (s) {
            return s.toLowerCase();
          });
        }),
        (t.toASCIIUpperCase = function (i) {
          return i.replace(/[a-z]+/g, function (s) {
            return s.toUpperCase();
          });
        });
    },
  }),
  Yw = ae({
    "external/npm/node_modules/domino/lib/EventTarget.js"(t, e) {
      "use strict";
      var n = Yo(),
        r = Kw(),
        i = ot();
      e.exports = s;
      function s() {}
      s.prototype = {
        addEventListener: function (a, c, l) {
          if (c) {
            l === void 0 && (l = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[a] || (this._listeners[a] = []);
            for (var u = this._listeners[a], d = 0, m = u.length; d < m; d++) {
              var E = u[d];
              if (E.listener === c && E.capture === l) return;
            }
            var C = { listener: c, capture: l };
            typeof c == "function" && (C.f = c), u.push(C);
          }
        },
        removeEventListener: function (a, c, l) {
          if ((l === void 0 && (l = !1), this._listeners)) {
            var u = this._listeners[a];
            if (u)
              for (var d = 0, m = u.length; d < m; d++) {
                var E = u[d];
                if (E.listener === c && E.capture === l) {
                  u.length === 1
                    ? (this._listeners[a] = void 0)
                    : u.splice(d, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (a) {
          return this._dispatchEvent(a, !1);
        },
        _dispatchEvent: function (a, c) {
          typeof c != "boolean" && (c = !1);
          function l(M, P) {
            var A = P.type,
              _ = P.eventPhase;
            if (
              ((P.currentTarget = M),
              _ !== n.CAPTURING_PHASE && M._handlers && M._handlers[A])
            ) {
              var w = M._handlers[A],
                T;
              if (typeof w == "function") T = w.call(P.currentTarget, P);
              else {
                var b = w.handleEvent;
                if (typeof b != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function.",
                  );
                T = b.call(w, P);
              }
              switch (P.type) {
                case "mouseover":
                  T === !0 && P.preventDefault();
                  break;
                case "beforeunload":
                default:
                  T === !1 && P.preventDefault();
                  break;
              }
            }
            var J = M._listeners && M._listeners[A];
            if (J) {
              J = J.slice();
              for (var ne = 0, ve = J.length; ne < ve; ne++) {
                if (P._immediatePropagationStopped) return;
                var z = J[ne];
                if (
                  !(
                    (_ === n.CAPTURING_PHASE && !z.capture) ||
                    (_ === n.BUBBLING_PHASE && z.capture)
                  )
                )
                  if (z.f) z.f.call(P.currentTarget, P);
                  else {
                    var O = z.listener.handleEvent;
                    if (typeof O != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function.",
                      );
                    O.call(z.listener, P);
                  }
              }
            }
          }
          (!a._initialized || a._dispatching) && i.InvalidStateError(),
            (a.isTrusted = c),
            (a._dispatching = !0),
            (a.target = this);
          for (var u = [], d = this.parentNode; d; d = d.parentNode) u.push(d);
          a.eventPhase = n.CAPTURING_PHASE;
          for (
            var m = u.length - 1;
            m >= 0 && (l(u[m], a), !a._propagationStopped);
            m--
          );
          if (
            (a._propagationStopped ||
              ((a.eventPhase = n.AT_TARGET), l(this, a)),
            a.bubbles && !a._propagationStopped)
          ) {
            a.eventPhase = n.BUBBLING_PHASE;
            for (
              var E = 0, C = u.length;
              E < C && (l(u[E], a), !a._propagationStopped);
              E++
            );
          }
          if (
            ((a._dispatching = !1),
            (a.eventPhase = n.AT_TARGET),
            (a.currentTarget = null),
            c && !a.defaultPrevented && a instanceof r)
          )
            switch (a.type) {
              case "mousedown":
                this._armed = { x: a.clientX, y: a.clientY, t: a.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(a) && this._doClick(a), (this._armed = null);
                break;
            }
          return !a.defaultPrevented;
        },
        _isClick: function (o) {
          return (
            this._armed !== null &&
            o.type === "mouseup" &&
            o.isTrusted &&
            o.button === 0 &&
            o.timeStamp - this._armed.t < 1e3 &&
            Math.abs(o.clientX - this._armed.x) < 10 &&
            Math.abs(o.clientY - this._armed.Y) < 10
          );
        },
        _doClick: function (o) {
          if (!this._click_in_progress) {
            this._click_in_progress = !0;
            for (var a = this; a && !a._post_click_activation_steps; )
              a = a.parentNode;
            a &&
              a._pre_click_activation_steps &&
              a._pre_click_activation_steps();
            var c = this.ownerDocument.createEvent("MouseEvent");
            c.initMouseEvent(
              "click",
              !0,
              !0,
              this.ownerDocument.defaultView,
              1,
              o.screenX,
              o.screenY,
              o.clientX,
              o.clientY,
              o.ctrlKey,
              o.altKey,
              o.shiftKey,
              o.metaKey,
              o.button,
              null,
            );
            var l = this._dispatchEvent(c, !0);
            a &&
              (l
                ? a._post_click_activation_steps &&
                  a._post_click_activation_steps(c)
                : a._cancelled_activation_steps &&
                  a._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (a, c) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[a] = c);
        },
        _getEventHandler: function (a) {
          return (this._handlers && this._handlers[a]) || null;
        },
      };
    },
  }),
  Zw = ae({
    "external/npm/node_modules/domino/lib/LinkedList.js"(t, e) {
      "use strict";
      var n = ot(),
        r = (e.exports = {
          valid: function (i) {
            return (
              n.assert(i, "list falsy"),
              n.assert(i._previousSibling, "previous falsy"),
              n.assert(i._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (i, s) {
            n.assert(r.valid(i) && r.valid(s));
            var o = i,
              a = i._previousSibling,
              c = s,
              l = s._previousSibling;
            (o._previousSibling = l),
              (a._nextSibling = c),
              (l._nextSibling = o),
              (c._previousSibling = a),
              n.assert(r.valid(i) && r.valid(s));
          },
          replace: function (i, s) {
            n.assert(r.valid(i) && (s === null || r.valid(s))),
              s !== null && r.insertBefore(s, i),
              r.remove(i),
              n.assert(r.valid(i) && (s === null || r.valid(s)));
          },
          remove: function (i) {
            n.assert(r.valid(i));
            var s = i._previousSibling;
            if (s !== i) {
              var o = i._nextSibling;
              (s._nextSibling = o),
                (o._previousSibling = s),
                (i._previousSibling = i._nextSibling = i),
                n.assert(r.valid(i));
            }
          },
        });
    },
  }),
  Xw = ae({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(t, e) {
      "use strict";
      e.exports = {
        serializeOne: P,
        ɵescapeMatchingClosingTag: m,
        ɵescapeClosingCommentTag: C,
        ɵescapeProcessingInstructionContent: M,
      };
      var n = ot(),
        r = n.NAMESPACE,
        i = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        s = {
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
        o = {},
        a = /[&<>\u00A0]/g,
        c = /[&"<>\u00A0]/g;
      function l(A) {
        return a.test(A)
          ? A.replace(a, (_) => {
              switch (_) {
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
          : A;
      }
      function u(A) {
        return c.test(A)
          ? A.replace(c, (_) => {
              switch (_) {
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
          : A;
      }
      function d(A) {
        var _ = A.namespaceURI;
        return _
          ? _ === r.XML
            ? "xml:" + A.localName
            : _ === r.XLINK
              ? "xlink:" + A.localName
              : _ === r.XMLNS
                ? A.localName === "xmlns"
                  ? "xmlns"
                  : "xmlns:" + A.localName
                : A.name
          : A.localName;
      }
      function m(A, _) {
        let w = "</" + _;
        if (!A.toLowerCase().includes(w)) return A;
        let T = [...A],
          b = A.matchAll(new RegExp(w, "ig"));
        for (let J of b) T[J.index] = "&lt;";
        return T.join("");
      }
      var E = /--!?>/;
      function C(A) {
        return E.test(A) ? A.replace(/(--\!?)>/g, "$1&gt;") : A;
      }
      function M(A) {
        return A.includes(">") ? A.replaceAll(">", "&gt;") : A;
      }
      function P(A, _) {
        var w = "";
        switch (A.nodeType) {
          case 1:
            var T = A.namespaceURI,
              b = T === r.HTML,
              J = b || T === r.SVG || T === r.MATHML ? A.localName : A.tagName;
            w += "<" + J;
            for (var ne = 0, ve = A._numattrs; ne < ve; ne++) {
              var z = A._attr(ne);
              (w += " " + d(z)),
                z.value !== void 0 && (w += '="' + u(z.value) + '"');
            }
            if (((w += ">"), !(b && s[J]))) {
              var O = A.serialize();
              i[J.toUpperCase()] && (O = m(O, J)),
                b &&
                  o[J] &&
                  O.charAt(0) ===
                    `
` &&
                  (w += `
`),
                (w += O),
                (w += "</" + J + ">");
            }
            break;
          case 3:
          case 4:
            var j;
            _.nodeType === 1 && _.namespaceURI === r.HTML
              ? (j = _.tagName)
              : (j = ""),
              i[j] || (j === "NOSCRIPT" && _.ownerDocument._scripting_enabled)
                ? (w += A.data)
                : (w += l(A.data));
            break;
          case 8:
            w += "<!--" + C(A.data) + "-->";
            break;
          case 7:
            let Y = M(A.data);
            w += "<?" + A.target + " " + Y + "?>";
            break;
          case 10:
            (w += "<!DOCTYPE " + A.name), (w += ">");
            break;
          default:
            n.InvalidStateError();
        }
        return w;
      }
    },
  }),
  bt = ae({
    "external/npm/node_modules/domino/lib/Node.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = Yw(),
        r = Zw(),
        i = Xw(),
        s = ot();
      function o() {
        n.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var a = (o.ELEMENT_NODE = 1),
        c = (o.ATTRIBUTE_NODE = 2),
        l = (o.TEXT_NODE = 3),
        u = (o.CDATA_SECTION_NODE = 4),
        d = (o.ENTITY_REFERENCE_NODE = 5),
        m = (o.ENTITY_NODE = 6),
        E = (o.PROCESSING_INSTRUCTION_NODE = 7),
        C = (o.COMMENT_NODE = 8),
        M = (o.DOCUMENT_NODE = 9),
        P = (o.DOCUMENT_TYPE_NODE = 10),
        A = (o.DOCUMENT_FRAGMENT_NODE = 11),
        _ = (o.NOTATION_NODE = 12),
        w = (o.DOCUMENT_POSITION_DISCONNECTED = 1),
        T = (o.DOCUMENT_POSITION_PRECEDING = 2),
        b = (o.DOCUMENT_POSITION_FOLLOWING = 4),
        J = (o.DOCUMENT_POSITION_CONTAINS = 8),
        ne = (o.DOCUMENT_POSITION_CONTAINED_BY = 16),
        ve = (o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      o.prototype = Object.create(n.prototype, {
        baseURI: { get: s.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === a
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: s.shouldOverride },
        firstChild: { get: s.shouldOverride },
        lastChild: { get: s.shouldOverride },
        isConnected: {
          get: function () {
            let z = this;
            for (; z != null; ) {
              if (z.nodeType === o.DOCUMENT_NODE) return !0;
              (z = z.parentNode),
                z != null &&
                  z.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (z = z.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var z = this.parentNode;
            return !z || this === z.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var z = this.parentNode,
              O = this._nextSibling;
            return !z || O === z.firstChild ? null : O;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (z) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (z) {},
        },
        _countChildrenOfType: {
          value: function (z) {
            for (var O = 0, j = this.firstChild; j !== null; j = j.nextSibling)
              j.nodeType === z && O++;
            return O;
          },
        },
        _ensureInsertValid: {
          value: function (O, j, Y) {
            var v = this,
              g,
              p;
            if (!O.nodeType) throw new TypeError("not a node");
            switch (v.nodeType) {
              case M:
              case A:
              case a:
                break;
              default:
                s.HierarchyRequestError();
            }
            switch (
              (O.isAncestor(v) && s.HierarchyRequestError(),
              (j !== null || !Y) && j.parentNode !== v && s.NotFoundError(),
              O.nodeType)
            ) {
              case A:
              case P:
              case a:
              case l:
              case E:
              case C:
                break;
              default:
                s.HierarchyRequestError();
            }
            if (v.nodeType === M)
              switch (O.nodeType) {
                case l:
                  s.HierarchyRequestError();
                  break;
                case A:
                  switch (
                    (O._countChildrenOfType(l) > 0 && s.HierarchyRequestError(),
                    O._countChildrenOfType(a))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (j !== null)
                        for (
                          Y && j.nodeType === P && s.HierarchyRequestError(),
                            p = j.nextSibling;
                          p !== null;
                          p = p.nextSibling
                        )
                          p.nodeType === P && s.HierarchyRequestError();
                      (g = v._countChildrenOfType(a)),
                        Y
                          ? g > 0 && s.HierarchyRequestError()
                          : (g > 1 || (g === 1 && j.nodeType !== a)) &&
                            s.HierarchyRequestError();
                      break;
                    default:
                      s.HierarchyRequestError();
                  }
                  break;
                case a:
                  if (j !== null)
                    for (
                      Y && j.nodeType === P && s.HierarchyRequestError(),
                        p = j.nextSibling;
                      p !== null;
                      p = p.nextSibling
                    )
                      p.nodeType === P && s.HierarchyRequestError();
                  (g = v._countChildrenOfType(a)),
                    Y
                      ? g > 0 && s.HierarchyRequestError()
                      : (g > 1 || (g === 1 && j.nodeType !== a)) &&
                        s.HierarchyRequestError();
                  break;
                case P:
                  if (j === null)
                    v._countChildrenOfType(a) && s.HierarchyRequestError();
                  else
                    for (
                      p = v.firstChild;
                      p !== null && p !== j;
                      p = p.nextSibling
                    )
                      p.nodeType === a && s.HierarchyRequestError();
                  (g = v._countChildrenOfType(P)),
                    Y
                      ? g > 0 && s.HierarchyRequestError()
                      : (g > 1 || (g === 1 && j.nodeType !== P)) &&
                        s.HierarchyRequestError();
                  break;
              }
            else O.nodeType === P && s.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (O, j) {
            var Y = this;
            Y._ensureInsertValid(O, j, !0);
            var v = j;
            return (
              v === O && (v = O.nextSibling),
              Y.doc.adoptNode(O),
              O._insertOrReplace(Y, v, !1),
              O
            );
          },
        },
        appendChild: {
          value: function (z) {
            return this.insertBefore(z, null);
          },
        },
        _appendChild: {
          value: function (z) {
            z._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (O) {
            var j = this;
            if (!O.nodeType) throw new TypeError("not a node");
            return O.parentNode !== j && s.NotFoundError(), O.remove(), O;
          },
        },
        replaceChild: {
          value: function (O, j) {
            var Y = this;
            return (
              Y._ensureInsertValid(O, j, !1),
              O.doc !== Y.doc && Y.doc.adoptNode(O),
              O._insertOrReplace(Y, j, !0),
              j
            );
          },
        },
        contains: {
          value: function (O) {
            return O === null
              ? !1
              : this === O
                ? !0
                : (this.compareDocumentPosition(O) & ne) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (O) {
            if (this === O) return 0;
            if (this.doc !== O.doc || this.rooted !== O.rooted) return w + ve;
            for (var j = [], Y = [], v = this; v !== null; v = v.parentNode)
              j.push(v);
            for (v = O; v !== null; v = v.parentNode) Y.push(v);
            if ((j.reverse(), Y.reverse(), j[0] !== Y[0])) return w + ve;
            v = Math.min(j.length, Y.length);
            for (var g = 1; g < v; g++)
              if (j[g] !== Y[g]) return j[g].index < Y[g].index ? b : T;
            return j.length < Y.length ? b + ne : T + J;
          },
        },
        isSameNode: {
          value: function (O) {
            return this === O;
          },
        },
        isEqualNode: {
          value: function (O) {
            if (!O || O.nodeType !== this.nodeType || !this.isEqual(O))
              return !1;
            for (
              var j = this.firstChild, Y = O.firstChild;
              j && Y;
              j = j.nextSibling, Y = Y.nextSibling
            )
              if (!j.isEqualNode(Y)) return !1;
            return j === null && Y === null;
          },
        },
        cloneNode: {
          value: function (z) {
            var O = this.clone();
            if (z)
              for (var j = this.firstChild; j !== null; j = j.nextSibling)
                O._appendChild(j.cloneNode(!0));
            return O;
          },
        },
        lookupPrefix: {
          value: function (O) {
            var j;
            if (O === "" || O === null || O === void 0) return null;
            switch (this.nodeType) {
              case a:
                return this._lookupNamespacePrefix(O, this);
              case M:
                return (j = this.documentElement), j ? j.lookupPrefix(O) : null;
              case m:
              case _:
              case A:
              case P:
                return null;
              case c:
                return (j = this.ownerElement), j ? j.lookupPrefix(O) : null;
              default:
                return (j = this.parentElement), j ? j.lookupPrefix(O) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j;
            switch (this.nodeType) {
              case a:
                return s.shouldOverride();
              case M:
                return (
                  (j = this.documentElement), j ? j.lookupNamespaceURI(O) : null
                );
              case m:
              case _:
              case P:
              case A:
                return null;
              case c:
                return (
                  (j = this.ownerElement), j ? j.lookupNamespaceURI(O) : null
                );
              default:
                return (
                  (j = this.parentElement), j ? j.lookupNamespaceURI(O) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (O) {
            (O === "" || O === void 0) && (O = null);
            var j = this.lookupNamespaceURI(null);
            return j === O;
          },
        },
        index: {
          get: function () {
            var z = this.parentNode;
            if (this === z.firstChild) return 0;
            var O = z.childNodes;
            if (this._index === void 0 || O[this._index] !== this) {
              for (var j = 0; j < O.length; j++) O[j]._index = j;
              s.assert(O[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (z) {
            if (this.doc !== z.doc || this.rooted !== z.rooted) return !1;
            for (var O = z; O; O = O.parentNode) if (O === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (z) {
            z.ownerDocument === null
              ? (z.ownerDocument = this.doc)
              : z.ownerDocument !== this.doc && s.WrongDocumentError();
          },
        },
        removeChildren: { value: s.shouldOverride },
        _insertOrReplace: {
          value: function (O, j, Y) {
            var v = this,
              g,
              p;
            if (
              (v.nodeType === A && v.rooted && s.HierarchyRequestError(),
              O._childNodes &&
                ((g = j === null ? O._childNodes.length : j.index),
                v.parentNode === O))
            ) {
              var y = v.index;
              y < g && g--;
            }
            Y && (j.rooted && j.doc.mutateRemove(j), (j.parentNode = null));
            var I = j;
            I === null && (I = O.firstChild);
            var R = v.rooted && O.rooted;
            if (v.nodeType === A) {
              for (
                var V = [0, Y ? 1 : 0], K, ge = v.firstChild;
                ge !== null;
                ge = K
              )
                (K = ge.nextSibling), V.push(ge), (ge.parentNode = O);
              var S = V.length;
              if (
                (Y
                  ? r.replace(I, S > 2 ? V[2] : null)
                  : S > 2 && I !== null && r.insertBefore(V[2], I),
                O._childNodes)
              )
                for (
                  V[0] = j === null ? O._childNodes.length : j._index,
                    O._childNodes.splice.apply(O._childNodes, V),
                    p = 2;
                  p < S;
                  p++
                )
                  V[p]._index = V[0] + (p - 2);
              else
                O._firstChild === j &&
                  (S > 2
                    ? (O._firstChild = V[2])
                    : Y && (O._firstChild = null));
              if (
                (v._childNodes
                  ? (v._childNodes.length = 0)
                  : (v._firstChild = null),
                O.rooted)
              )
                for (O.modify(), p = 2; p < S; p++) O.doc.mutateInsert(V[p]);
            } else {
              if (j === v) return;
              R ? v._remove() : v.parentNode && v.remove(),
                (v.parentNode = O),
                Y
                  ? (r.replace(I, v),
                    O._childNodes
                      ? ((v._index = g), (O._childNodes[g] = v))
                      : O._firstChild === j && (O._firstChild = v))
                  : (I !== null && r.insertBefore(v, I),
                    O._childNodes
                      ? ((v._index = g), O._childNodes.splice(g, 0, v))
                      : O._firstChild === j && (O._firstChild = v)),
                R
                  ? (O.modify(), O.doc.mutateMove(v))
                  : O.rooted && (O.modify(), O.doc.mutateInsert(v));
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
                var z = ++this.doc.modclock, O = this;
                O;
                O = O.parentElement
              )
                O._lastModTime && (O._lastModTime = z);
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
            for (var z, O = this.firstChild; O !== null; O = z)
              if (
                ((z = O.nextSibling),
                O.normalize && O.normalize(),
                O.nodeType === o.TEXT_NODE)
              ) {
                if (O.nodeValue === "") {
                  this.removeChild(O);
                  continue;
                }
                var j = O.previousSibling;
                j !== null &&
                  j.nodeType === o.TEXT_NODE &&
                  (j.appendData(O.nodeValue), this.removeChild(O));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var z = "", O = this.firstChild; O !== null; O = O.nextSibling)
              z += i.serializeOne(O, this);
            return z;
          },
        },
        outerHTML: {
          get: function () {
            return i.serializeOne(this, { nodeType: 0 });
          },
          set: s.nyi,
        },
        ELEMENT_NODE: { value: a },
        ATTRIBUTE_NODE: { value: c },
        TEXT_NODE: { value: l },
        CDATA_SECTION_NODE: { value: u },
        ENTITY_REFERENCE_NODE: { value: d },
        ENTITY_NODE: { value: m },
        PROCESSING_INSTRUCTION_NODE: { value: E },
        COMMENT_NODE: { value: C },
        DOCUMENT_NODE: { value: M },
        DOCUMENT_TYPE_NODE: { value: P },
        DOCUMENT_FRAGMENT_NODE: { value: A },
        NOTATION_NODE: { value: _ },
        DOCUMENT_POSITION_DISCONNECTED: { value: w },
        DOCUMENT_POSITION_PRECEDING: { value: T },
        DOCUMENT_POSITION_FOLLOWING: { value: b },
        DOCUMENT_POSITION_CONTAINS: { value: J },
        DOCUMENT_POSITION_CONTAINED_BY: { value: ne },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: ve },
      });
    },
  }),
  FO = ae({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(t, e) {
      "use strict";
      e.exports = class extends Array {
        constructor(r) {
          if ((super((r && r.length) || 0), r)) for (var i in r) this[i] = r[i];
        }
        item(r) {
          return this[r] || null;
        }
      };
    },
  }),
  jO = ae({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(t, e) {
      "use strict";
      function n(i) {
        return this[i] || null;
      }
      function r(i) {
        return i || (i = []), (i.item = n), i;
      }
      e.exports = r;
    },
  }),
  Ss = ae({
    "external/npm/node_modules/domino/lib/NodeList.js"(t, e) {
      "use strict";
      var n;
      try {
        n = FO();
      } catch {
        n = jO();
      }
      e.exports = n;
    },
  }),
  Tm = ae({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = bt(),
        r = Ss();
      function i() {
        n.call(this), (this._firstChild = this._childNodes = null);
      }
      i.prototype = Object.create(n.prototype, {
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
            var s = this._childNodes,
              o;
            return s
              ? s.length === 0
                ? null
                : s[s.length - 1]
              : ((o = this._firstChild),
                o === null ? null : o._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var s = this._firstChild,
                o = s,
                a = (this._childNodes = new r());
              if (s)
                do a.push(o), (o = o._nextSibling);
                while (o !== s);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var o = this.rooted ? this.ownerDocument : null,
                a = this.firstChild,
                c;
              a !== null;

            )
              (c = a),
                (a = c.nextSibling),
                o && o.mutateRemove(c),
                (c.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  Sm = ae({
    "external/npm/node_modules/domino/lib/xmlnames.js"(t) {
      "use strict";
      (t.isValidName = M), (t.isValidQName = P);
      var e = /^[_:A-Za-z][-.:\w]+$/,
        n = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        r =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        i =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        s = "[" + r + "][" + i + "]*",
        o = r + ":",
        a = i + ":",
        c = new RegExp("^[" + o + "][" + a + "]*$"),
        l = new RegExp("^(" + s + "|" + s + ":" + s + ")$"),
        u = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        d = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        m = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (r += "\uD800-\u{EFC00}-\uDFFF"),
        (i += "\uD800-\u{EFC00}-\uDFFF"),
        (s = "[" + r + "][" + i + "]*"),
        (o = r + ":"),
        (a = i + ":");
      var E = new RegExp("^[" + o + "][" + a + "]*$"),
        C = new RegExp("^(" + s + "|" + s + ":" + s + ")$");
      function M(A) {
        if (e.test(A) || c.test(A)) return !0;
        if (!u.test(A) || !E.test(A)) return !1;
        var _ = A.match(d),
          w = A.match(m);
        return w !== null && 2 * w.length === _.length;
      }
      function P(A) {
        if (n.test(A) || l.test(A)) return !0;
        if (!u.test(A) || !C.test(A)) return !1;
        var _ = A.match(d),
          w = A.match(m);
        return w !== null && 2 * w.length === _.length;
      }
    },
  }),
  Jw = ae({
    "external/npm/node_modules/domino/lib/attributes.js"(t) {
      "use strict";
      var e = ot();
      t.property = function (r) {
        if (Array.isArray(r.type)) {
          var i = Object.create(null);
          r.type.forEach(function (a) {
            i[a.value || a] = a.alias || a;
          });
          var s = r.missing;
          s === void 0 && (s = null);
          var o = r.invalid;
          return (
            o === void 0 && (o = s),
            {
              get: function () {
                var a = this._getattr(r.name);
                return a === null
                  ? s
                  : ((a = i[a.toLowerCase()]),
                    a !== void 0 ? a : o !== null ? o : a);
              },
              set: function (a) {
                this._setattr(r.name, a);
              },
            }
          );
        } else {
          if (r.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(r.name);
              },
              set: function (a) {
                a ? this._setattr(r.name, "") : this.removeAttribute(r.name);
              },
            };
          if (
            r.type === Number ||
            r.type === "long" ||
            r.type === "unsigned long" ||
            r.type === "limited unsigned long with fallback"
          )
            return n(r);
          if (!r.type || r.type === String)
            return {
              get: function () {
                return this._getattr(r.name) || "";
              },
              set: function (a) {
                r.treatNullAsEmptyString && a === null && (a = ""),
                  this._setattr(r.name, a);
              },
            };
          if (typeof r.type == "function") return r.type(r.name, r);
        }
        throw new Error("Invalid attribute definition");
      };
      function n(r) {
        var i;
        typeof r.default == "function"
          ? (i = r.default)
          : typeof r.default == "number"
            ? (i = function () {
                return r.default;
              })
            : (i = function () {
                e.assert(!1, typeof r.default);
              });
        var s = r.type === "unsigned long",
          o = r.type === "long",
          a = r.type === "limited unsigned long with fallback",
          c = r.min,
          l = r.max,
          u = r.setmin;
        return (
          c === void 0 && (s && (c = 0), o && (c = -2147483648), a && (c = 1)),
          l === void 0 && (s || o || a) && (l = 2147483647),
          {
            get: function () {
              var d = this._getattr(r.name),
                m = r.float ? parseFloat(d) : parseInt(d, 10);
              if (
                d === null ||
                !isFinite(m) ||
                (c !== void 0 && m < c) ||
                (l !== void 0 && m > l)
              )
                return i.call(this);
              if (s || o || a) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(d)) return i.call(this);
                m = m | 0;
              }
              return m;
            },
            set: function (d) {
              r.float || (d = Math.floor(d)),
                u !== void 0 &&
                  d < u &&
                  e.IndexSizeError(r.name + " set to " + d),
                s
                  ? (d = d < 0 || d > 2147483647 ? i.call(this) : d | 0)
                  : a
                    ? (d = d < 1 || d > 2147483647 ? i.call(this) : d | 0)
                    : o &&
                      (d =
                        d < -2147483648 || d > 2147483647
                          ? i.call(this)
                          : d | 0),
                this._setattr(r.name, String(d));
            },
          }
        );
      }
      t.registerChangeHandler = function (r, i, s) {
        var o = r.prototype;
        Object.prototype.hasOwnProperty.call(o, "_attributeChangeHandlers") ||
          (o._attributeChangeHandlers = Object.create(
            o._attributeChangeHandlers || null,
          )),
          (o._attributeChangeHandlers[i] = s);
      };
    },
  }),
  BO = ae({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = bt();
      function r(i, s) {
        (this.root = i),
          (this.filter = s),
          (this.lastModTime = i.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      r.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (i) {
            return (
              this.checkcache(),
              !this.done && i >= this.cache.length && this.traverse(),
              this.cache[i]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var i = this.cache.length - 1; i >= 0; i--) this[i] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (i) {
            i !== void 0 && i++;
            for (var s; (s = this.next()) !== null; )
              if (
                ((this[this.cache.length] = s),
                this.cache.push(s),
                i && this.cache.length === i)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var i =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              s;
            for (
              i.nodeType === n.DOCUMENT_NODE
                ? (s = i.documentElement)
                : (s = i.nextElement(this.root));
              s;

            ) {
              if (this.filter(s)) return s;
              s = s.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  eD = ae({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(t, e) {
      "use strict";
      var n = ot();
      e.exports = r;
      function r(c, l) {
        (this._getString = c),
          (this._setString = l),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(r.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (c) {
            var l = a(this);
            return c < 0 || c >= l.length ? null : l[c];
          },
        },
        contains: {
          value: function (c) {
            c = String(c);
            var l = a(this);
            return l.indexOf(c) > -1;
          },
        },
        add: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]);
              c.indexOf(d) < 0 && c.push(d);
            }
            this._update(c);
          },
        },
        remove: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]),
                m = c.indexOf(d);
              m > -1 && c.splice(m, 1);
            }
            this._update(c);
          },
        },
        toggle: {
          value: function (l, u) {
            return (
              (l = s(l)),
              this.contains(l)
                ? u === void 0 || u === !1
                  ? (this.remove(l), !1)
                  : !0
                : u === void 0 || u === !0
                  ? (this.add(l), !0)
                  : !1
            );
          },
        },
        replace: {
          value: function (l, u) {
            String(u) === "" && n.SyntaxError(), (l = s(l)), (u = s(u));
            var d = a(this),
              m = d.indexOf(l);
            if (m < 0) return !1;
            var E = d.indexOf(u);
            return (
              E < 0
                ? (d[m] = u)
                : m < E
                  ? ((d[m] = u), d.splice(E, 1))
                  : d.splice(m, 1),
              this._update(d),
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
          set: function (c) {
            this._setString(c), this._update();
          },
        },
        _update: {
          value: function (c) {
            c
              ? (i(this, c), this._setString(c.join(" ").trim()))
              : i(this, a(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function i(c, l) {
        var u = c._length,
          d;
        for (c._length = l.length, d = 0; d < l.length; d++) c[d] = l[d];
        for (; d < u; d++) c[d] = void 0;
      }
      function s(c) {
        return (
          (c = String(c)),
          c === "" && n.SyntaxError(),
          /[ \t\r\n\f]/.test(c) && n.InvalidCharacterError(),
          c
        );
      }
      function o(c) {
        for (var l = c._length, u = Array(l), d = 0; d < l; d++) u[d] = c[d];
        return u;
      }
      function a(c) {
        var l = c._getString();
        if (l === c._lastStringValue) return o(c);
        var u = l.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (u === "") return [];
        var d = Object.create(null);
        return u.split(/[ \t\r\n\f]+/g).filter(function (m) {
          var E = "$" + m;
          return d[E] ? !1 : ((d[E] = !0), !0);
        });
      }
    },
  }),
  Cm = ae({
    "external/npm/node_modules/domino/lib/select.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        r = function (v, g) {
          return v.compareDocumentPosition(g);
        },
        i = function (v, g) {
          return r(v, g) & 2 ? 1 : -1;
        },
        s = function (v) {
          for (; (v = v.nextSibling) && v.nodeType !== 1; );
          return v;
        },
        o = function (v) {
          for (; (v = v.previousSibling) && v.nodeType !== 1; );
          return v;
        },
        a = function (v) {
          if ((v = v.firstChild))
            for (; v.nodeType !== 1 && (v = v.nextSibling); );
          return v;
        },
        c = function (v) {
          if ((v = v.lastChild))
            for (; v.nodeType !== 1 && (v = v.previousSibling); );
          return v;
        },
        l = function (v) {
          if (!v.parentNode) return !1;
          var g = v.parentNode.nodeType;
          return g === 1 || g === 9;
        },
        u = function (v) {
          if (!v) return v;
          var g = v[0];
          return g === '"' || g === "'"
            ? (v[v.length - 1] === g ? (v = v.slice(1, -1)) : (v = v.slice(1)),
              v.replace(b.str_escape, function (p) {
                var y = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(p);
                if (!y) return p.slice(1);
                if (y[2]) return "";
                var I = parseInt(y[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(I)
                  : String.fromCharCode(I);
              }))
            : b.ident.test(v)
              ? d(v)
              : v;
        },
        d = function (v) {
          return v.replace(b.escape, function (g) {
            var p = /^\\([0-9A-Fa-f]+)/.exec(g);
            if (!p) return g[1];
            var y = parseInt(p[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(y)
              : String.fromCharCode(y);
          });
        },
        m = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (v, g) {
                for (var p = this.length; p--; ) if (this[p] === g) return p;
                return -1;
              };
        })(),
        E = function (v, g) {
          var p = b.inside.source.replace(/</g, v).replace(/>/g, g);
          return new RegExp(p);
        },
        C = function (v, g, p) {
          return (
            (v = v.source), (v = v.replace(g, p.source || p)), new RegExp(v)
          );
        },
        M = function (v, g) {
          return v
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", g)
            .join("/");
        },
        P = function (v, g) {
          var p = v.replace(/\s+/g, ""),
            y;
          return (
            p === "even"
              ? (p = "2n+0")
              : p === "odd"
                ? (p = "2n+1")
                : p.indexOf("n") === -1 && (p = "0n" + p),
            (y = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(p)),
            {
              group: y[1] === "-" ? -(y[2] || 1) : +(y[2] || 1),
              offset: y[4] ? (y[3] === "-" ? -y[4] : +y[4]) : 0,
            }
          );
        },
        A = function (v, g, p) {
          var y = P(v),
            I = y.group,
            R = y.offset,
            V = p ? c : a,
            K = p ? o : s;
          return function (ge) {
            if (l(ge))
              for (var S = V(ge.parentNode), k = 0; S; ) {
                if ((g(S, ge) && k++, S === ge))
                  return (k -= R), I && k ? k % I === 0 && k < 0 == I < 0 : !k;
                S = K(S);
              }
          };
        },
        _ = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (v) {
            return (
              (v = v.toLowerCase()),
              function (g) {
                return g.nodeName.toLowerCase() === v;
              }
            );
          },
          attr: function (v, g, p, y) {
            return (
              (g = w[g]),
              function (I) {
                var R;
                switch (v) {
                  case "for":
                    R = I.htmlFor;
                    break;
                  case "class":
                    (R = I.className),
                      R === "" && I.getAttribute("class") == null && (R = null);
                    break;
                  case "href":
                  case "src":
                    R = I.getAttribute(v, 2);
                    break;
                  case "title":
                    R = I.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (I.getAttribute) {
                      R = I.getAttribute(v);
                      break;
                    }
                  default:
                    if (I.hasAttribute && !I.hasAttribute(v)) break;
                    R =
                      I[v] != null ? I[v] : I.getAttribute && I.getAttribute(v);
                    break;
                }
                if (R != null)
                  return (
                    (R = R + ""),
                    y && ((R = R.toLowerCase()), (p = p.toLowerCase())),
                    g(R, p)
                  );
              }
            );
          },
          ":first-child": function (v) {
            return !o(v) && l(v);
          },
          ":last-child": function (v) {
            return !s(v) && l(v);
          },
          ":only-child": function (v) {
            return !o(v) && !s(v) && l(v);
          },
          ":nth-child": function (v, g) {
            return A(
              v,
              function () {
                return !0;
              },
              g,
            );
          },
          ":nth-last-child": function (v) {
            return _[":nth-child"](v, !0);
          },
          ":root": function (v) {
            return v.ownerDocument.documentElement === v;
          },
          ":empty": function (v) {
            return !v.firstChild;
          },
          ":not": function (v) {
            var g = j(v);
            return function (p) {
              return !g(p);
            };
          },
          ":first-of-type": function (v) {
            if (l(v)) {
              for (var g = v.nodeName; (v = o(v)); )
                if (v.nodeName === g) return;
              return !0;
            }
          },
          ":last-of-type": function (v) {
            if (l(v)) {
              for (var g = v.nodeName; (v = s(v)); )
                if (v.nodeName === g) return;
              return !0;
            }
          },
          ":only-of-type": function (v) {
            return _[":first-of-type"](v) && _[":last-of-type"](v);
          },
          ":nth-of-type": function (v, g) {
            return A(
              v,
              function (p, y) {
                return p.nodeName === y.nodeName;
              },
              g,
            );
          },
          ":nth-last-of-type": function (v) {
            return _[":nth-of-type"](v, !0);
          },
          ":checked": function (v) {
            return !!(v.checked || v.selected);
          },
          ":indeterminate": function (v) {
            return !_[":checked"](v);
          },
          ":enabled": function (v) {
            return !v.disabled && v.type !== "hidden";
          },
          ":disabled": function (v) {
            return !!v.disabled;
          },
          ":target": function (v) {
            return v.id === n.location.hash.substring(1);
          },
          ":focus": function (v) {
            return v === v.ownerDocument.activeElement;
          },
          ":is": function (v) {
            return j(v);
          },
          ":matches": function (v) {
            return _[":is"](v);
          },
          ":nth-match": function (v, g) {
            var p = v.split(/\s*,\s*/),
              y = p.shift(),
              I = j(p.join(","));
            return A(y, I, g);
          },
          ":nth-last-match": function (v) {
            return _[":nth-match"](v, !0);
          },
          ":links-here": function (v) {
            return v + "" == n.location + "";
          },
          ":lang": function (v) {
            return function (g) {
              for (; g; ) {
                if (g.lang) return g.lang.indexOf(v) === 0;
                g = g.parentNode;
              }
            };
          },
          ":dir": function (v) {
            return function (g) {
              for (; g; ) {
                if (g.dir) return g.dir === v;
                g = g.parentNode;
              }
            };
          },
          ":scope": function (v, g) {
            var p = g || v.ownerDocument;
            return p.nodeType === 9 ? v === p.documentElement : v === p;
          },
          ":any-link": function (v) {
            return typeof v.href == "string";
          },
          ":local-link": function (v) {
            if (v.nodeName) return v.href && v.host === n.location.host;
            var g = +v + 1;
            return function (p) {
              if (p.href) {
                var y = n.location + "",
                  I = p + "";
                return M(y, g) === M(I, g);
              }
            };
          },
          ":default": function (v) {
            return !!v.defaultSelected;
          },
          ":valid": function (v) {
            return v.willValidate || (v.validity && v.validity.valid);
          },
          ":invalid": function (v) {
            return !_[":valid"](v);
          },
          ":in-range": function (v) {
            return v.value > v.min && v.value <= v.max;
          },
          ":out-of-range": function (v) {
            return !_[":in-range"](v);
          },
          ":required": function (v) {
            return !!v.required;
          },
          ":optional": function (v) {
            return !v.required;
          },
          ":read-only": function (v) {
            if (v.readOnly) return !0;
            var g = v.getAttribute("contenteditable"),
              p = v.contentEditable,
              y = v.nodeName.toLowerCase();
            return (
              (y = y !== "input" && y !== "textarea"),
              (y || v.disabled) && g == null && p !== "true"
            );
          },
          ":read-write": function (v) {
            return !_[":read-only"](v);
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
          ":contains": function (v) {
            return function (g) {
              var p = g.innerText || g.textContent || g.value || "";
              return p.indexOf(v) !== -1;
            };
          },
          ":has": function (v) {
            return function (g) {
              return Y(v, g).length > 0;
            };
          },
        },
        w = {
          "-": function () {
            return !0;
          },
          "=": function (v, g) {
            return v === g;
          },
          "*=": function (v, g) {
            return v.indexOf(g) !== -1;
          },
          "~=": function (v, g) {
            var p, y, I, R;
            for (y = 0; ; y = p + 1) {
              if (((p = v.indexOf(g, y)), p === -1)) return !1;
              if (
                ((I = v[p - 1]),
                (R = v[p + g.length]),
                (!I || I === " ") && (!R || R === " "))
              )
                return !0;
            }
          },
          "|=": function (v, g) {
            var p = v.indexOf(g),
              y;
            if (p === 0) return (y = v[p + g.length]), y === "-" || !y;
          },
          "^=": function (v, g) {
            return v.indexOf(g) === 0;
          },
          "$=": function (v, g) {
            var p = v.lastIndexOf(g);
            return p !== -1 && p + g.length === v.length;
          },
          "!=": function (v, g) {
            return v !== g;
          },
        },
        T = {
          " ": function (v) {
            return function (g) {
              for (; (g = g.parentNode); ) if (v(g)) return g;
            };
          },
          ">": function (v) {
            return function (g) {
              if ((g = g.parentNode)) return v(g) && g;
            };
          },
          "+": function (v) {
            return function (g) {
              if ((g = o(g))) return v(g) && g;
            };
          },
          "~": function (v) {
            return function (g) {
              for (; (g = o(g)); ) if (v(g)) return g;
            };
          },
          noop: function (v) {
            return function (g) {
              return v(g) && g;
            };
          },
          ref: function (v, g) {
            var p;
            function y(I) {
              for (
                var R = I.ownerDocument,
                  V = R.getElementsByTagName("*"),
                  K = V.length;
                K--;

              )
                if (((p = V[K]), y.test(I))) return (p = null), !0;
              p = null;
            }
            return (
              (y.combinator = function (I) {
                if (!(!p || !p.getAttribute)) {
                  var R = p.getAttribute(g) || "";
                  if (
                    (R[0] === "#" && (R = R.substring(1)), R === I.id && v(p))
                  )
                    return p;
                }
              }),
              y
            );
          },
        },
        b = {
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
      (b.cssid = C(b.cssid, "nonascii", b.nonascii)),
        (b.cssid = C(b.cssid, "escape", b.escape)),
        (b.qname = C(b.qname, "cssid", b.cssid)),
        (b.simple = C(b.simple, "cssid", b.cssid)),
        (b.ref = C(b.ref, "cssid", b.cssid)),
        (b.attr = C(b.attr, "cssid", b.cssid)),
        (b.pseudo = C(b.pseudo, "cssid", b.cssid)),
        (b.inside = C(b.inside, `[^"'>]*`, b.inside)),
        (b.attr = C(b.attr, "inside", E("\\[", "\\]"))),
        (b.pseudo = C(b.pseudo, "inside", E("\\(", "\\)"))),
        (b.simple = C(b.simple, "pseudo", b.pseudo)),
        (b.simple = C(b.simple, "attr", b.attr)),
        (b.ident = C(b.ident, "cssid", b.cssid)),
        (b.str_escape = C(b.str_escape, "escape", b.escape));
      var J = function (v) {
          for (
            var g = v.replace(/^\s+|\s+$/g, ""),
              p,
              y = [],
              I = [],
              R,
              V,
              K,
              ge,
              S;
            g;

          ) {
            if ((K = b.qname.exec(g)))
              (g = g.substring(K[0].length)), (V = d(K[1])), I.push(ne(V, !0));
            else if ((K = b.simple.exec(g)))
              (g = g.substring(K[0].length)),
                (V = "*"),
                I.push(ne(V, !0)),
                I.push(ne(K));
            else throw new SyntaxError("Invalid selector.");
            for (; (K = b.simple.exec(g)); )
              (g = g.substring(K[0].length)), I.push(ne(K));
            if (
              (g[0] === "!" &&
                ((g = g.substring(1)),
                (R = O()),
                (R.qname = V),
                I.push(R.simple)),
              (K = b.ref.exec(g)))
            ) {
              (g = g.substring(K[0].length)),
                (S = T.ref(ve(I), d(K[1]))),
                y.push(S.combinator),
                (I = []);
              continue;
            }
            if ((K = b.combinator.exec(g))) {
              if (
                ((g = g.substring(K[0].length)),
                (ge = K[1] || K[2] || K[3]),
                ge === ",")
              ) {
                y.push(T.noop(ve(I)));
                break;
              }
            } else ge = "noop";
            if (!T[ge]) throw new SyntaxError("Bad combinator.");
            y.push(T[ge](ve(I))), (I = []);
          }
          return (
            (p = z(y)),
            (p.qname = V),
            (p.sel = g),
            R &&
              ((R.lname = p.qname),
              (R.test = p),
              (R.qname = R.qname),
              (R.sel = p.sel),
              (p = R)),
            S && ((S.test = p), (S.qname = p.qname), (S.sel = p.sel), (p = S)),
            p
          );
        },
        ne = function (v, g) {
          if (g) return v === "*" ? _["*"] : _.type(v);
          if (v[1])
            return v[1][0] === "."
              ? _.attr("class", "~=", d(v[1].substring(1)), !1)
              : _.attr("id", "=", d(v[1].substring(1)), !1);
          if (v[2]) return v[3] ? _[d(v[2])](u(v[3])) : _[d(v[2])];
          if (v[4]) {
            var p = v[6],
              y = /["'\s]\s*I$/i.test(p);
            return (
              y && (p = p.replace(/\s*I$/i, "")),
              _.attr(d(v[4]), v[5] || "-", u(p), y)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        ve = function (v) {
          var g = v.length,
            p;
          return g < 2
            ? v[0]
            : function (y) {
                if (y) {
                  for (p = 0; p < g; p++) if (!v[p](y)) return;
                  return !0;
                }
              };
        },
        z = function (v) {
          return v.length < 2
            ? function (g) {
                return !!v[0](g);
              }
            : function (g) {
                for (var p = v.length; p--; ) if (!(g = v[p](g))) return;
                return !0;
              };
        },
        O = function () {
          var v;
          function g(p) {
            for (
              var y = p.ownerDocument,
                I = y.getElementsByTagName(g.lname),
                R = I.length;
              R--;

            )
              if (g.test(I[R]) && v === p) return (v = null), !0;
            v = null;
          }
          return (
            (g.simple = function (p) {
              return (v = p), !0;
            }),
            g
          );
        },
        j = function (v) {
          for (var g = J(v), p = [g]; g.sel; ) (g = J(g.sel)), p.push(g);
          return p.length < 2
            ? g
            : function (y) {
                for (var I = p.length, R = 0; R < I; R++)
                  if (p[R](y)) return !0;
              };
        },
        Y = function (v, g) {
          for (
            var p = [], y = J(v), I = g.getElementsByTagName(y.qname), R = 0, V;
            (V = I[R++]);

          )
            y(V) && p.push(V);
          if (y.sel) {
            for (; y.sel; )
              for (
                y = J(y.sel), I = g.getElementsByTagName(y.qname), R = 0;
                (V = I[R++]);

              )
                y(V) && m.call(p, V) === -1 && p.push(V);
            p.sort(i);
          }
          return p;
        };
      (e.exports = t =
        function (v, g) {
          var p, y;
          if (g.nodeType !== 11 && v.indexOf(" ") === -1) {
            if (
              v[0] === "#" &&
              g.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(v) &&
              g.doc._hasMultipleElementsWithId &&
              ((p = v.substring(1)), !g.doc._hasMultipleElementsWithId(p))
            )
              return (y = g.doc.getElementById(p)), y ? [y] : [];
            if (v[0] === "." && /^\.\w+$/.test(v))
              return g.getElementsByClassName(v.substring(1));
            if (/^\w+$/.test(v)) return g.getElementsByTagName(v);
          }
          return Y(v, g);
        }),
        (t.selectors = _),
        (t.operators = w),
        (t.combinators = T),
        (t.matches = function (v, g) {
          var p = { sel: g };
          do if (((p = J(p.sel)), p(v))) return !0;
          while (p.sel);
          return !1;
        });
    },
  }),
  Im = ae({
    "external/npm/node_modules/domino/lib/ChildNode.js"(t, e) {
      "use strict";
      var n = bt(),
        r = Zw(),
        i = function (o, a) {
          for (var c = o.createDocumentFragment(), l = 0; l < a.length; l++) {
            var u = a[l],
              d = u instanceof n;
            c.appendChild(d ? u : o.createTextNode(String(u)));
          }
          return c;
        },
        s = {
          after: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                c.insertBefore(u, l);
              }
            },
          },
          before: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.previousSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (m) {
                    return m === l;
                  });

                )
                  l = l.previousSibling;
                var u = i(this.doc, a),
                  d = l ? l.nextSibling : c.firstChild;
                c.insertBefore(u, d);
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
              var a = this.parentNode;
              a !== null &&
                (a._childNodes
                  ? a._childNodes.splice(this.index, 1)
                  : a._firstChild === this &&
                    (this._nextSibling === this
                      ? (a._firstChild = null)
                      : (a._firstChild = this._nextSibling)),
                r.remove(this),
                a.modify());
            },
          },
          replaceWith: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                this.parentNode === c
                  ? c.replaceChild(u, this)
                  : c.insertBefore(u, l);
              }
            },
          },
        };
      e.exports = s;
    },
  }),
  tD = ae({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(t, e) {
      "use strict";
      var n = bt(),
        r = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var i = this.nextSibling; i !== null; i = i.nextSibling)
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var i = this.previousSibling;
                  i !== null;
                  i = i.previousSibling
                )
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
        };
      e.exports = r;
    },
  }),
  nD = ae({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = ot();
      function r(i) {
        this.element = i;
      }
      Object.defineProperties(r.prototype, {
        length: { get: n.shouldOverride },
        item: { value: n.shouldOverride },
        getNamedItem: {
          value: function (s) {
            return this.element.getAttributeNode(s);
          },
        },
        getNamedItemNS: {
          value: function (s, o) {
            return this.element.getAttributeNodeNS(s, o);
          },
        },
        setNamedItem: { value: n.nyi },
        setNamedItemNS: { value: n.nyi },
        removeNamedItem: {
          value: function (s) {
            var o = this.element.getAttributeNode(s);
            if (o) return this.element.removeAttribute(s), o;
            n.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (s, o) {
            var a = this.element.getAttributeNodeNS(s, o);
            if (a) return this.element.removeAttributeNS(s, o), a;
            n.NotFoundError();
          },
        },
      });
    },
  }),
  Zo = ae({
    "external/npm/node_modules/domino/lib/Element.js"(t, e) {
      "use strict";
      e.exports = _;
      var n = Sm(),
        r = ot(),
        i = r.NAMESPACE,
        s = Jw(),
        o = bt(),
        a = Ss(),
        c = Xw(),
        l = BO(),
        u = Dm(),
        d = eD(),
        m = Cm(),
        E = Tm(),
        C = Im(),
        M = tD(),
        P = nD(),
        A = Object.create(null);
      function _(g, p, y, I) {
        E.call(this),
          (this.nodeType = o.ELEMENT_NODE),
          (this.ownerDocument = g),
          (this.localName = p),
          (this.namespaceURI = y),
          (this.prefix = I),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function w(g, p) {
        if (g.nodeType === o.TEXT_NODE) p.push(g._data);
        else
          for (var y = 0, I = g.childNodes.length; y < I; y++)
            w(g.childNodes[y], p);
      }
      (_.prototype = Object.create(E.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === i.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var p;
              if (
                (this.prefix === null
                  ? (p = this.localName)
                  : (p = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var y = A[p];
                y || (A[p] = y = r.toASCIIUpperCase(p)), (p = y);
              }
              this._tagName = p;
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
            var g = [];
            return w(this, g), g.join("");
          },
          set: function (g) {
            this.removeChildren(),
              g != null &&
                g !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(g));
          },
        },
        innerText: {
          get: function () {
            var g = [];
            return (
              w(this, g),
              g
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (g) {
            this.removeChildren(),
              g != null &&
                g !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(g));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: r.nyi,
        },
        outerHTML: {
          get: function () {
            return c.serializeOne(this, { nodeType: 0 });
          },
          set: function (g) {
            var p = this.ownerDocument,
              y = this.parentNode;
            if (y !== null) {
              y.nodeType === o.DOCUMENT_NODE && r.NoModificationAllowedError(),
                y.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (y = y.ownerDocument.createElement("body"));
              var I = p.implementation.mozHTMLParser(p._address, y);
              I.parse(g === null ? "" : String(g), !0),
                this.replaceWith(I._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (p, y) {
            var I = !1;
            switch (p) {
              case "beforebegin":
                I = !0;
              case "afterend":
                var R = this.parentNode;
                return R === null
                  ? null
                  : R.insertBefore(y, I ? this : this.nextSibling);
              case "afterbegin":
                I = !0;
              case "beforeend":
                return this.insertBefore(y, I ? this.firstChild : null);
              default:
                return r.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (p, y) {
            if (y.nodeType !== o.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, y)
            );
          },
        },
        insertAdjacentText: {
          value: function (p, y) {
            var I = this.ownerDocument.createTextNode(y);
            (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, I);
          },
        },
        insertAdjacentHTML: {
          value: function (p, y) {
            (p = r.toASCIILowerCase(String(p))), (y = String(y));
            var I;
            switch (p) {
              case "beforebegin":
              case "afterend":
                (I = this.parentNode),
                  (I === null || I.nodeType === o.DOCUMENT_NODE) &&
                    r.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                I = this;
                break;
              default:
                r.SyntaxError();
            }
            (!(I instanceof _) ||
              (I.ownerDocument.isHTML &&
                I.localName === "html" &&
                I.namespaceURI === i.HTML)) &&
              (I = I.ownerDocument.createElementNS(i.HTML, "body"));
            var R = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              I,
            );
            R.parse(y, !0), this._insertAdjacent(p, R._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new ne(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new b(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var g = this.firstChild; g !== null; g = g.nextSibling)
              if (g.nodeType === o.ELEMENT_NODE) return g;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var g = this.lastChild; g !== null; g = g.previousSibling)
              if (g.nodeType === o.ELEMENT_NODE) return g;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (g) {
            g || (g = this.ownerDocument.documentElement);
            var p = this.firstElementChild;
            if (!p) {
              if (this === g) return null;
              p = this.nextElementSibling;
            }
            if (p) return p;
            for (var y = this.parentElement; y && y !== g; y = y.parentElement)
              if (((p = y.nextElementSibling), p)) return p;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (p) {
            var y;
            return p
              ? (p === "*"
                  ? (y = function () {
                      return !0;
                    })
                  : this.isHTML
                    ? (y = z(p))
                    : (y = ve(p)),
                new l(this, y))
              : new a();
          },
        },
        getElementsByTagNameNS: {
          value: function (p, y) {
            var I;
            return (
              p === "*" && y === "*"
                ? (I = function () {
                    return !0;
                  })
                : p === "*"
                  ? (I = ve(y))
                  : y === "*"
                    ? (I = O(p))
                    : (I = j(p, y)),
              new l(this, I)
            );
          },
        },
        getElementsByClassName: {
          value: function (p) {
            if (((p = String(p).trim()), p === "")) {
              var y = new a();
              return y;
            }
            return (p = p.split(/[ \t\r\n\f]+/)), new l(this, Y(p));
          },
        },
        getElementsByName: {
          value: function (p) {
            return new l(this, v(String(p)));
          },
        },
        clone: {
          value: function () {
            var p;
            this.namespaceURI !== i.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (p = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName,
                ))
              : (p = this.ownerDocument.createElement(this.localName));
            for (var y = 0, I = this._attrKeys.length; y < I; y++) {
              var R = this._attrKeys[y],
                V = this._attrsByLName[R],
                K = V.cloneNode();
              K._setOwnerElement(p), (p._attrsByLName[R] = K), p._addQName(K);
            }
            return (p._attrKeys = this._attrKeys.concat()), p;
          },
        },
        isEqual: {
          value: function (p) {
            if (
              this.localName !== p.localName ||
              this.namespaceURI !== p.namespaceURI ||
              this.prefix !== p.prefix ||
              this._numattrs !== p._numattrs
            )
              return !1;
            for (var y = 0, I = this._numattrs; y < I; y++) {
              var R = this._attr(y);
              if (
                !p.hasAttributeNS(R.namespaceURI, R.localName) ||
                p.getAttributeNS(R.namespaceURI, R.localName) !== R.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (p, y) {
            if (
              this.namespaceURI &&
              this.namespaceURI === p &&
              this.prefix !== null &&
              y.lookupNamespaceURI(this.prefix) === p
            )
              return this.prefix;
            for (var I = 0, R = this._numattrs; I < R; I++) {
              var V = this._attr(I);
              if (
                V.prefix === "xmlns" &&
                V.value === p &&
                y.lookupNamespaceURI(V.localName) === p
              )
                return V.localName;
            }
            var K = this.parentElement;
            return K ? K._lookupNamespacePrefix(p, y) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (p) {
            if (
              ((p === "" || p === void 0) && (p = null),
              this.namespaceURI !== null && this.prefix === p)
            )
              return this.namespaceURI;
            for (var y = 0, I = this._numattrs; y < I; y++) {
              var R = this._attr(y);
              if (
                R.namespaceURI === i.XMLNS &&
                ((R.prefix === "xmlns" && R.localName === p) ||
                  (p === null && R.prefix === null && R.localName === "xmlns"))
              )
                return R.value || null;
            }
            var V = this.parentElement;
            return V ? V.lookupNamespaceURI(p) : null;
          },
        },
        getAttribute: {
          value: function (p) {
            var y = this.getAttributeNode(p);
            return y ? y.value : null;
          },
        },
        getAttributeNS: {
          value: function (p, y) {
            var I = this.getAttributeNodeNS(p, y);
            return I ? I.value : null;
          },
        },
        getAttributeNode: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            return y ? (Array.isArray(y) && (y = y[0]), y) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var I = this._attrsByLName[p + "|" + y];
            return I || null;
          },
        },
        hasAttribute: {
          value: function (p) {
            return (
              (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._attrsByQName[p] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var I = p + "|" + y;
            return this._attrsByLName[I] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var I = this._attrsByQName[p];
            return I === void 0
              ? y === void 0 || y === !0
                ? (this._setAttribute(p, ""), !0)
                : !1
              : y === void 0 || y === !1
                ? (this.removeAttribute(p), !1)
                : !0;
          },
        },
        _setAttribute: {
          value: function (p, y) {
            var I = this._attrsByQName[p],
              R;
            I
              ? Array.isArray(I) && (I = I[0])
              : ((I = this._newattr(p)), (R = !0)),
              (I.value = y),
              this._attributes && (this._attributes[p] = I),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        setAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._setAttribute(p, String(y));
          },
        },
        _setAttributeNS: {
          value: function (p, y, I) {
            var R = y.indexOf(":"),
              V,
              K;
            R < 0
              ? ((V = null), (K = y))
              : ((V = y.substring(0, R)), (K = y.substring(R + 1))),
              (p === "" || p === void 0) && (p = null);
            var ge = (p === null ? "" : p) + "|" + K,
              S = this._attrsByLName[ge],
              k;
            S ||
              ((S = new T(this, K, V, p)),
              (k = !0),
              (this._attrsByLName[ge] = S),
              this._attributes && (this._attributes[this._attrKeys.length] = S),
              this._attrKeys.push(ge),
              this._addQName(S)),
              (S.value = I),
              k && this._newattrhook && this._newattrhook(y, I);
          },
        },
        setAttributeNS: {
          value: function (p, y, I) {
            (p = p == null || p === "" ? null : String(p)),
              (y = String(y)),
              n.isValidQName(y) || r.InvalidCharacterError();
            var R = y.indexOf(":"),
              V = R < 0 ? null : y.substring(0, R);
            ((V !== null && p === null) ||
              (V === "xml" && p !== i.XML) ||
              ((y === "xmlns" || V === "xmlns") && p !== i.XMLNS) ||
              (p === i.XMLNS && !(y === "xmlns" || V === "xmlns"))) &&
              r.NamespaceError(),
              this._setAttributeNS(p, y, String(I));
          },
        },
        setAttributeNode: {
          value: function (p) {
            if (p.ownerElement !== null && p.ownerElement !== this)
              throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = null,
              I = this._attrsByQName[p.name];
            if (I) {
              if (
                (Array.isArray(I) || (I = [I]),
                I.some(function (R) {
                  return R === p;
                }))
              )
                return p;
              if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
              I.forEach(function (R) {
                this.removeAttributeNode(R);
              }, this),
                (y = I[0]);
            }
            return this.setAttributeNodeNS(p), y;
          },
        },
        setAttributeNodeNS: {
          value: function (p) {
            if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = p.namespaceURI,
              I = (y === null ? "" : y) + "|" + p.localName,
              R = this._attrsByLName[I];
            return (
              R && this.removeAttributeNode(R),
              p._setOwnerElement(this),
              (this._attrsByLName[I] = p),
              this._attributes && (this._attributes[this._attrKeys.length] = p),
              this._attrKeys.push(I),
              this._addQName(p),
              this._newattrhook && this._newattrhook(p.name, p.value),
              R || null
            );
          },
        },
        removeAttribute: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            if (y) {
              Array.isArray(y)
                ? y.length > 2
                  ? (y = y.shift())
                  : ((this._attrsByQName[p] = y[1]), (y = y[0]))
                : (this._attrsByQName[p] = void 0);
              var I = y.namespaceURI,
                R = (I === null ? "" : I) + "|" + y.localName;
              this._attrsByLName[R] = void 0;
              var V = this._attrKeys.indexOf(R);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, V, 1),
                (this._attributes[p] = void 0)),
                this._attrKeys.splice(V, 1);
              var K = y.onchange;
              y._setOwnerElement(null),
                K && K.call(y, this, y.localName, y.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(y);
            }
          },
        },
        removeAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var I = p + "|" + y,
              R = this._attrsByLName[I];
            if (R) {
              this._attrsByLName[I] = void 0;
              var V = this._attrKeys.indexOf(I);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, V, 1),
                this._attrKeys.splice(V, 1),
                this._removeQName(R);
              var K = R.onchange;
              R._setOwnerElement(null),
                K && K.call(R, this, R.localName, R.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(R);
            }
          },
        },
        removeAttributeNode: {
          value: function (p) {
            var y = p.namespaceURI,
              I = (y === null ? "" : y) + "|" + p.localName;
            return (
              this._attrsByLName[I] !== p && r.NotFoundError(),
              this.removeAttributeNS(y, p.localName),
              p
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var p = this;
            return this._attrKeys.map(function (y) {
              return p._attrsByLName[y].name;
            });
          },
        },
        _getattr: {
          value: function (p) {
            var y = this._attrsByQName[p];
            return y ? y.value : null;
          },
        },
        _setattr: {
          value: function (p, y) {
            var I = this._attrsByQName[p],
              R;
            I || ((I = this._newattr(p)), (R = !0)),
              (I.value = String(y)),
              this._attributes && (this._attributes[p] = I),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        _newattr: {
          value: function (p) {
            var y = new T(this, p, null, null),
              I = "|" + p;
            return (
              (this._attrsByQName[p] = y),
              (this._attrsByLName[I] = y),
              this._attributes && (this._attributes[this._attrKeys.length] = y),
              this._attrKeys.push(I),
              y
            );
          },
        },
        _addQName: {
          value: function (g) {
            var p = g.name,
              y = this._attrsByQName[p];
            y
              ? Array.isArray(y)
                ? y.push(g)
                : (this._attrsByQName[p] = [y, g])
              : (this._attrsByQName[p] = g),
              this._attributes && (this._attributes[p] = g);
          },
        },
        _removeQName: {
          value: function (g) {
            var p = g.name,
              y = this._attrsByQName[p];
            if (Array.isArray(y)) {
              var I = y.indexOf(g);
              r.assert(I !== -1),
                y.length === 2
                  ? ((this._attrsByQName[p] = y[1 - I]),
                    this._attributes &&
                      (this._attributes[p] = this._attrsByQName[p]))
                  : (y.splice(I, 1),
                    this._attributes &&
                      this._attributes[p] === g &&
                      (this._attributes[p] = y[0]));
            } else
              r.assert(y === g),
                (this._attrsByQName[p] = void 0),
                this._attributes && (this._attributes[p] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (g) {
            return this._attrsByLName[this._attrKeys[g]];
          },
        },
        id: s.property({ name: "id" }),
        className: s.property({ name: "class" }),
        classList: {
          get: function () {
            var g = this;
            if (this._classList) return this._classList;
            var p = new d(
              function () {
                return g.className || "";
              },
              function (y) {
                g.className = y;
              },
            );
            return (this._classList = p), p;
          },
          set: function (g) {
            this.className = g;
          },
        },
        matches: {
          value: function (g) {
            return m.matches(this, g);
          },
        },
        closest: {
          value: function (g) {
            var p = this;
            do {
              if (p.matches && p.matches(g)) return p;
              p = p.parentElement || p.parentNode;
            } while (p !== null && p.nodeType === o.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (g) {
            return m(g, this)[0];
          },
        },
        querySelectorAll: {
          value: function (g) {
            var p = m(g, this);
            return p.item ? p : new a(p);
          },
        },
      })),
        Object.defineProperties(_.prototype, C),
        Object.defineProperties(_.prototype, M),
        s.registerChangeHandler(_, "id", function (g, p, y, I) {
          g.rooted &&
            (y && g.ownerDocument.delId(y, g),
            I && g.ownerDocument.addId(I, g));
        }),
        s.registerChangeHandler(_, "class", function (g, p, y, I) {
          g._classList && g._classList._update();
        });
      function T(g, p, y, I, R) {
        (this.localName = p),
          (this.prefix = y === null || y === "" ? null : "" + y),
          (this.namespaceURI = I === null || I === "" ? null : "" + I),
          (this.data = R),
          this._setOwnerElement(g);
      }
      (T.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (p) {
            (this._ownerElement = p),
              this.prefix === null && this.namespaceURI === null && p
                ? (this.onchange = p._attributeChangeHandlers[this.localName])
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
          set: function (g) {
            var p = this.data;
            (g = g === void 0 ? "" : g + ""),
              g !== p &&
                ((this.data = g),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, p, g),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, p)));
          },
        },
        cloneNode: {
          value: function (p) {
            return new T(
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
            return o.ATTRIBUTE_NODE;
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
          set: function (g) {
            this.value = g;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (g) {
            g == null && (g = ""), (this.value = g);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (g) {
            g == null && (g = ""), (this.value = g);
          },
        },
      })),
        (_._Attr = T);
      function b(g) {
        P.call(this, g);
        for (var p in g._attrsByQName) this[p] = g._attrsByQName[p];
        for (var y = 0; y < g._attrKeys.length; y++)
          this[y] = g._attrsByLName[g._attrKeys[y]];
      }
      b.prototype = Object.create(P.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (g) {
            return (
              (g = g >>> 0),
              g >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[g]]
            );
          },
        },
      });
      var J;
      (J = globalThis.Symbol) != null &&
        J.iterator &&
        (b.prototype[globalThis.Symbol.iterator] = function () {
          var g = 0,
            p = this.length,
            y = this;
          return {
            next: function () {
              return g < p ? { value: y.item(g++) } : { done: !0 };
            },
          };
        });
      function ne(g) {
        (this.element = g), this.updateCache();
      }
      ne.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (p) {
            return this.updateCache(), this.childrenByNumber[p] || null;
          },
        },
        namedItem: {
          value: function (p) {
            return this.updateCache(), this.childrenByName[p] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var p =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var y =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  I = 0;
                I < y;
                I++
              )
                this[I] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var R = this.element.firstChild;
                R !== null;
                R = R.nextSibling
              )
                if (R.nodeType === o.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = R),
                    this.childrenByNumber.push(R);
                  var V = R.getAttribute("id");
                  V && !this.childrenByName[V] && (this.childrenByName[V] = R);
                  var K = R.getAttribute("name");
                  K &&
                    this.element.namespaceURI === i.HTML &&
                    p.test(this.element.localName) &&
                    !this.childrenByName[K] &&
                    (this.childrenByName[V] = R);
                }
            }
          },
        },
      });
      function ve(g) {
        return function (p) {
          return p.localName === g;
        };
      }
      function z(g) {
        var p = r.toASCIILowerCase(g);
        return p === g
          ? ve(g)
          : function (y) {
              return y.isHTML ? y.localName === p : y.localName === g;
            };
      }
      function O(g) {
        return function (p) {
          return p.namespaceURI === g;
        };
      }
      function j(g, p) {
        return function (y) {
          return y.namespaceURI === g && y.localName === p;
        };
      }
      function Y(g) {
        return function (p) {
          return g.every(function (y) {
            return p.classList.contains(y);
          });
        };
      }
      function v(g) {
        return function (p) {
          return p.namespaceURI !== i.HTML ? !1 : p.getAttribute("name") === g;
        };
      }
    },
  }),
  rD = ae({
    "external/npm/node_modules/domino/lib/Leaf.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = bt(),
        r = Ss(),
        i = ot(),
        s = i.HierarchyRequestError,
        o = i.NotFoundError;
      function a() {
        n.call(this);
      }
      a.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        replaceChild: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        removeChild: {
          value: function (c) {
            if (!c.nodeType) throw new TypeError("not a node");
            o();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new r()), this._childNodes
            );
          },
        },
      });
    },
  }),
  Eu = ae({
    "external/npm/node_modules/domino/lib/CharacterData.js"(t, e) {
      "use strict";
      e.exports = o;
      var n = rD(),
        r = ot(),
        i = Im(),
        s = tD();
      function o() {
        n.call(this);
      }
      (o.prototype = Object.create(n.prototype, {
        substringData: {
          value: function (c, l) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (c = c >>> 0),
              (l = l >>> 0),
              (c > this.data.length || c < 0 || l < 0) && r.IndexSizeError(),
              this.data.substring(c, c + l)
            );
          },
        },
        appendData: {
          value: function (c) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(c);
          },
        },
        insertData: {
          value: function (c, l) {
            return this.replaceData(c, 0, l);
          },
        },
        deleteData: {
          value: function (c, l) {
            return this.replaceData(c, l, "");
          },
        },
        replaceData: {
          value: function (c, l, u) {
            var d = this.data,
              m = d.length;
            (c = c >>> 0),
              (l = l >>> 0),
              (u = String(u)),
              (c > m || c < 0) && r.IndexSizeError(),
              c + l > m && (l = m - c);
            var E = d.substring(0, c),
              C = d.substring(c + l);
            this.data = E + u + C;
          },
        },
        isEqual: {
          value: function (c) {
            return this._data === c._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(o.prototype, i),
        Object.defineProperties(o.prototype, s);
    },
  }),
  iD = ae({
    "external/npm/node_modules/domino/lib/Text.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = ot(),
        r = bt(),
        i = Eu();
      function s(a, c) {
        i.call(this),
          (this.nodeType = r.TEXT_NODE),
          (this.ownerDocument = a),
          (this._data = c),
          (this._index = void 0);
      }
      var o = {
        get: function () {
          return this._data;
        },
        set: function (a) {
          a == null ? (a = "") : (a = String(a)),
            a !== this._data &&
              ((this._data = a),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      s.prototype = Object.create(i.prototype, {
        nodeName: { value: "#text" },
        nodeValue: o,
        textContent: o,
        innerText: o,
        data: {
          get: o.get,
          set: function (a) {
            o.set.call(this, a === null ? "" : String(a));
          },
        },
        splitText: {
          value: function (c) {
            (c > this._data.length || c < 0) && n.IndexSizeError();
            var l = this._data.substring(c),
              u = this.ownerDocument.createTextNode(l);
            this.data = this.data.substring(0, c);
            var d = this.parentNode;
            return d !== null && d.insertBefore(u, this.nextSibling), u;
          },
        },
        wholeText: {
          get: function () {
            for (
              var c = this.textContent, l = this.nextSibling;
              l && l.nodeType === r.TEXT_NODE;
              l = l.nextSibling
            )
              c += l.textContent;
            return c;
          },
        },
        replaceWholeText: { value: n.nyi },
        clone: {
          value: function () {
            return new s(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  sD = ae({
    "external/npm/node_modules/domino/lib/Comment.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = bt(),
        r = Eu();
      function i(o, a) {
        r.call(this),
          (this.nodeType = n.COMMENT_NODE),
          (this.ownerDocument = o),
          (this._data = a);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  oD = ae({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = bt(),
        r = Ss(),
        i = Tm(),
        s = Zo(),
        o = Cm(),
        a = ot();
      function c(l) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = l);
      }
      c.prototype = Object.create(i.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          s.prototype,
          "textContent",
        ),
        innerText: Object.getOwnPropertyDescriptor(s.prototype, "innerText"),
        querySelector: {
          value: function (l) {
            var u = this.querySelectorAll(l);
            return u.length ? u[0] : null;
          },
        },
        querySelectorAll: {
          value: function (l) {
            var u = Object.create(this);
            (u.isHTML = !0),
              (u.getElementsByTagName = s.prototype.getElementsByTagName),
              (u.nextElement = Object.getOwnPropertyDescriptor(
                s.prototype,
                "firstElementChild",
              ).get);
            var d = o(l, u);
            return d.item ? d : new r(d);
          },
        },
        clone: {
          value: function () {
            return new c(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (u) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
      });
    },
  }),
  aD = ae({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(t, e) {
      "use strict";
      e.exports = i;
      var n = bt(),
        r = Eu();
      function i(o, a, c) {
        r.call(this),
          (this.nodeType = n.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = o),
          (this.target = a),
          (this._data = c);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (a) {
            return this.target === a.target && this._data === a._data;
          },
        },
      });
    },
  }),
  bu = ae({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(t, e) {
      "use strict";
      var n = {
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
      e.exports = n.constructor = n.prototype = n;
    },
  }),
  cD = ae({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(t, e) {
      "use strict";
      var n = (e.exports = {
        nextSkippingChildren: r,
        nextAncestorSibling: i,
        next: s,
        previous: a,
        deepLastChild: o,
      });
      function r(c, l) {
        return c === l
          ? null
          : c.nextSibling !== null
            ? c.nextSibling
            : i(c, l);
      }
      function i(c, l) {
        for (c = c.parentNode; c !== null; c = c.parentNode) {
          if (c === l) return null;
          if (c.nextSibling !== null) return c.nextSibling;
        }
        return null;
      }
      function s(c, l) {
        var u;
        return (
          (u = c.firstChild),
          u !== null
            ? u
            : c === l
              ? null
              : ((u = c.nextSibling), u !== null ? u : i(c, l))
        );
      }
      function o(c) {
        for (; c.lastChild; ) c = c.lastChild;
        return c;
      }
      function a(c, l) {
        var u;
        return (
          (u = c.previousSibling),
          u !== null ? o(u) : ((u = c.parentNode), u === l ? null : u)
        );
      }
    },
  }),
  HO = ae({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(t, e) {
      "use strict";
      e.exports = u;
      var n = bt(),
        r = bu(),
        i = cD(),
        s = ot(),
        o = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        a = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function c(d, m) {
        var E, C, M, P, A;
        for (C = d._currentNode[o[m]]; C !== null; ) {
          if (((P = d._internalFilter(C)), P === r.FILTER_ACCEPT))
            return (d._currentNode = C), C;
          if (P === r.FILTER_SKIP && ((E = C[o[m]]), E !== null)) {
            C = E;
            continue;
          }
          for (; C !== null; ) {
            if (((A = C[a[m]]), A !== null)) {
              C = A;
              break;
            }
            if (
              ((M = C.parentNode),
              M === null || M === d.root || M === d._currentNode)
            )
              return null;
            C = M;
          }
        }
        return null;
      }
      function l(d, m) {
        var E, C, M;
        if (((E = d._currentNode), E === d.root)) return null;
        for (;;) {
          for (M = E[a[m]]; M !== null; ) {
            if (((E = M), (C = d._internalFilter(E)), C === r.FILTER_ACCEPT))
              return (d._currentNode = E), E;
            (M = E[o[m]]),
              (C === r.FILTER_REJECT || M === null) && (M = E[a[m]]);
          }
          if (
            ((E = E.parentNode),
            E === null ||
              E === d.root ||
              d._internalFilter(E) === r.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function u(d, m, E) {
        (!d || !d.nodeType) && s.NotSupportedError(),
          (this._root = d),
          (this._whatToShow = Number(m) || 0),
          (this._filter = E || null),
          (this._active = !1),
          (this._currentNode = d);
      }
      Object.defineProperties(u.prototype, {
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
          set: function (m) {
            if (!(m instanceof n)) throw new TypeError("Not a Node");
            this._currentNode = m;
          },
        },
        _internalFilter: {
          value: function (m) {
            var E, C;
            if (
              (this._active && s.InvalidStateError(),
              !((1 << (m.nodeType - 1)) & this._whatToShow))
            )
              return r.FILTER_SKIP;
            if (((C = this._filter), C === null)) E = r.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof C == "function" ? (E = C(m)) : (E = C.acceptNode(m));
              } finally {
                this._active = !1;
              }
            }
            return +E;
          },
        },
        parentNode: {
          value: function () {
            for (var m = this._currentNode; m !== this.root; ) {
              if (((m = m.parentNode), m === null)) return null;
              if (this._internalFilter(m) === r.FILTER_ACCEPT)
                return (this._currentNode = m), m;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return c(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return c(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return l(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return l(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var m, E, C, M;
            for (m = this._currentNode; m !== this._root; ) {
              for (C = m.previousSibling; C; C = m.previousSibling)
                if (
                  ((m = C),
                  (E = this._internalFilter(m)),
                  E !== r.FILTER_REJECT)
                ) {
                  for (
                    M = m.lastChild;
                    M &&
                    ((m = M),
                    (E = this._internalFilter(m)),
                    E !== r.FILTER_REJECT);
                    M = m.lastChild
                  );
                  if (E === r.FILTER_ACCEPT) return (this._currentNode = m), m;
                }
              if (m === this.root || m.parentNode === null) return null;
              if (
                ((m = m.parentNode),
                this._internalFilter(m) === r.FILTER_ACCEPT)
              )
                return (this._currentNode = m), m;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var m, E, C, M;
            (m = this._currentNode), (E = r.FILTER_ACCEPT);
            e: for (;;) {
              for (C = m.firstChild; C; C = m.firstChild) {
                if (
                  ((m = C),
                  (E = this._internalFilter(m)),
                  E === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = m), m;
                if (E === r.FILTER_REJECT) break;
              }
              for (
                M = i.nextSkippingChildren(m, this.root);
                M;
                M = i.nextSkippingChildren(m, this.root)
              ) {
                if (
                  ((m = M),
                  (E = this._internalFilter(m)),
                  E === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = m), m;
                if (E === r.FILTER_SKIP) continue e;
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
  UO = ae({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(t, e) {
      "use strict";
      e.exports = c;
      var n = bu(),
        r = cD(),
        i = ot();
      function s(l, u, d) {
        return d ? r.next(l, u) : l === u ? null : r.previous(l, null);
      }
      function o(l, u) {
        for (; u; u = u.parentNode) if (l === u) return !0;
        return !1;
      }
      function a(l, u) {
        var d, m;
        for (d = l._referenceNode, m = l._pointerBeforeReferenceNode; ; ) {
          if (m === u) m = !m;
          else if (((d = s(d, l._root, u)), d === null)) return null;
          var E = l._internalFilter(d);
          if (E === n.FILTER_ACCEPT) break;
        }
        return (l._referenceNode = d), (l._pointerBeforeReferenceNode = m), d;
      }
      function c(l, u, d) {
        (!l || !l.nodeType) && i.NotSupportedError(),
          (this._root = l),
          (this._referenceNode = l),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(u) || 0),
          (this._filter = d || null),
          (this._active = !1),
          l.doc._attachNodeIterator(this);
      }
      Object.defineProperties(c.prototype, {
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
          value: function (u) {
            var d, m;
            if (
              (this._active && i.InvalidStateError(),
              !((1 << (u.nodeType - 1)) & this._whatToShow))
            )
              return n.FILTER_SKIP;
            if (((m = this._filter), m === null)) d = n.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof m == "function" ? (d = m(u)) : (d = m.acceptNode(u));
              } finally {
                this._active = !1;
              }
            }
            return +d;
          },
        },
        _preremove: {
          value: function (u) {
            if (!o(u, this._root) && o(u, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var d = u; d.lastChild; ) d = d.lastChild;
                if (((d = r.next(d, this.root)), d)) {
                  this._referenceNode = d;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (u.previousSibling === null)
                this._referenceNode = u.parentNode;
              else {
                this._referenceNode = u.previousSibling;
                var m;
                for (
                  m = this._referenceNode.lastChild;
                  m;
                  m = this._referenceNode.lastChild
                )
                  this._referenceNode = m;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return a(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return a(this, !1);
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
  Mm = ae({
    "external/npm/node_modules/domino/lib/URL.js"(t, e) {
      "use strict";
      e.exports = n;
      function n(r) {
        if (!r) return Object.create(n.prototype);
        this.url = r.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var i = n.pattern.exec(this.url);
        if (i) {
          if ((i[2] && (this.scheme = i[2]), i[4])) {
            var s = i[4].match(n.userinfoPattern);
            if (
              (s &&
                ((this.username = s[1]),
                (this.password = s[3]),
                (i[4] = i[4].substring(s[0].length))),
              i[4].match(n.portPattern))
            ) {
              var o = i[4].lastIndexOf(":");
              (this.host = i[4].substring(0, o)),
                (this.port = i[4].substring(o + 1));
            } else this.host = i[4];
          }
          i[5] && (this.path = i[5]),
            i[6] && (this.query = i[7]),
            i[8] && (this.fragment = i[9]);
        }
      }
      (n.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (n.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (n.portPattern = /:\d+$/),
        (n.authorityPattern = /^[^:\/?#]+:\/\//),
        (n.hierarchyPattern = /^[^:\/?#]+:\//),
        (n.percentEncode = function (i) {
          var s = i.charCodeAt(0);
          if (s < 256) return "%" + s.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (n.prototype = {
          constructor: n,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return n.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return n.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var r = "";
            return (
              this.scheme !== void 0 && (r += this.scheme + ":"),
              this.isAbsolute() &&
                ((r += "//"),
                (this.username || this.password) &&
                  ((r += this.username || ""),
                  this.password && (r += ":" + this.password),
                  (r += "@")),
                this.host && (r += this.host)),
              this.port !== void 0 && (r += ":" + this.port),
              this.path !== void 0 && (r += this.path),
              this.query !== void 0 && (r += "?" + this.query),
              this.fragment !== void 0 && (r += "#" + this.fragment),
              r
            );
          },
          resolve: function (r) {
            var i = this,
              s = new n(r),
              o = new n();
            return (
              s.scheme !== void 0
                ? ((o.scheme = s.scheme),
                  (o.username = s.username),
                  (o.password = s.password),
                  (o.host = s.host),
                  (o.port = s.port),
                  (o.path = c(s.path)),
                  (o.query = s.query))
                : ((o.scheme = i.scheme),
                  s.host !== void 0
                    ? ((o.username = s.username),
                      (o.password = s.password),
                      (o.host = s.host),
                      (o.port = s.port),
                      (o.path = c(s.path)),
                      (o.query = s.query))
                    : ((o.username = i.username),
                      (o.password = i.password),
                      (o.host = i.host),
                      (o.port = i.port),
                      s.path
                        ? (s.path.charAt(0) === "/"
                            ? (o.path = c(s.path))
                            : ((o.path = a(i.path, s.path)),
                              (o.path = c(o.path))),
                          (o.query = s.query))
                        : ((o.path = i.path),
                          s.query !== void 0
                            ? (o.query = s.query)
                            : (o.query = i.query)))),
              (o.fragment = s.fragment),
              o.toString()
            );
            function a(l, u) {
              if (i.host !== void 0 && !i.path) return "/" + u;
              var d = l.lastIndexOf("/");
              return d === -1 ? u : l.substring(0, d + 1) + u;
            }
            function c(l) {
              if (!l) return l;
              for (var u = ""; l.length > 0; ) {
                if (l === "." || l === "..") {
                  l = "";
                  break;
                }
                var d = l.substring(0, 2),
                  m = l.substring(0, 3),
                  E = l.substring(0, 4);
                if (m === "../") l = l.substring(3);
                else if (d === "./") l = l.substring(2);
                else if (m === "/./") l = "/" + l.substring(3);
                else if (d === "/." && l.length === 2) l = "/";
                else if (E === "/../" || (m === "/.." && l.length === 3))
                  (l = "/" + l.substring(4)), (u = u.replace(/\/?[^\/]*$/, ""));
                else {
                  var C = l.match(/(\/?([^\/]*))/)[0];
                  (u += C), (l = l.substring(C.length));
                }
              }
              return u;
            }
          },
        });
    },
  }),
  VO = ae({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(t, e) {
      "use strict";
      e.exports = r;
      var n = Yo();
      function r(i, s) {
        n.call(this, i, s);
      }
      r.prototype = Object.create(n.prototype, { constructor: { value: r } });
    },
  }),
  lD = ae({
    "external/npm/node_modules/domino/lib/events.js"(t, e) {
      "use strict";
      e.exports = {
        Event: Yo(),
        UIEvent: Qw(),
        MouseEvent: Kw(),
        CustomEvent: VO(),
      };
    },
  }),
  qO = ae({
    "external/npm/node_modules/domino/lib/style_parser.js"(t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.hyphenate = t.parse = void 0);
      function e(r) {
        let i = [],
          s = 0,
          o = 0,
          a = 0,
          c = 0,
          l = 0,
          u = null;
        for (; s < r.length; )
          switch (r.charCodeAt(s++)) {
            case 40:
              o++;
              break;
            case 41:
              o--;
              break;
            case 39:
              a === 0
                ? (a = 39)
                : a === 39 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 34:
              a === 0
                ? (a = 34)
                : a === 34 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 58:
              !u &&
                o === 0 &&
                a === 0 &&
                ((u = n(r.substring(l, s - 1).trim())), (c = s));
              break;
            case 59:
              if (u && c > 0 && o === 0 && a === 0) {
                let m = r.substring(c, s - 1).trim();
                i.push(u, m), (l = s), (c = 0), (u = null);
              }
              break;
          }
        if (u && c) {
          let d = r.slice(c).trim();
          i.push(u, d);
        }
        return i;
      }
      t.parse = e;
      function n(r) {
        return r
          .replace(/[a-z][A-Z]/g, (i) => i.charAt(0) + "-" + i.charAt(1))
          .toLowerCase();
      }
      t.hyphenate = n;
    },
  }),
  Nm = ae({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(t, e) {
      "use strict";
      var { parse: n } = qO();
      e.exports = function (c) {
        let l = new i(c),
          u = {
            get: function (d, m) {
              return m in d ? d[m] : d.getPropertyValue(r(m));
            },
            has: function (d, m) {
              return !0;
            },
            set: function (d, m, E) {
              return m in d ? (d[m] = E) : d.setProperty(r(m), E ?? void 0), !0;
            },
          };
        return new Proxy(l, u);
      };
      function r(c) {
        return c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function i(c) {
        this._element = c;
      }
      var s = "!important";
      function o(c) {
        let l = { property: {}, priority: {} };
        if (!c) return l;
        let u = n(c);
        if (u.length < 2) return l;
        for (let d = 0; d < u.length; d += 2) {
          let m = u[d],
            E = u[d + 1];
          E.endsWith(s) &&
            ((l.priority[m] = "important"), (E = E.slice(0, -s.length).trim())),
            (l.property[m] = E);
        }
        return l;
      }
      var a = {};
      i.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var c = this.cssText;
              (this._parsedStyles = o(c)),
                (this._lastParsedText = c),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var c = this._parsed,
              l = "";
            for (var u in c.property)
              l && (l += " "),
                (l += u + ": " + c.property[u]),
                c.priority[u] && (l += " !" + c.priority[u]),
                (l += ";");
            (this.cssText = l), (this._lastParsedText = l), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (c) {
            this._element.setAttribute("style", c);
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
          value: function (c) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names[c]
            );
          },
        },
        getPropertyValue: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.property[c] || "";
          },
        },
        getPropertyPriority: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.priority[c] || "";
          },
        },
        setProperty: {
          value: function (c, l, u) {
            if (
              ((c = c.toLowerCase()),
              l == null && (l = ""),
              u == null && (u = ""),
              l !== a && (l = "" + l),
              (l = l.trim()),
              l === "")
            ) {
              this.removeProperty(c);
              return;
            }
            if (!(u !== "" && u !== a && !/^important$/i.test(u))) {
              var d = this._parsed;
              if (l === a) {
                if (!d.property[c]) return;
                u !== "" ? (d.priority[c] = "important") : delete d.priority[c];
              } else {
                if (l.includes(";") && !l.includes("data:")) return;
                var m = o(c + ":" + l);
                if (
                  Object.getOwnPropertyNames(m.property).length === 0 ||
                  Object.getOwnPropertyNames(m.priority).length !== 0
                )
                  return;
                for (var E in m.property)
                  (d.property[E] = m.property[E]),
                    u !== a &&
                      (u !== ""
                        ? (d.priority[E] = "important")
                        : d.priority[E] && delete d.priority[E]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (c, l) {
            return this.setProperty(c, l, a);
          },
        },
        setPropertyPriority: {
          value: function (c, l) {
            return this.setProperty(c, a, l);
          },
        },
        removeProperty: {
          value: function (c) {
            c = c.toLowerCase();
            var l = this._parsed;
            c in l.property &&
              (delete l.property[c], delete l.priority[c], this._serialize());
          },
        },
      });
    },
  }),
  uD = ae({
    "external/npm/node_modules/domino/lib/URLUtils.js"(t, e) {
      "use strict";
      var n = Mm();
      e.exports = r;
      function r() {}
      (r.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new n(this.href);
          },
        },
        protocol: {
          get: function () {
            var i = this._url;
            return i && i.scheme ? i.scheme + ":" : ":";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(/:+$/, "")),
              (i = i.replace(/[^-+\.a-zA-Z0-9]/g, n.percentEncode)),
              i.length > 0 && ((o.scheme = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        host: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased()
              ? i.host + (i.port ? ":" + i.port : "")
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              i.length > 0 &&
                ((o.host = i), delete o.port, (s = o.toString()))),
              (this.href = s);
          },
        },
        hostname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() ? i.host : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(/^\/+/, "")),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              i.length > 0 && ((o.host = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        port: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() && i.port !== void 0
              ? i.port
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = "" + i),
              (i = i.replace(/[^0-9].*$/, "")),
              (i = i.replace(/^0+/, "")),
              i.length === 0 && (i = "0"),
              parseInt(i, 10) <= 65535 && ((o.port = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        pathname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() ? i.path : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) !== "/" && (i = "/" + i),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.path = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        search: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() && i.query !== void 0
              ? "?" + i.query
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) === "?" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.query = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        hash: {
          get: function () {
            var i = this._url;
            return i == null || i.fragment == null || i.fragment === ""
              ? ""
              : "#" + i.fragment;
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            i.charAt(0) === "#" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.fragment = i),
              (s = o.toString()),
              (this.href = s);
          },
        },
        username: {
          get: function () {
            var i = this._url;
            return i.username || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                n.percentEncode,
              )),
              (o.username = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        password: {
          get: function () {
            var i = this._url;
            return i.password || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              (i === ""
                ? (o.password = null)
                : ((i = i.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    n.percentEncode,
                  )),
                  (o.password = i)),
              (s = o.toString())),
              (this.href = s);
          },
        },
        origin: {
          get: function () {
            var i = this._url;
            if (i == null) return "";
            var s = function (o) {
              var a = [i.scheme, i.host, +i.port || o];
              return a[0] + "://" + a[1] + (a[2] === o ? "" : ":" + a[2]);
            };
            switch (i.scheme) {
              case "ftp":
                return s(21);
              case "gopher":
                return s(70);
              case "http":
              case "ws":
                return s(80);
              case "https":
              case "wss":
                return s(443);
              default:
                return i.scheme + "://";
            }
          },
        },
      })),
        (r._inherit = function (i) {
          Object.getOwnPropertyNames(r.prototype).forEach(function (s) {
            if (!(s === "constructor" || s === "href")) {
              var o = Object.getOwnPropertyDescriptor(r.prototype, s);
              Object.defineProperty(i, s, o);
            }
          });
        });
    },
  }),
  dD = ae({
    "external/npm/node_modules/domino/lib/defineElement.js"(t, e) {
      "use strict";
      var n = Jw(),
        r = _m().isApiWritable;
      e.exports = function (a, c, l, u) {
        var d = a.ctor;
        if (d) {
          var m = a.props || {};
          if (a.attributes)
            for (var E in a.attributes) {
              var C = a.attributes[E];
              (typeof C != "object" || Array.isArray(C)) && (C = { type: C }),
                C.name || (C.name = E.toLowerCase()),
                (m[E] = n.property(C));
            }
          (m.constructor = { value: d, writable: r }),
            (d.prototype = Object.create((a.superclass || c).prototype, m)),
            a.events && o(d, a.events),
            (l[a.name] = d);
        } else d = c;
        return (
          (a.tags || (a.tag && [a.tag]) || []).forEach(function (M) {
            u[M] = d;
          }),
          d
        );
      };
      function i(a, c, l, u) {
        (this.body = a),
          (this.document = c),
          (this.form = l),
          (this.element = u);
      }
      i.prototype.build = function () {
        return () => {};
      };
      function s(a, c, l, u) {
        var d = a.ownerDocument || Object.create(null),
          m = a.form || Object.create(null);
        a[c] = new i(u, d, m, a).build();
      }
      function o(a, c) {
        var l = a.prototype;
        c.forEach(function (u) {
          Object.defineProperty(l, "on" + u, {
            get: function () {
              return this._getEventHandler(u);
            },
            set: function (d) {
              this._setEventHandler(u, d);
            },
          }),
            n.registerChangeHandler(a, "on" + u, s);
        });
      }
    },
  }),
  Am = ae({
    "external/npm/node_modules/domino/lib/htmlelts.js"(t) {
      "use strict";
      var e = bt(),
        n = Zo(),
        r = Nm(),
        i = ot(),
        s = uD(),
        o = dD(),
        a = (t.elements = {}),
        c = Object.create(null);
      t.createElement = function (_, w, T) {
        var b = c[w] || P;
        return new b(_, w, T);
      };
      function l(_) {
        return o(_, M, a, c);
      }
      function u(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            if (w === null) return "";
            var T = this.doc._resolve(w);
            return T === null ? w : T;
          },
          set: function (w) {
            this._setattr(_, w);
          },
        };
      }
      function d(_) {
        return {
          get: function () {
            var w = this._getattr(_);
            return w === null
              ? null
              : w.toLowerCase() === "use-credentials"
                ? "use-credentials"
                : "anonymous";
          },
          set: function (w) {
            w == null ? this.removeAttribute(_) : this._setattr(_, w);
          },
        };
      }
      var m = {
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
        E = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        C = function (_, w, T) {
          M.call(this, _, w, T), (this._form = null);
        },
        M = (t.HTMLElement = l({
          superclass: n,
          name: "HTMLElement",
          ctor: function (w, T, b) {
            n.call(this, w, T, i.NAMESPACE.HTML, b);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (_) {
                this._innerHTML = _;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (_) {
                var w = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this,
                );
                w.parse(_ === null ? "" : String(_), !0);
                for (
                  var T = this instanceof c.template ? this.content : this;
                  T.hasChildNodes();

                )
                  T.removeChild(T.firstChild);
                T.appendChild(w._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new r(this)), this._style;
              },
              set: function (_) {
                _ == null && (_ = ""), this._setattr("style", String(_));
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
                    var _ = this.ownerDocument.createEvent("MouseEvent");
                    _.initMouseEvent(
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
                    var w = this.dispatchEvent(_);
                    w
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(_)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: i.nyi },
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
                return this.tagName in E || this.contentEditable ? 0 : -1;
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
        P = l({
          name: "HTMLUnknownElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        A = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      l({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (w, T, b) {
          M.call(this, w, T, b);
        },
        props: {
          _post_click_activation_steps: {
            value: function (_) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: u,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: m,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        s._inherit(c.a.prototype),
        l({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: u,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: m,
            noHref: Boolean,
          },
        }),
        s._inherit(c.area.prototype),
        l({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { clear: String },
        }),
        l({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { target: String },
        }),
        l({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
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
            formAction: u,
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
        l({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { value: String },
        }),
        l({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        l({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { open: Boolean },
        }),
        l({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            src: u,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        l({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: { disabled: Boolean, name: String },
        }),
        l({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        l({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        l({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { xmlns: u, version: String },
        }),
        l({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            src: u,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: m,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: u,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            alt: String,
            src: u,
            srcset: String,
            crossOrigin: d,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: m,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: u,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: u,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: {
            form: A.form,
            _post_click_activation_steps: {
              value: function (_) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var w = this.form.getElementsByName(this.name),
                      T = w.length - 1;
                    T >= 0;
                    T--
                  ) {
                    var b = w[T];
                    b.checked = b === this;
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
            src: u,
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
        l({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        l({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        l({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        l({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            href: u,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: d,
            nonce: String,
            integrity: String,
            referrerPolicy: m,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        l({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { name: String },
        }),
        l({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        l({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        l({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
        }),
        l({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { cite: u, dateTime: String },
        }),
        l({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            _numitems: {
              get: function () {
                var _ = 0;
                return (
                  this.childNodes.forEach(function (w) {
                    w.nodeType === e.ELEMENT_NODE && w.tagName === "LI" && _++;
                  }),
                  _
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
        l({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: {
            data: u,
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
            codeBase: u,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        l({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            form: {
              get: function () {
                for (
                  var _ = this.parentNode;
                  _ && _.nodeType === e.ELEMENT_NODE;

                ) {
                  if (_.localName === "select") return _.form;
                  _ = _.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (_) {
                this._setattr("value", _);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (_) {
                this.textContent = _;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        l({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: { name: String },
        }),
        l({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        l({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        l({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: A,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        l({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { cite: u },
        }),
        l({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            text: {
              get: function () {
                for (
                  var _ = "", w = 0, T = this.childNodes.length;
                  w < T;
                  w++
                ) {
                  var b = this.childNodes[w];
                  b.nodeType === e.TEXT_NODE && (_ += b._data);
                }
                return _;
              },
              set: function (_) {
                this.removeChildren(),
                  _ !== null &&
                    _ !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(_));
              },
            },
          },
          attributes: {
            src: u,
            type: String,
            charset: String,
            referrerPolicy: m,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: d,
            nonce: String,
            integrity: String,
          },
        }),
        l({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: {
            form: A.form,
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
        l({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        l({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        l({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { align: String },
        }),
        l({
          name: "HTMLTableCellElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b),
              (this._contentFragment = w._templateDoc.createDocumentFragment());
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
        l({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
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
        l({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (w, T, b) {
            C.call(this, w, T, b);
          },
          props: {
            form: A.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (_) {
                this.textContent = _;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (_) {
                this.defaultValue = _;
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
        l({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        l({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        l({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { type: String, compact: Boolean },
        }),
        l({
          name: "HTMLMediaElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            src: u,
            crossOrigin: d,
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
        l({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, b) {
            a.HTMLMediaElement.call(this, w, T, b);
          },
        }),
        l({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: a.HTMLMediaElement,
          ctor: function (w, T, b) {
            a.HTMLMediaElement.call(this, w, T, b);
          },
          attributes: {
            poster: u,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        l({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, b) {
            a.HTMLTableCellElement.call(this, w, T, b);
          },
        }),
        l({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, T, b) {
            a.HTMLTableCellElement.call(this, w, T, b);
          },
        }),
        l({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        l({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
        }),
        l({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            getContext: { value: i.nyi },
            probablySupportsContext: { value: i.nyi },
            setContext: { value: i.nyi },
            transferControlToProxy: { value: i.nyi },
            toDataURL: { value: i.nyi },
            toBlob: { value: i.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        l({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            show: { value: i.nyi },
            showModal: { value: i.nyi },
            close: { value: i.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        l({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          props: {
            _label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null && _ !== ""
                  ? _
                  : ((_ = this.textContent),
                    _.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var _ = this._getattr("label");
                return _ !== null ? _ : this._label;
              },
              set: function (_) {
                this._setattr("label", _);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: u,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        l({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: u,
            type: String,
            width: String,
            height: String,
          },
        }),
        l({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            src: u,
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
            readyState: { get: i.nyi },
            track: { get: i.nyi },
          },
        }),
        l({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        l({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (w, T, b) {
            M.call(this, w, T, b);
          },
          attributes: { compact: Boolean },
        }),
        l({
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
  fD = ae({
    "external/npm/node_modules/domino/lib/svg.js"(t) {
      "use strict";
      var e = Zo(),
        n = dD(),
        r = ot(),
        i = Nm(),
        s = (t.elements = {}),
        o = Object.create(null);
      t.createElement = function (l, u, d) {
        var m = o[u] || c;
        return new m(l, u, d);
      };
      function a(l) {
        return n(l, c, s, o);
      }
      var c = a({
        superclass: e,
        name: "SVGElement",
        ctor: function (u, d, m) {
          e.call(this, u, d, r.NAMESPACE.SVG, m);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new i(this)), this._style;
            },
          },
        },
      });
      a({
        name: "SVGSVGElement",
        ctor: function (u, d, m) {
          c.call(this, u, d, m);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return t.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        a({
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
  $O = ae({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(t, e) {
      "use strict";
      e.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  xm = ae({
    "external/npm/node_modules/domino/lib/Document.js"(t, e) {
      "use strict";
      e.exports = z;
      var n = bt(),
        r = Ss(),
        i = Tm(),
        s = Zo(),
        o = iD(),
        a = sD(),
        c = Yo(),
        l = oD(),
        u = aD(),
        d = wu(),
        m = HO(),
        E = UO(),
        C = bu(),
        M = Mm(),
        P = Cm(),
        A = lD(),
        _ = Sm(),
        w = Am(),
        T = fD(),
        b = ot(),
        J = $O(),
        ne = b.NAMESPACE,
        ve = _m().isApiWritable;
      function z(S, k) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_NODE),
          (this.isHTML = S),
          (this._address = k || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new d(this)),
          (this.ownerDocument = null),
          (this._contentType = S ? "text/html" : "application/xml"),
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
      var O = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        j = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        Y = function (S, k, q) {
          return {
            get: function () {
              var Ie = S.call(this);
              return Ie ? Ie[k] : q;
            },
            set: function (Ie) {
              var wt = S.call(this);
              wt && (wt[k] = Ie);
            },
          };
        };
      function v(S, k) {
        var q, Ie, wt;
        return (
          S === "" && (S = null),
          _.isValidQName(k) || b.InvalidCharacterError(),
          (q = null),
          (Ie = k),
          (wt = k.indexOf(":")),
          wt >= 0 && ((q = k.substring(0, wt)), (Ie = k.substring(wt + 1))),
          q !== null && S === null && b.NamespaceError(),
          q === "xml" && S !== ne.XML && b.NamespaceError(),
          (q === "xmlns" || k === "xmlns") &&
            S !== ne.XMLNS &&
            b.NamespaceError(),
          S === ne.XMLNS &&
            !(q === "xmlns" || k === "xmlns") &&
            b.NamespaceError(),
          { namespace: S, prefix: q, localName: Ie }
        );
      }
      z.prototype = Object.create(i.prototype, {
        _setMutationHandler: {
          value: function (S) {
            this.mutationHandler = S;
          },
        },
        _dispatchRendererEvent: {
          value: function (S, k, q) {
            var Ie = this._nodes[S];
            Ie && Ie._dispatchEvent(new c(k, q), !0);
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
          set: b.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (S) {
            return new o(this, String(S));
          },
        },
        createComment: {
          value: function (S) {
            return new a(this, S);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new l(this);
          },
        },
        createProcessingInstruction: {
          value: function (S, k) {
            return (
              (!_.isValidName(S) || k.indexOf("?>") !== -1) &&
                b.InvalidCharacterError(),
              new u(this, S, k)
            );
          },
        },
        createAttribute: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || b.InvalidCharacterError(),
              this.isHTML && (S = b.toASCIILowerCase(S)),
              new s._Attr(null, S, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var q = v(S, k);
            return new s._Attr(null, q.localName, q.prefix, q.namespace, "");
          },
        },
        createElement: {
          value: function (S) {
            return (
              (S = String(S)),
              _.isValidName(S) || b.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(S) && (S = b.toASCIILowerCase(S)),
                  w.createElement(this, S, null))
                : this.contentType === "application/xhtml+xml"
                  ? w.createElement(this, S, null)
                  : new s(this, S, null, null)
            );
          },
          writable: ve,
        },
        createElementNS: {
          value: function (S, k) {
            (S = S == null || S === "" ? null : String(S)), (k = String(k));
            var q = v(S, k);
            return this._createElementNS(q.localName, q.namespace, q.prefix);
          },
          writable: ve,
        },
        _createElementNS: {
          value: function (S, k, q) {
            return k === ne.HTML
              ? w.createElement(this, S, q)
              : k === ne.SVG
                ? T.createElement(this, S, q)
                : new s(this, S, k, q);
          },
        },
        createEvent: {
          value: function (k) {
            k = k.toLowerCase();
            var q = j[k] || k,
              Ie = A[O[q]];
            if (Ie) {
              var wt = new Ie();
              return (wt._initialized = !1), wt;
            } else b.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (S, k, q) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? C.SHOW_ALL : +k),
              (q = q === void 0 ? null : q),
              new m(S, k, q)
            );
          },
        },
        createNodeIterator: {
          value: function (S, k, q) {
            if (!S) throw new TypeError("root argument is required");
            if (!(S instanceof n)) throw new TypeError("root not a node");
            return (
              (k = k === void 0 ? C.SHOW_ALL : +k),
              (q = q === void 0 ? null : q),
              new E(S, k, q)
            );
          },
        },
        _attachNodeIterator: {
          value: function (S) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(S);
          },
        },
        _detachNodeIterator: {
          value: function (S) {
            var k = this._nodeIterators.indexOf(S);
            this._nodeIterators.splice(k, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (S) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (k) {
                k._preremove(S);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var k = this.firstChild; k !== null; k = k.nextSibling)
              k.nodeType === n.DOCUMENT_TYPE_NODE
                ? (this.doctype = k)
                : k.nodeType === n.ELEMENT_NODE && (this.documentElement = k);
          },
        },
        insertBefore: {
          value: function (k, q) {
            return (
              n.prototype.insertBefore.call(this, k, q),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        replaceChild: {
          value: function (k, q) {
            return (
              n.prototype.replaceChild.call(this, k, q),
              this._updateDocTypeElement(),
              q
            );
          },
        },
        removeChild: {
          value: function (k) {
            return (
              n.prototype.removeChild.call(this, k),
              this._updateDocTypeElement(),
              k
            );
          },
        },
        getElementById: {
          value: function (S) {
            var k = this.byId[S];
            return k ? (k instanceof ge ? k.getFirst() : k) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (S) {
            return this.byId[S] instanceof ge;
          },
        },
        getElementsByName: { value: s.prototype.getElementsByName },
        getElementsByTagName: { value: s.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: s.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: s.prototype.getElementsByClassName },
        adoptNode: {
          value: function (k) {
            return (
              k.nodeType === n.DOCUMENT_NODE && b.NotSupportedError(),
              k.nodeType === n.ATTRIBUTE_NODE ||
                (k.parentNode && k.parentNode.removeChild(k),
                k.ownerDocument !== this && K(k, this)),
              k
            );
          },
        },
        importNode: {
          value: function (k, q) {
            return this.adoptNode(k.cloneNode(q));
          },
          writable: ve,
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
        domain: { get: b.nyi, set: b.nyi },
        referrer: { get: b.nyi },
        cookie: { get: b.nyi, set: b.nyi },
        lastModified: { get: b.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: b.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var S = this._titleElement,
              k = S ? S.textContent : "";
            return k.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (S) {
            var k = this._titleElement,
              q = this.head;
            (!k && !q) ||
              (k || ((k = this.createElement("title")), q.appendChild(k)),
              (k.textContent = S));
          },
        },
        dir: Y(
          function () {
            var S = this.documentElement;
            if (S && S.tagName === "HTML") return S;
          },
          "dir",
          "",
        ),
        fgColor: Y(
          function () {
            return this.body;
          },
          "text",
          "",
        ),
        linkColor: Y(
          function () {
            return this.body;
          },
          "link",
          "",
        ),
        vlinkColor: Y(
          function () {
            return this.body;
          },
          "vLink",
          "",
        ),
        alinkColor: Y(
          function () {
            return this.body;
          },
          "aLink",
          "",
        ),
        bgColor: Y(
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
            return p(this.documentElement, "body");
          },
          set: b.nyi,
        },
        head: {
          get: function () {
            return p(this.documentElement, "head");
          },
        },
        images: { get: b.nyi },
        embeds: { get: b.nyi },
        plugins: { get: b.nyi },
        links: { get: b.nyi },
        forms: { get: b.nyi },
        scripts: { get: b.nyi },
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
          set: b.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: b.nyi,
        },
        write: {
          value: function (S) {
            if ((this.isHTML || b.InvalidStateError(), !!this._parser)) {
              this._parser;
              var k = arguments.join("");
              this._parser.parse(k);
            }
          },
        },
        writeln: {
          value: function (k) {
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
              this._dispatchEvent(new c("readystatechange"), !0),
              this._dispatchEvent(new c("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new c("load"), !0);
          },
        },
        clone: {
          value: function () {
            var k = new z(this.isHTML, this._address);
            return (
              (k._quirks = this._quirks),
              (k._contentType = this._contentType),
              k
            );
          },
        },
        cloneNode: {
          value: function (k) {
            var q = n.prototype.cloneNode.call(this, !1);
            if (k)
              for (var Ie = this.firstChild; Ie !== null; Ie = Ie.nextSibling)
                q._appendChild(q.importNode(Ie, !0));
            return q._updateDocTypeElement(), q;
          },
        },
        isEqual: {
          value: function (k) {
            return !0;
          },
        },
        mutateValue: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: J.VALUE, target: S, data: S.data });
          },
        },
        mutateAttr: {
          value: function (S, k) {
            this.mutationHandler &&
              this.mutationHandler({
                type: J.ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: J.REMOVE_ATTR,
                target: S.ownerElement,
                attr: S,
              });
          },
        },
        mutateRemove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({
                type: J.REMOVE,
                target: S.parentNode,
                node: S,
              }),
              V(S);
          },
        },
        mutateInsert: {
          value: function (S) {
            R(S),
              this.mutationHandler &&
                this.mutationHandler({
                  type: J.INSERT,
                  target: S.parentNode,
                  node: S,
                });
          },
        },
        mutateMove: {
          value: function (S) {
            this.mutationHandler &&
              this.mutationHandler({ type: J.MOVE, target: S });
          },
        },
        addId: {
          value: function (k, q) {
            var Ie = this.byId[k];
            Ie
              ? (Ie instanceof ge || ((Ie = new ge(Ie)), (this.byId[k] = Ie)),
                Ie.add(q))
              : (this.byId[k] = q);
          },
        },
        delId: {
          value: function (k, q) {
            var Ie = this.byId[k];
            b.assert(Ie),
              Ie instanceof ge
                ? (Ie.del(q),
                  Ie.length === 1 && (this.byId[k] = Ie.downgrade()))
                : (this.byId[k] = void 0);
          },
        },
        _resolve: {
          value: function (S) {
            return new M(this._documentBaseURL).resolve(S);
          },
        },
        _documentBaseURL: {
          get: function () {
            var S = this._address;
            S === "about:blank" && (S = "/");
            var k = this.querySelector("base[href]");
            return k ? new M(S).resolve(k.getAttribute("href")) : S;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var S = new z(this.isHTML, this._address);
              this._templateDocCache = S._templateDocCache = S;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (S) {
            return P(S, this)[0];
          },
        },
        querySelectorAll: {
          value: function (S) {
            var k = P(S, this);
            return k.item ? k : new r(k);
          },
        },
      });
      var g = [
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
      g.forEach(function (S) {
        Object.defineProperty(z.prototype, "on" + S, {
          get: function () {
            return this._getEventHandler(S);
          },
          set: function (k) {
            this._setEventHandler(S, k);
          },
        });
      });
      function p(S, k) {
        if (S && S.isHTML) {
          for (var q = S.firstChild; q !== null; q = q.nextSibling)
            if (
              q.nodeType === n.ELEMENT_NODE &&
              q.localName === k &&
              q.namespaceURI === ne.HTML
            )
              return q;
        }
        return null;
      }
      function y(S) {
        if (
          ((S._nid = S.ownerDocument._nextnid++),
          (S.ownerDocument._nodes[S._nid] = S),
          S.nodeType === n.ELEMENT_NODE)
        ) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.addId(k, S), S._roothook && S._roothook();
        }
      }
      function I(S) {
        if (S.nodeType === n.ELEMENT_NODE) {
          var k = S.getAttribute("id");
          k && S.ownerDocument.delId(k, S);
        }
        (S.ownerDocument._nodes[S._nid] = void 0), (S._nid = void 0);
      }
      function R(S) {
        if ((y(S), S.nodeType === n.ELEMENT_NODE))
          for (var k = S.firstChild; k !== null; k = k.nextSibling) R(k);
      }
      function V(S) {
        I(S);
        for (var k = S.firstChild; k !== null; k = k.nextSibling) V(k);
      }
      function K(S, k) {
        (S.ownerDocument = k),
          (S._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(S, "_tagName") &&
            (S._tagName = void 0);
        for (var q = S.firstChild; q !== null; q = q.nextSibling) K(q, k);
      }
      function ge(S) {
        (this.nodes = Object.create(null)),
          (this.nodes[S._nid] = S),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (ge.prototype.add = function (S) {
        this.nodes[S._nid] ||
          ((this.nodes[S._nid] = S), this.length++, (this.firstNode = void 0));
      }),
        (ge.prototype.del = function (S) {
          this.nodes[S._nid] &&
            (delete this.nodes[S._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (ge.prototype.getFirst = function () {
          if (!this.firstNode) {
            var S;
            for (S in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[S]) &
                  n.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[S]);
          }
          return this.firstNode;
        }),
        (ge.prototype.downgrade = function () {
          if (this.length === 1) {
            var S;
            for (S in this.nodes) return this.nodes[S];
          }
          return this;
        });
    },
  }),
  Rm = ae({
    "external/npm/node_modules/domino/lib/DocumentType.js"(t, e) {
      "use strict";
      e.exports = s;
      var n = bt(),
        r = rD(),
        i = Im();
      function s(o, a, c, l) {
        r.call(this),
          (this.nodeType = n.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = o || null),
          (this.name = a),
          (this.publicId = c || ""),
          (this.systemId = l || "");
      }
      (s.prototype = Object.create(r.prototype, {
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
            return new s(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId,
            );
          },
        },
        isEqual: {
          value: function (a) {
            return (
              this.name === a.name &&
              this.publicId === a.publicId &&
              this.systemId === a.systemId
            );
          },
        },
      })),
        Object.defineProperties(s.prototype, i);
    },
  }),
  Om = ae({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(t, e) {
      "use strict";
      e.exports = Re;
      var n = xm(),
        r = Rm(),
        i = bt(),
        s = ot().NAMESPACE,
        o = Am(),
        a = o.elements,
        c = Function.prototype.apply.bind(Array.prototype.push),
        l = -1,
        u = 1,
        d = 2,
        m = 3,
        E = 4,
        C = 5,
        M = [],
        P =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        A = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        _ =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        w =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        T = Object.create(null);
      (T[s.HTML] = {
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
        (T[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (T[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var b = Object.create(null);
      b[s.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var J = Object.create(null);
      J[s.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var ne = Object.create(null);
      ne[s.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var ve = Object.create(null);
      ve[s.HTML] = {
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
      var z = Object.create(null);
      z[s.HTML] = {
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
      var O = Object.create(null);
      O[s.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var j = Object.create(null);
      j[s.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var Y = Object.create(null);
      Y[s.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var v = Object.create(null);
      v[s.HTML] = {
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
      var g = Object.create(null);
      (g[s.HTML] = {
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
        (g[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (g[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var p = Object.create(g);
      (p[s.HTML] = Object.create(g[s.HTML])),
        (p[s.HTML].ol = !0),
        (p[s.HTML].ul = !0);
      var y = Object.create(g);
      (y[s.HTML] = Object.create(g[s.HTML])), (y[s.HTML].button = !0);
      var I = Object.create(null);
      I[s.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var R = Object.create(null);
      R[s.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var V = Object.create(null);
      V[s.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var K = Object.create(null);
      K[s.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var ge = {
          __proto__: null,
          "xlink:actuate": s.XLINK,
          "xlink:arcrole": s.XLINK,
          "xlink:href": s.XLINK,
          "xlink:role": s.XLINK,
          "xlink:show": s.XLINK,
          "xlink:title": s.XLINK,
          "xlink:type": s.XLINK,
          "xml:base": s.XML,
          "xml:lang": s.XML,
          "xml:space": s.XML,
          xmlns: s.XMLNS,
          "xmlns:xlink": s.XMLNS,
        },
        S = {
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
        k = {
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
        q = {
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
        Ie = {
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
        wt =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        ut = 32,
        kn = /[^\r"&\u0000]+/g,
        At = /[^\r'&\u0000]+/g,
        Ri = /[^\r\t\n\f &>\u0000]+/g,
        Ls = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        t_ = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        n_ = /[^\]\r\u0000\uffff]*/g,
        r_ = /[^&<\r\u0000\uffff]*/g,
        bg = /[^<\r\u0000\uffff]*/g,
        i_ = /[^\r\u0000\uffff]*/g,
        wg = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        Dg =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        ma = /[^\x09\x0A\x0C\x0D\x20]/,
        Bu = /[^\x09\x0A\x0C\x0D\x20]/g,
        s_ = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        qr = /^[\x09\x0A\x0C\x0D\x20]+/,
        ga = /\x00/g;
      function gt(B) {
        var U = 16384;
        if (B.length < U) return String.fromCharCode.apply(String, B);
        for (var se = "", X = 0; X < B.length; X += U)
          se += String.fromCharCode.apply(String, B.slice(X, X + U));
        return se;
      }
      function o_(B) {
        for (var U = [], se = 0; se < B.length; se++) U[se] = B.charCodeAt(se);
        return U;
      }
      function Fe(B, U) {
        if (typeof U == "string")
          return B.namespaceURI === s.HTML && B.localName === U;
        var se = U[B.namespaceURI];
        return se && se[B.localName];
      }
      function _g(B) {
        return Fe(B, V);
      }
      function Tg(B) {
        if (Fe(B, K)) return !0;
        if (B.namespaceURI === s.MATHML && B.localName === "annotation-xml") {
          var U = B.getAttribute("encoding");
          if (
            (U && (U = U.toLowerCase()),
            U === "text/html" || U === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function a_(B) {
        return B in k ? k[B] : B;
      }
      function Sg(B) {
        for (var U = 0, se = B.length; U < se; U++)
          B[U][0] in S && (B[U][0] = S[B[U][0]]);
      }
      function Cg(B) {
        for (var U = 0, se = B.length; U < se; U++)
          if (B[U][0] === "definitionurl") {
            B[U][0] = "definitionURL";
            break;
          }
      }
      function Hu(B) {
        for (var U = 0, se = B.length; U < se; U++)
          B[U][0] in ge && B[U].push(ge[B[U][0]]);
      }
      function Ig(B, U) {
        for (var se = 0, X = B.length; se < X; se++) {
          var Ge = B[se][0],
            te = B[se][1];
          U.hasAttribute(Ge) || U._setAttribute(Ge, te);
        }
      }
      (Re.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (Re.ElementStack.prototype.push = function (B) {
          this.elements.push(B), (this.top = B);
        }),
        (Re.ElementStack.prototype.pop = function (B) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (Re.ElementStack.prototype.popTag = function (B) {
          for (var U = this.elements.length - 1; U > 0; U--) {
            var se = this.elements[U];
            if (Fe(se, B)) break;
          }
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Re.ElementStack.prototype.popElementType = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !(this.elements[U] instanceof B);
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Re.ElementStack.prototype.popElement = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && this.elements[U] !== B;
            U--
          );
          (this.elements.length = U), (this.top = this.elements[U - 1]);
        }),
        (Re.ElementStack.prototype.removeElement = function (B) {
          if (this.top === B) this.pop();
          else {
            var U = this.elements.lastIndexOf(B);
            U !== -1 && this.elements.splice(U, 1);
          }
        }),
        (Re.ElementStack.prototype.clearToContext = function (B) {
          for (
            var U = this.elements.length - 1;
            U > 0 && !Fe(this.elements[U], B);
            U--
          );
          (this.elements.length = U + 1), (this.top = this.elements[U]);
        }),
        (Re.ElementStack.prototype.contains = function (B) {
          return this.inSpecificScope(B, Object.create(null));
        }),
        (Re.ElementStack.prototype.inSpecificScope = function (B, U) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (Fe(X, B)) return !0;
            if (Fe(X, U)) return !1;
          }
          return !1;
        }),
        (Re.ElementStack.prototype.elementInSpecificScope = function (B, U) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (X === B) return !0;
            if (Fe(X, U)) return !1;
          }
          return !1;
        }),
        (Re.ElementStack.prototype.elementTypeInSpecificScope = function (
          B,
          U,
        ) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (X instanceof B) return !0;
            if (Fe(X, U)) return !1;
          }
          return !1;
        }),
        (Re.ElementStack.prototype.inScope = function (B) {
          return this.inSpecificScope(B, g);
        }),
        (Re.ElementStack.prototype.elementInScope = function (B) {
          return this.elementInSpecificScope(B, g);
        }),
        (Re.ElementStack.prototype.elementTypeInScope = function (B) {
          return this.elementTypeInSpecificScope(B, g);
        }),
        (Re.ElementStack.prototype.inButtonScope = function (B) {
          return this.inSpecificScope(B, y);
        }),
        (Re.ElementStack.prototype.inListItemScope = function (B) {
          return this.inSpecificScope(B, p);
        }),
        (Re.ElementStack.prototype.inTableScope = function (B) {
          return this.inSpecificScope(B, I);
        }),
        (Re.ElementStack.prototype.inSelectScope = function (B) {
          for (var U = this.elements.length - 1; U >= 0; U--) {
            var se = this.elements[U];
            if (se.namespaceURI !== s.HTML) return !1;
            var X = se.localName;
            if (X === B) return !0;
            if (X !== "optgroup" && X !== "option") return !1;
          }
          return !1;
        }),
        (Re.ElementStack.prototype.generateImpliedEndTags = function (B, U) {
          for (var se = U ? z : ve, X = this.elements.length - 1; X >= 0; X--) {
            var Ge = this.elements[X];
            if ((B && Fe(Ge, B)) || !Fe(this.elements[X], se)) break;
          }
          (this.elements.length = X + 1), (this.top = this.elements[X]);
        }),
        (Re.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (Re.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (Re.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (Re.ActiveFormattingElements.prototype.push = function (B, U) {
          for (
            var se = 0, X = this.list.length - 1;
            X >= 0 && this.list[X] !== this.MARKER;
            X--
          )
            if ($r(B, this.list[X], this.attrs[X]) && (se++, se === 3)) {
              this.list.splice(X, 1), this.attrs.splice(X, 1);
              break;
            }
          this.list.push(B);
          for (var Ge = [], te = 0; te < U.length; te++) Ge[te] = U[te];
          this.attrs.push(Ge);
          function $r(rr, zr, Ln) {
            if (rr.localName !== zr.localName || rr._numattrs !== Ln.length)
              return !1;
            for (var xt = 0, ya = Ln.length; xt < ya; xt++) {
              var Gr = Ln[xt][0],
                x = Ln[xt][1];
              if (!rr.hasAttribute(Gr) || rr.getAttribute(Gr) !== x) return !1;
            }
            return !0;
          }
        }),
        (Re.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var B = this.list.length - 1;
            B >= 0 && this.list[B] !== this.MARKER;
            B--
          );
          B < 0 && (B = 0), (this.list.length = B), (this.attrs.length = B);
        }),
        (Re.ActiveFormattingElements.prototype.findElementByTag = function (B) {
          for (var U = this.list.length - 1; U >= 0; U--) {
            var se = this.list[U];
            if (se === this.MARKER) break;
            if (se.localName === B) return se;
          }
          return null;
        }),
        (Re.ActiveFormattingElements.prototype.indexOf = function (B) {
          return this.list.lastIndexOf(B);
        }),
        (Re.ActiveFormattingElements.prototype.remove = function (B) {
          var U = this.list.lastIndexOf(B);
          U !== -1 && (this.list.splice(U, 1), this.attrs.splice(U, 1));
        }),
        (Re.ActiveFormattingElements.prototype.replace = function (B, U, se) {
          var X = this.list.lastIndexOf(B);
          X !== -1 && ((this.list[X] = U), (this.attrs[X] = se));
        }),
        (Re.ActiveFormattingElements.prototype.insertAfter = function (B, U) {
          var se = this.list.lastIndexOf(B);
          se !== -1 &&
            (this.list.splice(se, 0, U), this.attrs.splice(se, 0, U));
        });
      function Re(B, U, se) {
        var X = null,
          Ge = 0,
          te = 0,
          $r = !1,
          rr = !1,
          zr = 0,
          Ln = [],
          xt = "",
          ya = !0,
          Gr = 0,
          x = Me,
          ir,
          Ze,
          je = "",
          va = "",
          Be = [],
          Pt = "",
          Rt = "",
          qe = [],
          sr = [],
          or = [],
          ar = [],
          nn = [],
          Ea = !1,
          H = iT,
          Pn = null,
          Fn = [],
          N = new Re.ElementStack(),
          Se = new Re.ActiveFormattingElements(),
          Wr = U !== void 0,
          ba = null,
          jn = null,
          wa = !0;
        U && (wa = U.ownerDocument._scripting_enabled),
          se && se.scripting_enabled === !1 && (wa = !1);
        var Xe = !0,
          Uu = !1,
          Da,
          Vu,
          W = [],
          cr = !1,
          Qr = !1,
          _a = {
            document: function () {
              return Oe;
            },
            _asDocumentFragment: function () {
              for (
                var f = Oe.createDocumentFragment(), h = Oe.firstChild;
                h.hasChildNodes();

              )
                f.appendChild(h.firstChild);
              return f;
            },
            pause: function () {
              Gr++;
            },
            resume: function () {
              Gr--, this.parse("");
            },
            parse: function (f, h, D) {
              var L;
              return Gr > 0
                ? ((xt += f), !0)
                : (zr === 0
                    ? (xt && ((f = xt + f), (xt = "")),
                      h && ((f += "\uFFFF"), ($r = !0)),
                      (X = f),
                      (Ge = f.length),
                      (te = 0),
                      ya && ((ya = !1), X.charCodeAt(0) === 65279 && (te = 1)),
                      zr++,
                      (L = Ng(D)),
                      (xt = X.substring(te, Ge)),
                      zr--)
                    : (zr++,
                      Ln.push(X, Ge, te),
                      (X = f),
                      (Ge = f.length),
                      (te = 0),
                      Ng(),
                      (L = !1),
                      (xt = X.substring(te, Ge)),
                      (te = Ln.pop()),
                      (Ge = Ln.pop()),
                      (X = Ln.pop()),
                      xt &&
                        ((X = xt + X.substring(te)),
                        (Ge = X.length),
                        (te = 0),
                        (xt = "")),
                      zr--),
                  L);
            },
          },
          Oe = new n(!0, B);
        if (((Oe._parser = _a), (Oe._scripting_enabled = wa), U)) {
          if (
            (U.ownerDocument._quirks && (Oe._quirks = !0),
            U.ownerDocument._limitedQuirks && (Oe._limitedQuirks = !0),
            U.namespaceURI === s.HTML)
          )
            switch (U.localName) {
              case "title":
              case "textarea":
                x = fr;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                x = Wu;
                break;
            }
          var Mg = Oe.createElement("html");
          Oe._appendChild(Mg),
            N.push(Mg),
            U instanceof a.HTMLTemplateElement && Fn.push(rd),
            Us();
          for (var Ps = U; Ps !== null; Ps = Ps.parentElement)
            if (Ps instanceof a.HTMLFormElement) {
              jn = Ps;
              break;
            }
        }
        function Ng(f) {
          for (var h, D, L, F; te < Ge; ) {
            if (Gr > 0 || (f && f())) return !0;
            switch (typeof x.lookahead) {
              case "undefined":
                if (((h = X.charCodeAt(te++)), rr && ((rr = !1), h === 10))) {
                  te++;
                  continue;
                }
                switch (h) {
                  case 13:
                    te < Ge ? X.charCodeAt(te) === 10 && te++ : (rr = !0),
                      x(10);
                    break;
                  case 65535:
                    if ($r && te === Ge) {
                      x(l);
                      break;
                    }
                  default:
                    x(h);
                    break;
                }
                break;
              case "number":
                h = X.charCodeAt(te);
                var Q = x.lookahead,
                  le = !0;
                if ((Q < 0 && ((le = !1), (Q = -Q)), Q < Ge - te))
                  (D = le ? X.substring(te, te + Q) : null), (F = !1);
                else if ($r)
                  (D = le ? X.substring(te, Ge) : null),
                    (F = !0),
                    h === 65535 && te === Ge - 1 && (h = l);
                else return !0;
                x(h, D, F);
                break;
              case "string":
                (h = X.charCodeAt(te)), (L = x.lookahead);
                var Ne = X.indexOf(L, te);
                if (Ne !== -1) (D = X.substring(te, Ne + L.length)), (F = !1);
                else {
                  if (!$r) return !0;
                  (D = X.substring(te, Ge)),
                    h === 65535 && te === Ge - 1 && (h = l),
                    (F = !0);
                }
                x(h, D, F);
                break;
            }
          }
          return !1;
        }
        function lr(f, h) {
          for (var D = 0; D < nn.length; D++) if (nn[D][0] === f) return;
          h !== void 0 ? nn.push([f, h]) : nn.push([f]);
        }
        function c_() {
          Dg.lastIndex = te - 1;
          var f = Dg.exec(X);
          if (!f) throw new Error("should never happen");
          var h = f[1];
          if (!h) return !1;
          var D = f[2],
            L = D.length;
          switch (D[0]) {
            case '"':
            case "'":
              (D = D.substring(1, L - 1)), (te += f[0].length - 1), (x = Zu);
              break;
            default:
              (x = vn), (te += f[0].length - 1), (D = D.substring(0, L - 1));
              break;
          }
          for (var F = 0; F < nn.length; F++) if (nn[F][0] === h) return !0;
          return nn.push([h, D]), !0;
        }
        function l_() {
          (Ea = !1), (je = ""), (nn.length = 0);
        }
        function Fs() {
          (Ea = !0), (je = ""), (nn.length = 0);
        }
        function Bn() {
          Be.length = 0;
        }
        function qu() {
          Pt = "";
        }
        function $u() {
          Rt = "";
        }
        function Ag() {
          qe.length = 0;
        }
        function Oi() {
          (sr.length = 0), (or = null), (ar = null);
        }
        function Ta() {
          or = [];
        }
        function ur() {
          ar = [];
        }
        function ke() {
          Uu = !0;
        }
        function u_() {
          return N.top && N.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function Qt(f) {
          return va === f;
        }
        function ki() {
          if (W.length > 0) {
            var f = gt(W);
            if (
              ((W.length = 0),
              Qr &&
                ((Qr = !1),
                f[0] ===
                  `
` && (f = f.substring(1)),
                f.length === 0))
            )
              return;
            tt(u, f), (cr = !1);
          }
          Qr = !1;
        }
        function js(f) {
          f.lastIndex = te - 1;
          var h = f.exec(X);
          if (h && h.index === te - 1)
            return (
              (h = h[0]),
              (te += h.length - 1),
              $r && te === Ge && ((h = h.slice(0, -1)), te--),
              h
            );
          throw new Error("should never happen");
        }
        function Bs(f) {
          f.lastIndex = te - 1;
          var h = f.exec(X)[0];
          return h ? (d_(h), (te += h.length - 1), !0) : !1;
        }
        function d_(f) {
          W.length > 0 && ki(),
            !(
              Qr &&
              ((Qr = !1),
              f[0] ===
                `
` && (f = f.substring(1)),
              f.length === 0)
            ) && tt(u, f);
        }
        function Hn() {
          if (Ea) tt(m, je);
          else {
            var f = je;
            (je = ""), (va = f), tt(d, f, nn);
          }
        }
        function f_() {
          if (te === Ge) return !1;
          wg.lastIndex = te;
          var f = wg.exec(X);
          if (!f) throw new Error("should never happen");
          var h = f[2];
          if (!h) return !1;
          var D = f[1];
          return (
            D
              ? ((te += h.length + 2), tt(m, h))
              : ((te += h.length + 1), (va = h), tt(d, h, M)),
            !0
          );
        }
        function h_() {
          Ea ? tt(m, je, null, !0) : tt(d, je, nn, !0);
        }
        function Le() {
          tt(C, gt(sr), or ? gt(or) : void 0, ar ? gt(ar) : void 0);
        }
        function we() {
          ki(), H(l), (Oe.modclock = 1);
        }
        var tt = (_a.insertToken = function (h, D, L, F) {
          ki();
          var Q = N.top;
          !Q || Q.namespaceURI === s.HTML
            ? H(h, D, L, F)
            : h !== d && h !== u
              ? Gg(h, D, L, F)
              : (_g(Q) &&
                    (h === u ||
                      (h === d && D !== "mglyph" && D !== "malignmark"))) ||
                  (h === d &&
                    D === "svg" &&
                    Q.namespaceURI === s.MATHML &&
                    Q.localName === "annotation-xml") ||
                  Tg(Q)
                ? ((Vu = !0), H(h, D, L, F), (Vu = !1))
                : Gg(h, D, L, F);
        });
        function mn(f) {
          var h = N.top;
          dr && Fe(h, ne)
            ? Ca(function (D) {
                return D.createComment(f);
              })
            : (h instanceof a.HTMLTemplateElement && (h = h.content),
              h._appendChild(h.ownerDocument.createComment(f)));
        }
        function gn(f) {
          var h = N.top;
          if (dr && Fe(h, ne))
            Ca(function (L) {
              return L.createTextNode(f);
            });
          else {
            h instanceof a.HTMLTemplateElement && (h = h.content);
            var D = h.lastChild;
            D && D.nodeType === i.TEXT_NODE
              ? D.appendData(f)
              : h._appendChild(h.ownerDocument.createTextNode(f));
          }
        }
        function Hs(f, h, D) {
          var L = o.createElement(f, h, null);
          if (D)
            for (var F = 0, Q = D.length; F < Q; F++)
              L._setAttribute(D[F][0], D[F][1]);
          return L;
        }
        var dr = !1;
        function pe(f, h) {
          var D = Sa(function (L) {
            return Hs(L, f, h);
          });
          return Fe(D, v) && (D._form = jn), D;
        }
        function Sa(f) {
          var h;
          return (
            dr && Fe(N.top, ne)
              ? (h = Ca(f))
              : N.top instanceof a.HTMLTemplateElement
                ? ((h = f(N.top.content.ownerDocument)),
                  N.top.content._appendChild(h))
                : ((h = f(N.top.ownerDocument)), N.top._appendChild(h)),
            N.push(h),
            h
          );
        }
        function zu(f, h, D) {
          return Sa(function (L) {
            var F = L._createElementNS(f, D, null);
            if (h)
              for (var Q = 0, le = h.length; Q < le; Q++) {
                var Ne = h[Q];
                Ne.length === 2
                  ? F._setAttribute(Ne[0], Ne[1])
                  : F._setAttributeNS(Ne[2], Ne[0], Ne[1]);
              }
            return F;
          });
        }
        function xg(f) {
          for (var h = N.elements.length - 1; h >= 0; h--)
            if (N.elements[h] instanceof f) return h;
          return -1;
        }
        function Ca(f) {
          var h,
            D,
            L = -1,
            F = -1,
            Q;
          if (
            ((L = xg(a.HTMLTableElement)),
            (F = xg(a.HTMLTemplateElement)),
            F >= 0 && (L < 0 || F > L)
              ? (h = N.elements[F])
              : L >= 0 &&
                ((h = N.elements[L].parentNode),
                h ? (D = N.elements[L]) : (h = N.elements[L - 1])),
            h || (h = N.elements[0]),
            h instanceof a.HTMLTemplateElement && (h = h.content),
            (Q = f(h.ownerDocument)),
            Q.nodeType === i.TEXT_NODE)
          ) {
            var le;
            if (
              (D ? (le = D.previousSibling) : (le = h.lastChild),
              le && le.nodeType === i.TEXT_NODE)
            )
              return le.appendData(Q.data), Q;
          }
          return D ? h.insertBefore(Q, D) : h._appendChild(Q), Q;
        }
        function Us() {
          for (var f = !1, h = N.elements.length - 1; h >= 0; h--) {
            var D = N.elements[h];
            if (
              (h === 0 && ((f = !0), Wr && (D = U)), D.namespaceURI === s.HTML)
            ) {
              var L = D.localName;
              switch (L) {
                case "select":
                  for (var F = h; F > 0; ) {
                    var Q = N.elements[--F];
                    if (Q instanceof a.HTMLTemplateElement) break;
                    if (Q instanceof a.HTMLTableElement) {
                      H = Ha;
                      return;
                    }
                  }
                  H = Un;
                  return;
                case "tr":
                  H = $s;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  H = Xr;
                  return;
                case "caption":
                  H = nd;
                  return;
                case "colgroup":
                  H = Ba;
                  return;
                case "table":
                  H = Kt;
                  return;
                case "template":
                  H = Fn[Fn.length - 1];
                  return;
                case "body":
                  H = ce;
                  return;
                case "frameset":
                  H = id;
                  return;
                case "html":
                  ba === null ? (H = Fa) : (H = td);
                  return;
                default:
                  if (!f) {
                    if (L === "head") {
                      H = Je;
                      return;
                    }
                    if (L === "td" || L === "th") {
                      H = Li;
                      return;
                    }
                  }
              }
            }
            if (f) {
              H = ce;
              return;
            }
          }
        }
        function Ia(f, h) {
          pe(f, h), (x = Vs), (Pn = H), (H = ja);
        }
        function p_(f, h) {
          pe(f, h), (x = fr), (Pn = H), (H = ja);
        }
        function Gu(f, h) {
          return {
            elt: Hs(f, Se.list[h].localName, Se.attrs[h]),
            attrs: Se.attrs[h],
          };
        }
        function Dt() {
          if (Se.list.length !== 0) {
            var f = Se.list[Se.list.length - 1];
            if (f !== Se.MARKER && N.elements.lastIndexOf(f) === -1) {
              for (
                var h = Se.list.length - 2;
                h >= 0 &&
                ((f = Se.list[h]),
                !(f === Se.MARKER || N.elements.lastIndexOf(f) !== -1));
                h--
              );
              for (h = h + 1; h < Se.list.length; h++) {
                var D = Sa(function (L) {
                  return Gu(L, h).elt;
                });
                Se.list[h] = D;
              }
            }
          }
        }
        var Ma = { localName: "BM" };
        function m_(f) {
          if (Fe(N.top, f) && Se.indexOf(N.top) === -1) return N.pop(), !0;
          for (var h = 0; h < 8; ) {
            h++;
            var D = Se.findElementByTag(f);
            if (!D) return !1;
            var L = N.elements.lastIndexOf(D);
            if (L === -1) return Se.remove(D), !0;
            if (!N.elementInScope(D)) return !0;
            for (var F = null, Q, le = L + 1; le < N.elements.length; le++)
              if (Fe(N.elements[le], T)) {
                (F = N.elements[le]), (Q = le);
                break;
              }
            if (F) {
              var Ne = N.elements[L - 1];
              Se.insertAfter(D, Ma);
              for (
                var Qe = F, ft = F, Yt = Q, rn, Jr = 0;
                Jr++, (Qe = N.elements[--Yt]), Qe !== D;

              ) {
                if (
                  ((rn = Se.indexOf(Qe)),
                  Jr > 3 && rn !== -1 && (Se.remove(Qe), (rn = -1)),
                  rn === -1)
                ) {
                  N.removeElement(Qe);
                  continue;
                }
                var yr = Gu(Ne.ownerDocument, rn);
                Se.replace(Qe, yr.elt, yr.attrs),
                  (N.elements[Yt] = yr.elt),
                  (Qe = yr.elt),
                  ft === F && (Se.remove(Ma), Se.insertAfter(yr.elt, Ma)),
                  Qe._appendChild(ft),
                  (ft = Qe);
              }
              dr && Fe(Ne, ne)
                ? Ca(function () {
                    return ft;
                  })
                : Ne instanceof a.HTMLTemplateElement
                  ? Ne.content._appendChild(ft)
                  : Ne._appendChild(ft);
              for (
                var zs = Gu(F.ownerDocument, Se.indexOf(D));
                F.hasChildNodes();

              )
                zs.elt._appendChild(F.firstChild);
              F._appendChild(zs.elt),
                Se.remove(D),
                Se.replace(Ma, zs.elt, zs.attrs),
                N.removeElement(D);
              var lT = N.elements.lastIndexOf(F);
              N.elements.splice(lT + 1, 0, zs.elt);
            } else return N.popElement(D), Se.remove(D), !0;
          }
          return !0;
        }
        function g_() {
          N.pop(), (H = Pn);
        }
        function Kr() {
          delete Oe._parser,
            (N.elements.length = 0),
            Oe.defaultView &&
              Oe.defaultView.dispatchEvent(new a.Event("load", {}));
        }
        function re(f, h) {
          (x = h), te--;
        }
        function Me(f) {
          switch (f) {
            case 38:
              (ir = Me), (x = qs);
              break;
            case 60:
              if (f_()) break;
              x = y_;
              break;
            case 0:
              W.push(f), (cr = !0);
              break;
            case -1:
              we();
              break;
            default:
              Bs(r_) || W.push(f);
              break;
          }
        }
        function fr(f) {
          switch (f) {
            case 38:
              (ir = fr), (x = qs);
              break;
            case 60:
              x = E_;
              break;
            case 0:
              W.push(65533), (cr = !0);
              break;
            case -1:
              we();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function Vs(f) {
          switch (f) {
            case 60:
              x = D_;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              Bs(bg) || W.push(f);
              break;
          }
        }
        function hr(f) {
          switch (f) {
            case 60:
              x = S_;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              Bs(bg) || W.push(f);
              break;
          }
        }
        function Wu(f) {
          switch (f) {
            case 0:
              W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              Bs(i_) || W.push(f);
              break;
          }
        }
        function y_(f) {
          switch (f) {
            case 33:
              x = Lg;
              break;
            case 47:
              x = v_;
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
              l_(), re(f, Rg);
              break;
            case 63:
              re(f, Ra);
              break;
            default:
              W.push(60), re(f, Me);
              break;
          }
        }
        function v_(f) {
          switch (f) {
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
              Fs(), re(f, Rg);
              break;
            case 62:
              x = Me;
              break;
            case -1:
              W.push(60), W.push(47), we();
              break;
            default:
              re(f, Ra);
              break;
          }
        }
        function Rg(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = vn;
              break;
            case 47:
              x = mr;
              break;
            case 62:
              (x = Me), Hn();
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
              je += String.fromCharCode(f + 32);
              break;
            case 0:
              je += "\uFFFD";
              break;
            case -1:
              we();
              break;
            default:
              je += js(Ls);
              break;
          }
        }
        function E_(f) {
          f === 47 ? (Bn(), (x = b_)) : (W.push(60), re(f, fr));
        }
        function b_(f) {
          switch (f) {
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
              Fs(), re(f, w_);
              break;
            default:
              W.push(60), W.push(47), re(f, fr);
              break;
          }
        }
        function w_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qt(je)) {
                x = vn;
                return;
              }
              break;
            case 47:
              if (Qt(je)) {
                x = mr;
                return;
              }
              break;
            case 62:
              if (Qt(je)) {
                (x = Me), Hn();
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
              (je += String.fromCharCode(f + 32)), Be.push(f);
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
              (je += String.fromCharCode(f)), Be.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Be), re(f, fr);
        }
        function D_(f) {
          f === 47 ? (Bn(), (x = __)) : (W.push(60), re(f, Vs));
        }
        function __(f) {
          switch (f) {
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
              Fs(), re(f, T_);
              break;
            default:
              W.push(60), W.push(47), re(f, Vs);
              break;
          }
        }
        function T_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qt(je)) {
                x = vn;
                return;
              }
              break;
            case 47:
              if (Qt(je)) {
                x = mr;
                return;
              }
              break;
            case 62:
              if (Qt(je)) {
                (x = Me), Hn();
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
              (je += String.fromCharCode(f + 32)), Be.push(f);
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
              (je += String.fromCharCode(f)), Be.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Be), re(f, Vs);
        }
        function S_(f) {
          switch (f) {
            case 47:
              Bn(), (x = C_);
              break;
            case 33:
              (x = M_), W.push(60), W.push(33);
              break;
            default:
              W.push(60), re(f, hr);
              break;
          }
        }
        function C_(f) {
          switch (f) {
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
              Fs(), re(f, I_);
              break;
            default:
              W.push(60), W.push(47), re(f, hr);
              break;
          }
        }
        function I_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qt(je)) {
                x = vn;
                return;
              }
              break;
            case 47:
              if (Qt(je)) {
                x = mr;
                return;
              }
              break;
            case 62:
              if (Qt(je)) {
                (x = Me), Hn();
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
              (je += String.fromCharCode(f + 32)), Be.push(f);
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
              (je += String.fromCharCode(f)), Be.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Be), re(f, hr);
        }
        function M_(f) {
          f === 45 ? ((x = N_), W.push(45)) : re(f, hr);
        }
        function N_(f) {
          f === 45 ? ((x = Og), W.push(45)) : re(f, hr);
        }
        function yn(f) {
          switch (f) {
            case 45:
              (x = A_), W.push(45);
              break;
            case 60:
              x = Qu;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function A_(f) {
          switch (f) {
            case 45:
              (x = Og), W.push(45);
              break;
            case 60:
              x = Qu;
              break;
            case 0:
              (x = yn), W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              (x = yn), W.push(f);
              break;
          }
        }
        function Og(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              x = Qu;
              break;
            case 62:
              (x = hr), W.push(62);
              break;
            case 0:
              (x = yn), W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              (x = yn), W.push(f);
              break;
          }
        }
        function Qu(f) {
          switch (f) {
            case 47:
              Bn(), (x = x_);
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
              Bn(), W.push(60), re(f, O_);
              break;
            default:
              W.push(60), re(f, yn);
              break;
          }
        }
        function x_(f) {
          switch (f) {
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
              Fs(), re(f, R_);
              break;
            default:
              W.push(60), W.push(47), re(f, yn);
              break;
          }
        }
        function R_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qt(je)) {
                x = vn;
                return;
              }
              break;
            case 47:
              if (Qt(je)) {
                x = mr;
                return;
              }
              break;
            case 62:
              if (Qt(je)) {
                (x = Me), Hn();
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
              (je += String.fromCharCode(f + 32)), Be.push(f);
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
              (je += String.fromCharCode(f)), Be.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Be), re(f, yn);
        }
        function O_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              gt(Be) === "script" ? (x = pr) : (x = yn), W.push(f);
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
              Be.push(f + 32), W.push(f);
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
              Be.push(f), W.push(f);
              break;
            default:
              re(f, yn);
              break;
          }
        }
        function pr(f) {
          switch (f) {
            case 45:
              (x = k_), W.push(45);
              break;
            case 60:
              (x = Ku), W.push(60);
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function k_(f) {
          switch (f) {
            case 45:
              (x = L_), W.push(45);
              break;
            case 60:
              (x = Ku), W.push(60);
              break;
            case 0:
              (x = pr), W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              (x = pr), W.push(f);
              break;
          }
        }
        function L_(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              (x = Ku), W.push(60);
              break;
            case 62:
              (x = hr), W.push(62);
              break;
            case 0:
              (x = pr), W.push(65533);
              break;
            case -1:
              we();
              break;
            default:
              (x = pr), W.push(f);
              break;
          }
        }
        function Ku(f) {
          f === 47 ? (Bn(), (x = P_), W.push(47)) : re(f, pr);
        }
        function P_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              gt(Be) === "script" ? (x = yn) : (x = pr), W.push(f);
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
              Be.push(f + 32), W.push(f);
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
              Be.push(f), W.push(f);
              break;
            default:
              re(f, pr);
              break;
          }
        }
        function vn(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              x = mr;
              break;
            case 62:
              (x = Me), Hn();
              break;
            case -1:
              we();
              break;
            case 61:
              qu(), (Pt += String.fromCharCode(f)), (x = Yu);
              break;
            default:
              if (c_()) break;
              qu(), re(f, Yu);
              break;
          }
        }
        function Yu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              re(f, F_);
              break;
            case 61:
              x = kg;
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
              Pt += String.fromCharCode(f + 32);
              break;
            case 0:
              Pt += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              Pt += js(t_);
              break;
          }
        }
        function F_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              lr(Pt), (x = mr);
              break;
            case 61:
              x = kg;
              break;
            case 62:
              (x = Me), lr(Pt), Hn();
              break;
            case -1:
              lr(Pt), we();
              break;
            default:
              lr(Pt), qu(), re(f, Yu);
              break;
          }
        }
        function kg(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              $u(), (x = Na);
              break;
            case 39:
              $u(), (x = Aa);
              break;
            case 62:
            default:
              $u(), re(f, xa);
              break;
          }
        }
        function Na(f) {
          switch (f) {
            case 34:
              lr(Pt, Rt), (x = Zu);
              break;
            case 38:
              (ir = Na), (x = qs);
              break;
            case 0:
              Rt += "\uFFFD";
              break;
            case -1:
              we();
              break;
            case 10:
              Rt += String.fromCharCode(f);
              break;
            default:
              Rt += js(kn);
              break;
          }
        }
        function Aa(f) {
          switch (f) {
            case 39:
              lr(Pt, Rt), (x = Zu);
              break;
            case 38:
              (ir = Aa), (x = qs);
              break;
            case 0:
              Rt += "\uFFFD";
              break;
            case -1:
              we();
              break;
            case 10:
              Rt += String.fromCharCode(f);
              break;
            default:
              Rt += js(At);
              break;
          }
        }
        function xa(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              lr(Pt, Rt), (x = vn);
              break;
            case 38:
              (ir = xa), (x = qs);
              break;
            case 62:
              lr(Pt, Rt), (x = Me), Hn();
              break;
            case 0:
              Rt += "\uFFFD";
              break;
            case -1:
              te--, (x = Me);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              Rt += js(Ri);
              break;
          }
        }
        function Zu(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = vn;
              break;
            case 47:
              x = mr;
              break;
            case 62:
              (x = Me), Hn();
              break;
            case -1:
              we();
              break;
            default:
              re(f, vn);
              break;
          }
        }
        function mr(f) {
          switch (f) {
            case 62:
              (x = Me), h_(!0);
              break;
            case -1:
              we();
              break;
            default:
              re(f, vn);
              break;
          }
        }
        function Ra(f, h, D) {
          var L = h.length;
          D ? (te += L - 1) : (te += L);
          var F = h.substring(0, L - 1);
          (F = F.replace(/\u0000/g, "\uFFFD")),
            (F = F.replace(
              /\u000D\u000A/g,
              `
`,
            )),
            (F = F.replace(
              /\u000D/g,
              `
`,
            )),
            tt(E, F),
            (x = Me);
        }
        Ra.lookahead = ">";
        function Lg(f, h, D) {
          if (h[0] === "-" && h[1] === "-") {
            (te += 2), Ag(), (x = j_);
            return;
          }
          h.toUpperCase() === "DOCTYPE"
            ? ((te += 7), (x = z_))
            : h === "[CDATA[" && u_()
              ? ((te += 7), (x = ed))
              : (x = Ra);
        }
        Lg.lookahead = 7;
        function j_(f) {
          switch ((Ag(), f)) {
            case 45:
              x = B_;
              break;
            case 62:
              (x = Me), tt(E, gt(qe));
              break;
            default:
              re(f, Yr);
              break;
          }
        }
        function B_(f) {
          switch (f) {
            case 45:
              x = Oa;
              break;
            case 62:
              (x = Me), tt(E, gt(qe));
              break;
            case -1:
              tt(E, gt(qe)), we();
              break;
            default:
              qe.push(45), re(f, Yr);
              break;
          }
        }
        function Yr(f) {
          switch (f) {
            case 60:
              qe.push(f), (x = H_);
              break;
            case 45:
              x = Xu;
              break;
            case 0:
              qe.push(65533);
              break;
            case -1:
              tt(E, gt(qe)), we();
              break;
            default:
              qe.push(f);
              break;
          }
        }
        function H_(f) {
          switch (f) {
            case 33:
              qe.push(f), (x = U_);
              break;
            case 60:
              qe.push(f);
              break;
            default:
              re(f, Yr);
              break;
          }
        }
        function U_(f) {
          switch (f) {
            case 45:
              x = V_;
              break;
            default:
              re(f, Yr);
              break;
          }
        }
        function V_(f) {
          switch (f) {
            case 45:
              x = q_;
              break;
            default:
              re(f, Xu);
              break;
          }
        }
        function q_(f) {
          switch (f) {
            case 62:
            case -1:
              re(f, Oa);
              break;
            default:
              re(f, Oa);
              break;
          }
        }
        function Xu(f) {
          switch (f) {
            case 45:
              x = Oa;
              break;
            case -1:
              tt(E, gt(qe)), we();
              break;
            default:
              qe.push(45), re(f, Yr);
              break;
          }
        }
        function Oa(f) {
          switch (f) {
            case 62:
              (x = Me), tt(E, gt(qe));
              break;
            case 33:
              x = $_;
              break;
            case 45:
              qe.push(45);
              break;
            case -1:
              tt(E, gt(qe)), we();
              break;
            default:
              qe.push(45), qe.push(45), re(f, Yr);
              break;
          }
        }
        function $_(f) {
          switch (f) {
            case 45:
              qe.push(45), qe.push(45), qe.push(33), (x = Xu);
              break;
            case 62:
              (x = Me), tt(E, gt(qe));
              break;
            case -1:
              tt(E, gt(qe)), we();
              break;
            default:
              qe.push(45), qe.push(45), qe.push(33), re(f, Yr);
              break;
          }
        }
        function z_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = Pg;
              break;
            case -1:
              Oi(), ke(), Le(), we();
              break;
            default:
              re(f, Pg);
              break;
          }
        }
        function Pg(f) {
          switch (f) {
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
              Oi(), sr.push(f + 32), (x = Ju);
              break;
            case 0:
              Oi(), sr.push(65533), (x = Ju);
              break;
            case 62:
              Oi(), ke(), (x = Me), Le();
              break;
            case -1:
              Oi(), ke(), Le(), we();
              break;
            default:
              Oi(), sr.push(f), (x = Ju);
              break;
          }
        }
        function Ju(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = Fg;
              break;
            case 62:
              (x = Me), Le();
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
              sr.push(f + 32);
              break;
            case 0:
              sr.push(65533);
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              sr.push(f);
              break;
          }
        }
        function Fg(f, h, D) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              te += 1;
              break;
            case 62:
              (x = Me), (te += 1), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              (h = h.toUpperCase()),
                h === "PUBLIC"
                  ? ((te += 6), (x = G_))
                  : h === "SYSTEM"
                    ? ((te += 6), (x = K_))
                    : (ke(), (x = gr));
              break;
          }
        }
        Fg.lookahead = 6;
        function G_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = W_;
              break;
            case 34:
              Ta(), (x = jg);
              break;
            case 39:
              Ta(), (x = Bg);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function W_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Ta(), (x = jg);
              break;
            case 39:
              Ta(), (x = Bg);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function jg(f) {
          switch (f) {
            case 34:
              x = Hg;
              break;
            case 0:
              or.push(65533);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              or.push(f);
              break;
          }
        }
        function Bg(f) {
          switch (f) {
            case 39:
              x = Hg;
              break;
            case 0:
              or.push(65533);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              or.push(f);
              break;
          }
        }
        function Hg(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = Q_;
              break;
            case 62:
              (x = Me), Le();
              break;
            case 34:
              ur(), (x = ka);
              break;
            case 39:
              ur(), (x = La);
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function Q_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (x = Me), Le();
              break;
            case 34:
              ur(), (x = ka);
              break;
            case 39:
              ur(), (x = La);
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function K_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              x = Y_;
              break;
            case 34:
              ur(), (x = ka);
              break;
            case 39:
              ur(), (x = La);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function Y_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              ur(), (x = ka);
              break;
            case 39:
              ur(), (x = La);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ke(), (x = gr);
              break;
          }
        }
        function ka(f) {
          switch (f) {
            case 34:
              x = Ug;
              break;
            case 0:
              ar.push(65533);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ar.push(f);
              break;
          }
        }
        function La(f) {
          switch (f) {
            case 39:
              x = Ug;
              break;
            case 0:
              ar.push(65533);
              break;
            case 62:
              ke(), (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              ar.push(f);
              break;
          }
        }
        function Ug(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (x = Me), Le();
              break;
            case -1:
              ke(), Le(), we();
              break;
            default:
              x = gr;
              break;
          }
        }
        function gr(f) {
          switch (f) {
            case 62:
              (x = Me), Le();
              break;
            case -1:
              Le(), we();
              break;
            default:
              break;
          }
        }
        function ed(f) {
          switch (f) {
            case 93:
              x = Z_;
              break;
            case -1:
              we();
              break;
            case 0:
              cr = !0;
            default:
              Bs(n_) || W.push(f);
              break;
          }
        }
        function Z_(f) {
          switch (f) {
            case 93:
              x = X_;
              break;
            default:
              W.push(93), re(f, ed);
              break;
          }
        }
        function X_(f) {
          switch (f) {
            case 93:
              W.push(93);
              break;
            case 62:
              ki(), (x = Me);
              break;
            default:
              W.push(93), W.push(93), re(f, ed);
              break;
          }
        }
        function qs(f) {
          switch ((Bn(), Be.push(38), f)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              re(f, Zr);
              break;
            case 35:
              Be.push(f), (x = J_);
              break;
            default:
              re(f, Vg);
              break;
          }
        }
        function Vg(f) {
          wt.lastIndex = te;
          var h = wt.exec(X);
          if (!h) throw new Error("should never happen");
          var D = h[1];
          if (!D) {
            x = Zr;
            return;
          }
          switch (((te += D.length), c(Be, o_(D)), ir)) {
            case Na:
            case Aa:
            case xa:
              if (D[D.length - 1] !== ";" && /[=A-Za-z0-9]/.test(X[te])) {
                x = Zr;
                return;
              }
              break;
            default:
              break;
          }
          Bn();
          var L = Ie[D];
          typeof L == "number" ? Be.push(L) : c(Be, L), (x = Zr);
        }
        Vg.lookahead = -ut;
        function J_(f) {
          switch (((Ze = 0), f)) {
            case 120:
            case 88:
              Be.push(f), (x = eT);
              break;
            default:
              re(f, tT);
              break;
          }
        }
        function eT(f) {
          switch (f) {
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
              re(f, nT);
              break;
            default:
              re(f, Zr);
              break;
          }
        }
        function tT(f) {
          switch (f) {
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
              re(f, rT);
              break;
            default:
              re(f, Zr);
              break;
          }
        }
        function nT(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (Ze *= 16), (Ze += f - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (Ze *= 16), (Ze += f - 87);
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
              (Ze *= 16), (Ze += f - 48);
              break;
            case 59:
              x = Pa;
              break;
            default:
              re(f, Pa);
              break;
          }
        }
        function rT(f) {
          switch (f) {
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
              (Ze *= 10), (Ze += f - 48);
              break;
            case 59:
              x = Pa;
              break;
            default:
              re(f, Pa);
              break;
          }
        }
        function Pa(f) {
          Ze in q
            ? (Ze = q[Ze])
            : (Ze > 1114111 || (Ze >= 55296 && Ze < 57344)) && (Ze = 65533),
            Bn(),
            Ze <= 65535
              ? Be.push(Ze)
              : ((Ze = Ze - 65536),
                Be.push(55296 + (Ze >> 10)),
                Be.push(56320 + (Ze & 1023))),
            re(f, Zr);
        }
        function Zr(f) {
          switch (ir) {
            case Na:
            case Aa:
            case xa:
              Rt += gt(Be);
              break;
            default:
              c(W, Be);
              break;
          }
          re(f, ir);
        }
        function iT(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(qr, "")), h.length === 0)) return;
              break;
            case 4:
              Oe._appendChild(Oe.createComment(h));
              return;
            case 5:
              var F = h,
                Q = D,
                le = L;
              Oe.appendChild(new r(Oe, F, Q, le)),
                Uu ||
                F.toLowerCase() !== "html" ||
                P.test(Q) ||
                (le && le.toLowerCase() === A) ||
                (le === void 0 && _.test(Q))
                  ? (Oe._quirks = !0)
                  : (w.test(Q) || (le !== void 0 && _.test(Q))) &&
                    (Oe._limitedQuirks = !0),
                (H = qg);
              return;
          }
          (Oe._quirks = !0), (H = qg), H(f, h, D, L);
        }
        function qg(f, h, D, L) {
          var F;
          switch (f) {
            case 1:
              if (((h = h.replace(qr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              Oe._appendChild(Oe.createComment(h));
              return;
            case 2:
              if (h === "html") {
                (F = Hs(Oe, h, D)), N.push(F), Oe.appendChild(F), (H = Fa);
                return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (F = Hs(Oe, "html", null)),
            N.push(F),
            Oe.appendChild(F),
            (H = Fa),
            H(f, h, D, L);
        }
        function Fa(f, h, D, L) {
          switch (f) {
            case 1:
              if (((h = h.replace(qr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              mn(h);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "head":
                  var F = pe(h, D);
                  (ba = F), (H = Je);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          Fa(d, "head", null), H(f, h, D, L);
        }
        function Je(f, h, D, L) {
          switch (f) {
            case 1:
              var F = h.match(qr);
              if (
                (F && (gn(F[0]), (h = h.substring(F[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  pe(h, D), N.pop();
                  return;
                case "title":
                  p_(h, D);
                  return;
                case "noscript":
                  if (!wa) {
                    pe(h, D), (H = $g);
                    return;
                  }
                case "noframes":
                case "style":
                  Ia(h, D);
                  return;
                case "script":
                  Sa(function (Q) {
                    var le = Hs(Q, h, D);
                    return (
                      (le._parser_inserted = !0),
                      (le._force_async = !1),
                      Wr && (le._already_started = !0),
                      ki(),
                      le
                    );
                  }),
                    (x = hr),
                    (Pn = H),
                    (H = ja);
                  return;
                case "template":
                  pe(h, D), Se.insertMarker(), (Xe = !1), (H = rd), Fn.push(H);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "head":
                  N.pop(), (H = td);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!N.contains("template")) return;
                  N.generateImpliedEndTags(null, "thorough"),
                    N.popTag("template"),
                    Se.clearToMarker(),
                    Fn.pop(),
                    Us();
                  return;
                default:
                  return;
              }
              break;
          }
          Je(m, "head", null), H(f, h, D, L);
        }
        function $g(f, h, D, L) {
          switch (f) {
            case 5:
              return;
            case 4:
              Je(f, h);
              return;
            case 1:
              var F = h.match(qr);
              if (
                (F && (Je(f, F[0]), (h = h.substring(F[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  Je(f, h, D);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "noscript":
                  N.pop(), (H = Je);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          $g(m, "noscript", null), H(f, h, D, L);
        }
        function td(f, h, D, L) {
          switch (f) {
            case 1:
              var F = h.match(qr);
              if (
                (F && (gn(F[0]), (h = h.substring(F[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "body":
                  pe(h, D), (Xe = !1), (H = ce);
                  return;
                case "frameset":
                  pe(h, D), (H = id);
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
                  N.push(ba), Je(d, h, D), N.removeElement(ba);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "template":
                  return Je(f, h, D, L);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          td(d, "body", null), (Xe = !0), H(f, h, D, L);
        }
        function ce(f, h, D, L) {
          var F, Q, le, Ne;
          switch (f) {
            case 1:
              if (cr && ((h = h.replace(ga, "")), h.length === 0)) return;
              Xe && ma.test(h) && (Xe = !1), Dt(), gn(h);
              return;
            case 5:
              return;
            case 4:
              mn(h);
              return;
            case -1:
              if (Fn.length) return rd(f);
              Kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  if (N.contains("template")) return;
                  Ig(D, N.elements[0]);
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
                  Je(d, h, D);
                  return;
                case "body":
                  if (
                    ((F = N.elements[1]),
                    !F ||
                      !(F instanceof a.HTMLBodyElement) ||
                      N.contains("template"))
                  )
                    return;
                  (Xe = !1), Ig(D, F);
                  return;
                case "frameset":
                  if (
                    !Xe ||
                    ((F = N.elements[1]),
                    !F || !(F instanceof a.HTMLBodyElement))
                  )
                    return;
                  for (
                    F.parentNode && F.parentNode.removeChild(F);
                    !(N.top instanceof a.HTMLHtmlElement);

                  )
                    N.pop();
                  pe(h, D), (H = id);
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
                  N.inButtonScope("p") && ce(m, "p"), pe(h, D);
                  return;
                case "menu":
                  N.inButtonScope("p") && ce(m, "p"),
                    Fe(N.top, "menuitem") && N.pop(),
                    pe(h, D);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  N.inButtonScope("p") && ce(m, "p"),
                    N.top instanceof a.HTMLHeadingElement && N.pop(),
                    pe(h, D);
                  return;
                case "pre":
                case "listing":
                  N.inButtonScope("p") && ce(m, "p"),
                    pe(h, D),
                    (Qr = !0),
                    (Xe = !1);
                  return;
                case "form":
                  if (jn && !N.contains("template")) return;
                  N.inButtonScope("p") && ce(m, "p"),
                    (Ne = pe(h, D)),
                    N.contains("template") || (jn = Ne);
                  return;
                case "li":
                  for (Xe = !1, Q = N.elements.length - 1; Q >= 0; Q--) {
                    if (((le = N.elements[Q]), le instanceof a.HTMLLIElement)) {
                      ce(m, "li");
                      break;
                    }
                    if (Fe(le, T) && !Fe(le, b)) break;
                  }
                  N.inButtonScope("p") && ce(m, "p"), pe(h, D);
                  return;
                case "dd":
                case "dt":
                  for (Xe = !1, Q = N.elements.length - 1; Q >= 0; Q--) {
                    if (((le = N.elements[Q]), Fe(le, J))) {
                      ce(m, le.localName);
                      break;
                    }
                    if (Fe(le, T) && !Fe(le, b)) break;
                  }
                  N.inButtonScope("p") && ce(m, "p"), pe(h, D);
                  return;
                case "plaintext":
                  N.inButtonScope("p") && ce(m, "p"), pe(h, D), (x = Wu);
                  return;
                case "button":
                  N.inScope("button")
                    ? (ce(m, "button"), H(f, h, D, L))
                    : (Dt(), pe(h, D), (Xe = !1));
                  return;
                case "a":
                  var Qe = Se.findElementByTag("a");
                  Qe && (ce(m, h), Se.remove(Qe), N.removeElement(Qe));
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
                  Dt(), Se.push(pe(h, D), D);
                  return;
                case "nobr":
                  Dt(), N.inScope(h) && (ce(m, h), Dt()), Se.push(pe(h, D), D);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  Dt(), pe(h, D), Se.insertMarker(), (Xe = !1);
                  return;
                case "table":
                  !Oe._quirks && N.inButtonScope("p") && ce(m, "p"),
                    pe(h, D),
                    (Xe = !1),
                    (H = Kt);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  Dt(), pe(h, D), N.pop(), (Xe = !1);
                  return;
                case "input":
                  Dt(), (Ne = pe(h, D)), N.pop();
                  var ft = Ne.getAttribute("type");
                  (!ft || ft.toLowerCase() !== "hidden") && (Xe = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  pe(h, D), N.pop();
                  return;
                case "hr":
                  N.inButtonScope("p") && ce(m, "p"),
                    Fe(N.top, "menuitem") && N.pop(),
                    pe(h, D),
                    N.pop(),
                    (Xe = !1);
                  return;
                case "image":
                  ce(d, "img", D, L);
                  return;
                case "textarea":
                  pe(h, D), (Qr = !0), (Xe = !1), (x = fr), (Pn = H), (H = ja);
                  return;
                case "xmp":
                  N.inButtonScope("p") && ce(m, "p"), Dt(), (Xe = !1), Ia(h, D);
                  return;
                case "iframe":
                  (Xe = !1), Ia(h, D);
                  return;
                case "noembed":
                  Ia(h, D);
                  return;
                case "select":
                  Dt(),
                    pe(h, D),
                    (Xe = !1),
                    H === Kt || H === nd || H === Xr || H === $s || H === Li
                      ? (H = Ha)
                      : (H = Un);
                  return;
                case "optgroup":
                case "option":
                  N.top instanceof a.HTMLOptionElement && ce(m, "option"),
                    Dt(),
                    pe(h, D);
                  return;
                case "menuitem":
                  Fe(N.top, "menuitem") && N.pop(), Dt(), pe(h, D);
                  return;
                case "rb":
                case "rtc":
                  N.inScope("ruby") && N.generateImpliedEndTags(), pe(h, D);
                  return;
                case "rp":
                case "rt":
                  N.inScope("ruby") && N.generateImpliedEndTags("rtc"),
                    pe(h, D);
                  return;
                case "math":
                  Dt(), Cg(D), Hu(D), zu(h, D, s.MATHML), L && N.pop();
                  return;
                case "svg":
                  Dt(), Sg(D), Hu(D), zu(h, D, s.SVG), L && N.pop();
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
              Dt(), pe(h, D);
              return;
            case 3:
              switch (h) {
                case "template":
                  Je(m, h, D);
                  return;
                case "body":
                  if (!N.inScope("body")) return;
                  H = zg;
                  return;
                case "html":
                  if (!N.inScope("body")) return;
                  (H = zg), H(f, h, D);
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
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h);
                  return;
                case "form":
                  if (N.contains("template")) {
                    if (!N.inScope("form")) return;
                    N.generateImpliedEndTags(), N.popTag("form");
                  } else {
                    var Yt = jn;
                    if (((jn = null), !Yt || !N.elementInScope(Yt))) return;
                    N.generateImpliedEndTags(), N.removeElement(Yt);
                  }
                  return;
                case "p":
                  N.inButtonScope(h)
                    ? (N.generateImpliedEndTags(h), N.popTag(h))
                    : (ce(d, h, null), H(f, h, D, L));
                  return;
                case "li":
                  if (!N.inListItemScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "dd":
                case "dt":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!N.elementTypeInScope(a.HTMLHeadingElement)) return;
                  N.generateImpliedEndTags(),
                    N.popElementType(a.HTMLHeadingElement);
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
                  var rn = m_(h);
                  if (rn) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h), Se.clearToMarker();
                  return;
                case "br":
                  ce(d, h, null);
                  return;
              }
              for (Q = N.elements.length - 1; Q >= 0; Q--)
                if (((le = N.elements[Q]), Fe(le, h))) {
                  N.generateImpliedEndTags(h), N.popElement(le);
                  break;
                } else if (Fe(le, T)) return;
              return;
          }
        }
        function ja(f, h, D, L) {
          switch (f) {
            case 1:
              gn(h);
              return;
            case -1:
              N.top instanceof a.HTMLScriptElement &&
                (N.top._already_started = !0),
                N.pop(),
                (H = Pn),
                H(f);
              return;
            case 3:
              h === "script" ? g_() : (N.pop(), (H = Pn));
              return;
            default:
              return;
          }
        }
        function Kt(f, h, D, L) {
          function F(le) {
            for (var Ne = 0, Qe = le.length; Ne < Qe; Ne++)
              if (le[Ne][0] === "type") return le[Ne][1].toLowerCase();
            return null;
          }
          switch (f) {
            case 1:
              if (Vu) {
                ce(f, h, D, L);
                return;
              } else if (Fe(N.top, ne)) {
                (Da = []), (Pn = H), (H = sT), H(f, h, D, L);
                return;
              }
              break;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "caption":
                  N.clearToContext(O), Se.insertMarker(), pe(h, D), (H = nd);
                  return;
                case "colgroup":
                  N.clearToContext(O), pe(h, D), (H = Ba);
                  return;
                case "col":
                  Kt(d, "colgroup", null), H(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.clearToContext(O), pe(h, D), (H = Xr);
                  return;
                case "td":
                case "th":
                case "tr":
                  Kt(d, "tbody", null), H(f, h, D, L);
                  return;
                case "table":
                  if (!N.inTableScope(h)) return;
                  Kt(m, h), H(f, h, D, L);
                  return;
                case "style":
                case "script":
                case "template":
                  Je(f, h, D, L);
                  return;
                case "input":
                  var Q = F(D);
                  if (Q !== "hidden") break;
                  pe(h, D), N.pop();
                  return;
                case "form":
                  if (jn || N.contains("template")) return;
                  (jn = pe(h, D)), N.popElement(jn);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  if (!N.inTableScope(h)) return;
                  N.popTag(h), Us();
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
                  Je(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          (dr = !0), ce(f, h, D, L), (dr = !1);
        }
        function sT(f, h, D, L) {
          if (f === u) {
            if (cr && ((h = h.replace(ga, "")), h.length === 0)) return;
            Da.push(h);
          } else {
            var F = Da.join("");
            (Da.length = 0),
              ma.test(F) ? ((dr = !0), ce(u, F), (dr = !1)) : gn(F),
              (H = Pn),
              H(f, h, D, L);
          }
        }
        function nd(f, h, D, L) {
          function F() {
            return N.inTableScope("caption")
              ? (N.generateImpliedEndTags(),
                N.popTag("caption"),
                Se.clearToMarker(),
                (H = Kt),
                !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  F() && H(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "caption":
                  F();
                  return;
                case "table":
                  F() && H(f, h, D, L);
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
          ce(f, h, D, L);
        }
        function Ba(f, h, D, L) {
          switch (f) {
            case 1:
              var F = h.match(qr);
              if (
                (F && (gn(F[0]), (h = h.substring(F[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "col":
                  pe(h, D), N.pop();
                  return;
                case "template":
                  Je(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "colgroup":
                  if (!Fe(N.top, "colgroup")) return;
                  N.pop(), (H = Kt);
                  return;
                case "col":
                  return;
                case "template":
                  Je(f, h, D, L);
                  return;
              }
              break;
            case -1:
              ce(f, h, D, L);
              return;
          }
          Fe(N.top, "colgroup") && (Ba(m, "colgroup"), H(f, h, D, L));
        }
        function Xr(f, h, D, L) {
          function F() {
            (!N.inTableScope("tbody") &&
              !N.inTableScope("thead") &&
              !N.inTableScope("tfoot")) ||
              (N.clearToContext(j),
              Xr(m, N.top.localName, null),
              H(f, h, D, L));
          }
          switch (f) {
            case 2:
              switch (h) {
                case "tr":
                  N.clearToContext(j), pe(h, D), (H = $s);
                  return;
                case "th":
                case "td":
                  Xr(d, "tr", null), H(f, h, D, L);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  F();
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  F();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && (N.clearToContext(j), N.pop(), (H = Kt));
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
          Kt(f, h, D, L);
        }
        function $s(f, h, D, L) {
          function F() {
            return N.inTableScope("tr")
              ? (N.clearToContext(Y), N.pop(), (H = Xr), !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "th":
                case "td":
                  N.clearToContext(Y), pe(h, D), (H = Li), Se.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  F() && H(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "tr":
                  F();
                  return;
                case "table":
                  F() && H(f, h, D, L);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && F() && H(f, h, D, L);
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
          Kt(f, h, D, L);
        }
        function Li(f, h, D, L) {
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  N.inTableScope("td")
                    ? (Li(m, "td"), H(f, h, D, L))
                    : N.inTableScope("th") && (Li(m, "th"), H(f, h, D, L));
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "td":
                case "th":
                  if (!N.inTableScope(h)) return;
                  N.generateImpliedEndTags(),
                    N.popTag(h),
                    Se.clearToMarker(),
                    (H = $s);
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
                  if (!N.inTableScope(h)) return;
                  Li(m, N.inTableScope("td") ? "td" : "th"), H(f, h, D, L);
                  return;
              }
              break;
          }
          ce(f, h, D, L);
        }
        function Un(f, h, D, L) {
          switch (f) {
            case 1:
              if (cr && ((h = h.replace(ga, "")), h.length === 0)) return;
              gn(h);
              return;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case -1:
              ce(f, h, D, L);
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && Un(m, h), pe(h, D);
                  return;
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement && Un(m, "option"),
                    N.top instanceof a.HTMLOptGroupElement && Un(m, h),
                    pe(h, D);
                  return;
                case "select":
                  Un(m, h);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!N.inSelectScope("select")) return;
                  Un(m, "select"), H(f, h, D, L);
                  return;
                case "script":
                case "template":
                  Je(f, h, D, L);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement &&
                    N.elements[N.elements.length - 2] instanceof
                      a.HTMLOptGroupElement &&
                    Un(m, "option"),
                    N.top instanceof a.HTMLOptGroupElement && N.pop();
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && N.pop();
                  return;
                case "select":
                  if (!N.inSelectScope(h)) return;
                  N.popTag(h), Us();
                  return;
                case "template":
                  Je(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function Ha(f, h, D, L) {
          switch (h) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (f) {
                case 2:
                  Ha(m, "select"), H(f, h, D, L);
                  return;
                case 3:
                  N.inTableScope(h) && (Ha(m, "select"), H(f, h, D, L));
                  return;
              }
          }
          Un(f, h, D, L);
        }
        function rd(f, h, D, L) {
          function F(Q) {
            (H = Q), (Fn[Fn.length - 1] = H), H(f, h, D, L);
          }
          switch (f) {
            case 1:
            case 4:
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              N.contains("template")
                ? (N.popTag("template"),
                  Se.clearToMarker(),
                  Fn.pop(),
                  Us(),
                  H(f, h, D, L))
                : Kr();
              return;
            case 2:
              switch (h) {
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
                  Je(f, h, D, L);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  F(Kt);
                  return;
                case "col":
                  F(Ba);
                  return;
                case "tr":
                  F(Xr);
                  return;
                case "td":
                case "th":
                  F($s);
                  return;
              }
              F(ce);
              return;
            case 3:
              switch (h) {
                case "template":
                  Je(f, h, D, L);
                  return;
                default:
                  return;
              }
          }
        }
        function zg(f, h, D, L) {
          switch (f) {
            case 1:
              if (ma.test(h)) break;
              ce(f, h);
              return;
            case 4:
              N.elements[0]._appendChild(Oe.createComment(h));
              return;
            case 5:
              return;
            case -1:
              Kr();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
            case 3:
              if (h === "html") {
                if (Wr) return;
                H = aT;
                return;
              }
              break;
          }
          (H = ce), H(f, h, D, L);
        }
        function id(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Bu, "")), h.length > 0 && gn(h);
              return;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case -1:
              Kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "frameset":
                  pe(h, D);
                  return;
                case "frame":
                  pe(h, D), N.pop();
                  return;
                case "noframes":
                  Je(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "frameset") {
                if (Wr && N.top instanceof a.HTMLHtmlElement) return;
                N.pop(),
                  !Wr && !(N.top instanceof a.HTMLFrameSetElement) && (H = oT);
                return;
              }
              break;
          }
        }
        function oT(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Bu, "")), h.length > 0 && gn(h);
              return;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case -1:
              Kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  Je(f, h, D, L);
                  return;
              }
              break;
            case 3:
              if (h === "html") {
                H = cT;
                return;
              }
              break;
          }
        }
        function aT(f, h, D, L) {
          switch (f) {
            case 1:
              if (ma.test(h)) break;
              ce(f, h, D, L);
              return;
            case 4:
              Oe._appendChild(Oe.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              Kr();
              return;
            case 2:
              if (h === "html") {
                ce(f, h, D, L);
                return;
              }
              break;
          }
          (H = ce), H(f, h, D, L);
        }
        function cT(f, h, D, L) {
          switch (f) {
            case 1:
              (h = h.replace(Bu, "")), h.length > 0 && ce(f, h, D, L);
              return;
            case 4:
              Oe._appendChild(Oe.createComment(h));
              return;
            case 5:
              ce(f, h, D, L);
              return;
            case -1:
              Kr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ce(f, h, D, L);
                  return;
                case "noframes":
                  Je(f, h, D, L);
                  return;
              }
              break;
          }
        }
        function Gg(f, h, D, L) {
          function F(Qe) {
            for (var ft = 0, Yt = Qe.length; ft < Yt; ft++)
              switch (Qe[ft][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var Q;
          switch (f) {
            case 1:
              Xe && s_.test(h) && (Xe = !1),
                cr && (h = h.replace(ga, "\uFFFD")),
                gn(h);
              return;
            case 4:
              mn(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "font":
                  if (!F(D)) break;
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
                  if (Wr) break;
                  do N.pop(), (Q = N.top);
                  while (Q.namespaceURI !== s.HTML && !_g(Q) && !Tg(Q));
                  tt(f, h, D, L);
                  return;
              }
              (Q = N.elements.length === 1 && Wr ? U : N.top),
                Q.namespaceURI === s.MATHML
                  ? Cg(D)
                  : Q.namespaceURI === s.SVG && ((h = a_(h)), Sg(D)),
                Hu(D),
                zu(h, D, Q.namespaceURI),
                L && (h === "script" && (Q.namespaceURI, s.SVG), N.pop());
              return;
            case 3:
              if (
                ((Q = N.top),
                h === "script" &&
                  Q.namespaceURI === s.SVG &&
                  Q.localName === "script")
              )
                N.pop();
              else
                for (var le = N.elements.length - 1, Ne = N.elements[le]; ; ) {
                  if (Ne.localName.toLowerCase() === h) {
                    N.popElement(Ne);
                    break;
                  }
                  if (((Ne = N.elements[--le]), Ne.namespaceURI === s.HTML)) {
                    H(f, h, D, L);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (_a.testTokenizer = function (f, h, D, L) {
            var F = [];
            switch (h) {
              case "PCDATA state":
                x = Me;
                break;
              case "RCDATA state":
                x = fr;
                break;
              case "RAWTEXT state":
                x = Vs;
                break;
              case "PLAINTEXT state":
                x = Wu;
                break;
            }
            if (
              (D && (va = D),
              (tt = function (le, Ne, Qe, ft) {
                switch ((ki(), le)) {
                  case 1:
                    F.length > 0 && F[F.length - 1][0] === "Character"
                      ? (F[F.length - 1][1] += Ne)
                      : F.push(["Character", Ne]);
                    break;
                  case 4:
                    F.push(["Comment", Ne]);
                    break;
                  case 5:
                    F.push([
                      "DOCTYPE",
                      Ne,
                      Qe === void 0 ? null : Qe,
                      ft === void 0 ? null : ft,
                      !Uu,
                    ]);
                    break;
                  case 2:
                    for (
                      var Yt = Object.create(null), rn = 0;
                      rn < Qe.length;
                      rn++
                    ) {
                      var Jr = Qe[rn];
                      Jr.length === 1 ? (Yt[Jr[0]] = "") : (Yt[Jr[0]] = Jr[1]);
                    }
                    var yr = ["StartTag", Ne, Yt];
                    ft && yr.push(!0), F.push(yr);
                    break;
                  case 3:
                    F.push(["EndTag", Ne]);
                    break;
                  case -1:
                    break;
                }
              }),
              !L)
            )
              this.parse(f, !0);
            else {
              for (var Q = 0; Q < f.length; Q++) this.parse(f[Q]);
              this.parse("", !0);
            }
            return F;
          }),
          _a
        );
      }
    },
  }),
  wu = ae({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(t, e) {
      "use strict";
      e.exports = a;
      var n = xm(),
        r = Rm(),
        i = Om(),
        s = ot(),
        o = Sm();
      function a(l) {
        this.contextObject = l;
      }
      var c = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      a.prototype = {
        hasFeature: function (u, d) {
          var m = c[(u || "").toLowerCase()];
          return (m && m[d || ""]) || !1;
        },
        createDocumentType: function (u, d, m) {
          return (
            o.isValidQName(u) || s.InvalidCharacterError(),
            new r(this.contextObject, u, d, m)
          );
        },
        createDocument: function (u, d, m) {
          var E = new n(!1, null),
            C;
          return (
            d ? (C = E.createElementNS(u, d)) : (C = null),
            m && E.appendChild(m),
            C && E.appendChild(C),
            u === s.NAMESPACE.HTML
              ? (E._contentType = "application/xhtml+xml")
              : u === s.NAMESPACE.SVG
                ? (E._contentType = "image/svg+xml")
                : (E._contentType = "application/xml"),
            E
          );
        },
        createHTMLDocument: function (u) {
          var d = new n(!0, null);
          d.appendChild(new r(d, "html"));
          var m = d.createElement("html");
          d.appendChild(m);
          var E = d.createElement("head");
          if ((m.appendChild(E), u !== void 0)) {
            var C = d.createElement("title");
            E.appendChild(C), C.appendChild(d.createTextNode(u));
          }
          return m.appendChild(d.createElement("body")), (d.modclock = 1), d;
        },
        mozSetOutputMutationHandler: function (l, u) {
          l.mutationHandler = u;
        },
        mozGetInputMutationHandler: function (l) {
          s.nyi();
        },
        mozHTMLParser: i,
      };
    },
  }),
  zO = ae({
    "external/npm/node_modules/domino/lib/Location.js"(t, e) {
      "use strict";
      var n = Mm(),
        r = uD();
      e.exports = i;
      function i(s, o) {
        (this._window = s), (this._href = o);
      }
      i.prototype = Object.create(r.prototype, {
        constructor: { value: i },
        href: {
          get: function () {
            return this._href;
          },
          set: function (s) {
            this.assign(s);
          },
        },
        assign: {
          value: function (s) {
            var o = new n(this._href),
              a = o.resolve(s);
            this._href = a;
          },
        },
        replace: {
          value: function (s) {
            this.assign(s);
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
  GO = ae({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(t, e) {
      "use strict";
      var n = Object.create(null, {
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
      e.exports = n;
    },
  }),
  WO = ae({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(t, e) {
      "use strict";
      var n = { setTimeout, clearTimeout, setInterval, clearInterval };
      e.exports = n;
    },
  }),
  hD = ae({
    "external/npm/node_modules/domino/lib/impl.js"(t, e) {
      "use strict";
      var n = ot();
      (t = e.exports =
        {
          CSSStyleDeclaration: Nm(),
          CharacterData: Eu(),
          Comment: sD(),
          DOMException: Dm(),
          DOMImplementation: wu(),
          DOMTokenList: eD(),
          Document: xm(),
          DocumentFragment: oD(),
          DocumentType: Rm(),
          Element: Zo(),
          HTMLParser: Om(),
          NamedNodeMap: nD(),
          Node: bt(),
          NodeList: Ss(),
          NodeFilter: bu(),
          ProcessingInstruction: aD(),
          Text: iD(),
          Window: pD(),
        }),
        n.merge(t, lD()),
        n.merge(t, Am().elements),
        n.merge(t, fD().elements);
    },
  }),
  pD = ae({
    "external/npm/node_modules/domino/lib/Window.js"(t, e) {
      "use strict";
      var n = wu(),
        r = Yw(),
        i = zO(),
        s = ot();
      e.exports = o;
      function o(a) {
        (this.document = a || new n(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new i(
            this,
            this.document._address || "about:blank",
          ));
      }
      (o.prototype = Object.create(r.prototype, {
        console: { value: console },
        history: { value: { back: s.nyi, forward: s.nyi, go: s.nyi } },
        navigator: { value: GO() },
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
          set: function (a) {
            this._setEventHandler("load", a);
          },
        },
        getComputedStyle: {
          value: function (c) {
            return c.style;
          },
        },
      })),
        s.expose(WO(), o),
        s.expose(hD(), o);
    },
  }),
  QO = ae({
    "external/npm/node_modules/domino/lib/index.js"(t) {
      var e = wu(),
        n = Om(),
        r = pD(),
        i = hD();
      (t.createDOMImplementation = function () {
        return new e(null);
      }),
        (t.createDocument = function (s, o) {
          if (s || o) {
            var a = new n();
            return a.parse(s || "", !0), a.document();
          }
          return new e(null).createHTMLDocument("");
        }),
        (t.createIncrementalHTMLParser = function () {
          var s = new n();
          return {
            write: function (o) {
              o.length > 0 &&
                s.parse(o, !1, function () {
                  return !0;
                });
            },
            end: function (o) {
              s.parse(o || "", !0, function () {
                return !0;
              });
            },
            process: function (o) {
              return s.parse("", !1, o);
            },
            document: function () {
              return s.document();
            },
          };
        }),
        (t.createWindow = function (s, o) {
          var a = t.createDocument(s);
          return o !== void 0 && (a._address = o), new i.Window(a);
        }),
        (t.impl = i);
    },
  }),
  vu = QO();
function KO() {
  Object.assign(globalThis, vu.impl),
    (globalThis.KeyboardEvent = vu.impl.Event);
}
function mD(t, e = "/") {
  return vu.createWindow(t, e).document;
}
function YO(t) {
  return t.serialize();
}
var wm = class t extends Bo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !1);
    }
    static makeCurrent() {
      KO(), Vl(new t());
    }
    createHtmlDocument() {
      return mD(
        "<html><head><title>fakeTitle</title></head><body></body></html>",
      );
    }
    getDefaultDocument() {
      return t.defaultDoc || (t.defaultDoc = vu.createDocument()), t.defaultDoc;
    }
    isElementNode(e) {
      return e ? e.nodeType === t.defaultDoc.ELEMENT_NODE : !1;
    }
    isShadowRoot(e) {
      return e.shadowRoot == e;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? e.defaultView
        : n === "document"
          ? e
          : n === "body"
            ? e.body
            : null;
    }
    getBaseHref(e) {
      return (
        e.documentElement.querySelector("base")?.getAttribute("href") || ""
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
      let i = (e.ownerDocument || e).defaultView;
      i && i.dispatchEvent(n);
    }
    getUserAgent() {
      return "Fake user agent";
    }
    getCookie(e) {
      throw new Error("getCookie has not been implemented");
    }
  },
  gD = (() => {
    let e = class e {
      constructor(r) {
        this._doc = r;
      }
      renderToString() {
        return YO(this._doc);
      }
      getDocument() {
        return this._doc;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ZO = (() => {
    let e = class e {
      ɵloadImpl() {
        return ei(this, null, function* () {
          if (!this.xhrImpl) {
            let { default: r } = yield import("./chunk-Q47SVSXD.mjs");
            this.xhrImpl = r;
          }
        });
      }
      build() {
        let r = this.xhrImpl;
        if (!r)
          throw new Error(
            "Unexpected state in ServerXhr: XHR implementation is not loaded.",
          );
        return new r.XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function XO(t, e) {
  let n = G(Ro),
    { href: r, protocol: i, hostname: s, port: o } = n;
  if (!i.startsWith("http")) return e(t);
  let a = `${i}//${s}`;
  o && (a += `:${o}`);
  let c = n.getBaseHrefFromDOM() || r,
    l = new URL(c, a),
    u = new URL(t.url, l).toString();
  return e(t.clone({ url: u }));
}
var JO = [
    { provide: Lr, useClass: ZO },
    { provide: Zl, useValue: XO, multi: !0 },
  ],
  Du = new oe("Server.INITIAL_CONFIG"),
  yD = new oe("Server.RENDER_MODULE_HOOK"),
  yu = "resolve:";
function bm(t) {
  let {
    hostname: e,
    protocol: n,
    port: r,
    pathname: i,
    search: s,
    hash: o,
  } = new URL(t, yu + "//");
  return (
    n !== yu &&
      r === "" &&
      /\:(80|443)/.test(t) &&
      (r = n === "http:" ? "80" : "443"),
    n === yu && t.charAt(0) !== "/" && (i = i.slice(1)),
    {
      hostname: e,
      protocol: n === yu ? "" : n,
      port: r,
      pathname: i,
      search: s,
      hash: o,
    }
  );
}
var e8 = (() => {
    let e = class e {
      constructor(r, i) {
        (this._doc = r),
          (this.href = "/"),
          (this.hostname = "/"),
          (this.protocol = "/"),
          (this.port = "/"),
          (this.pathname = "/"),
          (this.search = ""),
          (this.hash = ""),
          (this._hashUpdate = new it());
        let s = i;
        if (s) {
          if (s.url) {
            let o = bm(s.url);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port),
              (this.pathname = o.pathname),
              (this.search = o.search),
              (this.hash = o.hash),
              (this.href = r.location.href);
          }
          if (s.useAbsoluteUrl) {
            if (!s.baseUrl)
              throw new Error(
                '"PlatformConfig.baseUrl" must be set if "useAbsoluteUrl" is true',
              );
            let o = bm(s.baseUrl);
            (this.protocol = o.protocol),
              (this.hostname = o.hostname),
              (this.port = o.port);
          }
        }
      }
      getBaseHrefFromDOM() {
        return Nn().getBaseHref(this._doc);
      }
      onPopState(r) {
        return () => {};
      }
      onHashChange(r) {
        let i = this._hashUpdate.subscribe(r);
        return () => i.unsubscribe();
      }
      get url() {
        return `${this.pathname}${this.search}${this.hash}`;
      }
      setHash(r, i) {
        if (this.hash === r) return;
        this.hash = r;
        let s = this.url;
        queueMicrotask(() =>
          this._hashUpdate.next({
            type: "hashchange",
            state: null,
            oldUrl: i,
            newUrl: s,
          }),
        );
      }
      replaceState(r, i, s) {
        let o = this.url,
          a = bm(s);
        (this.pathname = a.pathname),
          (this.search = a.search),
          this.setHash(a.hash, o);
      }
      pushState(r, i, s) {
        this.replaceState(r, i, s);
      }
      forward() {
        throw new Error("Not implemented");
      }
      back() {
        throw new Error("Not implemented");
      }
      getState() {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze), ie(Du, 8));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  t8 = (() => {
    let e = class e extends ws {
      constructor(r) {
        super(r), (this.doc = r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, s) {
        return Nn().onAndCancel(r, i, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(ze));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  n8 = [{ provide: yD, useFactory: r8, deps: [ze, ms, Cn], multi: !0 }];
function r8(t, e, n) {
  return () => {
    let r = n.toJson();
    if (n.isEmpty) return;
    let i = t.createElement("script");
    (i.id = e + "-state"),
      i.setAttribute("type", "application/json"),
      (i.textContent = r),
      t.body.appendChild(i);
  };
}
var i8 = [
  { provide: ze, useFactory: c8, deps: [Jt] },
  { provide: Lt, useValue: Ap },
  { provide: Co, useFactory: s8, multi: !0 },
  { provide: Ro, useClass: e8, deps: [ze, [us, Du]] },
  { provide: gD, deps: [ze] },
  { provide: Bl, useValue: !0 },
];
function s8() {
  return () => {
    wm.makeCurrent();
  };
}
var o8 = [{ provide: Ho, multi: !0, useClass: t8 }],
  a8 = [
    n8,
    o8,
    JO,
    { provide: gp, useValue: null },
    { provide: Fl, useValue: null },
    { provide: xp, useClass: xo },
  ];
function c8(t) {
  let e = t.get(Du, null),
    n;
  return (
    e && e.document
      ? (n = typeof e.document == "string" ? mD(e.document, e.url) : e.document)
      : (n = Nn().createHtmlDocument()),
    yl(n),
    n
  );
}
var l8 = Hl(_p, "server", i8);
function $4() {
  return Tn([Ww(), ...a8]);
}
function vD(t) {
  let e = t.platformProviders ?? [];
  return l8([
    { provide: Du, useValue: { document: t.document, url: t.url } },
    e,
  ]);
}
function u8(t) {
  let e = t.createComment(Gh);
  t.body.firstChild
    ? t.body.insertBefore(e, t.body.firstChild)
    : t.body.append(e);
}
function d8(t) {
  let e = t.injector,
    n = h8(e.get(f8, bD));
  t.components.forEach((r) => {
    let i = r.injector.get(bi),
      s = r.location.nativeElement;
    s && i.setAttribute(s, "ng-server-context", n);
  });
}
function ED(t, e) {
  return ei(this, null, function* () {
    let n = e.injector;
    yield Ao(e);
    let r = t.injector.get(gD);
    if (e.injector.get(Zi, !1)) {
      let o = r.getDocument();
      u8(o), P0(e, o);
    }
    let i = n.get(yD, null);
    if (i) {
      let o = [];
      for (let a of i)
        try {
          let c = a();
          c && o.push(c);
        } catch (c) {
          console.warn("Ignoring BEFORE_APP_SERIALIZED Exception: ", c);
        }
      if (o.length)
        for (let a of yield Promise.allSettled(o))
          a.status === "rejected" &&
            console.warn(
              "Ignoring BEFORE_APP_SERIALIZED Exception: ",
              a.reason,
            );
    }
    d8(e);
    let s = r.renderToString();
    return (
      yield new Promise((o) => {
        setTimeout(() => {
          t.destroy(), o();
        }, 0);
      }),
      s
    );
  });
}
var bD = "other",
  f8 = new oe("SERVER_CONTEXT");
function h8(t) {
  let e = t.replace(/[^a-zA-Z0-9\-]/g, "");
  return e.length > 0 ? e : bD;
}
function z4(t, e) {
  return ei(this, null, function* () {
    let { document: n, url: r, extraProviders: i } = e,
      s = vD({ document: n, url: r, platformProviders: i }),
      a = (yield s.bootstrapModule(t)).injector.get(hn);
    return ED(s, a);
  });
}
function G4(t, e) {
  return ei(this, null, function* () {
    let n = vD(e),
      r = yield t();
    return ED(n, r);
  });
}
var _e = "primary",
  fa = Symbol("RouteTitle"),
  jm = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function As(t) {
  return new jm(t);
}
function p8(t, e, n) {
  let r = n.path.split("/");
  if (
    r.length > t.length ||
    (n.pathMatch === "full" && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let s = 0; s < r.length; s++) {
    let o = r[s],
      a = t[s];
    if (o.startsWith(":")) i[o.substring(1)] = a;
    else if (o !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function m8(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!Rn(t[n], e[n])) return !1;
  return !0;
}
function Rn(t, e) {
  let n = t ? Bm(t) : void 0,
    r = e ? Bm(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let s = 0; s < n.length; s++)
    if (((i = n[s]), !CD(t[i], e[i]))) return !1;
  return !0;
}
function Bm(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function CD(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, s) => r[s] === i);
  } else return t === e;
}
function ID(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Vr(t) {
  return Sd(t) ? t : No(t) ? Ke(Promise.resolve(t)) : he(t);
}
var g8 = { exact: ND, subset: AD },
  MD = { exact: y8, subset: v8, ignored: () => !0 };
function wD(t, e, n) {
  return (
    g8[n.paths](t.root, e.root, n.matrixParams) &&
    MD[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function y8(t, e) {
  return Rn(t, e);
}
function ND(t, e, n) {
  if (
    !Ni(t.segments, e.segments) ||
    !Su(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !ND(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function v8(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => CD(t[n], e[n]))
  );
}
function AD(t, e, n) {
  return xD(t, e, e.segments, n);
}
function xD(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!Ni(i, n) || e.hasChildren() || !Su(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!Ni(t.segments, n) || !Su(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !AD(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      s = n.slice(t.segments.length);
    return !Ni(t.segments, i) || !Su(t.segments, i, r) || !t.children[_e]
      ? !1
      : xD(t.children[_e], e, s, r);
  }
}
function Su(t, e, n) {
  return e.every((r, i) => MD[n](t[i].parameters, r.parameters));
}
var Hr = class {
    constructor(e = new Ue([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= As(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return w8.serialize(this);
    }
  },
  Ue = class {
    constructor(e, n) {
      (this.segments = e),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Cu(this);
    }
  },
  Mi = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= As(this.parameters)), this._parameterMap;
    }
    toString() {
      return OD(this);
    }
  };
function E8(t, e) {
  return Ni(t, e) && t.every((n, r) => Rn(n.parameters, e[r].parameters));
}
function Ni(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function b8(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === _e && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== _e && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var dg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => new Mu(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Mu = class {
    parse(e) {
      let n = new Um(e);
      return new Hr(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(e) {
      let n = `/${Xo(e.root, !0)}`,
        r = T8(e.queryParams),
        i = typeof e.fragment == "string" ? `#${D8(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  w8 = new Mu();
function Cu(t) {
  return t.segments.map((e) => OD(e)).join("/");
}
function Xo(t, e) {
  if (!t.hasChildren()) return Cu(t);
  if (e) {
    let n = t.children[_e] ? Xo(t.children[_e], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, s]) => {
        i !== _e && r.push(`${i}:${Xo(s, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = b8(t, (r, i) =>
      i === _e ? [Xo(t.children[_e], !1)] : [`${i}:${Xo(r, !1)}`],
    );
    return Object.keys(t.children).length === 1 && t.children[_e] != null
      ? `${Cu(t)}/${n[0]}`
      : `${Cu(t)}/(${n.join("//")})`;
  }
}
function RD(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function _u(t) {
  return RD(t).replace(/%3B/gi, ";");
}
function D8(t) {
  return encodeURI(t);
}
function Hm(t) {
  return RD(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Iu(t) {
  return decodeURIComponent(t);
}
function DD(t) {
  return Iu(t.replace(/\+/g, "%20"));
}
function OD(t) {
  return `${Hm(t.path)}${_8(t.parameters)}`;
}
function _8(t) {
  return Object.entries(t)
    .map(([e, n]) => `;${Hm(e)}=${Hm(n)}`)
    .join("");
}
function T8(t) {
  let e = Object.entries(t)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${_u(n)}=${_u(i)}`).join("&")
        : `${_u(n)}=${_u(r)}`,
    )
    .filter((n) => n);
  return e.length ? `?${e.join("&")}` : "";
}
var S8 = /^[^\/()?;#]+/;
function km(t) {
  let e = t.match(S8);
  return e ? e[0] : "";
}
var C8 = /^[^\/()?;=#]+/;
function I8(t) {
  let e = t.match(C8);
  return e ? e[0] : "";
}
var M8 = /^[^=?&#]+/;
function N8(t) {
  let e = t.match(M8);
  return e ? e[0] : "";
}
var A8 = /^[^&#]+/;
function x8(t) {
  let e = t.match(A8);
  return e ? e[0] : "";
}
var Um = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new Ue([], {})
        : new Ue([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (e.length > 0 || Object.keys(n).length > 0) && (r[_e] = new Ue(e, n)),
      r
    );
  }
  parseSegment() {
    let e = km(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new $(4009, !1);
    return this.capture(e), new Mi(Iu(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = I8(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = km(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Iu(n)] = Iu(r);
  }
  parseQueryParam(e) {
    let n = N8(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = x8(this.remaining);
      o && ((r = o), this.capture(r));
    }
    let i = DD(n),
      s = DD(r);
    if (e.hasOwnProperty(i)) {
      let o = e[i];
      Array.isArray(o) || ((o = [o]), (e[i] = o)), o.push(s);
    } else e[i] = s;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = km(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new $(4010, !1);
      let s;
      r.indexOf(":") > -1
        ? ((s = r.slice(0, r.indexOf(":"))), this.capture(s), this.capture(":"))
        : e && (s = _e);
      let o = this.parseChildren();
      (n[s] = Object.keys(o).length === 1 ? o[_e] : new Ue([], o)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new $(4011, !1);
  }
};
function kD(t) {
  return t.segments.length > 0 ? new Ue([], { [_e]: t }) : t;
}
function LD(t) {
  let e = {};
  for (let [r, i] of Object.entries(t.children)) {
    let s = LD(i);
    if (r === _e && s.segments.length === 0 && s.hasChildren())
      for (let [o, a] of Object.entries(s.children)) e[o] = a;
    else (s.segments.length > 0 || s.hasChildren()) && (e[r] = s);
  }
  let n = new Ue(t.segments, e);
  return R8(n);
}
function R8(t) {
  if (t.numberOfChildren === 1 && t.children[_e]) {
    let e = t.children[_e];
    return new Ue(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function xs(t) {
  return t instanceof Hr;
}
function O8(t, e, n = null, r = null) {
  let i = PD(t);
  return FD(i, e, n, r);
}
function PD(t) {
  let e;
  function n(s) {
    let o = {};
    for (let c of s.children) {
      let l = n(c);
      o[c.outlet] = l;
    }
    let a = new Ue(s.url, o);
    return s === t && (e = a), a;
  }
  let r = n(t.root),
    i = kD(r);
  return e ?? i;
}
function FD(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Lm(i, i, i, n, r);
  let s = k8(e);
  if (s.toRoot()) return Lm(i, i, new Ue([], {}), n, r);
  let o = L8(s, i, t),
    a = o.processChildren
      ? ta(o.segmentGroup, o.index, s.commands)
      : BD(o.segmentGroup, o.index, s.commands);
  return Lm(i, o.segmentGroup, a, n, r);
}
function Nu(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function ia(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Lm(t, e, n, r, i) {
  let s = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      s[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let o;
  t === e ? (o = n) : (o = jD(t, e, n));
  let a = kD(LD(o));
  return new Hr(a, s, i);
}
function jD(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, s]) => {
      s === e ? (r[i] = n) : (r[i] = jD(s, e, n));
    }),
    new Ue(t.segments, r)
  );
}
var Au = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && Nu(r[0]))
    )
      throw new $(4003, !1);
    let i = r.find(ia);
    if (i && i !== ID(r)) throw new $(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function k8(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Au(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, s, o) => {
      if (typeof s == "object" && s != null) {
        if (s.outlets) {
          let a = {};
          return (
            Object.entries(s.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (s.segmentPath) return [...i, s.segmentPath];
      }
      return typeof s != "string"
        ? [...i, s]
        : o === 0
          ? (s.split("/").forEach((a, c) => {
              (c == 0 && a === ".") ||
                (c == 0 && a === ""
                  ? (n = !0)
                  : a === ".."
                    ? e++
                    : a != "" && i.push(a));
            }),
            i)
          : [...i, s];
    }, []);
  return new Au(n, e, r);
}
var Ms = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function L8(t, e, n) {
  if (t.isAbsolute) return new Ms(e, !0, 0);
  if (!n) return new Ms(e, !1, NaN);
  if (n.parent === null) return new Ms(n, !0, 0);
  let r = Nu(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return P8(n, i, t.numberOfDoubleDots);
}
function P8(t, e, n) {
  let r = t,
    i = e,
    s = n;
  for (; s > i; ) {
    if (((s -= i), (r = r.parent), !r)) throw new $(4005, !1);
    i = r.segments.length;
  }
  return new Ms(r, !1, i - s);
}
function F8(t) {
  return ia(t[0]) ? t[0].outlets : { [_e]: t };
}
function BD(t, e, n) {
  if (((t ??= new Ue([], {})), t.segments.length === 0 && t.hasChildren()))
    return ta(t, e, n);
  let r = j8(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let s = new Ue(t.segments.slice(0, r.pathIndex), {});
    return (
      (s.children[_e] = new Ue(t.segments.slice(r.pathIndex), t.children)),
      ta(s, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new Ue(t.segments, {})
      : r.match && !t.hasChildren()
        ? Vm(t, e, n)
        : r.match
          ? ta(t, 0, i)
          : Vm(t, e, n);
}
function ta(t, e, n) {
  if (n.length === 0) return new Ue(t.segments, {});
  {
    let r = F8(n),
      i = {};
    if (
      Object.keys(r).some((s) => s !== _e) &&
      t.children[_e] &&
      t.numberOfChildren === 1 &&
      t.children[_e].segments.length === 0
    ) {
      let s = ta(t.children[_e], e, n);
      return new Ue(t.segments, s.children);
    }
    return (
      Object.entries(r).forEach(([s, o]) => {
        typeof o == "string" && (o = [o]),
          o !== null && (i[s] = BD(t.children[s], e, o));
      }),
      Object.entries(t.children).forEach(([s, o]) => {
        r[s] === void 0 && (i[s] = o);
      }),
      new Ue(t.segments, i)
    );
  }
}
function j8(t, e, n) {
  let r = 0,
    i = e,
    s = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return s;
    let o = t.segments[i],
      a = n[r];
    if (ia(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!TD(c, l, o)) return s;
      r += 2;
    } else {
      if (!TD(c, {}, o)) return s;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function Vm(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (ia(s)) {
      let c = B8(s.outlets);
      return new Ue(r, c);
    }
    if (i === 0 && Nu(n[0])) {
      let c = t.segments[e];
      r.push(new Mi(c.path, _D(n[0]))), i++;
      continue;
    }
    let o = ia(s) ? s.outlets[_e] : `${s}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    o && a && Nu(a)
      ? (r.push(new Mi(o, _D(a))), (i += 2))
      : (r.push(new Mi(o, {})), i++);
  }
  return new Ue(r, {});
}
function B8(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = Vm(new Ue([], {}), 0, r));
    }),
    e
  );
}
function _D(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function TD(t, e, n) {
  return t == n.path && Rn(e, n.parameters);
}
var na = "imperative",
  mt = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(mt || {}),
  tn = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  sa = class extends tn {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = mt.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ai = class extends tn {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = mt.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Wt = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Wt || {}),
  qm = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(qm || {}),
  Ur = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = mt.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  xi = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.reason = r),
        (this.code = i),
        (this.type = mt.NavigationSkipped);
    }
  },
  oa = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.error = r),
        (this.target = i),
        (this.type = mt.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  xu = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = mt.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  $m = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = mt.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  zm = class extends tn {
    constructor(e, n, r, i, s) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = s),
        (this.type = mt.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Gm = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = mt.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Wm = class extends tn {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = mt.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Qm = class {
    constructor(e) {
      (this.route = e), (this.type = mt.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Km = class {
    constructor(e) {
      (this.route = e), (this.type = mt.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Ym = class {
    constructor(e) {
      (this.snapshot = e), (this.type = mt.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Zm = class {
    constructor(e) {
      (this.snapshot = e), (this.type = mt.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Xm = class {
    constructor(e) {
      (this.snapshot = e), (this.type = mt.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Jm = class {
    constructor(e) {
      (this.snapshot = e), (this.type = mt.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var aa = class {},
  ca = class {
    constructor(e) {
      this.url = e;
    }
  };
var eg = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Fu()),
        (this.attachRef = null);
    }
  },
  Fu = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let s = this.getOrCreateContext(r);
        (s.outlet = i), this.contexts.set(r, s);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new eg()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ru = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let n = this.pathFromRoot(e);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(e) {
      let n = tg(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = tg(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = ng(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return ng(e, this._root).map((n) => n.value);
    }
  };
function tg(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = tg(t, n);
    if (r) return r;
  }
  return null;
}
function ng(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = ng(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var Gt = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Is(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var Ou = class extends Ru {
  constructor(e, n) {
    super(e), (this.snapshot = n), hg(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function HD(t) {
  let e = H8(t),
    n = new ht([new Mi("", {})]),
    r = new ht({}),
    i = new ht({}),
    s = new ht({}),
    o = new ht(""),
    a = new Rs(n, r, s, o, i, _e, t, e.root);
  return (a.snapshot = e.root), new Ou(new Gt(a, []), e);
}
function H8(t) {
  let e = {},
    n = {},
    r = {},
    i = "",
    s = new la([], e, r, i, n, _e, t, null, {});
  return new ku("", new Gt(s, []));
}
var Rs = class {
  constructor(e, n, r, i, s, o, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = s),
      (this.outlet = o),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(Te((l) => l[fa])) ?? he(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = s);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(Te((e) => As(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(Te((e) => As(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function fg(t, e, n = "emptyOnly") {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: ee(ee({}, e.params), t.params),
          data: ee(ee({}, e.data), t.data),
          resolve: ee(ee(ee(ee({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: ee({}, t.params),
          data: ee({}, t.data),
          resolve: ee(ee({}, t.data), t._resolvedData ?? {}),
        }),
    i && VD(i) && (r.resolve[fa] = i.title),
    r
  );
}
var la = class {
    get title() {
      return this.data?.[fa];
    }
    constructor(e, n, r, i, s, o, a, c, l) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = s),
        (this.outlet = o),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= As(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= As(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  ku = class extends Ru {
    constructor(e, n) {
      super(n), (this.url = e), hg(this, n);
    }
    toString() {
      return UD(this._root);
    }
  };
function hg(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => hg(t, n));
}
function UD(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(UD).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Pm(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      Rn(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      Rn(e.params, n.params) || t.paramsSubject.next(n.params),
      m8(e.url, n.url) || t.urlSubject.next(n.url),
      Rn(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function rg(t, e) {
  let n = Rn(t.params, e.params) && E8(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || rg(t.parent, e.parent));
}
function VD(t) {
  return typeof t.title == "string" || t.title === null;
}
var U8 = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = _e),
          (this.activateEvents = new yt()),
          (this.deactivateEvents = new yt()),
          (this.attachEvents = new yt()),
          (this.detachEvents = new yt()),
          (this.parentContexts = G(Fu)),
          (this.location = G(tr)),
          (this.changeDetector = G(vs)),
          (this.environmentInjector = G(kt)),
          (this.inputBinder = G(pg, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: s } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(s) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(s)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new $(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new $(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new $(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new $(4013, !1);
        this._activatedRoute = r;
        let s = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new ig(r, c, s.injector);
        (this.activated = s.createComponent(a, {
          index: s.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = Rr({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [To],
      }));
    let t = e;
    return t;
  })(),
  ig = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === Rs
        ? this.route
        : e === Fu
          ? this.childContexts
          : this.parent.get(e, n);
    }
  },
  pg = new oe("");
function V8(t, e, n) {
  let r = ua(t, e._root, n ? n._root : void 0);
  return new Ou(r, e);
}
function ua(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = q8(t, e, n);
    return new Gt(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let s = t.retrieve(e.value);
      if (s !== null) {
        let o = s.route;
        return (
          (o.value._futureSnapshot = e.value),
          (o.children = e.children.map((a) => ua(t, a))),
          o
        );
      }
    }
    let r = $8(e.value),
      i = e.children.map((s) => ua(t, s));
    return new Gt(r, i);
  }
}
function q8(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return ua(t, r, i);
    return ua(t, r);
  });
}
function $8(t) {
  return new Rs(
    new ht(t.url),
    new ht(t.params),
    new ht(t.queryParams),
    new ht(t.fragment),
    new ht(t.data),
    t.outlet,
    t.component,
    t,
  );
}
var qD = "ngNavigationCancelingError";
function $D(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = xs(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = zD(!1, Wt.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function zD(t, e) {
  let n = new Error(`NavigationCancelingError: ${t || ""}`);
  return (n[qD] = !0), (n.cancellationCode = e), n;
}
function z8(t) {
  return GD(t) && xs(t.url);
}
function GD(t) {
  return !!t && t[qD];
}
var G8 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Pv({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [m0],
      decls: 1,
      vars: 0,
      template: function (i, s) {
        i & 1 && mp(0, "router-outlet");
      },
      dependencies: [U8],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function W8(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = hp(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function mg(t) {
  let e = t.children && t.children.map(mg),
    n = e ? nt(ee({}, t), { children: e }) : ee({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== _e &&
      (n.component = G8),
    n
  );
}
function On(t) {
  return t.outlet || _e;
}
function Q8(t, e) {
  let n = t.filter((r) => On(r) === e);
  return n.push(...t.filter((r) => On(r) !== e)), n;
}
function ha(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var K8 = (t, e, n, r) =>
    Te(
      (i) => (
        new sg(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      ),
    ),
  sg = class {
    constructor(e, n, r, i, s) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = s);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        Pm(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = Is(n);
      e.children.forEach((s) => {
        let o = s.value.outlet;
        this.deactivateRoutes(s, i[o], r), delete i[o];
      }),
        Object.values(i).forEach((s) => {
          this.deactivateRouteAndItsChildren(s, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if (i === s)
        if (i.component) {
          let o = r.getContext(i.outlet);
          o && this.deactivateChildRoutes(e, n, o.children);
        } else this.deactivateChildRoutes(e, n, r);
      else s && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(e, n) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, n)
        : this.deactivateRouteAndOutlet(e, n);
    }
    detachAndStoreRouteSubtree(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        s = Is(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      if (r && r.outlet) {
        let o = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: o,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        s = Is(e);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = Is(n);
      e.children.forEach((s) => {
        this.activateRoutes(s, i[s.value.outlet], r),
          this.forwardEvent(new Jm(s.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Zm(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        s = n ? n.value : null;
      if ((Pm(i), i === s))
        if (i.component) {
          let o = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, o.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let o = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            o.children.onOutletReAttached(a.contexts),
            (o.attachRef = a.componentRef),
            (o.route = a.route.value),
            o.outlet && o.outlet.attach(a.componentRef, a.route.value),
            Pm(a.route.value),
            this.activateChildRoutes(e, null, o.children);
        } else {
          let a = ha(i.snapshot);
          (o.attachRef = null),
            (o.route = i),
            (o.injector = a),
            o.outlet && o.outlet.activateWith(i, o.injector),
            this.activateChildRoutes(e, null, o.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  Lu = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Ns = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function Y8(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return Jo(r, i, n, [r.value]);
}
function Z8(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function ks(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !Dv(t) ? t : e.get(t)) : r;
}
function Jo(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let s = Is(e);
  return (
    t.children.forEach((o) => {
      X8(o, s[o.value.outlet], n, r.concat([o.value]), i),
        delete s[o.value.outlet];
    }),
    Object.entries(s).forEach(([o, a]) => ra(a, n.getContext(o), i)),
    i
  );
}
function X8(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let s = t.value,
    o = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (o && s.routeConfig === o.routeConfig) {
    let c = J8(o, s, s.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Lu(r))
      : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
      s.component ? Jo(t, e, a ? a.children : null, r, i) : Jo(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Ns(a.outlet.component, o));
  } else
    o && ra(e, a, i),
      i.canActivateChecks.push(new Lu(r)),
      s.component
        ? Jo(t, null, a ? a.children : null, r, i)
        : Jo(t, null, n, r, i);
  return i;
}
function J8(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !Ni(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !Ni(t.url, e.url) || !Rn(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !rg(t, e) || !Rn(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !rg(t, e);
  }
}
function ra(t, e, n) {
  let r = Is(t),
    i = t.value;
  Object.entries(r).forEach(([s, o]) => {
    i.component
      ? e
        ? ra(o, e.children.getContext(s), n)
        : ra(o, null, n)
      : ra(o, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new Ns(e.outlet.component, i))
        : n.canDeactivateChecks.push(new Ns(null, i))
      : n.canDeactivateChecks.push(new Ns(null, i));
}
function pa(t) {
  return typeof t == "function";
}
function ek(t) {
  return typeof t == "boolean";
}
function tk(t) {
  return t && pa(t.canLoad);
}
function nk(t) {
  return t && pa(t.canActivate);
}
function rk(t) {
  return t && pa(t.canActivateChild);
}
function ik(t) {
  return t && pa(t.canDeactivate);
}
function sk(t) {
  return t && pa(t.canMatch);
}
function WD(t) {
  return t instanceof qn || t?.name === "EmptyError";
}
var Tu = Symbol("INITIAL_VALUE");
function Os() {
  return Ft((t) =>
    gc(t.map((e) => e.pipe(Zt(1), Rd(Tu)))).pipe(
      Te((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === Tu) return Tu;
            if (n === !1 || n instanceof Hr) return n;
          }
        return !0;
      }),
      St((e) => e !== Tu),
      Zt(1),
    ),
  );
}
function ok(t, e) {
  return Ye((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: s, canDeactivateChecks: o },
    } = n;
    return o.length === 0 && s.length === 0
      ? he(nt(ee({}, n), { guardsResult: !0 }))
      : ak(o, r, i, t).pipe(
          Ye((a) => (a && ek(a) ? ck(r, s, t, e) : he(a))),
          Te((a) => nt(ee({}, n), { guardsResult: a })),
        );
  });
}
function ak(t, e, n, r) {
  return Ke(t).pipe(
    Ye((i) => hk(i.component, i.route, n, e, r)),
    on((i) => i !== !0, !0),
  );
}
function ck(t, e, n, r) {
  return Ke(e).pipe(
    br((i) =>
      vr(
        uk(i.route.parent, r),
        lk(i.route, r),
        fk(t, i.path, n),
        dk(t, i.route, n),
      ),
    ),
    on((i) => i !== !0, !0),
  );
}
function lk(t, e) {
  return t !== null && e && e(new Xm(t)), he(!0);
}
function uk(t, e) {
  return t !== null && e && e(new Ym(t)), he(!0);
}
function dk(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return he(!0);
  let i = r.map((s) =>
    yc(() => {
      let o = ha(e) ?? n,
        a = ks(s, o),
        c = nk(a) ? a.canActivate(e, t) : Yn(o, () => a(e, t));
      return Vr(c).pipe(on());
    }),
  );
  return he(i).pipe(Os());
}
function fk(t, e, n) {
  let r = e[e.length - 1],
    s = e
      .slice(0, e.length - 1)
      .reverse()
      .map((o) => Z8(o))
      .filter((o) => o !== null)
      .map((o) =>
        yc(() => {
          let a = o.guards.map((c) => {
            let l = ha(o.node) ?? n,
              u = ks(c, l),
              d = rk(u) ? u.canActivateChild(r, t) : Yn(l, () => u(r, t));
            return Vr(d).pipe(on());
          });
          return he(a).pipe(Os());
        }),
      );
  return he(s).pipe(Os());
}
function hk(t, e, n, r, i) {
  let s = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!s || s.length === 0) return he(!0);
  let o = s.map((a) => {
    let c = ha(e) ?? i,
      l = ks(a, c),
      u = ik(l) ? l.canDeactivate(t, e, n, r) : Yn(c, () => l(t, e, n, r));
    return Vr(u).pipe(on());
  });
  return he(o).pipe(Os());
}
function pk(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return he(!0);
  let s = i.map((o) => {
    let a = ks(o, t),
      c = tk(a) ? a.canLoad(e, n) : Yn(t, () => a(e, n));
    return Vr(c);
  });
  return he(s).pipe(Os(), QD(r));
}
function QD(t) {
  return vd(
    at((e) => {
      if (xs(e)) throw $D(t, e);
    }),
    Te((e) => e === !0),
  );
}
function mk(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return he(!0);
  let s = i.map((o) => {
    let a = ks(o, t),
      c = sk(a) ? a.canMatch(e, n) : Yn(t, () => a(e, n));
    return Vr(c);
  });
  return he(s).pipe(Os(), QD(r));
}
var da = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Pu = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Cs(t) {
  return Gi(new da(t));
}
function gk(t) {
  return Gi(new $(4e3, !1));
}
function yk(t) {
  return Gi(zD(!1, Wt.GuardRejected));
}
var og = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0))
          return he(r);
        if (i.numberOfChildren > 1 || !i.children[_e]) return gk(e.redirectTo);
        i = i.children[_e];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r,
      );
      if (n.startsWith("/")) throw new Pu(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let s = this.createSegmentGroup(e, n.root, r, i);
      return new Hr(
        s,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, s]) => {
          if (typeof s == "string" && s.startsWith(":")) {
            let a = s.substring(1);
            r[i] = n[a];
          } else r[i] = s;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let s = this.createSegments(e, n.segments, r, i),
        o = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          o[a] = this.createSegmentGroup(e, c, r, i);
        }),
        new Ue(s, o)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((s) =>
        s.path.startsWith(":")
          ? this.findPosParam(e, s, i)
          : this.findOrReturn(s, r),
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new $(4001, !1);
      return i;
    }
    findOrReturn(e, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === e.path) return n.splice(r), i;
        r++;
      }
      return e;
    }
  },
  ag = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function vk(t, e, n, r, i) {
  let s = gg(t, e, n);
  return s.matched
    ? ((r = W8(e, r)),
      mk(r, e, n, i).pipe(Te((o) => (o === !0 ? s : ee({}, ag)))))
    : he(s);
}
function gg(t, e, n) {
  if (e.path === "**") return Ek(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? ee({}, ag)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || p8)(n, t, e);
  if (!i) return ee({}, ag);
  let s = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    s[a] = c.path;
  });
  let o =
    i.consumed.length > 0
      ? ee(ee({}, s), i.consumed[i.consumed.length - 1].parameters)
      : s;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: o,
    positionalParamSegments: i.posParams ?? {},
  };
}
function Ek(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? ID(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function SD(t, e, n, r) {
  return n.length > 0 && Dk(t, n, r)
    ? {
        segmentGroup: new Ue(e, wk(r, new Ue(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && _k(t, n, r)
      ? {
          segmentGroup: new Ue(t.segments, bk(t, n, r, t.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new Ue(t.segments, t.children), slicedSegments: n };
}
function bk(t, e, n, r) {
  let i = {};
  for (let s of n)
    if (ju(t, e, s) && !r[On(s)]) {
      let o = new Ue([], {});
      i[On(s)] = o;
    }
  return ee(ee({}, r), i);
}
function wk(t, e) {
  let n = {};
  n[_e] = e;
  for (let r of t)
    if (r.path === "" && On(r) !== _e) {
      let i = new Ue([], {});
      n[On(r)] = i;
    }
  return n;
}
function Dk(t, e, n) {
  return n.some((r) => ju(t, e, r) && On(r) !== _e);
}
function _k(t, e, n) {
  return n.some((r) => ju(t, e, r));
}
function ju(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function Tk(t, e, n, r) {
  return On(t) !== r && (r === _e || !ju(e, n, t)) ? !1 : gg(e, t, n).matched;
}
function Sk(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var cg = class {};
function Ck(t, e, n, r, i, s, o = "emptyOnly") {
  return new lg(t, e, n, r, i, o, s).recognize();
}
var Ik = 31,
  lg = class {
    constructor(e, n, r, i, s, o, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = s),
        (this.paramsInheritanceStrategy = o),
        (this.urlSerializer = a),
        (this.applyRedirects = new og(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new $(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = SD(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        Te((n) => {
          let r = new la(
              [],
              Object.freeze({}),
              Object.freeze(ee({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              _e,
              this.rootComponentType,
              null,
              {},
            ),
            i = new Gt(r, n),
            s = new ku("", i),
            o = O8(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (o.queryParams = this.urlTree.queryParams),
            (s.url = this.urlSerializer.serialize(o)),
            this.inheritParamsAndData(s._root, null),
            { state: s, tree: o }
          );
        }),
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, _e).pipe(
        Er((r) => {
          if (r instanceof Pu)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof da ? this.noMatchError(r) : r;
        }),
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = fg(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((s) => this.inheritParamsAndData(s, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            Te((s) => (s instanceof Gt ? [s] : [])),
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return Ke(i).pipe(
        br((s) => {
          let o = r.children[s],
            a = Q8(n, s);
          return this.processSegmentGroup(e, a, o, s);
        }),
        Nd((s, o) => (s.push(...o), s)),
        wr(null),
        Md(),
        Ye((s) => {
          if (s === null) return Cs(r);
          let o = KD(s);
          return Mk(o), he(o);
        }),
      );
    }
    processSegment(e, n, r, i, s, o) {
      return Ke(n).pipe(
        br((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            s,
            o,
          ).pipe(
            Er((c) => {
              if (c instanceof da) return he(null);
              throw c;
            }),
          ),
        ),
        on((a) => !!a),
        Er((a) => {
          if (WD(a)) return Sk(r, i, s) ? he(new cg()) : Cs(r);
          throw a;
        }),
      );
    }
    processSegmentAgainstRoute(e, n, r, i, s, o, a) {
      return Tk(r, i, s, o)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, s, o)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, s, o)
            : Cs(i)
        : Cs(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, s, o) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = gg(n, i, s);
      if (!a) return Cs(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Ik && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(Ye((m) => this.processSegment(e, r, n, m.concat(u), o, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, s) {
      let o = vk(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        o.pipe(
          Ft((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  Ft(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: m,
                      } = a,
                      E = new la(
                        u,
                        m,
                        Object.freeze(ee({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Ak(r),
                        On(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        xk(r),
                      ),
                      { segmentGroup: C, slicedSegments: M } = SD(n, u, d, c);
                    if (M.length === 0 && C.hasChildren())
                      return this.processChildren(l, c, C).pipe(
                        Te((A) => (A === null ? null : new Gt(E, A))),
                      );
                    if (c.length === 0 && M.length === 0)
                      return he(new Gt(E, []));
                    let P = On(r) === s;
                    return this.processSegment(l, c, C, M, P ? _e : s, !0).pipe(
                      Te((A) => new Gt(E, A instanceof Gt ? [A] : [])),
                    );
                  }),
                ))
              : Cs(n),
          ),
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? he({ routes: n.children, injector: e })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? he({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : pk(e, n, r, this.urlSerializer).pipe(
                Ye((i) =>
                  i
                    ? this.configLoader.loadChildren(e, n).pipe(
                        at((s) => {
                          (n._loadedRoutes = s.routes),
                            (n._loadedInjector = s.injector);
                        }),
                      )
                    : yk(n),
                ),
              )
          : he({ routes: [], injector: e });
    }
  };
function Mk(t) {
  t.sort((e, n) =>
    e.value.outlet === _e
      ? -1
      : n.value.outlet === _e
        ? 1
        : e.value.outlet.localeCompare(n.value.outlet),
  );
}
function Nk(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function KD(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!Nk(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((s) => r.value.routeConfig === s.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = KD(r.children);
    e.push(new Gt(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function Ak(t) {
  return t.data || {};
}
function xk(t) {
  return t.resolve || {};
}
function Rk(t, e, n, r, i, s) {
  return Ye((o) =>
    Ck(t, e, n, r, o.extractedUrl, i, s).pipe(
      Te(({ state: a, tree: c }) =>
        nt(ee({}, o), { targetSnapshot: a, urlAfterRedirects: c }),
      ),
    ),
  );
}
function Ok(t, e) {
  return Ye((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return he(n);
    let s = new Set(i.map((c) => c.route)),
      o = new Set();
    for (let c of s) if (!o.has(c)) for (let l of YD(c)) o.add(l);
    let a = 0;
    return Ke(o).pipe(
      br((c) =>
        s.has(c)
          ? kk(c, r, t, e)
          : ((c.data = fg(c, c.parent, t).resolve), he(void 0)),
      ),
      at(() => a++),
      Qi(1),
      Ye((c) => (a === o.size ? he(n) : Tt)),
    );
  });
}
function YD(t) {
  let e = t.children.map((n) => YD(n)).flat();
  return [t, ...e];
}
function kk(t, e, n, r) {
  let i = t.routeConfig,
    s = t._resolve;
  return (
    i?.title !== void 0 && !VD(i) && (s[fa] = i.title),
    Lk(s, t, e, r).pipe(
      Te(
        (o) => (
          (t._resolvedData = o), (t.data = fg(t, t.parent, n).resolve), null
        ),
      ),
    )
  );
}
function Lk(t, e, n, r) {
  let i = Bm(t);
  if (i.length === 0) return he({});
  let s = {};
  return Ke(i).pipe(
    Ye((o) =>
      Pk(t[o], e, n, r).pipe(
        on(),
        at((a) => {
          s[o] = a;
        }),
      ),
    ),
    Qi(1),
    Ys(s),
    Er((o) => (WD(o) ? Tt : Gi(o))),
  );
}
function Pk(t, e, n, r) {
  let i = ha(e) ?? r,
    s = ks(t, i),
    o = s.resolve ? s.resolve(e, n) : Yn(i, () => s(e, n));
  return Vr(o);
}
function Fm(t) {
  return Ft((e) => {
    let n = t(e);
    return n ? Ke(n).pipe(Te(() => e)) : he(e);
  });
}
var ZD = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          s = r.root;
        for (; s !== void 0; )
          (i = this.getResolvedTitleForRoute(s) ?? i),
            (s = s.children.find((o) => o.outlet === _e));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[fa];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(Fk), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Fk = (() => {
    let e = class e extends ZD {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(ie(yw));
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  yg = new oe("", { providedIn: "root", factory: () => ({}) }),
  vg = new oe(""),
  jk = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = G(Ep));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return he(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Vr(r.loadComponent()).pipe(
            Te(XD),
            at((o) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = o);
            }),
            Dr(() => {
              this.componentLoaders.delete(r);
            }),
          ),
          s = new Ui(i, () => new it()).pipe(Hi());
        return this.componentLoaders.set(r, s), s;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return he({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = Bk(i, this.compiler, r, this.onLoadEndListener).pipe(
            Dr(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          a = new Ui(o, () => new it()).pipe(Hi());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Bk(t, e, n, r) {
  return Vr(t.loadChildren()).pipe(
    Te(XD),
    Ye((i) =>
      i instanceof Eo || Array.isArray(i) ? he(i) : Ke(e.compileModuleAsync(i)),
    ),
    Te((i) => {
      r && r(t);
      let s,
        o,
        a = !1;
      return (
        Array.isArray(i)
          ? ((o = i), (a = !0))
          : ((s = i.create(n).injector),
            (o = s.get(vg, [], { optional: !0, self: !0 }).flat())),
        { routes: o.map(mg), injector: s }
      );
    }),
  );
}
function Hk(t) {
  return t && typeof t == "object" && "default" in t;
}
function XD(t) {
  return Hk(t) ? t.default : t;
}
var Eg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(Uk), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Uk = (() => {
    let e = class e {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, i) {
        return r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Vk = new oe("");
var qk = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new it()),
        (this.transitionAbortSubject = new it()),
        (this.configLoader = G(jk)),
        (this.environmentInjector = G(kt)),
        (this.urlSerializer = G(dg)),
        (this.rootContexts = G(Fu)),
        (this.location = G(Oo)),
        (this.inputBindingEnabled = G(pg, { optional: !0 }) !== null),
        (this.titleStrategy = G(ZD)),
        (this.options = G(yg, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = G(Eg)),
        (this.createViewTransition = G(Vk, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => he(void 0)),
        (this.rootComponentType = null);
      let r = (s) => this.events.next(new Qm(s)),
        i = (s) => this.events.next(new Km(s));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(
        nt(ee(ee({}, this.transitions.value), r), { id: i }),
      );
    }
    setupNavigations(r, i, s) {
      return (
        (this.transitions = new ht({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: na,
          restoredState: null,
          currentSnapshot: s.snapshot,
          targetSnapshot: null,
          currentRouterState: s,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          St((o) => o.id !== 0),
          Te((o) =>
            nt(ee({}, o), {
              extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
            }),
          ),
          Ft((o) => {
            let a = !1,
              c = !1;
            return he(o).pipe(
              Ft((l) => {
                if (this.navigationId > o.id)
                  return (
                    this.cancelNavigationTransition(
                      o,
                      "",
                      Wt.SupersededByNewNavigation,
                    ),
                    Tt
                  );
                (this.currentTransition = o),
                  (this.currentNavigation = {
                    id: l.id,
                    initialUrl: l.rawUrl,
                    extractedUrl: l.extractedUrl,
                    trigger: l.source,
                    extras: l.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? nt(ee({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let u =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = l.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                if (!u && d !== "reload") {
                  let m = "";
                  return (
                    this.events.next(
                      new xi(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        m,
                        qm.IgnoredSameUrlNavigation,
                      ),
                    ),
                    l.resolve(null),
                    Tt
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return he(l).pipe(
                    Ft((m) => {
                      let E = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new sa(
                            m.id,
                            this.urlSerializer.serialize(m.extractedUrl),
                            m.source,
                            m.restoredState,
                          ),
                        ),
                        E !== this.transitions?.getValue()
                          ? Tt
                          : Promise.resolve(m)
                      );
                    }),
                    Rk(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy,
                    ),
                    at((m) => {
                      (o.targetSnapshot = m.targetSnapshot),
                        (o.urlAfterRedirects = m.urlAfterRedirects),
                        (this.currentNavigation = nt(
                          ee({}, this.currentNavigation),
                          { finalUrl: m.urlAfterRedirects },
                        ));
                      let E = new xu(
                        m.id,
                        this.urlSerializer.serialize(m.extractedUrl),
                        this.urlSerializer.serialize(m.urlAfterRedirects),
                        m.targetSnapshot,
                      );
                      this.events.next(E);
                    }),
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: m,
                      extractedUrl: E,
                      source: C,
                      restoredState: M,
                      extras: P,
                    } = l,
                    A = new sa(m, this.urlSerializer.serialize(E), C, M);
                  this.events.next(A);
                  let _ = HD(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = o =
                      nt(ee({}, l), {
                        targetSnapshot: _,
                        urlAfterRedirects: E,
                        extras: nt(ee({}, P), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = E),
                    he(o)
                  );
                } else {
                  let m = "";
                  return (
                    this.events.next(
                      new xi(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        m,
                        qm.IgnoredByUrlHandlingStrategy,
                      ),
                    ),
                    l.resolve(null),
                    Tt
                  );
                }
              }),
              at((l) => {
                let u = new $m(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                );
                this.events.next(u);
              }),
              Te(
                (l) => (
                  (this.currentTransition = o =
                    nt(ee({}, l), {
                      guards: Y8(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts,
                      ),
                    })),
                  o
                ),
              ),
              ok(this.environmentInjector, (l) => this.events.next(l)),
              at((l) => {
                if (((o.guardsResult = l.guardsResult), xs(l.guardsResult)))
                  throw $D(this.urlSerializer, l.guardsResult);
                let u = new zm(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult,
                );
                this.events.next(u);
              }),
              St((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", Wt.GuardRejected),
                    !1),
              ),
              Fm((l) => {
                if (l.guards.canActivateChecks.length)
                  return he(l).pipe(
                    at((u) => {
                      let d = new Gm(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                    Ft((u) => {
                      let d = !1;
                      return he(u).pipe(
                        Ok(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector,
                        ),
                        at({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                u,
                                "",
                                Wt.NoDataFromResolver,
                              );
                          },
                        }),
                      );
                    }),
                    at((u) => {
                      let d = new Wm(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                  );
              }),
              Fm((l) => {
                let u = (d) => {
                  let m = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    m.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        at((E) => {
                          d.component = E;
                        }),
                        Te(() => {}),
                      ),
                    );
                  for (let E of d.children) m.push(...u(E));
                  return m;
                };
                return gc(u(l.targetSnapshot.root)).pipe(wr(null), Zt(1));
              }),
              Fm(() => this.afterPreactivation()),
              Ft(() => {
                let { currentSnapshot: l, targetSnapshot: u } = o,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root,
                  );
                return d ? Ke(d).pipe(Te(() => o)) : he(o);
              }),
              Te((l) => {
                let u = V8(
                  r.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState,
                );
                return (
                  (this.currentTransition = o =
                    nt(ee({}, l), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  o
                );
              }),
              at(() => {
                this.events.next(new aa());
              }),
              K8(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled,
              ),
              Zt(1),
              at({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Ai(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                      ),
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot,
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              Od(
                this.transitionAbortSubject.pipe(
                  at((l) => {
                    throw l;
                  }),
                ),
              ),
              Dr(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    o,
                    "",
                    Wt.SupersededByNewNavigation,
                  ),
                  this.currentTransition?.id === o.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              Er((l) => {
                if (((c = !0), GD(l)))
                  this.events.next(
                    new Ur(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l.message,
                      l.cancellationCode,
                    ),
                  ),
                    z8(l) ? this.events.next(new ca(l.url)) : o.resolve(!1);
                else {
                  this.events.next(
                    new oa(
                      o.id,
                      this.urlSerializer.serialize(o.extractedUrl),
                      l,
                      o.targetSnapshot ?? void 0,
                    ),
                  );
                  try {
                    o.resolve(r.errorHandler(l));
                  } catch (u) {
                    this.options.resolveNavigationPromiseOnError
                      ? o.resolve(!1)
                      : o.reject(u);
                  }
                }
                return Tt;
              }),
            );
          }),
        )
      );
    }
    cancelNavigationTransition(r, i, s) {
      let o = new Ur(r.id, this.urlSerializer.serialize(r.extractedUrl), i, s);
      this.events.next(o), r.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function $k(t) {
  return t !== na;
}
var zk = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(Gk), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ug = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, n) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, n) {
      return e.routeConfig === n.routeConfig;
    }
  },
  Gk = (() => {
    let e = class e extends ug {};
    (e.ɵfac = (() => {
      let r;
      return function (s) {
        return (r || (r = Bh(e)))(s || e);
      };
    })()),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  JD = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: () => G(Wk), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Wk = (() => {
    let e = class e extends JD {
      constructor() {
        super(...arguments),
          (this.location = G(Oo)),
          (this.urlSerializer = G(dg)),
          (this.options = G(yg, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = G(Eg)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Hr()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = HD(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && r(i.url, i.state);
        });
      }
      handleRouterEvent(r, i) {
        if (r instanceof sa) this.stateMemento = this.createStateMemento();
        else if (r instanceof xi) this.rawUrlTree = i.initialUrl;
        else if (r instanceof xu) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let s = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(s, i);
          }
        } else
          r instanceof aa
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl,
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Ur &&
                (r.code === Wt.GuardRejected ||
                  r.code === Wt.NoDataFromResolver)
              ? this.restoreHistory(i)
              : r instanceof oa
                ? this.restoreHistory(i, !0)
                : r instanceof Ai &&
                  ((this.lastSuccessfulId = r.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let s = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(s) || i.extras.replaceUrl) {
          let o = this.browserPageId,
            a = ee(ee({}, i.extras.state), this.generateNgRouterState(i.id, o));
          this.location.replaceState(s, "", a);
        } else {
          let o = ee(
            ee({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          );
          this.location.go(s, "", o);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let s = this.browserPageId,
            o = this.currentPageId - s;
          o !== 0
            ? this.location.historyGo(o)
            : this.currentUrlTree === r.finalUrl &&
              o === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r };
      }
    };
    (e.ɵfac = (() => {
      let r;
      return function (s) {
        return (r || (r = Bh(e)))(s || e);
      };
    })()),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ea = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(ea || {});
function Qk(t, e) {
  t.events
    .pipe(
      St(
        (n) =>
          n instanceof Ai ||
          n instanceof Ur ||
          n instanceof oa ||
          n instanceof xi,
      ),
      Te((n) =>
        n instanceof Ai || n instanceof xi
          ? ea.COMPLETE
          : (
                n instanceof Ur
                  ? n.code === Wt.Redirect ||
                    n.code === Wt.SupersededByNewNavigation
                  : !1
              )
            ? ea.REDIRECTING
            : ea.FAILED,
      ),
      St((n) => n !== ea.REDIRECTING),
      Zt(1),
    )
    .subscribe(() => {
      e();
    });
}
function Kk(t) {
  throw t;
}
var Yk = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Zk = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  e_ = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = G(Pl)),
          (this.stateManager = G(JD)),
          (this.options = G(yg, { optional: !0 }) || {}),
          (this.pendingTasks = G(kr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = G(qk)),
          (this.urlSerializer = G(dg)),
          (this.location = G(Oo)),
          (this.urlHandlingStrategy = G(Eg)),
          (this._events = new it()),
          (this.errorHandler = this.options.errorHandler || Kk),
          (this.navigated = !1),
          (this.routeReuseStrategy = G(zk)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = G(vg, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!G(pg, { optional: !0 })),
          (this.eventsSubscription = new rt()),
          (this.isNgZoneEnabled = G($e) instanceof $e && $e.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let s = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (s !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof Ur &&
                  i.code !== Wt.Redirect &&
                  i.code !== Wt.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Ai) this.navigated = !0;
              else if (i instanceof ca) {
                let a = this.urlHandlingStrategy.merge(i.url, s.currentRawUrl),
                  c = {
                    info: s.extras.info,
                    skipLocationChange: s.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || $k(s.source),
                  };
                this.scheduleNavigation(a, na, null, c, {
                  resolve: s.resolve,
                  reject: s.reject,
                  promise: s.promise,
                });
              }
            }
            Jk(i) && this._events.next(i);
          } catch (s) {
            this.navigationTransitions.transitionAbortSubject.next(s);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              na,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, "popstate", i);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(r, i, s) {
        let o = { replaceUrl: !0 },
          a = s?.navigationId ? s : null;
        if (s) {
          let l = ee({}, s);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (o.state = l);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, i, a, o);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(mg)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, i = {}) {
        let {
            relativeTo: s,
            queryParams: o,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = ee(ee({}, this.currentUrlTree.queryParams), o);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = o || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let m;
        try {
          let E = s ? s.snapshot : this.routerState.snapshot.root;
          m = PD(E);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (m = this.currentUrlTree.root);
        }
        return FD(m, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let s = xs(r) ? r : this.parseUrl(r),
          o = this.urlHandlingStrategy.merge(s, this.rawUrlTree);
        return this.scheduleNavigation(o, na, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return Xk(r), this.navigateByUrl(this.createUrlTree(r, i), i);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(r, i) {
        let s;
        if (
          (i === !0 ? (s = ee({}, Yk)) : i === !1 ? (s = ee({}, Zk)) : (s = i),
          xs(r))
        )
          return wD(this.currentUrlTree, r, s);
        let o = this.parseUrl(r);
        return wD(this.currentUrlTree, o, s);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [s, o]) => (o != null && (i[s] = o), i),
          {},
        );
      }
      scheduleNavigation(r, i, s, o, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((m, E) => {
              (c = m), (l = E);
            }));
        let d = this.pendingTasks.add();
        return (
          Qk(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: s,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: o,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((m) => Promise.reject(m))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = Z({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Xk(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new $(4008, !1);
}
function Jk(t) {
  return !(t instanceof aa) && !(t instanceof ca);
}
var eL = new oe("");
function g7(t, ...e) {
  return Tn([
    { provide: vg, multi: !0, useValue: t },
    [],
    { provide: Rs, useFactory: tL, deps: [e_] },
    { provide: ys, multi: !0, useFactory: nL },
    e.map((n) => n.ɵproviders),
  ]);
}
function tL(t) {
  return t.routerState.root;
}
function nL() {
  let t = G(Jt);
  return (e) => {
    let n = t.get(hn);
    if (e !== n.components[0]) return;
    let r = t.get(e_),
      i = t.get(rL);
    t.get(iL) === 1 && r.initialNavigation(),
      t.get(sL, null, Ce.Optional)?.setUpPreloading(),
      t.get(eL, null, Ce.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var rL = new oe("", { factory: () => new it() }),
  iL = new oe("", { providedIn: "root", factory: () => 1 });
var sL = new oe("");
export {
  rt as a,
  Ae as b,
  Ui as c,
  it as d,
  ht as e,
  ST as f,
  Tt as g,
  XP as h,
  Ke as i,
  he as j,
  Gi as k,
  Sd as l,
  Te as m,
  gc as n,
  vr as o,
  yc as p,
  UT as q,
  Cd as r,
  QT as s,
  St as t,
  KT as u,
  Er as v,
  YT as w,
  Zt as x,
  ZT as y,
  XT as z,
  Dr as A,
  xd as B,
  tS as C,
  nS as D,
  Rd as E,
  Ft as F,
  Od as G,
  at as H,
  $ as I,
  bv as J,
  Z as K,
  Ar as L,
  oe as M,
  ie as N,
  G as O,
  zn as P,
  Pv as Q,
  xr as R,
  Rr as S,
  To as T,
  Gj as U,
  Wj as V,
  Qj as W,
  Bh as X,
  TE as Y,
  Jt as Z,
  fn as _,
  Xn as $,
  yt as aa,
  hf as ba,
  ms as ca,
  Lt as da,
  Uh as ea,
  Vh as fa,
  er as ga,
  Kj as ha,
  Yj as ia,
  Et as ja,
  n1 as ka,
  pi as la,
  Ll as ma,
  bi as na,
  $e as oa,
  tr as pa,
  Jj as qa,
  iN as ra,
  Hb as sa,
  zf as ta,
  zb as ua,
  MN as va,
  Kb as wa,
  NN as xa,
  e3 as ya,
  t3 as za,
  n3 as Aa,
  r3 as Ba,
  i3 as Ca,
  t0 as Da,
  n0 as Ea,
  mp as Fa,
  i0 as Ga,
  s0 as Ha,
  WN as Ia,
  s3 as Ja,
  YN as Ka,
  ZN as La,
  l0 as Ma,
  nA as Na,
  o3 as Oa,
  a3 as Pa,
  c3 as Qa,
  sA as Ra,
  d0 as Sa,
  oA as Ta,
  l3 as Ua,
  aA as Va,
  cA as Wa,
  u3 as Xa,
  d3 as Ya,
  dA as Za,
  h0 as _a,
  fA as $a,
  f3 as ab,
  m0 as bb,
  h3 as cb,
  p3 as db,
  m3 as eb,
  Pl as fb,
  No as gb,
  ys as hb,
  hn as ib,
  Ao as jb,
  Ep as kb,
  Hl as lb,
  vs as mb,
  wp as nb,
  Dp as ob,
  _p as pb,
  j0 as qb,
  KA as rb,
  XA as sb,
  g3 as tb,
  Nn as ub,
  ze as vb,
  ex as wb,
  Oo as xb,
  B3 as yb,
  H3 as zb,
  U3 as Ab,
  V3 as Bb,
  q3 as Cb,
  ix as Db,
  sx as Eb,
  ko as Fb,
  Fr as Gb,
  px as Hb,
  xx as Ib,
  f4 as Jb,
  nR as Kb,
  h4 as Lb,
  m4 as Mb,
  g4 as Nb,
  qp as Ob,
  y4 as Pb,
  v4 as Qb,
  x4 as Rb,
  Du as Sb,
  i8 as Tb,
  $4 as Ub,
  f8 as Vb,
  z4 as Wb,
  G4 as Xb,
  U8 as Yb,
  Bk as Zb,
  e_ as _b,
  g7 as $b,
};
