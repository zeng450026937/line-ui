/* eslint-disable-next-line import/extensions */
import { VNode } from 'vue/types/vnode';
import { createMixins } from '@/utils/mixins';
import { isFunction } from '@/utils/helpers';
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
      const container = isFunction(this.container) ? this.container() : this.container;
      if (!container) return;

      vnode.data = vnode.data || {};
      const { data } = vnode;
      data.directives = data.directives || [];
      const { directives } = data;
      directives.push({
        name  : 'remote',
        value : true,
        arg   : container,
      });
    },
  });
}
