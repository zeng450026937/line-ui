import { ComponentOptions, VNode } from 'vue';
import { Vue } from 'vue/types/vue.d';

// use-patch
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    shouldRender?(): boolean;
    afterRender?(vnode: VNode, ctx: RenderContext): void;
  }
}
