import { createNamespace } from 'skyline/src/utils/namespace';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { Overlay } from 'skyline/src/components/overlay';
import { iosEnterAnimation } from 'skyline/src/components/alert/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/alert/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/src/components/alert/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/src/components/alert/animations/md.leave';
import { AlertButton, AlertInput } from 'skyline/src/components/alert/alert-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('alert');

export const isCancel = (role: string | undefined): boolean => {
  return role === 'cancel' || role === 'overlay';
};

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
  ],

  props : {
    header    : String,
    subHeader : String,
    message   : String,
    inputs    : Array,
    buttons   : {
      type    : Array,
      default : [],
    },
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (builder: any) => {
      builder.build = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
    });
  },

  computed : {
    normalizedButtons() {
      const { buttons = [] } = this as { buttons: (string | AlertButton)[] };
      return buttons.map(btn => {
        return (typeof btn === 'string')
          ? { text: btn, role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined }
          : btn;
      });
    },

    normalizedInputs() {
      const { inputs = [] } = this as { inputs: AlertInput[] };
      // An alert can be created with several different inputs. Radios,
      // checkboxes and inputs are all accepted, but they cannot be mixed.
      const inputTypes = new Set(inputs.map(i => i.type));
      if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
        console.warn(`Alert cannot mix input types: ${ (Array.from(inputTypes.values()).join('/')) }. Please see alert docs for more info.`);
      }
      return inputs.map((i, index) => ({
        type        : i.type || 'text',
        name        : i.name || `${ index }`,
        placeholder : i.placeholder || '',
        value       : i.value,
        label       : i.label,
        checked     : !!i.checked,
        disabled    : !!i.disabled,
        handler     : i.handler,
        min         : i.min,
        max         : i.max,
      }) as AlertInput);
    },

    cachedButtons() {
      return (
        <div
          class={bem('button-group', { vertical: this.normalizedButtons.length > 2 })}
        >
          {
            this.normalizedButtons.map((button) => (
              <button
                type="button"
                tabIndex={0}
                class={[
                  bem('button'),
                  'line-focusable',
                  'line-activatable',
                ]}
                onClick={() => this.onButtonClick(button)}
              >
                <span class={bem('button-inner')}>
                  {button.text}
                </span>
              </button>
            ))
          }
        </div>
      );
    },
  },

  methods : {
    onTap() {
      this.$emit('overlay-tap');
    },

    /* eslint-disable-next-line consistent-return */
    onButtonClick(button: AlertButton) {
      const { role } = button;
      // const values = this.getValues();
      if (isCancel(role)) {
        return this.close(role);
      }
      let returnData;
      if (button && button.handler) {
        // a handler has been provided, execute it
        // pass the handler the values from the inputs
        try {
          returnData = button.handler(role);
        } catch (error) {
          console.error(error);
        }
      }
      if (returnData !== false) {
        return this.close(role);
      }
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
          translucent : this.translucent,
        })}
      >
        <Overlay
          visible={this.dim}
          onTap={this.onTap}
        >
        </Overlay>

        <div
          class={bem('wrapper')}
        >
          <div
            class={bem('head')}
          >
            {header && <h2 class={bem('title')}>{header}</h2>}
            {subHeader && <h2 class={bem('sub-title')}>{subHeader}</h2>}
          </div>

          <div
            class={bem('message')}
          >
            {this.message}
          </div>

          {/* <div
            class={bem('checkbox-group')}
          >
          </div>
          <div
            class={bem('radio-group')}
          >
          </div>
          <div
            class={bem('input-group')}
          >
          </div> */}

          {this.cachedButtons}
        </div>
      </div>
    );
  },
});
