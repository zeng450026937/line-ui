import { VNode, VNodeData } from 'vue';
/* eslint-disable-next-line */
import { NormalizedScopedSlot } from 'vue/types/vnode';
import { createMixins } from '@/utils/mixins';
import { createBEM } from '@/utils/namespace/bem';
import { createI18N } from '@/utils/namespace/i18n';
import { patchVNode } from '@/utils/vnode';

import '@/locale';
import { isFunction } from '@/utils/helpers';

type ScopedSlots = {
  [key: string]: NormalizedScopedSlot | undefined;
};

type PacthFn = (vnode: VNodeData, index: number) => VNodeData;

export function useComponent(name: string) {
  return createMixins({
    props : {
      scopedSlots : Object,
    },

    methods : {
      hasSlot(name = 'default'): boolean {
        const { $slots, $scopedSlots, scopedSlots = {} } = this;
        const scopedSlot = $scopedSlots[name] || scopedSlots[name];
        return scopedSlot || $slots[name];
      },

      // Use scopedSlots in Vue 2.6+
      // downgrade to slots in lower version
      slots(name = 'default', ctx?: any, patch?: VNodeData | PacthFn): VNode[] | undefined {
        const { $slots, $scopedSlots, scopedSlots = {} } = this;
        const scopedSlot = $scopedSlots[name] || (scopedSlots as ScopedSlots)[name];
        const vnodes = scopedSlot ? scopedSlot(ctx) : $slots[name];
        if (vnodes) {
          vnodes.forEach((vnode, index) => {
            patchVNode(vnode, { staticClass: `${ (vnode.data || {}).staticClass || '' } slotted ${ name !== 'default' ? `slot-${ name }` : '' }`.trim() });
            patch && patchVNode(vnode, isFunction(patch) ? patch(vnode.data || {}, index) : patch);
          });
        }
        return vnodes;
      },

      bem : createBEM(name),

      t : createI18N(name),
    },
  });
}
