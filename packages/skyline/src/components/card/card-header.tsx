import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

const [createComponent, bem] = createNamespace('card-header');

export default createComponent({
  mixins : [useColor()],

  props : {
    translucent : Boolean,
  },

  render() {
    const { translucent } = this;
    return (
      <div
        class={[
          bem({ translucent }),
          'line-inherit-color',
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
