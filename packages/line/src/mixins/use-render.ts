import Vue, {
  VNode,
} from 'vue';
import { createMixins } from '@line-ui/line/src/utils/mixins';

type BeforeRenderHook = () => void;
type AfterRenderHook = (vnode: VNode) => VNode | void;

let hasStrategies: boolean | undefined;

function setupStrategies() {
  const strategies = Vue.config.optionMergeStrategies;
  strategies.shouldRender; // default strategy
  strategies.beforeRender = strategies.created;
  strategies.afterRender = strategies.created;
}

export function useRender(keep = true) {
  if (!hasStrategies) {
    setupStrategies();
    hasStrategies = true;
  }

  return createMixins({
    beforeCreate() {
      const {
        $options: options,
      } = this;
      const {
        shouldRender,
        beforeRender,
        afterRender,
        render,
      } = options;

      let snapshot: VNode;

      options.render = (h) => {
        if (shouldRender && !shouldRender.call(this)) {
          return keep ? snapshot : h();
        }

        if (beforeRender) {
          (beforeRender as unknown as Array<BeforeRenderHook>)
            .forEach(fn => fn.call(this));
        }

        let vnode = render!.call(this, h, undefined as any);

        if (afterRender) {
          (afterRender as unknown as Array<AfterRenderHook>)
            .forEach(fn => vnode = fn.call(this, vnode) || vnode);
        }

        if (keep) {
          snapshot = vnode;
        }

        return vnode;
      };
    },
  });
}
