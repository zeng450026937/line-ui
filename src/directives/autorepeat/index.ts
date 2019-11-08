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
    update    : setOptions,
    start,
    stop,
    pointerDown,
    pointerUp : stop,
  };
}

function bind(el: HTMLElement, binding: AutoRepeatDirective) {
  if (binding.value === false) return;
  const vAutoRepeat = createAutoRepeat(el, binding.value as AutoRepeatOption);
  const doc = document;
  doc.addEventListener('mousedown', vAutoRepeat.pointerDown, true);
  doc.addEventListener('mouseup', vAutoRepeat.pointerUp, true);
  doc.addEventListener('touchstart', vAutoRepeat.pointerDown, true);
  doc.addEventListener('touchend', vAutoRepeat.pointerUp, true);
  doc.addEventListener('touchcancel', vAutoRepeat.pointerUp, true);
  doc.addEventListener('dragstart', vAutoRepeat.pointerUp, true);
  (el as any).vAutoRepeat = vAutoRepeat;
}

function update(el: HTMLElement, binding: AutoRepeatDirective) {
  const { vAutoRepeat } = (el as any);
  if (!vAutoRepeat) {
    bind(el, binding);
    return;
  }
  vAutoRepeat.stop();
  vAutoRepeat.update(binding.value);
}

function unbind(el: HTMLElement, binding: AutoRepeatDirective) {
  const { vAutoRepeat } = el as any;
  if (!vAutoRepeat) return;
  const doc = document;
  doc.removeEventListener('mousedown', vAutoRepeat.pointerDown, true);
  doc.removeEventListener('mouseup', vAutoRepeat.pointerUp, true);
  doc.removeEventListener('touchstart', vAutoRepeat.pointerDown, true);
  doc.removeEventListener('touchend', vAutoRepeat.pointerUp, true);
  doc.removeEventListener('touchcancel', vAutoRepeat.pointerUp, true);
  doc.removeEventListener('dragstart', vAutoRepeat.pointerUp, true);
  delete (el as any).vAutoRepeat;
}

export const AutoRepeat = {
  bind,
  update,
  unbind,
} as DirectiveOptions;

export default AutoRepeat;
