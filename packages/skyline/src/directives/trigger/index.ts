import { VNodeDirective } from 'vue';

function createTrigger() {
  return {};
}

function bind(el: HTMLElement, binding: VNodeDirective) {
  (el as any).vTrigger = createTrigger();
}

function unbind(el: HTMLElement) {
  if (!(el as any).vTrigger) return;

  delete (el as any).vTrigger;
}

export const Trigger = {
  bind,
  unbind,
};

export default Trigger;
