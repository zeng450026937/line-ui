import Vue from 'vue';
import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { useClickOutside } from '@/mixins/use-click-outside';
import { useTransition } from '@/mixins/use-transition';
import { popupStack, PopupInterface } from '@/utils/popup';
import { isDef } from '@/utils/helpers';
import { Overlay } from '@/components/overlay';

export interface PopupOptions {
  scoped?: boolean;
}

function getAppRoot(doc: Document = document) {
  return doc.querySelector('[skyline-app]') || doc.body;
}

function getZIndex() {
  return String(popupStack.length + 2000);
}

type OverlayInterface = Vue & {
  value: boolean;
  zIndex: Number | String;
  dim: boolean;
  translucent: boolean;
}

let appOverlay: OverlayInterface | null;

export function usePopup(options?: PopupOptions) {
  const { scoped = false } = options || {};
  let overlay: OverlayInterface | null;
  let opened = false;
  let closed = true;
  let zIndex: string | null;

  function createOverlay() {
    return new (Vue.extend(Overlay))({
      propsData : {
        transition : 'line-fade',
      },
    }).$mount();
  }

  let onTap: any;

  function openOverlay(vm: PopupInterface) {
    popupStack.push(vm);

    if (!overlay) {
      overlay = scoped
        ? createOverlay() as OverlayInterface
        : (appOverlay || (appOverlay = createOverlay() as OverlayInterface));
    }

    const parent = scoped ? vm.$el.parentNode! : getAppRoot();
    // parent.appendChild(overlay.$el);
    parent.insertBefore(overlay.$el, parent.firstChild);

    zIndex = getZIndex();

    overlay.zIndex = zIndex;
    overlay.value = true;

    (vm.$el as HTMLElement).style.zIndex = zIndex;

    if (onTap) {
      overlay.$off('tap', onTap);
      onTap = null;
    }
    onTap = (...args: any[]) => vm.$emit('overlay-tap', ...args);
    overlay.$on('tap', onTap);
  }

  function closeOverlay(vm: PopupInterface) {
    popupStack.splice(popupStack.indexOf(vm), 1);

    if (!overlay) return;

    overlay.$once('after-leave', () => {
      if (scoped || !!popupStack.length) return;

      overlay!.$el.remove();
      overlay!.$destroy();
      overlay = null;

      if (!scoped) {
        appOverlay = null;
      }
    });
    overlay.dim = vm.dim;
    overlay.zIndex = getZIndex();
    overlay.value = false;

    if (onTap) {
      overlay.$off('tap', onTap);
      onTap = null;
    }
  }

  return createMixins({
    mixins : [
      useLazy('visible'),
      useRemote(),
      useModel('visible'),
      useClickOutside(),
      useTransition(),
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
        this[val ? 'open' : 'close']();
      },
    },

    created() {
      this.$on('overlay-tap', () => {
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
        closed = false;
        this.$emit('aboutToShow');

        await this.$nextTick();

        openOverlay(this as any);

        // TODO: find some a way to know animation end
        // or if there is no animation, fire immediately
        opened = true;
        closed = false;
        this.$emit('opened');
      },
      async close() {
        if (this.$isServer) return;
        if (closed) return;

        this.visible = false;

        opened = false;
        closed = false;
        this.$emit('aboutToHide');

        await this.$nextTick();

        closeOverlay(this as any);

        // TODO: find some a way to know animation end
        // or if there is no animation, fire immediately
        opened = false;
        closed = true;
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
