import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';

export const PopupMinxin = createMixins({
  mixins : [useLazy(), useRemote(), useModel('visable')],

  props : {
    // This property holds whether the popup show the overlay
    overlay : {
      type    : Boolean,
      default : true,
    },
    // This property holds whether the popup dims the background.
    dim : {
      type    : Boolean,
      default : false,
    },
    // This property holds whether the popup is modal.

    // Modal popups often have a distinctive background dimming effect defined
    // in overlay.modal, and do not allow press or release events through to
    // items beneath them.

    // On desktop platforms, it is common for modal popups
    // to be closed only when the escape key is pressed. To achieve this
    // behavior, set closePolicy to Popup.CloseOnEscape.
    modal : {
      type    : Boolean,
      default : false,
    },
  },

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
