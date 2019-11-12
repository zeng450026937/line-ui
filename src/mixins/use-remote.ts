import Vue, { VNode } from 'vue';
import { isFunction } from '@/utils/helpers';
import remote from '@/directives/remote';

export function useRemote() {
  return Vue.extend({
    directives : {
      remote,
    },

    props : {
      container : [String, Function],
    },

    afterRender(vnode: VNode) {
      vnode.data = vnode.data || {};
      const { data } = vnode;
      data.directives = data.directives || [];
      const { directives } = data;
      const container = isFunction(this.container) ? this.container() : this.container;
      directives.push({
        name  : 'remote',
        value : !!container,
        arg   : container,
      });
    },
  });
}
