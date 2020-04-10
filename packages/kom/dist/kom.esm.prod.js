import t from 'vue';
function s(t) {
  return function (s, e) {
    const i = async (r) => {
      let o = t[r];
      if ((r === t.length && (o = e), o)) return o(s, i.bind(null, r + 1));
    };
    return i(0);
  };
}
class e {
  constructor(t = '') {
    (this.ns = t), (this.middleware = []);
  }
  match(t = '') {
    return !this.ns || t.startsWith(this.ns);
  }
  use(t, s, e) {
    const i = s ? this.createHandler(t, s, e) : t;
    return this.middleware.push(i), this;
  }
  callback() {
    return (t, e) =>
      this.match(i(t.ns, t.path))
        ? s(this.middleware)(t, e)
        : e
        ? e()
        : Promise.resolve();
  }
  dispatch(t, s) {
    const e = this.createContext();
    return (e.path = t), (e.payload = s || {}), this.callback()(e);
  }
  createContext(t = this.ns) {
    return { ns: t };
  }
  createHandler(t, s, e) {
    return (r, o) =>
      i(this.ns, t) !== i(r.ns, r.path) ? o() : s.call(e, r, o);
  }
}
const i = (...t) => t.join('/').split('/').filter(Boolean).join('/');
let r;
class o extends e {
  constructor(s) {
    super(s),
      (this.submodel = {}),
      (this.mixins = []),
      (this.data = {}),
      (this.computed = {}),
      (this.watch = {}),
      (this.events = {}),
      (this.d = {}),
      r ||
        (!(function () {
          const s = t.config.optionMergeStrategies;
          (s.middleware = s.methods), (s.subscribe = s.methods);
        })(),
        (r = !0));
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
    return (
      s.setNS(this.genNS(t)), s.setParent(this), (this.submodel[t] = s), this
    );
  }
  model(t) {
    if (!t) return this;
    let s = this.submodel[t];
    return s || ((s = new o()), this.mount(t, s)), s;
  }
  up() {
    return this.parent || this;
  }
  provide(t, s) {
    return (
      t && !s && (this.mixins.push(t), (t = '')),
      t
        ? ('function' == typeof s ? (this.computed[t] = s) : (this.data[t] = s),
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
      : ((this.events[t] = this.events[t] || []), this.events[t].push(s), this);
  }
  broadcast(t, ...s) {
    return this.initialized() ? (this.store.$root.$emit(t, ...s), this) : this;
  }
  getModel(t) {
    const { submodel: s } = this;
    return t ? n(t, s) : s;
  }
  getStore(t) {
    const { store: s } = this;
    return t ? n(t, s) : s;
  }
  setNS(t = '') {
    (this.ns = t),
      Object.keys(this.submodel).forEach((t) => {
        this.submodel[t].setNS(this.genNS(t));
      });
  }
  setParent(t) {
    this.parent = t;
  }
  genNS(t = '') {
    return i(this.ns, t);
  }
  genVM(s) {
    const e = this;
    return new t({
      parent: s,
      mixins: this.mixins,
      data: this.data,
      computed: this.computed,
      watch: this.watch,
      beforeCreate() {
        (this.$kom = e.root),
          (this.$model = e),
          (this.$store = e.store),
          (this.$getModel = e.getModel.bind(e)),
          (this.$getStore = e.getStore.bind(e)),
          (this.$dispatch = e.dispatch.bind(e)),
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
      s && h(s).forEach((t) => this.use(t, s[t], this.store)),
      e && h(e).forEach((t) => this.subscribe(t, e[t])),
      h(this.events).forEach((t) => {
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
const h = (t) => Object.keys(t),
  n = (t, s) => t.split('/').reduce((t, s) => t && t[s], s),
  a = (t, s = !1) => {
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
        h(o).forEach((t) => {
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
  c = (s = t) => {
    s.__kom__ ||
      (s.mixin({
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
            h(e).forEach((i) => {
              const r = e[i].bind(this);
              t.push(() => ((t, e) => s.store.$root.$off(t, e))(i, r)),
                this.$subscribe(i, r);
            }),
              (this.__komDispose__ = t);
          }
          i && (t.computed = { ...t.computed, ...a(i) });
        },
        beforeDestroy() {
          const t = this.__komDispose__;
          t && t.forEach((t) => t());
        },
      }),
      (s.__kom__ = !0));
  };
function d() {
  return (
    'undefined' != typeof window && window.Vue && c(window.Vue), { install: c }
  );
}
var u = d();
export default u;
export { e as Layer, o as Model, s as compose, c as install, a as mapStore };
