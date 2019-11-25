import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { popupStack, PopupInterface } from '@/utils/popup';
import { isDef } from '@/utils/helpers';
import { createAnimation } from '@/utils/animation';

function getZIndex() {
  return String(popupStack.length + 2000);
}

export function usePopup() {
  let opened = false;

  return createMixins({
    mixins : [
      useRemote(),
      useLazy(),
      useModel('visible'),
    ],

    props : {
      // This property holds whether the popup show the overlay.
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
      // The popup will close when the mouse is click outside of it.
      closeOnClickOutside : {
        type    : Boolean,
        default : true,
      },
      // The popup will close when the escape key is pressed while the popup has
      // active focus.
      closeOnEscape : {
        type    : Boolean,
        default : true,
      },
    },

    watch : {
      visible(val) {
        const action = val ? 'open' : 'close';
        this[action]();
      },
    },

    created() {
      this.$on('overlay:tap', () => {
        if (!this.closeOnClickOutside) return;
        this.visible = false;
      });
    },

    beforeMount() {
      this.visible = this.inited = this.visible || (
        isDef(this.$attrs.visible)
          && (this.$attrs.visible as string | boolean) !== false
      );
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
        if (opened) return;

        this.visible = true;

        opened = false;
        this.$emit('aboutToShow');

        await this.$nextTick();

        // TODO: find some a way to know animation end
        // or if there is no animation, fire immediately
        opened = true;
        this.$emit('opened');
      },
      async close() {
        if (this.$isServer) return;
        if (!opened) return;

        this.visible = false;

        opened = false;
        this.$emit('aboutToHide');

        await this.$nextTick();

        // TODO: find some a way to know animation end
        // or if there is no animation, fire immediately
        opened = false;
        this.$emit('closed');
      },
      focous() {
        const firstInput = this.$el.querySelector('input,button') as HTMLElement | null;
        if (firstInput) {
          firstInput.focus();
        }
      },
    },
  });
}
