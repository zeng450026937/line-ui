import { createMixins } from '@/utils/mixins';
import { createSlots } from '@/utils/vnode/unify-slots';

export function useComponent() {
  return createMixins({
    created() {
      const injections = createSlots(this, false);
      this.hasSlot = injections.hasSlot;
      this.slots = injections.slots;
    },
  });
}
