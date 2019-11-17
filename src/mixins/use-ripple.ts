/* eslint-disable-next-line import/extensions */
import { VNode } from 'vue/types/vnode';
import { createMixins } from '@/utils/mixins';
import ripple from '@/directives/ripple';

export function useRemote() {
  return createMixins({
    directives : {
      ripple,
    },

    afterRender(vnode: VNode) {
      vnode.data = vnode.data || {};
      (vnode.data.directives || (vnode.data.directives = [])).push({
        name  : 'ripple',
        value : true,
      });
    },
  });
}
