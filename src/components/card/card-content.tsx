import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';

const [createComponent, bem] = createNamespace('card-content');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
