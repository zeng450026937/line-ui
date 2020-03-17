import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import { isDef } from 'skyline/src/utils/helpers';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('list-header');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

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
