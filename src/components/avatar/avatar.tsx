import { createNamespace } from '@/utils/namespace';
import '@/components/avatar/avatar.scss';
import '@/components/avatar/avatar.ios.scss';

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
