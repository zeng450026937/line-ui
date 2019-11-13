/* eslint-disable import/extensions */
import { VNode, VueConstructor } from 'vue';
import { Vue } from 'vue/types/vue';

declare module 'vue/types/options' {
  // interface ComponentOptions<V extends Vue> {
  //   // use-patch
  //   shouldRender?(): boolean;
  //   afterRender?(vnode: VNode, ctx: RenderContext): void;
  //   // namespace
  //   events?: Record<string, any>;
  //   slots?: Record<string, any>;
  //   install?: (Vue: VueConstructor) => void;
  // }

  interface RenderContext {
    slots(name?: string, props?: any): any;
  }

  // interface FunctionalComponentOptions {
  //   // namespace
  //   slots?: object;
  //   install?: (Vue: VueConstructor) => void;
  // }
}
