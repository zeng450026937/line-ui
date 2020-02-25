import { createNamespace } from '@/utils/namespace';
import { isDef } from '@/utils/helpers';

const [createComponent, bem] = createNamespace('list');

export default createComponent({
  props : {
    // 'full' | 'inset' | 'none' | undefined
    lines : String,
    inset : Boolean,
  },

  render() {
    const { lines, inset = false } = this;
    return (
      <div
        class={bem({
          [`lines-${ lines }`] : isDef(lines),
          inset,
        })}
      >
        {this.slots()}
      </div>
    );
  },
});
