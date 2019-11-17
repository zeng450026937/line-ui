/* eslint-disable import/extensions */
import { VNode } from 'vue/types/vnode';
/* eslint-enable import/extensions */
import { createMixins } from '@/utils/mixins';
import { NOOP } from '@/utils/helpers';
import { GESTURE_CONTROLLER } from '@/utils/gesture';
import Overlay from '@/components/overlay/overlay';

export function useOverlay() {
  const blocker = GESTURE_CONTROLLER.createBlocker({
    disableScroll : true,
  });
  return createMixins({
    props : {
      // This property holds whether the popup translucent the background.
      overlay : {
        type    : Boolean,
        default : true,
      },
      // This property holds whether the popup dims the background.
      // Unless explicitly set, this property follows the value of modal.
      dim : {
        type    : Boolean,
        default : undefined,
      },
      // This property holds whether the popup translucent the background.
      translucent : {
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
    },

    methods : {
      onOverlayTap : NOOP,
    },

    afterRender(vnode: VNode) {
      if (!this.overlay) return;
      // Injdect overlay
      const data = {
        pros : {
          visable         : this.modal,
          dim             : this.modal && this.dim,
          translucent     : this.modal && this.translucent,
          stopPropagation : this.modal,
        },
        on : { tap: this.onOverlayTap },
      };
      (vnode.children || (vnode.children = []))
        .unshift(this.$createElement(Overlay, data));
    },
  });
}
