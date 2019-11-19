/* eslint-disable-next-line import/extensions */
import { VNode } from 'vue/types/vnode';
import { createMixins } from '@/utils/mixins';
import ripple from '@/directives/ripple';

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
