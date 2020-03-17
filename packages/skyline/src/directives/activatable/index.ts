import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/src/utils/directive';

export interface ActivatableOptions {
  instant?: boolean;
}

export function createActivatable(el: HTMLElement, options: ActivatableOptions) {
  const { instant } = options;

  el.classList.add('line-activatable');
  if (instant) {
    el.classList.add('line-activatable-instant');
  }

  const destroy = () => {
    el.classList.remove('line-activatable');
    if (instant) {
      el.classList.add('line-activatable-instant');
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

export const VActivatable = /*#__PURE__*/ defineDirective({
  name : 'activatable',
  inserted,
  unbind,
  update,
});

export default VActivatable;
