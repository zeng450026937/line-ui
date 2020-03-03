import { useColor } from 'skyline/mixins/use-color';
import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('badge');

export default /*#__PURE__*/ createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },

});
