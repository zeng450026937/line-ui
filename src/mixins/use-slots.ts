// Use scopedSlots in Vue 2.6+
// downgrade to slots in lower version
import { createMixins } from '@/utils/mixins';

export function useSlots(name?: string) {
  return createMixins({
    methods : {
      slots(name = 'default', props: any) {
        const { $slots, $scopedSlots } = this;
        const scopedSlot = $scopedSlots[name];

        if (scopedSlot) {
          return scopedSlot(props);
        }

        return $slots[name];
      },
    },
  });
}
