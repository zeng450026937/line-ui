import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import {
  ACTIVATABLE,
  ACTIVATABLE_INSTANT,
} from '@line-ui/line/src/utils/tap-click';

export interface ActivatableOptions {
  instant?: boolean;
}

export function createActivatable(el: HTMLElement, options: ActivatableOptions) {
  const { instant } = options;

  el.classList.add(ACTIVATABLE);
  if (instant) {
    el.classList.add(ACTIVATABLE_INSTANT);
  }

  const destroy = () => {
    el.classList.remove(ACTIVATABLE);
    if (instant) {
      el.classList.add(ACTIVATABLE_INSTANT);
    }
  };

  return {
    destroy,
  };
}

function inserted(el: HTMLElement, binding: VNodeDirective) {
  const { modifiers, value } = binding;

  if (value === false) return;

  (el as any).vActivatable = createActivatable(el, modifiers as ActivatableOptions);
}

function unbind(el: HTMLElement) {
  const { vActivatable } = el as any;

  if (!vActivatable) return;

  vActivatable.destroy();

  delete (el as any).vActivatable;
}

function update(el: HTMLElement, binding: VNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }

  if (oldValue !== false) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vActivatable = /*#__PURE__*/ defineDirective({
  name : 'activatable',
  inserted,
  unbind,
  update,
});

export default vActivatable;
