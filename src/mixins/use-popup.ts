import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { useTransition } from '@/mixins/use-transition';
import { popupStack, PopupInterface } from '@/utils/popup';
import { GESTURE_CONTROLLER } from '@/utils/gesture';
import { AnimationBuilder } from '@/utils/animation';
import { config } from '@/utils/config';
import { isDef } from '@/utils/helpers';

export interface PopupOptions {
  disableScroll?: boolean;
}

function prepare(baseEl: HTMLElement) {
  baseEl.style.zIndex = String(popupStack.length + 2000);
}

export function usePopup(options?: PopupOptions) {
  const { disableScroll = true } = options || {};
  let closeReason: any;
  let animation: any;

  async function animate(
    baseEl: HTMLElement,
    popup: PopupInterface,
    builder: { build: AnimationBuilder, options?: any },
  ): Promise<boolean> {
    const {
      build: animationBuilder,
      options,
    } = builder;

    animation = animationBuilder(baseEl, options);

    if (popup.transition || !config.getBoolean('animated', true)) {
      animation.duration(0);
    }

    if (popup.closeOnEscape) {
      animation.beforeAddWrite(() => {
        const activeElement = baseEl.ownerDocument!.activeElement as HTMLElement;
        if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
          activeElement.blur();
        }
      });
    }

    await animation.play();

    animation = null;
    return true;
  }

  return createMixins({
    mixins : [
      useLazy(),
      useRemote(),
      useModel('visible'),
      // Alway use transition
      // as our lifecycle event depends on it
      useTransition({ css: false }),
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
      // This property holds whether the popup translucent the content.
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

    created() {
      // This property holds whether the popup is fully open. The popup is considered opened when it's visible
      // and neither the enter nor exit transitions are running.
      this.opened = false;
      // Scroll blocker
      this.blocker = GESTURE_CONTROLLER.createBlocker({
        disableScroll,
      });
      // internal flag
      this.destroyWhenClose = false;

      const onBeforeEnter = () => {
        this.blocker.block();
        this.$emit('aboutToShow');

        popupStack.push(this as any);
      };
      const onEnter = async (el: HTMLElement, done: Function) => {
        // Ensure element & element's child is inserted as animation may need to calc element's size
        await this.$nextTick();

        prepare(el);

        const builder = {};
        this.$emit('animation:enter', builder);

        try {
          await animate(el, this as any, builder as any);
        } catch (e) {
          console.error(e);
        }

        done();
      };
      const onAfterEnter = () => {
        this.opened = true;
        this.$emit('opened');
      };

      const onBeforeLeave = () => {
        this.$emit('aboutToHide');
        this.opened = false;
      };
      const onLeave = async (el: HTMLElement, done: Function) => {
        const builder = {};
        this.$emit('animation:leave', builder);

        try {
          await animate(el, this as any, builder as any);
        } catch (e) {
          console.error(e);
        }

        done();
      };
      const onAfterLeave = async () => {
        popupStack.splice(popupStack.indexOf(this as any), 1);

        this.$emit('closed', closeReason);
        this.blocker.unblock();

        if (this.destroyWhenClose) {
          await this.$nextTick();
          this.$destroy();
          this.$el.remove();
        }
      };

      const onCancel = async () => {
        if (!animation) return;
        animation.destroy();
        animation = null;
      };

      this.$on('before-enter', onBeforeEnter);
      this.$on('after-enter', onAfterEnter);

      this.$on('before-leave', onBeforeLeave);
      this.$on('after-leave', onAfterLeave);

      this.$on('enter', onEnter);
      this.$on('enter-cancelled', onCancel);
      this.$on('leave', onLeave);
      this.$on('leave-cancelled', onCancel);

      // TODO:
      // Find some way to create overlay inside mixins
      const onTap = () => {
        if (!this.closeOnClickOutside) return;
        this.visible = false;
      };
      this.$on('overlay:tap', onTap);
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
      async open(ev?: Event) {
        if (this.$isServer) return;
        if (this.opened) return;

        this.event = ev;
        this.inited = true;
        this.visible = true;

        // this.blocker.block();
      },
      async close(reason?: any) {
        if (this.$isServer) return;
        if (!this.opened) return;

        this.visible = false;
        closeReason = reason;

        // this.blocker.unblock();
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
