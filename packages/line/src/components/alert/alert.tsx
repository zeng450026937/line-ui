import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { Overlay } from '@line-ui/line/src/components/overlay';
import { safeCall } from '@line-ui/line/src/utils/helpers';
import { iosEnterAnimation } from '@line-ui/line/src/components/alert/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/alert/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/alert/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/alert/animations/md.leave';
import {
  AlertButton,
  AlertInput,
} from '@line-ui/line/src/components/alert/alert-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('alert');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ usePopup()],

  props: {
    header: String,
    subHeader: String,
    message: String,
    inputs: Array,
    buttons: Array,
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl));
    });
  },

  computed: {
    normalizedButtons() {
      const { buttons = [] } = this as { buttons: (string | AlertButton)[] };
      return buttons.map((btn) => {
        return typeof btn === 'string'
          ? {
              text: btn,
              role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined,
            }
          : btn;
      });
    },

    normalizedInputs() {
      const { inputs = [] } = this as { inputs: AlertInput[] };
      // An alert can be created with several different inputs. Radios,
      // checkboxes and inputs are all accepted, but they cannot be mixed.
      const inputTypes = new Set(inputs.map((i) => i.type));
      if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
        __DEV__ &&
          console.warn(
            `Alert cannot mix input types: ${Array.from(
              inputTypes.values()
            ).join('/')}. Please see alert docs for more info.`
          );
      }
      return inputs.map(
        (i, index) =>
          ({
            type: i.type || 'text',
            name: i.name || `${index}`,
            placeholder: i.placeholder || '',
            value: i.value,
            label: i.label,
            checked: !!i.checked,
            disabled: !!i.disabled,
            handler: i.handler,
            min: i.min,
            max: i.max,
          } as AlertInput)
      );
    },

    cachedButtons() {
      return (
        <div
          class={bem('button-group', {
            vertical: this.normalizedButtons.length > 2,
          })}
        >
          {this.normalizedButtons.map((button) => (
            <button
              type="button"
              tabIndex={0}
              class={[bem('button'), 'line-focusable', 'line-activatable']}
              onClick={() => this.buttonClick(button)}
            >
              <span class={bem('button-inner')}>{button.text}</span>
            </button>
          ))}
        </div>
      );
    },
  },

  methods: {
    onTap() {
      this.$emit('overlay-tap');
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

    async callButtonHandler(button: AlertButton | undefined) {
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
  },

  render() {
    const { header, subHeader } = this;
    return (
      <div
        v-show={this.visible}
        role="dialog"
        aria-modal="true"
        class={bem({
          translucent: this.translucent,
        })}
      >
        <Overlay visible={this.dim} onTap={this.onTap}></Overlay>

        <div class={bem('wrapper')}>
          <div class={bem('head')}>
            {this.slots('header') ||
              (header && <h2 class={bem('title')}>{header}</h2>)}
            {this.slots('subHeader') ||
              (subHeader && <h2 class={bem('sub-title')}>{subHeader}</h2>)}
          </div>

          <div class={bem('message')}>{this.slots() || this.message}</div>

          {this.cachedButtons}
        </div>
      </div>
    );
  },
});
