import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { on } from '@line-ui/line/src/utils/dom';

export interface ResizeOptions extends AddEventListenerOptions {
  callback: () => void;
  immediate?: boolean;
}

export function createResize(options: ResizeOptions) {
  const { callback, immediate } = options;

  const resizeOff = on(window, 'resize', callback, options);

  const destroy = () => {
    resizeOff();
  };

  if (immediate) {
    callback();
  }

  return {
    callback,
    options,
    destroy,
  };
}

export interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void;
}

function inserted(el: HTMLElement, binding: ResizeVNodeDirective) {
  const { value, modifiers } = binding;

  if (!value) return;

  (el as any).vResize = createResize({
    ...(modifiers as any),
    callback: value,
  });
}

function unbind(el: HTMLElement) {
  const { vResize } = el as any;

  if (!vResize) return;

  vResize.destroy();

  delete (el as any).vResize;
}

function update(el: HTMLElement, binding: ResizeVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vResize = /*#__PURE__*/ defineDirective({
  name: 'resize',
  inserted,
  unbind,
  update,
});

export default vResize;
