var Kom = (function (t, s) {
  'use strict';
  function e(t) {
    return function (s, e) {
      const i = async (r) => {
        let o = t[r];
        if ((r === t.length && (o = e), o)) return o(s, i.bind(null, r + 1));
      };
      return i(0);
    };
  }
  s = s && Object.prototype.hasOwnProperty.call(s, 'default') ? s.default : s;
  class i {
    constructor(t = '') {
      (this.ns = t), (this.middleware = []);
    }
    use(t, s, e) {
      const i = s ? r(t, s, e) : t;
      return this.middleware.push(i), this;
    }
    callback() {
      return (t, s) => {
        const i = t.push(this.ns);
        if (i) {
          const r = s ? async () => (i(), s()) : s;
          return e(this.middleware)(t, r);
        }
        return s ? s() : Promise.resolve();
      };
    }
    dispatch(t, s) {
      const e = this.createContext();
      (e.path = t), (e.payload = s || {});
      const i = `${this.ns}/${t}`.split('/').filter(Boolean);
      let r = 0;
      return (
        (e.push = (t) =>
          t && i.length
            ? r < i.length && t === i[r]
              ? (r++,
                () => {
                  r--;
                })
              : void 0
            : () => {}),
        (e.match = (t) => i[r] === t && r === i.length - 1),
        this.callback()(e)
      );
    }
    createContext(t = this.ns) {
      return { ns: t };
    }
  }
  const r = (t, s, e) => (i, r) => (i.match(t) ? s.call(e, i, r) : r()),
    o = s.nextTick;
  let n;
  class h extends i {
    constructor(t) {
      super(t),
        (this.submodel = {}),
        (this.mixins = []),
        (this.data = {}),
        (this.computed = {}),
        (this.watch = {}),
        (this.events = {}),
        (this.d = {}),
        n ||
          (!(function () {
            const t = s.config.optionMergeStrategies;
            (t.middleware = t.methods), (t.subscribe = t.methods);
          })(),
          (n = !0));
    }
    get(t) {
      return this.d[t];
    }
    set(t, s) {
      this.d[t] = s;
    }
    get root() {
      return this.parent ? this.parent.root : this;
    }
    initialized() {
      return !!this.store;
    }
    mount(t, s) {
      return s.setNS(t), (this.submodel[t] = s), this;
    }
    model(t, s) {
      if (!t) return this;
      let e = this.submodel[t];
      return (
        e ||
          ((e = s || new h()),
          e.setNS(t),
          e.setParent(this),
          (this.submodel[t] = e)),
        e
      );
    }
    up() {
      return this.parent || this;
    }
    provide(t, s) {
      return (
        t && !s && (this.mixins.push(t), (t = '')),
        t
          ? ('function' == typeof s
              ? (this.computed[t] = s)
              : (this.data[t] = s),
            this)
          : this
      );
    }
    hook(t, s) {
      return this.initialized()
        ? (this.store.$watch(t, s), this)
        : ((this.watch[t] = s), this);
    }
    subscribe(t, s) {
      return this.initialized()
        ? (this.store.$root.$on(t, s), this)
        : ((this.events[t] = this.events[t] || []),
          this.events[t].push(s),
          this);
    }
    broadcast(t, ...s) {
      return this.initialized()
        ? (this.store.$root.$emit(t, ...s), this)
        : this;
    }
    getModel(t) {
      return t ? a(t, this, (t) => t.submodel) : this;
    }
    getStore(t) {
      const { store: s } = this;
      return t ? a(t, s) : s;
    }
    setNS(t = '') {
      this.ns = t;
    }
    setParent(t) {
      this.parent = t;
    }
    genVM(t) {
      const e = this;
      return new s({
        parent: t,
        mixins: this.mixins,
        data: this.data,
        computed: this.computed,
        watch: this.watch,
        beforeCreate() {
          (this.$kom = e.root),
            (this.$model = e),
            (this.$store = e.store),
            (this.$getModel = e.getModel.bind(e.root)),
            (this.$getStore = e.getStore.bind(e.root)),
            (this.$dispatch = e.dispatch.bind(e.root)),
            (this.$broadcast = e.broadcast.bind(e)),
            (this.$subscribe = e.subscribe.bind(e));
        },
      });
    }
    init() {
      if (this.initialized()) return this;
      const t = Object.keys(this.submodel);
      t.forEach((t) => {
        this.data[t] = {};
      }),
        (this.store = this.genVM(this.parent && this.parent.store));
      const { middleware: s, subscribe: e } = this.store.$options;
      return (
        s && c(s).forEach((t) => this.use(t, s[t], this.store)),
        e && c(e).forEach((t) => this.subscribe(t, e[t])),
        c(this.events).forEach((t) => {
          this.events[t].forEach((s) => this.subscribe(t, s));
        }),
        t.forEach((t) => {
          const s = this.submodel[t];
          s.init(), this.use(s.callback()), (this.data[t] = s.store);
        }),
        this
      );
    }
    destroy() {
      this.initialized() &&
        (Object.keys(this.submodel).forEach((t) => this.submodel[t].destroy()),
        this.store.$destroy());
    }
    createContext() {
      const t = super.createContext();
      return (
        (t.model = this),
        (t.store = this.store),
        (t.getModel = this.getModel.bind(this)),
        (t.getStore = this.getStore.bind(this)),
        (t.get = this.get.bind(this)),
        (t.set = this.set.bind(this)),
        t
      );
    }
  }
  const c = (t) => Object.keys(t),
    a = (t, s, e) =>
      t.split('/').reduce((t, s) => (e && (t = e(t, s)), !!t && t[s]), s),
    d = (t, s = !1) => {
      const e = {};
      return (
        Array.isArray(t) || (t = [t]),
        t.forEach((t) => {
          const { ns: i, state: r } = t;
          s &&
            i &&
            (e[i] = function () {
              return this.$getStore(i);
            });
          const o = ((t) => (
            Array.isArray(t) && (t = t.reduce((t, s) => ((t[s] = s), t), {})), t
          ))(r);
          c(o).forEach((t) => {
            const s = o[t];
            e[t] = {
              get() {
                const t = this.$getStore(i);
                return 'function' == typeof s ? s.call(this, t) : t[s];
              },
              set(s) {
                this.$getStore(i)[t] = s;
              },
            };
          });
        }),
        e
      );
    },
    u = (t = s) => {
      t.__kom__ ||
        (t.mixin({
          beforeCreate() {
            const t = this.$options,
              s = t.kom || (t.parent && t.parent.$kom);
            if (!s) return;
            s.init(),
              (this.$kom = s),
              (this.$model = s),
              (this.$store = s.store),
              (this.$getModel = s.getModel.bind(s)),
              (this.$getStore = s.getStore.bind(s)),
              (this.$dispatch = s.dispatch.bind(s)),
              (this.$broadcast = s.broadcast.bind(s)),
              (this.$subscribe = s.subscribe.bind(s));
            const { subscribe: e, store: i } = t;
            if (e) {
              const t = [];
              c(e).forEach((i) => {
                const r = e[i].bind(this);
                t.push(() => ((t, e) => s.store.$root.$off(t, e))(i, r)),
                  this.$subscribe(i, r);
              }),
                (this.__komDispose__ = t);
            }
            i && (t.computed = { ...t.computed, ...d(i) });
          },
          beforeDestroy() {
            const t = this.__komDispose__;
            t && t.forEach((t) => t());
          },
        }),
        (t.__kom__ = !0));
    };
  function l() {
    return (
      'undefined' != typeof window && window.Vue && u(window.Vue),
      { install: u }
    );
  }
  var b = l();
  return (
    (t.Layer = i),
    (t.Model = h),
    (t.compose = e),
    (t.default = b),
    (t.install = u),
    (t.mapStore = d),
    (t.nextTick = o),
    t
  );
})({}, Vue);
