import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/utils/directive';
import { keys } from 'skyline/utils/helpers';
import {
  off,
  on,
} from 'skyline/utils/dom';

const DIR_RATIO = 0.5;
const MIN_DISTANCE = 16;

const handleGesture = (wrapper: TouchWrapper) => {
  const {
    touchstartX, touchendX, touchstartY, touchendY,
  } = wrapper;
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

function touchstart(event: TouchEvent, wrapper: TouchWrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchstartX = touch.clientX;
  wrapper.touchstartY = touch.clientY;

  wrapper.start
    && wrapper.start(Object.assign(event, wrapper));
}

function touchend(event: TouchEvent, wrapper: TouchWrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchendX = touch.clientX;
  wrapper.touchendY = touch.clientY;

  wrapper.end
    && wrapper.end(Object.assign(event, wrapper));

  handleGesture(wrapper);
}

function touchmove(event: TouchEvent, wrapper: TouchWrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchmoveX = touch.clientX;
  wrapper.touchmoveY = touch.clientY;

  wrapper.move && wrapper.move(Object.assign(event, wrapper));
}


interface TouchStoredHandlers {
  touchstart: (e: TouchEvent) => void;
  touchend: (e: TouchEvent) => void;
  touchmove: (e: TouchEvent) => void;
}

function createHandlers(value: TouchHandlers): TouchStoredHandlers {
  const wrapper = {
    touchstartX : 0,
    touchstartY : 0,
    touchendX   : 0,
    touchendY   : 0,
    touchmoveX  : 0,
    touchmoveY  : 0,
    offsetX     : 0,
    offsetY     : 0,
    left        : value.left,
    right       : value.right,
    up          : value.up,
    down        : value.down,
    start       : value.start,
    move        : value.move,
    end         : value.end,
  };

  return {
    touchstart : (e: TouchEvent) => touchstart(e, wrapper),
    touchend   : (e: TouchEvent) => touchend(e, wrapper),
    touchmove  : (e: TouchEvent) => touchmove(e, wrapper),
  };
}

export interface TouchWrapper extends TouchHandlers {
  touchstartX: number;
  touchstartY: number;
  touchmoveX: number;
  touchmoveY: number;
  touchendX: number;
  touchendY: number;
  offsetX: number;
  offsetY: number;
}

export interface TouchHandlers {
  start?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
  end?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
  move?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
  left?: (wrapper: TouchWrapper) => void;
  right?: (wrapper: TouchWrapper) => void;
  up?: (wrapper: TouchWrapper) => void;
  down?: (wrapper: TouchWrapper) => void;
}

export interface TouchOptions extends TouchHandlers, AddEventListenerOptions {
  parent?: boolean;
}

export function createTouch(el: HTMLElement, options: TouchOptions) {
  const { parent } = options;
  const target = parent ? el.parentElement || document.body : el;

  const handlers = createHandlers(options);

  keys(handlers).forEach((eventName) => {
    on(target, eventName, handlers[eventName] as EventListener, options);
  });

  const destroy = () => {
    keys(handlers).forEach((eventName) => {
      off(target, eventName, handlers[eventName] as EventListener);
    });
  };

  return {
    destroy,
  };
}

export interface TouchVNodeDirective extends VNodeDirective {
  value?: TouchOptions;
}

function inserted(el: HTMLElement, binding: TouchVNodeDirective) {
  const { value } = binding;

  if (!value) return;

  (el as any).vTouch = createTouch(el, value);
}

function unbind(el: HTMLElement) {
  const { vTouch } = el as any;

  if (!vTouch) return;

  vTouch.destroy();

  delete (el as any).vTouch;
}

function update(el: HTMLElement, binding: TouchVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const VTouch = defineDirective({
  name : 'touch',
  inserted,
  unbind,
  update,
});

export default VTouch;
