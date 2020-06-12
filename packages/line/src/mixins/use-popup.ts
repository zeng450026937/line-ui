import { createMixins } from '@line-ui/line/src/utils/mixins';
import { useLazy } from '@line-ui/line/src/mixins/use-lazy';
import { useModel } from '@line-ui/line/src/mixins/use-model';
import { useRemote } from '@line-ui/line/src/mixins/use-remote';
import { useTransition } from '@line-ui/line/src/mixins/use-transition';
import { popupContext } from '@line-ui/line/src/utils/popup';
import { GESTURE_CONTROLLER } from '@line-ui/line/src/utils/gesture';
import { config } from '@line-ui/line/src/utils/config';
import { Animation, createAnimation } from '@line-ui/line/src/utils/animation';
import { isDef, NOOP } from '@line-ui/line/src/utils/helpers';

export interface PopupOptions {
  disableScroll?: boolean;
}

export function usePopup(options?: PopupOptions) {
  const { disableScroll = true } = options || {};

  return createMixins({
    mixins: [
      useLazy(),
      useModel('visible'),
      useRemote(),
      // Popup lifecycle events depend on Transition mechanism
      // Transition should not be disabled
      useTransition(),
    ],

    props: {
      // This property holds whether the popup show the overlay.
      overlay: {
        type: Boolean,
        default: true,
      },
      // This property holds whether the popup dims the background.
      // Unless explicitly set, this property follows the value of modal.
      dim: {
        type: Boolean,
        default: undefined,
      },
      // This property holds whether the popup translucent the content.
      translucent: {
        type: Boolean,
        default: false,
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
      modal: {
        type: Boolean,
        default: false,
      },
      // The popup will close when the mouse is click outside of it.
      closeOnClickOutside: {
        type: Boolean,
        default: true,
      },
      // The popup will close when the escape key is pressed while the popup has
      // active focus.
      closeOnEscape: {
        type: Boolean,
        default: true,
      },
      activeFocus: {
        type: Boolean,
        default: true,
      },
    },

    beforeMount() {
      // This property holds whether the popup is fully open.
      // The popup is considered opened when it's visible
      // and neither the enter nor exit transitions are running.
      this.opened = false;
      this.opening = false;
      this.closing = false;
      // Scroll blocker
      this.blocker = GESTURE_CONTROLLER.createBlocker({
        disableScroll,
      });
      // internal flag
      this.destroyWhenClose = false;

      const onBeforeEnter = () => {
        this.blocker.block();
        this.opened = false;
        this.opening = true;
        this.$emit('aboutToShow');
        popupContext.push(this as any);
      };
      const onEnter = async (el: HTMLElement, done: Function) => {
        // TODO
        // hide root element by add some classes
        //
        // Ensure element & element's child is inserted as animation may need to calc element's size
        await this.$nextTick();

        // update zIndex
        el.style.zIndex = `${popupContext.getOverlayIndex()}`;

        const animate = (animation: Animation) => {
          if (!config.getBoolean('animated', true)) {
            animation.duration(0);
          }
          this.animation = animation;
        };

        this.$emit('animation-enter', el, animate);

        await (this.animation as Animation)
          .play()
          .catch(__DEV__ ? (e) => console.error(e) : NOOP);

        done();
      };
      const onAfterEnter = () => {
        this.opened = true;
        this.opening = false;
        this.$emit('opened');
      };

      const onBeforeLeave = () => {
        this.opened = false;
        this.closing = true;
        this.$emit('aboutToHide');
      };
      const onLeave = async (el: HTMLElement, done: Function) => {
        const animate = (animation: Animation) => {
          if (!config.getBoolean('animated', true)) {
            animation.duration(0);
          }
          if (this.closeOnEscape) {
            animation.beforeAddWrite(() => {
              const activeElement = el.ownerDocument!
                .activeElement as HTMLElement;
              if (activeElement && activeElement.matches('input, textarea')) {
                activeElement.blur();
              }
            });
          }
          this.animation = animation;
        };

        this.$emit('animation-leave', el, animate);

        await (this.animation as Animation)
          .play()
          .catch(__DEV__ ? (e) => console.error(e) : NOOP);

        done();
      };
      const onAfterLeave = async () => {
        this.closing = false;

        popupContext.pop(this as any);

        this.$emit('closed');
        this.blocker.unblock();

        if (this.destroyWhenClose) {
          await this.$nextTick();

          this.$destroy();
          this.$el.remove();
        }
      };

      const onCancel = async () => {
        this.opening = false;
        this.closing = false;

        popupContext.pop(this as any);

        this.$emit('canceled');

        if (this.animation) {
          this.animation.stop();
          this.animation = null;
        }
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
      const onClickOutside = () => {
        if (!this.closeOnClickOutside) return;
        this.visible = false;
      };
      this.$on('overlay-tap', onClickOutside);
      this.$on('clickoutside', onClickOutside);

      this.visible = this.inited =
        this.visible ||
        (isDef(this.$attrs.visible) &&
          (this.$attrs.visible as string | boolean) !== false);
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

    methods: {
      open(ev?: Event) {
        if (this.opened) return false;

        this.event = ev;
        this.inited = true;
        this.visible = true;

        return true;
      },
      close() {
        if (!this.opened) return false;

        this.visible = false;

        return true;
      },
      focus() {
        // TODO
        // if modal
        // add shake animation
        const animate = (animation?: Animation) => {
          if (!animation) {
            animation = createAnimation();
            animation
              // TODO
              // fix shake animation
              .addElement(this.$el.querySelector('.line-tooltip__content')!)
              .easing('cubic-bezier(0.25, 0.8, 0.25, 1)')
              .duration(150)
              .beforeStyles({ 'transform-origin': 'center' })
              .keyframes([
                { offset: 0, transform: 'scale(1)' },
                { offset: 0.5, transform: 'scale(1.03)' },
                { offset: 1, transform: 'scale(1)' },
              ]);
          }
          if (!config.getBoolean('animated', true)) {
            animation.duration(0);
          }
          this.animation = animation;
        };
        this.$emit('animation-focus', this.$el, animate);

        (this.animation as Animation).play();

        const firstInput = this.$el.querySelector(
          'input, button'
        ) as HTMLElement | null;

        if (firstInput) {
          firstInput.focus();
        }
      },
    },
  });
}
