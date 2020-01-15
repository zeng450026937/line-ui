import {
  DirectiveOptions, VNode, VNodeDirective,
} from 'vue';

function bind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  const { modifiers } = binding;
  el.classList.add('line-activatable');
  if (modifiers!.instant) {
    el.classList.add('line-activatable-instant');
  }
}

function unbind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  const { modifiers } = binding;
  el.classList.remove('line-activatable');
  if (modifiers!.instant) {
    el.classList.add('line-activatable-instant');
  }
}

export const Activatable = {
  bind,
  unbind,
} as DirectiveOptions;

export default Activatable;
