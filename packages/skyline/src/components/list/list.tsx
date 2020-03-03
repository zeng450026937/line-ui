import { createNamespace } from 'skyline/utils/namespace';
import { isDef } from 'skyline/utils/helpers';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('list');

export default /*#__PURE__*/ createComponent({
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
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
