import { createNamespace } from '@/utils/namespace';
import { useCheckItemWithModel } from '@/mixins/use-check-item';

const [createComponent, bem] = createNamespace('check-item');

export default createComponent({
  mixins : [
    useCheckItemWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()} onClick={this.toggle}>
        { this.slots() }
      </div>
    );
  },
});
