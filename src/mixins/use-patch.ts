import Vue from 'vue';

export const PatchMixin = Vue.extend({
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

export function useSlots() {
  return PatchMixin;
}
