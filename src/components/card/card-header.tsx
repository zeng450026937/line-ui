import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';

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
      >
        {this.slots()}
      </div>
    );
  },
});
