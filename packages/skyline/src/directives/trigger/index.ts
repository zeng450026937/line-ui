import { VNodeDirective } from 'vue';

function createTrigger() {
  return {};
}

function inserted(el: HTMLElement, binding: VNodeDirective) {
  (el as any).vTrigger = createTrigger();
}

function unbind(el: HTMLElement) {
  if (!(el as any).vTrigger) return;

  delete (el as any).vTrigger;
}

export const VTrigger = {
  inserted,
  unbind,
};

export default VTrigger;
