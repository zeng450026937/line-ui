import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/mixins/use-group';
import { useOptions } from '@/mixins/use-options';
import '@/components/tab-bar/tab-bar.scss';

const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-bar');

export default createComponent({
  mixins : [useGroup(NAMESPACE), useOptions(['header', 'footer'], 'position')],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render(h, ctx) {
    const { position } = ctx;
    return (
      <div
        class={bem([position])}
      >
        {this.slots()}
      </div>
    );
  },
});
