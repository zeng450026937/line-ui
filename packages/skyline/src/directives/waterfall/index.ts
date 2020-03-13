import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/utils/directive';
import { isObject } from 'skyline/utils/helpers';
import {
  getScrollParent,
  isWindow,
  on,
} from 'skyline/utils/dom';

function getScrollTop(el: Element | Window) {
  return isWindow(el)
    ? el.pageYOffset
    : el.scrollTop;
}

// get distance from el top to page top
function getElementTop(el: Element | Window) {
  const elementTop = isWindow(el) ? 0 : el.getBoundingClientRect().top;
  const scrollTop = getScrollTop(window);
  return elementTop + scrollTop;
}

function getVisibleHeight(el: Element | Window) {
  return isWindow(el)
    ? el.innerHeight
    : el.getBoundingClientRect().height;
}

const DEFAULT_OFFSET = 300;

export type WaterfallHandler = (
  info: {
    down: boolean;
    up: boolean;
    target: Element;
    scrollTop: number;
  }
) => void;

export interface WaterfallOptions extends AddEventListenerOptions {
  handler: WaterfallHandler;
  offset?: number;
  up?: boolean;
  down?: boolean;
}

export function createWaterfall(el: HTMLElement, options: WaterfallOptions) {
  const {
    handler,
    offset = DEFAULT_OFFSET,
    up = true,
    down = true,
  } = options;

  const target = getScrollParent(el);

  const scroll = () => {
    const scrollTop = getScrollTop(target);
    const visibleHeight = getVisibleHeight(target);
    const validHeight = scrollTop + visibleHeight;

    // hidden element
    if (!visibleHeight) return;

    let hitDown = false;
    let hitUp = false;

    if (down) {
      if (el === target) {
        hitDown = target.scrollHeight - validHeight < offset;
      } else {
        const elementBottom = getElementTop(el) - getElementTop(target) + getVisibleHeight(el);
        hitDown = elementBottom - visibleHeight < offset;
      }
    }
    if (up) {
      if (el === target) {
        hitUp = scrollTop < offset;
      } else {
        const elementTop = getElementTop(el) - getElementTop(target);
        hitUp = elementTop + offset > 0;
      }
    }

    if ((hitDown && down) || (hitUp && up)) {
      handler && handler({
        down : hitDown,
        up   : hitUp,
        target,
        scrollTop,
      });
    }
  };

  const scrollOff = on(target, 'scroll', scroll, options);

  const destroy = () => {
    scrollOff();
  };

  return {
    scroll,
    destroy,
  };
}

export interface WaterfallVNodeDirective extends VNodeDirective {
  value?: WaterfallOptions | WaterfallHandler;
}

function inserted(el: HTMLElement, binding: WaterfallVNodeDirective) {
  const { value, modifiers } = binding;

  if (!value) return;

  const options = isObject(value)
    ? value as WaterfallOptions
    : { handler: value } as WaterfallOptions;

  const vWaterfall = createWaterfall(el, {
    ...modifiers,
    ...options,
  });

  (el as any).vWaterfall = vWaterfall;
}

function unbind(el: HTMLElement) {
  const { vWaterfall } = el as any;

  if (!vWaterfall) return;

  vWaterfall.destroy();

  delete (el as any).vWaterfall;
}


function update(el: HTMLElement, binding: WaterfallVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const VWaterfall = defineDirective({
  name : 'waterfall',
  inserted,
  unbind,
  update,
});

export default VWaterfall;
