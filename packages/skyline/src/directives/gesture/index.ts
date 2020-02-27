import { DirectiveOptions, VNodeDirective } from 'vue';
import { createGesture, GestureConfig } from 'skyline/utils/gesture/index';

interface GestureVNodeDirective extends VNodeDirective {
  value?: GestureConfig;
}

function inserted(el: HTMLElement, binding: GestureVNodeDirective) {
  if (!binding.value) return;

  const config = {
    ...binding.value,
    el,
  };

  (el as any).vGesture = createGesture(config);
}

function unbind(el: HTMLElement) {
  const { vGesture } = el as any;
  if (!vGesture) return;
  vGesture.destroy();
  delete (el as any).vGesture;
}

function update(el: HTMLElement, binding: GestureVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Gesture = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default Gesture;
