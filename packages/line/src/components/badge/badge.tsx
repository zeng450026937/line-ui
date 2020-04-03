import { useColor } from '@line-ui/line/src/mixins/use-color';
import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('badge');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useColor()],

  render() {
    return (
      <div class={bem()} on={this.$listeners}>
        {this.slots()}
      </div>
    );
  },
});
