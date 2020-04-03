import { VNode, VNodeDirective, VueConstructor } from 'vue';
import { directiveInstall as install } from '@line-ui/line/src/utils/install';

export type DirectiveCallback<T extends VNodeDirective = VNodeDirective> = (
  el: HTMLElement,
  binding: T,
  vnode: VNode,
  oldVnode: VNode
) => void;

export interface LineDirectiveOptions<
  T extends VNodeDirective = VNodeDirective
> {
  name: string;
  install?: (vue: VueConstructor) => void;

  bind?: DirectiveCallback<T>;
  inserted?: DirectiveCallback<T>;
  update?: DirectiveCallback<T>;
  componentUpdated?: DirectiveCallback<T>;
  unbind?: DirectiveCallback<T>;
}

export function defineDirective<T extends VNodeDirective = VNodeDirective>(
  options: LineDirectiveOptions<T>
) {
  options.install = install;
  return options;
}
