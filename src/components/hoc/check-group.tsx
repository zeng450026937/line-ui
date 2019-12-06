import { createNamespace } from '@/utils/namespace';
import { useCheckGroupWithModel } from '@/mixins/use-check-group';

const [createComponent, bem] = createNamespace('check-group');

export default createComponent({
  mixins : [
    useCheckGroupWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()}>
        { this.slots() }
      </div>
    );
  },
});
