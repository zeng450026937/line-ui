import Vue from 'vue';
import { useLazy } from './use-lazy';

export const PopupMinxin = useLazy().extend({
  watch : {
    value(val) {
      const type = val ? 'open' : 'close';
      this[type]();
      this.$emit(type);
    },
  },

  mounted() {
    if (this.value) {
      this.open();
    }
  },

  activated() {
    if (this.value) {
      this.open();
    }
  },

  deactivated() {
    this.close();
  },

  beforeDestroy() {
    this.close();
  },

  methods : {
    open() {
      if (this.$isServer || this.opened) {
        return;
      }

      this.opened = true;
      this.$emit('change', this.opened);
    },
    close() {
      if (!this.opened) {
        return;
      }

      this.opened = false;
      this.$emit('change', this.opened);
    },
  },
});

export function usePopup() {
  return PopupMinxin;
}
