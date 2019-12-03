/* eslint-disable import/extensions */
import {
  VNode,
  VueConstructor,
  ComponentOptions,
  FunctionalComponentOptions,
} from 'vue';
import { Vue } from 'vue/types/vue';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // use-patch
    shouldRender?: () => boolean;
    beforeRender?: (ctx: RenderContext) => void;
    afterRender?: (vnode: VNode, ctx: RenderContext) => VNode | void | null | undefined;
    // namespace
    events?: Record<string, any>;
    slots?: Record<string, any>;
    install?: (Vue: VueConstructor) => void;
  }

  interface RenderContext<Props=DefaultProps> {
    slots(name?: string, props?: any): any;
    [injectedKey: string]: any;
  }

  interface FunctionalComponentOptions {
    directives?: { [key: string]: DirectiveFunction | DirectiveOptions };

    // namespace
    events?: Record<string, any>;
    slots?: Record<string, any>;
    install?: (Vue: VueConstructor) => void;
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue> {
    name?: string;
    install?: (Vue: VueConstructor) => void;
    version: string;
  }
}
