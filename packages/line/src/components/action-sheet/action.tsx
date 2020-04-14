import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { safeCall } from '@line-ui/line/src/utils/helpers';
import { ActionSheetButtonOption } from '@line-ui/line/src/components/action-sheet/action-sheet-interface';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('action');

export default /*#__PURE__*/ createComponent({
  inject: {
    Item: { default: undefined },
  },

  props: {
    option: Object,
  },

  methods: {
    async buttonClick(button: any) {
      const { role } = button;
      if (role === 'cancel') {
        return this.Item && this.Item.close(role);
      }

      const shouldClose = await this.callButtonHandler(button);
      if (shouldClose) {
        return this.Item && this.Item.close(button.role);
      }

      return Promise.resolve();
    },

    async callButtonHandler(button: ActionSheetButtonOption | undefined) {
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
    const { option = { role: '' } } = this;

    return (
      <button
        type="button"
        class={[bem({ [`${option.role}`]: !!option.role }), 'line-activatable']}
        onClick={() => this.buttonClick(option)}
      >
        <span class={bem('inner')}>{this.slots() || option.text}</span>
      </button>
    );
  },
});
