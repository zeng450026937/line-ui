import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { Overlay } from '@line-ui/line/src/components/overlay';
// TODO
import { safeCall } from '@line-ui/line/src/utils/helpers';
import { PickerColumn } from '@line-ui/line/src/components/picker-column';
import { PickerButton } from '@line-ui/line/src/components/picker/picker-interface';
import { iosEnterAnimation } from '@line-ui/line/src/components/picker/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/picker/animations/ios.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('picker');

const buttonWrapperClass = (button: PickerButton) => {
  return {
    [`line-picker__toolbar-${ button.role }`] : button.role !== undefined,
    'line-picker__toolbar-button'             : true,
  };
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
    buttons  : Array,
    columns  : Array,
    cssClass : Array,
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
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      animate(iosEnterAnimation(baseEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      animate(iosLeaveAnimation(baseEl));
    });
  },

  methods : {
    async buttonClick(button: PickerButton) {
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
          bem({
            mode : true,
          }),
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
        <div class={bem('wrapper')} role="dialog">
          <div class={bem('toolbar')}>
            {this.buttons.map((b: any) => (
              <div class={buttonWrapperClass(b)}>
                <button
                  type="button"
                  onClick={() => this.buttonClick(b)}
                  class={[
                    bem('button'),
                    { 'line-activatable': true },
                  ]}
                >
                  {b.text}
                </button>
              </div>
            ))}
          </div>
          <div class={bem('columns')}>
            <div class={bem('above-highlight')}></div>
              {visible && columns.map((c: any) => (
              <PickerColumn
                onColChange={this.colChange}
                col={c}
              >
              </PickerColumn>))}
            <div class={bem('below-highlight')}></div>
          </div>
        </div>
      </div>
    );
  },
});
