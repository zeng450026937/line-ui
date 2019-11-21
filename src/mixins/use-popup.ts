import Vue from 'vue';
import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { useClickOutside } from '@/mixins/use-click-outside';
import { useTransition } from '@/mixins/use-transition';
import { isDef } from '@/utils/helpers';
import { Overlay } from '@/components/overlay';
import { once } from '@/utils/dom/event';
import { createAnimation } from '@/utils/animation';
import { Animation } from '@/utils/animation/animation-interface';

let popupId = 0;

export interface PopupOptions {
  scoped?: boolean;
}

const getAppRoot = (doc: Document = document) => {
  return doc.querySelector('[line-app]') || doc.body;
};
const getAnimationDuration = (el: Element) => {
  const style = window.getComputedStyle(el);
  return style.getPropertyValue('animation-duration')
   || style.getPropertyValue('transition-duration');
};
const getIndex = () => {
  return `${ 2000 + popupId++ }`;
};

const popupStack = [] as Array<any>;
const overlayStack = [] as Array<any>;
let overlay: Vue & { value: boolean, zIndex: Number | String } | null;

export function usePopup(options?: PopupOptions) {
  const { scoped = false } = options || {};
  let opened = false;
  let closed = true;

  async function openOverlay(baseEl: Element) {
    if (!overlay) {
      overlay = new (Vue.extend(Overlay))({
        propsData : {
          transition : 'line-fade',
        },
      });
      overlay.$mount();
    }

    const parent = scoped ? baseEl.parentNode! : getAppRoot();
    // parent.appendChild(overlay.$el);
    parent.insertBefore(overlay.$el, parent.firstChild);

    opened = false;
    closed = false;

    overlay.$once('after-enter', () => {
      opened = true;
      closed = false;
    });
    overlay.value = true;

    // const animation = createAnimation()
    //   .addElement(overlay.$el)
    //   .fromTo('opacity', 0, 1)
    //   .easing('cubic-bezier(0.36,0.66,0.04,1)')
    //   .duration(1400);

    // await animation.play();
    // opened = true;
    // closed = false;
  }
  async function closeOverlay() {
    if (!overlay) return;
    opened = false;
    closed = false;

    overlay.$once('after-leave', () => {
      opened = false;
      closed = true;
      if (!overlay) return;
      // overlay!.$el.remove();
      // overlay!.$destroy();
      // overlay = null;
      if (popupStack.length === 0) {
        overlay.$el.remove();
        overlay.$destroy();
        overlay = null;
      }
    });
    overlay.value = false;
    // const animation = createAnimation()
    //   .addElement(overlay.$el)
    //   .fromTo('opacity', 1, 0)
    //   .easing('ease-out')
    //   .duration(1250);

    // await animation.play();

    // opened = false;
    // closed = true;
    // overlay.value = false;

    // if (popupStack.length === 0) {
    //   overlay!.$el.remove();
    //   overlay!.$destroy();
    //   overlay = null;
    // }
  }

  return createMixins({
    mixins : [
      useRemote(),
      useLazy(),
      useModel('visible'),
      useClickOutside(),
      useTransition(),
    ],

    props : {
      transition : {
        type    : String,
        default : 'line-fade',
      },
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

        popupStack.push(this);
        popupId++;

        await this.$nextTick();
        openOverlay(this.$el);
        (this.$el as HTMLElement).style.zIndex = String(overlay.zIndex);
      },
      async close() {
        if (this.$isServer) return;
        if (closed) return;

        const index = popupStack.indexOf(this);
        popupStack.splice(index, 1);
        popupId--;

        await this.$nextTick();
        closeOverlay();
      },
      focous() {
        // focus content element or focusable element in content element
        // shake dialog
        // TBD
        this.$el && (this.$el as HTMLElement).focus();
      },
    },
  });
}
