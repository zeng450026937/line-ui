import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('busy-indicator');

export default createComponent({
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
