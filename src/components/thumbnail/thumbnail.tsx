import { createNamespace } from '@/utils/namespace';
import '@/components/thumbnail/thumbnail.scss';

const [createComponent, bem] = createNamespace('thumbnail');

export default createComponent({
  functional : true,

  render(h, ctx) {
    return (
      <div
        class={bem()}
      >
        {ctx.slots()}
      </div>
    );
  },
});
