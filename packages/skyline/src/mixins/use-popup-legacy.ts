import Vue from 'vue';
import { createMixins } from 'skyline/src/utils/mixins';
import { useLazy } from 'skyline/src/mixins/use-lazy';
import { useRemote } from 'skyline/src/mixins/use-remote';
import { useModel } from 'skyline/src/mixins/use-model';
import { useClickOutside } from 'skyline/src/mixins/use-click-outside';
import { useTransition } from 'skyline/src/mixins/use-transition';
import {
  PopupInterface,
  popupStack,
} from 'skyline/src/utils/popup';
import { isDef } from 'skyline/src/utils/helpers';
import { Overlay } from 'skyline/src/components/overlay';

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
  zIndex: number | string;
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

    beforeMount() {
      this.$on('overlay-tap', () => {
        if (!this.closeOnClickOutside) return;
        this.visible = false;
      });

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
