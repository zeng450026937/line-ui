import { DirectiveOptions, VNodeDirective } from 'vue';
import { getScrollParent, isWindow, on } from 'skyline/utils/dom';
import { isObject } from 'skyline/utils/helpers';

interface WaterfallVNodeDirective extends VNodeDirective {
  value: WaterfallDirectiveValue | WaterfallDirectiveHandler;
}

type WaterfallDirectiveValue = {
  offset?: number;
  handler: WaterfallDirectiveHandler;
};
type WaterfallDirectiveHandler = (
  info: {
    down: boolean;
    up: boolean;
    target: Element;
    scrollTop: number;
  }
) => void;

const OFFSET = 300;

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

function createWaterfall(el: HTMLElement, binding: WaterfallVNodeDirective) {
  const {
    value,
    modifiers: options = { passive: true },
  } = binding;

  const {
    down = true,
    up = true,
  } = options;

  const callback = isObject(value)
    ? (value as WaterfallDirectiveValue).handler
    : (value as WaterfallDirectiveHandler);

  const offset = (
    isObject(value) && (value as WaterfallDirectiveValue).offset
  ) || OFFSET;

  const target = getScrollParent(el);

  function scroll() {
    const scrollTop = getScrollTop(target);
    const visibleHeight = getVisibleHeight(target);
    const validHeight = scrollTop + visibleHeight;

    // hidden element
    if (!visibleHeight) return;

    let touchDown = false;
    let touchUp = false;

    if (down) {
      if (el === target) {
        touchDown = target.scrollHeight - validHeight < offset;
      } else {
        const elementBottom = getElementTop(el) - getElementTop(target) + getVisibleHeight(el);
        touchDown = elementBottom - visibleHeight < offset;
      }
    }
    if (up) {
      if (el === target) {
        touchUp = scrollTop < offset;
      } else {
        const elementTop = getElementTop(el) - getElementTop(target);
        touchUp = elementTop + offset > 0;
      }
    }

    if ((touchDown && down) || (touchUp && up)) {
      callback && callback({
        down : touchDown,
        up   : touchUp,
        target,
        scrollTop,
      });
    }
  }

  const scrollOff = on(target, 'scroll', scroll, options);

  function destroy() {
    scrollOff();
  }

  return {
    scroll,
    destroy,
  };
}

function inserted(el: HTMLElement, binding: WaterfallVNodeDirective) {
  if (!binding.value) return;
  const vWaterfall = createWaterfall(el, binding);
  (el as any).vWaterfall = vWaterfall;
}

function unbind(el: HTMLElement) {
  const { vWaterfall } = el as any;
  if (!vWaterfall) return;
  vWaterfall.destroy();
  delete (el as any).vWaterfall;
}


function update(el: HTMLElement, binding: WaterfallVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Waterfall = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default Waterfall;
