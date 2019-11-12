import Vue, { VNode, RenderContext } from 'vue';

const strategies = Vue.config.optionMergeStrategies;
strategies.shouldRender; // default strategy
strategies.afterRender = strategies.created;

type RenderHook = (vnode: VNode, ctx: RenderContext) => void;

export const PatchMixin = Vue.extend({
  // hack render
  created() {
    const { shouldRender, render, afterRender } = this.$options;
    this.$options.render = render && function patchedRender(this: any, h, ctx) {
      const renderProxy = this;
      if (shouldRender && !shouldRender.call(renderProxy)) {
        return null as any;
      }
      const vnode = render.call(renderProxy, h, ctx);
      if (afterRender) {
        (afterRender as unknown as Array<RenderHook>).forEach((fn) => fn.call(renderProxy, vnode, ctx));
      }
      return vnode;
    };
  },
});

export function usePatch() {
  return PatchMixin;
}
