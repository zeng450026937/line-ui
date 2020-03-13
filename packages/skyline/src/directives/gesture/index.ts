import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/utils/directive';
import {
  createGesture,
  GestureConfig,
} from 'skyline/utils/gesture/index';

export interface GestureVNodeDirective extends VNodeDirective {
  value?: GestureConfig;
}

function inserted(el: HTMLElement, binding: GestureVNodeDirective) {
  if (!binding.value) return;

  (el as any).vGesture = createGesture({ ...binding.value, el });
}

function unbind(el: HTMLElement) {
  const { vGesture } = el as any;

  if (!vGesture) return;

  vGesture.destroy();

  delete (el as any).vGesture;
}

function update(el: HTMLElement, binding: GestureVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const VGesture = defineDirective({
  name : 'gesture',
  inserted,
  unbind,
  update,
});

export default VGesture;
