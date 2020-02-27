import {
  DirectiveOptions,
  VNode,
  VNodeDirective,
  VueConstructor,
} from 'vue';
import {
  camelize,
  capitalize,
} from 'skyline/utils/string-transform';

export function install(this: any, Vue: VueConstructor) {
  const { name } = this;
  Vue.directive(name as string, this);
  Vue.directive(camelize(`-${ name }`), this);
}

export function createDirective(options: DirectiveOptions) {
  function bind(el: HTMLElement, ...args: any[]) {
    if (options.bind) {
      bind(el, ...args);
    }
  }

  return {
    bind,
  } as DirectiveOptions;
}
