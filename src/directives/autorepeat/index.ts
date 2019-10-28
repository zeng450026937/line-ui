import { VNodeDirective, DirectiveOptions } from 'vue';

interface AutoRepeatOption {
  enable?: boolean
  delay?: number
  interval?: number
}

interface AutoRepeatDirective extends VNodeDirective {
  value?: AutoRepeatOption
}

const REPEAT_DELAY = 300;
const REPEAT_INTERVAL = 300;

function createAutoRepeat(el: HTMLElement, options: AutoRepeatOption) {
  let repeatTimer: number | null;
  let repeatDelayTimer: number | null;
  let {
    enable: enableRepeat = true,
    interval: repeatInterval = REPEAT_INTERVAL,
    delay: repeatDelay = REPEAT_DELAY,
  } = options;

  function start(ev: UIEvent) {
    if (enableRepeat) {
      repeatDelayTimer = setTimeout(() => {
        repeatTimer = setInterval(() => {
          console.log('dispatch event');
          const repeatEvent = new MouseEvent('click', ev);
          (repeatEvent as any).repeat = true;
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

  function pointerDown(ev: UIEvent) {
    if (!enableRepeat) return;
    if (('isTrusted' in ev && !ev.isTrusted)
    || ('pointerType' in ev && !(ev as PointerEvent).pointerType)
    ) return;
    if (!ev.composedPath().some(path => path === el)) return;
    start(ev);
  }

  function enable(val: boolean) {
    enableRepeat = val;
    if (!enableRepeat) {
      stop();
    }
  }

  function setOptions(val: AutoRepeatOption) {
    enableRepeat = !!val.enable;
    repeatInterval = val.interval || REPEAT_INTERVAL;
    repeatDelay = val.delay || REPEAT_DELAY;
  }

  return {
    enable,
    update: setOptions,
    start,
    stop,
    pointerDown,
    pointerUp: stop,
  };
}

function bind(el: HTMLElement, binding: AutoRepeatDirective) {
  if (binding.value === false) return;
  const autoRepeat = createAutoRepeat(el, binding.value as AutoRepeatOption);
  const doc = document;
  doc.addEventListener('mousedown', autoRepeat.pointerDown, true);
  doc.addEventListener('mouseup', autoRepeat.pointerUp, true);
  doc.addEventListener('touchstart', autoRepeat.pointerDown, true);
  doc.addEventListener('touchend', autoRepeat.pointerUp, true);
  doc.addEventListener('touchcancel', autoRepeat.pointerUp, true);
  doc.addEventListener('dragstart', autoRepeat.pointerUp, true);
  (el as any).autoRepeat = autoRepeat;
}

function update(el: HTMLElement, binding: AutoRepeatDirective) {
  const { autoRepeat } = (el as any);
  if (!autoRepeat) {
    bind(el, binding);
    return;
  }
  autoRepeat.stop();
  autoRepeat.update(binding.value);
}

function unbind(el: HTMLElement, binding: AutoRepeatDirective) {
  const { autoRepeat } = el as any;
  if (!autoRepeat) return;
  const doc = document;
  doc.removeEventListener('mousedown', autoRepeat.pointerDown, true);
  doc.removeEventListener('mouseup', autoRepeat.pointerUp, true);
  doc.removeEventListener('touchstart', autoRepeat.pointerDown, true);
  doc.removeEventListener('touchend', autoRepeat.pointerUp, true);
  doc.removeEventListener('touchcancel', autoRepeat.pointerUp, true);
  doc.removeEventListener('dragstart', autoRepeat.pointerUp, true);
  delete (el as any).autoRepeat;
}

export const AutoRepeat = {
  bind,
  update,
  unbind,
} as DirectiveOptions;

export default AutoRepeat;
