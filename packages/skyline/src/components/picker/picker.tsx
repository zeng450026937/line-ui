import { createNamespace } from 'skyline/src/utils/namespace';
import { CssClassMap } from 'skyline/src/types/interface';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { Overlay } from 'skyline/src/components/overlay';
import { PickerColumn } from 'skyline/src/components/picker-column';
import { iosEnterAnimation } from 'skyline/src/components/picker/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/picker/animations/ios.leave';
import { PickerButton } from 'skyline/src/components/picker/picker-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('picker');

const buttonWrapperClass = (button: PickerButton): CssClassMap => {
  return {
    [`picker-toolbar-${ button.role }`] : button.role !== undefined,
    'picker-toolbar-button'             : true,
  };
};

// TODO
const safeCall = (handler: any, arg?: any) => {
  if (typeof handler === 'function') {
    try {
      return handler(arg);
    } catch (e) {
      console.error(e);
    }
  }
  return undefined;
};

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
  ],

  props : {
    overlayIndex  : Number,
    keyboardClose : {
      type    : Boolean,
      default : true,
    },
    buttons : {
      type    : Array,
      default : () => [],
    },
    columns : {
      type    : Array,
      default : () => [],
    },
    cssClass : {
      type    : Array,
      default : () => [],
    },
    duration : {
      type    : Number,
      default : 0,
    },
    showBackdrop : {
      type    : Boolean,
      default : true,
    },
    backdropDismiss : {
      type    : Boolean,
      default : true,
    },
    animated : {
      type    : Boolean,
      default : true,
    },
  },

  data() {
    return {
      presented : true,
    };
  },

  beforeMount() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
    });
  },

  methods : {
    async buttonClick(button: PickerButton) {
      const { role } = button;
      if (role === 'cancel') {
        return this.close(role);
      }
      const shouldDismiss = await this.callButtonHandler(button);
      if (shouldDismiss) {
        return this.close(button.role);
      }
      return Promise.resolve();
    },

    async callButtonHandler(button: PickerButton | undefined) {
      if (button) {
        // a handler has been provided, execute it
        // pass the handler the values from the inputs
        const rtn = await safeCall(button.handler, this.getSelected());
        if (rtn === false) {
        // if the return value of the handler is false then do not dismiss
          return false;
        }
      }
      return true;
    },

    getSelected() {
      const selected: { [k: string]: any } = {};
      this.columns.forEach((col: any, index: number) => {
        const selectedColumn = col.selectedIndex !== undefined
          ? col.options[col.selectedIndex]
          : undefined;
        selected[col.name] = {
          text        : selectedColumn ? selectedColumn.text : undefined,
          value       : selectedColumn ? selectedColumn.value : undefined,
          columnIndex : index,
        };
      });

      return selected;
    },

    onTap() {
      this.$emit('overlay-tap');
    },

    colChange(data: any) {
      this.$emit('colChange', data);
    },
  },

  render() {
    const {
      mode, overlayIndex, showBackdrop, backdropDismiss, visible, columns,
    } = this;

    return (
      <div
        aria-modal="true"
        v-show={visible}
        class={[
          bem(),
          {
            // Used internally for styling
            [`picker-${ mode }`] : true,
          },
        ]}
        style={{
          zIndex : `${ 20000 + overlayIndex }`,
        }}
      >
        <Overlay
          visible={showBackdrop}
          tappable={backdropDismiss}
          onTap={this.onTap}
        >
        </Overlay>
        <div class="picker-wrapper" role="dialog">
          <div class="picker-toolbar">
            {this.buttons.map((b: any) => (
              <div class={buttonWrapperClass(b)}>
                <button
                  type="button"
                  onClick={() => this.buttonClick(b)}
                  class={{
                    'picker-button'    : true,
                    'line-activatable' : true,
                  }}
                >
                  {b.text}
                </button>
              </div>
            ))}
          </div>
          <div class="picker-columns">
            <div class="picker-above-highlight"></div>
              {visible && columns.map((c: any) => (
              <PickerColumn
                onColChange={this.colChange}
                col={c}
              >
              </PickerColumn>))}
            <div class="picker-below-highlight"></div>
          </div>
        </div>
      </div>
    );
  },
});
