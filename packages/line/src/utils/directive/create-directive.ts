import {
  DirectiveOptions,
  VNodeDirective,
} from 'vue';
import { createElementProxy } from '@line-ui/line/src/utils/dom/element-proxy';

export function createDirective(
  directive: DirectiveOptions,
  element: HTMLElement,
  binding: VNodeDirective,
) {
  const el = createElementProxy(element);
  let vnode: any;
  return {
    bind(val: any = binding.value) {
      if (!directive.bind) return;
      binding.value = val;
      directive.bind(el, binding as any, vnode, vnode);
    },
    unbind() {
      if (!directive.unbind) return;
      directive.unbind(el, binding as any, vnode, vnode);
    },
    inserted(val: any = binding.value) {
      if (!directive.inserted) return;
      binding.value = val;
      directive.inserted(el, binding as any, vnode, vnode);
    },
    update(val: any, arg?: any) {
      if (!directive.update) return;
      binding.oldValue = binding.value;
      binding.value = val;
      binding.oldArg = binding.arg;
      binding.arg = arg || binding.arg;
      directive.update(el, binding as any, vnode, vnode);
    },
  };
}
