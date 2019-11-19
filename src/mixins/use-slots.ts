// Use scopedSlots in Vue 2.6+
// downgrade to slots in lower version
import { createMixins } from '@/utils/mixins';

export function useSlots(name?: string) {
  return createMixins({
    props : {
      // TODO: test if it is ok to work with jsx
      scopedSlots : Object,
    },

    methods : {
      slots(name = 'default', props: any) {
        const { $slots, $scopedSlots, scopedSlots = {} } = this;
        const scopedSlot = $scopedSlots[name] || scopedSlots[name];

        if (scopedSlot) {
          return scopedSlot(props);
        }

        return $slots[name];
      },
    },
  });
}
