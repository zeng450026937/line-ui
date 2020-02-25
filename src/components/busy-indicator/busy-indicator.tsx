import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('busy-indicator');

export default createComponent({
  functional : true,

  props : {
    running : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, slots }) {
    return (
      <div class={bem({ running: props.running })}>
        { slots() }
      </div>
    );
  },
});
