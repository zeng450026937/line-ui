import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

const [createComponent, bem] = createNamespace('card-content');

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
