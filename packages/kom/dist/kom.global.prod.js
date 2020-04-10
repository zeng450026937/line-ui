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
    match(t = '') {
      return !this.ns || t.startsWith(this.ns);
    }
    use(t, s, e) {
      const i = s ? this.createHandler(t, s, e) : t;
      return this.middleware.push(i), this;
    }
    callback() {
      return (t, s) =>
        this.match(r(t.ns, t.path))
          ? e(this.middleware)(t, s)
          : s
          ? s()
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
      return (i, o) =>
        r(this.ns, t) !== r(i.ns, i.path) ? o() : s.call(e, i, o);
    }
  }
  const r = (...t) => t.join('/').split('/').filter(Boolean).join('/');
  let o;
  class n extends i {
    constructor(t) {
      super(t),
        (this.submodel = {}),
        (this.mixins = []),
        (this.data = {}),
        (this.computed = {}),
        (this.watch = {}),
        (this.events = {}),
        (this.d = {}),
        o ||
          (!(function () {
            const t = s.config.optionMergeStrategies;
            (t.middleware = t.methods), (t.subscribe = t.methods);
          })(),
          (o = !0));
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
      return s || ((s = new n()), this.mount(t, s)), s;
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
      const { submodel: s } = this;
      return t ? a(t, s) : s;
    }
    getStore(t) {
      const { store: s } = this;
      return t ? a(t, s) : s;
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
      return r(this.ns, t);
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
    a = (t, s) => t.split('/').reduce((t, s) => t && t[s], s),
    c = (t, s = !1) => {
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
    d = (t = s) => {
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
              h(e).forEach((i) => {
                const r = e[i].bind(this);
                t.push(() => ((t, e) => s.store.$root.$off(t, e))(i, r)),
                  this.$subscribe(i, r);
              }),
                (this.__komDispose__ = t);
            }
            i && (t.computed = { ...t.computed, ...c(i) });
          },
          beforeDestroy() {
            const t = this.__komDispose__;
            t && t.forEach((t) => t());
          },
        }),
        (t.__kom__ = !0));
    };
  function u() {
    return (
      'undefined' != typeof window && window.Vue && d(window.Vue),
      { install: d }
    );
  }
  var l = u();
  return (
    (t.Layer = i),
    (t.Model = n),
    (t.compose = e),
    (t.default = l),
    (t.install = d),
    (t.mapStore = c),
    t
  );
})({}, Vue);
