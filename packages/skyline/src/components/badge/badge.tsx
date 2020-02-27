import { useColor } from 'skyline/mixins/use-color';
import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('badge');

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
