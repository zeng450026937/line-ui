import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('avatar');

export default createComponent({
  functional : true,

  render(h, ctx) {
    return (
      <div
        class={bem()}
        {...ctx.data}
      >
        {ctx.slots()}
      </div>
    );
  },
});
