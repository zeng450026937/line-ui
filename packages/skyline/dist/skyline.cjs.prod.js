'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

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
        sfc.bem = createBEM(name);
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
        created() {
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
function bind(el, binding) {
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
    bind(el, binding);
}
const Ripple = {
    bind,
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

  created() {
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
function inserted(el, binding) {
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
    inserted(el, binding);
}
const Remote = {
    inserted,
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
        created() {
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
        created() {
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
        },
        beforeMount() {
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

  created() {
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

  created() {
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

  created() {
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

  beforeCreate() {
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
        created() {
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
    return h("div", helper([{
      "class": [bem$m({
        disabled,
        indeterminate,
        checked
      }), {
        'in-item': inItem
      }],
      "attrs": {
        "role": "checkbox"
      }
    }, {
      "on": this.$listeners
    }, {
      "on": {
        "click": this.toggle
      }
    }]), [this.slots('indicator', {
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
      :  `${columns / 12 * 100}%`;
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


      const amount =  columns > 0 && columns < 12 ? `${columns / 12 * 100}%` : 'auto';
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
createNamespace('dialog');
const CONTENT_ELEMENT = 'content';
var dialog = /*#__PURE__*/
createComponent$t({
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
      "class": bem$s()
    }, [h("div", {
      "class": bem$s(CONTENT_ELEMENT),
      "ref": CONTENT_ELEMENT
    }, [this.slots()])]);
  }

});

function invoke(vm, name, ...args) {
    return isFunction(name) ? name.call(vm, ...args) : vm[name] && vm[name](...args);
}
function useEvent(options) {
    let app = document.body;
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
        app = document.querySelector('[skyline-app]') || app;
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
  createComponent: createComponent$u,
  bem: bem$t
} =
/*#__PURE__*/
createNamespace('fab-group');
var FabGroup = /*#__PURE__*/
createComponent$u({
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
      "class": bem$t({
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
  createComponent: createComponent$v,
  bem: bem$u
} =
/*#__PURE__*/
createNamespace('fab');
const FAB_SIDES = ['start', 'end', 'top', 'bottom'];
var fab = /*#__PURE__*/
createComponent$v({
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

  created() {
    this.$on('clickoutside', () => {
      console.log('clickoutside');
      this.activated = false;
    });
  },

  beforeMount() {
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
      "class": bem$u({
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
  createComponent: createComponent$w,
  bem: bem$v
} =
/*#__PURE__*/
createNamespace('fab-button');
var fabButton = /*#__PURE__*/
createComponent$w({
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
      "class": ['activatable', 'line-focusable', bem$v({
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
      "class": bem$v('content', {
        vertical
      })
    }, [h("span", {
      "class": bem$v('indicator')
    }, [this.slots('indicator')]), h("span", {
      "class": bem$v('inner')
    }, [this.slots() || text])])]);
  }

});

const {
  createComponent: createComponent$x,
  bem: bem$w
} =
/*#__PURE__*/
createNamespace('footer');
var footer = /*#__PURE__*/
createComponent$x({
  inject: ['App'],
  props: {
    translucent: Boolean
  },

  data() {
    return {
      isAppFooter: false
    };
  },

  created() {
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
      "class": bem$w({
        translucent
      })
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const {
  createComponent: createComponent$y,
  bem: bem$x
} =
/*#__PURE__*/
createNamespace('grid');
var grid = /*#__PURE__*/
createComponent$y({
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
      "class": bem$x({
        fixed: props.fixed
      })
    }, data]), [slots()]);
  }

});

const {
  createComponent: createComponent$z,
  bem: bem$y
} =
/*#__PURE__*/
createNamespace('header');
var header = /*#__PURE__*/
createComponent$z({
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

  created() {
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
      "class": [bem$y(), `line-header-${mode}`, `line-header-collapse-${collapse}`, this.translucent && 'line-header-translucent', this.translucent && `line-header-translucent-${mode}`]
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const {
  createComponent: createComponent$A,
  bem: bem$z
} =
/*#__PURE__*/
createNamespace('check-group');
var checkGroup = /*#__PURE__*/
createComponent$A({
  mixins: [
  /*#__PURE__*/
  useCheckGroupWithModel('Group')],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$z()
    }, [this.slots()]);
  }

});

const {
  createComponent: createComponent$B,
  bem: bem$A
} =
/*#__PURE__*/
createNamespace('check-item');
var checkItem = /*#__PURE__*/
createComponent$B({
  mixins: [
  /*#__PURE__*/
  useCheckItemWithModel('Group')],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$A(),
      "on": {
        "click": this.toggle
      }
    }, [this.slots()]);
  }

});

const {
  createComponent: createComponent$C,
  bem: bem$B
} =
/*#__PURE__*/
createNamespace('lazy');
var lazy = /*#__PURE__*/
createComponent$C({
  mixins: [
  /*#__PURE__*/
  useLazy()],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$B()
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
        created() {
            let deep = 0;
            let group = this[name];
            while (group) {
                deep++;
                group = group[name];
            }
            this.itemDeep = deep;
        },
        beforeMount() {
            this.checked = this.checked || (isDef(this.$attrs.checked)
                && this.$attrs.checked !== false);
        },
    });
}

const {
  createComponent: createComponent$D,
  bem: bem$C
} =
/*#__PURE__*/
createNamespace('tree-item');
var treeItem = /*#__PURE__*/
createComponent$D({
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
      "class": bem$C(),
      "on": {
        "click": this.onClick
      }
    }, [this.slots()]);
  }

});

const {
  createComponent: createComponent$E,
  bem: bem$D
} =
/*#__PURE__*/
createNamespace('img');
var image = /*#__PURE__*/
createComponent$E({
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
      "class": bem$D()
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
  createComponent: createComponent$F,
  bem: bem$E
} =
/*#__PURE__*/
createNamespace('input');
var input = /*#__PURE__*/
createComponent$F({
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
      "class": [bem$E(), {
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
  createComponent: createComponent$G,
  bem: bem$F
} =
/*#__PURE__*/
createNamespace('item');
var item = /*#__PURE__*/
createComponent$G({
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
      "class": [bem$F({}), { ...childStyles,
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
  createComponent: createComponent$H,
  bem: bem$G
} =
/*#__PURE__*/
createNamespace('item-divider');
var itemDivider = /*#__PURE__*/
createComponent$H({
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
      "class": [bem$G({
        sticky
      }), 'item']
    }, {
      "on": this.$listeners
    }]), [this.slots('start'), h("div", {
      "class": bem$G('inner')
    }, [h("div", {
      "class": bem$G('wrapper')
    }, [this.slots()]), this.slots('end')])]);
  }

});

const {
  createComponent: createComponent$I,
  bem: bem$H
} =
/*#__PURE__*/
createNamespace('label');
var label = /*#__PURE__*/
createComponent$I({
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
      "class": [bem$H(), {
        [`label-${position}`]: isDef(position),
        'label-no-animate': this.noAnimate
      }]
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const {
  createComponent: createComponent$J,
  bem: bem$I
} =
/*#__PURE__*/
createNamespace('list');
var list = /*#__PURE__*/
createComponent$J({
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
      "class": bem$I({
        [`lines-${lines}`]: isDef(lines),
        inset
      })
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const {
  createComponent: createComponent$K,
  bem: bem$J
} =
/*#__PURE__*/
createNamespace('list-header');
var listHeader = /*#__PURE__*/
createComponent$K({
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
      "class": bem$J({
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
  createComponent: createComponent$L,
  bem: bem$K
} =
/*#__PURE__*/
createNamespace('list-item');
var ListItem = /*#__PURE__*/
createComponent$L({
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
      "class": bem$K()
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
  createComponent: createComponent$M,
  bem: bem$L
} =
/*#__PURE__*/
createNamespace('list-view');
var listView = /*#__PURE__*/
createComponent$M({
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

  created() {
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
      "class": bem$L(),
      "ref": "viewport",
      "on": {
        "scroll": this.onScroll
      }
    }, [h("div", {
      "class": bem$L('spacer'),
      "style": {
        width: `${this.layout.geometry.width}px`,
        height: `${this.layout.geometry.height}px`
      }
    }), h("transition-group", {
      "attrs": {
        "tag": 'div'
      },
      "class": bem$L('content')
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
        created() {
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
  createComponent: createComponent$N,
  bem: bem$M
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
createComponent$N({
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
      "class": [bem$M({
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
const iosEnterAnimation$2 = (baseEl) => {
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
const iosLeaveAnimation$2 = (baseEl) => {
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
  createComponent: createComponent$O,
  bem: bem$N
} =
/*#__PURE__*/
createNamespace('loading');
var loading = /*#__PURE__*/
createComponent$O({
  mixins: [
  /*#__PURE__*/
  usePopup(),
  /*#__PURE__*/
  usePopupDuration()],
  props: {
    message: String,
    spinner: String
  },

  created() {
    const {
      mode
    } = this;
    this.$on('animation-enter', builder => {
      builder.build = mode === 'md' ? mdEnterAnimation$2 : iosEnterAnimation$2;
    });
    this.$on('animation-leave', builder => {
      builder.build = mode === 'md' ? mdLeaveAnimation$2 : iosLeaveAnimation$2;
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
      "class": bem$N({
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
      "class": bem$N('wrapper')
    }, [spinner && h("div", {
      "class": bem$N('spinner')
    }, [h(Spinner, {
      "attrs": {
        "type": spinner
      }
    })]), message && h("div", {
      "class": bem$N('content')
    }, [message])])]);
  }

});

const {
  createComponent: createComponent$P,
  bem: bem$O
} =
/*#__PURE__*/
createNamespace('note');
var note = /*#__PURE__*/
createComponent$P({
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
      "class": [bem$O(), createColorClasses(props.color)]
    }, data]), [slots()]);
  }

});

const {
  createComponent: createComponent$Q,
  bem: bem$P
} =
/*#__PURE__*/
createNamespace('page-indicator');
var pageIndicator = /*#__PURE__*/
createComponent$Q({
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
      "class": bem$P(),
      "ref": "indicator"
    }, [h("li", {
      "class": bem$P('item'),
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
        "class": bem$P('item', {
          active: value === item
        }),
        "on": {
          "click": () => this.onClick(item)
        }
      }, [item]);
    }), h("li", {
      "class": bem$P('item'),
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
const iosEnterAnimation$3 = (baseEl, ev) => {
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
const iosLeaveAnimation$3 = (baseEl) => {
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
  createComponent: createComponent$R,
  bem: bem$Q
} =
/*#__PURE__*/
createNamespace('popover');
var popover = /*#__PURE__*/
createComponent$R({
  mixins: [
  /*#__PURE__*/
  usePopup()],

  created() {
    const {
      mode
    } = this;
    this.$on('animation-enter', builder => {
      builder.build = mode === 'md' ? mdEnterAnimation$3 : iosEnterAnimation$3;
    });
    this.$on('animation-leave', builder => {
      builder.build = mode === 'md' ? mdLeaveAnimation$3 : iosLeaveAnimation$3;
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
      "class": bem$Q('wrapper')
    }, [h("div", {
      "class": bem$Q('arrow')
    }), h("div", {
      "class": bem$Q('content')
    }, [this.slots()])])]);
  }

});

const {
  createComponent: createComponent$S,
  bem: bem$R
} =
/*#__PURE__*/
createNamespace('popup');
const CONTENT_ELEMENT$1 = 'content';
var popupLegacy = /*#__PURE__*/
createComponent$S({
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
      "class": bem$R()
    }, [h("div", {
      "attrs": {
        "role": "dialog"
      },
      "class": bem$R(CONTENT_ELEMENT$1),
      "ref": CONTENT_ELEMENT$1
    }, [this.slots()])]);
  }

});

/**
 * iOS Modal Enter Animation
 */
const iosEnterAnimation$4 = (baseEl) => {
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
const iosLeaveAnimation$4 = (baseEl) => {
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
  createComponent: createComponent$T,
  bem: bem$S
} =
/*#__PURE__*/
createNamespace('popup');
var popup = /*#__PURE__*/
createComponent$T({
  mixins: [
  /*#__PURE__*/
  usePopup()],

  created() {
    const {
      mode
    } = this;
    this.$on('animation-enter', builder => {
      builder.build = mode === 'md' ? mdEnterAnimation$4 : iosEnterAnimation$4;
    });
    this.$on('animation-leave', builder => {
      builder.build = mode === 'md' ? mdLeaveAnimation$4 : iosLeaveAnimation$4;
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
      "class": bem$S()
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
      "class": bem$S('wrapper')
    }, [this.slots()])]);
  }

});

const {
  createComponent: createComponent$U,
  bem: bem$T
} =
/*#__PURE__*/
createNamespace('progress');
var progressBar = /*#__PURE__*/
createComponent$U({
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
      "class": bem$T(),
      "style": style
    }, [children]);
  }

});

const {
  createComponent: createComponent$V,
  bem: bem$U
} =
/*#__PURE__*/
createNamespace('progress-circular');
var progressCircular = /*#__PURE__*/
createComponent$V({
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
      "class": [bem$U(), classes],
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
  createComponent: createComponent$W,
  bem: bem$V
} =
/*#__PURE__*/
createNamespace('radio');
var radio = /*#__PURE__*/
createComponent$W({
  mixins: [
  /*#__PURE__*/
  useCheckItem(NAMESPACE$c),
  /*#__PURE__*/
  useRipple(),
  /*#__PURE__*/
  useColor()],

  data() {
    return {
      inItem: false
    };
  },

  mounted() {
    this.inItem = this.$el.closest('.line-item') !== null;
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
      "class": [bem$V({
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
      "class": bem$V('icon')
    }, [h("div", {
      "class": bem$V('inner')
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
  createComponent: createComponent$X,
  bem: bem$W
} =
/*#__PURE__*/
createNamespace('radio-button-group');
var radioButtonGroup = /*#__PURE__*/
createComponent$X({
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
      "class": bem$W()
    }, [this.slots()]);
  }

});

const {
  createComponent: createComponent$Y,
  bem: bem$X
} =
/*#__PURE__*/
createNamespace('radio-indicator');
var RadioIndicator = /*#__PURE__*/
createComponent$Y({
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
      "class": [bem$X({
        checked: props.checked,
        disabled: props.disabled
      }), data.class]
    }, data]));
  }

});

const NAMESPACE$e = 'RadioButtonGroup';
const {
  createComponent: createComponent$Z,
  bem: bem$Y
} =
/*#__PURE__*/
createNamespace('radio-button');
var radioButton = /*#__PURE__*/
createComponent$Z({
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
      "class": bem$Y()
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
  createComponent: createComponent$_,
  bem: bem$Z
} =
/*#__PURE__*/
createNamespace('range');

function clamp(value, min, max) {
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
    "class": [bem$Z('knob-handle', {
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
    "class": bem$Z('pin'),
    "attrs": {
      "role": "presentation"
    }
  }, [Math.round(value)]), h("div", {
    "class": bem$Z('knob'),
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

  return clamp(min, value, max);
};

const valueToRatio = (value, min, max) => {
  return clamp(0, (value - min) / (max - min), 1);
};

var range = /*#__PURE__*/
createComponent$_({
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

  created() {
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
      return clamp(this.min, value, this.max);
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
        this.ratioA = clamp(0, this.ratioA + step, 1);
      } else {
        this.ratioB = clamp(0, this.ratioB + step, 1);
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

      let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);

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
      let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);

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
      "class": bem$Z({
        disabled,
        pressed: pressedKnob !== undefined,
        'has-pin': pin
      }),
      "on": {
        "focus": this.onFocus,
        "blur": this.onBlur
      }
    }, [this.slots('start'), h("div", {
      "class": bem$Z('slider'),
      "ref": "rangeSlider"
    }, [ticks.map(tick => h("div", {
      "style": tickStyle(tick),
      "attrs": {
        "role": "presentation"
      },
      "class": bem$Z('tick', {
        active: tick.active
      })
    })), h("div", {
      "class": bem$Z('bar'),
      "attrs": {
        "role": "presentation"
      }
    }), h("div", {
      "class": bem$Z('bar', {
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

const {
  createComponent: createComponent$$,
  bem: bem$_
} =
/*#__PURE__*/
createNamespace('row');
var row = /*#__PURE__*/
createComponent$$({
  functional: true,

  render(h, {
    data,
    slots
  }) {
    return h("div", helper([{
      "class": bem$_()
    }, data]), [slots()]);
  }

});

const {
  createComponent: createComponent$10,
  bem: bem$$
} =
/*#__PURE__*/
createNamespace('slider');
var slider = /*#__PURE__*/
createComponent$10({
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

  created() {
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
      "class": bem$$({
        vertical
      }),
      "style": containerStyle,
      "ref": "slider"
    }, [h("div", {
      "class": bem$$('container'),
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
      "class": bem$$('bar'),
      "style": barStyle,
      "on": {
        "click": this.onSliderClick
      }
    }), h("div", {
      "class": bem$$('button', {
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

const {
  createComponent: createComponent$11,
  bem: bem$10
} =
/*#__PURE__*/
createNamespace('stepper');
var stepper = /*#__PURE__*/
createComponent$11({
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
      "class": bem$10()
    }, [h("span", {
      "class": bem$10('button', {
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
      "class": bem$10('button', {
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
  createComponent: createComponent$12,
  bem: bem$11
} =
/*#__PURE__*/
createNamespace('switch-group');
var switchGroup = /*#__PURE__*/
createComponent$12({
  mixins: [
  /*#__PURE__*/
  useGroup(NAMESPACE$f)],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$11()
    }, [this.slots()]);
  }

});

const {
  createComponent: createComponent$13,
  bem: bem$12
} =
/*#__PURE__*/
createNamespace('switch-indicator');
var switchIndicator = /*#__PURE__*/
createComponent$13({
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
      "class": bem$12({
        'is-checked': props.checked,
        'is-disabled': props.disabled
      })
    }, data]), [h("div", {
      "class": bem$12('thumb')
    }, [slots()])]);
  }

});

const NAMESPACE$g = 'SwitchGroup';
const {
  createComponent: createComponent$14,
  bem: bem$13
} =
/*#__PURE__*/
createNamespace('switch');
let gesture;
var _switch = /*#__PURE__*/
createComponent$14({
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

    disabledChanged() {
      // this.emitStyle();
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
  },

  destroyed() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  },

  watch: {
    disabled() {
      this.disabledChanged();
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
      "class": [bem$13({
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
      "class": bem$13('icon')
    }, [h("div", {
      "class": bem$13('inner')
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
  createComponent: createComponent$15,
  bem: bem$14
} =
/*#__PURE__*/
createNamespace('tab-bar');
var tabBar = /*#__PURE__*/
createComponent$15({
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
      "class": bem$14({
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
  createComponent: createComponent$16,
  bem: bem$15
} =
/*#__PURE__*/
createNamespace('tab-button');
var tabButton = /*#__PURE__*/
createComponent$16({
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
      "class": [bem$15({
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
  createComponent: createComponent$17,
  bem: bem$16
} =
/*#__PURE__*/
createNamespace('tab');
var tab = /*#__PURE__*/
createComponent$17({
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
      "class": [bem$16({
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
  createComponent: createComponent$18,
  bem: bem$17
} =
/*#__PURE__*/
createNamespace('tabs');
var tabs = /*#__PURE__*/
createComponent$18({
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
      "class": bem$17()
    }, {
      "on": this.$listeners
    }]), [this.slots('top'), h("div", {
      "class": bem$17('inner')
    }, [this.slots()]), this.slots('bottom')]);
  }

});

const {
  createComponent: createComponent$19,
  bem: bem$18
} =
/*#__PURE__*/
createNamespace('textarea');
var textarea = /*#__PURE__*/
createComponent$19({
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

  created() {// this.$emit('pressAndHold');
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
      "class": bem$18()
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
  createComponent: createComponent$1a,
  bem: bem$19
} =
/*#__PURE__*/
createNamespace('thumbnail');
var thumbnail = /*#__PURE__*/
createComponent$1a({
  functional: true,

  render(h, {
    data,
    slots
  }) {
    return h("div", helper([{
      "class": bem$19()
    }, data]), [slots()]);
  }

});

/**
 * iOS Toast Enter Animation
 */
const iosEnterAnimation$5 = (baseEl, position) => {
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
const iosLeaveAnimation$5 = (baseEl, position) => {
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
  createComponent: createComponent$1b,
  bem: bem$1a
} =
/*#__PURE__*/
createNamespace('toast');
var toast = /*#__PURE__*/
createComponent$1b({
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

  created() {
    const {
      mode
    } = this;
    this.$on('animation-enter', builder => {
      builder.build = mode === 'md' ? mdEnterAnimation$5 : iosEnterAnimation$5;
      builder.options = this.position;
    });
    this.$on('animation-leave', builder => {
      builder.build = mode === 'md' ? mdLeaveAnimation$5 : iosLeaveAnimation$5;
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
      "class": [bem$1a()]
    }, {
      "on": this.$listeners
    }]), [h("div", {
      "class": bem$1a('wrapper', {
        [position]: true
      })
    }, [h("div", {
      "class": bem$1a('container')
    }, [h("div", {
      "class": bem$1a('content')
    }, [h("div", {
      "class": bem$1a('message')
    }, [this.message]), h("div")])])])]);
  }

});

const {
  createComponent: createComponent$1c,
  bem: bem$1b
} =
/*#__PURE__*/
createNamespace('toolbar');
var toolbar = /*#__PURE__*/
createComponent$1c({
  mixins: [
  /*#__PURE__*/
  useColor()],
  props: {},

  render() {
    const h = arguments[0];
    return h("div", helper([{
      "class": bem$1b()
    }, {
      "on": this.$listeners
    }]), [h("div", {
      "class": bem$1b('background')
    }), h("div", {
      "class": bem$1b('container')
    }, [this.slots('start'), this.slots('secondary'), h("div", {
      "class": bem$1b('content')
    }, [this.slots()]), this.slots('primary'), this.slots('end')])]);
  }

});

const {
  createComponent: createComponent$1d,
  bem: bem$1c
} =
/*#__PURE__*/
createNamespace('title');
var title = /*#__PURE__*/
createComponent$1d({
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
      "class": bem$1c({
        [size]: isDef(size)
      })
    }, {
      "on": this.$listeners
    }]), [h("div", {
      "class": bem$1c('inner')
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
const iosEnterAnimation$6 = (baseEl) => {
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
const iosLeaveAnimation$6 = (baseEl) => {
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

function inserted$1(el, binding) {
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
function update$2(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$2(el);
    }
    inserted$1(el, binding);
}
const Hover = {
    inserted: inserted$1,
    unbind: unbind$2,
    update: update$2,
};

const {
  createComponent: createComponent$1e,
  bem: bem$1d
} =
/*#__PURE__*/
createNamespace('tooltip');
var tooltip = /*#__PURE__*/
createComponent$1e({
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

  created() {
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
        return iosEnterAnimation$6(baseEl);
      };
    });
    this.$on('animation-leave', builder => {
      builder.build = iosLeaveAnimation$6;
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
      "class": bem$1d({
        translucent: this.translucent
      })
    }, {
      "on": this.$listeners
    }]), [h("div", {
      "class": bem$1d('arrow'),
      "attrs": {
        "x-arrow": true
      }
    }), h("div", {
      "class": bem$1d('content')
    }, [this.slots() || text])]);
  }

});

// Auto Generated

var components = /*#__PURE__*/Object.freeze({
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
  Note: note,
  Overlay: Overlay,
  PageIndicator: pageIndicator,
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
  Row: row,
  Slider: slider,
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

function bind$1(el, binding) {
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
    bind: bind$1,
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
function bind$2(el, binding) {
    if (binding.value === false)
        return;
    const vAutoRepeat = createAutoRepeat(el, binding.value);
    el.vAutoRepeat = vAutoRepeat;
}
function update$3(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    const { vAutoRepeat } = el;
    if (!vAutoRepeat) {
        bind$2(el, binding);
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
    bind: bind$2,
    update: update$3,
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
function bind$3(el, binding) {
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
function update$4(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$5(el);
    }
    bind$3(el, binding);
}
const ClickOutside = {
    bind: bind$3,
    unbind: unbind$5,
    update: update$4,
};

function inserted$2(el, binding) {
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
function update$5(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$6(el);
    }
    inserted$2(el, binding);
}
const Gesture = {
    inserted: inserted$2,
    unbind: unbind$6,
    update: update$5,
};

function inserted$3(el, binding) {
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
function update$6(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$7(el);
    }
    inserted$3(el, binding);
}
const Intersect = {
    inserted: inserted$3,
    update: update$6,
    unbind: unbind$7,
};

function inserted$4(el, binding) {
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
function update$7(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$8(el);
    }
    inserted$4(el, binding);
}
const Mutate = {
    inserted: inserted$4,
    unbind: unbind$8,
    update: update$7,
};

function inserted$5(el, binding) {
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
function update$8(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$9(el);
    }
    inserted$5(el, binding);
}
const Resize = {
    inserted: inserted$5,
    unbind: unbind$9,
    update: update$8,
};

function inserted$6(el, binding) {
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
function update$9(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$a(el);
    }
    inserted$6(el, binding);
}
const Scroll = {
    inserted: inserted$6,
    unbind: unbind$a,
    update: update$9,
};

const clamp$1 = (num, min, max) => {
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
        onEndHandler(shouldComplete, (stepValue <= 0) ? 0.01 : clamp$1(0, stepValue, 0.9999), realDur);
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

function inserted$7(el, binding) {
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
function update$a(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$b(el);
    }
    inserted$7(el, binding);
}
const SwipeBack = {
    inserted: inserted$7,
    unbind: unbind$b,
    update: update$a,
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
function bind$4(el, binding) {
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
function update$b(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$c(el);
    }
    bind$4(el, binding);
}
const Touch = {
    bind: bind$4,
    unbind: unbind$c,
    update: update$b,
};

function createTrigger() {
    return {};
}
function bind$5(el, binding) {
    el.vTrigger = createTrigger();
}
function unbind$d(el) {
    if (!el.vTrigger)
        return;
    delete el.vTrigger;
}
const Trigger = {
    bind: bind$5,
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
  Resize: Resize,
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
        created() {
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

function useComponent() {
    return createMixins({
        created() {
            const injections = createSlots(this, false);
            this.hasSlot = injections.hasSlot;
            this.slots = injections.slots;
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
  useComponent: useComponent,
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
            components,
            directives,
        });
    }
    return {
        install(Vue, opts) {
            install(Vue, {
                components,
                directives,
                ...opts,
            });
        },
        components,
        directives,
        mixins,
        version: "1.0.0-alpha",
    };
}
var index = /*#__PURE__*/ defaulExport();

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
exports.Mutate = Mutate;
exports.Note = note;
exports.Overlay = Overlay;
exports.PageIndicator = pageIndicator;
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
exports.Remote = Remote;
exports.Resize = Resize;
exports.Ripple = Ripple;
exports.Row = row;
exports.Scroll = Scroll;
exports.Skyline = Skyline;
exports.Slider = slider;
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
exports.default = index;
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
exports.useComponent = useComponent;
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
exports.useTransition = useTransition;
exports.useTreeItem = useTreeItem;
exports.useTrigger = useTrigger;
