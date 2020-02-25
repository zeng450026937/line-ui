import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { isDef } from '@/utils/helpers';

const [createComponent, bem] = createNamespace('title');

export default createComponent({
  mixins : [
    useColor(),
  ],

  props : {
    // large | small | default
    size : String,
  },

  render() {
    const { size } = this;
    return (
      <div
        class={bem({
          [size] : isDef(size),
        })}
      >
        <div class={bem('inner')}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
