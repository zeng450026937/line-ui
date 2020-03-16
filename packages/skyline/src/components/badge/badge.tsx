import { useColor } from 'skyline/src/mixins/use-color';
import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('badge');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

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
