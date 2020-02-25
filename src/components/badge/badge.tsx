import { useColor } from '@/mixins/use-color';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('badge');

export default createComponent({
  mixins : [useColor()],

  props : {

  },

  render() {
    return (
      <div
        class={bem()}
      >
        {this.slots()}
      </div>
    );
  },

});
