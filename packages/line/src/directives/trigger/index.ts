import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';

function createTrigger() {
  return {};
}

export interface TriggerVNodeDirective extends VNodeDirective {
  value?: any;
}

function inserted(el: HTMLElement, binding: TriggerVNodeDirective) {
  const { value } = binding;

  if (!value) return;

  (el as any).vTrigger = createTrigger();
}

function unbind(el: HTMLElement) {
  const { vTrigger } = el as any;

  if (!vTrigger) return;

  vTrigger.destroy();

  delete (el as any).vTrigger;
}

function update(el: HTMLElement, binding: TriggerVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vTrigger = /*#__PURE__*/ defineDirective({
  name: 'trigger',
  inserted,
  unbind,
  update,
});

export default vTrigger;
