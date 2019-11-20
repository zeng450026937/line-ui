import { createMixins } from '@/utils/mixins';
import { useLazy } from '@/mixins/use-lazy';
import { useRemote } from '@/mixins/use-remote';
import { useModel } from '@/mixins/use-model';
import { useOptions } from '@/mixins/use-options';
import { useClickOutside } from '@/mixins/use-click-outside';
import { isDef } from '@/utils/helpers';
import { Overlay } from '@/components/overlay';
import { createDelegate } from '@/utils/functional';
import { once } from '@/utils/dom/event';

let popupId = 0;

type PopupType = 'scoped' | 'parent' | 'app' | 'body';

export interface PopupOptions {
  type?: PopupType;
}

function getAnchor(el: Element, type: PopupType) {
  const parent = type === 'scoped'
    ? el
    : type === 'parent'
      ? el.parentNode
      : type === 'app'
        ? document.querySelector('[line-app]')
        : null;
  return parent || document.body;
}

export function usePopup(options?: PopupOptions) {
  const { type = 'app' } = options || {};
  const scoped = type === 'scoped';
  const delegate = createDelegate(Overlay);
  let opened = false;
  let closed = true;

  return createMixins({
    mixins : [
      useRemote(),
      useLazy(),
      useModel('visable'),
      useClickOutside(),
      useOptions(['center', 'top', 'right', 'down', 'left'], 'position'),
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
      visable(val) {
        const action = val ? 'open' : 'close';
        this[action]();
      },
    },

    beforeMount() {
      this.visable = this.inited = this.visable || (
        isDef(this.$attrs.visable)
          && (this.$attrs.visable as string | boolean) !== false
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
      delegate.destroy();
      this.close();
    },

    methods : {
      async open() {
        if (this.$isServer) return;
        if (opened) return;
        if (!this.visable) {
          this.visable = true;
          return;
        }

        this.$nextTick(() => {
          if (!delegate.mounted()) {
            delegate.on({
              click : this.onOverlayTap,
            });
            delegate.style({
              zIndex   : 0,
              opacity  : 0,
              position : 'absolute',
            });
            delegate.mount();
            const parent = getAnchor(this.$el, type);
            parent.insertBefore(delegate.el!, parent.firstChild);
          }
          // update z-index
          (this.$el as HTMLElement).style.zIndex = String(++popupId + 1000);

          if (!scoped) {
            requestAnimationFrame(() => {
              delegate.style({
                zIndex   : popupId + 1000,
                opacity  : 0.45,
                position : 'fixed',
              });
            });
          }
        });
      },
      async close() {
        if (this.$isServer) return;
        if (closed) return;
        if (this.visable) {
          this.visable = false;
          return;
        }
        if (delegate.mounted()) {
          delegate.style({
            zIndex   : popupId + 1000,
            opacity  : 0,
            position : scoped ? 'absolute' : 'fixed',
          });
          once(delegate.el!, 'transitionend', () => {
            if (this.visable) return;
            delegate.destroy();
          });
        }
      },

      onBeforeEnter() {
        opened = false;
        closed = false;
        this.$emit('aboutToShow');
      },
      onAfterEnter() {
        opened = true;
        closed = false;
        this.$emit('opened');
      },
      onBeforeLeave() {
        opened = false;
        closed = false;
        this.$emit('aboutToHide');
      },
      onAfterLeave() {
        opened = false;
        closed = true;
        this.$emit('closed');
      },
      onOverlayTap() {
        if (!this.closeOnClickOutside) return;
        this.visable = false;
      },
      onClickOutside() {
        if (!this.closeOnClickOutside) return;
        this.visable = false;
      },
    },

    afterRender(vnode, ctx) {
      const { position } = ctx;
      const transition = position === 'center'
        ? 'line-fade'
        : `line-slide-${ position }`;

      console.log(position, transition);
      const data = {
        props : {
          name   : transition,
          appear : true,
          // css    : false,
        },
        on : {
          'before-enter' : this.onBeforeEnter,
          'after-enter'  : this.onAfterEnter,
          'before-leave' : this.onBeforeLeave,
          'after-leave'  : this.onAfterLeave,
        },
      };
      return this.$createElement(
        'transition', data, [vnode],
      );
    },
  });
}
