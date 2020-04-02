import { createMixins } from '@line-ui/line/src/utils/mixins';
import { createSlots } from '@line-ui/line/src/utils/vnode/unify-slots';

export function useSlots() {
  return createMixins({
    created() {
      const injections = createSlots(this, false);
      this.hasSlot = injections.hasSlot;
      this.slots = injections.slots;
    },
  });
}
