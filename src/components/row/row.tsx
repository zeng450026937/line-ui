import { createNamespace } from '@/utils/namespace';
import '@/components/row/row.scss';

const [createComponent, bem] = createNamespace('row');

export default createComponent({
  functional : true,

  render(h, { props, data, slots }) {
    return (
      <div
        class={bem()}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
