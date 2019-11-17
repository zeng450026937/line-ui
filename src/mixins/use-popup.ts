import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { useOverlay } from '@/mixins/use-overlay';
import { useClickOutside } from '@/mixins/use-click-outside';

let popupId = 0;

export function usePopup() {
  return createMixins({
    mixins : [
      useRemote(),
      useLazy(),
      useModel('visable'),
      useOverlay(),
      useClickOutside(),
    ],

    props : {
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
    },

    watch : {
      value(val) {
        const action = val ? 'open' : 'close';
        this[action]();
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
      async open() {
        if (this.$isServer) return;
        if (this.visable) return;

        // create overlay
        if (this.overlay) {
          // TBD
          null;
        }
        // update z-index
        this.overlayIndex = ++popupId;

        this.visable = true;
        this.$emit('aboutToShow');

        // when animation finish
        this.opened = true;
        this.$emit('opened');
      },
      async close() {
        if (!this.visable) return;

        // destroy overlay
        if (this.overlay) {
          // TBD
          null;
        }

        this.visable = false;
        this.$emit('aboutToHide');

        // when animation finish
        this.opened = false;
        this.$emit('closed');
      },
      focous() {
        // focus content element or focusable element in content element
        // TBD
      },

      onClickOutside() {
        if (!this.closeOnClickOutside) return;
        this.visable = false;
      },
    },
  });
}
