'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

const camelizeRE = /-(\w)/g;
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
const hyphenateRE = /\B([A-Z])/g;
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
const isObject = (val) => val !== null && typeof val === 'object';
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
                data[key] = isObject(val)
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
    const $slots = context[slotsKey];
    const $scopedSlots = (context[scopedSlotsKey] || context[attrsKey] || {});
    return {
        hasSlot: (name = 'default') => {
            return !!$scopedSlots[name] || !!$slots[name];
        },
        slots: (name = 'default', ctx, patch) => {
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
                    vnode.data = mergeData(vnode.data, { class: slotclass });
                    if (!patch)
                        return;
                    vnode.data = mergeData(vnode.data, isFunction(patch) ? patch(vnode.data, index) : patch);
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

function useComponent() {
    return createMixins({
        created() {
            const injections = createSlots(this, false);
            this.hasSlot = injections.hasSlot;
            this.slots = injections.slots;
        },
    });
}

const strategies = Vue.config.optionMergeStrategies;
strategies.shouldRender; // default strategy
strategies.beforeRender = strategies.created;
strategies.afterRender = strategies.created;
function useRender(keep = true) {
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

function createModeClasses(mode) {
    if (!isString(mode) || !mode)
        return undefined;
    return {
        [mode]: true,
    };
}
function useMode() {
    return createMixins({
        inject: {
            providedMode: {
                from: 'mode',
                default: config.get('mode', 'ios'),
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
        provide() {
            return {
                mode: this.mode,
            };
        },
        afterRender(vnode) {
            if (!vnode.data)
                return;
            vnode.data.staticClass = `${this.mode} ${vnode.data.staticClass || ''}`.trim();
        },
    });
}

function install$1(Vue) {
    const { name } = this;
    Vue.component(name, this);
    Vue.component(camelize(`-${name}`), this);
}
function createComponent(name) {
    return function (sfc) {
        sfc.name = name;
        sfc.install = install$1;
        if (sfc.functional) {
            const { render } = sfc;
            sfc.render = (h, ctx) => render.call(undefined, h, unifySlots(ctx));
        }
        else {
            sfc.mixins = sfc.mixins || [];
            sfc.mixins.push(useComponent(), useRender(), useMode());
        }
        return sfc;
    };
}

function createNamespace(name, prefix = 'line') {
    name = `${prefix}-${name}`;
    return [createComponent(name), createBEM(name)];
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
const [createComponent$1, bem] = createNamespace('action-group');
var actionGroup = createComponent$1({
  mixins: [useGroup(NAMESPACE)],

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
const [createComponent$2, bem$1] = createNamespace('action');
var action = createComponent$2({
  mixins: [useGroupItem(NAMESPACE$1), useRipple()],
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

const [createComponent$3, bem$2] = createNamespace('overlay');

const now$1 = ev => ev.timeStamp || Date.now();

var Overlay = createComponent$3({
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

const [createComponent$4, bem$3] = createNamespace('action-sheet');
var actionSheet = createComponent$4({
  mixins: [usePopup()],
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

const [createComponent$5, bem$4] = createNamespace('alert');
const isCancel = role => {
  return role === 'cancel' || role === 'overlay';
};
var alert = createComponent$5({
  mixins: [usePopup()],
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

const [createComponent$6, bem$5] = createNamespace('app');
var app = createComponent$6({
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

const [createComponent$7, bem$6] = createNamespace('avatar');
var avatar = createComponent$7({
  functional: true,

  render(h, ctx) {
    return h("div", helper([{
      "class": bem$6()
    }, ctx.data]), [ctx.slots()]);
  }

});

// TODO:
// remove color validator
const COLORS = [
    'primary',
    'secondary',
    'tertiary',
    'success',
    'warning',
    'danger',
    'light',
    'medium',
    'dark',
];
function createColorClasses(color) {
    if (!isString(color) || !color)
        return undefined;
    return {
        'line-color': true,
        [`line-color-${color}`]: true,
    };
}
function getClassList(color) {
    if (!color)
        return [];
    return Object.keys(color).filter(c => !!color[c]);
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
            color: {
                type: String,
                validator(val) {
                    return COLORS.includes(val);
                },
            },
        },
        afterRender(vnode) {
            if (!vnode || !vnode.data)
                return;
            if (!isString(this.color) || !this.color)
                return;
            const colorClasses = getClassList(createColorClasses(this.color));
            vnode.data.staticClass = `${vnode.data.staticClass || ''} ${colorClasses.join(' ')} `.trim();
        },
    });
}

const [createComponent$8, bem$7] = createNamespace('badge');
var badge = createComponent$8({
  mixins: [useColor()],

  render() {
    const h = arguments[0];
    return h("div", helper([{
      "class": bem$7()
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const [createComponent$9, bem$8] = createNamespace('busy-indicator');
var busyIndicator = createComponent$9({
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
const [createComponent$a, bem$9] = createNamespace('button-group');
var buttonGroup = createComponent$a({
  mixins: [useGroup(NAMESPACE$2)],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$9()
    }, [this.slots()]);
  }

});

const NAMESPACE$3 = 'ButtonGroup';
const [createComponent$b, bem$a] = createNamespace('button');
var button = createComponent$b({
  mixins: [useColor(), useGroupItem(NAMESPACE$3)],
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

const [createComponent$c, bem$b] = createNamespace('card-content');
var cardContent = createComponent$c({
  mixins: [useColor()],

  render() {
    const h = arguments[0];
    return h("div", helper([{
      "class": bem$b()
    }, {
      "on": this.$listeners
    }]), [this.slots()]);
  }

});

const [createComponent$d, bem$c] = createNamespace('card-header');
var cardHeader = createComponent$d({
  mixins: [useColor()],
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

const [createComponent$e, bem$d] = createNamespace('card-subtitle');
var cardSubtitle = createComponent$e({
  mixins: [useColor()],

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

const [createComponent$f, bem$e] = createNamespace('card-title');
var cardTitle = createComponent$f({
  mixins: [useColor()],

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

const [createComponent$g, bem$f] = createNamespace('card');
var card = createComponent$g({
  mixins: [useColor()],
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

const [createComponent$h, bem$g] = createNamespace('cell-group');
var cellGroup = createComponent$h({
  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$g()
    }, [this.slots()]);
  }

});

const [createComponent$i, bem$h] = createNamespace('font-icon');

function getDefaultText(slots) {
  const nodes = slots();
  const text = nodes && nodes[0].text || '';
  return text.trim();
}

var FontIcon = createComponent$i({
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

const [createComponent$j, bem$i] = createNamespace('svg-icon');

function getDefaultText$1(slots) {
  const nodes = slots();
  const text = nodes && nodes[0].text || '';
  return text.trim();
}

var SvgIcon = createComponent$j({
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

const [createComponent$k] = createNamespace('icon');
var Icon = createComponent$k({
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

const [createComponent$l, bem$j] = createNamespace('cell');
var cell = createComponent$l({
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
const [createComponent$m, bem$k] = createNamespace('check-box-group');
var checkBoxGroup = createComponent$m({
  mixins: [useCheckGroup(NAMESPACE$4)],
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

const [createComponent$n, bem$l] = createNamespace('check-indicator');
let path;
var CheckIndicator = createComponent$n({
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
const [createComponent$o, bem$m] = createNamespace('check-box');
var checkBox = createComponent$o({
  mixins: [useCheckItem(NAMESPACE$5), useRipple(), useColor()],
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

const [createComponent$p, bem$n] = createNamespace('chip');
var chip = createComponent$p({
  mixins: [useColor()],
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

const win = window;
const SUPPORTS_VARS = !!(win.CSS && win.CSS.supports && win.CSS.supports('--a: 0'));
const BREAKPOINTS = ['', 'xs', 'sm', 'md', 'lg', 'xl'];
const [createComponent$q, bem$o] = createNamespace('col');
var col = createComponent$q({
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
      : SUPPORTS_VARS ? `calc(calc(${columns} / var(--ion-grid-columns, 12)) * 100%)` // Convert the columns to a percentage by dividing by the total number
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


      const amount = SUPPORTS_VARS // If CSS supports variables we should use the grid columns var
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
const [createComponent$r, bem$p] = createNamespace('collapse-item');
var collapseItem = createComponent$r({
  mixins: [useCheckItem(NAMESPACE$6)],
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
const [createComponent$s, bem$q] = createNamespace('collapse');
var collapse = createComponent$s({
  mixins: [useCheckGroup(NAMESPACE$7)],
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

const [createComponent$t, bem$r] = createNamespace('content');

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

var content = createComponent$t({
  mixins: [useColor()],
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

const [createComponent$u, bem$s] = createNamespace('dialog');
const CONTENT_ELEMENT = 'content';
var dialog = createComponent$u({
  mixins: [usePopup()],

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
const [createComponent$v, bem$t] = createNamespace('fab-group');
var FabGroup = createComponent$v({
  mixins: [useGroup(NAMESPACE$8), useLazy('visible'), useModel('visible')],
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

const [createComponent$w, bem$u] = createNamespace('fab');
const FAB_SIDES = ['start', 'end', 'top', 'bottom'];
var fab = createComponent$w({
  mixins: [useModel('activated'), useClickOutside()],

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
const [createComponent$x, bem$v] = createNamespace('fab-button');
var fabButton = createComponent$x({
  mixins: [useColor(), useGroupItem(NAMESPACE$9)],
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

const [createComponent$y, bem$w] = createNamespace('footer');
var footer = createComponent$y({
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

const [createComponent$z, bem$x] = createNamespace('grid');
var grid = createComponent$z({
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

const [createComponent$A, bem$y] = createNamespace('header');
var header = createComponent$A({
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

const [createComponent$B, bem$z] = createNamespace('check-group');
var checkGroup = createComponent$B({
  mixins: [useCheckGroupWithModel('Group')],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$z()
    }, [this.slots()]);
  }

});

const [createComponent$C, bem$A] = createNamespace('check-item');
var checkItem = createComponent$C({
  mixins: [useCheckItemWithModel('Group')],

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

const [createComponent$D, bem$B] = createNamespace('lazy');
var lazy = createComponent$D({
  mixins: [useLazy()],

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$B()
    }, [this.slots()]);
  }

});

var CheckState;
(function (CheckState) {
    // The checkbox is unchecked.
    CheckState[CheckState["Unchecked"] = -1] = "Unchecked";
    // The checkbox is partially checked. This state is only used when tristate is enabled.
    CheckState[CheckState["PartiallyChecked"] = 0] = "PartiallyChecked";
    // The checkbox is checked.
    CheckState[CheckState["Checked"] = 1] = "Checked";
})(CheckState || (CheckState = {}));
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
                            ? CheckState.Checked
                            : CheckState.Unchecked;
                    }
                    let hasUnchecked = false;
                    let hasPartiallyChecked = false;
                    let hasChecked = false;
                    for (const item of this.items) {
                        hasUnchecked = hasUnchecked || item.checkState === CheckState.Unchecked;
                        hasPartiallyChecked = hasPartiallyChecked || item.checkState === CheckState.PartiallyChecked;
                        hasChecked = hasChecked || item.checkState === CheckState.Checked;
                        if (hasPartiallyChecked)
                            return CheckState.PartiallyChecked;
                        if (hasUnchecked && hasChecked)
                            return CheckState.PartiallyChecked;
                    }
                    // all unchecked
                    if (hasUnchecked)
                        return CheckState.Unchecked;
                    // all checked
                    if (hasChecked)
                        return CheckState.Checked;
                    console.error('internal error');
                    return CheckState.Unchecked;
                },
                set(val) {
                    if (!this.tristate) {
                        this.checked = val === CheckState.Checked;
                        return;
                    }
                    if (val === CheckState.PartiallyChecked) {
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
                this.checked = val === CheckState.Checked;
            },
            checked(val) {
                if (!this.tristate)
                    return;
                this.checkState = val
                    ? CheckState.Checked
                    : CheckState.Unchecked;
            },
        },
        methods: {
            toggle() {
                const nextCheckState = this.checkState === CheckState.Checked
                    ? CheckState.Unchecked
                    : CheckState.Checked;
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

const [createComponent$E, bem$C] = createNamespace('tree-item');
var treeItem = createComponent$E({
  mixins: [useTreeItem('Tree')],
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

const [createComponent$F, bem$D] = createNamespace('img');
var image = createComponent$F({
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

const [createComponent$G, bem$E] = createNamespace('input');
var input = createComponent$G({
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

const [createComponent$H, bem$F] = createNamespace('item');
var item = createComponent$H({
  mixins: [useColor()],
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

const [createComponent$I, bem$G] = createNamespace('item-divider');
var itemDivider = createComponent$I({
  mixins: [useColor()],
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

const [createComponent$J, bem$H] = createNamespace('label');
var label = createComponent$J({
  mixins: [useColor()],
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

const [createComponent$K, bem$I] = createNamespace('list');
var list = createComponent$K({
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

const [createComponent$L, bem$J] = createNamespace('list-header');
var listHeader = createComponent$L({
  mixins: [useColor()],
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
const [createComponent$M, bem$K] = createNamespace('list-item');
var ListItem = createComponent$M({
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
const [createComponent$N, bem$L] = createNamespace('list-view');
var listView = createComponent$N({
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

const [createComponent$O, bem$M] = createNamespace('spinner');

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

var Spinner = createComponent$O({
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

const [createComponent$P, bem$N] = createNamespace('loading');
var loading = createComponent$P({
  mixins: [usePopup(), usePopupDuration()],
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

const [createComponent$Q, bem$O] = createNamespace('note');
var note = createComponent$Q({
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

const [createComponent$R, bem$P] = createNamespace('page-indicator');
var pageIndicator = createComponent$R({
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

const [createComponent$S, bem$Q] = createNamespace('popover');
var popover = createComponent$S({
  mixins: [usePopup()],

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

const [createComponent$T, bem$R] = createNamespace('popup');
const CONTENT_ELEMENT$1 = 'content';
var popupLegacy = createComponent$T({
  mixins: [usePopup()],

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

const [createComponent$U, bem$S] = createNamespace('popup');
var popup = createComponent$U({
  mixins: [usePopup()],

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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject$1 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject$1(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$1(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject$1(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$1(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty$1 = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty$1.call(it, key);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject$1(document$1) && isObject$1(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject$1(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap$1 = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode:  'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys$1 = shared('keys');

var sharedKey = function (key) {
  return keys$1[key] || (keys$1[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$2 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = new WeakMap$2();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var path$1 = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path$1[namespace]) || aFunction(global_1[namespace])
    : path$1[namespace] && path$1[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

var UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var max$1 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max$1(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

const [createComponent$V, bem$T] = createNamespace('progress');
var progressBar = createComponent$V({
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
      style.height = `${this.height.toString().replace(/px/, '')}px`;
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

const [createComponent$W, bem$U] = createNamespace('progress-circular');
var progressCircular = createComponent$W({
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
const [createComponent$X, bem$V] = createNamespace('radio');
var radio = createComponent$X({
  mixins: [useCheckItem(NAMESPACE$c), useRipple(), useColor()],

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
const [createComponent$Y, bem$W] = createNamespace('radio-button-group');
var radioButtonGroup = createComponent$Y({
  mixins: [useCheckGroup(NAMESPACE$d)],
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

const [createComponent$Z, bem$X] = createNamespace('radio-indicator');
var RadioIndicator = createComponent$Z({
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
const [createComponent$_, bem$Y] = createNamespace('radio-button');
var radioButton = createComponent$_({
  mixins: [useCheckItem(NAMESPACE$e), useRipple()],
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

const [createComponent$$, bem$Z] = createNamespace('range');

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

var range = createComponent$$({
  mixins: [useColor()],
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

const [createComponent$10, bem$_] = createNamespace('row');
var row = createComponent$10({
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

const [createComponent$11, bem$$] = createNamespace('slider');
var slider = createComponent$11({
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

const [createComponent$12, bem$10] = createNamespace('stepper');
var stepper = createComponent$12({
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
const [createComponent$13, bem$11] = createNamespace('switch-group');
var switchGroup = createComponent$13({
  extends: useGroup(NAMESPACE$f),

  render() {
    const h = arguments[0];
    return h("div", {
      "class": bem$11()
    }, [this.slots()]);
  }

});

const [createComponent$14, bem$12] = createNamespace('switch-indicator');
var switchIndicator = createComponent$14({
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
const [createComponent$15, bem$13] = createNamespace('switch');
let gesture;
var _switch = createComponent$15({
  mixins: [useCheckItem(NAMESPACE$g), useColor()],

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
const [createComponent$16, bem$14] = createNamespace('tab-bar');
var tabBar = createComponent$16({
  mixins: [useCheckGroupWithModel(NAMESPACE$h), useColor()],
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
const [createComponent$17, bem$15] = createNamespace('tab-button');
var tabButton = createComponent$17({
  mixins: [useCheckItemWithModel(NAMESPACE$i), useRipple()],
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
const [createComponent$18, bem$16] = createNamespace('tab');
var tab = createComponent$18({
  mixins: [useCheckItemWithModel(NAMESPACE$j)],
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
const [createComponent$19, bem$17] = createNamespace('tabs');
var tabs = createComponent$19({
  mixins: [useCheckGroupWithModel(NAMESPACE$k)],
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

const [createComponent$1a, bem$18] = createNamespace('textarea');
var textarea = createComponent$1a({
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

const [createComponent$1b, bem$19] = createNamespace('thumbnail');
var thumbnail = createComponent$1b({
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

const [createComponent$1c, bem$1a] = createNamespace('toast');
var toast = createComponent$1c({
  mixins: [usePopup(), usePopupDuration(), useColor()],
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

const [createComponent$1d, bem$1b] = createNamespace('toolbar');
var toolbar = createComponent$1d({
  mixins: [useColor()],
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

const [createComponent$1e, bem$1c] = createNamespace('title');
var title = createComponent$1e({
  mixins: [useColor()],
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

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce$1 = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction$1(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends$1({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends$1({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction$1(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update$2() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends$1({}, attributes, data.attributes);
  data.styles = _extends$1({}, styles, data.styles);
  data.arrowStyles = _extends$1({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends$1({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends$1({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends$1({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce$1(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends$1({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends$1({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends$1({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends$1({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction$1(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update$2.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

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
function update$3(el, binding) {
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
    update: update$3,
};

const [createComponent$1f, bem$1d] = createNamespace('tooltip');
var Tooltip = createComponent$1f({
  mixins: [useColor(), usePopup({
    disableScroll: false
  }), usePopupDuration(), usePopupDelay(), useTrigger()],
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
        this.popper = new Popper($triggerEl, $el, {
          placement: placement,
          positionFixed: true,
          eventsEnabled: false
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
  Tooltip: Tooltip
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
function update$4(el, binding) {
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
function update$5(el, binding) {
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
    update: update$5,
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
function update$6(el, binding) {
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
    update: update$6,
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
function update$7(el, binding) {
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
    update: update$7,
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
function update$8(el, binding) {
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
    update: update$8,
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
function update$9(el, binding) {
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
    update: update$9,
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
function update$a(el, binding) {
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
    update: update$a,
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
function update$b(el, binding) {
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
    update: update$b,
};

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

class TooltipController {
    constructor() {
        this.factory = createFactory(Tooltip);
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

const ctrl = new TooltipController();
function inserted$8(el, binding) {
    if (binding.value === false)
        return;
    const tooltip = ctrl.create({
        text: binding.value,
        delay: 300,
        trigger: el,
        openOnHover: true,
    });
    tooltip.destroyWhenClose = false;
    el.vTooltip = {
        tooltip,
        destroy: () => {
            tooltip.destroyWhenClose = true;
            tooltip.close() || tooltip.$destroy();
        },
    };
}
function unbind$c(el, binding) {
    const { vTooltip } = el;
    if (!vTooltip)
        return;
    vTooltip.destroy();
    delete el.vTooltip;
}
function update$c(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.value === false) {
        unbind$c(el);
        return;
    }
    const { vTooltip } = el;
    vTooltip.tooltip.text = binding.value;
}
const Tooltip$1 = {
    inserted: inserted$8,
    unbind: unbind$c,
    update: update$c,
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
function unbind$d(el) {
    const { vTouch } = el;
    if (!vTouch)
        return;
    vTouch.destroy();
    delete el.vTouch;
}
function update$d(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    if (binding.oldValue) {
        unbind$d(el);
    }
    bind$4(el, binding);
}
const Touch = {
    bind: bind$4,
    unbind: unbind$d,
    update: update$d,
};

function createTrigger() {
    return {};
}
function bind$5(el, binding) {
    el.vTrigger = createTrigger();
}
function unbind$e(el) {
    if (!el.vTrigger)
        return;
    delete el.vTrigger;
}
const Trigger = {
    bind: bind$5,
    unbind: unbind$e,
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
  Tooltip: Tooltip$1,
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
  getClassList: getClassList,
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
  get CheckState () { return CheckState; },
  useTreeItem: useTreeItem,
  isVue: isVue,
  useTrigger: useTrigger
});

// export * from 'skyline/directives';
// export * from 'skyline/mixins';
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
/* eslint-disable-next-line */
var index = /*#__PURE__*/ defaulExport();

exports.Action = action;
exports.ActionGroup = actionGroup;
exports.ActionSheet = actionSheet;
exports.Alert = alert;
exports.App = app;
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
exports.Col = col;
exports.Collapse = collapse;
exports.CollapseItem = collapseItem;
exports.Content = content;
exports.Dialog = dialog;
exports.Fab = fab;
exports.FabButton = fabButton;
exports.FabGroup = FabGroup;
exports.FontIcon = FontIcon;
exports.Footer = footer;
exports.Grid = grid;
exports.Header = header;
exports.Icon = Icon;
exports.Image = image;
exports.Input = input;
exports.Item = item;
exports.ItemDivider = itemDivider;
exports.Label = label;
exports.Lazy = lazy;
exports.List = list;
exports.ListHeader = listHeader;
exports.ListItem = ListItem;
exports.ListView = listView;
exports.Loading = loading;
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
exports.Row = row;
exports.Skyline = Skyline;
exports.Slider = slider;
exports.Spinner = Spinner;
exports.Stepper = stepper;
exports.SvgIcon = SvgIcon;
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
exports.Tooltip = Tooltip;
exports.TreeItem = treeItem;
exports.default = index;
