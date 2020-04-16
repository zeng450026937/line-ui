import e from 'vue';
const t = (e, t = 300) => {
    let i;
    return function (...s) {
      clearTimeout(i), (i = setTimeout(() => e.call(this, ...s), t));
    };
  },
  i = () => {},
  s = () => !1,
  n = (e) => Object.keys(e),
  { hasOwnProperty: a } = Object.prototype,
  { isArray: r } = Array,
  o = (e) => 'function' == typeof e,
  l = (e) => 'string' == typeof e,
  d = (e) => 'object' == typeof e && null !== e,
  c = (e) => null != e,
  h = (e, t) => {
    if ('function' == typeof e)
      try {
        return e(t);
      } catch (e) {}
  };
function p(e, t = {}) {
  const { components: i, directives: s } = t;
  i &&
    n(i).forEach((t) => {
      e.use(i[t]);
    }),
    s &&
      n(s)
        .filter((e) => /^v/i.test(e))
        .forEach((t) => {
          e.use(s[t]);
        });
}
function u() {
  return (u =
    Object.assign ||
    function (e) {
      for (var t, i = 1; i < arguments.length; i++)
        for (var s in (t = arguments[i]))
          Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
      return e;
    }).apply(this, arguments);
}
var m = ['attrs', 'props', 'domProps'],
  f = ['class', 'style', 'directives'],
  g = ['on', 'nativeOn'],
  v = function (e, t) {
    return function () {
      e && e.apply(this, arguments), t && t.apply(this, arguments);
    };
  },
  b = function (e) {
    return e.reduce(function (e, t) {
      for (var i in t)
        if (e[i])
          if (-1 !== m.indexOf(i)) e[i] = u({}, e[i], t[i]);
          else if (-1 !== f.indexOf(i)) {
            e[i] = (e[i] instanceof Array ? e[i] : [e[i]]).concat(
              t[i] instanceof Array ? t[i] : [t[i]]
            );
          } else if (-1 !== g.indexOf(i))
            for (var s in t[i])
              if (e[i][s]) {
                e[i][s] = (e[i][s] instanceof Array
                  ? e[i][s]
                  : [e[i][s]]
                ).concat(t[i][s] instanceof Array ? t[i][s] : [t[i][s]]);
              } else e[i][s] = t[i][s];
          else if ('hook' == i)
            for (var n in t[i])
              e[i][n] = e[i][n] ? v(e[i][n], t[i][n]) : t[i][n];
          else e[i] = t[i];
        else e[i] = t[i];
      return e;
    }, {});
  };
function y(e, t, i) {
  return t ? e + i + t : e;
}
function w(e, t) {
  if ('string' == typeof t) return y(e, t, '--');
  if (Array.isArray(t)) return t.map((t) => w(e, t));
  const i = {};
  return (
    t &&
      Object.keys(t).forEach((s) => {
        i[e + '--' + s] = t[s];
      }),
    i
  );
}
function x(e) {
  return function (t, i) {
    return (
      t && 'string' != typeof t && ((i = t), (t = '')),
      (t = y(e, t, '__')),
      i ? [t, w(t, i)] : t
    );
  };
}
const S = (e, t) => (t ? (e ? [e, t] : t) : e),
  E = (e, t) => (e ? (t ? `${e} ${t}` : e) : t || ''),
  T = (e) =>
    r(e)
      ? (function (e) {
          let t,
            i = '';
          for (let s = 0, n = e.length; s < n; s++)
            (t = T(e[s])), c(t) && '' !== t && (i && (i += ' '), (i += t));
          return i;
        })(e)
      : d(e)
      ? (function (e) {
          let t = '';
          for (const i in e) e[i] && (t && (t += ' '), (t += i));
          return t;
        })(e)
      : l(e)
      ? e
      : '';
function $(e, t) {
  if (!t) return e;
  if (!e) return t;
  const i = { ...e };
  for (const s in t) {
    const n = e[s],
      a = t[s];
    i[s] = n ? [].concat(n, a) : a;
  }
  return i;
}
function C(e, t) {
  if (!t) return e;
  if (!e) return t;
  const i = { ...e };
  for (const s in t) {
    const n = e[s],
      a = t[s];
    switch (s) {
      case 'class':
        i[s] = S(n, a);
        break;
      case 'staticClass':
        i[s] = E(n, a);
        break;
      case 'on':
      case 'nativeOn':
        i[s] = $(n, a);
        break;
      default:
        i[s] = r(n) ? n.concat(a) : d(a) ? { ...n, ...a } : a;
    }
  }
  return i;
}
function k(e, t = !0) {
  const i = t ? '' : '$',
    s = `${i}attrs`,
    n = `${i}slots`,
    a = `${i}scopedSlots`;
  function r() {
    return { $slots: e[n], $scopedSlots: e[a] || e[s] || {} };
  }
  return {
    hasSlot: (e = 'default') => {
      const { $slots: t, $scopedSlots: i } = r();
      return !!i[e] || !!t[e];
    },
    slots: (e = 'default', t, i) => {
      const { $slots: s, $scopedSlots: n } = r(),
        a = n[e],
        l = a ? a(t) : s[e];
      if (l) {
        const t = { slotted: !0, [`slot-${e}`]: 'default' !== e };
        l.forEach((e, s) => {
          e.tag &&
            ((e.data = e.data || {}),
            e.data.__slotted ||
              ((e.data = C(e.data, { class: t })), (e.data.__slotted = !0)),
            i &&
              (e.data.__patched ||
                ((e.data = C(e.data, o(i) ? i(e.data, s) : i)),
                (e.data.__patched = !0))));
        });
      }
      return l;
    },
  };
}
function M(e) {
  const t = k(e);
  return new Proxy(e, {
    get: (e, i, s) =>
      ((e, t) => a.call(e, t))(t, i) ? t[i] : Reflect.get(e, i, s),
  });
}
function I(t) {
  const i = `${t}s`;
  return function (s = e) {
    const { name: n } = this;
    if (o(s)) return void s[t](n, this);
    const { [i]: a } = s;
    s[i] = { [n]: this, ...a };
  };
}
const P = I('component'),
  A = I('directive');
function O(t) {
  return e.extend(t);
}
let B;
function L(t = !0) {
  return (
    B ||
      (!(function () {
        const t = e.config.optionMergeStrategies;
        (t.beforeRender = t.created), (t.afterRender = t.created);
      })(),
      (B = !0)),
    O({
      beforeCreate() {
        const { $options: e } = this,
          { shouldRender: i, beforeRender: s, afterRender: n, render: a } = e;
        let r;
        e.render = (e) => {
          if (i && !i.call(this)) return t ? r : e();
          s && s.forEach((e) => e.call(this));
          let o = a.call(this, e, void 0);
          return (
            n && n.forEach((e) => (o = e.call(this, o) || o)), t && (r = o), o
          );
        };
      },
    })
  );
}
function z() {
  return O({
    created() {
      const e = k(this, !1);
      (this.hasSlot = e.hasSlot), (this.slots = e.slots);
    },
  });
}
function D(e) {
  if (e) return { [e]: !0 };
}
function N(e = 'ios') {
  return O({
    inject: { providedMode: { from: 'mode', default: e } },
    props: {
      mode: {
        type: String,
        default() {
          return this.providedMode;
        },
      },
    },
    afterRender(e) {
      e.data && (e.data.staticClass = E(e.data.staticClass, this.mode));
    },
  });
}
function H(e) {
  return function (t) {
    if (((t.name = e), (t.install = P), t.functional)) {
      const { render: e } = t;
      t.render = (t, i) => e.call(void 0, t, M(i));
    } else (t.mixins = t.mixins || []), t.mixins.push(L(), z(), N());
    return t;
  };
}
function R(e, t = 'line') {
  return { createComponent: H((e = `${t}-${e}`)), bem: x(e) };
}
const { createComponent: V, bem: Y } = R('action-group');
var q = V({
  functional: !0,
  props: { cancel: Boolean },
  render(e, { data: t, props: i, slots: s }) {
    const { cancel: n } = i;
    return e('div', b([{ class: Y({ cancel: n }) }, t]), [s()]);
  },
});
const { createComponent: F, bem: G } = R('action-sheet-title');
var X = F({
  functional: !0,
  props: { header: String, subHeader: String },
  render(e, { data: t, props: i, slots: s }) {
    const { header: n, subHeader: a } = i;
    return e('div', b([{ class: G() }, t]), [
      s() || n,
      s('subHeader')
        ? e('div', { class: G('sub-title') }, [s('subHeader')])
        : a && e('div', { class: G('sub-title') }, [a]),
    ]);
  },
});
function W(e = 'value') {
  return O({
    props: { lazy: { type: Boolean, default: !0 } },
    data() {
      return { inited: !!this[e] };
    },
    watch: {
      [e]() {
        this.inited = this.inited || !!this[e];
      },
    },
    shouldRender() {
      return this.inited || !this.lazy;
    },
  });
}
const j = 'value',
  _ = 'change';
function U(e, t = {}, i = !1) {
  const { prop: s = j, event: n = _, default: a } = t;
  return O({
    model: { prop: s, event: n },
    props: { [s]: { default: a } },
    data() {
      return i ? {} : { [e]: this[s] };
    },
    watch: {
      [s](t) {
        this[e] = t;
      },
      [e](e) {
        e !== this[s] && this.$emit(n, e);
      },
    },
    created() {
      c(this[s]) && (this[e] = this[s]);
    },
  });
}
function K(e, t, i) {
  const s = (function (e) {
    return new Proxy(
      {},
      {
        get(t, i, s) {
          if (i in t) return Reflect.get(t, i, s);
          if (i in e) {
            const s = Reflect.get(e, i);
            Reflect.set(t, i, o(s) ? s.bind(e) : s);
          }
          return Reflect.get(t, i, s);
        },
      }
    );
  })(t);
  return {
    bind(t = i.value) {
      e.bind && ((i.value = t), e.bind(s, i, void 0, void 0));
    },
    unbind() {
      e.unbind && e.unbind(s, i, void 0, void 0);
    },
    inserted(t = i.value) {
      e.inserted && ((i.value = t), e.inserted(s, i, void 0, void 0));
    },
    update(t, n) {
      e.update &&
        ((i.oldValue = i.value),
        (i.value = t),
        (i.oldArg = i.arg),
        (i.arg = n || i.arg),
        e.update(s, i, void 0, void 0));
    },
  };
}
function J(e) {
  return (e.install = A), e;
}
const Z = () =>
    'undefined' == typeof document
      ? 0
      : Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  Q = () =>
    'undefined' == typeof document
      ? 0
      : Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
let ee;
const te = (e, t, i, s) => {
    e.removeEventListener(t, i, s);
  },
  ie = (e, t, i, s = { passive: !1, capture: !1 }) => {
    const n = ((e) => {
      if (void 0 === ee)
        try {
          const t = Object.defineProperty({}, 'passive', {
            get: () => {
              ee = !0;
            },
          });
          e.addEventListener('passive-tester', null, t);
        } catch (e) {
          ee = !1;
        }
      return !!ee;
    })(e)
      ? s
      : !!s.capture;
    return e.addEventListener(t, i, n), () => te(e, t, i, n);
  };
const se = (e) => {
    if (e) {
      const { changedTouches: t } = e;
      if (t && t.length > 0) {
        const e = t[0];
        return { x: e.clientX, y: e.clientY };
      }
      if (void 0 !== e.pageX) return { x: e.pageX, y: e.pageY };
    }
    return { x: 0, y: 0 };
  },
  ne = (e) =>
    'function' == typeof requestAnimationFrame
      ? requestAnimationFrame(e)
      : setTimeout(e),
  ae = (e) => {
    if (!e) return document.body;
    const { nodeName: t } = e;
    if ('HTML' === t || 'BODY' === t) return e.ownerDocument.body;
    if ('#document' === t) return e.body;
    const { overflowY: i } = window.getComputedStyle(e);
    return 'scroll' === i || 'auto' === i ? e : ae(e.parentNode);
  },
  re = 'undefined' != typeof document,
  oe = 'undefined' != typeof window,
  le = (e) => e === window;
let de;
const ce = () => (
    void 0 === de &&
      (de = !!(
        window.CSS &&
        window.CSS.supports &&
        window.CSS.supports('--a: 0')
      )),
    de
  ),
  he = (e) => e.timeStamp || Date.now(),
  pe = (e, t = '[line-app]') =>
    e.closest(t) || document.querySelector(t) || document.body;
function ue(e, t) {
  const { container: i = '' } = t,
    s = l(i) ? pe(e, i) : i,
    { parentElement: n, nextElementSibling: a } = e;
  return (
    s.appendChild(e),
    {
      container: i,
      destroy: () => {
        const { parentElement: t } = e;
        t && n ? n.insertBefore(e, a) : e.remove();
      },
    }
  );
}
function me(e, t) {
  const { value: i, arg: s } = t;
  !1 !== i && (e.vRemote = ue(e, { container: s }));
}
function fe(e) {
  const { vRemote: t } = e;
  t && (t.destroy(), delete e.vRemote);
}
const ge = J({
  name: 'remote',
  inserted: me,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (!1 !== s && fe(e), me(e, t));
  },
  unbind: fe,
});
function ve() {
  return O({
    directives: { remote: ge },
    props: { container: [String, Function] },
    afterRender(e) {
      const { container: t } = this;
      c(t) &&
        ((e.data = e.data || {}),
        (e.data.directives || (e.data.directives = [])).push({
          name: 'remote',
          value: !0,
          arg: o(t) ? t() : t,
        }));
    },
  });
}
const be = ['before-enter', 'enter', 'after-enter', 'enter-cancelled'],
  ye = ['before-leave', 'leave', 'after-leave', 'leave-cancelled'],
  we = ['before-appear', 'appear', 'after-appear', 'appear-cancelled'];
function xe(e, t = !1) {
  return [...be, ...ye, ...(t ? we : [])].reduce(
    (t, s) => ((t[s] = (t, n) => e.$emit(s, t, n || i)), t),
    {}
  );
}
function Se(e = !0) {
  const t = { appear: e, css: !1 };
  return O({
    props: { transition: { type: Boolean, default: void 0 } },
    afterRender(e) {
      if (!1 !== this.transition)
        return this.$createElement('transition', { props: t, on: xe(this) }, [
          e,
        ]);
    },
  });
}
const Ee = new (class {
  constructor(e) {
    (this.base = 2e3), (this.index = 0), (this.stack = e);
  }
  getPopup(e = this.stack.length - 1) {
    return this.stack[e];
  }
  findPopup(e) {
    let t = this.stack.length - 1,
      i = this.stack[t];
    for (; i && !e(i); ) t--, (i = this.stack[t]);
    return i;
  }
  getActiveFocusPopup() {
    return this.findPopup((e) => e.activeFocus);
  }
  getOverlayIndex() {
    return this.base + this.index;
  }
  push(e) {
    this.stack.push(e), this.index++;
  }
  pop(e) {
    this.stack.splice(this.stack.indexOf(e), 1),
      this.stack.length || (this.index = 0);
  }
})([]);
class Te {
  constructor(e, t, i, s, n) {
    (this.id = t),
      (this.name = i),
      (this.disableScroll = n),
      (this.priority = 1e6 * s + t),
      (this.ctrl = e);
  }
  canStart() {
    return !!this.ctrl && this.ctrl.canStart(this.name);
  }
  start() {
    return !!this.ctrl && this.ctrl.start(this.name, this.id, this.priority);
  }
  capture() {
    if (!this.ctrl) return !1;
    const e = this.ctrl.capture(this.name, this.id, this.priority);
    return e && this.disableScroll && this.ctrl.disableScroll(this.id), e;
  }
  release() {
    this.ctrl &&
      (this.ctrl.release(this.id),
      this.disableScroll && this.ctrl.enableScroll(this.id));
  }
  destroy() {
    this.release(), (this.ctrl = void 0);
  }
}
class $e {
  constructor(e, t, i, s) {
    (this.id = t),
      (this.disable = i),
      (this.disableScroll = s),
      (this.ctrl = e);
  }
  block() {
    if (this.ctrl) {
      if (this.disable)
        for (const e of this.disable) this.ctrl.disableGesture(e, this.id);
      this.disableScroll && this.ctrl.disableScroll(this.id);
    }
  }
  unblock() {
    if (this.ctrl) {
      if (this.disable)
        for (const e of this.disable) this.ctrl.enableGesture(e, this.id);
      this.disableScroll && this.ctrl.enableScroll(this.id);
    }
  }
  destroy() {
    this.unblock(), (this.ctrl = void 0);
  }
}
const Ce = 'backdrop-no-scroll',
  ke = new (class {
    constructor() {
      (this.gestureId = 0),
        (this.requestedStart = new Map()),
        (this.disabledGestures = new Map()),
        (this.disabledScroll = new Set());
    }
    createGesture(e) {
      return new Te(
        this,
        this.newID(),
        e.name,
        e.priority || 0,
        !!e.disableScroll
      );
    }
    createBlocker(e = {}) {
      return new $e(this, this.newID(), e.disable, !!e.disableScroll);
    }
    start(e, t, i) {
      return this.canStart(e)
        ? (this.requestedStart.set(t, i), !0)
        : (this.requestedStart.delete(t), !1);
    }
    capture(e, t, i) {
      if (!this.start(e, t, i)) return !1;
      const s = this.requestedStart;
      let n = -1e4;
      if (
        (s.forEach((e) => {
          n = Math.max(n, e);
        }),
        n === i)
      ) {
        (this.capturedId = t), s.clear();
        const i = new CustomEvent('lineGestureCaptured', {
          detail: { gestureName: e },
        });
        return document.dispatchEvent(i), !0;
      }
      return s.delete(t), !1;
    }
    release(e) {
      this.requestedStart.delete(e),
        this.capturedId === e && (this.capturedId = void 0);
    }
    disableGesture(e, t) {
      let i = this.disabledGestures.get(e);
      void 0 === i && ((i = new Set()), this.disabledGestures.set(e, i)),
        i.add(t);
    }
    enableGesture(e, t) {
      const i = this.disabledGestures.get(e);
      void 0 !== i && i.delete(t);
    }
    disableScroll(e) {
      this.disabledScroll.add(e),
        1 === this.disabledScroll.size && document.body.classList.add(Ce);
    }
    enableScroll(e) {
      this.disabledScroll.delete(e),
        0 === this.disabledScroll.size && document.body.classList.remove(Ce);
    }
    canStart(e) {
      return void 0 === this.capturedId && !this.isDisabled(e);
    }
    isCaptured() {
      return void 0 !== this.capturedId;
    }
    isScrollDisabled() {
      return this.disabledScroll.size > 0;
    }
    isDisabled(e) {
      const t = this.disabledGestures.get(e);
      return !!(t && t.size > 0);
    }
    newID() {
      return this.gestureId++, this.gestureId;
    }
  })(),
  Me = (e) => (e instanceof Document ? e : e.ownerDocument),
  Ie = (e) => {
    let t = !1,
      i = !1,
      s = !0,
      n = !1;
    const a = {
        disableScroll: !1,
        direction: 'x',
        gesturePriority: 0,
        passive: !0,
        maxAngle: 40,
        threshold: 10,
        ...e,
      },
      r = a.canStart,
      o = a.onWillStart,
      l = a.onStart,
      d = a.onEnd,
      c = a.notCaptured,
      h = a.onMove,
      p = a.threshold,
      u = {
        type: 'pan',
        startX: 0,
        startY: 0,
        startTime: 0,
        currentX: 0,
        currentY: 0,
        velocityX: 0,
        velocityY: 0,
        deltaX: 0,
        deltaY: 0,
        currentTime: 0,
        event: void 0,
        data: void 0,
      },
      m = ((e, t, i) => {
        const s = i * (Math.PI / 180),
          n = 'x' === e,
          a = Math.cos(s),
          r = t * t;
        let o = 0,
          l = 0,
          d = !1,
          c = 0;
        return {
          start(e, t) {
            (o = e), (l = t), (c = 0), (d = !0);
          },
          detect(e, t) {
            if (!d) return !1;
            const i = e - o,
              s = t - l,
              h = i * i + s * s;
            if (h < r) return !1;
            const p = Math.sqrt(h),
              u = (n ? i : s) / p;
            return (c = u > a ? 1 : u < -a ? -1 : 0), (d = !1), !0;
          },
          isGesture: () => 0 !== c,
          getDirection: () => c,
        };
      })(a.direction, a.threshold, a.maxAngle),
      f = ke.createGesture({
        name: e.gestureName,
        priority: e.gesturePriority,
        disableScroll: e.disableScroll,
      }),
      g = () => {
        t && ((n = !1), h && h(u));
      },
      v = () =>
        !(f && !f.capture()) &&
        ((t = !0),
        (s = !1),
        (u.startX = u.currentX),
        (u.startY = u.currentY),
        (u.startTime = u.currentTime),
        o ? o(u).then(b) : b(),
        !0),
      b = () => {
        l && l(u), (s = !0);
      },
      y = () => {
        (t = !1), (i = !1), (n = !1), (s = !0), f.release();
      },
      w = (e) => {
        const i = t,
          n = s;
        y(), n && (Pe(u, e), i ? d && d(u) : c && c(u));
      },
      x = ((e, t, i, s, n) => {
        let a,
          r,
          o,
          l,
          d,
          c,
          h,
          p = 0;
        const u = (s) => {
            (p = Date.now() + 2e3),
              t(s) &&
                (!r && i && (r = ie(e, 'touchmove', i, n)),
                o || (o = ie(e, 'touchend', f, n)),
                l || (l = ie(e, 'touchcancel', f, n)));
          },
          m = (s) => {
            p > Date.now() ||
              (t(s) &&
                (!c && i && (c = ie(Me(e), 'mousemove', i, n)),
                h || (h = ie(Me(e), 'mouseup', g, n))));
          },
          f = (e) => {
            v(), s && s(e);
          },
          g = (e) => {
            b(), s && s(e);
          },
          v = () => {
            r && r(), o && o(), l && l(), (r = o = l = void 0);
          },
          b = () => {
            c && c(), h && h(), (c = h = void 0);
          },
          y = () => {
            v(), b();
          },
          w = (t = !0) => {
            t
              ? (a || (a = ie(e, 'touchstart', u, n)),
                d || (d = ie(e, 'mousedown', m, n)))
              : (a && a(), d && d(), (a = d = void 0), y());
          };
        return {
          enable: w,
          stop: y,
          destroy: () => {
            w(!1), (s = i = t = void 0);
          },
        };
      })(
        a.el,
        (e) => {
          const t = Oe(e);
          return (
            !(i || !s) &&
            (Ae(e, u),
            (u.startX = u.currentX),
            (u.startY = u.currentY),
            (u.startTime = u.currentTime = t),
            (u.velocityX = u.velocityY = u.deltaX = u.deltaY = 0),
            (u.event = e),
            (!r || !1 !== r(u)) &&
              (f.release(),
              !!f.start() &&
                ((i = !0), 0 === p ? v() : (m.start(u.startX, u.startY), !0))))
          );
        },
        (e) => {
          t
            ? !n && s && ((n = !0), Pe(u, e), requestAnimationFrame(g))
            : (Pe(u, e),
              m.detect(u.currentX, u.currentY) &&
                ((m.isGesture() && v()) || S()));
        },
        w,
        { capture: !1 }
      ),
      S = () => {
        y(), x.stop(), c && c(u);
      };
    return {
      enable(e = !0) {
        e || (t && w(void 0), y()), x.enable(e);
      },
      destroy() {
        f.destroy(), x.destroy();
      },
    };
  },
  Pe = (e, t) => {
    if (!t) return;
    const i = e.currentX,
      s = e.currentY,
      n = e.currentTime;
    Ae(t, e);
    const a = e.currentX,
      r = e.currentY,
      o = (e.currentTime = Oe(t)) - n;
    if (o > 0 && o < 100) {
      const t = (r - s) / o;
      (e.velocityX = 0.7 * ((a - i) / o) + 0.3 * e.velocityX),
        (e.velocityY = 0.7 * t + 0.3 * e.velocityY);
    }
    (e.deltaX = a - e.startX), (e.deltaY = r - e.startY), (e.event = t);
  },
  Ae = (e, t) => {
    let i = 0,
      s = 0;
    if (e) {
      const t = e.changedTouches;
      if (t && t.length > 0) {
        const e = t[0];
        (i = e.clientX), (s = e.clientY);
      } else void 0 !== e.pageX && ((i = e.pageX), (s = e.pageY));
    }
    (t.currentX = i), (t.currentY = s);
  },
  Oe = (e) => e.timeStamp || Date.now(),
  Be = (e, t) => t.test(e.navigator.userAgent),
  Le = (e) => ((e, t) => e.matchMedia(t).matches)(e, '(any-pointer:coarse)'),
  ze = (e) => !!Be(e, /iPad/i) || !(!Be(e, /Macintosh/i) || !Le(e)),
  De = (e) => Be(e, /android|sink/i),
  Ne = (e) => !!(e.cordova || e.phonegap || e.PhoneGap),
  He = (e) => {
    const t = e.Capacitor;
    return !(!t || !t.isNative);
  },
  Re = (e) => Ne(e) || He(e),
  Ve = {
    ipad: ze,
    iphone: (e) => Be(e, /iPhone/i),
    ios: (e) => Be(e, /iPhone|iPod/i) || ze(e),
    android: De,
    phablet: (e) => {
      const t = e.innerWidth,
        i = e.innerHeight,
        s = Math.min(t, i),
        n = Math.max(t, i);
      return s > 390 && s < 520 && n > 620 && n < 800;
    },
    tablet: (e) => {
      const t = e.innerWidth,
        i = e.innerHeight,
        s = Math.min(t, i),
        n = Math.max(t, i);
      return (
        ze(e) ||
        ((e) => De(e) && !Be(e, /mobile/i))(e) ||
        (s > 460 && s < 820 && n > 780 && n < 1400)
      );
    },
    cordova: Ne,
    capacitor: He,
    electron: (e) => Be(e, /electron/i),
    pwa: (e) =>
      !(
        !e.matchMedia('(display-mode: standalone)').matches &&
        !e.navigator.standalone
      ),
    mobile: Le,
    mobileweb: (e) => Le(e) && !Re(e),
    desktop: (e) => !Le(e),
    hybrid: Re,
  },
  Ye = (e = window) => {
    e.Line = e.Line || {};
    let { platforms: t } = e.Line;
    return (
      null == t &&
        ((t = e.Line.platforms = ((e) =>
          Object.keys(Ve).filter((t) => Ve[t](e)))(e)),
        t.forEach((t) => e.document.documentElement.classList.add(`plt-${t}`))),
      t
    );
  },
  qe = (e, t) => (
    'string' == typeof e && ((t = e), (e = void 0)),
    ((e) => Ye(e))(e).includes(t)
  );
const Fe = new (class {
    constructor() {
      this.m = new Map();
    }
    reset(e) {
      this.m = new Map(Object.entries(e));
    }
    get(e, t) {
      const i = this.m.get(e);
      return void 0 !== i ? i : t;
    }
    getBoolean(e, t = !1) {
      const i = this.m.get(e);
      return void 0 === i ? t : 'string' == typeof i ? 'true' === i : !!i;
    }
    getNumber(e, t) {
      const i = parseFloat(this.m.get(e));
      return Number.isNaN(i) ? (void 0 !== t ? t : NaN) : i;
    }
    set(e, t) {
      this.m.set(e, t);
    }
  })(),
  Ge = (e) => {
    try {
      const t = e.sessionStorage.getItem('line-persist-config');
      return null !== t ? JSON.parse(t) : {};
    } catch (e) {
      return {};
    }
  },
  Xe = (e) => {
    const t = {};
    try {
      e.location.search
        .slice(1)
        .split('&')
        .map((e) => e.split('='))
        .map(([e, t]) => [decodeURIComponent(e), decodeURIComponent(t)])
        .filter(([e]) => ((e, t) => e.substr(0, t.length) === t)(e, 'line:'))
        .map(([e, t]) => [e.slice('line:'.length), t])
        .forEach(([e, i]) => {
          t[e] = i;
        });
    } catch (e) {}
    return t;
  };
let We;
const je = (e) => {
  for (; e; ) {
    const t = e.getAttribute('mode');
    if (t) return t;
    e = e.parentElement;
  }
  return We;
};
function _e(e) {
  const t = oe && window,
    i = re && document;
  let s = {};
  oe && (s = t.Line || s),
    (e = {
      ...e,
      ...(oe && Ge(t)),
      persistConfig: !1,
      ...s.config,
      ...(oe && Xe(t)),
    }),
    Fe.reset(e),
    oe &&
      Fe.getBoolean('persistConfig') &&
      ((e, t) => {
        try {
          e.sessionStorage.setItem('line-persist-config', JSON.stringify(t));
        } catch (e) {}
      })(t, e);
  (s.config = Fe),
    (s.mode = We = Fe.get(
      'mode',
      (() => {
        let e = 'ios';
        return (
          re &&
            oe &&
            (e =
              i.documentElement.getAttribute('mode') ||
              (qe(t, 'android') ? 'md' : 'ios')),
          e
        );
      })()
    )),
    Fe.set('mode', We),
    re &&
      (i.documentElement.setAttribute('mode', We),
      i.documentElement.classList.add(We)),
    Fe.getBoolean('testing') && Fe.set('animated', !1);
}
const Ue = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
let Ke;
const Je = (e) => {
    if (void 0 === Ke) {
      const t = void 0 !== e.style.webkitAnimationName;
      Ke = !(void 0 !== e.style.animationName) && t ? '-webkit-' : '';
    }
    return Ke;
  },
  Ze = (e, t, i) => {
    const s = t.startsWith('animation') ? Je(e) : '';
    e.style.setProperty(s + t, i);
  },
  Qe = (e, t) => {
    const i = t.startsWith('animation') ? Je(e) : '';
    e.style.removeProperty(i + t);
  },
  et = [],
  tt = (e = [], t) => {
    if (void 0 !== t) {
      const i = Array.isArray(t) ? t : [t];
      return [...e, ...i];
    }
    return e;
  },
  it = (e) => {
    let t,
      i,
      s,
      n,
      a,
      r,
      o,
      l,
      d,
      c,
      h,
      p,
      u,
      m = [],
      f = [],
      g = [],
      v = !1,
      b = {},
      y = [],
      w = [],
      x = {},
      S = 0,
      E = !1,
      T = !1,
      $ = !0,
      C = !1,
      k = !0;
    const M = e,
      I = [],
      P = [],
      A = [],
      O = [],
      B = [],
      L = [],
      z = [],
      D = [],
      N = [],
      H = [],
      R =
        'function' == typeof AnimationEffect ||
        'function' == typeof window.AnimationEffect,
      V =
        'function' == typeof Element &&
        'function' == typeof Element.prototype.animate &&
        R,
      Y = () => {
        G(), X();
      },
      q = (e, t) => ((t && t.oneTimeCallback ? P : I).push({ c: e, o: t }), u),
      F = () => ((I.length = 0), (P.length = 0), u),
      G = () => {
        if (V)
          H.forEach((e) => {
            e.cancel();
          }),
            (H.length = 0);
        else {
          const e = A.slice();
          ne(() => {
            e.forEach((e) => {
              Qe(e, 'animation-name'),
                Qe(e, 'animation-duration'),
                Qe(e, 'animation-timing-function'),
                Qe(e, 'animation-iteration-count'),
                Qe(e, 'animation-delay'),
                Qe(e, 'animation-play-state'),
                Qe(e, 'animation-fill-mode'),
                Qe(e, 'animation-direction');
            });
          });
        }
      },
      X = () => {
        B.forEach((e) => {
          e && e.parentNode && e.parentNode.removeChild(e);
        }),
          (B.length = 0);
      },
      W = () => (void 0 !== a ? a : o ? o.getFill() : 'both'),
      j = () =>
        void 0 !== d ? d : void 0 !== r ? r : o ? o.getDirection() : 'normal',
      _ = () =>
        E ? 'linear' : void 0 !== s ? s : o ? o.getEasing() : 'linear',
      U = () =>
        T ? 0 : void 0 !== c ? c : void 0 !== i ? i : o ? o.getDuration() : 0,
      K = () => (void 0 !== n ? n : o ? o.getIterations() : 1),
      J = () => (void 0 !== h ? h : void 0 !== t ? t : o ? o.getDelay() : 0),
      Z = () => {
        0 !== S &&
          (S--,
          0 === S &&
            ((() => {
              le(), D.forEach((e) => e()), N.forEach((e) => e());
              const e = $ ? 1 : 0,
                t = y,
                i = w,
                s = x;
              A.forEach((e) => {
                const n = e.classList;
                t.forEach((e) => n.add(e)), i.forEach((e) => n.remove(e));
                for (const t in s) s.hasOwnProperty(t) && Ze(e, t, s[t]);
              }),
                I.forEach((t) => t.c(e, u)),
                P.forEach((t) => t.c(e, u)),
                (P.length = 0),
                (k = !0),
                $ && (C = !0),
                ($ = !0);
            })(),
            o && o.animationFinish()));
      },
      Q = (t = !0) => {
        X();
        const i = ((e) => (
          e.forEach((e) => {
            for (const t in e)
              if (e.hasOwnProperty(t)) {
                const i = e[t];
                if ('easing' === t) {
                  (e['animation-timing-function'] = i), delete e[t];
                } else {
                  const s = Ue(t);
                  s !== t && ((e[s] = i), delete e[t]);
                }
              }
          }),
          e
        ))(m);
        A.forEach((s) => {
          if (i.length > 0) {
            const n = ((e = []) =>
              e
                .map((e) => {
                  const t = e.offset,
                    i = [];
                  for (const t in e)
                    e.hasOwnProperty(t) &&
                      'offset' !== t &&
                      i.push(`${t}: ${e[t]};`);
                  return `${100 * t}% { ${i.join(' ')} }`;
                })
                .join(' '))(i);
            p =
              void 0 !== e
                ? e
                : ((e) => {
                    let t = et.indexOf(e);
                    return t < 0 && (t = et.push(e) - 1), `line-animation-${t}`;
                  })(n);
            const a = ((e, t, i) => {
              const s = ((e) => {
                  const t = e.getRootNode();
                  return t.head || t;
                })(i),
                n = Je(i),
                a = s.querySelector('#' + e);
              if (a) return a;
              const r = (i.ownerDocument || document).createElement('style');
              return (
                (r.id = e),
                (r.textContent = `@${n}keyframes ${e} { ${t} } @${n}keyframes ${e}-alt { ${t} }`),
                s.appendChild(r),
                r
              );
            })(p, n, s);
            B.push(a),
              Ze(s, 'animation-duration', `${U()}ms`),
              Ze(s, 'animation-timing-function', _()),
              Ze(s, 'animation-delay', `${J()}ms`),
              Ze(s, 'animation-fill-mode', W()),
              Ze(s, 'animation-direction', j());
            const r = K() === 1 / 0 ? 'infinite' : K().toString();
            Ze(s, 'animation-iteration-count', r),
              Ze(s, 'animation-play-state', 'paused'),
              t && Ze(s, 'animation-name', `${a.id}-alt`),
              ne(() => {
                Ze(s, 'animation-name', a.id || null);
              });
          }
        });
      },
      ee = (e = !0) => {
        (() => {
          L.forEach((e) => e()), z.forEach((e) => e());
          const e = f,
            t = g,
            i = b;
          A.forEach((s) => {
            const n = s.classList;
            e.forEach((e) => n.add(e)), t.forEach((e) => n.remove(e));
            for (const e in i) i.hasOwnProperty(e) && Ze(s, e, i[e]);
          });
        })(),
          m.length > 0 &&
            (V
              ? (A.forEach((e) => {
                  const t = e.animate(m, {
                    id: M,
                    delay: J(),
                    duration: U(),
                    easing: _(),
                    iterations: K(),
                    fill: W(),
                    direction: j(),
                  });
                  t.pause(), H.push(t);
                }),
                H.length > 0 &&
                  (H[0].onfinish = () => {
                    Z();
                  }))
              : Q(e)),
          (v = !0);
      },
      te = (e) => {
        if (((e = Math.min(Math.max(e, 0), 0.9999)), V))
          H.forEach((t) => {
            (t.currentTime = t.effect.getComputedTiming().delay + U() * e),
              t.pause();
          });
        else {
          const t = `-${U() * e}ms`;
          A.forEach((e) => {
            m.length > 0 &&
              (Ze(e, 'animation-delay', t),
              Ze(e, 'animation-play-state', 'paused'));
          });
        }
      },
      ie = (e) => {
        H.forEach((e) => {
          e.effect.updateTiming({
            delay: J(),
            duration: U(),
            easing: _(),
            iterations: K(),
            fill: W(),
            direction: j(),
          });
        }),
          void 0 !== e && te(e);
      },
      se = (e = !0, t) => {
        ne(() => {
          A.forEach((i) => {
            Ze(i, 'animation-name', p || null),
              Ze(i, 'animation-duration', `${U()}ms`),
              Ze(i, 'animation-timing-function', _()),
              Ze(
                i,
                'animation-delay',
                void 0 !== t ? `-${t * U()}ms` : `${J()}ms`
              ),
              Ze(i, 'animation-fill-mode', W() || null),
              Ze(i, 'animation-direction', j() || null);
            const s = K() === 1 / 0 ? 'infinite' : K().toString();
            Ze(i, 'animation-iteration-count', s),
              e && Ze(i, 'animation-name', `${p}-alt`),
              ne(() => {
                Ze(i, 'animation-name', p || null);
              });
          });
        });
      },
      ae = (e = !1, t = !0, i) => (
        e &&
          O.forEach((s) => {
            s.update(e, t, i);
          }),
        V ? ie(i) : se(t, i),
        u
      ),
      re = () => {
        v &&
          (V
            ? H.forEach((e) => {
                e.pause();
              })
            : A.forEach((e) => {
                Ze(e, 'animation-play-state', 'paused');
              }));
      },
      oe = () => {
        (l = void 0), Z();
      },
      le = () => {
        l && clearTimeout(l);
      },
      de = () => {
        A.forEach((e) => {
          Qe(e, 'animation-duration'),
            Qe(e, 'animation-delay'),
            Qe(e, 'animation-play-state');
        });
      },
      ce = (e) =>
        new Promise((t) => {
          e && e.sync && ((T = !0), q(() => (T = !1), { oneTimeCallback: !0 })),
            v || ee(),
            C && (V ? (te(0), ie()) : se(), (C = !1)),
            k && ((S = O.length + 1), (k = !1)),
            q(() => t(), { oneTimeCallback: !0 }),
            O.forEach((e) => {
              e.play();
            }),
            V
              ? (H.forEach((e) => {
                  e.play();
                }),
                (0 !== m.length && 0 !== A.length) || Z())
              : (() => {
                  if (
                    (le(),
                    ne(() => {
                      A.forEach((e) => {
                        m.length > 0 &&
                          Ze(e, 'animation-play-state', 'running');
                      });
                    }),
                    0 === m.length || 0 === A.length)
                  )
                    Z();
                  else {
                    const e = J() || 0,
                      t = U() || 0,
                      i = K() || 1;
                    isFinite(i) && (l = setTimeout(oe, e + t * i + 100)),
                      ((e, t) => {
                        let i;
                        const s = { passive: !0 },
                          n = () => {
                            i && i();
                          },
                          a = (i) => {
                            e === i.target && (n(), t(i));
                          };
                        e &&
                          (e.addEventListener('webkitAnimationEnd', a, s),
                          e.addEventListener('animationend', a, s),
                          (i = () => {
                            e.removeEventListener('webkitAnimationEnd', a, s),
                              e.removeEventListener('animationend', a, s);
                          }));
                      })(A[0], () => {
                        le(),
                          ne(() => {
                            de(), ne(Z);
                          });
                      });
                  }
                })();
        }),
      he = (e, t) => {
        const i = m[0];
        return (
          void 0 === i || (void 0 !== i.offset && 0 !== i.offset)
            ? (m = [{ offset: 0, [e]: t }, ...m])
            : (i[e] = t),
          u
        );
      };
    return (u = {
      parentAnimation: o,
      elements: A,
      childAnimations: O,
      id: M,
      animationFinish: Z,
      from: he,
      to: (e, t) => {
        const i = m[m.length - 1];
        return (
          void 0 === i || (void 0 !== i.offset && 1 !== i.offset)
            ? (m = [...m, { offset: 1, [e]: t }])
            : (i[e] = t),
          u
        );
      },
      fromTo: (e, t, i) => he(e, t).to(e, i),
      parent: (e) => ((o = e), u),
      play: ce,
      pause: () => (
        O.forEach((e) => {
          e.pause();
        }),
        re(),
        u
      ),
      stop: () => {
        O.forEach((e) => {
          e.stop();
        }),
          v && (G(), (v = !1));
      },
      destroy: () => (
        O.forEach((e) => {
          e.destroy();
        }),
        Y(),
        (A.length = 0),
        (O.length = 0),
        (m.length = 0),
        F(),
        (v = !1),
        (k = !0),
        u
      ),
      keyframes: (e) => ((m = e), u),
      addAnimation: (e) => {
        if (null != e)
          if (Array.isArray(e)) for (const t of e) t.parent(u), O.push(t);
          else e.parent(u), O.push(e);
        return u;
      },
      addElement: (e) => {
        if (null != e)
          if (1 === e.nodeType) A.push(e);
          else if (e.length >= 0)
            for (let t = 0; t < e.length; t++) A.push(e[t]);
        return u;
      },
      update: ae,
      fill: (e) => ((a = e), ae(!0), u),
      direction: (e) => ((r = e), ae(!0), u),
      iterations: (e) => ((n = e), ae(!0), u),
      duration: (e) => (V || 0 !== e || (e = 1), (i = e), ae(!0), u),
      easing: (e) => ((s = e), ae(!0), u),
      delay: (e) => ((t = e), ae(!0), u),
      getWebAnimations: () => H,
      getKeyframes: () => m,
      getFill: W,
      getDirection: j,
      getDelay: J,
      getIterations: K,
      getEasing: _,
      getDuration: U,
      afterAddRead: (e) => (D.push(e), u),
      afterAddWrite: (e) => (N.push(e), u),
      afterClearStyles: (e = []) => {
        for (const t of e) x[t] = '';
        return u;
      },
      afterStyles: (e = {}) => ((x = e), u),
      afterRemoveClass: (e) => ((w = tt(w, e)), u),
      afterAddClass: (e) => ((y = tt(y, e)), u),
      beforeAddRead: (e) => (L.push(e), u),
      beforeAddWrite: (e) => (z.push(e), u),
      beforeClearStyles: (e = []) => {
        for (const t of e) b[t] = '';
        return u;
      },
      beforeStyles: (e = {}) => ((b = e), u),
      beforeRemoveClass: (e) => ((g = tt(g, e)), u),
      beforeAddClass: (e) => ((f = tt(f, e)), u),
      onFinish: q,
      progressStart: (e = !1, t) => (
        O.forEach((i) => {
          i.progressStart(e, t);
        }),
        re(),
        (E = e),
        v ? ae(!1, !0, t) : ee(),
        u
      ),
      progressStep: (e) => (
        O.forEach((t) => {
          t.progressStep(e);
        }),
        te(e),
        u
      ),
      progressEnd: (e, t, i) => (
        (E = !1),
        O.forEach((s) => {
          s.progressEnd(e, t, i);
        }),
        void 0 !== i && (c = i),
        (C = !1),
        ($ = !0),
        0 === e
          ? ((d = 'reverse' === j() ? 'normal' : 'reverse'),
            'reverse' === d && ($ = !1),
            V ? (ae(), te(1 - t)) : ((h = (1 - t) * U() * -1), ae(!1, !1)))
          : 1 === e && (V ? (ae(), te(t)) : ((h = t * U() * -1), ae(!1, !1))),
        void 0 !== e &&
          (q(
            () => {
              (c = void 0), (d = void 0), (h = void 0);
            },
            { oneTimeCallback: !0 }
          ),
          o || ce()),
        u
      ),
    });
  },
  st = (e, t, i, s, n) =>
    at(e[1], t[1], i[1], s[1], n).map((n) => nt(e[0], t[0], i[0], s[0], n)),
  nt = (e, t, i, s, n) =>
    n * (3 * t * Math.pow(n - 1, 2) + n * (-3 * i * n + 3 * i + s * n)) -
    e * Math.pow(n - 1, 3),
  at = (e, t, i, s, n) =>
    rt(
      (s -= n) - 3 * (i -= n) + 3 * (t -= n) - (e -= n),
      3 * i - 6 * t + 3 * e,
      3 * t - 3 * e,
      e
    ).filter((e) => e >= 0 && e <= 1),
  rt = (e, t, i, s) => {
    if (0 === e)
      return ((e, t, i) => {
        const s = t * t - 4 * e * i;
        return s < 0
          ? []
          : [(-t + Math.sqrt(s)) / (2 * e), (-t - Math.sqrt(s)) / (2 * e)];
      })(t, i, s);
    const n = (3 * (i /= e) - (t /= e) * t) / 3,
      a = (2 * t * t * t - 9 * t * i + 27 * (s /= e)) / 27;
    if (0 === n) return [Math.pow(-a, 1 / 3)];
    if (0 === a) return [Math.sqrt(-n), -Math.sqrt(-n)];
    const r = Math.pow(a / 2, 2) + Math.pow(n / 3, 3);
    if (0 === r) return [Math.pow(a / 2, 0.5) - t / 3];
    if (r > 0)
      return [
        Math.pow(-a / 2 + Math.sqrt(r), 1 / 3) -
          Math.pow(a / 2 + Math.sqrt(r), 1 / 3) -
          t / 3,
      ];
    const o = Math.sqrt(Math.pow(-n / 3, 3)),
      l = Math.acos(-a / (2 * Math.sqrt(Math.pow(-n / 3, 3)))),
      d = 2 * Math.pow(o, 1 / 3);
    return [
      d * Math.cos(l / 3) - t / 3,
      d * Math.cos((l + 2 * Math.PI) / 3) - t / 3,
      d * Math.cos((l + 4 * Math.PI) / 3) - t / 3,
    ];
  };
function ot(e) {
  const { disableScroll: t = !0 } = e || {};
  return O({
    mixins: [U('visible'), W('visible'), ve(), Se()],
    props: {
      overlay: { type: Boolean, default: !0 },
      dim: { type: Boolean, default: void 0 },
      translucent: { type: Boolean, default: !1 },
      modal: { type: Boolean, default: !1 },
      closeOnClickOutside: { type: Boolean, default: !0 },
      closeOnEscape: { type: Boolean, default: !0 },
      activeFocus: { type: Boolean, default: !0 },
    },
    beforeMount() {
      (this.opened = !1),
        (this.opening = !1),
        (this.closing = !1),
        (this.blocker = ke.createBlocker({ disableScroll: t })),
        (this.destroyWhenClose = !1);
      const e = async () => {
        (this.opening = !1),
          (this.closing = !1),
          Ee.pop(this),
          this.$emit('canceled'),
          this.animation && (this.animation.stop(), (this.animation = null));
      };
      this.$on('before-enter', () => {
        this.blocker.block(),
          (this.opened = !1),
          (this.opening = !0),
          this.$emit('aboutToShow'),
          Ee.push(this);
      }),
        this.$on('after-enter', () => {
          (this.opened = !0), (this.opening = !1), this.$emit('opened');
        }),
        this.$on('before-leave', () => {
          (this.opened = !1), (this.closing = !0), this.$emit('aboutToHide');
        }),
        this.$on('after-leave', async () => {
          (this.closing = !1),
            Ee.pop(this),
            this.$emit('closed'),
            this.blocker.unblock(),
            this.destroyWhenClose &&
              (await this.$nextTick(), this.$destroy(), this.$el.remove());
        }),
        this.$on('enter', async (e, t) => {
          await this.$nextTick(), (e.style.zIndex = `${Ee.getOverlayIndex()}`);
          this.$emit('animation-enter', e, (e) => {
            Fe.getBoolean('animated', !0) || e.duration(0),
              (this.animation = e);
          }),
            await this.animation.play().catch(i),
            t();
        }),
        this.$on('enter-cancelled', e),
        this.$on('leave', async (e, t) => {
          this.$emit('animation-leave', e, (t) => {
            Fe.getBoolean('animated', !0) || t.duration(0),
              this.closeOnEscape &&
                t.beforeAddWrite(() => {
                  const t = e.ownerDocument.activeElement;
                  t && t.matches('input, textarea') && t.blur();
                }),
              (this.animation = t);
          }),
            await this.animation.play().catch(i),
            t();
        }),
        this.$on('leave-cancelled', e);
      const s = () => {
        this.closeOnClickOutside && (this.visible = !1);
      };
      this.$on('overlay-tap', s),
        this.$on('clickoutside', s),
        (this.visible = this.inited =
          this.visible ||
          (c(this.$attrs.visible) && !1 !== this.$attrs.visible));
    },
    mounted() {
      this.value && this.open();
    },
    activated() {
      this.value && this.open();
    },
    deactivated() {
      this.close();
    },
    beforeDestroy() {
      this.close();
    },
    methods: {
      open(e) {
        return (
          !this.opened &&
          ((this.event = e), (this.inited = !0), (this.visible = !0), !0)
        );
      },
      close() {
        return !!this.opened && ((this.visible = !1), !0);
      },
      focus() {
        this.$emit('animation-focus', this.$el, (e) => {
          e ||
            (e = it())
              .addElement(this.$el.querySelector('.line-tooltip__content'))
              .easing('cubic-bezier(0.25, 0.8, 0.25, 1)')
              .duration(150)
              .beforeStyles({ 'transform-origin': 'center' })
              .keyframes([
                { offset: 0, transform: 'scale(1)' },
                { offset: 0.5, transform: 'scale(1.03)' },
                { offset: 1, transform: 'scale(1)' },
              ]),
            Fe.getBoolean('animated', !0) || e.duration(0),
            (this.animation = e);
        }),
          this.animation.play();
        const e = this.$el.querySelector('input, button');
        e && e.focus();
      },
    },
  });
}
const { createComponent: lt, bem: dt } = R('overlay'),
  ct = (e) => e.timeStamp || Date.now();
var ht = lt({
  props: {
    visible: { type: Boolean, default: !0 },
    tappable: { type: Boolean, default: !0 },
    stopPropagation: { type: Boolean, default: !0 },
  },
  beforeMount() {
    this.lastClick = -1e4;
  },
  methods: {
    onTouchStart(e) {
      this.emitTap(e);
    },
    onMouseDown(e) {
      this.lastClick < ct(e) - 1500 && this.emitTap(e);
    },
    emitTap(e) {
      (this.lastClick = ct(e)),
        this.stopPropagation && (e.preventDefault(), e.stopPropagation()),
        this.tappable && this.$emit('tap', e);
    },
  },
  render() {
    return (0, arguments[0])(
      'div',
      b([
        {
          attrs: { tabindex: '-1' },
          class: dt({ hide: !this.visible, 'no-tappable': !this.tappable }),
        },
        {
          on: {
            '!touchstart': this.onTouchStart,
            '!click': this.onMouseDown,
            '!mousedown': this.onMouseDown,
          },
        },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: pt, bem: ut } = R('action');
var mt = pt({
  inject: { Item: { default: void 0 } },
  props: { option: Object },
  methods: {
    async buttonClick(e) {
      const { role: t } = e;
      return 'cancel' === t
        ? this.Item && this.Item.close(t)
        : (await this.callButtonHandler(e))
        ? this.Item && this.Item.close(e.role)
        : Promise.resolve();
    },
    async callButtonHandler(e) {
      if (e)
        try {
          if (!1 === (await h(e.handler))) return !1;
        } catch (e) {}
      return !0;
    },
  },
  render() {
    const e = arguments[0],
      { option: t = { role: '' } } = this;
    return e(
      'button',
      {
        attrs: { type: 'button' },
        class: [ut({ [`${t.role}`]: !!t.role }), 'line-activatable'],
        on: { click: () => this.buttonClick(t) },
      },
      [e('span', { class: ut('inner') }, [this.slots() || t.text])]
    );
  },
});
const ft = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s
        .addElement(e.querySelector('.line-action-sheet__wrapper'))
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)'),
      t
        .addElement(e)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([i, s])
    );
  },
  gt = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(e.querySelector('.line-action-sheet__wrapper'))
        .fromTo('transform', 'translateY(0%)', 'translateY(100%)'),
      t
        .addElement(e)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .addAnimation([i, s])
    );
  },
  vt = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s
        .addElement(e.querySelector('.line-action-sheet__wrapper'))
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)'),
      t
        .addElement(e)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([i, s])
    );
  },
  bt = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(e.querySelector('.line-action-sheet__wrapper'))
        .fromTo('transform', 'translateY(0%)', 'translateY(100%)'),
      t
        .addElement(e)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .addAnimation([i, s])
    );
  },
  { createComponent: yt, bem: wt } = R('action-sheet');
var xt = yt({
  mixins: [ot()],
  provide() {
    return { Item: this };
  },
  props: { header: String, subHeader: String, actions: Array },
  computed: {
    normalizedActions() {
      const { actions: e } = this;
      return e.map((e) => ('string' == typeof e ? { text: e } : e));
    },
    optionActions() {
      return this.normalizedActions.filter((e) => 'cancel' !== e.role);
    },
    cancelAction() {
      return this.normalizedActions.find((e) => 'cancel' === e.role);
    },
  },
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? vt : ft)(t));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? bt : gt)(t));
      });
  },
  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },
  render() {
    const e = arguments[0],
      { optionActions: t, cancelAction: i, translucent: s } = this;
    return e(
      'div',
      {
        directives: [{ name: 'show', value: this.visible }],
        attrs: { role: 'dialog', 'aria-modal': 'true' },
        class: wt({ translucent: s }),
      },
      [
        e(ht, { attrs: { visible: this.dim }, on: { tap: this.onTap } }),
        e('div', { attrs: { role: 'dialog' }, class: wt('wrapper') }, [
          this.slots()
            ? e('div', { class: wt('container') }, [this.slots()])
            : e('div', { class: wt('container') }, [
                e(q, [
                  this.header &&
                    e(X, {
                      attrs: { header: this.header, subHeader: this.subHeader },
                    }),
                  t.map((t) => e(mt, { attrs: { option: t } })),
                ]),
                i &&
                  e(q, { attrs: { cancel: !0 } }, [
                    e(mt, { attrs: { option: i } }),
                  ]),
              ]),
        ]),
      ]
    );
  },
});
const St = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s.addElement(e.querySelector('.line-alert__wrapper')).keyframes([
        { offset: 0, opacity: '0.01', transform: 'scale(1.1)' },
        { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  Et = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s.addElement(e.querySelector('.line-alert__wrapper')).keyframes([
        { offset: 0, opacity: 0.99, transform: 'scale(1)' },
        { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  Tt = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s.addElement(e.querySelector('.line-alert__wrapper')).keyframes([
        { offset: 0, opacity: '0.01', transform: 'scale(0.9)' },
        { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(150).addAnimation([i, s])
    );
  },
  $t = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(e.querySelector('.line-alert__wrapper'))
        .fromTo('opacity', 0.99, 0),
      t.addElement(e).easing('ease-in-out').duration(150).addAnimation([i, s])
    );
  },
  { createComponent: Ct, bem: kt } = R('alert');
var Mt = Ct({
  mixins: [ot()],
  props: {
    header: String,
    subHeader: String,
    message: String,
    inputs: Array,
    buttons: Array,
  },
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? Tt : St)(t));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? $t : Et)(t));
      });
  },
  computed: {
    normalizedButtons() {
      const { buttons: e = [] } = this;
      return e.map((e) =>
        'string' == typeof e
          ? { text: e, role: 'cancel' === e.toLowerCase() ? 'cancel' : void 0 }
          : e
      );
    },
    normalizedInputs() {
      const { inputs: e = [] } = this,
        t = new Set(e.map((e) => e.type));
      return (
        t.has('checkbox') && t.has('radio'),
        e.map((e, t) => ({
          type: e.type || 'text',
          name: e.name || `${t}`,
          placeholder: e.placeholder || '',
          value: e.value,
          label: e.label,
          checked: !!e.checked,
          disabled: !!e.disabled,
          handler: e.handler,
          min: e.min,
          max: e.max,
        }))
      );
    },
    cachedButtons() {
      const e = this.$createElement;
      return e(
        'div',
        {
          class: kt('button-group', {
            vertical: this.normalizedButtons.length > 2,
          }),
        },
        [
          this.normalizedButtons.map((t) =>
            e(
              'button',
              {
                attrs: { type: 'button', tabIndex: 0 },
                class: [kt('button'), 'line-focusable', 'line-activatable'],
                on: { click: () => this.buttonClick(t) },
              },
              [e('span', { class: kt('button-inner') }, [t.text])]
            )
          ),
        ]
      );
    },
  },
  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
    async buttonClick(e) {
      const { role: t } = e;
      return 'cancel' === t
        ? this.close(t)
        : (await this.callButtonHandler(e))
        ? this.close(e.role)
        : Promise.resolve();
    },
    async callButtonHandler(e) {
      if (e)
        try {
          if (!1 === (await h(e.handler))) return !1;
        } catch (e) {}
      return !0;
    },
  },
  render() {
    const e = arguments[0],
      { header: t, subHeader: i } = this;
    return e(
      'div',
      {
        directives: [{ name: 'show', value: this.visible }],
        attrs: { role: 'dialog', 'aria-modal': 'true' },
        class: kt({ translucent: this.translucent }),
      },
      [
        e(ht, { attrs: { visible: this.dim }, on: { tap: this.onTap } }),
        e('div', { class: kt('wrapper') }, [
          e('div', { class: kt('head') }, [
            this.slots('header') || (t && e('h2', { class: kt('title') }, [t])),
            this.slots('subHeader') ||
              (i && e('h2', { class: kt('sub-title') }, [i])),
          ]),
          e('div', { class: kt('message') }, [this.slots() || this.message]),
          this.cachedButtons,
        ]),
      ]
    );
  },
});
function It() {
  return O({
    data: () => ({
      clientWidth: Z(),
      clientHeight: Q(),
      thresholds: { xs: 600, sm: 960, md: 1280, lg: 1920 },
      scrollbarWidth: 16,
    }),
    computed: {
      breakpoint() {
        const e = this.clientWidth < this.thresholds.xs,
          t = this.clientWidth < this.thresholds.sm && !e,
          i =
            this.clientWidth < this.thresholds.md - this.scrollbarWidth &&
            !(t || e),
          s =
            this.clientWidth < this.thresholds.lg - this.scrollbarWidth &&
            !(i || t || e),
          n = this.clientWidth >= this.thresholds.lg - this.scrollbarWidth,
          a = e,
          r = t,
          o = (e || t) && !(i || s || n),
          l = !e && (t || i || s || n),
          d = i,
          c = (e || t || i) && !(s || n),
          h = !(e || t) && (i || s || n),
          p = s,
          u = (e || t || i || s) && !n,
          m = !(e || t || i) && (s || n),
          f = n;
        let g;
        switch (!0) {
          case e:
            g = 'xs';
            break;
          case t:
            g = 'sm';
            break;
          case i:
            g = 'md';
            break;
          case s:
            g = 'lg';
            break;
          default:
            g = 'xl';
        }
        return {
          xs: e,
          sm: t,
          md: i,
          lg: s,
          xl: n,
          name: g,
          xsOnly: a,
          smOnly: r,
          smAndDown: o,
          smAndUp: l,
          mdOnly: d,
          mdAndDown: c,
          mdAndUp: h,
          lgOnly: p,
          lgAndDown: u,
          lgAndUp: m,
          xlOnly: f,
          width: this.clientWidth,
          height: this.clientHeight,
          thresholds: this.thresholds,
          scrollbarWidth: this.scrollbarWidth,
        };
      },
    },
    methods: {
      onResize: t(function () {
        this.setDimensions();
      }, 200),
      setDimensions() {
        (this.clientHeight = Q()), (this.clientWidth = Z());
      },
    },
    beforeMount() {
      oe && ie(window, 'resize', this.onResize, { passive: !0 });
    },
    beforeDestroy() {
      oe && te(window, 'resize', this.onResize);
    },
  });
}
const Pt = 'line-activated',
  At = (e) => {
    let t,
      i,
      s,
      n,
      a = -25e3,
      r = 0;
    const o = new WeakMap(),
      l = (e) => {
        (a = he(e)), h(e);
      },
      d = () => {
        clearTimeout(n), (n = void 0), i && (f(!1), (i = void 0));
      },
      c = (e) => {
        i ||
          (void 0 !== t && null !== t.parentElement) ||
          ((t = void 0), p(Ot(e), e));
      },
      h = (e) => {
        p(void 0, e);
      },
      p = (e, t) => {
        if (e && e === i) return;
        clearTimeout(n), (n = void 0);
        const { x: s, y: a } = se(t);
        if (i) {
          if (o.has(i)) throw new Error('internal error');
          i.classList.contains(Pt) || u(i, s, a), f(!0);
        }
        if (e) {
          const t = o.get(e);
          t && (clearTimeout(t), o.delete(e));
          const i = Bt(e) ? 0 : 200;
          e.classList.remove(Pt),
            (n = setTimeout(() => {
              u(e, s, a), (n = void 0);
            }, i));
        }
        i = e;
      },
      u = (e, t, i) => {
        (r = Date.now()),
          setTimeout(() => {
            e.classList.add(Pt);
            const n = Lt(e);
            n && n.addRipple && (m(), (s = n.addRipple(t, i)));
          });
      },
      m = () => {
        void 0 !== s && (s.then((e) => e()), (s = void 0));
      },
      f = (e) => {
        m();
        const t = i;
        if (!t) return;
        const s = 200 - Date.now() + r;
        if (e && s > 0 && !Bt(t)) {
          const e = setTimeout(() => {
            t.classList.remove(Pt), o.delete(t);
          }, 200);
          o.set(t, e);
        } else t.classList.remove(Pt);
      },
      g = document;
    g.addEventListener('scrollstart', (e) => {
      (t = e.target), d();
    }),
      g.addEventListener('scrollend', () => {
        t = void 0;
      }),
      g.addEventListener('gesturecaptured', d),
      g.addEventListener(
        'touchstart',
        (e) => {
          (a = he(e)), c(e);
        },
        !0
      ),
      g.addEventListener('touchcancel', l, !0),
      g.addEventListener('touchend', l, !0),
      g.addEventListener(
        'mousedown',
        (e) => {
          const t = he(e) - 2500;
          a < t && c(e);
        },
        !0
      ),
      g.addEventListener(
        'mouseup',
        (e) => {
          const t = he(e) - 2500;
          a < t && h(e);
        },
        !0
      );
  },
  Ot = (e) => {
    if (!e.composedPath) return e.target.closest('line-activatable');
    {
      const t = e.composedPath();
      for (let e = 0; e < t.length - 2; e++) {
        const i = t[e];
        if (i.classList && i.classList.contains('line-activatable')) return i;
      }
    }
  },
  Bt = (e) => e.classList.contains('line-activatable-instant'),
  Lt = (e) => {
    const t = e.querySelector('.line-ripple-effect');
    if (t) return t.vRipple;
  },
  zt = [
    'Tab',
    'ArrowDown',
    'Space',
    'Escape',
    ' ',
    'Shift',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
  ],
  { createComponent: Dt, bem: Nt } = R('app');
let Ht;
var Rt = Dt({
  mixins: [It()],
  props: { id: String },
  provide() {
    return { App: this };
  },
  beforeCreate() {
    _e();
  },
  beforeMount() {
    Ht ||
      (Ye(),
      At(),
      (() => {
        let e = [],
          t = !0;
        const i = document,
          s = (t) => {
            e.forEach((e) => e.classList.remove('line-focused')),
              t.forEach((e) => e.classList.add('line-focused')),
              (e = t);
          },
          n = () => {
            (t = !1), s([]);
          };
        i.addEventListener('keydown', (e) => {
          (t = zt.includes(e.key)), t || s([]);
        }),
          i.addEventListener('focusin', (e) => {
            if (t && e.composedPath) {
              const t = e
                .composedPath()
                .filter(
                  (e) => !!e.classList && e.classList.contains('line-focusable')
                );
              s(t);
            }
          }),
          i.addEventListener('focusout', () => {
            i.activeElement === i.body && s([]);
          }),
          i.addEventListener('touchstart', n),
          i.addEventListener('mousedown', n);
      })(),
      (function (e = document) {
        e.addEventListener('focusin', (e) => {
          const t = Ee.getActiveFocusPopup();
          t && (t.closeOnClickOutside || t.$el.contains(e.target) || t.focus());
        }),
          e.addEventListener('lineBackButton', (e) => {
            const t = Ee.getPopup();
            t &&
              t.closeOnClickOutside &&
              e.detail.register(100, () => t.close());
          }),
          e.addEventListener('keyup', (e) => {
            if ('Escape' === e.key) {
              const e = Ee.getPopup();
              if (!e) return;
              if (!e.closeOnEscape) return;
              e.close();
            }
          });
      })(),
      (Ht = !0));
  },
  render() {
    const e = arguments[0],
      { id: t = 'app' } = this;
    return e(
      'div',
      b([
        { attrs: { id: t, 'line-app': !0 }, class: [Nt(), 'line-page'] },
        { on: this.$listeners },
      ]),
      [this.slots('header'), this.slots(), this.slots('footer')]
    );
  },
});
const { createComponent: Vt, bem: Yt } = R('avatar');
var qt = Vt({
  functional: !0,
  render: (e, t) => e('div', b([{ class: Yt() }, t.data]), [t.slots()]),
});
function Ft(e) {
  if (e) return { 'line-color': !0, [`line-color-${e}`]: !0 };
}
function Gt() {
  return O({
    props: { color: String },
    afterRender(e) {
      var t, i;
      e &&
        e.data &&
        this.color &&
        (e.data.staticClass =
          ((t = e.data.staticClass),
          (i = Ft(this.color)),
          c(t) || c(i) ? E(t, T(i)) : ''));
    },
  });
}
const { createComponent: Xt, bem: Wt } = R('badge');
var jt = Xt({
  mixins: [Gt()],
  render() {
    return (0, arguments[0])(
      'div',
      b([{ class: Wt() }, { on: this.$listeners }]),
      [this.slots()]
    );
  },
});
const { createComponent: _t, bem: Ut } = R('busy-indicator');
var Kt = _t({
  functional: !0,
  props: { running: Boolean },
  render(e, { props: t, data: i, slots: s }) {
    const { running: n } = t;
    return e('div', b([{ class: Ut({ running: n }) }, i]), [s()]);
  },
});
function Jt(e) {
  return O({
    provide() {
      return { [e]: this };
    },
    data: () => ({ items: [] }),
    methods: {
      registerItem(e) {
        return (
          this.$nextTick().then(() => this.$emit('item:register', e)),
          this.items.push(e)
        );
      },
      unregisterItem(e) {
        this.$nextTick().then(() => this.$emit('item:unregister', e)),
          this.items.splice(this.items.indexOf(e), 1);
      },
    },
  });
}
const { createComponent: Zt, bem: Qt } = R('button-group');
var ei = Zt({
  mixins: [Jt('ButtonGroup')],
  render() {
    return (0, arguments[0])('div', { class: Qt() }, [this.slots()]);
  },
});
function ti(e) {
  return O({
    inject: { [e]: { default: void 0 } },
    beforeMount() {
      (this.itemIndex = 0), (this.itemInGroup = !1);
      const t = this[e];
      t && ((this.itemIndex = t.registerItem(this)), (this.itemInGroup = !0));
    },
    beforeDestroy() {
      const t = this[e];
      t && t.unregisterItem(this),
        (this.itemIndex = 0),
        (this.itemInGroup = !1);
    },
  });
}
function ii(e, t) {
  const { unbounded: i = !1 } = t;
  return (
    e.classList.add('line-ripple-effect'),
    {
      addRipple: (t, s) =>
        new Promise((n) => {
          const a = e.getBoundingClientRect(),
            { width: r } = a,
            { height: o } = a,
            l = Math.sqrt(r * r + o * o),
            d = Math.max(o, r),
            c = i ? d : l + 10,
            h = Math.floor(0.5 * d),
            p = c / h;
          let u = t - a.left,
            m = s - a.top;
          i && ((u = 0.5 * r), (m = 0.5 * o));
          const f = u - 0.5 * h,
            g = m - 0.5 * h,
            v = 0.5 * r - u,
            b = 0.5 * o - m,
            y = document.createElement('div');
          y.classList.add('ripple');
          const { style: w } = y;
          (w.top = `${g}px`),
            (w.left = `${f}px`),
            (w.width = w.height = `${h}px`),
            w.setProperty('--final-scale', `${p}`),
            w.setProperty('--translate-end', `${v}px, ${b}px`);
          const x = document.createElement('div');
          x.classList.add('ripple-effect'),
            i && x.classList.add('unbounded'),
            x.appendChild(y),
            e.appendChild(x),
            setTimeout(() => {
              n(() => {
                ((e, t) => {
                  e.classList.add('fade-out'),
                    setTimeout(() => {
                      t && t.remove(), e.remove();
                    }, 200);
                })(y, x);
              });
            }, 325);
        }),
      options: t,
    }
  );
}
function si(e, t) {
  const { value: i, modifiers: s } = t;
  !1 !== i && (e.vRipple = ii(e, s));
}
function ni(e) {
  const { vRipple: t } = e;
  t && delete e.vRipple;
}
const ai = J({
    name: 'ripple',
    inserted: si,
    update: function (e, t) {
      const { value: i, oldValue: s } = t;
      i !== s && (!1 !== s && ni(e), si(e, t));
    },
    unbind: ni,
  }),
  { createComponent: ri, bem: oi } = R('button');
var li = ri({
  mixins: [Gt(), ti('ButtonGroup')],
  directives: { ripple: ai },
  props: {
    text: String,
    strong: Boolean,
    disabled: Boolean,
    ripple: Boolean,
    vertical: Boolean,
    expand: String,
    fill: String,
    shape: String,
    size: String,
    type: String,
    download: String,
    href: String,
    rel: String,
    target: String,
    checkable: Boolean,
  },
  data: () => ({ inToolbar: !1, inListHeader: !1, inItem: !1 }),
  mounted() {
    (this.inToolbar = !!this.$el.closest('.line-toolbar')),
      (this.inListHeader = !!this.$el.closest('.line-list-header')),
      (this.inItem =
        !!this.$el.closest('.line-item') ||
        !!this.$el.closest('.line-item-divider'));
  },
  render() {
    const e = arguments[0],
      {
        text: t,
        strong: i,
        disabled: s,
        ripple: n,
        vertical: a,
        expand: r,
        fill: o,
        shape: l,
        size: d,
        type: h = 'button',
        download: p,
        href: u,
        rel: m,
        target: f,
        inItem: g,
        inToolbar: v,
        inListHeader: y,
      } = this,
      w = !c(d) && g ? 'small' : d,
      x = c(o) || (!v && !y) ? o || 'solid' : 'clear',
      S = c(u) ? 'a' : 'button',
      E =
        'button' === S
          ? { type: h }
          : { download: p, href: u, rel: m, target: f };
    return e(
      'div',
      b([
        {
          attrs: { disabled: s, 'aria-disabled': s ? 'true' : null },
          class: [
            'line-activatable',
            'line-focusable',
            oi({
              [r]: c(r),
              [w]: c(w),
              [l]: c(l),
              [x]: !0,
              strong: i,
              vertical: a,
              disabled: s,
            }),
          ],
        },
        { on: this.$listeners },
      ]),
      [
        e(
          S,
          {
            attrs: { ...E, disabled: s },
            directives: [{ name: 'ripple', value: n }],
            class: oi('content'),
          },
          [
            this.slots('icon-only'),
            this.slots('start'),
            this.slots('indicator'),
            this.slots() || t,
            this.slots('end'),
          ]
        ),
      ]
    );
  },
});
const { createComponent: di, bem: ci } = R('card-content');
var hi = di({
  functional: !0,
  props: { color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n } = t;
    return e('div', b([{ class: [ci(), Ft(n)] }, i]), [s()]);
  },
});
const { createComponent: pi, bem: ui } = R('card-header');
var mi = pi({
  functional: !0,
  props: { color: String, translucent: Boolean },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n, translucent: a } = t;
    return e(
      'div',
      b([{ class: [ui({ translucent: a }), Ft(n), 'line-inherit-color'] }, i]),
      [s()]
    );
  },
});
const { createComponent: fi, bem: gi } = R('card-subtitle');
var vi = fi({
  functional: !0,
  props: { color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n } = t;
    return e(
      'div',
      b([
        {
          attrs: { role: 'heading', 'aria-level': '3' },
          class: [gi(), Ft(n), 'line-inherit-color'],
        },
        i,
      ]),
      [s()]
    );
  },
});
const { createComponent: bi, bem: yi } = R('card-title');
var wi = bi({
  functional: !0,
  props: { color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n } = t;
    return e(
      'div',
      b([
        {
          attrs: { role: 'heading', 'aria-level': '2' },
          class: [yi(), Ft(n), 'line-inherit-color'],
        },
        i,
      ]),
      [s()]
    );
  },
});
const { createComponent: xi, bem: Si } = R('card');
var Ei = xi({
  mixins: [Gt()],
  directives: { ripple: ai },
  props: {
    button: Boolean,
    type: String,
    disabled: Boolean,
    download: String,
    href: String,
    rel: String,
    ripple: Boolean,
    target: String,
  },
  computed: {
    clickable() {
      return void 0 !== this.href || this.button;
    },
  },
  render() {
    const e = arguments[0],
      {
        mode: t,
        disabled: i,
        clickable: s,
        type: n,
        href: a,
        download: r,
        rel: o,
        target: l,
      } = this,
      d = s ? (c(a) ? 'a' : 'button') : 'div',
      h =
        'button' === d
          ? { type: n }
          : { download: r, href: a, rel: o, target: l };
    return e(
      'div',
      b([
        { class: [Si(), { 'card-disabled': i, 'line-activatable': s }] },
        { on: this.$listeners },
      ]),
      [
        s
          ? e(
              d,
              {
                attrs: { ...h, disabled: i },
                directives: [
                  { name: 'ripple', value: s && (ai || 'md' === t) },
                ],
                class: 'card-native',
              },
              [this.slots()]
            )
          : this.slots(),
      ]
    );
  },
});
function Ti(e) {
  return O({
    mixins: [Jt(e)],
    props: { exclusive: Boolean },
    data: () => ({ checkedItem: [] }),
    watch: {
      exclusive(e) {
        if (e && this.checkedItem.length > 1) {
          const [e] = this.checkedItem;
          this.checkedItem = [e];
        }
      },
    },
    beforeMount() {
      const e = (e, t) => {
        if ((this.$emit('item:checked', e, !!t), this.exclusive))
          t
            ? ((this.checkedItem = e),
              this.items.forEach((t) => {
                t !== e && (t.checked = !1);
              }))
            : this.checkedItem === e && (this.checkedItem = null);
        else {
          this.checkedItem = this.checkedItem || [];
          const i = this.checkedItem.indexOf(e);
          t && -1 === i
            ? this.checkedItem.push(e)
            : t || -1 === i || this.checkedItem.splice(i, 1);
        }
      };
      this.$on('item:register', (t) => {
        t.$watch(
          'checked',
          async (i, s) => {
            !!s !== i && (this.exclusive || (await this.$nextTick()), e(t, i));
          },
          { immediate: !0 }
        );
      });
    },
  });
}
function $i(e) {
  const { modelValue: t, itemIndex: i } = e;
  return c(t) ? t : i;
}
function Ci(e, t) {
  return O({
    mixins: [Ti(e), U('checkedItemValue', t, !0)],
    computed: {
      checkedItemValue: {
        get() {
          const { checkedItem: e } = this;
          return r(e) ? e.map((e) => $i(e)) : e && $i(e);
        },
        async set(e) {
          e &&
            (await this.$nextTick(),
            this.items.forEach((t) => {
              t.checked = Array.isArray(e) ? e.includes($i(t)) : $i(t) === e;
            }));
        },
      },
    },
  });
}
const { createComponent: ki, bem: Mi } = R('check-box-group');
var Ii = ki({
  mixins: [Ci('CheckBoxGroup')],
  render() {
    return (0, arguments[0])('div', { class: Mi() }, [this.slots()]);
  },
});
function Pi(e) {
  return O({
    mixins: [ti(e)],
    props: { checkable: { type: Boolean, default: !0 }, disabled: Boolean },
    data: () => ({ checked: !1 }),
    methods: {
      toggle() {
        this.disabled ||
          (this.$emit('clicked'),
          this.checkable &&
            ((this.checked = !this.checked),
            this.$emit('toggled', this.checked)));
      },
    },
    beforeMount() {
      this.checked =
        this.checked || (c(this.$attrs.checked) && !1 !== this.$attrs.checked);
    },
  });
}
function Ai(e, t) {
  return O({ mixins: [Pi(e), U('checked', t)], props: { modelValue: null } });
}
function Oi() {
  return O({
    directives: { ripple: ai },
    props: { ripple: { type: Boolean, default: !1 } },
    afterRender(e) {
      (e.data = e.data || {}),
        (e.data.directives || (e.data.directives = [])).push({
          name: 'ripple',
          value: this.ripple,
        });
    },
  });
}
const { createComponent: Bi, bem: Li } = R('check-indicator');
var zi = Bi({
  functional: !0,
  props: { checked: Boolean, indeterminate: Boolean, disabled: Boolean },
  render(e, { props: t, data: i }) {
    const s = je(),
      { checked: n, indeterminate: a, disabled: r } = t;
    let o = e(
      'path',
      a
        ? { attrs: { d: 'M6 12L18 12' } }
        : { attrs: { d: 'M5.9,12.5l3.8,3.8l8.8-8.8' } }
    );
    return (
      'md' === s &&
        (o = e(
          'path',
          a
            ? { attrs: { d: 'M2 12H22' } }
            : { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } }
        )),
      e(
        'svg',
        b([{ class: Li({ checked: n, indeterminate: a, disabled: r }) }, i]),
        [o]
      )
    );
  },
});
const { createComponent: Di, bem: Ni } = R('check-box');
var Hi = Di({
  mixins: [Ai('CheckBoxGroup'), Oi(), Gt()],
  inject: { Item: { default: void 0 } },
  props: { text: String, color: String, indeterminate: Boolean },
  data: () => ({ inItem: !1 }),
  mounted() {
    (this.inItem = null !== this.$el.closest('.line-item')), this.emitStyle();
  },
  methods: {
    emitStyle() {
      const { Item: e } = this;
      e &&
        e.itemStyle('check-box', {
          'checkbox-checked': this.checked,
          'interactive-disabled': this.disabled,
        });
    },
  },
  watch: {
    checked() {
      this.emitStyle();
    },
    disabled() {
      this.emitStyle();
    },
  },
  render() {
    const e = arguments[0],
      { checked: t, indeterminate: i, disabled: s, text: n, inItem: a } = this;
    return e(
      'div',
      {
        class: [
          Ni({ disabled: s, indeterminate: i, checked: t }),
          { 'in-item': a },
        ],
        attrs: { role: 'checkbox' },
        on: { click: this.toggle },
      },
      [
        this.slots('indicator', {
          checked: t,
          indeterminate: i,
          disabled: s,
        }) ||
          e(zi, {
            attrs: {
              checked: t,
              indeterminate: i,
              disabled: s,
              width: 26,
              height: 26,
            },
          }),
        this.slots() || n,
        e('button', { attrs: { type: 'button', disabled: s } }),
      ]
    );
  },
});
const { createComponent: Ri, bem: Vi } = R('chip');
var Yi = Ri({
  mixins: [Gt()],
  directives: { ripple: ai },
  props: { ripple: Boolean, outline: Boolean },
  methods: {
    onClick() {
      this.$emit('close');
    },
  },
  render() {
    const e = arguments[0],
      { ripple: t, outline: i } = this;
    return e(
      'div',
      b([
        {
          directives: [{ name: 'ripple', value: t }],
          class: [Vi({ outline: i }), 'line-activatable'],
        },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const qi = {
    xs: '(min-width: 0px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
  },
  Fi = (e) => {
    if (void 0 === e || '' === e) return !0;
    if (window.matchMedia) {
      return window.matchMedia(qi[e]).matches;
    }
    return !1;
  },
  Gi = ['', 'xs', 'sm', 'md', 'lg', 'xl'],
  { createComponent: Xi, bem: Wi } = R('col');
var ji = Xi({
  props: {
    offset: String,
    offsetXs: String,
    offsetSm: String,
    offsetMd: String,
    offsetLg: String,
    offsetXl: String,
    pull: String,
    pullXs: String,
    pullSm: String,
    pullMd: String,
    pullLg: String,
    pullXl: String,
    push: String,
    pushXs: String,
    pushSm: String,
    pushMd: String,
    pushLg: String,
    pushXl: String,
    size: String,
    sizeXs: String,
    sizeSm: String,
    sizeMd: String,
    sizeLg: String,
    sizeXl: String,
  },
  mounted() {
    window.addEventListener('resize', this.onResize, { passive: !0 });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      this.$forceUpdate();
    },
    getColumns(e) {
      let t;
      for (const i of Gi) {
        const s = Fi(i),
          n = this[e + i.charAt(0).toUpperCase() + i.slice(1)];
        s && void 0 !== n && (t = n);
      }
      return t;
    },
    calculateSize() {
      const e = this.getColumns('size');
      if (!e || '' === e) return;
      const t =
        'auto' === e
          ? 'auto'
          : ce()
          ? `calc(calc(${e} / var(--line-grid-columns, 12)) * 100%)`
          : `${(e / 12) * 100}%`;
      return { flex: `0 0 ${t}`, width: `${t}`, 'max-width': `${t}` };
    },
    calculatePosition(e, t) {
      const i = this.getColumns(e);
      if (i)
        return {
          [t]: ce()
            ? `calc(calc(${i} / var(--line-grid-columns, 12)) * 100%)`
            : i > 0 && i < 12
            ? `${(i / 12) * 100}%`
            : 'auto',
        };
    },
    calculateOffset(e) {
      return this.calculatePosition(
        'offset',
        e ? 'margin-right' : 'margin-left'
      );
    },
    calculatePull(e) {
      return this.calculatePosition('pull', e ? 'left' : 'right');
    },
    calculatePush(e) {
      return this.calculatePosition('push', e ? 'right' : 'left');
    },
  },
  render() {
    const e = 'rtl' === document.dir;
    return (0, arguments[0])(
      'div',
      b([
        {
          class: Wi(),
          style: {
            ...this.calculateOffset(e),
            ...this.calculatePull(e),
            ...this.calculatePush(e),
            ...this.calculateSize(),
          },
        },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
function _i() {
  return O({
    mixins: [Se()],
    beforeMount() {
      const e = () => {
        this.animation && (this.animation.stop(), (this.animation = null)),
          this.$emit('canceled');
      };
      this.$on('before-enter', async (e) => {
        (this.overflow = e.style.overflow),
          (this.paddingTop = e.style.paddingTop),
          (this.paddingBottom = e.style.paddingBottom),
          (e.style.height = '0px'),
          (e.style.paddingTop = '0px'),
          (e.style.paddingBottom = '0px'),
          (e.style.overflow = 'hidden'),
          this.$emit('aboutToShow', e);
      }),
        this.$on('after-enter', (e) => {
          (e.style.height = ''),
            (e.style.paddingTop = ''),
            (e.style.paddingBottom = ''),
            (e.style.animationTimingFunction = ''),
            (e.style.animationFillMode = ''),
            (e.style.animationDirection = ''),
            (e.style.animationIterationCount = ''),
            (e.style.animationName = ''),
            (e.style.overflow = this.overflow),
            this.$emit('opened');
        }),
        this.$on('before-leave', (e) => {
          (this.overflow = e.style.overflow),
            (this.paddingTop = e.style.paddingTop),
            (this.paddingBottom = e.style.paddingBottom),
            (e.style.height = `${e.scrollHeight}px`),
            (e.style.overflow = 'hidden'),
            this.$emit('aboutToHide', e);
        }),
        this.$on('after-leave', (e) => {
          (e.style.height = ''),
            (e.style.paddingTop = ''),
            (e.style.paddingBottom = ''),
            (e.style.animationTimingFunction = ''),
            (e.style.animationFillMode = ''),
            (e.style.animationDirection = ''),
            (e.style.animationIterationCount = ''),
            (e.style.animationName = ''),
            (e.style.overflow = this.overflow),
            (e.style.paddingTop = this.paddingTop),
            (e.style.paddingBottom = this.paddingBottom),
            this.$emit('closed');
        }),
        this.$on('enter', async (e, t) => {
          await this.$nextTick(),
            (this.animation = ((e, t, i) => {
              const s = e.scrollHeight || '',
                n = it();
              return (
                n
                  .addElement(e)
                  .easing('ease-in-out')
                  .duration(300)
                  .fromTo('padding-top', '0px', `${t}px`)
                  .fromTo('padding-bottom', '0px', `${i}px`)
                  .fromTo('height', '0px', `${s}px`),
                n
              );
            })(e, this.paddingTop, this.paddingBottom)),
            Fe.getBoolean('animated', !0) || this.animation.duration(0),
            this.$emit('animation-enter', e, this.animation),
            await this.animation.play().catch(i),
            t();
        }),
        this.$on('enter-cancelled', e),
        this.$on('leave', async (e, t) => {
          await this.$nextTick(),
            (this.animation = ((e, t, i) => {
              const s = e.scrollHeight || '',
                n = it();
              return (
                n
                  .addElement(e)
                  .easing('ease-in-out')
                  .duration(300)
                  .fromTo('padding-top', `${t}px`, '0px')
                  .fromTo('padding-bottom', `${i}px`, '0px')
                  .fromTo('height', `${s}px`, '0px'),
                n
              );
            })(e, this.paddingTop, this.paddingBottom)),
            Fe.getBoolean('animated', !0) || this.animation.duration(0),
            this.$emit('animation-leave', e, this.animation),
            await this.animation.play().catch(i),
            t();
        }),
        this.$on('leave-cancelled', e);
    },
  });
}
const { createComponent: Ui } = R('collapse-item-content');
var Ki = Ui({
  mixins: [_i()],
  props: { checked: Boolean },
  render() {
    const e = arguments[0],
      { checked: t } = this;
    return e(
      'div',
      {
        class: 'line-collapse-item__wrapper',
        directives: [{ name: 'show', value: t }],
      },
      [e('div', { class: 'line-collapse-item__content' }, [this.slots()])]
    );
  },
});
const { createComponent: Ji, bem: Zi } = R('font-icon');
var Qi = Ji({
  functional: !0,
  props: { name: String, source: String, size: String, color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { attrs: n = {} } = i,
      { name: a, size: r, color: o } = t,
      l =
        a ||
        (function (e) {
          const t = e();
          return ((t && t[0].text) || '').trim();
        })(s);
    return e(
      'i',
      b([
        {
          class: ['line-icon', Zi({ [`${r}`]: !!r }), Ft(o)],
          attrs: {
            'aria-hidden': !n['aria-label'],
            'aria-label': n['aria-label'] || l,
          },
        },
        i,
      ]),
      [l]
    );
  },
});
const { createComponent: es, bem: ts } = R('svg-icon');
var is = es({
  functional: !0,
  props: {
    name: String,
    href: String,
    src: String,
    size: String,
    color: String,
    fill: { type: Boolean, default: !0 },
    stroke: Boolean,
  },
  render(e, { props: t, data: i, slots: s }) {
    const { attrs: n = {} } = i,
      { name: a, href: r, src: o, size: l, color: d, fill: c, stroke: h } = t,
      p =
        a ||
        ((e) => {
          const t = e();
          return ((t && t[0].text) || '').trim();
        })(s),
      u = r || `${o || ''}#${p}`;
    return e(
      'div',
      b([
        {
          class: [
            ts({ [`${l}`]: !!l, 'fill-none': !c, 'stroke-width': h }),
            Ft(d),
          ],
        },
        i,
      ]),
      [
        e(
          'svg',
          {
            attrs: {
              role: 'img',
              'aria-hidden': !n['aria-label'],
              'aria-label': n['aria-label'] || p,
            },
          },
          [p || r ? e('use', { attrs: { 'xlink:href': u } }) : s('content')]
        ),
      ]
    );
  },
});
const { createComponent: ss } = R('icon');
var ns = ss({
  functional: !0,
  render(e, { data: t, children: i }) {
    const { attrs: s } = t;
    return e(s && ('src' in s || 'href' in s) ? is : Qi, t, i);
  },
});
const { createComponent: as, bem: rs } = R('collapse-item');
var os = as({
  mixins: [Pi('Collapse')],
  props: { title: String, disabled: Boolean },
  methods: {
    onClick() {
      this.checkable && !this.disabled && (this.checked = !this.checked);
    },
  },
  render() {
    const e = arguments[0],
      { checked: t, disabled: i, title: s } = this;
    return e('div', { class: rs({ active: t }) }, [
      e(
        'div',
        { class: rs('title', { disabled: i }), on: { click: this.onClick } },
        [
          this.slots('title') || s,
          this.slots('icon') ||
            e(ns, {
              class: rs('title-icon', { rotate: t }),
              attrs: { name: 'expand_more', width: '18', height: '18' },
            }),
        ]
      ),
      e(Ki, { attrs: { checked: t } }, [this.slots()]),
    ]);
  },
});
const { createComponent: ls, bem: ds } = R('collapse');
var cs = ls({
  mixins: [Ti('Collapse')],
  props: { exclusive: { type: Boolean, default: !0 } },
  render() {
    return (0, arguments[0])('div', { class: ds() }, [this.slots()]);
  },
});
const { createComponent: hs, bem: ps } = R('combo-box-item');
var us = hs({
  props: { option: Object },
  methods: {
    async buttonClick(e) {
      const t =
        'line-combo-box' === this.$parent.$options.name ? this.$parent : null;
      if (!t) return;
      if (!e) return t.close();
      const { role: i } = e;
      return 'cancel' === i
        ? t.close()
        : (await this.callButtonHandler(e))
        ? (t.$emit('optionChange', e), t.close())
        : Promise.resolve();
    },
    async callButtonHandler(e) {
      if (e)
        try {
          if (!1 === (await h(e.handler))) return !1;
        } catch (e) {}
      return !0;
    },
  },
  render() {
    const e = arguments[0],
      { option: t = {} } = this;
    return e(
      'li',
      {
        class: [ps(''), 'line-activatable'],
        on: { click: () => this.buttonClick(t) },
      },
      [e('span', { class: ps('inner') }, [this.slots() || t.text])]
    );
  },
});
const ms = (e) => e && e._isVue;
function fs() {
  return O({
    props: { trigger: null },
    computed: {
      $trigger() {
        const { trigger: e, $vnode: t } = this;
        if (!e) return;
        const i = (t && t.context.$el) || document;
        if (!t) return l(e) ? i.querySelector(e) : e;
        const s = t.context.$refs,
          n = l(e) ? s[e] || i.querySelector(e) : e;
        return r(n) ? n[0] : n;
      },
      $triggerEl() {
        const e = this.$trigger;
        return ms(e) ? e.$el : e;
      },
    },
  });
}
function gs(e) {
  const { event: t, global: i = !1 } = e;
  return O({
    mounted() {
      const { $el: s } = this,
        n = i ? pe(s) : s,
        a = ((o = t), r(o) ? o : [o]).map((t) => {
          let i;
          const s = () => (i = !0);
          return ie(
            n,
            t,
            (e) => {
              (i = !1),
                this.$emit('event-condition', { ev: e, name: t, prevent: s }),
                i || this.$emit('event-handler', e, t);
            },
            e
          );
        });
      var o;
      this.useEvent = { teardown: () => a.forEach((e) => e()) };
    },
    beforeDestroy() {
      this.useEvent.teardown();
    },
  });
}
function vs(e) {
  const { global: t = !0, event: i = ['mouseup', 'touchend'] } = e || {};
  return O({
    mixins: [gs({ global: t, event: i })],
    mounted() {
      this.$on('event-condition', (e) => {
        const { ev: t, prevent: i } = e;
        if (
          ('isTrusted' in t && !t.isTrusted) ||
          ('pointerType' in t && !t.pointerType)
        )
          return !1;
        let s = [this.$el];
        this.$emit('event-include', (e) => {
          s = s.concat(e);
        }),
          s.some((e) => e && e.contains(t.target)) && i();
      }),
        this.$on('event-handler', () => this.$emit('clickoutside'));
    },
  });
}
function bs(e) {
  var t = e.getBoundingClientRect();
  return {
    width: t.width,
    height: t.height,
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    left: t.left,
    x: t.left,
    y: t.top,
  };
}
function ys(e) {
  if ('[object Window]' !== e.toString()) {
    var t = e.ownerDocument;
    return t ? t.defaultView : window;
  }
  return e;
}
function ws(e) {
  var t = ys(e);
  return { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
}
function xs(e) {
  return e instanceof ys(e).Element || e instanceof Element;
}
function Ss(e) {
  return e instanceof ys(e).HTMLElement || e instanceof HTMLElement;
}
function Es(e) {
  return e ? (e.nodeName || '').toLowerCase() : null;
}
function Ts(e) {
  return (xs(e) ? e.ownerDocument : e.document).documentElement;
}
function $s(e) {
  return bs(Ts(e)).left + ws(e).scrollLeft;
}
function Cs(e, t, i) {
  var s;
  void 0 === i && (i = !1);
  var n,
    a,
    r = bs(e),
    o = { scrollLeft: 0, scrollTop: 0 },
    l = { x: 0, y: 0 };
  return (
    i ||
      ('body' !== Es(t) &&
        (o =
          (n = t) !== ys(n) && Ss(n)
            ? { scrollLeft: (a = n).scrollLeft, scrollTop: a.scrollTop }
            : ws(n)),
      Ss(t)
        ? (((l = bs(t)).x += t.clientLeft), (l.y += t.clientTop))
        : (s = Ts(t)) && (l.x = $s(s))),
    {
      x: r.left + o.scrollLeft - l.x,
      y: r.top + o.scrollTop - l.y,
      width: r.width,
      height: r.height,
    }
  );
}
function ks(e) {
  return {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: e.offsetWidth,
    height: e.offsetHeight,
  };
}
function Ms(e) {
  return 'html' === Es(e)
    ? e
    : e.parentNode ||
        e.host ||
        document.ownerDocument ||
        document.documentElement;
}
function Is(e) {
  return ys(e).getComputedStyle(e);
}
function Ps(e, t) {
  void 0 === t && (t = []);
  var i = (function e(t) {
      if (['html', 'body', '#document'].indexOf(Es(t)) >= 0)
        return t.ownerDocument.body;
      if (Ss(t)) {
        var i = Is(t);
        if (
          /auto|scroll|overlay|hidden/.test(
            i.overflow + i.overflowY + i.overflowX
          )
        )
          return t;
      }
      return e(Ms(t));
    })(e),
    s = 'body' === Es(i),
    n = s ? ys(i) : i,
    a = t.concat(n);
  return s ? a : a.concat(Ps(Ms(n)));
}
function As(e) {
  return ['table', 'td', 'th'].indexOf(Es(e)) >= 0;
}
function Os(e) {
  var t;
  return !Ss(e) ||
    !(t = e.offsetParent) ||
    (void 0 !== window.InstallTrigger && 'fixed' === Is(t).position)
    ? null
    : t;
}
function Bs(e) {
  for (var t = ys(e), i = Os(e); i && As(i); ) i = Os(i);
  return i && 'body' === Es(i) && 'static' === Is(i).position ? t : i || t;
}
var Ls = 'top',
  zs = 'bottom',
  Ds = 'right',
  Ns = 'left',
  Hs = [Ls, zs, Ds, Ns],
  Rs = Hs.reduce(function (e, t) {
    return e.concat([t + '-start', t + '-end']);
  }, []),
  Vs = [].concat(Hs, ['auto']).reduce(function (e, t) {
    return e.concat([t, t + '-start', t + '-end']);
  }, []),
  Ys = [
    'beforeRead',
    'read',
    'afterRead',
    'beforeMain',
    'main',
    'afterMain',
    'beforeWrite',
    'write',
    'afterWrite',
  ];
function qs(e) {
  var t = new Map(),
    i = new Set(),
    s = [];
  return (
    e.forEach(function (e) {
      t.set(e.name, e);
    }),
    e.forEach(function (e) {
      i.has(e.name) ||
        (function e(n) {
          i.add(n.name),
            []
              .concat(n.requires || [], n.requiresIfExists || [])
              .forEach(function (s) {
                if (!i.has(s)) {
                  var n = t.get(s);
                  n && e(n);
                }
              }),
            s.push(n);
        })(e);
    }),
    s
  );
}
function Fs(e) {
  for (
    var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1;
    s < t;
    s++
  )
    i[s - 1] = arguments[s];
  return [].concat(i).reduce(function (e, t) {
    return e.replace(/%s/, t);
  }, e);
}
var Gs =
    'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s',
  Xs = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function Ws(e) {
  return e.split('-')[0];
}
var js =
    'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.',
  _s = { placement: 'bottom', modifiers: [], strategy: 'absolute' };
function Us() {
  for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
    t[i] = arguments[i];
  return !t.some(function (e) {
    return !(e && 'function' == typeof e.getBoundingClientRect);
  });
}
function Ks(e) {
  void 0 === e && (e = {});
  var t = e.defaultModifiers,
    i = void 0 === t ? [] : t,
    s = e.defaultOptions,
    n = void 0 === s ? _s : s;
  return function (e, t, s) {
    void 0 === s && (s = n);
    var a,
      r,
      o = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, _s, {}, n),
        modifiersData: {},
        elements: { reference: e, popper: t },
        attributes: {},
        styles: {},
      },
      l = [],
      d = !1,
      c = {
        state: o,
        setOptions: function (s) {
          h(),
            (o.options = Object.assign({}, n, {}, o.options, {}, s)),
            (o.scrollParents = {
              reference: xs(e) ? Ps(e) : [],
              popper: Ps(t),
            });
          var a,
            r,
            d,
            p = (function (e) {
              var t = qs(e);
              return Ys.reduce(function (e, i) {
                return e.concat(
                  t.filter(function (e) {
                    return e.phase === i;
                  })
                );
              }, []);
            })(
              (function (e) {
                var t = e.reduce(function (e, t) {
                  var i = e[t.name];
                  return (
                    (e[t.name] = i
                      ? Object.assign({}, i, {}, t, {
                          options: Object.assign({}, i.options, {}, t.options),
                          data: Object.assign({}, i.data, {}, t.data),
                        })
                      : t),
                    e
                  );
                }, {});
                return Object.keys(t).map(function (e) {
                  return t[e];
                });
              })([].concat(i, o.options.modifiers))
            );
          if (
            ((o.orderedModifiers = p.filter(function (e) {
              return e.enabled;
            })),
            'production' !== process.env.NODE_ENV)
          ) {
            if (
              ((function (e) {
                e.forEach(function (t) {
                  Object.keys(t).forEach(function (i) {
                    switch (i) {
                      case 'name':
                        'string' != typeof t.name &&
                          console.error(
                            Fs(
                              Gs,
                              String(t.name),
                              '"name"',
                              '"string"',
                              '"' + String(t.name) + '"'
                            )
                          );
                        break;
                      case 'enabled':
                        'boolean' != typeof t.enabled &&
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"enabled"',
                              '"boolean"',
                              '"' + String(t.enabled) + '"'
                            )
                          );
                      case 'phase':
                        Ys.indexOf(t.phase) < 0 &&
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"phase"',
                              'either ' + Ys.join(', '),
                              '"' + String(t.phase) + '"'
                            )
                          );
                        break;
                      case 'fn':
                        'function' != typeof t.fn &&
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"fn"',
                              '"function"',
                              '"' + String(t.fn) + '"'
                            )
                          );
                        break;
                      case 'effect':
                        'function' != typeof t.effect &&
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"effect"',
                              '"function"',
                              '"' + String(t.fn) + '"'
                            )
                          );
                        break;
                      case 'requires':
                        Array.isArray(t.requires) ||
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"requires"',
                              '"array"',
                              '"' + String(t.requires) + '"'
                            )
                          );
                        break;
                      case 'requiresIfExists':
                        Array.isArray(t.requiresIfExists) ||
                          console.error(
                            Fs(
                              Gs,
                              t.name,
                              '"requiresIfExists"',
                              '"array"',
                              '"' + String(t.requiresIfExists) + '"'
                            )
                          );
                        break;
                      case 'options':
                      case 'data':
                        break;
                      default:
                        console.error(
                          'PopperJS: an invalid property has been provided to the "' +
                            t.name +
                            '" modifier, valid properties are ' +
                            Xs.map(function (e) {
                              return '"' + e + '"';
                            }).join(', ') +
                            '; but "' +
                            i +
                            '" was provided.'
                        );
                    }
                    t.requires &&
                      t.requires.forEach(function (i) {
                        null ==
                          e.find(function (e) {
                            return e.name === i;
                          }) &&
                          console.error(
                            Fs(
                              'Popper: modifier "%s" requires "%s", but "%s" modifier is not available',
                              String(t.name),
                              i,
                              i
                            )
                          );
                      });
                  });
                });
              })(
                ((a = [].concat(p, o.options.modifiers)),
                (r = function (e) {
                  return e.name;
                }),
                (d = new Set()),
                a.filter(function (e) {
                  var t = r(e);
                  if (!d.has(t)) return d.add(t), !0;
                }))
              ),
              'auto' === Ws(o.options.placement))
            )
              o.orderedModifiers.find(function (e) {
                return 'flip' === e.name;
              }) ||
                console.error(
                  [
                    'Popper: "auto" placements require the "flip" modifier be',
                    'present and enabled to work.',
                  ].join(' ')
                );
            var u = Is(t);
            [u.marginTop, u.marginRight, u.marginBottom, u.marginLeft].some(
              function (e) {
                return parseFloat(e);
              }
            ) &&
              console.warn(
                [
                  'Popper: CSS "margin" styles cannot be used to apply padding',
                  'between the popper and its reference element or boundary.',
                  'To replicate margin, use the `offset` modifier, as well as',
                  'the `padding` option in the `preventOverflow` and `flip`',
                  'modifiers.',
                ].join(' ')
              );
          }
          return (
            o.orderedModifiers.forEach(function (e) {
              var t = e.options,
                i = e.effect;
              if ('function' == typeof i) {
                var s = i({
                  state: o,
                  name: e.name,
                  instance: c,
                  options: void 0 === t ? {} : t,
                });
                l.push(s || function () {});
              }
            }),
            c.update()
          );
        },
        forceUpdate: function () {
          if (!d) {
            var e = o.elements,
              t = e.reference,
              i = e.popper;
            if (Us(t, i)) {
              (o.rects = {
                reference: Cs(t, Bs(i), 'fixed' === o.options.strategy),
                popper: ks(i),
              }),
                (o.reset = !1),
                (o.placement = o.options.placement),
                o.orderedModifiers.forEach(function (e) {
                  return (o.modifiersData[e.name] = Object.assign({}, e.data));
                });
              for (var s = 0, n = 0; n < o.orderedModifiers.length; n++) {
                if ('production' !== process.env.NODE_ENV && (s += 1) > 100) {
                  console.error(
                    'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.'
                  );
                  break;
                }
                if (!0 !== o.reset) {
                  var a = o.orderedModifiers[n],
                    r = a.fn,
                    l = a.options;
                  'function' == typeof r &&
                    (o =
                      r({
                        state: o,
                        options: void 0 === l ? {} : l,
                        name: a.name,
                        instance: c,
                      }) || o);
                } else (o.reset = !1), (n = -1);
              }
            } else 'production' !== process.env.NODE_ENV && console.error(js);
          }
        },
        update:
          ((a = function () {
            return new Promise(function (e) {
              c.forceUpdate(), e(o);
            });
          }),
          function () {
            return (
              r ||
                (r = new Promise(function (e) {
                  Promise.resolve().then(function () {
                    (r = void 0), e(a());
                  });
                })),
              r
            );
          }),
        destroy: function () {
          h(), (d = !0);
        },
      };
    if (!Us(e, t))
      return 'production' !== process.env.NODE_ENV && console.error(js), c;
    function h() {
      l.forEach(function (e) {
        return e();
      }),
        (l = []);
    }
    return (
      c.setOptions(s).then(function (e) {
        !d && s.onFirstUpdate && s.onFirstUpdate(e);
      }),
      c
    );
  };
}
var Js = { passive: !0 };
function Zs(e) {
  return e.split('-')[1];
}
function Qs(e) {
  return ['top', 'bottom'].indexOf(e) >= 0 ? 'x' : 'y';
}
function en(e) {
  var t,
    i = e.reference,
    s = e.element,
    n = e.placement,
    a = n ? Ws(n) : null,
    r = n ? Zs(n) : null,
    o = i.x + i.width / 2 - s.width / 2,
    l = i.y + i.height / 2 - s.height / 2;
  switch (a) {
    case Ls:
      t = { x: o, y: i.y - s.height };
      break;
    case zs:
      t = { x: o, y: i.y + i.height };
      break;
    case Ds:
      t = { x: i.x + i.width, y: l };
      break;
    case Ns:
      t = { x: i.x - s.width, y: l };
      break;
    default:
      t = { x: i.x, y: i.y };
  }
  var d = a ? Qs(a) : null;
  if (null != d) {
    var c = 'y' === d ? 'height' : 'width';
    switch (r) {
      case 'start':
        t[d] = Math.floor(t[d]) - Math.floor(i[c] / 2 - s[c] / 2);
        break;
      case 'end':
        t[d] = Math.floor(t[d]) + Math.ceil(i[c] / 2 - s[c] / 2);
    }
  }
  return t;
}
var tn = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' };
function sn(e) {
  var t,
    i = e.popper,
    s = e.popperRect,
    n = e.placement,
    a = e.offsets,
    r = e.position,
    o = e.gpuAcceleration,
    l = e.adaptive,
    d = (function (e) {
      var t = e.y,
        i = window.devicePixelRatio || 1;
      return { x: Math.round(e.x * i) / i || 0, y: Math.round(t * i) / i || 0 };
    })(a),
    c = d.x,
    h = d.y,
    p = a.hasOwnProperty('x'),
    u = a.hasOwnProperty('y'),
    m = Ns,
    f = Ls,
    g = window;
  if (l) {
    var v = Bs(i);
    v === ys(i) && (v = Ts(i)),
      n === Ls &&
        ((f = zs), (h -= v.clientHeight - s.height), (h *= o ? 1 : -1)),
      n === Ns && ((m = Ds), (c -= v.clientWidth - s.width), (c *= o ? 1 : -1));
  }
  var b,
    y = Object.assign({ position: r }, l && tn);
  return Object.assign(
    {},
    y,
    o
      ? (((b = {})[f] = u ? '0' : ''),
        (b[m] = p ? '0' : ''),
        (b.transform =
          (g.devicePixelRatio || 1) < 2
            ? 'translate(' + c + 'px, ' + h + 'px)'
            : 'translate3d(' + c + 'px, ' + h + 'px, 0)'),
        b)
      : (((t = {})[f] = u ? h + 'px' : ''),
        (t[m] = p ? c + 'px' : ''),
        (t.transform = ''),
        t)
  );
}
var nn = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function an(e) {
  return e.replace(/left|right|bottom|top/g, function (e) {
    return nn[e];
  });
}
var rn = { start: 'end', end: 'start' };
function on(e) {
  return e.replace(/start|end/g, function (e) {
    return rn[e];
  });
}
function ln(e) {
  return parseFloat(e) || 0;
}
function dn(e) {
  var t = ys(e),
    i = (function (e) {
      var t = Ss(e) ? Is(e) : {};
      return {
        top: ln(t.borderTopWidth),
        right: ln(t.borderRightWidth),
        bottom: ln(t.borderBottomWidth),
        left: ln(t.borderLeftWidth),
      };
    })(e),
    s = 'html' === Es(e),
    n = $s(e),
    a = e.clientWidth + i.right,
    r = e.clientHeight + i.bottom;
  return (
    s && t.innerHeight - e.clientHeight > 50 && (r = t.innerHeight - i.bottom),
    {
      top: s ? 0 : e.clientTop,
      right:
        e.clientLeft > i.left
          ? i.right
          : s
          ? t.innerWidth - a - n
          : e.offsetWidth - a,
      bottom: s ? t.innerHeight - r : e.offsetHeight - r,
      left: s ? n : e.clientLeft,
    }
  );
}
function cn(e, t) {
  var i = Boolean(t.getRootNode && t.getRootNode().host);
  if (e.contains(t)) return !0;
  if (i) {
    var s = t;
    do {
      if (s && e.isSameNode(s)) return !0;
      s = s.parentNode || s.host;
    } while (s);
  }
  return !1;
}
function hn(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function pn(e, t) {
  return 'viewport' === t
    ? hn(
        (function (e) {
          var t = ys(e);
          return { width: t.innerWidth, height: t.innerHeight, x: 0, y: 0 };
        })(e)
      )
    : Ss(t)
    ? bs(t)
    : hn(
        (function (e) {
          var t = ys(e),
            i = ws(e),
            s = Cs(Ts(e), t);
          return (
            (s.height = Math.max(s.height, t.innerHeight)),
            (s.width = Math.max(s.width, t.innerWidth)),
            (s.x = -i.scrollLeft),
            (s.y = -i.scrollTop),
            s
          );
        })(Ts(e))
      );
}
function un(e, t, i) {
  var s =
      'clippingParents' === t
        ? (function (e) {
            var t = Ps(e),
              i =
                ['absolute', 'fixed'].indexOf(Is(e).position) >= 0 && Ss(e)
                  ? Bs(e)
                  : e;
            return xs(i)
              ? t.filter(function (e) {
                  return xs(e) && cn(e, i);
                })
              : [];
          })(e)
        : [].concat(t),
    n = [].concat(s, [i]),
    a = n.reduce(function (t, i) {
      var s = pn(e, i),
        n = dn(Ss(i) ? i : Ts(e));
      return (
        (t.top = Math.max(s.top + n.top, t.top)),
        (t.right = Math.min(s.right - n.right, t.right)),
        (t.bottom = Math.min(s.bottom - n.bottom, t.bottom)),
        (t.left = Math.max(s.left + n.left, t.left)),
        t
      );
    }, pn(e, n[0]));
  return (
    (a.width = a.right - a.left),
    (a.height = a.bottom - a.top),
    (a.x = a.left),
    (a.y = a.top),
    a
  );
}
function mn(e) {
  return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, {}, e);
}
function fn(e, t) {
  return t.reduce(function (t, i) {
    return (t[i] = e), t;
  }, {});
}
function gn(e, t) {
  void 0 === t && (t = {});
  var i = t.placement,
    s = void 0 === i ? e.placement : i,
    n = t.boundary,
    a = void 0 === n ? 'clippingParents' : n,
    r = t.rootBoundary,
    o = void 0 === r ? 'viewport' : r,
    l = t.elementContext,
    d = void 0 === l ? 'popper' : l,
    c = t.altBoundary,
    h = void 0 !== c && c,
    p = t.padding,
    u = void 0 === p ? 0 : p,
    m = mn('number' != typeof u ? u : fn(u, Hs)),
    f = e.elements.reference,
    g = e.rects.popper,
    v = e.elements[h ? ('popper' === d ? 'reference' : 'popper') : d],
    b = un(xs(v) ? v : Ts(e.elements.popper), a, o),
    y = bs(f),
    w = en({ reference: y, element: g, strategy: 'absolute', placement: s }),
    x = hn(Object.assign({}, g, {}, w)),
    S = 'popper' === d ? x : y,
    E = {
      top: b.top - S.top + m.top,
      bottom: S.bottom - b.bottom + m.bottom,
      left: b.left - S.left + m.left,
      right: S.right - b.right + m.right,
    },
    T = e.modifiersData.offset;
  if ('popper' === d && T) {
    var $ = T[s];
    Object.keys(E).forEach(function (e) {
      var t = [Ds, zs].indexOf(e) >= 0 ? 1 : -1,
        i = [Ls, zs].indexOf(e) >= 0 ? 'y' : 'x';
      E[e] += $[i] * t;
    });
  }
  return E;
}
function vn(e, t, i) {
  return Math.max(e, Math.min(t, i));
}
function bn(e, t, i) {
  return (
    void 0 === i && (i = { x: 0, y: 0 }),
    {
      top: e.top - t.height - i.y,
      right: e.right - t.width + i.x,
      bottom: e.bottom - t.height + i.y,
      left: e.left - t.width - i.x,
    }
  );
}
function yn(e) {
  return [Ls, Ds, zs, Ns].some(function (t) {
    return e[t] >= 0;
  });
}
var wn = Ks({
  defaultModifiers: [
    {
      name: 'eventListeners',
      enabled: !0,
      phase: 'write',
      fn: function () {},
      effect: function (e) {
        var t = e.state,
          i = e.instance,
          s = e.options,
          n = s.scroll,
          a = void 0 === n || n,
          r = s.resize,
          o = void 0 === r || r,
          l = ys(t.elements.popper),
          d = [].concat(t.scrollParents.reference, t.scrollParents.popper);
        return (
          a &&
            d.forEach(function (e) {
              e.addEventListener('scroll', i.update, Js);
            }),
          o && l.addEventListener('resize', i.update, Js),
          function () {
            a &&
              d.forEach(function (e) {
                e.removeEventListener('scroll', i.update, Js);
              }),
              o && l.removeEventListener('resize', i.update, Js);
          }
        );
      },
      data: {},
    },
    {
      name: 'popperOffsets',
      enabled: !0,
      phase: 'read',
      fn: function (e) {
        var t = e.state;
        t.modifiersData[e.name] = en({
          reference: t.rects.reference,
          element: t.rects.popper,
          strategy: 'absolute',
          placement: t.placement,
        });
      },
      data: {},
    },
    {
      name: 'computeStyles',
      enabled: !0,
      phase: 'beforeWrite',
      fn: function (e) {
        var t = e.state,
          i = e.options,
          s = i.gpuAcceleration,
          n = void 0 === s || s,
          a = i.adaptive,
          r = void 0 === a || a;
        if ('production' !== process.env.NODE_ENV) {
          var o = Is(t.elements.popper).transitionProperty;
          r &&
            ['transform', 'top', 'right', 'bottom', 'left'].some(function (e) {
              return o.indexOf(e) >= 0;
            }) &&
            console.warn(
              [
                'Popper: Detected CSS transitions on at least one of the following',
                'CSS properties: "transform", "top", "right", "bottom", "left".',
                '\n\n',
                'Disable the "computeStyles" modifier\'s `adaptive` option to allow',
                'for smooth transitions, or remove these properties from the CSS',
                'transition declaration on the popper element if only transitioning',
                'opacity or background-color for example.',
                '\n\n',
                'We recommend using the popper element as a wrapper around an inner',
                'element that can have any CSS property transitioned for animations.',
              ].join(' ')
            );
        }
        var l = {
          placement: Ws(t.placement),
          popper: t.elements.popper,
          popperRect: t.rects.popper,
          gpuAcceleration: n,
        };
        (t.styles.popper = Object.assign(
          {},
          t.styles.popper,
          {},
          sn(
            Object.assign({}, l, {
              offsets: t.modifiersData.popperOffsets,
              position: t.options.strategy,
              adaptive: r,
            })
          )
        )),
          null != t.modifiersData.arrow &&
            (t.styles.arrow = Object.assign(
              {},
              t.styles.arrow,
              {},
              sn(
                Object.assign({}, l, {
                  offsets: t.modifiersData.arrow,
                  position: 'absolute',
                  adaptive: !1,
                })
              )
            )),
          (t.attributes.popper = Object.assign({}, t.attributes.popper, {
            'data-popper-placement': t.placement,
          }));
      },
      data: {},
    },
    {
      name: 'applyStyles',
      enabled: !0,
      phase: 'write',
      fn: function (e) {
        var t = e.state;
        Object.keys(t.elements).forEach(function (e) {
          var i = t.styles[e] || {},
            s = t.attributes[e] || {},
            n = t.elements[e];
          Ss(n) &&
            Es(n) &&
            (Object.assign(n.style, i),
            Object.keys(s).forEach(function (e) {
              var t = s[e];
              !1 === t
                ? n.removeAttribute(e)
                : n.setAttribute(e, !0 === t ? '' : t);
            }));
        });
      },
      effect: function (e) {
        var t = e.state,
          i = {
            popper: { position: 'absolute', left: '0', top: '0', margin: '0' },
            arrow: { position: 'absolute' },
            reference: {},
          };
        return (
          Object.assign(t.elements.popper.style, i.popper),
          t.elements.arrow && Object.assign(t.elements.arrow.style, i.arrow),
          function () {
            Object.keys(t.elements).forEach(function (e) {
              var s = t.elements[e],
                n = t.attributes[e] || {},
                a = Object.keys(
                  t.styles.hasOwnProperty(e) ? t.styles[e] : i[e]
                ).reduce(function (e, t) {
                  return (e[t] = ''), e;
                }, {});
              Ss(s) &&
                Es(s) &&
                (Object.assign(s.style, a),
                Object.keys(n).forEach(function (e) {
                  s.removeAttribute(e);
                }));
            });
          }
        );
      },
      requires: ['computeStyles'],
    },
    {
      name: 'offset',
      enabled: !0,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: function (e) {
        var t = e.state,
          i = e.name,
          s = e.options.offset,
          n = void 0 === s ? [0, 0] : s,
          a = Vs.reduce(function (e, i) {
            return (
              (e[i] = (function (e, t, i) {
                var s = Ws(e),
                  n = [Ns, Ls].indexOf(s) >= 0 ? -1 : 1,
                  a =
                    'function' == typeof i
                      ? i(Object.assign({}, t, { placement: e }))
                      : i,
                  r = a[0],
                  o = a[1];
                return (
                  (r = r || 0),
                  (o = (o || 0) * n),
                  [Ns, Ds].indexOf(s) >= 0 ? { x: o, y: r } : { x: r, y: o }
                );
              })(i, t.rects, n)),
              e
            );
          }, {}),
          r = a[t.placement],
          o = r.y;
        (t.modifiersData.popperOffsets.x += r.x),
          (t.modifiersData.popperOffsets.y += o),
          (t.modifiersData[i] = a);
      },
    },
    {
      name: 'flip',
      enabled: !0,
      phase: 'main',
      fn: function (e) {
        var t = e.state,
          i = e.options,
          s = e.name;
        if (!t.modifiersData[s]._skip) {
          for (
            var n = i.fallbackPlacements,
              a = i.padding,
              r = i.boundary,
              o = i.rootBoundary,
              l = i.altBoundary,
              d = i.flipVariations,
              c = void 0 === d || d,
              h = t.options.placement,
              p = Ws(h),
              u =
                n ||
                (p === h || !c
                  ? [an(h)]
                  : (function (e) {
                      if ('auto' === Ws(e)) return [];
                      var t = an(e);
                      return [on(e), t, on(t)];
                    })(h)),
              m = [h].concat(u).reduce(function (e, i) {
                return e.concat(
                  'auto' === Ws(i)
                    ? (function (e, t) {
                        void 0 === t && (t = {});
                        var i = t.boundary,
                          s = t.rootBoundary,
                          n = t.padding,
                          a = t.flipVariations,
                          r = Zs(t.placement),
                          o = (r
                            ? a
                              ? Rs
                              : Rs.filter(function (e) {
                                  return Zs(e) === r;
                                })
                            : Hs
                          ).reduce(function (t, a) {
                            return (
                              (t[a] = gn(e, {
                                placement: a,
                                boundary: i,
                                rootBoundary: s,
                                padding: n,
                              })[Ws(a)]),
                              t
                            );
                          }, {});
                        return Object.keys(o).sort(function (e, t) {
                          return o[e] - o[t];
                        });
                      })(t, {
                        placement: i,
                        boundary: r,
                        rootBoundary: o,
                        padding: a,
                        flipVariations: c,
                      })
                    : i
                );
              }, []),
              f = t.rects.reference,
              g = t.rects.popper,
              v = new Map(),
              b = !0,
              y = m[0],
              w = 0;
            w < m.length;
            w++
          ) {
            var x = m[w],
              S = Ws(x),
              E = 'start' === Zs(x),
              T = [Ls, zs].indexOf(S) >= 0,
              $ = T ? 'width' : 'height',
              C = gn(t, {
                placement: x,
                boundary: r,
                rootBoundary: o,
                altBoundary: l,
                padding: a,
              }),
              k = T ? (E ? Ds : Ns) : E ? zs : Ls;
            f[$] > g[$] && (k = an(k));
            var M = an(k),
              I = [C[S] <= 0, C[k] <= 0, C[M] <= 0];
            if (
              I.every(function (e) {
                return e;
              })
            ) {
              (y = x), (b = !1);
              break;
            }
            v.set(x, I);
          }
          if (b)
            for (
              var P = function (e) {
                  var t = m.find(function (t) {
                    var i = v.get(t);
                    if (i)
                      return i.slice(0, e).every(function (e) {
                        return e;
                      });
                  });
                  if (t) return (y = t), 'break';
                },
                A = c ? 3 : 1;
              A > 0;
              A--
            ) {
              if ('break' === P(A)) break;
            }
          t.placement !== y &&
            ((t.modifiersData[s]._skip = !0),
            (t.placement = y),
            (t.reset = !0));
        }
      },
      requiresIfExists: ['offset'],
      data: { _skip: !1 },
    },
    {
      name: 'preventOverflow',
      enabled: !0,
      phase: 'main',
      fn: function (e) {
        var t = e.state,
          i = e.options,
          s = e.name,
          n = i.mainAxis,
          a = void 0 === n || n,
          r = i.altAxis,
          o = void 0 !== r && r,
          l = i.tether,
          d = void 0 === l || l,
          c = i.tetherOffset,
          h = void 0 === c ? 0 : c,
          p = gn(t, {
            boundary: i.boundary,
            rootBoundary: i.rootBoundary,
            padding: i.padding,
            altBoundary: i.altBoundary,
          }),
          u = Ws(t.placement),
          m = Zs(t.placement),
          f = !m,
          g = Qs(u),
          v = 'x' === g ? 'y' : 'x',
          b = t.modifiersData.popperOffsets,
          y = t.rects.reference,
          w = t.rects.popper,
          x =
            'function' == typeof h
              ? h(Object.assign({}, t.rects, { placement: t.placement }))
              : h,
          S = { x: 0, y: 0 };
        if (a) {
          var E = 'y' === g ? Ls : Ns,
            T = 'y' === g ? zs : Ds,
            $ = 'y' === g ? 'height' : 'width',
            C = b[g],
            k = b[g] + p[E],
            M = b[g] - p[T],
            I = d ? -w[$] / 2 : 0,
            P = 'start' === m ? y[$] : w[$],
            A = 'start' === m ? -w[$] : -y[$],
            O = t.elements.arrow,
            B = d && O ? ks(O) : { width: 0, height: 0 },
            L = t.modifiersData['arrow#persistent']
              ? t.modifiersData['arrow#persistent'].padding
              : { top: 0, right: 0, bottom: 0, left: 0 },
            z = L[E],
            D = L[T],
            N = vn(0, y[$], B[$]),
            H = f ? y[$] / 2 - I - N - z - x : P - N - z - x,
            R = f ? -y[$] / 2 + I + N + D + x : A + N + D + x,
            V = t.elements.arrow && Bs(t.elements.arrow),
            Y = t.modifiersData.offset
              ? t.modifiersData.offset[t.placement][g]
              : 0,
            q = b[g] + R - Y,
            F = vn(
              d
                ? Math.min(
                    k,
                    b[g] +
                      H -
                      Y -
                      (V
                        ? 'y' === g
                          ? V.clientTop || 0
                          : V.clientLeft || 0
                        : 0)
                  )
                : k,
              C,
              d ? Math.max(M, q) : M
            );
          (b[g] = F), (S[g] = F - C);
        }
        if (o) {
          var G = b[v],
            X = vn(G + p['x' === g ? Ls : Ns], G, G - p['x' === g ? zs : Ds]);
          (t.modifiersData.popperOffsets[v] = X), (S[v] = X - G);
        }
        t.modifiersData[s] = S;
      },
      requiresIfExists: ['offset'],
    },
    {
      name: 'arrow',
      enabled: !0,
      phase: 'main',
      fn: function (e) {
        var t,
          i = e.state,
          s = e.name,
          n = i.elements.arrow,
          a = i.modifiersData.popperOffsets,
          r = Ws(i.placement),
          o = Qs(r),
          l = [Ns, Ds].indexOf(r) >= 0 ? 'height' : 'width';
        if (n) {
          var d = i.modifiersData[s + '#persistent'].padding,
            c = ks(n),
            h = 'y' === o ? Ls : Ns,
            p = 'y' === o ? zs : Ds,
            u =
              i.rects.reference[l] +
              i.rects.reference[o] -
              a[o] -
              i.rects.popper[l],
            m = a[o] - i.rects.reference[o],
            f = i.elements.arrow && Bs(i.elements.arrow),
            g = vn(
              d[h],
              i.rects.popper[l] / 2 -
                c[l] / 2 +
                (u / 2 -
                  m / 2 -
                  (f ? ('y' === o ? f.clientLeft || 0 : f.clientTop || 0) : 0)),
              i.rects.popper[l] - c[l] - d[p]
            );
          i.modifiersData[s] = (((t = {})[o] = g), t);
        }
      },
      effect: function (e) {
        var t = e.state,
          i = e.options,
          s = e.name,
          n = i.element,
          a = void 0 === n ? '[data-popper-arrow]' : n,
          r = i.padding,
          o = void 0 === r ? 0 : r;
        ('string' != typeof a || (a = t.elements.popper.querySelector(a))) &&
          (cn(t.elements.popper, a)
            ? ((t.elements.arrow = a),
              (t.modifiersData[s + '#persistent'] = {
                padding: mn('number' != typeof o ? o : fn(o, Hs)),
              }))
            : 'production' !== process.env.NODE_ENV &&
              console.error(
                [
                  'Popper: "arrow" modifier\'s `element` must be a child of the popper',
                  'element.',
                ].join(' ')
              ));
      },
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow'],
    },
    {
      name: 'hide',
      enabled: !0,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: function (e) {
        var t = e.state,
          i = e.name,
          s = t.rects.reference,
          n = t.rects.popper,
          a = t.modifiersData.preventOverflow,
          r = gn(t, { elementContext: 'reference' }),
          o = gn(t, { altBoundary: !0 }),
          l = bn(r, s),
          d = bn(o, n, a),
          c = yn(l),
          h = yn(d);
        (t.modifiersData[i] = {
          referenceClippingOffsets: l,
          popperEscapeOffsets: d,
          isReferenceHidden: c,
          hasPopperEscaped: h,
        }),
          (t.attributes.popper = Object.assign({}, t.attributes.popper, {
            'data-popper-reference-hidden': c,
            'data-popper-escaped': h,
          }));
      },
    },
  ],
});
const { createComponent: xn, bem: Sn } = R('combo-box');
var En = xn({
  mixins: [U('visible'), Gt(), fs(), vs(), _i()],
  props: {
    options: Array,
    showDuration: Number,
    hideDuration: Number,
    expand: Boolean,
    size: String,
  },
  data: () => ({ placement: 'bottom' }),
  methods: {
    close() {
      this.$emit('change', !1);
    },
    createPopper() {
      if (this.popper) return;
      const e = {
          getBoundingClientRect: () => this.$triggerEl.getBoundingClientRect(),
        },
        { $el: t, placement: i } = this;
      this.popper = wn(e, t, {
        placement: i,
        strategy: 'fixed',
        modifiers: [
          { name: 'offset', options: { offset: [0, 2] } },
          {
            name: 'preventOverflow',
            options: { mainAxis: !1, altAxis: !0, padding: 2 },
          },
          { name: 'flip', options: { padding: 2 } },
        ],
      });
    },
  },
  beforeMount() {
    this.$on('aboutToShow', (e) => {
      if (this.expand && this.$triggerEl) {
        const { width: t } = this.$triggerEl.getBoundingClientRect();
        e.style.width = `${t}px`;
      }
      this.createPopper(), this.popper.update(), Ee.push(this);
    }),
      this.$on('animation-enter', async (e, t) => {
        const { showDuration: i = 250 } = this;
        await this.$nextTick(),
          (e.style.zIndex = `${Ee.getOverlayIndex()}`),
          t.easing('ease').duration(i);
      }),
      this.$on('animation-leave', (e, t) => {
        const { hideDuration: i = 150 } = this;
        t.easing('ease').duration(i);
      }),
      this.$on('closed', () => {
        Ee.pop(this);
      }),
      this.$on('canceled', () => {
        Ee.pop(this);
      }),
      this.$on('event-include', (e) => e(this.$triggerEl));
    this.$on('clickoutside', () => {
      this.close();
    });
  },
  beforeDestroy() {
    this.popper && this.popper.destroy();
  },
  render() {
    const e = arguments[0],
      { visible: t, options: i } = this;
    return e(
      'div',
      b([
        { class: Sn(), directives: [{ name: 'show', value: t }] },
        { on: this.$listeners },
      ]),
      [
        e('ul', { class: Sn('content') }, [
          this.slots() ||
            i.map((t) => e(us, { attrs: { option: t } }, [t.text])),
        ]),
      ]
    );
  },
});
async function Tn(
  e = document.scrollingElement || document.body || document.documentElement,
  t,
  i,
  s = 0
) {
  if (s < 32)
    return (
      null != i && (e.scrollTop = i), void (null != t && (e.scrollLeft = t))
    );
  let n,
    a = 0;
  const r = new Promise((e) => (n = e)),
    o = e.scrollTop,
    l = e.scrollLeft,
    d = null != i ? i - o : 0,
    c = null != t ? t - l : 0,
    h = (t) => {
      const i = Math.min(1, (t - a) / s) - 1,
        r = Math.pow(i, 3) + 1;
      0 !== d && (e.scrollTop = Math.floor(r * d + o)),
        0 !== c && (e.scrollLeft = Math.floor(r * c + l)),
        r < 1 ? requestAnimationFrame(h) : n();
    };
  requestAnimationFrame((e) => {
    (a = e), h(e);
  }),
    await r;
}
async function $n(e, t, i, s) {
  await Tn(e, t + e.scrollLeft, i + e.scrollTop, s);
}
const Cn = (e) => {
    let t = 0;
    for (; e; ) (t += e.offsetLeft), (e = e.offsetParent);
    return t;
  },
  kn = (e) => {
    let t = 0;
    for (; e; ) (t += e.offsetTop), (e = e.offsetParent);
    return t;
  };
const { createComponent: Mn, bem: In } = R('content');
var Pn = Mn({
  mixins: [Gt()],
  provide() {
    return { Content: this };
  },
  props: {
    forceOverscroll: Boolean,
    fullscreen: Boolean,
    scrollX: Boolean,
    scrollY: { type: Boolean, default: !0 },
    scrollEvents: Boolean,
    value: Boolean,
  },
  data: () => ({ cTop: 0, cBottom: 0 }),
  computed: {
    shouldForceOverscroll() {
      const { forceOverscroll: e, mode: t } = this;
      return void 0 === e ? 'ios' === t && qe('ios') : e;
    },
  },
  watch: {
    fullscreen(e) {
      e ? this.readDimensions() : (this.cTop = this.cBottom = 0);
    },
  },
  async mounted() {
    this.fullscreen && (await this.$nextTick(), this.readDimensions());
  },
  methods: {
    readDimensions() {
      const e = this.$el,
        t = ((e) => {
          const t = e.closest('.line-tabs');
          if (t) return t;
          const i = e.closest('.line-app,.line-page,page-inner');
          return (
            i ||
            ((e) =>
              e.parentElement
                ? e.parentElement
                : e.parentNode && e.parentNode.host
                ? e.parentNode.host
                : null)(e)
          );
        })(e),
        i = Math.max(e.offsetTop, 0),
        s = Math.max(t.offsetHeight - i - e.offsetHeight, 0);
      (i !== this.cTop || s !== this.cBottom) &&
        ((this.cTop = i), (this.cBottom = s));
    },
    getScrollElement() {
      return this.$refs.scrollEl;
    },
    getBackgroundContent() {
      return this.$refs.backgroundContentEl;
    },
    async scrollByPoint(e, t, i) {
      const { scrollEl: s } = this.$refs;
      s && (await $n(s, e, t, i));
    },
    async scrollToElement(e) {
      const { scrollEl: t } = this.$refs;
      if (!t) return;
      const i = l(e) ? t.querySelector(e) : e;
      await (async function (e, t, i) {
        if (!t) return;
        const s = Cn(t) - Cn(e),
          n = kn(t) - kn(e);
        await $n(e, s, n, i);
      })(t, i);
    },
    async scrollToBottom(e) {
      const { scrollEl: t } = this.$refs;
      t &&
        (await (async function (e, t) {
          const i = e.scrollHeight - e.clientHeight;
          await Tn(e, void 0, i, t);
        })(t, e));
    },
    async scrollToPoint(e, t, i) {
      const { scrollEl: s } = this.$refs;
      s && (await Tn(s, e, t, i));
    },
    async scrollToTop(e) {
      const { scrollEl: t } = this.$refs;
      t &&
        (await (async function (e, t) {
          await Tn(e, void 0, 0, t);
        })(t, e));
    },
    onClick(e) {
      this.isScrolling && (e.preventDefault(), e.stopPropagation());
    },
    async onScroll(e) {
      const t = Date.now(),
        i = !this.isScrolling;
      (this.lastScroll = t),
        i && this.onScrollStart(),
        !this.queued &&
          this.scrollEvents &&
          ((this.queued = !0),
          await this.$nextTick(),
          (this.queued = !1),
          (this.detail.event = e),
          ((e, t, i, s) => {
            const n = e.currentX,
              a = e.currentY,
              r = t.scrollLeft,
              o = t.scrollTop,
              l = i - e.currentTime;
            if (
              (s &&
                ((e.startTime = i),
                (e.startX = r),
                (e.startY = o),
                (e.velocityX = e.velocityY = 0)),
              (e.currentTime = i),
              (e.currentX = e.scrollLeft = r),
              (e.currentY = e.scrollTop = o),
              (e.deltaX = r - e.startX),
              (e.deltaY = o - e.startY),
              l > 0 && l < 100)
            ) {
              const t = (o - a) / l;
              (e.velocityX = 0.7 * ((r - n) / l) + 0.3 * e.velocityX),
                (e.velocityY = 0.7 * t + 0.3 * e.velocityY);
            }
          })(this.detail, this.scrollEl, Date.now(), i),
          this.ionScroll.emit(this.detail),
          this.$emit('scroll', this.detail));
    },
    onScrollStart() {
      (this.isScrolling = !0),
        this.$emit('scrollstart', { isScrolling: !0 }),
        this.watchDog && clearInterval(this.watchDog),
        (this.watchDog = setInterval(() => {
          this.lastScroll < Date.now() - 120 && this.onScrollEnd();
        }, 100));
    },
    onScrollEnd() {
      clearInterval(this.watchDog),
        (this.watchDog = null),
        this.isScrolling &&
          ((this.isScrolling = !1),
          this.$emit('scrollend', { isScrolling: !1 }));
    },
  },
  render() {
    const e = arguments[0],
      { scrollX: t, scrollY: i, shouldForceOverscroll: s } = this;
    return e(
      'div',
      b([
        {
          class: [In(), !1, s && 'overscroll'],
          style: {
            '--offset-top': `${this.cTop || 0}px`,
            '--offset-bottom': `${this.cBottom || 0}px`,
          },
        },
        { on: { '!click': this.onClick } },
      ]),
      [
        e('div', {
          ref: 'backgroundContentEl',
          attrs: { id: 'background-content' },
        }),
        this.slots('header'),
        e(
          'main',
          {
            class: {
              'inner-scroll': !0,
              'scroll-x': t,
              'scroll-y': i,
              overscroll: (t || i) && s,
            },
            ref: 'scrollEl',
            on: { scroll: this.onScroll },
          },
          [this.slots()]
        ),
        this.slots('footer'),
        this.slots('fixed'),
      ]
    );
  },
});
function An() {
  return O({
    props: { duration: Number },
    beforeMount() {
      this.$on('opened', () => {
        this.duration > 0 &&
          (this.durationTimeout = setTimeout(
            () => this.close('timeout'),
            this.duration
          ));
      }),
        this.$on('aboutToHide', () => {
          this.durationTimeout && clearTimeout(this.durationTimeout);
        });
    },
  });
}
const On = {
    bubbles: {
      dur: 1e3,
      circles: 9,
      fn: (e, t, i) => {
        const s = `${(e * t) / i - e}ms`,
          n = (2 * Math.PI * t) / i;
        return {
          r: 5,
          style: {
            top: `${9 * Math.sin(n)}px`,
            left: `${9 * Math.cos(n)}px`,
            'animation-delay': s,
          },
        };
      },
    },
    circles: {
      dur: 1e3,
      circles: 8,
      fn: (e, t, i) => {
        const s = t / i,
          n = `${e * s - e}ms`,
          a = 2 * Math.PI * s;
        return {
          r: 5,
          style: {
            top: `${9 * Math.sin(a)}px`,
            left: `${9 * Math.cos(a)}px`,
            'animation-delay': n,
          },
        };
      },
    },
    circular: {
      dur: 1400,
      elmDuration: !0,
      circles: 1,
      fn: () => ({
        r: 20,
        cx: 44,
        cy: 44,
        fill: 'none',
        viewBox: '22 22 44 44',
        transform: 'translate(0,0)',
        style: {},
      }),
    },
    crescent: { dur: 750, circles: 1, fn: () => ({ r: 26, style: {} }) },
    dots: {
      dur: 750,
      circles: 3,
      fn: (e, t) => ({
        r: 6,
        style: { left: `${9 - 9 * t}px`, 'animation-delay': `${-110 * t}ms` },
      }),
    },
    lines: {
      dur: 1e3,
      lines: 12,
      fn: (e, t, i) => ({
        y1: 17,
        y2: 29,
        style: {
          transform: `rotate(${30 * t + (t < 6 ? 180 : -180)}deg)`,
          'animation-delay': `${(e * t) / i - e}ms`,
        },
      }),
    },
    'lines-small': {
      dur: 1e3,
      lines: 12,
      fn: (e, t, i) => ({
        y1: 12,
        y2: 20,
        style: {
          transform: `rotate(${30 * t + (t < 6 ? 180 : -180)}deg)`,
          'animation-delay': `${(e * t) / i - e}ms`,
        },
      }),
    },
  },
  { createComponent: Bn, bem: Ln } = R('spinner');
function zn(e, t, i, s, n) {
  const a = t.fn(i, s, n);
  return (
    (a.style['animation-duration'] = `${i}ms`),
    e('svg', { attrs: { viewBox: a.viewBox || '0 0 64 64' }, style: a.style }, [
      e('circle', {
        attrs: {
          transform: a.transform || 'translate(32,32)',
          cx: a.cx,
          cy: a.cy,
          r: a.r,
        },
        style: t.elmDuration ? { animationDuration: `${i}ms` } : {},
      }),
    ])
  );
}
function Dn(e, t, i, s, n) {
  const a = t.fn(i, s, n);
  return (
    (a.style['animation-duration'] = `${i}ms`),
    e('svg', { attrs: { viewBox: a.viewBox || '0 0 64 64' }, style: a.style }, [
      e('line', {
        attrs: { transform: 'translate(32,32)', y1: a.y1, y2: a.y2 },
      }),
    ])
  );
}
var Nn = Bn({
  functional: !0,
  props: { color: String, duration: Number, type: String, paused: Boolean },
  render(e, { props: t, data: i }) {
    const s = (function (e) {
        const t = e || Fe.get('spinner'),
          i = je();
        return t || ('ios' === i ? 'lines' : 'circular');
      })(t.type),
      n = On[s] || On.lines,
      a = t.duration > 10 ? t.duration : n.dur,
      r = [];
    if (void 0 !== n.circles)
      for (let t = 0; t < n.circles; t++) r.push(zn(e, n, a, t, n.circles));
    else if (void 0 !== n.lines)
      for (let t = 0; t < n.lines; t++) r.push(Dn(e, n, a, t, n.lines));
    return e(
      'div',
      b([
        {
          class: [
            Ln({ [s]: !0, paused: !!t.paused || Fe.getBoolean('testing') }),
            Ft(t.color),
          ],
          attrs: { role: 'progressbar' },
          style: n.elmDuration && { animationDuration: `${a}ms` },
        },
        i,
      ]),
      [r]
    );
  },
});
const Hn = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s.addElement(e.querySelector('.line-loading__wrapper')).keyframes([
        { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
        { offset: 1, opacity: 1, transform: 'scale(1)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  Rn = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s.addElement(e.querySelector('.line-loading__wrapper')).keyframes([
        { offset: 0, opacity: 0.99, transform: 'scale(1)' },
        { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  Vn = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s.addElement(e.querySelector('.line-loading__wrapper')).keyframes([
        { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
        { offset: 1, opacity: 1, transform: 'scale(1)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  Yn = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s.addElement(e.querySelector('.line-loading__wrapper')).keyframes([
        { offset: 0, opacity: 0.99, transform: 'scale(1)' },
        { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]),
      t.addElement(e).easing('ease-in-out').duration(200).addAnimation([i, s])
    );
  },
  { createComponent: qn, bem: Fn } = R('loading');
var Gn = qn({
  mixins: [ot(), An()],
  props: { message: String, spinner: String },
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? Vn : Hn)(t));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? Yn : Rn)(t));
      });
  },
  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },
  render() {
    const e = arguments[0],
      { message: t, spinner: i } = this;
    return e(
      'div',
      b([
        {
          directives: [{ name: 'show', value: this.visible }],
          attrs: { role: 'dialog', 'aria-modal': 'true' },
          class: Fn({ translucent: this.translucent }),
        },
        { on: this.$listeners },
      ]),
      [
        e(ht, { attrs: { visible: this.dim }, on: { tap: this.onTap } }),
        e('div', { attrs: { role: 'dialog' }, class: Fn('wrapper') }, [
          i &&
            e('div', { class: Fn('spinner') }, [e(Nn, { attrs: { type: i } })]),
          t && e('div', { class: Fn('content') }, [t]),
        ]),
      ]
    );
  },
});
const { createComponent: Xn, bem: Wn } = R('picker-column'),
  jn = (e, t, i) => Math.max(e, Math.min(t, i));
var _n = Xn({
  props: { col: Object },
  data: () => ({
    optHeight: 0,
    rotateFactor: 0,
    scaleFactor: 1,
    velocity: 0,
    y: 0,
    noAnimate: !0,
  }),
  async mounted() {
    let e = 0,
      t = 0.81;
    const { mode: i } = this,
      { optsEl: s } = this.$refs;
    (this.optsEl = s),
      'ios' === i && ((e = -0.46), (t = 1)),
      (this.rotateFactor = e),
      (this.scaleFactor = t),
      (this.gesture = Ie({
        el: this.$el,
        gestureName: 'picker-swipe',
        gesturePriority: 100,
        threshold: 0,
        onStart: (e) => this.onStart(e),
        onMove: (e) => this.onMove(e),
        onEnd: (e) => this.onEnd(e),
      })),
      this.gesture.enable(),
      (this.tmrId = setTimeout(() => {
        (this.noAnimate = !1), this.refresh(!0);
      }, 250)),
      s &&
        (this.optHeight = s.firstElementChild
          ? s.firstElementChild.clientHeight
          : 0),
      this.refresh();
  },
  methods: {
    colChanged() {
      this.refresh();
    },
    emitColChange() {
      this.$emit('colChange', this.col);
    },
    setSelected(e, t) {
      const i = e > -1 ? -e * this.optHeight : 0;
      (this.velocity = 0),
        cancelAnimationFrame(this.rafId),
        this.update(i, t, !0),
        this.emitColChange();
    },
    update(e, t, i) {
      if (!this.optsEl) return;
      let s = 0,
        n = 0;
      const { col: a, rotateFactor: r } = this,
        o = (a.selectedIndex = this.indexForY(-e)),
        l = 0 === t ? '' : `${t}ms`,
        d = `scale(${this.scaleFactor})`,
        { children: c } = this.optsEl;
      for (let i = 0; i < c.length; i++) {
        const h = c[i],
          p = a.options[i],
          u = i * this.optHeight + e;
        let m = '';
        if (0 !== r) {
          const e = u * r;
          Math.abs(e) <= 90
            ? ((s = 0), (n = 90), (m = `rotateX(${e}deg) `))
            : (s = -9999);
        } else (n = 0), (s = u);
        const f = o === i;
        (m += `translate3d(0px,${s}px,${n}px) `),
          1 === this.scaleFactor || f || (m += d),
          this.noAnimate
            ? ((p.duration = 0), (h.style.transitionDuration = ''))
            : t !== p.duration &&
              ((p.duration = t), (h.style.transitionDuration = l)),
          m !== p.transform && ((p.transform = m), (h.style.transform = m)),
          f !== p.selected &&
            ((p.selected = f),
            f
              ? h.classList.add('line-picker-column__opt--selected')
              : h.classList.remove('line-picker-column__opt--selected'));
      }
      (this.col.prevSelected = o),
        i && (this.y = e),
        this.lastIndex !== o && (this.lastIndex = o);
    },
    decelerate() {
      if (0 !== this.velocity) {
        (this.velocity *= 0.97),
          (this.velocity =
            this.velocity > 0
              ? Math.max(this.velocity, 1)
              : Math.min(this.velocity, -1));
        let e = this.y + this.velocity;
        e > this.minY
          ? ((e = this.minY), (this.velocity = 0))
          : e < this.maxY && ((e = this.maxY), (this.velocity = 0)),
          this.update(e, 0, !0),
          Math.round(e) % this.optHeight != 0 || Math.abs(this.velocity) > 1
            ? (this.rafId = requestAnimationFrame(() => this.decelerate()))
            : ((this.velocity = 0), this.emitColChange());
      } else if (this.y % this.optHeight != 0) {
        const e = Math.abs(this.y % this.optHeight);
        (this.velocity = e > this.optHeight / 2 ? 1 : -1), this.decelerate();
      }
    },
    indexForY(e) {
      return Math.min(
        Math.max(Math.abs(Math.round(e / this.optHeight)), 0),
        this.col.options.length - 1
      );
    },
    onStart(e) {
      e.event.preventDefault(),
        e.event.stopPropagation(),
        cancelAnimationFrame(this.rafId);
      const { options: t } = this.col;
      let i = t.length - 1,
        s = 0;
      for (let e = 0; e < t.length; e++)
        t[e].disabled || ((i = Math.min(i, e)), (s = Math.max(s, e)));
      (this.minY = -i * this.optHeight), (this.maxY = -s * this.optHeight);
    },
    onMove(e) {
      e.event.preventDefault(), e.event.stopPropagation();
      let t = this.y + e.deltaY;
      t > this.minY
        ? ((t **= 0.8), (this.bounceFrom = t))
        : t < this.maxY
        ? ((t += (this.maxY - t) ** 0.9), (this.bounceFrom = t))
        : (this.bounceFrom = 0),
        this.update(t, 0, !1);
    },
    onEnd(e) {
      if (this.bounceFrom > 0)
        return this.update(this.minY, 100, !0), void this.emitColChange();
      if (this.bounceFrom < 0)
        return this.update(this.maxY, 100, !0), void this.emitColChange();
      if (
        ((this.velocity = jn(-90, 23 * e.velocityY, 90)),
        0 === this.velocity && 0 === e.deltaY)
      ) {
        const t = e.event.target.closest('.picker-opt');
        t &&
          t.hasAttribute('opt-index') &&
          this.setSelected(parseInt(t.getAttribute('opt-index'), 10), 150);
      } else {
        if (((this.y += e.deltaY), Math.abs(e.velocityY) < 0.05)) {
          const t = e.deltaY > 0,
            i = (Math.abs(this.y) % this.optHeight) / this.optHeight;
          t && i > 0.5
            ? (this.velocity = -1 * Math.abs(this.velocity))
            : !t && i <= 0.5 && (this.velocity = Math.abs(this.velocity));
        }
        this.decelerate();
      }
    },
    refresh(e) {
      let t = this.col.options.length - 1,
        i = 0;
      const { options: s } = this.col;
      for (let e = 0; e < s.length; e++)
        s[e].disabled || ((t = Math.min(t, e)), (i = Math.max(i, e)));
      if (0 !== this.velocity) return;
      const n = jn(t, this.col.selectedIndex || 0, i);
      if (this.col.prevSelected !== n || e) {
        const e = n * this.optHeight * -1;
        (this.velocity = 0), this.update(e, 150, !0);
      }
    },
  },
  watch: {
    col() {
      this.colChanged();
    },
  },
  render() {
    const e = arguments[0],
      { col: t } = this;
    return e(
      'div',
      {
        class: Wn({
          col: !0,
          'opts-left': 'left' === t.align,
          'opts-right': 'right' === t.align,
        }),
        style: { 'max-width': this.col.columnWidth },
      },
      [
        t.prefix &&
          e('div', { class: Wn('prefix'), style: { width: t.prefixWidth } }, [
            t.prefix,
          ]),
        e(
          'div',
          {
            class: Wn('opts'),
            style: { maxWidth: t.optionsWidth },
            ref: 'optsEl',
          },
          [
            t.options.map((t, i) =>
              e(
                'button',
                {
                  attrs: { type: 'button', 'opt-index': i },
                  class: Wn('opt', { disabled: !!t.disabled }),
                },
                [t.text]
              )
            ),
          ]
        ),
        t.suffix &&
          e('div', { class: Wn('suffix'), style: { width: t.suffixWidth } }, [
            t.suffix,
          ]),
      ]
    );
  },
});
const { createComponent: Un, bem: Kn } = R('picker'),
  Jn = (e) => ({
    [`line-picker__toolbar-${e.role}`]: void 0 !== e.role,
    'line-picker__toolbar-button': !0,
  });
var Zn = Un({
  mixins: [ot()],
  props: {
    overlayIndex: Number,
    keyboardClose: { type: Boolean, default: !0 },
    buttons: Array,
    columns: Array,
    cssClass: Array,
    duration: { type: Number, default: 0 },
    showBackdrop: { type: Boolean, default: !0 },
    backdropDismiss: { type: Boolean, default: !0 },
    animated: { type: Boolean, default: !0 },
  },
  data: () => ({ presented: !0 }),
  beforeMount() {
    this.$on('animation-enter', (e, t) => {
      t(
        ((e) => {
          const t = it(),
            i = it(),
            s = it();
          return (
            i
              .addElement(e.querySelector('.line-overlay'))
              .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
            s
              .addElement(e.querySelector('.line-picker__wrapper'))
              .fromTo('transform', 'translateY(100%)', 'translateY(0%)'),
            t
              .addElement(e)
              .easing('cubic-bezier(.36,.66,.04,1)')
              .duration(400)
              .addAnimation([i, s])
          );
        })(e)
      );
    }),
      this.$on('animation-leave', (e, t) => {
        t(
          ((e) => {
            const t = it(),
              i = it(),
              s = it();
            return (
              i
                .addElement(e.querySelector('.line-overlay'))
                .fromTo('opacity', 'var(--backdrop-opacity)', 0.01),
              s
                .addElement(e.querySelector('.line-picker__wrapper'))
                .fromTo('transform', 'translateY(0%)', 'translateY(100%)'),
              t
                .addElement(e)
                .easing('cubic-bezier(.36,.66,.04,1)')
                .duration(400)
                .addAnimation([i, s])
            );
          })(e)
        );
      });
  },
  methods: {
    async buttonClick(e) {
      const { role: t } = e;
      return 'cancel' === t
        ? this.close(t)
        : (await this.callButtonHandler(e))
        ? this.close(e.role)
        : Promise.resolve();
    },
    async callButtonHandler(e) {
      if (e)
        try {
          if (!1 === (await h(e.handler, this.getSelected()))) return !1;
        } catch (e) {}
      return !0;
    },
    getSelected() {
      const e = {};
      return (
        this.columns.forEach((t, i) => {
          const s =
            void 0 !== t.selectedIndex ? t.options[t.selectedIndex] : void 0;
          e[t.name] = {
            text: s ? s.text : void 0,
            value: s ? s.value : void 0,
            columnIndex: i,
          };
        }),
        e
      );
    },
    onTap() {
      this.$emit('overlay-tap');
    },
    colChange(e) {
      this.$emit('colChange', e);
    },
  },
  render() {
    const e = arguments[0],
      {
        mode: t,
        overlayIndex: i,
        showBackdrop: s,
        backdropDismiss: n,
        visible: a,
        columns: r,
      } = this;
    return e(
      'div',
      {
        attrs: { 'aria-modal': 'true' },
        directives: [{ name: 'show', value: a }],
        class: [Kn({ mode: !0 }), { [`picker-${t}`]: !0 }],
        style: { zIndex: `${2e4 + i}` },
      },
      [
        e(ht, { attrs: { visible: s, tappable: n }, on: { tap: this.onTap } }),
        e('div', { class: Kn('wrapper'), attrs: { role: 'dialog' } }, [
          e('div', { class: Kn('toolbar') }, [
            this.buttons.map((t) =>
              e('div', { class: Jn(t) }, [
                e(
                  'button',
                  {
                    attrs: { type: 'button' },
                    on: { click: () => this.buttonClick(t) },
                    class: [Kn('button'), { 'line-activatable': !0 }],
                  },
                  [t.text]
                ),
              ])
            ),
          ]),
          e('div', { class: Kn('columns') }, [
            e('div', { class: Kn('above-highlight') }),
            a &&
              r.map((t) =>
                e(_n, { on: { colChange: this.colChange }, attrs: { col: t } })
              ),
            e('div', { class: Kn('below-highlight') }),
          ]),
        ]),
      ]
    );
  },
});
const Qn = (e, t) => {
    let i = 'top',
      s = 'left';
    const n = e.querySelector('.line-popover__content'),
      a = n.getBoundingClientRect(),
      r = a.width,
      o = a.height,
      l = e.ownerDocument.defaultView.innerWidth,
      d = e.ownerDocument.defaultView.innerHeight,
      c = t && t.target && t.target.getBoundingClientRect(),
      h = null != c && 'top' in c ? c.top : d / 2 - o / 2,
      p = null != c && 'left' in c ? c.left : l / 2,
      u = (c && c.width) || 0,
      m = (c && c.height) || 0,
      f = e.querySelector('.line-popover__arrow'),
      g = f.getBoundingClientRect(),
      v = g.width,
      b = g.height;
    null == c && (f.style.display = 'none');
    const y = { top: h + m, left: p + u / 2 - v / 2 },
      w = { top: h + m + (b - 1), left: p + u / 2 - r / 2 };
    let x = !1,
      S = !1;
    w.left < 30
      ? ((x = !0), (w.left = 5))
      : r + 5 + w.left + 25 > l &&
        ((S = !0), (w.left = l - r - 5), (s = 'right')),
      h + m + o > d && h - o > 0
        ? ((y.top = h - (b + 1)),
          (w.top = h - o - (b - 1)),
          (e.className += ' line-popover--bottom'),
          (i = 'bottom'))
        : h + m + o > d && (n.style.bottom = '5%'),
      (f.style.top = `${y.top}px`),
      (f.style.left = `${y.left}px`),
      (n.style.top = `${w.top}px`),
      (n.style.left = `${w.left}px`),
      x &&
        (n.style.left = `calc(${w.left}px + var(--line-safe-area-left, 0px))`),
      S &&
        (n.style.left = `calc(${w.left}px - var(--line-safe-area-right, 0px))`),
      (n.style.transformOrigin = `${i} ${s}`);
    const E = it(),
      T = it(),
      $ = it();
    return (
      T.addElement(e.querySelector('.line-overlay')).fromTo(
        'opacity',
        0.01,
        'var(--backdrop-opacity)'
      ),
      $.addElement(e.querySelector('.line-popover__wrapper')).fromTo(
        'opacity',
        0.01,
        1
      ),
      E.addElement(e).easing('ease').duration(100).addAnimation([T, $])
    );
  },
  ea = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(e.querySelector('.line-popover__wrapper'))
        .fromTo('opacity', 0.99, 0),
      t.addElement(e).easing('ease').duration(500).addAnimation([i, s])
    );
  },
  ta = (e, t) => {
    const i = e.ownerDocument,
      s = 'rtl' === i.dir;
    let n = 'top',
      a = s ? 'right' : 'left';
    const r = e.querySelector('.line-popover__content'),
      o = r.getBoundingClientRect(),
      l = o.width,
      d = o.height,
      c = i.defaultView.innerWidth,
      h = i.defaultView.innerHeight,
      p = t && t.target && t.target.getBoundingClientRect(),
      u = null != p && 'bottom' in p ? p.bottom : h / 2 - d / 2,
      m = (p && p.height) || 0,
      f = {
        top: u,
        left:
          null != p && 'left' in p
            ? s
              ? p.left - l + p.width
              : p.left
            : c / 2 - l / 2,
      };
    f.left < 12
      ? ((f.left = 12), (a = 'left'))
      : l + 12 + f.left > c && ((f.left = c - l - 12), (a = 'right')),
      u + m + d > h && u - d > 0
        ? ((f.top = u - d - m),
          (e.className += ' line-popover--bottom'),
          (n = 'bottom'))
        : u + m + d > h && (r.style.bottom = '12px');
    const g = it(),
      v = it(),
      b = it(),
      y = it(),
      w = it();
    return (
      v
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      b
        .addElement(e.querySelector('.line-popover__wrapper'))
        .fromTo('opacity', 0.01, 1),
      y
        .addElement(r)
        .beforeStyles({
          top: `${f.top}px`,
          left: `${f.left}px`,
          'transform-origin': `${n} ${a}`,
        })
        .fromTo('transform', 'scale(0.01)', 'scale(1)'),
      w
        .addElement(e.querySelector('.popover-viewport'))
        .fromTo('opacity', 0.01, 1),
      g
        .addElement(e)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(300)
        .addAnimation([v, b, y, w])
    );
  },
  ia = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(e.querySelector('.line-popover__wrapper'))
        .fromTo('opacity', 0.99, 0),
      t.addElement(e).easing('ease').duration(500).addAnimation([i, s])
    );
  },
  { createComponent: sa, bem: na } = R('popover');
var aa = sa({
  mixins: [ot()],
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? ta : Qn)(t, this.event));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? ia : ea)(t));
      });
  },
  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },
  render() {
    const e = arguments[0];
    return e(
      'div',
      b([
        {
          directives: [{ name: 'show', value: this.visible }],
          attrs: { 'aria-modal': 'true' },
          class: na({ translucent: this.translucent }),
        },
        { on: this.$listeners },
      ]),
      [
        e(ht, { attrs: { visible: this.dim }, on: { tap: this.onTap } }),
        e('div', { class: na('wrapper') }, [
          e('div', { class: na('arrow') }),
          e('div', { class: na('content') }, [this.slots()]),
        ]),
      ]
    );
  },
});
const { createComponent: ra, bem: oa } = R('popup');
var la = ra({
  mixins: [ot()],
  render() {
    const e = arguments[0];
    return e(
      'div',
      {
        directives: [{ name: 'show', value: this.visible }],
        attrs: { 'aria-modal': 'true', role: 'dialog' },
        class: oa(),
      },
      [
        e(
          'div',
          { attrs: { role: 'dialog' }, class: oa('content'), ref: 'content' },
          [this.slots()]
        ),
      ]
    );
  },
});
const da = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s
        .addElement(e.querySelector('.line-popup__wrapper'))
        .beforeStyles({ opacity: 1 })
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)'),
      t
        .addElement(e)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .addAnimation([i, s])
    );
  },
  ca = (e) => {
    const t = it(),
      i = it(),
      s = it(),
      n = e.querySelector('.line-popup__wrapper'),
      a = n.getBoundingClientRect();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s
        .addElement(n)
        .beforeStyles({ opacity: 1 })
        .fromTo(
          'transform',
          'translateY(0%)',
          `translateY(${e.ownerDocument.defaultView.innerHeight - a.top}px)`
        ),
      t.addElement(e).easing('ease-out').duration(250).addAnimation([i, s])
    );
  },
  ha = (e) => {
    const t = it(),
      i = it(),
      s = it();
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)'),
      s.addElement(e.querySelector('.line-popup__wrapper')).keyframes([
        { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
        { offset: 1, opacity: 1, transform: 'translateY(0px)' },
      ]),
      t
        .addElement(e)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(280)
        .addAnimation([i, s])
    );
  },
  pa = (e) => {
    const t = it(),
      i = it(),
      s = it(),
      n = e.querySelector('.line-popup__wrapper');
    return (
      i
        .addElement(e.querySelector('.line-overlay'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0),
      s.addElement(n).keyframes([
        { offset: 0, opacity: 0.99, transform: 'translateY(0px)' },
        { offset: 1, opacity: 0, transform: 'translateY(40px)' },
      ]),
      t
        .addElement(e)
        .easing('cubic-bezier(0.47,0,0.745,0.715)')
        .duration(200)
        .addAnimation([i, s])
    );
  },
  { createComponent: ua, bem: ma } = R('popup');
var fa = ua({
  mixins: [ot()],
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? ha : da)(t));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? pa : ca)(t));
      });
  },
  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },
  render() {
    const e = arguments[0];
    return e(
      'div',
      b([
        {
          directives: [{ name: 'show', value: this.visible }],
          attrs: { 'aria-modal': 'true', role: 'dialog' },
          class: ma(),
        },
        { on: this.$listeners },
      ]),
      [
        e(ht, { on: { tap: this.onTap } }),
        e('div', { attrs: { role: 'dialog' }, class: ma('wrapper') }, [
          this.slots(),
        ]),
      ]
    );
  },
});
const ga = (e, t) => {
    const i = it(),
      s = it(),
      n = e.querySelector('.line-toast__wrapper');
    switch ((s.addElement(n), t)) {
      case 'top':
        s.fromTo(
          'transform',
          'translateY(-100%)',
          'translateY(calc(10px + var(--line-safe-area-top, 0px)))'
        );
        break;
      case 'middle':
        const t = Math.floor(e.clientHeight / 2 - n.clientHeight / 2);
        (n.style.top = `${t}px`), s.fromTo('opacity', 0.01, 1);
        break;
      default:
        s.fromTo(
          'transform',
          'translateY(100%)',
          'translateY(calc(-10px - var(--line-safe-area-bottom, 0px)))'
        );
    }
    return i
      .addElement(e)
      .easing('cubic-bezier(.155,1.105,.295,1.12)')
      .duration(400)
      .addAnimation(s);
  },
  va = (e, t) => {
    const i = it(),
      s = it(),
      n = e.querySelector('.line-toast__wrapper');
    switch ((s.addElement(n), t)) {
      case 'top':
        s.fromTo(
          'transform',
          'translateY(calc(10px + var(--line-safe-area-top, 0px)))',
          'translateY(-100%)'
        );
        break;
      case 'middle':
        s.fromTo('opacity', 0.99, 0);
        break;
      default:
        s.fromTo(
          'transform',
          'translateY(calc(-10px - var(--line-safe-area-bottom, 0px)))',
          'translateY(100%)'
        );
    }
    return i
      .addElement(e)
      .easing('cubic-bezier(.36,.66,.04,1)')
      .duration(300)
      .addAnimation(s);
  },
  ba = (e, t) => {
    const i = it(),
      s = it(),
      n = e.querySelector('.line-toast__wrapper');
    switch ((s.addElement(n), t)) {
      case 'top':
        (n.style.top = 'calc(8px + var(--line-safe-area-top, 0px))'),
          s.fromTo('opacity', 0.01, 1);
        break;
      case 'middle':
        const t = Math.floor(e.clientHeight / 2 - n.clientHeight / 2);
        (n.style.top = `${t}px`), s.fromTo('opacity', 0.01, 1);
        break;
      default:
        (n.style.bottom = 'calc(8px + var(--line-safe-area-bottom, 0px))'),
          s.fromTo('opacity', 0.01, 1);
    }
    return i
      .addElement(e)
      .easing('cubic-bezier(.36,.66,.04,1)')
      .duration(400)
      .addAnimation(s);
  },
  ya = (e) => {
    const t = it(),
      i = it(),
      s = e.querySelector('.line-toast__wrapper');
    return (
      i.addElement(s).fromTo('opacity', 0.99, 0),
      t
        .addElement(e)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(300)
        .addAnimation(i)
    );
  },
  { createComponent: wa, bem: xa } = R('toast'),
  Sa = (e) => ({
    'line-toast-button': !0,
    'line-toast-button--icon-only': void 0 !== e.icon && void 0 === e.text,
    [`line-toast-button--${e.role}`]: void 0 !== e.role,
    'line-focusable': !0,
    'line-activatable': !0,
  });
var Ea = wa({
  mixins: [ot(), An(), Gt()],
  props: { position: String, message: String, header: String, buttons: Array },
  methods: {
    getButtons() {
      return this.buttons
        ? this.buttons.map((e) => ('string' == typeof e ? { text: e } : e))
        : [];
    },
    async buttonClick(e) {
      const { role: t } = e;
      return 'cancel' === t
        ? this.close(t)
        : (await this.callButtonHandler(e))
        ? this.close(e.role)
        : Promise.resolve();
    },
    async callButtonHandler(e) {
      if (e)
        try {
          if (!1 === (await h(e.handler))) return !1;
        } catch (e) {}
      return !0;
    },
    dispatchCancelHandler(e) {
      const { role: t } = e.detail;
      if ('cancel' === t || 'overlay' === t) {
        const e = this.getButtons().find((e) => 'cancel' === e.role);
        this.callButtonHandler(e);
      }
    },
    renderButtons(e, t) {
      const i = this.$createElement;
      if (0 !== e.length)
        return i(
          'div',
          {
            class: {
              'line-toast-button-group': !0,
              [`line-toast-button-group--${t}`]: !0,
            },
          },
          [
            e.map((e) =>
              i(
                'button',
                {
                  attrs: { type: 'button', tabIndex: 0, part: 'button' },
                  class: Sa(e),
                  on: { click: () => this.buttonClick(e) },
                },
                [
                  i('div', { class: 'line-toast-button__inner' }, [
                    e.icon && d(e.icon)
                      ? i(ns, {
                          class: 'line-toast-icon',
                          slot: void 0 === e.text ? 'icon-only' : void 0,
                          attrs: {
                            name: e.icon.name || '',
                            src: e.icon.src || '',
                          },
                        })
                      : i(ns, {
                          class: 'line-toast-icon',
                          slot: void 0 === e.text ? 'icon-only' : void 0,
                          attrs: { name: e.icon },
                        }),
                    e.text,
                  ]),
                ]
              )
            ),
          ]
        );
    },
  },
  beforeMount() {
    const { mode: e } = this;
    this.$on('animation-enter', (t, i) => {
      i(('md' === e ? ba : ga)(t, this.position));
    }),
      this.$on('animation-leave', (t, i) => {
        i(('md' === e ? ya : va)(t, this.position));
      }),
      this.$on('opened', () => {
        this.duration > 0 &&
          (this.durationTimeout = setTimeout(
            () => this.close('timeout'),
            this.duration
          ));
      }),
      this.$on('aboutToHide', () => {
        this.durationTimeout && clearTimeout(this.durationTimeout);
      });
  },
  render() {
    const e = arguments[0],
      { position: t = 'bottom' } = this,
      i = this.getButtons(),
      s = i.filter((e) => 'start' === e.side),
      n = i.filter((e) => 'start' !== e.side);
    return e(
      'div',
      b([
        { directives: [{ name: 'show', value: this.visible }], class: [xa()] },
        { on: this.$listeners },
      ]),
      [
        e('div', { class: xa('wrapper', { [t]: !0 }) }, [
          e('div', { class: xa('container') }, [
            this.renderButtons(s, 'start'),
            e('div', { class: xa('content') }, [
              void 0 !== this.header &&
                e('div', { class: xa('header') }, [this.header]),
              e('div', {
                class: xa('message'),
                domProps: { innerHTML: this.message },
              }),
            ]),
            this.renderButtons(n, 'end'),
          ]),
        ]),
      ]
    );
  },
});
function Ta() {
  return O({
    props: { delay: { type: Number, default: 0 } },
    data() {
      return { delayedVisible: this.visible };
    },
    watch: {
      visible(e) {
        if (
          (this.appearTimer && clearTimeout(this.appearTimer),
          e === this.delayedVisible)
        )
          return;
        if (!e) return void (this.delayedVisible = e);
        const t = Math.max(this.delay, 0);
        this.appearTimer = setTimeout(() => (this.delayedVisible = e), t);
      },
    },
  });
}
function $a(e, t) {
  const { callback: i } = t,
    s = (e) => i(!0, e),
    n = (e) => i(!1, e),
    a = ie(e, 'mouseenter', s, t),
    r = ie(e, 'mouseleave', n, t),
    o = ie(e, 'focus', s, t),
    l = ie(e, 'blur', n, t);
  return {
    options: t,
    enter: s,
    leave: n,
    destroy: () => {
      a(), r(), o(), l();
    },
  };
}
function Ca(e, t) {
  const { value: i, modifiers: s } = t;
  i && (e.vHover = $a(e, { callback: i, passive: !0, ...s }));
}
function ka(e) {
  const { vHover: t } = e;
  t && (t.destroy(), delete e.vHover);
}
const Ma = J({
    name: 'hover',
    inserted: Ca,
    unbind: ka,
    update: function (e, t) {
      const { value: i, oldValue: s } = t;
      i !== s && (s && ka(e), Ca(e, t));
    },
  }),
  { createComponent: Ia, bem: Pa } = R('tooltip');
var Aa = Ia({
  mixins: [Gt(), ot({ disableScroll: !1 }), An(), Ta(), fs()],
  props: {
    text: String,
    placement: { type: String, default: 'top' },
    openOnHover: { type: Boolean, default: !0 },
  },
  watch: {
    trigger: 'createDirective',
    placement(e) {
      this.popper && this.popper.setOptions({ placement: e });
    },
  },
  beforeMount() {
    this.$on('animation-enter', (e, t) => {
      this.createPopper(),
        this.popper.update(),
        t(
          ((e) =>
            it()
              .addElement(e)
              .easing('ease')
              .duration(100)
              .fromTo('opacity', 0.01, 1))(e)
        );
    }),
      this.$on('animation-leave', (e, t) => {
        t(
          ((e) =>
            it()
              .addElement(e)
              .easing('ease')
              .duration(500)
              .fromTo('opacity', 0.99, 0))(e)
        );
      });
  },
  async mounted() {
    await this.$nextTick(), this.createDirective();
  },
  beforeDestroy() {
    this.popper && this.popper.destroy(), this.vHover && this.vHover.unbind();
  },
  methods: {
    createDirective() {
      this.vHover && this.vHover.unbind(),
        this.$triggerEl &&
          ((this.vHover = K(Ma, this.$triggerEl, { name: 'hover' })),
          this.vHover.inserted(this.onHover));
    },
    createPopper() {
      if (this.popper) return;
      const e = {
          getBoundingClientRect: () => this.$triggerEl.getBoundingClientRect(),
        },
        { $el: t, placement: i } = this;
      this.popper = wn(e, t, {
        placement: i,
        strategy: 'fixed',
        modifiers: [
          { name: 'offset', options: { offset: [0, 10] } },
          { name: 'preventOverflow', options: { altAxis: !0, padding: 10 } },
          { name: 'flip', options: { padding: 10 } },
        ],
      });
    },
    onHover(e) {
      this.openOnHover && (this.visible = e);
    },
  },
  render() {
    const e = arguments[0],
      { delayedVisible: t, text: i } = this;
    return e(
      'div',
      b([
        {
          directives: [{ name: 'show', value: t }],
          attrs: { role: 'tooltip' },
          class: Pa({ translucent: this.translucent }),
        },
        { on: this.$listeners },
      ]),
      [
        e('div', { class: Pa('arrow'), attrs: { 'data-popper-arrow': !0 } }),
        e('div', { class: Pa('content') }, [this.slots() || i]),
      ]
    );
  },
});
function Oa(t) {
  const i = (function (t) {
      const i = e.extend(t);
      return {
        create: (e, t = !0) =>
          new i({
            propsData: e,
            async mounted() {
              await this.$nextTick(), (this.destroyWhenClose = t);
              const { $el: e } = this;
              pe(e).appendChild(e);
            },
            beforeDestroy() {
              this.$el.remove();
            },
          }).$mount(),
      };
    })(t),
    s = () => Ee.findPopup((e) => !t.name || e.$options.name === t.name);
  return {
    create: (e, t) => i.create(e, t),
    close: (e) => {
      const t = s();
      t && t.close(e);
    },
    getTop: s,
  };
}
const Ba = Oa(xt),
  La = Oa(Mt),
  za = Oa(Gn),
  Da = Oa(Zn),
  Na = Oa(aa),
  Ha = Oa(fa),
  Ra = Oa(Ea),
  Va = Oa(Aa);
var Ya = Object.freeze({
  __proto__: null,
  ActionSheetController: Ba,
  AlertController: La,
  LoadingController: za,
  PickerController: Da,
  PopoverController: Na,
  PopupController: Ha,
  ToastController: Ra,
  TooltipController: Va,
});
const qa = (e, t, i, s) => {
    if (e !== hr && e !== pr) {
      if (e === Er)
        return void 0 !== i && void 0 !== i.hour
          ? i.hour < 12
            ? 'AM'
            : 'PM'
          : t
          ? t.toUpperCase()
          : '';
      if (e === Tr)
        return void 0 !== i && void 0 !== i.hour
          ? i.hour < 12
            ? 'am'
            : 'pm'
          : t || '';
      if (null == t) return '';
      if (e === rr || e === dr || e === ur || e === fr || e === yr || e === xr)
        return ir(t);
      if (e === ar) return nr(t);
      if (e === or) return (s.monthNames ? s.monthNames : Mr)[t - 1];
      if (e === lr) return (s.monthShortNames ? s.monthShortNames : Ir)[t - 1];
      if (e === vr || e === br) {
        if (0 === t) return '12';
        if ((t > 12 && (t -= 12), e === vr && t < 10)) return `0${t}`;
      }
      return t.toString();
    }
    try {
      return (
        (t = new Date(i.year, i.month - 1, i.day).getDay()),
        e === hr
          ? (s.dayNames ? s.dayNames : Cr)[t]
          : (s.dayShortNames ? s.dayShortNames : kr)[t]
      );
    } catch (e) {}
  },
  Fa = (e, t, i, s = 0, n = 0) =>
    parseInt(`1${nr(e)}${ir(t)}${ir(i)}${ir(s)}${ir(n)}`, 10),
  Ga = (e) => Fa(e.year, e.month, e.day, e.hour, e.minute),
  Xa = (e) => (e % 4 == 0 && e % 100 != 0) || e % 400 == 0,
  Wa = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
  ja = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
  _a = (e) => {
    let t = null;
    if (
      (null != e &&
        '' !== e &&
        ((t = ja.exec(e)),
        t
          ? (t.unshift(void 0, void 0), (t[2] = t[3] = void 0))
          : (t = Wa.exec(e))),
      null === t)
    )
      return;
    for (let e = 1; e < 8; e++)
      t[e] = void 0 !== t[e] ? parseInt(t[e], 10) : void 0;
    let i = 0;
    return (
      t[9] &&
        t[10] &&
        ((i = 60 * parseInt(t[10], 10)),
        t[11] && (i += parseInt(t[11], 10)),
        '-' === t[9] && (i *= -1)),
      {
        year: t[1],
        month: t[2],
        day: t[3],
        hour: t[4],
        minute: t[5],
        second: t[6],
        millisecond: t[7],
        tzOffset: i,
      }
    );
  },
  Ua = (e, t) => {
    const i = new Date(e.toLocaleString('en-US', { timeZone: 'utc' })),
      s = new Date(e.toLocaleString('en-US', { timeZone: t }));
    return i.getTime() - s.getTime();
  },
  Ka = (e, t, i) => {
    if (!t || 'string' == typeof t) {
      const e = ((e = '', t = '') => {
        null == e && (e = ''),
          (10 !== e.length && 7 !== e.length) || (e += ' ');
        const i =
            'string' == typeof e && e.length > 0 ? new Date(e) : new Date(),
          s = new Date(
            Date.UTC(
              i.getFullYear(),
              i.getMonth(),
              i.getDate(),
              i.getHours(),
              i.getMinutes(),
              i.getSeconds(),
              i.getMilliseconds()
            )
          );
        return t && t.length > 0 ? new Date(i.getTime() - Ua(s, t)) : s;
      })(t, i);
      Number.isNaN(e.getTime()) || (t = e.toISOString());
    }
    if (t && '' !== t)
      if ('string' == typeof t) {
        if ((t = _a(t))) return Object.assign(e, t), !0;
      } else {
        if (t.year || t.hour || t.month || t.day || t.minute || t.second) {
          t.ampm &&
            t.hour &&
            (t.hour.value =
              'pm' === t.ampm.value
                ? 12 === t.hour.value
                  ? 12
                  : t.hour.value + 12
                : 12 === t.hour.value
                ? 0
                : t.hour.value);
          for (const i of Object.keys(t)) e[i] = t[i].value;
          return !0;
        }
        if (t.ampm)
          return (
            (t.hour = {
              value: t.hour
                ? t.hour.value
                : 'pm' === t.ampm.value
                ? e.hour < 12
                  ? e.hour + 12
                  : e.hour
                : e.hour >= 12
                ? e.hour - 12
                : e.hour,
            }),
            (e.hour = t.hour.value),
            !0
          );
      }
    else for (const t in e) e.hasOwnProperty(t) && delete e[t];
    return e;
  },
  Ja = (e, t) =>
    t === Er || t === Tr
      ? e.hour < 12
        ? 'am'
        : 'pm'
      : t === vr || t === br
      ? e.hour > 12
        ? e.hour - 12
        : 0 === e.hour
        ? 12
        : e.hour
      : e[Za(t)],
  Za = (e) => {
    for (const t in $r) if ($r[t].f === e) return $r[t].k;
  },
  Qa = (e) => {
    let t = '';
    return (
      void 0 !== e.year
        ? ((t = nr(e.year)),
          void 0 !== e.month &&
            ((t += `-${ir(e.month)}`),
            void 0 !== e.day &&
              ((t += `-${ir(e.day)}`),
              void 0 !== e.hour &&
                ((t += `T${ir(e.hour)}:${ir(e.minute)}:${ir(e.second)}`),
                e.millisecond > 0 && (t += `.${sr(e.millisecond)}`),
                (t +=
                  void 0 === e.tzOffset
                    ? 'Z'
                    : `${
                        (e.tzOffset > 0 ? '+' : '-') +
                        ir(Math.floor(Math.abs(e.tzOffset / 60)))
                      }:${ir(e.tzOffset % 60)}`)))))
        : void 0 !== e.hour &&
          ((t = `${ir(e.hour)}:${ir(e.minute)}`),
          void 0 !== e.second &&
            ((t += `:${ir(e.second)}`),
            void 0 !== e.millisecond && (t += `.${sr(e.millisecond)}`))),
      t
    );
  },
  er = (e, t) => {
    if (null == e) return;
    let i;
    return (
      'string' == typeof e && (e = e.replace(/\[|\]/g, '').split(',')),
      Array.isArray(e) && (i = e.map((e) => e.toString().trim())),
      i
    );
  },
  tr = (e, t) => {
    let i;
    return (
      'string' == typeof e && (e = e.replace(/\[|\]|\s/g, '').split(',')),
      (i = Array.isArray(e)
        ? e.map((e) => parseInt(e, 10)).filter(isFinite)
        : [e]),
      i
    );
  },
  ir = (e) => `0${void 0 !== e ? Math.abs(e) : '0'}`.slice(-2),
  sr = (e) => `00${void 0 !== e ? Math.abs(e) : '0'}`.slice(-3),
  nr = (e) => `000${void 0 !== e ? Math.abs(e) : '0'}`.slice(-4),
  ar = 'YYYY',
  rr = 'YY',
  or = 'MMMM',
  lr = 'MMM',
  dr = 'MM',
  cr = 'M',
  hr = 'DDDD',
  pr = 'DDD',
  ur = 'DD',
  mr = 'D',
  fr = 'HH',
  gr = 'H',
  vr = 'hh',
  br = 'h',
  yr = 'mm',
  wr = 'm',
  xr = 'ss',
  Sr = 's',
  Er = 'A',
  Tr = 'a',
  $r = [
    { f: ar, k: 'year' },
    { f: or, k: 'month' },
    { f: hr, k: 'day' },
    { f: lr, k: 'month' },
    { f: pr, k: 'day' },
    { f: rr, k: 'year' },
    { f: dr, k: 'month' },
    { f: ur, k: 'day' },
    { f: fr, k: 'hour' },
    { f: vr, k: 'hour' },
    { f: yr, k: 'minute' },
    { f: xr, k: 'second' },
    { f: cr, k: 'month' },
    { f: mr, k: 'day' },
    { f: gr, k: 'hour' },
    { f: br, k: 'hour' },
    { f: wr, k: 'minute' },
    { f: Sr, k: 'second' },
    { f: Er, k: 'ampm' },
    { f: Tr, k: 'ampm' },
  ],
  Cr = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  kr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  Mr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  Ir = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  Pr = [vr, br, yr, wr, xr, Sr],
  { createComponent: Ar, bem: Or } = R('datetime');
let Br = 0;
var Lr = Ar({
  mixins: [U('dateValue')],
  inject: { Item: { default: void 0 } },
  props: {
    name: String,
    disabled: Boolean,
    readonly: Boolean,
    min: String,
    max: String,
    displayFormat: { type: String, default: 'MMM D, YYYY' },
    displayTimezone: String,
    pickerFormat: String,
    cancelText: { type: String, default: 'Cancel' },
    doneText: { type: String, default: 'Done' },
    yearValues: [Array, Number, String],
    monthValues: [Array, Number, String],
    dayValues: [Array, Number, String],
    hourValues: [Array, Number, String],
    minuteValues: [Array, Number, String],
    monthNames: [Array, String],
    monthShortNames: [Array, String],
    dayNames: [Array, String],
    dayShortNames: [Array, String],
    pickerOptions: Object,
    placeholder: String,
  },
  data: () => ({
    isExpanded: !1,
    dateMax: '',
    dateMin: '',
    inputId: `line-dt-${Br++}`,
    locale: {},
    inItem: !1,
  }),
  computed: {
    text() {
      if (null != this.dateValue && 0 !== this.dateValue.length)
        return ((e, t, i) => {
          if (void 0 === t) return;
          const s = [];
          let n = !1;
          if (
            ($r.forEach((a, r) => {
              if (e.indexOf(a.f) > -1) {
                const o = `{${r}}`,
                  l = qa(a.f, t[a.k], t, i);
                n || void 0 === l || null == t[a.k] || (n = !0),
                  s.push(o, l || ''),
                  (e = e.replace(a.f, o));
              }
            }),
            n)
          ) {
            for (let t = 0; t < s.length; t += 2) e = e.replace(s[t], s[t + 1]);
            return e;
          }
        })(
          this.displayFormat || this.pickerFormat || 'MMM D, YYYY',
          this.datetimeValue,
          this.locale
        );
    },
  },
  beforeMount() {
    const { min: e, max: t } = this;
    (this.dateMin = e),
      (this.dateMax = t),
      (this.datetimeMin = {}),
      (this.datetimeMax = {}),
      (this.datetimeValue = {});
    const i = this.monthShortNames,
      s = this.dayNames,
      n = this.dayShortNames;
    (this.locale = {
      monthNames: er(this.monthNames),
      monthShortNames: er(i),
      dayNames: er(s),
      dayShortNames: er(n),
    }),
      this.updateDatetimeValue(this.dateValue),
      this.emitStyle();
  },
  mounted() {
    const { buttonEl: e } = this.$refs;
    (this.inItem = null !== this.$el.closest('.line-item')),
      (this.buttonEl = e);
  },
  methods: {
    async open() {
      if (this.disabled || this.isExpanded) return;
      const e = this.generatePickerOptions(),
        t = Da,
        i = await t.create(e);
      (this.isExpanded = !0),
        i.$on('opened', () => {
          this.$emit('opened');
        }),
        i.$on('closed', () => {
          (this.isExpanded = !1), this.setFocus(), this.$emit('closed');
        }),
        i.$on('colChange', (e) => {
          const t = {};
          (t[e.name] = { value: e.options[e.selectedIndex].value }),
            this.updateDatetimeValue(t),
            (i.columns = this.generateColumns());
        }),
        await i.open();
    },
    emitStyle() {
      this.Item &&
        this.Item.itemStyle('datetime', {
          interactive: !0,
          datetime: !0,
          'has-placeholder': null != this.placeholder,
          'has-value': this.hasValue(),
          'interactive-disabled': this.disabled,
        });
    },
    updateDatetimeValue(e) {
      Ka(this.datetimeValue, e, this.displayTimezone);
    },
    generatePickerOptions() {
      const { mode: e } = this,
        t = { mode: e, ...this.pickerOptions, columns: this.generateColumns() },
        { buttons: i } = t;
      return (
        (i && 0 !== i.length) ||
          (t.buttons = [
            {
              text: this.cancelText,
              role: 'cancel',
              handler: () => {
                this.updateDatetimeValue(this.dateValue), this.$emit('cancel');
              },
            },
            {
              text: this.doneText,
              handler: (e) => {
                this.updateDatetimeValue(e);
                const t = new Date(Qa(this.datetimeValue));
                (this.datetimeValue.tzOffset =
                  void 0 !== this.displayTimezone &&
                  this.displayTimezone.length > 0
                    ? (Ua(t, this.displayTimezone) / 1e3 / 60) * -1
                    : -1 * t.getTimezoneOffset()),
                  (this.dateValue = Qa(this.datetimeValue));
              },
            },
          ]),
        t
      );
    },
    generateColumns() {
      let e = this.pickerFormat || this.displayFormat || 'MMM D, YYYY';
      if (0 === e.length) return [];
      this.calcMinMax(),
        (e = e.replace('DDDD', '{~}').replace('DDD', '{~}')),
        -1 === e.indexOf('D') && (e = e.replace('{~}', 'D')),
        (e = e.replace(/{~}/g, ''));
      const t = ((e) => {
          const t = [];
          (e = e.replace(/[^\w\s]/gi, ' ')),
            $r.forEach((t) => {
              t.f.length > 1 &&
                e.indexOf(t.f) > -1 &&
                e.indexOf(t.f + t.f.charAt(0)) < 0 &&
                (e = e.replace(t.f, ` ${t.f} `));
            });
          const i = e.split(' ').filter((e) => e.length > 0);
          return (
            i.forEach((e, s) => {
              $r.forEach((n) => {
                if (e === n.f) {
                  if (
                    (e === Er || e === Tr) &&
                    ((t.indexOf(br) < 0 && t.indexOf(vr) < 0) ||
                      -1 === Pr.indexOf(i[s - 1]))
                  )
                    return;
                  t.push(e);
                }
              });
            }),
            t
          );
        })(e).map((e) => {
          const t = Za(e);
          let i;
          i = this[`${t}Values`]
            ? tr(this[`${t}Values`])
            : ((e, t, i) => {
                const s = [];
                if (e === ar || e === rr) {
                  if (void 0 === i.year || void 0 === t.year)
                    throw new Error('min and max year is undefined');
                  for (let e = i.year; e >= t.year; e--) s.push(e);
                } else if (
                  e === or ||
                  e === lr ||
                  e === dr ||
                  e === cr ||
                  e === vr ||
                  e === br
                )
                  for (let e = 1; e < 13; e++) s.push(e);
                else if (e === hr || e === pr || e === ur || e === mr)
                  for (let e = 1; e < 32; e++) s.push(e);
                else if (e === fr || e === gr)
                  for (let e = 0; e < 24; e++) s.push(e);
                else if (e === yr || e === wr)
                  for (let e = 0; e < 60; e++) s.push(e);
                else if (e === xr || e === Sr)
                  for (let e = 0; e < 60; e++) s.push(e);
                else (e !== Er && e !== Tr) || s.push('am', 'pm');
                return s;
              })(e, this.datetimeMin, this.datetimeMax);
          const s = i.map((t) => ({
              value: t,
              text: qa(e, t, void 0, this.locale),
            })),
            n = ((e, t) => {
              const i = Ja(e, t);
              if (void 0 !== i) return i;
              const s = _a(new Date().toISOString());
              return Ja(s, t);
            })(this.datetimeValue, e),
            a = s.findIndex((e) => e.value === n);
          return { name: t, selectedIndex: a >= 0 ? a : 0, options: s };
        }),
        i = this.datetimeMin,
        s = this.datetimeMax;
      return (
        ['month', 'day', 'hour', 'minute']
          .filter((e) => !t.find((t) => t.name === e))
          .forEach((e) => {
            (i[e] = 0), (s[e] = 0);
          }),
        this.validateColumns(
          ((e) => {
            const t = [];
            let i, s;
            for (let n = 0; n < e.length; n++) {
              (i = e[n]), t.push(0);
              for (const e of i.options)
                (s = e.text.length), s > t[n] && (t[n] = s);
            }
            return (
              2 === t.length
                ? ((s = Math.max(t[0], t[1])),
                  (e[0].align = 'right'),
                  (e[1].align = 'left'),
                  (e[0].optionsWidth = e[1].optionsWidth = `${17 * s}px`))
                : 3 === t.length &&
                  ((s = Math.max(t[0], t[2])),
                  (e[0].align = 'right'),
                  (e[1].columnWidth = `${17 * t[1]}px`),
                  (e[0].optionsWidth = e[2].optionsWidth = `${17 * s}px`),
                  (e[2].align = 'left')),
              e
            );
          })(t)
        )
      );
    },
    validateColumns(e) {
      const t = new Date(),
        i = Ga(this.datetimeMin),
        s = Ga(this.datetimeMax),
        n = e.find((e) => 'year' === e.name);
      let a = t.getFullYear();
      if (n) {
        n.options.find((e) => e.value === t.getFullYear()) ||
          (a = n.options[0].value);
        const { selectedIndex: e } = n;
        if (void 0 !== e) {
          const t = n.options[e];
          t && (a = t.value);
        }
      }
      const r = this.validateColumn(
          e,
          'month',
          1,
          i,
          s,
          [a, 0, 0, 0, 0],
          [a, 12, 31, 23, 59]
        ),
        o =
          ((d = a),
          4 === (l = r) || 6 === l || 9 === l || 11 === l
            ? 30
            : 2 === l
            ? Xa(d)
              ? 29
              : 28
            : 31);
      var l, d;
      const c = this.validateColumn(
          e,
          'day',
          2,
          i,
          s,
          [a, r, 0, 0, 0],
          [a, r, o, 23, 59]
        ),
        h = this.validateColumn(
          e,
          'hour',
          3,
          i,
          s,
          [a, r, c, 0, 0],
          [a, r, c, 23, 59]
        );
      return (
        this.validateColumn(
          e,
          'minute',
          4,
          i,
          s,
          [a, r, c, h, 0],
          [a, r, c, h, 59]
        ),
        e
      );
    },
    calcMinMax() {
      const e = new Date().getFullYear();
      if (void 0 !== this.yearValues) {
        const e = tr(this.yearValues);
        void 0 === this.dateMin && (this.dateMin = Math.min(...e).toString()),
          void 0 === this.dateMax && (this.dateMax = Math.max(...e).toString());
      } else
        void 0 === this.dateMin && (this.dateMin = (e - 100).toString()),
          void 0 === this.dateMax && (this.dateMax = e.toString());
      const t = (this.datetimeMin = _a(this.dateMin)),
        i = (this.datetimeMax = _a(this.dateMax));
      (t.year = t.year || e),
        (i.year = i.year || e),
        (t.month = t.month || 1),
        (i.month = i.month || 12),
        (t.day = t.day || 1),
        (i.day = i.day || 31),
        (t.hour = t.hour || 0),
        (i.hour = void 0 === i.hour ? 23 : i.hour),
        (t.minute = t.minute || 0),
        (i.minute = void 0 === i.minute ? 59 : i.minute),
        (t.second = t.second || 0),
        (i.second = void 0 === i.second ? 59 : i.second),
        t.year > i.year && (t.year = i.year - 100),
        t.year === i.year &&
          (t.month > i.month
            ? (t.month = 1)
            : t.month === i.month && t.day > i.day && (t.day = 1));
    },
    validateColumn(e, t, i, s, n, a, r) {
      const o = e.find((e) => e.name === t);
      if (!o) return 0;
      const l = a.slice(),
        d = r.slice(),
        { options: c } = o;
      let h = c.length - 1,
        p = 0;
      for (let e = 0; e < c.length; e++) {
        const t = c[e],
          { value: o } = t;
        (l[i] = t.value),
          (d[i] = t.value),
          (t.disabled =
            o < a[i] ||
            o > r[i] ||
            Fa(d[0], d[1], d[2], d[3], d[4]) < s ||
            Fa(l[0], l[1], l[2], l[3], l[4]) > n) ||
            ((h = Math.min(h, e)), (p = Math.max(p, e)));
      }
      const u = (o.selectedIndex = ((e, t, i) => Math.max(e, Math.min(t, i)))(
          h,
          o.selectedIndex,
          p
        )),
        m = o.options[u];
      return m ? m.value : 0;
    },
    hasValue() {
      return void 0 !== this.text;
    },
    setFocus() {
      this.buttonEl && this.buttonEl.focus();
    },
    onClick() {
      this.setFocus(), this.open();
    },
    onFocus() {
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
  },
  watch: {
    checked() {
      this.emitStyle();
    },
    disabled() {
      this.emitStyle();
    },
  },
  render() {
    const e = arguments[0],
      {
        inputId: t,
        text: i,
        disabled: s,
        readonly: n,
        isExpanded: a,
        $el: r,
        placeholder: o,
        inItem: l,
      } = this,
      d = `${t}-lbl`,
      c = ((e) => {
        const t = e && e.closest('.line-item');
        return t ? t.querySelector('.line-label') : null;
      })(r),
      h = !(void 0 !== i || null == o),
      p = void 0 === i ? (null != o ? o : '') : i;
    return (
      c && (c.id = d),
      e(
        'div',
        {
          on: { click: this.onClick },
          attrs: {
            role: 'combobox',
            'aria-disabled': s ? 'true' : null,
            'aria-expanded': `${a}`,
            'aria-haspopup': 'true',
            'aria-labelledby': d,
          },
          class: [
            Or({ disabled: s, readonly: n, placeholder: h }),
            { 'in-item': l },
          ],
        },
        [
          e('div', { class: Or('text') }, [p]),
          e('button', {
            attrs: { type: 'button', disabled: this.disabled },
            on: { focus: this.onFocus, blur: this.onBlur },
            ref: 'buttonEl',
          }),
        ]
      )
    );
  },
});
const { createComponent: zr, bem: Dr } = R('fab-group');
var Nr = zr({
  mixins: [Jt('FabGroup'), W('visible'), U('visible')],
  props: {
    transition: null,
    exclusive: { type: Boolean, default: !0 },
    side: String,
  },
  beforeMount() {
    this.visible = this.inited =
      this.visible || (c(this.$attrs.visible) && !1 !== this.$attrs.visible);
  },
  render() {
    const e = arguments[0],
      { side: t = 'bottom' } = this,
      i = d(this.transition)
        ? this.transition
        : { name: this.transition || 'line-scale' };
    return e(
      'transition-group',
      b([
        {
          props: { ...i },
          attrs: { tag: 'div', appear: !0 },
          class: Dr({ [`side-${t}`]: !0 }),
        },
        { on: this.$listeners },
      ]),
      [
        this.visible &&
          this.slots('default', { side: t }, (e) => ({
            key: e,
            style: { animationDelay: `${0.03 * e}s` },
          })),
      ]
    );
  },
});
const { createComponent: Hr, bem: Rr } = R('fab'),
  Vr = ['start', 'end', 'top', 'bottom'];
var Yr = Hr({
  mixins: [U('activated'), vs()],
  provide() {
    return { FAB: this };
  },
  props: { horizontal: String, vertical: String, edge: Boolean },
  beforeMount() {
    this.$on('clickoutside', () => {
      this.activated = !1;
    }),
      (this.activated =
        this.activated ||
        (c(this.$attrs.activated) && !1 !== this.$attrs.activated));
  },
  methods: {
    toggle() {
      this.activated = !this.activated;
    },
  },
  render() {
    const e = arguments[0],
      {
        horizontal: t = 'start',
        vertical: i = 'top',
        edge: s,
        activated: n,
      } = this;
    return e(
      'div',
      b([
        {
          class: Rr({
            [`horizontal-${t}`]: c(t),
            [`vertical-${i}`]: c(i),
            edge: s,
          }),
        },
        { on: this.$listeners },
      ]),
      [
        this.slots(
          'indicator',
          { activated: n },
          { on: { click: this.toggle } }
        ),
        Vr.map(
          (t) =>
            this.hasSlot(t) &&
            e(
              Nr,
              {
                attrs: { side: t },
                on: { clicked: this.toggle },
                model: {
                  value: this.activated,
                  callback: (e) => {
                    this.activated = e;
                  },
                },
              },
              [this.slots(t)]
            )
        ),
      ]
    );
  },
});
const { createComponent: qr, bem: Fr } = R('fab-button');
var Gr = qr({
  mixins: [Gt(), ti('FabGroup')],
  directives: { ripple: ai },
  props: {
    ripple: Boolean,
    translucent: Boolean,
    text: String,
    disabled: Boolean,
    size: String,
    type: String,
    download: String,
    href: String,
    rel: String,
    strong: Boolean,
    target: String,
  },
  render() {
    const e = arguments[0],
      {
        type: t = 'button',
        download: i,
        href: s,
        rel: n,
        target: a,
        text: r,
      } = this,
      {
        disabled: o,
        checked: l,
        translucent: d,
        strong: h,
        size: p,
        vertical: u,
      } = this,
      m = c(s) ? 'a' : 'button',
      f =
        'button' === m
          ? { type: t }
          : { download: i, href: s, rel: n, target: a },
      g = this.itemInGroup;
    return e(
      'div',
      b([
        {
          attrs: { 'aria-disabled': o ? 'true' : null },
          class: [
            'activatable',
            'line-focusable',
            Fr({
              [p]: c(p),
              'in-list': g,
              'translucent-in-list': g && d,
              'close-active': l,
              strong: h,
              translucent: d,
              disabled: o,
            }),
          ],
        },
        { on: this.$listeners },
      ]),
      [
        e(
          m,
          {
            attrs: { ...f, disabled: o },
            directives: [{ name: 'ripple', value: this.ripple }],
            class: Fr('content', { vertical: u }),
          },
          [
            e('span', { class: Fr('indicator') }, [this.slots('indicator')]),
            e('span', { class: Fr('inner') }, [this.slots() || r]),
          ]
        ),
      ]
    );
  },
});
const { createComponent: Xr, bem: Wr } = R('footer');
var jr = Xr({
  inject: { App: { default: void 0 } },
  props: { translucent: Boolean },
  data: () => ({ isAppFooter: !1 }),
  beforeMount() {
    this.isAppFooter = this.App === this.$parent;
  },
  render() {
    const e = arguments[0],
      { translucent: t } = this;
    return e(
      'div',
      b([
        { attrs: { role: 'contentinfo' }, class: Wr({ translucent: t }) },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: _r, bem: Ur } = R('grid');
var Kr = _r({
  functional: !0,
  props: { fixed: Boolean },
  render: (e, { props: t, data: i, slots: s }) =>
    e('div', b([{ class: Ur({ fixed: t.fixed }) }, i]), [s()]),
});
const { createComponent: Jr, bem: Zr } = R('header');
var Qr = Jr({
  inject: { App: { default: void 0 } },
  props: { collapse: String, translucent: Boolean },
  data: () => ({ isAppHeader: !1 }),
  beforeMount() {
    this.isAppHeader = this.App === this.$parent;
  },
  render() {
    const e = this.collapse || 'none';
    return (0, arguments[0])(
      'div',
      b([
        {
          attrs: { role: 'banner' },
          class: [
            Zr(),
            'line-header-ios',
            `line-header-collapse-${e}`,
            this.translucent && 'line-header-translucent',
            this.translucent && 'line-header-translucent-ios',
          ],
        },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: eo, bem: to } = R('check-group');
var io = eo({
  mixins: [Ci('Group')],
  render() {
    return (0, arguments[0])('div', { class: to() }, [this.slots()]);
  },
});
const { createComponent: so, bem: no } = R('check-item');
var ao = so({
  mixins: [Ai('Group')],
  render() {
    return (0, arguments[0])(
      'div',
      { class: no(), on: { click: this.toggle } },
      [this.slots()]
    );
  },
});
const { createComponent: ro, bem: oo } = R('lazy');
var lo = ro({
  mixins: [W()],
  render() {
    return (0, arguments[0])('div', { class: oo() }, [this.slots()]);
  },
});
function co(e) {
  return O({
    mixins: [Jt(e), ti(e)],
    data: () => ({ checked: !1 }),
    computed: {
      tristate() {
        return !!this.items.length;
      },
      checkState: {
        get() {
          if (!this.tristate) return this.checked ? 1 : -1;
          let e = !1,
            t = !1,
            i = !1;
          for (const s of this.items) {
            if (
              ((e = e || -1 === s.checkState),
              (t = t || 0 === s.checkState),
              (i = i || 1 === s.checkState),
              t)
            )
              return 0;
            if (e && i) return 0;
          }
          return e ? -1 : i ? 1 : -1;
        },
        set(e) {
          this.tristate
            ? 0 !== e && this.items.forEach((t) => (t.checkState = e))
            : (this.checked = 1 === e);
        },
      },
    },
    watch: {
      checkState(e) {
        this.tristate && (this.checked = 1 === e);
      },
      checked(e) {
        this.tristate && (this.checkState = e ? 1 : -1);
      },
    },
    methods: {
      toggle() {
        this.checkState = 1 === this.checkState ? -1 : 1;
      },
    },
    beforeMount() {
      let t = 0,
        i = this[e];
      for (; i; ) t++, (i = i[e]);
      (this.itemDeep = t),
        (this.checked =
          this.checked ||
          (c(this.$attrs.checked) && !1 !== this.$attrs.checked));
    },
  });
}
const { createComponent: ho, bem: po } = R('tree-item');
var uo = ho({
  mixins: [co('Tree')],
  methods: {
    onClick(e) {
      e.stopPropagation(), this.toggle();
    },
  },
  render() {
    return (0, arguments[0])(
      'div',
      { class: po(), on: { click: this.onClick } },
      [this.slots()]
    );
  },
});
const { createComponent: mo, bem: fo } = R('img');
var go = mo({
  props: { alt: String, src: String },
  data: () => ({ loading: !1, loaderror: !1, loadsrc: '' }),
  watch: {
    src() {
      this.addIO();
    },
  },
  mounted() {
    this.addIO();
  },
  beforeDestroy() {
    this.removeIO();
  },
  methods: {
    addIO() {
      this.src &&
        ('IntersectionObserver' in window
          ? (this.removeIO(),
            (this.io = new IntersectionObserver((e) => {
              e[0].isIntersecting && (this.load(), this.removeIO());
            })),
            this.io.observe(this.$el))
          : setTimeout(() => this.load(), 200));
    },
    removeIO() {
      this.io && (this.io.disconnect(), (this.io = void 0));
    },
    load() {
      (this.loadsrc = this.src),
        this.$emit('aboutToLoad'),
        (this.loading = !0),
        (this.loaderror = !1);
    },
    onLoad() {
      this.$emit('loaded'), (this.loading = !1), (this.loaderror = !1);
    },
    onError() {
      this.loadsrc &&
        (this.$emit('error'), (this.loading = !1), (this.loaderror = !0));
    },
  },
  render() {
    const e = arguments[0];
    return e('div', b([{ class: fo() }, { on: this.$listeners }]), [
      e('img', {
        attrs: { decoding: 'async', src: this.loadsrc, alt: this.alt },
        on: { load: this.onLoad, error: this.onError },
      }),
    ]);
  },
});
const { createComponent: vo, bem: bo } = R('infinite-scroll');
var yo = vo({
  inject: { Content: { default: void 0 } },
  props: {
    threshold: { type: String, default: '15%' },
    disabled: Boolean,
    position: { type: String, default: 'bottom' },
  },
  data: () => ({ isLoading: !1 }),
  watch: {
    threshold() {
      this.thresholdChanged();
    },
  },
  async mounted() {
    ('line-content' === this.$parent.$options.name ? this.$parent.$el : null) &&
      ((this.scrollEl = await this.$parent.getScrollElement()),
      this.thresholdChanged(),
      this.disabledChanged(),
      'top' === this.position &&
        this.$nextTick(() => {
          this.scrollEl &&
            (this.scrollEl.scrollTop =
              this.scrollEl.scrollHeight - this.scrollEl.clientHeight);
        }));
  },
  beforeDestroy() {
    this.enableScrollEvents(!1), (this.scrollEl = void 0);
  },
  methods: {
    onScroll() {
      const { scrollEl: e } = this;
      if (!e || !this.canStart()) return 1;
      const t = this.$el.offsetHeight;
      if (0 === t) return 2;
      const { scrollTop: i } = e,
        { scrollHeight: s } = e,
        n = e.offsetHeight,
        a = 0 !== this.thrPc ? n * this.thrPc : this.thrPx;
      if (('bottom' === this.position ? s - t - i - a - n : i - t - a) < 0) {
        if (!this.didFire)
          return (
            (this.isLoading = !0),
            (this.didFire = !0),
            this.$emit('infinite', { complete: this.complete.bind(this) }),
            3
          );
      } else this.didFire = !1;
      return 4;
    },
    async complete() {
      const { scrollEl: e } = this;
      if (
        this.isLoading &&
        e &&
        ((this.isLoading = !1), 'top' === this.position)
      ) {
        this.isBusy = !0;
        const t = e.scrollHeight - e.scrollTop;
        requestAnimationFrame(() => {
          this.$nextTick(() => {
            const { scrollHeight: i } = e,
              s = i - t;
            requestAnimationFrame(() => {
              this.$nextTick(() => {
                (e.scrollTop = s), (this.isBusy = !1);
              });
            });
          });
        });
      }
    },
    canStart() {
      return !(
        this.disabled ||
        this.isBusy ||
        !this.scrollEl ||
        this.isLoading
      );
    },
    enableScrollEvents(e) {
      this.scrollEl &&
        (e
          ? this.scrollEl.addEventListener('scroll', this.onScroll)
          : this.scrollEl.removeEventListener('scroll', this.onScroll));
    },
    thresholdChanged() {
      const e = this.threshold;
      e.lastIndexOf('%') > -1
        ? ((this.thrPx = 0), (this.thrPc = parseFloat(e) / 100))
        : ((this.thrPx = parseFloat(e)), (this.thrPc = 0));
    },
    disabledChanged() {
      const { disabled: e } = this;
      e && ((this.isLoading = !1), (this.isBusy = !1)),
        this.enableScrollEvents(!e);
    },
  },
  render() {
    const e = arguments[0],
      { disabled: t, isLoading: i } = this;
    return e('div', { class: [bo({ loading: i, enabled: !t })] }, [
      this.slots(),
    ]);
  },
});
const { createComponent: wo, bem: xo } = R('infinite-scroll-content');
var So = wo({
  props: { loadingSpinner: String, loadingText: String },
  data: () => ({ spinner: '' }),
  beforeMount() {
    let e = this.loadingSpinner;
    if (void 0 === e) {
      const { mode: t } = this;
      e = Fe.get(
        'infiniteLoadingSpinner',
        Fe.get('spinner', 'ios' === t ? 'lines' : 'crescent')
      );
    }
    this.spinner = e;
  },
  render() {
    const e = arguments[0],
      { mode: t, loadingText: i, spinner: s } = this;
    return e('div', { class: [xo(), `line-infinite-scroll-content-${t}`] }, [
      e('div', { class: 'infinite-loading' }, [
        s &&
          e('div', { class: 'infinite-loading-spinner' }, [
            e('line-spinner', { attrs: { type: s } }),
          ]),
        i && e('div', { class: 'infinite-loading-text' }, [i]),
      ]),
    ]);
  },
});
const { createComponent: Eo, bem: To } = R('input');
let $o = 0;
var Co = Eo({
  mixins: [U('nativeValue', { event: 'inputChange' }), Gt()],
  inject: { Item: { default: void 0 } },
  props: {
    accept: String,
    autocapitalize: { type: String, default: 'off' },
    autocomplete: { type: String, default: 'off' },
    autocorrect: { type: String, default: 'off' },
    autofocus: Boolean,
    clearInput: Boolean,
    clearOnEdit: Boolean,
    inputmode: { type: String, default: 'text' },
    max: String,
    maxlength: Number,
    min: String,
    multiple: Boolean,
    pattern: String,
    placeholder: String,
    readonly: Boolean,
    size: Number,
    type: { type: String, default: 'text' },
    disabled: Boolean,
  },
  data: () => ({ hasFocus: !1, didBlurAfterEdit: !1 }),
  methods: {
    setFocus() {
      this.nativeInput && this.nativeInput.focus();
    },
    getInputElement() {
      return Promise.resolve(this.nativeInput);
    },
    disabledChanged() {
      this.emitStyle();
    },
    shouldClearOnEdit() {
      const { type: e, clearOnEdit: t } = this;
      return void 0 === t ? 'password' === e : t;
    },
    getValue() {
      return 'number' == typeof this.nativeValue
        ? this.nativeValue.toString()
        : (this.nativeValue || '').toString();
    },
    emitStyle() {
      this.Item &&
        this.Item.itemStyle('input', {
          interactive: !0,
          input: !0,
          'has-placeholder': null != this.placeholder,
          'has-value': this.hasValue(),
          'has-focus': this.hasFocus,
          'interactive-disabled': this.disabled,
        });
    },
    setInputValue() {
      const { input: e } = this.$refs;
      e.value !== this.inputValue && e && (e.value = this.inputValue);
    },
    onInput(e) {
      const t = e.target;
      t && (this.nativeValue = t.value || '');
    },
    onBlur() {
      (this.hasFocus = !1),
        this.focusChanged(),
        this.emitStyle(),
        this.$emit('blur');
    },
    onFocus() {
      (this.hasFocus = !0),
        this.focusChanged(),
        this.emitStyle(),
        this.$emit('focus');
    },
    onChange() {},
    onKeydown(e) {
      this.shouldClearOnEdit() &&
        (this.didBlurAfterEdit &&
          this.hasValue() &&
          'Enter' !== e.key &&
          this.clearTextInput(),
        (this.didBlurAfterEdit = !1));
    },
    clearTextInput(e) {
      this.clearInput &&
        !this.readonly &&
        !this.disabled &&
        e &&
        (e.preventDefault(), e.stopPropagation()),
        (this.nativeValue = ''),
        this.nativeInput && (this.nativeInput.value = '');
    },
    focusChanged() {
      !this.hasFocus &&
        this.shouldClearOnEdit() &&
        this.hasValue() &&
        (this.didBlurAfterEdit = !0);
    },
    hasValue() {
      return this.getValue().length > 0;
    },
    onClearValue(e) {
      e.preventDefault(),
        e.stopPropagation(),
        (this.nativeValue = ''),
        this.$emit('clear', e);
    },
  },
  beforeMount() {
    (this.inputId = `line-input-${$o++}`), this.emitStyle();
  },
  mounted() {
    const { nativeInput: e } = this.$refs;
    this.nativeInput = e;
  },
  watch: {
    disabled() {
      this.disabledChanged();
    },
    nativeValue() {
      this.emitStyle();
    },
  },
  render() {
    const e = arguments[0],
      t = `${this.inputId}-lbl`,
      i = ((e) => {
        const t = e && e.closest('.line-item');
        return t ? t.querySelector('.line-label') : null;
      })(this.$el),
      {
        nativeValue: s,
        hasFocus: n,
        accept: a,
        type: r,
        maxlength: o,
        readonly: l,
        placeholder: d,
        autocomplete: c,
        disabled: h,
        max: p,
        min: u,
        size: m,
        autoFocus: f,
        pattern: g,
        required: v,
      } = this;
    return (
      i && (i.id = t),
      e(
        'div',
        b([
          {
            class: [
              To({ suffix: this.slots('suffix') }),
              { 'has-value': s && s.length, 'has-focus': n },
            ],
          },
          { on: this.$listeners },
        ]),
        [
          e('input', {
            class: To('content'),
            ref: 'nativeInput',
            attrs: {
              accept: a,
              type: r,
              size: m,
              maxlength: o,
              max: p,
              min: u,
              readonly: l,
              placeholder: d,
              pattern: g,
              required: v,
              autocomplete: c,
              autoFocus: f,
              disabled: h,
            },
            domProps: { value: s },
            on: {
              input: this.onInput,
              focus: this.onFocus,
              blur: this.onBlur,
              change: this.onChange,
            },
          }),
          this.slots('suffix'),
          this.clearInput &&
            !l &&
            !h &&
            e('button', {
              attrs: { type: 'button', tabindex: '-1' },
              class: 'input-clear-icon',
              on: {
                touchStart: this.clearTextInput,
                mouseDown: this.clearTextInput,
                click: this.clearTextInput,
              },
            }),
        ]
      )
    );
  },
});
const { createComponent: ko, bem: Mo } = R('item');
var Io = ko({
  mixins: [Gt()],
  directives: { ripple: ai },
  provide() {
    return { Item: this };
  },
  props: {
    button: Boolean,
    detail: { type: Boolean, default: void 0 },
    disabled: Boolean,
    ripple: Boolean,
    download: String,
    href: String,
    rel: String,
    target: String,
    lines: String,
  },
  data: () => ({ itemStyles: {}, multipleInputs: !1, hasCover: !1 }),
  computed: {
    isClickable() {
      return c(this.href) || this.button;
    },
    canActivate() {
      return this.isClickable || this.hasCover;
    },
  },
  methods: {
    itemStyle(t, i) {
      const { itemStyles: s } = this,
        n = i,
        a = {},
        r = s[t] || {};
      let o = !1;
      Object.keys(n).forEach((e) => {
        if (n[e]) {
          const t = `item-${e}`;
          r[t] || (o = !0), (a[t] = !0);
        }
      }),
        o || Object.keys(a).length === Object.keys(r).length || (o = !0),
        o && e.set(s, t, a);
    },
  },
  mounted() {
    const e = this.$el.querySelectorAll(
        '.line-checkbox, .line-datetime, .line-select, .line-radio'
      ),
      t = this.$el.querySelectorAll(
        '.line-input, .line-range, .line-searchbar, .line-segment, .line-textarea, .line-toggle'
      ),
      i = this.$el.querySelectorAll('.line-anchor, .line-button, a, button');
    (this.multipleInputs =
      e.length + t.length > 1 ||
      e.length + i.length > 1 ||
      (e.length > 0 && this.isClickable)),
      (this.hasCover = 1 === e.length && !this.multipleInputs);
  },
  render() {
    const e = arguments[0],
      {
        mode: t,
        itemStyles: i,
        disabled: s,
        ripple: n,
        detail: a,
        href: r,
        download: o,
        rel: l,
        target: d,
        lines: h,
        isClickable: p,
        canActivate: u,
      } = this,
      m = {},
      f = p ? (c(r) ? 'a' : 'button') : 'div',
      g =
        'button' === f
          ? { type: this.type }
          : { download: o, href: r, rel: l, target: d },
      v = c(a) ? a : 'ios' === t && p;
    return (
      Object.keys(i).forEach((e) => {
        Object.assign(m, i[e]);
      }),
      e(
        'div',
        b([
          {
            attrs: { 'aria-disabled': s ? 'true' : null },
            class: [
              Mo({ disabled: s }),
              {
                ...m,
                [`item-lines-${h}`]: c(h),
                'line-activatable': u,
                'line-focusable': !0,
              },
            ],
          },
          { on: this.$listeners },
        ]),
        [
          e(
            f,
            {
              attrs: { ...g, disabled: s },
              class: 'item-native',
              directives: [{ name: 'ripple', value: n }],
            },
            [
              this.slots('start'),
              e('div', { class: 'item-inner' }, [
                e('div', { class: 'input-wrapper' }, [this.slots()]),
                this.slots('end'),
                v &&
                  e(ns, {
                    class: 'item-detail-icon',
                    attrs: { name: 'chevron_right' },
                  }),
                e('div', { class: 'item-inner-highlight' }),
              ]),
            ]
          ),
        ]
      )
    );
  },
});
const { createComponent: Po, bem: Ao } = R('item-divider');
var Oo = Po({
  mixins: [Gt()],
  props: { sticky: Boolean },
  render() {
    const e = arguments[0],
      { sticky: t = !1 } = this;
    return e(
      'div',
      b([{ class: Ao({ sticky: t }) }, { on: this.$listeners }]),
      [
        this.slots('start'),
        e('div', { class: Ao('inner') }, [
          e('div', { class: Ao('wrapper') }, [this.slots()]),
          this.slots('end'),
        ]),
      ]
    );
  },
});
const { createComponent: Bo, bem: Lo } = R('item-group');
var zo = Bo({
  render() {
    const e = arguments[0],
      { mode: t } = this;
    return e('div', { class: [Lo({ [`${t}`]: !0 })] }, [this.slots()]);
  },
});
const { createComponent: Do, bem: No } = R('item-option');
var Ho = Do({
  mixins: [Gt()],
  props: {
    disabled: Boolean,
    download: String,
    expandable: Boolean,
    href: String,
    rel: String,
    target: String,
    type: { type: String, default: 'button' },
  },
  methods: {
    onClick(e) {
      e.target.closest('.line-item-option') && e.preventDefault();
    },
  },
  render() {
    const e = arguments[0],
      {
        disabled: t,
        expandable: i,
        href: s,
        mode: n,
        type: a,
        download: r,
        target: o,
      } = this,
      l = void 0 === s ? 'button' : 'a',
      d = 'button' === l ? { type: a } : { download: r, href: s, target: o };
    return e(
      'div',
      {
        class: [No({ disabled: t, expandable: i }), 'line-activatable'],
        on: { click: this.onClick },
      },
      [
        e(
          l,
          b([{}, d, { class: No('button-native'), attrs: { disabled: t } }]),
          [
            e('span', { class: No('button-inner') }, [
              this.slots('top'),
              e('div', { class: 'horizontal-wrapper' }, [
                this.slots('start'),
                this.slots('icon-only'),
                this.slots(),
                this.slots('end'),
              ]),
              this.slots('bottom'),
            ]),
            'md' === n && e('line-ripple-effect'),
          ]
        ),
      ]
    );
  },
});
const { createComponent: Ro, bem: Vo } = R('item-options');
var Yo = Ro({
  inject: { ItemSliding: { default: void 0 } },
  props: { side: { type: String, default: 'end' } },
  methods: {
    fireSwipeEvent() {
      this.$emit('swipe', { side: this.side });
    },
  },
  beforeMount() {
    this.ItemSliding && this.ItemSliding.options.push(this);
  },
  render() {
    const e = arguments[0],
      { mode: t, side: i } = this,
      s = ((e) => {
        const t = 'rtl' === document.dir;
        switch (e) {
          case 'start':
            return t;
          case 'end':
            return !t;
          default:
            throw new Error(
              `"${e}" is not a valid value for [side]. Use "start" or "end" instead.`
            );
        }
      })(i);
    return e('div', { class: Vo({ [t]: !0, start: !s, end: s }) }, [
      this.slots(),
    ]);
  },
});
const { createComponent: qo, bem: Fo } = R('item-sliding');
let Go;
const Xo = (e) => {
  const t = 'rtl' === document.dir;
  switch (e) {
    case 'start':
      return t;
    case 'end':
      return !t;
    default:
      throw new Error(
        `"${e}" is not a valid value for [side]. Use "start" or "end" instead.`
      );
  }
};
var Wo = qo({
  provide() {
    return { ItemSliding: this };
  },
  inject: { Item: { default: void 0 } },
  props: { disabled: Boolean },
  data: () => ({ state: 2, options: [] }),
  methods: {
    disabledChanged() {
      this.gesture && this.gesture.enable(!this.disabled);
    },
    getOpenAmount() {
      return Promise.resolve(this.openAmount);
    },
    getSlidingRatio() {
      return Promise.resolve(this.getSlidingRatioSync());
    },
    async open(e) {
      if (null === this.item) return;
      const t = this.getOptions(e);
      t &&
        (void 0 === e && (e = t === this.leftOptions ? 'start' : 'end'),
        (e = Xo(e) ? 'end' : 'start'),
        (this.openAmount < 0 && t === this.leftOptions) ||
          (this.openAmount > 0 && t === this.rightOptions) ||
          (this.closeOpened(),
          (this.state = 4),
          requestAnimationFrame(() => {
            this.calculateOptsWidth(),
              (Go = this),
              this.setOpenAmount(
                'end' === e ? this.optsWidthRightSide : -this.optsWidthLeftSide,
                !1
              ),
              (this.state = 'end' === e ? 8 : 16);
          })));
    },
    async close() {
      this.setOpenAmount(0, !0);
    },
    closeOpened: async () => void 0 !== Go && (Go.close(), (Go = void 0), !0),
    getOptions(e) {
      return void 0 === e
        ? this.leftOptions || this.rightOptions
        : 'start' === e
        ? this.leftOptions
        : this.rightOptions;
    },
    async updateOptions() {
      const { options: e } = this;
      let t = 0;
      this.leftOptions = this.rightOptions = void 0;
      for (let i = 0; i < e.length; i++) {
        const s = await e[i];
        'start' === (Xo(s.side) ? 'end' : 'start')
          ? ((this.leftOptions = s), (t |= 1))
          : ((this.rightOptions = s), (t |= 2));
      }
      (this.optsDirty = !0), (this.sides = t);
    },
    canStart(e) {
      if (
        'rtl' === document.dir
          ? window.innerWidth - e.startX < 15
          : e.startX < 15
      )
        return !1;
      return Go && Go !== this
        ? (this.closeOpened(), !1)
        : !(!this.rightOptions && !this.leftOptions);
    },
    onStart() {
      (Go = this),
        void 0 !== this.tmr && (clearTimeout(this.tmr), (this.tmr = void 0)),
        0 === this.openAmount && ((this.optsDirty = !0), (this.state = 4)),
        (this.initialOpenAmount = this.openAmount),
        this.item && (this.item.style.transition = 'none');
    },
    onMove(e) {
      this.optsDirty && this.calculateOptsWidth();
      let t,
        i = this.initialOpenAmount - e.deltaX;
      switch (this.sides) {
        case 2:
          i = Math.max(0, i);
          break;
        case 1:
          i = Math.min(0, i);
          break;
        case 3:
          break;
        case 0:
          return;
      }
      i > this.optsWidthRightSide
        ? ((t = this.optsWidthRightSide), (i = t + 0.55 * (i - t)))
        : i < -this.optsWidthLeftSide &&
          ((t = -this.optsWidthLeftSide), (i = t + 0.55 * (i - t))),
        this.setOpenAmount(i, !1);
    },
    onEnd(e) {
      const t = e.velocityX;
      let i =
        this.openAmount > 0 ? this.optsWidthRightSide : -this.optsWidthLeftSide;
      ((e, t, i) => (!t && i) || (e && t))(
        this.openAmount > 0 == !(t < 0),
        Math.abs(t) > 0.3,
        Math.abs(this.openAmount) < Math.abs(i / 2)
      ) && (i = 0);
      const { state: s } = this;
      this.setOpenAmount(i, !0),
        0 != (32 & s) && this.rightOptions
          ? this.rightOptions.fireSwipeEvent()
          : 0 != (64 & s) &&
            this.leftOptions &&
            this.leftOptions.fireSwipeEvent();
    },
    calculateOptsWidth() {
      (this.optsWidthRightSide = 0),
        this.rightOptions &&
          ((this.rightOptions.$el.style.display = 'flex'),
          (this.optsWidthRightSide = this.rightOptions.$el.offsetWidth),
          (this.rightOptions.$el.style.display = '')),
        (this.optsWidthLeftSide = 0),
        this.leftOptions &&
          ((this.leftOptions.$el.style.display = 'flex'),
          (this.optsWidthLeftSide = this.leftOptions.$el.offsetWidth),
          (this.leftOptions.$el.style.display = '')),
        (this.optsDirty = !1);
    },
    setOpenAmount(e, t) {
      if (
        (void 0 !== this.tmr && (clearTimeout(this.tmr), (this.tmr = void 0)),
        !this.item)
      )
        return;
      const { style: i } = this.item;
      if (((this.openAmount = e), t && (i.transition = ''), e > 0))
        this.state = e >= this.optsWidthRightSide + 30 ? 40 : 8;
      else {
        if (!(e < 0))
          return (
            (this.tmr = setTimeout(() => {
              (this.state = 2), (this.tmr = void 0);
            }, 600)),
            (Go = void 0),
            void (i.transform = '')
          );
        this.state = e <= -this.optsWidthLeftSide - 30 ? 80 : 16;
      }
      (i.transform = `translate3d(${-e}px,0,0)`),
        this.$emit('drag', { amount: e, ratio: this.getSlidingRatioSync() });
    },
    getSlidingRatioSync() {
      return this.openAmount > 0
        ? this.openAmount / this.optsWidthRightSide
        : this.openAmount < 0
        ? this.openAmount / this.optsWidthLeftSide
        : 0;
    },
  },
  beforeMount() {
    (this.item = null),
      (this.openAmount = 0),
      (this.initialOpenAmount = 0),
      (this.optsWidthRightSide = 0),
      (this.optsWidthLeftSide = 0),
      (this.sides = 0),
      (this.tmr = void 0),
      (this.optsDirty = !0);
  },
  async mounted() {
    (this.item = this.$el.querySelector('.line-item')),
      await this.updateOptions(),
      (this.gesture = Ie({
        el: this.$el,
        gestureName: 'item-swipe',
        gesturePriority: 100,
        threshold: 5,
        canStart: (e) => this.canStart(e),
        onStart: () => this.onStart(),
        onMove: (e) => this.onMove(e),
        onEnd: (e) => this.onEnd(e),
      })),
      this.disabledChanged();
  },
  render() {
    return (0, arguments[0])(
      'div',
      {
        class: Fo({
          'active-slide': 2 !== this.state,
          'active-options-end': 0 != (8 & this.state),
          'active-options-start': 0 != (16 & this.state),
          'active-swipe-end': 0 != (32 & this.state),
          'active-swipe-start': 0 != (64 & this.state),
        }),
      },
      [this.slots()]
    );
  },
});
const { createComponent: jo, bem: _o } = R('label');
var Uo = jo({
  mixins: [Gt()],
  inject: { Item: { default: void 0 } },
  props: { position: String },
  watch: { position: 'emitStyle' },
  mounted() {
    this.noAnimate &&
      setTimeout(() => {
        this.noAnimate = !1;
      }, 1e3),
      this.emitStyle();
  },
  methods: {
    emitStyle() {
      const { Item: e, position: t } = this;
      e && e.itemStyle('label', { label: !0, [`label-${t}`]: c(t) });
    },
  },
  render() {
    const e = arguments[0],
      { position: t } = this;
    return e(
      'div',
      b([
        { class: _o({ [t]: c(t), 'no-animate': this.noAnimate }) },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: Ko, bem: Jo } = R('list');
var Zo = Ko({
  props: { lines: String, inset: Boolean },
  render() {
    const e = arguments[0],
      { lines: t, inset: i = !1 } = this;
    return e(
      'div',
      b([
        { class: Jo({ [`lines-${t}`]: c(t), inset: i }) },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: Qo, bem: el } = R('list-header');
var tl = Qo({
  mixins: [Gt()],
  props: { lines: String },
  render() {
    const e = arguments[0],
      { lines: t } = this;
    return e(
      'div',
      b([{ class: el({ [`lines-${t}`]: c(t) }) }, { on: this.$listeners }]),
      [e('div', { class: 'list-header-innerd' }, [this.slots()])]
    );
  },
});
const { createComponent: il, bem: sl } = R('list-item');
var nl = il({
  inject: ['ListView'],
  props: { index: { type: Number, required: !0 }, item: null },
  computed: {
    cachedNode() {
      return this.slots('default', this.item);
    },
  },
  methods: {
    onLayoutChanged() {
      const { itemLayoutAtIndex: e } = this.ListView,
        t = e(this.index);
      (this.offsetWidth = t.geometry.width),
        (this.offsetHeight = t.geometry.height);
      const { offsetWidth: i, offsetHeight: s } = this.$el,
        { onLayout: n, horizontal: a, vertical: r } = this.ListView;
      i &&
        s &&
        ((this.offsetWidth !== i && a) || (this.offsetHeight !== s && r)) &&
        ((this.offsetWidth = i),
        (this.offsetHeight = s),
        n(this.index, this.offsetWidth, this.offsetHeight));
    },
  },
  async mounted() {
    await this.$nextTick();
  },
  async updated() {
    await this.$nextTick();
  },
  render() {
    return (0, arguments[0])('div', { class: sl() }, [this.cachedNode]);
  },
});
class al {
  constructor(e = 0, t = 0) {
    (this.x = e), (this.y = t);
  }
  static Clamp(e, t, i) {
    return e.min(t), e.max(i), e;
  }
  static Distance(e, t) {
    const i = e.x - t.x,
      s = e.y - t.y;
    return Math.sqrt(i * i + s * s);
  }
  static Length(e) {
    return Math.sqrt(e.x * e.x + e.y * e.y);
  }
  isNull() {
    return !!this.x && !!this.y;
  }
  setX(e) {
    this.x = e;
  }
  setY(e) {
    this.y = e;
  }
  min(e) {
    this.x < e && (this.x = e), this.y < e && (this.y = e);
  }
  max(e) {
    this.x > e && (this.x = e), this.y > e && (this.y = e);
  }
  clamp(e, t) {
    return al.Clamp(this, e, t);
  }
  add(e) {
    (this.x += e.x), (this.y += e.y);
  }
  subtract(e) {
    (this.x -= e.x), (this.y -= e.y);
  }
  multiply(e) {
    (this.x *= e.x), (this.y *= e.y);
  }
  divide(e) {
    (this.x /= e.x), (this.y /= e.y);
  }
  distance(e) {
    return al.Distance(this, e);
  }
  length() {
    return al.Length(this);
  }
}
class rl {
  constructor(e = 0, t = 0) {
    (this.width = e), (this.height = t);
  }
  isEmpty() {
    return this.width <= 0 || this.height <= 0;
  }
  isNull() {
    return !!this.width && !!this.height;
  }
  isValid() {
    return this.width >= 0 && this.height >= 0;
  }
  scale(e, t, i = 0) {
    const s = this.width / this.height;
    switch (i) {
      case 1:
        (this.width = s > 1 ? e : e * s), (this.height = s > 1 ? t * s : t);
        break;
      case 2:
        (this.width = s > 1 ? e * s : e), (this.height = s > 1 ? t : t * s);
        break;
      case 0:
      default:
        (this.width = e), (this.height = t);
    }
    return this;
  }
  scaled(e, t, i = 0) {
    const s = new rl(this.width, this.height);
    return s.scale(e, t, i), s;
  }
  setWidth(e) {
    this.width = e;
  }
  setHeight(e) {
    this.height = e;
  }
  transpose() {
    ({ width: this.height, height: this.width } = this);
  }
  add(e) {
    (this.width += e.width), (this.height += e.height);
  }
  subtract(e) {
    (this.width -= e.width), (this.height -= e.height);
  }
  multiply(e) {
    (this.width *= e), (this.height *= e);
  }
  divide(e) {
    (this.width /= e), (this.height /= e);
  }
}
class ol {
  constructor(e = 0, t = 0, i = 0, s = 0) {
    (this.x = e), (this.y = t), (this.width = i), (this.height = s);
  }
  get left() {
    return this.x;
  }
  set left(e) {
    this.x = e;
  }
  get right() {
    return this.x + this.width;
  }
  set right(e) {
    this.width = Math.max(0, e - this.x);
  }
  get top() {
    return this.y;
  }
  set top(e) {
    this.y = e;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(e) {
    this.height = Math.max(0, e - this.y);
  }
  setX(e) {
    this.x = e;
  }
  setY(e) {
    this.y = e;
  }
  setWidth(e) {
    this.width = e;
  }
  setHeight(e) {
    this.height = e;
  }
  setSize(e, t) {
    (this.width = e), (this.height = t);
  }
  setRect(e, t, i, s) {
    (this.x = e), (this.y = t), (this.width = i), (this.height = s);
  }
  setCoords(e, t, i, s) {
    (this.left = e), (this.top = t), (this.right = i), (this.bottom = s);
  }
  topLeft() {
    return new al(this.left, this.top);
  }
  bottomLeft() {
    return new al(this.left, this.bottom);
  }
  topRight() {
    return new al(this.right, this.top);
  }
  bottomRight() {
    return new al(this.right, this.bottom);
  }
  center() {
    return new al(
      this.x + Math.ceil(this.width / 2),
      this.y + Math.ceil(this.height / 2)
    );
  }
  size() {
    return new rl(this.width, this.height);
  }
  isEmpty() {
    return !this.isValid();
  }
  isValid() {
    return this.left < this.right || this.top < this.bottom;
  }
  isNull() {
    return !!this.width && !!this.height;
  }
  normailized() {
    if (this.isValid()) return this;
    return new ol(
      this.width < 0 ? this.x + this.width : this.x,
      this.height < 0 ? this.y + this.height : this.y,
      this.width,
      this.height
    );
  }
  contains(e, t) {
    return e > this.x && e < this.right && t > this.y && t < this.bottom;
  }
  intersects(e) {
    return (
      this.contains(e.left, e.top) ||
      this.contains(e.right, e.top) ||
      this.contains(e.left, e.bottom) ||
      this.contains(e.right, e.bottom)
    );
  }
  adjust(e, t, i, s) {
    return (
      (this.left += e),
      (this.top += t),
      (this.right += i),
      (this.bottom += s),
      this
    );
  }
  adjusted(e, t, i, s) {
    const n = new ol(this.x, this.y, this.width, this.height);
    return n.adjust(e, t, i, s), n;
  }
  moveTop(e) {
    return (this.y = e), this;
  }
  moveBottom(e) {
    return (this.y += e - this.bottom), this;
  }
  moveLeft(e) {
    return (this.x = e), this;
  }
  moveRight(e) {
    return (this.x += e - this.right), this;
  }
  moveCenter(e) {
    return (
      (this.x = e.x - Math.ceil(this.width / 2)),
      (this.y = e.y - Math.ceil(this.height / 2)),
      this
    );
  }
  moveTo(e, t) {
    return (this.x = e), (this.y = t), this;
  }
  translate(e) {
    return (this.x += e.x), (this.y += e.y), this;
  }
  translated(e) {
    return new ol((this.x += e.x), (this.y += e.y), this.width, this.height);
  }
  united(e) {
    return new ol(
      Math.min(this.x, e.x),
      Math.min(this.y, e.y),
      Math.max(this.width, e.width),
      Math.max(this.height, e.height)
    );
  }
  intersected(e) {
    return new ol(
      Math.max(this.x, e.x),
      Math.max(this.y, e.y),
      Math.min(this.width, e.width),
      Math.min(this.height, e.height)
    );
  }
}
class ll {
  constructor(e, t) {
    (this.minWidth = void 0),
      (this.maxWidth = void 0),
      (this.minHeight = void 0),
      (this.maxHeight = void 0),
      (this.geometry = new ol(0, 0, e, t)),
      (this.layout = null),
      (this.valid = !0),
      (this.previous = null),
      (this.next = null);
  }
  get width() {
    return this.geometry.width;
  }
  set width(e) {
    this.geometry.width = e;
  }
  get height() {
    return this.geometry.height;
  }
  set height(e) {
    this.geometry.height = e;
  }
  setSize(e, t) {
    this.geometry.setSize(e, t);
  }
  setGeometry(e) {
    this.geometry = e;
  }
  invalidate() {
    this.valid = !1;
  }
  clone() {
    const e = new ll();
    return (
      (e.minWidth = this.minWidth),
      (e.maxWidth = this.maxWidth),
      (e.minHeight = this.minHeight),
      (e.maxHeight = this.maxHeight),
      (e.geometry.x = this.geometry.x),
      (e.geometry.y = this.geometry.y),
      (e.geometry.width = this.geometry.width),
      (e.geometry.height = this.geometry.height),
      e
    );
  }
}
const dl = (e) => new ll();
class cl extends ll {
  constructor() {
    super(), (this.items = []);
  }
  get count() {
    return this.items.length;
  }
  setCount(e, t = dl) {
    for (let i = Math.max(0, this.count - 1); i < e; i++) {
      const e = t(i);
      this.addItem(e);
    }
    this.items.length = e;
  }
  addItem(e) {
    const t = this.count > 0 ? this.items[this.count - 1] : null;
    return (
      (e.layout = this),
      (e.previous = t),
      t && (t.next = e),
      this.items.push(e),
      this.count - 1
    );
  }
  removeItem(e) {
    const t = this.items.indexOf(e);
    return this.takeAt(t), t;
  }
  indexOf(e) {
    return this.items.indexOf(e);
  }
  itemAt(e) {
    return e < this.count ? this.items[e] : null;
  }
  takeAt(e) {
    if (e < this.count) {
      const t = this.items[e],
        { previous: i, next: s } = t;
      return (
        (t.layout = null),
        (t.previous = null),
        (t.next = null),
        i && (i.next = s),
        s && (s.previous = i),
        this.items.splice(e, 1),
        t
      );
    }
    return null;
  }
}
const hl = (...e) => !0;
class pl extends cl {
  constructor(e) {
    super(), (this.orientation = e), (this.spacing = 0);
  }
  get horizontal() {
    return 0 === this.orientation;
  }
  get vertical() {
    return 1 === this.orientation;
  }
  addItem(e) {
    const t = super.addItem(e);
    return this.update(e), t;
  }
  removeItem(e) {
    const { next: t } = e,
      i = super.removeItem(e);
    return this.update(t), i;
  }
  insertItem(e, t) {
    if (e > this.count - 1) throw new Error('Insert index is out of range.');
    const i = this.itemAt(e),
      { previous: s, next: n } = i;
    s && (s.next = t),
      n && (n.previous = t),
      (t.previous = s),
      (t.next = n),
      this.items.splice(e, 0, t),
      this.update(t);
  }
  check() {
    let e = this.itemAt(0);
    for (; e && e.next; ) {
      const { next: t } = e;
      e = t;
    }
    console.log(`layout all right. count: ${this.count}`, this);
  }
  update(e, t = hl) {
    var i;
    if (
      ((i = e),
      !isNaN(parseFloat(i)) && isFinite(i) && (e = this.itemAt(e)),
      !e)
    )
      return;
    let s;
    if (((s = e), s && s.previous)) {
      const { previous: e } = s;
      this.horizontal && (s.geometry.left = e.geometry.right),
        this.vertical && (s.geometry.top = e.geometry.bottom);
    }
    for (; s && s.next && t(s); ) {
      const { next: e } = s;
      if (this.horizontal) {
        if (e.geometry.left === s.geometry.right) break;
        e.geometry.left = s.geometry.right;
      }
      if (this.vertical) {
        if (e.geometry.top === s.geometry.bottom) break;
        e.geometry.top = s.geometry.bottom;
      }
      s = e;
    }
    const n = this.itemAt(this.count - 1);
    (this.geometry.right = n.geometry.right),
      (this.geometry.bottom = n.geometry.bottom);
  }
}
const ul = (e, t) => (e < t ? -1 : e > t ? 1 : 0);
function ml(e = [], t, i = ul, s = 0, n = e.length - 1, a = 0) {
  if (s >= n) return n;
  let r = 0,
    o = 0,
    l = -1;
  for (; s <= n; ) {
    r = (s + n) >>> 1;
    try {
      o = i(e[r], t, r);
    } catch (e) {
      throw e;
    }
    if (o < 0) s = r + 1;
    else if (o > 0) n = r - 1;
    else if (((l = r), a < 0)) n = r - 1;
    else {
      if (!(a > 0)) return r;
      s = r + 1;
    }
  }
  return l >= 0 ? l : n;
}
const { createComponent: fl, bem: gl } = R('list-view');
var vl = fl({
  provide() {
    return { ListView: this };
  },
  props: {
    add: { type: String, default: '' },
    addDisplaced: { type: String, default: '' },
    cacheBuffer: { type: Number, default: 3 },
    count: { type: Number, default: 0 },
    currentIndex: { type: Number, default: -1 },
    delegate: { type: Object, default: () => ({}) },
    displaced: { type: String, default: '' },
    displayMarginBeginning: { type: Number, default: 0 },
    displayMarginEnd: { type: Number, default: 0 },
    footer: { type: Object, default: () => ({}) },
    footerPositioning: { type: Number, default: 0 },
    header: { type: Object, default: () => ({}) },
    headerPositioning: { type: Number, default: 0 },
    highlight: { type: Object, default: () => ({}) },
    highlightFollowsCurrentItem: { type: Boolean, default: !0 },
    highlightMoveDuration: { type: Number, default: 1e3 },
    highlightMoveVelocity: { type: Number, default: -1 },
    highlightRangeMode: { type: Number, default: 0 },
    highlightResizeDuration: { type: Number, default: 0 },
    highlightResizeVelocity: { type: Number, default: 0 },
    keyNavigationEnabled: { type: Boolean, default: !0 },
    keyNavigationWraps: { type: Boolean, default: !1 },
    layoutDirection: { type: Number, default: 0 },
    model: { type: [Object, Number, Array], default: () => [] },
    move: { type: String, default: '' },
    moveDisplaced: { type: String, default: '' },
    orientation: {
      type: Number,
      default: 1,
      validator: (e) => 1 === e || 0 === e,
    },
    populate: { type: String, default: '' },
    preferredHighlightBegin: { type: Number, default: 0 },
    preferredHighlightEnd: { type: Number, default: 0 },
    remove: { type: String, default: '' },
    removeDisplaced: { type: String, default: '' },
    section: {
      type: Object,
      default: () => ({
        property: '',
        criteria: 0,
        delegate: null,
        labelPositioning: 0,
      }),
    },
    snapMode: { type: Number, default: 0 },
    spacing: { type: Number, default: 0 },
    verticalLayoutDirection: { type: String, default: '' },
  },
  computed: {
    currentItem: () => null,
    currentSection: () => '',
    footerItem: () => null,
    headerItem: () => null,
    highlightItem: () => null,
    horizontal() {
      return 0 === this.orientation;
    },
    vertical() {
      return 1 === this.orientation;
    },
    visibleItemCount() {
      return this.visibleEndIndex - this.visibleStartIndex + 1;
    },
    itemCount() {
      return Array.isArray(this.model) ? this.model.length : this.model;
    },
  },
  methods: {
    decrementCurrentIndex() {},
    forceLayout() {},
    incrementCurrentIndex() {},
    indexAt(e, t) {
      return ml(this.layout.items, this.horizontal ? e : t, (e, t) => {
        const { left: i, right: s, top: n, bottom: a } = e.geometry;
        return (this.horizontal ? s : a) < t
          ? -1
          : (this.horizontal ? i : n) > t
          ? 1
          : 0;
      });
    },
    itemAt(e, t) {
      const i = this.indexAt(e, t);
      return this.itemAtIndex(i);
    },
    itemAtIndex(e) {
      return Array.isArray(this.model) ? this.model[e] : e;
    },
    positionViewAtBeginning() {},
    positionViewAtEnd() {},
    positionViewAtIndex(e, t) {},
    itemLayoutAt(e, t) {
      const i = this.indexAt(e, t);
      return this.layout.itemAt(i);
    },
    itemLayoutAtIndex(e) {
      return this.layout.itemAt(e);
    },
    itemStyleAtIndex(e) {
      const { geometry: t } = this.layout.itemAt(e);
      return Object.freeze({
        left: `${t.left}px`,
        top: `${t.top}px`,
        width: this.horizontal ? 'auto' : '100%',
        height: this.horizontal ? '100%' : 'auto',
      });
    },
    mapToItemIndex(e) {
      return this.from + e;
    },
    itemViewAt(e) {
      return this.views[e];
    },
    itemViewAtIndex(e) {
      const t = Object.keys(this.views).find((t) => this.views[t].index === e);
      return this.itemViewAt(t);
    },
    addView(e) {
      const t = Object.keys(this.views).length,
        { id: i = t } = e;
      (e.id = i), (this.views[i] = e);
    },
    removeView(e) {
      delete this.views[e], delete this.cachedViews[e];
    },
    cacheView(e) {
      const t = this.views[e];
      (t.style = { ...this.itemStyleAtIndex(t.index), display: 'none' }),
        (this.cachedViews[e] = t);
    },
    onScroll(e) {
      const { scrollLeft: t, scrollTop: i } = e.target,
        s = this.minimumItemSize;
      (Math.abs(this.scrollLeft - t) >= s ||
        Math.abs(this.scrollTop - i) >= s) &&
        ((this.incremental = this.horizontal
          ? t > this.scrollLeft
          : i > this.scrollTop),
        (this.decremental = !this.incremental),
        (this.scrollLeft = t),
        (this.scrollTop = i),
        this.pending || this.onUpdate());
    },
    async onLayout(e, t, i) {
      this.layout.itemAt(e).setSize(t, i),
        (this.minimumItemSize = Math.min(
          this.minimumItemSize,
          this.horizontal ? t : i
        )),
        (this.maximumItemSize = Math.max(
          this.maximumItemSize,
          this.horizontal ? t : i
        )),
        (this.dirtyIndex = Math.min(this.dirtyIndex, e)),
        this.pending ||
          (this.pending = requestAnimationFrame(() => {
            this.layout.update(this.dirtyIndex),
              (this.dirtyIndex = this.layout.count),
              this.onUpdate(!0),
              (this.pending = !1);
          }));
    },
    async onUpdate(e = !1) {
      const { count: t } = this.layout,
        i = this.horizontal ? this.scrollLeft : this.scrollTop,
        s = i + (this.horizontal ? this.clientWidth : this.clientHeight),
        n = this.from,
        a = this.to,
        r = this.layout.itemAt(t - 1),
        o = this.horizontal ? r.geometry.right : r.geometry.bottom;
      let l, d;
      (l = ml(
        this.layout.items,
        i,
        (e, t) => {
          const { left: i, right: s, top: n, bottom: a } = e.geometry;
          return (this.horizontal ? s : a) < t
            ? -1
            : (this.horizontal ? i : n) > t
            ? 1
            : 0;
        },
        this.incremental ? n : Math.floor(i / this.maximumItemSize),
        this.incremental
          ? Math.min(t - 1, Math.ceil(i / this.minimumItemSize))
          : a
      )),
        (d =
          o > s
            ? (function (e = [], t, i, s, n, a) {
                let r = s,
                  o = 1;
                for (; r < n && i(e[r], t, r) < 0; ) (r += o), (o *= 2);
                return ml(e, t, i, Math.floor(r / 2), Math.min(r, n), a);
              })(
                this.layout.items,
                s,
                (e, t) => {
                  const { left: i, right: s, top: n, bottom: a } = e.geometry;
                  return (this.horizontal ? s : a) < t
                    ? -1
                    : (this.horizontal ? i : n) > t
                    ? 1
                    : 0;
                },
                l,
                t - 1
              )
            : t - 1),
        (l = Math.max(0, l)),
        (d = Math.min(t - 1, d)),
        Object.keys(this.views).forEach((e) => {
          const t = this.views[e],
            { index: i } = t;
          i < l || i > d
            ? this.cacheView(e)
            : (t.style = this.itemStyleAtIndex(i));
        });
      let c = Object.keys(this.cachedViews);
      for (let e = l; e <= d; e++)
        if (e < n || e > a) {
          let t = this.itemViewAtIndex(e);
          if (t) {
            delete this.cachedViews[t.id],
              (t.style = this.itemStyleAtIndex(e)),
              (c = Object.keys(this.cachedViews));
            continue;
          }
          if (c.length) {
            const e = c.shift();
            (t = this.cachedViews[e]), delete this.cachedViews[e];
          } else (t = {}), this.addView(t);
          (t.index = e),
            (t.layout = this.layout.itemAt(e)),
            (t.item = this.itemAtIndex(e)),
            (t.style = this.itemStyleAtIndex(e));
        }
      (e || l !== n || d !== a) &&
        ((this.from = l), (this.to = d), this.$forceUpdate());
    },
  },
  beforeMount() {
    (this.layout = new pl(this.orientation)),
      this.layout.setCount(this.itemCount, () => new ll(50, 50)),
      (this.views = Object.create(null)),
      (this.cachedViews = Object.create(null)),
      (this.from = 0),
      (this.to = Math.min(9, this.itemCount)),
      (this.minimumItemSize = 50),
      (this.maximumItemSize = 50),
      (this.dirtyIndex = this.itemCount),
      (this.pending = !1),
      (this.scrollLeft = 0),
      (this.scrollTop = 0),
      (this.incremental = !0),
      (this.decremental = !1);
    for (let e = this.from; e <= this.to; e++)
      this.addView({
        index: e,
        layout: this.layout.itemAt(e),
        item: this.itemAtIndex(e),
        style: this.itemStyleAtIndex(e),
      });
  },
  async mounted() {
    this.$emit('add'), this.$emit('remove');
    const e = this.$refs.viewport;
    (this.clientWidth = e.clientWidth),
      (this.clientHeight = e.clientHeight),
      await this.$nextTick();
  },
  render() {
    const e = arguments[0];
    return e(
      'div',
      { class: gl(), ref: 'viewport', on: { scroll: this.onScroll } },
      [
        e('div', {
          class: gl('spacer'),
          style: {
            width: `${this.layout.geometry.width}px`,
            height: `${this.layout.geometry.height}px`,
          },
        }),
        e('transition-group', { attrs: { tag: 'div' }, class: gl('content') }, [
          Object.keys(this.views).map((t) => {
            const i = this.views[t];
            return e(nl, {
              key: i.id,
              attrs: { index: i.index, item: i.item },
              style: i.style,
              scopedSlots: { default: () => this.slots('delegate') || i.index },
            });
          }),
        ]),
      ]
    );
  },
});
const bl = (e) => it().duration(e ? 400 : 300),
  yl = (e) => {
    let t, i;
    const s = e.width + 8,
      n = it(),
      a = it();
    e.isEndSide
      ? ((t = `${s}px`), (i = '0px'))
      : ((t = `${-s}px`), (i = '0px')),
      n
        .addElement(e.menuInnerEl)
        .fromTo('transform', `translateX(${t})`, `translateX(${i})`);
    const r = 'ios' === e.mode,
      o = r ? 0.2 : 0.25;
    return (
      a.addElement(e.backdropEl).fromTo('opacity', 0.01, o),
      bl(r).addAnimation([n, a])
    );
  },
  wl = (e) => {
    let t, i;
    const { width: s } = e;
    e.isEndSide
      ? ((t = `${-s}px`), (i = `${s}px`))
      : ((t = `${s}px`), (i = `${-s}px`));
    const n = it()
        .addElement(e.menuInnerEl)
        .fromTo('transform', `translateX(${i})`, 'translateX(0px)'),
      a = it()
        .addElement(e.contentEl)
        .fromTo('transform', 'translateX(0px)', `translateX(${t})`),
      r = it().addElement(e.backdropEl).fromTo('opacity', 0.01, 0.32);
    return bl('ios' === e.mode).addAnimation([n, a, r]);
  },
  xl = (e) => {
    const t = `${e.width * (e.isEndSide ? -1 : 1)}px`,
      i = it()
        .addElement(e.contentEl)
        .fromTo('transform', 'translateX(0px)', `translateX(${t})`);
    return bl('ios' === e.mode).addAnimation(i);
  },
  Sl = (() => {
    const e = new Map(),
      t = (t, i) => {
        e.set(t, i);
      };
    return (
      t('reveal', xl),
      t('push', wl),
      t('overlay', yl),
      {
        registerAnimation: t,
        _createAnimation: (t, i) => {
          const s = e.get(t);
          if (!s) throw new Error('animation not registered');
          return s(i);
        },
      }
    );
  })(),
  { createComponent: El, bem: Tl } = R('menu'),
  $l = (e, t, i) => Math.max(0, t !== i ? -e : e),
  Cl = (e, t) => {
    if (!e) {
      throw new Error(`ASSERT: ${t}`);
    }
  };
var kl = El({
  mixins: [U('actived')],
  props: {
    contentId: { type: String, required: !0 },
    type: { type: String, default: 'overlay' },
    maxEdgeStart: { type: Number, default: 50 },
    disabled: Boolean,
    side: { type: String, default: 'start' },
    swipeGesture: { type: Boolean, default: !0 },
  },
  data: () => ({
    lastOnEnd: 0,
    blocker: ke.createBlocker({ disableScroll: !0 }),
    isPaneVisible: !1,
    isEndSide: !1,
    isAnimating: !1,
    isOpen: !1,
    visible: !1,
    easing: 'cubic-bezier(0.32,0.72,0,1)',
    easingReverse: 'cubic-bezier(1, 0, 0.68, 0.28)',
  }),
  methods: {
    onBackdropClick(e) {
      if (this.isOpen) {
        !!e.composedPath &&
          !e.composedPath().includes(this.menuInnerEl) &&
          (e.preventDefault(), e.stopPropagation(), this.close());
      }
    },
    open(e = !0) {
      return this.setOpen(!0, e);
    },
    close(e = !0) {
      return this.setOpen(!1, e);
    },
    toggle(e = !0) {
      return this.setOpen(!this.isOpen, e);
    },
    async setOpen(e, t = !0) {
      return (
        !(!this.isActive() || this.isAnimating || e === this.isOpen) &&
        (this.beforeAnimation(e),
        await this.loadAnimation(),
        await this.startAnimation(e, t),
        this.afterAnimation(e),
        !0)
      );
    },
    async loadAnimation() {
      const e = this.menuInnerEl.offsetWidth;
      (e === this.width && void 0 !== this.animation) ||
        ((this.width = e),
        this.animation && (this.animation.destroy(), (this.animation = void 0)),
        (this.animation = await Sl._createAnimation(this.type, this)),
        Fe.getBoolean('animated', !0) || this.animation.duration(0),
        this.animation.fill('both'));
    },
    async startAnimation(e, t) {
      const i = !e;
      this.animation || (await this.loadAnimation());
      const s = this.animation
        .direction(i ? 'reverse' : 'normal')
        .easing(i ? this.easingReverse : this.easing)
        .onFinish(() => {
          'reverse' === s.getDirection() && s.direction('normal');
        });
      t ? await s.play() : s.play({ sync: !0 });
    },
    isActive() {
      return !this.disabled && !this.isPaneVisible;
    },
    canSwipe() {
      return this.swipeGesture && !this.isAnimating && this.isActive();
    },
    canStart(e) {
      return (
        !!this.canSwipe() &&
        (!!this.isOpen ||
          ((e, t, i, s) => (i ? t >= e.innerWidth - s : t <= s))(
            window,
            e.currentX,
            this.isEndSide,
            this.maxEdgeStart
          ))
      );
    },
    onWillStart() {
      return this.beforeAnimation(!this.isOpen), this.loadAnimation();
    },
    onStart() {
      this.isAnimating && this.animation
        ? this.animation.progressStart(!0, this.isOpen ? 1 : 0)
        : Cl(!1, 'isAnimating has to be true');
    },
    onMove(e) {
      if (!this.isAnimating || !this.animation)
        return void Cl(!1, 'isAnimating has to be true');
      const t = $l(e.deltaX, this.isOpen, this.isEndSide) / this.width;
      this.animation.progressStep(this.isOpen ? 1 - t : t);
    },
    onEnd(e) {
      if (!this.isAnimating || !this.animation)
        return void Cl(!1, 'isAnimating has to be true');
      const { isOpen: t } = this,
        { isEndSide: i } = this,
        s = $l(e.deltaX, t, i),
        { width: n } = this,
        a = s / n,
        r = e.velocityX,
        o = n / 2,
        l = r >= 0 && (r > 0.2 || e.deltaX > o),
        d = r <= 0 && (r < -0.2 || e.deltaX < -o),
        c = t ? (i ? l : d) : i ? d : l;
      let h = !t && c;
      t && !c && (h = !0), (this.lastOnEnd = e.currentTime);
      let p = c ? 0.001 : -0.001;
      var u, m, f;
      p +=
        st(
          [0, 0],
          [0.4, 0],
          [0.6, 1],
          [1, 1],
          ((u = 0),
          (m = a < 0 ? 0.01 : a),
          (f = 0.9999),
          Math.max(u, Math.min(m, f)))
        )[0] || 0;
      const g = this.isOpen ? !c : c;
      this.animation
        .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .onFinish(() => this.afterAnimation(h), { oneTimeCallback: !0 })
        .progressEnd(g ? 1 : 0, this.isOpen ? 1 - p : p, 300);
    },
    beforeAnimation(e) {
      Cl(!this.isAnimating, '_before() should not be called while animating'),
        this.$el.classList.add('show-menu'),
        this.backdropEl && this.backdropEl.classList.add('show-overlay'),
        (this.visible = !0),
        this.blocker.block(),
        (this.isAnimating = !0),
        this.$emit(e ? 'willOpen' : 'willClose');
    },
    afterAnimation(e) {
      Cl(this.isAnimating, '_before() should be called while animating'),
        (this.isOpen = e),
        (this.actived = e),
        (this.isAnimating = !1),
        this.isOpen || this.blocker.unblock(),
        e
          ? (this.contentEl &&
              this.contentEl.classList.add('line-menu__content-open'),
            this.$emit('open'))
          : (this.$el.classList.remove('show-menu'),
            this.contentEl &&
              this.contentEl.classList.remove('line-menu__content-open'),
            this.backdropEl && this.backdropEl.classList.remove('show-overlay'),
            (this.visible = !1),
            this.animation && this.animation.stop(),
            this.$emit('close'));
    },
    updateState() {
      const e = this.isActive();
      this.gesture && this.gesture.enable(e && this.swipeGesture),
        !e && this.isOpen && this.forceClosing(),
        Cl(!this.isAnimating, 'can not be animating');
    },
    forceClosing() {
      Cl(this.isOpen, 'menu cannot be closed'),
        (this.isAnimating = !0),
        this.animation.direction('reverse').play({ sync: !0 }),
        this.afterAnimation(!1);
    },
    typeChanged(e, t) {
      const { contentEl: i } = this;
      (this.animation = void 0),
        i &&
          (void 0 !== t && i.classList.remove(`line-menu__content-${t}`),
          i.classList.add(`line-menu__content-${e}`),
          i.removeAttribute('style')),
        this.menuInnerEl && this.menuInnerEl.removeAttribute('style');
    },
    sideChanged() {
      this.isEndSide = ((e) => {
        const t = 'rtl' === document.dir;
        switch (e) {
          case 'start':
            return t;
          case 'end':
            return !t;
          default:
            throw new Error(
              `"${e}" is not a valid value for [side]. Use "start" or "end" instead.`
            );
        }
      })(this.side);
    },
  },
  watch: {
    type(e, t) {
      this.typeChanged(e, t);
    },
    disabled() {
      this.updateState();
    },
    side() {
      this.sideChanged();
    },
    actived(e) {
      e && this.open();
    },
  },
  async mounted() {
    const { menuInnerEl: e, backdropEl: t } = this.$refs,
      i = this.$el.parentNode;
    (this.menuInnerEl = e), (this.backdropEl = t.$el);
    const s =
      void 0 !== this.contentId
        ? document.getElementById(this.contentId)
        : i && i.querySelector && i.querySelector('[main]');
    s &&
      s.tagName &&
      ((this.contentEl = s),
      s.classList.add('line-menu__content'),
      s &&
        s.tagName &&
        ((this.contentEl = s),
        s.classList.add('line-menu__content'),
        this.typeChanged(this.type, void 0),
        this.sideChanged(),
        (this.gesture = Ie({
          el: document,
          gestureName: 'menu-swipe',
          gesturePriority: 30,
          threshold: 10,
          canStart: (e) => this.canStart(e),
          onWillStart: () => this.onWillStart(),
          onStart: () => this.onStart(),
          onMove: (e) => this.onMove(e),
          onEnd: (e) => this.onEnd(e),
        })),
        this.updateState(),
        document.addEventListener('click', this.onBackdropClick),
        this.actived && this.open()));
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onBackdropClick);
  },
  destroyed() {
    this.blocker.destroy(),
      this.animation && this.animation.destroy(),
      this.gesture && (this.gesture.destroy(), (this.gesture = void 0)),
      (this.animation = void 0),
      (this.contentEl = this.backdropEl = this.menuInnerEl = void 0);
  },
  render() {
    const e = arguments[0],
      {
        isEndSide: t,
        type: i,
        disabled: s,
        isPaneVisible: n,
        visible: a,
      } = this;
    return e(
      'div',
      {
        class: [
          Tl({
            [`type-${i}`]: !0,
            enabled: !s,
            'side-end': t,
            'side-start': !t,
            'pane-visible': n,
          }),
          { 'show-menu': a },
        ],
      },
      [
        e('div', { class: Tl('inner'), ref: 'menuInnerEl' }, [this.slots()]),
        e(ht, {
          class: Tl('backdrop'),
          ref: 'backdropEl',
          attrs: { tappable: !1, stopPropagation: !1 },
        }),
      ]
    );
  },
});
const { createComponent: Ml, bem: Il } = R('note');
var Pl = Ml({
  functional: !0,
  props: { color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n } = t;
    return e('div', b([{ class: [Il(), Ft(n)] }, i]), [s()]);
  },
});
const { createComponent: Al, bem: Ol } = R('progress-bar'),
  Bl = (e, t, i) => Math.max(e, Math.min(t, i)),
  Ll = (e) => [
    e('div', { class: 'indeterminate-bar-primary' }, [
      e('span', { class: 'progress-indeterminate' }),
    ]),
    e('div', { class: 'indeterminate-bar-secondary' }, [
      e('span', { class: 'progress-indeterminate' }),
    ]),
  ],
  zl = (e, t, i) => {
    const s = Bl(0, t, 1),
      n = Bl(0, i, 1);
    return [
      e('div', { class: 'progress', style: { transform: `scaleX(${s})` } }),
      1 !== n && e('div', { class: 'buffer-circles' }),
      e('div', {
        class: 'progress-buffer-bar',
        style: { transform: `scaleX(${n})` },
      }),
    ];
  };
var Dl = Al({
  mixins: [Gt()],
  props: {
    type: { type: String, default: 'determinate' },
    reversed: Boolean,
    value: { type: Number, default: 0 },
    buffer: { type: Number, default: 1 },
  },
  render(e) {
    const { type: t, value: i, paused: s, reversed: n, buffer: a } = this;
    return e(
      'div',
      {
        attrs: {
          role: 'progressbar',
          'aria-valuenow': 'determinate' === t ? i : null,
          'aria-valuemin': '0',
          'aria-valuemax': '1',
        },
        class: [
          Ol(),
          {
            [`progress-bar-${t}`]: !0,
            'progress-paused': s,
            'progress-bar-reversed': 'rtl' === document.dir ? !n : n,
          },
        ],
      },
      ['indeterminate' === t ? Ll(e) : zl(e, i, a)]
    );
  },
});
const { createComponent: Nl, bem: Hl } = R('radio-group');
var Rl = Nl({
  mixins: [Ci('RadioGroup')],
  props: { exclusive: { type: Boolean, default: !0 } },
  render() {
    return (0, arguments[0])(
      'div',
      b([{ class: Hl() }, { on: this.$listeners }]),
      [this.slots()]
    );
  },
});
const { createComponent: Vl, bem: Yl } = R('radio-indicator');
var ql = Vl({
  functional: !0,
  props: { checked: Boolean, disabled: Boolean },
  render(e, { props: t, data: i }) {
    const { checked: s, disabled: n } = t;
    return e('div', b([{ class: Yl({ checked: s, disabled: n }) }, i]), [
      e('div', { class: Yl('inner') }),
    ]);
  },
});
const { createComponent: Fl, bem: Gl } = R('radio');
var Xl = Fl({
  mixins: [Ai('RadioGroup'), Oi(), Gt()],
  inject: { Item: { default: void 0 } },
  data: () => ({ inItem: !1 }),
  mounted() {
    (this.inItem = null !== this.$el.closest('.line-item')), this.emitStyle();
  },
  methods: {
    emitStyle() {
      const { Item: e } = this;
      e &&
        e.itemStyle('radio', {
          'radio-checked': this.checked,
          'interactive-disabled': this.disabled,
        });
    },
    onClick() {
      this.disabled ||
        (this.$emit('clicked'),
        this.checkable &&
          ((this.RadioGroup && this.checked) ||
            ((this.checked = !this.checked),
            this.$emit('change', this.checked))));
    },
  },
  watch: {
    color() {
      this.emitStyle();
    },
    checked() {
      this.emitStyle();
    },
    disabled() {
      this.emitStyle();
    },
  },
  render() {
    const e = arguments[0],
      { checked: t, disabled: i, inItem: s } = this;
    return e(
      'div',
      b([
        {
          class: [Gl({ checked: t, disabled: i }), { 'in-item': s }],
          attrs: { role: 'radio' },
          on: { click: this.onClick },
        },
        { on: this.$listeners },
      ]),
      [
        e(ql, { attrs: { checked: t, disabled: i } }),
        this.slots(),
        e('button', { attrs: { type: 'button', disabled: i } }),
      ]
    );
  },
});
const { createComponent: Wl, bem: jl } = R('range');
function _l(e, t, i) {
  return e < t && (e = t), e > i && (e = i), e;
}
const Ul = (
    e,
    t,
    {
      knob: i,
      value: s,
      ratio: n,
      min: a,
      max: r,
      disabled: o,
      pressed: l,
      pin: d,
      handleKeyboard: c,
    }
  ) => {
    const h = t ? 'right' : 'left';
    return e(
      'div',
      {
        class: [
          jl('knob-handle', { min: s === a, max: s === r }),
          {
            'line-range__knob--pressed': l,
            'range-knob-a': 'A' === i,
            'range-knob-b': 'B' === i,
          },
        ],
        on: {
          keyDown: (e) => {
            const { key: t } = e;
            'ArrowLeft' === t || 'ArrowDown' === t
              ? (c(i, !1), e.preventDefault(), e.stopPropagation())
              : ('ArrowRight' !== t && 'ArrowUp' !== t) ||
                (c(i, !0), e.preventDefault(), e.stopPropagation());
          },
        },
        style: (() => {
          const e = {};
          return (e[h] = `${100 * n}%`), e;
        })(),
        attrs: {
          role: 'slider',
          tabindex: o ? -1 : 0,
          'aria-valuemin': a,
          'aria-valuemax': r,
          'aria-disabled': o ? 'true' : null,
          'aria-valuenow': s,
        },
      },
      [
        d &&
          e('div', { class: jl('pin'), attrs: { role: 'presentation' } }, [
            Math.round(s),
          ]),
        e('div', { class: jl('knob'), attrs: { role: 'presentation' } }),
      ]
    );
  },
  Kl = (e, t, i, s) => {
    let n = (i - t) * e;
    return s > 0 && (n = Math.round(n / s) * s + t), _l(t, n, i);
  },
  Jl = (e, t, i) => _l(0, (e - t) / (i - t), 1);
var Zl = Wl({
  mixins: [Gt()],
  inject: { Item: { default: void 0 } },
  props: {
    text: String,
    debounce: { type: Number, default: 0 },
    dualKnobs: Boolean,
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    pin: Boolean,
    snaps: Boolean,
    step: { type: Number, default: 1 },
    ticks: Boolean,
    disabled: Boolean,
    value: { type: [Number, Object], default: 0 },
  },
  data: () => ({
    hasFocus: !1,
    noUpdate: !1,
    pressedKnob: void 0,
    rangeSlider: void 0,
    rect: void 0,
    ratioA: 0,
    ratioB: 0,
  }),
  computed: {
    valA() {
      return Kl(this.ratioA, this.min, this.max, this.step);
    },
    valB() {
      return Kl(this.ratioB, this.min, this.max, this.step);
    },
    ratioLower() {
      return this.dualKnobs ? Math.min(this.ratioA, this.ratioB) : 0;
    },
    ratioUpper() {
      return this.dualKnobs ? Math.max(this.ratioA, this.ratioB) : this.ratioA;
    },
  },
  watch: {
    disabled() {
      this.disabledChanged();
    },
  },
  beforeMount() {
    this.updateRatio(), this.disabledChanged();
  },
  async mounted() {
    const { rangeSlider: e } = this.$refs;
    e &&
      ((this.gesture = Ie({
        el: e,
        gestureName: 'range',
        gesturePriority: 100,
        threshold: 0,
        onStart: (e) => this.onStart(e),
        onMove: (e) => this.onMove(e),
        onEnd: (e) => this.onEnd(e),
      })),
      this.gesture.enable(!this.disabled));
  },
  methods: {
    disabledChanged() {
      this.gesture && this.gesture.enable(!this.disabled), this.emitStyle();
    },
    valueChanged(e) {
      this.noUpdate || this.updateRatio(),
        (e = this.ensureValueInBounds(e)),
        this.$emit('change', { value: e });
    },
    clampBounds(e) {
      return _l(this.min, e, this.max);
    },
    ensureValueInBounds(e) {
      return this.dualKnobs
        ? { lower: this.clampBounds(e.lower), upper: this.clampBounds(e.upper) }
        : this.clampBounds(e);
    },
    handleKeyboard(e, t) {
      let { step: i } = this;
      (i = i > 0 ? i : 1),
        (i /= this.max - this.min),
        t || (i *= -1),
        'A' === e
          ? (this.ratioA = _l(0, this.ratioA + i, 1))
          : (this.ratioB = _l(0, this.ratioB + i, 1)),
        this.updateValue();
    },
    getValue() {
      const e = this.value || 0;
      return this.dualKnobs
        ? 'object' == typeof e
          ? e
          : { lower: 0, upper: e }
        : 'object' == typeof e
        ? e.upper
        : e;
    },
    emitStyle() {
      this.Item &&
        this.Item.itemStyle('range', {
          interactive: !0,
          'interactive-disabled': this.disabled,
        });
    },
    onStart(e) {
      const { rangeSlider: t } = this.$refs,
        i = (this.rect = t.getBoundingClientRect()),
        { currentX: s } = e;
      let n = _l(0, (s - i.left) / i.width, 1);
      'rtl' === document.dir && (n = 1 - n),
        (this.pressedKnob =
          !this.dualKnobs ||
          Math.abs(this.ratioA - n) < Math.abs(this.ratioB - n)
            ? 'A'
            : 'B'),
        this.setFocus(this.pressedKnob),
        this.update(s);
    },
    onMove(e) {
      this.update(e.currentX);
    },
    onEnd(e) {
      this.update(e.currentX), (this.pressedKnob = void 0);
    },
    update(e) {
      const { rect: t } = this;
      let i = _l(0, (e - t.left) / t.width, 1);
      'rtl' === document.dir && (i = 1 - i),
        this.snaps &&
          (i = Jl(Kl(i, this.min, this.max, this.step), this.min, this.max)),
        'A' === this.pressedKnob ? (this.ratioA = i) : (this.ratioB = i),
        this.updateValue();
    },
    updateRatio() {
      const e = this.getValue(),
        { min: t, max: i } = this;
      this.dualKnobs
        ? ((this.ratioA = Jl(e.lower, t, i)), (this.ratioB = Jl(e.upper, t, i)))
        : (this.ratioA = Jl(e, t, i));
    },
    updateValue() {
      this.noUpdate = !0;
      const { valA: e, valB: t } = this,
        i = this.dualKnobs
          ? { lower: Math.min(e, t), upper: Math.max(e, t) }
          : e;
      this.$emit('input', i), (this.noUpdate = !1);
    },
    setFocus(e) {
      const t = this.$el.querySelector(
        'A' === e ? '.range-knob-a' : '.range-knob-b'
      );
      t && t.focus();
    },
    onBlur() {
      this.hasFocus &&
        ((this.hasFocus = !1), this.$emit('blur'), this.emitStyle());
    },
    onFocus() {
      this.hasFocus ||
        ((this.hasFocus = !0), this.$emit('focus'), this.emitStyle());
    },
  },
  render(e) {
    const {
        min: t,
        max: i,
        step: s,
        handleKeyboard: n,
        pressedKnob: a,
        disabled: r,
        pin: o,
        ratioLower: l,
        ratioUpper: d,
      } = this,
      c = 'rtl' === document.dir,
      h = c ? 'right' : 'left',
      p = (e) => ({ [h]: e[h] }),
      u = { [h]: `${100 * l}%`, [c ? 'left' : 'right']: `${100 - 100 * d}%` },
      m = [];
    if (this.snaps && this.ticks)
      for (let e = t; e <= i; e += s) {
        const s = Jl(e, t, i),
          n = { ratio: s, active: s >= l && s <= d };
        (n[h] = `${100 * s}%`), m.push(n);
      }
    return e(
      'div',
      {
        class: jl({ disabled: r, pressed: void 0 !== a, 'has-pin': o }),
        on: { focus: this.onFocus, blur: this.onBlur },
      },
      [
        this.slots('start'),
        e('div', { class: jl('slider'), ref: 'rangeSlider' }, [
          m.map((t) =>
            e('div', {
              style: p(t),
              attrs: { role: 'presentation' },
              class: jl('tick', { active: t.active }),
            })
          ),
          e('div', { class: jl('bar'), attrs: { role: 'presentation' } }),
          e('div', {
            class: jl('bar', { active: !0 }),
            attrs: { role: 'presentation' },
            style: u,
          }),
          Ul(e, c, {
            knob: 'A',
            pressed: 'A' === a,
            value: this.valA,
            ratio: this.ratioA,
            pin: o,
            disabled: r,
            handleKeyboard: n,
            min: t,
            max: i,
          }),
          this.dualKnobs &&
            Ul(e, c, {
              knob: 'B',
              pressed: 'B' === a,
              value: this.valB,
              ratio: this.ratioB,
              pin: o,
              disabled: r,
              handleKeyboard: n,
              min: t,
              max: i,
            }),
        ]),
        this.slots('end'),
      ]
    );
  },
});
const Ql = (e, t) => {
    const i = e.querySelector(
        '.line-refresher-content .refresher-pulling .line-spinner'
      ),
      s = e.querySelector(
        '.line-refresher-content .refresher-refreshing .line-spinner'
      );
    return (
      null !== i &&
      null !== s &&
      (('ios' === t &&
        qe('mobile') &&
        void 0 !== e.style.webkitOverflowScrolling) ||
        'md' === t)
    );
  },
  ed = (e) =>
    new Promise((t) => {
      ((e, t) => {
        let i;
        const s = { passive: !0 },
          n = () => {
            i && i();
          },
          a = (i) => {
            e === i.target && (n(), t(i));
          };
        e &&
          (e.addEventListener('webkitTransitionEnd', a, s),
          e.addEventListener('transitionend', a, s),
          (i = () => {
            e.removeEventListener('webkitTransitionEnd', a, s),
              e.removeEventListener('transitionend', a, s);
          }));
      })(e, t);
    }),
  td = (e) => {
    const t = e.querySelector('.line-spinner'),
      i = t.shadowRoot.querySelector('circle'),
      s = e.querySelector('.spinner-arrow-container'),
      n = e.querySelector('.arrow-container'),
      a = n ? n.querySelector('.line-icon') : null,
      r = it().duration(1e3).easing('ease-out'),
      o = it()
        .addElement(s)
        .keyframes([
          { offset: 0, opacity: '0.3' },
          { offset: 0.45, opacity: '0.3' },
          { offset: 0.55, opacity: '1' },
          { offset: 1, opacity: '1' },
        ]),
      l = it()
        .addElement(i)
        .keyframes([
          { offset: 0, strokeDasharray: '1px, 200px' },
          { offset: 0.2, strokeDasharray: '1px, 200px' },
          { offset: 0.55, strokeDasharray: '100px, 200px' },
          { offset: 1, strokeDasharray: '100px, 200px' },
        ]),
      d = it()
        .addElement(t)
        .keyframes([
          { offset: 0, transform: 'rotate(-90deg)' },
          { offset: 1, transform: 'rotate(210deg)' },
        ]);
    if (n && a) {
      const e = it()
          .addElement(n)
          .keyframes([
            { offset: 0, transform: 'rotate(0deg)' },
            { offset: 0.3, transform: 'rotate(0deg)' },
            { offset: 0.55, transform: 'rotate(280deg)' },
            { offset: 1, transform: 'rotate(400deg)' },
          ]),
        t = it()
          .addElement(a)
          .keyframes([
            { offset: 0, transform: 'translateX(2px) scale(0)' },
            { offset: 0.3, transform: 'translateX(2px) scale(0)' },
            { offset: 0.55, transform: 'translateX(-1.5px) scale(1)' },
            { offset: 1, transform: 'translateX(-1.5px) scale(1)' },
          ]);
      r.addAnimation([e, t]);
    }
    return r.addAnimation([o, l, d]);
  },
  id = (e, t) =>
    'scale' === e
      ? ((e) => {
          const t = e.clientHeight,
            i = it()
              .addElement(e)
              .keyframes([
                { offset: 0, transform: `scale(0) translateY(-${t + 20}px)` },
                { offset: 1, transform: 'scale(1) translateY(100px)' },
              ]);
          return td(e).addAnimation([i]);
        })(t)
      : ((e) => {
          const t = e.clientHeight,
            i = it()
              .addElement(e)
              .keyframes([
                { offset: 0, transform: `translateY(-${t + 20}px)` },
                { offset: 1, transform: 'translateY(100px)' },
              ]);
          return td(e).addAnimation([i]);
        })(t),
  sd = (e, t) => {
    e.style.setProperty('opacity', t.toString());
  },
  nd = (t, i) => {
    if (!t) return Promise.resolve();
    const s = ed(t);
    return (
      e.nextTick(() => {
        t.style.setProperty('transition', '0.2s all ease-out'),
          void 0 === i
            ? t.style.removeProperty('transform')
            : t.style.setProperty('transform', `translate3d(0px, ${i}, 0px)`);
      }),
      s
    );
  },
  { createComponent: ad, bem: rd } = R('refresher'),
  od = (e, t, i) => Math.max(e, Math.min(t, i));
var ld = ad({
  props: {
    pullMin: { type: Number, default: 60 },
    pullMax: { type: Number, default: 120 },
    closeDuration: { type: String, default: '280ms' },
    snapbackDuration: { type: String, default: '280ms' },
    pullFactor: { type: Number, default: 1 },
    disabled: Boolean,
  },
  data: () => ({
    appliedStyles: !1,
    didStart: !1,
    progress: 0,
    scrollListenerCallback: void 0,
    pointerDown: !1,
    needsCompletion: !1,
    didRefresh: !1,
    lastVelocityY: 0,
    nativeRefresher: !1,
    state: 1,
  }),
  computed: {
    style() {
      const e = {
        transform: `translate3d(0, ${this.top}px, 0)`,
        'transition-duration': '',
      };
      return this.touching || (e['transition-duration'] = '300ms'), e;
    },
    down() {
      return 0 === this.state;
    },
    up() {
      return 1 === this.state;
    },
    refresher() {
      return 2 === this.state;
    },
  },
  methods: {
    checkNativeRefresher() {
      const { mode: e } = this,
        t = Ql(this.$el, e);
      if (t && !this.nativeRefresher) {
        this.setupNativeRefresher(
          'line-content' === this.$parent.$options.name
            ? this.$parent.$el
            : null
        );
      } else t || this.destroyNativeRefresher();
    },
    destroyNativeRefresher() {
      this.scrollEl &&
        this.scrollListenerCallback &&
        (this.scrollEl.removeEventListener(
          'scroll',
          this.scrollListenerCallback
        ),
        (this.scrollListenerCallback = void 0)),
        (this.nativeRefresher = !1);
    },
    async resetNativeRefresher(e, t) {
      this.state = t;
      const { mode: i } = this;
      'ios' === i
        ? await nd(e, void 0)
        : await ed(this.$el.querySelector('.refresher-refreshing-icon')),
        (this.didRefresh = !1),
        (this.needsCompletion = !1),
        (this.pointerDown = !1),
        this.animations.forEach((e) => e.destroy()),
        (this.animations = []),
        (this.progress = 0),
        (this.state = 1);
    },
    async setupIOSNativeRefresher(t, i) {
      this.elementToTransform = this.scrollEl;
      const s = t && t.shadowRoot.querySelectorAll('svg'),
        n = 0.16 * this.scrollEl.clientHeight,
        a = s.length;
      this.$nextTick(() =>
        s.forEach((e) => e.style.setProperty('animation', 'none'))
      ),
        (this.scrollListenerCallback = () => {
          (this.pointerDown || 1 !== this.state) &&
            this.$nextTick(() => {
              const { scrollTop: r } = this.scrollEl,
                o = this.$el.clientHeight;
              if (r > 0) {
                if (8 === this.state) {
                  const e = od(0, r / (0.5 * o), 1);
                  return void this.$nextTick(() => sd(i, 1 - e));
                }
                return void this.$nextTick(() => sd(t, 0));
              }
              this.pointerDown &&
                (this.didStart || ((this.didStart = !0), this.$emit('start')),
                this.pointerDown && this.$emit('pull'));
              const l = od(0, Math.abs(r) / o, 0.99),
                d = (this.progress = od(0, (Math.abs(r) - 30) / n, 1)),
                c = od(0, Math.floor(d * a), a - 1);
              var h, p;
              8 === this.state || c === a - 1
                ? (this.pointerDown &&
                    ((h = i),
                    (p = this.lastVelocityY),
                    e.nextTick(() => {
                      h.style.setProperty(
                        '--refreshing-rotation-duration',
                        p >= 1 ? '0.5s' : '2s'
                      ),
                        h.style.setProperty('opacity', '1');
                    })),
                  this.didRefresh ||
                    (this.beginRefresh(),
                    (this.didRefresh = !0),
                    this.pointerDown || nd(this.elementToTransform, `${o}px`)))
                : ((this.state = 2),
                  ((t, i, s, n) => {
                    e.nextTick(() => {
                      sd(t, s),
                        i.forEach((e, t) =>
                          e.style.setProperty('opacity', t <= n ? '0.99' : '0')
                        );
                    });
                  })(t, s, l, c));
            });
        }),
        this.scrollEl.addEventListener('scroll', this.scrollListenerCallback),
        (this.gesture = Ie({
          el: this.scrollEl,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 5,
          onStart: () => {
            (this.pointerDown = !0),
              this.didRefresh || nd(this.elementToTransform, '0px');
          },
          onMove: (e) => {
            this.lastVelocityY = e.velocityY;
          },
          onEnd: () => {
            (this.pointerDown = !1),
              (this.didStart = !1),
              this.needsCompletion
                ? (this.resetNativeRefresher(this.elementToTransform, 32),
                  (this.needsCompletion = !1))
                : this.didRefresh &&
                  this.$nextTick(() =>
                    nd(this.elementToTransform, `${this.$el.clientHeight}px`)
                  );
          },
        })),
        this.disabledChanged();
    },
    async setupMDNativeRefresher(e, t, i) {
      const s = t && t.shadowRoot.querySelector('circle'),
        n = this.$el.querySelector(
          '.line-refresher-content .refresher-pulling-icon'
        ),
        a = i && i.shadowRoot.querySelector('circle');
      null !== s &&
        null !== a &&
        this.$nextTick(() => {
          s.style.setProperty('animation', 'none'),
            i.style.setProperty('animation-delay', '-655ms'),
            a.style.setProperty('animation-delay', '-655ms');
        }),
        (this.gesture = Ie({
          el: this.scrollEl,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 5,
          canStart: () =>
            8 !== this.state &&
            32 !== this.state &&
            0 === this.scrollEl.scrollTop,
          onStart: (e) => {
            e.data = { animation: void 0, didStart: !1, cancelled: !1 };
          },
          onMove: (t) => {
            if (
              (t.velocityY < 0 && 0 === this.progress && !t.data.didStart) ||
              t.data.cancelled
            )
              t.data.cancelled = !0;
            else {
              if (!t.data.didStart)
                return (
                  (t.data.didStart = !0),
                  (this.state = 2),
                  void this.$nextTick(() => {
                    const i = ((e) => {
                        const t = e.previousElementSibling;
                        return null !== t && 'ION-HEADER' === t.tagName
                          ? 'translate'
                          : 'scale';
                      })(e),
                      s = id(i, n);
                    (t.data.animation = s),
                      this.scrollEl.style.setProperty('--overflow', 'hidden'),
                      s.progressStart(!1, 0),
                      this.$emit('start'),
                      this.animations.push(s);
                  })
                );
              (this.progress = od(0, (t.deltaY / 180) * 0.5, 1)),
                t.data.animation.progressStep(this.progress),
                this.$emit('pull');
            }
          },
          onEnd: (e) => {
            if (!e.data.didStart) return;
            if (
              (this.$nextTick(() =>
                this.scrollEl.style.removeProperty('--overflow')
              ),
              this.progress <= 0.4)
            )
              return (
                this.gesture.enable(!1),
                void e.data.animation
                  .progressEnd(0, this.progress, 500)
                  .onFinish(() => {
                    this.animations.forEach((e) => e.destroy()),
                      (this.animations = []),
                      this.gesture.enable(!0),
                      (this.state = 1);
                  })
              );
            const t = st([0, 0], [0, 0], [1, 1], [1, 1], this.progress)[0],
              i = ((e) =>
                it()
                  .duration(125)
                  .addElement(e)
                  .fromTo(
                    'transform',
                    'translateY(var(--line-pulling-refresher-translate, 100px))',
                    'translateY(0px)'
                  ))(n);
            this.animations.push(i),
              this.$nextTick(async () => {
                n.style.setProperty(
                  '--line-pulling-refresher-translate',
                  `${100 * t}px`
                ),
                  e.data.animation.progressEnd(),
                  await i.play(),
                  this.beginRefresh(),
                  e.data.animation.destroy();
              });
          },
        })),
        this.disabledChanged();
    },
    async setupNativeRefresher(e) {
      if (
        this.scrollListenerCallback ||
        !e ||
        this.nativeRefresher ||
        !this.scrollEl
      )
        return;
      this.nativeRefresher = !0;
      const t = this.$el.querySelector(
          '.line-refresher-content .refresher-pulling .line-spinner'
        ),
        i = this.$el.querySelector(
          '.line-refresher-content .refresher-refreshing .line-spinner'
        ),
        { mode: s } = this;
      'ios' === s
        ? this.setupIOSNativeRefresher(t, i)
        : this.setupMDNativeRefresher(e, t, i);
    },
    async complete() {
      this.nativeRefresher
        ? ((this.needsCompletion = !0),
          this.pointerDown ||
            this.resetNativeRefresher(this.elementToTransform, 32))
        : this.close(32, '120ms');
    },
    async cancel() {
      this.nativeRefresher
        ? this.pointerDown ||
          this.resetNativeRefresher(this.elementToTransform, 16)
        : this.close(16, '');
    },
    getProgress() {
      return Promise.resolve(this.progress);
    },
    canStart() {
      return (
        !!this.scrollEl && 1 === this.state && !(this.scrollEl.scrollTop > 0)
      );
    },
    onStart() {
      (this.progress = 0), (this.state = 1);
    },
    onMove(e) {
      if (!this.scrollEl) return;
      const t = e.event;
      if (t.touches && t.touches.length > 1) return;
      if (0 != (56 & this.state)) return;
      const i =
          Number.isNaN(this.pullFactor) || this.pullFactor < 0
            ? 1
            : this.pullFactor,
        s = e.deltaY * i;
      if (s <= 0)
        return (
          (this.progress = 0),
          (this.state = 1),
          this.appliedStyles ? void this.setCss(0, '', !1, '') : void 0
        );
      if (1 === this.state) {
        if (this.scrollEl.scrollTop > 0) return void (this.progress = 0);
        this.state = 2;
      }
      if (
        (t.cancelable && t.preventDefault(),
        this.setCss(s, '0ms', !0, ''),
        0 === s)
      )
        return void (this.progress = 0);
      const { pullMin: n } = this;
      (this.progress = s / n),
        this.didStart || ((this.didStart = !0), this.$emit('start')),
        this.$emit('pull'),
        s < n
          ? (this.state = 2)
          : s > this.pullMax
          ? this.beginRefresh()
          : (this.state = 4);
    },
    onEnd() {
      4 === this.state
        ? this.beginRefresh()
        : 2 === this.state && this.cancel();
    },
    beginRefresh() {
      (this.state = 8),
        this.setCss(this.pullMin, this.snapbackDuration, !0, ''),
        this.$emit('refresh', { complete: this.complete.bind(this) });
    },
    close(e, t) {
      setTimeout(() => {
        (this.state = 1),
          (this.progress = 0),
          (this.didStart = !1),
          this.setCss(0, '0ms', !1, '');
      }, 600),
        (this.state = e),
        this.setCss(0, this.closeDuration, !0, t);
    },
    setCss(e, t, i, s) {
      this.nativeRefresher ||
        ((this.appliedStyles = e > 0),
        this.$nextTick(() => {
          if (this.scrollEl && this.backgroundContentEl) {
            const n = this.scrollEl.style,
              a = this.backgroundContentEl.style;
            (n.transform = a.transform =
              e > 0 ? `translateY(${e}px) translateZ(0px)` : ''),
              (n.transitionDuration = a.transitionDuration = t),
              (n.transitionDelay = a.transitionDelay = s),
              (n.overflow = i ? 'hidden' : '');
          }
        }));
    },
    disabledChanged() {
      this.gesture && this.gesture.enable(!this.disabled);
    },
  },
  watch: {
    disabled() {
      this.disabledChanged();
    },
  },
  async mounted() {
    this.checkNativeRefresher();
    const e =
      'line-content' === this.$parent.$options.name ? this.$parent.$el : null;
    if (!e) return;
    (this.scrollEl = await this.$parent.getScrollElement()),
      (this.backgroundContentEl = this.$parent.$refs.backgroundContentEl);
    const { mode: t } = this;
    Ql(this.$el, t)
      ? this.setupNativeRefresher(e)
      : ((this.gesture = Ie({
          el: e,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 20,
          passive: !1,
          canStart: () => this.canStart(),
          onStart: () => this.onStart(),
          onMove: (e) => this.onMove(e),
          onEnd: () => this.onEnd(),
        })),
        this.disabledChanged());
  },
  render() {
    const e = arguments[0],
      { mode: t } = this;
    return e(
      'div',
      {
        class: [
          rd(),
          {
            [`refresher-${t}`]: !0,
            'refresher-native': this.nativeRefresher,
            'refresher-active': 1 !== this.state,
            'refresher-pulling': 2 === this.state,
            'refresher-ready': 4 === this.state,
            'refresher-refreshing': 8 === this.state,
            'refresher-cancelling': 16 === this.state,
            'refresher-completing': 32 === this.state,
          },
        ],
      },
      [this.slots()]
    );
  },
});
const dd = (e) => {
    try {
      if ('string' != typeof e || '' === e) return e;
      const t = document.createDocumentFragment(),
        i = document.createElement('div');
      t.appendChild(i),
        (i.innerHTML = e),
        ud.forEach((e) => {
          const i = t.querySelectorAll(e);
          for (let e = i.length - 1; e >= 0; e--) {
            const s = i[e];
            s.parentNode ? s.parentNode.removeChild(s) : t.removeChild(s);
            const n = hd(s);
            for (let e = 0; e < n.length; e++) cd(n[e]);
          }
        });
      const s = hd(t);
      for (let e = 0; e < s.length; e++) cd(s[e]);
      const n = document.createElement('div');
      n.appendChild(t);
      const a = n.querySelector('div');
      return null !== a ? a.innerHTML : n.innerHTML;
    } catch (e) {
      return '';
    }
  },
  cd = (e) => {
    if (e.nodeType && 1 !== e.nodeType) return;
    for (let t = e.attributes.length - 1; t >= 0; t--) {
      const i = e.attributes.item(t),
        s = i.name;
      if (!pd.includes(s.toLowerCase())) {
        e.removeAttribute(s);
        continue;
      }
      const n = i.value;
      null != n &&
        n.toLowerCase().includes('javascript:') &&
        e.removeAttribute(s);
    }
    const t = hd(e);
    for (let e = 0; e < t.length; e++) cd(t[e]);
  },
  hd = (e) => (null != e.children ? e.children : e.childNodes),
  pd = ['class', 'id', 'href', 'src', 'name', 'slot'],
  ud = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'],
  { createComponent: md, bem: fd } = R('refresher-content');
var gd = md({
  props: {
    pullingIcon: String,
    pullingText: String,
    refreshingSpinner: String,
    refreshingText: String,
  },
  data: () => ({ icon: '', spinner: '' }),
  beforeMount() {
    (this.icon = this.pullingIcon), (this.spinner = this.refreshingSpinner);
  },
  mounted() {
    if (void 0 === this.pullingIcon) {
      const { mode: e } = this,
        t =
          void 0 !== this.$el.style.webkitOverflowScrolling
            ? 'lines'
            : 'arrow-down';
      this.icon = Fe.get(
        'refreshingIcon',
        'ios' === e && qe('mobile') ? Fe.get('spinner', t) : 'circular'
      );
    }
    if (void 0 === this.refreshingSpinner) {
      const { mode: e } = this;
      this.spinner = Fe.get(
        'refreshingSpinner',
        Fe.get('spinner', 'ios' === e ? 'lines' : 'circular')
      );
    }
  },
  render() {
    const e = arguments[0],
      {
        icon: t,
        pullingText: i,
        spinner: s,
        refreshingText: n,
        mode: a,
      } = this,
      r = null != t && void 0 !== On[t];
    return e('div', { class: fd() }, [
      e('div', { class: 'refresher-pulling' }, [
        t &&
          r &&
          e('div', { class: 'refresher-pulling-icon' }, [
            e('div', { class: 'spinner-arrow-container' }, [
              e(Nn, { attrs: { type: t, paused: !0 } }),
              'md' === a &&
                'circular' === t &&
                e('div', { class: 'arrow-container' }, [
                  e('line-icon', { attrs: { name: 'caret-back-sharp' } }),
                ]),
            ]),
          ]),
        t &&
          !r &&
          e('div', { class: 'refresher-pulling-icon' }, [
            e('line-icon', { attrs: { icon: t, lazy: !1 } }),
          ]),
        i &&
          e('div', {
            class: 'refresher-pulling-text',
            attrs: { innerHTML: dd(i) },
          }),
      ]),
      e('div', { class: 'refresher-refreshing' }, [
        s &&
          e('div', { class: 'refresher-refreshing-icon' }, [
            e(Nn, { attrs: { type: s } }),
          ]),
        n &&
          e('div', {
            class: 'refresher-refreshing-text',
            attrs: { innerHTML: dd(n) },
          }),
      ]),
    ]);
  },
});
const { createComponent: vd, bem: bd } = R('reorder');
var yd = vd({
  data: () => ({ reorderIndex: -1 }),
  render() {
    const e = arguments[0];
    return e('div', { class: bd() }, [
      this.slots() ||
        e('line-icon', {
          class: bd('icon'),
          attrs: { size: 'small', name: 'menu', lazy: !1 },
        }),
    ]);
  },
});
const { createComponent: wd, bem: xd } = R('reorder-group'),
  Sd = (e) => e.$lineIndex;
var Ed = wd({
  inject: { Content: { default: void 0 } },
  props: { disabled: { type: Boolean, default: !0 } },
  data: () => ({ state: 0 }),
  beforeMount() {
    (this.lastToIndex = -1),
      (this.cachedHeights = []),
      (this.scrollElTop = 0),
      (this.scrollElBottom = 0),
      (this.scrollElInitial = 0),
      (this.containerTop = 0),
      (this.containerBottom = 0);
  },
  async mounted() {
    const e = this.Content;
    e && (this.scrollEl = await e.getScrollElement()),
      (this.gesture = Ie({
        el: this.$el,
        gestureName: 'reorder',
        gesturePriority: 110,
        threshold: 0,
        direction: 'y',
        passive: !1,
        canStart: (e) => this.canStart(e),
        onStart: (e) => this.onStart(e),
        onMove: (e) => this.onMove(e),
        onEnd: () => this.onEnd(),
      })),
      this.disabledChanged();
  },
  beforeDestroy() {
    this.onEnd(),
      this.gesture && (this.gesture.destroy(), (this.gesture = void 0));
  },
  methods: {
    disabledChanged() {
      this.gesture && this.gesture.enable(!this.disabled);
    },
    complete(e) {
      return Promise.resolve(this.completeSync(e));
    },
    canStart(e) {
      if (this.selectedItemEl || 0 !== this.state) return !1;
      const t = e.event.target.closest('.line-reorder');
      if (!t) return !1;
      const i = ((e, t) => {
        let i;
        for (; e; ) {
          if (((i = e.parentElement), i === t)) return e;
          e = i;
        }
      })(t, this.$el);
      return !!i && ((e.data = i), !0);
    },
    onStart(e) {
      e.event.preventDefault();
      const t = (this.selectedItemEl = e.data),
        i = this.cachedHeights;
      i.length = 0;
      const { $el: s } = this,
        { children: n } = s;
      if (!n || 0 === n.length) return;
      let a = 0;
      for (let e = 0; e < n.length; e++) {
        const t = n[e];
        (a += t.offsetHeight), i.push(a), (t.$lineIndex = e);
      }
      const r = s.getBoundingClientRect();
      if (
        ((this.containerTop = r.top),
        (this.containerBottom = r.bottom),
        this.scrollEl)
      ) {
        const e = this.scrollEl.getBoundingClientRect();
        (this.scrollElInitial = this.scrollEl.scrollTop),
          (this.scrollElTop = e.top + 60),
          (this.scrollElBottom = e.bottom - 60);
      } else
        (this.scrollElInitial = 0),
          (this.scrollElTop = 0),
          (this.scrollElBottom = 0);
      (this.lastToIndex = Sd(t)),
        (this.selectedItemHeight = t.offsetHeight),
        (this.state = 1),
        t.classList.add('line-reorder--selected');
    },
    onMove(e) {
      const t = this.selectedItemEl;
      if (!t) return;
      const i = this.autoscroll(e.currentY),
        s = this.containerTop - i,
        n = Math.max(s, Math.min(e.currentY, this.containerBottom - i)),
        a = i + n - e.startY,
        r = this.itemIndexForTop(n - s);
      if (r !== this.lastToIndex) {
        const e = Sd(t);
        (this.lastToIndex = r), this.reorderMove(e, r);
      }
      t.style.transform = `translateY(${a}px)`;
    },
    onEnd() {
      const { selectedItemEl: e } = this;
      if (((this.state = 2), !e)) return void (this.state = 0);
      const t = this.lastToIndex,
        i = Sd(e);
      t === i
        ? this.completeSync()
        : this.$emit('itemReorder', {
            from: i,
            to: t,
            complete: this.completeSync.bind(this),
          });
    },
    completeSync(e) {
      const { selectedItemEl: t } = this;
      if (t && 2 === this.state) {
        const i = this.$el.children,
          s = i.length,
          n = this.lastToIndex,
          a = Sd(t);
        if (n !== a && (!e || !0 === e)) {
          this.$el.insertBefore(t, a < n ? i[n + 1] : i[n]);
        }
        Array.isArray(e) &&
          (e = ((e, t, i) => {
            const s = e[t];
            return e.splice(t, 1), e.splice(i, 0, s), e.slice();
          })(e, a, n));
        for (let e = 0; e < s; e++) i[e].style.transform = '';
        (t.style.transition = ''),
          t.classList.remove('line-reorder--selected'),
          (this.selectedItemEl = void 0),
          (this.state = 0);
      }
      return e;
    },
    itemIndexForTop(e) {
      const t = this.cachedHeights;
      let i = 0;
      for (i = 0; i < t.length && !(t[i] > e); i++);
      return i;
    },
    reorderMove(e, t) {
      const i = this.selectedItemHeight,
        { children: s } = this.$el;
      for (let n = 0; n < s.length; n++) {
        const { style: a } = s[n];
        let r = '';
        n > e && n <= t
          ? (r = `translateY(${-i}px)`)
          : n < e && n >= t && (r = `translateY(${i}px)`),
          (a.transform = r);
      }
    },
    autoscroll(e) {
      if (!this.scrollEl) return 0;
      let t = 0;
      return (
        e < this.scrollElTop ? (t = -10) : e > this.scrollElBottom && (t = 10),
        0 !== t && this.scrollEl.scrollBy(0, t),
        this.scrollEl.scrollTop - this.scrollElInitial
      );
    },
  },
  watch: {
    disabled() {
      this.disabledChanged();
    },
  },
  render() {
    const e = arguments[0],
      { disabled: t, state: i } = this;
    return e('div', { class: xd({ enabled: !t, 'list-active': 0 !== i }) }, [
      this.slots(),
    ]);
  },
});
const { createComponent: Td, bem: $d } = R('row');
var Cd = Td({
  functional: !0,
  render: (e, { data: t, slots: i }) =>
    e('div', b([{ class: $d() }, t]), [i()]),
});
const { createComponent: kd, bem: Md } = R('segment');
var Id = kd({
  mixins: [Ci('Segment'), Gt()],
  inject: { Item: { default: void 0 } },
  props: {
    disabled: Boolean,
    scrollable: Boolean,
    exclusive: { type: Boolean, default: !0 },
  },
  data: () => ({
    activated: !1,
    inToolbar: !1,
    inToolbarColor: !1,
    gesture: {},
    didInit: !1,
    valueAfterGesture: null,
  }),
  async mounted() {
    await this.$nextTick(),
      (this.inToolbar = null !== this.$el.closest('.line-toolbar')),
      (this.inToolbarColor =
        null !== this.$el.closest('.line-toolbar.line-color')),
      this.setCheckedClasses(),
      (this.gesture = Ie({
        el: this.$el,
        gestureName: 'segment',
        gesturePriority: 100,
        threshold: 0,
        passive: !1,
        onStart: (e) => this.onStart(e),
        onMove: (e) => this.onMove(e),
        onEnd: (e) => this.onEnd(e),
      })),
      this.gesture.enable(!this.scrollable),
      this.gestureChanged(),
      this.disabled && this.disabledChanged(),
      (this.didInit = !0);
  },
  methods: {
    disabledChanged() {
      this.gestureChanged();
      const { items: e } = this;
      for (const t of e) t.disabled = this.disabled;
    },
    gestureChanged() {
      this.gesture && !this.scrollable && this.gesture.enable(!this.disabled);
    },
    onStart(e) {
      this.activate(e);
    },
    onMove(e) {
      this.setNextIndex(e);
    },
    onEnd(e) {
      this.setActivated(!1);
      this.setNextIndex(e, !0);
      e.event.stopImmediatePropagation();
    },
    addRipple(e) {
      if (!(Fe.getBoolean('animated', !0) && Fe.getBoolean('rippleEffect', !0)))
        return;
      const { items: t } = this,
        i = t.find((e) => e.modelValue === this.value),
        s = (i.shadowRoot || i).querySelector('.line-ripple-effect');
      if (!s) return;
      const { x: n, y: a } = se(e.event);
      s.addRipple(n, a).then((e) => e());
    },
    setActivated(e) {
      const { items: t } = this;
      t.forEach((t) => {
        t.activated = e;
      }),
        (this.activated = e);
    },
    activate(e) {
      const { items: t, checkedItemValue: i } = this,
        s = e.event.target,
        n = t.find((e) => e.$el === s);
      (n && 'line-segment-button' !== n.$options.name) ||
        (((r(i) && !i.length) || !i) && n.updateState(),
        this.checkedItemValue === n.modelValue && this.setActivated(!0));
    },
    async checkButton(e, t) {
      const i = e.indicatorEl,
        s = t.indicatorEl;
      if (null === i || null === s) return;
      const n = i.getBoundingClientRect(),
        a = s.getBoundingClientRect(),
        r = `translate3d(${n.left - a.left}px, 0, 0) scaleX(${
          n.width / a.width
        })`;
      this.$nextTick(() => {
        s.classList.remove('line-segment-button__indicator--animated'),
          s.style.setProperty('transform', r),
          s.getBoundingClientRect(),
          s.classList.add('line-segment-button__indicator--animated'),
          s.style.setProperty('transform', '');
      }),
        t.updateState(),
        await this.$nextTick(),
        this.setCheckedClasses();
    },
    setCheckedClasses() {
      const { items: e, checkedItem: t } = this,
        i = e.findIndex((e) => e === t) + 1;
      for (const t of e) t.afterChecked = !1;
      i < e.length && (e[i].afterChecked = !0);
    },
    setNextIndex(e, t = !1) {
      const i = 'rtl' === document.dir,
        { activated: s } = this,
        { items: n, checkedItem: a } = this;
      let o = 0;
      if (
        ((a || (r(a) && a.length)) && (o = n.findIndex((e) => e === a)),
        -1 === o)
      )
        return;
      const l = n[o];
      let d, c;
      const h = l.$el.getBoundingClientRect(),
        { left: p } = h,
        { width: u } = h,
        { currentX: m } = e,
        f = document.elementFromPoint(m, h.top + h.height / 2);
      if (s && !t) {
        if (i ? m > p + u : m < p) {
          const e = o - 1;
          e >= 0 && (c = e);
        } else if ((i ? m < p : m > p + u) && s && !t) {
          const e = o + 1;
          e < n.length && (c = e);
        }
        void 0 === c || n[c].disabled || (d = n[c]);
      }
      if ((!s && t && (d = n.find((e) => e.$el === f)), null != d)) {
        if ('line-segment' === d.$options.name) return !1;
        l !== d && this.checkButton(l, d);
      }
      return !0;
    },
    emitStyle() {
      this.Item && this.Item.itemStyle('segment', { segment: !0 });
    },
    onClick(e) {
      const { items: t } = this,
        i = t.find((t) => t.$el === e.target),
        s = this.checkedItem;
      i && (i.updateState(), s && this.scrollable && this.checkButton(s, i));
    },
  },
  watch: {
    disabled() {
      this.disabledChanged();
    },
  },
  render() {
    const e = arguments[0],
      {
        inToolbar: t,
        inToolbarColor: i,
        activated: s,
        disabled: n,
        scrollable: a,
      } = this;
    return e(
      'div',
      {
        class: [
          Md({ activated: s, disabled: n, scrollable: a }),
          { 'in-toolbar': t, 'in-toolbar-color': i },
        ],
        on: { click: this.onClick },
      },
      [this.slots()]
    );
  },
});
const { createComponent: Pd, bem: Ad } = R('segment-button');
var Od = Pd({
  mixins: [Ai('Segment')],
  props: {
    layout: { type: String, default: 'icon-top' },
    type: { type: String, default: 'button' },
  },
  data: () => ({
    activated: !1,
    afterChecked: !1,
    inToolbar: !1,
    inToolbarColor: !1,
    inSegment: !1,
    inSegmentColor: !1,
    hasLabel: !1,
    hasIcon: !1,
  }),
  async mounted() {
    const { $el: e } = this;
    (this.inToolbar = null !== e.closest('.line-toolbar')),
      (this.inToolbarColor = null !== e.closest('.line-toolbar.line-color')),
      (this.inSegment = null !== e.closest('.line-segment')),
      (this.inSegmentColor = null !== e.closest('.line-segment.line-color')),
      (this.hasLabel = e && !!e.querySelector('.line-label')),
      (this.hasIcon = e && !!e.querySelector('.line-icon')),
      (this.indicatorEl = this.$refs.indicatorEl);
  },
  methods: {
    updateState() {
      this.checked = !0;
    },
  },
  render() {
    const e = arguments[0],
      {
        mode: t,
        checked: i,
        type: s,
        disabled: n,
        activated: a,
        afterChecked: r,
        hasIcon: o,
        hasLabel: l,
        layout: d,
        inToolbar: c,
        inToolbarColor: h,
        inSegment: p,
        inSegmentColor: u,
      } = this;
    return e(
      'div',
      {
        attrs: { 'aria-disabled': n ? 'true' : null },
        class: [
          Ad({
            'has-label': l,
            'has-icon': o,
            'has-label-only': l && !o,
            'has-icon-only': o && !l,
            'after-checked': r,
            [`layout-${d}`]: !0,
            disabled: n,
            checked: i,
            activated: a,
          }),
          {
            'in-toolbar': c,
            'in-toolbar-color': h,
            'in-segment': p,
            'in-segment-color': u,
            'line-activatable': !0,
            'line-activatable-instant': !0,
            'line-focusable': !0,
          },
        ],
      },
      [
        e(
          'button',
          {
            attrs: { type: s, 'aria-pressed': i ? 'true' : null, disabled: n },
            class: Ad('button-native'),
          },
          [
            e('span', { class: Ad('button-inner') }, [this.slots()]),
            'md' === t && e('line-ripple-effect'),
          ]
        ),
        e(
          'div',
          {
            attrs: { part: 'indicator' },
            class: Ad('indicator', { animated: !0 }),
            ref: 'indicatorEl',
          },
          [
            e('div', {
              attrs: { part: 'indicator-background' },
              class: Ad('indicator-background'),
            }),
          ]
        ),
      ]
    );
  },
});
const { createComponent: Bd, bem: Ld } = R('skeleton-text');
var zd = Bd({
  props: { animated: Boolean },
  render() {
    const e = arguments[0],
      t = this.animated && Fe.getBoolean('animated', !0),
      i =
        this.$el &&
        (this.$el.closest('.line-avatar') ||
          this.$el.closest('.line-thumbnail'));
    return e('div', { class: [Ld({ animated: t }), { 'in-media': i }] }, [
      e('span', [' ']),
    ]);
  },
});
const { createComponent: Dd, bem: Nd } = R('slide');
var Hd = Dd({
    functional: !0,
    render: (e, { data: t, slots: i }) =>
      e(
        'div',
        b([
          {
            class: [Nd(), { 'swiper-slide': !0, 'swiper-zoom-container': !0 }],
          },
          t,
        ]),
        [i()]
      ),
  }),
  Rd =
    'undefined' == typeof document
      ? {
          body: {},
          addEventListener: function () {},
          removeEventListener: function () {},
          activeElement: { blur: function () {}, nodeName: '' },
          querySelector: function () {
            return null;
          },
          querySelectorAll: function () {
            return [];
          },
          getElementById: function () {
            return null;
          },
          createEvent: function () {
            return { initEvent: function () {} };
          },
          createElement: function () {
            return {
              children: [],
              childNodes: [],
              style: {},
              setAttribute: function () {},
              getElementsByTagName: function () {
                return [];
              },
            };
          },
          location: { hash: '' },
        }
      : document,
  Vd =
    'undefined' == typeof window
      ? {
          document: Rd,
          navigator: { userAgent: '' },
          location: {},
          history: {},
          CustomEvent: function () {
            return this;
          },
          addEventListener: function () {},
          removeEventListener: function () {},
          getComputedStyle: function () {
            return {
              getPropertyValue: function () {
                return '';
              },
            };
          },
          Image: function () {},
          Date: function () {},
          screen: {},
          setTimeout: function () {},
          clearTimeout: function () {},
        }
      : window;
class Yd {
  constructor(e) {
    const t = this;
    for (let i = 0; i < e.length; i += 1) t[i] = e[i];
    return (t.length = e.length), this;
  }
}
function qd(e, t) {
  const i = [];
  let s = 0;
  if (e && !t && e instanceof Yd) return e;
  if (e)
    if ('string' == typeof e) {
      let n, a;
      const r = e.trim();
      if (r.indexOf('<') >= 0 && r.indexOf('>') >= 0) {
        let e = 'div';
        for (
          0 === r.indexOf('<li') && (e = 'ul'),
            0 === r.indexOf('<tr') && (e = 'tbody'),
            (0 !== r.indexOf('<td') && 0 !== r.indexOf('<th')) || (e = 'tr'),
            0 === r.indexOf('<tbody') && (e = 'table'),
            0 === r.indexOf('<option') && (e = 'select'),
            a = Rd.createElement(e),
            a.innerHTML = r,
            s = 0;
          s < a.childNodes.length;
          s += 1
        )
          i.push(a.childNodes[s]);
      } else
        for (
          n =
            t || '#' !== e[0] || e.match(/[ .<>:~]/)
              ? (t || Rd).querySelectorAll(e.trim())
              : [Rd.getElementById(e.trim().split('#')[1])],
            s = 0;
          s < n.length;
          s += 1
        )
          n[s] && i.push(n[s]);
    } else if (e.nodeType || e === Vd || e === Rd) i.push(e);
    else if (e.length > 0 && e[0].nodeType)
      for (s = 0; s < e.length; s += 1) i.push(e[s]);
  return new Yd(i);
}
function Fd(e) {
  const t = [];
  for (let i = 0; i < e.length; i += 1) -1 === t.indexOf(e[i]) && t.push(e[i]);
  return t;
}
(qd.fn = Yd.prototype), (qd.Class = Yd), (qd.Dom7 = Yd);
const Gd = {
  addClass: function (e) {
    if (void 0 === e) return this;
    const t = e.split(' ');
    for (let e = 0; e < t.length; e += 1)
      for (let i = 0; i < this.length; i += 1)
        void 0 !== this[i] &&
          void 0 !== this[i].classList &&
          this[i].classList.add(t[e]);
    return this;
  },
  removeClass: function (e) {
    const t = e.split(' ');
    for (let e = 0; e < t.length; e += 1)
      for (let i = 0; i < this.length; i += 1)
        void 0 !== this[i] &&
          void 0 !== this[i].classList &&
          this[i].classList.remove(t[e]);
    return this;
  },
  hasClass: function (e) {
    return !!this[0] && this[0].classList.contains(e);
  },
  toggleClass: function (e) {
    const t = e.split(' ');
    for (let e = 0; e < t.length; e += 1)
      for (let i = 0; i < this.length; i += 1)
        void 0 !== this[i] &&
          void 0 !== this[i].classList &&
          this[i].classList.toggle(t[e]);
    return this;
  },
  attr: function (e, t) {
    if (1 === arguments.length && 'string' == typeof e)
      return this[0] ? this[0].getAttribute(e) : void 0;
    for (let i = 0; i < this.length; i += 1)
      if (2 === arguments.length) this[i].setAttribute(e, t);
      else
        for (const t in e) (this[i][t] = e[t]), this[i].setAttribute(t, e[t]);
    return this;
  },
  removeAttr: function (e) {
    for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
    return this;
  },
  data: function (e, t) {
    let i;
    if (void 0 !== t) {
      for (let s = 0; s < this.length; s += 1)
        (i = this[s]),
          i.dom7ElementDataStorage || (i.dom7ElementDataStorage = {}),
          (i.dom7ElementDataStorage[e] = t);
      return this;
    }
    if (((i = this[0]), i)) {
      if (i.dom7ElementDataStorage && e in i.dom7ElementDataStorage)
        return i.dom7ElementDataStorage[e];
      const t = i.getAttribute(`data-${e}`);
      return t || void 0;
    }
  },
  transform: function (e) {
    for (let t = 0; t < this.length; t += 1) {
      const i = this[t].style;
      (i.webkitTransform = e), (i.transform = e);
    }
    return this;
  },
  transition: function (e) {
    'string' != typeof e && (e = `${e}ms`);
    for (let t = 0; t < this.length; t += 1) {
      const i = this[t].style;
      (i.webkitTransitionDuration = e), (i.transitionDuration = e);
    }
    return this;
  },
  on: function (...e) {
    let [t, i, s, n] = e;
    function a(e) {
      const t = e.target;
      if (!t) return;
      const n = e.target.dom7EventData || [];
      if ((n.indexOf(e) < 0 && n.unshift(e), qd(t).is(i))) s.apply(t, n);
      else {
        const e = qd(t).parents();
        for (let t = 0; t < e.length; t += 1)
          qd(e[t]).is(i) && s.apply(e[t], n);
      }
    }
    function r(e) {
      const t = (e && e.target && e.target.dom7EventData) || [];
      t.indexOf(e) < 0 && t.unshift(e), s.apply(this, t);
    }
    'function' == typeof e[1] && (([t, s, n] = e), (i = void 0)), n || (n = !1);
    const o = t.split(' ');
    let l;
    for (let e = 0; e < this.length; e += 1) {
      const t = this[e];
      if (i)
        for (l = 0; l < o.length; l += 1) {
          const e = o[l];
          t.dom7LiveListeners || (t.dom7LiveListeners = {}),
            t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
            t.dom7LiveListeners[e].push({ listener: s, proxyListener: a }),
            t.addEventListener(e, a, n);
        }
      else
        for (l = 0; l < o.length; l += 1) {
          const e = o[l];
          t.dom7Listeners || (t.dom7Listeners = {}),
            t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
            t.dom7Listeners[e].push({ listener: s, proxyListener: r }),
            t.addEventListener(e, r, n);
        }
    }
    return this;
  },
  off: function (...e) {
    let [t, i, s, n] = e;
    'function' == typeof e[1] && (([t, s, n] = e), (i = void 0)), n || (n = !1);
    const a = t.split(' ');
    for (let e = 0; e < a.length; e += 1) {
      const t = a[e];
      for (let e = 0; e < this.length; e += 1) {
        const a = this[e];
        let r;
        if (
          (!i && a.dom7Listeners
            ? (r = a.dom7Listeners[t])
            : i && a.dom7LiveListeners && (r = a.dom7LiveListeners[t]),
          r && r.length)
        )
          for (let e = r.length - 1; e >= 0; e -= 1) {
            const i = r[e];
            (s && i.listener === s) ||
            (s &&
              i.listener &&
              i.listener.dom7proxy &&
              i.listener.dom7proxy === s)
              ? (a.removeEventListener(t, i.proxyListener, n), r.splice(e, 1))
              : s ||
                (a.removeEventListener(t, i.proxyListener, n), r.splice(e, 1));
          }
      }
    }
    return this;
  },
  trigger: function (...e) {
    const t = e[0].split(' '),
      i = e[1];
    for (let s = 0; s < t.length; s += 1) {
      const n = t[s];
      for (let t = 0; t < this.length; t += 1) {
        const s = this[t];
        let a;
        try {
          a = new Vd.CustomEvent(n, { detail: i, bubbles: !0, cancelable: !0 });
        } catch (e) {
          (a = Rd.createEvent('Event')), a.initEvent(n, !0, !0), (a.detail = i);
        }
        (s.dom7EventData = e.filter((e, t) => t > 0)),
          s.dispatchEvent(a),
          (s.dom7EventData = []),
          delete s.dom7EventData;
      }
    }
    return this;
  },
  transitionEnd: function (e) {
    const t = ['webkitTransitionEnd', 'transitionend'],
      i = this;
    let s;
    function n(a) {
      if (a.target === this)
        for (e.call(this, a), s = 0; s < t.length; s += 1) i.off(t[s], n);
    }
    if (e) for (s = 0; s < t.length; s += 1) i.on(t[s], n);
    return this;
  },
  outerWidth: function (e) {
    if (this.length > 0) {
      if (e) {
        const e = this.styles();
        return (
          this[0].offsetWidth +
          parseFloat(e.getPropertyValue('margin-right')) +
          parseFloat(e.getPropertyValue('margin-left'))
        );
      }
      return this[0].offsetWidth;
    }
    return null;
  },
  outerHeight: function (e) {
    if (this.length > 0) {
      if (e) {
        const e = this.styles();
        return (
          this[0].offsetHeight +
          parseFloat(e.getPropertyValue('margin-top')) +
          parseFloat(e.getPropertyValue('margin-bottom'))
        );
      }
      return this[0].offsetHeight;
    }
    return null;
  },
  offset: function () {
    if (this.length > 0) {
      const e = this[0],
        t = e.getBoundingClientRect(),
        i = Rd.body;
      return {
        top:
          t.top +
          (e === Vd ? Vd.scrollY : e.scrollTop) -
          (e.clientTop || i.clientTop || 0),
        left:
          t.left +
          (e === Vd ? Vd.scrollX : e.scrollLeft) -
          (e.clientLeft || i.clientLeft || 0),
      };
    }
    return null;
  },
  css: function (e, t) {
    let i;
    if (1 === arguments.length) {
      if ('string' != typeof e) {
        for (i = 0; i < this.length; i += 1)
          for (let t in e) this[i].style[t] = e[t];
        return this;
      }
      if (this[0])
        return Vd.getComputedStyle(this[0], null).getPropertyValue(e);
    }
    if (2 === arguments.length && 'string' == typeof e) {
      for (i = 0; i < this.length; i += 1) this[i].style[e] = t;
      return this;
    }
    return this;
  },
  each: function (e) {
    if (!e) return this;
    for (let t = 0; t < this.length; t += 1)
      if (!1 === e.call(this[t], t, this[t])) return this;
    return this;
  },
  html: function (e) {
    if (void 0 === e) return this[0] ? this[0].innerHTML : void 0;
    for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
    return this;
  },
  text: function (e) {
    if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
    for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
    return this;
  },
  is: function (e) {
    const t = this[0];
    let i, s;
    if (!t || void 0 === e) return !1;
    if ('string' == typeof e) {
      if (t.matches) return t.matches(e);
      if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
      if (t.msMatchesSelector) return t.msMatchesSelector(e);
      for (i = qd(e), s = 0; s < i.length; s += 1) if (i[s] === t) return !0;
      return !1;
    }
    if (e === Rd) return t === Rd;
    if (e === Vd) return t === Vd;
    if (e.nodeType || e instanceof Yd) {
      for (i = e.nodeType ? [e] : e, s = 0; s < i.length; s += 1)
        if (i[s] === t) return !0;
      return !1;
    }
    return !1;
  },
  index: function () {
    let e,
      t = this[0];
    if (t) {
      for (e = 0; null !== (t = t.previousSibling); )
        1 === t.nodeType && (e += 1);
      return e;
    }
  },
  eq: function (e) {
    if (void 0 === e) return this;
    const t = this.length;
    let i;
    return e > t - 1
      ? new Yd([])
      : e < 0
      ? ((i = t + e), new Yd(i < 0 ? [] : [this[i]]))
      : new Yd([this[e]]);
  },
  append: function (...e) {
    let t;
    for (let i = 0; i < e.length; i += 1) {
      t = e[i];
      for (let e = 0; e < this.length; e += 1)
        if ('string' == typeof t) {
          const i = Rd.createElement('div');
          for (i.innerHTML = t; i.firstChild; )
            this[e].appendChild(i.firstChild);
        } else if (t instanceof Yd)
          for (let i = 0; i < t.length; i += 1) this[e].appendChild(t[i]);
        else this[e].appendChild(t);
    }
    return this;
  },
  prepend: function (e) {
    let t, i;
    for (t = 0; t < this.length; t += 1)
      if ('string' == typeof e) {
        const s = Rd.createElement('div');
        for (s.innerHTML = e, i = s.childNodes.length - 1; i >= 0; i -= 1)
          this[t].insertBefore(s.childNodes[i], this[t].childNodes[0]);
      } else if (e instanceof Yd)
        for (i = 0; i < e.length; i += 1)
          this[t].insertBefore(e[i], this[t].childNodes[0]);
      else this[t].insertBefore(e, this[t].childNodes[0]);
    return this;
  },
  next: function (e) {
    return this.length > 0
      ? e
        ? this[0].nextElementSibling && qd(this[0].nextElementSibling).is(e)
          ? new Yd([this[0].nextElementSibling])
          : new Yd([])
        : new Yd(this[0].nextElementSibling ? [this[0].nextElementSibling] : [])
      : new Yd([]);
  },
  nextAll: function (e) {
    const t = [];
    let i = this[0];
    if (!i) return new Yd([]);
    for (; i.nextElementSibling; ) {
      const s = i.nextElementSibling;
      e ? qd(s).is(e) && t.push(s) : t.push(s), (i = s);
    }
    return new Yd(t);
  },
  prev: function (e) {
    if (this.length > 0) {
      const t = this[0];
      return e
        ? t.previousElementSibling && qd(t.previousElementSibling).is(e)
          ? new Yd([t.previousElementSibling])
          : new Yd([])
        : new Yd(t.previousElementSibling ? [t.previousElementSibling] : []);
    }
    return new Yd([]);
  },
  prevAll: function (e) {
    const t = [];
    let i = this[0];
    if (!i) return new Yd([]);
    for (; i.previousElementSibling; ) {
      const s = i.previousElementSibling;
      e ? qd(s).is(e) && t.push(s) : t.push(s), (i = s);
    }
    return new Yd(t);
  },
  parent: function (e) {
    const t = [];
    for (let i = 0; i < this.length; i += 1)
      null !== this[i].parentNode &&
        (e
          ? qd(this[i].parentNode).is(e) && t.push(this[i].parentNode)
          : t.push(this[i].parentNode));
    return qd(Fd(t));
  },
  parents: function (e) {
    const t = [];
    for (let i = 0; i < this.length; i += 1) {
      let s = this[i].parentNode;
      for (; s; ) e ? qd(s).is(e) && t.push(s) : t.push(s), (s = s.parentNode);
    }
    return qd(Fd(t));
  },
  closest: function (e) {
    let t = this;
    return void 0 === e ? new Yd([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
  },
  find: function (e) {
    const t = [];
    for (let i = 0; i < this.length; i += 1) {
      const s = this[i].querySelectorAll(e);
      for (let e = 0; e < s.length; e += 1) t.push(s[e]);
    }
    return new Yd(t);
  },
  children: function (e) {
    const t = [];
    for (let i = 0; i < this.length; i += 1) {
      const s = this[i].childNodes;
      for (let i = 0; i < s.length; i += 1)
        e
          ? 1 === s[i].nodeType && qd(s[i]).is(e) && t.push(s[i])
          : 1 === s[i].nodeType && t.push(s[i]);
    }
    return new Yd(Fd(t));
  },
  filter: function (e) {
    const t = [],
      i = this;
    for (let s = 0; s < i.length; s += 1) e.call(i[s], s, i[s]) && t.push(i[s]);
    return new Yd(t);
  },
  remove: function () {
    for (let e = 0; e < this.length; e += 1)
      this[e].parentNode && this[e].parentNode.removeChild(this[e]);
    return this;
  },
  add: function (...e) {
    const t = this;
    let i, s;
    for (i = 0; i < e.length; i += 1) {
      const n = qd(e[i]);
      for (s = 0; s < n.length; s += 1) (t[t.length] = n[s]), (t.length += 1);
    }
    return t;
  },
  styles: function () {
    return this[0] ? Vd.getComputedStyle(this[0], null) : {};
  },
};
Object.keys(Gd).forEach((e) => {
  qd.fn[e] = qd.fn[e] || Gd[e];
});
const Xd = {
    deleteProps(e) {
      const t = e;
      Object.keys(t).forEach((e) => {
        try {
          t[e] = null;
        } catch (e) {}
        try {
          delete t[e];
        } catch (e) {}
      });
    },
    nextTick: (e, t = 0) => setTimeout(e, t),
    now: () => Date.now(),
    getTranslate(e, t = 'x') {
      let i, s, n;
      const a = Vd.getComputedStyle(e, null);
      return (
        Vd.WebKitCSSMatrix
          ? ((s = a.transform || a.webkitTransform),
            s.split(',').length > 6 &&
              (s = s
                .split(', ')
                .map((e) => e.replace(',', '.'))
                .join(', ')),
            (n = new Vd.WebKitCSSMatrix('none' === s ? '' : s)))
          : ((n =
              a.MozTransform ||
              a.OTransform ||
              a.MsTransform ||
              a.msTransform ||
              a.transform ||
              a
                .getPropertyValue('transform')
                .replace('translate(', 'matrix(1, 0, 0, 1,')),
            (i = n.toString().split(','))),
        'x' === t &&
          (s = Vd.WebKitCSSMatrix
            ? n.m41
            : 16 === i.length
            ? parseFloat(i[12])
            : parseFloat(i[4])),
        'y' === t &&
          (s = Vd.WebKitCSSMatrix
            ? n.m42
            : 16 === i.length
            ? parseFloat(i[13])
            : parseFloat(i[5])),
        s || 0
      );
    },
    parseUrlQuery(e) {
      const t = {};
      let i,
        s,
        n,
        a,
        r = e || Vd.location.href;
      if ('string' == typeof r && r.length)
        for (
          r = r.indexOf('?') > -1 ? r.replace(/\S*\?/, '') : '',
            s = r.split('&').filter((e) => '' !== e),
            a = s.length,
            i = 0;
          i < a;
          i += 1
        )
          (n = s[i].replace(/#\S+/g, '').split('=')),
            (t[decodeURIComponent(n[0])] =
              void 0 === n[1] ? void 0 : decodeURIComponent(n[1]) || '');
      return t;
    },
    isObject: (e) =>
      'object' == typeof e &&
      null !== e &&
      e.constructor &&
      e.constructor === Object,
    extend(...e) {
      const t = Object(e[0]);
      for (let i = 1; i < e.length; i += 1) {
        const s = e[i];
        if (null != s) {
          const e = Object.keys(Object(s));
          for (let i = 0, n = e.length; i < n; i += 1) {
            const n = e[i],
              a = Object.getOwnPropertyDescriptor(s, n);
            void 0 !== a &&
              a.enumerable &&
              (Xd.isObject(t[n]) && Xd.isObject(s[n])
                ? Xd.extend(t[n], s[n])
                : !Xd.isObject(t[n]) && Xd.isObject(s[n])
                ? ((t[n] = {}), Xd.extend(t[n], s[n]))
                : (t[n] = s[n]));
          }
        }
      }
      return t;
    },
  },
  Wd = {
    touch:
      (Vd.Modernizr && !0 === Vd.Modernizr.touch) ||
      !!(
        Vd.navigator.maxTouchPoints > 0 ||
        'ontouchstart' in Vd ||
        (Vd.DocumentTouch && Rd instanceof Vd.DocumentTouch)
      ),
    pointerEvents:
      !!Vd.PointerEvent &&
      'maxTouchPoints' in Vd.navigator &&
      Vd.navigator.maxTouchPoints > 0,
    observer: 'MutationObserver' in Vd || 'WebkitMutationObserver' in Vd,
    passiveListener: (function () {
      let e = !1;
      try {
        const t = Object.defineProperty({}, 'passive', {
          get() {
            e = !0;
          },
        });
        Vd.addEventListener('testPassiveListener', null, t);
      } catch (e) {}
      return e;
    })(),
    gestures: 'ongesturestart' in Vd,
  };
class jd {
  constructor(e = {}) {
    const t = this;
    (t.params = e),
      (t.eventsListeners = {}),
      t.params &&
        t.params.on &&
        Object.keys(t.params.on).forEach((e) => {
          t.on(e, t.params.on[e]);
        });
  }
  on(e, t, i) {
    const s = this;
    if ('function' != typeof t) return s;
    const n = i ? 'unshift' : 'push';
    return (
      e.split(' ').forEach((e) => {
        s.eventsListeners[e] || (s.eventsListeners[e] = []),
          s.eventsListeners[e][n](t);
      }),
      s
    );
  }
  once(e, t, i) {
    const s = this;
    if ('function' != typeof t) return s;
    function n(...i) {
      s.off(e, n), n.f7proxy && delete n.f7proxy, t.apply(s, i);
    }
    return (n.f7proxy = t), s.on(e, n, i);
  }
  off(e, t) {
    const i = this;
    return i.eventsListeners
      ? (e.split(' ').forEach((e) => {
          void 0 === t
            ? (i.eventsListeners[e] = [])
            : i.eventsListeners[e] &&
              i.eventsListeners[e].length &&
              i.eventsListeners[e].forEach((s, n) => {
                (s === t || (s.f7proxy && s.f7proxy === t)) &&
                  i.eventsListeners[e].splice(n, 1);
              });
        }),
        i)
      : i;
  }
  emit(...e) {
    const t = this;
    if (!t.eventsListeners) return t;
    let i, s, n;
    return (
      'string' == typeof e[0] || Array.isArray(e[0])
        ? ((i = e[0]), (s = e.slice(1, e.length)), (n = t))
        : ((i = e[0].events), (s = e[0].data), (n = e[0].context || t)),
      (Array.isArray(i) ? i : i.split(' ')).forEach((e) => {
        if (t.eventsListeners && t.eventsListeners[e]) {
          const i = [];
          t.eventsListeners[e].forEach((e) => {
            i.push(e);
          }),
            i.forEach((e) => {
              e.apply(n, s);
            });
        }
      }),
      t
    );
  }
  useModulesParams(e) {
    const t = this;
    t.modules &&
      Object.keys(t.modules).forEach((i) => {
        const s = t.modules[i];
        s.params && Xd.extend(e, s.params);
      });
  }
  useModules(e = {}) {
    const t = this;
    t.modules &&
      Object.keys(t.modules).forEach((i) => {
        const s = t.modules[i],
          n = e[i] || {};
        s.instance &&
          Object.keys(s.instance).forEach((e) => {
            const i = s.instance[e];
            t[e] = 'function' == typeof i ? i.bind(t) : i;
          }),
          s.on &&
            t.on &&
            Object.keys(s.on).forEach((e) => {
              t.on(e, s.on[e]);
            }),
          s.create && s.create.bind(t)(n);
      });
  }
  static set components(e) {
    this.use && this.use(e);
  }
  static installModule(e, ...t) {
    const i = this;
    i.prototype.modules || (i.prototype.modules = {});
    const s =
      e.name || `${Object.keys(i.prototype.modules).length}_${Xd.now()}`;
    return (
      (i.prototype.modules[s] = e),
      e.proto &&
        Object.keys(e.proto).forEach((t) => {
          i.prototype[t] = e.proto[t];
        }),
      e.static &&
        Object.keys(e.static).forEach((t) => {
          i[t] = e.static[t];
        }),
      e.install && e.install.apply(i, t),
      i
    );
  }
  static use(e, ...t) {
    const i = this;
    return Array.isArray(e)
      ? (e.forEach((e) => i.installModule(e)), i)
      : i.installModule(e, ...t);
  }
}
var _d = {
  updateSize: function () {
    const e = this;
    let t, i;
    const s = e.$el;
    (t = void 0 !== e.params.width ? e.params.width : s[0].clientWidth),
      (i = void 0 !== e.params.height ? e.params.height : s[0].clientHeight),
      (0 === t && e.isHorizontal()) ||
        (0 === i && e.isVertical()) ||
        ((t =
          t -
          parseInt(s.css('padding-left'), 10) -
          parseInt(s.css('padding-right'), 10)),
        (i =
          i -
          parseInt(s.css('padding-top'), 10) -
          parseInt(s.css('padding-bottom'), 10)),
        Xd.extend(e, { width: t, height: i, size: e.isHorizontal() ? t : i }));
  },
  updateSlides: function () {
    const e = this,
      t = e.params,
      { $wrapperEl: i, size: s, rtlTranslate: n, wrongRTL: a } = e,
      r = e.virtual && t.virtual.enabled,
      o = r ? e.virtual.slides.length : e.slides.length,
      l = i.children(`.${e.params.slideClass}`),
      d = r ? e.virtual.slides.length : l.length;
    let c = [];
    const h = [],
      p = [];
    function u(e) {
      return !t.cssMode || e !== l.length - 1;
    }
    let m = t.slidesOffsetBefore;
    'function' == typeof m && (m = t.slidesOffsetBefore.call(e));
    let f = t.slidesOffsetAfter;
    'function' == typeof f && (f = t.slidesOffsetAfter.call(e));
    const g = e.snapGrid.length,
      v = e.snapGrid.length;
    let b,
      y,
      w = t.spaceBetween,
      x = -m,
      S = 0,
      E = 0;
    if (void 0 === s) return;
    'string' == typeof w &&
      w.indexOf('%') >= 0 &&
      (w = (parseFloat(w.replace('%', '')) / 100) * s),
      (e.virtualSize = -w),
      l.css(
        n
          ? { marginLeft: '', marginTop: '' }
          : { marginRight: '', marginBottom: '' }
      ),
      t.slidesPerColumn > 1 &&
        ((b =
          Math.floor(d / t.slidesPerColumn) === d / e.params.slidesPerColumn
            ? d
            : Math.ceil(d / t.slidesPerColumn) * t.slidesPerColumn),
        'auto' !== t.slidesPerView &&
          'row' === t.slidesPerColumnFill &&
          (b = Math.max(b, t.slidesPerView * t.slidesPerColumn)));
    const T = t.slidesPerColumn,
      $ = b / T,
      C = Math.floor(d / t.slidesPerColumn);
    for (let i = 0; i < d; i += 1) {
      y = 0;
      const n = l.eq(i);
      if (t.slidesPerColumn > 1) {
        let s, a, r;
        if ('row' === t.slidesPerColumnFill && t.slidesPerGroup > 1) {
          const e = Math.floor(i / (t.slidesPerGroup * t.slidesPerColumn)),
            o = i - t.slidesPerColumn * t.slidesPerGroup * e,
            l =
              0 === e
                ? t.slidesPerGroup
                : Math.min(
                    Math.ceil((d - e * T * t.slidesPerGroup) / T),
                    t.slidesPerGroup
                  );
          (r = Math.floor(o / l)),
            (a = o - r * l + e * t.slidesPerGroup),
            (s = a + (r * b) / T),
            n.css({
              '-webkit-box-ordinal-group': s,
              '-moz-box-ordinal-group': s,
              '-ms-flex-order': s,
              '-webkit-order': s,
              order: s,
            });
        } else
          'column' === t.slidesPerColumnFill
            ? ((a = Math.floor(i / T)),
              (r = i - a * T),
              (a > C || (a === C && r === T - 1)) &&
                ((r += 1), r >= T && ((r = 0), (a += 1))))
            : ((r = Math.floor(i / $)), (a = i - r * $));
        n.css(
          `margin-${e.isHorizontal() ? 'top' : 'left'}`,
          0 !== r && t.spaceBetween && `${t.spaceBetween}px`
        );
      }
      if ('none' !== n.css('display')) {
        if ('auto' === t.slidesPerView) {
          const i = Vd.getComputedStyle(n[0], null),
            s = n[0].style.transform,
            a = n[0].style.webkitTransform;
          if (
            (s && (n[0].style.transform = 'none'),
            a && (n[0].style.webkitTransform = 'none'),
            t.roundLengths)
          )
            y = e.isHorizontal() ? n.outerWidth(!0) : n.outerHeight(!0);
          else if (e.isHorizontal()) {
            const e = parseFloat(i.getPropertyValue('width')),
              t = parseFloat(i.getPropertyValue('padding-left')),
              s = parseFloat(i.getPropertyValue('padding-right')),
              n = parseFloat(i.getPropertyValue('margin-left')),
              a = parseFloat(i.getPropertyValue('margin-right')),
              r = i.getPropertyValue('box-sizing');
            y = r && 'border-box' === r ? e + n + a : e + t + s + n + a;
          } else {
            const e = parseFloat(i.getPropertyValue('height')),
              t = parseFloat(i.getPropertyValue('padding-top')),
              s = parseFloat(i.getPropertyValue('padding-bottom')),
              n = parseFloat(i.getPropertyValue('margin-top')),
              a = parseFloat(i.getPropertyValue('margin-bottom')),
              r = i.getPropertyValue('box-sizing');
            y = r && 'border-box' === r ? e + n + a : e + t + s + n + a;
          }
          s && (n[0].style.transform = s),
            a && (n[0].style.webkitTransform = a),
            t.roundLengths && (y = Math.floor(y));
        } else
          (y = (s - (t.slidesPerView - 1) * w) / t.slidesPerView),
            t.roundLengths && (y = Math.floor(y)),
            l[i] &&
              (e.isHorizontal()
                ? (l[i].style.width = `${y}px`)
                : (l[i].style.height = `${y}px`));
        l[i] && (l[i].swiperSlideSize = y),
          p.push(y),
          t.centeredSlides
            ? ((x = x + y / 2 + S / 2 + w),
              0 === S && 0 !== i && (x = x - s / 2 - w),
              0 === i && (x = x - s / 2 - w),
              Math.abs(x) < 0.001 && (x = 0),
              t.roundLengths && (x = Math.floor(x)),
              E % t.slidesPerGroup == 0 && c.push(x),
              h.push(x))
            : (t.roundLengths && (x = Math.floor(x)),
              (E - Math.min(e.params.slidesPerGroupSkip, E)) %
                e.params.slidesPerGroup ==
                0 && c.push(x),
              h.push(x),
              (x = x + y + w)),
          (e.virtualSize += y + w),
          (S = y),
          (E += 1);
      }
    }
    let k;
    if (
      ((e.virtualSize = Math.max(e.virtualSize, s) + f),
      n &&
        a &&
        ('slide' === t.effect || 'coverflow' === t.effect) &&
        i.css({ width: `${e.virtualSize + t.spaceBetween}px` }),
      t.setWrapperSize &&
        (e.isHorizontal()
          ? i.css({ width: `${e.virtualSize + t.spaceBetween}px` })
          : i.css({ height: `${e.virtualSize + t.spaceBetween}px` })),
      t.slidesPerColumn > 1 &&
        ((e.virtualSize = (y + t.spaceBetween) * b),
        (e.virtualSize =
          Math.ceil(e.virtualSize / t.slidesPerColumn) - t.spaceBetween),
        e.isHorizontal()
          ? i.css({ width: `${e.virtualSize + t.spaceBetween}px` })
          : i.css({ height: `${e.virtualSize + t.spaceBetween}px` }),
        t.centeredSlides))
    ) {
      k = [];
      for (let i = 0; i < c.length; i += 1) {
        let s = c[i];
        t.roundLengths && (s = Math.floor(s)),
          c[i] < e.virtualSize + c[0] && k.push(s);
      }
      c = k;
    }
    if (!t.centeredSlides) {
      k = [];
      for (let i = 0; i < c.length; i += 1) {
        let n = c[i];
        t.roundLengths && (n = Math.floor(n)),
          c[i] <= e.virtualSize - s && k.push(n);
      }
      (c = k),
        Math.floor(e.virtualSize - s) - Math.floor(c[c.length - 1]) > 1 &&
          c.push(e.virtualSize - s);
    }
    if (
      (0 === c.length && (c = [0]),
      0 !== t.spaceBetween &&
        (e.isHorizontal()
          ? n
            ? l.filter(u).css({ marginLeft: `${w}px` })
            : l.filter(u).css({ marginRight: `${w}px` })
          : l.filter(u).css({ marginBottom: `${w}px` })),
      t.centeredSlides && t.centeredSlidesBounds)
    ) {
      let e = 0;
      p.forEach((i) => {
        e += i + (t.spaceBetween ? t.spaceBetween : 0);
      }),
        (e -= t.spaceBetween);
      const i = e - s;
      c = c.map((e) => (e < 0 ? -m : e > i ? i + f : e));
    }
    if (t.centerInsufficientSlides) {
      let e = 0;
      if (
        (p.forEach((i) => {
          e += i + (t.spaceBetween ? t.spaceBetween : 0);
        }),
        (e -= t.spaceBetween),
        e < s)
      ) {
        const t = (s - e) / 2;
        c.forEach((e, i) => {
          c[i] = e - t;
        }),
          h.forEach((e, i) => {
            h[i] = e + t;
          });
      }
    }
    Xd.extend(e, { slides: l, snapGrid: c, slidesGrid: h, slidesSizesGrid: p }),
      d !== o && e.emit('slidesLengthChange'),
      c.length !== g &&
        (e.params.watchOverflow && e.checkOverflow(),
        e.emit('snapGridLengthChange')),
      h.length !== v && e.emit('slidesGridLengthChange'),
      (t.watchSlidesProgress || t.watchSlidesVisibility) &&
        e.updateSlidesOffset();
  },
  updateAutoHeight: function (e) {
    const t = this,
      i = [];
    let s,
      n = 0;
    if (
      ('number' == typeof e
        ? t.setTransition(e)
        : !0 === e && t.setTransition(t.params.speed),
      'auto' !== t.params.slidesPerView && t.params.slidesPerView > 1)
    )
      if (t.params.centeredSlides) i.push(...t.visibleSlides);
      else
        for (s = 0; s < Math.ceil(t.params.slidesPerView); s += 1) {
          const e = t.activeIndex + s;
          if (e > t.slides.length) break;
          i.push(t.slides.eq(e)[0]);
        }
    else i.push(t.slides.eq(t.activeIndex)[0]);
    for (s = 0; s < i.length; s += 1)
      if (void 0 !== i[s]) {
        const e = i[s].offsetHeight;
        n = e > n ? e : n;
      }
    n && t.$wrapperEl.css('height', `${n}px`);
  },
  updateSlidesOffset: function () {
    const e = this,
      t = e.slides;
    for (let i = 0; i < t.length; i += 1)
      t[i].swiperSlideOffset = e.isHorizontal()
        ? t[i].offsetLeft
        : t[i].offsetTop;
  },
  updateSlidesProgress: function (e = (this && this.translate) || 0) {
    const t = this,
      i = t.params,
      { slides: s, rtlTranslate: n } = t;
    if (0 === s.length) return;
    void 0 === s[0].swiperSlideOffset && t.updateSlidesOffset();
    let a = -e;
    n && (a = e),
      s.removeClass(i.slideVisibleClass),
      (t.visibleSlidesIndexes = []),
      (t.visibleSlides = []);
    for (let e = 0; e < s.length; e += 1) {
      const r = s[e],
        o =
          (a +
            (i.centeredSlides ? t.minTranslate() : 0) -
            r.swiperSlideOffset) /
          (r.swiperSlideSize + i.spaceBetween);
      if (i.watchSlidesVisibility || (i.centeredSlides && i.autoHeight)) {
        const n = -(a - r.swiperSlideOffset),
          o = n + t.slidesSizesGrid[e];
        ((n >= 0 && n < t.size - 1) ||
          (o > 1 && o <= t.size) ||
          (n <= 0 && o >= t.size)) &&
          (t.visibleSlides.push(r),
          t.visibleSlidesIndexes.push(e),
          s.eq(e).addClass(i.slideVisibleClass));
      }
      r.progress = n ? -o : o;
    }
    t.visibleSlides = qd(t.visibleSlides);
  },
  updateProgress: function (e) {
    const t = this;
    if (void 0 === e) {
      const i = t.rtlTranslate ? -1 : 1;
      e = (t && t.translate && t.translate * i) || 0;
    }
    const i = t.params,
      s = t.maxTranslate() - t.minTranslate();
    let { progress: n, isBeginning: a, isEnd: r } = t;
    const o = a,
      l = r;
    0 === s
      ? ((n = 0), (a = !0), (r = !0))
      : ((n = (e - t.minTranslate()) / s), (a = n <= 0), (r = n >= 1)),
      Xd.extend(t, { progress: n, isBeginning: a, isEnd: r }),
      (i.watchSlidesProgress ||
        i.watchSlidesVisibility ||
        (i.centeredSlides && i.autoHeight)) &&
        t.updateSlidesProgress(e),
      a && !o && t.emit('reachBeginning toEdge'),
      r && !l && t.emit('reachEnd toEdge'),
      ((o && !a) || (l && !r)) && t.emit('fromEdge'),
      t.emit('progress', n);
  },
  updateSlidesClasses: function () {
    const e = this,
      { slides: t, params: i, $wrapperEl: s, activeIndex: n, realIndex: a } = e,
      r = e.virtual && i.virtual.enabled;
    let o;
    t.removeClass(
      `${i.slideActiveClass} ${i.slideNextClass} ${i.slidePrevClass} ${i.slideDuplicateActiveClass} ${i.slideDuplicateNextClass} ${i.slideDuplicatePrevClass}`
    ),
      (o = r
        ? e.$wrapperEl.find(`.${i.slideClass}[data-swiper-slide-index="${n}"]`)
        : t.eq(n)),
      o.addClass(i.slideActiveClass),
      i.loop &&
        (o.hasClass(i.slideDuplicateClass)
          ? s
              .children(
                `.${i.slideClass}:not(.${i.slideDuplicateClass})[data-swiper-slide-index="${a}"]`
              )
              .addClass(i.slideDuplicateActiveClass)
          : s
              .children(
                `.${i.slideClass}.${i.slideDuplicateClass}[data-swiper-slide-index="${a}"]`
              )
              .addClass(i.slideDuplicateActiveClass));
    let l = o.nextAll(`.${i.slideClass}`).eq(0).addClass(i.slideNextClass);
    i.loop && 0 === l.length && ((l = t.eq(0)), l.addClass(i.slideNextClass));
    let d = o.prevAll(`.${i.slideClass}`).eq(0).addClass(i.slidePrevClass);
    i.loop && 0 === d.length && ((d = t.eq(-1)), d.addClass(i.slidePrevClass)),
      i.loop &&
        (l.hasClass(i.slideDuplicateClass)
          ? s
              .children(
                `.${i.slideClass}:not(.${
                  i.slideDuplicateClass
                })[data-swiper-slide-index="${l.attr(
                  'data-swiper-slide-index'
                )}"]`
              )
              .addClass(i.slideDuplicateNextClass)
          : s
              .children(
                `.${i.slideClass}.${
                  i.slideDuplicateClass
                }[data-swiper-slide-index="${l.attr(
                  'data-swiper-slide-index'
                )}"]`
              )
              .addClass(i.slideDuplicateNextClass),
        d.hasClass(i.slideDuplicateClass)
          ? s
              .children(
                `.${i.slideClass}:not(.${
                  i.slideDuplicateClass
                })[data-swiper-slide-index="${d.attr(
                  'data-swiper-slide-index'
                )}"]`
              )
              .addClass(i.slideDuplicatePrevClass)
          : s
              .children(
                `.${i.slideClass}.${
                  i.slideDuplicateClass
                }[data-swiper-slide-index="${d.attr(
                  'data-swiper-slide-index'
                )}"]`
              )
              .addClass(i.slideDuplicatePrevClass));
  },
  updateActiveIndex: function (e) {
    const t = this,
      i = t.rtlTranslate ? t.translate : -t.translate,
      {
        slidesGrid: s,
        snapGrid: n,
        params: a,
        activeIndex: r,
        realIndex: o,
        snapIndex: l,
      } = t;
    let d,
      c = e;
    if (void 0 === c) {
      for (let e = 0; e < s.length; e += 1)
        void 0 !== s[e + 1]
          ? i >= s[e] && i < s[e + 1] - (s[e + 1] - s[e]) / 2
            ? (c = e)
            : i >= s[e] && i < s[e + 1] && (c = e + 1)
          : i >= s[e] && (c = e);
      a.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
    }
    if (n.indexOf(i) >= 0) d = n.indexOf(i);
    else {
      const e = Math.min(a.slidesPerGroupSkip, c);
      d = e + Math.floor((c - e) / a.slidesPerGroup);
    }
    if ((d >= n.length && (d = n.length - 1), c === r))
      return void (d !== l && ((t.snapIndex = d), t.emit('snapIndexChange')));
    const h = parseInt(t.slides.eq(c).attr('data-swiper-slide-index') || c, 10);
    Xd.extend(t, {
      snapIndex: d,
      realIndex: h,
      previousIndex: r,
      activeIndex: c,
    }),
      t.emit('activeIndexChange'),
      t.emit('snapIndexChange'),
      o !== h && t.emit('realIndexChange'),
      (t.initialized || t.runCallbacksOnInit) && t.emit('slideChange');
  },
  updateClickedSlide: function (e) {
    const t = this,
      i = t.params,
      s = qd(e.target).closest(`.${i.slideClass}`)[0];
    let n = !1;
    if (s)
      for (let e = 0; e < t.slides.length; e += 1)
        t.slides[e] === s && (n = !0);
    if (!s || !n)
      return (t.clickedSlide = void 0), void (t.clickedIndex = void 0);
    (t.clickedSlide = s),
      (t.clickedIndex =
        t.virtual && t.params.virtual.enabled
          ? parseInt(qd(s).attr('data-swiper-slide-index'), 10)
          : qd(s).index()),
      i.slideToClickedSlide &&
        void 0 !== t.clickedIndex &&
        t.clickedIndex !== t.activeIndex &&
        t.slideToClickedSlide();
  },
};
var Ud = {
  getTranslate: function (e = this.isHorizontal() ? 'x' : 'y') {
    const { params: t, rtlTranslate: i, translate: s, $wrapperEl: n } = this;
    if (t.virtualTranslate) return i ? -s : s;
    if (t.cssMode) return s;
    let a = Xd.getTranslate(n[0], e);
    return i && (a = -a), a || 0;
  },
  setTranslate: function (e, t) {
    const i = this,
      {
        rtlTranslate: s,
        params: n,
        $wrapperEl: a,
        wrapperEl: r,
        progress: o,
      } = i;
    let l,
      d = 0,
      c = 0;
    i.isHorizontal() ? (d = s ? -e : e) : (c = e),
      n.roundLengths && ((d = Math.floor(d)), (c = Math.floor(c))),
      n.cssMode
        ? (r[i.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = i.isHorizontal()
            ? -d
            : -c)
        : n.virtualTranslate || a.transform(`translate3d(${d}px, ${c}px, 0px)`),
      (i.previousTranslate = i.translate),
      (i.translate = i.isHorizontal() ? d : c);
    const h = i.maxTranslate() - i.minTranslate();
    (l = 0 === h ? 0 : (e - i.minTranslate()) / h),
      l !== o && i.updateProgress(e),
      i.emit('setTranslate', i.translate, t);
  },
  minTranslate: function () {
    return -this.snapGrid[0];
  },
  maxTranslate: function () {
    return -this.snapGrid[this.snapGrid.length - 1];
  },
  translateTo: function (e = 0, t = this.params.speed, i = !0, s = !0, n) {
    const a = this,
      { params: r, wrapperEl: o } = a;
    if (a.animating && r.preventInteractionOnTransition) return !1;
    const l = a.minTranslate(),
      d = a.maxTranslate();
    let c;
    if (
      ((c = s && e > l ? l : s && e < d ? d : e),
      a.updateProgress(c),
      r.cssMode)
    ) {
      const e = a.isHorizontal();
      return (
        0 === t
          ? (o[e ? 'scrollLeft' : 'scrollTop'] = -c)
          : o.scrollTo
          ? o.scrollTo({ [e ? 'left' : 'top']: -c, behavior: 'smooth' })
          : (o[e ? 'scrollLeft' : 'scrollTop'] = -c),
        !0
      );
    }
    return (
      0 === t
        ? (a.setTransition(0),
          a.setTranslate(c),
          i && (a.emit('beforeTransitionStart', t, n), a.emit('transitionEnd')))
        : (a.setTransition(t),
          a.setTranslate(c),
          i &&
            (a.emit('beforeTransitionStart', t, n), a.emit('transitionStart')),
          a.animating ||
            ((a.animating = !0),
            a.onTranslateToWrapperTransitionEnd ||
              (a.onTranslateToWrapperTransitionEnd = function (e) {
                a &&
                  !a.destroyed &&
                  e.target === this &&
                  (a.$wrapperEl[0].removeEventListener(
                    'transitionend',
                    a.onTranslateToWrapperTransitionEnd
                  ),
                  a.$wrapperEl[0].removeEventListener(
                    'webkitTransitionEnd',
                    a.onTranslateToWrapperTransitionEnd
                  ),
                  (a.onTranslateToWrapperTransitionEnd = null),
                  delete a.onTranslateToWrapperTransitionEnd,
                  i && a.emit('transitionEnd'));
              }),
            a.$wrapperEl[0].addEventListener(
              'transitionend',
              a.onTranslateToWrapperTransitionEnd
            ),
            a.$wrapperEl[0].addEventListener(
              'webkitTransitionEnd',
              a.onTranslateToWrapperTransitionEnd
            ))),
      !0
    );
  },
};
var Kd = {
  setTransition: function (e, t) {
    const i = this;
    i.params.cssMode || i.$wrapperEl.transition(e),
      i.emit('setTransition', e, t);
  },
  transitionStart: function (e = !0, t) {
    const i = this,
      { activeIndex: s, params: n, previousIndex: a } = i;
    if (n.cssMode) return;
    n.autoHeight && i.updateAutoHeight();
    let r = t;
    if (
      (r || (r = s > a ? 'next' : s < a ? 'prev' : 'reset'),
      i.emit('transitionStart'),
      e && s !== a)
    ) {
      if ('reset' === r) return void i.emit('slideResetTransitionStart');
      i.emit('slideChangeTransitionStart'),
        i.emit(
          'next' === r ? 'slideNextTransitionStart' : 'slidePrevTransitionStart'
        );
    }
  },
  transitionEnd: function (e = !0, t) {
    const i = this,
      { activeIndex: s, previousIndex: n, params: a } = i;
    if (((i.animating = !1), a.cssMode)) return;
    i.setTransition(0);
    let r = t;
    if (
      (r || (r = s > n ? 'next' : s < n ? 'prev' : 'reset'),
      i.emit('transitionEnd'),
      e && s !== n)
    ) {
      if ('reset' === r) return void i.emit('slideResetTransitionEnd');
      i.emit('slideChangeTransitionEnd'),
        i.emit(
          'next' === r ? 'slideNextTransitionEnd' : 'slidePrevTransitionEnd'
        );
    }
  },
};
var Jd = {
  slideTo: function (e = 0, t = this.params.speed, i = !0, s) {
    const n = this;
    let a = e;
    a < 0 && (a = 0);
    const {
      params: r,
      snapGrid: o,
      slidesGrid: l,
      previousIndex: d,
      activeIndex: c,
      rtlTranslate: h,
      wrapperEl: p,
    } = n;
    if (n.animating && r.preventInteractionOnTransition) return !1;
    const u = Math.min(n.params.slidesPerGroupSkip, a);
    let m = u + Math.floor((a - u) / n.params.slidesPerGroup);
    m >= o.length && (m = o.length - 1),
      (c || r.initialSlide || 0) === (d || 0) &&
        i &&
        n.emit('beforeSlideChangeStart');
    const f = -o[m];
    if ((n.updateProgress(f), r.normalizeSlideIndex))
      for (let e = 0; e < l.length; e += 1)
        -Math.floor(100 * f) >= Math.floor(100 * l[e]) && (a = e);
    if (n.initialized && a !== c) {
      if (!n.allowSlideNext && f < n.translate && f < n.minTranslate())
        return !1;
      if (
        !n.allowSlidePrev &&
        f > n.translate &&
        f > n.maxTranslate() &&
        (c || 0) !== a
      )
        return !1;
    }
    let g;
    if (
      ((g = a > c ? 'next' : a < c ? 'prev' : 'reset'),
      (h && -f === n.translate) || (!h && f === n.translate))
    )
      return (
        n.updateActiveIndex(a),
        r.autoHeight && n.updateAutoHeight(),
        n.updateSlidesClasses(),
        'slide' !== r.effect && n.setTranslate(f),
        'reset' !== g && (n.transitionStart(i, g), n.transitionEnd(i, g)),
        !1
      );
    if (r.cssMode) {
      const e = n.isHorizontal();
      return (
        0 === t
          ? (p[e ? 'scrollLeft' : 'scrollTop'] = -f)
          : p.scrollTo
          ? p.scrollTo({ [e ? 'left' : 'top']: -f, behavior: 'smooth' })
          : (p[e ? 'scrollLeft' : 'scrollTop'] = -f),
        !0
      );
    }
    return (
      0 === t
        ? (n.setTransition(0),
          n.setTranslate(f),
          n.updateActiveIndex(a),
          n.updateSlidesClasses(),
          n.emit('beforeTransitionStart', t, s),
          n.transitionStart(i, g),
          n.transitionEnd(i, g))
        : (n.setTransition(t),
          n.setTranslate(f),
          n.updateActiveIndex(a),
          n.updateSlidesClasses(),
          n.emit('beforeTransitionStart', t, s),
          n.transitionStart(i, g),
          n.animating ||
            ((n.animating = !0),
            n.onSlideToWrapperTransitionEnd ||
              (n.onSlideToWrapperTransitionEnd = function (e) {
                n &&
                  !n.destroyed &&
                  e.target === this &&
                  (n.$wrapperEl[0].removeEventListener(
                    'transitionend',
                    n.onSlideToWrapperTransitionEnd
                  ),
                  n.$wrapperEl[0].removeEventListener(
                    'webkitTransitionEnd',
                    n.onSlideToWrapperTransitionEnd
                  ),
                  (n.onSlideToWrapperTransitionEnd = null),
                  delete n.onSlideToWrapperTransitionEnd,
                  n.transitionEnd(i, g));
              }),
            n.$wrapperEl[0].addEventListener(
              'transitionend',
              n.onSlideToWrapperTransitionEnd
            ),
            n.$wrapperEl[0].addEventListener(
              'webkitTransitionEnd',
              n.onSlideToWrapperTransitionEnd
            ))),
      !0
    );
  },
  slideToLoop: function (e = 0, t = this.params.speed, i = !0, s) {
    const n = this;
    let a = e;
    return n.params.loop && (a += n.loopedSlides), n.slideTo(a, t, i, s);
  },
  slideNext: function (e = this.params.speed, t = !0, i) {
    const s = this,
      { params: n, animating: a } = s,
      r = s.activeIndex < n.slidesPerGroupSkip ? 1 : n.slidesPerGroup;
    if (n.loop) {
      if (a) return !1;
      s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft);
    }
    return s.slideTo(s.activeIndex + r, e, t, i);
  },
  slidePrev: function (e = this.params.speed, t = !0, i) {
    const s = this,
      {
        params: n,
        animating: a,
        snapGrid: r,
        slidesGrid: o,
        rtlTranslate: l,
      } = s;
    if (n.loop) {
      if (a) return !1;
      s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft);
    }
    function d(e) {
      return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
    }
    const c = d(l ? s.translate : -s.translate),
      h = r.map((e) => d(e));
    o.map((e) => d(e)), h.indexOf(c);
    let p,
      u = r[h.indexOf(c) - 1];
    return (
      void 0 === u &&
        n.cssMode &&
        r.forEach((e) => {
          !u && c >= e && (u = e);
        }),
      void 0 !== u && ((p = o.indexOf(u)), p < 0 && (p = s.activeIndex - 1)),
      s.slideTo(p, e, t, i)
    );
  },
  slideReset: function (e = this.params.speed, t = !0, i) {
    return this.slideTo(this.activeIndex, e, t, i);
  },
  slideToClosest: function (e = this.params.speed, t = !0, i, s = 0.5) {
    const n = this;
    let a = n.activeIndex;
    const r = Math.min(n.params.slidesPerGroupSkip, a),
      o = r + Math.floor((a - r) / n.params.slidesPerGroup),
      l = n.rtlTranslate ? n.translate : -n.translate;
    if (l >= n.snapGrid[o]) {
      const e = n.snapGrid[o];
      l - e > (n.snapGrid[o + 1] - e) * s && (a += n.params.slidesPerGroup);
    } else {
      const e = n.snapGrid[o - 1];
      l - e <= (n.snapGrid[o] - e) * s && (a -= n.params.slidesPerGroup);
    }
    return (
      (a = Math.max(a, 0)),
      (a = Math.min(a, n.slidesGrid.length - 1)),
      n.slideTo(a, e, t, i)
    );
  },
  slideToClickedSlide: function () {
    const e = this,
      { params: t, $wrapperEl: i } = e,
      s =
        'auto' === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
    let n,
      a = e.clickedIndex;
    if (t.loop) {
      if (e.animating) return;
      (n = parseInt(qd(e.clickedSlide).attr('data-swiper-slide-index'), 10)),
        t.centeredSlides
          ? a < e.loopedSlides - s / 2 ||
            a > e.slides.length - e.loopedSlides + s / 2
            ? (e.loopFix(),
              (a = i
                .children(
                  `.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`
                )
                .eq(0)
                .index()),
              Xd.nextTick(() => {
                e.slideTo(a);
              }))
            : e.slideTo(a)
          : a > e.slides.length - s
          ? (e.loopFix(),
            (a = i
              .children(
                `.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`
              )
              .eq(0)
              .index()),
            Xd.nextTick(() => {
              e.slideTo(a);
            }))
          : e.slideTo(a);
    } else e.slideTo(a);
  },
};
var Zd = {
  loopCreate: function () {
    const e = this,
      { params: t, $wrapperEl: i } = e;
    i.children(`.${t.slideClass}.${t.slideDuplicateClass}`).remove();
    let s = i.children(`.${t.slideClass}`);
    if (t.loopFillGroupWithBlank) {
      const e = t.slidesPerGroup - (s.length % t.slidesPerGroup);
      if (e !== t.slidesPerGroup) {
        for (let s = 0; s < e; s += 1) {
          const e = qd(Rd.createElement('div')).addClass(
            `${t.slideClass} ${t.slideBlankClass}`
          );
          i.append(e);
        }
        s = i.children(`.${t.slideClass}`);
      }
    }
    'auto' !== t.slidesPerView || t.loopedSlides || (t.loopedSlides = s.length),
      (e.loopedSlides = Math.ceil(
        parseFloat(t.loopedSlides || t.slidesPerView, 10)
      )),
      (e.loopedSlides += t.loopAdditionalSlides),
      e.loopedSlides > s.length && (e.loopedSlides = s.length);
    const n = [],
      a = [];
    s.each((t, i) => {
      const r = qd(i);
      t < e.loopedSlides && a.push(i),
        t < s.length && t >= s.length - e.loopedSlides && n.push(i),
        r.attr('data-swiper-slide-index', t);
    });
    for (let e = 0; e < a.length; e += 1)
      i.append(qd(a[e].cloneNode(!0)).addClass(t.slideDuplicateClass));
    for (let e = n.length - 1; e >= 0; e -= 1)
      i.prepend(qd(n[e].cloneNode(!0)).addClass(t.slideDuplicateClass));
  },
  loopFix: function () {
    const e = this;
    e.emit('beforeLoopFix');
    const {
      activeIndex: t,
      slides: i,
      loopedSlides: s,
      allowSlidePrev: n,
      allowSlideNext: a,
      snapGrid: r,
      rtlTranslate: o,
    } = e;
    let l;
    (e.allowSlidePrev = !0), (e.allowSlideNext = !0);
    const d = -r[t] - e.getTranslate();
    if (t < s) {
      (l = i.length - 3 * s + t),
        (l += s),
        e.slideTo(l, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((o ? -e.translate : e.translate) - d);
    } else if (t >= i.length - s) {
      (l = -i.length + t + s),
        (l += s),
        e.slideTo(l, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((o ? -e.translate : e.translate) - d);
    }
    (e.allowSlidePrev = n), (e.allowSlideNext = a), e.emit('loopFix');
  },
  loopDestroy: function () {
    const { $wrapperEl: e, params: t, slides: i } = this;
    e
      .children(
        `.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`
      )
      .remove(),
      i.removeAttr('data-swiper-slide-index');
  },
};
var Qd = {
  setGrabCursor: function (e) {
    if (
      Wd.touch ||
      !this.params.simulateTouch ||
      (this.params.watchOverflow && this.isLocked) ||
      this.params.cssMode
    )
      return;
    const t = this.el;
    (t.style.cursor = 'move'),
      (t.style.cursor = e ? '-webkit-grabbing' : '-webkit-grab'),
      (t.style.cursor = e ? '-moz-grabbin' : '-moz-grab'),
      (t.style.cursor = e ? 'grabbing' : 'grab');
  },
  unsetGrabCursor: function () {
    Wd.touch ||
      (this.params.watchOverflow && this.isLocked) ||
      this.params.cssMode ||
      (this.el.style.cursor = '');
  },
};
var ec = {
  appendSlide: function (e) {
    const t = this,
      { $wrapperEl: i, params: s } = t;
    if ((s.loop && t.loopDestroy(), 'object' == typeof e && 'length' in e))
      for (let t = 0; t < e.length; t += 1) e[t] && i.append(e[t]);
    else i.append(e);
    s.loop && t.loopCreate(), (s.observer && Wd.observer) || t.update();
  },
  prependSlide: function (e) {
    const t = this,
      { params: i, $wrapperEl: s, activeIndex: n } = t;
    i.loop && t.loopDestroy();
    let a = n + 1;
    if ('object' == typeof e && 'length' in e) {
      for (let t = 0; t < e.length; t += 1) e[t] && s.prepend(e[t]);
      a = n + e.length;
    } else s.prepend(e);
    i.loop && t.loopCreate(),
      (i.observer && Wd.observer) || t.update(),
      t.slideTo(a, 0, !1);
  },
  addSlide: function (e, t) {
    const i = this,
      { $wrapperEl: s, params: n, activeIndex: a } = i;
    let r = a;
    n.loop &&
      ((r -= i.loopedSlides),
      i.loopDestroy(),
      (i.slides = s.children(`.${n.slideClass}`)));
    const o = i.slides.length;
    if (e <= 0) return void i.prependSlide(t);
    if (e >= o) return void i.appendSlide(t);
    let l = r > e ? r + 1 : r;
    const d = [];
    for (let t = o - 1; t >= e; t -= 1) {
      const e = i.slides.eq(t);
      e.remove(), d.unshift(e);
    }
    if ('object' == typeof t && 'length' in t) {
      for (let e = 0; e < t.length; e += 1) t[e] && s.append(t[e]);
      l = r > e ? r + t.length : r;
    } else s.append(t);
    for (let e = 0; e < d.length; e += 1) s.append(d[e]);
    n.loop && i.loopCreate(),
      (n.observer && Wd.observer) || i.update(),
      i.slideTo(n.loop ? l + i.loopedSlides : l, 0, !1);
  },
  removeSlide: function (e) {
    const t = this,
      { params: i, $wrapperEl: s, activeIndex: n } = t;
    let a = n;
    i.loop &&
      ((a -= t.loopedSlides),
      t.loopDestroy(),
      (t.slides = s.children(`.${i.slideClass}`)));
    let r,
      o = a;
    if ('object' == typeof e && 'length' in e) {
      for (let i = 0; i < e.length; i += 1)
        (r = e[i]), t.slides[r] && t.slides.eq(r).remove(), r < o && (o -= 1);
      o = Math.max(o, 0);
    } else
      (r = e),
        t.slides[r] && t.slides.eq(r).remove(),
        r < o && (o -= 1),
        (o = Math.max(o, 0));
    i.loop && t.loopCreate(),
      (i.observer && Wd.observer) || t.update(),
      t.slideTo(i.loop ? o + t.loopedSlides : o, 0, !1);
  },
  removeAllSlides: function () {
    const e = this,
      t = [];
    for (let i = 0; i < e.slides.length; i += 1) t.push(i);
    e.removeSlide(t);
  },
};
const tc = (function () {
  const e = Vd.navigator.platform,
    t = Vd.navigator.userAgent,
    i = {
      ios: !1,
      android: !1,
      androidChrome: !1,
      desktop: !1,
      iphone: !1,
      ipod: !1,
      ipad: !1,
      edge: !1,
      ie: !1,
      firefox: !1,
      macos: !1,
      windows: !1,
      cordova: !(!Vd.cordova && !Vd.phonegap),
      phonegap: !(!Vd.cordova && !Vd.phonegap),
      electron: !1,
    },
    s = Vd.screen.width,
    n = Vd.screen.height,
    a = t.match(/(Android);?[\s\/]+([\d.]+)?/);
  let r = t.match(/(iPad).*OS\s([\d_]+)/);
  const o = t.match(/(iPod)(.*OS\s([\d_]+))?/),
    l = !r && t.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
    d = t.indexOf('MSIE ') >= 0 || t.indexOf('Trident/') >= 0,
    c = t.indexOf('Edge/') >= 0,
    h = t.indexOf('Gecko/') >= 0 && t.indexOf('Firefox/') >= 0,
    p = 'Win32' === e,
    u = t.toLowerCase().indexOf('electron') >= 0;
  let m = 'MacIntel' === e;
  return (
    !r &&
      m &&
      Wd.touch &&
      ((1024 === s && 1366 === n) ||
        (834 === s && 1194 === n) ||
        (834 === s && 1112 === n) ||
        (768 === s && 1024 === n)) &&
      ((r = t.match(/(Version)\/([\d.]+)/)), (m = !1)),
    (i.ie = d),
    (i.edge = c),
    (i.firefox = h),
    a &&
      !p &&
      ((i.os = 'android'),
      (i.osVersion = a[2]),
      (i.android = !0),
      (i.androidChrome = t.toLowerCase().indexOf('chrome') >= 0)),
    (r || l || o) && ((i.os = 'ios'), (i.ios = !0)),
    l && !o && ((i.osVersion = l[2].replace(/_/g, '.')), (i.iphone = !0)),
    r && ((i.osVersion = r[2].replace(/_/g, '.')), (i.ipad = !0)),
    o && ((i.osVersion = o[3] ? o[3].replace(/_/g, '.') : null), (i.ipod = !0)),
    i.ios &&
      i.osVersion &&
      t.indexOf('Version/') >= 0 &&
      '10' === i.osVersion.split('.')[0] &&
      (i.osVersion = t.toLowerCase().split('version/')[1].split(' ')[0]),
    (i.webView =
      !(
        !(l || r || o) ||
        (!t.match(/.*AppleWebKit(?!.*Safari)/i) && !Vd.navigator.standalone)
      ) ||
      (Vd.matchMedia && Vd.matchMedia('(display-mode: standalone)').matches)),
    (i.webview = i.webView),
    (i.standalone = i.webView),
    (i.desktop = !(i.ios || i.android) || u),
    i.desktop &&
      ((i.electron = u),
      (i.macos = m),
      (i.windows = p),
      i.macos && (i.os = 'macos'),
      i.windows && (i.os = 'windows')),
    (i.pixelRatio = Vd.devicePixelRatio || 1),
    i
  );
})();
function ic(e) {
  const t = this,
    i = t.touchEventsData,
    { params: s, touches: n } = t;
  if (t.animating && s.preventInteractionOnTransition) return;
  let a = e;
  a.originalEvent && (a = a.originalEvent);
  const r = qd(a.target);
  if ('wrapper' === s.touchEventsTarget && !r.closest(t.wrapperEl).length)
    return;
  if (
    ((i.isTouchEvent = 'touchstart' === a.type),
    !i.isTouchEvent && 'which' in a && 3 === a.which)
  )
    return;
  if (!i.isTouchEvent && 'button' in a && a.button > 0) return;
  if (i.isTouched && i.isMoved) return;
  if (
    s.noSwiping &&
    r.closest(
      s.noSwipingSelector ? s.noSwipingSelector : `.${s.noSwipingClass}`
    )[0]
  )
    return void (t.allowClick = !0);
  if (s.swipeHandler && !r.closest(s.swipeHandler)[0]) return;
  (n.currentX = 'touchstart' === a.type ? a.targetTouches[0].pageX : a.pageX),
    (n.currentY = 'touchstart' === a.type ? a.targetTouches[0].pageY : a.pageY);
  const o = n.currentX,
    l = n.currentY,
    d = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
  if (
    !(s.edgeSwipeDetection || s.iOSEdgeSwipeDetection) ||
    !(o <= d || o >= Vd.screen.width - d)
  ) {
    if (
      (Xd.extend(i, {
        isTouched: !0,
        isMoved: !1,
        allowTouchCallbacks: !0,
        isScrolling: void 0,
        startMoving: void 0,
      }),
      (n.startX = o),
      (n.startY = l),
      (i.touchStartTime = Xd.now()),
      (t.allowClick = !0),
      t.updateSize(),
      (t.swipeDirection = void 0),
      s.threshold > 0 && (i.allowThresholdMove = !1),
      'touchstart' !== a.type)
    ) {
      let e = !0;
      r.is(i.formElements) && (e = !1),
        Rd.activeElement &&
          qd(Rd.activeElement).is(i.formElements) &&
          Rd.activeElement !== r[0] &&
          Rd.activeElement.blur();
      const n = e && t.allowTouchMove && s.touchStartPreventDefault;
      (s.touchStartForcePreventDefault || n) && a.preventDefault();
    }
    t.emit('touchStart', a);
  }
}
function sc(e) {
  const t = this,
    i = t.touchEventsData,
    { params: s, touches: n, rtlTranslate: a } = t;
  let r = e;
  if ((r.originalEvent && (r = r.originalEvent), !i.isTouched))
    return void (
      i.startMoving &&
      i.isScrolling &&
      t.emit('touchMoveOpposite', r)
    );
  if (i.isTouchEvent && 'mousemove' === r.type) return;
  const o =
      'touchmove' === r.type &&
      r.targetTouches &&
      (r.targetTouches[0] || r.changedTouches[0]),
    l = 'touchmove' === r.type ? o.pageX : r.pageX,
    d = 'touchmove' === r.type ? o.pageY : r.pageY;
  if (r.preventedByNestedSwiper) return (n.startX = l), void (n.startY = d);
  if (!t.allowTouchMove)
    return (
      (t.allowClick = !1),
      void (
        i.isTouched &&
        (Xd.extend(n, { startX: l, startY: d, currentX: l, currentY: d }),
        (i.touchStartTime = Xd.now()))
      )
    );
  if (i.isTouchEvent && s.touchReleaseOnEdges && !s.loop)
    if (t.isVertical()) {
      if (
        (d < n.startY && t.translate <= t.maxTranslate()) ||
        (d > n.startY && t.translate >= t.minTranslate())
      )
        return (i.isTouched = !1), void (i.isMoved = !1);
    } else if (
      (l < n.startX && t.translate <= t.maxTranslate()) ||
      (l > n.startX && t.translate >= t.minTranslate())
    )
      return;
  if (
    i.isTouchEvent &&
    Rd.activeElement &&
    r.target === Rd.activeElement &&
    qd(r.target).is(i.formElements)
  )
    return (i.isMoved = !0), void (t.allowClick = !1);
  if (
    (i.allowTouchCallbacks && t.emit('touchMove', r),
    r.targetTouches && r.targetTouches.length > 1)
  )
    return;
  (n.currentX = l), (n.currentY = d);
  const c = n.currentX - n.startX,
    h = n.currentY - n.startY;
  if (t.params.threshold && Math.sqrt(c ** 2 + h ** 2) < t.params.threshold)
    return;
  if (void 0 === i.isScrolling) {
    let e;
    (t.isHorizontal() && n.currentY === n.startY) ||
    (t.isVertical() && n.currentX === n.startX)
      ? (i.isScrolling = !1)
      : c * c + h * h >= 25 &&
        ((e = (180 * Math.atan2(Math.abs(h), Math.abs(c))) / Math.PI),
        (i.isScrolling = t.isHorizontal()
          ? e > s.touchAngle
          : 90 - e > s.touchAngle));
  }
  if (
    (i.isScrolling && t.emit('touchMoveOpposite', r),
    void 0 === i.startMoving &&
      ((n.currentX === n.startX && n.currentY === n.startY) ||
        (i.startMoving = !0)),
    i.isScrolling)
  )
    return void (i.isTouched = !1);
  if (!i.startMoving) return;
  (t.allowClick = !1),
    s.cssMode || r.preventDefault(),
    s.touchMoveStopPropagation && !s.nested && r.stopPropagation(),
    i.isMoved ||
      (s.loop && t.loopFix(),
      (i.startTranslate = t.getTranslate()),
      t.setTransition(0),
      t.animating && t.$wrapperEl.trigger('webkitTransitionEnd transitionend'),
      (i.allowMomentumBounce = !1),
      !s.grabCursor ||
        (!0 !== t.allowSlideNext && !0 !== t.allowSlidePrev) ||
        t.setGrabCursor(!0),
      t.emit('sliderFirstMove', r)),
    t.emit('sliderMove', r),
    (i.isMoved = !0);
  let p = t.isHorizontal() ? c : h;
  (n.diff = p),
    (p *= s.touchRatio),
    a && (p = -p),
    (t.swipeDirection = p > 0 ? 'prev' : 'next'),
    (i.currentTranslate = p + i.startTranslate);
  let u = !0,
    m = s.resistanceRatio;
  if (
    (s.touchReleaseOnEdges && (m = 0),
    p > 0 && i.currentTranslate > t.minTranslate()
      ? ((u = !1),
        s.resistance &&
          (i.currentTranslate =
            t.minTranslate() -
            1 +
            (-t.minTranslate() + i.startTranslate + p) ** m))
      : p < 0 &&
        i.currentTranslate < t.maxTranslate() &&
        ((u = !1),
        s.resistance &&
          (i.currentTranslate =
            t.maxTranslate() +
            1 -
            (t.maxTranslate() - i.startTranslate - p) ** m)),
    u && (r.preventedByNestedSwiper = !0),
    !t.allowSlideNext &&
      'next' === t.swipeDirection &&
      i.currentTranslate < i.startTranslate &&
      (i.currentTranslate = i.startTranslate),
    !t.allowSlidePrev &&
      'prev' === t.swipeDirection &&
      i.currentTranslate > i.startTranslate &&
      (i.currentTranslate = i.startTranslate),
    s.threshold > 0)
  ) {
    if (!(Math.abs(p) > s.threshold || i.allowThresholdMove))
      return void (i.currentTranslate = i.startTranslate);
    if (!i.allowThresholdMove)
      return (
        (i.allowThresholdMove = !0),
        (n.startX = n.currentX),
        (n.startY = n.currentY),
        (i.currentTranslate = i.startTranslate),
        void (n.diff = t.isHorizontal()
          ? n.currentX - n.startX
          : n.currentY - n.startY)
      );
  }
  s.followFinger &&
    !s.cssMode &&
    ((s.freeMode || s.watchSlidesProgress || s.watchSlidesVisibility) &&
      (t.updateActiveIndex(), t.updateSlidesClasses()),
    s.freeMode &&
      (0 === i.velocities.length &&
        i.velocities.push({
          position: n[t.isHorizontal() ? 'startX' : 'startY'],
          time: i.touchStartTime,
        }),
      i.velocities.push({
        position: n[t.isHorizontal() ? 'currentX' : 'currentY'],
        time: Xd.now(),
      })),
    t.updateProgress(i.currentTranslate),
    t.setTranslate(i.currentTranslate));
}
function nc(e) {
  const t = this,
    i = t.touchEventsData,
    {
      params: s,
      touches: n,
      rtlTranslate: a,
      $wrapperEl: r,
      slidesGrid: o,
      snapGrid: l,
    } = t;
  let d = e;
  if (
    (d.originalEvent && (d = d.originalEvent),
    i.allowTouchCallbacks && t.emit('touchEnd', d),
    (i.allowTouchCallbacks = !1),
    !i.isTouched)
  )
    return (
      i.isMoved && s.grabCursor && t.setGrabCursor(!1),
      (i.isMoved = !1),
      void (i.startMoving = !1)
    );
  s.grabCursor &&
    i.isMoved &&
    i.isTouched &&
    (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
    t.setGrabCursor(!1);
  const c = Xd.now(),
    h = c - i.touchStartTime;
  if (
    (t.allowClick &&
      (t.updateClickedSlide(d),
      t.emit('tap click', d),
      h < 300 &&
        c - i.lastClickTime < 300 &&
        t.emit('doubleTap doubleClick', d)),
    (i.lastClickTime = Xd.now()),
    Xd.nextTick(() => {
      t.destroyed || (t.allowClick = !0);
    }),
    !i.isTouched ||
      !i.isMoved ||
      !t.swipeDirection ||
      0 === n.diff ||
      i.currentTranslate === i.startTranslate)
  )
    return (i.isTouched = !1), (i.isMoved = !1), void (i.startMoving = !1);
  let p;
  if (
    ((i.isTouched = !1),
    (i.isMoved = !1),
    (i.startMoving = !1),
    (p = s.followFinger
      ? a
        ? t.translate
        : -t.translate
      : -i.currentTranslate),
    s.cssMode)
  )
    return;
  if (s.freeMode) {
    if (p < -t.minTranslate()) return void t.slideTo(t.activeIndex);
    if (p > -t.maxTranslate())
      return void t.slideTo(
        t.slides.length < l.length ? l.length - 1 : t.slides.length - 1
      );
    if (s.freeModeMomentum) {
      if (i.velocities.length > 1) {
        const e = i.velocities.pop(),
          n = i.velocities.pop(),
          a = e.time - n.time;
        (t.velocity = (e.position - n.position) / a),
          (t.velocity /= 2),
          Math.abs(t.velocity) < s.freeModeMinimumVelocity && (t.velocity = 0),
          (a > 150 || Xd.now() - e.time > 300) && (t.velocity = 0);
      } else t.velocity = 0;
      (t.velocity *= s.freeModeMomentumVelocityRatio),
        (i.velocities.length = 0);
      let e = 1e3 * s.freeModeMomentumRatio;
      let n = t.translate + t.velocity * e;
      a && (n = -n);
      let o,
        d = !1;
      const c = 20 * Math.abs(t.velocity) * s.freeModeMomentumBounceRatio;
      let h;
      if (n < t.maxTranslate())
        s.freeModeMomentumBounce
          ? (n + t.maxTranslate() < -c && (n = t.maxTranslate() - c),
            (o = t.maxTranslate()),
            (d = !0),
            (i.allowMomentumBounce = !0))
          : (n = t.maxTranslate()),
          s.loop && s.centeredSlides && (h = !0);
      else if (n > t.minTranslate())
        s.freeModeMomentumBounce
          ? (n - t.minTranslate() > c && (n = t.minTranslate() + c),
            (o = t.minTranslate()),
            (d = !0),
            (i.allowMomentumBounce = !0))
          : (n = t.minTranslate()),
          s.loop && s.centeredSlides && (h = !0);
      else if (s.freeModeSticky) {
        let e;
        for (let t = 0; t < l.length; t += 1)
          if (l[t] > -n) {
            e = t;
            break;
          }
        (n =
          Math.abs(l[e] - n) < Math.abs(l[e - 1] - n) ||
          'next' === t.swipeDirection
            ? l[e]
            : l[e - 1]),
          (n = -n);
      }
      if (
        (h &&
          t.once('transitionEnd', () => {
            t.loopFix();
          }),
        0 !== t.velocity)
      ) {
        if (
          ((e = a
            ? Math.abs((-n - t.translate) / t.velocity)
            : Math.abs((n - t.translate) / t.velocity)),
          s.freeModeSticky)
        ) {
          const i = Math.abs((a ? -n : n) - t.translate),
            r = t.slidesSizesGrid[t.activeIndex];
          e = i < r ? s.speed : i < 2 * r ? 1.5 * s.speed : 2.5 * s.speed;
        }
      } else if (s.freeModeSticky) return void t.slideToClosest();
      s.freeModeMomentumBounce && d
        ? (t.updateProgress(o),
          t.setTransition(e),
          t.setTranslate(n),
          t.transitionStart(!0, t.swipeDirection),
          (t.animating = !0),
          r.transitionEnd(() => {
            t &&
              !t.destroyed &&
              i.allowMomentumBounce &&
              (t.emit('momentumBounce'),
              t.setTransition(s.speed),
              t.setTranslate(o),
              r.transitionEnd(() => {
                t && !t.destroyed && t.transitionEnd();
              }));
          }))
        : t.velocity
        ? (t.updateProgress(n),
          t.setTransition(e),
          t.setTranslate(n),
          t.transitionStart(!0, t.swipeDirection),
          t.animating ||
            ((t.animating = !0),
            r.transitionEnd(() => {
              t && !t.destroyed && t.transitionEnd();
            })))
        : t.updateProgress(n),
        t.updateActiveIndex(),
        t.updateSlidesClasses();
    } else if (s.freeModeSticky) return void t.slideToClosest();
    return void (
      (!s.freeModeMomentum || h >= s.longSwipesMs) &&
      (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses())
    );
  }
  let u = 0,
    m = t.slidesSizesGrid[0];
  for (
    let e = 0;
    e < o.length;
    e += e < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup
  ) {
    const t = e < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
    void 0 !== o[e + t]
      ? p >= o[e] && p < o[e + t] && ((u = e), (m = o[e + t] - o[e]))
      : p >= o[e] && ((u = e), (m = o[o.length - 1] - o[o.length - 2]));
  }
  const f = (p - o[u]) / m,
    g = u < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
  if (h > s.longSwipesMs) {
    if (!s.longSwipes) return void t.slideTo(t.activeIndex);
    'next' === t.swipeDirection &&
      t.slideTo(f >= s.longSwipesRatio ? u + g : u),
      'prev' === t.swipeDirection &&
        t.slideTo(f > 1 - s.longSwipesRatio ? u + g : u);
  } else {
    if (!s.shortSwipes) return void t.slideTo(t.activeIndex);
    t.navigation &&
    (d.target === t.navigation.nextEl || d.target === t.navigation.prevEl)
      ? t.slideTo(d.target === t.navigation.nextEl ? u + g : u)
      : ('next' === t.swipeDirection && t.slideTo(u + g),
        'prev' === t.swipeDirection && t.slideTo(u));
  }
}
function ac() {
  const e = this,
    { params: t, el: i } = e;
  if (i && 0 === i.offsetWidth) return;
  t.breakpoints && e.setBreakpoint();
  const { allowSlideNext: s, allowSlidePrev: n, snapGrid: a } = e;
  (e.allowSlideNext = !0),
    (e.allowSlidePrev = !0),
    e.updateSize(),
    e.updateSlides(),
    e.updateSlidesClasses(),
    e.slideTo(
      ('auto' === t.slidesPerView || t.slidesPerView > 1) &&
        e.isEnd &&
        !e.params.centeredSlides
        ? e.slides.length - 1
        : e.activeIndex,
      0,
      !1,
      !0
    ),
    e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
    (e.allowSlidePrev = n),
    (e.allowSlideNext = s),
    e.params.watchOverflow && a !== e.snapGrid && e.checkOverflow();
}
function rc(e) {
  const t = this;
  t.allowClick ||
    (t.params.preventClicks && e.preventDefault(),
    t.params.preventClicksPropagation &&
      t.animating &&
      (e.stopPropagation(), e.stopImmediatePropagation()));
}
function oc() {
  const e = this,
    { wrapperEl: t } = e;
  let i;
  (e.previousTranslate = e.translate),
    (e.translate = e.isHorizontal() ? -t.scrollLeft : -t.scrollTop),
    -0 === e.translate && (e.translate = 0),
    e.updateActiveIndex(),
    e.updateSlidesClasses();
  const s = e.maxTranslate() - e.minTranslate();
  (i = 0 === s ? 0 : (e.translate - e.minTranslate()) / s),
    i !== e.progress && e.updateProgress(e.translate),
    e.emit('setTranslate', e.translate, !1);
}
let lc = !1;
function dc() {}
var cc = {
  init: !0,
  direction: 'horizontal',
  touchEventsTarget: 'container',
  initialSlide: 0,
  speed: 300,
  cssMode: !1,
  updateOnWindowResize: !0,
  preventInteractionOnTransition: !1,
  edgeSwipeDetection: !1,
  edgeSwipeThreshold: 20,
  freeMode: !1,
  freeModeMomentum: !0,
  freeModeMomentumRatio: 1,
  freeModeMomentumBounce: !0,
  freeModeMomentumBounceRatio: 1,
  freeModeMomentumVelocityRatio: 1,
  freeModeSticky: !1,
  freeModeMinimumVelocity: 0.02,
  autoHeight: !1,
  setWrapperSize: !1,
  virtualTranslate: !1,
  effect: 'slide',
  breakpoints: void 0,
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: 'column',
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  centeredSlides: !1,
  centeredSlidesBounds: !1,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
  normalizeSlideIndex: !0,
  centerInsufficientSlides: !1,
  watchOverflow: !1,
  roundLengths: !1,
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: !0,
  shortSwipes: !0,
  longSwipes: !0,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: !0,
  allowTouchMove: !0,
  threshold: 0,
  touchMoveStopPropagation: !1,
  touchStartPreventDefault: !0,
  touchStartForcePreventDefault: !1,
  touchReleaseOnEdges: !1,
  uniqueNavElements: !0,
  resistance: !0,
  resistanceRatio: 0.85,
  watchSlidesProgress: !1,
  watchSlidesVisibility: !1,
  grabCursor: !1,
  preventClicks: !0,
  preventClicksPropagation: !0,
  slideToClickedSlide: !1,
  preloadImages: !0,
  updateOnImagesReady: !0,
  loop: !1,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: !1,
  allowSlidePrev: !0,
  allowSlideNext: !0,
  swipeHandler: null,
  noSwiping: !0,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  passiveListeners: !0,
  containerModifierClass: 'swiper-container-',
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  runCallbacksOnInit: !0,
};
const hc = {
    update: _d,
    translate: Ud,
    transition: Kd,
    slide: Jd,
    loop: Zd,
    grabCursor: Qd,
    manipulation: ec,
    events: {
      attachEvents: function () {
        const e = this,
          { params: t, touchEvents: i, el: s, wrapperEl: n } = e;
        (e.onTouchStart = ic.bind(e)),
          (e.onTouchMove = sc.bind(e)),
          (e.onTouchEnd = nc.bind(e)),
          t.cssMode && (e.onScroll = oc.bind(e)),
          (e.onClick = rc.bind(e));
        const a = !!t.nested;
        if (!Wd.touch && Wd.pointerEvents)
          s.addEventListener(i.start, e.onTouchStart, !1),
            Rd.addEventListener(i.move, e.onTouchMove, a),
            Rd.addEventListener(i.end, e.onTouchEnd, !1);
        else {
          if (Wd.touch) {
            const n = !(
              'touchstart' !== i.start ||
              !Wd.passiveListener ||
              !t.passiveListeners
            ) && { passive: !0, capture: !1 };
            s.addEventListener(i.start, e.onTouchStart, n),
              s.addEventListener(
                i.move,
                e.onTouchMove,
                Wd.passiveListener ? { passive: !1, capture: a } : a
              ),
              s.addEventListener(i.end, e.onTouchEnd, n),
              i.cancel && s.addEventListener(i.cancel, e.onTouchEnd, n),
              lc || (Rd.addEventListener('touchstart', dc), (lc = !0));
          }
          ((t.simulateTouch && !tc.ios && !tc.android) ||
            (t.simulateTouch && !Wd.touch && tc.ios)) &&
            (s.addEventListener('mousedown', e.onTouchStart, !1),
            Rd.addEventListener('mousemove', e.onTouchMove, a),
            Rd.addEventListener('mouseup', e.onTouchEnd, !1));
        }
        (t.preventClicks || t.preventClicksPropagation) &&
          s.addEventListener('click', e.onClick, !0),
          t.cssMode && n.addEventListener('scroll', e.onScroll),
          e.on(
            t.updateOnWindowResize
              ? tc.ios || tc.android
                ? 'resize orientationchange observerUpdate'
                : 'resize observerUpdate'
              : 'observerUpdate',
            ac,
            !0
          );
      },
      detachEvents: function () {
        const e = this,
          { params: t, touchEvents: i, el: s, wrapperEl: n } = e,
          a = !!t.nested;
        if (!Wd.touch && Wd.pointerEvents)
          s.removeEventListener(i.start, e.onTouchStart, !1),
            Rd.removeEventListener(i.move, e.onTouchMove, a),
            Rd.removeEventListener(i.end, e.onTouchEnd, !1);
        else {
          if (Wd.touch) {
            const n = !(
              'onTouchStart' !== i.start ||
              !Wd.passiveListener ||
              !t.passiveListeners
            ) && { passive: !0, capture: !1 };
            s.removeEventListener(i.start, e.onTouchStart, n),
              s.removeEventListener(i.move, e.onTouchMove, a),
              s.removeEventListener(i.end, e.onTouchEnd, n),
              i.cancel && s.removeEventListener(i.cancel, e.onTouchEnd, n);
          }
          ((t.simulateTouch && !tc.ios && !tc.android) ||
            (t.simulateTouch && !Wd.touch && tc.ios)) &&
            (s.removeEventListener('mousedown', e.onTouchStart, !1),
            Rd.removeEventListener('mousemove', e.onTouchMove, a),
            Rd.removeEventListener('mouseup', e.onTouchEnd, !1));
        }
        (t.preventClicks || t.preventClicksPropagation) &&
          s.removeEventListener('click', e.onClick, !0),
          t.cssMode && n.removeEventListener('scroll', e.onScroll),
          e.off(
            tc.ios || tc.android
              ? 'resize orientationchange observerUpdate'
              : 'resize observerUpdate',
            ac
          );
      },
    },
    breakpoints: {
      setBreakpoint: function () {
        const e = this,
          {
            activeIndex: t,
            initialized: i,
            loopedSlides: s = 0,
            params: n,
            $el: a,
          } = e,
          r = n.breakpoints;
        if (!r || (r && 0 === Object.keys(r).length)) return;
        const o = e.getBreakpoint(r);
        if (o && e.currentBreakpoint !== o) {
          const l = o in r ? r[o] : void 0;
          l &&
            [
              'slidesPerView',
              'spaceBetween',
              'slidesPerGroup',
              'slidesPerGroupSkip',
              'slidesPerColumn',
            ].forEach((e) => {
              const t = l[e];
              void 0 !== t &&
                (l[e] =
                  'slidesPerView' !== e || ('AUTO' !== t && 'auto' !== t)
                    ? 'slidesPerView' === e
                      ? parseFloat(t)
                      : parseInt(t, 10)
                    : 'auto');
            });
          const d = l || e.originalParams,
            c = n.slidesPerColumn > 1,
            h = d.slidesPerColumn > 1;
          c && !h
            ? a.removeClass(
                `${n.containerModifierClass}multirow ${n.containerModifierClass}multirow-column`
              )
            : !c &&
              h &&
              (a.addClass(`${n.containerModifierClass}multirow`),
              'column' === d.slidesPerColumnFill &&
                a.addClass(`${n.containerModifierClass}multirow-column`));
          const p = d.direction && d.direction !== n.direction,
            u = n.loop && (d.slidesPerView !== n.slidesPerView || p);
          p && i && e.changeDirection(),
            Xd.extend(e.params, d),
            Xd.extend(e, {
              allowTouchMove: e.params.allowTouchMove,
              allowSlideNext: e.params.allowSlideNext,
              allowSlidePrev: e.params.allowSlidePrev,
            }),
            (e.currentBreakpoint = o),
            u &&
              i &&
              (e.loopDestroy(),
              e.loopCreate(),
              e.updateSlides(),
              e.slideTo(t - s + e.loopedSlides, 0, !1)),
            e.emit('breakpoint', d);
        }
      },
      getBreakpoint: function (e) {
        if (!e) return;
        let t = !1;
        const i = Object.keys(e).map((e) => {
          if ('string' == typeof e && 0 === e.indexOf('@')) {
            const t = parseFloat(e.substr(1));
            return { value: Vd.innerHeight * t, point: e };
          }
          return { value: e, point: e };
        });
        i.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
        for (let e = 0; e < i.length; e += 1) {
          const { point: s, value: n } = i[e];
          n <= Vd.innerWidth && (t = s);
        }
        return t || 'max';
      },
    },
    checkOverflow: {
      checkOverflow: function () {
        const e = this,
          t = e.params,
          i = e.isLocked,
          s =
            e.slides.length > 0 &&
            t.slidesOffsetBefore +
              t.spaceBetween * (e.slides.length - 1) +
              e.slides[0].offsetWidth * e.slides.length;
        (e.isLocked =
          t.slidesOffsetBefore && t.slidesOffsetAfter && s
            ? s <= e.size
            : 1 === e.snapGrid.length),
          (e.allowSlideNext = !e.isLocked),
          (e.allowSlidePrev = !e.isLocked),
          i !== e.isLocked && e.emit(e.isLocked ? 'lock' : 'unlock'),
          i && i !== e.isLocked && ((e.isEnd = !1), e.navigation.update());
      },
    },
    classes: {
      addClasses: function () {
        const { classNames: e, params: t, rtl: i, $el: s } = this,
          n = [];
        n.push('initialized'),
          n.push(t.direction),
          t.freeMode && n.push('free-mode'),
          t.autoHeight && n.push('autoheight'),
          i && n.push('rtl'),
          t.slidesPerColumn > 1 &&
            (n.push('multirow'),
            'column' === t.slidesPerColumnFill && n.push('multirow-column')),
          tc.android && n.push('android'),
          tc.ios && n.push('ios'),
          t.cssMode && n.push('css-mode'),
          n.forEach((i) => {
            e.push(t.containerModifierClass + i);
          }),
          s.addClass(e.join(' '));
      },
      removeClasses: function () {
        const { $el: e, classNames: t } = this;
        e.removeClass(t.join(' '));
      },
    },
    images: {
      loadImage: function (e, t, i, s, n, a) {
        let r;
        function o() {
          a && a();
        }
        e.complete && n
          ? o()
          : t
          ? ((r = new Vd.Image()),
            (r.onload = o),
            (r.onerror = o),
            s && (r.sizes = s),
            i && (r.srcset = i),
            t && (r.src = t))
          : o();
      },
      preloadImages: function () {
        const e = this;
        function t() {
          null != e &&
            e &&
            !e.destroyed &&
            (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
            e.imagesLoaded === e.imagesToLoad.length &&
              (e.params.updateOnImagesReady && e.update(),
              e.emit('imagesReady')));
        }
        e.imagesToLoad = e.$el.find('img');
        for (let i = 0; i < e.imagesToLoad.length; i += 1) {
          const s = e.imagesToLoad[i];
          e.loadImage(
            s,
            s.currentSrc || s.getAttribute('src'),
            s.srcset || s.getAttribute('srcset'),
            s.sizes || s.getAttribute('sizes'),
            !0,
            t
          );
        }
      },
    },
  },
  pc = {};
class uc extends jd {
  constructor(...e) {
    let t, i;
    1 === e.length && e[0].constructor && e[0].constructor === Object
      ? (i = e[0])
      : ([t, i] = e),
      i || (i = {}),
      (i = Xd.extend({}, i)),
      t && !i.el && (i.el = t),
      super(i),
      Object.keys(hc).forEach((e) => {
        Object.keys(hc[e]).forEach((t) => {
          uc.prototype[t] || (uc.prototype[t] = hc[e][t]);
        });
      });
    const s = this;
    void 0 === s.modules && (s.modules = {}),
      Object.keys(s.modules).forEach((e) => {
        const t = s.modules[e];
        if (t.params) {
          const e = Object.keys(t.params)[0],
            s = t.params[e];
          if ('object' != typeof s || null === s) return;
          if (!(e in i) || !('enabled' in s)) return;
          !0 === i[e] && (i[e] = { enabled: !0 }),
            'object' != typeof i[e] || 'enabled' in i[e] || (i[e].enabled = !0),
            i[e] || (i[e] = { enabled: !1 });
        }
      });
    const n = Xd.extend({}, cc);
    s.useModulesParams(n),
      (s.params = Xd.extend({}, n, pc, i)),
      (s.originalParams = Xd.extend({}, s.params)),
      (s.passedParams = Xd.extend({}, i)),
      (s.$ = qd);
    const a = qd(s.params.el);
    if (((t = a[0]), !t)) return;
    if (a.length > 1) {
      const e = [];
      return (
        a.each((t, s) => {
          const n = Xd.extend({}, i, { el: s });
          e.push(new uc(n));
        }),
        e
      );
    }
    let r;
    return (
      (t.swiper = s),
      a.data('swiper', s),
      t && t.shadowRoot && t.shadowRoot.querySelector
        ? ((r = qd(t.shadowRoot.querySelector(`.${s.params.wrapperClass}`))),
          (r.children = (e) => a.children(e)))
        : (r = a.children(`.${s.params.wrapperClass}`)),
      Xd.extend(s, {
        $el: a,
        el: t,
        $wrapperEl: r,
        wrapperEl: r[0],
        classNames: [],
        slides: qd(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        isHorizontal: () => 'horizontal' === s.params.direction,
        isVertical: () => 'vertical' === s.params.direction,
        rtl: 'rtl' === t.dir.toLowerCase() || 'rtl' === a.css('direction'),
        rtlTranslate:
          'horizontal' === s.params.direction &&
          ('rtl' === t.dir.toLowerCase() || 'rtl' === a.css('direction')),
        wrongRTL: '-webkit-box' === r.css('display'),
        activeIndex: 0,
        realIndex: 0,
        isBeginning: !0,
        isEnd: !1,
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: !1,
        allowSlideNext: s.params.allowSlideNext,
        allowSlidePrev: s.params.allowSlidePrev,
        touchEvents: (function () {
          const e = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
          let t = ['mousedown', 'mousemove', 'mouseup'];
          return (
            Wd.pointerEvents &&
              (t = ['pointerdown', 'pointermove', 'pointerup']),
            (s.touchEventsTouch = {
              start: e[0],
              move: e[1],
              end: e[2],
              cancel: e[3],
            }),
            (s.touchEventsDesktop = { start: t[0], move: t[1], end: t[2] }),
            Wd.touch || !s.params.simulateTouch
              ? s.touchEventsTouch
              : s.touchEventsDesktop
          );
        })(),
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          formElements: 'input, select, option, textarea, button, video, label',
          lastClickTime: Xd.now(),
          clickTimeout: void 0,
          velocities: [],
          allowMomentumBounce: void 0,
          isTouchEvent: void 0,
          startMoving: void 0,
        },
        allowClick: !0,
        allowTouchMove: s.params.allowTouchMove,
        touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
        imagesToLoad: [],
        imagesLoaded: 0,
      }),
      s.useModules(),
      s.params.init && s.init(),
      s
    );
  }
  slidesPerViewDynamic() {
    const {
      params: e,
      slides: t,
      slidesGrid: i,
      size: s,
      activeIndex: n,
    } = this;
    let a = 1;
    if (e.centeredSlides) {
      let e,
        i = t[n].swiperSlideSize;
      for (let r = n + 1; r < t.length; r += 1)
        t[r] &&
          !e &&
          ((i += t[r].swiperSlideSize), (a += 1), i > s && (e = !0));
      for (let r = n - 1; r >= 0; r -= 1)
        t[r] &&
          !e &&
          ((i += t[r].swiperSlideSize), (a += 1), i > s && (e = !0));
    } else
      for (let e = n + 1; e < t.length; e += 1) i[e] - i[n] < s && (a += 1);
    return a;
  }
  update() {
    const e = this;
    if (!e || e.destroyed) return;
    const { snapGrid: t, params: i } = e;
    function s() {
      const t = Math.min(
        Math.max(
          e.rtlTranslate ? -1 * e.translate : e.translate,
          e.maxTranslate()
        ),
        e.minTranslate()
      );
      e.setTranslate(t), e.updateActiveIndex(), e.updateSlidesClasses();
    }
    let n;
    i.breakpoints && e.setBreakpoint(),
      e.updateSize(),
      e.updateSlides(),
      e.updateProgress(),
      e.updateSlidesClasses(),
      e.params.freeMode
        ? (s(), e.params.autoHeight && e.updateAutoHeight())
        : ((n = e.slideTo(
            ('auto' === e.params.slidesPerView || e.params.slidesPerView > 1) &&
              e.isEnd &&
              !e.params.centeredSlides
              ? e.slides.length - 1
              : e.activeIndex,
            0,
            !1,
            !0
          )),
          n || s()),
      i.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
      e.emit('update');
  }
  changeDirection(e, t = !0) {
    const i = this,
      s = i.params.direction;
    return (
      e || (e = 'horizontal' === s ? 'vertical' : 'horizontal'),
      e === s ||
        ('horizontal' !== e && 'vertical' !== e) ||
        (i.$el
          .removeClass(`${i.params.containerModifierClass}${s}`)
          .addClass(`${i.params.containerModifierClass}${e}`),
        (i.params.direction = e),
        i.slides.each((t, i) => {
          'vertical' === e ? (i.style.width = '') : (i.style.height = '');
        }),
        i.emit('changeDirection'),
        t && i.update()),
      i
    );
  }
  init() {
    const e = this;
    e.initialized ||
      (e.emit('beforeInit'),
      e.params.breakpoints && e.setBreakpoint(),
      e.addClasses(),
      e.params.loop && e.loopCreate(),
      e.updateSize(),
      e.updateSlides(),
      e.params.watchOverflow && e.checkOverflow(),
      e.params.grabCursor && e.setGrabCursor(),
      e.params.preloadImages && e.preloadImages(),
      e.slideTo(
        e.params.loop
          ? e.params.initialSlide + e.loopedSlides
          : e.params.initialSlide,
        0,
        e.params.runCallbacksOnInit
      ),
      e.attachEvents(),
      (e.initialized = !0),
      e.emit('init'));
  }
  destroy(e = !0, t = !0) {
    const i = this,
      { params: s, $el: n, $wrapperEl: a, slides: r } = i;
    return (
      void 0 === i.params ||
        i.destroyed ||
        (i.emit('beforeDestroy'),
        (i.initialized = !1),
        i.detachEvents(),
        s.loop && i.loopDestroy(),
        t &&
          (i.removeClasses(),
          n.removeAttr('style'),
          a.removeAttr('style'),
          r &&
            r.length &&
            r
              .removeClass(
                [
                  s.slideVisibleClass,
                  s.slideActiveClass,
                  s.slideNextClass,
                  s.slidePrevClass,
                ].join(' ')
              )
              .removeAttr('style')
              .removeAttr('data-swiper-slide-index')),
        i.emit('destroy'),
        Object.keys(i.eventsListeners).forEach((e) => {
          i.off(e);
        }),
        !1 !== e &&
          ((i.$el[0].swiper = null),
          i.$el.data('swiper', null),
          Xd.deleteProps(i)),
        (i.destroyed = !0)),
      null
    );
  }
  static extendDefaults(e) {
    Xd.extend(pc, e);
  }
  static get extendedDefaults() {
    return pc;
  }
  static get defaults() {
    return cc;
  }
  static get Class() {
    return jd;
  }
  static get $() {
    return qd;
  }
}
var mc = { name: 'device', proto: { device: tc }, static: { device: tc } },
  fc = { name: 'support', proto: { support: Wd }, static: { support: Wd } };
const gc = {
  isEdge: !!Vd.navigator.userAgent.match(/Edge/g),
  isSafari: (function () {
    const e = Vd.navigator.userAgent.toLowerCase();
    return (
      e.indexOf('safari') >= 0 &&
      e.indexOf('chrome') < 0 &&
      e.indexOf('android') < 0
    );
  })(),
  isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    Vd.navigator.userAgent
  ),
};
var vc = { name: 'browser', proto: { browser: gc }, static: { browser: gc } },
  bc = {
    name: 'resize',
    create() {
      const e = this;
      Xd.extend(e, {
        resize: {
          resizeHandler() {
            e &&
              !e.destroyed &&
              e.initialized &&
              (e.emit('beforeResize'), e.emit('resize'));
          },
          orientationChangeHandler() {
            e && !e.destroyed && e.initialized && e.emit('orientationchange');
          },
        },
      });
    },
    on: {
      init() {
        Vd.addEventListener('resize', this.resize.resizeHandler),
          Vd.addEventListener(
            'orientationchange',
            this.resize.orientationChangeHandler
          );
      },
      destroy() {
        Vd.removeEventListener('resize', this.resize.resizeHandler),
          Vd.removeEventListener(
            'orientationchange',
            this.resize.orientationChangeHandler
          );
      },
    },
  };
const yc = {
  func: Vd.MutationObserver || Vd.WebkitMutationObserver,
  attach(e, t = {}) {
    const i = this,
      s = new (0, yc.func)((e) => {
        if (1 === e.length) return void i.emit('observerUpdate', e[0]);
        const t = function () {
          i.emit('observerUpdate', e[0]);
        };
        Vd.requestAnimationFrame
          ? Vd.requestAnimationFrame(t)
          : Vd.setTimeout(t, 0);
      });
    s.observe(e, {
      attributes: void 0 === t.attributes || t.attributes,
      childList: void 0 === t.childList || t.childList,
      characterData: void 0 === t.characterData || t.characterData,
    }),
      i.observer.observers.push(s);
  },
  init() {
    const e = this;
    if (Wd.observer && e.params.observer) {
      if (e.params.observeParents) {
        const t = e.$el.parents();
        for (let i = 0; i < t.length; i += 1) e.observer.attach(t[i]);
      }
      e.observer.attach(e.$el[0], { childList: e.params.observeSlideChildren }),
        e.observer.attach(e.$wrapperEl[0], { attributes: !1 });
    }
  },
  destroy() {
    this.observer.observers.forEach((e) => {
      e.disconnect();
    }),
      (this.observer.observers = []);
  },
};
var wc = {
  name: 'observer',
  params: { observer: !1, observeParents: !1, observeSlideChildren: !1 },
  create() {
    Xd.extend(this, {
      observer: {
        init: yc.init.bind(this),
        attach: yc.attach.bind(this),
        destroy: yc.destroy.bind(this),
        observers: [],
      },
    });
  },
  on: {
    init() {
      this.observer.init();
    },
    destroy() {
      this.observer.destroy();
    },
  },
};
const xc = {
  update(e) {
    const t = this,
      { slidesPerView: i, slidesPerGroup: s, centeredSlides: n } = t.params,
      { addSlidesBefore: a, addSlidesAfter: r } = t.params.virtual,
      {
        from: o,
        to: l,
        slides: d,
        slidesGrid: c,
        renderSlide: h,
        offset: p,
      } = t.virtual;
    t.updateActiveIndex();
    const u = t.activeIndex || 0;
    let m, f, g;
    (m = t.rtlTranslate ? 'right' : t.isHorizontal() ? 'left' : 'top'),
      n
        ? ((f = Math.floor(i / 2) + s + a), (g = Math.floor(i / 2) + s + r))
        : ((f = i + (s - 1) + a), (g = s + r));
    const v = Math.max((u || 0) - g, 0),
      b = Math.min((u || 0) + f, d.length - 1),
      y = (t.slidesGrid[v] || 0) - (t.slidesGrid[0] || 0);
    function w() {
      t.updateSlides(),
        t.updateProgress(),
        t.updateSlidesClasses(),
        t.lazy && t.params.lazy.enabled && t.lazy.load();
    }
    if (
      (Xd.extend(t.virtual, {
        from: v,
        to: b,
        offset: y,
        slidesGrid: t.slidesGrid,
      }),
      o === v && l === b && !e)
    )
      return (
        t.slidesGrid !== c && y !== p && t.slides.css(m, `${y}px`),
        void t.updateProgress()
      );
    if (t.params.virtual.renderExternal)
      return (
        t.params.virtual.renderExternal.call(t, {
          offset: y,
          from: v,
          to: b,
          slides: (function () {
            const e = [];
            for (let t = v; t <= b; t += 1) e.push(d[t]);
            return e;
          })(),
        }),
        void w()
      );
    const x = [],
      S = [];
    if (e) t.$wrapperEl.find(`.${t.params.slideClass}`).remove();
    else
      for (let e = o; e <= l; e += 1)
        (e < v || e > b) &&
          t.$wrapperEl
            .find(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`)
            .remove();
    for (let t = 0; t < d.length; t += 1)
      t >= v &&
        t <= b &&
        (void 0 === l || e
          ? S.push(t)
          : (t > l && S.push(t), t < o && x.push(t)));
    S.forEach((e) => {
      t.$wrapperEl.append(h(d[e], e));
    }),
      x
        .sort((e, t) => t - e)
        .forEach((e) => {
          t.$wrapperEl.prepend(h(d[e], e));
        }),
      t.$wrapperEl.children('.swiper-slide').css(m, `${y}px`),
      w();
  },
  renderSlide(e, t) {
    const i = this,
      s = i.params.virtual;
    if (s.cache && i.virtual.cache[t]) return i.virtual.cache[t];
    const n = qd(
      s.renderSlide
        ? s.renderSlide.call(i, e, t)
        : `<div class="${i.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`
    );
    return (
      n.attr('data-swiper-slide-index') || n.attr('data-swiper-slide-index', t),
      s.cache && (i.virtual.cache[t] = n),
      n
    );
  },
  appendSlide(e) {
    const t = this;
    if ('object' == typeof e && 'length' in e)
      for (let i = 0; i < e.length; i += 1) e[i] && t.virtual.slides.push(e[i]);
    else t.virtual.slides.push(e);
    t.virtual.update(!0);
  },
  prependSlide(e) {
    const t = this,
      i = t.activeIndex;
    let s = i + 1,
      n = 1;
    if (Array.isArray(e)) {
      for (let i = 0; i < e.length; i += 1)
        e[i] && t.virtual.slides.unshift(e[i]);
      (s = i + e.length), (n = e.length);
    } else t.virtual.slides.unshift(e);
    if (t.params.virtual.cache) {
      const e = t.virtual.cache,
        i = {};
      Object.keys(e).forEach((t) => {
        const s = e[t],
          a = s.attr('data-swiper-slide-index');
        a && s.attr('data-swiper-slide-index', parseInt(a, 10) + 1),
          (i[parseInt(t, 10) + n] = s);
      }),
        (t.virtual.cache = i);
    }
    t.virtual.update(!0), t.slideTo(s, 0);
  },
  removeSlide(e) {
    const t = this;
    if (null == e) return;
    let i = t.activeIndex;
    if (Array.isArray(e))
      for (let s = e.length - 1; s >= 0; s -= 1)
        t.virtual.slides.splice(e[s], 1),
          t.params.virtual.cache && delete t.virtual.cache[e[s]],
          e[s] < i && (i -= 1),
          (i = Math.max(i, 0));
    else
      t.virtual.slides.splice(e, 1),
        t.params.virtual.cache && delete t.virtual.cache[e],
        e < i && (i -= 1),
        (i = Math.max(i, 0));
    t.virtual.update(!0), t.slideTo(i, 0);
  },
  removeAllSlides() {
    const e = this;
    (e.virtual.slides = []),
      e.params.virtual.cache && (e.virtual.cache = {}),
      e.virtual.update(!0),
      e.slideTo(0, 0);
  },
};
var Sc = {
  name: 'virtual',
  params: {
    virtual: {
      enabled: !1,
      slides: [],
      cache: !0,
      renderSlide: null,
      renderExternal: null,
      addSlidesBefore: 0,
      addSlidesAfter: 0,
    },
  },
  create() {
    Xd.extend(this, {
      virtual: {
        update: xc.update.bind(this),
        appendSlide: xc.appendSlide.bind(this),
        prependSlide: xc.prependSlide.bind(this),
        removeSlide: xc.removeSlide.bind(this),
        removeAllSlides: xc.removeAllSlides.bind(this),
        renderSlide: xc.renderSlide.bind(this),
        slides: this.params.virtual.slides,
        cache: {},
      },
    });
  },
  on: {
    beforeInit() {
      const e = this;
      if (!e.params.virtual.enabled) return;
      e.classNames.push(`${e.params.containerModifierClass}virtual`);
      const t = { watchSlidesProgress: !0 };
      Xd.extend(e.params, t),
        Xd.extend(e.originalParams, t),
        e.params.initialSlide || e.virtual.update();
    },
    setTranslate() {
      this.params.virtual.enabled && this.virtual.update();
    },
  },
};
const Ec = {
  handle(e) {
    const t = this,
      { rtlTranslate: i } = t;
    let s = e;
    s.originalEvent && (s = s.originalEvent);
    const n = s.keyCode || s.charCode;
    if (
      !t.allowSlideNext &&
      ((t.isHorizontal() && 39 === n) ||
        (t.isVertical() && 40 === n) ||
        34 === n)
    )
      return !1;
    if (
      !t.allowSlidePrev &&
      ((t.isHorizontal() && 37 === n) ||
        (t.isVertical() && 38 === n) ||
        33 === n)
    )
      return !1;
    if (
      !(
        s.shiftKey ||
        s.altKey ||
        s.ctrlKey ||
        s.metaKey ||
        (Rd.activeElement &&
          Rd.activeElement.nodeName &&
          ('input' === Rd.activeElement.nodeName.toLowerCase() ||
            'textarea' === Rd.activeElement.nodeName.toLowerCase()))
      )
    ) {
      if (
        t.params.keyboard.onlyInViewport &&
        (33 === n || 34 === n || 37 === n || 39 === n || 38 === n || 40 === n)
      ) {
        let e = !1;
        if (
          t.$el.parents(`.${t.params.slideClass}`).length > 0 &&
          0 === t.$el.parents(`.${t.params.slideActiveClass}`).length
        )
          return;
        const s = Vd.innerWidth,
          n = Vd.innerHeight,
          a = t.$el.offset();
        i && (a.left -= t.$el[0].scrollLeft);
        const r = [
          [a.left, a.top],
          [a.left + t.width, a.top],
          [a.left, a.top + t.height],
          [a.left + t.width, a.top + t.height],
        ];
        for (let t = 0; t < r.length; t += 1) {
          const i = r[t];
          i[0] >= 0 && i[0] <= s && i[1] >= 0 && i[1] <= n && (e = !0);
        }
        if (!e) return;
      }
      t.isHorizontal()
        ? ((33 !== n && 34 !== n && 37 !== n && 39 !== n) ||
            (s.preventDefault ? s.preventDefault() : (s.returnValue = !1)),
          (((34 !== n && 39 !== n) || i) && ((33 !== n && 37 !== n) || !i)) ||
            t.slideNext(),
          (((33 !== n && 37 !== n) || i) && ((34 !== n && 39 !== n) || !i)) ||
            t.slidePrev())
        : ((33 !== n && 34 !== n && 38 !== n && 40 !== n) ||
            (s.preventDefault ? s.preventDefault() : (s.returnValue = !1)),
          (34 !== n && 40 !== n) || t.slideNext(),
          (33 !== n && 38 !== n) || t.slidePrev()),
        t.emit('keyPress', n);
    }
  },
  enable() {
    this.keyboard.enabled ||
      (qd(Rd).on('keydown', this.keyboard.handle),
      (this.keyboard.enabled = !0));
  },
  disable() {
    this.keyboard.enabled &&
      (qd(Rd).off('keydown', this.keyboard.handle),
      (this.keyboard.enabled = !1));
  },
};
var Tc = {
  name: 'keyboard',
  params: { keyboard: { enabled: !1, onlyInViewport: !0 } },
  create() {
    Xd.extend(this, {
      keyboard: {
        enabled: !1,
        enable: Ec.enable.bind(this),
        disable: Ec.disable.bind(this),
        handle: Ec.handle.bind(this),
      },
    });
  },
  on: {
    init() {
      const e = this;
      e.params.keyboard.enabled && e.keyboard.enable();
    },
    destroy() {
      const e = this;
      e.keyboard.enabled && e.keyboard.disable();
    },
  },
};
const $c = {
  lastScrollTime: Xd.now(),
  lastEventBeforeSnap: void 0,
  recentWheelEvents: [],
  event: () =>
    Vd.navigator.userAgent.indexOf('firefox') > -1
      ? 'DOMMouseScroll'
      : (function () {
          let e = 'onwheel' in Rd;
          if (!e) {
            const t = Rd.createElement('div');
            t.setAttribute('onwheel', 'return;'),
              (e = 'function' == typeof t.onwheel);
          }
          return (
            !e &&
              Rd.implementation &&
              Rd.implementation.hasFeature &&
              !0 !== Rd.implementation.hasFeature('', '') &&
              (e = Rd.implementation.hasFeature('Events.wheel', '3.0')),
            e
          );
        })()
      ? 'wheel'
      : 'mousewheel',
  normalize(e) {
    let t = 0,
      i = 0,
      s = 0,
      n = 0;
    return (
      'detail' in e && (i = e.detail),
      'wheelDelta' in e && (i = -e.wheelDelta / 120),
      'wheelDeltaY' in e && (i = -e.wheelDeltaY / 120),
      'wheelDeltaX' in e && (t = -e.wheelDeltaX / 120),
      'axis' in e && e.axis === e.HORIZONTAL_AXIS && ((t = i), (i = 0)),
      (s = 10 * t),
      (n = 10 * i),
      'deltaY' in e && (n = e.deltaY),
      'deltaX' in e && (s = e.deltaX),
      e.shiftKey && !s && ((s = n), (n = 0)),
      (s || n) &&
        e.deltaMode &&
        (1 === e.deltaMode ? ((s *= 40), (n *= 40)) : ((s *= 800), (n *= 800))),
      s && !t && (t = s < 1 ? -1 : 1),
      n && !i && (i = n < 1 ? -1 : 1),
      { spinX: t, spinY: i, pixelX: s, pixelY: n }
    );
  },
  handleMouseEnter() {
    this.mouseEntered = !0;
  },
  handleMouseLeave() {
    this.mouseEntered = !1;
  },
  handle(e) {
    let t = e;
    const i = this,
      s = i.params.mousewheel;
    i.params.cssMode && t.preventDefault();
    let n = i.$el;
    if (
      ('container' !== i.params.mousewheel.eventsTarged &&
        (n = qd(i.params.mousewheel.eventsTarged)),
      !i.mouseEntered && !n[0].contains(t.target) && !s.releaseOnEdges)
    )
      return !0;
    t.originalEvent && (t = t.originalEvent);
    let a = 0;
    const r = i.rtlTranslate ? -1 : 1,
      o = $c.normalize(t);
    if (s.forceToAxis)
      if (i.isHorizontal()) {
        if (!(Math.abs(o.pixelX) > Math.abs(o.pixelY))) return !0;
        a = o.pixelX * r;
      } else {
        if (!(Math.abs(o.pixelY) > Math.abs(o.pixelX))) return !0;
        a = o.pixelY;
      }
    else
      a = Math.abs(o.pixelX) > Math.abs(o.pixelY) ? -o.pixelX * r : -o.pixelY;
    if (0 === a) return !0;
    if ((s.invert && (a = -a), i.params.freeMode)) {
      const e = { time: Xd.now(), delta: Math.abs(a), direction: Math.sign(a) },
        { lastEventBeforeSnap: n } = i.mousewheel,
        r =
          n &&
          e.time < n.time + 500 &&
          e.delta <= n.delta &&
          e.direction === n.direction;
      if (!r) {
        (i.mousewheel.lastEventBeforeSnap = void 0),
          i.params.loop && i.loopFix();
        let n = i.getTranslate() + a * s.sensitivity;
        const o = i.isBeginning,
          l = i.isEnd;
        if (
          (n >= i.minTranslate() && (n = i.minTranslate()),
          n <= i.maxTranslate() && (n = i.maxTranslate()),
          i.setTransition(0),
          i.setTranslate(n),
          i.updateProgress(),
          i.updateActiveIndex(),
          i.updateSlidesClasses(),
          ((!o && i.isBeginning) || (!l && i.isEnd)) && i.updateSlidesClasses(),
          i.params.freeModeSticky)
        ) {
          clearTimeout(i.mousewheel.timeout), (i.mousewheel.timeout = void 0);
          const t = i.mousewheel.recentWheelEvents;
          t.length >= 15 && t.shift();
          const s = t.length ? t[t.length - 1] : void 0,
            n = t[0];
          if (
            (t.push(e), s && (e.delta > s.delta || e.direction !== s.direction))
          )
            t.splice(0);
          else if (
            t.length >= 15 &&
            e.time - n.time < 500 &&
            n.delta - e.delta >= 1 &&
            e.delta <= 6
          ) {
            const s = a > 0 ? 0.8 : 0.2;
            (i.mousewheel.lastEventBeforeSnap = e),
              t.splice(0),
              (i.mousewheel.timeout = Xd.nextTick(() => {
                i.slideToClosest(i.params.speed, !0, void 0, s);
              }, 0));
          }
          i.mousewheel.timeout ||
            (i.mousewheel.timeout = Xd.nextTick(() => {
              (i.mousewheel.lastEventBeforeSnap = e),
                t.splice(0),
                i.slideToClosest(i.params.speed, !0, void 0, 0.5);
            }, 500));
        }
        if (
          (r || i.emit('scroll', t),
          i.params.autoplay &&
            i.params.autoplayDisableOnInteraction &&
            i.autoplay.stop(),
          n === i.minTranslate() || n === i.maxTranslate())
        )
          return !0;
      }
    } else {
      const t = {
          time: Xd.now(),
          delta: Math.abs(a),
          direction: Math.sign(a),
          raw: e,
        },
        s = i.mousewheel.recentWheelEvents;
      s.length >= 2 && s.shift();
      const n = s.length ? s[s.length - 1] : void 0;
      if (
        (s.push(t),
        n
          ? (t.direction !== n.direction || t.delta > n.delta) &&
            i.mousewheel.animateSlider(t)
          : i.mousewheel.animateSlider(t),
        i.mousewheel.releaseScroll(t))
      )
        return !0;
    }
    return t.preventDefault ? t.preventDefault() : (t.returnValue = !1), !1;
  },
  animateSlider(e) {
    const t = this;
    return (
      (e.delta >= 6 && Xd.now() - t.mousewheel.lastScrollTime < 60) ||
      (e.direction < 0
        ? (t.isEnd && !t.params.loop) ||
          t.animating ||
          (t.slideNext(), t.emit('scroll', e.raw))
        : (t.isBeginning && !t.params.loop) ||
          t.animating ||
          (t.slidePrev(), t.emit('scroll', e.raw)),
      (t.mousewheel.lastScrollTime = new Vd.Date().getTime()),
      !1)
    );
  },
  releaseScroll(e) {
    const t = this,
      i = t.params.mousewheel;
    if (e.direction < 0) {
      if (t.isEnd && !t.params.loop && i.releaseOnEdges) return !0;
    } else if (t.isBeginning && !t.params.loop && i.releaseOnEdges) return !0;
    return !1;
  },
  enable() {
    const e = this,
      t = $c.event();
    if (e.params.cssMode)
      return e.wrapperEl.removeEventListener(t, e.mousewheel.handle), !0;
    if (!t) return !1;
    if (e.mousewheel.enabled) return !1;
    let i = e.$el;
    return (
      'container' !== e.params.mousewheel.eventsTarged &&
        (i = qd(e.params.mousewheel.eventsTarged)),
      i.on('mouseenter', e.mousewheel.handleMouseEnter),
      i.on('mouseleave', e.mousewheel.handleMouseLeave),
      i.on(t, e.mousewheel.handle),
      (e.mousewheel.enabled = !0),
      !0
    );
  },
  disable() {
    const e = this,
      t = $c.event();
    if (e.params.cssMode)
      return e.wrapperEl.addEventListener(t, e.mousewheel.handle), !0;
    if (!t) return !1;
    if (!e.mousewheel.enabled) return !1;
    let i = e.$el;
    return (
      'container' !== e.params.mousewheel.eventsTarged &&
        (i = qd(e.params.mousewheel.eventsTarged)),
      i.off(t, e.mousewheel.handle),
      (e.mousewheel.enabled = !1),
      !0
    );
  },
};
const Cc = {
  update() {
    const e = this,
      t = e.params.navigation;
    if (e.params.loop) return;
    const { $nextEl: i, $prevEl: s } = e.navigation;
    s &&
      s.length > 0 &&
      (e.isBeginning
        ? s.addClass(t.disabledClass)
        : s.removeClass(t.disabledClass),
      s[e.params.watchOverflow && e.isLocked ? 'addClass' : 'removeClass'](
        t.lockClass
      )),
      i &&
        i.length > 0 &&
        (e.isEnd ? i.addClass(t.disabledClass) : i.removeClass(t.disabledClass),
        i[e.params.watchOverflow && e.isLocked ? 'addClass' : 'removeClass'](
          t.lockClass
        ));
  },
  onPrevClick(e) {
    e.preventDefault(),
      (this.isBeginning && !this.params.loop) || this.slidePrev();
  },
  onNextClick(e) {
    e.preventDefault(), (this.isEnd && !this.params.loop) || this.slideNext();
  },
  init() {
    const e = this,
      t = e.params.navigation;
    if (!t.nextEl && !t.prevEl) return;
    let i, s;
    t.nextEl &&
      ((i = qd(t.nextEl)),
      e.params.uniqueNavElements &&
        'string' == typeof t.nextEl &&
        i.length > 1 &&
        1 === e.$el.find(t.nextEl).length &&
        (i = e.$el.find(t.nextEl))),
      t.prevEl &&
        ((s = qd(t.prevEl)),
        e.params.uniqueNavElements &&
          'string' == typeof t.prevEl &&
          s.length > 1 &&
          1 === e.$el.find(t.prevEl).length &&
          (s = e.$el.find(t.prevEl))),
      i && i.length > 0 && i.on('click', e.navigation.onNextClick),
      s && s.length > 0 && s.on('click', e.navigation.onPrevClick),
      Xd.extend(e.navigation, {
        $nextEl: i,
        nextEl: i && i[0],
        $prevEl: s,
        prevEl: s && s[0],
      });
  },
  destroy() {
    const e = this,
      { $nextEl: t, $prevEl: i } = e.navigation;
    t &&
      t.length &&
      (t.off('click', e.navigation.onNextClick),
      t.removeClass(e.params.navigation.disabledClass)),
      i &&
        i.length &&
        (i.off('click', e.navigation.onPrevClick),
        i.removeClass(e.params.navigation.disabledClass));
  },
};
const kc = {
  update() {
    const e = this,
      t = e.rtl,
      i = e.params.pagination;
    if (
      !i.el ||
      !e.pagination.el ||
      !e.pagination.$el ||
      0 === e.pagination.$el.length
    )
      return;
    const s =
        e.virtual && e.params.virtual.enabled
          ? e.virtual.slides.length
          : e.slides.length,
      n = e.pagination.$el;
    let a;
    const r = e.params.loop
      ? Math.ceil((s - 2 * e.loopedSlides) / e.params.slidesPerGroup)
      : e.snapGrid.length;
    if (
      (e.params.loop
        ? ((a = Math.ceil(
            (e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup
          )),
          a > s - 1 - 2 * e.loopedSlides && (a -= s - 2 * e.loopedSlides),
          a > r - 1 && (a -= r),
          a < 0 && 'bullets' !== e.params.paginationType && (a = r + a))
        : (a = void 0 !== e.snapIndex ? e.snapIndex : e.activeIndex || 0),
      'bullets' === i.type &&
        e.pagination.bullets &&
        e.pagination.bullets.length > 0)
    ) {
      const s = e.pagination.bullets;
      let r, o, l;
      if (
        (i.dynamicBullets &&
          ((e.pagination.bulletSize = s
            .eq(0)
            [e.isHorizontal() ? 'outerWidth' : 'outerHeight'](!0)),
          n.css(
            e.isHorizontal() ? 'width' : 'height',
            `${e.pagination.bulletSize * (i.dynamicMainBullets + 4)}px`
          ),
          i.dynamicMainBullets > 1 &&
            void 0 !== e.previousIndex &&
            ((e.pagination.dynamicBulletIndex += a - e.previousIndex),
            e.pagination.dynamicBulletIndex > i.dynamicMainBullets - 1
              ? (e.pagination.dynamicBulletIndex = i.dynamicMainBullets - 1)
              : e.pagination.dynamicBulletIndex < 0 &&
                (e.pagination.dynamicBulletIndex = 0)),
          (r = a - e.pagination.dynamicBulletIndex),
          (o = r + (Math.min(s.length, i.dynamicMainBullets) - 1)),
          (l = (o + r) / 2)),
        s.removeClass(
          `${i.bulletActiveClass} ${i.bulletActiveClass}-next ${i.bulletActiveClass}-next-next ${i.bulletActiveClass}-prev ${i.bulletActiveClass}-prev-prev ${i.bulletActiveClass}-main`
        ),
        n.length > 1)
      )
        s.each((e, t) => {
          const s = qd(t),
            n = s.index();
          n === a && s.addClass(i.bulletActiveClass),
            i.dynamicBullets &&
              (n >= r && n <= o && s.addClass(`${i.bulletActiveClass}-main`),
              n === r &&
                s
                  .prev()
                  .addClass(`${i.bulletActiveClass}-prev`)
                  .prev()
                  .addClass(`${i.bulletActiveClass}-prev-prev`),
              n === o &&
                s
                  .next()
                  .addClass(`${i.bulletActiveClass}-next`)
                  .next()
                  .addClass(`${i.bulletActiveClass}-next-next`));
        });
      else {
        const t = s.eq(a),
          n = t.index();
        if ((t.addClass(i.bulletActiveClass), i.dynamicBullets)) {
          const t = s.eq(r),
            a = s.eq(o);
          for (let e = r; e <= o; e += 1)
            s.eq(e).addClass(`${i.bulletActiveClass}-main`);
          if (e.params.loop)
            if (n >= s.length - i.dynamicMainBullets) {
              for (let e = i.dynamicMainBullets; e >= 0; e -= 1)
                s.eq(s.length - e).addClass(`${i.bulletActiveClass}-main`);
              s.eq(s.length - i.dynamicMainBullets - 1).addClass(
                `${i.bulletActiveClass}-prev`
              );
            } else
              t
                .prev()
                .addClass(`${i.bulletActiveClass}-prev`)
                .prev()
                .addClass(`${i.bulletActiveClass}-prev-prev`),
                a
                  .next()
                  .addClass(`${i.bulletActiveClass}-next`)
                  .next()
                  .addClass(`${i.bulletActiveClass}-next-next`);
          else
            t
              .prev()
              .addClass(`${i.bulletActiveClass}-prev`)
              .prev()
              .addClass(`${i.bulletActiveClass}-prev-prev`),
              a
                .next()
                .addClass(`${i.bulletActiveClass}-next`)
                .next()
                .addClass(`${i.bulletActiveClass}-next-next`);
        }
      }
      if (i.dynamicBullets) {
        const n = Math.min(s.length, i.dynamicMainBullets + 4),
          a =
            (e.pagination.bulletSize * n - e.pagination.bulletSize) / 2 -
            l * e.pagination.bulletSize,
          r = t ? 'right' : 'left';
        s.css(e.isHorizontal() ? r : 'top', `${a}px`);
      }
    }
    if (
      ('fraction' === i.type &&
        (n.find(`.${i.currentClass}`).text(i.formatFractionCurrent(a + 1)),
        n.find(`.${i.totalClass}`).text(i.formatFractionTotal(r))),
      'progressbar' === i.type)
    ) {
      let t;
      t = i.progressbarOpposite
        ? e.isHorizontal()
          ? 'vertical'
          : 'horizontal'
        : e.isHorizontal()
        ? 'horizontal'
        : 'vertical';
      const s = (a + 1) / r;
      let o = 1,
        l = 1;
      'horizontal' === t ? (o = s) : (l = s),
        n
          .find(`.${i.progressbarFillClass}`)
          .transform(`translate3d(0,0,0) scaleX(${o}) scaleY(${l})`)
          .transition(e.params.speed);
    }
    'custom' === i.type && i.renderCustom
      ? (n.html(i.renderCustom(e, a + 1, r)),
        e.emit('paginationRender', e, n[0]))
      : e.emit('paginationUpdate', e, n[0]),
      n[e.params.watchOverflow && e.isLocked ? 'addClass' : 'removeClass'](
        i.lockClass
      );
  },
  render() {
    const e = this,
      t = e.params.pagination;
    if (
      !t.el ||
      !e.pagination.el ||
      !e.pagination.$el ||
      0 === e.pagination.$el.length
    )
      return;
    const i = e.pagination.$el;
    let s = '';
    if ('bullets' === t.type) {
      const n = e.params.loop
        ? Math.ceil(
            ((e.virtual && e.params.virtual.enabled
              ? e.virtual.slides.length
              : e.slides.length) -
              2 * e.loopedSlides) /
              e.params.slidesPerGroup
          )
        : e.snapGrid.length;
      for (let i = 0; i < n; i += 1)
        s += t.renderBullet
          ? t.renderBullet.call(e, i, t.bulletClass)
          : `<${t.bulletElement} class="${t.bulletClass}"></${t.bulletElement}>`;
      i.html(s), (e.pagination.bullets = i.find(`.${t.bulletClass}`));
    }
    'fraction' === t.type &&
      ((s = t.renderFraction
        ? t.renderFraction.call(e, t.currentClass, t.totalClass)
        : `<span class="${t.currentClass}"></span>` +
          ' / ' +
          `<span class="${t.totalClass}"></span>`),
      i.html(s)),
      'progressbar' === t.type &&
        ((s = t.renderProgressbar
          ? t.renderProgressbar.call(e, t.progressbarFillClass)
          : `<span class="${t.progressbarFillClass}"></span>`),
        i.html(s)),
      'custom' !== t.type && e.emit('paginationRender', e.pagination.$el[0]);
  },
  init() {
    const e = this,
      t = e.params.pagination;
    if (!t.el) return;
    let i = qd(t.el);
    0 !== i.length &&
      (e.params.uniqueNavElements &&
        'string' == typeof t.el &&
        i.length > 1 &&
        1 === e.$el.find(t.el).length &&
        (i = e.$el.find(t.el)),
      'bullets' === t.type && t.clickable && i.addClass(t.clickableClass),
      i.addClass(t.modifierClass + t.type),
      'bullets' === t.type &&
        t.dynamicBullets &&
        (i.addClass(`${t.modifierClass}${t.type}-dynamic`),
        (e.pagination.dynamicBulletIndex = 0),
        t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)),
      'progressbar' === t.type &&
        t.progressbarOpposite &&
        i.addClass(t.progressbarOppositeClass),
      t.clickable &&
        i.on('click', `.${t.bulletClass}`, function (t) {
          t.preventDefault();
          let i = qd(this).index() * e.params.slidesPerGroup;
          e.params.loop && (i += e.loopedSlides), e.slideTo(i);
        }),
      Xd.extend(e.pagination, { $el: i, el: i[0] }));
  },
  destroy() {
    const e = this.params.pagination;
    if (
      !e.el ||
      !this.pagination.el ||
      !this.pagination.$el ||
      0 === this.pagination.$el.length
    )
      return;
    const t = this.pagination.$el;
    t.removeClass(e.hiddenClass),
      t.removeClass(e.modifierClass + e.type),
      this.pagination.bullets &&
        this.pagination.bullets.removeClass(e.bulletActiveClass),
      e.clickable && t.off('click', `.${e.bulletClass}`);
  },
};
const Mc = {
  setTranslate() {
    const e = this;
    if (!e.params.scrollbar.el || !e.scrollbar.el) return;
    const { scrollbar: t, rtlTranslate: i, progress: s } = e,
      { dragSize: n, trackSize: a, $dragEl: r, $el: o } = t,
      l = e.params.scrollbar;
    let d = n,
      c = (a - n) * s;
    i
      ? ((c = -c), c > 0 ? ((d = n - c), (c = 0)) : -c + n > a && (d = a + c))
      : c < 0
      ? ((d = n + c), (c = 0))
      : c + n > a && (d = a - c),
      e.isHorizontal()
        ? (r.transform(`translate3d(${c}px, 0, 0)`),
          (r[0].style.width = `${d}px`))
        : (r.transform(`translate3d(0px, ${c}px, 0)`),
          (r[0].style.height = `${d}px`)),
      l.hide &&
        (clearTimeout(e.scrollbar.timeout),
        (o[0].style.opacity = 1),
        (e.scrollbar.timeout = setTimeout(() => {
          (o[0].style.opacity = 0), o.transition(400);
        }, 1e3)));
  },
  setTransition(e) {
    this.params.scrollbar.el &&
      this.scrollbar.el &&
      this.scrollbar.$dragEl.transition(e);
  },
  updateSize() {
    const e = this;
    if (!e.params.scrollbar.el || !e.scrollbar.el) return;
    const { scrollbar: t } = e,
      { $dragEl: i, $el: s } = t;
    (i[0].style.width = ''), (i[0].style.height = '');
    const n = e.isHorizontal() ? s[0].offsetWidth : s[0].offsetHeight,
      a = e.size / e.virtualSize,
      r = a * (n / e.size);
    let o;
    (o =
      'auto' === e.params.scrollbar.dragSize
        ? n * a
        : parseInt(e.params.scrollbar.dragSize, 10)),
      e.isHorizontal()
        ? (i[0].style.width = `${o}px`)
        : (i[0].style.height = `${o}px`),
      (s[0].style.display = a >= 1 ? 'none' : ''),
      e.params.scrollbar.hide && (s[0].style.opacity = 0),
      Xd.extend(t, { trackSize: n, divider: a, moveDivider: r, dragSize: o }),
      t.$el[e.params.watchOverflow && e.isLocked ? 'addClass' : 'removeClass'](
        e.params.scrollbar.lockClass
      );
  },
  getPointerPosition(e) {
    return this.isHorizontal()
      ? 'touchstart' === e.type || 'touchmove' === e.type
        ? e.targetTouches[0].clientX
        : e.clientX
      : 'touchstart' === e.type || 'touchmove' === e.type
      ? e.targetTouches[0].clientY
      : e.clientY;
  },
  setDragPosition(e) {
    const { scrollbar: t, rtlTranslate: i } = this,
      { $el: s, dragSize: n, trackSize: a, dragStartPos: r } = t;
    let o;
    (o =
      (t.getPointerPosition(e) -
        s.offset()[this.isHorizontal() ? 'left' : 'top'] -
        (null !== r ? r : n / 2)) /
      (a - n)),
      (o = Math.max(Math.min(o, 1), 0)),
      i && (o = 1 - o);
    const l =
      this.minTranslate() + (this.maxTranslate() - this.minTranslate()) * o;
    this.updateProgress(l),
      this.setTranslate(l),
      this.updateActiveIndex(),
      this.updateSlidesClasses();
  },
  onDragStart(e) {
    const t = this,
      i = t.params.scrollbar,
      { scrollbar: s, $wrapperEl: n } = t,
      { $el: a, $dragEl: r } = s;
    (t.scrollbar.isTouched = !0),
      (t.scrollbar.dragStartPos =
        e.target === r[0] || e.target === r
          ? s.getPointerPosition(e) -
            e.target.getBoundingClientRect()[t.isHorizontal() ? 'left' : 'top']
          : null),
      e.preventDefault(),
      e.stopPropagation(),
      n.transition(100),
      r.transition(100),
      s.setDragPosition(e),
      clearTimeout(t.scrollbar.dragTimeout),
      a.transition(0),
      i.hide && a.css('opacity', 1),
      t.params.cssMode && t.$wrapperEl.css('scroll-snap-type', 'none'),
      t.emit('scrollbarDragStart', e);
  },
  onDragMove(e) {
    const { scrollbar: t, $wrapperEl: i } = this,
      { $el: s, $dragEl: n } = t;
    this.scrollbar.isTouched &&
      (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
      t.setDragPosition(e),
      i.transition(0),
      s.transition(0),
      n.transition(0),
      this.emit('scrollbarDragMove', e));
  },
  onDragEnd(e) {
    const t = this,
      i = t.params.scrollbar,
      { scrollbar: s, $wrapperEl: n } = t,
      { $el: a } = s;
    t.scrollbar.isTouched &&
      ((t.scrollbar.isTouched = !1),
      t.params.cssMode &&
        (t.$wrapperEl.css('scroll-snap-type', ''), n.transition('')),
      i.hide &&
        (clearTimeout(t.scrollbar.dragTimeout),
        (t.scrollbar.dragTimeout = Xd.nextTick(() => {
          a.css('opacity', 0), a.transition(400);
        }, 1e3))),
      t.emit('scrollbarDragEnd', e),
      i.snapOnRelease && t.slideToClosest());
  },
  enableDraggable() {
    const e = this;
    if (!e.params.scrollbar.el) return;
    const {
        scrollbar: t,
        touchEventsTouch: i,
        touchEventsDesktop: s,
        params: n,
      } = e,
      a = t.$el[0],
      r = !(!Wd.passiveListener || !n.passiveListeners) && {
        passive: !1,
        capture: !1,
      },
      o = !(!Wd.passiveListener || !n.passiveListeners) && {
        passive: !0,
        capture: !1,
      };
    Wd.touch
      ? (a.addEventListener(i.start, e.scrollbar.onDragStart, r),
        a.addEventListener(i.move, e.scrollbar.onDragMove, r),
        a.addEventListener(i.end, e.scrollbar.onDragEnd, o))
      : (a.addEventListener(s.start, e.scrollbar.onDragStart, r),
        Rd.addEventListener(s.move, e.scrollbar.onDragMove, r),
        Rd.addEventListener(s.end, e.scrollbar.onDragEnd, o));
  },
  disableDraggable() {
    const e = this;
    if (!e.params.scrollbar.el) return;
    const {
        scrollbar: t,
        touchEventsTouch: i,
        touchEventsDesktop: s,
        params: n,
      } = e,
      a = t.$el[0],
      r = !(!Wd.passiveListener || !n.passiveListeners) && {
        passive: !1,
        capture: !1,
      },
      o = !(!Wd.passiveListener || !n.passiveListeners) && {
        passive: !0,
        capture: !1,
      };
    Wd.touch
      ? (a.removeEventListener(i.start, e.scrollbar.onDragStart, r),
        a.removeEventListener(i.move, e.scrollbar.onDragMove, r),
        a.removeEventListener(i.end, e.scrollbar.onDragEnd, o))
      : (a.removeEventListener(s.start, e.scrollbar.onDragStart, r),
        Rd.removeEventListener(s.move, e.scrollbar.onDragMove, r),
        Rd.removeEventListener(s.end, e.scrollbar.onDragEnd, o));
  },
  init() {
    const e = this;
    if (!e.params.scrollbar.el) return;
    const { scrollbar: t, $el: i } = e,
      s = e.params.scrollbar;
    let n = qd(s.el);
    e.params.uniqueNavElements &&
      'string' == typeof s.el &&
      n.length > 1 &&
      1 === i.find(s.el).length &&
      (n = i.find(s.el));
    let a = n.find(`.${e.params.scrollbar.dragClass}`);
    0 === a.length &&
      ((a = qd(`<div class="${e.params.scrollbar.dragClass}"></div>`)),
      n.append(a)),
      Xd.extend(t, { $el: n, el: n[0], $dragEl: a, dragEl: a[0] }),
      s.draggable && t.enableDraggable();
  },
  destroy() {
    this.scrollbar.disableDraggable();
  },
};
const Ic = {
  setTransform(e, t) {
    const { rtl: i } = this,
      s = qd(e),
      n = i ? -1 : 1,
      a = s.attr('data-swiper-parallax') || '0';
    let r = s.attr('data-swiper-parallax-x'),
      o = s.attr('data-swiper-parallax-y');
    const l = s.attr('data-swiper-parallax-scale'),
      d = s.attr('data-swiper-parallax-opacity');
    if (
      (r || o
        ? ((r = r || '0'), (o = o || '0'))
        : this.isHorizontal()
        ? ((r = a), (o = '0'))
        : ((o = a), (r = '0')),
      (r =
        r.indexOf('%') >= 0 ? `${parseInt(r, 10) * t * n}%` : `${r * t * n}px`),
      (o = o.indexOf('%') >= 0 ? `${parseInt(o, 10) * t}%` : `${o * t}px`),
      null != d)
    ) {
      const e = d - (d - 1) * (1 - Math.abs(t));
      s[0].style.opacity = e;
    }
    if (null == l) s.transform(`translate3d(${r}, ${o}, 0px)`);
    else {
      const e = l - (l - 1) * (1 - Math.abs(t));
      s.transform(`translate3d(${r}, ${o}, 0px) scale(${e})`);
    }
  },
  setTranslate() {
    const e = this,
      { $el: t, slides: i, progress: s, snapGrid: n } = e;
    t
      .children(
        '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]'
      )
      .each((t, i) => {
        e.parallax.setTransform(i, s);
      }),
      i.each((t, i) => {
        let a = i.progress;
        e.params.slidesPerGroup > 1 &&
          'auto' !== e.params.slidesPerView &&
          (a += Math.ceil(t / 2) - s * (n.length - 1)),
          (a = Math.min(Math.max(a, -1), 1)),
          qd(i)
            .find(
              '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]'
            )
            .each((t, i) => {
              e.parallax.setTransform(i, a);
            });
      });
  },
  setTransition(e = this.params.speed) {
    const { $el: t } = this;
    t.find(
      '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]'
    ).each((t, i) => {
      const s = qd(i);
      let n = parseInt(s.attr('data-swiper-parallax-duration'), 10) || e;
      0 === e && (n = 0), s.transition(n);
    });
  },
};
const Pc = {
  getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2) return 1;
    return Math.sqrt(
      (e.targetTouches[1].pageX - e.targetTouches[0].pageX) ** 2 +
        (e.targetTouches[1].pageY - e.targetTouches[0].pageY) ** 2
    );
  },
  onGestureStart(e) {
    const t = this,
      i = t.params.zoom,
      s = t.zoom,
      { gesture: n } = s;
    if (
      ((s.fakeGestureTouched = !1), (s.fakeGestureMoved = !1), !Wd.gestures)
    ) {
      if (
        'touchstart' !== e.type ||
        ('touchstart' === e.type && e.targetTouches.length < 2)
      )
        return;
      (s.fakeGestureTouched = !0),
        (n.scaleStart = Pc.getDistanceBetweenTouches(e));
    }
    (n.$slideEl && n.$slideEl.length) ||
    ((n.$slideEl = qd(e.target).closest(`.${t.params.slideClass}`)),
    0 === n.$slideEl.length && (n.$slideEl = t.slides.eq(t.activeIndex)),
    (n.$imageEl = n.$slideEl.find(
      'img, svg, canvas, picture, .swiper-zoom-target'
    )),
    (n.$imageWrapEl = n.$imageEl.parent(`.${i.containerClass}`)),
    (n.maxRatio = n.$imageWrapEl.attr('data-swiper-zoom') || i.maxRatio),
    0 !== n.$imageWrapEl.length)
      ? (n.$imageEl.transition(0), (t.zoom.isScaling = !0))
      : (n.$imageEl = void 0);
  },
  onGestureChange(e) {
    const t = this.params.zoom,
      i = this.zoom,
      { gesture: s } = i;
    if (!Wd.gestures) {
      if (
        'touchmove' !== e.type ||
        ('touchmove' === e.type && e.targetTouches.length < 2)
      )
        return;
      (i.fakeGestureMoved = !0),
        (s.scaleMove = Pc.getDistanceBetweenTouches(e));
    }
    s.$imageEl &&
      0 !== s.$imageEl.length &&
      ((i.scale = Wd.gestures
        ? e.scale * i.currentScale
        : (s.scaleMove / s.scaleStart) * i.currentScale),
      i.scale > s.maxRatio &&
        (i.scale = s.maxRatio - 1 + (i.scale - s.maxRatio + 1) ** 0.5),
      i.scale < t.minRatio &&
        (i.scale = t.minRatio + 1 - (t.minRatio - i.scale + 1) ** 0.5),
      s.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`));
  },
  onGestureEnd(e) {
    const t = this.params.zoom,
      i = this.zoom,
      { gesture: s } = i;
    if (!Wd.gestures) {
      if (!i.fakeGestureTouched || !i.fakeGestureMoved) return;
      if (
        'touchend' !== e.type ||
        ('touchend' === e.type && e.changedTouches.length < 2 && !tc.android)
      )
        return;
      (i.fakeGestureTouched = !1), (i.fakeGestureMoved = !1);
    }
    s.$imageEl &&
      0 !== s.$imageEl.length &&
      ((i.scale = Math.max(Math.min(i.scale, s.maxRatio), t.minRatio)),
      s.$imageEl
        .transition(this.params.speed)
        .transform(`translate3d(0,0,0) scale(${i.scale})`),
      (i.currentScale = i.scale),
      (i.isScaling = !1),
      1 === i.scale && (s.$slideEl = void 0));
  },
  onTouchStart(e) {
    const t = this.zoom,
      { gesture: i, image: s } = t;
    i.$imageEl &&
      0 !== i.$imageEl.length &&
      (s.isTouched ||
        (tc.android && e.preventDefault(),
        (s.isTouched = !0),
        (s.touchesStart.x =
          'touchstart' === e.type ? e.targetTouches[0].pageX : e.pageX),
        (s.touchesStart.y =
          'touchstart' === e.type ? e.targetTouches[0].pageY : e.pageY)));
  },
  onTouchMove(e) {
    const t = this,
      i = t.zoom,
      { gesture: s, image: n, velocity: a } = i;
    if (!s.$imageEl || 0 === s.$imageEl.length) return;
    if (((t.allowClick = !1), !n.isTouched || !s.$slideEl)) return;
    n.isMoved ||
      ((n.width = s.$imageEl[0].offsetWidth),
      (n.height = s.$imageEl[0].offsetHeight),
      (n.startX = Xd.getTranslate(s.$imageWrapEl[0], 'x') || 0),
      (n.startY = Xd.getTranslate(s.$imageWrapEl[0], 'y') || 0),
      (s.slideWidth = s.$slideEl[0].offsetWidth),
      (s.slideHeight = s.$slideEl[0].offsetHeight),
      s.$imageWrapEl.transition(0),
      t.rtl && ((n.startX = -n.startX), (n.startY = -n.startY)));
    const r = n.width * i.scale,
      o = n.height * i.scale;
    if (!(r < s.slideWidth && o < s.slideHeight)) {
      if (
        ((n.minX = Math.min(s.slideWidth / 2 - r / 2, 0)),
        (n.maxX = -n.minX),
        (n.minY = Math.min(s.slideHeight / 2 - o / 2, 0)),
        (n.maxY = -n.minY),
        (n.touchesCurrent.x =
          'touchmove' === e.type ? e.targetTouches[0].pageX : e.pageX),
        (n.touchesCurrent.y =
          'touchmove' === e.type ? e.targetTouches[0].pageY : e.pageY),
        !n.isMoved && !i.isScaling)
      ) {
        if (
          t.isHorizontal() &&
          ((Math.floor(n.minX) === Math.floor(n.startX) &&
            n.touchesCurrent.x < n.touchesStart.x) ||
            (Math.floor(n.maxX) === Math.floor(n.startX) &&
              n.touchesCurrent.x > n.touchesStart.x))
        )
          return void (n.isTouched = !1);
        if (
          !t.isHorizontal() &&
          ((Math.floor(n.minY) === Math.floor(n.startY) &&
            n.touchesCurrent.y < n.touchesStart.y) ||
            (Math.floor(n.maxY) === Math.floor(n.startY) &&
              n.touchesCurrent.y > n.touchesStart.y))
        )
          return void (n.isTouched = !1);
      }
      e.preventDefault(),
        e.stopPropagation(),
        (n.isMoved = !0),
        (n.currentX = n.touchesCurrent.x - n.touchesStart.x + n.startX),
        (n.currentY = n.touchesCurrent.y - n.touchesStart.y + n.startY),
        n.currentX < n.minX &&
          (n.currentX = n.minX + 1 - (n.minX - n.currentX + 1) ** 0.8),
        n.currentX > n.maxX &&
          (n.currentX = n.maxX - 1 + (n.currentX - n.maxX + 1) ** 0.8),
        n.currentY < n.minY &&
          (n.currentY = n.minY + 1 - (n.minY - n.currentY + 1) ** 0.8),
        n.currentY > n.maxY &&
          (n.currentY = n.maxY - 1 + (n.currentY - n.maxY + 1) ** 0.8),
        a.prevPositionX || (a.prevPositionX = n.touchesCurrent.x),
        a.prevPositionY || (a.prevPositionY = n.touchesCurrent.y),
        a.prevTime || (a.prevTime = Date.now()),
        (a.x =
          (n.touchesCurrent.x - a.prevPositionX) /
          (Date.now() - a.prevTime) /
          2),
        (a.y =
          (n.touchesCurrent.y - a.prevPositionY) /
          (Date.now() - a.prevTime) /
          2),
        Math.abs(n.touchesCurrent.x - a.prevPositionX) < 2 && (a.x = 0),
        Math.abs(n.touchesCurrent.y - a.prevPositionY) < 2 && (a.y = 0),
        (a.prevPositionX = n.touchesCurrent.x),
        (a.prevPositionY = n.touchesCurrent.y),
        (a.prevTime = Date.now()),
        s.$imageWrapEl.transform(
          `translate3d(${n.currentX}px, ${n.currentY}px,0)`
        );
    }
  },
  onTouchEnd() {
    const e = this.zoom,
      { gesture: t, image: i, velocity: s } = e;
    if (!t.$imageEl || 0 === t.$imageEl.length) return;
    if (!i.isTouched || !i.isMoved)
      return (i.isTouched = !1), void (i.isMoved = !1);
    (i.isTouched = !1), (i.isMoved = !1);
    let n = 300,
      a = 300;
    const r = i.currentX + s.x * n,
      o = i.currentY + s.y * a;
    0 !== s.x && (n = Math.abs((r - i.currentX) / s.x)),
      0 !== s.y && (a = Math.abs((o - i.currentY) / s.y));
    const l = Math.max(n, a);
    (i.currentX = r), (i.currentY = o);
    const d = i.height * e.scale;
    (i.minX = Math.min(t.slideWidth / 2 - (i.width * e.scale) / 2, 0)),
      (i.maxX = -i.minX),
      (i.minY = Math.min(t.slideHeight / 2 - d / 2, 0)),
      (i.maxY = -i.minY),
      (i.currentX = Math.max(Math.min(i.currentX, i.maxX), i.minX)),
      (i.currentY = Math.max(Math.min(i.currentY, i.maxY), i.minY)),
      t.$imageWrapEl
        .transition(l)
        .transform(`translate3d(${i.currentX}px, ${i.currentY}px,0)`);
  },
  onTransitionEnd() {
    const e = this.zoom,
      { gesture: t } = e;
    t.$slideEl &&
      this.previousIndex !== this.activeIndex &&
      (t.$imageEl.transform('translate3d(0,0,0) scale(1)'),
      t.$imageWrapEl.transform('translate3d(0,0,0)'),
      (e.scale = 1),
      (e.currentScale = 1),
      (t.$slideEl = void 0),
      (t.$imageEl = void 0),
      (t.$imageWrapEl = void 0));
  },
  toggle(e) {
    const t = this.zoom;
    t.scale && 1 !== t.scale ? t.out() : t.in(e);
  },
  in(e) {
    const t = this,
      i = t.zoom,
      s = t.params.zoom,
      { gesture: n, image: a } = i;
    if (
      (n.$slideEl ||
        ((n.$slideEl = t.slides.eq(t.activeIndex)),
        (n.$imageEl = n.$slideEl.find(
          'img, svg, canvas, picture, .swiper-zoom-target'
        )),
        (n.$imageWrapEl = n.$imageEl.parent(`.${s.containerClass}`))),
      !n.$imageEl || 0 === n.$imageEl.length)
    )
      return;
    let r, o, l, d, c, h, p, u, m, f, g, v, b, y, w, x, S, E;
    n.$slideEl.addClass(`${s.zoomedSlideClass}`),
      void 0 === a.touchesStart.x && e
        ? ((r = 'touchend' === e.type ? e.changedTouches[0].pageX : e.pageX),
          (o = 'touchend' === e.type ? e.changedTouches[0].pageY : e.pageY))
        : ((r = a.touchesStart.x), (o = a.touchesStart.y)),
      (i.scale = n.$imageWrapEl.attr('data-swiper-zoom') || s.maxRatio),
      (i.currentScale = n.$imageWrapEl.attr('data-swiper-zoom') || s.maxRatio),
      e
        ? ((S = n.$slideEl[0].offsetWidth),
          (E = n.$slideEl[0].offsetHeight),
          (l = n.$slideEl.offset().left),
          (d = n.$slideEl.offset().top),
          (c = l + S / 2 - r),
          (h = d + E / 2 - o),
          (m = n.$imageEl[0].offsetWidth),
          (f = n.$imageEl[0].offsetHeight),
          (g = m * i.scale),
          (v = f * i.scale),
          (b = Math.min(S / 2 - g / 2, 0)),
          (y = Math.min(E / 2 - v / 2, 0)),
          (w = -b),
          (x = -y),
          (p = c * i.scale),
          (u = h * i.scale),
          p < b && (p = b),
          p > w && (p = w),
          u < y && (u = y),
          u > x && (u = x))
        : ((p = 0), (u = 0)),
      n.$imageWrapEl.transition(300).transform(`translate3d(${p}px, ${u}px,0)`),
      n.$imageEl
        .transition(300)
        .transform(`translate3d(0,0,0) scale(${i.scale})`);
  },
  out() {
    const e = this,
      t = e.zoom,
      i = e.params.zoom,
      { gesture: s } = t;
    s.$slideEl ||
      ((s.$slideEl = e.slides.eq(e.activeIndex)),
      (s.$imageEl = s.$slideEl.find(
        'img, svg, canvas, picture, .swiper-zoom-target'
      )),
      (s.$imageWrapEl = s.$imageEl.parent(`.${i.containerClass}`))),
      s.$imageEl &&
        0 !== s.$imageEl.length &&
        ((t.scale = 1),
        (t.currentScale = 1),
        s.$imageWrapEl.transition(300).transform('translate3d(0,0,0)'),
        s.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)'),
        s.$slideEl.removeClass(`${i.zoomedSlideClass}`),
        (s.$slideEl = void 0));
  },
  enable() {
    const e = this,
      t = e.zoom;
    if (t.enabled) return;
    t.enabled = !0;
    const i = !(
        'touchstart' !== e.touchEvents.start ||
        !Wd.passiveListener ||
        !e.params.passiveListeners
      ) && { passive: !0, capture: !1 },
      s = !Wd.passiveListener || { passive: !1, capture: !0 },
      n = `.${e.params.slideClass}`;
    Wd.gestures
      ? (e.$wrapperEl.on('gesturestart', n, t.onGestureStart, i),
        e.$wrapperEl.on('gesturechange', n, t.onGestureChange, i),
        e.$wrapperEl.on('gestureend', n, t.onGestureEnd, i))
      : 'touchstart' === e.touchEvents.start &&
        (e.$wrapperEl.on(e.touchEvents.start, n, t.onGestureStart, i),
        e.$wrapperEl.on(e.touchEvents.move, n, t.onGestureChange, s),
        e.$wrapperEl.on(e.touchEvents.end, n, t.onGestureEnd, i),
        e.touchEvents.cancel &&
          e.$wrapperEl.on(e.touchEvents.cancel, n, t.onGestureEnd, i)),
      e.$wrapperEl.on(
        e.touchEvents.move,
        `.${e.params.zoom.containerClass}`,
        t.onTouchMove,
        s
      );
  },
  disable() {
    const e = this,
      t = e.zoom;
    if (!t.enabled) return;
    e.zoom.enabled = !1;
    const i = !(
        'touchstart' !== e.touchEvents.start ||
        !Wd.passiveListener ||
        !e.params.passiveListeners
      ) && { passive: !0, capture: !1 },
      s = !Wd.passiveListener || { passive: !1, capture: !0 },
      n = `.${e.params.slideClass}`;
    Wd.gestures
      ? (e.$wrapperEl.off('gesturestart', n, t.onGestureStart, i),
        e.$wrapperEl.off('gesturechange', n, t.onGestureChange, i),
        e.$wrapperEl.off('gestureend', n, t.onGestureEnd, i))
      : 'touchstart' === e.touchEvents.start &&
        (e.$wrapperEl.off(e.touchEvents.start, n, t.onGestureStart, i),
        e.$wrapperEl.off(e.touchEvents.move, n, t.onGestureChange, s),
        e.$wrapperEl.off(e.touchEvents.end, n, t.onGestureEnd, i),
        e.touchEvents.cancel &&
          e.$wrapperEl.off(e.touchEvents.cancel, n, t.onGestureEnd, i)),
      e.$wrapperEl.off(
        e.touchEvents.move,
        `.${e.params.zoom.containerClass}`,
        t.onTouchMove,
        s
      );
  },
};
const Ac = {
  loadInSlide(e, t = !0) {
    const i = this,
      s = i.params.lazy;
    if (void 0 === e) return;
    if (0 === i.slides.length) return;
    const n =
      i.virtual && i.params.virtual.enabled
        ? i.$wrapperEl.children(
            `.${i.params.slideClass}[data-swiper-slide-index="${e}"]`
          )
        : i.slides.eq(e);
    let a = n.find(
      `.${s.elementClass}:not(.${s.loadedClass}):not(.${s.loadingClass})`
    );
    !n.hasClass(s.elementClass) ||
      n.hasClass(s.loadedClass) ||
      n.hasClass(s.loadingClass) ||
      (a = a.add(n[0])),
      0 !== a.length &&
        a.each((e, a) => {
          const r = qd(a);
          r.addClass(s.loadingClass);
          const o = r.attr('data-background'),
            l = r.attr('data-src'),
            d = r.attr('data-srcset'),
            c = r.attr('data-sizes');
          i.loadImage(r[0], l || o, d, c, !1, () => {
            if (null != i && i && (!i || i.params) && !i.destroyed) {
              if (
                (o
                  ? (r.css('background-image', `url("${o}")`),
                    r.removeAttr('data-background'))
                  : (d && (r.attr('srcset', d), r.removeAttr('data-srcset')),
                    c && (r.attr('sizes', c), r.removeAttr('data-sizes')),
                    l && (r.attr('src', l), r.removeAttr('data-src'))),
                r.addClass(s.loadedClass).removeClass(s.loadingClass),
                n.find(`.${s.preloaderClass}`).remove(),
                i.params.loop && t)
              ) {
                const e = n.attr('data-swiper-slide-index');
                if (n.hasClass(i.params.slideDuplicateClass)) {
                  const t = i.$wrapperEl.children(
                    `[data-swiper-slide-index="${e}"]:not(.${i.params.slideDuplicateClass})`
                  );
                  i.lazy.loadInSlide(t.index(), !1);
                } else {
                  const t = i.$wrapperEl.children(
                    `.${i.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`
                  );
                  i.lazy.loadInSlide(t.index(), !1);
                }
              }
              i.emit('lazyImageReady', n[0], r[0]),
                i.params.autoHeight && i.updateAutoHeight();
            }
          }),
            i.emit('lazyImageLoad', n[0], r[0]);
        });
  },
  load() {
    const e = this,
      { $wrapperEl: t, params: i, slides: s, activeIndex: n } = e,
      a = e.virtual && i.virtual.enabled,
      r = i.lazy;
    let o = i.slidesPerView;
    function l(e) {
      if (a) {
        if (
          t.children(`.${i.slideClass}[data-swiper-slide-index="${e}"]`).length
        )
          return !0;
      } else if (s[e]) return !0;
      return !1;
    }
    function d(e) {
      return a ? qd(e).attr('data-swiper-slide-index') : qd(e).index();
    }
    if (
      ('auto' === o && (o = 0),
      e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0),
      e.params.watchSlidesVisibility)
    )
      t.children(`.${i.slideVisibleClass}`).each((t, i) => {
        const s = a ? qd(i).attr('data-swiper-slide-index') : qd(i).index();
        e.lazy.loadInSlide(s);
      });
    else if (o > 1)
      for (let t = n; t < n + o; t += 1) l(t) && e.lazy.loadInSlide(t);
    else e.lazy.loadInSlide(n);
    if (r.loadPrevNext)
      if (o > 1 || (r.loadPrevNextAmount && r.loadPrevNextAmount > 1)) {
        const t = r.loadPrevNextAmount,
          i = o,
          a = Math.min(n + i + Math.max(t, i), s.length),
          d = Math.max(n - Math.max(i, t), 0);
        for (let t = n + o; t < a; t += 1) l(t) && e.lazy.loadInSlide(t);
        for (let t = d; t < n; t += 1) l(t) && e.lazy.loadInSlide(t);
      } else {
        const s = t.children(`.${i.slideNextClass}`);
        s.length > 0 && e.lazy.loadInSlide(d(s));
        const n = t.children(`.${i.slidePrevClass}`);
        n.length > 0 && e.lazy.loadInSlide(d(n));
      }
  },
};
const Oc = {
  LinearSpline: function (e, t) {
    const i = (function () {
      let e, t, i;
      return (s, n) => {
        for (t = -1, e = s.length; e - t > 1; )
          (i = (e + t) >> 1), s[i] <= n ? (t = i) : (e = i);
        return e;
      };
    })();
    let s, n;
    return (
      (this.x = e),
      (this.y = t),
      (this.lastIndex = e.length - 1),
      (this.interpolate = function (e) {
        return e
          ? ((n = i(this.x, e)),
            (s = n - 1),
            ((e - this.x[s]) * (this.y[n] - this.y[s])) /
              (this.x[n] - this.x[s]) +
              this.y[s])
          : 0;
      }),
      this
    );
  },
  getInterpolateFunction(e) {
    const t = this;
    t.controller.spline ||
      (t.controller.spline = t.params.loop
        ? new Oc.LinearSpline(t.slidesGrid, e.slidesGrid)
        : new Oc.LinearSpline(t.snapGrid, e.snapGrid));
  },
  setTranslate(e, t) {
    const i = this,
      s = i.controller.control;
    let n, a;
    function r(e) {
      const t = i.rtlTranslate ? -i.translate : i.translate;
      'slide' === i.params.controller.by &&
        (i.controller.getInterpolateFunction(e),
        (a = -i.controller.spline.interpolate(-t))),
        (a && 'container' !== i.params.controller.by) ||
          ((n =
            (e.maxTranslate() - e.minTranslate()) /
            (i.maxTranslate() - i.minTranslate())),
          (a = (t - i.minTranslate()) * n + e.minTranslate())),
        i.params.controller.inverse && (a = e.maxTranslate() - a),
        e.updateProgress(a),
        e.setTranslate(a, i),
        e.updateActiveIndex(),
        e.updateSlidesClasses();
    }
    if (Array.isArray(s))
      for (let e = 0; e < s.length; e += 1)
        s[e] !== t && s[e] instanceof uc && r(s[e]);
    else s instanceof uc && t !== s && r(s);
  },
  setTransition(e, t) {
    const i = this,
      s = i.controller.control;
    let n;
    function a(t) {
      t.setTransition(e, i),
        0 !== e &&
          (t.transitionStart(),
          t.params.autoHeight &&
            Xd.nextTick(() => {
              t.updateAutoHeight();
            }),
          t.$wrapperEl.transitionEnd(() => {
            s &&
              (t.params.loop &&
                'slide' === i.params.controller.by &&
                t.loopFix(),
              t.transitionEnd());
          }));
    }
    if (Array.isArray(s))
      for (n = 0; n < s.length; n += 1)
        s[n] !== t && s[n] instanceof uc && a(s[n]);
    else s instanceof uc && t !== s && a(s);
  },
};
const Bc = {
  makeElFocusable: (e) => (e.attr('tabIndex', '0'), e),
  addElRole: (e, t) => (e.attr('role', t), e),
  addElLabel: (e, t) => (e.attr('aria-label', t), e),
  disableEl: (e) => (e.attr('aria-disabled', !0), e),
  enableEl: (e) => (e.attr('aria-disabled', !1), e),
  onEnterKey(e) {
    const t = this,
      i = t.params.a11y;
    if (13 !== e.keyCode) return;
    const s = qd(e.target);
    t.navigation &&
      t.navigation.$nextEl &&
      s.is(t.navigation.$nextEl) &&
      ((t.isEnd && !t.params.loop) || t.slideNext(),
      t.a11y.notify(t.isEnd ? i.lastSlideMessage : i.nextSlideMessage)),
      t.navigation &&
        t.navigation.$prevEl &&
        s.is(t.navigation.$prevEl) &&
        ((t.isBeginning && !t.params.loop) || t.slidePrev(),
        t.a11y.notify(
          t.isBeginning ? i.firstSlideMessage : i.prevSlideMessage
        )),
      t.pagination &&
        s.is(`.${t.params.pagination.bulletClass}`) &&
        s[0].click();
  },
  notify(e) {
    const t = this.a11y.liveRegion;
    0 !== t.length && (t.html(''), t.html(e));
  },
  updateNavigation() {
    const e = this;
    if (e.params.loop || !e.navigation) return;
    const { $nextEl: t, $prevEl: i } = e.navigation;
    i &&
      i.length > 0 &&
      (e.isBeginning ? e.a11y.disableEl(i) : e.a11y.enableEl(i)),
      t && t.length > 0 && (e.isEnd ? e.a11y.disableEl(t) : e.a11y.enableEl(t));
  },
  updatePagination() {
    const e = this,
      t = e.params.a11y;
    e.pagination &&
      e.params.pagination.clickable &&
      e.pagination.bullets &&
      e.pagination.bullets.length &&
      e.pagination.bullets.each((i, s) => {
        const n = qd(s);
        e.a11y.makeElFocusable(n),
          e.a11y.addElRole(n, 'button'),
          e.a11y.addElLabel(
            n,
            t.paginationBulletMessage.replace(/{{index}}/, n.index() + 1)
          );
      });
  },
  init() {
    const e = this;
    e.$el.append(e.a11y.liveRegion);
    const t = e.params.a11y;
    let i, s;
    e.navigation && e.navigation.$nextEl && (i = e.navigation.$nextEl),
      e.navigation && e.navigation.$prevEl && (s = e.navigation.$prevEl),
      i &&
        (e.a11y.makeElFocusable(i),
        e.a11y.addElRole(i, 'button'),
        e.a11y.addElLabel(i, t.nextSlideMessage),
        i.on('keydown', e.a11y.onEnterKey)),
      s &&
        (e.a11y.makeElFocusable(s),
        e.a11y.addElRole(s, 'button'),
        e.a11y.addElLabel(s, t.prevSlideMessage),
        s.on('keydown', e.a11y.onEnterKey)),
      e.pagination &&
        e.params.pagination.clickable &&
        e.pagination.bullets &&
        e.pagination.bullets.length &&
        e.pagination.$el.on(
          'keydown',
          `.${e.params.pagination.bulletClass}`,
          e.a11y.onEnterKey
        );
  },
  destroy() {
    const e = this;
    let t, i;
    e.a11y.liveRegion &&
      e.a11y.liveRegion.length > 0 &&
      e.a11y.liveRegion.remove(),
      e.navigation && e.navigation.$nextEl && (t = e.navigation.$nextEl),
      e.navigation && e.navigation.$prevEl && (i = e.navigation.$prevEl),
      t && t.off('keydown', e.a11y.onEnterKey),
      i && i.off('keydown', e.a11y.onEnterKey),
      e.pagination &&
        e.params.pagination.clickable &&
        e.pagination.bullets &&
        e.pagination.bullets.length &&
        e.pagination.$el.off(
          'keydown',
          `.${e.params.pagination.bulletClass}`,
          e.a11y.onEnterKey
        );
  },
};
const Lc = {
  init() {
    const e = this;
    if (!e.params.history) return;
    if (!Vd.history || !Vd.history.pushState)
      return (
        (e.params.history.enabled = !1),
        void (e.params.hashNavigation.enabled = !0)
      );
    const t = e.history;
    (t.initialized = !0),
      (t.paths = Lc.getPathValues()),
      (t.paths.key || t.paths.value) &&
        (t.scrollToSlide(0, t.paths.value, e.params.runCallbacksOnInit),
        e.params.history.replaceState ||
          Vd.addEventListener('popstate', e.history.setHistoryPopState));
  },
  destroy() {
    const e = this;
    e.params.history.replaceState ||
      Vd.removeEventListener('popstate', e.history.setHistoryPopState);
  },
  setHistoryPopState() {
    (this.history.paths = Lc.getPathValues()),
      this.history.scrollToSlide(
        this.params.speed,
        this.history.paths.value,
        !1
      );
  },
  getPathValues() {
    const e = Vd.location.pathname
        .slice(1)
        .split('/')
        .filter((e) => '' !== e),
      t = e.length;
    return { key: e[t - 2], value: e[t - 1] };
  },
  setHistory(e, t) {
    if (!this.history.initialized || !this.params.history.enabled) return;
    const i = this.slides.eq(t);
    let s = Lc.slugify(i.attr('data-history'));
    Vd.location.pathname.includes(e) || (s = `${e}/${s}`);
    const n = Vd.history.state;
    (n && n.value === s) ||
      (this.params.history.replaceState
        ? Vd.history.replaceState({ value: s }, null, s)
        : Vd.history.pushState({ value: s }, null, s));
  },
  slugify: (e) =>
    e
      .toString()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, ''),
  scrollToSlide(e, t, i) {
    const s = this;
    if (t)
      for (let n = 0, a = s.slides.length; n < a; n += 1) {
        const a = s.slides.eq(n);
        if (
          Lc.slugify(a.attr('data-history')) === t &&
          !a.hasClass(s.params.slideDuplicateClass)
        ) {
          const t = a.index();
          s.slideTo(t, e, i);
        }
      }
    else s.slideTo(0, e, i);
  },
};
const zc = {
  onHashCange() {
    const e = this,
      t = Rd.location.hash.replace('#', '');
    if (t !== e.slides.eq(e.activeIndex).attr('data-hash')) {
      const i = e.$wrapperEl
        .children(`.${e.params.slideClass}[data-hash="${t}"]`)
        .index();
      if (void 0 === i) return;
      e.slideTo(i);
    }
  },
  setHash() {
    const e = this;
    if (e.hashNavigation.initialized && e.params.hashNavigation.enabled)
      if (
        e.params.hashNavigation.replaceState &&
        Vd.history &&
        Vd.history.replaceState
      )
        Vd.history.replaceState(
          null,
          null,
          `#${e.slides.eq(e.activeIndex).attr('data-hash')}` || ''
        );
      else {
        const t = e.slides.eq(e.activeIndex),
          i = t.attr('data-hash') || t.attr('data-history');
        Rd.location.hash = i || '';
      }
  },
  init() {
    const e = this;
    if (
      !e.params.hashNavigation.enabled ||
      (e.params.history && e.params.history.enabled)
    )
      return;
    e.hashNavigation.initialized = !0;
    const t = Rd.location.hash.replace('#', '');
    if (t) {
      const i = 0;
      for (let s = 0, n = e.slides.length; s < n; s += 1) {
        const n = e.slides.eq(s);
        if (
          (n.attr('data-hash') || n.attr('data-history')) === t &&
          !n.hasClass(e.params.slideDuplicateClass)
        ) {
          const t = n.index();
          e.slideTo(t, i, e.params.runCallbacksOnInit, !0);
        }
      }
    }
    e.params.hashNavigation.watchState &&
      qd(Vd).on('hashchange', e.hashNavigation.onHashCange);
  },
  destroy() {
    const e = this;
    e.params.hashNavigation.watchState &&
      qd(Vd).off('hashchange', e.hashNavigation.onHashCange);
  },
};
const Dc = {
  run() {
    const e = this,
      t = e.slides.eq(e.activeIndex);
    let i = e.params.autoplay.delay;
    t.attr('data-swiper-autoplay') &&
      (i = t.attr('data-swiper-autoplay') || e.params.autoplay.delay),
      clearTimeout(e.autoplay.timeout),
      (e.autoplay.timeout = Xd.nextTick(() => {
        e.params.autoplay.reverseDirection
          ? e.params.loop
            ? (e.loopFix(),
              e.slidePrev(e.params.speed, !0, !0),
              e.emit('autoplay'))
            : e.isBeginning
            ? e.params.autoplay.stopOnLastSlide
              ? e.autoplay.stop()
              : (e.slideTo(e.slides.length - 1, e.params.speed, !0, !0),
                e.emit('autoplay'))
            : (e.slidePrev(e.params.speed, !0, !0), e.emit('autoplay'))
          : e.params.loop
          ? (e.loopFix(),
            e.slideNext(e.params.speed, !0, !0),
            e.emit('autoplay'))
          : e.isEnd
          ? e.params.autoplay.stopOnLastSlide
            ? e.autoplay.stop()
            : (e.slideTo(0, e.params.speed, !0, !0), e.emit('autoplay'))
          : (e.slideNext(e.params.speed, !0, !0), e.emit('autoplay')),
          e.params.cssMode && e.autoplay.running && e.autoplay.run();
      }, i));
  },
  start() {
    return (
      void 0 === this.autoplay.timeout &&
      !this.autoplay.running &&
      ((this.autoplay.running = !0),
      this.emit('autoplayStart'),
      this.autoplay.run(),
      !0)
    );
  },
  stop() {
    const e = this;
    return (
      !!e.autoplay.running &&
      void 0 !== e.autoplay.timeout &&
      (e.autoplay.timeout &&
        (clearTimeout(e.autoplay.timeout), (e.autoplay.timeout = void 0)),
      (e.autoplay.running = !1),
      e.emit('autoplayStop'),
      !0)
    );
  },
  pause(e) {
    const t = this;
    t.autoplay.running &&
      (t.autoplay.paused ||
        (t.autoplay.timeout && clearTimeout(t.autoplay.timeout),
        (t.autoplay.paused = !0),
        0 !== e && t.params.autoplay.waitForTransition
          ? (t.$wrapperEl[0].addEventListener(
              'transitionend',
              t.autoplay.onTransitionEnd
            ),
            t.$wrapperEl[0].addEventListener(
              'webkitTransitionEnd',
              t.autoplay.onTransitionEnd
            ))
          : ((t.autoplay.paused = !1), t.autoplay.run())));
  },
};
const Nc = {
  setTranslate() {
    const e = this,
      { slides: t } = e;
    for (let i = 0; i < t.length; i += 1) {
      const t = e.slides.eq(i);
      let s = -t[0].swiperSlideOffset;
      e.params.virtualTranslate || (s -= e.translate);
      let n = 0;
      e.isHorizontal() || ((n = s), (s = 0));
      const a = e.params.fadeEffect.crossFade
        ? Math.max(1 - Math.abs(t[0].progress), 0)
        : 1 + Math.min(Math.max(t[0].progress, -1), 0);
      t.css({ opacity: a }).transform(`translate3d(${s}px, ${n}px, 0px)`);
    }
  },
  setTransition(e) {
    const t = this,
      { slides: i, $wrapperEl: s } = t;
    if ((i.transition(e), t.params.virtualTranslate && 0 !== e)) {
      let e = !1;
      i.transitionEnd(() => {
        if (e) return;
        if (!t || t.destroyed) return;
        (e = !0), (t.animating = !1);
        const i = ['webkitTransitionEnd', 'transitionend'];
        for (let e = 0; e < i.length; e += 1) s.trigger(i[e]);
      });
    }
  },
};
const Hc = {
  setTranslate() {
    const {
        $el: e,
        $wrapperEl: t,
        slides: i,
        width: s,
        height: n,
        rtlTranslate: a,
        size: r,
      } = this,
      o = this.params.cubeEffect,
      l = this.isHorizontal(),
      d = this.virtual && this.params.virtual.enabled;
    let c,
      h = 0;
    o.shadow &&
      (l
        ? ((c = t.find('.swiper-cube-shadow')),
          0 === c.length &&
            ((c = qd('<div class="swiper-cube-shadow"></div>')), t.append(c)),
          c.css({ height: `${s}px` }))
        : ((c = e.find('.swiper-cube-shadow')),
          0 === c.length &&
            ((c = qd('<div class="swiper-cube-shadow"></div>')), e.append(c))));
    for (let e = 0; e < i.length; e += 1) {
      const t = i.eq(e);
      let s = e;
      d && (s = parseInt(t.attr('data-swiper-slide-index'), 10));
      let n = 90 * s,
        c = Math.floor(n / 360);
      a && ((n = -n), (c = Math.floor(-n / 360)));
      const p = Math.max(Math.min(t[0].progress, 1), -1);
      let u = 0,
        m = 0,
        f = 0;
      s % 4 == 0
        ? ((u = 4 * -c * r), (f = 0))
        : (s - 1) % 4 == 0
        ? ((u = 0), (f = 4 * -c * r))
        : (s - 2) % 4 == 0
        ? ((u = r + 4 * c * r), (f = r))
        : (s - 3) % 4 == 0 && ((u = -r), (f = 3 * r + 4 * r * c)),
        a && (u = -u),
        l || ((m = u), (u = 0));
      const g = `rotateX(${l ? 0 : -n}deg) rotateY(${
        l ? n : 0
      }deg) translate3d(${u}px, ${m}px, ${f}px)`;
      if (
        (p <= 1 &&
          p > -1 &&
          ((h = 90 * s + 90 * p), a && (h = 90 * -s - 90 * p)),
        t.transform(g),
        o.slideShadows)
      ) {
        let e = t.find(
            l ? '.swiper-slide-shadow-left' : '.swiper-slide-shadow-top'
          ),
          i = t.find(
            l ? '.swiper-slide-shadow-right' : '.swiper-slide-shadow-bottom'
          );
        0 === e.length &&
          ((e = qd(
            `<div class="swiper-slide-shadow-${l ? 'left' : 'top'}"></div>`
          )),
          t.append(e)),
          0 === i.length &&
            ((i = qd(
              `<div class="swiper-slide-shadow-${
                l ? 'right' : 'bottom'
              }"></div>`
            )),
            t.append(i)),
          e.length && (e[0].style.opacity = Math.max(-p, 0)),
          i.length && (i[0].style.opacity = Math.max(p, 0));
      }
    }
    if (
      (t.css({
        '-webkit-transform-origin': `50% 50% -${r / 2}px`,
        '-moz-transform-origin': `50% 50% -${r / 2}px`,
        '-ms-transform-origin': `50% 50% -${r / 2}px`,
        'transform-origin': `50% 50% -${r / 2}px`,
      }),
      o.shadow)
    )
      if (l)
        c.transform(
          `translate3d(0px, ${s / 2 + o.shadowOffset}px, ${
            -s / 2
          }px) rotateX(90deg) rotateZ(0deg) scale(${o.shadowScale})`
        );
      else {
        const e = Math.abs(h) - 90 * Math.floor(Math.abs(h) / 90),
          t =
            1.5 -
            (Math.sin((2 * e * Math.PI) / 360) / 2 +
              Math.cos((2 * e * Math.PI) / 360) / 2),
          i = o.shadowScale / t;
        c.transform(
          `scale3d(${o.shadowScale}, 1, ${i}) translate3d(0px, ${
            n / 2 + o.shadowOffset
          }px, ${-n / 2 / i}px) rotateX(-90deg)`
        );
      }
    t.transform(
      `translate3d(0px,0,${
        gc.isSafari || gc.isUiWebView ? -r / 2 : 0
      }px) rotateX(${this.isHorizontal() ? 0 : h}deg) rotateY(${
        this.isHorizontal() ? -h : 0
      }deg)`
    );
  },
  setTransition(e) {
    const { $el: t, slides: i } = this;
    i
      .transition(e)
      .find(
        '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
      )
      .transition(e),
      this.params.cubeEffect.shadow &&
        !this.isHorizontal() &&
        t.find('.swiper-cube-shadow').transition(e);
  },
};
const Rc = {
  setTranslate() {
    const e = this,
      { slides: t, rtlTranslate: i } = e;
    for (let s = 0; s < t.length; s += 1) {
      const n = t.eq(s);
      let a = n[0].progress;
      e.params.flipEffect.limitRotation &&
        (a = Math.max(Math.min(n[0].progress, 1), -1));
      let r = -180 * a,
        o = 0,
        l = -n[0].swiperSlideOffset,
        d = 0;
      if (
        (e.isHorizontal()
          ? i && (r = -r)
          : ((d = l), (l = 0), (o = -r), (r = 0)),
        (n[0].style.zIndex = -Math.abs(Math.round(a)) + t.length),
        e.params.flipEffect.slideShadows)
      ) {
        let t = e.isHorizontal()
            ? n.find('.swiper-slide-shadow-left')
            : n.find('.swiper-slide-shadow-top'),
          i = e.isHorizontal()
            ? n.find('.swiper-slide-shadow-right')
            : n.find('.swiper-slide-shadow-bottom');
        0 === t.length &&
          ((t = qd(
            `<div class="swiper-slide-shadow-${
              e.isHorizontal() ? 'left' : 'top'
            }"></div>`
          )),
          n.append(t)),
          0 === i.length &&
            ((i = qd(
              `<div class="swiper-slide-shadow-${
                e.isHorizontal() ? 'right' : 'bottom'
              }"></div>`
            )),
            n.append(i)),
          t.length && (t[0].style.opacity = Math.max(-a, 0)),
          i.length && (i[0].style.opacity = Math.max(a, 0));
      }
      n.transform(
        `translate3d(${l}px, ${d}px, 0px) rotateX(${o}deg) rotateY(${r}deg)`
      );
    }
  },
  setTransition(e) {
    const t = this,
      { slides: i, activeIndex: s, $wrapperEl: n } = t;
    if (
      (i
        .transition(e)
        .find(
          '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
        )
        .transition(e),
      t.params.virtualTranslate && 0 !== e)
    ) {
      let e = !1;
      i.eq(s).transitionEnd(function () {
        if (e) return;
        if (!t || t.destroyed) return;
        (e = !0), (t.animating = !1);
        const i = ['webkitTransitionEnd', 'transitionend'];
        for (let e = 0; e < i.length; e += 1) n.trigger(i[e]);
      });
    }
  },
};
const Vc = {
  setTranslate() {
    const {
        width: e,
        height: t,
        slides: i,
        $wrapperEl: s,
        slidesSizesGrid: n,
      } = this,
      a = this.params.coverflowEffect,
      r = this.isHorizontal(),
      o = this.translate,
      l = r ? e / 2 - o : t / 2 - o,
      d = r ? a.rotate : -a.rotate,
      c = a.depth;
    for (let e = 0, t = i.length; e < t; e += 1) {
      const t = i.eq(e),
        s = n[e],
        o = ((l - t[0].swiperSlideOffset - s / 2) / s) * a.modifier;
      let h = r ? d * o : 0,
        p = r ? 0 : d * o,
        u = -c * Math.abs(o),
        m = a.stretch;
      'string' == typeof m &&
        -1 !== m.indexOf('%') &&
        (m = (parseFloat(a.stretch) / 100) * s);
      let f = r ? 0 : m * o,
        g = r ? m * o : 0;
      if (
        (Math.abs(g) < 0.001 && (g = 0),
        Math.abs(f) < 0.001 && (f = 0),
        Math.abs(u) < 0.001 && (u = 0),
        Math.abs(h) < 0.001 && (h = 0),
        Math.abs(p) < 0.001 && (p = 0),
        t.transform(
          `translate3d(${g}px,${f}px,${u}px)  rotateX(${p}deg) rotateY(${h}deg)`
        ),
        (t[0].style.zIndex = 1 - Math.abs(Math.round(o))),
        a.slideShadows)
      ) {
        let e = t.find(
            r ? '.swiper-slide-shadow-left' : '.swiper-slide-shadow-top'
          ),
          i = t.find(
            r ? '.swiper-slide-shadow-right' : '.swiper-slide-shadow-bottom'
          );
        0 === e.length &&
          ((e = qd(
            `<div class="swiper-slide-shadow-${r ? 'left' : 'top'}"></div>`
          )),
          t.append(e)),
          0 === i.length &&
            ((i = qd(
              `<div class="swiper-slide-shadow-${
                r ? 'right' : 'bottom'
              }"></div>`
            )),
            t.append(i)),
          e.length && (e[0].style.opacity = o > 0 ? o : 0),
          i.length && (i[0].style.opacity = -o > 0 ? -o : 0);
      }
    }
    if (Wd.pointerEvents || Wd.prefixedPointerEvents) {
      s[0].style.perspectiveOrigin = `${l}px 50%`;
    }
  },
  setTransition(e) {
    this.slides
      .transition(e)
      .find(
        '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
      )
      .transition(e);
  },
};
const Yc = {
  init() {
    const e = this,
      { thumbs: t } = e.params,
      i = e.constructor;
    t.swiper instanceof i
      ? ((e.thumbs.swiper = t.swiper),
        Xd.extend(e.thumbs.swiper.originalParams, {
          watchSlidesProgress: !0,
          slideToClickedSlide: !1,
        }),
        Xd.extend(e.thumbs.swiper.params, {
          watchSlidesProgress: !0,
          slideToClickedSlide: !1,
        }))
      : Xd.isObject(t.swiper) &&
        ((e.thumbs.swiper = new i(
          Xd.extend({}, t.swiper, {
            watchSlidesVisibility: !0,
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          })
        )),
        (e.thumbs.swiperCreated = !0)),
      e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass),
      e.thumbs.swiper.on('tap', e.thumbs.onThumbClick);
  },
  onThumbClick() {
    const e = this,
      t = e.thumbs.swiper;
    if (!t) return;
    const i = t.clickedIndex,
      s = t.clickedSlide;
    if (s && qd(s).hasClass(e.params.thumbs.slideThumbActiveClass)) return;
    if (null == i) return;
    let n;
    if (
      ((n = t.params.loop
        ? parseInt(qd(t.clickedSlide).attr('data-swiper-slide-index'), 10)
        : i),
      e.params.loop)
    ) {
      let t = e.activeIndex;
      e.slides.eq(t).hasClass(e.params.slideDuplicateClass) &&
        (e.loopFix(),
        (e._clientLeft = e.$wrapperEl[0].clientLeft),
        (t = e.activeIndex));
      const i = e.slides
          .eq(t)
          .prevAll(`[data-swiper-slide-index="${n}"]`)
          .eq(0)
          .index(),
        s = e.slides
          .eq(t)
          .nextAll(`[data-swiper-slide-index="${n}"]`)
          .eq(0)
          .index();
      n = void 0 === i ? s : void 0 === s ? i : s - t < t - i ? s : i;
    }
    e.slideTo(n);
  },
  update(e) {
    const t = this,
      i = t.thumbs.swiper;
    if (!i) return;
    const s =
      'auto' === i.params.slidesPerView
        ? i.slidesPerViewDynamic()
        : i.params.slidesPerView;
    if (t.realIndex !== i.realIndex) {
      let n,
        a = i.activeIndex;
      if (i.params.loop) {
        i.slides.eq(a).hasClass(i.params.slideDuplicateClass) &&
          (i.loopFix(),
          (i._clientLeft = i.$wrapperEl[0].clientLeft),
          (a = i.activeIndex));
        const e = i.slides
            .eq(a)
            .prevAll(`[data-swiper-slide-index="${t.realIndex}"]`)
            .eq(0)
            .index(),
          s = i.slides
            .eq(a)
            .nextAll(`[data-swiper-slide-index="${t.realIndex}"]`)
            .eq(0)
            .index();
        n =
          void 0 === e
            ? s
            : void 0 === s
            ? e
            : s - a == a - e
            ? a
            : s - a < a - e
            ? s
            : e;
      } else n = t.realIndex;
      i.visibleSlidesIndexes &&
        i.visibleSlidesIndexes.indexOf(n) < 0 &&
        (i.params.centeredSlides
          ? (n = n > a ? n - Math.floor(s / 2) + 1 : n + Math.floor(s / 2) - 1)
          : n > a && (n = n - s + 1),
        i.slideTo(n, e ? 0 : void 0));
    }
    let n = 1;
    const a = t.params.thumbs.slideThumbActiveClass;
    if (
      (t.params.slidesPerView > 1 &&
        !t.params.centeredSlides &&
        (n = t.params.slidesPerView),
      t.params.thumbs.multipleActiveThumbs || (n = 1),
      (n = Math.floor(n)),
      i.slides.removeClass(a),
      i.params.loop || (i.params.virtual && i.params.virtual.enabled))
    )
      for (let e = 0; e < n; e += 1)
        i.$wrapperEl
          .children(`[data-swiper-slide-index="${t.realIndex + e}"]`)
          .addClass(a);
    else
      for (let e = 0; e < n; e += 1) i.slides.eq(t.realIndex + e).addClass(a);
  },
};
const qc = [
  mc,
  fc,
  vc,
  bc,
  wc,
  Sc,
  Tc,
  {
    name: 'mousewheel',
    params: {
      mousewheel: {
        enabled: !1,
        releaseOnEdges: !1,
        invert: !1,
        forceToAxis: !1,
        sensitivity: 1,
        eventsTarged: 'container',
      },
    },
    create() {
      Xd.extend(this, {
        mousewheel: {
          enabled: !1,
          enable: $c.enable.bind(this),
          disable: $c.disable.bind(this),
          handle: $c.handle.bind(this),
          handleMouseEnter: $c.handleMouseEnter.bind(this),
          handleMouseLeave: $c.handleMouseLeave.bind(this),
          animateSlider: $c.animateSlider.bind(this),
          releaseScroll: $c.releaseScroll.bind(this),
          lastScrollTime: Xd.now(),
          lastEventBeforeSnap: void 0,
          recentWheelEvents: [],
        },
      });
    },
    on: {
      init() {
        const e = this;
        !e.params.mousewheel.enabled &&
          e.params.cssMode &&
          e.mousewheel.disable(),
          e.params.mousewheel.enabled && e.mousewheel.enable();
      },
      destroy() {
        const e = this;
        e.params.cssMode && e.mousewheel.enable(),
          e.mousewheel.enabled && e.mousewheel.disable();
      },
    },
  },
  {
    name: 'navigation',
    params: {
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: !1,
        disabledClass: 'swiper-button-disabled',
        hiddenClass: 'swiper-button-hidden',
        lockClass: 'swiper-button-lock',
      },
    },
    create() {
      Xd.extend(this, {
        navigation: {
          init: Cc.init.bind(this),
          update: Cc.update.bind(this),
          destroy: Cc.destroy.bind(this),
          onNextClick: Cc.onNextClick.bind(this),
          onPrevClick: Cc.onPrevClick.bind(this),
        },
      });
    },
    on: {
      init() {
        this.navigation.init(), this.navigation.update();
      },
      toEdge() {
        this.navigation.update();
      },
      fromEdge() {
        this.navigation.update();
      },
      destroy() {
        this.navigation.destroy();
      },
      click(e) {
        const t = this,
          { $nextEl: i, $prevEl: s } = t.navigation;
        if (
          t.params.navigation.hideOnClick &&
          !qd(e.target).is(s) &&
          !qd(e.target).is(i)
        ) {
          let e;
          i
            ? (e = i.hasClass(t.params.navigation.hiddenClass))
            : s && (e = s.hasClass(t.params.navigation.hiddenClass)),
            t.emit(!0 === e ? 'navigationShow' : 'navigationHide', t),
            i && i.toggleClass(t.params.navigation.hiddenClass),
            s && s.toggleClass(t.params.navigation.hiddenClass);
        }
      },
    },
  },
  {
    name: 'pagination',
    params: {
      pagination: {
        el: null,
        bulletElement: 'span',
        clickable: !1,
        hideOnClick: !1,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: !1,
        type: 'bullets',
        dynamicBullets: !1,
        dynamicMainBullets: 1,
        formatFractionCurrent: (e) => e,
        formatFractionTotal: (e) => e,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        modifierClass: 'swiper-pagination-',
        currentClass: 'swiper-pagination-current',
        totalClass: 'swiper-pagination-total',
        hiddenClass: 'swiper-pagination-hidden',
        progressbarFillClass: 'swiper-pagination-progressbar-fill',
        progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
        clickableClass: 'swiper-pagination-clickable',
        lockClass: 'swiper-pagination-lock',
      },
    },
    create() {
      Xd.extend(this, {
        pagination: {
          init: kc.init.bind(this),
          render: kc.render.bind(this),
          update: kc.update.bind(this),
          destroy: kc.destroy.bind(this),
          dynamicBulletIndex: 0,
        },
      });
    },
    on: {
      init() {
        this.pagination.init(),
          this.pagination.render(),
          this.pagination.update();
      },
      activeIndexChange() {
        const e = this;
        (e.params.loop || void 0 === e.snapIndex) && e.pagination.update();
      },
      snapIndexChange() {
        const e = this;
        e.params.loop || e.pagination.update();
      },
      slidesLengthChange() {
        const e = this;
        e.params.loop && (e.pagination.render(), e.pagination.update());
      },
      snapGridLengthChange() {
        const e = this;
        e.params.loop || (e.pagination.render(), e.pagination.update());
      },
      destroy() {
        this.pagination.destroy();
      },
      click(e) {
        const t = this;
        if (
          t.params.pagination.el &&
          t.params.pagination.hideOnClick &&
          t.pagination.$el.length > 0 &&
          !qd(e.target).hasClass(t.params.pagination.bulletClass)
        ) {
          const e = t.pagination.$el.hasClass(t.params.pagination.hiddenClass);
          t.emit(!0 === e ? 'paginationShow' : 'paginationHide', t),
            t.pagination.$el.toggleClass(t.params.pagination.hiddenClass);
        }
      },
    },
  },
  {
    name: 'scrollbar',
    params: {
      scrollbar: {
        el: null,
        dragSize: 'auto',
        hide: !1,
        draggable: !1,
        snapOnRelease: !0,
        lockClass: 'swiper-scrollbar-lock',
        dragClass: 'swiper-scrollbar-drag',
      },
    },
    create() {
      Xd.extend(this, {
        scrollbar: {
          init: Mc.init.bind(this),
          destroy: Mc.destroy.bind(this),
          updateSize: Mc.updateSize.bind(this),
          setTranslate: Mc.setTranslate.bind(this),
          setTransition: Mc.setTransition.bind(this),
          enableDraggable: Mc.enableDraggable.bind(this),
          disableDraggable: Mc.disableDraggable.bind(this),
          setDragPosition: Mc.setDragPosition.bind(this),
          getPointerPosition: Mc.getPointerPosition.bind(this),
          onDragStart: Mc.onDragStart.bind(this),
          onDragMove: Mc.onDragMove.bind(this),
          onDragEnd: Mc.onDragEnd.bind(this),
          isTouched: !1,
          timeout: null,
          dragTimeout: null,
        },
      });
    },
    on: {
      init() {
        this.scrollbar.init(),
          this.scrollbar.updateSize(),
          this.scrollbar.setTranslate();
      },
      update() {
        this.scrollbar.updateSize();
      },
      resize() {
        this.scrollbar.updateSize();
      },
      observerUpdate() {
        this.scrollbar.updateSize();
      },
      setTranslate() {
        this.scrollbar.setTranslate();
      },
      setTransition(e) {
        this.scrollbar.setTransition(e);
      },
      destroy() {
        this.scrollbar.destroy();
      },
    },
  },
  {
    name: 'parallax',
    params: { parallax: { enabled: !1 } },
    create() {
      Xd.extend(this, {
        parallax: {
          setTransform: Ic.setTransform.bind(this),
          setTranslate: Ic.setTranslate.bind(this),
          setTransition: Ic.setTransition.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        this.params.parallax.enabled &&
          ((this.params.watchSlidesProgress = !0),
          (this.originalParams.watchSlidesProgress = !0));
      },
      init() {
        this.params.parallax.enabled && this.parallax.setTranslate();
      },
      setTranslate() {
        this.params.parallax.enabled && this.parallax.setTranslate();
      },
      setTransition(e) {
        this.params.parallax.enabled && this.parallax.setTransition(e);
      },
    },
  },
  {
    name: 'zoom',
    params: {
      zoom: {
        enabled: !1,
        maxRatio: 3,
        minRatio: 1,
        toggle: !0,
        containerClass: 'swiper-zoom-container',
        zoomedSlideClass: 'swiper-slide-zoomed',
      },
    },
    create() {
      const e = this,
        t = {
          enabled: !1,
          scale: 1,
          currentScale: 1,
          isScaling: !1,
          gesture: {
            $slideEl: void 0,
            slideWidth: void 0,
            slideHeight: void 0,
            $imageEl: void 0,
            $imageWrapEl: void 0,
            maxRatio: 3,
          },
          image: {
            isTouched: void 0,
            isMoved: void 0,
            currentX: void 0,
            currentY: void 0,
            minX: void 0,
            minY: void 0,
            maxX: void 0,
            maxY: void 0,
            width: void 0,
            height: void 0,
            startX: void 0,
            startY: void 0,
            touchesStart: {},
            touchesCurrent: {},
          },
          velocity: {
            x: void 0,
            y: void 0,
            prevPositionX: void 0,
            prevPositionY: void 0,
            prevTime: void 0,
          },
        };
      'onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out'
        .split(' ')
        .forEach((i) => {
          t[i] = Pc[i].bind(e);
        }),
        Xd.extend(e, { zoom: t });
      let i = 1;
      Object.defineProperty(e.zoom, 'scale', {
        get: () => i,
        set(t) {
          if (i !== t) {
            e.emit(
              'zoomChange',
              t,
              e.zoom.gesture.$imageEl ? e.zoom.gesture.$imageEl[0] : void 0,
              e.zoom.gesture.$slideEl ? e.zoom.gesture.$slideEl[0] : void 0
            );
          }
          i = t;
        },
      });
    },
    on: {
      init() {
        const e = this;
        e.params.zoom.enabled && e.zoom.enable();
      },
      destroy() {
        this.zoom.disable();
      },
      touchStart(e) {
        this.zoom.enabled && this.zoom.onTouchStart(e);
      },
      touchEnd(e) {
        this.zoom.enabled && this.zoom.onTouchEnd(e);
      },
      doubleTap(e) {
        const t = this;
        t.params.zoom.enabled &&
          t.zoom.enabled &&
          t.params.zoom.toggle &&
          t.zoom.toggle(e);
      },
      transitionEnd() {
        const e = this;
        e.zoom.enabled && e.params.zoom.enabled && e.zoom.onTransitionEnd();
      },
      slideChange() {
        const e = this;
        e.zoom.enabled &&
          e.params.zoom.enabled &&
          e.params.cssMode &&
          e.zoom.onTransitionEnd();
      },
    },
  },
  {
    name: 'lazy',
    params: {
      lazy: {
        enabled: !1,
        loadPrevNext: !1,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: !1,
        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader',
      },
    },
    create() {
      Xd.extend(this, {
        lazy: {
          initialImageLoaded: !1,
          load: Ac.load.bind(this),
          loadInSlide: Ac.loadInSlide.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        const e = this;
        e.params.lazy.enabled &&
          e.params.preloadImages &&
          (e.params.preloadImages = !1);
      },
      init() {
        const e = this;
        e.params.lazy.enabled &&
          !e.params.loop &&
          0 === e.params.initialSlide &&
          e.lazy.load();
      },
      scroll() {
        const e = this;
        e.params.freeMode && !e.params.freeModeSticky && e.lazy.load();
      },
      resize() {
        const e = this;
        e.params.lazy.enabled && e.lazy.load();
      },
      scrollbarDragMove() {
        const e = this;
        e.params.lazy.enabled && e.lazy.load();
      },
      transitionStart() {
        const e = this;
        e.params.lazy.enabled &&
          (e.params.lazy.loadOnTransitionStart ||
            (!e.params.lazy.loadOnTransitionStart &&
              !e.lazy.initialImageLoaded)) &&
          e.lazy.load();
      },
      transitionEnd() {
        const e = this;
        e.params.lazy.enabled &&
          !e.params.lazy.loadOnTransitionStart &&
          e.lazy.load();
      },
      slideChange() {
        const e = this;
        e.params.lazy.enabled && e.params.cssMode && e.lazy.load();
      },
    },
  },
  {
    name: 'controller',
    params: { controller: { control: void 0, inverse: !1, by: 'slide' } },
    create() {
      Xd.extend(this, {
        controller: {
          control: this.params.controller.control,
          getInterpolateFunction: Oc.getInterpolateFunction.bind(this),
          setTranslate: Oc.setTranslate.bind(this),
          setTransition: Oc.setTransition.bind(this),
        },
      });
    },
    on: {
      update() {
        const e = this;
        e.controller.control &&
          e.controller.spline &&
          ((e.controller.spline = void 0), delete e.controller.spline);
      },
      resize() {
        const e = this;
        e.controller.control &&
          e.controller.spline &&
          ((e.controller.spline = void 0), delete e.controller.spline);
      },
      observerUpdate() {
        const e = this;
        e.controller.control &&
          e.controller.spline &&
          ((e.controller.spline = void 0), delete e.controller.spline);
      },
      setTranslate(e, t) {
        this.controller.control && this.controller.setTranslate(e, t);
      },
      setTransition(e, t) {
        this.controller.control && this.controller.setTransition(e, t);
      },
    },
  },
  {
    name: 'a11y',
    params: {
      a11y: {
        enabled: !0,
        notificationClass: 'swiper-notification',
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
      },
    },
    create() {
      const e = this;
      Xd.extend(e, {
        a11y: {
          liveRegion: qd(
            `<span class="${e.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`
          ),
        },
      }),
        Object.keys(Bc).forEach((t) => {
          e.a11y[t] = Bc[t].bind(e);
        });
    },
    on: {
      init() {
        this.params.a11y.enabled &&
          (this.a11y.init(), this.a11y.updateNavigation());
      },
      toEdge() {
        this.params.a11y.enabled && this.a11y.updateNavigation();
      },
      fromEdge() {
        this.params.a11y.enabled && this.a11y.updateNavigation();
      },
      paginationUpdate() {
        this.params.a11y.enabled && this.a11y.updatePagination();
      },
      destroy() {
        this.params.a11y.enabled && this.a11y.destroy();
      },
    },
  },
  {
    name: 'history',
    params: { history: { enabled: !1, replaceState: !1, key: 'slides' } },
    create() {
      Xd.extend(this, {
        history: {
          init: Lc.init.bind(this),
          setHistory: Lc.setHistory.bind(this),
          setHistoryPopState: Lc.setHistoryPopState.bind(this),
          scrollToSlide: Lc.scrollToSlide.bind(this),
          destroy: Lc.destroy.bind(this),
        },
      });
    },
    on: {
      init() {
        const e = this;
        e.params.history.enabled && e.history.init();
      },
      destroy() {
        const e = this;
        e.params.history.enabled && e.history.destroy();
      },
      transitionEnd() {
        const e = this;
        e.history.initialized &&
          e.history.setHistory(e.params.history.key, e.activeIndex);
      },
      slideChange() {
        const e = this;
        e.history.initialized &&
          e.params.cssMode &&
          e.history.setHistory(e.params.history.key, e.activeIndex);
      },
    },
  },
  {
    name: 'hash-navigation',
    params: {
      hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 },
    },
    create() {
      Xd.extend(this, {
        hashNavigation: {
          initialized: !1,
          init: zc.init.bind(this),
          destroy: zc.destroy.bind(this),
          setHash: zc.setHash.bind(this),
          onHashCange: zc.onHashCange.bind(this),
        },
      });
    },
    on: {
      init() {
        const e = this;
        e.params.hashNavigation.enabled && e.hashNavigation.init();
      },
      destroy() {
        const e = this;
        e.params.hashNavigation.enabled && e.hashNavigation.destroy();
      },
      transitionEnd() {
        const e = this;
        e.hashNavigation.initialized && e.hashNavigation.setHash();
      },
      slideChange() {
        const e = this;
        e.hashNavigation.initialized &&
          e.params.cssMode &&
          e.hashNavigation.setHash();
      },
    },
  },
  {
    name: 'autoplay',
    params: {
      autoplay: {
        enabled: !1,
        delay: 3e3,
        waitForTransition: !0,
        disableOnInteraction: !0,
        stopOnLastSlide: !1,
        reverseDirection: !1,
      },
    },
    create() {
      const e = this;
      Xd.extend(e, {
        autoplay: {
          running: !1,
          paused: !1,
          run: Dc.run.bind(e),
          start: Dc.start.bind(e),
          stop: Dc.stop.bind(e),
          pause: Dc.pause.bind(e),
          onVisibilityChange() {
            'hidden' === document.visibilityState &&
              e.autoplay.running &&
              e.autoplay.pause(),
              'visible' === document.visibilityState &&
                e.autoplay.paused &&
                (e.autoplay.run(), (e.autoplay.paused = !1));
          },
          onTransitionEnd(t) {
            e &&
              !e.destroyed &&
              e.$wrapperEl &&
              t.target === this &&
              (e.$wrapperEl[0].removeEventListener(
                'transitionend',
                e.autoplay.onTransitionEnd
              ),
              e.$wrapperEl[0].removeEventListener(
                'webkitTransitionEnd',
                e.autoplay.onTransitionEnd
              ),
              (e.autoplay.paused = !1),
              e.autoplay.running ? e.autoplay.run() : e.autoplay.stop());
          },
        },
      });
    },
    on: {
      init() {
        const e = this;
        e.params.autoplay.enabled &&
          (e.autoplay.start(),
          document.addEventListener(
            'visibilitychange',
            e.autoplay.onVisibilityChange
          ));
      },
      beforeTransitionStart(e, t) {
        const i = this;
        i.autoplay.running &&
          (t || !i.params.autoplay.disableOnInteraction
            ? i.autoplay.pause(e)
            : i.autoplay.stop());
      },
      sliderFirstMove() {
        const e = this;
        e.autoplay.running &&
          (e.params.autoplay.disableOnInteraction
            ? e.autoplay.stop()
            : e.autoplay.pause());
      },
      touchEnd() {
        const e = this;
        e.params.cssMode &&
          e.autoplay.paused &&
          !e.params.autoplay.disableOnInteraction &&
          e.autoplay.run();
      },
      destroy() {
        const e = this;
        e.autoplay.running && e.autoplay.stop(),
          document.removeEventListener(
            'visibilitychange',
            e.autoplay.onVisibilityChange
          );
      },
    },
  },
  {
    name: 'effect-fade',
    params: { fadeEffect: { crossFade: !1 } },
    create() {
      Xd.extend(this, {
        fadeEffect: {
          setTranslate: Nc.setTranslate.bind(this),
          setTransition: Nc.setTransition.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        if ('fade' !== this.params.effect) return;
        this.classNames.push(`${this.params.containerModifierClass}fade`);
        const e = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          spaceBetween: 0,
          virtualTranslate: !0,
        };
        Xd.extend(this.params, e), Xd.extend(this.originalParams, e);
      },
      setTranslate() {
        'fade' === this.params.effect && this.fadeEffect.setTranslate();
      },
      setTransition(e) {
        'fade' === this.params.effect && this.fadeEffect.setTransition(e);
      },
    },
  },
  {
    name: 'effect-cube',
    params: {
      cubeEffect: {
        slideShadows: !0,
        shadow: !0,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
    },
    create() {
      Xd.extend(this, {
        cubeEffect: {
          setTranslate: Hc.setTranslate.bind(this),
          setTransition: Hc.setTransition.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        if ('cube' !== this.params.effect) return;
        this.classNames.push(`${this.params.containerModifierClass}cube`),
          this.classNames.push(`${this.params.containerModifierClass}3d`);
        const e = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: !1,
          virtualTranslate: !0,
        };
        Xd.extend(this.params, e), Xd.extend(this.originalParams, e);
      },
      setTranslate() {
        'cube' === this.params.effect && this.cubeEffect.setTranslate();
      },
      setTransition(e) {
        'cube' === this.params.effect && this.cubeEffect.setTransition(e);
      },
    },
  },
  {
    name: 'effect-flip',
    params: { flipEffect: { slideShadows: !0, limitRotation: !0 } },
    create() {
      Xd.extend(this, {
        flipEffect: {
          setTranslate: Rc.setTranslate.bind(this),
          setTransition: Rc.setTransition.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        if ('flip' !== this.params.effect) return;
        this.classNames.push(`${this.params.containerModifierClass}flip`),
          this.classNames.push(`${this.params.containerModifierClass}3d`);
        const e = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          spaceBetween: 0,
          virtualTranslate: !0,
        };
        Xd.extend(this.params, e), Xd.extend(this.originalParams, e);
      },
      setTranslate() {
        'flip' === this.params.effect && this.flipEffect.setTranslate();
      },
      setTransition(e) {
        'flip' === this.params.effect && this.flipEffect.setTransition(e);
      },
    },
  },
  {
    name: 'effect-coverflow',
    params: {
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: !0,
      },
    },
    create() {
      Xd.extend(this, {
        coverflowEffect: {
          setTranslate: Vc.setTranslate.bind(this),
          setTransition: Vc.setTransition.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        'coverflow' === this.params.effect &&
          (this.classNames.push(
            `${this.params.containerModifierClass}coverflow`
          ),
          this.classNames.push(`${this.params.containerModifierClass}3d`),
          (this.params.watchSlidesProgress = !0),
          (this.originalParams.watchSlidesProgress = !0));
      },
      setTranslate() {
        'coverflow' === this.params.effect &&
          this.coverflowEffect.setTranslate();
      },
      setTransition(e) {
        'coverflow' === this.params.effect &&
          this.coverflowEffect.setTransition(e);
      },
    },
  },
  {
    name: 'thumbs',
    params: {
      thumbs: {
        multipleActiveThumbs: !0,
        swiper: null,
        slideThumbActiveClass: 'swiper-slide-thumb-active',
        thumbsContainerClass: 'swiper-container-thumbs',
      },
    },
    create() {
      Xd.extend(this, {
        thumbs: {
          swiper: null,
          init: Yc.init.bind(this),
          update: Yc.update.bind(this),
          onThumbClick: Yc.onThumbClick.bind(this),
        },
      });
    },
    on: {
      beforeInit() {
        const { thumbs: e } = this.params;
        e && e.swiper && (this.thumbs.init(), this.thumbs.update(!0));
      },
      slideChange() {
        this.thumbs.swiper && this.thumbs.update();
      },
      update() {
        this.thumbs.swiper && this.thumbs.update();
      },
      resize() {
        this.thumbs.swiper && this.thumbs.update();
      },
      observerUpdate() {
        this.thumbs.swiper && this.thumbs.update();
      },
      setTransition(e) {
        const t = this.thumbs.swiper;
        t && t.setTransition(e);
      },
      beforeDestroy() {
        const e = this.thumbs.swiper;
        e && this.thumbs.swiperCreated && e && e.destroy();
      },
    },
  },
];
void 0 === uc.use &&
  ((uc.use = uc.Class.use), (uc.installModule = uc.Class.installModule)),
  uc.use(qc);
const { createComponent: Fc, bem: Gc } = R('slides');
var Xc = Fc({
  props: { options: Object, pager: Boolean, scrollbar: Boolean },
  data: () => ({ swiperReady: !1 }),
  async mounted() {
    (this.mutationO = new MutationObserver(() => {
      this.swiperReady && this.update();
    })).observe(this.$el, { childList: !0, subtree: !0 }),
      this.initSwiper(),
      (this.paginationEl = this.$refs && this.$refs.paginationEl),
      (this.scrollbarEl = this.$refs && this.$refs.scrollbarEl);
  },
  async destroyed() {
    this.mutationO && (this.mutationO.disconnect(), (this.mutationO = void 0));
    const e = await this.getSwiper();
    e && e.destroy(!0, !0), (this.swiperReady = !1);
  },
  methods: {
    async optionsChanged() {
      if (this.swiperReady) {
        const e = await this.getSwiper();
        Object.assign(e.params, this.options), await this.update();
      }
    },
    async update() {
      const [e] = await Promise.all([this.getSwiper()]);
      e && e.update();
    },
    async updateAutoHeight(e) {
      (await this.getSwiper()).updateAutoHeight(e);
    },
    async slideTo(e, t, i) {
      (await this.getSwiper()).slideTo(e, t, i);
    },
    async slideNext(e, t) {
      (await this.getSwiper()).slideNext(e, t);
    },
    async slidePrev(e, t) {
      (await this.getSwiper()).slidePrev(e, t);
    },
    async getActiveIndex() {
      return (await this.getSwiper()).activeIndex;
    },
    async getPreviousIndex() {
      return (await this.getSwiper()).previousIndex;
    },
    async length() {
      return (await this.getSwiper()).slides.length;
    },
    async isEnd() {
      return (await this.getSwiper()).isEnd;
    },
    async isBeginning() {
      return (await this.getSwiper()).isBeginning;
    },
    async startAutoplay() {
      const e = await this.getSwiper();
      e.autoplay && e.autoplay.start();
    },
    async stopAutoplay() {
      const e = await this.getSwiper();
      e.autoplay && e.autoplay.stop();
    },
    async lockSwipeToNext(e) {
      (await this.getSwiper()).allowSlideNext = !e;
    },
    async lockSwipeToPrev(e) {
      (await this.getSwiper()).allowSlidePrev = !e;
    },
    async lockSwipes(e) {
      const t = await this.getSwiper();
      (t.allowSlideNext = !e), (t.allowSlidePrev = !e), (t.allowTouchMove = !e);
    },
    async getSwiper() {
      return this.swiper;
    },
    async initSwiper() {
      const e = this.normalizeOptions(),
        t = new uc(this.$el, e);
      (this.swiperReady = !0), (this.swiper = t);
    },
    normalizeOptions() {
      const e = {
        effect: void 0,
        direction: 'horizontal',
        initialSlide: 0,
        loop: !1,
        parallax: !1,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 300,
        slidesPerColumn: 1,
        slidesPerColumnFill: 'column',
        slidesPerGroup: 1,
        centeredSlides: !1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        touchEventsTarget: 'container',
        autoplay: !1,
        freeMode: !1,
        freeModeMomentum: !0,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: !0,
        freeModeMomentumBounceRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        freeModeSticky: !1,
        freeModeMinimumVelocity: 0.02,
        autoHeight: !1,
        setWrapperSize: !1,
        zoom: { maxRatio: 3, minRatio: 1, toggle: !1 },
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        touchStartPreventDefault: !1,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: !0,
        threshold: 0,
        touchMoveStopPropagation: !0,
        touchReleaseOnEdges: !1,
        iOSEdgeSwipeDetection: !1,
        iOSEdgeSwipeThreshold: 20,
        resistance: !0,
        resistanceRatio: 0.85,
        watchSlidesProgress: !1,
        watchSlidesVisibility: !1,
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        loopAdditionalSlides: 0,
        noSwiping: !0,
        runCallbacksOnInit: !0,
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: !0,
        },
        flipEffect: { slideShadows: !0, limitRotation: !0 },
        cubeEffect: {
          slideShadows: !0,
          shadow: !0,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        fadeEffect: { crossFade: !1 },
        a11y: {
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
        },
      };
      this.pager &&
        (e.pagination = {
          el: this.paginationEl,
          type: 'bullets',
          clickable: !1,
          hideOnClick: !1,
        }),
        this.scrollbar && (e.scrollbar = { el: this.scrollbarEl, hide: !0 });
      const t = (e, t) => {
          this.$emit(e, t);
        },
        i = {
          init: () => {
            setTimeout(() => {
              this.$emit('slidesDidLoad');
            }, 20);
          },
          slideChangeTransitionStart() {
            const { activeIndex: e } = this;
            t('slideChangeTransitionStart', e);
          },
          slideChangeTransitionEnd() {
            const { activeIndex: e } = this;
            t('slideChangeTransitionEnd', e);
          },
          slideNextTransitionStart: this.$emit('slideNextTransitionStart'),
          slidePrevTransitionStart: this.$emit('slidePrevTransitionStart'),
          slideNextTransitionEnd: this.$emit('slideNextTransitionEnd'),
          slidePrevTransitionEnd: this.$emit('slidePrevTransitionEnd'),
          transitionStart: this.$emit('transitionStart'),
          transitionEnd: this.$emit('transitionEnd'),
          sliderMove: this.$emit('slideDrag'),
          reachBeginning: this.$emit('slideReachStart'),
          reachEnd: this.$emit('slideReachEnd'),
          touchStart: this.$emit('slideTouchStart'),
          touchEnd: this.$emit('slideTouchEnd'),
          tap: this.$emit('slideTap'),
          doubleTap: this.$emit('slideDoubleTap'),
        },
        s = {
          on: {
            ...(this.options && this.options.on ? this.options.on : {}),
            ...i,
          },
        };
      return { ...e, ...this.options, ...s };
    },
  },
  watch: {
    options() {
      this.optionsChanged();
    },
  },
  render() {
    const e = arguments[0],
      { mode: t } = this;
    return e(
      'div',
      { class: [Gc(), { [`slides-${t}`]: !0, 'swiper-container': !0 }] },
      [
        e('div', { class: 'swiper-wrapper' }, [this.slots()]),
        this.pager &&
          e('div', { class: 'swiper-pagination', ref: 'paginationEl' }),
        this.scrollbar &&
          e('div', { class: 'swiper-scrollbar', ref: 'scrollbarEl' }),
      ]
    );
  },
});
const { createComponent: Wc, bem: jc } = R('switch-group');
var _c = Wc({
  mixins: [Jt('SwitchGroup')],
  render() {
    return (0, arguments[0])('div', { class: jc() }, [this.slots()]);
  },
});
const { createComponent: Uc, bem: Kc } = R('switch-indicator');
var Jc = Uc({
  functional: !0,
  props: { checked: Boolean, disabled: Boolean },
  render: (e, { props: t, data: i, slots: s }) =>
    e(
      'div',
      b([
        { class: Kc({ 'is-checked': t.checked, 'is-disabled': t.disabled }) },
        i,
      ]),
      [e('div', { class: Kc('thumb') }, [s()])]
    ),
});
const { createComponent: Zc, bem: Qc } = R('switch');
var eh = Zc({
  mixins: [Pi('SwitchGroup'), Gt()],
  data: () => ({ gesture: void 0, lastDrag: 0, activated: !1 }),
  methods: {
    onClick() {
      this.lastDrag + 300 < Date.now() && (this.checked = !this.checked);
    },
    onStart() {
      (this.activated = !0), this.setFocus();
    },
    onMove(e) {
      this.shouldToggle(document, this.checked, e.deltaX, -10) &&
        (this.checked = !this.checked);
    },
    onEnd(e) {
      (this.activated = !1),
        (this.lastDrag = Date.now()),
        e.event.preventDefault(),
        e.event.stopImmediatePropagation();
    },
    shouldToggle(e, t, i, s) {
      const n = 'rtl' === e.dir;
      return t
        ? (!n && s > i) || (n && -s < i)
        : (!n && -s < i) || (n && s > i);
    },
    emitStyle() {
      this.Item &&
        this.Item.itemStyle('switch', {
          'interactive-disabled': this.disabled,
        });
    },
    setFocus() {
      this.buttonEl && this.buttonEl.focus();
    },
    disabledChanged() {
      this.gesture && this.gesture.enable(!this.disabled);
    },
  },
  async mounted() {
    (this.buttonEl = this.$refs.buttonEl),
      (this.gesture = Ie({
        el: this.$el,
        gestureName: 'toggle',
        gesturePriority: 100,
        threshold: 5,
        passive: !1,
        onStart: () => this.onStart(),
        onMove: (e) => this.onMove(e),
        onEnd: (e) => this.onEnd(e),
      })),
      this.disabledChanged(),
      this.emitStyle();
  },
  destroyed() {
    this.gesture && (this.gesture.destroy(), (this.gesture = void 0));
  },
  watch: {
    disabled() {
      this.emitStyle(), this.disabledChanged();
    },
    checked() {
      this.emitStyle();
    },
  },
  render() {
    const e = arguments[0],
      { checked: t, disabled: i, activated: s } = this;
    return e(
      'div',
      b([
        {
          attrs: { role: 'checkbox' },
          class: Qc({ disabled: i, checked: t, activated: s }),
          on: { click: this.onClick },
        },
        { on: this.$listeners },
      ]),
      [
        e('div', { class: Qc('icon') }, [e('div', { class: Qc('inner') })]),
        e('button', {
          attrs: { type: 'button', disabled: i },
          ref: 'buttonEl',
        }),
      ]
    );
  },
});
const { createComponent: th, bem: ih } = R('tab-bar');
var sh = th({
  mixins: [Ci('TabBar'), Gt()],
  props: {
    exclusive: { type: Boolean, default: !0 },
    value: String,
    translucent: Boolean,
    keyboardVisible: Boolean,
    selectedTab: String,
  },
  methods: {
    selectedTabChanged() {
      void 0 !== this.selectedTab &&
        this.$emit('tabBarChanged', { tab: this.selectedTab });
    },
  },
  watch: {
    selectedTab() {
      this.selectedTabChanged();
    },
  },
  beforeMount() {
    this.selectedTabChanged();
  },
  render() {
    const e = arguments[0],
      { translucent: t, keyboardVisible: i } = this;
    return e(
      'div',
      b([
        { class: ih({ translucent: t, hidden: i }) },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: nh, bem: ah } = R('tab-button');
var rh = nh({
  mixins: [Ai('TabBar'), Oi()],
  props: { text: String, layout: String, tab: String, disabled: Boolean },
  computed: {
    hasLabel() {
      return this.$el && !!this.$el.querySelector('.line-label');
    },
    hasIcon() {
      return this.$el && !!this.$el.querySelector('.line-icon');
    },
  },
  methods: {
    onClick() {
      this.checked || (this.checkable && !this.disabled && (this.checked = !0));
    },
  },
  render() {
    const e = arguments[0],
      { hasLabel: t, hasIcon: i, mode: s } = this;
    return e(
      'div',
      b([
        {
          class: [
            ah({
              'has-label': t,
              'has-icon': i,
              'has-label-only': t && !i,
              'has-icon-only': i && !t,
            }),
            {
              'tab-selected': this.checked,
              'tab-disabled': this.disabled,
              'line-activatable': !0,
              'line-selectable': !0,
              'line-focusable': !0,
            },
          ],
          on: { click: this.onClick },
        },
        { on: this.$listeners },
      ]),
      [
        e('div', { class: 'button-native', attrs: { tabIndex: -1 } }, [
          e('span', { class: 'button-inner' }, [this.slots() || this.text]),
          'md' === s &&
            e('line-ripple-effect', { attrs: { type: 'unbounded' } }),
        ]),
      ]
    );
  },
});
const { createComponent: oh, bem: lh } = R('tab');
var dh = oh({
  mixins: [Ai('Tabs')],
  props: { title: String, tab: String },
  data: () => ({}),
  methods: {
    onClick() {
      this.checked || (this.checkable && !this.disabled && (this.checked = !0));
    },
  },
  render() {
    const e = arguments[0],
      { checked: t, tab: i } = this;
    return e(
      'div',
      b([
        {
          class: [lh({ hidden: !t })],
          attrs: {
            role: 'tabpanel',
            'aria-hidden': t ? null : 'true',
            'aria-labelledby': `tab-button-${i}`,
          },
        },
        { on: this.$listeners },
      ]),
      [this.slots()]
    );
  },
});
const { createComponent: ch, bem: hh } = R('tabs');
var ph = ch({
  mixins: [Ci('Tabs')],
  props: { exclusive: { type: Boolean, default: !0 } },
  render() {
    const e = arguments[0];
    return e('div', b([{ class: hh() }, { on: this.$listeners }]), [
      this.slots('top'),
      e('div', { class: hh('inner') }, [this.slots()]),
      this.slots('bottom'),
    ]);
  },
});
const { createComponent: uh, bem: mh } = R('textarea');
let fh = 0;
var gh = uh({
  mixins: [U('nativeValue', { event: 'textareaChange' }), Gt()],
  inject: { Item: { default: void 0 } },
  props: {
    autocapitalize: { type: String, default: 'none' },
    autofocus: Boolean,
    clearOnEdit: Boolean,
    disabled: Boolean,
    maxlength: Number,
    minlength: Number,
    placeholder: String,
    readonly: Boolean,
    required: Boolean,
    spellcheck: Boolean,
    cols: Number,
    rows: Number,
    wrap: String,
    autoGrow: Boolean,
  },
  data: () => ({ hasFocus: !1, didBlurAfterEdit: !1 }),
  beforeMount() {
    this.inputId = `line-input-${fh++}`;
  },
  mounted() {
    const { nativeInput: e } = this.$refs;
    (this.nativeInput = e), this.runAutoGrow(), this.emitStyle();
  },
  methods: {
    disabledChanged() {
      this.emitStyle();
    },
    runAutoGrow() {
      const { nativeInput: e } = this;
      e &&
        this.autoGrow &&
        this.$nextTick(() => {
          (e.style.height = 'inherit'),
            (e.style.height = `${e.scrollHeight}px`);
        });
    },
    async setFocus() {
      this.nativeInput && this.nativeInput.focus();
    },
    getInputElement() {
      return Promise.resolve(this.nativeInput);
    },
    emitStyle() {
      this.Item &&
        this.Item.itemStyle('textarea', {
          interactive: !0,
          textarea: !0,
          input: !0,
          'interactive-disabled': this.disabled,
          'has-placeholder': null != this.placeholder,
          'has-value': this.hasValue(),
          'has-focus': this.hasFocus,
        });
    },
    checkClearOnEdit() {
      this.clearOnEdit &&
        (this.didBlurAfterEdit && this.hasValue() && (this.nativeValue = ''),
        (this.didBlurAfterEdit = !1));
    },
    focusChange() {
      this.clearOnEdit &&
        !this.hasFocus &&
        this.hasValue() &&
        (this.didBlurAfterEdit = !0),
        this.emitStyle();
    },
    hasValue() {
      return '' !== this.getValue();
    },
    getValue() {
      return this.value || '';
    },
    onInput() {
      this.nativeInput && (this.nativeValue = this.nativeInput.value),
        this.emitStyle();
    },
    onFocus() {
      (this.hasFocus = !0), this.focusChange(), this.$emit('focus');
    },
    onBlur() {
      (this.hasFocus = !1), this.focusChange(), this.$emit('blur');
    },
    onChange() {},
    onKeyDown() {
      this.checkClearOnEdit();
    },
  },
  watch: {
    value() {
      this.runAutoGrow(), this.emitStyle();
    },
    disabled() {
      this.disabledChanged();
    },
  },
  render() {
    const e = arguments[0],
      {
        nativeValue: t,
        rows: i,
        maxlength: s,
        placeholder: n,
        readonly: a,
        disabled: r,
        autocapitalize: o,
        autofocus: l,
        cols: d,
        spellcheck: c,
        wrap: h,
        minlength: p,
      } = this,
      u = `${this.inputId}-lbl`,
      m = ((e) => {
        const t = e && e.closest('.line-item');
        return t ? t.querySelector('.line-label') : null;
      })(this.$el);
    return (
      m && (m.id = u),
      e('div', b([{ class: [mh()] }, { on: this.$listeners }]), [
        e(
          'textarea',
          {
            class: 'native-textarea',
            ref: 'nativeInput',
            attrs: {
              autoCapitalize: o,
              autoFocus: l,
              cols: d,
              rows: i,
              wrap: h,
              maxlength: s,
              minlength: p,
              placeholder: n || '',
              spellCheck: c,
              readonly: a,
              disabled: r,
            },
            on: {
              input: this.onInput,
              focus: this.onFocus,
              blur: this.onBlur,
              change:
                ((f = this.onChange),
                (e, ...t) => (e.stopPropagation(), f(e, ...t))),
            },
          },
          [t]
        ),
      ])
    );
    var f;
  },
});
const { createComponent: vh, bem: bh } = R('thumbnail');
var yh = vh({
  functional: !0,
  render: (e, { data: t, slots: i }) =>
    e('div', b([{ class: bh() }, t]), [i()]),
});
const { createComponent: wh, bem: xh } = R('toolbar');
var Sh = wh({
  functional: !0,
  props: { color: String },
  render(e, { props: t, data: i, slots: s }) {
    const { color: n } = t;
    return e('div', b([{ class: [xh(), Ft(n)] }, i]), [
      e('div', { class: xh('background') }),
      e('div', { class: xh('container') }, [
        s('start'),
        s('secondary'),
        e('div', { class: xh('content') }, [s()]),
        s('primary'),
        s('end'),
      ]),
    ]);
  },
});
const { createComponent: Eh, bem: Th } = R('title');
var $h = Eh({
    mixins: [Gt()],
    props: { size: String },
    render() {
      const e = arguments[0],
        { size: t } = this;
      return e(
        'div',
        b([{ class: Th({ [t]: c(t) }) }, { on: this.$listeners }]),
        [e('div', { class: Th('inner') }, [this.slots()])]
      );
    },
  }),
  Ch = Object.freeze({
    __proto__: null,
    ActionGroup: q,
    ActionSheetTitle: X,
    ActionSheet: xt,
    Action: mt,
    Alert: Mt,
    App: Rt,
    Avatar: qt,
    Badge: jt,
    BusyIndicator: Kt,
    ButtonGroup: ei,
    Button: li,
    CardContent: hi,
    CardHeader: mi,
    CardSubtitle: vi,
    CardTitle: wi,
    Card: Ei,
    CheckBoxGroup: Ii,
    CheckBox: Hi,
    CheckIndicator: zi,
    Chip: Yi,
    Col: ji,
    CollapseItemContent: Ki,
    CollapseItem: os,
    Collapse: cs,
    ComboBoxItem: us,
    ComboBox: En,
    Content: Pn,
    Datetime: Lr,
    Fab: Yr,
    FabButton: Gr,
    FabGroup: Nr,
    Footer: jr,
    Grid: Kr,
    Header: Qr,
    CheckGroup: io,
    CheckItem: ao,
    Lazy: lo,
    TreeItem: uo,
    FontIcon: Qi,
    Icon: ns,
    SvgIcon: is,
    Image: go,
    InfiniteScroll: yo,
    InfiniteScrollContent: So,
    Input: Co,
    Item: Io,
    ItemDivider: Oo,
    ItemGroup: zo,
    ItemOption: Ho,
    ItemOptions: Yo,
    ItemSliding: Wo,
    Label: Uo,
    List: Zo,
    ListHeader: tl,
    ListItem: nl,
    ListView: vl,
    Loading: Gn,
    Menu: kl,
    Note: Pl,
    Overlay: ht,
    Picker: Zn,
    PickerColumn: _n,
    Popover: aa,
    PopupLegacy: la,
    Popup: fa,
    ProgressBar: Dl,
    RadioGroup: Rl,
    RadioIndicator: ql,
    Radio: Xl,
    Range: Zl,
    Refresher: ld,
    RefresherContent: gd,
    Reorder: yd,
    ReorderGroup: Ed,
    Row: Cd,
    Segment: Id,
    SegmentButton: Od,
    SkeletonText: zd,
    Slide: Hd,
    Slides: Xc,
    Spinner: Nn,
    SwitchGroup: _c,
    SwitchIndicator: Jc,
    Switch: eh,
    TabBar: sh,
    TabButton: rh,
    Tab: dh,
    Tabs: ph,
    Textarea: gh,
    Thumbnail: yh,
    Toast: Ea,
    Toolbar: Sh,
    Title: $h,
    Tooltip: Aa,
  });
function kh(e, t) {
  const { instant: i } = t;
  e.classList.add('line-activatable'),
    i && e.classList.add('line-activatable-instant');
  return {
    destroy: () => {
      e.classList.remove('line-activatable'),
        i && e.classList.add('line-activatable-instant');
    },
  };
}
function Mh(e, t) {
  const { modifiers: i, value: s } = t;
  !1 !== s && (e.vActivatable = kh(e, i));
}
function Ih(e) {
  const { vActivatable: t } = e;
  t && (t.destroy(), delete e.vActivatable);
}
const Ph = J({
    name: 'activatable',
    inserted: Mh,
    unbind: Ih,
    update: function (e, t) {
      const { value: i, oldValue: s } = t;
      i !== s && (!1 !== s && Ih(e), Mh(e, t));
    },
  }),
  Ah = 300,
  Oh = 300;
function Bh(e, t) {
  let i,
    s,
    { enable: n = !0, interval: a = Oh, delay: r = Ah } = t;
  const o = (t) => {
      n &&
        (s = setTimeout(() => {
          i = setInterval(() => {
            const i = new MouseEvent('click', t);
            (i.repeat = !0), e.dispatchEvent(i);
          }, a);
        }, r));
    },
    l = () => {
      s && (clearTimeout(s), (s = null)), i && (clearInterval(i), (i = null));
    },
    d = (t) => {
      n &&
        (('isTrusted' in t && !t.isTrusted) ||
          ('pointerType' in t && !t.pointerType) ||
          (t.composedPath().some((t) => t === e) && o(t)));
    },
    c = document,
    h = { passive: !0 },
    p = ie(c, 'mousedown', d, h),
    u = ie(c, 'mouseup', l, h),
    m = ie(c, 'touchstart', d, h),
    f = ie(c, 'touchend', l, h),
    g = ie(c, 'touchcancel', l, h),
    v = ie(c, 'dragstart', l, h);
  return {
    enable: (e) => {
      (n = e), n || l();
    },
    update: (e) => {
      (n = !!e.enable), (a = e.interval || Oh), (r = e.delay || Ah);
    },
    start: o,
    stop: l,
    pointerDown: d,
    pointerUp: l,
    destroy: () => {
      l(), p(), u(), m(), f(), g(), v();
    },
  };
}
function Lh(e, t) {
  !1 !== t.value && (e.vAutoRepeat = Bh(e, t.value));
}
const zh = J({
  name: 'autorepeat',
  inserted: Lh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    if (i === s) return;
    const { vAutoRepeat: n } = e;
    n ? (n.stop(), n.update(t.value)) : Lh(e, t);
  },
  unbind: function (e) {
    const { vAutoRepeat: t } = e;
    t && (t.destroy(), delete e.vAutoRepeat);
  },
});
function Dh(e, t) {
  const { enabled: i = () => !0, include: s = () => [], callback: n } = t,
    a = (t) => {
      if (!t) return;
      if (!1 === i(t)) return;
      if (
        ('isTrusted' in t && !t.isTrusted) ||
        ('pointerType' in t && !t.pointerType)
      )
        return;
      const a = s();
      a.push(e), a.some((e) => e.contains(t.target)) || n(t);
    },
    r = pe(e),
    o = { passive: !0 },
    l = ie(r, 'mouseup', a, o),
    d = ie(r, 'touchend', a, o);
  return {
    maybe: a,
    destroy: () => {
      l(), d();
    },
  };
}
function Nh(e, t) {
  t.value && (e.vClickOutside = Dh(e, { ...t.args, callback: t.value }));
}
function Hh(e) {
  const { vClickOutside: t } = e;
  t && (t.destroy(), delete e.vClickOutside);
}
const Rh = J({
  name: 'click-outside',
  inserted: Nh,
  unbind: Hh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Hh(e), Nh(e, t));
  },
});
function Vh(e, t) {
  t.value && (e.vGesture = Ie({ ...t.value, el: e }));
}
function Yh(e) {
  const { vGesture: t } = e;
  t && (t.destroy(), delete e.vGesture);
}
const qh = J({
  name: 'gesture',
  inserted: Vh,
  unbind: Yh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Yh(e), Vh(e, t));
  },
});
function Fh(e, t) {
  const {
    handler: i,
    root: s,
    rootMargin: n,
    threshold: a,
    quiet: r,
    once: o,
  } = t;
  let d = !1;
  const c = new IntersectionObserver(
      (e = [], t) => {
        if (i && (!r || d)) {
          const s = e.some((e) => e.isIntersecting);
          i(e, t, s);
        }
        d && o ? h() : (d = !0);
      },
      {
        root: l(s) ? document.querySelector(s) : s,
        rootMargin: n,
        threshold: a,
      }
    ),
    h = () => {
      c.unobserve(e);
    };
  return c.observe(e), { observer: c, destroy: h };
}
function Gh(e, t) {
  const { value: i, arg: s, modifiers: n } = t;
  if (!i || !s) return;
  const a = d(i) ? i : { handler: i };
  e.vIntersect = Fh(e, { ...n, ...a, root: s || a.root });
}
function Xh(e) {
  const { vIntersect: t } = e;
  t && (t.destroy(), delete e.vIntersect);
}
const Wh = J({
  name: 'intersect',
  inserted: Gh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Xh(e), Gh(e, t));
  },
  unbind: Xh,
});
function jh(e, t) {
  const {
      handler: i,
      once: s,
      attributes: n = !0,
      childList: a = !0,
      subtree: r = !0,
      characterData: o = !0,
    } = t,
    l = new MutationObserver((e, t) => {
      i(e, t), s && d();
    }),
    d = () => {
      l.disconnect();
    };
  return (
    l.observe(e, { attributes: n, childList: a, subtree: r, characterData: o }),
    { observer: l, destroy: d }
  );
}
function _h(e, t) {
  const { value: i, modifiers: s } = t;
  if (!i) return;
  const n = d(i) ? i : { handler: i },
    { attr: a = !0, child: r = !0, sub: o = !0, char: l = !0, once: c } = s;
  e.vMutate = jh(e, {
    attributes: a,
    childList: r,
    subtree: o,
    characterData: l,
    once: c,
    ...n,
  });
}
function Uh(e) {
  const { vMutate: t } = e;
  t && (t.destroy(), delete e.vMutate);
}
const Kh = J({
  name: 'mutate',
  inserted: _h,
  unbind: Uh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Uh(e), _h(e, t));
  },
});
function Jh(e) {
  const { callback: t, immediate: i } = e,
    s = ie(window, 'resize', t, e);
  return (
    i && t(),
    {
      callback: t,
      options: e,
      destroy: () => {
        s();
      },
    }
  );
}
function Zh(e, t) {
  const { value: i, modifiers: s } = t;
  i && (e.vResize = Jh({ ...s, callback: i }));
}
function Qh(e) {
  const { vResize: t } = e;
  t && (t.destroy(), delete e.vResize);
}
const ep = J({
  name: 'resize',
  inserted: Zh,
  unbind: Qh,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Qh(e), Zh(e, t));
  },
});
function tp(e) {
  const t = window,
    { target: i = t, callback: s } = e,
    n = l(i) ? document.querySelector(i) || t : i,
    a = ie(n, 'scroll', s, e);
  return {
    options: e,
    target: i,
    destroy: () => {
      a();
    },
  };
}
function ip(e, t) {
  const { value: i, arg: s, modifiers: n } = t;
  i && (e.vScroll = tp({ passive: !0, ...n, target: s, callback: i }));
}
function sp(e) {
  const { vScroll: t } = e;
  t && (t.destroy(), delete e.vScroll);
}
const np = J({
    name: 'scroll',
    inserted: ip,
    unbind: sp,
    update: function (e, t) {
      const { value: i, oldValue: s } = t;
      i !== s && (s && sp(e), ip(e, t));
    },
  }),
  ap = (e, t, i, s, n) => {
    const a = e.ownerDocument.defaultView;
    return Ie({
      el: e,
      gestureName: 'goback-swipe',
      gesturePriority: 40,
      threshold: 10,
      canStart: (e) => e.startX <= 50 && t(),
      onStart: i,
      onMove: (e) => {
        s(e.deltaX / a.innerWidth);
      },
      onEnd: (e) => {
        const t = a.innerWidth,
          i = e.deltaX / t,
          s = e.velocityX,
          r = s >= 0 && (s > 0.2 || e.deltaX > t / 2),
          o = (r ? 1 - i : i) * t;
        let l = 0;
        if (o > 5) {
          const e = o / Math.abs(s);
          l = Math.min(e, 540);
        }
        n(r, i <= 0 ? 0.01 : Math.max(i, Math.min(0, 0.9999)), l);
      },
    });
  };
function rp(e, t) {
  const { value: n } = t;
  if (!n) return;
  const {
    canStartHandler: a = s,
    onStartHandler: r = i,
    onMoveHandler: o = i,
    onEndHandler: l = i,
  } = n;
  e.vSwipeBack = ap(e, a, r, o, l);
}
function op(e) {
  const { vSwipeBack: t } = e;
  t && (t.destroy(), delete e.vSwipeBack);
}
const lp = J({
  name: 'swipe-back',
  inserted: rp,
  unbind: op,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && op(e), rp(e, t));
  },
});
function dp(e, t) {
  const {
      text: i,
      delay: s = 300,
      placement: n,
      hover: a = !0,
      click: r,
      active: o,
    } = t,
    l = Va.create({
      trigger: e,
      text: i,
      delay: s,
      placement: n,
      openOnHover: a,
      openOnClick: r,
      activeFocus: o,
    });
  l.destroyWhenClose = !1;
  return {
    tooltip: l,
    destroy: () => {
      (l.destroyWhenClose = !0), l.close() || l.$destroy();
    },
  };
}
function cp(e) {
  const { vTooltip: t } = e;
  t && (t.destroy(), delete e.vTooltip);
}
const hp = J({
  name: 'tooltip',
  inserted: function (e, t) {
    const { value: i = '', modifiers: s } = t;
    if (!1 === i) return;
    const n = d(i) ? i : { text: i };
    e.vTooltip = dp(e, { ...s, ...n });
  },
  unbind: cp,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    if (i === s) return;
    if (!1 === i) return void cp(e);
    const { vTooltip: n } = e;
    n.tooltip.text = t.value;
  },
});
function pp(e, t) {
  const i = e.changedTouches[0];
  (t.touchendX = i.clientX),
    (t.touchendY = i.clientY),
    t.end && t.end(Object.assign(e, t)),
    ((e) => {
      const { touchstartX: t, touchendX: i, touchstartY: s, touchendY: n } = e;
      (e.offsetX = i - t),
        (e.offsetY = n - s),
        Math.abs(e.offsetY) < 0.5 * Math.abs(e.offsetX) &&
          (e.left && i < t - 16 && e.left(e),
          e.right && i > t + 16 && e.right(e)),
        Math.abs(e.offsetX) < 0.5 * Math.abs(e.offsetY) &&
          (e.up && n < s - 16 && e.up(e), e.down && n > s + 16 && e.down(e));
    })(t);
}
function up(e) {
  const t = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: e.left,
    right: e.right,
    up: e.up,
    down: e.down,
    start: e.start,
    move: e.move,
    end: e.end,
  };
  return {
    touchstart: (e) =>
      (function (e, t) {
        const i = e.changedTouches[0];
        (t.touchstartX = i.clientX),
          (t.touchstartY = i.clientY),
          t.start && t.start(Object.assign(e, t));
      })(e, t),
    touchend: (e) => pp(e, t),
    touchmove: (e) =>
      (function (e, t) {
        const i = e.changedTouches[0];
        (t.touchmoveX = i.clientX),
          (t.touchmoveY = i.clientY),
          t.move && t.move(Object.assign(e, t));
      })(e, t),
  };
}
function mp(e, t) {
  const { parent: i } = t,
    s = i ? e.parentElement || document.body : e,
    a = up(t);
  n(a).forEach((e) => {
    ie(s, e, a[e], t);
  });
  return {
    destroy: () => {
      n(a).forEach((e) => {
        te(s, e, a[e]);
      });
    },
  };
}
function fp(e, t) {
  const { value: i } = t;
  i && (e.vTouch = mp(e, i));
}
function gp(e) {
  const { vTouch: t } = e;
  t && (t.destroy(), delete e.vTouch);
}
const vp = J({
  name: 'touch',
  inserted: fp,
  unbind: gp,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && gp(e), fp(e, t));
  },
});
function bp(e) {
  return le(e) ? e.pageYOffset : e.scrollTop;
}
function yp(e) {
  return (le(e) ? 0 : e.getBoundingClientRect().top) + bp(window);
}
function wp(e) {
  return le(e) ? e.innerHeight : e.getBoundingClientRect().height;
}
const xp = 300;
function Sp(e, t) {
  const { handler: i, offset: s = xp, up: n = !0, down: a = !0 } = t,
    r = ae(e),
    o = () => {
      const t = bp(r),
        o = wp(r);
      if (!o) return;
      let l = !1,
        d = !1;
      if (a)
        if (e === r) l = r.scrollHeight - (t + o) < s;
        else {
          l = yp(e) - yp(r) + wp(e) - o < s;
        }
      if (n)
        if (e === r) d = t < s;
        else {
          d = yp(e) - yp(r) + s > 0;
        }
      ((l && a) || (d && n)) &&
        i &&
        i({ down: l, up: d, target: r, scrollTop: t });
    },
    l = ie(r, 'scroll', o, t);
  return {
    scroll: o,
    destroy: () => {
      l();
    },
  };
}
function Ep(e, t) {
  const { value: i, modifiers: s } = t;
  if (!i) return;
  const n = Sp(e, { ...s, ...(d(i) ? i : { handler: i }) });
  e.vWaterfall = n;
}
function Tp(e) {
  const { vWaterfall: t } = e;
  t && (t.destroy(), delete e.vWaterfall);
}
const $p = J({
  name: 'waterfall',
  inserted: Ep,
  unbind: Tp,
  update: function (e, t) {
    const { value: i, oldValue: s } = t;
    i !== s && (s && Tp(e), Ep(e, t));
  },
});
var Cp = Object.freeze({
  __proto__: null,
  createActivatable: kh,
  vActivatable: Ph,
  createAutoRepeat: Bh,
  vAutoRepeat: zh,
  createClickOutside: Dh,
  vClickOutside: Rh,
  vGesture: qh,
  createHover: $a,
  vHover: Ma,
  createIntersect: Fh,
  vIntersect: Wh,
  createMutate: jh,
  vMutate: Kh,
  createRemote: ue,
  vRemote: ge,
  createResize: Jh,
  vResize: ep,
  createRippleEffect: ii,
  vRipple: ai,
  createScroll: tp,
  vScroll: np,
  vSwipeBack: lp,
  createTooltip: dp,
  vTooltip: hp,
  createTouch: mp,
  vTouch: vp,
  createWaterfall: Sp,
  vWaterfall: $p,
});
function kp() {
  return O({
    beforeCreate() {
      const { $options: e } = this,
        { render: t } = e;
      let i,
        s = !1;
      const n = async (e) => {
        (s = !0),
          (i = await t.call(this, e, void 0)),
          this._update.call(this, i),
          (i = null),
          (s = !1);
      };
      e.render = (e) => (s || n.call(this, e), i);
    },
  });
}
function Mp(e, t = 'options') {
  return O({
    props: e.reduce((e, t) => ((e[t] = Boolean), e), {
      [t]: { type: String, validator: (t) => e.includes(t) },
    }),
    beforeRender() {
      const { $props: i } = this;
      let s = i[t];
      if (!s) for (const t of e) if (((s = i[t] ? t : s), s)) break;
      this[t] = s || e[0];
    },
  });
}
function Ip(e) {
  const { event: t = 'popstate', global: i = !0 } = e || {};
  return O({
    mixins: [gs({ global: i, event: t })],
    mounted() {
      this.$on('event-handler', (e) => {
        this.$emit('popstate', e), this.close();
      });
    },
  });
}
var Pp = Object.freeze({
  __proto__: null,
  useAsyncRender: kp,
  useBreakPoint: It,
  useCheckGroup: Ti,
  getItemValue: $i,
  useCheckGroupWithModel: Ci,
  useCheckItem: Pi,
  useCheckItemWithModel: Ai,
  useClickOutside: vs,
  useCollapseTransition: _i,
  createColorClasses: Ft,
  useColor: Gt,
  useEvent: gs,
  useGroupItem: ti,
  useGroup: Jt,
  useLazy: W,
  createModeClasses: D,
  useMode: N,
  useModel: U,
  useOptions: Mp,
  usePopstateClose: Ip,
  usePopupDelay: Ta,
  usePopupDuration: An,
  usePopup: ot,
  useRemote: ve,
  useRender: L,
  useRipple: Oi,
  useSlots: z,
  useTransition: Se,
  useTreeItem: co,
  isVue: ms,
  useTrigger: fs,
});
const Ap = { install: p, version: '1.0.0-alpha.2' };
function Op() {
  return (
    'undefined' != typeof window &&
      window.Vue &&
      p(window.Vue, { components: Ch, directives: Cp }),
    {
      install(e, t) {
        p(e, { components: Ch, directives: Cp, ...t });
      },
      components: Ch,
      directives: Cp,
      controllers: Ya,
      mixins: Pp,
      version: '1.0.0-alpha.2',
    }
  );
}
var Bp = Op();
export default Bp;
export {
  mt as Action,
  q as ActionGroup,
  xt as ActionSheet,
  Ba as ActionSheetController,
  X as ActionSheetTitle,
  Mt as Alert,
  La as AlertController,
  Rt as App,
  qt as Avatar,
  jt as Badge,
  Kt as BusyIndicator,
  li as Button,
  ei as ButtonGroup,
  Ei as Card,
  hi as CardContent,
  mi as CardHeader,
  vi as CardSubtitle,
  wi as CardTitle,
  Hi as CheckBox,
  Ii as CheckBoxGroup,
  io as CheckGroup,
  zi as CheckIndicator,
  ao as CheckItem,
  Yi as Chip,
  ji as Col,
  cs as Collapse,
  os as CollapseItem,
  Ki as CollapseItemContent,
  En as ComboBox,
  us as ComboBoxItem,
  Pn as Content,
  Lr as Datetime,
  Yr as Fab,
  Gr as FabButton,
  Nr as FabGroup,
  Qi as FontIcon,
  jr as Footer,
  Kr as Grid,
  Qr as Header,
  ns as Icon,
  go as Image,
  yo as InfiniteScroll,
  So as InfiniteScrollContent,
  Co as Input,
  Io as Item,
  Oo as ItemDivider,
  zo as ItemGroup,
  Ho as ItemOption,
  Yo as ItemOptions,
  Wo as ItemSliding,
  Uo as Label,
  lo as Lazy,
  Ap as Line,
  Zo as List,
  tl as ListHeader,
  nl as ListItem,
  vl as ListView,
  Gn as Loading,
  za as LoadingController,
  kl as Menu,
  Pl as Note,
  ht as Overlay,
  Zn as Picker,
  _n as PickerColumn,
  Da as PickerController,
  aa as Popover,
  Na as PopoverController,
  fa as Popup,
  Ha as PopupController,
  la as PopupLegacy,
  Dl as ProgressBar,
  Xl as Radio,
  Rl as RadioGroup,
  ql as RadioIndicator,
  Zl as Range,
  ld as Refresher,
  gd as RefresherContent,
  yd as Reorder,
  Ed as ReorderGroup,
  Cd as Row,
  Id as Segment,
  Od as SegmentButton,
  zd as SkeletonText,
  Hd as Slide,
  Xc as Slides,
  Nn as Spinner,
  is as SvgIcon,
  eh as Switch,
  _c as SwitchGroup,
  Jc as SwitchIndicator,
  dh as Tab,
  sh as TabBar,
  rh as TabButton,
  ph as Tabs,
  gh as Textarea,
  yh as Thumbnail,
  $h as Title,
  Ea as Toast,
  Ra as ToastController,
  Sh as Toolbar,
  Aa as Tooltip,
  Va as TooltipController,
  uo as TreeItem,
  kh as createActivatable,
  it as createAnimation,
  Bh as createAutoRepeat,
  x as createBEM,
  Dh as createClickOutside,
  Ft as createColorClasses,
  $a as createHover,
  Fh as createIntersect,
  D as createModeClasses,
  jh as createMutate,
  R as createNamespace,
  ue as createRemote,
  Jh as createResize,
  ii as createRippleEffect,
  tp as createScroll,
  dp as createTooltip,
  mp as createTouch,
  Sp as createWaterfall,
  H as defineComponent,
  $i as getItemValue,
  st as getTimeGivenProgression,
  ms as isVue,
  kp as useAsyncRender,
  It as useBreakPoint,
  Ti as useCheckGroup,
  Ci as useCheckGroupWithModel,
  Pi as useCheckItem,
  Ai as useCheckItemWithModel,
  vs as useClickOutside,
  _i as useCollapseTransition,
  Gt as useColor,
  gs as useEvent,
  Jt as useGroup,
  ti as useGroupItem,
  W as useLazy,
  N as useMode,
  U as useModel,
  Mp as useOptions,
  Ip as usePopstateClose,
  ot as usePopup,
  Ta as usePopupDelay,
  An as usePopupDuration,
  ve as useRemote,
  L as useRender,
  Oi as useRipple,
  z as useSlots,
  Se as useTransition,
  co as useTreeItem,
  fs as useTrigger,
  Ph as vActivatable,
  zh as vAutoRepeat,
  Rh as vClickOutside,
  qh as vGesture,
  Ma as vHover,
  Wh as vIntersect,
  Kh as vMutate,
  ge as vRemote,
  ep as vResize,
  ai as vRipple,
  np as vScroll,
  lp as vSwipeBack,
  hp as vTooltip,
  vp as vTouch,
  $p as vWaterfall,
};
