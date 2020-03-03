import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { isDef } from 'skyline/utils/helpers';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('list-header');

export default /*#__PURE__*/ createComponent({
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
        on={this.$listeners}
      >
        <div class="list-header-innerd">
          {this.slots()}
        </div>
      </div>
    );
  },
});
