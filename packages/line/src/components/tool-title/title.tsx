import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { isDef } from '@line-ui/line/src/utils/helpers';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('title');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useColor()],

  props: {
    // large | small | default
    size: String,
  },

  render() {
    const { size } = this;
    return (
      <div
        class={bem({
          [size]: isDef(size),
        })}
        on={this.$listeners}
      >
        <div class={bem('inner')}>{this.slots()}</div>
      </div>
    );
  },
});
