import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { isDef } from '@/utils/helpers';

const [createComponent, bem] = createNamespace('list-header');

export default createComponent({
  mixins : [useColor()],

  props : {
    // 'full' | 'inset' | 'none' | undefined
    lines : String,
  },

  render() {
    const { lines } = this;
    return (
      <div
        class={bem({ [`lines-${ lines }`]: isDef(lines) })}
      >
        <div class="list-header-innerd">
          {this.slots()}
        </div>
      </div>
    );
  },
});
