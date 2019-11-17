import Vue, { VNode, VNodeData, RenderContext } from 'vue';
import { createMixins } from '@/utils/mixins';
import { mergeData } from '@/utils/vnode/merge-data';

const strategies = Vue.config.optionMergeStrategies;
strategies.shouldRender; // default strategy
strategies.beforeRender = strategies.created;
strategies.afterRender = strategies.created;

type RenderDataHook = (data: VNodeData, ctx: RenderContext) => void;
type RenderHook = (vnode: VNode, ctx: RenderContext) => void;

function merge(exist: VNodeData, value: VNodeData) {

}

export function useRender() {
  return createMixins({
    // hack render
    created() {
      const {
        shouldRender,
        beforeRender,
        render,
        afterRender,
      } = this.$options;
      this.$options.render = render && function patchedRender(this: any, h, ctx) {
        const renderProxy = this;
        if (shouldRender && !shouldRender.call(renderProxy)) {
          return null as any;
        }
        const data = {} as VNodeData;
        if (beforeRender) {
          (beforeRender as unknown as Array<RenderDataHook>).forEach((fn) => fn.call(renderProxy, data, ctx));
        }
        const vnode = render.call(renderProxy, h, ctx);
        vnode.data = mergeData(vnode.data || {}, data);
        if (afterRender) {
          (afterRender as unknown as Array<RenderHook>).forEach((fn) => fn.call(renderProxy, vnode, ctx));
        }
        return vnode;
      };
    },
  });
}
