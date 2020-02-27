import { createMixins } from 'skyline/utils/mixins';
import { createSlots } from 'skyline/utils/vnode/unify-slots';

export function useComponent() {
  return createMixins({
    created() {
      const injections = createSlots(this, false);
      this.hasSlot = injections.hasSlot;
      this.slots = injections.slots;
    },
  });
}
