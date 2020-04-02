import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { isDef } from '@line-ui/line/src/utils/helpers';

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
