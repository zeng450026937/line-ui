import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { addResizeListener } from '@line-ui/line/src/utils/dom';

export interface DimensionOptions {
  callback: (el: HTMLElement) => void;
  passive?: boolean;
}

export function createDimension(el: HTMLElement, options: DimensionOptions) {
  const { callback } = options;

  const destroy = addResizeListener(el, () => callback(el));

  callback(el);

  return {
    destroy,
  };
}

function inserted(el: HTMLElement, binding: VNodeDirective) {
  const { value: callback, modifiers: options } = binding;

  if (!callback) return;

  (el as any).vDimension = createDimension(el, {
    callback,
    passive: true,
    ...options,
  });
}

function unbind(el: HTMLElement) {
  const { vDimension } = el as any;

  if (!vDimension) return;

  vDimension.destroy();

  delete (el as any).vDimension;
}

function update(el: HTMLElement, binding: VNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }

  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vDimension = /*#__PURE__*/ defineDirective({
  name: 'dimension',
  inserted,
  unbind,
  update,
});

export default vDimension;
