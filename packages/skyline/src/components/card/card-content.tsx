import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-content');

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
