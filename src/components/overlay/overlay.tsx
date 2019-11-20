import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('overlay');

export default createComponent({
  functional : true,

  props : {
    dim : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, data, slots }) {
    return (
      <div class={bem({ dim: props.dim })} {...data}>
        { slots('default', props) }
      </div>
    );
  },
});
