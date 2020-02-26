import { createNamespace } from '@/utils/namespace';
import { createColorClasses } from '@/mixins/use-color';

const [createComponent, bem] = createNamespace('note');

export default createComponent({
  functional : true,

  props : {
    color : String,
  },

  render(h, { props, data, slots }) {
    return (
      <div
        class={[bem(), createColorClasses(props.color)]}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
