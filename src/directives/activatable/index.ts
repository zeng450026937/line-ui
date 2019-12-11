import {
  DirectiveOptions, VNode, VNodeDirective,
} from 'vue';

function bind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  const { modifiers } = binding;
  el.classList.add('activatable');
  if (modifiers!.instant) {
    el.classList.add('activatable-instant');
  }
}

function unbind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  const { modifiers } = binding;
  el.classList.remove('activatable');
  if (modifiers!.instant) {
    el.classList.add('activatable-instant');
  }
}

export const Activatable = {
  bind,
  unbind,
} as DirectiveOptions;

export default Activatable;
