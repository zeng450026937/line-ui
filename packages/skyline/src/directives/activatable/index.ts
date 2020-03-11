import { DirectiveOptions, VNodeDirective } from 'vue';

function inserted(el: HTMLElement, binding: VNodeDirective) {
  const { modifiers } = binding;
  el.classList.add('line-activatable');
  if (modifiers!.instant) {
    el.classList.add('line-activatable-instant');
  }
}

function unbind(el: HTMLElement, binding: VNodeDirective) {
  const { modifiers } = binding;
  el.classList.remove('line-activatable');
  if (modifiers!.instant) {
    el.classList.add('line-activatable-instant');
  }
}

export const VActivatable = {
  inserted,
  unbind,
} as DirectiveOptions;

export default VActivatable;
