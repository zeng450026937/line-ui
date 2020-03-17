import { createMixins } from 'skyline/src/utils/mixins';
import { createSlots } from 'skyline/src/utils/vnode/unify-slots';

export function useSlots() {
  return createMixins({
    created() {
      const injections = createSlots(this, false);
      this.hasSlot = injections.hasSlot;
      this.slots = injections.slots;
    },
  });
}
