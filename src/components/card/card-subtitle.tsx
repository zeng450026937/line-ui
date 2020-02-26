import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';

const [createComponent, bem] = createNamespace('card-subtitle');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        role="heading"
        aria-level="3"
        class={[bem(), 'line-inherit-color']}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
