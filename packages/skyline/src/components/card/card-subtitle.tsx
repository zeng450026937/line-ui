import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-subtitle');

export default /*#__PURE__*/ createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        role="heading"
        aria-level="3"
        class={[bem(), 'line-inherit-color']}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
