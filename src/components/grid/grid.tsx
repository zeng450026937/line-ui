import { createNamespace } from '@/utils/namespace';
import '@/components/grid/grid.scss';

const [createComponent, bem] = createNamespace('grid');

export default createComponent({
  functional : true,

  props : {
    fixed : Boolean,
  },

  render(h, { props, data, slots }) {
    return (
      <div
        class={bem({
          fixed : props.fixed,
        })}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
