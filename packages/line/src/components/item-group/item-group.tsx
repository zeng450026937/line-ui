import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('item-group');

export default /*#__PURE__*/ createComponent({
  render() {
    const { mode } = this;

    return (
      <div
        class={[
          bem({
            // Used internally for styling
            [`${mode}`]: true,
          }),
        ]}
      >
        {this.slots()}
      </div>
    );
  },
});
