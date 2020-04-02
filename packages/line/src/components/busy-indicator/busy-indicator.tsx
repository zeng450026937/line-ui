import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('busy-indicator');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    running : Boolean,
  },

  render(h, { props, data, slots }) {
    const { running } = props;
    return (
      <div
        class={bem({ running })}
        {...data}
      >
        { slots() }
      </div>
    );
  },
});
