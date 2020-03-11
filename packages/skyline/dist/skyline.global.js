var Skyline = (function (exports, Vue) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  const camelizeRE = /-(\w)/g;
  // hyphenate => camel
  const camelize = (str) => {
      return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
  };
  const hyphenateRE = /\B([A-Z])/g;
  // camel => hyphenate
  const hyphenate = (str) => {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
  };

  const debounce = (fn, delay = 300) => {
      let timer;
      return ((...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => fn(...args), delay);
      });
  };
  const EMPTY_OBJ =  Object.freeze({})
      ;
  const NOOP = () => { };
  /**
   * Always return false.
   */
  const NO = () => false;
  const keys = (o) => {
      return Object.keys(o);
  };
  const { hasOwnProperty } = Object.prototype;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const { isArray } = Array;
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isObject = (val) => typeof val === 'object' && val !== null;
  const isDef = (val) => val !== undefined && val !== null;

  function install(Vue, opts = {}) {
      const { components, directives, } = opts;
      if (components) {
          keys(components).forEach(key => {
              Vue.use(components[key]);
          });
      }
      if (directives) {
          keys(directives).forEach(key => {
              Vue.directive(hyphenate(key), directives[key]);
              Vue.directive(key, directives[key]);
          });
      }
  }

  /**
   * bem helper
   * b() // 'button'
   * b('text') // 'button__text'
   * b({ disabled }) // 'button button--disabled'
   * b('text', { disabled }) // 'button__text button__text--disabled'
   * b(['disabled', 'primary']) // 'button button--disabled button--primary'
   */
  const ELEMENT = '__';
  const MODS = '--';
  function join(name, el, symbol) {
      return el ? name + symbol + el : name;
  }
  function prefix(name, mods) {
      if (typeof mods === 'string') {
          return join(name, mods, MODS);
      }
      if (Array.isArray(mods)) {
          return mods.map(item => prefix(name, item));
      }
      const ret = {};
      if (mods) {
          Object.keys(mods).forEach((key) => {
              ret[name + MODS + key] = mods[key];
          });
      }
      return ret;
  }
  function createBEM(name) {
      return function (el, mods) {
          if (el && typeof el !== 'string') {
              mods = el;
              el = '';
          }
          el = join(name, el, ELEMENT);
          return mods ? [el, prefix(el, mods)] : el;
      };
  }

  const mergeClass = (exist, value) => {
      if (!value)
          return exist;
      if (!exist)
          return value;
      return [exist, value];
  };
  const mergeStaticClass = (exist, value) => {
      return exist
          ? value
              ? (`${exist} ${value}`)
              : exist
          : (value || '');
  };
  const renderClass = (staticClass, dynamicClass) => {
      if (!isDef(staticClass) && !isDef(dynamicClass))
          return '';
      return mergeStaticClass(staticClass, stringifyClass(dynamicClass));
  };
  const stringifyClass = (value) => {
      if (isArray(value)) {
          return stringifyArray(value);
      }
      if (isObject(value)) {
          return stringifyObject(value);
      }
      if (isString(value)) {
          return value;
      }
      /* istanbul ignore next */
      return '';
  };
  function stringifyArray(value) {
      let res = '';
      let stringified;
      for (let i = 0, l = value.length; i < l; i++) {
          stringified = stringifyClass(value[i]);
          if (isDef(stringified) && stringified !== '') {
              if (res)
                  res += ' ';
              res += stringified;
          }
      }
      return res;
  }
  function stringifyObject(value) {
      let res = '';
      for (const key in value) {
          if (value[key]) {
              if (res)
                  res += ' ';
              res += key;
          }
      }
      return res;
  }

  function mergeListener(exist, value) {
      if (!value)
          return exist;
      if (!exist)
          return value;
      const listener = { ...exist };
      // eslint-disable-next-line
      for (const key in value) {
          const old = exist[key];
          const val = value[key];
          listener[key] = old ? [].concat(old, val) : val;
      }
      return listener;
  }

  function mergeData(exist, value) {
      if (!value)
          return exist;
      if (!exist)
          return value;
      const data = { ...exist };
      // eslint-disable-next-line
      for (const key in value) {
          const old = exist[key];
          const val = value[key];
          switch (key) {
              case 'class':
                  data[key] = mergeClass(old, val);
                  break;
              case 'staticClass':
                  data[key] = mergeStaticClass(old, val);
                  break;
              case 'on':
              case 'nativeOn':
                  data[key] = mergeListener(old, val);
                  break;
              default:
                  data[key] = isArray(old)
                      ? old.concat(val)
                      : isObject(val)
                          ? { ...old, ...val }
                          : val;
          }
      }
      return data;
  }

  function createSlots(context, functional = true) {
      const prefix = functional ? '' : '$';
      const attrsKey = `${prefix}attrs`;
      const slotsKey = `${prefix}slots`;
      const scopedSlotsKey = `${prefix}scopedSlots`;
      function extrieve() {
          return {
              $slots: context[slotsKey],
              $scopedSlots: (context[scopedSlotsKey] || context[attrsKey] || {}),
          };
      }
      return {
          hasSlot: (name = 'default') => {
              const { $slots, $scopedSlots } = extrieve();
              return !!$scopedSlots[name] || !!$slots[name];
          },
          slots: (name = 'default', ctx, patch) => {
              // IMPORTANT
              //
              // if children is not SCOPED slot
              // $slots is updated when Vue needs update child component
              //
              // $scopedSlots is also updated before render
              //
              // we have to extrieve $slots/$scopedSlots everytime we wanna use it
              const { $slots, $scopedSlots } = extrieve();
              const scopedSlot = $scopedSlots[name];
              const vnodes = scopedSlot ? scopedSlot(ctx) : $slots[name];
              if (vnodes) {
                  const slotclass = {
                      slotted: true,
                      [`slot-${name}`]: name !== 'default',
                  };
                  vnodes.forEach((vnode, index) => {
                      if (!vnode.data)
                          return;
                      if (!vnode.data.__slotted) {
                          vnode.data = mergeData(vnode.data, { class: slotclass });
                          vnode.data.__slotted = true;
                      }
                      if (!patch)
                          return;
                      if (!vnode.data.__patched) {
                          vnode.data = mergeData(vnode.data, isFunction(patch) ? patch(vnode.data, index) : patch);
                          vnode.data.__patched = true;
                      }
                  });
              }
              return vnodes;
          },
      };
  }
  function unifySlots(context) {
      const injections = createSlots(context);
      return new Proxy(context, {
          get(target, key, receiver) {
              if (hasOwn(injections, key)) {
                  return injections[key];
              }
              return Reflect.get(target, key, receiver);
          },
      });
  }

  /* eslint-disable import/extensions, max-len */
  function createMixins(options) {
      return Vue.extend(options);
  }

  function setupStrategies() {
      const strategies = Vue.config.optionMergeStrategies;
      strategies.shouldRender; // default strategy
      strategies.beforeRender = strategies.created;
      strategies.afterRender = strategies.created;
  }
  function useRender(keep = true) {
      // TODO
      // setupStrategies() should only called once
      // find some way to prevent calling multiple times
      setupStrategies();
      return createMixins({
          beforeCreate() {
              const { $options: options, } = this;
              const { shouldRender, beforeRender, afterRender, render, } = options;
              let snapshot;
              options.render = (h) => {
                  if (shouldRender && !shouldRender.call(this)) {
                      return keep ? snapshot : h();
                  }
                  if (beforeRender) {
                      beforeRender
                          .forEach(fn => fn.call(this));
                  }
                  let vnode = render.call(this, h, undefined);
                  if (afterRender) {
                      afterRender
                          .forEach(fn => vnode = fn.call(this, vnode) || vnode);
                  }
                  if (keep) {
                      snapshot = vnode;
                  }
                  return vnode;
              };
          },
      });
  }

  function useSlots() {
      return createMixins({
          created() {
              const injections = createSlots(this, false);
              this.hasSlot = injections.hasSlot;
              this.slots = injections.slots;
          },
      });
  }

  function createModeClasses(mode) {
      if (!mode)
          return undefined;
      return {
          [mode]: true,
      };
  }
  // root component provide 'mode' as default 'mode' for all components
  function useMode(fallback = 'ios') {
      return createMixins({
          inject: {
              providedMode: {
                  from: 'mode',
                  default: fallback,
              },
          },
          props: {
              mode: {
                  type: String,
                  default() {
                      return this.providedMode;
                  },
              },
          },
          afterRender(vnode) {
              if (!vnode.data)
                  return;
              vnode.data.staticClass = mergeStaticClass(vnode.data.staticClass, this.mode);
          },
      });
  }

  function install$1(Vue) {
      const { name } = this;
      // kebab case(hyphenate)
      Vue.component(name, this);
      // pascal case
      Vue.component(camelize(`-${name}`), this);
  }
  function defineComponent(name) {
      return function (sfc) {
          sfc.name = name;
          sfc.install = install$1;
          if (sfc.functional) {
              const { render } = sfc;
              sfc.render = (h, ctx) => render.call(undefined, h, unifySlots(ctx));
          }
          else {
              sfc.mixins = sfc.mixins || [];
              sfc.mixins.push(
              // enhance render function
              // provide shouldRender/beforeRender/afterRender lifecycle hooks
              useRender(), 
              // unify slots function, scoped first,
              // inject special slot class for slots
              useSlots(), 
              // inherit mode property from root component
              useMode());
          }
          return sfc;
      };
  }

  function createNamespace(name, prefix = 'line') {
      name = `${prefix}-${name}`;
      return {
          createComponent: defineComponent(name),
          bem: createBEM(name),
      };
  }

  function useGroup(name) {
      return createMixins({
          provide() {
              return {
                  [name]: this,
              };
          },
          data() {
              return {
                  items: [],
              };
          },
          methods: {
              registerItem(item) {
                  this.$nextTick().then(() => this.$emit('item:register', item));
                  return this.items.push(item);
              },
              unregisterItem(item) {
                  this.$nextTick().then(() => this.$emit('item:unregister', item));
                  this.items.splice(this.items.indexOf(item), 1);
              },
          },
      });
  }

  const NAMESPACE = 'ActionGroup';
  const {
    createComponent,
    bem
  } =
  /*#__PURE__*/
  createNamespace('action-group');
  var actionGroup = /*#__PURE__*/
  createComponent({
    mixins: [
    /*#__PURE__*/
    useGroup(NAMESPACE)],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem()
      }, [this.slots()]);
    }

  });

  function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

  function useGroupItem(name) {
      return createMixins({
          inject: {
              [name]: {
                  default: undefined,
              },
          },
          beforeMount() {
              this.itemIndex = 0;
              this.itemInGroup = false;
              const group = this[name];
              if (group) {
                  // Notice:
                  // item index start from 1 not 0
                  this.itemIndex = group.registerItem(this);
                  this.itemInGroup = true;
              }
          },
          beforeDestroy() {
              const group = this[name];
              if (group) {
                  group.unregisterItem(this);
              }
              this.itemIndex = 0;
              this.itemInGroup = false;
          },
      });
  }

  const PADDING = 10;
  const INITIAL_ORIGIN_SCALE = 0.5;
  const removeRipple = (ripple, effect) => {
      ripple.classList.add('fade-out');
      setTimeout(() => {
          effect && effect.remove();
          ripple.remove();
      }, 200);
  };
  function createRippleEffect(el, options) {
      const { unbounded = false } = options;
      function addRipple(x, y) {
          return new Promise((resolve) => {
              const rect = el.getBoundingClientRect();
              const { width } = rect;
              const { height } = rect;
              const hypotenuse = Math.sqrt(width * width + height * height);
              const maxDim = Math.max(height, width);
              const maxRadius = unbounded ? maxDim : hypotenuse + PADDING;
              const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
              const finalScale = maxRadius / initialSize;
              let posX = x - rect.left;
              let posY = y - rect.top;
              if (unbounded) {
                  posX = width * 0.5;
                  posY = height * 0.5;
              }
              const styleX = posX - initialSize * 0.5;
              const styleY = posY - initialSize * 0.5;
              const moveX = width * 0.5 - posX;
              const moveY = height * 0.5 - posY;
              const ripple = document.createElement('div');
              ripple.classList.add('ripple');
              const { style } = ripple;
              style.top = `${styleY}px`;
              style.left = `${styleX}px`;
              style.width = style.height = `${initialSize}px`;
              style.setProperty('--final-scale', `${finalScale}`);
              style.setProperty('--translate-end', `${moveX}px, ${moveY}px`);
              const effect = document.createElement('div');
              effect.classList.add('ripple-effect');
              if (unbounded) {
                  effect.classList.add('unbounded');
              }
              effect.appendChild(ripple);
              const container = el;
              container.appendChild(effect);
              setTimeout(() => {
                  resolve(() => {
                      removeRipple(ripple, effect);
                  });
              }, 225 + 100);
          });
      }
      return {
          addRipple,
          options,
      };
  }
  function inserted(el, binding) {
      const { modifiers, value } = binding;
      if (value === false)
          return;
      el.vRipple = createRippleEffect(el, modifiers);
  }
  function unbind(el, binding) {
      const { vRipple } = el;
      if (!vRipple)
          return;
      delete el.vRipple;
  }
  function update(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue !== false) {
          unbind(el);
      }
      inserted(el, binding);
  }
  const Ripple = {
      inserted,
      update,
      unbind,
  };

  function useRipple() {
      return createMixins({
          directives: {
              ripple: Ripple,
          },
          props: {
              ripple: {
                  type: Boolean,
                  // default should be platform specified
                  default: false,
              },
          },
          afterRender(vnode) {
              vnode.data = vnode.data || {};
              (vnode.data.directives || (vnode.data.directives = [])).push({
                  name: 'ripple',
                  value: this.ripple,
              });
          },
      });
  }

  const NAMESPACE$1 = 'ActionGroup';
  const {
    createComponent: createComponent$1,
    bem: bem$1
  } =
  /*#__PURE__*/
  createNamespace('action');
  var action = /*#__PURE__*/
  createComponent$1({
    mixins: [
    /*#__PURE__*/
    useGroupItem(NAMESPACE$1),
    /*#__PURE__*/
    useRipple()],
    props: {
      // This property holds a textual description of the action.
      text: String,
      // This property holds a icon description of the action.
      icon: [String, Object],
      // override default
      checkable: {
        type: Boolean,
        default: false
      }
    },

    beforeMount() {
      this.$on('clicked', (...args) => {
        this.$emit('triggered', ...args);
      });
    },

    methods: {
      trigger() {
        if (!this.disabled) return;
        this.$emit('triggered');
      }

    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$1({
          checked: this.checked,
          disabled: this.disabled
        })
      }, {
        "on": this.$listeners
      }]), [this.slots() || this.text]);
    }

  });

  const DEFAULT_VALUE = 'value';
  function useLazy(value = DEFAULT_VALUE) {
      return createMixins({
          props: {
              lazy: {
                  type: Boolean,
                  default: true,
              },
          },
          data() {
              return {
                  inited: !!this[value],
              };
          },
          watch: {
              [value]() {
                  this.inited = this.inited || !!this[value];
              },
          },
          shouldRender() {
              return this.inited || !this.lazy;
          },
      });
  }

  const DEFAULT_PROP = 'value';
  const DEFAULT_EVENT = 'change';
  function useModel(proxy, options = {}, defined = false) {
      const { prop = DEFAULT_PROP, event = DEFAULT_EVENT, default: defaultValue, } = options;
      return createMixins({
          model: { prop, event },
          props: {
              [prop]: {
                  default: defaultValue,
              },
          },
          data() {
              return defined ? {} : {
                  [proxy]: this[prop],
              };
          },
          watch: {
              [prop](val) {
                  this[proxy] = val;
              },
              [proxy](val) {
                  val !== this[prop] && this.$emit(event, val);
              },
          },
          created() {
              if (!isDef(this[prop]))
                  return;
              this[proxy] = this[prop];
          },
      });
  }

  const CONTAINER = '[skyline-app]';
  function inserted$1(el, binding) {
      if (binding.value === false)
          return;
      const container = binding.arg || CONTAINER;
      const containerEl = el.closest(container) || document.querySelector(container) || document.body;
      if (containerEl) {
          el.vRemote = {
              parentElement: el.parentElement,
              nextElementSibling: el.nextElementSibling,
          };
          containerEl.appendChild(el);
      }
  }
  function unbind$1(el, binding) {
      if (!el.parentElement) {
          el.remove();
          return;
      }
      const { vRemote } = el;
      if (!vRemote)
          return;
      const { parentElement, nextElementSibling } = vRemote;
      if (!parentElement.contains(el)) {
          el.remove();
          return;
      }
      parentElement.insertBefore(el, nextElementSibling);
      delete el.vRemote;
  }
  function update$1(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue !== false) {
          unbind$1(el);
      }
      inserted$1(el, binding);
  }
  const Remote = {
      inserted: inserted$1,
      update: update$1,
      unbind: unbind$1,
  };

  function useRemote() {
      return createMixins({
          directives: {
              remote: Remote,
          },
          props: {
              container: [String, Function],
          },
          afterRender(vnode) {
              const { container } = this;
              if (!isDef(container))
                  return;
              vnode.data = vnode.data || {};
              (vnode.data.directives || (vnode.data.directives = [])).push({
                  name: 'remote',
                  value: true,
                  arg: isFunction(container) ? container() : container,
              });
          },
      });
  }

  const ENTER_EVENTS = [
      'before-enter',
      'enter',
      'after-enter',
      'enter-cancelled',
  ];
  const LEAVE_EVENTS = [
      'before-leave',
      'leave',
      'after-leave',
      'leave-cancelled',
  ];
  const APPEAR_EVENTS = [
      'before-appear',
      'appear',
      'after-appear',
      'appear-cancelled',
  ];
  function createTransitionHooks(delegate, appear = false, css = false) {
      const events = [
          ...ENTER_EVENTS,
          ...LEAVE_EVENTS,
          ...(appear ? APPEAR_EVENTS : []),
      ];
      return events.reduce((prev, val) => {
          // Vue check hook funcion's argments length with Function.length
          // While ...args will left Function.length to be 0
          // and the hook will not work right
          prev[val] = css
              ? (el) => delegate.$emit(val, el, NOOP)
              : (el, done) => delegate.$emit(val, el, done);
          return prev;
      }, {});
  }

  function useTransition(options) {
      const { appear = true, css = true, appearHook = false, } = options || {};
      return createMixins({
          props: {
              // string | object | false
              transition: null,
          },
          beforeMount() {
              this.useTransition = {
                  transition: {
                      appear,
                      css,
                  },
              };
          },
          afterRender(vnode) {
              const transition = isObject(this.transition)
                  ? {
                      appear,
                      // css,
                      ...this.transition,
                  }
                  : {
                      name: this.transition,
                      appear: !!this.transition || appear,
                      css: !!this.transition || css,
                  };
              // allow user to change transition
              // for internally use
              this.$emit('transition', transition);
              if (transition.css && !transition.name)
                  return;
              const { useTransition } = this;
              if (!useTransition.hooks || useTransition.transition.css !== transition.css) {
                  useTransition.transition = transition;
                  useTransition.hooks = createTransitionHooks(this, appearHook, transition.css);
              }
              const data = {
                  props: transition,
                  on: useTransition.hooks,
              };
              /* eslint-disable-next-line */
              return this.$createElement('transition', data, [vnode]);
          },
      });
  }

  const popupStack = [];
  class PopupContext {
      constructor(stack) {
          this.base = 2000;
          this.index = 0;
          this.stack = stack;
      }
      getPopup(index = this.stack.length - 1) {
          return this.stack[index];
      }
      getActiveFocusPopup() {
          let index = this.stack.length - 1;
          let popup = this.stack[index];
          while (popup) {
              if (popup.activeFocus) {
                  break;
              }
              index--;
              popup = this.stack[index];
          }
          return popup;
      }
      getOverlayIndex() {
          return this.base + this.index;
      }
      push(popup) {
          this.stack.push(popup);
          this.index++;
      }
      pop(popup) {
          this.stack.splice(this.stack.indexOf(popup), 1);
          if (!this.stack.length) {
              this.index = 0;
          }
      }
  }
  const popupContext = new PopupContext(popupStack);
  function setupPopup(doc = document) {
      doc.addEventListener('focusin', ev => {
          const lastPopup = popupContext.getActiveFocusPopup();
          if (!lastPopup)
              return;
          if (lastPopup.closeOnClickOutside)
              return;
          if (lastPopup.$el.contains(ev.target))
              return;
          lastPopup.focus();
      });
      // handle back-button click
      doc.addEventListener('lineBackButton', ev => {
          const lastPopup = popupContext.getPopup();
          if (!lastPopup)
              return;
          if (!lastPopup.closeOnClickOutside)
              return;
          ev
              .detail
              .register(100, () => lastPopup.close());
      });
      // handle ESC to close popup
      doc.addEventListener('keyup', ev => {
          if (ev.key === 'Escape') {
              const lastPopup = popupContext.getPopup();
              if (!lastPopup)
                  return;
              if (!lastPopup.closeOnEscape)
                  return;
              lastPopup.close();
          }
      });
  }

  /* eslint-disable */
  class GestureController {
      constructor() {
          this.gestureId = 0;
          this.requestedStart = new Map();
          this.disabledGestures = new Map();
          this.disabledScroll = new Set();
      }
      /**
       * Creates a gesture delegate based on the GestureConfig passed
       */
      createGesture(config) {
          return new GestureDelegate(this, this.newID(), config.name, config.priority || 0, !!config.disableScroll);
      }
      /**
       * Creates a blocker that will block any other gesture events from firing. Set in the ion-gesture component.
       */
      createBlocker(opts = {}) {
          return new BlockerDelegate(this, this.newID(), opts.disable, !!opts.disableScroll);
      }
      start(gestureName, id, priority) {
          if (!this.canStart(gestureName)) {
              this.requestedStart.delete(id);
              return false;
          }
          this.requestedStart.set(id, priority);
          return true;
      }
      capture(gestureName, id, priority) {
          if (!this.start(gestureName, id, priority)) {
              return false;
          }
          const requestedStart = this.requestedStart;
          let maxPriority = -10000;
          requestedStart.forEach(value => {
              maxPriority = Math.max(maxPriority, value);
          });
          if (maxPriority === priority) {
              this.capturedId = id;
              requestedStart.clear();
              const event = new CustomEvent('ionGestureCaptured', { detail: { gestureName } });
              document.dispatchEvent(event);
              return true;
          }
          requestedStart.delete(id);
          return false;
      }
      release(id) {
          this.requestedStart.delete(id);
          if (this.capturedId === id) {
              this.capturedId = undefined;
          }
      }
      disableGesture(gestureName, id) {
          let set = this.disabledGestures.get(gestureName);
          if (set === undefined) {
              set = new Set();
              this.disabledGestures.set(gestureName, set);
          }
          set.add(id);
      }
      enableGesture(gestureName, id) {
          const set = this.disabledGestures.get(gestureName);
          if (set !== undefined) {
              set.delete(id);
          }
      }
      disableScroll(id) {
          this.disabledScroll.add(id);
          if (this.disabledScroll.size === 1) {
              document.body.classList.add(BACKDROP_NO_SCROLL);
          }
      }
      enableScroll(id) {
          this.disabledScroll.delete(id);
          if (this.disabledScroll.size === 0) {
              document.body.classList.remove(BACKDROP_NO_SCROLL);
          }
      }
      canStart(gestureName) {
          if (this.capturedId !== undefined) {
              // a gesture already captured
              return false;
          }
          if (this.isDisabled(gestureName)) {
              return false;
          }
          return true;
      }
      isCaptured() {
          return this.capturedId !== undefined;
      }
      isScrollDisabled() {
          return this.disabledScroll.size > 0;
      }
      isDisabled(gestureName) {
          const disabled = this.disabledGestures.get(gestureName);
          if (disabled && disabled.size > 0) {
              return true;
          }
          return false;
      }
      newID() {
          this.gestureId++;
          return this.gestureId;
      }
  }
  class GestureDelegate {
      constructor(ctrl, id, name, priority, disableScroll) {
          this.id = id;
          this.name = name;
          this.disableScroll = disableScroll;
          this.priority = priority * 1000000 + id;
          this.ctrl = ctrl;
      }
      canStart() {
          if (!this.ctrl) {
              return false;
          }
          return this.ctrl.canStart(this.name);
      }
      start() {
          if (!this.ctrl) {
              return false;
          }
          return this.ctrl.start(this.name, this.id, this.priority);
      }
      capture() {
          if (!this.ctrl) {
              return false;
          }
          const captured = this.ctrl.capture(this.name, this.id, this.priority);
          if (captured && this.disableScroll) {
              this.ctrl.disableScroll(this.id);
          }
          return captured;
      }
      release() {
          if (this.ctrl) {
              this.ctrl.release(this.id);
              if (this.disableScroll) {
                  this.ctrl.enableScroll(this.id);
              }
          }
      }
      destroy() {
          this.release();
          this.ctrl = undefined;
      }
  }
  class BlockerDelegate {
      constructor(ctrl, id, disable, disableScroll) {
          this.id = id;
          this.disable = disable;
          this.disableScroll = disableScroll;
          this.ctrl = ctrl;
      }
      block() {
          if (!this.ctrl) {
              return;
          }
          if (this.disable) {
              for (const gesture of this.disable) {
                  this.ctrl.disableGesture(gesture, this.id);
              }
          }
          if (this.disableScroll) {
              this.ctrl.disableScroll(this.id);
          }
      }
      unblock() {
          if (!this.ctrl) {
              return;
          }
          if (this.disable) {
              for (const gesture of this.disable) {
                  this.ctrl.enableGesture(gesture, this.id);
              }
          }
          if (this.disableScroll) {
              this.ctrl.enableScroll(this.id);
          }
      }
      destroy() {
          this.unblock();
          this.ctrl = undefined;
      }
  }
  const BACKDROP_NO_SCROLL = 'backdrop-no-scroll';
  const GESTURE_CONTROLLER = new GestureController();

  // eslint-disable-next-line import/no-mutable-exports
  let supportsPassive;
  const isSupportsPassive = (node) => {
      if (supportsPassive === undefined) {
          try {
              const opts = Object.defineProperty({}, 'passive', {
                  get: () => {
                      supportsPassive = true;
                  },
              });
              node.addEventListener('passive-tester', null, opts);
          }
          catch (e) {
              supportsPassive = false;
          }
      }
      return !!supportsPassive;
  };
  const off = (el, event, listener, opts) => {
      el.removeEventListener(event, listener, opts);
  };
  const on = (el, event, listener, opts = { passive: false, capture: false }) => {
      // use event listener options when supported
      // otherwise it's just a boolean for the "capture" arg
      const listenerOpts = isSupportsPassive(el) ? opts : !!opts.capture;
      el.addEventListener(event, listener, listenerOpts);
      return () => off(el, event, listener, listenerOpts);
  };

  /* eslint-disable */
  const MOUSE_WAIT = 2000;
  const createPointerEvents = (el, pointerDown, pointerMove, pointerUp, options) => {
      let rmTouchStart;
      let rmTouchMove;
      let rmTouchEnd;
      let rmTouchCancel;
      let rmMouseStart;
      let rmMouseMove;
      let rmMouseUp;
      let lastTouchEvent = 0;
      const handleTouchStart = (ev) => {
          lastTouchEvent = Date.now() + MOUSE_WAIT;
          if (!pointerDown(ev)) {
              return;
          }
          if (!rmTouchMove && pointerMove) {
              rmTouchMove = on(el, 'touchmove', pointerMove, options);
          }
          if (!rmTouchEnd) {
              rmTouchEnd = on(el, 'touchend', handleTouchEnd, options);
          }
          if (!rmTouchCancel) {
              rmTouchCancel = on(el, 'touchcancel', handleTouchEnd, options);
          }
      };
      const handleMouseDown = (ev) => {
          if (lastTouchEvent > Date.now()) {
              return;
          }
          if (!pointerDown(ev)) {
              return;
          }
          if (!rmMouseMove && pointerMove) {
              rmMouseMove = on(getDocument(el), 'mousemove', pointerMove, options);
          }
          if (!rmMouseUp) {
              rmMouseUp = on(getDocument(el), 'mouseup', handleMouseUp, options);
          }
      };
      const handleTouchEnd = (ev) => {
          stopTouch();
          if (pointerUp) {
              pointerUp(ev);
          }
      };
      const handleMouseUp = (ev) => {
          stopMouse();
          if (pointerUp) {
              pointerUp(ev);
          }
      };
      const stopTouch = () => {
          if (rmTouchMove) {
              rmTouchMove();
          }
          if (rmTouchEnd) {
              rmTouchEnd();
          }
          if (rmTouchCancel) {
              rmTouchCancel();
          }
          rmTouchMove = rmTouchEnd = rmTouchCancel = undefined;
      };
      const stopMouse = () => {
          if (rmMouseMove) {
              rmMouseMove();
          }
          if (rmMouseUp) {
              rmMouseUp();
          }
          rmMouseMove = rmMouseUp = undefined;
      };
      const stop = () => {
          stopTouch();
          stopMouse();
      };
      const enable = (isEnabled = true) => {
          if (!isEnabled) {
              if (rmTouchStart) {
                  rmTouchStart();
              }
              if (rmMouseStart) {
                  rmMouseStart();
              }
              rmTouchStart = rmMouseStart = undefined;
              stop();
          }
          else {
              if (!rmTouchStart) {
                  rmTouchStart = on(el, 'touchstart', handleTouchStart, options);
              }
              if (!rmMouseStart) {
                  rmMouseStart = on(el, 'mousedown', handleMouseDown, options);
              }
          }
      };
      const destroy = () => {
          enable(false);
          pointerUp = pointerMove = pointerDown = undefined;
      };
      return {
          enable,
          stop,
          destroy
      };
  };
  const getDocument = (node) => {
      return node instanceof Document ? node : node.ownerDocument;
  };

  /* eslint-disable */
  const createPanRecognizer = (direction, thresh, maxAngle) => {
      const radians = maxAngle * (Math.PI / 180);
      const isDirX = direction === 'x';
      const maxCosine = Math.cos(radians);
      const threshold = thresh * thresh;
      let startX = 0;
      let startY = 0;
      let dirty = false;
      let isPan = 0;
      return {
          start(x, y) {
              startX = x;
              startY = y;
              isPan = 0;
              dirty = true;
          },
          detect(x, y) {
              if (!dirty) {
                  return false;
              }
              const deltaX = (x - startX);
              const deltaY = (y - startY);
              const distance = deltaX * deltaX + deltaY * deltaY;
              if (distance < threshold) {
                  return false;
              }
              const hypotenuse = Math.sqrt(distance);
              const cosine = (isDirX ? deltaX : deltaY) / hypotenuse;
              if (cosine > maxCosine) {
                  isPan = 1;
              }
              else if (cosine < -maxCosine) {
                  isPan = -1;
              }
              else {
                  isPan = 0;
              }
              dirty = false;
              return true;
          },
          isGesture() {
              return isPan !== 0;
          },
          getDirection() {
              return isPan;
          }
      };
  };

  /* eslint-disable */
  const createGesture = (config) => {
      let hasCapturedPan = false;
      let hasStartedPan = false;
      let hasFiredStart = true;
      let isMoveQueued = false;
      const finalConfig = {
          disableScroll: false,
          direction: 'x',
          gesturePriority: 0,
          passive: true,
          maxAngle: 40,
          threshold: 10,
          ...config
      };
      const canStart = finalConfig.canStart;
      const onWillStart = finalConfig.onWillStart;
      const onStart = finalConfig.onStart;
      const onEnd = finalConfig.onEnd;
      const notCaptured = finalConfig.notCaptured;
      const onMove = finalConfig.onMove;
      const threshold = finalConfig.threshold;
      const detail = {
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
          event: undefined,
          data: undefined
      };
      const pan = createPanRecognizer(finalConfig.direction, finalConfig.threshold, finalConfig.maxAngle);
      const gesture = GESTURE_CONTROLLER.createGesture({
          name: config.gestureName,
          priority: config.gesturePriority,
          disableScroll: config.disableScroll
      });
      const pointerDown = (ev) => {
          const timeStamp = now(ev);
          if (hasStartedPan || !hasFiredStart) {
              return false;
          }
          updateDetail(ev, detail);
          detail.startX = detail.currentX;
          detail.startY = detail.currentY;
          detail.startTime = detail.currentTime = timeStamp;
          detail.velocityX = detail.velocityY = detail.deltaX = detail.deltaY = 0;
          detail.event = ev;
          // Check if gesture can start
          if (canStart && canStart(detail) === false) {
              return false;
          }
          // Release fallback
          gesture.release();
          // Start gesture
          if (!gesture.start()) {
              return false;
          }
          hasStartedPan = true;
          if (threshold === 0) {
              return tryToCapturePan();
          }
          pan.start(detail.startX, detail.startY);
          return true;
      };
      const pointerMove = (ev) => {
          // fast path, if gesture is currently captured
          // do minimum job to get user-land even dispatched
          if (hasCapturedPan) {
              if (!isMoveQueued && hasFiredStart) {
                  isMoveQueued = true;
                  calcGestureData(detail, ev);
                  requestAnimationFrame(fireOnMove);
              }
              return;
          }
          // gesture is currently being detected
          calcGestureData(detail, ev);
          if (pan.detect(detail.currentX, detail.currentY)) {
              if (!pan.isGesture() || !tryToCapturePan()) {
                  abortGesture();
              }
          }
      };
      const fireOnMove = () => {
          // Since fireOnMove is called inside a RAF, onEnd() might be called,
          // we must double check hasCapturedPan
          if (!hasCapturedPan) {
              return;
          }
          isMoveQueued = false;
          if (onMove) {
              onMove(detail);
          }
      };
      const tryToCapturePan = () => {
          if (gesture && !gesture.capture()) {
              return false;
          }
          hasCapturedPan = true;
          hasFiredStart = false;
          // reset start position since the real user-land event starts here
          // If the pan detector threshold is big, not resetting the start position
          // will cause a jump in the animation equal to the detector threshold.
          // the array of positions used to calculate the gesture velocity does not
          // need to be cleaned, more points in the positions array always results in a
          // more accurate value of the velocity.
          detail.startX = detail.currentX;
          detail.startY = detail.currentY;
          detail.startTime = detail.currentTime;
          if (onWillStart) {
              onWillStart(detail).then(fireOnStart);
          }
          else {
              fireOnStart();
          }
          return true;
      };
      const fireOnStart = () => {
          if (onStart) {
              onStart(detail);
          }
          hasFiredStart = true;
      };
      const reset = () => {
          hasCapturedPan = false;
          hasStartedPan = false;
          isMoveQueued = false;
          hasFiredStart = true;
          gesture.release();
      };
      // END *************************
      const pointerUp = (ev) => {
          const tmpHasCaptured = hasCapturedPan;
          const tmpHasFiredStart = hasFiredStart;
          reset();
          if (!tmpHasFiredStart) {
              return;
          }
          calcGestureData(detail, ev);
          // Try to capture press
          if (tmpHasCaptured) {
              if (onEnd) {
                  onEnd(detail);
              }
              return;
          }
          // Not captured any event
          if (notCaptured) {
              notCaptured(detail);
          }
      };
      const pointerEvents = createPointerEvents(finalConfig.el, pointerDown, pointerMove, pointerUp, {
          capture: false,
      });
      const abortGesture = () => {
          reset();
          pointerEvents.stop();
          if (notCaptured) {
              notCaptured(detail);
          }
      };
      return {
          enable(enable = true) {
              if (!enable) {
                  if (hasCapturedPan) {
                      pointerUp(undefined);
                  }
                  reset();
              }
              pointerEvents.enable(enable);
          },
          destroy() {
              gesture.destroy();
              pointerEvents.destroy();
          }
      };
  };
  const calcGestureData = (detail, ev) => {
      if (!ev) {
          return;
      }
      const prevX = detail.currentX;
      const prevY = detail.currentY;
      const prevT = detail.currentTime;
      updateDetail(ev, detail);
      const currentX = detail.currentX;
      const currentY = detail.currentY;
      const timestamp = detail.currentTime = now(ev);
      const timeDelta = timestamp - prevT;
      if (timeDelta > 0 && timeDelta < 100) {
          const velocityX = (currentX - prevX) / timeDelta;
          const velocityY = (currentY - prevY) / timeDelta;
          detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
          detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
      }
      detail.deltaX = currentX - detail.startX;
      detail.deltaY = currentY - detail.startY;
      detail.event = ev;
  };
  const updateDetail = (ev, detail) => {
      // get X coordinates for either a mouse click
      // or a touch depending on the given event
      let x = 0;
      let y = 0;
      if (ev) {
          const changedTouches = ev.changedTouches;
          if (changedTouches && changedTouches.length > 0) {
              const touch = changedTouches[0];
              x = touch.clientX;
              y = touch.clientY;
          }
          else if (ev.pageX !== undefined) {
              x = ev.pageX;
              y = ev.pageY;
          }
      }
      detail.currentX = x;
      detail.currentY = y;
  };
  const now = (ev) => {
      return ev.timeStamp || Date.now();
  };

  const raf = (h) => {
      if (typeof requestAnimationFrame === 'function') {
          return requestAnimationFrame(h);
      }
      return setTimeout(h);
  };

  /* eslint-disable */
  /**
   * Web Animations requires hyphenated CSS properties
   * to be written in camelCase when animating
   */
  const processKeyframes = (keyframes) => {
      keyframes.forEach(keyframe => {
          for (const key in keyframe) {
              if (keyframe.hasOwnProperty(key)) {
                  const value = keyframe[key];
                  if (key === 'easing') {
                      const newKey = 'animation-timing-function';
                      keyframe[newKey] = value;
                      delete keyframe[key];
                  }
                  else {
                      const newKey = convertCamelCaseToHypen(key);
                      if (newKey !== key) {
                          keyframe[newKey] = value;
                          delete keyframe[key];
                      }
                  }
              }
          }
      });
      return keyframes;
  };
  const convertCamelCaseToHypen = (str) => {
      return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  };
  let animationPrefix;
  const getAnimationPrefix = (el) => {
      if (animationPrefix === undefined) {
          const supportsUnprefixed = el.style.animationName !== undefined;
          const supportsWebkitPrefix = el.style.webkitAnimationName !== undefined;
          animationPrefix = (!supportsUnprefixed && supportsWebkitPrefix) ? '-webkit-' : '';
      }
      return animationPrefix;
  };
  const setStyleProperty = (element, propertyName, value) => {
      const prefix = propertyName.startsWith('animation') ? getAnimationPrefix(element) : '';
      element.style.setProperty(prefix + propertyName, value);
  };
  const removeStyleProperty = (element, propertyName) => {
      const prefix = propertyName.startsWith('animation') ? getAnimationPrefix(element) : '';
      element.style.removeProperty(prefix + propertyName);
  };
  const animationEnd = (el, callback) => {
      let unRegTrans;
      const opts = { passive: true };
      const unregister = () => {
          if (unRegTrans) {
              unRegTrans();
          }
      };
      const onTransitionEnd = (ev) => {
          if (el === ev.target) {
              unregister();
              callback(ev);
          }
      };
      if (el) {
          el.addEventListener('webkitAnimationEnd', onTransitionEnd, opts);
          el.addEventListener('animationend', onTransitionEnd, opts);
          unRegTrans = () => {
              el.removeEventListener('webkitAnimationEnd', onTransitionEnd, opts);
              el.removeEventListener('animationend', onTransitionEnd, opts);
          };
      }
      return unregister;
  };
  const generateKeyframeRules = (keyframes = []) => {
      return keyframes.map(keyframe => {
          const offset = keyframe.offset;
          const frameString = [];
          for (const property in keyframe) {
              if (keyframe.hasOwnProperty(property) && property !== 'offset') {
                  frameString.push(`${property}: ${keyframe[property]};`);
              }
          }
          return `${offset * 100}% { ${frameString.join(' ')} }`;
      }).join(' ');
  };
  const keyframeIds = [];
  const generateKeyframeName = (keyframeRules) => {
      let index = keyframeIds.indexOf(keyframeRules);
      if (index < 0) {
          index = (keyframeIds.push(keyframeRules) - 1);
      }
      return `ion-animation-${index}`;
  };
  const getStyleContainer = (element) => {
      const rootNode = element.getRootNode();
      return (rootNode.head || rootNode);
  };
  const createKeyframeStylesheet = (keyframeName, keyframeRules, element) => {
      const styleContainer = getStyleContainer(element);
      const keyframePrefix = getAnimationPrefix(element);
      const existingStylesheet = styleContainer.querySelector('#' + keyframeName);
      if (existingStylesheet) {
          return existingStylesheet;
      }
      const stylesheet = (element.ownerDocument || document).createElement('style');
      stylesheet.id = keyframeName;
      stylesheet.textContent = `@${keyframePrefix}keyframes ${keyframeName} { ${keyframeRules} } @${keyframePrefix}keyframes ${keyframeName}-alt { ${keyframeRules} }`;
      styleContainer.appendChild(stylesheet);
      return stylesheet;
  };
  const addClassToArray = (classes = [], className) => {
      if (className !== undefined) {
          const classNameToAppend = (Array.isArray(className)) ? className : [className];
          return [...classes, ...classNameToAppend];
      }
      return classes;
  };

  /* eslint-disable */
  const createAnimation = (animationId) => {
      let _delay;
      let _duration;
      let _easing;
      let _iterations;
      let _fill;
      let _direction;
      let _keyframes = [];
      let beforeAddClasses = [];
      let beforeRemoveClasses = [];
      let initialized = false;
      let parentAnimation;
      let beforeStylesValue = {};
      let afterAddClasses = [];
      let afterRemoveClasses = [];
      let afterStylesValue = {};
      let numAnimationsRunning = 0;
      let shouldForceLinearEasing = false;
      let shouldForceSyncPlayback = false;
      let cssAnimationsTimerFallback;
      let forceDirectionValue;
      let forceDurationValue;
      let forceDelayValue;
      let willComplete = true;
      let finished = false;
      let shouldCalculateNumAnimations = true;
      let keyframeName;
      let ani;
      const id = animationId;
      const onFinishCallbacks = [];
      const onFinishOneTimeCallbacks = [];
      const elements = [];
      const childAnimations = [];
      const stylesheets = [];
      const _beforeAddReadFunctions = [];
      const _beforeAddWriteFunctions = [];
      const _afterAddReadFunctions = [];
      const _afterAddWriteFunctions = [];
      const webAnimations = [];
      const supportsAnimationEffect = (typeof AnimationEffect === 'function' || typeof window.AnimationEffect === 'function');
      const supportsWebAnimations = (typeof Element === 'function') && (typeof Element.prototype.animate === 'function') && supportsAnimationEffect;
      const ANIMATION_END_FALLBACK_PADDING_MS = 100;
      const getWebAnimations = () => {
          return webAnimations;
      };
      const destroy = () => {
          childAnimations.forEach(childAnimation => {
              childAnimation.destroy();
          });
          cleanUp();
          elements.length = 0;
          childAnimations.length = 0;
          _keyframes.length = 0;
          clearOnFinish();
          initialized = false;
          shouldCalculateNumAnimations = true;
          return ani;
      };
      /**
       * Cancels any Web Animations, removes
       * any animation properties from the
       * animation's elements, and removes the
       * animation's stylesheets from the DOM.
       */
      const cleanUp = () => {
          cleanUpElements();
          cleanUpStyleSheets();
      };
      const onFinish = (callback, opts) => {
          const callbacks = (opts && opts.oneTimeCallback) ? onFinishOneTimeCallbacks : onFinishCallbacks;
          callbacks.push({ c: callback, o: opts });
          return ani;
      };
      const clearOnFinish = () => {
          onFinishCallbacks.length = 0;
          onFinishOneTimeCallbacks.length = 0;
          return ani;
      };
      /**
       * Cancels any Web Animations and removes
       * any animation properties from the
       * the animation's elements.
       */
      const cleanUpElements = () => {
          if (supportsWebAnimations) {
              webAnimations.forEach(animation => {
                  animation.cancel();
              });
              webAnimations.length = 0;
          }
          else {
              const elementsArray = elements.slice();
              raf(() => {
                  elementsArray.forEach(element => {
                      removeStyleProperty(element, 'animation-name');
                      removeStyleProperty(element, 'animation-duration');
                      removeStyleProperty(element, 'animation-timing-function');
                      removeStyleProperty(element, 'animation-iteration-count');
                      removeStyleProperty(element, 'animation-delay');
                      removeStyleProperty(element, 'animation-play-state');
                      removeStyleProperty(element, 'animation-fill-mode');
                      removeStyleProperty(element, 'animation-direction');
                  });
              });
          }
      };
      /**
       * Removes the animation's stylesheets
       * from the DOM.
       */
      const cleanUpStyleSheets = () => {
          stylesheets.forEach(stylesheet => {
              /**
               * When sharing stylesheets, it's possible
               * for another animation to have already
               * cleaned up a particular stylesheet
               */
              if (stylesheet && stylesheet.parentNode) {
                  stylesheet.parentNode.removeChild(stylesheet);
              }
          });
          stylesheets.length = 0;
      };
      const beforeAddRead = (readFn) => {
          _beforeAddReadFunctions.push(readFn);
          return ani;
      };
      const beforeAddWrite = (writeFn) => {
          _beforeAddWriteFunctions.push(writeFn);
          return ani;
      };
      const afterAddRead = (readFn) => {
          _afterAddReadFunctions.push(readFn);
          return ani;
      };
      const afterAddWrite = (writeFn) => {
          _afterAddWriteFunctions.push(writeFn);
          return ani;
      };
      const beforeAddClass = (className) => {
          beforeAddClasses = addClassToArray(beforeAddClasses, className);
          return ani;
      };
      const beforeRemoveClass = (className) => {
          beforeRemoveClasses = addClassToArray(beforeRemoveClasses, className);
          return ani;
      };
      /**
       * Set CSS inline styles to the animation's
       * elements before the animation begins.
       */
      const beforeStyles = (styles = {}) => {
          beforeStylesValue = styles;
          return ani;
      };
      /**
       * Clear CSS inline styles from the animation's
       * elements before the animation begins.
       */
      const beforeClearStyles = (propertyNames = []) => {
          for (const property of propertyNames) {
              beforeStylesValue[property] = '';
          }
          return ani;
      };
      const afterAddClass = (className) => {
          afterAddClasses = addClassToArray(afterAddClasses, className);
          return ani;
      };
      const afterRemoveClass = (className) => {
          afterRemoveClasses = addClassToArray(afterRemoveClasses, className);
          return ani;
      };
      const afterStyles = (styles = {}) => {
          afterStylesValue = styles;
          return ani;
      };
      const afterClearStyles = (propertyNames = []) => {
          for (const property of propertyNames) {
              afterStylesValue[property] = '';
          }
          return ani;
      };
      const getFill = () => {
          if (_fill !== undefined) {
              return _fill;
          }
          if (parentAnimation) {
              return parentAnimation.getFill();
          }
          return 'both';
      };
      const getDirection = () => {
          if (forceDirectionValue !== undefined) {
              return forceDirectionValue;
          }
          if (_direction !== undefined) {
              return _direction;
          }
          if (parentAnimation) {
              return parentAnimation.getDirection();
          }
          return 'normal';
      };
      const getEasing = () => {
          if (shouldForceLinearEasing) {
              return 'linear';
          }
          if (_easing !== undefined) {
              return _easing;
          }
          if (parentAnimation) {
              return parentAnimation.getEasing();
          }
          return 'linear';
      };
      const getDuration = () => {
          if (shouldForceSyncPlayback) {
              return 0;
          }
          if (forceDurationValue !== undefined) {
              return forceDurationValue;
          }
          if (_duration !== undefined) {
              return _duration;
          }
          if (parentAnimation) {
              return parentAnimation.getDuration();
          }
          return 0;
      };
      const getIterations = () => {
          if (_iterations !== undefined) {
              return _iterations;
          }
          if (parentAnimation) {
              return parentAnimation.getIterations();
          }
          return 1;
      };
      const getDelay = () => {
          if (forceDelayValue !== undefined) {
              return forceDelayValue;
          }
          if (_delay !== undefined) {
              return _delay;
          }
          if (parentAnimation) {
              return parentAnimation.getDelay();
          }
          return 0;
      };
      const getKeyframes = () => {
          return _keyframes;
      };
      const direction = (animationDirection) => {
          _direction = animationDirection;
          update(true);
          return ani;
      };
      const fill = (animationFill) => {
          _fill = animationFill;
          update(true);
          return ani;
      };
      const delay = (animationDelay) => {
          _delay = animationDelay;
          update(true);
          return ani;
      };
      const easing = (animationEasing) => {
          _easing = animationEasing;
          update(true);
          return ani;
      };
      const duration = (animationDuration) => {
          /**
           * CSS Animation Durations of 0ms work fine on Chrome
           * but do not run on Safari, so force it to 1ms to
           * get it to run on both platforms.
           */
          if (!supportsWebAnimations && animationDuration === 0) {
              animationDuration = 1;
          }
          _duration = animationDuration;
          update(true);
          return ani;
      };
      const iterations = (animationIterations) => {
          _iterations = animationIterations;
          update(true);
          return ani;
      };
      const parent = (animation) => {
          parentAnimation = animation;
          return ani;
      };
      const addElement = (el) => {
          if (el != null) {
              if (el.nodeType === 1) {
                  elements.push(el);
              }
              else if (el.length >= 0) {
                  for (let i = 0; i < el.length; i++) {
                      elements.push(el[i]);
                  }
              }
              else {
                  console.error('Invalid addElement value');
              }
          }
          return ani;
      };
      const addAnimation = (animationToAdd) => {
          if (animationToAdd != null) {
              if (Array.isArray(animationToAdd)) {
                  for (const animation of animationToAdd) {
                      animation.parent(ani);
                      childAnimations.push(animation);
                  }
              }
              else {
                  animationToAdd.parent(ani);
                  childAnimations.push(animationToAdd);
              }
          }
          return ani;
      };
      const keyframes = (keyframeValues) => {
          _keyframes = keyframeValues;
          return ani;
      };
      /**
       * Run all "before" animation hooks.
       */
      const beforeAnimation = () => {
          // Runs all before read callbacks
          _beforeAddReadFunctions.forEach(callback => callback());
          // Runs all before write callbacks
          _beforeAddWriteFunctions.forEach(callback => callback());
          // Updates styles and classes before animation runs
          const addClasses = beforeAddClasses;
          const removeClasses = beforeRemoveClasses;
          const styles = beforeStylesValue;
          elements.forEach(el => {
              const elementClassList = el.classList;
              addClasses.forEach(c => elementClassList.add(c));
              removeClasses.forEach(c => elementClassList.remove(c));
              for (const property in styles) {
                  if (styles.hasOwnProperty(property)) {
                      setStyleProperty(el, property, styles[property]);
                  }
              }
          });
      };
      /**
       * Run all "after" animation hooks.
       */
      const afterAnimation = () => {
          clearCSSAnimationsTimeout();
          // Runs all after read callbacks
          _afterAddReadFunctions.forEach(callback => callback());
          // Runs all after write callbacks
          _afterAddWriteFunctions.forEach(callback => callback());
          // Updates styles and classes before animation ends
          const currentStep = willComplete ? 1 : 0;
          const addClasses = afterAddClasses;
          const removeClasses = afterRemoveClasses;
          const styles = afterStylesValue;
          elements.forEach(el => {
              const elementClassList = el.classList;
              addClasses.forEach(c => elementClassList.add(c));
              removeClasses.forEach(c => elementClassList.remove(c));
              for (const property in styles) {
                  if (styles.hasOwnProperty(property)) {
                      setStyleProperty(el, property, styles[property]);
                  }
              }
          });
          onFinishCallbacks.forEach(onFinishCallback => {
              return onFinishCallback.c(currentStep, ani);
          });
          onFinishOneTimeCallbacks.forEach(onFinishCallback => {
              return onFinishCallback.c(currentStep, ani);
          });
          onFinishOneTimeCallbacks.length = 0;
          shouldCalculateNumAnimations = true;
          if (willComplete) {
              finished = true;
          }
          willComplete = true;
      };
      const animationFinish = () => {
          if (numAnimationsRunning === 0) {
              return;
          }
          numAnimationsRunning--;
          if (numAnimationsRunning === 0) {
              afterAnimation();
              if (parentAnimation) {
                  parentAnimation.animationFinish();
              }
          }
      };
      const initializeCSSAnimation = (toggleAnimationName = true) => {
          cleanUpStyleSheets();
          const processedKeyframes = processKeyframes(_keyframes);
          elements.forEach(element => {
              if (processedKeyframes.length > 0) {
                  const keyframeRules = generateKeyframeRules(processedKeyframes);
                  keyframeName = (animationId !== undefined) ? animationId : generateKeyframeName(keyframeRules);
                  const stylesheet = createKeyframeStylesheet(keyframeName, keyframeRules, element);
                  stylesheets.push(stylesheet);
                  setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
                  setStyleProperty(element, 'animation-timing-function', getEasing());
                  setStyleProperty(element, 'animation-delay', `${getDelay()}ms`);
                  setStyleProperty(element, 'animation-fill-mode', getFill());
                  setStyleProperty(element, 'animation-direction', getDirection());
                  const iterationsCount = (getIterations() === Infinity)
                      ? 'infinite'
                      : getIterations().toString();
                  setStyleProperty(element, 'animation-iteration-count', iterationsCount);
                  setStyleProperty(element, 'animation-play-state', 'paused');
                  if (toggleAnimationName) {
                      setStyleProperty(element, 'animation-name', `${stylesheet.id}-alt`);
                  }
                  raf(() => {
                      setStyleProperty(element, 'animation-name', stylesheet.id || null);
                  });
              }
          });
      };
      const initializeWebAnimation = () => {
          elements.forEach(element => {
              const animation = element.animate(_keyframes, {
                  id,
                  delay: getDelay(),
                  duration: getDuration(),
                  easing: getEasing(),
                  iterations: getIterations(),
                  fill: getFill(),
                  direction: getDirection()
              });
              animation.pause();
              webAnimations.push(animation);
          });
          if (webAnimations.length > 0) {
              webAnimations[0].onfinish = () => {
                  animationFinish();
              };
          }
      };
      const initializeAnimation = (toggleAnimationName = true) => {
          beforeAnimation();
          if (_keyframes.length > 0) {
              if (supportsWebAnimations) {
                  initializeWebAnimation();
              }
              else {
                  initializeCSSAnimation(toggleAnimationName);
              }
          }
          initialized = true;
      };
      const setAnimationStep = (step) => {
          step = Math.min(Math.max(step, 0), 0.9999);
          if (supportsWebAnimations) {
              webAnimations.forEach(animation => {
                  animation.currentTime = animation.effect.getComputedTiming().delay + (getDuration() * step);
                  animation.pause();
              });
          }
          else {
              const animationDuration = `-${getDuration() * step}ms`;
              elements.forEach(element => {
                  if (_keyframes.length > 0) {
                      setStyleProperty(element, 'animation-delay', animationDuration);
                      setStyleProperty(element, 'animation-play-state', 'paused');
                  }
              });
          }
      };
      const updateWebAnimation = (step) => {
          webAnimations.forEach(animation => {
              animation.effect.updateTiming({
                  delay: getDelay(),
                  duration: getDuration(),
                  easing: getEasing(),
                  iterations: getIterations(),
                  fill: getFill(),
                  direction: getDirection()
              });
          });
          if (step !== undefined) {
              setAnimationStep(step);
          }
      };
      const updateCSSAnimation = (toggleAnimationName = true, step) => {
          raf(() => {
              elements.forEach(element => {
                  setStyleProperty(element, 'animation-name', keyframeName || null);
                  setStyleProperty(element, 'animation-duration', `${getDuration()}ms`);
                  setStyleProperty(element, 'animation-timing-function', getEasing());
                  setStyleProperty(element, 'animation-delay', (step !== undefined) ? `-${step * getDuration()}ms` : `${getDelay()}ms`);
                  setStyleProperty(element, 'animation-fill-mode', getFill() || null);
                  setStyleProperty(element, 'animation-direction', getDirection() || null);
                  const iterationsCount = (getIterations() === Infinity)
                      ? 'infinite'
                      : getIterations().toString();
                  setStyleProperty(element, 'animation-iteration-count', iterationsCount);
                  if (toggleAnimationName) {
                      setStyleProperty(element, 'animation-name', `${keyframeName}-alt`);
                  }
                  raf(() => {
                      setStyleProperty(element, 'animation-name', keyframeName || null);
                  });
              });
          });
      };
      const update = (deep = false, toggleAnimationName = true, step) => {
          if (deep) {
              childAnimations.forEach(animation => {
                  animation.update(deep, toggleAnimationName, step);
              });
          }
          if (supportsWebAnimations) {
              updateWebAnimation(step);
          }
          else {
              updateCSSAnimation(toggleAnimationName, step);
          }
          return ani;
      };
      const progressStart = (forceLinearEasing = false, step) => {
          childAnimations.forEach(animation => {
              animation.progressStart(forceLinearEasing, step);
          });
          pauseAnimation();
          shouldForceLinearEasing = forceLinearEasing;
          if (!initialized) {
              initializeAnimation();
          }
          else {
              update(false, true, step);
          }
          return ani;
      };
      const progressStep = (step) => {
          childAnimations.forEach(animation => {
              animation.progressStep(step);
          });
          setAnimationStep(step);
          return ani;
      };
      const progressEnd = (playTo, step, dur) => {
          shouldForceLinearEasing = false;
          childAnimations.forEach(animation => {
              animation.progressEnd(playTo, step, dur);
          });
          if (dur !== undefined) {
              forceDurationValue = dur;
          }
          finished = false;
          // tslint:disable-next-line: strict-boolean-conditions
          willComplete = true;
          if (playTo === 0) {
              forceDirectionValue = (getDirection() === 'reverse') ? 'normal' : 'reverse';
              if (forceDirectionValue === 'reverse') {
                  willComplete = false;
              }
              if (supportsWebAnimations) {
                  update();
                  setAnimationStep(1 - step);
              }
              else {
                  forceDelayValue = ((1 - step) * getDuration()) * -1;
                  update(false, false);
              }
          }
          else if (playTo === 1) {
              if (supportsWebAnimations) {
                  update();
                  setAnimationStep(step);
              }
              else {
                  forceDelayValue = (step * getDuration()) * -1;
                  update(false, false);
              }
          }
          if (playTo !== undefined) {
              onFinish(() => {
                  forceDurationValue = undefined;
                  forceDirectionValue = undefined;
                  forceDelayValue = undefined;
              }, {
                  oneTimeCallback: true
              });
              if (!parentAnimation) {
                  play();
              }
          }
          return ani;
      };
      const pauseAnimation = () => {
          if (initialized) {
              if (supportsWebAnimations) {
                  webAnimations.forEach(animation => {
                      animation.pause();
                  });
              }
              else {
                  elements.forEach(element => {
                      setStyleProperty(element, 'animation-play-state', 'paused');
                  });
              }
          }
      };
      const pause = () => {
          childAnimations.forEach(animation => {
              animation.pause();
          });
          pauseAnimation();
          return ani;
      };
      const onAnimationEndFallback = () => {
          cssAnimationsTimerFallback = undefined;
          animationFinish();
      };
      const clearCSSAnimationsTimeout = () => {
          if (cssAnimationsTimerFallback) {
              clearTimeout(cssAnimationsTimerFallback);
          }
      };
      const playCSSAnimations = () => {
          clearCSSAnimationsTimeout();
          raf(() => {
              elements.forEach(element => {
                  if (_keyframes.length > 0) {
                      setStyleProperty(element, 'animation-play-state', 'running');
                  }
              });
          });
          if (_keyframes.length === 0 || elements.length === 0) {
              animationFinish();
          }
          else {
              /**
               * This is a catchall in the event that a CSS Animation did not finish.
               * The Web Animations API has mechanisms in place for preventing this.
               * CSS Animations will not fire an `animationend` event
               * for elements with `display: none`. The Web Animations API
               * accounts for this, but using raw CSS Animations requires
               * this workaround.
               */
              const animationDelay = getDelay() || 0;
              const animationDuration = getDuration() || 0;
              const animationIterations = getIterations() || 1;
              // No need to set a timeout when animation has infinite iterations
              if (isFinite(animationIterations)) {
                  cssAnimationsTimerFallback = setTimeout(onAnimationEndFallback, animationDelay + (animationDuration * animationIterations) + ANIMATION_END_FALLBACK_PADDING_MS);
              }
              animationEnd(elements[0], () => {
                  clearCSSAnimationsTimeout();
                  /**
                   * Ensure that clean up
                   * is always done a frame
                   * before the onFinish handlers
                   * are fired. Otherwise, there
                   * may be flickering if a new
                   * animation is started on the same
                   * element too quickly
                   *
                   * TODO: Is there a cleaner way to do this?
                   */
                  raf(() => {
                      clearCSSAnimationPlayState();
                      raf(animationFinish);
                  });
              });
          }
      };
      const clearCSSAnimationPlayState = () => {
          elements.forEach(element => {
              removeStyleProperty(element, 'animation-duration');
              removeStyleProperty(element, 'animation-delay');
              removeStyleProperty(element, 'animation-play-state');
          });
      };
      const playWebAnimations = () => {
          webAnimations.forEach(animation => {
              animation.play();
          });
          if (_keyframes.length === 0 || elements.length === 0) {
              animationFinish();
          }
      };
      const resetAnimation = () => {
          if (supportsWebAnimations) {
              setAnimationStep(0);
              updateWebAnimation();
          }
          else {
              updateCSSAnimation();
          }
      };
      const play = (opts) => {
          return new Promise(resolve => {
              if (opts && opts.sync) {
                  shouldForceSyncPlayback = true;
                  onFinish(() => shouldForceSyncPlayback = false, { oneTimeCallback: true });
              }
              if (!initialized) {
                  initializeAnimation();
              }
              if (finished) {
                  resetAnimation();
                  finished = false;
              }
              if (shouldCalculateNumAnimations) {
                  numAnimationsRunning = childAnimations.length + 1;
                  shouldCalculateNumAnimations = false;
              }
              onFinish(() => resolve(), { oneTimeCallback: true });
              childAnimations.forEach(animation => {
                  animation.play();
              });
              if (supportsWebAnimations) {
                  playWebAnimations();
              }
              else {
                  playCSSAnimations();
              }
          });
      };
      const stop = () => {
          childAnimations.forEach(animation => {
              animation.stop();
          });
          if (initialized) {
              cleanUpElements();
              initialized = false;
          }
      };
      const from = (property, value) => {
          const firstFrame = _keyframes[0];
          if (firstFrame !== undefined && (firstFrame.offset === undefined || firstFrame.offset === 0)) {
              firstFrame[property] = value;
          }
          else {
              _keyframes = [
                  { offset: 0, [property]: value },
                  ..._keyframes
              ];
          }
          return ani;
      };
      const to = (property, value) => {
          const lastFrame = _keyframes[_keyframes.length - 1];
          if (lastFrame !== undefined && (lastFrame.offset === undefined || lastFrame.offset === 1)) {
              lastFrame[property] = value;
          }
          else {
              _keyframes = [
                  ..._keyframes,
                  { offset: 1, [property]: value }
              ];
          }
          return ani;
      };
      const fromTo = (property, fromValue, toValue) => {
          return from(property, fromValue).to(property, toValue);
      };
      return ani = {
          parentAnimation,
          elements,
          childAnimations,
          id,
          animationFinish,
          from,
          to,
          fromTo,
          parent,
          play,
          pause,
          stop,
          destroy,
          keyframes,
          addAnimation,
          addElement,
          update,
          fill,
          direction,
          iterations,
          duration,
          easing,
          delay,
          getWebAnimations,
          getKeyframes,
          getFill,
          getDirection,
          getDelay,
          getIterations,
          getEasing,
          getDuration,
          afterAddRead,
          afterAddWrite,
          afterClearStyles,
          afterStyles,
          afterRemoveClass,
          afterAddClass,
          beforeAddRead,
          beforeAddWrite,
          beforeClearStyles,
          beforeStyles,
          beforeRemoveClass,
          beforeAddClass,
          onFinish,
          progressStart,
          progressStep,
          progressEnd
      };
  };

  /* eslint-disable */
  /**
   * Based on:
   * https://stackoverflow.com/questions/7348009/y-coordinate-for-a-given-x-cubic-bezier
   * https://math.stackexchange.com/questions/26846/is-there-an-explicit-form-for-cubic-b%C3%A9zier-curves
   * TODO: Reduce rounding error
   */
  /**
   * EXPERIMENTAL
   * Given a cubic-bezier curve, get the x value (time) given
   * the y value (progression).
   * Ex: cubic-bezier(0.32, 0.72, 0, 1);
   * P0: (0, 0)
   * P1: (0.32, 0.72)
   * P2: (0, 1)
   * P3: (1, 1)
   *
   * If you give a cubic bezier curve that never reaches the
   * provided progression, this function will return an empty array.
   */
  const getTimeGivenProgression = (p0, p1, p2, p3, progression) => {
      return solveCubicBezier(p0[1], p1[1], p2[1], p3[1], progression).map(tValue => {
          return solveCubicParametricEquation(p0[0], p1[0], p2[0], p3[0], tValue);
      });
  };
  /**
   * Solve a cubic equation in one dimension (time)
   */
  const solveCubicParametricEquation = (p0, p1, p2, p3, t) => {
      const partA = (3 * p1) * Math.pow(t - 1, 2);
      const partB = (-3 * p2 * t) + (3 * p2) + (p3 * t);
      const partC = p0 * Math.pow(t - 1, 3);
      return t * (partA + (t * partB)) - partC;
  };
  /**
   * Find the `t` value for a cubic bezier using Cardano's formula
   */
  const solveCubicBezier = (p0, p1, p2, p3, refPoint) => {
      p0 -= refPoint;
      p1 -= refPoint;
      p2 -= refPoint;
      p3 -= refPoint;
      const roots = solveCubicEquation(p3 - 3 * p2 + 3 * p1 - p0, 3 * p2 - 6 * p1 + 3 * p0, 3 * p1 - 3 * p0, p0);
      return roots.filter(root => root >= 0 && root <= 1);
  };
  const solveQuadraticEquation = (a, b, c) => {
      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
          return [];
      }
      else {
          return [
              (-b + Math.sqrt(discriminant)) / (2 * a),
              (-b - Math.sqrt(discriminant)) / (2 * a)
          ];
      }
  };
  const solveCubicEquation = (a, b, c, d) => {
      if (a === 0) {
          return solveQuadraticEquation(b, c, d);
      }
      b /= a;
      c /= a;
      d /= a;
      const p = (3 * c - b * b) / 3;
      const q = (2 * b * b * b - 9 * b * c + 27 * d) / 27;
      if (p === 0) {
          return [Math.pow(-q, 1 / 3)];
      }
      else if (q === 0) {
          return [Math.sqrt(-p), -Math.sqrt(-p)];
      }
      const discriminant = Math.pow(q / 2, 2) + Math.pow(p / 3, 3);
      if (discriminant === 0) {
          return [Math.pow(q / 2, 1 / 2) - b / 3];
      }
      else if (discriminant > 0) {
          return [Math.pow(-(q / 2) + Math.sqrt(discriminant), 1 / 3) - Math.pow((q / 2) + Math.sqrt(discriminant), 1 / 3) - b / 3];
      }
      const r = Math.sqrt(Math.pow(-(p / 3), 3));
      const phi = Math.acos(-(q / (2 * Math.sqrt(Math.pow(-(p / 3), 3)))));
      const s = 2 * Math.pow(r, 1 / 3);
      return [
          s * Math.cos(phi / 3) - b / 3,
          s * Math.cos((phi + 2 * Math.PI) / 3) - b / 3,
          s * Math.cos((phi + 4 * Math.PI) / 3) - b / 3
      ];
  };

  const testUserAgent = (win, expr) => expr.test(win.navigator.userAgent);
  const matchMedia = (win, query) => win.matchMedia(query).matches;
  const isMobile = (win) => matchMedia(win, '(any-pointer:coarse)');
  const isDesktop = (win) => !isMobile(win);
  const isIpad = (win) => {
      // iOS 12 and below
      if (testUserAgent(win, /iPad/i)) {
          return true;
      }
      // iOS 13+
      if (testUserAgent(win, /Macintosh/i) && isMobile(win)) {
          return true;
      }
      return false;
  };
  const isIphone = (win) => testUserAgent(win, /iPhone/i);
  const isIOS = (win) => testUserAgent(win, /iPhone|iPod/i) || isIpad(win);
  const isAndroid = (win) => testUserAgent(win, /android|sink/i);
  const isAndroidTablet = (win) => {
      return isAndroid(win) && !testUserAgent(win, /mobile/i);
  };
  const isPhablet = (win) => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const smallest = Math.min(width, height);
      const largest = Math.max(width, height);
      return (smallest > 390 && smallest < 520)
          && (largest > 620 && largest < 800);
  };
  const isTablet = (win) => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const smallest = Math.min(width, height);
      const largest = Math.max(width, height);
      return (isIpad(win)
          || isAndroidTablet(win)
          || ((smallest > 460 && smallest < 820)
              && (largest > 780 && largest < 1400)));
  };
  const isCordova = (win) => !!(win.cordova || win.phonegap || win.PhoneGap);
  const isCapacitorNative = (win) => {
      const capacitor = win.Capacitor;
      return !!(capacitor && capacitor.isNative);
  };
  const isHybrid = (win) => isCordova(win) || isCapacitorNative(win);
  const isMobileWeb = (win) => isMobile(win) && !isHybrid(win);
  const isElectron = (win) => testUserAgent(win, /electron/i);
  const isPWA = (win) => !!(win.matchMedia('(display-mode: standalone)').matches || win.navigator.standalone);
  const PLATFORMS_MAP = {
      ipad: isIpad,
      iphone: isIphone,
      ios: isIOS,
      android: isAndroid,
      phablet: isPhablet,
      tablet: isTablet,
      cordova: isCordova,
      capacitor: isCapacitorNative,
      electron: isElectron,
      pwa: isPWA,
      mobile: isMobile,
      mobileweb: isMobileWeb,
      desktop: isDesktop,
      hybrid: isHybrid,
  };
  /* eslint-disable max-len */
  const detectPlatforms = (win) => Object.keys(PLATFORMS_MAP).filter(p => PLATFORMS_MAP[p](win));
  const setupPlatforms = (win = window) => {
      win.Skyline = win.Skyline || {};
      let { platforms } = win.Skyline;
      if (platforms == null) {
          platforms = win.Skyline.platforms = detectPlatforms(win);
          platforms.forEach((p) => win.document.documentElement.classList.add(`plt-${p}`));
      }
      return platforms;
  };
  const getPlatforms = (win) => setupPlatforms(win);
  const isPlatform = (winOrPlatform, platform) => {
      if (typeof winOrPlatform === 'string') {
          platform = winOrPlatform;
          winOrPlatform = undefined;
      }
      return getPlatforms(winOrPlatform).includes(platform);
  };

  const startsWith = (input, search) => {
      return input.substr(0, search.length) === search;
  };
  const SKYLINE_PREFIX = 'skyline:';
  const SKYLINE_SESSION_KEY = 'skyline-persist-config';
  class Config {
      constructor() {
          this.m = new Map();
      }
      reset(configObj) {
          this.m = new Map(Object.entries(configObj));
      }
      get(key, fallback) {
          const value = this.m.get(key);
          return (value !== undefined) ? value : fallback;
      }
      getBoolean(key, fallback = false) {
          const val = this.m.get(key);
          if (val === undefined) {
              return fallback;
          }
          if (typeof val === 'string') {
              return val === 'true';
          }
          return !!val;
      }
      getNumber(key, fallback) {
          const val = parseFloat(this.m.get(key));
          return Number.isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
      }
      set(key, value) {
          this.m.set(key, value);
      }
  }
  const config = new Config();
  const configFromSession = (win) => {
      try {
          const configStr = win.sessionStorage.getItem(SKYLINE_SESSION_KEY);
          return configStr !== null ? JSON.parse(configStr) : {};
      }
      catch (e) {
          return {};
      }
  };
  const saveConfig = (win, c) => {
      try {
          win.sessionStorage.setItem(SKYLINE_SESSION_KEY, JSON.stringify(c));
      }
      catch (e) {
          /* eslint-disable-next-line */
          return;
      }
  };
  const configFromURL = (win) => {
      const configObj = {};
      win.location.search.slice(1)
          .split('&')
          .map(entry => entry.split('='))
          .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
          .filter(([key]) => startsWith(key, SKYLINE_PREFIX))
          .map(([key, value]) => [key.slice(SKYLINE_PREFIX.length), value])
          .forEach(([key, value]) => {
          configObj[key] = value;
      });
      return configObj;
  };

  let defaultMode;
  const getMode = (elm) => {
      while (elm) {
          const elmMode = elm.mode || elm.getAttribute('mode');
          if (elmMode) {
              return elmMode;
          }
          elm = elm.parentElement;
      }
      return defaultMode;
  };
  const getSkylineMode = (ref) => {
      return (ref && getMode(ref)) || defaultMode;
  };
  function setupConfig() {
      const doc = document;
      const win = window;
      const Skyline = win.Skyline = win.Skyline || {};
      // create the Skyline.config from raw config object (if it exists)
      // and convert Skyline.config into a ConfigApi that has a get() fn
      const configObj = {
          ...configFromSession(win),
          persistConfig: false,
          ...Skyline.config,
          ...configFromURL(win),
      };
      config.reset(configObj);
      if (config.getBoolean('persistConfig')) {
          saveConfig(win, configObj);
      }
      // first see if the mode was set as an attribute on <html>
      // which could have been set by the user, or by pre-rendering
      // otherwise get the mode via config settings, and fallback to ios
      Skyline.config = config;
      Skyline.mode = defaultMode = config.get('mode', (doc.documentElement.getAttribute('mode')) || (isPlatform(win, 'android') ? 'md' : 'ios'));
      config.set('mode', defaultMode);
      doc.documentElement.setAttribute('mode', defaultMode);
      doc.documentElement.classList.add(defaultMode);
      if (config.getBoolean('testing')) {
          config.set('animated', false);
      }
  }

  function usePopup(options) {
      const { disableScroll = true } = options || {};
      let closeReason;
      // TODO
      // animation should move to instance
      let animation;
      async function animate(baseEl, popup, builder) {
          const { build: animationBuilder, options, } = builder;
          animation = animationBuilder(baseEl, options);
          if (popup.transition || !config.getBoolean('animated', true)) {
              animation.duration(0);
          }
          if (popup.closeOnEscape) {
              animation.beforeAddWrite(() => {
                  const activeElement = baseEl.ownerDocument.activeElement;
                  if (activeElement && activeElement.matches('input, textarea')) {
                      activeElement.blur();
                  }
              });
          }
          await animation.play();
          animation = null;
          return true;
      }
      return createMixins({
          mixins: [
              useModel('visible'),
              useLazy('visible'),
              useRemote(),
              // Alway use transition
              // as our lifecycle event depends on it
              useTransition({ css: false }),
          ],
          props: {
              // This property holds whether the popup show the overlay.
              overlay: {
                  type: Boolean,
                  default: true,
              },
              // This property holds whether the popup dims the background.
              // Unless explicitly set, this property follows the value of modal.
              dim: {
                  type: Boolean,
                  default: undefined,
              },
              // This property holds whether the popup translucent the content.
              translucent: {
                  type: Boolean,
                  default: false,
              },
              // This property holds whether the popup is modal.
              //
              // Modal popups often have a distinctive background dimming effect defined
              // in overlay.modal, and do not allow press or release events through to
              // items beneath them.
              //
              // On desktop platforms, it is common for modal popups
              // to be closed only when the escape key is pressed. To achieve this
              // behavior, set closePolicy to Popup.CloseOnEscape.
              modal: {
                  type: Boolean,
                  default: false,
              },
              // The popup will close when the mouse is click outside of it.
              closeOnClickOutside: {
                  type: Boolean,
                  default: true,
              },
              // The popup will close when the escape key is pressed while the popup has
              // active focus.
              closeOnEscape: {
                  type: Boolean,
                  default: true,
              },
              activeFocus: {
                  type: Boolean,
                  default: true,
              },
          },
          beforeMount() {
              // This property holds whether the popup is fully open.
              // The popup is considered opened when it's visible
              // and neither the enter nor exit transitions are running.
              this.opened = false;
              this.opening = false;
              this.closing = false;
              // Scroll blocker
              this.blocker = GESTURE_CONTROLLER.createBlocker({
                  disableScroll,
              });
              // internal flag
              this.destroyWhenClose = false;
              const onBeforeEnter = () => {
                  this.blocker.block();
                  this.opened = false;
                  this.opening = true;
                  this.$emit('aboutToShow');
                  popupContext.push(this);
              };
              const onEnter = async (el, done) => {
                  // TODO
                  // hide root element by add some classes
                  //
                  // Ensure element & element's child is inserted as animation may need to calc element's size
                  await this.$nextTick();
                  // update zIndex
                  el.style.zIndex = `${popupContext.getOverlayIndex()}`;
                  const builder = {};
                  this.$emit('animation-enter', builder);
                  try {
                      await animate(el, this, builder);
                  }
                  catch (e) {
                      console.error(e);
                  }
                  done();
              };
              const onAfterEnter = () => {
                  this.opened = true;
                  this.opening = false;
                  this.$emit('opened');
              };
              const onBeforeLeave = () => {
                  this.$emit('aboutToHide');
                  this.opened = false;
                  this.closing = true;
              };
              const onLeave = async (el, done) => {
                  const builder = {};
                  this.$emit('animation-leave', builder);
                  try {
                      await animate(el, this, builder);
                  }
                  catch (e) {
                      console.error(e);
                  }
                  done();
              };
              const onAfterLeave = async () => {
                  this.closing = false;
                  popupContext.pop(this);
                  this.$emit('closed', closeReason);
                  this.blocker.unblock();
                  if (this.destroyWhenClose) {
                      await this.$nextTick();
                      this.$destroy();
                      this.$el.remove();
                  }
              };
              const onCancel = async () => {
                  this.opening = false;
                  this.closing = false;
                  this.$emit('canceled');
                  if (!animation)
                      return;
                  animation.destroy();
                  animation = null;
              };
              this.$on('before-enter', onBeforeEnter);
              this.$on('after-enter', onAfterEnter);
              this.$on('before-leave', onBeforeLeave);
              this.$on('after-leave', onAfterLeave);
              this.$on('enter', onEnter);
              this.$on('enter-cancelled', onCancel);
              this.$on('leave', onLeave);
              this.$on('leave-cancelled', onCancel);
              // TODO:
              // Find some way to create overlay inside mixins
              const onClickOutside = () => {
                  if (!this.closeOnClickOutside)
                      return;
                  this.visible = false;
              };
              this.$on('overlay-tap', onClickOutside);
              this.$on('clickoutside', onClickOutside);
              this.visible = this.inited = this.visible || (isDef(this.$attrs.visible)
                  && this.$attrs.visible !== false);
          },
          mounted() {
              if (this.value) {
                  this.open();
              }
          },
          activated() {
              if (this.value) {
                  this.open();
              }
          },
          deactivated() {
              this.close();
          },
          beforeDestroy() {
              this.close();
          },
          methods: {
              open(ev) {
                  if (this.$isServer)
                      return true;
                  if (this.opened)
                      return false;
                  this.event = ev;
                  this.inited = true;
                  this.visible = true;
                  // this.blocker.block();
                  return true;
              },
              close(reason) {
                  if (this.$isServer)
                      return true;
                  if (!this.opened)
                      return false;
                  this.visible = false;
                  closeReason = reason;
                  // this.blocker.unblock();
                  return true;
              },
              focus() {
                  // TODO
                  // if modal
                  // add shake animation
                  const builder = {
                      build: (baseEl) => {
                          const baseAnimation = createAnimation();
                          window.baseAnimation = baseAnimation;
                          return baseAnimation
                              .addElement(baseEl.querySelector('.line-tooltip__content'))
                              .easing('cubic-bezier(0.25, 0.8, 0.25, 1)')
                              .duration(150)
                              .beforeStyles({ 'transform-origin': 'center' })
                              .keyframes([
                              { offset: 0, transform: 'scale(1)' },
                              { offset: 0.5, transform: 'scale(1.03)' },
                              { offset: 1, transform: 'scale(1)' },
                          ]);
                      },
                  };
                  this.$emit('animation-focus', builder);
                  animate(this.$el, this, builder);
                  const firstInput = this.$el.querySelector('input,button');
                  if (firstInput) {
                      firstInput.focus();
                  }
              },
          },
      });
  }

  const {
    createComponent: createComponent$2,
    bem: bem$2
  } =
  /*#__PURE__*/
  createNamespace('overlay');

  const now$1 = ev => ev.timeStamp || Date.now();

  var Overlay = /*#__PURE__*/
  createComponent$2({
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      tappable: {
        type: Boolean,
        default: true
      },
      stopPropagation: {
        type: Boolean,
        default: true
      }
    },

    beforeMount() {
      this.lastClick = -10000;
    },

    methods: {
      onTouchStart(ev) {
        this.emitTap(ev);
      },

      onMouseDown(ev) {
        if (this.lastClick < now$1(ev) - 1500) {
          this.emitTap(ev);
        }
      },

      emitTap(ev) {
        this.lastClick = now$1(ev);

        if (this.stopPropagation) {
          ev.preventDefault();
          ev.stopPropagation();
        }

        if (this.tappable) {
          this.$emit('tap', ev);
        }
      }

    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "attrs": {
          "tabindex": "-1"
        },
        "class": bem$2({
          hide: !this.visible,
          'no-tappable': !this.tappable
        })
      }, {
        "on": {
          '!touchstart': this.onTouchStart,
          '!click': this.onMouseDown,
          '!mousedown': this.onMouseDown
        }
      }]), [this.slots()]);
    }

  });

  /**
   * iOS Action Sheet Enter Animation
   */
  const iosEnterAnimation = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-action-sheet__wrapper'))
          .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Action Sheet Leave Animation
   */
  const iosLeaveAnimation = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-action-sheet__wrapper'))
          .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(450)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * MD Action Sheet Enter Animation
   */
  const mdEnterAnimation = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-action-sheet__wrapper'))
          .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * MD Action Sheet Leave Animation
   */
  const mdLeaveAnimation = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-action-sheet__wrapper'))
          .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(450)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$3,
    bem: bem$3
  } =
  /*#__PURE__*/
  createNamespace('action-sheet');
  var actionSheet = /*#__PURE__*/
  createComponent$3({
    mixins: [
    /*#__PURE__*/
    usePopup()],
    props: {
      header: String,
      subHeader: String,
      actions: {
        type: Array,
        default: []
      }
    },
    computed: {
      normalizedActions() {
        const {
          actions
        } = this;
        return actions.map(action => {
          return typeof action === 'string' ? {
            text: action
          } : action;
        });
      },

      optionActions() {
        return this.normalizedActions.filter(action => action.role !== 'cancel');
      },

      cancelAction() {
        return this.normalizedActions.find(action => action.role === 'cancel');
      }

    },

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      });
    },

    methods: {
      onTap() {
        this.$emit('overlay-tap');
      }

    },

    render() {
      const h = arguments[0];
      const {
        optionActions,
        cancelAction
      } = this;
      return h("div", {
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "role": "dialog",
          "aria-modal": "true"
        },
        "class": bem$3({
          translucent: this.translucent
        })
      }, [h(Overlay, {
        "attrs": {
          "visible": this.dim
        },
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "attrs": {
          "role": "dialog"
        },
        "class": bem$3('wrapper')
      }, [h("div", {
        "class": bem$3('container')
      }, [h("div", {
        "class": bem$3('group')
      }, [this.header && h("div", {
        "class": bem$3('title')
      }, [this.header, this.subHeader && h("div", {
        "class": bem$3('sub-title')
      }, [this.subHeader])]), optionActions.map(action => h("button", {
        "attrs": {
          "type": "button"
        },
        "class": [bem$3('button', {
          [`${action.role}`]: !!action.role
        }), 'line-activatable']
      }, [h("span", {
        "class": bem$3('button-inner')
      }, [action.text])]))]), cancelAction && h("div", {
        "class": bem$3('group', {
          cancel: true
        })
      }, [h("button", {
        "attrs": {
          "type": "button"
        },
        "class": [bem$3('button', {
          [`${cancelAction.role}`]: !!cancelAction.role
        }), 'line-activatable']
      }, [h("span", {
        "class": bem$3('button-inner')
      }, [cancelAction.text])])])])])]);
    }

  });

  /**
   * iOS Alert Enter Animation
   */
  const iosEnterAnimation$1 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-alert__wrapper'))
          .keyframes([
          { offset: 0, opacity: '0.01', transform: 'scale(1.1)' },
          { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Alert Leave Animation
   */
  const iosLeaveAnimation$1 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-alert__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.99, transform: 'scale(1)' },
          { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Alert Enter Animation
   */
  const mdEnterAnimation$1 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-alert__wrapper'))
          .keyframes([
          { offset: 0, opacity: '0.01', transform: 'scale(0.9)' },
          { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(150)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Alert Leave Animation
   */
  const mdLeaveAnimation$1 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-alert__wrapper'))
          .fromTo('opacity', 0.99, 0);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(150)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$4,
    bem: bem$4
  } =
  /*#__PURE__*/
  createNamespace('alert');
  const isCancel = role => {
    return role === 'cancel' || role === 'overlay';
  };
  var alert = /*#__PURE__*/
  createComponent$4({
    mixins: [
    /*#__PURE__*/
    usePopup()],
    props: {
      header: String,
      subHeader: String,
      message: String,
      inputs: Array,
      buttons: {
        type: Array,
        default: []
      }
    },

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation$1 : iosEnterAnimation$1;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation$1 : iosLeaveAnimation$1;
      });
    },

    computed: {
      normalizedButtons() {
        const {
          buttons = []
        } = this;
        return buttons.map(btn => {
          return typeof btn === 'string' ? {
            text: btn,
            role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined
          } : btn;
        });
      },

      normalizedInputs() {
        const {
          inputs = []
        } = this; // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.

        const inputTypes = new Set(inputs.map(i => i.type));

        if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
          console.warn(`Alert cannot mix input types: ${Array.from(inputTypes.values()).join('/')}. Please see alert docs for more info.`);
        }

        return inputs.map((i, index) => ({
          type: i.type || 'text',
          name: i.name || `${index}`,
          placeholder: i.placeholder || '',
          value: i.value,
          label: i.label,
          checked: !!i.checked,
          disabled: !!i.disabled,
          handler: i.handler,
          min: i.min,
          max: i.max
        }));
      },

      cachedButtons() {
        const h = this.$createElement;
        return h("div", {
          "class": bem$4('button-group', {
            vertical: this.normalizedButtons.length > 2
          })
        }, [this.normalizedButtons.map(button => h("button", {
          "attrs": {
            "type": "button",
            "tabIndex": 0
          },
          "class": [bem$4('button'), 'line-focusable', 'line-activatable'],
          "on": {
            "click": () => this.onButtonClick(button)
          }
        }, [h("span", {
          "class": bem$4('button-inner')
        }, [button.text])]))]);
      }

    },
    methods: {
      onTap() {
        this.$emit('overlay-tap');
      },

      /* eslint-disable-next-line consistent-return */
      onButtonClick(button) {
        const {
          role
        } = button; // const values = this.getValues();

        if (isCancel(role)) {
          return this.close(role);
        }

        let returnData;

        if (button && button.handler) {
          // a handler has been provided, execute it
          // pass the handler the values from the inputs
          try {
            returnData = button.handler(role);
          } catch (error) {
            console.error(error);
          }
        }

        if (returnData !== false) {
          return this.close(role);
        }
      }

    },

    render() {
      const h = arguments[0];
      const {
        header,
        subHeader
      } = this;
      return h("div", {
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "role": "dialog",
          "aria-modal": "true"
        },
        "class": bem$4({
          translucent: this.translucent
        })
      }, [h(Overlay, {
        "attrs": {
          "visible": this.dim
        },
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "class": bem$4('wrapper')
      }, [h("div", {
        "class": bem$4('head')
      }, [header && h("h2", {
        "class": bem$4('title')
      }, [header]), subHeader && h("h2", {
        "class": bem$4('sub-title')
      }, [subHeader])]), h("div", {
        "class": bem$4('message')
      }, [this.message]), this.cachedButtons])]);
    }

  });

  // Cross-browser support as described in:
  // https://stackoverflow.com/questions/1248081
  const getClientWidth = () => {
      if (typeof document === 'undefined')
          return 0; // SSR
      return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  };
  const getClientHeight = () => {
      if (typeof document === 'undefined')
          return 0; // SSR
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  };

  function createElementProxy(element) {
      return new Proxy({}, {
          get(target, key, receiver) {
              if (key in target) {
                  return Reflect.get(target, key, receiver);
              }
              if (key in element) {
                  const value = Reflect.get(element, key);
                  Reflect.set(target, key, isFunction(value) ? value.bind(element) : value);
              }
              return Reflect.get(target, key, receiver);
          },
      });
  }

  const pointerCoord = (ev) => {
      // get X coordinates for either a mouse click
      // or a touch depending on the given event
      if (ev) {
          const { changedTouches } = ev;
          if (changedTouches && changedTouches.length > 0) {
              const touch = changedTouches[0];
              return { x: touch.clientX, y: touch.clientY };
          }
          if (ev.pageX !== undefined) {
              return { x: ev.pageX, y: ev.pageY };
          }
      }
      return { x: 0, y: 0 };
  };

  const hasWindow = typeof window !== 'undefined';
  let supportsVars;
  const isSupportsVars = () => {
      if (supportsVars === undefined) {
          supportsVars = !!(window.CSS && window.CSS.supports && window.CSS.supports('--a: 0'));
      }
      return supportsVars;
  };
  const now$2 = (ev) => ev.timeStamp || Date.now();

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const ACTIVATED = 'line-activated';
  const ACTIVATABLE = 'line-activatable';
  const ACTIVATABLE_INSTANT = 'line-activatable-instant';
  const ADD_ACTIVATED_DEFERS = 200;
  const CLEAR_STATE_DEFERS = 200;
  const MOUSE_WAIT$1 = 2500;
  const setupTapClick = (config) => {
      let lastTouch = -MOUSE_WAIT$1 * 10;
      let lastActivated = 0;
      let scrollingEl;
      let activatableEle;
      let activeRipple;
      let activeDefer;
      const clearDefers = new WeakMap();
      const isScrolling = () => {
          return scrollingEl !== undefined && scrollingEl.parentElement !== null;
      };
      // Touch Events
      const onTouchStart = (ev) => {
          lastTouch = now$2(ev);
          pointerDown(ev);
      };
      const onTouchEnd = (ev) => {
          lastTouch = now$2(ev);
          pointerUp(ev);
      };
      const onMouseDown = (ev) => {
          const t = now$2(ev) - MOUSE_WAIT$1;
          if (lastTouch < t) {
              pointerDown(ev);
          }
      };
      const onMouseUp = (ev) => {
          const t = now$2(ev) - MOUSE_WAIT$1;
          if (lastTouch < t) {
              pointerUp(ev);
          }
      };
      const cancelActive = () => {
          clearTimeout(activeDefer);
          activeDefer = undefined;
          if (activatableEle) {
              removeActivated(false);
              activatableEle = undefined;
          }
      };
      const pointerDown = (ev) => {
          if (activatableEle || isScrolling()) {
              return;
          }
          scrollingEl = undefined;
          setActivatedElement(getActivatableTarget(ev), ev);
      };
      const pointerUp = (ev) => {
          setActivatedElement(undefined, ev);
      };
      const setActivatedElement = (el, ev) => {
          // do nothing
          if (el && el === activatableEle) {
              return;
          }
          clearTimeout(activeDefer);
          activeDefer = undefined;
          const { x, y } = pointerCoord(ev);
          // deactivate selected
          if (activatableEle) {
              if (clearDefers.has(activatableEle)) {
                  throw new Error('internal error');
              }
              if (!activatableEle.classList.contains(ACTIVATED)) {
                  addActivated(activatableEle, x, y);
              }
              removeActivated(true);
          }
          // activate
          if (el) {
              const deferId = clearDefers.get(el);
              if (deferId) {
                  clearTimeout(deferId);
                  clearDefers.delete(el);
              }
              const delay = isInstant(el) ? 0 : ADD_ACTIVATED_DEFERS;
              el.classList.remove(ACTIVATED);
              activeDefer = setTimeout(() => {
                  addActivated(el, x, y);
                  activeDefer = undefined;
              }, delay);
          }
          activatableEle = el;
      };
      const addActivated = (el, x, y) => {
          lastActivated = Date.now();
          setTimeout(() => {
              el.classList.add(ACTIVATED);
              const rippleEffect =  getRippleEffect(el);
              if (rippleEffect && rippleEffect.addRipple) {
                  removeRipple();
                  activeRipple = rippleEffect.addRipple(x, y);
              }
          });
      };
      const removeRipple = () => {
          if (activeRipple !== undefined) {
              activeRipple.then(remove => remove());
              activeRipple = undefined;
          }
      };
      const removeActivated = (smooth) => {
          removeRipple();
          const active = activatableEle;
          if (!active) {
              return;
          }
          const time = CLEAR_STATE_DEFERS - Date.now() + lastActivated;
          if (smooth && time > 0 && !isInstant(active)) {
              const deferId = setTimeout(() => {
                  active.classList.remove(ACTIVATED);
                  clearDefers.delete(active);
              }, CLEAR_STATE_DEFERS);
              clearDefers.set(active, deferId);
          }
          else {
              active.classList.remove(ACTIVATED);
          }
      };
      const doc = document;
      doc.addEventListener('scrollstart', (ev) => {
          scrollingEl = ev.target;
          cancelActive();
      });
      doc.addEventListener('scrollend', () => {
          scrollingEl = undefined;
      });
      doc.addEventListener('gesturecaptured', cancelActive);
      doc.addEventListener('touchstart', onTouchStart, true);
      doc.addEventListener('touchcancel', onTouchEnd, true);
      doc.addEventListener('touchend', onTouchEnd, true);
      doc.addEventListener('mousedown', onMouseDown, true);
      doc.addEventListener('mouseup', onMouseUp, true);
  };
  const getActivatableTarget = (ev) => {
      if (ev.composedPath) {
          const path = ev.composedPath();
          for (let i = 0; i < path.length - 2; i++) {
              const el = path[i];
              if (el.vRipple) {
                  return el;
              }
              if (el.classList && el.classList.contains(ACTIVATABLE)) {
                  return el;
              }
          }
          return undefined;
      }
      return ev.target.closest('.activatable');
  };
  const isInstant = (el) => {
      return el.classList.contains(ACTIVATABLE_INSTANT);
  };
  const getRippleEffect = (el) => {
      return el.vRipple;
  };

  const LINE_FOCUSED = 'line-focused';
  const LINE_FOCUSABLE = 'line-focusable';
  const FOCUS_KEYS = ['Tab', 'ArrowDown', 'Space', 'Escape', ' ', 'Shift', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp'];
  const setupFocusVisible = () => {
      let currentFocus = [];
      let keyboardMode = true;
      const doc = document;
      const setFocus = (elements) => {
          currentFocus.forEach(el => el.classList.remove(LINE_FOCUSED));
          elements.forEach(el => el.classList.add(LINE_FOCUSED));
          currentFocus = elements;
      };
      const pointerDown = () => {
          keyboardMode = false;
          setFocus([]);
      };
      doc.addEventListener('keydown', ev => {
          keyboardMode = FOCUS_KEYS.includes(ev.key);
          if (!keyboardMode) {
              setFocus([]);
          }
      });
      doc.addEventListener('focusin', ev => {
          if (keyboardMode && ev.composedPath) {
              const toFocus = ev.composedPath().filter((el) => {
                  if (el.classList) {
                      return el.classList.contains(LINE_FOCUSABLE);
                  }
                  return false;
              });
              setFocus(toFocus);
          }
      });
      doc.addEventListener('focusout', () => {
          if (doc.activeElement === doc.body) {
              setFocus([]);
          }
      });
      doc.addEventListener('touchstart', pointerDown);
      doc.addEventListener('mousedown', pointerDown);
  };

  const {
    createComponent: createComponent$5,
    bem: bem$5
  } =
  /*#__PURE__*/
  createNamespace('app');
  var app = /*#__PURE__*/
  createComponent$5({
    props: {
      id: {
        type: String,
        default: 'app'
      }
    },

    provide() {
      return {
        App: this
      };
    },

    beforeMount() {
      // TODO:
      // config must be setup before using
      // while child content is rendered before created
      setupConfig();
      setupPlatforms();
      setupTapClick();
      setupFocusVisible();
      setupPopup();
    },

    render() {
      const h = arguments[0];
      return h("div", {
        "attrs": {
          "id": this.id,
          "skyline-app": true
        },
        "class": [bem$5(), 'line-page']
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$6,
    bem: bem$6
  } =
  /*#__PURE__*/
  createNamespace('avatar');
  var avatar = /*#__PURE__*/
  createComponent$6({
    functional: true,

    render(h, ctx) {
      return h("div", helper([{
        "class": bem$6()
      }, ctx.data]), [ctx.slots()]);
    }

  });

  function createColorClasses(color) {
      if (!color)
          return undefined;
      return {
          'line-color': true,
          [`line-color-${color}`]: true,
      };
  }
  function useColor() {
      return createMixins({
          props: {
              /**
               * The color to use from your application's color palette.
               * Default options are:
               * `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`,
               * `"light"`, `"medium"`, and `"dark"`.
              */
              color: String,
          },
          afterRender(vnode) {
              if (!vnode || !vnode.data)
                  return;
              if (!this.color)
                  return;
              vnode.data.staticClass = renderClass(vnode.data.staticClass, createColorClasses(this.color));
          },
      });
  }

  const {
    createComponent: createComponent$7,
    bem: bem$7
  } =
  /*#__PURE__*/
  createNamespace('badge');
  var badge = /*#__PURE__*/
  createComponent$7({
    mixins: [
    /*#__PURE__*/
    useColor()],

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$7()
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$8,
    bem: bem$8
  } =
  /*#__PURE__*/
  createNamespace('busy-indicator');
  var busyIndicator = /*#__PURE__*/
  createComponent$8({
    functional: true,
    props: {
      running: Boolean
    },

    render(h, {
      props,
      data,
      slots
    }) {
      return h("div", helper([{
        "class": bem$8({
          running: props.running
        })
      }, data]), [slots()]);
    }

  });

  const NAMESPACE$2 = 'ButtonGroup';
  const {
    createComponent: createComponent$9,
    bem: bem$9
  } =
  /*#__PURE__*/
  createNamespace('button-group');
  var buttonGroup = /*#__PURE__*/
  createComponent$9({
    mixins: [
    /*#__PURE__*/
    useGroup(NAMESPACE$2)],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$9()
      }, [this.slots()]);
    }

  });

  const NAMESPACE$3 = 'ButtonGroup';
  const {
    createComponent: createComponent$a,
    bem: bem$a
  } =
  /*#__PURE__*/
  createNamespace('button');
  var button = /*#__PURE__*/
  createComponent$a({
    mixins: [
    /*#__PURE__*/
    useColor(),
    /*#__PURE__*/
    useGroupItem(NAMESPACE$3)],
    directives: {
      ripple: Ripple
    },
    props: {
      text: String,
      strong: Boolean,
      disabled: Boolean,
      ripple: Boolean,
      // display in vertical mode, default horizontal
      vertical: Boolean,
      // full | block
      expand: String,
      // clear | outline | solid
      fill: String,
      // round | circle
      shape: String,
      // small | large
      size: String,
      // 'submit' | 'reset' | 'button' = 'button';
      type: String,
      download: String,
      href: String,
      rel: String,
      target: String,
      // override default
      checkable: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        inToolbar: false,
        inListHeader: false,
        inItem: false
      };
    },

    mounted() {
      this.inToolbar = !!this.$el.closest('.line-toolbar');
      this.inListHeader = !!this.$el.closest('.line-list-header');
      this.inItem = !!this.$el.closest('.line-item') || !!this.$el.closest('.line-item-divider');
    },

    render() {
      const h = arguments[0];
      const {
        text,
        strong,
        disabled,
        ripple,
        vertical,
        expand,
        fill,
        shape,
        size,
        type = 'button',
        download,
        href,
        rel,
        target,
        inItem,
        inToolbar,
        inListHeader
      } = this;
      const finalSize = !isDef(size) && inItem ? 'small' : size;
      const finalFill = !isDef(fill) && (inToolbar || inListHeader) ? 'clear' : 'solid';
      const TagType = isDef(href) ? 'a' : 'button';
      const attrs = TagType === 'button' ? {
        type
      } : {
        download,
        href,
        rel,
        target
      };
      return h("div", helper([{
        "attrs": {
          "disabled": disabled,
          "aria-disabled": disabled ? 'true' : null
        },
        "class": ['line-activatable', 'line-focusable', bem$a({
          [expand]: isDef(expand),
          [finalSize]: isDef(finalSize),
          [shape]: isDef(shape),
          [finalFill]: true,
          strong,
          disabled
        })]
      }, {
        "on": this.$listeners
      }]), [h(TagType, {
        "attrs": { ...attrs,
          "disabled": disabled
        },
        "directives": [{
          name: "ripple",
          value: ripple
        }],
        "class": bem$a('content', {
          vertical
        })
      }, [this.slots('icon-only'), this.slots('start'), this.slots('indicator'), this.slots() || text, this.slots('end')])]);
    }

  });

  const {
    createComponent: createComponent$b,
    bem: bem$b
  } =
  /*#__PURE__*/
  createNamespace('card-content');
  var cardContent = /*#__PURE__*/
  createComponent$b({
    mixins: [
    /*#__PURE__*/
    useColor()],

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$b()
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$c,
    bem: bem$c
  } =
  /*#__PURE__*/
  createNamespace('card-header');
  var cardHeader = /*#__PURE__*/
  createComponent$c({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {
      translucent: Boolean
    },

    render() {
      const h = arguments[0];
      const {
        translucent
      } = this;
      return h("div", helper([{
        "class": [bem$c({
          translucent
        }), 'line-inherit-color']
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$d,
    bem: bem$d
  } =
  /*#__PURE__*/
  createNamespace('card-subtitle');
  var cardSubtitle = /*#__PURE__*/
  createComponent$d({
    mixins: [
    /*#__PURE__*/
    useColor()],

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "attrs": {
          "role": "heading",
          "aria-level": "3"
        },
        "class": [bem$d(), 'line-inherit-color']
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$e,
    bem: bem$e
  } =
  /*#__PURE__*/
  createNamespace('card-title');
  var cardTitle = /*#__PURE__*/
  createComponent$e({
    mixins: [
    /*#__PURE__*/
    useColor()],

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "attrs": {
          "role": "heading",
          "aria-level": "2"
        },
        "class": [bem$e(), 'line-inherit-color']
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$f,
    bem: bem$f
  } =
  /*#__PURE__*/
  createNamespace('card');
  var card = /*#__PURE__*/
  createComponent$f({
    mixins: [
    /*#__PURE__*/
    useColor()],
    directives: {
      ripple: Ripple
    },
    props: {
      button: Boolean,
      // 'submit' | 'reset' | 'button' = 'button';
      type: String,
      disabled: Boolean,
      download: String,
      href: String,
      rel: String,
      ripple: Boolean,
      target: String
    },
    computed: {
      clickable() {
        return this.href !== undefined || this.button;
      }

    },

    render() {
      const h = arguments[0];
      const {
        mode,
        disabled,
        clickable,
        type,
        href,
        download,
        rel,
        target
      } = this;
      const TagType = clickable ? isDef(href) ? 'a' : 'button' : 'div';
      const attrs = TagType === 'button' ? {
        type
      } : {
        download,
        href,
        rel,
        target
      };
      return h("div", helper([{
        "class": [bem$f(), {
          'card-disabled': disabled,
          'line-activatable': clickable
        }]
      }, {
        "on": this.$listeners
      }]), [!clickable ? this.slots() : h(TagType, {
        "attrs": { ...attrs,
          "disabled": disabled
        },
        "directives": [{
          name: "ripple",
          value: clickable && (Ripple || mode === 'md')
        }],
        "class": "card-native"
      }, [this.slots()])]);
    }

  });

  const {
    createComponent: createComponent$g,
    bem: bem$g
  } =
  /*#__PURE__*/
  createNamespace('cell-group');
  var cellGroup = /*#__PURE__*/
  createComponent$g({
    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$g()
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$h,
    bem: bem$h
  } =
  /*#__PURE__*/
  createNamespace('font-icon');

  function getDefaultText(slots) {
    const nodes = slots();
    const text = nodes && nodes[0].text || '';
    return text.trim();
  }

  var FontIcon = /*#__PURE__*/
  createComponent$h({
    functional: true,
    props: {
      name: String,
      source: String,
      size: String,
      color: String
    },

    render(h, {
      props,
      data,
      slots
    }) {
      const {
        name,
        size,
        color
      } = props;
      const text = name || getDefaultText(slots);
      return h("i", helper([{
        "class": ['line-icon', 'material-icons', bem$h({
          [`${size}`]: !!size
        }), createColorClasses(color)],
        "attrs": {
          "aria-hidden": !data.attrs['aria-label'],
          "aria-label": data.attrs['aria-label'] || text
        }
      }, data]), [text]);
    }

  });

  const {
    createComponent: createComponent$i,
    bem: bem$i
  } =
  /*#__PURE__*/
  createNamespace('svg-icon');

  function getDefaultText$1(slots) {
    const nodes = slots();
    const text = nodes && nodes[0].text || '';
    return text.trim();
  }

  var SvgIcon = /*#__PURE__*/
  createComponent$i({
    functional: true,
    props: {
      name: String,
      source: String,
      size: String,
      color: String,
      viewBox: String,
      outline: Boolean
    },

    render(h, {
      props,
      data,
      slots
    }) {
      data.attrs = Object(data.attrs);
      const {
        name,
        size,
        color,
        viewBox,
        outline
      } = props;
      const text = name || getDefaultText$1(slots);
      const href = `${props.source || ''}#${text}`;
      return h("div", helper([{
        "class": ['line-icon', bem$i({
          [`${size}`]: !!size
        }), createColorClasses(color)]
      }, data]), [h("svg", {
        "attrs": {
          "xmlns": "http://www.w3.org/2000/svg",
          "role": "img",
          "viewBox": viewBox,
          "aria-hidden": !data.attrs['aria-label'],
          "aria-label": data.attrs['aria-label'] || text
        }
      }, [text ? h("use", {
        "attrs": {
          "href": href,
          "xlink:href": href
        },
        "class": {
          'line-icon-fill-none': outline,
          'line-icon-stroke-width': outline
        }
      }) : slots('content')])]);
    }

  });

  const {
    createComponent: createComponent$j
  } =
  /*#__PURE__*/
  createNamespace('icon');
  var Icon = /*#__PURE__*/
  createComponent$j({
    functional: true,

    render(h, {
      data,
      children
    }) {
      const hasSource = data.attrs && 'source' in data.attrs;

      if (hasSource) {
        return h(SvgIcon, data, children);
      }

      return h(FontIcon, data, children);
    }

  });

  const {
    createComponent: createComponent$k,
    bem: bem$j
  } =
  /*#__PURE__*/
  createNamespace('cell');
  var cell = /*#__PURE__*/
  createComponent$k({
    components: {
      Icon
    },
    props: {
      title: {
        type: [String, Number],
        default: ''
      },
      content: {
        type: [String, Number],
        default: ''
      },
      arrow: {
        type: Boolean,
        default: false
      }
    },

    render() {
      const h = arguments[0];
      const {
        arrow
      } = this;
      return h("div", helper([{
        "class": bem$j({
          arrow
        })
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$j('title')
      }, [this.slots('title') || this.title]), h("div", {
        "class": bem$j('content')
      }, [this.slots('content') || this.content, arrow && h("span", {
        "class": bem$j('arrow')
      }, [h("icon", {
        "attrs": {
          "name": 'chevron_right',
          "width": "24",
          "height": "24"
        }
      })])])]);
    }

  });

  function useCheckGroup(name) {
      return createMixins({
          mixins: [
              useGroup(name),
          ],
          props: {
              exclusive: Boolean,
          },
          data() {
              return {
                  // TODO:
                  // Vue 3
                  // Use Set() instead of Array()
                  checkedItem: [],
              };
          },
          watch: {
              exclusive(val) {
                  if (!val)
                      return;
                  if (this.checkedItem.length > 1) {
                      const [first] = this.checkedItem;
                      this.checkedItem = [first];
                  }
              },
          },
          beforeMount() {
              const onItemChecked = (item, checked) => {
                  this.$emit('item:checked', item, !!checked);
                  if (this.exclusive) {
                      if (checked) {
                          this.checkedItem = item;
                          this.items.forEach((i) => {
                              if (i === item)
                                  return;
                              i.checked = false;
                          });
                      }
                      else if (this.checkedItem === item) {
                          this.checkedItem = null;
                      }
                  }
                  else {
                      this.checkedItem = this.checkedItem || [];
                      const index = this.checkedItem.indexOf(item);
                      if (checked && index === -1) {
                          this.checkedItem.push(item);
                      }
                      else if (!checked && index !== -1) {
                          this.checkedItem.splice(index, 1);
                      }
                  }
              };
              this.$on('item:register', (item) => {
                  item.$watch('checked', async (val, oldVal) => {
                      // false & undifined & null are all falsy value
                      // ignore it
                      if (!!oldVal === val)
                          return;
                      if (!this.exclusive) {
                          // handle check in next tick
                          // so checkedItem changes will fire only once if
                          // multiple items are changed
                          await this.$nextTick();
                      }
                      onItemChecked(item, val);
                  }, { immediate: true });
              });
          },
      });
  }
  function getItemValue(item) {
      const { modelValue, itemIndex } = item;
      return isDef(modelValue) ? modelValue : itemIndex;
  }
  function useCheckGroupWithModel(name, options) {
      return createMixins({
          mixins: [
              useCheckGroup(name),
              useModel('checkedItemValue', options, true),
          ],
          computed: {
              checkedItemValue: {
                  get() {
                      const { checkedItem } = this;
                      return isArray(checkedItem)
                          ? checkedItem.map(item => getItemValue(item))
                          : checkedItem && getItemValue(checkedItem);
                  },
                  async set(val) {
                      if (!val)
                          return;
                      // ensure item are all registered
                      await this.$nextTick();
                      // TODO
                      // may has perf impact if we have lots of items
                      this.items.forEach((item) => {
                          if (Array.isArray(val)) {
                              item.checked = val.includes(getItemValue(item));
                          }
                          else {
                              item.checked = getItemValue(item) === val;
                          }
                      });
                  },
              },
          },
      });
  }

  const NAMESPACE$4 = 'CheckBoxGroup';
  const {
    createComponent: createComponent$l,
    bem: bem$k
  } =
  /*#__PURE__*/
  createNamespace('check-box-group');
  var checkBoxGroup = /*#__PURE__*/
  createComponent$l({
    mixins: [
    /*#__PURE__*/
    useCheckGroup(NAMESPACE$4)],
    props: {// nextCheckState : {
      //   type : Function,
      //   default(checkState: CheckState) {
      //     return checkState === CheckState.Checked ? CheckState.Unchecked : CheckState.Checked;
      //   },
      // },
    },
    methods: {
      onClick() {
        this.checkState = this.nextCheckState(this.checkState);
      }

    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$k()
      }, [this.slots()]);
    }

  });

  function useCheckItem(name) {
      return createMixins({
          mixins: [useGroupItem(name)],
          props: {
              checkable: {
                  type: Boolean,
                  default: true,
              },
              disabled: Boolean,
          },
          data() {
              return {
                  checked: false,
              };
          },
          methods: {
              toggle() {
                  if (this.disabled)
                      return;
                  this.$emit('clicked');
                  if (!this.checkable)
                      return;
                  this.checked = !this.checked;
                  this.$emit('toggled', this.checked);
              },
          },
          beforeMount() {
              this.checked = this.checked || (isDef(this.$attrs.checked)
                  && this.$attrs.checked !== false);
          },
      });
  }
  function useCheckItemWithModel(name, options) {
      return createMixins({
          mixins: [
              useCheckItem(name),
              useModel('checked', options),
          ],
          props: {
              modelValue: null,
          },
      });
  }

  const {
    createComponent: createComponent$m,
    bem: bem$l
  } =
  /*#__PURE__*/
  createNamespace('check-indicator');
  let path;
  var CheckIndicator = /*#__PURE__*/
  createComponent$m({
    functional: true,
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      indeterminate: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    render(h, {
      props,
      data
    }) {
      return h(SvgIcon, helper([{
        "class": bem$l({
          checked: props.checked,
          indeterminate: props.indeterminate,
          disabled: props.disabled
        }),
        "scopedSlots": {
          content: () => path || (path = h('path', {
            attrs: {
              d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
            }
          }))
        }
      }, data]));
    }

  });

  const NAMESPACE$5 = 'CheckBoxGroup';
  const {
    createComponent: createComponent$n,
    bem: bem$m
  } =
  /*#__PURE__*/
  createNamespace('check-box');
  var checkBox = /*#__PURE__*/
  createComponent$n({
    mixins: [
    /*#__PURE__*/
    useCheckItem(NAMESPACE$5),
    /*#__PURE__*/
    useRipple(),
    /*#__PURE__*/
    useColor()],
    inject: {
      Item: {
        default: undefined
      }
    },
    props: {
      indeterminate: Boolean,
      text: String,
      color: String
    },

    data() {
      return {
        inItem: false
      };
    },

    mounted() {
      this.inItem = this.$el.closest('.line-item') !== null;
      this.emitStyle();
    },

    methods: {
      emitStyle() {
        if (!this.Item) return;
        this.Item.itemStyle('line-check-box', {
          'checkbox-checked': this.checked,
          'interactive-disabled': this.disabled
        });
      }

    },
    watch: {
      checked() {
        this.emitStyle();
      },

      disabled() {
        this.emitStyle();
      }

    },

    render() {
      const h = arguments[0];
      const {
        checked,
        indeterminate,
        disabled,
        text,
        inItem
      } = this;
      return h("div", {
        "class": [bem$m({
          disabled,
          indeterminate,
          checked
        }), {
          'in-item': inItem
        }],
        "attrs": {
          "role": "checkbox"
        },
        "on": {
          "click": this.toggle
        }
      }, [this.slots('indicator', {
        checked,
        indeterminate,
        disabled
      }) || h(CheckIndicator, {
        "attrs": {
          "checked": checked,
          "indeterminate": indeterminate,
          "disabled": disabled,
          "width": 26,
          "height": 26
        }
      }), this.slots() || text, h("button", {
        "attrs": {
          "type": "button",
          "disabled": disabled
        }
      })]);
    }

  });

  const {
    createComponent: createComponent$o,
    bem: bem$n
  } =
  /*#__PURE__*/
  createNamespace('chip');
  var chip = /*#__PURE__*/
  createComponent$o({
    mixins: [
    /*#__PURE__*/
    useColor()],
    directives: {
      ripple: Ripple
    },
    props: {
      ripple: Boolean,
      outline: Boolean
    },
    methods: {
      onClick() {
        this.$emit('close');
      }

    },

    render() {
      const h = arguments[0];
      const {
        ripple,
        outline
      } = this;
      return h("div", helper([{
        "directives": [{
          name: "ripple",
          value: ripple
        }],
        "class": [bem$n({
          outline
        }), {
          'line-activatable': true
        }]
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const SIZE_TO_MEDIA = {
      xs: '(min-width: 0px)',
      sm: '(min-width: 576px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 992px)',
      xl: '(min-width: 1200px)',
  };
  // Check if the window matches the media query
  // at the breakpoint passed
  // e.g. matchBreakpoint('sm') => true if screen width exceeds 576px
  const matchBreakpoint = (breakpoint) => {
      if (breakpoint === undefined || breakpoint === '') {
          return true;
      }
      if (window.matchMedia) {
          const mediaQuery = SIZE_TO_MEDIA[breakpoint];
          return window.matchMedia(mediaQuery).matches;
      }
      return false;
  };

  const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];
  const {
    createComponent: createComponent$p,
    bem: bem$o
  } =
  /*#__PURE__*/
  createNamespace('col');
  var col = /*#__PURE__*/
  createComponent$p({
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
      sizeXl: String
    },

    mounted() {
      window.addEventListener('resize', this.onResize, {
        passive: true
      });
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.onResize);
    },

    methods: {
      onResize() {
        this.$forceUpdate();
      },

      // Loop through all of the breakpoints to see if the media query
      // matches and grab the column value from the relevant prop if so
      getColumns(property) {
        let matched;

        for (const breakpoint of BREAKPOINTS) {
          const matches = matchBreakpoint(breakpoint); // Grab the value of the property, if it exists and our
          // media query matches we return the value

          const columns = this[property + breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)];

          if (matches && columns !== undefined) {
            matched = columns;
          }
        } // Return the last matched columns since the breakpoints
        // increase in size and we want to return the largest match


        return matched;
      },

      calculateSize() {
        const columns = this.getColumns('size'); // If size wasn't set for any breakpoint
        // or if the user set the size without a value
        // it means we need to stick with the default and return
        // e.g. <ion-col size-md>

        if (!columns || columns === '') {
          return;
        } // If the size is set to auto then don't calculate a size


        const colSize = columns === 'auto' ? 'auto' // If CSS supports variables we should use the grid columns var
        : isSupportsVars() ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)` // Convert the columns to a percentage by dividing by the total number
        // of columns (12) and then multiplying by 100
        : `${columns / 12 * 100}%`;
        /* eslint-disable-next-line consistent-return */

        return {
          flex: `0 0 ${colSize}`,
          width: `${colSize}`,
          'max-width': `${colSize}`
        };
      },

      // Called by push, pull, and offset since they use the same calculations
      calculatePosition(property, modifier) {
        const columns = this.getColumns(property);

        if (!columns) {
          return;
        } // If the number of columns passed are greater than 0 and less than
        // 12 we can position the column, else default to auto


        const amount = isSupportsVars() // If CSS supports variables we should use the grid columns var
        ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)` // Convert the columns to a percentage by dividing by the total number
        // of columns (12) and then multiplying by 100
        : columns > 0 && columns < 12 ? `${columns / 12 * 100}%` : 'auto';
        /* eslint-disable-next-line consistent-return */

        return {
          [modifier]: amount
        };
      },

      calculateOffset(isRTL) {
        return this.calculatePosition('offset', isRTL ? 'margin-right' : 'margin-left');
      },

      calculatePull(isRTL) {
        return this.calculatePosition('pull', isRTL ? 'left' : 'right');
      },

      calculatePush(isRTL) {
        return this.calculatePosition('push', isRTL ? 'right' : 'left');
      }

    },

    render() {
      const h = arguments[0];
      const isRTL = document.dir === 'rtl';
      return h("div", helper([{
        "class": bem$o(),
        "style": { ...this.calculateOffset(isRTL),
          ...this.calculatePull(isRTL),
          ...this.calculatePush(isRTL),
          ...this.calculateSize()
        }
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const NAMESPACE$6 = 'Collapse';
  const {
    createComponent: createComponent$q,
    bem: bem$p
  } =
  /*#__PURE__*/
  createNamespace('collapse-item');
  var collapseItem = /*#__PURE__*/
  createComponent$q({
    mixins: [
    /*#__PURE__*/
    useCheckItem(NAMESPACE$6)],
    components: {
      Icon
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClick() {
        if (this.checkable && !this.disabled) {
          this.checked = !this.checked;
        }
      }

    },

    render() {
      const h = arguments[0];
      const {
        checked,
        disabled,
        title
      } = this;
      return h("div", {
        "class": bem$p({
          active: checked
        })
      }, [h("div", {
        "class": bem$p('title', {
          disabled
        }),
        "on": {
          "click": this.onClick
        }
      }, [this.slots('title') || title, this.slots('icon') || h("icon", {
        "class": bem$p('title-icon', {
          rotate: checked
        }),
        "attrs": {
          "name": "expand_more",
          "width": "18",
          "height": "18"
        }
      })]), checked && h("div", {
        "class": bem$p('content')
      }, [this.slots()])]);
    }

  });

  const NAMESPACE$7 = 'Collapse';
  const {
    createComponent: createComponent$r,
    bem: bem$q
  } =
  /*#__PURE__*/
  createNamespace('collapse');
  var collapse = /*#__PURE__*/
  createComponent$r({
    mixins: [
    /*#__PURE__*/
    useCheckGroup(NAMESPACE$7)],
    props: {
      exclusive: {
        type: Boolean,
        default: true
      }
    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$q()
      }, [this.slots()]);
    }

  });

  async function scrollToPoint(scrollEl = document.scrollingElement
      || document.body
      || document.documentElement, x, y, duration = 0) {
      if (duration < 32) {
          if (y != null) {
              scrollEl.scrollTop = y;
          }
          if (x != null) {
              scrollEl.scrollLeft = x;
          }
          return;
      }
      let resolve;
      let startTime = 0;
      const promise = new Promise(r => resolve = r);
      const fromY = scrollEl.scrollTop;
      const fromX = scrollEl.scrollLeft;
      const deltaY = y != null ? y - fromY : 0;
      const deltaX = x != null ? x - fromX : 0;
      // scroll loop
      const step = (timeStamp) => {
          const linearTime = Math.min(1, ((timeStamp - startTime) / duration)) - 1;
          /* eslint-disable-next-line */
          const easedT = Math.pow(linearTime, 3) + 1;
          if (deltaY !== 0) {
              scrollEl.scrollTop = Math.floor((easedT * deltaY) + fromY);
          }
          if (deltaX !== 0) {
              scrollEl.scrollLeft = Math.floor((easedT * deltaX) + fromX);
          }
          if (easedT < 1) {
              // do not use DomController here
              // must use nativeRaf in order to fire in the next frame
              // TODO: remove as any
              requestAnimationFrame(step);
          }
          else {
              resolve();
          }
      };
      // chill out for a frame first
      requestAnimationFrame(ts => {
          startTime = ts;
          step(ts);
      });
      await promise;
  }
  async function scrollToTop(scrollEl, duration) {
      await scrollToPoint(scrollEl, undefined, 0, duration);
  }
  async function scrollToBottom(scrollEl, duration) {
      const y = scrollEl.scrollHeight - scrollEl.clientHeight;
      await scrollToPoint(scrollEl, undefined, y, duration);
  }
  async function scrollByPoint(scrollEl, x, y, duration) {
      await scrollToPoint(scrollEl, x + scrollEl.scrollLeft, y + scrollEl.scrollTop, duration);
  }
  const getOffsetX = (el) => {
      let offset = 0;
      while (el) {
          offset += el.offsetLeft;
          el = el.offsetParent;
      }
      return offset;
  };
  const getOffsetY = (el) => {
      let offset = 0;
      while (el) {
          offset += el.offsetTop;
          el = el.offsetParent;
      }
      return offset;
  };
  async function scrollToElement(scrollEl, el, duration) {
      if (!el)
          return;
      const x = getOffsetX(el) - getOffsetX(scrollEl);
      const y = getOffsetY(el) - getOffsetY(scrollEl);
      await scrollByPoint(scrollEl, x, y, duration);
  }

  const updateScrollDetail = (detail, el, timestamp, shouldStart) => {
      const prevX = detail.currentX;
      const prevY = detail.currentY;
      const prevT = detail.currentTime;
      const currentX = el.scrollLeft;
      const currentY = el.scrollTop;
      const timeDelta = timestamp - prevT;
      if (shouldStart) {
          // remember the start positions
          detail.startTime = timestamp;
          detail.startX = currentX;
          detail.startY = currentY;
          detail.velocityX = detail.velocityY = 0;
      }
      detail.currentTime = timestamp;
      detail.currentX = detail.scrollLeft = currentX;
      detail.currentY = detail.scrollTop = currentY;
      detail.deltaX = currentX - detail.startX;
      detail.deltaY = currentY - detail.startY;
      if (timeDelta > 0 && timeDelta < 100) {
          const velocityX = (currentX - prevX) / timeDelta;
          const velocityY = (currentY - prevY) / timeDelta;
          detail.velocityX = velocityX * 0.7 + detail.velocityX * 0.3;
          detail.velocityY = velocityY * 0.7 + detail.velocityY * 0.3;
      }
  };

  const {
    createComponent: createComponent$s,
    bem: bem$r
  } =
  /*#__PURE__*/
  createNamespace('content');

  const getParentElement = el => {
    if (el.parentElement) {
      // normal element with a parent element
      return el.parentElement;
    }

    if (el.parentNode && el.parentNode.host) {
      // shadow dom's document fragment
      return el.parentNode.host;
    }

    return null;
  };

  const getPageElement = el => {
    const tabs = el.closest('.line-tabs');

    if (tabs) {
      return tabs;
    }

    const page = el.closest('.line-app,.line-page,page-inner');

    if (page) {
      return page;
    }

    return getParentElement(el);
  };

  var content = /*#__PURE__*/
  createComponent$s({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {
      forceOverscroll: Boolean,
      fullscreen: Boolean,
      scrollX: {
        type: Boolean,
        default: false
      },
      scrollY: {
        type: Boolean,
        default: true
      },
      scrollEvents: Boolean,
      value: Boolean
    },

    data() {
      return {
        cTop: 0,
        cBottom: 0
      };
    },

    computed: {
      shouldForceOverscroll() {
        const {
          forceOverscroll,
          mode
        } = this;
        return forceOverscroll === undefined ? mode === 'ios' && isPlatform('ios') : forceOverscroll;
      }

    },
    watch: {
      fullscreen(val) {
        if (val) {
          this.readDimensions();
        } else {
          this.cTop = this.cBottom = 0;
        }
      }

    },

    async mounted() {
      if (this.fullscreen) {
        await this.$nextTick();
        this.readDimensions();
      }
    },

    methods: {
      readDimensions() {
        const el = this.$el;
        const page = getPageElement(el);
        const top = Math.max(el.offsetTop, 0);
        const bottom = Math.max(page.offsetHeight - top - el.offsetHeight, 0);
        const dirty = top !== this.cTop || bottom !== this.cBottom;

        if (dirty) {
          this.cTop = top;
          this.cBottom = bottom;
        }
      },

      getScrollElement() {
        return this.$refs.scrollEl;
      },

      getBackgroundContent() {
        return this.$refs.backgroundContentEl;
      },

      async scrollByPoint(x, y, duration) {
        const {
          scrollEl
        } = this.$refs;
        if (!scrollEl) return;
        await scrollByPoint(scrollEl, x, y, duration);
      },

      async scrollToElement(el) {
        const {
          scrollEl
        } = this.$refs;
        if (!scrollEl) return;
        const target = isString(el) ? scrollEl.querySelector(el) : el;
        await scrollToElement(scrollEl, target);
      },

      async scrollToBottom(duration) {
        const {
          scrollEl
        } = this.$refs;
        if (!scrollEl) return;
        await scrollToBottom(scrollEl, duration);
      },

      async scrollToPoint(x, y, duration) {
        const {
          scrollEl
        } = this.$refs;
        if (!scrollEl) return;
        await scrollToPoint(scrollEl, x, y, duration);
      },

      async scrollToTop(duration) {
        const {
          scrollEl
        } = this.$refs;
        if (!scrollEl) return;
        await scrollToTop(scrollEl, duration);
      },

      onClick(ev) {
        if (this.isScrolling) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },

      async onScroll(ev) {
        const timeStamp = Date.now();
        const shouldStart = !this.isScrolling;
        this.lastScroll = timeStamp;

        if (shouldStart) {
          this.onScrollStart();
        }

        if (!this.queued && this.scrollEvents) {
          this.queued = true;
          await this.$nextTick();
          this.queued = false;
          this.detail.event = ev;
          updateScrollDetail(this.detail, this.scrollEl, Date.now(), shouldStart);
          this.ionScroll.emit(this.detail);
          this.$emit('scroll', this.detail);
        }
      },

      onScrollStart() {
        this.isScrolling = true;
        this.$emit('scrollstart', {
          isScrolling: true
        });

        if (this.watchDog) {
          clearInterval(this.watchDog);
        } // watchdog


        this.watchDog = setInterval(() => {
          if (this.lastScroll < Date.now() - 120) {
            this.onScrollEnd();
          }
        }, 100);
      },

      onScrollEnd() {
        clearInterval(this.watchDog);
        this.watchDog = null;

        if (this.isScrolling) {
          this.isScrolling = false;
          this.$emit('scrollend', {
            isScrolling: false
          });
        }
      }

    },

    render() {
      const h = arguments[0];
      const {
        scrollX,
        scrollY,
        shouldForceOverscroll
      } = this;
      return h("div", helper([{
        "class": [bem$r(), false , shouldForceOverscroll && 'overscroll'],
        "style": {
          '--offset-top': `${this.cTop || 0}px`,
          '--offset-bottom': `${this.cBottom || 0}px`
        }
      }, {
        "on": {
          '!click': this.onClick
        }
      }]), [h("div", {
        "ref": "backgroundContentEl",
        "attrs": {
          "id": "background-content"
        }
      }), h("main", {
        "class": {
          'inner-scroll': true,
          'scroll-x': scrollX,
          'scroll-y': scrollY,
          overscroll: (scrollX || scrollY) && shouldForceOverscroll
        },
        "ref": 'scrollEl',
        "on": {
          "scroll": this.onScroll
        }
      }, [this.slots()]), this.slots('fixed')]);
    }

  });

  const {
    createComponent: createComponent$t,
    bem: bem$s
  } =
  /*#__PURE__*/
  createNamespace('picker-column');

  const clamp = (min, n, max) => {
    return Math.max(min, Math.min(n, max));
  };

  const PICKER_OPT_SELECTED = 'picker-opt-selected';
  const DECELERATION_FRICTION = 0.97;
  const MAX_PICKER_SPEED = 90;
  const TRANSITION_DURATION = 150;
  var LinePickerColumn = /*#__PURE__*/
  createComponent$t({
    props: {
      col: Object
    },

    data() {
      return {
        optHeight: 0,
        rotateFactor: 0,
        scaleFactor: 1,
        velocity: 0,
        y: 0,
        noAnimate: true
      };
    },

    async mounted() {
      let pickerRotateFactor = 0;
      let pickerScaleFactor = 0.81;
      const {
        mode
      } = this;
      const {
        optsEl
      } = this.$refs;
      this.optsEl = optsEl;

      if (mode === 'ios') {
        pickerRotateFactor = -0.46;
        pickerScaleFactor = 1;
      }

      this.rotateFactor = pickerRotateFactor;
      this.scaleFactor = pickerScaleFactor;
      this.gesture = createGesture({
        el: this.$el,
        gestureName: 'picker-swipe',
        gesturePriority: 100,
        threshold: 0,
        onStart: ev => this.onStart(ev),
        onMove: ev => this.onMove(ev),
        onEnd: ev => this.onEnd(ev)
      });
      this.gesture.enable();
      this.tmrId = setTimeout(() => {
        this.noAnimate = false;
        this.refresh(true);
      }, 250);

      if (optsEl) {
        // DOM READ
        // We perfom a DOM read over a rendered item, this needs to happen after the first render
        this.optHeight = optsEl.firstElementChild ? optsEl.firstElementChild.clientHeight : 0;
      }

      this.refresh();
    },

    methods: {
      colChanged() {
        this.refresh();
      },

      emitColChange() {
        this.$emit('colChange', this.col);
      },

      setSelected(selectedIndex, duration) {
        // if there is a selected index, then figure out it's y position
        // if there isn't a selected index, then just use the top y position
        const y = selectedIndex > -1 ? -(selectedIndex * this.optHeight) : 0;
        this.velocity = 0; // set what y position we're at

        cancelAnimationFrame(this.rafId);
        this.update(y, duration, true);
        this.emitColChange();
      },

      update(y, duration, saveY) {
        if (!this.optsEl) {
          return;
        } // ensure we've got a good round number :)


        let translateY = 0;
        let translateZ = 0;
        const {
          col,
          rotateFactor
        } = this;
        const selectedIndex = col.selectedIndex = this.indexForY(-y);
        const durationStr = duration === 0 ? '' : `${duration}ms`;
        const scaleStr = `scale(${this.scaleFactor})`;
        const {
          children
        } = this.optsEl;

        for (let i = 0; i < children.length; i++) {
          const button = children[i];
          const opt = col.options[i];
          const optOffset = i * this.optHeight + y;
          let transform = '';

          if (rotateFactor !== 0) {
            const rotateX = optOffset * rotateFactor;

            if (Math.abs(rotateX) <= 90) {
              translateY = 0;
              translateZ = 90;
              transform = `rotateX(${rotateX}deg) `;
            } else {
              translateY = -9999;
            }
          } else {
            translateZ = 0;
            translateY = optOffset;
          }

          const selected = selectedIndex === i;
          transform += `translate3d(0px,${translateY}px,${translateZ}px) `;

          if (this.scaleFactor !== 1 && !selected) {
            transform += scaleStr;
          } // Update transition duration


          if (this.noAnimate) {
            opt.duration = 0;
            button.style.transitionDuration = '';
          } else if (duration !== opt.duration) {
            opt.duration = duration;
            button.style.transitionDuration = durationStr;
          } // Update transform


          if (transform !== opt.transform) {
            opt.transform = transform;
            button.style.transform = transform;
          } // Update selected item


          if (selected !== opt.selected) {
            opt.selected = selected;

            if (selected) {
              button.classList.add(PICKER_OPT_SELECTED);
            } else {
              button.classList.remove(PICKER_OPT_SELECTED);
            }
          }
        }

        this.col.prevSelected = selectedIndex;

        if (saveY) {
          this.y = y;
        }

        if (this.lastIndex !== selectedIndex) {
          // have not set a last index yet
          // TODO
          // hapticSelectionChanged();
          this.lastIndex = selectedIndex;
        }
      },

      decelerate() {
        if (this.velocity !== 0) {
          // still decelerating
          this.velocity *= DECELERATION_FRICTION; // do not let it go slower than a velocity of 1

          this.velocity = this.velocity > 0 ? Math.max(this.velocity, 1) : Math.min(this.velocity, -1);
          let y = this.y + this.velocity;

          if (y > this.minY) {
            // whoops, it's trying to scroll up farther than the options we have!
            y = this.minY;
            this.velocity = 0;
          } else if (y < this.maxY) {
            // gahh, it's trying to scroll down farther than we can!
            y = this.maxY;
            this.velocity = 0;
          }

          this.update(y, 0, true);
          const notLockedIn = Math.round(y) % this.optHeight !== 0 || Math.abs(this.velocity) > 1;

          if (notLockedIn) {
            // isn't locked in yet, keep decelerating until it is
            this.rafId = requestAnimationFrame(() => this.decelerate());
          } else {
            this.velocity = 0;
            this.emitColChange();
          }
        } else if (this.y % this.optHeight !== 0) {
          // needs to still get locked into a position so options line up
          const currentPos = Math.abs(this.y % this.optHeight); // create a velocity in the direction it needs to scroll

          this.velocity = currentPos > this.optHeight / 2 ? 1 : -1;
          this.decelerate();
        }
      },

      indexForY(y) {
        return Math.min(Math.max(Math.abs(Math.round(y / this.optHeight)), 0), this.col.options.length - 1);
      },

      // TODO should this check disabled?
      onStart(detail) {
        // We have to prevent default in order to block scrolling under the picker
        // but we DO NOT have to stop propagation, since we still want
        // some "click" events to capture
        detail.event.preventDefault();
        detail.event.stopPropagation(); // reset everything

        cancelAnimationFrame(this.rafId);
        const {
          options
        } = this.col;
        let minY = options.length - 1;
        let maxY = 0;

        for (let i = 0; i < options.length; i++) {
          if (!options[i].disabled) {
            minY = Math.min(minY, i);
            maxY = Math.max(maxY, i);
          }
        }

        this.minY = -(minY * this.optHeight);
        this.maxY = -(maxY * this.optHeight);
      },

      onMove(detail) {
        detail.event.preventDefault();
        detail.event.stopPropagation(); // update the scroll position relative to pointer start position

        let y = this.y + detail.deltaY;

        if (y > this.minY) {
          // scrolling up higher than scroll area
          y **= 0.8;
          this.bounceFrom = y;
        } else if (y < this.maxY) {
          // scrolling down below scroll area
          y += (this.maxY - y) ** 0.9;
          this.bounceFrom = y;
        } else {
          this.bounceFrom = 0;
        }

        this.update(y, 0, false);
      },

      onEnd(detail) {
        if (this.bounceFrom > 0) {
          // bounce back up
          this.update(this.minY, 100, true);
          this.emitColChange();
          return;
        }

        if (this.bounceFrom < 0) {
          // bounce back down
          this.update(this.maxY, 100, true);
          this.emitColChange();
          return;
        }

        this.velocity = clamp(-MAX_PICKER_SPEED, detail.velocityY * 23, MAX_PICKER_SPEED);

        if (this.velocity === 0 && detail.deltaY === 0) {
          const opt = detail.event.target.closest('.picker-opt');

          if (opt && opt.hasAttribute('opt-index')) {
            this.setSelected(parseInt(opt.getAttribute('opt-index'), 10), TRANSITION_DURATION);
          }
        } else {
          this.y += detail.deltaY;

          if (Math.abs(detail.velocityY) < 0.05) {
            const isScrollingUp = detail.deltaY > 0;
            const optHeightFraction = Math.abs(this.y) % this.optHeight / this.optHeight;

            if (isScrollingUp && optHeightFraction > 0.5) {
              this.velocity = Math.abs(this.velocity) * -1;
            } else if (!isScrollingUp && optHeightFraction <= 0.5) {
              this.velocity = Math.abs(this.velocity);
            }
          }

          this.decelerate();
        }
      },

      refresh(forceRefresh) {
        let min = this.col.options.length - 1;
        let max = 0;
        const {
          options
        } = this.col;

        for (let i = 0; i < options.length; i++) {
          if (!options[i].disabled) {
            min = Math.min(min, i);
            max = Math.max(max, i);
          }
        }
        /**
         * Only update selected value if column has a
         * velocity of 0. If it does not, then the
         * column is animating might land on
         * a value different than the value at
         * selectedIndex
         */


        if (this.velocity !== 0) {
          return;
        }

        const selectedIndex = clamp(min, this.col.selectedIndex || 0, max);

        if (this.col.prevSelected !== selectedIndex || forceRefresh) {
          const y = selectedIndex * this.optHeight * -1;
          this.velocity = 0;
          this.update(y, TRANSITION_DURATION, true);
        }
      }

    },
    watch: {
      col() {
        this.colChanged();
      }

    },

    render() {
      const h = arguments[0];
      const {
        col
      } = this;
      return h("div", {
        "class": [bem$s(), {
          'picker-col': true,
          'picker-opts-left': this.col.align === 'left',
          'picker-opts-right': this.col.align === 'right'
        }],
        "style": {
          'max-width': this.col.columnWidth
        }
      }, [col.prefix && h("div", {
        "class": "picker-prefix",
        "style": {
          width: col.prefixWidth
        }
      }, [col.prefix]), h("div", {
        "class": "picker-opts",
        "style": {
          maxWidth: col.optionsWidth
        },
        "ref": "optsEl"
      }, [col.options.map((o, index) => h("button", {
        "attrs": {
          "type": "button",
          "opt-index": index
        },
        "class": {
          'picker-opt': true,
          'picker-opt-disabled': !!o.disabled
        }
      }, [o.text]))]), col.suffix && h("div", {
        "class": "picker-suffix",
        "style": {
          width: col.suffixWidth
        }
      }, [col.suffix])]);
    }

  });

  /**
   * iOS Picker Enter Animation
   */
  const iosEnterAnimation$2 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.picker-wrapper'))
          .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Picker Leave Animation
   */
  const iosLeaveAnimation$2 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0.01);
      wrapperAnimation
          .addElement(baseEl.querySelector('.picker-wrapper'))
          .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$u,
    bem: bem$t
  } =
  /*#__PURE__*/
  createNamespace('picker');

  const buttonWrapperClass = button => {
    return {
      [`picker-toolbar-${button.role}`]: button.role !== undefined,
      'picker-toolbar-button': true
    };
  }; // TODO


  const safeCall = (handler, arg) => {
    if (typeof handler === 'function') {
      try {
        return handler(arg);
      } catch (e) {
        console.error(e);
      }
    }

    return undefined;
  };

  var Picker = /*#__PURE__*/
  createComponent$u({
    mixins: [
    /*#__PURE__*/
    usePopup()],
    props: {
      overlayIndex: Number,
      keyboardClose: {
        type: Boolean,
        default: true
      },
      buttons: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        default: () => []
      },
      cssClass: {
        type: Array,
        default: () => []
      },
      duration: {
        type: Number,
        default: 0
      },
      showBackdrop: {
        type: Boolean,
        default: true
      },
      backdropDismiss: {
        type: Boolean,
        default: true
      },
      animated: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        presented: true
      };
    },

    beforeMount() {
      this.$on('animation-enter', builder => {
        builder.build = iosEnterAnimation$2;
      });
      this.$on('animation-leave', builder => {
        builder.build = iosLeaveAnimation$2;
      });
    },

    methods: {
      async buttonClick(button) {
        const {
          role
        } = button;

        if (role === 'cancel') {
          return this.close(role);
        }

        const shouldDismiss = await this.callButtonHandler(button);

        if (shouldDismiss) {
          return this.close(button.role);
        }

        return Promise.resolve();
      },

      async callButtonHandler(button) {
        if (button) {
          // a handler has been provided, execute it
          // pass the handler the values from the inputs
          const rtn = await safeCall(button.handler, this.getSelected());

          if (rtn === false) {
            // if the return value of the handler is false then do not dismiss
            return false;
          }
        }

        return true;
      },

      getSelected() {
        const selected = {};
        this.columns.forEach((col, index) => {
          const selectedColumn = col.selectedIndex !== undefined ? col.options[col.selectedIndex] : undefined;
          selected[col.name] = {
            text: selectedColumn ? selectedColumn.text : undefined,
            value: selectedColumn ? selectedColumn.value : undefined,
            columnIndex: index
          };
        });
        return selected;
      },

      onTap() {
        this.$emit('overlay-tap');
      },

      colChange(data) {
        this.$emit('colChange', data);
      }

    },

    render() {
      const h = arguments[0];
      const {
        mode,
        overlayIndex,
        showBackdrop,
        backdropDismiss,
        visible,
        columns
      } = this;
      return h("div", {
        "attrs": {
          "aria-modal": "true"
        },
        "directives": [{
          name: "show",
          value: visible
        }],
        "class": [bem$t(), {
          // Used internally for styling
          [`picker-${mode}`]: true
        }],
        "style": {
          zIndex: `${20000 + overlayIndex}`
        }
      }, [h(Overlay, {
        "attrs": {
          "visible": showBackdrop,
          "tappable": backdropDismiss
        },
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "class": "picker-wrapper",
        "attrs": {
          "role": "dialog"
        }
      }, [h("div", {
        "class": "picker-toolbar"
      }, [this.buttons.map(b => h("div", {
        "class": buttonWrapperClass(b)
      }, [h("button", {
        "attrs": {
          "type": "button"
        },
        "on": {
          "click": () => this.buttonClick(b)
        },
        "class": {
          'picker-button': true,
          'line-activatable': true
        }
      }, [b.text])]))]), h("div", {
        "class": "picker-columns"
      }, [h("div", {
        "class": "picker-above-highlight"
      }), visible && columns.map(c => h(LinePickerColumn, {
        "on": {
          "colChange": this.colChange
        },
        "attrs": {
          "col": c
        }
      })), h("div", {
        "class": "picker-below-highlight"
      })])])]);
    }

  });

  const getAppRoot = (doc = document) => {
      return doc.querySelector('[skyline-app]') || doc.body;
  };
  function createFactory(sfc) {
      const Component = Vue.extend(sfc);
      function create(props, destroyWhenClose = true) {
          return new Component({
              propsData: props,
              mounted() {
                  this.destroyWhenClose = destroyWhenClose;
                  getAppRoot().appendChild(this.$el);
              },
              beforeDestroy() {
                  this.$el.remove();
              },
          }).$mount();
      }
      return {
          create,
      };
  }

  class PickerController {
      constructor() {
          this.factory = createFactory(Picker);
      }
      create(props, destroyWhenClose) {
          return this.factory.create(props, destroyWhenClose);
      }
      close(reason) {
          const lastPopup = this.getTop();
          lastPopup && lastPopup.close(reason);
      }
      /* eslint-disable-next-line class-methods-use-this */
      getTop() {
          return popupContext.getPopup();
      }
  }

  /**
   * Gets a date value given a format
   * Defaults to the current date if
   * no date given
   */
  /* eslint-disable */
  const getDateValue = (date, format) => {
      const getValue = getValueFromFormat(date, format);
      if (getValue !== undefined) {
          return getValue;
      }
      const defaultDate = parseDate(new Date().toISOString());
      return getValueFromFormat(defaultDate, format);
  };
  const renderDatetime = (template, value, locale) => {
      if (value === undefined) {
          return undefined;
      }
      const tokens = [];
      let hasText = false;
      FORMAT_KEYS.forEach((format, index) => {
          if (template.indexOf(format.f) > -1) {
              const token = `{${index}}`;
              const text = renderTextFormat(format.f, value[format.k], value, locale);
              if (!hasText && text !== undefined && value[format.k] != null) {
                  hasText = true;
              }
              tokens.push(token, text || '');
              template = template.replace(format.f, token);
          }
      });
      if (!hasText) {
          return undefined;
      }
      for (let i = 0; i < tokens.length; i += 2) {
          template = template.replace(tokens[i], tokens[i + 1]);
      }
      return template;
  };
  const renderTextFormat = (format, value, date, locale) => {
      if ((format === FORMAT_DDDD || format === FORMAT_DDD)) {
          try {
              value = (new Date(date.year, date.month - 1, date.day)).getDay();
              if (format === FORMAT_DDDD) {
                  return (locale.dayNames ? locale.dayNames : DAY_NAMES)[value];
              }
              return (locale.dayShortNames ? locale.dayShortNames : DAY_SHORT_NAMES)[value];
          }
          catch (e) {
              // ignore
          }
          return undefined;
      }
      if (format === FORMAT_A) {
          return date !== undefined && date.hour !== undefined
              ? (date.hour < 12 ? 'AM' : 'PM')
              : value ? value.toUpperCase() : '';
      }
      if (format === FORMAT_a) {
          return date !== undefined && date.hour !== undefined
              ? (date.hour < 12 ? 'am' : 'pm')
              : value || '';
      }
      if (value == null) {
          return '';
      }
      if (format === FORMAT_YY || format === FORMAT_MM
          || format === FORMAT_DD || format === FORMAT_HH
          || format === FORMAT_mm || format === FORMAT_ss) {
          return twoDigit(value);
      }
      if (format === FORMAT_YYYY) {
          return fourDigit(value);
      }
      if (format === FORMAT_MMMM) {
          return (locale.monthNames ? locale.monthNames : MONTH_NAMES)[value - 1];
      }
      if (format === FORMAT_MMM) {
          return (locale.monthShortNames ? locale.monthShortNames : MONTH_SHORT_NAMES)[value - 1];
      }
      if (format === FORMAT_hh || format === FORMAT_h) {
          if (value === 0) {
              return '12';
          }
          if (value > 12) {
              value -= 12;
          }
          if (format === FORMAT_hh && value < 10) {
              return (`0${value}`);
          }
      }
      return value.toString();
  };
  const dateValueRange = (format, min, max) => {
      const opts = [];
      if (format === FORMAT_YYYY || format === FORMAT_YY) {
          // year
          if (max.year === undefined || min.year === undefined) {
              throw new Error('min and max year is undefined');
          }
          for (let i = max.year; i >= min.year; i--) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_MMMM || format === FORMAT_MMM
          || format === FORMAT_MM || format === FORMAT_M
          || format === FORMAT_hh || format === FORMAT_h) {
          // month or 12-hour
          for (let i = 1; i < 13; i++) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_DDDD || format === FORMAT_DDD
          || format === FORMAT_DD || format === FORMAT_D) {
          // day
          for (let i = 1; i < 32; i++) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_HH || format === FORMAT_H) {
          // 24-hour
          for (let i = 0; i < 24; i++) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_mm || format === FORMAT_m) {
          // minutes
          for (let i = 0; i < 60; i++) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_ss || format === FORMAT_s) {
          // seconds
          for (let i = 0; i < 60; i++) {
              opts.push(i);
          }
      }
      else if (format === FORMAT_A || format === FORMAT_a) {
          // AM/PM
          opts.push('am', 'pm');
      }
      return opts;
  };
  const dateSortValue = (year, month, day, hour = 0, minute = 0) => {
      return parseInt(`1${fourDigit(year)}${twoDigit(month)}${twoDigit(day)}${twoDigit(hour)}${twoDigit(minute)}`, 10);
  };
  const dateDataSortValue = (data) => {
      return dateSortValue(data.year, data.month, data.day, data.hour, data.minute);
  };
  const daysInMonth = (month, year) => {
      return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
  };
  const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  const ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
  const TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
  const parseDate = (val) => {
      // manually parse IS0 cuz Date.parse cannot be trusted
      // ISO 8601 format: 1994-12-15T13:47:20Z
      let parse = null;
      if (val != null && val !== '') {
          // try parsing for just time first, HH:MM
          parse = TIME_REGEXP.exec(val);
          if (parse) {
              // adjust the array so it fits nicely with the datetime parse
              parse.unshift(undefined, undefined);
              parse[2] = parse[3] = undefined;
          }
          else {
              // try parsing for full ISO datetime
              parse = ISO_8601_REGEXP.exec(val);
          }
      }
      if (parse === null) {
          // wasn't able to parse the ISO datetime
          return undefined;
      }
      // ensure all the parse values exist with at least 0
      for (let i = 1; i < 8; i++) {
          parse[i] = parse[i] !== undefined ? parseInt(parse[i], 10) : undefined;
      }
      let tzOffset = 0;
      if (parse[9] && parse[10]) {
          // hours
          tzOffset = parseInt(parse[10], 10) * 60;
          if (parse[11]) {
              // minutes
              tzOffset += parseInt(parse[11], 10);
          }
          if (parse[9] === '-') {
              // + or -
              tzOffset *= -1;
          }
      }
      return {
          year: parse[1],
          month: parse[2],
          day: parse[3],
          hour: parse[4],
          minute: parse[5],
          second: parse[6],
          millisecond: parse[7],
          tzOffset,
      };
  };
  /**
   * Converts a valid UTC datetime string to JS Date time object.
   * By default uses the users local timezone, but an optional
   * timezone can be provided.
   * Note: This is not meant for time strings
   * such as "01:47"
   */
  const getDateTime = (dateString = '', timeZone = '') => {
      /**
       * If user passed in undefined
       * or null, convert it to the
       * empty string since the rest
       * of this functions expects
       * a string
       */
      if (dateString === undefined || dateString === null) {
          dateString = '';
      }
      /**
       * Ensures that YYYY-MM-DD, YYYY-MM,
       * YYYY-DD, etc does not get affected
       * by timezones and stays on the day/month
       * that the user provided
       */
      if (dateString.length === 10
          || dateString.length === 7) {
          dateString += ' ';
      }
      const date = (typeof dateString === 'string' && dateString.length > 0) ? new Date(dateString) : new Date();
      const localDateTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
      if (timeZone && timeZone.length > 0) {
          return new Date(date.getTime() - getTimezoneOffset(localDateTime, timeZone));
      }
      return localDateTime;
  };
  const getTimezoneOffset = (localDate, timeZone) => {
      const utcDateTime = new Date(localDate.toLocaleString('en-US', { timeZone: 'utc' }));
      const tzDateTime = new Date(localDate.toLocaleString('en-US', { timeZone }));
      return utcDateTime.getTime() - tzDateTime.getTime();
  };
  const updateDate = (existingData, newData, displayTimezone) => {
      if (!newData || typeof newData === 'string') {
          const dateTime = getDateTime(newData, displayTimezone);
          if (!Number.isNaN(dateTime.getTime())) {
              newData = dateTime.toISOString();
          }
      }
      if (newData && newData !== '') {
          if (typeof newData === 'string') {
              // new date is a string, and hopefully in the ISO format
              // convert it to our DatetimeData if a valid ISO
              newData = parseDate(newData);
              if (newData) {
                  // successfully parsed the ISO string to our DatetimeData
                  Object.assign(existingData, newData);
                  return true;
              }
          }
          else if ((newData.year || newData.hour || newData.month || newData.day || newData.minute || newData.second)) {
              // newData is from of a datetime picker's selected values
              // update the existing DatetimeData data with the new values
              // do some magic for 12-hour values
              if (newData.ampm && newData.hour) {
                  newData.hour.value = (newData.ampm.value === 'pm')
                      ? (newData.hour.value === 12 ? 12 : newData.hour.value + 12)
                      : (newData.hour.value === 12 ? 0 : newData.hour.value);
              }
              // merge new values from the picker's selection
              // to the existing DatetimeData values
              for (const key of Object.keys(newData)) {
                  existingData[key] = newData[key].value;
              }
              return true;
          }
          else if (newData.ampm) {
              // Even though in the picker column hour values are between 1 and 12, the hour value is actually normalized
              // to [0, 23] interval. Because of this when changing between AM and PM we have to update the hour so it points
              // to the correct HH hour
              newData.hour = {
                  value: newData.hour
                      ? newData.hour.value
                      : (newData.ampm.value === 'pm'
                          ? (existingData.hour < 12 ? existingData.hour + 12 : existingData.hour)
                          : (existingData.hour >= 12 ? existingData.hour - 12 : existingData.hour)),
              };
              existingData.hour = newData.hour.value;
              return true;
          }
          // eww, invalid data
          console.warn(`Error parsing date: "${newData}". Please provide a valid ISO 8601 datetime format: https://www.w3.org/TR/NOTE-datetime`);
      }
      else {
          // blank data, clear everything out
          for (const k in existingData) {
              if (existingData.hasOwnProperty(k)) {
                  delete existingData[k];
              }
          }
      }
      console.log(existingData);
      return existingData;
  };
  const parseTemplate = (template) => {
      const formats = [];
      template = template.replace(/[^\w\s]/gi, ' ');
      FORMAT_KEYS.forEach(format => {
          if (format.f.length > 1 && template.indexOf(format.f) > -1 && template.indexOf(format.f + format.f.charAt(0)) < 0) {
              template = template.replace(format.f, ` ${format.f} `);
          }
      });
      const words = template.split(' ').filter(w => w.length > 0);
      words.forEach((word, i) => {
          FORMAT_KEYS.forEach(format => {
              if (word === format.f) {
                  if (word === FORMAT_A || word === FORMAT_a) {
                      // this format is an am/pm format, so it's an "a" or "A"
                      if ((formats.indexOf(FORMAT_h) < 0 && formats.indexOf(FORMAT_hh) < 0)
                          || VALID_AMPM_PREFIX.indexOf(words[i - 1]) === -1) {
                          // template does not already have a 12-hour format
                          // or this am/pm format doesn't have a hour, minute, or second format immediately before it
                          // so do not treat this word "a" or "A" as the am/pm format
                          return;
                      }
                  }
                  formats.push(word);
              }
          });
      });
      return formats;
  };
  const getValueFromFormat = (date, format) => {
      if (format === FORMAT_A || format === FORMAT_a) {
          return (date.hour < 12 ? 'am' : 'pm');
      }
      if (format === FORMAT_hh || format === FORMAT_h) {
          return (date.hour > 12 ? date.hour - 12 : (date.hour === 0 ? 12 : date.hour));
      }
      return date[convertFormatToKey(format)];
  };
  const convertFormatToKey = (format) => {
      for (const k in FORMAT_KEYS) {
          if (FORMAT_KEYS[k].f === format) {
              return FORMAT_KEYS[k].k;
          }
      }
      return undefined;
  };
  const convertDataToISO = (data) => {
      // https://www.w3.org/TR/NOTE-datetime
      let rtn = '';
      if (data.year !== undefined) {
          // YYYY
          rtn = fourDigit(data.year);
          if (data.month !== undefined) {
              // YYYY-MM
              rtn += `-${twoDigit(data.month)}`;
              if (data.day !== undefined) {
                  // YYYY-MM-DD
                  rtn += `-${twoDigit(data.day)}`;
                  if (data.hour !== undefined) {
                      // YYYY-MM-DDTHH:mm:SS
                      rtn += `T${twoDigit(data.hour)}:${twoDigit(data.minute)}:${twoDigit(data.second)}`;
                      if (data.millisecond > 0) {
                          // YYYY-MM-DDTHH:mm:SS.SSS
                          rtn += `.${threeDigit(data.millisecond)}`;
                      }
                      if (data.tzOffset === undefined) {
                          // YYYY-MM-DDTHH:mm:SSZ
                          rtn += 'Z';
                      }
                      else {
                          // YYYY-MM-DDTHH:mm:SS+/-HH:mm
                          rtn += `${(data.tzOffset > 0 ? '+' : '-') + twoDigit(Math.floor(Math.abs(data.tzOffset / 60)))}:${twoDigit(data.tzOffset % 60)}`;
                      }
                  }
              }
          }
      }
      else if (data.hour !== undefined) {
          // HH:mm
          rtn = `${twoDigit(data.hour)}:${twoDigit(data.minute)}`;
          if (data.second !== undefined) {
              // HH:mm:SS
              rtn += `:${twoDigit(data.second)}`;
              if (data.millisecond !== undefined) {
                  // HH:mm:SS.SSS
                  rtn += `.${threeDigit(data.millisecond)}`;
              }
          }
      }
      return rtn;
  };
  /**
   * Use to convert a string of comma separated strings or
   * an array of strings, and clean up any user input
   */
  const convertToArrayOfStrings = (input, type) => {
      if (input == null) {
          return undefined;
      }
      if (typeof input === 'string') {
          // convert the string to an array of strings
          // auto remove any [] characters
          input = input.replace(/\[|\]/g, '').split(',');
      }
      let values;
      if (Array.isArray(input)) {
          // trim up each string value
          values = input.map(val => val.toString().trim());
      }
      if (values === undefined || values.length === 0) {
          console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
      }
      return values;
  };
  /**
   * Use to convert a string of comma separated numbers or
   * an array of numbers, and clean up any user input
   */
  const convertToArrayOfNumbers = (input, type) => {
      if (typeof input === 'string') {
          // convert the string to an array of strings
          // auto remove any whitespace and [] characters
          input = input.replace(/\[|\]|\s/g, '').split(',');
      }
      let values;
      if (Array.isArray(input)) {
          // ensure each value is an actual number in the returned array
          values = input
              .map((num) => parseInt(num, 10))
              .filter(isFinite);
      }
      else {
          values = [input];
      }
      if (values.length === 0) {
          console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
      }
      return values;
  };
  const twoDigit = (val) => {
      return (`0${val !== undefined ? Math.abs(val) : '0'}`).slice(-2);
  };
  const threeDigit = (val) => {
      return (`00${val !== undefined ? Math.abs(val) : '0'}`).slice(-3);
  };
  const fourDigit = (val) => {
      return (`000${val !== undefined ? Math.abs(val) : '0'}`).slice(-4);
  };
  const FORMAT_YYYY = 'YYYY';
  const FORMAT_YY = 'YY';
  const FORMAT_MMMM = 'MMMM';
  const FORMAT_MMM = 'MMM';
  const FORMAT_MM = 'MM';
  const FORMAT_M = 'M';
  const FORMAT_DDDD = 'DDDD';
  const FORMAT_DDD = 'DDD';
  const FORMAT_DD = 'DD';
  const FORMAT_D = 'D';
  const FORMAT_HH = 'HH';
  const FORMAT_H = 'H';
  const FORMAT_hh = 'hh';
  const FORMAT_h = 'h';
  const FORMAT_mm = 'mm';
  const FORMAT_m = 'm';
  const FORMAT_ss = 'ss';
  const FORMAT_s = 's';
  const FORMAT_A = 'A';
  const FORMAT_a = 'a';
  const FORMAT_KEYS = [
      { f: FORMAT_YYYY, k: 'year' },
      { f: FORMAT_MMMM, k: 'month' },
      { f: FORMAT_DDDD, k: 'day' },
      { f: FORMAT_MMM, k: 'month' },
      { f: FORMAT_DDD, k: 'day' },
      { f: FORMAT_YY, k: 'year' },
      { f: FORMAT_MM, k: 'month' },
      { f: FORMAT_DD, k: 'day' },
      { f: FORMAT_HH, k: 'hour' },
      { f: FORMAT_hh, k: 'hour' },
      { f: FORMAT_mm, k: 'minute' },
      { f: FORMAT_ss, k: 'second' },
      { f: FORMAT_M, k: 'month' },
      { f: FORMAT_D, k: 'day' },
      { f: FORMAT_H, k: 'hour' },
      { f: FORMAT_h, k: 'hour' },
      { f: FORMAT_m, k: 'minute' },
      { f: FORMAT_s, k: 'second' },
      { f: FORMAT_A, k: 'ampm' },
      { f: FORMAT_a, k: 'ampm' },
  ];
  const DAY_NAMES = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
  ];
  const DAY_SHORT_NAMES = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
  ];
  const MONTH_NAMES = [
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
  ];
  const MONTH_SHORT_NAMES = [
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
  ];
  const VALID_AMPM_PREFIX = [
      FORMAT_hh, FORMAT_h, FORMAT_mm, FORMAT_m, FORMAT_ss, FORMAT_s,
  ];

  const {
    createComponent: createComponent$v,
    bem: bem$u
  } =
  /*#__PURE__*/
  createNamespace('datetime');

  const clamp$1 = (min, n, max) => {
    return Math.max(min, Math.min(n, max));
  };

  const findItemLabel = componentEl => {
    const itemEl = componentEl && componentEl.closest('.line-item');

    if (itemEl) {
      return itemEl.querySelector('.line-label');
    }

    return null;
  };

  const divyColumns = columns => {
    const columnsWidth = [];
    let col;
    let width;

    for (let i = 0; i < columns.length; i++) {
      col = columns[i];
      columnsWidth.push(0);

      for (const option of col.options) {
        width = option.text.length;

        if (width > columnsWidth[i]) {
          columnsWidth[i] = width;
        }
      }
    }

    if (columnsWidth.length === 2) {
      width = Math.max(columnsWidth[0], columnsWidth[1]);
      columns[0].align = 'right';
      columns[1].align = 'left';
      columns[0].optionsWidth = columns[1].optionsWidth = `${width * 17}px`;
    } else if (columnsWidth.length === 3) {
      width = Math.max(columnsWidth[0], columnsWidth[2]);
      columns[0].align = 'right';
      columns[1].columnWidth = `${columnsWidth[1] * 17}px`;
      columns[0].optionsWidth = columns[2].optionsWidth = `${width * 17}px`;
      columns[2].align = 'left';
    }

    return columns;
  };

  const DEFAULT_FORMAT = 'MMM D, YYYY';
  let datetimeIds = 0;
  var datetime = /*#__PURE__*/
  createComponent$v({
    mixins: [
    /*#__PURE__*/
    useModel('dateValue')],
    inject: {
      Item: {
        default: undefined
      }
    },
    props: {
      name: String,
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      min: String,
      max: String,
      displayFormat: {
        type: String,
        default: 'MMM D, YYYY'
      },
      displayTimezone: String,
      pickerFormat: String,
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      doneText: {
        type: String,
        default: 'Done'
      },
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
      placeholder: String
    },

    data() {
      return {
        isExpanded: false,
        dateMax: '',
        dateMin: '',
        inputId: `line-dt-${datetimeIds++}`,
        locale: {},
        inItem: false
      };
    },

    computed: {
      text() {
        // create the text of the formatted data
        const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;

        if (this.dateValue === undefined || this.dateValue === null || this.dateValue.length === 0) {
          return undefined;
        }

        return renderDatetime(template, this.datetimeValue, this.locale);
      }

    },

    beforeMount() {
      const {
        min,
        max
      } = this;
      this.dateMin = min;
      this.dateMax = max;
      this.datetimeMin = {};
      this.datetimeMax = {};
      this.datetimeValue = {};
      const monthNames = this.monthNames;
      const monthShortNames = this.monthShortNames;
      const dayNames = this.dayNames;
      const dayShortNames = this.dayShortNames; // first see if locale names were provided in the inputs
      // then check to see if they're in the config
      // if neither were provided then it will use default English names

      this.locale = {
        // this.locale[type] = convertToArrayOfStrings((this[type] ? this[type] : this.config.get(type), type);
        monthNames: convertToArrayOfStrings(monthNames, 'monthNames'),
        monthShortNames: convertToArrayOfStrings(monthShortNames, 'monthShortNames'),
        dayNames: convertToArrayOfStrings(dayNames, 'dayNames'),
        dayShortNames: convertToArrayOfStrings(dayShortNames, 'dayShortNames')
      };
      this.updateDatetimeValue(this.dateValue); // TODO
      // this.emitStyle();
    },

    mounted() {
      const {
        buttonEl
      } = this.$refs;
      this.inItem = this.$el.closest('.line-item') !== null;
      this.buttonEl = buttonEl;
    },

    methods: {
      /**
       * Opens the datetime overlay.
       */
      async open() {
        if (this.disabled || this.isExpanded) {
          return;
        }

        const pickerOptions = this.generatePickerOptions();
        const pickerController = new PickerController();
        const picker = await pickerController.create(pickerOptions);
        this.isExpanded = true;
        picker.$on('opened', () => {
          this.$emit('opened');
        });
        picker.$on('closed', () => {
          this.isExpanded = false;
          this.setFocus();
          this.$emit('closed');
        });
        picker.$on('colChange', data => {
          const colSelectedIndex = data.selectedIndex;
          const colOptions = data.options;
          const changeData = {};
          changeData[data.name] = {
            value: colOptions[colSelectedIndex].value
          };
          this.updateDatetimeValue(changeData);
          picker.columns = this.generateColumns();
        });
        await picker.open();
      },

      emitStyle() {
        this.Item && this.Item.itemStyle('line-datatime', {
          interactive: true,
          datetime: true,
          'has-placeholder': this.placeholder != null,
          'has-value': this.hasValue(),
          'interactive-disabled': this.disabled
        });
      },

      updateDatetimeValue(value) {
        updateDate(this.datetimeValue, value, this.displayTimezone);
      },

      generatePickerOptions() {
        const {
          mode
        } = this;
        const pickerOptions = {
          mode,
          ...this.pickerOptions,
          columns: this.generateColumns()
        }; // If the user has not passed in picker buttons,
        // add a cancel and ok button to the picker

        const {
          buttons
        } = pickerOptions;

        if (!buttons || buttons.length === 0) {
          pickerOptions.buttons = [{
            text: this.cancelText,
            role: 'cancel',
            handler: () => {
              this.updateDatetimeValue(this.dateValue); // this.ionCancel.emit();

              this.$emit('cancel');
            }
          }, {
            text: this.doneText,
            handler: data => {
              this.updateDatetimeValue(data);
              /**
              * Prevent convertDataToISO from doing any
              * kind of transformation based on timezone
              * This cancels out any change it attempts to make
              *
              * Important: Take the timezone offset based on
              * the date that is currently selected, otherwise
              * there can be 1 hr difference when dealing w/ DST
              */

              const date = new Date(convertDataToISO(this.datetimeValue)); // If a custom display timezone is provided, use that tzOffset value instead

              this.datetimeValue.tzOffset = this.displayTimezone !== undefined && this.displayTimezone.length > 0 ? getTimezoneOffset(date, this.displayTimezone) / 1000 / 60 * -1 : date.getTimezoneOffset() * -1;
              this.dateValue = convertDataToISO(this.datetimeValue);
            }
          }];
        }

        return pickerOptions;
      },

      generateColumns() {
        // if a picker format wasn't provided, then fallback
        // to use the display format
        let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

        if (template.length === 0) {
          return [];
        } // make sure we've got up to date sizing information


        this.calcMinMax(); // does not support selecting by day name
        // automatically remove any day name formats

        template = template.replace('DDDD', '{~}').replace('DDD', '{~}');

        if (template.indexOf('D') === -1) {
          // there is not a day in the template
          // replace the day name with a numeric one if it exists
          template = template.replace('{~}', 'D');
        } // make sure no day name replacer is left in the string


        template = template.replace(/{~}/g, ''); // parse apart the given template into an array of "formats"

        const columns = parseTemplate(template).map(format => {
          // loop through each format in the template
          // create a new picker column to build up with data
          const key = convertFormatToKey(format);
          let values; // check if they have exact values to use for this date part
          // otherwise use the default date part values

          const self = this;
          /* eslint-disable-next-line */

          values = self[`${key}Values`] ? convertToArrayOfNumbers(self[`${key}Values`], key) : dateValueRange(format, this.datetimeMin, this.datetimeMax);
          const colOptions = values.map(val => {
            return {
              value: val,
              text: renderTextFormat(format, val, undefined, this.locale)
            };
          }); // cool, we've loaded up the columns with options
          // preselect the option for this column

          const optValue = getDateValue(this.datetimeValue, format);
          const selectedIndex = colOptions.findIndex(opt => opt.value === optValue);
          return {
            name: key,
            selectedIndex: selectedIndex >= 0 ? selectedIndex : 0,
            options: colOptions
          };
        }); // Normalize min/max

        const min = this.datetimeMin;
        const max = this.datetimeMax;
        ['month', 'day', 'hour', 'minute'].filter(name => !columns.find(column => column.name === name)).forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });
        return this.validateColumns(divyColumns(columns));
      },

      validateColumns(columns) {
        const today = new Date();
        const minCompareVal = dateDataSortValue(this.datetimeMin);
        const maxCompareVal = dateDataSortValue(this.datetimeMax);
        const yearCol = columns.find(c => c.name === 'year');
        let selectedYear = today.getFullYear();

        if (yearCol) {
          // default to the first value if the current year doesn't exist in the options
          if (!yearCol.options.find(col => col.value === today.getFullYear())) {
            selectedYear = yearCol.options[0].value;
          }

          const {
            selectedIndex
          } = yearCol;

          if (selectedIndex !== undefined) {
            const yearOpt = yearCol.options[selectedIndex];

            if (yearOpt) {
              // they have a selected year value
              selectedYear = yearOpt.value;
            }
          }
        }

        const selectedMonth = this.validateColumn(columns, 'month', 1, minCompareVal, maxCompareVal, [selectedYear, 0, 0, 0, 0], [selectedYear, 12, 31, 23, 59]);
        const numDaysInMonth = daysInMonth(selectedMonth, selectedYear);
        const selectedDay = this.validateColumn(columns, 'day', 2, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, 0, 0, 0], [selectedYear, selectedMonth, numDaysInMonth, 23, 59]);
        const selectedHour = this.validateColumn(columns, 'hour', 3, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, selectedDay, 0, 0], [selectedYear, selectedMonth, selectedDay, 23, 59]);
        this.validateColumn(columns, 'minute', 4, minCompareVal, maxCompareVal, [selectedYear, selectedMonth, selectedDay, selectedHour, 0], [selectedYear, selectedMonth, selectedDay, selectedHour, 59]);
        return columns;
      },

      calcMinMax() {
        const todaysYear = new Date().getFullYear();

        if (this.yearValues !== undefined) {
          const years = convertToArrayOfNumbers(this.yearValues, 'year');

          if (this.dateMin === undefined) {
            this.dateMin = Math.min(...years).toString();
          }

          if (this.dateMax === undefined) {
            this.dateMax = Math.max(...years).toString();
          }
        } else {
          if (this.dateMin === undefined) {
            this.dateMin = (todaysYear - 100).toString();
          }

          if (this.dateMax === undefined) {
            this.dateMax = todaysYear.toString();
          }
        }

        const min = this.datetimeMin = parseDate(this.dateMin);
        const max = this.datetimeMax = parseDate(this.dateMax);
        min.year = min.year || todaysYear;
        max.year = max.year || todaysYear;
        min.month = min.month || 1;
        max.month = max.month || 12;
        min.day = min.day || 1;
        max.day = max.day || 31;
        min.hour = min.hour || 0;
        max.hour = max.hour === undefined ? 23 : max.hour;
        min.minute = min.minute || 0;
        max.minute = max.minute === undefined ? 59 : max.minute;
        min.second = min.second || 0;
        max.second = max.second === undefined ? 59 : max.second; // Ensure min/max constraints

        if (min.year > max.year) {
          console.error('min.year > max.year');
          min.year = max.year - 100;
        }

        if (min.year === max.year) {
          if (min.month > max.month) {
            console.error('min.month > max.month');
            min.month = 1;
          } else if (min.month === max.month && min.day > max.day) {
            console.error('min.day > max.day');
            min.day = 1;
          }
        }
      },

      validateColumn(columns, name, index, min, max, lowerBounds, upperBounds) {
        const column = columns.find(c => c.name === name);

        if (!column) {
          return 0;
        }

        const lb = lowerBounds.slice();
        const ub = upperBounds.slice();
        const {
          options
        } = column;
        let indexMin = options.length - 1;
        let indexMax = 0;

        for (let i = 0; i < options.length; i++) {
          const opts = options[i];
          const {
            value
          } = opts;
          lb[index] = opts.value;
          ub[index] = opts.value;
          const disabled = opts.disabled = value < lowerBounds[index] || value > upperBounds[index] || dateSortValue(ub[0], ub[1], ub[2], ub[3], ub[4]) < min || dateSortValue(lb[0], lb[1], lb[2], lb[3], lb[4]) > max;

          if (!disabled) {
            indexMin = Math.min(indexMin, i);
            indexMax = Math.max(indexMax, i);
          }
        }

        const selectedIndex = column.selectedIndex = clamp$1(indexMin, column.selectedIndex, indexMax);
        const opt = column.options[selectedIndex];

        if (opt) {
          return opt.value;
        }

        return 0;
      },

      hasValue() {
        return this.text !== undefined;
      },

      setFocus() {
        if (this.buttonEl) {
          this.buttonEl.focus();
        }
      },

      onClick() {
        this.setFocus();
        this.open();
      },

      onFocus() {
        this.$emit('focus');
      },

      onBlur() {
        this.$emit('blur');
      }

    },
    watch: {
      checked() {
        this.emitStyle();
      },

      disabled() {
        this.emitStyle();
      }

    },

    render() {
      const h = arguments[0];
      const {
        inputId,
        text,
        disabled,
        readonly,
        isExpanded,
        $el,
        placeholder,
        inItem
      } = this;
      const labelId = `${inputId}-lbl`;
      const label = findItemLabel($el);
      const addPlaceholderClass = !!(text === undefined && placeholder != null); // If selected text has been passed in, use that first
      // otherwise use the placeholder

      const datetimeText = text === undefined ? placeholder != null ? placeholder : '' : text;

      if (label) {
        label.id = labelId;
      } // TODO
      // renderHiddenInput(true, el, this.name, this.dateValue, this.disabled);


      return h("div", {
        "on": {
          "click": this.onClick
        },
        "attrs": {
          "role": "combobox",
          "aria-disabled": disabled ? 'true' : null,
          "aria-expanded": `${isExpanded}`,
          "aria-haspopup": "true",
          "aria-labelledby": labelId
        },
        "class": [bem$u(), {
          'datetime-disabled': disabled,
          'datetime-readonly': readonly,
          'datetime-placeholder': addPlaceholderClass,
          'in-item': inItem
        }]
      }, [h("div", {
        "class": "datetime-text"
      }, [datetimeText]), h("button", {
        "attrs": {
          "type": "button",
          "disabled": this.disabled
        },
        "on": {
          "focus": this.onFocus,
          "blur": this.onBlur
        },
        "ref": "buttonEl"
      })]);
    }

  });

  const {
    createComponent: createComponent$w,
    bem: bem$v
  } =
  /*#__PURE__*/
  createNamespace('dialog');
  const CONTENT_ELEMENT = 'content';
  var dialog = /*#__PURE__*/
  createComponent$w({
    mixins: [
    /*#__PURE__*/
    usePopup()],

    render() {
      const h = arguments[0];
      return h("div", {
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "class": bem$v()
      }, [h("div", {
        "class": bem$v(CONTENT_ELEMENT),
        "ref": CONTENT_ELEMENT
      }, [this.slots()])]);
    }

  });

  function invoke(vm, name, ...args) {
      return isFunction(name) ? name.call(vm, ...args) : vm[name] && vm[name](...args);
  }
  function useEvent(options) {
      let app;
      const { global = false } = options;
      function eventHandler(ev) {
          const { condition, handler } = options;
          if (condition && !invoke(this, condition, ev, options))
              return;
          invoke(this, handler, ev, options);
      }
      function bind() {
          const { useEvent = {} } = this;
          if (useEvent.binded)
              return;
          app = document.querySelector('[skyline-app]') || document.body;
          const handler = useEvent.handler = eventHandler.bind(this);
          const { event, passive = false, capture = false } = options;
          const events = isArray(event) ? event : [event];
          events.forEach(event => on(global ? app : this.$el, event, handler, { passive, capture }));
          useEvent.binded = true;
      }
      function unbind() {
          const { useEvent = {} } = this;
          if (!useEvent.binded)
              return;
          const events = isArray(options.event) ? options.event : [options.event];
          events.forEach(event => off(global ? app : this.$el, event, useEvent.handler));
          useEvent.binded = false;
      }
      return createMixins({
          mounted: bind,
          activated: bind,
          deactivated: unbind,
          beforeDestroy: unbind,
      });
  }

  function useClickOutside(options = {}) {
      const { global = true, event = ['mouseup', 'touchend'], handler = function () {
          this.$emit('clickoutside');
      }, condition = function (ev) {
          // If click was triggered programmaticaly (domEl.click()) then
          // it shouldn't be treated as click-outside
          // Chrome/Firefox support isTrusted property
          // IE/Edge support pointerType property (empty if not triggered
          // by pointing device)
          if (('isTrusted' in ev && !ev.isTrusted)
              || ('pointerType' in ev && !ev.pointerType))
              return false;
          const elements = options.includes
              ? invoke(this, options.includes)
              : [this.$el];
          return !elements.some(element => element.contains(ev.target));
      }, } = options;
      return createMixins({
          mixins: [
              useEvent({
                  event, handler, condition, global,
              }),
          ],
      });
  }

  const NAMESPACE$8 = 'FabGroup';
  const {
    createComponent: createComponent$x,
    bem: bem$w
  } =
  /*#__PURE__*/
  createNamespace('fab-group');
  var FabGroup = /*#__PURE__*/
  createComponent$x({
    mixins: [
    /*#__PURE__*/
    useGroup(NAMESPACE$8),
    /*#__PURE__*/
    useLazy('visible'),
    /*#__PURE__*/
    useModel('visible')],
    props: {
      // string | object | false
      transition: null,
      exclusive: {
        type: Boolean,
        default: true
      },
      // 'start' | 'end' | 'top' | 'bottom' = 'bottom'
      side: String
    },

    beforeMount() {
      this.visible = this.inited = this.visible || isDef(this.$attrs.visible) && this.$attrs.visible !== false;
    },

    render() {
      const h = arguments[0];
      const {
        side = 'bottom'
      } = this;
      const TransitionGroup = 'transition-group';
      const transition = isObject(this.transition) ? this.transition : {
        name: this.transition || 'line-scale'
      };
      return h(TransitionGroup, helper([{
        "props": { ...transition
        },
        "attrs": {
          "tag": "div",
          "appear": true
        },
        "class": bem$w({
          [`side-${side}`]: true
        })
      }, {
        "on": this.$listeners
      }]), [this.visible && this.slots('default', {
        side
      }, index => ({
        key: index,
        style: {
          animationDelay: `${index * 0.03}s`
        }
      }))]);
    }

  });

  const {
    createComponent: createComponent$y,
    bem: bem$x
  } =
  /*#__PURE__*/
  createNamespace('fab');
  const FAB_SIDES = ['start', 'end', 'top', 'bottom'];
  var fab = /*#__PURE__*/
  createComponent$y({
    mixins: [
    /*#__PURE__*/
    useModel('activated'),
    /*#__PURE__*/
    useClickOutside()],

    provide() {
      return {
        FAB: this
      };
    },

    props: {
      // 'start' | 'end' | 'center'
      horizontal: String,
      // 'top' | 'bottom' | 'center'
      vertical: String,
      edge: Boolean
    },

    beforeMount() {
      this.$on('clickoutside', () => {
        console.log('clickoutside');
        this.activated = false;
      });
      this.activated = this.activated || isDef(this.$attrs.activated) && this.$attrs.activated !== false;
    },

    methods: {
      toggle() {
        this.activated = !this.activated;
      }

    },

    render() {
      const h = arguments[0];
      const {
        horizontal = 'start',
        vertical = 'top',
        edge,
        activated
      } = this;
      return h("div", helper([{
        "class": bem$x({
          [`horizontal-${horizontal}`]: isDef(horizontal),
          [`vertical-${vertical}`]: isDef(vertical),
          edge
        })
      }, {
        "on": this.$listeners
      }]), [this.slots('indicator', {
        activated
      }, {
        on: {
          click: this.toggle
        }
      }), FAB_SIDES.map(side => this.hasSlot(side) && h(FabGroup, {
        "attrs": {
          "side": side
        },
        "on": {
          "clicked": this.toggle
        },
        "model": {
          value: this.activated,
          callback: $$v => {
            this.activated = $$v;
          }
        }
      }, [this.slots(side)]))]);
    }

  });

  const NAMESPACE$9 = 'FabGroup';
  const {
    createComponent: createComponent$z,
    bem: bem$y
  } =
  /*#__PURE__*/
  createNamespace('fab-button');
  var fabButton = /*#__PURE__*/
  createComponent$z({
    mixins: [
    /*#__PURE__*/
    useColor(),
    /*#__PURE__*/
    useGroupItem(NAMESPACE$9)],
    directives: {
      ripple: Ripple
    },
    props: {
      ripple: Boolean,
      translucent: Boolean,
      text: String,
      disabled: Boolean,
      size: String,
      // 'submit' | 'reset' | 'button' = 'button';
      type: String,
      download: String,
      href: String,
      rel: String,
      strong: Boolean,
      target: String
    },

    render() {
      const h = arguments[0];
      const {
        type = 'button',
        download,
        href,
        rel,
        target,
        text
      } = this;
      const {
        disabled,
        checked,
        translucent,
        strong,
        size,
        vertical
      } = this;
      const TagType = isDef(href) ? 'a' : 'button';
      const attrs = TagType === 'button' ? {
        type
      } : {
        download,
        href,
        rel,
        target
      };
      const inList = this.itemInGroup;
      return h("div", helper([{
        "attrs": {
          "aria-disabled": disabled ? 'true' : null
        },
        "class": ['activatable', 'line-focusable', bem$y({
          [size]: isDef(size),
          'in-list': inList,
          'translucent-in-list': inList && translucent,
          'close-active': checked,
          strong,
          translucent,
          disabled
        })]
      }, {
        "on": this.$listeners
      }]), [h(TagType, {
        "attrs": { ...attrs,
          "disabled": disabled
        },
        "directives": [{
          name: "ripple",
          value: this.ripple
        }],
        "class": bem$y('content', {
          vertical
        })
      }, [h("span", {
        "class": bem$y('indicator')
      }, [this.slots('indicator')]), h("span", {
        "class": bem$y('inner')
      }, [this.slots() || text])])]);
    }

  });

  const {
    createComponent: createComponent$A,
    bem: bem$z
  } =
  /*#__PURE__*/
  createNamespace('footer');
  var footer = /*#__PURE__*/
  createComponent$A({
    inject: ['App'],
    props: {
      translucent: Boolean
    },

    data() {
      return {
        isAppFooter: false
      };
    },

    beforeMount() {
      this.isAppFooter = this.App === this.$parent;
    },

    render() {
      const h = arguments[0];
      const {
        translucent
      } = this;
      return h("div", helper([{
        "attrs": {
          "role": "contentinfo"
        },
        "class": bem$z({
          translucent
        })
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$B,
    bem: bem$A
  } =
  /*#__PURE__*/
  createNamespace('grid');
  var grid = /*#__PURE__*/
  createComponent$B({
    functional: true,
    props: {
      fixed: Boolean
    },

    render(h, {
      props,
      data,
      slots
    }) {
      return h("div", helper([{
        "class": bem$A({
          fixed: props.fixed
        })
      }, data]), [slots()]);
    }

  });

  const {
    createComponent: createComponent$C,
    bem: bem$B
  } =
  /*#__PURE__*/
  createNamespace('header');
  var header = /*#__PURE__*/
  createComponent$C({
    inject: ['App'],
    props: {
      collapse: String,
      translucent: Boolean
    },

    data() {
      return {
        isAppHeader: false
      };
    },

    beforeMount() {
      this.isAppHeader = this.App === this.$parent;
    },

    render() {
      const h = arguments[0];
      const mode = 'ios';
      const collapse = this.collapse || 'none';
      return h("div", helper([{
        "attrs": {
          "role": "banner"
        },
        "class": [bem$B(), `line-header-${mode}`, `line-header-collapse-${collapse}`, this.translucent && 'line-header-translucent', this.translucent && `line-header-translucent-${mode}`]
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$D,
    bem: bem$C
  } =
  /*#__PURE__*/
  createNamespace('check-group');
  var checkGroup = /*#__PURE__*/
  createComponent$D({
    mixins: [
    /*#__PURE__*/
    useCheckGroupWithModel('Group')],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$C()
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$E,
    bem: bem$D
  } =
  /*#__PURE__*/
  createNamespace('check-item');
  var checkItem = /*#__PURE__*/
  createComponent$E({
    mixins: [
    /*#__PURE__*/
    useCheckItemWithModel('Group')],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$D(),
        "on": {
          "click": this.toggle
        }
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$F,
    bem: bem$E
  } =
  /*#__PURE__*/
  createNamespace('lazy');
  var lazy = /*#__PURE__*/
  createComponent$F({
    mixins: [
    /*#__PURE__*/
    useLazy()],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$E()
      }, [this.slots()]);
    }

  });

  function useTreeItem(name) {
      return createMixins({
          mixins: [
              useGroup(name),
              useGroupItem(name),
          ],
          data() {
              return {
                  checked: false,
              };
          },
          computed: {
              tristate() {
                  return !!this.items.length;
              },
              checkState: {
                  get() {
                      if (!this.tristate) {
                          return this.checked
                              ? 1 /* Checked */
                              : -1 /* Unchecked */;
                      }
                      let hasUnchecked = false;
                      let hasPartiallyChecked = false;
                      let hasChecked = false;
                      for (const item of this.items) {
                          hasUnchecked = hasUnchecked || item.checkState === -1 /* Unchecked */;
                          hasPartiallyChecked = hasPartiallyChecked || item.checkState === 0 /* PartiallyChecked */;
                          hasChecked = hasChecked || item.checkState === 1 /* Checked */;
                          if (hasPartiallyChecked)
                              return 0 /* PartiallyChecked */;
                          if (hasUnchecked && hasChecked)
                              return 0 /* PartiallyChecked */;
                      }
                      // all unchecked
                      if (hasUnchecked)
                          return -1 /* Unchecked */;
                      // all checked
                      if (hasChecked)
                          return 1 /* Checked */;
                      console.error('internal error');
                      return -1 /* Unchecked */;
                  },
                  set(val) {
                      if (!this.tristate) {
                          this.checked = val === 1 /* Checked */;
                          return;
                      }
                      if (val === 0 /* PartiallyChecked */) {
                          console.error('unexpect value');
                          return;
                      }
                      this.items.forEach((item) => item.checkState = val);
                  },
              },
          },
          watch: {
              checkState(val) {
                  if (!this.tristate)
                      return;
                  this.checked = val === 1 /* Checked */;
              },
              checked(val) {
                  if (!this.tristate)
                      return;
                  this.checkState = val
                      ? 1 /* Checked */
                      : -1 /* Unchecked */;
              },
          },
          methods: {
              toggle() {
                  const nextCheckState = this.checkState === 1 /* Checked */
                      ? -1 /* Unchecked */
                      : 1 /* Checked */;
                  this.checkState = nextCheckState;
              },
          },
          beforeMount() {
              let deep = 0;
              let group = this[name];
              while (group) {
                  deep++;
                  group = group[name];
              }
              this.itemDeep = deep;
              this.checked = this.checked || (isDef(this.$attrs.checked)
                  && this.$attrs.checked !== false);
          },
      });
  }

  const {
    createComponent: createComponent$G,
    bem: bem$F
  } =
  /*#__PURE__*/
  createNamespace('tree-item');
  var treeItem = /*#__PURE__*/
  createComponent$G({
    mixins: [
    /*#__PURE__*/
    useTreeItem('Tree')],
    methods: {
      onClick(e) {
        e.stopPropagation();
        this.toggle();
      }

    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$F(),
        "on": {
          "click": this.onClick
        }
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$H,
    bem: bem$G
  } =
  /*#__PURE__*/
  createNamespace('img');
  var image = /*#__PURE__*/
  createComponent$H({
    props: {
      alt: String,
      src: String
    },

    data() {
      return {
        loading: false,
        loaderror: false,
        loadsrc: ''
      };
    },

    watch: {
      src() {
        this.addIO();
      }

    },

    mounted() {
      this.addIO();
    },

    beforeDestroy() {
      this.removeIO();
    },

    methods: {
      addIO() {
        if (this.src === undefined) {
          return;
        }

        if ('IntersectionObserver' in window) {
          this.removeIO();
          this.io = new IntersectionObserver(data => {
            // because there will only ever be one instance
            // of the element we are observing
            // we can just use data[0]
            if (data[0].isIntersecting) {
              this.load();
              this.removeIO();
            }
          });
          this.io.observe(this.$el);
        } else {
          // fall back to setTimeout for Safari and IE
          setTimeout(() => this.load(), 200);
        }
      },

      removeIO() {
        if (this.io) {
          this.io.disconnect();
          this.io = undefined;
        }
      },

      load() {
        this.loadsrc = this.src;
        this.$emit('aboutToLoad');
        this.loading = true;
        this.loaderror = false;
      },

      onLoad() {
        this.$emit('loaded');
        this.loading = false;
        this.loaderror = false;
      },

      onError() {
        if (!this.loadsrc) return;
        this.$emit('error');
        this.loading = false;
        this.loaderror = true;
      }

    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$G()
      }, {
        "on": this.$listeners
      }]), [h("img", {
        "attrs": {
          "decoding": "async",
          "src": this.loadsrc,
          "alt": this.alt
        },
        "on": {
          "load": this.onLoad,
          "error": this.onError
        }
      })]);
    }

  });

  const {
    createComponent: createComponent$I,
    bem: bem$H
  } =
  /*#__PURE__*/
  createNamespace('input');
  var input = /*#__PURE__*/
  createComponent$I({
    props: {
      prefixIcon: {
        type: [String, Object]
      },
      suffixIcon: {
        type: [String, Object]
      },
      label: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholderText: {
        type: String,
        default: ''
      },
      max: {
        type: String
      },
      maxlength: {
        type: Number
      },
      min: {
        type: String
      },
      size: {
        type: Number
      },
      readonly: {
        type: Boolean,
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      clearOnEdit: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      clearableIcon: {
        type: String,
        default: 'cancel'
      }
    },

    data() {
      return {
        hasFocus: false,
        didBlurAfterEdit: false
      };
    },

    methods: {
      setInputValue() {
        const {
          input
        } = this.$refs;
        if (input.value === this.inputValue || !input) return;
        input.value = this.inputValue;
      },

      onInput(ev) {
        const input = ev.target;

        if (input) {
          // this.value = input.value || '';
          this.$emit('input', input.value);
        }
      },

      onBlur() {
        this.hasFocus = false;
        this.focusChanged(); // this.emitStyle(); ?

        this.$emit('onBlur');
      },

      onFocus() {
        this.hasFocus = true;
        this.focusChanged(); // this.emitStyle(); ?

        this.$emit('onFocus');
      },

      onKeydown() {
        if (this.shouldClearOnEdit()) {
          // Did the input value change after it was blurred and edited?
          if (this.didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.clearTextInput();
          } // Reset the flag


          this.didBlurAfterEdit = false;
        }
      },

      onClearValue(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$emit('input', '');
        this.$emit('clear', event);
      },

      getValue() {
        return this.value || '';
      },

      hasValue() {
        return this.getValue().length > 0;
      },

      shouldClearOnEdit() {
        const {
          type,
          clearOnEdit
        } = this;
        return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
      },

      focusChanged() {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
          this.didBlurAfterEdit = true;
        }
      }

    },
    watch: {},

    render() {
      const h = arguments[0];
      const {
        value,
        hasFocus,
        accept,
        type,
        maxlength,
        readonly,
        placeholderText,
        autocomplete,
        disabled,
        max,
        min,
        size,
        autoFocus,
        pattern,
        required
      } = this; // const mode = getSkylineMode(this);

      return h("div", helper([{
        "class": [bem$H(), {
          // 'has-value' : this.value.length,
          'has-focus': hasFocus
        }]
      }, {
        "on": this.$listeners
      }]), [h("input", {
        "class": "native-input",
        "ref": "input",
        "attrs": {
          "accept": accept,
          "type": type,
          "size": size,
          "maxlength": maxlength,
          "max": max,
          "min": min,
          "readonly": readonly,
          "placeholder": placeholderText,
          "pattern": pattern,
          "required": required,
          "autocomplete": autocomplete,
          "autoFocus": autoFocus,
          "disabled": disabled
        },
        "domProps": {
          "value": value
        },
        "on": {
          "input": this.onInput,
          "focus": this.onFocus,
          "blur": this.onBlur
        }
      }), this.clearInput && !readonly && !disabled && h("button", {
        "attrs": {
          "type": "button",
          "tabindex": "-1"
        },
        "class": "input-clear-icon",
        "on": {
          "touchStart": this.clearTextInput,
          "mouseDown": this.clearTextInput
        }
      })]);
    }

  });

  const {
    createComponent: createComponent$J,
    bem: bem$I
  } =
  /*#__PURE__*/
  createNamespace('item');
  var item = /*#__PURE__*/
  createComponent$J({
    mixins: [
    /*#__PURE__*/
    useColor()],
    directives: {
      ripple: Ripple
    },

    provide() {
      return {
        Item: this
      };
    },

    props: {
      button: Boolean,
      // Boolean property has default false value
      detail: {
        type: Boolean,
        default: undefined
      },
      disabled: Boolean,
      ripple: Boolean,
      download: String,
      href: String,
      rel: String,
      target: String,
      // 'full' | 'inset' | 'none' | undefined;
      lines: String
    },

    data() {
      return {
        itemStyles: {},
        multipleInputs: false,
        hasCover: false
      };
    },

    computed: {
      isClickable() {
        return isDef(this.href) || this.button;
      },

      canActivate() {
        return this.isClickable || this.hasCover;
      }

    },
    methods: {
      itemStyle(tagName, cssclass) {
        const {
          itemStyles
        } = this;
        const updatedStyles = cssclass;
        const newStyles = {};
        const childStyles = itemStyles[tagName] || {};
        let hasStyleChange = false;
        Object.keys(updatedStyles).forEach(key => {
          if (updatedStyles[key]) {
            const itemKey = `item-${key}`;

            if (!childStyles[itemKey]) {
              hasStyleChange = true;
            }

            newStyles[itemKey] = true;
          }
        });

        if (!hasStyleChange && Object.keys(newStyles).length !== Object.keys(childStyles).length) {
          hasStyleChange = true;
        }

        if (hasStyleChange) {
          Vue.set(itemStyles, tagName, newStyles);
        }
      }

    },

    mounted() {
      // The following elements have a clickable cover that is relative to the entire item
      const covers = this.$el.querySelectorAll('.line-checkbox, .line-datetime, .line-select, .line-radio'); // The following elements can accept focus alongside the previous elements
      // therefore if these elements are also a child of item, we don't want the
      // input cover on top of those interfering with their clicks

      const inputs = this.$el.querySelectorAll('.line-input, .line-range, .line-searchbar, .line-segment, .line-textarea, .line-toggle'); // The following elements should also stay clickable when an input with cover is present

      const clickables = this.$el.querySelectorAll('.line-anchor, .line-button, a, button'); // Check for multiple inputs to change the position of the input cover to relative
      // for all of the covered inputs above

      this.multipleInputs = covers.length + inputs.length > 1 || covers.length + clickables.length > 1 || covers.length > 0 && this.isClickable;
      this.hasCover = covers.length === 1 && !this.multipleInputs;
    },

    render() {
      const h = arguments[0];
      const {
        mode,
        itemStyles,
        disabled,
        ripple,
        detail,
        href,
        download,
        rel,
        target,
        lines,
        isClickable: clickable,
        canActivate
      } = this;
      const childStyles = {};
      const TagType = clickable ? isDef(href) ? 'a' : 'button' : 'div';
      const attrs = TagType === 'button' ? {
        type: this.type
      } : {
        download,
        href,
        rel,
        target
      };
      const showDetail = isDef(detail) ? detail : mode === 'ios' && clickable;
      Object.keys(itemStyles).forEach(key => {
        Object.assign(childStyles, itemStyles[key]);
      });
      return h("div", helper([{
        "attrs": {
          "aria-disabled": disabled ? 'true' : null
        },
        "class": [bem$I({}), { ...childStyles,
          item: true,
          [`item-lines-${lines}`]: isDef(lines),
          'item-disabled': disabled,
          'line-activatable': canActivate,
          'line-focusable': true
        }]
      }, {
        "on": this.$listeners
      }]), [h(TagType, {
        "attrs": { ...attrs,
          "disabled": disabled
        },
        "class": "item-native",
        "directives": [{
          name: "ripple",
          value: ripple
        }]
      }, [this.slots('start'), h("div", {
        "class": "item-inner"
      }, [h("div", {
        "class": "input-wrapper"
      }, [this.slots()]), this.slots('end'), showDetail && h(Icon, {
        "class": "item-detail-icon",
        "attrs": {
          "name": "chevron_right"
        }
      }), h("div", {
        "class": "item-inner-highlight"
      })])])]);
    }

  });

  const {
    createComponent: createComponent$K,
    bem: bem$J
  } =
  /*#__PURE__*/
  createNamespace('item-divider');
  var itemDivider = /*#__PURE__*/
  createComponent$K({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {
      sticky: Boolean
    },

    render() {
      const h = arguments[0];
      const {
        sticky = false
      } = this;
      return h("div", helper([{
        "class": [bem$J({
          sticky
        }), 'item']
      }, {
        "on": this.$listeners
      }]), [this.slots('start'), h("div", {
        "class": bem$J('inner')
      }, [h("div", {
        "class": bem$J('wrapper')
      }, [this.slots()]), this.slots('end')])]);
    }

  });

  const {
    createComponent: createComponent$L,
    bem: bem$K
  } =
  /*#__PURE__*/
  createNamespace('label');
  var label = /*#__PURE__*/
  createComponent$L({
    mixins: [
    /*#__PURE__*/
    useColor()],
    inject: {
      Item: {
        default: undefined
      }
    },
    props: {
      // 'fixed' | 'stacked' | 'floating' | undefined
      position: String
    },
    watch: {
      position: 'emitStyle'
    },

    mounted() {
      if (this.noAnimate) {
        setTimeout(() => {
          this.noAnimate = false;
        }, 1000);
      }

      this.emitStyle();
    },

    methods: {
      emitStyle() {
        if (!this.Item) return;
        const {
          position
        } = this;
        this.Item.itemStyle('label', {
          label: true,
          [`label-${position}`]: isDef(position)
        });
      }

    },

    render() {
      const h = arguments[0];
      const {
        position
      } = this;
      this.noAnimate = position === 'floating';
      return h("div", helper([{
        "class": [bem$K(), {
          [`label-${position}`]: isDef(position),
          'label-no-animate': this.noAnimate
        }]
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$M,
    bem: bem$L
  } =
  /*#__PURE__*/
  createNamespace('list');
  var list = /*#__PURE__*/
  createComponent$M({
    props: {
      // 'full' | 'inset' | 'none' | undefined
      lines: String,
      inset: Boolean
    },

    render() {
      const h = arguments[0];
      const {
        lines,
        inset = false
      } = this;
      return h("div", helper([{
        "class": bem$L({
          [`lines-${lines}`]: isDef(lines),
          inset
        })
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$N,
    bem: bem$M
  } =
  /*#__PURE__*/
  createNamespace('list-header');
  var listHeader = /*#__PURE__*/
  createComponent$N({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {
      // 'full' | 'inset' | 'none' | undefined
      lines: String
    },

    render() {
      const h = arguments[0];
      const {
        lines
      } = this;
      return h("div", helper([{
        "class": bem$M({
          [`lines-${lines}`]: isDef(lines)
        })
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": "list-header-innerd"
      }, [this.slots()])]);
    }

  });

  const NAMESPACE$a = 'ListView';
  const {
    createComponent: createComponent$O,
    bem: bem$N
  } =
  /*#__PURE__*/
  createNamespace('list-item');
  var ListItem = /*#__PURE__*/
  createComponent$O({
    inject: [NAMESPACE$a],
    props: {
      index: {
        type: Number,
        required: true
      },
      item: null
    },
    computed: {
      cachedNode() {
        return this.slots('default', this.item);
      }

    },
    methods: {
      onLayoutChanged() {
        const {
          itemLayoutAtIndex
        } = this[NAMESPACE$a];
        const item = itemLayoutAtIndex(this.index);
        this.offsetWidth = item.geometry.width;
        this.offsetHeight = item.geometry.height;
        const {
          offsetWidth,
          offsetHeight
        } = this.$el;
        const {
          onLayout,
          horizontal,
          vertical
        } = this[NAMESPACE$a];
        if (!offsetWidth || !offsetHeight) return;

        if (this.offsetWidth !== offsetWidth && horizontal || this.offsetHeight !== offsetHeight && vertical) {
          this.offsetWidth = offsetWidth;
          this.offsetHeight = offsetHeight;
          onLayout(this.index, this.offsetWidth, this.offsetHeight);
        }
      }

    },

    async mounted() {
      await this.$nextTick(); // this.onLayoutChanged();
    },

    async updated() {
      await this.$nextTick(); // this.onLayoutChanged();
    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$N()
      }, [this.cachedNode]);
    }

  });

  class Point {
      constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
      }
      static Clamp(point, min, max) {
          point.min(min);
          point.max(max);
          return point;
      }
      static Distance(a, b) {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          return Math.sqrt(dx * dx + dy * dy);
      }
      static Length(point) {
          return Math.sqrt(point.x * point.x + point.y * point.y);
      }
      isNull() {
          return !!this.x && !!this.y;
      }
      setX(val) {
          this.x = val;
      }
      setY(val) {
          this.y = val;
      }
      min(val) {
          if (this.x < val)
              this.x = val;
          if (this.y < val)
              this.y = val;
      }
      max(val) {
          if (this.x > val)
              this.x = val;
          if (this.y > val)
              this.y = val;
      }
      clamp(min, max) {
          return Point.Clamp(this, min, max);
      }
      add(point) {
          this.x += point.x;
          this.y += point.y;
      }
      subtract(point) {
          this.x -= point.x;
          this.y -= point.y;
      }
      multiply(point) {
          this.x *= point.x;
          this.y *= point.y;
      }
      divide(point) {
          this.x /= point.x;
          this.y /= point.y;
      }
      distance(point) {
          return Point.Distance(this, point);
      }
      length() {
          return Point.Length(this);
      }
  }

  class Size {
      constructor(width = 0, height = 0) {
          this.width = width;
          this.height = height;
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
      scale(width, height, mode = 0 /* IgnoreAspectRatio */) {
          const ratio = this.width / this.height;
          switch (mode) {
              case 1 /* KeepAspectRatio */:
                  this.width = ratio > 1 ? width : (width * ratio);
                  this.height = ratio > 1 ? (height * ratio) : height;
                  break;
              case 2 /* KeepAspectRatioByExpanding */:
                  this.width = ratio > 1 ? (width * ratio) : width;
                  this.height = ratio > 1 ? height : (height * ratio);
                  break;
              case 0 /* IgnoreAspectRatio */:
              default:
                  this.width = width;
                  this.height = height;
                  break;
          }
          return this;
      }
      scaled(width, height, mode = 0 /* IgnoreAspectRatio */) {
          const scaled = new Size(this.width, this.height);
          scaled.scale(width, height, mode);
          return scaled;
      }
      setWidth(val) {
          this.width = val;
      }
      setHeight(val) {
          this.height = val;
      }
      transpose() {
          // Swaps the width and height values.
          ({ width: this.height, height: this.width } = this);
      }
      add(size) {
          this.width += size.width;
          this.height += size.height;
      }
      subtract(size) {
          this.width -= size.width;
          this.height -= size.height;
      }
      multiply(factor) {
          this.width *= factor;
          this.height *= factor;
      }
      divide(divisor) {
          this.width /= divisor;
          this.height /= divisor;
      }
  }

  class Rect {
      constructor(x = 0, y = 0, width = 0, height = 0) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
      }
      get left() {
          return this.x;
      }
      set left(val) {
          this.x = val;
      }
      get right() {
          return this.x + this.width;
      }
      set right(val) {
          this.width = Math.max(0, val - this.x);
      }
      get top() {
          return this.y;
      }
      set top(val) {
          this.y = val;
      }
      get bottom() {
          return this.y + this.height;
      }
      set bottom(val) {
          this.height = Math.max(0, val - this.y);
      }
      setX(val) {
          this.x = val;
      }
      setY(val) {
          this.y = val;
      }
      setWidth(val) {
          this.width = val;
      }
      setHeight(val) {
          this.height = val;
      }
      setSize(width, height) {
          this.width = width;
          this.height = height;
      }
      setRect(x, y, width, height) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
      }
      setCoords(x1, y1, x2, y2) {
          this.left = x1;
          this.top = y1;
          this.right = x2;
          this.bottom = y2;
      }
      topLeft() {
          return new Point(this.left, this.top);
      }
      bottomLeft() {
          return new Point(this.left, this.bottom);
      }
      topRight() {
          return new Point(this.right, this.top);
      }
      bottomRight() {
          return new Point(this.right, this.bottom);
      }
      center() {
          return new Point(this.x + Math.ceil(this.width / 2), this.y + Math.ceil(this.height / 2));
      }
      size() {
          return new Size(this.width, this.height);
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
          if (this.isValid())
              return this;
          const x = this.width < 0 ? this.x + this.width : this.x;
          const y = this.height < 0 ? this.y + this.height : this.y;
          return new Rect(x, y, this.width, this.height);
      }
      contains(x, y) {
          return x > this.x && x < this.right && y > this.y && y < this.bottom;
      }
      intersects(rect) {
          return this.contains(rect.left, rect.top)
              || this.contains(rect.right, rect.top)
              || this.contains(rect.left, rect.bottom)
              || this.contains(rect.right, rect.bottom);
      }
      adjust(dx1, dy1, dx2, dy2) {
          this.left += dx1;
          this.top += dy1;
          this.right += dx2;
          this.bottom += dy2;
          return this;
      }
      adjusted(dx1, dy1, dx2, dy2) {
          const adjusted = new Rect(this.x, this.y, this.width, this.height);
          adjusted.adjust(dx1, dy1, dx2, dy2);
          return adjusted;
      }
      moveTop(y) {
          this.y = y;
          return this;
      }
      moveBottom(y) {
          const dy = y - this.bottom;
          this.y += dy;
          return this;
      }
      moveLeft(x) {
          this.x = x;
          return this;
      }
      moveRight(x) {
          const dx = x - this.right;
          this.x += dx;
          return this;
      }
      moveCenter(point) {
          this.x = point.x - Math.ceil(this.width / 2);
          this.y = point.y - Math.ceil(this.height / 2);
          return this;
      }
      moveTo(x, y) {
          this.x = x;
          this.y = y;
          return this;
      }
      translate(point) {
          this.x += point.x;
          this.y += point.y;
          return this;
      }
      translated(point) {
          return new Rect(this.x += point.x, this.y += point.y, this.width, this.height);
      }
      united(rect) {
          return new Rect(Math.min(this.x, rect.x), Math.min(this.y, rect.y), Math.max(this.width, rect.width), Math.max(this.height, rect.height));
      }
      intersected(rect) {
          return new Rect(Math.max(this.x, rect.x), Math.max(this.y, rect.y), Math.min(this.width, rect.width), Math.min(this.height, rect.height));
      }
  }

  class LayoutItem {
      constructor(width, height) {
          this.minWidth = undefined;
          this.maxWidth = undefined;
          this.minHeight = undefined;
          this.maxHeight = undefined;
          this.geometry = new Rect(0, 0, width, height);
          this.layout = null;
          this.valid = true;
          this.previous = null;
          this.next = null;
      }
      get width() {
          return this.geometry.width;
      }
      set width(val) {
          this.geometry.width = val;
      }
      get height() {
          return this.geometry.height;
      }
      set height(val) {
          this.geometry.height = val;
      }
      setSize(width, height) {
          this.geometry.setSize(width, height);
      }
      setGeometry(rect) {
          this.geometry = rect;
      }
      invalidate() {
          this.valid = false;
      }
      clone() {
          const item = new LayoutItem();
          item.minWidth = this.minWidth;
          item.maxWidth = this.maxWidth;
          item.minHeight = this.minHeight;
          item.maxHeight = this.maxHeight;
          item.geometry.x = this.geometry.x;
          item.geometry.y = this.geometry.y;
          item.geometry.width = this.geometry.width;
          item.geometry.height = this.geometry.height;
          return item;
      }
  }

  const DefaultItemCreator = (index) => new LayoutItem();
  class Layout extends LayoutItem {
      constructor() {
          super();
          this.items = [];
      }
      get count() {
          return this.items.length;
      }
      setCount(count, item_creator = DefaultItemCreator) {
          for (let index = Math.max(0, this.count - 1); index < count; index++) {
              const item = item_creator(index);
              this.addItem(item);
          }
          this.items.length = count;
      }
      addItem(item) {
          const last = this.count > 0 ? this.items[this.count - 1] : null;
          item.layout = this;
          item.previous = last;
          if (last) {
              last.next = item;
          }
          this.items.push(item);
          return this.count - 1;
      }
      removeItem(item) {
          const index = this.items.indexOf(item);
          this.takeAt(index);
          return index;
      }
      indexOf(item) {
          return this.items.indexOf(item);
      }
      itemAt(index) {
          if (index < this.count) {
              return this.items[index];
          }
          return null;
      }
      takeAt(index) {
          if (index < this.count) {
              const item = this.items[index];
              const { previous, next } = item;
              item.layout = null;
              item.previous = null;
              item.next = null;
              if (previous) {
                  previous.next = next;
              }
              if (next) {
                  next.previous = previous;
              }
              this.items.splice(index, 1);
              return item;
          }
          return null;
      }
  }

  function isNumber(value) {
      /* eslint-disable-next-line */
      return !isNaN(parseFloat(value)) && isFinite(value);
  }
  const DefaultShouldUpdateNext = (...args) => true;
  class BoxLayout extends Layout {
      constructor(orientation) {
          super();
          this.orientation = orientation;
          this.spacing = 0;
      }
      get horizontal() {
          return this.orientation === 0 /* Horizontal */;
      }
      get vertical() {
          return this.orientation === 1 /* Vertical */;
      }
      addItem(item) {
          const index = super.addItem(item);
          this.update(item);
          return index;
      }
      removeItem(item) {
          const { next } = item;
          const index = super.removeItem(item);
          this.update(next);
          return index;
      }
      insertItem(index, item) {
          if (index > this.count - 1) {
              throw new Error('Insert index is out of range.');
          }
          const target = this.itemAt(index);
          const { previous, next } = target;
          if (previous) {
              previous.next = item;
          }
          if (next) {
              next.previous = item;
          }
          item.previous = previous;
          item.next = next;
          this.items.splice(index, 0, item);
          this.update(item);
      }
      check() {
          let current = this.itemAt(0);
          while (current && current.next) {
              const { next } = current;
              if (this.horizontal) {
                  if (next.geometry.left !== current.geometry.right) {
                      debugger;
                  }
              }
              if (this.vertical) {
                  if (next.geometry.top !== current.geometry.bottom) {
                      debugger;
                  }
              }
              current = next;
          }
          console.log(`layout all right. count: ${this.count}`, this);
      }
      update(item, shouldUpdateNext = DefaultShouldUpdateNext) {
          if (isNumber(item)) {
              item = this.itemAt(item);
          }
          if (!item)
              return;
          let current;
          current = item;
          if (current && current.previous) {
              const { previous } = current;
              if (this.horizontal) {
                  current.geometry.left = previous.geometry.right;
              }
              if (this.vertical) {
                  current.geometry.top = previous.geometry.bottom;
              }
          }
          while (current && current.next && shouldUpdateNext(current)) {
              const { next } = current;
              if (this.horizontal) {
                  if (next.geometry.left === current.geometry.right) {
                      break;
                  }
                  next.geometry.left = current.geometry.right;
              }
              if (this.vertical) {
                  // console.debug(
                  //   'update layout \n',
                  //   `current top: ${current.geometry.top} \n`,
                  //   `current bottom: ${current.geometry.bottom} \n`,
                  //   `next top: ${next.geometry.top} \n`,
                  //   `next bottom: ${next.geometry.bottom} \n`,
                  // );
                  if (next.geometry.top === current.geometry.bottom) {
                      break;
                  }
                  next.geometry.top = current.geometry.bottom;
              }
              current = next;
          }
          const last = this.itemAt(this.count - 1);
          this.geometry.right = last.geometry.right;
          this.geometry.bottom = last.geometry.bottom;
          // this.check();
      }
  }

  const DefaultCompare = (val, wanted) => (val < wanted
      ? -1
      : val > wanted
          ? 1
          : 0);
  /**
   * @param array sorted array with compare func
   * @param wanted search item
   * @param compare (optional) custom compare func
   * @param from (optional) start index
   * @param to (optional) exclusive end index
   * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
   */
  function binarySearch(array = [], wanted, compare = DefaultCompare, from = 0, to = array.length - 1, bound = 0) {
      if (from >= to)
          return to;
      const initFrom = from;
      const initTo = to;
      let mid = 0;
      let result = 0;
      let found = -1;
      /* eslint-disable no-continue */
      while (from <= to) {
          /* eslint-disable-next-line */
          mid = from + to >>> 1;
          try {
              result = compare(array[mid], wanted, mid);
          }
          catch (e) {
              console.log(initFrom, initTo, mid, to);
              throw e;
          }
          if (result < 0) {
              from = mid + 1;
              continue;
          }
          if (result > 0) {
              to = mid - 1;
              continue;
          }
          found = mid;
          if (bound < 0) {
              to = mid - 1;
              continue;
          }
          if (bound > 0) {
              from = mid + 1;
              continue;
          }
          return mid;
      }
      if (found < 0) {
          console.log(initFrom, initTo, mid, to);
          debugger;
      }
      return found >= 0 ? found : to;
  }

  function exponentialSearch(array = [], wanted, compare, from, to, bound) {
      let index = from;
      let interval = 1;
      while (index < to
          && compare(array[index], wanted, index) < 0) {
          index += interval;
          interval *= 2;
      }
      return binarySearch(array, wanted, compare, Math.floor(index / 2), Math.min(index, to), bound);
  }

  const NAMESPACE$b = 'ListView';
  const {
    createComponent: createComponent$P,
    bem: bem$O
  } =
  /*#__PURE__*/
  createNamespace('list-view');
  var listView = /*#__PURE__*/
  createComponent$P({
    provide() {
      return {
        [NAMESPACE$b]: this
      };
    },

    props: {
      add: {
        type: String,
        default: ''
      },
      addDisplaced: {
        type: String,
        default: ''
      },
      cacheBuffer: {
        type: Number,
        default: 3
      },
      count: {
        type: Number,
        default: 0
      },
      currentIndex: {
        type: Number,
        default: -1
      },
      delegate: {
        type: Object,
        default: () => ({})
      },
      displaced: {
        type: String,
        default: ''
      },
      displayMarginBeginning: {
        type: Number,
        default: 0
      },
      displayMarginEnd: {
        type: Number,
        default: 0
      },
      footer: {
        type: Object,
        default: () => ({})
      },
      footerPositioning: {
        type: Number,
        default: 0
      },
      header: {
        type: Object,
        default: () => ({})
      },
      headerPositioning: {
        type: Number,
        default: 0
      },
      highlight: {
        type: Object,
        default: () => ({})
      },
      highlightFollowsCurrentItem: {
        type: Boolean,
        default: true
      },
      highlightMoveDuration: {
        type: Number,
        default: 1000
      },
      highlightMoveVelocity: {
        type: Number,
        default: -1
      },
      highlightRangeMode: {
        type: Number,
        default: 0
      },
      highlightResizeDuration: {
        type: Number,
        default: 0
      },
      highlightResizeVelocity: {
        type: Number,
        default: 0
      },
      keyNavigationEnabled: {
        type: Boolean,
        default: true
      },
      keyNavigationWraps: {
        type: Boolean,
        default: false
      },
      layoutDirection: {
        type: Number,
        default: 0
      },
      model: {
        type: [Object, Number, Array],
        default: () => []
      },
      move: {
        type: String,
        default: ''
      },
      moveDisplaced: {
        type: String,
        default: ''
      },
      orientation: {
        type: Number,
        default: 1
        /* Vertical */
        ,

        validator(val) {
          return val === 1
          /* Vertical */
          || val === 0
          /* Horizontal */
          ;
        }

      },
      populate: {
        type: String,
        default: ''
      },
      preferredHighlightBegin: {
        type: Number,
        default: 0
      },
      preferredHighlightEnd: {
        type: Number,
        default: 0
      },
      remove: {
        type: String,
        default: ''
      },
      removeDisplaced: {
        type: String,
        default: ''
      },
      section: {
        type: Object,
        default: () => ({
          property: '',
          criteria: 0,
          delegate: null,
          labelPositioning: 0
        })
      },
      snapMode: {
        type: Number,
        default: 0
      },
      spacing: {
        type: Number,
        default: 0
      },
      verticalLayoutDirection: {
        type: String,
        default: ''
      }
    },
    computed: {
      currentItem() {
        return null;
      },

      currentSection() {
        return '';
      },

      footerItem() {
        return null;
      },

      headerItem() {
        return null;
      },

      highlightItem() {
        return null;
      },

      horizontal() {
        return this.orientation === 0
        /* Horizontal */
        ;
      },

      vertical() {
        return this.orientation === 1
        /* Vertical */
        ;
      },

      visibleItemCount() {
        return this.visibleEndIndex - this.visibleStartIndex + 1;
      },

      itemCount() {
        if (Array.isArray(this.model)) {
          return this.model.length;
        }

        return this.model;
      }

    },
    methods: {
      decrementCurrentIndex() {},

      forceLayout() {},

      incrementCurrentIndex() {},

      indexAt(x, y) {
        const index = binarySearch(this.layout.items, this.horizontal ? x : y, (item, wanted) => {
          const {
            left,
            right,
            top,
            bottom
          } = item.geometry;
          const leftBoundary = this.horizontal ? left : top;
          const rightBoundary = this.horizontal ? right : bottom;

          if (rightBoundary < wanted) {
            return -1;
          }

          if (leftBoundary > wanted) {
            return 1;
          }

          return 0;
        });
        return index;
      },

      itemAt(x, y) {
        const index = this.indexAt(x, y);
        return this.itemAtIndex(index);
      },

      itemAtIndex(index) {
        if (Array.isArray(this.model)) {
          return this.model[index];
        }

        return index;
      },

      positionViewAtBeginning() {},

      positionViewAtEnd() {},

      positionViewAtIndex(index, mode) {
      },

      itemLayoutAt(x, y) {
        const index = this.indexAt(x, y);
        return this.layout.itemAt(index);
      },

      itemLayoutAtIndex(index) {
        return this.layout.itemAt(index);
      },

      itemStyleAtIndex(index) {
        const {
          geometry
        } = this.layout.itemAt(index);
        return Object.freeze({
          left: `${geometry.left}px`,
          top: `${geometry.top}px`,
          width: this.horizontal ? 'auto' : '100%',
          height: this.horizontal ? '100%' : 'auto'
        });
      },

      mapToItemIndex(visibleIndex) {
        return this.from + visibleIndex;
      },

      itemViewAt(id) {
        return this.views[id];
      },

      itemViewAtIndex(index) {
        const viewId = Object.keys(this.views).find(id => this.views[id].index === index);
        return this.itemViewAt(viewId);
      },

      addView(view) {
        const count = Object.keys(this.views).length;
        const {
          id = count
        } = view;
        view.id = id;
        this.views[id] = view;
      },

      removeView(id) {
        delete this.views[id];
        delete this.cachedViews[id];
      },

      cacheView(id) {
        const view = this.views[id];
        view.style = { ...this.itemStyleAtIndex(view.index),
          display: 'none'
        };
        this.cachedViews[id] = view;
      },

      onScroll(event) {
        const {
          scrollLeft,
          scrollTop
        } = event.target;
        const threshold = this.minimumItemSize; // const threshold = 16;

        if (Math.abs(this.scrollLeft - scrollLeft) >= threshold || Math.abs(this.scrollTop - scrollTop) >= threshold) {
          // const dx = scrollLeft - this.scrollLeft;
          // const dy = scrollTop - this.scrollTop;
          this.incremental = this.horizontal ? scrollLeft > this.scrollLeft : scrollTop > this.scrollTop;
          this.decremental = !this.incremental;
          this.scrollLeft = scrollLeft;
          this.scrollTop = scrollTop;

          if (!this.pending) {
            this.onUpdate();
          }
        }
      },

      async onLayout(index, offsetWidth, offsetHeight) {
        const item = this.layout.itemAt(index);
        item.setSize(offsetWidth, offsetHeight);
        this.minimumItemSize = Math.min(this.minimumItemSize, this.horizontal ? offsetWidth : offsetHeight);
        this.maximumItemSize = Math.max(this.maximumItemSize, this.horizontal ? offsetWidth : offsetHeight);
        this.dirtyIndex = Math.min(this.dirtyIndex, index); // if (!this.pending) {
        //   this.pending = true;
        //   await this.$nextTick();
        //   this.layout.update(this.dirtyIndex);
        //   this.dirtyIndex = this.layout.count;
        //   this.onUpdate(true);
        //   this.pending = false;
        // }

        if (!this.pending) {
          this.pending = requestAnimationFrame(() => {
            this.layout.update(this.dirtyIndex);
            this.dirtyIndex = this.layout.count;
            this.onUpdate(true);
            this.pending = false;
          });
        }
      },

      async onUpdate(force = false) {
        const {
          count
        } = this.layout;
        const clientSize = this.horizontal ? this.clientWidth : this.clientHeight;
        const leftBoundary = this.horizontal ? this.scrollLeft : this.scrollTop;
        const rightBoundary = leftBoundary + clientSize;
        const lastFrom = this.from;
        const lastTo = this.to;
        const last = this.layout.itemAt(count - 1);
        const total = this.horizontal ? last.geometry.right : last.geometry.bottom;
        let newFrom;
        let newTo;
        newFrom = binarySearch(this.layout.items, leftBoundary, (item, wanted) => {
          const {
            left,
            right,
            top,
            bottom
          } = item.geometry;
          const leftBound = this.horizontal ? left : top;
          const rightBound = this.horizontal ? right : bottom;

          if (rightBound < wanted) {
            return -1;
          }

          if (leftBound > wanted) {
            return 1;
          }

          return 0;
        }, this.incremental ? lastFrom : Math.floor(leftBoundary / this.maximumItemSize), this.incremental ? Math.min(count - 1, Math.ceil(leftBoundary / this.minimumItemSize)) : lastTo);

        if (total > rightBoundary) {
          newTo = exponentialSearch(this.layout.items, rightBoundary, (item, wanted) => {
            const {
              left,
              right,
              top,
              bottom
            } = item.geometry;
            const leftBound = this.horizontal ? left : top;
            const rightBound = this.horizontal ? right : bottom;

            if (rightBound < wanted) {
              return -1;
            }

            if (leftBound > wanted) {
              return 1;
            }

            return 0;
          }, newFrom, count - 1);
        } else {
          newTo = count - 1;
        }

        newFrom = Math.max(0, newFrom);
        newTo = Math.min(count - 1, newTo);
        Object.keys(this.views).forEach(id => {
          const view = this.views[id];
          const {
            index
          } = view;

          if (index < newFrom || index > newTo) {
            this.cacheView(id);
          } else {
            view.style = this.itemStyleAtIndex(index);
          }
        });
        let avaliable = Object.keys(this.cachedViews);

        for (let index = newFrom; index <= newTo; index++) {
          if (index < lastFrom || index > lastTo) {
            let view = this.itemViewAtIndex(index);

            if (view) {
              delete this.cachedViews[view.id];
              view.style = this.itemStyleAtIndex(index);
              avaliable = Object.keys(this.cachedViews);
              continue;
            } else if (avaliable.length) {
              const id = avaliable.shift();
              view = this.cachedViews[id];
              delete this.cachedViews[id];
            } else {
              view = {};
              this.addView(view);
            }

            view.index = index;
            view.layout = this.layout.itemAt(index);
            view.item = this.itemAtIndex(index);
            view.style = this.itemStyleAtIndex(index);
          }
        }

        if (force || newFrom !== lastFrom || newTo !== lastTo) {
          this.from = newFrom;
          this.to = newTo;
          this.$forceUpdate();
        }
      }

    },

    beforeMount() {
      const ITEM_INITIAL_SIZE = 50;
      const LIST_VIEW_INITIAL_SIZE = 500;
      const count = LIST_VIEW_INITIAL_SIZE / ITEM_INITIAL_SIZE;
      this.layout = new BoxLayout(this.orientation);
      this.layout.setCount(this.itemCount, () => new LayoutItem(50, 50));
      this.views = Object.create(null);
      this.cachedViews = Object.create(null);
      this.from = 0;
      this.to = Math.min(count - 1, this.itemCount);
      this.minimumItemSize = ITEM_INITIAL_SIZE;
      this.maximumItemSize = ITEM_INITIAL_SIZE;
      this.dirtyIndex = this.itemCount;
      this.pending = false;
      this.scrollLeft = 0;
      this.scrollTop = 0;
      this.incremental = true;
      this.decremental = false; // init view

      for (let index = this.from; index <= this.to; index++) {
        this.addView({
          index,
          layout: this.layout.itemAt(index),
          item: this.itemAtIndex(index),
          style: this.itemStyleAtIndex(index)
        });
      }
    },

    async mounted() {
      this.$emit('add');
      this.$emit('remove');
      const viewport = this.$refs.viewport;
      this.clientWidth = viewport.clientWidth;
      this.clientHeight = viewport.clientHeight;
      await this.$nextTick();
    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$O(),
        "ref": "viewport",
        "on": {
          "scroll": this.onScroll
        }
      }, [h("div", {
        "class": bem$O('spacer'),
        "style": {
          width: `${this.layout.geometry.width}px`,
          height: `${this.layout.geometry.height}px`
        }
      }), h("transition-group", {
        "attrs": {
          "tag": 'div'
        },
        "class": bem$O('content')
      }, [Object.keys(this.views).map(index => {
        const view = this.views[index];
        return h(ListItem, {
          "key": view.id,
          "attrs": {
            "index": view.index,
            "item": view.item
          },
          "style": view.style,
          "scopedSlots": {
            default: () => {
              return this.slots('delegate') || view.index;
            }
          }
        });
      })])]);
    }

  });

  function usePopupDuration() {
      return createMixins({
          props: {
              // This property holds the timeout (milliseconds) after which the tool tip is hidden.
              // A tooltip with a negative timeout does not hide automatically.
              // The default value is -1.
              duration: Number,
          },
          beforeMount() {
              this.$on('opened', () => {
                  if (this.duration > 0) {
                      this.durationTimeout = setTimeout(() => this.close('timeout'), this.duration);
                  }
              });
              this.$on('aboutToHide', () => {
                  if (this.durationTimeout) {
                      clearTimeout(this.durationTimeout);
                  }
              });
          },
      });
  }

  const spinners = {
      bubbles: {
          dur: 1000,
          circles: 9,
          fn: (dur, index, total) => {
              const animationDelay = `${(dur * index / total) - dur}ms`;
              const angle = 2 * Math.PI * index / total;
              return {
                  r: 5,
                  style: {
                      top: `${9 * Math.sin(angle)}px`,
                      left: `${9 * Math.cos(angle)}px`,
                      'animation-delay': animationDelay,
                  },
              };
          },
      },
      circles: {
          dur: 1000,
          circles: 8,
          fn: (dur, index, total) => {
              const step = index / total;
              const animationDelay = `${(dur * step) - dur}ms`;
              const angle = 2 * Math.PI * step;
              return {
                  r: 5,
                  style: {
                      top: `${9 * Math.sin(angle)}px`,
                      left: `${9 * Math.cos(angle)}px`,
                      'animation-delay': animationDelay,
                  },
              };
          },
      },
      circular: {
          dur: 1400,
          elmDuration: true,
          circles: 1,
          fn: () => {
              return {
                  r: 20,
                  cx: 44,
                  cy: 44,
                  fill: 'none',
                  viewBox: '22 22 44 44',
                  transform: 'translate(0,0)',
                  style: {},
              };
          },
      },
      crescent: {
          dur: 750,
          circles: 1,
          fn: () => {
              return {
                  r: 26,
                  style: {},
              };
          },
      },
      dots: {
          dur: 750,
          circles: 3,
          fn: (_, index) => {
              const animationDelay = `${-(110 * index)}ms`;
              return {
                  r: 6,
                  style: {
                      left: `${9 - (9 * index)}px`,
                      'animation-delay': animationDelay,
                  },
              };
          },
      },
      lines: {
          dur: 1000,
          lines: 12,
          fn: (dur, index, total) => {
              const transform = `rotate(${30 * index + (index < 6 ? 180 : -180)}deg)`;
              const animationDelay = `${(dur * index / total) - dur}ms`;
              return {
                  y1: 17,
                  y2: 29,
                  style: {
                      transform,
                      'animation-delay': animationDelay,
                  },
              };
          },
      },
      'lines-small': {
          dur: 1000,
          lines: 12,
          fn: (dur, index, total) => {
              const transform = `rotate(${30 * index + (index < 6 ? 180 : -180)}deg)`;
              const animationDelay = `${(dur * index / total) - dur}ms`;
              return {
                  y1: 12,
                  y2: 20,
                  style: {
                      transform,
                      'animation-delay': animationDelay,
                  },
              };
          },
      },
  };
  const SPINNERS = spinners;

  const {
    createComponent: createComponent$Q,
    bem: bem$P
  } =
  /*#__PURE__*/
  createNamespace('spinner');

  function getSpinnerName(name) {
    const spinnerName = name || config.get('spinner');
    const mode = getSkylineMode();

    if (spinnerName) {
      return spinnerName;
    }

    return mode === 'ios' ? 'lines' : 'circular';
  }

  function buildCircle(h, spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style['animation-duration'] = `${duration}ms`;
    return h("svg", {
      "attrs": {
        "viewBox": data.viewBox || '0 0 64 64'
      },
      "style": data.style
    }, [h("circle", {
      "attrs": {
        "transform": data.transform || 'translate(32,32)',
        "cx": data.cx,
        "cy": data.cy,
        "r": data.r
      },
      "style": spinner.elmDuration ? {
        animationDuration: `${duration}ms`
      } : {}
    })]);
  }

  function buildLine(h, spinner, duration, index, total) {
    const data = spinner.fn(duration, index, total);
    data.style['animation-duration'] = `${duration}ms`;
    return h("svg", {
      "attrs": {
        "viewBox": data.viewBox || '0 0 64 64'
      },
      "style": data.style
    }, [h("line", {
      "attrs": {
        "transform": "translate(32,32)",
        "y1": data.y1,
        "y2": data.y2
      }
    })]);
  }

  var Spinner = /*#__PURE__*/
  createComponent$Q({
    functional: true,
    props: {
      color: String,
      duration: Number,
      type: String,
      paused: Boolean
    },

    render(h, {
      props,
      data
    }) {
      const spinnerName = getSpinnerName(props.type);
      const spinner = SPINNERS[spinnerName] || SPINNERS.lines;
      const duration = props.duration > 10 ? props.duration : spinner.dur;
      const svgs = [];

      if (spinner.circles !== undefined) {
        for (let i = 0; i < spinner.circles; i++) {
          svgs.push(buildCircle(h, spinner, duration, i, spinner.circles));
        }
      } else if (spinner.lines !== undefined) {
        for (let i = 0; i < spinner.lines; i++) {
          svgs.push(buildLine(h, spinner, duration, i, spinner.lines));
        }
      }

      return h("div", helper([{
        "class": [bem$P({
          [spinnerName]: true,
          paused: !!props.paused || config.getBoolean('testing')
        }), createColorClasses(props.color)],
        "attrs": {
          "role": "progressbar"
        },
        "style": spinner.elmDuration && {
          animationDuration: `${duration}ms`
        }
      }, data]), [svgs]);
    }

  });

  /**
   * iOS Loading Enter Animation
   */
  const iosEnterAnimation$3 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-loading__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
          { offset: 1, opacity: 1, transform: 'scale(1)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Loading Leave Animation
   */
  const iosLeaveAnimation$3 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-loading__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.99, transform: 'scale(1)' },
          { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Loading Enter Animation
   */
  const mdEnterAnimation$2 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-loading__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.01, transform: 'scale(1.1)' },
          { offset: 1, opacity: 1, transform: 'scale(1)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Loading Leave Animation
   */
  const mdLeaveAnimation$2 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-loading__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.99, transform: 'scale(1)' },
          { offset: 1, opacity: 0, transform: 'scale(0.9)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$R,
    bem: bem$Q
  } =
  /*#__PURE__*/
  createNamespace('loading');
  var loading = /*#__PURE__*/
  createComponent$R({
    mixins: [
    /*#__PURE__*/
    usePopup(),
    /*#__PURE__*/
    usePopupDuration()],
    props: {
      message: String,
      spinner: String
    },

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation$2 : iosEnterAnimation$3;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation$2 : iosLeaveAnimation$3;
      });
    },

    methods: {
      onTap() {
        this.$emit('overlay-tap');
      }

    },

    render() {
      const h = arguments[0];
      const {
        message,
        spinner
      } = this;
      return h("div", helper([{
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "role": "dialog",
          "aria-modal": "true"
        },
        "class": bem$Q({
          translucent: this.translucent
        })
      }, {
        "on": this.$listeners
      }]), [h(Overlay, {
        "attrs": {
          "visible": this.dim
        },
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "attrs": {
          "role": "dialog"
        },
        "class": bem$Q('wrapper')
      }, [spinner && h("div", {
        "class": bem$Q('spinner')
      }, [h(Spinner, {
        "attrs": {
          "type": spinner
        }
      })]), message && h("div", {
        "class": bem$Q('content')
      }, [message])])]);
    }

  });

  /**
   * baseAnimation
   * Base class which is extended by the various types. Each
   * type will provide their own animations for open and close
   * and registers itself with Menu.
   */
  const baseAnimation = (isIos) => {
      // https://material.io/guidelines/motion/movement.html#movement-movement-in-out-of-screen-bounds
      // https://material.io/guidelines/motion/duration-easing.html#duration-easing-natural-easing-curves
      /**
       * "Apply the sharp curve to items temporarily leaving the screen that may return
       * from the same exit point. When they return, use the deceleration curve. On mobile,
       * this transition typically occurs over 300ms" -- MD Motion Guide
       */
      return createAnimation().duration(isIos ? 400 : 300);
  };

  /**
   * Menu Overlay Type
   * The menu slides over the content. The content
   * itself, which is under the menu, does not move.
   */
  const menuOverlayAnimation = (menu) => {
      let closedX;
      let openedX;
      const width = menu.width + 8;
      const menuAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      if (menu.isEndSide) {
          // right side
          closedX = `${width}px`;
          openedX = '0px';
      }
      else {
          // left side
          closedX = `${-width}px`;
          openedX = '0px';
      }
      menuAnimation
          .addElement(menu.menuInnerEl)
          .fromTo('transform', `translateX(${closedX})`, `translateX(${openedX})`);
      const isIos = menu.mode === 'ios';
      const opacity = isIos ? 0.2 : 0.25;
      backdropAnimation
          .addElement(menu.backdropEl)
          .fromTo('opacity', 0.01, opacity);
      return baseAnimation(isIos).addAnimation([menuAnimation, backdropAnimation]);
  };

  /**
   * Menu Push Type
   * The content slides over to reveal the menu underneath.
   * The menu itself also slides over to reveal its bad self.
   */
  const menuPushAnimation = (menu) => {
      let contentOpenedX;
      let menuClosedX;
      const { width } = menu;
      if (menu.isEndSide) {
          contentOpenedX = `${-width}px`;
          menuClosedX = `${width}px`;
      }
      else {
          contentOpenedX = `${width}px`;
          menuClosedX = `${-width}px`;
      }
      const menuAnimation = createAnimation()
          .addElement(menu.menuInnerEl)
          .fromTo('transform', `translateX(${menuClosedX})`, 'translateX(0px)');
      const contentAnimation = createAnimation()
          .addElement(menu.contentEl)
          .fromTo('transform', 'translateX(0px)', `translateX(${contentOpenedX})`);
      const backdropAnimation = createAnimation()
          .addElement(menu.backdropEl)
          .fromTo('opacity', 0.01, 0.32);
      return baseAnimation(menu.mode === 'ios').addAnimation([menuAnimation, contentAnimation, backdropAnimation]);
  };

  /**
   * Menu Reveal Type
   * The content slides over to reveal the menu underneath.
   * The menu itself, which is under the content, does not move.
   */
  const menuRevealAnimation = (menu) => {
      const openedX = `${menu.width * (menu.isEndSide ? -1 : 1)}px`;
      const contentOpen = createAnimation()
          .addElement(menu.contentEl) // REVIEW
          .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);
      return baseAnimation(menu.mode === 'ios').addAnimation(contentOpen);
  };

  const createMenuController = () => {
      const menuAnimations = new Map();
      const menus = [];
      const waitUntilReady = () => {
          return Promise.all(Array.from(document.querySelectorAll('.line-menu'))
              .map(menu => {
              // menu.componentOnReady()
              // TODO
              console.log(menu);
              return true;
          }));
      };
      const getMenusSync = () => {
          return menus.map(menu => menu.el);
      };
      const isAnimatingSync = () => {
          return menus.some(menu => menu.isAnimating);
      };
      const _setActiveMenu = (menu) => {
          // if this menu should be enabled
          // then find all the other menus on this same side
          // and automatically disable other same side menus
          const { side } = menu;
          menus
              .filter(m => m.side === side && m !== menu)
              .forEach(m => m.disabled = true);
      };
      const find = (predicate) => {
          const instance = menus.find(predicate);
          if (instance !== undefined) {
              return instance.el;
          }
          return undefined;
      };
      const get = async (menu) => {
          await waitUntilReady();
          if (menu === 'start' || menu === 'end') {
              // there could be more than one menu on the same side
              // so first try to get the enabled one
              const menuRef = find(m => m.side === menu && !m.disabled);
              console.log('menuRef', menuRef);
              if (menuRef) {
                  return menuRef;
              }
              // didn't find a menu side that is enabled
              // so try to get the first menu side found
              console.log('find', find(m => m.side === menu));
              return find(m => m.side === menu);
          }
          if (menu != null) {
              // the menuId was not left or right
              // so try to get the menu by its "id"
              return find(m => m.menuId === menu);
          }
          // return the first enabled menu
          const menuEl = find(m => !m.disabled);
          if (menuEl) {
              return menuEl;
          }
          // get the first menu in the array, if one exists
          return menus.length > 0 ? menus[0] : undefined;
      };
      const _getOpenSync = () => {
          return find(m => m._isOpen);
      };
      /**
       * Get the instance of the opened menu. Returns `null` if a menu is not found.
       */
      const getOpen = async () => {
          await waitUntilReady();
          return _getOpenSync();
      };
      const open = async (menu) => {
          const menuEl = await get(menu);
          if (menuEl) {
              return menuEl.open();
          }
          return false;
      };
      const close = async (menu) => {
          const menuEl = await (menu !== undefined ? get(menu) : getOpen());
          if (menuEl !== undefined) {
              return menuEl.close();
          }
          return false;
      };
      const toggle = async (menu) => {
          const menuEl = await get(menu);
          if (menuEl) {
              return menuEl.toggle();
          }
          return false;
      };
      const enable = async (shouldEnable, menu) => {
          const menuEl = await get(menu);
          if (menuEl) {
              menuEl.disabled = !shouldEnable;
          }
          return menuEl;
      };
      const swipeGesture = async (shouldEnable, menu) => {
          const menuEl = await get(menu);
          if (menuEl) {
              menuEl.swipeGesture = shouldEnable;
          }
          return menuEl;
      };
      const isEnabled = async (menu) => {
          const menuEl = await get(menu);
          if (menuEl) {
              return !menuEl.disabled;
          }
          return false;
      };
      const registerAnimation = (name, animation) => {
          menuAnimations.set(name, animation);
      };
      const _register = (menu) => {
          console.log('menu', menu);
          if (menus.indexOf(menu) < 0) {
              if (!menu.disabled) {
                  _setActiveMenu(menu);
              }
              menus.push(menu);
          }
          console.log(menus);
      };
      const _unregister = (menu) => {
          const index = menus.indexOf(menu);
          if (index > -1) {
              menus.splice(index, 1);
          }
      };
      const _createAnimation = (type, menuCmp) => {
          const animationBuilder = menuAnimations.get(type);
          if (!animationBuilder) {
              throw new Error('animation not registered');
          }
          const animation = animationBuilder(menuCmp);
          return animation;
      };
      /**
       * Get all menu instances.
       */
      const getMenus = async () => {
          await waitUntilReady();
          return getMenusSync();
      };
      const isOpen = async (menu) => {
          if (menu != null) {
              const menuEl = await get(menu);
              return (menuEl !== undefined && menuEl.isOpen());
          }
          const menuEl = await getOpen();
          return menuEl !== undefined;
      };
      /**
       * Get whether or not a menu is animating. Returns `true` if any
       * menu is currently animating.
       */
      const isAnimating = async () => {
          await waitUntilReady();
          return isAnimatingSync();
      };
      const _setOpen = async (menu, shouldOpen, animated) => {
          if (isAnimatingSync()) {
              return false;
          }
          if (shouldOpen) {
              const openedMenu = await getOpen();
              if (openedMenu && menu.el !== openedMenu) {
                  await openedMenu.setOpen(false, false);
              }
          }
          return menu._setOpen(shouldOpen, animated);
      };
      registerAnimation('reveal', menuRevealAnimation);
      registerAnimation('push', menuPushAnimation);
      registerAnimation('overlay', menuOverlayAnimation);
      return {
          registerAnimation,
          get,
          getMenus,
          getOpen,
          isEnabled,
          swipeGesture,
          isAnimating,
          isOpen,
          enable,
          toggle,
          close,
          open,
          _getOpenSync,
          _createAnimation,
          _register,
          _unregister,
          _setOpen,
          _setActiveMenu,
      };
  };
  const menuController = /* @__PURE__ */ createMenuController();

  const {
    createComponent: createComponent$S,
    bem: bem$R
  } =
  /*#__PURE__*/
  createNamespace('menu');
  const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
  const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';

  const computeDelta = (deltaX, isOpen, isEndSide) => {
    return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
  };

  const checkEdgeSide = (win, posX, isEndSide, maxEdgeStart) => {
    if (isEndSide) {
      return posX >= win.innerWidth - maxEdgeStart;
    }

    return posX <= maxEdgeStart;
  };

  const clamp$2 = (min, n, max) => {
    return Math.max(min, Math.min(n, max));
  };

  const assert = (actual, reason) => {
    if (!actual) {
      const message = `ASSERT: ${reason}`;
      console.error(message);
      debugger; // tslint:disable-line

      throw new Error(message);
    }
  };

  const isEnd = side => {
    const isRTL = document.dir === 'rtl';

    switch (side) {
      case 'start':
        return isRTL;

      case 'end':
        return !isRTL;

      default:
        throw new Error(`"${side}" is not a valid value for [side]. Use "start" or "end" instead.`);
    }
  };

  const SHOW_MENU = 'show-menu';
  const SHOW_BACKDROP = 'show-overlay';
  const MENU_CONTENT_OPEN = 'menu-content-open';
  var menu = /*#__PURE__*/
  createComponent$S({
    mixins: [
    /*#__PURE__*/
    useModel('actived')],
    props: {
      contentId: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'overlay'
      },
      maxEdgeStart: {
        type: Number,
        default: 50
      },
      disabled: {
        type: Boolean,
        default: false
      },
      side: {
        type: String,
        default: 'start'
      },
      swipeGesture: {
        type: Boolean,
        default: true
      }
    },

    data() {
      // TODO  mode ios/md
      const easing = iosEasing ;
      const easingReverse = iosEasingReverse ;
      return {
        lastOnEnd: 0,
        blocker: GESTURE_CONTROLLER.createBlocker({
          disableScroll: true
        }),
        isPaneVisible: false,
        isEndSide: false,
        isAnimating: false,
        isOpen: false,
        visible: false,
        easing,
        easingReverse
      };
    },

    methods: {
      onBackdropClick(ev) {
        if (this.isOpen) {
          // TODO
          // && this.lastOnEnd < ev.timeStamp - 100
          const shouldClose = ev.composedPath ? !ev.composedPath().includes(this.menuInnerEl) : false;

          if (shouldClose) {
            ev.preventDefault();
            ev.stopPropagation();
            this.close();
          }
        }
      },

      /**
      * Opens the menu. If the menu is already open or it can't be opened,
      * it returns `false`.
      */
      open(animated = true) {
        return this.setOpen(true, animated);
      },

      /**
      * Closes the menu. If the menu is already closed or it can't be closed,
      * it returns `false`.
      */
      close(animated = true) {
        return this.setOpen(false, animated);
      },

      toggle(animated = true) {
        return this.setOpen(!this.isOpen, animated);
      },

      async setOpen(shouldOpen, animated = true) {
        // return this._setOpen(shouldOpen, animated);
        // },
        // async _setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
        // If the menu is disabled or it is currently being animated, let's do nothing
        if (!this.isActive() || this.isAnimating || shouldOpen === this.isOpen) {
          return false;
        }

        this.beforeAnimation(shouldOpen);
        await this.loadAnimation();
        await this.startAnimation(shouldOpen, animated);
        this.afterAnimation(shouldOpen);
        return true;
      },

      async loadAnimation() {
        // Menu swipe animation takes the menu's inner width as parameter,
        // If `offsetWidth` changes, we need to create a new animation.
        const width = this.menuInnerEl.offsetWidth;

        if (width === this.width && this.animation !== undefined) {
          return;
        }

        this.width = width; // Destroy existing animation

        if (this.animation) {
          this.animation.destroy();
          this.animation = undefined;
        } // Create new animation


        this.animation = await menuController._createAnimation(this.type, this); // TODO global animated: false
        // if (!config.getBoolean('animated', true)) {
        //   this.animation.duration(0);
        // }

        this.animation.fill('both');
      },

      async startAnimation(shouldOpen, animated) {
        const isReversed = !shouldOpen; // type and value concurrent change, animation = undefined

        if (!this.animation) await this.loadAnimation();
        const ani = this.animation.direction(isReversed ? 'reverse' : 'normal').easing(isReversed ? this.easingReverse : this.easing).onFinish(() => {
          if (ani.getDirection() === 'reverse') {
            ani.direction('normal');
          }
        });

        if (animated) {
          await ani.play();
        } else {
          ani.play({
            sync: true
          });
        }
      },

      isActive() {
        return !this.disabled && !this.isPaneVisible;
      },

      canSwipe() {
        return this.swipeGesture && !this.isAnimating && this.isActive();
      },

      canStart(detail) {
        // Do not allow swipe gesture if a modal is open
        // TODO isModalPresented
        // const isModalPresented = !!document.querySelector('ion-modal.show-modal');
        if (!this.canSwipe()) {
          return false;
        }

        if (this.isOpen) {
          return true; // TODO error
        } // TODO
        // if (menuController._getOpenSync()) {
        //   return false;
        // }


        return checkEdgeSide(window, detail.currentX, this.isEndSide, this.maxEdgeStart);
      },

      onWillStart() {
        this.beforeAnimation(!this.isOpen);
        return this.loadAnimation();
      },

      onStart() {
        if (!this.isAnimating || !this.animation) {
          assert(false, 'isAnimating has to be true');
          return;
        } // the cloned animation should not use an easing curve during seek


        this.animation.progressStart(true, this.isOpen ? 1 : 0);
      },

      onMove(detail) {
        if (!this.isAnimating || !this.animation) {
          assert(false, 'isAnimating has to be true');
          return;
        }

        const delta = computeDelta(detail.deltaX, this.isOpen, this.isEndSide);
        const stepValue = delta / this.width;
        this.animation.progressStep(this.isOpen ? 1 - stepValue : stepValue);
      },

      onEnd(detail) {
        if (!this.isAnimating || !this.animation) {
          assert(false, 'isAnimating has to be true');
          return;
        }

        const {
          isOpen
        } = this;
        const {
          isEndSide
        } = this;
        const delta = computeDelta(detail.deltaX, isOpen, isEndSide);
        const {
          width
        } = this;
        const stepValue = delta / width;
        const velocity = detail.velocityX;
        const z = width / 2.0;
        const shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);
        const shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);
        const shouldComplete = isOpen ? isEndSide ? shouldCompleteRight : shouldCompleteLeft : isEndSide ? shouldCompleteLeft : shouldCompleteRight;
        let shouldOpen = !isOpen && shouldComplete;

        if (isOpen && !shouldComplete) {
          shouldOpen = true;
        }

        this.lastOnEnd = detail.currentTime; // Account for rounding errors in JS

        let newStepValue = shouldComplete ? 0.001 : -0.001;
        /**
         * TODO: stepValue can sometimes return a negative
         * value, but you can't have a negative time value
         * for the cubic bezier curve (at least with web animations)
         * Not sure if the negative step value is an error or not
         */

        const adjustedStepValue = stepValue < 0 ? 0.01 : stepValue;
        /**
         * Animation will be reversed here, so need to
         * reverse the easing curve as well
         *
         * Additionally, we need to account for the time relative
         * to the new easing curve, as `stepValue` is going to be given
         * in terms of a linear curve.
         */

        newStepValue += getTimeGivenProgression([0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp$2(0, adjustedStepValue, 0.9999))[0] || 0;
        const playTo = this.isOpen ? !shouldComplete : shouldComplete;
        this.animation.easing('cubic-bezier(0.4, 0.0, 0.6, 1)').onFinish(() => this.afterAnimation(shouldOpen), {
          oneTimeCallback: true
        }).progressEnd(playTo ? 1 : 0, this.isOpen ? 1 - newStepValue : newStepValue, 300);
      },

      beforeAnimation(shouldOpen) {
        assert(!this.isAnimating, '_before() should not be called while animating'); // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations

        this.$el.classList.add(SHOW_MENU);

        if (this.backdropEl) {
          this.backdropEl.classList.add(SHOW_BACKDROP);
        }

        this.visible = true;
        this.blocker.block();
        this.isAnimating = true;

        if (shouldOpen) {
          // TODO
          // this.ionWillOpen.emit();
          this.$emit('willOpen');
        } else {
          // TODO
          // this.ionWillClose.emit();
          this.$emit('willClose');
        }
      },

      afterAnimation(isOpen) {
        assert(this.isAnimating, '_before() should be called while animating'); // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        // emit opened/closed events

        this.isOpen = isOpen;
        this.actived = isOpen;
        this.isAnimating = false;

        if (!this.isOpen) {
          this.blocker.unblock();
        }

        if (isOpen) {
          // add css class
          if (this.contentEl) {
            this.contentEl.classList.add(MENU_CONTENT_OPEN);
          } // TODO
          // emit open event
          // this.ionDidOpen.emit();


          this.$emit('open');
        } else {
          // remove css classes
          this.$el.classList.remove(SHOW_MENU);

          if (this.contentEl) {
            this.contentEl.classList.remove(MENU_CONTENT_OPEN);
          }

          if (this.backdropEl) {
            this.backdropEl.classList.remove(SHOW_BACKDROP);
          }

          this.visible = false;

          if (this.animation) {
            this.animation.stop();
          } // TODO
          // emit close event
          // this.ionDidClose.emit();


          this.$emit('close');
        }
      },

      updateState() {
        const isActive = this.isActive();

        if (this.gesture) {
          this.gesture.enable(isActive && this.swipeGesture);
        } // Close menu immediately


        if (!isActive && this.isOpen) {
          // close if this menu is open, and should not be enabled
          this.forceClosing();
        } // if (!this.disabled) {
        //   menuController._setActiveMenu(this);
        // }


        assert(!this.isAnimating, 'can not be animating');
      },

      forceClosing() {
        assert(this.isOpen, 'menu cannot be closed');
        this.isAnimating = true;
        const ani = this.animation.direction('reverse');
        ani.play({
          sync: true
        });
        this.afterAnimation(false);
      },

      typeChanged(value, oldValue) {
        const {
          contentEl
        } = this;
        this.animation = undefined;

        if (contentEl) {
          if (oldValue !== undefined) {
            contentEl.classList.remove(`menu-content-${oldValue}`);
          }

          contentEl.classList.add(`menu-content-${value}`);
          contentEl.removeAttribute('style');
        }

        if (this.menuInnerEl) {
          // Remove effects of previous animations
          this.menuInnerEl.removeAttribute('style');
        }
      },

      sideChanged() {
        this.isEndSide = isEnd(this.side);
      }

    },
    watch: {
      type(value, oldValue) {
        this.typeChanged(value, oldValue);
      },

      disabled() {
        this.updateState();
      },

      side() {
        this.sideChanged();
      },

      actived(val) {
        if (val) {
          this.open();
        }
      }

    },

    async mounted() {
      // TODO isBrowser
      // if (!Build.isBrowser) {
      //   this.disabled = true;
      //   return;
      // }
      const {
        menuInnerEl,
        backdropEl
      } = this.$refs;
      const parent = this.$el.parentNode;
      this.menuInnerEl = menuInnerEl;
      this.backdropEl = backdropEl.$el;

      if (this.contentId === undefined) {
        console.warn(`[DEPRECATED][line-menu] Using the [main] attribute is deprecated, please use the "contentId" property instead:
      BEFORE:
        <line-menu>...</line-menu>
        <div main>...</div>

      AFTER:
        <line-menu contentId="main-content"></line-menu>
        <div id="main-content">...</div>
      `);
      }

      const content = this.contentId !== undefined ? document.getElementById(this.contentId) : parent && parent.querySelector && parent.querySelector('[main]');

      if (!content || !content.tagName) {
        // requires content element
        console.error('Menu: must have a "content" element to listen for drag events on.');
        return;
      }

      this.contentEl = content; // add menu's content classes

      content.classList.add('menu-content');

      if (!content || !content.tagName) {
        // requires content element
        console.error('Menu: must have a "content" element to listen for drag events on.');
        return;
      }

      this.contentEl = content; // add menu's content classes

      content.classList.add('menu-content');
      this.typeChanged(this.type, undefined);
      this.sideChanged(); // TODO
      // register this menu with the app's menu controller
      // menuController._register(this);

      this.gesture = createGesture({
        el: document,
        gestureName: 'menu-swipe',
        gesturePriority: 30,
        threshold: 10,
        canStart: ev => this.canStart(ev),
        onWillStart: () => this.onWillStart(),
        onStart: () => this.onStart(),
        onMove: ev => this.onMove(ev),
        onEnd: ev => this.onEnd(ev)
      });
      this.updateState(); // on Backdrop Click

      document.addEventListener('click', this.onBackdropClick);

      if (this.actived) {
        this.open();
      }
    },

    beforeDestroy() {
      document.removeEventListener('click', this.onBackdropClick);
    },

    destroyed() {
      this.blocker.destroy();

      if (this.animation) {
        this.animation.destroy();
      }

      if (this.gesture) {
        this.gesture.destroy();
        this.gesture = undefined;
      }

      this.animation = undefined;
      this.contentEl = this.backdropEl = this.menuInnerEl = undefined;
    },

    render() {
      const h = arguments[0];
      const {
        isEndSide,
        type,
        disabled,
        isPaneVisible,
        visible
      } = this;
      return h("div", {
        "class": [bem$R(), {
          [`menu-type-${type}`]: true,
          'show-menu': visible,
          'menu-enabled': !disabled,
          'menu-side-end': isEndSide,
          'menu-side-start': !isEndSide,
          'menu-pane-visible': isPaneVisible
        }]
      }, [h("div", {
        "class": "menu-inner",
        "ref": "menuInnerEl"
      }, [this.slots()]), h(Overlay, {
        "ref": "backdropEl",
        "class": "menu-backdrop",
        "attrs": {
          "visible": visible,
          "tappable": false,
          "stopPropagation": false
        }
      })]);
    }

  });

  const {
    createComponent: createComponent$T,
    bem: bem$S
  } =
  /*#__PURE__*/
  createNamespace('note');
  var note = /*#__PURE__*/
  createComponent$T({
    functional: true,
    props: {
      color: String
    },

    render(h, {
      props,
      data,
      slots
    }) {
      return h("div", helper([{
        "class": [bem$S(), createColorClasses(props.color)]
      }, data]), [slots()]);
    }

  });

  const {
    createComponent: createComponent$U,
    bem: bem$T
  } =
  /*#__PURE__*/
  createNamespace('page-indicator');
  var pageIndicator = /*#__PURE__*/
  createComponent$U({
    props: {
      count: {
        type: Number,
        default: 0,
        validator: val => val % 1 === 0
      },
      value: {
        type: Number,
        default: 1
      },
      delegate: {
        type: Object,
        default: () => ({})
      },
      interactive: {
        type: Boolean,
        default: true
      },
      nextIcon: {
        type: [String, Object],
        default: 'chevron_right'
      },
      prevIcon: {
        type: [String, Object],
        default: 'chevron_left'
      },
      countVisible: {
        type: [Number, String],
        default: 6
      }
    },

    data() {
      return {
        length: 0
      };
    },

    computed: {
      list() {
        const countVisible = parseInt(this.countVisible, 10);
        const maxLength = Math.min(Math.max(0, countVisible) || this.count, Math.max(0, this.length) || this.count, this.count);

        if (this.count <= maxLength) {
          return this.range(1, this.count);
        }

        const even = maxLength % 2 === 0 ? 1 : 0;
        const left = Math.floor(maxLength / 2);
        const right = this.count - left + 1 + even;

        if (this.value > left && this.value < right) {
          const start = this.value - left + 2;
          const end = this.value + left - 2 - even;
          return [1, '...', ...this.range(start, end), '...', this.count];
        }

        if (this.value === left) {
          const end = this.value + left - 1 - even;
          return [...this.range(1, end), '...', this.count];
        }

        if (this.value === right) {
          const start = this.value - left + 1;
          return [1, '...', ...this.range(start, this.count)];
        }

        return [...this.range(1, left), '...', ...this.range(right, this.count)];
      }

    },

    mounted() {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.onResize);
    },

    methods: {
      onResize() {
        const width = this.$refs.indicator.clientWidth;
        this.length = Math.floor((width - 100) / 46);
      },

      range(from, to) {
        const range = [];
        from = from > 0 ? from : 1;

        for (let i = from; i <= to; i++) {
          range.push(i);
        }

        return range;
      },

      onClick(value) {
        value = Number.parseInt(value, 10);

        if (Number.isNaN(value)) {
          return;
        }

        this.$emit('input', value);
      },

      next() {
        let value = this.value + 1;

        if (value > this.count) {
          value = this.count;
        }

        this.$emit('input', value);
        this.$emit('next', value);
      },

      previous() {
        let value = this.value - 1;

        if (value < 1) {
          value = 1;
        }

        this.$emit('input', value);
        this.$emit('previous', value);
      }

    },

    render() {
      const h = arguments[0];
      const {
        value,
        list
      } = this;
      return h("ul", {
        "class": bem$T(),
        "ref": "indicator"
      }, [h("li", {
        "class": bem$T('item'),
        "on": {
          "click": () => this.previous()
        }
      }, [h(Icon, {
        "props": { ...(isObject(this.prevIcon) ? this.prevIcon : {
            name: this.prevIcon
          })
        }
      })]), list.map((item, index) => {
        return h("li", {
          "key": index,
          "class": bem$T('item', {
            active: value === item
          }),
          "on": {
            "click": () => this.onClick(item)
          }
        }, [item]);
      }), h("li", {
        "class": bem$T('item'),
        "on": {
          "click": () => this.next()
        }
      }, [h(Icon, {
        "props": { ...(isObject(this.nextIcon) ? this.nextIcon : {
            name: this.nextIcon
          })
        }
      })])]);
    }

  });

  /**
   * iOS Popover Enter Animation
   */
  const POPOVER_IOS_BODY_PADDING = 5;
  const iosEnterAnimation$4 = (baseEl, ev) => {
      let originY = 'top';
      let originX = 'left';
      const contentEl = baseEl.querySelector('.line-popover__content');
      const contentDimentions = contentEl.getBoundingClientRect();
      const contentWidth = contentDimentions.width;
      const contentHeight = contentDimentions.height;
      const bodyWidth = baseEl.ownerDocument.defaultView.innerWidth;
      const bodyHeight = baseEl.ownerDocument.defaultView.innerHeight;
      // If ev was passed, use that for target element
      const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
      const targetTop = targetDim != null && 'top' in targetDim ? targetDim.top : bodyHeight / 2 - contentHeight / 2;
      const targetLeft = targetDim != null && 'left' in targetDim ? targetDim.left : bodyWidth / 2;
      const targetWidth = (targetDim && targetDim.width) || 0;
      const targetHeight = (targetDim && targetDim.height) || 0;
      const arrowEl = baseEl.querySelector('.line-popover__arrow');
      const arrowDim = arrowEl.getBoundingClientRect();
      const arrowWidth = arrowDim.width;
      const arrowHeight = arrowDim.height;
      if (targetDim == null) {
          arrowEl.style.display = 'none';
      }
      const arrowCSS = {
          top: targetTop + targetHeight,
          left: targetLeft + targetWidth / 2 - arrowWidth / 2,
      };
      const popoverCSS = {
          top: targetTop + targetHeight + (arrowHeight - 1),
          left: targetLeft + targetWidth / 2 - contentWidth / 2,
      };
      // If the popover left is less than the padding it is off screen
      // to the left so adjust it, else if the width of the popover
      // exceeds the body width it is off screen to the right so adjust
      //
      let checkSafeAreaLeft = false;
      let checkSafeAreaRight = false;
      // If the popover left is less than the padding it is off screen
      // to the left so adjust it, else if the width of the popover
      // exceeds the body width it is off screen to the right so adjust
      // 25 is a random/arbitrary number. It seems to work fine for ios11
      // and iPhoneX. Is it perfect? No. Does it work? Yes.
      if (popoverCSS.left < POPOVER_IOS_BODY_PADDING + 25) {
          checkSafeAreaLeft = true;
          popoverCSS.left = POPOVER_IOS_BODY_PADDING;
      }
      else if (contentWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left + 25 > bodyWidth) {
          // Ok, so we're on the right side of the screen,
          // but now we need to make sure we're still a bit further right
          // cus....notchurally... Again, 25 is random. It works tho
          checkSafeAreaRight = true;
          popoverCSS.left = bodyWidth - contentWidth - POPOVER_IOS_BODY_PADDING;
          originX = 'right';
      }
      // make it pop up if there's room above
      if (targetTop + targetHeight + contentHeight > bodyHeight && targetTop - contentHeight > 0) {
          arrowCSS.top = targetTop - (arrowHeight + 1);
          popoverCSS.top = targetTop - contentHeight - (arrowHeight - 1);
          baseEl.className += ' line-popover--bottom';
          originY = 'bottom';
          // If there isn't room for it to pop up above the target cut it off
      }
      else if (targetTop + targetHeight + contentHeight > bodyHeight) {
          contentEl.style.bottom = `${POPOVER_IOS_BODY_PADDING}%`;
      }
      arrowEl.style.top = `${arrowCSS.top}px`;
      arrowEl.style.left = `${arrowCSS.left}px`;
      contentEl.style.top = `${popoverCSS.top}px`;
      contentEl.style.left = `${popoverCSS.left}px`;
      if (checkSafeAreaLeft) {
          contentEl.style.left = `calc(${popoverCSS.left}px + var(--ion-safe-area-left, 0px))`;
      }
      if (checkSafeAreaRight) {
          contentEl.style.left = `calc(${popoverCSS.left}px - var(--ion-safe-area-right, 0px))`;
      }
      contentEl.style.transformOrigin = `${originY} ${originX}`;
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popover__wrapper'))
          .fromTo('opacity', 0.01, 1);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease')
          .duration(100)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Popover Leave Animation
   */
  const iosLeaveAnimation$4 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popover__wrapper'))
          .fromTo('opacity', 0.99, 0);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease')
          .duration(500)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Popover Enter Animation
   */
  const mdEnterAnimation$3 = (baseEl, ev) => {
      const POPOVER_MD_BODY_PADDING = 12;
      const doc = baseEl.ownerDocument;
      const isRTL = doc.dir === 'rtl';
      let originY = 'top';
      let originX = isRTL ? 'right' : 'left';
      const contentEl = baseEl.querySelector('.line-popover__content');
      const contentDimentions = contentEl.getBoundingClientRect();
      const contentWidth = contentDimentions.width;
      const contentHeight = contentDimentions.height;
      const bodyWidth = doc.defaultView.innerWidth;
      const bodyHeight = doc.defaultView.innerHeight;
      // If ev was passed, use that for target element
      const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
      // As per MD spec, by default position the popover below the target (trigger) element
      const targetTop = targetDim != null && 'bottom' in targetDim
          ? targetDim.bottom
          : bodyHeight / 2 - contentHeight / 2;
      const targetLeft = targetDim != null && 'left' in targetDim
          ? isRTL
              ? targetDim.left - contentWidth + targetDim.width
              : targetDim.left
          : bodyWidth / 2 - contentWidth / 2;
      const targetHeight = (targetDim && targetDim.height) || 0;
      const popoverCSS = {
          top: targetTop,
          left: targetLeft,
      };
      // If the popover left is less than the padding it is off screen
      // to the left so adjust it, else if the width of the popover
      // exceeds the body width it is off screen to the right so adjust
      if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
          popoverCSS.left = POPOVER_MD_BODY_PADDING;
          // Same origin in this case for both LTR & RTL
          // Note: in LTR, originX is already 'left'
          originX = 'left';
      }
      else if (contentWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left
          > bodyWidth) {
          popoverCSS.left = bodyWidth - contentWidth - POPOVER_MD_BODY_PADDING;
          // Same origin in this case for both LTR & RTL
          // Note: in RTL, originX is already 'right'
          originX = 'right';
      }
      // If the popover when popped down stretches past bottom of screen,
      // make it pop up if there's room above
      if (targetTop + targetHeight + contentHeight > bodyHeight
          && targetTop - contentHeight > 0) {
          popoverCSS.top = targetTop - contentHeight - targetHeight;
          baseEl.className += ' line-popover--bottom';
          originY = 'bottom';
          // If there isn't room for it to pop up above the target cut it off
      }
      else if (targetTop + targetHeight + contentHeight > bodyHeight) {
          contentEl.style.bottom = `${POPOVER_MD_BODY_PADDING}px`;
      }
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const contentAnimation = createAnimation();
      const viewportAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popover__wrapper'))
          .fromTo('opacity', 0.01, 1);
      contentAnimation
          .addElement(contentEl)
          .beforeStyles({
          top: `${popoverCSS.top}px`,
          left: `${popoverCSS.left}px`,
          'transform-origin': `${originY} ${originX}`,
      })
          .fromTo('transform', 'scale(0.01)', 'scale(1)');
      viewportAnimation
          .addElement(baseEl.querySelector('.popover-viewport'))
          .fromTo('opacity', 0.01, 1);
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(0.36,0.66,0.04,1)')
          .duration(300)
          .addAnimation([backdropAnimation, wrapperAnimation, contentAnimation, viewportAnimation]);
  };

  /**
   * Md Popover Leave Animation
   */
  const mdLeaveAnimation$3 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0);
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popover__wrapper'))
          .fromTo('opacity', 0.99, 0);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease')
          .duration(500)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$V,
    bem: bem$U
  } =
  /*#__PURE__*/
  createNamespace('popover');
  var popover = /*#__PURE__*/
  createComponent$V({
    mixins: [
    /*#__PURE__*/
    usePopup()],

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation$3 : iosEnterAnimation$4;
        builder.options = this.event;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation$3 : iosLeaveAnimation$4;
      });
    },

    methods: {
      onTap() {
        this.$emit('overlay-tap');
      }

    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "aria-modal": "true"
        },
        "class": bem$U({
          translucent: this.translucent
        })
      }, {
        "on": this.$listeners
      }]), [h(Overlay, {
        "attrs": {
          "visible": this.dim
        },
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "class": bem$U('wrapper')
      }, [h("div", {
        "class": bem$U('arrow')
      }), h("div", {
        "class": bem$U('content')
      }, [this.slots()])])]);
    }

  });

  const {
    createComponent: createComponent$W,
    bem: bem$V
  } =
  /*#__PURE__*/
  createNamespace('popup');
  const CONTENT_ELEMENT$1 = 'content';
  var popupLegacy = /*#__PURE__*/
  createComponent$W({
    mixins: [
    /*#__PURE__*/
    usePopup()],

    render() {
      const h = arguments[0];
      return h("div", {
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "aria-modal": "true",
          "role": "dialog"
        },
        "class": bem$V()
      }, [h("div", {
        "attrs": {
          "role": "dialog"
        },
        "class": bem$V(CONTENT_ELEMENT$1),
        "ref": CONTENT_ELEMENT$1
      }, [this.slots()])]);
    }

  });

  /**
   * iOS Modal Enter Animation
   */
  const iosEnterAnimation$5 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popup__wrapper'))
          .beforeStyles({ opacity: 1 })
          .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(0.36,0.66,0.04,1)')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * iOS Modal Leave Animation
   */
  const iosLeaveAnimation$5 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-popup__wrapper');
      const wrapperElRect = wrapperEl.getBoundingClientRect();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
      wrapperAnimation
          .addElement(wrapperEl)
          .beforeStyles({ opacity: 1 })
          .fromTo('transform', 'translateY(0%)', `translateY(${baseEl.ownerDocument.defaultView.innerHeight - wrapperElRect.top}px)`);
      return baseAnimation
          .addElement(baseEl)
          .easing('ease-out')
          .duration(250)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Modal Enter Animation
   */
  const mdEnterAnimation$4 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
      wrapperAnimation
          .addElement(baseEl.querySelector('.line-popup__wrapper'))
          .keyframes([
          { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
          { offset: 1, opacity: 1, transform: 'translateY(0px)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(0.36,0.66,0.04,1)')
          .duration(280)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  /**
   * Md Modal Leave Animation
   */
  const mdLeaveAnimation$4 = (baseEl) => {
      const baseAnimation = createAnimation();
      const backdropAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-popup__wrapper');
      backdropAnimation
          .addElement(baseEl.querySelector('.line-overlay'))
          .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
      wrapperAnimation
          .addElement(wrapperEl)
          .keyframes([
          { offset: 0, opacity: 0.99, transform: 'translateY(0px)' },
          { offset: 1, opacity: 0, transform: 'translateY(40px)' },
      ]);
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(0.47,0,0.745,0.715)')
          .duration(200)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const {
    createComponent: createComponent$X,
    bem: bem$W
  } =
  /*#__PURE__*/
  createNamespace('popup');
  var popup = /*#__PURE__*/
  createComponent$X({
    mixins: [
    /*#__PURE__*/
    usePopup()],

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation$4 : iosEnterAnimation$5;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation$4 : iosLeaveAnimation$5;
      });
    },

    methods: {
      onTap() {
        this.$emit('overlay-tap');
      }

    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "attrs": {
          "aria-modal": "true",
          "role": "dialog"
        },
        "class": bem$W()
      }, {
        "on": this.$listeners
      }]), [h(Overlay, {
        "on": {
          "tap": this.onTap
        }
      }), h("div", {
        "attrs": {
          "role": "dialog"
        },
        "class": bem$W('wrapper')
      }, [this.slots()])]);
    }

  });

  const {
    createComponent: createComponent$Y,
    bem: bem$X
  } =
  /*#__PURE__*/
  createNamespace('progress');
  var progressBar = /*#__PURE__*/
  createComponent$Y({
    props: {
      from: {
        type: Number,
        default: 0
      },
      to: {
        type: Number,
        default: 100
      },
      value: {
        type: Number,
        default: 0
      },
      bufferValue: {
        type: Number,
        default: 0
      },
      stream: {
        type: Boolean,
        default: false
      },
      indeterminate: {
        type: Boolean,
        default: false
      },
      height: {
        type: [Number, String],
        default: 4
      },
      color: {
        type: String,
        default: '#10c29b'
      }
    },
    computed: {
      style() {
        const style = {
          height: '4px'
        };
        style.height = `${this.height}px`;
        return style;
      },

      bufferBarStyle() {
        const {
          color,
          bufferPosition
        } = this;
        const style = {
          backgroundColor: `${color}20`,
          transform: `scaleX(${bufferPosition})`
        };

        if (this.bufferValue) {
          style.backgroundColor = `${color}60`;
        }

        return style;
      },

      streamBarStyle() {
        if (!this.stream) {
          return {};
        }

        const {
          color,
          position,
          bufferPosition
        } = this;
        const style = {
          borderColor: `${color}80`,
          width: `${(1 - position) * 100}%`
        };

        if (this.bufferValue) {
          style.width = `${(1 - bufferPosition) * 100}%`;
        }

        return style;
      },

      bufferPosition() {
        let {
          bufferValue
        } = this;

        if (!bufferValue) {
          return 1;
        }

        const {
          to,
          from
        } = this;

        if (bufferValue > to) {
          bufferValue = to;
          console.warn('bufferValue', this.bufferValue);
        } else if (bufferValue < from) {
          bufferValue = from;
          console.warn('bufferValue', this.bufferValue);
        }

        const position = (bufferValue - from) / (to - from);
        return position;
      },

      position() {
        if (this.indeterminate) {
          return 0;
        }

        const {
          to,
          from
        } = this;
        let {
          value
        } = this;

        if (value > to) {
          value = to;
          console.warn('value', this.value);
        } else if (value < from) {
          value = from;
          console.warn('value', this.value);
        }

        const position = (value - from) / (to - from);
        return position;
      }

    },

    render() {
      const h = arguments[0];
      let children = [];
      const {
        color,
        indeterminate,
        stream,
        bufferBarStyle,
        position,
        streamBarStyle,
        style
      } = this;
      const bufferBar = h("div", {
        "class": "line-progress__buffer-bar",
        "style": bufferBarStyle
      });

      if (indeterminate) {
        [1, 2].forEach(() => {
          const indeterminateBar = h("div", {
            "class": "line-progress__bar-wrap"
          }, [h("div", {
            "class": "line-progress__indeterminate-bar",
            "style": {
              'background-color': color
            }
          })]);
          children.push(indeterminateBar);
        });
      } else {
        const progressBar = h("div", {
          "class": "line-progress__bar",
          "style": {
            backgroundColor: color,
            transform: `scaleX(${position})`
          }
        });
        children = [progressBar];
      }

      children.push(bufferBar);

      if (!indeterminate && stream) {
        const streamBar = h("div", {
          "class": "line-progress__stream-bar",
          "style": streamBarStyle
        });
        children.push(streamBar);
      }

      return h("div", {
        "class": bem$X(),
        "style": style
      }, [children]);
    }

  });

  const {
    createComponent: createComponent$Z,
    bem: bem$Y
  } =
  /*#__PURE__*/
  createNamespace('progress-circular');
  var progressCircular = /*#__PURE__*/
  createComponent$Z({
    props: {
      from: {
        type: Number,
        default: 0
      },
      to: {
        type: Number,
        default: 100
      },
      value: {
        type: Number,
        default: 0
      },
      indeterminate: {
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: 32
      },
      width: {
        type: [Number, String],
        default: 4
      },
      rotate: {
        type: [Number, String],
        default: 0
      },
      color: {
        type: String,
        default: '#10c29b'
      }
    },
    computed: {
      position() {
        let normalizedValue = this.value;
        const {
          from,
          to
        } = this;

        if (normalizedValue < from) {
          normalizedValue = from;
        }

        if (normalizedValue > to) {
          normalizedValue = to;
        }

        if (normalizedValue !== this.value) {
          this.$emit('change', normalizedValue);
        }

        return (normalizedValue - from) / (to - from);
      },

      strokeDashOffset() {
        return `${(1 - this.position) * this.circumference}px`;
      },

      strokeWidth() {
        return Number(this.width) / +this.size * this.viewBoxSize * 2;
      },

      classes() {
        return {
          'is-indeterminate': this.indeterminate
        };
      },

      styles() {
        return {
          height: `${this.size}px`,
          width: `${this.size}px`,
          color: this.color,
          'caret-color': this.color
        };
      },

      svgStyles() {
        return {
          transform: `rotate(${Number(this.rotate)}deg)`
        };
      },

      viewBoxSize() {
        return this.radius / (1 - Number(this.width) / +this.size);
      }

    },

    created() {
      this.radius = 20;
      this.circumference = 2 * Math.PI * this.radius;
      this.strokeDashArray = Math.round(this.circumference * 1000) / 1000;
    },

    render() {
      const h = arguments[0];
      const {
        classes,
        styles,
        value,
        viewBoxSize,
        indeterminate,
        radius,
        strokeWidth,
        strokeDashArray,
        strokeDashOffset
      } = this;
      return h("div", helper([{
        "class": [bem$Y(), classes],
        "style": styles
      }, {
        "on": this.$listeners
      }]), [h("svg", {
        "attrs": {
          "xmlns": "http://www.w3.org/2000/svg",
          "viewBox": `${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`
        }
      }, [[0, 1].map((item, index) => {
        if (!indeterminate || index === 2) {
          return h("circle", {
            "class": index === 1 ? 'underlay' : 'overlay',
            "key": index,
            "attrs": {
              "fill": 'transparent',
              "cx": 2 * viewBoxSize,
              "cy": 2 * viewBoxSize,
              "r": radius,
              "stroke-width": strokeWidth,
              "stroke-dasharray": strokeDashArray,
              "stroke-dashoffset": index === 1 ? 0 : strokeDashOffset
            }
          });
        }

        return null;
      })]), h("div", {
        "class": "info"
      }, [this.slots() ? this.slots : value])]);
    }

  });

  const NAMESPACE$c = 'RadioGroup';
  const {
    createComponent: createComponent$_,
    bem: bem$Z
  } =
  /*#__PURE__*/
  createNamespace('radio');
  var radio = /*#__PURE__*/
  createComponent$_({
    mixins: [
    /*#__PURE__*/
    useCheckItem(NAMESPACE$c),
    /*#__PURE__*/
    useRipple(),
    /*#__PURE__*/
    useColor()],
    inject: {
      Item: {
        default: undefined
      }
    },

    data() {
      return {
        inItem: false
      };
    },

    mounted() {
      this.inItem = this.$el.closest('.line-item') !== null;
      this.emitStyle();
    },

    methods: {
      emitStyle() {
        if (!this.Item) return;
        this.Item.itemStyle('line-radio', {
          'radio-checked': this.checked,
          'interactive-disabled': this.disabled
        });
      }

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
      }

    },

    render() {
      const h = arguments[0];
      const {
        checked,
        disabled,
        color,
        inItem
      } = this;
      return h("div", helper([{
        "class": [bem$Z({
          checked,
          disabled
        }), { ...createColorClasses(color),
          'in-item': inItem
        }],
        "attrs": {
          "role": "radio"
        },
        "on": {
          "click": this.toggle
        }
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$Z('icon')
      }, [h("div", {
        "class": bem$Z('inner')
      })]), this.slots(), h("button", {
        "attrs": {
          "type": "button",
          "disabled": disabled
        }
      })]);
    }

  });

  const NAMESPACE$d = 'RadioButtonGroup';
  const {
    createComponent: createComponent$$,
    bem: bem$_
  } =
  /*#__PURE__*/
  createNamespace('radio-button-group');
  var radioButtonGroup = /*#__PURE__*/
  createComponent$$({
    mixins: [
    /*#__PURE__*/
    useCheckGroup(NAMESPACE$d)],
    props: {
      exclusive: {
        type: Boolean,
        default: true
      }
    },

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$_()
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$10,
    bem: bem$$
  } =
  /*#__PURE__*/
  createNamespace('radio-indicator');
  var RadioIndicator = /*#__PURE__*/
  createComponent$10({
    functional: true,
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    render(h, {
      props,
      data
    }) {
      return h("div", helper([{
        "class": [bem$$({
          checked: props.checked,
          disabled: props.disabled
        }), data.class]
      }, data]));
    }

  });

  const NAMESPACE$e = 'RadioButtonGroup';
  const {
    createComponent: createComponent$11,
    bem: bem$10
  } =
  /*#__PURE__*/
  createNamespace('radio-button');
  var radioButton = /*#__PURE__*/
  createComponent$11({
    mixins: [
    /*#__PURE__*/
    useCheckItem(NAMESPACE$e),
    /*#__PURE__*/
    useRipple()],
    props: {
      text: String
    },

    render() {
      const h = arguments[0];
      const {
        checked,
        disabled,
        text
      } = this;
      return h("div", helper([{
        "class": bem$10()
      }, {
        "on": this.$listeners
      }]), [this.slots('indicator') || h(RadioIndicator, {
        "attrs": {
          "checked": checked,
          "disabled": disabled
        }
      }), this.slots() || text]);
    }

  });

  const {
    createComponent: createComponent$12,
    bem: bem$11
  } =
  /*#__PURE__*/
  createNamespace('range');

  function clamp$3(value, min, max) {
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
  }

  const renderKnob = (h, isRTL, {
    knob,
    value,
    ratio,
    min,
    max,
    disabled,
    pressed,
    pin,
    handleKeyboard
  }) => {
    const start = isRTL ? 'right' : 'left';

    const knobStyle = () => {
      const style = {};
      style[start] = `${ratio * 100}%`;
      return style;
    };

    return h("div", {
      "class": [bem$11('knob-handle', {
        min: value === min,
        max: value === max
      }), {
        'line-range__knob--pressed': pressed,
        'range-knob-a': knob === 'A',
        'range-knob-b': knob === 'B'
      }],
      "on": {
        "keyDown": ev => {
          const {
            key
          } = ev;

          if (key === 'ArrowLeft' || key === 'ArrowDown') {
            handleKeyboard(knob, false);
            ev.preventDefault();
            ev.stopPropagation();
          } else if (key === 'ArrowRight' || key === 'ArrowUp') {
            handleKeyboard(knob, true);
            ev.preventDefault();
            ev.stopPropagation();
          }
        }
      },
      "style": knobStyle(),
      "attrs": {
        "role": "slider",
        "tabindex": disabled ? -1 : 0,
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-disabled": disabled ? 'true' : null,
        "aria-valuenow": value
      }
    }, [pin && h("div", {
      "class": bem$11('pin'),
      "attrs": {
        "role": "presentation"
      }
    }, [Math.round(value)]), h("div", {
      "class": bem$11('knob'),
      "attrs": {
        "role": "presentation"
      }
    })]);
  };

  const ratioToValue = (ratio, min, max, step) => {
    let value = (max - min) * ratio;

    if (step > 0) {
      value = Math.round(value / step) * step + min;
    }

    return clamp$3(min, value, max);
  };

  const valueToRatio = (value, min, max) => {
    return clamp$3(0, (value - min) / (max - min), 1);
  };

  var range = /*#__PURE__*/
  createComponent$12({
    mixins: [
    /*#__PURE__*/
    useColor()],
    inject: {
      Item: {
        default: undefined
      }
    },
    props: {
      text: String,
      color: {
        type: String,
        default: ''
      },
      debounce: {
        type: Number,
        default: 0
      },
      dualKnobs: {
        type: Boolean,
        default: false
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      pin: {
        type: Boolean,
        default: false
      },
      snaps: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 1
      },
      ticks: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: [Number, Object],
        default: 0
      }
    },

    data() {
      let pressedKnob;
      let rangeSlider;
      let rect;
      return {
        hasFocus: false,
        noUpdate: false,
        pressedKnob,
        rangeSlider,
        rect,
        ratioA: 0,
        ratioB: 0
      };
    },

    computed: {
      valA() {
        return ratioToValue(this.ratioA, this.min, this.max, this.step);
      },

      valB() {
        return ratioToValue(this.ratioB, this.min, this.max, this.step);
      },

      ratioLower() {
        if (this.dualKnobs) {
          return Math.min(this.ratioA, this.ratioB);
        }

        return 0;
      },

      ratioUpper() {
        if (this.dualKnobs) {
          return Math.max(this.ratioA, this.ratioB);
        }

        return this.ratioA;
      }

    },
    watch: {
      disabled() {//
      }

    },

    beforeMount() {
      this.updateRatio(); // this.debounceChanged();

      this.disabledChanged();
    },

    async mounted() {
      const {
        rangeSlider
      } = this.$refs;

      if (rangeSlider) {
        this.gesture = createGesture({
          el: rangeSlider,
          gestureName: 'range',
          gesturePriority: 100,
          threshold: 0,
          onStart: ev => this.onStart(ev),
          onMove: ev => this.onMove(ev),
          onEnd: ev => this.onEnd(ev)
        });
        this.gesture.enable(!this.disabled);
      }
    },

    methods: {
      disabledChanged() {
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }

        this.emitStyle();
      },

      valueChanged(value) {
        if (!this.noUpdate) {
          this.updateRatio();
        }

        value = this.ensureValueInBounds(value);
        this.$emit('change', {
          value
        });
      },

      clampBounds(value) {
        return clamp$3(this.min, value, this.max);
      },

      ensureValueInBounds(value) {
        if (this.dualKnobs) {
          return {
            lower: this.clampBounds(value.lower),
            upper: this.clampBounds(value.upper)
          };
        }

        return this.clampBounds(value);
      },

      handleKeyboard(knob, isIncrease) {
        let {
          step
        } = this;
        step = step > 0 ? step : 1;
        step /= this.max - this.min;

        if (!isIncrease) {
          step *= -1;
        }

        if (knob === 'A') {
          this.ratioA = clamp$3(0, this.ratioA + step, 1);
        } else {
          this.ratioB = clamp$3(0, this.ratioB + step, 1);
        }

        this.updateValue();
      },

      getValue() {
        const value = this.value || 0;

        if (this.dualKnobs) {
          if (typeof value === 'object') {
            return value;
          }

          return {
            lower: 0,
            upper: value
          };
        }

        if (typeof value === 'object') {
          return value.upper;
        }

        return value;
      },

      emitStyle() {
        if (!this.Item) return;
        this.Item.itemStyle('range', {
          interactive: true,
          'interactive-disabled': this.disabled
        });
      },

      onStart(detail) {
        const {
          rangeSlider
        } = this.$refs;
        const rect = this.rect = rangeSlider.getBoundingClientRect();
        const {
          currentX
        } = detail; // figure out which knob they started closer to

        let ratio = clamp$3(0, (currentX - rect.left) / rect.width, 1);

        if (document.dir === 'rtl') {
          ratio = 1 - ratio;
        }

        this.pressedKnob = !this.dualKnobs || Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio) ? 'A' : 'B';
        this.setFocus(this.pressedKnob); // update the active knob's position

        this.update(currentX);
      },

      onMove(detail) {
        this.update(detail.currentX);
      },

      onEnd(detail) {
        this.update(detail.currentX);
        this.pressedKnob = undefined;
      },

      update(currentX) {
        // figure out where the pointer is currently at
        // update the knob being interacted with
        const {
          rect
        } = this;
        let ratio = clamp$3(0, (currentX - rect.left) / rect.width, 1);

        if (document.dir === 'rtl') {
          ratio = 1 - ratio;
        }

        if (this.snaps) {
          // snaps the ratio to the current value
          ratio = valueToRatio(ratioToValue(ratio, this.min, this.max, this.step), this.min, this.max);
        } // update which knob is pressed


        if (this.pressedKnob === 'A') {
          this.ratioA = ratio;
        } else {
          this.ratioB = ratio;
        } // Update input value


        this.updateValue();
      },

      updateRatio() {
        const value = this.getValue();
        const {
          min,
          max
        } = this;

        if (this.dualKnobs) {
          this.ratioA = valueToRatio(value.lower, min, max);
          this.ratioB = valueToRatio(value.upper, min, max);
        } else {
          this.ratioA = valueToRatio(value, min, max);
        }
      },

      updateValue() {
        this.noUpdate = true;
        const {
          valA,
          valB
        } = this;
        const value = !this.dualKnobs ? valA : {
          lower: Math.min(valA, valB),
          upper: Math.max(valA, valB)
        };
        this.$emit('input', value);
        this.noUpdate = false;
      },

      setFocus(knob) {
        const knobEl = this.$el.querySelector(knob === 'A' ? '.range-knob-a' : '.range-knob-b');

        if (knobEl) {
          knobEl.focus();
        }
      },

      onBlur() {
        if (this.hasFocus) {
          this.hasFocus = false; // this.ionBlur.emit();

          this.emitStyle();
        }
      },

      onFocus() {
        if (!this.hasFocus) {
          this.hasFocus = true; // this.ionFocus.emit();

          this.emitStyle();
        }
      }

    },

    render(h) {
      const {
        min,
        max,
        step,
        handleKeyboard,
        pressedKnob,
        disabled,
        pin,
        ratioLower,
        ratioUpper
      } = this; // const mode = getSkylineMode(this);

      const barStart = `${ratioLower * 100}%`;
      const barEnd = `${100 - ratioUpper * 100}%`;
      const doc = document;
      const isRTL = doc.dir === 'rtl';
      const start = isRTL ? 'right' : 'left';
      const end = isRTL ? 'left' : 'right';

      const tickStyle = tick => {
        return {
          [start]: tick[start]
        };
      };

      const barStyle = {
        [start]: barStart,
        [end]: barEnd
      };
      const ticks = [];

      if (this.snaps && this.ticks) {
        for (let value = min; value <= max; value += step) {
          const ratio = valueToRatio(value, min, max);
          const tick = {
            ratio,
            active: ratio >= ratioLower && ratio <= ratioUpper
          };
          tick[start] = `${ratio * 100}%`;
          ticks.push(tick);
        }
      } // renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);


      return h("div", {
        "class": bem$11({
          disabled,
          pressed: pressedKnob !== undefined,
          'has-pin': pin
        }),
        "on": {
          "focus": this.onFocus,
          "blur": this.onBlur
        }
      }, [this.slots('start'), h("div", {
        "class": bem$11('slider'),
        "ref": "rangeSlider"
      }, [ticks.map(tick => h("div", {
        "style": tickStyle(tick),
        "attrs": {
          "role": "presentation"
        },
        "class": bem$11('tick', {
          active: tick.active
        })
      })), h("div", {
        "class": bem$11('bar'),
        "attrs": {
          "role": "presentation"
        }
      }), h("div", {
        "class": bem$11('bar', {
          active: true
        }),
        "attrs": {
          "role": "presentation"
        },
        "style": barStyle
      }), renderKnob(h, isRTL, {
        knob: 'A',
        pressed: pressedKnob === 'A',
        value: this.valA,
        ratio: this.ratioA,
        pin,
        disabled,
        handleKeyboard,
        min,
        max
      }), this.dualKnobs && renderKnob(h, isRTL, {
        knob: 'B',
        pressed: pressedKnob === 'B',
        value: this.valB,
        ratio: this.ratioB,
        pin,
        disabled,
        handleKeyboard,
        min,
        max
      })]), this.slots('end')]);
    }

  });

  // Utils
  // -----------------------------
  const shouldUseNativeRefresher = (referenceEl, mode) => {
      const pullingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-pulling ion-spinner');
      const refreshingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-refreshing ion-spinner');
      return (pullingSpinner !== null
          && refreshingSpinner !== null
          && ((mode === 'ios' && isPlatform('mobile') && referenceEl.style.webkitOverflowScrolling !== undefined)
              || mode === 'md'));
  };
  const transitionEnd = (el, callback) => {
      let unRegTrans;
      const opts = { passive: true };
      const unregister = () => {
          if (unRegTrans) {
              unRegTrans();
          }
      };
      const onTransitionEnd = (ev) => {
          if (el === ev.target) {
              unregister();
              callback(ev);
          }
      };
      if (el) {
          el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
          el.addEventListener('transitionend', onTransitionEnd, opts);
          unRegTrans = () => {
              el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
              el.removeEventListener('transitionend', onTransitionEnd, opts);
          };
      }
      return unregister;
  };
  const transitionEndAsync = (el) => {
      return new Promise(resolve => {
          transitionEnd(el, resolve);
      });
  };
  const createBaseAnimation = (pullingRefresherIcon) => {
      const spinner = pullingRefresherIcon.querySelector('ion-spinner');
      const circle = spinner.shadowRoot.querySelector('circle');
      const spinnerArrowContainer = pullingRefresherIcon.querySelector('.spinner-arrow-container');
      const arrowContainer = pullingRefresherIcon.querySelector('.arrow-container');
      const arrow = (arrowContainer) ? arrowContainer.querySelector('ion-icon') : null;
      const baseAnimation = createAnimation()
          .duration(1000)
          .easing('ease-out');
      const spinnerArrowContainerAnimation = createAnimation()
          .addElement(spinnerArrowContainer)
          .keyframes([
          { offset: 0, opacity: '0.3' },
          { offset: 0.45, opacity: '0.3' },
          { offset: 0.55, opacity: '1' },
          { offset: 1, opacity: '1' },
      ]);
      const circleInnerAnimation = createAnimation()
          .addElement(circle)
          .keyframes([
          { offset: 0, strokeDasharray: '1px, 200px' },
          { offset: 0.20, strokeDasharray: '1px, 200px' },
          { offset: 0.55, strokeDasharray: '100px, 200px' },
          { offset: 1, strokeDasharray: '100px, 200px' },
      ]);
      const circleOuterAnimation = createAnimation()
          .addElement(spinner)
          .keyframes([
          { offset: 0, transform: 'rotate(-90deg)' },
          { offset: 1, transform: 'rotate(210deg)' },
      ]);
      /**
       * Only add arrow animation if present
       * this allows users to customize the spinners
       * without errors being thrown
       */
      if (arrowContainer && arrow) {
          const arrowContainerAnimation = createAnimation()
              .addElement(arrowContainer)
              .keyframes([
              { offset: 0, transform: 'rotate(0deg)' },
              { offset: 0.30, transform: 'rotate(0deg)' },
              { offset: 0.55, transform: 'rotate(280deg)' },
              { offset: 1, transform: 'rotate(400deg)' },
          ]);
          const arrowAnimation = createAnimation()
              .addElement(arrow)
              .keyframes([
              { offset: 0, transform: 'translateX(2px) scale(0)' },
              { offset: 0.30, transform: 'translateX(2px) scale(0)' },
              { offset: 0.55, transform: 'translateX(-1.5px) scale(1)' },
              { offset: 1, transform: 'translateX(-1.5px) scale(1)' },
          ]);
          baseAnimation.addAnimation([arrowContainerAnimation, arrowAnimation]);
      }
      return baseAnimation.addAnimation([spinnerArrowContainerAnimation, circleInnerAnimation, circleOuterAnimation]);
  };
  const createScaleAnimation = (pullingRefresherIcon) => {
      const height = pullingRefresherIcon.clientHeight;
      const spinnerAnimation = createAnimation()
          .addElement(pullingRefresherIcon)
          .keyframes([
          { offset: 0, transform: `scale(0) translateY(-${height + 20}px)` },
          { offset: 1, transform: 'scale(1) translateY(100px)' },
      ]);
      return createBaseAnimation(pullingRefresherIcon).addAnimation([spinnerAnimation]);
  };
  const createTranslateAnimation = (pullingRefresherIcon) => {
      const height = pullingRefresherIcon.clientHeight;
      const spinnerAnimation = createAnimation()
          .addElement(pullingRefresherIcon)
          .keyframes([
          { offset: 0, transform: `translateY(-${height + 20}px)` },
          { offset: 1, transform: 'translateY(100px)' },
      ]);
      return createBaseAnimation(pullingRefresherIcon).addAnimation([spinnerAnimation]);
  };
  const createPullingAnimation = (type, pullingSpinner) => {
      return type === 'scale' ? createScaleAnimation(pullingSpinner) : createTranslateAnimation(pullingSpinner);
  };
  const createSnapBackAnimation = (pullingRefresherIcon) => {
      return createAnimation()
          .duration(125)
          .addElement(pullingRefresherIcon)
          .fromTo('transform', 'translateY(var(--ion-pulling-refresher-translate, 100px))', 'translateY(0px)');
  };
  const getRefresherAnimationType = (contentEl) => {
      const previousSibling = contentEl.previousElementSibling;
      const hasHeader = previousSibling !== null && previousSibling.tagName === 'ION-HEADER';
      return hasHeader ? 'translate' : 'scale';
  };
  // iOS Native Refresher
  // -----------------------------
  const setSpinnerOpacity = (spinner, opacity) => {
      spinner.style.setProperty('opacity', opacity.toString());
  };
  const handleScrollWhilePulling = (spinner, ticks, opacity, currentTickToShow) => {
      Vue.nextTick(() => {
          setSpinnerOpacity(spinner, opacity);
          ticks.forEach((el, i) => el.style.setProperty('opacity', (i <= currentTickToShow) ? '0.99' : '0'));
      });
  };
  const handleScrollWhileRefreshing = (spinner, lastVelocityY) => {
      Vue.nextTick(() => {
          // If user pulls down quickly, the spinner should spin faster
          spinner.style.setProperty('--refreshing-rotation-duration', (lastVelocityY >= 1.0) ? '0.5s' : '2s');
          spinner.style.setProperty('opacity', '1');
      });
  };
  const translateElement = (el, value) => {
      if (!el) {
          return Promise.resolve();
      }
      const trans = transitionEndAsync(el);
      Vue.nextTick(() => {
          el.style.setProperty('transition', '0.2s all ease-out');
          if (value === undefined) {
              el.style.removeProperty('transform');
          }
          else {
              el.style.setProperty('transform', `translate3d(0px, ${value}, 0px)`);
          }
      });
      return trans;
  };

  const {
    createComponent: createComponent$13,
    bem: bem$12
  } =
  /*#__PURE__*/
  createNamespace('refresher');

  const clamp$4 = (min, n, max) => {
    return Math.max(min, Math.min(n, max));
  };

  var refresher = /*#__PURE__*/
  createComponent$13({
    props: {
      pullMin: {
        type: Number,
        default: 60
      },
      pullMax: {
        type: Number,
        default: 120
      },
      closeDuration: {
        type: String,
        default: '280ms'
      },
      snapbackDuration: {
        type: String,
        default: '280ms'
      },
      pullFactor: {
        type: Number,
        default: 1
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      // let gesture: Gesture;
      let scrollListenerCallback; // let animations: Animation[];

      return {
        appliedStyles: false,
        didStart: false,
        progress: 0,
        scrollListenerCallback,
        // gesture,
        // animations,
        pointerDown: false,
        needsCompletion: false,
        didRefresh: false,
        lastVelocityY: 0,
        nativeRefresher: false,
        state: 1
        /* Inactive */

      };
    },

    computed: {
      style() {
        const style = {
          transform: `translate3d(0, ${this.top}px, 0)`,
          'transition-duration': ''
        };

        if (!this.touching) {
          style['transition-duration'] = '300ms';
        }

        return style;
      },

      down() {
        return this.state === 0;
      },

      up() {
        return this.state === 1;
      },

      refresher() {
        return this.state === 2;
      }

    },
    methods: {
      checkNativeRefresher() {
        const {
          mode
        } = this;
        const useNativeRefresher = shouldUseNativeRefresher(this.$el, mode);

        if (useNativeRefresher && !this.nativeRefresher) {
          const contentEl = this.$parent.$options.name === 'line-content' ? this.$parent.$el : null;
          this.setupNativeRefresher(contentEl);
        } else if (!useNativeRefresher) {
          this.destroyNativeRefresher();
        }
      },

      destroyNativeRefresher() {
        if (this.scrollEl && this.scrollListenerCallback) {
          this.scrollEl.removeEventListener('scroll', this.scrollListenerCallback);
          this.scrollListenerCallback = undefined;
        }

        this.nativeRefresher = false;
      },

      async resetNativeRefresher(el, state) {
        this.state = state;
        const {
          mode
        } = this;

        if (mode === 'ios') {
          await translateElement(el, undefined);
        } else {
          await transitionEndAsync(this.$el.querySelector('.refresher-refreshing-icon'));
        }

        this.didRefresh = false;
        this.needsCompletion = false;
        this.pointerDown = false;
        this.animations.forEach(ani => ani.destroy());
        this.animations = [];
        this.progress = 0;
        this.state = 1
        /* Inactive */
        ;
      },

      async setupiOSNativeRefresher(pullingSpinner, refreshingSpinner) {
        this.elementToTransform = this.scrollEl;
        const ticks = pullingSpinner && pullingSpinner.shadowRoot.querySelectorAll('svg');
        const MAX_PULL = this.scrollEl.clientHeight * 0.16;
        const NUM_TICKS = ticks.length;
        this.$nextTick(() => ticks.forEach(el => el.style.setProperty('animation', 'none')));

        this.scrollListenerCallback = () => {
          // If pointer is not on screen or refresher is not active, ignore scroll
          if (!this.pointerDown && this.state === 1
          /* Inactive */
          ) {
              return;
            }

          this.$nextTick(() => {
            // PTR should only be active when overflow scrolling at the top
            const {
              scrollTop
            } = this.scrollEl;
            const refresherHeight = this.$el.clientHeight;

            if (scrollTop > 0) {
              /**
               * If refresher is refreshing and user tries to scroll
               * progressively fade refresher out/in
               */
              if (this.state === 8
              /* Refreshing */
              ) {
                  const ratio = clamp$4(0, scrollTop / (refresherHeight * 0.5), 1);
                  this.$nextTick(() => setSpinnerOpacity(refreshingSpinner, 1 - ratio));
                  return;
                }

              this.$nextTick(() => setSpinnerOpacity(pullingSpinner, 0));
              return;
            }

            if (this.pointerDown) {
              if (!this.didStart) {
                this.didStart = true;
                this.$emit('start');
              } // emit "pulling" on every move


              if (this.pointerDown) {
                this.$emit('pull');
              }
            } // delay showing the next tick marks until user has pulled 30px


            const opacity = clamp$4(0, Math.abs(scrollTop) / refresherHeight, 0.99);
            const pullAmount = this.progress = clamp$4(0, (Math.abs(scrollTop) - 30) / MAX_PULL, 1);
            const currentTickToShow = clamp$4(0, Math.floor(pullAmount * NUM_TICKS), NUM_TICKS - 1);
            const shouldShowRefreshingSpinner = this.state === 8
            /* Refreshing */
            || currentTickToShow === NUM_TICKS - 1;

            if (shouldShowRefreshingSpinner) {
              if (this.pointerDown) {
                handleScrollWhileRefreshing(refreshingSpinner, this.lastVelocityY);
              }

              if (!this.didRefresh) {
                this.beginRefresh();
                this.didRefresh = true; // hapticImpact({ style: 'light' });

                /**
                 * Translate the content element otherwise when pointer is removed
                 * from screen the scroll content will bounce back over the refresher
                 */

                if (!this.pointerDown) {
                  translateElement(this.elementToTransform, `${refresherHeight}px`);
                }
              }
            } else {
              this.state = 2
              /* Pulling */
              ;
              handleScrollWhilePulling(pullingSpinner, ticks, opacity, currentTickToShow);
            }
          });
        };

        this.scrollEl.addEventListener('scroll', this.scrollListenerCallback);
        this.gesture = createGesture({
          el: this.scrollEl,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 5,
          onStart: () => {
            this.pointerDown = true;

            if (!this.didRefresh) {
              translateElement(this.elementToTransform, '0px');
            }
          },
          onMove: ev => {
            this.lastVelocityY = ev.velocityY;
          },
          onEnd: () => {
            this.pointerDown = false;
            this.didStart = false;

            if (this.needsCompletion) {
              this.resetNativeRefresher(this.elementToTransform, 32
              /* Completing */
              );
              this.needsCompletion = false;
            } else if (this.didRefresh) {
              this.$nextTick(() => translateElement(this.elementToTransform, `${this.$el.clientHeight}px`));
            }
          }
        });
        this.disabledChanged();
      },

      async setupMDNativeRefresher(contentEl, pullingSpinner, refreshingSpinner) {
        const circle = pullingSpinner && pullingSpinner.shadowRoot.querySelector('circle');
        const pullingRefresherIcon = this.$el.querySelector('.line-refresher-content .refresher-pulling-icon');
        const refreshingCircle = refreshingSpinner && refreshingSpinner.shadowRoot.querySelector('circle');

        if (circle !== null && refreshingCircle !== null) {
          this.$nextTick(() => {
            circle.style.setProperty('animation', 'none'); // This lines up the animation on the refreshing spinner with the pulling spinner

            refreshingSpinner.style.setProperty('animation-delay', '-655ms');
            refreshingCircle.style.setProperty('animation-delay', '-655ms');
          });
        }

        this.gesture = createGesture({
          el: this.scrollEl,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 5,
          canStart: () => this.state !== 8
          /* Refreshing */
          && this.state !== 32
          /* Completing */
          && this.scrollEl.scrollTop === 0,
          onStart: ev => {
            ev.data = {
              animation: undefined,
              didStart: false,
              cancelled: false
            };
          },
          onMove: ev => {
            if (ev.velocityY < 0 && this.progress === 0 && !ev.data.didStart || ev.data.cancelled) {
              ev.data.cancelled = true;
              return;
            }

            if (!ev.data.didStart) {
              ev.data.didStart = true;
              this.state = 2
              /* Pulling */
              ;
              this.$nextTick(() => {
                const animationType = getRefresherAnimationType(contentEl);
                const animation = createPullingAnimation(animationType, pullingRefresherIcon);
                ev.data.animation = animation;
                this.scrollEl.style.setProperty('--overflow', 'hidden');
                animation.progressStart(false, 0);
                this.$emit('start');
                this.animations.push(animation);
              });
              return;
            } // Since we are using an easing curve, slow the gesture tracking down a bit


            this.progress = clamp$4(0, ev.deltaY / 180 * 0.5, 1);
            ev.data.animation.progressStep(this.progress);
            this.$emit('pull');
          },
          onEnd: ev => {
            if (!ev.data.didStart) {
              return;
            }

            this.$nextTick(() => this.scrollEl.style.removeProperty('--overflow'));

            if (this.progress <= 0.4) {
              this.gesture.enable(false);
              ev.data.animation.progressEnd(0, this.progress, 500).onFinish(() => {
                this.animations.forEach(ani => ani.destroy());
                this.animations = [];
                this.gesture.enable(true);
                this.state = 1
                /* Inactive */
                ;
              });
              return;
            }

            const progress = getTimeGivenProgression([0, 0], [0, 0], [1, 1], [1, 1], this.progress)[0];
            const snapBackAnimation = createSnapBackAnimation(pullingRefresherIcon);
            this.animations.push(snapBackAnimation);
            this.$nextTick(async () => {
              pullingRefresherIcon.style.setProperty('--ion-pulling-refresher-translate', `${progress * 100}px`);
              ev.data.animation.progressEnd();
              await snapBackAnimation.play();
              this.beginRefresh();
              ev.data.animation.destroy();
            });
          }
        });
        this.disabledChanged();
      },

      async setupNativeRefresher(contentEl) {
        if (this.scrollListenerCallback || !contentEl || this.nativeRefresher || !this.scrollEl) {
          return;
        }

        this.nativeRefresher = true;
        const pullingSpinner = this.$el.querySelector('.line-refresher-content .refresher-pulling .line-spinner');
        const refreshingSpinner = this.$el.querySelector('.line-refresher-content .refresher-refreshing .line-spinner');
        const {
          mode
        } = this;

        if (mode === 'ios') {
          this.setupiOSNativeRefresher(pullingSpinner, refreshingSpinner);
        } else {
          this.setupMDNativeRefresher(contentEl, pullingSpinner, refreshingSpinner);
        }
      },

      /**
       * Call `complete()` when your async operation has completed.
       * For example, the `refreshing` state is while the app is performing
       * an asynchronous operation, such as receiving more data from an
       * AJAX request. Once the data has been received, you then call this
       * method to signify that the refreshing has completed and to close
       * the refresher. This method also changes the refresher's state from
       * `refreshing` to `completing`.
       */
      async complete() {
        if (this.nativeRefresher) {
          this.needsCompletion = true; // Do not reset scroll el until user removes pointer from screen

          if (!this.pointerDown) {
            this.resetNativeRefresher(this.elementToTransform, 32
            /* Completing */
            );
          }
        } else {
          this.close(32
          /* Completing */
          , '120ms');
        }
      },

      /**
       * Changes the refresher's state from `refreshing` to `cancelling`.
       */
      async cancel() {
        if (this.nativeRefresher) {
          // Do not reset scroll el until user removes pointer from screen
          if (!this.pointerDown) {
            this.resetNativeRefresher(this.elementToTransform, 16
            /* Cancelling */
            );
          }
        } else {
          this.close(16
          /* Cancelling */
          , '');
        }
      },

      /**
       * A number representing how far down the user has pulled.
       * The number `0` represents the user hasn't pulled down at all. The
       * number `1`, and anything greater than `1`, represents that the user
       * has pulled far enough down that when they let go then the refresh will
       * happen. If they let go and the number is less than `1`, then the
       * refresh will not happen, and the content will return to it's original
       * position.
       */
      getProgress() {
        return Promise.resolve(this.progress);
      },

      canStart() {
        if (!this.scrollEl) {
          return false;
        }

        if (this.state !== 1
        /* Inactive */
        ) {
            return false;
          } // if the scrollTop is greater than zero then it's
        // not possible to pull the content down yet


        if (this.scrollEl.scrollTop > 0) {
          return false;
        }

        return true;
      },

      onStart() {
        this.progress = 0;
        this.state = 1
        /* Inactive */
        ;
      },

      onMove(detail) {
        if (!this.scrollEl) {
          return;
        } // this method can get called like a bazillion times per second,
        // so it's built to be as efficient as possible, and does its
        // best to do any DOM read/writes only when absolutely necessary
        // if multi-touch then get out immediately


        const ev = detail.event;

        if (ev.touches && ev.touches.length > 1) {
          return;
        } // do nothing if it's actively refreshing
        // or it's in the way of closing
        // or this was never a startY


        if ((this.state & 56
        /* _BUSY_ */
        ) !== 0) {
          return;
        }

        const pullFactor = Number.isNaN(this.pullFactor) || this.pullFactor < 0 ? 1 : this.pullFactor;
        const deltaY = detail.deltaY * pullFactor; // don't bother if they're scrolling up
        // and have not already started dragging

        if (deltaY <= 0) {
          // the current Y is higher than the starting Y
          // so they scrolled up enough to be ignored
          this.progress = 0;
          this.state = 1
          /* Inactive */
          ;

          if (this.appliedStyles) {
            // reset the styles only if they were applied
            this.setCss(0, '', false, '');
            return;
          }

          return;
        }

        if (this.state === 1
        /* Inactive */
        ) {
            // this refresh is not already actively pulling down
            // get the content's scrollTop
            const scrollHostScrollTop = this.scrollEl.scrollTop; // if the scrollTop is greater than zero then it's
            // not possible to pull the content down yet

            if (scrollHostScrollTop > 0) {
              this.progress = 0;
              return;
            } // content scrolled all the way to the top, and dragging down


            this.state = 2
            /* Pulling */
            ;
          } // prevent native scroll events


        if (ev.cancelable) {
          ev.preventDefault();
        } // the refresher is actively pulling at this point
        // move the scroll element within the content element


        this.setCss(deltaY, '0ms', true, '');

        if (deltaY === 0) {
          // don't continue if there's no delta yet
          this.progress = 0;
          return;
        }

        const {
          pullMin
        } = this; // set pull progress

        this.progress = deltaY / pullMin; // emit "start" if it hasn't started yet

        if (!this.didStart) {
          this.didStart = true;
          this.$emit('start');
        } // emit "pulling" on every move


        this.$emit('pull'); // do nothing if the delta is less than the pull threshold

        if (deltaY < pullMin) {
          // ensure it stays in the pulling state, cuz its not ready yet
          this.state = 2
          /* Pulling */
          ;
          return;
        }

        if (deltaY > this.pullMax) {
          // they pulled farther than the max, so kick off the refresh
          this.beginRefresh();
          return;
        } // pulled farther than the pull min!!
        // it is now in the `ready` state!!
        // if they let go then it'll refresh, kerpow!!


        this.state = 4
        /* Ready */
        ;
      },

      onEnd() {
        // only run in a zone when absolutely necessary
        if (this.state === 4
        /* Ready */
        ) {
            // they pulled down far enough, so it's ready to refresh
            this.beginRefresh();
          } else if (this.state === 2
        /* Pulling */
        ) {
            // they were pulling down, but didn't pull down far enough
            // set the content back to it's original location
            // and close the refresher
            // set that the refresh is actively cancelling
            this.cancel();
          }
      },

      beginRefresh() {
        // assumes we're already back in a zone
        // they pulled down far enough, so it's ready to refresh
        this.state = 8
        /* Refreshing */
        ; // place the content in a hangout position while it thinks

        this.setCss(this.pullMin, this.snapbackDuration, true, ''); // emit "refresh" because it was pulled down far enough
        // and they let go to begin refreshing

        this.$emit('refresh', {
          complete: this.complete.bind(this)
        });
      },

      close(state, delay) {
        // create fallback timer incase something goes wrong with transitionEnd event
        setTimeout(() => {
          this.state = 1
          /* Inactive */
          ;
          this.progress = 0;
          this.didStart = false;
          this.setCss(0, '0ms', false, '');
        }, 600); // reset set the styles on the scroll element
        // set that the refresh is actively cancelling/completing

        this.state = state;
        this.setCss(0, this.closeDuration, true, delay); // TODO: stop gesture
      },

      setCss(y, duration, overflowVisible, delay) {
        if (this.nativeRefresher) {
          return;
        }

        this.appliedStyles = y > 0;
        this.$nextTick(() => {
          if (this.scrollEl && this.backgroundContentEl) {
            const scrollStyle = this.scrollEl.style;
            const backgroundStyle = this.backgroundContentEl.style;
            scrollStyle.transform = backgroundStyle.transform = y > 0 ? `translateY(${y}px) translateZ(0px)` : '';
            scrollStyle.transitionDuration = backgroundStyle.transitionDuration = duration;
            scrollStyle.transitionDelay = backgroundStyle.transitionDelay = delay;
            scrollStyle.overflow = overflowVisible ? 'hidden' : '';
          }
        });
      },

      disabledChanged() {
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }
      }

    },
    watch: {
      disabled() {
        this.disabledChanged();
      }

    },

    async mounted() {
      this.checkNativeRefresher(); // if (this.$el.getAttribute('slot') !== 'fixed') {
      //   console.error('Make sure you use: <line-refresher slot="fixed">');
      //   return;
      // }

      const contentEl = this.$parent.$options.name === 'line-content' ? this.$parent.$el : null;

      if (!contentEl) {
        console.error('<line-refresher> must be used inside an <line-content>');
        return;
      }

      this.scrollEl = await this.$parent.getScrollElement();
      this.backgroundContentEl = this.$parent.$refs.backgroundContentEl;
      const {
        mode
      } = this;

      if (shouldUseNativeRefresher(this.$el, mode)) {
        this.setupNativeRefresher(contentEl);
      } else {
        this.gesture = createGesture({
          el: contentEl,
          gestureName: 'refresher',
          gesturePriority: 10,
          direction: 'y',
          threshold: 20,
          passive: false,
          canStart: () => this.canStart(),
          onStart: () => this.onStart(),
          onMove: ev => this.onMove(ev),
          onEnd: () => this.onEnd()
        });
        this.disabledChanged();
      }
    },

    render() {
      const h = arguments[0];
      const {
        mode
      } = this;
      return h("div", {
        "class": [bem$12(), {
          // Used internally for styling
          [`refresher-${mode}`]: true,
          'refresher-native': this.nativeRefresher,
          'refresher-active': this.state !== 1
          /* Inactive */
          ,
          'refresher-pulling': this.state === 2
          /* Pulling */
          ,
          'refresher-ready': this.state === 4
          /* Ready */
          ,
          'refresher-refreshing': this.state === 8
          /* Refreshing */
          ,
          'refresher-cancelling': this.state === 16
          /* Cancelling */
          ,
          'refresher-completing': this.state === 32
          /* Completing */

        }]
      }, [this.slots()]);
    }

  });

  /* eslint-disable */
  /**
   * Does a simple sanitization of all elements
   * in an untrusted string
   */
  const sanitizeDOMString = (untrustedString) => {
      try {
          if (typeof untrustedString !== 'string' || untrustedString === '') {
              return untrustedString;
          }
          /**
           * Create a document fragment
           * separate from the main DOM,
           * create a div to do our work in
           */
          const documentFragment = document.createDocumentFragment();
          const workingDiv = document.createElement('div');
          documentFragment.appendChild(workingDiv);
          workingDiv.innerHTML = untrustedString;
          /**
           * Remove any elements
           * that are blocked
           */
          blockedTags.forEach(blockedTag => {
              const getElementsToRemove = documentFragment.querySelectorAll(blockedTag);
              for (let elementIndex = getElementsToRemove.length - 1; elementIndex >= 0; elementIndex--) {
                  const element = getElementsToRemove[elementIndex];
                  if (element.parentNode) {
                      element.parentNode.removeChild(element);
                  }
                  else {
                      documentFragment.removeChild(element);
                  }
                  /**
                   * We still need to sanitize
                   * the children of this element
                   * as they are left behind
                   */
                  const childElements = getElementChildren(element);
                  /* tslint:disable-next-line */
                  for (let childIndex = 0; childIndex < childElements.length; childIndex++) {
                      sanitizeElement(childElements[childIndex]);
                  }
              }
          });
          /**
           * Go through remaining elements and remove
           * non-allowed attribs
           */
          // IE does not support .children on document fragments, only .childNodes
          const dfChildren = getElementChildren(documentFragment);
          /* tslint:disable-next-line */
          for (let childIndex = 0; childIndex < dfChildren.length; childIndex++) {
              sanitizeElement(dfChildren[childIndex]);
          }
          // Append document fragment to div
          const fragmentDiv = document.createElement('div');
          fragmentDiv.appendChild(documentFragment);
          // First child is always the div we did our work in
          const getInnerDiv = fragmentDiv.querySelector('div');
          return (getInnerDiv !== null) ? getInnerDiv.innerHTML : fragmentDiv.innerHTML;
      }
      catch (err) {
          console.error(err);
          return '';
      }
  };
  /**
   * Clean up current element based on allowed attributes
   * and then recursively dig down into any child elements to
   * clean those up as well
   */
  const sanitizeElement = (element) => {
      // IE uses childNodes, so ignore nodes that are not elements
      if (element.nodeType && element.nodeType !== 1) {
          return;
      }
      for (let i = element.attributes.length - 1; i >= 0; i--) {
          const attribute = element.attributes.item(i);
          const attributeName = attribute.name;
          // remove non-allowed attribs
          if (!allowedAttributes.includes(attributeName.toLowerCase())) {
              element.removeAttribute(attributeName);
              continue;
          }
          // clean up any allowed attribs
          // that attempt to do any JS funny-business
          const attributeValue = attribute.value;
          /* tslint:disable-next-line */
          if (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) {
              element.removeAttribute(attributeName);
          }
      }
      /**
       * Sanitize any nested children
       */
      const childElements = getElementChildren(element);
      /* tslint:disable-next-line */
      for (let i = 0; i < childElements.length; i++) {
          sanitizeElement(childElements[i]);
      }
  };
  /**
   * IE doesn't always support .children
   * so we revert to .childNodes instead
   */
  const getElementChildren = (el) => {
      return (el.children != null) ? el.children : el.childNodes;
  };
  const allowedAttributes = ['class', 'id', 'href', 'src', 'name', 'slot'];
  const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];

  const {
    createComponent: createComponent$14,
    bem: bem$13
  } =
  /*#__PURE__*/
  createNamespace('refresher-content');
  var refresherContent = /*#__PURE__*/
  createComponent$14({
    props: {
      pullingIcon: String,
      pullingText: String,
      refreshingSpinner: String,
      refreshingText: String
    },

    data() {
      return {
        icon: '',
        spinner: ''
      };
    },

    beforeMount() {
      this.icon = this.pullingIcon;
      this.spinner = this.refreshingSpinner;
    },

    mounted() {
      if (this.pullingIcon === undefined) {
        const {
          mode
        } = this;
        const overflowRefresher = this.$el.style.webkitOverflowScrolling !== undefined ? 'lines' : 'arrow-down';
        this.icon = config.get('refreshingIcon', mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular');
      }

      if (this.refreshingSpinner === undefined) {
        const {
          mode
        } = this;
        this.spinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
      }
    },

    render() {
      const h = arguments[0];
      const {
        icon: pullingIcon,
        pullingText,
        spinner: refreshingSpinner,
        refreshingText
      } = this;
      const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
      const {
        mode
      } = this;
      return h("div", {
        "class": bem$13()
      }, [h("div", {
        "class": "refresher-pulling"
      }, [pullingIcon && hasSpinner && h("div", {
        "class": "refresher-pulling-icon"
      }, [h("div", {
        "class": "spinner-arrow-container"
      }, [h("line-spinner", {
        "attrs": {
          "type": pullingIcon,
          "paused": true
        }
      }), mode === 'md' && pullingIcon === 'circular' && h("div", {
        "class": "arrow-container"
      }, [h("line-icon", {
        "attrs": {
          "name": "caret-back-sharp"
        }
      })])])]), pullingIcon && !hasSpinner && h("div", {
        "class": "refresher-pulling-icon"
      }, [h("line-icon", {
        "attrs": {
          "icon": pullingIcon,
          "lazy": false
        }
      })]), pullingText && h("div", {
        "class": "refresher-pulling-text",
        "attrs": {
          "innerHTML": sanitizeDOMString(pullingText)
        }
      })]), h("div", {
        "class": "refresher-refreshing"
      }, [refreshingSpinner && h("div", {
        "class": "refresher-refreshing-icon"
      }, [h("line-spinner", {
        "attrs": {
          "type": refreshingSpinner
        }
      })]), refreshingText && h("div", {
        "class": "refresher-refreshing-text",
        "attrs": {
          "innerHTML": sanitizeDOMString(refreshingText)
        }
      })])]);
    }

  });

  const {
    createComponent: createComponent$15,
    bem: bem$14
  } =
  /*#__PURE__*/
  createNamespace('row');
  var row = /*#__PURE__*/
  createComponent$15({
    functional: true,

    render(h, {
      data,
      slots
    }) {
      return h("div", helper([{
        "class": bem$14()
      }, data]), [slots()]);
    }

  });

  const {
    createComponent: createComponent$16,
    bem: bem$15
  } =
  /*#__PURE__*/
  createNamespace('slide');
  var slide = /*#__PURE__*/
  createComponent$16({
    render() {
      const h = arguments[0];
      return h("div", {
        "class": [bem$15(), {
          'swiper-slide': true,
          'swiper-zoom-container': true
        }]
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$17,
    bem: bem$16
  } =
  /*#__PURE__*/
  createNamespace('slider');
  var slider = /*#__PURE__*/
  createComponent$17({
    props: {
      from: {
        type: Number,
        default: 0
      },
      handle: {
        type: Object,
        default: () => ({})
      },
      live: {
        type: Boolean,
        default: true
      },
      orientation: {
        type: Number,
        default: 0
      },
      pressed: {
        type: Boolean,
        default: true
      },
      snapMode: {
        type: Number,
        default: 0
      },
      stepSize: {
        type: Number,
        default: 0
      },
      to: {
        type: Number,
        default: 100
      },
      touchDragThreshold: {
        type: Number,
        default: 0
      },
      value: {
        type: Number,
        default: 0
      },
      height: {
        type: String,
        default: '100px'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        dragging: false,
        startX: 0,
        currentX: 0,
        startY: 0,
        currentY: 0,
        position: 0,
        clientY: 0,
        clientX: 0
      };
    },

    computed: {
      containerStyle() {
        const style = {};

        if (this.vertical) {
          style.height = this.height;
        }

        return style;
      },

      buttonStyle() {
        const style = {};
        const key = this.horizontal ? 'left' : 'top';
        style[key] = `calc(${this.position * 100}% - 28px)`;
        return style;
      },

      barStyle() {
        const style = {};
        const key = this.horizontal ? 'width' : 'height';
        style[key] = `${this.position * 100}%`;
        return style;
      },

      stepList() {
        let list = [];
        const {
          from,
          to,
          stepSize
        } = this;

        if (!stepSize || stepSize < 0) {
          return [];
        }

        const length = 100 / ((to - from) / stepSize);
        const step = 100 * stepSize / (to - from);

        for (let i = 0; i <= length; i++) {
          list.push({
            position: i * step
          });
        }

        list = list.filter(el => el.position >= from && el.position <= to);
        return list;
      },

      horizontal() {
        return this.orientation === 0;
      },

      vertical() {
        return this.orientation === 1;
      },

      visualPosition() {
        return false;
      }

    },
    methods: {
      setPosition(value) {
        const {
          from,
          to,
          stepSize
        } = this;

        if (value > to) {
          value = to;
          console.warn('value', this.value);
        } else if (value < from) {
          value = from;
          console.warn('value', this.value);
        }

        let position = (value - from) / (to - from);

        if (stepSize) {
          const length = 100 / ((to - from) / stepSize);
          const steps = Math.round(value / length);
          position = steps / length;
        }

        this.position = position;
      },

      getStepStyle(position) {
        const style = {};
        const key = this.vertical ? 'top' : 'left';
        style[key] = `${position}%`;
        return style;
      },

      onSliderClick(event) {
        if (this.disabled || this.dragging) {
          return;
        }

        const clientRect = this.$refs.slider.getBoundingClientRect();

        if (this.vertical) {
          this.currentY = event.clientY - clientRect.top;
          const value = Math.round(this.currentY / clientRect.height * 100);
          this.$emit('input', value);
          this.startY = this.currentY;
        } else {
          this.currentX = event.clientX - clientRect.left;
          const value = Math.round(this.currentX / clientRect.width * 100);
          this.$emit('input', value);
          this.startX = this.currentX;
        }
      },

      onMousedown(event) {
        event.preventDefault();
        this.onDragStart(event);
        window.addEventListener('mousemove', this.onDragging); // window.addEventListener('touchmove', this.onDragging);

        window.addEventListener('mouseup', this.onDragEnd); // window.addEventListener('touchend', this.onDragEnd);

        window.addEventListener('contextmenu', this.onDragEnd);
      },

      onDragStart(event) {
        this.dragging = true;
        const clientRect = this.$refs.slider.getBoundingClientRect();
        this.clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        this.clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;

        if (this.vertical) {
          this.startY = this.clientY - clientRect.top;
        } else {
          this.startX = this.clientX - clientRect.left;
        }
      },

      onDragging(event) {
        if (this.dragging) {
          this.clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
          this.clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
          const clientRect = this.$refs.slider.getBoundingClientRect();
          let value = 0;

          if (this.vertical) {
            this.currentY = this.clientY - clientRect.top;
            value = Math.round(this.currentY / clientRect.height * 100);

            if (value > this.to) {
              value = this.to;
            } else if (value < this.from) {
              value = this.from;
            }

            this.startY = this.currentY;
          } else {
            this.currentX = this.clientX - clientRect.left;
            value = Math.round(this.currentX / clientRect.width * 100);
            this.startX = this.currentX;

            if (value > this.to) {
              value = this.to;
            } else if (value < this.from) {
              value = this.from;
            }
          }

          this.setPosition(value);
          this.$emit('input', value);
        }
      },

      onDragEnd() {
        if (this.dragging) {
          setTimeout(() => {
            this.dragging = false;
          }, 0);
          window.removeEventListener('mousemove', this.onDragging); // window.removeEventListener('touchmove', this.onDragging);

          window.removeEventListener('mouseup', this.onDragEnd); // window.removeEventListener('touchend', this.onDragEnd);

          window.removeEventListener('contextmenu', this.onDragEnd);
        }
      }

    },

    beforeMount() {
      this.setPosition(this.value);
      this.$emit('moved');
    },

    mounted() {
      const clientRect = this.$refs.slider.getBoundingClientRect();
      this.clientRect = clientRect;
    },

    render() {
      const h = arguments[0];
      const {
        vertical,
        dragging,
        containerStyle,
        buttonStyle,
        barStyle
      } = this;
      return h("div", {
        "class": bem$16({
          vertical
        }),
        "style": containerStyle,
        "ref": "slider"
      }, [h("div", {
        "class": bem$16('container'),
        "on": {
          "click": this.onSliderClick
        }
      }, [this.stepList.map((item, index) => {
        return h("span", {
          "class": {
            step: true,
            'step--active': item.position <= this.position * 100
          },
          "key": index,
          "style": this.getStepStyle(item.position)
        });
      })]), h("div", {
        "class": bem$16('bar'),
        "style": barStyle,
        "on": {
          "click": this.onSliderClick
        }
      }), h("div", {
        "class": bem$16('button', {
          dragging
        }),
        "style": buttonStyle,
        "on": {
          "mousedown": this.onMousedown,
          "touchstart": this.onMousedown
        }
      })]);
    }

  });

  /**
   * SSR Window 1.0.1
   * Better handling for window object in SSR environment
   * https://github.com/nolimits4web/ssr-window
   *
   * Copyright 2018, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: July 18, 2018
   */
  var doc = (typeof document === 'undefined') ? {
    body: {},
    addEventListener: function addEventListener() {},
    removeEventListener: function removeEventListener() {},
    activeElement: {
      blur: function blur() {},
      nodeName: '',
    },
    querySelector: function querySelector() {
      return null;
    },
    querySelectorAll: function querySelectorAll() {
      return [];
    },
    getElementById: function getElementById() {
      return null;
    },
    createEvent: function createEvent() {
      return {
        initEvent: function initEvent() {},
      };
    },
    createElement: function createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute: function setAttribute() {},
        getElementsByTagName: function getElementsByTagName() {
          return [];
        },
      };
    },
    location: { hash: '' },
  } : document; // eslint-disable-line

  var win = (typeof window === 'undefined') ? {
    document: doc,
    navigator: {
      userAgent: '',
    },
    location: {},
    history: {},
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener: function addEventListener() {},
    removeEventListener: function removeEventListener() {},
    getComputedStyle: function getComputedStyle() {
      return {
        getPropertyValue: function getPropertyValue() {
          return '';
        },
      };
    },
    Image: function Image() {},
    Date: function Date() {},
    screen: {},
    setTimeout: function setTimeout() {},
    clearTimeout: function clearTimeout() {},
  } : window; // eslint-disable-line

  /**
   * Dom7 2.1.3
   * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
   * http://framework7.io/docs/dom.html
   *
   * Copyright 2019, Vladimir Kharlampidi
   * The iDangero.us
   * http://www.idangero.us/
   *
   * Licensed under MIT
   *
   * Released on: February 11, 2019
   */

  class Dom7 {
    constructor(arr) {
      const self = this;
      // Create array-like object
      for (let i = 0; i < arr.length; i += 1) {
        self[i] = arr[i];
      }
      self.length = arr.length;
      // Return collection with methods
      return this;
    }
  }

  function $(selector, context) {
    const arr = [];
    let i = 0;
    if (selector && !context) {
      if (selector instanceof Dom7) {
        return selector;
      }
    }
    if (selector) {
        // String
      if (typeof selector === 'string') {
        let els;
        let tempParent;
        const html = selector.trim();
        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          let toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          tempParent = doc.createElement(toCreate);
          tempParent.innerHTML = html;
          for (i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
            // Pure ID selector
            els = [doc.getElementById(selector.trim().split('#')[1])];
          } else {
            // Other selectors
            els = (context || doc).querySelectorAll(selector.trim());
          }
          for (i = 0; i < els.length; i += 1) {
            if (els[i]) arr.push(els[i]);
          }
        }
      } else if (selector.nodeType || selector === win || selector === doc) {
        // Node/element
        arr.push(selector);
      } else if (selector.length > 0 && selector[0].nodeType) {
        // Array of elements or instance of Dom
        for (i = 0; i < selector.length; i += 1) {
          arr.push(selector[i]);
        }
      }
    }
    return new Dom7(arr);
  }

  $.fn = Dom7.prototype;
  $.Class = Dom7;
  $.Dom7 = Dom7;

  function unique(arr) {
    const uniqueArray = [];
    for (let i = 0; i < arr.length; i += 1) {
      if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
    }
    return uniqueArray;
  }

  // Classes and attributes
  function addClass(className) {
    if (typeof className === 'undefined') {
      return this;
    }
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
      }
    }
    return this;
  }
  function removeClass(className) {
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
      }
    }
    return this;
  }
  function hasClass(className) {
    if (!this[0]) return false;
    return this[0].classList.contains(className);
  }
  function toggleClass(className) {
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
      }
    }
    return this;
  }
  function attr(attrs, value) {
    if (arguments.length === 1 && typeof attrs === 'string') {
      // Get attr
      if (this[0]) return this[0].getAttribute(attrs);
      return undefined;
    }

    // Set attrs
    for (let i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i].setAttribute(attrs, value);
      } else {
        // Object
        // eslint-disable-next-line
        for (const attrName in attrs) {
          this[i][attrName] = attrs[attrName];
          this[i].setAttribute(attrName, attrs[attrName]);
        }
      }
    }
    return this;
  }
  // eslint-disable-next-line
  function removeAttr(attr) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].removeAttribute(attr);
    }
    return this;
  }
  function data(key, value) {
    let el;
    if (typeof value === 'undefined') {
      el = this[0];
      // Get value
      if (el) {
        if (el.dom7ElementDataStorage && (key in el.dom7ElementDataStorage)) {
          return el.dom7ElementDataStorage[key];
        }

        const dataKey = el.getAttribute(`data-${key}`);
        if (dataKey) {
          return dataKey;
        }
        return undefined;
      }
      return undefined;
    }

    // Set value
    for (let i = 0; i < this.length; i += 1) {
      el = this[i];
      if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
      el.dom7ElementDataStorage[key] = value;
    }
    return this;
  }
  // Transforms
  // eslint-disable-next-line
  function transform(transform) {
    for (let i = 0; i < this.length; i += 1) {
      const elStyle = this[i].style;
      elStyle.webkitTransform = transform;
      elStyle.transform = transform;
    }
    return this;
  }
  function transition(duration) {
    if (typeof duration !== 'string') {
      duration = `${duration}ms`; // eslint-disable-line
    }
    for (let i = 0; i < this.length; i += 1) {
      const elStyle = this[i].style;
      elStyle.webkitTransitionDuration = duration;
      elStyle.transitionDuration = duration;
    }
    return this;
  }
  // Events
  function on$1(...args) {
    let [eventType, targetSelector, listener, capture] = args;
    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }
    if (!capture) capture = false;

    function handleLiveEvent(e) {
      const target = e.target;
      if (!target) return;
      const eventData = e.target.dom7EventData || [];
      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }
      if ($(target).is(targetSelector)) listener.apply(target, eventData);
      else {
        const parents = $(target).parents(); // eslint-disable-line
        for (let k = 0; k < parents.length; k += 1) {
          if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
        }
      }
    }
    function handleEvent(e) {
      const eventData = e && e.target ? e.target.dom7EventData || [] : [];
      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }
      listener.apply(this, eventData);
    }
    const events = eventType.split(' ');
    let j;
    for (let i = 0; i < this.length; i += 1) {
      const el = this[i];
      if (!targetSelector) {
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7Listeners) el.dom7Listeners = {};
          if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
          el.dom7Listeners[event].push({
            listener,
            proxyListener: handleEvent,
          });
          el.addEventListener(event, handleEvent, capture);
        }
      } else {
        // Live events
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
          if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
          el.dom7LiveListeners[event].push({
            listener,
            proxyListener: handleLiveEvent,
          });
          el.addEventListener(event, handleLiveEvent, capture);
        }
      }
    }
    return this;
  }
  function off$1(...args) {
    let [eventType, targetSelector, listener, capture] = args;
    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }
    if (!capture) capture = false;

    const events = eventType.split(' ');
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let handlers;
        if (!targetSelector && el.dom7Listeners) {
          handlers = el.dom7Listeners[event];
        } else if (targetSelector && el.dom7LiveListeners) {
          handlers = el.dom7LiveListeners[event];
        }
        if (handlers && handlers.length) {
          for (let k = handlers.length - 1; k >= 0; k -= 1) {
            const handler = handlers[k];
            if (listener && handler.listener === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (!listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            }
          }
        }
      }
    }
    return this;
  }
  function trigger(...args) {
    const events = args[0].split(' ');
    const eventData = args[1];
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let evt;
        try {
          evt = new win.CustomEvent(event, {
            detail: eventData,
            bubbles: true,
            cancelable: true,
          });
        } catch (e) {
          evt = doc.createEvent('Event');
          evt.initEvent(event, true, true);
          evt.detail = eventData;
        }
        // eslint-disable-next-line
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
    return this;
  }
  function transitionEnd$1(callback) {
    const events = ['webkitTransitionEnd', 'transitionend'];
    const dom = this;
    let i;
    function fireCallBack(e) {
      /* jshint validthis:true */
      if (e.target !== this) return;
      callback.call(this, e);
      for (i = 0; i < events.length; i += 1) {
        dom.off(events[i], fireCallBack);
      }
    }
    if (callback) {
      for (i = 0; i < events.length; i += 1) {
        dom.on(events[i], fireCallBack);
      }
    }
    return this;
  }
  function outerWidth(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        // eslint-disable-next-line
        const styles = this.styles();
        return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
      }
      return this[0].offsetWidth;
    }
    return null;
  }
  function outerHeight(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        // eslint-disable-next-line
        const styles = this.styles();
        return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
      }
      return this[0].offsetHeight;
    }
    return null;
  }
  function offset() {
    if (this.length > 0) {
      const el = this[0];
      const box = el.getBoundingClientRect();
      const body = doc.body;
      const clientTop = el.clientTop || body.clientTop || 0;
      const clientLeft = el.clientLeft || body.clientLeft || 0;
      const scrollTop = el === win ? win.scrollY : el.scrollTop;
      const scrollLeft = el === win ? win.scrollX : el.scrollLeft;
      return {
        top: (box.top + scrollTop) - clientTop,
        left: (box.left + scrollLeft) - clientLeft,
      };
    }

    return null;
  }
  function styles() {
    if (this[0]) return win.getComputedStyle(this[0], null);
    return {};
  }
  function css(props, value) {
    let i;
    if (arguments.length === 1) {
      if (typeof props === 'string') {
        if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(props);
      } else {
        for (i = 0; i < this.length; i += 1) {
          // eslint-disable-next-line
          for (let prop in props) {
            this[i].style[prop] = props[prop];
          }
        }
        return this;
      }
    }
    if (arguments.length === 2 && typeof props === 'string') {
      for (i = 0; i < this.length; i += 1) {
        this[i].style[props] = value;
      }
      return this;
    }
    return this;
  }
  // Iterate over the collection passing elements to `callback`
  function each(callback) {
    // Don't bother continuing without a callback
    if (!callback) return this;
    // Iterate over the current collection
    for (let i = 0; i < this.length; i += 1) {
      // If the callback returns false
      if (callback.call(this[i], i, this[i]) === false) {
        // End the loop early
        return this;
      }
    }
    // Return `this` to allow chained DOM operations
    return this;
  }
  function filter(callback) {
    const matchedItems = [];
    const dom = this;
    for (let i = 0; i < dom.length; i += 1) {
      if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
    }
    return new Dom7(matchedItems);
  }
  // eslint-disable-next-line
  function html(html) {
    if (typeof html === 'undefined') {
      return this[0] ? this[0].innerHTML : undefined;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].innerHTML = html;
    }
    return this;
  }
  // eslint-disable-next-line
  function text(text) {
    if (typeof text === 'undefined') {
      if (this[0]) {
        return this[0].textContent.trim();
      }
      return null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].textContent = text;
    }
    return this;
  }
  function is(selector) {
    const el = this[0];
    let compareWith;
    let i;
    if (!el || typeof selector === 'undefined') return false;
    if (typeof selector === 'string') {
      if (el.matches) return el.matches(selector);
      else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
      else if (el.msMatchesSelector) return el.msMatchesSelector(selector);

      compareWith = $(selector);
      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }
      return false;
    } else if (selector === doc) return el === doc;
    else if (selector === win) return el === win;

    if (selector.nodeType || selector instanceof Dom7) {
      compareWith = selector.nodeType ? [selector] : selector;
      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }
      return false;
    }
    return false;
  }
  function index() {
    let child = this[0];
    let i;
    if (child) {
      i = 0;
      // eslint-disable-next-line
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }
      return i;
    }
    return undefined;
  }
  // eslint-disable-next-line
  function eq(index) {
    if (typeof index === 'undefined') return this;
    const length = this.length;
    let returnIndex;
    if (index > length - 1) {
      return new Dom7([]);
    }
    if (index < 0) {
      returnIndex = length + index;
      if (returnIndex < 0) return new Dom7([]);
      return new Dom7([this[returnIndex]]);
    }
    return new Dom7([this[index]]);
  }
  function append(...args) {
    let newChild;

    for (let k = 0; k < args.length; k += 1) {
      newChild = args[k];
      for (let i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = doc.createElement('div');
          tempDiv.innerHTML = newChild;
          while (tempDiv.firstChild) {
            this[i].appendChild(tempDiv.firstChild);
          }
        } else if (newChild instanceof Dom7) {
          for (let j = 0; j < newChild.length; j += 1) {
            this[i].appendChild(newChild[j]);
          }
        } else {
          this[i].appendChild(newChild);
        }
      }
    }

    return this;
  }
  function prepend(newChild) {
    let i;
    let j;
    for (i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = doc.createElement('div');
        tempDiv.innerHTML = newChild;
        for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
          this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        }
      } else if (newChild instanceof Dom7) {
        for (j = 0; j < newChild.length; j += 1) {
          this[i].insertBefore(newChild[j], this[i].childNodes[0]);
        }
      } else {
        this[i].insertBefore(newChild, this[i].childNodes[0]);
      }
    }
    return this;
  }
  function next(selector) {
    if (this.length > 0) {
      if (selector) {
        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
          return new Dom7([this[0].nextElementSibling]);
        }
        return new Dom7([]);
      }

      if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
      return new Dom7([]);
    }
    return new Dom7([]);
  }
  function nextAll(selector) {
    const nextEls = [];
    let el = this[0];
    if (!el) return new Dom7([]);
    while (el.nextElementSibling) {
      const next = el.nextElementSibling; // eslint-disable-line
      if (selector) {
        if ($(next).is(selector)) nextEls.push(next);
      } else nextEls.push(next);
      el = next;
    }
    return new Dom7(nextEls);
  }
  function prev(selector) {
    if (this.length > 0) {
      const el = this[0];
      if (selector) {
        if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
          return new Dom7([el.previousElementSibling]);
        }
        return new Dom7([]);
      }

      if (el.previousElementSibling) return new Dom7([el.previousElementSibling]);
      return new Dom7([]);
    }
    return new Dom7([]);
  }
  function prevAll(selector) {
    const prevEls = [];
    let el = this[0];
    if (!el) return new Dom7([]);
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling; // eslint-disable-line
      if (selector) {
        if ($(prev).is(selector)) prevEls.push(prev);
      } else prevEls.push(prev);
      el = prev;
    }
    return new Dom7(prevEls);
  }
  function parent(selector) {
    const parents = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode !== null) {
        if (selector) {
          if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else {
          parents.push(this[i].parentNode);
        }
      }
    }
    return $(unique(parents));
  }
  function parents(selector) {
    const parents = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      let parent = this[i].parentNode; // eslint-disable-line
      while (parent) {
        if (selector) {
          if ($(parent).is(selector)) parents.push(parent);
        } else {
          parents.push(parent);
        }
        parent = parent.parentNode;
      }
    }
    return $(unique(parents));
  }
  function closest(selector) {
    let closest = this; // eslint-disable-line
    if (typeof selector === 'undefined') {
      return new Dom7([]);
    }
    if (!closest.is(selector)) {
      closest = closest.parents(selector).eq(0);
    }
    return closest;
  }
  function find(selector) {
    const foundElements = [];
    for (let i = 0; i < this.length; i += 1) {
      const found = this[i].querySelectorAll(selector);
      for (let j = 0; j < found.length; j += 1) {
        foundElements.push(found[j]);
      }
    }
    return new Dom7(foundElements);
  }
  function children(selector) {
    const children = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      const childNodes = this[i].childNodes;

      for (let j = 0; j < childNodes.length; j += 1) {
        if (!selector) {
          if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
        } else if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
          children.push(childNodes[j]);
        }
      }
    }
    return new Dom7(unique(children));
  }
  function remove() {
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
    }
    return this;
  }
  function add(...args) {
    const dom = this;
    let i;
    let j;
    for (i = 0; i < args.length; i += 1) {
      const toAdd = $(args[i]);
      for (j = 0; j < toAdd.length; j += 1) {
        dom[dom.length] = toAdd[j];
        dom.length += 1;
      }
    }
    return dom;
  }

  /**
   * Swiper 5.3.1
   * Most modern mobile touch slider and framework with hardware accelerated transitions
   * http://swiperjs.com
   *
   * Copyright 2014-2020 Vladimir Kharlampidi
   *
   * Released under the MIT License
   *
   * Released on: February 8, 2020
   */

  const Methods = {
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    attr,
    removeAttr,
    data,
    transform,
    transition: transition,
    on: on$1,
    off: off$1,
    trigger,
    transitionEnd: transitionEnd$1,
    outerWidth,
    outerHeight,
    offset,
    css,
    each,
    html,
    text,
    is,
    index,
    eq,
    append,
    prepend,
    next,
    nextAll,
    prev,
    prevAll,
    parent,
    parents,
    closest,
    find,
    children,
    filter,
    remove,
    add,
    styles,
  };

  Object.keys(Methods).forEach((methodName) => {
    $.fn[methodName] = $.fn[methodName] || Methods[methodName];
  });

  const Utils = {
    deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach((key) => {
        try {
          object[key] = null;
        } catch (e) {
          // no getter for object
        }
        try {
          delete object[key];
        } catch (e) {
          // something got wrong
        }
      });
    },
    nextTick(callback, delay = 0) {
      return setTimeout(callback, delay);
    },
    now() {
      return Date.now();
    },
    getTranslate(el, axis = 'x') {
      let matrix;
      let curTransform;
      let transformMatrix;

      const curStyle = win.getComputedStyle(el, null);

      if (win.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map((a) => a.replace(',', '.')).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) curTransform = transformMatrix.m41;
        // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
      }
      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) curTransform = transformMatrix.m42;
        // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
      }
      return curTransform || 0;
    },
    parseUrlQuery(url) {
      const query = {};
      let urlToParse = url || win.location.href;
      let i;
      let params;
      let param;
      let length;
      if (typeof urlToParse === 'string' && urlToParse.length) {
        urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
        params = urlToParse.split('&').filter((paramsPart) => paramsPart !== '');
        length = params.length;

        for (i = 0; i < length; i += 1) {
          param = params[i].replace(/#\S+/g, '').split('=');
          query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
        }
      }
      return query;
    },
    isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend(...args) {
      const to = Object(args[0]);
      for (let i = 1; i < args.length; i += 1) {
        const nextSource = args[i];
        if (nextSource !== undefined && nextSource !== null) {
          const keysArray = Object.keys(Object(nextSource));
          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    },
  };

  const Support = (function Support() {
    return {
      touch: (win.Modernizr && win.Modernizr.touch === true) || (function checkTouch() {
        return !!((win.navigator.maxTouchPoints > 0) || ('ontouchstart' in win) || (win.DocumentTouch && doc instanceof win.DocumentTouch));
      }()),

      pointerEvents: !!win.PointerEvent && ('maxTouchPoints' in win.navigator) && win.navigator.maxTouchPoints > 0,

      observer: (function checkObserver() {
        return ('MutationObserver' in win || 'WebkitMutationObserver' in win);
      }()),

      passiveListener: (function checkPassiveListener() {
        let supportsPassive = false;
        try {
          const opts = Object.defineProperty({}, 'passive', {
            // eslint-disable-next-line
            get() {
              supportsPassive = true;
            },
          });
          win.addEventListener('testPassiveListener', null, opts);
        } catch (e) {
          // No support
        }
        return supportsPassive;
      }()),

      gestures: (function checkGestures() {
        return 'ongesturestart' in win;
      }()),
    };
  }());

  class SwiperClass {
    constructor(params = {}) {
      const self = this;
      self.params = params;

      // Events
      self.eventsListeners = {};

      if (self.params && self.params.on) {
        Object.keys(self.params.on).forEach((eventName) => {
          self.on(eventName, self.params.on[eventName]);
        });
      }
    }

    on(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';
      events.split(' ').forEach((event) => {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    }

    once(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      function onceHandler(...args) {
        self.off(events, onceHandler);
        if (onceHandler.f7proxy) {
          delete onceHandler.f7proxy;
        }
        handler.apply(self, args);
      }
      onceHandler.f7proxy = handler;
      return self.on(events, onceHandler, priority);
    }

    off(events, handler) {
      const self = this;
      if (!self.eventsListeners) return self;
      events.split(' ').forEach((event) => {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event] && self.eventsListeners[event].length) {
          self.eventsListeners[event].forEach((eventHandler, index) => {
            if (eventHandler === handler || (eventHandler.f7proxy && eventHandler.f7proxy === handler)) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
      return self;
    }

    emit(...args) {
      const self = this;
      if (!self.eventsListeners) return self;
      let events;
      let data;
      let context;
      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }
      const eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach((event) => {
        if (self.eventsListeners && self.eventsListeners[event]) {
          const handlers = [];
          self.eventsListeners[event].forEach((eventHandler) => {
            handlers.push(eventHandler);
          });
          handlers.forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }

    useModulesParams(instanceParams) {
      const instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach((moduleName) => {
        const module = instance.modules[moduleName];
        // Extend params
        if (module.params) {
          Utils.extend(instanceParams, module.params);
        }
      });
    }

    useModules(modulesParams = {}) {
      const instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach((moduleName) => {
        const module = instance.modules[moduleName];
        const moduleParams = modulesParams[moduleName] || {};
        // Extend instance methods and props
        if (module.instance) {
          Object.keys(module.instance).forEach((modulePropName) => {
            const moduleProp = module.instance[modulePropName];
            if (typeof moduleProp === 'function') {
              instance[modulePropName] = moduleProp.bind(instance);
            } else {
              instance[modulePropName] = moduleProp;
            }
          });
        }
        // Add event listeners
        if (module.on && instance.on) {
          Object.keys(module.on).forEach((moduleEventName) => {
            instance.on(moduleEventName, module.on[moduleEventName]);
          });
        }

        // Module create callback
        if (module.create) {
          module.create.bind(instance)(moduleParams);
        }
      });
    }

    static set components(components) {
      const Class = this;
      if (!Class.use) return;
      Class.use(components);
    }

    static installModule(module, ...params) {
      const Class = this;
      if (!Class.prototype.modules) Class.prototype.modules = {};
      const name = module.name || (`${Object.keys(Class.prototype.modules).length}_${Utils.now()}`);
      Class.prototype.modules[name] = module;
      // Prototype
      if (module.proto) {
        Object.keys(module.proto).forEach((key) => {
          Class.prototype[key] = module.proto[key];
        });
      }
      // Class
      if (module.static) {
        Object.keys(module.static).forEach((key) => {
          Class[key] = module.static[key];
        });
      }
      // Callback
      if (module.install) {
        module.install.apply(Class, params);
      }
      return Class;
    }

    static use(module, ...params) {
      const Class = this;
      if (Array.isArray(module)) {
        module.forEach((m) => Class.installModule(m));
        return Class;
      }
      return Class.installModule(module, ...params);
    }
  }

  function updateSize () {
    const swiper = this;
    let width;
    let height;
    const $el = swiper.$el;
    if (typeof swiper.params.width !== 'undefined') {
      width = swiper.params.width;
    } else {
      width = $el[0].clientWidth;
    }
    if (typeof swiper.params.height !== 'undefined') {
      height = swiper.params.height;
    } else {
      height = $el[0].clientHeight;
    }
    if ((width === 0 && swiper.isHorizontal()) || (height === 0 && swiper.isVertical())) {
      return;
    }

    // Subtract paddings
    width = width - parseInt($el.css('padding-left'), 10) - parseInt($el.css('padding-right'), 10);
    height = height - parseInt($el.css('padding-top'), 10) - parseInt($el.css('padding-bottom'), 10);

    Utils.extend(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height,
    });
  }

  function updateSlides () {
    const swiper = this;
    const params = swiper.params;

    const {
      $wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL,
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];

    function slidesForMargin(slideIndex) {
      if (!params.cssMode) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }

    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === 'function') {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }

    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === 'function') {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }

    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.snapGrid.length;

    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === 'undefined') {
      return;
    }
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = (parseFloat(spaceBetween.replace('%', '')) / 100) * swiperSize;
    }

    swiper.virtualSize = -spaceBetween;

    // reset margins
    if (rtl) slides.css({ marginLeft: '', marginTop: '' });
    else slides.css({ marginRight: '', marginBottom: '' });

    let slidesNumberEvenToRows;
    if (params.slidesPerColumn > 1) {
      if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
        slidesNumberEvenToRows = slidesLength;
      } else {
        slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
      }
      if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
        slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
      }
    }

    // Calc slides
    let slideSize;
    const slidesPerColumn = params.slidesPerColumn;
    const slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
    const numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      const slide = slides.eq(i);
      if (params.slidesPerColumn > 1) {
        // Set slides order
        let newSlideOrderIndex;
        let column;
        let row;
        if (params.slidesPerColumnFill === 'row' && params.slidesPerGroup > 1) {
          const groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
          const slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
          const columnsInGroup = groupIndex === 0
            ? params.slidesPerGroup
            : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
          row = Math.floor(slideIndexInGroup / columnsInGroup);
          column = (slideIndexInGroup - row * columnsInGroup) + groupIndex * params.slidesPerGroup;

          newSlideOrderIndex = column + ((row * slidesNumberEvenToRows) / slidesPerColumn);
          slide
            .css({
              '-webkit-box-ordinal-group': newSlideOrderIndex,
              '-moz-box-ordinal-group': newSlideOrderIndex,
              '-ms-flex-order': newSlideOrderIndex,
              '-webkit-order': newSlideOrderIndex,
              order: newSlideOrderIndex,
            });
        } else if (params.slidesPerColumnFill === 'column') {
          column = Math.floor(i / slidesPerColumn);
          row = i - (column * slidesPerColumn);
          if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn - 1)) {
            row += 1;
            if (row >= slidesPerColumn) {
              row = 0;
              column += 1;
            }
          }
        } else {
          row = Math.floor(i / slidesPerRow);
          column = i - (row * slidesPerRow);
        }
        slide.css(
          `margin-${swiper.isHorizontal() ? 'top' : 'left'}`,
          (row !== 0 && params.spaceBetween) && (`${params.spaceBetween}px`)
        );
      }
      if (slide.css('display') === 'none') continue; // eslint-disable-line

      if (params.slidesPerView === 'auto') {
        const slideStyles = win.getComputedStyle(slide[0], null);
        const currentTransform = slide[0].style.transform;
        const currentWebKitTransform = slide[0].style.webkitTransform;
        if (currentTransform) {
          slide[0].style.transform = 'none';
        }
        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = 'none';
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal()
            ? slide.outerWidth(true)
            : slide.outerHeight(true);
        } else {
          // eslint-disable-next-line
          if (swiper.isHorizontal()) {
            const width = parseFloat(slideStyles.getPropertyValue('width'));
            const paddingLeft = parseFloat(slideStyles.getPropertyValue('padding-left'));
            const paddingRight = parseFloat(slideStyles.getPropertyValue('padding-right'));
            const marginLeft = parseFloat(slideStyles.getPropertyValue('margin-left'));
            const marginRight = parseFloat(slideStyles.getPropertyValue('margin-right'));
            const boxSizing = slideStyles.getPropertyValue('box-sizing');
            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight;
            }
          } else {
            const height = parseFloat(slideStyles.getPropertyValue('height'));
            const paddingTop = parseFloat(slideStyles.getPropertyValue('padding-top'));
            const paddingBottom = parseFloat(slideStyles.getPropertyValue('padding-bottom'));
            const marginTop = parseFloat(slideStyles.getPropertyValue('margin-top'));
            const marginBottom = parseFloat(slideStyles.getPropertyValue('margin-bottom'));
            const boxSizing = slideStyles.getPropertyValue('box-sizing');
            if (boxSizing && boxSizing === 'border-box') {
              slideSize = height + marginTop + marginBottom;
            } else {
              slideSize = height + paddingTop + paddingBottom + marginTop + marginBottom;
            }
          }
        }
        if (currentTransform) {
          slide[0].style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - ((params.slidesPerView - 1) * spaceBetween)) / params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);

        if (slides[i]) {
          if (swiper.isHorizontal()) {
            slides[i].style.width = `${slideSize}px`;
          } else {
            slides[i].style.height = `${slideSize}px`;
          }
        }
      }
      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);


      if (params.centeredSlides) {
        slidePosition = slidePosition + (slideSize / 2) + (prevSlideSize / 2) + spaceBetween;
        if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
        if (i === 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index) % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }

      swiper.virtualSize += slideSize + spaceBetween;

      prevSlideSize = slideSize;

      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    let newSlidesGrid;

    if (
      rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
      $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
    }
    if (params.setWrapperSize) {
      if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
      else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
    }

    if (params.slidesPerColumn > 1) {
      swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
      swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
      if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
      else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
      if (params.centeredSlides) {
        newSlidesGrid = [];
        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
          if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
        }
        snapGrid = newSlidesGrid;
      }
    }

    // Remove last grid elements depending on width
    if (!params.centeredSlides) {
      newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (snapGrid.length === 0) snapGrid = [0];

    if (params.spaceBetween !== 0) {
      if (swiper.isHorizontal()) {
        if (rtl) slides.filter(slidesForMargin).css({ marginLeft: `${spaceBetween}px` });
        else slides.filter(slidesForMargin).css({ marginRight: `${spaceBetween}px` });
      } else slides.filter(slidesForMargin).css({ marginBottom: `${spaceBetween}px` });
    }

    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      const maxSnap = allSlidesSize - swiperSize;
      snapGrid = snapGrid.map((snap) => {
        if (snap < 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }

    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }

    Utils.extend(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid,
    });

    if (slidesLength !== previousSlidesLength) {
      swiper.emit('slidesLengthChange');
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit('snapGridLengthChange');
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit('slidesGridLengthChange');
    }

    if (params.watchSlidesProgress || params.watchSlidesVisibility) {
      swiper.updateSlidesOffset();
    }
  }

  function updateAutoHeight (speed) {
    const swiper = this;
    const activeSlides = [];
    let newHeight = 0;
    let i;
    if (typeof speed === 'number') {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    // Find slides currently in view
    if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length) break;
        activeSlides.push(swiper.slides.eq(index)[0]);
      }
    } else {
      activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
    }

    // Find new height from highest slide in view
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== 'undefined') {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }

    // Update Height
    if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
  }

  function updateSlidesOffset () {
    const swiper = this;
    const slides = swiper.slides;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
  }

  function updateSlidesProgress (translate = (this && this.translate) || 0) {
    const swiper = this;
    const params = swiper.params;

    const { slides, rtlTranslate: rtl } = swiper;

    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();

    let offsetCenter = -translate;
    if (rtl) offsetCenter = translate;

    // Visible Slides
    slides.removeClass(params.slideVisibleClass);

    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];

    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      const slideProgress = (
        (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0)) - slide.swiperSlideOffset
      ) / (slide.swiperSlideSize + params.spaceBetween);
      if (params.watchSlidesVisibility) {
        const slideBefore = -(offsetCenter - slide.swiperSlideOffset);
        const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        const isVisible = (slideBefore >= 0 && slideBefore < swiper.size - 1)
                  || (slideAfter > 1 && slideAfter <= swiper.size)
                  || (slideBefore <= 0 && slideAfter >= swiper.size);
        if (isVisible) {
          swiper.visibleSlides.push(slide);
          swiper.visibleSlidesIndexes.push(i);
          slides.eq(i).addClass(params.slideVisibleClass);
        }
      }
      slide.progress = rtl ? -slideProgress : slideProgress;
    }
    swiper.visibleSlides = $(swiper.visibleSlides);
  }

  function updateProgress (translate) {
    const swiper = this;
    if (typeof translate === 'undefined') {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      // eslint-disable-next-line
      translate = (swiper && swiper.translate && (swiper.translate * multiplier)) || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let { progress, isBeginning, isEnd } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / (translatesDiff);
      isBeginning = progress <= 0;
      isEnd = progress >= 1;
    }
    Utils.extend(swiper, {
      progress,
      isBeginning,
      isEnd,
    });

    if (params.watchSlidesProgress || params.watchSlidesVisibility) swiper.updateSlidesProgress(translate);

    if (isBeginning && !wasBeginning) {
      swiper.emit('reachBeginning toEdge');
    }
    if (isEnd && !wasEnd) {
      swiper.emit('reachEnd toEdge');
    }
    if ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) {
      swiper.emit('fromEdge');
    }

    swiper.emit('progress', progress);
  }

  function updateSlidesClasses () {
    const swiper = this;

    const {
      slides, params, $wrapperEl, activeIndex, realIndex,
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;

    slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);

    let activeSlide;
    if (isVirtual) {
      activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
    } else {
      activeSlide = slides.eq(activeIndex);
    }

    // Active classes
    activeSlide.addClass(params.slideActiveClass);

    if (params.loop) {
      // Duplicate to all looped slides
      if (activeSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`)
          .addClass(params.slideDuplicateActiveClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`)
          .addClass(params.slideDuplicateActiveClass);
      }
    }
    // Next Slide
    let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
    if (params.loop && nextSlide.length === 0) {
      nextSlide = slides.eq(0);
      nextSlide.addClass(params.slideNextClass);
    }
    // Prev Slide
    let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
    if (params.loop && prevSlide.length === 0) {
      prevSlide = slides.eq(-1);
      prevSlide.addClass(params.slidePrevClass);
    }
    if (params.loop) {
      // Duplicate to all looped slides
      if (nextSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicateNextClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicateNextClass);
      }
      if (prevSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicatePrevClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicatePrevClass);
      }
    }
  }

  function updateActiveIndex (newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex,
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    if (typeof activeIndex === 'undefined') {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (typeof slidesGrid[i + 1] !== 'undefined') {
          if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - ((slidesGrid[i + 1] - slidesGrid[i]) / 2)) {
            activeIndex = i;
          } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
            activeIndex = i + 1;
          }
        } else if (translate >= slidesGrid[i]) {
          activeIndex = i;
        }
      }
      // Normalize slideIndex
      if (params.normalizeSlideIndex) {
        if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
      }
    }
    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit('snapIndexChange');
      }
      return;
    }

    // Get real index
    const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);

    Utils.extend(swiper, {
      snapIndex,
      realIndex,
      previousIndex,
      activeIndex,
    });
    swiper.emit('activeIndexChange');
    swiper.emit('snapIndexChange');
    if (previousRealIndex !== realIndex) {
      swiper.emit('realIndexChange');
    }
    if (swiper.initialized || swiper.runCallbacksOnInit) {
      swiper.emit('slideChange');
    }
  }

  function updateClickedSlide (e) {
    const swiper = this;
    const params = swiper.params;
    const slide = $(e.target).closest(`.${params.slideClass}`)[0];
    let slideFound = false;
    if (slide) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide) slideFound = true;
      }
    }

    if (slide && slideFound) {
      swiper.clickedSlide = slide;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
      } else {
        swiper.clickedIndex = $(slide).index();
      }
    } else {
      swiper.clickedSlide = undefined;
      swiper.clickedIndex = undefined;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }

  var update$2 = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide,
  };

  function getTranslate (axis = this.isHorizontal() ? 'x' : 'y') {
    const swiper = this;

    const {
      params, rtlTranslate: rtl, translate, $wrapperEl,
    } = swiper;

    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }
    if (params.cssMode) {
      return translate;
    }

    let currentTranslate = Utils.getTranslate($wrapperEl[0], axis);
    if (rtl) currentTranslate = -currentTranslate;

    return currentTranslate || 0;
  }

  function setTranslate (translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress,
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;

    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }

    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }

    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;

    // Check if we need to update progress
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / (translatesDiff);
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }

    swiper.emit('setTranslate', swiper.translate, byController);
  }

  function minTranslate () {
    return (-this.snapGrid[0]);
  }

  function maxTranslate () {
    return (-this.snapGrid[this.snapGrid.length - 1]);
  }

  function translateTo (translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;

    const {
      params,
      wrapperEl,
    } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate) newTranslate = minTranslate;
    else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;
    else newTranslate = translate;

    // Update progress
    swiper.updateProgress(newTranslate);

    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
      } else {
        // eslint-disable-next-line
        if (wrapperEl.scrollTo) {
          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -newTranslate,
            behavior: 'smooth',
          });
        } else {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        }
      }
      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionEnd');
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionStart');
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            if (runCallbacks) {
              swiper.emit('transitionEnd');
            }
          };
        }
        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
      }
    }

    return true;
  }

  var translate = {
    getTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo,
  };

  function setTransition (duration, byController) {
    const swiper = this;

    if (!swiper.params.cssMode) {
      swiper.$wrapperEl.transition(duration);
    }

    swiper.emit('setTransition', duration, byController);
  }

  function transitionStart (runCallbacks = true, direction) {
    const swiper = this;
    const { activeIndex, params, previousIndex } = swiper;
    if (params.cssMode) return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';
      else if (activeIndex < previousIndex) dir = 'prev';
      else dir = 'reset';
    }

    swiper.emit('transitionStart');

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit('slideResetTransitionStart');
        return;
      }
      swiper.emit('slideChangeTransitionStart');
      if (dir === 'next') {
        swiper.emit('slideNextTransitionStart');
      } else {
        swiper.emit('slidePrevTransitionStart');
      }
    }
  }

  function transitionEnd$2 (runCallbacks = true, direction) {
    const swiper = this;
    const { activeIndex, previousIndex, params } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);

    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';
      else if (activeIndex < previousIndex) dir = 'prev';
      else dir = 'reset';
    }

    swiper.emit('transitionEnd');

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit('slideResetTransitionEnd');
        return;
      }
      swiper.emit('slideChangeTransitionEnd');
      if (dir === 'next') {
        swiper.emit('slideNextTransitionEnd');
      } else {
        swiper.emit('slidePrevTransitionEnd');
      }
    }
  }

  var transition$1 = {
    setTransition,
    transitionStart,
    transitionEnd: transitionEnd$2,
  };

  function slideTo (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;

    const {
      params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl,
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
      swiper.emit('beforeSlideChangeStart');
    }

    const translate = -snapGrid[snapIndex];

    // Update progress
    swiper.updateProgress(translate);

    // Normalize slideIndex
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (-Math.floor(translate * 100) >= Math.floor(slidesGrid[i] * 100)) {
          slideIndex = i;
        }
      }
    }
    // Directions locks
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) return false;
      }
    }

    let direction;
    if (slideIndex > activeIndex) direction = 'next';
    else if (slideIndex < activeIndex) direction = 'prev';
    else direction = 'reset';


    // Update Index
    if ((rtl && -translate === swiper.translate) || (!rtl && translate === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      // Update Height
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== 'slide') {
        swiper.setTranslate(translate);
      }
      if (direction !== 'reset') {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
      } else {
        // eslint-disable-next-line
        if (wrapperEl.scrollTo) {
          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -translate,
            behavior: 'smooth',
          });
        } else {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
        }
      }
      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onSlideToWrapperTransitionEnd) {
          swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
            swiper.onSlideToWrapperTransitionEnd = null;
            delete swiper.onSlideToWrapperTransitionEnd;
            swiper.transitionEnd(runCallbacks, direction);
          };
        }
        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
      }
    }

    return true;
  }

  function slideToLoop (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    let newIndex = index;
    if (swiper.params.loop) {
      newIndex += swiper.loopedSlides;
    }

    return swiper.slideTo(newIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideNext (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const { params, animating } = swiper;
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup;
    if (params.loop) {
      if (animating) return false;
      swiper.loopFix();
      // eslint-disable-next-line
      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slidePrev (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params, animating, snapGrid, slidesGrid, rtlTranslate,
    } = swiper;

    if (params.loop) {
      if (animating) return false;
      swiper.loopFix();
      // eslint-disable-next-line
      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }
    const translate = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    const normalizedSlidesGrid = slidesGrid.map((val) => normalize(val));

    const currentSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === 'undefined' && params.cssMode) {
      snapGrid.forEach((snap) => {
        if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
      });
    }
    let prevIndex;
    if (typeof prevSnap !== 'undefined') {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideReset (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideToClosest (speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);

    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

    if (translate >= swiper.snapGrid[snapIndex]) {
      // The current translate is on or after the current snap index, so the choice
      // is between the current index and the one after it.
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if ((translate - currentSnap) > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      // The current translate is before the current snap index, so the choice
      // is between the current index and the one before it.
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if ((translate - prevSnap) <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);

    return swiper.slideTo(index, speed, runCallbacks, internal);
  }

  function slideToClickedSlide () {
    const swiper = this;
    const { params, $wrapperEl } = swiper;

    const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);
      if (params.centeredSlides) {
        if (
          (slideToIndex < swiper.loopedSlides - (slidesPerView / 2))
          || (slideToIndex > (swiper.slides.length - swiper.loopedSlides) + (slidesPerView / 2))
        ) {
          swiper.loopFix();
          slideToIndex = $wrapperEl
            .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
            .eq(0)
            .index();

          Utils.nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = $wrapperEl
          .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
          .eq(0)
          .index();

        Utils.nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }

  var slide$1 = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide,
  };

  function loopCreate () {
    const swiper = this;
    const { params, $wrapperEl } = swiper;
    // Remove duplicated slides
    $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();

    let slides = $wrapperEl.children(`.${params.slideClass}`);

    if (params.loopFillGroupWithBlank) {
      const blankSlidesNum = params.slidesPerGroup - (slides.length % params.slidesPerGroup);
      if (blankSlidesNum !== params.slidesPerGroup) {
        for (let i = 0; i < blankSlidesNum; i += 1) {
          const blankNode = $(doc.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
          $wrapperEl.append(blankNode);
        }
        slides = $wrapperEl.children(`.${params.slideClass}`);
      }
    }

    if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;

    swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
    swiper.loopedSlides += params.loopAdditionalSlides;
    if (swiper.loopedSlides > slides.length) {
      swiper.loopedSlides = slides.length;
    }

    const prependSlides = [];
    const appendSlides = [];
    slides.each((index, el) => {
      const slide = $(el);
      if (index < swiper.loopedSlides) appendSlides.push(el);
      if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
      slide.attr('data-swiper-slide-index', index);
    });
    for (let i = 0; i < appendSlides.length; i += 1) {
      $wrapperEl.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
      $wrapperEl.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
  }

  function loopFix () {
    const swiper = this;

    swiper.emit('beforeLoopFix');

    const {
      activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl,
    } = swiper;
    let newIndex;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;

    const snapTranslate = -snapGrid[activeIndex];
    const diff = snapTranslate - swiper.getTranslate();

    // Fix For Negative Oversliding
    if (activeIndex < loopedSlides) {
      newIndex = (slides.length - (loopedSlides * 3)) + activeIndex;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);
      if (slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    } else if (activeIndex >= slides.length - loopedSlides) {
      // Fix For Positive Oversliding
      newIndex = -slides.length + activeIndex + loopedSlides;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);
      if (slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;

    swiper.emit('loopFix');
  }

  function loopDestroy () {
    const swiper = this;
    const { $wrapperEl, params, slides } = swiper;
    $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
    slides.removeAttr('data-swiper-slide-index');
  }

  var loop = {
    loopCreate,
    loopFix,
    loopDestroy,
  };

  function setGrabCursor (moving) {
    const swiper = this;
    if (Support.touch || !swiper.params.simulateTouch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
    const el = swiper.el;
    el.style.cursor = 'move';
    el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
    el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
    el.style.cursor = moving ? 'grabbing' : 'grab';
  }

  function unsetGrabCursor () {
    const swiper = this;
    if (Support.touch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
    swiper.el.style.cursor = '';
  }

  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor,
  };

  function appendSlide (slides) {
    const swiper = this;
    const { $wrapperEl, params } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }
    } else {
      $wrapperEl.append(slides);
    }
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
  }

  function prependSlide (slides) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndex + 1;
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.prepend(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
    } else {
      $wrapperEl.prepend(slides);
    }
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    swiper.slideTo(newActiveIndex, 0, false);
  }

  function addSlide (index, slides) {
    const swiper = this;
    const { $wrapperEl, params, activeIndex } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }
    const baseLength = swiper.slides.length;
    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }
    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }
    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;

    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides.eq(i);
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }

    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }
      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
    } else {
      $wrapperEl.append(slides);
    }

    for (let i = 0; i < slidesBuffer.length; i += 1) {
      $wrapperEl.append(slidesBuffer[i]);
    }

    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeSlide (slidesIndexes) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;

    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }
    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;

    if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      }
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeAllSlides () {
    const swiper = this;

    const slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }
    swiper.removeSlide(slidesIndexes);
  }

  var manipulation = {
    appendSlide,
    prependSlide,
    addSlide,
    removeSlide,
    removeAllSlides,
  };

  const Device = (function Device() {
    const platform = win.navigator.platform;
    const ua = win.navigator.userAgent;

    const device = {
      ios: false,
      android: false,
      androidChrome: false,
      desktop: false,
      iphone: false,
      ipod: false,
      ipad: false,
      edge: false,
      ie: false,
      firefox: false,
      macos: false,
      windows: false,
      cordova: !!(win.cordova || win.phonegap),
      phonegap: !!(win.cordova || win.phonegap),
      electron: false,
    };

    const screenWidth = win.screen.width;
    const screenHeight = win.screen.height;

    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
    const edge = ua.indexOf('Edge/') >= 0;
    const firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
    const windows = platform === 'Win32';
    const electron = ua.toLowerCase().indexOf('electron') >= 0;
    let macos = platform === 'MacIntel';

    // iPadOs 13 fix
    if (!ipad
      && macos
      && Support.touch
      && (
        (screenWidth === 1024 && screenHeight === 1366) // Pro 12.9
        || (screenWidth === 834 && screenHeight === 1194) // Pro 11
        || (screenWidth === 834 && screenHeight === 1112) // Pro 10.5
        || (screenWidth === 768 && screenHeight === 1024) // other
      )
    ) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      macos = false;
    }

    device.ie = ie;
    device.edge = edge;
    device.firefox = firefox;

    // Android
    if (android && !windows) {
      device.os = 'android';
      device.osVersion = android[2];
      device.android = true;
      device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
      device.os = 'ios';
      device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
      device.osVersion = iphone[2].replace(/_/g, '.');
      device.iphone = true;
    }
    if (ipad) {
      device.osVersion = ipad[2].replace(/_/g, '.');
      device.ipad = true;
    }
    if (ipod) {
      device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
      device.ipod = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
      if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
      }
    }

    // Webview
    device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || win.navigator.standalone))
      || (win.matchMedia && win.matchMedia('(display-mode: standalone)').matches);
    device.webview = device.webView;
    device.standalone = device.webView;

    // Desktop
    device.desktop = !(device.ios || device.android) || electron;
    if (device.desktop) {
      device.electron = electron;
      device.macos = macos;
      device.windows = windows;
      if (device.macos) {
        device.os = 'macos';
      }
      if (device.windows) {
        device.os = 'windows';
      }
    }

    // Pixel Ratio
    device.pixelRatio = win.devicePixelRatio || 1;

    // Export object
    return device;
  }());

  function onTouchStart (event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    const $targetEl = $(e.target);

    if (params.touchEventsTarget === 'wrapper') {
      if (!$targetEl.closest(swiper.wrapperEl).length) return;
    }
    data.isTouchEvent = e.type === 'touchstart';
    if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
    if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;
    if (params.noSwiping && $targetEl.closest(params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`)[0]) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!$targetEl.closest(params.swipeHandler)[0]) return;
    }

    touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;

    // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore

    const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
    if (
      edgeSwipeDetection
      && ((startX <= edgeSwipeThreshold)
      || (startX >= win.screen.width - edgeSwipeThreshold))
    ) {
      return;
    }

    Utils.extend(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: undefined,
      startMoving: undefined,
    });

    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = Utils.now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = undefined;
    if (params.threshold > 0) data.allowThresholdMove = false;
    if (e.type !== 'touchstart') {
      let preventDefault = true;
      if ($targetEl.is(data.formElements)) preventDefault = false;
      if (
        doc.activeElement
        && $(doc.activeElement).is(data.formElements)
        && doc.activeElement !== $targetEl[0]
      ) {
        doc.activeElement.blur();
      }

      const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
      if (params.touchStartForcePreventDefault || shouldPreventDefault) {
        e.preventDefault();
      }
    }
    swiper.emit('touchStart', e);
  }

  function onTouchMove (event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches, rtlTranslate: rtl } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }
      return;
    }
    if (data.isTouchEvent && e.type === 'mousemove') return;
    const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
    const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
    const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      // isMoved = true;
      swiper.allowClick = false;
      if (data.isTouched) {
        Utils.extend(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY,
        });
        data.touchStartTime = Utils.now();
      }
      return;
    }
    if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        // Vertical
        if (
          (pageY < touches.startY && swiper.translate <= swiper.maxTranslate())
          || (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
        ) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (
        (pageX < touches.startX && swiper.translate <= swiper.maxTranslate())
        || (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
      ) {
        return;
      }
    }
    if (data.isTouchEvent && doc.activeElement) {
      if (e.target === doc.activeElement && $(e.target).is(data.formElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit('touchMove', e);
    }
    if (e.targetTouches && e.targetTouches.length > 1) return;

    touches.currentX = pageX;
    touches.currentY = pageY;

    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt((diffX ** 2) + (diffY ** 2)) < swiper.params.threshold) return;

    if (typeof data.isScrolling === 'undefined') {
      let touchAngle;
      if ((swiper.isHorizontal() && touches.currentY === touches.startY) || (swiper.isVertical() && touches.currentX === touches.startX)) {
        data.isScrolling = false;
      } else {
        // eslint-disable-next-line
        if ((diffX * diffX) + (diffY * diffY) >= 25) {
          touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : (90 - touchAngle > params.touchAngle);
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    if (typeof data.startMoving === 'undefined') {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }

    if (!data.isMoved) {
      if (params.loop) {
        swiper.loopFix();
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
      }
      data.allowMomentumBounce = false;
      // Grab Cursor
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit('sliderFirstMove', e);
    }
    swiper.emit('sliderMove', e);
    data.isMoved = true;

    let diff = swiper.isHorizontal() ? diffX : diffY;
    touches.diff = diff;

    diff *= params.touchRatio;
    if (rtl) diff = -diff;

    swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
    data.currentTranslate = diff + data.startTranslate;

    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if ((diff > 0 && data.currentTranslate > swiper.minTranslate())) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = (swiper.minTranslate() - 1) + ((-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio);
    } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = (swiper.maxTranslate() + 1) - ((swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio);
    }

    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }

    // Directions locks
    if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }


    // Threshold
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }

    if (!params.followFinger || params.cssMode) return;

    // Update active index in free mode
    if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode) {
      // Velocity
      if (data.velocities.length === 0) {
        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
          time: data.touchStartTime,
        });
      }
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
        time: Utils.now(),
      });
    }
    // Update progress
    swiper.updateProgress(data.currentTranslate);
    // Update translate
    swiper.setTranslate(data.currentTranslate);
  }

  function onTouchEnd (event) {
    const swiper = this;
    const data = swiper.touchEventsData;

    const {
      params, touches, rtlTranslate: rtl, $wrapperEl, slidesGrid, snapGrid,
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    if (data.allowTouchCallbacks) {
      swiper.emit('touchEnd', e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    // Return Grab Cursor
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }

    // Time diff
    const touchEndTime = Utils.now();
    const timeDiff = touchEndTime - data.touchStartTime;

    // Tap, doubleTap, Click
    if (swiper.allowClick) {
      swiper.updateClickedSlide(e);
      swiper.emit('tap click', e);
      if (timeDiff < 300 && (touchEndTime - data.lastClickTime) < 300) {
        swiper.emit('doubleTap doubleClick', e);
      }
    }

    data.lastClickTime = Utils.now();
    Utils.nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });

    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;

    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }

    if (params.cssMode) {
      return;
    }

    if (params.freeMode) {
      if (currentPos < -swiper.minTranslate()) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (currentPos > -swiper.maxTranslate()) {
        if (swiper.slides.length < snapGrid.length) {
          swiper.slideTo(snapGrid.length - 1);
        } else {
          swiper.slideTo(swiper.slides.length - 1);
        }
        return;
      }

      if (params.freeModeMomentum) {
        if (data.velocities.length > 1) {
          const lastMoveEvent = data.velocities.pop();
          const velocityEvent = data.velocities.pop();

          const distance = lastMoveEvent.position - velocityEvent.position;
          const time = lastMoveEvent.time - velocityEvent.time;
          swiper.velocity = distance / time;
          swiper.velocity /= 2;
          if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
            swiper.velocity = 0;
          }
          // this implies that the user stopped moving a finger then released.
          // There would be no events with distance zero, so the last event is stale.
          if (time > 150 || (Utils.now() - lastMoveEvent.time) > 300) {
            swiper.velocity = 0;
          }
        } else {
          swiper.velocity = 0;
        }
        swiper.velocity *= params.freeModeMomentumVelocityRatio;

        data.velocities.length = 0;
        let momentumDuration = 1000 * params.freeModeMomentumRatio;
        const momentumDistance = swiper.velocity * momentumDuration;

        let newPosition = swiper.translate + momentumDistance;
        if (rtl) newPosition = -newPosition;

        let doBounce = false;
        let afterBouncePosition;
        const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
        let needsLoopFix;
        if (newPosition < swiper.maxTranslate()) {
          if (params.freeModeMomentumBounce) {
            if (newPosition + swiper.maxTranslate() < -bounceAmount) {
              newPosition = swiper.maxTranslate() - bounceAmount;
            }
            afterBouncePosition = swiper.maxTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.maxTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (newPosition > swiper.minTranslate()) {
          if (params.freeModeMomentumBounce) {
            if (newPosition - swiper.minTranslate() > bounceAmount) {
              newPosition = swiper.minTranslate() + bounceAmount;
            }
            afterBouncePosition = swiper.minTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.minTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (params.freeModeSticky) {
          let nextSlide;
          for (let j = 0; j < snapGrid.length; j += 1) {
            if (snapGrid[j] > -newPosition) {
              nextSlide = j;
              break;
            }
          }

          if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
            newPosition = snapGrid[nextSlide];
          } else {
            newPosition = snapGrid[nextSlide - 1];
          }
          newPosition = -newPosition;
        }
        if (needsLoopFix) {
          swiper.once('transitionEnd', () => {
            swiper.loopFix();
          });
        }
        // Fix duration
        if (swiper.velocity !== 0) {
          if (rtl) {
            momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
          } else {
            momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
          }
          if (params.freeModeSticky) {
            // If freeModeSticky is active and the user ends a swipe with a slow-velocity
            // event, then durations can be 20+ seconds to slide one (or zero!) slides.
            // It's easy to see this when simulating touch with mouse events. To fix this,
            // limit single-slide swipes to the default slide duration. This also has the
            // nice side effect of matching slide speed if the user stopped moving before
            // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
            // For faster swipes, also apply limits (albeit higher ones).
            const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
            const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
            if (moveDistance < currentSlideSize) {
              momentumDuration = params.speed;
            } else if (moveDistance < 2 * currentSlideSize) {
              momentumDuration = params.speed * 1.5;
            } else {
              momentumDuration = params.speed * 2.5;
            }
          }
        } else if (params.freeModeSticky) {
          swiper.slideToClosest();
          return;
        }

        if (params.freeModeMomentumBounce && doBounce) {
          swiper.updateProgress(afterBouncePosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
            swiper.emit('momentumBounce');

            swiper.setTransition(params.speed);
            swiper.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          });
        } else if (swiper.velocity) {
          swiper.updateProgress(newPosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          if (!swiper.animating) {
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }
        } else {
          swiper.updateProgress(newPosition);
        }

        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      } else if (params.freeModeSticky) {
        swiper.slideToClosest();
        return;
      }

      if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      return;
    }

    // Find current slide
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += (i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup)) {
      const increment = (i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup);
      if (typeof slidesGrid[i + increment] !== 'undefined') {
        if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment] - slidesGrid[i];
        }
      } else if (currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }

    // Find current slide size
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = (stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup);

    if (timeDiff > params.longSwipesMs) {
      // Long touches
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === 'next') {
        if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment);
        else swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === 'prev') {
        if (ratio > (1 - params.longSwipesRatio)) swiper.slideTo(stopIndex + increment);
        else swiper.slideTo(stopIndex);
      }
    } else {
      // Short swipes
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === 'next') {
          swiper.slideTo(stopIndex + increment);
        }
        if (swiper.swipeDirection === 'prev') {
          swiper.slideTo(stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }

  function onResize () {
    const swiper = this;

    const { params, el } = swiper;

    if (el && el.offsetWidth === 0) return;

    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Save locks
    const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;

    // Disable locks on resize
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;

    swiper.updateSize();
    swiper.updateSlides();

    swiper.updateSlidesClasses();
    if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }

    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      swiper.autoplay.run();
    }
    // Return locks after resize
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;

    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  function onClick (e) {
    const swiper = this;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }

  function onScroll () {
    const swiper = this;
    const { wrapperEl } = swiper;
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? -wrapperEl.scrollLeft : -wrapperEl.scrollTop;
    // eslint-disable-next-line
    if (swiper.translate === -0) swiper.translate = 0;

    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();

    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / (translatesDiff);
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(swiper.translate);
    }

    swiper.emit('setTranslate', swiper.translate, false);
  }

  let dummyEventAttached = false;
  function dummyEventListener() {}

  function attachEvents() {
    const swiper = this;
    const {
      params, touchEvents, el, wrapperEl,
    } = swiper;

    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }

    swiper.onClick = onClick.bind(swiper);

    const capture = !!params.nested;

    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        const passiveListener = touchEvents.start === 'touchstart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        el.addEventListener(touchEvents.move, swiper.onTouchMove, Support.passiveListener ? { passive: false, capture } : capture);
        el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
        if (touchEvents.cancel) {
          el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (!dummyEventAttached) {
          doc.addEventListener('touchstart', dummyEventListener);
          dummyEventAttached = true;
        }
      }
      if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
        el.addEventListener('mousedown', swiper.onTouchStart, false);
        doc.addEventListener('mousemove', swiper.onTouchMove, capture);
        doc.addEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      el.addEventListener('click', swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl.addEventListener('scroll', swiper.onScroll);
    }

    // Resize handler
    if (params.updateOnWindowResize) {
      swiper.on((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize, true);
    } else {
      swiper.on('observerUpdate', onResize, true);
    }
  }

  function detachEvents() {
    const swiper = this;

    const {
      params, touchEvents, el, wrapperEl,
    } = swiper;

    const capture = !!params.nested;

    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        const passiveListener = touchEvents.start === 'onTouchStart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
        el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
        if (touchEvents.cancel) {
          el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
      }
      if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
        el.removeEventListener('mousedown', swiper.onTouchStart, false);
        doc.removeEventListener('mousemove', swiper.onTouchMove, capture);
        doc.removeEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      el.removeEventListener('click', swiper.onClick, true);
    }

    if (params.cssMode) {
      wrapperEl.removeEventListener('scroll', swiper.onScroll);
    }

    // Resize handler
    swiper.off((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize);
  }

  var events = {
    attachEvents,
    detachEvents,
  };

  function setBreakpoint () {
    const swiper = this;
    const {
      activeIndex, initialized, loopedSlides = 0, params, $el,
    } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || (breakpoints && Object.keys(breakpoints).length === 0)) return;

    // Get breakpoint for window width and update parameters
    const breakpoint = swiper.getBreakpoint(breakpoints);

    if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      if (breakpointOnlyParams) {
        ['slidesPerView', 'spaceBetween', 'slidesPerGroup', 'slidesPerGroupSkip', 'slidesPerColumn'].forEach((param) => {
          const paramValue = breakpointOnlyParams[param];
          if (typeof paramValue === 'undefined') return;
          if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
            breakpointOnlyParams[param] = 'auto';
          } else if (param === 'slidesPerView') {
            breakpointOnlyParams[param] = parseFloat(paramValue);
          } else {
            breakpointOnlyParams[param] = parseInt(paramValue, 10);
          }
        });
      }

      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = params.slidesPerColumn > 1;
      const isMultiRow = breakpointParams.slidesPerColumn > 1;
      if (wasMultiRow && !isMultiRow) {
        $el.removeClass(`${params.containerModifierClass}multirow ${params.containerModifierClass}multirow-column`);
      } else if (!wasMultiRow && isMultiRow) {
        $el.addClass(`${params.containerModifierClass}multirow`);
        if (breakpointParams.slidesPerColumnFill === 'column') {
          $el.addClass(`${params.containerModifierClass}multirow-column`);
        }
      }

      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
        swiper.changeDirection();
      }

      Utils.extend(swiper.params, breakpointParams);

      Utils.extend(swiper, {
        allowTouchMove: swiper.params.allowTouchMove,
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
      });

      swiper.currentBreakpoint = breakpoint;

      if (needsReLoop && initialized) {
        swiper.loopDestroy();
        swiper.loopCreate();
        swiper.updateSlides();
        swiper.slideTo((activeIndex - loopedSlides) + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
    }
  }

  function getBreakpoint (breakpoints) {
    // Get breakpoint for window width
    if (!breakpoints) return undefined;
    let breakpoint = false;

    const points = Object.keys(breakpoints).map((point) => {
      if (typeof point === 'string' && point.startsWith('@')) {
        const minRatio = parseFloat(point.substr(1));
        const value = win.innerHeight * minRatio;
        return { value, point };
      }
      return { value: point, point };
    });

    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const { point, value } = points[i];
      if (value <= win.innerWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || 'max';
  }

  var breakpoints = { setBreakpoint, getBreakpoint };

  function addClasses () {
    const swiper = this;
    const {
      classNames, params, rtl, $el,
    } = swiper;
    const suffixes = [];

    suffixes.push('initialized');
    suffixes.push(params.direction);

    if (params.freeMode) {
      suffixes.push('free-mode');
    }
    if (params.autoHeight) {
      suffixes.push('autoheight');
    }
    if (rtl) {
      suffixes.push('rtl');
    }
    if (params.slidesPerColumn > 1) {
      suffixes.push('multirow');
      if (params.slidesPerColumnFill === 'column') {
        suffixes.push('multirow-column');
      }
    }
    if (Device.android) {
      suffixes.push('android');
    }
    if (Device.ios) {
      suffixes.push('ios');
    }

    if (params.cssMode) {
      suffixes.push('css-mode');
    }

    suffixes.forEach((suffix) => {
      classNames.push(params.containerModifierClass + suffix);
    });

    $el.addClass(classNames.join(' '));
  }

  function removeClasses () {
    const swiper = this;
    const { $el, classNames } = swiper;

    $el.removeClass(classNames.join(' '));
  }

  var classes = { addClasses, removeClasses };

  function loadImage (imageEl, src, srcset, sizes, checkForComplete, callback) {
    let image;
    function onReady() {
      if (callback) callback();
    }
    if (!imageEl.complete || !checkForComplete) {
      if (src) {
        image = new win.Image();
        image.onload = onReady;
        image.onerror = onReady;
        if (sizes) {
          image.sizes = sizes;
        }
        if (srcset) {
          image.srcset = srcset;
        }
        if (src) {
          image.src = src;
        }
      } else {
        onReady();
      }
    } else {
      // image already loaded...
      onReady();
    }
  }

  function preloadImages () {
    const swiper = this;
    swiper.imagesToLoad = swiper.$el.find('img');
    function onReady() {
      if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
      if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;
      if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
        if (swiper.params.updateOnImagesReady) swiper.update();
        swiper.emit('imagesReady');
      }
    }
    for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
      const imageEl = swiper.imagesToLoad[i];
      swiper.loadImage(
        imageEl,
        imageEl.currentSrc || imageEl.getAttribute('src'),
        imageEl.srcset || imageEl.getAttribute('srcset'),
        imageEl.sizes || imageEl.getAttribute('sizes'),
        true,
        onReady
      );
    }
  }

  var images = {
    loadImage,
    preloadImages,
  };

  function checkOverflow() {
    const swiper = this;
    const params = swiper.params;
    const wasLocked = swiper.isLocked;
    const lastSlidePosition = swiper.slides.length > 0 && (params.slidesOffsetBefore + (params.spaceBetween * (swiper.slides.length - 1)) + ((swiper.slides[0]).offsetWidth) * swiper.slides.length);

    if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) {
      swiper.isLocked = lastSlidePosition <= swiper.size;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }

    swiper.allowSlideNext = !swiper.isLocked;
    swiper.allowSlidePrev = !swiper.isLocked;

    // events
    if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
      swiper.navigation.update();
    }
  }

  var checkOverflow$1 = { checkOverflow };

  var defaults = {
    init: true,
    direction: 'horizontal',
    touchEventsTarget: 'container',
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    //
    preventInteractionOnTransition: false,

    // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,

    // Free mode
    freeMode: false,
    freeModeMomentum: true,
    freeModeMomentumRatio: 1,
    freeModeMomentumBounce: true,
    freeModeMomentumBounceRatio: 1,
    freeModeMomentumVelocityRatio: 1,
    freeModeSticky: false,
    freeModeMinimumVelocity: 0.02,

    // Autoheight
    autoHeight: false,

    // Set wrapper width
    setWrapperSize: false,

    // Virtual Translate
    virtualTranslate: false,

    // Effects
    effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

    // Breakpoints
    breakpoints: undefined,

    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerColumnFill: 'column',
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0, // in px
    slidesOffsetAfter: 0, // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,

    // Disable swiper and hide navigation when container not overflow
    watchOverflow: false,

    // Round length
    roundLengths: false,

    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 0,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,

    // Unique Navigation Elements
    uniqueNavElements: true,

    // Resistance
    resistance: true,
    resistanceRatio: 0.85,

    // Progress
    watchSlidesProgress: false,
    watchSlidesVisibility: false,

    // Cursor
    grabCursor: false,

    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,

    // Images
    preloadImages: true,
    updateOnImagesReady: true,

    // loop
    loop: false,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: false,

    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null, // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
    noSwipingSelector: null,

    // Passive Listeners
    passiveListeners: true,

    // NS
    containerModifierClass: 'swiper-container-', // NEW
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

    // Callbacks
    runCallbacksOnInit: true,
  };

  /* eslint no-param-reassign: "off" */

  const prototypes = {
    update: update$2,
    translate,
    transition: transition$1,
    slide: slide$1,
    loop,
    grabCursor,
    manipulation,
    events,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes,
    images,
  };

  const extendedDefaults = {};

  class Swiper extends SwiperClass {
    constructor(...args) {
      let el;
      let params;
      if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params) params = {};

      params = Utils.extend({}, params);
      if (el && !params.el) params.el = el;

      super(params);

      Object.keys(prototypes).forEach((prototypeGroup) => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
          if (!Swiper.prototype[protoMethod]) {
            Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
          }
        });
      });

      // Swiper Instance
      const swiper = this;
      if (typeof swiper.modules === 'undefined') {
        swiper.modules = {};
      }
      Object.keys(swiper.modules).forEach((moduleName) => {
        const module = swiper.modules[moduleName];
        if (module.params) {
          const moduleParamName = Object.keys(module.params)[0];
          const moduleParams = module.params[moduleParamName];
          if (typeof moduleParams !== 'object' || moduleParams === null) return;
          if (!(moduleParamName in params && 'enabled' in moduleParams)) return;
          if (params[moduleParamName] === true) {
            params[moduleParamName] = { enabled: true };
          }
          if (
            typeof params[moduleParamName] === 'object'
            && !('enabled' in params[moduleParamName])
          ) {
            params[moduleParamName].enabled = true;
          }
          if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
        }
      });

      // Extend defaults with modules params
      const swiperParams = Utils.extend({}, defaults);
      swiper.useModulesParams(swiperParams);

      // Extend defaults with passed params
      swiper.params = Utils.extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = Utils.extend({}, swiper.params);
      swiper.passedParams = Utils.extend({}, params);

      // Save Dom lib
      swiper.$ = $;

      // Find el
      const $el = $(swiper.params.el);
      el = $el[0];

      if (!el) {
        return undefined;
      }

      if ($el.length > 1) {
        const swipers = [];
        $el.each((index, containerEl) => {
          const newParams = Utils.extend({}, params, { el: containerEl });
          swipers.push(new Swiper(newParams));
        });
        return swipers;
      }

      el.swiper = swiper;
      $el.data('swiper', swiper);

      // Find Wrapper
      let $wrapperEl;
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        $wrapperEl = $(el.shadowRoot.querySelector(`.${swiper.params.wrapperClass}`));
        // Children needs to return slot items
        $wrapperEl.children = (options) => $el.children(options);
      } else {
        $wrapperEl = $el.children(`.${swiper.params.wrapperClass}`);
      }
      // Extend Swiper
      Utils.extend(swiper, {
        $el,
        el,
        $wrapperEl,
        wrapperEl: $wrapperEl[0],

        // Classes
        classNames: [],

        // Slides
        slides: $(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],

        // isDirection
        isHorizontal() {
          return swiper.params.direction === 'horizontal';
        },
        isVertical() {
          return swiper.params.direction === 'vertical';
        },
        // RTL
        rtl: (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        wrongRTL: $wrapperEl.css('display') === '-webkit-box',

        // Indexes
        activeIndex: 0,
        realIndex: 0,

        //
        isBeginning: true,
        isEnd: false,

        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,

        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,

        // Touch Events
        touchEvents: (function touchEvents() {
          const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
          let desktop = ['mousedown', 'mousemove', 'mouseup'];
          if (Support.pointerEvents) {
            desktop = ['pointerdown', 'pointermove', 'pointerup'];
          }
          swiper.touchEventsTouch = {
            start: touch[0],
            move: touch[1],
            end: touch[2],
            cancel: touch[3],
          };
          swiper.touchEventsDesktop = {
            start: desktop[0],
            move: desktop[1],
            end: desktop[2],
          };
          return Support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
        }()),
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          formElements: 'input, select, option, textarea, button, video, label',
          // Last click time
          lastClickTime: Utils.now(),
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          isTouchEvent: undefined,
          startMoving: undefined,
        },

        // Clicks
        allowClick: true,

        // Touches
        allowTouchMove: swiper.params.allowTouchMove,

        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0,
        },

        // Images
        imagesToLoad: [],
        imagesLoaded: 0,

      });

      // Install Modules
      swiper.useModules();

      // Init
      if (swiper.params.init) {
        swiper.init();
      }

      // Return app instance
      return swiper;
    }

    slidesPerViewDynamic() {
      const swiper = this;
      const {
        params, slides, slidesGrid, size: swiperSize, activeIndex,
      } = swiper;
      let spv = 1;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex].swiperSlideSize;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) {
            spv += 1;
          }
        }
      }
      return spv;
    }

    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const { snapGrid, params } = swiper;
      // Breakpoints
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      function setTranslate() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (swiper.params.freeMode) {
        setTranslate();
        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit('update');
    }

    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }
      if ((newDirection === currentDirection) || (newDirection !== 'horizontal' && newDirection !== 'vertical')) {
        return swiper;
      }

      swiper.$el
        .removeClass(`${swiper.params.containerModifierClass}${currentDirection}`)
        .addClass(`${swiper.params.containerModifierClass}${newDirection}`);

      swiper.params.direction = newDirection;

      swiper.slides.each((slideIndex, slideEl) => {
        if (newDirection === 'vertical') {
          slideEl.style.width = '';
        } else {
          slideEl.style.height = '';
        }
      });

      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();

      return swiper;
    }

    init() {
      const swiper = this;
      if (swiper.initialized) return;

      swiper.emit('beforeInit');

      // Set breakpoint
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }

      // Add Classes
      swiper.addClasses();

      // Create loop
      if (swiper.params.loop) {
        swiper.loopCreate();
      }

      // Update size
      swiper.updateSize();

      // Update slides
      swiper.updateSlides();

      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }

      // Set Grab Cursor
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }

      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      }

      // Slide To Initial Slide
      if (swiper.params.loop) {
        swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
      }

      // Attach events
      swiper.attachEvents();

      // Init Flag
      swiper.initialized = true;

      // Emit
      swiper.emit('init');
    }

    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params, $el, $wrapperEl, slides,
      } = swiper;

      if (typeof swiper.params === 'undefined' || swiper.destroyed) {
        return null;
      }

      swiper.emit('beforeDestroy');

      // Init Flag
      swiper.initialized = false;

      // Detach events
      swiper.detachEvents();

      // Destroy loop
      if (params.loop) {
        swiper.loopDestroy();
      }

      // Cleanup styles
      if (cleanStyles) {
        swiper.removeClasses();
        $el.removeAttr('style');
        $wrapperEl.removeAttr('style');
        if (slides && slides.length) {
          slides
            .removeClass([
              params.slideVisibleClass,
              params.slideActiveClass,
              params.slideNextClass,
              params.slidePrevClass,
            ].join(' '))
            .removeAttr('style')
            .removeAttr('data-swiper-slide-index');
        }
      }

      swiper.emit('destroy');

      // Detach emitter events
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });

      if (deleteInstance !== false) {
        swiper.$el[0].swiper = null;
        swiper.$el.data('swiper', null);
        Utils.deleteProps(swiper);
      }
      swiper.destroyed = true;

      return null;
    }

    static extendDefaults(newDefaults) {
      Utils.extend(extendedDefaults, newDefaults);
    }

    static get extendedDefaults() {
      return extendedDefaults;
    }

    static get defaults() {
      return defaults;
    }

    static get Class() {
      return SwiperClass;
    }

    static get $() {
      return $;
    }
  }

  var Device$1 = {
    name: 'device',
    proto: {
      device: Device,
    },
    static: {
      device: Device,
    },
  };

  var Support$1 = {
    name: 'support',
    proto: {
      support: Support,
    },
    static: {
      support: Support,
    },
  };

  const Browser = (function Browser() {
    function isSafari() {
      const ua = win.navigator.userAgent.toLowerCase();
      return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
    }
    return {
      isEdge: !!win.navigator.userAgent.match(/Edge/g),
      isSafari: isSafari(),
      isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(win.navigator.userAgent),
    };
  }());

  var Browser$1 = {
    name: 'browser',
    proto: {
      browser: Browser,
    },
    static: {
      browser: Browser,
    },
  };

  var Resize = {
    name: 'resize',
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        resize: {
          resizeHandler() {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            swiper.emit('beforeResize');
            swiper.emit('resize');
          },
          orientationChangeHandler() {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            swiper.emit('orientationchange');
          },
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        // Emit resize
        win.addEventListener('resize', swiper.resize.resizeHandler);

        // Emit orientationchange
        win.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
      },
      destroy() {
        const swiper = this;
        win.removeEventListener('resize', swiper.resize.resizeHandler);
        win.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
      },
    },
  };

  const Observer = {
    func: win.MutationObserver || win.WebkitMutationObserver,
    attach(target, options = {}) {
      const swiper = this;

      const ObserverFunc = Observer.func;
      const observer = new ObserverFunc((mutations) => {
        // The observerUpdate event should only be triggered
        // once despite the number of mutations.  Additional
        // triggers are redundant and are very costly
        if (mutations.length === 1) {
          swiper.emit('observerUpdate', mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate() {
          swiper.emit('observerUpdate', mutations[0]);
        };

        if (win.requestAnimationFrame) {
          win.requestAnimationFrame(observerUpdate);
        } else {
          win.setTimeout(observerUpdate, 0);
        }
      });

      observer.observe(target, {
        attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
        childList: typeof options.childList === 'undefined' ? true : options.childList,
        characterData: typeof options.characterData === 'undefined' ? true : options.characterData,
      });

      swiper.observer.observers.push(observer);
    },
    init() {
      const swiper = this;
      if (!Support.observer || !swiper.params.observer) return;
      if (swiper.params.observeParents) {
        const containerParents = swiper.$el.parents();
        for (let i = 0; i < containerParents.length; i += 1) {
          swiper.observer.attach(containerParents[i]);
        }
      }
      // Observe container
      swiper.observer.attach(swiper.$el[0], { childList: swiper.params.observeSlideChildren });

      // Observe wrapper
      swiper.observer.attach(swiper.$wrapperEl[0], { attributes: false });
    },
    destroy() {
      const swiper = this;
      swiper.observer.observers.forEach((observer) => {
        observer.disconnect();
      });
      swiper.observer.observers = [];
    },
  };

  var Observer$1 = {
    name: 'observer',
    params: {
      observer: false,
      observeParents: false,
      observeSlideChildren: false,
    },
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        observer: {
          init: Observer.init.bind(swiper),
          attach: Observer.attach.bind(swiper),
          destroy: Observer.destroy.bind(swiper),
          observers: [],
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        swiper.observer.init();
      },
      destroy() {
        const swiper = this;
        swiper.observer.destroy();
      },
    },
  };

  function isEventSupported() {
    const eventName = 'onwheel';
    let isSupported = eventName in doc;

    if (!isSupported) {
      const element = doc.createElement('div');
      element.setAttribute(eventName, 'return;');
      isSupported = typeof element[eventName] === 'function';
    }

    if (!isSupported
      && doc.implementation
      && doc.implementation.hasFeature
      // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      && doc.implementation.hasFeature('', '') !== true
    ) {
      // This is the only way to test support for the `wheel` event in IE9+.
      isSupported = doc.implementation.hasFeature('Events.wheel', '3.0');
    }

    return isSupported;
  }
  const Mousewheel = {
    lastScrollTime: Utils.now(),
    lastEventBeforeSnap: undefined,
    recentWheelEvents: [],
    event() {
      if (win.navigator.userAgent.indexOf('firefox') > -1) return 'DOMMouseScroll';
      return isEventSupported() ? 'wheel' : 'mousewheel';
    },
    normalize(e) {
      // Reasonable defaults
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;

      let sX = 0;
      let sY = 0; // spinX, spinY
      let pX = 0;
      let pY = 0; // pixelX, pixelY

      // Legacy
      if ('detail' in e) {
        sY = e.detail;
      }
      if ('wheelDelta' in e) {
        sY = -e.wheelDelta / 120;
      }
      if ('wheelDeltaY' in e) {
        sY = -e.wheelDeltaY / 120;
      }
      if ('wheelDeltaX' in e) {
        sX = -e.wheelDeltaX / 120;
      }

      // side scrolling on FF with DOMMouseScroll
      if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }

      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;

      if ('deltaY' in e) {
        pY = e.deltaY;
      }
      if ('deltaX' in e) {
        pX = e.deltaX;
      }

      if (e.shiftKey && !pX) { // if user scrolls with shift he wants horizontal scroll
        pX = pY;
        pY = 0;
      }

      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) { // delta in LINE units
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else { // delta in PAGE units
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }

      // Fall-back if spin cannot be determined
      if (pX && !sX) {
        sX = (pX < 1) ? -1 : 1;
      }
      if (pY && !sY) {
        sY = (pY < 1) ? -1 : 1;
      }

      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY,
      };
    },
    handleMouseEnter() {
      const swiper = this;
      swiper.mouseEntered = true;
    },
    handleMouseLeave() {
      const swiper = this;
      swiper.mouseEntered = false;
    },
    handle(event) {
      let e = event;
      const swiper = this;
      const params = swiper.params.mousewheel;

      if (swiper.params.cssMode) {
        e.preventDefault();
      }

      let target = swiper.$el;
      if (swiper.params.mousewheel.eventsTarged !== 'container') {
        target = $(swiper.params.mousewheel.eventsTarged);
      }
      if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;

      if (e.originalEvent) e = e.originalEvent; // jquery fix
      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;

      const data = Mousewheel.normalize(e);

      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = data.pixelX * rtlFactor;
          else return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = data.pixelY;
        else return true;
      } else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
      }

      if (delta === 0) return true;

      if (params.invert) delta = -delta;

      if (!swiper.params.freeMode) {
        // Register the new event in a variable which stores the relevant data
        const newEvent = {
          time: Utils.now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event,
        };

        // Keep the most recent events
        const recentWheelEvents = swiper.mousewheel.recentWheelEvents;
        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift(); // only store the last N events
        }
        const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
        recentWheelEvents.push(newEvent);

        // If there is at least one previous recorded event:
        //   If direction has changed or
        //   if the scroll is quicker than the previous one:
        //     Animate the slider.
        // Else (this is the first time the wheel is moved):
        //     Animate the slider.
        if (prevEvent) {
          if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta) {
            swiper.mousewheel.animateSlider(newEvent);
          }
        } else {
          swiper.mousewheel.animateSlider(newEvent);
        }

        // If it's time to release the scroll:
        //   Return now so you don't hit the preventDefault.
        if (swiper.mousewheel.releaseScroll(newEvent)) {
          return true;
        }
      } else {
        // Freemode or scrollContainer:

        // If we recently snapped after a momentum scroll, then ignore wheel events
        // to give time for the deceleration to finish. Stop ignoring after 500 msecs
        // or if it's a new scroll (larger delta or inverse sign as last event before
        // an end-of-momentum snap).
        const newEvent = { time: Utils.now(), delta: Math.abs(delta), direction: Math.sign(delta) };
        const { lastEventBeforeSnap } = swiper.mousewheel;
        const ignoreWheelEvents = lastEventBeforeSnap
          && newEvent.time < lastEventBeforeSnap.time + 500
          && newEvent.delta <= lastEventBeforeSnap.delta
          && newEvent.direction === lastEventBeforeSnap.direction;
        if (!ignoreWheelEvents) {
          swiper.mousewheel.lastEventBeforeSnap = undefined;

          if (swiper.params.loop) {
            swiper.loopFix();
          }
          let position = swiper.getTranslate() + (delta * params.sensitivity);
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;

          if (position >= swiper.minTranslate()) position = swiper.minTranslate();
          if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();

          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();

          if ((!wasBeginning && swiper.isBeginning) || (!wasEnd && swiper.isEnd)) {
            swiper.updateSlidesClasses();
          }

          if (swiper.params.freeModeSticky) {
            // When wheel scrolling starts with sticky (aka snap) enabled, then detect
            // the end of a momentum scroll by storing recent (N=15?) wheel events.
            // 1. do all N events have decreasing or same (absolute value) delta?
            // 2. did all N events arrive in the last M (M=500?) msecs?
            // 3. does the earliest event have an (absolute value) delta that's
            //    at least P (P=1?) larger than the most recent event's delta?
            // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
            // If 1-4 are "yes" then we're near the end of a momuntum scroll deceleration.
            // Snap immediately and ignore remaining wheel events in this scroll.
            // See comment above for "remaining wheel events in this scroll" determination.
            // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
            clearTimeout(swiper.mousewheel.timeout);
            swiper.mousewheel.timeout = undefined;
            const recentWheelEvents = swiper.mousewheel.recentWheelEvents;
            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift(); // only store the last N events
            }
            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);
            if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
              // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
              recentWheelEvents.splice(0);
            } else if (recentWheelEvents.length >= 15
                && newEvent.time - firstEvent.time < 500
                && firstEvent.delta - newEvent.delta >= 1
                && newEvent.delta <= 6
            ) {
              // We're at the end of the deceleration of a momentum scroll, so there's no need
              // to wait for more events. Snap ASAP on the next tick.
              // Also, because there's some remaining momentum we'll bias the snap in the
              // direction of the ongoing scroll because it's better UX for the scroll to snap
              // in the same direction as the scroll instead of reversing to snap.  Therefore,
              // if it's already scrolled more than 20% in the current direction, keep going.
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              swiper.mousewheel.lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.mousewheel.timeout = Utils.nextTick(() => {
                swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 0); // no delay; move on next tick
            }
            if (!swiper.mousewheel.timeout) {
              // if we get here, then we haven't detected the end of a momentum scroll, so
              // we'll consider a scroll "complete" when there haven't been any wheel events
              // for 500ms.
              swiper.mousewheel.timeout = Utils.nextTick(() => {
                const snapToThreshold = 0.5;
                swiper.mousewheel.lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 500);
            }
          }

          // Emit event
          if (!ignoreWheelEvents) swiper.emit('scroll', e);

          // Stop autoplay
          if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop();
          // Return page scroll on edge positions
          if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
        }
      }

      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
      return false;
    },
    animateSlider(newEvent) {
      const swiper = this;
      // If the movement is NOT big enough and
      // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
      //   Don't go any further (avoid insignificant scroll movement).
      if (newEvent.delta >= 6 && Utils.now() - swiper.mousewheel.lastScrollTime < 60) {
        // Return false as a default
        return true;
      }
      // If user is scrolling towards the end:
      //   If the slider hasn't hit the latest slide or
      //   if the slider is a loop and
      //   if the slider isn't moving right now:
      //     Go to next slide and
      //     emit a scroll event.
      // Else (the user is scrolling towards the beginning) and
      // if the slider hasn't hit the first slide or
      // if the slider is a loop and
      // if the slider isn't moving right now:
      //   Go to prev slide and
      //   emit a scroll event.
      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.slideNext();
          swiper.emit('scroll', newEvent.raw);
        }
      } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
        swiper.slidePrev();
        swiper.emit('scroll', newEvent.raw);
      }
      // If you got here is because an animation has been triggered so store the current time
      swiper.mousewheel.lastScrollTime = (new win.Date()).getTime();
      // Return false as a default
      return false;
    },
    releaseScroll(newEvent) {
      const swiper = this;
      const params = swiper.params.mousewheel;
      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }
      } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
      return false;
    },
    enable() {
      const swiper = this;
      const event = Mousewheel.event();
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener(event, swiper.mousewheel.handle);
        return true;
      }
      if (!event) return false;
      if (swiper.mousewheel.enabled) return false;
      let target = swiper.$el;
      if (swiper.params.mousewheel.eventsTarged !== 'container') {
        target = $(swiper.params.mousewheel.eventsTarged);
      }
      target.on('mouseenter', swiper.mousewheel.handleMouseEnter);
      target.on('mouseleave', swiper.mousewheel.handleMouseLeave);
      target.on(event, swiper.mousewheel.handle);
      swiper.mousewheel.enabled = true;
      return true;
    },
    disable() {
      const swiper = this;
      const event = Mousewheel.event();
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, swiper.mousewheel.handle);
        return true;
      }
      if (!event) return false;
      if (!swiper.mousewheel.enabled) return false;
      let target = swiper.$el;
      if (swiper.params.mousewheel.eventsTarged !== 'container') {
        target = $(swiper.params.mousewheel.eventsTarged);
      }
      target.off(event, swiper.mousewheel.handle);
      swiper.mousewheel.enabled = false;
      return true;
    },
  };

  // Swiper Class

  const components = [
    Device$1,
    Support$1,
    Browser$1,
    Resize,
    Observer$1,
    
  ];

  if (typeof Swiper.use === 'undefined') {
    Swiper.use = Swiper.Class.use;
    Swiper.installModule = Swiper.Class.installModule;
  }

  Swiper.use(components);

  const {
    createComponent: createComponent$18,
    bem: bem$17
  } =
  /*#__PURE__*/
  createNamespace('slides');
  var slides = /*#__PURE__*/
  createComponent$18({
    props: {
      options: {
        type: Object
      },
      pager: {
        type: Boolean,
        default: false
      },
      scrollbar: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        swiperReady: false
      };
    },

    async mounted() {
      const mut = this.mutationO = new MutationObserver(() => {
        if (this.swiperReady) {
          this.update();
        }
      });
      mut.observe(this.$el, {
        childList: true,
        subtree: true
      });
      this.initSwiper();
      this.paginationEl = this.$refs && this.$refs.paginationEl;
      this.scrollbarEl = this.$refs && this.$refs.scrollbarEl;
    },

    async destroyed() {
      if (this.mutationO) {
        this.mutationO.disconnect();
        this.mutationO = undefined;
      }

      const swiper = await this.getSwiper();
      swiper && swiper.destroy(true, true);
      this.swiperReady = false;
    },

    methods: {
      async optionsChanged() {
        if (this.swiperReady) {
          const swiper = await this.getSwiper();
          Object.assign(swiper.params, this.options);
          await this.update();
        }
      },

      /**
       * Update the underlying slider implementation. Call this if you've added or removed
       * child slides.
       */
      async update() {
        const [swiper] = await Promise.all([this.getSwiper()]);

        if (swiper) {
          swiper.update();
        }
      },

      /**
       * Force swiper to update its height (when autoHeight is enabled) for the duration
       * equal to 'speed' parameter.
       *
       * @param speed The transition duration (in ms).
       */
      async updateAutoHeight(speed) {
        const swiper = await this.getSwiper();
        swiper.updateAutoHeight(speed);
      },

      /**
       * Transition to the specified slide.
       *
       * @param index The index of the slide to transition to.
       * @param speed The transition duration (in ms).
       * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End]
       * transition events.
       */
      async slideTo(index, speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slideTo(index, speed, runCallbacks);
      },

      /**
       * Transition to the next slide.
       *
       * @param speed The transition duration (in ms).
       * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End]
       * transition events.
       */
      async slideNext(speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slideNext(speed, runCallbacks);
      },

      /**
       * Transition to the previous slide.
       *
       * @param speed The transition duration (in ms).
       * @param runCallbacks If true, the transition will produce the [Transition/SlideChange][Start/End]
       * transition events.
       */
      async slidePrev(speed, runCallbacks) {
        const swiper = await this.getSwiper();
        swiper.slidePrev(speed, runCallbacks);
      },

      /**
       * Get the index of the active slide.
       */
      async getActiveIndex() {
        const swiper = await this.getSwiper();
        return swiper.activeIndex;
      },

      /**
       * Get the index of the previous slide.
       */
      async getPreviousIndex() {
        const swiper = await this.getSwiper();
        return swiper.previousIndex;
      },

      /**
       * Get the total number of slides.
       */
      async length() {
        const swiper = await this.getSwiper();
        return swiper.slides.length;
      },

      /**
       * Get whether or not the current slide is the last slide.
       */
      async isEnd() {
        const swiper = await this.getSwiper();
        return swiper.isEnd;
      },

      /**
       * Get whether or not the current slide is the first slide.
       */
      async isBeginning() {
        const swiper = await this.getSwiper();
        return swiper.isBeginning;
      },

      /**
       * Start auto play.
       */
      async startAutoplay() {
        const swiper = await this.getSwiper();

        if (swiper.autoplay) {
          swiper.autoplay.start();
        }
      },

      /**
       * Stop auto play.
       */
      async stopAutoplay() {
        const swiper = await this.getSwiper();

        if (swiper.autoplay) {
          swiper.autoplay.stop();
        }
      },

      /**
       * Lock or unlock the ability to slide to the next slide.
       *
       * @param lock If `true`, disable swiping to the next slide.
       */
      async lockSwipeToNext(lock) {
        const swiper = await this.getSwiper();
        swiper.allowSlideNext = !lock;
      },

      /**
       * Lock or unlock the ability to slide to the previous slide.
       *
       * @param lock If `true`, disable swiping to the previous slide.
       */
      async lockSwipeToPrev(lock) {
        const swiper = await this.getSwiper();
        swiper.allowSlidePrev = !lock;
      },

      /**
       * Lock or unlock the ability to slide to the next or previous slide.
       *
       * @param lock If `true`, disable swiping to the next and previous slide.
       */
      async lockSwipes(lock) {
        const swiper = await this.getSwiper();
        swiper.allowSlideNext = !lock;
        swiper.allowSlidePrev = !lock;
        swiper.allowTouchMove = !lock;
      },

      /**
       * Get the Swiper instance.
       * Use this to access the full Swiper API.
       * See https://idangero.us/swiper/api/ for all API options.
       */
      async getSwiper() {
        return this.swiper;
      },

      async initSwiper() {
        const finalOptions = this.normalizeOptions(); // init swiper core

        const swiper = new Swiper(this.$el, finalOptions);
        this.swiperReady = true;
        this.swiper = swiper;
      },

      normalizeOptions() {
        // Base options, can be changed
        // TODO Add interface SwiperOptions
        const swiperOptions = {
          effect: undefined,
          direction: 'horizontal',
          initialSlide: 0,
          loop: false,
          parallax: false,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 300,
          slidesPerColumn: 1,
          slidesPerColumnFill: 'column',
          slidesPerGroup: 1,
          centeredSlides: false,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
          touchEventsTarget: 'container',
          autoplay: false,
          freeMode: false,
          freeModeMomentum: true,
          freeModeMomentumRatio: 1,
          freeModeMomentumBounce: true,
          freeModeMomentumBounceRatio: 1,
          freeModeMomentumVelocityRatio: 1,
          freeModeSticky: false,
          freeModeMinimumVelocity: 0.02,
          autoHeight: false,
          setWrapperSize: false,
          zoom: {
            maxRatio: 3,
            minRatio: 1,
            toggle: false
          },
          touchRatio: 1,
          touchAngle: 45,
          simulateTouch: true,
          touchStartPreventDefault: false,
          shortSwipes: true,
          longSwipes: true,
          longSwipesRatio: 0.5,
          longSwipesMs: 300,
          followFinger: true,
          threshold: 0,
          touchMoveStopPropagation: true,
          touchReleaseOnEdges: false,
          iOSEdgeSwipeDetection: false,
          iOSEdgeSwipeThreshold: 20,
          resistance: true,
          resistanceRatio: 0.85,
          watchSlidesProgress: false,
          watchSlidesVisibility: false,
          preventClicks: true,
          preventClicksPropagation: true,
          slideToClickedSlide: false,
          loopAdditionalSlides: 0,
          noSwiping: true,
          runCallbacksOnInit: true,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          },
          flipEffect: {
            slideShadows: true,
            limitRotation: true
          },
          cubeEffect: {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
          },
          fadeEffect: {
            crossFade: false
          },
          a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide'
          }
        };

        if (this.pager) {
          swiperOptions.pagination = {
            el: this.paginationEl,
            type: 'bullets',
            clickable: false,
            hideOnClick: false
          };
        }

        if (this.scrollbar) {
          swiperOptions.scrollbar = {
            el: this.scrollbarEl,
            hide: true
          };
        }

        const emit = (eventName, data) => {
          this.$emit(eventName, data);
        }; // Keep the event options separate, we dont want users
        // overwriting these


        const eventOptions = {
          on: {
            init: () => {
              setTimeout(() => {
                this.$emit('slidesDidLoad');
              }, 20);
            },

            slideChangeTransitionStart() {
              const {
                activeIndex
              } = this;
              emit('slideChangeTransitionStart', activeIndex);
            },

            slideChangeTransitionEnd() {
              const {
                activeIndex
              } = this;
              emit('slideChangeTransitionEnd', activeIndex);
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
            doubleTap: this.$emit('slideDoubleTap')
          }
        };
        const customEvents = !!this.options && !!this.options.on ? this.options.on : {}; // merge "on" event listeners, while giving our event listeners priority

        const mergedEventOptions = {
          on: { ...customEvents,
            ...eventOptions.on
          }
        }; // Merge the base, user options, and events together then pas to swiper

        return { ...swiperOptions,
          ...this.options,
          ...mergedEventOptions
        };
      }

    },
    watch: {
      options() {
        this.optionsChanged();
      }

    },

    render() {
      const h = arguments[0];
      const {
        mode
      } = this;
      return h("div", {
        "class": [bem$17(), {
          // Used internally for styling
          [`slides-${mode}`]: true,
          'swiper-container': true
        }]
      }, [h("div", {
        "class": "swiper-wrapper"
      }, [this.slots()]), this.pager && h("div", {
        "class": "swiper-pagination",
        "ref": "paginationEl"
      }), this.scrollbar && h("div", {
        "class": "swiper-scrollbar",
        "ref": "scrollbarEl"
      })]);
    }

  });

  const {
    createComponent: createComponent$19,
    bem: bem$18
  } =
  /*#__PURE__*/
  createNamespace('stepper');
  var stepper = /*#__PURE__*/
  createComponent$19({
    components: {
      Icon
    },
    props: {
      min: {
        type: Number,
        default: -Infinity
      },
      max: {
        type: Number,
        default: Infinity
      },
      step: {
        type: Number,
        default: 1
      },
      value: {
        type: Number
      },
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      precision: {
        type: Number,

        validator(value) {
          return value >= 0;
        }

      }
    },

    data() {
      return {
        nativeValue: ''
      };
    },

    computed: {
      inputValue() {
        const {
          min
        } = this;
        let {
          value
        } = this;

        if (value === null || value === undefined || Number.isNaN(value)) {
          value = min !== -Infinity ? min : 1;
        }

        return value;
      }

    },

    mounted() {
      this.$nextTick(this.setInputValue);
    },

    methods: {
      onChange(type) {
        const {
          step,
          max,
          min
        } = this;
        let {
          value
        } = this;

        if (type === 'add') {
          value += step;
        } else if (type === 'reduce') {
          value -= step;
        }

        value = Math.max(value, min);
        value = Math.min(value, max);
        value = value === -Infinity || value === Infinity ? 1 : value;
        this.$emit('input', value);
        this.$emit('change', value);
      },

      setInputValue() {
        const {
          input
        } = this.$refs;

        if (input.value === String(this.inputValue) || !input) {
          return;
        }

        input.value = String(this.inputValue);
      },

      onBlur(event) {
        this.$emit('blur', event);
      },

      onFocus(event) {
        this.$emit('focus', event);
      },

      onInput(event) {
        let {
          value
        } = event.target;
        value = Number.parseFloat(value);
        const {
          max,
          min
        } = this;
        value = Math.max(value, min);
        value = Math.min(value, max);
        value = value === -Infinity || value === Infinity ? 1 : value;
        this.$emit('input', value);
        this.$emit('change', value);
        this.$nextTick(this.setInputValue);
      }

    },
    watch: {
      value: {
        handler() {
          this.onChange('init');
        },

        immediate: true
      },

      inputValue() {
        this.setInputValue();
      }

    },

    render() {
      const h = arguments[0];
      const {
        placeholder,
        disabled,
        max,
        min,
        step,
        number,
        value
      } = this;
      return h("div", {
        "class": bem$18()
      }, [h("span", {
        "class": bem$18('button', {
          disabled: value <= min
        }),
        "on": {
          "click": () => this.onChange('reduce')
        }
      }, [h("icon", {
        "attrs": {
          "name": 'remove',
          "width": '24',
          "height": '24'
        }
      })]), h("input", helper([{
        "ref": 'input',
        "attrs": {
          "placeholder": placeholder,
          "disabled": disabled,
          "max": max,
          "min": min,
          "step": step,
          "type": number
        }
      }, {
        "on": {
          '!blur': this.onBlur,
          '!input': this.onInput,
          '!focus': this.onFocus
        }
      }])), h("span", {
        "class": bem$18('button', {
          disabled: value >= max
        }),
        "on": {
          "click": () => this.onChange('add')
        }
      }, [h("icon", {
        "attrs": {
          "name": 'add',
          "width": '24',
          "height": '24'
        }
      })])]);
    }

  });

  const NAMESPACE$f = 'SwitchGroup';
  const {
    createComponent: createComponent$1a,
    bem: bem$19
  } =
  /*#__PURE__*/
  createNamespace('switch-group');
  var switchGroup = /*#__PURE__*/
  createComponent$1a({
    mixins: [
    /*#__PURE__*/
    useGroup(NAMESPACE$f)],

    render() {
      const h = arguments[0];
      return h("div", {
        "class": bem$19()
      }, [this.slots()]);
    }

  });

  const {
    createComponent: createComponent$1b,
    bem: bem$1a
  } =
  /*#__PURE__*/
  createNamespace('switch-indicator');
  var switchIndicator = /*#__PURE__*/
  createComponent$1b({
    functional: true,
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    render(h, {
      props,
      data,
      slots
    }) {
      const Tag = 'div';
      return h(Tag, helper([{
        "class": bem$1a({
          'is-checked': props.checked,
          'is-disabled': props.disabled
        })
      }, data]), [h("div", {
        "class": bem$1a('thumb')
      }, [slots()])]);
    }

  });

  const NAMESPACE$g = 'SwitchGroup';
  const {
    createComponent: createComponent$1c,
    bem: bem$1b
  } =
  /*#__PURE__*/
  createNamespace('switch');
  let gesture;
  var _switch = /*#__PURE__*/
  createComponent$1c({
    mixins: [
    /*#__PURE__*/
    useCheckItem(NAMESPACE$g),
    /*#__PURE__*/
    useColor()],

    data() {
      return {
        gesture,
        lastDrag: 0,
        activated: false
      };
    },

    methods: {
      onClick() {
        if (this.lastDrag + 300 < Date.now()) {
          this.checked = !this.checked;
        }
      },

      onStart() {
        this.activated = true; // touch-action does not work in iOS
        // this.setFocus();
      },

      onMove(detail) {
        if (this.shouldToggle(document, this.checked, detail.deltaX, -10)) {
          this.checked = !this.checked; // hapticSelection();
        }
      },

      onEnd(ev) {
        this.activated = false;
        this.lastDrag = Date.now();
        ev.event.preventDefault();
        ev.event.stopImmediatePropagation();
      },

      shouldToggle(doc, checked, deltaX, margin) {
        const isRTL = doc.dir === 'rtl';

        if (checked) {
          return !isRTL && margin > deltaX || isRTL && -margin < deltaX;
        }

        return !isRTL && -margin < deltaX || isRTL && margin > deltaX;
      },

      emitStyle() {
        if (!this.Item) return;
        this.Item.itemStyle('line-switch', {
          'interactive-disabled': this.disabled
        });
      },

      disabledChanged() {
        if (this.gesture) {
          this.gesture.enable(!this.disabled);
        }
      }

    },

    async mounted() {
      this.gesture = createGesture({
        el: this.$el,
        gestureName: 'toggle',
        gesturePriority: 100,
        threshold: 5,
        passive: false,
        onStart: () => this.onStart(),
        onMove: ev => this.onMove(ev),
        onEnd: ev => this.onEnd(ev)
      });
      this.disabledChanged();
      this.emitStyle();
    },

    destroyed() {
      if (this.gesture) {
        this.gesture.destroy();
        this.gesture = undefined;
      }
    },

    watch: {
      disabled() {
        this.emitStyle();
        this.disabledChanged();
      },

      checked() {
        this.emitStyle();
      }

    },

    render() {
      const h = arguments[0];
      const {
        checked,
        disabled,
        activated,
        color
      } = this;
      return h("div", helper([{
        "attrs": {
          "role": "checkbox"
        },
        "class": [bem$1b({
          disabled,
          checked,
          activated
        }), { ...createColorClasses(color)
        }],
        "on": {
          "click": this.onClick
        }
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$1b('icon')
      }, [h("div", {
        "class": bem$1b('inner')
      })]), h("button", {
        "attrs": {
          "type": "button",
          "disabled": disabled
        }
      })]);
    }

  });

  const NAMESPACE$h = 'TabBar';
  const {
    createComponent: createComponent$1d,
    bem: bem$1c
  } =
  /*#__PURE__*/
  createNamespace('tab-bar');
  var tabBar = /*#__PURE__*/
  createComponent$1d({
    mixins: [
    /*#__PURE__*/
    useCheckGroupWithModel(NAMESPACE$h),
    /*#__PURE__*/
    useColor()],
    props: {
      exclusive: {
        type: Boolean,
        default: true
      },
      keyboardVisible: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      translucent: {
        type: Boolean,
        default: false
      }
    },

    render() {
      const h = arguments[0];
      const {
        translucent,
        keyboardVisible
      } = this;
      return h("div", helper([{
        "class": bem$1c({
          translucent,
          hidden: keyboardVisible
        })
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const NAMESPACE$i = 'TabBar';
  const {
    createComponent: createComponent$1e,
    bem: bem$1d
  } =
  /*#__PURE__*/
  createNamespace('tab-button');
  var tabButton = /*#__PURE__*/
  createComponent$1e({
    mixins: [
    /*#__PURE__*/
    useCheckItemWithModel(NAMESPACE$i),
    /*#__PURE__*/
    useRipple()],
    props: {
      // This property holds a textual description of the button.
      text: String,
      layout: {
        type: String,
        default: ''
      },
      tab: {
        type: String,
        default: ''
      }
    },
    computed: {
      hasLabel() {
        return this.$el && !!this.$el.querySelector('.line-label');
      },

      hasIcon() {
        return this.$el && !!this.$el.querySelector('.line-icon');
      }

    },
    methods: {
      onClick() {
        if (this.checked) {
          return;
        }

        if (this.checkable && !this.disabled) {
          this.checked = true;
        }
      }

    },

    render() {
      const h = arguments[0];
      const {
        hasLabel,
        hasIcon
      } = this;
      return h("div", helper([{
        "class": [bem$1d({
          selected: this.checked,
          disabled: this.disabled
        }), {
          'line-activatable': true,
          'line-selectable': true,
          'line-focusable': true,
          'tab-has-label': hasLabel,
          'tab-has-icon': hasIcon,
          'tab-has-label-only': hasLabel && !hasIcon,
          'tab-has-icon-only': hasIcon && !hasLabel
        }],
        "on": {
          "click": this.onClick
        }
      }, {
        "on": this.$listeners
      }]), [h("a", {
        "attrs": {
          "tabIndex": -1
        }
      }, [this.slots() || this.text])]);
    }

  });

  const NAMESPACE$j = 'Tabs';
  const {
    createComponent: createComponent$1f,
    bem: bem$1e
  } =
  /*#__PURE__*/
  createNamespace('tab');
  var tab = /*#__PURE__*/
  createComponent$1f({
    mixins: [
    /*#__PURE__*/
    useCheckItemWithModel(NAMESPACE$j)],
    props: {
      title: {
        type: String,
        default: ''
      },
      tab: String
    },

    data() {
      return {};
    },

    methods: {
      onClick() {
        if (this.checked) {
          return;
        }

        if (this.checkable && !this.disabled) {
          this.checked = true;
        }
      }

    },

    mounted() {},

    render() {
      const h = arguments[0];
      const {
        checked,
        tab
      } = this;
      return h("div", helper([{
        "class": [bem$1e({
          hidden: !checked
        })],
        "attrs": {
          "role": "tabpanel",
          "aria-hidden": !checked ? 'true' : null,
          "aria-labelledby": `tab-button-${tab}`
        }
      }, {
        "on": this.$listeners
      }]), [this.slots()]);
    }

  });

  const NAMESPACE$k = 'Tabs';
  const {
    createComponent: createComponent$1g,
    bem: bem$1f
  } =
  /*#__PURE__*/
  createNamespace('tabs');
  var tabs = /*#__PURE__*/
  createComponent$1g({
    mixins: [
    /*#__PURE__*/
    useCheckGroupWithModel(NAMESPACE$k)],
    props: {
      exclusive: {
        type: Boolean,
        default: true
      }
    },

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$1f()
      }, {
        "on": this.$listeners
      }]), [this.slots('top'), h("div", {
        "class": bem$1f('inner')
      }, [this.slots()]), this.slots('bottom')]);
    }

  });

  const {
    createComponent: createComponent$1h,
    bem: bem$1g
  } =
  /*#__PURE__*/
  createNamespace('textarea');
  var textarea = /*#__PURE__*/
  createComponent$1h({
    props: {
      canPaste: {
        type: Boolean,
        default: true
      },
      canRedo: {
        type: Boolean,
        default: true
      },
      canUndo: {
        type: Boolean,
        default: true
      },
      persistentSelection: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      resize: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: ''
      },
      hoverEnabled: {
        type: Boolean,
        default: true
      },
      value: {
        type: [String, Number],
        default: ''
      },
      placeholderText: {
        type: String,
        default: ''
      },
      placeholderTextColor: {
        type: String,
        default: ''
      },
      rows: {
        type: Number,
        default: 2
      },
      maxlength: {
        type: Number
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      clearableIcon: {
        type: String,
        default: 'cancel'
      }
    },

    data() {
      return {
        isFocus: false,
        didBlurAfterEdit: false
      };
    },

    computed: {
      selectedText() {
        return '';
      },

      inputValue() {
        let {
          value
        } = this;
        value = value === null || value === undefined ? '' : String(value);
        return value;
      }

    },

    beforeMount() {// this.$emit('pressAndHold');
      // this.$emit('pressed');
      // this.$emit('released');
    },

    mounted() {// this.$nextTick(this.setInputValue);
      // this.$nextTick(this.adjustSize);
    },

    methods: {
      setInputValue() {
        const {
          input
        } = this.$refs;

        if (input.value === this.inputValue || !input) {
          return;
        }

        input.value = this.inputValue;
      },

      onClearValue(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$emit('input', '');
        this.$emit('clear');
      },

      hasValue() {
        return this.getValue() !== '';
      },

      getValue() {
        return this.value || '';
      },

      /**
       * Check if we need to clear the text input if clearOnEdit is enabled
       */
      checkClearOnEdit() {
        if (!this.clearOnEdit) {
          return;
        } // Did the input value change after it was blurred and edited?


        if (this.didBlurAfterEdit && this.hasValue()) {
          // Clear the input
          this.$emit('input', '');
        } // Reset the flag


        this.didBlurAfterEdit = false;
      },

      focusChange() {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
          this.didBlurAfterEdit = true;
        } // this.emitStyle(); ?

      },

      onInput() {
        const {
          textarea
        } = this.$refs;

        if (textarea) {
          this.$emit('input', textarea.value);
        } // his.emitStyle(); ?

      },

      onFocus() {
        this.hasFocus = true;
        this.focusChange();
        this.$emit('onFocus');
      },

      onBlur() {
        this.hasFocus = false;
        this.focusChange();
        this.$emit('onBlur');
      },

      onKeyDown() {
        this.checkClearOnEdit();
      }

    },
    watch: {
      value(value) {
        const {
          textarea
        } = this.$ref;

        if (textarea && textarea.value !== value) {
          textarea.value = value;
        }
      }

    },

    render() {
      const h = arguments[0];
      // const mode = getSkylineMode(this);
      const value = this.getValue();
      const {
        rows,
        maxlength,
        placeholderText,
        readonly,
        disabled,
        autocapitalize,
        autofocus
      } = this;
      return h("div", helper([{
        "class": bem$1g()
      }, {
        "on": this.$listeners
      }]), [h("textarea", {
        "class": "native-textarea",
        "ref": 'textarea',
        "attrs": {
          "autoCapitalize": autocapitalize,
          "autoFocus": autofocus,
          "rows": rows,
          "maxlength": maxlength,
          "placeholder": placeholderText,
          "readonly": readonly,
          "disabled": disabled
        },
        "on": {
          "input": this.onInput,
          "focus": this.onFocus,
          "blur": this.onBlur
        }
      }, [value])]);
    }

  });

  const {
    createComponent: createComponent$1i,
    bem: bem$1h
  } =
  /*#__PURE__*/
  createNamespace('thumbnail');
  var thumbnail = /*#__PURE__*/
  createComponent$1i({
    functional: true,

    render(h, {
      data,
      slots
    }) {
      return h("div", helper([{
        "class": bem$1h()
      }, data]), [slots()]);
    }

  });

  /**
   * iOS Toast Enter Animation
   */
  const iosEnterAnimation$6 = (baseEl, position) => {
      const baseAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-toast__wrapper');
      const bottom = 'calc(-10px - var(--ion-safe-area-bottom, 0px))';
      const top = 'calc(10px + var(--ion-safe-area-top, 0px))';
      wrapperAnimation.addElement(wrapperEl);
      switch (position) {
          case 'top':
              wrapperAnimation.fromTo('transform', 'translateY(-100%)', `translateY(${top})`);
              break;
          case 'middle':
              /* eslint-disable-next-line */
              const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
              wrapperEl.style.top = `${topPosition}px`;
              wrapperAnimation.fromTo('opacity', 0.01, 1);
              break;
          default:
              wrapperAnimation.fromTo('transform', 'translateY(100%)', `translateY(${bottom})`);
              break;
      }
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.155,1.105,.295,1.12)')
          .duration(400)
          .addAnimation(wrapperAnimation);
  };

  /**
   * iOS Toast Leave Animation
   */
  const iosLeaveAnimation$6 = (baseEl, position) => {
      const baseAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-toast__wrapper');
      const bottom = 'calc(-10px - var(--ion-safe-area-bottom, 0px))';
      const top = 'calc(10px + var(--ion-safe-area-top, 0px))';
      wrapperAnimation.addElement(wrapperEl);
      switch (position) {
          case 'top':
              wrapperAnimation.fromTo('transform', `translateY(${top})`, 'translateY(-100%)');
              break;
          case 'middle':
              wrapperAnimation.fromTo('opacity', 0.99, 0);
              break;
          default:
              wrapperAnimation.fromTo('transform', `translateY(${bottom})`, 'translateY(100%)');
              break;
      }
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(300)
          .addAnimation(wrapperAnimation);
  };

  /**
   * MD Toast Enter Animation
   */
  const mdEnterAnimation$5 = (baseEl, position) => {
      const baseAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-toast__wrapper');
      const bottom = 'calc(8px + var(--ion-safe-area-bottom, 0px))';
      const top = 'calc(8px + var(--ion-safe-area-top, 0px))';
      wrapperAnimation.addElement(wrapperEl);
      switch (position) {
          case 'top':
              wrapperEl.style.top = top;
              wrapperAnimation.fromTo('opacity', 0.01, 1);
              break;
          case 'middle':
              /* eslint-disable-next-line */
              const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
              wrapperEl.style.top = `${topPosition}px`;
              wrapperAnimation.fromTo('opacity', 0.01, 1);
              break;
          default:
              wrapperEl.style.bottom = bottom;
              wrapperAnimation.fromTo('opacity', 0.01, 1);
              break;
      }
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(400)
          .addAnimation(wrapperAnimation);
  };

  /**
   * md Toast Leave Animation
   */
  const mdLeaveAnimation$5 = (baseEl) => {
      const baseAnimation = createAnimation();
      const wrapperAnimation = createAnimation();
      const wrapperEl = baseEl.querySelector('.line-toast__wrapper');
      wrapperAnimation
          .addElement(wrapperEl)
          .fromTo('opacity', 0.99, 0);
      return baseAnimation
          .addElement(baseEl)
          .easing('cubic-bezier(.36,.66,.04,1)')
          .duration(300)
          .addAnimation(wrapperAnimation);
  };

  const {
    createComponent: createComponent$1j,
    bem: bem$1i
  } =
  /*#__PURE__*/
  createNamespace('toast');
  var toast = /*#__PURE__*/
  createComponent$1j({
    mixins: [
    /*#__PURE__*/
    usePopup(),
    /*#__PURE__*/
    usePopupDuration(),
    /*#__PURE__*/
    useColor()],
    props: {
      /**
       * The position of the toast on the screen.
       */
      // top | bottom | middle
      position: String,
      message: String
    },

    beforeMount() {
      const {
        mode
      } = this;
      this.$on('animation-enter', builder => {
        builder.build = mode === 'md' ? mdEnterAnimation$5 : iosEnterAnimation$6;
        builder.options = this.position;
      });
      this.$on('animation-leave', builder => {
        builder.build = mode === 'md' ? mdLeaveAnimation$5 : iosLeaveAnimation$6;
        builder.options = this.position;
      });
      this.$on('opened', () => {
        if (this.duration > 0) {
          this.durationTimeout = setTimeout(() => this.close('timeout'), this.duration);
        }
      });
      this.$on('aboutToHide', () => {
        if (this.durationTimeout) {
          clearTimeout(this.durationTimeout);
        }
      });
    },

    render() {
      const h = arguments[0];
      const {
        position = 'bottom'
      } = this;
      return h("div", helper([{
        "directives": [{
          name: "show",
          value: this.visible
        }],
        "class": [bem$1i()]
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$1i('wrapper', {
          [position]: true
        })
      }, [h("div", {
        "class": bem$1i('container')
      }, [h("div", {
        "class": bem$1i('content')
      }, [h("div", {
        "class": bem$1i('message')
      }, [this.message]), h("div")])])])]);
    }

  });

  const {
    createComponent: createComponent$1k,
    bem: bem$1j
  } =
  /*#__PURE__*/
  createNamespace('toolbar');
  var toolbar = /*#__PURE__*/
  createComponent$1k({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {},

    render() {
      const h = arguments[0];
      return h("div", helper([{
        "class": bem$1j()
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$1j('background')
      }), h("div", {
        "class": bem$1j('container')
      }, [this.slots('start'), this.slots('secondary'), h("div", {
        "class": bem$1j('content')
      }, [this.slots()]), this.slots('primary'), this.slots('end')])]);
    }

  });

  const {
    createComponent: createComponent$1l,
    bem: bem$1k
  } =
  /*#__PURE__*/
  createNamespace('title');
  var title = /*#__PURE__*/
  createComponent$1l({
    mixins: [
    /*#__PURE__*/
    useColor()],
    props: {
      // large | small | default
      size: String
    },

    render() {
      const h = arguments[0];
      const {
        size
      } = this;
      return h("div", helper([{
        "class": bem$1k({
          [size]: isDef(size)
        })
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$1k('inner')
      }, [this.slots()])]);
    }

  });

  function usePopupDelay() {
      return createMixins({
          props: {
              // This property holds the delay (milliseconds) after which the tool tip is shown.
              // A tooltip with a negative delay is shown immediately.
              // The default value is 0.
              delay: {
                  type: Number,
                  default: 0,
              },
          },
          data() {
              return {
                  delayedVisible: this.visible,
              };
          },
          watch: {
              visible(val) {
                  if (this.appearTimer) {
                      clearTimeout(this.appearTimer);
                  }
                  if (val === this.delayedVisible)
                      return;
                  if (!val) {
                      this.delayedVisible = val;
                      return;
                  }
                  const delay = Math.max(this.delay, 0);
                  this.appearTimer = setTimeout(() => this.delayedVisible = val, delay);
              },
          },
      });
  }

  const isVue = (val) => val && val._isVue;
  function useTrigger() {
      return createMixins({
          props: {
              // string or Element
              trigger: null,
          },
          computed: {
              // TODO
              // Evaluate before mounted may resolve $refs uncorrectly
              $trigger() {
                  const { trigger, $vnode } = this;
                  if (!trigger)
                      return undefined;
                  const baseEl = (($vnode && $vnode.context.$el) || document);
                  if (!$vnode) {
                      return isString(trigger)
                          ? baseEl.querySelector(trigger)
                          : trigger;
                  }
                  const refs = $vnode.context.$refs;
                  const resolved = isString(trigger)
                      ? refs[trigger] || baseEl.querySelector(trigger)
                      : trigger;
                  if (isArray(resolved)) {
                      console.warn(`
            There are more than one triggers in the context.
            Trigger element should be only one.
          `);
                  }
                  return isArray(resolved)
                      ? resolved[0]
                      : resolved;
              },
              $triggerEl() {
                  const trigger = this.$trigger;
                  return isVue(trigger)
                      ? trigger.$el
                      : trigger;
              },
          },
      });
  }

  /**
   * iOS Tooltip Enter Animation
   */
  const iosEnterAnimation$7 = (baseEl) => {
      const baseAnimation = createAnimation();
      return baseAnimation
          .addElement(baseEl)
          .easing('ease')
          .duration(100)
          .fromTo('opacity', 0.01, 1);
  };

  /**
   * iOS Popover Leave Animation
   */
  const iosLeaveAnimation$7 = (baseEl) => {
      const baseAnimation = createAnimation();
      return baseAnimation
          .addElement(baseEl)
          .easing('ease')
          .duration(500)
          .fromTo('opacity', 0.99, 0);
  };

  function createDirective(directive, element, binding) {
      const el = createElementProxy(element);
      let vnode;
      return {
          bind(val = binding.value) {
              if (!directive.bind)
                  return;
              binding.value = val;
              directive.bind(el, binding, vnode, vnode);
          },
          unbind() {
              if (!directive.unbind)
                  return;
              directive.unbind(el, binding, vnode, vnode);
          },
          inserted(val = binding.value) {
              if (!directive.inserted)
                  return;
              binding.value = val;
              directive.inserted(el, binding, vnode, vnode);
          },
          update(val, arg) {
              if (!directive.update)
                  return;
              binding.oldValue = binding.value;
              binding.value = val;
              binding.oldArg = binding.arg;
              binding.arg = arg || binding.arg;
              directive.update(el, binding, vnode, vnode);
          },
      };
  }

  function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      y: rect.top
    };
  }

  /*:: import type { Window } from '../types'; */

  /*:: declare function getWindow(node: Node | Window): Window; */
  function getWindow(node) {
    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView : window;
    }

    return node;
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  /*:: declare function isElement(node: mixed): boolean %checks(node instanceof
    Element); */

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement;
  }
  /*:: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
    HTMLElement); */


  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement;
  }

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getDocumentElement(element) {
    // $FlowFixMe: assume body is always available
    return (isElement(element) ? element.ownerDocument : element.document).documentElement;
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  // Composite means it takes into account transforms as well as layout.

  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var documentElement;
    var rect = getBoundingClientRect(elementOrVirtualElement);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (!isFixed) {
      if (getNodeName(offsetParent) !== 'body') {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement = getDocumentElement(offsetParent)) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  // Returns the layout rect of an element relative to its offsetParent. Layout
  // means it doesn't take into account transforms.
  function getLayoutRect(element) {
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return element.parentNode || // DOM Element detected
    // $FlowFixMe: need a better way to handle this...
    element.host || // ShadowRoot detected
    document.ownerDocument || // Fallback to ownerDocument if available
    document.documentElement // Or to documentElement if everything else fails
    ;
  }

  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node)) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle(node),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) {
        return node;
      }
    }

    return getScrollParent(getParentNode(node));
  }

  function listScrollParents(element, list) {
    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = getNodeName(scrollParent) === 'body';
    var target = isBody ? getWindow(scrollParent) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  var isFirefox = function isFirefox() {
    return typeof window.InstallTrigger !== 'undefined';
  };

  function getTrueOffsetParent(element) {
    var offsetParent;

    if (!isHTMLElement(element) || !(offsetParent = element.offsetParent) || // https://github.com/popperjs/popper-core/issues/837
    isFirefox() && getComputedStyle(offsetParent).position === 'fixed') {
      return null;
    }

    return offsetParent;
  }

  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element); // Find the nearest non-table offsetParent

    while (offsetParent && isTableElement(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static') {
      return window;
    }

    return offsetParent || window;
  }

  var auto = 'auto';

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce$1(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function format(str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return [].concat(args).reduce(function (p, c) {
      return p.replace(/%s/, c);
    }, str);
  }

  var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
  var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
  var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
  function validateModifiers(modifiers) {
    modifiers.forEach(function (modifier) {
      Object.keys(modifier).forEach(function (key) {
        switch (key) {
          case 'name':
            if (typeof modifier.name !== 'string') {
              console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
            }

            break;

          case 'enabled':
            if (typeof modifier.enabled !== 'boolean') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
            }

          case 'phase':
            if (modifierPhases.indexOf(modifier.phase) < 0) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
            }

            break;

          case 'fn':
            if (typeof modifier.fn !== 'function') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
            }

            break;

          case 'effect':
            if (typeof modifier.effect !== 'function') {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
            }

            break;

          case 'requires':
            if (!Array.isArray(modifier.requires)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
            }

            break;

          case 'requiresIfExists':
            if (!Array.isArray(modifier.requiresIfExists)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
            }

            break;

          case 'options':
          case 'data':
            break;

          default:
            console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
              return "\"" + s + "\"";
            }).join(', ') + "; but \"" + key + "\" was provided.");
        }

        modifier.requires && modifier.requires.forEach(function (requirement) {
          if (modifiers.find(function (mod) {
            return mod.name === requirement;
          }) == null) {
            console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
          }
        });
      });
    });
  }

  function uniqueBy(arr, fn) {
    var identifiers = new Set();
    return arr.filter(function (item) {
      var identifier = fn(item);

      if (!identifiers.has(identifier)) {
        identifiers.add(identifier);
        return true;
      }
    });
  }

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, {}, current, {
        options: Object.assign({}, existing.options, {}, current.options),
        data: Object.assign({}, existing.data, {}, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
  var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, {}, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(options) {
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, {}, state.options, {}, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          }); // Validate the provided modifiers so that the consumer will get warned
          // if one of the modifiers is invalid for any reason

          if (process.env.NODE_ENV !== "production") {
            var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
              var name = _ref.name;
              return name;
            });
            validateModifiers(modifiers);

            if (getBasePlacement(state.options.placement) === auto) {
              var flipModifier = state.orderedModifiers.find(function (_ref2) {
                var name = _ref2.name;
                return name === 'flip';
              });

              if (!flipModifier) {
                console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
              }
            }

            var _getComputedStyle = getComputedStyle(popper),
                marginTop = _getComputedStyle.marginTop,
                marginRight = _getComputedStyle.marginRight,
                marginBottom = _getComputedStyle.marginBottom,
                marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
            // cause bugs with positioning, so we'll warn the consumer


            if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
              return parseFloat(margin);
            })) {
              console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
            }
          }

          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            if (process.env.NODE_ENV !== "production") {
              console.error(INVALID_ELEMENT_ERROR);
            }

            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          var __debug_loops__ = 0;

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (process.env.NODE_ENV !== "production") {
              __debug_loops__ += 1;

              if (__debug_loops__ > 100) {
                console.error(INFINITE_LOOP_ERROR);
                break;
              }
            }

            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce$1(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(INVALID_ELEMENT_ERROR);
        }

        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref3) {
          var name = _ref3.name,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options,
              effect = _ref3.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }
  var createPopper =
  /*#__PURE__*/
  popperGenerator();

  function inserted$2(el, binding) {
      if (!binding.value)
          return;
      const { value: callback, modifiers: options = { passive: true }, } = binding;
      const enter = (ev) => callback(true, ev);
      const leave = (ev) => callback(false, ev);
      const mouseenterOff = on(el, 'mouseenter', enter, options);
      const mouseleaveOff = on(el, 'mouseleave', leave, options);
      const focusOff = on(el, 'focus', enter, options);
      const blurOff = on(el, 'blur', leave, options);
      function destroy() {
          mouseenterOff();
          mouseleaveOff();
          focusOff();
          blurOff();
      }
      el.vHover = {
          callback,
          options,
          enter,
          leave,
          destroy,
      };
  }
  function unbind$2(el) {
      const { vHover } = el;
      if (!vHover)
          return;
      vHover.destroy();
      delete el.vHover;
  }
  function update$3(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$2(el);
      }
      inserted$2(el, binding);
  }
  const Hover = {
      inserted: inserted$2,
      unbind: unbind$2,
      update: update$3,
  };

  const {
    createComponent: createComponent$1m,
    bem: bem$1l
  } =
  /*#__PURE__*/
  createNamespace('tooltip');
  var tooltip = /*#__PURE__*/
  createComponent$1m({
    mixins: [
    /*#__PURE__*/
    useColor(),
    /*#__PURE__*/
    usePopup({
      disableScroll: false
    }),
    /*#__PURE__*/
    usePopupDuration(),
    /*#__PURE__*/
    usePopupDelay(),
    /*#__PURE__*/
    useTrigger()],
    props: {
      // This property holds the text shown on the tool tip.
      text: String,
      placement: {
        type: String,
        default: 'top'
      },
      activeFocus: {
        type: Boolean,
        default: false
      },
      openOnHover: Boolean
    },
    watch: {
      openOnHover(val) {
        this.vHover.update(val && this.onHover);
      }

    },

    beforeMount() {
      this.$on('animation-enter', builder => {
        builder.build = baseEl => {
          const {
            $triggerEl = this.event && this.event.target || document.body,
            $el,
            placement
          } = this;
          this.popper = createPopper($triggerEl, $el, {
            placement: placement,
            strategy: 'fixed'
          });
          return iosEnterAnimation$7(baseEl);
        };
      });
      this.$on('animation-leave', builder => {
        builder.build = iosLeaveAnimation$7;
      });
    },

    async mounted() {
      await this.$nextTick();
      if (!this.$triggerEl) return;
      this.vHover = createDirective(Hover, this.$triggerEl, {
        name: 'hover'
      });
      this.vHover.inserted();

      if (this.openOnHover) {
        this.vHover.update(this.onHover);
      }
    },

    updated() {
      if (this.popper) {
        this.popper.scheduleUpdate();
      }
    },

    beforeDestroy() {
      if (this.popper) {
        this.popper.destroy();
      }

      if (this.vHover) {
        this.vHover.unbind();
      }
    },

    methods: {
      onHover(hover) {
        if (!this.openOnHover) return;
        this.visible = hover;
      }

    },

    render() {
      const h = arguments[0];
      const {
        delayedVisible,
        text
      } = this;
      return h("div", helper([{
        "directives": [{
          name: "show",
          value: delayedVisible
        }],
        "attrs": {
          "role": "tooltip"
        },
        "class": bem$1l({
          translucent: this.translucent
        })
      }, {
        "on": this.$listeners
      }]), [h("div", {
        "class": bem$1l('arrow'),
        "attrs": {
          "x-arrow": true
        }
      }), h("div", {
        "class": bem$1l('content')
      }, [this.slots() || text])]);
    }

  });

  // Auto Generated

  var components$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ActionGroup: actionGroup,
    Action: action,
    ActionSheet: actionSheet,
    Alert: alert,
    App: app,
    Avatar: avatar,
    Badge: badge,
    BusyIndicator: busyIndicator,
    ButtonGroup: buttonGroup,
    Button: button,
    CardContent: cardContent,
    CardHeader: cardHeader,
    CardSubtitle: cardSubtitle,
    CardTitle: cardTitle,
    Card: card,
    CellGroup: cellGroup,
    Cell: cell,
    CheckBoxGroup: checkBoxGroup,
    CheckBox: checkBox,
    CheckIndicator: CheckIndicator,
    Chip: chip,
    Col: col,
    CollapseItem: collapseItem,
    Collapse: collapse,
    Content: content,
    Datetime: datetime,
    Dialog: dialog,
    Fab: fab,
    FabButton: fabButton,
    FabGroup: FabGroup,
    Footer: footer,
    Grid: grid,
    Header: header,
    CheckGroup: checkGroup,
    CheckItem: checkItem,
    Lazy: lazy,
    TreeItem: treeItem,
    FontIcon: FontIcon,
    Icon: Icon,
    SvgIcon: SvgIcon,
    Image: image,
    Input: input,
    Item: item,
    ItemDivider: itemDivider,
    Label: label,
    List: list,
    ListHeader: listHeader,
    ListItem: ListItem,
    ListView: listView,
    Loading: loading,
    Menu: menu,
    Note: note,
    Overlay: Overlay,
    PageIndicator: pageIndicator,
    Picker: Picker,
    PickerColumn: LinePickerColumn,
    Popover: popover,
    PopupLegacy: popupLegacy,
    Popup: popup,
    ProgressBar: progressBar,
    ProgressCircular: progressCircular,
    Radio: radio,
    RadioButtonGroup: radioButtonGroup,
    RadioButton: radioButton,
    RadioIndicator: RadioIndicator,
    Range: range,
    Refresher: refresher,
    RefresherContent: refresherContent,
    Row: row,
    Slide: slide,
    Slider: slider,
    Slides: slides,
    Spinner: Spinner,
    Stepper: stepper,
    SwitchGroup: switchGroup,
    SwitchIndicator: switchIndicator,
    Switch: _switch,
    TabBar: tabBar,
    TabButton: tabButton,
    Tab: tab,
    Tabs: tabs,
    Textarea: textarea,
    Thumbnail: thumbnail,
    Toast: toast,
    Toolbar: toolbar,
    Title: title,
    Tooltip: tooltip
  });

  function inserted$3(el, binding) {
      const { modifiers } = binding;
      el.classList.add('line-activatable');
      if (modifiers.instant) {
          el.classList.add('line-activatable-instant');
      }
  }
  function unbind$3(el, binding) {
      const { modifiers } = binding;
      el.classList.remove('line-activatable');
      if (modifiers.instant) {
          el.classList.add('line-activatable-instant');
      }
  }
  const Activatable = {
      inserted: inserted$3,
      unbind: unbind$3,
  };

  const REPEAT_DELAY = 300;
  const REPEAT_INTERVAL = 300;
  function createAutoRepeat(el, options) {
      let repeatTimer;
      let repeatDelayTimer;
      let { enable: enableRepeat = true, interval: repeatInterval = REPEAT_INTERVAL, delay: repeatDelay = REPEAT_DELAY, } = options;
      function start(ev) {
          if (enableRepeat) {
              repeatDelayTimer = setTimeout(() => {
                  repeatTimer = setInterval(() => {
                      console.log('dispatch event');
                      const repeatEvent = new MouseEvent('click', ev);
                      repeatEvent.repeat = true;
                      el.dispatchEvent(repeatEvent);
                  }, repeatInterval);
              }, repeatDelay);
          }
      }
      function stop() {
          if (repeatDelayTimer) {
              clearTimeout(repeatDelayTimer);
              repeatDelayTimer = null;
          }
          if (repeatTimer) {
              clearInterval(repeatTimer);
              repeatTimer = null;
          }
      }
      function pointerDown(ev) {
          if (!enableRepeat)
              return;
          if (('isTrusted' in ev && !ev.isTrusted)
              || ('pointerType' in ev && !ev.pointerType))
              return;
          if (!ev.composedPath().some(path => path === el))
              return;
          start(ev);
      }
      function enable(val) {
          enableRepeat = val;
          if (!enableRepeat) {
              stop();
          }
      }
      function setOptions(val) {
          enableRepeat = !!val.enable;
          repeatInterval = val.interval || REPEAT_INTERVAL;
          repeatDelay = val.delay || REPEAT_DELAY;
      }
      const doc = document;
      const opts = { passive: true };
      const mousedownOff = on(doc, 'mousedown', pointerDown, opts);
      const mouseupOff = on(doc, 'mouseup', stop, opts);
      const touchstartOff = on(doc, 'touchstart', pointerDown, opts);
      const touchendOff = on(doc, 'touchend', stop, opts);
      const touchcancelOff = on(doc, 'touchcancel', stop, opts);
      const dragstartOff = on(doc, 'dragstart', stop, opts);
      function destroy() {
          stop();
          mousedownOff();
          mouseupOff();
          touchstartOff();
          touchendOff();
          touchcancelOff();
          dragstartOff();
      }
      return {
          enable,
          update: setOptions,
          start,
          stop,
          pointerDown,
          pointerUp: stop,
          destroy,
      };
  }
  function inserted$4(el, binding) {
      if (binding.value === false)
          return;
      const vAutoRepeat = createAutoRepeat(el, binding.value);
      el.vAutoRepeat = vAutoRepeat;
  }
  function update$4(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      const { vAutoRepeat } = el;
      if (!vAutoRepeat) {
          inserted$4(el, binding);
          return;
      }
      vAutoRepeat.stop();
      vAutoRepeat.update(binding.value);
  }
  function unbind$4(el, binding) {
      const { vAutoRepeat } = el;
      if (!vAutoRepeat)
          return;
      vAutoRepeat.destroy();
      delete el.vAutoRepeat;
  }
  const AutoRepeat = {
      inserted: inserted$4,
      update: update$4,
      unbind: unbind$4,
  };

  function createClickOutside(el, options) {
      const { enabled = () => true, include = () => [], callback, } = options;
      function maybe(ev) {
          if (!ev)
              return;
          if (enabled(ev) === false)
              return;
          if (('isTrusted' in ev && !ev.isTrusted)
              || ('pointerType' in ev && !ev.pointerType))
              return;
          const elements = include();
          elements.push(el);
          !elements.some(element => element.contains(ev.target)) && setTimeout(() => { enabled(ev) && callback(ev); }, 0);
      }
      const doc = document;
      const opts = { passive: true };
      const mouseupOff = on(doc, 'mouseup', maybe, opts);
      const touchendOff = on(doc, 'touchend', maybe, opts);
      function destroy() {
          mouseupOff();
          touchendOff();
      }
      return {
          maybe,
          destroy,
      };
  }
  function inserted$5(el, binding) {
      if (!binding.value)
          return;
      const vClickOutside = createClickOutside(el, {
          ...binding.args,
          callback: binding.value,
      });
      el.vClickOutside = vClickOutside;
  }
  function unbind$5(el, binding) {
      const { vClickOutside } = el;
      if (!vClickOutside)
          return;
      vClickOutside.destroy();
      delete el.vClickOutside;
  }
  function update$5(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$5(el);
      }
      inserted$5(el, binding);
  }
  const ClickOutside = {
      inserted: inserted$5,
      unbind: unbind$5,
      update: update$5,
  };

  function inserted$6(el, binding) {
      if (!binding.value)
          return;
      const config = {
          ...binding.value,
          el,
      };
      el.vGesture = createGesture(config);
  }
  function unbind$6(el) {
      const { vGesture } = el;
      if (!vGesture)
          return;
      vGesture.destroy();
      delete el.vGesture;
  }
  function update$6(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$6(el);
      }
      inserted$6(el, binding);
  }
  const Gesture = {
      inserted: inserted$6,
      unbind: unbind$6,
      update: update$6,
  };

  function inserted$7(el, binding) {
      if (!binding.value)
          return;
      const modifiers = binding.modifiers || {};
      const { value } = binding;
      const callback = isObject(value)
          ? value.handler
          : value;
      const options = {
          root: document.querySelector(binding.arg),
          ...value.options,
      };
      const observer = new IntersectionObserver((entries = [], observer) => {
          if (!el.vIntersect)
              return; // Just in case, should never fire
          // If is not quiet or has already been
          // initted, invoke the user callback
          if (callback && (!modifiers.quiet
              || el.vIntersect.init)) {
              const isIntersecting = Boolean(entries.find(entry => entry.isIntersecting));
              callback(entries, observer, isIntersecting);
          }
          // If has already been initted and
          // has the once modifier, unbind
          /* eslint-disable-next-line */
          if (el.vIntersect.init && modifiers.once)
              unbind$7(el);
          // Otherwise, mark the observer as initted
          else
              (el.vIntersect.init = true);
      }, options);
      function destroy() {
          observer.unobserve(el);
      }
      el.vIntersect = {
          init: false,
          observer,
          destroy,
      };
      observer.observe(el);
  }
  function unbind$7(el) {
      const { vIntersect } = el;
      if (!vIntersect)
          return;
      vIntersect.destroy();
      delete el.vIntersect;
  }
  function update$7(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$7(el);
      }
      inserted$7(el, binding);
  }
  const Intersect = {
      inserted: inserted$7,
      update: update$7,
      unbind: unbind$7,
  };

  function inserted$8(el, binding) {
      if (!binding.value)
          return;
      const modifiers = binding.modifiers || {};
      const { value } = binding;
      const callback = isObject(value)
          ? value.handler
          : value;
      const { once, ...modifierKeys } = modifiers;
      const hasModifiers = Object.keys(modifierKeys).length > 0;
      const hasOptions = !!value.options;
      // Options take top priority
      const options = hasOptions ? value.options : hasModifiers
          // If we have modifiers, use only those provided
          ? {
              attributes: modifierKeys.attr,
              childList: modifierKeys.child,
              subtree: modifierKeys.sub,
              characterData: modifierKeys.char,
          }
          // Defaults to everything on
          : {
              attributes: true,
              childList: true,
              subtree: true,
              characterData: true,
          };
      const observer = new MutationObserver((mutationsList, observer) => {
          if (!el.vMutate)
              return; // Just in case, should never fire
          callback(mutationsList, observer);
          // If has the once modifier, unbind
          /* eslint-disable-next-line */
          once && unbind$8(el);
      });
      function destroy() {
          observer.disconnect();
      }
      el.vMutate = {
          observer,
          destroy,
      };
      observer.observe(el, options);
  }
  function unbind$8(el) {
      const { vMutate } = el;
      if (!vMutate)
          return;
      vMutate.destroy();
      delete el.vMutate;
  }
  function update$8(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$8(el);
      }
      inserted$8(el, binding);
  }
  const Mutate = {
      inserted: inserted$8,
      unbind: unbind$8,
      update: update$8,
  };

  function inserted$9(el, binding) {
      if (!binding.value)
          return;
      const { value: callback, modifiers: options = { passive: true }, } = binding;
      const resizeOff = on(window, 'resize', callback, options);
      function destroy() {
          resizeOff();
      }
      el.vResize = {
          callback,
          options,
          destroy,
      };
      if (!binding.modifiers || !binding.modifiers.quiet) {
          callback();
      }
  }
  function unbind$9(el) {
      const { vResize } = el;
      if (!vResize)
          return;
      vResize.destroy();
      delete el.vResize;
  }
  function update$9(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$9(el);
      }
      inserted$9(el, binding);
  }
  const Resize$1 = {
      inserted: inserted$9,
      unbind: unbind$9,
      update: update$9,
  };

  function inserted$a(el, binding) {
      const callback = binding.value;
      const options = binding.options || { passive: true };
      const target = binding.arg ? document.querySelector(binding.arg) : window;
      if (!target)
          return;
      const scrollOff = on(target, 'scroll', callback, options);
      function destroy() {
          scrollOff();
      }
      el.vScroll = {
          callback,
          options,
          target,
          destroy,
      };
  }
  function unbind$a(el) {
      const { vScroll } = el;
      if (!vScroll)
          return;
      vScroll.destroy();
      delete el.vScroll;
  }
  function update$a(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$a(el);
      }
      inserted$a(el, binding);
  }
  const Scroll = {
      inserted: inserted$a,
      unbind: unbind$a,
      update: update$a,
  };

  const clamp$5 = (num, min, max) => {
      return Math.max(min, Math.min(num, max));
  };

  /* eslint-disable */
  const createSwipeBackGesture = (el, canStartHandler, onStartHandler, onMoveHandler, onEndHandler) => {
      const win = el.ownerDocument.defaultView;
      const canStart = (detail) => {
          return detail.startX <= 50 && canStartHandler();
      };
      const onMove = (detail) => {
          // set the transition animation's progress
          const delta = detail.deltaX;
          const stepValue = delta / win.innerWidth;
          onMoveHandler(stepValue);
      };
      const onEnd = (detail) => {
          // the swipe back gesture has ended
          const delta = detail.deltaX;
          const width = win.innerWidth;
          const stepValue = delta / width;
          const velocity = detail.velocityX;
          const z = width / 2.0;
          const shouldComplete = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);
          const missing = shouldComplete ? 1 - stepValue : stepValue;
          const missingDistance = missing * width;
          let realDur = 0;
          if (missingDistance > 5) {
              const dur = missingDistance / Math.abs(velocity);
              realDur = Math.min(dur, 540);
          }
          /**
           * TODO: stepValue can sometimes return negative values
           * or values greater than 1 which should not be possible.
           * Need to investigate more to find where the issue is.
           */
          onEndHandler(shouldComplete, (stepValue <= 0) ? 0.01 : clamp$5(0, stepValue, 0.9999), realDur);
      };
      return createGesture({
          el,
          gestureName: 'goback-swipe',
          gesturePriority: 40,
          threshold: 10,
          canStart,
          onStart: onStartHandler,
          onMove,
          onEnd
      });
  };

  function inserted$b(el, binding) {
      if (!binding.value)
          return;
      const { canStartHandler = NO, onStartHandler = NOOP, onMoveHandler = NOOP, onEndHandler = NOOP, } = binding.value;
      el.vSwipeBack = createSwipeBackGesture(el, canStartHandler, onStartHandler, onMoveHandler, onEndHandler);
  }
  function unbind$b(el) {
      const { vSwipeBack } = el;
      if (!vSwipeBack)
          return;
      vSwipeBack.destroy();
      delete el.vSwipeBack;
  }
  function update$b(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$b(el);
      }
      inserted$b(el, binding);
  }
  const SwipeBack = {
      inserted: inserted$b,
      unbind: unbind$b,
      update: update$b,
  };

  const DIR_RATIO = 0.5;
  const MIN_DISTANCE = 16;
  const handleGesture = (wrapper) => {
      const { touchstartX, touchendX, touchstartY, touchendY, } = wrapper;
      wrapper.offsetX = touchendX - touchstartX;
      wrapper.offsetY = touchendY - touchstartY;
      if (Math.abs(wrapper.offsetY) < DIR_RATIO * Math.abs(wrapper.offsetX)) {
          wrapper.left && (touchendX < touchstartX - MIN_DISTANCE) && wrapper.left(wrapper);
          wrapper.right && (touchendX > touchstartX + MIN_DISTANCE) && wrapper.right(wrapper);
      }
      if (Math.abs(wrapper.offsetX) < DIR_RATIO * Math.abs(wrapper.offsetY)) {
          wrapper.up && (touchendY < touchstartY - MIN_DISTANCE) && wrapper.up(wrapper);
          wrapper.down && (touchendY > touchstartY + MIN_DISTANCE) && wrapper.down(wrapper);
      }
  };
  function touchstart(event, wrapper) {
      const touch = event.changedTouches[0];
      wrapper.touchstartX = touch.clientX;
      wrapper.touchstartY = touch.clientY;
      wrapper.start
          && wrapper.start(Object.assign(event, wrapper));
  }
  function touchend(event, wrapper) {
      const touch = event.changedTouches[0];
      wrapper.touchendX = touch.clientX;
      wrapper.touchendY = touch.clientY;
      wrapper.end
          && wrapper.end(Object.assign(event, wrapper));
      handleGesture(wrapper);
  }
  function touchmove(event, wrapper) {
      const touch = event.changedTouches[0];
      wrapper.touchmoveX = touch.clientX;
      wrapper.touchmoveY = touch.clientY;
      wrapper.move && wrapper.move(Object.assign(event, wrapper));
  }
  function createHandlers(value) {
      const wrapper = {
          touchstartX: 0,
          touchstartY: 0,
          touchendX: 0,
          touchendY: 0,
          touchmoveX: 0,
          touchmoveY: 0,
          offsetX: 0,
          offsetY: 0,
          left: value.left,
          right: value.right,
          up: value.up,
          down: value.down,
          start: value.start,
          move: value.move,
          end: value.end,
      };
      return {
          touchstart: (e) => touchstart(e, wrapper),
          touchend: (e) => touchend(e, wrapper),
          touchmove: (e) => touchmove(e, wrapper),
      };
  }
  function inserted$c(el, binding) {
      const value = binding.value;
      const target = value.parent ? el.parentElement : el;
      const options = value.options || { passive: true };
      // Needed to pass unit tests
      if (!target)
          return;
      const handlers = createHandlers(binding.value);
      keys(handlers).forEach((eventName) => {
          on(target, eventName, handlers[eventName], options);
      });
      function destroy() {
          keys(handlers).forEach((eventName) => {
              off(target, eventName, handlers[eventName]);
          });
      }
      target.vTouch = {
          destroy,
      };
  }
  function unbind$c(el) {
      const { vTouch } = el;
      if (!vTouch)
          return;
      vTouch.destroy();
      delete el.vTouch;
  }
  function update$c(el, binding) {
      if (binding.value === binding.oldValue) {
          return;
      }
      if (binding.oldValue) {
          unbind$c(el);
      }
      inserted$c(el, binding);
  }
  const Touch = {
      inserted: inserted$c,
      unbind: unbind$c,
      update: update$c,
  };

  function createTrigger() {
      return {};
  }
  function inserted$d(el, binding) {
      el.vTrigger = createTrigger();
  }
  function unbind$d(el) {
      if (!el.vTrigger)
          return;
      delete el.vTrigger;
  }
  const Trigger = {
      inserted: inserted$d,
      unbind: unbind$d,
  };

  // Auto Generated

  var directives = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Activatable: Activatable,
    AutoRepeat: AutoRepeat,
    ClickOutside: ClickOutside,
    Gesture: Gesture,
    Hover: Hover,
    Intersect: Intersect,
    Mutate: Mutate,
    Remote: Remote,
    Resize: Resize$1,
    Ripple: Ripple,
    Scroll: Scroll,
    SwipeBack: SwipeBack,
    Touch: Touch,
    Trigger: Trigger
  });

  function useAsyncRender() {
      return createMixins({
          beforeCreate() {
              const { $options: options, } = this;
              const { render, } = options;
              let snapshot;
              let pending = false;
              const asyncRender = async (h) => {
                  pending = true;
                  snapshot = await render.call(this, h, undefined);
                  // update component sync & avoid re-collect dependencies
                  this._update.call(this, snapshot);
                  // clear snapshot
                  snapshot = null;
                  pending = false;
              };
              options.render = (h) => {
                  if (!pending) {
                      // trigger async render
                      asyncRender.call(this, h);
                  }
                  return snapshot;
              };
          },
      });
  }

  function useBreakPoint() {
      return createMixins({
          data() {
              return {
                  clientWidth: getClientWidth(),
                  clientHeight: getClientHeight(),
                  thresholds: {
                      xs: 600,
                      sm: 960,
                      md: 1280,
                      lg: 1920,
                  },
                  scrollbarWidth: 16,
              };
          },
          computed: {
              breakpoint() {
                  const xs = this.clientWidth < this.thresholds.xs;
                  const sm = this.clientWidth < this.thresholds.sm && !xs;
                  const md = this.clientWidth < (this.thresholds.md - this.scrollbarWidth) && !(sm || xs);
                  const lg = this.clientWidth < (this.thresholds.lg - this.scrollbarWidth) && !(md || sm || xs);
                  const xl = this.clientWidth >= (this.thresholds.lg - this.scrollbarWidth);
                  const xsOnly = xs;
                  const smOnly = sm;
                  const smAndDown = (xs || sm) && !(md || lg || xl);
                  const smAndUp = !xs && (sm || md || lg || xl);
                  const mdOnly = md;
                  const mdAndDown = (xs || sm || md) && !(lg || xl);
                  const mdAndUp = !(xs || sm) && (md || lg || xl);
                  const lgOnly = lg;
                  const lgAndDown = (xs || sm || md || lg) && !xl;
                  const lgAndUp = !(xs || sm || md) && (lg || xl);
                  const xlOnly = xl;
                  let name;
                  switch (true) {
                      case (xs):
                          name = 'xs';
                          break;
                      case (sm):
                          name = 'sm';
                          break;
                      case (md):
                          name = 'md';
                          break;
                      case (lg):
                          name = 'lg';
                          break;
                      default:
                          name = 'xl';
                          break;
                  }
                  return {
                      // Definite breakpoint.
                      xs,
                      sm,
                      md,
                      lg,
                      xl,
                      // Useful e.g. to construct CSS class names dynamically.
                      name,
                      // Breakpoint ranges.
                      xsOnly,
                      smOnly,
                      smAndDown,
                      smAndUp,
                      mdOnly,
                      mdAndDown,
                      mdAndUp,
                      lgOnly,
                      lgAndDown,
                      lgAndUp,
                      xlOnly,
                      // For custom breakpoint logic.
                      width: this.clientWidth,
                      height: this.clientHeight,
                      thresholds: this.thresholds,
                      scrollbarWidth: this.scrollbarWidth,
                  };
              },
          },
          methods: {
              onResize: debounce(function onResize() {
                  this.setDimensions();
              }, 200),
              setDimensions() {
                  this.clientHeight = getClientHeight();
                  this.clientWidth = getClientWidth();
              },
          },
          beforeMount() {
              if (!hasWindow)
                  return;
              on(window, 'resize', this.onResize, { passive: true });
          },
          beforeDestroy() {
              if (!hasWindow)
                  return;
              off(window, 'resize', this.onResize);
          },
      });
  }

  function useOptions(options, namsespace = 'options') {
      return createMixins({
          props: options.reduce((prev, val) => {
              prev[val] = Boolean;
              return prev;
          }, {
              [namsespace]: {
                  type: String,
                  validator(val) { return options.includes(val); },
              },
          }),
          beforeRender() {
              const { $props: props } = this;
              let hit = props[namsespace];
              if (!hit) {
                  for (const option of options) {
                      hit = props[option] ? option : hit;
                      if (hit)
                          break;
                  }
              }
              this[namsespace] = hit || options[0];
          },
      });
  }

  function usePopstateClose(options) {
      const { event = 'popstate', handler = 'close', global = true, } = options || {};
      return createMixins({
          mixins: [
              useEvent({ event, handler, global }),
          ],
      });
  }

  // Auto Generated

  var mixins = /*#__PURE__*/Object.freeze({
    __proto__: null,
    useAsyncRender: useAsyncRender,
    useBreakPoint: useBreakPoint,
    useCheckGroup: useCheckGroup,
    getItemValue: getItemValue,
    useCheckGroupWithModel: useCheckGroupWithModel,
    useCheckItem: useCheckItem,
    useCheckItemWithModel: useCheckItemWithModel,
    useClickOutside: useClickOutside,
    createColorClasses: createColorClasses,
    useColor: useColor,
    invoke: invoke,
    useEvent: useEvent,
    useGroupItem: useGroupItem,
    useGroup: useGroup,
    DEFAULT_VALUE: DEFAULT_VALUE,
    useLazy: useLazy,
    createModeClasses: createModeClasses,
    useMode: useMode,
    DEFAULT_PROP: DEFAULT_PROP,
    DEFAULT_EVENT: DEFAULT_EVENT,
    useModel: useModel,
    useOptions: useOptions,
    usePopstateClose: usePopstateClose,
    usePopupDelay: usePopupDelay,
    usePopupDuration: usePopupDuration,
    usePopup: usePopup,
    useRemote: useRemote,
    useRender: useRender,
    useRipple: useRipple,
    useSlots: useSlots,
    useTransition: useTransition,
    useTreeItem: useTreeItem,
    isVue: isVue,
    useTrigger: useTrigger
  });

  const Skyline = {
      install,
      version: "1.0.0-alpha",
  };
  function defaulExport() {
      // auto install for umd build
      if (typeof window !== 'undefined' && window.Vue) {
          install(window.Vue, {
              components: components$1,
              directives,
          });
      }
      return {
          install(Vue, opts) {
              install(Vue, {
                  components: components$1,
                  directives,
                  ...opts,
              });
          },
          components: components$1,
          directives,
          mixins,
          version: "1.0.0-alpha",
      };
  }
  var index$1 = /*#__PURE__*/ defaulExport();

  exports.Action = action;
  exports.ActionGroup = actionGroup;
  exports.ActionSheet = actionSheet;
  exports.Activatable = Activatable;
  exports.Alert = alert;
  exports.App = app;
  exports.AutoRepeat = AutoRepeat;
  exports.Avatar = avatar;
  exports.Badge = badge;
  exports.BusyIndicator = busyIndicator;
  exports.Button = button;
  exports.ButtonGroup = buttonGroup;
  exports.Card = card;
  exports.CardContent = cardContent;
  exports.CardHeader = cardHeader;
  exports.CardSubtitle = cardSubtitle;
  exports.CardTitle = cardTitle;
  exports.Cell = cell;
  exports.CellGroup = cellGroup;
  exports.CheckBox = checkBox;
  exports.CheckBoxGroup = checkBoxGroup;
  exports.CheckGroup = checkGroup;
  exports.CheckIndicator = CheckIndicator;
  exports.CheckItem = checkItem;
  exports.Chip = chip;
  exports.ClickOutside = ClickOutside;
  exports.Col = col;
  exports.Collapse = collapse;
  exports.CollapseItem = collapseItem;
  exports.Content = content;
  exports.DEFAULT_EVENT = DEFAULT_EVENT;
  exports.DEFAULT_PROP = DEFAULT_PROP;
  exports.DEFAULT_VALUE = DEFAULT_VALUE;
  exports.Datetime = datetime;
  exports.Dialog = dialog;
  exports.Fab = fab;
  exports.FabButton = fabButton;
  exports.FabGroup = FabGroup;
  exports.FontIcon = FontIcon;
  exports.Footer = footer;
  exports.Gesture = Gesture;
  exports.Grid = grid;
  exports.Header = header;
  exports.Hover = Hover;
  exports.Icon = Icon;
  exports.Image = image;
  exports.Input = input;
  exports.Intersect = Intersect;
  exports.Item = item;
  exports.ItemDivider = itemDivider;
  exports.Label = label;
  exports.Lazy = lazy;
  exports.List = list;
  exports.ListHeader = listHeader;
  exports.ListItem = ListItem;
  exports.ListView = listView;
  exports.Loading = loading;
  exports.Menu = menu;
  exports.Mutate = Mutate;
  exports.Note = note;
  exports.Overlay = Overlay;
  exports.PageIndicator = pageIndicator;
  exports.Picker = Picker;
  exports.PickerColumn = LinePickerColumn;
  exports.Popover = popover;
  exports.Popup = popup;
  exports.PopupLegacy = popupLegacy;
  exports.ProgressBar = progressBar;
  exports.ProgressCircular = progressCircular;
  exports.Radio = radio;
  exports.RadioButton = radioButton;
  exports.RadioButtonGroup = radioButtonGroup;
  exports.RadioIndicator = RadioIndicator;
  exports.Range = range;
  exports.Refresher = refresher;
  exports.RefresherContent = refresherContent;
  exports.Remote = Remote;
  exports.Resize = Resize$1;
  exports.Ripple = Ripple;
  exports.Row = row;
  exports.Scroll = Scroll;
  exports.Skyline = Skyline;
  exports.Slide = slide;
  exports.Slider = slider;
  exports.Slides = slides;
  exports.Spinner = Spinner;
  exports.Stepper = stepper;
  exports.SvgIcon = SvgIcon;
  exports.SwipeBack = SwipeBack;
  exports.Switch = _switch;
  exports.SwitchGroup = switchGroup;
  exports.SwitchIndicator = switchIndicator;
  exports.Tab = tab;
  exports.TabBar = tabBar;
  exports.TabButton = tabButton;
  exports.Tabs = tabs;
  exports.Textarea = textarea;
  exports.Thumbnail = thumbnail;
  exports.Title = title;
  exports.Toast = toast;
  exports.Toolbar = toolbar;
  exports.Tooltip = tooltip;
  exports.Touch = Touch;
  exports.TreeItem = treeItem;
  exports.Trigger = Trigger;
  exports.createColorClasses = createColorClasses;
  exports.createModeClasses = createModeClasses;
  exports.default = index$1;
  exports.getItemValue = getItemValue;
  exports.invoke = invoke;
  exports.isVue = isVue;
  exports.useAsyncRender = useAsyncRender;
  exports.useBreakPoint = useBreakPoint;
  exports.useCheckGroup = useCheckGroup;
  exports.useCheckGroupWithModel = useCheckGroupWithModel;
  exports.useCheckItem = useCheckItem;
  exports.useCheckItemWithModel = useCheckItemWithModel;
  exports.useClickOutside = useClickOutside;
  exports.useColor = useColor;
  exports.useEvent = useEvent;
  exports.useGroup = useGroup;
  exports.useGroupItem = useGroupItem;
  exports.useLazy = useLazy;
  exports.useMode = useMode;
  exports.useModel = useModel;
  exports.useOptions = useOptions;
  exports.usePopstateClose = usePopstateClose;
  exports.usePopup = usePopup;
  exports.usePopupDelay = usePopupDelay;
  exports.usePopupDuration = usePopupDuration;
  exports.useRemote = useRemote;
  exports.useRender = useRender;
  exports.useRipple = useRipple;
  exports.useSlots = useSlots;
  exports.useTransition = useTransition;
  exports.useTreeItem = useTreeItem;
  exports.useTrigger = useTrigger;

  return exports;

}({}, Vue));
