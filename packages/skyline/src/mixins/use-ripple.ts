import { VNode } from 'vue';
import { createMixins } from 'skyline/src/utils/mixins';
import ripple from 'skyline/src/directives/ripple';

export function useRipple() {
  return createMixins({
    directives : {
      ripple,
    },

    props : {
      ripple : {
        type    : Boolean,
        // default should be platform specified
        default : false,
      },
    },

    afterRender(vnode: VNode) {
      vnode.data = vnode.data || {};
      (vnode.data.directives || (vnode.data.directives = [])).push({
        name  : 'ripple',
        value : this.ripple,
      });
    },
  });
}
