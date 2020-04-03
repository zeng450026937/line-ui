import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { on } from '@line-ui/line/src/utils/dom';

export interface AutoRepeatOptions {
  enable?: boolean;
  delay?: number;
  interval?: number;
}

const REPEAT_DELAY = 300;
const REPEAT_INTERVAL = 300;

export function createAutoRepeat(el: HTMLElement, options: AutoRepeatOptions) {
  let repeatTimer: number | null;
  let repeatDelayTimer: number | null;
  let {
    enable: enableRepeat = true,
    interval: repeatInterval = REPEAT_INTERVAL,
    delay: repeatDelay = REPEAT_DELAY,
  } = options;

  const start = (ev: Event) => {
    if (enableRepeat) {
      repeatDelayTimer = setTimeout(() => {
        repeatTimer = setInterval(() => {
          const repeatEvent = new MouseEvent('click', ev);
          (repeatEvent as any).repeat = true;
          el.dispatchEvent(repeatEvent);
        }, repeatInterval);
      }, repeatDelay);
    }
  };

  const stop = () => {
    if (repeatDelayTimer) {
      clearTimeout(repeatDelayTimer);
      repeatDelayTimer = null;
    }
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
  };

  const pointerDown = (ev: Event) => {
    if (!enableRepeat) return;
    if (
      ('isTrusted' in ev && !ev.isTrusted) ||
      ('pointerType' in ev && !(ev as PointerEvent).pointerType)
    )
      return;
    if (!ev.composedPath().some((path) => path === el)) return;
    start(ev);
  };

  const enable = (val: boolean) => {
    enableRepeat = val;
    if (!enableRepeat) {
      stop();
    }
  };

  const setOptions = (val: AutoRepeatOptions) => {
    enableRepeat = !!val.enable;
    repeatInterval = val.interval || REPEAT_INTERVAL;
    repeatDelay = val.delay || REPEAT_DELAY;
  };

  const doc = document;
  const opts = { passive: true };

  const mousedownOff = on(doc, 'mousedown', pointerDown, opts);
  const mouseupOff = on(doc, 'mouseup', stop, opts);
  const touchstartOff = on(doc, 'touchstart', pointerDown, opts);
  const touchendOff = on(doc, 'touchend', stop, opts);
  const touchcancelOff = on(doc, 'touchcancel', stop, opts);
  const dragstartOff = on(doc, 'dragstart', stop, opts);

  const destroy = () => {
    stop();
    mousedownOff();
    mouseupOff();
    touchstartOff();
    touchendOff();
    touchcancelOff();
    dragstartOff();
  };

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

export interface AutoRepeatDirective extends VNodeDirective {
  value?: AutoRepeatOptions;
}

function inserted(el: HTMLElement, binding: AutoRepeatDirective) {
  if (binding.value === false) return;

  (el as any).vAutoRepeat = createAutoRepeat(
    el,
    binding.value as AutoRepeatOptions
  );
}

function unbind(el: HTMLElement) {
  const { vAutoRepeat } = el as any;

  if (!vAutoRepeat) return;

  vAutoRepeat.destroy();

  delete (el as any).vAutoRepeat;
}

function update(el: HTMLElement, binding: AutoRepeatDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }

  const { vAutoRepeat } = el as any;

  if (!vAutoRepeat) {
    inserted(el, binding);
    return;
  }

  vAutoRepeat.stop();
  vAutoRepeat.update(binding.value);
}

export const vAutoRepeat = /*#__PURE__*/ defineDirective({
  name: 'autorepeat',
  inserted,
  update,
  unbind,
});

export default vAutoRepeat;
