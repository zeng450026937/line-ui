/* eslint-disable-next-line import/extensions */
import { VNode } from 'vue/types/vnode';
import { createMixins } from '@/utils/mixins';
import { isDef, isFunction } from '@/utils/helpers';
import remote from '@/directives/remote';

export function useRemote() {
  return createMixins({
    directives : {
      remote,
    },

    props : {
      container : [String, Function],
    },

    afterRender(vnode: VNode) {
      const { container } = this;
      if (!isDef(container)) return;

      vnode.data = vnode.data || {};
      (vnode.data.directives || (vnode.data.directives = [])).push({
        name  : 'remote',
        value : true,
        arg   : isFunction(container) ? container() : container,
      });
    },
  });
}
