/* eslint-disable import/extensions */
import { Vue } from 'vue/types/vue';
import { VNode } from 'vue/types/vnode';
/* eslint-enable import/extensions */
import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { BEM } from '@/utils/namespace/bem';
import Overlay from '@/components/overlay/overlay';

export interface PopupOptions {
  bem: BEM;
}

export type PopupProps = {
  overlay: boolean;
  dim: boolean;
  modal: boolean;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  visable: boolean;
}
export type Popup<T = PopupProps> = Vue & T;

let popupId = 0;

export function usePopup(options?: PopupOptions) {
  let overlay;

  function onClickOutside(popup: Popup) {
    if (popup.modal) return;
    if (!popup.closeOnClickOutside) return;

    popup.visable = false;
  }
  function onEscape(popup: Popup) {
    if (!popup.closeOnEscape) return;

    popup.visable = false;
  }

  return createMixins({
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
      //
      // Modal popups often have a distinctive background dimming effect defined
      // in overlay.modal, and do not allow press or release events through to
      // items beneath them.
      //
      // On desktop platforms, it is common for modal popups
      // to be closed only when the escape key is pressed. To achieve this
      // behavior, set closePolicy to Popup.CloseOnEscape.
      modal : {
        type    : Boolean,
        default : false,
      },
      // The popup will close when the mouse is click outside of it.
      closeOnClickOutside : {
        type    : Boolean,
        default : false,
      },
      // The popup will close when the escape key is pressed while the popup has
      // active focus.
      closeOnEscape : {
        type    : Boolean,
        default : false,
      },
      // Content Slot for function useage.
      content : {
        type    : Function,
        default : undefined,
      },
    },

    watch : {
      visable(val) {
        const type = val ? 'open' : 'close';
        this[type]();
        this.$emit(type);
      },
    },

    mounted() {
      if (this.value || this.visable) {
        this.open();
      }
    },

    activated() {
      if (this.value || this.visable) {
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
        if (this.$isServer || this.opened) return;
        if (this.opened) return;

        // create overlay
        if (this.overlay) {
          // TBD
          overlay = null;
        }
        // update z-index
        this.overlayIndex = ++popupId;

        this.opened = true;
        this.$emit('change', this.opened);
      },
      close() {
        if (!this.opened) return;

        // destroy overlay
        if (this.overlay) {
          overlay = null;
        }

        this.opened = false;
        this.$emit('change', this.opened);
      },
    },

    afterRender(vnode: VNode) {
      // inject overlay
      (vnode.children || (vnode.children = [])).unshift(
        this.$createElement(Overlay),
      );
    },
  });
}
