import { VNode } from 'vue';
import { createMixins } from '@/utils/mixins';
import { createBEM } from '@/utils/namespace/bem';
import { createI18N } from '@/utils/namespace/i18n';

import '@/locale';

export function useComponent(name: string) {
  return createMixins({
    props : {
      scopedSlots : Object,
    },

    methods : {
      hasSlot(name = 'default') {
        const { $slots, $scopedSlots, scopedSlots = {} } = this;
        const scopedSlot = $scopedSlots[name] || scopedSlots[name];
        return scopedSlot || $slots[name];
      },

      // Use scopedSlots in Vue 2.6+
      // downgrade to slots in lower version
      slots(name = 'default', props: any): VNode[] | undefined {
        const { $slots, $scopedSlots, scopedSlots = {} } = this;
        const scopedSlot = $scopedSlots[name] || scopedSlots[name];

        if (scopedSlot) {
          return scopedSlot(props);
        }

        return $slots[name];
      },

      bem : createBEM(name),

      t : createI18N(name),
    },
  });
}
