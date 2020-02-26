import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('thumbnail');

export default createComponent({
  functional : true,

  render(h, { data, slots }) {
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
