import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { usePopupDuration } from '@line-ui/line/src/mixins/use-popup-duration';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { safeCall, isObject } from '@line-ui/line/src/utils/helpers';
// TODO html sanitize
// import { sanitizeDOMString } from '@line-ui/line/src/utils/sanitization';
import { Icon } from '@line-ui/line/src/components/icon';
import { iosEnterAnimation } from '@line-ui/line/src/components/toast/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/toast/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/toast/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/toast/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('toast');

// TODO
interface ToastButton {
  text?: string;
  icon?: string | { name?: string; src?: string };
  side?: 'start' | 'end';
  role?: 'cancel' | string;
  cssClass?: string | string[];
  handler?: () => boolean | void | Promise<boolean>;
}

const buttonClass = (button: ToastButton): Record<string, any> => {
  return {
    'line-toast-button': true,
    'line-toast-button--icon-only':
      button.icon !== undefined && button.text === undefined,
    [`line-toast-button--${button.role}`]: button.role !== undefined,
    'line-focusable': true,
    'line-activatable': true,
    // ...getClassMap(button.cssClass),
  };
};

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ usePopup(),
    /*#__PURE__*/ usePopupDuration(),
    /*#__PURE__*/ useColor(),
  ],

  props: {
    /**
     * The position of the toast on the screen.
     */
    // top | bottom | middle
    position: String,
    message: String,
    header: String,
    buttons: Array,
  },

  methods: {
    getButtons(): ToastButton[] {
      const buttons = this.buttons
        ? this.buttons.map((b) => {
            return typeof b === 'string' ? { text: b } : b;
          })
        : [];

      return buttons as ToastButton[];
    },

    async buttonClick(button: any) {
      const { role } = button;
      if (role === 'cancel') {
        return this.close(role);
      }

      const shouldClose = await this.callButtonHandler(button);
      if (shouldClose) {
        return this.close(button.role);
      }

      return Promise.resolve();
    },

    async callButtonHandler(button: ToastButton | undefined) {
      if (button) {
        // a handler has been provided, execute it
        // pass the handler the values from the inputs
        try {
          const rtn = await safeCall(button.handler);
          if (rtn === false) {
            // if the return value of the handler is false then do not dismiss
            return false;
          }
        } catch (error) {
          __DEV__ && console.error(error);
        }
      }

      return true;
    },

    dispatchCancelHandler(ev: CustomEvent) {
      const { role } = ev.detail;
      if (role === 'cancel' || role === 'overlay') {
        const cancelButton = this.getButtons().find((b) => b.role === 'cancel');
        this.callButtonHandler(cancelButton);
      }
    },

    renderButtons(buttons: ToastButton[], side: 'start' | 'end') {
      if (buttons.length === 0) {
        return;
      }

      // TODO md ripple
      // const { mode } = this;
      const buttonGroupsClasses = {
        'line-toast-button-group': true,
        [`line-toast-button-group--${side}`]: true,
      };
      return (
        <div class={buttonGroupsClasses}>
          {buttons.map((b) => (
            <button
              type="button"
              class={buttonClass(b)}
              tabIndex={0}
              onClick={() => this.buttonClick(b)}
              part="button"
            >
              <div class="line-toast-button__inner">
                {b.icon && isObject(b.icon) ? (
                  <Icon
                    class="line-toast-icon"
                    slot={b.text === undefined ? 'icon-only' : undefined}
                    name={b.icon.name || ''}
                    src={b.icon.src || ''}
                  />
                ) : (
                  <Icon
                    class="line-toast-icon"
                    slot={b.text === undefined ? 'icon-only' : undefined}
                    name={b.icon}
                  />
                )}
                {b.text}
              </div>
              {/* TODO line-ripple-effect */}
            </button>
          ))}
        </div>
      );
    },
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl, this.position));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl, this.position));
    });

    this.$on('opened', () => {
      if (this.duration > 0) {
        this.durationTimeout = setTimeout(
          () => this.close('timeout'),
          this.duration
        );
      }
    });
    this.$on('aboutToHide', () => {
      if (this.durationTimeout) {
        clearTimeout(this.durationTimeout);
      }
    });
  },

  render() {
    const { position = 'bottom' } = this;
    const allButtons = this.getButtons();
    const startButtons = allButtons.filter((b) => b.side === 'start');
    const endButtons = allButtons.filter((b) => b.side !== 'start');

    return (
      <div v-show={this.visible} class={[bem()]} on={this.$listeners}>
        <div class={bem('wrapper', { [position]: true })}>
          <div class={bem('container')}>
            {this.renderButtons(startButtons, 'start')}

            <div class={bem('content')}>
              {this.header !== undefined && (
                <div class={bem('header')}>{this.header}</div>
              )}
              <div
                class={bem('message')}
                domPropsInnerHTML={this.message}
              ></div>
            </div>

            {this.renderButtons(endButtons, 'end')}
          </div>
        </div>
      </div>
    );
  },
});
