import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { Overlay } from '@/components/overlay';
import '@/components/alert/alert.scss';
import '@/components/alert/alert.ios.scss';
import { iosEnterAnimation } from '@/components/alert/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/alert/animations/ios.leave';
import { mdEnterAnimation } from '@/components/alert/animations/md.enter';
import { mdLeaveAnimation } from '@/components/alert/animations/md.leave';
import { AlertButton, AlertInput } from '@/components/alert/alert-interface';

const [createComponent, bem] = createNamespace('alert');

export const isCancel = (role: string | undefined): boolean => {
  return role === 'cancel' || role === 'overlay';
};

export default createComponent({
  mixins : [usePopup()],

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

  created() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
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
                  'ion-focusable',
                  'activatable',
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
