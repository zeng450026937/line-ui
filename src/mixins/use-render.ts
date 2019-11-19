import Vue, { VNode, VNodeData, RenderContext } from 'vue';
import { createMixins } from '@/utils/mixins';

const strategies = Vue.config.optionMergeStrategies;
strategies.shouldRender; // default strategy
strategies.beforeRender = strategies.created;
strategies.afterRender = strategies.created;

export type BeforeRenderHook = (ctx: RenderContext) => void;
export type AfterRenderHook = (vnode: VNode, ctx: RenderContext) => void;

type ObjectIndex = Record<string, any>;

export function shallowCompare(old: ObjectIndex, val: ObjectIndex) {
  if (old === val) return false;
  for (const key in val) {
    if (old[key] !== val[key]) {
      return true;
    }
  }
  return false;
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
      let prevVNode: VNode;
      this.$options.render = render && function patchedRender(this: Vue, h, ctx) {
        const renderProxy = this;
        const renderContext = {
          props       : this.$props,
          children    : this.$slots.default,
          slots       : () => this.$slots,
          scopedSlots : this.$scopedSlots,
          data        : this.$vnode.data,
          parent      : this.$parent,
          listeners   : this.$listeners,
          injections  : this,
        } as RenderContext;
        if (shouldRender && !shouldRender.call(renderProxy)) {
          return prevVNode;
        }
        if (beforeRender) {
          (beforeRender as unknown as Array<BeforeRenderHook>)
            .forEach((fn) => fn.call(renderProxy, renderContext));
        }
        const vnode = render.call(renderProxy, h, ctx);
        if (afterRender) {
          (afterRender as unknown as Array<AfterRenderHook>)
            .forEach((fn) => fn.call(renderProxy, vnode, renderContext));
        }
        prevVNode = vnode;
        return vnode;
      };
    },
  });
}
