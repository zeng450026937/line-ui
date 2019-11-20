import Vue, { VNode, VNodeData, RenderContext } from 'vue';
import { createMixins } from '@/utils/mixins';

const strategies = Vue.config.optionMergeStrategies;
strategies.shouldRender; // default strategy
strategies.beforeRender = strategies.created;
strategies.afterRender = strategies.created;

export type BeforeRenderHook = (ctx: RenderContext) => void;
export type AfterRenderHook = (vnode: VNode, ctx: RenderContext) => VNode | void;

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
      // let prevProps: Record<string, any>;
      let prevVNode: VNode;
      this.$options.render = render && function patchedRender(this: Vue, h, ctx) {
        // if (prevProps && !shallowCompare(prevProps, this.$props)) return prevVNode;
        const renderProxy = this;
        const renderContext = {
          props       : this.$props,
          children    : this.$slots.default,
          slots       : () => this.$slots,
          scopedSlots : this.$scopedSlots,
          data        : this.$vnode && this.$vnode.data,
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
        let vnode = render.call(renderProxy, h, renderContext);
        if (afterRender) {
          (afterRender as unknown as Array<AfterRenderHook>)
            .forEach((fn) => {
              vnode = fn.call(renderProxy, vnode, renderContext) || vnode;
            });
        }
        // prevProps = { ...this.$props };
        prevVNode = vnode;
        return vnode;
      };
    },
  });
}
