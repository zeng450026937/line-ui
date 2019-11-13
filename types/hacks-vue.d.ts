import { VNode, VueConstructor } from 'vue';
import { Vue } from 'vue/types/vue';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // use-patch
    shouldRender?(): boolean;
    afterRender?(vnode: VNode, ctx: RenderContext): void;
    // namespace
    install?: (Vue: VueConstructor) => void;
  }

  interface RenderContext {
    slots(name?: string, ctx?: any): any;
  }

  interface FunctionalComponentOptions {
    // namespace
    install?: (Vue: VueConstructor) => void;
  }
}
