import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('busy-indicator');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    running : Boolean,
  },

  render(h, { props, data, slots }) {
    return (
      <div
        class={bem({ running: props.running })}
        {...data}
      >
        { slots() }
      </div>
    );
  },
});
